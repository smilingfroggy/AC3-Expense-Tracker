const express = require('express')
const router = express.Router()
const passport = require('passport')
const Users = require('../../models/users')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/users/login"
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  Users.findOne({ email })
    .lean()
    .then(user => {
      console.log(user)
      if (user) { //檢查email是否重複註冊
        console.log('此email已被註冊')
        return res.render('register', { name, email, password, confirmPassword })
      } else if (password !== confirmPassword) {
        //檢查輸入密碼是否相同
        console.log('請檢查兩次輸入的密碼')
        return res.render('register', { name, email, password, confirmPassword })
      } else {
        Users.create({ name, email, password })
          .then(() => {
            res.redirect('/')
            console.log(`name: ${name} registered`)
          })
      }
    })
})

module.exports = router