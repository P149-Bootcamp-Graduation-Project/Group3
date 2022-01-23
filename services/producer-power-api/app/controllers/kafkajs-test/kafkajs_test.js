//const { producer, consumer } = require("../../adapters/queue/kafkajs");

const { json } = require("express/lib/response");
const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: "group2-kafka_logs",
  brokers: ["kafka:9092"],  //["kafka:9092"]  server IP : "88.198.26.82:9092"
});

const{errToPostLogApi}=require('../../adapters/internal/err_logger');

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: "Patika-Inavitas-Group2",
});

let index = 0;
let incomingMessage = "";
let is_producer_conn = false;
let is_consumer_conn = false;
const TEST_WITH_CONSUMER = false;

async function createProducer(data) {
  try {
    if (!is_producer_conn) {
      console.log("Kafka js producer connect...");
      await producer.connect();
      console.log("Producer connect OK...");
      is_producer_conn = true;
    } else {
      const message_res = await producer.send({
        topic: "Group2-Power-Logs",
        messages: [
          {
            value:JSON.stringify(data),
            partition: 0,
          },
        ],
      });
    }
  } catch (error) {
    console.log("Error Producer ->:", error);
    const errData = {
      flag_type: 1,
      req_src: "producer-power-api",
      req_path: "/electricity",
      req_file: "kafkajs_test.js",
      req_line: 41,
      req_func: "createProducer",
      req_type: "Controller",
      req_raw: data,
      content_message: err.message,
      content_err: err,
      is_solved: 0,
      is_notified: 0,
      is_assgined: "name",
    };
    errToPostLogApi(errData);
  }
}

async function createConsumer() {
  try {
    if (!is_consumer_conn) {
      console.log("Kafka js consumer connect...");
      await consumer.connect();
      console.log("Consumer connect OK...");

      // Consumer Subscribe..
      await consumer.subscribe({
        topic: "Group2-Power-Logs",
        fromBeginning: true,
      });

      await consumer.run({
        eachMessage: async (result) => {
          incomingMessage = `Kafka Incoming Message : ${result.message.value}, Par => ${result.partition}`;
          console.log(incomingMessage);
        },
      });
      is_consumer_conn = true;
    }
  } catch (error) {
    console.log("Error Consumer --> :", error);
    const errData = {
      flag_type: 1,
      req_src: "producer-power-api",
      req_path: "/electricity",
      req_file: "kafkajs_test.js",
      req_line: 82,
      req_func: "createConsumer",
      req_type: "Controller",
      req_raw: '',
      content_message: err.message,
      content_err: err,
      is_solved: 0,
      is_notified: 0,
      is_assgined: "name",
    };
    errToPostLogApi(errData);
  }
}

createProducer();
if(TEST_WITH_CONSUMER)
  createConsumer();

const KafkaIndexGet = async (req, res) => {
  index++;
  await createProducer(index.toString()+".Test message...").then(async () => {
    if (TEST_WITH_CONSUMER) {
      await createConsumer().then(() => {
        res.send(index.toString() + "-Kafka incoming message :" + "<br>" + JSON.stringify(incomingMessage));
      });
    }
  });

  res.end();
};

const KafkaIndexPost = async (req, res) => {
  const obj = req.body;
 
 if (!obj) {
    console.log("Fill empty fields");
  }

  console.log("Golang Fake temp data :", obj);

  await createProducer(obj).then(async (data) => {
    if (TEST_WITH_CONSUMER) {
      await createConsumer().then(() => {
        res.send(JSON.stringify(incomingMessage));
      });
    }
  });

  res.end();
};


module.exports = {
  KafkaIndexPost,
  KafkaIndexGet,
};
