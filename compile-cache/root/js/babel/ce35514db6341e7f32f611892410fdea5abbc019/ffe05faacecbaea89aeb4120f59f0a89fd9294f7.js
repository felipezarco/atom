Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _GitCommander = require('./GitCommander');

var _GitCommander2 = _interopRequireDefault(_GitCommander);

'use babel';

var Blamer = (function () {
  function Blamer(repo) {
    _classCallCheck(this, Blamer);

    if (!repo) {
      throw new Error('Cannot create a Blamer without a repository.');
    }
    this.repo = repo;
    this.initialize();
  }

  /**
   * Initializes this Blamer instance, by creating git-tools repos for the root
   * repository and submodules.
   */

  _createClass(Blamer, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      this.tools = {};
      this.tools.root = new _GitCommander2['default'](this.repo.getWorkingDirectory());

      var submodules = this.repo.submodules;

      if (submodules) {
        (0, _lodash.each)(submodules, function (submodule, submodulePath) {
          _this.tools[submodulePath] = new _GitCommander2['default'](_this.repo.getWorkingDirectory() + '/' + submodulePath);
        });
      }
    }

    /**
     * Blames the given filePath and calls callback with blame lines or error.
     *
     * @param {string} filePath - filePath to blame
     * @param {function} callback - callback to call back with blame data
     */
  }, {
    key: 'blame',
    value: function blame(filePath, callback) {
      // Ensure file path is relative to root repo
      var cleanedFilePath = this.repo.relativize(filePath);
      var repoUtil = this.repoUtilForPath(cleanedFilePath);

      // Ensure that if this file is in a submodule, we remove the submodule dir
      // from the path
      cleanedFilePath = this.removeSubmodulePrefix(cleanedFilePath);

      if (!(0, _lodash.isFunction)(callback)) {
        throw new Error('Must be called with a callback function');
      }

      // Make the async blame call on the git repo
      repoUtil.blame(cleanedFilePath, function (err, blame) {
        callback(err, blame);
      });
    }

    /**
     * Utility to get the GitCommander repository for the given filePath. Takes into
     * account whether the file is part of a submodule and returns that repository
     * if necessary.
     *
     * @param {string} filePath - the path to the file in question.
     */
  }, {
    key: 'repoUtilForPath',
    value: function repoUtilForPath(filePath) {
      var _this2 = this;

      var submodules = this.repo.submodules;

      // By default, we return the root GitCommander repository.
      var repoUtil = this.tools.root;

      // if we have submodules, loop through them and see if the given file path
      // belongs inside one of the repositories. If so, we return the GitCommander repo
      // for that submodule.
      if (submodules) {
        (0, _lodash.each)(submodules, function (submodule, submodulePath) {
          var submoduleRegex = new RegExp('^' + submodulePath);
          if (submoduleRegex.test(filePath)) {
            repoUtil = _this2.tools[submodulePath];
          }
        });
      }

      return repoUtil;
    }

    /**
     * If the file path given is inside a submodule, removes the submodule
     * directory prefix.
     *
     * @param {string} filePath - path to file to relativize
     * @param {Repo} toolsRepo - git-tools Repo
     */
  }, {
    key: 'removeSubmodulePrefix',
    value: function removeSubmodulePrefix(filePath) {
      var trimmedFilePath = filePath;
      var submodules = this.repo.submodules;

      if (submodules) {
        (0, _lodash.each)(submodules, function (submodule, submodulePath) {
          var submoduleRegex = new RegExp('^' + submodulePath);
          if (submoduleRegex.test(trimmedFilePath)) {
            trimmedFilePath = filePath.replace(submoduleRegex, '');
          }
        });
      }

      // remove leading '/' if there is one before returning
      return trimmedFilePath.replace(/^\//, '');
    }
  }]);

  return Blamer;
})();

