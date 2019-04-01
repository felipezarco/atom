Object.defineProperty(exports, '__esModule', {
  value: true
});

var activate = _asyncToGenerator(function* () {
  // Install linter-js-standard dependencies
  yield require('atom-package-deps').install('linter-js-standard');

  this.subscriptions = new _atom.CompositeDisposable();

  this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
    var config = atom.config.get('linter-js-standard');

    var grammar = textEditor.getGrammar() || { scopeName: null };

    // Check if this file is inside any kind of html scope (such as text.html.basic among others)
    if (config.lintHtmlFiles && /^text.html/.test(grammar.scopeName)) {
      scope.push(grammar.scopeName);
    }
  }));

  (0, _utilsDeprecateConfig2['default'])();
});

exports.activate = activate;
exports.deactivate = deactivate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

// Dependencies

var _atom = require('atom');

var _utilsDeprecateConfig = require('./utils/deprecate-config');

var _utilsDeprecateConfig2 = _interopRequireDefault(_utilsDeprecateConfig);

var scope = ['javascript', 'source.js', 'source.js.jsx', 'source.js.jquery', 'source.ts', 'source.gfm', 'source.vue'];

var config = {
  style: {
    type: 'string',
    title: 'Default style',
    description: 'Default global style when none is installed locally.',
    'default': 'standard',
    'enum': [{ value: 'standard', description: 'JavaScript Standard Style (standard)' }, { value: 'semistandard', description: 'JavaScript Semi-Standard Style (semistandard)' }, { value: 'happiness', description: 'JavaScript Happiness Style (happiness)' }],
    order: 1
  },
  checkStyleDevDependencies: {
    type: 'boolean',
    title: 'Only lint if installed locally',
    description: 'Only lint if `standard` (or one of the other styles) is installed as a dependency.',
    'default': false,
    order: 2
  },
  showEslintRules: {
    type: 'boolean',
    title: 'Show ESLint rule ID',
    description: 'Show ESLint’s rule ID in the message description.',
    'default': false,
    order: 3
  },
  checkForEslintConfig: {
    type: 'boolean',
    title: 'Skip if ESLint is installed locally',
    description: 'Skip linting if ESLint is installed locally.',
    'default': true,
    order: 4
  },
  lintHtmlFiles: {
    type: 'boolean',
    title: 'Lint HTML documents',
    description: 'Lint JavaScript code within `<script>` tags in HTML documents.',
    'default': false,
    order: 5
  },
  lintMarkdownFiles: {
    type: 'boolean',
    title: 'Lint Markdown documents',
    description: 'Lint JavaScript code blocks within Markdown documents.',
    'default': false,
    order: 6
  }
};

exports.config = config;

function deactivate() {
  this.subscriptions.dispose();
}

