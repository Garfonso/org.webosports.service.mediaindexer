/*global exports, Config */

var AudioFile = {
    generate: function (filename, stats, result) {
        "use strict";
        if (!result) {
            result = {
                bookmark: 0,
                createdTime: 0,
                disc: {
                    position: 1,
                    total: 1
                },
                duration: 0,
                isRingtone: false,
                modifiedTime: 0,
                path: "",
                serviced: false,
                size: 0,
                thumbnails: [],
                track: {
                    position: 1,
                    total: 1
                }
            };
        }

        if (stats) {
            result.createdTime = stats.ctime.getTime() / 1000;
            result.modifiedTime = stats.mtime.getTime() / 1000;
            result.size = stats.size;
        }
        if (filename) {
            result.path = filename;
        }

        return result;
    },

    fillKeys: function (result) {
        "use strict";
        if (!result.softKey) {
            result.softKey = {};
        }

        result.softKey.trackAndDisc = String(result.disc.position || 0) + String(result.track.position || 0);
        result.softKey.albumArtistDiscAndTrack = (result.album || "")
                    + (result.artist || "")
                    + result.softKey.trackAndDisc;
        result.softKey.albumDiscAndTrack = (result.album || "") + result.softKey.trackAndDisc;

        result.searchKey = (result.artist || "") + " " + (result.album || "") + " " + (result.title || "");
        return result;
    },
    
    isAppropriate: function (file) {
        "use strict";
        var result = true;
        Config.audioFile.forEach(function (regex) {
            if (regex.test(file)) {
                result = false;
            }
        });
        return result;
    }
};

exports.AudioFile = AudioFile;