'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var OutlineSelectionView = (function () {
  function OutlineSelectionView() {
    _classCallCheck(this, OutlineSelectionView);

    var CSS_CLASS = 'outline-selection';

    var outlineTopElem = document.createElement('div');
    outlineTopElem.classList.add(CSS_CLASS);
    outlineTopElem.classList.add(CSS_CLASS + '-top');

    var outlineBottomElem = document.createElement('div');
    outlineBottomElem.classList.add(CSS_CLASS);
    outlineBottomElem.classList.add(CSS_CLASS + '-bottom');

    var outlineLeftElem = document.createElement('div');
    outlineLeftElem.classList.add(CSS_CLASS);
    outlineLeftElem.classList.add(CSS_CLASS + '-left');

    var outlineRightElem = document.createElement('div');
    outlineRightElem.classList.add(CSS_CLASS);
    outlineRightElem.classList.add(CSS_CLASS + '-right');

    var outlineHolder = document.createElement('div');
    outlineHolder.classList.add(CSS_CLASS + '-container');
    outlineHolder.appendChild(outlineTopElem);
    outlineHolder.appendChild(outlineBottomElem);
    outlineHolder.appendChild(outlineLeftElem);
    outlineHolder.appendChild(outlineRightElem);
    this.outlineHolder = outlineHolder;

    this.outline = {
      top: outlineTopElem,
      bottom: outlineBottomElem,
      left: outlineLeftElem,
      right: outlineRightElem
    };
  }

  /**
   * Attaches the outline elements to a view if not already attached.
   * @param  {View} view The view to attach the elements of the outline to.
   */

  _createClass(OutlineSelectionView, [{
    key: 'attach',
    value: function attach(view) {
      this.view = view;
      var scrollView = scrollView = view.querySelector('.scroll-view');
      scrollView.appendChild(this.outlineHolder);
    }

    // Tear down any state and detach
  }, {
    key: 'destroy',
    value: function destroy() {
      this.outlineHolder.remove();
    }

    /**
     * Hides the outline elements, thus hiding the outline.
     */
  }, {
    key: 'hide',
    value: function hide() {
      this.outline.top.style.display = 'none';
      this.outline.bottom.style.display = 'none';
      this.outline.left.style.display = 'none';
      this.outline.right.style.display = 'none';
    }

    /**
     * Hides the left and right of the outline. Useful for single line highlights,
     * where the sides should not be seen.
     */
  }, {
    key: 'hideSides',
    value: function hideSides() {
      this.outline.left.style.display = 'none';
      this.outline.right.style.display = 'none';
    }

    /**
     * Shows the outline elements, thus showing the outline.
     */
  }, {
    key: 'show',
    value: function show() {
      this.outline.top.style.display = 'block';
      this.outline.bottom.style.display = 'block';
      this.outline.left.style.display = 'block';
      this.outline.right.style.display = 'block';
    }

    /**
     * Gets the view that the outline is attached to.
     * @return {View} The view that the outline is attached to.
     */
  }, {
    key: 'getView',
    value: function getView() {
      return this.view;
    }

    /**
     * Sets the position of the outline elements.
     * @param {Object} topPosition    The position to set the top element to.
     *                                Contains a top and left, which are numbers.
     * @param {Object} bottomPosition The position to set the bottom element to.
     *                                Contains a top and left, which are numbers.
     * @param {Object} leftPosition   The position to set the left element to.
     *                                Contains a top and left, which are numbers.
     * @param {Object} rightPosition  The position to set the right element to.
     *                                Contains a top and left, which are numbers.
     */
  }, {
    key: 'setPosition',
    value: function setPosition(topPosition, bottomPosition, leftPosition, rightPosition) {
      this.outline.top.style.top = topPosition.hasOwnProperty('top') ? topPosition.top + 'px' : null;
      this.outline.top.style.bottom = topPosition.hasOwnProperty('bottom') ? topPosition.botom + 'px' : null;
      this.outline.top.style.left = topPosition.hasOwnProperty('left') ? topPosition.left + 'px' : null;
      this.outline.top.style.right = topPosition.hasOwnProperty('right') ? topPosition.right + 'px' : null;

      this.outline.bottom.style.top = bottomPosition.hasOwnProperty('top') ? bottomPosition.top + 'px' : null;
      this.outline.bottom.style.bottom = bottomPosition.hasOwnProperty('bottom') ? bottomPosition.bottom + 'px' : null;
      this.outline.bottom.style.left = bottomPosition.hasOwnProperty('left') ? bottomPosition.left + 'px' : null;
      this.outline.bottom.style.right = bottomPosition.hasOwnProperty('right') ? bottomPosition.right + 'px' : null;

      this.outline.left.style.top = leftPosition.hasOwnProperty('top') ? leftPosition.top + 'px' : null;
      this.outline.left.style.bottom = leftPosition.hasOwnProperty('bottom') ? leftPosition.bottom + 'px' : null;
      this.outline.left.style.left = leftPosition.hasOwnProperty('left') ? leftPosition.left + 'px' : null;
      this.outline.left.style.right = leftPosition.hasOwnProperty('right') ? leftPosition.right + 'px' : null;

      this.outline.right.style.top = rightPosition.hasOwnProperty('top') ? rightPosition.top + 'px' : null;
      this.outline.right.style.bottom = rightPosition.hasOwnProperty('bottom') ? rightPosition.bottom + 'px' : null;
      this.outline.right.style.left = rightPosition.hasOwnProperty('left') ? rightPosition.left + 'px' : null;
      this.outline.right.style.right = rightPosition.hasOwnProperty('right') ? rightPosition.right + 'px' : null;
    }

    /**
     * Sets the size of the outline elements.
     * @param {Object} topSize    The size to set the top element to. Contains a
     *                            width and height, which are numbers.
     * @param {Object} bottomSize The size to set the bottom element to. Contains
     *                            a width and height, which are numbers.
     * @param {Object} leftSize   The size to set the left element to. Contains a
     *                            width and height, which are numbers.
     * @param {Object} rightSize  The size to set the right element to. Contains a
     *                            width and height, which are numbers.
     */
  }, {
    key: 'setSize',
    value: function setSize(topSize, bottomSize, leftSize, rightSize) {
      this.outline.top.style.width = topSize.hasOwnProperty('width') ? topSize.width + 'px' : null;
      this.outline.top.style.height = topSize.hasOwnProperty('height') ? topSize.height + 'px' : null;

      this.outline.bottom.style.width = bottomSize.hasOwnProperty('width') ? bottomSize.width + 'px' : null;
      this.outline.bottom.style.height = bottomSize.hasOwnProperty('height') ? bottomSize.height + 'px' : null;

      this.outline.left.style.width = leftSize.hasOwnProperty('width') ? leftSize.width + 'px' : null;
      this.outline.left.style.height = leftSize.hasOwnProperty('height') ? leftSize.height + 'px' : null;

      this.outline.right.style.width = rightSize.hasOwnProperty('width') ? rightSize.width + 'px' : null;
      this.outline.right.style.height = rightSize.hasOwnProperty('height') ? rightSize.height + 'px' : null;
    }

    /**
     * Sets the border radius of the outline appropriately. Some of the corners
     * need to be set and some don't.
     * @param {number} radius        The border radius size in pixels.
     * @param {boolean} isSingleLine Whether the outline will be on a single line
     *                               or on multiple lines.
     */
  }, {
    key: 'setRadius',
    value: function setRadius(radius, isSingleLine) {
      this.outline.top.style.borderTopLeftRadius = radius + 'px';
      this.outline.top.style.borderTopRightRadius = radius + 'px';

      this.outline.bottom.style.borderBottomLeftRadius = radius + 'px';
      this.outline.bottom.style.borderBottomRightRadius = radius + 'px';

      this.outline.left.style.borderTopLeftRadius = radius + 'px';
      this.outline.left.style.borderBottomLeftRadius = radius + 'px';

      this.outline.right.style.borderTopRightRadius = radius + 'px';
      this.outline.right.style.borderBottomRightRadius = radius + 'px';

      if (isSingleLine) {
        this.outline.top.style.borderBottomLeftRadius = radius + 'px';

        this.outline.bottom.style.borderTopRightRadius = radius + 'px';
      } else {
        this.outline.top.style.borderBottomLeftRadius = 0;

        this.outline.bottom.style.borderTopRightRadius = 0;
      }
    }

    /**
     * Sets the border CSS and the opacity for the outline elements.
     * @param {string} borderCss The value to set the border CSS property to.
     *                           Value will look like '1px solid rgba(0,0,0,1)'.
     * @param {number} opacity   The value to set the opacity of the outline
     *                           elements to.
     */
  }, {
    key: 'setStyle',
    value: function setStyle(borderCss, opacity) {
      this.outline.top.style.borderTop = borderCss;
      this.outline.top.style.borderLeft = borderCss;
      this.outline.top.style.opacity = opacity;

      this.outline.bottom.style.borderBottom = borderCss;
      this.outline.bottom.style.borderRight = borderCss;
      this.outline.bottom.style.opacity = opacity;

      this.outline.left.style.borderTop = borderCss;
      this.outline.left.style.borderLeft = borderCss;
      this.outline.left.style.opacity = opacity;

      this.outline.right.style.borderBottom = borderCss;
      this.outline.right.style.borderRight = borderCss;
      this.outline.right.style.opacity = opacity;
    }
  }]);

  return OutlineSelectionView;
})();

