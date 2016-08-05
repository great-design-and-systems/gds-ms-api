'use strict';
var GetTodayRecords = require('../control/time/get-today-records');

module.exports = {
    getTodayRecords: getTodayRecords
};

function getTodayRecords(todayLongValue, callback) {
    new GetTodayRecords(todayLongValue, callback);
}