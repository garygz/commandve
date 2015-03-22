"use strict";

/**
  Require jasmine-node to run
*/

describe('Application server', function(){

  var TEST_DOMAIN = "http://localhost:3000";

  var request = require('request');
  var constants = require('../../helpers/constants');
  var userJSON = null;
  var timeOutMs = 250;
  var userName = "testUserName" + Date.now();

  var newUser = {
    email: userName+"@gmail.com",
    password: "123",
    username: userName
  };

  it("should respond with 404 when user is not logged in", function(done) {
    request(TEST_DOMAIN + "/auth/current", function(error, response, body){
      expect(response.statusCode).toEqual(404);
      done();
    });
  }, timeOutMs);

  it("should create a new user", function(done) {
    request.post({url:TEST_DOMAIN + "/signup", form:newUser}, function(error, response, body){
      var bodyJSON = JSON.parse(body);
      expect(response.statusCode).toEqual(200);
      expect(bodyJSON._id).toBeDefined();
      userJSON = bodyJSON;
      expect(userJSON._id).not.toEqual(null);
      done();
    });
  }, timeOutMs);

  it("should login a user", function(done) {
    request.post({url:TEST_DOMAIN + "/login", form:newUser}, function(error, response, body){
      var bodyJSON = JSON.parse(body);
      expect(response.statusCode).toEqual(200);
      expect(bodyJSON._id).toBeDefined();
      expect(bodyJSON._id).toEqual(userJSON._id);
      done();
    });
  }, timeOutMs);


  it("should logout a user and redirect", function(done) {
    request.get({url:TEST_DOMAIN + "/logout", followRedirect:false}, function(error, response, body){
      expect(response.statusCode).toEqual(302);
      done();
    });
  }, timeOutMs);

  it("should delete a user", function(done) {
    request.del({url:TEST_DOMAIN + "/api/users/" +userJSON._id}, function(error, response, body){
      expect(response.statusCode).toEqual(200);
      done();
    });
  }, timeOutMs);
});
