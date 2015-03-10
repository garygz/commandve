var express = require('express');
var querystring = require('querystring');
var http = require("https");

//todo read from confog file
var CLIENT_ID = '9e8ff83bdb61dae15c5c';
var CLIENT_SECRET = '13a3d9632063f5f9229c17e9b704d1c9ae620f1d';
var UserModel = null;




var httpGet = function(options, callbackSuccess, callbackError){
    console.log('http get',options);
    try{
    var getReq = http.get(options, function (http_res) {
      console.log('Response is '+http_res.statusCode);
      // initialize the container for our data
      var data = "";

      // this event fires many times, each time collecting another piece of the response
      http_res.on("data", function (chunk) {
          // append this chunk to our growing `data` var
          data += chunk;
      });

      // this event fires *one* time, after all the `data` events/chunks have been gathered
      http_res.on("end", function () {
          // you can use res.send instead of console.log to output via express
          console.log("github data in ", data);
          if(data.indexOf('error')>-1 || http_res.statusCode>299){
            //expired token
             callbackError(data);
          }else{
            callbackSuccess(data);
          }


      });
    });


  }catch(e){
    console.log(e.stack);
    callbackError(e);
  }
}



var httpPost = function(options, data,callbackSuccess, callbackError){
  try{
    var postReq = http.request(options, function (http_res) {
      console.log('Response is '+http_res.statusCode);
      // initialize the container for our data
      var data = "";

      // this event fires many times, each time collecting another piece of the response
      http_res.on("data", function (chunk) {
          // append this chunk to our growing `data` var
          data += chunk;
      });

      // this event fires *one* time, after all the `data` events/chunks have been gathered
      http_res.on("end", function () {
          // you can use res.send instead of console.log to output via express
          console.log("github data in ", data);
          if(data.indexOf('error')>-1 || http_res.statusCode>299){
            //expired token
             callbackError(data);
          }else{
            callbackSuccess(data);
          }


      });
    });
    // post the data
    postReq.write(data);
    postReq.end();

  }catch(e){
    console.log(e.stack);
    callbackError(e);
  }
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
    UserModel = User;
    console.log()
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

        httpPost(options,data,
                function(accessData){
                  console.log(accessData);
                  getGitHubProfile(accessData, function(user){
                      //SUCCESS - we are able to login
                      req.session.user = user;
                      console.log("login success", user);
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
  httpGet(options,
    function(text){
      var profile = JSON.parse(text);
      profile.token = cleanToken;
      findOrCreateUser(profile, callbackSuccess,callbackError);
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

var findUser = function(githubId, callbackSuccess, callbackError){
  console.log("find user", githubId);
  UserModel.findOne({githubId:githubId}, function(error, user){

     if(error)  {
          console.log("find user error", error);
          callbackError(error);
      }else{

         console.log("found user", user, callbackSuccess);
         callbackSuccess(user);
      }
  });
}

var createUser = function(profile, callbackSuccess, callbackError){
  var createArgs = {username: profile.login,
                email:profile.email || profile.login+"@gmail.com",//TODO get actual email by issuing one more request
                githubId: profile.id,
                token: profile.token,
                gists_url: profile.gists_url
              };

  console.log("create user", createArgs);
   UserModel.create(createArgs, function(error, user){
        if(error)  {
         callbackError(error);
        }else{
          callbackSuccess(user);
        }

  });
}

var findOrCreateUser = function(profile, callbackSuccess, callbackError){
  console.log("findOrCreate", profile["id"]);
  findUser(profile.id,function(user){
    if(user){
      callbackSuccess(user);
    }else{
      //get email
      createUser(profile, callbackSuccess, callbackError);
    }
  });
}


