const express = require('express')
const router = express.Router()
const records = require('./modules/records')
const home = require('./modules/home')

router.use('/', home)
router.use('/records', records)

module.exports = router