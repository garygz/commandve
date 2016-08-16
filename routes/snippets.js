"use strict";
/**
 * Router which support CRUD of snippets
 */
var constants = require('../helpers/constants'),
    groups = require('../helpers/groups'),
		appConfig = require('../helpers/app-config'),
    gitHub = require('../helpers/git-hub.js'),
		utils = require('../helpers/utils');

exports.listSnippets = function(req,res){
    console.log(req.params);
    var promise = appConfig.getSnippetModel().find({group: req.params.groupId}).sort({updated_at: -1}).exec();

		utils.resolvePromiseAndRespond(promise, res);
};

//TODO limit this to admins only
exports.getAllSnippets = function(req, res){
    console.log(req.params);
    var promise = appConfig.getSnippetModel().find({}).sort({updated_at: -1}).exec();

		utils.resolvePromiseAndRespond(promise, res);
};

exports.deleteSnippet = function(req,res){
    var promise = appConfig.getSnippetModel().findOneAndRemove({_id: req.params.id}).exec();

		utils.resolvePromiseAndRespond(promise, res);
};

exports.findSnippet = function(req,res){
    var promise = appConfig.getSnippetModel().findById(req.params.id).populate('user').exec();

		utils.resolvePromiseAndRespond(promise, res);
};

exports.findUserSnippets = function(req,res){
    var promise = appConfig.getSnippetModel().find({user: req.params.user_id}).sort({updated_at: -1}).exec();

		utils.resolvePromiseAndRespond(promise, res);
};

exports.createNewSnippet = function(req,res){
		if ( req.body._id) {
			exports.editSnippet(req, res);
			return;
		}

    var callbackError = utils.createErrorHandler(res, "Failed to save the snippet");

    var callbackSuccess = function(snippet){
      processSuccessSnippetOperation(res,snippet, true);
    };

    if(req.body.group){
      //group is resolved, create the snippet
      createSnippetFromRequest(req, res,callbackSuccess,callbackError);
    }else{
      //findOrCreateNewGroup = function(user, findOptions, createOptions,callbackSuccess,callbackError)
      var callbackSuccessGroupCreate = function(group){
        req.body.group = group._id;
        createSnippetFromRequest(req, res, callbackSuccess,callbackError);
      };

      groups.findOrCreateUncategorized(req.body.user, callbackSuccessGroupCreate,callbackError);
    }
};

exports.editSnippet = function(req,res){
    var paramsIn = createSnippetMapFromRequest(req),
				onFailure = utils.createErrorHandler(res,"Failed to save the snippet"),
				promise;

		var onSuccess = function (snippet) {
			var callbackSuccess = function(){
				res.json(snippet);
				createOrUpdateGitsSnippet(snippet);
			};
			updateSnippetAndSave(snippet, paramsIn, callbackSuccess,onFailure);
		};

    promise = appConfig.getSnippetModel().findOne({_id: req.body._id}).exec();

		promise.then(onSuccess, onFailure);
};

exports.findSnippet = function(req,res){
    var searchQuery = getQueryParams(req),
				promise = appConfig.getSnippetModel().find({user: req.params.id, $text : { $search : searchQuery.query} }).exec();

		utils.resolvePromiseAndRespond(promise, res);
};

//Private

var SearchQuery = function(type, limit, query){
  this.type = type;
  this.limit = limit;
  this.query = query;
};

var getQueryParams = function(req){
  return new SearchQuery(req.query.type, req.query.limit, req.query.query);
};

var updateSnippetAndSave = function(snippet, paramsIn, callbackSuccess, failureCallback){
  snippet.content = paramsIn.content;
  snippet.unique_handle = paramsIn.unique_handle;
  snippet.theme = paramsIn.theme;
  snippet.tags = paramsIn.tags;
  snippet.group = snippet.group;
  snippet.updated_at = new Date();
  snippet.save().then(callbackSuccess, failureCallback);

};

var createSnippetMapFromRequest = function(req){
   var paramsIn = {
        content: req.body.content,
        user: req.body.user,
        tags: req.body.tags
    };
    if(req.body.theme){
      paramsIn.theme = req.body.theme;
    }else{
      paramsIn.theme = constants.DEFAULT_THEME;
    }

    if(req.body.unique_handle){
      paramsIn.unique_handle = req.body.unique_handle;
    }else{
      paramsIn.unique_handle = "New Snippet (" + (new Date()).toDateString() + ")"
    }

    if(req.body.group){
      paramsIn.group = req.body.group;
    }

    if(req.body.tags){
      paramsIn.tags = req.body.tags;
    }
    console.log("Out parms", paramsIn);
    return paramsIn;
};

var createSnippetFromRequest = function(req,res,callbackSuccess,callbackError){

    var paramsIn = createSnippetMapFromRequest(req);


    console.log("create new snippet",  paramsIn);

    var SnippetModel = appConfig.getSnippetModel(),
				snippet = SnippetModel(paramsIn),
				onFailure = utils.createErrorHandler(res, "Failed to save the snippet");

    snippet.save(function (err) {
    		if (err) {
    			onFailure(err);
				} else {
					processSuccessSnippetOperation(res, snippet, true)
				}
		});

};

var createOrUpdateGitsSnippet = function(snippet, isNew){

		isNew = isNew || false;

		var logSuccess = function(gist){
			console.log("success: updated gist", gist);
		};

		var logFailure = function(gist){
			console.log("FAILED: to update gist for: " , snippet);
		};

    var updateGist = function () {
				if(isGroupGitHub(snippet.group)){
					gitHub.updateGist(snippet, logSuccess, logFailure, isNew);
				}
		};

    var promise = appConfig.getSnippetModel().findOne({_id: snippet._id}).populate('user').populate('group').exec();

		promise.then(updateGist, logFailure);
};

var isGroupGitHub = function(group){
  return group.group_type === constants.GROUP_TYPE_GITHUB;
};

var processSuccessSnippetOperation = function(res, snippet, isNew){
  console.log("New Snippet", isNew, snippet);
  res.status(200).send();

	isNew = isNew || false;

	createOrUpdateGitsSnippet(snippet, isNew);
};

