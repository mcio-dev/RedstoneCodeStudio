function filterNodes(query) {
    const q = query.trim().toLowerCase();
    const detailsList = document.querySelectorAll('#node-panel details');

    if (!q) {
        detailsList.forEach((details, index) => {
            details.open = (index === 0);
            details.querySelectorAll('.node-item').forEach(item => { item.style.display = ''; });
        });
        return;
    }

    detailsList.forEach(details => {
        const items = details.querySelectorAll('.node-item');
        let sectionHasMatch = false;
        items.forEach(item => {
            const match = item.textContent.toLowerCase().includes(q);
            item.style.display = match ? '' : 'none';
            if (match) sectionHasMatch = true;
        });
        details.open = sectionHasMatch;
    });
}

function switchTab(tab) {
    // 开源版本不包含联网功能，模板市场相关入口已禁用
    if (tab === 'market') return;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + tab).classList.add('active');

    if (tab === 'logic') {
        setTimeout(() => {
            const c = document.getElementById('blocklyDiv');
            if (litegraphCanvas && c) litegraphCanvas.resize(c.clientWidth, c.clientHeight);
        }, 50);
    }
    if (tab === 'source') {
        Object.values(editors).forEach(e => { if (e) e.resize(); });
    }
}

function switchSrcTab(name) {
    document.querySelectorAll('.src-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('srctab-' + name).classList.add('active');
    document.querySelectorAll('.src-editor-pane').forEach(p => p.classList.remove('active'));
    document.getElementById('pane-' + name).classList.add('active');
    if (editors[name]) { setTimeout(() => editors[name].resize(), 30); }
}

function showStatus(msg) {
    const el = document.getElementById('status');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(showStatus._timer);
    showStatus._timer = setTimeout(() => el.classList.add('hidden'), 5000);
}

function showModalDialog(title, message, type = 'info') {
    const modal = document.getElementById('customModal');
    if (!modal) return;
    const titleEl = modal.querySelector('.modal-title');
    const msgEl   = document.getElementById('modalMessage');
    if (titleEl) titleEl.textContent = title;
    if (msgEl)   msgEl.textContent   = message;
    modal.classList.remove('success', 'error', 'info');
    modal.classList.add(type === 'success' || type === 'error' ? type : 'info');
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('customModal');
    if (modal) modal.classList.add('hidden');
}