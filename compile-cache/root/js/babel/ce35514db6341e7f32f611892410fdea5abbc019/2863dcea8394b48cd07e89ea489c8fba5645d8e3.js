'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var toggleQuotes = function toggleQuotes(editor) {
  editor.transact(function () {
    for (var cursor of editor.getCursors()) {
      var position = cursor.getBufferPosition();
      toggleQuoteAtPosition(editor, position);
      cursor.setBufferPosition(position);
    }
  });
};

exports.toggleQuotes = toggleQuotes;
var getNextQuoteCharacter = function getNextQuoteCharacter(quoteCharacter, allQuoteCharacters) {
  var index = allQuoteCharacters.indexOf(quoteCharacter);
  if (index === -1) {
    return null;
  } else {
    return allQuoteCharacters[(index + 1) % allQuoteCharacters.length];
  }
};

var quoted = function quoted(_ref) {
  var text = _ref.text;
  return (text.startsWith('"') || text.startsWith("'")) && text.endsWith(text[0]);
};

var toggleQuoteAtPosition = function toggleQuoteAtPosition(editor, position) {
  var quoteChars = atom.config.get('toggle-quotes.quoteCharacters', {
    scope: editor.getRootScopeDescriptor()
  });
  var range = undefined;
  if (editor.languageMode.getSyntaxNodeAtPosition) {
    var node = editor.languageMode.getSyntaxNodeAtPosition(position, quoted);
    range = node && node.range;
  } else {
    range = editor.bufferRangeForScopeAtPosition('.string.quoted', position);
  }

  if (!range) {
    // Attempt to match the current invalid region if it is wrapped in quotes
    // This is useful for languages where changing the quotes makes the range
    // invalid and so toggling again should properly restore the valid quotes

    range = editor.bufferRangeForScopeAtPosition('.invalid.illegal', position);
    if (range) {
      var inner = quoteChars.split('').map(function (character) {
        return character + '.*' + character;
      }).join('|');

      if (!RegExp('^(' + inner + ')$', 'g').test(editor.getTextInBufferRange(range))) {
        return;
      }
    }
  }

  if (range == null) {
    return;
  }

  var text = editor.getTextInBufferRange(range);

  var _text = _slicedToArray(text, 1);

  var quoteCharacter = _text[0];

  // In Python a string can have a prefix specifying its format. The Python
  // grammar includes this prefix in the string, and thus we need to exclude
  // it when toggling quotes
  var prefix = '';
  if (/[uUr]/.test(quoteCharacter)) {
    var _text2 = _slicedToArray(text, 2);

    prefix = _text2[0];
    quoteCharacter = _text2[1];
  }

  var nextQuoteCharacter = getNextQuoteCharacter(quoteCharacter, quoteChars);

  if (!nextQuoteCharacter) {
    return;
  }

  // let quoteRegex = new RegExp(quoteCharacter, 'g')
  var escapedQuoteRegex = new RegExp('\\\\' + quoteCharacter, 'g');
  var nextQuoteRegex = new RegExp(nextQuoteCharacter, 'g');

  var newText = text.replace(nextQuoteRegex, '\\' + nextQuoteCharacter).replace(escapedQuoteRegex, quoteCharacter);

  newText = prefix + nextQuoteCharacter + newText.slice(1 + prefix.length, -1) + nextQuoteCharacter;

  editor.setTextInBufferRange(range, newText);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi90b2dnbGUtcXVvdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7QUFFSixJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxNQUFNLEVBQUs7QUFDdEMsUUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFNO0FBQ3BCLFNBQUssSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3RDLFVBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0FBQ3pDLDJCQUFxQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUN2QyxZQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDbkM7R0FDRixDQUFDLENBQUE7Q0FDSCxDQUFBOzs7QUFFRCxJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFJLGNBQWMsRUFBRSxrQkFBa0IsRUFBSztBQUNwRSxNQUFJLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDdEQsTUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsV0FBTyxJQUFJLENBQUE7R0FDWixNQUFNO0FBQ0wsV0FBTyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUEsR0FBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUNuRTtDQUNGLENBQUE7O0FBRUQsSUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksSUFBTTtNQUFMLElBQUksR0FBTCxJQUFNLENBQUwsSUFBSTtTQUNuQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQUEsQ0FBQTs7QUFFMUUsSUFBTSxxQkFBcUIsR0FBRyxTQUF4QixxQkFBcUIsQ0FBSSxNQUFNLEVBQUUsUUFBUSxFQUFLO0FBQ2xELE1BQUksVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFO0FBQ2hFLFNBQUssRUFBRSxNQUFNLENBQUMsc0JBQXNCLEVBQUU7R0FDdkMsQ0FBQyxDQUFBO0FBQ0YsTUFBSSxLQUFLLFlBQUEsQ0FBQTtBQUNULE1BQUksTUFBTSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsRUFBRTtBQUMvQyxRQUFNLElBQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUMxRSxTQUFLLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUE7R0FDM0IsTUFBTTtBQUNMLFNBQUssR0FBRyxNQUFNLENBQUMsNkJBQTZCLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUE7R0FDekU7O0FBRUQsTUFBSSxDQUFDLEtBQUssRUFBRTs7Ozs7QUFLVixTQUFLLEdBQUcsTUFBTSxDQUFDLDZCQUE2QixDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQzFFLFFBQUksS0FBSyxFQUFFO0FBQ1QsVUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxTQUFTO2VBQU8sU0FBUyxVQUFLLFNBQVM7T0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUV6RixVQUFJLENBQUMsTUFBTSxRQUFNLEtBQUssU0FBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDekUsZUFBTTtPQUNQO0tBQ0Y7R0FDRjs7QUFFRCxNQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDakIsV0FBTTtHQUNQOztBQUVELE1BQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTs7NkJBQ3RCLElBQUk7O01BQXRCLGNBQWM7Ozs7O0FBS25CLE1BQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtBQUNmLE1BQUksT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtnQ0FDTCxJQUFJOztBQUE5QixVQUFNO0FBQUUsa0JBQWM7R0FDeEI7O0FBRUQsTUFBSSxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUE7O0FBRTFFLE1BQUksQ0FBQyxrQkFBa0IsRUFBRTtBQUN2QixXQUFNO0dBQ1A7OztBQUdELE1BQUksaUJBQWlCLEdBQUcsSUFBSSxNQUFNLFVBQVEsY0FBYyxFQUFJLEdBQUcsQ0FBQyxDQUFBO0FBQ2hFLE1BQUksY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFBOztBQUV4RCxNQUFJLE9BQU8sR0FBRyxJQUFJLENBQ2YsT0FBTyxDQUFDLGNBQWMsU0FBTyxrQkFBa0IsQ0FBRyxDQUNsRCxPQUFPLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUE7O0FBRTdDLFNBQU8sR0FBRyxNQUFNLEdBQUcsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFBOztBQUVqRyxRQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0NBQzVDLENBQUEiLCJmaWxlIjoiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3RvZ2dsZS1xdW90ZXMvbGliL3RvZ2dsZS1xdW90ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5leHBvcnQgY29uc3QgdG9nZ2xlUXVvdGVzID0gKGVkaXRvcikgPT4ge1xuICBlZGl0b3IudHJhbnNhY3QoKCkgPT4ge1xuICAgIGZvciAobGV0IGN1cnNvciBvZiBlZGl0b3IuZ2V0Q3Vyc29ycygpKSB7XG4gICAgICBsZXQgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgdG9nZ2xlUXVvdGVBdFBvc2l0aW9uKGVkaXRvciwgcG9zaXRpb24pXG4gICAgICBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24ocG9zaXRpb24pXG4gICAgfVxuICB9KVxufVxuXG5jb25zdCBnZXROZXh0UXVvdGVDaGFyYWN0ZXIgPSAocXVvdGVDaGFyYWN0ZXIsIGFsbFF1b3RlQ2hhcmFjdGVycykgPT4ge1xuICBsZXQgaW5kZXggPSBhbGxRdW90ZUNoYXJhY3RlcnMuaW5kZXhPZihxdW90ZUNoYXJhY3RlcilcbiAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgIHJldHVybiBudWxsXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGFsbFF1b3RlQ2hhcmFjdGVyc1soaW5kZXggKyAxKSAlIGFsbFF1b3RlQ2hhcmFjdGVycy5sZW5ndGhdXG4gIH1cbn1cblxuY29uc3QgcXVvdGVkID0gKHt0ZXh0fSkgPT5cbiAgKHRleHQuc3RhcnRzV2l0aCgnXCInKSB8fCB0ZXh0LnN0YXJ0c1dpdGgoXCInXCIpKSAmJiB0ZXh0LmVuZHNXaXRoKHRleHRbMF0pXG5cbmNvbnN0IHRvZ2dsZVF1b3RlQXRQb3NpdGlvbiA9IChlZGl0b3IsIHBvc2l0aW9uKSA9PiB7XG4gIGxldCBxdW90ZUNoYXJzID0gYXRvbS5jb25maWcuZ2V0KCd0b2dnbGUtcXVvdGVzLnF1b3RlQ2hhcmFjdGVycycsIHtcbiAgICBzY29wZTogZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKVxuICB9KVxuICBsZXQgcmFuZ2VcbiAgaWYgKGVkaXRvci5sYW5ndWFnZU1vZGUuZ2V0U3ludGF4Tm9kZUF0UG9zaXRpb24pIHtcbiAgICBjb25zdCBub2RlID0gZWRpdG9yLmxhbmd1YWdlTW9kZS5nZXRTeW50YXhOb2RlQXRQb3NpdGlvbihwb3NpdGlvbiwgcXVvdGVkKVxuICAgIHJhbmdlID0gbm9kZSAmJiBub2RlLnJhbmdlXG4gIH0gZWxzZSB7XG4gICAgcmFuZ2UgPSBlZGl0b3IuYnVmZmVyUmFuZ2VGb3JTY29wZUF0UG9zaXRpb24oJy5zdHJpbmcucXVvdGVkJywgcG9zaXRpb24pXG4gIH1cblxuICBpZiAoIXJhbmdlKSB7XG4gICAgLy8gQXR0ZW1wdCB0byBtYXRjaCB0aGUgY3VycmVudCBpbnZhbGlkIHJlZ2lvbiBpZiBpdCBpcyB3cmFwcGVkIGluIHF1b3Rlc1xuICAgIC8vIFRoaXMgaXMgdXNlZnVsIGZvciBsYW5ndWFnZXMgd2hlcmUgY2hhbmdpbmcgdGhlIHF1b3RlcyBtYWtlcyB0aGUgcmFuZ2VcbiAgICAvLyBpbnZhbGlkIGFuZCBzbyB0b2dnbGluZyBhZ2FpbiBzaG91bGQgcHJvcGVybHkgcmVzdG9yZSB0aGUgdmFsaWQgcXVvdGVzXG5cbiAgICByYW5nZSA9IGVkaXRvci5idWZmZXJSYW5nZUZvclNjb3BlQXRQb3NpdGlvbignLmludmFsaWQuaWxsZWdhbCcsIHBvc2l0aW9uKVxuICAgIGlmIChyYW5nZSkge1xuICAgICAgbGV0IGlubmVyID0gcXVvdGVDaGFycy5zcGxpdCgnJykubWFwKGNoYXJhY3RlciA9PiBgJHtjaGFyYWN0ZXJ9Lioke2NoYXJhY3Rlcn1gKS5qb2luKCd8JylcblxuICAgICAgaWYgKCFSZWdFeHAoYF4oJHtpbm5lcn0pJGAsICdnJykudGVzdChlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAocmFuZ2UgPT0gbnVsbCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgbGV0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UpXG4gIGxldCBbcXVvdGVDaGFyYWN0ZXJdID0gdGV4dFxuXG4gIC8vIEluIFB5dGhvbiBhIHN0cmluZyBjYW4gaGF2ZSBhIHByZWZpeCBzcGVjaWZ5aW5nIGl0cyBmb3JtYXQuIFRoZSBQeXRob25cbiAgLy8gZ3JhbW1hciBpbmNsdWRlcyB0aGlzIHByZWZpeCBpbiB0aGUgc3RyaW5nLCBhbmQgdGh1cyB3ZSBuZWVkIHRvIGV4Y2x1ZGVcbiAgLy8gaXQgd2hlbiB0b2dnbGluZyBxdW90ZXNcbiAgbGV0IHByZWZpeCA9ICcnXG4gIGlmICgvW3VVcl0vLnRlc3QocXVvdGVDaGFyYWN0ZXIpKSB7XG4gICAgW3ByZWZpeCwgcXVvdGVDaGFyYWN0ZXJdID0gdGV4dFxuICB9XG5cbiAgbGV0IG5leHRRdW90ZUNoYXJhY3RlciA9IGdldE5leHRRdW90ZUNoYXJhY3RlcihxdW90ZUNoYXJhY3RlciwgcXVvdGVDaGFycylcblxuICBpZiAoIW5leHRRdW90ZUNoYXJhY3Rlcikge1xuICAgIHJldHVyblxuICB9XG5cbiAgLy8gbGV0IHF1b3RlUmVnZXggPSBuZXcgUmVnRXhwKHF1b3RlQ2hhcmFjdGVyLCAnZycpXG4gIGxldCBlc2NhcGVkUXVvdGVSZWdleCA9IG5ldyBSZWdFeHAoYFxcXFxcXFxcJHtxdW90ZUNoYXJhY3Rlcn1gLCAnZycpXG4gIGxldCBuZXh0UXVvdGVSZWdleCA9IG5ldyBSZWdFeHAobmV4dFF1b3RlQ2hhcmFjdGVyLCAnZycpXG5cbiAgbGV0IG5ld1RleHQgPSB0ZXh0XG4gICAgLnJlcGxhY2UobmV4dFF1b3RlUmVnZXgsIGBcXFxcJHtuZXh0UXVvdGVDaGFyYWN0ZXJ9YClcbiAgICAucmVwbGFjZShlc2NhcGVkUXVvdGVSZWdleCwgcXVvdGVDaGFyYWN0ZXIpXG5cbiAgbmV3VGV4dCA9IHByZWZpeCArIG5leHRRdW90ZUNoYXJhY3RlciArIG5ld1RleHQuc2xpY2UoMSArIHByZWZpeC5sZW5ndGgsIC0xKSArIG5leHRRdW90ZUNoYXJhY3RlclxuXG4gIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSwgbmV3VGV4dClcbn1cbiJdfQ==