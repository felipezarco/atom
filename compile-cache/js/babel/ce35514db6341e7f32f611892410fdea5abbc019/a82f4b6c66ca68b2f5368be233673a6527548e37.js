Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sizedArray = sizedArray;
exports.randNth = randNth;
exports.wordWrap = wordWrap;
exports.errorMsg = errorMsg;
exports.displayConfigTable = displayConfigTable;

var _configManager = require("./config-manager");

/**
 * @param {Number} [size = 0]
 * @param {*} [fn = undefined]
 * @returns {Array} will return an array of length `size` if `fn` is not defined the array will contain empty values. If `fn` is a function each value will be mapped by `fn` else if `fn` is not a function the value of `fn` will be used to fill the returned array.
 */
"use babel";

function sizedArray() {
  var size = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
  var fn = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

  var arr = Array.apply(null, Array(size));
  return fn !== undefined ? typeof fn === "function" ? arr.map(fn) : arr.fill(fn) : arr;
}

/**
 * returns a random element from `arr`
 * @param {Array} arr
 * @returns {*} random element of `arr`
 */

function randNth(arr) {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * from http://james.padolsey.com/javascript/wordwrap-for-javascript/ wraps `str` with `split` when width exceeds `width`
 * @param {String} str
 * @param {Number} [width = config.wrapWidth]
 * @param {String} [split = "\n"]
 * @returns {String} `str` wrapped when it exceeds `width` using `brk` string
 */

function wordWrap(str) {
  var width = arguments.length <= 1 || arguments[1] === undefined ? _configManager.DEFAULT_CONFIG.wrapWidth : arguments[1];
  var split = arguments.length <= 2 || arguments[2] === undefined ? "\n" : arguments[2];

  if (!str) return false;
  var regex = ".{1," + width + "}(\\s|$)|\\S+?(\\s|$)";
  return str.match(new RegExp(regex, "g")).join(split);
}

/**
 * Create an atom warning notification and return null
 * @param {String} errorMsg
 * @returns {Null}
 */

function errorMsg(errorMsg) {
  var notifs = atom.workspace.notificationManager;
  notifs.addWarning("Lorem Error:", {
    detail: errorMsg
  });
  return null;
}

/**
 * logs a table to the console to display the configuration
 * @param {Object} conf
 */

function displayConfigTable(conf) {
  // Only log the table if in devMode and not in specMode
  if (atom.inDevMode() && !atom.inSpecMode()) {
    var table = Object.keys(conf).map(function (key) {
      return { "Config Option": key, "Config Value": conf[key] };
    });
    console.table(table);
  }
}

/**
 * compose a list of functions on an initial value
 * @param {...Function} fns
 * @param {*} initial
 * @return {*} returns the result of threading initial through fns
 */
var compose = function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (initial) {
    return fns.reduce(function (res, fn) {
      return fn(res);
    }, initial);
  };
};

exports.compose = compose;
/**
 * @param {String} sentence
 * @returns {String} sentence with capital letter and period
 */
