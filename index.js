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
var FileResource = require('./src/boundary/file-resource');
var InitServices = require('./src/config/init-services');
(function () {
  //new Database();
  new InitServices(function (err, services) {
    if (err) {
      throw err;
    } else {
      console.log('services', services);
      new Server(app);
      new ServerCors(app, cors);
      new LoggerServer(app);
      new GdsApisResource(app);
      new Socket(app, io, http, function (err, sockets) {
        new ScannerResource(app, sockets);
        new ExportResource(app, sockets);
      });
      new TimeResource(app);
      new FileResource(app);
    }
  });
})();

module.exports = app;