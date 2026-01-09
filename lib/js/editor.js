// Setup Ace
let codeEditor = ace.edit("editorCode");
let defaultCode = "SELECT 'hello world';";

let editorLib = {
    init() {
        // Configure Ace

        // Theme
        // codeEditor.setTheme("ace/theme/dreamweaver");

        // Set language
        codeEditor.session.setMode("ace/mode/sql");

        // Set Options
        codeEditor.setOptions({
            fontFamily: 'Inconsolata',
            fontSize: '12pt',
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
        });

        // Set Default Code
        codeEditor.setValue(defaultCode);
    }
}

editorLib.init();