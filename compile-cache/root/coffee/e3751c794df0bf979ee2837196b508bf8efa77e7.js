(function() {
  var Range, RangeFinder;

  Range = require('atom').Range;

  module.exports = RangeFinder = (function() {
    RangeFinder.rangesFor = function(editor) {
      return new RangeFinder(editor).ranges();
    };

    function RangeFinder(editor1) {
      this.editor = editor1;
    }

    RangeFinder.prototype.ranges = function() {
      var selectionRanges;
      selectionRanges = this.selectionRanges();
      if (selectionRanges.length === 0) {
        return [this.sortableRangeForEntireBuffer()];
      } else {
        return selectionRanges.map((function(_this) {
          return function(selectionRange) {
            return _this.sortableRangeFrom(selectionRange);
          };
        })(this));
      }
    };

    RangeFinder.prototype.selectionRanges = function() {
      return this.editor.getSelectedBufferRanges().filter(function(range) {
        return !range.isEmpty();
      });
    };

    RangeFinder.prototype.sortableRangeForEntireBuffer = function() {
      return this.editor.getBuffer().getRange();
    };

    RangeFinder.prototype.sortableRangeFrom = function(selectionRange) {
      var endCol, endRow, startCol, startRow;
      startRow = selectionRange.start.row;
      startCol = 0;
      endRow = selectionRange.end.column === 0 ? selectionRange.end.row - 1 : selectionRange.end.row;
      endCol = this.editor.lineTextForBufferRow(endRow).length;
      return new Range([startRow, startCol], [endRow, endCol]);
    };

    return RangeFinder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2F0b20tcHJldHRpZnkvbGliL3JhbmdlLWZpbmRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVKLFdBQUMsQ0FBQSxTQUFELEdBQVksU0FBQyxNQUFEO2FBQ1YsSUFBSSxXQUFKLENBQWdCLE1BQWhCLENBQXVCLENBQUMsTUFBeEIsQ0FBQTtJQURVOztJQUlDLHFCQUFDLE9BQUQ7TUFBQyxJQUFDLENBQUEsU0FBRDtJQUFEOzswQkFHYixNQUFBLEdBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxlQUFELENBQUE7TUFDbEIsSUFBRyxlQUFlLENBQUMsTUFBaEIsS0FBMEIsQ0FBN0I7ZUFDRSxDQUFDLElBQUMsQ0FBQSw0QkFBRCxDQUFBLENBQUQsRUFERjtPQUFBLE1BQUE7ZUFHRSxlQUFlLENBQUMsR0FBaEIsQ0FBb0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxjQUFEO21CQUNsQixLQUFDLENBQUEsaUJBQUQsQ0FBbUIsY0FBbkI7VUFEa0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCLEVBSEY7O0lBRk07OzBCQVNSLGVBQUEsR0FBaUIsU0FBQTthQUNmLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUFpQyxDQUFDLE1BQWxDLENBQXlDLFNBQUMsS0FBRDtlQUN2QyxDQUFJLEtBQUssQ0FBQyxPQUFOLENBQUE7TUFEbUMsQ0FBekM7SUFEZTs7MEJBS2pCLDRCQUFBLEdBQThCLFNBQUE7YUFDNUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxRQUFwQixDQUFBO0lBRDRCOzswQkFJOUIsaUJBQUEsR0FBbUIsU0FBQyxjQUFEO0FBQ2pCLFVBQUE7TUFBQSxRQUFBLEdBQVcsY0FBYyxDQUFDLEtBQUssQ0FBQztNQUNoQyxRQUFBLEdBQVc7TUFDWCxNQUFBLEdBQVksY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFuQixLQUE2QixDQUFoQyxHQUNQLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBbkIsR0FBeUIsQ0FEbEIsR0FHUCxjQUFjLENBQUMsR0FBRyxDQUFDO01BQ3JCLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLE1BQTdCLENBQW9DLENBQUM7YUFFOUMsSUFBSSxLQUFKLENBQVUsQ0FBQyxRQUFELEVBQVcsUUFBWCxDQUFWLEVBQWdDLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBaEM7SUFUaUI7Ozs7O0FBOUJyQiIsInNvdXJjZXNDb250ZW50IjpbIntSYW5nZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSYW5nZUZpbmRlclxuICAjIFB1YmxpY1xuICBAcmFuZ2VzRm9yOiAoZWRpdG9yKSAtPlxuICAgIG5ldyBSYW5nZUZpbmRlcihlZGl0b3IpLnJhbmdlcygpXG5cbiAgIyBQdWJsaWNcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yKSAtPlxuXG4gICMgUHVibGljXG4gIHJhbmdlczogLT5cbiAgICBzZWxlY3Rpb25SYW5nZXMgPSBAc2VsZWN0aW9uUmFuZ2VzKClcbiAgICBpZiBzZWxlY3Rpb25SYW5nZXMubGVuZ3RoIGlzIDBcbiAgICAgIFtAc29ydGFibGVSYW5nZUZvckVudGlyZUJ1ZmZlcigpXVxuICAgIGVsc2VcbiAgICAgIHNlbGVjdGlvblJhbmdlcy5tYXAgKHNlbGVjdGlvblJhbmdlKSA9PlxuICAgICAgICBAc29ydGFibGVSYW5nZUZyb20oc2VsZWN0aW9uUmFuZ2UpXG5cbiAgIyBJbnRlcm5hbFxuICBzZWxlY3Rpb25SYW5nZXM6IC0+XG4gICAgQGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpLmZpbHRlciAocmFuZ2UpIC0+XG4gICAgICBub3QgcmFuZ2UuaXNFbXB0eSgpXG5cbiAgIyBJbnRlcm5hbFxuICBzb3J0YWJsZVJhbmdlRm9yRW50aXJlQnVmZmVyOiAtPlxuICAgIEBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0UmFuZ2UoKVxuXG4gICMgSW50ZXJuYWxcbiAgc29ydGFibGVSYW5nZUZyb206IChzZWxlY3Rpb25SYW5nZSkgLT5cbiAgICBzdGFydFJvdyA9IHNlbGVjdGlvblJhbmdlLnN0YXJ0LnJvd1xuICAgIHN0YXJ0Q29sID0gMFxuICAgIGVuZFJvdyA9IGlmIHNlbGVjdGlvblJhbmdlLmVuZC5jb2x1bW4gPT0gMFxuICAgICAgc2VsZWN0aW9uUmFuZ2UuZW5kLnJvdyAtIDFcbiAgICBlbHNlXG4gICAgICBzZWxlY3Rpb25SYW5nZS5lbmQucm93XG4gICAgZW5kQ29sID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhlbmRSb3cpLmxlbmd0aFxuXG4gICAgbmV3IFJhbmdlIFtzdGFydFJvdywgc3RhcnRDb2xdLCBbZW5kUm93LCBlbmRDb2xdXG4iXX0=
