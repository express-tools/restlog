const url = require("url")

module.exports = req => 
  url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  })