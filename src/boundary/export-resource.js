'use strict';
var Export = require('./export');
var API = process.env.API_NAME || '/gds/export/';

module.exports = function (app) {
    app.post(API + 'create-export-csv', function (req, res) {
        Export.createExportCSV(req.headers.host, req.body.description, req.body.limit, req.body.columns, function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send({
                    message: result.message,
                    exportId: result.exportId,
                    links: {
                        put: {
                            addExportItemCSV: 'http://' + req.headers.host + API + 'add-export-item-csv/' + result.exportId
                        }
                    }
                });
            }
        });
    });
    app.put(API + 'add-export-items-csv/:exportId', function (req, res) {
        Export.addExportItemsCSV(req.headers.host, req.params.exportId, req.body);
        res.status(200).send({
            message: 'Export has started'
        });
    });
    app.get(API + 'get-export-completed', function (req, res) {
        Export.getExportCompleted(req.headers.host, function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });
    app.get(API + 'get-export-inprogress', function (req, res) {
        Export.getExportInProgress(req.headers.host, function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });

    app.delete(API + ':exportId', function (req, res) {
        Export.removeExportTrackerById(req.headers.host, req.params.exportId, function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });

    app.delete(API + 'all/completed-export-tracker', function (req, res) {
        Export.removeCompletedExportTracker(req.headers.host, function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });
};
