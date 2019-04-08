(function() {
  var CompositeDisposable, basicConfig, config;

  CompositeDisposable = require("atom").CompositeDisposable;

  config = require("./config");

  basicConfig = require("./config-basic");

  module.exports = {
    config: basicConfig,
    modules: {},
    disposables: null,
    activate: function() {
      this.disposables = new CompositeDisposable();
      this.registerWorkspaceCommands();
      return this.registerEditorCommands();
    },
    deactivate: function() {
      var ref;
      if ((ref = this.disposables) != null) {
        ref.dispose();
      }
      this.disposables = null;
      return this.modules = {};
    },
    registerWorkspaceCommands: function() {
      var workspaceCommands;
      workspaceCommands = {};
      ["draft", "post"].forEach((function(_this) {
        return function(file) {
          return workspaceCommands["markdown-writer:new-" + file] = _this.registerView("./views/new-" + file + "-view", {
            optOutGrammars: true
          });
        };
      })(this));
      ["open-cheat-sheet", "create-default-keymaps", "create-project-configs"].forEach((function(_this) {
        return function(command) {
          return workspaceCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command, {
            optOutGrammars: true
          });
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-workspace", workspaceCommands));
    },
    registerEditorCommands: function() {
      var editorCommands;
      editorCommands = {};
      ["tags", "categories"].forEach((function(_this) {
        return function(attr) {
          return editorCommands["markdown-writer:manage-post-" + attr] = _this.registerView("./views/manage-post-" + attr + "-view");
        };
      })(this));
      ["link", "footnote", "image-file", "image-clipboard", "table"].forEach((function(_this) {
        return function(media) {
          return editorCommands["markdown-writer:insert-" + media] = _this.registerView("./views/insert-" + media + "-view");
        };
      })(this));
      ["code", "codeblock", "math", "mathblock", "bold", "italic", "strikethrough", "keystroke", "deletion", "addition", "substitution", "comment", "highlight"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style + "-text"] = _this.registerCommand("./commands/style-text", {
            args: style
          });
        };
      })(this));
      ["h1", "h2", "h3", "h4", "h5", "ul", "ol", "task", "taskdone", "blockquote"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style] = _this.registerCommand("./commands/style-line", {
            args: style
          });
        };
      })(this));
      ["previous-heading", "next-heading", "next-table-cell", "reference-definition"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:jump-to-" + command] = _this.registerCommand("./commands/jump-to", {
            args: command
          });
        };
      })(this));
      ["insert-new-line", "indent-list-line", "undent-list-line"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/edit-line", {
            args: command,
            skipList: ["autocomplete-active"]
          });
        };
      })(this));
      ["insert-toc", "update-toc"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/edit-toc", {
            args: command
          });
        };
      })(this));
      ["correct-order-list-numbers", "format-order-list", "format-table"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/format-text", {
            args: command
          });
        };
      })(this));
      ["fold-links", "fold-headings", "fold-h1", "fold-h2", "fold-h3", "focus-current-heading"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/fold-text", {
            args: command
          });
        };
      })(this));
      ["open-link-in-browser", "open-link-in-file"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/open-link", {
            args: command
          });
        };
      })(this));
      ["publish-draft", "insert-image"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command);
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-text-editor", editorCommands));
    },
    registerView: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var base, moduleInstance;
          if ((options.optOutGrammars || _this.isMarkdown()) && !_this.inSkipList(options.skipList)) {
            if ((base = _this.modules)[path] == null) {
              base[path] = require(path);
            }
            moduleInstance = new _this.modules[path](options.args);
            if (config.get("_skipAction") == null) {
              return moduleInstance.display(e);
            }
          } else {
            return e.abortKeyBinding();
          }
        };
      })(this);
    },
    registerCommand: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var base, moduleInstance;
          if ((options.optOutGrammars || _this.isMarkdown()) && !_this.inSkipList(options.skipList)) {
            if ((base = _this.modules)[path] == null) {
              base[path] = require(path);
            }
            moduleInstance = new _this.modules[path](options.args);
            if (config.get("_skipAction") == null) {
              return moduleInstance.trigger(e);
            }
          } else {
            return e.abortKeyBinding();
          }
        };
      })(this);
    },
    isMarkdown: function() {
      var editor, grammars;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return false;
      }
      grammars = config.get("grammars") || [];
      return grammars.indexOf(editor.getGrammar().scopeName) >= 0;
    },
    inSkipList: function(list) {
      var editorElement;
      if (list == null) {
        return false;
      }
      editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
      if (!((editorElement != null) && (editorElement.classList != null))) {
        return false;
      }
      return list.every(function(className) {
        return editorElement.classList.contains(className);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvbWFya2Rvd24td3JpdGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBQ1QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUFRLFdBQVI7SUFFQSxPQUFBLEVBQVMsRUFGVDtJQUdBLFdBQUEsRUFBYSxJQUhiO0lBS0EsUUFBQSxFQUFVLFNBQUE7TUFDUixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksbUJBQUosQ0FBQTtNQUVmLElBQUMsQ0FBQSx5QkFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLHNCQUFELENBQUE7SUFKUSxDQUxWO0lBV0EsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBOztXQUFZLENBQUUsT0FBZCxDQUFBOztNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWU7YUFDZixJQUFDLENBQUEsT0FBRCxHQUFXO0lBSEQsQ0FYWjtJQWdCQSx5QkFBQSxFQUEyQixTQUFBO0FBQ3pCLFVBQUE7TUFBQSxpQkFBQSxHQUFvQjtNQUVwQixDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWlCLENBQUMsT0FBbEIsQ0FBMEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQ3hCLGlCQUFrQixDQUFBLHNCQUFBLEdBQXVCLElBQXZCLENBQWxCLEdBQ0UsS0FBQyxDQUFBLFlBQUQsQ0FBYyxjQUFBLEdBQWUsSUFBZixHQUFvQixPQUFsQyxFQUEwQztZQUFBLGNBQUEsRUFBZ0IsSUFBaEI7V0FBMUM7UUFGc0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCO01BSUEsQ0FBQyxrQkFBRCxFQUFxQix3QkFBckIs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QUFBLElBQW9CLFlBQXBCO0FBQUEsZUFBTyxNQUFQOztNQUNBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFuQjtNQUNoQixJQUFBLENBQUEsQ0FBb0IsdUJBQUEsSUFBa0IsaUNBQXRDLENBQUE7QUFBQSxlQUFPLE1BQVA7O0FBQ0EsYUFBTyxJQUFJLENBQUMsS0FBTCxDQUFXLFNBQUMsU0FBRDtlQUFlLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBeEIsQ0FBaUMsU0FBakM7TUFBZixDQUFYO0lBSkcsQ0E1R1o7O0FBTkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlIFwiYXRvbVwiXG5cbmNvbmZpZyA9IHJlcXVpcmUgXCIuL2NvbmZpZ1wiXG5iYXNpY0NvbmZpZyA9IHJlcXVpcmUgXCIuL2NvbmZpZy1iYXNpY1wiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOiBiYXNpY0NvbmZpZ1xuXG4gIG1vZHVsZXM6IHt9ICMgVG8gY2FjaGUgcmVxdWlyZWQgbW9kdWxlc1xuICBkaXNwb3NhYmxlczogbnVsbCAjIENvbXBvc2l0ZSBkaXNwb3NhYmxlXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgQHJlZ2lzdGVyV29ya3NwYWNlQ29tbWFuZHMoKVxuICAgIEByZWdpc3RlckVkaXRvckNvbW1hbmRzKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkaXNwb3NhYmxlcz8uZGlzcG9zZSgpXG4gICAgQGRpc3Bvc2FibGVzID0gbnVsbFxuICAgIEBtb2R1bGVzID0ge31cblxuICByZWdpc3RlcldvcmtzcGFjZUNvbW1hbmRzOiAtPlxuICAgIHdvcmtzcGFjZUNvbW1hbmRzID0ge31cblxuICAgIFtcImRyYWZ0XCIsIFwicG9zdFwiXS5mb3JFYWNoIChmaWxlKSA9PlxuICAgICAgd29ya3NwYWNlQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6bmV3LSN7ZmlsZX1cIl0gPVxuICAgICAgICBAcmVnaXN0ZXJWaWV3KFwiLi92aWV3cy9uZXctI3tmaWxlfS12aWV3XCIsIG9wdE91dEdyYW1tYXJzOiB0cnVlKVxuXG4gICAgW1wib3Blbi1jaGVhdC1zaGVldFwiLCBcImNyZWF0ZS1kZWZhdWx0LWtleW1hcHNcIiwgXCJjcmVhdGUtcHJvamVjdC1jb25maWdzXCJdLmZvckVhY2ggKGNvbW1hbmQpID0+XG4gICAgICB3b3Jrc3BhY2VDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjoje2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvI3tjb21tYW5kfVwiLCBvcHRPdXRHcmFtbWFyczogdHJ1ZSlcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXdvcmtzcGFjZVwiLCB3b3Jrc3BhY2VDb21tYW5kcykpXG5cbiAgcmVnaXN0ZXJFZGl0b3JDb21tYW5kczogLT5cbiAgICBlZGl0b3JDb21tYW5kcyA9IHt9XG5cbiAgICBbXCJ0YWdzXCIsIFwiY2F0ZWdvcmllc1wiXS5mb3JFYWNoIChhdHRyKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6bWFuYWdlLXBvc3QtI3thdHRyfVwiXSA9XG4gICAgICAgIEByZWdpc3RlclZpZXcoXCIuL3ZpZXdzL21hbmFnZS1wb3N0LSN7YXR0cn0tdmlld1wiKVxuXG4gICAgW1wibGlua1wiLCBcImZvb3Rub3RlXCIsIFwiaW1hZ2UtZmlsZVwiLCBcImltYWdlLWNsaXBib2FyZFwiLCBcInRhYmxlXCJdLmZvckVhY2ggKG1lZGlhKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6aW5zZXJ0LSN7bWVkaWF9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyVmlldyhcIi4vdmlld3MvaW5zZXJ0LSN7bWVkaWF9LXZpZXdcIilcblxuICAgIFtcImNvZGVcIiwgXCJjb2RlYmxvY2tcIiwgXCJtYXRoXCIsIFwibWF0aGJsb2NrXCIsXG4gICAgIFwiYm9sZFwiLCBcIml0YWxpY1wiLCBcInN0cmlrZXRocm91Z2hcIiwgXCJrZXlzdHJva2VcIixcbiAgICAgXCJkZWxldGlvblwiLCBcImFkZGl0aW9uXCIsIFwic3Vic3RpdHV0aW9uXCIsIFwiY29tbWVudFwiLCBcImhpZ2hsaWdodFwiXG4gICAgXS5mb3JFYWNoIChzdHlsZSkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOnRvZ2dsZS0je3N0eWxlfS10ZXh0XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvc3R5bGUtdGV4dFwiLCBhcmdzOiBzdHlsZSlcblxuICAgIFtcImgxXCIsIFwiaDJcIiwgXCJoM1wiLCBcImg0XCIsIFwiaDVcIiwgXCJ1bFwiLCBcIm9sXCIsXG4gICAgIFwidGFza1wiLCBcInRhc2tkb25lXCIsIFwiYmxvY2txdW90ZVwiXS5mb3JFYWNoIChzdHlsZSkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOnRvZ2dsZS0je3N0eWxlfVwiXSA9XG4gICAgICAgIEByZWdpc3RlckNvbW1hbmQoXCIuL2NvbW1hbmRzL3N0eWxlLWxpbmVcIiwgYXJnczogc3R5bGUpXG5cbiAgICBbXCJwcmV2aW91cy1oZWFkaW5nXCIsIFwibmV4dC1oZWFkaW5nXCIsIFwibmV4dC10YWJsZS1jZWxsXCIsIFwicmVmZXJlbmNlLWRlZmluaXRpb25cIl0uZm9yRWFjaCAoY29tbWFuZCkgPT5cbiAgICAgIGVkaXRvckNvbW1hbmRzW1wibWFya2Rvd24td3JpdGVyOmp1bXAtdG8tI3tjb21tYW5kfVwiXSA9XG4gICAgICAgIEByZWdpc3RlckNvbW1hbmQoXCIuL2NvbW1hbmRzL2p1bXAtdG9cIiwgYXJnczogY29tbWFuZClcblxuICAgIFtcImluc2VydC1uZXctbGluZVwiLCBcImluZGVudC1saXN0LWxpbmVcIiwgXCJ1bmRlbnQtbGlzdC1saW5lXCJdLmZvckVhY2ggKGNvbW1hbmQpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjoje2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvZWRpdC1saW5lXCIsXG4gICAgICAgICAgYXJnczogY29tbWFuZCwgc2tpcExpc3Q6IFtcImF1dG9jb21wbGV0ZS1hY3RpdmVcIl0pXG5cbiAgICBbXCJpbnNlcnQtdG9jXCIsIFwidXBkYXRlLXRvY1wiXS5mb3JFYWNoIChjb21tYW5kKSA9PlxuICAgICAgZWRpdG9yQ29tbWFuZHNbXCJtYXJrZG93bi13cml0ZXI6I3tjb21tYW5kfVwiXSA9XG4gICAgICAgIEByZWdpc3RlckNvbW1hbmQoXCIuL2NvbW1hbmRzL2VkaXQtdG9jXCIsIGFyZ3M6IGNvbW1hbmQpXG5cbiAgICBbXCJjb3JyZWN0LW9yZGVyLWxpc3QtbnVtYmVyc1wiLCBcImZvcm1hdC1vcmRlci1saXN0XCIsIFwiZm9ybWF0LXRhYmxlXCJdLmZvckVhY2ggKGNvbW1hbmQpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjoje2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvZm9ybWF0LXRleHRcIiwgYXJnczogY29tbWFuZClcblxuICAgIFtcImZvbGQtbGlua3NcIiwgXCJmb2xkLWhlYWRpbmdzXCIsIFwiZm9sZC1oMVwiLCBcImZvbGQtaDJcIiwgXCJmb2xkLWgzXCIsIFwiZm9jdXMtY3VycmVudC1oZWFkaW5nXCJdLmZvckVhY2ggKGNvbW1hbmQpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjoje2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvZm9sZC10ZXh0XCIsIGFyZ3M6IGNvbW1hbmQpXG5cbiAgICBbXCJvcGVuLWxpbmstaW4tYnJvd3NlclwiLCBcIm9wZW4tbGluay1pbi1maWxlXCJdLmZvckVhY2ggKGNvbW1hbmQpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjoje2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvb3Blbi1saW5rXCIsIGFyZ3M6IGNvbW1hbmQpXG5cbiAgICBbXCJwdWJsaXNoLWRyYWZ0XCIsIFwiaW5zZXJ0LWltYWdlXCJdLmZvckVhY2ggKGNvbW1hbmQpID0+XG4gICAgICBlZGl0b3JDb21tYW5kc1tcIm1hcmtkb3duLXdyaXRlcjoje2NvbW1hbmR9XCJdID1cbiAgICAgICAgQHJlZ2lzdGVyQ29tbWFuZChcIi4vY29tbWFuZHMvI3tjb21tYW5kfVwiKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcImF0b20tdGV4dC1lZGl0b3JcIiwgZWRpdG9yQ29tbWFuZHMpKVxuXG4gIHJlZ2lzdGVyVmlldzogKHBhdGgsIG9wdGlvbnMgPSB7fSkgLT5cbiAgICAoZSkgPT5cbiAgICAgIGlmIChvcHRpb25zLm9wdE91dEdyYW1tYXJzIHx8IEBpc01hcmtkb3duKCkpICYmICFAaW5Ta2lwTGlzdChvcHRpb25zLnNraXBMaXN0KVxuICAgICAgICBAbW9kdWxlc1twYXRoXSA/PSByZXF1aXJlKHBhdGgpXG4gICAgICAgIG1vZHVsZUluc3RhbmNlID0gbmV3IEBtb2R1bGVzW3BhdGhdKG9wdGlvbnMuYXJncylcbiAgICAgICAgbW9kdWxlSW5zdGFuY2UuZGlzcGxheShlKSB1bmxlc3MgY29uZmlnLmdldChcIl9za2lwQWN0aW9uXCIpP1xuICAgICAgZWxzZVxuICAgICAgICBlLmFib3J0S2V5QmluZGluZygpXG5cbiAgcmVnaXN0ZXJDb21tYW5kOiAocGF0aCwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIChlKSA9PlxuICAgICAgaWYgKG9wdGlvbnMub3B0T3V0R3JhbW1hcnMgfHwgQGlzTWFya2Rvd24oKSkgJiYgIUBpblNraXBMaXN0KG9wdGlvbnMuc2tpcExpc3QpXG4gICAgICAgIEBtb2R1bGVzW3BhdGhdID89IHJlcXVpcmUocGF0aClcbiAgICAgICAgbW9kdWxlSW5zdGFuY2UgPSBuZXcgQG1vZHVsZXNbcGF0aF0ob3B0aW9ucy5hcmdzKVxuICAgICAgICBtb2R1bGVJbnN0YW5jZS50cmlnZ2VyKGUpIHVubGVzcyBjb25maWcuZ2V0KFwiX3NraXBBY3Rpb25cIik/XG4gICAgICBlbHNlXG4gICAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcblxuICBpc01hcmtkb3duOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgZWRpdG9yP1xuXG4gICAgZ3JhbW1hcnMgPSBjb25maWcuZ2V0KFwiZ3JhbW1hcnNcIikgfHwgW11cbiAgICByZXR1cm4gZ3JhbW1hcnMuaW5kZXhPZihlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkgPj0gMFxuXG4gIGluU2tpcExpc3Q6IChsaXN0KSAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgbGlzdD9cbiAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIGVkaXRvckVsZW1lbnQ/ICYmIGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0P1xuICAgIHJldHVybiBsaXN0LmV2ZXJ5IChjbGFzc05hbWUpIC0+IGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSlcbiJdfQ==
