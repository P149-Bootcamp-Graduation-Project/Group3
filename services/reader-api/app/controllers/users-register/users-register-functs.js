const { pg_client } = require("../../adapters/database/postgresql");

async function userDelete(user_data) {
  let queryToDo = "delete from group2.users where user_pass='" + user_data.user_pass + "' and email='" + user_data.email + "'";

  return await pg_client.query(queryToDo);
}

async function isExistUser(user_data) {
  let queryToDo =
    "select group2.users.id, group2.users.email, group2.users.user_pass from group2.users where user_pass='" +
    user_data.user_pass +
    "' and email='" +
    user_data.email +
    "'";

  return await pg_client.query(queryToDo);
}

module.exports = {
  userDelete,
  isExistUser,
};
