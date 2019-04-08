(function() {
  var AssetFinderView, DialogView, FileOpener, RailsUtil, _, changeCase, fs, path, pluralize;

  fs = require('fs');

  path = require('path');

  pluralize = require('pluralize');

  changeCase = require('change-case');

  _ = require('underscore');

  DialogView = require('./dialog-view');

  AssetFinderView = require('./asset-finder-view');

  RailsUtil = require('./rails-util');

  module.exports = FileOpener = (function() {
    function FileOpener() {}

    _.extend(FileOpener.prototype, RailsUtil.prototype);

    FileOpener.prototype.openView = function() {
      var configExtensions, currentLine, extension, fileBase, i, j, len, ref, result, rowNumber, targetFile;
      configExtensions = atom.config.get('rails-transporter.viewFileExtension');
      this.reloadCurrentEditor();
      for (rowNumber = i = ref = this.cusorPos.row; ref <= 0 ? i <= 0 : i >= 0; rowNumber = ref <= 0 ? ++i : --i) {
        currentLine = this.editor.lineTextForBufferRow(rowNumber);
        result = currentLine.match(/^\s*def\s+(\w+)/);
        if ((result != null ? result[1] : void 0) != null) {
          if (this.isController(this.currentFile)) {
            fileBase = this.currentFile.replace(path.join('app', 'controllers'), path.join('app', 'views')).replace(/_controller\.rb$/, "" + path.sep + result[1]);
          } else if (this.isMailer(this.currentFile)) {
            fileBase = this.currentFile.replace(path.join('app', 'mailers'), path.join('app', 'views')).replace(/\.rb$/, "" + path.sep + result[1]);
          }
          for (j = 0, len = configExtensions.length; j < len; j++) {
            extension = configExtensions[j];
            if (fs.existsSync(fileBase + "." + extension)) {
              targetFile = fileBase + "." + extension;
              break;
            }
          }
          if (targetFile == null) {
            targetFile = fileBase + "." + configExtensions[0];
          }
          if (fs.existsSync(targetFile)) {
            this.open(targetFile);
          } else {
            this.openDialog(targetFile);
          }
          return;
        }
      }
      return atom.beep();
    };

    FileOpener.prototype.openController = function() {
      var concernsDir, resource, targetFile;
      this.reloadCurrentEditor();
      if (this.isModel(this.currentFile)) {
        resource = path.basename(this.currentFile, '.rb');
        targetFile = this.currentFile.replace(path.join('app', 'models'), path.join('app', 'controllers')).replace(RegExp(resource + "\\.rb$"), (pluralize(resource)) + "_controller.rb");
      } else if (this.isView(this.currentFile)) {
        targetFile = path.dirname(this.currentFile).replace(path.join('app', 'views'), path.join('app', 'controllers')) + '_controller.rb';
      } else if (this.isHelper(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'helpers'), path.join('app', 'controllers')).replace(/_helper\.rb$/, '_controller.rb');
      } else if (this.isTest(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('test', 'controllers'), path.join('app', 'controllers')).replace(/_test\.rb$/, '.rb');
      } else if (this.isSpec(this.currentFile)) {
        if (this.currentFile.indexOf('spec/requests') !== -1) {
          targetFile = this.currentFile.replace(path.join('spec', 'requests'), path.join('app', 'controllers')).replace(/_spec\.rb$/, '_controller.rb');
        } else {
          targetFile = this.currentFile.replace(path.join('spec', 'controllers'), path.join('app', 'controllers')).replace(/_spec\.rb$/, '.rb');
        }
      } else if (this.isController(this.currentFile) && this.currentBufferLine.indexOf("include") !== -1) {
        concernsDir = path.join(atom.project.getPaths()[0], 'app', 'controllers', 'concerns');
        targetFile = this.concernPath(concernsDir, this.currentBufferLine);
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openModel = function() {
      var concernsDir, dir, resource, resourceName, targetFile;
      this.reloadCurrentEditor();
      if (this.isController(this.currentFile)) {
        resourceName = pluralize.singular(this.currentFile.match(/([\w]+)_controller\.rb$/)[1]);
        targetFile = path.join(atom.project.getPaths()[0], 'app', 'models', resourceName + ".rb");
        if (!fs.existsSync(targetFile)) {
          targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('app', 'models')).replace(/([\w]+)_controller\.rb$/, resourceName + ".rb");
        }
      } else if (this.isHelper(this.currentFile)) {
        resourceName = pluralize.singular(this.currentFile.match(/([\w]+)_helper\.rb$/)[1]);
        targetFile = path.join(atom.project.getPaths()[0], 'app', 'models', resourceName + ".rb");
        if (!fs.existsSync(targetFile)) {
          targetFile = this.currentFile.replace(path.join('app', 'helpers'), path.join('app', 'models')).replace(/([\w]+)_helper\.rb$/, resourceName + ".rb");
        }
      } else if (this.isView(this.currentFile)) {
        dir = path.dirname(this.currentFile);
        resource = path.basename(dir);
        targetFile = path.join(atom.project.getPaths()[0], 'app', 'models', resource + ".rb");
        if (!fs.existsSync(targetFile)) {
          targetFile = dir.replace(path.join('app', 'views'), path.join('app', 'models')).replace(RegExp(resource + "\\/*\\.*$"), (pluralize.singular(resource)) + ".rb");
        }
      } else if (this.isTest(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('test', 'models'), path.join('app', 'models')).replace(/_test\.rb$/, '.rb');
      } else if (this.isSpec(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('spec', 'models'), path.join('app', 'models')).replace(/_spec\.rb$/, '.rb');
      } else if (this.isFactory(this.currentFile)) {
        dir = path.basename(this.currentFile, '.rb');
        resource = path.basename(dir);
        targetFile = this.currentFile.replace(path.join('spec', 'factories'), path.join('app', 'models')).replace(RegExp(resource + "\\.rb$"), (pluralize.singular(resource)) + ".rb");
      } else if (this.isModel(this.currentFile) && this.currentBufferLine.indexOf("include") !== -1) {
        concernsDir = path.join(atom.project.getPaths()[0], 'app', 'models', 'concerns');
        targetFile = this.concernPath(concernsDir, this.currentBufferLine);
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openHelper = function() {
      var resource, targetFile;
      this.reloadCurrentEditor();
      if (this.isController(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('app', 'helpers')).replace(/controller\.rb/, 'helper.rb');
      } else if (this.isTest(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('test', 'helpers'), path.join('app', 'helpers')).replace(/_test\.rb/, '.rb');
      } else if (this.isSpec(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('spec', 'helpers'), path.join('app', 'helpers')).replace(/_spec\.rb/, '.rb');
      } else if (this.isModel(this.currentFile)) {
        resource = path.basename(this.currentFile, '.rb');
        targetFile = this.currentFile.replace(path.join('app', 'models'), path.join('app', 'helpers')).replace(RegExp(resource + "\\.rb$"), (pluralize(resource)) + "_helper.rb");
      } else if (this.isView(this.currentFile)) {
        targetFile = path.dirname(this.currentFile).replace(path.join('app', 'views'), path.join('app', 'helpers')) + "_helper.rb";
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openTest = function() {
      var file_path, project_path, ref, resource, targetFile;
      this.reloadCurrentEditor();
      if (this.isController(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('test', 'controllers')).replace(/controller\.rb$/, 'controller_test.rb');
      } else if (this.isHelper(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'helpers'), path.join('test', 'helpers')).replace(/\.rb$/, '_test.rb');
      } else if (this.isModel(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'models'), path.join('test', 'models')).replace(/\.rb$/, '_test.rb');
      } else if (this.isFactory(this.currentFile)) {
        resource = path.basename(this.currentFile.replace(/_test\.rb/, '.rb'), '.rb');
        targetFile = this.currentFile.replace(path.join('test', 'factories'), path.join('test', 'models')).replace(resource + ".rb", (pluralize.singular(resource)) + "_test.rb");
      } else if (this.isService(this.currentFile)) {
        ref = atom.project.relativizePath(this.currentFile), project_path = ref[0], file_path = ref[1];
        targetFile = path.join(project_path, file_path.replace(RegExp(path.join('app', '(\\w+)')), path.join('test', '$1')).replace(/\.rb$/, '_test.rb'));
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openSpec = function() {
      var controllerSpecType, file_path, project_path, ref, resource, targetFile;
      this.reloadCurrentEditor();
      if (this.isController(this.currentFile)) {
        controllerSpecType = atom.config.get('rails-transporter.controllerSpecType');
        if (controllerSpecType === 'controllers') {
          targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('spec', 'controllers')).replace(/controller\.rb$/, 'controller_spec.rb');
        } else if (controllerSpecType === 'requests') {
          targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('spec', 'requests')).replace(/controller\.rb$/, 'spec.rb');
        } else if (controllerSpecType === 'features') {
          targetFile = this.currentFile.replace(path.join('app', 'controllers'), path.join('spec', 'features')).replace(/controller\.rb$/, 'spec.rb');
        }
      } else if (this.isHelper(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'helpers'), path.join('spec', 'helpers')).replace(/\.rb$/, '_spec.rb');
      } else if (this.isModel(this.currentFile)) {
        targetFile = this.currentFile.replace(path.join('app', 'models'), path.join('spec', 'models')).replace(/\.rb$/, '_spec.rb');
      } else if (this.isFactory(this.currentFile)) {
        resource = path.basename(this.currentFile.replace(/_spec\.rb/, '.rb'), '.rb');
        targetFile = this.currentFile.replace(path.join('spec', 'factories'), path.join('spec', 'models')).replace(resource + ".rb", (pluralize.singular(resource)) + "_spec.rb");
      } else if (this.isService(this.currentFile)) {
        ref = atom.project.relativizePath(this.currentFile), project_path = ref[0], file_path = ref[1];
        targetFile = path.join(project_path, file_path.replace(RegExp(path.join('app', '(\\w+)')), path.join('spec', '$1')).replace(/\.rb$/, '_spec.rb'));
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openPartial = function() {
      var result, targetFile;
      this.reloadCurrentEditor();
      if (this.isView(this.currentFile)) {
        if (this.currentBufferLine.indexOf("render") !== -1) {
          if (this.currentBufferLine.indexOf("partial") === -1) {
            result = this.currentBufferLine.match(/render\s*\(?\s*["'](.+?)["']/);
            if ((result != null ? result[1] : void 0) != null) {
              targetFile = this.partialFullPath(this.currentFile, result[1]);
            }
          } else {
            result = this.currentBufferLine.match(/render\s*\(?\s*\:?partial(\s*=>|:*)\s*["'](.+?)["']/);
            if ((result != null ? result[2] : void 0) != null) {
              targetFile = this.partialFullPath(this.currentFile, result[2]);
            }
          }
        }
      }
      if (fs.existsSync(targetFile)) {
        return this.open(targetFile);
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.openAsset = function() {
      var result, targetFile;
      this.reloadCurrentEditor();
      if (this.isView(this.currentFile)) {
        if (this.currentBufferLine.indexOf("javascript_include_tag") !== -1) {
          result = this.currentBufferLine.match(/javascript_include_tag\s*\(?\s*["'](.+?)["']/);
          if ((result != null ? result[1] : void 0) != null) {
            targetFile = this.assetFullPath(result[1], 'javascripts');
          }
        } else if (this.currentBufferLine.indexOf("stylesheet_link_tag") !== -1) {
          result = this.currentBufferLine.match(/stylesheet_link_tag\s*\(?\s*["'](.+?)["']/);
          if ((result != null ? result[1] : void 0) != null) {
            targetFile = this.assetFullPath(result[1], 'stylesheets');
          }
        }
      } else if (this.isAsset(this.currentFile)) {
        if (this.currentBufferLine.indexOf("require ") !== -1) {
          result = this.currentBufferLine.match(/require\s*(.+?)\s*$/);
          if (this.currentFile.indexOf(path.join('app', 'assets', 'javascripts')) !== -1) {
            if ((result != null ? result[1] : void 0) != null) {
              targetFile = this.assetFullPath(result[1], 'javascripts');
            }
          } else if (this.currentFile.indexOf(path.join('app', 'assets', 'stylesheets')) !== -1) {
            if ((result != null ? result[1] : void 0) != null) {
              targetFile = this.assetFullPath(result[1], 'stylesheets');
            }
          }
        } else if (this.currentBufferLine.indexOf("require_tree ") !== -1) {
          return this.createAssetFinderView().toggle();
        } else if (this.currentBufferLine.indexOf("require_directory ") !== -1) {
          return this.createAssetFinderView().toggle();
        }
      }
      return this.open(targetFile);
    };

    FileOpener.prototype.openLayout = function() {
      var configExtensions, extension, fileBase, i, j, k, layoutDir, len, len1, len2, result, targetFile;
      configExtensions = atom.config.get('rails-transporter.viewFileExtension');
      this.reloadCurrentEditor();
      layoutDir = path.join(atom.project.getPaths()[0], 'app', 'views', 'layouts');
      if (this.isController(this.currentFile)) {
        if (this.currentBufferLine.indexOf("layout") !== -1) {
          result = this.currentBufferLine.match(/layout\s*\(?\s*["'](.+?)["']/);
          if ((result != null ? result[1] : void 0) != null) {
            fileBase = path.join(layoutDir, result[1]);
            for (i = 0, len = configExtensions.length; i < len; i++) {
              extension = configExtensions[i];
              if (fs.existsSync(fileBase + "." + extension)) {
                targetFile = fileBase + "." + extension;
                break;
              }
            }
          }
        } else {
          fileBase = this.currentFile.replace(path.join('app', 'controllers'), path.join('app', 'views', 'layouts')).replace('_controller.rb', '');
          for (j = 0, len1 = configExtensions.length; j < len1; j++) {
            extension = configExtensions[j];
            if (fs.existsSync(fileBase + "." + extension)) {
              targetFile = fileBase + "." + extension;
              break;
            }
          }
          if (targetFile == null) {
            fileBase = path.join(layoutDir, "application");
            for (k = 0, len2 = configExtensions.length; k < len2; k++) {
              extension = configExtensions[k];
              if (fs.existsSync(fileBase + "." + extension)) {
                targetFile = fileBase + "." + extension;
                break;
              }
            }
          }
        }
      }
      if (!fs.existsSync(targetFile)) {
        targetFile = fileBase + "." + configExtensions[0];
      }
      return this.open(targetFile);
    };

    FileOpener.prototype.openFactory = function() {
      var fileBase, fileName, i, len, ref, resource, results, targetFile;
      this.reloadCurrentEditor();
      if (this.isModel(this.currentFile)) {
        resource = path.basename(this.currentFile, '.rb');
        fileBase = path.dirname(this.currentFile.replace(path.join('app', 'models'), path.join('spec', 'factories')));
      } else if (this.isSpec(this.currentFile)) {
        resource = path.basename(this.currentFile.replace(/_spec\.rb/, '.rb'), '.rb');
        fileBase = path.dirname(this.currentFile.replace(path.join('spec', 'models'), path.join('spec', 'factories')));
      }
      if (fileBase != null) {
        ref = [resource + ".rb", (pluralize(resource)) + ".rb"];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          fileName = ref[i];
          targetFile = path.join(fileBase, fileName);
          if (fs.existsSync(targetFile)) {
            this.open(targetFile);
            break;
          }
          results.push(this.openDialog(targetFile));
        }
        return results;
      } else {
        return this.openDialog(targetFile);
      }
    };

    FileOpener.prototype.createAssetFinderView = function() {
      if (this.assetFinderView == null) {
        this.assetFinderView = new AssetFinderView();
      }
      return this.assetFinderView;
    };

    FileOpener.prototype.reloadCurrentEditor = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      this.currentFile = this.editor.getPath();
      this.cusorPos = this.editor.getLastCursor().getBufferPosition();
      return this.currentBufferLine = this.editor.getLastCursor().getCurrentBufferLine();
    };

    FileOpener.prototype.open = function(targetFile) {
      var file, files, i, len, results;
      if (targetFile == null) {
        return;
      }
      files = typeof targetFile === 'string' ? [targetFile] : targetFile;
      results = [];
      for (i = 0, len = files.length; i < len; i++) {
        file = files[i];
        if (fs.existsSync(file)) {
          results.push(atom.workspace.open(file));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    FileOpener.prototype.openDialog = function(targetFile) {
      if (this.dialogView == null) {
        this.dialogView = new DialogView();
        this.dialogPanel = atom.workspace.addModalPanel({
          item: this.dialogView,
          visible: false
        });
        this.dialogView.setPanel(this.dialogPanel);
      }
      this.dialogView.setTargetFile(targetFile);
      this.dialogPanel.show();
      return this.dialogView.focusTextField();
    };

    FileOpener.prototype.partialFullPath = function(currentFile, partialName) {
      var configExtensions, extension, fileBase, i, j, len, len1, targetFile;
      configExtensions = atom.config.get('rails-transporter.viewFileExtension');
      if (partialName.indexOf("/") === -1) {
        fileBase = path.join(path.dirname(currentFile), "_" + partialName);
        for (i = 0, len = configExtensions.length; i < len; i++) {
          extension = configExtensions[i];
          if (fs.existsSync(fileBase + "." + extension)) {
            targetFile = fileBase + "." + extension;
            break;
          }
        }
        if (targetFile == null) {
          targetFile = fileBase + "." + configExtensions[0];
        }
      } else {
        fileBase = path.join(atom.project.getPaths()[0], 'app', 'views', path.dirname(partialName), "_" + (path.basename(partialName)));
        for (j = 0, len1 = configExtensions.length; j < len1; j++) {
          extension = configExtensions[j];
          if (fs.existsSync(fileBase + "." + extension)) {
            targetFile = fileBase + "." + extension;
            break;
          }
        }
        if (targetFile == null) {
          targetFile = fileBase + "." + configExtensions[0];
        }
      }
      return targetFile;
    };

    FileOpener.prototype.assetFullPath = function(assetName, type) {
      var baseName, ext, fileName, fullExt, fullPath, i, j, k, len, len1, len2, location, ref, ref1, ref2;
      fileName = path.basename(assetName);
      switch (path.extname(assetName)) {
        case ".coffee":
        case ".js":
        case ".scss":
        case ".css":
          ext = '';
          break;
        default:
          ext = type === 'javascripts' ? '.js' : 'stylesheets' ? '.css' : void 0;
      }
      if (assetName.match(/^\//)) {
        return path.join(atom.project.getPaths()[0], 'public', path.dirname(assetName), "" + fileName + ext);
      } else {
        ref = ['app', 'lib', 'vendor'];
        for (i = 0, len = ref.length; i < len; i++) {
          location = ref[i];
          baseName = path.join(atom.project.getPaths()[0], location, 'assets', type, path.dirname(assetName), fileName);
          if (type === 'javascripts') {
            ref1 = [ext + ".erb", ext + ".coffee", ext + ".coffee.erb", ext];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              fullExt = ref1[j];
              fullPath = baseName + fullExt;
              if (fs.existsSync(fullPath)) {
                return fullPath;
              }
            }
          } else if (type === 'stylesheets') {
            ref2 = [ext + ".erb", ext + ".scss", ext + ".scss.erb", ext];
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              fullExt = ref2[k];
              fullPath = baseName + fullExt;
              if (fs.existsSync(fullPath)) {
                return fullPath;
              }
            }
          }
        }
      }
    };

    FileOpener.prototype.concernPath = function(concernsDir, currentBufferLine) {
      var concernName, concernPaths, result;
      result = currentBufferLine.match(/include\s+(.+)/);
      if ((result != null ? result[1] : void 0) != null) {
        if (result[1].indexOf('::') === -1) {
          return path.join(concernsDir, changeCase.snakeCase(result[1])) + '.rb';
        } else {
          concernPaths = (function() {
            var i, len, ref, results;
            ref = result[1].split('::');
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              concernName = ref[i];
              results.push(changeCase.snakeCase(concernName));
            }
            return results;
          })();
          return path.join(concernsDir, concernPaths.join(path.sep)) + '.rb';
        }
      }
    };

    return FileOpener;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL3JhaWxzLXRyYW5zcG9ydGVyL2xpYi9maWxlLW9wZW5lci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSOztFQUNaLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUjs7RUFDYixDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVI7O0VBRUosVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztFQUNiLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSOztFQUNsQixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ0osQ0FBQyxDQUFDLE1BQUYsQ0FBUyxVQUFJLENBQUEsU0FBYixFQUFpQixTQUFTLENBQUEsU0FBMUI7O3lCQUVBLFFBQUEsR0FBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQ0FBaEI7TUFDbkIsSUFBQyxDQUFBLG1CQUFELENBQUE7QUFFQSxXQUFpQixxR0FBakI7UUFDRSxXQUFBLEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixTQUE3QjtRQUNkLE1BQUEsR0FBUyxXQUFXLENBQUMsS0FBWixDQUFrQixpQkFBbEI7UUFDVCxJQUFHLDZDQUFIO1VBRUUsSUFBRyxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxXQUFmLENBQUg7WUFDRSxRQUFBLEdBQVcsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBVixFQUFpQixhQUFqQixDQUFyQixFQUFzRCxJQUFJLENBQUMs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QUE1QixDQUF2QixDQUFBLEdBQTBELE1BRDVEO1NBQUEsTUFBQTtVQUdFLFlBQUE7O0FBQWdCO0FBQUE7aUJBQUEscUNBQUE7OzJCQUFBLFVBQVUsQ0FBQyxTQUFYLENBQXFCLFdBQXJCO0FBQUE7OztpQkFDaEIsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFWLEVBQXVCLFlBQVksQ0FBQyxJQUFiLENBQWtCLElBQUksQ0FBQyxHQUF2QixDQUF2QixDQUFBLEdBQXNELE1BSnhEO1NBREY7O0lBSFc7Ozs7O0FBL1hmIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xucGx1cmFsaXplID0gcmVxdWlyZSAncGx1cmFsaXplJ1xuY2hhbmdlQ2FzZSA9IHJlcXVpcmUgJ2NoYW5nZS1jYXNlJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG5cbkRpYWxvZ1ZpZXcgPSByZXF1aXJlICcuL2RpYWxvZy12aWV3J1xuQXNzZXRGaW5kZXJWaWV3ID0gcmVxdWlyZSAnLi9hc3NldC1maW5kZXItdmlldydcblJhaWxzVXRpbCA9IHJlcXVpcmUgJy4vcmFpbHMtdXRpbCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRmlsZU9wZW5lclxuICBfLmV4dGVuZCB0aGlzOjosIFJhaWxzVXRpbDo6XG5cbiAgb3BlblZpZXc6IC0+XG4gICAgY29uZmlnRXh0ZW5zaW9ucyA9IGF0b20uY29uZmlnLmdldCgncmFpbHMtdHJhbnNwb3J0ZXIudmlld0ZpbGVFeHRlbnNpb24nKVxuICAgIEByZWxvYWRDdXJyZW50RWRpdG9yKClcblxuICAgIGZvciByb3dOdW1iZXIgaW4gW0BjdXNvclBvcy5yb3cuLjBdXG4gICAgICBjdXJyZW50TGluZSA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocm93TnVtYmVyKVxuICAgICAgcmVzdWx0ID0gY3VycmVudExpbmUubWF0Y2ggL15cXHMqZGVmXFxzKyhcXHcrKS9cbiAgICAgIGlmIHJlc3VsdD9bMV0/XG5cbiAgICAgICAgaWYgQGlzQ29udHJvbGxlcihAY3VycmVudEZpbGUpXG4gICAgICAgICAgZmlsZUJhc2UgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ2FwcCcsICdjb250cm9sbGVycycpLCBwYXRoLmpvaW4oJ2FwcCcsICd2aWV3cycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL19jb250cm9sbGVyXFwucmIkLywgXCIje3BhdGguc2VwfSN7cmVzdWx0WzFdfVwiKVxuICAgICAgICBlbHNlIGlmIEBpc01haWxlcihAY3VycmVudEZpbGUpXG4gICAgICAgICAgZmlsZUJhc2UgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ2FwcCcsICdtYWlsZXJzJyksIHBhdGguam9pbignYXBwJywgJ3ZpZXdzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwucmIkLywgXCIje3BhdGguc2VwfSN7cmVzdWx0WzFdfVwiKVxuXG4gICAgICAgIGZvciBleHRlbnNpb24gaW4gY29uZmlnRXh0ZW5zaW9uc1xuICAgICAgICAgIGlmIGZzLmV4aXN0c1N5bmMgXCIje2ZpbGVCYXNlfS4je2V4dGVuc2lvbn1cIlxuICAgICAgICAgICAgdGFyZ2V0RmlsZSA9IFwiI3tmaWxlQmFzZX0uI3tleHRlbnNpb259XCJcbiAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgdGFyZ2V0RmlsZSA9IFwiI3tmaWxlQmFzZX0uI3tjb25maWdFeHRlbnNpb25zWzBdfVwiIHVubGVzcyB0YXJnZXRGaWxlP1xuXG4gICAgICAgIGlmIGZzLmV4aXN0c1N5bmMgdGFyZ2V0RmlsZVxuICAgICAgICAgIEBvcGVuKHRhcmdldEZpbGUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAb3BlbkRpYWxvZyh0YXJnZXRGaWxlKVxuICAgICAgICByZXR1cm5cblxuICAgICMgdGhlcmUgd2VyZSBubyBtZXRob2RzIGFib3ZlIHRoZSBsaW5lIHdoZXJlIHRoZSBjb21tYW5kIHdhcyB0cmlnZ2VyZWQuXG4gICAgYXRvbS5iZWVwKClcblxuICBvcGVuQ29udHJvbGxlcjogLT5cbiAgICBAcmVsb2FkQ3VycmVudEVkaXRvcigpXG4gICAgaWYgQGlzTW9kZWwoQGN1cnJlbnRGaWxlKVxuICAgICAgcmVzb3VyY2UgPSBwYXRoLmJhc2VuYW1lKEBjdXJyZW50RmlsZSwgJy5yYicpXG4gICAgICB0YXJnZXRGaWxlID0gQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCdhcHAnLCAnbW9kZWxzJyksIHBhdGguam9pbignYXBwJywgJ2NvbnRyb2xsZXJzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLy8vI3tyZXNvdXJjZX1cXC5yYiQvLy8sIFwiI3twbHVyYWxpemUocmVzb3VyY2UpfV9jb250cm9sbGVyLnJiXCIpXG4gICAgZWxzZSBpZiBAaXNWaWV3KEBjdXJyZW50RmlsZSlcbiAgICAgIHRhcmdldEZpbGUgPSBwYXRoLmRpcm5hbWUoQGN1cnJlbnRGaWxlKVxuICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKHBhdGguam9pbignYXBwJywgJ3ZpZXdzJyksIHBhdGguam9pbignYXBwJywgJ2NvbnRyb2xsZXJzJykpICsgJ19jb250cm9sbGVyLnJiJ1xuICAgIGVsc2UgaWYgQGlzSGVscGVyKEBjdXJyZW50RmlsZSlcbiAgICAgIHRhcmdldEZpbGUgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ2FwcCcsICdoZWxwZXJzJyksIHBhdGguam9pbignYXBwJywgJ2NvbnRyb2xsZXJzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL19oZWxwZXJcXC5yYiQvLCAnX2NvbnRyb2xsZXIucmInKVxuICAgIGVsc2UgaWYgQGlzVGVzdChAY3VycmVudEZpbGUpXG4gICAgICB0YXJnZXRGaWxlID0gQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCd0ZXN0JywgJ2NvbnRyb2xsZXJzJyksIHBhdGguam9pbignYXBwJywgJ2NvbnRyb2xsZXJzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL190ZXN0XFwucmIkLywgJy5yYicpXG4gICAgZWxzZSBpZiBAaXNTcGVjKEBjdXJyZW50RmlsZSlcbiAgICAgIGlmIEBjdXJyZW50RmlsZS5pbmRleE9mKCdzcGVjL3JlcXVlc3RzJykgaXNudCAtMVxuICAgICAgICB0YXJnZXRGaWxlID0gQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCdzcGVjJywgJ3JlcXVlc3RzJyksIHBhdGguam9pbignYXBwJywgJ2NvbnRyb2xsZXJzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvX3NwZWNcXC5yYiQvLCAnX2NvbnRyb2xsZXIucmInKVxuICAgICAgZWxzZVxuICAgICAgICB0YXJnZXRGaWxlID0gQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCdzcGVjJywgJ2NvbnRyb2xsZXJzJyksIHBhdGguam9pbignYXBwJywgJ2NvbnRyb2xsZXJzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvX3NwZWNcXC5yYiQvLCAnLnJiJylcbiAgICBlbHNlIGlmIEBpc0NvbnRyb2xsZXIoQGN1cnJlbnRGaWxlKSBhbmQgQGN1cnJlbnRCdWZmZXJMaW5lLmluZGV4T2YoXCJpbmNsdWRlXCIpIGlzbnQgLTFcbiAgICAgIGNvbmNlcm5zRGlyID0gcGF0aC5qb2luKGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCAnYXBwJywgJ2NvbnRyb2xsZXJzJywgJ2NvbmNlcm5zJylcbiAgICAgIHRhcmdldEZpbGUgPSBAY29uY2VyblBhdGgoY29uY2VybnNEaXIsIEBjdXJyZW50QnVmZmVyTGluZSlcblxuICAgIGlmIGZzLmV4aXN0c1N5bmMgdGFyZ2V0RmlsZVxuICAgICAgQG9wZW4odGFyZ2V0RmlsZSlcbiAgICBlbHNlXG4gICAgICBAb3BlbkRpYWxvZyh0YXJnZXRGaWxlKVxuXG5cbiAgb3Blbk1vZGVsOiAtPlxuICAgIEByZWxvYWRDdXJyZW50RWRpdG9yKClcbiAgICBpZiBAaXNDb250cm9sbGVyKEBjdXJyZW50RmlsZSlcbiAgICAgIHJlc291cmNlTmFtZSA9IHBsdXJhbGl6ZS5zaW5ndWxhcihAY3VycmVudEZpbGUubWF0Y2goLyhbXFx3XSspX2NvbnRyb2xsZXJcXC5yYiQvKVsxXSlcblxuICAgICAgdGFyZ2V0RmlsZSA9IHBhdGguam9pbihhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSwgJ2FwcCcsICdtb2RlbHMnLCBcIiN7cmVzb3VyY2VOYW1lfS5yYlwiKVxuICAgICAgdW5sZXNzIGZzLmV4aXN0c1N5bmMgdGFyZ2V0RmlsZVxuICAgICAgICB0YXJnZXRGaWxlID0gQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCdhcHAnLCAnY29udHJvbGxlcnMnKSwgcGF0aC5qb2luKCdhcHAnLCAnbW9kZWxzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKFtcXHddKylfY29udHJvbGxlclxcLnJiJC8sIFwiI3tyZXNvdXJjZU5hbWV9LnJiXCIpXG5cbiAgICBlbHNlIGlmIEBpc0hlbHBlcihAY3VycmVudEZpbGUpXG4gICAgICByZXNvdXJjZU5hbWUgPSBwbHVyYWxpemUuc2luZ3VsYXIoQGN1cnJlbnRGaWxlLm1hdGNoKC8oW1xcd10rKV9oZWxwZXJcXC5yYiQvKVsxXSlcblxuICAgICAgdGFyZ2V0RmlsZSA9IHBhdGguam9pbihhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSwgJ2FwcCcsICdtb2RlbHMnLCBcIiN7cmVzb3VyY2VOYW1lfS5yYlwiKVxuICAgICAgdW5sZXNzIGZzLmV4aXN0c1N5bmMgdGFyZ2V0RmlsZVxuICAgICAgICB0YXJnZXRGaWxlID0gQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCdhcHAnLCAnaGVscGVycycpLCBwYXRoLmpvaW4oJ2FwcCcsICdtb2RlbHMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oW1xcd10rKV9oZWxwZXJcXC5yYiQvLCBcIiN7cmVzb3VyY2VOYW1lfS5yYlwiKVxuXG4gICAgZWxzZSBpZiBAaXNWaWV3KEBjdXJyZW50RmlsZSlcbiAgICAgIGRpciA9IHBhdGguZGlybmFtZShAY3VycmVudEZpbGUpXG4gICAgICByZXNvdXJjZSA9IHBhdGguYmFzZW5hbWUoZGlyKVxuXG4gICAgICB0YXJnZXRGaWxlID0gcGF0aC5qb2luKGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCAnYXBwJywgJ21vZGVscycsIFwiI3tyZXNvdXJjZX0ucmJcIilcbiAgICAgIHVubGVzcyBmcy5leGlzdHNTeW5jIHRhcmdldEZpbGVcbiAgICAgICAgdGFyZ2V0RmlsZSA9IGRpci5yZXBsYWNlKHBhdGguam9pbignYXBwJywgJ3ZpZXdzJyksIHBhdGguam9pbignYXBwJywgJ21vZGVscycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLy8vI3tyZXNvdXJjZX1cXC8qXFwuKiQvLy8sIFwiI3twbHVyYWxpemUuc2luZ3VsYXIocmVzb3VyY2UpfS5yYlwiKVxuXG4gICAgZWxzZSBpZiBAaXNUZXN0KEBjdXJyZW50RmlsZSlcbiAgICAgIHRhcmdldEZpbGUgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ3Rlc3QnLCAnbW9kZWxzJyksIHBhdGguam9pbignYXBwJywgJ21vZGVscycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9fdGVzdFxcLnJiJC8sICcucmInKVxuXG4gICAgZWxzZSBpZiBAaXNTcGVjKEBjdXJyZW50RmlsZSlcbiAgICAgIHRhcmdldEZpbGUgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ3NwZWMnLCAnbW9kZWxzJyksIHBhdGguam9pbignYXBwJywgJ21vZGVscycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9fc3BlY1xcLnJiJC8sICcucmInKVxuXG4gICAgZWxzZSBpZiBAaXNGYWN0b3J5KEBjdXJyZW50RmlsZSlcbiAgICAgIGRpciA9IHBhdGguYmFzZW5hbWUoQGN1cnJlbnRGaWxlLCAnLnJiJylcbiAgICAgIHJlc291cmNlID0gcGF0aC5iYXNlbmFtZShkaXIpXG4gICAgICB0YXJnZXRGaWxlID0gQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCdzcGVjJywgJ2ZhY3RvcmllcycpLCBwYXRoLmpvaW4oJ2FwcCcsICdtb2RlbHMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvLy8je3Jlc291cmNlfVxcLnJiJC8vLywgXCIje3BsdXJhbGl6ZS5zaW5ndWxhcihyZXNvdXJjZSl9LnJiXCIpXG5cbiAgICBlbHNlIGlmIEBpc01vZGVsKEBjdXJyZW50RmlsZSkgYW5kIEBjdXJyZW50QnVmZmVyTGluZS5pbmRleE9mKFwiaW5jbHVkZVwiKSBpc250IC0xXG4gICAgICBjb25jZXJuc0RpciA9IHBhdGguam9pbihhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSwgJ2FwcCcsICdtb2RlbHMnLCAnY29uY2VybnMnKVxuICAgICAgdGFyZ2V0RmlsZSA9IEBjb25jZXJuUGF0aChjb25jZXJuc0RpciwgQGN1cnJlbnRCdWZmZXJMaW5lKVxuXG4gICAgaWYgZnMuZXhpc3RzU3luYyB0YXJnZXRGaWxlXG4gICAgICBAb3Blbih0YXJnZXRGaWxlKVxuICAgIGVsc2VcbiAgICAgIEBvcGVuRGlhbG9nKHRhcmdldEZpbGUpXG5cbiAgb3BlbkhlbHBlcjogLT5cbiAgICBAcmVsb2FkQ3VycmVudEVkaXRvcigpXG4gICAgaWYgQGlzQ29udHJvbGxlcihAY3VycmVudEZpbGUpXG4gICAgICB0YXJnZXRGaWxlID0gQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCdhcHAnLCAnY29udHJvbGxlcnMnKSwgcGF0aC5qb2luKCdhcHAnLCAnaGVscGVycycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9jb250cm9sbGVyXFwucmIvLCAnaGVscGVyLnJiJylcbiAgICBlbHNlIGlmIEBpc1Rlc3QoQGN1cnJlbnRGaWxlKVxuICAgICAgdGFyZ2V0RmlsZSA9IEBjdXJyZW50RmlsZS5yZXBsYWNlKHBhdGguam9pbigndGVzdCcsICdoZWxwZXJzJyksIHBhdGguam9pbignYXBwJywgJ2hlbHBlcnMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvX3Rlc3RcXC5yYi8sICcucmInKVxuICAgIGVsc2UgaWYgQGlzU3BlYyhAY3VycmVudEZpbGUpXG4gICAgICB0YXJnZXRGaWxlID0gQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCdzcGVjJywgJ2hlbHBlcnMnKSwgcGF0aC5qb2luKCdhcHAnLCAnaGVscGVycycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9fc3BlY1xcLnJiLywgJy5yYicpXG4gICAgZWxzZSBpZiBAaXNNb2RlbChAY3VycmVudEZpbGUpXG4gICAgICByZXNvdXJjZSA9IHBhdGguYmFzZW5hbWUoQGN1cnJlbnRGaWxlLCAnLnJiJylcbiAgICAgIHRhcmdldEZpbGUgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ2FwcCcsICdtb2RlbHMnKSwgcGF0aC5qb2luKCdhcHAnLCAnaGVscGVycycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8vLyN7cmVzb3VyY2V9XFwucmIkLy8vLCBcIiN7cGx1cmFsaXplKHJlc291cmNlKX1faGVscGVyLnJiXCIpXG4gICAgZWxzZSBpZiBAaXNWaWV3KEBjdXJyZW50RmlsZSlcbiAgICAgIHRhcmdldEZpbGUgPSBwYXRoLmRpcm5hbWUoQGN1cnJlbnRGaWxlKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShwYXRoLmpvaW4oJ2FwcCcsICd2aWV3cycpLCBwYXRoLmpvaW4oJ2FwcCcsICdoZWxwZXJzJykpICsgXCJfaGVscGVyLnJiXCJcblxuICAgIGlmIGZzLmV4aXN0c1N5bmMgdGFyZ2V0RmlsZVxuICAgICAgQG9wZW4odGFyZ2V0RmlsZSlcbiAgICBlbHNlXG4gICAgICBAb3BlbkRpYWxvZyh0YXJnZXRGaWxlKVxuXG4gIG9wZW5UZXN0OiAtPlxuICAgIEByZWxvYWRDdXJyZW50RWRpdG9yKClcbiAgICBpZiBAaXNDb250cm9sbGVyKEBjdXJyZW50RmlsZSlcbiAgICAgIHRhcmdldEZpbGUgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ2FwcCcsICdjb250cm9sbGVycycpLCBwYXRoLmpvaW4oJ3Rlc3QnLCAnY29udHJvbGxlcnMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvY29udHJvbGxlclxcLnJiJC8sICdjb250cm9sbGVyX3Rlc3QucmInKVxuICAgIGVsc2UgaWYgQGlzSGVscGVyKEBjdXJyZW50RmlsZSlcbiAgICAgIHRhcmdldEZpbGUgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ2FwcCcsICdoZWxwZXJzJyksIHBhdGguam9pbigndGVzdCcsICdoZWxwZXJzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLnJiJC8sICdfdGVzdC5yYicpXG4gICAgZWxzZSBpZiBAaXNNb2RlbChAY3VycmVudEZpbGUpXG4gICAgICB0YXJnZXRGaWxlID0gQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCdhcHAnLCAnbW9kZWxzJyksIHBhdGguam9pbigndGVzdCcsICdtb2RlbHMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwucmIkLywgJ190ZXN0LnJiJylcbiAgICBlbHNlIGlmIEBpc0ZhY3RvcnkoQGN1cnJlbnRGaWxlKVxuICAgICAgcmVzb3VyY2UgPSBwYXRoLmJhc2VuYW1lKEBjdXJyZW50RmlsZS5yZXBsYWNlKC9fdGVzdFxcLnJiLywgJy5yYicpLCAnLnJiJylcbiAgICAgIHRhcmdldEZpbGUgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ3Rlc3QnLCAnZmFjdG9yaWVzJyksIHBhdGguam9pbigndGVzdCcsICdtb2RlbHMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShcIiN7cmVzb3VyY2V9LnJiXCIsIFwiI3twbHVyYWxpemUuc2luZ3VsYXIocmVzb3VyY2UpfV90ZXN0LnJiXCIpXG4gICAgZWxzZSBpZiBAaXNTZXJ2aWNlKEBjdXJyZW50RmlsZSlcbiAgICAgIFtwcm9qZWN0X3BhdGgsIGZpbGVfcGF0aF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoQGN1cnJlbnRGaWxlKVxuICAgICAgdGFyZ2V0RmlsZSA9IHBhdGguam9pbihwcm9qZWN0X3BhdGgsIGZpbGVfcGF0aC5yZXBsYWNlKFJlZ0V4cChwYXRoLmpvaW4oJ2FwcCcsICcoXFxcXHcrKScpKSwgcGF0aC5qb2luKCd0ZXN0JywgJyQxJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLnJiJC8sICdfdGVzdC5yYicpKVxuXG4gICAgaWYgZnMuZXhpc3RzU3luYyB0YXJnZXRGaWxlXG4gICAgICBAb3Blbih0YXJnZXRGaWxlKVxuICAgIGVsc2VcbiAgICAgIEBvcGVuRGlhbG9nKHRhcmdldEZpbGUpXG5cbiAgb3BlblNwZWM6IC0+XG4gICAgQHJlbG9hZEN1cnJlbnRFZGl0b3IoKVxuICAgIGlmIEBpc0NvbnRyb2xsZXIoQGN1cnJlbnRGaWxlKVxuICAgICAgY29udHJvbGxlclNwZWNUeXBlID0gYXRvbS5jb25maWcuZ2V0KCdyYWlscy10cmFuc3BvcnRlci5jb250cm9sbGVyU3BlY1R5cGUnKVxuICAgICAgaWYgY29udHJvbGxlclNwZWNUeXBlIGlzICdjb250cm9sbGVycydcbiAgICAgICAgdGFyZ2V0RmlsZSA9IEBjdXJyZW50RmlsZS5yZXBsYWNlKHBhdGguam9pbignYXBwJywgJ2NvbnRyb2xsZXJzJyksIHBhdGguam9pbignc3BlYycsICdjb250cm9sbGVycycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL2NvbnRyb2xsZXJcXC5yYiQvLCAnY29udHJvbGxlcl9zcGVjLnJiJylcbiAgICAgIGVsc2UgaWYgY29udHJvbGxlclNwZWNUeXBlIGlzICdyZXF1ZXN0cydcbiAgICAgICAgdGFyZ2V0RmlsZSA9IEBjdXJyZW50RmlsZS5yZXBsYWNlKHBhdGguam9pbignYXBwJywgJ2NvbnRyb2xsZXJzJyksIHBhdGguam9pbignc3BlYycsICdyZXF1ZXN0cycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL2NvbnRyb2xsZXJcXC5yYiQvLCAnc3BlYy5yYicpXG4gICAgICBlbHNlIGlmIGNvbnRyb2xsZXJTcGVjVHlwZSBpcyAnZmVhdHVyZXMnXG4gICAgICAgIHRhcmdldEZpbGUgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ2FwcCcsICdjb250cm9sbGVycycpLCBwYXRoLmpvaW4oJ3NwZWMnLCAnZmVhdHVyZXMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9jb250cm9sbGVyXFwucmIkLywgJ3NwZWMucmInKVxuXG4gICAgZWxzZSBpZiBAaXNIZWxwZXIoQGN1cnJlbnRGaWxlKVxuICAgICAgdGFyZ2V0RmlsZSA9IEBjdXJyZW50RmlsZS5yZXBsYWNlKHBhdGguam9pbignYXBwJywgJ2hlbHBlcnMnKSwgcGF0aC5qb2luKCdzcGVjJywgJ2hlbHBlcnMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwucmIkLywgJ19zcGVjLnJiJylcblxuICAgIGVsc2UgaWYgQGlzTW9kZWwoQGN1cnJlbnRGaWxlKVxuICAgICAgdGFyZ2V0RmlsZSA9IEBjdXJyZW50RmlsZS5yZXBsYWNlKHBhdGguam9pbignYXBwJywgJ21vZGVscycpLCBwYXRoLmpvaW4oJ3NwZWMnLCAnbW9kZWxzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLnJiJC8sICdfc3BlYy5yYicpXG5cbiAgICBlbHNlIGlmIEBpc0ZhY3RvcnkoQGN1cnJlbnRGaWxlKVxuICAgICAgcmVzb3VyY2UgPSBwYXRoLmJhc2VuYW1lKEBjdXJyZW50RmlsZS5yZXBsYWNlKC9fc3BlY1xcLnJiLywgJy5yYicpLCAnLnJiJylcbiAgICAgIHRhcmdldEZpbGUgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ3NwZWMnLCAnZmFjdG9yaWVzJyksIHBhdGguam9pbignc3BlYycsICdtb2RlbHMnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShcIiN7cmVzb3VyY2V9LnJiXCIsIFwiI3twbHVyYWxpemUuc2luZ3VsYXIocmVzb3VyY2UpfV9zcGVjLnJiXCIpXG5cbiAgICBlbHNlIGlmIEBpc1NlcnZpY2UoQGN1cnJlbnRGaWxlKVxuICAgICAgW3Byb2plY3RfcGF0aCwgZmlsZV9wYXRoXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChAY3VycmVudEZpbGUpXG4gICAgICB0YXJnZXRGaWxlID0gcGF0aC5qb2luKHByb2plY3RfcGF0aCwgZmlsZV9wYXRoLnJlcGxhY2UoUmVnRXhwKHBhdGguam9pbignYXBwJywgJyhcXFxcdyspJykpLCBwYXRoLmpvaW4oJ3NwZWMnLCAnJDEnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwucmIkLywgJ19zcGVjLnJiJykpXG5cbiAgICBpZiBmcy5leGlzdHNTeW5jIHRhcmdldEZpbGVcbiAgICAgIEBvcGVuKHRhcmdldEZpbGUpXG4gICAgZWxzZVxuICAgICAgQG9wZW5EaWFsb2codGFyZ2V0RmlsZSlcblxuICBvcGVuUGFydGlhbDogLT5cbiAgICBAcmVsb2FkQ3VycmVudEVkaXRvcigpXG4gICAgaWYgQGlzVmlldyhAY3VycmVudEZpbGUpXG4gICAgICBpZiBAY3VycmVudEJ1ZmZlckxpbmUuaW5kZXhPZihcInJlbmRlclwiKSBpc250IC0xXG4gICAgICAgIGlmIEBjdXJyZW50QnVmZmVyTGluZS5pbmRleE9mKFwicGFydGlhbFwiKSBpcyAtMVxuICAgICAgICAgIHJlc3VsdCA9IEBjdXJyZW50QnVmZmVyTGluZS5tYXRjaCgvcmVuZGVyXFxzKlxcKD9cXHMqW1wiJ10oLis/KVtcIiddLylcbiAgICAgICAgICB0YXJnZXRGaWxlID0gQHBhcnRpYWxGdWxsUGF0aChAY3VycmVudEZpbGUsIHJlc3VsdFsxXSkgaWYgcmVzdWx0P1sxXT9cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlc3VsdCA9IEBjdXJyZW50QnVmZmVyTGluZS5tYXRjaCgvcmVuZGVyXFxzKlxcKD9cXHMqXFw6P3BhcnRpYWwoXFxzKj0+fDoqKVxccypbXCInXSguKz8pW1wiJ10vKVxuICAgICAgICAgIHRhcmdldEZpbGUgPSBAcGFydGlhbEZ1bGxQYXRoKEBjdXJyZW50RmlsZSwgcmVzdWx0WzJdKSBpZiByZXN1bHQ/WzJdP1xuXG4gICAgaWYgZnMuZXhpc3RzU3luYyB0YXJnZXRGaWxlXG4gICAgICBAb3Blbih0YXJnZXRGaWxlKVxuICAgIGVsc2VcbiAgICAgIEBvcGVuRGlhbG9nKHRhcmdldEZpbGUpXG5cbiAgb3BlbkFzc2V0OiAtPlxuICAgIEByZWxvYWRDdXJyZW50RWRpdG9yKClcbiAgICBpZiBAaXNWaWV3KEBjdXJyZW50RmlsZSlcbiAgICAgIGlmIEBjdXJyZW50QnVmZmVyTGluZS5pbmRleE9mKFwiamF2YXNjcmlwdF9pbmNsdWRlX3RhZ1wiKSBpc250IC0xXG4gICAgICAgIHJlc3VsdCA9IEBjdXJyZW50QnVmZmVyTGluZS5tYXRjaCgvamF2YXNjcmlwdF9pbmNsdWRlX3RhZ1xccypcXCg/XFxzKltcIiddKC4rPylbXCInXS8pXG4gICAgICAgIHRhcmdldEZpbGUgPSBAYXNzZXRGdWxsUGF0aChyZXN1bHRbMV0sICdqYXZhc2NyaXB0cycpIGlmIHJlc3VsdD9bMV0/XG4gICAgICBlbHNlIGlmIEBjdXJyZW50QnVmZmVyTGluZS5pbmRleE9mKFwic3R5bGVzaGVldF9saW5rX3RhZ1wiKSBpc250IC0xXG4gICAgICAgIHJlc3VsdCA9IEBjdXJyZW50QnVmZmVyTGluZS5tYXRjaCgvc3R5bGVzaGVldF9saW5rX3RhZ1xccypcXCg/XFxzKltcIiddKC4rPylbXCInXS8pXG4gICAgICAgIHRhcmdldEZpbGUgPSBAYXNzZXRGdWxsUGF0aChyZXN1bHRbMV0sICdzdHlsZXNoZWV0cycpIGlmIHJlc3VsdD9bMV0/XG5cbiAgICBlbHNlIGlmIEBpc0Fzc2V0KEBjdXJyZW50RmlsZSlcbiAgICAgIGlmIEBjdXJyZW50QnVmZmVyTGluZS5pbmRleE9mKFwicmVxdWlyZSBcIikgaXNudCAtMVxuICAgICAgICByZXN1bHQgPSBAY3VycmVudEJ1ZmZlckxpbmUubWF0Y2goL3JlcXVpcmVcXHMqKC4rPylcXHMqJC8pXG4gICAgICAgIGlmIEBjdXJyZW50RmlsZS5pbmRleE9mKHBhdGguam9pbignYXBwJywgJ2Fzc2V0cycsICdqYXZhc2NyaXB0cycpKSBpc250IC0xXG4gICAgICAgICAgdGFyZ2V0RmlsZSA9IEBhc3NldEZ1bGxQYXRoKHJlc3VsdFsxXSwgJ2phdmFzY3JpcHRzJykgaWYgcmVzdWx0P1sxXT9cbiAgICAgICAgZWxzZSBpZiBAY3VycmVudEZpbGUuaW5kZXhPZihwYXRoLmpvaW4oJ2FwcCcsICdhc3NldHMnLCAnc3R5bGVzaGVldHMnKSkgaXNudCAtMVxuICAgICAgICAgIHRhcmdldEZpbGUgPSBAYXNzZXRGdWxsUGF0aChyZXN1bHRbMV0sICdzdHlsZXNoZWV0cycpIGlmIHJlc3VsdD9bMV0/XG4gICAgICBlbHNlIGlmIEBjdXJyZW50QnVmZmVyTGluZS5pbmRleE9mKFwicmVxdWlyZV90cmVlIFwiKSBpc250IC0xXG4gICAgICAgIHJldHVybiBAY3JlYXRlQXNzZXRGaW5kZXJWaWV3KCkudG9nZ2xlKClcbiAgICAgIGVsc2UgaWYgQGN1cnJlbnRCdWZmZXJMaW5lLmluZGV4T2YoXCJyZXF1aXJlX2RpcmVjdG9yeSBcIikgaXNudCAtMVxuICAgICAgICByZXR1cm4gQGNyZWF0ZUFzc2V0RmluZGVyVmlldygpLnRvZ2dsZSgpXG5cbiAgICBAb3Blbih0YXJnZXRGaWxlKVxuXG4gIG9wZW5MYXlvdXQ6IC0+XG4gICAgY29uZmlnRXh0ZW5zaW9ucyA9IGF0b20uY29uZmlnLmdldCgncmFpbHMtdHJhbnNwb3J0ZXIudmlld0ZpbGVFeHRlbnNpb24nKVxuICAgIEByZWxvYWRDdXJyZW50RWRpdG9yKClcbiAgICBsYXlvdXREaXIgPSBwYXRoLmpvaW4oYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sICdhcHAnLCAndmlld3MnLCAnbGF5b3V0cycpXG4gICAgaWYgQGlzQ29udHJvbGxlcihAY3VycmVudEZpbGUpXG4gICAgICBpZiBAY3VycmVudEJ1ZmZlckxpbmUuaW5kZXhPZihcImxheW91dFwiKSBpc250IC0xXG4gICAgICAgIHJlc3VsdCA9IEBjdXJyZW50QnVmZmVyTGluZS5tYXRjaCgvbGF5b3V0XFxzKlxcKD9cXHMqW1wiJ10oLis/KVtcIiddLylcblxuICAgICAgICBpZiByZXN1bHQ/WzFdP1xuICAgICAgICAgIGZpbGVCYXNlID0gcGF0aC5qb2luKGxheW91dERpciwgcmVzdWx0WzFdKVxuICAgICAgICAgIGZvciBleHRlbnNpb24gaW4gY29uZmlnRXh0ZW5zaW9uc1xuICAgICAgICAgICAgaWYgZnMuZXhpc3RzU3luYyBcIiN7ZmlsZUJhc2V9LiN7ZXh0ZW5zaW9ufVwiXG4gICAgICAgICAgICAgIHRhcmdldEZpbGUgPSBcIiN7ZmlsZUJhc2V9LiN7ZXh0ZW5zaW9ufVwiXG4gICAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgIGVsc2VcbiAgICAgICAgZmlsZUJhc2UgPSBAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ2FwcCcsICdjb250cm9sbGVycycpLCBwYXRoLmpvaW4oJ2FwcCcsICd2aWV3cycsICdsYXlvdXRzJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ19jb250cm9sbGVyLnJiJywgJycpXG4gICAgICAgIGZvciBleHRlbnNpb24gaW4gY29uZmlnRXh0ZW5zaW9uc1xuICAgICAgICAgIGlmIGZzLmV4aXN0c1N5bmMgXCIje2ZpbGVCYXNlfS4je2V4dGVuc2lvbn1cIlxuICAgICAgICAgICAgdGFyZ2V0RmlsZSA9IFwiI3tmaWxlQmFzZX0uI3tleHRlbnNpb259XCJcbiAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgdW5sZXNzIHRhcmdldEZpbGU/XG4gICAgICAgICAgZmlsZUJhc2UgPSBwYXRoLmpvaW4obGF5b3V0RGlyLCBcImFwcGxpY2F0aW9uXCIpXG4gICAgICAgICAgZm9yIGV4dGVuc2lvbiBpbiBjb25maWdFeHRlbnNpb25zXG4gICAgICAgICAgICBpZiBmcy5leGlzdHNTeW5jIFwiI3tmaWxlQmFzZX0uI3tleHRlbnNpb259XCJcbiAgICAgICAgICAgICAgdGFyZ2V0RmlsZSA9IFwiI3tmaWxlQmFzZX0uI3tleHRlbnNpb259XCJcbiAgICAgICAgICAgICAgYnJlYWtcblxuICAgIHVubGVzcyBmcy5leGlzdHNTeW5jKHRhcmdldEZpbGUpXG4gICAgICB0YXJnZXRGaWxlID0gXCIje2ZpbGVCYXNlfS4je2NvbmZpZ0V4dGVuc2lvbnNbMF19XCJcblxuICAgIEBvcGVuKHRhcmdldEZpbGUpXG5cbiAgb3BlbkZhY3Rvcnk6IC0+XG4gICAgQHJlbG9hZEN1cnJlbnRFZGl0b3IoKVxuICAgIGlmIEBpc01vZGVsKEBjdXJyZW50RmlsZSlcbiAgICAgIHJlc291cmNlID0gcGF0aC5iYXNlbmFtZShAY3VycmVudEZpbGUsICcucmInKVxuICAgICAgZmlsZUJhc2UgPSBwYXRoLmRpcm5hbWUoQGN1cnJlbnRGaWxlLnJlcGxhY2UocGF0aC5qb2luKCdhcHAnLCAnbW9kZWxzJyksIHBhdGguam9pbignc3BlYycsICdmYWN0b3JpZXMnKSkpXG4gICAgZWxzZSBpZiBAaXNTcGVjKEBjdXJyZW50RmlsZSlcbiAgICAgIHJlc291cmNlID0gcGF0aC5iYXNlbmFtZShAY3VycmVudEZpbGUucmVwbGFjZSgvX3NwZWNcXC5yYi8sICcucmInKSwgJy5yYicpXG4gICAgICBmaWxlQmFzZSA9IHBhdGguZGlybmFtZShAY3VycmVudEZpbGUucmVwbGFjZShwYXRoLmpvaW4oJ3NwZWMnLCAnbW9kZWxzJyksIHBhdGguam9pbignc3BlYycsICdmYWN0b3JpZXMnKSkpXG5cbiAgICBpZiBmaWxlQmFzZT9cbiAgICAgIGZvciBmaWxlTmFtZSBpbiBbXCIje3Jlc291cmNlfS5yYlwiLCBcIiN7cGx1cmFsaXplKHJlc291cmNlKX0ucmJcIl1cbiAgICAgICAgdGFyZ2V0RmlsZSA9IHBhdGguam9pbihmaWxlQmFzZSwgZmlsZU5hbWUpXG4gICAgICAgIGlmIGZzLmV4aXN0c1N5bmMgdGFyZ2V0RmlsZVxuICAgICAgICAgIEBvcGVuKHRhcmdldEZpbGUpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgQG9wZW5EaWFsb2codGFyZ2V0RmlsZSlcbiAgICBlbHNlXG4gICAgICBAb3BlbkRpYWxvZyh0YXJnZXRGaWxlKVxuXG4gICMjIFByaXZhdGUgbWV0aG9kXG4gIGNyZWF0ZUFzc2V0RmluZGVyVmlldzogLT5cbiAgICB1bmxlc3MgQGFzc2V0RmluZGVyVmlldz9cbiAgICAgIEBhc3NldEZpbmRlclZpZXcgPSBuZXcgQXNzZXRGaW5kZXJWaWV3KClcblxuICAgIEBhc3NldEZpbmRlclZpZXdcblxuICByZWxvYWRDdXJyZW50RWRpdG9yOiAtPlxuICAgIEBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAY3VycmVudEZpbGUgPSBAZWRpdG9yLmdldFBhdGgoKVxuICAgIEBjdXNvclBvcyA9IEBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBAY3VycmVudEJ1ZmZlckxpbmUgPSBAZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRDdXJyZW50QnVmZmVyTGluZSgpXG5cbiAgb3BlbjogKHRhcmdldEZpbGUpIC0+XG4gICAgcmV0dXJuIHVubGVzcyB0YXJnZXRGaWxlP1xuICAgIGZpbGVzID0gaWYgdHlwZW9mKHRhcmdldEZpbGUpIGlzICdzdHJpbmcnIHRoZW4gW3RhcmdldEZpbGVdIGVsc2UgdGFyZ2V0RmlsZVxuICAgIGZvciBmaWxlIGluIGZpbGVzXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUpIGlmIGZzLmV4aXN0c1N5bmMoZmlsZSlcblxuICBvcGVuRGlhbG9nOiAodGFyZ2V0RmlsZSkgLT5cbiAgICB1bmxlc3MgQGRpYWxvZ1ZpZXc/XG4gICAgICBAZGlhbG9nVmlldyA9IG5ldyBEaWFsb2dWaWV3KClcbiAgICAgIEBkaWFsb2dQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogQGRpYWxvZ1ZpZXcsIHZpc2libGU6IGZhbHNlKVxuICAgICAgQGRpYWxvZ1ZpZXcuc2V0UGFuZWwoQGRpYWxvZ1BhbmVsKVxuXG4gICAgQGRpYWxvZ1ZpZXcuc2V0VGFyZ2V0RmlsZSh0YXJnZXRGaWxlKVxuICAgIEBkaWFsb2dQYW5lbC5zaG93KClcbiAgICBAZGlhbG9nVmlldy5mb2N1c1RleHRGaWVsZCgpXG5cbiAgcGFydGlhbEZ1bGxQYXRoOiAoY3VycmVudEZpbGUsIHBhcnRpYWxOYW1lKSAtPlxuICAgIGNvbmZpZ0V4dGVuc2lvbnMgPSBhdG9tLmNvbmZpZy5nZXQoJ3JhaWxzLXRyYW5zcG9ydGVyLnZpZXdGaWxlRXh0ZW5zaW9uJylcblxuICAgIGlmIHBhcnRpYWxOYW1lLmluZGV4T2YoXCIvXCIpIGlzIC0xXG4gICAgICBmaWxlQmFzZSA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoY3VycmVudEZpbGUpLCBcIl8je3BhcnRpYWxOYW1lfVwiKVxuICAgICAgZm9yIGV4dGVuc2lvbiBpbiBjb25maWdFeHRlbnNpb25zXG4gICAgICAgIGlmIGZzLmV4aXN0c1N5bmMgXCIje2ZpbGVCYXNlfS4je2V4dGVuc2lvbn1cIlxuICAgICAgICAgIHRhcmdldEZpbGUgPSBcIiN7ZmlsZUJhc2V9LiN7ZXh0ZW5zaW9ufVwiXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgdGFyZ2V0RmlsZSA9IFwiI3tmaWxlQmFzZX0uI3tjb25maWdFeHRlbnNpb25zWzBdfVwiIHVubGVzcyB0YXJnZXRGaWxlP1xuICAgIGVsc2VcbiAgICAgIGZpbGVCYXNlID0gcGF0aC5qb2luKGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCAnYXBwJywgJ3ZpZXdzJywgcGF0aC5kaXJuYW1lKHBhcnRpYWxOYW1lKSwgXCJfI3twYXRoLmJhc2VuYW1lKHBhcnRpYWxOYW1lKX1cIilcbiAgICAgIGZvciBleHRlbnNpb24gaW4gY29uZmlnRXh0ZW5zaW9uc1xuICAgICAgICBpZiBmcy5leGlzdHNTeW5jIFwiI3tmaWxlQmFzZX0uI3tleHRlbnNpb259XCJcbiAgICAgICAgICB0YXJnZXRGaWxlID0gXCIje2ZpbGVCYXNlfS4je2V4dGVuc2lvbn1cIlxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgIHRhcmdldEZpbGUgPSBcIiN7ZmlsZUJhc2V9LiN7Y29uZmlnRXh0ZW5zaW9uc1swXX1cIiB1bmxlc3MgdGFyZ2V0RmlsZT9cblxuICAgIHJldHVybiB0YXJnZXRGaWxlXG5cbiAgYXNzZXRGdWxsUGF0aDogKGFzc2V0TmFtZSwgdHlwZSkgLT5cbiAgICBmaWxlTmFtZSA9IHBhdGguYmFzZW5hbWUoYXNzZXROYW1lKVxuXG4gICAgc3dpdGNoIHBhdGguZXh0bmFtZShhc3NldE5hbWUpXG4gICAgICB3aGVuIFwiLmNvZmZlZVwiLCBcIi5qc1wiLCBcIi5zY3NzXCIsIFwiLmNzc1wiXG4gICAgICAgIGV4dCA9ICcnXG4gICAgICBlbHNlXG4gICAgICAgIGV4dCA9IGlmIHR5cGUgaXMgJ2phdmFzY3JpcHRzJyB0aGVuICcuanMnIGVsc2UgaWYgJ3N0eWxlc2hlZXRzJyB0aGVuICcuY3NzJ1xuXG4gICAgaWYgYXNzZXROYW1lLm1hdGNoKC9eXFwvLylcbiAgICAgIHBhdGguam9pbihhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSwgJ3B1YmxpYycsIHBhdGguZGlybmFtZShhc3NldE5hbWUpLCBcIiN7ZmlsZU5hbWV9I3tleHR9XCIpXG4gICAgZWxzZVxuICAgICAgZm9yIGxvY2F0aW9uIGluIFsnYXBwJywgJ2xpYicsICd2ZW5kb3InXVxuICAgICAgICBiYXNlTmFtZSA9IHBhdGguam9pbihhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSwgbG9jYXRpb24sICdhc3NldHMnLCB0eXBlLCBwYXRoLmRpcm5hbWUoYXNzZXROYW1lKSwgZmlsZU5hbWUpXG4gICAgICAgIGlmIHR5cGUgaXMgJ2phdmFzY3JpcHRzJ1xuICAgICAgICAgIGZvciBmdWxsRXh0IGluIFtcIiN7ZXh0fS5lcmJcIiwgXCIje2V4dH0uY29mZmVlXCIsIFwiI3tleHR9LmNvZmZlZS5lcmJcIiwgZXh0XVxuICAgICAgICAgICAgZnVsbFBhdGggPSBiYXNlTmFtZSArIGZ1bGxFeHRcbiAgICAgICAgICAgIHJldHVybiBmdWxsUGF0aCBpZiBmcy5leGlzdHNTeW5jIGZ1bGxQYXRoXG5cbiAgICAgICAgZWxzZSBpZiB0eXBlIGlzICdzdHlsZXNoZWV0cydcbiAgICAgICAgICBmb3IgZnVsbEV4dCBpbiBbXCIje2V4dH0uZXJiXCIsIFwiI3tleHR9LnNjc3NcIiwgXCIje2V4dH0uc2Nzcy5lcmJcIiwgZXh0XVxuICAgICAgICAgICAgZnVsbFBhdGggPSBiYXNlTmFtZSArIGZ1bGxFeHRcbiAgICAgICAgICAgIHJldHVybiBmdWxsUGF0aCBpZiBmcy5leGlzdHNTeW5jIGZ1bGxQYXRoXG5cbiAgY29uY2VyblBhdGg6IChjb25jZXJuc0RpciwgY3VycmVudEJ1ZmZlckxpbmUpLT5cbiAgICByZXN1bHQgPSBjdXJyZW50QnVmZmVyTGluZS5tYXRjaCgvaW5jbHVkZVxccysoLispLylcblxuICAgIGlmIHJlc3VsdD9bMV0/XG4gICAgICBpZiByZXN1bHRbMV0uaW5kZXhPZignOjonKSBpcyAtMVxuICAgICAgICBwYXRoLmpvaW4oY29uY2VybnNEaXIsIGNoYW5nZUNhc2Uuc25ha2VDYXNlKHJlc3VsdFsxXSkpICsgJy5yYidcbiAgICAgIGVsc2VcbiAgICAgICAgY29uY2VyblBhdGhzID0gKGNoYW5nZUNhc2Uuc25ha2VDYXNlKGNvbmNlcm5OYW1lKSBmb3IgY29uY2Vybk5hbWUgaW4gcmVzdWx0WzFdLnNwbGl0KCc6OicpKVxuICAgICAgICBwYXRoLmpvaW4oY29uY2VybnNEaXIsIGNvbmNlcm5QYXRocy5qb2luKHBhdGguc2VwKSkgKyAnLnJiJ1xuIl19
