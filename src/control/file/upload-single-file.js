'use strict';
var GetFileResource = require('./get-file-resource');
var restler = require('restler');
var fs = require('fs-extra');
function execute(filePath, fileSize, fileType, userId, callback) {
    new GetFileResource('upload-single-file/' + userId, function (err, path) {
        restler.post(path, {
            multipart: true,
            data: {
                uploadFile: restler.file(filePath, null, fileSize, null, fileType)
            }
        }).on('success', function (result) {
            callback(undefined, result);
        }).on('error', function (err) {
            console.error('upload-single-file', err);
            callback(err);
        }).on('fail', function (err) {
            console.error('upload-single-file', err);
            callback(err);
        }).on('complete', function () {
            fs.remove(filePath);
        });
    });
}

module.exports = execute;