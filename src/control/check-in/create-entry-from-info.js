'use strict';
function execute(when, info, callback) {
    try {
        var entry = createEntry(when, info);
        callback(undefined, entry);
    } catch (err) {
        callback({
            mesage: 'Error creating entry'
        });
    }
}

function createEntry(when, info) {
    var entry = {};
    entry.personId = info.studentId || info.facultyId;
    entry.when = when;
    entry.fullname = info.lastName + ', ' + info.firstName + ' ' + (info.middleName ? info.middleName : '');
    entry.department = info.department;
    entry.studentLevel = info.level;
    return entry;
}

module.exports = execute;