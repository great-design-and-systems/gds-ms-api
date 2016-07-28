'use strict';
var DOMAIN_PORT = process.env.STUDENT_SERVICE_PORT || 'http://localhost:3002';
var API = process.env.STUDENT_API || '/api/student/';

function execute(path, callback) {
    new require('../common/set-default-protocol')(DOMAIN_PORT, function (err, servicePort) {
        callback(undefined, servicePort + API + path);
    });
}
module.exports = execute; 