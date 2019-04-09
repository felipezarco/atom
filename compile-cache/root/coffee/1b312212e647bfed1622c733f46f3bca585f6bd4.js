(function() {
  module.exports = {
    title: 'Default effect',
    description: 'Simple blaster effect.',
    image: 'atom://activate-power-mode/images/default-effect.gif',
    isDone: function(particle) {
      return particle.alpha <= 0.1;
    },
    update: function(particle) {
      particle.velocity.y += 0.075;
      particle.x += particle.velocity.x;
      particle.y += particle.velocity.y;
      return particle.alpha *= 0.96;
    },
    draw: function(particle, context) {
      context.fillStyle = "rgba(" + particle.color.slice(4, -1) + ", " + particle.alpha + ")";
      return context.fillRect(Math.round(particle.x - particle.size / 2), Math.round(particle.y - particle.size / 2), particle.size, particle.size);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2VmZmVjdC9kZWZhdWx0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxLQUFBLEVBQU8sZ0JBQVA7SUFDQSxXQUFBLEVBQWEsd0JBRGI7SUFFQSxLQUFBLEVBQU8sc0RBRlA7SUFJQSxNQUFBLEVBQVEsU0FBQyxRQUFEO2FBQ04sUUFBUSxDQUFDLEtBQVQsSUFBa0I7SUFEWixDQUpSO0lBT0EsTUFBQSxFQUFRLFNBQUMsUUFBRDtNQUNOLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBbEIsSUFBdUI7TUFDdkIsUUFBUSxDQUFDLENBQVQsSUFBYyxRQUFRLENBQUMsUUFBUSxDQUFDO01BQ2hDLFFBQVEsQ0FBQyxDQUFULElBQWMsUUFBUSxDQUFDLFFBQVEsQ0FBQzthQUNoQyxRQUFRLENBQUMsS0FBVCxJQUFrQjtJQUpaLENBUFI7SUFhQSxJQUFBLEVBQU0sU0FBQyxRQUFELEVBQVcsT0FBWDtNQUNKLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLE9BQUEsR0FBUSxRQUFRLENBQUMsS0FBTSxhQUF2QixHQUErQixJQUEvQixHQUFtQyxRQUFRLENBQUMsS0FBNUMsR0FBa0Q7YUFDdEUsT0FBTyxDQUFDLFFBQVIsQ0FDRSxJQUFJLENBQUMsS0FBTCxDQUFXLFFBQVEsQ0FBQyxDQUFULEdBQWEsUUFBUSxDQUFDLElBQVQsR0FBZ0IsQ0FBeEMsQ0FERixFQUVFLElBQUksQ0FBQyxLQUFMLENBQVcsUUFBUSxDQUFDLENBQVQsR0FBYSxRQUFRLENBQUMsSUFBVCxHQUFnQixDQUF4QyxDQUZGLEVBR0UsUUFBUSxDQUFDLElBSFgsRUFHaUIsUUFBUSxDQUFDLElBSDFCO0lBRkksQ0FiTjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgdGl0bGU6ICdEZWZhdWx0IGVmZmVjdCdcbiAgZGVzY3JpcHRpb246ICdTaW1wbGUgYmxhc3RlciBlZmZlY3QuJ1xuICBpbWFnZTogJ2F0b206Ly9hY3RpdmF0ZS1wb3dlci1tb2RlL2ltYWdlcy9kZWZhdWx0LWVmZmVjdC5naWYnXG5cbiAgaXNEb25lOiAocGFydGljbGUpIC0+XG4gICAgcGFydGljbGUuYWxwaGEgPD0gMC4xXG5cbiAgdXBkYXRlOiAocGFydGljbGUpIC0+XG4gICAgcGFydGljbGUudmVsb2NpdHkueSArPSAwLjA3NVxuICAgIHBhcnRpY2xlLnggKz0gcGFydGljbGUudmVsb2NpdHkueFxuICAgIHBhcnRpY2xlLnkgKz0gcGFydGljbGUudmVsb2NpdHkueVxuICAgIHBhcnRpY2xlLmFscGhhICo9IDAuOTZcblxuICBkcmF3OiAocGFydGljbGUsIGNvbnRleHQpIC0+XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYmEoI3twYXJ0aWNsZS5jb2xvcls0Li4uLTFdfSwgI3twYXJ0aWNsZS5hbHBoYX0pXCJcbiAgICBjb250ZXh0LmZpbGxSZWN0KFxuICAgICAgTWF0aC5yb3VuZChwYXJ0aWNsZS54IC0gcGFydGljbGUuc2l6ZSAvIDIpXG4gICAgICBNYXRoLnJvdW5kKHBhcnRpY2xlLnkgLSBwYXJ0aWNsZS5zaXplIC8gMilcbiAgICAgIHBhcnRpY2xlLnNpemUsIHBhcnRpY2xlLnNpemVcbiAgICApXG4iXX0=
