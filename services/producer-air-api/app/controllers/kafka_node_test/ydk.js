//KAFKA CLIENT
// const kafka = require("kafka-node"),
//   Producer = kafka.Producer,
//   client = new kafka.KafkaClient({ kafkaHost: "kafka:9092" }), //127.0.0.1
//   producer = new Producer(client);

// let is_ready_kafka_node=false;

// const kafka_topic = "Logs";
// console.log(kafka_topic);

// let payload = [
//   {
//     topic: kafka_topic,
//     messages: ["message body"], // multi messages should be a array, single message can be just a string or a KeyedMessage instance
//     key: "theKey", // string or buffer, only needed when using keyed partitioner
//     partition: 0, // default 0
//     attributes: 2, // default: 0
//     timestamp: Date.now(), // <-- defaults to Date.now() (only available with kafka v0.10+)
//   },
// ];

// try {
//   producer.on("ready", async function () {
//     console.log("::> Kafka Server is Ready");
//     is_ready_kafka_node=true;
//   });

//   producer.on("error", function (err) {
//     console.log(err);
//     console.log("kafka-producer -> " + kafka_topic + " kafka connection error");
//     throw err;
//   });
// } catch (error) {
//   console.log(error);
// }

const KafkaNodeIndexGet = (req, res) => {
  index++;
  console.log("Kafka Node Test running...:");

  //   let push_status = producer.send(payload, (err, data) => {
  //     if (err) {
  //       console.log("kafka-producer -> " + kafka_topic + " kafka topic error" + err);
  //     } else {
  //       console.log("kafka-producer -> " + kafka_topic + " kafka topic success");

  //     }
  //   });

  res.send(index.toString() + "-Kafka Node Test running...:" + "<br>");

  res.end();
};

const KafkaNodeIndexPost = async (req, res) => {
  const obj = req.body;
  if (!obj) {
    console.log("Fill empty fields");
  }
  index++;

  res.send("post...");

  res.end();
};

module.exports = {
  KafkaNodeIndexGet,
  KafkaNodeIndexPost,
};
