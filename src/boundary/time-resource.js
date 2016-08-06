'use strict';
var API = process.env.API_NAME || '/gds/time/';
module.exports = function (app, services) {
    app.get(API + 'get-today-records/:currentTimeMilis', function (req, res) {
        var currentTimeMilis = req.params.currentTimeMilis;
        services.timeServicePort.links.getTodayRecords.execute({
            params: {
                currentTimeMilis: currentTimeMilis
            }
        }, function (err, result) {
            if (!err) {
                res.headers = result.response.headers;
                res.status(200).send(result.data);
            } else {
                res.status(200).send([]);
            }
        });
    });
};
