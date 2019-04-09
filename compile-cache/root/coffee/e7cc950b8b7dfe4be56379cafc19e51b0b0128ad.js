(function() {
  module.exports = {
    reset: function() {
      return this.onAll();
    },
    offAll: function() {
      this["default"] = false;
      return this.plugins = [];
    },
    onAll: function() {
      this["default"] = true;
      return this.plugins = [];
    },
    off: function(code) {
      return this.plugins[code] = false;
    },
    on: function(code, data) {
      if (data != null) {
        return this.plugins[code] = data;
      } else {
        return this.plugins[code] = true;
      }
    },
    isOff: function(code) {
      return !this.isOn(code);
    },
    isOn: function(code) {
      if (this.plugins[code] == null) {
        return this["default"];
      } else {
        return true;
      }
    },
    getData: function(code) {
      if ((this.plugins[code] != null) && typeof this.plugins[code] === 'object') {
        return this.plugins[code];
      } else {
        return [];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3N3aXRjaGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxLQUFBLEVBQU8sU0FBQTthQUNMLElBQUMsQ0FBQSxLQUFELENBQUE7SUFESyxDQUFQO0lBR0EsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLEVBQUEsT0FBQSxFQUFELEdBQVc7YUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRkwsQ0FIUjtJQU9BLEtBQUEsRUFBTyxTQUFBO01BQ0wsSUFBQyxFQUFBLE9BQUEsRUFBRCxHQUFXO2FBQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUZOLENBUFA7SUFXQSxHQUFBLEVBQUssU0FBQyxJQUFEO2FBQ0gsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLENBQVQsR0FBaUI7SUFEZCxDQVhMO0lBY0EsRUFBQSxFQUFJLFNBQUMsSUFBRCxFQUFPLElBQVA7TUFDRixJQUFHLFlBQUg7ZUFDRSxJQUFDLENBQUEsT0FBUSxDQUFBLElBQUEsQ0FBVCxHQUFpQixLQURuQjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsT0FBUSxDQUFBLElBQUEsQ0FBVCxHQUFpQixLQUhuQjs7SUFERSxDQWRKO0lBb0JBLEtBQUEsRUFBTyxTQUFDLElBQUQ7YUFDTCxDQUFJLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBTjtJQURDLENBcEJQO0lBdUJBLElBQUEsRUFBTSxTQUFDLElBQUQ7TUFDSixJQUFPLDBCQUFQO2VBQ0UsSUFBQyxFQUFBLE9BQUEsR0FESDtPQUFBLE1BQUE7ZUFHRSxLQUhGOztJQURJLENBdkJOO0lBNkJBLE9BQUEsRUFBUyxTQUFDLElBQUQ7TUFDUCxJQUFHLDRCQUFBLElBQW9CLE9BQU8sSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLENBQWhCLEtBQXlCLFFBQWhEO2VBQ0UsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLEVBRFg7T0FBQSxNQUFBO2VBR0UsR0FIRjs7SUFETyxDQTdCVDs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgcmVzZXQ6IC0+XG4gICAgQG9uQWxsKClcblxuICBvZmZBbGw6IC0+XG4gICAgQGRlZmF1bHQgPSBmYWxzZVxuICAgIEBwbHVnaW5zID0gW11cblxuICBvbkFsbDogLT5cbiAgICBAZGVmYXVsdCA9IHRydWVcbiAgICBAcGx1Z2lucyA9IFtdXG5cbiAgb2ZmOiAoY29kZSkgLT5cbiAgICBAcGx1Z2luc1tjb2RlXSA9IGZhbHNlXG5cbiAgb246IChjb2RlLCBkYXRhKSAtPlxuICAgIGlmIGRhdGE/XG4gICAgICBAcGx1Z2luc1tjb2RlXSA9IGRhdGFcbiAgICBlbHNlXG4gICAgICBAcGx1Z2luc1tjb2RlXSA9IHRydWVcblxuICBpc09mZjogKGNvZGUpIC0+XG4gICAgbm90IEBpc09uIGNvZGVcblxuICBpc09uOiAoY29kZSkgLT5cbiAgICBpZiBub3QgQHBsdWdpbnNbY29kZV0/XG4gICAgICBAZGVmYXVsdFxuICAgIGVsc2VcbiAgICAgIHRydWVcblxuICBnZXREYXRhOiAoY29kZSkgLT5cbiAgICBpZiBAcGx1Z2luc1tjb2RlXT8gYW5kIHR5cGVvZiBAcGx1Z2luc1tjb2RlXSBpcyAnb2JqZWN0J1xuICAgICAgQHBsdWdpbnNbY29kZV1cbiAgICBlbHNlXG4gICAgICBbXVxuIl19
