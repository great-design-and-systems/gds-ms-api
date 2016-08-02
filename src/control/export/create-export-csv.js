'use strict';
var rest = require('restler');
var GetExportResource = require('./get-export-resource');
function execute(description, limit, columns, callback) {
    new GetExportResource('create-export-csv', function (err, path) {
        rest.post(path, {
            data: {
                description: description,
                limit: limit,
                columns: columns
            },
            timeout: process.env.CALL_TIMEOUT || 20000
        }).on('success', function (data) {
            console.log('create-export-csv', data);
            callback(undefined, data);
        }).on('error', function (err) {
            console.error('create-export-csv', err);
            callback(err);
        }).on('fail', function (err) {
            console.error('create-export-csv', err);
            callback(err);
        });
    });
}

module.exports = execute;