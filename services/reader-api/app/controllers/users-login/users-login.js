const { pg_client } = require("../../adapters/database/postgresql");
const { signAccessToken, signRefreshToken } = require("../../middleware/authentication");

const { errToPostLogApi } = require("../../adapters/internal/err_logger");

const usersLoginGet = (req, res) => {
  res.send("method get from /users/login index ...");
};

const usersLoginPost = async (req, res) => {
  const incoming_obj = req.body;

  if (!incoming_obj) {
    console.log("Fill empty fields");
    res.end();
  }
  const payload = {
    incoming_obj,
  };

  console.log("incomig post data :", incoming_obj);

  let queryToDo = "select  group2.users.id, group2.users.email, group2.users.user_pass from group2.users where user_pass='" +
    incoming_obj.user_pass +"' and email='" + incoming_obj.email +"'";

  await pg_client
    .query(queryToDo)
    .then(async (result) => {
      console.log("/users/login data is send postgreSql :", result.rows[0].id);

      if (result.rowCount === 1) {
        const accessToken = await signAccessToken(result.rows[0].id, incoming_obj);
        const refreshToken = await signRefreshToken(result.rows[0].id, incoming_obj);
        res.status(200).send({ accessToken, refreshToken });
      }
    })
    .catch((err) => {
      console.log("/users/login data is pqSQL send error : ", err);
      res.status(500).send(err);
      const errData = {
        flag_type: 1,
        req_src: "reader-api",
        req_path: "/",
        req_file: "users-login.js",
        req_line: 38,
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
    });

  res.end();
};

module.exports = {
  usersLoginGet,
  usersLoginPost,
};
