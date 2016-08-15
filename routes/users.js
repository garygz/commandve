var httpHelper = require('../helpers/https-helper.js'),
    users = require('../helpers/users.js'),
    querystring = require('querystring'),
		appConfig = require('../helpers/app-config'),
    groups = require('../helpers/groups.js'),
    google = require('../helpers/googleplus'),
    github = require('../helpers/git-hub');


var CLIENT_ID,CLIENT_SECRET,CLIENT_SECRET,CLIENT_SECRET,CLIENT_SECRET,
	APP_MODE,ENABLE_CLIENT_SIDE_LOGGING,GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL;

exports.setGitHubOAuth = function(config){
  CLIENT_ID = config.clientId;
  CLIENT_SECRET = config.clientSecret;
  APP_MODE = config.appMode;
  //REMOVE false this for TEST ONLY
  ENABLE_CLIENT_SIDE_LOGGING = "false";//(APP_MODE === 'development').toString();
  GOOGLE_CLIENT_ID = config.googleClientId;
  GOOGLE_CLIENT_SECRET = config.googleClientSecret;
  GOOGLE_REDIRECT_URL = google.setRedirectURL(config);
};

exports.listUsers = function(req,res){
	appConfig.getUserModel().find({}, function(error, users){
      if(error)  {
          handleErrors(error, res);
         }else{
          res.json(users);
         }
    });

};


exports.findUser = function(req,res) {
	appConfig.getUserModel().findById(req.params.id, function (error, user) {
		if (error) {
			handleErrors(error, res);
		} else {
			res.json(user);
		}

	});
};

exports.loginUser = function(req,res){
    console.log("login", req.body);
    appConfig.getUserModel().findOne({email:req.body.email, password: req.body.password}, function(error, user){
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
};


exports.logoutUser = function(req,res){
    console.log("log out user");
    req.session.destroy();
    res.redirect('/');
};

/*
 deprecated - we will use github for now
 */
exports.signupUser = function(req,res){
    console.log("create user", req.body);
    appConfig.getUserModel().create({username: req.body.username, email:req.body.email, password: req.body.password}, function(error, user){
        if(error)  {
          handleErrors(error, res);
         }else{
          res.json(user);
         }

    });
};

exports.authenticateGoogle = function(req,res) {
      console.log("google code",req.query);

      //this is the final step after a user logged in
      var onCreateGroup = function(){
        res.redirect('/');
      };

      var onCreateUserSuccess = function(user){
          groups.findOrCreateDefaultGroupsForGoogle(user,onCreateGroup,onFail);
          req.session.user = user;
      };

      var onResolveUser = function(tokens,userProfile){
        var userJSON = users.convertFromGoogleToUser(userProfile,tokens);
        users.findOrCreateUser(userJSON, onCreateUserSuccess,onFail);

      };

      var onFail = function(err){
        handleErrors(err,res);
      };

      var onObtainTokens = function(tokens){
        google.getUser(tokens,onResolveUser, onFail);
      };

      google.getTokens(req.query.code, onObtainTokens,onFail);
};

exports.authenticateGithub = function(req,res){
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
                  github.getGitHubProfile(accessData, function(user){
                      //SUCCESS - we are able to login
                      var onFailEmail = function(err){
                        console.log(err,"Failed to obtain email from GitHub", user._id);
                      };
                      var onFailGroups = function(err){
                        console.log(err,"Failed to create default groups", user._id);
                        onDefaultGroupCreation();
                      };
                      var onDefaultGroupCreation = function(){
                        console.log("login success", user);
                        req.session.user = user;
                        res.redirect('/');
                      };

                      var onEmailResoluionSuccess = function(user){
                        groups.findOrCreateDefaultGroups(user, onDefaultGroupCreation, onFailGroups);
                      };

											github.resolveGitHubProfileEmail(user, onEmailResoluionSuccess, onFailEmail);

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
};


exports.getLoggedInUser = function(req,res){
    console.log("login", req.query);
    if (req.query.mode){
      var clientIdJson = {
        clientId: CLIENT_ID,
        googleAuthURL: GOOGLE_REDIRECT_URL,
        mode: APP_MODE,
        log: ENABLE_CLIENT_SIDE_LOGGING
      };
      res.json(clientIdJson);
    }else if (req.session.user){
      res.json(req.session.user);
    }else{
      res.status(404).send();
    }
};

exports.deleteUser = function(req, res){
      var id = req.params.user_id;
      var removeParm = {user:id};
      console.log("delete user", id);
      if(!id){
        res.status(400).send();
      }

      var deleteUser = function(err){
        appConfig.getUserModel().remove(removeParm, function(err){
          if(err){
            handleErrors(err,res);
          }else{
            res.status(200).send();
          }
        });

      };
      var deleteAllGroups = function(){
          appConfig.getGroupModel().remove(removeParm, function(err){
            if(err){
              handleErrors(err,res);
            }else{
              deleteUser();
            }
          });
      };

      var deleteAllSnippets = function(){
        appConfig.getSnippetModel().remove(removeParm, function(err){
          if(err){
            handleErrors(err,res);
          }else{
            deleteAllGroups();
          }
        })
      };

      deleteAllSnippets();
};

var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};
