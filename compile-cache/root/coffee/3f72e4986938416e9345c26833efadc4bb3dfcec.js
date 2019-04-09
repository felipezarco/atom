(function() {
  var CompositeDisposable;

  CompositeDisposable = require("atom").CompositeDisposable;

  module.exports = {
    enabled: false,
    subscriptions: null,
    pluginSubscriptions: [],
    plugins: [],
    corePlugins: [],
    enabledPlugins: [],
    key: 'activate-power-mode.plugins',
    init: function(configSchema, api) {
      this.config = configSchema;
      return this.api = api;
    },
    enable: function() {
      var code, key, plugin, ref, ref1;
      this.subscriptions = new CompositeDisposable;
      this.enabled = true;
      ref = this.corePlugins;
      for (code in ref) {
        plugin = ref[code];
        this.observePlugin(code, plugin, "activate-power-mode." + code + ".enabled");
      }
      ref1 = this.plugins;
      for (code in ref1) {
        plugin = ref1[code];
        key = this.key + "." + code;
        this.addConfigForPlugin(code, plugin, key);
        this.observePlugin(code, plugin, key);
      }
      return this.initList();
    },
    disable: function() {
      var code, i, len, ref, ref1, ref2, subs;
      this.enabled = false;
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      ref1 = this.pluginSubscriptions;
      for (subs = i = 0, len = ref1.length; i < len; subs = ++i) {
        code = ref1[subs];
        subs.dispose();
      }
      this.pluginSubscriptions = [];
      if ((ref2 = this.pluginList) != null) {
        ref2.dispose();
      }
      return this.pluginList = null;
    },
    addCorePlugin: function(code, plugin) {
      return this.corePlugins[code] = plugin;
    },
    addPlugin: function(code, plugin) {
      var key;
      key = this.key + "." + code;
      this.plugins[code] = plugin;
      if (this.enabled) {
        this.addConfigForPlugin(code, plugin, key);
        return this.observePlugin(code, plugin, key);
      }
    },
    removePlugin: function(code) {
      var base, key;
      key = this.key + "." + code;
      if (this.enabled) {
        this.unobservePlugin(code);
        this.removeConfigForPlugin(code);
      }
      delete this.plugins[code];
      if (this.enabledPlugins[code] != null) {
        if (typeof (base = this.enabledPlugins[code]).disable === "function") {
          base.disable();
        }
        return delete this.enabledPlugins[code];
      }
    },
    addConfigForPlugin: function(code, plugin, key) {
      this.config.plugins.properties[code] = {
        type: 'boolean',
        title: plugin.title,
        description: plugin.description,
        "default": true
      };
      if (atom.config.get(key) === void 0) {
        return atom.config.set(key, this.config.plugins.properties[code]["default"]);
      }
    },
    removeConfigForPlugin: function(code) {
      return delete this.config.plugins.properties[code];
    },
    observePlugin: function(code, plugin, key) {
      return this.pluginSubscriptions[code] = atom.config.observe(key, (function(_this) {
        return function(isEnabled) {
          if (isEnabled) {
            if (typeof plugin.enable === "function") {
              plugin.enable(_this.api);
            }
            return _this.enabledPlugins[code] = plugin;
          } else {
            if (typeof plugin.disable === "function") {
              plugin.disable();
            }
            return delete _this.enabledPlugins[code];
          }
        };
      })(this));
    },
    unobservePlugin: function(code) {
      var ref;
      if ((ref = this.pluginSubscriptions[code]) != null) {
        ref.dispose();
      }
      return delete this.pluginSubscriptions[code];
    },
    onEnabled: function(callback) {
      var code, plugin, ref, results;
      ref = this.enabledPlugins;
      results = [];
      for (code in ref) {
        plugin = ref[code];
        if (callback(code, plugin)) {
          continue;
        } else {
          results.push(void 0);
        }
      }
      return results;
    },
    togglePlugin: function(code) {
      var isEnabled;
      isEnabled = atom.config.get(this.key + "." + code);
      return atom.config.set(this.key + "." + code, !isEnabled);
    },
    initList: function() {
      if (this.pluginList != null) {
        return;
      }
      this.pluginList = require("./plugin-list");
      this.pluginList.init(this);
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:select-plugin": (function(_this) {
          return function() {
            return _this.pluginList.toggle();
          };
        })(this)
      }));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi1yZWdpc3RyeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE9BQUEsRUFBUyxLQUFUO0lBQ0EsYUFBQSxFQUFlLElBRGY7SUFFQSxtQkFBQSxFQUFxQixFQUZyQjtJQUdBLE9BQUEsRUFBUyxFQUhUO0lBSUEsV0FBQSxFQUFhLEVBSmI7SUFLQSxjQUFBLEVBQWdCLEVBTGhCO0lBTUEsR0FBQSxFQUFLLDZCQU5MO0lBUUEsSUFBQSxFQUFNLFNBQUMsWUFBRCxFQUFlLEdBQWY7TUFDSixJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUZILENBUk47SUFZQSxNQUFBLEVBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxPQUFELEdBQVc7QUFFWDtBQUFBLFdBQUEsV0FBQTs7UUFDRSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsc0JBQUEsR0FBdUIsSUFBdkIsR0FBNEIsVUFBekQ7QUFERjtBQUdBO0FBQUEsV0FBQSxZQUFBOztRQUNFLEdBQUEsR0FBUyxJQUFDLENBQUEsR0FBRixHQUFNLEdBQU4sR0FBUztRQUNqQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBcEIsRUFBMEIsTUFBMUIsRUFBa0MsR0FBbEM7UUFDQSxJQUFDLENBQUEsYUFBRCxDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsR0FBN0I7QUFIRjthQUtBLElBQUMsQ0FBQSxRQUFELENBQUE7SUFaTSxDQVpSO0lBMEJBLE9BQUEsRUFBUyxTQUFBO0FBQ1AsVUFB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LE9BQTVCLENBQUE7O2FBQ0EsT0FBTyxJQUFDLENBQUEsbUJBQW9CLENBQUEsSUFBQTtJQUZiLENBbEZqQjtJQXNGQSxTQUFBLEVBQVcsU0FBQyxRQUFEO0FBQ1QsVUFBQTtBQUFBO0FBQUE7V0FBQSxXQUFBOztRQUNFLElBQVksUUFBQSxDQUFTLElBQVQsRUFBZSxNQUFmLENBQVo7QUFBQSxtQkFBQTtTQUFBLE1BQUE7K0JBQUE7O0FBREY7O0lBRFMsQ0F0Rlg7SUEwRkEsWUFBQSxFQUFjLFNBQUMsSUFBRDtBQUNaLFVBQUE7TUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQW1CLElBQUMsQ0FBQSxHQUFGLEdBQU0sR0FBTixHQUFTLElBQTNCO2FBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQW1CLElBQUMsQ0FBQSxHQUFGLEdBQU0sR0FBTixHQUFTLElBQTNCLEVBQW1DLENBQUMsU0FBcEM7SUFGWSxDQTFGZDtJQThGQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQVUsdUJBQVY7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsT0FBQSxDQUFRLGVBQVI7TUFDZCxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsSUFBakI7YUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtRQUFBLG1DQUFBLEVBQXFDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ25DLEtBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBO1VBRG1DO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQztPQURpQixDQUFuQjtJQU5RLENBOUZWOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGVuYWJsZWQ6IGZhbHNlXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgcGx1Z2luU3Vic2NyaXB0aW9uczogW11cbiAgcGx1Z2luczogW11cbiAgY29yZVBsdWdpbnM6IFtdXG4gIGVuYWJsZWRQbHVnaW5zOiBbXVxuICBrZXk6ICdhY3RpdmF0ZS1wb3dlci1tb2RlLnBsdWdpbnMnXG5cbiAgaW5pdDogKGNvbmZpZ1NjaGVtYSwgYXBpKSAtPlxuICAgIEBjb25maWcgPSBjb25maWdTY2hlbWFcbiAgICBAYXBpID0gYXBpXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAZW5hYmxlZCA9IHRydWVcblxuICAgIGZvciBjb2RlLCBwbHVnaW4gb2YgQGNvcmVQbHVnaW5zXG4gICAgICBAb2JzZXJ2ZVBsdWdpbiBjb2RlLCBwbHVnaW4sIFwiYWN0aXZhdGUtcG93ZXItbW9kZS4je2NvZGV9LmVuYWJsZWRcIlxuXG4gICAgZm9yIGNvZGUsIHBsdWdpbiBvZiBAcGx1Z2luc1xuICAgICAga2V5ID0gXCIje0BrZXl9LiN7Y29kZX1cIlxuICAgICAgQGFkZENvbmZpZ0ZvclBsdWdpbiBjb2RlLCBwbHVnaW4sIGtleVxuICAgICAgQG9ic2VydmVQbHVnaW4gY29kZSwgcGx1Z2luLCBrZXlcblxuICAgIEBpbml0TGlzdCgpXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAZW5hYmxlZCA9IGZhbHNlXG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIGZvciBjb2RlLCBzdWJzIGluIEBwbHVnaW5TdWJzY3JpcHRpb25zXG4gICAgICBzdWJzLmRpc3Bvc2UoKVxuICAgIEBwbHVnaW5TdWJzY3JpcHRpb25zID0gW11cbiAgICBAcGx1Z2luTGlzdD8uZGlzcG9zZSgpXG4gICAgQHBsdWdpbkxpc3QgPSBudWxsXG5cbiAgYWRkQ29yZVBsdWdpbjogKGNvZGUsIHBsdWdpbikgLT5cbiAgICBAY29yZVBsdWdpbnNbY29kZV0gPSBwbHVnaW5cblxuICBhZGRQbHVnaW46IChjb2RlLCBwbHVnaW4pIC0+XG4gICAga2V5ID0gXCIje0BrZXl9LiN7Y29kZX1cIlxuICAgIEBwbHVnaW5zW2NvZGVdID0gcGx1Z2luXG5cbiAgICBpZiBAZW5hYmxlZFxuICAgICAgQGFkZENvbmZpZ0ZvclBsdWdpbiBjb2RlLCBwbHVnaW4sIGtleVxuICAgICAgQG9ic2VydmVQbHVnaW4gY29kZSwgcGx1Z2luLCBrZXlcblxuICByZW1vdmVQbHVnaW46IChjb2RlKSAtPlxuICAgIGtleSA9IFwiI3tAa2V5fS4je2NvZGV9XCJcblxuICAgIGlmIEBlbmFibGVkXG4gICAgICBAdW5vYnNlcnZlUGx1Z2luIGNvZGVcbiAgICAgIEByZW1vdmVDb25maWdGb3JQbHVnaW4gY29kZVxuXG4gICAgZGVsZXRlIEBwbHVnaW5zW2NvZGVdXG4gICAgaWYgQGVuYWJsZWRQbHVnaW5zW2NvZGVdP1xuICAgICAgQGVuYWJsZWRQbHVnaW5zW2NvZGVdLmRpc2FibGU/KClcbiAgICAgIGRlbGV0ZSBAZW5hYmxlZFBsdWdpbnNbY29kZV1cblxuICBhZGRDb25maWdGb3JQbHVnaW46IChjb2RlLCBwbHVnaW4sIGtleSkgLT5cbiAgICBAY29uZmlnLnBsdWdpbnMucHJvcGVydGllc1tjb2RlXSA9XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICB0aXRsZTogcGx1Z2luLnRpdGxlLFxuICAgICAgZGVzY3JpcHRpb246IHBsdWdpbi5kZXNjcmlwdGlvbixcbiAgICAgIGRlZmF1bHQ6IHRydWVcblxuICAgIGlmIGF0b20uY29uZmlnLmdldChrZXkpID09IHVuZGVmaW5lZFxuICAgICAgYXRvbS5jb25maWcuc2V0IGtleSwgQGNvbmZpZy5wbHVnaW5zLnByb3BlcnRpZXNbY29kZV0uZGVmYXVsdFxuXG4gIHJlbW92ZUNvbmZpZ0ZvclBsdWdpbjogKGNvZGUpIC0+XG4gICAgZGVsZXRlIEBjb25maWcucGx1Z2lucy5wcm9wZXJ0aWVzW2NvZGVdXG5cbiAgb2JzZXJ2ZVBsdWdpbjogKGNvZGUsIHBsdWdpbiwga2V5KSAtPlxuICAgIEBwbHVnaW5TdWJzY3JpcHRpb25zW2NvZGVdID0gYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgIGtleSwgKGlzRW5hYmxlZCkgPT5cbiAgICAgICAgaWYgaXNFbmFibGVkXG4gICAgICAgICAgcGx1Z2luLmVuYWJsZT8oQGFwaSlcbiAgICAgICAgICBAZW5hYmxlZFBsdWdpbnNbY29kZV0gPSBwbHVnaW5cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBsdWdpbi5kaXNhYmxlPygpXG4gICAgICAgICAgZGVsZXRlIEBlbmFibGVkUGx1Z2luc1tjb2RlXVxuICAgIClcblxuICB1bm9ic2VydmVQbHVnaW46IChjb2RlKSAtPlxuICAgIEBwbHVnaW5TdWJzY3JpcHRpb25zW2NvZGVdPy5kaXNwb3NlKClcbiAgICBkZWxldGUgQHBsdWdpblN1YnNjcmlwdGlvbnNbY29kZV1cblxuICBvbkVuYWJsZWQ6IChjYWxsYmFjaykgLT5cbiAgICBmb3IgY29kZSwgcGx1Z2luIG9mIEBlbmFibGVkUGx1Z2luc1xuICAgICAgY29udGludWUgaWYgY2FsbGJhY2sgY29kZSwgcGx1Z2luXG5cbiAgdG9nZ2xlUGx1Z2luOiAoY29kZSkgLT5cbiAgICBpc0VuYWJsZWQgPSBhdG9tLmNvbmZpZy5nZXQgXCIje0BrZXl9LiN7Y29kZX1cIlxuICAgIGF0b20uY29uZmlnLnNldCBcIiN7QGtleX0uI3tjb2RlfVwiLCAhaXNFbmFibGVkXG5cbiAgaW5pdExpc3Q6IC0+XG4gICAgcmV0dXJuIGlmIEBwbHVnaW5MaXN0P1xuXG4gICAgQHBsdWdpbkxpc3QgPSByZXF1aXJlIFwiLi9wbHVnaW4tbGlzdFwiXG4gICAgQHBsdWdpbkxpc3QuaW5pdCB0aGlzXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLFxuICAgICAgXCJhY3RpdmF0ZS1wb3dlci1tb2RlOnNlbGVjdC1wbHVnaW5cIjogPT5cbiAgICAgICAgQHBsdWdpbkxpc3QudG9nZ2xlKClcbiJdfQ==
