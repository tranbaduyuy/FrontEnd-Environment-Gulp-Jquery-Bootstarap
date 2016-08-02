module.exports = function(config){
    /**
    * Load in our build configuration file.
    */
    //var userConfig = require('./build.config.js');

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // list of files / patterns to load in the browser
        files: [
            'vendor/jquery/dist/jquery.js',
            'vendor/carouFredSel/jquery.carouFredSel-6.2.1.js',
            'build/assets/**/*.js',
            'test/spec/**/*.js'
        ],

        // list of files to exclude
        exclude: [],

        preprocessors: {
            
        },

        proxies: {

        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress','spec'],

        // web server port
        port: 3000,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        autoWatch: true,

        // frameworks to use
        frameworks: ['jasmine'],

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-spec-reporter'
        ],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 5000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
