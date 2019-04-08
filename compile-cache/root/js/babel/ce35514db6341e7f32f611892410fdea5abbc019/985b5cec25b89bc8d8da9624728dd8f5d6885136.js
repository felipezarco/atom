Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = BlameLine;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _localesStrings = require('../locales/strings');

var _localesStrings2 = _interopRequireDefault(_localesStrings);

'use babel';

var HASH_LENGTH = 7;
var colours = {};

function word(str, index) {
  var words = str.split(' ');
  return words[index < 0 ? words.length + index : index];
}

function stringToColour(str) {
  if (colours[str]) {
    return colours[str];
  }

  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    // eslint-disable-line no-plusplus
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    // eslint-disable-line no-plusplus
    var value = hash >> i * 8 & 0xFF; // eslint-disable-line no-bitwise
    colour += ('00' + value.toString(16)).substr(-2);
  }
  colours[str] = colour;
  return colour;
}

function copyText(str) {
  atom.clipboard.write(str);
  var messageString = _localesStrings2['default'].copiedToClipboard;
  var notif = atom.notifications.addSuccess(messageString, {
    dismissable: true
  });
  var timeout = setTimeout(function () {
    notif.dismiss();
  }, 3000);
  notif.onDidDismiss(function () {
    if (timeout) {
      clearTimeout(timeout);
    }
  });
}

