const errorCatch = require('../../middleware/errorMiddleware')
const kafka = require('kafka-node')
const { pg_client } = require("../database/postgresql")
const Consumer = kafka.Consumer
const Offset = kafka.Offset
const client = new kafka.KafkaClient({kafkaHost: '127.0.0.1:9092'})
const { rd_client }  = require('../database/redis')

const consumer = new Consumer(
    client,
    [
        { topic: 'Group2-Air-Logs', partition: 0 }
        ],
    {
        groupId: 'group2-kafka-consumers',
        autoCommit: true
    }
)

const offset = new Offset(client)

exports.consumerOn = async () => {
    console.log("ConsumerOn Ready!!")
    consumer.on('message',async (message) => {
        console.log(message)
        const deger = JSON.parse(message.value)
        console.log(deger)
        //okul ve sınıf id daha güzel bir şekilde eklenecek.
        await pg_client.query(`insert into log_air_quality(school_id,class_id,sensor_id,sensor_data,read_at) 
                        values((select school_id from sensors where id=${Number(deger.id)}),(select class_id from sensors where id=${Number(deger.id)}), ${Number(deger.id)} ,${Number(deger.sensor_data)} ,to_timestamp(${Number(deger.timestamp)} / 1000.0) ) 
                        RETURNING id,school_id,class_id,sensor_id,sensor_data,read_at,created_at`)
            .then((result)=>{
                rd_client.set(`group2_air_${result.rows[0].id}`,JSON.stringify(result.rows[0])).then((message)=>{
                    console.log("keys: ",message)
                }).catch((err)=>{
                    const errData = {
                        flag_type: 1,
                        req_src: "consumer-air-api",
                        req_path: "/",
                        req_file: "consumer.js",
                        req_line: 32,
                        req_func: "consumerOn",
                        req_type: "Controller",
                        content_message: err.message,
                        content_err: err,
                        is_solved: 0,
                        is_notified: 0,
                        is_assigned: "name",
                    };
                    errorCatch(errData)
                })
                console.log("Sıcaklık Eklendi")
            })
            .catch((err)=>{
                const errData = {
                    flag_type: 1,
                    req_src: "consumer-air-api",
                    req_path: "/",
                    req_file: "consumer.js",
                    req_line: 28,
                    req_func: "consumerOn",
                    req_type: "Controller",
                    content_message: err.message,
                    content_err: err,
                    is_solved: 0,
                    is_notified: 0,
                    is_assigned: "name",
                };
                errorCatch(errData)
            })

    })

    consumer.on('error',  async (err) => {
        const errData = {
            flag_type: 1,
            req_src: "consumer-air-api",
            req_path: "/",
            req_file: "consumer.js",
            req_line: 73,
            req_func: "consumerOn",
            req_type: "Controller",
            content_message: err.message,
            content_err: err,
            is_solved: 0,
            is_notified: 0,
            is_assigned: "name",
        };
        errorCatch(errData)
    })

    consumer.on('offsetOutOfRange', async (topic) => {
        topic.maxNum = 2
        offset.fetch([topic], async (err, offsets) => {
            if (err) {
                const errData = {
                    flag_type: 1,
                    req_src: "consumer-air-api",
                    req_path: "/",
                    req_file: "consumer.js",
                    req_line: 91,
                    req_func: "consumerOn",
                    req_type: "Controller",
                    content_message: err.message,
                    content_err: err,
                    is_solved: 0,
                    is_notified: 0,
                    is_assigned: "name",
                };
                errorCatch(errData)
            }
            const min = Math.min.apply(null, offsets[topic.topic][topic.partition])
            consumer.setOffset(topic.topic, topic.partition, min)
        })
    })
}