'use strict';
var socket = require('socket.io-client')(process.env.IMPORT_SERVICE_PORT);

function execute(hostSocket) {
    console.log('Started listening to ', process.env.IMPORT_SERVICE_PORT);
    socket.on('import-tracker', function(data) {
        console.log('have imported ', data);
        hostSocket.emit('import-tracker', data);
    });
    socket.on('import-fail', function(err) {
        console.error('import has failed', err);
        hostSocket.emit('import-fail');
    });
    socket.on('import-complete', function() {
        console.log('import has finished');
        hostSocket.emit('import-complete');
    });
}
z

module.exports = execute;