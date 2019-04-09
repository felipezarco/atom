(function() {
  module.exports = {
    setComboRenderer: function(comboRenderer) {
      return this.combo = comboRenderer;
    },
    enable: function() {
      this.combo.enable();
      return this.combo.initConfigSubscribers();
    },
    disable: function() {
      return this.combo.destroy();
    },
    onChangePane: function(editor, editorElement) {
      this.combo.reset();
      if (editor) {
        return this.combo.setup(editorElement);
      }
    },
    onInput: function(cursor, screenPosition, input, data) {
      var qty;
      if (data['reset']) {
        this.combo.resetCounter();
        return;
      }
      qty = 1;
      if (data['qty']) {
        qty = data['qty'];
      }
      if (data['exclamation']) {
        this.combo.showExclamation(data['exclamation'], data['exclamation_type']);
      }
      return this.combo.modifyStreak(qty);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi9jb21iby1tb2RlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxnQkFBQSxFQUFrQixTQUFDLGFBQUQ7YUFDaEIsSUFBQyxDQUFBLEtBQUQsR0FBUztJQURPLENBQWxCO0lBR0EsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMscUJBQVAsQ0FBQTtJQUZNLENBSFI7SUFPQSxPQUFBLEVBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBO0lBRE8sQ0FQVDtJQVVBLFlBQUEsRUFBYyxTQUFDLE1BQUQsRUFBUyxhQUFUO01BQ1osSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLENBQUE7TUFDQSxJQUE4QixNQUE5QjtlQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxDQUFhLGFBQWIsRUFBQTs7SUFGWSxDQVZkO0lBY0EsT0FBQSxFQUFTLFNBQUMsTUFBRCxFQUFTLGNBQVQsRUFBeUIsS0FBekIsRUFBZ0MsSUFBaEM7QUFDUCxVQUFBO01BQUEsSUFBRyxJQUFLLENBQUEsT0FBQSxDQUFSO1FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxZQUFQLENBQUE7QUFDQSxlQUZGOztNQUlBLEdBQUEsR0FBTTtNQUNOLElBQUcsSUFBSyxDQUFBLEtBQUEsQ0FBUjtRQUNFLEdBQUEsR0FBTSxJQUFLLENBQUEsS0FBQSxFQURiOztNQUdBLElBQUcsSUFBSyxDQUFBLGFBQUEsQ0FBUjtRQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsZUFBUCxDQUF1QixJQUFLLENBQUEsYUFBQSxDQUE1QixFQUE0QyxJQUFLLENBQUEsa0JBQUEsQ0FBakQsRUFERjs7YUFHQSxJQUFDLENBQUEsS0FBSyxDQUFDLFlBQVAsQ0FBb0IsR0FBcEI7SUFaTyxDQWRUOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBzZXRDb21ib1JlbmRlcmVyOiAoY29tYm9SZW5kZXJlcikgLT5cbiAgICBAY29tYm8gPSBjb21ib1JlbmRlcmVyXG5cbiAgZW5hYmxlOiAtPlxuICAgIEBjb21iby5lbmFibGUoKVxuICAgIEBjb21iby5pbml0Q29uZmlnU3Vic2NyaWJlcnMoKVxuXG4gIGRpc2FibGU6IC0+XG4gICAgQGNvbWJvLmRlc3Ryb3koKVxuXG4gIG9uQ2hhbmdlUGFuZTogKGVkaXRvciwgZWRpdG9yRWxlbWVudCkgLT5cbiAgICBAY29tYm8ucmVzZXQoKVxuICAgIEBjb21iby5zZXR1cCBlZGl0b3JFbGVtZW50IGlmIGVkaXRvclxuXG4gIG9uSW5wdXQ6IChjdXJzb3IsIHNjcmVlblBvc2l0aW9uLCBpbnB1dCwgZGF0YSkgLT5cbiAgICBpZiBkYXRhWydyZXNldCddXG4gICAgICBAY29tYm8ucmVzZXRDb3VudGVyKClcbiAgICAgIHJldHVyblxuXG4gICAgcXR5ID0gMVxuICAgIGlmIGRhdGFbJ3F0eSddXG4gICAgICBxdHkgPSBkYXRhWydxdHknXVxuXG4gICAgaWYgZGF0YVsnZXhjbGFtYXRpb24nXVxuICAgICAgQGNvbWJvLnNob3dFeGNsYW1hdGlvbiBkYXRhWydleGNsYW1hdGlvbiddLCBkYXRhWydleGNsYW1hdGlvbl90eXBlJ11cblxuICAgIEBjb21iby5tb2RpZnlTdHJlYWsgcXR5XG4iXX0=
