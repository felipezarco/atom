(function() {
  var BufferedProcess, CompositeDisposable, PhpCsFixer, fs, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs');

  path = require('path');

  module.exports = PhpCsFixer = {
    subscriptions: null,
    config: {
      phpExecutablePath: {
        title: 'PHP executable path',
        type: 'string',
        "default": 'php',
        description: 'The path to the `php` executable.',
        order: 10
      },
      phpArguments: {
        title: 'Add PHP arguments',
        type: 'array',
        "default": [],
        description: 'Add arguments, like for example `-n`, to the PHP executable.',
        order: 11
      },
      executablePath: {
        title: 'PHP-CS-fixer executable path',
        type: 'string',
        "default": 'php-cs-fixer',
        description: 'The path to the `php-cs-fixer` executable.',
        order: 20
      },
      rules: {
        title: 'PHP-CS-Fixer Rules',
        type: 'string',
        "default": '@PSR2',
        description: 'A list of rules (based on php-cs-fixer 2.0), for example: `@PSR2,no_short_echo_tag,indentation_type`. See <https://github.com/FriendsOfPHP/PHP-CS-Fixer#usage> for a complete list. Will be ignored if a config file is used.',
        order: 21
      },
      allowRisky: {
        title: 'Allow risky',
        type: 'boolean',
        "default": false,
        description: 'Option allows you to set whether risky rules may run. Will be ignored if a config file is used.',
        order: 22
      },
      pathMode: {
        title: 'PHP-CS-Fixer Path-Mode',
        type: 'string',
        "default": 'override',
        "enum": ['override', 'intersection'],
        description: 'Specify path mode (can be override or intersection).',
        order: 23
      },
      fixerArguments: {
        title: 'PHP-CS-Fixer arguments',
        type: 'array',
        "default": ['--using-cache=no', '--no-interaction'],
        description: 'Add arguments, like for example `--using-cache=false`, to the PHP-CS-Fixer executable. Run `php-cs-fixer help fix` in your command line, to get a full list of all supported arguments.',
        order: 24
      },
      configPath: {
        title: 'PHP-CS-fixer config file path',
        type: 'string',
        "default": '',
        description: 'Optionally provide the path to the `.php_cs` config file, if the path is not provided it will be loaded from the root path of the current project.',
        order: 25
      },
      executeOnSave: {
        title: 'Execute on save',
        type: 'boolean',
        "default": false,
        description: 'Execute PHP CS fixer on save',
        order: 30
      },
      showInfoNotifications: {
        title: 'Show notifications',
        type: 'boolean',
        "default": false,
        description: 'Show some status informations from the last "fix".',
        order: 31
      }
    },
    activate: function(state) {
      atom.config.observe('php-cs-fixer.executeOnSave', (function(_this) {
        return function() {
          return _this.executeOnSave = atom.config.get('php-cs-fixer.executeOnSave');
        };
      })(this));
      atom.config.observe('php-cs-fixer.phpExecutablePath', (function(_this) {
        return function() {
          return _this.phpExecutablePath = atom.config.get('php-cs-fixer.phpExecutablePath');
        };
      })(this));
      atom.config.observe('php-cs-fixer.executablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('php-cs-fixer.executablePath');
        };
      })(this));
      atom.config.observe('php-cs-fixer.configPath', (function(_this) {
        return function() {
          return _this.configPath = atom.config.get('php-cs-fixer.configPath');
        };
      })(this));
      atom.config.observe('php-cs-fixer.allowRisky', (function(_this) {
        return function() {
          return _this.allowRisky = atom.config.get('php-cs-fixer.allowRisky');
        };
      })(this));
      atom.config.observe('php-cs-fixer.rules', (function(_this) {
        return function() {
          return _this.rules = atom.config.get('php-cs-fixer.rules');
        };
      })(this));
      atom.config.observe('php-cs-fixer.showInfoNotifications', (function(_this) {
        return function() {
          return _this.showInfoNotifications = atom.config.get('php-cs-fixer.showInfoNotifications');
        };
      })(this));
      atom.config.observe('php-cs-fixer.phpArguments', (function(_this) {
        return function() {
          return _this.phpArguments = atom.config.get('php-cs-fixer.phpArguments');
        };
      })(this));
      atom.config.observe('php-cs-fixer.fixerArguments', (function(_this) {
        return function() {
          return _this.fixerArguments = atom.config.get('php-cs-fixer.fixerArguments');
        };
      })(this));
      atom.config.observe('php-cs-fixer.pathMode', (function(_this) {
        return function() {
          return _this.pathMode = atom.config.get('php-cs-fixer.pathMode');
        };
      })(this));
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-cs-fixer:fix': (function(_this) {
          return function() {
            return _this.fix();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.subscriptions.add(editor.getBuffer().onWillSave(function() {
            if (editor.getGrammar().name === "PHP" && _this.executeOnSave) {
              return _this.fix();
            }
          }));
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    fix: function() {
      var args, command, configPath, editor, exit, filePath, fixerArgs, process, stderr, stdout;
      editor = atom.workspace.getActiveTextEditor();
      if (editor && editor.getPath) {
        filePath = editor.getPath();
      }
      command = this.phpExecutablePath;
      args = [];
      if (this.phpArguments.length) {
        if (this.phpArguments.length > 1) {
          args = this.phpArguments;
        } else {
          args = this.phpArguments[0].split(' ');
        }
      }
      args = args.concat([this.executablePath, 'fix', filePath]);
      if (!this.configPath && (configPath = this.findFile(path.dirname(filePath.toString()), ['.php_cs', '.php_cs.dist']))) {
        this.configPath = configPath;
      }
      if (this.configPath) {
        args.push('--config=' + this.configPath);
      }
      if (!this.configPath) {
        if (this.allowRisky) {
          args.push('--allow-risky=yes');
        }
        if (this.rules) {
          args.push('--rules=' + this.rules);
        }
      }
      if (this.pathMode) {
        args.push('--path-mode=' + this.pathMode);
      }
      if (this.fixerArguments.length && !this.configPath) {
        if (this.fixerArguments.length > 1) {
          fixerArgs = this.fixerArguments;
        } else {
          fixerArgs = this.fixerArguments[0].split(' ');
        }
        args = args.concat(fixerArgs);
      }
      stdout = function(output) {
        if (PhpCsFixer.showInfoNotifications) {
          if (/^\s*\d*[)]/.test(output)) {
            atom.notifications.addSuccess(output);
          } else {
            atom.notifications.addInfo(output);
          }
        }
        return console.log(output);
      };
      stderr = function(output) {
        if (PhpCsFixer.showInfoNotifications) {
          if (output.replace(/\s/g, "") === "") {

          } else if (/^Loaded config/.test(output)) {
            return atom.notifications.addInfo(output);
          } else {
            atom.notifications.addError(output);
            return console.error(output);
          }
        }
      };
      exit = function(code) {
        return console.log(command + " exited with code: " + code);
      };
      if (filePath) {
        return process = new BufferedProcess({
          command: command,
          args: args,
          stdout: stdout,
          stderr: stderr,
          exit: exit
        });
      }
    },
    findFile: function(startDir, names) {
      var currentDir, filePath, i, len, name;
      if (!arguments.length) {
        throw new Error("Specify a filename to find");
      }
      if (!(names instanceof Array)) {
        names = [names];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length) {
        currentDir = startDir.join(path.sep);
        for (i = 0, len = names.length; i < len; i++) {
          name = names[i];
          filePath = path.join(currentDir, name);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (error) {}
        }
        startDir.pop();
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3BocC1jcy1maXhlci9saWIvcGhwLWNzLWZpeGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN2QixrQkFBbUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3BCLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBQSxHQUNmO0lBQUEsYUFBQSxFQUFlLElBQWY7SUFDQSxNQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLHFCQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRlQ7UUFHQSxXQUFBLEVBQWEsbUNBSGI7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQURGO01BTUEsWUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLG1CQUFQO1FBQ0EsSUFBQSxFQUFNLE9BRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7UUFHQSxXQUFBLEVBQWEsOERBSGI7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQVBGO01BWUEsY0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLDhCQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGNBRlQ7UUFHQSxXQUFBLEVBQWEsNENBSGI7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQWJGO01Ba0JBLEtBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxvQkFBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxPQUZUO1FBR0EsV0FBQSxFQUFhLCtOQUhiO1FBSUEsS0FBQSxFQUFPLEVBSlA7T0FuQkY7TUF3QkEsVUFBQSxFQUNFO1FBQUEs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NUIsSUFBQSxFQUFNLElBTHNCO1NBQXBCLEVBQVY7O0lBMURHLENBOUdMO0lBd0xBLFFBQUEsRUFBVSxTQUFDLFFBQUQsRUFBVyxLQUFYO0FBQ1IsVUFBQTtNQUFBLElBQUEsQ0FBb0QsU0FBUyxDQUFDLE1BQTlEO0FBQUEsY0FBTSxJQUFJLEtBQUosQ0FBVSw0QkFBVixFQUFOOztNQUNBLElBQUEsQ0FBQSxDQUFPLEtBQUEsWUFBaUIsS0FBeEIsQ0FBQTtRQUNFLEtBQUEsR0FBUSxDQUFDLEtBQUQsRUFEVjs7TUFFQSxRQUFBLEdBQVcsUUFBUSxDQUFDLEtBQVQsQ0FBZSxJQUFJLENBQUMsR0FBcEI7QUFDWCxhQUFNLFFBQVEsQ0FBQyxNQUFmO1FBQ0UsVUFBQSxHQUFhLFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBSSxDQUFDLEdBQW5CO0FBQ2IsYUFBQSx1Q0FBQTs7VUFDRSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLEVBQXNCLElBQXRCO0FBQ1g7WUFDRSxFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsRUFBd0IsRUFBRSxDQUFDLElBQTNCO0FBQ0EsbUJBQU8sU0FGVDtXQUFBO0FBRkY7UUFLQSxRQUFRLENBQUMsR0FBVCxDQUFBO01BUEY7QUFRQSxhQUFPO0lBYkMsQ0F4TFY7O0FBTkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue0J1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xuZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBocENzRml4ZXIgPVxuICBzdWJzY3JpcHRpb25zOiBudWxsXG4gIGNvbmZpZzpcbiAgICBwaHBFeGVjdXRhYmxlUGF0aDpcbiAgICAgIHRpdGxlOiAnUEhQIGV4ZWN1dGFibGUgcGF0aCdcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAncGhwJ1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgcGF0aCB0byB0aGUgYHBocGAgZXhlY3V0YWJsZS4nXG4gICAgICBvcmRlcjogMTBcbiAgICBwaHBBcmd1bWVudHM6XG4gICAgICB0aXRsZTogJ0FkZCBQSFAgYXJndW1lbnRzJ1xuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogW11cbiAgICAgIGRlc2NyaXB0aW9uOiAnQWRkIGFyZ3VtZW50cywgbGlrZSBmb3IgZXhhbXBsZSBgLW5gLCB0byB0aGUgUEhQIGV4ZWN1dGFibGUuJ1xuICAgICAgb3JkZXI6IDExXG4gICAgZXhlY3V0YWJsZVBhdGg6XG4gICAgICB0aXRsZTogJ1BIUC1DUy1maXhlciBleGVjdXRhYmxlIHBhdGgnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ3BocC1jcy1maXhlcidcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHBhdGggdG8gdGhlIGBwaHAtY3MtZml4ZXJgIGV4ZWN1dGFibGUuJ1xuICAgICAgb3JkZXI6IDIwXG4gICAgcnVsZXM6XG4gICAgICB0aXRsZTogJ1BIUC1DUy1GaXhlciBSdWxlcydcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnQFBTUjInXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgbGlzdCBvZiBydWxlcyAoYmFzZWQgb24gcGhwLWNzLWZpeGVyIDIuMCksIGZvciBleGFtcGxlOiBgQFBTUjIsbm9fc2hvcnRfZWNob190YWcsaW5kZW50YXRpb25fdHlwZWAuIFNlZSA8aHR0cHM6Ly9naXRodWIuY29tL0ZyaWVuZHNPZlBIUC9QSFAtQ1MtRml4ZXIjdXNhZ2U+IGZvciBhIGNvbXBsZXRlIGxpc3QuIFdpbGwgYmUgaWdub3JlZCBpZiBhIGNvbmZpZyBmaWxlIGlzIHVzZWQuJ1xuICAgICAgb3JkZXI6IDIxXG4gICAgYWxsb3dSaXNreTpcbiAgICAgIHRpdGxlOiAnQWxsb3cgcmlza3knXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ09wdGlvbiBhbGxvd3MgeW91IHRvIHNldCB3aGV0aGVyIHJpc2t5IHJ1bGVzIG1heSBydW4uIFdpbGwgYmUgaWdub3JlZCBpZiBhIGNvbmZpZyBmaWxlIGlzIHVzZWQuJ1xuICAgICAgb3JkZXI6IDIyXG4gICAgcGF0aE1vZGU6XG4gICAgICB0aXRsZTogJ1BIUC1DUy1GaXhlciBQYXRoLU1vZGUnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ292ZXJyaWRlJ1xuICAgICAgZW51bTogWydvdmVycmlkZScsICdpbnRlcnNlY3Rpb24nXVxuICAgICAgZGVzY3JpcHRpb246ICdTcGVjaWZ5IHBhdGggbW9kZSAoY2FuIGJlIG92ZXJyaWRlIG9yIGludGVyc2VjdGlvbikuJ1xuICAgICAgb3JkZXI6IDIzXG4gICAgZml4ZXJBcmd1bWVudHM6XG4gICAgICB0aXRsZTogJ1BIUC1DUy1GaXhlciBhcmd1bWVudHMnXG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbJy0tdXNpbmctY2FjaGU9bm8nLCAnLS1uby1pbnRlcmFjdGlvbiddXG4gICAgICBkZXNjcmlwdGlvbjogJ0FkZCBhcmd1bWVudHMsIGxpa2UgZm9yIGV4YW1wbGUgYC0tdXNpbmctY2FjaGU9ZmFsc2VgLCB0byB0aGUgUEhQLUNTLUZpeGVyIGV4ZWN1dGFibGUuIFJ1biBgcGhwLWNzLWZpeGVyIGhlbHAgZml4YCBpbiB5b3VyIGNvbW1hbmQgbGluZSwgdG8gZ2V0IGEgZnVsbCBsaXN0IG9mIGFsbCBzdXBwb3J0ZWQgYXJndW1lbnRzLidcbiAgICAgIG9yZGVyOiAyNFxuICAgIGNvbmZpZ1BhdGg6XG4gICAgICB0aXRsZTogJ1BIUC1DUy1maXhlciBjb25maWcgZmlsZSBwYXRoJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgICBkZXNjcmlwdGlvbjogJ09wdGlvbmFsbHkgcHJvdmlkZSB0aGUgcGF0aCB0byB0aGUgYC5waHBfY3NgIGNvbmZpZyBmaWxlLCBpZiB0aGUgcGF0aCBpcyBub3QgcHJvdmlkZWQgaXQgd2lsbCBiZSBsb2FkZWQgZnJvbSB0aGUgcm9vdCBwYXRoIG9mIHRoZSBjdXJyZW50IHByb2plY3QuJ1xuICAgICAgb3JkZXI6IDI1XG4gICAgZXhlY3V0ZU9uU2F2ZTpcbiAgICAgIHRpdGxlOiAnRXhlY3V0ZSBvbiBzYXZlJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246ICdFeGVjdXRlIFBIUCBDUyBmaXhlciBvbiBzYXZlJ1xuICAgICAgb3JkZXI6IDMwXG4gICAgc2hvd0luZm9Ob3RpZmljYXRpb25zOlxuICAgICAgdGl0bGU6ICdTaG93IG5vdGlmaWNhdGlvbnMnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3cgc29tZSBzdGF0dXMgaW5mb3JtYXRpb25zIGZyb20gdGhlIGxhc3QgXCJmaXhcIi4nXG4gICAgICBvcmRlcjogMzFcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3BocC1jcy1maXhlci5leGVjdXRlT25TYXZlJywgPT5cbiAgICAgIEBleGVjdXRlT25TYXZlID0gYXRvbS5jb25maWcuZ2V0ICdwaHAtY3MtZml4ZXIuZXhlY3V0ZU9uU2F2ZSdcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3BocC1jcy1maXhlci5waHBFeGVjdXRhYmxlUGF0aCcsID0+XG4gICAgICBAcGhwRXhlY3V0YWJsZVBhdGggPSBhdG9tLmNvbmZpZy5nZXQgJ3BocC1jcy1maXhlci5waHBFeGVjdXRhYmxlUGF0aCdcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3BocC1jcy1maXhlci5leGVjdXRhYmxlUGF0aCcsID0+XG4gICAgICBAZXhlY3V0YWJsZVBhdGggPSBhdG9tLmNvbmZpZy5nZXQgJ3BocC1jcy1maXhlci5leGVjdXRhYmxlUGF0aCdcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3BocC1jcy1maXhlci5jb25maWdQYXRoJywgPT5cbiAgICAgIEBjb25maWdQYXRoID0gYXRvbS5jb25maWcuZ2V0ICdwaHAtY3MtZml4ZXIuY29uZmlnUGF0aCdcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3BocC1jcy1maXhlci5hbGxvd1Jpc2t5JywgPT5cbiAgICAgIEBhbGxvd1Jpc2t5ID0gYXRvbS5jb25maWcuZ2V0ICdwaHAtY3MtZml4ZXIuYWxsb3dSaXNreSdcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3BocC1jcy1maXhlci5ydWxlcycsID0+XG4gICAgICBAcnVsZXMgPSBhdG9tLmNvbmZpZy5nZXQgJ3BocC1jcy1maXhlci5ydWxlcydcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3BocC1jcy1maXhlci5zaG93SW5mb05vdGlmaWNhdGlvbnMnLCA9PlxuICAgICAgQHNob3dJbmZvTm90aWZpY2F0aW9ucyA9IGF0b20uY29uZmlnLmdldCAncGhwLWNzLWZpeGVyLnNob3dJbmZvTm90aWZpY2F0aW9ucydcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3BocC1jcy1maXhlci5waHBBcmd1bWVudHMnLCA9PlxuICAgICAgQHBocEFyZ3VtZW50cyA9IGF0b20uY29uZmlnLmdldCAncGhwLWNzLWZpeGVyLnBocEFyZ3VtZW50cydcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3BocC1jcy1maXhlci5maXhlckFyZ3VtZW50cycsID0+XG4gICAgICBAZml4ZXJBcmd1bWVudHMgPSBhdG9tLmNvbmZpZy5nZXQgJ3BocC1jcy1maXhlci5maXhlckFyZ3VtZW50cydcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3BocC1jcy1maXhlci5wYXRoTW9kZScsID0+XG4gICAgICBAcGF0aE1vZGUgPSBhdG9tLmNvbmZpZy5nZXQgJ3BocC1jcy1maXhlci5wYXRoTW9kZSdcblxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAjIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAncGhwLWNzLWZpeGVyOmZpeCc6ID0+IEBmaXgoKVxuXG4gICAgIyBBZGQgd29ya3NwYWNlIG9ic2VydmVyIGFuZCBzYXZlIGhhbmRsZXJcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUgPT5cbiAgICAgICAgaWYgZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lID09IFwiUEhQXCIgYW5kIEBleGVjdXRlT25TYXZlXG4gICAgICAgICAgQGZpeCgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICBmaXg6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCkgaWYgZWRpdG9yICYmIGVkaXRvci5nZXRQYXRoXG5cbiAgICBjb21tYW5kID0gQHBocEV4ZWN1dGFibGVQYXRoXG5cbiAgICBhcmdzID0gW11cblxuICAgIGlmIEBwaHBBcmd1bWVudHMubGVuZ3RoXG4gICAgICBpZiBAcGhwQXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgICAgYXJncyA9IEBwaHBBcmd1bWVudHNcbiAgICAgIGVsc2VcbiAgICAgICAgYXJncyA9IEBwaHBBcmd1bWVudHNbMF0uc3BsaXQoJyAnKVxuXG4gICAgYXJncyA9IGFyZ3MuY29uY2F0IFtAZXhlY3V0YWJsZVBhdGgsICdmaXgnLCBmaWxlUGF0aF1cblxuICAgIGlmIG5vdCBAY29uZmlnUGF0aCBhbmQgY29uZmlnUGF0aCA9IEBmaW5kRmlsZShwYXRoLmRpcm5hbWUoZmlsZVBhdGgudG9TdHJpbmcoKSksIFsnLnBocF9jcycsICcucGhwX2NzLmRpc3QnXSlcbiAgICAgIEBjb25maWdQYXRoID0gY29uZmlnUGF0aFxuXG4gICAgaWYgQGNvbmZpZ1BhdGhcbiAgICAgIGFyZ3MucHVzaCAnLS1jb25maWc9JyArIEBjb25maWdQYXRoXG5cbiAgICAjIGFkZCBvcHRpb25hbCBvcHRpb25zXG4gICAgaWYgbm90IEBjb25maWdQYXRoXG4gICAgICBhcmdzLnB1c2ggJy0tYWxsb3ctcmlza3k9eWVzJyBpZiBAYWxsb3dSaXNreVxuICAgICAgYXJncy5wdXNoICctLXJ1bGVzPScgKyBAcnVsZXMgaWYgQHJ1bGVzXG5cbiAgICBhcmdzLnB1c2ggJy0tcGF0aC1tb2RlPScgKyBAcGF0aE1vZGUgaWYgQHBhdGhNb2RlXG5cbiAgICBpZiBAZml4ZXJBcmd1bWVudHMubGVuZ3RoIGFuZCBub3QgQGNvbmZpZ1BhdGhcbiAgICAgIGlmIEBmaXhlckFyZ3VtZW50cy5sZW5ndGggPiAxXG4gICAgICAgIGZpeGVyQXJncyA9IEBmaXhlckFyZ3VtZW50c1xuICAgICAgZWxzZVxuICAgICAgICBmaXhlckFyZ3MgPSBAZml4ZXJBcmd1bWVudHNbMF0uc3BsaXQoJyAnKVxuXG4gICAgICBhcmdzID0gYXJncy5jb25jYXQgZml4ZXJBcmdzO1xuXG4gICAgc3Rkb3V0ID0gKG91dHB1dCkgLT5cbiAgICAgIGlmIFBocENzRml4ZXIuc2hvd0luZm9Ob3RpZmljYXRpb25zXG4gICAgICAgIGlmICgvXlxccypcXGQqWyldLy50ZXN0KG91dHB1dCkpXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3Mob3V0cHV0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8ob3V0cHV0KVxuICAgICAgY29uc29sZS5sb2cob3V0cHV0KVxuXG4gICAgc3RkZXJyID0gKG91dHB1dCkgLT5cbiAgICAgIGlmIFBocENzRml4ZXIuc2hvd0luZm9Ob3RpZmljYXRpb25zXG4gICAgICAgIGlmIChvdXRwdXQucmVwbGFjZSgvXFxzL2csXCJcIikgPT0gXCJcIilcbiAgICAgICAgICAjIGRvIG5vdGhpbmdcbiAgICAgICAgZWxzZSBpZiAoL15Mb2FkZWQgY29uZmlnLy50ZXN0KG91dHB1dCkpICMgdGVtcG9yYXJ5IGZpeGluZyBodHRwczovL2dpdGh1Yi5jb20vcGZlZmZlcmxlL2F0b20tcGhwLWNzLWZpeGVyL2lzc3Vlcy8zNVxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKG91dHB1dClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihvdXRwdXQpXG4gICAgICAgICAgY29uc29sZS5lcnJvcihvdXRwdXQpXG5cbiAgICBleGl0ID0gKGNvZGUpIC0+IGNvbnNvbGUubG9nKFwiI3tjb21tYW5kfSBleGl0ZWQgd2l0aCBjb2RlOiAje2NvZGV9XCIpXG5cbiAgICBwcm9jZXNzID0gbmV3IEJ1ZmZlcmVkUHJvY2Vzcyh7XG4gICAgICBjb21tYW5kOiBjb21tYW5kLFxuICAgICAgYXJnczogYXJncyxcbiAgICAgIHN0ZG91dDogc3Rkb3V0LFxuICAgICAgc3RkZXJyOiBzdGRlcnIsXG4gICAgICBleGl0OiBleGl0XG4gICAgfSkgaWYgZmlsZVBhdGhcblxuICAjIGNvcGllZCBmcm9tIHRoZSBBdG9tTGludGVyIGxpYlxuICAjIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL0F0b21MaW50ZXIvYXRvbS1saW50ZXIvYmxvYi9tYXN0ZXIvbGliL2hlbHBlcnMuY29mZmVlI0wxMTJcbiAgI1xuICAjIFRoZSBBdG9tTGludGVyIGlzIGxpY2Vuc2VkIHVuZGVyIFwiVGhlIE1JVCBMaWNlbnNlIChNSVQpXCJcbiAgI1xuICAjIENvcHlyaWdodCAoYykgMjAxNSBBdG9tTGludGVyXG4gICNcbiAgIyBTZWUgdGhlIGZ1bGwgbGljZW5zZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vQXRvbUxpbnRlci9hdG9tLWxpbnRlci9ibG9iL21hc3Rlci9MSUNFTlNFXG4gIGZpbmRGaWxlOiAoc3RhcnREaXIsIG5hbWVzKSAtPlxuICAgIHRocm93IG5ldyBFcnJvciBcIlNwZWNpZnkgYSBmaWxlbmFtZSB0byBmaW5kXCIgdW5sZXNzIGFyZ3VtZW50cy5sZW5ndGhcbiAgICB1bmxlc3MgbmFtZXMgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgbmFtZXMgPSBbbmFtZXNdXG4gICAgc3RhcnREaXIgPSBzdGFydERpci5zcGxpdChwYXRoLnNlcClcbiAgICB3aGlsZSBzdGFydERpci5sZW5ndGhcbiAgICAgIGN1cnJlbnREaXIgPSBzdGFydERpci5qb2luKHBhdGguc2VwKVxuICAgICAgZm9yIG5hbWUgaW4gbmFtZXNcbiAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4oY3VycmVudERpciwgbmFtZSlcbiAgICAgICAgdHJ5XG4gICAgICAgICAgZnMuYWNjZXNzU3luYyhmaWxlUGF0aCwgZnMuUl9PSylcbiAgICAgICAgICByZXR1cm4gZmlsZVBhdGhcbiAgICAgIHN0YXJ0RGlyLnBvcCgpXG4gICAgcmV0dXJuIG51bGxcbiJdfQ==
