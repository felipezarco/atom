Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _recompose = require('recompose');

'use babel';

function GutterResize(_ref) {
  var children = _ref.children;
  var onMouseDown = _ref.onMouseDown;

  return _react2['default'].createElement(
    'div',
    { className: 'resize-container' },
    children,
    _react2['default'].createElement('div', {
      className: 'resize',
      onMouseDown: onMouseDown,
      role: 'presentation'
    })
  );
}

exports['default'] = (0, _recompose.compose)((0, _recompose.withHandlers)({
  onMouseDown: function onMouseDown(_ref2) {
    var onResizeStart = _ref2.onResizeStart;

    return function (e) {
      return (0, _lodash.isFunction)(onResizeStart) && onResizeStart(e.nativeEvent);
    };
  }
}))(GutterResize);
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbXBvbmVudHMvR3V0dGVyUmVzaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztzQkFFMkIsUUFBUTs7cUJBQ2pCLE9BQU87Ozs7eUJBQ2EsV0FBVzs7QUFKakQsV0FBVyxDQUFDOztBQU1aLFNBQVMsWUFBWSxDQUFDLElBQXVCLEVBQUU7TUFBeEIsUUFBUSxHQUFULElBQXVCLENBQXRCLFFBQVE7TUFBRSxXQUFXLEdBQXRCLElBQXVCLENBQVosV0FBVzs7QUFDMUMsU0FDRTs7TUFBSyxTQUFTLEVBQUMsa0JBQWtCO0lBQzlCLFFBQVE7SUFDVDtBQUNFLGVBQVMsRUFBQyxRQUFRO0FBQ2xCLGlCQUFXLEVBQUUsV0FBVyxBQUFDO0FBQ3pCLFVBQUksRUFBQyxjQUFjO01BQ25CO0dBQ0UsQ0FDTjtDQUNIOztxQkFFYyx3QkFDYiw2QkFBYTtBQUNYLGFBQVcsRUFBQSxxQkFBQyxLQUFpQixFQUFFO1FBQWpCLGFBQWEsR0FBZixLQUFpQixDQUFmLGFBQWE7O0FBQ3pCLFdBQU8sVUFBVSxDQUFDLEVBQUU7QUFDbEIsYUFBTyx3QkFBVyxhQUFhLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ2xFLENBQUM7R0FDSDtDQUNGLENBQUMsQ0FDSCxDQUFDLFlBQVksQ0FBQyIsImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi9jb21wb25lbnRzL0d1dHRlclJlc2l6ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjb21wb3NlLCB3aXRoSGFuZGxlcnMgfSBmcm9tICdyZWNvbXBvc2UnO1xuXG5mdW5jdGlvbiBHdXR0ZXJSZXNpemUoe2NoaWxkcmVuLCBvbk1vdXNlRG93bn0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc2l6ZS1jb250YWluZXJcIj5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwicmVzaXplXCJcbiAgICAgICAgb25Nb3VzZURvd249e29uTW91c2VEb3dufVxuICAgICAgICByb2xlPVwicHJlc2VudGF0aW9uXCJcbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXBvc2UoXG4gIHdpdGhIYW5kbGVycyh7XG4gICAgb25Nb3VzZURvd24oeyBvblJlc2l6ZVN0YXJ0IH0pIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbihvblJlc2l6ZVN0YXJ0KSAmJiBvblJlc2l6ZVN0YXJ0KGUubmF0aXZlRXZlbnQpO1xuICAgICAgfTtcbiAgICB9LFxuICB9KVxuKShHdXR0ZXJSZXNpemUpO1xuIl19