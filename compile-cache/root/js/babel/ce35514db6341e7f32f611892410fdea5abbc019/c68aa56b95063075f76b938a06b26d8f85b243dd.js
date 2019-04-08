Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _blameFormatter = require('./blameFormatter');

/**
 * @module GitCommander
 *
 * Utility for executing git commands on a repo in a given working directory.
 */
'use babel';

var GitCommander = (function () {
  function GitCommander(path) {
    _classCallCheck(this, GitCommander);

    this.workingDirectory = path;
  }

  /**
   * Spawns a process to execute a git command in the GitCommander instances
   * working directory.
   *
   * @param {array|string} args - arguments to call `git` with on the command line
   * @param {function} callback - node callback for error and command output
   */

  _createClass(GitCommander, [{
    key: 'exec',
    value: function exec(args, callback) {
      if (!(0, _lodash.isArray)(args) || !(0, _lodash.isFunction)(callback)) {
        return;
      }

      var gitBinary = atom.config.get('git-blame.gitBinaryPath') || 'git';

      var child = _child_process2['default'].spawn(gitBinary, args, { cwd: this.workingDirectory });
      var stdout = '';
      var stderr = '';
      var processError = undefined;

      child.stdout.on('data', function (data) {
        stdout += data;
      });

      child.stderr.on('data', function (data) {
        stderr += data;
      });

      child.on('error', function (error) {
        processError = error;
      });

      child.on('close', function (errorCode) {
        if (processError) {
          return callback(processError);
        }

        if (errorCode) {
          var error = new Error(stderr);
          error.code = errorCode;
          return callback(error);
        }

        return callback(null, stdout.trimRight());
      });
    }

    /**
     * Executes git blame on the input file in the instances working directory
     *
     * @param {string} fileName - name of file to blame, relative to the repos
     *   working directory
     * @param {function} callback - callback funtion to call with results or error
     */
  }, {
    key: 'blame',
    value: function blame(fileName, callback) {
      var args = ['blame', '--line-porcelain'];

      // ignore white space based on config
      if (atom.config.get('git-blame.ignoreWhiteSpaceDiffs')) {
        args.push('-w');
      }

      args.push(fileName);

      // Execute blame command and parse
      this.exec(args, function (err, blameStdOut) {
        if (err) {
          return callback(err, blameStdOut);
        }

        return callback(null, (0, _blameFormatter.parseBlame)(blameStdOut));
      });
    }

    /**
     * Executes git config --get
     *
     * @param {string} name - the name of the variable to look up eg: "group.varName"
     * @param {function} callback - callback funtion to call with results or error
     */
  }, {
    key: 'config',
    value: function config(name, callback) {
      var args = ['config', '--get', name];

      // Execute config command
      this.exec(args, function (err, configStdOut) {
        if (err) {
          // Error code 1 means, this variable is not present in the config
          if (err.code === 1) {
            return callback(null, '');
          }
          return callback(err, configStdOut);
        }

        return callback(null, configStdOut);
      });
    }
  }]);

  return GitCommander;
})();

