var conf = require('../config.json');
var pkg = require('../../package.json');
var gulp = require('gulp');
var htmlhint = require('gulp-htmlhint');
var replace = require('gulp-replace');
var inject = require('gulp-inject');

gulp.task('htmlhint:build', function() {
  return gulp.src(conf.base.build)
    .pipe(htmlhint('./gulp/.htmlhintrc'))
    .pipe(htmlhint.reporter());
});