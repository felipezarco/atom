Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _configSchema = require('./config-schema');

var _configSchema2 = _interopRequireDefault(_configSchema);

var _toggleQuotes = require('./toggle-quotes');

'use babel';

exports['default'] = {
  config: _configSchema2['default'],

  activate: function activate() {
    this.subscription = atom.commands.add('atom-text-editor', 'toggle-quotes:toggle', function () {
      var editor = atom.workspace.getActiveTextEditor();
      if (editor) {
        (0, _toggleQuotes.toggleQuotes)(editor);
      }
    });
  },

  deactivate: function deactivate() {
    this.subscription.dispose();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs0QkFFeUIsaUJBQWlCOzs7OzRCQUNmLGlCQUFpQjs7QUFINUMsV0FBVyxDQUFBOztxQkFLSTtBQUNiLFFBQU0sMkJBQWM7O0FBRXBCLFVBQVEsRUFBQyxvQkFBRztBQUNWLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsc0JBQXNCLEVBQUUsWUFBTTtBQUN0RixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDakQsVUFBSSxNQUFNLEVBQUU7QUFDVix3Q0FBYSxNQUFNLENBQUMsQ0FBQTtPQUNyQjtLQUNGLENBQUMsQ0FBQTtHQUNIOztBQUVELFlBQVUsRUFBQyxzQkFBRztBQUNaLFFBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDNUI7Q0FDRiIsImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvdG9nZ2xlLXF1b3Rlcy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBjb25maWdTY2hlbWEgZnJvbSAnLi9jb25maWctc2NoZW1hJ1xuaW1wb3J0IHt0b2dnbGVRdW90ZXN9IGZyb20gJy4vdG9nZ2xlLXF1b3RlcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IGNvbmZpZ1NjaGVtYSxcblxuICBhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICd0b2dnbGUtcXVvdGVzOnRvZ2dsZScsICgpID0+IHtcbiAgICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgdG9nZ2xlUXVvdGVzKGVkaXRvcilcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGRlYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=