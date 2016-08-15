'use strict';

/**
 * Initialize the application, create models
 * and inject them into routes
 * Secure session manager is initialized with MongoDB
 * which supports it natively
 */

var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	appConfig = require('./helpers/app-config'),
	//require all routes
	userRouter = require('./routes/users'),
	snippetRouter = require('./routes/snippets'),
	groupRouter = require('./routes/groups'),
	app = express(),
	nconf = require('nconf'),
	environmentMode = app.get('env'),
	isEnvDev = environmentMode === 'development';

console.log("Running in",app.get('env'),"mode");

appConfig.init({
	mongoose: mongoose,
 	environmentMode: environmentMode,
	userRouter: userRouter,
	session: session
});

appConfig.injectDependencies({
		mongoose: mongoose,
		routes: [userRouter,snippetRouter,groupRouter]
});

// view engine setup for default error handling
app.set('views', path.join(__dirname, 'views'))
		.set('view engine', 'jade');

//setup favorite icon handler
app.use(favicon(__dirname + '/public/favicon.ico'))
	.use(logger('dev'))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false }))
	.use(cookieParser())
	.use(express.static(path.join(__dirname, 'public')))
	.use('/ace_editor',  express.static(__dirname + '/ace_editor'))
	.use(session({
			secret: 'X717197123987123',//TODO change this to a long key
			store: new MongoStore({ mongooseConnection: mongoose.connection }),
			resave: true,
			saveUninitialized: true
	}));



//User routes

if(isEnvDev) {
	app.get('/api/users', userRouter.listUsers);
}

app.get('/api/users/:id', userRouter.findUser);
app.get('/api/users/:user_id/snippets', snippetRouter.findUserSnippets);
app.get('/api/users/:user_id/groups', groupRouter.findUserGroups);
app.post('/api/users/:user_id/snippets', snippetRouter.createNewSnippet);
app.delete('/api/users/:user_id', userRouter.deleteUser);

//Snippet routes
if(isEnvDev) app.get('/api/snippets', snippetRouter.getAllSnippets);

app.get('/api/groups/:groupId/snippets', snippetRouter.listSnippets);
app.post('/api/groups/:groupId/snippets', snippetRouter.createNewSnippet);
app.put('/api/groups/:groupId/snippets/:id', snippetRouter.editSnippet);
app.delete('/api/groups/:groupId/snippets/:id', snippetRouter.deleteSnippet);

//search routes
app.get('/api/search/users/:id', snippetRouter.findSnippet);

//group routes
app.get('/api/users/:user_id/groups', groupRouter.listGroups);
app.get('/api/users/:user_id/groups/:id', groupRouter.findGroups);
app.post('/api/users/:user_id/groups', groupRouter.createGroup);
app.put('/api/users/:user_id/groups/:id', groupRouter.updateGroup);
app.delete('/api/users/:user_id/groups/:id', groupRouter.deleteGroup);

//login routes
app.post('/login/', userRouter.loginUser);
app.get('/logout/', userRouter.logoutUser);
app.post('/signup/', userRouter.signupUser);

//oAuth callbacks
app.get('/auth/github/callback', userRouter.authenticateGithub);
app.get('/oauth2callback', userRouter.authenticateGoogle);

app.get('/auth/current', userRouter.getLoggedInUser);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

/*
 development error handler
 will print stacktrace
*/

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


/*
 production error handler
 no stacktraces leaked to user
 */
app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
