var gulp = require('gulp');
var runSequence = require('run-sequence');
var requireDir = require('require-dir')('./gulp/tasks', { recurse: true });

gulp.task('default', function (cb) {
    runSequence('build', 'browser-sync:build', 'watch', cb);
});

gulp.task('run:compile', function (cb) {
    runSequence('compile', 'browser-sync:compile', cb);
});