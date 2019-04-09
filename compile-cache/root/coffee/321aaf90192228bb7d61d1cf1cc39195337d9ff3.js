(function() {
  var ComboApi;

  module.exports = ComboApi = (function() {
    function ComboApi(comboRenderer) {
      this.combo = comboRenderer;
    }

    ComboApi.prototype.increase = function(n) {
      if (n == null) {
        n = 1;
      }
      if (this.combo.isEnable) {
        return this.combo.modifyStreak(n);
      }
    };

    ComboApi.prototype.decrease = function(n) {
      if (n == null) {
        n = 1;
      }
      if (this.combo.isEnable) {
        return this.combo.modifyStreak(-n);
      }
    };

    ComboApi.prototype.exclame = function(word, type) {
      if (word == null) {
        word = null;
      }
      if (type == null) {
        type = null;
      }
      if (this.combo.isEnable) {
        return this.combo.showExclamation(word, type);
      }
    };

    ComboApi.prototype.resetCounter = function() {
      if (this.combo.isEnable) {
        return this.combo.resetCounter();
      }
    };

    ComboApi.prototype.getLevel = function() {
      if (this.combo.isEnable) {
        return this.combo.getLevel();
      } else {
        return null;
      }
    };

    ComboApi.prototype.getCurrentStreak = function() {
      if (this.combo.isEnable) {
        return this.combo.getCurrentStreak();
      } else {
        return null;
      }
    };

    ComboApi.prototype.isEnable = function() {
      return this.combo.isEnable;
    };

    return ComboApi;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3NlcnZpY2UvY29tYm8tYXBpLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7SUFDUixrQkFBQyxhQUFEO01BQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUztJQURFOzt1QkFHYixRQUFBLEdBQVUsU0FBQyxDQUFEOztRQUFDLElBQUk7O01BQ2IsSUFBeUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFoQztlQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsWUFBUCxDQUFvQixDQUFwQixFQUFBOztJQURROzt1QkFHVixRQUFBLEdBQVUsU0FBQyxDQUFEOztRQUFDLElBQUk7O01BQ2IsSUFBMkIsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFsQztlQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsWUFBUCxDQUFvQixDQUFDLENBQXJCLEVBQUE7O0lBRFE7O3VCQUdWLE9BQUEsR0FBUyxTQUFDLElBQUQsRUFBYyxJQUFkOztRQUFDLE9BQU87OztRQUFNLE9BQU87O01BQzVCLElBQXFDLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBNUM7ZUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLGVBQVAsQ0FBdUIsSUFBdkIsRUFBNkIsSUFBN0IsRUFBQTs7SUFETzs7dUJBR1QsWUFBQSxHQUFjLFNBQUE7TUFDWixJQUF5QixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQWhDO2VBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxZQUFQLENBQUEsRUFBQTs7SUFEWTs7dUJBR2QsUUFBQSxHQUFVLFNBQUE7TUFDUixJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBVjtlQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsS0FIRjs7SUFEUTs7dUJBTVYsZ0JBQUEsR0FBa0IsU0FBQTtNQUNoQixJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBVjtlQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsZ0JBQVAsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLEtBSEY7O0lBRGdCOzt1QkFNbEIsUUFBQSxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsS0FBSyxDQUFDO0lBREM7Ozs7O0FBNUJaIiwic291cmNlc0NvbnRlbnQiOlsiXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENvbWJvQXBpXG4gIGNvbnN0cnVjdG9yOiAoY29tYm9SZW5kZXJlcikgLT5cbiAgICBAY29tYm8gPSBjb21ib1JlbmRlcmVyXG5cbiAgaW5jcmVhc2U6IChuID0gMSkgLT5cbiAgICBAY29tYm8ubW9kaWZ5U3RyZWFrIG4gaWYgQGNvbWJvLmlzRW5hYmxlXG5cbiAgZGVjcmVhc2U6IChuID0gMSkgLT5cbiAgICBAY29tYm8ubW9kaWZ5U3RyZWFrKC1uKSBpZiBAY29tYm8uaXNFbmFibGVcblxuICBleGNsYW1lOiAod29yZCA9IG51bGwsIHR5cGUgPSBudWxsKSAtPlxuICAgIEBjb21iby5zaG93RXhjbGFtYXRpb24gd29yZCwgdHlwZSBpZiBAY29tYm8uaXNFbmFibGVcblxuICByZXNldENvdW50ZXI6IC0+XG4gICAgQGNvbWJvLnJlc2V0Q291bnRlcigpIGlmIEBjb21iby5pc0VuYWJsZVxuXG4gIGdldExldmVsOiAtPlxuICAgIGlmIEBjb21iby5pc0VuYWJsZVxuICAgICAgQGNvbWJvLmdldExldmVsKClcbiAgICBlbHNlXG4gICAgICBudWxsXG5cbiAgZ2V0Q3VycmVudFN0cmVhazogLT5cbiAgICBpZiBAY29tYm8uaXNFbmFibGVcbiAgICAgIEBjb21iby5nZXRDdXJyZW50U3RyZWFrKClcbiAgICBlbHNlXG4gICAgICBudWxsXG4gICAgICBcbiAgaXNFbmFibGU6IC0+XG4gICAgQGNvbWJvLmlzRW5hYmxlXG4iXX0=
