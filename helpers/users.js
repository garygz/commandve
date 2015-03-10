var UserModel = null;
//using dependency injection
exports.setUserModel = function(User){
  UserModel = User;
}

exports.findUser = function(githubId, callbackSuccess, callbackError){
  console.log("find user", githubId);
  UserModel.findOne({githubId:githubId}, function(error, user){

     if(error)  {
          console.log("find user error", error);
          callbackError(error);
      }else{

         console.log("found user", user);
         callbackSuccess(user);
      }
  });
}

exports.createUser = function(profile, callbackSuccess, callbackError){
  var createArgs = {username: profile.login,
                email:profile.email || '<TBD>',//email might be resolved later as it's another request for some OAuth providers
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

exports.findOrCreateUser = function(profile, callbackSuccess, callbackError){
  console.log("findOrCreate", profile["id"]);
  exports.findUser(profile.id,function(user){
    if(user){
      callbackSuccess(user);
    }else{
      //get email
      exports.createUser(profile, callbackSuccess, callbackError);
    }
  });
}


