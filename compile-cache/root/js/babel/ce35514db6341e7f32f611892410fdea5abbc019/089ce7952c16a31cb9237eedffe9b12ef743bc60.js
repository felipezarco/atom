Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.showError = showError;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _localesStrings = require('../locales/strings');

var _localesStrings2 = _interopRequireDefault(_localesStrings);

/**
 * Shows an error to the user with the given message.
 *
 * @param {String} errorMessage - Error message to show the user
 */
'use babel';

function showError(errorMessageKey) {
  var messageString = _localesStrings2['default'][errorMessageKey];
  if (messageString) {
    atom.notifications.addError(messageString, { dismissable: true });
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbnRyb2xsZXJzL2Vycm9yQ29udHJvbGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OzhCQUVvQixvQkFBb0I7Ozs7Ozs7OztBQUZ4QyxXQUFXLENBQUM7O0FBU0wsU0FBUyxTQUFTLENBQUMsZUFBZSxFQUFFO0FBQ3pDLE1BQU0sYUFBYSxHQUFHLDRCQUFRLGVBQWUsQ0FBQyxDQUFDO0FBQy9DLE1BQUksYUFBYSxFQUFFO0FBQ2pCLFFBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0dBQ2pFO0NBQ0YiLCJmaWxlIjoiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvY29udHJvbGxlcnMvZXJyb3JDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBzdHJpbmdzIGZyb20gJy4uL2xvY2FsZXMvc3RyaW5ncyc7XG5cbi8qKlxuICogU2hvd3MgYW4gZXJyb3IgdG8gdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gbWVzc2FnZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXJyb3JNZXNzYWdlIC0gRXJyb3IgbWVzc2FnZSB0byBzaG93IHRoZSB1c2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG93RXJyb3IoZXJyb3JNZXNzYWdlS2V5KSB7XG4gIGNvbnN0IG1lc3NhZ2VTdHJpbmcgPSBzdHJpbmdzW2Vycm9yTWVzc2FnZUtleV07XG4gIGlmIChtZXNzYWdlU3RyaW5nKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKG1lc3NhZ2VTdHJpbmcsIHtkaXNtaXNzYWJsZTogdHJ1ZX0pO1xuICB9XG59XG4iXX0=