const { pg_client } = require("../../adapters/database/postgresql");
const { sendMail } = require("./send-mail");
const { errToPostLogApi } = require("../../adapters/internal/err_logger");

const usersResetPswGet = (req, res) => {
  res.send("method get from /users/rstpsw index ...");
};

const usersResetPswPost = async (req, res) => {
  const incoming_obj = req.body;

  if (!incoming_obj) {
    console.log("Fill empty fields");
    res.end();
  }

  console.log("incomig post data :", incoming_obj);

  let queryToDo = "select group2.users.email, group2.users.user_pass from group2.users where email='" + incoming_obj.email + "'";

  await pg_client
    .query(queryToDo)
    .then((result) => {
      console.log("/users/login data is ok :", result);
      if (sendMail(incoming_obj.mail, "test")) res.status(200).send("Send reset password link your mail.");
      else res.status(500).send(false);
    })
    .catch((err) => {
      console.log("/users/login error : ", err);
      res.status(500).send(err);
      const errData = {
        flag_type: 1,
        req_src: "reader-api",
        req_path: "/",
        req_file: "users-resetpsw.js",
        req_line: 28,
        req_func: "usersResetPswPost",
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
  usersResetPswGet,
  usersResetPswPost,
};
