(function() {
  module.exports = {
    autoToggle: {
      title: "Auto Toggle",
      description: "Toggle on start.",
      type: "boolean",
      "default": true,
      order: 1
    },
    comboMode: {
      type: "object",
      order: 2,
      properties: {
        enabled: {
          title: "Combo Mode - Enabled",
          description: "When enabled effects won't appear until reach the activation threshold.",
          type: "boolean",
          "default": true,
          order: 1
        },
        multiplier: {
          title: "Combo Mode - Multiplier",
          description: "Turn the multiplier on/off. (multiplier = streak * current level).",
          type: "boolean",
          "default": true,
          order: 2
        },
        activationThreshold: {
          title: "Combo Mode - Activation Threshold",
          description: "Streak threshold to activate the power mode and levels.",
          type: "array",
          "default": ['20', '50', '100', '200', '500']
        },
        streakTimeout: {
          title: "Combo Mode - Streak Timeout",
          description: "Timeout to reset the streak counter. In seconds.",
          type: "integer",
          "default": 10,
          minimum: 1,
          maximum: 100
        },
        exclamationEvery: {
          title: "Combo Mode - Exclamation Every",
          description: "Shows an exclamation every streak count. (Let in 0 to disable)",
          type: "integer",
          "default": 10,
          minimum: 0,
          maximum: 100
        },
        exclamationTexts: {
          title: "Combo Mode - Exclamation Texts",
          description: "Exclamations to show (randomized).",
          type: "array",
          "default": ["Super!", "Radical!", "Fantastic!", "Great!", "OMG", "Whoah!", ":O", "Nice!", "Splendid!", "Wild!", "Grand!", "Impressive!", "Stupendous!", "Extreme!", "Awesome!"]
        },
        opacity: {
          title: "Combo Mode - Opacity",
          description: "Opacity of the streak counter.",
          type: "number",
          "default": 0.6,
          minimum: 0,
          maximum: 1
        }
      }
    },
    particles: {
      type: "object",
      order: 3,
      properties: {
        enabled: {
          title: "Particles - Enabled",
          description: "Turn the particles on/off.",
          type: "boolean",
          "default": true,
          order: 1
        },
        colours: {
          type: "object",
          properties: {
            type: {
              title: "Colours",
              description: "Configure colour options",
              description: "Configure colour options. You can also use the command `Activate Power Mode:Select Color`",
              type: "string",
              "default": "cursor",
              "enum": [
                {
                  value: 'cursor',
                  description: 'Colour at the cursor.'
                }, {
                  value: 'randomSpawn',
                  description: 'Random colour per spawn.'
                }, {
                  value: 'random',
                  description: 'Random colours per particle.'
                }, {
                  value: 'fixed',
                  description: 'Fixed colour.'
                }
              ],
              order: 1
            },
            fixed: {
              title: "Fixed colour",
              description: "Colour when fixed colour is selected",
              type: "color",
              "default": "#fff"
            },
            randomType: {
              title: "Random colour type",
              description: "Type of ramdom colour",
              type: "string",
              "default": 'bright',
              "enum": [
                {
                  value: 'bright',
                  description: 'Bright colours'
                }, {
                  value: 'all',
                  description: 'All colours'
                }
              ]
            }
          }
        },
        totalCount: {
          type: "object",
          properties: {
            max: {
              title: "Particles - Max Total",
              description: "The maximum total number of particles on the screen.",
              type: "integer",
              "default": 500,
              minimum: 0
            }
          }
        },
        spawnCount: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Spawned",
              description: "The minimum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 5
            },
            max: {
              title: "Particles - Maximum Spawned",
              description: "The maximum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 15
            }
          }
        },
        size: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Size",
              description: "The minimum (randomized) size of the particles.",
              type: "integer",
              "default": 2,
              minimum: 0
            },
            max: {
              title: "Particles - Maximum Size",
              description: "The maximum (randomized) size of the particles.",
              type: "integer",
              "default": 4,
              minimum: 0
            }
          }
        },
        effect: {
          title: "Effect",
          description: "Defines the canvas effect. Select it with the command `Activate Power Mode:Select Effect`",
          type: "string",
          "default": "",
          order: 7
        }
      }
    },
    screenShake: {
      type: "object",
      order: 4,
      properties: {
        enabled: {
          title: "Screen Shake - Enabled",
          description: "Turn the shaking on/off.",
          type: "boolean",
          "default": true
        },
        minIntensity: {
          title: "Screen Shake - Minimum Intensity",
          description: "The minimum (randomized) intensity of the shake.",
          type: "integer",
          "default": 1,
          minimum: 0,
          maximum: 100
        },
        maxIntensity: {
          title: "Screen Shake - Maximum Intensity",
          description: "The maximum (randomized) intensity of the shake.",
          type: "integer",
          "default": 3,
          minimum: 0,
          maximum: 100
        }
      }
    },
    playAudio: {
      type: "object",
      order: 5,
      properties: {
        enabled: {
          title: "Play Audio - Enabled",
          description: "Play audio clip on/off.",
          type: "boolean",
          "default": false,
          order: 1
        },
        audioclip: {
          title: "Play Audio - Audioclip",
          description: "Which audio clip played at keystroke.",
          type: "string",
          "default": '../audioclips/gun.wav',
          "enum": [
            {
              value: '../audioclips/gun.wav',
              description: 'Gun'
            }, {
              value: '../audioclips/typewriter.wav',
              description: 'Type Writer'
            }, {
              value: 'customAudioclip',
              description: 'Custom Path'
            }
          ],
          order: 3
        },
        customAudioclip: {
          title: "Play Audio - Path to Audioclip",
          description: "Path to audioclip played at keystroke.",
          type: "string",
          "default": 'rocksmash.wav',
          order: 4
        },
        volume: {
          title: "Play Audio - Volume",
          description: "Volume of the audio clip played at keystroke.",
          type: "number",
          "default": 0.42,
          minimum: 0.0,
          maximum: 1.0,
          order: 2
        }
      }
    },
    excludedFileTypes: {
      order: 6,
      type: "object",
      properties: {
        excluded: {
          title: "Prohibit activate-power-mode from enabling on these file types:",
          description: "Use comma separated, lowercase values (i.e. \"html, cpp, css\")",
          type: "array",
          "default": ["."]
        }
      }
    },
    flow: {
      title: "Flow",
      description: "Defines the flow when typing. Select with the command `Activate Power Mode:Select Flow`",
      type: "string",
      "default": "",
      order: 7
    },
    plugins: {
      type: "object",
      order: 8,
      properties: {}
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL2FjdGl2YXRlLXBvd2VyLW1vZGUvbGliL2NvbmZpZy1zY2hlbWEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFVBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxhQUFQO01BQ0EsV0FBQSxFQUFhLGtCQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7TUFJQSxLQUFBLEVBQU8sQ0FKUDtLQURGO0lBT0EsU0FBQSxFQUNFO01BQUEsSUFBQSxFQUFNLFFBQU47TUFDQSxLQUFBLEVBQU8sQ0FEUDtNQUVBLFVBQUEsRUFDRTtRQUFBLE9BQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxzQkFBUDtVQUNBLFdBQUEsRUFBYSx5RUFEYjtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1VBSUEsS0FBQSxFQUFPLENBSlA7U0FERjtRQU9BLFVBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyx5QkFBUDtVQUNBLFdBQUEsRUFBYSxvRUFEYjtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1VBSUEsS0FBQSxFQUFPLENBSlA7U0FSRjtRQWNBLG1CQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sbUNBQVA7VUFDQSxXQUFBLEVBQWEseURBRGI7VUFFQSxJQUFBLEVBQU0sT0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLEtBQWIsRUFBb0IsS0FBcEIsRUFBMkIsS0FBM0IsQ0FIVDtTQWZGO1FBd0JBLGFBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyw2QkFBUDtVQUNBLFdBQUEsRUFBYSxrREFEYjtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxP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RUFHSjtjQUFDLEtBQUEsRUFBTyxpQkFBUjtjQUEyQixXQUFBLEVBQWEsYUFBeEM7YUFISTtXQUpOO1VBU0EsS0FBQSxFQUFPLENBVFA7U0FSRjtRQW1CQSxlQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sZ0NBQVA7VUFDQSxXQUFBLEVBQWEsd0NBRGI7VUFFQSxJQUFBLEVBQU0sUUFGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsZUFIVDtVQUlBLEtBQUEsRUFBTyxDQUpQO1NBcEJGO1FBMEJBLE1BQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxxQkFBUDtVQUNBLFdBQUEsRUFBYSwrQ0FEYjtVQUVBLElBQUEsRUFBTSxRQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1VBSUEsT0FBQSxFQUFTLEdBSlQ7VUFLQSxPQUFBLEVBQVMsR0FMVDtVQU1BLEtBQUEsRUFBTyxDQU5QO1NBM0JGO09BSEY7S0F6TEY7SUErTkEsaUJBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxDQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxVQUFBLEVBQ0U7UUFBQSxRQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8saUVBQVA7VUFDQSxXQUFBLEVBQWEsaUVBRGI7VUFFQSxJQUFBLEVBQU0sT0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBQyxHQUFELENBSFQ7U0FERjtPQUhGO0tBaE9GO0lBeU9BLElBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxNQUFQO01BQ0EsV0FBQSxFQUFhLHlGQURiO01BRUEsSUFBQSxFQUFNLFFBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBSFQ7TUFJQSxLQUFBLEVBQU8sQ0FKUDtLQTFPRjtJQWdQQSxPQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sUUFBTjtNQUNBLEtBQUEsRUFBTyxDQURQO01BRUEsVUFBQSxFQUFZLEVBRlo7S0FqUEY7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIGF1dG9Ub2dnbGU6XG4gICAgdGl0bGU6IFwiQXV0byBUb2dnbGVcIlxuICAgIGRlc2NyaXB0aW9uOiBcIlRvZ2dsZSBvbiBzdGFydC5cIlxuICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgZGVmYXVsdDogdHJ1ZVxuICAgIG9yZGVyOiAxXG5cbiAgY29tYm9Nb2RlOlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBvcmRlcjogMlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBlbmFibGVkOlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gRW5hYmxlZFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIldoZW4gZW5hYmxlZCBlZmZlY3RzIHdvbid0IGFwcGVhciB1bnRpbCByZWFjaCB0aGUgYWN0aXZhdGlvbiB0aHJlc2hvbGQuXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBvcmRlcjogMVxuXG4gICAgICBtdWx0aXBsaWVyOlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gTXVsdGlwbGllclwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlR1cm4gdGhlIG11bHRpcGxpZXIgb24vb2ZmLiAobXVsdGlwbGllciA9IHN0cmVhayAqIGN1cnJlbnQgbGV2ZWwpLlwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgb3JkZXI6IDJcblxuICAgICAgYWN0aXZhdGlvblRocmVzaG9sZDpcbiAgICAgICAgdGl0bGU6IFwiQ29tYm8gTW9kZSAtIEFjdGl2YXRpb24gVGhyZXNob2xkXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU3RyZWFrIHRocmVzaG9sZCB0byBhY3RpdmF0ZSB0aGUgcG93ZXIgbW9kZSBhbmQgbGV2ZWxzLlwiXG4gICAgICAgIHR5cGU6IFwiYXJyYXlcIlxuICAgICAgICBkZWZhdWx0OiBbJzIwJywgJzUwJywgJzEwMCcsICcyMDAnLCAnNTAwJ11cbiAgICAgICAgIyBpdGVtczpcbiAgICAgICAgIyAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgICMgICBtaW5pbXVtOiAxXG4gICAgICAgICMgICBtYXhpbXVtOiAxMDAwXG5cbiAgICAgIHN0cmVha1RpbWVvdXQ6XG4gICAgICAgIHRpdGxlOiBcIkNvbWJvIE1vZGUgLSBTdHJlYWsgVGltZW91dFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRpbWVvdXQgdG8gcmVzZXQgdGhlIHN0cmVhayBjb3VudGVyLiBJbiBzZWNvbmRzLlwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDEwXG4gICAgICAgIG1pbmltdW06IDFcbiAgICAgICAgbWF4aW11bTogMTAwXG5cbiAgICAgIGV4Y2xhbWF0aW9uRXZlcnk6XG4gICAgICAgIHRpdGxlOiBcIkNvbWJvIE1vZGUgLSBFeGNsYW1hdGlvbiBFdmVyeVwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlNob3dzIGFuIGV4Y2xhbWF0aW9uIGV2ZXJ5IHN0cmVhayBjb3VudC4gKExldCBpbiAwIHRvIGRpc2FibGUpXCJcbiAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgZGVmYXVsdDogMTBcbiAgICAgICAgbWluaW11bTogMFxuICAgICAgICBtYXhpbXVtOiAxMDBcblxuICAgICAgZXhjbGFtYXRpb25UZXh0czpcbiAgICAgICAgdGl0bGU6IFwiQ29tYm8gTW9kZSAtIEV4Y2xhbWF0aW9uIFRleHRzXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiRXhjbGFtYXRpb25zIHRvIHNob3cgKHJhbmRvbWl6ZWQpLlwiXG4gICAgICAgIHR5cGU6IFwiYXJyYXlcIlxuICAgICAgICBkZWZhdWx0OiBbXCJTdXBlciFcIiwgXCJSYWRpY2FsIVwiLCBcIkZhbnRhc3RpYyFcIiwgXCJHcmVhdCFcIiwgXCJPTUdcIiwgXCJXaG9haCFcIiwgXCI6T1wiLCBcIk5pY2UhXCIsIFwiU3BsZW5kaWQhXCIsIFwiV2lsZCFcIiwgXCJHcmFuZCFcIiwgXCJJbXByZXNzaXZlIVwiLCBcIlN0dXBlbmRvdXMhXCIsIFwiRXh0cmVtZSFcIiwgXCJBd2Vzb21lIVwiXVxuXG4gICAgICBvcGFjaXR5OlxuICAgICAgICB0aXRsZTogXCJDb21ibyBNb2RlIC0gT3BhY2l0eVwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIk9wYWNpdHkgb2YgdGhlIHN0cmVhayBjb3VudGVyLlwiXG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCJcbiAgICAgICAgZGVmYXVsdDogMC42XG4gICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgbWF4aW11bTogMVxuXG4gIHBhcnRpY2xlczpcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgb3JkZXI6IDNcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgZW5hYmxlZDpcbiAgICAgICAgdGl0bGU6IFwiUGFydGljbGVzIC0gRW5hYmxlZFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlR1cm4gdGhlIHBhcnRpY2xlcyBvbi9vZmYuXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBvcmRlcjogMVxuXG4gICAgICBjb2xvdXJzOlxuICAgICAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgdHlwZTpcbiAgICAgICAgICAgIHRpdGxlOiBcIkNvbG91cnNcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiQ29uZmlndXJlIGNvbG91ciBvcHRpb25zXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkNvbmZpZ3VyZSBjb2xvdXIgb3B0aW9ucy4gWW91IGNhbiBhbHNvIHVzZSB0aGUgY29tbWFuZCBgQWN0aXZhdGUgUG93ZXIgTW9kZTpTZWxlY3QgQ29sb3JgXCJcbiAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiY3Vyc29yXCJcbiAgICAgICAgICAgIGVudW06IFtcbiAgICAgICAgICAgICAge3ZhbHVlOiAnY3Vyc29yJywgZGVzY3JpcHRpb246ICdDb2xvdXIgYXQgdGhlIGN1cnNvci4nfVxuICAgICAgICAgICAgICB7dmFsdWU6ICdyYW5kb21TcGF3bicsIGRlc2NyaXB0aW9uOiAnUmFuZG9tIGNvbG91ciBwZXIgc3Bhd24uJ31cbiAgICAgICAgICAgICAge3ZhbHVlOiAncmFuZG9tJywgZGVzY3JpcHRpb246ICdSYW5kb20gY29sb3VycyBwZXIgcGFydGljbGUuJ31cbiAgICAgICAgICAgICAge3ZhbHVlOiAnZml4ZWQnLCBkZXNjcmlwdGlvbjogJ0ZpeGVkIGNvbG91ci4nfVxuICAgICAgICAgICAgXVxuICAgICAgICAgICAgb3JkZXI6IDFcblxuICAgICAgICAgIGZpeGVkOlxuICAgICAgICAgICAgdGl0bGU6IFwiRml4ZWQgY29sb3VyXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkNvbG91ciB3aGVuIGZpeGVkIGNvbG91ciBpcyBzZWxlY3RlZFwiXG4gICAgICAgICAgICB0eXBlOiBcImNvbG9yXCJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFwiI2ZmZlwiXG5cbiAgICAgICAgICByYW5kb21UeXBlOlxuICAgICAgICAgICAgdGl0bGU6IFwiUmFuZG9tIGNvbG91ciB0eXBlXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlR5cGUgb2YgcmFtZG9tIGNvbG91clwiXG4gICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgICAgICBkZWZhdWx0OiAnYnJpZ2h0J1xuICAgICAgICAgICAgZW51bTogW1xuICAgICAgICAgICAgICB7dmFsdWU6ICdicmlnaHQnLCBkZXNjcmlwdGlvbjogJ0JyaWdodCBjb2xvdXJzJ31cbiAgICAgICAgICAgICAge3ZhbHVlOiAnYWxsJywgZGVzY3JpcHRpb246ICdBbGwgY29sb3Vycyd9XG4gICAgICAgICAgICBdXG5cbiAgICAgIHRvdGFsQ291bnQ6XG4gICAgICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICBtYXg6XG4gICAgICAgICAgICB0aXRsZTogXCJQYXJ0aWNsZXMgLSBNYXggVG90YWxcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gdG90YWwgbnVtYmVyIG9mIHBhcnRpY2xlcyBvbiB0aGUgc2NyZWVuLlwiXG4gICAgICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICAgICAgZGVmYXVsdDogNTAwXG4gICAgICAgICAgICBtaW5pbXVtOiAwXG5cbiAgICAgIHNwYXduQ291bnQ6XG4gICAgICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICBtaW46XG4gICAgICAgICAgICB0aXRsZTogXCJQYXJ0aWNsZXMgLSBNaW5pbXVtIFNwYXduZWRcIlxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1pbmltdW0gKHJhbmRvbWl6ZWQpIG51bWJlciBvZiBwYXJ0aWNsZXMgc3Bhd25lZCBvbiBpbnB1dC5cIlxuICAgICAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgICAgIGRlZmF1bHQ6IDVcblxuICAgICAgICAgIG1heDpcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhcnRpY2xlcyAtIE1heGltdW0gU3Bhd25lZFwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSAocmFuZG9taXplZCkgbnVtYmVyIG9mIHBhcnRpY2xlcyBzcGF3bmVkIG9uIGlucHV0LlwiXG4gICAgICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICAgICAgZGVmYXVsdDogMTVcblxuICAgICAgc2l6ZTpcbiAgICAgICAgdHlwZTogXCJvYmplY3RcIlxuICAgICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICAgIG1pbjpcbiAgICAgICAgICAgIHRpdGxlOiBcIlBhcnRpY2xlcyAtIE1pbmltdW0gU2l6ZVwiXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWluaW11bSAocmFuZG9taXplZCkgc2l6ZSBvZiB0aGUgcGFydGljbGVzLlwiXG4gICAgICAgICAgICB0eXBlOiBcImludGVnZXJcIlxuICAgICAgICAgICAgZGVmYXVsdDogMlxuICAgICAgICAgICAgbWluaW11bTogMFxuXG4gICAgICAgICAgbWF4OlxuICAgICAgICAgICAgdGl0bGU6IFwiUGFydGljbGVzIC0gTWF4aW11bSBTaXplXCJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIChyYW5kb21pemVkKSBzaXplIG9mIHRoZSBwYXJ0aWNsZXMuXCJcbiAgICAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgICAgICBkZWZhdWx0OiA0XG4gICAgICAgICAgICBtaW5pbXVtOiAwXG5cbiAgICAgIGVmZmVjdDpcbiAgICAgICAgdGl0bGU6IFwiRWZmZWN0XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiRGVmaW5lcyB0aGUgY2FudmFzIGVmZmVjdC4gU2VsZWN0IGl0IHdpdGggdGhlIGNvbW1hbmQgYEFjdGl2YXRlIFBvd2VyIE1vZGU6U2VsZWN0IEVmZmVjdGBcIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgICAgb3JkZXI6IDdcblxuICBzY3JlZW5TaGFrZTpcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgb3JkZXI6IDRcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgZW5hYmxlZDpcbiAgICAgICAgdGl0bGU6IFwiU2NyZWVuIFNoYWtlIC0gRW5hYmxlZFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlR1cm4gdGhlIHNoYWtpbmcgb24vb2ZmLlwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcblxuICAgICAgbWluSW50ZW5zaXR5OlxuICAgICAgICB0aXRsZTogXCJTY3JlZW4gU2hha2UgLSBNaW5pbXVtIEludGVuc2l0eVwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtaW5pbXVtIChyYW5kb21pemVkKSBpbnRlbnNpdHkgb2YgdGhlIHNoYWtlLlwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDFcbiAgICAgICAgbWluaW11bTogMFxuICAgICAgICBtYXhpbXVtOiAxMDBcblxuICAgICAgbWF4SW50ZW5zaXR5OlxuICAgICAgICB0aXRsZTogXCJTY3JlZW4gU2hha2UgLSBNYXhpbXVtIEludGVuc2l0eVwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIChyYW5kb21pemVkKSBpbnRlbnNpdHkgb2YgdGhlIHNoYWtlLlwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDNcbiAgICAgICAgbWluaW11bTogMFxuICAgICAgICBtYXhpbXVtOiAxMDBcblxuICBwbGF5QXVkaW86XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIG9yZGVyOiA1XG4gICAgcHJvcGVydGllczpcbiAgICAgIGVuYWJsZWQ6XG4gICAgICAgIHRpdGxlOiBcIlBsYXkgQXVkaW8gLSBFbmFibGVkXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiUGxheSBhdWRpbyBjbGlwIG9uL29mZi5cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBvcmRlcjogMVxuXG4gICAgICBhdWRpb2NsaXA6XG4gICAgICAgIHRpdGxlOiBcIlBsYXkgQXVkaW8gLSBBdWRpb2NsaXBcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJXaGljaCBhdWRpbyBjbGlwIHBsYXllZCBhdCBrZXlzdHJva2UuXCJcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICBkZWZhdWx0OiAnLi4vYXVkaW9jbGlwcy9ndW4ud2F2J1xuICAgICAgICBlbnVtOiBbXG4gICAgICAgICAge3ZhbHVlOiAnLi4vYXVkaW9jbGlwcy9ndW4ud2F2JywgZGVzY3JpcHRpb246ICdHdW4nfVxuICAgICAgICAgIHt2YWx1ZTogJy4uL2F1ZGlvY2xpcHMvdHlwZXdyaXRlci53YXYnLCBkZXNjcmlwdGlvbjogJ1R5cGUgV3JpdGVyJ31cbiAgICAgICAgICB7dmFsdWU6ICdjdXN0b21BdWRpb2NsaXAnLCBkZXNjcmlwdGlvbjogJ0N1c3RvbSBQYXRoJ31cbiAgICAgICAgXVxuICAgICAgICBvcmRlcjogM1xuXG4gICAgICBjdXN0b21BdWRpb2NsaXA6XG4gICAgICAgIHRpdGxlOiBcIlBsYXkgQXVkaW8gLSBQYXRoIHRvIEF1ZGlvY2xpcFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlBhdGggdG8gYXVkaW9jbGlwIHBsYXllZCBhdCBrZXlzdHJva2UuXCJcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICBkZWZhdWx0OiAncm9ja3NtYXNoLndhdidcbiAgICAgICAgb3JkZXI6IDRcblxuICAgICAgdm9sdW1lOlxuICAgICAgICB0aXRsZTogXCJQbGF5IEF1ZGlvIC0gVm9sdW1lXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVm9sdW1lIG9mIHRoZSBhdWRpbyBjbGlwIHBsYXllZCBhdCBrZXlzdHJva2UuXCJcbiAgICAgICAgdHlwZTogXCJudW1iZXJcIlxuICAgICAgICBkZWZhdWx0OiAwLjQyXG4gICAgICAgIG1pbmltdW06IDAuMFxuICAgICAgICBtYXhpbXVtOiAxLjBcbiAgICAgICAgb3JkZXI6IDJcblxuICBleGNsdWRlZEZpbGVUeXBlczpcbiAgICBvcmRlcjogNlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgZXhjbHVkZWQ6XG4gICAgICAgIHRpdGxlOiBcIlByb2hpYml0IGFjdGl2YXRlLXBvd2VyLW1vZGUgZnJvbSBlbmFibGluZyBvbiB0aGVzZSBmaWxlIHR5cGVzOlwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlVzZSBjb21tYSBzZXBhcmF0ZWQsIGxvd2VyY2FzZSB2YWx1ZXMgKGkuZS4gXFxcImh0bWwsIGNwcCwgY3NzXFxcIilcIlxuICAgICAgICB0eXBlOiBcImFycmF5XCJcbiAgICAgICAgZGVmYXVsdDogW1wiLlwiXVxuXG4gIGZsb3c6XG4gICAgdGl0bGU6IFwiRmxvd1wiXG4gICAgZGVzY3JpcHRpb246IFwiRGVmaW5lcyB0aGUgZmxvdyB3aGVuIHR5cGluZy4gU2VsZWN0IHdpdGggdGhlIGNvbW1hbmQgYEFjdGl2YXRlIFBvd2VyIE1vZGU6U2VsZWN0IEZsb3dgXCJcbiAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgZGVmYXVsdDogXCJcIlxuICAgIG9yZGVyOiA3XG5cbiAgcGx1Z2luczpcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgb3JkZXI6IDhcbiAgICBwcm9wZXJ0aWVzOiB7fVxuIl19
