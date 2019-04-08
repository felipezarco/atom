Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var BracketMatcher = (function () {
  function BracketMatcher(editor, brackets, repeatColorCount) {
    _classCallCheck(this, BracketMatcher);

    this.editor = editor;
    this.brackets = brackets;
    this.repeatColorCount = repeatColorCount;
    this.markerLayer = editor.addMarkerLayer();
    this.colorBrackets();
  }

  _createClass(BracketMatcher, [{
    key: 'refresh',
    value: function refresh() {
      this.clear();
      this.colorBrackets();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.markerLayer.clear();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.markerLayer.destroy();
    }
  }, {
    key: 'colorBrackets',
    value: function colorBrackets() {
      for (var bracket of this.brackets) {
        if (bracket.length === 2) {
          this.colorify(bracket[0], bracket[1]);
        } else {
          atom.notifications.addError(bracket + ' is not a valid set of brackets');
        }
      }
    }
  }, {
    key: 'colorify',
    value: function colorify(symbolStart, symbolEnd) {
      var _this = this;

      var count = 0;
      var regex = new RegExp('\\' + symbolStart + '|\\' + symbolEnd, 'g');

      this.editor.scan(regex, function (result) {

        if (_this.isRangeCommentedOrString(result.range)) {
          return;
        }

        if (result.matchText === symbolStart) {
          count++;
        }

        var marker = _this.markerLayer.markBufferRange(result.range, { invalidate: 'inside' });

        var colorNumber = count > 0 ? (count - 1) % _this.repeatColorCount + 1 : 0;
        _this.editor.decorateMarker(marker, { type: 'text', 'class': 'bracket-colorizer-color' + colorNumber, stamp: 'bracket-colorizer' });

        if (result.matchText === symbolEnd) {
          count--;
        }

        if (count < 0) {
          count = 0;
        }
      });
    }
  }, {
    key: 'isRangeCommentedOrString',
    value: function isRangeCommentedOrString(range) {
      var scopesArray = this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
      for (var scope of scopesArray.reverse()) {
        scope = scope.split('.');
        if (scope.includes('embedded') && scope.includes('source')) {
          return false;
        }
        if (scope.includes('comment') || scope.includes('string') || scope.includes('regex')) {
          return true;
        }
      }
      return false;
    }
  }]);

  return BracketMatcher;
})();

