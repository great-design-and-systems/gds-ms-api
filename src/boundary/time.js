'use strict';
var ValidateHost = require('../control/security/validate-host');
var GetTodayRecords = require('../control/time/get-today-records');

module.exports = {
    getTodayRecords: getTodayRecords
}

function getTodayRecords(host, todayLongValue, callback) {
    new ValidateHost(host, function (errHost) {
        if (errHost) {
            callback(errHost)
        } else {
            new GetTodayRecords(todayLongValue, callback);
        }
    });
}