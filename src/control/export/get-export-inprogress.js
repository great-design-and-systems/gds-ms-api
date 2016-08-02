'use strict';
var rest = require('restler');
var GetExportResource = require('./get-export-resource');
function execute(callback) {
    new GetExportResource('get-export-inprogress', function (err, path) {
        rest.get(path, {
            timeout: process.env.CALL_TIMEOUT || 20000
        }).on('success', function (data) {
            callback(undefined, data);
        }).on('error', function (err) {
            console.error('get-export-inprogress', err);
            callback(err);
        }).on('fail', function (err) {
            console.error('get-export-inprogress', err);
            callback(err);
        });
    });
}

module.exports = execute;