(function() {
  var CompositeDisposable, EarlyTerminationSignal, Emitter, HighlightedAreaView, MarkerLayer, Range, StatusBarView, escapeRegExp, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), Range = ref.Range, CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter, MarkerLayer = ref.MarkerLayer;

  StatusBarView = require('./status-bar-view');

  escapeRegExp = require('./escape-reg-exp');

  module.exports = HighlightedAreaView = (function() {
    function HighlightedAreaView() {
      this.destroyScrollMarkers = bind(this.destroyScrollMarkers, this);
      this.setScrollMarkerView = bind(this.setScrollMarkerView, this);
      this.setupMarkerLayers = bind(this.setupMarkerLayers, this);
      this.setScrollMarker = bind(this.setScrollMarker, this);
      this.selectAll = bind(this.selectAll, this);
      this.listenForStatusBarChange = bind(this.listenForStatusBarChange, this);
      this.removeStatusBar = bind(this.removeStatusBar, this);
      this.setupStatusBar = bind(this.setupStatusBar, this);
      this.removeMarkers = bind(this.removeMarkers, this);
      this.removeAllMarkers = bind(this.removeAllMarkers, this);
      this.handleSelection = bind(this.handleSelection, this);
      this.debouncedHandleSelection = bind(this.debouncedHandleSelection, this);
      this.setStatusBar = bind(this.setStatusBar, this);
      this.enable = bind(this.enable, this);
      this.disable = bind(this.disable, this);
      this.onDidRemoveAllMarkers = bind(this.onDidRemoveAllMarkers, this);
      this.onDidAddSelectedMarkerForEditor = bind(this.onDidAddSelectedMarkerForEditor, this);
      this.onDidAddMarkerForEditor = bind(this.onDidAddMarkerForEditor, this);
      this.onDidAddSelectedMarker = bind(this.onDidAddSelectedMarker, this);
      this.onDidAddMarker = bind(this.onDidAddMarker, this);
      this.destroy = bind(this.destroy, this);
      this.emitter = new Emitter;
      this.editorToMarkerLayerMap = {};
      this.markerLayers = [];
      this.resultCount = 0;
      this.editorSubscriptions = new CompositeDisposable();
      this.editorSubscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this.setupMarkerLayers(editor);
          return _this.setScrollMarkerView(editor);
        };
      })(this)));
      this.editorSubscriptions.add(atom.workspace.onWillDestroyPaneItem((function(_this) {
        return function(item) {
          var editor;
          if (item.item.constructor.name !== 'TextEditor') {
            return;
          }
          editor = item.item;
          _this.removeMarkers(editor.id);
          delete _this.editorToMarkerLayerMap[editor.id];
          return _this.destroyScrollMarkers(editor);
        };
      })(this)));
      this.enable();
      this.listenForTimeoutChange();
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.debouncedHandleSelection();
          return _this.subscribeToActiveTextEditor();
        };
      })(this));
      this.subscribeToActiveTextEditor();
      this.listenForStatusBarChange();
      this.enableScrollViewObserveSubscription = atom.config.observe('highlight-selected.showResultsOnScrollBar', (function(_this) {
        return function(enabled) {
          if (enabled) {
            _this.ensureScrollViewInstalled();
            return atom.workspace.getTextEditors().forEach(_this.setScrollMarkerView);
          } else {
            return atom.workspace.getTextEditors().forEach(_this.destroyScrollMarkers);
          }
        };
      })(this));
    }

    HighlightedAreaView.prototype.destroy = function() {
      var ref1, ref2, ref3, ref4, ref5;
      clearTimeout(this.handleSelectionTimeout);
      this.activeItemSubscription.dispose();
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.enableScrollViewObserveSubscription) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.editorSubscriptions) != null) {
        ref3.dispose();
      }
      if ((ref4 = this.statusBarView) != null) {
        ref4.removeElement();
      }
      if ((ref5 = this.statusBarTile) != null) {
        ref5.destroy();
      }
      return this.statusBarTile = null;
    };

    HighlightedAreaView.prototype.onDidAddMarker = function(callback) {
      var Grim;
      Grim = require('grim');
      Grim.deprecate("Please do not use. This method will be removed.");
      return this.emitter.on('did-add-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarker = function(callback) {
      var Grim;
      Grim = require('grim');
      Grim.deprecate("Please do not use. This method will be removed.");
      return this.emitter.on('did-add-selected-marker', callback);
    };

    HighlightedAreaView.prototype.onDidAddMarkerForEditor = function(callback) {
      return this.emitter.on('did-add-marker-for-editor', callback);
    };

    HighlightedAreaView.prototype.onDidAddSelectedMarkerForEditor = function(callback) {
      return this.emitter.on('did-add-selected-marker-for-editor', callback);
    };

    HighlightedAreaView.prototype.onDidRemoveAllMarkers = function(callback) {
      return this.emitter.on('did-remove-marker-layer', callback);
    };

    HighlightedAreaView.prototype.disable = function() {
      this.disabled = true;
      return this.removeAllMarkers();
    };

    HighlightedAreaView.prototype.enable = function() {
      this.disabled = false;
      return this.debouncedHandleSelection();
    };

    HighlightedAreaView.prototype.setStatusBar = function(statusBar) {
      this.statusBar = statusBar;
      return this.setupStatusBar();
    };

    HighlightedAreaView.prototype.debouncedHandleSelection = function() {
      clearTimeout(this.handleSelectionTimeout);
      return this.handleSelectionTimeout = setTimeout((function(_this) {
        return function() {
          return _this.handleSelection();
        };
      })(this), atom.config.get('highlight-selected.timeout'));
    };

    HighlightedAreaView.prototype.listenForTimeoutChange = function() {
      return atom.config.onDidChange('highlight-selected.timeout', (function(_this) {
        return function() {
          return _this.debouncedHandleSelection();
        };
      })(this));
    };

    HighlightedAreaView.prototype.subscribeToActiveTextEditor = function() {
      var editor, ref1;
      if ((ref1 = this.selectionSubscription) != null) {
        ref1.dispose();
      }
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.selectionSubscription = new CompositeDisposable;
      this.selectionSubscription.add(editor.onDidAddSelection(this.debouncedHandleSelection));
      this.selectionSubscription.add(editor.onDidChangeSelectionRange(this.debouncedHandleSelection));
      return this.handleSelection();
    };

    HighlightedAreaView.prototype.getActiveEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightedAreaView.prototype.getActiveEditors = function() {
      return atom.workspace.getPanes().map(function(pane) {
        var activeItem;
        activeItem = pane.activeItem;
        if (activeItem && activeItem.constructor.name === 'TextEditor') {
          return activeItem;
        }
      });
    };

    HighlightedAreaView.prototype.handleSelection = function() {
      var allowedCharactersToSelect, editor, lastSelection, nonWordCharacters, nonWordCharactersToStrip, originalEditor, ref1, regex, regexFlags, regexForWholeWord, regexSearch, selectionStart, text;
      editor = this.getActiveEditor();
      if (!editor) {
        return;
      }
      this.removeAllMarkers();
      if (this.disabled) {
        return;
      }
      if (editor.getLastSelection().isEmpty()) {
        return;
      }
      this.selections = editor.getSelections();
      lastSelection = editor.getLastSelection();
      text = lastSelection.getText();
      if (text.length < atom.config.get('highlight-selected.minimumLength')) {
        return;
      }
      if (text.includes('\n')) {
        return;
      }
      regex = new RegExp("^\\s+$");
      if (regex.test(text)) {
        return;
      }
      regexFlags = 'g';
      if (atom.config.get('highlight-selected.ignoreCase')) {
        regexFlags = 'gi';
      }
      regexSearch = escapeRegExp(text);
      if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
        if (!this.isWordSelected(lastSelection)) {
          return;
        }
        selectionStart = lastSelection.getBufferRange().start;
        nonWordCharacters = this.getNonWordCharacters(editor, selectionStart);
        allowedCharactersToSelect = atom.config.get('highlight-selected.allowedCharactersToSelect');
        nonWordCharactersToStrip = nonWordCharacters.replace(new RegExp("[" + allowedCharactersToSelect + "]", 'g'), '');
        regexForWholeWord = new RegExp("[ \\t" + (escapeRegExp(nonWordCharactersToStrip)) + "]", regexFlags);
        if (regexForWholeWord.test(text)) {
          return;
        }
        regexSearch = ("(?:[ \\t" + (escapeRegExp(nonWordCharacters)) + "]|^)(") + regexSearch + (")(?:[ \\t" + (escapeRegExp(nonWordCharacters)) + "]|$)");
      }
      this.resultCount = 0;
      if (atom.config.get('highlight-selected.highlightInPanes')) {
        originalEditor = editor;
        this.getActiveEditors().forEach((function(_this) {
          return function(editor) {
            return _this.highlightSelectionInEditor(editor, regexSearch, regexFlags, originalEditor);
          };
        })(this));
      } else {
        this.highlightSelectionInEditor(editor, regexSearch, regexFlags);
      }
      return (ref1 = this.statusBarElement) != null ? ref1.updateCount(this.resultCount) : void 0;
    };

    HighlightedAreaView.prototype.highlightSelectionInEditor = function(editor, regexSearch, regexFlags, originalEditor) {
      var error, markerLayer, markerLayerForHiddenMarkers, markerLayers, maximumHighlights;
      if (editor == null) {
        return;
      }
      maximumHighlights = atom.config.get('highlight-selected.maximumHighlights');
      if (!(this.resultCount < maximumHighlights)) {
        return;
      }
      markerLayers = this.editorToMarkerLayerMap[editor.id];
      if (markerLayers == null) {
        return;
      }
      markerLayer = markerLayers['visibleMarkerLayer'];
      markerLayerForHiddenMarkers = markerLayers['selectedMarkerLayer'];
      try {
        editor.scan(new RegExp(regexSearch, regexFlags), (function(_this) {
          return function(result) {
            var marker, newResult;
            if (_this.resultCount >= maximumHighlights) {
              throw new EarlyTerminationSignal;
            }
            newResult = result;
            if (atom.config.get('highlight-selected.onlyHighlightWholeWords')) {
              editor.scanInBufferRange(new RegExp(escapeRegExp(result.match[1])), result.range, function(e) {
                return newResult = e;
              });
            }
            if (newResult == null) {
              return;
            }
            _this.resultCount += 1;
            if (_this.showHighlightOnSelectedWord(newResult.range, _this.selections) && (originalEditor != null ? originalEditor.id : void 0) === editor.id) {
              marker = markerLayerForHiddenMarkers.markBufferRange(newResult.range);
              _this.emitter.emit('did-add-selected-marker', marker);
              return _this.emitter.emit('did-add-selected-marker-for-editor', {
                marker: marker,
                editor: editor
              });
            } else {
              marker = markerLayer.markBufferRange(newResult.range);
              _this.emitter.emit('did-add-marker', marker);
              return _this.emitter.emit('did-add-marker-for-editor', {
                marker: marker,
                editor: editor
              });
            }
          };
        })(this));
      } catch (error1) {
        error = error1;
        if (!(error instanceof EarlyTerminationSignal)) {
          throw error;
        }
      }
      return editor.decorateMarkerLayer(markerLayer, {
        type: 'highlight',
        "class": this.makeClasses()
      });
    };

    HighlightedAreaView.prototype.makeClasses = function() {
      var className;
      className = 'highlight-selected';
      if (atom.config.get('highlight-selected.lightTheme')) {
        className += ' light-theme';
      }
      if (atom.config.get('highlight-selected.highlightBackground')) {
        className += ' background';
      }
      return className;
    };

    HighlightedAreaView.prototype.showHighlightOnSelectedWord = function(range, selections) {
      var i, len, outcome, selection, selectionRange;
      if (!atom.config.get('highlight-selected.hideHighlightOnSelectedWord')) {
        return false;
      }
      outcome = false;
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        selectionRange = selection.getBufferRange();
        outcome = (range.start.column === selectionRange.start.column) && (range.start.row === selectionRange.start.row) && (range.end.column === selectionRange.end.column) && (range.end.row === selectionRange.end.row);
        if (outcome) {
          break;
        }
      }
      return outcome;
    };

    HighlightedAreaView.prototype.removeAllMarkers = function() {
      return Object.keys(this.editorToMarkerLayerMap).forEach(this.removeMarkers);
    };

    HighlightedAreaView.prototype.removeMarkers = function(editorId) {
      var markerLayer, ref1, selectedMarkerLayer;
      if (this.editorToMarkerLayerMap[editorId] == null) {
        return;
      }
      markerLayer = this.editorToMarkerLayerMap[editorId]['visibleMarkerLayer'];
      selectedMarkerLayer = this.editorToMarkerLayerMap[editorId]['selectedMarkerLayer'];
      markerLayer.clear();
      selectedMarkerLayer.clear();
      if ((ref1 = this.statusBarElement) != null) {
        ref1.updateCount(0);
      }
      return this.emitter.emit('did-remove-marker-layer');
    };

    HighlightedAreaView.prototype.isWordSelected = function(selection) {
      var lineRange, nonWordCharacterToTheLeft, nonWordCharacterToTheRight, selectionRange;
      if (selection.getBufferRange().isSingleLine()) {
        selectionRange = selection.getBufferRange();
        lineRange = this.getActiveEditor().bufferRangeForBufferRow(selectionRange.start.row);
        nonWordCharacterToTheLeft = selectionRange.start.isEqual(lineRange.start) || this.isNonWordCharacterToTheLeft(selection);
        nonWordCharacterToTheRight = selectionRange.end.isEqual(lineRange.end) || this.isNonWordCharacterToTheRight(selection);
        return nonWordCharacterToTheLeft && nonWordCharacterToTheRight;
      } else {
        return false;
      }
    };

    HighlightedAreaView.prototype.getNonWordCharacters = function(editor, point) {
      var nonWordCharacters, scopeDescriptor;
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(point);
      return nonWordCharacters = atom.config.get('editor.nonWordCharacters', {
        scope: scopeDescriptor
      });
    };

    HighlightedAreaView.prototype.isNonWord = function(editor, range) {
      var nonWordCharacters, text;
      nonWordCharacters = this.getNonWordCharacters(editor, range.start);
      text = editor.getTextInBufferRange(range);
      return new RegExp("[ \t" + (escapeRegExp(nonWordCharacters)) + "]").test(text);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheLeft = function(selection) {
      var range, selectionStart;
      selectionStart = selection.getBufferRange().start;
      range = Range.fromPointWithDelta(selectionStart, 0, -1);
      return this.isNonWord(this.getActiveEditor(), range);
    };

    HighlightedAreaView.prototype.isNonWordCharacterToTheRight = function(selection) {
      var range, selectionEnd;
      selectionEnd = selection.getBufferRange().end;
      range = Range.fromPointWithDelta(selectionEnd, 0, 1);
      return this.isNonWord(this.getActiveEditor(), range);
    };

    HighlightedAreaView.prototype.setupStatusBar = function() {
      if (this.statusBarElement != null) {
        return;
      }
      if (!atom.config.get('highlight-selected.showInStatusBar')) {
        return;
      }
      this.statusBarElement = new StatusBarView();
      return this.statusBarTile = this.statusBar.addLeftTile({
        item: this.statusBarElement.getElement(),
        priority: 100
      });
    };

    HighlightedAreaView.prototype.removeStatusBar = function() {
      var ref1;
      if (this.statusBarElement == null) {
        return;
      }
      if ((ref1 = this.statusBarTile) != null) {
        ref1.destroy();
      }
      this.statusBarTile = null;
      return this.statusBarElement = null;
    };

    HighlightedAreaView.prototype.listenForStatusBarChange = function() {
      return atom.config.onDidChange('highlight-selected.showInStatusBar', (function(_this) {
        return function(changed) {
          if (changed.newValue) {
            return _this.setupStatusBar();
          } else {
            return _this.removeStatusBar();
          }
        };
      })(this));
    };

    HighlightedAreaView.prototype.selectAll = function() {
      var editor, i, j, len, len1, marker, markerLayer, markerLayers, ranges, ref1, ref2;
      editor = this.getActiveEditor();
      markerLayers = this.editorToMarkerLayerMap[editor.id];
      if (markerLayers == null) {
        return;
      }
      ranges = [];
      ref1 = [markerLayers['visibleMarkerLayer'], markerLayers['selectedMarkerLayer']];
      for (i = 0, len = ref1.length; i < len; i++) {
        markerLayer = ref1[i];
        ref2 = markerLayer.getMarkers();
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          marker = ref2[j];
          ranges.push(marker.getBufferRange());
        }
      }
      if (ranges.length > 0) {
        return editor.setSelectedBufferRanges(ranges, {
          flash: true
        });
      }
    };

    HighlightedAreaView.prototype.setScrollMarker = function(scrollMarkerAPI) {
      this.scrollMarker = scrollMarkerAPI;
      if (atom.config.get('highlight-selected.showResultsOnScrollBar')) {
        this.ensureScrollViewInstalled();
        return atom.workspace.getTextEditors().forEach(this.setScrollMarkerView);
      }
    };

    HighlightedAreaView.prototype.ensureScrollViewInstalled = function() {
      if (!atom.inSpecMode()) {
        return require('atom-package-deps').install('highlight-selected', true);
      }
    };

    HighlightedAreaView.prototype.setupMarkerLayers = function(editor) {
      var markerLayer, markerLayerForHiddenMarkers;
      if (this.editorToMarkerLayerMap[editor.id] != null) {
        markerLayer = this.editorToMarkerLayerMap[editor.id]['visibleMarkerLayer'];
        return markerLayerForHiddenMarkers = this.editorToMarkerLayerMap[editor.id]['selectedMarkerLayer'];
      } else {
        markerLayer = editor.addMarkerLayer();
        markerLayerForHiddenMarkers = editor.addMarkerLayer();
        return this.editorToMarkerLayerMap[editor.id] = {
          visibleMarkerLayer: markerLayer,
          selectedMarkerLayer: markerLayerForHiddenMarkers
        };
      }
    };

    HighlightedAreaView.prototype.setScrollMarkerView = function(editor) {
      var markerLayer, scrollMarkerView, selectedMarkerLayer;
      if (!atom.config.get('highlight-selected.showResultsOnScrollBar')) {
        return;
      }
      if (this.scrollMarker == null) {
        return;
      }
      scrollMarkerView = this.scrollMarker.scrollMarkerViewForEditor(editor);
      markerLayer = this.editorToMarkerLayerMap[editor.id]['visibleMarkerLayer'];
      selectedMarkerLayer = this.editorToMarkerLayerMap[editor.id]['selectedMarkerLayer'];
      scrollMarkerView.getLayer("highlight-selected-marker-layer").syncToMarkerLayer(markerLayer);
      return scrollMarkerView.getLayer("highlight-selected-selected-marker-layer").syncToMarkerLayer(selectedMarkerLayer);
    };

    HighlightedAreaView.prototype.destroyScrollMarkers = function(editor) {
      var scrollMarkerView;
      if (this.scrollMarker == null) {
        return;
      }
      scrollMarkerView = this.scrollMarker.scrollMarkerViewForEditor(editor);
      return scrollMarkerView.destroy();
    };

    return HighlightedAreaView;

  })();

  EarlyTerminationSignal = (function(superClass) {
    extend(EarlyTerminationSignal, superClass);

    function EarlyTerminationSignal() {
      return EarlyTerminationSignal.__super__.constructor.apply(this, arguments);
    }

    return EarlyTerminationSignal;

  })(Error);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1zZWxlY3RlZC9saWIvaGlnaGxpZ2h0ZWQtYXJlYS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsK0hBQUE7SUFBQTs7OztFQUFBLE1BQXFELE9BQUEsQ0FBUSxNQUFSLENBQXJELEVBQUMsaUJBQUQsRUFBUSw2Q0FBUixFQUE2QixxQkFBN0IsRUFBc0M7O0VBQ3RDLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSOztFQUNoQixZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSOztFQUVmLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFUyw2QkFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUNYLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSTtNQUNmLElBQUMsQ0FBQSxzQkFBRCxHQUEwQjtNQUMxQixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUNoQixJQUFDLENBQUEsV0FBRCxHQUFlO01BRWYsSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBQUksbUJBQUosQ0FBQTtNQUN2QixJQUFDLENBQUEsbUJBQW1CLENBQUMsR0FBckIsQ0FBeUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtVQUN6RCxLQUFDLENBQUEsaUJBQUQsQ0FBbUIsTUFBbkI7aUJBQ0EsS0FBQyxDQUFBLG1CQUFELENBQXFCLE1BQXJCO1FBRnlEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUF6QjtNQUtBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxHQUFyQixDQUF5QixJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFmLENBQXFDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO0FBQzVELGNBQUE7VUFBQSxJQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFD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QUFDbkIsVUFBQTtNQUFBLElBQUEsQ0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkNBQWhCLENBQWQ7QUFBQSxlQUFBOztNQUNBLElBQWMseUJBQWQ7QUFBQSxlQUFBOztNQUVBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxZQUFZLENBQUMseUJBQWQsQ0FBd0MsTUFBeEM7TUFFbkIsV0FBQSxHQUFjLElBQUMsQ0FBQSxzQkFBdUIsQ0FBQSxNQUFNLENBQUMsRUFBUCxDQUFXLENBQUEsb0JBQUE7TUFDakQsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLHNCQUF1QixDQUFBLE1BQU0sQ0FBQyxFQUFQLENBQVcsQ0FBQSxxQkFBQTtNQUV6RCxnQkFBZ0IsQ0FBQyxRQUFqQixDQUEwQixpQ0FBMUIsQ0FDZ0IsQ0FBQyxpQkFEakIsQ0FDbUMsV0FEbkM7YUFFQSxnQkFBZ0IsQ0FBQyxRQUFqQixDQUEwQiwwQ0FBMUIsQ0FDZ0IsQ0FBQyxpQkFEakIsQ0FDbUMsbUJBRG5DO0lBWG1COztrQ0FjckIsb0JBQUEsR0FBc0IsU0FBQyxNQUFEO0FBQ3BCLFVBQUE7TUFBQSxJQUFjLHlCQUFkO0FBQUEsZUFBQTs7TUFFQSxnQkFBQSxHQUFtQixJQUFDLENBQUEsWUFBWSxDQUFDLHlCQUFkLENBQXdDLE1BQXhDO2FBQ25CLGdCQUFnQixDQUFDLE9BQWpCLENBQUE7SUFKb0I7Ozs7OztFQU1sQjs7Ozs7Ozs7O0tBQStCO0FBcFhyQyIsInNvdXJjZXNDb250ZW50IjpbIntSYW5nZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciwgTWFya2VyTGF5ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcblN0YXR1c0JhclZpZXcgPSByZXF1aXJlICcuL3N0YXR1cy1iYXItdmlldydcbmVzY2FwZVJlZ0V4cCA9IHJlcXVpcmUgJy4vZXNjYXBlLXJlZy1leHAnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEhpZ2hsaWdodGVkQXJlYVZpZXdcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQGVkaXRvclRvTWFya2VyTGF5ZXJNYXAgPSB7fVxuICAgIEBtYXJrZXJMYXllcnMgPSBbXVxuICAgIEByZXN1bHRDb3VudCA9IDBcblxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT5cbiAgICAgIEBzZXR1cE1hcmtlckxheWVycyhlZGl0b3IpXG4gICAgICBAc2V0U2Nyb2xsTWFya2VyVmlldyhlZGl0b3IpXG4gICAgKSlcblxuICAgIEBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbldpbGxEZXN0cm95UGFuZUl0ZW0oKGl0ZW0pID0+XG4gICAgICByZXR1cm4gdW5sZXNzIGl0ZW0uaXRlbS5jb25zdHJ1Y3Rvci5uYW1lID09ICdUZXh0RWRpdG9yJ1xuICAgICAgZWRpdG9yID0gaXRlbS5pdGVtXG4gICAgICBAcmVtb3ZlTWFya2VycyhlZGl0b3IuaWQpXG4gICAgICBkZWxldGUgQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9yLmlkXVxuICAgICAgQGRlc3Ryb3lTY3JvbGxNYXJrZXJzKGVkaXRvcilcbiAgICApKVxuXG4gICAgQGVuYWJsZSgpXG4gICAgQGxpc3RlbkZvclRpbWVvdXRDaGFuZ2UoKVxuICAgIEBhY3RpdmVJdGVtU3Vic2NyaXB0aW9uID0gYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSA9PlxuICAgICAgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvbigpXG4gICAgICBAc3Vic2NyaWJlVG9BY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAc3Vic2NyaWJlVG9BY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAbGlzdGVuRm9yU3RhdHVzQmFyQ2hhbmdlKClcblxuICAgIEBlbmFibGVTY3JvbGxWaWV3T2JzZXJ2ZVN1YnNjcmlwdGlvbiA9XG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICdoaWdobGlnaHQtc2VsZWN0ZWQuc2hvd1Jlc3VsdHNPblNjcm9sbEJhcicsIChlbmFibGVkKSA9PlxuICAgICAgICBpZiBlbmFibGVkXG4gICAgICAgICAgQGVuc3VyZVNjcm9sbFZpZXdJbnN0YWxsZWQoKVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaChAc2V0U2Nyb2xsTWFya2VyVmlldylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaChAZGVzdHJveVNjcm9sbE1hcmtlcnMpXG5cbiAgZGVzdHJveTogPT5cbiAgICBjbGVhclRpbWVvdXQoQGhhbmRsZVNlbGVjdGlvblRpbWVvdXQpXG4gICAgQGFjdGl2ZUl0ZW1TdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQGVuYWJsZVNjcm9sbFZpZXdPYnNlcnZlU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAZWRpdG9yU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQHN0YXR1c0JhclZpZXc/LnJlbW92ZUVsZW1lbnQoKVxuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IG51bGxcblxuICBvbkRpZEFkZE1hcmtlcjogKGNhbGxiYWNrKSA9PlxuICAgIEdyaW0gPSByZXF1aXJlICdncmltJ1xuICAgIEdyaW0uZGVwcmVjYXRlKFwiUGxlYXNlIGRvIG5vdCB1c2UuIFRoaXMgbWV0aG9kIHdpbGwgYmUgcmVtb3ZlZC5cIilcbiAgICBAZW1pdHRlci5vbiAnZGlkLWFkZC1tYXJrZXInLCBjYWxsYmFja1xuXG4gIG9uRGlkQWRkU2VsZWN0ZWRNYXJrZXI6IChjYWxsYmFjaykgPT5cbiAgICBHcmltID0gcmVxdWlyZSAnZ3JpbSdcbiAgICBHcmltLmRlcHJlY2F0ZShcIlBsZWFzZSBkbyBub3QgdXNlLiBUaGlzIG1ldGhvZCB3aWxsIGJlIHJlbW92ZWQuXCIpXG4gICAgQGVtaXR0ZXIub24gJ2RpZC1hZGQtc2VsZWN0ZWQtbWFya2VyJywgY2FsbGJhY2tcblxuICBvbkRpZEFkZE1hcmtlckZvckVkaXRvcjogKGNhbGxiYWNrKSA9PlxuICAgIEBlbWl0dGVyLm9uICdkaWQtYWRkLW1hcmtlci1mb3ItZWRpdG9yJywgY2FsbGJhY2tcblxuICBvbkRpZEFkZFNlbGVjdGVkTWFya2VyRm9yRWRpdG9yOiAoY2FsbGJhY2spID0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1hZGQtc2VsZWN0ZWQtbWFya2VyLWZvci1lZGl0b3InLCBjYWxsYmFja1xuXG4gIG9uRGlkUmVtb3ZlQWxsTWFya2VyczogKGNhbGxiYWNrKSA9PlxuICAgIEBlbWl0dGVyLm9uICdkaWQtcmVtb3ZlLW1hcmtlci1sYXllcicsIGNhbGxiYWNrXG5cbiAgZGlzYWJsZTogPT5cbiAgICBAZGlzYWJsZWQgPSB0cnVlXG4gICAgQHJlbW92ZUFsbE1hcmtlcnMoKVxuXG4gIGVuYWJsZTogPT5cbiAgICBAZGlzYWJsZWQgPSBmYWxzZVxuICAgIEBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb24oKVxuXG4gIHNldFN0YXR1c0JhcjogKHN0YXR1c0JhcikgPT5cbiAgICBAc3RhdHVzQmFyID0gc3RhdHVzQmFyXG4gICAgQHNldHVwU3RhdHVzQmFyKClcblxuICBkZWJvdW5jZWRIYW5kbGVTZWxlY3Rpb246ID0+XG4gICAgY2xlYXJUaW1lb3V0KEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0KVxuICAgIEBoYW5kbGVTZWxlY3Rpb25UaW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgQGhhbmRsZVNlbGVjdGlvbigpXG4gICAgLCBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC50aW1lb3V0JylcblxuICBsaXN0ZW5Gb3JUaW1lb3V0Q2hhbmdlOiAtPlxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdoaWdobGlnaHQtc2VsZWN0ZWQudGltZW91dCcsID0+XG4gICAgICBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uKClcblxuICBzdWJzY3JpYmVUb0FjdGl2ZVRleHRFZGl0b3I6IC0+XG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlRWRpdG9yKClcbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvclxuXG4gICAgQHNlbGVjdGlvblN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc2VsZWN0aW9uU3Vic2NyaXB0aW9uLmFkZChcbiAgICAgIGVkaXRvci5vbkRpZEFkZFNlbGVjdGlvbiBAZGVib3VuY2VkSGFuZGxlU2VsZWN0aW9uXG4gICAgKVxuICAgIEBzZWxlY3Rpb25TdWJzY3JpcHRpb24uYWRkKFxuICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UgQGRlYm91bmNlZEhhbmRsZVNlbGVjdGlvblxuICAgIClcbiAgICBAaGFuZGxlU2VsZWN0aW9uKClcblxuICBnZXRBY3RpdmVFZGl0b3I6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgZ2V0QWN0aXZlRWRpdG9yczogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpLm1hcCAocGFuZSkgLT5cbiAgICAgIGFjdGl2ZUl0ZW0gPSBwYW5lLmFjdGl2ZUl0ZW1cbiAgICAgIGFjdGl2ZUl0ZW0gaWYgYWN0aXZlSXRlbSBhbmQgYWN0aXZlSXRlbS5jb25zdHJ1Y3Rvci5uYW1lID09ICdUZXh0RWRpdG9yJ1xuXG4gIGhhbmRsZVNlbGVjdGlvbjogPT5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlRWRpdG9yKClcbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvclxuXG4gICAgQHJlbW92ZUFsbE1hcmtlcnMoKVxuXG4gICAgcmV0dXJuIGlmIEBkaXNhYmxlZFxuICAgIHJldHVybiBpZiBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmlzRW1wdHkoKVxuXG4gICAgQHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgbGFzdFNlbGVjdGlvbiA9IGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKClcbiAgICB0ZXh0ID0gbGFzdFNlbGVjdGlvbi5nZXRUZXh0KClcblxuICAgIHJldHVybiBpZiB0ZXh0Lmxlbmd0aCA8IGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLm1pbmltdW1MZW5ndGgnKVxuICAgIHJldHVybiBpZiB0ZXh0LmluY2x1ZGVzKCdcXG4nKVxuICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIl5cXFxccyskXCIpXG4gICAgcmV0dXJuIGlmIHJlZ2V4LnRlc3QodGV4dClcblxuICAgIHJlZ2V4RmxhZ3MgPSAnZydcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5pZ25vcmVDYXNlJylcbiAgICAgIHJlZ2V4RmxhZ3MgPSAnZ2knXG5cbiAgICByZWdleFNlYXJjaCA9IGVzY2FwZVJlZ0V4cCh0ZXh0KVxuXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQub25seUhpZ2hsaWdodFdob2xlV29yZHMnKVxuICAgICAgcmV0dXJuIHVubGVzcyBAaXNXb3JkU2VsZWN0ZWQobGFzdFNlbGVjdGlvbilcbiAgICAgIHNlbGVjdGlvblN0YXJ0ID0gbGFzdFNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpLnN0YXJ0XG4gICAgICBub25Xb3JkQ2hhcmFjdGVycyA9IEBnZXROb25Xb3JkQ2hhcmFjdGVycyhlZGl0b3IsIHNlbGVjdGlvblN0YXJ0KVxuICAgICAgYWxsb3dlZENoYXJhY3RlcnNUb1NlbGVjdCA9IGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmFsbG93ZWRDaGFyYWN0ZXJzVG9TZWxlY3QnKVxuICAgICAgbm9uV29yZENoYXJhY3RlcnNUb1N0cmlwID0gbm9uV29yZENoYXJhY3RlcnMucmVwbGFjZShcbiAgICAgICAgbmV3IFJlZ0V4cChcIlsje2FsbG93ZWRDaGFyYWN0ZXJzVG9TZWxlY3R9XVwiLCAnZycpLCAnJylcbiAgICAgIHJlZ2V4Rm9yV2hvbGVXb3JkID0gbmV3IFJlZ0V4cChcIlsgXFxcXHQje2VzY2FwZVJlZ0V4cChub25Xb3JkQ2hhcmFjdGVyc1RvU3RyaXApfV1cIiwgcmVnZXhGbGFncylcbiAgICAgIHJldHVybiBpZiByZWdleEZvcldob2xlV29yZC50ZXN0KHRleHQpXG4gICAgICByZWdleFNlYXJjaCA9XG4gICAgICAgIFwiKD86WyBcXFxcdCN7ZXNjYXBlUmVnRXhwKG5vbldvcmRDaGFyYWN0ZXJzKX1dfF4pKFwiICtcbiAgICAgICAgcmVnZXhTZWFyY2ggK1xuICAgICAgICBcIikoPzpbIFxcXFx0I3tlc2NhcGVSZWdFeHAobm9uV29yZENoYXJhY3RlcnMpfV18JClcIlxuXG4gICAgQHJlc3VsdENvdW50ID0gMFxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmhpZ2hsaWdodEluUGFuZXMnKVxuICAgICAgb3JpZ2luYWxFZGl0b3IgPSBlZGl0b3JcbiAgICAgIEBnZXRBY3RpdmVFZGl0b3JzKCkuZm9yRWFjaCAoZWRpdG9yKSA9PlxuICAgICAgICBAaGlnaGxpZ2h0U2VsZWN0aW9uSW5FZGl0b3IoZWRpdG9yLCByZWdleFNlYXJjaCwgcmVnZXhGbGFncywgb3JpZ2luYWxFZGl0b3IpXG4gICAgZWxzZVxuICAgICAgQGhpZ2hsaWdodFNlbGVjdGlvbkluRWRpdG9yKGVkaXRvciwgcmVnZXhTZWFyY2gsIHJlZ2V4RmxhZ3MpXG5cbiAgICBAc3RhdHVzQmFyRWxlbWVudD8udXBkYXRlQ291bnQoQHJlc3VsdENvdW50KVxuXG4gIGhpZ2hsaWdodFNlbGVjdGlvbkluRWRpdG9yOiAoZWRpdG9yLCByZWdleFNlYXJjaCwgcmVnZXhGbGFncywgb3JpZ2luYWxFZGl0b3IpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG4gICAgbWF4aW11bUhpZ2hsaWdodHMgPSBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5tYXhpbXVtSGlnaGxpZ2h0cycpXG4gICAgcmV0dXJuIHVubGVzcyB0aGlzLnJlc3VsdENvdW50IDwgbWF4aW11bUhpZ2hsaWdodHNcblxuICAgIG1hcmtlckxheWVycyA9ICBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3IuaWRdXG4gICAgcmV0dXJuIHVubGVzcyBtYXJrZXJMYXllcnM/XG4gICAgbWFya2VyTGF5ZXIgPSBtYXJrZXJMYXllcnNbJ3Zpc2libGVNYXJrZXJMYXllciddXG4gICAgbWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzID0gbWFya2VyTGF5ZXJzWydzZWxlY3RlZE1hcmtlckxheWVyJ11cblxuICAgICMgSEFDSzogYGVkaXRvci5zY2FuYCBpcyBhIHN5bmNocm9ub3VzIHByb2Nlc3Mgd2hpY2ggaXRlcmF0ZXMgdGhlIGVudGlyZSBidWZmZXIsXG4gICAgIyBleGVjdXRpbmcgYSByZWdleCBhZ2FpbnN0IGV2ZXJ5IGxpbmUgYW5kIHlpZWxkaW5nIGVhY2ggbWF0Y2guIFRoaXMgY2FuIGJlXG4gICAgIyBjb3N0bHkgZm9yIHZlcnkgbGFyZ2UgZmlsZXMgd2l0aCBtYW55IG1hdGNoZXMuXG4gICAgI1xuICAgICMgV2hpbGUgd2UgY2FuIGFuZCBkbyBsaW1pdCB0aGUgbWF4aW11bSBudW1iZXIgb2YgaGlnaGxpZ2h0IG1hcmtlcnMsXG4gICAgIyBgZWRpdG9yLnNjYW5gIGNhbm5vdCBiZSB0ZXJtaW5hdGVkIGVhcmx5LCBtZWFuaW5nIHRoYXQgd2UgYXJlIGZvcmNlZCB0b1xuICAgICMgcGF5IHRoZSBjb3N0IG9mIGl0ZXJhdGluZyBldmVyeSBsaW5lIGluIHRoZSBmaWxlLCBydW5uaW5nIHRoZSByZWdleCwgYW5kXG4gICAgIyByZXR1cm5pbmcgbWF0Y2hlcywgZXZlbiBpZiB3ZSBzaG91bGRuJ3QgYmUgY3JlYXRpbmcgYW55IG1vcmUgbWFya2Vycy5cbiAgICAjXG4gICAgIyBJbnN0ZWFkLCB0aHJvdyBhbiBleGNlcHRpb24uIFRoaXMgaXNuJ3QgcHJldHR5LCBidXQgaXQgcHJldmVudHMgdGhlXG4gICAgIyBzY2FuIGZyb20gcnVubmluZyB0byBjb21wbGV0aW9uIHVubmVjZXNzYXJpbHkuXG4gICAgdHJ5XG4gICAgICBlZGl0b3Iuc2NhbiBuZXcgUmVnRXhwKHJlZ2V4U2VhcmNoLCByZWdleEZsYWdzKSxcbiAgICAgICAgKHJlc3VsdCkgPT5cbiAgICAgICAgICBpZiAodGhpcy5yZXN1bHRDb3VudCA+PSBtYXhpbXVtSGlnaGxpZ2h0cylcbiAgICAgICAgICAgIHRocm93IG5ldyBFYXJseVRlcm1pbmF0aW9uU2lnbmFsXG5cbiAgICAgICAgICBuZXdSZXN1bHQgPSByZXN1bHRcbiAgICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5vbmx5SGlnaGxpZ2h0V2hvbGVXb3JkcycpXG4gICAgICAgICAgICBlZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UoXG4gICAgICAgICAgICAgIG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKHJlc3VsdC5tYXRjaFsxXSkpLFxuICAgICAgICAgICAgICByZXN1bHQucmFuZ2UsXG4gICAgICAgICAgICAgIChlKSAtPiBuZXdSZXN1bHQgPSBlXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICByZXR1cm4gdW5sZXNzIG5ld1Jlc3VsdD9cbiAgICAgICAgICBAcmVzdWx0Q291bnQgKz0gMVxuXG4gICAgICAgICAgaWYgQHNob3dIaWdobGlnaHRPblNlbGVjdGVkV29yZChuZXdSZXN1bHQucmFuZ2UsIEBzZWxlY3Rpb25zKSAmJlxuICAgICAgICAgICAgIG9yaWdpbmFsRWRpdG9yPy5pZCA9PSBlZGl0b3IuaWRcbiAgICAgICAgICAgIG1hcmtlciA9IG1hcmtlckxheWVyRm9ySGlkZGVuTWFya2Vycy5tYXJrQnVmZmVyUmFuZ2UobmV3UmVzdWx0LnJhbmdlKVxuICAgICAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1zZWxlY3RlZC1tYXJrZXInLCBtYXJrZXJcbiAgICAgICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1hZGQtc2VsZWN0ZWQtbWFya2VyLWZvci1lZGl0b3InLFxuICAgICAgICAgICAgICBtYXJrZXI6IG1hcmtlclxuICAgICAgICAgICAgICBlZGl0b3I6IGVkaXRvclxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG1hcmtlciA9IG1hcmtlckxheWVyLm1hcmtCdWZmZXJSYW5nZShuZXdSZXN1bHQucmFuZ2UpXG4gICAgICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLW1hcmtlcicsIG1hcmtlclxuICAgICAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1tYXJrZXItZm9yLWVkaXRvcicsXG4gICAgICAgICAgICAgIG1hcmtlcjogbWFya2VyXG4gICAgICAgICAgICAgIGVkaXRvcjogZWRpdG9yXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIGlmIGVycm9yIG5vdCBpbnN0YW5jZW9mIEVhcmx5VGVybWluYXRpb25TaWduYWxcbiAgICAgICAgIyBJZiB0aGlzIGlzIGFuIGVhcmx5IHRlcm1pbmF0aW9uLCBqdXN0IGNvbnRpbnVlIG9uLlxuICAgICAgICB0aHJvdyBlcnJvclxuXG4gICAgZWRpdG9yLmRlY29yYXRlTWFya2VyTGF5ZXIobWFya2VyTGF5ZXIsIHtcbiAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgY2xhc3M6IEBtYWtlQ2xhc3NlcygpXG4gICAgfSlcblxuICBtYWtlQ2xhc3NlczogLT5cbiAgICBjbGFzc05hbWUgPSAnaGlnaGxpZ2h0LXNlbGVjdGVkJ1xuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLmxpZ2h0VGhlbWUnKVxuICAgICAgY2xhc3NOYW1lICs9ICcgbGlnaHQtdGhlbWUnXG5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5oaWdobGlnaHRCYWNrZ3JvdW5kJylcbiAgICAgIGNsYXNzTmFtZSArPSAnIGJhY2tncm91bmQnXG4gICAgY2xhc3NOYW1lXG5cbiAgc2hvd0hpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkOiAocmFuZ2UsIHNlbGVjdGlvbnMpIC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAnaGlnaGxpZ2h0LXNlbGVjdGVkLmhpZGVIaWdobGlnaHRPblNlbGVjdGVkV29yZCcpXG4gICAgb3V0Y29tZSA9IGZhbHNlXG4gICAgZm9yIHNlbGVjdGlvbiBpbiBzZWxlY3Rpb25zXG4gICAgICBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBvdXRjb21lID0gKHJhbmdlLnN0YXJ0LmNvbHVtbiBpcyBzZWxlY3Rpb25SYW5nZS5zdGFydC5jb2x1bW4pIGFuZFxuICAgICAgICAgICAgICAgIChyYW5nZS5zdGFydC5yb3cgaXMgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQucm93KSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2UuZW5kLmNvbHVtbiBpcyBzZWxlY3Rpb25SYW5nZS5lbmQuY29sdW1uKSBhbmRcbiAgICAgICAgICAgICAgICAocmFuZ2UuZW5kLnJvdyBpcyBzZWxlY3Rpb25SYW5nZS5lbmQucm93KVxuICAgICAgYnJlYWsgaWYgb3V0Y29tZVxuICAgIG91dGNvbWVcblxuICByZW1vdmVBbGxNYXJrZXJzOiA9PlxuICAgIE9iamVjdC5rZXlzKEBlZGl0b3JUb01hcmtlckxheWVyTWFwKS5mb3JFYWNoKEByZW1vdmVNYXJrZXJzKVxuXG4gIHJlbW92ZU1hcmtlcnM6IChlZGl0b3JJZCkgPT5cbiAgICByZXR1cm4gdW5sZXNzIEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvcklkXT9cblxuICAgIG1hcmtlckxheWVyID0gQGVkaXRvclRvTWFya2VyTGF5ZXJNYXBbZWRpdG9ySWRdWyd2aXNpYmxlTWFya2VyTGF5ZXInXVxuICAgIHNlbGVjdGVkTWFya2VyTGF5ZXIgPSBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3JJZF1bJ3NlbGVjdGVkTWFya2VyTGF5ZXInXVxuXG4gICAgbWFya2VyTGF5ZXIuY2xlYXIoKVxuICAgIHNlbGVjdGVkTWFya2VyTGF5ZXIuY2xlYXIoKVxuXG4gICAgQHN0YXR1c0JhckVsZW1lbnQ/LnVwZGF0ZUNvdW50KDApXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXJlbW92ZS1tYXJrZXItbGF5ZXInXG5cbiAgaXNXb3JkU2VsZWN0ZWQ6IChzZWxlY3Rpb24pIC0+XG4gICAgaWYgc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuaXNTaW5nbGVMaW5lKClcbiAgICAgIHNlbGVjdGlvblJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIGxpbmVSYW5nZSA9IEBnZXRBY3RpdmVFZGl0b3IoKS5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhcbiAgICAgICAgc2VsZWN0aW9uUmFuZ2Uuc3RhcnQucm93KVxuICAgICAgbm9uV29yZENoYXJhY3RlclRvVGhlTGVmdCA9XG4gICAgICAgIHNlbGVjdGlvblJhbmdlLnN0YXJ0LmlzRXF1YWwobGluZVJhbmdlLnN0YXJ0KSBvclxuICAgICAgICBAaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0KHNlbGVjdGlvbilcbiAgICAgIG5vbldvcmRDaGFyYWN0ZXJUb1RoZVJpZ2h0ID1cbiAgICAgICAgc2VsZWN0aW9uUmFuZ2UuZW5kLmlzRXF1YWwobGluZVJhbmdlLmVuZCkgb3JcbiAgICAgICAgQGlzTm9uV29yZENoYXJhY3RlclRvVGhlUmlnaHQoc2VsZWN0aW9uKVxuXG4gICAgICBub25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0IGFuZCBub25Xb3JkQ2hhcmFjdGVyVG9UaGVSaWdodFxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cbiAgZ2V0Tm9uV29yZENoYXJhY3RlcnM6IChlZGl0b3IsIHBvaW50KSAtPlxuICAgIHNjb3BlRGVzY3JpcHRvciA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihwb2ludClcbiAgICBub25Xb3JkQ2hhcmFjdGVycyA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLm5vbldvcmRDaGFyYWN0ZXJzJywgc2NvcGU6IHNjb3BlRGVzY3JpcHRvcilcblxuICBpc05vbldvcmQ6IChlZGl0b3IsIHJhbmdlKSAtPlxuICAgIG5vbldvcmRDaGFyYWN0ZXJzID0gQGdldE5vbldvcmRDaGFyYWN0ZXJzKGVkaXRvciwgcmFuZ2Uuc3RhcnQpXG4gICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgICBuZXcgUmVnRXhwKFwiWyBcXHQje2VzY2FwZVJlZ0V4cChub25Xb3JkQ2hhcmFjdGVycyl9XVwiKS50ZXN0KHRleHQpXG5cbiAgaXNOb25Xb3JkQ2hhcmFjdGVyVG9UaGVMZWZ0OiAoc2VsZWN0aW9uKSAtPlxuICAgIHNlbGVjdGlvblN0YXJ0ID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnRcbiAgICByYW5nZSA9IFJhbmdlLmZyb21Qb2ludFdpdGhEZWx0YShzZWxlY3Rpb25TdGFydCwgMCwgLTEpXG4gICAgQGlzTm9uV29yZChAZ2V0QWN0aXZlRWRpdG9yKCksIHJhbmdlKVxuXG4gIGlzTm9uV29yZENoYXJhY3RlclRvVGhlUmlnaHQ6IChzZWxlY3Rpb24pIC0+XG4gICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuZW5kXG4gICAgcmFuZ2UgPSBSYW5nZS5mcm9tUG9pbnRXaXRoRGVsdGEoc2VsZWN0aW9uRW5kLCAwLCAxKVxuICAgIEBpc05vbldvcmQoQGdldEFjdGl2ZUVkaXRvcigpLCByYW5nZSlcblxuICBzZXR1cFN0YXR1c0JhcjogPT5cbiAgICByZXR1cm4gaWYgQHN0YXR1c0JhckVsZW1lbnQ/XG4gICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoJ2hpZ2hsaWdodC1zZWxlY3RlZC5zaG93SW5TdGF0dXNCYXInKVxuICAgIEBzdGF0dXNCYXJFbGVtZW50ID0gbmV3IFN0YXR1c0JhclZpZXcoKVxuICAgIEBzdGF0dXNCYXJUaWxlID0gQHN0YXR1c0Jhci5hZGRMZWZ0VGlsZShcbiAgICAgIGl0ZW06IEBzdGF0dXNCYXJFbGVtZW50LmdldEVsZW1lbnQoKSwgcHJpb3JpdHk6IDEwMClcblxuICByZW1vdmVTdGF0dXNCYXI6ID0+XG4gICAgcmV0dXJuIHVubGVzcyBAc3RhdHVzQmFyRWxlbWVudD9cbiAgICBAc3RhdHVzQmFyVGlsZT8uZGVzdHJveSgpXG4gICAgQHN0YXR1c0JhclRpbGUgPSBudWxsXG4gICAgQHN0YXR1c0JhckVsZW1lbnQgPSBudWxsXG5cbiAgbGlzdGVuRm9yU3RhdHVzQmFyQ2hhbmdlOiA9PlxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdoaWdobGlnaHQtc2VsZWN0ZWQuc2hvd0luU3RhdHVzQmFyJywgKGNoYW5nZWQpID0+XG4gICAgICBpZiBjaGFuZ2VkLm5ld1ZhbHVlXG4gICAgICAgIEBzZXR1cFN0YXR1c0JhcigpXG4gICAgICBlbHNlXG4gICAgICAgIEByZW1vdmVTdGF0dXNCYXIoKVxuXG4gIHNlbGVjdEFsbDogPT5cbiAgICBlZGl0b3IgPSBAZ2V0QWN0aXZlRWRpdG9yKClcbiAgICBtYXJrZXJMYXllcnMgPSBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3IuaWRdXG4gICAgcmV0dXJuIHVubGVzcyBtYXJrZXJMYXllcnM/XG4gICAgcmFuZ2VzID0gW11cbiAgICBmb3IgbWFya2VyTGF5ZXIgaW4gW21hcmtlckxheWVyc1sndmlzaWJsZU1hcmtlckxheWVyJ10sIG1hcmtlckxheWVyc1snc2VsZWN0ZWRNYXJrZXJMYXllciddXVxuICAgICAgZm9yIG1hcmtlciBpbiBtYXJrZXJMYXllci5nZXRNYXJrZXJzKClcbiAgICAgICAgcmFuZ2VzLnB1c2ggbWFya2VyLmdldEJ1ZmZlclJhbmdlKClcblxuICAgIGlmIHJhbmdlcy5sZW5ndGggPiAwXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMocmFuZ2VzLCBmbGFzaDogdHJ1ZSlcblxuICBzZXRTY3JvbGxNYXJrZXI6IChzY3JvbGxNYXJrZXJBUEkpID0+XG4gICAgQHNjcm9sbE1hcmtlciA9IHNjcm9sbE1hcmtlckFQSVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LXNlbGVjdGVkLnNob3dSZXN1bHRzT25TY3JvbGxCYXInKVxuICAgICAgQGVuc3VyZVNjcm9sbFZpZXdJbnN0YWxsZWQoKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoKEBzZXRTY3JvbGxNYXJrZXJWaWV3KVxuXG4gIGVuc3VyZVNjcm9sbFZpZXdJbnN0YWxsZWQ6IC0+XG4gICAgdW5sZXNzIGF0b20uaW5TcGVjTW9kZSgpXG4gICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwgJ2hpZ2hsaWdodC1zZWxlY3RlZCcsIHRydWVcblxuICBzZXR1cE1hcmtlckxheWVyczogKGVkaXRvcikgPT5cbiAgICBpZiBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3IuaWRdP1xuICAgICAgbWFya2VyTGF5ZXIgPSBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3IuaWRdWyd2aXNpYmxlTWFya2VyTGF5ZXInXVxuICAgICAgbWFya2VyTGF5ZXJGb3JIaWRkZW5NYXJrZXJzICA9IEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF1bJ3NlbGVjdGVkTWFya2VyTGF5ZXInXVxuICAgIGVsc2VcbiAgICAgIG1hcmtlckxheWVyID0gZWRpdG9yLmFkZE1hcmtlckxheWVyKClcbiAgICAgIG1hcmtlckxheWVyRm9ySGlkZGVuTWFya2VycyA9IGVkaXRvci5hZGRNYXJrZXJMYXllcigpXG4gICAgICBAZWRpdG9yVG9NYXJrZXJMYXllck1hcFtlZGl0b3IuaWRdID1cbiAgICAgICAgdmlzaWJsZU1hcmtlckxheWVyOiBtYXJrZXJMYXllclxuICAgICAgICBzZWxlY3RlZE1hcmtlckxheWVyOiBtYXJrZXJMYXllckZvckhpZGRlbk1hcmtlcnNcblxuICBzZXRTY3JvbGxNYXJrZXJWaWV3OiAoZWRpdG9yKSA9PlxuICAgIHJldHVybiB1bmxlc3MgYXRvbS5jb25maWcuZ2V0KCdoaWdobGlnaHQtc2VsZWN0ZWQuc2hvd1Jlc3VsdHNPblNjcm9sbEJhcicpXG4gICAgcmV0dXJuIHVubGVzcyBAc2Nyb2xsTWFya2VyP1xuXG4gICAgc2Nyb2xsTWFya2VyVmlldyA9IEBzY3JvbGxNYXJrZXIuc2Nyb2xsTWFya2VyVmlld0ZvckVkaXRvcihlZGl0b3IpXG5cbiAgICBtYXJrZXJMYXllciA9IEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF1bJ3Zpc2libGVNYXJrZXJMYXllciddXG4gICAgc2VsZWN0ZWRNYXJrZXJMYXllciA9IEBlZGl0b3JUb01hcmtlckxheWVyTWFwW2VkaXRvci5pZF1bJ3NlbGVjdGVkTWFya2VyTGF5ZXInXVxuXG4gICAgc2Nyb2xsTWFya2VyVmlldy5nZXRMYXllcihcImhpZ2hsaWdodC1zZWxlY3RlZC1tYXJrZXItbGF5ZXJcIilcbiAgICAgICAgICAgICAgICAgICAgLnN5bmNUb01hcmtlckxheWVyKG1hcmtlckxheWVyKVxuICAgIHNjcm9sbE1hcmtlclZpZXcuZ2V0TGF5ZXIoXCJoaWdobGlnaHQtc2VsZWN0ZWQtc2VsZWN0ZWQtbWFya2VyLWxheWVyXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zeW5jVG9NYXJrZXJMYXllcihzZWxlY3RlZE1hcmtlckxheWVyKVxuXG4gIGRlc3Ryb3lTY3JvbGxNYXJrZXJzOiAoZWRpdG9yKSA9PlxuICAgIHJldHVybiB1bmxlc3MgQHNjcm9sbE1hcmtlcj9cblxuICAgIHNjcm9sbE1hcmtlclZpZXcgPSBAc2Nyb2xsTWFya2VyLnNjcm9sbE1hcmtlclZpZXdGb3JFZGl0b3IoZWRpdG9yKVxuICAgIHNjcm9sbE1hcmtlclZpZXcuZGVzdHJveSgpXG5cbmNsYXNzIEVhcmx5VGVybWluYXRpb25TaWduYWwgZXh0ZW5kcyBFcnJvclxuIl19
