(function() {
  var os, path;

  path = require("path");

  os = require("os");

  module.exports = {
    title: 'User File',
    description: 'Based on user-file located on user\'s home',
    handle: function(input, switcher, comboLvl) {
      var error, filePath;
      if (this.error) {
        return;
      }
      if (!this.file) {
        filePath = path.join(os.homedir(), '/user-flow');
        try {
          this.file = require(filePath);
        } catch (error1) {
          error = error1;
          atom.notifications.addWarning("File " + filePath + " couldn't be open.");
          this.error = true;
          return;
        }
      }
      return this.file.handle(input, switcher, comboLvl);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2Zsb3cvdXNlci1maWxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsS0FBQSxFQUFPLFdBQVA7SUFDQSxXQUFBLEVBQWEsNENBRGI7SUFHQSxNQUFBLEVBQVEsU0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixRQUFsQjtBQUNOLFVBQUE7TUFBQSxJQUFVLElBQUMsQ0FBQSxLQUFYO0FBQUEsZUFBQTs7TUFDQSxJQUFHLENBQUksSUFBQyxDQUFBLElBQVI7UUFDRSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFFLENBQUMsT0FBSCxDQUFBLENBQVYsRUFBd0IsWUFBeEI7QUFDWDtVQUNFLElBQUMsQ0FBQSxJQUFELEdBQVEsT0FBQSxDQUFRLFFBQVIsRUFEVjtTQUFBLGNBQUE7VUFFTTtVQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsT0FBQSxHQUFRLFFBQVIsR0FBaUIsb0JBQS9DO1VBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztBQUNULGlCQUxGO1NBRkY7O2FBU0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsS0FBYixFQUFvQixRQUFwQixFQUE4QixRQUE5QjtJQVhNLENBSFI7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSBcInBhdGhcIlxub3MgPSByZXF1aXJlIFwib3NcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHRpdGxlOiAnVXNlciBGaWxlJ1xuICBkZXNjcmlwdGlvbjogJ0Jhc2VkIG9uIHVzZXItZmlsZSBsb2NhdGVkIG9uIHVzZXJcXCdzIGhvbWUnXG5cbiAgaGFuZGxlOiAoaW5wdXQsIHN3aXRjaGVyLCBjb21ib0x2bCkgLT5cbiAgICByZXR1cm4gaWYgQGVycm9yXG4gICAgaWYgbm90IEBmaWxlXG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihvcy5ob21lZGlyKCksICcvdXNlci1mbG93JylcbiAgICAgIHRyeVxuICAgICAgICBAZmlsZSA9IHJlcXVpcmUgZmlsZVBhdGhcbiAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFwiRmlsZSAje2ZpbGVQYXRofSBjb3VsZG4ndCBiZSBvcGVuLlwiKVxuICAgICAgICBAZXJyb3IgPSB0cnVlXG4gICAgICAgIHJldHVyblxuXG4gICAgQGZpbGUuaGFuZGxlKGlucHV0LCBzd2l0Y2hlciwgY29tYm9MdmwpXG4iXX0=
