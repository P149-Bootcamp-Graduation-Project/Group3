const { pg_client } = require("../../adapters/database/postgresql");
const { rd_client } = require("../../adapters/database/redis");
const { errToPostLogApi } = require("../../adapters/internal/err_logger");


const classesGet = async (req, res) => {

  // the token is if  find in redis token list  then gets all classes.
  // If the token is invalid, the middleware terminates the request.

  const { refreshToken } = req.body;
  let userId = req.userId;  // from middleware 
  console.log("req.userId: ", userId);

  await rd_client.GET(userId.toString())
    .then(async (redis_res) => {
      console.log(redis_res);

      let rd_token = JSON.parse(redis_res);
      // the token is if  find in redis token list  then gets all classes.
      if (rd_token.token != null && rd_token.token == refreshToken) {
        //console.log("redis res :", rd_token.token, refreshToken);

        let queryToDo = "select  school_id, floor_num, class_name, detail, city_id, created_by, is_active from group2.classes where true";
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
        req_file: "classes.js",
        req_line: 31,
        req_func: "classesGetGet",
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

/*
{
  school_id: 1,
  floor_num: 2,
  class_name: "11A",
  detail: "Sayısal",
  city_id: 26,
  created_by: 1,
  is_active: 1,
}

*/

const classesPost = async (req, res) => {
  // the token is if  find in redis token list  then inser user to db .
  // If the token is invalid, the middleware terminates the request.
  const incoming_obj = req.body; //  user data for insert
  const { refreshToken } = req.body;
  let userId = req.userId;  // userId data is from token

  const db_obj = {
    school_id: incoming_obj.school_id,
    floor_num: incoming_obj.floor_num,
    class_name: incoming_obj.class_name,
    detail: incoming_obj.detail,
    city_id: incoming_obj.city_id,
    created_by: incoming_obj.created_by,
    is_active: incoming_obj.is_active,
  };

  //console.log("incomig post data :", incoming_obj, db_obj);

  const obj_to_arr = Object.values(db_obj);

  console.log("incomig post data :", incoming_obj, obj_to_arr);

  await rd_client.GET(userId.toString()).then(async (rd_res) => {
    console.log(rd_res);

    let rd_token = JSON.parse(rd_res);
    // the token is if  find in redis token list  then delete user.
    if (rd_token.token != null && rd_token.token == refreshToken) {
      let queryToDo = "insert into group2.classes (school_id, floor_num, class_name, detail, city_id, created_by, is_active)" +
        "values($1, $2, $3, $4, $5, $6, $7) RETURNING id";
      await pg_client.query(queryToDo, obj_to_arr)
        .then(async (result) => {
          console.log("/class data is send postgreSql :");
          if (result.rowCount === 1) {

            res.status(200).send({ message: "class data is insert DB." });
          }
        })
        .catch((err) => {
          console.log("/class data is pqSQL send error : ", err);
          res.status(500).send(err);
          const errData = {
            flag_type: 1,
            req_src: "reader-api",
            req_path: "/",
            req_file: "classes.js",
            req_line: 107,
            req_func: "classesGetPost",
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

const classesDelete = async (req, res) => {
  // the token is if  find in redis token list  then delete school.
  // If the token is invalid, the middleware terminates the request.
  const incoming_obj = req.body; // delete user data
  const { refreshToken } = req.body;
  let userId = req.userId;
  console.log("incomig post data :", incoming_obj);

  await rd_client.GET(userId.toString()).then(async (rd_res) => {
    //console.log(rd_res);
    let rd_token = JSON.parse(rd_res);
    // the token is if  find in redis token list  then delete school.
    if (rd_token.token != null && rd_token.token == refreshToken) {

      let queryToDo = "delete from group2.classes where class_name='" + incoming_obj.school_name + "'"+
                        "school_id='"+incoming_obj.school_id+"'";
      await pg_client.query(queryToDo).then((res_del)=>{
        if(res_del.rowCount>=1){
          res.status(200).send("class is delete ...");
        }else {
              res.status(500).send("class is not delete:" + res_delete.rowCount);
            }
      });
    }//if

  }); //await
  res.end();
};


const classesPatch = async (req, res) => {
  // the token is if  find in redis token list  then update class.
  // If the token is invalid, the middleware terminates the request.
  const incoming_obj = req.body;  // update user data
  const { refreshToken } = req.body;
  let userId = req.userId;
  console.log("incomig update data :", incoming_obj);

  const db_obj = {
    school_name: incoming_obj.school_name,
    detail: incoming_obj.detail,
    total_class: incoming_obj.total_class,
    created_by: incoming_obj.created_by,
    is_active: incoming_obj.is_active,
  };
  const obj_to_arr = Object.values(db_obj);

  await rd_client.GET(userId.toString()).then(async (rd_res) => {
    console.log(rd_res);

    let rd_token = JSON.parse(rd_res);
    // the token is if  find in redis token list  then update class.
    if (rd_token.token != null && rd_token.token == refreshToken) {
      let queryToDo ="update group2.classes set school_id=$1, floor_num=$2, class_name=$3, detail=$4," +
        " city_id=$5, created_by=$6, is_active=$7 where school_name='" +incoming_obj.school_name+ "'";

      await pg_client
        .query(queryToDo, obj_to_arr)
        .then((result) => {
          console.log("update :", result);
          res.status(200).send({message:"class is update ..."});
        })
        .catch((err) => {
          res.status(500).send("class is not update:" + err);
          const errData = {
            flag_type: 1,
            req_src: "reader-api",
            req_path: "/",
            req_file: "classes.js",
            req_line: 194,
            req_func: "classesGetPatch",
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
  classesGet,
  classesPost,
  classesDelete,
  classesPatch,
};
