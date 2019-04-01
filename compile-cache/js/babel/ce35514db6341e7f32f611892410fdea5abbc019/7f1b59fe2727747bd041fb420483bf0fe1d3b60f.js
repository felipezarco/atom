Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint-disable import/no-duplicates */

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var _validate = require('./validate');

var Validate = _interopRequireWildcard(_validate);

var LinterRegistry = (function () {
  function LinterRegistry() {
    var _this = this;

    _classCallCheck(this, LinterRegistry);

    this.emitter = new _atom.Emitter();
    this.linters = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.activeNotifications = new Set();

    this.subscriptions.add(atom.config.observe('linter.lintOnChange', function (lintOnChange) {
      _this.lintOnChange = lintOnChange;
    }));
    this.subscriptions.add(atom.config.observe('core.excludeVcsIgnoredPaths', function (ignoreVCS) {
      _this.ignoreVCS = ignoreVCS;
    }));
    this.subscriptions.add(atom.config.observe('linter.ignoreGlob', function (ignoreGlob) {
      _this.ignoreGlob = ignoreGlob;
    }));
    this.subscriptions.add(atom.config.observe('linter.lintPreviewTabs', function (lintPreviewTabs) {
      _this.lintPreviewTabs = lintPreviewTabs;
    }));
    this.subscriptions.add(atom.config.observe('linter.disabledProviders', function (disabledProviders) {
      _this.disabledProviders = disabledProviders;
    }));
    this.subscriptions.add(this.emitter);
  }

  _createClass(LinterRegistry, [{
    key: 'hasLinter',
    value: function hasLinter(linter) {
      return this.linters.has(linter);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      if (!Validate.linter(linter)) {
        return;
      }
      linter[_helpers.$activated] = true;
      if (typeof linter[_helpers.$requestLatest] === 'undefined') {
        linter[_helpers.$requestLatest] = 0;
      }
      if (typeof linter[_helpers.$requestLastReceived] === 'undefined') {
        linter[_helpers.$requestLastReceived] = 0;
      }
      linter[_helpers.$version] = 2;
      this.linters.add(linter);
    }
  }, {
    key: 'getProviders',
    value: function getProviders() {
      return Array.from(this.linters);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      if (!this.linters.has(linter)) {
        return;
      }
      linter[_helpers.$activated] = false;
      this.linters['delete'](linter);
    }
  }, {
    key: 'lint',
    value: _asyncToGenerator(function* (_ref) {
      var onChange = _ref.onChange;
      var editor = _ref.editor;
      return yield* (function* () {
        var _this2 = this;

        var filePath = editor.getPath();

        if (onChange && !this.lintOnChange || // Lint-on-change mismatch
        !filePath || // Not saved anywhere yet
        Helpers.isPathIgnored(editor.getPath(), this.ignoreGlob, this.ignoreVCS) || // Ignored by VCS or Glob
        !this.lintPreviewTabs && atom.workspace.getActivePane().getPendingItem() === editor // Ignore Preview tabs
        ) {
            return false;
          }

        var scopes = Helpers.getEditorCursorScopes(editor);

        var promises = [];

        var _loop = function (linter) {
          if (!Helpers.shouldTriggerLinter(linter, onChange, scopes)) {
            return 'continue';
          }
          if (_this2.disabledProviders.includes(linter.name)) {
            return 'continue';
          }
          var number = ++linter[_helpers.$requestLatest];
          var statusBuffer = linter.scope === 'file' ? editor.getBuffer() : null;
          var statusFilePath = linter.scope === 'file' ? filePath : null;

          _this2.emitter.emit('did-begin-linting', { number: number, linter: linter, filePath: statusFilePath });
          promises.push(new Promise(function (resolve) {
            // $FlowIgnore: Type too complex, duh
            resolve(linter.lint(editor));
          }).then(function (messages) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });
            if (linter[_helpers.$requestLastReceived] >= number || !linter[_helpers.$activated] || statusBuffer && !statusBuffer.isAlive()) {
              return;
            }
            linter[_helpers.$requestLastReceived] = number;
            if (statusBuffer && !statusBuffer.isAlive()) {
              return;
            }

            if (messages === null) {
              // NOTE: Do NOT update the messages when providers return null
              return;
            }

            var validity = true;
            // NOTE: We are calling it when results are not an array to show a nice notification
            if (atom.inDevMode() || !Array.isArray(messages)) {
              validity = Validate.messages(linter.name, messages);
            }
            if (!validity) {
              return;
            }

            Helpers.normalizeMessages(linter.name, messages);
            _this2.emitter.emit('did-update-messages', { messages: messages, linter: linter, buffer: statusBuffer });
          }, function (error) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });

            console.error('[Linter] Error running ' + linter.name, error);
            var notificationMessage = '[Linter] Error running ' + linter.name;
            if (Array.from(_this2.activeNotifications).some(function (item) {
              return item.getOptions().detail === notificationMessage;
            })) {
              // This message is still showing to the user!
              return;
            }

            var notification = atom.notifications.addError(notificationMessage, {
              detail: 'See Console for more info.',
              dismissable: true,
              buttons: [{
                text: 'Open Console',
                onDidClick: function onDidClick() {
                  atom.openDevTools();
                  notification.dismiss();
                }
              }, {
                text: 'Cancel',
                onDidClick: function onDidClick() {
                  notification.dismiss();
                }
              }]
            });
          }));
        };

        for (var linter of this.linters) {
          var _ret = _loop(linter);

          if (_ret === 'continue') continue;
        }

        yield Promise.all(promises);
        return true;
      }).apply(this, arguments);
    })
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'onDidBeginLinting',
    value: function onDidBeginLinting(callback) {
      return this.emitter.on('did-begin-linting', callback);
    }
  }, {
    key: 'onDidFinishLinting',
    value: function onDidFinishLinting(callback) {
      return this.emitter.on('did-finish-linting', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.activeNotifications.forEach(function (notification) {
        return notification.dismiss();
      });
      this.activeNotifications.clear();
      this.linters.clear();
      this.subscriptions.dispose();
    }
  }]);

  return LinterRegistry;
})();

