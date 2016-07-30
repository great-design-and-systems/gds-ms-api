'use strict';
var Time = require('./time');
var API = process.env.API_NAME || '/gds/time/';

app.get(API + 'get-today-records/:currenTimeMilis', function (req, res) {
    var requestHost = req.headers.host;
    var currenTimeMilis = req.params.currenTimeMilis;
    Time.getTodayRecords(requestHost, currenTimeMilis, function (err, result) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(200).send([]);
        }
    });
});