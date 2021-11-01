const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth')
const records = require('./modules/records')
const home = require('./modules/home')
const users = require('./modules/users')

router.use('/records', authenticator, records)
router.use('/users', users)
router.use('/', authenticator, home)

module.exports = router