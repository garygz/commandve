var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   //res.send('respond with a resource');
// });

// module.exports = router;

exports.list_users = function(User){
  return function(req,res){
    var testUserName = "username_"+Date.now, email;
    var testUser = User( {username: testUserName, email: testUserName + "@gmail.com", password:"123"});
    testUser.save(function(err){
      console.log("Failed to save new user", testUser.username);
    });

    User.find({}, function(error, users){
        res.json({ users: users });
    });
  }
}
