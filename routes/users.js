var express = require('express');

// module.exports = router;
var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};



exports.list_users = function(User){
  return function(req,res){
    User.find({}, function(error, users){
      if(error)  {
          handleErrors(error, res);
         }else{
          res.json(users);
         }
    });

  }
}

exports.find_user = function(User){
  return function(req,res){
    User.findById(req.params.id, function(error, user){
        if(error)  {
          handleErrors(error, res);
         }else{
          res.json(user);
         }

    });
  }
}

exports.login_user = function(User){
  return function(req,res){
    //Using oauth so we should have the info in cookies
    console.log("login", req.cookies);
    User.findOne({email:req.body.email, password: req.body.password}, function(error, user){
        if(error)  {
          handleErrors(error, res);
         }else{
          if(user){
            req.session.user = user;
            res.json(user);
          }else{
            res.stats(404).send();
          }

         }

    });
  }
}

exports.login_user = function(User){
  return function(req,res){
    console.log("login", req.body);
    User.findOne({email:req.body.email, password: req.body.password}, function(error, user){
        if(error)  {
          handleErrors(error, res);
         }else{
          if(user){
            req.session.user = user;
            res.json(user);
          }else{
            res.stats(404).send();
          }

         }

    });
  }
}



exports.logout_user = function(User){
  return function(req,res){
    req.session.destroy();
    res.status(200).send();
  }
}


exports.signup_user = function(User){
  return function(req,res){
    User.create({username: req.body.username, email:req.body.email, password: req.body.password}, function(error, user){
        if(error)  {
          handleErrors(error, res);
         }else{
          res.json(user);
         }

    });
  }
}




