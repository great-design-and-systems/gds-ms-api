'use strict';
var http = require('http');
var HEROKU_DEPLOYED = process.env.HEROKU_DEPLOYED || false;
var HEROKU_URL_TO_WAKE = process.env.HEROKU_URL_TO_WAKE || 'https://gds-ms-api.herokuapp.com/gds/update-services';
var HEROKU_WAKE_INTERVAL = process.HEROKU_WAKE_INTERVAL || 300000;

module.exports = function () {
    if (HEROKU_DEPLOYED) {
        console.log('WAKE ME UP BEFORE YOU GO GO!');
        setInterval(function () {
            http.get(HEROKU_URL_TO_WAKE);
        }, HEROKU_WAKE_INTERVAL); // every 5 minutes (300000)
    }
};