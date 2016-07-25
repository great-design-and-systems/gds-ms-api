'use strict';
var ValidateHost = require('../control/security/validate-host');
var GetSudentProfile = require('../control/student/get-student-profile');
var GetFacultyProfile = require('../control/faculty/get-faculty-profile');

function checkIn(host, barcode, callback) {
    new ValidateHost(host, function (err) {
        if (!err) {
            new GetSudentProfile(barcode, function (err, studentInfo) {
                if (!err) {
                    proceedWithStudent(studentInfo, callback);
                } else {
                    new GetFacultyProfile(barcode, function (err, facultyInfo) {
                        proceedWithFaculty(facultyInfo, callback);
                    });
                }
            });
        }
    });
}

function updateWithPurpose(host, entry, callback) {

}

function proceedWithStudent(studentInfo, callback) {

}

function proceedWithFaculty(facultyInfo, callback) {

}