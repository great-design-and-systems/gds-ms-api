'use strict';
var restler = require('restler');
var lodash = require('lodash');
var SetDefaultProtocol = require('../common/set-default-protocol');
var fs = require('fs');

function execute(links, callback) {
    try {
        lodash.forEach(links, function (link) {
            link.execute = action;
        });
        callback(undefined, links);
    } catch (err) {
        global.gdsLogger.logError('add-service-action', err);
        callback(err);
    }
}

function action(options, callback) {
    /*jshint validthis:true */
    var link = this;
    var url;
    new SetDefaultProtocol(link.url, function (err, httpUrl) {
        url = httpUrl;
    });
    if (options instanceof Function) {
        callback = options;
        options = undefined;
    }
    if (!options) {
        options = {};
    }
    if (!options.timeout) {
        options.timeout = process.env.CALL_TIMEOUT || 20000;
    }
    console.log('options', options);
    var method = 'get';
    if (link.method === 'POST') {
        method = 'post';
    } else if (link.method === 'PUT') {
        method = 'put';
    } else if (link.method === 'DELETE') {
        method = 'del';
    }
    if (options && options.params) {
        lodash.forEach(options.params, function (value, key) {
            url = url.replace(':' + key, value);
        });
    }
    global.gdsLogger.logInfo('request made: ' + url);
    if (options.multipart) {
        var file = restler.file(options.data.path, options.data.originalFilename, options.data.size, null, options.data.type);
        lodash.set(options, 'data', {});
        lodash.set(options.data, options.multipartField, file);
        global.gdsLogger.logInfo('data converted to rest file', options);
    }
    lodash.get(restler, method)(url, options)
        .on('success', function (result, response) {
            global.gdsLogger.logInfo('request success: ' + url);
            callback(undefined, {
                data: result,
                response: response
            });
            if (options.multipart) {
                fs.unlink(lodash.get(options.data, options.multipartField).path);
            }
        })
        .on('error', function (reason, response) {
            global.gdsLogger.logError('ERROR: ' + url, reason);
            callback(reason, response);
        })
        .on('fail', function (reason, response) {
            global.gdsLogger.logError('FAIL: ' + url, reason);
            callback(reason, response);
        })
        .on('timeout', function (reason, response) {
            global.gdsLogger.logError('TIMEOUT: ' + link.url, reason);
            callback(reason, response);
        });
}

module.exports = execute;