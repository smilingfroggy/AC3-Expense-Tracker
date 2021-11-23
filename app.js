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
hbs.registerHelper('getCategoryIcon', function (CATEGORY, category, categoryId) {   //record:{_id:...} categories:[{_id:..name:..}]
  for (let i = 0; i < category.length; i++) {
    if (category[i]._id.toString() == categoryId.toString()) {  //兩者型別都是object需要轉換，才能找到一樣的id
      let catName = category[i].name
      let catIcon = CATEGORY[catName]
      return new hbs.SafeString(catIcon)
    }
  }
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
