const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const routes = require('./routes')
const PORT = 3000

// execute mongoose
require('./config/mongoose')

// set handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set router
app.use(routes)

app.listen(PORT, () => {
  console.log(`Expense tracker is running on http://localhost:${PORT}`)
})
