/*jslint regexp: true*/

var Config = {
	rootDirectory: "/media/internal",
	excludes: [],
	debug: {
		all: true
	},
	activityName: "org.webosports.service.mediaindexer: Periodic Media Indexing",
	ignore: [/\..*/],
    audioFile: /.+\.(aac|asf|flac|m4a|mp3|mpc|ogg|vox|wav|wma)$/i,
    videoFile: /.+\.(asf|avi|f4v|flv|mkv|mov|mpeg|mp4|mpg|ogg|ts)$/i,
    imageFile: /.+\.(jpg|jpeg|tif|raw|gif|bmp|png|ppm|pgm|pbm|pnm|pfm)$/i
};



//=================================================================
//================== Some convenience functions ===================
//================== Please do not touch ==========================
//=================================================================

Config.prototype.ignoreFile = function (file) {
	"use strict";
	var result = false;
	Config.ignore.forEach(function (regex) {
		if (regex.test(file)) {
			result = true;
		}
	});
	return result;
};
