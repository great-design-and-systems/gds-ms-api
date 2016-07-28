'use strict';
var rest = require('restler');
var GetStudentResource = require('./get-student-resource');
var API = 'student-profile/';

function execute(barcode, callback) {
    new GetStudentResource(API + barcode, function (err, path) {
        rest.get(path).on('complete', function (result, response) {
            if ((result instanceof Error) || (response && response.statusCode === 404)) {
                callback({
                    status: 404,
                    message: result.message
                });
            } else {
                 callback(undefined,result);
            }
        });
    });
}

module.exports = execute;