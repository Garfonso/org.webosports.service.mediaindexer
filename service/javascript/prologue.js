/*global IMPORTS, require:true, console, Config */

console.log("Starting to load libraries.");

//webos specific imports:
var Foundations = IMPORTS.foundations;
var Future = Foundations.Control.Future;
var PalmCall = Foundations.Comms.PalmCall;
var DB = Foundations.Data.DB;

//node.js imports:
if (typeof require === "undefined") {
	require = IMPORTS.require;
}
var fs = require("fs");
//var taglib = require("taglib");
var sqlite = require("sqlite3");

console.log("--------->Loaded Libraries OK");

var log = function (msg) {
	"use strict";
	console.log(msg);
};

var debug = function (modul, msg) {
	"use strict";
	if (Config.debug.all || Config.debug[modul]) {
		console.log(msg);
	}
};
