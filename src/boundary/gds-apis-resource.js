'use strict';
var lodash = require('lodash');
var GdsApis = require('./gds-apis');
var API = process.env.API_NAME || '/gds/';

function execute(app) {
    app.get(API, function (req, res) {
        var results = '';
        lodash.forEach(process.env, function (key, value) {
            results += '<div> ' + value + '=' + key + '</div>';
        });
        res.status(200).send(results);
    });

    app.get('/check-host', function (req, res) {
        GdsApis.checkHost(req.headers.host, function (err, result) {
            if (err) {
                res.status(403).send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });
}

module.exports = execute;