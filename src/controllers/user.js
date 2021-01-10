const User = require('../models/user')
const Utils = require('../utils')
const bcrypt = require('bcryptjs')
const saltRounds = 10

module.exports = {
  handleLogin: async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    User.findOne({ email: username }, (err, foundUser) => {
      req.log.info(`Logging in user ${username}`)
      if (err) {
        req.log.error(err)
      } else {
        if (foundUser) {
          req.log.info('User exists, checking password')
          bcrypt.compare(password, foundUser.password, (err, result) => {
            if (!err) {
              if (result === true) {
                res.render('account', {
                  key: foundUser.key
                })
              } else {
                req.log.info('Either username and/or password details are incorrect!')
              }
            } else {
              req.log.error(err)
            }
          })
        }
      }
    })
  },
  registerUser: async (req, res) => {
    req.log.info('Registering user')
    // TODO: Implement duplicate-key checking logic
    const apiKey = Utils.generateKey()

    const password = req.body.password
    const username = req.body.username
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        req.log.error(err)
      } else {
        const newUser = new User({
          email: username,
          password: hash,
          key: apiKey
        })

        newUser.save((err) => {
          if (err) {
            req.log.error(err)
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
