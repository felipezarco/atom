(function() {
  var SelectListView;

  SelectListView = require("atom-select-list");

  module.exports = {
    init: function(colorHelper) {
      this.colorHelper = colorHelper;
      this.selectListView = new SelectListView({
        emptyMessage: 'No colors options.',
        itemsClassList: ['mark-active'],
        items: [],
        filterKeyForItem: function(item) {
          return item.value + item.description;
        },
        elementForItem: (function(_this) {
          return function(item) {
            var element, html;
            element = document.createElement('li');
            if (item.value === _this.currentColor) {
              element.classList.add('active');
            }
            html = "<b>" + item.description + "</b>";
            element.innerHTML = html;
            return element;
          };
        })(this),
        didConfirmSelection: (function(_this) {
          return function(item) {
            _this.cancel();
            return _this.colorHelper.selectColor(item.value);
          };
        })(this),
        didCancelSelection: (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this)
      });
      return this.selectListView.element.classList.add('color-list');
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
      this.currentColor = null;
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
      var colorSchema, colors, i, option, ref;
      if (this.panel != null) {
        return this.cancel();
      } else {
        this.currentColor = this.colorHelper.conf['type'];
        colors = [];
        colorSchema = atom.config.getSchema(this.colorHelper.key);
        ref = colorSchema.properties.type["enum"];
        for (i in ref) {
          option = ref[i];
          colors.push(option);
        }
        this.selectListView.update({
          items: colors
        });
        return this.attach();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2NvbG9yLWxpc3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxrQkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLElBQUEsRUFBTSxTQUFDLFdBQUQ7TUFDSixJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBSSxjQUFKLENBQW1CO1FBQ25DLFlBQUEsRUFBYyxvQkFEcUI7UUFFbkMsY0FBQSxFQUFnQixDQUFDLGFBQUQsQ0FGbUI7UUFHbkMsS0FBQSxFQUFPLEVBSDRCO1FBSW5DLGdCQUFBLEVBQWtCLFNBQUMsSUFBRDtpQkFBVSxJQUFJLENBQUMsS0FBTCxHQUFhLElBQUksQ0FBQztRQUE1QixDQUppQjtRQUtuQyxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsSUFBRDtBQUNkLGdCQUFBO1lBQUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCO1lBQ1YsSUFBRyxJQUFJLENBQUMsS0FBTCxLQUFjLEtBQUMsQ0FBQSxZQUFsQjtjQUNFLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsUUFBdEIsRUFERjs7WUFFQSxJQUFBLEdBQU8sS0FBQSxHQUFNLElBQUksQ0FBQyxXQUFYLEdBQXVCO1lBQzlCLE9BQU8sQ0FBQyxTQUFSLEdBQW9CO21CQUNwQjtVQU5jO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxtQjtRQVluQyxtQkFBQSxFQUFxQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLElBQUQ7WUFDbkIsS0FBQyxDQUFBLE1BQUQsQ0FBQTttQkFDQSxLQUFDLENBQUEsV0FBVyxDQUFDLFdBQWIsQ0FBeUIsSUFBSSxDQUFDLEtBQTlCO1VBRm1CO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVpjO1FBZW5DLGtCQUFBLEVBQW9CLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ2xCLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFEa0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBZmU7T0FBbkI7YUFrQmxCLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQyxDQUFzQyxZQUF0QztJQXBCSSxDQUFOO0lBc0JBLE9BQUEsRUFBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLE1BQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBaEIsQ0FBQTtJQUZPLENBdEJUO0lBMEJBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBRyxrQkFBSDtRQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBLEVBREY7O01BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxZQUFELEdBQWdCO01BQ2hCLElBQUcsSUFBQyxDQUFBLHdCQUFKO1FBQ0UsSUFBQyxDQUFBLHdCQUF3QixDQUFDLEtBQTFCLENBQUE7ZUFDQSxJQUFDLENBQUEsd0JBQUQsR0FBNEIsS0FGOUI7O0lBTE0sQ0ExQlI7SUFtQ0EsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsd0JBQUQsR0FBNEIsUUFBUSxDQUFDO01BQ3JDLElBQU8sa0JBQVA7UUFDRSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFDLElBQUEsRUFBTSxJQUFDLENBQUEsY0FBUjtTQUE3QixFQURYOztNQUVBLElBQUMsQ0FBQSxjQUFjLENBQUMsS0FBaEIsQ0FBQTthQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsS0FBaEIsQ0FBQTtJQUxNLENBbkNSO0lBMENBLE1BQUEsRUFBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLElBQUcsa0JBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO1FBR0UsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFLLENBQUEsTUFBQTtRQUNsQyxNQUFBLEdBQVM7UUFDVCxXQUFBLEdBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQXNCLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBbkM7QUFDZDtBQUFBLGFBQUEsUUFBQTs7VUFDRSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVo7QUFERjtRQUVBLElBQUMsQ0FBQSxjQUFjLENBQUMsTUFBaEIsQ0FBdUI7VUFBQyxLQUFBLEVBQU8sTUFBUjtTQUF2QjtlQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFURjs7SUFETSxDQTFDUjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIlNlbGVjdExpc3RWaWV3ID0gcmVxdWlyZSBcImF0b20tc2VsZWN0LWxpc3RcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGluaXQ6IChjb2xvckhlbHBlcikgLT5cbiAgICBAY29sb3JIZWxwZXIgPSBjb2xvckhlbHBlclxuICAgIEBzZWxlY3RMaXN0VmlldyA9IG5ldyBTZWxlY3RMaXN0Vmlldyh7XG4gICAgICBlbXB0eU1lc3NhZ2U6ICdObyBjb2xvcnMgb3B0aW9ucy4nLFxuICAgICAgaXRlbXNDbGFzc0xpc3Q6IFsnbWFyay1hY3RpdmUnXSxcbiAgICAgIGl0ZW1zOiBbXSxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IChpdGVtKSAtPiBpdGVtLnZhbHVlICsgaXRlbS5kZXNjcmlwdGlvbixcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiAoaXRlbSkgPT5cbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2xpJ1xuICAgICAgICBpZiBpdGVtLnZhbHVlIGlzIEBjdXJyZW50Q29sb3JcbiAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQgJ2FjdGl2ZSdcbiAgICAgICAgaHRtbCA9IFwiPGI+I3tpdGVtLmRlc2NyaXB0aW9ufTwvYj5cIlxuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGh0bWxcbiAgICAgICAgZWxlbWVudFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogKGl0ZW0pID0+XG4gICAgICAgIEBjYW5jZWwoKVxuICAgICAgICBAY29sb3JIZWxwZXIuc2VsZWN0Q29sb3IgaXRlbS52YWx1ZVxuICAgICAgZGlkQ2FuY2VsU2VsZWN0aW9uOiAoKSA9PlxuICAgICAgICBAY2FuY2VsKClcbiAgICB9KVxuICAgIEBzZWxlY3RMaXN0Vmlldy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NvbG9yLWxpc3QnKVxuXG4gIGRpc3Bvc2U6IC0+XG4gICAgQGNhbmNlbCgpXG4gICAgQHNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKVxuXG4gIGNhbmNlbDogLT5cbiAgICBpZiBAcGFuZWw/XG4gICAgICBAcGFuZWwuZGVzdHJveSgpXG4gICAgQHBhbmVsID0gbnVsbFxuICAgIEBjdXJyZW50Q29sb3IgPSBudWxsXG4gICAgaWYgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudFxuICAgICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpXG4gICAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbFxuXG4gIGF0dGFjaDogLT5cbiAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgIGlmIG5vdCBAcGFuZWw/XG4gICAgICBAcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtpdGVtOiBAc2VsZWN0TGlzdFZpZXd9KVxuICAgIEBzZWxlY3RMaXN0Vmlldy5mb2N1cygpXG4gICAgQHNlbGVjdExpc3RWaWV3LnJlc2V0KClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQHBhbmVsP1xuICAgICAgQGNhbmNlbCgpXG4gICAgZWxzZVxuICAgICAgQGN1cnJlbnRDb2xvciA9IEBjb2xvckhlbHBlci5jb25mWyd0eXBlJ11cbiAgICAgIGNvbG9ycyA9IFtdXG4gICAgICBjb2xvclNjaGVtYSA9IGF0b20uY29uZmlnLmdldFNjaGVtYShAY29sb3JIZWxwZXIua2V5KVxuICAgICAgZm9yIGksIG9wdGlvbiBvZiBjb2xvclNjaGVtYS5wcm9wZXJ0aWVzLnR5cGUuZW51bVxuICAgICAgICBjb2xvcnMucHVzaChvcHRpb24pXG4gICAgICBAc2VsZWN0TGlzdFZpZXcudXBkYXRlKHtpdGVtczogY29sb3JzfSlcbiAgICAgIEBhdHRhY2goKVxuIl19
