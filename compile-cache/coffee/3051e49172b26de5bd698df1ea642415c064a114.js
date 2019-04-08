(function() {
  var BufferedProcess, DESCRIPTION, ForkGistIdInputView, GitHubApi, PackageManager, REMOVE_KEYS, SyncSettings, _, fs, ref,
    hasProp = {}.hasOwnProperty;

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs');

  _ = require('underscore-plus');

  ref = [], GitHubApi = ref[0], PackageManager = ref[1];

  ForkGistIdInputView = null;

  DESCRIPTION = 'Atom configuration storage operated by http://atom.io/packages/sync-settings';

  REMOVE_KEYS = ['sync-settings.gistId', 'sync-settings.personalAccessToken', 'sync-settings._analyticsUserId', 'sync-settings._lastBackupHash'];

  SyncSettings = {
    config: require('./config.coffee'),
    activate: function() {
      return setImmediate((function(_this) {
        return function() {
          var mandatorySettingsApplied;
          if (GitHubApi == null) {
            GitHubApi = require('github');
          }
          if (PackageManager == null) {
            PackageManager = require('./package-manager');
          }
          atom.commands.add('atom-workspace', "sync-settings:backup", function() {
            return _this.backup();
          });
          atom.commands.add('atom-workspace', "sync-settings:restore", function() {
            return _this.restore();
          });
          atom.commands.add('atom-workspace', "sync-settings:view-backup", function() {
            return _this.viewBackup();
          });
          atom.commands.add('atom-workspace', "sync-settings:check-backup", function() {
            return _this.checkForUpdate();
          });
          atom.commands.add('atom-workspace', "sync-settings:fork", function() {
            return _this.inputForkGistId();
          });
          mandatorySettingsApplied = _this.checkMandatorySettings();
          if (atom.config.get('sync-settings.checkForUpdatedBackup') && mandatorySettingsApplied) {
            return _this.checkForUpdate();
          }
        };
      })(this));
    },
    deactivate: function() {
      var ref1;
      return (ref1 = this.inputView) != null ? ref1.destroy() : void 0;
    },
    serialize: function() {},
    getGistId: function() {
      var gistId;
      gistId = atom.config.get('sync-settings.gistId') || process.env.GIST_ID;
      if (gistId) {
        gistId = gistId.trim();
      }
      return gistId;
    },
    getPersonalAccessToken: function() {
      var token;
      token = atom.config.get('sync-settings.personalAccessToken') || process.env.GITHUB_TOKEN;
      if (token) {
        token = token.trim();
      }
      return token;
    },
    checkMandatorySettings: function() {
      var missingSettings;
      missingSettings = [];
      if (!this.getGistId()) {
        missingSettings.push("Gist ID");
      }
      if (!this.getPersonalAccessToken()) {
        missingSettings.push("GitHub personal access token");
      }
      if (missingSettings.length) {
        this.notifyMissingMandatorySettings(missingSettings);
      }
      return missingSettings.length === 0;
    },
    checkForUpdate: function(cb) {
      if (cb == null) {
        cb = null;
      }
      if (this.getGistId()) {
        console.debug('checking latest backup...');
        return this.createClient().gists.get({
          id: this.getGistId()
        }, (function(_this) {
          return function(err, res) {
            var SyntaxError, message, ref1, ref2;
            if (err) {
              console.error("error while retrieving the gist. does it exists?", err);
              try {
                message = JSON.parse(err.message).message;
                if (message === 'Not Found') {
                  message = 'Gist ID Not Found';
                }
              } catch (error1) {
                SyntaxError = error1;
                message = err.message;
              }
              atom.notifications.addError("sync-settings: Error retrieving your settings. (" + message + ")");
              return typeof cb === "function" ? cb() : void 0;
            }
            if ((res != null ? (ref1 = res.history) != null ? (ref2 = ref1[0]) != null ? ref2.version : void 0 : void 0 : void 0) == null) {
              console.error("could not interpret result:", res);
              atom.notifications.addError("sync-settings: Error retrieving your settings.");
              return typeof cb === "function" ? cb() : void 0;
            }
            console.debug("latest backup version " + res.history[0].version);
            if (res.history[0].version !== atom.config.get('sync-settings._lastBackupHash')) {
              _this.notifyNewerBackup();
            } else if (!atom.config.get('sync-settings.quietUpdateCheck')) {
              _this.notifyBackupUptodate();
            }
            return typeof cb === "function" ? cb() : void 0;
          };
        })(this));
      } else {
        return this.notifyMissingMandatorySettings(["Gist ID"]);
      }
    },
    notifyNewerBackup: function() {
      var notification, workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      return notification = atom.notifications.addWarning("sync-settings: Your settings are out of date.", {
        dismissable: true,
        buttons: [
          {
            text: "Backup",
            onDidClick: function() {
              atom.commands.dispatch(workspaceElement, "sync-settings:backup");
              return notification.dismiss();
            }
          }, {
            text: "View backup",
            onDidClick: function() {
              return atom.commands.dispatch(workspaceElement, "sync-settings:view-backup");
            }
          }, {
            text: "Restore",
            onDidClick: function() {
              atom.commands.dispatch(workspaceElement, "sync-settings:restore");
              return notification.dismiss();
            }
          }, {
            text: "Dismiss",
            onDidClick: function() {
              return notification.dismiss();
            }
          }
        ]
      });
    },
    notifyBackupUptodate: function() {
      return atom.notifications.addSuccess("sync-settings: Latest backup is already applied.");
    },
    notifyMissingMandatorySettings: function(missingSettings) {
      var context, errorMsg, notification;
      context = this;
      errorMsg = "sync-settings: Mandatory settings missing: " + missingSettings.join(', ');
      return notification = atom.notifications.addError(errorMsg, {
        dismissable: true,
        buttons: [
          {
            text: "Package settings",
            onDidClick: function() {
              context.goToPackageSettings();
              return notification.dismiss();
            }
          }
        ]
      });
    },
    backup: function(cb) {
      var cmtend, cmtstart, ext, file, files, initPath, j, len, path, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
      if (cb == null) {
        cb = null;
      }
      files = {};
      if (atom.config.get('sync-settings.syncSettings')) {
        files["settings.json"] = {
          content: this.getFilteredSettings()
        };
      }
      if (atom.config.get('sync-settings.syncPackages')) {
        files["packages.json"] = {
          content: JSON.stringify(this.getPackages(), null, '\t')
        };
      }
      if (atom.config.get('sync-settings.syncKeymap')) {
        files["keymap.cson"] = {
          content: (ref1 = this.fileContent(atom.keymaps.getUserKeymapPath())) != null ? ref1 : "# keymap file (not found)"
        };
      }
      if (atom.config.get('sync-settings.syncStyles')) {
        files["styles.less"] = {
          content: (ref2 = this.fileContent(atom.styles.getUserStyleSheetPath())) != null ? ref2 : "// styles file (not found)"
        };
      }
      if (atom.config.get('sync-settings.syncInit')) {
        initPath = atom.getUserInitScriptPath();
        path = require('path');
        files[path.basename(initPath)] = {
          content: (ref3 = this.fileContent(initPath)) != null ? ref3 : "# initialization file (not found)"
        };
      }
      if (atom.config.get('sync-settings.syncSnippets')) {
        files["snippets.cson"] = {
          content: (ref4 = this.fileContent(atom.getConfigDirPath() + "/snippets.cson")) != null ? ref4 : "# snippets file (not found)"
        };
      }
      ref6 = (ref5 = atom.config.get('sync-settings.extraFiles')) != null ? ref5 : [];
      for (j = 0, len = ref6.length; j < len; j++) {
        file = ref6[j];
        ext = file.slice(file.lastIndexOf(".")).toLowerCase();
        cmtstart = "#";
        if (ext === ".less" || ext === ".scss" || ext === ".js") {
          cmtstart = "//";
        }
        if (ext === ".css") {
          cmtstart = "/*";
        }
        cmtend = "";
        if (ext === ".css") {
          cmtend = "*/";
        }
        files[file] = {
          content: (ref7 = this.fileContent(atom.getConfigDirPath() + ("/" + file))) != null ? ref7 : cmtstart + " " + file + " (not found) " + cmtend
        };
      }
      return this.createClient().gists.edit({
        id: this.getGistId(),
        description: atom.config.get('sync-settings.gistDescription'),
        files: files
      }, function(err, res) {
        var SyntaxError, message;
        if (err) {
          console.error("error backing up data: " + err.message, err);
          try {
            message = JSON.parse(err.message).message;
            if (message === 'Not Found') {
              message = 'Gist ID Not Found';
            }
          } catch (error1) {
            SyntaxError = error1;
            message = err.message;
          }
          atom.notifications.addError("sync-settings: Error backing up your settings. (" + message + ")");
        } else {
          atom.config.set('sync-settings._lastBackupHash', res.history[0].version);
          atom.notifications.addSuccess("sync-settings: Your settings were successfully backed up. <br/><a href='" + res.html_url + "'>Click here to open your Gist.</a>");
        }
        return typeof cb === "function" ? cb(err, res) : void 0;
      });
    },
    viewBackup: function() {
      var Shell, gistId;
      Shell = require('shell');
      gistId = this.getGistId();
      return Shell.openExternal("https://gist.github.com/" + gistId);
    },
    getPackages: function() {
      var apmInstallSource, i, metadata, name, packages, ref1, theme, version;
      packages = [];
      ref1 = this._getAvailablePackageMetadataWithoutDuplicates();
      for (i in ref1) {
        metadata = ref1[i];
        name = metadata.name, version = metadata.version, theme = metadata.theme, apmInstallSource = metadata.apmInstallSource;
        packages.push({
          name: name,
          version: version,
          theme: theme,
          apmInstallSource: apmInstallSource
        });
      }
      return _.sortBy(packages, 'name');
    },
    _getAvailablePackageMetadataWithoutDuplicates: function() {
      var i, j, len, package_metadata, packages, path, path2metadata, pkg_name, pkg_path, ref1, ref2;
      path2metadata = {};
      package_metadata = atom.packages.getAvailablePackageMetadata();
      ref1 = atom.packages.getAvailablePackagePaths();
      for (i = j = 0, len = ref1.length; j < len; i = ++j) {
        path = ref1[i];
        path2metadata[fs.realpathSync(path)] = package_metadata[i];
      }
      packages = [];
      ref2 = atom.packages.getAvailablePackageNames();
      for (i in ref2) {
        pkg_name = ref2[i];
        pkg_path = atom.packages.resolvePackagePath(pkg_name);
        if (path2metadata[pkg_path]) {
          packages.push(path2metadata[pkg_path]);
        } else {
          console.error('could not correlate package name, path, and metadata');
        }
      }
      return packages;
    },
    restore: function(cb) {
      if (cb == null) {
        cb = null;
      }
      return this.createClient().gists.get({
        id: this.getGistId()
      }, (function(_this) {
        return function(err, res) {
          var SyntaxError, callbackAsync, e, file, filename, message, ref1, ref2;
          if (err) {
            console.error("error while retrieving the gist. does it exists?", err);
            try {
              message = JSON.parse(err.message).message;
              if (message === 'Not Found') {
                message = 'Gist ID Not Found';
              }
            } catch (error1) {
              SyntaxError = error1;
              message = err.message;
            }
            atom.notifications.addError("sync-settings: Error retrieving your settings. (" + message + ")");
            return;
          }
          ref1 = res.files;
          for (filename in ref1) {
            if (!hasProp.call(ref1, filename)) continue;
            file = ref1[filename];
            if (filename === 'settings.json' || filename === 'packages.json') {
              try {
                JSON.parse(file.content);
              } catch (error1) {
                e = error1;
                atom.notifications.addError("sync-settings: Error parsing the fetched JSON file '" + filename + "'. (" + e + ")");
                if (typeof cb === "function") {
                  cb();
                }
                return;
              }
            }
          }
          callbackAsync = false;
          ref2 = res.files;
          for (filename in ref2) {
            if (!hasProp.call(ref2, filename)) continue;
            file = ref2[filename];
            switch (filename) {
              case 'settings.json':
                if (atom.config.get('sync-settings.syncSettings')) {
                  _this.applySettings('', JSON.parse(file.content));
                }
                break;
              case 'packages.json':
                if (atom.config.get('sync-settings.syncPackages')) {
                  callbackAsync = true;
                  _this.installMissingPackages(JSON.parse(file.content), cb);
                  if (atom.config.get('sync-settings.removeObsoletePackages')) {
                    _this.removeObsoletePackages(JSON.parse(file.content), cb);
                  }
                }
                break;
              case 'keymap.cson':
                if (atom.config.get('sync-settings.syncKeymap')) {
                  fs.writeFileSync(atom.keymaps.getUserKeymapPath(), file.content);
                }
                break;
              case 'styles.less':
                if (atom.config.get('sync-settings.syncStyles')) {
                  fs.writeFileSync(atom.styles.getUserStyleSheetPath(), file.content);
                }
                break;
              case 'init.coffee':
                if (atom.config.get('sync-settings.syncInit')) {
                  fs.writeFileSync(atom.getConfigDirPath() + "/init.coffee", file.content);
                }
                break;
              case 'init.js':
                if (atom.config.get('sync-settings.syncInit')) {
                  fs.writeFileSync(atom.getConfigDirPath() + "/init.js", file.content);
                }
                break;
              case 'snippets.cson':
                if (atom.config.get('sync-settings.syncSnippets')) {
                  fs.writeFileSync(atom.getConfigDirPath() + "/snippets.cson", file.content);
                }
                break;
              default:
                fs.writeFileSync((atom.getConfigDirPath()) + "/" + filename, file.content);
            }
          }
          atom.config.set('sync-settings._lastBackupHash', res.history[0].version);
          atom.notifications.addSuccess("sync-settings: Your settings were successfully synchronized.");
          if (!callbackAsync) {
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this));
    },
    createClient: function() {
      var github, token;
      token = this.getPersonalAccessToken();
      if (token) {
        console.debug("Creating GitHubApi client with token = " + (token.substr(0, 4)) + "..." + (token.substr(-4, 4)));
      } else {
        console.debug("Creating GitHubApi client without token");
      }
      github = new GitHubApi({
        version: '3.0.0',
        protocol: 'https'
      });
      github.authenticate({
        type: 'oauth',
        token: token
      });
      return github;
    },
    getFilteredSettings: function() {
      var blacklistedKey, blacklistedKeys, j, len, ref1, settings;
      settings = JSON.parse(JSON.stringify(atom.config.settings));
      blacklistedKeys = REMOVE_KEYS.concat((ref1 = atom.config.get('sync-settings.blacklistedKeys')) != null ? ref1 : []);
      for (j = 0, len = blacklistedKeys.length; j < len; j++) {
        blacklistedKey = blacklistedKeys[j];
        blacklistedKey = blacklistedKey.split(".");
        this._removeProperty(settings, blacklistedKey);
      }
      return JSON.stringify(settings, null, '\t');
    },
    _removeProperty: function(obj, key) {
      var currentKey, lastKey;
      lastKey = key.length === 1;
      currentKey = key.shift();
      if (!lastKey && _.isObject(obj[currentKey]) && !_.isArray(obj[currentKey])) {
        return this._removeProperty(obj[currentKey], key);
      } else {
        return delete obj[currentKey];
      }
    },
    goToPackageSettings: function() {
      return atom.workspace.open("atom://config/packages/sync-settings");
    },
    applySettings: function(pref, settings) {
      var colorKeys, isColor, key, keyPath, results, value, valueKeys;
      results = [];
      for (key in settings) {
        value = settings[key];
        key = key.replace(/\./g, "\\.");
        keyPath = pref + "." + key;
        isColor = false;
        if (_.isObject(value)) {
          valueKeys = Object.keys(value);
          colorKeys = ['alpha', 'blue', 'green', 'red'];
          isColor = _.isEqual(_.sortBy(valueKeys), colorKeys);
        }
        if (_.isObject(value) && !_.isArray(value) && !isColor) {
          results.push(this.applySettings(keyPath, value));
        } else {
          console.debug("config.set " + keyPath.slice(1) + "=" + value);
          results.push(atom.config.set(keyPath.slice(1), value));
        }
      }
      return results;
    },
    removeObsoletePackages: function(remaining_packages, cb) {
      var concurrency, failed, i, installed_packages, j, k, keep_installed_package, len, notifications, obsolete_packages, p, pkg, ref1, removeNextPackage, results, succeeded;
      installed_packages = this.getPackages();
      obsolete_packages = [];
      for (j = 0, len = installed_packages.length; j < len; j++) {
        pkg = installed_packages[j];
        keep_installed_package = (function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = remaining_packages.length; k < len1; k++) {
            p = remaining_packages[k];
            if (p.name === pkg.name) {
              results.push(p);
            }
          }
          return results;
        })();
        if (keep_installed_package.length === 0) {
          obsolete_packages.push(pkg);
        }
      }
      if (obsolete_packages.length === 0) {
        atom.notifications.addInfo("Sync-settings: no packages to remove");
        return typeof cb === "function" ? cb() : void 0;
      }
      notifications = {};
      succeeded = [];
      failed = [];
      removeNextPackage = (function(_this) {
        return function() {
          var count, failedStr, i;
          if (obsolete_packages.length > 0) {
            pkg = obsolete_packages.shift();
            i = succeeded.length + failed.length + Object.keys(notifications).length + 1;
            count = i + obsolete_packages.length;
            notifications[pkg.name] = atom.notifications.addInfo("Sync-settings: removing " + pkg.name + " (" + i + "/" + count + ")", {
              dismissable: true
            });
            return (function(pkg) {
              return _this.removePackage(pkg, function(error) {
                notifications[pkg.name].dismiss();
                delete notifications[pkg.name];
                if (error != null) {
                  failed.push(pkg.name);
                  atom.notifications.addWarning("Sync-settings: failed to remove " + pkg.name);
                } else {
                  succeeded.push(pkg.name);
                }
                return removeNextPackage();
              });
            })(pkg);
          } else if (Object.keys(notifications).length === 0) {
            if (failed.length === 0) {
              atom.notifications.addSuccess("Sync-settings: finished removing " + succeeded.length + " packages");
            } else {
              failed.sort();
              failedStr = failed.join(', ');
              atom.notifications.addWarning("Sync-settings: finished removing packages (" + failed.length + " failed: " + failedStr + ")", {
                dismissable: true
              });
            }
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this);
      concurrency = Math.min(obsolete_packages.length, 8);
      results = [];
      for (i = k = 0, ref1 = concurrency; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        results.push(removeNextPackage());
      }
      return results;
    },
    removePackage: function(pack, cb) {
      var packageManager, type;
      type = pack.theme ? 'theme' : 'package';
      console.info("Removing " + type + " " + pack.name + "...");
      packageManager = new PackageManager();
      return packageManager.uninstall(pack, function(error) {
        var ref1;
        if (error != null) {
          console.error("Removing " + type + " " + pack.name + " failed", (ref1 = error.stack) != null ? ref1 : error, error.stderr);
        } else {
          console.info("Removing " + type + " " + pack.name);
        }
        return typeof cb === "function" ? cb(error) : void 0;
      });
    },
    installMissingPackages: function(packages, cb) {
      var available_package, available_packages, concurrency, failed, i, installNextPackage, j, k, len, missing_packages, notifications, p, pkg, ref1, results, succeeded;
      available_packages = this.getPackages();
      missing_packages = [];
      for (j = 0, len = packages.length; j < len; j++) {
        pkg = packages[j];
        available_package = (function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = available_packages.length; k < len1; k++) {
            p = available_packages[k];
            if (p.name === pkg.name) {
              results.push(p);
            }
          }
          return results;
        })();
        if (available_package.length === 0) {
          missing_packages.push(pkg);
        } else if (!(!!pkg.apmInstallSource === !!available_package[0].apmInstallSource)) {
          missing_packages.push(pkg);
        }
      }
      if (missing_packages.length === 0) {
        atom.notifications.addInfo("Sync-settings: no packages to install");
        return typeof cb === "function" ? cb() : void 0;
      }
      notifications = {};
      succeeded = [];
      failed = [];
      installNextPackage = (function(_this) {
        return function() {
          var count, failedStr, i;
          if (missing_packages.length > 0) {
            pkg = missing_packages.shift();
            i = succeeded.length + failed.length + Object.keys(notifications).length + 1;
            count = i + missing_packages.length;
            notifications[pkg.name] = atom.notifications.addInfo("Sync-settings: installing " + pkg.name + " (" + i + "/" + count + ")", {
              dismissable: true
            });
            return (function(pkg) {
              return _this.installPackage(pkg, function(error) {
                notifications[pkg.name].dismiss();
                delete notifications[pkg.name];
                if (error != null) {
                  failed.push(pkg.name);
                  atom.notifications.addWarning("Sync-settings: failed to install " + pkg.name);
                } else {
                  succeeded.push(pkg.name);
                }
                return installNextPackage();
              });
            })(pkg);
          } else if (Object.keys(notifications).length === 0) {
            if (failed.length === 0) {
              atom.notifications.addSuccess("Sync-settings: finished installing " + succeeded.length + " packages");
            } else {
              failed.sort();
              failedStr = failed.join(', ');
              atom.notifications.addWarning("Sync-settings: finished installing packages (" + failed.length + " failed: " + failedStr + ")", {
                dismissable: true
              });
            }
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this);
      concurrency = Math.min(missing_packages.length, 8);
      results = [];
      for (i = k = 0, ref1 = concurrency; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        results.push(installNextPackage());
      }
      return results;
    },
    installPackage: function(pack, cb) {
      var packageManager, type;
      type = pack.theme ? 'theme' : 'package';
      console.info("Installing " + type + " " + pack.name + "...");
      packageManager = new PackageManager();
      return packageManager.install(pack, function(error) {
        var ref1;
        if (error != null) {
          console.error("Installing " + type + " " + pack.name + " failed", (ref1 = error.stack) != null ? ref1 : error, error.stderr);
        } else {
          console.info("Installed " + type + " " + pack.name);
        }
        return typeof cb === "function" ? cb(error) : void 0;
      });
    },
    fileContent: function(filePath) {
      var e;
      try {
        return fs.readFileSync(filePath, {
          encoding: 'utf8'
        }) || null;
      } catch (error1) {
        e = error1;
        console.error("Error reading file " + filePath + ". Probably doesn't exist.", e);
        return null;
      }
    },
    inputForkGistId: function() {
      if (ForkGistIdInputView == null) {
        ForkGistIdInputView = require('./fork-gistid-input-view');
      }
      this.inputView = new ForkGistIdInputView();
      return this.inputView.setCallbackInstance(this);
    },
    forkGistId: function(forkId) {
      return this.createClient().gists.fork({
        id: forkId
      }, function(err, res) {
        var SyntaxError, message;
        if (err) {
          try {
            message = JSON.parse(err.message).message;
            if (message === "Not Found") {
              message = "Gist ID Not Found";
            }
          } catch (error1) {
            SyntaxError = error1;
            message = err.message;
          }
          atom.notifications.addError("sync-settings: Error forking settings. (" + message + ")");
          return typeof cb === "function" ? cb() : void 0;
        }
        if (res.id) {
          atom.config.set("sync-settings.gistId", res.id);
          atom.notifications.addSuccess("sync-settings: Forked successfully to the new Gist ID " + res.id + " which has been saved to your config.");
        } else {
          atom.notifications.addError("sync-settings: Error forking settings");
        }
        return typeof cb === "function" ? cb() : void 0;
      });
    }
  };

  module.exports = SyncSettings;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3N5bmMtc2V0dGluZ3MvbGliL3N5bmMtc2V0dGluZ3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSxtSEFBQTtJQUFBOztFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUjs7RUFDcEIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osTUFBOEIsRUFBOUIsRUFBQyxrQkFBRCxFQUFZOztFQUNaLG1CQUFBLEdBQXNCOztFQUd0QixXQUFBLEdBQWM7O0VBQ2QsV0FBQSxHQUFjLENBQ1osc0JBRFksRUFFWixtQ0FGWSxFQUdaLGdDQUhZLEVBSVosK0JBSlk7O0VBT2QsWUFBQSxHQUNFO0lBQUEsTUFBQSxFQUFRLE9BQUEsQ0FBUSxpQkFBUixDQUFSO0lBRUEsUUFBQSxFQUFVLFNBQUE7YUFFUixZQUFBLENBQWEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBRVgsY0FBQTs7WUFBQSxZQUFhLE9BQUEsQ0FBUSxRQUFSOzs7WUFDYixpQkFBa0IsT0FBQSxDQUFRLG1CQUFSOztVQUVsQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHNCQUFwQyxFQUE0RCxTQUFBO21CQUMxRCxLQUFDLENBQUEsTUFBRCxDQUFBO1VBRDBELENBQTVEO1VBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyx1QkFBcEMsRUFBNkQsU0FBQTttQkFDM0QsS0FBQyxDQUFBLE9BQUQsQ0FBQTtVQUQyRCxDQUE3RDtVQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsMkJBQXBDLEVBQWlFLFNBQUE7bUJBQy9ELEtBQUMsQ0FBQSxVQUFELENBQUE7VUFEK0QsQ0FBakU7VUFFQSxJQUFJLENB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K0IsSUFBL0I7SUFIZSxDQW5iakI7SUF3YkEsVUFBQSxFQUFZLFNBQUMsTUFBRDthQUNWLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBZSxDQUFDLEtBQUssQ0FBQyxJQUF0QixDQUNFO1FBQUEsRUFBQSxFQUFJLE1BQUo7T0FERixFQUVFLFNBQUMsR0FBRCxFQUFNLEdBQU47QUFDQSxZQUFBO1FBQUEsSUFBRyxHQUFIO0FBQ0U7WUFDRSxPQUFBLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFHLENBQUMsT0FBZixDQUF1QixDQUFDO1lBQ2xDLElBQWlDLE9BQUEsS0FBVyxXQUE1QztjQUFBLE9BQUEsR0FBVSxvQkFBVjthQUZGO1dBQUEsY0FBQTtZQUdNO1lBQ0osT0FBQSxHQUFVLEdBQUcsQ0FBQyxRQUpoQjs7VUFLQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLDBDQUFBLEdBQTJDLE9BQTNDLEdBQW1ELEdBQS9FO0FBQ0EsNENBQU8sY0FQVDs7UUFTQSxJQUFHLEdBQUcsQ0FBQyxFQUFQO1VBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxHQUFHLENBQUMsRUFBNUM7VUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLHdEQUFBLEdBQTJELEdBQUcsQ0FBQyxFQUEvRCxHQUFvRSx1Q0FBbEcsRUFGRjtTQUFBLE1BQUE7VUFJRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLHVDQUE1QixFQUpGOzswQ0FNQTtNQWhCQSxDQUZGO0lBRFUsQ0F4Ylo7OztFQTZjRixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQTdkakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIGltcG9ydHNcbntCdWZmZXJlZFByb2Nlc3N9ID0gcmVxdWlyZSAnYXRvbSdcbmZzID0gcmVxdWlyZSAnZnMnXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuW0dpdEh1YkFwaSwgUGFja2FnZU1hbmFnZXJdID0gW11cbkZvcmtHaXN0SWRJbnB1dFZpZXcgPSBudWxsXG5cbiMgY29uc3RhbnRzXG5ERVNDUklQVElPTiA9ICdBdG9tIGNvbmZpZ3VyYXRpb24gc3RvcmFnZSBvcGVyYXRlZCBieSBodHRwOi8vYXRvbS5pby9wYWNrYWdlcy9zeW5jLXNldHRpbmdzJ1xuUkVNT1ZFX0tFWVMgPSBbXG4gICdzeW5jLXNldHRpbmdzLmdpc3RJZCcsXG4gICdzeW5jLXNldHRpbmdzLnBlcnNvbmFsQWNjZXNzVG9rZW4nLFxuICAnc3luYy1zZXR0aW5ncy5fYW5hbHl0aWNzVXNlcklkJywgICMga2VlcCBsZWdhY3kga2V5IGluIGJsYWNrbGlzdFxuICAnc3luYy1zZXR0aW5ncy5fbGFzdEJhY2t1cEhhc2gnLFxuXVxuXG5TeW5jU2V0dGluZ3MgPVxuICBjb25maWc6IHJlcXVpcmUoJy4vY29uZmlnLmNvZmZlZScpXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgIyBzcGVlZHVwIGFjdGl2YXRpb24gYnkgYXN5bmMgaW5pdGlhbGl6aW5nXG4gICAgc2V0SW1tZWRpYXRlID0+XG4gICAgICAjIGFjdHVhbCBpbml0aWFsaXphdGlvbiBhZnRlciBhdG9tIGhhcyBsb2FkZWRcbiAgICAgIEdpdEh1YkFwaSA/PSByZXF1aXJlICdnaXRodWInXG4gICAgICBQYWNrYWdlTWFuYWdlciA/PSByZXF1aXJlICcuL3BhY2thZ2UtbWFuYWdlcidcblxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgXCJzeW5jLXNldHRpbmdzOmJhY2t1cFwiLCA9PlxuICAgICAgICBAYmFja3VwKClcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsIFwic3luYy1zZXR0aW5nczpyZXN0b3JlXCIsID0+XG4gICAgICAgIEByZXN0b3JlKClcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsIFwic3luYy1zZXR0aW5nczp2aWV3LWJhY2t1cFwiLCA9PlxuICAgICAgICBAdmlld0JhY2t1cCgpXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCBcInN5bmMtc2V0dGluZ3M6Y2hlY2stYmFja3VwXCIsID0+XG4gICAgICAgIEBjaGVja0ZvclVwZGF0ZSgpXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCBcInN5bmMtc2V0dGluZ3M6Zm9ya1wiLCA9PlxuICAgICAgICBAaW5wdXRGb3JrR2lzdElkKClcblxuICAgICAgbWFuZGF0b3J5U2V0dGluZ3NBcHBsaWVkID0gQGNoZWNrTWFuZGF0b3J5U2V0dGluZ3MoKVxuICAgICAgQGNoZWNrRm9yVXBkYXRlKCkgaWYgYXRvbS5jb25maWcuZ2V0KCdzeW5jLXNldHRpbmdzLmNoZWNrRm9yVXBkYXRlZEJhY2t1cCcpIGFuZCBtYW5kYXRvcnlTZXR0aW5nc0FwcGxpZWRcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBpbnB1dFZpZXc/LmRlc3Ryb3koKVxuXG4gIHNlcmlhbGl6ZTogLT5cblxuICBnZXRHaXN0SWQ6IC0+XG4gICAgZ2lzdElkID0gYXRvbS5jb25maWcuZ2V0KCdzeW5jLXNldHRpbmdzLmdpc3RJZCcpIG9yIHByb2Nlc3MuZW52LkdJU1RfSURcbiAgICBpZiBnaXN0SWRcbiAgICAgIGdpc3RJZCA9IGdpc3RJZC50cmltKClcbiAgICByZXR1cm4gZ2lzdElkXG5cbiAgZ2V0UGVyc29uYWxBY2Nlc3NUb2tlbjogLT5cbiAgICB0b2tlbiA9IGF0b20uY29uZmlnLmdldCgnc3luYy1zZXR0aW5ncy5wZXJzb25hbEFjY2Vzc1Rva2VuJykgb3IgcHJvY2Vzcy5lbnYuR0lUSFVCX1RPS0VOXG4gICAgaWYgdG9rZW5cbiAgICAgIHRva2VuID0gdG9rZW4udHJpbSgpXG4gICAgcmV0dXJuIHRva2VuXG5cbiAgY2hlY2tNYW5kYXRvcnlTZXR0aW5nczogLT5cbiAgICBtaXNzaW5nU2V0dGluZ3MgPSBbXVxuICAgIGlmIG5vdCBAZ2V0R2lzdElkKClcbiAgICAgIG1pc3NpbmdTZXR0aW5ncy5wdXNoKFwiR2lzdCBJRFwiKVxuICAgIGlmIG5vdCBAZ2V0UGVyc29uYWxBY2Nlc3NUb2tlbigpXG4gICAgICBtaXNzaW5nU2V0dGluZ3MucHVzaChcIkdpdEh1YiBwZXJzb25hbCBhY2Nlc3MgdG9rZW5cIilcbiAgICBpZiBtaXNzaW5nU2V0dGluZ3MubGVuZ3RoXG4gICAgICBAbm90aWZ5TWlzc2luZ01hbmRhdG9yeVNldHRpbmdzKG1pc3NpbmdTZXR0aW5ncylcbiAgICByZXR1cm4gbWlzc2luZ1NldHRpbmdzLmxlbmd0aCBpcyAwXG5cbiAgY2hlY2tGb3JVcGRhdGU6IChjYj1udWxsKSAtPlxuICAgIGlmIEBnZXRHaXN0SWQoKVxuICAgICAgY29uc29sZS5kZWJ1ZygnY2hlY2tpbmcgbGF0ZXN0IGJhY2t1cC4uLicpXG4gICAgICBAY3JlYXRlQ2xpZW50KCkuZ2lzdHMuZ2V0XG4gICAgICAgIGlkOiBAZ2V0R2lzdElkKClcbiAgICAgICwgKGVyciwgcmVzKSA9PlxuICAgICAgICBpZiBlcnJcbiAgICAgICAgICBjb25zb2xlLmVycm9yIFwiZXJyb3Igd2hpbGUgcmV0cmlldmluZyB0aGUgZ2lzdC4gZG9lcyBpdCBleGlzdHM/XCIsIGVyclxuICAgICAgICAgIHRyeVxuICAgICAgICAgICAgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXJyLm1lc3NhZ2UpLm1lc3NhZ2VcbiAgICAgICAgICAgIG1lc3NhZ2UgPSAnR2lzdCBJRCBOb3QgRm91bmQnIGlmIG1lc3NhZ2UgaXMgJ05vdCBGb3VuZCdcbiAgICAgICAgICBjYXRjaCBTeW50YXhFcnJvclxuICAgICAgICAgICAgbWVzc2FnZSA9IGVyci5tZXNzYWdlXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwic3luYy1zZXR0aW5nczogRXJyb3IgcmV0cmlldmluZyB5b3VyIHNldHRpbmdzLiAoXCIrbWVzc2FnZStcIilcIlxuICAgICAgICAgIHJldHVybiBjYj8oKVxuXG4gICAgICAgIGlmIG5vdCByZXM/Lmhpc3Rvcnk/WzBdPy52ZXJzaW9uP1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IgXCJjb3VsZCBub3QgaW50ZXJwcmV0IHJlc3VsdDpcIiwgcmVzXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwic3luYy1zZXR0aW5nczogRXJyb3IgcmV0cmlldmluZyB5b3VyIHNldHRpbmdzLlwiXG4gICAgICAgICAgcmV0dXJuIGNiPygpXG5cbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcImxhdGVzdCBiYWNrdXAgdmVyc2lvbiAje3Jlcy5oaXN0b3J5WzBdLnZlcnNpb259XCIpXG4gICAgICAgIGlmIHJlcy5oaXN0b3J5WzBdLnZlcnNpb24gaXNudCBhdG9tLmNvbmZpZy5nZXQoJ3N5bmMtc2V0dGluZ3MuX2xhc3RCYWNrdXBIYXNoJylcbiAgICAgICAgICBAbm90aWZ5TmV3ZXJCYWNrdXAoKVxuICAgICAgICBlbHNlIGlmIG5vdCBhdG9tLmNvbmZpZy5nZXQoJ3N5bmMtc2V0dGluZ3MucXVpZXRVcGRhdGVDaGVjaycpXG4gICAgICAgICAgQG5vdGlmeUJhY2t1cFVwdG9kYXRlKClcblxuICAgICAgICBjYj8oKVxuICAgIGVsc2VcbiAgICAgIEBub3RpZnlNaXNzaW5nTWFuZGF0b3J5U2V0dGluZ3MoW1wiR2lzdCBJRFwiXSlcblxuICBub3RpZnlOZXdlckJhY2t1cDogLT5cbiAgICAjIHdlIG5lZWQgdGhlIGFjdHVhbCBlbGVtZW50IGZvciBkaXNwYXRjaGluZyBvbiBpdFxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgbm90aWZpY2F0aW9uID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcgXCJzeW5jLXNldHRpbmdzOiBZb3VyIHNldHRpbmdzIGFyZSBvdXQgb2YgZGF0ZS5cIixcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICBidXR0b25zOiBbe1xuICAgICAgICB0ZXh0OiBcIkJhY2t1cFwiXG4gICAgICAgIG9uRGlkQ2xpY2s6IC0+XG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LCBcInN5bmMtc2V0dGluZ3M6YmFja3VwXCJcbiAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICB9LCB7XG4gICAgICAgIHRleHQ6IFwiVmlldyBiYWNrdXBcIlxuICAgICAgICBvbkRpZENsaWNrOiAtPlxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgXCJzeW5jLXNldHRpbmdzOnZpZXctYmFja3VwXCJcbiAgICAgIH0sIHtcbiAgICAgICAgdGV4dDogXCJSZXN0b3JlXCJcbiAgICAgICAgb25EaWRDbGljazogLT5cbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsIFwic3luYy1zZXR0aW5nczpyZXN0b3JlXCJcbiAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICB9LCB7XG4gICAgICAgIHRleHQ6IFwiRGlzbWlzc1wiXG4gICAgICAgIG9uRGlkQ2xpY2s6IC0+IG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgIH1dXG5cbiAgbm90aWZ5QmFja3VwVXB0b2RhdGU6IC0+XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MgXCJzeW5jLXNldHRpbmdzOiBMYXRlc3QgYmFja3VwIGlzIGFscmVhZHkgYXBwbGllZC5cIlxuXG5cbiAgbm90aWZ5TWlzc2luZ01hbmRhdG9yeVNldHRpbmdzOiAobWlzc2luZ1NldHRpbmdzKSAtPlxuICAgIGNvbnRleHQgPSB0aGlzXG4gICAgZXJyb3JNc2cgPSBcInN5bmMtc2V0dGluZ3M6IE1hbmRhdG9yeSBzZXR0aW5ncyBtaXNzaW5nOiBcIiArIG1pc3NpbmdTZXR0aW5ncy5qb2luKCcsICcpXG5cbiAgICBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgZXJyb3JNc2csXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgYnV0dG9uczogW3tcbiAgICAgICAgdGV4dDogXCJQYWNrYWdlIHNldHRpbmdzXCJcbiAgICAgICAgb25EaWRDbGljazogLT5cbiAgICAgICAgICAgIGNvbnRleHQuZ29Ub1BhY2thZ2VTZXR0aW5ncygpXG4gICAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICB9XVxuXG4gIGJhY2t1cDogKGNiPW51bGwpIC0+XG4gICAgZmlsZXMgPSB7fVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnc3luYy1zZXR0aW5ncy5zeW5jU2V0dGluZ3MnKVxuICAgICAgZmlsZXNbXCJzZXR0aW5ncy5qc29uXCJdID0gY29udGVudDogQGdldEZpbHRlcmVkU2V0dGluZ3MoKVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnc3luYy1zZXR0aW5ncy5zeW5jUGFja2FnZXMnKVxuICAgICAgZmlsZXNbXCJwYWNrYWdlcy5qc29uXCJdID0gY29udGVudDogSlNPTi5zdHJpbmdpZnkoQGdldFBhY2thZ2VzKCksIG51bGwsICdcXHQnKVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnc3luYy1zZXR0aW5ncy5zeW5jS2V5bWFwJylcbiAgICAgIGZpbGVzW1wia2V5bWFwLmNzb25cIl0gPSBjb250ZW50OiAoQGZpbGVDb250ZW50IGF0b20ua2V5bWFwcy5nZXRVc2VyS2V5bWFwUGF0aCgpKSA/IFwiIyBrZXltYXAgZmlsZSAobm90IGZvdW5kKVwiXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdzeW5jLXNldHRpbmdzLnN5bmNTdHlsZXMnKVxuICAgICAgZmlsZXNbXCJzdHlsZXMubGVzc1wiXSA9IGNvbnRlbnQ6IChAZmlsZUNvbnRlbnQgYXRvbS5zdHlsZXMuZ2V0VXNlclN0eWxlU2hlZXRQYXRoKCkpID8gXCIvLyBzdHlsZXMgZmlsZSAobm90IGZvdW5kKVwiXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdzeW5jLXNldHRpbmdzLnN5bmNJbml0JylcbiAgICAgIGluaXRQYXRoID0gYXRvbS5nZXRVc2VySW5pdFNjcmlwdFBhdGgoKVxuICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgZmlsZXNbcGF0aC5iYXNlbmFtZShpbml0UGF0aCldID0gY29udGVudDogKEBmaWxlQ29udGVudCBpbml0UGF0aCkgPyBcIiMgaW5pdGlhbGl6YXRpb24gZmlsZSAobm90IGZvdW5kKVwiXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdzeW5jLXNldHRpbmdzLnN5bmNTbmlwcGV0cycpXG4gICAgICBmaWxlc1tcInNuaXBwZXRzLmNzb25cIl0gPSBjb250ZW50OiAoQGZpbGVDb250ZW50IGF0b20uZ2V0Q29uZmlnRGlyUGF0aCgpICsgXCIvc25pcHBldHMuY3NvblwiKSA/IFwiIyBzbmlwcGV0cyBmaWxlIChub3QgZm91bmQpXCJcblxuICAgIGZvciBmaWxlIGluIGF0b20uY29uZmlnLmdldCgnc3luYy1zZXR0aW5ncy5leHRyYUZpbGVzJykgPyBbXVxuICAgICAgZXh0ID0gZmlsZS5zbGljZShmaWxlLmxhc3RJbmRleE9mKFwiLlwiKSkudG9Mb3dlckNhc2UoKVxuICAgICAgY210c3RhcnQgPSBcIiNcIlxuICAgICAgY210c3RhcnQgPSBcIi8vXCIgaWYgZXh0IGluIFtcIi5sZXNzXCIsIFwiLnNjc3NcIiwgXCIuanNcIl1cbiAgICAgIGNtdHN0YXJ0ID0gXCIvKlwiIGlmIGV4dCBpbiBbXCIuY3NzXCJdXG4gICAgICBjbXRlbmQgPSBcIlwiXG4gICAgICBjbXRlbmQgPSBcIiovXCIgaWYgZXh0IGluIFtcIi5jc3NcIl1cbiAgICAgIGZpbGVzW2ZpbGVdID1cbiAgICAgICAgY29udGVudDogKEBmaWxlQ29udGVudCBhdG9tLmdldENvbmZpZ0RpclBhdGgoKSArIFwiLyN7ZmlsZX1cIikgPyBcIiN7Y210c3RhcnR9ICN7ZmlsZX0gKG5vdCBmb3VuZCkgI3tjbXRlbmR9XCJcblxuICAgIEBjcmVhdGVDbGllbnQoKS5naXN0cy5lZGl0XG4gICAgICBpZDogQGdldEdpc3RJZCgpXG4gICAgICBkZXNjcmlwdGlvbjogYXRvbS5jb25maWcuZ2V0ICdzeW5jLXNldHRpbmdzLmdpc3REZXNjcmlwdGlvbidcbiAgICAgIGZpbGVzOiBmaWxlc1xuICAgICwgKGVyciwgcmVzKSAtPlxuICAgICAgaWYgZXJyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgXCJlcnJvciBiYWNraW5nIHVwIGRhdGE6IFwiK2Vyci5tZXNzYWdlLCBlcnJcbiAgICAgICAgdHJ5XG4gICAgICAgICAgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXJyLm1lc3NhZ2UpLm1lc3NhZ2VcbiAgICAgICAgICBtZXNzYWdlID0gJ0dpc3QgSUQgTm90IEZvdW5kJyBpZiBtZXNzYWdlIGlzICdOb3QgRm91bmQnXG4gICAgICAgIGNhdGNoIFN5bnRheEVycm9yXG4gICAgICAgICAgbWVzc2FnZSA9IGVyci5tZXNzYWdlXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcInN5bmMtc2V0dGluZ3M6IEVycm9yIGJhY2tpbmcgdXAgeW91ciBzZXR0aW5ncy4gKFwiK21lc3NhZ2UrXCIpXCJcbiAgICAgIGVsc2VcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdzeW5jLXNldHRpbmdzLl9sYXN0QmFja3VwSGFzaCcsIHJlcy5oaXN0b3J5WzBdLnZlcnNpb24pXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzIFwic3luYy1zZXR0aW5nczogWW91ciBzZXR0aW5ncyB3ZXJlIHN1Y2Nlc3NmdWxseSBiYWNrZWQgdXAuIDxici8+PGEgaHJlZj0nXCIrcmVzLmh0bWxfdXJsK1wiJz5DbGljayBoZXJlIHRvIG9wZW4geW91ciBHaXN0LjwvYT5cIlxuICAgICAgY2I/KGVyciwgcmVzKVxuXG4gIHZpZXdCYWNrdXA6IC0+XG4gICAgU2hlbGwgPSByZXF1aXJlICdzaGVsbCdcbiAgICBnaXN0SWQgPSBAZ2V0R2lzdElkKClcbiAgICBTaGVsbC5vcGVuRXh0ZXJuYWwgXCJodHRwczovL2dpc3QuZ2l0aHViLmNvbS8je2dpc3RJZH1cIlxuXG4gIGdldFBhY2thZ2VzOiAtPlxuICAgIHBhY2thZ2VzID0gW11cbiAgICBmb3IgaSwgbWV0YWRhdGEgb2YgQF9nZXRBdmFpbGFibGVQYWNrYWdlTWV0YWRhdGFXaXRob3V0RHVwbGljYXRlcygpXG4gICAgICB7bmFtZSwgdmVyc2lvbiwgdGhlbWUsIGFwbUluc3RhbGxTb3VyY2V9ID0gbWV0YWRhdGFcbiAgICAgIHBhY2thZ2VzLnB1c2goe25hbWUsIHZlcnNpb24sIHRoZW1lLCBhcG1JbnN0YWxsU291cmNlfSlcbiAgICBfLnNvcnRCeShwYWNrYWdlcywgJ25hbWUnKVxuXG4gIF9nZXRBdmFpbGFibGVQYWNrYWdlTWV0YWRhdGFXaXRob3V0RHVwbGljYXRlczogLT5cbiAgICBwYXRoMm1ldGFkYXRhID0ge31cbiAgICBwYWNrYWdlX21ldGFkYXRhID0gYXRvbS5wYWNrYWdlcy5nZXRBdmFpbGFibGVQYWNrYWdlTWV0YWRhdGEoKVxuICAgIGZvciBwYXRoLCBpIGluIGF0b20ucGFja2FnZXMuZ2V0QXZhaWxhYmxlUGFja2FnZVBhdGhzKClcbiAgICAgIHBhdGgybWV0YWRhdGFbZnMucmVhbHBhdGhTeW5jKHBhdGgpXSA9IHBhY2thZ2VfbWV0YWRhdGFbaV1cblxuICAgIHBhY2thZ2VzID0gW11cbiAgICBmb3IgaSwgcGtnX25hbWUgb2YgYXRvbS5wYWNrYWdlcy5nZXRBdmFpbGFibGVQYWNrYWdlTmFtZXMoKVxuICAgICAgcGtnX3BhdGggPSBhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aChwa2dfbmFtZSlcbiAgICAgIGlmIHBhdGgybWV0YWRhdGFbcGtnX3BhdGhdXG4gICAgICAgIHBhY2thZ2VzLnB1c2gocGF0aDJtZXRhZGF0YVtwa2dfcGF0aF0pXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2NvdWxkIG5vdCBjb3JyZWxhdGUgcGFja2FnZSBuYW1lLCBwYXRoLCBhbmQgbWV0YWRhdGEnKVxuICAgIHBhY2thZ2VzXG5cbiAgcmVzdG9yZTogKGNiPW51bGwpIC0+XG4gICAgQGNyZWF0ZUNsaWVudCgpLmdpc3RzLmdldFxuICAgICAgaWQ6IEBnZXRHaXN0SWQoKVxuICAgICwgKGVyciwgcmVzKSA9PlxuICAgICAgaWYgZXJyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgXCJlcnJvciB3aGlsZSByZXRyaWV2aW5nIHRoZSBnaXN0LiBkb2VzIGl0IGV4aXN0cz9cIiwgZXJyXG4gICAgICAgIHRyeVxuICAgICAgICAgIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGVyci5tZXNzYWdlKS5tZXNzYWdlXG4gICAgICAgICAgbWVzc2FnZSA9ICdHaXN0IElEIE5vdCBGb3VuZCcgaWYgbWVzc2FnZSBpcyAnTm90IEZvdW5kJ1xuICAgICAgICBjYXRjaCBTeW50YXhFcnJvclxuICAgICAgICAgIG1lc3NhZ2UgPSBlcnIubWVzc2FnZVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgXCJzeW5jLXNldHRpbmdzOiBFcnJvciByZXRyaWV2aW5nIHlvdXIgc2V0dGluZ3MuIChcIittZXNzYWdlK1wiKVwiXG4gICAgICAgIHJldHVyblxuXG4gICAgICAjIGNoZWNrIGlmIHRoZSBKU09OIGZpbGVzIGFyZSBwYXJzYWJsZVxuICAgICAgZm9yIG93biBmaWxlbmFtZSwgZmlsZSBvZiByZXMuZmlsZXNcbiAgICAgICAgaWYgZmlsZW5hbWUgaXMgJ3NldHRpbmdzLmpzb24nIG9yIGZpbGVuYW1lIGlzICdwYWNrYWdlcy5qc29uJ1xuICAgICAgICAgIHRyeVxuICAgICAgICAgICAgSlNPTi5wYXJzZShmaWxlLmNvbnRlbnQpXG4gICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwic3luYy1zZXR0aW5nczogRXJyb3IgcGFyc2luZyB0aGUgZmV0Y2hlZCBKU09OIGZpbGUgJ1wiK2ZpbGVuYW1lK1wiJy4gKFwiK2UrXCIpXCJcbiAgICAgICAgICAgIGNiPygpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgY2FsbGJhY2tBc3luYyA9IGZhbHNlXG5cbiAgICAgIGZvciBvd24gZmlsZW5hbWUsIGZpbGUgb2YgcmVzLmZpbGVzXG4gICAgICAgIHN3aXRjaCBmaWxlbmFtZVxuICAgICAgICAgIHdoZW4gJ3NldHRpbmdzLmpzb24nXG4gICAgICAgICAgICBAYXBwbHlTZXR0aW5ncyAnJywgSlNPTi5wYXJzZShmaWxlLmNvbnRlbnQpIGlmIGF0b20uY29uZmlnLmdldCgnc3luYy1zZXR0aW5ncy5zeW5jU2V0dGluZ3MnKVxuXG4gICAgICAgICAgd2hlbiAncGFja2FnZXMuanNvbidcbiAgICAgICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnc3luYy1zZXR0aW5ncy5zeW5jUGFja2FnZXMnKVxuICAgICAgICAgICAgICBjYWxsYmFja0FzeW5jID0gdHJ1ZVxuICAgICAgICAgICAgICBAaW5zdGFsbE1pc3NpbmdQYWNrYWdlcyBKU09OLnBhcnNlKGZpbGUuY29udGVudCksIGNiXG4gICAgICAgICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnc3luYy1zZXR0aW5ncy5yZW1vdmVPYnNvbGV0ZVBhY2thZ2VzJylcbiAgICAgICAgICAgICAgICBAcmVtb3ZlT2Jzb2xldGVQYWNrYWdlcyBKU09OLnBhcnNlKGZpbGUuY29udGVudCksIGNiXG5cbiAgICAgICAgICB3aGVuICdrZXltYXAuY3NvbidcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMgYXRvbS5rZXltYXBzLmdldFVzZXJLZXltYXBQYXRoKCksIGZpbGUuY29udGVudCBpZiBhdG9tLmNvbmZpZy5nZXQoJ3N5bmMtc2V0dGluZ3Muc3luY0tleW1hcCcpXG5cbiAgICAgICAgICB3aGVuICdzdHlsZXMubGVzcydcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMgYXRvbS5zdHlsZXMuZ2V0VXNlclN0eWxlU2hlZXRQYXRoKCksIGZpbGUuY29udGVudCBpZiBhdG9tLmNvbmZpZy5nZXQoJ3N5bmMtc2V0dGluZ3Muc3luY1N0eWxlcycpXG5cbiAgICAgICAgICB3aGVuICdpbml0LmNvZmZlZSdcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMgYXRvbS5nZXRDb25maWdEaXJQYXRoKCkgKyBcIi9pbml0LmNvZmZlZVwiLCBmaWxlLmNvbnRlbnQgaWYgYXRvbS5jb25maWcuZ2V0KCdzeW5jLXNldHRpbmdzLnN5bmNJbml0JylcblxuICAgICAgICAgIHdoZW4gJ2luaXQuanMnXG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jIGF0b20uZ2V0Q29uZmlnRGlyUGF0aCgpICsgXCIvaW5pdC5qc1wiLCBmaWxlLmNvbnRlbnQgaWYgYXRvbS5jb25maWcuZ2V0KCdzeW5jLXNldHRpbmdzLnN5bmNJbml0JylcblxuICAgICAgICAgIHdoZW4gJ3NuaXBwZXRzLmNzb24nXG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jIGF0b20uZ2V0Q29uZmlnRGlyUGF0aCgpICsgXCIvc25pcHBldHMuY3NvblwiLCBmaWxlLmNvbnRlbnQgaWYgYXRvbS5jb25maWcuZ2V0KCdzeW5jLXNldHRpbmdzLnN5bmNTbmlwcGV0cycpXG5cbiAgICAgICAgICBlbHNlIGZzLndyaXRlRmlsZVN5bmMgXCIje2F0b20uZ2V0Q29uZmlnRGlyUGF0aCgpfS8je2ZpbGVuYW1lfVwiLCBmaWxlLmNvbnRlbnRcblxuICAgICAgYXRvbS5jb25maWcuc2V0KCdzeW5jLXNldHRpbmdzLl9sYXN0QmFja3VwSGFzaCcsIHJlcy5oaXN0b3J5WzBdLnZlcnNpb24pXG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzIFwic3luYy1zZXR0aW5nczogWW91ciBzZXR0aW5ncyB3ZXJlIHN1Y2Nlc3NmdWxseSBzeW5jaHJvbml6ZWQuXCJcblxuICAgICAgY2I/KCkgdW5sZXNzIGNhbGxiYWNrQXN5bmNcblxuICBjcmVhdGVDbGllbnQ6IC0+XG4gICAgdG9rZW4gPSBAZ2V0UGVyc29uYWxBY2Nlc3NUb2tlbigpXG5cbiAgICBpZiB0b2tlblxuICAgICAgY29uc29sZS5kZWJ1ZyBcIkNyZWF0aW5nIEdpdEh1YkFwaSBjbGllbnQgd2l0aCB0b2tlbiA9ICN7dG9rZW4uc3Vic3RyKDAsIDQpfS4uLiN7dG9rZW4uc3Vic3RyKC00LCA0KX1cIlxuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUuZGVidWcgXCJDcmVhdGluZyBHaXRIdWJBcGkgY2xpZW50IHdpdGhvdXQgdG9rZW5cIlxuXG4gICAgZ2l0aHViID0gbmV3IEdpdEh1YkFwaVxuICAgICAgdmVyc2lvbjogJzMuMC4wJ1xuICAgICAgIyBkZWJ1ZzogdHJ1ZVxuICAgICAgcHJvdG9jb2w6ICdodHRwcydcbiAgICBnaXRodWIuYXV0aGVudGljYXRlXG4gICAgICB0eXBlOiAnb2F1dGgnXG4gICAgICB0b2tlbjogdG9rZW5cbiAgICBnaXRodWJcblxuICBnZXRGaWx0ZXJlZFNldHRpbmdzOiAtPlxuICAgICMgXy5jbG9uZSgpIGRvZXNuJ3QgZGVlcCBjbG9uZSB0aHVzIHdlIGFyZSB1c2luZyBKU09OIHBhcnNlIHRyaWNrXG4gICAgc2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGF0b20uY29uZmlnLnNldHRpbmdzKSlcbiAgICBibGFja2xpc3RlZEtleXMgPSBSRU1PVkVfS0VZUy5jb25jYXQoYXRvbS5jb25maWcuZ2V0KCdzeW5jLXNldHRpbmdzLmJsYWNrbGlzdGVkS2V5cycpID8gW10pXG4gICAgZm9yIGJsYWNrbGlzdGVkS2V5IGluIGJsYWNrbGlzdGVkS2V5c1xuICAgICAgYmxhY2tsaXN0ZWRLZXkgPSBibGFja2xpc3RlZEtleS5zcGxpdChcIi5cIilcbiAgICAgIEBfcmVtb3ZlUHJvcGVydHkoc2V0dGluZ3MsIGJsYWNrbGlzdGVkS2V5KVxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzZXR0aW5ncywgbnVsbCwgJ1xcdCcpXG5cbiAgX3JlbW92ZVByb3BlcnR5OiAob2JqLCBrZXkpIC0+XG4gICAgbGFzdEtleSA9IGtleS5sZW5ndGggaXMgMVxuICAgIGN1cnJlbnRLZXkgPSBrZXkuc2hpZnQoKVxuXG4gICAgaWYgbm90IGxhc3RLZXkgYW5kIF8uaXNPYmplY3Qob2JqW2N1cnJlbnRLZXldKSBhbmQgbm90IF8uaXNBcnJheShvYmpbY3VycmVudEtleV0pXG4gICAgICBAX3JlbW92ZVByb3BlcnR5KG9ialtjdXJyZW50S2V5XSwga2V5KVxuICAgIGVsc2VcbiAgICAgIGRlbGV0ZSBvYmpbY3VycmVudEtleV1cblxuICBnb1RvUGFja2FnZVNldHRpbmdzOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oXCJhdG9tOi8vY29uZmlnL3BhY2thZ2VzL3N5bmMtc2V0dGluZ3NcIilcblxuICBhcHBseVNldHRpbmdzOiAocHJlZiwgc2V0dGluZ3MpIC0+XG4gICAgZm9yIGtleSwgdmFsdWUgb2Ygc2V0dGluZ3NcbiAgICAgIGtleSA9IGtleS5yZXBsYWNlIC9cXC4vZywgXCJcXFxcLlwiXG4gICAgICBrZXlQYXRoID0gXCIje3ByZWZ9LiN7a2V5fVwiXG4gICAgICBpc0NvbG9yID0gZmFsc2VcbiAgICAgIGlmIF8uaXNPYmplY3QodmFsdWUpXG4gICAgICAgIHZhbHVlS2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKVxuICAgICAgICBjb2xvcktleXMgPSBbJ2FscGhhJywgJ2JsdWUnLCAnZ3JlZW4nLCAncmVkJ11cbiAgICAgICAgaXNDb2xvciA9IF8uaXNFcXVhbChfLnNvcnRCeSh2YWx1ZUtleXMpLCBjb2xvcktleXMpXG4gICAgICBpZiBfLmlzT2JqZWN0KHZhbHVlKSBhbmQgbm90IF8uaXNBcnJheSh2YWx1ZSkgYW5kIG5vdCBpc0NvbG9yXG4gICAgICAgIEBhcHBseVNldHRpbmdzIGtleVBhdGgsIHZhbHVlXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUuZGVidWcgXCJjb25maWcuc2V0ICN7a2V5UGF0aFsxLi4uXX09I3t2YWx1ZX1cIlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQga2V5UGF0aFsxLi4uXSwgdmFsdWVcblxuICByZW1vdmVPYnNvbGV0ZVBhY2thZ2VzOiAocmVtYWluaW5nX3BhY2thZ2VzLCBjYikgLT5cbiAgICBpbnN0YWxsZWRfcGFja2FnZXMgPSBAZ2V0UGFja2FnZXMoKVxuICAgIG9ic29sZXRlX3BhY2thZ2VzID0gW11cbiAgICBmb3IgcGtnIGluIGluc3RhbGxlZF9wYWNrYWdlc1xuICAgICAga2VlcF9pbnN0YWxsZWRfcGFja2FnZSA9IChwIGZvciBwIGluIHJlbWFpbmluZ19wYWNrYWdlcyB3aGVuIHAubmFtZSBpcyBwa2cubmFtZSlcbiAgICAgIGlmIGtlZXBfaW5zdGFsbGVkX3BhY2thZ2UubGVuZ3RoIGlzIDBcbiAgICAgICAgb2Jzb2xldGVfcGFja2FnZXMucHVzaChwa2cpXG4gICAgaWYgb2Jzb2xldGVfcGFja2FnZXMubGVuZ3RoIGlzIDBcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvIFwiU3luYy1zZXR0aW5nczogbm8gcGFja2FnZXMgdG8gcmVtb3ZlXCJcbiAgICAgIHJldHVybiBjYj8oKVxuXG4gICAgbm90aWZpY2F0aW9ucyA9IHt9XG4gICAgc3VjY2VlZGVkID0gW11cbiAgICBmYWlsZWQgPSBbXVxuICAgIHJlbW92ZU5leHRQYWNrYWdlID0gPT5cbiAgICAgIGlmIG9ic29sZXRlX3BhY2thZ2VzLmxlbmd0aCA+IDBcbiAgICAgICAgIyBzdGFydCByZW1vdmluZyBuZXh0IHBhY2thZ2VcbiAgICAgICAgcGtnID0gb2Jzb2xldGVfcGFja2FnZXMuc2hpZnQoKVxuICAgICAgICBpID0gc3VjY2VlZGVkLmxlbmd0aCArIGZhaWxlZC5sZW5ndGggKyBPYmplY3Qua2V5cyhub3RpZmljYXRpb25zKS5sZW5ndGggKyAxXG4gICAgICAgIGNvdW50ID0gaSArIG9ic29sZXRlX3BhY2thZ2VzLmxlbmd0aFxuICAgICAgICBub3RpZmljYXRpb25zW3BrZy5uYW1lXSA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvIFwiU3luYy1zZXR0aW5nczogcmVtb3ZpbmcgI3twa2cubmFtZX0gKCN7aX0vI3tjb3VudH0pXCIsIHtkaXNtaXNzYWJsZTogdHJ1ZX1cbiAgICAgICAgZG8gKHBrZykgPT5cbiAgICAgICAgICBAcmVtb3ZlUGFja2FnZSBwa2csIChlcnJvcikgLT5cbiAgICAgICAgICAgICMgcmVtb3ZhbCBvZiBwYWNrYWdlIGZpbmlzaGVkXG4gICAgICAgICAgICBub3RpZmljYXRpb25zW3BrZy5uYW1lXS5kaXNtaXNzKClcbiAgICAgICAgICAgIGRlbGV0ZSBub3RpZmljYXRpb25zW3BrZy5uYW1lXVxuICAgICAgICAgICAgaWYgZXJyb3I/XG4gICAgICAgICAgICAgIGZhaWxlZC5wdXNoKHBrZy5uYW1lKVxuICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyBcIlN5bmMtc2V0dGluZ3M6IGZhaWxlZCB0byByZW1vdmUgI3twa2cubmFtZX1cIlxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBzdWNjZWVkZWQucHVzaChwa2cubmFtZSlcbiAgICAgICAgICAgICMgdHJpZ2dlciBuZXh0IHBhY2thZ2VcbiAgICAgICAgICAgIHJlbW92ZU5leHRQYWNrYWdlKClcbiAgICAgIGVsc2UgaWYgT2JqZWN0LmtleXMobm90aWZpY2F0aW9ucykubGVuZ3RoIGlzIDBcbiAgICAgICAgIyBsYXN0IHBhY2thZ2UgcmVtb3ZhbCBmaW5pc2hlZFxuICAgICAgICBpZiBmYWlsZWQubGVuZ3RoIGlzIDBcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyBcIlN5bmMtc2V0dGluZ3M6IGZpbmlzaGVkIHJlbW92aW5nICN7c3VjY2VlZGVkLmxlbmd0aH0gcGFja2FnZXNcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgZmFpbGVkLnNvcnQoKVxuICAgICAgICAgIGZhaWxlZFN0ciA9IGZhaWxlZC5qb2luKCcsICcpXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcgXCJTeW5jLXNldHRpbmdzOiBmaW5pc2hlZCByZW1vdmluZyBwYWNrYWdlcyAoI3tmYWlsZWQubGVuZ3RofSBmYWlsZWQ6ICN7ZmFpbGVkU3RyfSlcIiwge2Rpc21pc3NhYmxlOiB0cnVlfVxuICAgICAgICBjYj8oKVxuICAgICMgc3RhcnQgYXMgbWFueSBwYWNrYWdlIHJlbW92YWwgaW4gcGFyYWxsZWwgYXMgZGVzaXJlZFxuICAgIGNvbmN1cnJlbmN5ID0gTWF0aC5taW4gb2Jzb2xldGVfcGFja2FnZXMubGVuZ3RoLCA4XG4gICAgZm9yIGkgaW4gWzAuLi5jb25jdXJyZW5jeV1cbiAgICAgIHJlbW92ZU5leHRQYWNrYWdlKClcblxuICByZW1vdmVQYWNrYWdlOiAocGFjaywgY2IpIC0+XG4gICAgdHlwZSA9IGlmIHBhY2sudGhlbWUgdGhlbiAndGhlbWUnIGVsc2UgJ3BhY2thZ2UnXG4gICAgY29uc29sZS5pbmZvKFwiUmVtb3ZpbmcgI3t0eXBlfSAje3BhY2submFtZX0uLi5cIilcbiAgICBwYWNrYWdlTWFuYWdlciA9IG5ldyBQYWNrYWdlTWFuYWdlcigpXG4gICAgcGFja2FnZU1hbmFnZXIudW5pbnN0YWxsIHBhY2ssIChlcnJvcikgLT5cbiAgICAgIGlmIGVycm9yP1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiUmVtb3ZpbmcgI3t0eXBlfSAje3BhY2submFtZX0gZmFpbGVkXCIsIGVycm9yLnN0YWNrID8gZXJyb3IsIGVycm9yLnN0ZGVycilcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5pbmZvKFwiUmVtb3ZpbmcgI3t0eXBlfSAje3BhY2submFtZX1cIilcbiAgICAgIGNiPyhlcnJvcilcblxuICBpbnN0YWxsTWlzc2luZ1BhY2thZ2VzOiAocGFja2FnZXMsIGNiKSAtPlxuICAgIGF2YWlsYWJsZV9wYWNrYWdlcyA9IEBnZXRQYWNrYWdlcygpXG4gICAgbWlzc2luZ19wYWNrYWdlcyA9IFtdXG4gICAgZm9yIHBrZyBpbiBwYWNrYWdlc1xuICAgICAgYXZhaWxhYmxlX3BhY2thZ2UgPSAocCBmb3IgcCBpbiBhdmFpbGFibGVfcGFja2FnZXMgd2hlbiBwLm5hbWUgaXMgcGtnLm5hbWUpXG4gICAgICBpZiBhdmFpbGFibGVfcGFja2FnZS5sZW5ndGggaXMgMFxuICAgICAgICAjIG1pc3NpbmcgaWYgbm90IHlldCBpbnN0YWxsZWRcbiAgICAgICAgbWlzc2luZ19wYWNrYWdlcy5wdXNoKHBrZylcbiAgICAgIGVsc2UgaWYgbm90KCEhcGtnLmFwbUluc3RhbGxTb3VyY2UgaXMgISFhdmFpbGFibGVfcGFja2FnZVswXS5hcG1JbnN0YWxsU291cmNlKVxuICAgICAgICAjIG9yIGluc3RhbGxlZCBidXQgd2l0aCBkaWZmZXJlbnQgYXBtIGluc3RhbGwgc291cmNlXG4gICAgICAgIG1pc3NpbmdfcGFja2FnZXMucHVzaChwa2cpXG4gICAgaWYgbWlzc2luZ19wYWNrYWdlcy5sZW5ndGggaXMgMFxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8gXCJTeW5jLXNldHRpbmdzOiBubyBwYWNrYWdlcyB0byBpbnN0YWxsXCJcbiAgICAgIHJldHVybiBjYj8oKVxuXG4gICAgbm90aWZpY2F0aW9ucyA9IHt9XG4gICAgc3VjY2VlZGVkID0gW11cbiAgICBmYWlsZWQgPSBbXVxuICAgIGluc3RhbGxOZXh0UGFja2FnZSA9ID0+XG4gICAgICBpZiBtaXNzaW5nX3BhY2thZ2VzLmxlbmd0aCA+IDBcbiAgICAgICAgIyBzdGFydCBpbnN0YWxsaW5nIG5leHQgcGFja2FnZVxuICAgICAgICBwa2cgPSBtaXNzaW5nX3BhY2thZ2VzLnNoaWZ0KClcbiAgICAgICAgaSA9IHN1Y2NlZWRlZC5sZW5ndGggKyBmYWlsZWQubGVuZ3RoICsgT2JqZWN0LmtleXMobm90aWZpY2F0aW9ucykubGVuZ3RoICsgMVxuICAgICAgICBjb3VudCA9IGkgKyBtaXNzaW5nX3BhY2thZ2VzLmxlbmd0aFxuICAgICAgICBub3RpZmljYXRpb25zW3BrZy5uYW1lXSA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvIFwiU3luYy1zZXR0aW5nczogaW5zdGFsbGluZyAje3BrZy5uYW1lfSAoI3tpfS8je2NvdW50fSlcIiwge2Rpc21pc3NhYmxlOiB0cnVlfVxuICAgICAgICBkbyAocGtnKSA9PlxuICAgICAgICAgIEBpbnN0YWxsUGFja2FnZSBwa2csIChlcnJvcikgLT5cbiAgICAgICAgICAgICMgaW5zdGFsbGF0aW9uIG9mIHBhY2thZ2UgZmluaXNoZWRcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbnNbcGtnLm5hbWVdLmRpc21pc3MoKVxuICAgICAgICAgICAgZGVsZXRlIG5vdGlmaWNhdGlvbnNbcGtnLm5hbWVdXG4gICAgICAgICAgICBpZiBlcnJvcj9cbiAgICAgICAgICAgICAgZmFpbGVkLnB1c2gocGtnLm5hbWUpXG4gICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nIFwiU3luYy1zZXR0aW5nczogZmFpbGVkIHRvIGluc3RhbGwgI3twa2cubmFtZX1cIlxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBzdWNjZWVkZWQucHVzaChwa2cubmFtZSlcbiAgICAgICAgICAgICMgdHJpZ2dlciBuZXh0IHBhY2thZ2VcbiAgICAgICAgICAgIGluc3RhbGxOZXh0UGFja2FnZSgpXG4gICAgICBlbHNlIGlmIE9iamVjdC5rZXlzKG5vdGlmaWNhdGlvbnMpLmxlbmd0aCBpcyAwXG4gICAgICAgICMgbGFzdCBwYWNrYWdlIGluc3RhbGxhdGlvbiBmaW5pc2hlZFxuICAgICAgICBpZiBmYWlsZWQubGVuZ3RoIGlzIDBcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyBcIlN5bmMtc2V0dGluZ3M6IGZpbmlzaGVkIGluc3RhbGxpbmcgI3tzdWNjZWVkZWQubGVuZ3RofSBwYWNrYWdlc1wiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBmYWlsZWQuc29ydCgpXG4gICAgICAgICAgZmFpbGVkU3RyID0gZmFpbGVkLmpvaW4oJywgJylcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyBcIlN5bmMtc2V0dGluZ3M6IGZpbmlzaGVkIGluc3RhbGxpbmcgcGFja2FnZXMgKCN7ZmFpbGVkLmxlbmd0aH0gZmFpbGVkOiAje2ZhaWxlZFN0cn0pXCIsIHtkaXNtaXNzYWJsZTogdHJ1ZX1cbiAgICAgICAgY2I/KClcbiAgICAjIHN0YXJ0IGFzIG1hbnkgcGFja2FnZSBpbnN0YWxsYXRpb25zIGluIHBhcmFsbGVsIGFzIGRlc2lyZWRcbiAgICBjb25jdXJyZW5jeSA9IE1hdGgubWluIG1pc3NpbmdfcGFja2FnZXMubGVuZ3RoLCA4XG4gICAgZm9yIGkgaW4gWzAuLi5jb25jdXJyZW5jeV1cbiAgICAgIGluc3RhbGxOZXh0UGFja2FnZSgpXG5cbiAgaW5zdGFsbFBhY2thZ2U6IChwYWNrLCBjYikgLT5cbiAgICB0eXBlID0gaWYgcGFjay50aGVtZSB0aGVuICd0aGVtZScgZWxzZSAncGFja2FnZSdcbiAgICBjb25zb2xlLmluZm8oXCJJbnN0YWxsaW5nICN7dHlwZX0gI3twYWNrLm5hbWV9Li4uXCIpXG4gICAgcGFja2FnZU1hbmFnZXIgPSBuZXcgUGFja2FnZU1hbmFnZXIoKVxuICAgIHBhY2thZ2VNYW5hZ2VyLmluc3RhbGwgcGFjaywgKGVycm9yKSAtPlxuICAgICAgaWYgZXJyb3I/XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnN0YWxsaW5nICN7dHlwZX0gI3twYWNrLm5hbWV9IGZhaWxlZFwiLCBlcnJvci5zdGFjayA/IGVycm9yLCBlcnJvci5zdGRlcnIpXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUuaW5mbyhcIkluc3RhbGxlZCAje3R5cGV9ICN7cGFjay5uYW1lfVwiKVxuICAgICAgY2I/KGVycm9yKVxuXG4gIGZpbGVDb250ZW50OiAoZmlsZVBhdGgpIC0+XG4gICAgdHJ5XG4gICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCB7ZW5jb2Rpbmc6ICd1dGY4J30pIG9yIG51bGxcbiAgICBjYXRjaCBlXG4gICAgICBjb25zb2xlLmVycm9yIFwiRXJyb3IgcmVhZGluZyBmaWxlICN7ZmlsZVBhdGh9LiBQcm9iYWJseSBkb2Vzbid0IGV4aXN0LlwiLCBlXG4gICAgICBudWxsXG5cbiAgaW5wdXRGb3JrR2lzdElkOiAtPlxuICAgIEZvcmtHaXN0SWRJbnB1dFZpZXcgPz0gcmVxdWlyZSAnLi9mb3JrLWdpc3RpZC1pbnB1dC12aWV3J1xuICAgIEBpbnB1dFZpZXcgPSBuZXcgRm9ya0dpc3RJZElucHV0VmlldygpXG4gICAgQGlucHV0Vmlldy5zZXRDYWxsYmFja0luc3RhbmNlKHRoaXMpXG5cbiAgZm9ya0dpc3RJZDogKGZvcmtJZCkgLT5cbiAgICBAY3JlYXRlQ2xpZW50KCkuZ2lzdHMuZm9ya1xuICAgICAgaWQ6IGZvcmtJZFxuICAgICwgKGVyciwgcmVzKSAtPlxuICAgICAgaWYgZXJyXG4gICAgICAgIHRyeVxuICAgICAgICAgIG1lc3NhZ2UgPSBKU09OLnBhcnNlKGVyci5tZXNzYWdlKS5tZXNzYWdlXG4gICAgICAgICAgbWVzc2FnZSA9IFwiR2lzdCBJRCBOb3QgRm91bmRcIiBpZiBtZXNzYWdlIGlzIFwiTm90IEZvdW5kXCJcbiAgICAgICAgY2F0Y2ggU3ludGF4RXJyb3JcbiAgICAgICAgICBtZXNzYWdlID0gZXJyLm1lc3NhZ2VcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIFwic3luYy1zZXR0aW5nczogRXJyb3IgZm9ya2luZyBzZXR0aW5ncy4gKFwiK21lc3NhZ2UrXCIpXCJcbiAgICAgICAgcmV0dXJuIGNiPygpXG5cbiAgICAgIGlmIHJlcy5pZFxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQgXCJzeW5jLXNldHRpbmdzLmdpc3RJZFwiLCByZXMuaWRcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MgXCJzeW5jLXNldHRpbmdzOiBGb3JrZWQgc3VjY2Vzc2Z1bGx5IHRvIHRoZSBuZXcgR2lzdCBJRCBcIiArIHJlcy5pZCArIFwiIHdoaWNoIGhhcyBiZWVuIHNhdmVkIHRvIHlvdXIgY29uZmlnLlwiXG4gICAgICBlbHNlXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcInN5bmMtc2V0dGluZ3M6IEVycm9yIGZvcmtpbmcgc2V0dGluZ3NcIlxuXG4gICAgICBjYj8oKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bmNTZXR0aW5nc1xuIl19
