"use strict";
/**
 * Router which support CRUD of snippets
 */
var constants = require('../helpers/constants'),
    groups = require('../helpers/groups'),
		appConfig = require('../helpers/app-config'),
    gitHub = require('../helpers/git-hub.js');

exports.listSnippets = function(req,res){
    console.log(req.params);
    appConfig.getSnippetModel().find({group: req.params.groupId}).sort({updated_at: -1}).exec( function(error, snippets){
      if(error){
        handleErrors(error, res);
      }else{
        console.log(snippets);
        res.json(snippets);
      }
    });
};

//TODO limit this to admins only
exports.getAllSnippets = function(req, res){
    console.log(req.params);
    appConfig.getSnippetModel().find({}).sort({updated_at: -1}).exec(function(error, snippets){
      if(error){
        handleErrors(error, res);
      }else{

        res.json(snippets);
      }
    });
};

exports.deleteSnippet = function(req,res){
    appConfig.getSnippetModel().findOneAndRemove({
      _id: req.params.id
    }).exec(
      function(error, snippet){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(snippet);
        }
      });
};

exports.findSnippet = function(req,res){
    appConfig.getSnippetModel().findById(req.params.id).populate('user').exec(
      function(error, snippet){
        if(error){
          handleErrors(err, res);
        }else{
          res.json(snippet);
        }

      });
};

exports.findUserSnippets = function(req,res){
    appConfig.getSnippetModel().find({user: req.params.user_id}).sort({updated_at: -1}).exec(function(error, snippets){
      if(error){
        handleErrors(error, res);
      }else{
        res.json(snippets);
      }

    });
};

exports.createNewSnippet = function(req,res){
    var callbackError = function(err){
      handleErrors(err,res, "Failed to save the snippet");
    };

    var callbackSuccess = function(snippet){
      processSuccessSnippetOperation(res,snippet, true);
    };

    if(req.body.group){
      //group is resolved, create the snippet
      createSnippetFromRequest(req, res,callbackSuccess,callbackError);
    }else{
      //findOrCreateNewGroup = function(user, findOptions, createOptions,callbackSuccess,callbackError)
      var callbackSuccessGroupCreate = function(group){
        req.body.group = group._id;
        createSnippetFromRequest(req, res, callbackSuccess,callbackError);
      };

      groups.findOrCreateUncategorized(req.body.user, callbackSuccessGroupCreate,callbackError);
    }
};

exports.editSnippet = function(req,res){
    var paramsIn = createSnippetMapFromRequest(req);


    appConfig.getSnippetModel().findOne({_id: req.body._id}).exec(
      function(error,snippet){

        if(error){
          handleErrors(error, res);
        }else{

          var callbackSuccess = function(){
            res.json(snippet);
            createOrUpdateGitsSnippet(snippet);
          };
          updateSnippetAndSave(snippet, paramsIn, callbackSuccess);
        }
      });
};

exports.findSnippet = function(req,res){
    var searchQuery = getQueryParams(req);
    console.log(searchQuery);
    appConfig.getSnippetModel().find({user: req.params.id,
        $text : { $search : searchQuery.query} },
      function(error, snippets){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(snippets);
        }

      });
};

//Private

var SearchQuery = function(type, limit, query){
  this.type = type;
  this.limit = limit;
  this.query = query;
};

var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};

var getQueryParams = function(req){
  return new SearchQuery(req.query.type, req.query.limit, req.query.query);
};

var updateSnippetAndSave = function(snippet, paramsIn, callbackSuccess){
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

};



var createSnippetMapFromRequest = function(req){
   var paramsIn = {
        content: req.body.content,
        user: req.body.user,
        tags: req.body.tags
    };
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
};

var createSnippetFromRequest = function(req,res,callbackSuccess,callbackError){

    var paramsIn = createSnippetMapFromRequest(req);

    console.log("create new snippet",  paramsIn);

    var SnippetModel = appConfig.getSnippetModel(),
				snippet = SnippetModel(paramsIn);

    snippet.save(function(err){
      if(err){
        handleErrors(err,res, "Failed to save the snippet");
      }else{
        processSuccessSnippetOperation(res, snippet, true);
      }

    });
};

var createOrUpdateGitsSnippet = function(snippet, isNew){
    if(!isNew){
      isNew = false;
    }
    var callbackSuccess = function(gist){
      console.log("success: updated gist", gist);
    };

    var callbackError = function(){
      console.log("FAILED: to update gist", snippet);
    };

    appConfig.getSnippetModel().findOne({_id: snippet._id}).populate('user').populate('group').exec(

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
};

var isGroupGitHub = function(group){
  return group.group_type === constants.GROUP_TYPE_GITHUB;
};

var processSuccessSnippetOperation = function(res, snippet, isNew){
  console.log("New Snippet", isNew, snippet);
  res.status(200).send();

  if(!isNew){
    isNew = false;
  }
  createOrUpdateGitsSnippet(snippet, isNew);
};

