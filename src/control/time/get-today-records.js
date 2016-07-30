'use strict';
var GetTimeResource = require('./get-time-resource');
var rest = require('restler');

function execute(today, callback) {
    new GetTimeResource('get-today-records/' + today, function (err, path) {
        rest.get(path).on('complete', function (result) {
            if (result instanceof Error) {
                callback({
                    message: 'Failed to get today records'
                });
            } else {
                callback(undefined, result);
            }
        });
    });
}

module.exports = execute;