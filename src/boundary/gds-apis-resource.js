'use strict';
var API = process.env.API_NAME || '/gds/';
var lodash = require('lodash');
var GetParamObject = require('../control/service/get-param-object');
function execute(app, services) {
    app.use('*', function (req, res, next) {
        console.log('Validating host ' + req.headers.host);
        services.securityServicePort.links.validateHost.execute({
            params: { host: req.headers.host }
        }, function (errHost, result) {
            if (errHost) {
                res.headers = result.headers;
                res.status(403).send(errHost);
            } else {
                next();
            }
        });
    });
    app.get(API, function (req, res) {
        res.status(200).send(services);
    });
    app.use(API + ':serviceName/:link', function (req, res) {
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
                lodash.unset(req.query, 'param');
                lodash.unset(req.query, 'multipart');
                if (params) {
                    new GetParamObject(params, function (errParam, paramOs) {
                        if (errParam) {
                            res.status(500).send(errParam);
                        } else {
                            link.execute({
                                multipart: multipart,
                                params: paramOs,
                                query: req.query,
                                data: req.body
                            }, function (errorLinkPost, result) {
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
                        multipart: multipart,
                        query: req.query,
                        data: req.body
                    }, function (errorLinkPost, result) {
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

            }
        }
    });
    /*
    app.get(API + ':serviceName/:link', function (req, res) {
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
                lodash.unset(req.query, 'param');
                new GetParamObject(params, function (errParam, paramOs) {
                    if (errParam) {
                        res.status(500).send(errParam);
                    } else {
                        link.execute({
                            params: paramOs,
                            query: req.query
                        }, function (errorLinkGet, result) {
                            if (errorLinkGet) {
                                res.status(500).send(errorLinkGet);
                            } else {
                                res.headers = result.response.headers;
                                res.status(200).send(result.data);
                            }
                        });
                    }
                });
            }
        }
    });
    app.post(API + ':serviceName/:link', function (req, res) {
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
                lodash.unset(req.query, 'param');
                lodash.unset(req.query, 'multipart');
                new GetParamObject(params, function (errParam, paramOs) {
                    if (errParam) {
                        res.status(500).send(errParam);
                    } else {
                        link.execute({
                            multipart: multipart,
                            params: paramOs,
                            query: req.query,
                            data: req.body
                        }, function (errorLinkPost, result) {
                            if (errorLinkPost) {
                                res.status(500).send(errorLinkPost);
                            } else {
                                res.headers = result.response.headers;
                                res.status(200).send(result.data);
                            }
                        });
                    }
                });
            }
        }
    });
    app.put(API + ':serviceName/:link', function (req, res) {
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
                lodash.unset(req.query, 'param');
                lodash.unset(req.query, 'multipart');
                new GetParamObject(params, function (errParam, paramOs) {
                    if (errParam) {
                        res.status(500).send(errParam);
                    } else {
                        link.execute({
                            multipart: multipart,
                            params: paramOs,
                            query: req.query,
                            data: req.body
                        }, function (errorLinkPut, result) {
                            if (errorLinkPut) {
                                res.status(500).send(errorLinkPut);
                            } else {
                                res.headers = result.response.headers;
                                res.status(200).send(result.data);
                            }
                        });
                    }
                });
            }
        }
    });
    app.delete(API + ':serviceName/:link', function (req, res) {
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
                lodash.unset(req.query, 'param');
                new GetParamObject(params, function (errParam, paramOs) {
                    if (errParam) {
                        res.status(500).send(errParam);
                    } else {
                        link.execute({
                            params: paramOs,
                            query: req.query,
                            data: req.body
                        }, function (errorLinkDelete, result) {
                            if (errorLinkDelete) {
                                res.status(500).send(errorLinkDelete);
                            } else {
                                res.headers = result.response.headers;
                                res.status(200).send(result.data);
                            }
                        });
                    }
                });
            }
        }
    });
    */
}

module.exports = execute;