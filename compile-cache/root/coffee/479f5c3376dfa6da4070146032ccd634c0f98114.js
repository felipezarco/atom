(function() {
  var ActivatePowerMode, CompositeDisposable, configSchema;

  CompositeDisposable = require("atom").CompositeDisposable;

  configSchema = require("./config-schema");

  module.exports = ActivatePowerMode = {
    config: configSchema,
    subscriptions: null,
    active: false,
    activate: function(state) {
      this.pluginRegistry = require("./plugin-registry");
      this.flowRegistry = require("./flow-registry");
      this.effectRegistry = require("./effect-registry");
      return requestIdleCallback((function(_this) {
        return function() {
          _this.subscriptions = new CompositeDisposable;
          _this.powerEditor = require("./power-editor");
          _this.pluginManager = require("./plugin-manager");
          _this.powerEditor.setPluginManager(_this.pluginManager);
          _this.pluginManager.init(_this.config, _this.pluginRegistry, _this.flowRegistry, _this.effectRegistry);
          _this.subscriptions.add(atom.commands.add("atom-workspace", {
            "activate-power-mode:toggle": function() {
              return _this.toggle();
            },
            "activate-power-mode:enable": function() {
              return _this.enable();
            },
            "activate-power-mode:disable": function() {
              return _this.disable();
            }
          }));
          if (_this.getConfig("autoToggle")) {
            return _this.toggle();
          }
        };
      })(this));
    },
    deactivate: function() {
      var ref;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      this.active = false;
      return this.powerEditor.disable();
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    },
    toggle: function() {
      if (this.active) {
        return this.disable();
      } else {
        return this.enable();
      }
    },
    enable: function() {
      this.active = true;
      return this.powerEditor.enable();
    },
    disable: function() {
      this.active = false;
      return this.powerEditor.disable();
    },
    provideServiceV1: function() {
      var Service;
      if (!this.service) {
        Service = require("./service");
        this.service = new Service(this.pluginRegistry, this.flowRegistry, this.effectRegistry);
      }
      return this.service;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2FjdGl2YXRlLXBvd2VyLW1vZGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVI7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FBaUIsaUJBQUEsR0FDZjtJQUFBLE1BQUEsRUFBUSxZQUFSO0lBQ0EsYUFBQSxFQUFlLElBRGY7SUFFQSxNQUFBLEVBQVEsS0FGUjtJQUlBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsY0FBRCxHQUFrQixPQUFBLENBQVEsbUJBQVI7TUFDbEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSO01BQ2hCLElBQUMsQ0FBQSxjQUFELEdBQWtCLE9BQUEsQ0FBUSxtQkFBUjthQUVsQixtQkFBQSxDQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDbEIsS0FBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtVQUVyQixLQUFDLENBQUEsV0FBRCxHQUFlLE9BQUEsQ0FBUSxnQkFBUjtVQUNmLEtBQUMsQ0FBQSxhQUFELEdBQWlCLE9BQUEsQ0FBUSxrQkFBUjtVQUNqQixLQUFDLENBQUEsV0FBVyxDQUFDLGdCQUFiLENBQThCLEtBQUMsQ0FBQSxhQUEvQjtVQUNBLEtBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixLQUFDLENBQUEsTUFBckIsRUFBNkIsS0FBQyxDQUFBLGNBQTlCLEVBQThDLEtBQUMsQ0FBQSxZQUEvQyxFQUE2RCxLQUFDLENBQUEsY0FBOUQ7VUFFQSxLQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtZQUFBLDRCQUFBLEVBQThCLFNBQUE7cUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtZQUFILENBQTlCO1lBQ0EsNEJBQUEsRUFBOEIsU0FBQTtxQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1lBQUgsQ0FEOUI7WUFFQSw2QkFBQSxFQUErQixTQUFBO3FCQUFHLEtBQUMsQ0FBQSxPQUFELENBQUE7WUFBSCxDQUYvQjtXQURpQixDQUFuQjtVQUtBLElBQUcsS0FBQyxDQUFBLFNBQUQsQ0FBVyxZQUFYLENBQUg7bUJBQ0UsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQURGOztRQWJrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEI7SUFMUSxDQUpWO0lBeUJBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTs7V0FBYyxDQUFFLE9BQWhCLENBQUE7O01BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVTthQUNWLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO0lBSFUsQ0F6Qlo7SUE4QkEsU0FBQSxFQUFXLFNBQUMsTUFBRDthQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBQSxHQUF1QixNQUF2QztJQURTLENBOUJYO0lBaUNBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBRyxJQUFDLENBQUEsTUFBSjtlQUFnQixJQUFDLENBQUEsT0FBRCxDQUFBLEVBQWhCO09BQUEsTUFBQTtlQUFnQyxJQUFDLENBQUEsTUFBRCxDQUFBLEVBQWhDOztJQURNLENBakNSO0lBb0NBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLE1BQUQsR0FBVTthQUNWLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFBO0lBRk0sQ0FwQ1I7SUF3Q0EsT0FBQSxFQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFGTyxDQXhDVDtJQTRDQSxnQkFBQSxFQUFrQixTQUFBO0FBQ2hCLFVBQUE7TUFBQSxJQUFHLENBQUksSUFBQyxDQUFBLE9BQVI7UUFDRSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7UUFDVixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksT0FBSixDQUFZLElBQUMsQ0FBQSxjQUFiLEVBQTZCLElBQUMsQ0FBQSxZQUE5QixFQUE0QyxJQUFDLENBQUEsY0FBN0MsRUFGYjs7YUFHQSxJQUFDLENBQUE7SUFKZSxDQTVDbEI7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5jb25maWdTY2hlbWEgPSByZXF1aXJlIFwiLi9jb25maWctc2NoZW1hXCJcblxubW9kdWxlLmV4cG9ydHMgPSBBY3RpdmF0ZVBvd2VyTW9kZSA9XG4gIGNvbmZpZzogY29uZmlnU2NoZW1hXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgYWN0aXZlOiBmYWxzZVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHBsdWdpblJlZ2lzdHJ5ID0gcmVxdWlyZSBcIi4vcGx1Z2luLXJlZ2lzdHJ5XCJcbiAgICBAZmxvd1JlZ2lzdHJ5ID0gcmVxdWlyZSBcIi4vZmxvdy1yZWdpc3RyeVwiXG4gICAgQGVmZmVjdFJlZ2lzdHJ5ID0gcmVxdWlyZSBcIi4vZWZmZWN0LXJlZ2lzdHJ5XCJcblxuICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2sgPT5cbiAgICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgICAgQHBvd2VyRWRpdG9yID0gcmVxdWlyZSBcIi4vcG93ZXItZWRpdG9yXCJcbiAgICAgIEBwbHVnaW5NYW5hZ2VyID0gcmVxdWlyZSBcIi4vcGx1Z2luLW1hbmFnZXJcIlxuICAgICAgQHBvd2VyRWRpdG9yLnNldFBsdWdpbk1hbmFnZXIgQHBsdWdpbk1hbmFnZXJcbiAgICAgIEBwbHVnaW5NYW5hZ2VyLmluaXQgQGNvbmZpZywgQHBsdWdpblJlZ2lzdHJ5LCBAZmxvd1JlZ2lzdHJ5LCBAZWZmZWN0UmVnaXN0cnlcblxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlOnRvZ2dsZVwiOiA9PiBAdG9nZ2xlKClcbiAgICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlOmVuYWJsZVwiOiA9PiBAZW5hYmxlKClcbiAgICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlOmRpc2FibGVcIjogPT4gQGRpc2FibGUoKVxuXG4gICAgICBpZiBAZ2V0Q29uZmlnIFwiYXV0b1RvZ2dsZVwiXG4gICAgICAgIEB0b2dnbGUoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgIEBwb3dlckVkaXRvci5kaXNhYmxlKClcblxuICBnZXRDb25maWc6IChjb25maWcpIC0+XG4gICAgYXRvbS5jb25maWcuZ2V0IFwiYWN0aXZhdGUtcG93ZXItbW9kZS4je2NvbmZpZ31cIlxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAYWN0aXZlIHRoZW4gQGRpc2FibGUoKSBlbHNlIEBlbmFibGUoKVxuXG4gIGVuYWJsZTogLT5cbiAgICBAYWN0aXZlID0gdHJ1ZVxuICAgIEBwb3dlckVkaXRvci5lbmFibGUoKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQGFjdGl2ZSA9IGZhbHNlXG4gICAgQHBvd2VyRWRpdG9yLmRpc2FibGUoKVxuXG4gIHByb3ZpZGVTZXJ2aWNlVjE6IC0+XG4gICAgaWYgbm90IEBzZXJ2aWNlXG4gICAgICBTZXJ2aWNlID0gcmVxdWlyZSBcIi4vc2VydmljZVwiXG4gICAgICBAc2VydmljZSA9IG5ldyBTZXJ2aWNlKEBwbHVnaW5SZWdpc3RyeSwgQGZsb3dSZWdpc3RyeSwgQGVmZmVjdFJlZ2lzdHJ5KVxuICAgIEBzZXJ2aWNlXG4iXX0=