exports['default'] = Blamer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvQmxhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWlDLFFBQVE7OzRCQUNoQixnQkFBZ0I7Ozs7QUFIekMsV0FBVyxDQUFDOztJQUtTLE1BQU07QUFFZCxXQUZRLE1BQU0sQ0FFYixJQUFJLEVBQUU7MEJBRkMsTUFBTTs7QUFHdkIsUUFBSSxDQUFDLElBQUksRUFBRTtBQUNULFlBQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztLQUNqRTtBQUNELFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNuQjs7Ozs7OztlQVJrQixNQUFNOztXQWNmLHNCQUFHOzs7QUFDWCxVQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyw4QkFBaUIsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7O1VBRTdELFVBQVUsR0FBSSxJQUFJLENBQUMsSUFBSSxDQUF2QixVQUFVOztBQUNqQixVQUFJLFVBQVUsRUFBRTtBQUNkLDBCQUFLLFVBQVUsRUFBRSxVQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUs7QUFDN0MsZ0JBQUssS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLDhCQUFvQixNQUFLLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxTQUFJLGFBQWEsQ0FBRyxDQUFDO1NBQ3JHLENBQUMsQ0FBQztPQUNKO0tBQ0Y7Ozs7Ozs7Ozs7V0FRSSxlQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7O0FBRXhCLFVBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JELFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7Ozs7QUFJdkQscUJBQWUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRTlELFVBQUksQ0FBQyx3QkFBVyxRQUFRLENBQUMsRUFBRTtBQUN6QixjQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7T0FDNUQ7OztBQUdELGNBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLFVBQVUsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUNwRCxnQkFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUN0QixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7Ozs7V0FTYyx5QkFBQyxRQUFRLEVBQUU7OztVQUNqQixVQUFVLEdBQUksSUFBSSxDQUFDLElBQUksQ0FBdkIsVUFBVTs7O0FBR2pCLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDOzs7OztBQUsvQixVQUFJLFVBQVUsRUFBRTtBQUNkLDBCQUFLLFVBQVUsRUFBRSxVQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUs7QUFDN0MsY0FBTSxjQUFjLEdBQUcsSUFBSSxNQUFNLE9BQUssYUFBYSxDQUFHLENBQUM7QUFDdkQsY0FBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2pDLG9CQUFRLEdBQUcsT0FBSyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7V0FDdEM7U0FDRixDQUFDLENBQUM7T0FDSjs7QUFFRCxhQUFPLFFBQVEsQ0FBQztLQUNqQjs7Ozs7Ozs7Ozs7V0FTb0IsK0JBQUMsUUFBUSxFQUFFO0FBQzlCLFVBQUksZUFBZSxHQUFHLFFBQVEsQ0FBQztVQUN4QixVQUFVLEdBQUksSUFBSSxDQUFDLElBQUksQ0FBdkIsVUFBVTs7QUFDakIsVUFBSSxVQUFVLEVBQUU7QUFDZCwwQkFBSyxVQUFVLEVBQUUsVUFBQyxTQUFTLEVBQUUsYUFBYSxFQUFLO0FBQzdDLGNBQU0sY0FBYyxHQUFHLElBQUksTUFBTSxPQUFLLGFBQWEsQ0FBRyxDQUFDO0FBQ3ZELGNBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTtBQUN4QywyQkFBZSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1dBQ3hEO1NBQ0YsQ0FBQyxDQUFDO09BQ0o7OztBQUdELGFBQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDM0M7OztTQXBHa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9CbGFtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgaXNGdW5jdGlvbiwgZWFjaCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgR2l0Q29tbWFuZGVyIGZyb20gJy4vR2l0Q29tbWFuZGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxhbWVyIHtcblxuICBjb25zdHJ1Y3RvcihyZXBvKSB7XG4gICAgaWYgKCFyZXBvKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgYSBCbGFtZXIgd2l0aG91dCBhIHJlcG9zaXRvcnkuJyk7XG4gICAgfVxuICAgIHRoaXMucmVwbyA9IHJlcG87XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhpcyBCbGFtZXIgaW5zdGFuY2UsIGJ5IGNyZWF0aW5nIGdpdC10b29scyByZXBvcyBmb3IgdGhlIHJvb3RcbiAgICogcmVwb3NpdG9yeSBhbmQgc3VibW9kdWxlcy5cbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy50b29scyA9IHt9O1xuICAgIHRoaXMudG9vbHMucm9vdCA9IG5ldyBHaXRDb21tYW5kZXIodGhpcy5yZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSk7XG5cbiAgICBjb25zdCB7c3VibW9kdWxlc30gPSB0aGlzLnJlcG87XG4gICAgaWYgKHN1Ym1vZHVsZXMpIHtcbiAgICAgIGVhY2goc3VibW9kdWxlcywgKHN1Ym1vZHVsZSwgc3VibW9kdWxlUGF0aCkgPT4ge1xuICAgICAgICB0aGlzLnRvb2xzW3N1Ym1vZHVsZVBhdGhdID0gbmV3IEdpdENvbW1hbmRlcihgJHt0aGlzLnJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpfS8ke3N1Ym1vZHVsZVBhdGh9YCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQmxhbWVzIHRoZSBnaXZlbiBmaWxlUGF0aCBhbmQgY2FsbHMgY2FsbGJhY2sgd2l0aCBibGFtZSBsaW5lcyBvciBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gZmlsZVBhdGggdG8gYmxhbWVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayB0byBjYWxsIGJhY2sgd2l0aCBibGFtZSBkYXRhXG4gICAqL1xuICBibGFtZShmaWxlUGF0aCwgY2FsbGJhY2spIHtcbiAgICAvLyBFbnN1cmUgZmlsZSBwYXRoIGlzIHJlbGF0aXZlIHRvIHJvb3QgcmVwb1xuICAgIGxldCBjbGVhbmVkRmlsZVBhdGggPSB0aGlzLnJlcG8ucmVsYXRpdml6ZShmaWxlUGF0aCk7XG4gICAgY29uc3QgcmVwb1V0aWwgPSB0aGlzLnJlcG9VdGlsRm9yUGF0aChjbGVhbmVkRmlsZVBhdGgpO1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgaWYgdGhpcyBmaWxlIGlzIGluIGEgc3VibW9kdWxlLCB3ZSByZW1vdmUgdGhlIHN1Ym1vZHVsZSBkaXJcbiAgICAvLyBmcm9tIHRoZSBwYXRoXG4gICAgY2xlYW5lZEZpbGVQYXRoID0gdGhpcy5yZW1vdmVTdWJtb2R1bGVQcmVmaXgoY2xlYW5lZEZpbGVQYXRoKTtcblxuICAgIGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBiZSBjYWxsZWQgd2l0aCBhIGNhbGxiYWNrIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgLy8gTWFrZSB0aGUgYXN5bmMgYmxhbWUgY2FsbCBvbiB0aGUgZ2l0IHJlcG9cbiAgICByZXBvVXRpbC5ibGFtZShjbGVhbmVkRmlsZVBhdGgsIGZ1bmN0aW9uIChlcnIsIGJsYW1lKSB7XG4gICAgICBjYWxsYmFjayhlcnIsIGJsYW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IHRvIGdldCB0aGUgR2l0Q29tbWFuZGVyIHJlcG9zaXRvcnkgZm9yIHRoZSBnaXZlbiBmaWxlUGF0aC4gVGFrZXMgaW50b1xuICAgKiBhY2NvdW50IHdoZXRoZXIgdGhlIGZpbGUgaXMgcGFydCBvZiBhIHN1Ym1vZHVsZSBhbmQgcmV0dXJucyB0aGF0IHJlcG9zaXRvcnlcbiAgICogaWYgbmVjZXNzYXJ5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSB0aGUgcGF0aCB0byB0aGUgZmlsZSBpbiBxdWVzdGlvbi5cbiAgICovXG4gIHJlcG9VdGlsRm9yUGF0aChmaWxlUGF0aCkge1xuICAgIGNvbnN0IHtzdWJtb2R1bGVzfSA9IHRoaXMucmVwbztcblxuICAgIC8vIEJ5IGRlZmF1bHQsIHdlIHJldHVybiB0aGUgcm9vdCBHaXRDb21tYW5kZXIgcmVwb3NpdG9yeS5cbiAgICBsZXQgcmVwb1V0aWwgPSB0aGlzLnRvb2xzLnJvb3Q7XG5cbiAgICAvLyBpZiB3ZSBoYXZlIHN1Ym1vZHVsZXMsIGxvb3AgdGhyb3VnaCB0aGVtIGFuZCBzZWUgaWYgdGhlIGdpdmVuIGZpbGUgcGF0aFxuICAgIC8vIGJlbG9uZ3MgaW5zaWRlIG9uZSBvZiB0aGUgcmVwb3NpdG9yaWVzLiBJZiBzbywgd2UgcmV0dXJuIHRoZSBHaXRDb21tYW5kZXIgcmVwb1xuICAgIC8vIGZvciB0aGF0IHN1Ym1vZHVsZS5cbiAgICBpZiAoc3VibW9kdWxlcykge1xuICAgICAgZWFjaChzdWJtb2R1bGVzLCAoc3VibW9kdWxlLCBzdWJtb2R1bGVQYXRoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1Ym1vZHVsZVJlZ2V4ID0gbmV3IFJlZ0V4cChgXiR7c3VibW9kdWxlUGF0aH1gKTtcbiAgICAgICAgaWYgKHN1Ym1vZHVsZVJlZ2V4LnRlc3QoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgcmVwb1V0aWwgPSB0aGlzLnRvb2xzW3N1Ym1vZHVsZVBhdGhdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVwb1V0aWw7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGZpbGUgcGF0aCBnaXZlbiBpcyBpbnNpZGUgYSBzdWJtb2R1bGUsIHJlbW92ZXMgdGhlIHN1Ym1vZHVsZVxuICAgKiBkaXJlY3RvcnkgcHJlZml4LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBwYXRoIHRvIGZpbGUgdG8gcmVsYXRpdml6ZVxuICAgKiBAcGFyYW0ge1JlcG99IHRvb2xzUmVwbyAtIGdpdC10b29scyBSZXBvXG4gICAqL1xuICByZW1vdmVTdWJtb2R1bGVQcmVmaXgoZmlsZVBhdGgpIHtcbiAgICBsZXQgdHJpbW1lZEZpbGVQYXRoID0gZmlsZVBhdGg7XG4gICAgY29uc3Qge3N1Ym1vZHVsZXN9ID0gdGhpcy5yZXBvO1xuICAgIGlmIChzdWJtb2R1bGVzKSB7XG4gICAgICBlYWNoKHN1Ym1vZHVsZXMsIChzdWJtb2R1bGUsIHN1Ym1vZHVsZVBhdGgpID0+IHtcbiAgICAgICAgY29uc3Qgc3VibW9kdWxlUmVnZXggPSBuZXcgUmVnRXhwKGBeJHtzdWJtb2R1bGVQYXRofWApO1xuICAgICAgICBpZiAoc3VibW9kdWxlUmVnZXgudGVzdCh0cmltbWVkRmlsZVBhdGgpKSB7XG4gICAgICAgICAgdHJpbW1lZEZpbGVQYXRoID0gZmlsZVBhdGgucmVwbGFjZShzdWJtb2R1bGVSZWdleCwgJycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgbGVhZGluZyAnLycgaWYgdGhlcmUgaXMgb25lIGJlZm9yZSByZXR1cm5pbmdcbiAgICByZXR1cm4gdHJpbW1lZEZpbGVQYXRoLnJlcGxhY2UoL15cXC8vLCAnJyk7XG4gIH1cblxufVxuIl19