
![rest.log](https://raw.githubusercontent.com/luizamboni/api-logger/master/Logo2.jpeg "logo")

API Logger
===


Designed to help log request-response pair integrate with express middleware
Example to Log with aws firehose

```javascript

const ApiLogger = require("../index")
const app = require("express")()
const isBot = require("isbot")
const flat = require("flat")

const AWS = require("aws-sdk")
const firehose = new AWS.Firehose({ apiVersion: "2015-08-04", region: "us-east-1" })

app.use(ApiLogger({

  // Array of reject patterns in url
  rejectPatterns: [ /.ico/ ],

  // extracts from request or response and add To eventLog
  extracts: {
    isBot: (req, res) => isBot(req.headers['user-agent'])
  },
  // Array with each output of log desired
  logIn: [
    // put in firehose
    event => {

      firehose.putRecord({
        DeliveryStreamName: 'test',
        Record: {
          Data: [ JSON.stringify(flat(event)), "\n" ].join("")
        }
      }).promise()
      .then(res => console.log(res))
      .catch(console.error)
      
    },
    // log in stdOut
    event => console.log(event),
    event => /* ... saves on mongoDB etc*/

  ]
}))


app.get("/api/v1/test/:id", (req, res) => {
  setTimeout(() =>
    res.send({ msg: "ok" })
  , Math.random() * 1000)
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


setInterval(() => 
  axios.get("http://localhost:3000/api/v1/test/234")
, 200)


setInterval(() => 
  axios.put("http://localhost:3000/api/v1/test/123")
, 500)


setInterval(() => 
  axios.delete("http://localhost:3000/api/v1/test/123")
, 8000)

app.listen(3000, "localhost", () => {
  console.log("start !in port 3000")
})
```

In Aws Athena...

![athena query](https://raw.githubusercontent.com/luizamboni/api-logger/master/Screenshot3.png "athena show aggregation")
