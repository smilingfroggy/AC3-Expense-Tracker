const express = require('express')
const router = express.Router()
const Records = require('../../models/records')
const UserId = require('../../models/users')
const Categories = require('../../models/categories')
const users = require('../../models/users')

// create page
router.get('/new', (req, res) => {
  // get date of today and show as default date
  let today = new Date()
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();
  if (dd < 10) { dd = '0' + dd }
  if (mm < 10) { mm = '0' + mm }
  today = yyyy + '-' + mm + '-' + dd

  Categories.find()
    .lean()
    .then(category => {
      res.render("new", { category, today })
    })
})

router.post('/new', (req, res) => {
  // console.log(req.body) //{ name: 'test', date: '2021-10-29', category: '交通出行', amount: '15' }
  const { name, date, category, amount } = req.body

  // if category is not in Categories => create first
  Categories.findOne({ name: category })
    .then(cat => {
      if (cat) {

        Records.create({
          name, date, categoryId: cat._id, amount,
          // TODO: userId: user._id
        })
        console.log(`Created ${name} record`)
      }
      else {
        Categories.create({
          name: category
        })
          .then(cat => {
            console.log(`Created ${cat.name}`)
            Records.create({
              name, date, categoryId: cat._id, amount,
              // TODO: userId: user._id
            })
            console.log(`Created ${name} record`)
          })
      }
    })
    .then(() => {
      res.redirect('/')
    })
    .catch(err => console.log(err))
})

// edit page
router.get('/edit/:recordId', (req, res) => {
  const recordId = req.params.recordId
  // const userId = req.body.userId
  // Users.findOne({ userId })
  Records.findOne({ _id: recordId })
    .lean()
    .then(record => {
      // TODO: 日期格式轉換成 YYYY - MM - DD
      console.log(record.date.toString())   //Tue Apr 23 2019 00:00:00 GMT+0800 (台北標準時間
      let dateStr = record.date.toString().slice(4, 15)  //Apr 23 2019
      let months = {
        "Jen": 01,
        "Feb": 02,
        "Mar": 03,
        "Apr": 04,
        "May": 05,
        "Jun": 06,
        "Jul": 07,
        "Aug": 08,
        "Sep": 09,
        "Oct": 10,
        "Nov": 11,
        "Dec": 12
      }
      // for ( let month in months ) {
      //   if (month == dateStr.slice(0, 3)) {   //problem: 找不到相月份，formattedDate is undefined
      //     let formattedDate = dateStr.slice(7,11) + "-" + months[month].toString() + "-" + dateStr.slice(4,6)
      //   }
      // }
      // console.log(formattedDate)
      Categories.find()
        .lean()
        .then(categories => {
          Categories.findOne({ _id: record.categoryId })
            .lean()
            .then(cat => {
              // console.log(cat)
              res.render('edit', { record, dateStr, categories, cat })
            })
        })
    })
    .catch(err => { console.log(err) })
})

router.put('/:recordId', (req, res) => {
  const { name, date, category, amount } = req.body
  const recordId = req.params.recordId
  // if category is not in Categories => create first
  Categories.findOne({ name: category })
    .then(cat => {
      if (cat) {
        Records.findOne({ recordId })
          .then(record => {
            record.name = name
            record.date = date
            record.categoryId = cat._id
            record.amount = amount
            return record.save()
          })
        console.log(`Updated ${name} record`)
      }
      else {
        Categories.create({
          name: category
        })
          .then(cat => {
            Records.findOne({ recordId })
              .then(record => {
                record.name = name
                record.date = date
                record.categoryId = cat._id
                record.amount = amount
                return record.save()
              })
            console.log(`Updated ${name} record`)
          })
      }
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// delete record
router.delete('/:recordId', (req, res) => {
  res.send('delete page')
})

module.exports = router