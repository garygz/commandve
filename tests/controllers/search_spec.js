"use strict";

describe('Search Controller', function(){

  var testDomain = "http://localhost:3000",
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


  it("create snippets for a user group", function(done) {
    if(userJSON){
      newSnippet.user = userJSON._id;
      newSnippet.group = groupJSON._id;
    }

    request.post({
      url:testDomain + '/api/groups/'+groupJSON._id+'/snippets',
      form: newSnippet},
      function(error, response, body){
        expect(response.statusCode).toEqual(200);
        done();
    });
  }, timeOutMs);

  it("should return snippets for a user search", function(done) {
    request.get({
      url:testDomain + '/api/search/users/'+userJSON._id+'?query=binarySearch'},
      function(error, response, body){
        expect(response.statusCode).toEqual(200);
        if(response.statusCode === 200){
          var bodyJSON = JSON.parse(body);
          expect(bodyJSON[0]).toBeDefined();
          expect(bodyJSON[0].content).toEqual(newSnippet.content);
        }

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