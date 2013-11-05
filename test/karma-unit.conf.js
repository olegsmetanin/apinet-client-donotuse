var shared = require('./karma-shared.conf');

module.exports = function(config) {
  shared(config);

  config.files = shared.files.concat([
    //extra testing code
    'angular-mocks/index.js',

    //test files
    './test/unit/**/*.js'
  ]);
};
