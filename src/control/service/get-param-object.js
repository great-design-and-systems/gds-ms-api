'use strict';
var lodash = require('lodash');
function execute(params, callback) {
    try {
        var paramObject = {};
        if (params instanceof Array) {
            lodash.forEach(params, function (value) {
                var splitted = value.trim().split(':');
                var field = splitted[0];
                var fieldValue = splitted[1];
                lodash.set(paramObject, field, fieldValue);
            });
        } else {
            var splitted = params.trim().split(':');
            var field = splitted[0];
            var fieldValue = splitted[1];
            lodash.set(paramObject, field, fieldValue);
        }
        callback(undefined, paramObject);
    } catch (err) {
        console.error('get-param-object', err);
        callback({
            message: 'Error parsing parameters'
        });
    }
}
module.exports = execute;