(function() {
  module.exports = {
    title: 'Default Flow',
    description: 'Basic flow',
    handle: function(input, switcher, comboLvl) {
      if (comboLvl === 0) {
        switcher.offAll();
        return switcher.on('comboMode');
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2Zsb3cvZGVmYXVsdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsS0FBQSxFQUFPLGNBQVA7SUFDQSxXQUFBLEVBQWEsWUFEYjtJQUdBLE1BQUEsRUFBUSxTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLFFBQWxCO01BQ04sSUFBRyxRQUFBLEtBQVksQ0FBZjtRQUNFLFFBQVEsQ0FBQyxNQUFULENBQUE7ZUFDQSxRQUFRLENBQUMsRUFBVCxDQUFZLFdBQVosRUFGRjs7SUFETSxDQUhSOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICB0aXRsZTogJ0RlZmF1bHQgRmxvdydcbiAgZGVzY3JpcHRpb246ICdCYXNpYyBmbG93J1xuXG4gIGhhbmRsZTogKGlucHV0LCBzd2l0Y2hlciwgY29tYm9MdmwpIC0+XG4gICAgaWYgY29tYm9MdmwgPT0gMFxuICAgICAgc3dpdGNoZXIub2ZmQWxsKClcbiAgICAgIHN3aXRjaGVyLm9uKCdjb21ib01vZGUnKVxuIl19
