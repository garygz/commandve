var express = require('express');
var httpHelper = require('../helpers/https-helper.js')
var users = require('../helpers/users.js')
var querystring = require('querystring');
var groups = require('../helpers/groups.js');


//todo read from confog file
var CLIENT_ID = '9e8ff83bdb61dae15c5c';
var CLIENT_SECRET = '13a3d9632063f5f9229c17e9b704d1c9ae620f1d';


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
    console.log("log out user");
    req.session.destroy();
    res.redirect('/');
  }
}

//deprecated - we will use giyhub for now
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


exports.authenticate_github = function(User, http){
  return function(req,res){
    var code = req.query.code;
    //set the model for the helper methods
    users.setUserModel(User);

    if(!code){
      redirect('/');
    }else{
        var data = querystring.stringify({
             client_id : CLIENT_ID,
             client_secret : CLIENT_SECRET,
             code : code
          });

        var options = {
          host: 'github.com',
          path: '/login/oauth/access_token',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Length': data.length
          }

        };

        httpHelper.httpPost(options,data,
                function(accessData){
                  console.log(accessData);
                  getGitHubProfile(accessData, function(user){
                      //SUCCESS - we are able to login

                      resolveGitHubProfileEmail(user, function(){console.log("git hub resolved for", user)}, function(){console.log("git hub NOT resolved for", user)});
                      console.log("login success", user);
                      req.session.user = user;
                      res.redirect('/');
                    },
                     function(err){
                        console.log(err);
                        res.redirect('/')
                     }
                  );
                },
                function(err){
                  console.log(err);
                  res.redirect('/')
               });

    }
  }
};


exports.get_logged_in_user = function(User){
  return function(req,res){
    if (req.session.user){
      res.json(req.session.user);
    }else{
      res.status(404).send();
    }

  }
}

var getGitHubProfile = function(urlEncodedToken, callbackSuccess, callbackError){
  var dataPart = urlEncodedToken.split('&');
  var token = dataPart[0];//.replace('access_token=','');
  var options = {
          host: 'api.github.com',
          path: '/user?'+token,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'CmdV'
          }

    };
  var cleanToken = token.replace('access_token=','');
  httpHelper.httpGet(options,
    function(text){
      var profile = JSON.parse(text);
      profile.token = cleanToken;
      users.findOrCreateUser(profile, callbackSuccess,callbackError);
    },
    function(err){
      callbackError(err);
    }
  )
}

var resolveGitHubProfileEmail = function(user, callbackSuccess, callbackError){

  var options = {
          host: 'api.github.com',
          path: '/user/emails?access_token='+user.token,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'CmdV'
          }

    };

  httpHelper.httpGet(options,
    function(text){
      var profile = JSON.parse(text)[0];
      console.log('resolve github email', profile);
      user.email = profile.email;
      user.save();

    },
    function(err){
      callbackError(err);
    }
  )
}


// module.exports = router;
var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};

