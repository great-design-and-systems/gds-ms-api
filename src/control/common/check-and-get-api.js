'use strict';
var restler = require('restler');
function execute(apiUrl, callback) {
    restler.get(apiUrl, {
        timeout: 20000
    }).on('success', function (data) {
        callback(undefined, data);
    }).on('error', function (reason) {
        callback(reason);
    }).on('fail', function (reason) {
        callback(reason);
    });
}
module.exports = execute;