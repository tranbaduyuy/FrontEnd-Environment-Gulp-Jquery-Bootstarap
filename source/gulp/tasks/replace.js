var conf = require('../config.json');
var gulp = require('gulp');
var replace = require('gulp-replace');

gulp.task('replace', function(){
  gulp.src(['file.txt'])
    .pipe(replace('bar', 'foo'))
    .pipe(gulp.dest('build/file.txt'));
});