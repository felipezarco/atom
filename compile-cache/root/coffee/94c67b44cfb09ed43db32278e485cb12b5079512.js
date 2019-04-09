(function() {
  var CompositeDisposable, debounce, sample;

  CompositeDisposable = require("atom").CompositeDisposable;

  debounce = require("lodash.debounce");

  sample = require("lodash.sample");

  module.exports = {
    subscriptions: null,
    conf: [],
    isEnable: false,
    currentStreak: 0,
    level: 0,
    maxStreakReached: false,
    setPluginManager: function(pluginManager) {
      return this.pluginManager = pluginManager;
    },
    observe: function(key) {
      return this.subscriptions.add(atom.config.observe("activate-power-mode.comboMode." + key, (function(_this) {
        return function(value) {
          return _this.conf[key] = value;
        };
      })(this)));
    },
    enable: function() {
      this.isEnable = true;
      return this.initConfigSubscribers();
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('exclamationEvery');
      this.observe('activationThreshold');
      this.observe('exclamationTexts');
      this.observe('multiplier');
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        "activate-power-mode:reset-max-combo": (function(_this) {
          return function() {
            return _this.resetMaxStreak();
          };
        })(this)
      }));
    },
    reset: function() {
      var ref, ref1;
      return (ref = this.container) != null ? (ref1 = ref.parentNode) != null ? ref1.removeChild(this.container) : void 0 : void 0;
    },
    destroy: function() {
      var ref, ref1, ref2, ref3;
      this.isEnable = false;
      this.reset();
      if ((ref = this.subscriptions) != null) {
        ref.dispose();
      }
      this.container = null;
      if ((ref1 = this.debouncedEndStreak) != null) {
        ref1.cancel();
      }
      this.debouncedEndStreak = null;
      if ((ref2 = this.streakTimeoutObserver) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.opacityObserver) != null) {
        ref3.dispose();
      }
      this.currentStreak = 0;
      this.level = 0;
      return this.maxStreakReached = false;
    },
    createElement: function(name, parent) {
      this.element = document.createElement("div");
      this.element.classList.add(name);
      if (parent) {
        parent.appendChild(this.element);
      }
      return this.element;
    },
    setup: function(editorElement) {
      var leftTimeout, ref, ref1;
      if (!this.container) {
        this.maxStreak = this.getMaxStreak();
        this.container = this.createElement("streak-container");
        this.container.classList.add("combo-zero");
        this.title = this.createElement("title", this.container);
        this.title.textContent = "Combo";
        this.max = this.createElement("max", this.container);
        this.max.textContent = "Max " + this.maxStreak;
        this.counter = this.createElement("counter", this.container);
        this.bar = this.createElement("bar", this.container);
        this.exclamations = this.createElement("exclamations", this.container);
        if ((ref = this.streakTimeoutObserver) != null) {
          ref.dispose();
        }
        this.streakTimeoutObserver = atom.config.observe('activate-power-mode.comboMode.streakTimeout', (function(_this) {
          return function(value) {
            var ref1;
            _this.streakTimeout = value * 1000;
            _this.endStreak();
            if ((ref1 = _this.debouncedEndStreak) != null) {
              ref1.cancel();
            }
            return _this.debouncedEndStreak = debounce(_this.endStreak.bind(_this), _this.streakTimeout);
          };
        })(this));
        if ((ref1 = this.opacityObserver) != null) {
          ref1.dispose();
        }
        this.opacityObserver = atom.config.observe('activate-power-mode.comboMode.opacity', (function(_this) {
          return function(value) {
            var ref2;
            return (ref2 = _this.container) != null ? ref2.style.opacity = value : void 0;
          };
        })(this));
      }
      this.exclamations.innerHTML = '';
      editorElement.querySelector(".scroll-view").appendChild(this.container);
      if (this.currentStreak) {
        leftTimeout = this.streakTimeout - (performance.now() - this.lastStreak);
        this.refreshStreakBar(leftTimeout);
      }
      return this.renderStreak();
    },
    resetCounter: function() {
      if (this.currentStreak === 0) {
        return;
      }
      this.showExclamation("" + (-this.currentStreak), 'down', false);
      return this.endStreak();
    },
    modifyStreak: function(n) {
      var oldStreak;
      if (this.currentStreak === 0 && n < 0) {
        return;
      }
      this.lastStreak = performance.now();
      this.debouncedEndStreak();
      if (n > 0 && this.conf['multiplier']) {
        n = n * (this.level + 1);
      }
      oldStreak = this.currentStreak;
      this.currentStreak += n;
      if (this.currentStreak < 0) {
        this.currentStreak = 0;
      }
      if (n > 0) {
        this.streakIncreased(n);
      }
      if (n < 0) {
        this.streakDecreased(n);
      }
      if (this.currentStreak === 0) {
        this.endStreak();
      } else {
        this.refreshStreakBar();
      }
      this.renderStreak();
      if (oldStreak === 0 && n > 0) {
        return this.pluginManager.runOnComboStartStreak();
      }
    },
    streakIncreased: function(n) {
      var mod, ref;
      this.container.classList.remove("combo-zero");
      if (this.currentStreak > this.maxStreak) {
        this.increaseMaxStreak();
      }
      if (this.checkLevel()) {
        return;
      }
      if (this.conf['exclamationEvery'] > 0) {
        mod = this.currentStreak % this.conf['exclamationEvery'];
        if (mod === 0 || ((this.currentStreak - n < (ref = this.currentStreak - mod) && ref < this.currentStreak))) {
          return this.showExclamation();
        }
      }
      return this.showExclamation("+" + n, 'up', false);
    },
    streakDecreased: function(n) {
      this.showExclamation("" + n, 'down', false);
      this.checkLevel();
      if (this.currentStreak === 0) {
        return this.container.classList.add("combo-zero");
      }
    },
    checkLevel: function() {
      var i, j, len, level, ref, threshold;
      level = 0;
      ref = this.conf['activationThreshold'];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        threshold = ref[i];
        if (this.currentStreak < threshold) {
          break;
        }
        level++;
      }
      if (level !== this.level) {
        this.container.classList.remove("level-" + this.level);
        this.container.classList.add("level-" + level);
        if (this.conf['multiplier']) {
          this.showExclamation((level + 1) + "x", 'level', false);
        }
        this.pluginManager.runOnComboLevelChange(level, this.level);
        this.level = level;
        return true;
      }
    },
    getLevel: function() {
      return this.level;
    },
    getCurrentStreak: function() {
      return this.currentStreak;
    },
    endStreak: function() {
      this.currentStreak = 0;
      this.maxStreakReached = false;
      this.container.classList.add("combo-zero");
      this.container.classList.remove("level-" + this.level);
      this.level = 0;
      this.container.classList.add("level-" + this.level);
      this.renderStreak();
      this.refreshStreakBar(0);
      return this.pluginManager.runOnComboEndStreak();
    },
    renderStreak: function() {
      this.counter.textContent = this.currentStreak;
      this.counter.classList.remove("bump");
      return setTimeout((function(_this) {
        return function() {
          return _this.counter.classList.add("bump");
        };
      })(this), 26);
    },
    refreshStreakBar: function(leftTimeout) {
      var scale;
      if (leftTimeout == null) {
        leftTimeout = this.streakTimeout;
      }
      scale = leftTimeout / this.streakTimeout;
      this.bar.style.transition = "none";
      this.bar.style.transform = "scaleX(" + scale + ")";
      return setTimeout((function(_this) {
        return function() {
          _this.bar.style.transform = "";
          return _this.bar.style.transition = "transform " + leftTimeout + "ms linear";
        };
      })(this), 100);
    },
    showExclamation: function(text, type, trigger) {
      var exclamation;
      if (text == null) {
        text = null;
      }
      if (type == null) {
        type = 'message';
      }
      if (trigger == null) {
        trigger = true;
      }
      exclamation = document.createElement("span");
      exclamation.classList.add("exclamation");
      exclamation.classList.add(type);
      if (text === null) {
        text = sample(this.conf['exclamationTexts']);
      }
      exclamation.textContent = text;
      this.exclamations.appendChild(exclamation);
      setTimeout((function(_this) {
        return function() {
          if (exclamation.parentNode === _this.exclamations) {
            return _this.exclamations.removeChild(exclamation);
          }
        };
      })(this), 2000);
      if (trigger) {
        return this.pluginManager.runOnComboExclamation(text);
      }
    },
    getMaxStreak: function() {
      var maxStreak;
      maxStreak = localStorage.getItem("activate-power-mode.maxStreak");
      if (maxStreak === null) {
        maxStreak = 0;
      }
      return maxStreak;
    },
    increaseMaxStreak: function() {
      localStorage.setItem("activate-power-mode.maxStreak", this.currentStreak);
      this.maxStreak = this.currentStreak;
      this.max.textContent = "Max " + this.maxStreak;
      if (this.maxStreakReached === false) {
        this.showExclamation("NEW MAX!!!", 'max-combo', false);
        this.pluginManager.runOnComboMaxStreak(this.maxStreak);
      }
      return this.maxStreakReached = true;
    },
    resetMaxStreak: function() {
      localStorage.setItem("activate-power-mode.maxStreak", 0);
      this.maxStreakReached = false;
      this.maxStreak = 0;
      if (this.max) {
        return this.max.textContent = "Max 0";
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2NvbWJvLXJlbmRlcmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUNYLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsYUFBQSxFQUFlLElBQWY7SUFDQSxJQUFBLEVBQU0sRUFETjtJQUVBLFFBQUEsRUFBVSxLQUZWO0lBR0EsYUFBQSxFQUFlLENBSGY7SUFJQSxLQUFBLEVBQU8sQ0FKUDtJQUtBLGdCQUFBLEVBQWtCLEtBTGxCO0lBT0EsZ0JBQUEsRUFBa0IsU0FBQyxhQUFEO2FBQ2hCLElBQUMsQ0FBQSxhQUFELEdBQWlCO0lBREQsQ0FQbEI7SUFVQSxPQUFBLEVBQVMsU0FBQyxHQUFEO2FBQ1AsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNqQixnQ0FBQSxHQUFpQyxHQURoQixFQUN1QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFDdEMsS0FBQyxDQUFBLElBQUssQ0FBQSxHQUFBLENBQU4sR0FBYTtRQUR5QjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEdkIsQ0FBbkI7SUFETyxDQVZUO0lBZ0JBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLFFBQUQsR0FBWTthQUNaLElBQUMsQ0FBQSxxQkFBRCxDQUFBO0lBRk0sQ0FoQlI7SUFvQkEscUJBQUEsRUFBdUIsU0FBQTtNQUNyQixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxPQUFELENBQVMsa0JBQVQ7TUFDQSxJQUFDLENBQUEsT0FB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cUIsK0JBQXJCLEVBQXNELENBQXREO01BQ0EsSUFBQyxDQUFBLGdCQUFELEdBQW9CO01BQ3BCLElBQUMsQ0FBQSxTQUFELEdBQWE7TUFDYixJQUFHLElBQUMsQ0FBQSxHQUFKO2VBQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFMLEdBQW1CLFFBRHJCOztJQUpjLENBeE5oQjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgXCJhdG9tXCJcbmRlYm91bmNlID0gcmVxdWlyZSBcImxvZGFzaC5kZWJvdW5jZVwiXG5zYW1wbGUgPSByZXF1aXJlIFwibG9kYXNoLnNhbXBsZVwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBjb25mOiBbXVxuICBpc0VuYWJsZTogZmFsc2VcbiAgY3VycmVudFN0cmVhazogMFxuICBsZXZlbDogMFxuICBtYXhTdHJlYWtSZWFjaGVkOiBmYWxzZVxuXG4gIHNldFBsdWdpbk1hbmFnZXI6IChwbHVnaW5NYW5hZ2VyKSAtPlxuICAgIEBwbHVnaW5NYW5hZ2VyID0gcGx1Z2luTWFuYWdlclxuXG4gIG9ic2VydmU6IChrZXkpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICBcImFjdGl2YXRlLXBvd2VyLW1vZGUuY29tYm9Nb2RlLiN7a2V5fVwiLCAodmFsdWUpID0+XG4gICAgICAgIEBjb25mW2tleV0gPSB2YWx1ZVxuICAgIClcblxuICBlbmFibGU6IC0+XG4gICAgQGlzRW5hYmxlID0gdHJ1ZVxuICAgIEBpbml0Q29uZmlnU3Vic2NyaWJlcnMoKVxuXG4gIGluaXRDb25maWdTdWJzY3JpYmVyczogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQG9ic2VydmUgJ2V4Y2xhbWF0aW9uRXZlcnknXG4gICAgQG9ic2VydmUgJ2FjdGl2YXRpb25UaHJlc2hvbGQnXG4gICAgQG9ic2VydmUgJ2V4Y2xhbWF0aW9uVGV4dHMnXG4gICAgQG9ic2VydmUgJ211bHRpcGxpZXInXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgIFwiYWN0aXZhdGUtcG93ZXItbW9kZTpyZXNldC1tYXgtY29tYm9cIjogPT4gQHJlc2V0TWF4U3RyZWFrKClcblxuICByZXNldDogLT5cbiAgICBAY29udGFpbmVyPy5wYXJlbnROb2RlPy5yZW1vdmVDaGlsZCBAY29udGFpbmVyXG5cbiAgZGVzdHJveTogLT5cbiAgICBAaXNFbmFibGUgPSBmYWxzZVxuICAgIEByZXNldCgpXG4gICAgQHN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxuICAgIEBjb250YWluZXIgPSBudWxsXG4gICAgQGRlYm91bmNlZEVuZFN0cmVhaz8uY2FuY2VsKClcbiAgICBAZGVib3VuY2VkRW5kU3RyZWFrID0gbnVsbFxuICAgIEBzdHJlYWtUaW1lb3V0T2JzZXJ2ZXI/LmRpc3Bvc2UoKVxuICAgIEBvcGFjaXR5T2JzZXJ2ZXI/LmRpc3Bvc2UoKVxuICAgIEBjdXJyZW50U3RyZWFrID0gMFxuICAgIEBsZXZlbCA9IDBcbiAgICBAbWF4U3RyZWFrUmVhY2hlZCA9IGZhbHNlXG5cbiAgY3JlYXRlRWxlbWVudDogKG5hbWUsIHBhcmVudCktPlxuICAgIEBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcImRpdlwiXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCBuYW1lXG4gICAgcGFyZW50LmFwcGVuZENoaWxkIEBlbGVtZW50IGlmIHBhcmVudFxuICAgIEBlbGVtZW50XG5cbiAgc2V0dXA6IChlZGl0b3JFbGVtZW50KSAtPlxuICAgIGlmIG5vdCBAY29udGFpbmVyXG4gICAgICBAbWF4U3RyZWFrID0gQGdldE1heFN0cmVhaygpXG4gICAgICBAY29udGFpbmVyID0gQGNyZWF0ZUVsZW1lbnQgXCJzdHJlYWstY29udGFpbmVyXCJcbiAgICAgIEBjb250YWluZXIuY2xhc3NMaXN0LmFkZCBcImNvbWJvLXplcm9cIlxuICAgICAgQHRpdGxlID0gQGNyZWF0ZUVsZW1lbnQgXCJ0aXRsZVwiLCBAY29udGFpbmVyXG4gICAgICBAdGl0bGUudGV4dENvbnRlbnQgPSBcIkNvbWJvXCJcbiAgICAgIEBtYXggPSBAY3JlYXRlRWxlbWVudCBcIm1heFwiLCBAY29udGFpbmVyXG4gICAgICBAbWF4LnRleHRDb250ZW50ID0gXCJNYXggI3tAbWF4U3RyZWFrfVwiXG4gICAgICBAY291bnRlciA9IEBjcmVhdGVFbGVtZW50IFwiY291bnRlclwiLCBAY29udGFpbmVyXG4gICAgICBAYmFyID0gQGNyZWF0ZUVsZW1lbnQgXCJiYXJcIiwgQGNvbnRhaW5lclxuICAgICAgQGV4Y2xhbWF0aW9ucyA9IEBjcmVhdGVFbGVtZW50IFwiZXhjbGFtYXRpb25zXCIsIEBjb250YWluZXJcblxuICAgICAgQHN0cmVha1RpbWVvdXRPYnNlcnZlcj8uZGlzcG9zZSgpXG4gICAgICBAc3RyZWFrVGltZW91dE9ic2VydmVyID0gYXRvbS5jb25maWcub2JzZXJ2ZSAnYWN0aXZhdGUtcG93ZXItbW9kZS5jb21ib01vZGUuc3RyZWFrVGltZW91dCcsICh2YWx1ZSkgPT5cbiAgICAgICAgQHN0cmVha1RpbWVvdXQgPSB2YWx1ZSAqIDEwMDBcbiAgICAgICAgQGVuZFN0cmVhaygpXG4gICAgICAgIEBkZWJvdW5jZWRFbmRTdHJlYWs/LmNhbmNlbCgpXG4gICAgICAgIEBkZWJvdW5jZWRFbmRTdHJlYWsgPSBkZWJvdW5jZSBAZW5kU3RyZWFrLmJpbmQodGhpcyksIEBzdHJlYWtUaW1lb3V0XG5cbiAgICAgIEBvcGFjaXR5T2JzZXJ2ZXI/LmRpc3Bvc2UoKVxuICAgICAgQG9wYWNpdHlPYnNlcnZlciA9IGF0b20uY29uZmlnLm9ic2VydmUgJ2FjdGl2YXRlLXBvd2VyLW1vZGUuY29tYm9Nb2RlLm9wYWNpdHknLCAodmFsdWUpID0+XG4gICAgICAgIEBjb250YWluZXI/LnN0eWxlLm9wYWNpdHkgPSB2YWx1ZVxuXG4gICAgQGV4Y2xhbWF0aW9ucy5pbm5lckhUTUwgPSAnJ1xuXG4gICAgZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLnNjcm9sbC12aWV3XCIpLmFwcGVuZENoaWxkIEBjb250YWluZXJcblxuICAgIGlmIEBjdXJyZW50U3RyZWFrXG4gICAgICBsZWZ0VGltZW91dCA9IEBzdHJlYWtUaW1lb3V0IC0gKHBlcmZvcm1hbmNlLm5vdygpIC0gQGxhc3RTdHJlYWspXG4gICAgICBAcmVmcmVzaFN0cmVha0JhciBsZWZ0VGltZW91dFxuXG4gICAgQHJlbmRlclN0cmVhaygpXG5cbiAgcmVzZXRDb3VudGVyOiAtPlxuICAgIHJldHVybiBpZiBAY3VycmVudFN0cmVhayBpcyAwXG5cblxuICAgIEBzaG93RXhjbGFtYXRpb24gXCIjey1AY3VycmVudFN0cmVha31cIiwgJ2Rvd24nLCBmYWxzZVxuICAgIEBlbmRTdHJlYWsoKVxuXG4gIG1vZGlmeVN0cmVhazogKG4pIC0+XG4gICAgcmV0dXJuIGlmIEBjdXJyZW50U3RyZWFrIGlzIDAgYW5kIG4gPCAwXG5cbiAgICBAbGFzdFN0cmVhayA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgQGRlYm91bmNlZEVuZFN0cmVhaygpXG5cbiAgICBuID0gbiAqIChAbGV2ZWwgKyAxKSBpZiBuID4gMCBhbmQgQGNvbmZbJ211bHRpcGxpZXInXVxuXG4gICAgb2xkU3RyZWFrID0gQGN1cnJlbnRTdHJlYWtcbiAgICBAY3VycmVudFN0cmVhayArPSBuXG4gICAgQGN1cnJlbnRTdHJlYWsgPSAwIGlmIEBjdXJyZW50U3RyZWFrIDwgMFxuXG4gICAgQHN0cmVha0luY3JlYXNlZCBuIGlmIG4gPiAwXG4gICAgQHN0cmVha0RlY3JlYXNlZCBuIGlmIG4gPCAwXG5cbiAgICBpZiBAY3VycmVudFN0cmVhayBpcyAwXG4gICAgICBAZW5kU3RyZWFrKClcbiAgICBlbHNlXG4gICAgICBAcmVmcmVzaFN0cmVha0JhcigpXG4gICAgQHJlbmRlclN0cmVhaygpXG5cbiAgICBpZiBvbGRTdHJlYWsgaXMgMCBhbmQgbiA+IDBcbiAgICAgIEBwbHVnaW5NYW5hZ2VyLnJ1bk9uQ29tYm9TdGFydFN0cmVhaygpXG5cbiAgc3RyZWFrSW5jcmVhc2VkOiAobikgLT5cbiAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUgXCJjb21iby16ZXJvXCJcbiAgICBpZiBAY3VycmVudFN0cmVhayA+IEBtYXhTdHJlYWtcbiAgICAgIEBpbmNyZWFzZU1heFN0cmVhaygpXG5cbiAgICByZXR1cm4gaWYgQGNoZWNrTGV2ZWwoKVxuXG4gICAgaWYgQGNvbmZbJ2V4Y2xhbWF0aW9uRXZlcnknXSA+IDBcbiAgICAgIG1vZCA9IEBjdXJyZW50U3RyZWFrICUgQGNvbmZbJ2V4Y2xhbWF0aW9uRXZlcnknXVxuICAgICAgaWYgbW9kIGlzIDAgb3IgKEBjdXJyZW50U3RyZWFrIC0gbiA8IEBjdXJyZW50U3RyZWFrIC0gbW9kIDwgQGN1cnJlbnRTdHJlYWspXG4gICAgICAgIHJldHVybiBAc2hvd0V4Y2xhbWF0aW9uKClcblxuICAgIEBzaG93RXhjbGFtYXRpb24gXCIrI3tufVwiLCAndXAnLCBmYWxzZVxuXG4gIHN0cmVha0RlY3JlYXNlZDogKG4pIC0+XG4gICAgQHNob3dFeGNsYW1hdGlvbiBcIiN7bn1cIiwgJ2Rvd24nLCBmYWxzZVxuXG4gICAgQGNoZWNrTGV2ZWwoKVxuICAgIGlmIEBjdXJyZW50U3RyZWFrID09IDBcbiAgICAgIEBjb250YWluZXIuY2xhc3NMaXN0LmFkZCBcImNvbWJvLXplcm9cIlxuXG4gIGNoZWNrTGV2ZWw6IC0+XG4gICAgbGV2ZWwgPSAwXG4gICAgZm9yIHRocmVzaG9sZCwgaSBpbiBAY29uZlsnYWN0aXZhdGlvblRocmVzaG9sZCddXG4gICAgICBicmVhayBpZiBAY3VycmVudFN0cmVhayA8IHRocmVzaG9sZFxuICAgICAgbGV2ZWwrK1xuXG4gICAgaWYgbGV2ZWwgIT0gQGxldmVsXG4gICAgICBAY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUgXCJsZXZlbC0je0BsZXZlbH1cIlxuICAgICAgQGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkIFwibGV2ZWwtI3tsZXZlbH1cIlxuICAgICAgQHNob3dFeGNsYW1hdGlvbiBcIiN7bGV2ZWwrMX14XCIsICdsZXZlbCcsIGZhbHNlIGlmIEBjb25mWydtdWx0aXBsaWVyJ11cbiAgICAgIEBwbHVnaW5NYW5hZ2VyLnJ1bk9uQ29tYm9MZXZlbENoYW5nZShsZXZlbCwgQGxldmVsKVxuICAgICAgQGxldmVsID0gbGV2ZWxcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgZ2V0TGV2ZWw6IC0+XG4gICAgQGxldmVsXG5cbiAgZ2V0Q3VycmVudFN0cmVhazogLT5cbiAgICBAY3VycmVudFN0cmVha1xuXG4gIGVuZFN0cmVhazogLT5cbiAgICBAY3VycmVudFN0cmVhayA9IDBcbiAgICBAbWF4U3RyZWFrUmVhY2hlZCA9IGZhbHNlXG4gICAgQGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkIFwiY29tYm8temVyb1wiXG4gICAgQGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlIFwibGV2ZWwtI3tAbGV2ZWx9XCJcbiAgICBAbGV2ZWwgPSAwXG4gICAgQGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkIFwibGV2ZWwtI3tAbGV2ZWx9XCJcbiAgICBAcmVuZGVyU3RyZWFrKClcbiAgICBAcmVmcmVzaFN0cmVha0JhcigwKVxuICAgIEBwbHVnaW5NYW5hZ2VyLnJ1bk9uQ29tYm9FbmRTdHJlYWsoKVxuXG4gIHJlbmRlclN0cmVhazogLT5cbiAgICBAY291bnRlci50ZXh0Q29udGVudCA9IEBjdXJyZW50U3RyZWFrXG4gICAgQGNvdW50ZXIuY2xhc3NMaXN0LnJlbW92ZSBcImJ1bXBcIlxuXG4gICAgc2V0VGltZW91dCA9PlxuICAgICAgQGNvdW50ZXIuY2xhc3NMaXN0LmFkZCBcImJ1bXBcIlxuICAgICwgMjZcblxuICByZWZyZXNoU3RyZWFrQmFyOiAobGVmdFRpbWVvdXQgPSBAc3RyZWFrVGltZW91dCkgLT5cbiAgICBzY2FsZSA9IGxlZnRUaW1lb3V0IC8gQHN0cmVha1RpbWVvdXRcbiAgICBAYmFyLnN0eWxlLnRyYW5zaXRpb24gPSBcIm5vbmVcIlxuICAgIEBiYXIuc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZVgoI3tzY2FsZX0pXCJcblxuICAgIHNldFRpbWVvdXQgPT5cbiAgICAgIEBiYXIuc3R5bGUudHJhbnNmb3JtID0gXCJcIlxuICAgICAgQGJhci5zdHlsZS50cmFuc2l0aW9uID0gXCJ0cmFuc2Zvcm0gI3tsZWZ0VGltZW91dH1tcyBsaW5lYXJcIlxuICAgICwgMTAwXG5cbiAgc2hvd0V4Y2xhbWF0aW9uOiAodGV4dCA9IG51bGwsIHR5cGUgPSAnbWVzc2FnZScsIHRyaWdnZXIgPSB0cnVlKSAtPlxuICAgIGV4Y2xhbWF0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcInNwYW5cIlxuICAgIGV4Y2xhbWF0aW9uLmNsYXNzTGlzdC5hZGQgXCJleGNsYW1hdGlvblwiXG4gICAgZXhjbGFtYXRpb24uY2xhc3NMaXN0LmFkZCB0eXBlXG4gICAgdGV4dCA9IHNhbXBsZSBAY29uZlsnZXhjbGFtYXRpb25UZXh0cyddIGlmIHRleHQgaXMgbnVsbFxuICAgIGV4Y2xhbWF0aW9uLnRleHRDb250ZW50ID0gdGV4dFxuXG4gICAgQGV4Y2xhbWF0aW9ucy5hcHBlbmRDaGlsZCBleGNsYW1hdGlvblxuICAgIHNldFRpbWVvdXQgPT5cbiAgICAgIGlmIGV4Y2xhbWF0aW9uLnBhcmVudE5vZGUgaXMgQGV4Y2xhbWF0aW9uc1xuICAgICAgICBAZXhjbGFtYXRpb25zLnJlbW92ZUNoaWxkIGV4Y2xhbWF0aW9uXG4gICAgLCAyMDAwXG5cbiAgICBpZiB0cmlnZ2VyXG4gICAgICBAcGx1Z2luTWFuYWdlci5ydW5PbkNvbWJvRXhjbGFtYXRpb24odGV4dClcblxuICBnZXRNYXhTdHJlYWs6IC0+XG4gICAgbWF4U3RyZWFrID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0gXCJhY3RpdmF0ZS1wb3dlci1tb2RlLm1heFN0cmVha1wiXG4gICAgbWF4U3RyZWFrID0gMCBpZiBtYXhTdHJlYWsgaXMgbnVsbFxuICAgIG1heFN0cmVha1xuXG4gIGluY3JlYXNlTWF4U3RyZWFrOiAtPlxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtIFwiYWN0aXZhdGUtcG93ZXItbW9kZS5tYXhTdHJlYWtcIiwgQGN1cnJlbnRTdHJlYWtcbiAgICBAbWF4U3RyZWFrID0gQGN1cnJlbnRTdHJlYWtcbiAgICBAbWF4LnRleHRDb250ZW50ID0gXCJNYXggI3tAbWF4U3RyZWFrfVwiXG4gICAgaWYgQG1heFN0cmVha1JlYWNoZWQgaXMgZmFsc2VcbiAgICAgIEBzaG93RXhjbGFtYXRpb24gXCJORVcgTUFYISEhXCIsICdtYXgtY29tYm8nLCBmYWxzZVxuICAgICAgQHBsdWdpbk1hbmFnZXIucnVuT25Db21ib01heFN0cmVhayhAbWF4U3RyZWFrKVxuICAgIEBtYXhTdHJlYWtSZWFjaGVkID0gdHJ1ZVxuXG4gIHJlc2V0TWF4U3RyZWFrOiAtPlxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtIFwiYWN0aXZhdGUtcG93ZXItbW9kZS5tYXhTdHJlYWtcIiwgMFxuICAgIEBtYXhTdHJlYWtSZWFjaGVkID0gZmFsc2VcbiAgICBAbWF4U3RyZWFrID0gMFxuICAgIGlmIEBtYXhcbiAgICAgIEBtYXgudGV4dENvbnRlbnQgPSBcIk1heCAwXCJcbiJdfQ==
