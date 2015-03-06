var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   //res.send('respond with a resource');
// });

// module.exports = router;
var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};

exports.list_users = function(User){
  return function(req,res){
    var testUserName = "username_"+Date.now();
    var testUser = User( {username: testUserName, email: testUserName + "@gmail.com", password:"123"});
    testUser.save(function(err){
      if(err){
          handleErrors(err, res,"Failed to save new user", err, testUser.username);
      }

    });

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
