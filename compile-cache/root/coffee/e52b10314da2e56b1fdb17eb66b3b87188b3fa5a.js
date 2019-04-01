(function() {
  var $, FOOTNOTE_REGEX, FOOTNOTE_TEST_REGEX, IMG_EXTENSIONS, IMG_OR_TEXT, IMG_REGEX, IMG_TAG_ATTRIBUTE, IMG_TAG_REGEX, INLINE_LINK_REGEX, INLINE_LINK_TEST_REGEX, LINK_ID, OPEN_TAG, REFERENCE_DEF_REGEX, REFERENCE_DEF_REGEX_OF, REFERENCE_LINK_REGEX, REFERENCE_LINK_REGEX_OF, REFERENCE_LINK_TEST_REGEX, SLUGIZE_CONTROL_REGEX, SLUGIZE_SPECIAL_REGEX, TABLE_ONE_COLUMN_ROW_REGEX, TABLE_ONE_COLUMN_SEPARATOR_REGEX, TABLE_ROW_REGEX, TABLE_SEPARATOR_REGEX, TEMPLATE_REGEX, UNTEMPLATE_REGEX, URL_AND_TITLE, URL_REGEX, capitalize, cleanDiacritics, createTableRow, createTableSeparator, createUntemplateMatcher, escapeRegExp, findLinkInRange, getAbsolutePath, getBufferRangeForScope, getDate, getHomedir, getJSON, getPackagePath, getProjectPath, getScopeDescriptor, getSitePath, getTextBufferRange, incrementChars, isFootnote, isImage, isImageFile, isImageTag, isInlineLink, isReferenceDefinition, isReferenceLink, isTableRow, isTableSeparator, isUpperCase, isUrl, normalizeFilePath, os, parseDate, parseFootnote, parseImage, parseImageTag, parseInlineLink, parseReferenceDefinition, parseReferenceLink, parseTableRow, parseTableSeparator, path, scanLinks, setTabIndex, slugize, template, untemplate, wcswidth,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = require("atom-space-pen-views").$;

  os = require("os");

  path = require("path");

  wcswidth = require("wcwidth");

  getJSON = function(uri, succeed, error) {
    if (uri.length === 0) {
      return error();
    }
    return $.getJSON(uri).done(succeed).fail(error);
  };

  escapeRegExp = function(str) {
    if (!str) {
      return "";
    }
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  };

  capitalize = function(str) {
    if (!str) {
      return "";
    }
    return str.replace(/^[a-z]/, function(c) {
      return c.toUpperCase();
    });
  };

  isUpperCase = function(str) {
    if (str.length > 0) {
      return str[0] >= 'A' && str[0] <= 'Z';
    } else {
      return false;
    }
  };

  incrementChars = function(str) {
    var carry, chars, index, lowerCase, nextCharCode, upperCase;
    if (str.length < 1) {
      return "a";
    }
    upperCase = isUpperCase(str);
    if (upperCase) {
      str = str.toLowerCase();
    }
    chars = str.split("");
    carry = 1;
    index = chars.length - 1;
    while (carry !== 0 && index >= 0) {
      nextCharCode = chars[index].charCodeAt() + carry;
      if (nextCharCode > "z".charCodeAt()) {
        chars[index] = "a";
        index -= 1;
        carry = 1;
        lowerCase = 1;
      } else {
        chars[index] = String.fromCharCode(nextCharCode);
        carry = 0;
      }
    }
    if (carry === 1) {
      chars.unshift("a");
    }
    str = chars.join("");
    if (upperCase) {
      return str.toUpperCase();
    } else {
      return str;
    }
  };

  cleanDiacritics = function(str) {
    var from, to;
    if (!str) {
      return "";
    }
    from = "ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșšŝťțŭùúüűûñÿýçżźž";
    to = "aaaaaaaaaccceeeeeghiiiijllnnoooooooossssttuuuuuunyyczzz";
    from += from.toUpperCase();
    to += to.toUpperCase();
    to = to.split("");
    from += "ß";
    to.push('ss');
    return str.replace(/.{1}/g, function(c) {
      var index;
      index = from.indexOf(c);
      if (index === -1) {
        return c;
      } else {
        return to[index];
      }
    });
  };

  SLUGIZE_CONTROL_REGEX = /[\u0000-\u001f]/g;

  SLUGIZE_SPECIAL_REGEX = /[\s~`!@#\$%\^&\*\(\)\-_\+=\[\]\{\}\|\\;:"'<>,\.\?\/]+/g;

  slugize = function(str, separator) {
    var escapedSep;
    if (separator == null) {
      separator = '-';
    }
    if (!str) {
      return "";
    }
    escapedSep = escapeRegExp(separator);
    return cleanDiacritics(str).trim().toLowerCase().replace(SLUGIZE_CONTROL_REGEX, '').replace(SLUGIZE_SPECIAL_REGEX, separator).replace(new RegExp(escapedSep + '{2,}', 'g'), separator).replace(new RegExp('^' + escapedSep + '+|' + escapedSep + '+$', 'g'), '');
  };

  getPackagePath = function() {
    var segments;
    segments = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    segments.unshift(atom.packages.resolvePackagePath("markdown-writer"));
    return path.join.apply(null, segments);
  };

  getProjectPath = function(filePath) {
    var paths, projectPath;
    projectPath = atom.project.relativizePath(filePath)[0];
    if (projectPath) {
      return projectPath;
    }
    paths = atom.project.getPaths();
    if (paths && paths.length > 0) {
      return paths[0];
    }
    return atom.config.get("core.projectHome");
  };

  getSitePath = function(configPath, filePath) {
    return getAbsolutePath(configPath || getProjectPath(filePath));
  };

  getHomedir = function() {
    var env, home, user;
    if (typeof os.homedir === "function") {
      return os.homedir();
    }
    env = process.env;
    home = env.HOME;
    user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;
    if (process.platform === "win32") {
      return env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home;
    } else if (process.platform === "darwin") {
      return home || (user ? "/Users/" + user : void 0);
    } else if (process.platform === "linux") {
      return home || (process.getuid() === 0 ? "/root" : void 0) || (user ? "/home/" + user : void 0);
    } else {
      return home;
    }
  };

  getAbsolutePath = function(path) {
    var home;
    home = getHomedir();
    if (home) {
      return path.replace(/^~($|\/|\\)/, home + '$1');
    } else {
      return path;
    }
  };

  setTabIndex = function(elems) {
    var elem, i, j, len1, results1;
    results1 = [];
    for (i = j = 0, len1 = elems.length; j < len1; i = ++j) {
      elem = elems[i];
      results1.push(elem[0].tabIndex = i + 1);
    }
    return results1;
  };

  TEMPLATE_REGEX = /[\<\{]([\w\.\-]+?)[\>\}]/g;

  UNTEMPLATE_REGEX = /(?:\<|\\\{)([\w\.\-]+?)(?:\>|\\\})/g;

  template = function(text, data, matcher) {
    if (matcher == null) {
      matcher = TEMPLATE_REGEX;
    }
    return text.replace(matcher, function(match, attr) {
      if (data[attr] != null) {
        return data[attr];
      } else {
        return match;
      }
    });
  };

  untemplate = function(text, matcher) {
    var keys;
    if (matcher == null) {
      matcher = UNTEMPLATE_REGEX;
    }
    keys = [];
    text = escapeRegExp(text).replace(matcher, function(match, attr) {
      keys.push(attr);
      if (["year"].indexOf(attr) !== -1) {
        return "(\\d{4})";
      } else if (["month", "day", "hour", "minute", "second"].indexOf(attr) !== -1) {
        return "(\\d{2})";
      } else if (["i_month", "i_day", "i_hour", "i_minute", "i_second"].indexOf(attr) !== -1) {
        return "(\\d{1,2})";
      } else if (["extension"].indexOf(attr) !== -1) {
        return "(\\.\\w+)";
      } else {
        return "([\\s\\S]+)";
      }
    });
    return createUntemplateMatcher(keys, RegExp("^" + text + "$"));
  };

  createUntemplateMatcher = function(keys, regex) {
    return function(str) {
      var matches, results;
      if (!str) {
        return;
      }
      matches = regex.exec(str);
      if (!matches) {
        return;
      }
      results = {
        "_": matches[0]
      };
      keys.forEach(function(key, idx) {
        return results[key] = matches[idx + 1];
      });
      return results;
    };
  };

  parseDate = function(hash) {
    var date, key, map, value, values;
    date = new Date();
    map = {
      setYear: ["year"],
      setMonth: ["month", "i_month"],
      setDate: ["day", "i_day"],
      setHours: ["hour", "i_hour"],
      setMinutes: ["minute", "i_minute"],
      setSeconds: ["second", "i_second"]
    };
    for (key in map) {
      values = map[key];
      value = values.find(function(val) {
        return !!hash[val];
      });
      if (value) {
        value = parseInt(hash[value], 10);
        if (key === 'setMonth') {
          value = value - 1;
        }
        date[key](value);
      }
    }
    return getDate(date);
  };

  getDate = function(date) {
    if (date == null) {
      date = new Date();
    }
    return {
      year: "" + date.getFullYear(),
      month: ("0" + (date.getMonth() + 1)).slice(-2),
      day: ("0" + date.getDate()).slice(-2),
      hour: ("0" + date.getHours()).slice(-2),
      minute: ("0" + date.getMinutes()).slice(-2),
      second: ("0" + date.getSeconds()).slice(-2),
      i_month: "" + (date.getMonth() + 1),
      i_day: "" + date.getDate(),
      i_hour: "" + date.getHours(),
      i_minute: "" + date.getMinutes(),
      i_second: "" + date.getSeconds()
    };
  };

  IMG_TAG_REGEX = /<img(.*?)\/?>/i;

  IMG_TAG_ATTRIBUTE = /([a-z]+?)=('|")(.*?)\2/ig;

  isImageTag = function(input) {
    return IMG_TAG_REGEX.test(input);
  };

  parseImageTag = function(input) {
    var attributes, img, pattern;
    img = {};
    attributes = IMG_TAG_REGEX.exec(input)[1].match(IMG_TAG_ATTRIBUTE);
    pattern = RegExp("" + IMG_TAG_ATTRIBUTE.source, "i");
    attributes.forEach(function(attr) {
      var elem;
      elem = pattern.exec(attr);
      if (elem) {
        return img[elem[1]] = elem[3];
      }
    });
    return img;
  };

  URL_AND_TITLE = /(\S*?)(?: +["'\\(]?(.*?)["'\\)]?)?/.source;

  IMG_OR_TEXT = /(!\[.*?\]\(.+?\)|[^\[]+?)/.source;

  OPEN_TAG = /(?:^|[^!])(?=\[)/.source;

  LINK_ID = /[^\[\]]+/.source;

  IMG_REGEX = RegExp("!\\[(.*?)\\]\\(" + URL_AND_TITLE + "\\)");

  isImage = function(input) {
    return IMG_REGEX.test(input);
  };

  parseImage = function(input) {
    var image;
    image = IMG_REGEX.exec(input);
    if (image && image.length >= 2) {
      return {
        alt: image[1],
        src: image[2],
        title: image[3] || ""
      };
    } else {
      return {
        alt: input,
        src: "",
        title: ""
      };
    }
  };

  IMG_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".ico"];

  isImageFile = function(file) {
    var ref;
    return file && (ref = path.extname(file).toLowerCase(), indexOf.call(IMG_EXTENSIONS, ref) >= 0);
  };

  INLINE_LINK_REGEX = RegExp("\\[" + IMG_OR_TEXT + "\\]\\(" + URL_AND_TITLE + "\\)");

  INLINE_LINK_TEST_REGEX = RegExp("" + OPEN_TAG + INLINE_LINK_REGEX.source);

  isInlineLink = function(input) {
    return INLINE_LINK_TEST_REGEX.test(input);
  };

  parseInlineLink = function(input) {
    var link;
    link = INLINE_LINK_REGEX.exec(input);
    if (link && link.length >= 2) {
      return {
        text: link[1],
        url: link[2],
        title: link[3] || ""
      };
    } else {
      return {
        text: input,
        url: "",
        title: ""
      };
    }
  };

  scanLinks = function(editor, cb) {
    return editor.buffer.scan(RegExp("" + INLINE_LINK_REGEX.source, "g"), function(match) {
      var rg;
      rg = match.range;
      rg.start.column += match.match[1].length + 3;
      rg.end.column -= 1;
      return cb(rg);
    });
  };

  REFERENCE_LINK_REGEX_OF = function(id, opts) {
    if (opts == null) {
      opts = {};
    }
    if (!opts.noEscape) {
      id = escapeRegExp(id);
    }
    return RegExp("\\[(" + id + ")\\] ?\\[\\]|\\[" + IMG_OR_TEXT + "\\] ?\\[(" + id + ")\\]");
  };

  REFERENCE_DEF_REGEX_OF = function(id, opts) {
    if (opts == null) {
      opts = {};
    }
    if (!opts.noEscape) {
      id = escapeRegExp(id);
    }
    return RegExp("^ *\\[(" + id + ")\\]: +" + URL_AND_TITLE + "$", "m");
  };

  REFERENCE_LINK_REGEX = REFERENCE_LINK_REGEX_OF(LINK_ID, {
    noEscape: true
  });

  REFERENCE_LINK_TEST_REGEX = RegExp("" + OPEN_TAG + REFERENCE_LINK_REGEX.source);

  REFERENCE_DEF_REGEX = REFERENCE_DEF_REGEX_OF(LINK_ID, {
    noEscape: true
  });

  isReferenceLink = function(input) {
    return REFERENCE_LINK_TEST_REGEX.test(input);
  };

  parseReferenceLink = function(input, editor) {
    var def, id, link, text;
    link = REFERENCE_LINK_REGEX.exec(input);
    text = link[2] || link[1];
    id = link[3] || link[1];
    def = void 0;
    editor && editor.buffer.scan(REFERENCE_DEF_REGEX_OF(id), function(match) {
      return def = match;
    });
    if (def) {
      return {
        id: id,
        text: text,
        url: def.match[2],
        title: def.match[3] || "",
        definitionRange: def.range
      };
    } else {
      return {
        id: id,
        text: text,
        url: "",
        title: "",
        definitionRange: null
      };
    }
  };

  isReferenceDefinition = function(input) {
    var def;
    def = REFERENCE_DEF_REGEX.exec(input);
    return !!def && def[1][0] !== "^";
  };

  parseReferenceDefinition = function(input, editor) {
    var def, id, link;
    def = REFERENCE_DEF_REGEX.exec(input);
    id = def[1];
    link = void 0;
    editor && editor.buffer.scan(REFERENCE_LINK_REGEX_OF(id), function(match) {
      return link = match;
    });
    if (link) {
      return {
        id: id,
        text: link.match[2] || link.match[1],
        url: def[2],
        title: def[3] || "",
        linkRange: link.range
      };
    } else {
      return {
        id: id,
        text: "",
        url: def[2],
        title: def[3] || "",
        linkRange: null
      };
    }
  };

  FOOTNOTE_REGEX = /\[\^(.+?)\](:)?/;

  FOOTNOTE_TEST_REGEX = RegExp("" + OPEN_TAG + FOOTNOTE_REGEX.source);

  isFootnote = function(input) {
    return FOOTNOTE_TEST_REGEX.test(input);
  };

  parseFootnote = function(input) {
    var footnote;
    footnote = FOOTNOTE_REGEX.exec(input);
    return {
      label: footnote[1],
      isDefinition: footnote[2] === ":",
      content: ""
    };
  };

  TABLE_SEPARATOR_REGEX = /^(\|)?((?:\s*(?:-+|:-*:|:-*|-*:)\s*\|)+(?:\s*(?:-+|:-*:|:-*|-*:)\s*|\s+))(\|)?$/;

  TABLE_ONE_COLUMN_SEPARATOR_REGEX = /^(\|)(\s*:?-+:?\s*)(\|)$/;

  isTableSeparator = function(line) {
    return TABLE_SEPARATOR_REGEX.test(line) || TABLE_ONE_COLUMN_SEPARATOR_REGEX.test(line);
  };

  parseTableSeparator = function(line) {
    var columns, extraPipes, matches;
    matches = TABLE_SEPARATOR_REGEX.exec(line) || TABLE_ONE_COLUMN_SEPARATOR_REGEX.exec(line);
    extraPipes = !!(matches[1] || matches[matches.length - 1]);
    columns = matches[2].split("|").map(function(col) {
      return col.trim();
    });
    return {
      separator: true,
      extraPipes: extraPipes,
      columns: columns,
      columnWidths: columns.map(function(col) {
        return col.length;
      }),
      alignments: columns.map(function(col) {
        var head, tail;
        head = col[0] === ":";
        tail = col[col.length - 1] === ":";
        if (head && tail) {
          return "center";
        } else if (head) {
          return "left";
        } else if (tail) {
          return "right";
        } else {
          return "empty";
        }
      })
    };
  };

  TABLE_ROW_REGEX = /^(\|)?(.+?\|.+?)(\|)?$/;

  TABLE_ONE_COLUMN_ROW_REGEX = /^(\|)(.+?)(\|)$/;

  isTableRow = function(line) {
    return TABLE_ROW_REGEX.test(line) || TABLE_ONE_COLUMN_ROW_REGEX.test(line);
  };

  parseTableRow = function(line) {
    var columns, extraPipes, matches;
    if (isTableSeparator(line)) {
      return parseTableSeparator(line);
    }
    matches = TABLE_ROW_REGEX.exec(line) || TABLE_ONE_COLUMN_ROW_REGEX.exec(line);
    extraPipes = !!(matches[1] || matches[matches.length - 1]);
    columns = matches[2].split("|").map(function(col) {
      return col.trim();
    });
    return {
      separator: false,
      extraPipes: extraPipes,
      columns: columns,
      columnWidths: columns.map(function(col) {
        return wcswidth(col);
      })
    };
  };

  createTableSeparator = function(options) {
    var columnWidth, i, j, ref, row;
    if (options.columnWidths == null) {
      options.columnWidths = [];
    }
    if (options.alignments == null) {
      options.alignments = [];
    }
    row = [];
    for (i = j = 0, ref = options.numOfColumns - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      columnWidth = options.columnWidths[i] || options.columnWidth;
      if (!options.extraPipes && (i === 0 || i === options.numOfColumns - 1)) {
        columnWidth += 1;
      } else {
        columnWidth += 2;
      }
      switch (options.alignments[i] || options.alignment) {
        case "center":
          row.push(":" + "-".repeat(columnWidth - 2) + ":");
          break;
        case "left":
          row.push(":" + "-".repeat(columnWidth - 1));
          break;
        case "right":
          row.push("-".repeat(columnWidth - 1) + ":");
          break;
        default:
          row.push("-".repeat(columnWidth));
      }
    }
    row = row.join("|");
    if (options.extraPipes) {
      return "|" + row + "|";
    } else {
      return row;
    }
  };

  createTableRow = function(columns, options) {
    var columnWidth, i, j, len, ref, row;
    if (options.columnWidths == null) {
      options.columnWidths = [];
    }
    if (options.alignments == null) {
      options.alignments = [];
    }
    row = [];
    for (i = j = 0, ref = options.numOfColumns - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      columnWidth = options.columnWidths[i] || options.columnWidth;
      if (!columns[i]) {
        row.push(" ".repeat(columnWidth));
        continue;
      }
      len = columnWidth - wcswidth(columns[i]);
      if (len < 0) {
        throw new Error("Column width " + columnWidth + " - wcswidth('" + columns[i] + "') cannot be " + len);
      }
      switch (options.alignments[i] || options.alignment) {
        case "center":
          row.push(" ".repeat(len / 2) + columns[i] + " ".repeat((len + 1) / 2));
          break;
        case "left":
          row.push(columns[i] + " ".repeat(len));
          break;
        case "right":
          row.push(" ".repeat(len) + columns[i]);
          break;
        default:
          row.push(columns[i] + " ".repeat(len));
      }
    }
    row = row.join(" | ");
    if (options.extraPipes) {
      return "| " + row + " |";
    } else {
      return row;
    }
  };

  URL_REGEX = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/i;

  isUrl = function(url) {
    return URL_REGEX.test(url);
  };

  normalizeFilePath = function(path) {
    return path.split(/[\\\/]/).join('/');
  };

  getScopeDescriptor = function(cursor, scopeSelector) {
    var scopes;
    scopes = cursor.getScopeDescriptor().getScopesArray().filter(function(scope) {
      return scope.indexOf(scopeSelector) >= 0;
    });
    if (scopes.indexOf(scopeSelector) >= 0) {
      return scopeSelector;
    } else if (scopes.length > 0) {
      return scopes[0];
    }
  };

  getBufferRangeForScope = function(editor, cursor, scopeSelector) {
    var pos, range;
    if (!scopeSelector) {
      return;
    }
    pos = cursor.getBufferPosition();
    range = editor.bufferRangeForScopeAtPosition(scopeSelector, pos);
    if (range) {
      return range;
    }
    if (!cursor.isAtBeginningOfLine()) {
      range = editor.bufferRangeForScopeAtPosition(scopeSelector, [pos.row, pos.column - 1]);
      if (range) {
        return range;
      }
    }
    if (!cursor.isAtEndOfLine()) {
      range = editor.bufferRangeForScopeAtPosition(scopeSelector, [pos.row, pos.column + 1]);
      if (range) {
        return range;
      }
    }
  };

  getTextBufferRange = function(editor, scopeSelector, opts) {
    var cursor, range, scope, selectBy, selection, wordRange, wordRegex;
    if (opts == null) {
      opts = {};
    }
    selection = opts.selection || editor.getLastSelection();
    selectBy = opts.selectBy || "nearestWord";
    cursor = selection.cursor;
    range = selection.getText() ? selection.getBufferRange() : (scope = getScopeDescriptor(cursor, scopeSelector)) ? getBufferRangeForScope(editor, cursor, scope) : selectBy === "nearestWord" ? (wordRegex = cursor.wordRegExp({
      includeNonWordCharacters: false
    }), cursor.getCurrentWordBufferRange({
      wordRegex: wordRegex
    })) : selectBy === "currentWord" ? cursor.getCurrentWordBufferRange() : selectBy === "currentNonTrailWord" ? (wordRange = cursor.getCurrentWordBufferRange(), wordRange && wordRange.end.column === cursor.getBufferColumn() ? selection.getBufferRange() : wordRange) : selectBy === "currentLine" ? cursor.getCurrentLineBufferRange() : selectBy === "currentParagraph" ? cursor.getCurrentParagraphBufferRange() : void 0;
    return range || selection.getBufferRange();
  };

  findLinkInRange = function(editor, range) {
    var link, selection;
    selection = editor.getTextInRange(range);
    if (selection === "") {
      return;
    }
    if (isUrl(selection)) {
      return {
        text: "",
        url: selection,
        title: ""
      };
    }
    if (isInlineLink(selection)) {
      return parseInlineLink(selection);
    }
    if (isReferenceLink(selection)) {
      link = parseReferenceLink(selection, editor);
      link.linkRange = range;
      return link;
    } else if (isReferenceDefinition(selection)) {
      selection = editor.lineTextForBufferRow(range.start.row);
      range = editor.bufferRangeForBufferRow(range.start.row);
      link = parseReferenceDefinition(selection, editor);
      link.definitionRange = range;
      return link;
    }
  };

  module.exports = {
    getJSON: getJSON,
    escapeRegExp: escapeRegExp,
    capitalize: capitalize,
    isUpperCase: isUpperCase,
    incrementChars: incrementChars,
    slugize: slugize,
    normalizeFilePath: normalizeFilePath,
    getPackagePath: getPackagePath,
    getProjectPath: getProjectPath,
    getSitePath: getSitePath,
    getHomedir: getHomedir,
    getAbsolutePath: getAbsolutePath,
    setTabIndex: setTabIndex,
    template: template,
    untemplate: untemplate,
    getDate: getDate,
    parseDate: parseDate,
    isImageTag: isImageTag,
    parseImageTag: parseImageTag,
    isImage: isImage,
    parseImage: parseImage,
    scanLinks: scanLinks,
    isInlineLink: isInlineLink,
    parseInlineLink: parseInlineLink,
    isReferenceLink: isReferenceLink,
    parseReferenceLink: parseReferenceLink,
    isReferenceDefinition: isReferenceDefinition,
    parseReferenceDefinition: parseReferenceDefinition,
    isFootnote: isFootnote,
    parseFootnote: parseFootnote,
    isTableSeparator: isTableSeparator,
    parseTableSeparator: parseTableSeparator,
    createTableSeparator: createTableSeparator,
    isTableRow: isTableRow,
    parseTableRow: parseTableRow,
    createTableRow: createTableRow,
    isUrl: isUrl,
    isImageFile: isImageFile,
    getTextBufferRange: getTextBufferRange,
    findLinkInRange: findLinkInRange
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZmVsaXBlLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXdyaXRlci9saWIvdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3cUNBQUE7SUFBQTs7O0VBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVI7O0VBQ04sRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxRQUFBLEdBQVcsT0FBQSxDQUFRLFNBQVI7O0VBTVgsT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxLQUFmO0lBQ1IsSUFBa0IsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFoQztBQUFBLGFBQU8sS0FBQSxDQUFBLEVBQVA7O1dBQ0EsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxHQUFWLENBQWMsQ0FBQyxJQUFmLENBQW9CLE9BQXBCLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7RUFGUTs7RUFJVixZQUFBLEdBQWUsU0FBQyxHQUFEO0lBQ2IsSUFBQSxDQUFpQixHQUFqQjtBQUFBLGFBQU8sR0FBUDs7V0FDQSxHQUFHLENBQUMsT0FBSixDQUFZLHdCQUFaLEVBQXNDLE1BQXRDO0VBRmE7O0VBSWYsVUFBQSxHQUFhLFNBQUMsR0FBRDtJQUNYLElBQUEsQ0FBaUIsR0FBakI7QUFBQSxhQUFPLEdBQVA7O1dBQ0EsR0FBRyxDQUFDLE9BQUosQ0FBWSxRQUFaLEVBQXNCLFNBQUMsQ0FBRDthQUFPLENBQUMsQ0FBQyxXQUFGLENBQUE7SUFBUCxDQUF0QjtFQUZXOztFQUliLFdBQUEsR0FBYyxTQUFDLEdBQUQ7SUFDWixJQUFHLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBaEI7YUFBd0IsR0FBSSxDQUFBLENBQUEsQ0FBSixJQUFVLEdBQVYsSUFBaUIsR0FBSSxDQUFBLENBQUEsQ0FBSixJQUFVLElBQW5EO0tBQUEsTUFBQTthQUNLLE1B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QSxFQUFZLFVBekNaO0lBMENBLGFBQUEsRUFBZSxhQTFDZjtJQTJDQSxjQUFBLEVBQWdCLGNBM0NoQjtJQTZDQSxLQUFBLEVBQU8sS0E3Q1A7SUE4Q0EsV0FBQSxFQUFhLFdBOUNiO0lBZ0RBLGtCQUFBLEVBQW9CLGtCQWhEcEI7SUFpREEsZUFBQSxFQUFpQixlQWpEakI7O0FBaHFCRiIsInNvdXJjZXNDb250ZW50IjpbInskfSA9IHJlcXVpcmUgXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiXG5vcyA9IHJlcXVpcmUgXCJvc1wiXG5wYXRoID0gcmVxdWlyZSBcInBhdGhcIlxud2Nzd2lkdGggPSByZXF1aXJlIFwid2N3aWR0aFwiXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgR2VuZXJhbCBVdGlsc1xuI1xuXG5nZXRKU09OID0gKHVyaSwgc3VjY2VlZCwgZXJyb3IpIC0+XG4gIHJldHVybiBlcnJvcigpIGlmIHVyaS5sZW5ndGggPT0gMFxuICAkLmdldEpTT04odXJpKS5kb25lKHN1Y2NlZWQpLmZhaWwoZXJyb3IpXG5cbmVzY2FwZVJlZ0V4cCA9IChzdHIpIC0+XG4gIHJldHVybiBcIlwiIHVubGVzcyBzdHJcbiAgc3RyLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgXCJcXFxcJCZcIilcblxuY2FwaXRhbGl6ZSA9IChzdHIpIC0+XG4gIHJldHVybiBcIlwiIHVubGVzcyBzdHJcbiAgc3RyLnJlcGxhY2UgL15bYS16XS8sIChjKSAtPiBjLnRvVXBwZXJDYXNlKClcblxuaXNVcHBlckNhc2UgPSAoc3RyKSAtPlxuICBpZiBzdHIubGVuZ3RoID4gMCB0aGVuIChzdHJbMF0gPj0gJ0EnICYmIHN0clswXSA8PSAnWicpXG4gIGVsc2UgZmFsc2VcblxuIyBpbmNyZW1lbnQgdGhlIGNoYXJzOiBhIC0+IGIsIHogLT4gYWEsIGF6IC0+IGJhXG5pbmNyZW1lbnRDaGFycyA9IChzdHIpIC0+XG4gIHJldHVybiBcImFcIiBpZiBzdHIubGVuZ3RoIDwgMVxuXG4gIHVwcGVyQ2FzZSA9IGlzVXBwZXJDYXNlKHN0cilcbiAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCkgaWYgdXBwZXJDYXNlXG5cbiAgY2hhcnMgPSBzdHIuc3BsaXQoXCJcIilcbiAgY2FycnkgPSAxXG4gIGluZGV4ID0gY2hhcnMubGVuZ3RoIC0gMVxuXG4gIHdoaWxlIGNhcnJ5ICE9IDAgJiYgaW5kZXggPj0gMFxuICAgIG5leHRDaGFyQ29kZSA9IGNoYXJzW2luZGV4XS5jaGFyQ29kZUF0KCkgKyBjYXJyeVxuXG4gICAgaWYgbmV4dENoYXJDb2RlID4gXCJ6XCIuY2hhckNvZGVBdCgpXG4gICAgICBjaGFyc1tpbmRleF0gPSBcImFcIlxuICAgICAgaW5kZXggLT0gMVxuICAgICAgY2FycnkgPSAxXG4gICAgICBsb3dlckNhc2UgPSAxXG4gICAgZWxzZVxuICAgICAgY2hhcnNbaW5kZXhdID0gU3RyaW5nLmZyb21DaGFyQ29kZShuZXh0Q2hhckNvZGUpXG4gICAgICBjYXJyeSA9IDBcblxuICBjaGFycy51bnNoaWZ0KFwiYVwiKSBpZiBjYXJyeSA9PSAxXG5cbiAgc3RyID0gY2hhcnMuam9pbihcIlwiKVxuICBpZiB1cHBlckNhc2UgdGhlbiBzdHIudG9VcHBlckNhc2UoKSBlbHNlIHN0clxuXG4jIGh0dHBzOi8vZ2l0aHViLmNvbS9lcGVsaS91bmRlcnNjb3JlLnN0cmluZy9ibG9iL21hc3Rlci9jbGVhbkRpYWNyaXRpY3MuanNcbmNsZWFuRGlhY3JpdGljcyA9IChzdHIpIC0+XG4gIHJldHVybiBcIlwiIHVubGVzcyBzdHJcblxuICBmcm9tID0gXCLEhcOgw6HDpMOiw6PDpcOmxIPEh8SNxInEmcOow6nDq8OqxJ3EpcOsw63Dr8OuxLXFgsS+xYTFiMOyw7PDtsWRw7TDtcOww7jFm8iZxaHFncWlyJvFrcO5w7rDvMWxw7vDscO/w73Dp8W8xbrFvlwiXG4gIHRvID0gXCJhYWFhYWFhYWFjY2NlZWVlZWdoaWlpaWpsbG5ub29vb29vb29zc3NzdHR1dXV1dXVueXljenp6XCJcblxuICBmcm9tICs9IGZyb20udG9VcHBlckNhc2UoKVxuICB0byArPSB0by50b1VwcGVyQ2FzZSgpXG5cbiAgdG8gPSB0by5zcGxpdChcIlwiKVxuXG4gICMgZm9yIHRva2VucyByZXF1aXJlaW5nIG11bHRpdG9rZW4gb3V0cHV0XG4gIGZyb20gKz0gXCLDn1wiXG4gIHRvLnB1c2goJ3NzJylcblxuICBzdHIucmVwbGFjZSAvLnsxfS9nLCAoYykgLT5cbiAgICBpbmRleCA9IGZyb20uaW5kZXhPZihjKVxuICAgIGlmIGluZGV4ID09IC0xIHRoZW4gYyBlbHNlIHRvW2luZGV4XVxuXG5TTFVHSVpFX0NPTlRST0xfUkVHRVggPSAvW1xcdTAwMDAtXFx1MDAxZl0vZ1xuU0xVR0laRV9TUEVDSUFMX1JFR0VYID0gL1tcXHN+YCFAI1xcJCVcXF4mXFwqXFwoXFwpXFwtX1xcKz1cXFtcXF1cXHtcXH1cXHxcXFxcOzpcIic8PixcXC5cXD9cXC9dKy9nXG5cbiMgaHR0cHM6Ly9naXRodWIuY29tL2hleG9qcy9oZXhvLXV0aWwvYmxvYi9tYXN0ZXIvbGliL3NsdWdpemUuanNcbnNsdWdpemUgPSAoc3RyLCBzZXBhcmF0b3IgPSAnLScpIC0+XG4gIHJldHVybiBcIlwiIHVubGVzcyBzdHJcblxuICBlc2NhcGVkU2VwID0gZXNjYXBlUmVnRXhwKHNlcGFyYXRvcilcblxuICBjbGVhbkRpYWNyaXRpY3Moc3RyKS50cmltKCkudG9Mb3dlckNhc2UoKVxuICAgICMgUmVtb3ZlIGNvbnRyb2wgY2hhcmFjdGVyc1xuICAgIC5yZXBsYWNlKFNMVUdJWkVfQ09OVFJPTF9SRUdFWCwgJycpXG4gICAgIyBSZXBsYWNlIHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgIC5yZXBsYWNlKFNMVUdJWkVfU1BFQ0lBTF9SRUdFWCwgc2VwYXJhdG9yKVxuICAgICMgUmVtb3ZlIGNvbnRpbm91cyBzZXBhcmF0b3JzXG4gICAgLnJlcGxhY2UobmV3IFJlZ0V4cChlc2NhcGVkU2VwICsgJ3syLH0nLCAnZycpLCBzZXBhcmF0b3IpXG4gICAgIyBSZW1vdmUgcHJlZml4aW5nIGFuZCB0cmFpbGluZyBzZXBhcnRvcnNcbiAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdeJyArIGVzY2FwZWRTZXAgKyAnK3wnICsgZXNjYXBlZFNlcCArICcrJCcsICdnJyksICcnKVxuXG5nZXRQYWNrYWdlUGF0aCA9IChzZWdtZW50cy4uLikgLT5cbiAgc2VnbWVudHMudW5zaGlmdChhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aChcIm1hcmtkb3duLXdyaXRlclwiKSlcbiAgcGF0aC5qb2luLmFwcGx5KG51bGwsIHNlZ21lbnRzKVxuXG4jIFByb2plY3QgcGF0aCBpcyByZXNvbHZlZCByZWxhdGl2ZSB0aGUgcmVmZXJlbmNlIGZpbGUgcGF0aCwgbmVlZGVkIHdoZW4gbXVsdGlwbGVcbiMgcHJvamVjdHMgYXJlIG9wZW5lZCBpbiBBdG9tXG5nZXRQcm9qZWN0UGF0aCA9IChmaWxlUGF0aCkgLT5cbiAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZVBhdGgpWzBdXG4gIHJldHVybiBwcm9qZWN0UGF0aCBpZiBwcm9qZWN0UGF0aFxuICAjIGZhbGxiYWNrIHRvIGZpcnN0IHByb2plY3Qgb3BlbmVkXG4gIHBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgcmV0dXJuIHBhdGhzWzBdIGlmIHBhdGhzICYmIHBhdGhzLmxlbmd0aCA+IDBcbiAgIyBmYWxsYmFjayB0byBhbHdheXMgZ2l2ZSBhIHBhdGggaWYgdGhlcmUncyBubyBwcm9qZWN0IHBhdGhzXG4gIGF0b20uY29uZmlnLmdldChcImNvcmUucHJvamVjdEhvbWVcIilcblxuZ2V0U2l0ZVBhdGggPSAoY29uZmlnUGF0aCwgZmlsZVBhdGgpIC0+XG4gIGdldEFic29sdXRlUGF0aChjb25maWdQYXRoIHx8IGdldFByb2plY3RQYXRoKGZpbGVQYXRoKSlcblxuIyBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL29zLWhvbWVkaXIvYmxvYi9tYXN0ZXIvaW5kZXguanNcbmdldEhvbWVkaXIgPSAtPlxuICByZXR1cm4gb3MuaG9tZWRpcigpIGlmIHR5cGVvZihvcy5ob21lZGlyKSA9PSBcImZ1bmN0aW9uXCJcblxuICBlbnYgPSBwcm9jZXNzLmVudlxuICBob21lID0gZW52LkhPTUVcbiAgdXNlciA9IGVudi5MT0dOQU1FIHx8IGVudi5VU0VSIHx8IGVudi5MTkFNRSB8fCBlbnYuVVNFUk5BTUVcblxuICBpZiBwcm9jZXNzLnBsYXRmb3JtID09IFwid2luMzJcIlxuICAgIGVudi5VU0VSUFJPRklMRSB8fCBlbnYuSE9NRURSSVZFICsgZW52LkhPTUVQQVRIIHx8IGhvbWVcbiAgZWxzZSBpZiBwcm9jZXNzLnBsYXRmb3JtID09IFwiZGFyd2luXCJcbiAgICBob21lIHx8IChcIi9Vc2Vycy9cIiArIHVzZXIgaWYgdXNlcilcbiAgZWxzZSBpZiBwcm9jZXNzLnBsYXRmb3JtID09IFwibGludXhcIlxuICAgIGhvbWUgfHwgKFwiL3Jvb3RcIiBpZiBwcm9jZXNzLmdldHVpZCgpID09IDApIHx8IChcIi9ob21lL1wiICsgdXNlciBpZiB1c2VyKVxuICBlbHNlXG4gICAgaG9tZVxuXG4jIEJhc2ljYWxseSBleHBhbmQgfi8gdG8gaG9tZSBkaXJlY3RvcnlcbiMgaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy91bnRpbGRpZnkvYmxvYi9tYXN0ZXIvaW5kZXguanNcbmdldEFic29sdXRlUGF0aCA9IChwYXRoKSAtPlxuICBob21lID0gZ2V0SG9tZWRpcigpXG4gIGlmIGhvbWUgdGhlbiBwYXRoLnJlcGxhY2UoL15+KCR8XFwvfFxcXFwpLywgaG9tZSArICckMScpIGVsc2UgcGF0aFxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEdlbmVyYWwgVmlldyBIZWxwZXJzXG4jXG5cbnNldFRhYkluZGV4ID0gKGVsZW1zKSAtPlxuICBlbGVtWzBdLnRhYkluZGV4ID0gaSArIDEgZm9yIGVsZW0sIGkgaW4gZWxlbXNcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBUZW1wbGF0ZVxuI1xuXG5URU1QTEFURV9SRUdFWCA9IC8vL1xuICBbXFw8XFx7XSAgICAgICAgIyBzdGFydCB3aXRoIDwgb3Ige1xuICAoW1xcd1xcLlxcLV0rPykgICMgYW55IHJlYXNvbmFibGUgd29yZHMsIC0gb3IgLlxuICBbXFw+XFx9XSAgICAgICAgIyBlbmQgd2l0aCA+IG9yIH1cbiAgLy8vZ1xuXG5VTlRFTVBMQVRFX1JFR0VYID0gLy8vXG4gICg/OlxcPHxcXFxcXFx7KSAgICMgc3RhcnQgd2l0aCA8IG9yIFxce1xuICAoW1xcd1xcLlxcLV0rPykgICMgYW55IHJlYXNvbmFibGUgd29yZHMsIC0gb3IgLlxuICAoPzpcXD58XFxcXFxcfSkgICAjIGVuZCB3aXRoID4gb3IgXFx9XG4gIC8vL2dcblxudGVtcGxhdGUgPSAodGV4dCwgZGF0YSwgbWF0Y2hlciA9IFRFTVBMQVRFX1JFR0VYKSAtPlxuICB0ZXh0LnJlcGxhY2UgbWF0Y2hlciwgKG1hdGNoLCBhdHRyKSAtPlxuICAgIGlmIGRhdGFbYXR0cl0/IHRoZW4gZGF0YVthdHRyXSBlbHNlIG1hdGNoXG5cbiMgUmV0dXJuIGEgZnVuY3Rpb24gdGhhdCByZXZlcnNlIHBhcnNlIHRoZSB0ZW1wbGF0ZSwgZS5nLlxuI1xuIyBQYXNzIGB1bnRlbXBsYXRlKFwie3llYXJ9LXttb250aH1cIilgIHJldHVybnMgYSBmdW5jdGlvbiBgZm5gLCB0aGF0IGBmbihcIjIwMTUtMTFcIikgIyA9PiB7IF86IFwiMjAxNS0xMVwiLCB5ZWFyOiAyMDE1LCBtb250aDogMTEgfWBcbiNcbnVudGVtcGxhdGUgPSAodGV4dCwgbWF0Y2hlciA9IFVOVEVNUExBVEVfUkVHRVgpIC0+XG4gIGtleXMgPSBbXVxuXG4gIHRleHQgPSBlc2NhcGVSZWdFeHAodGV4dCkucmVwbGFjZSBtYXRjaGVyLCAobWF0Y2gsIGF0dHIpIC0+XG4gICAga2V5cy5wdXNoKGF0dHIpXG4gICAgaWYgW1wieWVhclwiXS5pbmRleE9mKGF0dHIpICE9IC0xIHRoZW4gXCIoXFxcXGR7NH0pXCJcbiAgICBlbHNlIGlmIFtcIm1vbnRoXCIsIFwiZGF5XCIsIFwiaG91clwiLCBcIm1pbnV0ZVwiLCBcInNlY29uZFwiXS5pbmRleE9mKGF0dHIpICE9IC0xIHRoZW4gXCIoXFxcXGR7Mn0pXCJcbiAgICBlbHNlIGlmIFtcImlfbW9udGhcIiwgXCJpX2RheVwiLCBcImlfaG91clwiLCBcImlfbWludXRlXCIsIFwiaV9zZWNvbmRcIl0uaW5kZXhPZihhdHRyKSAhPSAtMSB0aGVuIFwiKFxcXFxkezEsMn0pXCJcbiAgICBlbHNlIGlmIFtcImV4dGVuc2lvblwiXS5pbmRleE9mKGF0dHIpICE9IC0xIHRoZW4gXCIoXFxcXC5cXFxcdyspXCJcbiAgICBlbHNlIFwiKFtcXFxcc1xcXFxTXSspXCJcblxuICBjcmVhdGVVbnRlbXBsYXRlTWF0Y2hlcihrZXlzLCAvLy8gXiAje3RleHR9ICQgLy8vKVxuXG5jcmVhdGVVbnRlbXBsYXRlTWF0Y2hlciA9IChrZXlzLCByZWdleCkgLT5cbiAgKHN0cikgLT5cbiAgICByZXR1cm4gdW5sZXNzIHN0clxuXG4gICAgbWF0Y2hlcyA9IHJlZ2V4LmV4ZWMoc3RyKVxuICAgIHJldHVybiB1bmxlc3MgbWF0Y2hlc1xuXG4gICAgcmVzdWx0cyA9IHsgXCJfXCIgOiBtYXRjaGVzWzBdIH1cbiAgICBrZXlzLmZvckVhY2ggKGtleSwgaWR4KSAtPiByZXN1bHRzW2tleV0gPSBtYXRjaGVzW2lkeCArIDFdXG4gICAgcmVzdWx0c1xuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIERhdGUgYW5kIFRpbWVcbiNcblxucGFyc2VEYXRlID0gKGhhc2gpIC0+XG4gIGRhdGUgPSBuZXcgRGF0ZSgpXG5cbiAgbWFwID1cbiAgICBzZXRZZWFyOiBbXCJ5ZWFyXCJdXG4gICAgc2V0TW9udGg6IFtcIm1vbnRoXCIsIFwiaV9tb250aFwiXVxuICAgIHNldERhdGU6IFtcImRheVwiLCBcImlfZGF5XCJdXG4gICAgc2V0SG91cnM6IFtcImhvdXJcIiwgXCJpX2hvdXJcIl1cbiAgICBzZXRNaW51dGVzOiBbXCJtaW51dGVcIiwgXCJpX21pbnV0ZVwiXVxuICAgIHNldFNlY29uZHM6IFtcInNlY29uZFwiLCBcImlfc2Vjb25kXCJdXG5cbiAgZm9yIGtleSwgdmFsdWVzIG9mIG1hcFxuICAgIHZhbHVlID0gdmFsdWVzLmZpbmQgKHZhbCkgLT4gISFoYXNoW3ZhbF1cbiAgICBpZiB2YWx1ZVxuICAgICAgdmFsdWUgPSBwYXJzZUludChoYXNoW3ZhbHVlXSwgMTApXG4gICAgICB2YWx1ZSA9IHZhbHVlIC0gMSBpZiBrZXkgPT0gJ3NldE1vbnRoJ1xuICAgICAgZGF0ZVtrZXldKHZhbHVlKVxuXG4gIGdldERhdGUoZGF0ZSlcblxuZ2V0RGF0ZSA9IChkYXRlID0gbmV3IERhdGUoKSkgLT5cbiAgeWVhcjogXCJcIiArIGRhdGUuZ2V0RnVsbFllYXIoKVxuICAjIHdpdGggcHJlcGVuZGVkIDBcbiAgbW9udGg6IChcIjBcIiArIChkYXRlLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpXG4gIGRheTogKFwiMFwiICsgZGF0ZS5nZXREYXRlKCkpLnNsaWNlKC0yKVxuICBob3VyOiAoXCIwXCIgKyBkYXRlLmdldEhvdXJzKCkpLnNsaWNlKC0yKVxuICBtaW51dGU6IChcIjBcIiArIGRhdGUuZ2V0TWludXRlcygpKS5zbGljZSgtMilcbiAgc2Vjb25kOiAoXCIwXCIgKyBkYXRlLmdldFNlY29uZHMoKSkuc2xpY2UoLTIpXG4gICMgd2l0aG91dCBwcmVwZW5kIDBcbiAgaV9tb250aDogXCJcIiArIChkYXRlLmdldE1vbnRoKCkgKyAxKVxuICBpX2RheTogXCJcIiArIGRhdGUuZ2V0RGF0ZSgpXG4gIGlfaG91cjogXCJcIiArIGRhdGUuZ2V0SG91cnMoKVxuICBpX21pbnV0ZTogXCJcIiArIGRhdGUuZ2V0TWludXRlcygpXG4gIGlfc2Vjb25kOiBcIlwiICsgZGF0ZS5nZXRTZWNvbmRzKClcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBJbWFnZSBIVE1MIFRhZ1xuI1xuXG5JTUdfVEFHX1JFR0VYID0gLy8vIDxpbWcgKC4qPylcXC8/PiAvLy9pXG5JTUdfVEFHX0FUVFJJQlVURSA9IC8vLyAoW2Etel0rPyk9KCd8XCIpKC4qPylcXDIgLy8vaWdcblxuIyBEZXRlY3QgaXQgaXMgYSBIVE1MIGltYWdlIHRhZ1xuaXNJbWFnZVRhZyA9IChpbnB1dCkgLT4gSU1HX1RBR19SRUdFWC50ZXN0KGlucHV0KVxucGFyc2VJbWFnZVRhZyA9IChpbnB1dCkgLT5cbiAgaW1nID0ge31cbiAgYXR0cmlidXRlcyA9IElNR19UQUdfUkVHRVguZXhlYyhpbnB1dClbMV0ubWF0Y2goSU1HX1RBR19BVFRSSUJVVEUpXG4gIHBhdHRlcm4gPSAvLy8gI3tJTUdfVEFHX0FUVFJJQlVURS5zb3VyY2V9IC8vL2lcbiAgYXR0cmlidXRlcy5mb3JFYWNoIChhdHRyKSAtPlxuICAgIGVsZW0gPSBwYXR0ZXJuLmV4ZWMoYXR0cilcbiAgICBpbWdbZWxlbVsxXV0gPSBlbGVtWzNdIGlmIGVsZW1cbiAgcmV0dXJuIGltZ1xuXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgU29tZSBzaGFyZWQgcmVnZXggYmFzaWNzXG4jXG5cbiMgW3VybHx1cmwgXCJ0aXRsZVwiXVxuVVJMX0FORF9USVRMRSA9IC8vL1xuICAoXFxTKj8pICAgICAgICAgICAgICAgICAgIyBhIHVybFxuICAoPzpcbiAgICBcXCArICAgICAgICAgICAgICAgICAgICMgc3BhY2VzXG4gICAgW1wiJ1xcXFwoXT8oLio/KVtcIidcXFxcKV0/ICMgcXVvdGVkIHRpdGxlXG4gICk/ICAgICAgICAgICAgICAgICAgICAgICMgbWlnaHQgbm90IHByZXNlbnRcbiAgLy8vLnNvdXJjZVxuXG4jIFtpbWFnZXx0ZXh0XVxuSU1HX09SX1RFWFQgPSAvLy8gKCFcXFsuKj9cXF1cXCguKz9cXCkgfCBbXlxcW10rPykgLy8vLnNvdXJjZVxuIyBhdCBoZWFkIG9yIG5vdCAhWywgd29ya2Fyb3VuZCBvZiBubyBuZWctbG9va2JlaGluZCBpbiBKU1xuT1BFTl9UQUcgPSAvLy8gKD86XnxbXiFdKSg/PVxcWykgLy8vLnNvdXJjZVxuIyBsaW5rIGlkIGRvbid0IGNvbnRhaW5zIFsgb3IgXVxuTElOS19JRCA9IC8vLyBbXlxcW1xcXV0rIC8vLy5zb3VyY2VcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBJbWFnZVxuI1xuXG5JTUdfUkVHRVggID0gLy8vXG4gICEgXFxbICguKj8pIFxcXSAgICAgICAgICAgICMgIVtlbXB0eXx0ZXh0XVxuICAgIFxcKCAje1VSTF9BTkRfVElUTEV9IFxcKSAjIChpbWFnZSBwYXRoLCBhbnkgZGVzY3JpcHRpb24pXG4gIC8vL1xuXG5pc0ltYWdlID0gKGlucHV0KSAtPiBJTUdfUkVHRVgudGVzdChpbnB1dClcbnBhcnNlSW1hZ2UgPSAoaW5wdXQpIC0+XG4gIGltYWdlID0gSU1HX1JFR0VYLmV4ZWMoaW5wdXQpXG5cbiAgaWYgaW1hZ2UgJiYgaW1hZ2UubGVuZ3RoID49IDJcbiAgICByZXR1cm4gYWx0OiBpbWFnZVsxXSwgc3JjOiBpbWFnZVsyXSwgdGl0bGU6IGltYWdlWzNdIHx8IFwiXCJcbiAgZWxzZVxuICAgIHJldHVybiBhbHQ6IGlucHV0LCBzcmM6IFwiXCIsIHRpdGxlOiBcIlwiXG5cbklNR19FWFRFTlNJT05TID0gW1wiLmpwZ1wiLCBcIi5qcGVnXCIsIFwiLnBuZ1wiLCBcIi5naWZcIiwgXCIuaWNvXCJdXG5cbmlzSW1hZ2VGaWxlID0gKGZpbGUpIC0+XG4gIGZpbGUgJiYgKHBhdGguZXh0bmFtZShmaWxlKS50b0xvd2VyQ2FzZSgpIGluIElNR19FWFRFTlNJT05TKVxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIElubGluZSBsaW5rXG4jXG5cbklOTElORV9MSU5LX1JFR0VYID0gLy8vXG4gIFxcWyAje0lNR19PUl9URVhUfSBcXF0gICAjIFtpbWFnZXx0ZXh0XVxuICBcXCggI3tVUkxfQU5EX1RJVExFfSBcXCkgIyAodXJsIFwiYW55IHRpdGxlXCIpXG4gIC8vL1xuXG5JTkxJTkVfTElOS19URVNUX1JFR0VYID0gLy8vXG4gICN7T1BFTl9UQUd9XG4gICN7SU5MSU5FX0xJTktfUkVHRVguc291cmNlfVxuICAvLy9cblxuaXNJbmxpbmVMaW5rID0gKGlucHV0KSAtPiBJTkxJTkVfTElOS19URVNUX1JFR0VYLnRlc3QoaW5wdXQpXG5wYXJzZUlubGluZUxpbmsgPSAoaW5wdXQpIC0+XG4gIGxpbmsgPSBJTkxJTkVfTElOS19SRUdFWC5leGVjKGlucHV0KVxuXG4gIGlmIGxpbmsgJiYgbGluay5sZW5ndGggPj0gMlxuICAgIHRleHQ6IGxpbmtbMV0sIHVybDogbGlua1syXSwgdGl0bGU6IGxpbmtbM10gfHwgXCJcIlxuICBlbHNlXG4gICAgdGV4dDogaW5wdXQsIHVybDogXCJcIiwgdGl0bGU6IFwiXCJcblxuc2NhbkxpbmtzID0gKGVkaXRvciwgY2IpIC0+XG4gIGVkaXRvci5idWZmZXIuc2NhbiAvLy8gI3tJTkxJTkVfTElOS19SRUdFWC5zb3VyY2V9IC8vL2csIChtYXRjaCkgLT5cbiAgICByZyA9IG1hdGNoLnJhbmdlXG4gICAgcmcuc3RhcnQuY29sdW1uICs9IG1hdGNoLm1hdGNoWzFdLmxlbmd0aCArIDMgIyBbXShcbiAgICByZy5lbmQuY29sdW1uIC09IDFcbiAgICBjYihyZylcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBSZWZlcmVuY2UgbGlua1xuI1xuXG4jIE1hdGNoIHJlZmVyZW5jZSBsaW5rIFt0ZXh0XVtpZF1cblJFRkVSRU5DRV9MSU5LX1JFR0VYX09GID0gKGlkLCBvcHRzID0ge30pIC0+XG4gIGlkID0gZXNjYXBlUmVnRXhwKGlkKSB1bmxlc3Mgb3B0cy5ub0VzY2FwZVxuICAvLy9cbiAgXFxbKCN7aWR9KVxcXVxcID9cXFtcXF0gICAgICAgICAgICAgICAjIFt0ZXh0XVtdXG4gIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgb3JcbiAgXFxbI3tJTUdfT1JfVEVYVH1cXF1cXCA/XFxbKCN7aWR9KVxcXSAjIFtpbWFnZXx0ZXh0XVtpZF1cbiAgLy8vXG5cbiMgTWF0Y2ggcmVmZXJlbmNlIGxpbmsgZGVmaW5pdGlvbnMgW2lkXTogdXJsXG5SRUZFUkVOQ0VfREVGX1JFR0VYX09GID0gKGlkLCBvcHRzID0ge30pIC0+XG4gIGlkID0gZXNjYXBlUmVnRXhwKGlkKSB1bmxlc3Mgb3B0cy5ub0VzY2FwZVxuICAvLy9cbiAgXiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBzdGFydCBvZiBsaW5lXG4gIFxcICogICAgICAgICAgICAgICAgICAgICAgICAgICAjIGFueSBsZWFkaW5nIHNwYWNlc1xuICBcXFsoI3tpZH0pXFxdOlxcICsgICAgICAgICAgICAgICAjIFtpZF06IGZvbGxvd2VkIGJ5IHNwYWNlc1xuICAje1VSTF9BTkRfVElUTEV9ICAgICAgICAgICAgICAjIGxpbmsgXCJ0aXRsZVwiXG4gICRcbiAgLy8vbVxuXG4jIFJFRkVSRU5DRV9MSU5LX1JFR0VYLmV4ZWMoXCJbdGV4dF1baWRdXCIpXG4jID0+IFtcIlt0ZXh0XVtpZF1cIiwgdW5kZWZpbmVkLCBcInRleHRcIiwgXCJpZFwiXVxuI1xuIyBSRUZFUkVOQ0VfTElOS19SRUdFWC5leGVjKFwiW3RleHRdW11cIilcbiMgPT4gW1wiW3RleHRdW11cIiwgXCJ0ZXh0XCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXVxuUkVGRVJFTkNFX0xJTktfUkVHRVggPSBSRUZFUkVOQ0VfTElOS19SRUdFWF9PRihMSU5LX0lELCBub0VzY2FwZTogdHJ1ZSlcblJFRkVSRU5DRV9MSU5LX1RFU1RfUkVHRVggPSAvLy9cbiAgI3tPUEVOX1RBR31cbiAgI3tSRUZFUkVOQ0VfTElOS19SRUdFWC5zb3VyY2V9XG4gIC8vL1xuXG5SRUZFUkVOQ0VfREVGX1JFR0VYID0gUkVGRVJFTkNFX0RFRl9SRUdFWF9PRihMSU5LX0lELCBub0VzY2FwZTogdHJ1ZSlcblxuaXNSZWZlcmVuY2VMaW5rID0gKGlucHV0KSAtPiBSRUZFUkVOQ0VfTElOS19URVNUX1JFR0VYLnRlc3QoaW5wdXQpXG5wYXJzZVJlZmVyZW5jZUxpbmsgPSAoaW5wdXQsIGVkaXRvcikgLT5cbiAgbGluayA9IFJFRkVSRU5DRV9MSU5LX1JFR0VYLmV4ZWMoaW5wdXQpXG4gIHRleHQgPSBsaW5rWzJdIHx8IGxpbmtbMV1cbiAgaWQgICA9IGxpbmtbM10gfHwgbGlua1sxXVxuXG4gICMgZmluZCBkZWZpbml0aW9uIGFuZCBkZWZpbml0aW9uUmFuZ2UgaWYgZWRpdG9yIGlzIGdpdmVuXG4gIGRlZiAgPSB1bmRlZmluZWRcbiAgZWRpdG9yICYmIGVkaXRvci5idWZmZXIuc2NhbiBSRUZFUkVOQ0VfREVGX1JFR0VYX09GKGlkKSwgKG1hdGNoKSAtPiBkZWYgPSBtYXRjaFxuXG4gIGlmIGRlZlxuICAgIGlkOiBpZCwgdGV4dDogdGV4dCwgdXJsOiBkZWYubWF0Y2hbMl0sIHRpdGxlOiBkZWYubWF0Y2hbM10gfHwgXCJcIixcbiAgICBkZWZpbml0aW9uUmFuZ2U6IGRlZi5yYW5nZVxuICBlbHNlXG4gICAgaWQ6IGlkLCB0ZXh0OiB0ZXh0LCB1cmw6IFwiXCIsIHRpdGxlOiBcIlwiLCBkZWZpbml0aW9uUmFuZ2U6IG51bGxcblxuaXNSZWZlcmVuY2VEZWZpbml0aW9uID0gKGlucHV0KSAtPlxuICBkZWYgPSBSRUZFUkVOQ0VfREVGX1JFR0VYLmV4ZWMoaW5wdXQpXG4gICEhZGVmICYmIGRlZlsxXVswXSAhPSBcIl5cIiAjIG5vdCBhIGZvb3Rub3RlXG5cbnBhcnNlUmVmZXJlbmNlRGVmaW5pdGlvbiA9IChpbnB1dCwgZWRpdG9yKSAtPlxuICBkZWYgID0gUkVGRVJFTkNFX0RFRl9SRUdFWC5leGVjKGlucHV0KVxuICBpZCAgID0gZGVmWzFdXG5cbiAgIyBmaW5kIGxpbmsgYW5kIGxpbmtSYW5nZSBpZiBlZGl0b3IgaXMgZ2l2ZW5cbiAgbGluayA9IHVuZGVmaW5lZFxuICBlZGl0b3IgJiYgZWRpdG9yLmJ1ZmZlci5zY2FuIFJFRkVSRU5DRV9MSU5LX1JFR0VYX09GKGlkKSwgKG1hdGNoKSAtPiBsaW5rID0gbWF0Y2hcblxuICBpZiBsaW5rXG4gICAgaWQ6IGlkLCB0ZXh0OiBsaW5rLm1hdGNoWzJdIHx8IGxpbmsubWF0Y2hbMV0sIHVybDogZGVmWzJdLFxuICAgIHRpdGxlOiBkZWZbM10gfHwgXCJcIiwgbGlua1JhbmdlOiBsaW5rLnJhbmdlXG4gIGVsc2VcbiAgICBpZDogaWQsIHRleHQ6IFwiXCIsIHVybDogZGVmWzJdLCB0aXRsZTogZGVmWzNdIHx8IFwiXCIsIGxpbmtSYW5nZTogbnVsbFxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEZvb3Rub3RlXG4jXG5cbkZPT1ROT1RFX1JFR0VYID0gLy8vIFxcWyBcXF4gKC4rPykgXFxdICg6KT8gLy8vXG5GT09UTk9URV9URVNUX1JFR0VYID0gLy8vXG4gICN7T1BFTl9UQUd9XG4gICN7Rk9PVE5PVEVfUkVHRVguc291cmNlfVxuICAvLy9cblxuaXNGb290bm90ZSA9IChpbnB1dCkgLT4gRk9PVE5PVEVfVEVTVF9SRUdFWC50ZXN0KGlucHV0KVxucGFyc2VGb290bm90ZSA9IChpbnB1dCkgLT5cbiAgZm9vdG5vdGUgPSBGT09UTk9URV9SRUdFWC5leGVjKGlucHV0KVxuICBsYWJlbDogZm9vdG5vdGVbMV0sIGlzRGVmaW5pdGlvbjogZm9vdG5vdGVbMl0gPT0gXCI6XCIsIGNvbnRlbnQ6IFwiXCJcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBUYWJsZVxuI1xuXG5UQUJMRV9TRVBBUkFUT1JfUkVHRVggPSAvLy9cbiAgXlxuICAoXFx8KT8gICAgICAgICAgICAgICAgIyBzdGFydHMgd2l0aCBhbiBvcHRpb25hbCB8XG4gIChcbiAgICg/OlxccyooPzotK3w6LSo6fDotKnwtKjopXFxzKlxcfCkrICAgICMgb25lIG9yIG1vcmUgdGFibGUgY2VsbFxuICAgKD86XFxzKig/Oi0rfDotKjp8Oi0qfC0qOilcXHMqfFxccyspICAgIyBsYXN0IHRhYmxlIGNlbGwsIG9yIGVtcHR5IGNlbGxcbiAgKVxuICAoXFx8KT8gICAgICAgICAgICAgICAgIyBlbmRzIHdpdGggYW4gb3B0aW9uYWwgfFxuICAkXG4gIC8vL1xuXG5UQUJMRV9PTkVfQ09MVU1OX1NFUEFSQVRPUl9SRUdFWCA9IC8vLyBeIChcXHwpIChcXHMqOj8tKzo/XFxzKikgKFxcfCkgJCAvLy9cblxuaXNUYWJsZVNlcGFyYXRvciA9IChsaW5lKSAtPlxuICBUQUJMRV9TRVBBUkFUT1JfUkVHRVgudGVzdChsaW5lKSB8fFxuICAgIFRBQkxFX09ORV9DT0xVTU5fU0VQQVJBVE9SX1JFR0VYLnRlc3QobGluZSlcblxucGFyc2VUYWJsZVNlcGFyYXRvciA9IChsaW5lKSAtPlxuICBtYXRjaGVzID0gVEFCTEVfU0VQQVJBVE9SX1JFR0VYLmV4ZWMobGluZSkgfHxcbiAgICBUQUJMRV9PTkVfQ09MVU1OX1NFUEFSQVRPUl9SRUdFWC5leGVjKGxpbmUpXG4gIGV4dHJhUGlwZXMgPSAhIShtYXRjaGVzWzFdIHx8IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXSlcbiAgY29sdW1ucyA9IG1hdGNoZXNbMl0uc3BsaXQoXCJ8XCIpLm1hcCAoY29sKSAtPiBjb2wudHJpbSgpXG5cbiAgcmV0dXJuIHtcbiAgICBzZXBhcmF0b3I6IHRydWVcbiAgICBleHRyYVBpcGVzOiBleHRyYVBpcGVzXG4gICAgY29sdW1uczogY29sdW1uc1xuICAgIGNvbHVtbldpZHRoczogY29sdW1ucy5tYXAgKGNvbCkgLT4gY29sLmxlbmd0aFxuICAgIGFsaWdubWVudHM6IGNvbHVtbnMubWFwIChjb2wpIC0+XG4gICAgICBoZWFkID0gY29sWzBdID09IFwiOlwiXG4gICAgICB0YWlsID0gY29sW2NvbC5sZW5ndGggLSAxXSA9PSBcIjpcIlxuXG4gICAgICBpZiBoZWFkICYmIHRhaWxcbiAgICAgICAgXCJjZW50ZXJcIlxuICAgICAgZWxzZSBpZiBoZWFkXG4gICAgICAgIFwibGVmdFwiXG4gICAgICBlbHNlIGlmIHRhaWxcbiAgICAgICAgXCJyaWdodFwiXG4gICAgICBlbHNlXG4gICAgICAgIFwiZW1wdHlcIlxuICB9XG5cblRBQkxFX1JPV19SRUdFWCA9IC8vL1xuICBeXG4gIChcXHwpPyAgICAgICAgICAgICAgICAjIHN0YXJ0cyB3aXRoIGFuIG9wdGlvbmFsIHxcbiAgKC4rP1xcfC4rPykgICAgICAgICAgICMgYW55IGNvbnRlbnQgd2l0aCBhdCBsZWFzdCAyIGNvbHVtbnNcbiAgKFxcfCk/ICAgICAgICAgICAgICAgICMgZW5kcyB3aXRoIGFuIG9wdGlvbmFsIHxcbiAgJFxuICAvLy9cblxuVEFCTEVfT05FX0NPTFVNTl9ST1dfUkVHRVggPSAvLy8gXiAoXFx8KSAoLis/KSAoXFx8KSAkIC8vL1xuXG5pc1RhYmxlUm93ID0gKGxpbmUpIC0+XG4gIFRBQkxFX1JPV19SRUdFWC50ZXN0KGxpbmUpIHx8IFRBQkxFX09ORV9DT0xVTU5fUk9XX1JFR0VYLnRlc3QobGluZSlcblxucGFyc2VUYWJsZVJvdyA9IChsaW5lKSAtPlxuICByZXR1cm4gcGFyc2VUYWJsZVNlcGFyYXRvcihsaW5lKSBpZiBpc1RhYmxlU2VwYXJhdG9yKGxpbmUpXG5cbiAgbWF0Y2hlcyA9IFRBQkxFX1JPV19SRUdFWC5leGVjKGxpbmUpIHx8IFRBQkxFX09ORV9DT0xVTU5fUk9XX1JFR0VYLmV4ZWMobGluZSlcbiAgZXh0cmFQaXBlcyA9ICEhKG1hdGNoZXNbMV0gfHwgbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdKVxuICBjb2x1bW5zID0gbWF0Y2hlc1syXS5zcGxpdChcInxcIikubWFwIChjb2wpIC0+IGNvbC50cmltKClcblxuICByZXR1cm4ge1xuICAgIHNlcGFyYXRvcjogZmFsc2VcbiAgICBleHRyYVBpcGVzOiBleHRyYVBpcGVzXG4gICAgY29sdW1uczogY29sdW1uc1xuICAgIGNvbHVtbldpZHRoczogY29sdW1ucy5tYXAgKGNvbCkgLT4gd2Nzd2lkdGgoY29sKVxuICB9XG5cbiMgZGVmYXVsdHM6XG4jICAgbnVtT2ZDb2x1bW5zOiAzXG4jICAgY29sdW1uV2lkdGg6IDNcbiMgICBjb2x1bW5XaWR0aHM6IFtdXG4jICAgZXh0cmFQaXBlczogdHJ1ZVxuIyAgIGFsaWdubWVudDogXCJsZWZ0XCIgfCBcInJpZ2h0XCIgfCBcImNlbnRlclwiIHwgXCJlbXB0eVwiXG4jICAgYWxpZ25tZW50czogW11cbmNyZWF0ZVRhYmxlU2VwYXJhdG9yID0gKG9wdGlvbnMpIC0+XG4gIG9wdGlvbnMuY29sdW1uV2lkdGhzID89IFtdXG4gIG9wdGlvbnMuYWxpZ25tZW50cyA/PSBbXVxuXG4gIHJvdyA9IFtdXG4gIGZvciBpIGluIFswLi5vcHRpb25zLm51bU9mQ29sdW1ucyAtIDFdXG4gICAgY29sdW1uV2lkdGggPSBvcHRpb25zLmNvbHVtbldpZHRoc1tpXSB8fCBvcHRpb25zLmNvbHVtbldpZHRoXG5cbiAgICAjIGVtcHR5IHNwYWNlcyB3aWxsIGJlIGluc2VydGVkIHdoZW4gam9pbiBwaXBlcywgc28gbmVlZCB0byBjb21wZW5zYXRlIGhlcmVcbiAgICBpZiAhb3B0aW9ucy5leHRyYVBpcGVzICYmIChpID09IDAgfHwgaSA9PSBvcHRpb25zLm51bU9mQ29sdW1ucyAtIDEpXG4gICAgICBjb2x1bW5XaWR0aCArPSAxXG4gICAgZWxzZVxuICAgICAgY29sdW1uV2lkdGggKz0gMlxuXG4gICAgc3dpdGNoIG9wdGlvbnMuYWxpZ25tZW50c1tpXSB8fCBvcHRpb25zLmFsaWdubWVudFxuICAgICAgd2hlbiBcImNlbnRlclwiXG4gICAgICAgIHJvdy5wdXNoKFwiOlwiICsgXCItXCIucmVwZWF0KGNvbHVtbldpZHRoIC0gMikgKyBcIjpcIilcbiAgICAgIHdoZW4gXCJsZWZ0XCJcbiAgICAgICAgcm93LnB1c2goXCI6XCIgKyBcIi1cIi5yZXBlYXQoY29sdW1uV2lkdGggLSAxKSlcbiAgICAgIHdoZW4gXCJyaWdodFwiXG4gICAgICAgIHJvdy5wdXNoKFwiLVwiLnJlcGVhdChjb2x1bW5XaWR0aCAtIDEpICsgXCI6XCIpXG4gICAgICBlbHNlXG4gICAgICAgIHJvdy5wdXNoKFwiLVwiLnJlcGVhdChjb2x1bW5XaWR0aCkpXG5cbiAgcm93ID0gcm93LmpvaW4oXCJ8XCIpXG4gIGlmIG9wdGlvbnMuZXh0cmFQaXBlcyB0aGVuIFwifCN7cm93fXxcIiBlbHNlIHJvd1xuXG4jIGNvbHVtbnM6IFt2YWx1ZXNdXG4jIGRlZmF1bHRzOlxuIyAgIG51bU9mQ29sdW1uczogM1xuIyAgIGNvbHVtbldpZHRoOiAzXG4jICAgY29sdW1uV2lkdGhzOiBbXVxuIyAgIGV4dHJhUGlwZXM6IHRydWVcbiMgICBhbGlnbm1lbnQ6IFwibGVmdFwiIHwgXCJyaWdodFwiIHwgXCJjZW50ZXJcIiB8IFwiZW1wdHlcIlxuIyAgIGFsaWdubWVudHM6IFtdXG5jcmVhdGVUYWJsZVJvdyA9IChjb2x1bW5zLCBvcHRpb25zKSAtPlxuICBvcHRpb25zLmNvbHVtbldpZHRocyA/PSBbXVxuICBvcHRpb25zLmFsaWdubWVudHMgPz0gW11cblxuICByb3cgPSBbXVxuICBmb3IgaSBpbiBbMC4ub3B0aW9ucy5udW1PZkNvbHVtbnMgLSAxXVxuICAgIGNvbHVtbldpZHRoID0gb3B0aW9ucy5jb2x1bW5XaWR0aHNbaV0gfHwgb3B0aW9ucy5jb2x1bW5XaWR0aFxuXG4gICAgaWYgIWNvbHVtbnNbaV1cbiAgICAgIHJvdy5wdXNoKFwiIFwiLnJlcGVhdChjb2x1bW5XaWR0aCkpXG4gICAgICBjb250aW51ZVxuXG4gICAgbGVuID0gY29sdW1uV2lkdGggLSB3Y3N3aWR0aChjb2x1bW5zW2ldKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkNvbHVtbiB3aWR0aCAje2NvbHVtbldpZHRofSAtIHdjc3dpZHRoKCcje2NvbHVtbnNbaV19JykgY2Fubm90IGJlICN7bGVufVwiKSBpZiBsZW4gPCAwXG5cbiAgICBzd2l0Y2ggb3B0aW9ucy5hbGlnbm1lbnRzW2ldIHx8IG9wdGlvbnMuYWxpZ25tZW50XG4gICAgICB3aGVuIFwiY2VudGVyXCJcbiAgICAgICAgcm93LnB1c2goXCIgXCIucmVwZWF0KGxlbiAvIDIpICsgY29sdW1uc1tpXSArIFwiIFwiLnJlcGVhdCgobGVuICsgMSkgLyAyKSlcbiAgICAgIHdoZW4gXCJsZWZ0XCJcbiAgICAgICAgcm93LnB1c2goY29sdW1uc1tpXSArIFwiIFwiLnJlcGVhdChsZW4pKVxuICAgICAgd2hlbiBcInJpZ2h0XCJcbiAgICAgICAgcm93LnB1c2goXCIgXCIucmVwZWF0KGxlbikgKyBjb2x1bW5zW2ldKVxuICAgICAgZWxzZVxuICAgICAgICByb3cucHVzaChjb2x1bW5zW2ldICsgXCIgXCIucmVwZWF0KGxlbikpXG5cbiAgcm93ID0gcm93LmpvaW4oXCIgfCBcIilcbiAgaWYgb3B0aW9ucy5leHRyYVBpcGVzIHRoZW4gXCJ8ICN7cm93fSB8XCIgZWxzZSByb3dcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBVUkxcbiNcblxuVVJMX1JFR0VYID0gLy8vXG4gIF5cbiAgKD86XFx3KzopP1xcL1xcLyAgICAgICAgICAgICAgICAgICAgICAgIyBhbnkgcHJlZml4LCBlLmcuIGh0dHA6Ly9cbiAgKFteXFxzXFwuXStcXC5cXFN7Mn18bG9jYWxob3N0W1xcOj9cXGRdKikgIyBzb21lIGRvbWFpblxuICBcXFMqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBwYXRoXG4gICRcbiAgLy8vaVxuXG5pc1VybCA9ICh1cmwpIC0+IFVSTF9SRUdFWC50ZXN0KHVybClcblxuIyBOb3JtYWxpemUgYSBmaWxlIHBhdGggdG8gVVJMIHNlcGFyYXRvclxubm9ybWFsaXplRmlsZVBhdGggPSAocGF0aCkgLT4gcGF0aC5zcGxpdCgvW1xcXFxcXC9dLykuam9pbignLycpXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgQXRvbSBUZXh0RWRpdG9yXG4jXG5cbiMgUmV0dXJuIHNjb3BlU2VsZWN0b3IgaWYgdGhlcmUgaXMgYW4gZXhhY3QgbWF0Y2gsXG4jIGVsc2UgcmV0dXJuIGFueSBzY29wZSBkZXNjcmlwdG9yIGNvbnRhaW5zIHNjb3BlU2VsZWN0b3JcbmdldFNjb3BlRGVzY3JpcHRvciA9IChjdXJzb3IsIHNjb3BlU2VsZWN0b3IpIC0+XG4gIHNjb3BlcyA9IGN1cnNvci5nZXRTY29wZURlc2NyaXB0b3IoKVxuICAgIC5nZXRTY29wZXNBcnJheSgpXG4gICAgLmZpbHRlcigoc2NvcGUpIC0+IHNjb3BlLmluZGV4T2Yoc2NvcGVTZWxlY3RvcikgPj0gMClcblxuICBpZiBzY29wZXMuaW5kZXhPZihzY29wZVNlbGVjdG9yKSA+PSAwXG4gICAgcmV0dXJuIHNjb3BlU2VsZWN0b3JcbiAgZWxzZSBpZiBzY29wZXMubGVuZ3RoID4gMFxuICAgIHJldHVybiBzY29wZXNbMF1cblxuZ2V0QnVmZmVyUmFuZ2VGb3JTY29wZSA9IChlZGl0b3IsIGN1cnNvciwgc2NvcGVTZWxlY3RvcikgLT5cbiAgcmV0dXJuIHVubGVzcyBzY29wZVNlbGVjdG9yICMgcmVtb3ZlIHVuZGVmaW5lZCBzY29wZVNlbGVjdG9yXG5cbiAgcG9zID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgcmFuZ2UgPSBlZGl0b3IuYnVmZmVyUmFuZ2VGb3JTY29wZUF0UG9zaXRpb24oc2NvcGVTZWxlY3RvciwgcG9zKVxuICByZXR1cm4gcmFuZ2UgaWYgcmFuZ2VcblxuICAjIEF0b20gQnVnIDE6IG5vdCByZXR1cm5pbmcgdGhlIGNvcnJlY3QgYnVmZmVyIHJhbmdlIHdoZW4gY3Vyc29yIGlzIGF0IHRoZSBlbmQgb2YgYSBsaW5rIHdpdGggc2NvcGUsXG4gICMgcmVmZXIgaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9pc3N1ZXMvNzk2MVxuICAjXG4gICMgSEFDSyBtb3ZlIHRoZSBjdXJzb3IgcG9zaXRpb24gb25lIGNoYXIgYmFja3dhcmQsIGFuZCB0cnkgdG8gZ2V0IHRoZSBidWZmZXIgcmFuZ2UgZm9yIHNjb3BlIGFnYWluXG4gIHVubGVzcyBjdXJzb3IuaXNBdEJlZ2lubmluZ09mTGluZSgpXG4gICAgcmFuZ2UgPSBlZGl0b3IuYnVmZmVyUmFuZ2VGb3JTY29wZUF0UG9zaXRpb24oc2NvcGVTZWxlY3RvciwgW3Bvcy5yb3csIHBvcy5jb2x1bW4gLSAxXSlcbiAgICByZXR1cm4gcmFuZ2UgaWYgcmFuZ2VcblxuICAjIEF0b20gQnVnIDI6IG5vdCByZXR1cm5pbmcgdGhlIGNvcnJlY3QgYnVmZmVyIHJhbmdlIHdoZW4gY3Vyc29yIGlzIGF0IHRoZSBoZWFkIG9mIGEgbGlzdCBsaW5rIHdpdGggc2NvcGUsXG4gICMgcmVmZXIgaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9pc3N1ZXMvMTI3MTRcbiAgI1xuICAjIEhBQ0sgbW92ZSB0aGUgY3Vyc29yIHBvc2l0aW9uIG9uZSBjaGFyIGZvcndhcmQsIGFuZCB0cnkgdG8gZ2V0IHRoZSBidWZmZXIgcmFuZ2UgZm9yIHNjb3BlIGFnYWluXG4gIHVubGVzcyBjdXJzb3IuaXNBdEVuZE9mTGluZSgpXG4gICAgcmFuZ2UgPSBlZGl0b3IuYnVmZmVyUmFuZ2VGb3JTY29wZUF0UG9zaXRpb24oc2NvcGVTZWxlY3RvciwgW3Bvcy5yb3csIHBvcy5jb2x1bW4gKyAxXSlcbiAgICByZXR1cm4gcmFuZ2UgaWYgcmFuZ2VcblxuIyBHZXQgdGhlIHRleHQgYnVmZmVyIHJhbmdlIGlmIHNlbGVjdGlvbiBpcyBub3QgZW1wdHksIG9yIGdldCB0aGVcbiMgYnVmZmVyIHJhbmdlIGlmIGl0IGlzIGluc2lkZSBhIHNjb3BlIHNlbGVjdG9yLCBvciB0aGUgY3VycmVudCB3b3JkLlxuI1xuIyBvcHRzW1wic2VsZWN0aW9uXCJdOiBvcHRpb25hbCwgd2hlbiBub3QgcHJvdmlkZWQgb3IgZW1wdHksIHVzZSB0aGUgbGFzdCBzZWxlY3Rpb25cbiMgb3B0c1tcInNlbGVjdEJ5XCJdOlxuIyAgLSBub3BlOiBkbyBub3QgdXNlIGFueSBzZWxlY3QgYnlcbiMgIC0gbmVhcmVzdFdvcmQ6IHRyeSBzZWxlY3QgbmVhcmVzdCB3b3JkLCBkZWZhdWx0XG4jICAtIGN1cnJlbnRMaW5lOiB0cnkgc2VsZWN0IGN1cnJlbnQgbGluZVxuZ2V0VGV4dEJ1ZmZlclJhbmdlID0gKGVkaXRvciwgc2NvcGVTZWxlY3Rvciwgb3B0cyA9IHt9KSAtPlxuICBzZWxlY3Rpb24gPSBvcHRzLnNlbGVjdGlvbiB8fCBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpXG4gIHNlbGVjdEJ5ID0gb3B0cy5zZWxlY3RCeSB8fCBcIm5lYXJlc3RXb3JkXCJcblxuICBjdXJzb3IgPSBzZWxlY3Rpb24uY3Vyc29yXG4gIHJhbmdlID0gaWYgc2VsZWN0aW9uLmdldFRleHQoKVxuICAgICAgICAgICAgc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgICAgICBlbHNlIGlmIHNjb3BlID0gZ2V0U2NvcGVEZXNjcmlwdG9yKGN1cnNvciwgc2NvcGVTZWxlY3RvcilcbiAgICAgICAgICAgIGdldEJ1ZmZlclJhbmdlRm9yU2NvcGUoZWRpdG9yLCBjdXJzb3IsIHNjb3BlKVxuICAgICAgICAgIGVsc2UgaWYgc2VsZWN0QnkgPT0gXCJuZWFyZXN0V29yZFwiXG4gICAgICAgICAgICB3b3JkUmVnZXggPSBjdXJzb3Iud29yZFJlZ0V4cChpbmNsdWRlTm9uV29yZENoYXJhY3RlcnM6IGZhbHNlKVxuICAgICAgICAgICAgY3Vyc29yLmdldEN1cnJlbnRXb3JkQnVmZmVyUmFuZ2Uod29yZFJlZ2V4OiB3b3JkUmVnZXgpXG4gICAgICAgICAgZWxzZSBpZiBzZWxlY3RCeSA9PSBcImN1cnJlbnRXb3JkXCJcbiAgICAgICAgICAgIGN1cnNvci5nZXRDdXJyZW50V29yZEJ1ZmZlclJhbmdlKClcbiAgICAgICAgICBlbHNlIGlmIHNlbGVjdEJ5ID09IFwiY3VycmVudE5vblRyYWlsV29yZFwiXG4gICAgICAgICAgICB3b3JkUmFuZ2UgPSBjdXJzb3IuZ2V0Q3VycmVudFdvcmRCdWZmZXJSYW5nZSgpXG4gICAgICAgICAgICAjIHRlc3QgaWYgY3Vyc29yIGlzIGF0IHRoZSBlbmQgb2Ygd29yZFxuICAgICAgICAgICAgaWYgd29yZFJhbmdlICYmIHdvcmRSYW5nZS5lbmQuY29sdW1uID09IGN1cnNvci5nZXRCdWZmZXJDb2x1bW4oKVxuICAgICAgICAgICAgICBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICB3b3JkUmFuZ2VcbiAgICAgICAgICBlbHNlIGlmIHNlbGVjdEJ5ID09IFwiY3VycmVudExpbmVcIlxuICAgICAgICAgICAgY3Vyc29yLmdldEN1cnJlbnRMaW5lQnVmZmVyUmFuZ2UoKVxuICAgICAgICAgIGVsc2UgaWYgc2VsZWN0QnkgPT0gXCJjdXJyZW50UGFyYWdyYXBoXCJcbiAgICAgICAgICAgIGN1cnNvci5nZXRDdXJyZW50UGFyYWdyYXBoQnVmZmVyUmFuZ2UoKSAjIGNvdWxkIGdldCB1bmRlZmluZWQgd2hlbiBjdXJzb3IgaXMgb24gYW4gZW1wdHkgbGluZVxuXG4gICMgcmV0dXJuIHJhbmdlIG9yIGRlZmF1bHQgc2VsZWN0aW9uIHJhbmdlLCBtYWtlIHN1cmUgdGhlcmUgaXMgYSByYW5nZSByZXR1cm5lZFxuICByYW5nZSB8fCBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuXG4jIEZpbmQgYSBwb3NzaWJsZSBsaW5rIHRhZyBpbiB0aGUgcmFuZ2UgZnJvbSBlZGl0b3IsIHJldHVybiB0aGUgZm91bmQgbGluayBkYXRhIG9yIG5pbFxuI1xuIyBEYXRhIGZvcm1hdDogeyB0ZXh0OiBcIlwiLCB1cmw6IFwiXCIsIHRpdGxlOiBcIlwiLCBpZDogbnVsbCwgbGlua1JhbmdlOiBudWxsLCBkZWZpbml0aW9uUmFuZ2U6IG51bGwgfVxuI1xuIyBOT1RFOiBJZiBpZCBpcyBub3QgbnVsbCwgYW5kIGFueSBvZiBsaW5rUmFuZ2UvZGVmaW5pdGlvblJhbmdlIGlzIG51bGwsIGl0IG1lYW5zIHRoZSBsaW5rIGlzIGFuIG9ycGhhblxuZmluZExpbmtJblJhbmdlID0gKGVkaXRvciwgcmFuZ2UpIC0+XG4gIHNlbGVjdGlvbiA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShyYW5nZSlcbiAgcmV0dXJuIGlmIHNlbGVjdGlvbiA9PSBcIlwiXG5cbiAgcmV0dXJuIHRleHQ6IFwiXCIsIHVybDogc2VsZWN0aW9uLCB0aXRsZTogXCJcIiBpZiBpc1VybChzZWxlY3Rpb24pXG4gIHJldHVybiBwYXJzZUlubGluZUxpbmsoc2VsZWN0aW9uKSBpZiBpc0lubGluZUxpbmsoc2VsZWN0aW9uKVxuXG4gIGlmIGlzUmVmZXJlbmNlTGluayhzZWxlY3Rpb24pXG4gICAgbGluayA9IHBhcnNlUmVmZXJlbmNlTGluayhzZWxlY3Rpb24sIGVkaXRvcilcbiAgICBsaW5rLmxpbmtSYW5nZSA9IHJhbmdlXG4gICAgcmV0dXJuIGxpbmtcbiAgZWxzZSBpZiBpc1JlZmVyZW5jZURlZmluaXRpb24oc2VsZWN0aW9uKVxuICAgICMgSEFDSyBjb3JyZWN0IHRoZSBkZWZpbml0aW9uIHJhbmdlLCBBdG9tJ3MgbGluayBzY29wZSBkb2VzIG5vdCBpbmNsdWRlXG4gICAgIyBkZWZpbml0aW9uJ3MgdGl0bGUsIHNvIG5vcm1hbGl6ZSB0byBiZSB0aGUgcmFuZ2Ugc3RhcnQgcm93XG4gICAgc2VsZWN0aW9uID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJhbmdlLnN0YXJ0LnJvdylcbiAgICByYW5nZSA9IGVkaXRvci5idWZmZXJSYW5nZUZvckJ1ZmZlclJvdyhyYW5nZS5zdGFydC5yb3cpXG5cbiAgICBsaW5rID0gcGFyc2VSZWZlcmVuY2VEZWZpbml0aW9uKHNlbGVjdGlvbiwgZWRpdG9yKVxuICAgIGxpbmsuZGVmaW5pdGlvblJhbmdlID0gcmFuZ2VcbiAgICByZXR1cm4gbGlua1xuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEV4cG9ydHNcbiNcblxubW9kdWxlLmV4cG9ydHMgPVxuICBnZXRKU09OOiBnZXRKU09OXG4gIGVzY2FwZVJlZ0V4cDogZXNjYXBlUmVnRXhwXG4gIGNhcGl0YWxpemU6IGNhcGl0YWxpemVcbiAgaXNVcHBlckNhc2U6IGlzVXBwZXJDYXNlXG4gIGluY3JlbWVudENoYXJzOiBpbmNyZW1lbnRDaGFyc1xuICBzbHVnaXplOiBzbHVnaXplXG4gIG5vcm1hbGl6ZUZpbGVQYXRoOiBub3JtYWxpemVGaWxlUGF0aFxuXG4gIGdldFBhY2thZ2VQYXRoOiBnZXRQYWNrYWdlUGF0aFxuICBnZXRQcm9qZWN0UGF0aDogZ2V0UHJvamVjdFBhdGhcbiAgZ2V0U2l0ZVBhdGg6IGdldFNpdGVQYXRoXG4gIGdldEhvbWVkaXI6IGdldEhvbWVkaXJcbiAgZ2V0QWJzb2x1dGVQYXRoOiBnZXRBYnNvbHV0ZVBhdGhcblxuICBzZXRUYWJJbmRleDogc2V0VGFiSW5kZXhcblxuICB0ZW1wbGF0ZTogdGVtcGxhdGVcbiAgdW50ZW1wbGF0ZTogdW50ZW1wbGF0ZVxuXG4gIGdldERhdGU6IGdldERhdGVcbiAgcGFyc2VEYXRlOiBwYXJzZURhdGVcblxuICBpc0ltYWdlVGFnOiBpc0ltYWdlVGFnXG4gIHBhcnNlSW1hZ2VUYWc6IHBhcnNlSW1hZ2VUYWdcbiAgaXNJbWFnZTogaXNJbWFnZVxuICBwYXJzZUltYWdlOiBwYXJzZUltYWdlXG5cbiAgc2NhbkxpbmtzOiBzY2FuTGlua3NcbiAgaXNJbmxpbmVMaW5rOiBpc0lubGluZUxpbmtcbiAgcGFyc2VJbmxpbmVMaW5rOiBwYXJzZUlubGluZUxpbmtcbiAgaXNSZWZlcmVuY2VMaW5rOiBpc1JlZmVyZW5jZUxpbmtcbiAgcGFyc2VSZWZlcmVuY2VMaW5rOiBwYXJzZVJlZmVyZW5jZUxpbmtcbiAgaXNSZWZlcmVuY2VEZWZpbml0aW9uOiBpc1JlZmVyZW5jZURlZmluaXRpb25cbiAgcGFyc2VSZWZlcmVuY2VEZWZpbml0aW9uOiBwYXJzZVJlZmVyZW5jZURlZmluaXRpb25cblxuICBpc0Zvb3Rub3RlOiBpc0Zvb3Rub3RlXG4gIHBhcnNlRm9vdG5vdGU6IHBhcnNlRm9vdG5vdGVcblxuICBpc1RhYmxlU2VwYXJhdG9yOiBpc1RhYmxlU2VwYXJhdG9yXG4gIHBhcnNlVGFibGVTZXBhcmF0b3I6IHBhcnNlVGFibGVTZXBhcmF0b3JcbiAgY3JlYXRlVGFibGVTZXBhcmF0b3I6IGNyZWF0ZVRhYmxlU2VwYXJhdG9yXG4gIGlzVGFibGVSb3c6IGlzVGFibGVSb3dcbiAgcGFyc2VUYWJsZVJvdzogcGFyc2VUYWJsZVJvd1xuICBjcmVhdGVUYWJsZVJvdzogY3JlYXRlVGFibGVSb3dcblxuICBpc1VybDogaXNVcmxcbiAgaXNJbWFnZUZpbGU6IGlzSW1hZ2VGaWxlXG5cbiAgZ2V0VGV4dEJ1ZmZlclJhbmdlOiBnZXRUZXh0QnVmZmVyUmFuZ2VcbiAgZmluZExpbmtJblJhbmdlOiBmaW5kTGlua0luUmFuZ2VcbiJdfQ==
