/*jslint node: true */
/*global log, debug, Future, ActivityHelper, PalmCall, Config */

var CheckIndexAssistant = function () {
	"use strict";
};

CheckIndexAssistant.prototype.run = function (outerFuture) {
	"use strict";
	var future = new Future(), args = this.controller.args;

	function handleError(msg, error) {
		if (!error) {
			error = {};
		}
		log(msg + ": " + JSON.stringify(error));
		outerFuture.result = { returnValue: false, success: false, needUpdate: false, message: error.message};
	}



	return outerFuture;
};

CheckIndexAssistant.prototype.complete = function (activity) {
	"use strict";
	var future = new Future({returnValue: true}), restart;
	if (activity) {
		log("Completing activity " + activity.name);
		restart = activity.name === Config.activityName; //could also be called from command line. Don't restart then.
		return activity.complete(restart);
	}
	return future;
};