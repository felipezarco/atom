Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _atom = require('atom');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Blamer = require('./Blamer');

var _Blamer2 = _interopRequireDefault(_Blamer);

var _GitCommander = require('./GitCommander');

var _GitCommander2 = _interopRequireDefault(_GitCommander);

var _RemoteRevision = require('./RemoteRevision');

var _RemoteRevision2 = _interopRequireDefault(_RemoteRevision);

var _repositoryForEditorPath = require('./repositoryForEditorPath');

var _repositoryForEditorPath2 = _interopRequireDefault(_repositoryForEditorPath);

var _componentsBlameLine = require('../components/BlameLine');

var _componentsBlameLine2 = _interopRequireDefault(_componentsBlameLine);

var _componentsGutterResize = require('../components/GutterResize');

var _componentsGutterResize2 = _interopRequireDefault(_componentsGutterResize);

'use babel';

var GUTTER_ID = 'com.alexcorre.git-blame';
var GUTTER_STYLE_ID = 'com.alexcorre.git-blame.style';
var RESIZE_DEBOUNCE_MS = 5;

var GIT_CONFIG_REPO_URL = 'atom-git-blame.repositoryUrlTemplate';

var BlameGutter = (function () {
  function BlameGutter(editor) {
    _classCallCheck(this, BlameGutter);

    (0, _lodash.bindAll)(this, ['onResizeStart']);

    this.editor = editor;
    this.isShown = false;
    this.lineDecorations = [];
    this.disposables = new _atom.CompositeDisposable();

    // resize
    var width = atom.config.get('git-blame.columnWidth');
    this.updateGutterWidth(width);

    this.resizeStartWidth = null;
    this.resizeStartX = null;
    this.isResizing = false;
    this.eventListeners = {};
  }

  /**
   * Top level API for toggling gutter visiblity + blaming the currently
   * open file, if any.
   */

  _createClass(BlameGutter, [{
    key: 'toggleVisibility',
    value: function toggleVisibility() {
      return this.setVisibility(!this.isShown);
    }

    /**
     * Set the visibility of the gutter. Bootstraps a new gutter if need be.
     *
     * @returns {Promise<boolean>}
     */
  }, {
    key: 'setVisibility',
    value: function setVisibility(visible) {
      // if we're trying to set the visiblity to the value it already has
      // just resolve and do nothing.
      if (this.isShown === visible) {
        return Promise.resolve(visible);
      }

      // grab filePath from editor
      var editor = this.editor;

      var filePath = editor.isEmpty() ? null : editor.getPath();
      if (!filePath) {
        return Promise.reject(new Error('No filePath could be determined for editor.'));
      }

      if (visible) {
        // we are showing the gutter
        this.gutter().show();
        this.updateLineMarkers(filePath);
      } else {
        this.removeLineMarkers();
        this.gutter().hide();
        this.gutter().destroy();
      }

      this.isShown = visible;
      return Promise.resolve(this.isShown);
    }

    /**
     * Lazily generate a Gutter instance for the current editor, the first time
     * we need it. Any other accesses will grab the same gutter reference until
     * the Gutter is explicitly disposed.
     */
  }, {
    key: 'gutter',
    value: function gutter() {
      var editor = this.editor;

      var gutter = editor.gutterWithName(GUTTER_ID);
      return gutter || editor.addGutter({
        name: GUTTER_ID,
        visible: false,
        priority: 100
      });
    }
  }, {
    key: 'updateLineMarkers',
    value: function updateLineMarkers(filePath) {
      var _this = this;

      var showFirstNames = atom.config.get('git-blame.showFirstNames');
      var showLastNames = atom.config.get('git-blame.showLastNames');
      var showHash = atom.config.get('git-blame.showHash');
      var colorCommitAuthors = atom.config.get('git-blame.colorCommitAuthors');
      return (0, _repositoryForEditorPath2['default'])(filePath).then(function (repo) {
        var blamer = new _Blamer2['default'](repo);
        var gitCmd = new _GitCommander2['default'](repo.getWorkingDirectory());
        var blamePromise = new Promise(function (resolve, reject) {
          blamer.blame(filePath, function (err, data) {
            return err ? reject(err) : resolve([repo, data]);
          });
        });
        var gitConfigPromise = new Promise(function (resolve, reject) {
          gitCmd.config(GIT_CONFIG_REPO_URL, function (err, data) {
            return err ? reject(err) : resolve(data);
          });
        });
        return Promise.all([blamePromise, gitConfigPromise]);
      }).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var _ref2$0 = _slicedToArray(_ref2[0], 2);

        var repo = _ref2$0[0];
        var blameData = _ref2$0[1];
        var gitConfigData = _ref2[1];

        var remoteRevision = new _RemoteRevision2['default'](repo.getOriginURL(filePath), gitConfigData);
        var hasUrlTemplate = !!remoteRevision.getTemplate();
        var lastHash = null;
        var className = null;

        blameData.forEach(function (lineData) {
          var lineNumber = lineData.lineNumber;
          var hash = lineData.hash;
          var noCommit = lineData.noCommit;

          if (noCommit) {
            return;
          }

          // set alternating background className
          if (hash !== lastHash) {
            className = className === 'lighter' ? 'darker' : 'lighter';
          }
          lastHash = hash;

          // generate a link to the commit
          var viewCommitUrl = hasUrlTemplate ? remoteRevision.url(lineData.hash) : '#';
          var copyHashOnClick = !hasUrlTemplate;

          // construct props for BlameLine component
          var lineProps = _extends({}, lineData, {
            className: className,
            viewCommitUrl: viewCommitUrl,
            showFirstNames: showFirstNames,
            showLastNames: showLastNames,
            showHash: showHash,
            colorCommitAuthors: colorCommitAuthors,
            copyHashOnClick: copyHashOnClick
          });

          // adding one marker to the first line
          var lineRange = new _atom.Range([lineNumber - 1, 0], [lineNumber - 1, 0]);
          var lineMarker = _this.editor.markBufferRange(lineRange);

          var node = _this.generateLineElement(lineProps);
          var decoration = _this.gutter().decorateMarker(lineMarker, {
            'class': 'blame-line-marker',
            item: node
          });

          _this.lineDecorations.push(decoration);
        });
      });
    }
  }, {
    key: 'removeLineMarkers',
    value: function removeLineMarkers() {
      this.disposables.dispose();
      this.disposables = new _atom.CompositeDisposable();
      this.lineDecorations.forEach(function (decoration) {
        decoration.destroy();
      });
    }
  }, {
    key: 'generateLineElement',
    value: function generateLineElement(lineProps) {
      var div = document.createElement('div');

      // Use React to render the BlameLine component
      _reactDom2['default'].render(_react2['default'].createElement(
        _componentsGutterResize2['default'],
        { onResizeStart: this.onResizeStart },
        _react2['default'].createElement(_componentsBlameLine2['default'], lineProps)
      ), div);

      var tip = atom.tooltips.add(div, {
        title: lineProps.summary,
        placement: 'right'
      });
      this.disposables.add(tip);

      return div;
    }
  }, {
    key: 'onResizeStart',
    value: function onResizeStart(e) {
      this.isResizing = true;
      this.resizeStartX = e.pageX;
      this.resizeStartWidth = this.width;
      this.bindResizeEvents();
    }
  }, {
    key: 'onResizeEnd',
    value: function onResizeEnd() {
      this.unbindResizeEvents();
      this.isResizing = false;
      this.resizeStartX = null;
    }
  }, {
    key: 'onResizeMove',
    value: function onResizeMove(e) {
      if (!this.resizeStartX) {
        return;
      }
      var delta = e.pageX - this.resizeStartX;
      this.updateGutterWidth(this.resizeStartWidth + delta);
    }
  }, {
    key: 'bindResizeEvents',
    value: function bindResizeEvents() {
      if (!this.eventListeners.mouseup) {
        var mouseupHandler = this.onResizeEnd.bind(this);
        this.eventListeners.mouseup = mouseupHandler;
        document.addEventListener('mouseup', mouseupHandler);
      }
      if (!this.eventListeners.mousemove) {
        var mouseMoveHandler = (0, _lodash.debounce)(this.onResizeMove.bind(this), RESIZE_DEBOUNCE_MS);
        this.eventListeners.mousemove = mouseMoveHandler;
        document.addEventListener('mousemove', mouseMoveHandler);
      }
    }
  }, {
    key: 'unbindResizeEvents',
    value: function unbindResizeEvents() {
      var _eventListeners = this.eventListeners;
      var mousemove = _eventListeners.mousemove;
      var mouseup = _eventListeners.mouseup;

      document.removeEventListener('mousemove', mousemove);
      delete this.eventListeners.mousemove;
      document.removeEventListener('mouseup', mouseup);
      delete this.eventListeners.mouseup;
    }
  }, {
    key: 'updateGutterWidth',
    value: function updateGutterWidth(newWidth) {
      this.width = newWidth;
      atom.config.set('git-blame.columnWidth', newWidth);

      var tag = document.getElementById(GUTTER_STYLE_ID);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = GUTTER_STYLE_ID;
        tag.type = 'text/css';
        document.head.appendChild(tag);
      }

      var styles = '\n      atom-text-editor .gutter[gutter-name="' + GUTTER_ID + '"] {\n        width: ' + newWidth + 'px;\n      }\n    ';
      tag.textContent = styles;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.gutter().destroy();
    }
  }]);

  return BlameGutter;
})();

