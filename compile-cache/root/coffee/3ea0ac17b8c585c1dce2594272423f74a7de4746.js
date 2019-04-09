(function() {
  var SelectListView;

  SelectListView = require("atom-select-list");

  module.exports = {
    init: function(effectRegistry) {
      this.effectRegistry = effectRegistry;
      this.selectListView = new SelectListView({
        emptyMessage: 'No effects in the registry.',
        itemsClassList: ['mark-active'],
        items: [],
        filterKeyForItem: function(item) {
          return item.title + item.description;
        },
        elementForItem: (function(_this) {
          return function(item) {
            var element, html;
            element = document.createElement('li');
            if (item.effect === _this.currentEffect) {
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
            _this.cancel();
            return _this.effectRegistry.selectEffect(item.code);
          };
        })(this),
        didCancelSelection: (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this)
      });
      return this.selectListView.element.classList.add('effect-list');
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
      this.currentEffect = null;
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
      var code, effect, effects, ref;
      if (this.panel != null) {
        return this.cancel();
      } else {
        this.currentEffect = this.effectRegistry.effect;
        effects = [];
        ref = this.effectRegistry.effects;
        for (code in ref) {
          effect = ref[code];
          effects.push({
            code: code,
            effect: effect,
            title: effect.title ? effect.title : code,
            description: effect.description,
            image: effect.image
          });
        }
        this.selectListView.update({
          items: effects
        });
        return this.attach();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2VmZmVjdC1saXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsa0JBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxJQUFBLEVBQU0sU0FBQyxjQUFEO01BQ0osSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBSSxjQUFKLENBQW1CO1FBQ25DLFlBQUEsRUFBYyw2QkFEcUI7UUFFbkMsY0FBQSxFQUFnQixDQUFDLGFBQUQsQ0FGbUI7UUFHbkMsS0FBQSxFQUFPLEVBSDRCO1FBSW5DLGdCQUFBLEVBQWtCLFNBQUMsSUFBRDtpQkFBVSxJQUFJLENBQUMsS0FBTCxHQUFhLElBQUksQ0FBQztRQUE1QixDQUppQjtRQUtuQyxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsSUFBRDtBQUNkLGdCQUFBO1lBQUEsT0FBQSxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLElBQXZCO1lBQ1YsSUFBRyxJQUFJLENBQUMsTUFBTCxLQUFlLEtBQUMsQ0FBQSxhQUFuQjtjQUNFLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsUUFBdEIsRUFERjs7WUFFQSxJQUFBLEdBQU8sS0FBQSxHQUFNLElBQUksQ0FBQyxLQUFYLEdBQWlCO1lBQ3hCLElBQTBDLElBQUksQ0FBQyxXQUEvQztjQUFBLElBQUEsSUFBUSxXQUFBLEdBQVksSUFBSSxDQUFDLFlBQXpCOztZQUNBLElBQXlDLElBQUksQ0FBQyxLQUE5QztjQUFBLElBQUEsSUFBUSxhQUFBLEdBQWMsSUFBSSxDQUFDLEtBQW5CLEdBQXlCLE1BQWpDOztZQUNBLE9BQU8sQ0FBQyxTQUFSLEdBQW9CO21CQUNwQjtVQVJjO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxtQjtRQWNuQyxtQkFBQSxFQUFxQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLElBQUQ7WUFDbkIsS0FBQyxDQUFBLE1BQUQsQ0FBQTttQkFDQSxLQUFDLENBQUEsY0FBYyxDQUFDLFlBQWhCLENBQTZCLElBQUksQ0FBQyxJQUFsQztVQUZtQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FkYztRQWlCbkMsa0JBQUEsRUFBb0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDbEIsS0FBQyxDQUFBLE1BQUQsQ0FBQTtVQURrQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FqQmU7T0FBbkI7YUFvQmxCLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFsQyxDQUFzQyxhQUF0QztJQXRCSSxDQUFOO0lBd0JBLE9BQUEsRUFBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLE1BQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBaEIsQ0FBQTtJQUZPLENBeEJUO0lBNEJBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBRyxrQkFBSDtRQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBLEVBREY7O01BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxhQUFELEdBQWlCO01BQ2pCLElBQUcsSUFBQyxDQUFBLHdCQUFKO1FBQ0UsSUFBQyxDQUFBLHdCQUF3QixDQUFDLEtBQTFCLENBQUE7ZUFDQSxJQUFDLENBQUEsd0JBQUQsR0FBNEIsS0FGOUI7O0lBTE0sQ0E1QlI7SUFxQ0EsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsd0JBQUQsR0FBNEIsUUFBUSxDQUFDO01BQ3JDLElBQU8sa0JBQVA7UUFDRSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFDLElBQUEsRUFBTSxJQUFDLENBQUEsY0FBUjtTQUE3QixFQURYOztNQUVBLElBQUMsQ0FBQSxjQUFjLENBQUMsS0FBaEIsQ0FBQTthQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsS0FBaEIsQ0FBQTtJQUxNLENBckNSO0lBNENBLE1BQUEsRUFBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLElBQUcsa0JBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO1FBR0UsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLGNBQWMsQ0FBQztRQUNqQyxPQUFBLEdBQVU7QUFDVjtBQUFBLGFBQUEsV0FBQTs7VUFDRSxPQUFPLENBQUMsSUFBUixDQUFhO1lBQ1gsSUFBQSxFQUFNLElBREs7WUFFWCxNQUFBLEVBQVEsTUFGRztZQUdYLEtBQUEsRUFBVSxNQUFNLENBQUMsS0FBVixHQUFxQixNQUFNLENBQUMsS0FBNUIsR0FBdUMsSUFIbkM7WUFJWCxXQUFBLEVBQWEsTUFBTSxDQUFDLFdBSlQ7WUFLWCxLQUFBLEVBQU8sTUFBTSxDQUFDLEtBTEg7V0FBYjtBQURGO1FBUUEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFoQixDQUF1QjtVQUFDLEtBQUEsRUFBTyxPQUFSO1NBQXZCO2VBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQWRGOztJQURNLENBNUNSOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsiU2VsZWN0TGlzdFZpZXcgPSByZXF1aXJlIFwiYXRvbS1zZWxlY3QtbGlzdFwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgaW5pdDogKGVmZmVjdFJlZ2lzdHJ5KSAtPlxuICAgIEBlZmZlY3RSZWdpc3RyeSA9IGVmZmVjdFJlZ2lzdHJ5XG4gICAgQHNlbGVjdExpc3RWaWV3ID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgIGVtcHR5TWVzc2FnZTogJ05vIGVmZmVjdHMgaW4gdGhlIHJlZ2lzdHJ5LicsXG4gICAgICBpdGVtc0NsYXNzTGlzdDogWydtYXJrLWFjdGl2ZSddLFxuICAgICAgaXRlbXM6IFtdLFxuICAgICAgZmlsdGVyS2V5Rm9ySXRlbTogKGl0ZW0pIC0+IGl0ZW0udGl0bGUgKyBpdGVtLmRlc2NyaXB0aW9uLFxuICAgICAgZWxlbWVudEZvckl0ZW06IChpdGVtKSA9PlxuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnbGknXG4gICAgICAgIGlmIGl0ZW0uZWZmZWN0IGlzIEBjdXJyZW50RWZmZWN0XG4gICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkICdhY3RpdmUnXG4gICAgICAgIGh0bWwgPSBcIjxiPiN7aXRlbS50aXRsZX08L2I+XCJcbiAgICAgICAgaHRtbCArPSBcIjxiPjo8L2I+ICN7aXRlbS5kZXNjcmlwdGlvbn1cIiBpZiBpdGVtLmRlc2NyaXB0aW9uXG4gICAgICAgIGh0bWwgKz0gXCI8aW1nIHNyYz1cXFwiI3tpdGVtLmltYWdlfVxcXCI+XCIgaWYgaXRlbS5pbWFnZVxuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGh0bWxcbiAgICAgICAgZWxlbWVudFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogKGl0ZW0pID0+XG4gICAgICAgIEBjYW5jZWwoKVxuICAgICAgICBAZWZmZWN0UmVnaXN0cnkuc2VsZWN0RWZmZWN0IGl0ZW0uY29kZVxuICAgICAgZGlkQ2FuY2VsU2VsZWN0aW9uOiAoKSA9PlxuICAgICAgICBAY2FuY2VsKClcbiAgICB9KVxuICAgIEBzZWxlY3RMaXN0Vmlldy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2VmZmVjdC1saXN0JylcblxuICBkaXNwb3NlOiAtPlxuICAgIEBjYW5jZWwoKVxuICAgIEBzZWxlY3RMaXN0Vmlldy5kZXN0cm95KClcblxuICBjYW5jZWw6IC0+XG4gICAgaWYgQHBhbmVsP1xuICAgICAgQHBhbmVsLmRlc3Ryb3koKVxuICAgIEBwYW5lbCA9IG51bGxcbiAgICBAY3VycmVudEVmZmVjdCA9IG51bGxcbiAgICBpZiBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50XG4gICAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKClcbiAgICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsXG5cbiAgYXR0YWNoOiAtPlxuICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgaWYgbm90IEBwYW5lbD9cbiAgICAgIEBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe2l0ZW06IEBzZWxlY3RMaXN0Vmlld30pXG4gICAgQHNlbGVjdExpc3RWaWV3LmZvY3VzKClcbiAgICBAc2VsZWN0TGlzdFZpZXcucmVzZXQoKVxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAcGFuZWw/XG4gICAgICBAY2FuY2VsKClcbiAgICBlbHNlXG4gICAgICBAY3VycmVudEVmZmVjdCA9IEBlZmZlY3RSZWdpc3RyeS5lZmZlY3RcbiAgICAgIGVmZmVjdHMgPSBbXVxuICAgICAgZm9yIGNvZGUsIGVmZmVjdCBvZiBAZWZmZWN0UmVnaXN0cnkuZWZmZWN0c1xuICAgICAgICBlZmZlY3RzLnB1c2goe1xuICAgICAgICAgIGNvZGU6IGNvZGUsXG4gICAgICAgICAgZWZmZWN0OiBlZmZlY3QsXG4gICAgICAgICAgdGl0bGU6IGlmIGVmZmVjdC50aXRsZSB0aGVuIGVmZmVjdC50aXRsZSBlbHNlIGNvZGUsXG4gICAgICAgICAgZGVzY3JpcHRpb246IGVmZmVjdC5kZXNjcmlwdGlvblxuICAgICAgICAgIGltYWdlOiBlZmZlY3QuaW1hZ2VcbiAgICAgICAgfSlcbiAgICAgIEBzZWxlY3RMaXN0Vmlldy51cGRhdGUoe2l0ZW1zOiBlZmZlY3RzfSlcbiAgICAgIEBhdHRhY2goKVxuIl19
