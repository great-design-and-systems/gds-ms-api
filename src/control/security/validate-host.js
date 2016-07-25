'use strict';
var GetSecurityResource = require('./get-security-resource');
var rest = require('restler');

function execute(host, callback) {
   new GetSecurityResource('validate-host', function (err, path){
        rest.get(path, {
            headers: {
                host: host
            }
        }).on('complete', function (result, response) {
            if (result instanceof Error) {
                if (response.statusCode === 403) {
                    callback({
                        message: 'Host is not authorized'
                    });
                } else {
                    callback(result);
                }
            } else {
                callback();
            }
        });
    });
    
}

module.exports = execute;