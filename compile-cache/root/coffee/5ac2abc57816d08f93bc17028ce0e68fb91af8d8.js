(function() {
  var BaseFinderView, ViewFinderView, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  path = require('path');

  BaseFinderView = require('./base-finder-view');

  module.exports = ViewFinderView = (function(superClass) {
    extend(ViewFinderView, superClass);

    function ViewFinderView() {
      return ViewFinderView.__super__.constructor.apply(this, arguments);
    }

    ViewFinderView.prototype.populate = function() {
      var filePath, i, migrationDir, migrationFile, ref;
      this.displayFiles.length = 0;
      migrationDir = path.join(atom.project.getPaths()[0], "db", "migrate");
      if (!fs.existsSync(migrationDir)) {
        return;
      }
      ref = fs.readdirSync(migrationDir);
      for (i = ref.length - 1; i >= 0; i += -1) {
        migrationFile = ref[i];
        filePath = path.join(migrationDir, migrationFile);
        if (fs.statSync(filePath).isFile()) {
          this.displayFiles.push(filePath);
        }
      }
      return this.setItems(this.displayFiles);
    };

    return ViewFinderView;

  })(BaseFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3JhaWxzLXRyYW5zcG9ydGVyL2xpYi9taWdyYXRpb24tZmluZGVyLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3Q0FBQTtJQUFBOzs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OzZCQUNKLFFBQUEsR0FBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxHQUF1QjtNQUN2QixZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsSUFBdEMsRUFBNEMsU0FBNUM7TUFFZixJQUFBLENBQWMsRUFBRSxDQUFDLFVBQUgsQ0FBYyxZQUFkLENBQWQ7QUFBQSxlQUFBOztBQUNBO0FBQUEsV0FBQSxtQ0FBQTs7UUFDRSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFWLEVBQXdCLGFBQXhCO1FBQ1gsSUFBRyxFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosQ0FBcUIsQ0FBQyxNQUF0QixDQUFBLENBQUg7VUFDRSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsUUFBbkIsRUFERjs7QUFGRjthQUtBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLFlBQVg7SUFWUTs7OztLQURpQjtBQU43QiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxuQmFzZUZpbmRlclZpZXcgPSByZXF1aXJlICcuL2Jhc2UtZmluZGVyLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFZpZXdGaW5kZXJWaWV3IGV4dGVuZHMgQmFzZUZpbmRlclZpZXdcbiAgcG9wdWxhdGU6IC0+XG4gICAgQGRpc3BsYXlGaWxlcy5sZW5ndGggPSAwXG4gICAgbWlncmF0aW9uRGlyID0gcGF0aC5qb2luKGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCBcImRiXCIsIFwibWlncmF0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgcmV0dXJuIHVubGVzcyBmcy5leGlzdHNTeW5jIG1pZ3JhdGlvbkRpclxuICAgIGZvciBtaWdyYXRpb25GaWxlIGluIGZzLnJlYWRkaXJTeW5jKG1pZ3JhdGlvbkRpcikgYnkgLTFcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKG1pZ3JhdGlvbkRpciwgbWlncmF0aW9uRmlsZSlcbiAgICAgIGlmIGZzLnN0YXRTeW5jKGZpbGVQYXRoKS5pc0ZpbGUoKVxuICAgICAgICBAZGlzcGxheUZpbGVzLnB1c2ggZmlsZVBhdGhcbiAgICAgICAgICBcbiAgICBAc2V0SXRlbXMoQGRpc3BsYXlGaWxlcylcbiJdfQ==
