'use strict';
var DownloadFile = require('../control/file/download-file');

module.exports = {
  downloadFile: downloadFile
};

function downloadFile(fileId, callback) {
  new DownloadFile(fileId, function (errDownload, fileResult) {
    if (errDownload) {
      callback({
        message: 'Failed to download file with id: ' + fileId
      });
    } else {
      callback(undefined, fileResult);
    }
  });
}