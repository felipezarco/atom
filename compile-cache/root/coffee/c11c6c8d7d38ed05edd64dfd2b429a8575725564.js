(function() {
  var BufferedProcess, Emitter, PackageManager, Q, _, semver, url;

  _ = require('underscore-plus');

  BufferedProcess = require('atom').BufferedProcess;

  Emitter = require('emissary').Emitter;

  Q = require('q');

  semver = require('semver');

  url = require('url');

  Q.stopUnhandledRejectionTracking();

  module.exports = PackageManager = (function() {
    Emitter.includeInto(PackageManager);

    function PackageManager() {
      this.packagePromises = [];
    }

    PackageManager.prototype.runCommand = function(args, callback) {
      var command, errorLines, exit, outputLines, stderr, stdout;
      command = atom.packages.getApmPath();
      outputLines = [];
      stdout = function(lines) {
        return outputLines.push(lines);
      };
      errorLines = [];
      stderr = function(lines) {
        return errorLines.push(lines);
      };
      exit = function(code) {
        return callback(code, outputLines.join('\n'), errorLines.join('\n'));
      };
      args.push('--no-color');
      return new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    };

    PackageManager.prototype.loadFeatured = function(callback) {
      var args, version;
      args = ['featured', '--json'];
      version = atom.getVersion();
      if (semver.valid(version)) {
        args.push('--compatible', version);
      }
      return this.runCommand(args, function(code, stdout, stderr) {
        var error, packages, ref;
        if (code === 0) {
          try {
            packages = (ref = JSON.parse(stdout)) != null ? ref : [];
          } catch (error1) {
            error = error1;
            callback(error);
            return;
          }
          return callback(null, packages);
        } else {
          error = new Error('Fetching featured packages and themes failed.');
          error.stdout = stdout;
          error.stderr = stderr;
          return callback(error);
        }
      });
    };

    PackageManager.prototype.loadOutdated = function(callback) {
      var args, version;
      args = ['outdated', '--json'];
      version = atom.getVersion();
      if (semver.valid(version)) {
        args.push('--compatible', version);
      }
      return this.runCommand(args, function(code, stdout, stderr) {
        var error, packages, ref;
        if (code === 0) {
          try {
            packages = (ref = JSON.parse(stdout)) != null ? ref : [];
          } catch (error1) {
            error = error1;
            callback(error);
            return;
          }
          return callback(null, packages);
        } else {
          error = new Error('Fetching outdated packages and themes failed.');
          error.stdout = stdout;
          error.stderr = stderr;
          return callback(error);
        }
      });
    };

    PackageManager.prototype.loadPackage = function(packageName, callback) {
      var args;
      args = ['view', packageName, '--json'];
      return this.runCommand(args, function(code, stdout, stderr) {
        var error, packages, ref;
        if (code === 0) {
          try {
            packages = (ref = JSON.parse(stdout)) != null ? ref : [];
          } catch (error1) {
            error = error1;
            callback(error);
            return;
          }
          return callback(null, packages);
        } else {
          error = new Error("Fetching package '" + packageName + "' failed.");
          error.stdout = stdout;
          error.stderr = stderr;
          return callback(error);
        }
      });
    };

    PackageManager.prototype.getFeatured = function() {
      return this.featuredPromise != null ? this.featuredPromise : this.featuredPromise = Q.nbind(this.loadFeatured, this)();
    };

    PackageManager.prototype.getOutdated = function() {
      return this.outdatedPromise != null ? this.outdatedPromise : this.outdatedPromise = Q.nbind(this.loadOutdated, this)();
    };

    PackageManager.prototype.getPackage = function(packageName) {
      var base;
      return (base = this.packagePromises)[packageName] != null ? base[packageName] : base[packageName] = Q.nbind(this.loadPackage, this, packageName)();
    };

    PackageManager.prototype.search = function(query, options) {
      var args, deferred;
      if (options == null) {
        options = {};
      }
      deferred = Q.defer();
      args = ['search', query, '--json'];
      if (options.themes) {
        args.push('--themes');
      } else if (options.packages) {
        args.push('--packages');
      }
      this.runCommand(args, function(code, stdout, stderr) {
        var error, packages, ref;
        if (code === 0) {
          try {
            packages = (ref = JSON.parse(stdout)) != null ? ref : [];
            return deferred.resolve(packages);
          } catch (error1) {
            error = error1;
            return deferred.reject(error);
          }
        } else {
          error = new Error("Searching for \u201C" + query + "\u201D failed.");
          error.stdout = stdout;
          error.stderr = stderr;
          return deferred.reject(error);
        }
      });
      return deferred.promise;
    };

    PackageManager.prototype.update = function(pack, newVersion, callback) {
      var activateOnFailure, activateOnSuccess, args, exit, name, theme;
      name = pack.name, theme = pack.theme;
      activateOnSuccess = !theme && !atom.packages.isPackageDisabled(name);
      activateOnFailure = atom.packages.isPackageActive(name);
      if (atom.packages.isPackageActive(name)) {
        atom.packages.deactivatePackage(name);
      }
      if (atom.packages.isPackageLoaded(name)) {
        atom.packages.unloadPackage(name);
      }
      args = ['install', name + "@" + newVersion];
      exit = (function(_this) {
        return function(code, stdout, stderr) {
          var error;
          if (code === 0) {
            if (activateOnSuccess) {
              atom.packages.activatePackage(name);
            } else {
              atom.packages.loadPackage(name);
            }
            if (typeof callback === "function") {
              callback();
            }
            return _this.emitPackageEvent('updated', pack);
          } else {
            if (activateOnFailure) {
              atom.packages.activatePackage(name);
            }
            error = new Error("Updating to \u201C" + name + "@" + newVersion + "\u201D failed.");
            error.stdout = stdout;
            error.stderr = stderr;
            error.packageInstallError = !theme;
            _this.emitPackageEvent('update-failed', pack, error);
            return callback(error);
          }
        };
      })(this);
      this.emit('package-updating', pack);
      return this.runCommand(args, exit);
    };

    PackageManager.prototype.install = function(pack, callback) {
      var activateOnFailure, activateOnSuccess, args, exit, name, theme, version;
      name = pack.name, version = pack.version, theme = pack.theme;
      activateOnSuccess = !theme && !atom.packages.isPackageDisabled(name);
      activateOnFailure = atom.packages.isPackageActive(name);
      if (atom.packages.isPackageActive(name)) {
        atom.packages.deactivatePackage(name);
      }
      if (atom.packages.isPackageLoaded(name)) {
        atom.packages.unloadPackage(name);
      }
      args = ['install', name + "@" + version];
      exit = (function(_this) {
        return function(code, stdout, stderr) {
          var error;
          if (code === 0) {
            if (activateOnSuccess) {
              atom.packages.activatePackage(name);
            } else {
              atom.packages.loadPackage(name);
            }
            if (typeof callback === "function") {
              callback();
            }
            return _this.emitPackageEvent('installed', pack);
          } else {
            if (activateOnFailure) {
              atom.packages.activatePackage(name);
            }
            error = new Error("Installing \u201C" + name + "@" + version + "\u201D failed.");
            error.stdout = stdout;
            error.stderr = stderr;
            error.packageInstallError = !theme;
            _this.emitPackageEvent('install-failed', pack, error);
            return callback(error);
          }
        };
      })(this);
      return this.runCommand(args, exit);
    };

    PackageManager.prototype.uninstall = function(pack, callback) {
      var name;
      name = pack.name;
      if (atom.packages.isPackageActive(name)) {
        atom.packages.deactivatePackage(name);
      }
      return this.runCommand(['uninstall', '--hard', name], (function(_this) {
        return function(code, stdout, stderr) {
          var error;
          if (code === 0) {
            if (atom.packages.isPackageLoaded(name)) {
              atom.packages.unloadPackage(name);
            }
            if (typeof callback === "function") {
              callback();
            }
            return _this.emitPackageEvent('uninstalled', pack);
          } else {
            error = new Error("Uninstalling \u201C" + name + "\u201D failed.");
            error.stdout = stdout;
            error.stderr = stderr;
            _this.emitPackageEvent('uninstall-failed', pack, error);
            return callback(error);
          }
        };
      })(this));
    };

    PackageManager.prototype.canUpgrade = function(installedPackage, availableVersion) {
      var installedVersion;
      if (installedPackage == null) {
        return false;
      }
      installedVersion = installedPackage.metadata.version;
      if (!semver.valid(installedVersion)) {
        return false;
      }
      if (!semver.valid(availableVersion)) {
        return false;
      }
      return semver.gt(availableVersion, installedVersion);
    };

    PackageManager.prototype.getPackageTitle = function(arg) {
      var name;
      name = arg.name;
      return _.undasherize(_.uncamelcase(name));
    };

    PackageManager.prototype.getRepositoryUrl = function(arg) {
      var metadata, ref, ref1, repoUrl, repository;
      metadata = arg.metadata;
      repository = metadata.repository;
      repoUrl = (ref = (ref1 = repository != null ? repository.url : void 0) != null ? ref1 : repository) != null ? ref : '';
      return repoUrl.replace(/\.git$/, '').replace(/\/+$/, '');
    };

    PackageManager.prototype.getAuthorUserName = function(pack) {
      var chunks, repoName, repoUrl;
      if (!(repoUrl = this.getRepositoryUrl(pack))) {
        return null;
      }
      repoName = url.parse(repoUrl).pathname;
      chunks = repoName.match('/(.+?)/');
      return chunks != null ? chunks[1] : void 0;
    };

    PackageManager.prototype.checkNativeBuildTools = function() {
      var deferred;
      deferred = Q.defer();
      this.runCommand(['install', '--check'], function(code, stdout, stderr) {
        if (code === 0) {
          return deferred.resolve();
        } else {
          return deferred.reject(new Error());
        }
      });
      return deferred.promise;
    };

    PackageManager.prototype.emitPackageEvent = function(eventName, pack, error) {
      var ref, ref1, theme;
      theme = (ref = pack.theme) != null ? ref : (ref1 = pack.metadata) != null ? ref1.theme : void 0;
      eventName = theme ? "theme-" + eventName : "package-" + eventName;
      return this.emit(eventName, pack, error);
    };

    return PackageManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2F0b20tcGFja2FnZS1zeW5jL2xpYi9wYWNrYWdlLW1hbmFnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0FBQUEsTUFBQTs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUNILGtCQUFtQixPQUFBLENBQVEsTUFBUjs7RUFDbkIsVUFBVyxPQUFBLENBQVEsVUFBUjs7RUFDWixDQUFBLEdBQUksT0FBQSxDQUFRLEdBQVI7O0VBQ0osTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztFQUNULEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUjs7RUFFTixDQUFDLENBQUMsOEJBQUYsQ0FBQTs7RUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ0osT0FBTyxDQUFDLFdBQVIsQ0FBb0IsY0FBcEI7O0lBRWEsd0JBQUE7TUFDWCxJQUFDLENBQUEsZUFBRCxHQUFtQjtJQURSOzs2QkFHYixVQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sUUFBUDtBQUNWLFVBQUE7TUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFkLENBQUE7TUFDVixXQUFBLEdBQWM7TUFDZCxNQUFBLEdBQVMsU0FBQyxLQUFEO2VBQVcsV0FBVyxDQUFDLElBQVosQ0FBaUIsS0FBakI7TUFBWDtNQUNULFVBQUEsR0FBYTtNQUNiLE1BQUEsR0FBUyxTQUFDLEtBQUQ7ZUFBVyxVQUFVLENBQUMsSUFBWCxDQUFnQixLQUFoQjtNQUFYO01BQ1QsSUFBQSxHQUFPLFNBQUMsSUFBRDtlQUNMLFFBQUEsQ0FBUyxJQUFULEVBQWUsV0FBVyxDQUFDLElBQVosQ0FBaUIsSUFBakIsQ0FBZixFQUF1QyxVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFoQixDQUF2QztNQURLO01BR1AsSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFWO2FBQ0EsSUFBSSxlQUFKLENBQW9CO1FBQUMs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IGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2F0b20vc2V0dGluZ3Mtdmlld1xuXG5cbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG57QnVmZmVyZWRQcm9jZXNzfSA9IHJlcXVpcmUgJ2F0b20nXG57RW1pdHRlcn0gPSByZXF1aXJlICdlbWlzc2FyeSdcblEgPSByZXF1aXJlICdxJ1xuc2VtdmVyID0gcmVxdWlyZSAnc2VtdmVyJ1xudXJsID0gcmVxdWlyZSAndXJsJ1xuXG5RLnN0b3BVbmhhbmRsZWRSZWplY3Rpb25UcmFja2luZygpXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFBhY2thZ2VNYW5hZ2VyXG4gIEVtaXR0ZXIuaW5jbHVkZUludG8odGhpcylcblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAcGFja2FnZVByb21pc2VzID0gW11cblxuICBydW5Db21tYW5kOiAoYXJncywgY2FsbGJhY2spIC0+XG4gICAgY29tbWFuZCA9IGF0b20ucGFja2FnZXMuZ2V0QXBtUGF0aCgpXG4gICAgb3V0cHV0TGluZXMgPSBbXVxuICAgIHN0ZG91dCA9IChsaW5lcykgLT4gb3V0cHV0TGluZXMucHVzaChsaW5lcylcbiAgICBlcnJvckxpbmVzID0gW11cbiAgICBzdGRlcnIgPSAobGluZXMpIC0+IGVycm9yTGluZXMucHVzaChsaW5lcylcbiAgICBleGl0ID0gKGNvZGUpIC0+XG4gICAgICBjYWxsYmFjayhjb2RlLCBvdXRwdXRMaW5lcy5qb2luKCdcXG4nKSwgZXJyb3JMaW5lcy5qb2luKCdcXG4nKSlcblxuICAgIGFyZ3MucHVzaCgnLS1uby1jb2xvcicpXG4gICAgbmV3IEJ1ZmZlcmVkUHJvY2Vzcyh7Y29tbWFuZCwgYXJncywgc3Rkb3V0LCBzdGRlcnIsIGV4aXR9KVxuXG4gIGxvYWRGZWF0dXJlZDogKGNhbGxiYWNrKSAtPlxuICAgIGFyZ3MgPSBbJ2ZlYXR1cmVkJywgJy0tanNvbiddXG4gICAgdmVyc2lvbiA9IGF0b20uZ2V0VmVyc2lvbigpXG4gICAgYXJncy5wdXNoKCctLWNvbXBhdGlibGUnLCB2ZXJzaW9uKSBpZiBzZW12ZXIudmFsaWQodmVyc2lvbilcblxuICAgIEBydW5Db21tYW5kIGFyZ3MsIChjb2RlLCBzdGRvdXQsIHN0ZGVycikgLT5cbiAgICAgIGlmIGNvZGUgaXMgMFxuICAgICAgICB0cnlcbiAgICAgICAgICBwYWNrYWdlcyA9IEpTT04ucGFyc2Uoc3Rkb3V0KSA/IFtdXG4gICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IpXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcGFja2FnZXMpXG4gICAgICBlbHNlXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdGZXRjaGluZyBmZWF0dXJlZCBwYWNrYWdlcyBhbmQgdGhlbWVzIGZhaWxlZC4nKVxuICAgICAgICBlcnJvci5zdGRvdXQgPSBzdGRvdXRcbiAgICAgICAgZXJyb3Iuc3RkZXJyID0gc3RkZXJyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yKVxuXG4gIGxvYWRPdXRkYXRlZDogKGNhbGxiYWNrKSAtPlxuICAgIGFyZ3MgPSBbJ291dGRhdGVkJywgJy0tanNvbiddXG4gICAgdmVyc2lvbiA9IGF0b20uZ2V0VmVyc2lvbigpXG4gICAgYXJncy5wdXNoKCctLWNvbXBhdGlibGUnLCB2ZXJzaW9uKSBpZiBzZW12ZXIudmFsaWQodmVyc2lvbilcblxuICAgIEBydW5Db21tYW5kIGFyZ3MsIChjb2RlLCBzdGRvdXQsIHN0ZGVycikgLT5cbiAgICAgIGlmIGNvZGUgaXMgMFxuICAgICAgICB0cnlcbiAgICAgICAgICBwYWNrYWdlcyA9IEpTT04ucGFyc2Uoc3Rkb3V0KSA/IFtdXG4gICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IpXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcGFja2FnZXMpXG4gICAgICBlbHNlXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdGZXRjaGluZyBvdXRkYXRlZCBwYWNrYWdlcyBhbmQgdGhlbWVzIGZhaWxlZC4nKVxuICAgICAgICBlcnJvci5zdGRvdXQgPSBzdGRvdXRcbiAgICAgICAgZXJyb3Iuc3RkZXJyID0gc3RkZXJyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yKVxuXG4gIGxvYWRQYWNrYWdlOiAocGFja2FnZU5hbWUsIGNhbGxiYWNrKSAtPlxuICAgIGFyZ3MgPSBbJ3ZpZXcnLCBwYWNrYWdlTmFtZSwgJy0tanNvbiddXG5cbiAgICBAcnVuQ29tbWFuZCBhcmdzLCAoY29kZSwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4gICAgICBpZiBjb2RlIGlzIDBcbiAgICAgICAgdHJ5XG4gICAgICAgICAgcGFja2FnZXMgPSBKU09OLnBhcnNlKHN0ZG91dCkgPyBbXVxuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHBhY2thZ2VzKVxuICAgICAgZWxzZVxuICAgICAgICBlcnJvciA9IG5ldyBFcnJvcihcIkZldGNoaW5nIHBhY2thZ2UgJyN7cGFja2FnZU5hbWV9JyBmYWlsZWQuXCIpXG4gICAgICAgIGVycm9yLnN0ZG91dCA9IHN0ZG91dFxuICAgICAgICBlcnJvci5zdGRlcnIgPSBzdGRlcnJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IpXG5cbiAgZ2V0RmVhdHVyZWQ6IC0+XG4gICAgQGZlYXR1cmVkUHJvbWlzZSA/PSBRLm5iaW5kKEBsb2FkRmVhdHVyZWQsIHRoaXMpKClcblxuICBnZXRPdXRkYXRlZDogLT5cbiAgICBAb3V0ZGF0ZWRQcm9taXNlID89IFEubmJpbmQoQGxvYWRPdXRkYXRlZCwgdGhpcykoKVxuXG4gIGdldFBhY2thZ2U6IChwYWNrYWdlTmFtZSkgLT5cbiAgICBAcGFja2FnZVByb21pc2VzW3BhY2thZ2VOYW1lXSA/PSBRLm5iaW5kKEBsb2FkUGFja2FnZSwgdGhpcywgcGFja2FnZU5hbWUpKClcblxuICBzZWFyY2g6IChxdWVyeSwgb3B0aW9ucyA9IHt9KSAtPlxuICAgIGRlZmVycmVkID0gUS5kZWZlcigpXG5cbiAgICBhcmdzID0gWydzZWFyY2gnLCBxdWVyeSwgJy0tanNvbiddXG4gICAgaWYgb3B0aW9ucy50aGVtZXNcbiAgICAgIGFyZ3MucHVzaCAnLS10aGVtZXMnXG4gICAgZWxzZSBpZiBvcHRpb25zLnBhY2thZ2VzXG4gICAgICBhcmdzLnB1c2ggJy0tcGFja2FnZXMnXG5cbiAgICBAcnVuQ29tbWFuZCBhcmdzLCAoY29kZSwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4gICAgICBpZiBjb2RlIGlzIDBcbiAgICAgICAgdHJ5XG4gICAgICAgICAgcGFja2FnZXMgPSBKU09OLnBhcnNlKHN0ZG91dCkgPyBbXVxuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocGFja2FnZXMpXG4gICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKVxuICAgICAgZWxzZVxuICAgICAgICBlcnJvciA9IG5ldyBFcnJvcihcIlNlYXJjaGluZyBmb3IgXFx1MjAxQyN7cXVlcnl9XFx1MjAxRCBmYWlsZWQuXCIpXG4gICAgICAgIGVycm9yLnN0ZG91dCA9IHN0ZG91dFxuICAgICAgICBlcnJvci5zdGRlcnIgPSBzdGRlcnJcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKVxuXG4gICAgZGVmZXJyZWQucHJvbWlzZVxuXG4gIHVwZGF0ZTogKHBhY2ssIG5ld1ZlcnNpb24sIGNhbGxiYWNrKSAtPlxuICAgIHtuYW1lLCB0aGVtZX0gPSBwYWNrXG5cbiAgICBhY3RpdmF0ZU9uU3VjY2VzcyA9IG5vdCB0aGVtZSBhbmQgbm90IGF0b20ucGFja2FnZXMuaXNQYWNrYWdlRGlzYWJsZWQobmFtZSlcbiAgICBhY3RpdmF0ZU9uRmFpbHVyZSA9IGF0b20ucGFja2FnZXMuaXNQYWNrYWdlQWN0aXZlKG5hbWUpXG4gICAgYXRvbS5wYWNrYWdlcy5kZWFjdGl2YXRlUGFja2FnZShuYW1lKSBpZiBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZShuYW1lKVxuICAgIGF0b20ucGFja2FnZXMudW5sb2FkUGFja2FnZShuYW1lKSBpZiBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZChuYW1lKVxuXG4gICAgYXJncyA9IFsnaW5zdGFsbCcsIFwiI3tuYW1lfUAje25ld1ZlcnNpb259XCJdXG4gICAgZXhpdCA9IChjb2RlLCBzdGRvdXQsIHN0ZGVycikgPT5cbiAgICAgIGlmIGNvZGUgaXMgMFxuICAgICAgICBpZiBhY3RpdmF0ZU9uU3VjY2Vzc1xuICAgICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKG5hbWUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhdG9tLnBhY2thZ2VzLmxvYWRQYWNrYWdlKG5hbWUpXG5cbiAgICAgICAgY2FsbGJhY2s/KClcbiAgICAgICAgQGVtaXRQYWNrYWdlRXZlbnQgJ3VwZGF0ZWQnLCBwYWNrXG4gICAgICBlbHNlXG4gICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKG5hbWUpIGlmIGFjdGl2YXRlT25GYWlsdXJlXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKFwiVXBkYXRpbmcgdG8gXFx1MjAxQyN7bmFtZX1AI3tuZXdWZXJzaW9ufVxcdTIwMUQgZmFpbGVkLlwiKVxuICAgICAgICBlcnJvci5zdGRvdXQgPSBzdGRvdXRcbiAgICAgICAgZXJyb3Iuc3RkZXJyID0gc3RkZXJyXG4gICAgICAgIGVycm9yLnBhY2thZ2VJbnN0YWxsRXJyb3IgPSBub3QgdGhlbWVcbiAgICAgICAgQGVtaXRQYWNrYWdlRXZlbnQgJ3VwZGF0ZS1mYWlsZWQnLCBwYWNrLCBlcnJvclxuICAgICAgICBjYWxsYmFjayhlcnJvcilcblxuICAgIEBlbWl0KCdwYWNrYWdlLXVwZGF0aW5nJywgcGFjaylcbiAgICBAcnVuQ29tbWFuZChhcmdzLCBleGl0KVxuXG4gIGluc3RhbGw6IChwYWNrLCBjYWxsYmFjaykgLT5cbiAgICB7bmFtZSwgdmVyc2lvbiwgdGhlbWV9ID0gcGFja1xuICAgIGFjdGl2YXRlT25TdWNjZXNzID0gbm90IHRoZW1lIGFuZCBub3QgYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VEaXNhYmxlZChuYW1lKVxuICAgIGFjdGl2YXRlT25GYWlsdXJlID0gYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VBY3RpdmUobmFtZSlcbiAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlKG5hbWUpIGlmIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlQWN0aXZlKG5hbWUpXG4gICAgYXRvbS5wYWNrYWdlcy51bmxvYWRQYWNrYWdlKG5hbWUpIGlmIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKG5hbWUpXG5cbiAgICBhcmdzID0gWydpbnN0YWxsJywgXCIje25hbWV9QCN7dmVyc2lvbn1cIl1cbiAgICBleGl0ID0gKGNvZGUsIHN0ZG91dCwgc3RkZXJyKSA9PlxuICAgICAgaWYgY29kZSBpcyAwXG4gICAgICAgIGlmIGFjdGl2YXRlT25TdWNjZXNzXG4gICAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UobmFtZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ucGFja2FnZXMubG9hZFBhY2thZ2UobmFtZSlcblxuICAgICAgICBjYWxsYmFjaz8oKVxuICAgICAgICBAZW1pdFBhY2thZ2VFdmVudCAnaW5zdGFsbGVkJywgcGFja1xuICAgICAgZWxzZVxuICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShuYW1lKSBpZiBhY3RpdmF0ZU9uRmFpbHVyZVxuICAgICAgICBlcnJvciA9IG5ldyBFcnJvcihcIkluc3RhbGxpbmcgXFx1MjAxQyN7bmFtZX1AI3t2ZXJzaW9ufVxcdTIwMUQgZmFpbGVkLlwiKVxuICAgICAgICBlcnJvci5zdGRvdXQgPSBzdGRvdXRcbiAgICAgICAgZXJyb3Iuc3RkZXJyID0gc3RkZXJyXG4gICAgICAgIGVycm9yLnBhY2thZ2VJbnN0YWxsRXJyb3IgPSBub3QgdGhlbWVcbiAgICAgICAgQGVtaXRQYWNrYWdlRXZlbnQgJ2luc3RhbGwtZmFpbGVkJywgcGFjaywgZXJyb3JcbiAgICAgICAgY2FsbGJhY2soZXJyb3IpXG5cbiAgICBAcnVuQ29tbWFuZChhcmdzLCBleGl0KVxuXG4gIHVuaW5zdGFsbDogKHBhY2ssIGNhbGxiYWNrKSAtPlxuICAgIHtuYW1lfSA9IHBhY2tcblxuICAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2UobmFtZSkgaWYgYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VBY3RpdmUobmFtZSlcblxuICAgIEBydW5Db21tYW5kIFsndW5pbnN0YWxsJywgJy0taGFyZCcsIG5hbWVdLCAoY29kZSwgc3Rkb3V0LCBzdGRlcnIpID0+XG4gICAgICBpZiBjb2RlIGlzIDBcbiAgICAgICAgYXRvbS5wYWNrYWdlcy51bmxvYWRQYWNrYWdlKG5hbWUpIGlmIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKG5hbWUpXG4gICAgICAgIGNhbGxiYWNrPygpXG4gICAgICAgIEBlbWl0UGFja2FnZUV2ZW50ICd1bmluc3RhbGxlZCcsIHBhY2tcbiAgICAgIGVsc2VcbiAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXCJVbmluc3RhbGxpbmcgXFx1MjAxQyN7bmFtZX1cXHUyMDFEIGZhaWxlZC5cIilcbiAgICAgICAgZXJyb3Iuc3Rkb3V0ID0gc3Rkb3V0XG4gICAgICAgIGVycm9yLnN0ZGVyciA9IHN0ZGVyclxuICAgICAgICBAZW1pdFBhY2thZ2VFdmVudCAndW5pbnN0YWxsLWZhaWxlZCcsIHBhY2ssIGVycm9yXG4gICAgICAgIGNhbGxiYWNrKGVycm9yKVxuXG4gIGNhblVwZ3JhZGU6IChpbnN0YWxsZWRQYWNrYWdlLCBhdmFpbGFibGVWZXJzaW9uKSAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgaW5zdGFsbGVkUGFja2FnZT9cblxuICAgIGluc3RhbGxlZFZlcnNpb24gPSBpbnN0YWxsZWRQYWNrYWdlLm1ldGFkYXRhLnZlcnNpb25cbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIHNlbXZlci52YWxpZChpbnN0YWxsZWRWZXJzaW9uKVxuICAgIHJldHVybiBmYWxzZSB1bmxlc3Mgc2VtdmVyLnZhbGlkKGF2YWlsYWJsZVZlcnNpb24pXG5cbiAgICBzZW12ZXIuZ3QoYXZhaWxhYmxlVmVyc2lvbiwgaW5zdGFsbGVkVmVyc2lvbilcblxuICBnZXRQYWNrYWdlVGl0bGU6ICh7bmFtZX0pIC0+XG4gICAgXy51bmRhc2hlcml6ZShfLnVuY2FtZWxjYXNlKG5hbWUpKVxuXG4gIGdldFJlcG9zaXRvcnlVcmw6ICh7bWV0YWRhdGF9KSAtPlxuICAgIHtyZXBvc2l0b3J5fSA9IG1ldGFkYXRhXG4gICAgcmVwb1VybCA9IHJlcG9zaXRvcnk/LnVybCA/IHJlcG9zaXRvcnkgPyAnJ1xuICAgIHJlcG9VcmwucmVwbGFjZSgvXFwuZ2l0JC8sICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG4gIGdldEF1dGhvclVzZXJOYW1lOiAocGFjaykgLT5cbiAgICByZXR1cm4gbnVsbCB1bmxlc3MgcmVwb1VybCA9IEBnZXRSZXBvc2l0b3J5VXJsKHBhY2spXG4gICAgcmVwb05hbWUgPSB1cmwucGFyc2UocmVwb1VybCkucGF0aG5hbWVcbiAgICBjaHVua3MgPSByZXBvTmFtZS5tYXRjaCAnLyguKz8pLydcbiAgICBjaHVua3M/WzFdXG5cbiAgY2hlY2tOYXRpdmVCdWlsZFRvb2xzOiAtPlxuICAgIGRlZmVycmVkID0gUS5kZWZlcigpXG5cbiAgICBAcnVuQ29tbWFuZCBbJ2luc3RhbGwnLCAnLS1jaGVjayddLCAoY29kZSwgc3Rkb3V0LCBzdGRlcnIpIC0+XG4gICAgICBpZiBjb2RlIGlzIDBcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpXG4gICAgICBlbHNlXG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoKSlcblxuICAgIGRlZmVycmVkLnByb21pc2VcblxuICAjIEVtaXRzIHRoZSBhcHByb3ByaWF0ZSBldmVudCBmb3IgdGhlIGdpdmVuIHBhY2thZ2UuXG4gICNcbiAgIyBBbGwgZXZlbnRzIGFyZSBlaXRoZXIgb2YgdGhlIGZvcm0gYHRoZW1lLWZvb2Agb3IgYHBhY2thZ2UtZm9vYCBkZXBlbmRpbmcgb25cbiAgIyB3aGV0aGVyIHRoZSBldmVudCBpcyBmb3IgYSB0aGVtZSBvciBhIG5vcm1hbCBwYWNrYWdlLiBUaGlzIG1ldGhvZCBzdGFuZGFyZGl6ZXNcbiAgIyB0aGUgbG9naWMgdG8gZGV0ZXJtaW5lIGlmIGEgcGFja2FnZSBpcyBhIHRoZW1lIG9yIG5vdCBhbmQgZm9ybWF0cyB0aGUgZXZlbnRcbiAgIyBuYW1lIGFwcHJvcHJpYXRlbHkuXG4gICNcbiAgIyBldmVudE5hbWUgLSBUaGUgZXZlbnQgbmFtZSBzdWZmaXgge1N0cmluZ30gb2YgdGhlIGV2ZW50IHRvIGVtaXQuXG4gICMgcGFjayAtIFRoZSBwYWNrYWdlIGZvciB3aGljaCB0aGUgZXZlbnQgaXMgYmVpbmcgZW1pdHRlZC5cbiAgIyBlcnJvciAtIEFueSBlcnJvciBpbmZvcm1hdGlvbiB0byBiZSBpbmNsdWRlZCBpbiB0aGUgY2FzZSBvZiBhbiBlcnJvci5cbiAgZW1pdFBhY2thZ2VFdmVudDogKGV2ZW50TmFtZSwgcGFjaywgZXJyb3IpIC0+XG4gICAgdGhlbWUgPSBwYWNrLnRoZW1lID8gcGFjay5tZXRhZGF0YT8udGhlbWVcbiAgICBldmVudE5hbWUgPSBpZiB0aGVtZSB0aGVuIFwidGhlbWUtI3tldmVudE5hbWV9XCIgZWxzZSBcInBhY2thZ2UtI3tldmVudE5hbWV9XCJcbiAgICBAZW1pdCBldmVudE5hbWUsIHBhY2ssIGVycm9yXG4iXX0=
