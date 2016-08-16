/**
 * Created by gary on 8/13/16.
 */
"use strict";

/**
 * Object mixin function
 * @param source object
 * @param target object
 * @returns {*} target
 */
exports.mixin = function(source, target){
		for (var prop in source) {
			if (source.hasOwnProperty(prop)) {
				target[prop] = source[prop];
			}
		}
		return target;
};
/**
 * Create a generic error handler function with a custom error message
 * @param res response object
 * @param msg error message (optional)
 * @returns {Function}
 */
exports.createErrorHandler = function (res, msg) {
	return function (err) {
		console.log(err.stack);
		msg = msg || 'Unable to process your request';
		res.status(500).send(msg);
	};
};

/**
 * Write the resulting object using response.json
 * @param res
 * @returns {Function}
 */
exports.createSuccessfulJSONResponse = function (response) {
	return function (result) {
		response.json(result);
	}
};

/**
 * Resolve the promise and use standard success and error handlers
 * @param promise
 * @param res
 */
exports.resolvePromiseAndRespond = function ( promise, res ) {
	promise.then(
		exports.createSuccessfulJSONResponse(res),
		exports.createErrorHandler(res)
	);
};