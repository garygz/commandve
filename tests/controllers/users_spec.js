"use strict";

/**
  Require jasmine-node to run
*/

describe('Users Controller', function(){

  var nconf = require('nconf');
  // First consider commandline arguments and environment variables, respectively
  nconf.argv().env();
  // Then load configuration from a designated file.
  nconf.file({ file: './tests/test_config.json' });

  var testDomain = nconf.get('test:domain'),
      request   = require('request'),
      constants = require('../../helpers/constants'),
      userJSON  = null,
      timeOutMs = 250,
      userName  = "testUserName" + Date.now(),
      newUser   = {
        email: userName+"@gmail.com",
        password: "123",
        username: userName
      };

  it("should respond with 404 when user is not logged in", function(done) {
    request(
      testDomain + "/auth/current",
      function(error, response, body){
        expect(response.statusCode).toEqual(404);
        done();
    });
  }, timeOutMs);

  it("should create a new user", function(done) {
    request.post({
      url:testDomain + "/signup",
      form:newUser},
      function(error, response, body){

        expect(response.statusCode).toEqual(200);
        if(response.statusCode === 200){
          var bodyJSON = JSON.parse(body);
          expect(bodyJSON._id).toBeDefined();
          userJSON = bodyJSON;
          expect(userJSON._id).not.toEqual(null);
        }

        done();
    });
  }, timeOutMs);

  it("should login a user", function(done) {
    request.post({url:testDomain
     + "/login", form:newUser}, function(error, response, body){

      expect(response.statusCode).toEqual(200);

      if(response.statusCode === 200){
        var bodyJSON = JSON.parse(body);
        expect(bodyJSON._id).toBeDefined();
        expect(bodyJSON._id).toEqual(userJSON._id);
      }

      done();
    });
  }, timeOutMs);

  it("should logout a user and redirect", function(done) {
    request.get({
      url:testDomain + "/logout",
      followRedirect:false},
      function(error, response, body){
        expect(response.statusCode).toEqual(302);
        done();
    });
  }, timeOutMs);

  it("should delete a user", function(done) {
    request.del({
      url:testDomain + "/api/users/" +userJSON._id},
      function(error, response, body){
        expect(response.statusCode).toEqual(200);
        done();
    });
  }, timeOutMs);
});
