const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  key: String
})

module.exports = mongoose.model('User', UserSchema)
