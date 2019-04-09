(function() {
  var CompositeDisposable, random, throttle;

  CompositeDisposable = require("atom").CompositeDisposable;

  throttle = require("lodash.throttle");

  random = require("lodash.random");

  module.exports = {
    enabled: false,
    subscriptions: null,
    conf: [],
    init: function() {
      return this.enableSubscription = atom.config.observe('activate-power-mode.screenShake.enabled', (function(_this) {
        return function(value) {
          _this.enabled = value;
          if (_this.enabled) {
            return _this.enable();
          } else {
            return _this.disable();
          }
        };
      })(this));
    },
    destroy: function() {
      this.enableSubscription.dispose();
      return this.disable();
    },
    enable: function() {
      this.initConfigSubscribers();
      return this.throttledShake = throttle(this.shakeElement.bind(this), 100, {
        trailing: false
      });
    },
    disable: function() {
      var ref;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    },
    observe: function(key) {
      return this.subscriptions.add(atom.config.observe("activate-power-mode.screenShake." + key, (function(_this) {
        return function(value) {
          return _this.conf[key] = value;
        };
      })(this)));
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('minIntensity');
      return this.observe('maxIntensity');
    },
    shake: function(element, intensity) {
      if (this.enabled) {
        return this.throttledShake(element, intensity);
      }
    },
    shakeElement: function(element, intensity) {
      var max, min, x, y;
      min = this.conf['minIntensity'];
      max = this.conf['maxIntensity'];
      if (intensity === 'max') {
        min = max - min;
        max = max + 2;
      } else if (intensity === 'min') {
        max = max - min;
      }
      x = this.shakeIntensity(min, max);
      y = this.shakeIntensity(min, max);
      element.style.transform = "translate(" + x + "px, " + y + "px)";
      return setTimeout(function() {
        return element.style.transform = "";
      }, 75);
    },
    shakeIntensity: function(min, max) {
      var direction;
      direction = Math.random() > 0.5 ? -1 : 1;
      return random(min, max, true) * direction;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3NlcnZpY2Uvc2NyZWVuLXNoYWtlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUjs7RUFDWCxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE9BQUEsRUFBUyxLQUFUO0lBQ0EsYUFBQSxFQUFlLElBRGY7SUFFQSxJQUFBLEVBQU0sRUFGTjtJQUlBLElBQUEsRUFBTSxTQUFBO2FBQ0osSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNwQix5Q0FEb0IsRUFDdUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7VUFDekMsS0FBQyxDQUFBLE9BQUQsR0FBVztVQUNYLElBQUcsS0FBQyxDQUFBLE9BQUo7bUJBQ0UsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQURGO1dBQUEsTUFBQTttQkFHRSxLQUFDLENBQUEsT0FBRCxDQUFBLEVBSEY7O1FBRnlDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUR2QjtJQURsQixDQUpOO0lBY0EsT0FBQSxFQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsa0JBQWtCLENBQUMsT0FBcEIsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELENBQUE7SUFGTyxDQWRUO0lBa0JBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLHFCQUFELENBQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixRQUFBLENBQVMsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLElBQW5CLENBQVQsRUFBbUMsR0FBbkMsRUFBd0M7UUFBQSxRQUFBLEVBQVUsS0FBVjtPQUF4QztJQUZaLENBbEJSO0lBc0JBLE9BQUEsRUFBUyxTQUFBO0FBQ1AsVUFBQTtxREFBYyxDQUFFLE9BQWhCLENBQUE7SUFETyxDQXRCVDtJQXlCQSxPQUFBLEVBQVMsU0FBQyxHQUFEO2FBQ1AsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNqQixrQ0FBQSxHQUFtQyxHQURsQixFQUN5QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFDeEMsS0FBQyxDQUFBLElBQUssQ0FBQSxHQUFBLENBQU4sR0FBYTtRQUQyQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEekIsQ0FBbkI7SUFETyxDQXpCVDtJQStCQSxxQkFBQSxFQUF1QixTQUFBO01BQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLE9BQUQsQ0FBUyxjQUFUO2FBQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxjQUFUO0lBSHFCLENBL0J2QjtJQW9DQSxLQUFBLEVBQU8sU0FBQyxPQUFELEVBQVUsU0FBVjtNQUNMLElBQXVDLElBQUMsQ0FBQSxPQUF4QztlQUFBLElBQUMsQ0FBQSxjQUFELENBQWdCLE9BQWhCLEVBQXlCLFNBQXpCLEVBQUE7O0lBREssQ0FwQ1A7SUF1Q0EsWUFBQSxFQUFjLFNBQUMsT0FBRCxFQUFVLFNBQVY7QUFDWixVQUFBO01BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxJQUFLLENBQUEsY0FBQTtNQUNaLEdBQUEsR0FBTSxJQUFDLENBQUEsSUFBSyxDQUFBLGNBQUE7TUFDWixJQUFHLFNBQUEsS0FBYSxLQUFoQjtRQUNFLEdBQUEsR0FBTSxHQUFBLEdBQU07UUFDWixHQUFBLEdBQU0sR0FBQSxHQUFNLEVBRmQ7T0FBQSxNQUdLLElBQUcsU0FBQSxLQUFhLEtBQWhCO1FBQ0gsR0FBQSxHQUFNLEdBQUEsR0FBTSxJQURUOztNQUdMLENBQUEsR0FBSSxJQUFDLENBQUEsY0FBRCxDQUFnQixHQUFoQixFQUFxQixHQUFyQjtNQUNKLENBQUEsR0FBSSxJQUFDLENBQUEsY0FBRCxDQUFnQixHQUFoQixFQUFxQixHQUFyQjtNQUVKLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBZCxHQUEwQixZQUFBLEdBQWEsQ0FBYixHQUFlLE1BQWYsR0FBcUIsQ0FBckIsR0FBdUI7YUFFakQsVUFBQSxDQUFXLFNBQUE7ZUFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQWQsR0FBMEI7TUFEakIsQ0FBWCxFQUVFLEVBRkY7SUFkWSxDQXZDZDtJQXlEQSxjQUFBLEVBQWdCLFNBQUMsR0FBRCxFQUFNLEdBQU47QUFDZCxVQUFBO01BQUEsU0FBQSxHQUFlLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixHQUFuQixHQUE0QixDQUFDLENBQTdCLEdBQW9DO2FBQ2hELE1BQUEsQ0FBTyxHQUFQLEVBQVksR0FBWixFQUFpQixJQUFqQixDQUFBLEdBQXlCO0lBRlgsQ0F6RGhCOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSBcImF0b21cIlxudGhyb3R0bGUgPSByZXF1aXJlIFwibG9kYXNoLnRocm90dGxlXCJcbnJhbmRvbSA9IHJlcXVpcmUgXCJsb2Rhc2gucmFuZG9tXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBlbmFibGVkOiBmYWxzZVxuICBzdWJzY3JpcHRpb25zOiBudWxsXG4gIGNvbmY6IFtdXG5cbiAgaW5pdDogLT5cbiAgICBAZW5hYmxlU3Vic2NyaXB0aW9uID0gYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgICdhY3RpdmF0ZS1wb3dlci1tb2RlLnNjcmVlblNoYWtlLmVuYWJsZWQnLCAodmFsdWUpID0+XG4gICAgICAgIEBlbmFibGVkID0gdmFsdWVcbiAgICAgICAgaWYgQGVuYWJsZWRcbiAgICAgICAgICBAZW5hYmxlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBkaXNhYmxlKClcbiAgICApXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZW5hYmxlU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIEBkaXNhYmxlKClcblxuICBlbmFibGU6IC0+XG4gICAgQGluaXRDb25maWdTdWJzY3JpYmVycygpXG4gICAgQHRocm90dGxlZFNoYWtlID0gdGhyb3R0bGUgQHNoYWtlRWxlbWVudC5iaW5kKHRoaXMpLCAxMDAsIHRyYWlsaW5nOiBmYWxzZVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuXG4gIG9ic2VydmU6IChrZXkpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICBcImFjdGl2YXRlLXBvd2VyLW1vZGUuc2NyZWVuU2hha2UuI3trZXl9XCIsICh2YWx1ZSkgPT5cbiAgICAgICAgQGNvbmZba2V5XSA9IHZhbHVlXG4gICAgKVxuXG4gIGluaXRDb25maWdTdWJzY3JpYmVyczogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQG9ic2VydmUgJ21pbkludGVuc2l0eSdcbiAgICBAb2JzZXJ2ZSAnbWF4SW50ZW5zaXR5J1xuXG4gIHNoYWtlOiAoZWxlbWVudCwgaW50ZW5zaXR5KSAtPlxuICAgIEB0aHJvdHRsZWRTaGFrZShlbGVtZW50LCBpbnRlbnNpdHkpIGlmIEBlbmFibGVkXG5cbiAgc2hha2VFbGVtZW50OiAoZWxlbWVudCwgaW50ZW5zaXR5KSAtPlxuICAgIG1pbiA9IEBjb25mWydtaW5JbnRlbnNpdHknXVxuICAgIG1heCA9IEBjb25mWydtYXhJbnRlbnNpdHknXVxuICAgIGlmIGludGVuc2l0eSBpcyAnbWF4J1xuICAgICAgbWluID0gbWF4IC0gbWluXG4gICAgICBtYXggPSBtYXggKyAyXG4gICAgZWxzZSBpZiBpbnRlbnNpdHkgaXMgJ21pbidcbiAgICAgIG1heCA9IG1heCAtIG1pblxuXG4gICAgeCA9IEBzaGFrZUludGVuc2l0eSBtaW4sIG1heFxuICAgIHkgPSBAc2hha2VJbnRlbnNpdHkgbWluLCBtYXhcblxuICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoI3t4fXB4LCAje3l9cHgpXCJcblxuICAgIHNldFRpbWVvdXQgLT5cbiAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJcIlxuICAgICwgNzVcblxuICBzaGFrZUludGVuc2l0eTogKG1pbiwgbWF4KSAtPlxuICAgIGRpcmVjdGlvbiA9IGlmIE1hdGgucmFuZG9tKCkgPiAwLjUgdGhlbiAtMSBlbHNlIDFcbiAgICByYW5kb20obWluLCBtYXgsIHRydWUpICogZGlyZWN0aW9uXG4iXX0=
