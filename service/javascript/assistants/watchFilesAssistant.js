/*jslint node: true */
/*global log, debug, Future, fs, Config */

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

	this.watcher = fs.watch(Config.rootDirectory, function changeCB(event, filename) {
		debug("FileChagen: " + filename + " - " + event);

		//TODO: check if filename is filled on target platform.

	});

	this.watcher.on("error", function errorCB(error) {
		debug("Could not watch filesystem: " + JSON.stringify(error));
		handleError("Could not watch filesystem", error);
	});

	return outerFuture;
};

WatchFilesAssistant.prototype.complete = function (activity) {
	"use strict";
	if (this.watcher) {
		this.watcher.close();
	}
};