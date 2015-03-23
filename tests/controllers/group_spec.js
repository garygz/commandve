"use strict";

describe('Group controller', function(){
  var nconf = require('nconf');
  // First consider commandline arguments and environment variables, respectively
  nconf.argv().env();
  // Then load configuration from a designated file.
  nconf.file({ file: './tests/test_config.json' });

  var testDomain = nconf.get('test:domain'),
      request   = require('request'),
      constants = require('../../helpers/constants'),
      userJSON  = null,
      groupJSON = null,
      snippetJSON = null,
      timeOutMs = 250,
      userName  = "testUserName" + Date.now(),
      newUser   = {
        email: userName+"@gmail.com",
        password: "123",
        username: userName
      },
      newGroup = {
        name: "TestGroup"
      },
      newSnippet = {
          content: "function binarySearch(){\ntest++;\n}",
          unique_handle: "TestSnippet",
          tags: ["Test"]
      };

  it("should create a new user", function(done) {
    request.post({
      url:testDomain + "/signup", form:newUser},
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

  it("should create a new user group", function(done) {
    request.post({
      url:testDomain + '/api/users/'+userJSON._id+'/groups',
      form:newGroup},
      function(error, response, body){

        expect(response.statusCode).toEqual(200);
        if(response.statusCode === 200){
          var bodyJSON = JSON.parse(body);
          expect(bodyJSON._id).toBeDefined();
          groupJSON = bodyJSON;
          expect(groupJSON._id).not.toEqual(null);
        }
        done();
    });
  }, timeOutMs);

  it("should update a user group", function(done) {
    newGroup.name = "edit-name";
    newGroup.description = "edit-description";
    newGroup.image_url = "http://test.png";

    request.put({
      url:testDomain + '/api/users/'+userJSON._id+'/groups/' + groupJSON._id,
      form:newGroup},
      function(error, response, body){
        expect(response.statusCode).toEqual(200);

        if(response.statusCode === 200){
          var bodyJSON = JSON.parse(body);
          expect(bodyJSON._id).toBeDefined();
          expect(bodyJSON.name).toEqual(newGroup.name);
          expect(bodyJSON.description).toEqual(newGroup.description);
          expect(bodyJSON.image_url).toEqual(newGroup.image_url);
        }
        done();
    });
  }, timeOutMs);


  it("should delete a user group", function(done) {
    request.del({
      url:testDomain + '/api/users/'+userJSON._id+'/groups/'+ groupJSON._id},
      function(error, response, body){
        expect(response.statusCode).toEqual(200);
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