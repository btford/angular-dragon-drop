/*
 * angular-dragon-drop v0.0.1
 * (c) 2013 Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('btford.dragon-drop', []).
  directive('btfDragon', function ($document, $compile) {
    /*
             ^                       ^
             |\   \        /        /|
            /  \  |\__  __/|       /  \
           / /\ \ \ _ \/ _ /      /    \
          / / /\ \ {*}\/{*}      /  / \ \
          | | | \ \( (00) )     /  // |\ \
          | | | |\ \(V""V)\    /  / | || \| 
          | | | | \ |^--^| \  /  / || || || 
         / / /  | |( WWWW__ \/  /| || || ||
        | | | | | |  \______\  / / || || || 
        | | | / | | )|______\ ) | / | || ||
        / / /  / /  /______/   /| \ \ || ||
       / / /  / /  /\_____/  |/ /__\ \ \ \ \
       | | | / /  /\______/    \   \__| \ \ \
       | | | | | |\______ __    \_    \__|_| \
       | | ,___ /\______ _  _     \_       \  |
       | |/    /\_____  /    \      \__     \ |    /\
       |/ |   |\______ |      |        \___  \ |__/  \
       v  |   |\______ |      |            \___/     |
          |   |\______ |      |                    __/
           \   \________\_    _\               ____/
         __/   /\_____ __/   /   )\_,      _____/
        /  ___/  \uuuu/  ___/___)    \______/
        VVV  V        VVV  V 
    */
    // this ASCII dragon is really important, do not remove

    var dragValue,
      dragOrigin,
      floaty;

    var drag = function (ev) {
      var x = ev.clientX,
        y = ev.clientY;

      floaty.css('left', x + 10 + 'px');
      floaty.css('top', y + 10 + 'px');
    };

    var disableSelect = function () {
      angular.element(document.body).css({
        '-moz-user-select': '-moz-none',
        '-khtml-user-select': 'none',
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
      });
    };

    var enableSelect = function () {
      angular.element(document.body).css({
        '-moz-user-select': '',
        '-khtml-user-select': '',
        '-webkit-user-select': '',
        '-ms-user-select': '',
        'user-select': ''
      });
    };

    return {
      restrict: 'A',
      terminal: true,
      link: function (scope, elt, attr) {

        // get the `thing in things` expression
        var expression = attr.btfDragon;
        var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*$/);
        if (!match) {
          throw Error("Expected ngRepeat in form of '_item_ in _collection_' but got '" +
            expression + "'.");
        }
        var lhs = match[1];
        var rhs = match[2];

        // pull out the template to re-use. Improvised ng-transclude.
        var template = elt.html();
        elt.html('');
        var child = angular.element('<div ng-repeat="' + lhs + ' in ' + rhs + '">' + template + '</div>');
        elt.append(child);

        $compile(child)(scope);

        var spawnFloaty = function () {
          scope.$apply(function () {
            floaty = angular.element('<div style="position: fixed;">' + template + '</div>');
            var floatyScope = scope.$new();
            floatyScope[lhs] = dragValue;
            $compile(floaty)(floatyScope);
            angular.element(document.body).append(floaty);
          });

          $document.bind('mousemove', drag);
        };

        var killFloaty = function () {
          $document.unbind('mousemove', drag);
          if (floaty) {
            floaty.remove();
            floaty = null;
          }
        };

        elt.bind('mousedown', function (ev) {
          if (dragValue) {
            return;
          }
          scope.$apply(function () {
            var targetScope = angular.element(ev.target).scope();
            var value = dragValue = targetScope[lhs];
            //console.log(value);
            var list = scope.$eval(rhs);
            dragOrigin = list;
            list.splice(list.indexOf(value), 1);
          });
          disableSelect();
          spawnFloaty();
          drag(ev);
        });

        // handle something being dropped here
        elt.bind('mouseup', function (ev) {
          if (dragValue) {
            scope.$apply(function () {
              var list = scope.$eval(rhs);
              list.push(dragValue);
              dragValue = dragOrigin = null;
            });
          }
          enableSelect();
          killFloaty();
        });

        // else, the event bubbles up to document
        $document.bind('mouseup', function (ev) {
          if (dragValue) {
            scope.$apply(function () {
              dragOrigin.push(dragValue);
              dragValue = dragOrigin = null;
            });
            enableSelect();
            killFloaty();
          }
        });

      }
    };
  });
