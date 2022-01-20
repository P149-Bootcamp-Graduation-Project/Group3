const errorCatch = require('../../middleware/errorMiddleware')
const kafka = require('kafka-node')
const { pg_client } = require("../database/postgresql")
const Consumer = kafka.Consumer
const Offset = kafka.Offset
const client = new kafka.KafkaClient({kafkaHost: '127.0.0.1:9092'})

const consumer = new Consumer(
    client,
    [
        { topic: 'topic3', partition: 0 }
        ],
    {
        autoCommit: true
    }
)

const offset = new Offset(client)

exports.consumerOn = async () => {
    consumer.on('message',async (message) => {
        console.log(message)
        const deger = JSON.parse(message.value)
        //okul ve sınıf id daha güzel bir şekilde eklenecek.
        await pg_client.query(`insert into log_temperature(school_id,class_id,sensor_id,sensor_data,read_at) 
                        values((select school_id from sensors where id=${Number(deger.id)}),(select sensors.class_id from sensors where id=${Number(deger.id)}), ${Number(deger.id)} ,${Number(deger.sensor_data)} ,to_timestamp(${Number(deger.timestamp)} / 1000.0) )`)
            .then(()=>{console.log("Sıcaklık Eklendi")})
            .catch((err)=>{
                err.hataKodu=404
                errorCatch(err)
            })

    })

    consumer.on('error',  async (err) => {
        errorCatch(err)
    })

    consumer.on('offsetOutOfRange', async (topic) => {
        topic.maxNum = 2
        offset.fetch([topic], async (err, offsets) => {
            if (err) {
                errorCatch(err)
            }
            const min = Math.min.apply(null, offsets[topic.topic][topic.partition])
            consumer.setOffset(topic.topic, topic.partition, min)
        })
    })
}

