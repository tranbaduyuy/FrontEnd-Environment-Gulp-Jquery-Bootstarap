var gulp = require('gulp');
var conf = require('../config.json');
var runSequence = require('run-sequence');
var jade = require('gulp-jade');
var htmlhint = require('gulp-htmlhint');
//var access = require('gulp-accessibility');
var viewsPath = conf.base.src + conf.path.views;

gulp.task('jade', function() {
    return gulp.src([
            viewsPath + conf.files.jade,
            '!' + viewsPath + 'dev_1.jade',
            '!' + viewsPath + 'dev_2.jade',
            '!' + viewsPath + 'dev_3.jade',
            '!' + viewsPath +'dev_4.jade'])
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(conf.base.build))
        .pipe(htmlhint('./gulp/.htmlhintrc'))
        .pipe(htmlhint.reporter())
});

//gulp.task('accessibility', function() {
//   return gulp.src('build/components.html')
//   .pipe(access({force: true})).on('error', console.log);
//   .pipe(access({
//       accessibilityLevel: 'WCAG2AA',
//       accessibilityrc: true,
//       domElement: true,
//       force: true,
//       verbose: false
//   })).on('error', console.log)
//});
