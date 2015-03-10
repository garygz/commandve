"use strict";

var httpModule = require('./https-helper')

var GroupModel = null;
var UserModel = null;
var SnippetModel = null;

exports.setModels = function(User,Group,Snippet){
  UserModel = User;
  GroupModel = Group;
  SnippetModel = Snippet;
}

exports.importGists = function(user, group){
  var options = {
          host: 'api.github.com',
          path: '/users/'+user.username+'/gists?access_token='+user.token,
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'CmdV'
          }
         }

  httpModule.httpGet(options,
    function(text){
      var gists = JSON.parse(text);
      console.log('import gists', user.username, gists);
      createSnippetsFromGists(user, group, gists, callbackSuccess,callbackError);
    },
    function(err){
      console.log('Failed to import gists', err);
    });
}



var createSnippetsFromGists = function(user, group, gists, callbackSuccess,callbackError){
  if (gists == null){
    return null;
  }
  var jobTotal = gists.length;
  var jobCount = 1;
  var jobFinished = function(){
    jobCount+=1;
    if(jobCount === jobTotal){
      callbackSuccess();
    }
  }

  gists.forEach(function(singleGist){
    var snippet = convertGistToSnippet(user, group,singleGist);
    console.log("Create snippet from gist", snippet);
    SnippetModel.create(snippet, function(err,snippet){
      if(!err){
        jobFinished();
      }else{
        callbackError(err);
      }
    });
  });

}

var convertSnippetToGist = function(snippet){
  var fileName = snippet.githubFileName? snippet.githubFileName:"snippet.txt";
  var gist = {
      "description": snippet.unique_handle,
      "public": false,
      "files": {
         fileName: {
          "content": snippet.content
        }
      }
    };
    return gist;
}

var convertGistToSnippet = function(user, group, gist){
  var file = getGistFirstFileContent(gist);
  var snippet = {
      unique_handle: gist.description,
      githubId: gist.id,
      content: file.content,
      githubFileName: file.name,
      group: group._id,
      user: user._id
    };
    return snippet;
}

var getGistFirstFileContent = function(gist){
  var files = gist.files;
  var firstFile = null;
  for(var file in files) {
      if(files.hasOwnProperty(file)) {
          firstFile = files[key];
          break;
      }
  }
  if (firstFile){
    return {name: firstFile, content: firstFile.content};
  }else{
    return "";
  }
}
