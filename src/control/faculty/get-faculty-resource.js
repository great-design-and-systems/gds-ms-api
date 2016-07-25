'use strict';
var DOMAIN_PORT = process.env.FACULTY_SERVICE_PORT || 'http://localhost:3003';
var API = process.env.FACULTY_API || '/api/faculty/';

function execute(path, callback) {
    callback(undefined, DOMAIN_PORT + API + path);
}

module.exports = execute;