var sentenceCase = function sentenceCase(sentence) {
  return sentence.replace(/\b\w/, function (s) {
    return s.toUpperCase();
  }) + ". ";
};
exports.sentenceCase = sentenceCase;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sb3JlbS9saWIvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7NkJBRXlDLGtCQUFrQjs7Ozs7OztBQUYzRCxXQUFXLENBQUM7O0FBU0wsU0FBUyxVQUFVLEdBQTJCO01BQTFCLElBQUkseURBQUcsQ0FBQztNQUFFLEVBQUUseURBQUcsU0FBUzs7QUFDakQsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDM0MsU0FBTyxFQUFFLEtBQUssU0FBUyxHQUNuQixPQUFPLEVBQUUsS0FBSyxVQUFVLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUNyRCxHQUFHLENBQUM7Q0FDVDs7Ozs7Ozs7QUFPTSxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JELFNBQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQ25COzs7Ozs7Ozs7O0FBU00sU0FBUyxRQUFRLENBQUMsR0FBRyxFQUEwQztNQUF4QyxLQUFLLHlEQUFHLDhCQUFPLFNBQVM7TUFBRSxLQUFLLHlEQUFHLElBQUk7O0FBQ2xFLE1BQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDdkIsTUFBTSxLQUFLLFlBQVUsS0FBSywwQkFBdUIsQ0FBQztBQUNsRCxTQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQ3REOzs7Ozs7OztBQU9NLFNBQVMsUUFBUSxDQUFDLFFBQVEsRUFBRTtBQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDO0FBQ2xELFFBQU0sQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFO0FBQ2hDLFVBQU0sRUFBRSxRQUFRO0dBQ2pCLENBQUMsQ0FBQztBQUNILFNBQU8sSUFBSSxDQUFDO0NBQ2I7Ozs7Ozs7QUFNTSxTQUFTLGtCQUFrQixDQUFDLElBQUksRUFBRTs7QUFFdkMsTUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDMUMsUUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDekMsYUFBTyxFQUFFLGVBQWUsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0tBQzVELENBQUMsQ0FBQztBQUNILFdBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDdEI7Q0FDRjs7Ozs7Ozs7QUFRTSxJQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU87b0NBQU8sR0FBRztBQUFILE9BQUc7OztTQUFLLFVBQUEsT0FBTztXQUN4QyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLEVBQUU7YUFBSyxFQUFFLENBQUMsR0FBRyxDQUFDO0tBQUEsRUFBRSxPQUFPLENBQUM7R0FBQTtDQUFBLENBQUM7Ozs7Ozs7QUFNckMsSUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQUcsUUFBUTtTQUNsQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFBLENBQUM7V0FBSSxDQUFDLENBQUMsV0FBVyxFQUFFO0dBQUEsQ0FBQyxHQUFHLElBQUk7Q0FBQSxDQUFDIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sb3JlbS9saWIvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCB7IERFRkFVTFRfQ09ORklHIGFzIGNvbmZpZyB9IGZyb20gXCIuL2NvbmZpZy1tYW5hZ2VyXCI7XG5cbi8qKlxuICogQHBhcmFtIHtOdW1iZXJ9IFtzaXplID0gMF1cbiAqIEBwYXJhbSB7Kn0gW2ZuID0gdW5kZWZpbmVkXVxuICogQHJldHVybnMge0FycmF5fSB3aWxsIHJldHVybiBhbiBhcnJheSBvZiBsZW5ndGggYHNpemVgIGlmIGBmbmAgaXMgbm90IGRlZmluZWQgdGhlIGFycmF5IHdpbGwgY29udGFpbiBlbXB0eSB2YWx1ZXMuIElmIGBmbmAgaXMgYSBmdW5jdGlvbiBlYWNoIHZhbHVlIHdpbGwgYmUgbWFwcGVkIGJ5IGBmbmAgZWxzZSBpZiBgZm5gIGlzIG5vdCBhIGZ1bmN0aW9uIHRoZSB2YWx1ZSBvZiBgZm5gIHdpbGwgYmUgdXNlZCB0byBmaWxsIHRoZSByZXR1cm5lZCBhcnJheS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpemVkQXJyYXkoc2l6ZSA9IDAsIGZuID0gdW5kZWZpbmVkKSB7XG4gIGNvbnN0IGFyciA9IEFycmF5LmFwcGx5KG51bGwsIEFycmF5KHNpemUpKTtcbiAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWRcbiAgICA/IHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiID8gYXJyLm1hcChmbikgOiBhcnIuZmlsbChmbilcbiAgICA6IGFycjtcbn1cblxuLyoqXG4gKiByZXR1cm5zIGEgcmFuZG9tIGVsZW1lbnQgZnJvbSBgYXJyYFxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcmV0dXJucyB7Kn0gcmFuZG9tIGVsZW1lbnQgb2YgYGFycmBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmROdGgoYXJyKSB7XG4gIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyLmxlbmd0aCk7XG4gIHJldHVybiBhcnJbaW5kZXhdO1xufVxuXG4vKipcbiAqIGZyb20gaHR0cDovL2phbWVzLnBhZG9sc2V5LmNvbS9qYXZhc2NyaXB0L3dvcmR3cmFwLWZvci1qYXZhc2NyaXB0LyB3cmFwcyBgc3RyYCB3aXRoIGBzcGxpdGAgd2hlbiB3aWR0aCBleGNlZWRzIGB3aWR0aGBcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBbd2lkdGggPSBjb25maWcud3JhcFdpZHRoXVxuICogQHBhcmFtIHtTdHJpbmd9IFtzcGxpdCA9IFwiXFxuXCJdXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBgc3RyYCB3cmFwcGVkIHdoZW4gaXQgZXhjZWVkcyBgd2lkdGhgIHVzaW5nIGBicmtgIHN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gd29yZFdyYXAoc3RyLCB3aWR0aCA9IGNvbmZpZy53cmFwV2lkdGgsIHNwbGl0ID0gXCJcXG5cIikge1xuICBpZiAoIXN0cikgcmV0dXJuIGZhbHNlO1xuICBjb25zdCByZWdleCA9IGAuezEsJHt3aWR0aH19KFxcXFxzfCQpfFxcXFxTKz8oXFxcXHN8JClgO1xuICByZXR1cm4gc3RyLm1hdGNoKG5ldyBSZWdFeHAocmVnZXgsIFwiZ1wiKSkuam9pbihzcGxpdCk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGFuIGF0b20gd2FybmluZyBub3RpZmljYXRpb24gYW5kIHJldHVybiBudWxsXG4gKiBAcGFyYW0ge1N0cmluZ30gZXJyb3JNc2dcbiAqIEByZXR1cm5zIHtOdWxsfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXJyb3JNc2coZXJyb3JNc2cpIHtcbiAgY29uc3Qgbm90aWZzID0gYXRvbS53b3Jrc3BhY2Uubm90aWZpY2F0aW9uTWFuYWdlcjtcbiAgbm90aWZzLmFkZFdhcm5pbmcoXCJMb3JlbSBFcnJvcjpcIiwge1xuICAgIGRldGFpbDogZXJyb3JNc2csXG4gIH0pO1xuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBsb2dzIGEgdGFibGUgdG8gdGhlIGNvbnNvbGUgdG8gZGlzcGxheSB0aGUgY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlDb25maWdUYWJsZShjb25mKSB7XG4gIC8vIE9ubHkgbG9nIHRoZSB0YWJsZSBpZiBpbiBkZXZNb2RlIGFuZCBub3QgaW4gc3BlY01vZGVcbiAgaWYgKGF0b20uaW5EZXZNb2RlKCkgJiYgIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgY29uc3QgdGFibGUgPSBPYmplY3Qua2V5cyhjb25mKS5tYXAoa2V5ID0+IHtcbiAgICAgIHJldHVybiB7IFwiQ29uZmlnIE9wdGlvblwiOiBrZXksIFwiQ29uZmlnIFZhbHVlXCI6IGNvbmZba2V5XSB9O1xuICAgIH0pO1xuICAgIGNvbnNvbGUudGFibGUodGFibGUpO1xuICB9XG59XG5cbi8qKlxuICogY29tcG9zZSBhIGxpc3Qgb2YgZnVuY3Rpb25zIG9uIGFuIGluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZuc1xuICogQHBhcmFtIHsqfSBpbml0aWFsXG4gKiBAcmV0dXJuIHsqfSByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhyZWFkaW5nIGluaXRpYWwgdGhyb3VnaCBmbnNcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uZm5zKSA9PiBpbml0aWFsID0+XG4gIGZucy5yZWR1Y2UoKHJlcywgZm4pID0+IGZuKHJlcyksIGluaXRpYWwpO1xuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZW50ZW5jZVxuICogQHJldHVybnMge1N0cmluZ30gc2VudGVuY2Ugd2l0aCBjYXBpdGFsIGxldHRlciBhbmQgcGVyaW9kXG4gKi9cbmV4cG9ydCBjb25zdCBzZW50ZW5jZUNhc2UgPSBzZW50ZW5jZSA9PlxuICBzZW50ZW5jZS5yZXBsYWNlKC9cXGJcXHcvLCBzID0+IHMudG9VcHBlckNhc2UoKSkgKyBcIi4gXCI7XG4iXX0=