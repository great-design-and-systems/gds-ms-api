'use strict';
var lodash = require('lodash');
function execute(app) {
    app.get('/', function (req, res) {
        var results = '';
        lodash.forEach(process.env, function (key, value) {
            results += '<div> '+value+'=' + key + '</div>';
        });
        res.status(200).send(results);
    });
}

module.exports = execute;