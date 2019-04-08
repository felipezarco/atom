Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _loophole = require('loophole');

var _loophole2 = _interopRequireDefault(_loophole);

var _controllersErrorController = require('../controllers/errorController');

'use babel';

var GITHUB_TEMPLATE = 'https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>';
var BITBUCKET_TEMPLATE = 'https://bitbucket.org/<%- project %>/<%- repo %>/commits/<%- revision %>';
var GITLAB_TEMPLATE = 'https://gitlab.com/<%- project %>/<%- repo %>/commit/<%- revision %>';

function safeTemplate(templateString) {
  return _loophole2['default'].allowUnsafeNewFunction(function () {
    return _lodash2['default'].template(templateString);
  });
}

var RemoteRevision = (function () {
  function RemoteRevision(remote, gitConfigRepositoryUrl) {
    _classCallCheck(this, RemoteRevision);

    this.remote = remote || '';
    this.gitConfigRepositoryUrl = gitConfigRepositoryUrl;
    this.initialize();
  }

  _createClass(RemoteRevision, [{
    key: 'initialize',
    value: function initialize() {
      var data = this.parseProjectAndRepo();
      if (data.project && data.repo) {
        this.project = data.project;
        this.repo = data.repo;
      } else if (this.remote !== '') {
        // we were unable to parse data from the remote...
        (0, _controllersErrorController.showError)('error-problem-parsing-data-from-remote');
      }
    }

    /**
     * Generates a URL for the given revision/commit identifier based on the parsed
     * remote data and the template.
     */
  }, {
    key: 'url',
    value: function url(revision) {
      var template = this.getTemplate();
      if (!template) {
        // this should be impossible, so throw
        throw new Error('No template present in RemoteRevision');
      }

      // we were unable to parse upon initialization...so return empty url
      if (!this.project || !this.repo || !revision) {
        return '';
      }

      // create data object used to render template string
      var data = {
        revision: revision,
        project: this.project,
        repo: this.repo
      };

      // return a rendered url
      return template(data);
    }

    /**
     * Parses project and repo from this.remote.
     *
     * @returns Object containing the project and repo.
     */
  }, {
    key: 'parseProjectAndRepo',
    value: function parseProjectAndRepo() {
      // strip off .git if its there
      var strippedRemoteUrl = this.remote.replace(/(\.git)$/, '');

      var pattern = /[:/]([.\w-]*)?\/?([.\w-]*)$/;
      var matches = strippedRemoteUrl.match(pattern);

      // if we have no matches just return empty object. caller should validate
      // data before using it.
      if (!matches) {
        return {};
      }

      // if no project is matched, project and repo are the same.
      return {
        project: matches[1],
        repo: matches[2] || matches[1]
      };
    }

    /**
     * Creates a template function using default GitHub / Bitbucket / GitLab
     * url templates or a custom url template strings specified in the configs.
     */
  }, {
    key: 'getTemplate',
    value: function getTemplate() {
      if (this.isGitHub()) {
        return safeTemplate(GITHUB_TEMPLATE);
      }

      if (this.isBitbucket()) {
        return safeTemplate(BITBUCKET_TEMPLATE);
      }

      if (this.isGitLab()) {
        return safeTemplate(GITLAB_TEMPLATE);
      }

      if (atom.config.get('git-blame.useCustomUrlTemplateIfStandardRemotesFail')) {
        if (this.gitConfigRepositoryUrl) {
          return safeTemplate(this.gitConfigRepositoryUrl);
        }

        var customUrlTemplate = atom.config.get('git-blame.customCommitUrlTemplateString');

        // if the user hasnt entered a template string, return nothing
        if (/^Example/.test(customUrlTemplate)) {
          return;
        }

        return safeTemplate(customUrlTemplate);
      }
    }

    /**
     * Returns true if this RemoteRevision represents a GitHub repository.
     */
  }, {
    key: 'isGitHub',
    value: function isGitHub() {
      return (/github.com/.test(this.remote)
      );
    }

    /**
     * Returns true if this RemoteRevision represents a Bitbucket repository.
     */
  }, {
    key: 'isBitbucket',
    value: function isBitbucket() {
      return (/bitbucket.org/.test(this.remote)
      );
    }

    /**
     * Returns true if this RemoteRevision represents a GitLab repository.
     */
  }, {
    key: 'isGitLab',
    value: function isGitLab() {
      return (/gitlab.com/.test(this.remote)
      );
    }
  }], [{
    key: 'create',
    value: function create(remoteUrl) {
      var rr = new RemoteRevision(remoteUrl);
      if (!rr.getTemplate()) {
        throw new Error('Cannot create RemoteRevision with invalid template');
      }
      return rr;
    }
  }]);

  return RemoteRevision;
})();

