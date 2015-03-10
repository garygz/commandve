var GroupModel = null;
var UserModel = null;
var SnippetModel = null;

var groups = require('../helpers/groups.js');


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
    if(groups[i]._id === id){
      return groups[i];
    }
  }
  return null;
}

var assignSnippetCount = function(Snippet,Group,groups,userid,resposne, callback){
  // console.log('groups for',userid);
  // var agg =[
  //           //{ $match : { user : userid } },

  //           { $group: { _id: '$group', count: { $sum: 1 } } }
  //          ];

  // Snippet.aggregate(agg, function(err, results){
  //   if (err) {
  //     handleErrors(err,resposne);
  //   }else{
  //     callback.call();
  //   }

  //   console.log(results);
  // });
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
    Group.find({user: req.params.userId}, function(error, groups){
      if(error)  {
          handleErrors(error, res);
         }else{
          res.json(groups);
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

    var user = {_id : req.body.user}
    var findOptions = {
        user: user._id,
        group_type: constants.GROUP_TYPE_UNCATEGORIZED
    }
    var createOptions = {
      user: req.body.user,
      group_type: constants.GROUP_TYPE_UNCATEGORIZED,
      name: req.body.name,
      description: req.body.description,
    }

    if(req.body.image_url){
      createOptions.image_url = req.body.image_url;
    }

    console.log("create group", createOptions);
    exports.findOrCreateNewGroup(user, findOptions, createOptions,onSuccess,onFail);

  }
}


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
