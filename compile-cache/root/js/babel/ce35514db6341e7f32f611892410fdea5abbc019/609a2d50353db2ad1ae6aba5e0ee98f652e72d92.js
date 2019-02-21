Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

// Dependencies
'use babel';var helpers = undefined;
var path = undefined;

// Local variables
var parseRegex = /^((?:Parse|Fatal) error|Deprecated):\s+(.+) in .+?(?: on line |:)(\d+)/gm;
var phpVersionMatchRegex = /^PHP (\d+)\.(\d+)\.(\d+)/;

var loadDeps = function loadDeps() {
  if (!helpers) {
    helpers = require('atom-linter');
  }
  if (!path) {
    path = require('path');
  }
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterPhpDeps = function installLinterPhpDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-php');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterPhpDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-php.executablePath', function (value) {
      _this.executablePath = value;
    }), atom.config.observe('linter-php.errorReporting', function (value) {
      _this.errorReporting = value;
    }), atom.config.observe('linter-php.ignorePhpIni', function (value) {
      _this.ignorePhpIni = value;
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'PHP',
      grammarScopes: ['text.html.php', 'source.php'],
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (textEditor) {
        if (!atom.workspace.isTextEditor(textEditor)) {
          return null;
        }
        var filePath = textEditor.getPath();
        var fileText = textEditor.getText();

        // Ensure that the dependencies are loaded
        loadDeps();

        var parameters = ['--syntax-check', '--define', 'display_errors=On', '--define', 'log_errors=Off'];
        if (_this2.errorReporting) {
          parameters.push('--define', 'error_reporting=E_ALL');
        }
        if (_this2.ignorePhpIni) {
          // No configuration (ini) files will be used
          parameters.push('-n');
        }

        var execOptions = {
          stdin: fileText,
          ignoreExitCode: true
        };

        if (filePath) {
          // Only specify a CWD if the file has been saved

          var _atom$project$relativizePath = atom.project.relativizePath(filePath);

          var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 1);

          var projectPath = _atom$project$relativizePath2[0];

          execOptions.cwd = projectPath !== null ? projectPath : path.dirname(filePath);
        }

        var output = yield helpers.exec(_this2.executablePath, parameters, execOptions);

        if (textEditor.getText() !== fileText) {
          // Editor contents have changed, don't update messages
          return null;
        }

        var messages = [];
        var match = parseRegex.exec(output);
        while (match !== null) {
          var line = Number.parseInt(match[3], 10) - 1;
          var errorType = match[1];

          messages.push({
            severity: /error/i.test(errorType) ? 'error' : 'warning',
            location: {
              file: filePath,
              position: helpers.generateRange(textEditor, line)
            },
            excerpt: match[2]
          });

          match = parseRegex.exec(output);
        }
        return messages;
      })
    };
  },

  getPhpVersionInfo: _asyncToGenerator(function* () {
    var execOptions = {
      ignoreExitCode: true
    };
    var output = yield helpers.exec(this.executablePath, ['--version'], execOptions);

    var match = phpVersionMatchRegex.exec(output);
    return {
      major: match[1],
      minor: match[2],
      patch: match[3]
    };
  })
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9saW50ZXItcGhwL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07OztBQUgxQyxXQUFXLENBQUMsQUFNWixJQUFJLE9BQU8sWUFBQSxDQUFDO0FBQ1osSUFBSSxJQUFJLFlBQUEsQ0FBQzs7O0FBR1QsSUFBTSxVQUFVLEdBQUcsMEVBQTBFLENBQUM7QUFDOUYsSUFBTSxvQkFBb0IsR0FBRywwQkFBMEIsQ0FBQzs7QUFFeEQsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLEdBQVM7QUFDckIsTUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLFdBQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7R0FDbEM7QUFDRCxNQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsUUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN4QjtDQUNGLENBQUM7O3FCQUVhO0FBQ2IsVUFBUSxFQUFBLG9CQUFHOzs7QUFDVCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDL0IsUUFBSSxjQUFjLFlBQUEsQ0FBQztBQUNuQixRQUFNLG9CQUFvQixHQUFHLFNBQXZCLG9CQUFvQixHQUFTO0FBQ2pDLFlBQUssYUFBYSxVQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDMUMsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN0QixlQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDcEQ7QUFDRCxjQUFRLEVBQUUsQ0FBQztLQUNaLENBQUM7QUFDRixrQkFBYyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2xFLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV2QyxRQUFJLENBQUMsYUFBYSxHQUFH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RSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0MsY0FBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUzQixrQkFBUSxDQUFDLElBQUksQ0FBQztBQUNaLG9CQUFRLEVBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLEdBQUcsU0FBUyxBQUFDO0FBQzFELG9CQUFRLEVBQUU7QUFDUixrQkFBSSxFQUFFLFFBQVE7QUFDZCxzQkFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQzthQUNsRDtBQUNELG1CQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztXQUNsQixDQUFDLENBQUM7O0FBRUgsZUFBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakM7QUFDRCxlQUFPLFFBQVEsQ0FBQztPQUNqQixDQUFBO0tBQ0YsQ0FBQztHQUNIOztBQUVELEFBQU0sbUJBQWlCLG9CQUFBLGFBQUc7QUFDeEIsUUFBTSxXQUFXLEdBQUc7QUFDbEIsb0JBQWMsRUFBRSxJQUFJO0tBQ3JCLENBQUM7QUFDRixRQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUVuRixRQUFNLEtBQUssR0FBRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEQsV0FBTztBQUNMLFdBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2YsV0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDZixXQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUNoQixDQUFDO0dBQ0gsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9saW50ZXItcGhwL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsIGltcG9ydC9leHRlbnNpb25zXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbi8vIERlcGVuZGVuY2llc1xubGV0IGhlbHBlcnM7XG5sZXQgcGF0aDtcblxuLy8gTG9jYWwgdmFyaWFibGVzXG5jb25zdCBwYXJzZVJlZ2V4ID0gL14oKD86UGFyc2V8RmF0YWwpIGVycm9yfERlcHJlY2F0ZWQpOlxccysoLispIGluIC4rPyg/OiBvbiBsaW5lIHw6KShcXGQrKS9nbTtcbmNvbnN0IHBocFZlcnNpb25NYXRjaFJlZ2V4ID0gL15QSFAgKFxcZCspXFwuKFxcZCspXFwuKFxcZCspLztcblxuY29uc3QgbG9hZERlcHMgPSAoKSA9PiB7XG4gIGlmICghaGVscGVycykge1xuICAgIGhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpO1xuICB9XG4gIGlmICghcGF0aCkge1xuICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzID0gbmV3IFNldCgpO1xuICAgIGxldCBkZXBzQ2FsbGJhY2tJRDtcbiAgICBjb25zdCBpbnN0YWxsTGludGVyUGhwRGVwcyA9ICgpID0+IHtcbiAgICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5kZWxldGUoZGVwc0NhbGxiYWNrSUQpO1xuICAgICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1waHAnKTtcbiAgICAgIH1cbiAgICAgIGxvYWREZXBzKCk7XG4gICAgfTtcbiAgICBkZXBzQ2FsbGJhY2tJRCA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKGluc3RhbGxMaW50ZXJQaHBEZXBzKTtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKGRlcHNDYWxsYmFja0lEKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHAuZXhlY3V0YWJsZVBhdGgnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5leGVjdXRhYmxlUGF0aCA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwLmVycm9yUmVwb3J0aW5nJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuZXJyb3JSZXBvcnRpbmcgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXBocC5pZ25vcmVQaHBJbmknLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5pZ25vcmVQaHBJbmkgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFja0lEID0+IHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2soY2FsbGJhY2tJRCkpO1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5jbGVhcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1BIUCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3RleHQuaHRtbC5waHAnLCAnc291cmNlLnBocCddLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRzT25DaGFuZ2U6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBpZiAoIWF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcih0ZXh0RWRpdG9yKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGZpbGVUZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICAgICAgLy8gRW5zdXJlIHRoYXQgdGhlIGRlcGVuZGVuY2llcyBhcmUgbG9hZGVkXG4gICAgICAgIGxvYWREZXBzKCk7XG5cbiAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IFtcbiAgICAgICAgICAnLS1zeW50YXgtY2hlY2snLFxuICAgICAgICAgICctLWRlZmluZScsICdkaXNwbGF5X2Vycm9ycz1PbicsXG4gICAgICAgICAgJy0tZGVmaW5lJywgJ2xvZ19lcnJvcnM9T2ZmJyxcbiAgICAgICAgXTtcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JSZXBvcnRpbmcpIHtcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tZGVmaW5lJywgJ2Vycm9yX3JlcG9ydGluZz1FX0FMTCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlnbm9yZVBocEluaSkge1xuICAgICAgICAgIC8vIE5vIGNvbmZpZ3VyYXRpb24gKGluaSkgZmlsZXMgd2lsbCBiZSB1c2VkXG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXhlY09wdGlvbnMgPSB7XG4gICAgICAgICAgc3RkaW46IGZpbGVUZXh0LFxuICAgICAgICAgIGlnbm9yZUV4aXRDb2RlOiB0cnVlLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChmaWxlUGF0aCkge1xuICAgICAgICAgIC8vIE9ubHkgc3BlY2lmeSBhIENXRCBpZiB0aGUgZmlsZSBoYXMgYmVlbiBzYXZlZFxuICAgICAgICAgIGNvbnN0IFtwcm9qZWN0UGF0aF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpO1xuICAgICAgICAgIGV4ZWNPcHRpb25zLmN3ZCA9IHByb2plY3RQYXRoICE9PSBudWxsID8gcHJvamVjdFBhdGggOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgaGVscGVycy5leGVjKHRoaXMuZXhlY3V0YWJsZVBhdGgsIHBhcmFtZXRlcnMsIGV4ZWNPcHRpb25zKTtcblxuICAgICAgICBpZiAodGV4dEVkaXRvci5nZXRUZXh0KCkgIT09IGZpbGVUZXh0KSB7XG4gICAgICAgICAgLy8gRWRpdG9yIGNvbnRlbnRzIGhhdmUgY2hhbmdlZCwgZG9uJ3QgdXBkYXRlIG1lc3NhZ2VzXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuICAgICAgICBsZXQgbWF0Y2ggPSBwYXJzZVJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICAgICAgd2hpbGUgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgbGluZSA9IE51bWJlci5wYXJzZUludChtYXRjaFszXSwgMTApIC0gMTtcbiAgICAgICAgICBjb25zdCBlcnJvclR5cGUgPSBtYXRjaFsxXTtcblxuICAgICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgc2V2ZXJpdHk6ICgvZXJyb3IvaS50ZXN0KGVycm9yVHlwZSkgPyAnZXJyb3InIDogJ3dhcm5pbmcnKSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgIGZpbGU6IGZpbGVQYXRoLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogaGVscGVycy5nZW5lcmF0ZVJhbmdlKHRleHRFZGl0b3IsIGxpbmUpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV4Y2VycHQ6IG1hdGNoWzJdLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbWF0Y2ggPSBwYXJzZVJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVzc2FnZXM7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG5cbiAgYXN5bmMgZ2V0UGhwVmVyc2lvbkluZm8oKSB7XG4gICAgY29uc3QgZXhlY09wdGlvbnMgPSB7XG4gICAgICBpZ25vcmVFeGl0Q29kZTogdHJ1ZSxcbiAgICB9O1xuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IGhlbHBlcnMuZXhlYyh0aGlzLmV4ZWN1dGFibGVQYXRoLCBbJy0tdmVyc2lvbiddLCBleGVjT3B0aW9ucyk7XG5cbiAgICBjb25zdCBtYXRjaCA9IHBocFZlcnNpb25NYXRjaFJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICByZXR1cm4ge1xuICAgICAgbWFqb3I6IG1hdGNoWzFdLFxuICAgICAgbWlub3I6IG1hdGNoWzJdLFxuICAgICAgcGF0Y2g6IG1hdGNoWzNdLFxuICAgIH07XG4gIH0sXG59O1xuIl19