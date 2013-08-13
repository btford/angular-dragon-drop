// Configuration for protractor specs

exports.config = {
  seleniumServerJar: 'selenium/selenium-server-standalone-2.34.0.jar',
  seleniumPort: 4444,
  chromeDriver: 'selenium/chromedriver',
  seleniumArgs: [],

  specs: [
    'test/spec.js',
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
