function isValidJavaIdent(s) {
    return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(s);
}

function sanitizeToIdent(s) {
    let r = s.replace(/[^a-zA-Z0-9_$]/g, '');
    if (!r) return 'MyPlugin';
    if (/^[0-9]/.test(r)) r = 'Plugin' + r;
    return r;
}

function setFieldError(input, hint, msg) {
    input.style.borderColor = '#ef4444';
    if (hint) { hint.textContent = msg; hint.classList.remove('hidden'); }
}

function clearFieldError(input, hint) {
    input.style.borderColor = '';
    if (hint) { hint.textContent = ''; hint.classList.add('hidden'); }
}

function getMainClassParts() {
    const raw        = document.getElementById('mainClass')?.value?.trim() || '';
    const pluginName = document.getElementById('pluginName')?.value?.trim() || 'MagicPlugin';

    if (!raw || !raw.includes('.')) {
        return { pkg: 'me.plugin', cls: sanitizeToIdent(pluginName) };
    }

    const parts     = raw.split('.');
    const sanitized = parts.map((p, i) => {
        let s = p.replace(/[^a-zA-Z0-9_$]/g, '');
        if (!s) s = i === parts.length - 1 ? 'Main' : 'pkg';
        if (/^[0-9]/.test(s)) s = (i === parts.length - 1 ? 'Plugin' : 'pkg') + s;
        return s;
    });

    const cls     = sanitized[sanitized.length - 1];
    const clsSafe = cls.charAt(0).toUpperCase() + cls.slice(1);
    sanitized[sanitized.length - 1] = clsSafe;

    return { pkg: sanitized.slice(0, -1).join('.'), cls: clsSafe };
}

function validateMainClass(val) {
    if (!val) return ['主类路径不能为空'];
    const parts = val.split('.');
    if (parts.length < 2) return ['至少需要一个包名，格式：me.yourname.ClassName'];
    const errors = [];
    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (!p) { errors.push('路径中有连续的点'); break; }
        if (!isValidJavaIdent(p)) {
            errors.push(`"${p}" 不是合法的 Java 标识符（不能以数字开头，不能有特殊字符）`);
            break;
        }
        if (i < parts.length - 1 && /^[A-Z]/.test(p)) {
            errors.push(`包名 "${p}" 建议用小写字母`);
        }
    }
    const cls = parts[parts.length - 1];
    if (cls && !/^[A-Z]/.test(cls)) {
        errors.push(`类名 "${cls}" 建议以大写字母开头（当前: ${cls}）`);
    }
    return errors;
}

function onPluginNameInput() {
    const input = document.getElementById('pluginName');
    const hint  = document.getElementById('pluginName-hint');
    const val   = input.value.trim();
    if (!val) {
        setFieldError(input, hint, '插件名不能为空');
    } else if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(val)) {
        setFieldError(input, hint, '只能含字母/数字/连字符，不能以数字开头');
    } else {
        clearFieldError(input, hint);
    }
    syncAllFiles();
}

function onMainClassInput() {
    const input = document.getElementById('mainClass');
    const hint  = document.getElementById('mainClass-hint');
    if (!input) return;
    const val    = input.value.trim();
    const errors = validateMainClass(val);
    if (!val) {
        input.style.borderColor = '';
        if (hint) { hint.textContent = ''; hint.classList.add('hidden'); }
    } else if (errors.length > 0) {
        input.style.borderColor = '#ef4444';
        if (hint) { hint.textContent = errors[0]; hint.classList.remove('hidden'); hint.style.color = '#ef4444'; }
    } else {
        input.style.borderColor = '#22c55e';
        if (hint) { hint.textContent = '格式正确'; hint.classList.remove('hidden'); hint.style.color = '#22c55e'; }
    }
    syncAllFiles();
}

function sanitizePluginName() {
    const input = document.getElementById('pluginName');
    if (!input) return;
    const original = input.value;
    const safe     = original.replace(/[^A-Za-z0-9_\-]/g, '_');
    if (safe !== original) {
        input.value = safe;
        input.style.borderColor = '#f59e0b';
        setTimeout(() => { input.style.borderColor = ''; }, 1500);
    }
}

function syncAllFiles() {
    regenerateAll();
}