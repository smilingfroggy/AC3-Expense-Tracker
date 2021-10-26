const express = require('express')
const router = express.Router()
const Records = require('../../models/records')
const UserId = require('../../models/users')

// create page
router.get('/new', (req, res) => {
  res.send('Create page')
})

router.post('/new', (req, res) => {
  res.send('Create page')
})

// edit page
router.get('/edit/:recordId', (req, res) => {
  res.send('Edit page')
})

router.put('/:recordId', (req, res) => {
  res.send('Edit page')
})

// delete record
router.delete('/:recordId', (req, res) => {
  res.send('delete page')
})

module.exports = router