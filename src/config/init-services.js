'use strict';
var CheckAndGetApi = require('../control/common/check-and-get-api');
function execute(callback) {
    var restServices = {};
    new CheckAndGetApi(process.env.USER_SERVICE_PORT, function (err, api) {
        if (err) {
            callback(err);
        } else {
            restServices.userService = api;
            new CheckAndGetApi(process.env.TIME_SERVICE_PORT, function (err, api) {
                if (err) {
                    callback(err);
                } else {
                    restServices.timeService = api;
                    new CheckAndGetApi(process.env.STUDENT_SERVICE_PORT, function (err, api) {
                        if (err) {
                            callback(err);
                        } else {
                            restServices.studenService = api;
                            new CheckAndGetApi(process.env.FACULTY_SERVICE_PORT, function (err, api) {
                                if (err) {
                                    callback(err);
                                } else {
                                    restServices.facultyService = api;
                                    new CheckAndGetApi(process.env.SECURITY_SERVICE_PORT, function (err, api) {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            restServices.securityService = api;
                                            new CheckAndGetApi(process.env.FILE_SERVICE_PORT, function (err, api) {
                                                if (err) {
                                                    callback(err);
                                                } else {
                                                    restServices.fileService = api;
                                                    new CheckAndGetApi(process.env.EXPORT_SERVICE_PORT, function (err, api) {
                                                        if (err) {
                                                            callback(err);
                                                        } else {
                                                            restServices.exportService = api;
                                                            callback(undefined, restServices);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

module.exports = execute;