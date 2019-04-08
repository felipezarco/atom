Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _electron = require("electron");

var _configManager = require("./config-manager");

var _helpers = require("./helpers");

var _words = require("./words");

var w = _interopRequireWildcard(_words);

"use babel";

var LoremIpsum = (function () {
  function LoremIpsum() {
    _classCallCheck(this, LoremIpsum);
  }

  _createClass(LoremIpsum, [{
    key: "getRandomWord",

    /**
     * @param {Number} size
     * @returns {String} Single word from a word list
     */
    value: function getRandomWord(size) {
      return (0, _helpers.randNth)(w.wordLists[size - 1]);
    }

    /**
     * @returns {String} random series of strings
     */
  }, {
    key: "getRandomFragment",
    value: function getRandomFragment() {
      var _this = this;

      return (0, _helpers.randNth)(w.fragmentPatterns).map(function (v) {
        return _this.getRandomWord(v);
      }).join(" ").trim();
    }

    /**
     * @returns {String} connection between words
     */
  }, {
    key: "getSentenceInter",
    value: function getSentenceInter() {
      return Math.random() < 0.5 ? " " + this.getRandomWord(w.SIZE_SHORT) + " " : ", ";
    }

    /**
     * @param {Number} size
     * @returns {String} connect two sentences with an inter connection
     */
  }, {
    key: "getSentenceConnector",
    value: function getSentenceConnector(size) {
      var _this2 = this;

      /** @returns {String} */
      var randSide = function randSide() {
        return _this2.getRandomSentence(size - 1);
      };
      return randSide() + this.getSentenceInter() + randSide();
    }

    /**
     * @param {Number} size
     * @returns {String} random sentence of size
     */
  }, {
    key: "getRandomSentence",
    value: function getRandomSentence(size) {
      switch (size) {
        case w.SIZE_ANY:
          var randomSize = (0, _helpers.randNth)(w.allSizes);
          return this.getRandomSentence(randomSize);
        case w.SIZE_SHORT:
          return this.getRandomFragment();
        case w.SIZE_MEDIUM:
        case w.SIZE_LONG:
        case w.SIZE_VERY_LONG:
          return this.getSentenceConnector(size);
        default:
          return this.getRandomSentence(DEFAULT_UNIT_SIZE);
      }
    }

    /**
     * @param {Number} size
     * @returns {String} random paragraph of size
     */
  }, {
    key: "getRandomParagraph",
    value: function getRandomParagraph(size) {
      var _this3 = this;

      if (size === w.SIZE_ANY) {
        return this.getRandomParagraph(w.DEFAULT_UNIT_SIZE);
      } else if (size === w.SIZE_SHORT) {
        var sentenceCount = Math.floor(Math.random() * 2) + 3;
        return (0, _helpers.sizedArray)(sentenceCount).map(function () {
          return (0, _helpers.sentenceCase)(_this3.getRandomSentence(w.SIZE_ANY));
        }).join("").trim();
      } else {
        return (0, _helpers.sizedArray)(2).map(function () {
          return _this3.getRandomParagraph(size - 1);
        }).join("");
      }
    }

    /**
     * @param {Number} count
     * @param {Number} size
     * @returns {String} string with `count` words of length size
     */
  }, {
    key: "getRandomWords",
    value: function getRandomWords(count, size) {
      var _this4 = this;

      return (0, _helpers.sizedArray)(count).map(function () {
        return _this4.getRandomWord(size);
      }).join(" ").trim();
    }

    /**
     * @param {Number} count
     * @param {Number} size
     * @returns {String} string with count * sentences of length size
     */
  }, {
    key: "getRandomSentences",
    value: function getRandomSentences(count, size) {
      var _this5 = this;

      return (0, _helpers.sizedArray)(count).map(function () {
        return (0, _helpers.sentenceCase)(_this5.getRandomSentence(size));
      }).join("\n\n").trim();
    }

    /**
     * @param {Number} count
     * @param {Number} size
     * @returns {String} string with count * paragraphs of length size
     */
  }, {
    key: "getRandomParagraphs",
    value: function getRandomParagraphs(count, size) {
      var _this6 = this;

      return (0, _helpers.sizedArray)(count).map(function () {
        return _this6.getRandomParagraph(size);
      }).join("\n\n").trim();
    }

    /**
     * @param {Number} count
     * @returns {String} string with `count` * links
     */
  }, {
    key: "getRandomLinks",
    value: function getRandomLinks(count) {
      var _this7 = this;

      return (0, _helpers.sizedArray)(count).map(function () {
        return "<a href=\"" + _configManager.DEFAULT_CONFIG.linkURL + "\">\n" + _this7.getRandomFragment() + "\n</a>";
      }).join("<br/>\n");
    }

    /**
     * @param {Number} count
     * @param {Boolean} isOrdered
     * @returns {String} string with count * list items
     */
  }, {
    key: "getRandomList",
    value: function getRandomList(count, isOrdered) {
      var _this8 = this;

      /**
       * @param {String} str
       * @return {String} ordered or unordered list
       */
      var listType = function listType(str) {
        return isOrdered ? "<ol>\n" + str + "\n</ol>" : "<ul>\n" + str + "\n</ul>";
      };

      return listType((0, _helpers.sizedArray)(count).map(function () {
        return "<li>\n" + _this8.getRandomFragment() + "\n</li>";
      }).join("\n"));
    }

    /**
     * @param {Object} conf
     * @return {String} final text
     */
  }, {
    key: "runCommand",
    value: function runCommand(conf) {
      // make a copy of conf
      conf = Object.assign({}, conf);

      if (conf.showHelp) {
        _electron.shell.openExternal(w.HELP_URL);
        return null;
      }

      var finalText = ({
        paragraph: this.getRandomParagraphs(conf.unitCount, conf.unitSize),
        sentence: this.getRandomSentences(conf.unitCount, conf.unitSize),
        word: this.getRandomWords(conf.unitCount, conf.unitSize),
        link: this.getRandomLinks(conf.unitCount),
        orderedList: this.getRandomList(conf.unitCount, true),
        unorderedList: this.getRandomList(conf.unitCount, false)
      })[conf.unitType] || null;

      // To avoid badly formatted HTML, links and lists are never word wrapped
      if (["link", "orderedList", "unorderedList"].includes(conf.unitType)) {
        conf.isWrapped = false;
      }

      if (conf.isWrapped) {
        finalText = (0, _helpers.wordWrap)(finalText, conf.wrapWidth);
      }

      // Ignore _html option for lists, should never be in paragraphs.
      if (["orderedList", "unorderedList"].includes(conf.unitType)) {
        conf.isHTML = false;
      }

      if (conf.isHTML) {
        if (["paragraph", "sentence"].includes(conf.unitType)) {
          // Wrap each individual paragraph, sentence
          finalText = finalText.replace(/\n{2,}/g, "\n</p>\n<p>\n");
        }
        finalText = "<p>\n" + finalText + "\n</p>";
      }

      if (conf.isLine) {
        finalText = finalText.replace(/\n<\/p>\n<p>\n/g, "</p>\\n<p>").replace(/\n{2,}/g, "\\n").replace(/\n/g, "");
      }

      return finalText;
    }

    /**
     * @param {String} command
     * @returns {String} Lorem Ipsum text.
     */
  }, {
    key: "parseCommand",
    value: function parseCommand(command) {
      // split the command into arguments and drop the "lorem"
      var commandArray = command.split(_configManager.SPLIT_REG_EXP).slice(1);
      // Make a copy of the default configuration object
      var conf = Object.assign({}, _configManager.DEFAULT_CONFIG);

      // Loop through each argument to assign config values

      var _loop = function (_command) {
        if (!_command) {
          if (commandArray.length === 1) {
            return {
              v: (0, _helpers.errorMsg)("Unrecognized option '_'.")
            };
          } else {
            return {
              v: (0, _helpers.errorMsg)("Two or more underscore characters adjacent to each other.")
            };
          }
        }

        // assign variable depending on order of string and number
        var str = undefined,
            num = undefined;
        if (/^([a-z\?]+)(\d*)$/.test(_command)) {
          var _command$match = _command.match(/^([a-z\?]+)(\d*)$/);

          var _command$match2 = _slicedToArray(_command$match, 3);

          _ = _command$match2[0];
          str = _command$match2[1];
          num = _command$match2[2];
        } else if (/^(\d*)([a-z\?]+)$/.test(_command)) {
          var _command$match3 = _command.match(/^(\d*)([a-z\?]+)$/);

          var _command$match32 = _slicedToArray(_command$match3, 3);

          _ = _command$match32[0];
          num = _command$match32[1];
          str = _command$match32[2];
        } else {
          return {
            v: (0, _helpers.errorMsg)("Unrecognized option \"_" + _command + "\".")
          };
        }
        var optionString = str;
        var optionInt = parseInt(num);

        /**
         * if optionInt is a finite number, assign the
         * property `prop` in config to optionInt
         * @param {String} prop
         */
        var setIntProp = function setIntProp(prop) {
          return Number.isFinite(optionInt) && (conf[prop] = optionInt);
        };

        // setup configuration
        switch (optionString) {
          case "p":
            conf.unitType = "paragraph";
            setIntProp("unitCount");
            break;
          case "w":
            conf.unitType = "word";
            setIntProp("unitCount");
            break;
          case "s":
            conf.unitType = "sentence";
            setIntProp("unitCount");
            break;
          case "link":
            conf.unitType = "link";
            setIntProp("unitCount");
            break;
          case "ol":
            conf.unitType = "orderedList";
            setIntProp("unitCount");
            break;
          case "ul":
            conf.unitType = "unorderedList";
            setIntProp("unitCount");
            break;
          case "short":
            conf.unitSize = w.SIZE_SHORT;
            break;
          case "medium":
            conf.unitSize = w.SIZE_MEDIUM;
            break;
          case "long":
            conf.unitSize = w.SIZE_LONG;
            break;
          case "vlong":
            conf.unitSize = w.SIZE_VERY_LONG;
            break;
          case "wrap":
            conf.isWrapped = true;
            setIntProp("wrapWidth");
            break;
          case "nowrap":
            conf.isWrapped = false;
            break;
          case "html":
            conf.isHTML = true;
            break;
          case "line":
            conf.isLine = true;
            break;
          case "?":
          case "help":
            conf.showHelp = true;
            break;
          case "config":
            atom.workspace.open("atom://config/packages/lorem");
            return {
              v: null
            };
          default:
            return {
              v: (0, _helpers.errorMsg)("Unrecognized option '_" + _command + "'.")
            };
        }
      };

      for (var _command of commandArray) {
        var _ret = _loop(_command);

        if (typeof _ret === "object") return _ret.v;
      }

      // log the configuration for developing
      (0, _helpers.displayConfigTable)(conf);

      return this.runCommand(conf);
    }
  }]);

  return LoremIpsum;
})();

