(function() {
  var ParticlesEffect, random;

  random = require("lodash.random");

  module.exports = ParticlesEffect = (function() {
    ParticlesEffect.prototype.particles = [];

    function ParticlesEffect(particleManager) {
      this.title = particleManager.title;
      this.description = particleManager.description;
      this.image = particleManager.image;
      this.particleManager = particleManager;
    }

    ParticlesEffect.prototype.init = function() {
      return this.reset();
    };

    ParticlesEffect.prototype.disable = function() {
      return this.reset();
    };

    ParticlesEffect.prototype.reset = function() {
      return this.particles = [];
    };

    ParticlesEffect.prototype.spawn = function(position, colorGenerate, input, randomSize, conf) {
      var base, numParticles, particle, results;
      this.conf = conf;
      numParticles = random(this.conf['spawnCount.min'], this.conf['spawnCount.max']);
      results = [];
      while (numParticles--) {
        if (this.particles.length >= this.conf['totalCount.max']) {
          this.particles.shift();
        }
        if (this.particleManager.create != null) {
          particle = this.particleManager.create(position.left, position.top, colorGenerate, randomSize);
        } else {
          particle = this.createParticle(position.left, position.top, colorGenerate, randomSize);
          if (typeof (base = this.particleManager).init === "function") {
            base.init(particle);
          }
        }
        results.push(this.particles.push(particle));
      }
      return results;
    };

    ParticlesEffect.prototype.createParticle = function(x, y, colorGenerate, randomSize) {
      return {
        x: x,
        y: y,
        alpha: 1,
        color: colorGenerate(),
        size: randomSize(),
        velocity: {
          x: -1 + Math.random() * 2,
          y: -3.5 + Math.random() * 2
        }
      };
    };

    ParticlesEffect.prototype.update = function() {
      var i, j, particle, ref, results;
      if (!this.particles.length) {
        return;
      }
      results = [];
      for (i = j = ref = this.particles.length - 1; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
        particle = this.particles[i];
        if (this.particleManager.isDone(particle)) {
          this.particles.splice(i, 1);
          continue;
        }
        results.push(this.particleManager.update(particle));
      }
      return results;
    };

    ParticlesEffect.prototype.animate = function(context) {
      var gco, i, j, particle, ref;
      if (!this.particles.length) {
        return;
      }
      gco = context.globalCompositeOperation;
      context.globalCompositeOperation = "lighter";
      for (i = j = ref = this.particles.length - 1; ref <= 0 ? j <= 0 : j >= 0; i = ref <= 0 ? ++j : --j) {
        particle = this.particles[i];
        this.particleManager.draw(particle, context);
      }
      return context.globalCompositeOperation = gco;
    };

    return ParticlesEffect;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2VmZmVjdC9wYXJ0aWNsZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FBdUI7OEJBQ3JCLFNBQUEsR0FBVzs7SUFFRSx5QkFBQyxlQUFEO01BQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUyxlQUFlLENBQUM7TUFDekIsSUFBQyxDQUFBLFdBQUQsR0FBZSxlQUFlLENBQUM7TUFDL0IsSUFBQyxDQUFBLEtBQUQsR0FBUyxlQUFlLENBQUM7TUFDekIsSUFBQyxDQUFBLGVBQUQsR0FBbUI7SUFKUjs7OEJBTWIsSUFBQSxHQUFNLFNBQUE7YUFDSixJQUFDLENBQUEsS0FBRCxDQUFBO0lBREk7OzhCQUdOLE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLEtBQUQsQ0FBQTtJQURPOzs4QkFHVCxLQUFBLEdBQU8sU0FBQTthQUNMLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFEUjs7OEJBR1AsS0FBQSxHQUFPLFNBQUMsUUFBRCxFQUFXLGFBQVgsRUFBMEIsS0FBMUIsRUFBaUMsVUFBakMsRUFBNkMsSUFBN0M7QUFDTCxVQUFBO01BQUEsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLFlBQUEsR0FBZSxNQUFBLENBQU8sSUFBQyxDQUFBLElBQUssQ0FBQSxnQkFBQSxDQUFiLEVBQWdDLElBQUMsQ0FBQSxJQUFLLENBQUEsZ0JBQUEsQ0FBdEM7QUFFZjthQUFNLFlBQUEsRUFBTjtRQUNFLElBQXNCLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxJQUFxQixJQUFDLENBQUEsSUFBSyxDQUFBLGdCQUFBLENBQWpEO1VBQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQUEsRUFBQTs7UUFDQSxJQUFHLG1DQUFIO1VBQ0UsUUFBQSxHQUFXLElBQUMsQ0FBQSxlQUFlLENBQUMsTUFBakIsQ0FBd0IsUUFBUSxDQUFDLElBQWpDLEVBQXVDLFFBQVEsQ0FBQyxHQUFoRCxFQUFxRCxhQUFyRCxFQUFvRSxVQUFwRSxFQURiO1NBQUEsTUFBQTtVQUdFLFFBQUEsR0FBVyxJQUFDLENBQUEsY0FBRCxDQUFnQixRQUFRLENBQUMsSUFBekIsRUFBK0IsUUFBUSxDQUFDLEdBQXhDLEVBQTZDLGFBQTdDLEVBQTRELFVBQTVEOztnQkFDSyxDQUFDLEtBQU07V0FKekI7O3FCQU1BLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixRQUFoQjtNQVJGLENBQUE7O0lBSks7OzhCQWNQLGNBQUEsR0FBZ0IsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLGFBQVAsRUFBc0IsVUFBdEI7YUFDZDtRQUFBLENBQUEsRUFBRyxDQUFIO1FBQ0EsQ0FBQSxFQUFHLENBREg7UUFFQSxLQUFBLEVBQU8sQ0FGUDtRQUdBLEtBQUEsRUFBTyxhQUFBLENBQUEsQ0FIUDtRQUlBLElBQUEsRUFBTSxVQUFBLENBQUEsQ0FKTjtRQUtBLFFBQUEsRUFDRTtVQUFBLENBQUEsRUFBRyxDQUFDLENBQUQsR0FBSyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsQ0FBeEI7VUFDQSxDQUFBLEVBQUcsQ0FBQyxHQUFELEdBQU8sSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLENBRDFCO1NBTkY7O0lBRGM7OzhCQVVoQixNQUFBLEdBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxJQUFVLENBQUksSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUF6QjtBQUFBLGVBQUE7O0FBRUE7V0FBUyw2RkFBVDtRQUNFLFFBQUEsR0FBVyxJQUFDLENBQUEsU0FBVSxDQUFBLENBQUE7UUFFdEIsSUFBRyxJQUFDLENBQUEsZUFBZSxDQUFDLE1BQWpCLENBQXdCLFFBQXhCLENBQUg7VUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckI7QUFDQSxtQkFGRjs7cUJBSUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUF3QixRQUF4QjtBQVBGOztJQUhNOzs4QkFZUixPQUFBLEdBQVMsU0FBQyxPQUFEO0FBQ1AsVUFBQTtNQUFBLElBQVUsQ0FBSSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQXpCO0FBQUEsZUFBQTs7TUFFQSxHQUFBLEdBQU0sT0FBTyxDQUFDO01BQ2QsT0FBTyxDQUFDLHdCQUFSLEdBQW1DO0FBRW5DLFdBQVMsNkZBQVQ7UUFDRSxRQUFBLEdBQVcsSUFBQyxDQUFBLFNBQVUsQ0FBQSxDQUFBO1FBRXRCLElBQUMsQ0FBQSxlQUFlLENBQUMsSUFBakIsQ0FBc0IsUUFBdEIsRUFBZ0MsT0FBaEM7QUFIRjthQUtBLE9BQU8sQ0FBQyx3QkFBUixHQUFtQztJQVg1Qjs7Ozs7QUF4RFgiLCJzb3VyY2VzQ29udGVudCI6WyJyYW5kb20gPSByZXF1aXJlIFwibG9kYXNoLnJhbmRvbVwiXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGFydGljbGVzRWZmZWN0XG4gIHBhcnRpY2xlczogW11cblxuICBjb25zdHJ1Y3RvcjogKHBhcnRpY2xlTWFuYWdlcikgLT5cbiAgICBAdGl0bGUgPSBwYXJ0aWNsZU1hbmFnZXIudGl0bGVcbiAgICBAZGVzY3JpcHRpb24gPSBwYXJ0aWNsZU1hbmFnZXIuZGVzY3JpcHRpb25cbiAgICBAaW1hZ2UgPSBwYXJ0aWNsZU1hbmFnZXIuaW1hZ2VcbiAgICBAcGFydGljbGVNYW5hZ2VyID0gcGFydGljbGVNYW5hZ2VyXG5cbiAgaW5pdDogLT5cbiAgICBAcmVzZXQoKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQHJlc2V0KClcblxuICByZXNldDogLT5cbiAgICBAcGFydGljbGVzID0gW11cblxuICBzcGF3bjogKHBvc2l0aW9uLCBjb2xvckdlbmVyYXRlLCBpbnB1dCwgcmFuZG9tU2l6ZSwgY29uZikgLT5cbiAgICBAY29uZiA9IGNvbmZcbiAgICBudW1QYXJ0aWNsZXMgPSByYW5kb20gQGNvbmZbJ3NwYXduQ291bnQubWluJ10sIEBjb25mWydzcGF3bkNvdW50Lm1heCddXG5cbiAgICB3aGlsZSBudW1QYXJ0aWNsZXMtLVxuICAgICAgQHBhcnRpY2xlcy5zaGlmdCgpIGlmIEBwYXJ0aWNsZXMubGVuZ3RoID49IEBjb25mWyd0b3RhbENvdW50Lm1heCddXG4gICAgICBpZiBAcGFydGljbGVNYW5hZ2VyLmNyZWF0ZT9cbiAgICAgICAgcGFydGljbGUgPSBAcGFydGljbGVNYW5hZ2VyLmNyZWF0ZSBwb3NpdGlvbi5sZWZ0LCBwb3NpdGlvbi50b3AsIGNvbG9yR2VuZXJhdGUsIHJhbmRvbVNpemVcbiAgICAgIGVsc2VcbiAgICAgICAgcGFydGljbGUgPSBAY3JlYXRlUGFydGljbGUgcG9zaXRpb24ubGVmdCwgcG9zaXRpb24udG9wLCBjb2xvckdlbmVyYXRlLCByYW5kb21TaXplXG4gICAgICAgIEBwYXJ0aWNsZU1hbmFnZXIuaW5pdD8ocGFydGljbGUpXG5cbiAgICAgIEBwYXJ0aWNsZXMucHVzaCBwYXJ0aWNsZVxuXG4gIGNyZWF0ZVBhcnRpY2xlOiAoeCwgeSwgY29sb3JHZW5lcmF0ZSwgcmFuZG9tU2l6ZSkgLT5cbiAgICB4OiB4XG4gICAgeTogeVxuICAgIGFscGhhOiAxXG4gICAgY29sb3I6IGNvbG9yR2VuZXJhdGUoKVxuICAgIHNpemU6IHJhbmRvbVNpemUoKVxuICAgIHZlbG9jaXR5OlxuICAgICAgeDogLTEgKyBNYXRoLnJhbmRvbSgpICogMlxuICAgICAgeTogLTMuNSArIE1hdGgucmFuZG9tKCkgKiAyXG5cbiAgdXBkYXRlOiAtPlxuICAgIHJldHVybiBpZiBub3QgQHBhcnRpY2xlcy5sZW5ndGhcblxuICAgIGZvciBpIGluIFtAcGFydGljbGVzLmxlbmd0aCAtIDEgLi4wXVxuICAgICAgcGFydGljbGUgPSBAcGFydGljbGVzW2ldXG5cbiAgICAgIGlmIEBwYXJ0aWNsZU1hbmFnZXIuaXNEb25lIHBhcnRpY2xlXG4gICAgICAgIEBwYXJ0aWNsZXMuc3BsaWNlIGksIDFcbiAgICAgICAgY29udGludWVcblxuICAgICAgQHBhcnRpY2xlTWFuYWdlci51cGRhdGUgcGFydGljbGVcblxuICBhbmltYXRlOiAoY29udGV4dCkgLT5cbiAgICByZXR1cm4gaWYgbm90IEBwYXJ0aWNsZXMubGVuZ3RoXG5cbiAgICBnY28gPSBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvblxuICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJsaWdodGVyXCJcblxuICAgIGZvciBpIGluIFtAcGFydGljbGVzLmxlbmd0aCAtIDEgLi4wXVxuICAgICAgcGFydGljbGUgPSBAcGFydGljbGVzW2ldXG5cbiAgICAgIEBwYXJ0aWNsZU1hbmFnZXIuZHJhdyBwYXJ0aWNsZSwgY29udGV4dFxuXG4gICAgY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBnY29cbiJdfQ==
