(function() {
  var FileOpener, MigrationFinderView, ViewFinderView;

  ViewFinderView = require('./view-finder-view');

  MigrationFinderView = require('./migration-finder-view');

  FileOpener = require('./file-opener');

  module.exports = {
    config: {
      viewFileExtension: {
        type: 'array',
        description: 'This is the extension of the view files.',
        "default": ['html.erb', 'html.slim', 'html.haml'],
        items: {
          type: 'string'
        }
      },
      controllerSpecType: {
        type: 'string',
        description: 'This is the type of the controller spec. controllers, requests or features',
        "default": 'controllers',
        "enum": ['controllers', 'requests', 'features', 'api', 'integration']
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'rails-transporter:open-view-finder': (function(_this) {
          return function() {
            return _this.createViewFinderView().toggle();
          };
        })(this),
        'rails-transporter:open-migration-finder': (function(_this) {
          return function() {
            return _this.createMigrationFinderView().toggle();
          };
        })(this),
        'rails-transporter:open-model': (function(_this) {
          return function() {
            return _this.createFileOpener().openModel();
          };
        })(this),
        'rails-transporter:open-helper': (function(_this) {
          return function() {
            return _this.createFileOpener().openHelper();
          };
        })(this),
        'rails-transporter:open-partial-template': (function(_this) {
          return function() {
            return _this.createFileOpener().openPartial();
          };
        })(this),
        'rails-transporter:open-test': (function(_this) {
          return function() {
            return _this.createFileOpener().openTest();
          };
        })(this),
        'rails-transporter:open-spec': (function(_this) {
          return function() {
            return _this.createFileOpener().openSpec();
          };
        })(this),
        'rails-transporter:open-asset': (function(_this) {
          return function() {
            return _this.createFileOpener().openAsset();
          };
        })(this),
        'rails-transporter:open-controller': (function(_this) {
          return function() {
            return _this.createFileOpener().openController();
          };
        })(this),
        'rails-transporter:open-layout': (function(_this) {
          return function() {
            return _this.createFileOpener().openLayout();
          };
        })(this),
        'rails-transporter:open-view': (function(_this) {
          return function() {
            return _this.createFileOpener().openView();
          };
        })(this),
        'rails-transporter:open-factory': (function(_this) {
          return function() {
            return _this.createFileOpener().openFactory();
          };
        })(this)
      });
    },
    deactivate: function() {
      if (this.viewFinderView != null) {
        this.viewFinderView.destroy();
      }
      if (this.migrationFinderView != null) {
        return this.migrationFinderView.destroy();
      }
    },
    createFileOpener: function() {
      if (this.fileOpener == null) {
        this.fileOpener = new FileOpener();
      }
      return this.fileOpener;
    },
    createViewFinderView: function() {
      if (this.viewFinderView == null) {
        this.viewFinderView = new ViewFinderView();
      }
      return this.viewFinderView;
    },
    createMigrationFinderView: function() {
      if (this.migrationFinderView == null) {
        this.migrationFinderView = new MigrationFinderView();
      }
      return this.migrationFinderView;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3JhaWxzLXRyYW5zcG9ydGVyL2xpYi9yYWlscy10cmFuc3BvcnRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSOztFQUNqQixtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVI7O0VBQ3RCLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsaUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBYSxPQUFiO1FBQ0EsV0FBQSxFQUFhLDBDQURiO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBYSxDQUFDLFVBQUQsRUFBYSxXQUFiLEVBQTBCLFdBQTFCLENBRmI7UUFHQSxLQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQUpGO09BREY7TUFNQSxrQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFhLFFBQWI7UUFDQSxXQUFBLEVBQWEsNEVBRGI7UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFhLGFBRmI7UUFHQSxDQUFBLElBQUEsQ0FBQSxFQUFhLENBQUMsYUFBRCxFQUFnQixVQUFoQixFQUE0QixVQUE1QixFQUF3QyxLQUF4QyxFQUErQyxhQUEvQyxDQUhiO09BUEY7S0FERjtJQWFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7YUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7UUFBQSxvQ0FBQSxFQUFzQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNwQyxLQUFDLENBQUEsb0JBQUQsQ0FBQSxDQUF1QixDQUFDLE1BQXhCLENBQUE7VUFEb0M7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRDO1FBRUEseUNBQUEsRUFBMkMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FB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QUFBLEVBQTJCLFNBQUE7TUFDekIsSUFBTyxnQ0FBUDtRQUNFLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFJLG1CQUFKLENBQUEsRUFEekI7O2FBR0EsSUFBQyxDQUFBO0lBSndCLENBMUQzQjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIlZpZXdGaW5kZXJWaWV3ID0gcmVxdWlyZSAnLi92aWV3LWZpbmRlci12aWV3J1xuTWlncmF0aW9uRmluZGVyVmlldyA9IHJlcXVpcmUgJy4vbWlncmF0aW9uLWZpbmRlci12aWV3J1xuRmlsZU9wZW5lciA9IHJlcXVpcmUgJy4vZmlsZS1vcGVuZXInXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIHZpZXdGaWxlRXh0ZW5zaW9uOlxuICAgICAgdHlwZTogICAgICAgICdhcnJheSdcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyB0aGUgZXh0ZW5zaW9uIG9mIHRoZSB2aWV3IGZpbGVzLidcbiAgICAgIGRlZmF1bHQ6ICAgICBbJ2h0bWwuZXJiJywgJ2h0bWwuc2xpbScsICdodG1sLmhhbWwnXVxuICAgICAgaXRlbXM6IFxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGNvbnRyb2xsZXJTcGVjVHlwZTpcbiAgICAgIHR5cGU6ICAgICAgICAnc3RyaW5nJ1xuICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIHRoZSB0eXBlIG9mIHRoZSBjb250cm9sbGVyIHNwZWMuIGNvbnRyb2xsZXJzLCByZXF1ZXN0cyBvciBmZWF0dXJlcydcbiAgICAgIGRlZmF1bHQ6ICAgICAnY29udHJvbGxlcnMnXG4gICAgICBlbnVtOiAgICAgICAgWydjb250cm9sbGVycycsICdyZXF1ZXN0cycsICdmZWF0dXJlcycsICdhcGknLCAnaW50ZWdyYXRpb24nXVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICdyYWlscy10cmFuc3BvcnRlcjpvcGVuLXZpZXctZmluZGVyJzogPT5cbiAgICAgICAgQGNyZWF0ZVZpZXdGaW5kZXJWaWV3KCkudG9nZ2xlKClcbiAgICAgICdyYWlscy10cmFuc3BvcnRlcjpvcGVuLW1pZ3JhdGlvbi1maW5kZXInOiA9PlxuICAgICAgICBAY3JlYXRlTWlncmF0aW9uRmluZGVyVmlldygpLnRvZ2dsZSgpXG4gICAgICAncmFpbHMtdHJhbnNwb3J0ZXI6b3Blbi1tb2RlbCc6ID0+XG4gICAgICAgIEBjcmVhdGVGaWxlT3BlbmVyKCkub3Blbk1vZGVsKClcbiAgICAgICdyYWlscy10cmFuc3BvcnRlcjpvcGVuLWhlbHBlcic6ID0+XG4gICAgICAgIEBjcmVhdGVGaWxlT3BlbmVyKCkub3BlbkhlbHBlcigpXG4gICAgICAncmFpbHMtdHJhbnNwb3J0ZXI6b3Blbi1wYXJ0aWFsLXRlbXBsYXRlJzogPT5cbiAgICAgICAgQGNyZWF0ZUZpbGVPcGVuZXIoKS5vcGVuUGFydGlhbCgpXG4gICAgICAncmFpbHMtdHJhbnNwb3J0ZXI6b3Blbi10ZXN0JzogPT5cbiAgICAgICAgQGNyZWF0ZUZpbGVPcGVuZXIoKS5vcGVuVGVzdCgpXG4gICAgICAncmFpbHMtdHJhbnNwb3J0ZXI6b3Blbi1zcGVjJzogPT5cbiAgICAgICAgQGNyZWF0ZUZpbGVPcGVuZXIoKS5vcGVuU3BlYygpXG4gICAgICAncmFpbHMtdHJhbnNwb3J0ZXI6b3Blbi1hc3NldCc6ID0+XG4gICAgICAgIEBjcmVhdGVGaWxlT3BlbmVyKCkub3BlbkFzc2V0KClcbiAgICAgICdyYWlscy10cmFuc3BvcnRlcjpvcGVuLWNvbnRyb2xsZXInOiA9PlxuICAgICAgICBAY3JlYXRlRmlsZU9wZW5lcigpLm9wZW5Db250cm9sbGVyKClcbiAgICAgICdyYWlscy10cmFuc3BvcnRlcjpvcGVuLWxheW91dCc6ID0+XG4gICAgICAgIEBjcmVhdGVGaWxlT3BlbmVyKCkub3BlbkxheW91dCgpXG4gICAgICAncmFpbHMtdHJhbnNwb3J0ZXI6b3Blbi12aWV3JzogPT5cbiAgICAgICAgQGNyZWF0ZUZpbGVPcGVuZXIoKS5vcGVuVmlldygpXG4gICAgICAncmFpbHMtdHJhbnNwb3J0ZXI6b3Blbi1mYWN0b3J5JzogPT5cbiAgICAgICAgQGNyZWF0ZUZpbGVPcGVuZXIoKS5vcGVuRmFjdG9yeSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBpZiBAdmlld0ZpbmRlclZpZXc/XG4gICAgICBAdmlld0ZpbmRlclZpZXcuZGVzdHJveSgpXG4gICAgaWYgQG1pZ3JhdGlvbkZpbmRlclZpZXc/XG4gICAgICBAbWlncmF0aW9uRmluZGVyVmlldy5kZXN0cm95KClcblxuICBjcmVhdGVGaWxlT3BlbmVyOiAtPlxuICAgIHVubGVzcyBAZmlsZU9wZW5lcj9cbiAgICAgIEBmaWxlT3BlbmVyID0gbmV3IEZpbGVPcGVuZXIoKVxuXG4gICAgQGZpbGVPcGVuZXJcblxuICBjcmVhdGVWaWV3RmluZGVyVmlldzogLT5cbiAgICB1bmxlc3MgQHZpZXdGaW5kZXJWaWV3P1xuICAgICAgQHZpZXdGaW5kZXJWaWV3ID0gbmV3IFZpZXdGaW5kZXJWaWV3KClcblxuICAgIEB2aWV3RmluZGVyVmlld1xuXG4gIGNyZWF0ZU1pZ3JhdGlvbkZpbmRlclZpZXc6IC0+XG4gICAgdW5sZXNzIEBtaWdyYXRpb25GaW5kZXJWaWV3P1xuICAgICAgQG1pZ3JhdGlvbkZpbmRlclZpZXcgPSBuZXcgTWlncmF0aW9uRmluZGVyVmlldygpXG5cbiAgICBAbWlncmF0aW9uRmluZGVyVmlld1xuIl19
