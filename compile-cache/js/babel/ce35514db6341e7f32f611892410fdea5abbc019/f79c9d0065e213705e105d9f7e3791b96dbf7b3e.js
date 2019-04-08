var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _helpers = require('./helpers');

var TreeView = (function () {
  function TreeView() {
    var _this = this;

    _classCallCheck(this, TreeView);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.decorations = {};
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.decorateOnTreeView', function (decorateOnTreeView) {
      if (typeof _this.decorateOnTreeView === 'undefined') {
        _this.decorateOnTreeView = decorateOnTreeView;
      } else if (decorateOnTreeView === 'None') {
        _this.update([]);
        _this.decorateOnTreeView = decorateOnTreeView;
      } else {
        var messages = _this.messages;
        _this.decorateOnTreeView = decorateOnTreeView;
        _this.update(messages);
      }
    }));

    setTimeout(function () {
      var element = TreeView.getElement();
      if (!element) {
        return;
      }
      // Subscription is only added if the CompositeDisposable hasn't been disposed
      _this.subscriptions.add((0, _disposableEvent2['default'])(element, 'click', (0, _sbDebounce2['default'])(function () {
        _this.update();
      })));
    }, 100);
  }

  _createClass(TreeView, [{
    key: 'update',
    value: function update() {
      var givenMessages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (Array.isArray(givenMessages)) {
        this.messages = givenMessages;
      }
      var messages = this.messages;

      var element = TreeView.getElement();
      var decorateOnTreeView = this.decorateOnTreeView;
      if (!element || decorateOnTreeView === 'None') {
        return;
      }

      this.applyDecorations((0, _helpers.calculateDecorations)(decorateOnTreeView, messages));
    }
  }, {
    key: 'applyDecorations',
    value: function applyDecorations(decorations) {
      var _this2 = this;

      var treeViewElement = TreeView.getElement();
      if (!treeViewElement) {
        return;
      }

      var elementCache = {};
      var appliedDecorations = {};

      Object.keys(this.decorations).forEach(function (filePath) {
        if (!({}).hasOwnProperty.call(_this2.decorations, filePath)) {
          return;
        }
        if (!decorations[filePath]) {
          // Removed
          var element = elementCache[filePath] || (elementCache[filePath] = TreeView.getElementByPath(treeViewElement, filePath));
          if (element) {
            _this2.removeDecoration(element);
          }
        }
      });

      Object.keys(decorations).forEach(function (filePath) {
        if (!({}).hasOwnProperty.call(decorations, filePath)) {
          return;
        }
        var element = elementCache[filePath] || (elementCache[filePath] = TreeView.getElementByPath(treeViewElement, filePath));
        if (element) {
          _this2.handleDecoration(element, !!_this2.decorations[filePath], decorations[filePath]);
          appliedDecorations[filePath] = decorations[filePath];
        }
      });

      this.decorations = appliedDecorations;
    }
  }, {
    key: 'handleDecoration',
    value: function handleDecoration(element, update, highlights) {
      if (update === undefined) update = false;

      var decoration = undefined;
      if (update) {
        decoration = element.querySelector('linter-decoration');
      }
      if (decoration) {
        decoration.className = '';
      } else {
        decoration = document.createElement('linter-decoration');
        element.appendChild(decoration);
      }
      if (highlights.error) {
        decoration.classList.add('linter-error');
      } else if (highlights.warning) {
        decoration.classList.add('linter-warning');
      } else if (highlights.info) {
        decoration.classList.add('linter-info');
      }
    }
  }, {
    key: 'removeDecoration',
    value: function removeDecoration(element) {
      var decoration = element.querySelector('linter-decoration');
      if (decoration) {
        decoration.remove();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }], [{
    key: 'getElement',
    value: function getElement() {
      return document.querySelector('.tree-view');
    }
  }, {
    key: 'getElementByPath',
    value: function getElementByPath(parent, filePath) {
      return parent.querySelector('[data-path=' + CSS.escape(filePath) + ']');
    }
  }]);

  return TreeView;
})();

