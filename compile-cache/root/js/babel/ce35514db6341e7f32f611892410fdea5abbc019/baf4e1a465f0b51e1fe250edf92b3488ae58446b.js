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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9mb250cy9saWIvZm9udHMtc2VsZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cUJBRXdCLFNBQVM7O0FBRmpDLFdBQVcsQ0FBQTs7SUFJRSxhQUFhO0FBQ2IsV0FEQSxhQUFhLEdBQ1Y7MEJBREgsYUFBYTs7QUFFdEIsUUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM1QyxPQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtBQUNuQixPQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUE7QUFDeEIsT0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFBO0FBQzNCLE9BQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQTtBQUNoQyxPQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDekIsT0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ3pCLE9BQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUE7QUFDeEMsT0FBRyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0FBQ3pELFNBQUksSUFBTSxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxRQUFLLEVBQUU7QUFDcEYsVUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM1QyxTQUFHLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQTtBQUNwQixTQUFHLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQTtBQUN4QixTQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsU0FBTyxRQUFRLE1BQUcsQ0FBQTtBQUN0QyxTQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFJLENBQUE7QUFDOUQsU0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQU0sR0FBRyxHQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLE9BQUksQ0FBQTtBQUNoRSxVQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLEtBQUssUUFBUSxFQUFDO0FBQ2xELFdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO09BQ3BCO0FBQ0QsU0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNyQjtBQUNELFFBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFBO0dBQ25COztlQXhCVSxhQUFhOztXQXlCaEIsb0JBQUc7QUFDVCxhQUFPLGdCQUFnQixDQUFBO0tBQ3hCOzs7V0FDTSxtQkFBRztBQUNSLFVBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDekU7OztXQUNRLG1CQUFDLEVBQUUsRUFBRTtBQUNaLFVBQUksRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNoQyxZQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO0FBQ2pDLDhCQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtPQUMzQjtLQUNGOzs7U0FwQ1UsYUFBYSIsImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvZm9udHMvbGliL2ZvbnRzLXNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHthcHBseUZvbnR9IGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCBjbGFzcyBGb250c1NlbGVjdG9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3Qgc2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0JylcbiAgICBzZWwubXVsdGlwbGUgPSB0cnVlXG4gICAgc2VsLnN0eWxlLndpZHRoID0gJzEwMCUnXG4gICAgc2VsLnN0eWxlLm92ZXJmbG93ID0gXCJhdXRvXCJcbiAgICBzZWwuc3R5bGUuYmFja2dyb3VuZCA9IFwiaW5oZXJpdFwiXG4gICAgc2VsLnN0eWxlLmJvcmRlciA9IFwibm9uZVwiXG4gICAgc2VsLnN0eWxlLnBhZGRpbmcgPSBcIjFlbVwiXG4gICAgc2VsLmNsYXNzTGlzdC5hZGQoJ25hdGl2ZS1rZXktYmluZGluZ3MnKVxuICAgIHNlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpKVxuICAgIGZvcihjb25zdCBmb250RmFjZSBvZiBhdG9tLmNvbmZpZy5zY2hlbWEucHJvcGVydGllcy5mb250cy5wcm9wZXJ0aWVzLmZvbnRGYW1pbHkuZW51bSkge1xuICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJylcbiAgICAgIG9wdC52YWx1ZSA9IGZvbnRGYWNlXG4gICAgICBvcHQuaW5uZXJUZXh0ID0gZm9udEZhY2VcbiAgICAgIG9wdC5zdHlsZS5mb250RmFtaWx5ID0gYFwiJHtmb250RmFjZX1cImBcbiAgICAgIG9wdC5zdHlsZS5mb250U2l6ZSA9IGAke2F0b20uY29uZmlnLmdldCgnZWRpdG9yLmZvbnRTaXplJyl9cHhgXG4gICAgICBvcHQuc3R5bGUuaGVpZ2h0ID0gYCR7MS41KmF0b20uY29uZmlnLmdldCgnZWRpdG9yLmZvbnRTaXplJyl9cHhgXG4gICAgICBpZihhdG9tLmNvbmZpZy5nZXQoJ2ZvbnRzLmZvbnRGYW1pbHknKSA9PT0gZm9udEZhY2Upe1xuICAgICAgICBvcHQuc2VsZWN0ZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBzZWwuYXBwZW5kQ2hpbGQob3B0KVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnQgPSBzZWxcbiAgfVxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ0ZvbnRzIFNlbGVjdG9yJ1xuICB9XG4gIGRlc3Ryb3koKSB7XG4gICAgaWYodGhpcy5mb250RmFtaWx5KSBhdG9tLmNvbmZpZy5zZXQoJ2ZvbnRzLmZvbnRGYW1pbHknLCB0aGlzLmZvbnRGYW1pbHkpXG4gIH1cbiAgX29uQ2hhbmdlKGV2KSB7XG4gICAgaWYgKGV2LnRhcmdldCAmJiBldi50YXJnZXQudmFsdWUpIHtcbiAgICAgIHRoaXMuZm9udEZhbWlseSA9IGV2LnRhcmdldC52YWx1ZVxuICAgICAgYXBwbHlGb250KHRoaXMuZm9udEZhbWlseSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==