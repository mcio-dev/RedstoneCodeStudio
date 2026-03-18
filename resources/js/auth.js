// 开源版本不包含联网功能

const AuthStore = {
    isLoggedIn: () => false,
    getToken:   () => null,
    getUser:    () => null,
    init:       () => {},
    save:       () => {},
    clear:      () => {},
};

const AuthAPI = {
    login:      async () => ({ success: false, message: '开源版本不包含联网功能' }),
    register:   async () => ({ success: false, message: '开源版本不包含联网功能' }),
    logout:     async () => {},
    securePost: async () => ({ success: false, message: '开源版本不包含联网功能' }),
};

const CryptoLayer = {
    encrypt:      async (obj) => obj,
    decrypt:      async (payload) => payload,
    hashPassword: async (pwd) => pwd,
};

function renderHeaderUser() {
    const area = document.getElementById('auth-header-area');
    if (area) area.innerHTML = '';
}

function openAuthModal() { showStatus('开源版本不包含账户功能'); }
function closeAuthModal() {}
function switchAuthTab() {}
function toggleUserDropdown() {}
function togglePwdVisibility() {}
function checkPasswordStrength() {}
function handleLogin(e) { if (e) e.preventDefault(); }
function handleRegister(e) { if (e) e.preventDefault(); }
function userMenuAction() {}
function authInit() { renderHeaderUser(); }

document.addEventListener('DOMContentLoaded', authInit);