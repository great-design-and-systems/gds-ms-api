'use strict';
var GetFileResource = require('./get-file-resource');
var restler = require('restler');
function execute(fileId, callback) {
  new GetFileResource(fileId, function(err, path) {
    restler.del(path).on('success', function(result) {
      callback(undefined, result);
    }).on('error', function(err) {
      console.error('delete-file', err);
      callback(err);
    }).on('fail', function(err) {
      console.error('delete-file', err);
      callback(err);
    });
  });
}

module.exports = execute;