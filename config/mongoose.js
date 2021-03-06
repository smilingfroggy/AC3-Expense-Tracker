const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection

db.on('open', () => {
  console.log('MongoDB connected')
})

db.once('error', () => {
  console.log('MongoDB connection failed')
})

module.exports = db