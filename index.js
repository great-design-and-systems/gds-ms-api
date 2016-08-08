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
var TimeResource = require('./src/boundary/time-resource');
var ExportResource = require('./src/boundary/export-resource');
var InitServices = require('./src/config/init-services');
var LoginResource = require('./src/boundary/login-resource');
(function () {
  //new Database();
  new InitServices(function (err, services) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      new Server(app);
      new ServerCors(app, cors);
      new LoggerServer(app);
     
      new Socket(app, io, http, function (err, sockets) {
        new GdsApisResource(app, sockets, services);
        new ScannerResource(app, sockets, services);
        new ExportResource(app, sockets, services);
        new LoginResource(app, sockets, services);
      });
      new TimeResource(app, services);
    }
  });
})();

module.exports = app;