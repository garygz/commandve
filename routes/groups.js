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

