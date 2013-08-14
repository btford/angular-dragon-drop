#!/usr/bin/env node

var express = require('express');
var util = require('util');
var path = require('path');
var testApp = express();
var DEFAULT_PORT = 8006;

var main = function(argv) {
  var port = Number(argv[2]) || DEFAULT_PORT;
  testApp.listen(port);
  util.puts(["Starting express web server in", __dirname ,"on port", port].
      join(" "));
};

testApp.configure(function() {
  testApp.use(express.static(__dirname));
});

main(process.argv);
