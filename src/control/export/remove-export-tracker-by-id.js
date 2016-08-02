'use strict';
var rest = require('restler');
var GetExportResource = require('./get-export-resource');
function execute(exportId, callback) {
    new GetExportResource(exportId, function (err, path) {
        rest.del(path, {
            timeout: process.env.CALL_TIMEOUT || 20000
        }).on('success', function (data) {
            callback(undefined, data);
        }).on('error', function (err) {
            console.error('remove-export-tracker-by-id', err);
            callback(err);
        }).on('fail', function (err) {
            console.error('remove-export-tracker-by-id', err);
            callback(err);
        });
    });
}

module.exports = execute;