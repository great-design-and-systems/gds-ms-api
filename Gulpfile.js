'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var clean = require('gulp-clean');
var path = require('path');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var server = require('gulp-express');
var TEST_FILES = process.env.TEST_FILES || 'test/**/*.bdd.js';
var SRC_FILES = process.env.SRC_FILES || 'src/**/*.js';
var INDEX_FILE = 'index.js';

gulp.task('default', function () {
    runSequence('jshint', 'test');
});

gulp.task('test', function () {
    return gulp.src(TEST_FILES, {
        read: false
    })
        .pipe(mocha())
        .pipe(mocha({
            reporter: 'nyan'
        }));
});

gulp.task('jshint', function () {
    return gulp.src(SRC_FILES)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function () {
    return gulp.watch([SRC_FILES, TEST_FILES], ['default']);
});

gulp.task('server-start', function () {
    server.run([INDEX_FILE]);
});

gulp.task('server-watch', function () {
    server.run([INDEX_FILE]);
    gulp.watch([SRC_FILES, TEST_FILES], function (event) {
        server.notify(event);
    });
});

gulp.task('start', function () {
    runSequence('jshint', 'test', 'server-start');
})