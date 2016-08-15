"use strict";

var httpsHelper = require("./https-helper"),
    constants = require('./constants.js'),
    gitHubGroups = require('./git-hub'),
    syncJob = require('./sync_jobs'),
    mongooseIds = require('../helpers/mongoose_objectid'),
    appConfig = require('../helpers/app-config');

exports.findOrCreateGitHubGroup = function(user,callbackSuccess,callbackError){
  var callbackSuccessNew = function(group){
      callbackSuccess(group);
      gitHubGroups.importGists(user,group);
  };

  var onFail = function(err){
    callbackError();
    console.log('Failed to import git hub gists', err);
  };

  var callbackSuccessFind = function(group){
    if(group == null){
      createGitHubGroup(user,callbackSuccessNew,onFail);
    }else{
       callbackSuccess(group);
    }
  };
  findGitHubGroup(user,callbackSuccessFind,onFail);
};

exports.findOrCreateUncategorized = function(userId, callbackSuccess,callbackError){
    var user = {_id : userId};
    var findOptions = {
        user: user._id,
        group_type: constants.GROUP_TYPE_UNCATEGORIZED
    };
    var createOptions = {
      user: user._id,
      group_type: constants.GROUP_TYPE_UNCATEGORIZED,
      name: constants.GROUP_NAME_UNCATEGORIZED,
      description: constants.GROUP_DESCR_UNCATEGORIZED,
      image_url: constants.MISC_IMAGE
    };

    exports.findOrCreateNewGroup(user, findOptions, createOptions,callbackSuccess,callbackError);
};

exports.findOrCreateSublime = function(userId, callbackSuccess,callbackError){
    var user = {_id : userId};
    var findOptions = {
        user: user._id,
        group_type: constants.GROUP_TYPE_SUBLIME
    };
    var createOptions = {
      user: user._id,
      group_type: constants.GROUP_TYPE_SUBLIME,
      name: constants.GROUP_NAME_SUBLIME,
      description: constants.GROUP_DESCR_SUBLIME,
      image_url: constants.SUBLIME_IMAGE
    };

    exports.findOrCreateNewGroup(user, findOptions, createOptions,callbackSuccess,callbackError);
};

exports.findOrCreateNewGroup = function(user, findOptions, createOptions,callbackSuccess,callbackError){

  var callbackSuccessFind = function(group){
    if(group == null){
      createGroup(user, createOptions, callbackSuccess,callbackError);
    }else{
      callbackSuccess(group);
    }
  };
  findGroup(user, findOptions, callbackSuccessFind,callbackError);
};

exports.findOrCreateDefaultGroups = function(user,callbackSuccess,callbackError){

  var job1 = function(onSuccess, onError){
    exports.findOrCreateGitHubGroup(user,onSuccess,onError);
  };
  var job2 = function(onSuccess, onError){
    exports.findOrCreateUncategorized(user._id,onSuccess,onError);
  };
  var job3 = function(onSuccess,onError){
    exports.findOrCreateSublime(user._id,onSuccess,onError);
  };
  syncJob.syncUpJobs([job1, job2, job3], callbackSuccess,callbackError);
};

exports.findOrCreateDefaultGroupsForGoogle = function(user,callbackSuccess,callbackError){


  var job1 = function(onSuccess, onError){
    exports.findOrCreateUncategorized(user._id,onSuccess,onError);
  };

  syncJob.syncUpJobs([job1], callbackSuccess,callbackError);
};

var findGroup = function(user,condition, callbackSuccess,callbackError){
  condition.user = (typeof user._id) == "string"? mongooseIds.castToObjectId(user._id): user._id;
  console.log("look for group", condition);
  appConfig.getGroupModel().findOne(condition, function(err,group){
    if(err){
      callbackError(err);
    }else{
      console.log("group found", group);
      callbackSuccess(group);
    }
  });
};

var createGroup = function(user,options,callbackSuccess,callbackError){
  console.log('create group',options);
  appConfig.getGroupModel().create(
    options, function(err,group){
    if(err){
      callbackError(err);
    }else{
      callbackSuccess(group);
    }
  });
};

var findGitHubGroup = function(user,callbackSuccess,callbackError){
  var condition = {group_type:constants.GROUP_TYPE_GITHUB, user: user._id};

  findGroup(user,condition,callbackSuccess,callbackError);
};

var createGitHubGroup = function(user,callbackSuccess,callbackError){
  var options = {
      group_type:constants.GROUP_TYPE_GITHUB,
      user: user._id,
      name: constants.GROUP_NAME_GITHUB,
      description: constants.GROUP_DESCR_GITHUB,
      image_url: constants.GIT_IMAGE
    };
    createGroup(user, options,callbackSuccess,callbackError);
};

