(function() {
  var EditLine, LineMeta, MAX_SKIP_EMPTY_LINE_ALLOWED, config, utils;

  config = require("../config");

  utils = require("../utils");

  LineMeta = require("../helpers/line-meta");

  MAX_SKIP_EMPTY_LINE_ALLOWED = 5;

  module.exports = EditLine = (function() {
    function EditLine(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    EditLine.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            return _this[fn](e, selection);
          });
        };
      })(this));
    };

    EditLine.prototype.insertNewLine = function(e, selection) {
      var columnWidths, cursor, line, lineMeta, row;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      lineMeta = new LineMeta(line);
      if (lineMeta.isList("al") && !lineMeta.isIndented()) {
        return e.abortKeyBinding();
      }
      if (lineMeta.isContinuous()) {
        if (cursor.column < line.length && !config.get("inlineNewLineContinuation")) {
          return e.abortKeyBinding();
        }
        if (lineMeta.isEmptyBody()) {
          this._insertNewlineWithoutContinuation(cursor);
        } else {
          this._insertNewlineWithContinuation(lineMeta);
        }
        return;
      }
      if (this._isTableRow(cursor, line)) {
        row = utils.parseTableRow(line);
        columnWidths = row.columnWidths.reduce(function(sum, i) {
          return sum + i;
        });
        if (columnWidths === 0) {
          this._insertNewlineWithoutTableColumns();
        } else {
          this._insertNewlineWithTableColumns(row);
        }
        return;
      }
      return e.abortKeyBinding();
    };

    EditLine.prototype._insertNewlineWithContinuation = function(lineMeta) {
      var nextLine;
      nextLine = lineMeta.nextLine;
      if (lineMeta.isList("ol") && !config.get("orderedNewLineNumberContinuation")) {
        nextLine = lineMeta.lineHead(lineMeta.defaultHead);
      }
      return this.editor.insertText("\n" + nextLine);
    };

    EditLine.prototype._insertNewlineWithoutContinuation = function(cursor) {
      var currentIndentation, emptyLineSkipped, indentation, j, line, lineMeta, nextLine, ref, row;
      currentIndentation = this.editor.indentationForBufferRow(cursor.row);
      nextLine = "\n";
      if (currentIndentation < 1 || cursor.row < 1) {
        this.editor.selectToBeginningOfLine();
        this.editor.insertText(nextLine);
        return;
      }
      emptyLineSkipped = 0;
      for (row = j = ref = cursor.row - 1; ref <= 0 ? j <= 0 : j >= 0; row = ref <= 0 ? ++j : --j) {
        line = this.editor.lineTextForBufferRow(row);
        if (line.trim() === "") {
          if (emptyLineSkipped > MAX_SKIP_EMPTY_LINE_ALLOWED) {
            break;
          }
          emptyLineSkipped += 1;
        } else {
          indentation = this.editor.indentationForBufferRow(row);
          if (indentation >= currentIndentation) {
            continue;
          }
          if (indentation === currentIndentation - 1 && LineMeta.isList(line)) {
            lineMeta = new LineMeta(line);
            if (!(lineMeta.isList("al") && !lineMeta.isIndented())) {
              nextLine = lineMeta.nextLine;
            }
          }
          break;
        }
      }
      this.editor.selectToBeginningOfLine();
      return this.editor.insertText(nextLine);
    };

    EditLine.prototype._isTableRow = function(cursor, line) {
      if (!config.get("tableNewLineContinuation")) {
        return false;
      }
      if (cursor.row < 1 || !utils.isTableRow(line)) {
        return false;
      }
      if (utils.isTableSeparator(line)) {
        return true;
      }
      if (utils.isTableRow(this.editor.lineTextForBufferRow(cursor.row - 1))) {
        return true;
      }
      return false;
    };

    EditLine.prototype._insertNewlineWithoutTableColumns = function() {
      this.editor.selectLinesContainingCursors();
      return this.editor.insertText("\n");
    };

    EditLine.prototype._insertNewlineWithTableColumns = function(row) {
      var newLine, options;
      options = {
        numOfColumns: Math.max(1, row.columns.length),
        extraPipes: row.extraPipes,
        columnWidth: 1,
        columnWidths: [],
        alignment: config.get("tableAlignment"),
        alignments: []
      };
      newLine = utils.createTableRow([], options);
      this.editor.moveToEndOfLine();
      this.editor.insertText("\n" + newLine);
      this.editor.moveToBeginningOfLine();
      if (options.extraPipes) {
        return this.editor.moveToNextWordBoundary();
      }
    };

    EditLine.prototype.indentListLine = function(e, selection) {
      var bullet, cursor, line, lineMeta;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      lineMeta = new LineMeta(line);
      if (lineMeta.isList("ol")) {
        line = "" + (this.editor.getTabText()) + (lineMeta.lineHead(lineMeta.defaultHead)) + lineMeta.body;
        return this._replaceLine(selection, cursor.row, line);
      } else if (lineMeta.isList("ul")) {
        bullet = config.get("templateVariables.ulBullet" + (this.editor.indentationForBufferRow(cursor.row) + 1));
        bullet = bullet || config.get("templateVariables.ulBullet") || lineMeta.defaultHead;
        line = "" + (this.editor.getTabText()) + (lineMeta.lineHead(bullet)) + lineMeta.body;
        return this._replaceLine(selection, cursor.row, line);
      } else {
        return e.abortKeyBinding();
      }
    };

    EditLine.prototype._isRangeSelection = function(selection) {
      var head, tail;
      head = selection.getHeadBufferPosition();
      tail = selection.getTailBufferPosition();
      return head.row !== tail.row || head.column !== tail.column;
    };

    EditLine.prototype._replaceLine = function(selection, row, line) {
      var range;
      range = selection.cursor.getCurrentLineBufferRange();
      selection.setBufferRange(range);
      return selection.insertText(line);
    };

    EditLine.prototype._isAtLineBeginning = function(line, col) {
      return col === 0 || line.substring(0, col).trim() === "";
    };

    EditLine.prototype.undentListLine = function(e, selection) {
      var bullet, currentIndentation, cursor, line, lineMeta;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      currentIndentation = this.editor.indentationForBufferRow(cursor.row);
      if (currentIndentation < 1) {
        return e.abortKeyBinding();
      }
      line = this.editor.lineTextForBufferRow(cursor.row);
      lineMeta = new LineMeta(line);
      if (lineMeta.isList("ol")) {
        line = "" + (lineMeta.lineHead(lineMeta.defaultHead)) + lineMeta.body;
        line = line.substring(this.editor.getTabText().length);
        return this._replaceLine(selection, cursor.row, line);
      } else if (lineMeta.isList("ul")) {
        bullet = config.get("templateVariables.ulBullet" + (currentIndentation - 1));
        bullet = bullet || config.get("templateVariables.ulBullet") || lineMeta.defaultHead;
        line = "" + (lineMeta.lineHead(bullet)) + lineMeta.body;
        line = line.substring(this.editor.getTabText().length);
        return this._replaceLine(selection, cursor.row, line);
      } else {
        return e.abortKeyBinding();
      }
    };

    return EditLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvZWRpdC1saW5lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFFUixRQUFBLEdBQVcsT0FBQSxDQUFRLHNCQUFSOztFQUVYLDJCQUFBLEdBQThCOztFQUU5QixNQUFNLENBQUMsT0FBUCxHQUNNO0lBRVMsa0JBQUMsTUFBRDtNQUNYLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtJQUZDOzt1QkFJYixPQUFBLEdBQVMsU0FBQyxDQUFEO0FBQ1AsVUFBQTtNQUFBLEVBQUEsR0FBSyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsVUFBaEIsRUFBNEIsU0FBQyxDQUFEO2VBQU8sQ0FBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQUwsQ0FBQTtNQUFQLENBQTVCO2FBRUwsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDZixLQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBQSxDQUF1QixDQUFDLE9BQXhCLENBQWdDLFNBQUMsU0FBRDttQkFDOUIsS0FBRSxDQUFBLEVBQUEsQ0FBRixDQUFNLENBQU4sRUFBUyxTQUFUO1VBRDhCLENBQWhDO1FBRGU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCO0lBSE87O3VCQU9ULGFBQUEsR0FBZSxTQUFDLENBQUQsRUFBSSxTQUFKO0FBQ2IsVUFBQTtNQUFBLElBQThCLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixTQUFuQixDQUE5QjtBQUFBLGVBQU8sQ0FBQyxD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QUFXLDRCQUFBLEdBQTRCLENBQUMsa0JBQUEsR0FBbUIsQ0FBcEIsQ0FBdkM7UUFDVCxNQUFBLEdBQVMsTUFBQSxJQUFVLE1BQU0sQ0FBQyxHQUFQLENBQVcsNEJBQVgsQ0FBVixJQUFzRCxRQUFRLENBQUM7UUFFeEUsSUFBQSxHQUFPLEVBQUEsR0FBRSxDQUFDLFFBQVEsQ0FBQyxRQUFULENBQWtCLE1BQWxCLENBQUQsQ0FBRixHQUErQixRQUFRLENBQUM7UUFDL0MsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQUEsQ0FBb0IsQ0FBQyxNQUFwQztlQUNQLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUF5QixNQUFNLENBQUMsR0FBaEMsRUFBcUMsSUFBckMsRUFORztPQUFBLE1BQUE7ZUFTSCxDQUFDLENBQUMsZUFBRixDQUFBLEVBVEc7O0lBZlM7Ozs7O0FBL0psQiIsInNvdXJjZXNDb250ZW50IjpbImNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxuXG5MaW5lTWV0YSA9IHJlcXVpcmUgXCIuLi9oZWxwZXJzL2xpbmUtbWV0YVwiXG5cbk1BWF9TS0lQX0VNUFRZX0xJTkVfQUxMT1dFRCA9IDVcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRWRpdExpbmVcbiAgIyBhY3Rpb246IGluc2VydC1uZXctbGluZSwgaW5kZW50LWxpc3QtbGluZVxuICBjb25zdHJ1Y3RvcjogKGFjdGlvbikgLT5cbiAgICBAYWN0aW9uID0gYWN0aW9uXG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gIHRyaWdnZXI6IChlKSAtPlxuICAgIGZuID0gQGFjdGlvbi5yZXBsYWNlIC8tW2Etel0vaWcsIChzKSAtPiBzWzFdLnRvVXBwZXJDYXNlKClcblxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIEBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpLmZvckVhY2ggKHNlbGVjdGlvbikgPT5cbiAgICAgICAgQFtmbl0oZSwgc2VsZWN0aW9uKVxuXG4gIGluc2VydE5ld0xpbmU6IChlLCBzZWxlY3Rpb24pIC0+XG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKCkgaWYgQF9pc1JhbmdlU2VsZWN0aW9uKHNlbGVjdGlvbilcblxuICAgIGN1cnNvciA9IHNlbGVjdGlvbi5nZXRIZWFkQnVmZmVyUG9zaXRpb24oKVxuICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGN1cnNvci5yb3cpXG5cbiAgICBsaW5lTWV0YSA9IG5ldyBMaW5lTWV0YShsaW5lKVxuICAgICMgZG9uJ3QgY29udGludWUgYWxwaGEgT0wgaWYgdGhlIGxpbmUgaXMgdW5pbmRlbnRlZFxuICAgIGlmIGxpbmVNZXRhLmlzTGlzdChcImFsXCIpICYmICFsaW5lTWV0YS5pc0luZGVudGVkKClcbiAgICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpXG5cbiAgICBpZiBsaW5lTWV0YS5pc0NvbnRpbnVvdXMoKVxuICAgICAgIyB3aGVuIGN1cnNvciBpcyBhdCBtaWRkbGUgb2YgbGluZSwgZG8gYSBub3JtYWwgaW5zZXJ0IGxpbmVcbiAgICAgICMgdW5sZXNzIGlubGluZSBjb250aW51YXRpb24gaXMgZW5hYmxlZFxuICAgICAgaWYgY3Vyc29yLmNvbHVtbiA8IGxpbmUubGVuZ3RoICYmICFjb25maWcuZ2V0KFwiaW5saW5lTmV3TGluZUNvbnRpbnVhdGlvblwiKVxuICAgICAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKVxuXG4gICAgICBpZiBsaW5lTWV0YS5pc0VtcHR5Qm9keSgpXG4gICAgICAgIEBfaW5zZXJ0TmV3bGluZVdpdGhvdXRDb250aW51YXRpb24oY3Vyc29yKVxuICAgICAgZWxzZVxuICAgICAgICBAX2luc2VydE5ld2xpbmVXaXRoQ29udGludWF0aW9uKGxpbmVNZXRhKVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiBAX2lzVGFibGVSb3coY3Vyc29yLCBsaW5lKVxuICAgICAgcm93ID0gdXRpbHMucGFyc2VUYWJsZVJvdyhsaW5lKVxuICAgICAgY29sdW1uV2lkdGhzID0gcm93LmNvbHVtbldpZHRocy5yZWR1Y2UoKHN1bSwgaSkgLT4gc3VtICsgaSlcbiAgICAgIGlmIGNvbHVtbldpZHRocyA9PSAwXG4gICAgICAgIEBfaW5zZXJ0TmV3bGluZVdpdGhvdXRUYWJsZUNvbHVtbnMoKVxuICAgICAgZWxzZVxuICAgICAgICBAX2luc2VydE5ld2xpbmVXaXRoVGFibGVDb2x1bW5zKHJvdylcbiAgICAgIHJldHVyblxuXG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICBfaW5zZXJ0TmV3bGluZVdpdGhDb250aW51YXRpb246IChsaW5lTWV0YSkgLT5cbiAgICBuZXh0TGluZSA9IGxpbmVNZXRhLm5leHRMaW5lXG4gICAgIyBkb24ndCBjb250aW51ZSBudW1iZXJzIGluIE9MXG4gICAgaWYgbGluZU1ldGEuaXNMaXN0KFwib2xcIikgJiYgIWNvbmZpZy5nZXQoXCJvcmRlcmVkTmV3TGluZU51bWJlckNvbnRpbnVhdGlvblwiKVxuICAgICAgbmV4dExpbmUgPSBsaW5lTWV0YS5saW5lSGVhZChsaW5lTWV0YS5kZWZhdWx0SGVhZClcblxuICAgIEBlZGl0b3IuaW5zZXJ0VGV4dChcIlxcbiN7bmV4dExpbmV9XCIpXG5cbiAgX2luc2VydE5ld2xpbmVXaXRob3V0Q29udGludWF0aW9uOiAoY3Vyc29yKSAtPlxuICAgIGN1cnJlbnRJbmRlbnRhdGlvbiA9IEBlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3coY3Vyc29yLnJvdylcblxuICAgIG5leHRMaW5lID0gXCJcXG5cIlxuICAgICMgaWYgdGhpcyBpcyBhbiBsaXN0IHdpdGhvdXQgaW5kZW50YXRpb24sIG9yIGF0IGJlZ2lubmluZyBvZiB0aGUgZmlsZVxuICAgIGlmIGN1cnJlbnRJbmRlbnRhdGlvbiA8IDEgfHwgY3Vyc29yLnJvdyA8IDFcbiAgICAgIEBlZGl0b3Iuc2VsZWN0VG9CZWdpbm5pbmdPZkxpbmUoKVxuICAgICAgQGVkaXRvci5pbnNlcnRUZXh0KG5leHRMaW5lKVxuICAgICAgcmV0dXJuXG5cbiAgICBlbXB0eUxpbmVTa2lwcGVkID0gMFxuICAgICMgaWYgdGhpcyBpcyBhbiBpbmRlbnRlZCBlbXB0eSBsaXN0LCB3ZSB3aWxsIGdvIHVwIGxpbmVzIGFuZCB0cnkgdG8gZmluZFxuICAgICMgaXRzIHBhcmVudCdzIGxpc3QgcHJlZml4IGFuZCB1c2UgdGhhdCBpZiBwb3NzaWJsZVxuICAgIGZvciByb3cgaW4gWyhjdXJzb3Iucm93IC0gMSkuLjBdXG4gICAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpXG5cbiAgICAgIGlmIGxpbmUudHJpbSgpID09IFwiXCIgIyBza2lwIGVtcHR5IGxpbmVzIGluIGNhc2Ugb2YgbGlzdCBwYXJhZ3JhcGhzXG4gICAgICAgIGJyZWFrIGlmIGVtcHR5TGluZVNraXBwZWQgPiBNQVhfU0tJUF9FTVBUWV9MSU5FX0FMTE9XRURcbiAgICAgICAgZW1wdHlMaW5lU2tpcHBlZCArPSAxXG4gICAgICBlbHNlICMgZmluZCBwYXJlbnQgd2l0aCBpbmRlbnRhdGlvbiA9IGN1cnJlbnQgaW5kZW50YXRpb24gLSAxXG4gICAgICAgIGluZGVudGF0aW9uID0gQGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhyb3cpXG4gICAgICAgIGNvbnRpbnVlIGlmIGluZGVudGF0aW9uID49IGN1cnJlbnRJbmRlbnRhdGlvblxuXG4gICAgICAgIGlmIGluZGVudGF0aW9uID09IGN1cnJlbnRJbmRlbnRhdGlvbiAtIDEgJiYgTGluZU1ldGEuaXNMaXN0KGxpbmUpXG4gICAgICAgICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEobGluZSlcbiAgICAgICAgICBuZXh0TGluZSA9IGxpbmVNZXRhLm5leHRMaW5lIHVubGVzcyBsaW5lTWV0YS5pc0xpc3QoXCJhbFwiKSAmJiAhbGluZU1ldGEuaXNJbmRlbnRlZCgpXG4gICAgICAgIGJyZWFrXG5cbiAgICBAZWRpdG9yLnNlbGVjdFRvQmVnaW5uaW5nT2ZMaW5lKClcbiAgICBAZWRpdG9yLmluc2VydFRleHQobmV4dExpbmUpXG5cbiAgX2lzVGFibGVSb3c6IChjdXJzb3IsIGxpbmUpIC0+XG4gICAgcmV0dXJuIGZhbHNlIGlmICFjb25maWcuZ2V0KFwidGFibGVOZXdMaW5lQ29udGludWF0aW9uXCIpXG4gICAgIyBmaXJzdCByb3cgb3Igbm90IGEgcm93XG4gICAgcmV0dXJuIGZhbHNlIGlmIGN1cnNvci5yb3cgPCAxIHx8ICF1dGlscy5pc1RhYmxlUm93KGxpbmUpXG4gICAgIyBjYXNlIDAsIGF0IHRhYmxlIHNlcGFyYXRvciwgY29udGludWUgdGFibGUgcm93XG4gICAgcmV0dXJuIHRydWUgaWYgdXRpbHMuaXNUYWJsZVNlcGFyYXRvcihsaW5lKVxuICAgICMgY2FzZSAxLCBhdCB0YWJsZSByb3csIHByZXZpb3VzIGxpbmUgaXMgYSByb3csIGNvbnRpbnVlIHJvd1xuICAgIHJldHVybiB0cnVlIGlmIHV0aWxzLmlzVGFibGVSb3coQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjdXJzb3Iucm93LTEpKVxuICAgICMgZWxzZSwgYXQgdGFibGUgaGVhZCwgcHJldmlvdXMgbGluZSBpcyBub3QgYSByb3csIGRvIG5vdCBjb250aW51ZSByb3dcbiAgICByZXR1cm4gZmFsc2VcblxuICBfaW5zZXJ0TmV3bGluZVdpdGhvdXRUYWJsZUNvbHVtbnM6IC0+XG4gICAgQGVkaXRvci5zZWxlY3RMaW5lc0NvbnRhaW5pbmdDdXJzb3JzKClcbiAgICBAZWRpdG9yLmluc2VydFRleHQoXCJcXG5cIilcblxuICBfaW5zZXJ0TmV3bGluZVdpdGhUYWJsZUNvbHVtbnM6IChyb3cpIC0+XG4gICAgb3B0aW9ucyA9XG4gICAgICBudW1PZkNvbHVtbnM6IE1hdGgubWF4KDEsIHJvdy5jb2x1bW5zLmxlbmd0aClcbiAgICAgIGV4dHJhUGlwZXM6IHJvdy5leHRyYVBpcGVzXG4gICAgICBjb2x1bW5XaWR0aDogMVxuICAgICAgY29sdW1uV2lkdGhzOiBbXVxuICAgICAgYWxpZ25tZW50OiBjb25maWcuZ2V0KFwidGFibGVBbGlnbm1lbnRcIilcbiAgICAgIGFsaWdubWVudHM6IFtdXG5cbiAgICBuZXdMaW5lID0gdXRpbHMuY3JlYXRlVGFibGVSb3coW10sIG9wdGlvbnMpXG4gICAgQGVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuICAgIEBlZGl0b3IuaW5zZXJ0VGV4dChcIlxcbiN7bmV3TGluZX1cIilcbiAgICBAZWRpdG9yLm1vdmVUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgQGVkaXRvci5tb3ZlVG9OZXh0V29yZEJvdW5kYXJ5KCkgaWYgb3B0aW9ucy5leHRyYVBpcGVzXG5cbiAgaW5kZW50TGlzdExpbmU6IChlLCBzZWxlY3Rpb24pIC0+XG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKCkgaWYgQF9pc1JhbmdlU2VsZWN0aW9uKHNlbGVjdGlvbilcblxuICAgIGN1cnNvciA9IHNlbGVjdGlvbi5nZXRIZWFkQnVmZmVyUG9zaXRpb24oKVxuICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGN1cnNvci5yb3cpXG4gICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEobGluZSlcblxuICAgIGlmIGxpbmVNZXRhLmlzTGlzdChcIm9sXCIpXG4gICAgICBsaW5lID0gXCIje0BlZGl0b3IuZ2V0VGFiVGV4dCgpfSN7bGluZU1ldGEubGluZUhlYWQobGluZU1ldGEuZGVmYXVsdEhlYWQpfSN7bGluZU1ldGEuYm9keX1cIlxuICAgICAgQF9yZXBsYWNlTGluZShzZWxlY3Rpb24sIGN1cnNvci5yb3csIGxpbmUpXG5cbiAgICBlbHNlIGlmIGxpbmVNZXRhLmlzTGlzdChcInVsXCIpXG4gICAgICBidWxsZXQgPSBjb25maWcuZ2V0KFwidGVtcGxhdGVWYXJpYWJsZXMudWxCdWxsZXQje0BlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3coY3Vyc29yLnJvdykrMX1cIilcbiAgICAgIGJ1bGxldCA9IGJ1bGxldCB8fCBjb25maWcuZ2V0KFwidGVtcGxhdGVWYXJpYWJsZXMudWxCdWxsZXRcIikgfHwgbGluZU1ldGEuZGVmYXVsdEhlYWRcblxuICAgICAgbGluZSA9IFwiI3tAZWRpdG9yLmdldFRhYlRleHQoKX0je2xpbmVNZXRhLmxpbmVIZWFkKGJ1bGxldCl9I3tsaW5lTWV0YS5ib2R5fVwiXG4gICAgICBAX3JlcGxhY2VMaW5lKHNlbGVjdGlvbiwgY3Vyc29yLnJvdywgbGluZSlcblxuICAgIGVsc2VcbiAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICBfaXNSYW5nZVNlbGVjdGlvbjogKHNlbGVjdGlvbikgLT5cbiAgICBoZWFkID0gc2VsZWN0aW9uLmdldEhlYWRCdWZmZXJQb3NpdGlvbigpXG4gICAgdGFpbCA9IHNlbGVjdGlvbi5nZXRUYWlsQnVmZmVyUG9zaXRpb24oKVxuXG4gICAgaGVhZC5yb3cgIT0gdGFpbC5yb3cgfHwgaGVhZC5jb2x1bW4gIT0gdGFpbC5jb2x1bW5cblxuICBfcmVwbGFjZUxpbmU6IChzZWxlY3Rpb24sIHJvdywgbGluZSkgLT5cbiAgICByYW5nZSA9IHNlbGVjdGlvbi5jdXJzb3IuZ2V0Q3VycmVudExpbmVCdWZmZXJSYW5nZSgpXG4gICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgIHNlbGVjdGlvbi5pbnNlcnRUZXh0KGxpbmUpXG5cbiAgX2lzQXRMaW5lQmVnaW5uaW5nOiAobGluZSwgY29sKSAtPlxuICAgIGNvbCA9PSAwIHx8IGxpbmUuc3Vic3RyaW5nKDAsIGNvbCkudHJpbSgpID09IFwiXCJcblxuICB1bmRlbnRMaXN0TGluZTogKGUsIHNlbGVjdGlvbikgLT5cbiAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKSBpZiBAX2lzUmFuZ2VTZWxlY3Rpb24oc2VsZWN0aW9uKVxuXG4gICAgY3Vyc29yID0gc2VsZWN0aW9uLmdldEhlYWRCdWZmZXJQb3NpdGlvbigpXG4gICAgY3VycmVudEluZGVudGF0aW9uID0gQGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhjdXJzb3Iucm93KVxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmIGN1cnJlbnRJbmRlbnRhdGlvbiA8IDFcblxuICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGN1cnNvci5yb3cpXG4gICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEobGluZSlcblxuICAgIGlmIGxpbmVNZXRhLmlzTGlzdChcIm9sXCIpXG4gICAgICBsaW5lID0gXCIje2xpbmVNZXRhLmxpbmVIZWFkKGxpbmVNZXRhLmRlZmF1bHRIZWFkKX0je2xpbmVNZXRhLmJvZHl9XCJcbiAgICAgIGxpbmUgPSBsaW5lLnN1YnN0cmluZyhAZWRpdG9yLmdldFRhYlRleHQoKS5sZW5ndGgpICMgcmVtb3ZlIG9uZSBpbmRlbnRcbiAgICAgIEBfcmVwbGFjZUxpbmUoc2VsZWN0aW9uLCBjdXJzb3Iucm93LCBsaW5lKVxuXG4gICAgZWxzZSBpZiBsaW5lTWV0YS5pc0xpc3QoXCJ1bFwiKVxuICAgICAgYnVsbGV0ID0gY29uZmlnLmdldChcInRlbXBsYXRlVmFyaWFibGVzLnVsQnVsbGV0I3tjdXJyZW50SW5kZW50YXRpb24tMX1cIilcbiAgICAgIGJ1bGxldCA9IGJ1bGxldCB8fCBjb25maWcuZ2V0KFwidGVtcGxhdGVWYXJpYWJsZXMudWxCdWxsZXRcIikgfHwgbGluZU1ldGEuZGVmYXVsdEhlYWRcblxuICAgICAgbGluZSA9IFwiI3tsaW5lTWV0YS5saW5lSGVhZChidWxsZXQpfSN7bGluZU1ldGEuYm9keX1cIlxuICAgICAgbGluZSA9IGxpbmUuc3Vic3RyaW5nKEBlZGl0b3IuZ2V0VGFiVGV4dCgpLmxlbmd0aCkgIyByZW1vdmUgb25lIGluZGVudFxuICAgICAgQF9yZXBsYWNlTGluZShzZWxlY3Rpb24sIGN1cnNvci5yb3csIGxpbmUpXG5cbiAgICBlbHNlXG4gICAgICBlLmFib3J0S2V5QmluZGluZygpXG4iXX0=
