var conf = require('../config.json');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

gulp.task('imagemin:compile', function() {
    return gulp.src([conf.base.src + conf.path.images + conf.files.images], {base: './' + conf.base.src})
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(conf.base.compile));
});