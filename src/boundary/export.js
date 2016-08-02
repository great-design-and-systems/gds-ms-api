'use strict';
var ValidateHost = require('../control/security/validate-host');
var CreateExportCSV = require('../control/export/create-export-csv');
var AddExportItemCSV = require('../control/export/add-export-item-csv');
var UploadSingleFile = require('../control/file/upload-single-file');
module.exports = {
  createExportCSV: createExportCSV,
  addExportItemCSV: addExportItemCSV
};

function createExportCSV(host, description, limit, columns, callback) {
  new ValidateHost(host, function(errHost) {
    if (errHost) {
      callback(errHost);
    } else {
      new CreateExportCSV(description, limit, columns, function(err, result) {
        if (err) {
          callback(err);
        } else {
          callback(undefined, result);
        }
      });
    }
  });
}

function addExportItemCSV(host, exportId, data, callback) {
  new ValidateHost(host, function(errHost) {
    if (errHost) {
      callback(errHost);
    } else {
      new AddExportItemCSV(exportId, data, function(err, result) {
        if (err) {
          callback(err);
        } else {
          if (result.ok) {
            callback(undefined, result);
          } else {
            new UploadSingleFile(result, 0, function(errUpload, resultUpload) {
              if (errUpload) {
                callback(errUpload);
              } else {
                callback(undefined, resultUpload);
              }
            });
          }
        }
      });
    }
  });
}