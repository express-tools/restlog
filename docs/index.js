const { EventEmitter } = require("events")
const url = require("url")
const _ = require("underscore")

const emitter = new EventEmitter()

function decoreSend(req, res, extracts) {
  
  const send = res.send.bind(res)
  const startTime = Date.now()

  res.send = body => {

        
    const {
      path,
      method,
      query,
      hostname,
      protocol
    } = req

    const resource = `${method} ${req.route.path}`

    const isJson = res._headers["content-type"] === "application/json"
    const data = (req.method !== "GET" && isJson && _.isString(body))
             ? JSON.parse(body) : null
    
    const date = new Date

    const meta = {
      url: extractFullUrl(req),
      resource,
      path,
      method, 
      query,
      hostname,
      protocol,
      userAgent: req.headers["user-agent"],
      isoDate: date.toISOString(),
      milliseconds: date - startTime,
      date: {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      },
      request: {
        params: req.params,
        query: req.query,
        method: req.method,
        headers: req.headers,
        path: req.originalUrl,
        body: req.body
      },
      response: {
        readers: res._headers,
        status: res.statusCode,
        body: data
      }
    }

    _(extracts).each((callback, k) => {
      meta[k] = callback(req, res)
    })

    emitter.emit("api:request:response", meta)
 
    return send(body) // takes advantage of TCO on node 6.6
  }
}

function extractFullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  })
}

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

    decoreSend(req, res, extracts)

    next()
  }
}