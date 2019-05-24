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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3phcmNvLy5hdG9tL3BhY2thZ2VzL2JyYWNrZXQtY29sb3JpemVyL2xpYi9icmFja2V0LWNvbG9yaXplci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFb0MsTUFBTTs7OEJBQ2YsbUJBQW1COzs7O3lCQUN4QixXQUFXOzs7O29CQUNoQixNQUFNOzs7O3FCQUVSOztBQUViLGVBQWEsRUFBRSxJQUFJO0FBQ25CLFNBQU8sRUFBRSxJQUFJO0FBQ2IsVUFBUSxFQUFFLElBQUk7QUFDZCxlQUFhLEVBQUUsSUFBSTtBQUNuQixjQUFZLEVBQUUsSUFBSTs7QUFFbEIsUUFBTSxFQUFFO0FBQ04sWUFBUSxFQUFFO0FBQ1IsV0FBSyxFQUFFLG1CQUFtQjtBQUMxQixpQkFBVyxFQUFFLDhDQUE4QztBQUMzRCxpQkFBUyxDQUFDLElBQUksQ0FBQztBQUNmLFVBQUksRUFBRSxPQUFPO0FBQ2IsV0FBSyxFQUFFO0FBQ0wsWUFBSSxFQUFFLFFBQVE7T0FDZjtLQUNGO0FBQ0QsaUJBQWEsRUFBRTtBQUNiLFdBQUssRUFBRSxlQUFlO0FBQ3RCLGlCQUFXLEVBQUUsbUNBQW1DO0FBQ2hELGlCQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztBQUN2QixVQUFJLEVBQUUsT0FBTztBQUNiLFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtBQUNELGdCQUFZLEVBQUU7QUFDWixXQUFLLEVBQUUsb0JBQW9CO0FBQzNCLGlCQUFXLEVBQUUsbUNBQW1DO0FBQ2hELGlCQUFTLENBQUM7QUFDVixVQUFJLEVBQUUsU0FBUztLQUNoQjtHQUNGOztBQUVELFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDN0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FB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Q0FBQyxDQUFDO0FBQ0osYUFBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQ3BELGVBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbkMsZUFBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNsQyxhQUFLLE9BQU8sVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzdCLENBQUMsQ0FBQyxDQUFDO0FBQ0osUUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0dBQ3JDOztBQUVELFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDbEQsVUFBSSxDQUFDLE9BQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUM3QixlQUFPO09BQ1I7QUFDRCxVQUFNLFNBQVMsR0FBRyxPQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsZUFBUyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNuQyxlQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xDLGFBQUssT0FBTyxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDN0IsQ0FBQyxDQUFDO0dBQ0o7Q0FDRiIsImZpbGUiOiIvaG9tZS96YXJjby8uYXRvbS9wYWNrYWdlcy9icmFja2V0LWNvbG9yaXplci9saWIvYnJhY2tldC1jb2xvcml6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBCcmFja2V0TWF0Y2hlciBmcm9tICcuL2JyYWNrZXQtbWF0Y2hlcic7XG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIGVkaXRvcnM6IG51bGwsXG4gIGJyYWNrZXRzOiBudWxsLFxuICBpZ25vcmVkX2ZpbGVzOiBudWxsLFxuICByZXBlYXRfY29sb3I6IG51bGwsXG5cbiAgY29uZmlnOiB7XG4gICAgYnJhY2tldHM6IHtcbiAgICAgIHRpdGxlOiAnQnJhY2tldHMgdG8gbWF0Y2gnLFxuICAgICAgZGVzY3JpcHRpb246IFwiU2hvdWxkIGJlIG1hdGNoaW5nIHBhaXJzIGxpa2UgJygpJywgYW5kICd7fSdcIixcbiAgICAgIGRlZmF1bHQ6IFsne30nXSxcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIH0sXG4gICAgaWdub3JlZF9maWxlczoge1xuICAgICAgdGl0bGU6ICdJZ25vcmVkIGZpbGVzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRmlsZXMgd2hpY2ggd2lsbCBub3QgYmUgY29sb3JpemVkJyxcbiAgICAgIGRlZmF1bHQ6IFsnKi5tZCcsICcuKiddLFxuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfSxcbiAgICByZXBlYXRfY29sb3I6IHtcbiAgICAgIHRpdGxlOiAnUmVwZWF0IENvbG9yIENvdW50JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTnVtYmVyIG9mIGNvbG9yIGNsYXNzZXMgdG8gcmVwZWF0JyxcbiAgICAgIGRlZmF1bHQ6IDksXG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICB9XG4gIH0sXG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLmVkaXRvcnMgPSBuZXcgV2Vha01hcCgpO1xuICAgIHRoaXMuYnJhY2tldHMgPSBhdG9tLmNvbmZpZy5nZXQoJ2JyYWNrZXQtY29sb3JpemVyLmJyYWNrZXRzJyk7XG4gICAgdGhpcy5pZ25vcmVkX2ZpbGVzID0gYXRvbS5jb25maWcuZ2V0KCdicmFja2V0LWNvbG9yaXplci5pZ25vcmVkX2ZpbGVzJyk7XG4gICAgdGhpcy5yZXBlYXRfY29sb3IgPSBhdG9tLmNvbmZpZy5nZXQoJ2JyYWNrZXQtY29sb3JpemVyLnJlcGVhdF9jb2xvcicpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtKCgpID0+IHRoaXMucHJvY2Vzc0VkaXRvcigpKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYnJhY2tldC1jb2xvcml6ZXIuYnJhY2tldHMnLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMuYnJhY2tldHMgPSB2YWx1ZTtcbiAgICAgIHRoaXMuY2xlYW5BbGwoKTtcbiAgICAgIHRoaXMucHJvY2Vzc0VkaXRvcigpO1xuICAgIH0pKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdicmFja2V0LWNvbG9yaXplci5pZ25vcmVkX2ZpbGVzJywgKHZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmlnbm9yZWRfZmlsZXMgPSB2YWx1ZTtcbiAgICAgIHRoaXMuY2xlYW5BbGwoKTtcbiAgICAgIHRoaXMucHJvY2Vzc0VkaXRvcigpO1xuICAgIH0pKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdicmFja2V0LWNvbG9yaXplci5yZXBlYXRfY29sb3InLCAodmFsdWUpID0+IHtcbiAgICAgIHRoaXMucmVwZWF0X2NvbG9yID0gdmFsdWU7XG4gICAgICB0aGlzLmNsZWFuQWxsKCk7XG4gICAgICB0aGlzLnByb2Nlc3NFZGl0b3IoKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLnByb2Nlc3NFZGl0b3IoKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuY2xlYW5BbGwoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIHByb2Nlc3NFZGl0b3IoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGlmICghZWRpdG9yIHx8IHRoaXMuZWRpdG9ycy5oYXMoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmaWxlID0gZWRpdG9yLmJ1ZmZlci5maWxlO1xuICAgIGlmICghZmlsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZmlsZS5wYXRoKSB7XG4gICAgICBmb3IgKGxldCBuYW1lIG9mIHRoaXMuaWdub3JlZF9maWxlcykge1xuICAgICAgICBpZiAobWluaW1hdGNoKHBhdGguYmFzZW5hbWUoZmlsZS5wYXRoKSwgbmFtZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3JPYmogPSB7XG4gICAgICBzdWJzY3JpcHRpb25zOiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpLFxuICAgICAgYnJhY2tldE1hdGNoZXI6IG5ldyBCcmFja2V0TWF0Y2hlcihlZGl0b3IsIHRoaXMuYnJhY2tldHMsIHRoaXMucmVwZWF0X2NvbG9yKSxcbiAgICB9O1xuICAgIGVkaXRvck9iai5zdWJzY3JpcHRpb25zLmFkZChlZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcoKCkgPT4ge1xuICAgICAgZWRpdG9yT2JqLmJyYWNrZXRNYXRjaGVyLnJlZnJlc2goKTtcbiAgICB9KSk7XG4gICAgZWRpdG9yT2JqLnN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5vbkRpZFRva2VuaXplKCgpID0+IHtcbiAgICAgIGVkaXRvck9iai5icmFja2V0TWF0Y2hlci5yZWZyZXNoKCk7XG4gICAgfSkpO1xuICAgIGVkaXRvck9iai5zdWJzY3JpcHRpb25zLmFkZChlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIGVkaXRvck9iai5icmFja2V0TWF0Y2hlci5kZXN0cm95KCk7XG4gICAgICBlZGl0b3JPYmouc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICB0aGlzLmVkaXRvcnMuZGVsZXRlKGVkaXRvcik7XG4gICAgfSkpO1xuICAgIHRoaXMuZWRpdG9ycy5zZXQoZWRpdG9yLCBlZGl0b3JPYmopO1xuICB9LFxuXG4gIGNsZWFuQWxsKCkge1xuICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaCgoZWRpdG9yKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZWRpdG9ycy5oYXMoZWRpdG9yKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlZGl0b3JPYmogPSB0aGlzLmVkaXRvcnMuZ2V0KGVkaXRvcik7XG4gICAgICBlZGl0b3JPYmouYnJhY2tldE1hdGNoZXIuZGVzdHJveSgpO1xuICAgICAgZWRpdG9yT2JqLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5lZGl0b3JzLmRlbGV0ZShlZGl0b3IpO1xuICAgIH0pO1xuICB9XG59O1xuIl19