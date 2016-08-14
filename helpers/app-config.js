/**
 * Created by gary on 8/14/16.
 */

'use strict';
var models;

exports.init = function (config) {
	var nconf = require('nconf'),
			utils = require('./utils'),
			mongoose = config.mongoose,
			environmentMode = config.environmentMode,
			userRouter = config.userRouter,
			session = config.session,
			dbUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/test',
			isEnvDev = environmentMode === 'development',
			oAuthConfig,configDev, configProd, additionalConfToUse, db;

	// First consider commandline arguments and environment variables, respectively
	nconf.argv().env();
// Then load configuration from a designated file.
	nconf.file({ file: 'config.json' });

	mongoose.connect(dbUrl);
	db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		//success - db is ready
	});

	oAuthConfig = {
		appMode: environmentMode,
		googleClientId: nconf.get("google:client_id"),
		googleClientSecret: nconf.get("google:client_secret")
	};

	configDev = {
		clientId:	nconf.get("github:development:client_id"),
		clientSecret:	nconf.get("github:development:client_secret"),
		googleRedirectURL: nconf.get("google:redirect_uri:development")
	};

	configProd = {
		clientId:	 nconf.get("github:production:client_id"),
		clientSecret:	nconf.get("github:production:client_secret"),
		googleRedirectURL: nconf.get("google:redirect_uri:production")
	};

	additionalConfToUse = isEnvDev ? configDev : configProd;

	oAuthConfig = utils.mixin(oAuthConfig, additionalConfToUse);

	userRouter.setGitHubOAuth(oAuthConfig);

};

exports.injectDependencies = function (config) {
	var User = require('../db/models/user')(config.mongoose),
			Group = require('../db/models/group')(config.mongoose),
	 		Snippet = require('../db/models/snippet')(config.mongoose);

	models = {
		user: User,
		group: Group,
		snippet: Snippet
	};
};

exports.getGroupModel = function () {
		return models.group;
};

exports.getSnippetModel = function () {
	return models.snippet;
};

exports.getUserModel = function () {
	return models.user;
};
