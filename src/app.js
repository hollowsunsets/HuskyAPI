require('dotenv').config()
const express = require('express')
const logger = require('./logger')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

const UserController = require('./controllers/user')
const CourseController = require('./controllers/course')

const PORT = process.env.PORT || 5000
const app = express()

app.use(logger)

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

app.get('/register', (req, res) => {
  res.render('register')
})
app.post('/register', UserController.registerUser)

// Login Process
app.get('/login', (req, res) => {
  res.render('login')
})
app.post('/login', UserController.handleLogin)

// Protected Routes to get information about UW Courses
app.get('/courses', CourseController.getAllCourses)

app.listen(PORT, () => console.log('Server started on port ' + PORT))
