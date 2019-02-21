(function() {
  module.exports = {
    MULTIPLY: function(v1, v2) {
      return v1 * v2 / 255;
    },
    SCREEN: function(v1, v2) {
      return v1 + v2 - (v1 * v2 / 255);
    },
    OVERLAY: function(v1, v2) {
      if (v1 < 128) {
        return 2 * v1 * v2 / 255;
      } else {
        return 255 - (2 * (255 - v1) * (255 - v2) / 255);
      }
    },
    DIFFERENCE: function(v1, v2) {
      return Math.abs(v1 - v2);
    },
    EXCLUSION: function(v1, v2) {
      var cb, cs;
      cb = v1 / 255;
      cs = v2 / 255;
      return (cb + cs - 2 * cb * cs) * 255;
    },
    AVERAGE: function(v1, v2) {
      return (v1 + v2) / 2;
    },
    NEGATION: function(v1, v2) {
      return 255 - Math.abs(v1 + v2 - 255);
    },
    SOFT_LIGHT: function(v1, v2) {
      var cb, cs, d, e;
      cb = v1 / 255;
      cs = v2 / 255;
      d = 1;
      e = cb;
      if (cs > 0.5) {
        e = 1;
        d = cb > 0.25 ? Math.sqrt(cb) : ((16 * cb - 12) * cb + 4) * cb;
      }
      return (cb - ((1 - (2 * cs)) * e * (d - cb))) * 255;
    },
    HARD_LIGHT: function(v1, v2) {
      return module.exports.OVERLAY(v2, v1);
    },
    COLOR_DODGE: function(v1, v2) {
      if (v1 === 255) {
        return v1;
      } else {
        return Math.min(255, (v2 << 8) / (255 - v1));
      }
    },
    COLOR_BURN: function(v1, v2) {
      if (v1 === 0) {
        return v1;
      } else {
        return Math.max(0, 255 - ((255 - v2 << 8) / v1));
      }
    },
    LINEAR_COLOR_DODGE: function(v1, v2) {
      return Math.min(v1 + v2, 255);
    },
    LINEAR_COLOR_BURN: function(v1, v2) {
      if (v1 + v2 < 255) {
        return 0;
      } else {
        return v1 + v2 - 255;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9ibGVuZC1tb2Rlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUMsRUFBRCxFQUFLLEVBQUw7YUFDUixFQUFBLEdBQUssRUFBTCxHQUFVO0lBREYsQ0FBVjtJQUdBLE1BQUEsRUFBUSxTQUFDLEVBQUQsRUFBSyxFQUFMO2FBQ04sRUFBQSxHQUFLLEVBQUwsR0FBVSxDQUFDLEVBQUEsR0FBSyxFQUFMLEdBQVUsR0FBWDtJQURKLENBSFI7SUFNQSxPQUFBLEVBQVMsU0FBQyxFQUFELEVBQUssRUFBTDtNQUNQLElBQUcsRUFBQSxHQUFLLEdBQVI7ZUFDRSxDQUFBLEdBQUksRUFBSixHQUFTLEVBQVQsR0FBYyxJQURoQjtPQUFBLE1BQUE7ZUFHRSxHQUFBLEdBQU0sQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFBLEdBQU0sRUFBUCxDQUFKLEdBQWlCLENBQUMsR0FBQSxHQUFNLEVBQVAsQ0FBakIsR0FBOEIsR0FBL0IsRUFIUjs7SUFETyxDQU5UO0lBWUEsVUFBQSxFQUFZLFNBQUMsRUFBRCxFQUFLLEVBQUw7YUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQUEsR0FBSyxFQUFkO0lBQVosQ0FaWjtJQWNBLFNBQUEsRUFBVyxTQUFDLEVBQUQsRUFBSyxFQUFMO0FBQ1QsVUFBQTtNQUFBLEVBQUEsR0FBSyxFQUFBLEdBQUs7TUFDVixFQUFBLEdBQUssRUFBQSxHQUFLO2FBQ1YsQ0FBQyxFQUFBLEdBQUssRUFBTCxHQUFVLENBQUEsR0FBSSxFQUFKLEdBQVMsRUFBcEIsQ0FBQSxHQUEwQjtJQUhqQixDQWRYO0lBbUJBLE9BQUEsRUFBUyxTQUFDLEVBQUQsRUFBSyxFQUFMO2FBQVksQ0FBQyxFQUFBLEdBQUssRUFBTixDQUFBLEdBQVk7SUFBeEIsQ0FuQlQ7SUFxQkEsUUFBQSxFQUFVLFNBQUMsRUFBRCxFQUFNLEVBQU47YUFBYSxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFBLEdBQUssRUFBTCxHQUFVLEdBQW5CO0lBQW5CLENBckJWO0lBdUJBLFVBQUEsRUFBWSxTQUFDLEVBQUQsRUFBSyxFQUFMO0FBQ1YsVUFBQTtNQUFBLEVBQUEsR0FBSyxFQUFBLEdBQUs7TUFDVixFQUFBLEdBQUssRUFBQSxHQUFLO01BQ1YsQ0FBQSxHQUFJO01BQ0osQ0FBQSxHQUFJO01BRUosSUFBRyxFQUFBLEdBQUssR0FBUjtRQUNFLENBQUEsR0FBSTtRQUNKLENBQUEsR0FBTyxFQUFBLEdBQUssSUFBUixHQUFrQixJQUFJLENBQUMsSUFBTCxDQUFVLEVBQVYsQ0FBbEIsR0FBcUMsQ0FBQyxDQUFDLEVBQUEsR0FBSyxFQUFMLEdBQVUsRUFBWCxDQUFBLEdBQWlCLEVBQWpCLEdBQXNCLENBQXZCLENBQUEsR0FBNEIsR0FGdkU7O2FBSUEsQ0FBQyxFQUFBLEdBQUssQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxFQUFMLENBQUwsQ0FBQSxHQUFpQixDQUFqQixHQUFxQixDQUFDLENBQUEsR0FBSSxFQUFMLENBQXRCLENBQU4sQ0FBQSxHQUF5QztJQVYvQixDQXZCWjtJQW1DQSxVQUFBLEVBQVksU0FBQyxFQUFELEVBQUssRUFBTDthQUNWLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixDQUF1QixFQUF2QixFQUEyQixFQUEzQjtJQURVLENBbkNaO0lBc0NBLFdBQUEsRUFBYSxTQUFDLEVBQUQsRUFBSyxFQUFMO01BQ1gsSUFBRyxFQUFBLEtBQU0sR0FBVDtlQUFrQixHQUFsQjtPQUFBLE1BQUE7ZUFBMEIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULEVBQWMsQ0FBQyxFQUFBLElBQU0sQ0FBUCxDQUFBLEdBQVksQ0FBQyxHQUFBLEdBQU0sRUFBUCxDQUExQixFQUExQjs7SUFEVyxDQXRDYjtJQXlDQSxVQUFBLEVBQVksU0FBQyxFQUFELEVBQUssRUFBTDtNQUNWLElBQUcsRUFBQSxLQUFNLENBQVQ7ZUFBZ0IsR0FBaEI7T0FBQSxNQUFBO2VBQXdCLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLEdBQUEsR0FBTSxDQUFDLENBQUMsR0FBQSxHQUFNLEVBQU4sSUFBWSxDQUFiLENBQUEsR0FBa0IsRUFBbkIsQ0FBbEIsRUFBeEI7O0lBRFUsQ0F6Q1o7SUE0Q0Esa0JBQUEsRUFBb0IsU0FBQyxFQUFELEVBQUssRUFBTDthQUNsQixJQUFJLENBQUMsR0FBTCxDQUFTLEVBQUEsR0FBSyxFQUFkLEVBQWtCLEdBQWxCO0lBRGtCLENBNUNwQjtJQStDQSxpQkFBQSxFQUFtQixTQUFDLEVBQUQsRUFBSyxFQUFMO01BQ2pCLElBQUcsRUFBQSxHQUFLLEVBQUwsR0FBVSxHQUFiO2VBQXNCLEVBQXRCO09BQUEsTUFBQTtlQUE2QixFQUFBLEdBQUssRUFBTCxHQUFVLElBQXZDOztJQURpQixDQS9DbkI7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJcbm1vZHVsZS5leHBvcnRzID1cbiAgTVVMVElQTFk6ICh2MSwgdjIpIC0+XG4gICAgdjEgKiB2MiAvIDI1NVxuXG4gIFNDUkVFTjogKHYxLCB2MikgLT5cbiAgICB2MSArIHYyIC0gKHYxICogdjIgLyAyNTUpXG5cbiAgT1ZFUkxBWTogKHYxLCB2MikgLT5cbiAgICBpZiB2MSA8IDEyOFxuICAgICAgMiAqIHYxICogdjIgLyAyNTVcbiAgICBlbHNlXG4gICAgICAyNTUgLSAoMiAqICgyNTUgLSB2MSkgKiAoMjU1IC0gdjIpIC8gMjU1KVxuXG4gIERJRkZFUkVOQ0U6ICh2MSwgdjIpIC0+IE1hdGguYWJzKHYxIC0gdjIpXG5cbiAgRVhDTFVTSU9OOiAodjEsIHYyKSAtPlxuICAgIGNiID0gdjEgLyAyNTVcbiAgICBjcyA9IHYyIC8gMjU1XG4gICAgKGNiICsgY3MgLSAyICogY2IgKiBjcykgKiAyNTVcblxuICBBVkVSQUdFOiAodjEsIHYyKSAtPiAodjEgKyB2MikgLyAyXG5cbiAgTkVHQVRJT046ICh2MSwgIHYyKSAtPiAyNTUgLSBNYXRoLmFicyh2MSArIHYyIC0gMjU1KVxuXG4gIFNPRlRfTElHSFQ6ICh2MSwgdjIpIC0+XG4gICAgY2IgPSB2MSAvIDI1NVxuICAgIGNzID0gdjIgLyAyNTVcbiAgICBkID0gMVxuICAgIGUgPSBjYlxuXG4gICAgaWYgY3MgPiAwLjVcbiAgICAgIGUgPSAxXG4gICAgICBkID0gaWYgY2IgPiAwLjI1IHRoZW4gTWF0aC5zcXJ0KGNiKSBlbHNlICgoMTYgKiBjYiAtIDEyKSAqIGNiICsgNCkgKiBjYlxuXG4gICAgKGNiIC0gKCgxIC0gKDIgKiBjcykpICogZSAqIChkIC0gY2IpKSkgKiAyNTVcblxuICBIQVJEX0xJR0hUOiAodjEsIHYyKSAtPlxuICAgIG1vZHVsZS5leHBvcnRzLk9WRVJMQVkodjIsIHYxKVxuXG4gIENPTE9SX0RPREdFOiAodjEsIHYyKSAtPlxuICAgIGlmIHYxID09IDI1NSB0aGVuIHYxIGVsc2UgTWF0aC5taW4oMjU1LCAodjIgPDwgOCkgLyAoMjU1IC0gdjEpKVxuXG4gIENPTE9SX0JVUk46ICh2MSwgdjIpIC0+XG4gICAgaWYgdjEgPT0gMCB0aGVuIHYxIGVsc2UgTWF0aC5tYXgoMCwgMjU1IC0gKCgyNTUgLSB2MiA8PCA4KSAvIHYxKSlcblxuICBMSU5FQVJfQ09MT1JfRE9ER0U6ICh2MSwgdjIpIC0+XG4gICAgTWF0aC5taW4gdjEgKyB2MiwgMjU1XG5cbiAgTElORUFSX0NPTE9SX0JVUk46ICh2MSwgdjIpIC0+XG4gICAgaWYgdjEgKyB2MiA8IDI1NSB0aGVuIDAgZWxzZSB2MSArIHYyIC0gMjU1XG4iXX0=
