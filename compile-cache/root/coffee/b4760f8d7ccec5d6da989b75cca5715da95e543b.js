(function() {
  module.exports = {
    title: 'Delete Flow',
    description: 'Run only on deleting text',
    handle: function(input, switcher, comboLvl) {
      if (!input.hasDeleted()) {
        return switcher.offAll();
      } else if (comboLvl === 0) {
        switcher.offAll();
        return switcher.on('comboMode');
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2Zsb3cvZGVsZXRlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxLQUFBLEVBQU8sYUFBUDtJQUNBLFdBQUEsRUFBYSwyQkFEYjtJQUdBLE1BQUEsRUFBUSxTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLFFBQWxCO01BQ04sSUFBRyxDQUFDLEtBQUssQ0FBQyxVQUFOLENBQUEsQ0FBSjtlQUNFLFFBQVEsQ0FBQyxNQUFULENBQUEsRUFERjtPQUFBLE1BRUssSUFBRyxRQUFBLEtBQVksQ0FBZjtRQUNILFFBQVEsQ0FBQyxNQUFULENBQUE7ZUFDQSxRQUFRLENBQUMsRUFBVCxDQUFZLFdBQVosRUFGRzs7SUFIQyxDQUhSOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICB0aXRsZTogJ0RlbGV0ZSBGbG93J1xuICBkZXNjcmlwdGlvbjogJ1J1biBvbmx5IG9uIGRlbGV0aW5nIHRleHQnXG5cbiAgaGFuZGxlOiAoaW5wdXQsIHN3aXRjaGVyLCBjb21ib0x2bCkgLT5cbiAgICBpZiAhaW5wdXQuaGFzRGVsZXRlZCgpXG4gICAgICBzd2l0Y2hlci5vZmZBbGwoKVxuICAgIGVsc2UgaWYgY29tYm9MdmwgPT0gMFxuICAgICAgc3dpdGNoZXIub2ZmQWxsKClcbiAgICAgIHN3aXRjaGVyLm9uKCdjb21ib01vZGUnKVxuIl19
