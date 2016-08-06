'use strict';
var API = process.env.API_NAME || '/gds/login';
module.exports = function (app, sockets, services) {
    app.post(API, function (req, res) {
        services.userServicePort.links.userPassword.execute({
            params: {
                username: req.body.username
            }
        }, function (errUserPassword, resultUserPassword) {
            if (errUserPassword) {
                res.status(401).send({
                    message: 'Invalid username or password'
                });
            } else {
                services.securityServicePort.links.validatePassword.execute({
                    data: {
                        currentPassword: resultUserPassword.data.password,
                        password: req.body.password
                    }
                }, function (errValidate) {
                    if (errValidate) {
                        res.status(401).send({
                            message: 'Invalid username or password'
                        });
                    } else {
                        services.securityServicePort.links.createUserSession.execute({
                            username: req.body.username
                        }, function (errUserSession, sessionResult) {
                            if (errUserSession) {
                                res.status(401).send({
                                    message: 'Invalid username or password'
                                });
                            } else {
                                console.log('sessionResult', sessionResult);
                                res.cookie('GDSSESSIONID', sessionResult.data.sessionId);
                                res.status(200).send(sessionResult.data);
                            }

                        });
                    }
                });
            }
        });
    });
};