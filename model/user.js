var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    require: true,
    trim: true
  },
  password: {
    type: String,
    require: true,
    trim: true
  },
  date: {
    type: Date,
    defualt: Date.now
  }
})

var User = mongoose.model('user', schema)

module.exports = User
