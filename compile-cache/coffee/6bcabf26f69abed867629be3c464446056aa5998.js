(function() {
  var JquerySnippetsView;

  JquerySnippetsView = require('./jquery-snippets-view');

  module.exports = {
    jquerySnippetsView: null,
    activate: function(state) {
      return this.jquerySnippetsView = new JquerySnippetsView(state.jquerySnippetsViewState);
    },
    deactivate: function() {
      return this.jquerySnippetsView.destroy();
    },
    serialize: function() {
      return {
        jquerySnippetsViewState: this.jquerySnippetsView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2pxdWVyeS1zbmlwcGV0cy9saWIvanF1ZXJ5LXNuaXBwZXRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSOztFQUVyQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsa0JBQUEsRUFBb0IsSUFBcEI7SUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFEO2FBQ1IsSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUksa0JBQUosQ0FBdUIsS0FBSyxDQUFDLHVCQUE3QjtJQURkLENBRlY7SUFLQSxVQUFBLEVBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFwQixDQUFBO0lBRFUsQ0FMWjtJQVFBLFNBQUEsRUFBVyxTQUFBO2FBQ1Q7UUFBQSx1QkFBQSxFQUF5QixJQUFDLENBQUEsa0JBQWtCLENBQUMsU0FBcEIsQ0FBQSxDQUF6Qjs7SUFEUyxDQVJYOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsiSnF1ZXJ5U25pcHBldHNWaWV3ID0gcmVxdWlyZSAnLi9qcXVlcnktc25pcHBldHMtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBqcXVlcnlTbmlwcGV0c1ZpZXc6IG51bGxcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBqcXVlcnlTbmlwcGV0c1ZpZXcgPSBuZXcgSnF1ZXJ5U25pcHBldHNWaWV3KHN0YXRlLmpxdWVyeVNuaXBwZXRzVmlld1N0YXRlKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGpxdWVyeVNuaXBwZXRzVmlldy5kZXN0cm95KClcblxuICBzZXJpYWxpemU6IC0+XG4gICAganF1ZXJ5U25pcHBldHNWaWV3U3RhdGU6IEBqcXVlcnlTbmlwcGV0c1ZpZXcuc2VyaWFsaXplKClcbiJdfQ==
