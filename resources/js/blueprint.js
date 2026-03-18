function exportBlueprint() {
    if (!litegraphGraph) { alert("节点图尚未初始化，请稍后再试。"); return; }

    const graphData = litegraphGraph.serialize();
    const fields = [
        'pluginName', 'mainClass', 'pluginVersion', 'apiVersion',
        'loadTime', 'author', 'website', 'description', 'softDepend',
        'groupId', 'artifactId', 'javaVersion', 'spigotVersion'
    ];
    const formData = {};
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) formData[id] = el.value;
    });

    const blueprint = {
        _format:  "mcbp",
        _version: "1.0",
        _created: new Date().toISOString(),
        _app:     "RedstoneCode Studio",
        form:     formData,
        config:   JSON.parse(JSON.stringify(configEntries)),
        graph:    graphData,
    };

    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const name = (formData.pluginName || 'blueprint').replace(/[^a-zA-Z0-9_-]/g, '_');
    a.href     = url;
    a.download = name + ".mcbp";
    a.click();
    URL.revokeObjectURL(url);
    showStatus("蓝图已导出：" + name + ".mcbp");
}

function importBlueprint(inputEl) {
    const file = inputEl.files[0];
    if (!file) return;
    inputEl.value = '';

    const reader = new FileReader();
    reader.onload = function (e) {
        let blueprint;
        try {
            blueprint = JSON.parse(e.target.result);
        } catch (err) {
            alert("文件解析失败，请确认这是有效的 .mcbp 蓝图文件。\n错误：" + err.message);
            return;
        }

        if (blueprint._format !== "mcbp") {
            if (!confirm("此文件不是标准 .mcbp 格式，仍然尝试导入？")) return;
        }

        if (blueprint.form) {
            Object.entries(blueprint.form).forEach(([id, val]) => {
                const el = document.getElementById(id);
                if (el) el.value = val;
            });
        }

        if (Array.isArray(blueprint.config)) {
            configEntries = blueprint.config;
            renderConfigEntries();
        }

        if (blueprint.graph && litegraphGraph) {
            try {
                litegraphGraph.configure(blueprint.graph);
            } catch (err) {
                alert("节点图恢复时出现问题（部分节点可能无法显示）：\n" + err.message);
            }
        }

        regenerateAll();
        if (typeof onPluginNameInput === 'function') onPluginNameInput();
        if (typeof onMainClassInput  === 'function') onMainClassInput();

        switchTab('logic');
        setTimeout(() => {
            if (litegraphCanvas) {
                const c = document.getElementById('blocklyDiv');
                litegraphCanvas.resize(c.clientWidth, c.clientHeight);
                litegraphCanvas.ds.reset();
                litegraphCanvas.setDirty(true, true);
            }
        }, 100);

        showStatus("已成功导入蓝图：" + (blueprint.form?.pluginName || file.name));
    };
    reader.readAsText(file, 'utf-8');
}