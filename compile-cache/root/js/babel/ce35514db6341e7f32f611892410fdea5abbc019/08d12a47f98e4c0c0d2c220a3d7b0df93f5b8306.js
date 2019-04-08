"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var DEFAULT_CONFIG = undefined;
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
var SPLIT_REG_EXP = undefined;

exports.SPLIT_REG_EXP = SPLIT_REG_EXP;
var watcher = undefined;

/**
 * @param {String[]} splits
 * @returns {RegExp} a set of `splits` with escaped symbols
 */
var escapeArrayToRegExp = function escapeArrayToRegExp(splits) {
  var reg = [].concat(_toConsumableArray(new Set(splits))).map(function (c) {
    return c.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }).join("|");

  return new RegExp(reg);
};

/**
 * @param {Object} newValue
 * @param {Object} newValue.defaults
 * @param {Object} newValue.commands
 */
function updateConfig(newValue) {
  newValue = Object.assign({}, newValue);
  var _newValue = newValue;
  var defaults = _newValue.defaults;
  var commands = _newValue.commands;

  defaults.unitType = ({
    Paragraph: "paragraph",
    Sentence: "sentence",
    Word: "word",
    Link: "link",
    "Ordered List": "orderedList",
    "Unordered List": "unorderedList"
  })[defaults.unitType];
  defaults.unitSize = ({
    Any: 0,
    Short: 1,
    Medium: 2,
    Long: 3,
    "Very Long": 4
  })[defaults.unitSize];

  exports.DEFAULT_CONFIG = DEFAULT_CONFIG = defaults;
  exports.SPLIT_REG_EXP = SPLIT_REG_EXP = escapeArrayToRegExp(commands.splitRegExp);
}

// When package is activated add watcher to observe config change
atom.packages.onDidActivatePackage(function (pack) {
  if (pack.name === "lorem") {
    watcher = atom.config.observe("lorem", updateConfig);
  }
});

