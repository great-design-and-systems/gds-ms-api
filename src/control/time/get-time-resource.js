'use strict';
var DOMAIN_PORT = process.env.TIME_SERVICE_PORT || 'http://localhost:3001';
var API = process.env.TIME_API || '/api/time/';

function execute(path, callback) {
    new require('../common/set-default-protocol')(DOMAIN_PORT, function (err, servicePort) {
        callback(undefined, servicePort + API + path);
    });
}

module.exports = execute;