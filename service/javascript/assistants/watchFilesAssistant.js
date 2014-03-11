/*jslint node: true */
/*global log, debug, Future, fs, Config, taglib, AudioFile */

function handleError(msg, error) {
	"use strict";
	log(msg + ": " + JSON.stringify(error));
}

var WatchFilesAssistant = function () {
	"use strict";
};



WatchFilesAssistant.prototype.processFileChange = function (path) {
	"use strict";
    //find out if file is media file.
    var future = new Future();
    fs.stat(path, future.callback(this, function statCB(err, stats) {
        if (err) {
            handleError("Could not stat file " + path, err);
            future.result = "exit";
        } else {
            future.result = stats;
        }
    }));
        
    future.then(this, function testDirectory() {
        var stats = future.result;
        if (stats.isDirectory() && !this.watchers[path]) {
            this.startWatching(path);
            future.result = { step: "exit" };
        } else {
            future.result = { step: "audio", stats: stats };
        }
    });
    
    future.then(this, function testAudio() {
        var result = future.result;
        if (result.step === "audio" && AudioFile.isAppropriate(path)) {
            log(path + " is audio file, getting tag.");
            taglib.tag(path, future.callback(function tabligCB(err, tag) {
                if (err) {
                    handleError("Could not read audio-tag from file " + path, err);
                    future.result = {step: "video"}; //try video if audio fails?
                } else {
                    future.result = {
                        tag: tag,
                        step: "processtag",
                        stats: result.stats
                    };
                }
            }));
        }
    });
    
    future.then(this, function processAudioTag() {
        var result = future.result, tag, dbobj;
        if (result.step === "processtag") {
            tag = result.tag;
            dbobj = AudioFile.generate(path, result.stats); //fill some generic stuff
            
        }
    });
};

WatchFilesAssistant.prototype.processFileDeletion = function (path) {
	"use strict";
    //find out if this was a directory and if there were indexed files in it.
    //or if it was an indexed file itself.
    //if so, update index, otherwise: nothing to do :)
    //use sqlite for that.
};

WatchFilesAssistant.prototype.changeCallback = function (dir, event, filename) {
	"use strict";
	debug("watcher", "FileChagen: ", filename, " - ", event, " in ", dir);

	var path = dir + "/" + filename;
	if (!Config.ignoreFile(filename)) {
        fs.exists(path, function existsCB(exists) {
            if (exists) {
				this.processFileChange(path);
			} else {
				this.processFileDeletion(path);
			}
		}.bind(this));
	} else {
		debug("watcher", "Ignoring ", filename);
	}

	//TODO: check if filename is filled on target platform.
};

WatchFilesAssistant.prototype.startWatching = function (directory) {
	"use strict";
	this.watchers[directory] = fs.watch(directory, this.changeCallback.bind(this, directory));
	log("Started watching " + directory);

	this.watchers[directory].on("error", function errorCB(error) {
		debug("watcher", "Could not watch filesystem: " + JSON.stringify(error));
		handleError("Could not watch filesystem", error);
	});

	fs.readdir(directory, function (err, files) {
		if (err) {
			handleError("Error, could not read " + directory, err);
		} else {
			files.forEach(function handleFile(value) {
				if (!Config.ignoreFile(value)) {
					fs.stat(directory + "/" + value, function statCB(err, stats) {
						if (err) {
							handleError("Error, could not stat file " + value, err);
						} else {
							if (stats.isDirectory()) {
								this.startWatching(directory + "/" + value);
							}
						}
					}.bind(this));
				}
			}.bind(this));
		}
	}.bind(this));
};

WatchFilesAssistant.prototype.run = function (outerFuture) {
	"use strict";

	log("Watching " + Config.rootDirectory + " for changes...");
	this.watchers = {};

	this.startWatching(Config.rootDirectory);

	outerFuture.result = { returnValue: true };
	return outerFuture;
};

WatchFilesAssistant.prototype.complete = function (activity) {
	"use strict";
	log("Watcher staying active in background...");
	/*if (this.watcher) {
		this.watcher.close();
	}*/
};
