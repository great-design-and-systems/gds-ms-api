'use strict';
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty');
var ENV = process.env.APP_ENV || 'dev';
module.exports = function(app) {
    app.use(morgan(ENV));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.json({
        type: 'application/vnd.api+json'
    }));
    app.use(multipart({
        uploadDir: process.env.TEMP_DIR || 'files'
    }));
};