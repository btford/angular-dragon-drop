// Configuration for protractor running on Travis CI with Sauce Labs

exports.config = {
  seleniumAddress: process.env.SAUCE_USERNAME +
                   ":" + process.env.SAUCE_ACCESS_KEY +
                   "@localhost:4445",

  specs: [
    'test/spec/*.js',
  ],

  capabilities: {
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'tags': [process.env.TRAVIS_NODE_VERSION]
  },

  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    includeStackTrace: true
  }
};
