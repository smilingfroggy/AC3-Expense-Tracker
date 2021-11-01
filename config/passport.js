const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const Users = require('../models/users')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    Users.findOne({ email })
      .then(user => {
        if (!user) {
          console.log('Email unregistered')
          return done(null, false, { message: "您尚未註冊" })
        }
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              console.log('Wrong email or password')
              return done(null, false, { message: "帳號或密碼錯誤" })
            } else {
              return done(null, user)
            }
          })
      })
      .catch(err => done(err, null))
  }))
  passport.serializeUser((user, done) => {
    return done(null, user._id)
  })
  passport.deserializeUser((id, done) => {
    Users.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}