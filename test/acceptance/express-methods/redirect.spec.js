
//

const request = require("supertest")
const _ = require("lodash")

const { expect } = require("chai")
const restlog = require("../../../")


describe("res.redirect", () => {

  let currentEvent

  const middleware = restlog({
    logIn: [
      event => {
        console.log(event.trace)
        currentEvent = event
      }
    ]
  })
  
  before(() => {
    app = require("../../support/app-example")(middleware)
    //app = require("../support/app-example")()
  })

  describe("redirect()", () => {
  

    let res

    before(done => {
      currentEvent = null
      request(app).get("/api/v1/test/123/redirect").then(r => {
        res = r
        done()
      })
    })

    describe("event", () => {
      it("have all fields", () => {
        expect(currentEvent).have.all.keys(
          "hostname",
          "isoDate",
          "response",
          "request",
          "method",
          "trace",
          "url",
          "userAgent",
          "resource",
          "path",
          "protocol",
          "query",
          "milliseconds"
        )
      })

      describe("event.request", () => {

        it("have all fields", () => {
          expect(currentEvent.request).have.all.keys(
            "path", "body", "headers", "query", "params", "method"
          )
        })
      })
      
      describe("event.response", () => {
  
        it("have all fields", () => {
          expect(currentEvent.response).have.all.keys(
            "status", "body", "headers"
          )
        })
    
        it("body should be equal", () => {
          expect(res.text).to.be.eql(
            currentEvent.response.body
          )
        })
    
        it("headers should be equal", () => {
          const headers = _.omit(res.headers, "connection")
          expect(headers).to.be.eql(currentEvent.response.headers)
        })
      })
    })
  })
})