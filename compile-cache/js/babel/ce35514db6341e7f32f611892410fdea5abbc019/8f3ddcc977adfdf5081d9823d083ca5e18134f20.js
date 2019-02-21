Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _stripJsonComments = require('strip-json-comments');

var _stripJsonComments2 = _interopRequireDefault(_stripJsonComments);

var _ignore = require('ignore');

var _ignore2 = _interopRequireDefault(_ignore);

var _sshConfig = require('ssh-config');

var _sshConfig2 = _interopRequireDefault(_sshConfig);

var _helpers = require('./helpers');

var _directory = require('./directory');

var _directory2 = _interopRequireDefault(_directory);

var _progress = require('./progress');

var _progress2 = _interopRequireDefault(_progress);

var _connectorsFtp = require('./connectors/ftp');

var _connectorsFtp2 = _interopRequireDefault(_connectorsFtp);

var _connectorsSftp = require('./connectors/sftp');

var _connectorsSftp2 = _interopRequireDefault(_connectorsSftp);

var _dialogsPromptPassDialog = require('./dialogs/prompt-pass-dialog');

var _dialogsPromptPassDialog2 = _interopRequireDefault(_dialogsPromptPassDialog);

'use babel';

var SSH2_ALGORITHMS = require('ssh2-streams').constants.ALGORITHMS;

