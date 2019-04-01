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

var escapePattern = function escapePattern(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// Using the quote characters configured by the user, build a pattern that can
// be used to filter the syntax nodes in tree-sitter mode.
var makePredicate = function makePredicate(quoteChars) {
  // We want text that begins and ends with the same quote character (and
  // _might_ start with one of Python's string format prefixes).
  var pattern = new RegExp('^[uUr]?([' + escapePattern(quoteChars) + '])[\\s\\S]*(\\1)$', 'g');
  return function (_ref) {
    var text = _ref.text;
    return pattern.test(text);
  };
};

var toggleQuoteAtPosition = function toggleQuoteAtPosition(editor, position) {
  var quoteChars = atom.config.get('toggle-quotes.quoteCharacters', {
    scope: editor.getRootScopeDescriptor()
  });
  var range = undefined;
  if (editor.languageMode.getSyntaxNodeAtPosition) {
    var node = editor.languageMode.getSyntaxNodeAtPosition(position, makePredicate(quoteChars));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi90b2dnbGUtcXVvdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7QUFFSixJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxNQUFNLEVBQUs7QUFDdEMsUUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFNO0FBQ3BCLFNBQUssSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFO0FBQ3RDLFVBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0FBQ3pDLDJCQUFxQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUN2QyxZQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDbkM7R0FDRixDQUFDLENBQUE7Q0FDSCxDQUFBOzs7QUFFRCxJQUFNLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFJLGNBQWMsRUFBRSxrQkFBa0IsRUFBSztBQUNwRSxNQUFJLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDdEQsTUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsV0FBTyxJQUFJLENBQUE7R0FDWixNQUFNO0FBQ0wsV0FBTyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUEsR0FBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtHQUNuRTtDQUNGLENBQUE7O0FBRUQsSUFBTSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFJLENBQUMsRUFBSztBQUMzQixTQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLENBQUE7Q0FDbkQsQ0FBQTs7OztBQUlELElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxVQUFVLEVBQUs7OztBQUdwQyxNQUFJLE9BQU8sR0FBRyxJ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bGlwZS8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi90b2dnbGUtcXVvdGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZVF1b3RlcyA9IChlZGl0b3IpID0+IHtcbiAgZWRpdG9yLnRyYW5zYWN0KCgpID0+IHtcbiAgICBmb3IgKGxldCBjdXJzb3Igb2YgZWRpdG9yLmdldEN1cnNvcnMoKSkge1xuICAgICAgbGV0IHBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIHRvZ2dsZVF1b3RlQXRQb3NpdGlvbihlZGl0b3IsIHBvc2l0aW9uKVxuICAgICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuICAgIH1cbiAgfSlcbn1cblxuY29uc3QgZ2V0TmV4dFF1b3RlQ2hhcmFjdGVyID0gKHF1b3RlQ2hhcmFjdGVyLCBhbGxRdW90ZUNoYXJhY3RlcnMpID0+IHtcbiAgbGV0IGluZGV4ID0gYWxsUXVvdGVDaGFyYWN0ZXJzLmluZGV4T2YocXVvdGVDaGFyYWN0ZXIpXG4gIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9IGVsc2Uge1xuICAgIHJldHVybiBhbGxRdW90ZUNoYXJhY3RlcnNbKGluZGV4ICsgMSkgJSBhbGxRdW90ZUNoYXJhY3RlcnMubGVuZ3RoXVxuICB9XG59XG5cbmNvbnN0IGVzY2FwZVBhdHRlcm4gPSAocykgPT4ge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKVxufVxuXG4vLyBVc2luZyB0aGUgcXVvdGUgY2hhcmFjdGVycyBjb25maWd1cmVkIGJ5IHRoZSB1c2VyLCBidWlsZCBhIHBhdHRlcm4gdGhhdCBjYW5cbi8vIGJlIHVzZWQgdG8gZmlsdGVyIHRoZSBzeW50YXggbm9kZXMgaW4gdHJlZS1zaXR0ZXIgbW9kZS5cbmNvbnN0IG1ha2VQcmVkaWNhdGUgPSAocXVvdGVDaGFycykgPT4ge1xuICAvLyBXZSB3YW50IHRleHQgdGhhdCBiZWdpbnMgYW5kIGVuZHMgd2l0aCB0aGUgc2FtZSBxdW90ZSBjaGFyYWN0ZXIgKGFuZFxuICAvLyBfbWlnaHRfIHN0YXJ0IHdpdGggb25lIG9mIFB5dGhvbidzIHN0cmluZyBmb3JtYXQgcHJlZml4ZXMpLlxuICBsZXQgcGF0dGVybiA9IG5ldyBSZWdFeHAoYF5bdVVyXT8oWyR7ZXNjYXBlUGF0dGVybihxdW90ZUNoYXJzKX1dKVtcXFxcc1xcXFxTXSooXFxcXDEpJGAsICdnJylcbiAgcmV0dXJuICh7IHRleHQgfSkgPT4gcGF0dGVybi50ZXN0KHRleHQpXG59XG5cbmNvbnN0IHRvZ2dsZVF1b3RlQXRQb3NpdGlvbiA9IChlZGl0b3IsIHBvc2l0aW9uKSA9PiB7XG4gIGxldCBxdW90ZUNoYXJzID0gYXRvbS5jb25maWcuZ2V0KCd0b2dnbGUtcXVvdGVzLnF1b3RlQ2hhcmFjdGVycycsIHtcbiAgICBzY29wZTogZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKVxuICB9KVxuICBsZXQgcmFuZ2VcbiAgaWYgKGVkaXRvci5sYW5ndWFnZU1vZGUuZ2V0U3ludGF4Tm9kZUF0UG9zaXRpb24pIHtcbiAgICBjb25zdCBub2RlID0gZWRpdG9yLmxhbmd1YWdlTW9kZS5nZXRTeW50YXhOb2RlQXRQb3NpdGlvbihwb3NpdGlvbiwgbWFrZVByZWRpY2F0ZShxdW90ZUNoYXJzKSlcbiAgICByYW5nZSA9IG5vZGUgJiYgbm9kZS5yYW5nZVxuICB9IGVsc2Uge1xuICAgIHJhbmdlID0gZWRpdG9yLmJ1ZmZlclJhbmdlRm9yU2NvcGVBdFBvc2l0aW9uKCcuc3RyaW5nLnF1b3RlZCcsIHBvc2l0aW9uKVxuICB9XG5cbiAgaWYgKCFyYW5nZSkge1xuICAgIC8vIEF0dGVtcHQgdG8gbWF0Y2ggdGhlIGN1cnJlbnQgaW52YWxpZCByZWdpb24gaWYgaXQgaXMgd3JhcHBlZCBpbiBxdW90ZXNcbiAgICAvLyBUaGlzIGlzIHVzZWZ1bCBmb3IgbGFuZ3VhZ2VzIHdoZXJlIGNoYW5naW5nIHRoZSBxdW90ZXMgbWFrZXMgdGhlIHJhbmdlXG4gICAgLy8gaW52YWxpZCBhbmQgc28gdG9nZ2xpbmcgYWdhaW4gc2hvdWxkIHByb3Blcmx5IHJlc3RvcmUgdGhlIHZhbGlkIHF1b3Rlc1xuXG4gICAgcmFuZ2UgPSBlZGl0b3IuYnVmZmVyUmFuZ2VGb3JTY29wZUF0UG9zaXRpb24oJy5pbnZhbGlkLmlsbGVnYWwnLCBwb3NpdGlvbilcbiAgICBpZiAocmFuZ2UpIHtcbiAgICAgIGxldCBpbm5lciA9IHF1b3RlQ2hhcnMuc3BsaXQoJycpLm1hcChjaGFyYWN0ZXIgPT4gYCR7Y2hhcmFjdGVyfS4qJHtjaGFyYWN0ZXJ9YCkuam9pbignfCcpXG5cbiAgICAgIGlmICghUmVnRXhwKGBeKCR7aW5uZXJ9KSRgLCAnZycpLnRlc3QoZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKSkpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHJhbmdlID09IG51bGwpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGxldCB0ZXh0ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuICBsZXQgW3F1b3RlQ2hhcmFjdGVyXSA9IHRleHRcblxuICAvLyBJbiBQeXRob24gYSBzdHJpbmcgY2FuIGhhdmUgYSBwcmVmaXggc3BlY2lmeWluZyBpdHMgZm9ybWF0LiBUaGUgUHl0aG9uXG4gIC8vIGdyYW1tYXIgaW5jbHVkZXMgdGhpcyBwcmVmaXggaW4gdGhlIHN0cmluZywgYW5kIHRodXMgd2UgbmVlZCB0byBleGNsdWRlXG4gIC8vIGl0IHdoZW4gdG9nZ2xpbmcgcXVvdGVzXG4gIGxldCBwcmVmaXggPSAnJ1xuICBpZiAoL1t1VXJdLy50ZXN0KHF1b3RlQ2hhcmFjdGVyKSkge1xuICAgIFtwcmVmaXgsIHF1b3RlQ2hhcmFjdGVyXSA9IHRleHRcbiAgfVxuXG4gIGxldCBuZXh0UXVvdGVDaGFyYWN0ZXIgPSBnZXROZXh0UXVvdGVDaGFyYWN0ZXIocXVvdGVDaGFyYWN0ZXIsIHF1b3RlQ2hhcnMpXG5cbiAgaWYgKCFuZXh0UXVvdGVDaGFyYWN0ZXIpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIGxldCBxdW90ZVJlZ2V4ID0gbmV3IFJlZ0V4cChxdW90ZUNoYXJhY3RlciwgJ2cnKVxuICBsZXQgZXNjYXBlZFF1b3RlUmVnZXggPSBuZXcgUmVnRXhwKGBcXFxcXFxcXCR7cXVvdGVDaGFyYWN0ZXJ9YCwgJ2cnKVxuICBsZXQgbmV4dFF1b3RlUmVnZXggPSBuZXcgUmVnRXhwKG5leHRRdW90ZUNoYXJhY3RlciwgJ2cnKVxuXG4gIGxldCBuZXdUZXh0ID0gdGV4dFxuICAgIC5yZXBsYWNlKG5leHRRdW90ZVJlZ2V4LCBgXFxcXCR7bmV4dFF1b3RlQ2hhcmFjdGVyfWApXG4gICAgLnJlcGxhY2UoZXNjYXBlZFF1b3RlUmVnZXgsIHF1b3RlQ2hhcmFjdGVyKVxuXG4gIG5ld1RleHQgPSBwcmVmaXggKyBuZXh0UXVvdGVDaGFyYWN0ZXIgKyBuZXdUZXh0LnNsaWNlKDEgKyBwcmVmaXgubGVuZ3RoLCAtMSkgKyBuZXh0UXVvdGVDaGFyYWN0ZXJcblxuICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UsIG5ld1RleHQpXG59XG4iXX0=