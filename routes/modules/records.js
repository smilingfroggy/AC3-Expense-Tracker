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
  console.log(req.params) //{ recordId: '617849e7af42cee21bdbfacb' }
  const recordId = req.params.recordId
  // const userId = req.body.userId
  // Users.findOne({ userId })
  Records.findOne({ _id: recordId })
    .lean()
    .then(record => {
      const { name, date, categoryId, amount } = record
      console.log(name, date, categoryId, amount)
      res.render('edit', { name, date, categoryId, amount })
    })
  
  // res.send('Edit page')
})

router.put('/:recordId', (req, res) => {
  res.send('Edit page')
})

// delete record
router.delete('/:recordId', (req, res) => {
  res.send('delete page')
})

module.exports = router