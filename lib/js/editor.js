// https://stackoverflow.com/questions/49559851/how-to-change-the-snippet-path-in-ace-editor
ace.config.setModuleUrl(
  "ace/mode/custom_duckdb_sql",
  "lib/js/mode-custom_duckdb_sql.js"
);

// Setup Ace
let codeEditor = ace.edit("editorCode");

// Default Code
const DEFAULT_CODE = "SELECT 'hello world';";
const iframeName = window.name || "default"; // will be set in parent iframe as name=""
const STORAGE_KEY = `duckdb_editor_code_${iframeName}`;
const hash = new URLSearchParams(location.hash.slice(1));
let defaultCode = hash.get("defaultCode");

// Check localStorage first for persisted code
const storedCode = localStorage.getItem(STORAGE_KEY);
if (storedCode != null) {
  defaultCode = storedCode;
} else if (defaultCode == null) {
  defaultCode = DEFAULT_CODE;
}

// 1. Listen for messages
window.addEventListener("message", (event) => {
  // 2. (Optional but recommended) validate origin
  // if (event.origin !== "https://parent.example.com") return;

  // 3. Extract data
  if (typeof event.data === "string") {
    codeFromParent = event.data;
    codeEditor.setValue(codeFromParent, -1);
    // Persist to localStorage so it survives a refresh
    localStorage.setItem(STORAGE_KEY, codeFromParent);
  }
});

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
