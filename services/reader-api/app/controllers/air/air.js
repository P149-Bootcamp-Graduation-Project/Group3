const { rd_client } = require("../../adapters/database/redis");
const { errToPostLogApi } = require("../../adapters/internal/err_logger");

const airGet = async (req, res) => {
  // the token is if  find in redis token list  then gets temperature data from redis db.
  // If the token is invalid, the middleware terminates the request.

  const { refreshToken } = req.body;
  let userId = req.userId; // from middleware
  let lastEl=req.lastEl;
  console.log("req.userId: ", userId);

  await rd_client.GET(userId.toString())
  .then(async (redis_res) => {
    console.log(redis_res);

    let rd_token = JSON.parse(redis_res);
    // the token is if  find in redis token list  then gets temperature data from redis db.
    if (rd_token.token != null && rd_token.token == refreshToken) {
      await rd_client.LRANGE("air-group2", -1,(-1)*lastEl)  // key, start, end = ..., -1, -10 => last 10 elements
      .then((res_rd)=>{
        res.status(200).send(res_rd);
      });
    }
  })
  .catch((err) => {
    console.log(err);
    res.send("user not found");
    res.end();
    const errData = {
      flag_type: 1,
      req_src: "reader-api",
      req_path: "/",
      req_file: "air.js",
      req_line: 26,
      req_func: "airGet",
      req_type: "Controller",
      req_raw: req.body,
      content_err: err,
      content_message: err.message,
      is_solved: 0,
      is_notified: 0,
      is_assgined: "name",
    };
    errToPostLogApi(errData);
  });
};

module.exports = {
  airGet,
};
