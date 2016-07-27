'use strict';
var GetTimeResource = require('./get-time-resource');
var rest = require('restler');

function execute(data, callback) {
    new GetTimeResource('check-in-visitor', function (err, path) {
        rest.post(path, {
            data: data
        }).on('complete', function (result) {
            if (result instanceof Error) {
                callback({
                    message: 'Failed to checkin with data: ' + data
                });
            } else {
                callback(undefined, {
                    timeInID: result.result
                });
            }
        });
    });
}

module.exports = execute;