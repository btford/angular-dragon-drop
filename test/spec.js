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
    ptor.findElement(protractor.By.id(id + 'List'))
    .findElements(protractor.By.tagName('li'))
    .then(function(elements) {
      expect(elements.length).toEqual(values.length);
      for (var i = 0; i < elements.length; ++i) {
        expect(elements[i].getText()).toEqual(values[i]);
      };
    });

    ptor.findElement(protractor.By.id(id + 'Values'))
    .then(function(element) {
      expect(element.getText()).toEqual(values.join(','));
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
    assertListElementsEqual('things', ['Foo', 'Bar', 'Baz']);
    assertListElementsEqual('otherThings', []);
    assertListElementsEqual('copyableThings', ['Paper', 'Right']);
    assertListElementsEqual('noBeeThings', ['Nose']);
  });

  it('moves items between lists when dragged', function() {
    dragAndDropItem('itemBar', 'otherThingsList');
    assertListElementsEqual('otherThings', ['Bar']);
    assertListElementsEqual('things', ['Foo', 'Baz']);
  });

  it('reappends items to their own list when dragged to nowhere', function() {
    dragAndDropItem('itemBar', 'boring');
    assertListElementsEqual('things', ['Foo', 'Baz', 'Bar']);
    assertListElementsEqual('otherThings', []);
  });

  it('can move an item back to its original list', function() {
    dragAndDropItem('itemBar', 'otherThingsList');
    dragAndDropItem('itemBar', 'thingsList');
    assertListElementsEqual('things', ['Foo', 'Baz', 'Bar']);
    assertListElementsEqual('otherThings', []);
  });

  it('copies items with btf-double-dragon', function() {
    dragAndDropItem('itemPaper', 'otherThingsList');
    assertListElementsEqual('copyableThings', ['Paper', 'Right']);
    assertListElementsEqual('otherThings', ['Paper']);
  });

  it('limits accepted items with btf-dragon-accepts', function() {
    dragAndDropItem('itemPaper', 'noBeeThingsList');
    assertListElementsEqual('noBeeThings', ['Nose', 'Paper']);
    dragAndDropItem('itemBar', 'noBeeThingsList');
    assertListElementsEqual('noBeeThings', ['Nose', 'Paper']);
    dragAndDropItem('itemFoo', 'noBeeThingsList');
    assertListElementsEqual('noBeeThings', ['Nose', 'Paper', 'Foo']);
  });
});
