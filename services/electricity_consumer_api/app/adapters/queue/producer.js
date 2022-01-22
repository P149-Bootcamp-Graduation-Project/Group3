//KAFKA CLIENT
//BU API'A DAHİL DEĞİL. LOCALDE TEST AMAÇLI OLUŞTURULDU
const kafka = require('kafka-node')
const Producer = kafka.Producer
const client = new kafka.KafkaClient({kafkaHost: '127.0.0.1:9092'})
const producer = new Producer(client)
const KeyedMessage = kafka.KeyedMessage
//const client = new kafka.KafkaClient({kafkaHost: '127.0.0.1:9092'});

const kafka_topic = 'topic30';

const payload = [{
    topic: kafka_topic,
    messages: [('a message', new KeyedMessage('keyed', 'a keyed message'))], // multi messages should be a array, single message can be just a string or a KeyedMessage instance
    key: 'theKey', // string or buffer, only needed when using keyed partitioner
    partition: 0, // default 0
    attributes: 2, // default: 0
    timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10+)
}];

//deneme
const abc = `{"status":"${process.argv[2]}","id":"${process.argv[3]}","sensor_data":"${process.argv[4]}","timestamp":"${process.argv[5]}"}`
console.log(abc)

producer.on('ready', async function(){
    producer.send([{ topic: kafka_topic, partition: 0, messages: [new KeyedMessage('key', abc)], attributes: 0 }], (err, data) => {
        if (err){
            console.log('kafka-producer -> '+kafka_topic+' kafka topic error'+ err)
        } else {
            console.log('kafka-producer -> '+kafka_topic+' kafka topic success '+ data)
        }

        process.exit(0)
    })
})
producer.on('error', function (err) {
    console.log(err)
    console.log('kafka-producer -> '+kafka_topic+' kafka connection error')
    throw err;
})
console.log("::> Kafka Server is Ready")

