const pino = require('pino')
const expressPino = require('express-pino-logger')

const logger = pino({
  customLevels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  },
  prettyPrint: true
})

const expressLogger = expressPino({ logger })

module.exports = expressLogger
