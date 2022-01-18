const { route } = require("express/lib/application");

const { KafkaIndexPost, KafkaIndexGet } = require("../controllers/kafkajs-test/kafkajs_test"); 


const router = express.Router();

router.route("/air")
    .get(KafkaIndexGet)
    .post(KafkaIndexPost);

module.exports = {
  router,
};
