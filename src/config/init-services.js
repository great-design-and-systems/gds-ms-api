'use strict';
var CheckAndGetApi = require('../control/common/check-and-get-api');
var AddServiceAction = require('../control/service/add-service-action');
var lodash = require('lodash');
var changeCase = require('change-case');
var SetDefaultProtocol = require('../control/common/set-default-protocol');
function execute(callback) {
    var servicePorts = [];
    lodash.forEach(process.env, function (value, key) {
        if (key.indexOf('_SERVICE_PORT') > 1) {
            var port = {};
            lodash.set(port, 'key', key);
            new SetDefaultProtocol(value, function (err, httpLink) {
                lodash.set(port, 'value', httpLink);
            });
            servicePorts.push(port);
        }
    });
    var restServices = {};
    processPorts(servicePorts, restServices, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(undefined, result);
        }
    });
}

function processPorts(servicePorts, restServices, callback, index) {
    if (!index) {
        index = 0;
    }
    if (index < servicePorts.length) {
        var port = servicePorts[index];
        var serviceName = changeCase.camelCase(port.key.toLowerCase());
        new CheckAndGetApi(port.value, function (err, api) {
            if (err) {
                callback(err);
            } else {
                lodash.set(restServices, serviceName, api);
                new AddServiceAction(api.links, function (errLink, links) {
                    if (errLink) {
                        callback(errLink);
                    } else {
                        lodash.set(lodash.get(restServices, serviceName), 'links', links);
                        index++;
                        processPorts(servicePorts, restServices, callback, index);
                    }
                });
            }
        });
    } else {
        callback(undefined, restServices);
    }
}

module.exports = execute;