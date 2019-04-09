(function() {
  module.exports = {
    getEditor: function() {
      return this.editor;
    },
    getEditorElement: function() {
      return this.editorElement;
    },
    getScrollView: function() {
      return this.scrollView;
    },
    setEditor: function(editor) {
      if (editor) {
        this.editor = editor;
        this.editorElement = editor.getElement();
        return this.scrollView = this.editorElement.querySelector(".scroll-view");
      } else {
        return this.editor = this.editorElement = this.scrollView = null;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3NlcnZpY2UvZWRpdG9yLXJlZ2lzdHJ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxTQUFBLEVBQVcsU0FBQTthQUNULElBQUMsQ0FBQTtJQURRLENBQVg7SUFHQSxnQkFBQSxFQUFrQixTQUFBO2FBQ2hCLElBQUMsQ0FBQTtJQURlLENBSGxCO0lBTUEsYUFBQSxFQUFlLFNBQUE7YUFDYixJQUFDLENBQUE7SUFEWSxDQU5mO0lBU0EsU0FBQSxFQUFXLFNBQUMsTUFBRDtNQUNULElBQUcsTUFBSDtRQUNFLElBQUMsQ0FBQSxNQUFELEdBQVU7UUFDVixJQUFDLENBQUEsYUFBRCxHQUFpQixNQUFNLENBQUMsVUFBUCxDQUFBO2VBQ2pCLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLGFBQWEsQ0FBQyxhQUFmLENBQTZCLGNBQTdCLEVBSGhCO09BQUEsTUFBQTtlQUtFLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBLFVBQUQsR0FBYyxLQUwzQzs7SUFEUyxDQVRYOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBnZXRFZGl0b3I6IC0+XG4gICAgQGVkaXRvclxuXG4gIGdldEVkaXRvckVsZW1lbnQ6IC0+XG4gICAgQGVkaXRvckVsZW1lbnRcblxuICBnZXRTY3JvbGxWaWV3OiAtPlxuICAgIEBzY3JvbGxWaWV3XG5cbiAgc2V0RWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIGlmIGVkaXRvclxuICAgICAgQGVkaXRvciA9IGVkaXRvclxuICAgICAgQGVkaXRvckVsZW1lbnQgPSBlZGl0b3IuZ2V0RWxlbWVudCgpXG4gICAgICBAc2Nyb2xsVmlldyA9IEBlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2Nyb2xsLXZpZXdcIilcbiAgICBlbHNlXG4gICAgICBAZWRpdG9yID0gQGVkaXRvckVsZW1lbnQgPSBAc2Nyb2xsVmlldyA9IG51bGxcbiJdfQ==
