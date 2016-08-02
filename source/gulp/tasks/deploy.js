var conf = require('../config.json');
var gulp = require('gulp');
var scp = require('gulp-scp2');
var minimist = require('minimist');
var runSequence = require('run-sequence');

var knownOptions = {
  string: 'env',
  default: {env: 'local'}
};
var options = minimist(process.argv.slice(2), knownOptions);
var src = conf.base.compile + '/**/*', 
    host, dest;

switch(options.env) {
    case 'prod':
        src = conf.base.compile + '/**/*';
        host = '';
        dest = '';
        break;
    case 'dev':
        src = conf.base.build + '/**/*';
        host = '';
        dest = '';
        break;
    default:
        src = conf.base.compile + '/**/*';
        host = '';
        dest = '';
        break;
}
 
gulp.task('scp', function() {
    return gulp.src(src)
    .pipe(scp({
        host: host,
        username: 'webadmin',
        dest: dest,
        agent: process.env["SSH_AUTH_SOCK"],
        agentForward: true
    }))
    .on('error', function(err) {
        console.log(err);
    });
});

gulp.task('deploy', function (cb){
    runSequence('compile', cb);
});
