'use strict';
var API = process.env.API_NAME || '/gds/';
var lodash = require('lodash');
var GetParamObject = require('../control/service/get-param-object');
var InitServices = require('../config/init-services');
var SKIPPED_SESSION_CONTEXT = process.env.SKIPPED_SESSION_CONTEXT || 'gds/scanner,gds/login';
function execute(app, sockets, services) {
    app.use('*', function(req, res, next) {
        console.log('Validating host ' + req.headers.host);
        var skippedValidationContexts = SKIPPED_SESSION_CONTEXT.split(',');
        var skippedSessionValidation = false;
        for (var s = 0; s < skippedValidationContexts.length; s++) {
            skippedSessionValidation = req.baseUrl.indexOf(skippedValidationContexts[0]) > -1;
            if (skippedSessionValidation) {
                break;
            }
        }
        services.securityServicePort.links.validateHost.execute({
            params: { host: req.headers.host }
        }, function(errHost, result) {
            if (errHost) {
                res.headers = result.headers;
                res.status(403).send(errHost);
            } else {
                console.log('skippedSessionValidation', skippedSessionValidation);
                next();
            }
        });
    });
    app.put(API + 'update-services', function(req, res) {
        services = {};
        new InitServices(function(errUpdates, updateServices) {
            if (errUpdates) {
                res.status(500).send(errUpdates);
            } else {
                services = updateServices;
                res.status(200).send(services);
            }
        });
    });
    app.get(API, function(req, res) {
        res.status(200).send(services);
    });
    app.use(API + ':serviceName/:link', function(req, res) {
        var service = lodash.get(services, req.params.serviceName);
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
                var $event = req.query.$event;
                req.query.param = undefined;
                req.query.multipart = undefined;
                lodash.unset(req.query, 'param');
                lodash.unset(req.query, 'multipart');
                if (params) {
                    new GetParamObject(params, function(errParam, paramOs) {
                        if (errParam) {
                            res.status(500).send(errParam);
                        } else {
                            link.execute({
                                multipart: multipart,
                                params: paramOs,
                                query: req.query,
                                data: req.body
                            }, function(errorLinkPost, result) {
                                if (errorLinkPost) {
                                    res.status(500).send(errorLinkPost);
                                } else {
                                    if ($event) {
                                        console.log('$event', $event);
                                    }
                                    res.headers = result.response.headers;
                                    res.status(200).send(result.data);
                                }
                            });
                        }
                    });
                } else {
                    link.execute({
                        params: params,
                        multipart: multipart,
                        query: req.query,
                        data: req.body
                    }, function(errorLinkPost, result) {
                        if (errorLinkPost) {
                            res.status(500).send(errorLinkPost);
                        } else {
                            if ($event) {
                                console.log('$event', $event);
                                sockets.emit($event, result);
                            }
                            res.headers = result.response.headers;
                            res.status(200).send(result.data);
                        }
                    });
                }
            }
        }
    });
}

module.exports = execute;