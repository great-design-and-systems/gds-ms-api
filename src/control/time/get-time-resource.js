'use strict';
var DOMAIN_PORT = process.env.TIME_SERVICE_PORT || 'http://localhost:3001';
var API = process.env.TIME_API || '/api/time/';

function execute(path, callback) {
    callback(undefined, DOMAIN_PORT + API + path);
}

module.exports = execute;