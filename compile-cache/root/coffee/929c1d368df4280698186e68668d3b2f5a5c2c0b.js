(function() {
  var SelectListView;

  SelectListView = require("atom-select-list");

  module.exports = {
    init: function(pluginRegistry) {
      this.pluginRegistry = pluginRegistry;
      this.selectListView = new SelectListView({
        emptyMessage: 'No plugins in the registry.',
        itemsClassList: ['mark-active'],
        items: [],
        filterKeyForItem: function(item) {
          return item.title + item.description;
        },
        elementForItem: (function(_this) {
          return function(item) {
            var element, html;
            element = document.createElement('li');
            if (_this.pluginRegistry.enabledPlugins[item.code] != null) {
              element.classList.add('active');
            }
            html = "<b>" + item.title + "</b>";
            if (item.description) {
              html += "<b>:</b> " + item.description;
            }
            if (item.image) {
              html += "<img src=\"" + item.image + "\">";
            }
            element.innerHTML = html;
            return element;
          };
        })(this),
        didConfirmSelection: (function(_this) {
          return function(item) {
            return _this.pluginRegistry.togglePlugin(item.code);
          };
        })(this),
        didCancelSelection: (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this)
      });
      return this.selectListView.element.classList.add('plugin-list');
    },
    dispose: function() {
      this.cancel();
      return this.selectListView.destroy();
    },
    cancel: function() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      this.panel = null;
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        return this.previouslyFocusedElement = null;
      }
    },
    attach: function() {
      this.previouslyFocusedElement = document.activeElement;
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this.selectListView
        });
      }
      this.selectListView.focus();
      return this.selectListView.reset();
    },
    toggle: function() {
      var code, plugin, plugins, ref;
      if (this.panel != null) {
        return this.cancel();
      } else {
        plugins = [];
        ref = this.pluginRegistry.plugins;
        for (code in ref) {
          plugin = ref[code];
          plugins.push({
            code: code,
            title: plugin.title ? plugin.title : code,
            description: plugin.description,
            image: plugin.image
          });
        }
        this.selectListView.update({
          items: plugins
        });
        return this.attach();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi1saXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsa0JBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxJQUFBLEVBQU0sU0FBQyxjQUFEO01BQ0osSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBSSxjQUFKLENBQW1CO1FBQ25DLFlBQUEsRUFBYyw2QkFEcUI7UUFFbkMsY0FBQSxFQUFnQixDQUFDLGFBQUQsQ0FGbUI7UUFHbkMsS0FBQSxFQUFPLEVBSDRCO1FBSW5DLGdCQUFBLEVBQWtCLFNBQUMsSUFBRDtpQkFBVSxJQUFJLENBQUMsS0FBTCxHQUFhLElBQUksQ0FBQztRQUE1QixDQUppQjtRQUtuQyxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsSUFBRDtBQUNkLGdCQUFBO1lBQUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCO1lBQ1YsSUFBRyxzREFBSDtjQUNFLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsUUFBdEIsRUFERjs7WUFFQSxJQUFBLEdBQU8sS0FBQSxHQUFNLElBQUksQ0FBQyxLQUFYLEdBQWlCO1lBQ3hCLElBQTBDLElBQUksQ0FBQyxXQUEvQztjQUFBLElBQUEsSUFBUSxXQUFBLEdBQVksSUFBSSxDQUFDLFlBQXpCOztZQUNBLElBQXlDLElBQUksQ0FBQyxLQUE5QztjQUFBLElBQUEsSUFBUSxhQUFBLEdBQWMsSUFBSSxDQUFDLEtBQW5CLEdBQXlCLE1BQWpDOztZQUNBLE9BQU8sQ0FBQyxTQUFSLEdBQW9CO21CQUNwQjtVQVJjO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxtQjtRQWNuQyxtQkFBQSxFQUFxQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLElBQUQ7bUJBQ25CLEtBQUMsQ0FBQSxjQUFjLENBQUMsWUFBaEIsQ0FBNkIsSUFBSSxDQUFDLElBQWxDO1VBRG1CO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWRjO1FBZ0JuQyxrQkFBQSxFQUFvQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNsQixLQUFDLENBQUEsTUFBRCxDQUFBO1VBRGtCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWhCZTtPQUFuQjthQW1CbEIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQWxDLENBQXNDLGFBQXRDO0lBckJJLENBQU47SUF1QkEsT0FBQSxFQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsTUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxPQUFoQixDQUFBO0lBRk8sQ0F2QlQ7SUEyQkEsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFHLGtCQUFIO1FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUEsRUFERjs7TUFFQSxJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBRyxJQUFDLENBQUEsd0JBQUo7UUFDRSxJQUFDLENBQUEsd0JBQXdCLENBQUMsS0FBMUIsQ0FBQTtlQUNBLElBQUMsQ0FBQSx3QkFBRCxHQUE0QixLQUY5Qjs7SUFKTSxDQTNCUjtJQW1DQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSx3QkFBRCxHQUE0QixRQUFRLENBQUM7TUFDckMsSUFBTyxrQkFBUDtRQUNFLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUMsSUFBQSxFQUFNLElBQUMsQ0FBQSxjQUFSO1NBQTdCLEVBRFg7O01BRUEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxLQUFoQixDQUFBO2FBQ0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxLQUFoQixDQUFBO0lBTE0sQ0FuQ1I7SUEwQ0EsTUFBQSxFQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsSUFBRyxrQkFBSDtlQUNFLElBQUMsQ0FBQSxNQUFELENBQUEsRUFERjtPQUFBLE1BQUE7UUFHRSxPQUFBLEdBQVU7QUFDVjtBQUFBLGFBQUEsV0FBQTs7VUFDRSxPQUFPLENBQUMsSUFBUixDQUFhO1lBQ1gsSUFBQSxFQUFNLElBREs7WUFFWCxLQUFBLEVBQVUsTUFBTSxDQUFDLEtBQVYsR0FBcUIsTUFBTSxDQUFDLEtBQTVCLEdBQXVDLElBRm5DO1lBR1gsV0FBQSxFQUFhLE1BQU0sQ0FBQyxXQUhUO1lBSVgsS0FBQSxFQUFPLE1BQU0sQ0FBQyxLQUpIO1dBQWI7QUFERjtRQU9BLElBQUMsQ0FBQSxjQUFjLENBQUMsTUFBaEIsQ0FBdUI7VUFBQyxLQUFBLEVBQU8sT0FBUjtTQUF2QjtlQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFaRjs7SUFETSxDQTFDUjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIlNlbGVjdExpc3RWaWV3ID0gcmVxdWlyZSBcImF0b20tc2VsZWN0LWxpc3RcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGluaXQ6IChwbHVnaW5SZWdpc3RyeSkgLT5cbiAgICBAcGx1Z2luUmVnaXN0cnkgPSBwbHVnaW5SZWdpc3RyeVxuICAgIEBzZWxlY3RMaXN0VmlldyA9IG5ldyBTZWxlY3RMaXN0Vmlldyh7XG4gICAgICBlbXB0eU1lc3NhZ2U6ICdObyBwbHVnaW5zIGluIHRoZSByZWdpc3RyeS4nLFxuICAgICAgaXRlbXNDbGFzc0xpc3Q6IFsnbWFyay1hY3RpdmUnXSxcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IChpdGVtKSAtPiBpdGVtLnRpdGxlICsgaXRlbS5kZXNjcmlwdGlvbixcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiAoaXRlbSkgPT5cbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2xpJ1xuICAgICAgICBpZiBAcGx1Z2luUmVnaXN0cnkuZW5hYmxlZFBsdWdpbnNbaXRlbS5jb2RlXT9cbiAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQgJ2FjdGl2ZSdcbiAgICAgICAgaHRtbCA9IFwiPGI+I3tpdGVtLnRpdGxlfTwvYj5cIlxuICAgICAgICBodG1sICs9IFwiPGI+OjwvYj4gI3tpdGVtLmRlc2NyaXB0aW9ufVwiIGlmIGl0ZW0uZGVzY3JpcHRpb25cbiAgICAgICAgaHRtbCArPSBcIjxpbWcgc3JjPVxcXCIje2l0ZW0uaW1hZ2V9XFxcIj5cIiBpZiBpdGVtLmltYWdlXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbFxuICAgICAgICBlbGVtZW50XG4gICAgICBkaWRDb25maXJtU2VsZWN0aW9uOiAoaXRlbSkgPT5cbiAgICAgICAgQHBsdWdpblJlZ2lzdHJ5LnRvZ2dsZVBsdWdpbiBpdGVtLmNvZGVcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT5cbiAgICAgICAgQGNhbmNlbCgpXG4gICAgfSlcbiAgICBAc2VsZWN0TGlzdFZpZXcuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwbHVnaW4tbGlzdCcpXG5cbiAgZGlzcG9zZTogLT5cbiAgICBAY2FuY2VsKClcbiAgICBAc2VsZWN0TGlzdFZpZXcuZGVzdHJveSgpXG5cbiAgY2FuY2VsOiAtPlxuICAgIGlmIEBwYW5lbD9cbiAgICAgIEBwYW5lbC5kZXN0cm95KClcbiAgICBAcGFuZWwgPSBudWxsXG4gICAgaWYgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudFxuICAgICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpXG4gICAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbFxuXG4gIGF0dGFjaDogLT5cbiAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgIGlmIG5vdCBAcGFuZWw/XG4gICAgICBAcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtpdGVtOiBAc2VsZWN0TGlzdFZpZXd9KVxuICAgIEBzZWxlY3RMaXN0Vmlldy5mb2N1cygpXG4gICAgQHNlbGVjdExpc3RWaWV3LnJlc2V0KClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQHBhbmVsP1xuICAgICAgQGNhbmNlbCgpXG4gICAgZWxzZVxuICAgICAgcGx1Z2lucyA9IFtdXG4gICAgICBmb3IgY29kZSwgcGx1Z2luIG9mIEBwbHVnaW5SZWdpc3RyeS5wbHVnaW5zXG4gICAgICAgIHBsdWdpbnMucHVzaCh7XG4gICAgICAgICAgY29kZTogY29kZSxcbiAgICAgICAgICB0aXRsZTogaWYgcGx1Z2luLnRpdGxlIHRoZW4gcGx1Z2luLnRpdGxlIGVsc2UgY29kZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogcGx1Z2luLmRlc2NyaXB0aW9uXG4gICAgICAgICAgaW1hZ2U6IHBsdWdpbi5pbWFnZVxuICAgICAgICB9KVxuICAgICAgQHNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7aXRlbXM6IHBsdWdpbnN9KVxuICAgICAgQGF0dGFjaCgpXG4iXX0=
