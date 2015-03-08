var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};



exports.list_groups = function(Group){
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

exports.find_group = function(Group){
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


