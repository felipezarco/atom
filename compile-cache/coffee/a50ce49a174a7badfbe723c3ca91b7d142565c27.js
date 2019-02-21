(function() {
  var CompositeDisposable, ERB_CLOSER_REGEX, ERB_OPENER_REGEX, ERB_REGEX, Range;

  Range = require('atom').Range;

  CompositeDisposable = require('atom').CompositeDisposable;

  ERB_REGEX = '<%(=?|-?|#?)\s{2}(-?)%>';

  ERB_OPENER_REGEX = '<%[\\=\\#\\-]?';

  ERB_CLOSER_REGEX = "-?%>";

  module.exports = {
    config: {
      erbBlocks: {
        type: 'array',
        "default": [['<%=', '%>'], ['<%', '%>'], ['<%#', '%>']],
        items: {
          type: 'array'
        }
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', 'rails-snippets:toggleErb', (function(_this) {
        return function() {
          return _this.toggleErb();
        };
      })(this)));
    },
    toggleErb: function() {
      var delegate, editor, hasTextSelected, j, len, ref, results, selectedText, selection;
      editor = atom.workspace.getActiveTextEditor();
      ref = editor.getSelections();
      results = [];
      for (j = 0, len = ref.length; j < len; j += 1) {
        selection = ref[j];
        hasTextSelected = !selection.isEmpty();
        selectedText = selection.getText();
        delegate = this;
        results.push(editor.transact(function() {
          var closer, currentCursor, opener, ref1, textToRestoreRange;
          selection.deleteSelectedText();
          currentCursor = selection.cursor;
          ref1 = delegate.findSorroundingBlocks(editor, currentCursor), opener = ref1[0], closer = ref1[1];
          if ((opener != null) && (closer != null)) {
            delegate.replaceErbBlock(editor, opener, closer, currentCursor);
          } else {
            delegate.insertErbBlock(editor, currentCursor);
          }
          if (hasTextSelected) {
            textToRestoreRange = editor.getBuffer().insert(currentCursor.getBufferPosition(), selectedText);
            return selection.setBufferRange(textToRestoreRange);
          }
        }));
      }
      return results;
    },
    findSorroundingBlocks: function(editor, currentCursor) {
      var closer, containingLine, foundClosers, foundOpeners, leftRange, opener, rightRange;
      opener = closer = null;
      containingLine = currentCursor.getCurrentLineBufferRange();
      leftRange = new Range(containingLine.start, currentCursor.getBufferPosition());
      rightRange = new Range(currentCursor.getBufferPosition(), containingLine.end);
      foundOpeners = [];
      editor.getBuffer().scanInRange(new RegExp(ERB_OPENER_REGEX, 'g'), leftRange, function(result) {
        return foundOpeners.push(result.range);
      });
      if (foundOpeners) {
        opener = foundOpeners[foundOpeners.length - 1];
      }
      foundClosers = [];
      editor.getBuffer().scanInRange(new RegExp(ERB_CLOSER_REGEX, 'g'), rightRange, function(result) {
        return foundClosers.push(result.range);
      });
      if (foundClosers) {
        closer = foundClosers[0];
      }
      return [opener, closer];
    },
    insertErbBlock: function(editor, currentCursor) {
      var closingBlock, defaultBlock, desiredPosition, openingTag;
      defaultBlock = atom.config.get('rails-snippets.erbBlocks')[0];
      desiredPosition = null;
      openingTag = editor.getBuffer().insert(currentCursor.getBufferPosition(), defaultBlock[0] + ' ');
      desiredPosition = currentCursor.getBufferPosition();
      closingBlock = editor.getBuffer().insert(currentCursor.getBufferPosition(), ' ' + defaultBlock[1]);
      return currentCursor.setBufferPosition(desiredPosition);
    },
    replaceErbBlock: function(editor, opener, closer, currentCursor) {
      var closingBracket, nextBlock, openingBracket;
      openingBracket = editor.getBuffer().getTextInRange(opener);
      closingBracket = editor.getBuffer().getTextInRange(closer);
      nextBlock = this.getNextErbBlock(editor, openingBracket, closingBracket);
      editor.getBuffer().setTextInRange(closer, nextBlock[1]);
      return editor.getBuffer().setTextInRange(opener, nextBlock[0]);
    },
    getNextErbBlock: function(editor, openingBracket, closingBracket) {
      var block, i, j, len, ref;
      ref = atom.config.get('rails-snippets.erbBlocks');
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        block = ref[i];
        if (JSON.stringify([openingBracket, closingBracket]) === JSON.stringify(block)) {
          if ((i + 1) >= atom.config.get('rails-snippets.erbBlocks').length) {
            return atom.config.get('rails-snippets.erbBlocks')[0];
          } else {
            return atom.config.get('rails-snippets.erbBlocks')[i + 1];
          }
        }
      }
      return atom.config.get('rails-snippets.erbBlocks')[0];
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3JhaWxzLXNuaXBwZXRzL2xpYi9yYWlscy1zbmlwcGV0cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBQ1Qsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixTQUFBLEdBQVk7O0VBRVosZ0JBQUEsR0FBbUI7O0VBRW5CLGdCQUFBLEdBQW1COztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsU0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsQ0FBQyxLQUFELEVBQVEsSUFBUixDQUFELEVBQWdCLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FBaEIsRUFBOEIsQ0FBQyxLQUFELEVBQVEsSUFBUixDQUE5QixDQURUO1FBRUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLE9BQU47U0FIRjtPQURGO0tBREY7SUFPQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsMEJBQXBDLEVBQWdFLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsU0FBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhFLENBQW5CO0lBRlEsQ0FQVjtJQVdBLFNBQUEsRUFBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7QUFDVDtBQUFBO1dBQUEsd0NBQUE7O1FBQ0UsZUFBQSxHQUFrQixDQUFDLFNBQVMsQ0FBQyxPQUFW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LENBQUEsR0FBSSxDQUFKLEVBSHJEO1dBRkY7O0FBREY7QUFTQSxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBNEMsQ0FBQSxDQUFBO0lBVnBDLENBaEZqQjs7QUFWRiIsInNvdXJjZXNDb250ZW50IjpbIiMgbXVjaCBsb3ZlIHRvIEBlZGRvcnJlIDwzIDwzXG57UmFuZ2V9ID0gcmVxdWlyZSAnYXRvbSdcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbkVSQl9SRUdFWCA9ICc8JSg9P3wtP3wjPylcXHN7Mn0oLT8pJT4nXG4jIG1hdGNoZXMgdGhlIG9wZW5pbmcgYnJhY2tldFxuRVJCX09QRU5FUl9SRUdFWCA9ICc8JVtcXFxcPVxcXFwjXFxcXC1dPydcbiMgbWF0Y2hlcyB0aGUgY2xvc2luZyBicmFja2V0LlxuRVJCX0NMT1NFUl9SRUdFWCA9IFwiLT8lPlwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGVyYkJsb2NrczpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtbJzwlPScsICclPiddLCBbJzwlJywgJyU+J10sIFsnPCUjJywgJyU+J11dXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ2FycmF5J1xuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3JhaWxzLXNuaXBwZXRzOnRvZ2dsZUVyYicsID0+IEB0b2dnbGVFcmIoKVxuXG4gIHRvZ2dsZUVyYjogLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBmb3Igc2VsZWN0aW9uIGluIGVkaXRvci5nZXRTZWxlY3Rpb25zKCkgYnkgMVxuICAgICAgaGFzVGV4dFNlbGVjdGVkID0gIXNlbGVjdGlvbi5pc0VtcHR5KClcbiAgICAgIHNlbGVjdGVkVGV4dCA9IHNlbGVjdGlvbi5nZXRUZXh0KClcbiAgICAgIGRlbGVnYXRlID0gQFxuXG4gICAgICBlZGl0b3IudHJhbnNhY3QgLT5cbiAgICAgICAgc2VsZWN0aW9uLmRlbGV0ZVNlbGVjdGVkVGV4dCgpXG4gICAgICAgIGN1cnJlbnRDdXJzb3IgPSBzZWxlY3Rpb24uY3Vyc29yXG4gICAgICAgICMgc2VhcmNoaW5nIGZvciBvcGVuaW5nIGFuZCBjbG9zaW5nIGJyYWNrZXRzXG4gICAgICAgIFtvcGVuZXIsIGNsb3Nlcl0gPSBkZWxlZ2F0ZS5maW5kU29ycm91bmRpbmdCbG9ja3MgZWRpdG9yLCBjdXJyZW50Q3Vyc29yXG4gICAgICAgIGlmIG9wZW5lcj8gYW5kIGNsb3Nlcj9cbiAgICAgICAgICAjIGlmIGJvdGggYnJhY2tldHMgZm91bmQgLSByZXBsYWNpbmcgdGhlbSB3aXRoIHRoZSBuZXh0IG9uZXMuXG4gICAgICAgICAgZGVsZWdhdGUucmVwbGFjZUVyYkJsb2NrIGVkaXRvciwgb3BlbmVyLCBjbG9zZXIsIGN1cnJlbnRDdXJzb3JcbiAgICAgICAgZWxzZVxuICAgICAgICAgICMgaWYgYW55IG9mIHRoZSBicmFja2V0cyB3ZXJlJ3QgZm91bmQgLSBpbnNlcnRpbmcgbmV3IG9uZXMuXG4gICAgICAgICAgZGVsZWdhdGUuaW5zZXJ0RXJiQmxvY2sgZWRpdG9yLCBjdXJyZW50Q3Vyc29yXG5cbiAgICAgICAgaWYgaGFzVGV4dFNlbGVjdGVkXG4gICAgICAgICAgdGV4dFRvUmVzdG9yZVJhbmdlID0gZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydCBjdXJyZW50Q3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCksIHNlbGVjdGVkVGV4dFxuICAgICAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZSB0ZXh0VG9SZXN0b3JlUmFuZ2VcblxuXG4gIGZpbmRTb3Jyb3VuZGluZ0Jsb2NrczogKGVkaXRvciwgY3VycmVudEN1cnNvcikgLT5cbiAgICBvcGVuZXIgPSBjbG9zZXIgPSBudWxsXG4gICAgIyBncmFiYmluZyB0aGUgd2hvbGUgbGluZVxuICAgIGNvbnRhaW5pbmdMaW5lID0gY3VycmVudEN1cnNvci5nZXRDdXJyZW50TGluZUJ1ZmZlclJhbmdlKClcblxuICAgICMgb25lIHJlZ2lvbiB0byB0aGUgbGVmdCBvZiB0aGUgY3Vyc29yIGFuZCBvbmUgdG8gdGhlIHJpZ2h0XG4gICAgbGVmdFJhbmdlICA9IG5ldyBSYW5nZSBjb250YWluaW5nTGluZS5zdGFydCwgY3VycmVudEN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgcmlnaHRSYW5nZSA9IG5ldyBSYW5nZSBjdXJyZW50Q3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCksIGNvbnRhaW5pbmdMaW5lLmVuZFxuXG4gICAgIyBzZWFyY2hpbmcgaW4gdGhlIGxlZnQgcmFuZ2UgZm9yIGFuIG9wZW5pbmcgYnJhY2tldFxuICAgIGZvdW5kT3BlbmVycyA9IFtdXG4gICAgZWRpdG9yLmdldEJ1ZmZlcigpLnNjYW5JblJhbmdlIG5ldyBSZWdFeHAoRVJCX09QRU5FUl9SRUdFWCwgJ2cnKSwgbGVmdFJhbmdlLCAocmVzdWx0KSAtPlxuICAgICAgZm91bmRPcGVuZXJzLnB1c2ggcmVzdWx0LnJhbmdlXG4gICAgIyBpZiBmb3VuZCwgc2V0dGluZyBhIHJhbmdlIGZvciBpdCwgdXNpbmcgdGhlIGxhc3QgbWF0Y2ggLSB0aGUgcmlnaHRtb3N0IGJyYWNrZXQgZm91bmRcbiAgICBvcGVuZXIgPSBmb3VuZE9wZW5lcnNbZm91bmRPcGVuZXJzLmxlbmd0aCAtIDFdIGlmIGZvdW5kT3BlbmVyc1xuXG4gICAgIyBzZWFyY2hpbmcgaW4gdGhlIHJpZ2h0IHJhbmdlIGZvciBhbiBvcGVuaW5nIGJyYWNrZXRcbiAgICBmb3VuZENsb3NlcnMgPSBbXVxuICAgIGVkaXRvci5nZXRCdWZmZXIoKS5zY2FuSW5SYW5nZSBuZXcgUmVnRXhwKEVSQl9DTE9TRVJfUkVHRVgsICdnJyksIHJpZ2h0UmFuZ2UsIChyZXN1bHQpIC0+XG4gICAgICBmb3VuZENsb3NlcnMucHVzaCByZXN1bHQucmFuZ2VcbiAgICAjIGlmIGZvdW5kLCBzZXR0aW5nIGEgbmV3IHJhbmdlLCB1c2luZyB0aGUgZmlyc3QgbWF0Y2ggLSB0aGUgbGVmdG1vc3QgYnJhY2tldCBmb3VuZFxuICAgIGNsb3NlciA9IGZvdW5kQ2xvc2Vyc1swXSBpZiBmb3VuZENsb3NlcnNcbiAgICByZXR1cm4gW29wZW5lciwgY2xvc2VyXVxuXG4gIGluc2VydEVyYkJsb2NrOiAoZWRpdG9yLCBjdXJyZW50Q3Vyc29yKSAtPlxuICAgICMgaW5zZXJ0aW5nIHRoZSBmaXJzdCBibG9jayBpbiB0aGUgbGlzdFxuICAgIGRlZmF1bHRCbG9jayA9IGF0b20uY29uZmlnLmdldCgncmFpbHMtc25pcHBldHMuZXJiQmxvY2tzJylbMF1cbiAgICBkZXNpcmVkUG9zaXRpb24gPSBudWxsXG4gICAgIyBpbnNlcnRpbmcgb3BlbmluZyBicmFja2V0XG4gICAgb3BlbmluZ1RhZyA9IGVkaXRvci5nZXRCdWZmZXIoKS5pbnNlcnQgY3VycmVudEN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLCBkZWZhdWx0QmxvY2tbMF0gKyAnICdcbiAgICAjIHN0b3JpbmcgcG9zaXRpb24gYmV0d2VlbiBicmFja2V0c1xuICAgIGRlc2lyZWRQb3NpdGlvbiA9IGN1cnJlbnRDdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICMgaW5zZXJ0aW5nIGNsb3NpbmcgYnJhY2tldFxuICAgIGNsb3NpbmdCbG9jayA9IGVkaXRvci5nZXRCdWZmZXIoKS5pbnNlcnQgY3VycmVudEN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLCAnICcgKyBkZWZhdWx0QmxvY2tbMV1cbiAgICBjdXJyZW50Q3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKCBkZXNpcmVkUG9zaXRpb24gKVxuXG4gIHJlcGxhY2VFcmJCbG9jazogKGVkaXRvciwgb3BlbmVyLCBjbG9zZXIsIGN1cnJlbnRDdXJzb3IpIC0+XG4gICAgIyBnZXR0aW5nIHRoZSBuZXh0IGJsb2NrIGluIHRoZSBsaXN0XG4gICAgb3BlbmluZ0JyYWNrZXQgPSBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0VGV4dEluUmFuZ2Ugb3BlbmVyXG4gICAgY2xvc2luZ0JyYWNrZXQgPSBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0VGV4dEluUmFuZ2UgY2xvc2VyXG4gICAgbmV4dEJsb2NrID0gQGdldE5leHRFcmJCbG9jayBlZGl0b3IsIG9wZW5pbmdCcmFja2V0LCBjbG9zaW5nQnJhY2tldFxuICAgICMgcmVwbGFjaW5nIGluIHJldmVyc2Ugb3JkZXIgYmVjYXVzZSBsaW5lIGxlbmd0aCBtaWdodCBjaGFuZ2VcbiAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuc2V0VGV4dEluUmFuZ2UgY2xvc2VyLCBuZXh0QmxvY2tbMV1cbiAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuc2V0VGV4dEluUmFuZ2Ugb3BlbmVyLCBuZXh0QmxvY2tbMF1cblxuICBnZXROZXh0RXJiQmxvY2s6IChlZGl0b3IsIG9wZW5pbmdCcmFja2V0LCBjbG9zaW5nQnJhY2tldCkgLT5cbiAgICBmb3IgYmxvY2ssIGkgaW4gYXRvbS5jb25maWcuZ2V0KCdyYWlscy1zbmlwcGV0cy5lcmJCbG9ja3MnKVxuICAgICAgaWYgSlNPTi5zdHJpbmdpZnkoW29wZW5pbmdCcmFja2V0LCBjbG9zaW5nQnJhY2tldF0pID09IEpTT04uc3RyaW5naWZ5KGJsb2NrKVxuICAgICAgICAjIGlmIG91dHNpZGUgb2Ygc2NvcGUgLSByZXR1cm5pbmcgdGhlIGZpcnN0IGJsb2NrXG4gICAgICAgIGlmIChpICsgMSkgPj0gYXRvbS5jb25maWcuZ2V0KCdyYWlscy1zbmlwcGV0cy5lcmJCbG9ja3MnKS5sZW5ndGhcbiAgICAgICAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdyYWlscy1zbmlwcGV0cy5lcmJCbG9ja3MnKVswXVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncmFpbHMtc25pcHBldHMuZXJiQmxvY2tzJylbaSArIDFdXG5cbiAgICAjIGluIGNhc2Ugd2UgaGF2ZW4ndCBmb3VuZCB0aGUgYmxvY2sgaW4gdGhlIGxpc3QsIHJldHVybmluZyB0aGUgZmlyc3Qgb25lXG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgncmFpbHMtc25pcHBldHMuZXJiQmxvY2tzJylbMF1cbiJdfQ==