var provideLinter = function provideLinter() {
  return {
    name: 'js-standard',
    grammarScopes: scope,
    scope: 'file',
    lintsOnChange: true,
    lint: require('./linter-js-standard')
  };
};
exports.provideLinter = provideLinter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9saW50ZXItanMtc3RhbmRhcmQvbGliL2luaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQTBEc0IsUUFBUSxxQkFBdkIsYUFBMkI7O0FBRWhDLFFBQU0sT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUE7O0FBRWhFLE1BQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLE1BQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBQSxVQUFVLEVBQUk7QUFDckUsUUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTs7QUFFcEQsUUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFBOzs7QUFHOUQsUUFBSSxNQUFNLENBQUMsYUFBYSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ2hFLFdBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQzlCO0dBQ0YsQ0FBQyxDQUFDLENBQUE7O0FBRUgsMENBQWlCLENBQUE7Q0FDbEI7Ozs7Ozs7Ozs7Ozs7b0JBekVtQyxNQUFNOztvQ0FDZCwwQkFBMEI7Ozs7QUFFdEQsSUFBTSxLQUFLLEdBQUcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFBOztBQUVoSCxJQUFNLE1BQU0sR0FBRztBQUNwQixPQUFLLEVBQUU7QUFDTCxRQUFJLEVBQUUsUUFBUTtBQUNkLFNBQUssRUFBRSxlQUFlO0FBQ3RCLGVBQVcsRUFBRSxzREFBc0Q7QUFDbkUsZUFBUyxVQUFVO0FBQ25CLFlBQU0sQ0FDSixFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLHNDQUFzQyxFQUFFLEVBQzFFLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsK0NBQStDLEVBQUUsRUFDdkYsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSx3Q0FBd0MsRUFBRSxDQUM5RTtBQUNELFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCwyQkFBeUIsRUFBRTtBQUN6QixRQUFJLEVBQUUsU0FBUztBQUNmLFNBQUssRUFBRSxnQ0FBZ0M7QUFDdkMsZUFBVyxFQUFFLG9GQUFvRjtBQUNqRyxlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsaUJBQWUsRUFBRTtBQUNmLFFBQUksRUFBRSxTQUFTO0FBQ2YsU0FBSyxFQUFFLHFCQUFxQjtBQUM1QixlQUFXLEVBQUUsbURBQW1EO0FBQ2hFLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxzQkFBb0IsRUFBRTtBQUNwQixRQUFJLEVBQUUsU0FBUztBQUNmLFNBQUssRUFBRSxxQ0FBcUM7QUFDNUMsZUFBVyxFQUFFLDhDQUE4QztBQUMzRCxlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsZUFBYSxFQUFFO0FBQ2IsUUFBSSxFQUFFLFNBQVM7QUFDZixTQUFLLEVBQUUscUJBQXFCO0FBQzVCLGVBQVcsRUFBRSxnRUFBZ0U7QUFDN0UsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELG1CQUFpQixFQUFFO0FBQ2pCLFFBQUksRUFBRSxTQUFTO0FBQ2YsU0FBSyxFQUFFLHlCQUF5QjtBQUNoQyxlQUFXLEVBQUUsd0RBQXdEO0FBQ3JFLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7Q0FDRixDQUFBOzs7O0FBc0JNLFNBQVMsVUFBVSxHQUFJO0FBQzVCLE1BQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7Q0FDN0I7O0FBRU0sSUFBTSxhQUFhLEdBQUcsU0FBaEIsYUFBYTtTQUFVO0FBQ2xDLFFBQUksRUFBRSxhQUFhO0FBQ25CLGlCQUFhLEVBQUUsS0FBSztBQUNwQixTQUFLLEVBQUUsTUFBTTtBQUNiLGlCQUFhLEVBQUUsSUFBSTtBQUNuQixRQUFJLEVBQUUsT0FBTyxDQUFDLHNCQUFzQixDQUFDO0dBQ3RDO0NBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvbGludGVyLWpzLXN0YW5kYXJkL2xpYi9pbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG4vLyBEZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGRlcHJlY2F0ZUNvbmZpZyBmcm9tICcuL3V0aWxzL2RlcHJlY2F0ZS1jb25maWcnXG5cbmNvbnN0IHNjb3BlID0gWydqYXZhc2NyaXB0JywgJ3NvdXJjZS5qcycsICdzb3VyY2UuanMuanN4JywgJ3NvdXJjZS5qcy5qcXVlcnknLCAnc291cmNlLnRzJywgJ3NvdXJjZS5nZm0nLCAnc291cmNlLnZ1ZSddXG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIHN0eWxlOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgdGl0bGU6ICdEZWZhdWx0IHN0eWxlJyxcbiAgICBkZXNjcmlwdGlvbjogJ0RlZmF1bHQgZ2xvYmFsIHN0eWxlIHdoZW4gbm9uZSBpcyBpbnN0YWxsZWQgbG9jYWxseS4nLFxuICAgIGRlZmF1bHQ6ICdzdGFuZGFyZCcsXG4gICAgZW51bTogW1xuICAgICAgeyB2YWx1ZTogJ3N0YW5kYXJkJywgZGVzY3JpcHRpb246ICdKYXZhU2NyaXB0IFN0YW5kYXJkIFN0eWxlIChzdGFuZGFyZCknIH0sXG4gICAgICB7IHZhbHVlOiAnc2VtaXN0YW5kYXJkJywgZGVzY3JpcHRpb246ICdKYXZhU2NyaXB0IFNlbWktU3RhbmRhcmQgU3R5bGUgKHNlbWlzdGFuZGFyZCknIH0sXG4gICAgICB7IHZhbHVlOiAnaGFwcGluZXNzJywgZGVzY3JpcHRpb246ICdKYXZhU2NyaXB0IEhhcHBpbmVzcyBTdHlsZSAoaGFwcGluZXNzKScgfVxuICAgIF0sXG4gICAgb3JkZXI6IDFcbiAgfSxcbiAgY2hlY2tTdHlsZURldkRlcGVuZGVuY2llczoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICB0aXRsZTogJ09ubHkgbGludCBpZiBpbnN0YWxsZWQgbG9jYWxseScsXG4gICAgZGVzY3JpcHRpb246ICdPbmx5IGxpbnQgaWYgYHN0YW5kYXJkYCAob3Igb25lIG9mIHRoZSBvdGhlciBzdHlsZXMpIGlzIGluc3RhbGxlZCBhcyBhIGRlcGVuZGVuY3kuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogMlxuICB9LFxuICBzaG93RXNsaW50UnVsZXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgdGl0bGU6ICdTaG93IEVTTGludCBydWxlIElEJyxcbiAgICBkZXNjcmlwdGlvbjogJ1Nob3cgRVNMaW504oCZcyBydWxlIElEIGluIHRoZSBtZXNzYWdlIGRlc2NyaXB0aW9uLicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDNcbiAgfSxcbiAgY2hlY2tGb3JFc2xpbnRDb25maWc6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgdGl0bGU6ICdTa2lwIGlmIEVTTGludCBpcyBpbnN0YWxsZWQgbG9jYWxseScsXG4gICAgZGVzY3JpcHRpb246ICdTa2lwIGxpbnRpbmcgaWYgRVNMaW50IGlzIGluc3RhbGxlZCBsb2NhbGx5LicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogNFxuICB9LFxuICBsaW50SHRtbEZpbGVzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIHRpdGxlOiAnTGludCBIVE1MIGRvY3VtZW50cycsXG4gICAgZGVzY3JpcHRpb246ICdMaW50IEphdmFTY3JpcHQgY29kZSB3aXRoaW4gYDxzY3JpcHQ+YCB0YWdzIGluIEhUTUwgZG9jdW1lbnRzLicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDVcbiAgfSxcbiAgbGludE1hcmtkb3duRmlsZXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgdGl0bGU6ICdMaW50IE1hcmtkb3duIGRvY3VtZW50cycsXG4gICAgZGVzY3JpcHRpb246ICdMaW50IEphdmFTY3JpcHQgY29kZSBibG9ja3Mgd2l0aGluIE1hcmtkb3duIGRvY3VtZW50cy4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiA2XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFjdGl2YXRlICgpIHtcbiAgLy8gSW5zdGFsbCBsaW50ZXItanMtc3RhbmRhcmQgZGVwZW5kZW5jaWVzXG4gIGF3YWl0IHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWpzLXN0YW5kYXJkJylcblxuICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnModGV4dEVkaXRvciA9PiB7XG4gICAgY29uc3QgY29uZmlnID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanMtc3RhbmRhcmQnKVxuXG4gICAgY29uc3QgZ3JhbW1hciA9IHRleHRFZGl0b3IuZ2V0R3JhbW1hcigpIHx8IHsgc2NvcGVOYW1lOiBudWxsIH1cblxuICAgIC8vIENoZWNrIGlmIHRoaXMgZmlsZSBpcyBpbnNpZGUgYW55IGtpbmQgb2YgaHRtbCBzY29wZSAoc3VjaCBhcyB0ZXh0Lmh0bWwuYmFzaWMgYW1vbmcgb3RoZXJzKVxuICAgIGlmIChjb25maWcubGludEh0bWxGaWxlcyAmJiAvXnRleHQuaHRtbC8udGVzdChncmFtbWFyLnNjb3BlTmFtZSkpIHtcbiAgICAgIHNjb3BlLnB1c2goZ3JhbW1hci5zY29wZU5hbWUpXG4gICAgfVxuICB9KSlcblxuICBkZXByZWNhdGVDb25maWcoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSAoKSB7XG4gIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbn1cblxuZXhwb3J0IGNvbnN0IHByb3ZpZGVMaW50ZXIgPSAoKSA9PiAoe1xuICBuYW1lOiAnanMtc3RhbmRhcmQnLFxuICBncmFtbWFyU2NvcGVzOiBzY29wZSxcbiAgc2NvcGU6ICdmaWxlJyxcbiAgbGludHNPbkNoYW5nZTogdHJ1ZSxcbiAgbGludDogcmVxdWlyZSgnLi9saW50ZXItanMtc3RhbmRhcmQnKVxufSlcbiJdfQ==