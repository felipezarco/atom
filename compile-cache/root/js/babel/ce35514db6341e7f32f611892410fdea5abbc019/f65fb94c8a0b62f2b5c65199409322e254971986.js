Object.defineProperty(exports, '__esModule', {
    value: true
});

var _atom = require('atom');

'use babel';

function highlightLine(editor, row) {
    var range = new _atom.Range([row, 0], [row + 1, 0]);
    var mark = editor.markScreenRange(range);
    editor.decorateMarker(mark, { type: 'highlight', 'class': 'highlight-line' });
}

function moveHighlight(editor, oldrow, row) {
    if (oldrow == row) {
        return;
    }

    for (var decoration of editor.getDecorations({ type: 'highlight', 'class': 'highlight-line' })) {
        var markerStart = decoration.getMarker().getScreenRange().start;
        var startRow = markerStart.row;
        if (oldrow == startRow || oldrow + 1 == startRow) {
            var hasCursor = false;
            for (var cursorPosition of editor.getCursorScreenPositions()) {
                var cursorRow = cursorPosition.row;
                if (cursorRow == oldrow) {
                    hasCursor = true;
                }
            }

            if (!hasCursor) {
                decoration.destroy();
            }
        }
    }

    highlightLine(editor, row);
}

function removeHighlight(editor) {
    for (var decoration of editor.getDecorations({ type: 'highlight', 'class': 'highlight-line' })) {
        decoration.destroy();
    }
}

var hl = {
    activate: function activate() {
        this.listeners = new _atom.CompositeDisposable();

        var activeEditor = atom.workspace.getActiveTextEditor();
        if (activeEditor) {
            for (var cursor of activeEditor.getCursors()) {
                var row = cursor.getScreenRow();
                highlightLine(activeEditor, row);
            }
        }

        this.listeners.add(atom.workspace.observeTextEditors(function (editor) {
            editor.onDidAddCursor(function (cursor) {
                var row = cursor.getScreenRow();
                highlightLine(editor, row);
            });

            editor.onDidRemoveCursor(function (cursor) {
                removeHighlight(editor);

                for (var _cursor of editor.getCursors()) {
                    var row = _cursor.getScreenRow();
                    highlightLine(editor, row);
                }
            });

            editor.onDidChangeCursorPosition(function (event) {
                var oldrow = event.oldScreenPosition.row;
                var row = event.newScreenPosition.row; //event.cursor.getScreenRow();
                moveHighlight(editor, oldrow, row);
            });
        }));
    },
    deactivate: function deactivate() {
        this.listeners.dispose();
    }
};

