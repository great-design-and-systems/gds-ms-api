'use strict';
var rest = require('restler');
var GetExportResource = require('./get-export-resource');
function execute(exportId, data, callback) {
    new GetExportResource('add-export-item-csv/' + exportId, function (err, path) {
        rest.put(path, {
            data: data
        }).on('complete', function (result, response) {
            if ((result instanceof Error) || (response && response.statusCode === 404)) {
                console.error('add-export-item-csv', result);
                callback(result);
            } else {
                if (result.ok) {
                    callback(undefined, result);
                } else {
                    callback(undefined, {
                        contentType: response.headers['content-type'],
                        raw: response.raw
                    });
                }
            }
        });
    });
}

module.exports = execute;