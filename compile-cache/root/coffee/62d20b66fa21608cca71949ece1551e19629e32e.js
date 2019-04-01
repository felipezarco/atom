(function() {
  module.exports = {
    outlineWidth: {
      title: 'Outline Width',
      description: 'The width of the outline in pixels.',
      type: 'integer',
      "default": 1
    },
    outlineStyle: {
      title: 'Outline Style',
      description: 'The border style of the outline. (CSS border-style)',
      type: 'string',
      "default": 'solid'
    },
    outlineColor: {
      title: 'Outline Color',
      description: 'The color of the outline.',
      type: 'color',
      "default": '#C0C0C0'
    },
    outlineOpacity: {
      title: 'Outline Opacity',
      description: 'The opacity of the outline ranging from 0 to 1.',
      type: 'number',
      "default": 1,
      minimum: 0,
      maximum: 1
    },
    outlineRadius: {
      title: 'Outline Radius',
      description: 'The radius of the outline\'s corners (in pixels)',
      type: 'integer',
      "default": 0
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL291dGxpbmUtc2VsZWN0aW9uL2xpYi9jb25maWctc2NoZW1hLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxZQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sZUFBUDtNQUNBLFdBQUEsRUFBYSxxQ0FEYjtNQUVBLElBQUEsRUFBTSxTQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUhUO0tBREY7SUFLQSxZQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sZUFBUDtNQUNBLFdBQUEsRUFBYSxxREFEYjtNQUVBLElBQUEsRUFBTSxRQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxPQUhUO0tBTkY7SUFVQSxZQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sZUFBUDtNQUNBLFdBQUEsRUFBYSwyQkFEYjtNQUVBLElBQUEsRUFBTSxPQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxTQUhUO0tBWEY7SUFlQSxjQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8saUJBQVA7TUFDQSxXQUFBLEVBQWEsaURBRGI7TUFFQSxJQUFBLEVBQU0sUUFGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FIVDtNQUlBLE9BQUEsRUFBUyxDQUpUO01BS0EsT0FBQSxFQUFTLENBTFQ7S0FoQkY7SUFzQkEsYUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLGdCQUFQO01BQ0EsV0FBQSxFQUFhLGtEQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBSFQ7S0F2QkY7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIG91dGxpbmVXaWR0aDpcbiAgICB0aXRsZTogJ091dGxpbmUgV2lkdGgnXG4gICAgZGVzY3JpcHRpb246ICdUaGUgd2lkdGggb2YgdGhlIG91dGxpbmUgaW4gcGl4ZWxzLidcbiAgICB0eXBlOiAnaW50ZWdlcidcbiAgICBkZWZhdWx0OiAxXG4gIG91dGxpbmVTdHlsZTpcbiAgICB0aXRsZTogJ091dGxpbmUgU3R5bGUnXG4gICAgZGVzY3JpcHRpb246ICdUaGUgYm9yZGVyIHN0eWxlIG9mIHRoZSBvdXRsaW5lLiAoQ1NTIGJvcmRlci1zdHlsZSknXG4gICAgdHlwZTogJ3N0cmluZydcbiAgICBkZWZhdWx0OiAnc29saWQnXG4gIG91dGxpbmVDb2xvcjpcbiAgICB0aXRsZTogJ091dGxpbmUgQ29sb3InXG4gICAgZGVzY3JpcHRpb246ICdUaGUgY29sb3Igb2YgdGhlIG91dGxpbmUuJ1xuICAgIHR5cGU6ICdjb2xvcidcbiAgICBkZWZhdWx0OiAnI0MwQzBDMCdcbiAgb3V0bGluZU9wYWNpdHk6XG4gICAgdGl0bGU6ICdPdXRsaW5lIE9wYWNpdHknXG4gICAgZGVzY3JpcHRpb246ICdUaGUgb3BhY2l0eSBvZiB0aGUgb3V0bGluZSByYW5naW5nIGZyb20gMCB0byAxLidcbiAgICB0eXBlOiAnbnVtYmVyJ1xuICAgIGRlZmF1bHQ6IDFcbiAgICBtaW5pbXVtOiAwXG4gICAgbWF4aW11bTogMVxuICBvdXRsaW5lUmFkaXVzOlxuICAgIHRpdGxlOiAnT3V0bGluZSBSYWRpdXMnXG4gICAgZGVzY3JpcHRpb246ICdUaGUgcmFkaXVzIG9mIHRoZSBvdXRsaW5lXFwncyBjb3JuZXJzIChpbiBwaXhlbHMpJ1xuICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgIGRlZmF1bHQ6IDBcbiJdfQ==
