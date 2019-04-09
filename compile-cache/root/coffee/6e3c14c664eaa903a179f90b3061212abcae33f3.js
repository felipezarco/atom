(function() {
  var ParticlesEffect, Service;

  ParticlesEffect = require("./effect/particles");

  module.exports = Service = (function() {
    function Service(pluginRegistry, flowRegistry, effectRegistry) {
      this.pluginRegistry = pluginRegistry;
      this.flowRegistry = flowRegistry;
      this.effectRegistry = effectRegistry;
    }

    Service.prototype.registerPlugin = function(code, plugin) {
      return this.pluginRegistry.addPlugin(code, plugin);
    };

    Service.prototype.registerFlow = function(code, flow) {
      return this.flowRegistry.addFlow(code, flow);
    };

    Service.prototype.registerEffect = function(code, effect) {
      return this.effectRegistry.addEffect(code, effect);
    };

    Service.prototype.unregisterPlugin = function(code) {
      return this.pluginRegistry.removePlugin(code);
    };

    Service.prototype.unregisterFlow = function(code) {
      return this.flowRegistry.removeFlow(code);
    };

    Service.prototype.unregisterEffect = function(code) {
      return this.effectRegistry.removeEffect(code);
    };

    Service.prototype.createParticlesEffect = function(particleManager) {
      return new ParticlesEffect(particleManager);
    };

    return Service;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3NlcnZpY2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUjs7RUFFbEIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7SUFDUixpQkFBQyxjQUFELEVBQWlCLFlBQWpCLEVBQStCLGNBQS9CO01BQ1gsSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFIUDs7c0JBS2IsY0FBQSxHQUFnQixTQUFDLElBQUQsRUFBTyxNQUFQO2FBQ2QsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUEwQixJQUExQixFQUFnQyxNQUFoQztJQURjOztzQkFHaEIsWUFBQSxHQUFjLFNBQUMsSUFBRCxFQUFPLElBQVA7YUFDWixJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUI7SUFEWTs7c0JBR2QsY0FBQSxHQUFnQixTQUFDLElBQUQsRUFBTyxNQUFQO2FBQ2QsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUEwQixJQUExQixFQUFnQyxNQUFoQztJQURjOztzQkFHaEIsZ0JBQUEsR0FBa0IsU0FBQyxJQUFEO2FBQ2hCLElBQUMsQ0FBQSxjQUFjLENBQUMsWUFBaEIsQ0FBNkIsSUFBN0I7SUFEZ0I7O3NCQUdsQixjQUFBLEdBQWdCLFNBQUMsSUFBRDthQUNkLElBQUMsQ0FBQSxZQUFZLENBQUMsVUFBZCxDQUF5QixJQUF6QjtJQURjOztzQkFHaEIsZ0JBQUEsR0FBa0IsU0FBQyxJQUFEO2FBQ2hCLElBQUMsQ0FBQSxjQUFjLENBQUMsWUFBaEIsQ0FBNkIsSUFBN0I7SUFEZ0I7O3NCQUdsQixxQkFBQSxHQUF1QixTQUFDLGVBQUQ7YUFDckIsSUFBSSxlQUFKLENBQW9CLGVBQXBCO0lBRHFCOzs7OztBQTFCekIiLCJzb3VyY2VzQ29udGVudCI6WyJQYXJ0aWNsZXNFZmZlY3QgPSByZXF1aXJlIFwiLi9lZmZlY3QvcGFydGljbGVzXCJcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTZXJ2aWNlXG4gIGNvbnN0cnVjdG9yOiAocGx1Z2luUmVnaXN0cnksIGZsb3dSZWdpc3RyeSwgZWZmZWN0UmVnaXN0cnkpIC0+XG4gICAgQHBsdWdpblJlZ2lzdHJ5ID0gcGx1Z2luUmVnaXN0cnlcbiAgICBAZmxvd1JlZ2lzdHJ5ID0gZmxvd1JlZ2lzdHJ5XG4gICAgQGVmZmVjdFJlZ2lzdHJ5ID0gZWZmZWN0UmVnaXN0cnlcblxuICByZWdpc3RlclBsdWdpbjogKGNvZGUsIHBsdWdpbikgLT5cbiAgICBAcGx1Z2luUmVnaXN0cnkuYWRkUGx1Z2luIGNvZGUsIHBsdWdpblxuXG4gIHJlZ2lzdGVyRmxvdzogKGNvZGUsIGZsb3cpIC0+XG4gICAgQGZsb3dSZWdpc3RyeS5hZGRGbG93IGNvZGUsIGZsb3dcblxuICByZWdpc3RlckVmZmVjdDogKGNvZGUsIGVmZmVjdCkgLT5cbiAgICBAZWZmZWN0UmVnaXN0cnkuYWRkRWZmZWN0IGNvZGUsIGVmZmVjdFxuXG4gIHVucmVnaXN0ZXJQbHVnaW46IChjb2RlKSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5yZW1vdmVQbHVnaW4gY29kZVxuXG4gIHVucmVnaXN0ZXJGbG93OiAoY29kZSkgLT5cbiAgICBAZmxvd1JlZ2lzdHJ5LnJlbW92ZUZsb3cgY29kZVxuXG4gIHVucmVnaXN0ZXJFZmZlY3Q6IChjb2RlKSAtPlxuICAgIEBlZmZlY3RSZWdpc3RyeS5yZW1vdmVFZmZlY3QgY29kZVxuXG4gIGNyZWF0ZVBhcnRpY2xlc0VmZmVjdDogKHBhcnRpY2xlTWFuYWdlcikgLT5cbiAgICBuZXcgUGFydGljbGVzRWZmZWN0KHBhcnRpY2xlTWFuYWdlcilcbiJdfQ==
