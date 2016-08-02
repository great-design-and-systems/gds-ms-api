'use strict';
var GetFileResource = require('./get-file-resource');
var FormData = require('form-data');
function execute(filename, filetype, buffer, userId, callback) {
    new GetFileResource('upload-single-file/' + userId, function (err, path) {
        var form = new FormData();
        form.append('uploadedFile', buffer, {
            filename: filename,
            contentType: filetype,
            knownLength: buffer.length
        });
        form.submit(path, function (errSubmit, resultSubmit) {
            if (errSubmit) {
                console.error('upload-single-file', errSubmit);
                callback(
                    { message: 'Failed to submit file ' + filename }
                );
            } else {
                callback(undefined, resultSubmit);
            }
        });
    });
}

module.exports = execute;