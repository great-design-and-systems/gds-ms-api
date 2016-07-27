var Database = require('./src/config/database');
var Server = require('./src/config/server');
var LoggerServer = require('./src/config/logger-server');
var express = require('express');
var app = express();
var http = require('http');
var io = require('socket.io');
var cors = require('cors');
var GdsApisResource = require('./src/boundary/gds-apis-resource');
var ScannerResource = require('./src/boundary/scanner-resource');
var ServerCors = require('./src/config/server-cors');
var Socket = require('./src/config/socket');
(function () {
    new Database();
    new Server(app);
    new ServerCors(app, cors);
    new LoggerServer(app);
    new GdsApisResource(app);
    new Socket(app, io, http, function (err, sockets) {
        new ScannerResource(app, sockets);
    });
})();

module.exports = app;