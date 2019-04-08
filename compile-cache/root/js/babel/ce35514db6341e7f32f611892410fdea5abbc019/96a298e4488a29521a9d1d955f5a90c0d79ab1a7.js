'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  useCustomUrlTemplateIfStandardRemotesFail: {
    type: 'boolean',
    'default': false
  },
  customCommitUrlTemplateString: {
    type: 'string',
    'default': 'Example -> https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>'
  },
  columnWidth: {
    type: 'integer',
    'default': 210
  },
  dateFormatString: {
    type: 'string',
    'default': 'YYYY-MM-DD'
  },
  gitBinaryPath: {
    type: 'string',
    'default': 'git'
  },
  ignoreWhiteSpaceDiffs: {
    type: 'boolean',
    'default': false
  },
  showFirstNames: {
    type: 'boolean',
    'default': true
  },
  showLastNames: {
    type: 'boolean',
    'default': true
  },
  showHash: {
    type: 'boolean',
    'default': true
  },
  colorCommitAuthors: {
    type: 'boolean',
    'default': false
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2IsMkNBQXlDLEVBQUU7QUFDekMsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjtBQUNELCtCQUE2QixFQUFFO0FBQzdCLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxpRkFBaUY7R0FDM0Y7QUFDRCxhQUFXLEVBQUU7QUFDWCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsR0FBRztHQUNiO0FBQ0Qsa0JBQWdCLEVBQUU7QUFDaEIsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLFlBQVk7R0FDdEI7QUFDRCxlQUFhLEVBQUU7QUFDYixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsS0FBSztHQUNmO0FBQ0QsdUJBQXFCLEVBQUU7QUFDckIsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjtBQUNELGdCQUFjLEVBQUU7QUFDZCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtHQUNkO0FBQ0QsZUFBYSxFQUFFO0FBQ2IsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDtBQUNELFVBQVEsRUFBRTtBQUNSLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0dBQ2Q7QUFDRCxvQkFBa0IsRUFBRTtBQUNsQixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztHQUNmO0NBQ0YiLCJmaWxlIjoiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgdXNlQ3VzdG9tVXJsVGVtcGxhdGVJZlN0YW5kYXJkUmVtb3Rlc0ZhaWw6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gIH0sXG4gIGN1c3RvbUNvbW1pdFVybFRlbXBsYXRlU3RyaW5nOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ0V4YW1wbGUgLT4gaHR0cHM6Ly9naXRodWIuY29tLzwlLSBwcm9qZWN0ICU+LzwlLSByZXBvICU+L2NvbW1pdC88JS0gcmV2aXNpb24gJT4nLFxuICB9LFxuICBjb2x1bW5XaWR0aDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyMTAsXG4gIH0sXG4gIGRhdGVGb3JtYXRTdHJpbmc6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnWVlZWS1NTS1ERCcsXG4gIH0sXG4gIGdpdEJpbmFyeVBhdGg6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnZ2l0JyxcbiAgfSxcbiAgaWdub3JlV2hpdGVTcGFjZURpZmZzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9LFxuICBzaG93Rmlyc3ROYW1lczoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICB9LFxuICBzaG93TGFzdE5hbWVzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gIH0sXG4gIHNob3dIYXNoOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gIH0sXG4gIGNvbG9yQ29tbWl0QXV0aG9yczoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgfSxcbn07XG4iXX0=