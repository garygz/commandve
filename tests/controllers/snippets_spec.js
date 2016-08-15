"use strict";

describe('Snippets controller', function(){

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


  it("return snippets for a user group", function(done) {
    if(userJSON){
      newSnippet.user = userJSON._id;
      newSnippet.group = groupJSON._id;
    }

    request.get({
      url:testDomain + '/api/groups/'+groupJSON._id+'/snippets'},
      function(error, response, body){
        expect(response.statusCode).toEqual(200);
        if(response.statusCode === 200){
          var bodyJSON = JSON.parse(body);
          var firstSnippet = bodyJSON[0];
          expect(firstSnippet.content).toBeDefined();
          expect(firstSnippet.content).toEqual(newSnippet.content);
          snippetJSON = firstSnippet;
        }

        done();
    });
  }, timeOutMs);


  it("update snippets for a user group", function(done) {
   snippetJSON.content = "function-edited";
   snippetJSON.unique_handle = "handle-edited";

    request.put({
      url:testDomain + '/api/groups/'+groupJSON._id+'/snippets/'+snippetJSON._id,
      form:snippetJSON},
      function(error, response, body){
        expect(response.statusCode).toEqual(200);
        if(response.statusCode === 200){
          var bodyJSON = JSON.parse(body);
          var firstSnippet = bodyJSON;
          expect(firstSnippet.content).toBeDefined();
          expect(firstSnippet.content).toEqual(snippetJSON.content);
          expect(firstSnippet.unique_handle).toEqual(snippetJSON.unique_handle);
        }

        done();
    });
  }, timeOutMs);

  it("should delete a snippet", function(done) {
    request.del({
      url:testDomain + '/api/groups/'+groupJSON._id+'/snippets/'+snippetJSON._id},
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