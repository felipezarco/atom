(function() {
  var CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = {
    subscriptions: null,
    effects: [],
    effect: null,
    key: "activate-power-mode.particles.effect",
    enable: function() {
      this.subscriptions = new CompositeDisposable;
      this.observeEffect();
      return this.initList();
    },
    disable: function() {
      var ref, ref1;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      if ((ref1 = this.effectList) != null) {
        ref1.dispose();
      }
      return this.effectList = null;
    },
    setDefaultEffect: function(effect) {
      this.effect = effect;
      return this.effects['default'] = effect;
    },
    addEffect: function(code, effect) {
      this.effects[code] = effect;
      if (atom.config.get(this.key) === code) {
        return this.effect = effect;
      }
    },
    removeEffect: function(code) {
      if (atom.config.get(this.key) === code) {
        this.effect.disable();
        this.effect = this.effects['default'];
        this.effect.init();
      }
      return delete this.effects[code];
    },
    observeEffect: function() {
      return this.subscriptions.add(atom.config.observe(this.key, (function(_this) {
        return function(code) {
          var effect;
          if (_this.effects[code] != null) {
            effect = _this.effects[code];
          } else {
            effect = _this.effects['default'];
          }
          _this.effect.disable();
          _this.effect = effect;
          return _this.effect.init();
        };
      })(this)));
    },
    selectEffect: function(code) {
      return atom.config.set(this.key, code);
    },
    initList: function() {
      if (this.effectList != null) {
        return;
      }
      this.effectList = require("./effect-list");
      this.effectList.init(this);
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:select-effect": (function(_this) {
          return function() {
            return _this.effectList.toggle();
          };
        })(this)
      }));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2VmZmVjdC1yZWdpc3RyeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBQ0EsT0FBQSxFQUFTLEVBRFQ7SUFFQSxNQUFBLEVBQVEsSUFGUjtJQUdBLEdBQUEsRUFBSyxzQ0FITDtJQUtBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsYUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBQTtJQUhNLENBTFI7SUFVQSxPQUFBLEVBQVMsU0FBQTtBQUNQLFVBQUE7O1dBQWMsQ0FBRSxPQUFoQixDQUFBOzs7WUFDVyxDQUFFLE9BQWIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjO0lBSFAsQ0FWVDtJQWVBLGdCQUFBLEVBQWtCLFNBQUMsTUFBRDtNQUNoQixJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLE9BQVEsQ0FBQSxTQUFBLENBQVQsR0FBc0I7SUFGTixDQWZsQjtJQW1CQSxTQUFBLEVBQVcsU0FBQyxJQUFELEVBQU8sTUFBUDtNQUNULElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQSxDQUFULEdBQWlCO01BRWpCLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLElBQUMsQ0FBQSxHQUFqQixDQUFBLEtBQXlCLElBQTVCO2VBQ0UsSUFBQyxDQUFBLE1BQUQsR0FBVSxPQURaOztJQUhTLENBbkJYO0lBeUJBLFlBQUEsRUFBYyxTQUFDLElBQUQ7TUFDWixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixJQUFDLENBQUEsR0FBakIsQ0FBQSxLQUF5QixJQUE1QjtRQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBO1FBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsT0FBUSxDQUFBLFNBQUE7UUFDbkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQUEsRUFIRjs7YUFLQSxPQUFPLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQTtJQU5KLENBekJkO0lBaUNBLGFBQUEsRUFBZSxTQUFBO2FBQ2IsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNqQixJQUFDLENBQUEsR0FEZ0IsRUFDWCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtBQUNKLGNBQUE7VUFBQSxJQUFHLDJCQUFIO1lBQ0UsTUFBQSxHQUFTLEtBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQSxFQURwQjtXQUFBLE1BQUE7WUFHRSxNQUFBLEdBQVMsS0FBQyxDQUFBLE9BQVEsQ0FBQSxTQUFBLEVBSHBCOztVQUlBLEtBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBO1VBQ0EsS0FBQyxDQUFBLE1BQUQsR0FBVTtpQkFDVixLQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBQTtRQVBJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURXLENBQW5CO0lBRGEsQ0FqQ2Y7SUE2Q0EsWUFBQSxFQUFjLFNBQUMsSUFBRDthQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixJQUFDLENBQUEsR0FBakIsRUFBc0IsSUFBdEI7SUFEWSxDQTdDZDtJQWdEQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQVUsdUJBQVY7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsT0FBQSxDQUFRLGVBQVI7TUFDZCxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsSUFBakI7YUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtRQUFBLG1DQUFBLEVBQXFDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ25DLEtBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBO1VBRG1DO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQztPQURpQixDQUFuQjtJQU5RLENBaERWOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgZWZmZWN0czogW11cbiAgZWZmZWN0OiBudWxsXG4gIGtleTogXCJhY3RpdmF0ZS1wb3dlci1tb2RlLnBhcnRpY2xlcy5lZmZlY3RcIlxuXG4gIGVuYWJsZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQG9ic2VydmVFZmZlY3QoKVxuICAgIEBpbml0TGlzdCgpXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGVmZmVjdExpc3Q/LmRpc3Bvc2UoKVxuICAgIEBlZmZlY3RMaXN0ID0gbnVsbFxuXG4gIHNldERlZmF1bHRFZmZlY3Q6IChlZmZlY3QpIC0+XG4gICAgQGVmZmVjdCA9IGVmZmVjdFxuICAgIEBlZmZlY3RzWydkZWZhdWx0J10gPSBlZmZlY3RcblxuICBhZGRFZmZlY3Q6IChjb2RlLCBlZmZlY3QpIC0+XG4gICAgQGVmZmVjdHNbY29kZV0gPSBlZmZlY3RcblxuICAgIGlmIGF0b20uY29uZmlnLmdldChAa2V5KSBpcyBjb2RlXG4gICAgICBAZWZmZWN0ID0gZWZmZWN0XG5cbiAgcmVtb3ZlRWZmZWN0OiAoY29kZSkgLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoQGtleSkgaXMgY29kZVxuICAgICAgQGVmZmVjdC5kaXNhYmxlKClcbiAgICAgIEBlZmZlY3QgPSBAZWZmZWN0c1snZGVmYXVsdCddXG4gICAgICBAZWZmZWN0LmluaXQoKVxuXG4gICAgZGVsZXRlIEBlZmZlY3RzW2NvZGVdXG5cbiAgb2JzZXJ2ZUVmZmVjdDogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgIEBrZXksIChjb2RlKSA9PlxuICAgICAgICBpZiBAZWZmZWN0c1tjb2RlXT9cbiAgICAgICAgICBlZmZlY3QgPSBAZWZmZWN0c1tjb2RlXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZWZmZWN0ID0gQGVmZmVjdHNbJ2RlZmF1bHQnXVxuICAgICAgICBAZWZmZWN0LmRpc2FibGUoKVxuICAgICAgICBAZWZmZWN0ID0gZWZmZWN0XG4gICAgICAgIEBlZmZlY3QuaW5pdCgpXG4gICAgKVxuXG4gIHNlbGVjdEVmZmVjdDogKGNvZGUpIC0+XG4gICAgYXRvbS5jb25maWcuc2V0KEBrZXksIGNvZGUpXG5cbiAgaW5pdExpc3Q6IC0+XG4gICAgcmV0dXJuIGlmIEBlZmZlY3RMaXN0P1xuXG4gICAgQGVmZmVjdExpc3QgPSByZXF1aXJlIFwiLi9lZmZlY3QtbGlzdFwiXG4gICAgQGVmZmVjdExpc3QuaW5pdCB0aGlzXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLFxuICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlOnNlbGVjdC1lZmZlY3RcIjogPT5cbiAgICAgICAgQGVmZmVjdExpc3QudG9nZ2xlKClcbiJdfQ==