exports['default'] = BlameGutter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvQmxhbWVHdXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRWtDLFFBQVE7O29CQUNDLE1BQU07O3FCQUMvQixPQUFPOzs7O3dCQUNKLFdBQVc7Ozs7c0JBRWIsVUFBVTs7Ozs0QkFDSixnQkFBZ0I7Ozs7OEJBQ2Qsa0JBQWtCOzs7O3VDQUNULDJCQUEyQjs7OzttQ0FDekMseUJBQXlCOzs7O3NDQUN0Qiw0QkFBNEI7Ozs7QUFackQsV0FBVyxDQUFDOztBQWNaLElBQU0sU0FBUyxHQUFHLHlCQUF5QixDQUFDO0FBQzVDLElBQU0sZUFBZSxHQUFHLCtCQUErQixDQUFDO0FBQ3hELElBQU0sa0JBQWtCLEdBQUcsQ0FBQyxDQUFDOztBQUU3QixJQUFNLG1CQUFtQixHQUFHLHNDQUFzQyxDQUFDOztJQUU5QyxXQUFXO0FBRW5CLFdBRlEsV0FBVyxDQUVsQixNQUFNLEVBQUU7MEJBRkQsV0FBVzs7QUFHNUIseUJBQVEsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDckIsUUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDMUIsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQzs7O0FBRzdDLFFBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDdkQsUUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU5QixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFD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QVEsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDbkQsVUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLFdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLFdBQUcsQ0FBQyxFQUFFLEdBQUcsZUFBZSxDQUFDO0FBQ3pCLFdBQUcsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO0FBQ3RCLGdCQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNoQzs7QUFFRCxVQUFNLE1BQU0sc0RBQzhCLFNBQVMsNkJBQ3RDLFFBQVEsdUJBRXBCLENBQUM7QUFDRixTQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztLQUMxQjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDekI7OztTQS9Pa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9CbGFtZUd1dHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBkZWJvdW5jZSwgYmluZEFsbCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBSYW5nZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuXG5pbXBvcnQgQmxhbWVyIGZyb20gJy4vQmxhbWVyJztcbmltcG9ydCBHaXRDb21tYW5kZXIgZnJvbSAnLi9HaXRDb21tYW5kZXInO1xuaW1wb3J0IFJlbW90ZVJldmlzaW9uIGZyb20gJy4vUmVtb3RlUmV2aXNpb24nO1xuaW1wb3J0IHJlcG9zaXRvcnlGb3JFZGl0b3JQYXRoIGZyb20gJy4vcmVwb3NpdG9yeUZvckVkaXRvclBhdGgnO1xuaW1wb3J0IEJsYW1lTGluZSBmcm9tICcuLi9jb21wb25lbnRzL0JsYW1lTGluZSc7XG5pbXBvcnQgR3V0dGVyUmVzaXplIGZyb20gJy4uL2NvbXBvbmVudHMvR3V0dGVyUmVzaXplJztcblxuY29uc3QgR1VUVEVSX0lEID0gJ2NvbS5hbGV4Y29ycmUuZ2l0LWJsYW1lJztcbmNvbnN0IEdVVFRFUl9TVFlMRV9JRCA9ICdjb20uYWxleGNvcnJlLmdpdC1ibGFtZS5zdHlsZSc7XG5jb25zdCBSRVNJWkVfREVCT1VOQ0VfTVMgPSA1O1xuXG5jb25zdCBHSVRfQ09ORklHX1JFUE9fVVJMID0gJ2F0b20tZ2l0LWJsYW1lLnJlcG9zaXRvcnlVcmxUZW1wbGF0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJsYW1lR3V0dGVyIHtcblxuICBjb25zdHJ1Y3RvcihlZGl0b3IpIHtcbiAgICBiaW5kQWxsKHRoaXMsIFsnb25SZXNpemVTdGFydCddKTtcblxuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xuICAgIHRoaXMubGluZURlY29yYXRpb25zID0gW107XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyByZXNpemVcbiAgICBjb25zdCB3aWR0aCA9IGF0b20uY29uZmlnLmdldCgnZ2l0LWJsYW1lLmNvbHVtbldpZHRoJyk7XG4gICAgdGhpcy51cGRhdGVHdXR0ZXJXaWR0aCh3aWR0aCk7XG5cbiAgICB0aGlzLnJlc2l6ZVN0YXJ0V2lkdGggPSBudWxsO1xuICAgIHRoaXMucmVzaXplU3RhcnRYID0gbnVsbDtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzID0ge307XG4gIH1cblxuICAvKipcbiAgICogVG9wIGxldmVsIEFQSSBmb3IgdG9nZ2xpbmcgZ3V0dGVyIHZpc2libGl0eSArIGJsYW1pbmcgdGhlIGN1cnJlbnRseVxuICAgKiBvcGVuIGZpbGUsIGlmIGFueS5cbiAgICovXG4gIHRvZ2dsZVZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0VmlzaWJpbGl0eSghdGhpcy5pc1Nob3duKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGd1dHRlci4gQm9vdHN0cmFwcyBhIG5ldyBndXR0ZXIgaWYgbmVlZCBiZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XG4gICAqL1xuICBzZXRWaXNpYmlsaXR5KHZpc2libGUpIHtcbiAgICAvLyBpZiB3ZSdyZSB0cnlpbmcgdG8gc2V0IHRoZSB2aXNpYmxpdHkgdG8gdGhlIHZhbHVlIGl0IGFscmVhZHkgaGFzXG4gICAgLy8ganVzdCByZXNvbHZlIGFuZCBkbyBub3RoaW5nLlxuICAgIGlmICh0aGlzLmlzU2hvd24gPT09IHZpc2libGUpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmlzaWJsZSk7XG4gICAgfVxuXG4gICAgLy8gZ3JhYiBmaWxlUGF0aCBmcm9tIGVkaXRvclxuICAgIGNvbnN0IHsgZWRpdG9yIH0gPSB0aGlzO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmlzRW1wdHkoKSA/IG51bGwgOiBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ05vIGZpbGVQYXRoIGNvdWxkIGJlIGRldGVybWluZWQgZm9yIGVkaXRvci4nKSk7XG4gICAgfVxuXG4gICAgaWYgKHZpc2libGUpIHtcbiAgICAgIC8vIHdlIGFyZSBzaG93aW5nIHRoZSBndXR0ZXJcbiAgICAgIHRoaXMuZ3V0dGVyKCkuc2hvdygpO1xuICAgICAgdGhpcy51cGRhdGVMaW5lTWFya2VycyhmaWxlUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlTGluZU1hcmtlcnMoKTtcbiAgICAgIHRoaXMuZ3V0dGVyKCkuaGlkZSgpO1xuICAgICAgdGhpcy5ndXR0ZXIoKS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5pc1Nob3duID0gdmlzaWJsZTtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuaXNTaG93bik7XG4gIH1cblxuICAvKipcbiAgICogTGF6aWx5IGdlbmVyYXRlIGEgR3V0dGVyIGluc3RhbmNlIGZvciB0aGUgY3VycmVudCBlZGl0b3IsIHRoZSBmaXJzdCB0aW1lXG4gICAqIHdlIG5lZWQgaXQuIEFueSBvdGhlciBhY2Nlc3NlcyB3aWxsIGdyYWIgdGhlIHNhbWUgZ3V0dGVyIHJlZmVyZW5jZSB1bnRpbFxuICAgKiB0aGUgR3V0dGVyIGlzIGV4cGxpY2l0bHkgZGlzcG9zZWQuXG4gICAqL1xuICBndXR0ZXIoKSB7XG4gICAgY29uc3QgeyBlZGl0b3IgfSA9IHRoaXM7XG4gICAgY29uc3QgZ3V0dGVyID0gZWRpdG9yLmd1dHRlcldpdGhOYW1lKEdVVFRFUl9JRCk7XG4gICAgcmV0dXJuIGd1dHRlciB8fCBlZGl0b3IuYWRkR3V0dGVyKHtcbiAgICAgIG5hbWU6IEdVVFRFUl9JRCxcbiAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgcHJpb3JpdHk6IDEwMCxcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZUxpbmVNYXJrZXJzKGZpbGVQYXRoKSB7XG4gICAgY29uc3Qgc2hvd0ZpcnN0TmFtZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1ibGFtZS5zaG93Rmlyc3ROYW1lcycpO1xuICAgIGNvbnN0IHNob3dMYXN0TmFtZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1ibGFtZS5zaG93TGFzdE5hbWVzJyk7XG4gICAgY29uc3Qgc2hvd0hhc2ggPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1ibGFtZS5zaG93SGFzaCcpO1xuICAgIGNvbnN0IGNvbG9yQ29tbWl0QXV0aG9ycyA9IGF0b20uY29uZmlnLmdldCgnZ2l0LWJsYW1lLmNvbG9yQ29tbWl0QXV0aG9ycycpO1xuICAgIHJldHVybiByZXBvc2l0b3J5Rm9yRWRpdG9yUGF0aChmaWxlUGF0aClcbiAgICAgIC50aGVuKChyZXBvKSA9PiB7XG4gICAgICAgIGNvbnN0IGJsYW1lciA9IG5ldyBCbGFtZXIocmVwbyk7XG4gICAgICAgIGNvbnN0IGdpdENtZCA9IG5ldyBHaXRDb21tYW5kZXIocmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpO1xuICAgICAgICBjb25zdCBibGFtZVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgYmxhbWVyLmJsYW1lKGZpbGVQYXRoLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKFtyZXBvLCBkYXRhXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBnaXRDb25maWdQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGdpdENtZC5jb25maWcoR0lUX0NPTkZJR19SRVBPX1VSTCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbYmxhbWVQcm9taXNlLCBnaXRDb25maWdQcm9taXNlXSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKFtbcmVwbywgYmxhbWVEYXRhXSwgZ2l0Q29uZmlnRGF0YV0pID0+IHtcbiAgICAgICAgY29uc3QgcmVtb3RlUmV2aXNpb24gPSBuZXcgUmVtb3RlUmV2aXNpb24ocmVwby5nZXRPcmlnaW5VUkwoZmlsZVBhdGgpLCBnaXRDb25maWdEYXRhKTtcbiAgICAgICAgY29uc3QgaGFzVXJsVGVtcGxhdGUgPSAhIXJlbW90ZVJldmlzaW9uLmdldFRlbXBsYXRlKCk7XG4gICAgICAgIGxldCBsYXN0SGFzaCA9IG51bGw7XG4gICAgICAgIGxldCBjbGFzc05hbWUgPSBudWxsO1xuXG4gICAgICAgIGJsYW1lRGF0YS5mb3JFYWNoKChsaW5lRGF0YSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgbGluZU51bWJlciwgaGFzaCwgbm9Db21taXQgfSA9IGxpbmVEYXRhO1xuICAgICAgICAgIGlmIChub0NvbW1pdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHNldCBhbHRlcm5hdGluZyBiYWNrZ3JvdW5kIGNsYXNzTmFtZVxuICAgICAgICAgIGlmIChoYXNoICE9PSBsYXN0SGFzaCkge1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gKGNsYXNzTmFtZSA9PT0gJ2xpZ2h0ZXInKSA/ICdkYXJrZXInIDogJ2xpZ2h0ZXInO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsYXN0SGFzaCA9IGhhc2g7XG5cbiAgICAgICAgICAvLyBnZW5lcmF0ZSBhIGxpbmsgdG8gdGhlIGNvbW1pdFxuICAgICAgICAgIGNvbnN0IHZpZXdDb21taXRVcmwgPSBoYXNVcmxUZW1wbGF0ZSA/IHJlbW90ZVJldmlzaW9uLnVybChsaW5lRGF0YS5oYXNoKSA6ICcjJztcbiAgICAgICAgICBjb25zdCBjb3B5SGFzaE9uQ2xpY2sgPSAhaGFzVXJsVGVtcGxhdGU7XG5cbiAgICAgICAgICAvLyBjb25zdHJ1Y3QgcHJvcHMgZm9yIEJsYW1lTGluZSBjb21wb25lbnRcbiAgICAgICAgICBjb25zdCBsaW5lUHJvcHMgPSB7XG4gICAgICAgICAgICAuLi5saW5lRGF0YSxcbiAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgIHZpZXdDb21taXRVcmwsXG4gICAgICAgICAgICBzaG93Rmlyc3ROYW1lcyxcbiAgICAgICAgICAgIHNob3dMYXN0TmFtZXMsXG4gICAgICAgICAgICBzaG93SGFzaCxcbiAgICAgICAgICAgIGNvbG9yQ29tbWl0QXV0aG9ycyxcbiAgICAgICAgICAgIGNvcHlIYXNoT25DbGljayxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgLy8gYWRkaW5nIG9uZSBtYXJrZXIgdG8gdGhlIGZpcnN0IGxpbmVcbiAgICAgICAgICBjb25zdCBsaW5lUmFuZ2UgPSBuZXcgUmFuZ2UoW2xpbmVOdW1iZXIgLSAxLCAwXSwgW2xpbmVOdW1iZXIgLSAxLCAwXSk7XG4gICAgICAgICAgY29uc3QgbGluZU1hcmtlciA9IHRoaXMuZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShsaW5lUmFuZ2UpO1xuXG4gICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2VuZXJhdGVMaW5lRWxlbWVudChsaW5lUHJvcHMpO1xuICAgICAgICAgIGNvbnN0IGRlY29yYXRpb24gPSB0aGlzLmd1dHRlcigpLmRlY29yYXRlTWFya2VyKGxpbmVNYXJrZXIsIHtcbiAgICAgICAgICAgIGNsYXNzOiAnYmxhbWUtbGluZS1tYXJrZXInLFxuICAgICAgICAgICAgaXRlbTogbm9kZSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMubGluZURlY29yYXRpb25zLnB1c2goZGVjb3JhdGlvbik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgfVxuXG4gIHJlbW92ZUxpbmVNYXJrZXJzKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMubGluZURlY29yYXRpb25zLmZvckVhY2goKGRlY29yYXRpb24pID0+IHtcbiAgICAgIGRlY29yYXRpb24uZGVzdHJveSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2VuZXJhdGVMaW5lRWxlbWVudChsaW5lUHJvcHMpIHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIC8vIFVzZSBSZWFjdCB0byByZW5kZXIgdGhlIEJsYW1lTGluZSBjb21wb25lbnRcbiAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICA8R3V0dGVyUmVzaXplIG9uUmVzaXplU3RhcnQ9e3RoaXMub25SZXNpemVTdGFydH0+XG4gICAgICAgIDxCbGFtZUxpbmUgey4uLmxpbmVQcm9wc30gLz5cbiAgICAgIDwvR3V0dGVyUmVzaXplPixcbiAgICAgIGRpdlxuICAgICk7XG5cbiAgICBjb25zdCB0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZChkaXYsIHtcbiAgICAgIHRpdGxlOiBsaW5lUHJvcHMuc3VtbWFyeSxcbiAgICAgIHBsYWNlbWVudDogJ3JpZ2h0JyxcbiAgICB9KTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZCh0aXApO1xuXG4gICAgcmV0dXJuIGRpdjtcbiAgfVxuXG4gIG9uUmVzaXplU3RhcnQoZSkge1xuICAgIHRoaXMuaXNSZXNpemluZyA9IHRydWU7XG4gICAgdGhpcy5yZXNpemVTdGFydFggPSBlLnBhZ2VYO1xuICAgIHRoaXMucmVzaXplU3RhcnRXaWR0aCA9IHRoaXMud2lkdGg7XG4gICAgdGhpcy5iaW5kUmVzaXplRXZlbnRzKCk7XG4gIH1cblxuICBvblJlc2l6ZUVuZCgpIHtcbiAgICB0aGlzLnVuYmluZFJlc2l6ZUV2ZW50cygpO1xuICAgIHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xuICAgIHRoaXMucmVzaXplU3RhcnRYID0gbnVsbDtcbiAgfVxuXG4gIG9uUmVzaXplTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLnJlc2l6ZVN0YXJ0WCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkZWx0YSA9IGUucGFnZVggLSB0aGlzLnJlc2l6ZVN0YXJ0WDtcbiAgICB0aGlzLnVwZGF0ZUd1dHRlcldpZHRoKHRoaXMucmVzaXplU3RhcnRXaWR0aCArIGRlbHRhKTtcbiAgfVxuXG4gIGJpbmRSZXNpemVFdmVudHMoKSB7XG4gICAgaWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJzLm1vdXNldXApIHtcbiAgICAgIGNvbnN0IG1vdXNldXBIYW5kbGVyID0gdGhpcy5vblJlc2l6ZUVuZC5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5ldmVudExpc3RlbmVycy5tb3VzZXVwID0gbW91c2V1cEhhbmRsZXI7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cEhhbmRsZXIpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lcnMubW91c2Vtb3ZlKSB7XG4gICAgICBjb25zdCBtb3VzZU1vdmVIYW5kbGVyID0gZGVib3VuY2UodGhpcy5vblJlc2l6ZU1vdmUuYmluZCh0aGlzKSwgUkVTSVpFX0RFQk9VTkNFX01TKTtcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMubW91c2Vtb3ZlID0gbW91c2VNb3ZlSGFuZGxlcjtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIpO1xuICAgIH1cbiAgfVxuXG4gIHVuYmluZFJlc2l6ZUV2ZW50cygpIHtcbiAgICBjb25zdCB7IG1vdXNlbW92ZSwgbW91c2V1cCB9ID0gdGhpcy5ldmVudExpc3RlbmVycztcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmUpO1xuICAgIGRlbGV0ZSB0aGlzLmV2ZW50TGlzdGVuZXJzLm1vdXNlbW92ZTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cCk7XG4gICAgZGVsZXRlIHRoaXMuZXZlbnRMaXN0ZW5lcnMubW91c2V1cDtcbiAgfVxuXG4gIHVwZGF0ZUd1dHRlcldpZHRoKG5ld1dpZHRoKSB7XG4gICAgdGhpcy53aWR0aCA9IG5ld1dpZHRoO1xuICAgIGF0b20uY29uZmlnLnNldCgnZ2l0LWJsYW1lLmNvbHVtbldpZHRoJywgbmV3V2lkdGgpO1xuXG4gICAgbGV0IHRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEdVVFRFUl9TVFlMRV9JRCk7XG4gICAgaWYgKCF0YWcpIHtcbiAgICAgIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICB0YWcuaWQgPSBHVVRURVJfU1RZTEVfSUQ7XG4gICAgICB0YWcudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRhZyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGVzID0gYFxuICAgICAgYXRvbS10ZXh0LWVkaXRvciAuZ3V0dGVyW2d1dHRlci1uYW1lPVwiJHtHVVRURVJfSUR9XCJdIHtcbiAgICAgICAgd2lkdGg6ICR7bmV3V2lkdGh9cHg7XG4gICAgICB9XG4gICAgYDtcbiAgICB0YWcudGV4dENvbnRlbnQgPSBzdHlsZXM7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZ3V0dGVyKCkuZGVzdHJveSgpO1xuICB9XG5cbn1cbiJdfQ==