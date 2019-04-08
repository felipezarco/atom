Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _atom = require("atom");

var _loremIpsum = require("./lorem-ipsum");

var _loremIpsum2 = _interopRequireDefault(_loremIpsum);

var _configManager = require("./config-manager");

"use babel";

exports["default"] = {
  LoremIpsum: null,
  subscriptions: null,

  config: {
    defaults: {
      title: "Defaults command arguments",
      description: "",
      type: "object",
      order: 1,
      properties: {
        unitType: {
          title: "Default type of items",
          type: "string",
          "default": "Paragraph",
          "enum": ["Paragraph", "Sentence", "Word", "Link", "Ordered List", "Unordered List"],
          order: 1
        },
        unitCount: {
          title: "Default number of items",
          type: "integer",
          "default": 1,
          minimum: 1,
          maximum: 20,
          order: 2
        },
        unitSize: {
          title: "Default length of items",
          type: "string",
          "default": "Medium",
          "enum": ["Short", "Medium", "Long", "Very Long"],
          order: 3
        },
        isWrapped: {
          title: "Is lorem text wrapped by default?",
          type: "boolean",
          "default": true,
          order: 4
        },
        wrapWidth: {
          title: "Wrap width if enabled",
          type: "integer",
          "default": 80,
          minimum: 20,
          order: 5
        },
        linkURL: {
          title: "Default link to insert in `<a>` tags",
          type: "string",
          "default": "https://atom.io",
          order: 6
        },
        isHTML: {
          title: "Is the lorem text wrapped in `<p>` tags?",
          type: "boolean",
          "default": false,
          order: 7
        },
        isInline: {
          title: "Should lorem text be single line by default",
          type: "boolean",
          "default": false,
          order: 8
        },
        showHelp: {
          title: "Should help be shown if no arguments are specified",
          type: "boolean",
          "default": false,
          order: 9
        }
      }
    },
    commands: {
      title: "Command parameters",
      description: "",
      type: "object",
      order: 2,
      properties: {
        splitRegExp: {
          title: "Argument seperators",
          description: "Characters that can seperate arguments in you lorem command.",
          type: "array",
          "default": ["_", "-"],
          items: {
            type: "string"
          }
        }
      }
    }
  },

  activate: function activate(state) {
    var _this = this;

    this.LoremIpsum = new _loremIpsum2["default"]();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add("atom-workspace", {
      "lorem:catch-command": function loremCatchCommand() {
        return _this.handleLorem();
      },
      "lorem:open-config": function loremOpenConfig() {
        return atom.workspace.open("atom://config/packages/lorem");
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  /**
   * @param {TextEditor} editor
   * @param {Point} cursor
   * @returns {String} command string to the left of the cursor
   */
  getLoremCommand: function getLoremCommand(editor, cursor) {
    var row = cursor.row;
    var column = cursor.column;

    var line = editor.lineTextForBufferRow(row);

    var start = column;

    while (start > 0 && /\S/.test(line.charAt(start - 1))) {
      start--;
    }

    var command = editor.getTextInBufferRange([[row, start], [row, column]]);

    if (/lorem/.test(command)) {
      var _command$match = command.match(/lorem/);

      var index = _command$match.index;

      command = command.slice(index);
    }

    return command.split(_configManager.SPLIT_REG_EXP)[0] === "lorem" ? command : "";
  },

  /**
   * Returns a new marker layer with markers at cursor positions
   * @param {TextEditor} editor
   * @returns {DisplayMarkerLayer}
   */
  createCursorLayer: function createCursorLayer(editor) {
    var layer = editor.addMarkerLayer();

    editor.getCursorBufferPositions().sort(function (a, b) {
      return a.row > b.row;
    }).forEach(function (cursor) {
      return layer.markBufferPosition(cursor);
    });

    return layer;
  },

  /**
   * Parse each command for every cursor and insert it at its respective cursor
   */
  handleLorem: function handleLorem() {
    var _this2 = this;

    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) return;

    var layer = this.createCursorLayer(editor);
    var markers = layer.getMarkers();

    editor.transact(function () {
      markers.forEach(function (marker) {
        var cursor = marker.getStartBufferPosition(),
            command = _this2.getLoremCommand(editor, cursor),
            text = _this2.LoremIpsum.parseCommand(command),
            start = [cursor.row, cursor.column - command.length],
            isComment = editor.isBufferRowCommented(cursor.row);

        if (!text) return;

        editor.setSelectedBufferRange([start, cursor]);
        editor.insertText(text, { select: true });
        editor.autoIndentSelectedRows();

        if (isComment) {
          editor.toggleLineCommentForBufferRow(cursor.row);
          editor.toggleLineCommentsInSelection();
        }
      });
    });

    layer.destroy();
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sb3JlbS9saWIvbG9yZW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVvQyxNQUFNOzswQkFDbkIsZUFBZTs7Ozs2QkFDUixrQkFBa0I7O0FBSmhELFdBQVcsQ0FBQzs7cUJBTUc7QUFDYixZQUFVLEVBQUUsSUFBSTtBQUNoQixlQUFhLEVBQUUsSUFBSTs7QUFFbkIsUUFBTSxFQUFFO0FBQ04sWUFBUSxFQUFFO0FBQ1IsV0FBSyxFQUFFLDRCQUE0QjtBQUNuQyxpQkFBVyxFQUFFLEVBQUU7QUFDZixVQUFJLEVBQUUsUUFBUTtBQUNkLFdBQUssRUFBRSxDQUFDO0FBQ1IsZ0JBQVUsRUFBRTtBQUNWLGdCQUFRLEVBQUU7QUFDUixlQUFLLEVBQUUsdUJBQXVCO0FBQzlCLGNBQUksRUFBRSxRQUFRO0FBQ2QscUJBQVMsV0FBVztBQUNwQixrQkFBTSxDQUNKLFdBQVcsRUFDWCxVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsZ0JBQWdCLENBQ2pCO0FBQ0QsZUFBSyxFQUFFLENBQUM7U0FDVDtBQUNELGlCQUFTLEVBQUU7QUFDVCxlQUFLLEVBQUUseUJBQXlCO0FBQ2hDLGNBQUksRUFBRSxTQUFTO0FBQ2YscUJBQVMsQ0FBQztBQUNWLGlCQUFPLEVBQUUsQ0FBQztBQUNWLGlCQUFPLEVBQUUsRUFBRTtBQUNYLGVBQUssRUFBRSxDQUFDO1NBQ1Q7QUFDRCxnQkFBUSxFQUFFO0FBQ1IsZUFBSyxFQUFFLHlCQUF5QjtBQUNoQyxjQUFJLEVBQUUsUUFBUTtBQUNkLHFCQUFTLFFBQVE7QUFDakIsa0JBQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUM7QUFDOUMsZUFBSyxFQUFFLENBQUM7U0FDVDtBQUNELGlCQUFTLEVBQUU7QUFDVCxlQUFLLEVBQUUsbUNBQW1DO0FBQzFDLGNBQUksRUFBRSxTQUFTO0FBQ2YscUJBQVMsSUFBSTtBQUNi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SyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDcEQsU0FBUyxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXRELFlBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTzs7QUFFbEIsY0FBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDL0MsY0FBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMxQyxjQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQzs7QUFFaEMsWUFBSSxTQUFTLEVBQUU7QUFDYixnQkFBTSxDQUFDLDZCQUE2QixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqRCxnQkFBTSxDQUFDLDZCQUE2QixFQUFFLENBQUM7U0FDeEM7T0FDRixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7O0FBRUgsU0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ2pCO0NBQ0YiLCJmaWxlIjoiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2xvcmVtL2xpYi9sb3JlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuaW1wb3J0IExvcmVtSXBzdW0gZnJvbSBcIi4vbG9yZW0taXBzdW1cIjtcbmltcG9ydCB7IFNQTElUX1JFR19FWFAgfSBmcm9tIFwiLi9jb25maWctbWFuYWdlclwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIExvcmVtSXBzdW06IG51bGwsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG5cbiAgY29uZmlnOiB7XG4gICAgZGVmYXVsdHM6IHtcbiAgICAgIHRpdGxlOiBcIkRlZmF1bHRzIGNvbW1hbmQgYXJndW1lbnRzXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJcIixcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBvcmRlcjogMSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdW5pdFR5cGU6IHtcbiAgICAgICAgICB0aXRsZTogXCJEZWZhdWx0IHR5cGUgb2YgaXRlbXNcIixcbiAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgIGRlZmF1bHQ6IFwiUGFyYWdyYXBoXCIsXG4gICAgICAgICAgZW51bTogW1xuICAgICAgICAgICAgXCJQYXJhZ3JhcGhcIixcbiAgICAgICAgICAgIFwiU2VudGVuY2VcIixcbiAgICAgICAgICAgIFwiV29yZFwiLFxuICAgICAgICAgICAgXCJMaW5rXCIsXG4gICAgICAgICAgICBcIk9yZGVyZWQgTGlzdFwiLFxuICAgICAgICAgICAgXCJVbm9yZGVyZWQgTGlzdFwiLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgb3JkZXI6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIHVuaXRDb3VudDoge1xuICAgICAgICAgIHRpdGxlOiBcIkRlZmF1bHQgbnVtYmVyIG9mIGl0ZW1zXCIsXG4gICAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCIsXG4gICAgICAgICAgZGVmYXVsdDogMSxcbiAgICAgICAgICBtaW5pbXVtOiAxLFxuICAgICAgICAgIG1heGltdW06IDIwLFxuICAgICAgICAgIG9yZGVyOiAyLFxuICAgICAgICB9LFxuICAgICAgICB1bml0U2l6ZToge1xuICAgICAgICAgIHRpdGxlOiBcIkRlZmF1bHQgbGVuZ3RoIG9mIGl0ZW1zXCIsXG4gICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICBkZWZhdWx0OiBcIk1lZGl1bVwiLFxuICAgICAgICAgIGVudW06IFtcIlNob3J0XCIsIFwiTWVkaXVtXCIsIFwiTG9uZ1wiLCBcIlZlcnkgTG9uZ1wiXSxcbiAgICAgICAgICBvcmRlcjogMyxcbiAgICAgICAgfSxcbiAgICAgICAgaXNXcmFwcGVkOiB7XG4gICAgICAgICAgdGl0bGU6IFwiSXMgbG9yZW0gdGV4dCB3cmFwcGVkIGJ5IGRlZmF1bHQ/XCIsXG4gICAgICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBvcmRlcjogNCxcbiAgICAgICAgfSxcbiAgICAgICAgd3JhcFdpZHRoOiB7XG4gICAgICAgICAgdGl0bGU6IFwiV3JhcCB3aWR0aCBpZiBlbmFibGVkXCIsXG4gICAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCIsXG4gICAgICAgICAgZGVmYXVsdDogODAsXG4gICAgICAgICAgbWluaW11bTogMjAsXG4gICAgICAgICAgb3JkZXI6IDUsXG4gICAgICAgIH0sXG4gICAgICAgIGxpbmtVUkw6IHtcbiAgICAgICAgICB0aXRsZTogXCJEZWZhdWx0IGxpbmsgdG8gaW5zZXJ0IGluIGA8YT5gIHRhZ3NcIixcbiAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgIGRlZmF1bHQ6IFwiaHR0cHM6Ly9hdG9tLmlvXCIsXG4gICAgICAgICAgb3JkZXI6IDYsXG4gICAgICAgIH0sXG4gICAgICAgIGlzSFRNTDoge1xuICAgICAgICAgIHRpdGxlOiBcIklzIHRoZSBsb3JlbSB0ZXh0IHdyYXBwZWQgaW4gYDxwPmAgdGFncz9cIixcbiAgICAgICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICBvcmRlcjogNyxcbiAgICAgICAgfSxcbiAgICAgICAgaXNJbmxpbmU6IHtcbiAgICAgICAgICB0aXRsZTogXCJTaG91bGQgbG9yZW0gdGV4dCBiZSBzaW5nbGUgbGluZSBieSBkZWZhdWx0XCIsXG4gICAgICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgb3JkZXI6IDgsXG4gICAgICAgIH0sXG4gICAgICAgIHNob3dIZWxwOiB7XG4gICAgICAgICAgdGl0bGU6IFwiU2hvdWxkIGhlbHAgYmUgc2hvd24gaWYgbm8gYXJndW1lbnRzIGFyZSBzcGVjaWZpZWRcIixcbiAgICAgICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICBvcmRlcjogOSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjb21tYW5kczoge1xuICAgICAgdGl0bGU6IFwiQ29tbWFuZCBwYXJhbWV0ZXJzXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJcIixcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBvcmRlcjogMixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3BsaXRSZWdFeHA6IHtcbiAgICAgICAgICB0aXRsZTogXCJBcmd1bWVudCBzZXBlcmF0b3JzXCIsXG4gICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICBcIkNoYXJhY3RlcnMgdGhhdCBjYW4gc2VwZXJhdGUgYXJndW1lbnRzIGluIHlvdSBsb3JlbSBjb21tYW5kLlwiLFxuICAgICAgICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAgICAgICBkZWZhdWx0OiBbXCJfXCIsIFwiLVwiXSxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5Mb3JlbUlwc3VtID0gbmV3IExvcmVtSXBzdW0oKTtcblxuICAgIC8vIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIC8vIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZChcImF0b20td29ya3NwYWNlXCIsIHtcbiAgICAgICAgXCJsb3JlbTpjYXRjaC1jb21tYW5kXCI6ICgpID0+IHRoaXMuaGFuZGxlTG9yZW0oKSxcbiAgICAgICAgXCJsb3JlbTpvcGVuLWNvbmZpZ1wiOiAoKSA9PlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oXCJhdG9tOi8vY29uZmlnL3BhY2thZ2VzL2xvcmVtXCIpLFxuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7VGV4dEVkaXRvcn0gZWRpdG9yXG4gICAqIEBwYXJhbSB7UG9pbnR9IGN1cnNvclxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBjb21tYW5kIHN0cmluZyB0byB0aGUgbGVmdCBvZiB0aGUgY3Vyc29yXG4gICAqL1xuICBnZXRMb3JlbUNvbW1hbmQoZWRpdG9yLCBjdXJzb3IpIHtcbiAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBjdXJzb3I7XG4gICAgY29uc3QgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpO1xuXG4gICAgbGV0IHN0YXJ0ID0gY29sdW1uO1xuXG4gICAgd2hpbGUgKHN0YXJ0ID4gMCAmJiAvXFxTLy50ZXN0KGxpbmUuY2hhckF0KHN0YXJ0IC0gMSkpKSB7XG4gICAgICBzdGFydC0tO1xuICAgIH1cblxuICAgIGxldCBjb21tYW5kID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtbcm93LCBzdGFydF0sIFtyb3csIGNvbHVtbl1dKTtcblxuICAgIGlmICgvbG9yZW0vLnRlc3QoY29tbWFuZCkpIHtcbiAgICAgIGNvbnN0IHsgaW5kZXggfSA9IGNvbW1hbmQubWF0Y2goL2xvcmVtLyk7XG4gICAgICBjb21tYW5kID0gY29tbWFuZC5zbGljZShpbmRleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbW1hbmQuc3BsaXQoU1BMSVRfUkVHX0VYUClbMF0gPT09IFwibG9yZW1cIiA/IGNvbW1hbmQgOiBcIlwiO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IG1hcmtlciBsYXllciB3aXRoIG1hcmtlcnMgYXQgY3Vyc29yIHBvc2l0aW9uc1xuICAgKiBAcGFyYW0ge1RleHRFZGl0b3J9IGVkaXRvclxuICAgKiBAcmV0dXJucyB7RGlzcGxheU1hcmtlckxheWVyfVxuICAgKi9cbiAgY3JlYXRlQ3Vyc29yTGF5ZXIoZWRpdG9yKSB7XG4gICAgY29uc3QgbGF5ZXIgPSBlZGl0b3IuYWRkTWFya2VyTGF5ZXIoKTtcblxuICAgIGVkaXRvclxuICAgICAgLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5yb3cgPiBiLnJvdylcbiAgICAgIC5mb3JFYWNoKGN1cnNvciA9PiBsYXllci5tYXJrQnVmZmVyUG9zaXRpb24oY3Vyc29yKSk7XG5cbiAgICByZXR1cm4gbGF5ZXI7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFBhcnNlIGVhY2ggY29tbWFuZCBmb3IgZXZlcnkgY3Vyc29yIGFuZCBpbnNlcnQgaXQgYXQgaXRzIHJlc3BlY3RpdmUgY3Vyc29yXG4gICAqL1xuICBoYW5kbGVMb3JlbSgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgaWYgKCFlZGl0b3IpIHJldHVybjtcblxuICAgIGNvbnN0IGxheWVyID0gdGhpcy5jcmVhdGVDdXJzb3JMYXllcihlZGl0b3IpO1xuICAgIGNvbnN0IG1hcmtlcnMgPSBsYXllci5nZXRNYXJrZXJzKCk7XG5cbiAgICBlZGl0b3IudHJhbnNhY3QoKCkgPT4ge1xuICAgICAgbWFya2Vycy5mb3JFYWNoKG1hcmtlciA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnNvciA9IG1hcmtlci5nZXRTdGFydEJ1ZmZlclBvc2l0aW9uKCksXG4gICAgICAgICAgY29tbWFuZCA9IHRoaXMuZ2V0TG9yZW1Db21tYW5kKGVkaXRvciwgY3Vyc29yKSxcbiAgICAgICAgICB0ZXh0ID0gdGhpcy5Mb3JlbUlwc3VtLnBhcnNlQ29tbWFuZChjb21tYW5kKSxcbiAgICAgICAgICBzdGFydCA9IFtjdXJzb3Iucm93LCBjdXJzb3IuY29sdW1uIC0gY29tbWFuZC5sZW5ndGhdLFxuICAgICAgICAgIGlzQ29tbWVudCA9IGVkaXRvci5pc0J1ZmZlclJvd0NvbW1lbnRlZChjdXJzb3Iucm93KTtcblxuICAgICAgICBpZiAoIXRleHQpIHJldHVybjtcblxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShbc3RhcnQsIGN1cnNvcl0pO1xuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCh0ZXh0LCB7IHNlbGVjdDogdHJ1ZSB9KTtcbiAgICAgICAgZWRpdG9yLmF1dG9JbmRlbnRTZWxlY3RlZFJvd3MoKTtcblxuICAgICAgICBpZiAoaXNDb21tZW50KSB7XG4gICAgICAgICAgZWRpdG9yLnRvZ2dsZUxpbmVDb21tZW50Rm9yQnVmZmVyUm93KGN1cnNvci5yb3cpO1xuICAgICAgICAgIGVkaXRvci50b2dnbGVMaW5lQ29tbWVudHNJblNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGxheWVyLmRlc3Ryb3koKTtcbiAgfSxcbn07XG4iXX0=