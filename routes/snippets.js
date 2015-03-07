var handleErrors = function(err, res, msg){
  console.log(err.stack);
  msg = msg || 'Unable to process your request';
  res.status(500).send(msg);
};

exports.list_snippets = function(User,Snippet){
  return function(req,res){
    // console.log('parmas are' + params)

    var snippet =  Snippet({content: "bla bla bla bla", user: '54f9e8e2e537f8cc40e63265'});
    snippet.save(function(err){
      if(err){
          console.log("Failed to save new snippet", err, snippet.content);
      }

    });

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
          handleError(err, res);
        }else{
          res.json(snippets);
        }

    });
  }
}
