'use strict';
var rest = require('restler');
var GetFacultyResource = require('./get-faculty-resource');
var API = 'faculty-profile/';

function execute(barcode, callback) {
    new GetFacultyResource(API + barcode, function (err, path) {
        rest.get(path).on('complete', function (result, response) {
            if (result instanceof Error) {
                if (response.statusCode === 404) {
                    callback({
                        status: 404,
                        message: result.message
                    });
                } else {
                    callback(result);
                }
            } else {
                callback(undefined, result);
            }
        });
    });
}

module.exports = execute;