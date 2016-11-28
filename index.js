var Database = require('./src/config/database');
var Server = require('./src/config/server');
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
var LoginResource = require('./src/boundary/login-resource');
var ImportEvents = require('./src/events/importer.events');
var WakeMeUp = require('./src/control/common/wake-me-up');
var GdsConfig = new require('gds-config');
var gdsUtil = new GdsConfig.GDSUtil; // jshint ignore:line
var gdsService = new GdsConfig.GDSServices; // jshint ignore:line
var ServiceApi = GdsConfig.GDSServiceAPI;
(function() {
    //new Database();
    gdsUtil.getLogger(function(err) {
        gdsService.initServices(function(err) {
            if (err) {
                global.gdsLogger.logError(err);
                throw err;
            } else {
                var services = new ServiceApi();
                new Server(app);
                new ServerCors(app, cors);
                new Socket(app, io, http, function(err, sockets) {
                    new GdsApisResource(app, sockets);
                    new ScannerResource(app, sockets, services);
                    new ExportResource(app, sockets, services);
                    new LoginResource(app, sockets, services);
                    new ImportEvents(sockets, services);
                });
                new TimeResource(app, services);
                new WakeMeUp();
            }
        });
    });
})();

module.exports = app;
