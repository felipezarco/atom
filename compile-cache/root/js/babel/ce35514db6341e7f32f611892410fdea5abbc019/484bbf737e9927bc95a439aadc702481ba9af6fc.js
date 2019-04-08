Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _atom = require('atom');

var _bracketMatcher = require('./bracket-matcher');

var _bracketMatcher2 = _interopRequireDefault(_bracketMatcher);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

exports['default'] = {

  subscriptions: null,
  editors: null,
  brackets: null,
  ignored_files: null,
  repeat_color: null,

  config: {
    brackets: {
      title: 'Brackets to match',
      description: "Should be matching pairs like '()', and '{}'",
      'default': ['{}'],
      type: 'array',
      items: {
        type: 'string'
      }
    },
    ignored_files: {
      title: 'Ignored files',
      description: 'Files which will not be colorized',
      'default': ['*.md', '.*'],
      type: 'array',
      items: {
        type: 'string'
      }
    },
    repeat_color: {
      title: 'Repeat Color Count',
      description: 'Number of color classes to repeat',
      'default': 9,
      type: 'integer'
    }
  },

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.editors = new WeakMap();
    this.brackets = atom.config.get('bracket-colorizer.brackets');
    this.ignored_files = atom.config.get('bracket-colorizer.ignored_files');
    this.repeat_color = atom.config.get('bracket-colorizer.repeat_color');

    this.subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(function () {
      return _this.processEditor();
    }));
    this.subscriptions.add(atom.config.onDidChange('bracket-colorizer.brackets', function (value) {
      _this.brackets = value;
      _this.cleanAll();
      _this.processEditor();
    }));
    this.subscriptions.add(atom.config.onDidChange('bracket-colorizer.ignored_files', function (value) {
      _this.ignored_files = value;
      _this.cleanAll();
      _this.processEditor();
    }));
    this.subscriptions.add(atom.config.onDidChange('bracket-colorizer.repeat_color', function (value) {
      _this.repeat_color = value;
      _this.cleanAll();
      _this.processEditor();
    }));

    this.processEditor();
  },

  deactivate: function deactivate() {
    this.cleanAll();
    this.subscriptions.dispose();
  },

  processEditor: function processEditor() {
    var _this2 = this;

    var editor = atom.workspace.getActiveTextEditor();
    if (!editor || this.editors.has(editor)) {
      return;
    }

    var file = editor.buffer.file;
    if (!file) {
      return;
    }
    if (file.path) {
      for (var _name of this.ignored_files) {
        if ((0, _minimatch2['default'])(_path2['default'].basename(file.path), _name)) {
          return;
        }
      }
    }

    var editorObj = {
      subscriptions: new _atom.CompositeDisposable(),
      bracketMatcher: new _bracketMatcher2['default'](editor, this.brackets, this.repeat_color)
    };
    editorObj.subscriptions.add(editor.onDidStopChanging(function () {
      editorObj.bracketMatcher.refresh();
    }));
    editorObj.subscriptions.add(editor.onDidTokenize(function () {
      editorObj.bracketMatcher.refresh();
    }));
    editorObj.subscriptions.add(editor.onDidDestroy(function () {
      editorObj.bracketMatcher.destroy();
      editorObj.subscriptions.dispose();
      _this2.editors['delete'](editor);
    }));
    this.editors.set(editor, editorObj);
  },

  cleanAll: function cleanAll() {
    var _this3 = this;

    atom.workspace.getTextEditors().forEach(function (editor) {
      if (!_this3.editors.has(editor)) {
        return;
      }
      var editorObj = _this3.editors.get(editor);
      editorObj.bracketMatcher.destroy();
      editorObj.subscriptions.dispose();
      _this3.editors['delete'](editor);
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9icmFja2V0LWNvbG9yaXplci9saWIvYnJhY2tldC1jb2xvcml6ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07OzhCQUNmLG1CQUFtQjs7Ozt5QkFDeEIsV0FBVzs7OztvQkFDaEIsTUFBTTs7OztxQkFFUjs7QUFFYixlQUFhLEVBQUUsSUFBSTtBQUNuQixTQUFPLEVBQUUsSUFBSTtBQUNiLFVBQVEsRUFBRSxJQUFJO0FBQ2QsZUFBYSxFQUFFLElBQUk7QUFDbkIsY0FBWSxFQUFFLElBQUk7O0FBRWxCLFFBQU0sRUFBRTtBQUNOLFlBQVEsRUFBRTtBQUNSLFdBQUssRUFBRSxtQkFBbUI7QUFDMUIsaUJBQVcsRUFBRSw4Q0FBOEM7QUFDM0QsaUJBQVMsQ0FBQyxJQUFJLENBQUM7QUFDZixVQUFJLEVBQUUsT0FBTztBQUNiLFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtBQUNELGlCQUFhLEVBQUU7QUFDYixXQUFLLEVBQUUsZUFBZTtBQUN0QixpQkFBVyxFQUFFLG1DQUFtQztBQUNoRCxpQkFBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7QUFDdkIsVUFBSSxFQUFFLE9BQU87QUFDYixXQUFLLEVBQUU7QUFDTCxZQUFJLEVBQUUsUUFBUTtPQUNmO0tBQ0Y7QUFDRCxnQkFBWSxFQUFFO0FBQ1osV0FBSyxFQUFFLG9CQUFvQjtBQUMzQixpQkFBVyxFQUFFLG1DQUFtQztBQUNoRCxpQkFBUyxDQUFDO0FBQ1YsVUFBSSxFQUFFLFNBQVM7S0FDaEI7R0FDRjs7QUFFRCxVQUFRLEVBQUEsb0JBQUc7OztBQUNULFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENB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LENBQUMsQ0FBQztBQUNKLGFBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUNwRCxlQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ25DLGVBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbEMsYUFBSyxPQUFPLFVBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM3QixDQUFDLENBQUMsQ0FBQztBQUNKLFFBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztHQUNyQzs7QUFFRCxVQUFRLEVBQUEsb0JBQUc7OztBQUNULFFBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQ2xELFVBQUksQ0FBQyxPQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDN0IsZUFBTztPQUNSO0FBQ0QsVUFBTSxTQUFTLEdBQUcsT0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLGVBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbkMsZUFBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNsQyxhQUFLLE9BQU8sVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzdCLENBQUMsQ0FBQztHQUNKO0NBQ0YiLCJmaWxlIjoiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2JyYWNrZXQtY29sb3JpemVyL2xpYi9icmFja2V0LWNvbG9yaXplci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IEJyYWNrZXRNYXRjaGVyIGZyb20gJy4vYnJhY2tldC1tYXRjaGVyJztcbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgc3Vic2NyaXB0aW9uczogbnVsbCxcbiAgZWRpdG9yczogbnVsbCxcbiAgYnJhY2tldHM6IG51bGwsXG4gIGlnbm9yZWRfZmlsZXM6IG51bGwsXG4gIHJlcGVhdF9jb2xvcjogbnVsbCxcblxuICBjb25maWc6IHtcbiAgICBicmFja2V0czoge1xuICAgICAgdGl0bGU6ICdCcmFja2V0cyB0byBtYXRjaCcsXG4gICAgICBkZXNjcmlwdGlvbjogXCJTaG91bGQgYmUgbWF0Y2hpbmcgcGFpcnMgbGlrZSAnKCknLCBhbmQgJ3t9J1wiLFxuICAgICAgZGVmYXVsdDogWyd7fSddLFxuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfSxcbiAgICBpZ25vcmVkX2ZpbGVzOiB7XG4gICAgICB0aXRsZTogJ0lnbm9yZWQgZmlsZXMnLFxuICAgICAgZGVzY3JpcHRpb246ICdGaWxlcyB3aGljaCB3aWxsIG5vdCBiZSBjb2xvcml6ZWQnLFxuICAgICAgZGVmYXVsdDogWycqLm1kJywgJy4qJ10sXG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlcGVhdF9jb2xvcjoge1xuICAgICAgdGl0bGU6ICdSZXBlYXQgQ29sb3IgQ291bnQnLFxuICAgICAgZGVzY3JpcHRpb246ICdOdW1iZXIgb2YgY29sb3IgY2xhc3NlcyB0byByZXBlYXQnLFxuICAgICAgZGVmYXVsdDogOSxcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuZWRpdG9ycyA9IG5ldyBXZWFrTWFwKCk7XG4gICAgdGhpcy5icmFja2V0cyA9IGF0b20uY29uZmlnLmdldCgnYnJhY2tldC1jb2xvcml6ZXIuYnJhY2tldHMnKTtcbiAgICB0aGlzLmlnbm9yZWRfZmlsZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2JyYWNrZXQtY29sb3JpemVyLmlnbm9yZWRfZmlsZXMnKTtcbiAgICB0aGlzLnJlcGVhdF9jb2xvciA9IGF0b20uY29uZmlnLmdldCgnYnJhY2tldC1jb2xvcml6ZXIucmVwZWF0X2NvbG9yJyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9uRGlkU3RvcENoYW5naW5nQWN0aXZlUGFuZUl0ZW0oKCkgPT4gdGhpcy5wcm9jZXNzRWRpdG9yKCkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdicmFja2V0LWNvbG9yaXplci5icmFja2V0cycsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5icmFja2V0cyA9IHZhbHVlO1xuICAgICAgdGhpcy5jbGVhbkFsbCgpO1xuICAgICAgdGhpcy5wcm9jZXNzRWRpdG9yKCk7XG4gICAgfSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2JyYWNrZXQtY29sb3JpemVyLmlnbm9yZWRfZmlsZXMnLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuaWdub3JlZF9maWxlcyA9IHZhbHVlO1xuICAgICAgdGhpcy5jbGVhbkFsbCgpO1xuICAgICAgdGhpcy5wcm9jZXNzRWRpdG9yKCk7XG4gICAgfSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2JyYWNrZXQtY29sb3JpemVyLnJlcGVhdF9jb2xvcicsICh2YWx1ZSkgPT4ge1xuICAgICAgdGhpcy5yZXBlYXRfY29sb3IgPSB2YWx1ZTtcbiAgICAgIHRoaXMuY2xlYW5BbGwoKTtcbiAgICAgIHRoaXMucHJvY2Vzc0VkaXRvcigpO1xuICAgIH0pKTtcblxuICAgIHRoaXMucHJvY2Vzc0VkaXRvcigpO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5jbGVhbkFsbCgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvY2Vzc0VkaXRvcigpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgaWYgKCFlZGl0b3IgfHwgdGhpcy5lZGl0b3JzLmhhcyhlZGl0b3IpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGZpbGUgPSBlZGl0b3IuYnVmZmVyLmZpbGU7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChmaWxlLnBhdGgpIHtcbiAgICAgIGZvciAobGV0IG5hbWUgb2YgdGhpcy5pZ25vcmVkX2ZpbGVzKSB7XG4gICAgICAgIGlmIChtaW5pbWF0Y2gocGF0aC5iYXNlbmFtZShmaWxlLnBhdGgpLCBuYW1lKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvck9iaiA9IHtcbiAgICAgIHN1YnNjcmlwdGlvbnM6IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCksXG4gICAgICBicmFja2V0TWF0Y2hlcjogbmV3IEJyYWNrZXRNYXRjaGVyKGVkaXRvciwgdGhpcy5icmFja2V0cywgdGhpcy5yZXBlYXRfY29sb3IpLFxuICAgIH07XG4gICAgZWRpdG9yT2JqLnN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZygoKSA9PiB7XG4gICAgICBlZGl0b3JPYmouYnJhY2tldE1hdGNoZXIucmVmcmVzaCgpO1xuICAgIH0pKTtcbiAgICBlZGl0b3JPYmouc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLm9uRGlkVG9rZW5pemUoKCkgPT4ge1xuICAgICAgZWRpdG9yT2JqLmJyYWNrZXRNYXRjaGVyLnJlZnJlc2goKTtcbiAgICB9KSk7XG4gICAgZWRpdG9yT2JqLnN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgZWRpdG9yT2JqLmJyYWNrZXRNYXRjaGVyLmRlc3Ryb3koKTtcbiAgICAgIGVkaXRvck9iai5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuZWRpdG9ycy5kZWxldGUoZWRpdG9yKTtcbiAgICB9KSk7XG4gICAgdGhpcy5lZGl0b3JzLnNldChlZGl0b3IsIGVkaXRvck9iaik7XG4gIH0sXG5cbiAgY2xlYW5BbGwoKSB7XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoKChlZGl0b3IpID0+IHtcbiAgICAgIGlmICghdGhpcy5lZGl0b3JzLmhhcyhlZGl0b3IpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVkaXRvck9iaiA9IHRoaXMuZWRpdG9ycy5nZXQoZWRpdG9yKTtcbiAgICAgIGVkaXRvck9iai5icmFja2V0TWF0Y2hlci5kZXN0cm95KCk7XG4gICAgICBlZGl0b3JPYmouc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICB0aGlzLmVkaXRvcnMuZGVsZXRlKGVkaXRvcik7XG4gICAgfSk7XG4gIH1cbn07XG4iXX0=