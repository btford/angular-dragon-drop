// Configuration for local protractor specs

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'test/spec/*.js',
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    includeStackTrace: true
  }
};
