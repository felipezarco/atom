(function() {
  var JquerySnippetsView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  module.exports = JquerySnippetsView = (function(superClass) {
    extend(JquerySnippetsView, superClass);

    function JquerySnippetsView() {
      return JquerySnippetsView.__super__.constructor.apply(this, arguments);
    }

    JquerySnippetsView.content = function() {
      return this.div({
        "class": 'jquery-snippets overlay from-top'
      }, (function(_this) {
        return function() {
          return _this.div("The JquerySnippets package is Alive! It's ALIVE!", {
            "class": "message"
          });
        };
      })(this));
    };

    JquerySnippetsView.prototype.initialize = function(serializeState) {
      return atom.commands.add('atom-workspace', 'jquery-snippets:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    };

    JquerySnippetsView.prototype.serialize = function() {};

    JquerySnippetsView.prototype.destroy = function() {
      return this.detach();
    };

    return JquerySnippetsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2pxdWVyeS1zbmlwcGV0cy9saWIvanF1ZXJ5LXNuaXBwZXRzLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBOzs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osa0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGtDQUFQO09BQUwsRUFBZ0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUM5QyxLQUFDLENBQUEsR0FBRCxDQUFLLGtEQUFMLEVBQXlEO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO1dBQXpEO1FBRDhDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRDtJQURROztpQ0FJVixVQUFBLEdBQVksU0FBQyxjQUFEO2FBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyx3QkFBcEMsRUFBOEQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQ7SUFEVTs7aUNBSVosU0FBQSxHQUFXLFNBQUEsR0FBQTs7aUNBR1gsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRE87Ozs7S0Fac0I7QUFIakMiLCJzb3VyY2VzQ29udGVudCI6WyJ7Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgSnF1ZXJ5U25pcHBldHNWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiAnanF1ZXJ5LXNuaXBwZXRzIG92ZXJsYXkgZnJvbS10b3AnLCA9PlxuICAgICAgQGRpdiBcIlRoZSBKcXVlcnlTbmlwcGV0cyBwYWNrYWdlIGlzIEFsaXZlISBJdCdzIEFMSVZFIVwiLCBjbGFzczogXCJtZXNzYWdlXCJcblxuICBpbml0aWFsaXplOiAoc2VyaWFsaXplU3RhdGUpIC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2pxdWVyeS1zbmlwcGV0czp0b2dnbGUnLCA9PiBAdG9nZ2xlKClcblxuICAjIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHJldHJpZXZlZCB3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkXG4gIHNlcmlhbGl6ZTogLT5cblxuICAjIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICBkZXN0cm95OiAtPlxuICAgIEBkZXRhY2goKVxuIl19
