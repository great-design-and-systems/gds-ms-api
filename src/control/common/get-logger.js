'use strict';
var log4js = require('log4js');
var APP_NAME = process.env.APP_NAME || 'gds_api';

module.exports = log4js.getLogger(APP_NAME);