(function() {
  var CompositeDisposable, path;

  CompositeDisposable = require("atom").CompositeDisposable;

  path = require("path");

  module.exports = {
    enabled: false,
    subscriptions: null,
    conf: [],
    init: function() {
      return this.enableSubscription = atom.config.observe('activate-power-mode.playAudio.enabled', (function(_this) {
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
      return this.initConfigSubscribers();
    },
    disable: function() {
      var ref;
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    },
    observe: function(key, loadAudio) {
      if (loadAudio == null) {
        loadAudio = true;
      }
      return this.subscriptions.add(atom.config.observe("activate-power-mode.playAudio." + key, (function(_this) {
        return function(value) {
          _this.conf[key] = value;
          if (loadAudio) {
            return _this.loadAudio();
          }
        };
      })(this)));
    },
    initConfigSubscribers: function() {
      this.subscriptions = new CompositeDisposable;
      this.observe('audioclip');
      this.observe('customAudioclip');
      return this.observe('volume', false);
    },
    loadAudio: function() {
      var pathtoaudio;
      if (this.conf['audioclip'] === 'customAudioclip' && this.conf['customAudioclip']) {
        pathtoaudio = this.conf['customAudioclip'];
      } else {
        pathtoaudio = path.join(__dirname + "/..", this.conf['audioclip']);
      }
      return this.audio = new Audio(pathtoaudio);
    },
    play: function(audio) {
      if (!this.enabled) {
        return;
      }
      if (!audio) {
        audio = this.audio;
      }
      audio.currentTime = 0;
      audio.volume = this.conf['volume'];
      return audio.play();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3NlcnZpY2UvYXVkaW8tcGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE9BQUEsRUFBUyxLQUFUO0lBQ0EsYUFBQSxFQUFlLElBRGY7SUFFQSxJQUFBLEVBQU0sRUFGTjtJQUlBLElBQUEsRUFBTSxTQUFBO2FBQ0osSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNwQix1Q0FEb0IsRUFDcUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7VUFDdkMsS0FBQyxDQUFBLE9BQUQsR0FBVztVQUNYLElBQUcsS0FBQyxDQUFBLE9BQUo7bUJBQ0UsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQURGO1dBQUEsTUFBQTttQkFHRSxLQUFDLENBQUEsT0FBRCxDQUFBLEVBSEY7O1FBRnVDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURyQjtJQURsQixDQUpOO0lBY0EsT0FBQSxFQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsa0JBQWtCLENBQUMsT0FBcEIsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELENBQUE7SUFGTyxDQWRUO0lBa0JBLE1BQUEsRUFBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLHFCQUFELENBQUE7SUFETSxDQWxCUjtJQXFCQSxPQUFBLEVBQVMsU0FBQTtBQUNQLFVBQUE7cURBQWMsQ0FBRSxPQUFoQixDQUFBO0lBRE8sQ0FyQlQ7SUF3QkEsT0FBQSxFQUFTLFNBQUMsR0FBRCxFQUFNLFNBQU47O1FBQU0sWUFBWTs7YUFDekIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUNqQixnQ0FBQSxHQUFpQyxHQURoQixFQUN1QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtVQUN0QyxLQUFDLENBQUEsSUFBSyxDQUFBLEdBQUEsQ0FBTixHQUFhO1VBQ2IsSUFBZ0IsU0FBaEI7bUJBQUEsS0FBQyxDQUFBLFNBQUQsQ0FBQSxFQUFBOztRQUZzQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEdkIsQ0FBbkI7SUFETyxDQXhCVDtJQStCQSxxQkFBQSxFQUF1QixTQUFBO01BQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLE9BQUQsQ0FBUyxXQUFUO01BQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyxpQkFBVDthQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsUUFBVCxFQUFtQixLQUFuQjtJQUpxQixDQS9CdkI7SUFxQ0EsU0FBQSxFQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsSUFBSyxDQUFBLFdBQUEsQ0FBTixLQUFzQixpQkFBdEIsSUFBNEMsSUFBQyxDQUFBLElBQUssQ0FBQSxpQkFBQSxDQUFyRDtRQUNFLFdBQUEsR0FBYyxJQUFDLENBQUEsSUFBSyxDQUFBLGlCQUFBLEVBRHRCO09BQUEsTUFBQTtRQUdFLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFhLFNBQUQsR0FBVyxLQUF2QixFQUE2QixJQUFDLENBQUEsSUFBSyxDQUFBLFdBQUEsQ0FBbkMsRUFIaEI7O2FBSUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLEtBQUosQ0FBVSxXQUFWO0lBTEEsQ0FyQ1g7SUE0Q0EsSUFBQSxFQUFNLFNBQUMsS0FBRDtNQUNKLElBQVUsQ0FBSSxJQUFDLENBQUEsT0FBZjtBQUFBLGVBQUE7O01BRUEsSUFBa0IsQ0FBSSxLQUF0QjtRQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBVDs7TUFDQSxLQUFLLENBQUMsV0FBTixHQUFvQjtNQUNwQixLQUFLLENBQUMsTUFBTixHQUFlLElBQUMsQ0FBQSxJQUFLLENBQUEsUUFBQTthQUNyQixLQUFLLENBQUMsSUFBTixDQUFBO0lBTkksQ0E1Q047O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5wYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGVuYWJsZWQ6IGZhbHNlXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgY29uZjogW11cblxuICBpbml0OiAtPlxuICAgIEBlbmFibGVTdWJzY3JpcHRpb24gPSBhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgJ2FjdGl2YXRlLXBvd2VyLW1vZGUucGxheUF1ZGlvLmVuYWJsZWQnLCAodmFsdWUpID0+XG4gICAgICAgIEBlbmFibGVkID0gdmFsdWVcbiAgICAgICAgaWYgQGVuYWJsZWRcbiAgICAgICAgICBAZW5hYmxlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBkaXNhYmxlKClcbiAgICApXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZW5hYmxlU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIEBkaXNhYmxlKClcblxuICBlbmFibGU6IC0+XG4gICAgQGluaXRDb25maWdTdWJzY3JpYmVycygpXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG5cbiAgb2JzZXJ2ZTogKGtleSwgbG9hZEF1ZGlvID0gdHJ1ZSkgLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgIFwiYWN0aXZhdGUtcG93ZXItbW9kZS5wbGF5QXVkaW8uI3trZXl9XCIsICh2YWx1ZSkgPT5cbiAgICAgICAgQGNvbmZba2V5XSA9IHZhbHVlXG4gICAgICAgIEBsb2FkQXVkaW8oKSBpZiBsb2FkQXVkaW9cbiAgICApXG5cbiAgaW5pdENvbmZpZ1N1YnNjcmliZXJzOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAb2JzZXJ2ZSAnYXVkaW9jbGlwJ1xuICAgIEBvYnNlcnZlICdjdXN0b21BdWRpb2NsaXAnXG4gICAgQG9ic2VydmUgJ3ZvbHVtZScsIGZhbHNlXG5cbiAgbG9hZEF1ZGlvOiAtPlxuICAgIGlmIEBjb25mWydhdWRpb2NsaXAnXSBpcyAnY3VzdG9tQXVkaW9jbGlwJyBhbmQgQGNvbmZbJ2N1c3RvbUF1ZGlvY2xpcCddXG4gICAgICBwYXRodG9hdWRpbyA9IEBjb25mWydjdXN0b21BdWRpb2NsaXAnXVxuICAgIGVsc2VcbiAgICAgIHBhdGh0b2F1ZGlvID0gcGF0aC5qb2luKFwiI3tfX2Rpcm5hbWV9Ly4uXCIsIEBjb25mWydhdWRpb2NsaXAnXSlcbiAgICBAYXVkaW8gPSBuZXcgQXVkaW8ocGF0aHRvYXVkaW8pXG5cbiAgcGxheTogKGF1ZGlvKSAtPlxuICAgIHJldHVybiBpZiBub3QgQGVuYWJsZWRcblxuICAgIGF1ZGlvID0gQGF1ZGlvIGlmIG5vdCBhdWRpb1xuICAgIGF1ZGlvLmN1cnJlbnRUaW1lID0gMFxuICAgIGF1ZGlvLnZvbHVtZSA9IEBjb25mWyd2b2x1bWUnXVxuICAgIGF1ZGlvLnBsYXkoKVxuIl19
