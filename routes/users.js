/**
 * Route which supports all CRUD operations
 * in relations to account creation and login
 */

var httpHelper = require('../helpers/https-helper.js'),
    users = require('../helpers/users.js'),
    querystring = require('querystring'),
		appConfig = require('../helpers/app-config'),
    groups = require('../helpers/groups.js'),
    google = require('../helpers/googleplus'),
    github = require('../helpers/git-hub'),
    utils = require('../helpers/utils');


var clientId,clientSecret,
	appMode,enableClientSideLogging,googleClientId,
	googleClientSecret, googleRedirectUrl;

exports.setGitHubOAuth = function(config){
  clientId = config.clientId;
  clientSecret = config.clientSecret;
  appMode = config.appMode;
  //REMOVE false this for TEST ONLY
  enableClientSideLogging = "false";//(appMode === 'development').toString();
  googleClientId = config.googleClientId;
  googleClientSecret = config.googleClientSecret;
  googleRedirectUrl = google.setRedirectURL(config);
};

exports.listUsers = function(req,res){
	var promise = appConfig.getUserModel().find({}).exec();
	utils.resolvePromiseAndRespond(promise, res);
};


exports.findUser = function(req,res) {
	var promise = appConfig.getUserModel().findById(req.params.id).exec();
	utils.resolvePromiseAndRespond(promise, res);
};

exports.loginUser = function(req,res){
	console.log("login", req.body);
	var onError = utils.createErrorHandler(res),
			promise;

	var onSuccess = function (user) {
		if(user){
			req.session.user = user;
			res.json(user);
		}else{
			res.stats(404).send();
		}
	};

	promise = appConfig.getUserModel().findOne({email:req.body.email, password: req.body.password}).exec();
	promise.then(onSuccess, onError);
};


exports.logoutUser = function(req,res){
	console.log("log out user");
	req.session.destroy();
	res.redirect('/');
};

/*
 deprecated - we will use github for now
 */
exports.signupUser = function(req,res){
	console.log("create user", req.body);
	var promise = appConfig.getUserModel().create({username: req.body.username, email:req.body.email, password: req.body.password}).exec();
	utils.resolvePromiseAndRespond(promise, res);
};

exports.authenticateGoogle = function(req,res) {
	console.log("google code",req.query);

	//this is the final step after a user logged in
	var onCreateGroup = function(){
		res.redirect('/');
	};

	var onCreateUserSuccess = function(user){
			groups.findOrCreateDefaultGroupsForGoogle(user,onCreateGroup,onFail);
			req.session.user = user;
	};

	var onResolveUser = function(tokens,userProfile){
		var userJSON = users.convertFromGoogleToUser(userProfile,tokens);
		users.findOrCreateUser(userJSON, onCreateUserSuccess,onFail);

	};

	var onFail = utils.createErrorHandler(res);

	var onObtainTokens = function(tokens){
		google.getUser(tokens,onResolveUser, onFail);
	};

	google.getTokens(req.query.code, onObtainTokens,onFail);
};

exports.authenticateGithub = function(req,res){
	var code = req.query.code;

	if(code){
		var data = querystring.stringify({
			client_id : clientId,
			client_secret : clientSecret,
			code : code
		});

		var options = {
			host: 'github.com',
			path: '/login/oauth/access_token',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Content-Length': data.length
			}

		};

		var onSuccess = function(accessData){
			console.log(accessData);
			github.getGitHubProfile(accessData, createOnSuccessfulLogin(req, res),logAndRedirectHome);
		};

		httpHelper.httpPost(options,data,onSuccess, logAndRedirectHome);
	}else{
		redirect('/');
	}
};


exports.getLoggedInUser = function(req,res){
	console.log("login", req.query);
	if (req.query.mode){
		var clientIdJson = {
			clientId: clientId,
			googleAuthURL: googleRedirectUrl,
			mode: appMode,
			log: enableClientSideLogging
		};
		res.json(clientIdJson);
	}else if (req.session.user){
		res.json(req.session.user);
	}else{
		res.status(404).send();
	}
};

exports.deleteUser = function(req, res){
	var id = req.params.user_id;
	var removeParm = {user:id};
	console.log("delete user", id);
	if(!id){
		res.status(400).send();
	} else {
		deleteAllSnippets();
	}
};

// Private

var deleteAllGroups = function(res){
	var promise = appConfig.getGroupModel().remove(removeParm).exec();
	promise.then(function(){deleteUser(res)}, utils.createErrorHandler(res));
};

var deleteAllSnippets = function(res){
	var promise = appConfig.getSnippetModel().remove(removeParm).exec();
	promise.then(function(){deleteAllGroups(res)}, utils.createErrorHandler(res));
};

var deleteUser = function(res){
	var promise = appConfig.getUserModel().remove(removeParm).exec();
	promise.then(function(){res.status(200).send()}, utils.createErrorHandler(res));
};

var createOnSuccessfulLogin = function (req, res) {
	return function (user) {
		//SUCCESS - we are able to login
		var onFailEmail = function (err) {
			console.log(err, "Failed to obtain email from GitHub", user._id);
		};
		var onFailGroups = function (err) {
			console.log(err, "Failed to create default groups", user._id);
			onDefaultGroupCreation();
		};
		var onDefaultGroupCreation = function () {
			console.log("login success", user);
			req.session.user = user;
			res.redirect('/');
		};

		var onEmailResoluionSuccess = function (user) {
			groups.findOrCreateDefaultGroups(user, onDefaultGroupCreation, onFailGroups);
		};

		github.resolveGitHubProfileEmail(user, onEmailResoluionSuccess, onFailEmail);

	}
};

var logAndRedirectHome = function(err){
	console.log(err);
	res.redirect('/')
};