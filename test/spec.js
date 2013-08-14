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

  var assertListElementsEqual = function (id, values) {
    ptor.findElement(protractor.By.id(id))
    .findElements(protractor.By.tagName('li'))
    .then(function(elements) {
      expect(elements.length).toEqual(values.length);
      for (var i = 0; i < elements.length; ++i) {
        expect(elements[i].getText()).toEqual(values[i]);
      };
    });
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

  it('initializes the lists based on scope data', function() {
    assertListElementsEqual('thingsList', ['Foo', 'Bar', 'Baz']);
    assertListElementsEqual('otherThingsList', []);
    assertListElementsEqual('copyableThingsList', ['Paper', 'Right']);
  });

  it('moves items between lists when dragged', function() {
    dragAndDropItem('itemBar', 'otherThingsList');
    assertListElementsEqual('otherThingsList', ['Bar']);
    assertListElementsEqual('thingsList', ['Foo', 'Baz']);
  });

  it('reappends items to their own list when dragged to nowhere', function() {
    dragAndDropItem('itemBar', 'boring');
    assertListElementsEqual('thingsList', ['Foo', 'Baz', 'Bar']);
    assertListElementsEqual('otherThingsList', []);
  });

  it('can move an item back to its original list', function() {
    dragAndDropItem('itemBar', 'otherThingsList');
    dragAndDropItem('itemBar', 'thingsList');
    assertListElementsEqual('thingsList', ['Foo', 'Baz', 'Bar']);
    assertListElementsEqual('otherThingsList', []);
  });

  it('copies items when dragged from element with btf-double-dragon', function() {
    dragAndDropItem('itemPaper', 'otherThingsList');
    assertListElementsEqual('copyableThingsList', ['Paper', 'Right']);
    assertListElementsEqual('otherThingsList', ['Paper']);
  });
});
