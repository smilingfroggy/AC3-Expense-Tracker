const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const hbs = require('handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const usePassport = require('./config/passport')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')
const PORT = process.env.PORT

// execute mongoose
require('./config/mongoose')

// set handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// handlebars helpers
hbs.registerHelper('formatDate', function (date) {
  const dateOriginal = date.toString()
  return dateOriginal.slice(0, 10);
})
// TODO: registerHelper: categoryIcon
hbs.registerHelper('categoryIcon', function (CATEGORY, category, categoryId) {   //record:{_id:...} categories:[{_id:..name:..}]
  // console.log("app.js Cat:", category)   //OK .handlebars需加上{{../}}否則為undefined
  // console.log(categoryId)  //new ObjectId("617d7b0cd3eae9b36d42a00b")
  for (let i = 0; i < category.length; i++) {
    // console.log('catID', category[i]._id)  //new ObjectId("617d7b0cd3eae9b36d42a00b")
    if (category[i]._id == categoryId) {  //PROBLEM: 找不到符合的id
      let catName = category[i].name
    }
  }
  // return CATEGORY.catName
})

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// session and passport settings
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app)

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  return next()
})

// set router
app.use(routes)

app.listen(PORT, () => {
  console.log(`Expense tracker is running on http://localhost:${PORT}`)
})
