var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => console.log('mongodb Connected'))
  .catch((e) => console.log('Some Error Occured'))
