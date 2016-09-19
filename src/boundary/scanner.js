'use strict';
var GetSudentProfile = require('../control/student/get-student-profile');
var GetFacultyProfile = require('../control/faculty/get-faculty-profile');
var GetPersonType = require('../control/check-in/get-person-type');
var CreateEntryFromInfo = require('../control/check-in/create-entry-from-info');
var CheckIn = require('../control/time/check-in');
var CheckInPurpose = require('../control/time/check-in-purpose');
var GetTimeInfo = require('../control/time/get-time-info');
var CheckInVisitor = require('../control/time/check-in-visitor');
function checkIn(barcode, when, callback) {
    new GetSudentProfile(barcode, function (errStdnt, studentInfo) {
        if (!errStdnt) {
            console.log('errStdnt', errStdnt);
            new CreateEntryFromInfo(when, studentInfo, function (errEntry, entry) {
                if (errEntry) {
                    callback(errEntry);
                } else {
                    new GetPersonType(studentInfo, function (errPrsTyp, personType) {
                        entry.personType = personType;
                        entry.imageId = studentInfo.imageId;
                        new CheckIn(entry, callback);
                    });
                }
            });
        } else {
            new GetFacultyProfile(barcode, function (errFclty, facultyInfo) {
                if (errFclty) {
                    callback(errFclty);
                } else {
                    new CreateEntryFromInfo(when, facultyInfo, function (errEntry, entry) {
                        if (errEntry) {
                            callback(errEntry);
                        } else {
                            new GetPersonType(facultyInfo, function (errPrsTyp, personType) {
                                entry.personType = personType;
                                entry.imageId = facultyInfo.imageId;
                                new CheckIn(entry, callback);
                            });
                        }
                    });
                }
            });
        }
    });
}

function checkInPurpose(timeInID, purpose, callback) {
    new CheckInPurpose(timeInID, purpose, callback);
}

function getTimeInfo(timeInID, callback) {
    new GetTimeInfo(timeInID, callback);
}

function checkInVisitor(fullname, purpose, when, callback) {
    new CheckInVisitor({
        fullname: fullname,
        purpose: purpose,
        when: when
    }, callback);
}

module.exports = {
    checkIn: checkIn,
    checkInPurpose: checkInPurpose,
    getTimeInfo: getTimeInfo,
    checkInVisitor: checkInVisitor
};