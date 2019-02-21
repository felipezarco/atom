var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

CSON = require('season');
fs = require('fs');
path = require('path');

module.exports = (function () {
  function GrammarCompiler() {
    _classCallCheck(this, GrammarCompiler);
  }

  // Loads the basic grammar structure,
  // which includes the grouped parts in the repository,
  // and then loads all grammar subrepositories,
  // and appends them to the main repository,
  // and finally writes {grammar} to {output}

  _createClass(GrammarCompiler, [{
    key: 'compile',
    value: function compile() {
      var input = '../grammars/repositories/markdown.cson';
      var output = '../grammars/language-markdown.json';
      var directories = ['blocks', 'flavors', 'inlines'];
      var inputPath = path.join(__dirname, input);
      var grammar = CSON.readFileSync(inputPath);

      grammar.injections = this.compileInjectionsGrammar();

      for (var i = 0; i < directories.length; i++) {
        var directoryPath = path.join(__dirname, '../grammars/repositories/' + directories[i]);
        var directory = new _atom.Directory(directoryPath);
        var entries = directory.getEntriesSync();
        for (var j = 0; j < entries.length; j++) {
          var entry = entries[j];

          var _CSON$readFileSync = CSON.readFileSync(entry.path);

          var key = _CSON$readFileSync.key;
          var patterns = _CSON$readFileSync.patterns;

          if (key && patterns) {
            grammar.repository[key] = { patterns: patterns };
          }
        }
      }

      grammar.repository['fenced-code-blocks'] = {
        patterns: this.compileFencedCodeGrammar()
      };

      var outputPath = path.join(__dirname, output);
      CSON.writeFileSync(outputPath, grammar, (function () {
        return atom.commands.dispatch('body', 'window:reload');
      })());
    }

    // Reads fixtures from {input},
    // parses {data} to expand shortened syntax,
    // creates and returns patterns from valid items in {data}.
  }, {
    key: 'compileFencedCodeGrammar',
    value: function compileFencedCodeGrammar() {
      var input = '../grammars/fixtures/fenced-code.cson';
      var inputPath = path.join(__dirname, input);
      var data = CSON.readFileSync(inputPath);
      return this.createPatternsFromData(data);
    }

    // Reads fixtures from {input},
    // parses {data} to expand shortened syntax,
    // creates and returns patterns from valid items in {data}.
  }, {
    key: 'compileInjectionsGrammar',
    value: function compileInjectionsGrammar() {
      var directoryPath = path.join(__dirname, '../grammars/injections');
      var directory = new _atom.Directory(directoryPath);
      var entries = directory.getEntriesSync();
      var injections = {};

      for (var j = 0; j < entries.length; j++) {
        var entry = entries[j];

        var _CSON$readFileSync2 = CSON.readFileSync(entry.path);

        var key = _CSON$readFileSync2.key;
        var patterns = _CSON$readFileSync2.patterns;

        if (key && patterns) {
          injections[key] = {
            patterns: patterns
          };
        }
      }

      return injections;
    }

    // Transform an {item} into a {pattern} object,
    // and adds it to the {patterns} array.
  }, {
    key: 'createPatternsFromData',
    value: function createPatternsFromData(data) {
      var patterns = [];
      for (var i = 0; i < data.list.length; i++) {
        var item = this.parseItem(data.list[i]);
        if (item) {
          patterns.push({
            begin: '^\\s*([`~]{3,})\\s*(\\{?)((?:\\.?)(?:' + item.pattern + '))(?=( |$|{))\\s*(\\{?)([^`\\{\\}]*)(\\}?)$',
            beginCaptures: {
              '1': { name: 'punctuation.md' },
              '2': { name: 'punctuation.md' },
              '3': { name: 'language.constant.md' },
              '5': { name: 'punctuation.md' },
              '6': { patterns: [{ include: '#special-attribute-elements' }] },
              '7': { name: 'punctuation.md' }
            },
            end: '^\\s*(\\1)$',
            endCaptures: {
              '1': { name: 'punctuation.md' }
            },
            name: 'fenced.code.md',
            contentName: item.contentName,
            patterns: [{
              include: item.include
            }]
          });
        }
      }
      return patterns;
    }

    // When provided with a valid {item} ({item.pattern} is required),
    // missing {include} and {contentName} are generated.
  }, {
    key: 'parseItem',
    value: function parseItem(item) {
      if (typeof item === 'object' && item.pattern !== null) {
        if (!item.include && !item.contentName) {
          item.include = 'source.' + item.pattern;
          item.contentName = 'source.embedded.' + item.pattern;
        } else if (!item.include) {
          return false;
        }
        return item;
      }
      return false;
    }
  }]);

  return GrammarCompiler;
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1tYXJrZG93bi9saWIvR3JhbW1hckNvbXBpbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRTBCLE1BQU07O0FBRmhDLFdBQVcsQ0FBQTs7QUFJWCxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3hCLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDbEIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFdEIsTUFBTSxDQUFDLE9BQU87QUFDQSxXQURTLGVBQWUsR0FDckI7MEJBRE0sZUFBZTtHQUNuQjs7Ozs7Ozs7ZUFESSxlQUFlOztXQVE1QixtQkFBRztBQUNULFVBQU0sS0FBSyxHQUFHLHdDQUF3QyxDQUFBO0FBQ3RELFVBQU0sTUFBTSxHQUFHLG9DQUFvQyxDQUFBO0FBQ25ELFVBQU0sV0FBVyxHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUNwRCxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUM3QyxVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBOztBQUU1QyxhQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFBOztBQUVwRCxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMzQyxZQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwyQkFBMkIsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN4RixZQUFNLFNBQVMsR0FBRyxvQkFBYyxhQUFhLENBQUMsQ0FBQTtBQUM5QyxZQUFNLE9BQU8s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Q2I7QUFDRCxlQUFPLElBQUksQ0FBQTtPQUNaO0FBQ0QsYUFBTyxLQUFLLENBQUE7S0FDYjs7O1NBdEhvQixlQUFlO0lBdUhyQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1tYXJrZG93bi9saWIvR3JhbW1hckNvbXBpbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgRGlyZWN0b3J5IH0gZnJvbSAnYXRvbSdcblxuQ1NPTiA9IHJlcXVpcmUoJ3NlYXNvbicpXG5mcyA9IHJlcXVpcmUoJ2ZzJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHcmFtbWFyQ29tcGlsZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7fVxuXG4gIC8vIExvYWRzIHRoZSBiYXNpYyBncmFtbWFyIHN0cnVjdHVyZSxcbiAgLy8gd2hpY2ggaW5jbHVkZXMgdGhlIGdyb3VwZWQgcGFydHMgaW4gdGhlIHJlcG9zaXRvcnksXG4gIC8vIGFuZCB0aGVuIGxvYWRzIGFsbCBncmFtbWFyIHN1YnJlcG9zaXRvcmllcyxcbiAgLy8gYW5kIGFwcGVuZHMgdGhlbSB0byB0aGUgbWFpbiByZXBvc2l0b3J5LFxuICAvLyBhbmQgZmluYWxseSB3cml0ZXMge2dyYW1tYXJ9IHRvIHtvdXRwdXR9XG4gIGNvbXBpbGUgKCkge1xuICAgIGNvbnN0IGlucHV0ID0gJy4uL2dyYW1tYXJzL3JlcG9zaXRvcmllcy9tYXJrZG93bi5jc29uJ1xuICAgIGNvbnN0IG91dHB1dCA9ICcuLi9ncmFtbWFycy9sYW5ndWFnZS1tYXJrZG93bi5qc29uJ1xuICAgIGNvbnN0IGRpcmVjdG9yaWVzID0gWydibG9ja3MnLCAnZmxhdm9ycycsICdpbmxpbmVzJ11cbiAgICBjb25zdCBpbnB1dFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBpbnB1dClcbiAgICBjb25zdCBncmFtbWFyID0gQ1NPTi5yZWFkRmlsZVN5bmMoaW5wdXRQYXRoKVxuXG4gICAgZ3JhbW1hci5pbmplY3Rpb25zID0gdGhpcy5jb21waWxlSW5qZWN0aW9uc0dyYW1tYXIoKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXJlY3Rvcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZGlyZWN0b3J5UGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9ncmFtbWFycy9yZXBvc2l0b3JpZXMvJyArIGRpcmVjdG9yaWVzW2ldKVxuICAgICAgY29uc3QgZGlyZWN0b3J5ID0gbmV3IERpcmVjdG9yeShkaXJlY3RvcnlQYXRoKVxuICAgICAgY29uc3QgZW50cmllcyA9IGRpcmVjdG9yeS5nZXRFbnRyaWVzU3luYygpXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGVudHJpZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgZW50cnkgPSBlbnRyaWVzW2pdO1xuICAgICAgICBjb25zdCB7IGtleSwgcGF0dGVybnMgfSA9IENTT04ucmVhZEZpbGVTeW5jKGVudHJ5LnBhdGgpXG4gICAgICAgIGlmIChrZXkgJiYgcGF0dGVybnMpIHtcbiAgICAgICAgICBncmFtbWFyLnJlcG9zaXRvcnlba2V5XSA9IHsgcGF0dGVybnMgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ3JhbW1hci5yZXBvc2l0b3J5WydmZW5jZWQtY29kZS1ibG9ja3MnXSA9IHtcbiAgICAgIHBhdHRlcm5zOiB0aGlzLmNvbXBpbGVGZW5jZWRDb2RlR3JhbW1hcigpXG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0UGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsIG91dHB1dClcbiAgICBDU09OLndyaXRlRmlsZVN5bmMob3V0cHV0UGF0aCwgZ3JhbW1hciwgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKCdib2R5JywgJ3dpbmRvdzpyZWxvYWQnKVxuICAgIH0pKCkpXG4gIH1cblxuICAvLyBSZWFkcyBmaXh0dXJlcyBmcm9tIHtpbnB1dH0sXG4gIC8vIHBhcnNlcyB7ZGF0YX0gdG8gZXhwYW5kIHNob3J0ZW5lZCBzeW50YXgsXG4gIC8vIGNyZWF0ZXMgYW5kIHJldHVybnMgcGF0dGVybnMgZnJvbSB2YWxpZCBpdGVtcyBpbiB7ZGF0YX0uXG4gIGNvbXBpbGVGZW5jZWRDb2RlR3JhbW1hciAoKSB7XG4gICAgY29uc3QgaW5wdXQgPSAnLi4vZ3JhbW1hcnMvZml4dHVyZXMvZmVuY2VkLWNvZGUuY3NvbidcbiAgICBjb25zdCBpbnB1dFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBpbnB1dClcbiAgICBjb25zdCBkYXRhID0gQ1NPTi5yZWFkRmlsZVN5bmMoaW5wdXRQYXRoKVxuICAgIHJldHVybiB0aGlzLmNyZWF0ZVBhdHRlcm5zRnJvbURhdGEoZGF0YSlcbiAgfVxuXG4gIC8vIFJlYWRzIGZpeHR1cmVzIGZyb20ge2lucHV0fSxcbiAgLy8gcGFyc2VzIHtkYXRhfSB0byBleHBhbmQgc2hvcnRlbmVkIHN5bnRheCxcbiAgLy8gY3JlYXRlcyBhbmQgcmV0dXJucyBwYXR0ZXJucyBmcm9tIHZhbGlkIGl0ZW1zIGluIHtkYXRhfS5cbiAgY29tcGlsZUluamVjdGlvbnNHcmFtbWFyICgpIHtcbiAgICBjb25zdCBkaXJlY3RvcnlQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2dyYW1tYXJzL2luamVjdGlvbnMnKVxuICAgIGNvbnN0IGRpcmVjdG9yeSA9IG5ldyBEaXJlY3RvcnkoZGlyZWN0b3J5UGF0aClcbiAgICBjb25zdCBlbnRyaWVzID0gZGlyZWN0b3J5LmdldEVudHJpZXNTeW5jKClcbiAgICBjb25zdCBpbmplY3Rpb25zID0ge31cblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZW50cmllcy5sZW5ndGg7IGorKykge1xuICAgICAgY29uc3QgZW50cnkgPSBlbnRyaWVzW2pdO1xuICAgICAgY29uc3QgeyBrZXksIHBhdHRlcm5zIH0gPSBDU09OLnJlYWRGaWxlU3luYyhlbnRyeS5wYXRoKVxuXG4gICAgICBpZiAoa2V5ICYmIHBhdHRlcm5zKSB7XG4gICAgICAgIGluamVjdGlvbnNba2V5XSA9IHtcbiAgICAgICAgICBwYXR0ZXJuczogcGF0dGVybnNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpbmplY3Rpb25zXG4gIH1cblxuICAvLyBUcmFuc2Zvcm0gYW4ge2l0ZW19IGludG8gYSB7cGF0dGVybn0gb2JqZWN0LFxuICAvLyBhbmQgYWRkcyBpdCB0byB0aGUge3BhdHRlcm5zfSBhcnJheS5cbiAgY3JlYXRlUGF0dGVybnNGcm9tRGF0YSAoZGF0YSkge1xuICAgIGNvbnN0IHBhdHRlcm5zID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMucGFyc2VJdGVtKGRhdGEubGlzdFtpXSlcbiAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgIHBhdHRlcm5zLnB1c2goe1xuICAgICAgICAgIGJlZ2luOiAnXlxcXFxzKihbYH5dezMsfSlcXFxccyooXFxcXHs/KSgoPzpcXFxcLj8pKD86JytpdGVtLnBhdHRlcm4rJykpKD89KCB8JHx7KSlcXFxccyooXFxcXHs/KShbXmBcXFxce1xcXFx9XSopKFxcXFx9PykkJyxcbiAgICAgICAgICBiZWdpbkNhcHR1cmVzOiB7XG4gICAgICAgICAgICAnMSc6IHsgbmFtZTogJ3B1bmN0dWF0aW9uLm1kJyB9LFxuICAgICAgICAgICAgJzInOiB7IG5hbWU6ICdwdW5jdHVhdGlvbi5tZCcgfSxcbiAgICAgICAgICAgICczJzogeyBuYW1lOiAnbGFuZ3VhZ2UuY29uc3RhbnQubWQnIH0sXG4gICAgICAgICAgICAnNSc6IHsgbmFtZTogJ3B1bmN0dWF0aW9uLm1kJyB9LFxuICAgICAgICAgICAgJzYnOiB7IHBhdHRlcm5zOiBbeyBpbmNsdWRlOiAnI3NwZWNpYWwtYXR0cmlidXRlLWVsZW1lbnRzJyB9XSB9LFxuICAgICAgICAgICAgJzcnOiB7IG5hbWU6ICdwdW5jdHVhdGlvbi5tZCcgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZW5kOiAnXlxcXFxzKihcXFxcMSkkJyxcbiAgICAgICAgICBlbmRDYXB0dXJlczoge1xuICAgICAgICAgICAgJzEnOiB7IG5hbWU6ICdwdW5jdHVhdGlvbi5tZCcgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbmFtZTogJ2ZlbmNlZC5jb2RlLm1kJyxcbiAgICAgICAgICBjb250ZW50TmFtZTogaXRlbS5jb250ZW50TmFtZSxcbiAgICAgICAgICBwYXR0ZXJuczogW3tcbiAgICAgICAgICAgIGluY2x1ZGU6IGl0ZW0uaW5jbHVkZVxuICAgICAgICAgIH1dXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXR0ZXJuc1xuICB9XG5cbiAgLy8gV2hlbiBwcm92aWRlZCB3aXRoIGEgdmFsaWQge2l0ZW19ICh7aXRlbS5wYXR0ZXJufSBpcyByZXF1aXJlZCksXG4gIC8vIG1pc3Npbmcge2luY2x1ZGV9IGFuZCB7Y29udGVudE5hbWV9IGFyZSBnZW5lcmF0ZWQuXG4gIHBhcnNlSXRlbSAoaXRlbSkge1xuICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbS5wYXR0ZXJuICE9PSBudWxsKSB7XG4gICAgICBpZiAoIWl0ZW0uaW5jbHVkZSAmJiAhaXRlbS5jb250ZW50TmFtZSkge1xuICAgICAgICBpdGVtLmluY2x1ZGUgPSAnc291cmNlLicgKyBpdGVtLnBhdHRlcm5cbiAgICAgICAgaXRlbS5jb250ZW50TmFtZSA9ICdzb3VyY2UuZW1iZWRkZWQuJyArIGl0ZW0ucGF0dGVyblxuICAgICAgfSBlbHNlIGlmICghaXRlbS5pbmNsdWRlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiJdfQ==