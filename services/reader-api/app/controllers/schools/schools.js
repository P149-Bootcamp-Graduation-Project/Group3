const { pg_client } = require("../../adapters/database/postgresql");


const schoolsGet = async (req, res) => {

  // the token is if  find in redis token list  then gets all schools.
  // If the token is invalid, the middleware terminates the request.

  const { refreshToken } = req.body;
  let userId = req.userId;  // from middleware
  console.log("req.userId: ", userId);

  await rd_client.GET(userId.toString())
  .then(async (redis_res) => {
    console.log(redis_res);

    let rd_token = JSON.parse(redis_res);
    // the token is if  find in redis token list  then gets all schools.
    if (rd_token.token != null && rd_token.token == refreshToken) {
      //console.log("redis res :", rd_token.token, refreshToken);

      let queryToDo ="select  school_name, detail, city_id, total_class, create_at, created_by, is_active from group2.schools where true";
      pg_client.query(queryToDo).then((pg_res) => {
        res.status(200).send(pg_res.rows);
        res.end();
      });
    }
  })
  .catch((err) => {
    console.log(err);
    res.send("user not found");
    res.end();
  });
 
};

const schoolsPost = async (req, res) => {
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
  schoolsGet,
  schoolsPost,
};