// When package deactivated remove config watcher
atom.packages.onDidDeactivatePackage(function (pack) {
  if (pack.name === "lorem") {
    watcher.dispose();
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sb3JlbS9saWIvY29uZmlnLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7OztBQUVMLElBQUksY0FBYyxZQUFBLENBQUM7O0FBQ25CLElBQUksYUFBYSxZQUFBLENBQUM7OztBQUV6QixJQUFJLE9BQU8sWUFBQSxDQUFDOzs7Ozs7QUFNWixJQUFNLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFtQixDQUFHLE1BQU0sRUFBSTtBQUNwQyxNQUFNLEdBQUcsR0FBRyw2QkFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FDNUIsR0FBRyxDQUFDLFVBQUEsQ0FBQztXQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsbUNBQW1DLEVBQUUsTUFBTSxDQUFDO0dBQUEsQ0FBQyxDQUNoRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWIsU0FBTyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUN4QixDQUFDOzs7Ozs7O0FBT0YsU0FBUyxZQUFZLENBQUMsUUFBUSxFQUFFO0FBQzlCLFVBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztrQkFDUixRQUFRO01BQS9CLFFBQVEsYUFBUixRQUFRO01BQUUsUUFBUSxhQUFSLFFBQVE7O0FBRTFCLFVBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQTtBQUNsQixhQUFTLEVBQUUsV0FBVztBQUN0QixZQUFRLEVBQUUsVUFBVTtBQUNwQixRQUFJLEVBQUUsTUFBTTtBQUNaLFFBQUksRUFBRSxNQUFNO0FBQ1osa0JBQWMsRUFBRSxhQUFhO0FBQzdCLG9CQUFnQixFQUFFLGVBQWU7SUFDbEMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckIsVUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFBO0FBQ2xCLE9BQUcsRUFBRSxDQUFDO0FBQ04sU0FBSyxFQUFFLENBQUM7QUFDUixVQUFNLEVBQUUsQ0FBQztBQUNULFFBQUksRUFBRSxDQUFDO0FBQ1AsZUFBVyxFQUFFLENBQUM7SUFDZixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFckIsVUExQ1MsY0FBYyxHQTBDdkIsY0FBYyxHQUFHLFFBQVEsQ0FBQztBQUMxQixVQTFDUyxhQUFhLEdBMEN0QixhQUFhLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0NBQzNEOzs7QUFHRCxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3pDLE1BQUksSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7QUFDekIsV0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztHQUN0RDtDQUNGLENBQUMsQ0FBQzs7O0FBR0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFBLElBQUksRUFBSTtBQUMzQyxNQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO0FBQ3pCLFdBQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNuQjtDQUNGLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvbG9yZW0vbGliL2NvbmZpZy1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuZXhwb3J0IGxldCBERUZBVUxUX0NPTkZJRztcbmV4cG9ydCBsZXQgU1BMSVRfUkVHX0VYUDtcblxubGV0IHdhdGNoZXI7XG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmdbXX0gc3BsaXRzXG4gKiBAcmV0dXJucyB7UmVnRXhwfSBhIHNldCBvZiBgc3BsaXRzYCB3aXRoIGVzY2FwZWQgc3ltYm9sc1xuICovXG5jb25zdCBlc2NhcGVBcnJheVRvUmVnRXhwID0gc3BsaXRzID0+IHtcbiAgY29uc3QgcmVnID0gWy4uLm5ldyBTZXQoc3BsaXRzKV1cbiAgICAubWFwKGMgPT4gYy5yZXBsYWNlKC9bXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIikpXG4gICAgLmpvaW4oXCJ8XCIpO1xuXG4gIHJldHVybiBuZXcgUmVnRXhwKHJlZyk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBuZXdWYWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG5ld1ZhbHVlLmRlZmF1bHRzXG4gKiBAcGFyYW0ge09iamVjdH0gbmV3VmFsdWUuY29tbWFuZHNcbiAqL1xuZnVuY3Rpb24gdXBkYXRlQ29uZmlnKG5ld1ZhbHVlKSB7XG4gIG5ld1ZhbHVlID0gT2JqZWN0LmFzc2lnbih7fSwgbmV3VmFsdWUpO1xuICBjb25zdCB7IGRlZmF1bHRzLCBjb21tYW5kcyB9ID0gbmV3VmFsdWU7XG5cbiAgZGVmYXVsdHMudW5pdFR5cGUgPSB7XG4gICAgUGFyYWdyYXBoOiBcInBhcmFncmFwaFwiLFxuICAgIFNlbnRlbmNlOiBcInNlbnRlbmNlXCIsXG4gICAgV29yZDogXCJ3b3JkXCIsXG4gICAgTGluazogXCJsaW5rXCIsXG4gICAgXCJPcmRlcmVkIExpc3RcIjogXCJvcmRlcmVkTGlzdFwiLFxuICAgIFwiVW5vcmRlcmVkIExpc3RcIjogXCJ1bm9yZGVyZWRMaXN0XCIsXG4gIH1bZGVmYXVsdHMudW5pdFR5cGVdO1xuICBkZWZhdWx0cy51bml0U2l6ZSA9IHtcbiAgICBBbnk6IDAsXG4gICAgU2hvcnQ6IDEsXG4gICAgTWVkaXVtOiAyLFxuICAgIExvbmc6IDMsXG4gICAgXCJWZXJ5IExvbmdcIjogNCxcbiAgfVtkZWZhdWx0cy51bml0U2l6ZV07XG5cbiAgREVGQVVMVF9DT05GSUcgPSBkZWZhdWx0cztcbiAgU1BMSVRfUkVHX0VYUCA9IGVzY2FwZUFycmF5VG9SZWdFeHAoY29tbWFuZHMuc3BsaXRSZWdFeHApO1xufVxuXG4vLyBXaGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkIGFkZCB3YXRjaGVyIHRvIG9ic2VydmUgY29uZmlnIGNoYW5nZVxuYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZShwYWNrID0+IHtcbiAgaWYgKHBhY2submFtZSA9PT0gXCJsb3JlbVwiKSB7XG4gICAgd2F0Y2hlciA9IGF0b20uY29uZmlnLm9ic2VydmUoXCJsb3JlbVwiLCB1cGRhdGVDb25maWcpO1xuICB9XG59KTtcblxuLy8gV2hlbiBwYWNrYWdlIGRlYWN0aXZhdGVkIHJlbW92ZSBjb25maWcgd2F0Y2hlclxuYXRvbS5wYWNrYWdlcy5vbkRpZERlYWN0aXZhdGVQYWNrYWdlKHBhY2sgPT4ge1xuICBpZiAocGFjay5uYW1lID09PSBcImxvcmVtXCIpIHtcbiAgICB3YXRjaGVyLmRpc3Bvc2UoKTtcbiAgfVxufSk7XG4iXX0=