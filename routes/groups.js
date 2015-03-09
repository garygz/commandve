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

var jobCount = 1;
var jobFinished = function(total, callback){
  if(jobCount === total){
    callback.call(null);
    jobStarted();
  }else{
    jobCount+=1;
  }
}

var jobStarted = function(){
  jobCount = 1;
}

var assignSnippetCount = function(Snippet,Group,groups,userid,response, callback){
  jobStarted();
  console.log("userid", userid);
   Snippet.aggregate([
        { $match: {
            user: userid
        }},

        { $group: {
            _id: "$group",
            count: { $sum: 1  }
        }}
    ], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Aggregate",result);
    });




  // groups.forEach(function(group){
  //   console.log("count",group._id)
  //   Snippet.find({}).where('group', group._id).count(function (err, count) {
  //       if (err) {
  //         console.log(err);
  //         return handleErrors(err,response
  //           );
  //       }else{
  //          group.snippetCount = count;
  //          console.log("group count: ", group.name, count);
  //         jobFinished(groups.length, callback);
  //       }

  //   });
  // });
}

exports.list_groups = function(Group,Snippet){
  return function(req,res){
    Group.find({user: req.params.user_id}, function(error, groups){
      if(error)  {
          handleErrors(error, res);
         }else{
          //FIX this to support actual logged in users
          var userid = req.session.user ? req.session.user.userid : '54fb97b211a8fdea326df321';
          assignSnippetCount (Group,
                              Snippet,
                              groups,
                              userid,
                              res,
                              function(){
                                console.log("sending groups");
                                res.json(groups);
                              });
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


