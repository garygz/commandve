"use strict";

var constants = require('../helpers/constants');
var groups = require('../helpers/groups');

var GroupModel = null;
var UserModel = null;
var SnippetModel = null;

exports.setModels = function(User,Group,Snippet){
  UserModel = User;
  GroupModel = Group;
  SnippetModel = Snippet;
  groups.setModels(Group,Snippet);
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
    Snippet.find({group: req.params.groupId}, function(error, snippets){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(snippets);
        }
    });
  }
}

exports.all_snippets = function(User,Snippet){
  return function(req,res){
    console.log(req.params)
    Snippet.find({}, function(error, snippets){
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


exports.edit_snippet = function(User,Snippet){
  return function(req,res){
    console.log(req.body)
    Snippet.findOneAndUpdate(
      {_id: req.body._id},
      {
       unique_handle:   req.body.unique_handle,
       content:         req.body.content,
       tags:            req.body.tags
      }
       ).exec(
      function(error, snippet){
        if(error){
          handleErrors(error, res);
        }else{
          res.json(snippet);
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
    Snippet.find({user: req.params.user_id}, function(error, snippets){
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
       res.status(200).send();
       update_snippet_count(snippet,1);
    }

    if(req.body.group){
      //group is resolved, create the snippet
     createSnippetFromRequest(req, callbackSuccess,callbackError);
    }else{
      //findOrCreateNewGroup = function(user, findOptions, createOptions,callbackSuccess,callbackError)
      var callbackSuccessGroupCreate = function(group){
        req.body.group = group._id;
        createSnippetFromRequest(req, callbackSuccess,callbackError);
      }

      var user = {_id : req.body.user}
      var findOptions = {
          user: user._id,
          type: constants.GROUP_TYPE_UNCATEGORIZED
      }
      var createOptions = {
        user: user._id,
        type: constants.GROUP_TYPE_UNCATEGORIZED,
        name: constants.GROUP_NAME_UNCATEGORIZED
      }

      groups.findOrCreateNewGroup(user, findOptions, createOptions,callbackSuccessGroupCreate,callbackError);
    }
  }
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

var createSnippetFromRequest = function(req,callbackSuccess,callbackError){
  console.log(req.body);
    var paramsIn = {
        content: req.body.content,
        user: req.body.user,
        unique_handle: req.body.handle,
        tags: req.body.tags
    }
    if(req.body.unique_handle){
      paramsIn.unique_handle = req.body.unique_handle;
    }

    if(req.body.group){
      paramsIn.group = req.body.group;
    }

    if(req.body.tags){
      paramsIn.tags = req.body.tags;
    }

    var snippet = SnippetModel(paramsIn);

    snippet.save(function(err){
      if(err){
        handleErrors(err,res, "Failed to save the snippet");
      }else{
        res.status(200).send();
        update_snippet_count(snippet,1);
      }

    });
}

var update_snippet_count = function(snippet,byValue){
  var update = { $inc: { content_count: byValue }};
  GroupModel.update({group:snippet.group._id},update, function(err,affectedCount){
    if(err){
      console.log('Failed to updated group content count', snippet);
    }else{
      console.log('Updated group content count', affectedCount, snippet);
    }
  });
}
