'use strict';
var Scanner = require('./scanner');
var API = process.env.API_NAME || '/gds/scanner/';

function execute(app, io) {

    app.post(API + 'check-in', function (req, res) {
        var requestBody = req.body;
        var requestHost = req.headers.host;
        Scanner.checkIn(requestHost, requestBody.barcode, requestBody.when, function (err, result) {
            if (!err) {
                res.status(200).send({
                    message: 'Ok',
                    timeInID: result.timeInID
                });
                io.emit('scanned', result);
            } else {
                console.error(err);
                res.status(500).send({
                    message: 'Failed to checkin'
                });
            }
        });
    });

    app.put(API + 'check-in-purpose/:timeInID', function (req, res) {
        var requestBody = req.body;
        var requestHost = req.headers.host;
        var timeInID = req.params.timeInID;

        Scanner.checkInPurpose(requestHost, timeInID, requestBody.purpose, function (err, result) {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send(err);
            }
        });
    });
}

module.exports = execute;