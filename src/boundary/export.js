'use strict';
var CreateExportCSV = require('../control/export/create-export-csv');
var AddExportItemCSV = require('../control/export/add-export-item-csv');
var UploadSingleFile = require('../control/file/upload-single-file');
var sbuff = require('simple-bufferstream');
var fs = require('fs-extra');
var moment = require('moment');
var UpdateExportCSVFileInfo = require('../control/export/update-export-csv-file-info');
var GetExportCompleted = require('../control/export/get-export-completed');
var GetExportInProgress = require('../control/export/get-export-inprogress');
var RemoveExportTrackerById = require('../control/export/remove-export-tracker-by-id');
var RemoveCompletedTracker = require('../control/export/remove-completed-tracker');
var DeleteFile = require('../control/file/delete-file');
var FailExportTracker = require('../control/export/fail-export-tracker');
var GetExportFailed = require('../control/export/get-export-failed');
module.exports = {
    createExportCSV: createExportCSV,
    addExportItemsCSV: addExportItemsCSV,
    getExportCompleted: getExportCompleted,
    getExportInProgress: getExportInProgress,
    removeExportTrackerById: removeExportTrackerById,
    removeCompletedExportTracker: removeCompletedExportTracker,
    getExportFailed: getExportFailed
};

function createExportCSV(description, limit, columns, callback) {
    new CreateExportCSV(description, limit, columns, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(undefined, result);
        }
    });
}

function addExportItemCSV(exportId, data, callback) {
    new AddExportItemCSV(exportId, data, function (err, result) {
        if (err) {
            callback(err);
        } else {
            if (result.ok) {
                callback(undefined, result);
            } else {
                var filePath = moment().format('MMMM_Do_YYYY_h_mm_ss_a') + '_' + exportId + '.csv';
                var writer = fs.createWriteStream(filePath, 'utf-8');
                sbuff(result.raw).pipe(writer);
                writer.on('finish', function () {
                    new UploadSingleFile(filePath, result.contentLength, 'text/csv', 'system', function (errUpload, resultUpload) {
                        if (errUpload) {
                            callback(errUpload);
                        } else {
                            new UpdateExportCSVFileInfo(exportId, resultUpload.fileId, function (errUpdateExportCSV) {
                                if (errUpdateExportCSV) {
                                    callback(errUpdateExportCSV);
                                } else {
                                    callback(undefined, {
                                        exportId: exportId,
                                        fileId: resultUpload.fileId,
                                        status: 'COMPLETED'
                                    });
                                }
                            });
                        }
                    });
                });
            }
        }
    });
}

function addExportItemsCSV(exportId, items, track, index) {
    if (!index) {
        index = 0;
    }
    if (items instanceof Array) {
        if (index < items.length) {
            addExportItemCSV(exportId, items[index], function (err, result) {
                if (err) {
                    console.error('export', err);
                    new FailExportTracker(exportId, function (errFailing) {
                        if (errFailing) {
                            console.error('export', 'Error even with failing');
                        }
                        track({
                            status: 'FAILED',
                            message: 'An error has occured'
                        });
                    });
                } else {
                    if (result.ok) {
                        track(result);
                        index++;
                        addExportItemsCSV(exportId, items, track, index);
                    } else {
                        track({
                            exportId: exportId,
                            status: 'COMPLETED'
                        });
                    }
                }
            });
        } else {
            track({
                exportId: exportId,
                status: 'COMPLETED'
            });
        }
    } else {
        console.error('export', 'Body must be an array');
    }

}

function getExportCompleted(callback) {
    new GetExportCompleted(function (errExportCompleted, result) {
        if (errExportCompleted) {
            callback(errExportCompleted);
        } else {
            callback(undefined, result);
        }
    });
}

function getExportInProgress(callback) {
    new GetExportInProgress(function (errExportInProgress, result) {
        if (errExportInProgress) {
            callback(errExportInProgress);
        } else {
            callback(undefined, result);
        }
    });
}

function removeExportTrackerById(exportId, callback) {
    new RemoveExportTrackerById(exportId, function (errRemoveTracker, result) {
        if (errRemoveTracker) {
            callback(errRemoveTracker);
        } else {
            new DeleteFile(result.fileId, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(undefined, result);
                }
            });
        }
    });
}

function removeCompletedExportTracker(host, callback) {
    new RemoveCompletedTracker(function (errRemoveTracker, result) {
        if (errRemoveTracker) {
            callback(errRemoveTracker);
        } else {
            callback(undefined, result);
        }
    });
}
function getExportFailed(callback) {
    new GetExportFailed(function (errExportFailed, result) {
        if (errExportFailed) {
            callback(errExportFailed);
        } else {
            callback(undefined, result);
        }
    });
}