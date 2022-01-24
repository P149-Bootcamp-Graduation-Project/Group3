const {rd_client}=require('../../adapters/database/redis');
const { pg_client } = require("../../adapters/database/postgresql");

const fakePowerGet = (req, res) => {
    res.send("method get from electircity index");
  };

  const fakePowerPost= async (req, res) => {
    const incoming_obj= req.body;
    if (!incoming_obj) {
      console.log("Fill empty fields");
      res.end();
    }

    const db_obj = {
      school_id: 0,
      class_id: 1,
      sensor_id: incoming_obj.id,
      sensor_data: incoming_obj.sensor_data,
      read_at: new Date(parseInt(incoming_obj.time_stamp)),
      // create_at: Date.now().toLocaleString(),
    };

    console.log("incomig post data power:", incoming_obj, db_obj);

    const obj_to_arr = Object.values(db_obj);

    let queryToDo ="insert into group2.log_electricity_consumption (school_id,  class_id, sensor_id, sensor_data, read_at)" + 
            "values($1, $2, $3, $4, $5)";
    await pg_client.query(queryToDo, obj_to_arr )
      .then((result) => {
        console.log("Electricity log data is send postgreSql :", result);
      })
      .catch((err) => {
        console.log("Electricity log data is pqSQL send error : ", err);
      });


    await rd_client.LPUSH('power-group2',JSON.stringify(db_obj))
    .then((res)=>{
      console.log('power redis result:',res);
    }).catch((err)=>{
      console.log('power redis error: ',err);
    });


    res.send(incoming_obj);
  };

  module.exports = {
    fakePowerGet ,
    fakePowerPost
  };
  