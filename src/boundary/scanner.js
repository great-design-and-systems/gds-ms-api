'use strict';
var ValidateHost = require('../control/security/validate-host');
var GetSudentProfile = require('../control/student/get-student-profile');
var GetFacultyProfile = require('../control/faculty/get-faculty-profile');
var GetPersonType = require('../control/check-in/get-person-type');
var CreateEntryFromInfo = require('../control/check-in/create-entry-from-info');
var CheckIn = require('../control/time/check-in');
var CheckInPurpose = require('../control/time/check-in-purpose');
var GetTimeInfo = require('../control/time/get-time-info');
var CheckInVisitor = require('../control/time/check-in-visitor');
function checkIn(host, barcode, when, callback) {
    new ValidateHost(host, function (err) {
        if (!err) {
            new GetSudentProfile(barcode, function (err, studentInfo) {
                if (!err) {
                    new CreateEntryFromInfo(when, studentInfo, function (err, entry) {
                        new GetPersonType(entry, function (err, personType) {
                            entry.personType = personType;
                            new CheckIn(entry, callback);
                        });
                    });
                } else {
                    console.log('GetStudentProfile');
                    new GetFacultyProfile(barcode, function (err, facultyInfo) {
                        new CreateEntryFromInfo(when, facultyInfo, function (err, entry) {
                            new GetPersonType(entry, function (err, personType) {
                                entry.personType = personType;
                                new CheckIn(entry, callback);
                            });
                        });
                    });
                }
            });
        } else {
            callback(err);
        }
    });
}

function checkInPurpose(host, timeInID, purpose, callback) {
    new ValidateHost(host, function (err) {
        if (!err) {
            new CheckInPurpose(timeInID, purpose, callback);
        } else {
            callback(err);
        }
    });
}

function getTimeInfo(host, timeInID, callback) {
    new ValidateHost(host, function (err) {
        if (!err) {
            new GetTimeInfo(timeInID, callback);
        } else {
            callback(err);
        }
    });
}

function checkInVisitor(host, fullname, purpose, when, callback) {
    new ValidateHost(host, function (err) {
        if (!err) {
            new CheckInVisitor({
                fullname: fullname,
                purpose: purpose,
                when: when
            }, callback);
        } else {
            callback(err);
        }
    });
}

module.exports = {
    checkIn: checkIn,
    checkInPurpose: checkInPurpose,
    getTimeInfo: getTimeInfo,
    checkInVisitor: checkInVisitor
};