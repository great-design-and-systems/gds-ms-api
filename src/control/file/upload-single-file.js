'use strict';
var rest = require('restler');
var GetFileResource = require('./get-file-resource');
function execute(file, userId, callback) {
    new GetFileResource('upload-single-file/' + userId, function (err, path) {
        rest.post(path, {
            multipart: true,
            data: {
                "uploadedFile": file
            }
        }).on('complete', function (result, response) {
            if ((result instanceof Error) || (response && response.statusCode === 404)) {
                console.error('create-export-csv', result);
                callback(result);
            } else {
                callback(undefined, result);
            }
        });
    });
}

module.exports = execute;