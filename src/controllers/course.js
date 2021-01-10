const User = require('../models/user')

module.exports = {
  getAllCourses: async (req, res) => {
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
  }
}
