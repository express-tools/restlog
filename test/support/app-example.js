const express = require("express")


module.exports = (middlewares = null) => {
  const app = express()

  if (middlewares)
    app.use(middlewares)

  app.get("/api/v1/test/:id", (req, res) => {
    setTimeout(() =>
      res.send({ msg: "ok" })
    , Math.random() * 1000)
  })
  
  
  app.get("/api/v1/test/:id/end", (req, res) => {
    res.sendStatus(204)
  })

  app.put("/api/v1/test/:id", (req, res) => {
    setTimeout(() =>
      res.send({ msg: "ok" })
    , Math.random() * 3000)
  })
  
  app.delete("/api/v1/test/:id", (req, res) => {
  
    setTimeout(() =>
      res.send({ msg: "ok" })
    , Math.random() * 3000)
  })

  return app
}