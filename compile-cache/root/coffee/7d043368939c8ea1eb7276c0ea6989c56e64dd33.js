(function() {
  var $, $$$, AskStackApiClient, AskStackResultView, ScrollView, hljs, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$$ = ref.$$$, ScrollView = ref.ScrollView;

  AskStackApiClient = require('./ask-stack-api-client');

  hljs = require('highlight.js');

  window.jQuery = $;

  require('./vendor/bootstrap.min.js');

  module.exports = AskStackResultView = (function(superClass) {
    extend(AskStackResultView, superClass);

    function AskStackResultView() {
      return AskStackResultView.__super__.constructor.apply(this, arguments);
    }

    AskStackResultView.content = function() {
      return this.div({
        "class": 'ask-stack-result native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            id: 'results-view',
            outlet: 'resultsView'
          });
          _this.div({
            id: 'load-more',
            "class": 'load-more',
            click: 'loadMoreResults',
            outlet: 'loadMore'
          }, function() {
            return _this.a({
              href: '#loadmore'
            }, function() {
              return _this.span('Load More...');
            });
          });
          return _this.div({
            id: 'progressIndicator',
            "class": 'progressIndicator',
            outlet: 'progressIndicator'
          }, function() {
            return _this.span({
              "class": 'loading loading-spinner-medium'
            });
          });
        };
      })(this));
    };

    AskStackResultView.prototype.initialize = function() {
      return AskStackResultView.__super__.initialize.apply(this, arguments);
    };

    AskStackResultView.prototype.getTitle = function() {
      return 'Ask Stack Results';
    };

    AskStackResultView.prototype.getURI = function() {
      return 'ask-stack://result-view';
    };

    AskStackResultView.prototype.getIconName = function() {
      return 'three-bars';
    };

    AskStackResultView.prototype.onDidChangeTitle = function() {};

    AskStackResultView.prototype.onDidChangeModified = function() {};

    AskStackResultView.prototype.handleEvents = function() {
      this.subscribe(this, 'core:move-up', (function(_this) {
        return function() {
          return _this.scrollUp();
        };
      })(this));
      return this.subscribe(this, 'core:move-down', (function(_this) {
        return function() {
          return _this.scrollDown();
        };
      })(this));
    };

    AskStackResultView.prototype.renderAnswers = function(answersJson, loadMore) {
      var i, j, len, len1, question, ref1, ref2, results;
      if (loadMore == null) {
        loadMore = false;
      }
      this.answersJson = answersJson;
      if (!loadMore) {
        this.resultsView.html('');
      }
      if (answersJson['items'].length === 0) {
        return this.html('<br><center>Your search returned no matches.</center>');
      } else {
        ref1 = answersJson['items'];
        for (i = 0, len = ref1.length; i < len; i++) {
          question = ref1[i];
          this.renderQuestionHeader(question);
        }
        ref2 = answersJson['items'];
        results = [];
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          question = ref2[j];
          results.push(this.renderQuestionBody(question));
        }
        return results;
      }
    };

    AskStackResultView.prototype.renderQuestionHeader = function(question) {
      var display_name, html, questionHeader, question_id, title, toggleBtn;
      title = $('<div/>').html(question['title']).text();
      display_name = $('<textarea />').html(question['owner'].display_name).text();
      question_id = question['question_id'];
      questionHeader = $$$(function() {
        return this.div({
          id: question['question_id'],
          "class": 'ui-result'
        }, (function(_this) {
          return function() {
            _this.h2({
              "class": 'title'
            }, function() {
              _this.a({
                href: question['link'],
                id: "question-link-" + question_id,
                "class": 'underline title-string'
              }, title);
              _this.div({
                "class": 'score',
                title: question['score'] + ' Votes'
              }, function() {
                return _this.p(question['score']);
              });
              _this.div({
                "class": 'answers',
                title: question['answer_count'] + ' Answers'
              }, function() {
                return _this.p(question['answer_count']);
              });
              return _this.div({
                "class": 'is-accepted'
              }, function() {
                if (question['accepted_answer_id']) {
                  return _this.p({
                    "class": 'icon icon-check',
                    title: 'This question has an accepted answer'
                  });
                }
              });
            });
            _this.div({
              "class": 'created'
            }, function() {
              _this.text(new Date(question['creation_date'] * 1000).toLocaleString());
              _this.text(' - asked by ');
              return _this.a({
                href: question['owner'].link,
                id: "question-author-link-" + question_id
              }, display_name);
            });
            _this.div({
              "class": 'tags'
            }, function() {
              var i, len, ref1, results, tag;
              ref1 = question['tags'];
              results = [];
              for (i = 0, len = ref1.length; i < len; i++) {
                tag = ref1[i];
                _this.span({
                  "class": 'label label-info'
                }, tag);
                results.push(_this.text('\n'));
              }
              return results;
            });
            return _this.div({
              "class": 'collapse-button'
            });
          };
        })(this));
      });
      toggleBtn = $('<button></button>', {
        id: "toggle-" + question['question_id'],
        type: 'button',
        "class": 'btn btn-info btn-xs',
        text: 'Show More'
      });
      toggleBtn.attr('data-toggle', 'collapse');
      toggleBtn.attr('data-target', "#question-body-" + question['question_id']);
      html = $(questionHeader).find('.collapse-button').append(toggleBtn).parent();
      return this.resultsView.append(html);
    };

    AskStackResultView.prototype.renderQuestionBody = function(question) {
      var answer_tab, curAnswer, div, quesId;
      curAnswer = 0;
      quesId = question['question_id'];
      if (question['answer_count'] > 0) {
        answer_tab = "<a href='#prev" + quesId + "'><< Prev</a>   <span id='curAnswer-" + quesId + "'>" + (curAnswer + 1) + "</span>/" + question['answers'].length + "  <a href='#next" + quesId + "'>Next >></a> ";
      } else {
        answer_tab = "<br><b>This question has not been answered.</b>";
      }
      div = $('<div></div>', {
        id: "question-body-" + question['question_id'],
        "class": "collapse hidden"
      });
      div.html("<ul class='nav nav-tabs nav-justified'> <li class='active'><a href='#question-" + quesId + "' data-toggle='tab'>Question</a></li> <li><a href='#answers-" + quesId + "' data-toggle='tab'>Answers</a></li> </ul> <div id='question-body-" + question['question_id'] + "-nav' class='tab-content hidden'> <div class='tab-pane active' id='question-" + quesId + "'>" + question['body'] + "</div> <div class='tab-pane answer-navigation' id='answers-" + quesId + "'> <center>" + answer_tab + "</center> </div> </div>");
      $("#" + quesId).append(div);
      this.highlightCode("question-" + quesId);
      this.addCodeButtons("question-" + quesId, quesId, 'question');
      if (question['answer_count'] > 0) {
        this.renderAnswerBody(question['answers'][curAnswer], quesId);
        this.setupNavigation(question, curAnswer);
      }
      return $("#toggle-" + quesId).click(function(event) {
        var btn;
        btn = $(this);
        if ($("#question-body-" + quesId).hasClass('in')) {
          $("#question-body-" + quesId).addClass('hidden');
          $("#question-body-" + quesId + "-nav").addClass('hidden');
          btn.parents("#" + quesId).append(btn.parent());
          return $(this).text('Show More');
        } else {
          $("#question-body-" + quesId).removeClass('hidden');
          $("#question-body-" + quesId + "-nav").removeClass('hidden');
          btn.parent().siblings("#question-body-" + quesId).append(btn.parent());
          return btn.text('Show Less');
        }
      });
    };

    AskStackResultView.prototype.renderAnswerBody = function(answer, question_id) {
      var answerHtml, answer_id, display_name;
      display_name = $('<textarea/>').html(answer['owner'].display_name).text();
      answer_id = answer['answer_id'];
      answerHtml = $$$(function() {
        return this.div((function(_this) {
          return function() {
            _this.a({
              href: answer['link'],
              id: "answer-link-" + answer_id
            }, function() {
              return _this.span({
                "class": 'answer-link',
                title: 'Open in browser'
              }, '➚');
            });
            if (answer['is_accepted']) {
              _this.span({
                "class": 'label label-success'
              }, 'Accepted');
            }
            _this.div({
              "class": 'score answer',
              title: answer['score'] + ' Votes'
            }, function() {
              return _this.p(answer['score']);
            });
            _this.div({
              "class": 'score is-accepted'
            }, function() {
              if (answer['is_accepted']) {
                return _this.p({
                  "class": 'icon icon-check',
                  title: 'Accepted answer'
                });
              }
            });
            return _this.div({
              "class": 'created'
            }, function() {
              _this.text(new Date(answer['creation_date'] * 1000).toLocaleString());
              _this.text(' - answered by ');
              return _this.a({
                href: answer['owner'].link,
                id: "answer-author-link-" + answer_id
              }, display_name);
            });
          };
        })(this));
      });
      $("#answers-" + question_id).append($(answerHtml).append(answer['body']));
      this.highlightCode("answers-" + question_id);
      return this.addCodeButtons("answers-" + question_id, answer_id, 'answer');
    };

    AskStackResultView.prototype.highlightCode = function(elem_id) {
      var code, codeHl, i, len, pre, pres, results;
      pres = this.resultsView.find("#" + elem_id).find('pre');
      results = [];
      for (i = 0, len = pres.length; i < len; i++) {
        pre = pres[i];
        code = $(pre).children('code').first();
        if (code !== void 0) {
          codeHl = hljs.highlightAuto(code.text()).value;
          results.push(code.html(codeHl));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    AskStackResultView.prototype.addCodeButtons = function(elem_id, id, id_type) {
      var btnInsert, i, len, pre, pres, results;
      pres = this.resultsView.find("#" + elem_id).find('pre');
      results = [];
      for (i = 0, len = pres.length; i < len; i++) {
        pre = pres[i];
        btnInsert = this.genCodeButton('Insert', id, id_type);
        results.push($(pre).prev().after(btnInsert));
      }
      return results;
    };

    AskStackResultView.prototype.genCodeButton = function(type, id, id_type) {
      var btn;
      btn = $('<button/>', {
        text: type,
        "class": 'btn btn-default btn-xs'
      });
      if (type === 'Insert') {
        $(btn).click(function(event) {
          var author_name, author_src, code, editor, source_src;
          code = $(this).next('pre').text();
          if (code !== void 0) {
            atom.workspace.activatePreviousPane();
            editor = atom.workspace.getActivePaneItem();
            if (id !== void 0) {
              author_src = $("#" + id_type + "-author-link-" + id).attr('href');
              author_name = $("#" + id_type + "-author-link-" + id).html();
              source_src = $("#" + id_type + "-link-" + id).attr('href');
              return editor.transact((function(_this) {
                return function() {
                  editor.insertText("Author: " + author_name + " - " + author_src, {
                    select: true
                  });
                  editor.toggleLineCommentsInSelection();
                  editor.insertNewlineBelow();
                  editor.insertText("Source: " + source_src, {
                    select: true
                  });
                  editor.toggleLineCommentsInSelection();
                  editor.insertNewlineBelow();
                  return editor.insertText(code);
                };
              })(this));
            } else {
              return editor.insertText(code);
            }
          }
        });
      }
      return btn;
    };

    AskStackResultView.prototype.loadMoreResults = function() {
      if (this.answersJson['has_more']) {
        this.progressIndicator.show();
        this.loadMore.hide();
        AskStackApiClient.page = AskStackApiClient.page + 1;
        return AskStackApiClient.search((function(_this) {
          return function(response) {
            _this.loadMore.show();
            _this.progressIndicator.hide();
            return _this.renderAnswers(response, true);
          };
        })(this));
      } else {
        return $('#load-more').children().children('span').text('No more results to load.');
      }
    };

    AskStackResultView.prototype.setupNavigation = function(question, curAnswer) {
      var quesId;
      quesId = question['question_id'];
      $("a[href='#next" + quesId + "']").click((function(_this) {
        return function(event) {
          if (curAnswer + 1 >= question['answers'].length) {
            curAnswer = 0;
          } else {
            curAnswer += 1;
          }
          $("#answers-" + quesId).children().last().remove();
          $("#curAnswer-" + quesId)[0].innerText = curAnswer + 1;
          return _this.renderAnswerBody(question['answers'][curAnswer], quesId);
        };
      })(this));
      return $("a[href='#prev" + quesId + "']").click((function(_this) {
        return function(event) {
          if (curAnswer - 1 < 0) {
            curAnswer = question['answers'].length - 1;
          } else {
            curAnswer -= 1;
          }
          $("#answers-" + quesId).children().last().remove();
          $("#curAnswer-" + quesId)[0].innerText = curAnswer + 1;
          return _this.renderAnswerBody(question['answers'][curAnswer], quesId);
        };
      })(this));
    };

    return AskStackResultView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2Fzay1zdGFjay9saWIvYXNrLXN0YWNrLXJlc3VsdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsb0VBQUE7SUFBQTs7O0VBQUEsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsU0FBRCxFQUFJLGFBQUosRUFBUzs7RUFDVCxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVI7O0VBQ3BCLElBQUEsR0FBTyxPQUFBLENBQVEsY0FBUjs7RUFFUCxNQUFNLENBQUMsTUFBUCxHQUFnQjs7RUFDaEIsT0FBQSxDQUFRLDJCQUFSOztFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixrQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sc0NBQVA7UUFBK0MsUUFBQSxFQUFVLENBQUMsQ0FBMUQ7T0FBTCxFQUFrRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDaEUsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLEVBQUEsRUFBSSxjQUFKO1lBQW9CLE1BQUEsRUFBUSxhQUE1QjtXQUFMO1VBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLEVBQUEsRUFBSSxXQUFKO1lBQWlCLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBeEI7WUFBcUMsS0FBQSxFQUFPLGlCQUE1QztZQUErRCxNQUFBLEVBQVEsVUFBdkU7V0FBTCxFQUF3RixTQUFBO21CQUN0RixLQUFDLENBQUEsQ0FBRCxDQUFHO2NBQUEsSUFBQSxFQUFNLFdBQU47YUFBSCxFQUFzQixTQUFBO3FCQUNwQixLQUFDLENBQUEsSUFBRCxDQUFPLGNBQVA7WUFEb0IsQ0FBdEI7VUFEc0YsQ0FBeEY7aUJBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLEVBQUEsRUFB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LE1BQWhCLEdBQXVCLElBQXpCLENBQTZCLENBQUMsS0FBOUIsQ0FBb0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7VUFDaEMsSUFBRyxTQUFBLEdBQVUsQ0FBVixHQUFjLENBQWpCO1lBQXdCLFNBQUEsR0FBWSxRQUFTLENBQUEsU0FBQSxDQUFVLENBQUMsTUFBcEIsR0FBMkIsRUFBL0Q7V0FBQSxNQUFBO1lBQXNFLFNBQUEsSUFBYSxFQUFuRjs7VUFDQSxDQUFBLENBQUUsV0FBQSxHQUFZLE1BQWQsQ0FBdUIsQ0FBQyxRQUF4QixDQUFBLENBQWtDLENBQUMsSUFBbkMsQ0FBQSxDQUF5QyxDQUFDLE1BQTFDLENBQUE7VUFDQSxDQUFBLENBQUUsYUFBQSxHQUFjLE1BQWhCLENBQTBCLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBN0IsR0FBeUMsU0FBQSxHQUFVO2lCQUNuRCxLQUFDLENBQUEsZ0JBQUQsQ0FBa0IsUUFBUyxDQUFBLFNBQUEsQ0FBVyxDQUFBLFNBQUEsQ0FBdEMsRUFBa0QsTUFBbEQ7UUFKZ0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDO0lBVmU7Ozs7S0E1T2M7QUFSakMiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCwgJCQkLCBTY3JvbGxWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuQXNrU3RhY2tBcGlDbGllbnQgPSByZXF1aXJlICcuL2Fzay1zdGFjay1hcGktY2xpZW50J1xuaGxqcyA9IHJlcXVpcmUgJ2hpZ2hsaWdodC5qcydcblxud2luZG93LmpRdWVyeSA9ICRcbnJlcXVpcmUgJy4vdmVuZG9yL2Jvb3RzdHJhcC5taW4uanMnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEFza1N0YWNrUmVzdWx0VmlldyBleHRlbmRzIFNjcm9sbFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ2Fzay1zdGFjay1yZXN1bHQgbmF0aXZlLWtleS1iaW5kaW5ncycsIHRhYmluZGV4OiAtMSwgPT5cbiAgICAgIEBkaXYgaWQ6ICdyZXN1bHRzLXZpZXcnLCBvdXRsZXQ6ICdyZXN1bHRzVmlldydcbiAgICAgIEBkaXYgaWQ6ICdsb2FkLW1vcmUnLCBjbGFzczogJ2xvYWQtbW9yZScsIGNsaWNrOiAnbG9hZE1vcmVSZXN1bHRzJywgb3V0bGV0OiAnbG9hZE1vcmUnLCA9PlxuICAgICAgICBAYSBocmVmOiAnI2xvYWRtb3JlJywgPT5cbiAgICAgICAgICBAc3BhbiAgJ0xvYWQgTW9yZS4uLidcbiAgICAgIEBkaXYgaWQ6ICdwcm9ncmVzc0luZGljYXRvcicsIGNsYXNzOiAncHJvZ3Jlc3NJbmRpY2F0b3InLCBvdXRsZXQ6ICdwcm9ncmVzc0luZGljYXRvcicsID0+XG4gICAgICAgIEBzcGFuIGNsYXNzOiAnbG9hZGluZyBsb2FkaW5nLXNwaW5uZXItbWVkaXVtJ1xuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgc3VwZXJcblxuICBnZXRUaXRsZTogLT5cbiAgICAnQXNrIFN0YWNrIFJlc3VsdHMnXG5cbiAgZ2V0VVJJOiAtPlxuICAgICdhc2stc3RhY2s6Ly9yZXN1bHQtdmlldydcblxuICBnZXRJY29uTmFtZTogLT5cbiAgICAndGhyZWUtYmFycydcblxuICBvbkRpZENoYW5nZVRpdGxlOiAtPlxuICBvbkRpZENoYW5nZU1vZGlmaWVkOiAtPlxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAc3Vic2NyaWJlIHRoaXMsICdjb3JlOm1vdmUtdXAnLCA9PiBAc2Nyb2xsVXAoKVxuICAgIEBzdWJzY3JpYmUgdGhpcywgJ2NvcmU6bW92ZS1kb3duJywgPT4gQHNjcm9sbERvd24oKVxuXG4gIHJlbmRlckFuc3dlcnM6IChhbnN3ZXJzSnNvbiwgbG9hZE1vcmUgPSBmYWxzZSkgLT5cbiAgICBAYW5zd2Vyc0pzb24gPSBhbnN3ZXJzSnNvblxuXG4gICAgIyBDbGVhbiB1cCBIVE1MIGlmIHdlIGFyZSBsb2FkaW5nIGEgbmV3IHNldCBvZiBhbnN3ZXJzXG4gICAgQHJlc3VsdHNWaWV3Lmh0bWwoJycpIHVubGVzcyBsb2FkTW9yZVxuXG4gICAgaWYgYW5zd2Vyc0pzb25bJ2l0ZW1zJ10ubGVuZ3RoID09IDBcbiAgICAgIHRoaXMuaHRtbCgnPGJyPjxjZW50ZXI+WW91ciBzZWFyY2ggcmV0dXJuZWQgbm8gbWF0Y2hlcy48L2NlbnRlcj4nKVxuICAgIGVsc2VcbiAgICAgICMgUmVuZGVyIHRoZSBxdWVzdGlvbiBoZWFkZXJzIGZpcnN0XG4gICAgICBmb3IgcXVlc3Rpb24gaW4gYW5zd2Vyc0pzb25bJ2l0ZW1zJ11cbiAgICAgICAgQHJlbmRlclF1ZXN0aW9uSGVhZGVyKHF1ZXN0aW9uKVxuXG4gICAgICAjIFRoZW4gcmVuZGVyIHRoZSBxdWVzdGlvbnMgYW5kIGFuc3dlcnNcbiAgICAgIGZvciBxdWVzdGlvbiBpbiBhbnN3ZXJzSnNvblsnaXRlbXMnXVxuICAgICAgICBAcmVuZGVyUXVlc3Rpb25Cb2R5KHF1ZXN0aW9uKVxuXG4gIHJlbmRlclF1ZXN0aW9uSGVhZGVyOiAocXVlc3Rpb24pIC0+XG4gICAgIyBEZWNvZGUgdGl0bGUgaHRtbCBlbnRpdGllc1xuICAgIHRpdGxlID0gJCgnPGRpdi8+JykuaHRtbChxdWVzdGlvblsndGl0bGUnXSkudGV4dCgpO1xuICAgICMgRGVjb2RlIGRpc3BsYXlfbmFtZSBodG1sIGVudGl0aWVzXG4gICAgZGlzcGxheV9uYW1lID0gJCgnPHRleHRhcmVhIC8+JykuaHRtbChxdWVzdGlvblsnb3duZXInXS5kaXNwbGF5X25hbWUpLnRleHQoKTtcbiAgICAjIFN0b3JlIHRoZSBxdWVzdGlvbiBpZC5cbiAgICBxdWVzdGlvbl9pZCA9IHF1ZXN0aW9uWydxdWVzdGlvbl9pZCddO1xuXG4gICAgcXVlc3Rpb25IZWFkZXIgPSAkJCQgLT5cbiAgICAgIEBkaXYgaWQ6IHF1ZXN0aW9uWydxdWVzdGlvbl9pZCddLCBjbGFzczogJ3VpLXJlc3VsdCcsID0+XG4gICAgICAgIEBoMiBjbGFzczogJ3RpdGxlJywgPT5cbiAgICAgICAgICBAYSBocmVmOiBxdWVzdGlvblsnbGluayddLCBpZDogXCJxdWVzdGlvbi1saW5rLSN7cXVlc3Rpb25faWR9XCIsIGNsYXNzOiAndW5kZXJsaW5lIHRpdGxlLXN0cmluZycsIHRpdGxlXG4gICAgICAgICAgIyBBZGRlZCB0b29sdGlwIHRvIGV4cGxhaW4gdGhhdCB0aGUgdmFsdWUgaXMgdGhlIG51bWJlciBvZiB2b3Rlc1xuICAgICAgICAgIEBkaXYgY2xhc3M6ICdzY29yZScsIHRpdGxlOiBxdWVzdGlvblsnc2NvcmUnXSArICcgVm90ZXMnLCA9PlxuICAgICAgICAgICAgQHAgcXVlc3Rpb25bJ3Njb3JlJ11cbiAgICAgICAgICAjIEFkZGVkIGEgbmV3IGJhZGdlIGZvciBzaG93aW5nIHRoZSB0b3RhbCBudW1iZXIgb2YgYW5zd2VycywgYW5kIGEgdG9vbHRpcCB0byBleHBsYWluIHRoYXQgdGhlIHZhbHVlIGlzIHRoZSBudW1iZXIgb2YgYW5zd2Vyc1xuICAgICAgICAgIEBkaXYgY2xhc3M6ICdhbnN3ZXJzJywgdGl0bGU6IHF1ZXN0aW9uWydhbnN3ZXJfY291bnQnXSArICcgQW5zd2VycycsID0+XG4gICAgICAgICAgICBAcCBxdWVzdGlvblsnYW5zd2VyX2NvdW50J11cbiAgICAgICAgICAjIEFkZGVkIGEgY2hlY2sgbWFyayB0byBzaG93IHRoYXQgdGhlIHF1ZXN0aW9uIGhhcyBhbiBhY2NlcHRlZCBhbnN3ZXJcbiAgICAgICAgICBAZGl2IGNsYXNzOiAnaXMtYWNjZXB0ZWQnLCA9PlxuICAgICAgICAgICAgQHAgY2xhc3M6ICdpY29uIGljb24tY2hlY2snLCB0aXRsZTogJ1RoaXMgcXVlc3Rpb24gaGFzIGFuIGFjY2VwdGVkIGFuc3dlcicgaWYgcXVlc3Rpb25bJ2FjY2VwdGVkX2Fuc3dlcl9pZCddXG4gICAgICAgIEBkaXYgY2xhc3M6ICdjcmVhdGVkJywgPT5cbiAgICAgICAgICBAdGV4dCBuZXcgRGF0ZShxdWVzdGlvblsnY3JlYXRpb25fZGF0ZSddICogMTAwMCkudG9Mb2NhbGVTdHJpbmcoKVxuICAgICAgICAgICMgQWRkZWQgY3JlZGl0cyBvZiB3aG8gYXNrZWQgdGhlIHF1ZXN0aW9uLCB3aXRoIGEgbGluayBiYWNrIHRvIHRoZWlyIHByb2ZpbGVcbiAgICAgICAgICBAdGV4dCAnIC0gYXNrZWQgYnkgJ1xuICAgICAgICAgIEBhIGhyZWY6IHF1ZXN0aW9uWydvd25lciddLmxpbmssIGlkOiBcInF1ZXN0aW9uLWF1dGhvci1saW5rLSN7cXVlc3Rpb25faWR9XCIsIGRpc3BsYXlfbmFtZVxuICAgICAgICBAZGl2IGNsYXNzOiAndGFncycsID0+XG4gICAgICAgICAgZm9yIHRhZyBpbiBxdWVzdGlvblsndGFncyddXG4gICAgICAgICAgICBAc3BhbiBjbGFzczogJ2xhYmVsIGxhYmVsLWluZm8nLCB0YWdcbiAgICAgICAgICAgIEB0ZXh0ICdcXG4nXG4gICAgICAgIEBkaXYgY2xhc3M6ICdjb2xsYXBzZS1idXR0b24nXG5cbiAgICAjIFNwYWNlLXBlbiBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCB0aGUgZGF0YS10b2dnbGUgYW5kIGRhdGEtdGFyZ2V0IGF0dHJpYnV0ZXNcbiAgICB0b2dnbGVCdG4gPSAkKCc8YnV0dG9uPjwvYnV0dG9uPicsIHtcbiAgICAgIGlkOiBcInRvZ2dsZS0je3F1ZXN0aW9uWydxdWVzdGlvbl9pZCddfVwiLFxuICAgICAgdHlwZTogJ2J1dHRvbicsXG4gICAgICBjbGFzczogJ2J0biBidG4taW5mbyBidG4teHMnLFxuICAgICAgdGV4dDogJ1Nob3cgTW9yZSdcbiAgICB9KVxuICAgIHRvZ2dsZUJ0bi5hdHRyKCdkYXRhLXRvZ2dsZScsICdjb2xsYXBzZScpXG4gICAgdG9nZ2xlQnRuLmF0dHIoJ2RhdGEtdGFyZ2V0JywgXCIjcXVlc3Rpb24tYm9keS0je3F1ZXN0aW9uWydxdWVzdGlvbl9pZCddfVwiKVxuXG4gICAgaHRtbCA9ICQocXVlc3Rpb25IZWFkZXIpLmZpbmQoJy5jb2xsYXBzZS1idXR0b24nKS5hcHBlbmQodG9nZ2xlQnRuKS5wYXJlbnQoKVxuICAgIEByZXN1bHRzVmlldy5hcHBlbmQoaHRtbClcblxuICByZW5kZXJRdWVzdGlvbkJvZHk6IChxdWVzdGlvbikgLT5cbiAgICBjdXJBbnN3ZXIgPSAwXG4gICAgcXVlc0lkID0gcXVlc3Rpb25bJ3F1ZXN0aW9uX2lkJ11cblxuICAgICMgVGhpcyBpcyBtb3N0bHkgb25seSByZW5kZXJlZCBoZXJlIGFuZCBub3Qgd2l0aCB0aGUgYW5zd2VyIGJlY2F1c2Ugd2UgbmVlZFxuICAgICMgdGhlIGZ1bGwgcXVlc3Rpb24gb2JqZWN0IHRvIGtub3cgaG93IG1hbnkgYW5zd2VycyB0aGVyZSBhcmUuIE1pZ2h0IGJlIGEgZ29vZFxuICAgICMgdGhpbmcgdG8gcmVmYWN0b3IgdGhpcyBhdCBzb21lIHBvaW50IGFuZCByZW5kZXIgdGhlIG5hdmlnYXRpb24gd2l0aCB0aGUgYW5zd2VyLlxuICAgIGlmIHF1ZXN0aW9uWydhbnN3ZXJfY291bnQnXSA+IDBcbiAgICAgIGFuc3dlcl90YWIgPSBcIjxhIGhyZWY9JyNwcmV2I3txdWVzSWR9Jz48PCBQcmV2PC9hPiAgIDxzcGFuIGlkPSdjdXJBbnN3ZXItI3txdWVzSWR9Jz4je2N1ckFuc3dlcisxfTwvc3Bhbj4vI3txdWVzdGlvblsnYW5zd2VycyddLmxlbmd0aH0gIDxhIGhyZWY9JyNuZXh0I3txdWVzSWR9Jz5OZXh0ID4+PC9hPiBcIlxuICAgIGVsc2VcbiAgICAgIGFuc3dlcl90YWIgPSBcIjxicj48Yj5UaGlzIHF1ZXN0aW9uIGhhcyBub3QgYmVlbiBhbnN3ZXJlZC48L2I+XCJcblxuICAgICMgTGVhdmluZyBhcyBIVE1MIGZvciBub3cgYXMgc3BhY2UtcGVuIGRvZXNuJ3Qgc3VwcG9ydCBkYXRhLXRvZ2dsZSBhdHRyaWJ1dGVcbiAgICAjIEFsc28gc3RydWdnbGluZyB3aXRoIDxjZW50ZXI+IGFuZCB0aGUgbmF2aWdhdGlvbiBsaW5rXG4gICAgZGl2ID0gJCgnPGRpdj48L2Rpdj4nLCB7XG4gICAgICBpZDogXCJxdWVzdGlvbi1ib2R5LSN7cXVlc3Rpb25bJ3F1ZXN0aW9uX2lkJ119XCJcbiAgICAgIGNsYXNzOiBcImNvbGxhcHNlIGhpZGRlblwiXG4gICAgICB9KVxuICAgIGRpdi5odG1sKFwiXG4gICAgPHVsIGNsYXNzPSduYXYgbmF2LXRhYnMgbmF2LWp1c3RpZmllZCc+XG4gICAgICA8bGkgY2xhc3M9J2FjdGl2ZSc+PGEgaHJlZj0nI3F1ZXN0aW9uLSN7cXVlc0lkfScgZGF0YS10b2dnbGU9J3RhYic+UXVlc3Rpb248L2E+PC9saT5cbiAgICAgIDxsaT48YSBocmVmPScjYW5zd2Vycy0je3F1ZXNJZH0nIGRhdGEtdG9nZ2xlPSd0YWInPkFuc3dlcnM8L2E+PC9saT5cbiAgICA8L3VsPlxuICAgIDxkaXYgaWQ9J3F1ZXN0aW9uLWJvZHktI3txdWVzdGlvblsncXVlc3Rpb25faWQnXX0tbmF2JyBjbGFzcz0ndGFiLWNvbnRlbnQgaGlkZGVuJz5cbiAgICAgIDxkaXYgY2xhc3M9J3RhYi1wYW5lIGFjdGl2ZScgaWQ9J3F1ZXN0aW9uLSN7cXVlc0lkfSc+I3txdWVzdGlvblsnYm9keSddfTwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz0ndGFiLXBhbmUgYW5zd2VyLW5hdmlnYXRpb24nIGlkPSdhbnN3ZXJzLSN7cXVlc0lkfSc+XG4gICAgICAgIDxjZW50ZXI+I3thbnN3ZXJfdGFifTwvY2VudGVyPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XCIpXG5cbiAgICAkKFwiIyN7cXVlc0lkfVwiKS5hcHBlbmQoZGl2KVxuXG4gICAgQGhpZ2hsaWdodENvZGUoXCJxdWVzdGlvbi0je3F1ZXNJZH1cIilcbiAgICBAYWRkQ29kZUJ1dHRvbnMoXCJxdWVzdGlvbi0je3F1ZXNJZH1cIiwgcXVlc0lkLCAncXVlc3Rpb24nKVxuICAgIGlmIHF1ZXN0aW9uWydhbnN3ZXJfY291bnQnXSA+IDBcbiAgICAgIEByZW5kZXJBbnN3ZXJCb2R5KHF1ZXN0aW9uWydhbnN3ZXJzJ11bY3VyQW5zd2VyXSwgcXVlc0lkKVxuICAgICAgQHNldHVwTmF2aWdhdGlvbihxdWVzdGlvbiwgY3VyQW5zd2VyKVxuXG4gICAgIyBRdWVzdGlvbiB0b2dnbGUgYnV0dG9uXG4gICAgJChcIiN0b2dnbGUtI3txdWVzSWR9XCIpLmNsaWNrIChldmVudCkgLT5cbiAgICAgIGJ0biA9ICQodGhpcylcbiAgICAgIGlmICggJChcIiNxdWVzdGlvbi1ib2R5LSN7cXVlc0lkfVwiKS5oYXNDbGFzcygnaW4nKSApXG4gICAgICAgICQoXCIjcXVlc3Rpb24tYm9keS0je3F1ZXNJZH1cIikuYWRkQ2xhc3MoJ2hpZGRlbicpXG4gICAgICAgICQoXCIjcXVlc3Rpb24tYm9keS0je3F1ZXNJZH0tbmF2XCIpLmFkZENsYXNzKCdoaWRkZW4nKVxuICAgICAgICBidG4ucGFyZW50cyhcIiMje3F1ZXNJZH1cIikuYXBwZW5kKGJ0bi5wYXJlbnQoKSlcbiAgICAgICAgJCh0aGlzKS50ZXh0KCdTaG93IE1vcmUnKVxuICAgICAgZWxzZVxuICAgICAgICAkKFwiI3F1ZXN0aW9uLWJvZHktI3txdWVzSWR9XCIpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKVxuICAgICAgICAkKFwiI3F1ZXN0aW9uLWJvZHktI3txdWVzSWR9LW5hdlwiKS5yZW1vdmVDbGFzcygnaGlkZGVuJylcbiAgICAgICAgYnRuLnBhcmVudCgpLnNpYmxpbmdzKFwiI3F1ZXN0aW9uLWJvZHktI3txdWVzSWR9XCIpLmFwcGVuZChidG4ucGFyZW50KCkpXG4gICAgICAgIGJ0bi50ZXh0KCdTaG93IExlc3MnKVxuXG4gIHJlbmRlckFuc3dlckJvZHk6IChhbnN3ZXIsIHF1ZXN0aW9uX2lkKSAtPlxuICAgICMgRGVjb2RlIGRpc3BsYXlfbmFtZSBodG1sIGVudGl0aWVzXG4gICAgZGlzcGxheV9uYW1lID0gJCgnPHRleHRhcmVhLz4nKS5odG1sKGFuc3dlclsnb3duZXInXS5kaXNwbGF5X25hbWUpLnRleHQoKTtcbiAgICAjIFN0b3JlIHRoZSBhbnN3ZXIgaWQuXG4gICAgYW5zd2VyX2lkID0gYW5zd2VyWydhbnN3ZXJfaWQnXTtcblxuICAgIGFuc3dlckh0bWwgPSAkJCQgLT5cbiAgICAgIEBkaXYgPT5cbiAgICAgICAgQGEgaHJlZjogYW5zd2VyWydsaW5rJ10sIGlkOiBcImFuc3dlci1saW5rLSN7YW5zd2VyX2lkfVwiLCA9PlxuICAgICAgICAgIEBzcGFuIGNsYXNzOiAnYW5zd2VyLWxpbmsnLCB0aXRsZTogJ09wZW4gaW4gYnJvd3NlcicsICfinponXG4gICAgICAgIEBzcGFuIGNsYXNzOiAnbGFiZWwgbGFiZWwtc3VjY2VzcycsICdBY2NlcHRlZCcgaWYgYW5zd2VyWydpc19hY2NlcHRlZCddXG4gICAgICAgICMgQWRkZWQgdG9vbHRpcCB0byBleHBsYWluIHRoYXQgdGhlIHZhbHVlIGlzIHRoZSBudW1iZXIgb2Ygdm90ZXNcbiAgICAgICAgQGRpdiBjbGFzczogJ3Njb3JlIGFuc3dlcicsIHRpdGxlOiBhbnN3ZXJbJ3Njb3JlJ10gKyAnIFZvdGVzJywgPT5cbiAgICAgICAgICBAcCBhbnN3ZXJbJ3Njb3JlJ11cbiAgICAgICAgIyBBZGRlZCBhIGNoZWNrIG1hcmsgdG8gc2hvdyB0aGF0IHRoaXMgaXMgdGhlIGFjY2VwdGVkIGFuc3dlclxuICAgICAgICBAZGl2IGNsYXNzOiAnc2NvcmUgaXMtYWNjZXB0ZWQnLCA9PlxuICAgICAgICAgIEBwIGNsYXNzOiAnaWNvbiBpY29uLWNoZWNrJywgdGl0bGU6ICdBY2NlcHRlZCBhbnN3ZXInIGlmIGFuc3dlclsnaXNfYWNjZXB0ZWQnXVxuICAgICAgICAjIEFkZGVkIGNyZWRpdHMgb2Ygd2hvIGFuc3dlcmVkIHRoZSBxdWVzdGlvbiwgd2l0aCBhIGxpbmsgYmFjayB0byB0aGVpciBwcm9maWxlLCBhbmQgYWxzbyB3aGVuIGl0IHdhcyBhbnN3ZXJlZFxuICAgICAgICBAZGl2IGNsYXNzOiAnY3JlYXRlZCcsID0+XG4gICAgICAgICAgQHRleHQgbmV3IERhdGUoYW5zd2VyWydjcmVhdGlvbl9kYXRlJ10gKiAxMDAwKS50b0xvY2FsZVN0cmluZygpXG4gICAgICAgICAgQHRleHQgJyAtIGFuc3dlcmVkIGJ5ICdcbiAgICAgICAgICBAYSBocmVmOiBhbnN3ZXJbJ293bmVyJ10ubGluaywgaWQ6IFwiYW5zd2VyLWF1dGhvci1saW5rLSN7YW5zd2VyX2lkfVwiLCBkaXNwbGF5X25hbWVcblxuICAgICQoXCIjYW5zd2Vycy0je3F1ZXN0aW9uX2lkfVwiKS5hcHBlbmQoJChhbnN3ZXJIdG1sKS5hcHBlbmQoYW5zd2VyWydib2R5J10pKVxuXG4gICAgQGhpZ2hsaWdodENvZGUoXCJhbnN3ZXJzLSN7cXVlc3Rpb25faWR9XCIpXG4gICAgQGFkZENvZGVCdXR0b25zKFwiYW5zd2Vycy0je3F1ZXN0aW9uX2lkfVwiLCBhbnN3ZXJfaWQsICdhbnN3ZXInKVxuXG4gIGhpZ2hsaWdodENvZGU6IChlbGVtX2lkKSAtPlxuICAgIHByZXMgPSBAcmVzdWx0c1ZpZXcuZmluZChcIiMje2VsZW1faWR9XCIpLmZpbmQoJ3ByZScpXG4gICAgZm9yIHByZSBpbiBwcmVzXG4gICAgICBjb2RlID0gJChwcmUpLmNoaWxkcmVuKCdjb2RlJykuZmlyc3QoKVxuICAgICAgaWYoY29kZSAhPSB1bmRlZmluZWQpXG4gICAgICAgIGNvZGVIbCA9ICBobGpzLmhpZ2hsaWdodEF1dG8oY29kZS50ZXh0KCkpLnZhbHVlXG4gICAgICAgIGNvZGUuaHRtbChjb2RlSGwpXG5cbiAgYWRkQ29kZUJ1dHRvbnM6IChlbGVtX2lkLCBpZCwgaWRfdHlwZSkgLT5cbiAgICBwcmVzID0gQHJlc3VsdHNWaWV3LmZpbmQoXCIjI3tlbGVtX2lkfVwiKS5maW5kKCdwcmUnKVxuICAgIGZvciBwcmUgaW4gcHJlc1xuICAgICAgYnRuSW5zZXJ0ID0gQGdlbkNvZGVCdXR0b24oJ0luc2VydCcsIGlkLCBpZF90eXBlKVxuICAgICAgJChwcmUpLnByZXYoKS5hZnRlcihidG5JbnNlcnQpXG5cbiAgZ2VuQ29kZUJ1dHRvbjogKHR5cGUsIGlkLCBpZF90eXBlKSAtPlxuICAgIGJ0biA9ICQoJzxidXR0b24vPicsXG4gICAge1xuICAgICAgICB0ZXh0OiB0eXBlLFxuICAgICAgICBjbGFzczogJ2J0biBidG4tZGVmYXVsdCBidG4teHMnXG4gICAgfSlcbiAgICBpZiB0eXBlID09ICdJbnNlcnQnXG4gICAgICAkKGJ0bikuY2xpY2sgKGV2ZW50KSAtPlxuICAgICAgICBjb2RlID0gJCh0aGlzKS5uZXh0KCdwcmUnKS50ZXh0KClcbiAgICAgICAgaWYgY29kZSAhPSB1bmRlZmluZWRcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5hY3RpdmF0ZVByZXZpb3VzUGFuZSgpXG4gICAgICAgICAgIyBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5hY3RpdmVQYW5lSXRlbVxuICAgICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcblxuICAgICAgICAgICMgQ2hlY2sgaWYgYW4gaWQgd2FzIHBhc3NlZCBpbiB0byBmaW5kIGluZm9ybWF0aW9uIGFib3V0IHRoZSBhdXRob3IgYW5kIHNvdXJjZVxuICAgICAgICAgIGlmIGlkICE9IHVuZGVmaW5lZFxuICAgICAgICAgICAgIyBHZXQgdGhlIGF0dHJpYnV0ZSBhdXRob3IgYW5kIHNvdXJjZSBpbmZvcm1hdGlvblxuICAgICAgICAgICAgYXV0aG9yX3NyYyA9ICQoXCIjI3tpZF90eXBlfS1hdXRob3ItbGluay0je2lkfVwiKS5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICBhdXRob3JfbmFtZSA9ICQoXCIjI3tpZF90eXBlfS1hdXRob3ItbGluay0je2lkfVwiKS5odG1sKCk7XG4gICAgICAgICAgICBzb3VyY2Vfc3JjID0gJChcIiMje2lkX3R5cGV9LWxpbmstI3tpZH1cIikuYXR0cignaHJlZicpO1xuXG4gICAgICAgICAgICAjIFRyYW5zYWN0IHRoZSBmb2xsb3dpbmcgYWRkaXRpb25zIHNvIHRoYXQgdGhleSBhcmUgYWxsIGluIG9uZSB1bmRvIGluc3RhbmNlXG4gICAgICAgICAgICBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgICAgICAgICAgIyBJbnNlcnQgdGhlIGF1dGhvciBpbmZvcm1hdGlvblxuICAgICAgICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dChcIkF1dGhvcjogI3thdXRob3JfbmFtZX0gLSAje2F1dGhvcl9zcmN9XCIsIHtzZWxlY3Q6IHRydWV9KVxuICAgICAgICAgICAgICBlZGl0b3IudG9nZ2xlTGluZUNvbW1lbnRzSW5TZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgZWRpdG9yLmluc2VydE5ld2xpbmVCZWxvdygpO1xuXG4gICAgICAgICAgICAgICMgSW5zZXJ0IHRoZSBzb3VyY2UgaW5mb3JtYXRpb25cbiAgICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoXCJTb3VyY2U6ICN7c291cmNlX3NyY31cIiwge3NlbGVjdDogdHJ1ZX0pXG4gICAgICAgICAgICAgIGVkaXRvci50b2dnbGVMaW5lQ29tbWVudHNJblNlbGVjdGlvbigpO1xuICAgICAgICAgICAgICBlZGl0b3IuaW5zZXJ0TmV3bGluZUJlbG93KCk7XG5cbiAgICAgICAgICAgICAgIyBJbnNlcnQgdGhlIGNvZGVcbiAgICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoY29kZSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZWRpdG9yLmluc2VydFRleHQoY29kZSlcbiAgICByZXR1cm4gYnRuXG5cbiAgbG9hZE1vcmVSZXN1bHRzOiAtPlxuICAgIGlmIEBhbnN3ZXJzSnNvblsnaGFzX21vcmUnXVxuICAgICAgQHByb2dyZXNzSW5kaWNhdG9yLnNob3coKVxuICAgICAgQGxvYWRNb3JlLmhpZGUoKVxuICAgICAgQXNrU3RhY2tBcGlDbGllbnQucGFnZSA9IEFza1N0YWNrQXBpQ2xpZW50LnBhZ2UgKyAxXG4gICAgICBBc2tTdGFja0FwaUNsaWVudC5zZWFyY2ggKHJlc3BvbnNlKSA9PlxuICAgICAgICBAbG9hZE1vcmUuc2hvdygpXG4gICAgICAgIEBwcm9ncmVzc0luZGljYXRvci5oaWRlKClcbiAgICAgICAgQHJlbmRlckFuc3dlcnMocmVzcG9uc2UsIHRydWUpXG4gICAgZWxzZVxuICAgICAgJCgnI2xvYWQtbW9yZScpLmNoaWxkcmVuKCkuY2hpbGRyZW4oJ3NwYW4nKS50ZXh0KCdObyBtb3JlIHJlc3VsdHMgdG8gbG9hZC4nKVxuXG4gIHNldHVwTmF2aWdhdGlvbjogKHF1ZXN0aW9uLCBjdXJBbnN3ZXIpIC0+XG4gICAgcXVlc0lkID0gcXVlc3Rpb25bJ3F1ZXN0aW9uX2lkJ11cblxuICAgICMgQW5zd2VycyBuYXZpZ2F0aW9uXG4gICAgJChcImFbaHJlZj0nI25leHQje3F1ZXNJZH0nXVwiKS5jbGljayAoZXZlbnQpID0+XG4gICAgICAgIGlmIGN1ckFuc3dlcisxID49IHF1ZXN0aW9uWydhbnN3ZXJzJ10ubGVuZ3RoIHRoZW4gY3VyQW5zd2VyID0gMCBlbHNlIGN1ckFuc3dlciArPSAxXG4gICAgICAgICQoXCIjYW5zd2Vycy0je3F1ZXNJZH1cIikuY2hpbGRyZW4oKS5sYXN0KCkucmVtb3ZlKClcbiAgICAgICAgJChcIiNjdXJBbnN3ZXItI3txdWVzSWR9XCIpWzBdLmlubmVyVGV4dCA9IGN1ckFuc3dlcisxXG4gICAgICAgIEByZW5kZXJBbnN3ZXJCb2R5KHF1ZXN0aW9uWydhbnN3ZXJzJ11bY3VyQW5zd2VyXSwgcXVlc0lkKVxuXG4gICAgJChcImFbaHJlZj0nI3ByZXYje3F1ZXNJZH0nXVwiKS5jbGljayAoZXZlbnQpID0+XG4gICAgICAgIGlmIGN1ckFuc3dlci0xIDwgMCB0aGVuIGN1ckFuc3dlciA9IHF1ZXN0aW9uWydhbnN3ZXJzJ10ubGVuZ3RoLTEgZWxzZSBjdXJBbnN3ZXIgLT0gMVxuICAgICAgICAkKFwiI2Fuc3dlcnMtI3txdWVzSWR9XCIpLmNoaWxkcmVuKCkubGFzdCgpLnJlbW92ZSgpXG4gICAgICAgICQoXCIjY3VyQW5zd2VyLSN7cXVlc0lkfVwiKVswXS5pbm5lclRleHQgPSBjdXJBbnN3ZXIrMVxuICAgICAgICBAcmVuZGVyQW5zd2VyQm9keShxdWVzdGlvblsnYW5zd2VycyddW2N1ckFuc3dlcl0sIHF1ZXNJZClcbiJdfQ==
