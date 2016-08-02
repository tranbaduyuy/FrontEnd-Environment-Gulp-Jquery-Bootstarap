var path = require('path');
var conf = require('../config.json');
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');
var csslint = require('gulp-csslint');
var autoprefixer = require('gulp-autoprefixer');
var sasslint = require('gulp-sass-lint');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');

gulp.task('sass:lint', function () {
    return gulp.src([
        conf.base.src + conf.path.sass + conf.files.sassAll,
        '!**/_fancybox.scss',
        '!**/_bootstrap.scss',
        '!**/_icons.scss',
        '!**/_variables.scss'
        ])
        .pipe(sasslint({
            options: { 'config-file': path.resolve(__dirname, '../scss-lint.yml') }
        }))
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError())
        ;
});

gulp.task('sass:build', function () {
    gulp.src(conf.base.src + conf.path.sass + conf.files.sass)
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'iOS > 6', 'ie >= 8', 'Safari >= 7'],
            cascade: false
        }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(conf.base.build + conf.path.css))
        .pipe(csslint.reporter());
});

gulp.task('vendorCss', function() {
   gulp.src(conf.vendor.css)
       .pipe(concat(conf.base.build + conf.path.css +'app.css'));
});

gulp.task('sass', function (cb) {
    runSequence('sass:lint', 'sass:build', cb);
});
