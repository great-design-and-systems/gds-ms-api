'use strict';
var GetTimeResource = require('./get-time-resource');
var rest = require('restler');

function execute(data, callback) {
    new GetTimeResource('check-in', function (err, path) {
        rest.post(path, {
            data: data
        }).on('complete', function (result) {
            if (result instanceof Error) {
                callback({
                    message: 'Failed to checkin with data: ' + data
                });
            } else {
                callback({
                    timeInID: result._id
                });
            }
        });
    });
}

module.exports = execute;