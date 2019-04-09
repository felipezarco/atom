(function() {
  var CompositeDisposable, colorHelper, random;

  CompositeDisposable = require("atom").CompositeDisposable;

  random = require("lodash.random");

  colorHelper = require("./color-helper");

  module.exports = {
    api: null,
    colorHelper: colorHelper,
    subscriptions: null,
    conf: [],
    phaseStep: 0,
    setEffectRegistry: function(effectRegistry) {
      return this.effectRegistry = effectRegistry;
    },
    enable: function(api) {
      this.api = api;
      this.initConfigSubscribers();
      this.colorHelper.init();
      return this.initResizeObserver();
    },
    init: function() {
      this.effectRegistry.effect.init(this.api);
      return this.animationOn();
    },
    getEffect: function() {
      return this.effectRegistry.effect;
    },
    resetCanvas: function() {
      var ref, ref1;
      this.animationOff();
      if ((ref = this.resizeObserver) != null) {
        ref.disconnect();
      }
      if ((ref1 = this.canvas) != null) {
        ref1.style.display = "none";
      }
      this.editor = null;
      return this.editorElement = null;
    },
    animationOff: function() {
      cancelAnimationFrame(this.animationFrame);
      return this.animationFrame = null;
    },
    animationOn: function() {
      return this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    },
    destroy: function() {
      var ref, ref1, ref2, ref3, ref4;
      this.resetCanvas();
      if ((ref = this.effectRegistry) != null) {
        ref.effect.disable();
      }
      if ((ref1 = this.canvas) != null) {
        ref1.parentNode.removeChild(this.canvas);
      }
      this.canvas = null;
      if ((ref2 = this.subscriptions) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.colorHelper) != null) {
        ref3.disable();
      }
      this.api = null;
      if ((ref4 = this.resizeObserver) != null) {
        ref4.disconnect();
      }
      return this.resizeObserver = null;
    },
    initResizeObserver: function() {
      return this.resizeObserver = new ResizeObserver((function(_this) {
        return function() {
          _this.updateCanvasDimesions();
          return _this.calculateOffsets();
        };
      })(this));
    },
    setupCanvas: function(editor, editorElement) {
      if (!this.canvas) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.classList.add("power-mode-canvas");
        this.initConfigSubscribers();
      }
      this.scrollView = editorElement.querySelector(".scroll-view");
      this.scrollView.appendChild(this.canvas);
      this.canvas.style.display = "block";
      this.editorElement = editorElement;
      this.editor = editor;
      this.updateCanvasDimesions();
      this.calculateOffsets();
      this.resizeObserver.observe(this.scrollView);
      return this.init();
    },
    observe: function(key) {
      return this.subscriptions.add(atom.config.observe("activate-power-mode.particles." + key, (function(_this) {
        return function(value) {
          return _this.conf[key] = value;
        };
      })(this)));
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('spawnCount.min');
      this.observe('spawnCount.max');
      this.observe('totalCount.max');
      this.observe('size.min');
      return this.observe('size.max');
    },
    spawn: function(cursor, screenPosition, input, size) {
      var colorGenerate, colorGenerator, position, randomSize;
      position = this.calculatePositions(screenPosition);
      colorGenerator = this.colorHelper.generateColors(cursor, this.editorElement);
      randomSize = (function(_this) {
        return function() {
          return _this.randomSize(size);
        };
      })(this);
      colorGenerate = function() {
        return colorGenerator.next().value;
      };
      return this.effectRegistry.effect.spawn(position, colorGenerate, input, randomSize, this.conf);
    },
    randomSize: function(size) {
      var max, min;
      min = this.conf['size.min'];
      max = this.conf['size.max'];
      if (size === 'max') {
        return random(max - min + 2, max + 2, true);
      } else if (size === 'min') {
        return random(min - 1, max - min, true);
      } else {
        return random(min, max, true);
      }
    },
    calculatePositions: function(screenPosition) {
      var left, ref, top;
      ref = this.editorElement.pixelPositionForScreenPosition(screenPosition), left = ref.left, top = ref.top;
      return {
        left: left + this.offsetLeft - this.editorElement.getScrollLeft(),
        top: top + this.offsetTop - this.editorElement.getScrollTop() + this.editor.getLineHeightInPixels() / 2
      };
    },
    calculateOffsets: function() {
      if (!this.scrollView) {
        return;
      }
      this.offsetLeft = 0;
      return this.offsetTop = this.scrollView.offsetTop;
    },
    updateCanvasDimesions: function() {
      if (!this.editorElement) {
        return;
      }
      this.canvas.width = this.editorElement.offsetWidth;
      this.canvas.height = this.editorElement.offsetHeight;
      this.canvas.style.width = this.editorElement.width;
      return this.canvas.style.height = this.editorElement.height;
    },
    animate: function() {
      this.animationOn();
      this.effectRegistry.effect.update();
      if (this.phaseStep === 0) {
        this.canvas.width = this.canvas.width;
        this.effectRegistry.effect.animate(this.context);
      }
      this.phaseStep++;
      if (this.phaseStep > 2) {
        return this.phaseStep = 0;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2NhbnZhcy1yZW5kZXJlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBQSxHQUFTLE9BQUEsQ0FBUSxlQUFSOztFQUNULFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLEdBQUEsRUFBSyxJQUFMO0lBQ0EsV0FBQSxFQUFhLFdBRGI7SUFFQSxhQUFBLEVBQWUsSUFGZjtJQUdBLElBQUEsRUFBTSxFQUhOO0lBSUEsU0FBQSxFQUFXLENBSlg7SUFNQSxpQkFBQSxFQUFtQixTQUFDLGNBQUQ7YUFDakIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFERCxDQU5uQjtJQVNBLE1BQUEsRUFBUSxTQUFDLEdBQUQ7TUFDTixJQUFDLENBQUEsR0FBRCxHQUFPO01BQ1AsSUFBQyxDQUFBLHFCQUFELENBQUE7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxrQkFBRCxDQUFBO0lBSk0sQ0FUUjtJQWVBLElBQUEsRUFBTSxTQUFBO01BQ0osSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBdkIsQ0FBNEIsSUFBQyxDQUFBLEdBQTdCO2FBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtJQUZJLENBZk47SUFtQkEsU0FBQSxFQUFXLFNBQUE7YUFDVCxJQUFDLENBQUEsY0FBYyxDQUFDO0lBRFAsQ0FuQlg7SUFzQkEsV0FBQSxFQUFhLFNBQUE7QUFDWCxVQUFBO01BQUEsSUFBQyxDQUFBLFlBQUQsQ0FBQTs7V0FDZSxDQUFFLFVBQWpCLENBQUE7OztZQUNPLENBQUUsS0FBSyxDQUFDLE9BQWYsR0FBeUI7O01BQ3pCLElBQUMsQ0FBQSxN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Q0FBQSxTQUFELEtBQWMsQ0FBakI7UUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQztRQUN4QixJQUFDLENBQUEsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUF2QixDQUErQixJQUFDLENBQUEsT0FBaEMsRUFGRjs7TUFJQSxJQUFDLENBQUEsU0FBRDtNQUNBLElBQWtCLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBL0I7ZUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBQWI7O0lBUk8sQ0F0SFQ7O0FBTEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5yYW5kb20gPSByZXF1aXJlIFwibG9kYXNoLnJhbmRvbVwiXG5jb2xvckhlbHBlciA9IHJlcXVpcmUgXCIuL2NvbG9yLWhlbHBlclwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYXBpOiBudWxsXG4gIGNvbG9ySGVscGVyOiBjb2xvckhlbHBlclxuICBzdWJzY3JpcHRpb25zOiBudWxsXG4gIGNvbmY6IFtdXG4gIHBoYXNlU3RlcDogMFxuXG4gIHNldEVmZmVjdFJlZ2lzdHJ5OiAoZWZmZWN0UmVnaXN0cnkpIC0+XG4gICAgQGVmZmVjdFJlZ2lzdHJ5ID0gZWZmZWN0UmVnaXN0cnlcblxuICBlbmFibGU6IChhcGkpIC0+XG4gICAgQGFwaSA9IGFwaVxuICAgIEBpbml0Q29uZmlnU3Vic2NyaWJlcnMoKVxuICAgIEBjb2xvckhlbHBlci5pbml0KClcbiAgICBAaW5pdFJlc2l6ZU9ic2VydmVyKClcblxuICBpbml0OiAtPlxuICAgIEBlZmZlY3RSZWdpc3RyeS5lZmZlY3QuaW5pdChAYXBpKVxuICAgIEBhbmltYXRpb25PbigpXG5cbiAgZ2V0RWZmZWN0OiAtPlxuICAgIEBlZmZlY3RSZWdpc3RyeS5lZmZlY3RcblxuICByZXNldENhbnZhczogLT5cbiAgICBAYW5pbWF0aW9uT2ZmKClcbiAgICBAcmVzaXplT2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKVxuICAgIEBjYW52YXM/LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuICAgIEBlZGl0b3IgPSBudWxsXG4gICAgQGVkaXRvckVsZW1lbnQgPSBudWxsXG5cbiAgYW5pbWF0aW9uT2ZmOiAtPlxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKEBhbmltYXRpb25GcmFtZSlcbiAgICBAYW5pbWF0aW9uRnJhbWUgPSBudWxsXG5cbiAgYW5pbWF0aW9uT246IC0+XG4gICAgQGFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIEBhbmltYXRlLmJpbmQodGhpcylcblxuICBkZXN0cm95OiAtPlxuICAgIEByZXNldENhbnZhcygpXG4gICAgQGVmZmVjdFJlZ2lzdHJ5Py5lZmZlY3QuZGlzYWJsZSgpXG4gICAgQGNhbnZhcz8ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCBAY2FudmFzXG4gICAgQGNhbnZhcyA9IG51bGxcbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGNvbG9ySGVscGVyPy5kaXNhYmxlKClcbiAgICBAYXBpID0gbnVsbFxuICAgIEByZXNpemVPYnNlcnZlcj8uZGlzY29ubmVjdCgpXG4gICAgQHJlc2l6ZU9ic2VydmVyID0gbnVsbFxuXG4gIGluaXRSZXNpemVPYnNlcnZlcjogLT5cbiAgICBAcmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIgKCkgPT5cbiAgICAgIEB1cGRhdGVDYW52YXNEaW1lc2lvbnMoKVxuICAgICAgQGNhbGN1bGF0ZU9mZnNldHMoKVxuXG4gIHNldHVwQ2FudmFzOiAoZWRpdG9yLCBlZGl0b3JFbGVtZW50KSAtPlxuICAgIGlmIG5vdCBAY2FudmFzXG4gICAgICBAY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcImNhbnZhc1wiXG4gICAgICBAY29udGV4dCA9IEBjYW52YXMuZ2V0Q29udGV4dCBcIjJkXCJcbiAgICAgIEBjYW52YXMuY2xhc3NMaXN0LmFkZCBcInBvd2VyLW1vZGUtY2FudmFzXCJcbiAgICAgIEBpbml0Q29uZmlnU3Vic2NyaWJlcnMoKVxuXG4gICAgQHNjcm9sbFZpZXcgPSBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2Nyb2xsLXZpZXdcIilcbiAgICBAc2Nyb2xsVmlldy5hcHBlbmRDaGlsZCBAY2FudmFzXG4gICAgQGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiXG4gICAgQGVkaXRvckVsZW1lbnQgPSBlZGl0b3JFbGVtZW50XG4gICAgQGVkaXRvciA9IGVkaXRvclxuICAgIEB1cGRhdGVDYW52YXNEaW1lc2lvbnMoKVxuICAgIEBjYWxjdWxhdGVPZmZzZXRzKClcbiAgICBAcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZShAc2Nyb2xsVmlldylcblxuICAgIEBpbml0KClcblxuICBvYnNlcnZlOiAoa2V5KSAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlIFwiYWN0aXZhdGUtcG93ZXItbW9kZS5wYXJ0aWNsZXMuI3trZXl9XCIsICh2YWx1ZSkgPT5cbiAgICAgIEBjb25mW2tleV0gPSB2YWx1ZVxuXG4gIGluaXRDb25maWdTdWJzY3JpYmVyczogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQG9ic2VydmUgJ3NwYXduQ291bnQubWluJ1xuICAgIEBvYnNlcnZlICdzcGF3bkNvdW50Lm1heCdcbiAgICBAb2JzZXJ2ZSAndG90YWxDb3VudC5tYXgnXG4gICAgQG9ic2VydmUgJ3NpemUubWluJ1xuICAgIEBvYnNlcnZlICdzaXplLm1heCdcblxuICBzcGF3bjogKGN1cnNvciwgc2NyZWVuUG9zaXRpb24sIGlucHV0LCBzaXplKSAtPlxuICAgIHBvc2l0aW9uID0gQGNhbGN1bGF0ZVBvc2l0aW9ucyBzY3JlZW5Qb3NpdGlvblxuICAgIGNvbG9yR2VuZXJhdG9yID0gQGNvbG9ySGVscGVyLmdlbmVyYXRlQ29sb3JzIGN1cnNvciwgQGVkaXRvckVsZW1lbnRcbiAgICByYW5kb21TaXplID0gPT4gQHJhbmRvbVNpemUoc2l6ZSlcbiAgICBjb2xvckdlbmVyYXRlID0gLT4gY29sb3JHZW5lcmF0b3IubmV4dCgpLnZhbHVlXG5cbiAgICBAZWZmZWN0UmVnaXN0cnkuZWZmZWN0LnNwYXduIHBvc2l0aW9uLCBjb2xvckdlbmVyYXRlLCBpbnB1dCwgcmFuZG9tU2l6ZSwgQGNvbmZcblxuICByYW5kb21TaXplOiAoc2l6ZSkgLT5cbiAgICBtaW4gPSBAY29uZlsnc2l6ZS5taW4nXVxuICAgIG1heCA9IEBjb25mWydzaXplLm1heCddXG5cbiAgICBpZiBzaXplIGlzICdtYXgnXG4gICAgICByYW5kb20gbWF4IC0gbWluICsgMiwgbWF4ICsgMiwgdHJ1ZVxuICAgIGVsc2UgaWYgc2l6ZSBpcyAnbWluJ1xuICAgICAgcmFuZG9tIG1pbiAtIDEsIG1heCAtIG1pbiwgdHJ1ZVxuICAgIGVsc2VcbiAgICAgIHJhbmRvbSBtaW4sIG1heCwgdHJ1ZVxuXG4gIGNhbGN1bGF0ZVBvc2l0aW9uczogKHNjcmVlblBvc2l0aW9uKSAtPlxuICAgIHtsZWZ0LCB0b3B9ID0gQGVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uIHNjcmVlblBvc2l0aW9uXG4gICAgbGVmdDogbGVmdCArIEBvZmZzZXRMZWZ0IC0gQGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsTGVmdCgpXG4gICAgdG9wOiB0b3AgKyBAb2Zmc2V0VG9wIC0gQGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsVG9wKCkgKyBAZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpIC8gMlxuXG4gIGNhbGN1bGF0ZU9mZnNldHM6IC0+XG4gICAgcmV0dXJuIGlmIG5vdCBAc2Nyb2xsVmlld1xuICAgIEBvZmZzZXRMZWZ0ID0gMFxuICAgIEBvZmZzZXRUb3AgPSBAc2Nyb2xsVmlldy5vZmZzZXRUb3BcblxuICB1cGRhdGVDYW52YXNEaW1lc2lvbnM6IC0+XG4gICAgcmV0dXJuIGlmIG5vdCBAZWRpdG9yRWxlbWVudFxuICAgIEBjYW52YXMud2lkdGggPSBAZWRpdG9yRWxlbWVudC5vZmZzZXRXaWR0aFxuICAgIEBjYW52YXMuaGVpZ2h0ID0gQGVkaXRvckVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gICAgQGNhbnZhcy5zdHlsZS53aWR0aCA9IEBlZGl0b3JFbGVtZW50LndpZHRoXG4gICAgQGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBAZWRpdG9yRWxlbWVudC5oZWlnaHRcblxuICBhbmltYXRlOiAtPlxuICAgIEBhbmltYXRpb25PbigpXG4gICAgQGVmZmVjdFJlZ2lzdHJ5LmVmZmVjdC51cGRhdGUoKVxuICAgIGlmIEBwaGFzZVN0ZXAgaXMgMFxuICAgICAgQGNhbnZhcy53aWR0aCA9IEBjYW52YXMud2lkdGhcbiAgICAgIEBlZmZlY3RSZWdpc3RyeS5lZmZlY3QuYW5pbWF0ZShAY29udGV4dClcblxuICAgIEBwaGFzZVN0ZXArK1xuICAgIEBwaGFzZVN0ZXAgPSAwIGlmIEBwaGFzZVN0ZXAgPiAyXG4iXX0=
