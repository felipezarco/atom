(function() {
  var MigrationListView, Path, fs;

  fs = require('fs');

  Path = require('path');

  MigrationListView = require('./migration-list-view');

  module.exports = {
    activate: function() {
      return atom.commands.add("atom-workspace", {
        "rails-latest-migration:find": (function(_this) {
          return function() {
            return _this.find();
          };
        })(this),
        "rails-latest-migration:list": (function(_this) {
          return function() {
            return _this.list();
          };
        })(this)
      });
    },
    find: function() {
      return this.fetchListOfMigrations(function(migrations) {
        var latest_migration_path;
        latest_migration_path = migrations[0];
        return atom.workspace.open(latest_migration_path);
      });
    },
    list: function() {
      return this.fetchListOfMigrations(function(files) {
        return new MigrationListView(files);
      });
    },
    fetchListOfMigrations: function(callback) {
      var dir, files;
      dir = atom.project.getDirectories()[0];
      if (this.isRailsDir(dir)) {
        files = this.getListOfMigrations(dir);
        if (files.length > 0) {
          return callback(files);
        } else {
          return alert("Uh oh! Could not find any migrations in your db/migrate directory. Please add some and try again.");
        }
      } else {
        return alert("Uh oh! This doesn't look like a Rails project. Please open a Rails project and try again.");
      }
    },
    isRailsDir: function(dir) {
      var entries, expected_rails_files, matching_dirs;
      expected_rails_files = ['app', 'db', 'config', 'Gemfile'];
      entries = dir.getEntriesSync();
      matching_dirs = [];
      entries.forEach(function(entry) {
        if (expected_rails_files.indexOf(entry.getBaseName()) > -1) {
          return matching_dirs.push(entry);
        }
      });
      return expected_rails_files.length === matching_dirs.length;
    },
    getMigrationsDir: function(dir) {
      return Path.join(dir.getPath(), 'db', 'migrate');
    },
    getListOfMigrations: function(dir) {
      var files, migrations_dir;
      migrations_dir = this.getMigrationsDir(dir);
      files = fs.readdirSync(migrations_dir).filter(function(elem) {
        var stat;
        stat = fs.statSync(Path.join(migrations_dir, elem));
        return stat.isFile();
      });
      return files.reverse().map(function(file) {
        return Path.join(migrations_dir, file);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3JhaWxzLWxhdGVzdC1taWdyYXRpb24vbGliL3JhaWxzLWxhdGVzdC1taWdyYXRpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUjs7RUFFcEIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNFO1FBQUEsNkJBQUEsRUFBK0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9CO1FBQ0EsNkJBQUEsRUFBK0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRC9CO09BREY7SUFEUSxDQUFWO0lBS0EsSUFBQSxFQUFNLFNBQUE7YUFDSixJQUFDLENBQUEscUJBQUQsQ0FBdUIsU0FBQyxVQUFEO0FBQ3JCLFlBQUE7UUFBQSxxQkFBQSxHQUF3QixVQUFXLENBQUEsQ0FBQTtlQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IscUJBQXBCO01BRnFCLENBQXZCO0lBREksQ0FMTjtJQVVBLElBQUEsRUFBTSxTQUFBO2FBQ0osSUFBQyxDQUFBLHFCQUFELENBQXVCLFNBQUMsS0FBRDtlQUNyQixJQUFJLGlCQUFKLENBQXNCLEtBQXRCO01BRHFCLENBQXZCO0lBREksQ0FWTjtJQWNBLHFCQUFBLEVBQXVCLFNBQUMsUUFBRDtBQUNyQixVQUFBO01BQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUFBLENBQThCLENBQUEsQ0FBQTtNQUVwQyxJQUFHLElBQUMsQ0FBQSxVQUFELENBQVksR0FBWixDQUFIO1FBQ0UsS0FBQSxHQUFRLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixHQUFyQjtRQUVSLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjtpQkFDRSxRQUFBLENBQVMsS0FBVCxFQURGO1NBQUEsTUFBQTtpQkFHRSxLQUFBLENBQU0sbUdBQU4sRUFIRjtTQUhGO09BQUEsTUFBQTtlQVFFLEtBQUEsQ0FBTSwyRkFBTixFQVJGOztJQUhxQixDQWR2QjtJQTJCQSxVQUFBLEVBQVksU0FBQyxHQUFEO0FBQ1YsVUFBQTtNQUFBLG9CQUFBLEdBQXVCLENBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxRQUFkLEVBQXdCLFNBQXhCO01BQ3ZCLE9BQUEsR0FBVSxHQUFHLENBQUMsY0FBSixDQUFBO01BQ1YsYUFBQSxHQUFnQjtNQUVoQixPQUFPLENBQUMsT0FBUixDQUFnQixTQUFDLEtBQUQ7UUFDZCxJQUFHLG9CQUFvQixDQUFDLE9BQXJCLENBQTZCLEtBQUssQ0FBQyxXQUFOLENBQUEsQ0FBN0IsQ0FBQSxHQUFvRCxDQUFDLENBQXhEO2lCQUNFLGFBQWEsQ0FBQyxJQUFkLENBQW1CLEtBQW5CLEVBREY7O01BRGMsQ0FBaEI7QUFJQSxhQUFPLG9CQUFvQixDQUFDLE1BQXJCLEtBQStCLGFBQWEsQ0FBQztJQVQxQyxDQTNCWjtJQXNDQSxnQkFBQSxFQUFrQixTQUFDLEdBQUQ7YUFDaEIsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFHLENBQUMsT0FBSixDQUFBLENBQVYsRUFBeUIsSUFBekIsRUFBK0IsU0FBL0I7SUFEZ0IsQ0F0Q2xCO0lBeUNBLG1CQUFBLEVBQXFCLFNBQUMsR0FBRDtBQUNuQixVQUFBO01BQUEsY0FBQSxHQUFpQixJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsR0FBbEI7TUFFakIsS0FBQSxHQUFRLEVBQUUsQ0FBQyxXQUFILENBQWUsY0FBZixDQUE4QixDQUFDLE1BQS9CLENBQXNDLFNBQUMsSUFBRDtBQUM1QyxZQUFBO1FBQUEsSUFBQSxHQUFPLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBSSxDQUFDLElBQUwsQ0FBVSxjQUFWLEVBQTBCLElBQTFCLENBQVo7QUFDUCxlQUFPLElBQUksQ0FBQyxNQUFMLENBQUE7TUFGcUMsQ0FBdEM7YUFJUixLQUFLLENBQUMsT0FBTixDQUFBLENBQWUsQ0FBQyxHQUFoQixDQUFvQixTQUFDLElBQUQ7ZUFDbEIsSUFBSSxDQUFDLElBQUwsQ0FBVSxjQUFWLEVBQTBCLElBQTFCO01BRGtCLENBQXBCO0lBUG1CLENBekNyQjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXG5QYXRoID0gcmVxdWlyZSAncGF0aCdcbk1pZ3JhdGlvbkxpc3RWaWV3ID0gcmVxdWlyZSAnLi9taWdyYXRpb24tbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAtPlxuICAgIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIixcbiAgICAgIFwicmFpbHMtbGF0ZXN0LW1pZ3JhdGlvbjpmaW5kXCI6ID0+IEBmaW5kKCksXG4gICAgICBcInJhaWxzLWxhdGVzdC1taWdyYXRpb246bGlzdFwiOiA9PiBAbGlzdCgpXG5cbiAgZmluZDogLT5cbiAgICBAZmV0Y2hMaXN0T2ZNaWdyYXRpb25zIChtaWdyYXRpb25zKSAtPlxuICAgICAgbGF0ZXN0X21pZ3JhdGlvbl9wYXRoID0gbWlncmF0aW9uc1swXVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihsYXRlc3RfbWlncmF0aW9uX3BhdGgpXG5cbiAgbGlzdDogLT5cbiAgICBAZmV0Y2hMaXN0T2ZNaWdyYXRpb25zIChmaWxlcykgLT5cbiAgICAgIG5ldyBNaWdyYXRpb25MaXN0VmlldyhmaWxlcylcblxuICBmZXRjaExpc3RPZk1pZ3JhdGlvbnM6IChjYWxsYmFjaykgLT5cbiAgICBkaXIgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXVxuXG4gICAgaWYgQGlzUmFpbHNEaXIoZGlyKVxuICAgICAgZmlsZXMgPSBAZ2V0TGlzdE9mTWlncmF0aW9ucyhkaXIpXG5cbiAgICAgIGlmIGZpbGVzLmxlbmd0aCA+IDBcbiAgICAgICAgY2FsbGJhY2soZmlsZXMpXG4gICAgICBlbHNlXG4gICAgICAgIGFsZXJ0IFwiVWggb2ghIENvdWxkIG5vdCBmaW5kIGFueSBtaWdyYXRpb25zIGluIHlvdXIgZGIvbWlncmF0ZSBkaXJlY3RvcnkuIFBsZWFzZSBhZGQgc29tZSBhbmQgdHJ5IGFnYWluLlwiXG4gICAgZWxzZVxuICAgICAgYWxlcnQgXCJVaCBvaCEgVGhpcyBkb2Vzbid0IGxvb2sgbGlrZSBhIFJhaWxzIHByb2plY3QuIFBsZWFzZSBvcGVuIGEgUmFpbHMgcHJvamVjdCBhbmQgdHJ5IGFnYWluLlwiXG5cbiAgaXNSYWlsc0RpcjogKGRpcikgLT5cbiAgICBleHBlY3RlZF9yYWlsc19maWxlcyA9IFsnYXBwJywgJ2RiJywgJ2NvbmZpZycsICdHZW1maWxlJ11cbiAgICBlbnRyaWVzID0gZGlyLmdldEVudHJpZXNTeW5jKClcbiAgICBtYXRjaGluZ19kaXJzID0gW11cblxuICAgIGVudHJpZXMuZm9yRWFjaCAoZW50cnkpIC0+XG4gICAgICBpZiBleHBlY3RlZF9yYWlsc19maWxlcy5pbmRleE9mKGVudHJ5LmdldEJhc2VOYW1lKCkpID4gLTFcbiAgICAgICAgbWF0Y2hpbmdfZGlycy5wdXNoKGVudHJ5KVxuXG4gICAgcmV0dXJuIGV4cGVjdGVkX3JhaWxzX2ZpbGVzLmxlbmd0aCA9PSBtYXRjaGluZ19kaXJzLmxlbmd0aFxuXG4gIGdldE1pZ3JhdGlvbnNEaXI6IChkaXIpIC0+XG4gICAgUGF0aC5qb2luKGRpci5nZXRQYXRoKCksICdkYicsICdtaWdyYXRlJylcblxuICBnZXRMaXN0T2ZNaWdyYXRpb25zOiAoZGlyKSAtPlxuICAgIG1pZ3JhdGlvbnNfZGlyID0gQGdldE1pZ3JhdGlvbnNEaXIoZGlyKVxuXG4gICAgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhtaWdyYXRpb25zX2RpcikuZmlsdGVyIChlbGVtKSAtPlxuICAgICAgc3RhdCA9IGZzLnN0YXRTeW5jKFBhdGguam9pbihtaWdyYXRpb25zX2RpciwgZWxlbSkpXG4gICAgICByZXR1cm4gc3RhdC5pc0ZpbGUoKVxuXG4gICAgZmlsZXMucmV2ZXJzZSgpLm1hcCAoZmlsZSkgLT5cbiAgICAgIFBhdGguam9pbihtaWdyYXRpb25zX2RpciwgZmlsZSlcbiJdfQ==
