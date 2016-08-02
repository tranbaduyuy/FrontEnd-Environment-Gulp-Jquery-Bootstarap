var conf = require('../config.json');
var gulp = require('gulp');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var git = require('gulp-git');
var today = new Date();
var todayStr = today.getDay() + '-' + today.getMonth() + '-' + today.getFullYear() + '-' +
(today.getHours() * 60  + today.getMinutes()) * 60 + today.getSeconds();

gulp.task('delivery', function (cb){
    runSequence('compile', 'zip:compile', cb);
});

gulp.task('zip:build', function () {
    return gulp.src(conf.base.build + '**')
        .pipe(zip('build-' + todayStr + '.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('zip:compile', function () {
    return gulp.src(conf.base.compile + '**')
        .pipe(zip('release-' + todayStr + '.zip'))
        .pipe(gulp.dest('.'));
});
