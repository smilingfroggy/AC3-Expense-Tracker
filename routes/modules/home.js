const express = require('express')
const router = express.Router()
const Categories = require('../../models/categories')
const Records = require('../../models/records')
const UserId = require('../../models/users')
const CATEGORY = {
  "家居物業": '<i class="fas fa-home"></i>',
  "交通出行": '<i class="fas fa-shuttle-van"></i>',
  "休閒娛樂": '<i class="fas fa-grin-beam"></i>',
  "餐飲食品": '<i class="fas fa-utensils"></i>',
  "其他": '<i class="fas fa-pen"></i>'
}

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
          res.render('index', { categories, records, totalAmount, CATEGORY })
        })
    })
})

router.put('/category', (req, res) => {
  const userId = req.user._id
  const categorySelected = req.body.categorySelected  // e.g."家居物業"
  return Promise.all([
    Categories.find().lean(),
    Categories.findOne({ name: categorySelected }).lean()
  ])
    .then(([categories, category]) => {
      const categoryId = category._id.toString()
      Records.find({ userId, categoryId })
        .lean()
        .then(records => {
          let totalAmount = 0
          for (let i = 0; i < records.length; i++) {
            totalAmount += records[i].amount
          }
          res.render('index', { categories, records, totalAmount, CATEGORY })
        })
        .catch(err => console.log(err))
    })
})

module.exports = router