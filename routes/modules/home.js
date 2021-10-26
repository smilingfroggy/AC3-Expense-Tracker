const express = require('express')
const router = express.Router()
const Records = require('../../models/records')
const UserId = require('../../models/users')

router.get('/', (req, res) => {
  Records.find()  //TODO: 找符合userID的紀錄
    .lean()
    .then(record => {
      res.render('index', { record })
    })
})

module.exports = router