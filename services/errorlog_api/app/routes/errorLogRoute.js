const express = require('express')
const router = express.Router()
const { addLog,getLogs } = require("../controllers/errorLogController")

router.route('/').post(addLog).get(getLogs)

module.exports = router