function BlameLine(props) {
  var className = props.className;
  var hash = props.hash;
  var date = props.date;
  var author = props.author;
  var showFirstNames = props.showFirstNames;
  var showLastNames = props.showLastNames;
  var showHash = props.showHash;
  var viewCommitUrl = props.viewCommitUrl;
  var colorCommitAuthors = props.colorCommitAuthors;
  var copyHashOnClick = props.copyHashOnClick;

  var onClick = copyHashOnClick ? function () {
    return copyText(hash);
  } : null;
  var displayName = '';
  if (showFirstNames && showLastNames) {
    displayName = author;
  } else if (showFirstNames) {
    displayName = word(author, 0);
  } else {
    displayName = word(author, -1);
  }

  return _react2['default'].createElement(
    'div',
    { className: 'blame-line ' + className, style: { borderRight: colorCommitAuthors ? '2px solid ' + stringToColour(author) : 'none' } },
    _react2['default'].createElement(
      'a',
      { href: viewCommitUrl, onClick: onClick },
      showHash ? _react2['default'].createElement(
        'span',
        { className: 'hash' },
        hash.substring(0, HASH_LENGTH)
      ) : null,
      _react2['default'].createElement(
        'span',
        { className: 'date' },
        date
      ),
      _react2['default'].createElement(
        'span',
        { className: 'committer text-highlight' },
        displayName
      )
    )
  );
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbXBvbmVudHMvQmxhbWVMaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztxQkE2Q3dCLFNBQVM7Ozs7cUJBM0NmLE9BQU87Ozs7OEJBQ0wsb0JBQW9COzs7O0FBSHhDLFdBQVcsQ0FBQzs7QUFLWixJQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDdEIsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVuQixTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ3hCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsU0FBTyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztDQUN4RDs7QUFFRCxTQUFTLGNBQWMsQ0FBQyxHQUFHLEVBQUU7QUFDM0IsTUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDaEIsV0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDckI7O0FBRUQsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBQ25DLFFBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQSxBQUFDLENBQUM7R0FDakQ7QUFDRCxNQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDakIsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFDMUIsUUFBSSxLQUFLLEdBQUcsQUFBQyxJQUFJLElBQUssQ0FBQyxHQUFHLENBQUMsQUFBQyxHQUFJLElBQUksQ0FBQztBQUNyQyxVQUFNLElBQUksUUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ2xEO0FBQ0QsU0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUN0QixTQUFPLE1BQU0sQ0FBQztDQUNmOztBQUVELFNBQVMsUUFBUSxDQUFDLEdBQUcsRUFBRTtBQUNyQixNQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixNQUFNLGFBQWEsR0FBRyw0QkFBUSxpQkFBaUIsQ0FBQztBQUNoRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUU7QUFDekQsZUFBVyxFQUFFLElBQUk7R0FDbEIsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFlBQU07QUFBRSxTQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7R0FBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdELE9BQUssQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUN2QixRQUFJLE9BQU8sRUFBRTtBQUNYLGtCQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDdkI7R0FDRixDQUFDLENBQUM7Q0FDSjs7QUFFYyxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUU7TUFFckMsU0FBUyxHQVVQLEtBQUssQ0FWUCxTQUFTO01BQ1QsSUFBSSxHQVNGLEtBQUssQ0FUUCxJQUFJO01BQ0osSUFBSSxHQVFGLEtBQUssQ0FSUCxJQUFJO01BQ0osTUFBTSxHQU9KLEtBQUssQ0FQUCxNQUFNO01BQ04sY0FBYyxHQU1aLEtBQUssQ0FOUCxjQUFjO01BQ2QsYUFBYSxHQUtYLEtBQUssQ0FMUCxhQUFhO01BQ2IsUUFBUSxHQUlOLEtBQUssQ0FKUCxRQUFRO01BQ1IsYUFBYSxHQUdYLEtBQUssQ0FIUCxhQUFhO01BQ2Isa0JBQWtCLEdBRWhCLEtBQUssQ0FGUCxrQkFBa0I7TUFDbEIsZUFBZSxHQUNiLEtBQUssQ0FEUCxlQUFlOztBQUVqQixNQUFNLE9BQU8sR0FBRyxlQUFlLEdBQzdCLFlBQU07QUFBRSxXQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUFFLEdBQ2hDLElBQUksQ0FBQztBQUNQLE1BQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUNyQixNQUFJLGNBQWMsSUFBSSxhQUFhLEVBQUU7QUFDbkMsZUFBVyxHQUFHLE1BQU0sQ0FBQztHQUN0QixNQUFNLElBQUksY0FBYyxFQUFFO0FBQ3pCLGVBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQy9CLE1BQU07QUFDTCxlQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ2hDOztBQUVELFNBQ0U7O01BQUssU0FBUyxrQkFBZ0IsU0FBUyxBQUFHLEVBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixrQkFBZ0IsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFLLE1BQU0sRUFBRSxBQUFDO0lBQ3JJOztRQUFHLElBQUksRUFBRSxhQUFhLEFBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDO01BQ3RDLFFBQVEsR0FBRzs7VUFBTSxTQUFTLEVBQUMsTUFBTTtRQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQztPQUFRLEdBQUcsSUFBSTtNQUNqRjs7VUFBTSxTQUFTLEVBQUMsTUFBTTtRQUFFLElBQUk7T0FBUTtNQUNwQzs7VUFBTSxTQUFTLEVBQUMsMEJBQTBCO1FBQUUsV0FBVztPQUFRO0tBQzdEO0dBQ0EsQ0FDTjtDQUNIIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbXBvbmVudHMvQmxhbWVMaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3RyaW5ncyBmcm9tICcuLi9sb2NhbGVzL3N0cmluZ3MnO1xuXG5jb25zdCBIQVNIX0xFTkdUSCA9IDc7XG5jb25zdCBjb2xvdXJzID0ge307XG5cbmZ1bmN0aW9uIHdvcmQoc3RyLCBpbmRleCkge1xuICBjb25zdCB3b3JkcyA9IHN0ci5zcGxpdCgnICcpO1xuICByZXR1cm4gd29yZHNbaW5kZXggPCAwID8gd29yZHMubGVuZ3RoICsgaW5kZXggOiBpbmRleF07XG59XG5cbmZ1bmN0aW9uIHN0cmluZ1RvQ29sb3VyKHN0cikge1xuICBpZiAoY29sb3Vyc1tzdHJdKSB7XG4gICAgcmV0dXJuIGNvbG91cnNbc3RyXTtcbiAgfVxuXG4gIGxldCBoYXNoID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHsgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGx1c3BsdXNcbiAgICBoYXNoID0gc3RyLmNoYXJDb2RlQXQoaSkgKyAoKGhhc2ggPDwgNSkgLSBoYXNoKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxuICB9XG4gIGxldCBjb2xvdXIgPSAnIyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7ICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBsdXNwbHVzXG4gICAgdmFyIHZhbHVlID0gKGhhc2ggPj4gKGkgKiA4KSkgJiAweEZGOyAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWJpdHdpc2VcbiAgICBjb2xvdXIgKz0gKGAwMCR7dmFsdWUudG9TdHJpbmcoMTYpfWApLnN1YnN0cigtMik7XG4gIH1cbiAgY29sb3Vyc1tzdHJdID0gY29sb3VyO1xuICByZXR1cm4gY29sb3VyO1xufVxuXG5mdW5jdGlvbiBjb3B5VGV4dChzdHIpIHtcbiAgYXRvbS5jbGlwYm9hcmQud3JpdGUoc3RyKTtcbiAgY29uc3QgbWVzc2FnZVN0cmluZyA9IHN0cmluZ3MuY29waWVkVG9DbGlwYm9hcmQ7XG4gIGNvbnN0IG5vdGlmID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MobWVzc2FnZVN0cmluZywge1xuICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICB9KTtcbiAgY29uc3QgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4geyBub3RpZi5kaXNtaXNzKCk7IH0sIDMwMDApO1xuICBub3RpZi5vbkRpZERpc21pc3MoKCkgPT4ge1xuICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmxhbWVMaW5lKHByb3BzKSB7XG4gIGNvbnN0IHtcbiAgICBjbGFzc05hbWUsXG4gICAgaGFzaCxcbiAgICBkYXRlLFxuICAgIGF1dGhvcixcbiAgICBzaG93Rmlyc3ROYW1lcyxcbiAgICBzaG93TGFzdE5hbWVzLFxuICAgIHNob3dIYXNoLFxuICAgIHZpZXdDb21taXRVcmwsXG4gICAgY29sb3JDb21taXRBdXRob3JzLFxuICAgIGNvcHlIYXNoT25DbGljayxcbiAgfSA9IHByb3BzO1xuICBjb25zdCBvbkNsaWNrID0gY29weUhhc2hPbkNsaWNrID9cbiAgICAoKSA9PiB7IHJldHVybiBjb3B5VGV4dChoYXNoKTsgfSA6XG4gICAgbnVsbDtcbiAgbGV0IGRpc3BsYXlOYW1lID0gJyc7XG4gIGlmIChzaG93Rmlyc3ROYW1lcyAmJiBzaG93TGFzdE5hbWVzKSB7XG4gICAgZGlzcGxheU5hbWUgPSBhdXRob3I7XG4gIH0gZWxzZSBpZiAoc2hvd0ZpcnN0TmFtZXMpIHtcbiAgICBkaXNwbGF5TmFtZSA9IHdvcmQoYXV0aG9yLCAwKTtcbiAgfSBlbHNlIHtcbiAgICBkaXNwbGF5TmFtZSA9IHdvcmQoYXV0aG9yLCAtMSk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtgYmxhbWUtbGluZSAke2NsYXNzTmFtZX1gfSBzdHlsZT17eyBib3JkZXJSaWdodDogY29sb3JDb21taXRBdXRob3JzID8gYDJweCBzb2xpZCAke3N0cmluZ1RvQ29sb3VyKGF1dGhvcil9YCA6ICdub25lJyB9fT5cbiAgICAgIDxhIGhyZWY9e3ZpZXdDb21taXRVcmx9IG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAgICB7c2hvd0hhc2ggPyA8c3BhbiBjbGFzc05hbWU9XCJoYXNoXCI+e2hhc2guc3Vic3RyaW5nKDAsIEhBU0hfTEVOR1RIKX08L3NwYW4+IDogbnVsbH1cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZGF0ZVwiPntkYXRlfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY29tbWl0dGVyIHRleHQtaGlnaGxpZ2h0XCI+e2Rpc3BsYXlOYW1lfTwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdfQ==