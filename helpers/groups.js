"use strict";

var httpsHelper = require("./https-helper");
var constants = require('./constants.js');

var GroupModel = null;
var SnippetModel = null;

//using dependency injection
exports.setModels = function(Group,Snippet){
  GroupModel = Group;
  SnippetModel = Snippet;
}

exports.findOrCreateGitHubGroup - function(user){
  var callbackSuccessNew = function(group){
      importGitHubGists(group,user);
  }
  var callbackError = function(err){
    console.log('Failed to import git hub gists', err);
  }
  var callbackSuccessFind = function(group){
    if(group == null){
      createGitHubGistGroup(user,callbackSuccessNew,callbackError);
    }
  }
  findGitHubGroup(user,callbackSuccessFind,callbackError);
}

exports.findOrCreateNewGroup = function(user, findOptions, createOptions,callbackSuccess,callbackError){

  var callbackSuccessFind = function(group){
    if(group == null){
      createGroup(user, createOptionscallbackSuccess,callbackError);
    }
  }
  findGroup(user, findOptions, callbackSuccessFind,callbackError);
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
    createGroup(options);
}

var importGitHubGists = function(group,user){

}
