var GroupModel = null;
var UserModel = null;
var SnippetModel = null;

//dependency injection
exports.setModels = function(User,Group,Snippet){
  UserModel = User;
  GroupModel = Group;
  SnippetModel = Snippet;
}

exports.findUser = function(findCondition, callbackSuccess, callbackError){
  console.log("find user", findCondition);
  UserModel.findOne(findCondition, function(error, user){

     if(error)  {
          console.log("find user error", error);
          callbackError(error);
      }else{

         console.log("found user", user);
         callbackSuccess(user);
      }
  });
}

exports.convertFromGoogleToUser = function(googleProfile, tokens){
  return {
    username: googleProfile.displayName,
    email:  googleProfile.emails[0].value,
    token: tokens.access_token,
    usertype: "google",
    googleId: googleProfile.id
  }
}

exports.createUser = function(createArgs, callbackSuccess, callbackError){
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
  console.log("findOrCreate", profile);
  var findCondition = null,
      createOptions = null;

  if (profile.usertype && profile.usertype === 'google'){
    findCondition = {googleId: profile.googleId};
    createOptions = profile;
  }else{
    findCondition = {githubId: profile.id};
    createOptions = {username: profile.login,
      email:profile.email || '<TBD>',//email might be resolved later as it's another request for some OAuth providers
      githubId: profile.id,
      token: profile.token,
      gists_url: profile.gists_url
    };
  }
  exports.findUser(findCondition,function(user){
    if(user){
      callbackSuccess(user);
    }else{
      //create user
      exports.createUser(profile, callbackSuccess, callbackError);
    }
  });
}


