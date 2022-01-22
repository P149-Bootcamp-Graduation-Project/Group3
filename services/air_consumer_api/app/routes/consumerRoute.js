const express = require('express')
const router = express.Router()
const { consumerOn } = require('../adapters/queue/consumer')

router.route('/',consumerOn())

module.exports = router