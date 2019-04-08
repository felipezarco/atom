(function() {
  var BaseFinderView, RailsUtil, ViewFinderView, _, fs, path, pluralize,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  path = require('path');

  pluralize = require('pluralize');

  _ = require('underscore');

  BaseFinderView = require('./base-finder-view');

  RailsUtil = require('./rails-util');

  module.exports = ViewFinderView = (function(superClass) {
    extend(ViewFinderView, superClass);

    function ViewFinderView() {
      return ViewFinderView.__super__.constructor.apply(this, arguments);
    }

    _.extend(ViewFinderView.prototype, RailsUtil.prototype);

    ViewFinderView.prototype.populate = function() {
      var basename, currentFile, i, len, ref, viewDir, viewFile, viewPath;
      this.displayFiles.length = 0;
      currentFile = atom.workspace.getActiveTextEditor().getPath();
      if (this.isController(currentFile)) {
        viewDir = currentFile.replace('controllers', 'views').replace(/_controller\.rb$/, '');
      } else if (this.isModel(currentFile)) {
        basename = path.basename(currentFile, '.rb');
        viewDir = currentFile.replace('models', 'views').replace(basename, pluralize(basename)).replace(".rb", "");
      } else if (this.isMailer(currentFile)) {
        viewDir = currentFile.replace('mailers', 'views').replace(/\.rb$/, '');
      } else {
        return;
      }
      if (!fs.existsSync(viewDir)) {
        return;
      }
      ref = fs.readdirSync(viewDir);
      for (i = 0, len = ref.length; i < len; i++) {
        viewFile = ref[i];
        viewPath = path.join(viewDir, viewFile);
        if (fs.statSync(viewPath).isFile()) {
          this.displayFiles.push(viewPath);
        }
      }
      return this.setItems(this.displayFiles);
    };

    return ViewFinderView;

  })(BaseFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3JhaWxzLXRyYW5zcG9ydGVyL2xpYi92aWV3LWZpbmRlci12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsaUVBQUE7SUFBQTs7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVI7O0VBQ1osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSOztFQUVKLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSOztFQUNqQixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLENBQUMsQ0FBQyxNQUFGLENBQVMsY0FBSSxDQUFBLFNBQWIsRUFBaUIsU0FBUyxDQUFBLFNBQTFCOzs2QkFFQSxRQUFBLEdBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsR0FBdUI7TUFDdkIsV0FBQSxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLE9BQXJDLENBQUE7TUFDZCxJQUFHLElBQUMsQ0FBQSxZQUFELENBQWMsV0FBZCxDQUFIO1FBQ0UsT0FBQSxHQUFVLFdBQVcsQ0FBQyxPQUFaLENBQW9CLGFBQXBCLEVBQW1DLE9BQW5DLENBQ1csQ0FBQyxPQURaLENBQ29CLGtCQURwQixFQUN3QyxFQUR4QyxFQURaO09BQUEsTUFHSyxJQUFHLElBQUMsQ0FBQSxPQUFELENBQVMsV0FBVCxDQUFIO1FBQ0gsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsV0FBZCxFQUEyQixLQUEzQjtRQUNYLE9BQUEsR0FBVSxXQUFXLENBQUMsT0FBWixDQUFvQixRQUFwQixFQUE4QixPQUE5QixDQUNXLENBQUMsT0FEWixDQUNvQixRQURwQixFQUM4QixTQUFBLENBQVUsUUFBVixDQUQ5QixDQUVXLENBQUMsT0FGWixDQUVvQixLQUZwQixFQUUyQixFQUYzQixFQUZQO09BQUEsTUFLQSxJQUFHLElBQUMsQ0FBQSxRQUFELENBQVUsV0FBVixDQUFIO1FBQ0gsT0FBQSxHQUFVLFdBQVcsQ0FBQyxPQUFaLENBQW9CLFNBQXBCLEVBQStCLE9BQS9CLENBQ1csQ0FBQyxPQURaLENBQ29CLE9BRHBCLEVBQzZCLEVBRDdCLEVBRFA7T0FBQSxNQUFBO0FBSUgsZUFKRzs7TUFNTCxJQUFBLENBQWMsRUFBRSxDQUFDLFVBQUgsQ0FBYyxPQUFkLENBQWQ7QUFBQSxlQUFBOztBQUNBO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLFFBQW5CO1FBQ1gsSUFBRyxFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosQ0FBcUIsQ0FBQyxNQUF0QixDQUFBLENBQUg7VUFDRSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsUUFBbkIsRUFERjs7QUFGRjthQUtBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLFlBQVg7SUF2QlE7Ozs7S0FIaUI7QUFUN0IiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5wbHVyYWxpemUgPSByZXF1aXJlICdwbHVyYWxpemUnXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZSdcblxuQmFzZUZpbmRlclZpZXcgPSByZXF1aXJlICcuL2Jhc2UtZmluZGVyLXZpZXcnXG5SYWlsc1V0aWwgPSByZXF1aXJlICcuL3JhaWxzLXV0aWwnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFZpZXdGaW5kZXJWaWV3IGV4dGVuZHMgQmFzZUZpbmRlclZpZXdcbiAgXy5leHRlbmQgdGhpczo6LCBSYWlsc1V0aWw6OlxuXG4gIHBvcHVsYXRlOiAtPlxuICAgIEBkaXNwbGF5RmlsZXMubGVuZ3RoID0gMFxuICAgIGN1cnJlbnRGaWxlID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKVxuICAgIGlmIEBpc0NvbnRyb2xsZXIoY3VycmVudEZpbGUpXG4gICAgICB2aWV3RGlyID0gY3VycmVudEZpbGUucmVwbGFjZSgnY29udHJvbGxlcnMnLCAndmlld3MnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL19jb250cm9sbGVyXFwucmIkLywgJycpXG4gICAgZWxzZSBpZiBAaXNNb2RlbChjdXJyZW50RmlsZSlcbiAgICAgIGJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZShjdXJyZW50RmlsZSwgJy5yYicpXG4gICAgICB2aWV3RGlyID0gY3VycmVudEZpbGUucmVwbGFjZSgnbW9kZWxzJywgJ3ZpZXdzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKGJhc2VuYW1lLCBwbHVyYWxpemUoYmFzZW5hbWUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoXCIucmJcIiwgXCJcIilcbiAgICBlbHNlIGlmIEBpc01haWxlcihjdXJyZW50RmlsZSlcbiAgICAgIHZpZXdEaXIgPSBjdXJyZW50RmlsZS5yZXBsYWNlKCdtYWlsZXJzJywgJ3ZpZXdzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC5yYiQvLCAnJylcbiAgICBlbHNlXG4gICAgICByZXR1cm5cblxuICAgIHJldHVybiB1bmxlc3MgZnMuZXhpc3RzU3luYyB2aWV3RGlyXG4gICAgZm9yIHZpZXdGaWxlIGluIGZzLnJlYWRkaXJTeW5jKHZpZXdEaXIpXG4gICAgICB2aWV3UGF0aCA9IHBhdGguam9pbih2aWV3RGlyLCB2aWV3RmlsZSlcbiAgICAgIGlmIGZzLnN0YXRTeW5jKHZpZXdQYXRoKS5pc0ZpbGUoKVxuICAgICAgICBAZGlzcGxheUZpbGVzLnB1c2ggdmlld1BhdGhcblxuICAgIEBzZXRJdGVtcyhAZGlzcGxheUZpbGVzKVxuIl19
