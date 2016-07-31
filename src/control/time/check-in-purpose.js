'use strict';
var GetTimeResource = require('./get-time-resource');
var rest = require('restler');

function execute(timeInID, purpose, callback) {
    new GetTimeResource('check-in-purpose/' + timeInID, function (err, path) {
        rest.put(path, {
            data: { purpose: purpose }
        }).on('complete', function (result) {
            if (result instanceof Error) {
                callback({
                    message: 'Failed to save purpose ' + timeInID
                });
            } else {
                callback(undefined, {
                    message: 'Ok'
                });
            }
        });
    });
}

module.exports = execute;
