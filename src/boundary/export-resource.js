'use strict';
var Export = require('./export');
var API = process.env.API_NAME || '/gds/export/';

module.exports = function (app) {
    app.post(API + 'create-export-csv', function (req, res) {
        var requestHost = req.headers.host;
        Export.createExportCSV(requestHost, req.body.description, req.body.limit, req.body.columns, function (err, result) {
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

    app.put(API + 'add-export-item-csv/:exportId', function (req, res) {
        var requestHost = req.headers.host;
        var exportId = req.params.exportId;
        Export.addExportItemCSV(requestHost, exportId, req.body, function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                if (result.ok) {
                    res.status(200).send(result);
                } else {
                    res.status(200).send(result);
                }
            }
        });
    });
};
