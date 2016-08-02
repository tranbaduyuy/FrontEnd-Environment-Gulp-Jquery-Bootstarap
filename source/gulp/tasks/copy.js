var conf = require('../config.json');
var gulp = require('gulp');

gulp.task('copy:build', function () {
    //Root files
    gulp.src([
            conf.base.src + conf.path.root + conf.files.root,
            conf.base.src + conf.path.root + conf.files.hidden
        ])
        .pipe(gulp.dest(conf.base.build));
    //Fonts + Translations files + images
    gulp.src([
            conf.base.src + conf.path.fonts + conf.files.fonts,
            conf.base.src + conf.path.i18n + conf.files.i18n,
            conf.base.src + conf.path.images + conf.files.images,
            conf.base.src + conf.path.mocks + conf.files.json
        ], {base: './' + conf.base.src})
        .pipe(gulp.dest(conf.base.build));
    //Static + vendors
    //gulp.src([
    //        conf.base.static + conf.files.static
    //    ], {base: './'})
    //    .pipe(gulp.dest(conf.base.build));
    //Scripts
    gulp.src(conf.base.src + conf.path.js + 'modernizr.js', {base: './'})
        .pipe(gulp.dest(conf.base.build + conf.path.js));

    //Mock data
    // gulp.src(conf.base.src + conf.base.mocks + '/*.json')
    //     .pipe(gulp.dest(conf.base.build))

    return gulp.src(conf.vendor.assets, {base: './'})
        .pipe(gulp.dest(conf.base.build));
});

gulp.task('copy:compile', function () {
    //Root files
    gulp.src([
            conf.base.src + conf.path.root + conf.files.root,
            conf.base.src + conf.path.root + conf.files.hidden
        ])
        .pipe(gulp.dest(conf.base.compile));

    //Mock data
    gulp.src(conf.base.src + '/*.json')
        .pipe(gulp.dest(conf.base.compile));
    //Fonts + images
    return gulp.src([
            conf.base.src + conf.path.fonts + conf.files.fonts
        ], {base: './' + conf.base.src})
        .pipe(gulp.dest(conf.base.compile));
    //Static + html
    //return gulp.src([
    //        conf.base.static + conf.files.static
    //    ], {base: './'})
    //    .pipe(gulp.dest(conf.base.compile));
});
