(function() {
  var $$, MigrationListView, SelectListView, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  module.exports = MigrationListView = (function(superClass) {
    extend(MigrationListView, superClass);

    function MigrationListView() {
      return MigrationListView.__super__.constructor.apply(this, arguments);
    }

    MigrationListView.prototype.initialize = function(data) {
      this.data = data != null ? data : [];
      MigrationListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    MigrationListView.prototype.parseData = function() {
      var migrations;
      migrations = this.data.map(function(migration) {
        var name, ref1;
        ref1 = migration.split('/'), name = ref1[ref1.length - 1];
        return {
          name: name,
          file: migration
        };
      });
      this.setItems(migrations);
      return this.focusFilterEditor();
    };

    MigrationListView.prototype.getFilterKey = function() {
      return 'name';
    };

    MigrationListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    MigrationListView.prototype.cancelled = function() {
      return this.hide();
    };

    MigrationListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    MigrationListView.prototype.viewForItem = function(arg) {
      var name;
      name = arg.name;
      return $$(function() {
        return this.li(name);
      });
    };

    MigrationListView.prototype.confirmed = function(arg) {
      var file;
      file = arg.file;
      atom.workspace.open(file);
      return this.cancel();
    };

    return MigrationListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3JhaWxzLWxhdGVzdC1taWdyYXRpb24vbGliL21pZ3JhdGlvbi1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwwQ0FBQTtJQUFBOzs7RUFBQSxNQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBRSxXQUFGLEVBQU07O0VBRU4sTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztnQ0FDSixVQUFBLEdBQVksU0FBQyxJQUFEO01BQUMsSUFBQyxDQUFBLHNCQUFELE9BQVE7TUFDbkIsbURBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO0lBSFU7O2dDQUtaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQU4sQ0FBVSxTQUFDLFNBQUQ7QUFDckIsWUFBQTtRQUFBLE9BQWMsU0FBUyxDQUFDLEtBQVYsQ0FBZ0IsR0FBaEIsQ0FBZCxFQUFNO2VBRU47VUFBRSxJQUFBLEVBQU0sSUFBUjtVQUFjLElBQUEsRUFBTSxTQUFwQjs7TUFIcUIsQ0FBVjtNQUtiLElBQUMsQ0FBQSxRQUFELENBQVUsVUFBVjthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBUFM7O2dDQVNYLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7Z0NBRWQsSUFBQSxHQUFNLFNBQUE7O1FBQ0osSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7YUFDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtJQUhJOztnQ0FLTixTQUFBLEdBQVcsU0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQUE7SUFBSDs7Z0NBRVgsSUFBQSxHQUFNLFNBQUE7QUFBRyxVQUFBOytDQUFNLENBQUUsT0FBUixDQUFBO0lBQUg7O2dDQUVOLFdBQUEsR0FBYSxTQUFDLEdBQUQ7QUFDWCxVQUFBO01BRGEsT0FBRDthQUNaLEVBQUEsQ0FBRyxTQUFBO2VBQUcsSUFBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKO01BQUgsQ0FBSDtJQURXOztnQ0FHYixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQURXLE9BQUQ7TUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBcEI7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRlM7Ozs7S0E3Qm1CO0FBSGhDIiwic291cmNlc0NvbnRlbnQiOlsieyAkJCwgU2VsZWN0TGlzdFZpZXcgfSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNaWdyYXRpb25MaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChAZGF0YSA9IFtdKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBwYXJzZURhdGEoKVxuXG4gIHBhcnNlRGF0YTogLT5cbiAgICBtaWdyYXRpb25zID0gQGRhdGEubWFwIChtaWdyYXRpb24pIC0+XG4gICAgICBbLi4uLCBuYW1lXSA9IG1pZ3JhdGlvbi5zcGxpdCgnLycpXG5cbiAgICAgIHsgbmFtZTogbmFtZSwgZmlsZTogbWlncmF0aW9uIH1cblxuICAgIEBzZXRJdGVtcyBtaWdyYXRpb25zXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICduYW1lJ1xuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7bmFtZX0pIC0+XG4gICAgJCQgLT4gQGxpKG5hbWUpXG5cbiAgY29uZmlybWVkOiAoe2ZpbGV9KSAtPiAgICBcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUpXG4gICAgQGNhbmNlbCgpXG4iXX0=