exports['default'] = hl;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtY3Vyc29yLWxpbmUvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRXlDLE1BQU07O0FBRi9DLFdBQVcsQ0FBQTs7QUFJWCxTQUFTLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ2hDLFFBQUksS0FBSyxHQUFHLGdCQUFVLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxHQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLFFBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekMsVUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQU8sZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO0NBQzdFOztBQUVELFNBQVMsYUFBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ3hDLFFBQUksTUFBTSxJQUFJLEdBQUcsRUFBRTtBQUNmLGVBQU87S0FDVjs7QUFFRCxTQUFLLElBQUksVUFBVSxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQU8sZ0JBQWdCLEVBQUMsQ0FBQyxFQUFFO0FBQ3hGLFlBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDaEUsWUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQztBQUMvQixZQUFJLE1BQU0sSUFBSSxRQUFRLElBQUksTUFBTSxHQUFDLENBQUMsSUFBSSxRQUFRLEVBQUU7QUFDNUMsZ0JBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN0QixpQkFBSyxJQUFJLGNBQWMsSUFBSSxNQUFNLENBQUMsd0JBQXdCLEVBQUUsRUFBRTtBQUMxRCxvQkFBSSxTQUFTLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQztBQUNuQyxvQkFBSSxTQUFTLElBQUksTUFBTSxFQUFFO0FBQ3JCLDZCQUFTLEdBQUcsSUFBSSxDQUFDO2lCQUNwQjthQUNKOztBQUVELGdCQUFJLENBQUMsU0FBUyxFQUFFO0FBQ1osMEJBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUN4QjtTQUNKO0tBQ0o7O0FBRUQsaUJBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7Q0FDOUI7O0FBRUQsU0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFO0FBQzdCLFNBQUssSUFBSSxVQUFVLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBTyxnQkFBZ0IsRUFBQyxDQUFDLEVBQUU7QUFDeEYsa0JBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN4QjtDQUNKOztBQUVELElBQU0sRUFBRSxHQUFHO0FBQ1AsWUFBUSxFQUFBLG9CQUFHO0FBQ1AsWUFBSSxDQUFDLFNBQVMsR0FBRywrQkFBeUIsQ0FBQzs7QUFFM0MsWUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQ3hELFlBQUksWUFBWSxFQUFFO0FBQ2QsaUJBQUssSUFBSSxNQUFNLElBQUksWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQzFDLG9CQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsNkJBQWEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDcEM7U0FDSjs7QUFFRCxZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzdELGtCQUFNLENBQUMsY0FBYyxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzlCLG9CQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsNkJBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDOUIsQ0FBQyxDQUFDOztBQUVILGtCQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDakMsK0JBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEIscUJBQUssSUFBSSxPQUFNLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3BDLHdCQUFJLEdBQUcsR0FBRyxPQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsaUNBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7aUJBQzlCO2FBQ0osQ0FBQyxDQUFDOztBQUVILGtCQUFNLENBQUMseUJBQXlCLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDeEMsb0JBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUE7QUFDeEMsb0JBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUE7QUFDckMsNkJBQWEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3RDLENBQUMsQ0FBQztTQUNOLENBQUMsQ0FBQyxDQUFDO0tBQ1A7QUFDRCxjQUFVLEVBQUEsc0JBQUc7QUFDVCxZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzVCO0NBQ0osQ0FBQTs7cUJBRWMsRUFBRSIsImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LWN1cnNvci1saW5lL2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXHJcblxyXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIFJhbmdlfSBmcm9tICdhdG9tJ1xyXG5cclxuZnVuY3Rpb24gaGlnaGxpZ2h0TGluZShlZGl0b3IsIHJvdykge1xyXG4gICAgbGV0IHJhbmdlID0gbmV3IFJhbmdlKFtyb3csMF0sW3JvdysxLDBdKTtcclxuICAgIGxldCBtYXJrID0gZWRpdG9yLm1hcmtTY3JlZW5SYW5nZShyYW5nZSk7XHJcbiAgICBlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFyaywge3R5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogJ2hpZ2hsaWdodC1saW5lJ30pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtb3ZlSGlnaGxpZ2h0KGVkaXRvciwgb2xkcm93LCByb3cpIHtcclxuICAgIGlmIChvbGRyb3cgPT0gcm93KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGRlY29yYXRpb24gb2YgZWRpdG9yLmdldERlY29yYXRpb25zKHt0eXBlOiAnaGlnaGxpZ2h0JywgY2xhc3M6ICdoaWdobGlnaHQtbGluZSd9KSkge1xyXG4gICAgICAgIGxldCBtYXJrZXJTdGFydCA9IGRlY29yYXRpb24uZ2V0TWFya2VyKCkuZ2V0U2NyZWVuUmFuZ2UoKS5zdGFydDtcclxuICAgICAgICBsZXQgc3RhcnRSb3cgPSBtYXJrZXJTdGFydC5yb3c7XHJcbiAgICAgICAgaWYgKG9sZHJvdyA9PSBzdGFydFJvdyB8fCBvbGRyb3crMSA9PSBzdGFydFJvdykge1xyXG4gICAgICAgICAgICBsZXQgaGFzQ3Vyc29yID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGN1cnNvclBvc2l0aW9uIG9mIGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbnMoKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnNvclJvdyA9IGN1cnNvclBvc2l0aW9uLnJvdztcclxuICAgICAgICAgICAgICAgIGlmIChjdXJzb3JSb3cgPT0gb2xkcm93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzQ3Vyc29yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFoYXNDdXJzb3IpIHtcclxuICAgICAgICAgICAgICAgIGRlY29yYXRpb24uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZ2hsaWdodExpbmUoZWRpdG9yLCByb3cpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVIaWdobGlnaHQoZWRpdG9yKSB7XHJcbiAgICBmb3IgKGxldCBkZWNvcmF0aW9uIG9mIGVkaXRvci5nZXREZWNvcmF0aW9ucyh7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiAnaGlnaGxpZ2h0LWxpbmUnfSkpIHtcclxuICAgICAgICBkZWNvcmF0aW9uLmRlc3Ryb3koKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgaGwgPSB7XHJcbiAgICBhY3RpdmF0ZSgpIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XHJcblxyXG4gICAgICAgIGxldCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XHJcbiAgICAgICAgaWYgKGFjdGl2ZUVkaXRvcikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjdXJzb3Igb2YgYWN0aXZlRWRpdG9yLmdldEN1cnNvcnMoKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IGN1cnNvci5nZXRTY3JlZW5Sb3coKTtcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodExpbmUoYWN0aXZlRWRpdG9yLCByb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxpc3RlbmVycy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgZWRpdG9yLm9uRGlkQWRkQ3Vyc29yKChjdXJzb3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCByb3cgPSBjdXJzb3IuZ2V0U2NyZWVuUm93KCk7XHJcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRMaW5lKGVkaXRvciwgcm93KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlZGl0b3Iub25EaWRSZW1vdmVDdXJzb3IoKGN1cnNvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVtb3ZlSGlnaGxpZ2h0KGVkaXRvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY3Vyc29yIG9mIGVkaXRvci5nZXRDdXJzb3JzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcm93ID0gY3Vyc29yLmdldFNjcmVlblJvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodExpbmUoZWRpdG9yLCByb3cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9sZHJvdyA9IGV2ZW50Lm9sZFNjcmVlblBvc2l0aW9uLnJvd1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvdyA9IGV2ZW50Lm5ld1NjcmVlblBvc2l0aW9uLnJvdyAvL2V2ZW50LmN1cnNvci5nZXRTY3JlZW5Sb3coKTtcclxuICAgICAgICAgICAgICAgIG1vdmVIaWdobGlnaHQoZWRpdG9yLCBvbGRyb3csIHJvdyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH0sXHJcbiAgICBkZWFjdGl2YXRlKCkge1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzLmRpc3Bvc2UoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaGw7XHJcbiJdfQ==