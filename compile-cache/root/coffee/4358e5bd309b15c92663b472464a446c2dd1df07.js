(function() {
  var Api, ComboApi, ParticlesEffect, audioPlayer, canvasRenderer, comboMode, comboRenderer, defaultEffect, defaultFlow, deleteFlow, editorRegistry, playAudio, powerCanvas, screenShake, screenShaker, switcher, userFileFlow;

  Api = require("./api");

  ParticlesEffect = require("./effect/particles");

  comboRenderer = require("./combo-renderer");

  canvasRenderer = require("./canvas-renderer");

  editorRegistry = require("./service/editor-registry");

  ComboApi = require("./service/combo-api");

  screenShaker = require("./service/screen-shaker");

  audioPlayer = require("./service/audio-player");

  screenShake = require("./plugin/screen-shake");

  playAudio = require("./plugin/play-audio");

  powerCanvas = require("./plugin/power-canvas");

  comboMode = require("./plugin/combo-mode");

  defaultEffect = require("./effect/default");

  defaultFlow = require("./flow/default");

  deleteFlow = require("./flow/delete");

  userFileFlow = require("./flow/user-file");

  switcher = require("./switcher");

  module.exports = {
    comboRenderer: comboRenderer,
    canvasRenderer: canvasRenderer,
    switcher: switcher,
    defaultEffect: defaultEffect,
    defaultFlow: defaultFlow,
    deleteFlow: deleteFlow,
    userFileFlow: userFileFlow,
    editorRegistry: editorRegistry,
    screenShaker: screenShaker,
    audioPlayer: audioPlayer,
    screenShake: screenShake,
    playAudio: playAudio,
    comboMode: comboMode,
    powerCanvas: powerCanvas,
    init: function(config, pluginRegistry, flowRegistry, effectRegistry) {
      this.pluginRegistry = pluginRegistry;
      this.flowRegistry = flowRegistry;
      this.effectRegistry = effectRegistry;
      this.initApi();
      pluginRegistry.init(config, this.api);
      this.initCoreFlows();
      this.initCoreEffects();
      return this.initCorePlugins();
    },
    initApi: function() {
      this.comboRenderer.setPluginManager(this);
      this.comboApi = new ComboApi(this.comboRenderer);
      this.canvasRenderer.setEffectRegistry(this.effectRegistry);
      this.screenShaker.init();
      this.audioPlayer.init();
      return this.api = new Api(this.editorRegistry, this.comboApi, this.screenShaker, this.audioPlayer);
    },
    initCorePlugins: function() {
      this.comboMode.setComboRenderer(this.comboRenderer);
      this.powerCanvas.setCanvasRenderer(this.canvasRenderer);
      this.pluginRegistry.addCorePlugin('particles', this.powerCanvas);
      this.pluginRegistry.addCorePlugin('comboMode', this.comboMode);
      this.pluginRegistry.addPlugin('screenShake', this.screenShake);
      return this.pluginRegistry.addPlugin('playAudio', this.playAudio);
    },
    initCoreFlows: function() {
      this.flowRegistry.setDefaultFlow(this.defaultFlow);
      this.flowRegistry.addFlow('delete', this.deleteFlow);
      return this.flowRegistry.addFlow('user-file', this.userFileFlow);
    },
    initCoreEffects: function() {
      var effect;
      effect = new ParticlesEffect(defaultEffect);
      return this.effectRegistry.setDefaultEffect(effect);
    },
    enable: function() {
      this.pluginRegistry.enable(this.api);
      this.flowRegistry.enable();
      return this.effectRegistry.enable();
    },
    disable: function() {
      this.screenShaker.disable();
      this.audioPlayer.disable();
      this.flowRegistry.disable();
      this.effectRegistry.disable();
      this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.disable === "function" ? plugin.disable() : void 0;
      });
      return this.pluginRegistry.disable();
    },
    runOnChangePane: function(editor, editorElement) {
      if (editor == null) {
        editor = null;
      }
      if (editorElement == null) {
        editorElement = null;
      }
      this.editorRegistry.setEditor(editor);
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onChangePane === "function" ? plugin.onChangePane(editor, editorElement) : void 0;
      });
    },
    runOnNewCursor: function(cursor) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onNewCursor === "function" ? plugin.onNewCursor(cursor) : void 0;
      });
    },
    runOnInput: function(cursor, screenPosition, input) {
      this.switcher.reset();
      this.flowRegistry.flow.handle(input, this.switcher, this.comboApi.getLevel());
      return this.pluginRegistry.onEnabled((function(_this) {
        return function(code, plugin) {
          if (_this.switcher.isOff(code)) {
            return true;
          }
          return typeof plugin.onInput === "function" ? plugin.onInput(cursor, screenPosition, input, _this.switcher.getData(code)) : void 0;
        };
      })(this));
    },
    runOnComboStartStreak: function() {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboStartStreak === "function" ? plugin.onComboStartStreak() : void 0;
      });
    },
    runOnComboLevelChange: function(newLvl, oldLvl) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboLevelChange === "function" ? plugin.onComboLevelChange(newLvl, oldLvl) : void 0;
      });
    },
    runOnComboEndStreak: function() {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboEndStreak === "function" ? plugin.onComboEndStreak() : void 0;
      });
    },
    runOnComboExclamation: function(text) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboExclamation === "function" ? plugin.onComboExclamation(text) : void 0;
      });
    },
    runOnComboMaxStreak: function(maxStreak) {
      return this.pluginRegistry.onEnabled(function(code, plugin) {
        return typeof plugin.onComboMaxStreak === "function" ? plugin.onComboMaxStreak(maxStreak) : void 0;
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL3BsdWdpbi1tYW5hZ2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSOztFQUNOLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSOztFQUNsQixhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUjs7RUFDaEIsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVI7O0VBQ2pCLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUNqQixRQUFBLEdBQVcsT0FBQSxDQUFRLHFCQUFSOztFQUNYLFlBQUEsR0FBZSxPQUFBLENBQVEseUJBQVI7O0VBQ2YsV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUjs7RUFDZCxXQUFBLEdBQWMsT0FBQSxDQUFRLHVCQUFSOztFQUNkLFNBQUEsR0FBWSxPQUFBLENBQVEscUJBQVI7O0VBQ1osV0FBQSxHQUFjLE9BQUEsQ0FBUSx1QkFBUjs7RUFDZCxTQUFBLEdBQVksT0FBQSxDQUFRLHFCQUFSOztFQUNaLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSOztFQUNoQixXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUNkLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFDYixZQUFBLEdBQWUsT0FBQSxDQUFRLGtCQUFSOztFQUNmLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsYUFBQSxFQUFlLGFBQWY7SUFDQSxjQUFBLEVBQWdCLGNBRGhCO0lBRUEsUUFBQSxFQUFVLFFBRlY7SUFHQSxhQUFBLEVBQWUsYUFIZjtJQUlBLFdBQUEsRUFBYSxXQUpiO0lBS0EsVUFBQSxFQUFZLFVBTFo7SUFNQSxZQUFBLEVBQWMsWUFOZDtJQU9BLGNBQUEsRUFBZ0Is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UUFBUSxnQkFBZ0IsT0FBTyxLQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsSUFBbEI7UUFGakQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREY7SUFKVSxDQTlFWjtJQXdGQSxxQkFBQSxFQUF1QixTQUFBO2FBQ3JCLElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBaEIsQ0FDRSxTQUFDLElBQUQsRUFBTyxNQUFQO2lFQUFrQixNQUFNLENBQUM7TUFBekIsQ0FERjtJQURxQixDQXhGdkI7SUE2RkEscUJBQUEsRUFBdUIsU0FBQyxNQUFELEVBQVMsTUFBVDthQUNyQixJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLENBQ0UsU0FBQyxJQUFELEVBQU8sTUFBUDtpRUFBa0IsTUFBTSxDQUFDLG1CQUFvQixRQUFRO01BQXJELENBREY7SUFEcUIsQ0E3RnZCO0lBa0dBLG1CQUFBLEVBQXFCLFNBQUE7YUFDbkIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUNFLFNBQUMsSUFBRCxFQUFPLE1BQVA7K0RBQWtCLE1BQU0sQ0FBQztNQUF6QixDQURGO0lBRG1CLENBbEdyQjtJQXVHQSxxQkFBQSxFQUF1QixTQUFDLElBQUQ7YUFDckIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFoQixDQUNFLFNBQUMsSUFBRCxFQUFPLE1BQVA7aUVBQWtCLE1BQU0sQ0FBQyxtQkFBb0I7TUFBN0MsQ0FERjtJQURxQixDQXZHdkI7SUE0R0EsbUJBQUEsRUFBcUIsU0FBQyxTQUFEO2FBQ25CLElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBaEIsQ0FDRSxTQUFDLElBQUQsRUFBTyxNQUFQOytEQUFrQixNQUFNLENBQUMsaUJBQWtCO01BQTNDLENBREY7SUFEbUIsQ0E1R3JCOztBQW5CRiIsInNvdXJjZXNDb250ZW50IjpbIkFwaSA9IHJlcXVpcmUgXCIuL2FwaVwiXG5QYXJ0aWNsZXNFZmZlY3QgPSByZXF1aXJlIFwiLi9lZmZlY3QvcGFydGljbGVzXCJcbmNvbWJvUmVuZGVyZXIgPSByZXF1aXJlIFwiLi9jb21iby1yZW5kZXJlclwiXG5jYW52YXNSZW5kZXJlciA9IHJlcXVpcmUgXCIuL2NhbnZhcy1yZW5kZXJlclwiXG5lZGl0b3JSZWdpc3RyeSA9IHJlcXVpcmUgXCIuL3NlcnZpY2UvZWRpdG9yLXJlZ2lzdHJ5XCJcbkNvbWJvQXBpID0gcmVxdWlyZSBcIi4vc2VydmljZS9jb21iby1hcGlcIlxuc2NyZWVuU2hha2VyID0gcmVxdWlyZSBcIi4vc2VydmljZS9zY3JlZW4tc2hha2VyXCJcbmF1ZGlvUGxheWVyID0gcmVxdWlyZSBcIi4vc2VydmljZS9hdWRpby1wbGF5ZXJcIlxuc2NyZWVuU2hha2UgPSByZXF1aXJlIFwiLi9wbHVnaW4vc2NyZWVuLXNoYWtlXCJcbnBsYXlBdWRpbyA9IHJlcXVpcmUgXCIuL3BsdWdpbi9wbGF5LWF1ZGlvXCJcbnBvd2VyQ2FudmFzID0gcmVxdWlyZSBcIi4vcGx1Z2luL3Bvd2VyLWNhbnZhc1wiXG5jb21ib01vZGUgPSByZXF1aXJlIFwiLi9wbHVnaW4vY29tYm8tbW9kZVwiXG5kZWZhdWx0RWZmZWN0ID0gcmVxdWlyZSBcIi4vZWZmZWN0L2RlZmF1bHRcIlxuZGVmYXVsdEZsb3cgPSByZXF1aXJlIFwiLi9mbG93L2RlZmF1bHRcIlxuZGVsZXRlRmxvdyA9IHJlcXVpcmUgXCIuL2Zsb3cvZGVsZXRlXCJcbnVzZXJGaWxlRmxvdyA9IHJlcXVpcmUgXCIuL2Zsb3cvdXNlci1maWxlXCJcbnN3aXRjaGVyID0gcmVxdWlyZSBcIi4vc3dpdGNoZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbWJvUmVuZGVyZXI6IGNvbWJvUmVuZGVyZXJcbiAgY2FudmFzUmVuZGVyZXI6IGNhbnZhc1JlbmRlcmVyXG4gIHN3aXRjaGVyOiBzd2l0Y2hlclxuICBkZWZhdWx0RWZmZWN0OiBkZWZhdWx0RWZmZWN0XG4gIGRlZmF1bHRGbG93OiBkZWZhdWx0Rmxvd1xuICBkZWxldGVGbG93OiBkZWxldGVGbG93XG4gIHVzZXJGaWxlRmxvdzogdXNlckZpbGVGbG93XG4gIGVkaXRvclJlZ2lzdHJ5OiBlZGl0b3JSZWdpc3RyeVxuICBzY3JlZW5TaGFrZXI6IHNjcmVlblNoYWtlclxuICBhdWRpb1BsYXllcjogYXVkaW9QbGF5ZXJcbiAgc2NyZWVuU2hha2U6IHNjcmVlblNoYWtlXG4gIHBsYXlBdWRpbzogcGxheUF1ZGlvXG4gIGNvbWJvTW9kZTogY29tYm9Nb2RlXG4gIHBvd2VyQ2FudmFzOiBwb3dlckNhbnZhc1xuXG4gIGluaXQ6IChjb25maWcsIHBsdWdpblJlZ2lzdHJ5LCBmbG93UmVnaXN0cnksIGVmZmVjdFJlZ2lzdHJ5KSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeSA9IHBsdWdpblJlZ2lzdHJ5XG4gICAgQGZsb3dSZWdpc3RyeSA9IGZsb3dSZWdpc3RyeVxuICAgIEBlZmZlY3RSZWdpc3RyeSA9IGVmZmVjdFJlZ2lzdHJ5XG4gICAgQGluaXRBcGkoKVxuICAgIHBsdWdpblJlZ2lzdHJ5LmluaXQgY29uZmlnLCBAYXBpXG4gICAgQGluaXRDb3JlRmxvd3MoKVxuICAgIEBpbml0Q29yZUVmZmVjdHMoKVxuICAgIEBpbml0Q29yZVBsdWdpbnMoKVxuXG4gIGluaXRBcGk6IC0+XG4gICAgQGNvbWJvUmVuZGVyZXIuc2V0UGx1Z2luTWFuYWdlciB0aGlzXG4gICAgQGNvbWJvQXBpID0gbmV3IENvbWJvQXBpKEBjb21ib1JlbmRlcmVyKVxuICAgIEBjYW52YXNSZW5kZXJlci5zZXRFZmZlY3RSZWdpc3RyeSBAZWZmZWN0UmVnaXN0cnlcbiAgICBAc2NyZWVuU2hha2VyLmluaXQoKVxuICAgIEBhdWRpb1BsYXllci5pbml0KClcbiAgICBAYXBpID0gbmV3IEFwaShAZWRpdG9yUmVnaXN0cnksIEBjb21ib0FwaSwgQHNjcmVlblNoYWtlciwgQGF1ZGlvUGxheWVyKVxuXG4gIGluaXRDb3JlUGx1Z2luczogLT5cbiAgICBAY29tYm9Nb2RlLnNldENvbWJvUmVuZGVyZXIgQGNvbWJvUmVuZGVyZXJcbiAgICBAcG93ZXJDYW52YXMuc2V0Q2FudmFzUmVuZGVyZXIgQGNhbnZhc1JlbmRlcmVyXG4gICAgQHBsdWdpblJlZ2lzdHJ5LmFkZENvcmVQbHVnaW4gJ3BhcnRpY2xlcycsIEBwb3dlckNhbnZhc1xuICAgIEBwbHVnaW5SZWdpc3RyeS5hZGRDb3JlUGx1Z2luICdjb21ib01vZGUnLCBAY29tYm9Nb2RlXG4gICAgQHBsdWdpblJlZ2lzdHJ5LmFkZFBsdWdpbiAnc2NyZWVuU2hha2UnLCBAc2NyZWVuU2hha2VcbiAgICBAcGx1Z2luUmVnaXN0cnkuYWRkUGx1Z2luICdwbGF5QXVkaW8nLCBAcGxheUF1ZGlvXG5cbiAgaW5pdENvcmVGbG93czogLT5cbiAgICBAZmxvd1JlZ2lzdHJ5LnNldERlZmF1bHRGbG93IEBkZWZhdWx0Rmxvd1xuICAgIEBmbG93UmVnaXN0cnkuYWRkRmxvdyAnZGVsZXRlJywgQGRlbGV0ZUZsb3dcbiAgICBAZmxvd1JlZ2lzdHJ5LmFkZEZsb3cgJ3VzZXItZmlsZScsIEB1c2VyRmlsZUZsb3dcblxuICBpbml0Q29yZUVmZmVjdHM6IC0+XG4gICAgZWZmZWN0ID0gbmV3IFBhcnRpY2xlc0VmZmVjdChkZWZhdWx0RWZmZWN0KVxuICAgIEBlZmZlY3RSZWdpc3RyeS5zZXREZWZhdWx0RWZmZWN0IGVmZmVjdFxuXG4gIGVuYWJsZTogLT5cbiAgICBAcGx1Z2luUmVnaXN0cnkuZW5hYmxlIEBhcGlcbiAgICBAZmxvd1JlZ2lzdHJ5LmVuYWJsZSgpXG4gICAgQGVmZmVjdFJlZ2lzdHJ5LmVuYWJsZSgpXG5cbiAgZGlzYWJsZTogLT5cbiAgICBAc2NyZWVuU2hha2VyLmRpc2FibGUoKVxuICAgIEBhdWRpb1BsYXllci5kaXNhYmxlKClcbiAgICBAZmxvd1JlZ2lzdHJ5LmRpc2FibGUoKVxuICAgIEBlZmZlY3RSZWdpc3RyeS5kaXNhYmxlKClcblxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4uZGlzYWJsZT8oKVxuICAgIClcbiAgICBAcGx1Z2luUmVnaXN0cnkuZGlzYWJsZSgpXG5cbiAgcnVuT25DaGFuZ2VQYW5lOiAoZWRpdG9yID0gbnVsbCwgZWRpdG9yRWxlbWVudCA9IG51bGwpIC0+XG4gICAgQGVkaXRvclJlZ2lzdHJ5LnNldEVkaXRvciBlZGl0b3JcblxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25DaGFuZ2VQYW5lPyhlZGl0b3IsIGVkaXRvckVsZW1lbnQpXG4gICAgKVxuXG4gIHJ1bk9uTmV3Q3Vyc29yOiAoY3Vyc29yKSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25OZXdDdXJzb3I/KGN1cnNvcilcbiAgICApXG5cbiAgcnVuT25JbnB1dDogKGN1cnNvciwgc2NyZWVuUG9zaXRpb24sIGlucHV0KSAtPlxuICAgIEBzd2l0Y2hlci5yZXNldCgpXG4gICAgQGZsb3dSZWdpc3RyeS5mbG93LmhhbmRsZSBpbnB1dCwgQHN3aXRjaGVyLCBAY29tYm9BcGkuZ2V0TGV2ZWwoKVxuXG4gICAgQHBsdWdpblJlZ2lzdHJ5Lm9uRW5hYmxlZChcbiAgICAgIChjb2RlLCBwbHVnaW4pID0+XG4gICAgICAgIHJldHVybiB0cnVlIGlmIEBzd2l0Y2hlci5pc09mZiBjb2RlXG4gICAgICAgIHBsdWdpbi5vbklucHV0PyhjdXJzb3IsIHNjcmVlblBvc2l0aW9uLCBpbnB1dCwgQHN3aXRjaGVyLmdldERhdGEgY29kZSlcbiAgICApXG5cbiAgcnVuT25Db21ib1N0YXJ0U3RyZWFrOiAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25Db21ib1N0YXJ0U3RyZWFrPygpXG4gICAgKVxuXG4gIHJ1bk9uQ29tYm9MZXZlbENoYW5nZTogKG5ld0x2bCwgb2xkTHZsKSAtPlxuICAgIEBwbHVnaW5SZWdpc3RyeS5vbkVuYWJsZWQoXG4gICAgICAoY29kZSwgcGx1Z2luKSAtPiBwbHVnaW4ub25Db21ib0xldmVsQ2hhbmdlPyhuZXdMdmwsIG9sZEx2bClcbiAgICApXG5cbiAgcnVuT25Db21ib0VuZFN0cmVhazogLT5cbiAgICBAcGx1Z2luUmVnaXN0cnkub25FbmFibGVkKFxuICAgICAgKGNvZGUsIHBsdWdpbikgLT4gcGx1Z2luLm9uQ29tYm9FbmRTdHJlYWs/KClcbiAgICApXG5cbiAgcnVuT25Db21ib0V4Y2xhbWF0aW9uOiAodGV4dCkgLT5cbiAgICBAcGx1Z2luUmVnaXN0cnkub25FbmFibGVkKFxuICAgICAgKGNvZGUsIHBsdWdpbikgLT4gcGx1Z2luLm9uQ29tYm9FeGNsYW1hdGlvbj8odGV4dClcbiAgICApXG5cbiAgcnVuT25Db21ib01heFN0cmVhazogKG1heFN0cmVhaykgLT5cbiAgICBAcGx1Z2luUmVnaXN0cnkub25FbmFibGVkKFxuICAgICAgKGNvZGUsIHBsdWdpbikgLT4gcGx1Z2luLm9uQ29tYm9NYXhTdHJlYWs/KG1heFN0cmVhaylcbiAgICApXG4iXX0=
