(function() {
  var throttle;

  throttle = require("lodash.throttle");

  module.exports = {
    api: null,
    setCanvasRenderer: function(canvasRenderer) {
      return this.canvas = canvasRenderer;
    },
    enable: function(api) {
      this.api = api;
      return this.canvas.enable(api);
    },
    disable: function() {
      this.api = null;
      return this.canvas.destroy();
    },
    onChangePane: function(editor, editorElement) {
      var base;
      this.canvas.resetCanvas();
      if (editor) {
        this.canvas.setupCanvas(editor, editorElement);
      }
      return typeof (base = this.canvas.getEffect()).onChangePane === "function" ? base.onChangePane(editor, editorElement) : void 0;
    },
    onNewCursor: function(cursor, screenPosition, input, data) {
      var base;
      cursor.spawn = throttle(this.canvas.spawn.bind(this.canvas), 25, {
        trailing: false
      });
      return typeof (base = this.canvas.getEffect()).onNewCursor === "function" ? base.onNewCursor(cursor, screenPosition, input, data) : void 0;
    },
    onInput: function(cursor, screenPosition, input, data) {
      var base;
      cursor.spawn(cursor, screenPosition, input, data['size']);
      return typeof (base = this.canvas.getEffect()).onInput === "function" ? base.onInput(cursor, screenPosition, input, data) : void 0;
    },
    onComboStartStreak: function() {
      var base;
      return typeof (base = this.canvas.getEffect()).onComboStartStreak === "function" ? base.onComboStartStreak() : void 0;
    },
    onComboLevelChange: function(newLvl, oldLvl) {
      var base;
      return typeof (base = this.canvas.getEffect()).onComboLevelChange === "function" ? base.onComboLevelChange(newLvl, oldLvl) : void 0;
    },
    onComboEndStreak: function() {
      var base;
      return typeof (base = this.canvas.getEffect()).onComboEndStreak === "function" ? base.onComboEndStreak() : void 0;
    },
    onComboExclamation: function(text) {
      var base;
      return typeof (base = this.canvas.getEffect()).onComboExclamation === "function" ? base.onComboExclamation(text) : void 0;
    },
    onComboMaxStreak: function(maxStreak) {
      var base;
      return typeof (base = this.canvas.getEffect()).onComboMaxStreak === "function" ? base.onComboMaxStreak(maxStreak) : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi9wb3dlci1jYW52YXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxHQUFBLEVBQUssSUFBTDtJQUVBLGlCQUFBLEVBQW1CLFNBQUMsY0FBRDthQUNqQixJQUFDLENBQUEsTUFBRCxHQUFVO0lBRE8sQ0FGbkI7SUFLQSxNQUFBLEVBQVEsU0FBQyxHQUFEO01BQ04sSUFBQyxDQUFBLEdBQUQsR0FBTzthQUNQLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLEdBQWY7SUFGTSxDQUxSO0lBU0EsT0FBQSxFQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsR0FBRCxHQUFPO2FBQ1AsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUE7SUFGTyxDQVRUO0lBYUEsWUFBQSxFQUFjLFNBQUMsTUFBRCxFQUFTLGFBQVQ7QUFDWixVQUFBO01BQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQUE7TUFDQSxJQUE2QyxNQUE3QztRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixNQUFwQixFQUE0QixhQUE1QixFQUFBOzt1RkFDbUIsQ0FBQyxhQUFjLFFBQVE7SUFIOUIsQ0FiZDtJQWtCQSxXQUFBLEVBQWEsU0FBQyxNQUFELEVBQVMsY0FBVCxFQUF5QixLQUF6QixFQUFnQyxJQUFoQztBQUNYLFVBQUE7TUFBQSxNQUFNLENBQUMsS0FBUCxHQUFlLFFBQUEsQ0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFkLENBQW1CLElBQUMsQ0FBQSxNQUFwQixDQUFULEVBQXNDLEVBQXRDLEVBQTBDO1FBQUEsUUFBQSxFQUFVLEtBQVY7T0FBMUM7c0ZBQ0ksQ0FBQyxZQUFhLFFBQVEsZ0JBQWdCLE9BQU87SUFGckQsQ0FsQmI7SUFzQkEsT0FBQSxFQUFTLFNBQUMsTUFBRCxFQUFTLGNBQVQsRUFBeUIsS0FBekIsRUFBZ0MsSUFBaEM7QUFDUCxVQUFBO01BQUEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFiLEVBQXFCLGNBQXJCLEVBQXFDLEtBQXJDLEVBQTRDLElBQUssQ0FBQSxNQUFBLENBQWpEO2tGQUNtQixDQUFDLFFBQVMsUUFBUSxnQkFBZ0IsT0FBTztJQUZyRCxDQXRCVDtJQTBCQSxrQkFBQSxFQUFvQixTQUFBO0FBQ2xCLFVBQUE7NkZBQW1CLENBQUM7SUFERixDQTFCcEI7SUE2QkEsa0JBQUEsRUFBb0IsU0FBQyxNQUFELEVBQVMsTUFBVDtBQUNsQixVQUFBOzZGQUFtQixDQUFDLG1CQUFvQixRQUFRO0lBRDlCLENBN0JwQjtJQWdDQSxnQkFBQSxFQUFrQixTQUFBO0FBQ2hCLFVBQUE7MkZBQW1CLENBQUM7SUFESixDQWhDbEI7SUFtQ0Esa0JBQUEsRUFBb0IsU0FBQyxJQUFEO0FBQ2xCLFVBQUE7NkZBQW1CLENBQUMsbUJBQW9CO0lBRHRCLENBbkNwQjtJQXNDQSxnQkFBQSxFQUFrQixTQUFDLFNBQUQ7QUFDaEIsVUFBQTsyRkFBbUIsQ0FBQyxpQkFBa0I7SUFEdEIsQ0F0Q2xCOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsidGhyb3R0bGUgPSByZXF1aXJlIFwibG9kYXNoLnRocm90dGxlXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhcGk6IG51bGxcblxuICBzZXRDYW52YXNSZW5kZXJlcjogKGNhbnZhc1JlbmRlcmVyKSAtPlxuICAgIEBjYW52YXMgPSBjYW52YXNSZW5kZXJlclxuXG4gIGVuYWJsZTogKGFwaSkgLT5cbiAgICBAYXBpID0gYXBpXG4gICAgQGNhbnZhcy5lbmFibGUoYXBpKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQGFwaSA9IG51bGxcbiAgICBAY2FudmFzLmRlc3Ryb3koKVxuXG4gIG9uQ2hhbmdlUGFuZTogKGVkaXRvciwgZWRpdG9yRWxlbWVudCkgLT5cbiAgICBAY2FudmFzLnJlc2V0Q2FudmFzKClcbiAgICBAY2FudmFzLnNldHVwQ2FudmFzIGVkaXRvciwgZWRpdG9yRWxlbWVudCBpZiBlZGl0b3JcbiAgICBAY2FudmFzLmdldEVmZmVjdCgpLm9uQ2hhbmdlUGFuZT8oZWRpdG9yLCBlZGl0b3JFbGVtZW50KVxuXG4gIG9uTmV3Q3Vyc29yOiAoY3Vyc29yLCBzY3JlZW5Qb3NpdGlvbiwgaW5wdXQsIGRhdGEpIC0+XG4gICAgY3Vyc29yLnNwYXduID0gdGhyb3R0bGUgQGNhbnZhcy5zcGF3bi5iaW5kKEBjYW52YXMpLCAyNSwgdHJhaWxpbmc6IGZhbHNlXG4gICAgQGNhbnZhcy5nZXRFZmZlY3QoKS5vbk5ld0N1cnNvcj8oY3Vyc29yLCBzY3JlZW5Qb3NpdGlvbiwgaW5wdXQsIGRhdGEpXG5cbiAgb25JbnB1dDogKGN1cnNvciwgc2NyZWVuUG9zaXRpb24sIGlucHV0LCBkYXRhKSAtPlxuICAgIGN1cnNvci5zcGF3biBjdXJzb3IsIHNjcmVlblBvc2l0aW9uLCBpbnB1dCwgZGF0YVsnc2l6ZSddXG4gICAgQGNhbnZhcy5nZXRFZmZlY3QoKS5vbklucHV0PyhjdXJzb3IsIHNjcmVlblBvc2l0aW9uLCBpbnB1dCwgZGF0YSlcblxuICBvbkNvbWJvU3RhcnRTdHJlYWs6IC0+XG4gICAgQGNhbnZhcy5nZXRFZmZlY3QoKS5vbkNvbWJvU3RhcnRTdHJlYWs/KClcblxuICBvbkNvbWJvTGV2ZWxDaGFuZ2U6IChuZXdMdmwsIG9sZEx2bCkgLT5cbiAgICBAY2FudmFzLmdldEVmZmVjdCgpLm9uQ29tYm9MZXZlbENoYW5nZT8obmV3THZsLCBvbGRMdmwpXG5cbiAgb25Db21ib0VuZFN0cmVhazogLT5cbiAgICBAY2FudmFzLmdldEVmZmVjdCgpLm9uQ29tYm9FbmRTdHJlYWs/KClcblxuICBvbkNvbWJvRXhjbGFtYXRpb246ICh0ZXh0KSAtPlxuICAgIEBjYW52YXMuZ2V0RWZmZWN0KCkub25Db21ib0V4Y2xhbWF0aW9uPyh0ZXh0KVxuXG4gIG9uQ29tYm9NYXhTdHJlYWs6IChtYXhTdHJlYWspIC0+XG4gICAgQGNhbnZhcy5nZXRFZmZlY3QoKS5vbkNvbWJvTWF4U3RyZWFrPyhtYXhTdHJlYWspXG4iXX0=
