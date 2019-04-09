(function() {
  var throttle;

  throttle = require("lodash.throttle");

  module.exports = {
    title: 'Play Audio',
    description: 'Plays selected audio on typing.',
    enable: function(api) {
      this.api = api;
      return this.throttledPlayAudio = throttle(this.api.playAudio.bind(this.api), 100, {
        trailing: false
      });
    },
    onInput: function() {
      return this.throttledPlayAudio();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi9wbGF5LWF1ZGlvLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsS0FBQSxFQUFPLFlBQVA7SUFDQSxXQUFBLEVBQWEsaUNBRGI7SUFHQSxNQUFBLEVBQVEsU0FBQyxHQUFEO01BQ04sSUFBQyxDQUFBLEdBQUQsR0FBTzthQUNQLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixRQUFBLENBQVMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFDLENBQUEsR0FBckIsQ0FBVCxFQUFvQyxHQUFwQyxFQUF5QztRQUFBLFFBQUEsRUFBVSxLQUFWO09BQXpDO0lBRmhCLENBSFI7SUFPQSxPQUFBLEVBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxrQkFBRCxDQUFBO0lBRE8sQ0FQVDs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbInRocm90dGxlID0gcmVxdWlyZSBcImxvZGFzaC50aHJvdHRsZVwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgdGl0bGU6ICdQbGF5IEF1ZGlvJ1xuICBkZXNjcmlwdGlvbjogJ1BsYXlzIHNlbGVjdGVkIGF1ZGlvIG9uIHR5cGluZy4nXG5cbiAgZW5hYmxlOiAoYXBpKSAtPlxuICAgIEBhcGkgPSBhcGlcbiAgICBAdGhyb3R0bGVkUGxheUF1ZGlvID0gdGhyb3R0bGUgQGFwaS5wbGF5QXVkaW8uYmluZChAYXBpKSwgMTAwLCB0cmFpbGluZzogZmFsc2VcblxuICBvbklucHV0OiAtPlxuICAgIEB0aHJvdHRsZWRQbGF5QXVkaW8oKVxuIl19
