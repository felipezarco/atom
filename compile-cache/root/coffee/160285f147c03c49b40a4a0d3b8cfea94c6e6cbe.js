(function() {
  var AskStack, AskStackApiClient, AskStackResultView, AskStackView, CompositeDisposable, TextEditorView, View, ref, url,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  url = require('url');

  CompositeDisposable = require('event-kit').CompositeDisposable;

  ref = require('atom-space-pen-views'), TextEditorView = ref.TextEditorView, View = ref.View;

  AskStack = require('./ask-stack');

  AskStackApiClient = require('./ask-stack-api-client');

  AskStackResultView = require('./ask-stack-result-view');

  module.exports = AskStackView = (function(superClass) {
    extend(AskStackView, superClass);

    function AskStackView() {
      return AskStackView.__super__.constructor.apply(this, arguments);
    }

    AskStackView.content = function() {
      return this.div({
        "class": 'ask-stack overlay from-top padded'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'inset-panel'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, function() {
              return _this.span('Ask Stack Overflow');
            });
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div(function() {
                _this.subview('questionField', new TextEditorView({
                  mini: true,
                  placeholderText: 'Question (eg. Sort array)'
                }));
                _this.subview('tagsField', new TextEditorView({
                  mini: true,
                  placeholderText: 'Language / Tags (eg. Ruby;Rails)'
                }));
                _this.div({
                  "class": 'pull-right'
                }, function() {
                  _this.br();
                  return _this.button({
                    outlet: 'askButton',
                    "class": 'btn btn-primary'
                  }, ' Ask! ');
                });
                return _this.div({
                  "class": 'pull-left'
                }, function() {
                  _this.br();
                  _this.label('Sort by:');
                  _this.br();
                  _this.label({
                    "for": 'relevance',
                    "class": 'radio-label'
                  }, 'Relevance: ');
                  _this.input({
                    outlet: 'sortByRelevance',
                    id: 'relevance',
                    type: 'radio',
                    name: 'sort_by',
                    value: 'relevance',
                    checked: 'checked'
                  });
                  _this.label({
                    "for": 'votes',
                    "class": 'radio-label last'
                  }, 'Votes: ');
                  return _this.input({
                    outlet: 'sortByVote',
                    id: 'votes',
                    type: 'radio',
                    name: 'sort_by',
                    value: 'votes'
                  });
                });
              });
              return _this.div({
                outlet: 'progressIndicator'
              }, function() {
                return _this.span({
                  "class": 'loading loading-spinner-medium'
                });
              });
            });
          });
        };
      })(this));
    };

    AskStackView.prototype.initialize = function(serializeState) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', 'ask-stack:ask-question', (function(_this) {
        return function() {
          return _this.presentPanel();
        };
      })(this)));
      this.handleEvents();
      this.autoDetectObserveSubscription = atom.config.observe('ask-stack.autoDetectLanguage', (function(_this) {
        return function(autoDetect) {
          if (!autoDetect) {
            return _this.tagsField.setText("");
          }
        };
      })(this));
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, pathname, protocol, ref1;
        try {
          ref1 = url.parse(uriToOpen), protocol = ref1.protocol, host = ref1.host, pathname = ref1.pathname;
        } catch (error1) {
          error = error1;
          return;
        }
        if (protocol !== 'ask-stack:') {
          return;
        }
        return new AskStackResultView();
      });
    };

    AskStackView.prototype.serialize = function() {};

    AskStackView.prototype.destroy = function() {
      this.hideView();
      return this.detach();
    };

    AskStackView.prototype.hideView = function() {
      this.panel.hide();
      return this.focusout();
    };

    AskStackView.prototype.onDidChangeTitle = function() {};

    AskStackView.prototype.onDidChangeModified = function() {};

    AskStackView.prototype.handleEvents = function() {
      this.askButton.on('click', (function(_this) {
        return function() {
          return _this.askStackRequest();
        };
      })(this));
      this.subscriptions.add(atom.commands.add(this.questionField.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.askStackRequest();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.hideView();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add(this.tagsField.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.askStackRequest();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.hideView();
          };
        })(this)
      }));
    };

    AskStackView.prototype.presentPanel = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: true
        });
      }
      this.panel.show();
      this.progressIndicator.hide();
      this.questionField.focus();
      if (atom.config.get('ask-stack.autoDetectLanguage')) {
        return this.setLanguageField();
      }
    };

    AskStackView.prototype.askStackRequest = function() {
      this.progressIndicator.show();
      AskStackApiClient.resetInputs();
      AskStackApiClient.question = this.questionField.getText();
      AskStackApiClient.tag = this.tagsField.getText();
      AskStackApiClient.sort_by = this.sortByVote.is(':checked') ? 'votes' : 'relevance';
      return AskStackApiClient.search((function(_this) {
        return function(response) {
          _this.progressIndicator.hide();
          _this.hideView();
          if (response === null) {
            return alert('Encountered a problem with the Stack Exchange API');
          } else {
            return _this.showResults(response);
          }
        };
      })(this));
    };

    AskStackView.prototype.showResults = function(answersJson) {
      var uri;
      uri = 'ask-stack://result-view';
      return atom.workspace.open(uri, {
        split: 'right',
        searchAllPanes: true
      }).then(function(askStackResultView) {
        if (askStackResultView instanceof AskStackResultView) {
          askStackResultView.renderAnswers(answersJson);
          return atom.workspace.activatePreviousPane();
        }
      });
    };

    AskStackView.prototype.setLanguageField = function() {
      var lang;
      lang = this.getCurrentLanguage();
      if (lang === null || lang === 'Null Grammar') {
        return;
      }
      return this.tagsField.setText(lang);
    };

    AskStackView.prototype.getCurrentLanguage = function() {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      if (editor === void 0) {
        return null;
      } else {
        return editor.getGrammar().name;
      }
    };

    return AskStackView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2Fzay1zdGFjay9saWIvYXNrLXN0YWNrLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxrSEFBQTtJQUFBOzs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7O0VBRUwsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSOztFQUN4QixNQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxtQ0FBRCxFQUFpQjs7RUFFakIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUjs7RUFDcEIsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHlCQUFSOztFQUVyQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUNBQVA7T0FBTCxFQUFpRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQy9DLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGFBQVA7V0FBTCxFQUEyQixTQUFBO1lBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQVA7YUFBTCxFQUE2QixTQUFBO3FCQUMzQixLQUFDLENBQUEsSUFBRCxDQUFNLG9CQUFOO1lBRDJCLENBQTdCO21CQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG1CQUFQO2FBQUwsRUFBaUMsU0FBQTtjQUMvQixLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUE7Z0JBQ0gsS0FBQyxDQUFBLE9BQUQsQ0FBUyxlQUFULEVBQTBCLElBQUksY0FBSixDQUFtQjtrQkFBQSxJQUFBLEVBQUssSUFB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QUFBO01BQ1QsSUFBRyxNQUFBLEtBQVUsTUFBYjtlQUE0QixLQUE1QjtPQUFBLE1BQUE7ZUFBc0MsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLEtBQTFEOztJQUZrQjs7OztLQTVHSztBQVYzQiIsInNvdXJjZXNDb250ZW50IjpbInVybCA9IHJlcXVpcmUgJ3VybCdcblxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnZXZlbnQta2l0J1xue1RleHRFZGl0b3JWaWV3LCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5Bc2tTdGFjayA9IHJlcXVpcmUgJy4vYXNrLXN0YWNrJ1xuQXNrU3RhY2tBcGlDbGllbnQgPSByZXF1aXJlICcuL2Fzay1zdGFjay1hcGktY2xpZW50J1xuQXNrU3RhY2tSZXN1bHRWaWV3ID0gcmVxdWlyZSAnLi9hc2stc3RhY2stcmVzdWx0LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEFza1N0YWNrVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ2Fzay1zdGFjayBvdmVybGF5IGZyb20tdG9wIHBhZGRlZCcsID0+XG4gICAgICBAZGl2IGNsYXNzOiAnaW5zZXQtcGFuZWwnLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAncGFuZWwtaGVhZGluZycsID0+XG4gICAgICAgICAgQHNwYW4gJ0FzayBTdGFjayBPdmVyZmxvdydcbiAgICAgICAgQGRpdiBjbGFzczogJ3BhbmVsLWJvZHkgcGFkZGVkJywgPT5cbiAgICAgICAgICBAZGl2ID0+XG4gICAgICAgICAgICBAc3VidmlldyAncXVlc3Rpb25GaWVsZCcsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOnRydWUsIHBsYWNlaG9sZGVyVGV4dDogJ1F1ZXN0aW9uIChlZy4gU29ydCBhcnJheSknKVxuICAgICAgICAgICAgQHN1YnZpZXcgJ3RhZ3NGaWVsZCcsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOnRydWUsIHBsYWNlaG9sZGVyVGV4dDogJ0xhbmd1YWdlIC8gVGFncyAoZWcuIFJ1Ynk7UmFpbHMpJylcbiAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICAgICAgQGJyKClcbiAgICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdhc2tCdXR0b24nLCBjbGFzczogJ2J0biBidG4tcHJpbWFyeScsICcgQXNrISAnXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAncHVsbC1sZWZ0JywgPT5cbiAgICAgICAgICAgICAgQGJyKClcbiAgICAgICAgICAgICAgQGxhYmVsICdTb3J0IGJ5OidcbiAgICAgICAgICAgICAgQGJyKClcbiAgICAgICAgICAgICAgQGxhYmVsIGZvcjogJ3JlbGV2YW5jZScsIGNsYXNzOiAncmFkaW8tbGFiZWwnLCAnUmVsZXZhbmNlOiAnXG4gICAgICAgICAgICAgIEBpbnB1dCBvdXRsZXQ6ICdzb3J0QnlSZWxldmFuY2UnLCBpZDogJ3JlbGV2YW5jZScsIHR5cGU6ICdyYWRpbycsIG5hbWU6ICdzb3J0X2J5JywgdmFsdWU6ICdyZWxldmFuY2UnLCBjaGVja2VkOiAnY2hlY2tlZCdcbiAgICAgICAgICAgICAgQGxhYmVsIGZvcjogJ3ZvdGVzJywgY2xhc3M6ICdyYWRpby1sYWJlbCBsYXN0JywgJ1ZvdGVzOiAnXG4gICAgICAgICAgICAgIEBpbnB1dCBvdXRsZXQ6ICdzb3J0QnlWb3RlJywgaWQ6ICd2b3RlcycsIHR5cGU6ICdyYWRpbycsIG5hbWU6ICdzb3J0X2J5JywgdmFsdWU6ICd2b3RlcydcbiAgICAgICAgICBAZGl2IG91dGxldDogJ3Byb2dyZXNzSW5kaWNhdG9yJywgPT5cbiAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnbG9hZGluZyBsb2FkaW5nLXNwaW5uZXItbWVkaXVtJ1xuXG4gIGluaXRpYWxpemU6IChzZXJpYWxpemVTdGF0ZSkgLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAnYXNrLXN0YWNrOmFzay1xdWVzdGlvbicsID0+IEBwcmVzZW50UGFuZWwoKVxuXG4gICAgQGhhbmRsZUV2ZW50cygpXG5cbiAgICBAYXV0b0RldGVjdE9ic2VydmVTdWJzY3JpcHRpb24gPVxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnYXNrLXN0YWNrLmF1dG9EZXRlY3RMYW5ndWFnZScsIChhdXRvRGV0ZWN0KSA9PlxuICAgICAgICBfdGhpcy50YWdzRmllbGQuc2V0VGV4dChcIlwiKSB1bmxlc3MgYXV0b0RldGVjdFxuXG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyICh1cmlUb09wZW4pIC0+XG4gICAgICB0cnlcbiAgICAgICAge3Byb3RvY29sLCBob3N0LCBwYXRobmFtZX0gPSB1cmwucGFyc2UodXJpVG9PcGVuKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHJldHVybiB1bmxlc3MgcHJvdG9jb2wgaXMgJ2Fzay1zdGFjazonXG5cbiAgICAgIHJldHVybiBuZXcgQXNrU3RhY2tSZXN1bHRWaWV3KClcblxuICAjIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHJldHJpZXZlZCB3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkXG4gIHNlcmlhbGl6ZTogLT5cblxuICAjIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICBkZXN0cm95OiAtPlxuICAgIEBoaWRlVmlldygpXG4gICAgQGRldGFjaCgpXG5cbiAgaGlkZVZpZXc6IC0+XG4gICAgQHBhbmVsLmhpZGUoKVxuICAgIEAuZm9jdXNvdXQoKVxuXG4gIG9uRGlkQ2hhbmdlVGl0bGU6IC0+XG4gIG9uRGlkQ2hhbmdlTW9kaWZpZWQ6IC0+XG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIEBhc2tCdXR0b24ub24gJ2NsaWNrJywgPT4gQGFza1N0YWNrUmVxdWVzdCgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgQHF1ZXN0aW9uRmllbGQuZWxlbWVudCxcbiAgICAgICdjb3JlOmNvbmZpcm0nOiA9PiBAYXNrU3RhY2tSZXF1ZXN0KClcbiAgICAgICdjb3JlOmNhbmNlbCc6ID0+IEBoaWRlVmlldygpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgQHRhZ3NGaWVsZC5lbGVtZW50LFxuICAgICAgJ2NvcmU6Y29uZmlybSc6ID0+IEBhc2tTdGFja1JlcXVlc3QoKVxuICAgICAgJ2NvcmU6Y2FuY2VsJzogPT4gQGhpZGVWaWV3KClcblxuICBwcmVzZW50UGFuZWw6IC0+XG4gICAgI2F0b20ud29ya3NwYWNlVmlldy5hcHBlbmQodGhpcylcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiBALCB2aXNpYmxlOiB0cnVlKVxuXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBwcm9ncmVzc0luZGljYXRvci5oaWRlKClcbiAgICBAcXVlc3Rpb25GaWVsZC5mb2N1cygpXG4gICAgQHNldExhbmd1YWdlRmllbGQoKSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2Fzay1zdGFjay5hdXRvRGV0ZWN0TGFuZ3VhZ2UnKVxuXG4gIGFza1N0YWNrUmVxdWVzdDogLT5cbiAgICBAcHJvZ3Jlc3NJbmRpY2F0b3Iuc2hvdygpXG5cbiAgICBBc2tTdGFja0FwaUNsaWVudC5yZXNldElucHV0cygpXG4gICAgQXNrU3RhY2tBcGlDbGllbnQucXVlc3Rpb24gPSBAcXVlc3Rpb25GaWVsZC5nZXRUZXh0KClcbiAgICBBc2tTdGFja0FwaUNsaWVudC50YWcgPSBAdGFnc0ZpZWxkLmdldFRleHQoKVxuICAgIEFza1N0YWNrQXBpQ2xpZW50LnNvcnRfYnkgPSBpZiBAc29ydEJ5Vm90ZS5pcygnOmNoZWNrZWQnKSB0aGVuICd2b3RlcycgZWxzZSAncmVsZXZhbmNlJ1xuICAgIEFza1N0YWNrQXBpQ2xpZW50LnNlYXJjaCAocmVzcG9uc2UpID0+XG4gICAgICBAcHJvZ3Jlc3NJbmRpY2F0b3IuaGlkZSgpXG4gICAgICB0aGlzLmhpZGVWaWV3KClcbiAgICAgIGlmIHJlc3BvbnNlID09IG51bGxcbiAgICAgICAgYWxlcnQoJ0VuY291bnRlcmVkIGEgcHJvYmxlbSB3aXRoIHRoZSBTdGFjayBFeGNoYW5nZSBBUEknKVxuICAgICAgZWxzZVxuICAgICAgICBAc2hvd1Jlc3VsdHMocmVzcG9uc2UpXG5cbiAgc2hvd1Jlc3VsdHM6IChhbnN3ZXJzSnNvbikgLT5cbiAgICB1cmkgPSAnYXNrLXN0YWNrOi8vcmVzdWx0LXZpZXcnXG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHVyaSwgc3BsaXQ6ICdyaWdodCcsIHNlYXJjaEFsbFBhbmVzOiB0cnVlKS50aGVuIChhc2tTdGFja1Jlc3VsdFZpZXcpIC0+XG4gICAgICBpZiBhc2tTdGFja1Jlc3VsdFZpZXcgaW5zdGFuY2VvZiBBc2tTdGFja1Jlc3VsdFZpZXdcbiAgICAgICAgYXNrU3RhY2tSZXN1bHRWaWV3LnJlbmRlckFuc3dlcnMoYW5zd2Vyc0pzb24pXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmFjdGl2YXRlUHJldmlvdXNQYW5lKClcblxuICBzZXRMYW5ndWFnZUZpZWxkOiAtPlxuICAgIGxhbmcgPSBAZ2V0Q3VycmVudExhbmd1YWdlKClcbiAgICByZXR1cm4gaWYgbGFuZyA9PSBudWxsIG9yIGxhbmcgPT0gJ051bGwgR3JhbW1hcidcbiAgICBAdGFnc0ZpZWxkLnNldFRleHQobGFuZylcblxuICBnZXRDdXJyZW50TGFuZ3VhZ2U6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgZWRpdG9yID09IHVuZGVmaW5lZCB0aGVuIG51bGwgZWxzZSBlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWVcbiJdfQ==
