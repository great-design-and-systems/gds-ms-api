'use strict';
var SetDefaultProtocol = require('../control/common/set-default-protocol');

function execute(hostSocket) {
    new SetDefaultProtocol(process.env.IMPORT_SERVICE_PORT, function(err, url) {
        var socket = require('socket.io-client')(url);
        console.log('Started listening to ', url);
        socket.on('import-tracker', function(data) {
            console.log('have imported ', data);
            hostSocket.emit('importer-progress', data);
        });
        socket.on('import-fail', function(err) {
            console.error('import has failed', err);
            hostSocket.emit('importer-fail');
        });
        socket.on('import-complete', function() {
            console.log('import has finished');
            hostSocket.emit('importer-complete');
        });
    });
}
module.exports = execute;