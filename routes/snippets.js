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
    Snippet.find({}, function(error, snippets){
        if(error){
          handleError(err, res);
        }else{
          res.json(snippets);
        }

    });
  }
}

exports.find_snippet = function(User,Snippet){
  return function(req,res){
    Snippet.findById(req.params.id).populate('user').exec(
      function(error, snippet){
        if(error){
          handleError(err, res);
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
    console.log(req.body);
    var snippet =  Snippet({content: req.body.content, user: req.body.user});
    snippet.save(function(err){
      if(err){
          console.log("Failed to save new snippet", err, snippet.content);
      }

    });
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
