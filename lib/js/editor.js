// https://stackoverflow.com/questions/49559851/how-to-change-the-snippet-path-in-ace-editor
ace.config.setModuleUrl(
  "ace/mode/custom_duckdb_sql",
  "../lib/js/mode-custom_duckdb_sql.js"
);

// Setup Ace
let codeEditor = ace.edit("editorCode");
let defaultCode = "SELECT 'hello world';";

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
    });

    // Set Default Code
    codeEditor.setValue(defaultCode);
  },
};

editorLib.init();
