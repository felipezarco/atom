(function() {
  var CompositeDisposable, HighlightedAreaView;

  CompositeDisposable = require("atom").CompositeDisposable;

  HighlightedAreaView = require('./highlighted-area-view');

  module.exports = {
    config: {
      onlyHighlightWholeWords: {
        type: 'boolean',
        "default": true
      },
      hideHighlightOnSelectedWord: {
        type: 'boolean',
        "default": false
      },
      ignoreCase: {
        type: 'boolean',
        "default": false
      },
      lightTheme: {
        type: 'boolean',
        "default": false
      },
      highlightBackground: {
        type: 'boolean',
        "default": false
      },
      minimumLength: {
        type: 'integer',
        "default": 2
      },
      maximumHighlights: {
        type: 'integer',
        "default": 500,
        description: 'For performance purposes, the number of highlights is limited'
      },
      timeout: {
        type: 'integer',
        "default": 20,
        description: 'Defers searching for matching strings for X ms'
      },
      showInStatusBar: {
        type: 'boolean',
        "default": true,
        description: 'Show how many matches there are'
      },
      highlightInPanes: {
        type: 'boolean',
        "default": true,
        description: 'Highlight selection in another panes'
      },
      statusBarString: {
        type: 'string',
        "default": 'Highlighted: %c',
        description: 'The text to show in the status bar. %c = number of occurrences'
      },
      allowedCharactersToSelect: {
        type: 'string',
        "default": '$@%-',
        description: 'Non Word Characters that are allowed to be selected'
      },
      showResultsOnScrollBar: {
        type: 'boolean',
        "default": false,
        description: 'Show highlight on the scroll bar'
      }
    },
    areaView: null,
    activate: function(state) {
      this.areaView = new HighlightedAreaView();
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-selected:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'highlight-selected:select-all': (function(_this) {
          return function() {
            return _this.selectAll();
          };
        })(this)
      }));
    },
    deactivate: function() {
      var ref, ref1;
      if ((ref = this.areaView) != null) {
        ref.destroy();
      }
      this.areaView = null;
      if ((ref1 = this.subscriptions) != null) {
        ref1.dispose();
      }
      return this.subscriptions = null;
    },
    provideHighlightSelectedV1Deprecated: function() {
      return this.areaView;
    },
    provideHighlightSelectedV2: function() {
      return this.areaView;
    },
    consumeStatusBar: function(statusBar) {
      return this.areaView.setStatusBar(statusBar);
    },
    toggle: function() {
      if (this.areaView.disabled) {
        return this.areaView.enable();
      } else {
        return this.areaView.disable();
      }
    },
    selectAll: function() {
      return this.areaView.selectAll();
    },
    consumeScrollMarker: function(scrollMarkerAPI) {
      return this.areaView.setScrollMarker(scrollMarkerAPI);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1zZWxlY3RlZC9saWIvaGlnaGxpZ2h0LXNlbGVjdGVkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVI7O0VBRXRCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSx1QkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7T0FERjtNQUdBLDJCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQUpGO01BTUEsVUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FQRjtNQVNBLFVBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BVkY7TUFZQSxtQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FiRjtNQWVBLGFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQURUO09BaEJGO01Ba0JBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsR0FEVDtRQUVBLFdBQUEsRUFBYSwrREFGYjtPQW5CRjtNQXNCQSxPQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtRQUVBLFdBQUEsRUFBYSxnREFGYjtPQXZCRjtNQTBCQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxpQ0FGYjtPQTNCRjtNQThCQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7UUFFQSxXQUFBLEVBQWEsc0NBRmI7T0EvQkY7TUFrQ0EsZUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGlCQURUO1FBRUEsV0FBQSxFQUFhLGdFQUZiO09BbkNGO01Bc0NBLHlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFEVDtRQUVBLFdBQUEsRUFBYSxxREFGYjtPQXZDRjtNQTBDQSxzQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsa0NBRmI7T0EzQ0Y7S0FERjtJQWdEQSxRQUFBLEVBQVUsSUFoRFY7SUFrREEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUNSLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxtQkFBSixDQUFBO01BQ1osSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTthQUVyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNmO1FBQUEsMkJBQUEsRUFBNkIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCO1FBQ0EsK0JBQUEsRUFBaUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsU0FBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGpDO09BRGUsQ0FBbkI7SUFKUSxDQWxEVjtJQTBEQSxVQUFBLEVBQVksU0FBQTtBQUNWLFVBQUE7O1dBQVMsQ0FBRSxPQUFYLENBQUE7O01BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWTs7WUFDRSxDQUFFLE9BQWhCLENBQUE7O2FBQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFKUCxDQTFEWjtJQWdFQSxvQ0FBQSxFQUFzQyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FoRXRDO0lBa0VBLDBCQUFBLEVBQTRCLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQWxFNUI7SUFvRUEsZ0JBQUEsRUFBa0IsU0FBQyxTQUFEO2FBQ2hCLElBQUMsQ0FBQSxRQUFRLENBQUMsWUFBVixDQUF1QixTQUF2QjtJQURnQixDQXBFbEI7SUF1RUEsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBYjtlQUNFLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsRUFIRjs7SUFETSxDQXZFUjtJQTZFQSxTQUFBLEVBQVcsU0FBQTthQUNULElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixDQUFBO0lBRFMsQ0E3RVg7SUFnRkEsbUJBQUEsRUFBcUIsU0FBQyxlQUFEO2FBQ25CLElBQUMsQ0FBQSxRQUFRLENBQUMsZUFBVixDQUEwQixlQUExQjtJQURtQixDQWhGckI7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5IaWdobGlnaHRlZEFyZWFWaWV3ID0gcmVxdWlyZSAnLi9oaWdobGlnaHRlZC1hcmVhLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIG9ubHlIaWdobGlnaHRXaG9sZVdvcmRzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgaGlkZUhpZ2hsaWdodE9uU2VsZWN0ZWRXb3JkOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGlnbm9yZUNhc2U6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgbGlnaHRUaGVtZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBoaWdobGlnaHRCYWNrZ3JvdW5kOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIG1pbmltdW1MZW5ndGg6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDJcbiAgICBtYXhpbXVtSGlnaGxpZ2h0czpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogNTAwXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvciBwZXJmb3JtYW5jZSBwdXJwb3NlcywgdGhlIG51bWJlciBvZiBoaWdobGlnaHRzIGlzIGxpbWl0ZWQnXG4gICAgdGltZW91dDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMjBcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVmZXJzIHNlYXJjaGluZyBmb3IgbWF0Y2hpbmcgc3RyaW5ncyBmb3IgWCBtcydcbiAgICBzaG93SW5TdGF0dXNCYXI6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvdyBob3cgbWFueSBtYXRjaGVzIHRoZXJlIGFyZSdcbiAgICBoaWdobGlnaHRJblBhbmVzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogJ0hpZ2hsaWdodCBzZWxlY3Rpb24gaW4gYW5vdGhlciBwYW5lcydcbiAgICBzdGF0dXNCYXJTdHJpbmc6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ0hpZ2hsaWdodGVkOiAlYydcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHRleHQgdG8gc2hvdyBpbiB0aGUgc3RhdHVzIGJhci4gJWMgPSBudW1iZXIgb2Ygb2NjdXJyZW5jZXMnXG4gICAgYWxsb3dlZENoYXJhY3RlcnNUb1NlbGVjdDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnJEAlLSdcbiAgICAgIGRlc2NyaXB0aW9uOiAnTm9uIFdvcmQgQ2hhcmFjdGVycyB0aGF0IGFyZSBhbGxvd2VkIHRvIGJlIHNlbGVjdGVkJ1xuICAgIHNob3dSZXN1bHRzT25TY3JvbGxCYXI6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3cgaGlnaGxpZ2h0IG9uIHRoZSBzY3JvbGwgYmFyJ1xuXG4gIGFyZWFWaWV3OiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAYXJlYVZpZXcgPSBuZXcgSGlnaGxpZ2h0ZWRBcmVhVmlldygpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgICAgJ2hpZ2hsaWdodC1zZWxlY3RlZDp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcbiAgICAgICAgJ2hpZ2hsaWdodC1zZWxlY3RlZDpzZWxlY3QtYWxsJzogPT4gQHNlbGVjdEFsbCgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAYXJlYVZpZXc/LmRlc3Ryb3koKVxuICAgIEBhcmVhVmlldyA9IG51bGxcbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBudWxsXG5cbiAgcHJvdmlkZUhpZ2hsaWdodFNlbGVjdGVkVjFEZXByZWNhdGVkOiAtPiBAYXJlYVZpZXdcblxuICBwcm92aWRlSGlnaGxpZ2h0U2VsZWN0ZWRWMjogLT4gQGFyZWFWaWV3XG5cbiAgY29uc3VtZVN0YXR1c0JhcjogKHN0YXR1c0JhcikgLT5cbiAgICBAYXJlYVZpZXcuc2V0U3RhdHVzQmFyIHN0YXR1c0JhclxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAYXJlYVZpZXcuZGlzYWJsZWRcbiAgICAgIEBhcmVhVmlldy5lbmFibGUoKVxuICAgIGVsc2VcbiAgICAgIEBhcmVhVmlldy5kaXNhYmxlKClcblxuICBzZWxlY3RBbGw6IC0+XG4gICAgQGFyZWFWaWV3LnNlbGVjdEFsbCgpXG5cbiAgY29uc3VtZVNjcm9sbE1hcmtlcjogKHNjcm9sbE1hcmtlckFQSSkgLT5cbiAgICBAYXJlYVZpZXcuc2V0U2Nyb2xsTWFya2VyIHNjcm9sbE1hcmtlckFQSVxuIl19
