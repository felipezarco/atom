(function() {
  var inputHandler,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  inputHandler = require("./input-handler");

  module.exports = {
    inputHandler: inputHandler,
    enable: function() {
      this.pluginManager.enable();
      this.changePaneSubscription = atom.workspace.onDidStopChangingActivePaneItem((function(_this) {
        return function() {
          return _this.setupPane();
        };
      })(this));
      return this.setupPane();
    },
    disable: function() {
      var ref, ref1, ref2;
      if ((ref = this.changePaneSubscription) != null) {
        ref.dispose();
      }
      if ((ref1 = this.inputSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.cursorSubscription) != null) {
        ref2.dispose();
      }
      return this.pluginManager.disable();
    },
    setPluginManager: function(pluginManager) {
      return this.pluginManager = pluginManager;
    },
    isExcludedFile: function() {
      var excluded, ref, ref1;
      excluded = this.getConfig("excludedFileTypes.excluded");
      return ref = (ref1 = this.editor.getPath()) != null ? ref1.split('.').pop() : void 0, indexOf.call(excluded, ref) >= 0;
    },
    setupPane: function() {
      var ref, ref1;
      if ((ref = this.inputSubscription) != null) {
        ref.dispose();
      }
      if ((ref1 = this.cursorSubscription) != null) {
        ref1.dispose();
      }
      this.editor = atom.workspace.getActiveTextEditor();
      if (!this.editor || this.isExcludedFile()) {
        this.pluginManager.runOnChangePane();
        return;
      }
      this.editorElement = this.editor.getElement();
      this.inputSubscription = this.editor.getBuffer().onDidChangeText(this.handleInput.bind(this));
      this.cursorSubscription = this.editor.observeCursors(this.handleCursor.bind(this));
      return this.pluginManager.runOnChangePane(this.editor, this.editorElement);
    },
    handleCursor: function(cursor) {
      return this.pluginManager.runOnNewCursor(cursor);
    },
    handleInput: function(e) {
      return requestIdleCallback((function(_this) {
        return function() {
          var cursor, i, input, len, ref, screenPos;
          ref = e.changes;
          for (i = 0, len = ref.length; i < len; i++) {
            input = ref[i];
            _this.inputHandler.handle(input);
            if (_this.inputHandler.isGhost()) {
              return;
            }
            screenPos = _this.editor.screenPositionForBufferPosition(_this.inputHandler.getPosition());
            cursor = _this.editor.getCursorAtScreenPosition(screenPos);
            if (!cursor) {
              return;
            }
            _this.pluginManager.runOnInput(cursor, screenPos, _this.inputHandler);
          }
        };
      })(this));
    },
    getConfig: function(config) {
      return atom.config.get("activate-power-mode." + config);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3Bvd2VyLWVkaXRvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLFlBQUE7SUFBQTs7RUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSOztFQUVmLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxZQUFBLEVBQWMsWUFBZDtJQUVBLE1BQUEsRUFBUSxTQUFBO01BQ04sSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUFmLENBQUE7TUFDQSxJQUFDLENBQUEsc0JBQUQsR0FBMEIsSUFBSSxDQUFDLFNBQVMsQ0FBQywrQkFBZixDQUErQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3ZFLEtBQUMsQ0FBQSxTQUFELENBQUE7UUFEdUU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9DO2FBRzFCLElBQUMsQ0FBQSxTQUFELENBQUE7SUFMTSxDQUZSO0lBU0EsT0FBQSxFQUFTLFNBQUE7QUFDUCxVQUFBOztXQUF1QixDQUFFLE9BQXpCLENBQUE7OztZQUNrQixDQUFFLE9BQXBCLENBQUE7OztZQUNtQixDQUFFLE9BQXJCLENBQUE7O2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7SUFKTyxDQVRUO0lBZUEsZ0JBQUEsRUFBa0IsU0FBQyxhQUFEO2FBQ2hCLElBQUMsQ0FBQSxhQUFELEdBQWlCO0lBREQsQ0FmbEI7SUFrQkEsY0FBQSxFQUFnQixTQUFBO0FBQ2QsVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsU0FBRCxDQUFXLDRCQUFYO2dFQUNNLENBQUUsS0FBbkIsQ0FBeUIsR0FBekIsQ0FBNkIsQ0FBQyxHQUE5QixDQUFBLFVBQUEsRUFBQSxhQUF1QyxRQUF2QyxFQUFBLEdBQUE7SUFGYyxDQWxCaEI7SUFzQkEsU0FBQSxFQUFXLFNBQUE7QUFDVCxVQUFBOztXQUFrQixDQUFFLE9BQXBCLENBQUE7OztZQUNtQixDQUFFLE9BQXJCLENBQUE7O01BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFFVixJQUFHLENBQUksSUFBQyxDQUFBLE1BQUwsSUFBZSxJQUFDLENBQUEsY0FBRCxDQUFBLENBQWxCO1FBQ0UsSUFBQyxDQUFBLGFBQWEsQ0FBQyxlQUFmLENBQUE7QUFDQSxlQUZGOztNQUlBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFBO01BRWpCLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLGVBQXBCLENBQW9DLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFsQixDQUFwQztNQUNyQixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQixJQUFuQixDQUF2QjthQUV0QixJQUFDLENBQUEsYUFBYSxDQUFDLGVBQWYsQ0FBK0IsSUFBQyxDQUFBLE1BQWhDLEVBQXdDLElBQUMsQ0FBQSxhQUF6QztJQWRTLENBdEJYO0lBc0NBLFlBQUEsRUFBYyxTQUFDLE1BQUQ7YUFDWixJQUFDLENBQUEsYUFBYSxDQUFDLGNBQWYsQ0FBOEIsTUFBOUI7SUFEWSxDQXRDZDtJQXlDQSxXQUFBLEVBQWEsU0FBQyxDQUFEO2FBQ1gsbUJBQUEsQ0FBb0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ2xCLGNBQUE7QUFBQTtBQUFBLGVBQUEscUNBQUE7O1lBQ0UsS0FBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLENBQXFCLEtBQXJCO1lBQ0EsSUFBVSxLQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBQSxDQUFWO0FBQUEscUJBQUE7O1lBRUEsU0FBQSxHQUFZLEtBQUMsQ0FBQSxNQUFNLENBQUMsK0JBQVIsQ0FBd0MsS0FBQyxDQUFBLFlBQVksQ0FBQyxXQUFkLENBQUEsQ0FBeEM7WUFDWixNQUFBLEdBQVMsS0FBQyxDQUFBLE1BQU0sQ0FBQyx5QkFBUixDQUFrQyxTQUFsQztZQUNULElBQUEsQ0FBYyxNQUFkO0FBQUEscUJBQUE7O1lBRUEsS0FBQyxDQUFBLGFBQWEsQ0FBQyxVQUFmLENBQTBCLE1BQTFCLEVBQWtDLFNBQWxDLEVBQTZDLEtBQUMsQ0FBQSxZQUE5QztBQVJGO1FBRGtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtJQURXLENBekNiO0lBcURBLFNBQUEsRUFBVyxTQUFDLE1BQUQ7YUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQUEsR0FBdUIsTUFBdkM7SUFEUyxDQXJEWDs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbImlucHV0SGFuZGxlciA9IHJlcXVpcmUgXCIuL2lucHV0LWhhbmRsZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGlucHV0SGFuZGxlcjogaW5wdXRIYW5kbGVyXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBwbHVnaW5NYW5hZ2VyLmVuYWJsZSgpXG4gICAgQGNoYW5nZVBhbmVTdWJzY3JpcHRpb24gPSBhdG9tLndvcmtzcGFjZS5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtID0+XG4gICAgICBAc2V0dXBQYW5lKClcblxuICAgIEBzZXR1cFBhbmUoKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQGNoYW5nZVBhbmVTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEBpbnB1dFN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGN1cnNvclN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQHBsdWdpbk1hbmFnZXIuZGlzYWJsZSgpXG5cbiAgc2V0UGx1Z2luTWFuYWdlcjogKHBsdWdpbk1hbmFnZXIpIC0+XG4gICAgQHBsdWdpbk1hbmFnZXIgPSBwbHVnaW5NYW5hZ2VyXG5cbiAgaXNFeGNsdWRlZEZpbGU6IC0+XG4gICAgZXhjbHVkZWQgPSBAZ2V0Q29uZmlnIFwiZXhjbHVkZWRGaWxlVHlwZXMuZXhjbHVkZWRcIlxuICAgIEBlZGl0b3IuZ2V0UGF0aCgpPy5zcGxpdCgnLicpLnBvcCgpIGluIGV4Y2x1ZGVkXG5cbiAgc2V0dXBQYW5lOiAtPlxuICAgIEBpbnB1dFN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGN1cnNvclN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgaWYgbm90IEBlZGl0b3Igb3IgQGlzRXhjbHVkZWRGaWxlKClcbiAgICAgIEBwbHVnaW5NYW5hZ2VyLnJ1bk9uQ2hhbmdlUGFuZSgpXG4gICAgICByZXR1cm5cblxuICAgIEBlZGl0b3JFbGVtZW50ID0gQGVkaXRvci5nZXRFbGVtZW50KClcblxuICAgIEBpbnB1dFN1YnNjcmlwdGlvbiA9IEBlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRDaGFuZ2VUZXh0IEBoYW5kbGVJbnB1dC5iaW5kKHRoaXMpXG4gICAgQGN1cnNvclN1YnNjcmlwdGlvbiA9IEBlZGl0b3Iub2JzZXJ2ZUN1cnNvcnMgQGhhbmRsZUN1cnNvci5iaW5kKHRoaXMpXG5cbiAgICBAcGx1Z2luTWFuYWdlci5ydW5PbkNoYW5nZVBhbmUgQGVkaXRvciwgQGVkaXRvckVsZW1lbnRcblxuICBoYW5kbGVDdXJzb3I6IChjdXJzb3IpIC0+XG4gICAgQHBsdWdpbk1hbmFnZXIucnVuT25OZXdDdXJzb3IgY3Vyc29yXG5cbiAgaGFuZGxlSW5wdXQ6IChlKSAtPlxuICAgIHJlcXVlc3RJZGxlQ2FsbGJhY2sgPT5cbiAgICAgIGZvciBpbnB1dCBpbiBlLmNoYW5nZXNcbiAgICAgICAgQGlucHV0SGFuZGxlci5oYW5kbGUgaW5wdXRcbiAgICAgICAgcmV0dXJuIGlmIEBpbnB1dEhhbmRsZXIuaXNHaG9zdCgpXG5cbiAgICAgICAgc2NyZWVuUG9zID0gQGVkaXRvci5zY3JlZW5Qb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uIEBpbnB1dEhhbmRsZXIuZ2V0UG9zaXRpb24oKVxuICAgICAgICBjdXJzb3IgPSBAZWRpdG9yLmdldEN1cnNvckF0U2NyZWVuUG9zaXRpb24gc2NyZWVuUG9zXG4gICAgICAgIHJldHVybiB1bmxlc3MgY3Vyc29yXG5cbiAgICAgICAgQHBsdWdpbk1hbmFnZXIucnVuT25JbnB1dCBjdXJzb3IsIHNjcmVlblBvcywgQGlucHV0SGFuZGxlclxuXG4gIGdldENvbmZpZzogKGNvbmZpZykgLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQgXCJhY3RpdmF0ZS1wb3dlci1tb2RlLiN7Y29uZmlnfVwiXG4iXX0=
