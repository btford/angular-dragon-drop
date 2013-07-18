/*
 * angular-dragon-drop v0.1.0
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
    var globalHandlerAdded = false;

    var drag = function (ev) {
      var x = ev.clientX,
        y = ev.clientY;

      floaty.css('left', x - 10 + 'px');
      floaty.css('top', y - 10 + 'px');
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

    var killFloaty = function () {
      $document.unbind('mousemove', drag);
      if (floaty) {
        floaty.remove();
        floaty = null;
      }
    };

    var addMouseUpListener = function(scope) {
      // we only need one handler
      if (globalHandlerAdded) return

      $document.bind('mouseup', function (ev) {
        if (dragValue) {
          floaty[0].style.display = 'none';

          // hide floaty to see whats underneath
          var dropArea = document.elementFromPoint(ev.clientX,ev.clientY);
          
          if (dropArea.nodeType == 3) { // Opera
            dropArea = dropArea.parentNode;
          }

          // unhide floaty
          floaty[0].style.display = '';

          // see if we have an dragon-drop element
          dropArea = angular.element(dropArea);
          var expression = dropArea.attr('btf-dragon')

          if(expression) {
            // there it is! Get list and add item
            var targetScope = dropArea.scope();
            var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*$/);
            
            targetScope.$apply(function() {
              var targetList = targetScope.$eval(match[2]);
              targetList.push(dragValue);
              dragValue = dragOrigin = null;  
            });
            
          }
          else {
            // no dropArea here. Put item back to origin
            scope.$apply(function () {
              dragOrigin.push(dragValue);
              dragValue = dragOrigin = null;
            });
          }

          enableSelect();
          killFloaty();
      
        }
      });

      globalHandlerAdded = true;
    }

    return {
      restrict: 'A',
      compile: function (container, attr) {

        // get the `thing in things` expression
        var expression = attr.btfDragon;
        var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*$/);
        if (!match) {
          throw Error("Expected btfDragon in form of '_item_ in _collection_' but got '" +
            expression + "'.");
        }
        var lhs = match[1];
        var rhs = match[2];

        // pull out the template to re-use. Improvised ng-transclude.
        var template = container.html();

        // wrap text nodes
        try {
          template = angular.element(template);
          if (template.length === 0) {
            throw new Error('');
          }
        }
        catch (e) {
          template = angular.element('<span>' + template + '</span>');
        }
        var child = template.clone();
        child.attr('ng-repeat', expression);
        container.html('');

        container.append(child);

        return function (scope, elt, attr) {

          addMouseUpListener(scope);

          var spawnFloaty = function () {
            scope.$apply(function () {
              floaty = template.clone();
              floaty.css('position', 'fixed');
              var floatyScope = scope.$new();
              floatyScope[lhs] = dragValue;
              $compile(floaty)(floatyScope);
              angular.element(document.body).append(floaty);
            });

            $document.bind('mousemove', drag);
          };

          elt.bind('mousedown', function (ev) {
            if (dragValue) {
              return;
            }
            var targetScope = angular.element(ev.target).scope();
            var value = dragValue = targetScope[lhs];
            var list = scope.$eval(rhs);

            // return if we don't have an value to drag
            if(!value) return

            scope.$apply(function () {
              dragOrigin = list;
              list.splice(list.indexOf(value), 1);
            });
            disableSelect();
            spawnFloaty();
            drag(ev);
          });

        };
      }
    };
  });
