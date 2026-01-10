https://github.com/luvuong-le/code-editor-tutorial/tree/master
https://www.youtube.com/watch?v=uRmEI0RNl2k
https://github.com/mportdata/duckdb-wasm-html-js-simple
https://www.youtube.com/watch?v=08yOFrCj4Pw
https://duckdb.org/2021/10/29/duckdb-wasm#efficient-analytics-in-the-browser


https://ace.c9.io/#nav=embedding
- how was lib/js/ace-editor vendored?
https://github.com/ajaxorg/ace-builds > Releases > v1.5.0 > download "Source code (zip)" > copy and paste src-noconflict folder
- alternative?
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.43.5/src-min-noconflict/ace.min.js"></script>


how was ace-editor configured for duckdb?
- copied src-noconflict/mode-sql.js into new file lib/js/mode-custom_duckdb_sql.js
- added 
ace.config.setModuleUrl("ace/mode/custom_duckdb_sql", "/lib/js/mode-custom_duckdb_sql.js");
to top of editor.js so that ace framework would know where to find mode-custom_duckdb_sql.js 
- codeEditor.session.setMode("ace/mode/custom_duckdb_sql");
- replace all 'ace/mode/sql' with 'ace/mode/custom_duckdb_sql' inside of mode-custom_duckdb_sql.js


To Do:
- create new repo and add to github
- iframe the editor into a blog