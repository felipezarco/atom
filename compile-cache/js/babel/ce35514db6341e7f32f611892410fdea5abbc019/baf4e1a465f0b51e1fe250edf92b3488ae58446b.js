Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

'use babel';

var FontsSelector = (function () {
  function FontsSelector() {
    _classCallCheck(this, FontsSelector);

    var sel = document.createElement('select');
    sel.multiple = true;
    sel.style.width = '100%';
    sel.style.overflow = "auto";
    sel.style.background = "inherit";
    sel.style.border = "none";
    sel.style.padding = "1em";
    sel.classList.add('native-key-bindings');
    sel.addEventListener('change', this._onChange.bind(this));
    for (var fontFace of atom.config.schema.properties.fonts.properties.fontFamily['enum']) {
      var opt = document.createElement('option');
      opt.value = fontFace;
      opt.innerText = fontFace;
      opt.style.fontFamily = '"' + fontFace + '"';
      opt.style.fontSize = atom.config.get('editor.fontSize') + 'px';
      opt.style.height = 1.5 * atom.config.get('editor.fontSize') + 'px';
      if (atom.config.get('fonts.fontFamily') === fontFace) {
        opt.selected = true;
      }
      sel.appendChild(opt);
    }
    this.element = sel;
  }

  _createClass(FontsSelector, [{
    key: 'getTitle',
    value: function getTitle() {
      return 'Fonts Selector';
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.fontFamily) atom.config.set('fonts.fontFamily', this.fontFamily);
    }
  }, {
    key: '_onChange',
    value: function _onChange(ev) {
      if (ev.target && ev.target.value) {
        this.fontFamily = ev.target.value;
        (0, _utils.applyFont)(this.fontFamily);
      }
    }
  }]);

  return FontsSelector;
})();

exports.FontsSelector = FontsSelector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3phcmNvLy5hdG9tL3BhY2thZ2VzL2ZvbnRzL2xpYi9mb250cy1zZWxlY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztxQkFFd0IsU0FBUzs7QUFGakMsV0FBVyxDQUFBOztJQUlFLGFBQWE7QUFDYixXQURBLGFBQWEsR0FDVjswQkFESCxhQUFhOztBQUV0QixRQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzVDLE9BQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ25CLE9BQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQTtBQUN4QixPQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUE7QUFDM0IsT0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBO0FBQ2hDLE9BQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUN6QixPQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7QUFDekIsT0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUN4QyxPQUFHLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7QUFDekQsU0FBSSxJQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLFFBQUssRUFBRTtBQUNwRixVQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzVDLFNBQUcsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFBO0FBQ3BCLFNBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFNBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxTQUFPLFFBQVEsTUFBRyxDQUFBO0FBQ3RDLFNBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQUksQ0FBQTtBQUM5RCxTQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxHQUFHLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsT0FBSSxDQUFBO0FBQ2hFLFVBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsS0FBSyxRQUFRLEVBQUM7QUFDbEQsV0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7T0FDcEI7QUFDRCxTQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3JCO0FBQ0QsUUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUE7R0FDbkI7O2VBeEJVLGFBQWE7O1dBeUJoQixvQkFBRztBQUNULGFBQU8sZ0JBQWdCLENBQUE7S0FDeEI7OztXQUNNLG1CQUFHO0FBQ1IsVUFBRyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUN6RTs7O1dBQ1EsbUJBQUMsRUFBRSxFQUFFO0FBQ1osVUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ2hDLFlBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUE7QUFDakMsOEJBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQzNCO0tBQ0Y7OztTQXBDVSxhQUFhIiwiZmlsZSI6Ii9ob21lL3phcmNvLy5hdG9tL3BhY2thZ2VzL2ZvbnRzL2xpYi9mb250cy1zZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7YXBwbHlGb250fSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgY2xhc3MgRm9udHNTZWxlY3RvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IHNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpXG4gICAgc2VsLm11bHRpcGxlID0gdHJ1ZVxuICAgIHNlbC5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICAgIHNlbC5zdHlsZS5vdmVyZmxvdyA9IFwiYXV0b1wiXG4gICAgc2VsLnN0eWxlLmJhY2tncm91bmQgPSBcImluaGVyaXRcIlxuICAgIHNlbC5zdHlsZS5ib3JkZXIgPSBcIm5vbmVcIlxuICAgIHNlbC5zdHlsZS5wYWRkaW5nID0gXCIxZW1cIlxuICAgIHNlbC5jbGFzc0xpc3QuYWRkKCduYXRpdmUta2V5LWJpbmRpbmdzJylcbiAgICBzZWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKSlcbiAgICBmb3IoY29uc3QgZm9udEZhY2Ugb2YgYXRvbS5jb25maWcuc2NoZW1hLnByb3BlcnRpZXMuZm9udHMucHJvcGVydGllcy5mb250RmFtaWx5LmVudW0pIHtcbiAgICAgIGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpXG4gICAgICBvcHQudmFsdWUgPSBmb250RmFjZVxuICAgICAgb3B0LmlubmVyVGV4dCA9IGZvbnRGYWNlXG4gICAgICBvcHQuc3R5bGUuZm9udEZhbWlseSA9IGBcIiR7Zm9udEZhY2V9XCJgXG4gICAgICBvcHQuc3R5bGUuZm9udFNpemUgPSBgJHthdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5mb250U2l6ZScpfXB4YFxuICAgICAgb3B0LnN0eWxlLmhlaWdodCA9IGAkezEuNSphdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5mb250U2l6ZScpfXB4YFxuICAgICAgaWYoYXRvbS5jb25maWcuZ2V0KCdmb250cy5mb250RmFtaWx5JykgPT09IGZvbnRGYWNlKXtcbiAgICAgICAgb3B0LnNlbGVjdGVkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgc2VsLmFwcGVuZENoaWxkKG9wdClcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50ID0gc2VsXG4gIH1cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuICdGb250cyBTZWxlY3RvcidcbiAgfVxuICBkZXN0cm95KCkge1xuICAgIGlmKHRoaXMuZm9udEZhbWlseSkgYXRvbS5jb25maWcuc2V0KCdmb250cy5mb250RmFtaWx5JywgdGhpcy5mb250RmFtaWx5KVxuICB9XG4gIF9vbkNoYW5nZShldikge1xuICAgIGlmIChldi50YXJnZXQgJiYgZXYudGFyZ2V0LnZhbHVlKSB7XG4gICAgICB0aGlzLmZvbnRGYW1pbHkgPSBldi50YXJnZXQudmFsdWVcbiAgICAgIGFwcGx5Rm9udCh0aGlzLmZvbnRGYW1pbHkpXG4gICAgfVxuICB9XG59XG4iXX0=