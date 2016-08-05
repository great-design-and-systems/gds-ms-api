'use strict';
var File = require('./file');
var API = process.env.API_NAME || '/gds/file/';

module.exports = function (app) {
  app.get(API + 'download-file/:fileId', function (req, res) {
    File.downloadFile(req.params.fileId, function (errDownload, fileResult) {
      if (errDownload) {
        res.status(500).send(fileResult);
      } else {
        res.setHeader('Content-disposition', fileResult.response.headers['content-disposition']);
        res.setHeader('Content-type', fileResult.response.headers['content-type']);
        res.setHeader('Content-length', fileResult.response.headers['content-length']);
        res.status(200).send(fileResult.data);
      }
    });
  });
};