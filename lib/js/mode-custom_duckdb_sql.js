/* * Custom DuckDB SQL Mode for Ace Editor
 * Version: 1.5.0 (src-noconflict)
 */

// 1. Define Highlighting Rules
ace.define(
  "ace/mode/sql_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (require, exports, module) {
    "use strict";

    var oop = require("ace/lib/oop");
    var TextHighlightRules =
      require("ace/mode/text_highlight_rules").TextHighlightRules;

    var SqlHighlightRules = function () {
      // DuckDB Keywords including Grouping Sets, Cube, and Rollup
      var keywords =
        "select|insert|update|delete|from|where|and|or|group|by|order|limit|offset|having|as|case|" +
        "when|then|else|end|type|left|right|join|on|outer|desc|asc|union|create|table|primary|key|if|" +
        "foreign|not|references|default|null|inner|cross|natural|database|drop|grant|" +
        "view|pivot|unpivot|summarize|describe|explain|sample|using|within|intersect|except|distinct|" +
        "attach|detach|install|load|checkpoint|vacuum|pragma|qualify|window|over|" +
        "into|values|set|truncate|alter|add|column|rename|constraints|check|with|recursive|" +
        "grouping|sets|cube|rollup"; // Added Grouping specialized keywords

      var builtinConstants = "true|false|null";

      // DuckDB specific functions
      var builtinFunctions =
        "avg|count|first|last|max|min|sum|ucase|lcase|mid|len|round|rank|now|format|" +
        "coalesce|ifnull|isnull|nvl|unnest|range|list_extract|list_append|list_concat|" +
        "struct_extract|json_extract|json_extract_string|epoch|strftime|strptime|" +
        "arg_max|arg_min|bit_and|bit_or|bit_xor|median|mode|stddev|variance";

      // DuckDB Extended Data Types
      var dataTypes =
        "int|numeric|decimal|date|varchar|char|bigint|float|double|bit|binary|text|set|timestamp|" +
        "money|real|number|integer|hugeint|ubigint|uinteger|ushort|utinyint|uuid|interval|" +
        "timestamp_s|timestamp_ms|timestamp_ns|timestamp_tz|list|struct|map|union|boolean";

      var keywordMapper = this.createKeywordMapper(
        {
          "support.function": builtinFunctions,
          keyword: keywords,
          "constant.language": builtinConstants,
          "storage.type": dataTypes,
        },
        "identifier",
        true
      );

      this.$rules = {
        start: [
          {
            token: "comment",
            regex: "--.*$",
          },
          {
            token: "comment",
            start: "/\\*",
            end: "\\*/",
          },
          {
            token: "string",
            regex: '".*?"',
          },
          {
            token: "string",
            regex: "'.*?'",
          },
          {
            token: "string",
            regex: "`.*?`",
          },
          {
            token: "constant.numeric",
            regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
          },
          {
            token: "keyword.operator",
            regex: "[#\\$]\\d+",
          },
          {
            token: keywordMapper,
            regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b",
          },
          {
            token: "keyword.operator",
            regex:
              "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|=|->>|->",
          },
          {
            token: "paren.lparen",
            regex: "[\\(\\[\\{]",
          },
          {
            token: "paren.rparen",
            regex: "[\\)\\]\\}]",
          },
          {
            token: "text",
            regex: "\\s+",
          },
        ],
      };
      this.normalizeRules();
    };

    oop.inherits(SqlHighlightRules, TextHighlightRules);
    exports.SqlHighlightRules = SqlHighlightRules;
  }
);

