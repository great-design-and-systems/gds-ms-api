'use strict';
function execute(servicePort, callback) {
    if (servicePort.contains('tcp')) {
        callback(undefined, servicePort.replace('tcp', 'http'));
    } else {
        callback(undefined, servicePort);
    }
}
module.exports = execute;