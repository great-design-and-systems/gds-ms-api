'use strict';
var GetTimeResource = require('./get-time-resource');
var rest = require('restler');

function execute(timeInID, callback) {
    new GetTimeResource('get-time-info/' + timeInID, function (err, path) {
        rest.get(path).on('complete', function (result) {
            if (result instanceof Error) {
                callback({
                    message: 'Failed to get time info with time id: ' + timeInID
                });
            } else {
                callback(undefined, result);
            }
        });
    });
}

module.exports = execute;