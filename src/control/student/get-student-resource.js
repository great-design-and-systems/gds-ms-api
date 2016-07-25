'use strict';
var DOMAIN_PORT = process.env.STUDENT_SERVICE_PORT || 'http://localhost:3002';
var API = process.env.STUDENT_API || '/api/student/';

function execute(path, callback) {
    callback(undefined, DOMAIN_PORT + API + path);
}
module.exports = execute; 