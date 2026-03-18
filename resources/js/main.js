document.addEventListener('DOMContentLoaded', function () {

    function initEditor(id, mode, readOnly) {
        const e = ace.edit(id);
        e.setTheme("ace/theme/monokai");
        e.session.setMode("ace/mode/" + mode);
        e.setReadOnly(!!readOnly);
        e.setShowPrintMargin(false);
        e.setOptions({ fontSize: "13px", tabSize: 4, useSoftTabs: true });
        return e;
    }

    editors.java = initEditor("editor-java", "java",  false);
    editors.yml  = initEditor("editor-yml",  "yaml",  false);
    editors.cfg  = initEditor("editor-cfg",  "yaml",  false);
    editors.pom  = initEditor("editor-pom",  "xml",   false);

    configEntries = [];
    renderConfigEntries();

    document.getElementById('pluginName').value  = 'MagicPlugin';
    document.getElementById('mainClass').value   = 'me.yourname.myplugin.Main';
    document.getElementById('groupId').value     = 'me.yourname';
    document.getElementById('artifactId').value  = 'magicplugin';

    onPluginNameInput();
    onMainClassInput();

    function waitLG() {
        if (typeof LiteGraph !== 'undefined') initLiteGraph();
        else setTimeout(waitLG, 100);
    }
    waitLG();
});