const db = require('../../config/mongoose')
const Categories = require('../categories')

const category_content = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']

db.once('open', () => {
  Promise.all(Array.from(category_content, (name) => {
    return Categories.create({ name })
  }))
    .then(() => {
      console.log('Category seeder has done!')
      process.exit()
    })
})