exports['default'] = OutlineSelectionView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9vdXRsaW5lLXNlbGVjdGlvbi9saWIvb3V0bGluZS1zZWxlY3Rpb24tdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7SUFFUyxvQkFBb0I7QUFFNUIsV0FGUSxvQkFBb0IsR0FFekI7MEJBRkssb0JBQW9COztBQUdyQyxRQUFNLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQzs7QUFFdEMsUUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRCxrQkFBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDeEMsa0JBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQzs7QUFFakQsUUFBSSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RELHFCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0MscUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUM7O0FBRXZELFFBQUksZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsbUJBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pDLG1CQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUM7O0FBRW5ELFFBQUksZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyRCxvQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLG9CQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMs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R0FBRyxTQUFTLENBQUM7QUFDbEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRTVDLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzlDLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOztBQUUxQyxVQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztBQUNsRCxVQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUNqRCxVQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztLQUM1Qzs7O1NBek1rQixvQkFBb0I7OztxQkFBcEIsb0JBQW9CIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9vdXRsaW5lLXNlbGVjdGlvbi9saWIvb3V0bGluZS1zZWxlY3Rpb24tdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPdXRsaW5lU2VsZWN0aW9uVmlldyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgQ1NTX0NMQVNTID0gJ291dGxpbmUtc2VsZWN0aW9uJztcblxuICAgIGxldCBvdXRsaW5lVG9wRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG91dGxpbmVUb3BFbGVtLmNsYXNzTGlzdC5hZGQoQ1NTX0NMQVNTKTtcbiAgICBvdXRsaW5lVG9wRWxlbS5jbGFzc0xpc3QuYWRkKENTU19DTEFTUyArICctdG9wJyk7XG5cbiAgICBsZXQgb3V0bGluZUJvdHRvbUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdXRsaW5lQm90dG9tRWxlbS5jbGFzc0xpc3QuYWRkKENTU19DTEFTUyk7XG4gICAgb3V0bGluZUJvdHRvbUVsZW0uY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MgKyAnLWJvdHRvbScpO1xuXG4gICAgbGV0IG91dGxpbmVMZWZ0RWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG91dGxpbmVMZWZ0RWxlbS5jbGFzc0xpc3QuYWRkKENTU19DTEFTUyk7XG4gICAgb3V0bGluZUxlZnRFbGVtLmNsYXNzTGlzdC5hZGQoQ1NTX0NMQVNTICsgJy1sZWZ0Jyk7XG5cbiAgICBsZXQgb3V0bGluZVJpZ2h0RWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG91dGxpbmVSaWdodEVsZW0uY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MpO1xuICAgIG91dGxpbmVSaWdodEVsZW0uY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MgKyAnLXJpZ2h0Jyk7XG5cbiAgICBsZXQgb3V0bGluZUhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG91dGxpbmVIb2xkZXIuY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MgKyAnLWNvbnRhaW5lcicpO1xuICAgIG91dGxpbmVIb2xkZXIuYXBwZW5kQ2hpbGQob3V0bGluZVRvcEVsZW0pO1xuICAgIG91dGxpbmVIb2xkZXIuYXBwZW5kQ2hpbGQob3V0bGluZUJvdHRvbUVsZW0pO1xuICAgIG91dGxpbmVIb2xkZXIuYXBwZW5kQ2hpbGQob3V0bGluZUxlZnRFbGVtKTtcbiAgICBvdXRsaW5lSG9sZGVyLmFwcGVuZENoaWxkKG91dGxpbmVSaWdodEVsZW0pO1xuICAgIHRoaXMub3V0bGluZUhvbGRlciA9IG91dGxpbmVIb2xkZXI7XG5cbiAgICB0aGlzLm91dGxpbmUgPSB7XG4gICAgICB0b3A6IG91dGxpbmVUb3BFbGVtLFxuICAgICAgYm90dG9tOiBvdXRsaW5lQm90dG9tRWxlbSxcbiAgICAgIGxlZnQ6IG91dGxpbmVMZWZ0RWxlbSxcbiAgICAgIHJpZ2h0OiBvdXRsaW5lUmlnaHRFbGVtLFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyB0aGUgb3V0bGluZSBlbGVtZW50cyB0byBhIHZpZXcgaWYgbm90IGFscmVhZHkgYXR0YWNoZWQuXG4gICAqIEBwYXJhbSAge1ZpZXd9IHZpZXcgVGhlIHZpZXcgdG8gYXR0YWNoIHRoZSBlbGVtZW50cyBvZiB0aGUgb3V0bGluZSB0by5cbiAgICovXG4gIGF0dGFjaCh2aWV3KSB7XG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgICBsZXQgc2Nyb2xsVmlldyA9IHNjcm9sbFZpZXcgPSB2aWV3LnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGwtdmlldycpO1xuICAgIHNjcm9sbFZpZXcuYXBwZW5kQ2hpbGQodGhpcy5vdXRsaW5lSG9sZGVyKTtcbiAgfVxuXG4gIC8vIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICBkZXN0cm95KCkge1xuICAgIHRoaXMub3V0bGluZUhvbGRlci5yZW1vdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlcyB0aGUgb3V0bGluZSBlbGVtZW50cywgdGh1cyBoaWRpbmcgdGhlIG91dGxpbmUuXG4gICAqL1xuICBoaWRlKCkge1xuICAgIHRoaXMub3V0bGluZS50b3Auc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0aGlzLm91dGxpbmUuYm90dG9tLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5vdXRsaW5lLmxlZnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0aGlzLm91dGxpbmUucmlnaHQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlcyB0aGUgbGVmdCBhbmQgcmlnaHQgb2YgdGhlIG91dGxpbmUuIFVzZWZ1bCBmb3Igc2luZ2xlIGxpbmUgaGlnaGxpZ2h0cyxcbiAgICogd2hlcmUgdGhlIHNpZGVzIHNob3VsZCBub3QgYmUgc2Vlbi5cbiAgICovXG4gIGhpZGVTaWRlcygpIHtcbiAgICB0aGlzLm91dGxpbmUubGVmdC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMub3V0bGluZS5yaWdodC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3dzIHRoZSBvdXRsaW5lIGVsZW1lbnRzLCB0aHVzIHNob3dpbmcgdGhlIG91dGxpbmUuXG4gICAqL1xuICBzaG93KCkge1xuICAgIHRoaXMub3V0bGluZS50b3Auc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5vdXRsaW5lLmJvdHRvbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLm91dGxpbmUubGVmdC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLm91dGxpbmUucmlnaHQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmlldyB0aGF0IHRoZSBvdXRsaW5lIGlzIGF0dGFjaGVkIHRvLlxuICAgKiBAcmV0dXJuIHtWaWV3fSBUaGUgdmlldyB0aGF0IHRoZSBvdXRsaW5lIGlzIGF0dGFjaGVkIHRvLlxuICAgKi9cbiAgZ2V0VmlldygpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBvdXRsaW5lIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdG9wUG9zaXRpb24gICAgVGhlIHBvc2l0aW9uIHRvIHNldCB0aGUgdG9wIGVsZW1lbnQgdG8uXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb250YWlucyBhIHRvcCBhbmQgbGVmdCwgd2hpY2ggYXJlIG51bWJlcnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBib3R0b21Qb3NpdGlvbiBUaGUgcG9zaXRpb24gdG8gc2V0IHRoZSBib3R0b20gZWxlbWVudCB0by5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbnRhaW5zIGEgdG9wIGFuZCBsZWZ0LCB3aGljaCBhcmUgbnVtYmVycy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGxlZnRQb3NpdGlvbiAgIFRoZSBwb3NpdGlvbiB0byBzZXQgdGhlIGxlZnQgZWxlbWVudCB0by5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbnRhaW5zIGEgdG9wIGFuZCBsZWZ0LCB3aGljaCBhcmUgbnVtYmVycy5cbiAgICogQHBhcmFtIHtPYmplY3R9IHJpZ2h0UG9zaXRpb24gIFRoZSBwb3NpdGlvbiB0byBzZXQgdGhlIHJpZ2h0IGVsZW1lbnQgdG8uXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb250YWlucyBhIHRvcCBhbmQgbGVmdCwgd2hpY2ggYXJlIG51bWJlcnMuXG4gICAqL1xuICBzZXRQb3NpdGlvbih0b3BQb3NpdGlvbiwgYm90dG9tUG9zaXRpb24sIGxlZnRQb3NpdGlvbiwgcmlnaHRQb3NpdGlvbikge1xuICAgIHRoaXMub3V0bGluZS50b3Auc3R5bGUudG9wID0gKHRvcFBvc2l0aW9uLmhhc093blByb3BlcnR5KCd0b3AnKSkgPyB0b3BQb3NpdGlvbi50b3AgKyAncHgnIDogbnVsbDtcbiAgICB0aGlzLm91dGxpbmUudG9wLnN0eWxlLmJvdHRvbSA9ICh0b3BQb3NpdGlvbi5oYXNPd25Qcm9wZXJ0eSgnYm90dG9tJykpID8gdG9wUG9zaXRpb24uYm90b20gKyAncHgnIDogbnVsbFxuICAgIHRoaXMub3V0bGluZS50b3Auc3R5bGUubGVmdCA9ICh0b3BQb3NpdGlvbi5oYXNPd25Qcm9wZXJ0eSgnbGVmdCcpKSA/IHRvcFBvc2l0aW9uLmxlZnQgKyAncHgnIDogbnVsbDtcbiAgICB0aGlzLm91dGxpbmUudG9wLnN0eWxlLnJpZ2h0ID0gKHRvcFBvc2l0aW9uLmhhc093blByb3BlcnR5KCdyaWdodCcpKSA/IHRvcFBvc2l0aW9uLnJpZ2h0ICsgJ3B4JyA6IG51bGw7XG5cbiAgICB0aGlzLm91dGxpbmUuYm90dG9tLnN0eWxlLnRvcCA9IChib3R0b21Qb3NpdGlvbi5oYXNPd25Qcm9wZXJ0eSgndG9wJykpID8gYm90dG9tUG9zaXRpb24udG9wICsgJ3B4JyA6IG51bGw7XG4gICAgdGhpcy5vdXRsaW5lLmJvdHRvbS5zdHlsZS5ib3R0b20gPSAoYm90dG9tUG9zaXRpb24uaGFzT3duUHJvcGVydHkoJ2JvdHRvbScpKSA/IGJvdHRvbVBvc2l0aW9uLmJvdHRvbSArICdweCcgOiBudWxsO1xuICAgIHRoaXMub3V0bGluZS5ib3R0b20uc3R5bGUubGVmdCA9IChib3R0b21Qb3NpdGlvbi5oYXNPd25Qcm9wZXJ0eSgnbGVmdCcpKSA/IGJvdHRvbVBvc2l0aW9uLmxlZnQgKyAncHgnIDogbnVsbDtcbiAgICB0aGlzLm91dGxpbmUuYm90dG9tLnN0eWxlLnJpZ2h0ID0gKGJvdHRvbVBvc2l0aW9uLmhhc093blByb3BlcnR5KCdyaWdodCcpKSA/IGJvdHRvbVBvc2l0aW9uLnJpZ2h0ICsgJ3B4JyA6IG51bGw7XG5cbiAgICB0aGlzLm91dGxpbmUubGVmdC5zdHlsZS50b3AgPSAobGVmdFBvc2l0aW9uLmhhc093blByb3BlcnR5KCd0b3AnKSkgPyBsZWZ0UG9zaXRpb24udG9wICsgJ3B4JyA6IG51bGw7XG4gICAgdGhpcy5vdXRsaW5lLmxlZnQuc3R5bGUuYm90dG9tID0gKGxlZnRQb3NpdGlvbi5oYXNPd25Qcm9wZXJ0eSgnYm90dG9tJykpID8gbGVmdFBvc2l0aW9uLmJvdHRvbSArICdweCcgOiBudWxsO1xuICAgIHRoaXMub3V0bGluZS5sZWZ0LnN0eWxlLmxlZnQgPSAobGVmdFBvc2l0aW9uLmhhc093blByb3BlcnR5KCdsZWZ0JykpID8gbGVmdFBvc2l0aW9uLmxlZnQgKyAncHgnIDogbnVsbDtcbiAgICB0aGlzLm91dGxpbmUubGVmdC5zdHlsZS5yaWdodCA9IChsZWZ0UG9zaXRpb24uaGFzT3duUHJvcGVydHkoJ3JpZ2h0JykpID8gbGVmdFBvc2l0aW9uLnJpZ2h0ICsgJ3B4JyA6IG51bGw7XG5cbiAgICB0aGlzLm91dGxpbmUucmlnaHQuc3R5bGUudG9wID0gKHJpZ2h0UG9zaXRpb24uaGFzT3duUHJvcGVydHkoJ3RvcCcpKSA/IHJpZ2h0UG9zaXRpb24udG9wICsgJ3B4JyA6IG51bGw7XG4gICAgdGhpcy5vdXRsaW5lLnJpZ2h0LnN0eWxlLmJvdHRvbSA9IChyaWdodFBvc2l0aW9uLmhhc093blByb3BlcnR5KCdib3R0b20nKSkgPyByaWdodFBvc2l0aW9uLmJvdHRvbSArICdweCcgOiBudWxsO1xuICAgIHRoaXMub3V0bGluZS5yaWdodC5zdHlsZS5sZWZ0ID0gKHJpZ2h0UG9zaXRpb24uaGFzT3duUHJvcGVydHkoJ2xlZnQnKSkgPyByaWdodFBvc2l0aW9uLmxlZnQgKyAncHgnIDogbnVsbDtcbiAgICB0aGlzLm91dGxpbmUucmlnaHQuc3R5bGUucmlnaHQgPSAocmlnaHRQb3NpdGlvbi5oYXNPd25Qcm9wZXJ0eSgncmlnaHQnKSkgPyByaWdodFBvc2l0aW9uLnJpZ2h0ICsgJ3B4JyA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2l6ZSBvZiB0aGUgb3V0bGluZSBlbGVtZW50cy5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRvcFNpemUgICAgVGhlIHNpemUgdG8gc2V0IHRoZSB0b3AgZWxlbWVudCB0by4gQ29udGFpbnMgYVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCBhbmQgaGVpZ2h0LCB3aGljaCBhcmUgbnVtYmVycy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGJvdHRvbVNpemUgVGhlIHNpemUgdG8gc2V0IHRoZSBib3R0b20gZWxlbWVudCB0by4gQ29udGFpbnNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgYSB3aWR0aCBhbmQgaGVpZ2h0LCB3aGljaCBhcmUgbnVtYmVycy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGxlZnRTaXplICAgVGhlIHNpemUgdG8gc2V0IHRoZSBsZWZ0IGVsZW1lbnQgdG8uIENvbnRhaW5zIGFcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggYW5kIGhlaWdodCwgd2hpY2ggYXJlIG51bWJlcnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByaWdodFNpemUgIFRoZSBzaXplIHRvIHNldCB0aGUgcmlnaHQgZWxlbWVudCB0by4gQ29udGFpbnMgYVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCBhbmQgaGVpZ2h0LCB3aGljaCBhcmUgbnVtYmVycy5cbiAgICovXG4gIHNldFNpemUodG9wU2l6ZSwgYm90dG9tU2l6ZSwgbGVmdFNpemUsIHJpZ2h0U2l6ZSkge1xuICAgIHRoaXMub3V0bGluZS50b3Auc3R5bGUud2lkdGggPSAodG9wU2l6ZS5oYXNPd25Qcm9wZXJ0eSgnd2lkdGgnKSkgPyB0b3BTaXplLndpZHRoICsgJ3B4JzogbnVsbDtcbiAgICB0aGlzLm91dGxpbmUudG9wLnN0eWxlLmhlaWdodCA9ICh0b3BTaXplLmhhc093blByb3BlcnR5KCdoZWlnaHQnKSkgPyB0b3BTaXplLmhlaWdodCArICdweCcgOiBudWxsO1xuXG4gICAgdGhpcy5vdXRsaW5lLmJvdHRvbS5zdHlsZS53aWR0aCA9IChib3R0b21TaXplLmhhc093blByb3BlcnR5KCd3aWR0aCcpKSA/IGJvdHRvbVNpemUud2lkdGggKyAncHgnIDogbnVsbDtcbiAgICB0aGlzLm91dGxpbmUuYm90dG9tLnN0eWxlLmhlaWdodCA9IChib3R0b21TaXplLmhhc093blByb3BlcnR5KCdoZWlnaHQnKSkgPyBib3R0b21TaXplLmhlaWdodCArICdweCcgOiBudWxsO1xuXG4gICAgdGhpcy5vdXRsaW5lLmxlZnQuc3R5bGUud2lkdGggPSAobGVmdFNpemUuaGFzT3duUHJvcGVydHkoJ3dpZHRoJykpID8gbGVmdFNpemUud2lkdGggKyAncHgnIDogbnVsbDtcbiAgICB0aGlzLm91dGxpbmUubGVmdC5zdHlsZS5oZWlnaHQgPSAobGVmdFNpemUuaGFzT3duUHJvcGVydHkoJ2hlaWdodCcpKSA/IGxlZnRTaXplLmhlaWdodCArICdweCcgOiBudWxsO1xuXG4gICAgdGhpcy5vdXRsaW5lLnJpZ2h0LnN0eWxlLndpZHRoID0gKHJpZ2h0U2l6ZS5oYXNPd25Qcm9wZXJ0eSgnd2lkdGgnKSkgPyByaWdodFNpemUud2lkdGggKyAncHgnIDogbnVsbDtcbiAgICB0aGlzLm91dGxpbmUucmlnaHQuc3R5bGUuaGVpZ2h0ID0gKHJpZ2h0U2l6ZS5oYXNPd25Qcm9wZXJ0eSgnaGVpZ2h0JykpID8gcmlnaHRTaXplLmhlaWdodCArICdweCcgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGJvcmRlciByYWRpdXMgb2YgdGhlIG91dGxpbmUgYXBwcm9wcmlhdGVseS4gU29tZSBvZiB0aGUgY29ybmVyc1xuICAgKiBuZWVkIHRvIGJlIHNldCBhbmQgc29tZSBkb24ndC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAgICAgICAgVGhlIGJvcmRlciByYWRpdXMgc2l6ZSBpbiBwaXhlbHMuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNTaW5nbGVMaW5lIFdoZXRoZXIgdGhlIG91dGxpbmUgd2lsbCBiZSBvbiBhIHNpbmdsZSBsaW5lXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIG9uIG11bHRpcGxlIGxpbmVzLlxuICAgKi9cbiAgc2V0UmFkaXVzKHJhZGl1cywgaXNTaW5nbGVMaW5lKSB7XG4gICAgdGhpcy5vdXRsaW5lLnRvcC5zdHlsZS5ib3JkZXJUb3BMZWZ0UmFkaXVzID0gcmFkaXVzICsgJ3B4JztcbiAgICB0aGlzLm91dGxpbmUudG9wLnN0eWxlLmJvcmRlclRvcFJpZ2h0UmFkaXVzID0gcmFkaXVzICsgJ3B4JztcblxuICAgIHRoaXMub3V0bGluZS5ib3R0b20uc3R5bGUuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyA9IHJhZGl1cyArICdweCc7XG4gICAgdGhpcy5vdXRsaW5lLmJvdHRvbS5zdHlsZS5ib3JkZXJCb3R0b21SaWdodFJhZGl1cyA9IHJhZGl1cyArICdweCc7XG5cbiAgICB0aGlzLm91dGxpbmUubGVmdC5zdHlsZS5ib3JkZXJUb3BMZWZ0UmFkaXVzID0gcmFkaXVzICsgJ3B4JztcbiAgICB0aGlzLm91dGxpbmUubGVmdC5zdHlsZS5ib3JkZXJCb3R0b21MZWZ0UmFkaXVzID0gcmFkaXVzICsgJ3B4JztcblxuICAgIHRoaXMub3V0bGluZS5yaWdodC5zdHlsZS5ib3JkZXJUb3BSaWdodFJhZGl1cyA9IHJhZGl1cyArICdweCc7XG4gICAgdGhpcy5vdXRsaW5lLnJpZ2h0LnN0eWxlLmJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzID0gcmFkaXVzICsgJ3B4JztcblxuICAgIGlmKGlzU2luZ2xlTGluZSkge1xuICAgICAgdGhpcy5vdXRsaW5lLnRvcC5zdHlsZS5ib3JkZXJCb3R0b21MZWZ0UmFkaXVzID0gcmFkaXVzICsgJ3B4JztcblxuICAgICAgdGhpcy5vdXRsaW5lLmJvdHRvbS5zdHlsZS5ib3JkZXJUb3BSaWdodFJhZGl1cyA9IHJhZGl1cyArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3V0bGluZS50b3Auc3R5bGUuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyA9IDA7XG5cbiAgICAgIHRoaXMub3V0bGluZS5ib3R0b20uc3R5bGUuYm9yZGVyVG9wUmlnaHRSYWRpdXMgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBib3JkZXIgQ1NTIGFuZCB0aGUgb3BhY2l0eSBmb3IgdGhlIG91dGxpbmUgZWxlbWVudHMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBib3JkZXJDc3MgVGhlIHZhbHVlIHRvIHNldCB0aGUgYm9yZGVyIENTUyBwcm9wZXJ0eSB0by5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBWYWx1ZSB3aWxsIGxvb2sgbGlrZSAnMXB4IHNvbGlkIHJnYmEoMCwwLDAsMSknLlxuICAgKiBAcGFyYW0ge251bWJlcn0gb3BhY2l0eSAgIFRoZSB2YWx1ZSB0byBzZXQgdGhlIG9wYWNpdHkgb2YgdGhlIG91dGxpbmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50cyB0by5cbiAgICovXG4gIHNldFN0eWxlKGJvcmRlckNzcywgb3BhY2l0eSkge1xuICAgIHRoaXMub3V0bGluZS50b3Auc3R5bGUuYm9yZGVyVG9wID0gYm9yZGVyQ3NzO1xuICAgIHRoaXMub3V0bGluZS50b3Auc3R5bGUuYm9yZGVyTGVmdCA9IGJvcmRlckNzcztcbiAgICB0aGlzLm91dGxpbmUudG9wLnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5O1xuXG4gICAgdGhpcy5vdXRsaW5lLmJvdHRvbS5zdHlsZS5ib3JkZXJCb3R0b20gPSBib3JkZXJDc3M7XG4gICAgdGhpcy5vdXRsaW5lLmJvdHRvbS5zdHlsZS5ib3JkZXJSaWdodCA9IGJvcmRlckNzcztcbiAgICB0aGlzLm91dGxpbmUuYm90dG9tLnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5O1xuXG4gICAgdGhpcy5vdXRsaW5lLmxlZnQuc3R5bGUuYm9yZGVyVG9wID0gYm9yZGVyQ3NzO1xuICAgIHRoaXMub3V0bGluZS5sZWZ0LnN0eWxlLmJvcmRlckxlZnQgPSBib3JkZXJDc3M7XG4gICAgdGhpcy5vdXRsaW5lLmxlZnQuc3R5bGUub3BhY2l0eSA9IG9wYWNpdHk7XG5cbiAgICB0aGlzLm91dGxpbmUucmlnaHQuc3R5bGUuYm9yZGVyQm90dG9tID0gYm9yZGVyQ3NzO1xuICAgIHRoaXMub3V0bGluZS5yaWdodC5zdHlsZS5ib3JkZXJSaWdodCA9IGJvcmRlckNzcztcbiAgICB0aGlzLm91dGxpbmUucmlnaHQuc3R5bGUub3BhY2l0eSA9IG9wYWNpdHk7XG4gIH1cbn1cbiJdfQ==