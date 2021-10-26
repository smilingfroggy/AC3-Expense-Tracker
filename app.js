const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const PORT = 3000

// execute mongoose
require('./config/mongoose')

// set handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get("/", (req, res) => {
  res.render('index')
})

app.listen(PORT, () => {
  console.log(`Expense tracker is running on http://localhost:${PORT}`)
})
