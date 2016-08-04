'use strict';
var GetFileResource = require('./get-file-resource');
var restler = require('restler');

function execute(fileId, callback) {
  new GetFileResource('download-file/' + fileId, function(err, path) {
    restler.get(path).on('success', function(result, response) {
      callback(undefined, {
        data: result,
        response: response
      });
    }).on('error', function(err) {
      console.error('download-file', err);
      callback(err);
    }).on('fail', function(err) {
      console.error('download-file', err);
      callback(err);
    });
  });
}

module.exports = execute;