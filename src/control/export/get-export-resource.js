'use strict';
var DOMAIN_PORT = process.env.EXPORT_SERVICE_PORT || 'http://localhost:3006';
var API = process.env.EXPORT_API || '/api/export/';

function execute(path, callback) {
    new require('../common/set-default-protocol')(DOMAIN_PORT, function (err, servicePort) {
        callback(undefined, servicePort + API + path);
    });
}

module.exports = execute;