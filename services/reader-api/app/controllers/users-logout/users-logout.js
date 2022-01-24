const { rd_client } = require("../../adapters/database/redis");
const { errToPostLogApi } = require("../../adapters/internal/err_logger");

const usersLogoutGet = async (req, res) => {
  res.send("method get from /users/logout index ...");
};

const usersLogoutPost = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    let userId = req.userId;
    console.log("req.userId: ", userId);

    await rd_client.GET(userId.toString())
      .then(async (redis_res) => {
        console.log(redis_res);

        let rd_token = JSON.parse(redis_res);

        if (rd_token.token!=null && rd_token.token == refreshToken) {
          console.log("redis res :", rd_token.token, refreshToken);

          await rd_client.DEL(userId.toString())
            .then((res_del) => {
              console.log("res_del :",res_del);
              res.send({message: 'User logout'});
              res.end();
            })
            .catch((err) => {
              console.log(err.message);

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
          req_file: "users-logout.js",
          req_line: 36,
          req_func: "usersLogoutPost",
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

  } catch (error) {
    console.log(error);
    res.send("user not found");
    const errData = {
      flag_type: 1,
      req_src: "reader-api",
      req_path: "/",
      req_file: "users-logout.js",
      req_line: 66,
      req_func: "usersLoginPost",
      req_type: "Controller",
      req_raw: req.body,
      content_err: err,
      content_message: err.message,
      is_solved: 0,
      is_notified: 0,
      is_assgined: "name",
    };
    errToPostLogApi(errData);
  }
};

module.exports = {
  usersLogoutGet,
  usersLogoutPost,
};
