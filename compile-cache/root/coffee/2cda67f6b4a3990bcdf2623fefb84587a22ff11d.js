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
            var cursors;
            if (!_this.forceComplete) {
              return;
            }
            cursors = editor.getCursorBufferPositions();
            return editor.transact(function() {
              var _, completion, i, j, line, parser, position, prefix, ref1, ref2;
              for (i in cursors) {
                position = cursors[i];
                line = editor.getTextInRange([[position.row, 0], position]) + event.text;
                ref1 = _this.parsers;
                for (_ in ref1) {
                  parser = ref1[_];
                  if (prefix = _this.matchPrefix(line, parser)) {
                    if (completion = _this.getCompletion(editor, position, prefix)) {
                      event.cancel();
                      editor.setCursorBufferPosition(position);
                      for (_ = j = 0, ref2 = prefix.length - event.text.length; 0 <= ref2 ? j < ref2 : j > ref2; _ = 0 <= ref2 ? ++j : --j) {
                        editor.backspace();
                      }
                      editor.insertText(completion);
                      if (_this.returnCursor) {
                        editor.moveLeft(completion.length);
                      }
                      cursors.splice(i, 1, editor.getCursorBufferPosition());
                    }
                    break;
                  }
                }
              }
              if (cursors.length > 1) {
                return cursors.forEach(function(position, i) {
                  return editor.addCursorAtBufferPosition(position);
                });
              }
            });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2xlc3MtdGhhbi1zbGFzaC9saWIvbGVzcy10aGFuLXNsYXNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQTtBQUFBLE1BQUE7O0VBQUEsTUFPSSxPQUFBLENBQVEsV0FBUixDQVBKLEVBQ0UseUJBREYsRUFFRSxtQ0FGRixFQUdFLHVDQUhGLEVBSUUsdURBSkYsRUFLRSxtQ0FMRixFQU1FOztFQUdGLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxPQUFBLEVBQVMsQ0FDUCxTQURPLEVBRVAsY0FGTyxFQUdQLGdCQUhPLEVBSVAsd0JBSk8sRUFLUCxjQUxPLEVBTVAsYUFOTyxDQUFUO0lBU0EsVUFBQSxFQUFZLEVBVFo7SUFXQSxNQUFBLEVBQ0U7TUFBQSxjQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8saUJBQVA7UUFDQSxXQUFBLEVBQWEsMktBRGI7UUFFQSxJQUFBLEVBQU0sUUFGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsV0FIVDtRQUlBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxXQUFELEVBQWMsU0FBZCxDQUpOO1FBS0EsS0FBQSxFQUFPLENBTFA7T0FERjtNQU9BLFNBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxZQUFQO1FBQ0EsV0FBQSxFQUFhLHFFQURiO1FBRUEsSUFBQSxFQUFNLFFBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQ1AsVUFETyxFQUVQLElBRk8sRUFHUCxJQUhPLEVBSVAsS0FKTyxFQUtQLE9BTE8sRUFNUCxNQU5PLEVBT1AsTUFQTyxFQVFQLE1BUk8sRUFTUCxNQVRPLEVBVVAsS0FWTyxFQVdQLFNBWE8sRUFZUCxPQVpPLEVBYVAsUUFiTyxFQWNQLE9BZE8sRUFlUCxRQWZPLEVBZ0JQLE9BaEJPLEVBaUJQLEtBakJPLENBa0JSLENBQUMsSUFsQk8sQ0FrQkYsR0FsQkUsQ0FIVDtRQXNCQSxLQUFBLEVB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V0FBQSxnQkFBQTs7UUFDRSxJQUFHLEtBQUEsR0FBUSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQWIsRUFBbUIsTUFBbkIsQ0FBWDtBQUNFLGlCQUFPLE1BRFQ7O0FBREY7QUFHQSxhQUFPO0lBTEUsQ0E3S1g7SUFvTEEsV0FBQSxFQUFhLFNBQUMsSUFBRCxFQUFPLE1BQVA7QUFDWCxVQUFBO01BQUEsSUFBRyxPQUFPLE1BQU0sQ0FBQyxPQUFkLEtBQXlCLFVBQTVCO2VBQTRDLE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZixFQUE1QztPQUFBLE1BQUE7aUVBQWtHLENBQUEsQ0FBQSxXQUFsRzs7SUFEVyxDQXBMYjtJQXVMQSxTQUFBLEVBQVcsU0FBQyxJQUFELEVBQU8sT0FBUDtBQUNULFVBQUE7QUFBQSxXQUFBLGdCQUFBOztRQUNFLElBQUcsTUFBTSxDQUFDLElBQVAsS0FBZSxJQUFsQjtBQUNFLGlCQUFPLE9BRFQ7O0FBREY7YUFHQTtJQUpTLENBdkxYOztBQVhGIiwic291cmNlc0NvbnRlbnQiOlsiIyNcbiMgZmlsZTogbGVzcy10aGFuLXNsYXNoLmNvZmZlZVxuIyBhdXRob3I6IEBtcmhhbmxvblxuI1xuXG57XG4gIHhtbHBhcnNlcixcbiAgeG1sY2RhdGFwYXJzZXIsXG4gIHhtbGNvbW1lbnRwYXJzZXIsXG4gIHVuZGVyc2NvcmV0ZW1wbGF0ZXBhcnNlcixcbiAgbXVzdGFjaGVwYXJzZXIsXG4gIHBocGVjaG9wYXJzZXJcbn0gPSByZXF1aXJlICcuL3BhcnNlcnMnXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBwYXJzZXJzOiBbXG4gICAgeG1scGFyc2VyLFxuICAgIHhtbGNkYXRhcGFyc2VyLFxuICAgIHhtbGNvbW1lbnRwYXJzZXIsXG4gICAgdW5kZXJzY29yZXRlbXBsYXRlcGFyc2VyLFxuICAgIG11c3RhY2hlcGFyc2VyLFxuICAgIHBocGVjaG9wYXJzZXJcbiAgXVxuXG4gIGRpc3Bvc2FibGU6IHt9XG5cbiAgY29uZmlnOlxuICAgIGNvbXBsZXRpb25Nb2RlOlxuICAgICAgdGl0bGU6IFwiQ29tcGxldGlvbiBNb2RlXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkNob29zZSBpbW1lZGlhdGUgdG8gaGF2ZSB5b3VyIHRhZ3MgY29tcGxldGVkIGltbWVkaWF0ZWx5IGFmdGVyIHlvdSB0eXBlICc8LycgKHRoZSB0cmFkaXRpb25hbCB3YXkpLiBDaG9vc2Ugc3VnZ2VzdCB0byBoYXZlIHRoZW0gYXBwZWFyIGluIGFuIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIGJveC5cIlxuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwiSW1tZWRpYXRlXCJcbiAgICAgIGVudW06IFtcIkltbWVkaWF0ZVwiLCBcIlN1Z2dlc3RcIl1cbiAgICAgIG9yZGVyOiAxXG4gICAgZW1wdHlUYWdzOlxuICAgICAgdGl0bGU6IFwiRW1wdHkgdGFnc1wiXG4gICAgICBkZXNjcmlwdGlvbjogXCJBIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGVsZW1lbnRzIHRvIGJlIGlnbm9yZWQgZnJvbSBhdXRvLWNsb3NpbmcuXCJcbiAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgIGRlZmF1bHQ6IFtcbiAgICAgICAgXCIhZG9jdHlwZVwiLFxuICAgICAgICBcImJyXCIsXG4gICAgICAgIFwiaHJcIixcbiAgICAgICAgXCJpbWdcIixcbiAgICAgICAgXCJpbnB1dFwiLFxuICAgICAgICBcImxpbmtcIixcbiAgICAgICAgXCJtZXRhXCIsXG4gICAgICAgIFwiYXJlYVwiLFxuICAgICAgICBcImJhc2VcIixcbiAgICAgICAgXCJjb2xcIixcbiAgICAgICAgXCJjb21tYW5kXCIsXG4gICAgICAgIFwiZW1iZWRcIixcbiAgICAgICAgXCJrZXlnZW5cIixcbiAgICAgICAgXCJwYXJhbVwiLFxuICAgICAgICBcInNvdXJjZVwiLFxuICAgICAgICBcInRyYWNrXCIsXG4gICAgICAgIFwid2JyXCJcbiAgICAgIF0uam9pbihcIiBcIilcbiAgICAgIG9yZGVyOiAyXG4gICAgcmV0dXJuQ3Vyc29yOlxuICAgICAgdGl0bGU6IFwiUmV0dXJuIGN1cnNvclwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJSZXR1cm5zIHRoZSBjdXJzb3IgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgY2xvc2luZyB0YWcgYWZ0ZXIgaXQncyBiZWVuIGluc2VydGVkIChkb2VzIG5vdCB3b3JrIGluIHN1Z2dlc3QgbW9kZSlcIlxuICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBvcmRlcjogM1xuXG4gIGRlYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBmb3Iga2V5IGluIE9iamVjdC5rZXlzIEBkaXNwb3NhYmxlXG4gICAgICBAZGlzcG9zYWJsZVtrZXldLmRpc3Bvc2UoKVxuICAgICAgZGVsZXRlIEBkaXNwb3NhYmxlW2tleV1cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICMgUmVnaXN0ZXIgY29uZmlnIGNoYW5nZSBoYW5kbGVyIHRvIHVwZGF0ZSB0aGUgZW1wdHkgdGFncyBsaXN0XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSBcImxlc3MtdGhhbi1zbGFzaC5lbXB0eVRhZ3NcIiwgKHZhbHVlKSAtPlxuICAgICAgeG1scGFyc2VyLmVtcHR5VGFncyA9ICh0YWcudG9Mb3dlckNhc2UoKSBmb3IgdGFnIGluIHZhbHVlLnNwbGl0KC9cXHMqW1xccyx8XStcXHMqLykpXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSBcImxlc3MtdGhhbi1zbGFzaC5jb21wbGV0aW9uTW9kZVwiLCAodmFsdWUpID0+XG4gICAgICBtdXN0YWNoZXBhcnNlci5vbWl0Q2xvc2luZ0JyYWNlcyA9IHZhbHVlLnRvTG93ZXJDYXNlKCkgaXMgXCJpbW1lZGlhdGVcIlxuICAgICAgQGZvcmNlQ29tcGxldGUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpIGlzIFwiaW1tZWRpYXRlXCJcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlIFwibGVzcy10aGFuLXNsYXNoLnJldHVybkN1cnNvclwiLCAodmFsdWUpID0+XG4gICAgICBAcmV0dXJuQ3Vyc29yID0gdmFsdWVcblxuICAgIEBkaXNwb3NhYmxlLl9yb290ID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAZGlzcG9zYWJsZVtlZGl0b3IuaWRdID0gZWRpdG9yLm9uV2lsbEluc2VydFRleHQgKGV2ZW50KSA9PlxuICAgICAgICAjIElmIGluIHN1Z2dlc3QgbW9kZSwgdGhlIGF1dG9jb21wbGV0ZSBwcm92aWRlciB3aWxsIGJlIGludm9rZWQgaW5zdGVhZFxuICAgICAgICBpZiBub3QgQGZvcmNlQ29tcGxldGUgdGhlbiByZXR1cm5cblxuICAgICAgICBjdXJzb3JzID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9ucygpXG5cbiAgICAgICAgZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICAgICAgIyBGb3IgZXZlcnkgY3Vyc29yLCBjaGVjayBpZiB0aGUgbmV3IHRleHQgd291bGQgdHJpZ2dlciBhIGNvbXBsZXRpb25cbiAgICAgICAgICBmb3IgaSwgcG9zaXRpb24gb2YgY3Vyc29yc1xuICAgICAgICAgICAgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW3Bvc2l0aW9uLnJvdywgMF0sIHBvc2l0aW9uXSkgKyBldmVudC50ZXh0XG5cbiAgICAgICAgICAgIGZvciBfLCBwYXJzZXIgb2YgQHBhcnNlcnNcbiAgICAgICAgICAgICAgIyBDaGVjayBpZiB0aGlzIG1pZ2h0IHRyaWdnZXIgYSBjb21wbGV0aW9uXG4gICAgICAgICAgICAgIGlmIHByZWZpeCA9IEBtYXRjaFByZWZpeCBsaW5lLCBwYXJzZXJcbiAgICAgICAgICAgICAgICAjIEdlbmVyYXRlIGEgY29tcGxldGlvbiBpZiBwb3NzaWJsZVxuICAgICAgICAgICAgICAgIGlmIGNvbXBsZXRpb24gPSBAZ2V0Q29tcGxldGlvbihlZGl0b3IsIHBvc2l0aW9uLCBwcmVmaXgpXG4gICAgICAgICAgICAgICAgICAjIEVkaXQgaW4gdGhlIG5ldyB0ZXh0XG4gICAgICAgICAgICAgICAgICBldmVudC5jYW5jZWwoKVxuICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuICAgICAgICAgICAgICAgICAgZm9yIF8gaW4gWzAuLi4ocHJlZml4Lmxlbmd0aCAtIGV2ZW50LnRleHQubGVuZ3RoKV1cbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLmJhY2tzcGFjZSgpXG4gICAgICAgICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dChjb21wbGV0aW9uKVxuXG4gICAgICAgICAgICAgICAgICAjIFBsYWNlIHRoZSBjdXJzb3IgYmVmb3JlIHRoZSBjb21wbGV0aW9uIGlmIG5lZWRlZFxuICAgICAgICAgICAgICAgICAgaWYgQHJldHVybkN1cnNvclxuICAgICAgICAgICAgICAgICAgICBlZGl0b3IubW92ZUxlZnQoY29tcGxldGlvbi5sZW5ndGgpXG5cbiAgICAgICAgICAgICAgICAgICMgUmVwbGFjZSB0aGUgY3Vyc29yIHdpdGggb25lIGF0IHRoZSBuZXcgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgIGN1cnNvcnMuc3BsaWNlKGksIDEsIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKVxuICAgICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICBpZiBjdXJzb3JzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIGN1cnNvcnMuZm9yRWFjaCAocG9zaXRpb24sIGkpIC0+XG4gICAgICAgICAgICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuXG4gICAgICBlZGl0b3Iub25EaWREZXN0cm95IChldmVudCkgPT5cbiAgICAgICAgaWYgQGRpc3Bvc2FibGVbZWRpdG9yLmlkXVxuICAgICAgICAgIEBkaXNwb3NhYmxlW2VkaXRvci5pZF0uZGlzcG9zZSgpXG4gICAgICAgICAgZGVsZXRlIEBkaXNwb3NhYmxlW2VkaXRvci5pZF1cblxuICAgIEBwcm92aWRlciA9XG4gICAgICBzZWxlY3RvcjogXCIudGV4dCwgLnNvdXJjZVwiXG4gICAgICBpbmNsdXNpb25Qcmlvcml0eTogMVxuICAgICAgZXhjbHVkZUxvd2VyUHJpb3JpdHk6IGZhbHNlXG4gICAgICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIGFjdGl2YXRlZE1hbnVhbGx5fSkgPT5cbiAgICAgICAgaWYgQGZvcmNlQ29tcGxldGUgdGhlbiByZXR1cm4gW11cbiAgICAgICAgaWYgcHJlZml4ID0gQGdldFByZWZpeChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBAcGFyc2VycylcbiAgICAgICAgICBpZiBjb21wbGV0aW9uID0gQGdldENvbXBsZXRpb24gZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4XG4gICAgICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgdGV4dDogY29tcGxldGlvblxuICAgICAgICAgICAgICBwcmVmaXg6IHVubGVzcyBhY3RpdmF0ZWRNYW51YWxseSB0aGVuIHByZWZpeCBlbHNlIHVuZGVmaW5lZFxuICAgICAgICAgICAgICB0eXBlOiAndGFnJ1xuICAgICAgICAgICAgfV1cblxuICBnZXRDb21wbGV0aW9uOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4KSAtPlxuICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UgW1swLCAwXSwgYnVmZmVyUG9zaXRpb25dXG4gICAgdW5jbG9zZWRUYWdzID0gQHJlZHVjZVRhZ3MoQHRyYXZlcnNlKHRleHQsIEBwYXJzZXJzKSlcbiAgICBpZiB0YWdEZXNjcmlwdG9yID0gdW5jbG9zZWRUYWdzLnBvcCgpXG4gICAgIyBDaGVjayB0aGF0IHRoaXMgY29tcGxldGlvbiBjb3JyZXNwb25kcyB0byB0aGUgdHJpZ2dlclxuICAgICAgaWYgQG1hdGNoUHJlZml4KHByZWZpeCwgQGdldFBhcnNlcih0YWdEZXNjcmlwdG9yLnR5cGUsIEBwYXJzZXJzKSlcbiAgICAgICAgcmV0dXJuIEBnZXRQYXJzZXIodGFnRGVzY3JpcHRvci50eXBlLCBAcGFyc2VycykuZ2V0UGFpcih0YWdEZXNjcmlwdG9yKVxuICAgIHJldHVybiBudWxsXG5cbiAgcHJvdmlkZTogLT5cbiAgICBAcHJvdmlkZXJcblxuICAjIFB1cmUgbG9naWNcblxuICB0cmF2ZXJzZTogKHRleHQsIHBhcnNlcnMpIC0+XG4gICAgdGFncyA9IFtdXG4gICAgbG9vcFxuICAgICAgaWYgdGV4dCBpcyAnJ1xuICAgICAgICBicmVha1xuICAgICAgbmV3SW5kZXggPSAxXG4gICAgICBmb3IgaW5kZXgsIHBhcnNlciBvZiBwYXJzZXJzXG4gICAgICAgIGlmIHRleHQubWF0Y2gocGFyc2VyLnRlc3QpXG4gICAgICAgICAgaWYgdGFnRGVzY3JpcHRvciA9IHBhcnNlci5wYXJzZSh0ZXh0KVxuICAgICAgICAgICAgdGFncy5wdXNoIHRhZ0Rlc2NyaXB0b3JcbiAgICAgICAgICAgIG5ld0luZGV4ID0gdGFnRGVzY3JpcHRvci5sZW5ndGhcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIgbmV3SW5kZXhcbiAgICB0YWdzXG5cbiAgcmVkdWNlVGFnczogKHRhZ3MpIC0+XG4gICAgcmVzdWx0ID0gW11cbiAgICBsb29wXG4gICAgICB0YWcgPSB0YWdzLnNoaWZ0KClcbiAgICAgIGlmIG5vdCB0YWcgdGhlbiBicmVha1xuICAgICAgc3dpdGNoXG4gICAgICAgIHdoZW4gdGFnLm9wZW5pbmdcbiAgICAgICAgICByZXN1bHQucHVzaCB0YWdcbiAgICAgICAgd2hlbiB0YWcuY2xvc2luZ1xuICAgICAgICAgIF9yZXN1bHQgPSByZXN1bHQuc2xpY2UoKVxuICAgICAgICAgIGZvdW5kTWF0Y2hpbmdUYWcgPSBmYWxzZVxuICAgICAgICAgIHdoaWxlIHJlc3VsdC5sZW5ndGhcbiAgICAgICAgICAgIHByZXZpb3VzID0gcmVzdWx0LnBvcCgpXG4gICAgICAgICAgICBpZiBwcmV2aW91cy5lbGVtZW50IGlzIHRhZy5lbGVtZW50IGFuZCBwcmV2aW91cy50eXBlIGlzIHRhZy50eXBlXG4gICAgICAgICAgICAgIGZvdW5kTWF0Y2hpbmdUYWcgPSB0cnVlXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgdW5sZXNzIGZvdW5kTWF0Y2hpbmdUYWdcbiAgICAgICAgICAgIHJlc3VsdCA9IF9yZXN1bHRcbiAgICAgICAgd2hlbiB0YWcuc2VsZkNsb3NpbmdcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGFyc2VcIilcbiAgICByZXN1bHRcblxuICAjIFV0aWxzXG4gIGdldFByZWZpeDogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIHBhcnNlcnMpIC0+XG4gICAgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSlcbiAgICBmb3IgaW5kZXgsIHBhcnNlciBvZiBwYXJzZXJzXG4gICAgICBpZiBtYXRjaCA9IEBtYXRjaFByZWZpeCBsaW5lLCBwYXJzZXJcbiAgICAgICAgcmV0dXJuIG1hdGNoXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgbWF0Y2hQcmVmaXg6ICh0ZXh0LCBwYXJzZXIpIC0+XG4gICAgaWYgdHlwZW9mIHBhcnNlci50cmlnZ2VyIGlzICdmdW5jdGlvbicgdGhlbiBwYXJzZXIudHJpZ2dlcih0ZXh0KSBlbHNlIHRleHQubWF0Y2gocGFyc2VyLnRyaWdnZXIpP1swXVxuXG4gIGdldFBhcnNlcjogKG5hbWUsIHBhcnNlcnMpIC0+XG4gICAgZm9yIGluZGV4LCBwYXJzZXIgb2YgcGFyc2Vyc1xuICAgICAgaWYgcGFyc2VyLm5hbWUgaXMgbmFtZVxuICAgICAgICByZXR1cm4gcGFyc2VyXG4gICAgbnVsbFxuIl19
