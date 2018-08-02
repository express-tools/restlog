
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
  
  const app = require("../support/app-example")(middleware)
  // const app = require("../support/app-example")()

  describe("redirect()", () => {
  

    let res

    before(async () => {
      currentEvent = null
      res = await request(app).get("/api/v1/test/123/redirect")
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

  describe("json()", () => {

    let res

    before(async () => {

      currentEvent = null
      res = await request(app).get("/api/v1/test/123/json")
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

  describe("sendStatus()", () => {

    let res

    before(async () => {
      currentEvent = null
      res = await request(app).get("/api/v1/test/123/sendStatus")
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

  describe("download()", () => {

    let res

    before(async () => {
      currentEvent = null
      res = await request(app).get("/api/v1/test/123/download")
    })

    describe("response", () => {
      it("status should be equal", () => {
        expect(res.status).to.be.equal(currentEvent.response.status)
      })
  
      it("body should be equal", async () => {

        expect(res.body).to.be.eql(
          await currentEvent.response.body
        )
      })
  
      it("headers should be equal", () => {
        const headers = _.omit(res.headers, "connection")
        expect(headers).to.be.eql(currentEvent.response.headers)
      })
    })
  })


  describe("sendFile()", () => {

    let res

    before(async () => {

      currentEvent = null
      res = await request(app).get("/api/v1/test/123/sendFile")
      await new Promise(resolve => setTimeout(resolve, 1000))
    })

    describe("response", () => {
      it("status should be equal", () => {
        expect(res.status).to.be.equal(currentEvent.response.status)
      })
  
      it("body should be equal", async () => {
        expect(res.body).to.be.eql(
          await currentEvent.response.body
        )
      })
  
      it("headers should be equal", () => {
        const headers = _.omit(res.headers, "connection")
        expect(headers).to.be.eql(currentEvent.response.headers)
      })
    })
  })


  describe("render()", () => {

    let res

    before(async () => {

      currentEvent = null
      res = await request(app).get("/api/v1/test/123/render")
      await new Promise(resolve => setTimeout(resolve, 1000))
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