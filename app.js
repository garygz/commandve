var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//require all routes
var routes = require('./routes/index');
var users = require('./routes/users');
var snippets = require('./routes/snippets');
var groups = require('./routes/groups');

var app = express();

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  //success - db is ready
});

var User = require('./db/models/user')(mongoose);
var Group = require('./db/models/group')(mongoose);
var Snippet = require('./db/models/snippet')(mongoose);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/ace_editor',  express.static(__dirname + '/ace_editor'));



//User routes
app.get('/api/users', users.list_users(User));
app.get('/api/users/:id', users.find_user(User));
app.get('/api/users/:user_id/snippets', snippets.find_user_snippets(User, Snippet));

//Snippet routes
app.get('/api/snippets', snippets.list_snippets(User, Snippet));
app.get('/api/snippets/:id', snippets.find_snippet(User, Snippet));
app.post('/api/snippets', snippets.create_new_snippet(User, Snippet));
app.put('/api/snippets/:id', snippets.edit_snippet(User, Snippet));
app.delete('/api/snippets/:id', snippets.delete_snippet(User, Snippet));

//search routes
app.get('/api/search', snippets.search_snippet(User, Snippet));

//group routes
app.get('/api/users/:user_id/groups', groups.list_groups(Group));
app.get('/api/users/:user_id/groups/:id', groups.find_group(Group));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
