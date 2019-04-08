Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

var _path = require('path');

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

'use babel';

exports['default'] = {
  activate: function activate() {
    var _this = this;

    require('atom-package-deps').install('linter-ruby');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-ruby.rubyExecutablePath', function (value) {
      _this.executablePath = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-ruby.ignoredExtensions', function (value) {
      _this.ignoredExtensions = value;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    var regex = /.+:(\d+):\s*(.+?)[,:]\s(.+)/g;
    return {
      name: 'Ruby',
      grammarScopes: ['source.ruby', 'source.ruby.rails', 'source.ruby.rspec'],
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        if (!filePath) {
          // We somehow got called without a file path
          return null;
        }
        var fileText = textEditor.getText();
        var fileExtension = (0, _path.extname)(filePath).substr(1);

        if (_this2.ignoredExtensions.includes(fileExtension)) {
          return [];
        }

        var execArgs = ['-c', // Check syntax only, no execution
        '-w', // Turns on warnings
        // Set the encoding to UTF-8
        '--external-encoding=utf-8', '--internal-encoding=utf-8'];
        var execOpts = {
          stdin: fileText,
          stream: 'stderr',
          allowEmptyStderr: true
        };
        var output = yield helpers.exec(_this2.executablePath, execArgs, execOpts);
        if (textEditor.getText() !== fileText) {
          // File contents have changed, just tell Linter not to update messages
          return null;
        }
        var toReturn = [];
        var match = regex.exec(output);
        while (match !== null) {
          var msgLine = Number.parseInt(match[1] - 1, 10);
          var type = match[2] === 'warning' ? 'Warning' : 'Error';
          toReturn.push({
            range: helpers.generateRange(textEditor, msgLine),
            type: type,
            text: match[3],
            filePath: filePath
          });
          match = regex.exec(output);
        }
        return toReturn;
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OzswQkFFeUIsYUFBYTs7SUFBMUIsT0FBTzs7b0JBQ0ssTUFBTTs7OztvQkFFTSxNQUFNOztBQUwxQyxXQUFXLENBQUM7O3FCQU9HO0FBQ2IsVUFBUSxFQUFBLG9CQUFHOzs7QUFDVCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXBELFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLEVBQ3pFLFVBQUMsS0FBSyxFQUFLO0FBQUUsWUFBSyxjQUFjLEdBQUcsS0FBSyxDQUFDO0tBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQ3hFLFVBQUMsS0FBSyxFQUFLO0FBQUUsWUFBSyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7S0FBRSxDQUFDLENBQUMsQ0FBQztHQUNwRDs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQzlCOztBQUVELGVBQWEsRUFBQSx5QkFBRzs7O0FBQ2QsUUFBTSxLQUFLLEdBQUcsOEJBQThCLENBQUM7QUFDN0MsV0FBTztBQUNMLFVBQUksRUFBRSxNQUFNO0FBQ1osbUJBQWEsRUFBRSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQztBQUN4RSxXQUFLLEVBQUUsTUFBTTtBQUNiLGVBQVMsRUFBRSxJQUFJO0FBQ2YsVUFBSSxvQkFBRSxXQUFPLFVBQVUsRUFBSztBQUMxQixZQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdEMsWUFBSSxDQUFDLFFBQVEsRUFBRTs7QUFFYixpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELFlBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN0QyxZQUFNLGFBQWEsR0FBRyxtQkFBUSxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWxELFlBQUksT0FBSyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDbEQsaUJBQU8sRUFBRSxDQUFDO1NBQ1g7O0FBRUQsWUFBTSxRQUFRLEdBQUcsQ0FDZixJQUFJO0FBQ0osWUFBSTs7QUFFSixtQ0FBMkIsRUFDM0IsMkJBQTJCLENBQzVCLENBQUM7QUFDRixZQUFNLFFBQVEsR0FBRztBQUNmLGVBQUssRUFBRSxRQUFRO0FBQ2YsZ0JBQU0sRUFBRSxRQUFRO0FBQ2hCLDBCQUFnQixFQUFFLElBQUk7U0FDdkIsQ0FBQztBQUNGLFlBQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFLLGNBQWMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0UsWUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssUUFBUSxFQUFFOztBQUVyQyxpQkFBTyxJQUFJLENBQUM7U0FDYjtBQUNELFlBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNwQixZQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLGVBQU8sS0FBSyxLQUFLLElBQUksRUFBRTtBQUNyQixjQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbEQsY0FBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQzFELGtCQUFRLENBQUMsSUFBSSxDQUFDO0FBQ1osaUJBQUssRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7QUFDakQsZ0JBQUksRUFBSixJQUFJO0FBQ0osZ0JBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2Qsb0JBQVEsRUFBUixRQUFRO1dBQ1QsQ0FBQyxDQUFDO0FBQ0gsZUFBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUI7QUFDRCxlQUFPLFFBQVEsQ0FBQztPQUNqQixDQUFBO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJ5L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnYXRvbS1saW50ZXInO1xuaW1wb3J0IHsgZXh0bmFtZSB9IGZyb20gJ3BhdGgnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9leHRlbnNpb25zLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSgpIHtcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1ydWJ5Jyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXJ1YnkucnVieUV4ZWN1dGFibGVQYXRoJyxcbiAgICAgICh2YWx1ZSkgPT4geyB0aGlzLmV4ZWN1dGFibGVQYXRoID0gdmFsdWU7IH0pKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1ydWJ5Lmlnbm9yZWRFeHRlbnNpb25zJyxcbiAgICAgICh2YWx1ZSkgPT4geyB0aGlzLmlnbm9yZWRFeHRlbnNpb25zID0gdmFsdWU7IH0pKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICBjb25zdCByZWdleCA9IC8uKzooXFxkKyk6XFxzKiguKz8pWyw6XVxccyguKykvZztcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1J1YnknLFxuICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UucnVieScsICdzb3VyY2UucnVieS5yYWlscycsICdzb3VyY2UucnVieS5yc3BlYyddLFxuICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgIGxpbnQ6IGFzeW5jICh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgICAgICAvLyBXZSBzb21laG93IGdvdCBjYWxsZWQgd2l0aG91dCBhIGZpbGUgcGF0aFxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbGVUZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGZpbGVFeHRlbnNpb24gPSBleHRuYW1lKGZpbGVQYXRoKS5zdWJzdHIoMSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaWdub3JlZEV4dGVuc2lvbnMuaW5jbHVkZXMoZmlsZUV4dGVuc2lvbikpIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBleGVjQXJncyA9IFtcbiAgICAgICAgICAnLWMnLCAvLyBDaGVjayBzeW50YXggb25seSwgbm8gZXhlY3V0aW9uXG4gICAgICAgICAgJy13JywgLy8gVHVybnMgb24gd2FybmluZ3NcbiAgICAgICAgICAvLyBTZXQgdGhlIGVuY29kaW5nIHRvIFVURi04XG4gICAgICAgICAgJy0tZXh0ZXJuYWwtZW5jb2Rpbmc9dXRmLTgnLFxuICAgICAgICAgICctLWludGVybmFsLWVuY29kaW5nPXV0Zi04JyxcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgZXhlY09wdHMgPSB7XG4gICAgICAgICAgc3RkaW46IGZpbGVUZXh0LFxuICAgICAgICAgIHN0cmVhbTogJ3N0ZGVycicsXG4gICAgICAgICAgYWxsb3dFbXB0eVN0ZGVycjogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgaGVscGVycy5leGVjKHRoaXMuZXhlY3V0YWJsZVBhdGgsIGV4ZWNBcmdzLCBleGVjT3B0cyk7XG4gICAgICAgIGlmICh0ZXh0RWRpdG9yLmdldFRleHQoKSAhPT0gZmlsZVRleHQpIHtcbiAgICAgICAgICAvLyBGaWxlIGNvbnRlbnRzIGhhdmUgY2hhbmdlZCwganVzdCB0ZWxsIExpbnRlciBub3QgdG8gdXBkYXRlIG1lc3NhZ2VzXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBbXTtcbiAgICAgICAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICB3aGlsZSAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBtc2dMaW5lID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzFdIC0gMSwgMTApO1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSBtYXRjaFsyXSA9PT0gJ3dhcm5pbmcnID8gJ1dhcm5pbmcnIDogJ0Vycm9yJztcbiAgICAgICAgICB0b1JldHVybi5wdXNoKHtcbiAgICAgICAgICAgIHJhbmdlOiBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgbXNnTGluZSksXG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgdGV4dDogbWF0Y2hbM10sXG4gICAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19