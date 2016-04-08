var assert  = require('assert');
var request = require('supertest');
var app     = require('./server.js');


describe('Middleware response', function () {

  it("serves a bundled css file", function (done) {

    request(app)
      .get('/assets/app-bundle.css')
      .expect(200)
      .expect('Content-Type', /text\/css/)
      .end(function(err, response) {
        if (err) throw err;
        assert.ok(response.text.match(/background: blue/), "The main file should be served");
        assert.ok(response.text.match(/.helper/), "All imported files should be included");
        done()
      });
  })
});
