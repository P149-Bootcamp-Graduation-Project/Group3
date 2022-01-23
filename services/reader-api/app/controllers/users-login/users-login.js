const { pg_client } = require("../../adapters/database/postgresql");
const { signAccessToken, verifyAccessToken, signRefreshToken } = require("../../middleware/authentication");

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
        const accessToken = await signAccessToken(result.rows[0].id);
        const refreshToken = await signRefreshToken(result.rows[0].id);
        res.status(200).send({ accessToken, refreshToken });
      }
    })
    .catch((err) => {
      console.log("/users/login data is pqSQL send error : ", err);
      res.status(500).send(err);
    });

  res.end();
};

module.exports = {
  usersLoginGet,
  usersLoginPost,
};
