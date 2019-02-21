(function() {
  var AssetFinderView, BaseFinderView, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  path = require('path');

  BaseFinderView = require('./base-finder-view');

  module.exports = AssetFinderView = (function(superClass) {
    extend(AssetFinderView, superClass);

    function AssetFinderView() {
      return AssetFinderView.__super__.constructor.apply(this, arguments);
    }

    AssetFinderView.prototype.populate = function() {
      var dir, editor, line, result;
      this.displayFiles.length = 0;
      editor = atom.workspace.getActiveTextEditor();
      dir = path.dirname(editor.getPath());
      line = editor.getLastCursor().getCurrentBufferLine();
      if (line.indexOf("require_tree") !== -1) {
        result = line.match(/require_tree\s*([a-zA-Z0-9_\-\.\/]+)\s*$/);
        this.loadFolder(path.join(dir, result[1]), true);
      } else if (line.indexOf("require_directory") !== -1) {
        result = line.match(/require_directory\s*([a-zA-Z0-9_\-\.\/]+)\s*$/);
        this.loadFolder(path.join(dir, result[1]));
      }
      return this.setItems(this.displayFiles);
    };

    AssetFinderView.prototype.loadFolder = function(folderPath, recursive) {
      var asset, fullPath, i, len, ref, results, stats;
      if (recursive == null) {
        recursive = false;
      }
      ref = fs.readdirSync(folderPath);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        asset = ref[i];
        fullPath = path.join(folderPath, asset);
        stats = fs.statSync(fullPath);
        if (stats.isDirectory() && recursive === true) {
          results.push(this.loadFolder(fullPath));
        } else if (stats.isFile()) {
          results.push(this.displayFiles.push(fullPath));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return AssetFinderView;

  })(BaseFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3JhaWxzLXRyYW5zcG9ydGVyL2xpYi9hc3NldC1maW5kZXItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUE7OztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7OEJBQ0osUUFBQSxHQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLEdBQXVCO01BRXZCLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxHQUFBLEdBQU0sSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWI7TUFDTixJQUFBLEdBQU8sTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFzQixDQUFDLG9CQUF2QixDQUFBO01BQ1AsSUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLGNBQWIsQ0FBQSxLQUFrQyxDQUFDLENBQXRDO1FBQ0UsTUFBQSxHQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsMENBQVg7UUFDVCxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixFQUFlLE1BQU8sQ0FBQSxDQUFBLENBQXRCLENBQVosRUFBdUMsSUFBdkMsRUFGRjtPQUFBLE1BR0ssSUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLG1CQUFiLENBQUEsS0FBdUMsQ0FBQyxDQUEzQztRQUNILE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLCtDQUFYO1FBQ1QsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsRUFBZSxNQUFPLENBQUEsQ0FBQSxDQUF0QixDQUFaLEVBRkc7O2FBSUwsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsWUFBWDtJQWJROzs4QkFlVixVQUFBLEdBQVksU0FBQyxVQUFELEVBQWEsU0FBYjtBQUNWLFVBQUE7O1FBRHVCLFlBQVk7O0FBQ25DO0FBQUE7V0FBQSxxQ0FBQTs7UUFDRSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLEVBQXNCLEtBQXRCO1FBQ1gsS0FBQSxHQUFRLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBWjtRQUNSLElBQUcsS0FBSyxDQUFDLFdBQU4sQ0FBQSxDQUFBLElBQXdCLFNBQUEsS0FBYSxJQUF4Qzt1QkFDRSxJQUFDLENBQUEsVUFBRCxDQUFZLFFBQVosR0FERjtTQUFBLE1BRUssSUFBRyxLQUFLLENBQUMsTUFBTixDQUFBLENBQUg7dUJBQ0gsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLFFBQW5CLEdBREc7U0FBQSxNQUFBOytCQUFBOztBQUxQOztJQURVOzs7O0tBaEJnQjtBQU45QiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxuQmFzZUZpbmRlclZpZXcgPSByZXF1aXJlICcuL2Jhc2UtZmluZGVyLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEFzc2V0RmluZGVyVmlldyBleHRlbmRzIEJhc2VGaW5kZXJWaWV3XG4gIHBvcHVsYXRlOiAtPlxuICAgIEBkaXNwbGF5RmlsZXMubGVuZ3RoID0gMFxuICAgIFxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGRpciA9IHBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgIGxpbmUgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldEN1cnJlbnRCdWZmZXJMaW5lKClcbiAgICBpZiBsaW5lLmluZGV4T2YoXCJyZXF1aXJlX3RyZWVcIikgaXNudCAtMVxuICAgICAgcmVzdWx0ID0gbGluZS5tYXRjaCgvcmVxdWlyZV90cmVlXFxzKihbYS16QS1aMC05X1xcLVxcLi9dKylcXHMqJC8pXG4gICAgICBAbG9hZEZvbGRlcihwYXRoLmpvaW4oZGlyLCByZXN1bHRbMV0pLCB0cnVlKVxuICAgIGVsc2UgaWYgbGluZS5pbmRleE9mKFwicmVxdWlyZV9kaXJlY3RvcnlcIikgaXNudCAtMVxuICAgICAgcmVzdWx0ID0gbGluZS5tYXRjaCgvcmVxdWlyZV9kaXJlY3RvcnlcXHMqKFthLXpBLVowLTlfXFwtXFwuL10rKVxccyokLylcbiAgICAgIEBsb2FkRm9sZGVyIHBhdGguam9pbihkaXIsIHJlc3VsdFsxXSlcbiAgICAgIFxuICAgIEBzZXRJdGVtcyhAZGlzcGxheUZpbGVzKVxuXG4gIGxvYWRGb2xkZXI6IChmb2xkZXJQYXRoLCByZWN1cnNpdmUgPSBmYWxzZSkgLT5cbiAgICBmb3IgYXNzZXQgaW4gZnMucmVhZGRpclN5bmMoZm9sZGVyUGF0aClcbiAgICAgIGZ1bGxQYXRoID0gcGF0aC5qb2luKGZvbGRlclBhdGgsIGFzc2V0KVxuICAgICAgc3RhdHMgPSBmcy5zdGF0U3luYyBmdWxsUGF0aFxuICAgICAgaWYgc3RhdHMuaXNEaXJlY3RvcnkoKSBhbmQgcmVjdXJzaXZlIGlzIHRydWVcbiAgICAgICAgQGxvYWRGb2xkZXIgZnVsbFBhdGhcbiAgICAgIGVsc2UgaWYgc3RhdHMuaXNGaWxlKClcbiAgICAgICAgQGRpc3BsYXlGaWxlcy5wdXNoIGZ1bGxQYXRoXG4iXX0=
