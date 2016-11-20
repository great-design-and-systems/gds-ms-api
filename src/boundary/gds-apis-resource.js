'use strict';
var API = process.env.API_NAME || '/gds/';
var lodash = require('lodash');
var GetParamObject = require('../control/service/get-param-object');
var SKIPPED_SESSION_CONTEXT = process.env.SKIPPED_SESSION_CONTEXT || 'gds/scanner,gds/login,gds,gds/update-service,gds/schoolConfigServicePort,api/users/register';
var GdsConfig = new require('gds-config');
var gdsService = new GdsConfig.GDSServices;

function execute(app, sockets) {
    app.use('/gds/*', function (req, res, next) {
        global.gdsLogger.logInfo('Validating host ' + req.headers.host);
        var skippedValidationContexts = SKIPPED_SESSION_CONTEXT.split(',');
        var skippedSessionValidation = false;
        for (var s = 0; s < skippedValidationContexts.length; s++) {
            skippedSessionValidation = req.baseUrl.indexOf(skippedValidationContexts[s]) > -1;
            if (skippedSessionValidation) {
                break;
            }
        }
        global.gdsServices.securityServicePort.links.validateHost.execute({
            params: { host: req.headers.host } // TODO: Improve security host configuration
        }, function (errHost) {
            if (errHost) {
                res.status(403).send(errHost);
            } else {
                global.gdsLogger.logInfo('session', req.cookies.GDSSESSIONID);
                global.gdsLogger.logInfo('skippedSessionValidation', skippedSessionValidation);
                if (skippedSessionValidation) {
                    next();
                } else {
                    global.gdsServices.securityServicePort.links.validateSession.execute({
                        params: { sessionId: req.cookies.GDSSESSIONID }
                    }, function (err) {
                        if (!err) {
                            next();
                        } else {
                            res.status(403).send({
                                message: 'Invalid session'
                            });
                        }
                    });
                }
            }
        });
    });
    app.get(API + 'update-services', function (req, res) {
        global.gdsServices = {};
        gdsService.initServices(function (errUpdates, updateServices) {
            if (errUpdates) {
                res.status(500).send(errUpdates);
            } else {
                global.gdsServices = updateServices;
                res.status(200).send(global.gdsServices);
            }
        });
    });
    app.get(API, function (req, res) {
        res.status(200).send(global.gdsServices);
    });
    app.get(API + ':serviceName', function (req, res) {
        var service = lodash.get(global.gdsServices, req.params.serviceName);
        if (!service) {
            res.status(500).send({
                message: 'Service: ' + req.params.serviceName + ' does not exists or not running.'
            });
        } else {
            res.status(200).send(service);
        }
    });
    app.use(API + ':serviceName/:link', function (req, res, next) {
        if (req.baseUrl.indexOf('/gds/export/') > -1 || req.baseUrl.indexOf('/gds/login/') > -1 || req.baseUrl.indexOf('/gds/scanner/') > -1) {
            next();
        } else {
            var service = lodash.get(global.gdsServices, req.params.serviceName);
            if (!service) {
                res.status(500).send({
                    message: 'Service: ' + req.params.serviceName + ' does not exists or not running.'
                });
            } else {
                var link = lodash.get(service.links, req.params.link);
                if (!link) {
                    res.status(500).send({
                        message: 'Service link: ' + req.params.link + ' is not found.'
                    });
                } else {
                    var params = req.query.param;
                    var multipart = !!req.query.multipart;
                    var multipartField = req.query.multipartField;
                    var isFile = !!req.query.isFile;
                    var $event = req.query.$event;
                    req.query.param = undefined;
                    req.query.multipart = undefined;
                    req.query.multipartField = undefined;
                    req.query.isFile = undefined;
                    lodash.unset(req.query, 'param');
                    lodash.unset(req.query, 'multipart');
                    lodash.unset(req.query, 'isFile');
                    lodash.unset(req.query, 'multipartField');
                    if (params) {
                        new GetParamObject(params, function (errParam, paramOs) {
                            if (errParam) {
                                res.status(500).send(errParam);
                            } else {
                                params = paramOs;
                            }
                        });
                    }
                    var data = req.body;
                    if (multipart) {
                        global.gdsLogger.logInfo('req', req.files);
                        data = req.files.file;
                    }
                    link.execute({
                        multipart: multipart,
                        multipartField: multipartField,
                        params: params,
                        query: req.query,
                        data: data,
                        decoding: !!isFile ? 'buffer' : 'utf8'
                    }, function (errorLinkPost, result) {
                        if (errorLinkPost || !result) {
                            res.status(500).send(errorLinkPost);
                        } else {
                            if (isFile && result.response) {
                                lodash.forEach(result.response.headers, function (value, key) {
                                    global.gdsLogger.logInfo('header', key + ':' + value);
                                    res.setHeader(key, value);
                                });
                            }
                            res.status(200).send(result.data);
                            if ($event) {
                                global.gdsLogger.logInfo('$event', $event);
                                sockets.emit($event, result.data);
                            }
                        }
                    });

                }
            }
        }

    });
}

module.exports = execute;
