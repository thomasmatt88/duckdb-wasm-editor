// https://stackoverflow.com/questions/49559851/how-to-change-the-snippet-path-in-ace-editor
ace.config.setModuleUrl(
  "ace/mode/custom_duckdb_sql",
  "lib/js/mode-custom_duckdb_sql.js"
);

// Setup Ace
let codeEditor = ace.edit("editorCode");
const DEFAULT_CODE = "SELECT 'hello world';";

const hash = new URLSearchParams(location.hash.slice(1));
let defaultCode = hash.get("defaultCode");
if (defaultCode == null) {
  defaultCode = DEFAULT_CODE;
}

let editorLib = {
  init() {
    // Configure Ace

    // Theme
    // codeEditor.setTheme("ace/theme/dreamweaver");

    // Set language
    //codeEditor.session.setMode("ace/mode/sql");
    codeEditor.session.setMode("ace/mode/custom_duckdb_sql");

    // Set Options
    codeEditor.setOptions({
      fontFamily: "Inconsolata",
      fontSize: "12pt",
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      showPrintMargin: false, // https://stackoverflow.com/questions/14907184/is-there-a-way-to-hide-the-vertical-ruler-in-ace-editor
    });

    // Set Default Code
    codeEditor.setValue(defaultCode);
    codeEditor.clearSelection(1); // https://stackoverflow.com/questions/20111668/ace-editor-loaded-script-is-highlighted-by-default
  },
};

editorLib.init();
