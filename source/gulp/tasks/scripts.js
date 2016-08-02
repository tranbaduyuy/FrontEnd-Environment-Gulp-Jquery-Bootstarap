var conf = require('../config.json');
var gulp = require('gulp');
var replace = require('gulp-replace');
var jshint = require('gulp-jshint');
var addSrc = require('gulp-add-src');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');

var knownOptions = {
  string: 'env',
  default: {env: 'local'}
};

gulp.task('libs', function() {
    return gulp.src(
        conf.vendor.js.concat(
            [
                !conf.base.src + conf.path.js + '/libs/html5shiv.js',
                !conf.base.src + conf.path.js + '/libs/respond.js',
                conf.base.src + conf.files.libJs
            ]
        )).pipe(concat('libs.js'))
        .pipe(gulp.dest(conf.base.build + conf.path.js));
});

gulp.task('app', function() {
    return gulp.src([
                conf.base.src + conf.path.js + '/app.js',
                conf.base.src + conf.files.commonJs,
                conf.base.src + conf.files.componentsJs
            ]).pipe(concat('app.js'))
        .pipe(jshint('./gulp/.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest(conf.base.build + conf.path.js));
});

gulp.task('js:build', function() {
    var libJs = conf.base.src + conf.files.libJs;

  gulp.src([conf.base.src + conf.files.js, '!' + libJs, '!' + conf.base.src + conf.files.componentsJs, '!' + conf.base.src + conf.files.commonJs])
    .pipe(jshint('./gulp/.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(addSrc(libJs))
    .pipe(gulp.dest(conf.base.build));
});

gulp.task('scripts', function (cb) {
    runSequence('js:build', ['libs', 'app'], cb);
});