const { mongo_client } = require("../../adapters/database/mongodb");
const { errToPostLogApi } = require("../../adapters/internal/err_logger");

const db = mongo_client.db("group2");

/* sample data for errlog 
    {
      flag_type: 1,     // 
      req_src: "consumer-air-api",
      req_path: "/",
      req_file: "consumer.js",
      req_line: 32,
      req_func: "consumerOn",
      req_type: "Controller",
      content_message: err.message,
      content_err: err,
      is_solved: 0,
      is_notified: 0,
      is_assigned: "name",
  };
*/

const errlogGet = async (req, res) => {
  // the token is if  find in redis token list  then gets error logs data from mongodb.
  // If the token is invalid, the middleware terminates the request.
 
  const { refreshToken } = req.body;
  let userId = req.userId; // from middleware

  console.log("req.userId: ", userId);

  await rd_client
    .GET(userId.toString())
    .then(async (redis_res) => {
      console.log(redis_res);

      let rd_token = JSON.parse(redis_res);
      // the token is if  find in redis token list  then gets errlog data from mongodb.
      if (rd_token.token != null && rd_token.token == refreshToken) {

        const query = { is_solved: 0 };

        await db.collection("errorLog").find(query).toArray()
          .then((result) => {
            res.status(200).send(result);
          })
          .catch((err) => {
            res.send(err);
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
        req_file: "errlog.js",
        req_line: 57,
        req_func: "errlogGet",
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

const errlogPatch = async (req, res) => {
  const { refreshToken } = req.body;
  let userId = req.userId; // from middleware


  console.log("req.userId: ", userId);

  await rd_client
    .GET(userId.toString())
    .then(async (redis_res) => {
      console.log(redis_res);

      let rd_token = JSON.parse(redis_res);
      // the token is if  find in redis token list  then update errlog data to mongodb.
      if (rd_token.token != null && rd_token.token == refreshToken) {

        const query = { $and: [{is_solved: 0} ,{is_assigned:"name"} ]};
        const newvalues = { $set: {is_solved: 1} };

        await db.collection("errorLog").updateOne(query, newvalues)
          .then((result) => {
            res.status(200).send(result);
          })
          .catch((err) => {
            res.send(err);
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
        req_file: "errlog.js",
        req_line: 104,
        req_func: "errlogPatch",
        req_type: "Controller",
        req_raw: req.body,
        content_err: err,
        content_message: err.message,
        is_solved: 0,
        is_notified: 0,
        is_assgined: "name",
      };
      errToPostLogApi(errData)
    });

};

module.exports = {
  errlogGet,
  errlogPatch,
};
