const express = require('express')
const categories = require('../../models/categories')
const router = express.Router()
const Categories = require('../../models/categories')
const Records = require('../../models/records')
const UserId = require('../../models/users')

router.get('/', (req, res) => {
  const userId = req.user._id
  Categories.find()
    .lean()
    .then(categories => {
      Records.find({ userId })
        .lean()
        .then(records => {  // [{_id:..,name:"",...},{},{}...]
          let totalAmount = 0
          for (let i = 0; i < records.length; i++) {
            totalAmount += records[i].amount
          }
          const CATEGORY = {
            "家居物業": '<i class="fas fa-home"></i>',
            "交通出行": '<i class="fas fa-shuttle-van"></i>',
            "休閒娛樂": '<i class="fas fa-grin-beam"></i>',
            "餐飲食品": '<i class="fas fa-utensils"></i>',
            "其他": '<i class="fas fa-pen"></i>'
          }
          res.render('index', { categories, records, totalAmount, CATEGORY })
        })
    })
})

module.exports = router