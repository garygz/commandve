"use strict";

var httpsHelper = require("./https-helper");
var constants = require('./constants.js');
var gitHubGroups = require('./git-hub');
var syncJob = require('./sync_jobs');

var GroupModel = null;
var UserModel = null;
var SnippetModel = null;

//dependency injection
exports.setModels = function(User,Group,Snippet){
  UserModel = User;
  GroupModel = Group;
  SnippetModel = Snippet;
  gitHubGroups.setModels(User,Group,Snippet);
}

exports.findOrCreateGitHubGroup = function(user,callbackSuccess,callbackError){
  var callbackSuccessNew = function(group){
    console.log('git hib is created', err);
      callbackSuccess();
      //gitHubGroups.importGists(group,user);
  }
  var onFail = function(err){
    callbackError();
    console.log('Failed to import git hub gists', err);
  }
  var callbackSuccessFind = function(group){
    console.log('git hub is found',group);
    if(group == null){
      createGitHubGroup(user,callbackSuccessNew,onFail);
    }else{
      console.log('call git hub success',callbackSuccess);
       callbackSuccess();
    }
  }
  findGitHubGroup(user,callbackSuccessFind,onFail);
}

exports.findOrCreateUncategorized = function(userId, callbackSuccess,callbackError){
    var user = {_id : userId}
    var findOptions = {
        user: user._id,
        group_type: constants.GROUP_TYPE_UNCATEGORIZED
    }
    var createOptions = {
      user: user._id,
      group_type: constants.GROUP_TYPE_UNCATEGORIZED,
      name: constants.GROUP_NAME_UNCATEGORIZED,
      description: constants.GROUP_DESCR_UNCATEGORIZED
    }
    console.log("create other group", createOptions);
    exports.findOrCreateNewGroup(user, findOptions, createOptions,callbackSuccess,callbackError);
}

exports.findOrCreateNewGroup = function(user, findOptions, createOptions,callbackSuccess,callbackError){

  var callbackSuccessFind = function(group){
    if(group == null){
      createGroup(user, createOptions, callbackSuccess,callbackError);
    }else{
      callbackSuccess(group);
    }
  }
  findGroup(user, findOptions, callbackSuccessFind,callbackError);
}

exports.findOrCreateDefaultGroups = function(user,callbackSuccess,callbackError){

  var job1 = function(onSuccess, onError){
    exports.findOrCreateGitHubGroup(user,onSuccess,onError);
  }
  var job2 = function(onSuccess, onError){
    exports.findOrCreateUncategorized(user._id,onSuccess,onError);
  }
  syncJob.syncUpJobs([job1, job2], callbackSuccess,callbackError);
}

var findGroup = function(user,condition, callbackSuccess,callbackError){
  condition.user = user._id;
  GroupModel.findOne(condition, function(err,group){
    if(err){
      callbackError(err);
    }else{
      callbackSuccess(group);
    }
  });
}

var createGroup = function(user,options,callbackSuccess,callbackError){
  console.log('create group',options);
  GroupModel.create(
    options, function(err,group){
    if(err){
      callbackError(err);
    }else{
      callbackSuccess(group);
    }
  });
}

var findGitHubGroup = function(user,callbackSuccess,callbackError){
  var condition = {group_type:constants.GROUP_TYPE_GITHUB, user: user._id};
  findGroup(user,condition,callbackSuccess,callbackError);
}

var createGitHubGroup = function(user,callbackSuccess,callbackError){
  var options = {
      group_type:constants.GROUP_TYPE_GITHUB,
      user: user._id,
      name: constants.GROUP_NAME_GITHUB,
      description: constants.GROUP_DESCR_GITHUB
    }
    createGroup(user, options,callbackSuccess,callbackError);
}

