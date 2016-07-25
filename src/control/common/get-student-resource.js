'use strict';
var SECURITY_DOMAIN = process.env.STUDENT_SERVICE_PORT || 'http://localhost:3002';
var API = process.env.SECURITY_API || '/api/student/';

function execute(path, callback) {
    callback(undefined, SECURITY_DOMAIN + API + path);
}

module.exports = execute;W