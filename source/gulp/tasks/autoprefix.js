var conf = require('../config.json');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('autoprefixer', function () {
    return gulp.src(conf.base.build + conf.path.css + 'app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 8', 'iOS >= 7'],
            cascade: false
        })).pipe(gulp.dest(conf.base.build + conf.path.css));
});
