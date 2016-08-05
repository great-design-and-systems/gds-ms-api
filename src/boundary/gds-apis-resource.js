'use strict';
var lodash = require('lodash');
var GdsApis = require('./gds-apis');
var API = process.env.API_NAME || '/gds/';
var ValidateHost = require('../control/security/validate-host');
function execute(app) {

    app.use('*', function (req, res, next) {
        console.log('Validating host ' + req.headers.host);
        console.log('headers', req.headers);
        new ValidateHost(req.headers.host, function (errHost) {
            if (errHost) {
                res.status(403).send(errHost);
            } else {
                next();
            }
        });
    });

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