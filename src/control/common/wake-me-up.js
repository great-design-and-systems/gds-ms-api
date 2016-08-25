'use strict';
var http = require('http');
var HEROKU_DEPLOYED = process.env.HEROKU_DEPLOYED || false;
var HEROKU_URL_TO_WAKE = process.env.HEROKU_URL_TO_WAKE || 'http://gds-ms-api.herokuapp.com/gds/update-services;http://gds-terminal.herokuapp.com;http://gds-lrts.herokuapp.com';
var HEROKU_WAKE_INTERVAL = process.HEROKU_WAKE_INTERVAL || 300000;

module.exports = function () {
    if (HEROKU_DEPLOYED) {
        console.log('WAKE ME UP BEFORE YOU GO GO!');
        if (HEROKU_URL_TO_WAKE.indexOf(';') > -1) {
            setInterval(function () {
                var urls = HEROKU_URL_TO_WAKE.split(';');
                for (var i = 0; i < urls.length; i++) {
                    var url = urls[i];
                    http.get(url);
                }
            }, HEROKU_WAKE_INTERVAL); // every 5 minutes (300000)
        } else {
            setInterval(function () {
                http.get(HEROKU_URL_TO_WAKE);
            }, HEROKU_WAKE_INTERVAL); // every 5 minutes (300000)
        }

    }
};