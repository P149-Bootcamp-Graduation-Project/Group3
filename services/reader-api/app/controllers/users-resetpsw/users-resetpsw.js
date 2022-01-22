const { pg_client } = require("../../adapters/database/postgresql");
const { sendMail } = require("./send-mail");

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
    });

  res.end();
};

module.exports = {
  usersResetPswGet,
  usersResetPswPost,
};
