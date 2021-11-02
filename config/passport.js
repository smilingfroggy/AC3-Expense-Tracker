const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    Users.findOne({ email })
      .then(user => {
        if (user) {
          console.log('Welcome back', user.name)
          return done(null, user)
        }   // 若已存在使用者
        // 若無，產生隨機密碼後建立新user
        const randomPassword = Math.random().toString(36).slice(-8)
        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => Users.create({ name, email, password: hash }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }
  ))
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