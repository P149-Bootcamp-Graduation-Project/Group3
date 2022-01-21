const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "kafka_test_1",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: "log_group",
});

async function createProducer() {
    try {
        console.log("Kafka js producer connect...");
        await producer.connect();
        console.log("OK...");
        await producer.disconnect();
    } catch (error) {
        console.log(error);
    }
}
createProducer();

async function createConsumer() {
    try {
    
        console.log("Kafka js consumer connect...");
        await consumer.connect();
        console.log("OK...");
  
        // Consumer Subscribe..
        await consumer.subscribe({
          topic: "Logs",
          fromBeginning: true,
        });

        // await consumer.run({
        //   eachMessage: async (result) => {
        //     incomingMessage = `Gelen Mesaj ${result.message.value}, Par => ${result.partition}`;
        //     console.log(incomingMessage);
        //   }
        // });
    
     
    } catch (error) {
      console.log("Error :", error);
    }
  }
  createConsumer();


async function createCustomTopic() {
    try {
   
      const admin = kafka.admin();
      console.log("Kafka Broker'a -->");
      await admin.connect();
      console.log("Topic -->");
  
      const listTopics = await admin.listTopics();
  
      const findTopic = listTopics.find((el) => {
        if (el === "Logs") {
          admin.deleteTopics({
            topic: ["Logs", "Logs2"],
          });
        }
      });
      await admin.createTopics({
        waitForLeaders: true,
        topics: [
          {
            topic: "Logs",
            numPartitions: 1,
          },
          {
            topic: "Logs2",
            numPartitions: 2,
          },
        ],
      });
      console.log("Topic olusturuldu......");
  
      await admin.disconnect();
    } catch (error) {
      console.log("Hata : ", error);
    } finally {
      //process.exit(0);
    }
}

// module.exports={
//     producer,
//     consumer
// };
