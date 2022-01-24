const { pg_client } = require("../../adapters/database/postgresql");
const { rd_client } = require("../../adapters/database/redis");
const { userDelete, isExistUser } = require("./users-register-functs");
const { signAccessToken, signRefreshToken } = require("../../middleware/authentication");

const { errToPostLogApi } = require("../../adapters/internal/err_logger");

const usersRegisterGet = async (req, res) => {
  // the token is if  find in redis token list  then gets all users.
  // If the token is invalid, the middleware terminates the request.

  const { refreshToken } = req.body;
  let userId = req.userId; // from middleware
  console.log("req.userId: ", userId);

  await rd_client
    .GET(userId.toString())
    .then(async (redis_res) => {
      console.log(redis_res);

      let rd_token = JSON.parse(redis_res);
      // the token is if  find in redis token list  then gets all users.
      if (rd_token.token != null && rd_token.token == refreshToken) {
        //console.log("redis res :", rd_token.token, refreshToken);

        let queryToDo =
          "select  group2.users.user_title, group2.users.user_name, group2.users.email, group2.users.phone from group2.users where true";
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
      const errData = {
        flag_type: 1,
        req_src: "reader-api",
        req_path: "/",
        req_file: "users-register.js",
        req_line: 34,
        req_func: "usersRegisterGet",
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

  // res.send("method get from /users/register index ...");
};

/* sample data
  {
     "user_title": "Md Yrd",
    "user_name": "Hasan SARI",
    "user_pass": "456",
    "email": "hasansari@gmail.com",
    "phone": "0312 1111111",
    "is_active": 1,
  }
*/

const usersRegisterPost = async (req, res) => {
  // If there is no user, it creates a new user according to the information received in the request.
  // It generates and sends tokens according to the user.

  const incoming_obj = req.body;

  if (!incoming_obj) {
    console.log("Fill empty fields");
    res.end();
  }

  const db_obj = {
    user_title: incoming_obj.user_title,
    user_name: incoming_obj.user_name,
    user_pass: incoming_obj.user_pass,
    email: incoming_obj.email,
    phone: incoming_obj.phone,
    is_active: incoming_obj.is_active,
  };

  //console.log("incomig post data :", incoming_obj, db_obj);

  const obj_to_arr = Object.values(db_obj);

  await isExistUser(incoming_obj).then(async (result) => {
    // console.log("result :", result);
    if (result.rowCount >= 1) {
      console.log("exist user : ", result.rows[0].id);
      res.status(200).send({
        message: "user is exist",
      });
      res.end();
    } else {
      let queryToDo =
        "insert into group2.users (user_title, user_name, user_pass, email, phone, is_active)" + "values($1, $2, $3, $4, $5, $6) RETURNING id";
      await pg_client
        .query(queryToDo, obj_to_arr)
        .then(async (result) => {
          console.log("/users/register data is send postgreSql :", result.rows[0].id);
          if (result.rowCount === 1) {
            const accessToken = await signAccessToken(result.rows[0].id, db_obj);
            const refreshToken = await signRefreshToken(result.rows[0].id, db_obj);
            res.status(200).send({
              accessToken,
              refreshToken,
            });
          }
        })
        .catch((err) => {
          console.log("/users/register data is pqSQL send error : ", err);
          res.status(500).send(err);
          const errData = {
            flag_type: 1,
            req_src: "reader-api",
            req_path: "/",
            req_file: "users-register.js",
            req_line: 118,
            req_func: "usersRegisterPost",
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
    }
  });

  res.end();
};

const usersRegisterDelete = async (req, res) => {
  // the token is if  find in redis token list  then delete user.
  // If the token is invalid, the middleware terminates the request.
  const incoming_obj = req.body; // delete user data
  const { refreshToken } = req.body;
  let userId = req.userId;
  console.log("incomig post data :", incoming_obj);

  await rd_client.GET(userId.toString()).then(async (rd_res) => {
    console.log(rd_res);

    let rd_token = JSON.parse(rd_res);
    // the token is if  find in redis token list  then delete user.
    if (rd_token.token != null && rd_token.token == refreshToken) {
      let queryToDo =
        "select group2.users.email, group2.users.user_pass from group2.users where user_pass='" +
        incoming_obj.user_pass +
        "' and email='" +
        incoming_obj.email +
        "'";

      await pg_client
        .query(queryToDo) //is exist user
        .then(async (result) => {
          console.log("/users/register delete data is ok :", result);

          await userDelete(incoming_obj).then((res_delete) => {
            console.log("res_delete : ", res_delete);
            if (res_delete.rowCount === 1) {
              res.status(200).send("user is delete ...");
            } else {
              res.status(500).send("user is not delete:" + res_delete.rowCount);
            }
          });
        })
        .catch((err) => {
          console.log("/users/register error : ", err);
          res.status(500).send(err);
          const errData = {
            flag_type: 1,
            req_src: "reader-api",
            req_path: "/",
            req_file: "users-register.js",
            req_line: 179,
            req_func: "usersRegisterDelete",
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
    }
  });
  res.end();
};

const usersRegisterPatch = async (req, res) => {
  // the token is if  find in redis token list  then update user.
  // If the token is invalid, the middleware terminates the request.
  const incoming_obj = req.body; // update user data
  const { refreshToken } = req.body;
  let userId = req.userId;
  console.log("incomig update data :", incoming_obj);

  const db_obj = {
    user_title: incoming_obj.user_title,
    user_name: incoming_obj.user_name,
    user_pass: incoming_obj.user_pass,
    email: incoming_obj.email,
    phone: incoming_obj.phone,
    is_active: incoming_obj.is_active,
  };
  const obj_to_arr = Object.values(db_obj);

  await rd_client.GET(userId.toString()).then(async (rd_res) => {
    console.log(rd_res);

    let rd_token = JSON.parse(rd_res);
    // the token is if  find in redis token list  then update user.
    if (rd_token.token != null && rd_token.token == refreshToken) {
      let queryToDo =
        "update group2.users set user_title=$1, user_name=$2, user_pass=$3, email=$4," +
        " phone=$5, is_active=$6 where user_pass='" +
        incoming_obj.user_pass +
        "' and email='" +
        incoming_obj.email +
        "'";

      await pg_client
        .query(queryToDo, obj_to_arr)
        .then((result) => {
          console.log("update :", result);
          res.status(200).send("user is update ...");
        })
        .catch((err) => {
          res.status(500).send("user is not update:" + err);
          const errData = {
            flag_type: 1,
            req_src: "reader-api",
            req_path: "/",
            req_file: "users-register.js",
            req_line: 242,
            req_func: "usersRegisterPatch",
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
    }
  });
};

module.exports = {
  usersRegisterGet,
  usersRegisterPost,
  usersRegisterDelete,
  usersRegisterPatch,
};