module.exports = TreeView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdHJlZS12aWV3L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFNkMsTUFBTTs7MEJBQzlCLGFBQWE7Ozs7K0JBQ04sa0JBQWtCOzs7O3VCQUNULFdBQVc7O0lBRzFDLFFBQVE7QUFPRCxXQVBQLFFBQVEsR0FPRTs7OzBCQVBWLFFBQVE7O0FBUVYsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsc0NBQXNDLEVBQUUsVUFBQSxrQkFBa0IsRUFBSTtBQUNoRixVQUFJLE9BQU8sTUFBSyxrQkFBa0IsS0FBSyxXQUFXLEVBQUU7QUFDbEQsY0FBSyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtPQUM3QyxNQUFNLElBQUksa0JBQWtCLEtBQUssTUFBTSxFQUFFO0FBQ3hDLGNBQUssTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2YsY0FBSyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtPQUM3QyxNQUFNO0FBQ0wsWUFBTSxRQUFRLEdBQUcsTUFBSyxRQUFRLENBQUE7QUFDOUIsY0FBSyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtBQUM1QyxjQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUN0QjtLQUNGLENBQUMsQ0FDSCxDQUFBOztBQUVELGNBQVUsQ0FBQyxZQUFNO0FBQ2YsVUFBTSxPQUFPLEdBQUcs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LE1BQU0sQ0FBQyxhQUFhLGlCQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQUksQ0FBQTtLQUNuRTs7O1NBbklHLFFBQVE7OztBQXNJZCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQSIsImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3RyZWUtdmlldy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ3NiLWRlYm91bmNlJ1xuaW1wb3J0IGRpc3Bvc2FibGVFdmVudCBmcm9tICdkaXNwb3NhYmxlLWV2ZW50J1xuaW1wb3J0IHsgY2FsY3VsYXRlRGVjb3JhdGlvbnMgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UsIFRyZWVWaWV3SGlnaGxpZ2h0IH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFRyZWVWaWV3IHtcbiAgZW1pdHRlcjogRW1pdHRlclxuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT5cbiAgZGVjb3JhdGlvbnM6IE9iamVjdFxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGRlY29yYXRlT25UcmVlVmlldzogJ0ZpbGVzIGFuZCBEaXJlY3RvcmllcycgfCAnRmlsZXMnIHwgJ05vbmUnXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuZGVjb3JhdGlvbnMgPSB7fVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5kZWNvcmF0ZU9uVHJlZVZpZXcnLCBkZWNvcmF0ZU9uVHJlZVZpZXcgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZGVjb3JhdGVPblRyZWVWaWV3ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRoaXMuZGVjb3JhdGVPblRyZWVWaWV3ID0gZGVjb3JhdGVPblRyZWVWaWV3XG4gICAgICAgIH0gZWxzZSBpZiAoZGVjb3JhdGVPblRyZWVWaWV3ID09PSAnTm9uZScpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZShbXSlcbiAgICAgICAgICB0aGlzLmRlY29yYXRlT25UcmVlVmlldyA9IGRlY29yYXRlT25UcmVlVmlld1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlc1xuICAgICAgICAgIHRoaXMuZGVjb3JhdGVPblRyZWVWaWV3ID0gZGVjb3JhdGVPblRyZWVWaWV3XG4gICAgICAgICAgdGhpcy51cGRhdGUobWVzc2FnZXMpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IFRyZWVWaWV3LmdldEVsZW1lbnQoKVxuICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gU3Vic2NyaXB0aW9uIGlzIG9ubHkgYWRkZWQgaWYgdGhlIENvbXBvc2l0ZURpc3Bvc2FibGUgaGFzbid0IGJlZW4gZGlzcG9zZWRcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIGRpc3Bvc2FibGVFdmVudChcbiAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICdjbGljaycsXG4gICAgICAgICAgZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICAgIH0pLFxuICAgICAgICApLFxuICAgICAgKVxuICAgIH0sIDEwMClcbiAgfVxuICB1cGRhdGUoZ2l2ZW5NZXNzYWdlczogP0FycmF5PExpbnRlck1lc3NhZ2U+ID0gbnVsbCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGdpdmVuTWVzc2FnZXMpKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gZ2l2ZW5NZXNzYWdlc1xuICAgIH1cbiAgICBjb25zdCBtZXNzYWdlcyA9IHRoaXMubWVzc2FnZXNcblxuICAgIGNvbnN0IGVsZW1lbnQgPSBUcmVlVmlldy5nZXRFbGVtZW50KClcbiAgICBjb25zdCBkZWNvcmF0ZU9uVHJlZVZpZXcgPSB0aGlzLmRlY29yYXRlT25UcmVlVmlld1xuICAgIGlmICghZWxlbWVudCB8fCBkZWNvcmF0ZU9uVHJlZVZpZXcgPT09ICdOb25lJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5hcHBseURlY29yYXRpb25zKGNhbGN1bGF0ZURlY29yYXRpb25zKGRlY29yYXRlT25UcmVlVmlldywgbWVzc2FnZXMpKVxuICB9XG4gIGFwcGx5RGVjb3JhdGlvbnMoZGVjb3JhdGlvbnM6IE9iamVjdCkge1xuICAgIGNvbnN0IHRyZWVWaWV3RWxlbWVudCA9IFRyZWVWaWV3LmdldEVsZW1lbnQoKVxuICAgIGlmICghdHJlZVZpZXdFbGVtZW50KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50Q2FjaGUgPSB7fVxuICAgIGNvbnN0IGFwcGxpZWREZWNvcmF0aW9ucyA9IHt9XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLmRlY29yYXRpb25zKS5mb3JFYWNoKGZpbGVQYXRoID0+IHtcbiAgICAgIGlmICghe30uaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLmRlY29yYXRpb25zLCBmaWxlUGF0aCkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoIWRlY29yYXRpb25zW2ZpbGVQYXRoXSkge1xuICAgICAgICAvLyBSZW1vdmVkXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPVxuICAgICAgICAgIGVsZW1lbnRDYWNoZVtmaWxlUGF0aF0gfHwgKGVsZW1lbnRDYWNoZVtmaWxlUGF0aF0gPSBUcmVlVmlldy5nZXRFbGVtZW50QnlQYXRoKHRyZWVWaWV3RWxlbWVudCwgZmlsZVBhdGgpKVxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlRGVjb3JhdGlvbihlbGVtZW50KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIE9iamVjdC5rZXlzKGRlY29yYXRpb25zKS5mb3JFYWNoKGZpbGVQYXRoID0+IHtcbiAgICAgIGlmICghe30uaGFzT3duUHJvcGVydHkuY2FsbChkZWNvcmF0aW9ucywgZmlsZVBhdGgpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY29uc3QgZWxlbWVudCA9XG4gICAgICAgIGVsZW1lbnRDYWNoZVtmaWxlUGF0aF0gfHwgKGVsZW1lbnRDYWNoZVtmaWxlUGF0aF0gPSBUcmVlVmlldy5nZXRFbGVtZW50QnlQYXRoKHRyZWVWaWV3RWxlbWVudCwgZmlsZVBhdGgpKVxuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVEZWNvcmF0aW9uKGVsZW1lbnQsICEhdGhpcy5kZWNvcmF0aW9uc1tmaWxlUGF0aF0sIGRlY29yYXRpb25zW2ZpbGVQYXRoXSlcbiAgICAgICAgYXBwbGllZERlY29yYXRpb25zW2ZpbGVQYXRoXSA9IGRlY29yYXRpb25zW2ZpbGVQYXRoXVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmRlY29yYXRpb25zID0gYXBwbGllZERlY29yYXRpb25zXG4gIH1cblxuICBoYW5kbGVEZWNvcmF0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB1cGRhdGU6IGJvb2xlYW4gPSBmYWxzZSwgaGlnaGxpZ2h0czogVHJlZVZpZXdIaWdobGlnaHQpIHtcbiAgICBsZXQgZGVjb3JhdGlvblxuICAgIGlmICh1cGRhdGUpIHtcbiAgICAgIGRlY29yYXRpb24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2xpbnRlci1kZWNvcmF0aW9uJylcbiAgICB9XG4gICAgaWYgKGRlY29yYXRpb24pIHtcbiAgICAgIGRlY29yYXRpb24uY2xhc3NOYW1lID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgZGVjb3JhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1kZWNvcmF0aW9uJylcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZGVjb3JhdGlvbilcbiAgICB9XG4gICAgaWYgKGhpZ2hsaWdodHMuZXJyb3IpIHtcbiAgICAgIGRlY29yYXRpb24uY2xhc3NMaXN0LmFkZCgnbGludGVyLWVycm9yJylcbiAgICB9IGVsc2UgaWYgKGhpZ2hsaWdodHMud2FybmluZykge1xuICAgICAgZGVjb3JhdGlvbi5jbGFzc0xpc3QuYWRkKCdsaW50ZXItd2FybmluZycpXG4gICAgfSBlbHNlIGlmIChoaWdobGlnaHRzLmluZm8pIHtcbiAgICAgIGRlY29yYXRpb24uY2xhc3NMaXN0LmFkZCgnbGludGVyLWluZm8nKVxuICAgIH1cbiAgfVxuICByZW1vdmVEZWNvcmF0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgZGVjb3JhdGlvbiA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignbGludGVyLWRlY29yYXRpb24nKVxuICAgIGlmIChkZWNvcmF0aW9uKSB7XG4gICAgICBkZWNvcmF0aW9uLnJlbW92ZSgpXG4gICAgfVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG4gIHN0YXRpYyBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHJlZS12aWV3JylcbiAgfVxuICBzdGF0aWMgZ2V0RWxlbWVudEJ5UGF0aChwYXJlbnQ6IEhUTUxFbGVtZW50LCBmaWxlUGF0aDogc3RyaW5nKTogP0hUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXBhdGg9JHtDU1MuZXNjYXBlKGZpbGVQYXRoKX1dYClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVWaWV3XG4iXX0=