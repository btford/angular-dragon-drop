// Configuration for protractor running on Travis CI with Sauce Labs

exports.config = {
  sauceUser: "davidmikesimon",
  sauceKey: "519e8897-9a6d-4f2c-81a1-10132cab95d0",

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
