const express = require('express')
const router = express.Router()
const { addLog } = require("../controllers/errorLogController")

router.route('/').post(addLog)

module.exports = router