exports['default'] = LinterRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFHNkMsTUFBTTs7dUJBRzFCLFdBQVc7O0lBQXhCLE9BQU87O3dCQUNPLFlBQVk7O0lBQTFCLFFBQVE7O0lBSWQsY0FBYztBQVdQLFdBWFAsY0FBYyxHQVdKOzs7MEJBWFYsY0FBYzs7QUFZaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUVwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsVUFBQSxZQUFZLEVBQUk7QUFDekQsWUFBSyxZQUFZLEdBQUcsWUFBWSxDQUFBO0tBQ2pDLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDZCQUE2QixFQUFFLFVBQUEsU0FBUyxFQUFJO0FBQzlELFlBQUssU0FBUyxHQUFHLFNBQVMsQ0FBQTtLQUMzQixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxVQUFBLFVBQVUsRUFBSTtBQUNyRCxZQUFLLFVBQVUsR0FBRyxVQUFVLENBQUE7S0FDN0IsQ0FBQyxDQUNILENBQUE7QUFDRCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMs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ImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWR1cGxpY2F0ZXMgKi9cblxuaW1wb3J0IHsgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IsIERpc3Bvc2FibGUsIE5vdGlmaWNhdGlvbiB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0ICogYXMgVmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZSdcbmltcG9ydCB7ICR2ZXJzaW9uLCAkYWN0aXZhdGVkLCAkcmVxdWVzdExhdGVzdCwgJHJlcXVlc3RMYXN0UmVjZWl2ZWQgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlciB9IGZyb20gJy4vdHlwZXMnXG5cbmNsYXNzIExpbnRlclJlZ2lzdHJ5IHtcbiAgZW1pdHRlcjogRW1pdHRlclxuICBsaW50ZXJzOiBTZXQ8TGludGVyPlxuICBsaW50T25DaGFuZ2U6IGJvb2xlYW5cbiAgaWdub3JlVkNTOiBib29sZWFuXG4gIGlnbm9yZUdsb2I6IHN0cmluZ1xuICBsaW50UHJldmlld1RhYnM6IGJvb2xlYW5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBkaXNhYmxlZFByb3ZpZGVyczogQXJyYXk8c3RyaW5nPlxuICBhY3RpdmVOb3RpZmljYXRpb25zOiBTZXQ8Tm90aWZpY2F0aW9uPlxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmxpbnRlcnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5hY3RpdmVOb3RpZmljYXRpb25zID0gbmV3IFNldCgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmxpbnRPbkNoYW5nZScsIGxpbnRPbkNoYW5nZSA9PiB7XG4gICAgICAgIHRoaXMubGludE9uQ2hhbmdlID0gbGludE9uQ2hhbmdlXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2NvcmUuZXhjbHVkZVZjc0lnbm9yZWRQYXRocycsIGlnbm9yZVZDUyA9PiB7XG4gICAgICAgIHRoaXMuaWdub3JlVkNTID0gaWdub3JlVkNTXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5pZ25vcmVHbG9iJywgaWdub3JlR2xvYiA9PiB7XG4gICAgICAgIHRoaXMuaWdub3JlR2xvYiA9IGlnbm9yZUdsb2JcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmxpbnRQcmV2aWV3VGFicycsIGxpbnRQcmV2aWV3VGFicyA9PiB7XG4gICAgICAgIHRoaXMubGludFByZXZpZXdUYWJzID0gbGludFByZXZpZXdUYWJzXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIGRpc2FibGVkUHJvdmlkZXJzID0+IHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZFByb3ZpZGVycyA9IGRpc2FibGVkUHJvdmlkZXJzXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgaGFzTGludGVyKGxpbnRlcjogTGludGVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubGludGVycy5oYXMobGludGVyKVxuICB9XG4gIGFkZExpbnRlcihsaW50ZXI6IExpbnRlcikge1xuICAgIGlmICghVmFsaWRhdGUubGludGVyKGxpbnRlcikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBsaW50ZXJbJGFjdGl2YXRlZF0gPSB0cnVlXG4gICAgaWYgKHR5cGVvZiBsaW50ZXJbJHJlcXVlc3RMYXRlc3RdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgbGludGVyWyRyZXF1ZXN0TGF0ZXN0XSA9IDBcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgbGludGVyWyRyZXF1ZXN0TGFzdFJlY2VpdmVkXSA9IDBcbiAgICB9XG4gICAgbGludGVyWyR2ZXJzaW9uXSA9IDJcbiAgICB0aGlzLmxpbnRlcnMuYWRkKGxpbnRlcilcbiAgfVxuICBnZXRQcm92aWRlcnMoKTogQXJyYXk8TGludGVyPiB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5saW50ZXJzKVxuICB9XG4gIGRlbGV0ZUxpbnRlcihsaW50ZXI6IExpbnRlcikge1xuICAgIGlmICghdGhpcy5saW50ZXJzLmhhcyhsaW50ZXIpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGludGVyWyRhY3RpdmF0ZWRdID0gZmFsc2VcbiAgICB0aGlzLmxpbnRlcnMuZGVsZXRlKGxpbnRlcilcbiAgfVxuICBhc3luYyBsaW50KHsgb25DaGFuZ2UsIGVkaXRvciB9OiB7IG9uQ2hhbmdlOiBib29sZWFuLCBlZGl0b3I6IFRleHRFZGl0b3IgfSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuXG4gICAgaWYgKFxuICAgICAgKG9uQ2hhbmdlICYmICF0aGlzLmxpbnRPbkNoYW5nZSkgfHwgLy8gTGludC1vbi1jaGFuZ2UgbWlzbWF0Y2hcbiAgICAgICFmaWxlUGF0aCB8fCAvLyBOb3Qgc2F2ZWQgYW55d2hlcmUgeWV0XG4gICAgICBIZWxwZXJzLmlzUGF0aElnbm9yZWQoZWRpdG9yLmdldFBhdGgoKSwgdGhpcy5pZ25vcmVHbG9iLCB0aGlzLmlnbm9yZVZDUykgfHwgLy8gSWdub3JlZCBieSBWQ1Mgb3IgR2xvYlxuICAgICAgKCF0aGlzLmxpbnRQcmV2aWV3VGFicyAmJiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0UGVuZGluZ0l0ZW0oKSA9PT0gZWRpdG9yKSAvLyBJZ25vcmUgUHJldmlldyB0YWJzXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCBzY29wZXMgPSBIZWxwZXJzLmdldEVkaXRvckN1cnNvclNjb3BlcyhlZGl0b3IpXG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdXG4gICAgZm9yIChjb25zdCBsaW50ZXIgb2YgdGhpcy5saW50ZXJzKSB7XG4gICAgICBpZiAoIUhlbHBlcnMuc2hvdWxkVHJpZ2dlckxpbnRlcihsaW50ZXIsIG9uQ2hhbmdlLCBzY29wZXMpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZFByb3ZpZGVycy5pbmNsdWRlcyhsaW50ZXIubmFtZSkpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IG51bWJlciA9ICsrbGludGVyWyRyZXF1ZXN0TGF0ZXN0XVxuICAgICAgY29uc3Qgc3RhdHVzQnVmZmVyID0gbGludGVyLnNjb3BlID09PSAnZmlsZScgPyBlZGl0b3IuZ2V0QnVmZmVyKCkgOiBudWxsXG4gICAgICBjb25zdCBzdGF0dXNGaWxlUGF0aCA9IGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnID8gZmlsZVBhdGggOiBudWxsXG5cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtYmVnaW4tbGludGluZycsIHsgbnVtYmVyLCBsaW50ZXIsIGZpbGVQYXRoOiBzdGF0dXNGaWxlUGF0aCB9KVxuICAgICAgcHJvbWlzZXMucHVzaChcbiAgICAgICAgbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgIC8vICRGbG93SWdub3JlOiBUeXBlIHRvbyBjb21wbGV4LCBkdWhcbiAgICAgICAgICByZXNvbHZlKGxpbnRlci5saW50KGVkaXRvcikpXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgbWVzc2FnZXMgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1maW5pc2gtbGludGluZycsIHsgbnVtYmVyLCBsaW50ZXIsIGZpbGVQYXRoOiBzdGF0dXNGaWxlUGF0aCB9KVxuICAgICAgICAgICAgaWYgKGxpbnRlclskcmVxdWVzdExhc3RSZWNlaXZlZF0gPj0gbnVtYmVyIHx8ICFsaW50ZXJbJGFjdGl2YXRlZF0gfHwgKHN0YXR1c0J1ZmZlciAmJiAhc3RhdHVzQnVmZmVyLmlzQWxpdmUoKSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID0gbnVtYmVyXG4gICAgICAgICAgICBpZiAoc3RhdHVzQnVmZmVyICYmICFzdGF0dXNCdWZmZXIuaXNBbGl2ZSgpKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVzc2FnZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgLy8gTk9URTogRG8gTk9UIHVwZGF0ZSB0aGUgbWVzc2FnZXMgd2hlbiBwcm92aWRlcnMgcmV0dXJuIG51bGxcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2YWxpZGl0eSA9IHRydWVcbiAgICAgICAgICAgIC8vIE5PVEU6IFdlIGFyZSBjYWxsaW5nIGl0IHdoZW4gcmVzdWx0cyBhcmUgbm90IGFuIGFycmF5IHRvIHNob3cgYSBuaWNlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgaWYgKGF0b20uaW5EZXZNb2RlKCkgfHwgIUFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSB7XG4gICAgICAgICAgICAgIHZhbGlkaXR5ID0gVmFsaWRhdGUubWVzc2FnZXMobGludGVyLm5hbWUsIG1lc3NhZ2VzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF2YWxpZGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlcyhsaW50ZXIubmFtZSwgbWVzc2FnZXMpXG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHsgbWVzc2FnZXMsIGxpbnRlciwgYnVmZmVyOiBzdGF0dXNCdWZmZXIgfSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZmluaXNoLWxpbnRpbmcnLCB7IG51bWJlciwgbGludGVyLCBmaWxlUGF0aDogc3RhdHVzRmlsZVBhdGggfSlcblxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW0xpbnRlcl0gRXJyb3IgcnVubmluZyAke2xpbnRlci5uYW1lfWAsIGVycm9yKVxuICAgICAgICAgICAgY29uc3Qgbm90aWZpY2F0aW9uTWVzc2FnZSA9IGBbTGludGVyXSBFcnJvciBydW5uaW5nICR7bGludGVyLm5hbWV9YFxuICAgICAgICAgICAgaWYgKEFycmF5LmZyb20odGhpcy5hY3RpdmVOb3RpZmljYXRpb25zKS5zb21lKGl0ZW0gPT4gaXRlbS5nZXRPcHRpb25zKCkuZGV0YWlsID09PSBub3RpZmljYXRpb25NZXNzYWdlKSkge1xuICAgICAgICAgICAgICAvLyBUaGlzIG1lc3NhZ2UgaXMgc3RpbGwgc2hvd2luZyB0byB0aGUgdXNlciFcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihub3RpZmljYXRpb25NZXNzYWdlLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogJ1NlZSBDb25zb2xlIGZvciBtb3JlIGluZm8uJyxcbiAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnT3BlbiBDb25zb2xlJyxcbiAgICAgICAgICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXRvbS5vcGVuRGV2VG9vbHMoKVxuICAgICAgICAgICAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdGV4dDogJ0NhbmNlbCcsXG4gICAgICAgICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSxcbiAgICAgICAgKSxcbiAgICAgIClcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkQmVnaW5MaW50aW5nKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1iZWdpbi1saW50aW5nJywgY2FsbGJhY2spXG4gIH1cbiAgb25EaWRGaW5pc2hMaW50aW5nKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1maW5pc2gtbGludGluZycsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5hY3RpdmVOb3RpZmljYXRpb25zLmZvckVhY2gobm90aWZpY2F0aW9uID0+IG5vdGlmaWNhdGlvbi5kaXNtaXNzKCkpXG4gICAgdGhpcy5hY3RpdmVOb3RpZmljYXRpb25zLmNsZWFyKClcbiAgICB0aGlzLmxpbnRlcnMuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMaW50ZXJSZWdpc3RyeVxuIl19