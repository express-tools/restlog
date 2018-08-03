
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

    before(done => {
      currentEvent = null
      request(app).get("/api/v1/test/123/redirect").then(r => {
        res = r
        done()
      })
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

    before(done => {
      currentEvent = null
      request(app).get("/api/v1/test/123/json").then(r => {
        res = r
        done()
      })
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

    before(done => {
      currentEvent = null
      request(app).get("/api/v1/test/123/sendStatus").then(r => {
        res = r
        done()
      })
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

    before(done => {
      currentEvent = null
      request(app).get("/api/v1/test/123/download").then(r => {
        res = r
        setTimeout(done, 1000)
      })
    })

    describe("response", () => {
      it("status should be equal", () => {
        expect(res.status).to.be.equal(currentEvent.response.status)
      })
  
      it("body should be equal", done => {
        currentEvent.response.body.then(body => {
          expect(res.body).to.be.eql(body)
          done()
        })
      })
  
      it("headers should be equal", () => {
        const headers = _.omit(res.headers, "connection")
        expect(headers).to.be.eql(currentEvent.response.headers)
      })
    })
  })


  describe("sendFile()", () => {

    let res
    before(done => {
      request(app).get("/api/v1/test/123/sendFile").then(r => {
        res = r
        setTimeout(done, 1000)
      })
    })

    describe("response", () => {
      it("status should be equal", () => {
        expect(res.status).to.be.equal(currentEvent.response.status)
      })
  
      it("body should be equal", done => {
        currentEvent.response.body.then(body => {
          expect(res.body).to.be.eql(body)
          done()
        })
      })
  
      it("headers should be equal", () => {
        const headers = _.omit(res.headers, "connection")
        expect(headers).to.be.eql(currentEvent.response.headers)
      })
    })
  })


  describe("render()", () => {

    let res

    before(done => {

      currentEvent = null
      request(app).get("/api/v1/test/123/render").then(r => {
        res = r
        done()
      })
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

  describe("404 - route not exists", () => {

    let res

    before(done => {

      currentEvent = null
      request(app).get("/api/v1/test/123/404").then(r => {
        res = r
        done()
      })
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