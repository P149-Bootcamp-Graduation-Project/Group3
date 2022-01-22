const { pg_client } = require("../../adapters/database/postgresql");
const { userDelete, isExistUser } = require("./users-register-functs");
const { signAccessToken, verifyAccessToken, signRefreshToken } = require("../../middleware/authentication");

const usersRegisterGet = (req, res) => {
  res.send("method get from /users/register index ...");
};

const usersRegisterPost = async (req, res) => {
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
      let queryToDo = "insert into group2.users (user_title, user_name, user_pass, email, phone, is_active)" +
           "values($1, $2, $3, $4, $5, $6) RETURNING id";
      await pg_client
        .query(queryToDo, obj_to_arr)
        .then(async (result) => {
          console.log("/users/register data is send postgreSql :", result.rows[0].id);
          if (result.rowCount === 1) {
            const accessToken = await signAccessToken(result.rows[0].id);
            const refreshToken = await signRefreshToken(result.rows[0].id);
            res.status(200).send({ accessToken, refreshToken });
          }
        })
        .catch((err) => {
          console.log("/users/register data is pqSQL send error : ", err);
          res.status(500).send(err);
        });
    }
  });

  res.end();
};

const usersRegisterDelete = async (req, res) => {
  const incoming_obj = req.body;
  if (!incoming_obj) {
    console.log("Fill empty fields");
    res.end();
  }

  console.log("incomig post data :", incoming_obj);

  let queryToDo =
    "select group2.users.email, group2.users.user_pass from group2.users where user_pass='" +
    incoming_obj.user_pass +
    "' and email='" +
    incoming_obj.email +
    "'";

  await pg_client
    .query(queryToDo)
    .then(async (result) => {
      console.log("/users/register data is ok :", result);

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
    });

  res.end();
};

const usersRegisterPatch = async (req, res) => {
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
  const obj_to_arr = Object.values(db_obj);

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
    });
};

module.exports = {
  usersRegisterGet,
  usersRegisterPost,
  usersRegisterDelete,
  usersRegisterPatch,
};
