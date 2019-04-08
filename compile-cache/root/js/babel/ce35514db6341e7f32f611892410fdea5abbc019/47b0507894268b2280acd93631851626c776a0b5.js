Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.parseBlame = parseBlame;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

/**
 * Parses the git commit revision from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the git revision hash string.
 */
'use babel';

function parseRevision(line) {
  var revisionRegex = /^\w+/;
  return line.match(revisionRegex)[0];
}

/**
 * Parses the author name from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the author name for that line of code.
 */
function parseAuthor(line) {
  var committerMatcher = /^author\s(.*)$/m;
  return line.match(committerMatcher)[1];
}

/**
 * Parses the committer name from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the committer name for that line of code.
 */
function parseCommitter(line) {
  var committerMatcher = /^committer\s(.*)$/m;
  return line.match(committerMatcher)[1];
}

/**
 * Formats a date according to the user's preferred format string.
 * @param {object} date - a moment date object
 */
function formatDate(date) {
  var formatString = atom.config.get('git-blame.dateFormatString');
  return date.format(formatString);
}

/**
 * Parses the author date from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - human readable date string of the lines author date
 */
function parseAuthorDate(line) {
  var dateMatcher = /^author-time\s(.*)$/m;
  var dateStamp = line.match(dateMatcher)[1];
  return formatDate(_moment2['default'].unix(dateStamp));
}

/**
 * Parses the commit date from blame data for a line of code.
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - human readable date string of the lines commit date
 */
function parseCommitterDate(line) {
  var dateMatcher = /^committer-time\s(.*)$/m;
  var dateStamp = line.match(dateMatcher)[1];
  return formatDate(_moment2['default'].unix(dateStamp));
}

/**
 * Parses the summary line from the blame data for a line of code
 *
 * @param {string} line - the blame data for a particular line of code
 * @return {string} - the summary line for the last commit for a line of code
 */
function parseSummary(line) {
  var summaryMatcher = /^summary\s(.*)$/m;
  return line.match(summaryMatcher)[1];
}

/**
 * Parses the blame --porcelain output for a particular line of code into a
 * usable object with properties:
 *
 * commit: the commit revision
 * line: the line number (1 indexed)
 * committer: name of the committer of that line
 * date: the date of the commit
 * summary: the summary of the commit
 *
 * @param {string} blameData - the blame --porcelain output for a line of code
 * @param {number} index - the index that the data appeared in an array of line
 *    line data (0 indexed)
 * @return {object} - an object with properties described above
 */
function parseBlameLine(blameData, index) {
  return markIfNoCommit({
    hash: parseRevision(blameData),
    lineNumber: index + 1,
    author: parseAuthor(blameData),
    date: parseAuthorDate(blameData),
    committer: parseCommitter(blameData),
    committerDate: parseCommitterDate(blameData),
    summary: parseSummary(blameData)
  });
}

/**
 * Returns blameData object marked with property noCommit: true if this line
 * has not yet been committed.
 *
 * @param {object} parsedBlame - parsed blame info for a line
 */
function markIfNoCommit(parsedBlame) {
  var noCommit = /^0*$/.test(parsedBlame.hash);
  return _extends({}, parsedBlame, {
    noCommit: noCommit
  });
}

/**
 * Parses git-blame output into usable array of info objects.
 *
 * @param {string} blameOutput - output from 'git blame --porcelain <file>'
 */

