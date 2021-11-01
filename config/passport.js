const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
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
        if (user.password != password) {
          console.log('Wrong email or password')
          return done(null, false, { message: "帳號或密碼錯誤" })
        }
        console.log('Welcome!', user.name)
        return done(null, user)
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