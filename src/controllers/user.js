const User = require('../models/user')
const Utils = require('../utils')
const bcrypt = require('bcryptjs')

const saltRounds = 10

module.exports = {
  handleLogin: async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ email: username }, (err, foundUser) => {
      if (err) {
        console.log(err)
      } else {
        if (foundUser) {
          bcrypt.compare(password, foundUser.password, (err, result) => {
            if (!err) {
              if (result === true) {
                res.render('account', {
                  key: foundUser.key
                })
              } else {
                console.log('Either username and/or password details are incorrect!')
              }
            } else {
              console.log(err)
            }
          })
        }
      }
    })
  },
  registerUser: async (res, req) => {
    // TODO: Implement duplicate-key checking logic
    const apiKey = Utils.generateKey()

    const password = req.body.password
    const username = req.body.username
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err)
      } else {
        const newUser = new User({
          email: username,
          password: hash,
          key: apiKey
        })

        newUser.save((err) => {
          if (err) {
            console.log(err)
          } else {
            res.render('account', {
              key: apiKey
            })
          }
        })
      }
    })
  }
}
