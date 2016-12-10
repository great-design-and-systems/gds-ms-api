var batch = require('batchflow');
var lodash = require('lodash');

function GetGdsApi(host, services, callback) {
    batch(services).sequential()
        .each(function (field, domain, done) {
            try {
                batch(domain.links)
                    .sequential()
                    .each(function (key, value, next) {
                        var newUrl = value.url.replace(/(http:|https:)/, '');
                        var params = {};
                        var newLink = 'http://' + host + '/gds/' + key;
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
                                value.url = newLink;
                                next();
                            } catch (err) {
                                console.log('batch =>', err);
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
            callback(undefined, services);
        });
}

function parseParams(urlArr, callback, params, index, started, context) {
    try {
        if (!index) {
            index = 0
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
                params.push(context);
            } else if (started) {
                context += urlArr[index];
            }
            setTimeout(function () {
                new parseParams(urlArr, callback, params, ++index, started, context);
            });
        } else {
            if (context.length) {
                params.push(context);
            }
            callback(undefined, params);
        }
    } catch (err) {
        callback(err);
    }

}
module.exports = GetGdsApi;