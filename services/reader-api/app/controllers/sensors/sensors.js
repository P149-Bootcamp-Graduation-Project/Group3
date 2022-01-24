const { pg_client } = require("../../adapters/database/postgresql");
const { rd_client } = require("../../adapters/database/redis");
const { errToPostLogApi } = require("../../adapters/internal/err_logger");


const sensorsGet = async (req, res) => {

  // the token is if  find in redis token list  then gets all sensors.
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

        let queryToDo = "select  school_id, class_id, sensor_name, detail, default_protocol, default_ip, default_port, "+
                        "defafult_channel, created_by, is_online, is_active from group2.sensors where true";
        pg_client.query(queryToDo).then((pg_res) => {
          res.status(200).send(pg_res.rows);
          res.end();
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send("sensor not found");
      res.end();
      const errData = {
        flag_type: 1,
        req_src: "reader-api",
        req_path: "/",
        req_file: "sensors.js",
        req_line: 36,
        req_func: "sensorsGet",
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

/* sensors sample data is insert db.
{
   "school_id": 1,
    "class_id": 1,
    "sensor_name": "TDA2550",
    "detail": "C temp value",
    "default_protocol": "ModBus",
    "default_ip": "127.0.0.1",
    "default_port": "1200",
    "defafult_channel": "5",
    "created_by": "1",
    "is_online": 1,
    "is_active": 1
}

*/

const sensorsPost = async (req, res) => {
  // the token is if  find in redis token list  then inser user to db .
  // If the token is invalid, the middleware terminates the request.
  const incoming_obj = req.body; //  user data for insert
  const { refreshToken } = req.body;
  let userId = req.userId;  // userId data is from token

  const db_obj = {
    school_id: incoming_obj.school_id,
    class_id: incoming_obj.class_id,
    sensor_name: incoming_obj.sensor_name,
    detail: incoming_obj.detail,
    default_protocol: incoming_obj.default_protocol,
    default_ip: incoming_obj.default_ip,
    default_port:incoming_obj. default_port,
    defafult_channel:incoming_obj.defafult_channel,
    created_by:incoming_obj.created_by,
    is_online:incoming_obj.is_online,
    is_active:incoming_obj.is_active,

  };

  //console.log("incomig post data :", incoming_obj, db_obj);

  const obj_to_arr = Object.values(db_obj);

  console.log("incomig post data :", incoming_obj, obj_to_arr);

  await rd_client.GET(userId.toString()).then(async (rd_res) => {
    console.log(rd_res);

    let rd_token = JSON.parse(rd_res);
    // the token is if  find in redis token list  then delete user.
    if (rd_token.token != null && rd_token.token == refreshToken) {
      let queryToDo = "insert into group2.sensors (school_id, class_id, sensor_name, detail, default_protocol, "+ 
                      "default_ip, default_port, defafult_channel, created_by, is_online, is_active)" +
                      "values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id";
      await pg_client.query(queryToDo, obj_to_arr)
        .then(async (result) => {
          console.log("/sensors data is send postgreSql :");
          if (result.rowCount === 1) {

            res.status(200).send({ message: "sensors data is insert DB." });
          }
        })
        .catch((err) => {
          console.log("/sensors data is pqSQL send error : ", err);
          res.status(500).send(err);
          const errData = {
            flag_type: 1,
            req_src: "reader-api",
            req_path: "/",
            req_file: "sensors.js",
            req_line: 36,
            req_func: "sensorsPost",
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
        });
    }
  });

};

const sensorsDelete = async (req, res) => {
  // the token is if  find in redis token list  then delete sensors.
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

      let queryToDo = "delete from group2.sensors where sensor_name='" + incoming_obj.sensor_name_name + "'";
      await pg_client.query(queryToDo).then((res_del)=>{
        if(res_del.rowCount>=1){
          res.status(200).send("sensors is delete ...");
        }else {
              res.status(500).send("sensors is not delete:" + res_delete.rowCount);
            }
      });
    }//if

  }); //await
  res.end();
};


const sensorsPatch = async (req, res) => {
  // the token is if  find in redis token list  then update school.
  // If the token is invalid, the middleware terminates the request.
  const incoming_obj = req.body;  // update user data
  const { refreshToken } = req.body;
  let userId = req.userId;
  console.log("incomig update data :", incoming_obj);

  const db_obj = {
    school_id: incoming_obj.school_id,
    class_id: incoming_obj.class_id,
    sensor_name: incoming_obj.sensor_name,
    detail: incoming_obj.detail,
    default_protocol: incoming_obj.default_protocol,
    default_ip: incoming_obj.default_ip,
    default_port:incoming_obj. default_port,
    defafult_channel:incoming_obj.defafult_channel,
    created_by:incoming_obj.created_by,
    is_online:incoming_obj.is_online,
    is_active:incoming_obj.is_active,

  };
  const obj_to_arr = Object.values(db_obj);

  await rd_client.GET(userId.toString()).then(async (rd_res) => {
    console.log(rd_res);

    let rd_token = JSON.parse(rd_res);
    // the token is if  find in redis token list  then update user.
    if (rd_token.token != null && rd_token.token == refreshToken) {
      let queryToDo ="update group2.sensors set school_id=$1, class_id=$2, sensor_name=$3, detail=$4," +
        " default_protocol=$5, default_ip=$6, default_port=$7, defafult_channel=$8, created_by=$9, is_online=$10, is_active=$11"+
        " where school_name='" +incoming_obj.sensor_name+ "'";

      await pg_client
        .query(queryToDo, obj_to_arr)
        .then((result) => {
          console.log("update :", result);
          res.status(200).send({message:"sensor is update ..."});
        })
        .catch((err) => {
          res.status(500).send("sensor is not update:" + err);
          const errData = {
            flag_type: 1,
            req_src: "reader-api",
            req_path: "/",
            req_file: "sensors.js",
            req_line: 213,
            req_func: "sensorsPatch",
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
        });
    }
  });


};

module.exports = {
  sensorsGet,
  sensorsPost,
  sensorsDelete,
  sensorsPatch,
};
