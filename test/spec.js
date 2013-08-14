var util = require('util');
var fs = require('fs');
var path = require('path');
var webdriver = require('selenium-webdriver');

describe('angular-dragon-drop example', function() {
  var ptor = protractor.getInstance();

  var listElements = function (id, f) {
    ptor.findElement(protractor.By.id(id))
    .findElements(protractor.By.tagName("li"))
    .then(f);
  };

  it('initializes the lists correctly', function() {
    ptor.get('http://localhost:8006/test/simple.html');

    listElements("thingsList", function (elements) {
      expect(elements.length).toEqual(3);
      for (var i = 0; i < elements.length; ++i) {
        expect(elements[i].getText()).toEqual(String(i));
      }
    });

    listElements("otherThingsList", function (elements) {
      expect(elements.length).toEqual(0);
    });
  });

  it('moves items between lists when dragged', function() {
    ptor.get('http://localhost:8006/test/simple.html');

    listElements("otherThingsList", function (elements) {
      expect(elements.length).toEqual(0);
    });

    ptor.findElement(protractor.By.id("item0"))
    .then(function(srcElem) {
      ptor.findElement(protractor.By.id("otherThingsList"))
      .then(function(dest) {
        new webdriver.ActionSequence(ptor.driver)
        .dragAndDrop(srcElem, dest)
        .perform();
      });
    });

    listElements("otherThingsList", function (elements) {
      expect(elements.length).toEqual(1);
    });
  });
});
