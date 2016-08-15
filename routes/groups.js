/**
 * Route which handles CRUD operations related to snippet groups
 * Use of Promises is on TODO list
 */

var groups = require('../helpers/groups.js'),
    appConfig = require('../helpers/app-config'),
    constants = require('../helpers/constants.js');

//Public

exports.listGroups = function(req,res){
    appConfig.getGroupModel().find({user: req.params.user_id}, function(error, groups){
      if(error)  {
          handleErrors(error, res);
         }else{
          res.json(groups);
         }
    });
}

exports.findGroups = function(req,res){
    appConfig.getGroupModel().findById(req.params.id, function(error, group){
        if(error)  {
          handleErrors(error, res);
         }else{
          res.json(group);
         }

    });
};

exports.findUserGroups = function(req,res){
    appConfig.getGroupModel().find({user: req.params.user_id}).sort({created_at: 1}).exec(function(error, groups){
      if(error)  {
          handleErrors(error, res);
         }else{
          var onSuccess = function(){res.json(groups);}
          var onFail = function(err){handleErrors(err, res, "Failed to get group counts")}
          calcGroupSnippetCount(groups, onSuccess, onFail);

         }
    });
};

exports.createGroup = function(req,res){

    var onSuccess = function(group){
      res.json(group);
    };

    var onFail = function(err){
      handleErrors(err,res,"Failed to create a group");
    };

    var user = {_id : req.params.user_id};

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
      description: req.body.description,
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


    var user = {_id : req.body.user};
    var findOptions = {
        _id: req.params.id
    };
    var updateOptions = {
      name: req.body.name,
      description: req.body.description
    };

    if(req.body.image_url){
      updateOptions.image_url = req.body.image_url;
    }

    var onSuccess = function(){
      appConfig.getGroupModel().findOne(findOptions, function(err, group){
        if(err){
          onFail(err);
        }else{
          res.json(group);
        }
      });

    };

    var onFail = function(err){
      handleErrors(err,res,"Failed to update a group");
    };

    console.log("update group", updateOptions);
    appConfig.getGroupModel().update(findOptions, updateOptions, function(err, count){
        if(err){
          onFail(err);
        }else{
          onSuccess();
        }
    });
};

exports.deleteGroup = function(req, res){
    //TODO remove all snippetRouter for a group first
    appConfig.getGroupModel().findOneAndRemove(
      {_id: req.params.id}
    ).exec(
      function(error, group){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(group);
        }
      }
    );
};

//Private

var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};

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
  appConfig.getSnippetModel().aggregate(calculateGroupSnippetCountProjection, function(err, logs){
    if (err){
      callbackError();
    }else{
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
      groups.forEach(function(item){item.save();})
      callbackSuccess(groups);
    }


  });
};