'use strict';

var batch = require('batchflow');
var lodash = require('lodash');

function GetGdsApi(host, services, callback) {
    var api = {};
    batch(services).parallel()
        .each(function (field, domain, done) {
            lodash.set(api, field, {});
            var apiField = lodash.get(api, field);
            apiField.domain = domain.domain;
            apiField.links = {};
            try {
                batch(domain.links)
                    .parallel()
                    .each(function (key, value, next) {
                        lodash.set(apiField.links, key, {});
                        var link = lodash.get(apiField.links, key);
                        link.method = value.method;
                        var newUrl = value.url.replace(/(http:|https:)/, '');
                        newUrl = newUrl.replace(host, '');
                        var newLink = 'http://' + host + '/gds/' + field + '/' + key;
                        parseParams(newUrl.split(''), function (err, params) {
                            try {
                                if (params && params.length) {
                                    newLink += '?';
                                    params.forEach(function (param) {
                                        newLink += 'param=' + param + '::' + param;
                                        newLink += '&';
                                    });
                                    newLink = newLink.substr(0, newLink.length - 1);
                                }
                                link.url = newLink;
                                next();
                            } catch (err) {
                                callback(err);
                            }
                        });
                    })
                    .end(function () {
                        done();
                    });
            } catch (err) {
                console.log('gds =>', err);
                callback(err);
            }
        })
        .end(function () {
            callback(undefined, api);
        });
}

'use strict';
function parseParams(urlArr, callback, params, index, started, context) {
    try {
        if (!index) {
            index = 0;
        }
        if (!params) {
            params = [];
        }
        if (index < urlArr.length) {
            if (urlArr[index] === ':') {
                started = true;
                context = '';
            } else if (started && urlArr[index] === '/') {
                started = false;
                if (!(/:[0-9]+/g.test(':' + context))) {
                    params.push(context);
                }
            } else if (started) {
                context += urlArr[index];
            }
            setTimeout(function () {
                new parseParams(urlArr, callback, params, ++index, started, context);
            });
        } else {
            if (context.length) {
                if (!(/:[0-9]+/g.test(':' + context))) {
                    params.push(context);
                }
            }
            callback(undefined, params);
        }
    } catch (err) {
        callback(err);
    }

}
module.exports = GetGdsApi;
