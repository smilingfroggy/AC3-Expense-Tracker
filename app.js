const express = require('express')
const app = express()
const PORT = 3000

// execute mongoose
require('./config/mongoose')

app.get("/", (req, res) => {
  res.send('Hello')
})

app.listen(PORT, () => {
  console.log(`Expense tracker is running on http://localhost:${PORT}`)
})
