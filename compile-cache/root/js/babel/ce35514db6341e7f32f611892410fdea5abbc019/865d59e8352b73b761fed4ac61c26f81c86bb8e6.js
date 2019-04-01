Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utilBlameGutter = require('./util/BlameGutter');

var _utilBlameGutter2 = _interopRequireDefault(_utilBlameGutter);

/**
 * Main Package Module
 */
'use babel';

exports['default'] = {

  config: _config2['default'],

  disposables: null,
  gutters: null,

  activate: function activate() {
    this.gutters = new Map();
    this.disposables = new _atom.CompositeDisposable();
    this.disposables.add(atom.commands.add('atom-workspace', {
      'git-blame:toggle': this.toggle.bind(this)
    }));
  },

  deactivate: function deactivate() {
    this.disposables.dispose();
    this.gutters.clear();
  },

  toggle: function toggle() {
    var editor = atom.workspace.getActiveTextEditor();

    // if there is no active text editor, git-blame can do nothing
    if (!editor) {
      return;
    }

    // get a BlameGutter from the cache or create a new one and add
    // it to the cache.
    var gutter = this.gutters.get(editor);
    if (!gutter) {
      gutter = new _utilBlameGutter2['default'](editor);
      this.disposables.add(gutter);
      this.gutters.set(editor, gutter);
    }

    // toggle visiblity of the active gutter
    gutter.toggleVisibility()['catch'](function (e) {
      console.error(e); // eslint-disable-line no-console
    });
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFb0MsTUFBTTs7c0JBRXZCLFVBQVU7Ozs7K0JBQ0wsb0JBQW9COzs7Ozs7O0FBTDVDLFdBQVcsQ0FBQzs7cUJBVUc7O0FBRWIsUUFBTSxxQkFBQTs7QUFFTixhQUFXLEVBQUUsSUFBSTtBQUNqQixTQUFPLEVBQUUsSUFBSTs7QUFFYixVQUFRLEVBQUEsb0JBQUc7QUFDVCxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDekIsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQztBQUM3QyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN2RCx3QkFBa0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDM0MsQ0FBQyxDQUFDLENBQUM7R0FDTDs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzNCLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDdEI7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO0FBQ1AsUUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOzs7QUFHcEQsUUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLGFBQU87S0FDUjs7OztBQUlELFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWCxZQUFNLEdBQUcsaUNBQWdCLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNsQzs7O0FBR0QsVUFBTSxDQUFDLGdCQUFnQixFQUFFLFNBQ2pCLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDWixhQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xCLENBQUMsQ0FBQztHQUNOOztDQUVGIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgQmxhbWVHdXR0ZXIgZnJvbSAnLi91dGlsL0JsYW1lR3V0dGVyJztcblxuLyoqXG4gKiBNYWluIFBhY2thZ2UgTW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcblxuICBjb25maWcsXG5cbiAgZGlzcG9zYWJsZXM6IG51bGwsXG4gIGd1dHRlcnM6IG51bGwsXG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5ndXR0ZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdnaXQtYmxhbWU6dG9nZ2xlJzogdGhpcy50b2dnbGUuYmluZCh0aGlzKSxcbiAgICB9KSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmd1dHRlcnMuY2xlYXIoKTtcbiAgfSxcblxuICB0b2dnbGUoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gICAgLy8gaWYgdGhlcmUgaXMgbm8gYWN0aXZlIHRleHQgZWRpdG9yLCBnaXQtYmxhbWUgY2FuIGRvIG5vdGhpbmdcbiAgICBpZiAoIWVkaXRvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGdldCBhIEJsYW1lR3V0dGVyIGZyb20gdGhlIGNhY2hlIG9yIGNyZWF0ZSBhIG5ldyBvbmUgYW5kIGFkZFxuICAgIC8vIGl0IHRvIHRoZSBjYWNoZS5cbiAgICBsZXQgZ3V0dGVyID0gdGhpcy5ndXR0ZXJzLmdldChlZGl0b3IpO1xuICAgIGlmICghZ3V0dGVyKSB7XG4gICAgICBndXR0ZXIgPSBuZXcgQmxhbWVHdXR0ZXIoZWRpdG9yKTtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGd1dHRlcik7XG4gICAgICB0aGlzLmd1dHRlcnMuc2V0KGVkaXRvciwgZ3V0dGVyKTtcbiAgICB9XG5cbiAgICAvLyB0b2dnbGUgdmlzaWJsaXR5IG9mIHRoZSBhY3RpdmUgZ3V0dGVyXG4gICAgZ3V0dGVyLnRvZ2dsZVZpc2liaWxpdHkoKVxuICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgfSk7XG4gIH0sXG5cbn07XG4iXX0=