/*
 * angular-dragon-drop v0.3.1
 * (c) 2013 Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('btford.dragon-drop', []).
  directive('btfDragon', function ($document, $compile, $rootScope) {
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
      dragKey,
      dragOrigin,
      dragDuplicate = false,
      dragEliminate = false,
      mouseReleased = true,
      floaty,
      offsetX,
      offsetY,
      fixed;

    var isFixed = function(element) {
      var parents = element.parent(), i, len = parents.length;
      for (i = 0; i < len; i++) {
        if (parents[i].hasAttribute('btf-dragon-fixed')) {
          return true;
        } else if (parents[i].hasAttribute('btf-dragon')) {
          return false;
        }
      }
      return false;
    };

    var drag = function (ev) {
      var x = ev.clientX - offsetX,
        y = ev.clientY - offsetY;

      floaty.css('left', x + 'px');
      floaty.css('top', y + 'px');
    };

    var remove = function (collection, index) {
      if (collection instanceof Array) {
        return collection.splice(index, 1);
      } else {
        var temp = collection[index];
        delete collection[index];
        return temp;
      }
    };

    var add = function (collection, item, key, position) {
      if (collection instanceof Array) {
        var pos;
        if (position === 0 || position) {
          pos = position;
        } else {
          pos = collection.length;
        }
        collection.splice(pos, 0, item);
      } else {
        collection[key] = item;
      }
    };

    var findContainer = function(elem){
      var children = elem.find('*');

      for (var i = 0; i < children.length; i++){
        if (children[i].hasAttribute('btf-dragon-container')) {
          return angular.element(children[i]);
        }
      }

      return null;
    };

    var documentBody = angular.element($document[0].body);

    var disableSelect = function () {
      documentBody.css({
        '-moz-user-select': '-moz-none',
        '-khtml-user-select': 'none',
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
      });
    };

    var enableSelect = function () {
      documentBody.css({
        '-moz-user-select': '',
        '-khtml-user-select': '',
        '-webkit-user-select': '',
        '-ms-user-select': '',
        'user-select': ''
      });
    };

    var killFloaty = function () {
      if (floaty) {
        $rootScope.$broadcast('drag-end');
        $document.unbind('mousemove', drag);
        floaty.scope().$destroy();
        floaty.remove();
        floaty = null;
      }
    };

    var getElementOffset = function (elt) {

      var box = elt.getBoundingClientRect();
      var body = $document[0].body;

      var xPosition = box.left + body.scrollLeft;
      var yPosition = box.top + body.scrollTop;

      return {
        left: xPosition,
        top: yPosition
      };
    };

    // Get the element at position (`x`, `y`) behind the given element
    var getElementBehindPoint = function (behind, x, y) {
      var originalDisplay = behind.css('display');
      behind.css('display', 'none');

      var element = angular.element($document[0].elementFromPoint(x, y));

      behind.css('display', originalDisplay);

      return element;
    };

    $document.bind('mouseup', function (ev) {
      mouseReleased = true;

      if (!dragValue) {
        return;
      }

      var dropArea = getElementBehindPoint(floaty, ev.clientX, ev.clientY);

      var accepts = function () {
        return dropArea.attr('btf-dragon') &&
        ( !dropArea.attr('btf-dragon-accepts') ||
          dropArea.scope().$eval(dropArea.attr('btf-dragon-accepts'))(dragValue) );
      };

      while (dropArea.length > 0 && !accepts()) {
        dropArea = dropArea.parent();
      }

      if (dropArea.attr('btf-dragon-sortable') !== undefined) {

        var min = dropArea[0].getBoundingClientRect().top;
        var max = dropArea[0].getBoundingClientRect().bottom;
        var positions = [];
        var position;

        positions.push(min);

        var i, j, leni, lenj;
        for (i = 0, leni = dropArea[0].children.length; i < leni; i++) {
          var totalHeight = 0;
          var smallestTop = Number.POSITIVE_INFINITY;
          for (j = 0, lenj = dropArea[0].children[i].getClientRects().length; j < lenj; j++) {
            if (smallestTop > dropArea[0].children[i].getClientRects()[j].top) {
              smallestTop = dropArea[0].children[i].getClientRects()[j].top;
            }
            totalHeight += dropArea[0].children[i].getClientRects()[j].height;
          }
          if (dropArea[0].children[i].attributes['btf-dragon-position'] !== undefined) {
            positions.push(smallestTop + (totalHeight / 2));
          }

        }

        positions.push(max);

        i = 0;
        while (i < positions.length) {
          if (positions[i] <= ev.clientY) {
            position = i;
          }
          i++;
        }

      }

      if (dropArea.length > 0) {
        var expression = dropArea.attr('btf-dragon');
        var targetScope = dropArea.scope();
        var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*$/);

        var targetList = targetScope.$eval(match[2]);
        targetScope.$apply(function () {
          add(targetList, dragValue, dragKey, position);
        });
      } else if (!dragDuplicate && !dragEliminate) {
        // no dropArea here
        // put item back to origin
        $rootScope.$apply(function () {
          add(dragOrigin, dragValue, dragKey);
        });
      }

      dragValue = dragOrigin = null;
      killFloaty();
    });

    return {
      restrict: 'A',

      compile: function (container, attr) {

        // get the `thing in things` expression
        var expression = attr.btfDragon;
        var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*$/);
        if (!match) {
          throw new Error('Expected btfDragon in form of "_item_ in _collection_" but got "' +
            expression + '"."');
        }
        var lhs = match[1];
        var rhs = match[2];

        match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);

        var valueIdentifier = match[3] || match[1];
        var keyIdentifier = match[2];

        var duplicate = container.attr('btf-double-dragon') !== undefined;

        // pull out the template to re-use.
        // Improvised ng-transclude.
        if (container.attr('btf-dragon-base') !== undefined){
          container = findContainer(container);

          if (!container){
            throw new Error('Expected btf-dragon-base to be used with a companion btf-dragon-conatiner');
          }
        }

        var template = container.html();

        // wrap text nodes
        try {
          template = angular.element(template.trim());
          if (template.length === 0) {
            throw new Error('');
          }
        }
        catch (e) {
          template = angular.element('<span>' + template + '</span>');
        }
        var child = template.clone();
        child.attr('ng-repeat', expression);

        if (container.attr('btf-dragon-sortable') !== undefined) {
          child.attr('btf-dragon-position', '{{$index}}');
        }

        container.html('');
        container.append(child);

        var eliminate = container.attr('btf-dragon-eliminate') !== undefined;


        return function (scope, elt, attr) {

          var accepts = scope.$eval(attr.btfDragonAccepts);

          if (accepts !== undefined && typeof accepts !== 'function') {
            throw new Error('Expected btfDragonAccepts to be a function.');
          }

          var spawnFloaty = function () {
            $rootScope.$broadcast('drag-start');
            scope.$apply(function () {
              floaty = template.clone();

              floaty.css('position', 'fixed');

              floaty.css('margin', '0px');
              floaty.css('z-index', '99999');

              var floatyScope = scope.$new();
              floatyScope[valueIdentifier] = dragValue;
              if (keyIdentifier) {
                floatyScope[keyIdentifier] = dragKey;
              }
              $compile(floaty)(floatyScope);
              documentBody.append(floaty);
              $document.bind('mousemove', drag);
              disableSelect();
            });
          };

          elt.bind('mousedown', function (ev) {

            //If a person uses middle or right mouse button, don't do anything
            if ([1, 2].indexOf(ev.button) > -1) {
              return;
            }

            var tag = $document[0].elementFromPoint(ev.clientX,ev.clientY).tagName;
            if (tag === 'SELECT' || tag === 'INPUT' || tag === 'BUTTON') {
              return;
            } else {
              
            mouseReleased = false;

              if (isFixed(angular.element(ev.target))) {
                fixed = true;
              } else {
                fixed = false;
              }

            }

          });

          elt.bind('mousemove', function(ev) {
            if(dragValue||mouseReleased){
              return;
            }

            if(isFixed(angular.element(ev.target)) || fixed){
              return;
            }

            // find the right parent
            var originElement = angular.element(ev.target);
            var originScope = originElement.scope();

            while (originScope[valueIdentifier] === undefined) {
              originScope = originScope.$parent;
              if (!originScope) {
                return;
              }
            }

            dragValue = originScope[valueIdentifier];
            dragKey = originScope[keyIdentifier];
            if (!dragValue) {
              return;
            }

            // get offset inside element to drag
            var offset = getElementOffset(ev.target);

            dragOrigin = scope.$eval(rhs);
            if (duplicate) {
              dragValue = angular.copy(dragValue);
            } else {
              scope.$apply(function () {
                remove(dragOrigin, dragKey || dragOrigin.indexOf(dragValue));
              });
            }
            dragDuplicate = duplicate;
            dragEliminate = eliminate;


            offsetX = (ev.pageX - offset.left);
            offsetY = (ev.pageY - offset.top);

            spawnFloaty();
            drag(ev);

          });
        };
      }
    };
  });
