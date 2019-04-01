(function() {
  var mustacheparser, phpechoparser, ref, underscoretemplateparser, xmlcdataparser, xmlcommentparser, xmlparser;

  ref = require('./parsers'), xmlparser = ref.xmlparser, xmlcdataparser = ref.xmlcdataparser, xmlcommentparser = ref.xmlcommentparser, underscoretemplateparser = ref.underscoretemplateparser, mustacheparser = ref.mustacheparser, phpechoparser = ref.phpechoparser;

  module.exports = {
    parsers: [xmlparser, xmlcdataparser, xmlcommentparser, underscoretemplateparser, mustacheparser, phpechoparser],
    disposable: {},
    config: {
      completionMode: {
        title: "Completion Mode",
        description: "Choose immediate to have your tags completed immediately after you type '</' (the traditional way). Choose suggest to have them appear in an autocomplete suggestion box.",
        type: "string",
        "default": "Immediate",
        "enum": ["Immediate", "Suggest"],
        order: 1
      },
      emptyTags: {
        title: "Empty tags",
        description: "A space separated list of elements to be ignored from auto-closing.",
        type: "string",
        "default": ["!doctype", "br", "hr", "img", "input", "link", "meta", "area", "base", "col", "command", "embed", "keygen", "param", "source", "track", "wbr"].join(" "),
        order: 2
      },
      returnCursor: {
        title: "Return cursor",
        description: "Returns the cursor to the beginning of the closing tag after it's been inserted (does not work in suggest mode)",
        type: "boolean",
        "default": false,
        order: 3
      }
    },
    deactivate: function(state) {
      var j, key, len, ref1, results;
      ref1 = Object.keys(this.disposable);
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        key = ref1[j];
        this.disposable[key].dispose();
        results.push(delete this.disposable[key]);
      }
      return results;
    },
    activate: function(state) {
      atom.config.observe("less-than-slash.emptyTags", function(value) {
        var tag;
        return xmlparser.emptyTags = (function() {
          var j, len, ref1, results;
          ref1 = value.split(/\s*[\s,|]+\s*/);
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            tag = ref1[j];
            results.push(tag.toLowerCase());
          }
          return results;
        })();
      });
      atom.config.observe("less-than-slash.completionMode", (function(_this) {
        return function(value) {
          mustacheparser.omitClosingBraces = value.toLowerCase() === "immediate";
          return _this.forceComplete = value.toLowerCase() === "immediate";
        };
      })(this));
      atom.config.observe("less-than-slash.returnCursor", (function(_this) {
        return function(value) {
          return _this.returnCursor = value;
        };
      })(this));
      this.disposable._root = atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this.disposable[editor.id] = editor.onWillInsertText(function(event) {
            var _, completion, completions, cursors, i, line, parser, position, prefix, ref1;
            if (!_this.forceComplete) {
              return;
            }
            cursors = editor.getCursorBufferPositions();
            completions = [];
            for (i in cursors) {
              position = cursors[i];
              line = editor.getTextInRange([[position.row, 0], position]) + event.text;
              ref1 = _this.parsers;
              for (_ in ref1) {
                parser = ref1[_];
                if (prefix = _this.matchPrefix(line, parser)) {
                  if (completion = _this.getCompletion(editor, position, prefix)) {
                    completions.push({
                      position: position,
                      prefix: prefix,
                      completion: completion
                    });
                    break;
                  }
                }
              }
            }
            if (completions.length) {
              return editor.transact(function() {
                var j, ref2, ref3;
                for (i in completions) {
                  ref2 = completions[i], position = ref2.position, prefix = ref2.prefix, completion = ref2.completion;
                  event.cancel();
                  editor.setCursorBufferPosition(position);
                  for (_ = j = 0, ref3 = prefix.length - event.text.length; 0 <= ref3 ? j < ref3 : j > ref3; _ = 0 <= ref3 ? ++j : --j) {
                    editor.backspace();
                  }
                  editor.insertText(completion);
                  if (_this.returnCursor) {
                    editor.moveLeft(completion.length);
                  }
                  cursors.splice(i, 1, editor.getCursorBufferPosition());
                }
                if (cursors.length > 1) {
                  return cursors.forEach(function(position, i) {
                    return editor.addCursorAtBufferPosition(position);
                  });
                }
              });
            }
          });
          return editor.onDidDestroy(function(event) {
            if (_this.disposable[editor.id]) {
              _this.disposable[editor.id].dispose();
              return delete _this.disposable[editor.id];
            }
          });
        };
      })(this));
      return this.provider = {
        selector: ".text, .source",
        inclusionPriority: 1,
        excludeLowerPriority: false,
        getSuggestions: (function(_this) {
          return function(arg) {
            var activatedManually, bufferPosition, completion, editor, prefix, scopeDescriptor;
            editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, activatedManually = arg.activatedManually;
            if (_this.forceComplete) {
              return [];
            }
            if (prefix = _this.getPrefix(editor, bufferPosition, _this.parsers)) {
              if (completion = _this.getCompletion(editor, bufferPosition, prefix)) {
                return [
                  {
                    text: completion,
                    prefix: !activatedManually ? prefix : void 0,
                    type: 'tag'
                  }
                ];
              }
            }
          };
        })(this)
      };
    },
    getCompletion: function(editor, bufferPosition, prefix) {
      var tagDescriptor, text, unclosedTags;
      text = editor.getTextInRange([[0, 0], bufferPosition]);
      unclosedTags = this.reduceTags(this.traverse(text, this.parsers));
      if (tagDescriptor = unclosedTags.pop()) {
        if (this.matchPrefix(prefix, this.getParser(tagDescriptor.type, this.parsers))) {
          return this.getParser(tagDescriptor.type, this.parsers).getPair(tagDescriptor);
        }
      }
      return null;
    },
    provide: function() {
      return this.provider;
    },
    traverse: function(text, parsers) {
      var index, newIndex, parser, tagDescriptor, tags;
      tags = [];
      while (true) {
        if (text === '') {
          break;
        }
        newIndex = 1;
        for (index in parsers) {
          parser = parsers[index];
          if (text.match(parser.test)) {
            if (tagDescriptor = parser.parse(text)) {
              tags.push(tagDescriptor);
              newIndex = tagDescriptor.length;
              break;
            }
          }
        }
        text = text.substr(newIndex);
      }
      return tags;
    },
    reduceTags: function(tags) {
      var _result, foundMatchingTag, previous, result, tag;
      result = [];
      while (true) {
        tag = tags.shift();
        if (!tag) {
          break;
        }
        switch (false) {
          case !tag.opening:
            result.push(tag);
            break;
          case !tag.closing:
            _result = result.slice();
            foundMatchingTag = false;
            while (result.length) {
              previous = result.pop();
              if (previous.element === tag.element && previous.type === tag.type) {
                foundMatchingTag = true;
                break;
              }
            }
            if (!foundMatchingTag) {
              result = _result;
            }
            break;
          case !tag.selfClosing:
            break;
          default:
            throw new Error("Invalid parse");
        }
      }
      return result;
    },
    getPrefix: function(editor, bufferPosition, parsers) {
      var index, line, match, parser;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      for (index in parsers) {
        parser = parsers[index];
        if (match = this.matchPrefix(line, parser)) {
          return match;
        }
      }
      return false;
    },
    matchPrefix: function(text, parser) {
      var ref1;
      if (typeof parser.trigger === 'function') {
        return parser.trigger(text);
      } else {
        return (ref1 = text.match(parser.trigger)) != null ? ref1[0] : void 0;
      }
    },
    getParser: function(name, parsers) {
      var index, parser;
      for (index in parsers) {
        parser = parsers[index];
        if (parser.name === name) {
          return parser;
        }
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2xlc3MtdGhhbi1zbGFzaC9saWIvbGVzcy10aGFuLXNsYXNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQTtBQUFBLE1BQUE7O0VBQUEsTUFPSSxPQUFBLENBQVEsV0FBUixDQVBKLEVBQ0UseUJBREYsRUFFRSxtQ0FGRixFQUdFLHVDQUhGLEVBSUUsdURBSkYsRUFLRSxtQ0FMRixFQU1FOztFQUdGLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxPQUFBLEVBQVMsQ0FDUCxTQURPLEVBRVAsY0FGTyxFQUdQLGdCQUhPLEVBSVAsd0JBSk8sRUFLUCxjQUxPLEVBTVAsYUFOTyxDQUFUO0lBU0EsVUFBQSxFQUFZLEVBVFo7SUFXQSxNQUFBLEVBQ0U7TUFBQSxjQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8saUJBQVA7UUFDQSxXQUFBLEVBQWEsMktBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsV0FIVDtRQUlBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxXQUFELEVBQWMsU0FBZCxDQUpOO1FBS0EsS0FBQSxFQUFPLENBTFA7T0FERjtNQU9BLFNBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxZQUFQO1FBQ0EsV0FBQSxFQUFhLHFFQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQ1AsVUFETyxFQUVQLElBRk8sRUFHUCxJQUhPLEVBSVAsS0FKTyxFQUtQLE9BTE8sRUFNUCxNQU5PLEVBT1AsTUFQTyxFQVFQLE1BUk8sRUFTUCxNQVRPLEVBVVAsS0FWTyxFQVdQLFNBWE8sRUFZUCxPQVpPLEVBYVAsUUFiTyxFQWNQLE9BZE8sRUFlUCxRQWZPLEVBZ0JQLE9BaEJPLEVBaUJQLEtBakJPLENBa0JSLENBQUMsSUFsQk8sQ0FrQkYsR0FsQkUsQ0FIVDtRQXNCQSxLQUFBLEVB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ckJVLENBM0paO0lBbUxBLFNBQUEsRUFBVyxTQUFDLE1BQUQsRUFBUyxjQUFULEVBQXlCLE9BQXpCO0FBQ1QsVUFBQTtNQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLENBQUMsY0FBYyxDQUFDLEdBQWhCLEVBQXFCLENBQXJCLENBQUQsRUFBMEIsY0FBMUIsQ0FBdEI7QUFDUCxXQUFBLGdCQUFBOztRQUNFLElBQUcsS0FBQSxHQUFRLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBYixFQUFtQixNQUFuQixDQUFYO0FBQ0UsaUJBQU8sTUFEVDs7QUFERjtBQUdBLGFBQU87SUFMRSxDQW5MWDtJQTBMQSxXQUFBLEVBQWEsU0FBQyxJQUFELEVBQU8sTUFBUDtBQUNYLFVBQUE7TUFBQSxJQUFHLE9BQU8sTUFBTSxDQUFDLE9BQWQsS0FBeUIsVUFBNUI7ZUFBNEMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFmLEVBQTVDO09BQUEsTUFBQTtpRUFBa0csQ0FBQSxDQUFBLFdBQWxHOztJQURXLENBMUxiO0lBNkxBLFNBQUEsRUFBVyxTQUFDLElBQUQsRUFBTyxPQUFQO0FBQ1QsVUFBQTtBQUFBLFdBQUEsZ0JBQUE7O1FBQ0UsSUFBRyxNQUFNLENBQUMsSUFBUCxLQUFlLElBQWxCO0FBQ0UsaUJBQU8sT0FEVDs7QUFERjthQUdBO0lBSlMsQ0E3TFg7O0FBWEYiLCJzb3VyY2VzQ29udGVudCI6WyIjI1xuIyBmaWxlOiBsZXNzLXRoYW4tc2xhc2guY29mZmVlXG4jIGF1dGhvcjogQG1yaGFubG9uXG4jXG5cbntcbiAgeG1scGFyc2VyLFxuICB4bWxjZGF0YXBhcnNlcixcbiAgeG1sY29tbWVudHBhcnNlcixcbiAgdW5kZXJzY29yZXRlbXBsYXRlcGFyc2VyLFxuICBtdXN0YWNoZXBhcnNlcixcbiAgcGhwZWNob3BhcnNlclxufSA9IHJlcXVpcmUgJy4vcGFyc2VycydcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIHBhcnNlcnM6IFtcbiAgICB4bWxwYXJzZXIsXG4gICAgeG1sY2RhdGFwYXJzZXIsXG4gICAgeG1sY29tbWVudHBhcnNlcixcbiAgICB1bmRlcnNjb3JldGVtcGxhdGVwYXJzZXIsXG4gICAgbXVzdGFjaGVwYXJzZXIsXG4gICAgcGhwZWNob3BhcnNlclxuICBdXG5cbiAgZGlzcG9zYWJsZToge31cblxuICBjb25maWc6XG4gICAgY29tcGxldGlvbk1vZGU6XG4gICAgICB0aXRsZTogXCJDb21wbGV0aW9uIE1vZGVcIlxuICAgICAgZGVzY3JpcHRpb246IFwiQ2hvb3NlIGltbWVkaWF0ZSB0byBoYXZlIHlvdXIgdGFncyBjb21wbGV0ZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgeW91IHR5cGUgJzwvJyAodGhlIHRyYWRpdGlvbmFsIHdheSkuIENob29zZSBzdWdnZXN0IHRvIGhhdmUgdGhlbSBhcHBlYXIgaW4gYW4gYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gYm94LlwiXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogXCJJbW1lZGlhdGVcIlxuICAgICAgZW51bTogW1wiSW1tZWRpYXRlXCIsIFwiU3VnZ2VzdFwiXVxuICAgICAgb3JkZXI6IDFcbiAgICBlbXB0eVRhZ3M6XG4gICAgICB0aXRsZTogXCJFbXB0eSB0YWdzXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgZWxlbWVudHMgdG8gYmUgaWdub3JlZCBmcm9tIGF1dG8tY2xvc2luZy5cIlxuICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgZGVmYXVsdDogW1xuICAgICAgICBcIiFkb2N0eXBlXCIsXG4gICAgICAgIFwiYnJcIixcbiAgICAgICAgXCJoclwiLFxuICAgICAgICBcImltZ1wiLFxuICAgICAgICBcImlucHV0XCIsXG4gICAgICAgIFwibGlua1wiLFxuICAgICAgICBcIm1ldGFcIixcbiAgICAgICAgXCJhcmVhXCIsXG4gICAgICAgIFwiYmFzZVwiLFxuICAgICAgICBcImNvbFwiLFxuICAgICAgICBcImNvbW1hbmRcIixcbiAgICAgICAgXCJlbWJlZFwiLFxuICAgICAgICBcImtleWdlblwiLFxuICAgICAgICBcInBhcmFtXCIsXG4gICAgICAgIFwic291cmNlXCIsXG4gICAgICAgIFwidHJhY2tcIixcbiAgICAgICAgXCJ3YnJcIlxuICAgICAgXS5qb2luKFwiIFwiKVxuICAgICAgb3JkZXI6IDJcbiAgICByZXR1cm5DdXJzb3I6XG4gICAgICB0aXRsZTogXCJSZXR1cm4gY3Vyc29yXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlJldHVybnMgdGhlIGN1cnNvciB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBjbG9zaW5nIHRhZyBhZnRlciBpdCdzIGJlZW4gaW5zZXJ0ZWQgKGRvZXMgbm90IHdvcmsgaW4gc3VnZ2VzdCBtb2RlKVwiXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIG9yZGVyOiAzXG5cbiAgZGVhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIGZvciBrZXkgaW4gT2JqZWN0LmtleXMgQGRpc3Bvc2FibGVcbiAgICAgIEBkaXNwb3NhYmxlW2tleV0uZGlzcG9zZSgpXG4gICAgICBkZWxldGUgQGRpc3Bvc2FibGVba2V5XVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgIyBSZWdpc3RlciBjb25maWcgY2hhbmdlIGhhbmRsZXIgdG8gdXBkYXRlIHRoZSBlbXB0eSB0YWdzIGxpc3RcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlIFwibGVzcy10aGFuLXNsYXNoLmVtcHR5VGFnc1wiLCAodmFsdWUpIC0+XG4gICAgICB4bWxwYXJzZXIuZW1wdHlUYWdzID0gKHRhZy50b0xvd2VyQ2FzZSgpIGZvciB0YWcgaW4gdmFsdWUuc3BsaXQoL1xccypbXFxzLHxdK1xccyovKSlcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlIFwibGVzcy10aGFuLXNsYXNoLmNvbXBsZXRpb25Nb2RlXCIsICh2YWx1ZSkgPT5cbiAgICAgIG11c3RhY2hlcGFyc2VyLm9taXRDbG9zaW5nQnJhY2VzID0gdmFsdWUudG9Mb3dlckNhc2UoKSBpcyBcImltbWVkaWF0ZVwiXG4gICAgICBAZm9yY2VDb21wbGV0ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCkgaXMgXCJpbW1lZGlhdGVcIlxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgXCJsZXNzLXRoYW4tc2xhc2gucmV0dXJuQ3Vyc29yXCIsICh2YWx1ZSkgPT5cbiAgICAgIEByZXR1cm5DdXJzb3IgPSB2YWx1ZVxuXG4gICAgQGRpc3Bvc2FibGUuX3Jvb3QgPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIEBkaXNwb3NhYmxlW2VkaXRvci5pZF0gPSBlZGl0b3Iub25XaWxsSW5zZXJ0VGV4dCAoZXZlbnQpID0+XG4gICAgICAgICMgSWYgaW4gc3VnZ2VzdCBtb2RlLCB0aGUgYXV0b2NvbXBsZXRlIHByb3ZpZGVyIHdpbGwgYmUgaW52b2tlZCBpbnN0ZWFkXG4gICAgICAgIGlmIG5vdCBAZm9yY2VDb21wbGV0ZSB0aGVuIHJldHVyblxuXG4gICAgICAgIGN1cnNvcnMgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKClcbiAgICAgICAgY29tcGxldGlvbnMgPSBbXVxuXG4gICAgICAgICMgQ2hlY2sgY3Vyc29yIHBvc2l0aW9ucyB0byBzZWUgaWYgdGhleSBuZWVkIGEgY29tcGxldGlvblxuICAgICAgICBmb3IgaSwgcG9zaXRpb24gb2YgY3Vyc29yc1xuICAgICAgICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1twb3NpdGlvbi5yb3csIDBdLCBwb3NpdGlvbl0pICsgZXZlbnQudGV4dFxuXG4gICAgICAgICAgZm9yIF8sIHBhcnNlciBvZiBAcGFyc2Vyc1xuICAgICAgICAgICAgIyBDaGVjayBpZiB0aGlzIG1pZ2h0IHRyaWdnZXIgYSBjb21wbGV0aW9uXG4gICAgICAgICAgICBpZiBwcmVmaXggPSBAbWF0Y2hQcmVmaXggbGluZSwgcGFyc2VyXG4gICAgICAgICAgICAgICMgR2VuZXJhdGUgYSBjb21wbGV0aW9uIGlmIHBvc3NpYmxlXG4gICAgICAgICAgICAgIGlmIGNvbXBsZXRpb24gPSBAZ2V0Q29tcGxldGlvbihlZGl0b3IsIHBvc2l0aW9uLCBwcmVmaXgpXG4gICAgICAgICAgICAgICAgY29tcGxldGlvbnMucHVzaCh7cG9zaXRpb24sIHByZWZpeCwgY29tcGxldGlvbn0pXG4gICAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAjIEFwcGx5IGFsbCBjb21wbGV0aW9ucyBpbiBhIHNpbmdsZSB0cmFuc2FjdGlvblxuICAgICAgICBpZiBjb21wbGV0aW9ucy5sZW5ndGhcbiAgICAgICAgICBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgICAgICAgIGZvciBpLCB7cG9zaXRpb24sIHByZWZpeCwgY29tcGxldGlvbn0gb2YgY29tcGxldGlvbnNcbiAgICAgICAgICAgICAgIyBFZGl0IGluIHRoZSBuZXcgdGV4dFxuICAgICAgICAgICAgICBldmVudC5jYW5jZWwoKVxuICAgICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24pXG4gICAgICAgICAgICAgIGZvciBfIGluIFswLi4uKHByZWZpeC5sZW5ndGggLSBldmVudC50ZXh0Lmxlbmd0aCldXG4gICAgICAgICAgICAgICAgZWRpdG9yLmJhY2tzcGFjZSgpXG4gICAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KGNvbXBsZXRpb24pXG5cbiAgICAgICAgICAgICAgIyBQbGFjZSB0aGUgY3Vyc29yIGJlZm9yZSB0aGUgY29tcGxldGlvbiBpZiBuZWVkZWRcbiAgICAgICAgICAgICAgaWYgQHJldHVybkN1cnNvclxuICAgICAgICAgICAgICAgIGVkaXRvci5tb3ZlTGVmdChjb21wbGV0aW9uLmxlbmd0aClcblxuICAgICAgICAgICAgICAjIFJlcGxhY2UgdGhlIGN1cnNvciB3aXRoIG9uZSBhdCB0aGUgbmV3IHBvc2l0aW9uXG4gICAgICAgICAgICAgIGN1cnNvcnMuc3BsaWNlKGksIDEsIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKVxuXG4gICAgICAgICAgICBpZiBjdXJzb3JzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgICAgY3Vyc29ycy5mb3JFYWNoIChwb3NpdGlvbiwgaSkgLT5cbiAgICAgICAgICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbihwb3NpdGlvbilcblxuICAgICAgZWRpdG9yLm9uRGlkRGVzdHJveSAoZXZlbnQpID0+XG4gICAgICAgIGlmIEBkaXNwb3NhYmxlW2VkaXRvci5pZF1cbiAgICAgICAgICBAZGlzcG9zYWJsZVtlZGl0b3IuaWRdLmRpc3Bvc2UoKVxuICAgICAgICAgIGRlbGV0ZSBAZGlzcG9zYWJsZVtlZGl0b3IuaWRdXG5cbiAgICBAcHJvdmlkZXIgPVxuICAgICAgc2VsZWN0b3I6IFwiLnRleHQsIC5zb3VyY2VcIlxuICAgICAgaW5jbHVzaW9uUHJpb3JpdHk6IDFcbiAgICAgIGV4Y2x1ZGVMb3dlclByaW9yaXR5OiBmYWxzZVxuICAgICAgZ2V0U3VnZ2VzdGlvbnM6ICh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBhY3RpdmF0ZWRNYW51YWxseX0pID0+XG4gICAgICAgIGlmIEBmb3JjZUNvbXBsZXRlIHRoZW4gcmV0dXJuIFtdXG4gICAgICAgIGlmIHByZWZpeCA9IEBnZXRQcmVmaXgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgQHBhcnNlcnMpXG4gICAgICAgICAgaWYgY29tcGxldGlvbiA9IEBnZXRDb21wbGV0aW9uIGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIHByZWZpeFxuICAgICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgIHRleHQ6IGNvbXBsZXRpb25cbiAgICAgICAgICAgICAgcHJlZml4OiB1bmxlc3MgYWN0aXZhdGVkTWFudWFsbHkgdGhlbiBwcmVmaXggZWxzZSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgdHlwZTogJ3RhZydcbiAgICAgICAgICAgIH1dXG5cbiAgZ2V0Q29tcGxldGlvbjogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIHByZWZpeCkgLT5cbiAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHRJblJhbmdlIFtbMCwgMF0sIGJ1ZmZlclBvc2l0aW9uXVxuICAgIHVuY2xvc2VkVGFncyA9IEByZWR1Y2VUYWdzKEB0cmF2ZXJzZSh0ZXh0LCBAcGFyc2VycykpXG4gICAgaWYgdGFnRGVzY3JpcHRvciA9IHVuY2xvc2VkVGFncy5wb3AoKVxuICAgICMgQ2hlY2sgdGhhdCB0aGlzIGNvbXBsZXRpb24gY29ycmVzcG9uZHMgdG8gdGhlIHRyaWdnZXJcbiAgICAgIGlmIEBtYXRjaFByZWZpeChwcmVmaXgsIEBnZXRQYXJzZXIodGFnRGVzY3JpcHRvci50eXBlLCBAcGFyc2VycykpXG4gICAgICAgIHJldHVybiBAZ2V0UGFyc2VyKHRhZ0Rlc2NyaXB0b3IudHlwZSwgQHBhcnNlcnMpLmdldFBhaXIodGFnRGVzY3JpcHRvcilcbiAgICByZXR1cm4gbnVsbFxuXG4gIHByb3ZpZGU6IC0+XG4gICAgQHByb3ZpZGVyXG5cbiAgIyBQdXJlIGxvZ2ljXG5cbiAgdHJhdmVyc2U6ICh0ZXh0LCBwYXJzZXJzKSAtPlxuICAgIHRhZ3MgPSBbXVxuICAgIGxvb3BcbiAgICAgIGlmIHRleHQgaXMgJydcbiAgICAgICAgYnJlYWtcbiAgICAgIG5ld0luZGV4ID0gMVxuICAgICAgZm9yIGluZGV4LCBwYXJzZXIgb2YgcGFyc2Vyc1xuICAgICAgICBpZiB0ZXh0Lm1hdGNoKHBhcnNlci50ZXN0KVxuICAgICAgICAgIGlmIHRhZ0Rlc2NyaXB0b3IgPSBwYXJzZXIucGFyc2UodGV4dClcbiAgICAgICAgICAgIHRhZ3MucHVzaCB0YWdEZXNjcmlwdG9yXG4gICAgICAgICAgICBuZXdJbmRleCA9IHRhZ0Rlc2NyaXB0b3IubGVuZ3RoXG4gICAgICAgICAgICBicmVha1xuICAgICAgdGV4dCA9IHRleHQuc3Vic3RyIG5ld0luZGV4XG4gICAgdGFnc1xuXG4gIHJlZHVjZVRhZ3M6ICh0YWdzKSAtPlxuICAgIHJlc3VsdCA9IFtdXG4gICAgbG9vcFxuICAgICAgdGFnID0gdGFncy5zaGlmdCgpXG4gICAgICBpZiBub3QgdGFnIHRoZW4gYnJlYWtcbiAgICAgIHN3aXRjaFxuICAgICAgICB3aGVuIHRhZy5vcGVuaW5nXG4gICAgICAgICAgcmVzdWx0LnB1c2ggdGFnXG4gICAgICAgIHdoZW4gdGFnLmNsb3NpbmdcbiAgICAgICAgICBfcmVzdWx0ID0gcmVzdWx0LnNsaWNlKClcbiAgICAgICAgICBmb3VuZE1hdGNoaW5nVGFnID0gZmFsc2VcbiAgICAgICAgICB3aGlsZSByZXN1bHQubGVuZ3RoXG4gICAgICAgICAgICBwcmV2aW91cyA9IHJlc3VsdC5wb3AoKVxuICAgICAgICAgICAgaWYgcHJldmlvdXMuZWxlbWVudCBpcyB0YWcuZWxlbWVudCBhbmQgcHJldmlvdXMudHlwZSBpcyB0YWcudHlwZVxuICAgICAgICAgICAgICBmb3VuZE1hdGNoaW5nVGFnID0gdHJ1ZVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgIHVubGVzcyBmb3VuZE1hdGNoaW5nVGFnXG4gICAgICAgICAgICByZXN1bHQgPSBfcmVzdWx0XG4gICAgICAgIHdoZW4gdGFnLnNlbGZDbG9zaW5nXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHBhcnNlXCIpXG4gICAgcmVzdWx0XG5cbiAgIyBVdGlsc1xuICBnZXRQcmVmaXg6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBwYXJzZXJzKSAtPlxuICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG4gICAgZm9yIGluZGV4LCBwYXJzZXIgb2YgcGFyc2Vyc1xuICAgICAgaWYgbWF0Y2ggPSBAbWF0Y2hQcmVmaXggbGluZSwgcGFyc2VyXG4gICAgICAgIHJldHVybiBtYXRjaFxuICAgIHJldHVybiBmYWxzZVxuXG4gIG1hdGNoUHJlZml4OiAodGV4dCwgcGFyc2VyKSAtPlxuICAgIGlmIHR5cGVvZiBwYXJzZXIudHJpZ2dlciBpcyAnZnVuY3Rpb24nIHRoZW4gcGFyc2VyLnRyaWdnZXIodGV4dCkgZWxzZSB0ZXh0Lm1hdGNoKHBhcnNlci50cmlnZ2VyKT9bMF1cblxuICBnZXRQYXJzZXI6IChuYW1lLCBwYXJzZXJzKSAtPlxuICAgIGZvciBpbmRleCwgcGFyc2VyIG9mIHBhcnNlcnNcbiAgICAgIGlmIHBhcnNlci5uYW1lIGlzIG5hbWVcbiAgICAgICAgcmV0dXJuIHBhcnNlclxuICAgIG51bGxcbiJdfQ==
