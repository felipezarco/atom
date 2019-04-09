(function() {
  var CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = {
    subscriptions: null,
    flows: [],
    flow: null,
    key: "activate-power-mode.flow",
    enable: function() {
      this.subscriptions = new CompositeDisposable;
      this.observeFlow();
      return this.initList();
    },
    disable: function() {
      var ref, ref1;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      if ((ref1 = this.flowList) != null) {
        ref1.dispose();
      }
      return this.flowList = null;
    },
    setDefaultFlow: function(flow) {
      this.flow = flow;
      return this.flows['default'] = flow;
    },
    addFlow: function(code, flow) {
      this.flows[code] = flow;
      if (atom.config.get(this.key) === code) {
        return this.flow = flow;
      }
    },
    removeFlow: function(code) {
      if (atom.config.get(this.key) === code) {
        this.flow = this.flows['default'];
      }
      return delete this.flows[code];
    },
    observeFlow: function() {
      return this.subscriptions.add(atom.config.observe(this.key, (function(_this) {
        return function(code) {
          if (_this.flows[code] != null) {
            return _this.flow = _this.flows[code];
          } else {
            return _this.flow = _this.flows['default'];
          }
        };
      })(this)));
    },
    selectFlow: function(code) {
      return atom.config.set(this.key, code);
    },
    initList: function() {
      if (this.flowList != null) {
        return;
      }
      this.flowList = require("./flow-list");
      this.flowList.init(this);
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:select-flow": (function(_this) {
          return function() {
            return _this.flowList.toggle();
          };
        })(this)
      }));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2Zsb3ctcmVnaXN0cnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxhQUFBLEVBQWUsSUFBZjtJQUNBLEtBQUEsRUFBTyxFQURQO0lBRUEsSUFBQSxFQUFNLElBRk47SUFHQSxHQUFBLEVBQUssMEJBSEw7SUFLQSxNQUFBLEVBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLFdBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQUE7SUFITSxDQUxSO0lBVUEsT0FBQSxFQUFTLFNBQUE7QUFDUCxVQUFBOztXQUFjLENBQUUsT0FBaEIsQ0FBQTs7O1lBQ1MsQ0FBRSxPQUFYLENBQUE7O2FBQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUhMLENBVlQ7SUFlQSxjQUFBLEVBQWdCLFNBQUMsSUFBRDtNQUNkLElBQUMsQ0FBQSxJQUFELEdBQVE7YUFDUixJQUFDLENBQUEsS0FBTSxDQUFBLFNBQUEsQ0FBUCxHQUFvQjtJQUZOLENBZmhCO0lBbUJBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxJQUFQO01BQ1AsSUFBQyxDQUFBLEtBQU0sQ0FBQSxJQUFBLENBQVAsR0FBZTtNQUVmLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxHQUFqQixDQUFBLEtBQXlCLElBQTVCO2VBQ0UsSUFBQyxDQUFBLElBQUQsR0FBUSxLQURWOztJQUhPLENBbkJUO0lBeUJBLFVBQUEsRUFBWSxTQUFDLElBQUQ7TUFDVixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixJQUFDLENBQUEsR0FBakIsQ0FBQSxLQUF5QixJQUE1QjtRQUNFLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLEtBQU0sQ0FBQSxTQUFBLEVBRGpCOzthQUdBLE9BQU8sSUFBQyxDQUFBLEtBQU0sQ0FBQSxJQUFBO0lBSkosQ0F6Qlo7SUErQkEsV0FBQSxFQUFhLFNBQUE7YUFDWCxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQ2pCLElBQUMsQ0FBQSxHQURnQixFQUNYLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQ0osSUFBRyx5QkFBSDttQkFDRSxLQUFDLENBQUEsSUFBRCxHQUFRLEtBQUMsQ0FBQSxLQUFNLENBQUEsSUFBQSxFQURqQjtXQUFBLE1BQUE7bUJBR0UsS0FBQyxDQUFBLElBQUQsR0FBUSxLQUFDLENBQUEsS0FBTSxDQUFBLFNBQUEsRUFIakI7O1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFcsQ0FBbkI7SUFEVyxDQS9CYjtJQXdDQSxVQUFBLEVBQVksU0FBQyxJQUFEO2FBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxHQUFqQixFQUFzQixJQUF0QjtJQURVLENBeENaO0lBMkNBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBVSxxQkFBVjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxPQUFBLENBQVEsYUFBUjtNQUNaLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFlLElBQWY7YUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtRQUFBLGlDQUFBLEVBQW1DLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ2pDLEtBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFBO1VBRGlDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQztPQURpQixDQUFuQjtJQU5RLENBM0NWOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgZmxvd3M6IFtdXG4gIGZsb3c6IG51bGxcbiAga2V5OiBcImFjdGl2YXRlLXBvd2VyLW1vZGUuZmxvd1wiXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAb2JzZXJ2ZUZsb3coKVxuICAgIEBpbml0TGlzdCgpXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGZsb3dMaXN0Py5kaXNwb3NlKClcbiAgICBAZmxvd0xpc3QgPSBudWxsXG5cbiAgc2V0RGVmYXVsdEZsb3c6IChmbG93KSAtPlxuICAgIEBmbG93ID0gZmxvd1xuICAgIEBmbG93c1snZGVmYXVsdCddID0gZmxvd1xuXG4gIGFkZEZsb3c6IChjb2RlLCBmbG93KSAtPlxuICAgIEBmbG93c1tjb2RlXSA9IGZsb3dcblxuICAgIGlmIGF0b20uY29uZmlnLmdldChAa2V5KSBpcyBjb2RlXG4gICAgICBAZmxvdyA9IGZsb3dcblxuICByZW1vdmVGbG93OiAoY29kZSkgLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoQGtleSkgaXMgY29kZVxuICAgICAgQGZsb3cgPSBAZmxvd3NbJ2RlZmF1bHQnXVxuXG4gICAgZGVsZXRlIEBmbG93c1tjb2RlXVxuXG4gIG9ic2VydmVGbG93OiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgQGtleSwgKGNvZGUpID0+XG4gICAgICAgIGlmIEBmbG93c1tjb2RlXT9cbiAgICAgICAgICBAZmxvdyA9IEBmbG93c1tjb2RlXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGZsb3cgPSBAZmxvd3NbJ2RlZmF1bHQnXVxuICAgIClcblxuICBzZWxlY3RGbG93OiAoY29kZSkgLT5cbiAgICBhdG9tLmNvbmZpZy5zZXQoQGtleSwgY29kZSlcblxuICBpbml0TGlzdDogLT5cbiAgICByZXR1cm4gaWYgQGZsb3dMaXN0P1xuXG4gICAgQGZsb3dMaXN0ID0gcmVxdWlyZSBcIi4vZmxvdy1saXN0XCJcbiAgICBAZmxvd0xpc3QuaW5pdCB0aGlzXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLFxuICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlOnNlbGVjdC1mbG93XCI6ID0+XG4gICAgICAgIEBmbG93TGlzdC50b2dnbGUoKVxuIl19
