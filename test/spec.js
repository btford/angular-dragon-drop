var util = require('util');
var fs = require('fs');
var path = require('path');

describe('angular-dragon-drop example', function() {
  var ptor = protractor.getInstance();

  beforeEach(function() {
  });

  it('initializes the lists', function() {
    ptor.get('http://localhost:8006/test/simple.html');

    var expectedValues = ['one', 'two', 'three'];
    ptor.findElement(protractor.By.id("thingsList"))
    .findElements(protractor.By.tagName("li"))
    .then(function (elements) {
      expect(elements.length).toEqual(expectedValues.length);
      for (var i = 0; i < elements.length; ++i) {
        expect(elements[i].getText()).toEqual(expectedValues[i]);
      }
    });

    ptor.findElement(protractor.By.id("otherThingsList"))
    .findElements(protractor.By.tagName("li"))
    .then(function (elements) {
      expect(elements.length).toEqual(0);
    });
  });
});
