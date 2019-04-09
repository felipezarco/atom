(function() {
  module.exports = {
    title: 'Screen Shake',
    description: 'Shakes the screen on typing.',
    enable: function(api) {
      return this.api = api;
    },
    onInput: function(cursor, screenPosition, input, data) {
      return this.api.shakeScreen(data['intensity']);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi9zY3JlZW4tc2hha2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLEtBQUEsRUFBTyxjQUFQO0lBQ0EsV0FBQSxFQUFhLDhCQURiO0lBR0EsTUFBQSxFQUFRLFNBQUMsR0FBRDthQUNOLElBQUMsQ0FBQSxHQUFELEdBQU87SUFERCxDQUhSO0lBTUEsT0FBQSxFQUFTLFNBQUMsTUFBRCxFQUFTLGNBQVQsRUFBeUIsS0FBekIsRUFBZ0MsSUFBaEM7YUFDUCxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsQ0FBaUIsSUFBSyxDQUFBLFdBQUEsQ0FBdEI7SUFETyxDQU5UOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICB0aXRsZTogJ1NjcmVlbiBTaGFrZSdcbiAgZGVzY3JpcHRpb246ICdTaGFrZXMgdGhlIHNjcmVlbiBvbiB0eXBpbmcuJ1xuXG4gIGVuYWJsZTogKGFwaSkgLT5cbiAgICBAYXBpID0gYXBpXG5cbiAgb25JbnB1dDogKGN1cnNvciwgc2NyZWVuUG9zaXRpb24sIGlucHV0LCBkYXRhKSAtPlxuICAgIEBhcGkuc2hha2VTY3JlZW4oZGF0YVsnaW50ZW5zaXR5J10pXG4iXX0=
