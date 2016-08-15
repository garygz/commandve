/**
 * Created by gary on 8/13/16.
 */
"use strict";
exports.mixin = function(source, target){
		for (var prop in source) {
			if (source.hasOwnProperty(prop)) {
				target[prop] = source[prop];
			}
		}
		return target;
};

