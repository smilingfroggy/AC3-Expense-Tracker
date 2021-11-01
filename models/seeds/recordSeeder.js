const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const Users = require('../users')
const Records = require('../records')
const Categories = require('../categories')
const user_content = [
  {
    name: '廣志',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: '小新',
    email: 'user2@example.com',
    password: '23456789'
  }
]
const record_content = [
  {
    name: '午餐',
    date: '2019.4.23',
    amount: 60,
    userId: 0,
    categoryId: 3
  },
  {
    name: '晚餐',
    date: '2019.4.23',
    amount: 60,
    userId: 0,
    categoryId: 3
  },
  {
    name: '捷運',
    date: '2019.4.23',
    amount: 120,
    userId: 0,
    categoryId: 1
  },
  {
    name: '電影：驚奇隊長',
    date: '2019.4.23',
    amount: 220,
    userId: 1,
    categoryId: 2
  },
  {
    name: '租金',
    date: '2019.4.30',
    amount: 25000,
    userId: 0,
    categoryId: 0
  }
]

db.once('open', () => {
  Promise.all(Array.from(user_content, (user) => {
    return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash => {
        return Users.create({ name: user.name, email: user.email, password: hash })
      })
      .catch(err => console.log(err))
  }))
    .then((user) => {   //user: [{name:..,email:..,}, {name:..}]
      //無法從user順序建立record，要從record內容指定的userId, categoryId來輸入對應ID
      Promise.all(Array.from(record_content, (record) => {
        return Categories.find()
          .lean()
          .then((cat) => {     //cat: [{_id:..,name:..,},{},{}]
            return Records.create({ name: record.name, date: record.date, amount: record.amount, userId: user[record.userId]._id, categoryId: cat[record.categoryId]._id })
          })
      }))
        .then(() => {
          console.log('Records seeder has done')
          process.exit()
        })
        .catch(err => console.log(err))
    })
})