function parseBlame(blameOut) {
  // Matches new lines only when followed by a line with commit hash info that
  // are followed by autor line. This is the 1st and 2nd line of the blame
  // --porcelain output.
  var singleLineDataSplitRegex = /\n(?=\w+\s(?:\d+\s)+\d+\nauthor)/g;

  // Split the blame output into data for each line and parse out desired
  // data from each into an object.
  return blameOut.split(singleLineDataSplitRegex).map(parseBlameLine);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvYmxhbWVGb3JtYXR0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFbUIsUUFBUTs7Ozs7Ozs7OztBQUYzQixXQUFXLENBQUM7O0FBVVosU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFO0FBQzNCLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUM3QixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDckM7Ozs7Ozs7O0FBUUQsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQ3pCLE1BQU0sZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUM7QUFDM0MsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDeEM7Ozs7Ozs7O0FBUUQsU0FBUyxjQUFjLENBQUMsSUFBSSxFQUFFO0FBQzVCLE1BQU0sZ0JBQWdCLEdBQUcsb0JBQW9CLENBQUM7QUFDOUMsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDeEM7Ozs7OztBQU1ELFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUN4QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ25FLFNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztDQUNsQzs7Ozs7Ozs7QUFRRCxTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQUU7QUFDN0IsTUFBTSxXQUFXLEdBQUcsc0JBQXNCLENBQUM7QUFDM0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxTQUFPLFVBQVUsQ0FBQyxvQkFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztDQUMzQzs7Ozs7Ozs7QUFRRCxTQUFTLGtCQUFrQixDQUFDLElBQUksRUFBRTtBQUNoQyxNQUFNLFdBQVcsR0FBRyx5QkFBeUIsQ0FBQztBQUM5QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLFNBQU8sVUFBVSxDQUFDLG9CQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0NBQzNDOzs7Ozs7OztBQVFELFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRTtBQUMxQixNQUFNLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQztBQUMxQyxTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDdEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJELFNBQVMsY0FBYyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUU7QUFDeEMsU0FBTyxjQUFjLENBQUM7QUFDcEIsUUFBSSxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUM7QUFDOUIsY0FBVSxFQUFFLEtBQUssR0FBRyxDQUFDO0FBQ3JCLFVBQU0sRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDO0FBQzlCLFFBQUksRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDO0FBQ2hDLGFBQVMsRUFBRSxjQUFjLENBQUMsU0FBUyxDQUFDO0FBQ3BDLGlCQUFhLEVBQUUsa0JBQWtCLENBQUMsU0FBUyxDQUFDO0FBQzVDLFdBQU8sRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDO0dBQ2pDLENBQUMsQ0FBQztDQUNKOzs7Ozs7OztBQVFELFNBQVMsY0FBYyxDQUFDLFdBQVcsRUFBRTtBQUNuQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxzQkFDSyxXQUFXO0FBQ2QsWUFBUSxFQUFSLFFBQVE7S0FDUjtDQUNIOzs7Ozs7OztBQU9NLFNBQVMsVUFBVSxDQUFDLFFBQVEsRUFBRTs7OztBQUluQyxNQUFNLHdCQUF3QixHQUFHLG1DQUFtQyxDQUFDOzs7O0FBSXJFLFNBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztDQUNyRSIsImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi91dGlsL2JsYW1lRm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuLyoqXG4gKiBQYXJzZXMgdGhlIGdpdCBjb21taXQgcmV2aXNpb24gZnJvbSBibGFtZSBkYXRhIGZvciBhIGxpbmUgb2YgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGluZSAtIHRoZSBibGFtZSBkYXRhIGZvciBhIHBhcnRpY3VsYXIgbGluZSBvZiBjb2RlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IC0gdGhlIGdpdCByZXZpc2lvbiBoYXNoIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gcGFyc2VSZXZpc2lvbihsaW5lKSB7XG4gIGNvbnN0IHJldmlzaW9uUmVnZXggPSAvXlxcdysvO1xuICByZXR1cm4gbGluZS5tYXRjaChyZXZpc2lvblJlZ2V4KVswXTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIGF1dGhvciBuYW1lIGZyb20gYmxhbWUgZGF0YSBmb3IgYSBsaW5lIG9mIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxpbmUgLSB0aGUgYmxhbWUgZGF0YSBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZVxuICogQHJldHVybiB7c3RyaW5nfSAtIHRoZSBhdXRob3IgbmFtZSBmb3IgdGhhdCBsaW5lIG9mIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlQXV0aG9yKGxpbmUpIHtcbiAgY29uc3QgY29tbWl0dGVyTWF0Y2hlciA9IC9eYXV0aG9yXFxzKC4qKSQvbTtcbiAgcmV0dXJuIGxpbmUubWF0Y2goY29tbWl0dGVyTWF0Y2hlcilbMV07XG59XG5cbi8qKlxuICogUGFyc2VzIHRoZSBjb21taXR0ZXIgbmFtZSBmcm9tIGJsYW1lIGRhdGEgZm9yIGEgbGluZSBvZiBjb2RlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaW5lIC0gdGhlIGJsYW1lIGRhdGEgZm9yIGEgcGFydGljdWxhciBsaW5lIG9mIGNvZGVcbiAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgY29tbWl0dGVyIG5hbWUgZm9yIHRoYXQgbGluZSBvZiBjb2RlLlxuICovXG5mdW5jdGlvbiBwYXJzZUNvbW1pdHRlcihsaW5lKSB7XG4gIGNvbnN0IGNvbW1pdHRlck1hdGNoZXIgPSAvXmNvbW1pdHRlclxccyguKikkL207XG4gIHJldHVybiBsaW5lLm1hdGNoKGNvbW1pdHRlck1hdGNoZXIpWzFdO1xufVxuXG4vKipcbiAqIEZvcm1hdHMgYSBkYXRlIGFjY29yZGluZyB0byB0aGUgdXNlcidzIHByZWZlcnJlZCBmb3JtYXQgc3RyaW5nLlxuICogQHBhcmFtIHtvYmplY3R9IGRhdGUgLSBhIG1vbWVudCBkYXRlIG9iamVjdFxuICovXG5mdW5jdGlvbiBmb3JtYXREYXRlKGRhdGUpIHtcbiAgY29uc3QgZm9ybWF0U3RyaW5nID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUuZGF0ZUZvcm1hdFN0cmluZycpO1xuICByZXR1cm4gZGF0ZS5mb3JtYXQoZm9ybWF0U3RyaW5nKTtcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIGF1dGhvciBkYXRlIGZyb20gYmxhbWUgZGF0YSBmb3IgYSBsaW5lIG9mIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxpbmUgLSB0aGUgYmxhbWUgZGF0YSBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZVxuICogQHJldHVybiB7c3RyaW5nfSAtIGh1bWFuIHJlYWRhYmxlIGRhdGUgc3RyaW5nIG9mIHRoZSBsaW5lcyBhdXRob3IgZGF0ZVxuICovXG5mdW5jdGlvbiBwYXJzZUF1dGhvckRhdGUobGluZSkge1xuICBjb25zdCBkYXRlTWF0Y2hlciA9IC9eYXV0aG9yLXRpbWVcXHMoLiopJC9tO1xuICBjb25zdCBkYXRlU3RhbXAgPSBsaW5lLm1hdGNoKGRhdGVNYXRjaGVyKVsxXTtcbiAgcmV0dXJuIGZvcm1hdERhdGUobW9tZW50LnVuaXgoZGF0ZVN0YW1wKSk7XG59XG5cbi8qKlxuICogUGFyc2VzIHRoZSBjb21taXQgZGF0ZSBmcm9tIGJsYW1lIGRhdGEgZm9yIGEgbGluZSBvZiBjb2RlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsaW5lIC0gdGhlIGJsYW1lIGRhdGEgZm9yIGEgcGFydGljdWxhciBsaW5lIG9mIGNvZGVcbiAqIEByZXR1cm4ge3N0cmluZ30gLSBodW1hbiByZWFkYWJsZSBkYXRlIHN0cmluZyBvZiB0aGUgbGluZXMgY29tbWl0IGRhdGVcbiAqL1xuZnVuY3Rpb24gcGFyc2VDb21taXR0ZXJEYXRlKGxpbmUpIHtcbiAgY29uc3QgZGF0ZU1hdGNoZXIgPSAvXmNvbW1pdHRlci10aW1lXFxzKC4qKSQvbTtcbiAgY29uc3QgZGF0ZVN0YW1wID0gbGluZS5tYXRjaChkYXRlTWF0Y2hlcilbMV07XG4gIHJldHVybiBmb3JtYXREYXRlKG1vbWVudC51bml4KGRhdGVTdGFtcCkpO1xufVxuXG4vKipcbiAqIFBhcnNlcyB0aGUgc3VtbWFyeSBsaW5lIGZyb20gdGhlIGJsYW1lIGRhdGEgZm9yIGEgbGluZSBvZiBjb2RlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxpbmUgLSB0aGUgYmxhbWUgZGF0YSBmb3IgYSBwYXJ0aWN1bGFyIGxpbmUgb2YgY29kZVxuICogQHJldHVybiB7c3RyaW5nfSAtIHRoZSBzdW1tYXJ5IGxpbmUgZm9yIHRoZSBsYXN0IGNvbW1pdCBmb3IgYSBsaW5lIG9mIGNvZGVcbiAqL1xuZnVuY3Rpb24gcGFyc2VTdW1tYXJ5KGxpbmUpIHtcbiAgY29uc3Qgc3VtbWFyeU1hdGNoZXIgPSAvXnN1bW1hcnlcXHMoLiopJC9tO1xuICByZXR1cm4gbGluZS5tYXRjaChzdW1tYXJ5TWF0Y2hlcilbMV07XG59XG5cbi8qKlxuICogUGFyc2VzIHRoZSBibGFtZSAtLXBvcmNlbGFpbiBvdXRwdXQgZm9yIGEgcGFydGljdWxhciBsaW5lIG9mIGNvZGUgaW50byBhXG4gKiB1c2FibGUgb2JqZWN0IHdpdGggcHJvcGVydGllczpcbiAqXG4gKiBjb21taXQ6IHRoZSBjb21taXQgcmV2aXNpb25cbiAqIGxpbmU6IHRoZSBsaW5lIG51bWJlciAoMSBpbmRleGVkKVxuICogY29tbWl0dGVyOiBuYW1lIG9mIHRoZSBjb21taXR0ZXIgb2YgdGhhdCBsaW5lXG4gKiBkYXRlOiB0aGUgZGF0ZSBvZiB0aGUgY29tbWl0XG4gKiBzdW1tYXJ5OiB0aGUgc3VtbWFyeSBvZiB0aGUgY29tbWl0XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJsYW1lRGF0YSAtIHRoZSBibGFtZSAtLXBvcmNlbGFpbiBvdXRwdXQgZm9yIGEgbGluZSBvZiBjb2RlXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSB0aGUgaW5kZXggdGhhdCB0aGUgZGF0YSBhcHBlYXJlZCBpbiBhbiBhcnJheSBvZiBsaW5lXG4gKiAgICBsaW5lIGRhdGEgKDAgaW5kZXhlZClcbiAqIEByZXR1cm4ge29iamVjdH0gLSBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGRlc2NyaWJlZCBhYm92ZVxuICovXG5mdW5jdGlvbiBwYXJzZUJsYW1lTGluZShibGFtZURhdGEsIGluZGV4KSB7XG4gIHJldHVybiBtYXJrSWZOb0NvbW1pdCh7XG4gICAgaGFzaDogcGFyc2VSZXZpc2lvbihibGFtZURhdGEpLFxuICAgIGxpbmVOdW1iZXI6IGluZGV4ICsgMSxcbiAgICBhdXRob3I6IHBhcnNlQXV0aG9yKGJsYW1lRGF0YSksXG4gICAgZGF0ZTogcGFyc2VBdXRob3JEYXRlKGJsYW1lRGF0YSksXG4gICAgY29tbWl0dGVyOiBwYXJzZUNvbW1pdHRlcihibGFtZURhdGEpLFxuICAgIGNvbW1pdHRlckRhdGU6IHBhcnNlQ29tbWl0dGVyRGF0ZShibGFtZURhdGEpLFxuICAgIHN1bW1hcnk6IHBhcnNlU3VtbWFyeShibGFtZURhdGEpLFxuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGJsYW1lRGF0YSBvYmplY3QgbWFya2VkIHdpdGggcHJvcGVydHkgbm9Db21taXQ6IHRydWUgaWYgdGhpcyBsaW5lXG4gKiBoYXMgbm90IHlldCBiZWVuIGNvbW1pdHRlZC5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gcGFyc2VkQmxhbWUgLSBwYXJzZWQgYmxhbWUgaW5mbyBmb3IgYSBsaW5lXG4gKi9cbmZ1bmN0aW9uIG1hcmtJZk5vQ29tbWl0KHBhcnNlZEJsYW1lKSB7XG4gIGNvbnN0IG5vQ29tbWl0ID0gL14wKiQvLnRlc3QocGFyc2VkQmxhbWUuaGFzaCk7XG4gIHJldHVybiB7XG4gICAgLi4ucGFyc2VkQmxhbWUsXG4gICAgbm9Db21taXQsXG4gIH07XG59XG5cbi8qKlxuICogUGFyc2VzIGdpdC1ibGFtZSBvdXRwdXQgaW50byB1c2FibGUgYXJyYXkgb2YgaW5mbyBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBibGFtZU91dHB1dCAtIG91dHB1dCBmcm9tICdnaXQgYmxhbWUgLS1wb3JjZWxhaW4gPGZpbGU+J1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VCbGFtZShibGFtZU91dCkge1xuICAvLyBNYXRjaGVzIG5ldyBsaW5lcyBvbmx5IHdoZW4gZm9sbG93ZWQgYnkgYSBsaW5lIHdpdGggY29tbWl0IGhhc2ggaW5mbyB0aGF0XG4gIC8vIGFyZSBmb2xsb3dlZCBieSBhdXRvciBsaW5lLiBUaGlzIGlzIHRoZSAxc3QgYW5kIDJuZCBsaW5lIG9mIHRoZSBibGFtZVxuICAvLyAtLXBvcmNlbGFpbiBvdXRwdXQuXG4gIGNvbnN0IHNpbmdsZUxpbmVEYXRhU3BsaXRSZWdleCA9IC9cXG4oPz1cXHcrXFxzKD86XFxkK1xccykrXFxkK1xcbmF1dGhvcikvZztcblxuICAvLyBTcGxpdCB0aGUgYmxhbWUgb3V0cHV0IGludG8gZGF0YSBmb3IgZWFjaCBsaW5lIGFuZCBwYXJzZSBvdXQgZGVzaXJlZFxuICAvLyBkYXRhIGZyb20gZWFjaCBpbnRvIGFuIG9iamVjdC5cbiAgcmV0dXJuIGJsYW1lT3V0LnNwbGl0KHNpbmdsZUxpbmVEYXRhU3BsaXRSZWdleCkubWFwKHBhcnNlQmxhbWVMaW5lKTtcbn1cbiJdfQ==