exports['default'] = RemoteRevision;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvUmVtb3RlUmV2aXNpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O3dCQUNELFVBQVU7Ozs7MENBQ0wsZ0NBQWdDOztBQUoxRCxXQUFXLENBQUM7O0FBTVosSUFBTSxlQUFlLEdBQUcsc0VBQXNFLENBQUM7QUFDL0YsSUFBTSxrQkFBa0IsR0FBRywwRUFBMEUsQ0FBQztBQUN0RyxJQUFNLGVBQWUsR0FBRyxzRUFBc0UsQ0FBQzs7QUFFL0YsU0FBUyxZQUFZLENBQUMsY0FBYyxFQUFFO0FBQ3BDLFNBQU8sc0JBQVMsc0JBQXNCLENBQUMsWUFBWTtBQUNqRCxXQUFPLG9CQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztHQUNuQyxDQUFDLENBQUM7Q0FDSjs7SUFFb0IsY0FBYztBQUV0QixXQUZRLGNBQWMsQ0FFckIsTUFBTSxFQUFFLHNCQUFzQixFQUFFOzBCQUZ6QixjQUFjOztBQUcvQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDM0IsUUFBSSxDQUFDLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDO0FBQ3JELFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNuQjs7ZUFOa0IsY0FBYzs7V0FnQnZCLHNCQUFHO0FBQ1gsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDeEMsVUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDN0IsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzVCLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztPQUN2QixNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxFQUFFLEVBQUU7O0FBRTdCLG1EQUFVLHdDQUF3QyxDQUFDLENBQUM7T0FD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ZGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9ob21lL2ZlbGlwZS8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvUmVtb3RlUmV2aXNpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBsb29waG9sZSBmcm9tICdsb29waG9sZSc7XG5pbXBvcnQgeyBzaG93RXJyb3IgfSBmcm9tICcuLi9jb250cm9sbGVycy9lcnJvckNvbnRyb2xsZXInO1xuXG5jb25zdCBHSVRIVUJfVEVNUExBVEUgPSAnaHR0cHM6Ly9naXRodWIuY29tLzwlLSBwcm9qZWN0ICU+LzwlLSByZXBvICU+L2NvbW1pdC88JS0gcmV2aXNpb24gJT4nO1xuY29uc3QgQklUQlVDS0VUX1RFTVBMQVRFID0gJ2h0dHBzOi8vYml0YnVja2V0Lm9yZy88JS0gcHJvamVjdCAlPi88JS0gcmVwbyAlPi9jb21taXRzLzwlLSByZXZpc2lvbiAlPic7XG5jb25zdCBHSVRMQUJfVEVNUExBVEUgPSAnaHR0cHM6Ly9naXRsYWIuY29tLzwlLSBwcm9qZWN0ICU+LzwlLSByZXBvICU+L2NvbW1pdC88JS0gcmV2aXNpb24gJT4nO1xuXG5mdW5jdGlvbiBzYWZlVGVtcGxhdGUodGVtcGxhdGVTdHJpbmcpIHtcbiAgcmV0dXJuIGxvb3Bob2xlLmFsbG93VW5zYWZlTmV3RnVuY3Rpb24oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfLnRlbXBsYXRlKHRlbXBsYXRlU3RyaW5nKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90ZVJldmlzaW9uIHtcblxuICBjb25zdHJ1Y3RvcihyZW1vdGUsIGdpdENvbmZpZ1JlcG9zaXRvcnlVcmwpIHtcbiAgICB0aGlzLnJlbW90ZSA9IHJlbW90ZSB8fCAnJztcbiAgICB0aGlzLmdpdENvbmZpZ1JlcG9zaXRvcnlVcmwgPSBnaXRDb25maWdSZXBvc2l0b3J5VXJsO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZShyZW1vdGVVcmwpIHtcbiAgICBjb25zdCByciA9IG5ldyBSZW1vdGVSZXZpc2lvbihyZW1vdGVVcmwpO1xuICAgIGlmICghcnIuZ2V0VGVtcGxhdGUoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIFJlbW90ZVJldmlzaW9uIHdpdGggaW52YWxpZCB0ZW1wbGF0ZScpO1xuICAgIH1cbiAgICByZXR1cm4gcnI7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBhcnNlUHJvamVjdEFuZFJlcG8oKTtcbiAgICBpZiAoZGF0YS5wcm9qZWN0ICYmIGRhdGEucmVwbykge1xuICAgICAgdGhpcy5wcm9qZWN0ID0gZGF0YS5wcm9qZWN0O1xuICAgICAgdGhpcy5yZXBvID0gZGF0YS5yZXBvO1xuICAgIH0gZWxzZSBpZiAodGhpcy5yZW1vdGUgIT09ICcnKSB7XG4gICAgICAvLyB3ZSB3ZXJlIHVuYWJsZSB0byBwYXJzZSBkYXRhIGZyb20gdGhlIHJlbW90ZS4uLlxuICAgICAgc2hvd0Vycm9yKCdlcnJvci1wcm9ibGVtLXBhcnNpbmctZGF0YS1mcm9tLXJlbW90ZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBVUkwgZm9yIHRoZSBnaXZlbiByZXZpc2lvbi9jb21taXQgaWRlbnRpZmllciBiYXNlZCBvbiB0aGUgcGFyc2VkXG4gICAqIHJlbW90ZSBkYXRhIGFuZCB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICB1cmwocmV2aXNpb24pIHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKTtcbiAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAvLyB0aGlzIHNob3VsZCBiZSBpbXBvc3NpYmxlLCBzbyB0aHJvd1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyB0ZW1wbGF0ZSBwcmVzZW50IGluIFJlbW90ZVJldmlzaW9uJyk7XG4gICAgfVxuXG4gICAgLy8gd2Ugd2VyZSB1bmFibGUgdG8gcGFyc2UgdXBvbiBpbml0aWFsaXphdGlvbi4uLnNvIHJldHVybiBlbXB0eSB1cmxcbiAgICBpZiAoIXRoaXMucHJvamVjdCB8fCAhdGhpcy5yZXBvIHx8ICFyZXZpc2lvbikge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBkYXRhIG9iamVjdCB1c2VkIHRvIHJlbmRlciB0ZW1wbGF0ZSBzdHJpbmdcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgcmV2aXNpb246IHJldmlzaW9uLFxuICAgICAgcHJvamVjdDogdGhpcy5wcm9qZWN0LFxuICAgICAgcmVwbzogdGhpcy5yZXBvLFxuICAgIH07XG5cbiAgICAvLyByZXR1cm4gYSByZW5kZXJlZCB1cmxcbiAgICByZXR1cm4gdGVtcGxhdGUoZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2VzIHByb2plY3QgYW5kIHJlcG8gZnJvbSB0aGlzLnJlbW90ZS5cbiAgICpcbiAgICogQHJldHVybnMgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHByb2plY3QgYW5kIHJlcG8uXG4gICAqL1xuICBwYXJzZVByb2plY3RBbmRSZXBvKCkge1xuICAgIC8vIHN0cmlwIG9mZiAuZ2l0IGlmIGl0cyB0aGVyZVxuICAgIGNvbnN0IHN0cmlwcGVkUmVtb3RlVXJsID0gdGhpcy5yZW1vdGUucmVwbGFjZSgvKFxcLmdpdCkkLywgJycpO1xuXG4gICAgY29uc3QgcGF0dGVybiA9IC9bOi9dKFsuXFx3LV0qKT9cXC8/KFsuXFx3LV0qKSQvO1xuICAgIGNvbnN0IG1hdGNoZXMgPSBzdHJpcHBlZFJlbW90ZVVybC5tYXRjaChwYXR0ZXJuKTtcblxuICAgIC8vIGlmIHdlIGhhdmUgbm8gbWF0Y2hlcyBqdXN0IHJldHVybiBlbXB0eSBvYmplY3QuIGNhbGxlciBzaG91bGQgdmFsaWRhdGVcbiAgICAvLyBkYXRhIGJlZm9yZSB1c2luZyBpdC5cbiAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICAvLyBpZiBubyBwcm9qZWN0IGlzIG1hdGNoZWQsIHByb2plY3QgYW5kIHJlcG8gYXJlIHRoZSBzYW1lLlxuICAgIHJldHVybiB7XG4gICAgICBwcm9qZWN0OiBtYXRjaGVzWzFdLFxuICAgICAgcmVwbzogbWF0Y2hlc1syXSB8fCBtYXRjaGVzWzFdLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHRlbXBsYXRlIGZ1bmN0aW9uIHVzaW5nIGRlZmF1bHQgR2l0SHViIC8gQml0YnVja2V0IC8gR2l0TGFiXG4gICAqIHVybCB0ZW1wbGF0ZXMgb3IgYSBjdXN0b20gdXJsIHRlbXBsYXRlIHN0cmluZ3Mgc3BlY2lmaWVkIGluIHRoZSBjb25maWdzLlxuICAgKi9cbiAgZ2V0VGVtcGxhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNHaXRIdWIoKSkge1xuICAgICAgcmV0dXJuIHNhZmVUZW1wbGF0ZShHSVRIVUJfVEVNUExBVEUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzQml0YnVja2V0KCkpIHtcbiAgICAgIHJldHVybiBzYWZlVGVtcGxhdGUoQklUQlVDS0VUX1RFTVBMQVRFKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0dpdExhYigpKSB7XG4gICAgICByZXR1cm4gc2FmZVRlbXBsYXRlKEdJVExBQl9URU1QTEFURSk7XG4gICAgfVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZ2l0LWJsYW1lLnVzZUN1c3RvbVVybFRlbXBsYXRlSWZTdGFuZGFyZFJlbW90ZXNGYWlsJykpIHtcbiAgICAgIGlmICh0aGlzLmdpdENvbmZpZ1JlcG9zaXRvcnlVcmwpIHtcbiAgICAgICAgcmV0dXJuIHNhZmVUZW1wbGF0ZSh0aGlzLmdpdENvbmZpZ1JlcG9zaXRvcnlVcmwpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXN0b21VcmxUZW1wbGF0ZSA9IGF0b20uY29uZmlnLmdldCgnZ2l0LWJsYW1lLmN1c3RvbUNvbW1pdFVybFRlbXBsYXRlU3RyaW5nJyk7XG5cbiAgICAgIC8vIGlmIHRoZSB1c2VyIGhhc250IGVudGVyZWQgYSB0ZW1wbGF0ZSBzdHJpbmcsIHJldHVybiBub3RoaW5nXG4gICAgICBpZiAoL15FeGFtcGxlLy50ZXN0KGN1c3RvbVVybFRlbXBsYXRlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzYWZlVGVtcGxhdGUoY3VzdG9tVXJsVGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBSZW1vdGVSZXZpc2lvbiByZXByZXNlbnRzIGEgR2l0SHViIHJlcG9zaXRvcnkuXG4gICAqL1xuICBpc0dpdEh1YigpIHtcbiAgICByZXR1cm4gL2dpdGh1Yi5jb20vLnRlc3QodGhpcy5yZW1vdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIFJlbW90ZVJldmlzaW9uIHJlcHJlc2VudHMgYSBCaXRidWNrZXQgcmVwb3NpdG9yeS5cbiAgICovXG4gIGlzQml0YnVja2V0KCkge1xuICAgIHJldHVybiAvYml0YnVja2V0Lm9yZy8udGVzdCh0aGlzLnJlbW90ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgUmVtb3RlUmV2aXNpb24gcmVwcmVzZW50cyBhIEdpdExhYiByZXBvc2l0b3J5LlxuICAgKi9cbiAgaXNHaXRMYWIoKSB7XG4gICAgcmV0dXJuIC9naXRsYWIuY29tLy50ZXN0KHRoaXMucmVtb3RlKTtcbiAgfVxuXG59XG4iXX0=