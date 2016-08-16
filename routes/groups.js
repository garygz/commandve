/**
 * Route which handles CRUD operations related to snippet groups
 * Use of Promises is on TODO list
 */

var groups = require('../helpers/groups.js'),
    appConfig = require('../helpers/app-config'),
    constants = require('../helpers/constants.js'),
		utils = require('../helpers/utils');

//Public

exports.listGroups = function(req,res){
		var query = appConfig.getGroupModel().find({user: req.params.user_id}),
				promise = query.exec();

		utils.resolvePromiseAndRespond( promise, res);

};

exports.findGroups = function(req,res){
		var promise = appConfig.getGroupModel().findById(req.params.id).exec();

		utils.resolvePromiseAndRespond( promise, res);
};

exports.findUserGroups = function(req,res){
    var userId = req.params.user_id,
			promise = appConfig.getGroupModel().find({user: userId}).sort({created_at: 1}).exec();

		var onSuccess = function ( groups ) {
			var onSuccess = function(){res.json(groups);};
			var onFail = utils.createErrorHandler(res, "Failed to get group counts");
			calcGroupSnippetCount(groups, onSuccess, onFail);
		};

		promise.then(
			onSuccess,
			utils.createErrorHandler(res)
		);

};

exports.createGroup = function(req,res){
    var onSuccess = createSuccessfulGroupResponse(res),
				onFail = utils.createErrorHandler(res, "Failed to create a group"),
				user = {_id : req.params.user_id};

    if(!user._id){
      res.status(400).status("Missing user id");
      return;
    }

    var findOptions = {
        user: user._id,
        name: req.body.name,
        group_type: constants.GROUP_TYPE_UNCATEGORIZED
    };
    var createOptions = {
				user: user._id,
				group_type: constants.GROUP_TYPE_UNCATEGORIZED,
				name: req.body.name,
				description: req.body.description
    };

    if(req.body.image_url){
      createOptions.image_url = req.body.image_url;
    }

    console.log("create group", createOptions);
    groups.findOrCreateNewGroup(user, findOptions, createOptions,onSuccess,onFail);
};

//TODO update using findOne and save
//otherwise all fields get overwritten
exports.updateGroup = function(req,res){
		var user = {_id : req.body.user},
    	 	findOptions = {
        _id: req.params.id
    		},
				updateOptions = {
					name: req.body.name,
					description: req.body.description
				},
				onFail = utils.createErrorHandler(res, "Failed to update a group"),
				promise;

    if(req.body.image_url){
      updateOptions.image_url = req.body.image_url;
    }

    var onSuccess = function(){
      appConfig.getGroupModel().findOne(findOptions).then(
	      	createSuccessfulGroupResponse(res),
					onFail
        );
    };

    console.log("update group", updateOptions);
    promise = appConfig.getGroupModel().update(findOptions, updateOptions).exec();

		promise.then (
			onSuccess,
			onFail
		);
};

exports.deleteGroup = function(req, res){
    //TODO remove all snippetRouter for a group first
    var promise = appConfig.getGroupModel().findOneAndRemove({_id: req.params.id}).exec();

		utils.resolvePromiseAndRespond( promise, res);
};

//Private

var findGroupById = function(id, groups){
  if(groups==null){
    return null;
  }
  for(var i=0;i<groups.length;i++){

    if(groups[i]._id.equals(id)){
      return groups[i];
    }
  }
  return null;
};

var calcGroupSnippetCount =  function(groups, callbackSuccess,callbackError) {
  if(groups === null || groups.length === 0){
    return;
  }

  var calculateGroupSnippetCountProjection = [
    {$match: {
      user: groups[0].user
    }},

    {$group: {
      _id: "$group",
      total: {$sum: 1}
    }}
  ];
  console.log("aggregate groups by", calculateGroupSnippetCountProjection);
  var promise = appConfig.getSnippetModel().aggregate(calculateGroupSnippetCountProjection).exec();

	var onSuccess = function (logs) {
		groups.forEach(function(item){item.content_count = 0;});
		console.log(logs);
		for(var i = 0;i<logs.length;i++){
			var groupElemnt = logs[i];

			var groupId = groupElemnt._id;
			var foundGroup = findGroupById(groupId, groups);

			if(foundGroup){
				foundGroup.content_count = groupElemnt.total;
			}
		}
		groups.forEach(function(item){item.save();});
		callbackSuccess(groups);
	};

	promise.then(onSuccess, callbackError);
};