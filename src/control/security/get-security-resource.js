'use strict';
var DOMAIN_PORT = process.env.SECURITY_SERVICE_PORT || 'http://localhost:3004';
var API = process.env.SECURITY_API || '/api/security/';

function execute(path, callback) {
    new require('../common/set-default-protocol')(DOMAIN_PORT, function (err, servicePort) {
        callback(undefined, servicePort + API + path);
    });
}

module.exports = execute;