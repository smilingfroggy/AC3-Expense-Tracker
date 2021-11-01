const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const Users = require('../../models/users')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/users/login"
}))

router.get('/logout', (req, res) => {
  req.logout()
  req.flash("success_msg", "您已成功登出")
  res.redirect('/users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  Users.findOne({ email })
    .lean()
    .then(user => {
      console.log(user)
      if (user) { //檢查email是否重複註冊
        console.log('此email已被註冊')
        errors.push({ message: "此email已註冊過"})
      }
      if (password !== confirmPassword) {
        //檢查輸入密碼是否相同
        errors.push({ message: "請檢查兩次輸入的密碼" })
      } 
      if (errors.length) {
        return res.render('register', { errors, name, email, password, confirmPassword })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          Users.create({ name, email, password: hash })
        })
        .then(() => {
          res.redirect('/')
          console.log(`name: ${name} registered`)
        })
        .catch(err => console.log(err))
      }) 
})

module.exports = router