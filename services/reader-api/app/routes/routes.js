const { route } = require("express/lib/application");

const { fakeTempGet, fakeTempPost } = require("../controllers/fake-temperature/fake_temperature");
const { fakePowerGet, fakePowerPost } = require("../controllers/fake-power/fake_power");
const { fakeAirGet, fakeAirPost } = require("../controllers/fake-air/fake_air");

const router = express.Router();

router.route("/temperature").get(fakeTempGet).post(fakeTempPost);
router.route("/electricity").get(fakePowerGet).post(fakePowerPost);
router.route("/air").get(fakeAirGet).post(fakeAirPost);

module.exports = {
  router,
};
