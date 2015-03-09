var express = require('express');
var querystring = require('querystring');
//todo read from confog file
var CLIENT_ID = '9e8ff83bdb61dae15c5c';
var CLIENT_SECRET = '13a3d9632063f5f9229c17e9b704d1c9ae620f1d';



// module.exports = router;
var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};

var findOrCreateUser = function(profile, callback){
  console.log("findOrCreate", profile);

   User.create({username: profile.username, email:profile.email, githubId: profile.id, refreshToken: profile.refreshToken}, function(error, user){
        if(error)  {
          handleErrors(error, res);
         }else{
          callback.call();
         }

  });
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


exports.authenticate_github = function(User, http){
  return function(req,res){
    var code = req.query.code;
    console.log()
    if(!code){
      redirect('/login');
    }else{
        var post_data = querystring.stringify({
             client_id : CLIENT_ID,
             client_secret : CLIENT_SECRET,
             code : code
          });

        var options = {
          host: 'github.com',
          path: '/login/oauth/access_token',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
          }

        };
        console.log("getting user tokens for",code,post_data);
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
                //findOrCreateUser(data, function(){res.redirect('/')});
            });
          });
          // post the data
          postReq.write(post_data);
          postReq.end();

        }catch(e){
          console.log(e.stack);
          res.status(500).send();
        }

    }
  }
};
