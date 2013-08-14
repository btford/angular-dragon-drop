var util = require('util');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var webdriver = require('selenium-webdriver');

describe('angular-dragon-drop', function() {
  var server = null;
  beforeEach(function() {
    if (!server) {
      server = child_process.spawn('./test/webserver.js');
      server.unref(); // Server will stop when the protractor process ends
    }

    ptor.get('http://localhost:8006/test/page.html');
  });

  var ptor = protractor.getInstance();

  var findListElements = function (id, f) {
    return ptor.findElement(protractor.By.id(id))
    .findElements(protractor.By.tagName("li"));
  };

  var dragAndDropItem = function(srcId, dstId) {
    ptor.findElement(protractor.By.id(srcId))
    .then(function(srcElem) {
      ptor.findElement(protractor.By.id(dstId))
      .then(function(dest) {
        new webdriver.ActionSequence(ptor.driver)
        .dragAndDrop(srcElem, dest)
        .perform();
      });
    });
  };

  it('initializes the lists correctly', function() {
    findListElements("thingsList").then(function(elements) {
      expect(elements.length).toEqual(3);
      expect(elements[0].getText()).toEqual("0");
      expect(elements[1].getText()).toEqual("1");
      expect(elements[2].getText()).toEqual("2");
    });

    findListElements("otherThingsList").then(function(elements) {
      expect(elements.length).toEqual(0);
    });
  });

  it('moves items between lists when dragged', function() {
    dragAndDropItem("item1", "otherThingsList");

    findListElements("otherThingsList").then(function(elements) {
      expect(elements.length).toEqual(1);
      expect(elements[0].getText()).toEqual("1");
    });

    findListElements("thingsList").then(function(elements) {
      expect(elements.length).toEqual(2);
      expect(elements[0].getText()).toEqual("0");
      expect(elements[1].getText()).toEqual("2");
    });
  });

  it('reappends items to their own list when dragged to nowhere', function() {
    dragAndDropItem("item1", "boring");

    findListElements("thingsList").then(function(elements) {
      expect(elements.length).toEqual(3);
      expect(elements[0].getText()).toEqual("0");
      expect(elements[1].getText()).toEqual("2");
      expect(elements[2].getText()).toEqual("1"); // Item1 moved to the end
    });

    findListElements("otherThingsList").then(function(elements) {
      expect(elements.length).toEqual(0);
    });
  });

  it('can move an item back to its original list', function() {
    dragAndDropItem("item1", "otherThingsList");
    dragAndDropItem("item1", "thingsList");

    findListElements("otherThingsList").then(function(elements) {
      expect(elements.length).toEqual(0);
    });

    findListElements("thingsList").then(function(elements) {
      expect(elements.length).toEqual(3);
      expect(elements[0].getText()).toEqual("0");
      expect(elements[1].getText()).toEqual("2");
      expect(elements[2].getText()).toEqual("1"); // Item1 moved to the end
    });
  });
});
