const { EventEmitter } = require("events")

const emitter = new EventEmitter()
const extractFullUrl = require("./helpers/full-url")
const decoreSend = require("./helpers/decore-send")


module.exports = (config = {}) => {

  const { rejectPatterns = [], extracts = [], logIn = [] } = config

  // create listeners by callbacks
  logIn.forEach(callback => {
    emitter.on("api:request:response", event => {
      callback(event)
    })
  })

  return (req, res, next) => {

    const fullUrl = extractFullUrl(req)

    rejectPatterns.forEach(pattern => {
      if(pattern.test && pattern.test(fullUrl))
        return next()
    }) 

    decoreSend(req, res, extracts, emitter)

    next()
  }
}