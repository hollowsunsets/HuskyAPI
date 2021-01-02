require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')

const saltRounds = 10

const app = express()
const port = 5000

mongoose.connect(process.env.AUTH_DB, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))

// Home Page
app.get('/', (req, res) => {
  res.render('home')
})

// User Registration
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  key: String
})

const Model = mongoose.model
const User = new Model('User', userSchema)

const GenKey = () => {
  // create a base-36 string that is always 30 chars long a-z0-9
  // 'an0qrr5i9u0q4km27hv2hue3ywx3uu'
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join('')
}

app.get('/register', (req, res) => {
  res.render('register')
})

// Process of creating a user
app.post('/register', (req, res) => {
  // TODO: Implement duplicate-key checking logic
  const apiKey = GenKey()

  // Encrypt password
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err)
    } else {
      const newUser = new User({
        email: req.body.username,
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
})

// Login Process
app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  const userName = req.body.username
  const password = req.body.password

  User.findOne({ email: userName }, (err, foundUser) => {
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
})

// Protected Routes to get information about UW Courses
app.get('/courses', (req, res) => {
  // Get query parameters from the api endpoint
  const params = req.query

  // This is what will be returned to the user if they have a valid API key
  const mockCourseInfo = {
    courseCode: 'CSS481',
    instructor: 'John Stager',
    quarterOffered: 'W20',
    credits: 5
  }

  if (!('appid' in params)) {
    res.status(401)
    res.send('No API Key provided')
  } else {
    // Check if API Key is valid
    // TODO: Optimize validity checking algo
    User.find({}, (err, result) => {
      if (err) {
        res.send(err)
      } else {
        let keyFound = false
        for (const doc of result) {
          if (doc.key === params.appid) {
            keyFound = true
            res.send(mockCourseInfo)
          }
        }

        if (!keyFound) {
          res.status(401)
          res.send('API Key Invalid')
        }
      }
    })
  }
})

app.listen(port, () => console.log('Server started on port ' + port))
