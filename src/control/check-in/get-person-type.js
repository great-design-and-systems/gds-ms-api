'use strict';
function execute(entry, callback) {
    var personType = 'visitor';
    if (entry.studentId) {
        personType = 'student';
    } else if (entry.facultyId) {
        personType = 'faculty';
    }
    callback(undefined, personType);
}

module.exports = execute;