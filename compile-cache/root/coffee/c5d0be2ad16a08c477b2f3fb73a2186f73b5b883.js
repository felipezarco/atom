(function() {
  var Api;

  module.exports = Api = (function() {
    function Api(editorRegistry, comboApi, screenShaker, audioPlayer) {
      this.editorRegistry = editorRegistry;
      this.screenShaker = screenShaker;
      this.audioPlayer = audioPlayer;
      this.combo = comboApi;
    }

    Api.prototype.shakeScreen = function(intensity) {
      if (intensity == null) {
        intensity = null;
      }
      return this.screenShaker.shake(this.editorRegistry.getScrollView(), intensity);
    };

    Api.prototype.playAudio = function(audio) {
      return this.audioPlayer.play(audio);
    };

    Api.prototype.getEditor = function() {
      return this.editorRegistry.getEditor();
    };

    Api.prototype.getEditorElement = function() {
      return this.editorRegistry.getEditorElement();
    };

    Api.prototype.getCombo = function() {
      return this.combo;
    };

    return Api;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2FwaS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0lBQ1IsYUFBQyxjQUFELEVBQWlCLFFBQWpCLEVBQTJCLFlBQTNCLEVBQXlDLFdBQXpDO01BQ1gsSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFDaEIsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFKRTs7a0JBTWIsV0FBQSxHQUFhLFNBQUMsU0FBRDs7UUFBQyxZQUFZOzthQUN4QixJQUFDLENBQUEsWUFBWSxDQUFDLEtBQWQsQ0FBb0IsSUFBQyxDQUFBLGNBQWMsQ0FBQyxhQUFoQixDQUFBLENBQXBCLEVBQXFELFNBQXJEO0lBRFc7O2tCQUdiLFNBQUEsR0FBVyxTQUFDLEtBQUQ7YUFDVCxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsS0FBbEI7SUFEUzs7a0JBR1gsU0FBQSxHQUFXLFNBQUE7YUFDVCxJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLENBQUE7SUFEUzs7a0JBR1gsZ0JBQUEsR0FBa0IsU0FBQTthQUNoQixJQUFDLENBQUEsY0FBYyxDQUFDLGdCQUFoQixDQUFBO0lBRGdCOztrQkFHbEIsUUFBQSxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUE7SUFETzs7Ozs7QUFuQloiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEFwaVxuICBjb25zdHJ1Y3RvcjogKGVkaXRvclJlZ2lzdHJ5LCBjb21ib0FwaSwgc2NyZWVuU2hha2VyLCBhdWRpb1BsYXllcikgLT5cbiAgICBAZWRpdG9yUmVnaXN0cnkgPSBlZGl0b3JSZWdpc3RyeVxuICAgIEBzY3JlZW5TaGFrZXIgPSBzY3JlZW5TaGFrZXJcbiAgICBAYXVkaW9QbGF5ZXIgPSBhdWRpb1BsYXllclxuICAgIEBjb21ibyA9IGNvbWJvQXBpXG5cbiAgc2hha2VTY3JlZW46IChpbnRlbnNpdHkgPSBudWxsKSAtPlxuICAgIEBzY3JlZW5TaGFrZXIuc2hha2UgQGVkaXRvclJlZ2lzdHJ5LmdldFNjcm9sbFZpZXcoKSwgaW50ZW5zaXR5XG5cbiAgcGxheUF1ZGlvOiAoYXVkaW8pIC0+XG4gICAgQGF1ZGlvUGxheWVyLnBsYXkoYXVkaW8pXG5cbiAgZ2V0RWRpdG9yOiAtPlxuICAgIEBlZGl0b3JSZWdpc3RyeS5nZXRFZGl0b3IoKVxuXG4gIGdldEVkaXRvckVsZW1lbnQ6IC0+XG4gICAgQGVkaXRvclJlZ2lzdHJ5LmdldEVkaXRvckVsZW1lbnQoKVxuXG4gIGdldENvbWJvOiAtPlxuICAgIEBjb21ib1xuIl19
