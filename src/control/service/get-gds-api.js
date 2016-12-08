var batch = require('batchflow');

function GetGdsApi(services, callback) {
    batch(services).sequential()
        .each(function (field, domain, done) {
            try {
                // replace link here
                done();
            } catch (err) {
                callback(err);
            }
        })
        .end(function () {
            callback(undefined, services);
        })
}

module.exports = GetGdsApi;