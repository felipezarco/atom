var _atom = require('atom');

// import { isListItem, wrapText } from './functions'

'use babel';

CSON = require('season');
fs = require('fs');
GrammarCompiler = require('./GrammarCompiler');
path = require('path');

module.exports = {
  config: {
    addListItems: {
      title: 'Add new list-items',
      description: 'Automatically add a new list-item after the current (non-empty) one when pressing <kbd>ENTER</kbd>',
      type: 'boolean',
      'default': true
    },

    autoIncrementListItems: {
      title: 'Increment Ordered List Items',
      description: 'Automatically increment a new list-item after the current(non-empty) one when pressing <kbd>ENTER</kbd>',
      type: 'boolean',
      'default': true
    },

    disableLanguageGfm: {
      title: 'Disable language-gfm',
      description: 'Disable the default `language-gfm` package as this package is intended as its replacement',
      type: 'boolean',
      'default': true
    },

    emphasisShortcuts: {
      title: 'Emphasis shortcuts',
      description: 'Enables keybindings `_` for emphasis, `*` for strong emphasis, and `~` for strike-through on selected text; emphasizing an already emphasized selection will de-emphasize it',
      type: 'boolean',
      'default': true
    },

    indentListItems: {
      title: 'Indent list-items',
      description: 'Automatically in- and outdent list-items by pressing `TAB` and `SHIFT+TAB`',
      type: 'boolean',
      'default': true
    },

    linkShortcuts: {
      title: 'Link shortcuts',
      description: 'Enables keybindings `@` for converting the selected text to a link and `!` for converting the selected text to an image',
      type: 'boolean',
      'default': true
    },

    removeEmptyListItems: {
      title: 'Remove empty list-items',
      description: 'Remove the automatically created empty list-items when left empty, leaving an empty line',
      type: 'boolean',
      'default': true
    }
  },

  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.addCommands();

    /*
    Unless you are an advanced user, there is no need to have both this package
    and the one it replaces (language-gfm) enabled.
     If you are an advanced user, you can easily re-enable language-gfm again.
    */
    if (atom.config.get('language-markdown.disableLanguageGfm')) {
      if (!atom.packages.isPackageDisabled('language-gfm')) {
        atom.packages.disablePackage('language-gfm');
      }
    }

    /*
    I forgot why this action is created inline in activate() and not as a
    separate method, but there was a good reason for it.
    */
    this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      editor.onDidInsertText(function (event) {
        var grammar = editor.getGrammar();

        if (grammar.name !== 'Markdown') return;
        if (!atom.config.get('language-markdown.addListItems')) return;
        if (event.text !== '\n') return;

        /*
        At this point, it is rather tedious (as far as I know) to get to the
        tokenized version of {previousLine}. That is the reason why {tokens} a
        little further down is tokenized. But at this stage, we do need to know
        if {previousLine} was in fact Markdown, or from a different perspective,
        not a piece of embedded code. The reason for that is that the tokenized
        line below is tokenized without any context, so is Markdown by default.
        Therefore we determine if our current position is part of embedded code
        or not.
        */

        var previousRowNumber = event.range.start.row;
        var previousRowRange = editor.buffer.rangeForRow(previousRowNumber);
        if (_this.isEmbeddedCode(editor, previousRowRange)) return;

        var previousLine = editor.getTextInRange(previousRowRange);

        var _grammar$tokenizeLine = grammar.tokenizeLine(previousLine);

        var tokens = _grammar$tokenizeLine.tokens;

        tokens.reverse();
        for (var token of tokens) {
          var isPunctuation = false;
          var isListItem = false;
          var typeOfList = undefined;

          var scopes = token.scopes.reverse();
          for (var scope of scopes) {
            var classes = scope.split('.');

            /*
            A list-item is valid when a punctuation class is immediately
            followed by a non-empty list-item class.
            */
            if (classes.includes('punctuation')) {
              isPunctuation = true;
            } else if (isPunctuation && classes.includes('list')) {
              if (!classes.includes('empty')) {
                isListItem = true;
                typeOfList = 'unordered';
                if (classes.includes('ordered')) {
                  typeOfList = 'ordered';
                }
                if (classes.includes('definition')) {
                  typeOfList = 'definition';
                }
                break;
              } else {
                isListItem = false;
                isPunctuation = false;
                if (atom.config.get('language-markdown.removeEmptyListItems')) {
                  editor.setTextInBufferRange(previousRowRange, '');
                }
              }
            } else {
              isPunctuation = false;
            }
          }

          if (isListItem && typeOfList !== 'definition') {
            var text = token.value;
            if (typeOfList === 'ordered') {
              var _length = text.length;
              var punctuation = text.match(/[^\d]+/);
              var value = parseInt(text);
              if (atom.config.get('language-markdown.autoIncrementListItems')) {
                value = value + 1;
              }
              text = value + punctuation;
              if (text.length < _length) {
                for (var j = 0; j < text.length - _length + 1; j++) {
                  text = '0' + text;
                }
              }
            } else {
              text = text.replace('x', ' ');
            }
            editor.insertText(text + '');
            break;
          }
        }
      });
    }));
  },

  addCommands: function addCommands() {
    var _this2 = this;

    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:indent-list-item', function (event) {
      return _this2.indentListItem(event);
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:outdent-list-item', function (event) {
      return _this2.outdentListItem(event);
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:emphasis', function (event) {
      return _this2.emphasizeSelection(event, '_');
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:strong-emphasis', function (event) {
      return _this2.emphasizeSelection(event, '**');
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:strike-through', function (event) {
      return _this2.emphasizeSelection(event, '~~');
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:link', function (event) {
      return _this2.linkSelection(event);
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:image', function (event) {
      return _this2.linkSelection(event, true);
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'markdown:toggle-task', function (event) {
      return _this2.toggleTask(event);
    }));

    if (atom.inDevMode()) {
      this.subscriptions.add(atom.commands.add('atom-workspace', 'markdown:compile-grammar-and-reload', function () {
        return _this2.compileGrammar();
      }));
    }
  },

  indentListItem: function indentListItem(event) {
    var _getEditorAndPosition2 = this._getEditorAndPosition(event);

    var editor = _getEditorAndPosition2.editor;
    var position = _getEditorAndPosition2.position;

    var indentListItems = atom.config.get('language-markdown.indentListItems');
    if (indentListItems && this.isListItem(editor, position)) {
      editor.indentSelectedRows(position.row);
      return;
    }
    event.abortKeyBinding();
  },

  outdentListItem: function outdentListItem(event) {
    var _getEditorAndPosition3 = this._getEditorAndPosition(event);

    var editor = _getEditorAndPosition3.editor;
    var position = _getEditorAndPosition3.position;

    var indentListItems = atom.config.get('language-markdown.indentListItems');
    if (indentListItems && this.isListItem(editor, position)) {
      editor.outdentSelectedRows(position.row);
      return;
    }
    event.abortKeyBinding();
  },

  emphasizeSelection: function emphasizeSelection(event, token) {
    var didSomeWrapping = false;
    if (atom.config.get('language-markdown.emphasisShortcuts')) {
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) return;

      var ranges = this.getSelectedBufferRangesReversed(editor);
      for (var range of ranges) {
        var text = editor.getTextInBufferRange(range);
        /*
        Skip texts that contain a line-break, or are empty.
        Multi-line emphasis is not supported 'anyway'.
         If afterwards not a single selection has been wrapped, cancel the event
        and insert the character as normal.
         If two cursors were found, but only one of them was a selection, and the
        other a normal cursor, then the normal cursor is ignored, and the single
        selection will be wrapped.
        */
        if (text.length !== 0 && text.indexOf('\n') === -1) {
          var wrappedText = this.wrapText(text, token);
          editor.setTextInBufferRange(range, wrappedText);
          didSomeWrapping = true;
        }
      }
    }
    if (!didSomeWrapping) {
      event.abortKeyBinding();
    }
    return;
  },

  // TODO: Doesn't place the cursor at the right position afterwards
  linkSelection: function linkSelection(event) {
    var isImage = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    var didSomeWrapping = false;

    if (!atom.config.get('language-markdown.linkShortcuts')) {
      event.abortKeyBinding();
      return;
    }

    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) return;

    var ranges = this.getSelectedBufferRangesReversed(editor);
    var cursorOffsets = [];
    for (var range of ranges) {
      var text = editor.getTextInBufferRange(range);
      // See {emphasizeSelection}
      if (text.length !== 0 && text.indexOf('\n') === -1) {
        var imageToken = isImage ? '!' : '';
        if (text.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
          var newText = imageToken + '[](' + text + ')';
          editor.setTextInBufferRange(range, newText);
          cursorOffsets.push(text.length + 3);
        } else {
          var newText = imageToken + '[' + text + ']()';
          editor.setTextInBufferRange(range, newText);
          cursorOffsets.push(1);
        }
        didSomeWrapping = true;
      }
    }

    if (didSomeWrapping) {
      /*
      Cursors aren't separate entities, but rather simple {Point}s, ie,
      positions in the buffer. There is no way of updating a cursor. Instead,
      we clear all cursors, and then re-create them from where our current
      selections are.
       After the image/link wrapping above, the cursor are positioned after the
      selections, and the desired relative locations for the new cursors are
      stored in {cursorOffsets}. We only need to loop through the current
      selections, and create a new cursor for every selection.
       A selection without a length is a simple cursor that can be re-created at
      that exact location.
       TODO: maybe one of those fancy generators can be used for our
      cursorOffsets?
      */
      var selections = editor.getSelectedBufferRanges();
      var count = 0;
      var offsetCount = 0;
      for (var selection of selections) {
        var start = selection.start;
        var end = selection.end;

        if (start.row === end.row && start.column === end.column) {
          if (count) {
            editor.addCursorAtBufferPosition(start);
          } else {
            editor.setCursorBufferPosition(start);
          }
        } else {
          var position = {
            row: end.row,
            column: end.column - cursorOffsets[offsetCount]
          };
          if (count) {
            editor.addCursorAtBufferPosition(position);
          } else {
            editor.setCursorBufferPosition(position);
          }
          offsetCount++;
        }
        count++;
      }
    } else {
      event.abortKeyBinding();
    }

    return;
  },

  _getEditorAndPosition: function _getEditorAndPosition(event) {
    var editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      var positions = editor.getCursorBufferPositions();
      if (positions) {
        var position = positions[0];
        return { editor: editor, position: position };
      }
    }
    event.abortKeyBinding();
  },

  toggleTask: function toggleTask(event) {
    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      event.abortKeyBinding();
      return;
    }

    var ranges = editor.getSelectedBufferRanges();
    for (var range of ranges) {
      var start = range.start;
      var end = range.end;

      for (var row = start.row; row <= end.row; row++) {
        var listItem = this.isListItem(editor, [row, 0]);
        if (listItem && listItem.includes('task')) {
          var currentLine = editor.lineTextForBufferRow(row);
          var newLine = undefined;
          if (listItem.includes('completed')) {
            newLine = currentLine.replace(/ \[(x|X)\] /, ' [ ] ');
          } else {
            newLine = currentLine.replace(' [ ] ', ' [x] ');
          }
          var newRange = [[row, 0], [row, newLine.length]];
          editor.setTextInBufferRange(newRange, newLine);
        }
      }
    }
    return;
  },

  isListItem: function isListItem(editor, position) {
    if (editor) {
      if (editor.getGrammar().name === 'Markdown') {
        var scopeDescriptor = editor.scopeDescriptorForBufferPosition(position);
        for (var scope of scopeDescriptor.scopes) {
          if (scope.includes('list')) {
            /*
            Return {scope}, which evaluates as {true} and can be used by other
            functions to determine the type of list-item
            */
            return scope;
          }
        }
      }
    }
    return false;
  },

  wrapText: function wrapText(text, token) {
    var length = token.length;
    if (text.substr(0, length) === token && text.substr(-length) === token) {
      return text.substr(length, text.length - length * 2);
    } else {
      return token + text + token;
    }
  },

  isEmbeddedCode: function isEmbeddedCode(editor, range) {
    var scopeDescriptor = editor.scopeDescriptorForBufferPosition(range.end);
    for (var scope of scopeDescriptor.scopes) {
      if (scope.includes('source')) return true;
    }
    return false;
  },

  /*
  Selection are returned in the reverse order that they were created by the
  user. We need them in the reverse order that they appear in the document,
  because we don't need a previous changes selection changing the buffer
  position of our selections.
  */
  getSelectedBufferRangesReversed: function getSelectedBufferRangesReversed(editor) {
    var ranges = editor.getSelectedBufferRanges();
    ranges.sort(function (a, b) {
      if (a.start.row > b.start.row) return -1;
      if (b.start.row > a.start.row) return 1;
      if (a.start.column > b.start.column) return -1;
      return 1;
    });
    return ranges;
  },

  compileGrammar: function compileGrammar() {
    if (atom.inDevMode()) {
      var compiler = new GrammarCompiler();
      compiler.compile();
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1tYXJrZG93bi9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoib0JBRStDLE1BQU07Ozs7QUFGckQsV0FBVyxDQUFBOztBQUtYLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDeEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNsQixlQUFlLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFDOUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFdEIsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFFBQU0sRUFBRTtBQUNOLGdCQUFZLEVBQUU7QUFDWixXQUFLLEVBQUUsb0JBQW9CO0FBQzNCLGlCQUFXLEVBQUUsb0dBQW9HO0FBQ2pILFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsSUFBSTtLQUNkOztBQUVELDBCQUFzQixFQUFFO0FBQ3BCLFdBQUssRUFBRSw4QkFBOEI7QUFDckMsaUJBQVcsRUFBRSx5R0FBeUc7QUFDdEgsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0tBQ2hCOztBQUVELHNCQUFrQixFQUFFO0FBQ2xCLFdBQUssRUFBRSxzQkFBc0I7QUFDN0IsaUJBQVcsRUFBRSwyRkFBMkY7QUFDeEcsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxJQUFJO0tBQ2Q7O0FBRUQscUJBQWlCLEVBQUU7QUFDakIsV0FBSyxFQUFFLG9CQUFvQjtBQUMzQixpQkFBVyxFQUFFLDhLQUE4SztBQUMzTCxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7S0FDZDs7QUFFRCxtQkFBZSxFQUFFO0FBQ2YsV0FBSyxFQUFFLG1CQUFtQjtBQUMxQixpQkFBVyxFQUFFLDRFQUE0RTtBQUN6RixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7S0FDZDs7QUFFRCxpQkFBYSxFQUFFO0FBQ2IsV0FBSyxFQUFFLGdCQUFnQjtBQUN2QixpQkFBVyxFQUFFLHlIQUF5SDtBQUN0SSxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7S0FDZDs7QUFFRCx3QkFBb0IsRUFBRTtBQUNwQixXQUFLLEVBQUUseUJBQXlCO0FBQ2hDLGlCQUFXLEVBQUUsMEZBQTBGO0FBQ3ZHLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsSUFBSTtLQUNkO0dBQ0Y7O0FBRUQsZUFBYSxFQUFFLElBQUk7O0FBRW5CLFVBQVEsRUFBQyxrQkFBQyxLQUFLLEVBQUU7OztBQUNmLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBOzs7Ozs7O0FBUWxCLFFBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsRUFBRTtBQUMzRCxVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUNwRCxZQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQTtPQUM3QztLQUNGOzs7Ozs7QUFNRCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ2pFLFlBQU0sQ0FBQyxlQUFlLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDOUIsWUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFBOztBQUVuQyxZQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFLE9BQU07QUFDdkMsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLEVBQUUsT0FBTTtBQUM5RCxZQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFLE9BQU07Ozs7Ozs7Ozs7Ozs7QUFhL0IsWUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUE7QUFDL0MsWUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3JFLFlBQUksTUFBSyxjQUFjLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLEVBQUUsT0FBTTs7QUFFekQsWUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBOztvQ0FDM0MsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUM7O1lBQTdDLE1BQU0seUJBQU4sTUFBTTs7QUFDWixjQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDaEIsYUFBSyxJQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7QUFDMUIsY0FBSSxhQUFhLEdBQUcsS0FBSyxDQUFBO0FBQ3pCLGNBQUksVUFBVSxHQUFHLEtBQUssQ0FBQTtBQUN0QixjQUFJLFVBQVUsWUFBQSxDQUFBOztBQUVkLGNBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDckMsZUFBSyxJQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7QUFDMUIsZ0JBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7Ozs7OztBQU1oQyxnQkFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO0FBQ25DLDJCQUFhLEdBQUcsSUFBSSxDQUFBO2FBQ3JCLE1BQU0sSUFBSSxhQUFhLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNwRCxrQkFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDOUIsMEJBQVUsR0FBRyxJQUFJLENBQUE7QUFDakIsMEJBQVUsR0FBRyxXQUFXLENBQUE7QUFDeEIsb0JBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUMvQiw0QkFBVSxHQUFHLFNBQVMsQ0FBQTtpQkFDdkI7QUFDRCxvQkFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQ2xDLDRCQUFVLEdBQUcsWUFBWSxDQUFBO2lCQUMxQjtBQUNELHNCQUFLO2VBQ04sTUFBTTtBQUNMLDBCQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLDZCQUFhLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLG9CQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLEVBQUU7QUFDN0Qsd0JBQU0sQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQTtpQkFDbEQ7ZUFDRjthQUNGLE1BQU07QUFDTCwyQkFBYSxHQUFHLEtBQUssQ0FBQTthQUN0QjtXQUNGOztBQUVELGNBQUksVUFBVSxJQUFJLFVBQVUsS0FBSyxZQUFZLEVBQUU7QUFDN0MsZ0JBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUE7QUFDdEIsZ0JBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtBQUM1QixrQkFBTSxPQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtBQUMxQixrQkFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN4QyxrQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzFCLGtCQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLEVBQUU7QUFDN0QscUJBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFBO2VBQ3BCO0FBQ0Qsa0JBQUksR0FBRyxLQUFLLEdBQUcsV0FBVyxDQUFBO0FBQzFCLGtCQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTSxFQUFFO0FBQ3hCLHFCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2pELHNCQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQTtpQkFDbEI7ZUFDRjthQUNGLE1BQU07QUFDTCxrQkFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO2FBQzlCO0FBQ0Qsa0JBQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBQzVCLGtCQUFLO1dBQ047U0FDRjtPQUNGLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQyxDQUFBO0dBQ0o7O0FBRUQsYUFBVyxFQUFDLHVCQUFHOzs7QUFDYixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSwyQkFBMkIsRUFBRSxVQUFDLEtBQUs7YUFBSyxPQUFLLGNBQWMsQ0FBQyxLQUFLLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQTtBQUNqSSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSw0QkFBNEIsRUFBRSxVQUFDLEtBQUs7YUFBSyxPQUFLLGVBQWUsQ0FBQyxLQUFLLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQTtBQUNuSSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBRSxVQUFDLEtBQUs7YUFBSyxPQUFLLGtCQUFrQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQTtBQUNsSSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSwwQkFBMEIsRUFBRSxVQUFDLEtBQUs7YUFBSyxPQUFLLGtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQTtBQUMxSSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSx5QkFBeUIsRUFBRSxVQUFDLEtBQUs7YUFBSyxPQUFLLGtCQUFrQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQTtBQUN6SSxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsVUFBQyxLQUFLO2FBQUssT0FBSyxhQUFhLENBQUMsS0FBSyxDQUFDO0tBQUEsQ0FBQyxDQUFDLENBQUE7QUFDcEgsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsVUFBQyxLQUFLO2FBQUssT0FBSyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztLQUFBLENBQUMsQ0FBQyxDQUFBO0FBQzNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixFQUFFLFVBQUMsS0FBSzthQUFLLE9BQUssVUFBVSxDQUFDLEtBQUssQ0FBQztLQUFBLENBQUMsQ0FBQyxDQUFBOztBQUV4SCxRQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUNwQixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxxQ0FBcUMsRUFBRTtlQUFNLE9BQUssY0FBYyxFQUFFO09BQUEsQ0FBQyxDQUFDLENBQUE7S0FDaEk7R0FDRjs7QUFFRCxnQkFBYyxFQUFDLHdCQUFDLEtBQUssRUFBRTtpQ0FDUSxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDOztRQUF0RCxNQUFNLDBCQUFOLE1BQU07UUFBRSxRQUFRLDBCQUFSLFFBQVE7O0FBQ3hCLFFBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7QUFDNUUsUUFBSSxlQUFlLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDeEQsWUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUN2QyxhQUFNO0tBQ1A7QUFDRCxTQUFLLENBQUMsZUFBZSxFQUFFLENBQUE7R0FDeEI7O0FBRUQsaUJBQWUsRUFBQyx5QkFBQyxLQUFLLEVBQUU7aUNBQ08sSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQzs7UUFBdEQsTUFBTSwwQkFBTixNQUFNO1FBQUUsUUFBUSwwQkFBUixRQUFROztBQUN4QixRQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO0FBQzVFLFFBQUksZUFBZSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxFQUFFO0FBQ3hELFlBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDeEMsYUFBTTtLQUNQO0FBQ0QsU0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFBO0dBQ3hCOztBQUVELG9CQUFrQixFQUFDLDRCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDaEMsUUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFBO0FBQzNCLFFBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsRUFBRTtBQUMxRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDbkQsVUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFNOztBQUVuQixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsK0JBQStCLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDM0QsV0FBSyxJQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7QUFDMUIsWUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFBOzs7Ozs7Ozs7O0FBWS9DLFlBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNsRCxjQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUM5QyxnQkFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUMvQyx5QkFBZSxHQUFHLElBQUksQ0FBQTtTQUN2QjtPQUNGO0tBQ0Y7QUFDRCxRQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3BCLFdBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQTtLQUN4QjtBQUNELFdBQU07R0FDUDs7O0FBR0QsZUFBYSxFQUFDLHVCQUFDLEtBQUssRUFBbUI7UUFBakIsT0FBTyx5REFBRyxLQUFLOztBQUNuQyxRQUFJLGVBQWUsR0FBRyxLQUFLLENBQUE7O0FBRTNCLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFO0FBQ3ZELFdBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUN2QixhQUFNO0tBQ1A7O0FBRUQsUUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ25ELFFBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTTs7QUFFbkIsUUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLCtCQUErQixDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzNELFFBQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixTQUFLLElBQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtBQUMxQixVQUFNLElBQUksR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUE7O0FBRS9DLFVBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNsRCxZQUFNLFVBQVUsR0FBRyxPQUFPLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQTtBQUNyQyxZQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsMEVBQTBFLENBQUMsRUFBRTtBQUMxRixjQUFNLE9BQU8sR0FBTSxVQUFVLFdBQU0sSUFBSSxNQUFHLENBQUE7QUFDMUMsZ0JBQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDM0MsdUJBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtTQUNwQyxNQUFNO0FBQ0wsY0FBTSxPQUFPLEdBQU0sVUFBVSxTQUFJLElBQUksUUFBSyxDQUFBO0FBQzFDLGdCQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQzNDLHVCQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3RCO0FBQ0QsdUJBQWUsR0FBRyxJQUFJLENBQUE7T0FDdkI7S0FDRjs7QUFFRCxRQUFJLGVBQWUsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0FBa0JuQixVQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQTtBQUNuRCxVQUFJLEtBQUssR0FBRyxDQUFDLENBQUE7QUFDYixVQUFJLFdBQVcsR0FBRyxDQUFDLENBQUE7QUFDbkIsV0FBSyxJQUFNLFNBQVMsSUFBSSxVQUFVLEVBQUU7WUFDMUIsS0FBSyxHQUFVLFNBQVMsQ0FBeEIsS0FBSztZQUFFLEdBQUcsR0FBSyxTQUFTLENBQWpCLEdBQUc7O0FBQ2xCLFlBQUksQUFBQyxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQU0sS0FBSyxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBTSxBQUFDLEVBQUU7QUFDNUQsY0FBSSxLQUFLLEVBQUU7QUFDVCxrQkFBTSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFBO1dBQ3hDLE1BQU07QUFDTCxrQkFBTSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFBO1dBQ3RDO1NBQ0YsTUFBTTtBQUNMLGNBQU0sUUFBUSxHQUFHO0FBQ2YsZUFBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHO0FBQ1osa0JBQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUM7V0FDaEQsQ0FBQTtBQUNELGNBQUksS0FBSyxFQUFFO0FBQ1Qsa0JBQU0sQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtXQUMzQyxNQUFNO0FBQ0wsa0JBQU0sQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtXQUN6QztBQUNELHFCQUFXLEVBQUUsQ0FBQTtTQUNkO0FBQ0QsYUFBSyxFQUFFLENBQUM7T0FDVDtLQUNGLE1BQU07QUFDTCxXQUFLLENBQUMsZUFBZSxFQUFFLENBQUE7S0FDeEI7O0FBRUQsV0FBTTtHQUNQOztBQUVELHVCQUFxQixFQUFDLCtCQUFDLEtBQUssRUFBRTtBQUM1QixRQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDbkQsUUFBSSxNQUFNLEVBQUU7QUFDVixVQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQTtBQUNuRCxVQUFJLFNBQVMsRUFBRTtBQUNiLFlBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM3QixlQUFPLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUE7T0FDNUI7S0FDRjtBQUNELFNBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQTtHQUN4Qjs7QUFFRCxZQUFVLEVBQUMsb0JBQUMsS0FBSyxFQUFFO0FBQ2pCLFFBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNuRCxRQUFJLENBQUMsTUFBTSxFQUFFO0FBQ1gsV0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQ3ZCLGFBQU07S0FDUDs7QUFFRCxRQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQTtBQUMvQyxTQUFLLElBQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtVQUNsQixLQUFLLEdBQVUsS0FBSyxDQUFwQixLQUFLO1VBQUUsR0FBRyxHQUFLLEtBQUssQ0FBYixHQUFHOztBQUNsQixXQUFLLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7QUFDL0MsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsRCxZQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3pDLGNBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNwRCxjQUFJLE9BQU8sWUFBQSxDQUFBO0FBQ1gsY0FBSSxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQ2xDLG1CQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUE7V0FDdEQsTUFBTTtBQUNMLG1CQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7V0FDaEQ7QUFDRCxjQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0FBQ2xELGdCQUFNLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1NBQy9DO09BQ0Y7S0FDRjtBQUNELFdBQU07R0FDUDs7QUFFRCxZQUFVLEVBQUMsb0JBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUM1QixRQUFJLE1BQU0sRUFBRTtBQUNWLFVBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7QUFDM0MsWUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGdDQUFnQyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3pFLGFBQUssSUFBTSxLQUFLLElBQUksZUFBZSxDQUFDLE1BQU0sRUFBRTtBQUMxQyxjQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7Ozs7O0FBSzFCLG1CQUFPLEtBQUssQ0FBQztXQUNkO1NBQ0Y7T0FDRjtLQUNGO0FBQ0QsV0FBTyxLQUFLLENBQUE7R0FDYjs7QUFFRCxVQUFRLEVBQUMsa0JBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNyQixRQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFBO0FBQzNCLFFBQUksQUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxLQUFLLElBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssQUFBQyxFQUFFO0FBQzFFLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7S0FDckQsTUFBTTtBQUNMLGFBQU8sS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUE7S0FDNUI7R0FDRjs7QUFFRCxnQkFBYyxFQUFDLHdCQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDN0IsUUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGdDQUFnQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUMxRSxTQUFLLElBQU0sS0FBSyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEVBQUU7QUFDMUMsVUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFBO0tBQzFDO0FBQ0QsV0FBTyxLQUFLLENBQUE7R0FDYjs7Ozs7Ozs7QUFRRCxpQ0FBK0IsRUFBQyx5Q0FBQyxNQUFNLEVBQUU7QUFDdkMsUUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUE7QUFDL0MsVUFBTSxDQUFDLElBQUksQ0FBQyxVQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDekIsVUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQ3hDLFVBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDdkMsVUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQzlDLGFBQU8sQ0FBQyxDQUFBO0tBQ1QsQ0FBQyxDQUFBO0FBQ0YsV0FBTyxNQUFNLENBQUE7R0FDZDs7QUFFRCxnQkFBYyxFQUFDLDBCQUFHO0FBQ2hCLFFBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQ3BCLFVBQU0sUUFBUSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUE7QUFDdEMsY0FBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ25CO0dBQ0Y7Q0FDRixDQUFBIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1tYXJrZG93bi9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpcmVjdG9yeSB9IGZyb20gJ2F0b20nXG4vLyBpbXBvcnQgeyBpc0xpc3RJdGVtLCB3cmFwVGV4dCB9IGZyb20gJy4vZnVuY3Rpb25zJ1xuXG5DU09OID0gcmVxdWlyZSgnc2Vhc29uJylcbmZzID0gcmVxdWlyZSgnZnMnKVxuR3JhbW1hckNvbXBpbGVyID0gcmVxdWlyZSgnLi9HcmFtbWFyQ29tcGlsZXInKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29uZmlnOiB7XG4gICAgYWRkTGlzdEl0ZW1zOiB7XG4gICAgICB0aXRsZTogJ0FkZCBuZXcgbGlzdC1pdGVtcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0F1dG9tYXRpY2FsbHkgYWRkIGEgbmV3IGxpc3QtaXRlbSBhZnRlciB0aGUgY3VycmVudCAobm9uLWVtcHR5KSBvbmUgd2hlbiBwcmVzc2luZyA8a2JkPkVOVEVSPC9rYmQ+JyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuXG4gICAgYXV0b0luY3JlbWVudExpc3RJdGVtczoge1xuICAgICAgICB0aXRsZTogJ0luY3JlbWVudCBPcmRlcmVkIExpc3QgSXRlbXMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0F1dG9tYXRpY2FsbHkgaW5jcmVtZW50IGEgbmV3IGxpc3QtaXRlbSBhZnRlciB0aGUgY3VycmVudChub24tZW1wdHkpIG9uZSB3aGVuIHByZXNzaW5nIDxrYmQ+RU5URVI8L2tiZD4nLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuXG4gICAgZGlzYWJsZUxhbmd1YWdlR2ZtOiB7XG4gICAgICB0aXRsZTogJ0Rpc2FibGUgbGFuZ3VhZ2UtZ2ZtJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSB0aGUgZGVmYXVsdCBgbGFuZ3VhZ2UtZ2ZtYCBwYWNrYWdlIGFzIHRoaXMgcGFja2FnZSBpcyBpbnRlbmRlZCBhcyBpdHMgcmVwbGFjZW1lbnQnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH0sXG5cbiAgICBlbXBoYXNpc1Nob3J0Y3V0czoge1xuICAgICAgdGl0bGU6ICdFbXBoYXNpcyBzaG9ydGN1dHMnLFxuICAgICAgZGVzY3JpcHRpb246ICdFbmFibGVzIGtleWJpbmRpbmdzIGBfYCBmb3IgZW1waGFzaXMsIGAqYCBmb3Igc3Ryb25nIGVtcGhhc2lzLCBhbmQgYH5gIGZvciBzdHJpa2UtdGhyb3VnaCBvbiBzZWxlY3RlZCB0ZXh0OyBlbXBoYXNpemluZyBhbiBhbHJlYWR5IGVtcGhhc2l6ZWQgc2VsZWN0aW9uIHdpbGwgZGUtZW1waGFzaXplIGl0JyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB9LFxuXG4gICAgaW5kZW50TGlzdEl0ZW1zOiB7XG4gICAgICB0aXRsZTogJ0luZGVudCBsaXN0LWl0ZW1zJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXV0b21hdGljYWxseSBpbi0gYW5kIG91dGRlbnQgbGlzdC1pdGVtcyBieSBwcmVzc2luZyBgVEFCYCBhbmQgYFNISUZUK1RBQmAnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH0sXG5cbiAgICBsaW5rU2hvcnRjdXRzOiB7XG4gICAgICB0aXRsZTogJ0xpbmsgc2hvcnRjdXRzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5hYmxlcyBrZXliaW5kaW5ncyBgQGAgZm9yIGNvbnZlcnRpbmcgdGhlIHNlbGVjdGVkIHRleHQgdG8gYSBsaW5rIGFuZCBgIWAgZm9yIGNvbnZlcnRpbmcgdGhlIHNlbGVjdGVkIHRleHQgdG8gYW4gaW1hZ2UnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH0sXG5cbiAgICByZW1vdmVFbXB0eUxpc3RJdGVtczoge1xuICAgICAgdGl0bGU6ICdSZW1vdmUgZW1wdHkgbGlzdC1pdGVtcycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1JlbW92ZSB0aGUgYXV0b21hdGljYWxseSBjcmVhdGVkIGVtcHR5IGxpc3QtaXRlbXMgd2hlbiBsZWZ0IGVtcHR5LCBsZWF2aW5nIGFuIGVtcHR5IGxpbmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cbiAgfSxcblxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGFjdGl2YXRlIChzdGF0ZSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmFkZENvbW1hbmRzKClcblxuICAgIC8qXG4gICAgVW5sZXNzIHlvdSBhcmUgYW4gYWR2YW5jZWQgdXNlciwgdGhlcmUgaXMgbm8gbmVlZCB0byBoYXZlIGJvdGggdGhpcyBwYWNrYWdlXG4gICAgYW5kIHRoZSBvbmUgaXQgcmVwbGFjZXMgKGxhbmd1YWdlLWdmbSkgZW5hYmxlZC5cblxuICAgIElmIHlvdSBhcmUgYW4gYWR2YW5jZWQgdXNlciwgeW91IGNhbiBlYXNpbHkgcmUtZW5hYmxlIGxhbmd1YWdlLWdmbSBhZ2Fpbi5cbiAgICAqL1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2xhbmd1YWdlLW1hcmtkb3duLmRpc2FibGVMYW5ndWFnZUdmbScpKSB7XG4gICAgICBpZiAoIWF0b20ucGFja2FnZXMuaXNQYWNrYWdlRGlzYWJsZWQoJ2xhbmd1YWdlLWdmbScpKSB7XG4gICAgICAgIGF0b20ucGFja2FnZXMuZGlzYWJsZVBhY2thZ2UoJ2xhbmd1YWdlLWdmbScpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICBJIGZvcmdvdCB3aHkgdGhpcyBhY3Rpb24gaXMgY3JlYXRlZCBpbmxpbmUgaW4gYWN0aXZhdGUoKSBhbmQgbm90IGFzIGFcbiAgICBzZXBhcmF0ZSBtZXRob2QsIGJ1dCB0aGVyZSB3YXMgYSBnb29kIHJlYXNvbiBmb3IgaXQuXG4gICAgKi9cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhlZGl0b3IgPT4ge1xuICAgICAgZWRpdG9yLm9uRGlkSW5zZXJ0VGV4dChldmVudCA9PiB7XG4gICAgICAgIGNvbnN0IGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpXG5cbiAgICAgICAgaWYgKGdyYW1tYXIubmFtZSAhPT0gJ01hcmtkb3duJykgcmV0dXJuXG4gICAgICAgIGlmICghYXRvbS5jb25maWcuZ2V0KCdsYW5ndWFnZS1tYXJrZG93bi5hZGRMaXN0SXRlbXMnKSkgcmV0dXJuXG4gICAgICAgIGlmIChldmVudC50ZXh0ICE9PSAnXFxuJykgcmV0dXJuXG5cbiAgICAgICAgLypcbiAgICAgICAgQXQgdGhpcyBwb2ludCwgaXQgaXMgcmF0aGVyIHRlZGlvdXMgKGFzIGZhciBhcyBJIGtub3cpIHRvIGdldCB0byB0aGVcbiAgICAgICAgdG9rZW5pemVkIHZlcnNpb24gb2Yge3ByZXZpb3VzTGluZX0uIFRoYXQgaXMgdGhlIHJlYXNvbiB3aHkge3Rva2Vuc30gYVxuICAgICAgICBsaXR0bGUgZnVydGhlciBkb3duIGlzIHRva2VuaXplZC4gQnV0IGF0IHRoaXMgc3RhZ2UsIHdlIGRvIG5lZWQgdG8ga25vd1xuICAgICAgICBpZiB7cHJldmlvdXNMaW5lfSB3YXMgaW4gZmFjdCBNYXJrZG93biwgb3IgZnJvbSBhIGRpZmZlcmVudCBwZXJzcGVjdGl2ZSxcbiAgICAgICAgbm90IGEgcGllY2Ugb2YgZW1iZWRkZWQgY29kZS4gVGhlIHJlYXNvbiBmb3IgdGhhdCBpcyB0aGF0IHRoZSB0b2tlbml6ZWRcbiAgICAgICAgbGluZSBiZWxvdyBpcyB0b2tlbml6ZWQgd2l0aG91dCBhbnkgY29udGV4dCwgc28gaXMgTWFya2Rvd24gYnkgZGVmYXVsdC5cbiAgICAgICAgVGhlcmVmb3JlIHdlIGRldGVybWluZSBpZiBvdXIgY3VycmVudCBwb3NpdGlvbiBpcyBwYXJ0IG9mIGVtYmVkZGVkIGNvZGVcbiAgICAgICAgb3Igbm90LlxuICAgICAgICAqL1xuXG4gICAgICAgIGNvbnN0IHByZXZpb3VzUm93TnVtYmVyID0gZXZlbnQucmFuZ2Uuc3RhcnQucm93XG4gICAgICAgIGNvbnN0IHByZXZpb3VzUm93UmFuZ2UgPSBlZGl0b3IuYnVmZmVyLnJhbmdlRm9yUm93KHByZXZpb3VzUm93TnVtYmVyKVxuICAgICAgICBpZiAodGhpcy5pc0VtYmVkZGVkQ29kZShlZGl0b3IsIHByZXZpb3VzUm93UmFuZ2UpKSByZXR1cm5cblxuICAgICAgICBjb25zdCBwcmV2aW91c0xpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UocHJldmlvdXNSb3dSYW5nZSlcbiAgICAgICAgbGV0IHsgdG9rZW5zIH0gPSBncmFtbWFyLnRva2VuaXplTGluZShwcmV2aW91c0xpbmUpXG4gICAgICAgIHRva2Vucy5yZXZlcnNlKClcbiAgICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnMpIHtcbiAgICAgICAgICBsZXQgaXNQdW5jdHVhdGlvbiA9IGZhbHNlXG4gICAgICAgICAgbGV0IGlzTGlzdEl0ZW0gPSBmYWxzZVxuICAgICAgICAgIGxldCB0eXBlT2ZMaXN0XG5cbiAgICAgICAgICBjb25zdCBzY29wZXMgPSB0b2tlbi5zY29wZXMucmV2ZXJzZSgpXG4gICAgICAgICAgZm9yIChjb25zdCBzY29wZSBvZiBzY29wZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBzY29wZS5zcGxpdCgnLicpXG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBBIGxpc3QtaXRlbSBpcyB2YWxpZCB3aGVuIGEgcHVuY3R1YXRpb24gY2xhc3MgaXMgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIGZvbGxvd2VkIGJ5IGEgbm9uLWVtcHR5IGxpc3QtaXRlbSBjbGFzcy5cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoY2xhc3Nlcy5pbmNsdWRlcygncHVuY3R1YXRpb24nKSkge1xuICAgICAgICAgICAgICBpc1B1bmN0dWF0aW9uID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1B1bmN0dWF0aW9uICYmIGNsYXNzZXMuaW5jbHVkZXMoJ2xpc3QnKSkge1xuICAgICAgICAgICAgICBpZiAoIWNsYXNzZXMuaW5jbHVkZXMoJ2VtcHR5JykpIHtcbiAgICAgICAgICAgICAgICBpc0xpc3RJdGVtID0gdHJ1ZVxuICAgICAgICAgICAgICAgIHR5cGVPZkxpc3QgPSAndW5vcmRlcmVkJ1xuICAgICAgICAgICAgICAgIGlmIChjbGFzc2VzLmluY2x1ZGVzKCdvcmRlcmVkJykpIHtcbiAgICAgICAgICAgICAgICAgIHR5cGVPZkxpc3QgPSAnb3JkZXJlZCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNsYXNzZXMuaW5jbHVkZXMoJ2RlZmluaXRpb24nKSkge1xuICAgICAgICAgICAgICAgICAgdHlwZU9mTGlzdCA9ICdkZWZpbml0aW9uJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzTGlzdEl0ZW0gPSBmYWxzZVxuICAgICAgICAgICAgICAgIGlzUHVuY3R1YXRpb24gPSBmYWxzZVxuICAgICAgICAgICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2xhbmd1YWdlLW1hcmtkb3duLnJlbW92ZUVtcHR5TGlzdEl0ZW1zJykpIHtcbiAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShwcmV2aW91c1Jvd1JhbmdlLCAnJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlzUHVuY3R1YXRpb24gPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0xpc3RJdGVtICYmIHR5cGVPZkxpc3QgIT09ICdkZWZpbml0aW9uJykge1xuICAgICAgICAgICAgbGV0IHRleHQgPSB0b2tlbi52YWx1ZVxuICAgICAgICAgICAgaWYgKHR5cGVPZkxpc3QgPT09ICdvcmRlcmVkJykge1xuICAgICAgICAgICAgICBjb25zdCBsZW5ndGggPSB0ZXh0Lmxlbmd0aFxuICAgICAgICAgICAgICBjb25zdCBwdW5jdHVhdGlvbiA9IHRleHQubWF0Y2goL1teXFxkXSsvKVxuICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJzZUludCh0ZXh0KVxuICAgICAgICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdsYW5ndWFnZS1tYXJrZG93bi5hdXRvSW5jcmVtZW50TGlzdEl0ZW1zJykpIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGV4dCA9IHZhbHVlICsgcHVuY3R1YXRpb25cbiAgICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0ZXh0Lmxlbmd0aCAtIGxlbmd0aCArIDE7IGorKykge1xuICAgICAgICAgICAgICAgICAgdGV4dCA9ICcwJyArIHRleHRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoJ3gnLCAnICcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCh0ZXh0ICsgJycpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KSlcbiAgfSxcblxuICBhZGRDb21tYW5kcyAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdtYXJrZG93bjppbmRlbnQtbGlzdC1pdGVtJywgKGV2ZW50KSA9PiB0aGlzLmluZGVudExpc3RJdGVtKGV2ZW50KSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdtYXJrZG93bjpvdXRkZW50LWxpc3QtaXRlbScsIChldmVudCkgPT4gdGhpcy5vdXRkZW50TGlzdEl0ZW0oZXZlbnQpKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ21hcmtkb3duOmVtcGhhc2lzJywgKGV2ZW50KSA9PiB0aGlzLmVtcGhhc2l6ZVNlbGVjdGlvbihldmVudCwgJ18nKSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdtYXJrZG93bjpzdHJvbmctZW1waGFzaXMnLCAoZXZlbnQpID0+IHRoaXMuZW1waGFzaXplU2VsZWN0aW9uKGV2ZW50LCAnKionKSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdtYXJrZG93bjpzdHJpa2UtdGhyb3VnaCcsIChldmVudCkgPT4gdGhpcy5lbXBoYXNpemVTZWxlY3Rpb24oZXZlbnQsICd+ficpKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ21hcmtkb3duOmxpbmsnLCAoZXZlbnQpID0+IHRoaXMubGlua1NlbGVjdGlvbihldmVudCkpKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnbWFya2Rvd246aW1hZ2UnLCAoZXZlbnQpID0+IHRoaXMubGlua1NlbGVjdGlvbihldmVudCwgdHJ1ZSkpKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnbWFya2Rvd246dG9nZ2xlLXRhc2snLCAoZXZlbnQpID0+IHRoaXMudG9nZ2xlVGFzayhldmVudCkpKVxuXG4gICAgaWYgKGF0b20uaW5EZXZNb2RlKCkpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ21hcmtkb3duOmNvbXBpbGUtZ3JhbW1hci1hbmQtcmVsb2FkJywgKCkgPT4gdGhpcy5jb21waWxlR3JhbW1hcigpKSlcbiAgICB9XG4gIH0sXG5cbiAgaW5kZW50TGlzdEl0ZW0gKGV2ZW50KSB7XG4gICAgY29uc3QgeyBlZGl0b3IsIHBvc2l0aW9uIH0gPSB0aGlzLl9nZXRFZGl0b3JBbmRQb3NpdGlvbihldmVudClcbiAgICBjb25zdCBpbmRlbnRMaXN0SXRlbXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2xhbmd1YWdlLW1hcmtkb3duLmluZGVudExpc3RJdGVtcycpXG4gICAgaWYgKGluZGVudExpc3RJdGVtcyAmJiB0aGlzLmlzTGlzdEl0ZW0oZWRpdG9yLCBwb3NpdGlvbikpIHtcbiAgICAgIGVkaXRvci5pbmRlbnRTZWxlY3RlZFJvd3MocG9zaXRpb24ucm93KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGV2ZW50LmFib3J0S2V5QmluZGluZygpXG4gIH0sXG5cbiAgb3V0ZGVudExpc3RJdGVtIChldmVudCkge1xuICAgIGNvbnN0IHsgZWRpdG9yLCBwb3NpdGlvbiB9ID0gdGhpcy5fZ2V0RWRpdG9yQW5kUG9zaXRpb24oZXZlbnQpXG4gICAgY29uc3QgaW5kZW50TGlzdEl0ZW1zID0gYXRvbS5jb25maWcuZ2V0KCdsYW5ndWFnZS1tYXJrZG93bi5pbmRlbnRMaXN0SXRlbXMnKVxuICAgIGlmIChpbmRlbnRMaXN0SXRlbXMgJiYgdGhpcy5pc0xpc3RJdGVtKGVkaXRvciwgcG9zaXRpb24pKSB7XG4gICAgICBlZGl0b3Iub3V0ZGVudFNlbGVjdGVkUm93cyhwb3NpdGlvbi5yb3cpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgZXZlbnQuYWJvcnRLZXlCaW5kaW5nKClcbiAgfSxcblxuICBlbXBoYXNpemVTZWxlY3Rpb24gKGV2ZW50LCB0b2tlbikge1xuICAgIGxldCBkaWRTb21lV3JhcHBpbmcgPSBmYWxzZVxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2xhbmd1YWdlLW1hcmtkb3duLmVtcGhhc2lzU2hvcnRjdXRzJykpIHtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgaWYgKCFlZGl0b3IpIHJldHVyblxuXG4gICAgICBjb25zdCByYW5nZXMgPSB0aGlzLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzUmV2ZXJzZWQoZWRpdG9yKVxuICAgICAgZm9yIChjb25zdCByYW5nZSBvZiByYW5nZXMpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgICAgICAgLypcbiAgICAgICAgU2tpcCB0ZXh0cyB0aGF0IGNvbnRhaW4gYSBsaW5lLWJyZWFrLCBvciBhcmUgZW1wdHkuXG4gICAgICAgIE11bHRpLWxpbmUgZW1waGFzaXMgaXMgbm90IHN1cHBvcnRlZCAnYW55d2F5Jy5cblxuICAgICAgICBJZiBhZnRlcndhcmRzIG5vdCBhIHNpbmdsZSBzZWxlY3Rpb24gaGFzIGJlZW4gd3JhcHBlZCwgY2FuY2VsIHRoZSBldmVudFxuICAgICAgICBhbmQgaW5zZXJ0IHRoZSBjaGFyYWN0ZXIgYXMgbm9ybWFsLlxuXG4gICAgICAgIElmIHR3byBjdXJzb3JzIHdlcmUgZm91bmQsIGJ1dCBvbmx5IG9uZSBvZiB0aGVtIHdhcyBhIHNlbGVjdGlvbiwgYW5kIHRoZVxuICAgICAgICBvdGhlciBhIG5vcm1hbCBjdXJzb3IsIHRoZW4gdGhlIG5vcm1hbCBjdXJzb3IgaXMgaWdub3JlZCwgYW5kIHRoZSBzaW5nbGVcbiAgICAgICAgc2VsZWN0aW9uIHdpbGwgYmUgd3JhcHBlZC5cbiAgICAgICAgKi9cbiAgICAgICAgaWYgKHRleHQubGVuZ3RoICE9PSAwICYmIHRleHQuaW5kZXhPZignXFxuJykgPT09IC0xKSB7XG4gICAgICAgICAgY29uc3Qgd3JhcHBlZFRleHQgPSB0aGlzLndyYXBUZXh0KHRleHQsIHRva2VuKVxuICAgICAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSwgd3JhcHBlZFRleHQpXG4gICAgICAgICAgZGlkU29tZVdyYXBwaW5nID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghZGlkU29tZVdyYXBwaW5nKSB7XG4gICAgICBldmVudC5hYm9ydEtleUJpbmRpbmcoKVxuICAgIH1cbiAgICByZXR1cm5cbiAgfSxcblxuICAvLyBUT0RPOiBEb2Vzbid0IHBsYWNlIHRoZSBjdXJzb3IgYXQgdGhlIHJpZ2h0IHBvc2l0aW9uIGFmdGVyd2FyZHNcbiAgbGlua1NlbGVjdGlvbiAoZXZlbnQsIGlzSW1hZ2UgPSBmYWxzZSkge1xuICAgIGxldCBkaWRTb21lV3JhcHBpbmcgPSBmYWxzZVxuXG4gICAgaWYgKCFhdG9tLmNvbmZpZy5nZXQoJ2xhbmd1YWdlLW1hcmtkb3duLmxpbmtTaG9ydGN1dHMnKSkge1xuICAgICAgZXZlbnQuYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmICghZWRpdG9yKSByZXR1cm5cblxuICAgIGNvbnN0IHJhbmdlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXNSZXZlcnNlZChlZGl0b3IpXG4gICAgY29uc3QgY3Vyc29yT2Zmc2V0cyA9IFtdXG4gICAgZm9yIChjb25zdCByYW5nZSBvZiByYW5nZXMpIHtcbiAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gICAgICAvLyBTZWUge2VtcGhhc2l6ZVNlbGVjdGlvbn1cbiAgICAgIGlmICh0ZXh0Lmxlbmd0aCAhPT0gMCAmJiB0ZXh0LmluZGV4T2YoJ1xcbicpID09PSAtMSkge1xuICAgICAgICBjb25zdCBpbWFnZVRva2VuID0gaXNJbWFnZSA/ICchJyA6ICcnXG4gICAgICAgIGlmICh0ZXh0Lm1hdGNoKC9bLWEtekEtWjAtOUA6JS5fXFwrfiM9XXsyLDI1Nn1cXC5bYS16XXsyLDZ9XFxiKFstYS16QS1aMC05QDolX1xcKy5+Iz8mLy89XSopLykpIHtcbiAgICAgICAgICBjb25zdCBuZXdUZXh0ID0gYCR7aW1hZ2VUb2tlbn1bXSgke3RleHR9KWBcbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UsIG5ld1RleHQpXG4gICAgICAgICAgY3Vyc29yT2Zmc2V0cy5wdXNoKHRleHQubGVuZ3RoICsgMylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBuZXdUZXh0ID0gYCR7aW1hZ2VUb2tlbn1bJHt0ZXh0fV0oKWBcbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UsIG5ld1RleHQpXG4gICAgICAgICAgY3Vyc29yT2Zmc2V0cy5wdXNoKDEpXG4gICAgICAgIH1cbiAgICAgICAgZGlkU29tZVdyYXBwaW5nID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaWRTb21lV3JhcHBpbmcpIHtcbiAgICAgIC8qXG4gICAgICBDdXJzb3JzIGFyZW4ndCBzZXBhcmF0ZSBlbnRpdGllcywgYnV0IHJhdGhlciBzaW1wbGUge1BvaW50fXMsIGllLFxuICAgICAgcG9zaXRpb25zIGluIHRoZSBidWZmZXIuIFRoZXJlIGlzIG5vIHdheSBvZiB1cGRhdGluZyBhIGN1cnNvci4gSW5zdGVhZCxcbiAgICAgIHdlIGNsZWFyIGFsbCBjdXJzb3JzLCBhbmQgdGhlbiByZS1jcmVhdGUgdGhlbSBmcm9tIHdoZXJlIG91ciBjdXJyZW50XG4gICAgICBzZWxlY3Rpb25zIGFyZS5cblxuICAgICAgQWZ0ZXIgdGhlIGltYWdlL2xpbmsgd3JhcHBpbmcgYWJvdmUsIHRoZSBjdXJzb3IgYXJlIHBvc2l0aW9uZWQgYWZ0ZXIgdGhlXG4gICAgICBzZWxlY3Rpb25zLCBhbmQgdGhlIGRlc2lyZWQgcmVsYXRpdmUgbG9jYXRpb25zIGZvciB0aGUgbmV3IGN1cnNvcnMgYXJlXG4gICAgICBzdG9yZWQgaW4ge2N1cnNvck9mZnNldHN9LiBXZSBvbmx5IG5lZWQgdG8gbG9vcCB0aHJvdWdoIHRoZSBjdXJyZW50XG4gICAgICBzZWxlY3Rpb25zLCBhbmQgY3JlYXRlIGEgbmV3IGN1cnNvciBmb3IgZXZlcnkgc2VsZWN0aW9uLlxuXG4gICAgICBBIHNlbGVjdGlvbiB3aXRob3V0IGEgbGVuZ3RoIGlzIGEgc2ltcGxlIGN1cnNvciB0aGF0IGNhbiBiZSByZS1jcmVhdGVkIGF0XG4gICAgICB0aGF0IGV4YWN0IGxvY2F0aW9uLlxuXG4gICAgICBUT0RPOiBtYXliZSBvbmUgb2YgdGhvc2UgZmFuY3kgZ2VuZXJhdG9ycyBjYW4gYmUgdXNlZCBmb3Igb3VyXG4gICAgICBjdXJzb3JPZmZzZXRzP1xuICAgICAgKi9cbiAgICAgIGNvbnN0IHNlbGVjdGlvbnMgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKVxuICAgICAgbGV0IGNvdW50ID0gMFxuICAgICAgbGV0IG9mZnNldENvdW50ID0gMFxuICAgICAgZm9yIChjb25zdCBzZWxlY3Rpb24gb2Ygc2VsZWN0aW9ucykge1xuICAgICAgICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IHNlbGVjdGlvblxuICAgICAgICBpZiAoKHN0YXJ0LnJvdyA9PT0gZW5kLnJvdykgJiYgKHN0YXJ0LmNvbHVtbiA9PT0gZW5kLmNvbHVtbikpIHtcbiAgICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uKHN0YXJ0KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oc3RhcnQpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge1xuICAgICAgICAgICAgcm93OiBlbmQucm93LFxuICAgICAgICAgICAgY29sdW1uOiBlbmQuY29sdW1uIC0gY3Vyc29yT2Zmc2V0c1tvZmZzZXRDb3VudF1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvdW50KSB7XG4gICAgICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbihwb3NpdGlvbilcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgICAgIH1cbiAgICAgICAgICBvZmZzZXRDb3VudCsrXG4gICAgICAgIH1cbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQuYWJvcnRLZXlCaW5kaW5nKClcbiAgICB9XG5cbiAgICByZXR1cm5cbiAgfSxcblxuICBfZ2V0RWRpdG9yQW5kUG9zaXRpb24gKGV2ZW50KSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKGVkaXRvcikge1xuICAgICAgY29uc3QgcG9zaXRpb25zID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpXG4gICAgICBpZiAocG9zaXRpb25zKSB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gcG9zaXRpb25zWzBdXG4gICAgICAgIHJldHVybiB7IGVkaXRvciwgcG9zaXRpb24gfVxuICAgICAgfVxuICAgIH1cbiAgICBldmVudC5hYm9ydEtleUJpbmRpbmcoKVxuICB9LFxuXG4gIHRvZ2dsZVRhc2sgKGV2ZW50KSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIGV2ZW50LmFib3J0S2V5QmluZGluZygpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCByYW5nZXMgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKVxuICAgIGZvciAoY29uc3QgcmFuZ2Ugb2YgcmFuZ2VzKSB7XG4gICAgICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IHJhbmdlXG4gICAgICBmb3IgKGxldCByb3cgPSBzdGFydC5yb3c7IHJvdyA8PSBlbmQucm93OyByb3crKykge1xuICAgICAgICBjb25zdCBsaXN0SXRlbSA9IHRoaXMuaXNMaXN0SXRlbShlZGl0b3IsIFtyb3csIDBdKVxuICAgICAgICBpZiAobGlzdEl0ZW0gJiYgbGlzdEl0ZW0uaW5jbHVkZXMoJ3Rhc2snKSkge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRMaW5lID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdylcbiAgICAgICAgICBsZXQgbmV3TGluZVxuICAgICAgICAgIGlmIChsaXN0SXRlbS5pbmNsdWRlcygnY29tcGxldGVkJykpIHtcbiAgICAgICAgICAgIG5ld0xpbmUgPSBjdXJyZW50TGluZS5yZXBsYWNlKC8gXFxbKHh8WClcXF0gLywgJyBbIF0gJylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3TGluZSA9IGN1cnJlbnRMaW5lLnJlcGxhY2UoJyBbIF0gJywgJyBbeF0gJylcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgbmV3UmFuZ2UgPSBbW3JvdywgMF0sIFtyb3csIG5ld0xpbmUubGVuZ3RoXV1cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UobmV3UmFuZ2UsIG5ld0xpbmUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuXG4gIH0sXG5cbiAgaXNMaXN0SXRlbSAoZWRpdG9yLCBwb3NpdGlvbikge1xuICAgIGlmIChlZGl0b3IpIHtcbiAgICAgIGlmIChlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWUgPT09ICdNYXJrZG93bicpIHtcbiAgICAgICAgY29uc3Qgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgICBmb3IgKGNvbnN0IHNjb3BlIG9mIHNjb3BlRGVzY3JpcHRvci5zY29wZXMpIHtcbiAgICAgICAgICBpZiAoc2NvcGUuaW5jbHVkZXMoJ2xpc3QnKSkge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIFJldHVybiB7c2NvcGV9LCB3aGljaCBldmFsdWF0ZXMgYXMge3RydWV9IGFuZCBjYW4gYmUgdXNlZCBieSBvdGhlclxuICAgICAgICAgICAgZnVuY3Rpb25zIHRvIGRldGVybWluZSB0aGUgdHlwZSBvZiBsaXN0LWl0ZW1cbiAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gc2NvcGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9LFxuXG4gIHdyYXBUZXh0ICh0ZXh0LCB0b2tlbikge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRva2VuLmxlbmd0aFxuICAgIGlmICgodGV4dC5zdWJzdHIoMCwgbGVuZ3RoKSA9PT0gdG9rZW4pICYmICh0ZXh0LnN1YnN0cigtbGVuZ3RoKSA9PT0gdG9rZW4pKSB7XG4gICAgICByZXR1cm4gdGV4dC5zdWJzdHIobGVuZ3RoLCB0ZXh0Lmxlbmd0aCAtIGxlbmd0aCAqIDIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0b2tlbiArIHRleHQgKyB0b2tlblxuICAgIH1cbiAgfSxcblxuICBpc0VtYmVkZGVkQ29kZSAoZWRpdG9yLCByYW5nZSkge1xuICAgIGNvbnN0IHNjb3BlRGVzY3JpcHRvciA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihyYW5nZS5lbmQpXG4gICAgZm9yIChjb25zdCBzY29wZSBvZiBzY29wZURlc2NyaXB0b3Iuc2NvcGVzKSB7XG4gICAgICBpZiAoc2NvcGUuaW5jbHVkZXMoJ3NvdXJjZScpKSByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICAvKlxuICBTZWxlY3Rpb24gYXJlIHJldHVybmVkIGluIHRoZSByZXZlcnNlIG9yZGVyIHRoYXQgdGhleSB3ZXJlIGNyZWF0ZWQgYnkgdGhlXG4gIHVzZXIuIFdlIG5lZWQgdGhlbSBpbiB0aGUgcmV2ZXJzZSBvcmRlciB0aGF0IHRoZXkgYXBwZWFyIGluIHRoZSBkb2N1bWVudCxcbiAgYmVjYXVzZSB3ZSBkb24ndCBuZWVkIGEgcHJldmlvdXMgY2hhbmdlcyBzZWxlY3Rpb24gY2hhbmdpbmcgdGhlIGJ1ZmZlclxuICBwb3NpdGlvbiBvZiBvdXIgc2VsZWN0aW9ucy5cbiAgKi9cbiAgZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXNSZXZlcnNlZCAoZWRpdG9yKSB7XG4gICAgY29uc3QgcmFuZ2VzID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKClcbiAgICByYW5nZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICBpZiAoYS5zdGFydC5yb3cgPiBiLnN0YXJ0LnJvdykgcmV0dXJuIC0xXG4gICAgICBpZiAoYi5zdGFydC5yb3cgPiBhLnN0YXJ0LnJvdykgcmV0dXJuIDFcbiAgICAgIGlmIChhLnN0YXJ0LmNvbHVtbiA+IGIuc3RhcnQuY29sdW1uKSByZXR1cm4gLTFcbiAgICAgIHJldHVybiAxXG4gICAgfSlcbiAgICByZXR1cm4gcmFuZ2VzXG4gIH0sXG5cbiAgY29tcGlsZUdyYW1tYXIgKCkge1xuICAgIGlmIChhdG9tLmluRGV2TW9kZSgpKSB7XG4gICAgICBjb25zdCBjb21waWxlciA9IG5ldyBHcmFtbWFyQ29tcGlsZXIoKVxuICAgICAgY29tcGlsZXIuY29tcGlsZSgpXG4gICAgfVxuICB9XG59XG4iXX0=