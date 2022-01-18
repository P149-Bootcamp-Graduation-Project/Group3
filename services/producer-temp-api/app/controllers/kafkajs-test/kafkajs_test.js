//const { producer, consumer } = require("../../adapters/queue/kafkajs");

const { json } = require("express/lib/response");
const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: "group2-kafka_logs",
  brokers: ["88.198.26.82:9092"],  //["kafka:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: "Patika-Inavitas-Group2",
});

let index = 0;
let incomingMessage = "";
let is_producer_conn = false;
let is_consumer_conn = false;

async function createProducer(data) {
  try {
    if (!is_producer_conn) {
      console.log("Kafka js producer connect...");
      await producer.connect();
      console.log("Producer connect OK...");
      is_producer_conn = true;
    } else {
      const message_res = await producer.send({
        topic: "Group2-Temp-Logs",
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
        topic: "Group2-Temp-Logs",
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
  }
}

createProducer();
createConsumer();

const KafkaIndexGet = async (req, res) => {
  index++;
  await createProducer(index.toString()+".Test message...").then(async () => {
    await createConsumer().then(() => {
      res.send(index.toString() + "-Kafka incoming message :" + "<br>" + JSON.stringify(incomingMessage));
    });
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
    await createConsumer().then(() => {
      res.send(JSON.stringify(incomingMessage));
    });
  });

  res.end();
};


module.exports = {
  KafkaIndexPost,
  KafkaIndexGet,
};
