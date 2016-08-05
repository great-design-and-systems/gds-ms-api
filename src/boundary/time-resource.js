'use strict';
var Time = require('./time');
var API = process.env.API_NAME || '/gds/time/';

module.exports = function (app) {
    app.get(API + 'get-today-records/:currenTimeMilis', function (req, res) {
        var currenTimeMilis = req.params.currenTimeMilis;
        Time.getTodayRecords(currenTimeMilis, function (err, result) {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(200).send([]);
            }
        });
    });
};
