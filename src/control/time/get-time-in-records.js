'use strict';
var GetTimeResource = require('./get-time-resource');
var rest = require('restler');

function execute(start, end, callback) {
    new GetTimeResource('get-time-in/' + start + '/' + end, function (err, path) {
        rest.get(path).on('complete', function (result) {
            if (result instanceof Error) {
                callback({
                    message: 'Failed to get time in records'
                });
            } else {
                callback(undefined, result);
            }
        });
    });
}

module.exports = execute;