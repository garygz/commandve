"use strict";

var httpsHelper = require("./https-helper");

var GROUP_TYPE_GITHUB = "github-gist";
var GROUP_NAME_GITHUB = "My GitHub Gists";
var GROUP_DESCR_GITHUB = "Gists group which exposes your GitHub gists and automatically synchronizes them with GitHub.";
var GIT_GIST_ID_PLACEHOLDER = "{/gist_id}";

var GroupModel = null;
var SnippetModel = null;

//using dependency injection
exports.setupModels = function(Group,Snippet){
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
      createGitHubGistGroup(callbackSuccessNew,callbackError);
    }
  }
  findGitHubGroup(callbackSuccess,callbackError);
}

var findGitHubGroup = function(user,callbackSuccess,callbackError){
  GroupModel.findOne({group_type:GROUP_TYPE_GITHUB, user: user._id}, function(err,group){
    if(err){
      callbackError(err);
    }else{
      callbackSuccess(group);
    }
  });
}

var createGitHubGroup = function(user,callbackSuccess,callbackError){
  GroupModel.create(
    {
      group_type:GROUP_TYPE_GITHUB,
      user: user._id,
      name: GROUP_NAME_GITHUB,
      description: GROUP_DESCR_GITHUB
    }, function(err,group){
    if(err){
      callbackError(err);
    }else{
      callbackSuccess(group);
    }
  });
}

var importGitHubGists = function(group,user){

}
