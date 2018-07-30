
//

const request = require("supertest")
const _ = require("lodash")

const { expect } = require("chai")
const restlog = require("../../")


describe("success response", () => {

  let currentEvent

  const middleware = restlog({
    logIn: [
      event => {
        console.log(event.trace)
        currentEvent = event
      }
    ]
  })
  
  let app = require("../support/app-example")(middleware)

  context("json response", () => {

    let res

    before(async () => {

      currentEvent = null
      res = await request(app).get("/api/v1/test/123")
    })

    describe("response", () => {
      it("status should be equal", () => {
        expect(res.status).to.be.equal(currentEvent.response.status)
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


  context("no content response", () => {

    let res

    before(async () => {
      currentEvent = null
      res = await request(app).get("/api/v1/test/123/end")
    })

    describe("response", () => {
      it("status should be equal", () => {
        expect(res.status).to.be.equal(currentEvent.response.status)
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