exports["default"] = LoremIpsum;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sb3JlbS9saWIvbG9yZW0taXBzdW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3dCQUVzQixVQUFVOzs2QkFDYyxrQkFBa0I7O3VCQVF6RCxXQUFXOztxQkFDQyxTQUFTOztJQUFoQixDQUFDOztBQVpiLFdBQVcsQ0FBQzs7SUFjUyxVQUFVO1dBQVYsVUFBVTswQkFBVixVQUFVOzs7ZUFBVixVQUFVOzs7Ozs7O1dBS2hCLHVCQUFDLElBQUksRUFBRTtBQUNsQixhQUFPLHNCQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdkM7Ozs7Ozs7V0FLZ0IsNkJBQUc7OztBQUNsQixhQUFPLHNCQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUMvQixHQUFHLENBQUMsVUFBQSxDQUFDO2VBQUksTUFBSyxhQUFhLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQ1QsSUFBSSxFQUFFLENBQUM7S0FDWDs7Ozs7OztXQUtlLDRCQUFHO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsR0FDdEIsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FDNUMsSUFBSSxDQUFDO0tBQ1Y7Ozs7Ozs7O1dBTW1CLDhCQUFDLElBQUksRUFBRTs7OztBQUV6QixVQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVE7ZUFBUyxPQUFLLGlCQUFpQixDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7T0FBQSxDQUFDO0FBQ3hELGFBQU8sUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsUUFBUSxFQUFFLENBQUM7S0FDMUQ7Ozs7Ozs7O1dBTWdCLDJCQUFDLElBQUksRUFBRTtBQUN0QixjQUFRLElBQUk7QUFDVixh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QkFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsa0JBQU07QUFBQSxBQUNSLGVBQUssTUFBTTtBQUNULGdCQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixrQkFBTTtBQUFBLEFBQ1IsZUFBSyxHQUFHLENBQUM7QUFDVCxlQUFLLE1BQU07QUFDVCxnQkFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsa0JBQU07QUFBQSxBQUNSLGVBQUssUUFBUTtBQUNYLGdCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQ3BEO2lCQUFPLElBQUk7Y0FBQztBQUFBLEFBQ2Q7QUFDRTtpQkFBTyx1QkFBUyx3QkFBd0IsR0FBRyxRQUFPLEdBQUcsSUFBSSxDQUFDO2NBQUM7QUFBQSxTQUM5RDs7O0FBM0ZILFdBQUssSUFBSSxRQUFPLElBQUksWUFBWSxFQUFFO3lCQUF6QixRQUFPOzs7T0E0RmY7OztBQUdELHVDQUFtQixJQUFJLENBQUMsQ0FBQzs7QUFFekIsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzlCOzs7U0F6VGtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sb3JlbS9saWIvbG9yZW0taXBzdW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHsgU1BMSVRfUkVHX0VYUCwgREVGQVVMVF9DT05GSUcgfSBmcm9tIFwiLi9jb25maWctbWFuYWdlclwiO1xuaW1wb3J0IHtcbiAgcmFuZE50aCxcbiAgc2l6ZWRBcnJheSxcbiAgd29yZFdyYXAsXG4gIGVycm9yTXNnLFxuICBkaXNwbGF5Q29uZmlnVGFibGUsXG4gIHNlbnRlbmNlQ2FzZSxcbn0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0ICogYXMgdyBmcm9tIFwiLi93b3Jkc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb3JlbUlwc3VtIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFNpbmdsZSB3b3JkIGZyb20gYSB3b3JkIGxpc3RcbiAgICovXG4gIGdldFJhbmRvbVdvcmQoc2l6ZSkge1xuICAgIHJldHVybiByYW5kTnRoKHcud29yZExpc3RzW3NpemUgLSAxXSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge1N0cmluZ30gcmFuZG9tIHNlcmllcyBvZiBzdHJpbmdzXG4gICAqL1xuICBnZXRSYW5kb21GcmFnbWVudCgpIHtcbiAgICByZXR1cm4gcmFuZE50aCh3LmZyYWdtZW50UGF0dGVybnMpXG4gICAgICAubWFwKHYgPT4gdGhpcy5nZXRSYW5kb21Xb3JkKHYpKVxuICAgICAgLmpvaW4oXCIgXCIpXG4gICAgICAudHJpbSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IGNvbm5lY3Rpb24gYmV0d2VlbiB3b3Jkc1xuICAgKi9cbiAgZ2V0U2VudGVuY2VJbnRlcigpIHtcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKSA8IDAuNVxuICAgICAgPyBcIiBcIiArIHRoaXMuZ2V0UmFuZG9tV29yZCh3LlNJWkVfU0hPUlQpICsgXCIgXCJcbiAgICAgIDogXCIsIFwiO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IGNvbm5lY3QgdHdvIHNlbnRlbmNlcyB3aXRoIGFuIGludGVyIGNvbm5lY3Rpb25cbiAgICovXG4gIGdldFNlbnRlbmNlQ29ubmVjdG9yKHNpemUpIHtcbiAgICAvKiogQHJldHVybnMge1N0cmluZ30gKi9cbiAgICBjb25zdCByYW5kU2lkZSA9ICgpID0+IHRoaXMuZ2V0UmFuZG9tU2VudGVuY2Uoc2l6ZSAtIDEpO1xuICAgIHJldHVybiByYW5kU2lkZSgpICsgdGhpcy5nZXRTZW50ZW5jZUludGVyKCkgKyByYW5kU2lkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHJhbmRvbSBzZW50ZW5jZSBvZiBzaXplXG4gICAqL1xuICBnZXRSYW5kb21TZW50ZW5jZShzaXplKSB7XG4gICAgc3dpdGNoIChzaXplKSB7XG4gICAgICBjYXNlIHcuU0laRV9BTlk6XG4gICAgICAgIGNvbnN0IHJhbmRvbVNpemUgPSByYW5kTnRoKHcuYWxsU2l6ZXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRSYW5kb21TZW50ZW5jZShyYW5kb21TaXplKTtcbiAgICAgIGNhc2Ugdy5TSVpFX1NIT1JUOlxuICAgICAgICByZXR1cm4gdGhpcy5nZXRSYW5kb21GcmFnbWVudCgpO1xuICAgICAgY2FzZSB3LlNJWkVfTUVESVVNOlxuICAgICAgY2FzZSB3LlNJWkVfTE9ORzpcbiAgICAgIGNhc2Ugdy5TSVpFX1ZFUllfTE9ORzpcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2VudGVuY2VDb25uZWN0b3Ioc2l6ZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdGhpcy5nZXRSYW5kb21TZW50ZW5jZShERUZBVUxUX1VOSVRfU0laRSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHJhbmRvbSBwYXJhZ3JhcGggb2Ygc2l6ZVxuICAgKi9cbiAgZ2V0UmFuZG9tUGFyYWdyYXBoKHNpemUpIHtcbiAgICBpZiAoc2l6ZSA9PT0gdy5TSVpFX0FOWSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmFuZG9tUGFyYWdyYXBoKHcuREVGQVVMVF9VTklUX1NJWkUpO1xuICAgIH0gZWxzZSBpZiAoc2l6ZSA9PT0gdy5TSVpFX1NIT1JUKSB7XG4gICAgICBjb25zdCBzZW50ZW5jZUNvdW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikgKyAzO1xuICAgICAgcmV0dXJuIHNpemVkQXJyYXkoc2VudGVuY2VDb3VudClcbiAgICAgICAgLm1hcCgoKSA9PiBzZW50ZW5jZUNhc2UodGhpcy5nZXRSYW5kb21TZW50ZW5jZSh3LlNJWkVfQU5ZKSkpXG4gICAgICAgIC5qb2luKFwiXCIpXG4gICAgICAgIC50cmltKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzaXplZEFycmF5KDIpXG4gICAgICAgIC5tYXAoKCkgPT4gdGhpcy5nZXRSYW5kb21QYXJhZ3JhcGgoc2l6ZSAtIDEpKVxuICAgICAgICAuam9pbihcIlwiKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyB3aXRoIGBjb3VudGAgd29yZHMgb2YgbGVuZ3RoIHNpemVcbiAgICovXG4gIGdldFJhbmRvbVdvcmRzKGNvdW50LCBzaXplKSB7XG4gICAgcmV0dXJuIHNpemVkQXJyYXkoY291bnQpXG4gICAgICAubWFwKCgpID0+IHRoaXMuZ2V0UmFuZG9tV29yZChzaXplKSlcbiAgICAgIC5qb2luKFwiIFwiKVxuICAgICAgLnRyaW0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gY291bnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNpemVcbiAgICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHdpdGggY291bnQgKiBzZW50ZW5jZXMgb2YgbGVuZ3RoIHNpemVcbiAgICovXG4gIGdldFJhbmRvbVNlbnRlbmNlcyhjb3VudCwgc2l6ZSkge1xuICAgIHJldHVybiBzaXplZEFycmF5KGNvdW50KVxuICAgICAgLm1hcCgoKSA9PiBzZW50ZW5jZUNhc2UodGhpcy5nZXRSYW5kb21TZW50ZW5jZShzaXplKSkpXG4gICAgICAuam9pbihcIlxcblxcblwiKVxuICAgICAgLnRyaW0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gY291bnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNpemVcbiAgICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHdpdGggY291bnQgKiBwYXJhZ3JhcGhzIG9mIGxlbmd0aCBzaXplXG4gICAqL1xuICBnZXRSYW5kb21QYXJhZ3JhcGhzKGNvdW50LCBzaXplKSB7XG4gICAgcmV0dXJuIHNpemVkQXJyYXkoY291bnQpXG4gICAgICAubWFwKCgpID0+IHRoaXMuZ2V0UmFuZG9tUGFyYWdyYXBoKHNpemUpKVxuICAgICAgLmpvaW4oXCJcXG5cXG5cIilcbiAgICAgIC50cmltKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50XG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyB3aXRoIGBjb3VudGAgKiBsaW5rc1xuICAgKi9cbiAgZ2V0UmFuZG9tTGlua3MoY291bnQpIHtcbiAgICByZXR1cm4gc2l6ZWRBcnJheShjb3VudClcbiAgICAgIC5tYXAoXG4gICAgICAgICgpID0+XG4gICAgICAgICAgYDxhIGhyZWY9XCIke1xuICAgICAgICAgICAgREVGQVVMVF9DT05GSUcubGlua1VSTFxuICAgICAgICAgIH1cIj5cXG4ke3RoaXMuZ2V0UmFuZG9tRnJhZ21lbnQoKX1cXG48L2E+YCxcbiAgICAgIClcbiAgICAgIC5qb2luKFwiPGJyLz5cXG5cIik7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNPcmRlcmVkXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyB3aXRoIGNvdW50ICogbGlzdCBpdGVtc1xuICAgKi9cbiAgZ2V0UmFuZG9tTGlzdChjb3VudCwgaXNPcmRlcmVkKSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gb3JkZXJlZCBvciB1bm9yZGVyZWQgbGlzdFxuICAgICAqL1xuICAgIGNvbnN0IGxpc3RUeXBlID0gc3RyID0+XG4gICAgICBpc09yZGVyZWQgPyBgPG9sPlxcbiR7c3RyfVxcbjwvb2w+YCA6IGA8dWw+XFxuJHtzdHJ9XFxuPC91bD5gO1xuXG4gICAgcmV0dXJuIGxpc3RUeXBlKFxuICAgICAgc2l6ZWRBcnJheShjb3VudClcbiAgICAgICAgLm1hcCgoKSA9PiBgPGxpPlxcbiR7dGhpcy5nZXRSYW5kb21GcmFnbWVudCgpfVxcbjwvbGk+YClcbiAgICAgICAgLmpvaW4oXCJcXG5cIiksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29uZlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IGZpbmFsIHRleHRcbiAgICovXG4gIHJ1bkNvbW1hbmQoY29uZikge1xuICAgIC8vIG1ha2UgYSBjb3B5IG9mIGNvbmZcbiAgICBjb25mID0gT2JqZWN0LmFzc2lnbih7fSwgY29uZik7XG5cbiAgICBpZiAoY29uZi5zaG93SGVscCkge1xuICAgICAgc2hlbGwub3BlbkV4dGVybmFsKHcuSEVMUF9VUkwpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGZpbmFsVGV4dCA9XG4gICAgICB7XG4gICAgICAgIHBhcmFncmFwaDogdGhpcy5nZXRSYW5kb21QYXJhZ3JhcGhzKGNvbmYudW5pdENvdW50LCBjb25mLnVuaXRTaXplKSxcbiAgICAgICAgc2VudGVuY2U6IHRoaXMuZ2V0UmFuZG9tU2VudGVuY2VzKGNvbmYudW5pdENvdW50LCBjb25mLnVuaXRTaXplKSxcbiAgICAgICAgd29yZDogdGhpcy5nZXRSYW5kb21Xb3Jkcyhjb25mLnVuaXRDb3VudCwgY29uZi51bml0U2l6ZSksXG4gICAgICAgIGxpbms6IHRoaXMuZ2V0UmFuZG9tTGlua3MoY29uZi51bml0Q291bnQpLFxuICAgICAgICBvcmRlcmVkTGlzdDogdGhpcy5nZXRSYW5kb21MaXN0KGNvbmYudW5pdENvdW50LCB0cnVlKSxcbiAgICAgICAgdW5vcmRlcmVkTGlzdDogdGhpcy5nZXRSYW5kb21MaXN0KGNvbmYudW5pdENvdW50LCBmYWxzZSksXG4gICAgICB9W2NvbmYudW5pdFR5cGVdIHx8IG51bGw7XG5cbiAgICAvLyBUbyBhdm9pZCBiYWRseSBmb3JtYXR0ZWQgSFRNTCwgbGlua3MgYW5kIGxpc3RzIGFyZSBuZXZlciB3b3JkIHdyYXBwZWRcbiAgICBpZiAoW1wibGlua1wiLCBcIm9yZGVyZWRMaXN0XCIsIFwidW5vcmRlcmVkTGlzdFwiXS5pbmNsdWRlcyhjb25mLnVuaXRUeXBlKSkge1xuICAgICAgY29uZi5pc1dyYXBwZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoY29uZi5pc1dyYXBwZWQpIHtcbiAgICAgIGZpbmFsVGV4dCA9IHdvcmRXcmFwKGZpbmFsVGV4dCwgY29uZi53cmFwV2lkdGgpO1xuICAgIH1cblxuICAgIC8vIElnbm9yZSBfaHRtbCBvcHRpb24gZm9yIGxpc3RzLCBzaG91bGQgbmV2ZXIgYmUgaW4gcGFyYWdyYXBocy5cbiAgICBpZiAoW1wib3JkZXJlZExpc3RcIiwgXCJ1bm9yZGVyZWRMaXN0XCJdLmluY2x1ZGVzKGNvbmYudW5pdFR5cGUpKSB7XG4gICAgICBjb25mLmlzSFRNTCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChjb25mLmlzSFRNTCkge1xuICAgICAgaWYgKFtcInBhcmFncmFwaFwiLCBcInNlbnRlbmNlXCJdLmluY2x1ZGVzKGNvbmYudW5pdFR5cGUpKSB7XG4gICAgICAgIC8vIFdyYXAgZWFjaCBpbmRpdmlkdWFsIHBhcmFncmFwaCwgc2VudGVuY2VcbiAgICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0LnJlcGxhY2UoL1xcbnsyLH0vZywgXCJcXG48L3A+XFxuPHA+XFxuXCIpO1xuICAgICAgfVxuICAgICAgZmluYWxUZXh0ID0gXCI8cD5cXG5cIiArIGZpbmFsVGV4dCArIFwiXFxuPC9wPlwiO1xuICAgIH1cblxuICAgIGlmIChjb25mLmlzTGluZSkge1xuICAgICAgZmluYWxUZXh0ID0gZmluYWxUZXh0XG4gICAgICAgIC5yZXBsYWNlKC9cXG48XFwvcD5cXG48cD5cXG4vZywgXCI8L3A+XFxcXG48cD5cIilcbiAgICAgICAgLnJlcGxhY2UoL1xcbnsyLH0vZywgXCJcXFxcblwiKVxuICAgICAgICAucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBmaW5hbFRleHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNvbW1hbmRcbiAgICogQHJldHVybnMge1N0cmluZ30gTG9yZW0gSXBzdW0gdGV4dC5cbiAgICovXG4gIHBhcnNlQ29tbWFuZChjb21tYW5kKSB7XG4gICAgLy8gc3BsaXQgdGhlIGNvbW1hbmQgaW50byBhcmd1bWVudHMgYW5kIGRyb3AgdGhlIFwibG9yZW1cIlxuICAgIGNvbnN0IGNvbW1hbmRBcnJheSA9IGNvbW1hbmQuc3BsaXQoU1BMSVRfUkVHX0VYUCkuc2xpY2UoMSk7XG4gICAgLy8gTWFrZSBhIGNvcHkgb2YgdGhlIGRlZmF1bHQgY29uZmlndXJhdGlvbiBvYmplY3RcbiAgICBsZXQgY29uZiA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfQ09ORklHKTtcblxuICAgIC8vIExvb3AgdGhyb3VnaCBlYWNoIGFyZ3VtZW50IHRvIGFzc2lnbiBjb25maWcgdmFsdWVzXG4gICAgZm9yIChsZXQgY29tbWFuZCBvZiBjb21tYW5kQXJyYXkpIHtcbiAgICAgIGlmICghY29tbWFuZCkge1xuICAgICAgICBpZiAoY29tbWFuZEFycmF5Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiBlcnJvck1zZyhcIlVucmVjb2duaXplZCBvcHRpb24gJ18nLlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3JNc2coXG4gICAgICAgICAgICBcIlR3byBvciBtb3JlIHVuZGVyc2NvcmUgY2hhcmFjdGVycyBhZGphY2VudCB0byBlYWNoIG90aGVyLlwiLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYXNzaWduIHZhcmlhYmxlIGRlcGVuZGluZyBvbiBvcmRlciBvZiBzdHJpbmcgYW5kIG51bWJlclxuICAgICAgbGV0IHN0ciwgbnVtO1xuICAgICAgaWYgKC9eKFthLXpcXD9dKykoXFxkKikkLy50ZXN0KGNvbW1hbmQpKSB7XG4gICAgICAgIFtfLCBzdHIsIG51bV0gPSBjb21tYW5kLm1hdGNoKC9eKFthLXpcXD9dKykoXFxkKikkLyk7XG4gICAgICB9IGVsc2UgaWYgKC9eKFxcZCopKFthLXpcXD9dKykkLy50ZXN0KGNvbW1hbmQpKSB7XG4gICAgICAgIFtfLCBudW0sIHN0cl0gPSBjb21tYW5kLm1hdGNoKC9eKFxcZCopKFthLXpcXD9dKykkLyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyb3JNc2coYFVucmVjb2duaXplZCBvcHRpb24gXCJfJHtjb21tYW5kfVwiLmApO1xuICAgICAgfVxuICAgICAgY29uc3Qgb3B0aW9uU3RyaW5nID0gc3RyO1xuICAgICAgY29uc3Qgb3B0aW9uSW50ID0gcGFyc2VJbnQobnVtKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBpZiBvcHRpb25JbnQgaXMgYSBmaW5pdGUgbnVtYmVyLCBhc3NpZ24gdGhlXG4gICAgICAgKiBwcm9wZXJ0eSBgcHJvcGAgaW4gY29uZmlnIHRvIG9wdGlvbkludFxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAgICAgICAqL1xuICAgICAgY29uc3Qgc2V0SW50UHJvcCA9IHByb3AgPT5cbiAgICAgICAgTnVtYmVyLmlzRmluaXRlKG9wdGlvbkludCkgJiYgKGNvbmZbcHJvcF0gPSBvcHRpb25JbnQpO1xuXG4gICAgICAvLyBzZXR1cCBjb25maWd1cmF0aW9uXG4gICAgICBzd2l0Y2ggKG9wdGlvblN0cmluZykge1xuICAgICAgICBjYXNlIFwicFwiOlxuICAgICAgICAgIGNvbmYudW5pdFR5cGUgPSBcInBhcmFncmFwaFwiO1xuICAgICAgICAgIHNldEludFByb3AoXCJ1bml0Q291bnRcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ3XCI6XG4gICAgICAgICAgY29uZi51bml0VHlwZSA9IFwid29yZFwiO1xuICAgICAgICAgIHNldEludFByb3AoXCJ1bml0Q291bnRcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzXCI6XG4gICAgICAgICAgY29uZi51bml0VHlwZSA9IFwic2VudGVuY2VcIjtcbiAgICAgICAgICBzZXRJbnRQcm9wKFwidW5pdENvdW50XCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibGlua1wiOlxuICAgICAgICAgIGNvbmYudW5pdFR5cGUgPSBcImxpbmtcIjtcbiAgICAgICAgICBzZXRJbnRQcm9wKFwidW5pdENvdW50XCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwib2xcIjpcbiAgICAgICAgICBjb25mLnVuaXRUeXBlID0gXCJvcmRlcmVkTGlzdFwiO1xuICAgICAgICAgIHNldEludFByb3AoXCJ1bml0Q291bnRcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ1bFwiOlxuICAgICAgICAgIGNvbmYudW5pdFR5cGUgPSBcInVub3JkZXJlZExpc3RcIjtcbiAgICAgICAgICBzZXRJbnRQcm9wKFwidW5pdENvdW50XCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic2hvcnRcIjpcbiAgICAgICAgICBjb25mLnVuaXRTaXplID0gdy5TSVpFX1NIT1JUO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWVkaXVtXCI6XG4gICAgICAgICAgY29uZi51bml0U2l6ZSA9IHcuU0laRV9NRURJVU07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJsb25nXCI6XG4gICAgICAgICAgY29uZi51bml0U2l6ZSA9IHcuU0laRV9MT05HO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidmxvbmdcIjpcbiAgICAgICAgICBjb25mLnVuaXRTaXplID0gdy5TSVpFX1ZFUllfTE9ORztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndyYXBcIjpcbiAgICAgICAgICBjb25mLmlzV3JhcHBlZCA9IHRydWU7XG4gICAgICAgICAgc2V0SW50UHJvcChcIndyYXBXaWR0aFwiKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5vd3JhcFwiOlxuICAgICAgICAgIGNvbmYuaXNXcmFwcGVkID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJodG1sXCI6XG4gICAgICAgICAgY29uZi5pc0hUTUwgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibGluZVwiOlxuICAgICAgICAgIGNvbmYuaXNMaW5lID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIj9cIjpcbiAgICAgICAgY2FzZSBcImhlbHBcIjpcbiAgICAgICAgICBjb25mLnNob3dIZWxwID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNvbmZpZ1wiOlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oXCJhdG9tOi8vY29uZmlnL3BhY2thZ2VzL2xvcmVtXCIpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBlcnJvck1zZyhcIlVucmVjb2duaXplZCBvcHRpb24gJ19cIiArIGNvbW1hbmQgKyBcIicuXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGxvZyB0aGUgY29uZmlndXJhdGlvbiBmb3IgZGV2ZWxvcGluZ1xuICAgIGRpc3BsYXlDb25maWdUYWJsZShjb25mKTtcblxuICAgIHJldHVybiB0aGlzLnJ1bkNvbW1hbmQoY29uZik7XG4gIH1cbn1cbiJdfQ==