var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var passport = require('passport')
require('../db/mongose')

var User = require('../model/user')

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource')
})

// Logout
router.get('/logout', isAuthenticated, (req, res, next) => {
  req.logOut()
})

router.use('users/login', forwardAuthenticated, (req, res, next) => {
  next()
})

router.get('/profile', isAuthenticated, (req, res, next) => {
  res.render('users/profile')
  res.redirect('/users/login')
})

// registration
router.get('/register', (req, res, next) => {
  res.render('users/register')
})

// Register Handle
router.post('/register', async (req, res, next) => {
  const { username, email, password, password2 } = req.body
  let errors = []

  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Please fillout all feilds!' })
  }

  // Password mismach
  if (password !== password2) {
    errors.push({ msg: 'Entered password was diffrent' })
  }

  // Password validation
  if (password.length < 6) {
    errors.push({ msg: 'Password must contain 6 charcter' })
  }

  // Errors
  if (errors.length > 0) {
    console.log(errors)
    res.render('users/register', {
      errors,
      username,
      email,
      password,
      password2
    })
  } else {
    await User.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ msg: 'email is already taken' })
          res.render('users/register', {
            errors,
            username,
            email,
            password,
            password2
          })
        } else {
          const newUser = new User({
            username,
            email,
            password
          })
          console.log(newUser)
          bcrypt.genSalt(10, (_err, salt) =>
          // Hash Password
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err
              // Set password hashed
              newUser.password = hash
              // Save user
              newUser.save().then(user => {
                res.render('users/profile', { username: newUser.username })
              }).catch(e => {
                console.log(e)
              })
            })
          )
        }
      })
  }
})

// LOGIN
router.get('/login', (req, res, next) => {
  res.render('users/login')
})

// LOGIN handle
router.post('/login', (req, res, next) => {
  const email = req.body
  let errorss = []
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      console.log(req.body)
      errorss.push({ msg: 'Email or password is incorrect' })
      console.log(errorss)
      return res.render('users/login', { errorss, email })
    }
    req.logIn(user, (err) => {
      if (err) return next(err)
      res.render('/users/profile', { username: req.user.name })
    })
  })(req, res, next)
})

function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error_msg', 'Please log in to view that resource')
  res.redirect('/user/signup')
}
function forwardAuthenticated (req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
module.exports = router
