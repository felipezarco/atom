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
      var bullet, cursor, line, lineMeta, newcursor, newline;
      if (this._isRangeSelection(selection)) {
        return e.abortKeyBinding();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      lineMeta = new LineMeta(line);
      if (lineMeta.isList("al")) {
        return e.abortKeyBinding();
      }
      if (lineMeta.isList("ol")) {
        newline = "" + (this.editor.getTabText()) + (lineMeta.lineHead(lineMeta.defaultHead)) + lineMeta.body;
        newcursor = [cursor.row, cursor.column + newline.length - line.length];
        return this._replaceLine(selection, newline, newcursor);
      } else if (lineMeta.isList("ul")) {
        bullet = config.get("templateVariables.ulBullet" + (this.editor.indentationForBufferRow(cursor.row) + 1));
        bullet = bullet || config.get("templateVariables.ulBullet") || lineMeta.defaultHead;
        newline = "" + (this.editor.getTabText()) + (lineMeta.lineHead(bullet)) + lineMeta.body;
        newcursor = [cursor.row, cursor.column + newline.length - line.length];
        return this._replaceLine(selection, newline, newcursor);
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

    EditLine.prototype._replaceLine = function(selection, line, cursor) {
      var range;
      range = selection.cursor.getCurrentLineBufferRange();
      selection.setBufferRange(range);
      selection.insertText(line);
      return selection.cursor.setBufferPosition(cursor);
    };

    EditLine.prototype._isAtLineBeginning = function(line, col) {
      return col === 0 || line.substring(0, col).trim() === "";
    };

    EditLine.prototype.undentListLine = function(e, selection) {
      var bullet, currentIndentation, cursor, line, lineMeta, newcursor, newline;
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
      if (lineMeta.isList("al")) {
        return e.abortKeyBinding();
      }
      if (lineMeta.isList("ol")) {
        newline = "" + (lineMeta.lineHead(lineMeta.defaultHead)) + lineMeta.body;
        newline = newline.substring(this.editor.getTabText().length);
        newcursor = [cursor.row, Math.max(cursor.column + newline.length - line.length, 0)];
        return this._replaceLine(selection, newline, newcursor);
      } else if (lineMeta.isList("ul")) {
        bullet = config.get("templateVariables.ulBullet" + (currentIndentation - 1));
        bullet = bullet || config.get("templateVariables.ulBullet") || lineMeta.defaultHead;
        newline = "" + (lineMeta.lineHead(bullet)) + lineMeta.body;
        newline = newline.substring(this.editor.getTabText().length);
        newcursor = [cursor.row, Math.max(cursor.column + newline.length - line.length, 0)];
        return this._replaceLine(selection, newline, newcursor);
      } else {
        return e.abortKeyBinding();
      }
    };

    return EditLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvY29tbWFuZHMvZWRpdC1saW5lLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFFUixRQUFBLEdBQVcsT0FBQSxDQUFRLHNCQUFSOztFQUVYLDJCQUFBLEdBQThCOztFQUU5QixNQUFNLENBQUMsT0FBUCxHQUNNO0lBRVMsa0JBQUMsTUFBRDtNQUNYLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtJQUZDOzt1QkFJYixPQUFBLEdBQVMsU0FBQyxDQUFEO0FBQ1AsVUFBQTtNQUFBLEVBQUEsR0FBSyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsVUFBaEIsRUFBNEIsU0FBQyxDQUFEO2VBQU8sQ0FBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQUwsQ0FBQTtNQUFQLENBQTVCO2FBRUwsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDZixLQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBQSxDQUF1QixDQUFDLE9BQXhCLENBQWdDLFNBQUMsU0FBRDttQkFDOUIsS0FBRSxDQUFBLEVBQUEsQ0FBRixDQUFNLENBQU4sRUFBUyxTQUFUO1VBRDhCLENBQWhDO1FBRGU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCO0lBSE87O3VCQU9ULGFBQUEsR0FBZSxTQUFDLENBQUQsRUFBSSxTQUFKO0FBQ2IsVUFBQTtNQUFBLElBQThCLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixTQUFuQixDQUE5QjtBQUFBLGVBQU8sQ0FBQyxD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SSxDQUFDLE1BQS9DLEVBQXVELENBQXZELENBQWI7ZUFDWixJQUFDLENBQUEsWUFBRCxDQUFjLFNBQWQsRUFBeUIsT0FBekIsRUFBa0MsU0FBbEMsRUFQRztPQUFBLE1BQUE7ZUFVSCxDQUFDLENBQUMsZUFBRixDQUFBLEVBVkc7O0lBbEJTOzs7OztBQXJLbEIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnXCJcbnV0aWxzID0gcmVxdWlyZSBcIi4uL3V0aWxzXCJcblxuTGluZU1ldGEgPSByZXF1aXJlIFwiLi4vaGVscGVycy9saW5lLW1ldGFcIlxuXG5NQVhfU0tJUF9FTVBUWV9MSU5FX0FMTE9XRUQgPSA1XG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEVkaXRMaW5lXG4gICMgYWN0aW9uOiBpbnNlcnQtbmV3LWxpbmUsIGluZGVudC1saXN0LWxpbmVcbiAgY29uc3RydWN0b3I6IChhY3Rpb24pIC0+XG4gICAgQGFjdGlvbiA9IGFjdGlvblxuICAgIEBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICB0cmlnZ2VyOiAoZSkgLT5cbiAgICBmbiA9IEBhY3Rpb24ucmVwbGFjZSAvLVthLXpdL2lnLCAocykgLT4gc1sxXS50b1VwcGVyQ2FzZSgpXG5cbiAgICBAZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICBAZWRpdG9yLmdldFNlbGVjdGlvbnMoKS5mb3JFYWNoIChzZWxlY3Rpb24pID0+XG4gICAgICAgIEBbZm5dKGUsIHNlbGVjdGlvbilcblxuICBpbnNlcnROZXdMaW5lOiAoZSwgc2VsZWN0aW9uKSAtPlxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmIEBfaXNSYW5nZVNlbGVjdGlvbihzZWxlY3Rpb24pXG5cbiAgICBjdXJzb3IgPSBzZWxlY3Rpb24uZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcbiAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjdXJzb3Iucm93KVxuXG4gICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEobGluZSlcbiAgICAjIGRvbid0IGNvbnRpbnVlIGFscGhhIE9MIGlmIHRoZSBsaW5lIGlzIHVuaW5kZW50ZWRcbiAgICBpZiBsaW5lTWV0YS5pc0xpc3QoXCJhbFwiKSAmJiAhbGluZU1ldGEuaXNJbmRlbnRlZCgpXG4gICAgICByZXR1cm4gZS5hYm9ydEtleUJpbmRpbmcoKVxuXG4gICAgaWYgbGluZU1ldGEuaXNDb250aW51b3VzKClcbiAgICAgICMgd2hlbiBjdXJzb3IgaXMgYXQgbWlkZGxlIG9mIGxpbmUsIGRvIGEgbm9ybWFsIGluc2VydCBsaW5lXG4gICAgICAjIHVubGVzcyBpbmxpbmUgY29udGludWF0aW9uIGlzIGVuYWJsZWRcbiAgICAgIGlmIGN1cnNvci5jb2x1bW4gPCBsaW5lLmxlbmd0aCAmJiAhY29uZmlnLmdldChcImlubGluZU5ld0xpbmVDb250aW51YXRpb25cIilcbiAgICAgICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICAgICAgaWYgbGluZU1ldGEuaXNFbXB0eUJvZHkoKVxuICAgICAgICBAX2luc2VydE5ld2xpbmVXaXRob3V0Q29udGludWF0aW9uKGN1cnNvcilcbiAgICAgIGVsc2VcbiAgICAgICAgQF9pbnNlcnROZXdsaW5lV2l0aENvbnRpbnVhdGlvbihsaW5lTWV0YSlcbiAgICAgIHJldHVyblxuXG4gICAgaWYgQF9pc1RhYmxlUm93KGN1cnNvciwgbGluZSlcbiAgICAgIHJvdyA9IHV0aWxzLnBhcnNlVGFibGVSb3cobGluZSlcbiAgICAgIGNvbHVtbldpZHRocyA9IHJvdy5jb2x1bW5XaWR0aHMucmVkdWNlKChzdW0sIGkpIC0+IHN1bSArIGkpXG4gICAgICBpZiBjb2x1bW5XaWR0aHMgPT0gMFxuICAgICAgICBAX2luc2VydE5ld2xpbmVXaXRob3V0VGFibGVDb2x1bW5zKClcbiAgICAgIGVsc2VcbiAgICAgICAgQF9pbnNlcnROZXdsaW5lV2l0aFRhYmxlQ29sdW1ucyhyb3cpXG4gICAgICByZXR1cm5cblxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpXG5cbiAgX2luc2VydE5ld2xpbmVXaXRoQ29udGludWF0aW9uOiAobGluZU1ldGEpIC0+XG4gICAgbmV4dExpbmUgPSBsaW5lTWV0YS5uZXh0TGluZVxuICAgICMgZG9uJ3QgY29udGludWUgbnVtYmVycyBpbiBPTFxuICAgIGlmIGxpbmVNZXRhLmlzTGlzdChcIm9sXCIpICYmICFjb25maWcuZ2V0KFwib3JkZXJlZE5ld0xpbmVOdW1iZXJDb250aW51YXRpb25cIilcbiAgICAgIG5leHRMaW5lID0gbGluZU1ldGEubGluZUhlYWQobGluZU1ldGEuZGVmYXVsdEhlYWQpXG5cbiAgICBAZWRpdG9yLmluc2VydFRleHQoXCJcXG4je25leHRMaW5lfVwiKVxuXG4gIF9pbnNlcnROZXdsaW5lV2l0aG91dENvbnRpbnVhdGlvbjogKGN1cnNvcikgLT5cbiAgICBjdXJyZW50SW5kZW50YXRpb24gPSBAZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KGN1cnNvci5yb3cpXG5cbiAgICBuZXh0TGluZSA9IFwiXFxuXCJcbiAgICAjIGlmIHRoaXMgaXMgYW4gbGlzdCB3aXRob3V0IGluZGVudGF0aW9uLCBvciBhdCBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcbiAgICBpZiBjdXJyZW50SW5kZW50YXRpb24gPCAxIHx8IGN1cnNvci5yb3cgPCAxXG4gICAgICBAZWRpdG9yLnNlbGVjdFRvQmVnaW5uaW5nT2ZMaW5lKClcbiAgICAgIEBlZGl0b3IuaW5zZXJ0VGV4dChuZXh0TGluZSlcbiAgICAgIHJldHVyblxuXG4gICAgZW1wdHlMaW5lU2tpcHBlZCA9IDBcbiAgICAjIGlmIHRoaXMgaXMgYW4gaW5kZW50ZWQgZW1wdHkgbGlzdCwgd2Ugd2lsbCBnbyB1cCBsaW5lcyBhbmQgdHJ5IHRvIGZpbmRcbiAgICAjIGl0cyBwYXJlbnQncyBsaXN0IHByZWZpeCBhbmQgdXNlIHRoYXQgaWYgcG9zc2libGVcbiAgICBmb3Igcm93IGluIFsoY3Vyc29yLnJvdyAtIDEpLi4wXVxuICAgICAgbGluZSA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93KVxuXG4gICAgICBpZiBsaW5lLnRyaW0oKSA9PSBcIlwiICMgc2tpcCBlbXB0eSBsaW5lcyBpbiBjYXNlIG9mIGxpc3QgcGFyYWdyYXBoc1xuICAgICAgICBicmVhayBpZiBlbXB0eUxpbmVTa2lwcGVkID4gTUFYX1NLSVBfRU1QVFlfTElORV9BTExPV0VEXG4gICAgICAgIGVtcHR5TGluZVNraXBwZWQgKz0gMVxuICAgICAgZWxzZSAjIGZpbmQgcGFyZW50IHdpdGggaW5kZW50YXRpb24gPSBjdXJyZW50IGluZGVudGF0aW9uIC0gMVxuICAgICAgICBpbmRlbnRhdGlvbiA9IEBlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3cocm93KVxuICAgICAgICBjb250aW51ZSBpZiBpbmRlbnRhdGlvbiA+PSBjdXJyZW50SW5kZW50YXRpb25cblxuICAgICAgICBpZiBpbmRlbnRhdGlvbiA9PSBjdXJyZW50SW5kZW50YXRpb24gLSAxICYmIExpbmVNZXRhLmlzTGlzdChsaW5lKVxuICAgICAgICAgIGxpbmVNZXRhID0gbmV3IExpbmVNZXRhKGxpbmUpXG4gICAgICAgICAgbmV4dExpbmUgPSBsaW5lTWV0YS5uZXh0TGluZSB1bmxlc3MgbGluZU1ldGEuaXNMaXN0KFwiYWxcIikgJiYgIWxpbmVNZXRhLmlzSW5kZW50ZWQoKVxuICAgICAgICBicmVha1xuXG4gICAgQGVkaXRvci5zZWxlY3RUb0JlZ2lubmluZ09mTGluZSgpXG4gICAgQGVkaXRvci5pbnNlcnRUZXh0KG5leHRMaW5lKVxuXG4gIF9pc1RhYmxlUm93OiAoY3Vyc29yLCBsaW5lKSAtPlxuICAgIHJldHVybiBmYWxzZSBpZiAhY29uZmlnLmdldChcInRhYmxlTmV3TGluZUNvbnRpbnVhdGlvblwiKVxuICAgICMgZmlyc3Qgcm93IG9yIG5vdCBhIHJvd1xuICAgIHJldHVybiBmYWxzZSBpZiBjdXJzb3Iucm93IDwgMSB8fCAhdXRpbHMuaXNUYWJsZVJvdyhsaW5lKVxuICAgICMgY2FzZSAwLCBhdCB0YWJsZSBzZXBhcmF0b3IsIGNvbnRpbnVlIHRhYmxlIHJvd1xuICAgIHJldHVybiB0cnVlIGlmIHV0aWxzLmlzVGFibGVTZXBhcmF0b3IobGluZSlcbiAgICAjIGNhc2UgMSwgYXQgdGFibGUgcm93LCBwcmV2aW91cyBsaW5lIGlzIGEgcm93LCBjb250aW51ZSByb3dcbiAgICByZXR1cm4gdHJ1ZSBpZiB1dGlscy5pc1RhYmxlUm93KEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coY3Vyc29yLnJvdy0xKSlcbiAgICAjIGVsc2UsIGF0IHRhYmxlIGhlYWQsIHByZXZpb3VzIGxpbmUgaXMgbm90IGEgcm93LCBkbyBub3QgY29udGludWUgcm93XG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgX2luc2VydE5ld2xpbmVXaXRob3V0VGFibGVDb2x1bW5zOiAtPlxuICAgIEBlZGl0b3Iuc2VsZWN0TGluZXNDb250YWluaW5nQ3Vyc29ycygpXG4gICAgQGVkaXRvci5pbnNlcnRUZXh0KFwiXFxuXCIpXG5cbiAgX2luc2VydE5ld2xpbmVXaXRoVGFibGVDb2x1bW5zOiAocm93KSAtPlxuICAgIG9wdGlvbnMgPVxuICAgICAgbnVtT2ZDb2x1bW5zOiBNYXRoLm1heCgxLCByb3cuY29sdW1ucy5sZW5ndGgpXG4gICAgICBleHRyYVBpcGVzOiByb3cuZXh0cmFQaXBlc1xuICAgICAgY29sdW1uV2lkdGg6IDFcbiAgICAgIGNvbHVtbldpZHRoczogW11cbiAgICAgIGFsaWdubWVudDogY29uZmlnLmdldChcInRhYmxlQWxpZ25tZW50XCIpXG4gICAgICBhbGlnbm1lbnRzOiBbXVxuXG4gICAgbmV3TGluZSA9IHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtdLCBvcHRpb25zKVxuICAgIEBlZGl0b3IubW92ZVRvRW5kT2ZMaW5lKClcbiAgICBAZWRpdG9yLmluc2VydFRleHQoXCJcXG4je25ld0xpbmV9XCIpXG4gICAgQGVkaXRvci5tb3ZlVG9CZWdpbm5pbmdPZkxpbmUoKVxuICAgIEBlZGl0b3IubW92ZVRvTmV4dFdvcmRCb3VuZGFyeSgpIGlmIG9wdGlvbnMuZXh0cmFQaXBlc1xuXG4gIGluZGVudExpc3RMaW5lOiAoZSwgc2VsZWN0aW9uKSAtPlxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmIEBfaXNSYW5nZVNlbGVjdGlvbihzZWxlY3Rpb24pXG5cbiAgICBjdXJzb3IgPSBzZWxlY3Rpb24uZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcbiAgICBsaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhjdXJzb3Iucm93KVxuXG4gICAgbGluZU1ldGEgPSBuZXcgTGluZU1ldGEobGluZSlcbiAgICAjIGRvbid0IGNhcmUgYWJvdXQgYWxwaGEgbGlzdFxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmIGxpbmVNZXRhLmlzTGlzdChcImFsXCIpXG5cbiAgICBpZiBsaW5lTWV0YS5pc0xpc3QoXCJvbFwiKVxuICAgICAgbmV3bGluZSA9IFwiI3tAZWRpdG9yLmdldFRhYlRleHQoKX0je2xpbmVNZXRhLmxpbmVIZWFkKGxpbmVNZXRhLmRlZmF1bHRIZWFkKX0je2xpbmVNZXRhLmJvZHl9XCJcbiAgICAgIG5ld2N1cnNvciA9IFtjdXJzb3Iucm93LCBjdXJzb3IuY29sdW1uICsgbmV3bGluZS5sZW5ndGggLSBsaW5lLmxlbmd0aF1cbiAgICAgIEBfcmVwbGFjZUxpbmUoc2VsZWN0aW9uLCBuZXdsaW5lLCBuZXdjdXJzb3IpXG5cbiAgICBlbHNlIGlmIGxpbmVNZXRhLmlzTGlzdChcInVsXCIpXG4gICAgICBidWxsZXQgPSBjb25maWcuZ2V0KFwidGVtcGxhdGVWYXJpYWJsZXMudWxCdWxsZXQje0BlZGl0b3IuaW5kZW50YXRpb25Gb3JCdWZmZXJSb3coY3Vyc29yLnJvdykrMX1cIilcbiAgICAgIGJ1bGxldCA9IGJ1bGxldCB8fCBjb25maWcuZ2V0KFwidGVtcGxhdGVWYXJpYWJsZXMudWxCdWxsZXRcIikgfHwgbGluZU1ldGEuZGVmYXVsdEhlYWRcblxuICAgICAgbmV3bGluZSA9IFwiI3tAZWRpdG9yLmdldFRhYlRleHQoKX0je2xpbmVNZXRhLmxpbmVIZWFkKGJ1bGxldCl9I3tsaW5lTWV0YS5ib2R5fVwiXG4gICAgICBuZXdjdXJzb3IgPSBbY3Vyc29yLnJvdywgY3Vyc29yLmNvbHVtbiArIG5ld2xpbmUubGVuZ3RoIC0gbGluZS5sZW5ndGhdXG4gICAgICBAX3JlcGxhY2VMaW5lKHNlbGVjdGlvbiwgbmV3bGluZSwgbmV3Y3Vyc29yKVxuXG4gICAgZWxzZVxuICAgICAgZS5hYm9ydEtleUJpbmRpbmcoKVxuXG4gIF9pc1JhbmdlU2VsZWN0aW9uOiAoc2VsZWN0aW9uKSAtPlxuICAgIGhlYWQgPSBzZWxlY3Rpb24uZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcbiAgICB0YWlsID0gc2VsZWN0aW9uLmdldFRhaWxCdWZmZXJQb3NpdGlvbigpXG5cbiAgICBoZWFkLnJvdyAhPSB0YWlsLnJvdyB8fCBoZWFkLmNvbHVtbiAhPSB0YWlsLmNvbHVtblxuXG4gIF9yZXBsYWNlTGluZTogKHNlbGVjdGlvbiwgbGluZSwgY3Vyc29yKSAtPlxuICAgIHJhbmdlID0gc2VsZWN0aW9uLmN1cnNvci5nZXRDdXJyZW50TGluZUJ1ZmZlclJhbmdlKClcbiAgICBzZWxlY3Rpb24uc2V0QnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgc2VsZWN0aW9uLmluc2VydFRleHQobGluZSlcbiAgICBzZWxlY3Rpb24uY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKGN1cnNvcilcblxuICBfaXNBdExpbmVCZWdpbm5pbmc6IChsaW5lLCBjb2wpIC0+XG4gICAgY29sID09IDAgfHwgbGluZS5zdWJzdHJpbmcoMCwgY29sKS50cmltKCkgPT0gXCJcIlxuXG4gIHVuZGVudExpc3RMaW5lOiAoZSwgc2VsZWN0aW9uKSAtPlxuICAgIHJldHVybiBlLmFib3J0S2V5QmluZGluZygpIGlmIEBfaXNSYW5nZVNlbGVjdGlvbihzZWxlY3Rpb24pXG5cbiAgICBjdXJzb3IgPSBzZWxlY3Rpb24uZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKClcbiAgICBjdXJyZW50SW5kZW50YXRpb24gPSBAZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KGN1cnNvci5yb3cpXG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKCkgaWYgY3VycmVudEluZGVudGF0aW9uIDwgMVxuXG4gICAgbGluZSA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coY3Vyc29yLnJvdylcbiAgICBsaW5lTWV0YSA9IG5ldyBMaW5lTWV0YShsaW5lKVxuICAgICMgZG9uJ3QgY2FyZSBhYm91dCBhbHBoYSBsaXN0XG4gICAgcmV0dXJuIGUuYWJvcnRLZXlCaW5kaW5nKCkgaWYgbGluZU1ldGEuaXNMaXN0KFwiYWxcIilcblxuICAgIGlmIGxpbmVNZXRhLmlzTGlzdChcIm9sXCIpXG4gICAgICBuZXdsaW5lID0gXCIje2xpbmVNZXRhLmxpbmVIZWFkKGxpbmVNZXRhLmRlZmF1bHRIZWFkKX0je2xpbmVNZXRhLmJvZHl9XCJcbiAgICAgIG5ld2xpbmUgPSBuZXdsaW5lLnN1YnN0cmluZyhAZWRpdG9yLmdldFRhYlRleHQoKS5sZW5ndGgpICMgcmVtb3ZlIG9uZSBpbmRlbnRcbiAgICAgIG5ld2N1cnNvciA9IFtjdXJzb3Iucm93LCBNYXRoLm1heChjdXJzb3IuY29sdW1uICsgbmV3bGluZS5sZW5ndGggLSBsaW5lLmxlbmd0aCwgMCldXG4gICAgICBAX3JlcGxhY2VMaW5lKHNlbGVjdGlvbiwgbmV3bGluZSwgbmV3Y3Vyc29yKVxuXG4gICAgZWxzZSBpZiBsaW5lTWV0YS5pc0xpc3QoXCJ1bFwiKVxuICAgICAgYnVsbGV0ID0gY29uZmlnLmdldChcInRlbXBsYXRlVmFyaWFibGVzLnVsQnVsbGV0I3tjdXJyZW50SW5kZW50YXRpb24tMX1cIilcbiAgICAgIGJ1bGxldCA9IGJ1bGxldCB8fCBjb25maWcuZ2V0KFwidGVtcGxhdGVWYXJpYWJsZXMudWxCdWxsZXRcIikgfHwgbGluZU1ldGEuZGVmYXVsdEhlYWRcblxuICAgICAgbmV3bGluZSA9IFwiI3tsaW5lTWV0YS5saW5lSGVhZChidWxsZXQpfSN7bGluZU1ldGEuYm9keX1cIlxuICAgICAgbmV3bGluZSA9IG5ld2xpbmUuc3Vic3RyaW5nKEBlZGl0b3IuZ2V0VGFiVGV4dCgpLmxlbmd0aCkgIyByZW1vdmUgb25lIGluZGVudFxuICAgICAgbmV3Y3Vyc29yID0gW2N1cnNvci5yb3csIE1hdGgubWF4KGN1cnNvci5jb2x1bW4gKyBuZXdsaW5lLmxlbmd0aCAtIGxpbmUubGVuZ3RoLCAwKV1cbiAgICAgIEBfcmVwbGFjZUxpbmUoc2VsZWN0aW9uLCBuZXdsaW5lLCBuZXdjdXJzb3IpXG5cbiAgICBlbHNlXG4gICAgICBlLmFib3J0S2V5QmluZGluZygpXG4iXX0=
