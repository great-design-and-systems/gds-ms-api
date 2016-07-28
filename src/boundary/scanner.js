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
    new ValidateHost(host, function (secErr) {
        if (!secErr) {
            new GetSudentProfile(barcode, function (errStdnt, studentInfo) {
                if (!errStdnt) {
                    console.log('errStdnt', errStdnt);
                    new CreateEntryFromInfo(when, studentInfo, function (errEntry, entry) {
                        if (errEntry) {
                            callback(errEntry);
                        } else {
                            new GetPersonType(entry, function (errPrsTyp, personType) {
                                entry.personType = personType;
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
                                    new GetPersonType(entry, function (errPrsTyp, personType) {
                                        entry.personType = personType;
                                        new CheckIn(entry, callback);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            callback(secErr);
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