var GroupModel = null;
var UserModel = null;
var SnippetModel = null;

var groups = require('../helpers/groups.js');
var constants = require('../helpers/constants.js');

//dependency injection
exports.setModels = function(User,Group,Snippet){
  UserModel = User;
  GroupModel = Group;
  SnippetModel = Snippet;
  groups.setModels(User,Group,Snippet);
}

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
}

var calcGroupSnippetCount =  function(groups, callbackSuccess,callbackError) {

  var agg = [
    {$group: {
      _id: "$group",
      total: {$sum: 1}
    }}
  ];

  SnippetModel.aggregate(agg, function(err, logs){
    if (err){
        callbackError();
    }else{
      groups.forEach(function(item){item.content_count = 0;)});
      console.log(logs);
      for(var i = 0;i<logs.length;i++){
        var groupElemnt = logs[i];
        console.log(groupElemnt);
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
}

exports.list_groups = function(Group,Snippet){
  return function(req,res){
    Group.find({user: req.params.user_id}, function(error, groups){
      if(error)  {
          handleErrors(error, res);
         }else{
          res.json(groups);
         }
    });

  }
}

exports.find_group = function(Group,Snippet){
  return function(req,res){
    Group.findById(req.params.id, function(error, group){
        if(error)  {
          handleErrors(error, res);
         }else{
          res.json(group);
         }

    });
  }
}

exports.find_user_groups = function(Group,Snippet){
  return function(req,res){
    Group.find({user: req.params.userId}).sort({created_at: -1}).exec(function(error, groups){
      if(error)  {
          handleErrors(error, res);
         }else{
          var onSuccess = function(){res.json(groups);}
          var onFail = function(err){handleErrors(err, res, "Failed to get group counts")}
          calcGroupSnippetCount(groups, onSuccess, onFail);

         }
    });

  }
}

exports.create_group = function(Group,Snippet){
  return function(req,res){

    var onSuccess = function(group){
      res.json(group);
    }

    var onFail = function(err){
      handleErrors(err,res,"Failed to create a group");
    }

    var user = {_id : req.params.user_id}

    if(!user._id){
      res.status(400).status("Missing user id");
      return;
    }
    var findOptions = {
        user: user._id,
        name: req.body.name,
        group_type: constants.GROUP_TYPE_UNCATEGORIZED
    }
    var createOptions = {
      user: user._id,
      group_type: constants.GROUP_TYPE_UNCATEGORIZED,
      name: req.body.name,
      description: req.body.description,
    }

    if(req.body.image_url){
      createOptions.image_url = req.body.image_url;
    }

    console.log("create group", createOptions);
    groups.findOrCreateNewGroup(user, findOptions, createOptions,onSuccess,onFail);

  }
}

//TODO update using findOne and save
//otherwise all fields get overwritten
exports.update_group = function(Group,Snippet){
  return function(req,res){
    var onSuccess = function(group){
      res.status(200).send("group created");
    }

    var onFail = function(err){
      handleErrors(err,res,"Failed to update a group");
    }

    var user = {_id : req.body.user}
    var findOptions = {
        _id: req.params.id
    }
    var updateOptions = {
      name: req.body.name,
      description: req.body.description,
    }

    if(req.body.image_url){
      createOptions.image_url = req.body.image_url;
    }

    console.log("update group", updateOptions);
    Group.update(findOptions, updateOptions, function(err, count){
        if(err){
          onFail(err);
        }else{
          onSuccess();
        }
    });

  }
}

exports.delete_group = function(User, Group) {
  return function(req, res){
    Group.findOneAndRemove(
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
  }
}