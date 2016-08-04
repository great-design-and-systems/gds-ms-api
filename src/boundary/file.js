'use strict';
var DownloadFile = require('../control/file/download-file');
var ValidateHost = require('../control/security/validate-host');

module.exports = {
  downloadFile: downloadFile
};

function downloadFile(host, fileId, callback) {
  new ValidateHost(host, function(errHost) {
    if (errHost) {
      callback(errHost);
    } else {
      new DownloadFile(fileId, function(errDownload, fileResult) {
        if (errDownload) {
          callback({
            message: 'Failed to download file with id: ' + fileId
          });
        } else {
          callback(undefined, fileResult);
        }
      });
    }
  });
}