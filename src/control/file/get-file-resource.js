'use strict';
var DOMAIN_PORT = process.env.FILE_SERVICE_PORT || 'http://localhost:3005';
var API = process.env.FILE_API || '/api/file/';

function execute(path, callback) {
    new require('../common/set-default-protocol')(DOMAIN_PORT, function (err, servicePort) {
        callback(undefined, servicePort + API + path);
    });
}

module.exports = execute;