// 2. Define Base Folding (C-Style)
ace.define(
  "ace/mode/folding/cstyle",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/range",
    "ace/mode/folding/fold_mode",
  ],
  function (require, exports, module) {
    "use strict";

    var oop = require("ace/lib/oop");
    var Range = require("ace/range").Range;
    var BaseFoldMode = require("ace/mode/folding/fold_mode").FoldMode;

    var FoldMode = (exports.FoldMode = function (commentRegex) {
      if (commentRegex) {
        this.foldingStartMarker = new RegExp(
          this.foldingStartMarker.source.replace(
            /\|[^|]*?$/,
            "|" + commentRegex.start
          )
        );
        this.foldingStopMarker = new RegExp(
          this.foldingStopMarker.source.replace(
            /\|[^|]*?$/,
            "|" + commentRegex.end
          )
        );
      }
    });
    oop.inherits(FoldMode, BaseFoldMode);

    (function () {
      this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
      this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
      this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
      this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
      this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
      this._getFoldWidgetBase = this.getFoldWidget;

      this.getFoldWidget = function (session, foldStyle, row) {
        var line = session.getLine(row);
        if (this.singleLineBlockCommentRe.test(line)) {
          if (
            !this.startRegionRe.test(line) &&
            !this.tripleStarBlockCommentRe.test(line)
          )
            return "";
        }
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
        if (!fw && this.startRegionRe.test(line)) return "start";
        return fw;
      };

      this.getFoldWidgetRange = function (
        session,
        foldStyle,
        row,
        forceMultiline
      ) {
        var line = session.getLine(row);
        if (this.startRegionRe.test(line))
          return this.getCommentRegionBlock(session, line, row);
        var match = line.match(this.foldingStartMarker);
        if (match) {
          var i = match.index;
          if (match[1])
            return this.openingBracketBlock(session, match[1], row, i);
          var range = session.getCommentFoldRange(row, i + match[0].length, 1);
          if (range && !range.isMultiLine()) {
            if (forceMultiline) range = this.getSectionRange(session, row);
            else if (foldStyle != "all") range = null;
          }
          return range;
        }
        if (foldStyle === "markbegin") return;
        var match = line.match(this.foldingStopMarker);
        if (match) {
          var i = match.index + match[0].length;
          if (match[1])
            return this.closingBracketBlock(session, match[1], row, i);
          return session.getCommentFoldRange(row, i, -1);
        }
      };

      this.getSectionRange = function (session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
          line = session.getLine(row);
          var indent = line.search(/\S/);
          if (indent === -1) continue;
          if (startIndent > indent) break;
          var subRange = this.getFoldWidgetRange(session, "all", row);
          if (subRange) {
            if (subRange.start.row <= startRow) break;
            else if (subRange.isMultiLine()) row = subRange.end.row;
            else if (startIndent == indent) break;
          }
          endRow = row;
        }
        return new Range(
          startRow,
          startColumn,
          endRow,
          session.getLine(endRow).length
        );
      };

      this.getCommentRegionBlock = function (session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
          line = session.getLine(row);
          var m = re.exec(line);
          if (!m) continue;
          if (m[1]) depth--;
          else depth++;
          if (!depth) break;
        }
        var endRow = row;
        if (endRow > startRow)
          return new Range(startRow, startColumn, endRow, line.length);
      };
    }).call(FoldMode.prototype);
  }
);

// 3. Define SQL specific folding
ace.define(
  "ace/mode/folding/sql",
  ["require", "exports", "module", "ace/lib/oop", "ace/mode/folding/cstyle"],
  function (require, exports, module) {
    "use strict";
    var oop = require("ace/lib/oop");
    var BaseFoldMode = require("ace/mode/folding/cstyle").FoldMode;
    var FoldMode = (exports.FoldMode = function () {});
    oop.inherits(FoldMode, BaseFoldMode);
  }
);

// 4. Final Mode Definition
ace.define(
  "ace/mode/custom_duckdb_sql",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/mode/sql_highlight_rules",
    "ace/mode/folding/sql",
  ],
  function (require, exports, module) {
    "use strict";

    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var SqlHighlightRules =
      require("ace/mode/sql_highlight_rules").SqlHighlightRules;
    var SqlFoldMode = require("ace/mode/folding/sql").FoldMode;

    var Mode = function () {
      this.HighlightRules = SqlHighlightRules;
      this.foldingRules = new SqlFoldMode();
      this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function () {
      this.lineCommentStart = "--";
      this.blockComment = { start: "/*", end: "*/" };
      this.$id = "ace/mode/custom_duckdb_sql";
      this.snippetFileId = "ace/snippets/sql";
    }).call(Mode.prototype);

    exports.Mode = Mode;
  }
);

(function () {
  ace.require(["ace/mode/custom_duckdb_sql"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
