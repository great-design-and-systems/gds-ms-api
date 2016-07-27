'use strict';
var Scanner = require('./scanner');
var API = process.env.API_NAME || '/gds/scanner/';

function execute(app, sockets) {

    app.post(API + 'check-in', function (req, res) {
        var requestBody = req.body;
        var requestHost = req.headers.host;
        Scanner.checkIn(requestHost, requestBody.barcode, requestBody.when, function (err, result) {
            if (!err) {
                res.status(200).send({
                    message: 'Ok',
                    timeInID: result.timeInID
                });
                sockets.emit('scanned', result);
            } else {
                console.error(err);
                res.status(500).send({
                    message: 'Failed to checkin'
                });
            }
        });
    });

    app.put(API + 'check-in-purpose', function (req, res) {
        var requestBody = req.body;
        var requestHost = req.headers.host;
        Scanner.checkInPurpose(requestHost, requestBody.timeInID, requestBody.purpose, function (err, result) {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send(err);
            }
        });
    });

    app.put(API + 'check-in-purpose', function (req, res) {
        var requestBody = req.body;
        var requestHost = req.headers.host;
        Scanner.checkInPurpose(requestHost, requestBody.timeInID, requestBody.purpose, function (err, result) {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send(err);
            }
        });
    });

    app.get(API + 'get-time-info/:timeInID', function (req, res) {
        var requestHost = req.headers.host;
        var timeInID = req.params.timeInID;
        Scanner.getTimeInfo(requestHost, timeInID, function (err, result) {
            if (!err) {
                res.status(200).send(result);
            } else {
                res.status(500).send(err);
            }
        });
    });

    app.post(API + 'check-in-visitor', function (req, res) {
        var requestBody = req.body;
        var requestHost = req.headers.host;
        Scanner.checkInVisitor(requestHost, requestBody.fullname, requestBody.purpose, requestBody.when, function (err, result) {
            if (!err) {
                res.status(200).send({
                    message: 'Ok',
                    timeInID: result.timeInID
                });
            } else {
                console.error(err);
                res.status(500).send({
                    message: 'Failed to check in visitor'
                });
            }
        });
    });

}

module.exports = execute;