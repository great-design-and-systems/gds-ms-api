'use strict';
var DOMAIN_PORT = process.env.SECURITY_SERVICE_PORT || 'http://localhost:3004';
var API = process.env.SECURITY_API || '/api/security/';

function execute(path, callback) {
    callback(undefined, DOMAIN_PORT + API + path);
}

module.exports = execute;