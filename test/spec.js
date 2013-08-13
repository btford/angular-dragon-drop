var util = require('util');
var fs = require('fs');
var path = require('path');

describe('angular-dragon-drop example', function() {
  var ptor = protractor.getInstance();

  beforeEach(function() {
    ptor.get('http://localhost:8006/example.html');
  });

  it('initializes the first list correctly', function() {
    var expectedValues = ['one', 'two', 'three'];

    ptor.findElement(protractor.By.id("thingsList"))
    .findElements(protractor.By.tagName("li"))
    .then(function (elements) {
      expect(elements.length).toEqual(expectedValues.length);
      for (var i = 0; i < elements.length; ++i) {
        expect(elements[i].getText()).toEqual(expectedValues[i]);
      }
    });
  });

  it('initializes the second list correctly', function() {
    ptor.findElement(protractor.By.id("otherThingsList"))
    .findElements(protractor.By.tagName("li"))
    .then(function (elements) {
      expect(elements.length).toEqual(0);
    });
  });
});
