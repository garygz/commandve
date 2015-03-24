var httpHelper = require('../helpers/https-helper.js'),
    users = require('../helpers/users.js'),
    querystring = require('querystring'),
    groups = require('../helpers/groups.js'),
    google = require('../helpers/googleplus');


var CLIENT_ID     = null;
var CLIENT_SECRET = null;
var APP_MODE      = null;
var ENABLE_CLIENT_SIDE_LOGGING = false;
var GOOGLE_CLIENT_ID = null;
var GOOGLE_CLIENT_SECRET = null;
var GOOGLE_REDIRECT_URL = null;

var GroupModel = null;
var UserModel = null;
var SnippetModel = null;

exports.setModels = function(User,Group,Snippet){
  UserModel = User;
  GroupModel = Group;
  SnippetModel = Snippet;
  groups.setModels(User,Group,Snippet);
  users.setModels(User,Group,Snippet);
}

exports.setGitHubOAuth = function(clientId, clientSecret, appMode, googleClientId, googleClientSecret,googleRedirectURL){
  CLIENT_ID = clientId;
  CLIENT_SECRET = clientSecret;
  APP_MODE = appMode;
  //REMOVE false this for TEST ONLY
  ENABLE_CLIENT_SIDE_LOGGING = "false";//(APP_MODE === 'development').toString();
  GOOGLE_CLIENT_ID = googleClientId;
  GOOGLE_CLIENT_SECRET = googleClientSecret;
  GOOGLE_REDIRECT_URL = google.setRedirectURL(googleRedirectURL);
}

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

//deprecated - we will use github for now
exports.signup_user = function(User){
  return function(req,res){
    console.log("create user", req.body);
    User.create({username: req.body.username, email:req.body.email, password: req.body.password}, function(error, user){
        if(error)  {
          handleErrors(error, res);
         }else{
          res.json(user);
         }

    });
  }
}

exports.authenticate_google = function(){
    return function(req,res) {
      console.log("google code",req.query);

      //this is the final step after a user logged in
      var onCreateGroup = function(){
        res.redirect('/');
      }
      var onCreateUserSuccess = function(user){
          groups.findOrCreateDefaultGroupsForGoogle(user,onCreateGroup,onFail);
          req.session.user = user;
      };

      var onResolveUser = function(tokens,userProfile){
        var userJSON = users.convertFromGoogleToUser(userProfile,tokens);
        users.findOrCreateUser(userJSON, onCreateUserSuccess,onFail);

      }
      var onFail = function(err){
        handleErrors(err,res);
      }

      var onObtainTokens = function(tokens){
        google.getUser(tokens,onResolveUser, onFail);
      }

      google.getTokens(req.query.code, onObtainTokens,onFail);
    }
}

exports.authenticate_github = function(){
  return function(req,res){
    var code = req.query.code;

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
                      var onFailEmail = function(err){
                        console.log(err,"Failed to obtain email from GitHub", user._id);
                      }
                      var onFailGroups = function(err){
                        console.log(err,"Failed to create default groups", user._id);
                        onDefaultGroupCreation();
                      }
                      var onDefaultGroupCreation = function(){
                        console.log("login success", user);
                        req.session.user = user;
                        res.redirect('/');
                      }

                      var onEmailResoluionSuccess = function(user){
                        groups.findOrCreateDefaultGroups(user, onDefaultGroupCreation, onFailGroups);
                      };

                      resolveGitHubProfileEmail(user, onEmailResoluionSuccess, onFailEmail);

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


exports.get_logged_in_user = function(){
  return function(req,res){
    console.log("login", req.query);
    if (req.query.mode){
      var clientIdJson = {
        clientId: CLIENT_ID,
        googleAuthURL: GOOGLE_REDIRECT_URL,
        mode: APP_MODE,
        log: ENABLE_CLIENT_SIDE_LOGGING
      }
      res.json(clientIdJson);
    }else if (req.session.user){
      res.json(req.session.user);
    }else{
      res.status(404).send();
    }

  }
}

exports.delete_user = function(User){
    return function(req, res){
      var id = req.params.user_id;
      var removeParm = {user:id};
      console.log("delete user", id);
      if(!id){
        res.status(400).send();
      }

      var deleteUser = function(err){
        UserModel.remove(removeParm, function(err){
          if(err){
            handleErrors(err,res);
          }else{
            res.status(200).send();
          }
        });

      };
      var deleteAllGroups = function(){
          GroupModel.remove(removeParm, function(err){
            if(err){
              handleErrors(err,res);
            }else{
              deleteUser();
            }
          });
      };

      var deleteAllSnippets = function(){
        SnippetModel.remove(removeParm, function(err){
          if(err){
            handleErrors(err,res);
          }else{
            deleteAllGroups();
          }
        })
      };

      deleteAllSnippets();
    };
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
      callbackSuccess(user);
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



