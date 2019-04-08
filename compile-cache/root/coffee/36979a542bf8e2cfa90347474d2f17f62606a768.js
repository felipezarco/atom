(function() {
  var CompositeDisposable, DialogView, TextEditorView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), View = ref.View, TextEditorView = ref.TextEditorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = DialogView = (function(superClass) {
    extend(DialogView, superClass);

    function DialogView() {
      this.focusTextField = bind(this.focusTextField, this);
      this.setTargetFile = bind(this.setTargetFile, this);
      return DialogView.__super__.constructor.apply(this, arguments);
    }

    DialogView.content = function() {
      return this.div({
        tabIndex: -1,
        "class": 'padded rails-transporter'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": "block"
          }, function() {
            _this.label("No target file found. Enter the path for the file to open");
            return _this.subview('fileEditor', new TextEditorView({
              mini: true,
              placeholder: '/path/to/file'
            }));
          });
        };
      })(this));
    };

    DialogView.prototype.initialize = function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add(this.fileEditor.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.openFile();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return typeof _this.panel === "function" ? _this.panel(hide()) : void 0;
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add(this.element, {
        'core:close': (function(_this) {
          return function() {
            var ref1;
            return (ref1 = _this.panel) != null ? ref1.hide() : void 0;
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            var ref1;
            return (ref1 = _this.panel) != null ? ref1.hide() : void 0;
          };
        })(this)
      }));
    };

    DialogView.prototype.destroy = function() {
      var ref1;
      return (ref1 = this.subscriptions) != null ? ref1.dispose() : void 0;
    };

    DialogView.prototype.setPanel = function(panel) {
      this.panel = panel;
      return this.subscriptions.add(this.panel.onDidChangeVisible((function(_this) {
        return function(visible) {
          if (visible) {
            return _this.didShow();
          } else {
            return _this.didHide();
          }
        };
      })(this)));
    };

    DialogView.prototype.didShow = function() {};

    DialogView.prototype.didHide = function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      return workspaceElement.focus();
    };

    DialogView.prototype.openFile = function() {
      var ref1;
      atom.workspace.open(this.fileEditor.getText());
      return (ref1 = this.panel) != null ? ref1.hide() : void 0;
    };

    DialogView.prototype.setTargetFile = function(path) {
      var currentFile, projectPath;
      if (path != null) {
        projectPath = atom.project.relativizePath(path);
      } else {
        currentFile = atom.workspace.getActiveTextEditor().getPath();
        projectPath = atom.project.relativizePath(currentFile);
      }
      return this.fileEditor.setText(projectPath[1]);
    };

    DialogView.prototype.focusTextField = function() {
      return this.fileEditor.focus();
    };

    return DialogView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3JhaWxzLXRyYW5zcG9ydGVyL2xpYi9kaWFsb2ctdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7Ozs7RUFBQSxNQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxlQUFELEVBQU87O0VBQ04sc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7Ozs7SUFDSixVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsUUFBQSxFQUFVLENBQUMsQ0FBWDtRQUFjLENBQUEsS0FBQSxDQUFBLEVBQU8sMEJBQXJCO09BQUwsRUFBc0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNwRCxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQTtZQUNuQixLQUFDLENBQUEsS0FBRCxDQUFPLDJEQUFQO21CQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUF1QixJQUFJLGNBQUosQ0FBbUI7Y0FBQSxJQUFBLEVBQU0sSUFBTjtjQUFZLFdBQUEsRUFBYSxlQUF6QjthQUFuQixDQUF2QjtVQUZtQixDQUFyQjtRQURvRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQ7SUFEUTs7eUJBTVYsVUFBQSxHQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BRXJCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUE5QixFQUNqQjtRQUFBLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsUUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO1FBQ0EsYUFBQSxFQUFlLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7dURBQUcsS0FBQyxDQUFBLE1BQU0sSUFBQSxDQUFBO1VBQVY7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGY7T0FEaUIsQ0FBbkI7YUFJQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUNqQjtRQUFBLFlBQUEsRUFBYyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQUcsZ0JBQUE7c0RBQU0sQ0FBRSxJQUFSLENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZDtRQUNBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQUcsZ0JBQUE7c0RBQU0sQ0FBRSxJQUFSLENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEZjtPQURpQixDQUFuQjtJQVBVOzt5QkFXWixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7dURBQWMsQ0FBRSxPQUFoQixDQUFBO0lBRE87O3lCQUdULFFBQUEsR0FBVSxTQUFDLEtBQUQ7TUFBQyxJQUFDLENBQUEsUUFBRDthQUNULElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsS0FBSyxDQUFDLGtCQUFQLENBQTBCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO1VBQzNDLElBQUcsT0FBSDttQkFBZ0IsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUFoQjtXQUFBLE1BQUE7bUJBQWdDLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBaEM7O1FBRDJDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUFuQjtJQURROzt5QkFJVixPQUFBLEdBQVMsU0FBQSxHQUFBOzt5QkFHVCxPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO2FBQ25CLGdCQUFnQixDQUFDLEtBQWpCLENBQUE7SUFGTzs7eUJBSVQsUUFBQSxHQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQXBCOytDQUNNLENBQUUsSUFBUixDQUFBO0lBRlE7O3lCQUlWLGFBQUEsR0FBZSxTQUFDLElBQUQ7QUFDYixVQUFBO01BQUEsSUFBRyxZQUFIO1FBQ0UsV0FBQSxHQUFjLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixJQUE1QixFQURoQjtPQUFBLE1BQUE7UUFHRSxXQUFBLEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQW9DLENBQUMsT0FBckMsQ0FBQTtRQUNkLFdBQUEsR0FBYyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsV0FBNUIsRUFKaEI7O2FBTUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLFdBQVksQ0FBQSxDQUFBLENBQWhDO0lBUGE7O3lCQVNmLGNBQUEsR0FBZ0IsU0FBQTthQUNkLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixDQUFBO0lBRGM7Ozs7S0E3Q087QUFKekIiLCJzb3VyY2VzQ29udGVudCI6WyJ7VmlldywgVGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBEaWFsb2dWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IHRhYkluZGV4OiAtMSwgY2xhc3M6ICdwYWRkZWQgcmFpbHMtdHJhbnNwb3J0ZXInLCA9PlxuICAgICAgQGRpdiBjbGFzczogXCJibG9ja1wiLCA9PlxuICAgICAgICBAbGFiZWwgXCJObyB0YXJnZXQgZmlsZSBmb3VuZC4gRW50ZXIgdGhlIHBhdGggZm9yIHRoZSBmaWxlIHRvIG9wZW5cIlxuICAgICAgICBAc3VidmlldyAnZmlsZUVkaXRvcicsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlLCBwbGFjZWhvbGRlcjogJy9wYXRoL3RvL2ZpbGUnKVxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIFxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBAZmlsZUVkaXRvci5lbGVtZW50LFxuICAgICAgJ2NvcmU6Y29uZmlybSc6ID0+IEBvcGVuRmlsZSgpXG4gICAgICAnY29yZTpjYW5jZWwnOiA9PiBAcGFuZWw/aGlkZSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgQGVsZW1lbnQsXG4gICAgICAnY29yZTpjbG9zZSc6ID0+IEBwYW5lbD8uaGlkZSgpXG4gICAgICAnY29yZTpjYW5jZWwnOiA9PiBAcGFuZWw/LmhpZGUoKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuXG4gIHNldFBhbmVsOiAoQHBhbmVsKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZWwub25EaWRDaGFuZ2VWaXNpYmxlICh2aXNpYmxlKSA9PlxuICAgICAgaWYgdmlzaWJsZSB0aGVuIEBkaWRTaG93KCkgZWxzZSBAZGlkSGlkZSgpXG4gICAgICBcbiAgZGlkU2hvdzogLT5cbiAgICAjIHRvZG9cblxuICBkaWRIaWRlOiAtPlxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgd29ya3NwYWNlRWxlbWVudC5mb2N1cygpXG4gICAgXG4gIG9wZW5GaWxlOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oQGZpbGVFZGl0b3IuZ2V0VGV4dCgpKVxuICAgIEBwYW5lbD8uaGlkZSgpXG4gICAgXG4gIHNldFRhcmdldEZpbGU6IChwYXRoKSA9PlxuICAgIGlmIHBhdGg/XG4gICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwYXRoKVxuICAgIGVsc2VcbiAgICAgIGN1cnJlbnRGaWxlID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKVxuICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoY3VycmVudEZpbGUpXG4gICAgICBcbiAgICBAZmlsZUVkaXRvci5zZXRUZXh0KHByb2plY3RQYXRoWzFdKVxuXG4gIGZvY3VzVGV4dEZpZWxkOiA9PlxuICAgIEBmaWxlRWRpdG9yLmZvY3VzKClcbiJdfQ==
