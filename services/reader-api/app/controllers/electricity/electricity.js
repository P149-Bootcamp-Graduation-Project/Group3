const { rd_client } = require("../../adapters/database/redis");

const powerGet = async (req, res) => {
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
      await rd_client.LRANGE("power-group2", -1,(-1)*lastEl)  // key, start, end = ..., -1, -10 => last 10 elements
      .then((res_rd)=>{
        res.status(200).send(res_rd);
      });
    }
  })
  .catch((err) => {
    console.log(err);
    res.send("user not found");
    res.end();
  });
};

module.exports = {
  powerGet,
};
