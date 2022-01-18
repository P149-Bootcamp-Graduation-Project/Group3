//KAFKA CLIENT
const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "kafka:9092" }); //127.0.0.1  "kafka:9092"

const admin = new kafka.Admin(client);

const Producer = kafka.Producer;
const producer = new Producer(client, { requireAcks: 1 }); 

const kafka_topic = "Logs";
console.log(kafka_topic);

const Consumer = kafka.Consumer;
const Offset = kafka.Offset;
const topics = [{ topic: kafka_topic, partition: 1 }];
const options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };
var consumer = new Consumer(client, topics, options);

let is_ready_kafka_node = false;
let index = 0;

const createTopicsList = [
  {
    topic: kafka_topic,
    partitions: 1,
    replicationFactor: 1,
  },
];


try {

  // if (is_ready_kafka_node) {
  //   //   consumer.on("message", function (message) {
  //   //     console.log("consumer : ", message);
  //   //   });
  //   //   consumer.on("error", function (err) {
  //   //     console.log("consumer error: ", err);
  //   //   });
  // }

  producer.on("ready", async function () {
    
    admin.listTopics((err, list_topic_res) => {
      console.log("topics list: ", list_topic_res);

    });

    client.createTopics(createTopicsList, (error, topics_res) => {
      if (error) {
        console.log("Create topics err:", error);
      } else {
        console.log("Create topics res:",  topics_res);

        admin.listTopics((err, list_topic_res) => {
          console.log("topics list: ", list_topic_res);
    
        });
      }
    });

    console.log("::> Kafka Server is Ready");

    is_ready_kafka_node = true;
  });

  producer.on("error", function (err) {
    console.log(err);
    console.log("kafka-producer -> " + kafka_topic + " kafka connection error");
    //throw err;
  });

} catch (error) {
  console.log(error);
}

let payload = [
  {
    topic: kafka_topic,
    messages: ["message body"], // multi messages should be a array, single message can be just a string or a KeyedMessage instance
    key: "theKey", // string or buffer, only needed when using keyed partitioner
    partition: 0, // default 0
    attributes: 0, // default: 0
    timestamp: Date.now(), // <-- defaults to Date.now() (only available with kafka v0.10+)
  },
];

const KafkaNodeIndexGet = (req, res) => {
  index++;

  console.log("Kafka Node Test running...:");

  if (is_ready_kafka_node) {
    console.log("push status:");
    let push_status = producer.send(payload, (err, data) => {
      if (err) {
        console.log("kafka-producer -> " + kafka_topic + " kafka topic error" + err);
      } else {
        console.log("kafka-producer -> " + kafka_topic + " kafka topic success");
        res.send(index.toString() + "-Kafka Node Test running...:" + data + "<br>");
      }
    });

    console.log(push_status);
  } else {
    console.log("Kafka Server is not Ready");
  }

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
