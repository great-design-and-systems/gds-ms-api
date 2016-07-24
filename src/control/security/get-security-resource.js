'use strict';
var SECURITY_DOMAIN = process.env.SECURITY_SERVICE_PORT || 'http://localhost:3004';
var API = process.env.SECURITY_API || '/api/security/';

function execute(path, callback) {
    callback(undefined, SECURITY_DOMAIN + API + path);
}

module.exports = execute;