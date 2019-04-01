(function() {
  var AskStackView;

  AskStackView = require('./ask-stack-view');

  module.exports = {
    config: {
      autoDetectLanguage: true
    },
    askStackView: null,
    activate: function(state) {
      return this.askStackView = new AskStackView(state.askStackViewState);
    },
    deactivate: function() {
      return this.askStackView.destroy();
    },
    serialize: function() {
      return {
        askStackViewState: this.askStackView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2Fzay1zdGFjay9saWIvYXNrLXN0YWNrLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUjs7RUFFZixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsa0JBQUEsRUFBb0IsSUFBcEI7S0FERjtJQUVBLFlBQUEsRUFBYyxJQUZkO0lBSUEsUUFBQSxFQUFVLFNBQUMsS0FBRDthQUNSLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUksWUFBSixDQUFpQixLQUFLLENBQUMsaUJBQXZCO0lBRFIsQ0FKVjtJQU9BLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUE7SUFEVSxDQVBaO0lBVUEsU0FBQSxFQUFXLFNBQUE7YUFDVDtRQUFBLGlCQUFBLEVBQW1CLElBQUMsQ0FBQSxZQUFZLENBQUMsU0FBZCxDQUFBLENBQW5COztJQURTLENBVlg7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJBc2tTdGFja1ZpZXcgPSByZXF1aXJlICcuL2Fzay1zdGFjay12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBhdXRvRGV0ZWN0TGFuZ3VhZ2U6IHRydWVcbiAgYXNrU3RhY2tWaWV3OiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAYXNrU3RhY2tWaWV3ID0gbmV3IEFza1N0YWNrVmlldyhzdGF0ZS5hc2tTdGFja1ZpZXdTdGF0ZSlcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBhc2tTdGFja1ZpZXcuZGVzdHJveSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIGFza1N0YWNrVmlld1N0YXRlOiBAYXNrU3RhY2tWaWV3LnNlcmlhbGl6ZSgpXG4iXX0=
