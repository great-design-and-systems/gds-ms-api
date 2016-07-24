var Database = require('./src/config/database');
var Server = require('./src/config/server');
var LoggerServer = require('./src/config/logger-server');
var express = require('express');
var app = express();
var GdsApisResource = require('./src/boundary/gds-apis-resource');

(function () {
    new Database();
    new Server(app);
    new LoggerServer(app);
    new GdsApisResource(app);
})();

module.exports = app;