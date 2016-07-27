'use strict';
var bodyParser = require('body-parser');
var morgan = require('morgan');
var ENV = process.env.APP_ENV || 'dev';
module.exports = function (app) {
    app.use(morgan(ENV));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.json({
        type: 'application/vnd.api+json'
    }));
    // app.listen(app.get('port'), function () {
    //     console.log('Node app is running on port', app.get('port'));
    // });
};