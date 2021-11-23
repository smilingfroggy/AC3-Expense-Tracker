const express = require('express')
const router = express.Router()
const Records = require('../../models/records')
const Users = require('../../models/users')
const Categories = require('../../models/categories')

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
  const userId = req.user._id

  // if category is not in Categories => create first
  Categories.findOne({ name: category })
    .then(cat => {
      if (cat) {

        Records.create({
          name, date, userId, categoryId: cat._id, amount,
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
              name, date, userId, categoryId: cat._id, amount,
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
  const userId = req.user._id
  Records.findOne({ _id: recordId, userId })
    .lean()
    .then(record => {
      // 日期格式轉換成 YYYY - MM - DD
      console.log(record.date.toString())   //Tue Apr 23 2019 00:00:00 GMT+0800 (台北標準時間
      let dateStr = record.date.toString().slice(4, 15)  //Apr 23 2019
      let monthStr = dateStr.slice(0, 3)
      let months = {
        Jen: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
      }
      let formattedDate = ""   // YYYY - MM - DD
      for (let month in months) {
        if (month == monthStr) {
          formattedDate = dateStr.slice(7, 11) + "-" + months[month] + "-" + dateStr.slice(4, 6)
        }
      }
      // 取得所有類別及此項類別
      Categories.find()
        .lean()
        .then(categories => {
          Categories.findOne({ _id: record.categoryId })
            .lean()
            .then(cat => {
              res.render('edit', { record, categories, cat, formattedDate })
            })
        })
    })
    .catch(err => { console.log(err) })
})

router.put('/:recordId', (req, res) => {
  const { name, date, category, amount } = req.body
  const userId = req.user._id
  const recordId = req.params.recordId
  // if category is not in Categories => create first
  Categories.findOne({ name: category })
    .then(cat => {
      if (cat) {
        Records.findOne({ _id: recordId, userId })
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
            Records.findOne({ _id: recordId, userId })
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
  const userId = req.user._id
  const recordId = req.params.recordId
  Records.findOne({ _id: recordId, userId })
    .then(record => {
      // console.log(record.name, "deleting")
      record.remove()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router