var LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
require('../db/mongose')
var User = require('../model/user')

module.exports = function (passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      // Match User
      await User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'this email is not registered' })
          }
          // Macthing Password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err

            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'password id incorrenct' })
            }
          })
        }).catch(e => {
          console.log(e)
        })
    }
  ))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
