const _ = require("lodash")
const fs =  require("fs")
const extractFullUrl = require("./full-url")

// https://github.com/nodejs/node/blob/573744caaedf2f941e152b8e9533cd5629d55c1c/lib/_http_outgoing.js

module.exports = (req, res, extracts, emitter) => {
  const trace = []
  const startTime = new Date()
  
  let filePath = null

  const counts = {
    _send: 0,
    send: 0,
    end: 0,
    sendStatus: 0,
  }
  // let endDate
  // let hasBodycontent = false
 
  const {
    path,
    method,
    query,
    hostname,
    protocol
  } = req
  

  const event = {
    trace,
    url: extractFullUrl(req),
    path,
    method, 
    query,
    hostname,
    protocol,
    userAgent: req.headers["user-agent"],
    isoDate: startTime,
    request: {
      params: req.params,
      query: req.query,
      method: req.method,
      headers: req.headers,
      path: req.originalUrl,
      body: req.body
    },
    response: {}
  }

  debugger
  res.once("finish", function() {
    trace.push("event:finish")

    const { req } = this
    const { res } = req

    const pathPattern = req.route ? req.route.path : "not found"
    event.resource = [method, pathPattern ].join(" ")
    event.milliseconds =  endDate - startTime

    const headers = _.extend(
      {},
      res._headers,
      event.response.headers
    )

    /**
     * normalize headers
     */

    if (!headers.date)
      headers.date = endDate.toUTCString()

    _(headers).forEach((value, key) => {
      headers[key] = value.toString()
    })

    event.response.headers = headers



    _(extracts).each((callback, k) => {
      event[k] = callback(req, res)
    })
    

    if (filePath) {
      event.response.body = new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, buffer) => {
          if(err)
            reject(err)
          else
            resolve(buffer)
        })
      })
    }


    emitter.emit("api:request:response", event)
  })

  /* 
  res.connection.on("close", function(data)  {
    trace.push("connections:close")
    event.response.headers.connection = "close"
  })


  res.connection.on("finish", function(data) {
    trace.push("connections:finish")
    event.response.headers.connection = "finish"
  })
*/

  const origSend = res.send.bind(res)
  const origEnd = res.end.bind(res)
  const orig_send = res._send.bind(res)
  const origSendStatus = res.sendStatus.bind(res)
  const origSendFile = res.sendFile.bind(res)

  res.sendFile = (path, options, callback) => {
    trace.push("sendFile()")
    filePath = path
    const resOrigSendFile = origSendFile(path, options, callback)
    return resOrigSendFile
  }

  res.sendStatus = status => {
    
    trace.push("sendStatus()")
    
    event.response.body = null

    const resSendStatus = origSendStatus(status)
    return resSendStatus
  }

  res._send = (data, type, callback) => {
    ++counts._send
    
    trace.push("_send()")

    if (counts._send === 1) {
      event.response.body = data.toString()
    }

    const resSend = orig_send(data, type, callback)
    return resSend
  }

  // end decore
  res.end = (chunk, encoding) => {
    trace.push("end()")
    endDate = new Date()

    // to prevent "Uncaught Error: Can't set headers after they are sent."
    if (!res.headersSent)
      res.set("date", endDate)

    event.response = {
      headers: res._headers,
      status: res.statusCode,
      body: _(chunk ? chunk.toString() : event.response.body).cloneDeep()
    }

    const endRes = origEnd(chunk, encoding)
    return endRes
  }

  // send decore
  res.send = body => {
    ++counts.send

    trace.push("send()")

    event.response = {
      headers: res._headers,
      status: res.statusCode,
      body: _(body || event.response.body).cloneDeep()
    }

    return origSend(body)
  }
}