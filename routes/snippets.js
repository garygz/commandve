"use strict";

var constants = require('../helpers/constants');
var groups = require('../helpers/groups');
var gitHub = require('../helpers/git-hub.js');

var GroupModel = null;
var UserModel = null;
var SnippetModel = null;

exports.setModels = function(User,Group,Snippet){
  UserModel = User;
  GroupModel = Group;
  SnippetModel = Snippet;
  groups.setModels(User,Group,Snippet);
}

var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};

var SearchQuery = function(type, limit, query){
  this.type = type;
  this.limit = limit;
  this.query = query;
}

var getQueryParams = function(req){
  return new SearchQuery(req.query.type, req.query.limit, req.query.query);
}

exports.list_snippets = function(User,Snippet){
  return function(req,res){
    console.log(req.params)
    Snippet.find({group: req.params.groupId}).sort({updated_at: -1}).exec( function(error, snippets){
        if(error){
          handleErrors(error, res);
        }else{
          console.log(snippets);
          res.json(snippets);
        }
    });
  }
}
//TODO linit this to admins only
exports.all_snippets = function(User,Snippet){
  return function(req,res){
    console.log(req.params)
    Snippet.find({}).sort({updated_at: -1}).exec(function(error, snippets){
        if(error){
          handleErrors(error, res);
        }else{

          res.json(snippets);
        }
    });
  }
}


exports.delete_snippet = function(User,Snippet){
  return function(req,res){
    Snippet.findOneAndRemove(
      {_id: req.params.id}
       ).exec(
      function(error, snippet){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(snippet);
          update_snippet_count(snippet,-1);
        }
    });
  }
}


exports.find_snippet = function(User,Snippet){
  return function(req,res){
    Snippet.findById(req.params.id).populate('user').exec(
      function(error, snippet){
        if(error){
          handleErrors(err, res);
        }else{
          res.json(snippet);
        }

    });
  }
}


exports.find_user_snippets = function(User,Snippet){
  return function(req,res){
    Snippet.find({user: req.params.user_id}).sort({updated_at: -1}).exec(function(error, snippets){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(snippets);
        }

    });
  }
}



exports.create_new_snippet = function(User,Snippet){
  return function(req,res){
    var callbackError = function(err){
        handleErrors(err,res, "Failed to save the snippet");
    }

    var callbackSuccess = function(snippet){
       processSuccessSnipetOperation(res,snippet, true);
    }

    if(req.body.group){
      //group is resolved, create the snippet
     createSnippetFromRequest(req, res,callbackSuccess,callbackError);
    }else{
      //findOrCreateNewGroup = function(user, findOptions, createOptions,callbackSuccess,callbackError)
      var callbackSuccessGroupCreate = function(group){
        req.body.group = group._id;
        createSnippetFromRequest(req, res, callbackSuccess,callbackError);
      }

      groups.findOrCreateUncategorized(req.body.user, callbackSuccessGroupCreate,callbackError);
    }
  }
}

exports.edit_snippet = function(User,Snippet){
  return function(req,res){
     var paramsIn = createSnippetMapFromRequest(req);


    Snippet.findOne({_id: req.body._id}).exec(
      function(error,snippet){

        if(error){
          handleErrors(error, res);
        }else{

          var callbackSuccess = function(){
            res.json(snippet);
            createOrUpdateGitsSnippet(snippet);
          }
          updateFieldsOnSnippet(snippet, paramsIn, callbackSuccess);
        }
    });
  }
}

var updateFieldsOnSnippet = function(snippet, paramsIn, callbackSuccess){
  snippet.content = paramsIn.content;
  snippet.unique_handle = paramsIn.unique_handle;
  snippet.theme = paramsIn.theme;
  snippet.tags = paramsIn.tags;
  snippet.group = snippet.group;
  snippet.updated_at = new Date();
  snippet.save(function(err){
      if(err){
        handleErrors(err,res, "Failed to save the snippet");
      }else{
        callbackSuccess();
      }
    }
  );

}

exports.search_snippet = function(User,Snippet){
  return function(req,res){
    var searchQuery = getQueryParams(req);
    console.log(searchQuery);
    Snippet.find({ $text : { $search : searchQuery.query} }, function(error, snippets){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(snippets);
        }

    });
  }
}
var createSnippetMapFromRequest = function(req){
   var paramsIn = {
        content: req.body.content,
        user: req.body.user,
        tags: req.body.tags
    }
    if(req.body.theme){
      paramsIn.theme = req.body.theme;
    }else{
      paramsIn.theme = constants.DEFAULT_THEME;
    }

    if(req.body.unique_handle){
      paramsIn.unique_handle = req.body.unique_handle;
    }else{
      paramsIn.unique_handle = "New Snippet (" + (new Date()).toDateString() + ")"
    }

    if(req.body.group){
      paramsIn.group = req.body.group;
    }

    if(req.body.tags){
      paramsIn.tags = req.body.tags;
    }
    console.log("Out parms", paramsIn);
    return paramsIn;
}

var createSnippetFromRequest = function(req,res,callbackSuccess,callbackError){

    var paramsIn = createSnippetMapFromRequest(req);

    console.log("create new snippet",  paramsIn);

    var snippet = SnippetModel(paramsIn);

    snippet.save(function(err){
      if(err){
        handleErrors(err,res, "Failed to save the snippet");
      }else{
        processSuccessSnipetOperation(res, snippet, true);
      }

    });
}
//TODO FIX THIS
var update_snippet_count = function(snippet,byValue){
  // console.log('update count on group for',snippet);
  // var update = { $inc: { content_count: byValue }};
  // GroupModel.update({group:snippet.group._id},update, function(err,affectedCount){
  //   if(err){
  //     console.log('Failed to updated group content count', snippet);
  //   }else{
  //     console.log('Updated group content count', affectedCount, snippet);
  //   }
  // });
}


var createOrUpdateGitsSnippet = function(snippet, isNew){
    if(!isNew){
      isNew = false;
    }
    var callbackSuccess = function(gist){
      console.log("success: updated gist", gist);
    }

    var callbackError = function(){
      console.log("FAILED: to update gist", snippet);
    }

    SnippetModel.findOne({_id: snippet._id}).populate('user').populate('group').exec(

      function(err,snippet){
        console.log("resolve snippet", snippet, err);
        if(!err){
          if(isGroupGitHub(snippet.group)){
            gitHub.updateGist(snippet,callbackSuccess,callbackError, isNew);
          }
        }else{
          callbackError(err);
        }
      }
    );
}

var isGroupGitHub = function(group){
  return group.group_type === constants.GROUP_TYPE_GITHUB;
}

var processSuccessSnipetOperation = function(res,snippet, isNew){
  console.log("New Snippet", isNew, snippet);
  res.status(200).send();
  update_snippet_count(snippet,1);
  if(!isNew){
    isNew = false;
  }
  createOrUpdateGitsSnippet(snippet, isNew);
}

