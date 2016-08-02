var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('compile', function (cb){
    runSequence('build', ['copy:compile', 'imagemin:compile'], 'usemin', cb);
});