var Client = (function () {
  function Client() {
    _classCallCheck(this, Client);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();

    var self = this;
    self.info = null;
    self.connector = null;
    self.current = null;
    self.queue = [];

    self.configFileName = '.ftpconfig';
    self.ignoreBaseName = '.ftpignore';
    self.ignoreFilter = false;
    self.watchers = [];

    self.root = new _directory2['default']({
      name: '/',
      path: '/',
      client: this,
      isExpanded: true
    });

    self.status = 'NOT_CONNECTED'; // Options NOT_CONNECTED, CONNECTING, CONNECTED

    self.watch = {
      watcher: null,
      files: [],
      addListeners: function addListeners() {
        var watchData = (0, _helpers.getObject)({
          keys: ['info', 'watch'],
          obj: self
        });
        if (watchData === null || watchData === false) return;
        if (typeof watchData === 'string') watchData = [watchData];

        if (!Array.isArray(watchData) || watchData.length === 0) return;

        var ig = (0, _ignore2['default'])().add(watchData);

        (0, _atom.watchPath)(self.getProjectPath(), {}, function (events) {
          Object.keys(events).forEach(function (key) {
            var event = events[key];
            var relativePath = _path2['default'].relative(self.getProjectPath(), event.path);

            if (!ig.ignores(relativePath)) return;
            self.watch.files.push(relativePath);

            if (event.action === 'modified' && !relativePath.match(/(^|[/\\])\../)) {
              self.watch.queueUpload.apply(self, [event.path, function () {
                if (atom.config.get('remote-ftp.notifications.enableWatchFileChange')) {
                  atom.notifications.addInfo('Remote FTP: Change detected in: ' + event.path, {
                    dismissable: false
                  });
                }

                var index = self.watch.files.indexOf(relativePath);

                if (index > -1) {
                  delete self.watch.files[index];
                }
              }]);
            }
          });
        }).then(function (disposable) {
          return self.watchers.push(disposable);
        });

        atom.notifications.addInfo('Remote FTP: Added watch listeners.', {
          dismissable: false
        });
      },
      removeListeners: function removeListeners() {
        if (self.watchers.length > 0) {
          self.watchers.forEach(function (watcher) {
            return watcher.dispose();
          });

          atom.notifications.addInfo('Remote FTP: Stopped watch listeners.', {
            dismissable: false
          });

          self.watchers = [];
        }
      },
      queue: {},
      queueUpload: function queueUpload(fileName, callback) {
        var timeoutDuration = isNaN(parseInt(self.info.watchTimeout, 10)) === true ? 500 : parseInt(self.info.watchTimeout, 10);

        function scheduleUpload(file) {
          self.watch.queue[file] = setTimeout(function () {
            self.upload(file, callback);
          }, timeoutDuration);
        }

        if (self.watch.queue[fileName] !== null) {
          clearTimeout(self.watch.queue[fileName]);
          self.watch.queue[fileName] = null;
        }

        scheduleUpload(fileName);
      }

    };

    self.watch.addListeners = self.watch.addListeners.bind(self);
    self.watch.removeListeners = self.watch.removeListeners.bind(self);

    self.onDidConnected(self.watch.addListeners);
    self.onDidDisconnected(self.watch.removeListeners);

    self.events();
  }

  _createClass(Client, [{
    key: 'onDidChangeStatus',
    value: function onDidChangeStatus(callback) {
      var _this = this;

      this.subscriptions.add(this.emitter.on('change-status', function () {
        callback(_this.status);
      }));
    }
  }, {
    key: 'onDidConnected',
    value: function onDidConnected(callback) {
      var _this2 = this;

      this.subscriptions.add(this.emitter.on('connected', function () {
        callback(_this2.status);
        _this2.emitter.emit('change-status');
      }));
    }
  }, {
    key: 'onDidDisconnected',
    value: function onDidDisconnected(callback) {
      var _this3 = this;

      this.subscriptions.add(this.emitter.on('disconnected', function () {
        callback(_this3.status);
        _this3.emitter.emit('change-status');
      }));
    }
  }, {
    key: 'onDidClosed',
    value: function onDidClosed(callback) {
      var _this4 = this;

      this.subscriptions.add(this.emitter.on('closed', function () {
        callback(_this4.status);
      }));
    }
  }, {
    key: 'onDidDebug',
    value: function onDidDebug(callback) {
      this.subscriptions.add(this.emitter.on('debug', function (message) {
        callback(message);
      }));
    }
  }, {
    key: 'onDidQueueChanged',
    value: function onDidQueueChanged(callback) {
      this.subscriptions.add(this.emitter.on('queue-changed', function () {
        callback();
      }));
    }
  }, {
    key: 'events',
    value: function events() {
      var _this5 = this;

      this.subscriptions.add(atom.config.onDidChange('remote-ftp.dev.debugResponse', function (values) {
        _this5.watchDebug(values.newValue);
      }), atom.config.onDidChange('remote-ftp.tree.showProjectName', function () {
        _this5.setProjectName();
      }));
    }
  }, {
    key: 'setProjectName',
    value: function setProjectName() {
      if (typeof this.ftpConfigPath === 'undefined') return;

      var projectRoot = atom.config.get('remote-ftp.tree.showProjectName');
      var $rootName = (0, _atomSpacePenViews.$)('.ftptree-view .project-root > .header span');

      var rootName = '/';

      if (typeof this.info[projectRoot] !== 'undefined') {
        rootName = this.info[projectRoot];
      }

      this.root.name = rootName;
      $rootName.text(rootName);
    }
  }, {
    key: 'readConfig',
    value: function readConfig(callback) {
      var _this6 = this;

      var CSON = undefined;

      var error = function error(err) {
        if (typeof callback === 'function') callback.apply(_this6, [err]);
      };
      this.info = null;
      this.ftpConfigPath = this.getConfigPath();

      var csonConfig = new _atom.File(this.getFilePath(this.ftpConfigPath + '.cson'));

      if (this.ftpConfigPath === false) throw new Error('Remote FTP: getConfigPath returned false, but expected a string');

      var modifyConfig = function modifyConfig(json) {
        _this6.info = json;
        _this6.root.name = '';
        if (_this6.info.remote) {
          _this6.root.path = '/' + _this6.info.remote.replace(/^\/+/, '');
        } else {
          _this6.root.path = '/';
        }

        if (_this6.info.privatekey) {
          _this6.info.privatekey = (0, _helpers.resolveHome)(_this6.info.privatekey);
        }

        _this6.setProjectName();
      };

      var extendsConfig = function extendsConfig(json, err) {
        if (json !== null && typeof callback === 'function') {
          var sshConfigPath = atom.config.get('remote-ftp.connector.sshConfigPath');

          if (sshConfigPath && _this6.info.protocol === 'sftp') {
            var configPath = _path2['default'].normalize(sshConfigPath.replace('~', _os2['default'].homedir()));

            _fsPlus2['default'].readFile(configPath, 'utf8', function (fileErr, conf) {
              if (fileErr) return error(fileErr);

              var config = _sshConfig2['default'].parse(conf);

              var section = config.find({
                Host: _this6.info.host
              });

              if (section !== null) {
                (function () {
                  var mapping = new Map([['HostName', 'host'], ['Port', 'port'], ['User', 'user'], ['IdentityFile', 'privatekey'], ['ServerAliveInterval', 'keepalive'], ['ConnectTimeout', 'connTimeout']]);

                  section.config.forEach(function (line) {
                    var key = mapping.get(line.param);

                    if (typeof key !== 'undefined') {
                      _this6.info[key] = line.value;
                    }
                  });
                })();
              }

              return callback.apply(_this6, [err, _this6.info]);
            });
          } else {
            callback.apply(_this6, [err, json]);
          }
        }
      };

      if (csonConfig.existsSync()) {
        var _ret2 = (function () {
          if (typeof CSON === 'undefined') {
            CSON = require('cson-parser');
          }

          var json = null;

          csonConfig.read(true).then(function (content) {
            try {
              json = CSON.parse(content);
              modifyConfig(json);
            } catch (e) {
              atom.notifications.addError('Could not process `' + _this6.configFileName + '`.', {
                detail: e,
                dismissable: false
              });
            }

            extendsConfig(json, null);
          });

          return {
            v: undefined
          };
        })();

        if (typeof _ret2 === 'object') return _ret2.v;
      }

      _fsPlus2['default'].readFile(this.ftpConfigPath, 'utf8', function (err, res) {
        if (err) return error(err);

        var data = (0, _stripJsonComments2['default'])(res);
        var json = null;
        if ((0, _helpers.validateConfig)(data, _this6.configFileName)) {
          try {
            json = JSON.parse(data);

            modifyConfig(json);
          } catch (e) {
            atom.notifications.addError('Could not process `' + _this6.configFileName + '`.', {
              detail: e,
              dismissable: false
            });
          }
        }

        extendsConfig(json, err);

        return true;
      });
    }
  }, {
    key: 'getFilePath',
    value: function getFilePath(relativePath) {
      var projectPath = this.getProjectPath();
      if (projectPath === false) return false;
      return _path2['default'].resolve(projectPath, relativePath);
    }
  }, {
    key: 'getProjectPath',
    value: function getProjectPath() {
      var projectPath = null;

      if ((0, _helpers.multipleHostsEnabled)() === true) {
        var $currentProject = (0, _atomSpacePenViews.$)('.tree-view .project-root');

        projectPath = $currentProject.find('> .header span.name').data('path');
      } else {
        var firstDirectory = atom.project.getDirectories()[0];
        if (firstDirectory != null) projectPath = firstDirectory.path;
      }

      if (projectPath != null) {
        this.projectPath = projectPath;
        return projectPath;
      }

      return false;
    }
  }, {
    key: 'getConfigPath',
    value: function getConfigPath() {
      if (!(0, _helpers.hasProject)()) return false;

      return this.getFilePath('./' + this.configFileName);
    }
  }, {
    key: 'updateIgnore',
    value: function updateIgnore() {
      var ignorePath = this.getFilePath(this.ignoreBaseName);
      var ignoreFile = new _atom.File(ignorePath);

      if (!ignoreFile.existsSync()) {
        return false;
      }

      this.ignoreFilter = (0, _ignore2['default'])().add(ignoreFile.readSync(true));

      return true;
    }
  }, {
    key: 'checkIgnore',
    value: function checkIgnore(filepath) {
      var relativeFilepath = Client.toRelative(filepath);

      var ignoreIsActual = true;

      // updateIgnore when not set or .ftpignore is saved
      if (!this.ignoreFilter || relativeFilepath === this.getFilePath(this.ignoreBaseName)) {
        ignoreIsActual = this.updateIgnore();
      }

      if (ignoreIsActual && this.ignoreFilter.ignores(relativeFilepath)) {
        return true;
      }

      return false;
    }
  }, {
    key: 'isConnected',
    value: function isConnected() {
      return this.connector && this.connector.isConnected();
    }
  }, {
    key: 'onceConnected',
    value: function onceConnected(onconnect) {
      var _this7 = this;

      if (this.connector && this.connector.isConnected()) {
        onconnect.apply(this);
        return true;
      } else if (typeof onconnect === 'function') {
        if (this.status === 'NOT_CONNECTED') {
          this.status = 'CONNECTING';
          this.readConfig(function (err) {
            if (err !== null) {
              _this7.status = 'NOT_CONNECTED';
              // NOTE: Remove notification as it will just say there
              // is no ftpconfig if none in directory all the time
              // atom.notifications.addError("Remote FTP: " + err);
              return;
            }
            _this7.connect(true);
          });
        }

        this.emitter.once('connected', onconnect);
        return false;
      }
      console.warn('Remote FTP: Not connected and typeof onconnect is ' + typeof onconnect);
      return false;
    }
  }, {
    key: 'connect',
    value: function connect(reconnect) {
      if (reconnect !== true) this.disconnect();
      if (this.isConnected()) return;
      if (!this.info) return;
      if (this.info.promptForPass === true) {
        this.promptForPass();
      } else if (this.info.keyboardInteractive === true) {
        this.promptForKeyboardInteractive();
      } else if (this.info.keyboardInteractiveForPass === true) {
        this.info.verifyCode = this.info.pass;
        this.doConnect();
      } else {
        this.doConnect();
      }
    }
  }, {
    key: 'doConnect',
    value: function doConnect() {
      var self = this;

      atom.notifications.addInfo('Remote FTP: Connecting...', {
        dismissable: false
      });

      var info = undefined;
      switch (self.info.protocol) {
        case 'ftp':
          {
            info = {
              host: self.info.host || '',
              port: self.info.port || 21,
              user: self.info.user || '',
              password: self.info.pass || '',
              secure: self.info.secure || '',
              secureOptions: self.info.secureOptions || '',
              connTimeout: self.info.timeout || 10000,
              pasvTimeout: self.info.timeout || 10000,
              forcePasv: self.info.forcePasv || true,
              keepalive: self.info.keepalive === undefined ? 10000 : self.info.keepalive, // long version, because 0 is a valid value
              debug: function debug(str) {
                var log = str.match(/^\[connection\] (>|<) '(.*?)(\\r\\n)?'$/);
                if (!log) return;
                if (log[2].match(/^PASS /)) log[2] = 'PASS ******';
                self.emitter.emit('debug', log[1] + ' ' + log[2]);
              }
            };
            self.connector = new _connectorsFtp2['default'](self);
            break;
          }

        case 'sftp':
          {
            info = {
              host: self.info.host || '',
              port: self.info.port || 22,
              username: self.info.user || '',
              readyTimeout: self.info.connTimeout || 10000,
              keepaliveInterval: self.info.keepalive || 10000,
              verifyCode: self.info.verifyCode || ''
            };

            if (self.info.pass) info.password = self.info.pass;

            if (self.info.privatekey) {
              self.info.privatekey = (0, _helpers.resolveHome)(self.info.privatekey);

              try {
                var pk = _fsPlus2['default'].readFileSync(self.info.privatekey);
                info.privateKey = pk;
              } catch (err) {
                atom.notifications.addError('Remote FTP: Could not read privateKey file', {
                  detail: err,
                  dismissable: true
                });
              }
            }

            if (self.info.passphrase) info.passphrase = self.info.passphrase;

            if (self.info.agent) info.agent = self.info.agent;

            if (self.info.agent === 'env') info.agent = process.env.SSH_AUTH_SOCK;

            if (self.info.hosthash) info.hostHash = self.info.hosthash;

            if (self.info.ignorehost) {
              // NOTE: hostVerifier doesn't run at all if it's not a function.
              // Allows you to skip hostHash option in ssh2 0.5+
              info.hostVerifier = false;
            }

            info.algorithms = {
              kex: SSH2_ALGORITHMS.SUPPORTED_KEX,
              cipher: SSH2_ALGORITHMS.SUPPORTED_CIPHER,
              serverHostKey: SSH2_ALGORITHMS.SUPPORTED_SERVER_HOST_KEY,
              hmac: SSH2_ALGORITHMS.SUPPORTED_HMAC,
              compress: SSH2_ALGORITHMS.SUPPORTED_COMPRESS
            };

            info.filePermissions = self.info.filePermissions;
            info.remoteCommand = self.info.remoteCommand;
            info.remoteShell = self.info.remoteShell;

            if (self.info.keyboardInteractive) info.tryKeyboard = true;
            if (self.info.keyboardInteractiveForPass) info.tryKeyboard = true;

            self.connector = new _connectorsSftp2['default'](self);
            break;
          }

        default:
          throw new Error('No `protocol` found in connection credential. Please recreate .ftpconfig file from Packages -> Remote FTP -> Create (S)FTP config file.');
      }

      self.connector.connect(info, function () {
        if (self.root.status !== 1) self.root.open();
        self.status = 'CONNECTED';
        self.emitter.emit('connected');

        atom.notifications.addSuccess('Remote FTP: Connected', {
          dismissable: false
        });
      });

      self.connector.on('closed', function (action) {
        if (self.status === 'NOT_CONNECTED') return;

        self.status = 'NOT_CONNECTED';
        self.emitter.emit('closed');

        atom.notifications.addInfo('Remote FTP: Connection closed', {
          dismissable: false
        });

        self.disconnect(function () {
          if (action === 'RECONNECT') self.connect(true);
        });
      });

      self.connector.on('ended', function () {
        self.emitter.emit('ended');
      });

      self.connector.on('error', function (err, code) {
        if (code === 421 || code === 'ECONNRESET') return;
        atom.notifications.addError('Remote FTP: Connection failed', {
          detail: err,
          dismissable: false
        });
      });

      self.watchDebug(atom.config.get('remote-ftp.dev.debugResponse'));
    }
  }, {
    key: 'watchDebug',
    value: function watchDebug(isWatching) {
      this.emitter.off('debug', _helpers.logger);

      if (isWatching) {
        this.emitter.on('debug', _helpers.logger);
      } else {
        this.emitter.off('debug', _helpers.logger);
      }
    }
  }, {
    key: 'disconnect',
    value: function disconnect(cb) {
      if (this.connector) {
        this.connector.disconnect();
        delete this.connector;
        this.connector = null;
      }

      if (this.root) {
        this.root.status = 0;
        this.root.destroy();
      }

      this.watch.removeListeners.apply(this);

      this.current = null;
      this.queue = [];

      this.status = 'NOT_CONNECTED';
      this.emitter.emit('disconnected');

      if (typeof cb === 'function') cb();

      return this;
    }
  }, {
    key: 'toRemote',
    value: function toRemote(local) {
      return _path2['default'].join(this.info.remote, atom.project.relativize(local)).replace(/\\/g, '/');
    }
  }, {
    key: 'toLocal',
    value: function toLocal(remote) {
      var target = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      var projectPath = this.getProjectPath();
      var remoteLength = this.info.remote.length;

      if (projectPath === false) return false;
      if (typeof remote !== 'string') {
        throw new Error('Remote FTP: remote must be a string, was passed ' + typeof remote);
      }

      var path = null;
      if (remoteLength > 1) {
        path = './' + remote.substr(this.info.remote.length);
      } else {
        path = './' + remote;
      }

      return _path2['default'].resolve(_path2['default'].join(projectPath, target, './' + path.replace(/^\/+/, '')));
    }
  }, {
    key: '_next',
    value: function _next() {
      if (!this.isConnected()) return;

      this.current = this.queue.shift();

      if (this.current) this.current[1].apply(this, [this.current[2]]);

      if (typeof atom.project.remoteftp.emitter !== 'undefined') {
        atom.project.remoteftp.emitter.emit('queue-changed');
      }
    }
  }, {
    key: '_enqueue',
    value: function _enqueue(func, desc) {
      var progress = new _progress2['default']();

      this.queue.push([desc, func, progress]);
      if (this.queue.length === 1 && !this.current) this._next();else this.emitter.emit('queue-changed');

      return progress;
    }
  }, {
    key: 'abort',
    value: function abort() {
      var _this8 = this;

      if (this.isConnected()) {
        this.connector.abort(function () {
          _this8._next();
        });
      }

      return this;
    }
  }, {
    key: 'abortAll',
    value: function abortAll() {
      this.current = null;
      this.queue = [];

      if (this.isConnected()) {
        this.connector.abort();
      }

      this.emitter.emit('queue-changed');

      return this;
    }
  }, {
    key: 'list',
    value: function list(remote, recursive, callback) {
      var _this9 = this;

      this.onceConnected(function () {
        _this9._enqueue(function () {
          _this9.connector.list(remote, recursive, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this9._next();
          });
        }, 'Listing ' + (recursive ? 'recursively ' : '') + _path2['default'].basename(remote));
      });

      return this;
    }
  }, {
    key: 'downloadTo',
    value: function downloadTo(remotePath, targetPath, recursive, callback) {
      var _this10 = this;

      if (this.checkIgnore(remotePath)) {
        this._next();
        return;
      }

      this.onceConnected(function () {
        _this10._enqueue(function (progress) {
          _this10.connector.getTo(remotePath, targetPath, recursive, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this10._next();
          }, function (percent) {
            progress.setProgress(percent);
          });
        }, 'Downloading ' + _path2['default'].basename(remotePath));
      });
    }
  }, {
    key: 'download',
    value: function download(remote, recursive, callback) {
      var _this11 = this;

      if (this.checkIgnore(remote)) {
        this._next();
        return;
      }

      this.onceConnected(function () {
        _this11._enqueue(function (progress) {
          _this11.connector.get(remote, recursive, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this11._next();
          }, function (percent) {
            progress.setProgress(percent);
          });
        }, 'Downloading ' + _path2['default'].basename(remote));
      });
    }
  }, {
    key: 'upload',
    value: function upload(local, callback) {
      var _this12 = this;

      if (this.checkIgnore(local)) {
        this._next();
        return;
      }

      this.onceConnected(function () {
        _this12._enqueue(function (progress) {
          _this12.connector.put(local, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this12._next();
          }, function (percent) {
            progress.setProgress(percent);
          });
        }, 'Uploading ' + _path2['default'].basename(local));
      });
    }
  }, {
    key: 'uploadTo',
    value: function uploadTo(local, remote, callback) {
      var _this13 = this;

      if (this.checkIgnore(local)) {
        this._next();
        return;
      }

      this.onceConnected(function () {
        _this13._enqueue(function (progress) {
          _this13.connector.putTo(local, remote, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this13._next();
          }, function (percent) {
            progress.setProgress(percent);
          });
        }, 'Uploading ' + _path2['default'].basename(local));
      });
    }
  }, {
    key: 'syncRemoteFileToLocal',
    value: function syncRemoteFileToLocal(remote, callback) {
      var _this14 = this;

      if (this.checkIgnore(remote)) {
        this._next();
        return;
      }

      // verify active connection
      if (this.status === 'CONNECTED') {
        this._enqueue(function () {
          _this14.connector.get(remote, false, function (err) {
            if (err) {
              if (typeof callback === 'function') callback.apply(null, [err]);
              return;
            }
            _this14._next();
          });
        }, 'Sync ' + _path2['default'].basename(remote));
      } else {
        atom.notifications.addError('Remote FTP: Not connected!', {
          dismissable: true
        });
      }
    }
  }, {
    key: 'syncRemoteDirectoryToLocal',
    value: function syncRemoteDirectoryToLocal(remote, isFile, callback) {
      var _this15 = this;

      // TODO: Tidy up this function. Does ( probably ) not need to list from the connector
      // if isFile === true. Will need to check to see if that doesn't break anything before
      // implementing. In the meantime current solution should work for #453
      //
      // TODO: This method only seems to be referenced by the context menu command so gracefully
      // removing list without breaking this method should be do-able. 'isFile' is always sending
      // false at the moment inside commands.js
      if (!remote) return;

      // Check ignores
      if (remote !== '/' && this.checkIgnore(remote)) {
        this._next();
        return;
      }

      this._enqueue(function () {
        var local = _this15.toLocal(remote);

        _this15.connector.list(remote, true, function (err, remotes) {
          if (err) {
            if (typeof callback === 'function') callback.apply(null, [err]);

            return;
          }

          // Create folder if no exists in local
          (0, _helpers.mkdirSyncRecursive)(local);

          // remove ignored remotes
          if (_this15.ignoreFilter) {
            for (var i = remotes.length - 1; i >= 0; i--) {
              if (_this15.checkIgnore(remotes[i].name)) {
                remotes.splice(i, 1); // remove from list
              }
            }
          }

          (0, _helpers.traverseTree)(local, function (locals) {
            var error = function error() {
              if (typeof callback === 'function') callback.apply(null);
              _this15._next();
            };

            var n = function n() {
              var remoteOne = remotes.shift();
              var loc = undefined;

              if (!remoteOne) return error();

              var toLocal = _this15.toLocal(remoteOne.name);
              loc = null;

              for (var a = 0, b = locals.length; a < b; ++a) {
                if (locals[a].name === toLocal) {
                  loc = locals[a];
                  break;
                }
              }

              // Download only if not present on local or size differ
              if (!loc || remoteOne.size !== loc.size) {
                _this15.connector.get(remoteOne.name, true, function () {
                  return n();
                });
              } else {
                n();
              }

              return true;
            };

            if (remotes.length === 0) {
              _this15.connector.get(remote, false, function () {
                return n();
              });
              return;
            }
            n();
          });
        }, isFile);
        // NOTE: Added isFile to end of call to prevent breaking any functions
        // that already use list command. Is file is used only for ftp connector
        // as it will list a file as a file of itself unlinke with sftp which
        // will throw an error.
      }, 'Sync ' + _path2['default'].basename(remote));
    }
  }, {
    key: 'syncLocalFileToRemote',
    value: function syncLocalFileToRemote(local, callback) {
      var _this16 = this;

      // Check ignores
      if (this.checkIgnore(local)) {
        this._next();
        return;
      }

      // verify active connection
      if (this.status === 'CONNECTED') {
        // progress
        this._enqueue(function () {
          _this16.connector.put(local, function (err) {
            if (err) {
              if (typeof callback === 'function') callback.apply(null, [err]);
              return;
            }
            _this16._next();
          });
        }, 'Sync: ' + _path2['default'].basename(local));
      } else {
        atom.notifications.addError('Remote FTP: Not connected!', {
          dismissable: true
        });
      }
    }
  }, {
    key: 'syncLocalDirectoryToRemote',
    value: function syncLocalDirectoryToRemote(local, callback) {
      var _this17 = this;

      // Check ignores
      if (this.checkIgnore(local)) {
        this._next();
        return;
      }

      // verify active connection
      if (this.status === 'CONNECTED') {
        this._enqueue(function () {
          var remote = _this17.toRemote(local);

          _this17.connector.list(remote, true, function (err, remotes) {
            if (err) {
              if (typeof callback === 'function') callback.apply(null, [err]);
              return;
            }

            // remove ignored remotes
            if (_this17.ignoreFilter) {
              for (var i = remotes.length - 1; i >= 0; i--) {
                if (_this17.checkIgnore(remotes[i].name)) {
                  remotes.splice(i, 1); // remove from list
                }
              }
            }

            (0, _helpers.traverseTree)(local, function (locals) {
              var error = function error() {
                if (typeof callback === 'function') callback.apply(null);
                _this17._next();
              };

              // remove ignored locals
              if (_this17.ignoreFilter) {
                for (var i = locals.length - 1; i >= 0; i--) {
                  if (_this17.checkIgnore(locals[i].name)) {
                    locals.splice(i, 1); // remove from list
                  }
                }
              }

              var n = function n() {
                var nLocal = locals.shift();
                var nRemote = undefined;

                if (!nLocal) {
                  return error();
                }

                var toRemote = _this17.toRemote(nLocal.name);
                nRemote = null;

                for (var a = 0, b = remotes.length; a < b; ++a) {
                  if (remotes[a].name === toRemote) {
                    nRemote = remotes[a];
                    break;
                  }
                }

                // NOTE: Upload only if not present on remote or size differ
                if (!nRemote) {
                  if (nLocal.type === 'd') {
                    _this17.connector.mkdir(toRemote, false, function () {
                      return n();
                    });
                  } else if (nLocal.type === 'f') {
                    _this17.connector.put(nLocal.name, function () {
                      return n();
                    });
                  } else {
                    n();
                  }
                } else if (nRemote.size !== nLocal.size && nLocal.type === 'f') {
                  _this17.connector.put(nLocal.name, function () {
                    return n();
                  });
                } else {
                  n();
                }

                return true;
              };

              n();
            });
          });
        }, 'Sync ' + _path2['default'].basename(local));
      } else {
        atom.notifications.addError('Remote FTP: Not connected!', {
          dismissable: true
        });
      }
    }
  }, {
    key: 'mkdir',
    value: function mkdir(remote, recursive, callback) {
      var _this18 = this;

      this.onceConnected(function () {
        _this18._enqueue(function () {
          _this18.connector.mkdir(remote, recursive, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this18._next();
          });
        }, 'Creating folder ' + _path2['default'].basename(remote));
      });

      return this;
    }
  }, {
    key: 'mkfile',
    value: function mkfile(remote, callback) {
      var _this19 = this;

      this.onceConnected(function () {
        _this19._enqueue(function () {
          _this19.connector.mkfile(remote, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this19._next();
          });
        }, 'Creating file ' + _path2['default'].basename(remote));
      });

      return this;
    }
  }, {
    key: 'rename',
    value: function rename(source, dest, callback) {
      var _this20 = this;

      this.onceConnected(function () {
        _this20._enqueue(function () {
          _this20.connector.rename(source, dest, function (err) {
            if (typeof callback === 'function') callback.apply(null, [err]);
            _this20._next();
          });
        }, 'Renaming ' + _path2['default'].basename(source));
      });
      return this;
    }
  }, {
    key: 'delete',
    value: function _delete(remote, callback) {
      var _this21 = this;

      this.onceConnected(function () {
        _this21._enqueue(function () {
          _this21.connector['delete'](remote, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this21._next();
          });
        }, 'Deleting ' + _path2['default'].basename(remote));
      });

      return this;
    }
  }, {
    key: 'site',
    value: function site(command, callback) {
      var _this22 = this;

      this.onceConnected(function () {
        _this22.connector.site(command, function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if (typeof callback === 'function') callback(args);
        });
      });
    }
  }, {
    key: 'chmod',
    value: function chmod(path, mode, callback) {
      var _this23 = this;

      this.onceConnected(function () {
        _this23.connector.chmod(path, mode, callback);
      });
    }
  }, {
    key: 'chown',
    value: function chown(path, uid, gid, callback) {
      var _this24 = this;

      this.onceConnected(function () {
        if (typeof gid === 'function') {
          _this24.connector.chown(path, uid, gid);
        } else {
          _this24.connector.chown(path, uid, gid, callback);
        }
      });
    }
  }, {
    key: 'chgrp',
    value: function chgrp(path, uid, gid, callback) {
      var _this25 = this;

      this.onceConnected(function () {
        _this25.connector.chgrp(path, uid, gid, callback);
      });
    }
  }, {
    key: 'promptForPass',
    value: function promptForPass() {
      var _this26 = this;

      var dialog = new _dialogsPromptPassDialog2['default']('', true);
      dialog.on('dialog-done', function (e, pass) {
        _this26.info.pass = pass;
        _this26.info.passphrase = pass;
        dialog.close();
        _this26.doConnect();
      });
      dialog.attach();
    }
  }, {
    key: 'promptForKeyboardInteractive',
    value: function promptForKeyboardInteractive() {
      var _this27 = this;

      var dialog = new _dialogsPromptPassDialog2['default'](true);

      dialog.on('dialog-done', function (e, pass) {
        _this27.info.verifyCode = pass;
        dialog.close();
        _this27.doConnect();
      });

      dialog.attach();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.emitter.dispose();
      this.watch.removeListeners();
    }
  }], [{
    key: 'toRelative',
    value: function toRelative(path) {
      var relativePath = atom.project.relativize(path);

      if (!relativePath.length) {
        relativePath = '/';
      } else if (relativePath[0] === '/') {
        relativePath = relativePath.substr(1);
      }

      return relativePath;
    }
  }]);

  return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O2tCQUNULElBQUk7Ozs7b0JBQzJDLE1BQU07O2lDQUNsRCxzQkFBc0I7O29CQUN2QixNQUFNOzs7O2lDQUNPLHFCQUFxQjs7OztzQkFDaEMsUUFBUTs7Ozt5QkFDTCxZQUFZOzs7O3VCQUNpRyxXQUFXOzt5QkFDeEgsYUFBYTs7Ozt3QkFDZCxZQUFZOzs7OzZCQUNqQixrQkFBa0I7Ozs7OEJBQ2pCLG1CQUFtQjs7Ozt1Q0FDUCw4QkFBOEI7Ozs7QUFmM0QsV0FBVyxDQUFDOztBQWlCWixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQzs7SUFFaEQsTUFBTTtBQUNkLFdBRFEsTUFBTSxHQUNYOzBCQURLLE1BQU07O0FBRXZCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDOztBQUU3QixRQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxjQUFjLEdBQUcsWUFBWSxDQUFDO0FBQ25DLFFBQUksQ0FBQyxjQUFjLEdBQUcsWUFBWSxDQUFDO0FBQ25DLFFBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQzFCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVuQixRQUFJLENBQUMsSUFBSSxHQUFHLDJCQUFjO0FBQ3hCLFVBQUksRUFBRSxHQUFHO0FB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VUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7QUFDeEIsb0JBQVksR0FBRyxHQUFHLENBQUM7T0FDcEIsTUFBTSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7QUFDbEMsb0JBQVksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3ZDOztBQUVELGFBQU8sWUFBWSxDQUFDO0tBQ3JCOzs7U0FybEJrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvaG9tZS9mZWxpcGUvLmF0b20vcGFja2FnZXMvcmVtb3RlLWZ0cC9saWIvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBGUyBmcm9tICdmcy1wbHVzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgeyBGaWxlLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyLCB3YXRjaFBhdGggfSBmcm9tICdhdG9tJztcbmltcG9ydCB7ICQgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBzdHJpcEpzb25Db21tZW50cyBmcm9tICdzdHJpcC1qc29uLWNvbW1lbnRzJztcbmltcG9ydCBpZ25vcmUgZnJvbSAnaWdub3JlJztcbmltcG9ydCBzc2hDb25maWcgZnJvbSAnc3NoLWNvbmZpZyc7XG5pbXBvcnQgeyBtdWx0aXBsZUhvc3RzRW5hYmxlZCwgZ2V0T2JqZWN0LCBoYXNQcm9qZWN0LCBsb2dnZXIsIHRyYXZlcnNlVHJlZSwgdmFsaWRhdGVDb25maWcsIHJlc29sdmVIb21lLCBta2RpclN5bmNSZWN1cnNpdmUgfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IERpcmVjdG9yeSBmcm9tICcuL2RpcmVjdG9yeSc7XG5pbXBvcnQgUHJvZ3Jlc3MgZnJvbSAnLi9wcm9ncmVzcyc7XG5pbXBvcnQgRlRQIGZyb20gJy4vY29ubmVjdG9ycy9mdHAnO1xuaW1wb3J0IFNGVFAgZnJvbSAnLi9jb25uZWN0b3JzL3NmdHAnO1xuaW1wb3J0IFByb21wdFBhc3NEaWFsb2cgZnJvbSAnLi9kaWFsb2dzL3Byb21wdC1wYXNzLWRpYWxvZyc7XG5cbmNvbnN0IFNTSDJfQUxHT1JJVEhNUyA9IHJlcXVpcmUoJ3NzaDItc3RyZWFtcycpLmNvbnN0YW50cy5BTEdPUklUSE1TO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmluZm8gPSBudWxsO1xuICAgIHNlbGYuY29ubmVjdG9yID0gbnVsbDtcbiAgICBzZWxmLmN1cnJlbnQgPSBudWxsO1xuICAgIHNlbGYucXVldWUgPSBbXTtcblxuICAgIHNlbGYuY29uZmlnRmlsZU5hbWUgPSAnLmZ0cGNvbmZpZyc7XG4gICAgc2VsZi5pZ25vcmVCYXNlTmFtZSA9ICcuZnRwaWdub3JlJztcbiAgICBzZWxmLmlnbm9yZUZpbHRlciA9IGZhbHNlO1xuICAgIHNlbGYud2F0Y2hlcnMgPSBbXTtcblxuICAgIHNlbGYucm9vdCA9IG5ldyBEaXJlY3Rvcnkoe1xuICAgICAgbmFtZTogJy8nLFxuICAgICAgcGF0aDogJy8nLFxuICAgICAgY2xpZW50OiB0aGlzLFxuICAgICAgaXNFeHBhbmRlZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHNlbGYuc3RhdHVzID0gJ05PVF9DT05ORUNURUQnOyAvLyBPcHRpb25zIE5PVF9DT05ORUNURUQsIENPTk5FQ1RJTkcsIENPTk5FQ1RFRFxuXG4gICAgc2VsZi53YXRjaCA9IHtcbiAgICAgIHdhdGNoZXI6IG51bGwsXG4gICAgICBmaWxlczogW10sXG4gICAgICBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCB3YXRjaERhdGEgPSBnZXRPYmplY3Qoe1xuICAgICAgICAgIGtleXM6IFsnaW5mbycsICd3YXRjaCddLFxuICAgICAgICAgIG9iajogc2VsZixcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh3YXRjaERhdGEgPT09IG51bGwgfHwgd2F0Y2hEYXRhID09PSBmYWxzZSkgcmV0dXJuO1xuICAgICAgICBpZiAodHlwZW9mIHdhdGNoRGF0YSA9PT0gJ3N0cmluZycpIHdhdGNoRGF0YSA9IFt3YXRjaERhdGFdO1xuXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh3YXRjaERhdGEpIHx8IHdhdGNoRGF0YS5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgICBjb25zdCBpZyA9IGlnbm9yZSgpLmFkZCh3YXRjaERhdGEpO1xuXG4gICAgICAgIHdhdGNoUGF0aChzZWxmLmdldFByb2plY3RQYXRoKCksIHt9LCAoZXZlbnRzKSA9PiB7XG4gICAgICAgICAgT2JqZWN0LmtleXMoZXZlbnRzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gZXZlbnRzW2tleV07XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBQYXRoLnJlbGF0aXZlKHNlbGYuZ2V0UHJvamVjdFBhdGgoKSwgZXZlbnQucGF0aCk7XG5cbiAgICAgICAgICAgIGlmICghaWcuaWdub3JlcyhyZWxhdGl2ZVBhdGgpKSByZXR1cm47XG4gICAgICAgICAgICBzZWxmLndhdGNoLmZpbGVzLnB1c2gocmVsYXRpdmVQYXRoKTtcblxuICAgICAgICAgICAgaWYgKGV2ZW50LmFjdGlvbiA9PT0gJ21vZGlmaWVkJyAmJiAhcmVsYXRpdmVQYXRoLm1hdGNoKC8oXnxbL1xcXFxdKVxcLi4vKSkge1xuICAgICAgICAgICAgICBzZWxmLndhdGNoLnF1ZXVlVXBsb2FkLmFwcGx5KHNlbGYsIFtldmVudC5wYXRoLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgncmVtb3RlLWZ0cC5ub3RpZmljYXRpb25zLmVuYWJsZVdhdGNoRmlsZUNoYW5nZScpKSB7XG4gICAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhgUmVtb3RlIEZUUDogQ2hhbmdlIGRldGVjdGVkIGluOiAke2V2ZW50LnBhdGh9YCwge1xuICAgICAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHNlbGYud2F0Y2guZmlsZXMuaW5kZXhPZihyZWxhdGl2ZVBhdGgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLndhdGNoLmZpbGVzW2luZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudGhlbihkaXNwb3NhYmxlID0+IHNlbGYud2F0Y2hlcnMucHVzaChkaXNwb3NhYmxlKSk7XG5cbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ1JlbW90ZSBGVFA6IEFkZGVkIHdhdGNoIGxpc3RlbmVycy4nLCB7XG4gICAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGlmIChzZWxmLndhdGNoZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBzZWxmLndhdGNoZXJzLmZvckVhY2god2F0Y2hlciA9PiB3YXRjaGVyLmRpc3Bvc2UoKSk7XG5cbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnUmVtb3RlIEZUUDogU3RvcHBlZCB3YXRjaCBsaXN0ZW5lcnMuJywge1xuICAgICAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgc2VsZi53YXRjaGVycyA9IFtdO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcXVldWU6IHt9LFxuICAgICAgcXVldWVVcGxvYWQoZmlsZU5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IHRpbWVvdXREdXJhdGlvbiA9IGlzTmFOKHBhcnNlSW50KHNlbGYuaW5mby53YXRjaFRpbWVvdXQsIDEwKSkgPT09IHRydWVcbiAgICAgICAgICA/IDUwMFxuICAgICAgICAgIDogcGFyc2VJbnQoc2VsZi5pbmZvLndhdGNoVGltZW91dCwgMTApO1xuXG4gICAgICAgIGZ1bmN0aW9uIHNjaGVkdWxlVXBsb2FkKGZpbGUpIHtcbiAgICAgICAgICBzZWxmLndhdGNoLnF1ZXVlW2ZpbGVdID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBzZWxmLnVwbG9hZChmaWxlLCBjYWxsYmFjayk7XG4gICAgICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxmLndhdGNoLnF1ZXVlW2ZpbGVOYW1lXSAhPT0gbnVsbCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dChzZWxmLndhdGNoLnF1ZXVlW2ZpbGVOYW1lXSk7XG4gICAgICAgICAgc2VsZi53YXRjaC5xdWV1ZVtmaWxlTmFtZV0gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NoZWR1bGVVcGxvYWQoZmlsZU5hbWUpO1xuICAgICAgfSxcblxuICAgIH07XG5cbiAgICBzZWxmLndhdGNoLmFkZExpc3RlbmVycyA9IHNlbGYud2F0Y2guYWRkTGlzdGVuZXJzLmJpbmQoc2VsZik7XG4gICAgc2VsZi53YXRjaC5yZW1vdmVMaXN0ZW5lcnMgPSBzZWxmLndhdGNoLnJlbW92ZUxpc3RlbmVycy5iaW5kKHNlbGYpO1xuXG4gICAgc2VsZi5vbkRpZENvbm5lY3RlZChzZWxmLndhdGNoLmFkZExpc3RlbmVycyk7XG4gICAgc2VsZi5vbkRpZERpc2Nvbm5lY3RlZChzZWxmLndhdGNoLnJlbW92ZUxpc3RlbmVycyk7XG5cbiAgICBzZWxmLmV2ZW50cygpO1xuICB9XG5cbiAgb25EaWRDaGFuZ2VTdGF0dXMoY2FsbGJhY2spIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdjaGFuZ2Utc3RhdHVzJywgKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayh0aGlzLnN0YXR1cyk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgb25EaWRDb25uZWN0ZWQoY2FsbGJhY2spIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdjb25uZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMuc3RhdHVzKTtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2NoYW5nZS1zdGF0dXMnKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBvbkRpZERpc2Nvbm5lY3RlZChjYWxsYmFjaykge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLmVtaXR0ZXIub24oJ2Rpc2Nvbm5lY3RlZCcsICgpID0+IHtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5zdGF0dXMpO1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY2hhbmdlLXN0YXR1cycpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIG9uRGlkQ2xvc2VkKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMuZW1pdHRlci5vbignY2xvc2VkJywgKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayh0aGlzLnN0YXR1cyk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgb25EaWREZWJ1ZyhjYWxsYmFjaykge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLmVtaXR0ZXIub24oJ2RlYnVnJywgKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgY2FsbGJhY2sobWVzc2FnZSk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgb25EaWRRdWV1ZUNoYW5nZWQoY2FsbGJhY2spIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdxdWV1ZS1jaGFuZ2VkJywgKCkgPT4ge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIGV2ZW50cygpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3JlbW90ZS1mdHAuZGV2LmRlYnVnUmVzcG9uc2UnLCAodmFsdWVzKSA9PiB7XG4gICAgICAgIHRoaXMud2F0Y2hEZWJ1Zyh2YWx1ZXMubmV3VmFsdWUpO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgncmVtb3RlLWZ0cC50cmVlLnNob3dQcm9qZWN0TmFtZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRQcm9qZWN0TmFtZSgpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIHNldFByb2plY3ROYW1lKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5mdHBDb25maWdQYXRoID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXG4gICAgY29uc3QgcHJvamVjdFJvb3QgPSBhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1mdHAudHJlZS5zaG93UHJvamVjdE5hbWUnKTtcbiAgICBjb25zdCAkcm9vdE5hbWUgPSAkKCcuZnRwdHJlZS12aWV3IC5wcm9qZWN0LXJvb3QgPiAuaGVhZGVyIHNwYW4nKTtcblxuICAgIGxldCByb290TmFtZSA9ICcvJztcblxuICAgIGlmICh0eXBlb2YgdGhpcy5pbmZvW3Byb2plY3RSb290XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJvb3ROYW1lID0gdGhpcy5pbmZvW3Byb2plY3RSb290XTtcbiAgICB9XG5cbiAgICB0aGlzLnJvb3QubmFtZSA9IHJvb3ROYW1lO1xuICAgICRyb290TmFtZS50ZXh0KHJvb3ROYW1lKTtcbiAgfVxuXG4gIHJlYWRDb25maWcoY2FsbGJhY2spIHtcbiAgICBsZXQgQ1NPTjtcblxuICAgIGNvbnN0IGVycm9yID0gKGVycikgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2suYXBwbHkodGhpcywgW2Vycl0pO1xuICAgIH07XG4gICAgdGhpcy5pbmZvID0gbnVsbDtcbiAgICB0aGlzLmZ0cENvbmZpZ1BhdGggPSB0aGlzLmdldENvbmZpZ1BhdGgoKTtcblxuICAgIGNvbnN0IGNzb25Db25maWcgPSBuZXcgRmlsZSh0aGlzLmdldEZpbGVQYXRoKGAke3RoaXMuZnRwQ29uZmlnUGF0aH0uY3NvbmApKTtcblxuICAgIGlmICh0aGlzLmZ0cENvbmZpZ1BhdGggPT09IGZhbHNlKSB0aHJvdyBuZXcgRXJyb3IoJ1JlbW90ZSBGVFA6IGdldENvbmZpZ1BhdGggcmV0dXJuZWQgZmFsc2UsIGJ1dCBleHBlY3RlZCBhIHN0cmluZycpO1xuXG4gICAgY29uc3QgbW9kaWZ5Q29uZmlnID0gKGpzb24pID0+IHtcbiAgICAgIHRoaXMuaW5mbyA9IGpzb247XG4gICAgICB0aGlzLnJvb3QubmFtZSA9ICcnO1xuICAgICAgaWYgKHRoaXMuaW5mby5yZW1vdGUpIHtcbiAgICAgICAgdGhpcy5yb290LnBhdGggPSBgLyR7dGhpcy5pbmZvLnJlbW90ZS5yZXBsYWNlKC9eXFwvKy8sICcnKX1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yb290LnBhdGggPSAnLyc7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmluZm8ucHJpdmF0ZWtleSkge1xuICAgICAgICB0aGlzLmluZm8ucHJpdmF0ZWtleSA9IHJlc29sdmVIb21lKHRoaXMuaW5mby5wcml2YXRla2V5KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRQcm9qZWN0TmFtZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBleHRlbmRzQ29uZmlnID0gKGpzb24sIGVycikgPT4ge1xuICAgICAgaWYgKGpzb24gIT09IG51bGwgJiYgdHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IHNzaENvbmZpZ1BhdGggPSBhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1mdHAuY29ubmVjdG9yLnNzaENvbmZpZ1BhdGgnKTtcblxuICAgICAgICBpZiAoc3NoQ29uZmlnUGF0aCAmJiB0aGlzLmluZm8ucHJvdG9jb2wgPT09ICdzZnRwJykge1xuICAgICAgICAgIGNvbnN0IGNvbmZpZ1BhdGggPSBQYXRoLm5vcm1hbGl6ZShzc2hDb25maWdQYXRoLnJlcGxhY2UoJ34nLCBvcy5ob21lZGlyKCkpKTtcblxuICAgICAgICAgIEZTLnJlYWRGaWxlKGNvbmZpZ1BhdGgsICd1dGY4JywgKGZpbGVFcnIsIGNvbmYpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWxlRXJyKSByZXR1cm4gZXJyb3IoZmlsZUVycik7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHNzaENvbmZpZy5wYXJzZShjb25mKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VjdGlvbiA9IGNvbmZpZy5maW5kKHtcbiAgICAgICAgICAgICAgSG9zdDogdGhpcy5pbmZvLmhvc3QsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNlY3Rpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgY29uc3QgbWFwcGluZyA9IG5ldyBNYXAoW1xuICAgICAgICAgICAgICAgIFsnSG9zdE5hbWUnLCAnaG9zdCddLFxuICAgICAgICAgICAgICAgIFsnUG9ydCcsICdwb3J0J10sXG4gICAgICAgICAgICAgICAgWydVc2VyJywgJ3VzZXInXSxcbiAgICAgICAgICAgICAgICBbJ0lkZW50aXR5RmlsZScsICdwcml2YXRla2V5J10sXG4gICAgICAgICAgICAgICAgWydTZXJ2ZXJBbGl2ZUludGVydmFsJywgJ2tlZXBhbGl2ZSddLFxuICAgICAgICAgICAgICAgIFsnQ29ubmVjdFRpbWVvdXQnLCAnY29ublRpbWVvdXQnXSxcbiAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgICAgc2VjdGlvbi5jb25maWcuZm9yRWFjaCgobGluZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IG1hcHBpbmcuZ2V0KGxpbmUucGFyYW0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmluZm9ba2V5XSA9IGxpbmUudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXMsIFtlcnIsIHRoaXMuaW5mb10pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIFtlcnIsIGpzb25dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoY3NvbkNvbmZpZy5leGlzdHNTeW5jKCkpIHtcbiAgICAgIGlmICh0eXBlb2YgQ1NPTiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgQ1NPTiA9IHJlcXVpcmUoJ2Nzb24tcGFyc2VyJyk7XG4gICAgICB9XG5cbiAgICAgIGxldCBqc29uID0gbnVsbDtcblxuICAgICAgY3NvbkNvbmZpZy5yZWFkKHRydWUpLnRoZW4oKGNvbnRlbnQpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBqc29uID0gQ1NPTi5wYXJzZShjb250ZW50KTtcbiAgICAgICAgICBtb2RpZnlDb25maWcoanNvbik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYENvdWxkIG5vdCBwcm9jZXNzIFxcYCR7dGhpcy5jb25maWdGaWxlTmFtZX1cXGAuYCwge1xuICAgICAgICAgICAgZGV0YWlsOiBlLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZXh0ZW5kc0NvbmZpZyhqc29uLCBudWxsKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgRlMucmVhZEZpbGUodGhpcy5mdHBDb25maWdQYXRoLCAndXRmOCcsIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGVycm9yKGVycik7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBzdHJpcEpzb25Db21tZW50cyhyZXMpO1xuICAgICAgbGV0IGpzb24gPSBudWxsO1xuICAgICAgaWYgKHZhbGlkYXRlQ29uZmlnKGRhdGEsIHRoaXMuY29uZmlnRmlsZU5hbWUpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAganNvbiA9IEpTT04ucGFyc2UoZGF0YSk7XG5cbiAgICAgICAgICBtb2RpZnlDb25maWcoanNvbik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYENvdWxkIG5vdCBwcm9jZXNzIFxcYCR7dGhpcy5jb25maWdGaWxlTmFtZX1cXGAuYCwge1xuICAgICAgICAgICAgZGV0YWlsOiBlLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGV4dGVuZHNDb25maWcoanNvbiwgZXJyKTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXRGaWxlUGF0aChyZWxhdGl2ZVBhdGgpIHtcbiAgICBjb25zdCBwcm9qZWN0UGF0aCA9IHRoaXMuZ2V0UHJvamVjdFBhdGgoKTtcbiAgICBpZiAocHJvamVjdFBhdGggPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIFBhdGgucmVzb2x2ZShwcm9qZWN0UGF0aCwgcmVsYXRpdmVQYXRoKTtcbiAgfVxuXG4gIGdldFByb2plY3RQYXRoKCkge1xuICAgIGxldCBwcm9qZWN0UGF0aCA9IG51bGw7XG5cbiAgICBpZiAobXVsdGlwbGVIb3N0c0VuYWJsZWQoKSA9PT0gdHJ1ZSkge1xuICAgICAgY29uc3QgJGN1cnJlbnRQcm9qZWN0ID0gJCgnLnRyZWUtdmlldyAucHJvamVjdC1yb290Jyk7XG5cbiAgICAgIHByb2plY3RQYXRoID0gJGN1cnJlbnRQcm9qZWN0LmZpbmQoJz4gLmhlYWRlciBzcGFuLm5hbWUnKS5kYXRhKCdwYXRoJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGZpcnN0RGlyZWN0b3J5ID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMF07XG4gICAgICBpZiAoZmlyc3REaXJlY3RvcnkgIT0gbnVsbCkgcHJvamVjdFBhdGggPSBmaXJzdERpcmVjdG9yeS5wYXRoO1xuICAgIH1cblxuICAgIGlmIChwcm9qZWN0UGF0aCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnByb2plY3RQYXRoID0gcHJvamVjdFBhdGg7XG4gICAgICByZXR1cm4gcHJvamVjdFBhdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0Q29uZmlnUGF0aCgpIHtcbiAgICBpZiAoIWhhc1Byb2plY3QoKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0RmlsZVBhdGgoYC4vJHt0aGlzLmNvbmZpZ0ZpbGVOYW1lfWApO1xuICB9XG5cbiAgdXBkYXRlSWdub3JlKCkge1xuICAgIGNvbnN0IGlnbm9yZVBhdGggPSB0aGlzLmdldEZpbGVQYXRoKHRoaXMuaWdub3JlQmFzZU5hbWUpO1xuICAgIGNvbnN0IGlnbm9yZUZpbGUgPSBuZXcgRmlsZShpZ25vcmVQYXRoKTtcblxuICAgIGlmICghaWdub3JlRmlsZS5leGlzdHNTeW5jKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmlnbm9yZUZpbHRlciA9IGlnbm9yZSgpLmFkZChpZ25vcmVGaWxlLnJlYWRTeW5jKHRydWUpKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY2hlY2tJZ25vcmUoZmlsZXBhdGgpIHtcbiAgICBjb25zdCByZWxhdGl2ZUZpbGVwYXRoID0gQ2xpZW50LnRvUmVsYXRpdmUoZmlsZXBhdGgpO1xuXG4gICAgbGV0IGlnbm9yZUlzQWN0dWFsID0gdHJ1ZTtcblxuICAgIC8vIHVwZGF0ZUlnbm9yZSB3aGVuIG5vdCBzZXQgb3IgLmZ0cGlnbm9yZSBpcyBzYXZlZFxuICAgIGlmICghdGhpcy5pZ25vcmVGaWx0ZXIgfHwgKHJlbGF0aXZlRmlsZXBhdGggPT09IHRoaXMuZ2V0RmlsZVBhdGgodGhpcy5pZ25vcmVCYXNlTmFtZSkpKSB7XG4gICAgICBpZ25vcmVJc0FjdHVhbCA9IHRoaXMudXBkYXRlSWdub3JlKCk7XG4gICAgfVxuXG4gICAgaWYgKGlnbm9yZUlzQWN0dWFsICYmIHRoaXMuaWdub3JlRmlsdGVyLmlnbm9yZXMocmVsYXRpdmVGaWxlcGF0aCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzQ29ubmVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3RvciAmJiB0aGlzLmNvbm5lY3Rvci5pc0Nvbm5lY3RlZCgpO1xuICB9XG5cbiAgb25jZUNvbm5lY3RlZChvbmNvbm5lY3QpIHtcbiAgICBpZiAodGhpcy5jb25uZWN0b3IgJiYgdGhpcy5jb25uZWN0b3IuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgb25jb25uZWN0LmFwcGx5KHRoaXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb25jb25uZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAodGhpcy5zdGF0dXMgPT09ICdOT1RfQ09OTkVDVEVEJykge1xuICAgICAgICB0aGlzLnN0YXR1cyA9ICdDT05ORUNUSU5HJztcbiAgICAgICAgdGhpcy5yZWFkQ29uZmlnKChlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdOT1RfQ09OTkVDVEVEJztcbiAgICAgICAgICAgIC8vIE5PVEU6IFJlbW92ZSBub3RpZmljYXRpb24gYXMgaXQgd2lsbCBqdXN0IHNheSB0aGVyZVxuICAgICAgICAgICAgLy8gaXMgbm8gZnRwY29uZmlnIGlmIG5vbmUgaW4gZGlyZWN0b3J5IGFsbCB0aGUgdGltZVxuICAgICAgICAgICAgLy8gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiUmVtb3RlIEZUUDogXCIgKyBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmNvbm5lY3QodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVtaXR0ZXIub25jZSgnY29ubmVjdGVkJywgb25jb25uZWN0KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc29sZS53YXJuKGBSZW1vdGUgRlRQOiBOb3QgY29ubmVjdGVkIGFuZCB0eXBlb2Ygb25jb25uZWN0IGlzICR7dHlwZW9mIG9uY29ubmVjdH1gKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25uZWN0KHJlY29ubmVjdCkge1xuICAgIGlmIChyZWNvbm5lY3QgIT09IHRydWUpIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKCkpIHJldHVybjtcbiAgICBpZiAoIXRoaXMuaW5mbykgcmV0dXJuO1xuICAgIGlmICh0aGlzLmluZm8ucHJvbXB0Rm9yUGFzcyA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5wcm9tcHRGb3JQYXNzKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmluZm8ua2V5Ym9hcmRJbnRlcmFjdGl2ZSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5wcm9tcHRGb3JLZXlib2FyZEludGVyYWN0aXZlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmluZm8ua2V5Ym9hcmRJbnRlcmFjdGl2ZUZvclBhc3MgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuaW5mby52ZXJpZnlDb2RlID0gdGhpcy5pbmZvLnBhc3M7XG4gICAgICB0aGlzLmRvQ29ubmVjdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvQ29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIGRvQ29ubmVjdCgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdSZW1vdGUgRlRQOiBDb25uZWN0aW5nLi4uJywge1xuICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgbGV0IGluZm87XG4gICAgc3dpdGNoIChzZWxmLmluZm8ucHJvdG9jb2wpIHtcbiAgICAgIGNhc2UgJ2Z0cCc6IHtcbiAgICAgICAgaW5mbyA9IHtcbiAgICAgICAgICBob3N0OiBzZWxmLmluZm8uaG9zdCB8fCAnJyxcbiAgICAgICAgICBwb3J0OiBzZWxmLmluZm8ucG9ydCB8fCAyMSxcbiAgICAgICAgICB1c2VyOiBzZWxmLmluZm8udXNlciB8fCAnJyxcbiAgICAgICAgICBwYXNzd29yZDogc2VsZi5pbmZvLnBhc3MgfHwgJycsXG4gICAgICAgICAgc2VjdXJlOiBzZWxmLmluZm8uc2VjdXJlIHx8ICcnLFxuICAgICAgICAgIHNlY3VyZU9wdGlvbnM6IHNlbGYuaW5mby5zZWN1cmVPcHRpb25zIHx8ICcnLFxuICAgICAgICAgIGNvbm5UaW1lb3V0OiBzZWxmLmluZm8udGltZW91dCB8fCAxMDAwMCxcbiAgICAgICAgICBwYXN2VGltZW91dDogc2VsZi5pbmZvLnRpbWVvdXQgfHwgMTAwMDAsXG4gICAgICAgICAgZm9yY2VQYXN2OiBzZWxmLmluZm8uZm9yY2VQYXN2IHx8IHRydWUsXG4gICAgICAgICAga2VlcGFsaXZlOiAoc2VsZi5pbmZvLmtlZXBhbGl2ZSA9PT0gdW5kZWZpbmVkID8gMTAwMDAgOiBzZWxmLmluZm8ua2VlcGFsaXZlKSwgLy8gbG9uZyB2ZXJzaW9uLCBiZWNhdXNlIDAgaXMgYSB2YWxpZCB2YWx1ZVxuICAgICAgICAgIGRlYnVnKHN0cikge1xuICAgICAgICAgICAgY29uc3QgbG9nID0gc3RyLm1hdGNoKC9eXFxbY29ubmVjdGlvblxcXSAoPnw8KSAnKC4qPykoXFxcXHJcXFxcbik/JyQvKTtcbiAgICAgICAgICAgIGlmICghbG9nKSByZXR1cm47XG4gICAgICAgICAgICBpZiAobG9nWzJdLm1hdGNoKC9eUEFTUyAvKSkgbG9nWzJdID0gJ1BBU1MgKioqKioqJztcbiAgICAgICAgICAgIHNlbGYuZW1pdHRlci5lbWl0KCdkZWJ1ZycsIGAke2xvZ1sxXX0gJHtsb2dbMl19YCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5jb25uZWN0b3IgPSBuZXcgRlRQKHNlbGYpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnc2Z0cCc6IHtcbiAgICAgICAgaW5mbyA9IHtcbiAgICAgICAgICBob3N0OiBzZWxmLmluZm8uaG9zdCB8fCAnJyxcbiAgICAgICAgICBwb3J0OiBzZWxmLmluZm8ucG9ydCB8fCAyMixcbiAgICAgICAgICB1c2VybmFtZTogc2VsZi5pbmZvLnVzZXIgfHwgJycsXG4gICAgICAgICAgcmVhZHlUaW1lb3V0OiBzZWxmLmluZm8uY29ublRpbWVvdXQgfHwgMTAwMDAsXG4gICAgICAgICAga2VlcGFsaXZlSW50ZXJ2YWw6IHNlbGYuaW5mby5rZWVwYWxpdmUgfHwgMTAwMDAsXG4gICAgICAgICAgdmVyaWZ5Q29kZTogc2VsZi5pbmZvLnZlcmlmeUNvZGUgfHwgJycsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHNlbGYuaW5mby5wYXNzKSBpbmZvLnBhc3N3b3JkID0gc2VsZi5pbmZvLnBhc3M7XG5cbiAgICAgICAgaWYgKHNlbGYuaW5mby5wcml2YXRla2V5KSB7XG4gICAgICAgICAgc2VsZi5pbmZvLnByaXZhdGVrZXkgPSByZXNvbHZlSG9tZShzZWxmLmluZm8ucHJpdmF0ZWtleSk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGsgPSBGUy5yZWFkRmlsZVN5bmMoc2VsZi5pbmZvLnByaXZhdGVrZXkpO1xuICAgICAgICAgICAgaW5mby5wcml2YXRlS2V5ID0gcGs7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1JlbW90ZSBGVFA6IENvdWxkIG5vdCByZWFkIHByaXZhdGVLZXkgZmlsZScsIHtcbiAgICAgICAgICAgICAgZGV0YWlsOiBlcnIsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGYuaW5mby5wYXNzcGhyYXNlKSBpbmZvLnBhc3NwaHJhc2UgPSBzZWxmLmluZm8ucGFzc3BocmFzZTtcblxuICAgICAgICBpZiAoc2VsZi5pbmZvLmFnZW50KSBpbmZvLmFnZW50ID0gc2VsZi5pbmZvLmFnZW50O1xuXG4gICAgICAgIGlmIChzZWxmLmluZm8uYWdlbnQgPT09ICdlbnYnKSBpbmZvLmFnZW50ID0gcHJvY2Vzcy5lbnYuU1NIX0FVVEhfU09DSztcblxuICAgICAgICBpZiAoc2VsZi5pbmZvLmhvc3RoYXNoKSBpbmZvLmhvc3RIYXNoID0gc2VsZi5pbmZvLmhvc3RoYXNoO1xuXG4gICAgICAgIGlmIChzZWxmLmluZm8uaWdub3JlaG9zdCkge1xuICAgICAgICAgIC8vIE5PVEU6IGhvc3RWZXJpZmllciBkb2Vzbid0IHJ1biBhdCBhbGwgaWYgaXQncyBub3QgYSBmdW5jdGlvbi5cbiAgICAgICAgICAvLyBBbGxvd3MgeW91IHRvIHNraXAgaG9zdEhhc2ggb3B0aW9uIGluIHNzaDIgMC41K1xuICAgICAgICAgIGluZm8uaG9zdFZlcmlmaWVyID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpbmZvLmFsZ29yaXRobXMgPSB7XG4gICAgICAgICAga2V4OiBTU0gyX0FMR09SSVRITVMuU1VQUE9SVEVEX0tFWCxcbiAgICAgICAgICBjaXBoZXI6IFNTSDJfQUxHT1JJVEhNUy5TVVBQT1JURURfQ0lQSEVSLFxuICAgICAgICAgIHNlcnZlckhvc3RLZXk6IFNTSDJfQUxHT1JJVEhNUy5TVVBQT1JURURfU0VSVkVSX0hPU1RfS0VZLFxuICAgICAgICAgIGhtYWM6IFNTSDJfQUxHT1JJVEhNUy5TVVBQT1JURURfSE1BQyxcbiAgICAgICAgICBjb21wcmVzczogU1NIMl9BTEdPUklUSE1TLlNVUFBPUlRFRF9DT01QUkVTUyxcbiAgICAgICAgfTtcblxuICAgICAgICBpbmZvLmZpbGVQZXJtaXNzaW9ucyA9IHNlbGYuaW5mby5maWxlUGVybWlzc2lvbnM7XG4gICAgICAgIGluZm8ucmVtb3RlQ29tbWFuZCA9IHNlbGYuaW5mby5yZW1vdGVDb21tYW5kO1xuICAgICAgICBpbmZvLnJlbW90ZVNoZWxsID0gc2VsZi5pbmZvLnJlbW90ZVNoZWxsO1xuXG4gICAgICAgIGlmIChzZWxmLmluZm8ua2V5Ym9hcmRJbnRlcmFjdGl2ZSkgaW5mby50cnlLZXlib2FyZCA9IHRydWU7XG4gICAgICAgIGlmIChzZWxmLmluZm8ua2V5Ym9hcmRJbnRlcmFjdGl2ZUZvclBhc3MpIGluZm8udHJ5S2V5Ym9hcmQgPSB0cnVlO1xuXG4gICAgICAgIHNlbGYuY29ubmVjdG9yID0gbmV3IFNGVFAoc2VsZik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGBwcm90b2NvbGAgZm91bmQgaW4gY29ubmVjdGlvbiBjcmVkZW50aWFsLiBQbGVhc2UgcmVjcmVhdGUgLmZ0cGNvbmZpZyBmaWxlIGZyb20gUGFja2FnZXMgLT4gUmVtb3RlIEZUUCAtPiBDcmVhdGUgKFMpRlRQIGNvbmZpZyBmaWxlLicpO1xuICAgIH1cblxuICAgIHNlbGYuY29ubmVjdG9yLmNvbm5lY3QoaW5mbywgKCkgPT4ge1xuICAgICAgaWYgKHNlbGYucm9vdC5zdGF0dXMgIT09IDEpIHNlbGYucm9vdC5vcGVuKCk7XG4gICAgICBzZWxmLnN0YXR1cyA9ICdDT05ORUNURUQnO1xuICAgICAgc2VsZi5lbWl0dGVyLmVtaXQoJ2Nvbm5lY3RlZCcpO1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnUmVtb3RlIEZUUDogQ29ubmVjdGVkJywge1xuICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlbGYuY29ubmVjdG9yLm9uKCdjbG9zZWQnLCAoYWN0aW9uKSA9PiB7XG4gICAgICBpZiAoc2VsZi5zdGF0dXMgPT09ICdOT1RfQ09OTkVDVEVEJykgcmV0dXJuO1xuXG4gICAgICBzZWxmLnN0YXR1cyA9ICdOT1RfQ09OTkVDVEVEJztcbiAgICAgIHNlbGYuZW1pdHRlci5lbWl0KCdjbG9zZWQnKTtcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ1JlbW90ZSBGVFA6IENvbm5lY3Rpb24gY2xvc2VkJywge1xuICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICB9KTtcblxuICAgICAgc2VsZi5kaXNjb25uZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ1JFQ09OTkVDVCcpIHNlbGYuY29ubmVjdCh0cnVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VsZi5jb25uZWN0b3Iub24oJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgc2VsZi5lbWl0dGVyLmVtaXQoJ2VuZGVkJyk7XG4gICAgfSk7XG5cbiAgICBzZWxmLmNvbm5lY3Rvci5vbignZXJyb3InLCAoZXJyLCBjb2RlKSA9PiB7XG4gICAgICBpZiAoY29kZSA9PT0gNDIxIHx8IGNvZGUgPT09ICdFQ09OTlJFU0VUJykgcmV0dXJuO1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdSZW1vdGUgRlRQOiBDb25uZWN0aW9uIGZhaWxlZCcsIHtcbiAgICAgICAgZGV0YWlsOiBlcnIsXG4gICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VsZi53YXRjaERlYnVnKGF0b20uY29uZmlnLmdldCgncmVtb3RlLWZ0cC5kZXYuZGVidWdSZXNwb25zZScpKTtcbiAgfVxuXG4gIHdhdGNoRGVidWcoaXNXYXRjaGluZykge1xuICAgIHRoaXMuZW1pdHRlci5vZmYoJ2RlYnVnJywgbG9nZ2VyKTtcblxuICAgIGlmIChpc1dhdGNoaW5nKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIub24oJ2RlYnVnJywgbG9nZ2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0dGVyLm9mZignZGVidWcnLCBsb2dnZXIpO1xuICAgIH1cbiAgfVxuXG4gIGRpc2Nvbm5lY3QoY2IpIHtcbiAgICBpZiAodGhpcy5jb25uZWN0b3IpIHtcbiAgICAgIHRoaXMuY29ubmVjdG9yLmRpc2Nvbm5lY3QoKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmNvbm5lY3RvcjtcbiAgICAgIHRoaXMuY29ubmVjdG9yID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yb290KSB7XG4gICAgICB0aGlzLnJvb3Quc3RhdHVzID0gMDtcbiAgICAgIHRoaXMucm9vdC5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy53YXRjaC5yZW1vdmVMaXN0ZW5lcnMuYXBwbHkodGhpcyk7XG5cbiAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgIHRoaXMucXVldWUgPSBbXTtcblxuICAgIHRoaXMuc3RhdHVzID0gJ05PVF9DT05ORUNURUQnO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaXNjb25uZWN0ZWQnKTtcblxuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIGNiKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN0YXRpYyB0b1JlbGF0aXZlKHBhdGgpIHtcbiAgICBsZXQgcmVsYXRpdmVQYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemUocGF0aCk7XG5cbiAgICBpZiAoIXJlbGF0aXZlUGF0aC5sZW5ndGgpIHtcbiAgICAgIHJlbGF0aXZlUGF0aCA9ICcvJztcbiAgICB9IGVsc2UgaWYgKHJlbGF0aXZlUGF0aFswXSA9PT0gJy8nKSB7XG4gICAgICByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZVBhdGguc3Vic3RyKDEpO1xuICAgIH1cblxuICAgIHJldHVybiByZWxhdGl2ZVBhdGg7XG4gIH1cblxuICB0b1JlbW90ZShsb2NhbCkge1xuICAgIHJldHVybiBQYXRoLmpvaW4oXG4gICAgICB0aGlzLmluZm8ucmVtb3RlLFxuICAgICAgYXRvbS5wcm9qZWN0LnJlbGF0aXZpemUobG9jYWwpLFxuICAgICkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICB9XG5cbiAgdG9Mb2NhbChyZW1vdGUsIHRhcmdldCA9ICcnKSB7XG4gICAgY29uc3QgcHJvamVjdFBhdGggPSB0aGlzLmdldFByb2plY3RQYXRoKCk7XG4gICAgY29uc3QgcmVtb3RlTGVuZ3RoID0gdGhpcy5pbmZvLnJlbW90ZS5sZW5ndGg7XG5cbiAgICBpZiAocHJvamVjdFBhdGggPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHR5cGVvZiByZW1vdGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlbW90ZSBGVFA6IHJlbW90ZSBtdXN0IGJlIGEgc3RyaW5nLCB3YXMgcGFzc2VkICR7dHlwZW9mIHJlbW90ZX1gKTtcbiAgICB9XG5cbiAgICBsZXQgcGF0aCA9IG51bGw7XG4gICAgaWYgKHJlbW90ZUxlbmd0aCA+IDEpIHtcbiAgICAgIHBhdGggPSBgLi8ke3JlbW90ZS5zdWJzdHIodGhpcy5pbmZvLnJlbW90ZS5sZW5ndGgpfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhdGggPSBgLi8ke3JlbW90ZX1gO1xuICAgIH1cblxuICAgIHJldHVybiBQYXRoLnJlc29sdmUoUGF0aC5qb2luKHByb2plY3RQYXRoLCB0YXJnZXQsIGAuLyR7cGF0aC5yZXBsYWNlKC9eXFwvKy8sICcnKX1gKSk7XG4gIH1cblxuICBfbmV4dCgpIHtcbiAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQoKSkgcmV0dXJuO1xuXG4gICAgdGhpcy5jdXJyZW50ID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudCkgdGhpcy5jdXJyZW50WzFdLmFwcGx5KHRoaXMsIFt0aGlzLmN1cnJlbnRbMl1dKTtcblxuICAgIGlmICh0eXBlb2YgYXRvbS5wcm9qZWN0LnJlbW90ZWZ0cC5lbWl0dGVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgYXRvbS5wcm9qZWN0LnJlbW90ZWZ0cC5lbWl0dGVyLmVtaXQoJ3F1ZXVlLWNoYW5nZWQnKTtcbiAgICB9XG4gIH1cblxuICBfZW5xdWV1ZShmdW5jLCBkZXNjKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSBuZXcgUHJvZ3Jlc3MoKTtcblxuICAgIHRoaXMucXVldWUucHVzaChbZGVzYywgZnVuYywgcHJvZ3Jlc3NdKTtcbiAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPT09IDEgJiYgIXRoaXMuY3VycmVudCkgdGhpcy5fbmV4dCgpO1xuXG4gICAgZWxzZSB0aGlzLmVtaXR0ZXIuZW1pdCgncXVldWUtY2hhbmdlZCcpO1xuXG4gICAgcmV0dXJuIHByb2dyZXNzO1xuICB9XG5cbiAgYWJvcnQoKSB7XG4gICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgdGhpcy5jb25uZWN0b3IuYWJvcnQoKCkgPT4ge1xuICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFib3J0QWxsKCkge1xuICAgIHRoaXMuY3VycmVudCA9IG51bGw7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuXG4gICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgdGhpcy5jb25uZWN0b3IuYWJvcnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgncXVldWUtY2hhbmdlZCcpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0KHJlbW90ZSwgcmVjdXJzaXZlLCBjYWxsYmFjaykge1xuICAgIHRoaXMub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICB0aGlzLl9lbnF1ZXVlKCgpID0+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IubGlzdChyZW1vdGUsIHJlY3Vyc2l2ZSwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYExpc3RpbmcgJHtyZWN1cnNpdmUgPyAncmVjdXJzaXZlbHkgJyA6ICcnfSR7UGF0aC5iYXNlbmFtZShyZW1vdGUpfWApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkb3dubG9hZFRvKHJlbW90ZVBhdGgsIHRhcmdldFBhdGgsIHJlY3Vyc2l2ZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5jaGVja0lnbm9yZShyZW1vdGVQYXRoKSkge1xuICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICB0aGlzLl9lbnF1ZXVlKChwcm9ncmVzcykgPT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rvci5nZXRUbyhyZW1vdGVQYXRoLCB0YXJnZXRQYXRoLCByZWN1cnNpdmUsICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgICB9LCAocGVyY2VudCkgPT4ge1xuICAgICAgICAgIHByb2dyZXNzLnNldFByb2dyZXNzKHBlcmNlbnQpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGBEb3dubG9hZGluZyAke1BhdGguYmFzZW5hbWUocmVtb3RlUGF0aCl9YCk7XG4gICAgfSk7XG4gIH1cblxuICBkb3dubG9hZChyZW1vdGUsIHJlY3Vyc2l2ZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5jaGVja0lnbm9yZShyZW1vdGUpKSB7XG4gICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5vbmNlQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuX2VucXVldWUoKHByb2dyZXNzKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yLmdldChyZW1vdGUsIHJlY3Vyc2l2ZSwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgIH0sIChwZXJjZW50KSA9PiB7XG4gICAgICAgICAgcHJvZ3Jlc3Muc2V0UHJvZ3Jlc3MocGVyY2VudCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYERvd25sb2FkaW5nICR7UGF0aC5iYXNlbmFtZShyZW1vdGUpfWApO1xuICAgIH0pO1xuICB9XG5cbiAgdXBsb2FkKGxvY2FsLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLmNoZWNrSWdub3JlKGxvY2FsKSkge1xuICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICB0aGlzLl9lbnF1ZXVlKChwcm9ncmVzcykgPT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rvci5wdXQobG9jYWwsICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgICB9LCAocGVyY2VudCkgPT4ge1xuICAgICAgICAgIHByb2dyZXNzLnNldFByb2dyZXNzKHBlcmNlbnQpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGBVcGxvYWRpbmcgJHtQYXRoLmJhc2VuYW1lKGxvY2FsKX1gKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwbG9hZFRvKGxvY2FsLCByZW1vdGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuY2hlY2tJZ25vcmUobG9jYWwpKSB7XG4gICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5vbmNlQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuX2VucXVldWUoKHByb2dyZXNzKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yLnB1dFRvKGxvY2FsLCByZW1vdGUsICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgICB9LCAocGVyY2VudCkgPT4ge1xuICAgICAgICAgIHByb2dyZXNzLnNldFByb2dyZXNzKHBlcmNlbnQpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGBVcGxvYWRpbmcgJHtQYXRoLmJhc2VuYW1lKGxvY2FsKX1gKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN5bmNSZW1vdGVGaWxlVG9Mb2NhbChyZW1vdGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuY2hlY2tJZ25vcmUocmVtb3RlKSkge1xuICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHZlcmlmeSBhY3RpdmUgY29ubmVjdGlvblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ0NPTk5FQ1RFRCcpIHtcbiAgICAgIHRoaXMuX2VucXVldWUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rvci5nZXQocmVtb3RlLCBmYWxzZSwgKGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrLmFwcGx5KG51bGwsIFtlcnJdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGBTeW5jICR7UGF0aC5iYXNlbmFtZShyZW1vdGUpfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1JlbW90ZSBGVFA6IE5vdCBjb25uZWN0ZWQhJywge1xuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN5bmNSZW1vdGVEaXJlY3RvcnlUb0xvY2FsKHJlbW90ZSwgaXNGaWxlLCBjYWxsYmFjaykge1xuICAgIC8vIFRPRE86IFRpZHkgdXAgdGhpcyBmdW5jdGlvbi4gRG9lcyAoIHByb2JhYmx5ICkgbm90IG5lZWQgdG8gbGlzdCBmcm9tIHRoZSBjb25uZWN0b3JcbiAgICAvLyBpZiBpc0ZpbGUgPT09IHRydWUuIFdpbGwgbmVlZCB0byBjaGVjayB0byBzZWUgaWYgdGhhdCBkb2Vzbid0IGJyZWFrIGFueXRoaW5nIGJlZm9yZVxuICAgIC8vIGltcGxlbWVudGluZy4gSW4gdGhlIG1lYW50aW1lIGN1cnJlbnQgc29sdXRpb24gc2hvdWxkIHdvcmsgZm9yICM0NTNcbiAgICAvL1xuICAgIC8vIFRPRE86IFRoaXMgbWV0aG9kIG9ubHkgc2VlbXMgdG8gYmUgcmVmZXJlbmNlZCBieSB0aGUgY29udGV4dCBtZW51IGNvbW1hbmQgc28gZ3JhY2VmdWxseVxuICAgIC8vIHJlbW92aW5nIGxpc3Qgd2l0aG91dCBicmVha2luZyB0aGlzIG1ldGhvZCBzaG91bGQgYmUgZG8tYWJsZS4gJ2lzRmlsZScgaXMgYWx3YXlzIHNlbmRpbmdcbiAgICAvLyBmYWxzZSBhdCB0aGUgbW9tZW50IGluc2lkZSBjb21tYW5kcy5qc1xuICAgIGlmICghcmVtb3RlKSByZXR1cm47XG5cbiAgICAvLyBDaGVjayBpZ25vcmVzXG4gICAgaWYgKHJlbW90ZSAhPT0gJy8nICYmIHRoaXMuY2hlY2tJZ25vcmUocmVtb3RlKSkge1xuICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2VucXVldWUoKCkgPT4ge1xuICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvTG9jYWwocmVtb3RlKTtcblxuICAgICAgdGhpcy5jb25uZWN0b3IubGlzdChyZW1vdGUsIHRydWUsIChlcnIsIHJlbW90ZXMpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrLmFwcGx5KG51bGwsIFtlcnJdKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBmb2xkZXIgaWYgbm8gZXhpc3RzIGluIGxvY2FsXG4gICAgICAgIG1rZGlyU3luY1JlY3Vyc2l2ZShsb2NhbCk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGlnbm9yZWQgcmVtb3Rlc1xuICAgICAgICBpZiAodGhpcy5pZ25vcmVGaWx0ZXIpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gcmVtb3Rlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tJZ25vcmUocmVtb3Rlc1tpXS5uYW1lKSkge1xuICAgICAgICAgICAgICByZW1vdGVzLnNwbGljZShpLCAxKTsgLy8gcmVtb3ZlIGZyb20gbGlzdFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyYXZlcnNlVHJlZShsb2NhbCwgKGxvY2FscykgPT4ge1xuICAgICAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2suYXBwbHkobnVsbCk7XG4gICAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IG4gPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZW1vdGVPbmUgPSByZW1vdGVzLnNoaWZ0KCk7XG4gICAgICAgICAgICBsZXQgbG9jO1xuXG4gICAgICAgICAgICBpZiAoIXJlbW90ZU9uZSkgcmV0dXJuIGVycm9yKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRvTG9jYWwgPSB0aGlzLnRvTG9jYWwocmVtb3RlT25lLm5hbWUpO1xuICAgICAgICAgICAgbG9jID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yIChsZXQgYSA9IDAsIGIgPSBsb2NhbHMubGVuZ3RoOyBhIDwgYjsgKythKSB7XG4gICAgICAgICAgICAgIGlmIChsb2NhbHNbYV0ubmFtZSA9PT0gdG9Mb2NhbCkge1xuICAgICAgICAgICAgICAgIGxvYyA9IGxvY2Fsc1thXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEb3dubG9hZCBvbmx5IGlmIG5vdCBwcmVzZW50IG9uIGxvY2FsIG9yIHNpemUgZGlmZmVyXG4gICAgICAgICAgICBpZiAoIWxvYyB8fCByZW1vdGVPbmUuc2l6ZSAhPT0gbG9jLnNpemUpIHtcbiAgICAgICAgICAgICAgdGhpcy5jb25uZWN0b3IuZ2V0KHJlbW90ZU9uZS5uYW1lLCB0cnVlLCAoKSA9PiBuKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHJlbW90ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rvci5nZXQocmVtb3RlLCBmYWxzZSwgKCkgPT4gbigpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbigpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGlzRmlsZSk7XG4gICAgICAvLyBOT1RFOiBBZGRlZCBpc0ZpbGUgdG8gZW5kIG9mIGNhbGwgdG8gcHJldmVudCBicmVha2luZyBhbnkgZnVuY3Rpb25zXG4gICAgICAvLyB0aGF0IGFscmVhZHkgdXNlIGxpc3QgY29tbWFuZC4gSXMgZmlsZSBpcyB1c2VkIG9ubHkgZm9yIGZ0cCBjb25uZWN0b3JcbiAgICAgIC8vIGFzIGl0IHdpbGwgbGlzdCBhIGZpbGUgYXMgYSBmaWxlIG9mIGl0c2VsZiB1bmxpbmtlIHdpdGggc2Z0cCB3aGljaFxuICAgICAgLy8gd2lsbCB0aHJvdyBhbiBlcnJvci5cbiAgICB9LCBgU3luYyAke1BhdGguYmFzZW5hbWUocmVtb3RlKX1gKTtcbiAgfVxuXG4gIHN5bmNMb2NhbEZpbGVUb1JlbW90ZShsb2NhbCwgY2FsbGJhY2spIHtcbiAgICAvLyBDaGVjayBpZ25vcmVzXG4gICAgaWYgKHRoaXMuY2hlY2tJZ25vcmUobG9jYWwpKSB7XG4gICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdmVyaWZ5IGFjdGl2ZSBjb25uZWN0aW9uXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSAnQ09OTkVDVEVEJykge1xuICAgICAgLy8gcHJvZ3Jlc3NcbiAgICAgIHRoaXMuX2VucXVldWUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rvci5wdXQobG9jYWwsIChlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjay5hcHBseShudWxsLCBbZXJyXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBgU3luYzogJHtQYXRoLmJhc2VuYW1lKGxvY2FsKX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdSZW1vdGUgRlRQOiBOb3QgY29ubmVjdGVkIScsIHtcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzeW5jTG9jYWxEaXJlY3RvcnlUb1JlbW90ZShsb2NhbCwgY2FsbGJhY2spIHtcbiAgICAvLyBDaGVjayBpZ25vcmVzXG4gICAgaWYgKHRoaXMuY2hlY2tJZ25vcmUobG9jYWwpKSB7XG4gICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdmVyaWZ5IGFjdGl2ZSBjb25uZWN0aW9uXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSAnQ09OTkVDVEVEJykge1xuICAgICAgdGhpcy5fZW5xdWV1ZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbW90ZSA9IHRoaXMudG9SZW1vdGUobG9jYWwpO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdG9yLmxpc3QocmVtb3RlLCB0cnVlLCAoZXJyLCByZW1vdGVzKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2suYXBwbHkobnVsbCwgW2Vycl0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHJlbW92ZSBpZ25vcmVkIHJlbW90ZXNcbiAgICAgICAgICBpZiAodGhpcy5pZ25vcmVGaWx0ZXIpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSByZW1vdGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrSWdub3JlKHJlbW90ZXNbaV0ubmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZW1vdGVzLnNwbGljZShpLCAxKTsgLy8gcmVtb3ZlIGZyb20gbGlzdFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdHJhdmVyc2VUcmVlKGxvY2FsLCAobG9jYWxzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2suYXBwbHkobnVsbCk7XG4gICAgICAgICAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBpZ25vcmVkIGxvY2Fsc1xuICAgICAgICAgICAgaWYgKHRoaXMuaWdub3JlRmlsdGVyKSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSBsb2NhbHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja0lnbm9yZShsb2NhbHNbaV0ubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgIGxvY2Fscy5zcGxpY2UoaSwgMSk7IC8vIHJlbW92ZSBmcm9tIGxpc3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbiA9ICgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgbkxvY2FsID0gbG9jYWxzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgIGxldCBuUmVtb3RlO1xuXG4gICAgICAgICAgICAgIGlmICghbkxvY2FsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb25zdCB0b1JlbW90ZSA9IHRoaXMudG9SZW1vdGUobkxvY2FsLm5hbWUpO1xuICAgICAgICAgICAgICBuUmVtb3RlID0gbnVsbDtcblxuICAgICAgICAgICAgICBmb3IgKGxldCBhID0gMCwgYiA9IHJlbW90ZXMubGVuZ3RoOyBhIDwgYjsgKythKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlbW90ZXNbYV0ubmFtZSA9PT0gdG9SZW1vdGUpIHtcbiAgICAgICAgICAgICAgICAgIG5SZW1vdGUgPSByZW1vdGVzW2FdO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gTk9URTogVXBsb2FkIG9ubHkgaWYgbm90IHByZXNlbnQgb24gcmVtb3RlIG9yIHNpemUgZGlmZmVyXG4gICAgICAgICAgICAgIGlmICghblJlbW90ZSkge1xuICAgICAgICAgICAgICAgIGlmIChuTG9jYWwudHlwZSA9PT0gJ2QnKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rvci5ta2Rpcih0b1JlbW90ZSwgZmFsc2UsICgpID0+IG4oKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuTG9jYWwudHlwZSA9PT0gJ2YnKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rvci5wdXQobkxvY2FsLm5hbWUsICgpID0+IG4oKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoblJlbW90ZS5zaXplICE9PSBuTG9jYWwuc2l6ZSAmJiBuTG9jYWwudHlwZSA9PT0gJ2YnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0b3IucHV0KG5Mb2NhbC5uYW1lLCAoKSA9PiBuKCkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG4oKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGBTeW5jICR7UGF0aC5iYXNlbmFtZShsb2NhbCl9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignUmVtb3RlIEZUUDogTm90IGNvbm5lY3RlZCEnLCB7XG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbWtkaXIocmVtb3RlLCByZWN1cnNpdmUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbmNlQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuX2VucXVldWUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rvci5ta2RpcihyZW1vdGUsIHJlY3Vyc2l2ZSwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYENyZWF0aW5nIGZvbGRlciAke1BhdGguYmFzZW5hbWUocmVtb3RlKX1gKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbWtmaWxlKHJlbW90ZSwgY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uY2VDb25uZWN0ZWQoKCkgPT4ge1xuICAgICAgdGhpcy5fZW5xdWV1ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yLm1rZmlsZShyZW1vdGUsICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGBDcmVhdGluZyBmaWxlICR7UGF0aC5iYXNlbmFtZShyZW1vdGUpfWApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW5hbWUoc291cmNlLCBkZXN0LCBjYWxsYmFjaykge1xuICAgIHRoaXMub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICB0aGlzLl9lbnF1ZXVlKCgpID0+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IucmVuYW1lKHNvdXJjZSwgZGVzdCwgKGVycikgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrLmFwcGx5KG51bGwsIFtlcnJdKTtcbiAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYFJlbmFtaW5nICR7UGF0aC5iYXNlbmFtZShzb3VyY2UpfWApO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZGVsZXRlKHJlbW90ZSwgY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uY2VDb25uZWN0ZWQoKCkgPT4ge1xuICAgICAgdGhpcy5fZW5xdWV1ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yLmRlbGV0ZShyZW1vdGUsICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGBEZWxldGluZyAke1BhdGguYmFzZW5hbWUocmVtb3RlKX1gKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2l0ZShjb21tYW5kLCBjYWxsYmFjaykge1xuICAgIHRoaXMub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICB0aGlzLmNvbm5lY3Rvci5zaXRlKGNvbW1hbmQsICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKGFyZ3MpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBjaG1vZChwYXRoLCBtb2RlLCBjYWxsYmFjaykge1xuICAgIHRoaXMub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICB0aGlzLmNvbm5lY3Rvci5jaG1vZChwYXRoLCBtb2RlLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gIH1cblxuICBjaG93bihwYXRoLCB1aWQsIGdpZCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uY2VDb25uZWN0ZWQoKCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBnaWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IuY2hvd24ocGF0aCwgdWlkLCBnaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IuY2hvd24ocGF0aCwgdWlkLCBnaWQsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNoZ3JwKHBhdGgsIHVpZCwgZ2lkLCBjYWxsYmFjaykge1xuICAgIHRoaXMub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICB0aGlzLmNvbm5lY3Rvci5jaGdycChwYXRoLCB1aWQsIGdpZCwgY2FsbGJhY2spO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvbXB0Rm9yUGFzcygpIHtcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgUHJvbXB0UGFzc0RpYWxvZygnJywgdHJ1ZSk7XG4gICAgZGlhbG9nLm9uKCdkaWFsb2ctZG9uZScsIChlLCBwYXNzKSA9PiB7XG4gICAgICB0aGlzLmluZm8ucGFzcyA9IHBhc3M7XG4gICAgICB0aGlzLmluZm8ucGFzc3BocmFzZSA9IHBhc3M7XG4gICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgIHRoaXMuZG9Db25uZWN0KCk7XG4gICAgfSk7XG4gICAgZGlhbG9nLmF0dGFjaCgpO1xuICB9XG5cbiAgcHJvbXB0Rm9yS2V5Ym9hcmRJbnRlcmFjdGl2ZSgpIHtcbiAgICBjb25zdCBkaWFsb2cgPSBuZXcgUHJvbXB0UGFzc0RpYWxvZyh0cnVlKTtcblxuICAgIGRpYWxvZy5vbignZGlhbG9nLWRvbmUnLCAoZSwgcGFzcykgPT4ge1xuICAgICAgdGhpcy5pbmZvLnZlcmlmeUNvZGUgPSBwYXNzO1xuICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICB0aGlzLmRvQ29ubmVjdCgpO1xuICAgIH0pO1xuXG4gICAgZGlhbG9nLmF0dGFjaCgpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKCk7XG4gICAgdGhpcy53YXRjaC5yZW1vdmVMaXN0ZW5lcnMoKTtcbiAgfVxufVxuIl19