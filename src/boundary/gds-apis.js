'use strict';
var ValidateHost = require('../control/security/validate-host');

module.exports = {
    checkHost: function (host, callback) {
        new ValidateHost(host, function (err) {
            if (err) {
                callback({
                    message: 'Invalid request host'
                });
            } else {
                callback(undefined, {
                    message: 'Ok'
                });
            }
        });
    }
};