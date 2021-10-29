const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  amount: {
    type: Number,
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Categories',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: false,   //僅測試使用false
    index: true
  }
})

module.exports = mongoose.model('Records', recordsSchema)