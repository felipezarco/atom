(function() {
  module.exports = {
    syncPackages: {
      description: "Synchronize Packages",
      type: 'boolean',
      "default": true,
      order: 1
    },
    syncSettings: {
      description: "Synchronize Settings",
      type: 'boolean',
      "default": true,
      order: 2
    },
    blacklistedKeys: {
      description: "Comma-seperated list of blacklisted keys (e.g. 'package-name,other-package-name.config-name')",
      type: 'array',
      "default": [],
      items: {
        type: 'string'
      },
      order: 3
    },
    extraFiles: {
      description: 'Comma-seperated list of files other than Atom\'s default config files in ~/.atom',
      type: 'array',
      "default": [],
      items: {
        type: 'string'
      },
      order: 4
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2F0b20tcGFja2FnZS1zeW5jL2xpYi9jb25maWcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFDZixZQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQWEsc0JBQWI7TUFDQSxJQUFBLEVBQU0sU0FETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFGVDtNQUdBLEtBQUEsRUFBTyxDQUhQO0tBRmE7SUFNZixZQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQWEsc0JBQWI7TUFDQSxJQUFBLEVBQU0sU0FETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFGVDtNQUdBLEtBQUEsRUFBTyxDQUhQO0tBUGE7SUFXZixlQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQWEsK0ZBQWI7TUFDQSxJQUFBLEVBQU0sT0FETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtNQUdBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO09BSkY7TUFLQSxLQUFBLEVBQU8sQ0FMUDtLQVphO0lBa0JmLFVBQUEsRUFDRTtNQUFBLFdBQUEsRUFBYSxrRkFBYjtNQUNBLElBQUEsRUFBTSxPQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUZUO01BR0EsS0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47T0FKRjtNQUtBLEtBQUEsRUFBTyxDQUxQO0tBbkJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICBzeW5jUGFja2FnZXM6XG4gICAgZGVzY3JpcHRpb246IFwiU3luY2hyb25pemUgUGFja2FnZXNcIlxuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IHRydWVcbiAgICBvcmRlcjogMVxuICBzeW5jU2V0dGluZ3M6XG4gICAgZGVzY3JpcHRpb246IFwiU3luY2hyb25pemUgU2V0dGluZ3NcIlxuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IHRydWVcbiAgICBvcmRlcjogMlxuICBibGFja2xpc3RlZEtleXM6XG4gICAgZGVzY3JpcHRpb246IFwiQ29tbWEtc2VwZXJhdGVkIGxpc3Qgb2YgYmxhY2tsaXN0ZWQga2V5cyAoZS5nLiAncGFja2FnZS1uYW1lLG90aGVyLXBhY2thZ2UtbmFtZS5jb25maWctbmFtZScpXCJcbiAgICB0eXBlOiAnYXJyYXknXG4gICAgZGVmYXVsdDogW11cbiAgICBpdGVtczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgb3JkZXI6IDNcbiAgZXh0cmFGaWxlczpcbiAgICBkZXNjcmlwdGlvbjogJ0NvbW1hLXNlcGVyYXRlZCBsaXN0IG9mIGZpbGVzIG90aGVyIHRoYW4gQXRvbVxcJ3MgZGVmYXVsdCBjb25maWcgZmlsZXMgaW4gfi8uYXRvbSdcbiAgICB0eXBlOiAnYXJyYXknXG4gICAgZGVmYXVsdDogW11cbiAgICBpdGVtczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgb3JkZXI6IDRcbn1cbiJdfQ==
