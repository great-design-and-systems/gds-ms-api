'use strict';
var DOMAIN_PORT = process.env.FACULTY_SERVICE_PORT || 'http://localhost:3003';
var API = process.env.FACULTY_API || '/api/faculty/';

function execute(path, callback) {
    new require('../common/set-default-protocol')(DOMAIN_PORT, function (err, servicePort) {
        callback(undefined, servicePort + API + path);
    });
}

module.exports = execute;