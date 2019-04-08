(function() {
  var $$, BaseFinderView, SelectListView, fs, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require('path');

  fs = require('fs');

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  module.exports = BaseFinderView = (function(superClass) {
    extend(BaseFinderView, superClass);

    function BaseFinderView() {
      return BaseFinderView.__super__.constructor.apply(this, arguments);
    }

    BaseFinderView.prototype.displayFiles = [];

    BaseFinderView.prototype.initialize = function() {
      BaseFinderView.__super__.initialize.apply(this, arguments);
      this.addClass('overlay from-top');
      return atom.commands.add(this.element, {
        'pane:split-left': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitLeft({
                items: [item]
              });
            });
          };
        })(this),
        'pane:split-right': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitRight({
                items: [item]
              });
            });
          };
        })(this),
        'pane:split-down': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitDown({
                items: [item]
              });
            });
          };
        })(this),
        'pane:split-up': (function(_this) {
          return function() {
            return _this.splitOpenPath(function(pane, item) {
              return pane.splitUp({
                items: [item]
              });
            });
          };
        })(this)
      });
    };

    BaseFinderView.prototype.destroy = function() {
      var ref1;
      this.cancel();
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    BaseFinderView.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div(path.basename(item), {
              "class": "primary-line file icon icon-file-text"
            });
            return _this.div(atom.project.relativize(item), {
              "class": 'secondary-line path no-icon'
            });
          };
        })(this));
      });
    };

    BaseFinderView.prototype.confirmed = function(item) {
      return atom.workspace.open(item);
    };

    BaseFinderView.prototype.toggle = function() {
      var ref1, ref2;
      if ((ref1 = this.panel) != null ? ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        this.populate();
        if (((ref2 = this.displayFiles) != null ? ref2.length : void 0) > 0) {
          return this.show();
        }
      }
    };

    BaseFinderView.prototype.show = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    BaseFinderView.prototype.splitOpenPath = function(fn) {
      var filePath, pane, ref1;
      filePath = (ref1 = this.getSelectedItem()) != null ? ref1 : {};
      if (!filePath) {
        return;
      }
      if (pane = atom.workspace.getActivePane()) {
        return atom.project.open(filePath).done((function(_this) {
          return function(editor) {
            return fn(pane, editor);
          };
        })(this));
      } else {
        return atom.workspace.open(filePath);
      }
    };

    BaseFinderView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.hide() : void 0;
    };

    BaseFinderView.prototype.cancelled = function() {
      return this.hide();
    };

    return BaseFinderView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3JhaWxzLXRyYW5zcG9ydGVyL2xpYi9iYXNlLWZpbmRlci12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsaURBQUE7SUFBQTs7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxNQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxXQUFELEVBQUs7O0VBR0wsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozs2QkFDSixZQUFBLEdBQWM7OzZCQUVkLFVBQUEsR0FBWSxTQUFBO01BQ1YsZ0RBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsa0JBQVY7YUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLE9BQW5CLEVBQ0U7UUFBQSxpQkFBQSxFQUFtQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNqQixLQUFDLENBQUEsYUFBRCxDQUFlLFNBQUMsSUFBRCxFQUFPLElBQVA7cUJBQWdCLElBQUksQ0FBQyxTQUFMLENBQWU7Z0JBQUEsS0FBQSxFQUFPLENBQUMsSUFBRCxDQUFQO2VBQWY7WUFBaEIsQ0FBZjtVQURpQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkI7UUFFQSxrQkFBQSxFQUFvQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNsQixLQUFDLENBQUEsYUFBRCxDQUFlLFNBQUMsSUFBRCxFQUFPLElBQVA7cUJBQWdCLElBQUksQ0FBQyxVQUFMLENBQWdCO2dCQUFBLEtBQUEsRUFBTyxDQUFDLElBQUQsQ0FBUDtlQUFoQjtZQUFoQixDQUFmO1VBRGtCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZwQjtRQUlBLGlCQUFBLEVBQW1CLENBQUEsU0FBQSxLQUFBO2lC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SUFBRCxDQUFBO0lBRFM7Ozs7S0F4RGdCO0FBTjdCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xueyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBCYXNlRmluZGVyVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGRpc3BsYXlGaWxlczogW11cbiAgXG4gIGluaXRpYWxpemU6IC0+XG4gICAgc3VwZXJcbiAgICBAYWRkQ2xhc3MoJ292ZXJsYXkgZnJvbS10b3AnKVxuICAgICAgICBcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBAZWxlbWVudCxcbiAgICAgICdwYW5lOnNwbGl0LWxlZnQnOiA9PlxuICAgICAgICBAc3BsaXRPcGVuUGF0aCAocGFuZSwgaXRlbSkgLT4gcGFuZS5zcGxpdExlZnQoaXRlbXM6IFtpdGVtXSlcbiAgICAgICdwYW5lOnNwbGl0LXJpZ2h0JzogPT5cbiAgICAgICAgQHNwbGl0T3BlblBhdGggKHBhbmUsIGl0ZW0pIC0+IHBhbmUuc3BsaXRSaWdodChpdGVtczogW2l0ZW1dKVxuICAgICAgJ3BhbmU6c3BsaXQtZG93bic6ID0+XG4gICAgICAgIEBzcGxpdE9wZW5QYXRoIChwYW5lLCBpdGVtKSAtPiBwYW5lLnNwbGl0RG93bihpdGVtczogW2l0ZW1dKVxuICAgICAgJ3BhbmU6c3BsaXQtdXAnOiA9PlxuICAgICAgICBAc3BsaXRPcGVuUGF0aCAocGFuZSwgaXRlbSkgLT4gcGFuZS5zcGxpdFVwKGl0ZW1zOiBbaXRlbV0pXG4gICAgXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGNhbmNlbCgpXG4gICAgQHBhbmVsPy5kZXN0cm95KClcbiAgICBcbiAgdmlld0Zvckl0ZW06IChpdGVtKSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgY2xhc3M6ICd0d28tbGluZXMnLCA9PlxuICAgICAgICBAZGl2IHBhdGguYmFzZW5hbWUoaXRlbSksIGNsYXNzOiBcInByaW1hcnktbGluZSBmaWxlIGljb24gaWNvbi1maWxlLXRleHRcIlxuICAgICAgICBAZGl2IGF0b20ucHJvamVjdC5yZWxhdGl2aXplKGl0ZW0pLCBjbGFzczogJ3NlY29uZGFyeS1saW5lIHBhdGggbm8taWNvbidcbiAgXG4gIGNvbmZpcm1lZDogKGl0ZW0pIC0+XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBpdGVtXG4gICAgXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAcGFuZWw/LmlzVmlzaWJsZSgpXG4gICAgICBAY2FuY2VsKClcbiAgICBlbHNlXG4gICAgICBAcG9wdWxhdGUoKVxuICAgICAgQHNob3coKSBpZiBAZGlzcGxheUZpbGVzPy5sZW5ndGggPiAwXG4gICAgICBcbiAgc2hvdzogLT5cbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBzcGxpdE9wZW5QYXRoOiAoZm4pIC0+XG4gICAgZmlsZVBhdGggPSBAZ2V0U2VsZWN0ZWRJdGVtKCkgPyB7fVxuICAgIHJldHVybiB1bmxlc3MgZmlsZVBhdGhcblxuICAgIGlmIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgIGF0b20ucHJvamVjdC5vcGVuKGZpbGVQYXRoKS5kb25lIChlZGl0b3IpID0+XG4gICAgICAgIGZuKHBhbmUsIGVkaXRvcilcbiAgICBlbHNlXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGVQYXRoXG5cbiAgaGlkZTogLT5cbiAgICBAcGFuZWw/LmhpZGUoKVxuXG4gIGNhbmNlbGxlZDogLT5cbiAgICBAaGlkZSgpXG4iXX0=
