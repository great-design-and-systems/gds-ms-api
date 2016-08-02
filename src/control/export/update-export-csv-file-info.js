'use strict';
var rest = require('restler');
var GetExportResource = require('./get-export-resource');
function execute(exportId, fileId, callback) {
    new GetExportResource('update-export-csv-file-info/' + exportId, function (err, path) {
        rest.put(path, {
            data: {
                fileId: fileId
            }
        }).on('complete', function (result, response) {
            if ((result instanceof Error) || (response && response.statusCode === 404)) {
                console.error('update-export-csv-file-info', result);
                callback(result);
            } else {
                callback(undefined, result);
            }
        });
    });
}

module.exports = execute;