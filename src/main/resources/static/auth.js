const AUTH_URL = 'https://devtrack-production-e6fb.up.railway.app';

// ─── LOGIN ────────────────────────────────────────────
async function login() {
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errEl    = document.getElementById('loginError');

    // Clear previous error
    errEl.style.display = 'none';
    errEl.textContent   = '';

    // Frontend validation
    if (!email || !password) {
        showError(errEl, 'Please enter your email and password');
        return;
    }

    // Disable button while loading
    const btn = document.getElementById('loginBtn');
    btn.disabled     = true;
    btn.innerHTML    = '<i class="ti ti-loader-2 spin"></i> Signing in...';

    try {
        const response = await fetch(`${AUTH_URL}/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email, password })
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error("Invalid server response");
        }

        if (!response.ok) {
            // Show error from backend
            showError(errEl, data.message || 'Invalid email or password');
            resetBtn(btn);
            return;
        }

        // ✅ Save token and user info to localStorage
        localStorage.setItem('dt_token', data.token);
        localStorage.setItem('dt_email', data.email);
        localStorage.setItem('dt_role',  data.role);

        // ✅ Redirect to main app
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Login error:', error);
        showError(errEl, 'Could not connect to server. Is Spring Boot running?');
        resetBtn(btn);
    }
}

// ─── REGISTER ─────────────────────────────────────────
async function register() {
    const name            = document.getElementById('name').value.trim();
    const email           = document.getElementById('email').value.trim();
    const password        = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errEl           = document.getElementById('registerError');
    const successEl       = document.getElementById('registerSuccess');

    // Clear previous messages
    errEl.style.display     = 'none';
    successEl.style.display = 'none';

    // Frontend validation
    if (!name || !email || !password || !confirmPassword) {
        errEl.textContent   = 'Please fill in all fields';
        errEl.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errEl.textContent   = 'Password must be at least 6 characters';
        errEl.style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        errEl.textContent   = 'Passwords do not match';
        errEl.style.display = 'block';
        return;
    }

    // Disable button while loading
    const btn     = document.getElementById('registerBtn');
    btn.disabled  = true;
    btn.innerHTML = '<i class="ti ti-loader-2 spin"></i> Creating account...';

    try {
        const response = await fetch(`${AUTH_URL}/register`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ name, email, password })
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            data = {};
        }

        if (!response.ok) {
            errEl.textContent   = data.message || 'Registration failed';
            errEl.style.display = 'block';
            btn.disabled        = false;
            btn.innerHTML       = '<i class="ti ti-user-plus"></i> Create Account';
            return;
        }

        // ✅ Success — show message then redirect to login
        successEl.textContent   = '✅ Account created! Redirecting to login...';
        successEl.style.display = 'block';
        btn.innerHTML           = '<i class="ti ti-check"></i> Done!';

        setTimeout(() => {
            window.location.href = 'login.html?registered=true';
        }, 1500);

    } catch (error) {
        console.error('Register error:', error);
        errEl.textContent   = 'Could not connect to server. Is Spring Boot running?';
        errEl.style.display = 'block';
        resetBtn(btn, 'register');
    }
}

// ─── LOGOUT ───────────────────────────────────────────
function logout() {
    localStorage.removeItem('dt_token');
    localStorage.removeItem('dt_email');
    localStorage.removeItem('dt_role');
    window.location.href = 'login.html';
}

// ─── GUARD — call this at top of index.html ───────────
// Redirects to login if no token found
function requireAuth() {
    const token = localStorage.getItem('dt_token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

// ─── GET AUTH HEADER — use in every API call ──────────
function getAuthHeaders() {
    const token = localStorage.getItem('dt_token');
    return {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// ─── SHOW SUCCESS MESSAGE ON LOGIN PAGE ───────────────
// Shows "registered successfully" if redirected from register
function checkRegisteredMessage() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === 'true') {
        const msg = document.getElementById('successMsg');
        if (msg) {
            msg.textContent   = '✅ Account created! Please sign in.';
            msg.style.display = 'block';
        }
    }
}

// ─── HELPERS ──────────────────────────────────────────
function showError(el, msg) {
    el.textContent   = msg;
    el.style.display = 'block';
}

function resetBtn(btn, type = 'login') {
    btn.disabled  = false;
    btn.innerHTML = type === 'login'
        ? '<i class="ti ti-login"></i> Sign In'
        : '<i class="ti ti-user-plus"></i> Create Account';
}

// ─── AUTO-RUN ─────────────────────────────────────────
window.onload = checkRegisteredMessage;