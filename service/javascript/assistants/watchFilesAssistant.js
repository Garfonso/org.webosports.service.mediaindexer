/*jslint node: true */
/*global log, debug, Future */

var WatchFilesAssistant = function () {
	"use strict";
};

WatchFilesAssistant.prototype.run = function (outerFuture) {
	"use strict";
	var future = new Future();

	function handleError(msg, error) {
		log(msg + ": " + JSON.stringify(error));
		outerFuture.result = { returnValue: false, success: false, error: true, msg: error.message};
	}

	//TODO: use node.js to watch for filesystem changes and on chages update device database

	return outerFuture;
};