exports['default'] = BracketMatcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9icmFja2V0LWNvbG9yaXplci9saWIvYnJhY2tldC1tYXRjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFFcUIsY0FBYztBQUN0QixXQURRLGNBQWMsQ0FDckIsTUFBTSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRTswQkFEN0IsY0FBYzs7QUFFL0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0FBQ3pDLFFBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzNDLFFBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztHQUN0Qjs7ZUFQa0IsY0FBYzs7V0FTMUIsbUJBQUc7QUFDUixVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDYixVQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7S0FDdEI7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUMxQjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzVCOzs7V0FFWSx5QkFBRztBQUNkLFdBQUssSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQyxZQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3hCLGNBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDLE1BQU07QUFDTCxjQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBSSxPQUFPLHFDQUFrQyxDQUFDO1NBQzFFO09BQ0Y7S0FDRjs7O1dBRU8sa0JBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRTs7O0FBQy9CLFVBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLFVBQU0sS0FBSyxHQUFHLElBQUksTUFBTSxRQUFNLFdBQVcsV0FBTSxTQUFTLEVBQUksR0FBRyxDQUFDLENBQUM7O0FBRWpFLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFDLE1BQU0sRUFBSzs7QUFFbEMsWUFBSSxNQUFLLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMvQyxpQkFBTztTQUNSOztBQUVELFlBQUksTUFBTSxDQUFDLFNBQVMsS0FBSyxXQUFXLEVBQUU7QUFDcEMsZUFBSyxFQUFFLENBQUM7U0FDVDs7QUFFRCxZQUFNLE1BQU0sR0FBRyxNQUFLLFdBQVcsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDOztBQUV0RixZQUFNLFdBQVcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQSxHQUFJLE1BQUssZ0JBQWdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1RSxjQUFLLE1BQU0sQ0FBQyxjQUFjLENBQ3hCLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUscUNBQWlDLFdBQVcsQUFBRSxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBQyxDQUNuRyxDQUFDOztBQUVGLFlBQUksTUFBTSxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7QUFDbEMsZUFBSyxFQUFFLENBQUM7U0FDVDs7QUFFRCxZQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7QUFDYixlQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ1g7T0FFRixDQUFDLENBQUM7S0FDSjs7O1dBRXVCLGtDQUFDLEtBQUssRUFBRTtBQUM5QixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUMvRixXQUFLLElBQUksS0FBSyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUN2QyxhQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixZQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMxRCxpQkFBTyxLQUFLLENBQUM7U0FDZDtBQUNELFlBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDcEYsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7T0FDRjtBQUNELGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztTQTVFa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2JyYWNrZXQtY29sb3JpemVyL2xpYi9icmFja2V0LW1hdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJyYWNrZXRNYXRjaGVyIHtcbiAgY29uc3RydWN0b3IoZWRpdG9yLCBicmFja2V0cywgcmVwZWF0Q29sb3JDb3VudCkge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMuYnJhY2tldHMgPSBicmFja2V0cztcbiAgICB0aGlzLnJlcGVhdENvbG9yQ291bnQgPSByZXBlYXRDb2xvckNvdW50O1xuICAgIHRoaXMubWFya2VyTGF5ZXIgPSBlZGl0b3IuYWRkTWFya2VyTGF5ZXIoKTtcbiAgICB0aGlzLmNvbG9yQnJhY2tldHMoKTtcbiAgfVxuXG4gIHJlZnJlc2goKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMuY29sb3JCcmFja2V0cygpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5tYXJrZXJMYXllci5jbGVhcigpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLm1hcmtlckxheWVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGNvbG9yQnJhY2tldHMoKSB7XG4gICAgZm9yIChsZXQgYnJhY2tldCBvZiB0aGlzLmJyYWNrZXRzKSB7XG4gICAgICBpZiAoYnJhY2tldC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgdGhpcy5jb2xvcmlmeShicmFja2V0WzBdLCBicmFja2V0WzFdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgJHticmFja2V0fSBpcyBub3QgYSB2YWxpZCBzZXQgb2YgYnJhY2tldHNgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb2xvcmlmeShzeW1ib2xTdGFydCwgc3ltYm9sRW5kKSB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFxcXFwke3N5bWJvbFN0YXJ0fXxcXFxcJHtzeW1ib2xFbmR9YCwgJ2cnKTtcblxuICAgIHRoaXMuZWRpdG9yLnNjYW4ocmVnZXgsIChyZXN1bHQpID0+IHtcblxuICAgICAgaWYgKHRoaXMuaXNSYW5nZUNvbW1lbnRlZE9yU3RyaW5nKHJlc3VsdC5yYW5nZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0Lm1hdGNoVGV4dCA9PT0gc3ltYm9sU3RhcnQpIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWFya2VyID0gdGhpcy5tYXJrZXJMYXllci5tYXJrQnVmZmVyUmFuZ2UocmVzdWx0LnJhbmdlLCB7aW52YWxpZGF0ZTogJ2luc2lkZSd9KTtcblxuICAgICAgY29uc3QgY29sb3JOdW1iZXIgPSBjb3VudCA+IDAgPyAoY291bnQgLSAxKSAlIHRoaXMucmVwZWF0Q29sb3JDb3VudCArIDEgOiAwO1xuICAgICAgdGhpcy5lZGl0b3IuZGVjb3JhdGVNYXJrZXIoXG4gICAgICAgIG1hcmtlciwge3R5cGU6ICd0ZXh0JywgY2xhc3M6IGBicmFja2V0LWNvbG9yaXplci1jb2xvciR7Y29sb3JOdW1iZXJ9YCwgc3RhbXA6ICdicmFja2V0LWNvbG9yaXplcid9XG4gICAgICApO1xuXG4gICAgICBpZiAocmVzdWx0Lm1hdGNoVGV4dCA9PT0gc3ltYm9sRW5kKSB7XG4gICAgICAgIGNvdW50LS07XG4gICAgICB9XG5cbiAgICAgIGlmIChjb3VudCA8IDApIHtcbiAgICAgICAgY291bnQgPSAwO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuICBpc1JhbmdlQ29tbWVudGVkT3JTdHJpbmcocmFuZ2UpIHtcbiAgICBjb25zdCBzY29wZXNBcnJheSA9IHRoaXMuZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKHJhbmdlLnN0YXJ0KS5nZXRTY29wZXNBcnJheSgpO1xuICAgIGZvciAobGV0IHNjb3BlIG9mIHNjb3Blc0FycmF5LnJldmVyc2UoKSkge1xuICAgICAgc2NvcGUgPSBzY29wZS5zcGxpdCgnLicpO1xuICAgICAgaWYgKHNjb3BlLmluY2x1ZGVzKCdlbWJlZGRlZCcpICYmIHNjb3BlLmluY2x1ZGVzKCdzb3VyY2UnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoc2NvcGUuaW5jbHVkZXMoJ2NvbW1lbnQnKSB8fCBzY29wZS5pbmNsdWRlcygnc3RyaW5nJykgfHwgc2NvcGUuaW5jbHVkZXMoJ3JlZ2V4JykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19