exports['default'] = GitCommander;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvR2l0Q29tbWFuZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRW9DLFFBQVE7OzZCQUNuQixlQUFlOzs7OzhCQUViLGtCQUFrQjs7Ozs7OztBQUw3QyxXQUFXLENBQUM7O0lBWVMsWUFBWTtBQUVwQixXQUZRLFlBQVksQ0FFbkIsSUFBSSxFQUFFOzBCQUZDLFlBQVk7O0FBRzdCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7R0FDOUI7Ozs7Ozs7Ozs7ZUFKa0IsWUFBWTs7V0FhM0IsY0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ25CLFVBQUksQ0FBQyxxQkFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUFXLFFBQVEsQ0FBQyxFQUFFO0FBQzNDLGVBQU87T0FDUjs7QUFFRCxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLEtBQUssQ0FBQzs7QUFFdEUsVUFBTSxLQUFLLEdBQUcsMkJBQWEsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFDLENBQUMsQ0FBQztBQUNoRixVQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsVUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFVBQUksWUFBWSxZQUFBLENBQUM7O0FBRWpCLFdBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLElBQUksRUFBRTtBQUN0QyxjQUFNLElBQUksSUFBSSxDQUFDO09BQ2hCLENBQUMsQ0FBQzs7QUFFSCxXQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxJQUFJLEVBQUU7QUFDdEMsY0FBTSxJQUFJLElBQUksQ0FBQztPQUNoQixDQUFDLENBQUM7O0FBRUgsV0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDakMsb0JBQVksR0FBRyxLQUFLLENBQUM7T0FDdEIsQ0FBQyxDQUFDOztBQUVILFdBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsU0FBUyxFQUFFO0FBQ3JDLFlBQUksWUFBWSxFQUFFO0FBQ2hCLGlCQUFPLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUMvQjs7QUFFRCxZQUFJLFNBQVMsRUFBRTtBQUNiLGNBQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLGVBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3ZCLGlCQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4Qjs7QUFFRCxlQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7T0FDM0MsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7Ozs7O1dBU0ksZUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0FBQ3hCLFVBQU0sSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLENBQUM7OztBQUczQyxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLEVBQUU7QUFDdEQsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNqQjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHcEIsVUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxHQUFHLEVBQUUsV0FBVyxFQUFFO0FBQzFDLFlBQUksR0FBRyxFQUFFO0FBQ1AsaUJBQU8sUUFBUSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztTQUNuQzs7QUFFRCxlQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsZ0NBQVcsV0FBVyxDQUFDLENBQUMsQ0FBQztPQUNoRCxDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7OztXQVFLLGdCQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDckIsVUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDOzs7QUFHdkMsVUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxHQUFHLEVBQUUsWUFBWSxFQUFFO0FBQzNDLFlBQUksR0FBRyxFQUFFOztBQUVQLGNBQUksR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7QUFDbEIsbUJBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztXQUMzQjtBQUNELGlCQUFPLFFBQVEsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDcEM7O0FBRUQsZUFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO09BQ3JDLENBQUMsQ0FBQztLQUNKOzs7U0FwR2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvR2l0Q29tbWFuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IGlzQXJyYXksIGlzRnVuY3Rpb24gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGNoaWxkUHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcblxuaW1wb3J0IHsgcGFyc2VCbGFtZSB9IGZyb20gJy4vYmxhbWVGb3JtYXR0ZXInO1xuXG4vKipcbiAqIEBtb2R1bGUgR2l0Q29tbWFuZGVyXG4gKlxuICogVXRpbGl0eSBmb3IgZXhlY3V0aW5nIGdpdCBjb21tYW5kcyBvbiBhIHJlcG8gaW4gYSBnaXZlbiB3b3JraW5nIGRpcmVjdG9yeS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0Q29tbWFuZGVyIHtcblxuICBjb25zdHJ1Y3RvcihwYXRoKSB7XG4gICAgdGhpcy53b3JraW5nRGlyZWN0b3J5ID0gcGF0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGF3bnMgYSBwcm9jZXNzIHRvIGV4ZWN1dGUgYSBnaXQgY29tbWFuZCBpbiB0aGUgR2l0Q29tbWFuZGVyIGluc3RhbmNlc1xuICAgKiB3b3JraW5nIGRpcmVjdG9yeS5cbiAgICpcbiAgICogQHBhcmFtIHthcnJheXxzdHJpbmd9IGFyZ3MgLSBhcmd1bWVudHMgdG8gY2FsbCBgZ2l0YCB3aXRoIG9uIHRoZSBjb21tYW5kIGxpbmVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBub2RlIGNhbGxiYWNrIGZvciBlcnJvciBhbmQgY29tbWFuZCBvdXRwdXRcbiAgICovXG4gIGV4ZWMoYXJncywgY2FsbGJhY2spIHtcbiAgICBpZiAoIWlzQXJyYXkoYXJncykgfHwgIWlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZ2l0QmluYXJ5ID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUuZ2l0QmluYXJ5UGF0aCcpIHx8ICdnaXQnO1xuXG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZFByb2Nlc3Muc3Bhd24oZ2l0QmluYXJ5LCBhcmdzLCB7Y3dkOiB0aGlzLndvcmtpbmdEaXJlY3Rvcnl9KTtcbiAgICBsZXQgc3Rkb3V0ID0gJyc7XG4gICAgbGV0IHN0ZGVyciA9ICcnO1xuICAgIGxldCBwcm9jZXNzRXJyb3I7XG5cbiAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgc3Rkb3V0ICs9IGRhdGE7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgc3RkZXJyICs9IGRhdGE7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHByb2Nlc3NFcnJvciA9IGVycm9yO1xuICAgIH0pO1xuXG4gICAgY2hpbGQub24oJ2Nsb3NlJywgZnVuY3Rpb24gKGVycm9yQ29kZSkge1xuICAgICAgaWYgKHByb2Nlc3NFcnJvcikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2socHJvY2Vzc0Vycm9yKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9yQ29kZSkge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihzdGRlcnIpO1xuICAgICAgICBlcnJvci5jb2RlID0gZXJyb3JDb2RlO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgc3Rkb3V0LnRyaW1SaWdodCgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyBnaXQgYmxhbWUgb24gdGhlIGlucHV0IGZpbGUgaW4gdGhlIGluc3RhbmNlcyB3b3JraW5nIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWUgLSBuYW1lIG9mIGZpbGUgdG8gYmxhbWUsIHJlbGF0aXZlIHRvIHRoZSByZXBvc1xuICAgKiAgIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVudGlvbiB0byBjYWxsIHdpdGggcmVzdWx0cyBvciBlcnJvclxuICAgKi9cbiAgYmxhbWUoZmlsZU5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgYXJncyA9IFsnYmxhbWUnLCAnLS1saW5lLXBvcmNlbGFpbiddO1xuXG4gICAgLy8gaWdub3JlIHdoaXRlIHNwYWNlIGJhc2VkIG9uIGNvbmZpZ1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2dpdC1ibGFtZS5pZ25vcmVXaGl0ZVNwYWNlRGlmZnMnKSkge1xuICAgICAgYXJncy5wdXNoKCctdycpO1xuICAgIH1cblxuICAgIGFyZ3MucHVzaChmaWxlTmFtZSk7XG5cbiAgICAvLyBFeGVjdXRlIGJsYW1lIGNvbW1hbmQgYW5kIHBhcnNlXG4gICAgdGhpcy5leGVjKGFyZ3MsIGZ1bmN0aW9uIChlcnIsIGJsYW1lU3RkT3V0KSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIGJsYW1lU3RkT3V0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHBhcnNlQmxhbWUoYmxhbWVTdGRPdXQpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyBnaXQgY29uZmlnIC0tZ2V0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlIHRvIGxvb2sgdXAgZWc6IFwiZ3JvdXAudmFyTmFtZVwiXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVudGlvbiB0byBjYWxsIHdpdGggcmVzdWx0cyBvciBlcnJvclxuICAgKi9cbiAgY29uZmlnKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgYXJncyA9IFsnY29uZmlnJywgJy0tZ2V0JywgbmFtZV07XG5cbiAgICAvLyBFeGVjdXRlIGNvbmZpZyBjb21tYW5kXG4gICAgdGhpcy5leGVjKGFyZ3MsIGZ1bmN0aW9uIChlcnIsIGNvbmZpZ1N0ZE91dCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBFcnJvciBjb2RlIDEgbWVhbnMsIHRoaXMgdmFyaWFibGUgaXMgbm90IHByZXNlbnQgaW4gdGhlIGNvbmZpZ1xuICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIGNvbmZpZ1N0ZE91dCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBjb25maWdTdGRPdXQpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=