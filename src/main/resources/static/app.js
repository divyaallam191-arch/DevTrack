const API = 'https://devtrack-production-e6fb.up.railway.app/api/v1/software-engineers';

// ─── STATE ────────────────────────────────────────────
let allDevs      = [];
let filtered     = [];
let currentLevel = null;
let currentLoc   = null;
let searchTerm   = '';
let sortMode     = 0;
let currentPage  = 0;
let PAGE_SIZE    = 6;

const AV_COLORS  = ['av-a', 'av-b', 'av-c', 'av-d', 'av-e'];

// ─── GUARD: redirect to login if no token ─────────────
function requireAuth() {
    const token = localStorage.getItem('dt_token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

// ─── AUTH HEADERS: attach JWT to every request ────────
function getAuthHeaders() {
    const token = localStorage.getItem('dt_token');
    return {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// ─── LOGOUT ───────────────────────────────────────────
function logout() {
    localStorage.removeItem('dt_token');
    localStorage.removeItem('dt_email');
    localStorage.removeItem('dt_role');
    window.location.href = 'login.html';
}

// ─── HANDLE 401 UNAUTHORIZED ──────────────────────────
// If token expired or invalid, redirect to login
function handle401(res) {
    if (res.status === 401 || res.status === 403) {
        showToast('Session expired. Please login again.');
        setTimeout(() => logout(), 1500);
        return true;
    }
    return false;
}

// ─── INIT ─────────────────────────────────────────────
window.onload = function () {
    // 1. Check authentication first
    const token = requireAuth();
    if (!token) return;

    // 2. Show logged in user email in topbar
    const emailEl = document.getElementById('userBadge');
    if (emailEl) {
        emailEl.textContent = localStorage.getItem('dt_email') || '';
    }

    // 3. Restore theme preference
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.body.classList.add('light');
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.classList.add('on');
    }

    // 4. Restore page size preference
    const savedSize = localStorage.getItem('dt_page_size');
    if (savedSize) {
        PAGE_SIZE = parseInt(savedSize);
        const pageSizeSelect = document.getElementById('pageSizeSelect');
        if (pageSizeSelect) pageSizeSelect.value = savedSize;
    }

    // 5. Load all developers
    loadAll();
};

// ─── LOAD ALL DEVELOPERS ──────────────────────────────
async function loadAll() {
    try {
        const res = await fetch(API, {
            headers: getAuthHeaders()   // ✅ JWT token attached
        });

        if (handle401(res)) return;

        const result = await res.json();
        allDevs      = result.data || [];

        applyFilters();
        updateStats();
        updateLocationChips();
        updateAnalytics();

        // Show logged in user email
        const emailEl = document.getElementById('userBadge');
        if (emailEl) {
            emailEl.textContent = localStorage.getItem('dt_email') || '';
        }

    } catch (err) {
        console.error('Failed to load:', err);
        showToast('Could not connect to server');
    }
}

// ─── VIEW SWITCHING ───────────────────────────────────
function showView(view) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => {
        v.style.display = 'none';
    });

    // Remove active from all rail buttons
    document.querySelectorAll('.rb').forEach(b => {
        b.classList.remove('on');
    });

    // Show selected view
    const viewEl = document.getElementById(`view-${view}`);
    if (viewEl) viewEl.style.display = 'block';

    // Activate rail button
    const railBtn = document.getElementById(`rail-${view}`);
    if (railBtn) railBtn.classList.add('on');

    // Update topbar label
    const labels = {
        directory: 'Directory',
        analytics: 'Analytics',
        settings:  'Settings'
    };
    const labelEl = document.getElementById('topbarLabel');
    if (labelEl) labelEl.textContent = labels[view] || 'DevTrack';

    // If switching to analytics, refresh charts
    if (view === 'analytics') updateAnalytics();
}

// ─── FILTER + SORT PIPELINE ───────────────────────────
function applyFilters() {
    let list = [...allDevs];

    // Filter by experience level
    if (currentLevel) {
        list = list.filter(d => d.experience === currentLevel);
    }

    // Filter by location
    if (currentLoc) {
        list = list.filter(d => d.location === currentLoc);
    }

    // Filter by search term
    if (searchTerm) {
        const q = searchTerm.toLowerCase();
        list = list.filter(d =>
            (d.name      || '').toLowerCase().includes(q) ||
            (d.techstack || '').toLowerCase().includes(q) ||
            (d.location  || '').toLowerCase().includes(q)
        );
    }

    // Sort
    list.sort((a, b) => {
        if (sortMode === 0) return (a.name || '').localeCompare(b.name || '');
        if (sortMode === 1) return (b.name || '').localeCompare(a.name || '');
        if (sortMode === 2) return (a.id || 0) - (b.id || 0);
        if (sortMode === 3) return (b.id || 0) - (a.id || 0);
        if (sortMode === 4) {
            const order = { junior: 0, mid: 1, senior: 2 };
            return (order[a.experience] || 0) - (order[b.experience] || 0);
        }
        if (sortMode === 5) {
            const order = { junior: 0, mid: 1, senior: 2 };
            return (order[b.experience] || 0) - (order[a.experience] || 0);
        }
        return 0;
    });

    filtered    = list;
    currentPage = 0;
    renderPage();
}

// ─── SORT DROPDOWN CHANGE ─────────────────────────────
function onSortChange() {
    const select = document.getElementById('sortSelect');
    sortMode     = parseInt(select.value);
    applyFilters();
}

// ─── RENDER CURRENT PAGE ──────────────────────────────
function renderPage() {
    const total      = filtered.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const start      = currentPage * PAGE_SIZE;
    const pageDevs   = filtered.slice(start, start + PAGE_SIZE);

    const countEl = document.getElementById('devCount');
    if (countEl) {
        countEl.textContent = `${total} developer${total !== 1 ? 's' : ''}`;
    }

    renderCards(pageDevs);
    renderPagination(totalPages);

    const empty = document.getElementById('emptyState');
    const grid  = document.getElementById('devGrid');

    if (total === 0) {
        if (empty) empty.style.display = 'flex';
        if (grid)  grid.style.display  = 'none';
    } else {
        if (empty) empty.style.display = 'none';
        if (grid)  grid.style.display  = 'grid';
    }
}

// ─── RENDER CARDS ─────────────────────────────────────
function renderCards(devs) {
    const grid = document.getElementById('devGrid');
    if (!grid) return;

    if (devs.length === 0) {
        grid.innerHTML = '';
        return;
    }

    grid.innerHTML = devs.map((d, i) => {
        const initials = getInitials(d.name || '');
        const avClass  = AV_COLORS[(d.id || 0) % AV_COLORS.length];
        const lvlClass = { junior: 'lj', mid: 'lm', senior: 'ls' }[d.experience] || 'lj';
        const tags     = (d.techstack || '')
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);

        return `
        <div class="dc" style="animation-delay:${i * 0.03}s">
          <div class="dc-top">
            <div class="dc-person">
              <div class="av ${avClass}">${esc(initials)}</div>
              <div>
                <div class="dn">${esc(d.name || '—')}</div>
                <div class="dl">
                  <i class="ti ti-map-pin"></i>
                  ${esc(d.location || '—')}
                </div>
              </div>
            </div>
            <span class="lvl ${lvlClass}">${esc(cap(d.experience || ''))}</span>
          </div>

          <div class="tags">
            ${tags.length > 0
            ? tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')
            : '<span class="tag" style="opacity:0.4">No tags</span>'
        }
          </div>

          <div class="df">
            <span class="de">${esc(d.email || '—')}</span>
            <div class="das">
              <button
                class="ib"
                title="Edit"
                data-id="${d.id}"
                onclick="editDev(this.dataset.id)">
                <i class="ti ti-edit"></i>
              </button>
              <button
                class="ib d"
                title="Delete"
                data-id="${d.id}"
                data-name="${esc(d.name || '')}"
                onclick="deleteDev(this.dataset.id, this.dataset.name)">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </div>
        </div>`;
    }).join('');
}

// ─── RENDER PAGINATION ────────────────────────────────
function renderPagination(totalPages) {
    const el = document.getElementById('pagination');
    if (!el) return;

    if (totalPages <= 1) {
        el.innerHTML = '';
        return;
    }

    let html = '';

    if (currentPage > 0) {
        html += `<button class="pg-btn" onclick="goPage(${currentPage - 1})">
                   <i class="ti ti-chevron-left"></i>
                 </button>`;
    }

    for (let i = 0; i < totalPages; i++) {
        html += `<button class="pg-btn ${i === currentPage ? 'on' : ''}"
                   onclick="goPage(${i})">${i + 1}</button>`;
    }

    if (currentPage < totalPages - 1) {
        html += `<button class="pg-btn" onclick="goPage(${currentPage + 1})">
                   <i class="ti ti-chevron-right"></i>
                 </button>`;
    }

    el.innerHTML = html;
}

function goPage(p) {
    currentPage = Number(p);
    renderPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── UPDATE STATS BAR ─────────────────────────────────
function updateStats() {
    const total     = allDevs.length;
    const juniors   = allDevs.filter(d => d.experience === 'junior').length;
    const mids      = allDevs.filter(d => d.experience === 'mid').length;
    const seniors   = allDevs.filter(d => d.experience === 'senior').length;
    const locations = new Set(allDevs.map(d => d.location).filter(Boolean)).size;
    const stackSet  = new Set(
        allDevs.flatMap(d =>
            (d.techstack || '').split(',').map(t => t.trim()).filter(Boolean)
        )
    );

    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    set('statTotal',     total);
    set('statLocations', locations);
    set('statStacks',    stackSet.size);
    set('statJuniorPct', total > 0 ? Math.round((juniors / total) * 100) + '%' : '0%');
    set('totalChip',     total);
    set('juniorChip',    juniors);
    set('midChip',       mids);
    set('seniorChip',    seniors);
}

// ─── UPDATE LOCATION CHIPS ────────────────────────────
function updateLocationChips() {
    const locs = [...new Set(allDevs.map(d => d.location).filter(Boolean))].sort();
    const el   = document.getElementById('locationChips');
    if (!el) return;

    el.innerHTML = locs.map(loc => `
        <div class="chip ${currentLoc === loc ? 'on' : ''}"
             data-loc="${esc(loc)}"
             onclick="filterByLoc(this.dataset.loc, this)">
          <i class="ti ti-map-pin"></i>${esc(loc)}
        </div>`
    ).join('');
}

// ─── FILTER BY EXPERIENCE LEVEL ───────────────────────
function filterByLevel(level, clickedEl) {
    currentLevel = level;

    document.querySelectorAll('#chipRow > .chip').forEach(c => {
        c.classList.remove('on');
    });
    clickedEl.classList.add('on');

    applyFilters();
    updateLocationChips();
}

// ─── FILTER BY LOCATION ───────────────────────────────
function filterByLoc(loc, clickedEl) {
    if (currentLoc === loc) {
        currentLoc = null;
    } else {
        currentLoc = loc;
    }

    const locChips = document.querySelectorAll('#locationChips .chip');
    locChips.forEach(c => c.classList.remove('on'));

    if (currentLoc) {
        clickedEl.classList.add('on');
    }

    applyFilters();
}

// ─── SEARCH ───────────────────────────────────────────
function handleSearch() {
    searchTerm = document.getElementById('searchInput').value.trim();
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.style.display = searchTerm ? 'flex' : 'none';
    applyFilters();
}

function clearSearch() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    if (input)    input.value           = '';
    if (clearBtn) clearBtn.style.display = 'none';
    searchTerm = '';
    applyFilters();
}

function focusSearch() {
    showView('directory');
    const input = document.getElementById('searchInput');
    if (input) input.focus();
}

// ─── FORM: TOGGLE OPEN / CLOSE ────────────────────────
function toggleForm() {
    const form = document.getElementById('addForm');
    if (!form) return;

    const isVisible = form.style.display !== 'none';
    if (isVisible) {
        cancelForm();
    } else {
        form.style.display = 'block';
        document.getElementById('engineerId').value        = '';
        document.getElementById('formTitle').textContent   = 'New developer';
        document.getElementById('formError').style.display = 'none';
        document.getElementById('name').focus();
    }
}

function cancelForm() {
    const form = document.getElementById('addForm');
    if (form) form.style.display = 'none';
    resetForm();
}

// ─── SAVE — ADD or UPDATE ─────────────────────────────
async function saveEngineer() {
    const id = document.getElementById('engineerId').value.trim();

    const dev = {
        name:       document.getElementById('name').value.trim(),
        email:      document.getElementById('email').value.trim(),
        techstack:  document.getElementById('techstack').value.trim(),
        location:   document.getElementById('location').value.trim(),
        experience: document.getElementById('experience').value
    };

    const errEl = document.getElementById('formError');

    // Frontend validation
    const errors = [];
    if (!dev.name)       errors.push('Name is required');
    if (!dev.email)      errors.push('Email is required');
    if (!dev.techstack)  errors.push('Tech stack is required');
    if (!dev.location)   errors.push('Location is required');
    if (!dev.experience) errors.push('Please select a level');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (dev.email && !emailPattern.test(dev.email)) {
        errors.push('Please enter a valid email address');
    }

    if (errors.length > 0) {
        errEl.textContent   = errors.join(' · ');
        errEl.style.display = 'block';
        return;
    }

    errEl.style.display = 'none';

    try {
        let res;

        if (id) {
            // UPDATE — ✅ JWT token attached
            res = await fetch(`${API}/${id}`, {
                method:  'PUT',
                headers: getAuthHeaders(),
                body:    JSON.stringify(dev)
            });
        } else {
            // CREATE — ✅ JWT token attached
            res = await fetch(API, {
                method:  'POST',
                headers: getAuthHeaders(),
                body:    JSON.stringify(dev)
            });
        }

        if (handle401(res)) return;

        if (res.ok) {
            showToast(id ? `${dev.name} updated` : `${dev.name} added`);
            cancelForm();
            await loadAll();
        } else {
            let msg = 'Something went wrong';
            try {
                const result = await res.json();
                msg = result.message || msg;
            } catch (_) {}
            errEl.textContent   = msg;
            errEl.style.display = 'block';
        }

    } catch (err) {
        console.error('Save error:', err);
        errEl.textContent   = 'Could not connect to server. Is Spring Boot running?';
        errEl.style.display = 'block';
    }
}

// ─── EDIT ─────────────────────────────────────────────
async function editDev(id) {
    try {
        // ✅ JWT token attached
        const res    = await fetch(`${API}/${id}`, { headers: getAuthHeaders() });

        if (handle401(res)) return;

        const result = await res.json();
        const d      = result.data;

        if (!d) {
            showToast('Developer not found');
            return;
        }

        document.getElementById('engineerId').value        = d.id         || '';
        document.getElementById('name').value              = d.name       || '';
        document.getElementById('email').value             = d.email      || '';
        document.getElementById('techstack').value         = d.techstack  || '';
        document.getElementById('location').value          = d.location   || '';
        document.getElementById('experience').value        = d.experience || '';
        document.getElementById('formTitle').textContent   = `Editing — ${d.name}`;
        document.getElementById('formError').style.display = 'none';
        document.getElementById('addForm').style.display   = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        console.error('Edit error:', err);
        showToast('Could not load developer data');
    }
}

// ─── DELETE ───────────────────────────────────────────
async function deleteDev(id, name) {
    if (!confirm(`Remove "${name}" from DevTrack?\nThis cannot be undone.`)) return;

    try {
        // ✅ JWT token attached
        const res = await fetch(`${API}/${id}`, {
            method:  'DELETE',
            headers: getAuthHeaders()
        });

        if (handle401(res)) return;

        if (res.ok) {
            showToast(`${name} removed`);
            await loadAll();
        } else {
            showToast('Failed to delete — please try again');
        }

    } catch (err) {
        console.error('Delete error:', err);
        showToast('Could not connect to server');
    }
}

// ─── RESET FORM ───────────────────────────────────────
function resetForm() {
    const fields = ['engineerId','name','email','techstack','location'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const exp = document.getElementById('experience');
    if (exp) exp.value = '';

    const title = document.getElementById('formTitle');
    if (title) title.textContent = 'New developer';

    const err = document.getElementById('formError');
    if (err) err.style.display = 'none';
}

// ─── ANALYTICS ────────────────────────────────────────
function updateAnalytics() {
    const total   = allDevs.length;
    const juniors = allDevs.filter(d => d.experience === 'junior').length;
    const mids    = allDevs.filter(d => d.experience === 'mid').length;
    const seniors = allDevs.filter(d => d.experience === 'senior').length;
    const locs    = new Set(allDevs.map(d => d.location).filter(Boolean)).size;
    const stacks  = new Set(
        allDevs.flatMap(d =>
            (d.techstack || '').split(',').map(t => t.trim()).filter(Boolean)
        )
    );

    const seniorPct = total > 0 ? Math.round((seniors / total) * 100) + '%' : '0%';

    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    set('an-total',      total);
    set('an-locations',  locs);
    set('an-stacks',     stacks.size);
    set('an-senior-pct', seniorPct);

    // Experience bars
    const expBars = document.getElementById('an-exp-bars');
    if (expBars && total > 0) {
        const levels = [
            { name: 'Junior', count: juniors, fill: 'fill-teal'   },
            { name: 'Mid',    count: mids,    fill: 'fill-amber'  },
            { name: 'Senior', count: seniors, fill: 'fill-purple' }
        ];
        expBars.innerHTML = levels.map(l => `
            <div class="an-bar-row">
              <div class="an-bar-meta">
                <span class="an-bar-name">${l.name}</span>
                <span class="an-bar-count">${l.count} (${Math.round((l.count/total)*100)}%)</span>
              </div>
              <div class="an-bar-track">
                <div class="an-bar-fill ${l.fill}"
                  style="width:${Math.round((l.count/total)*100)}%"></div>
              </div>
            </div>`
        ).join('');
    }

    // Location bars
    const locBars = document.getElementById('an-loc-bars');
    if (locBars && total > 0) {
        const locMap = {};
        allDevs.forEach(d => {
            if (d.location) locMap[d.location] = (locMap[d.location] || 0) + 1;
        });
        const sorted = Object.entries(locMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        const fills = ['fill-blue','fill-teal','fill-amber','fill-purple','fill-coral','fill-blue'];
        locBars.innerHTML = sorted.map(([loc, count], i) => `
            <div class="an-bar-row">
              <div class="an-bar-meta">
                <span class="an-bar-name">${esc(loc)}</span>
                <span class="an-bar-count">${count} dev${count !== 1 ? 's' : ''}</span>
              </div>
              <div class="an-bar-track">
                <div class="an-bar-fill ${fills[i]}"
                  style="width:${Math.round((count/total)*100)}%"></div>
              </div>
            </div>`
        ).join('');
    }

    // Tech stack cloud
    const cloud = document.getElementById('an-stacks-cloud');
    if (cloud) {
        const stackMap = {};
        allDevs.forEach(d => {
            (d.techstack || '').split(',').map(t => t.trim()).filter(Boolean)
                .forEach(t => {
                    stackMap[t] = (stackMap[t] || 0) + 1;
                });
        });
        const sorted = Object.entries(stackMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20);

        cloud.innerHTML = sorted.map(([tag, count]) => `
            <div class="an-tag">
              ${esc(tag)}
              <span class="an-tag-count">${count}</span>
            </div>`
        ).join('');
    }
}

// ─── SETTINGS: THEME TOGGLE ───────────────────────────
function toggleTheme() {
    document.body.classList.toggle('light');
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.classList.toggle('on');

    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// ─── SETTINGS: PAGE SIZE ──────────────────────────────
function onPageSizeChange() {
    const select = document.getElementById('pageSizeSelect');
    if (!select) return;
    PAGE_SIZE   = parseInt(select.value);
    currentPage = 0;
    localStorage.setItem('dt_page_size', PAGE_SIZE);
    renderPage();
    showToast(`Showing ${PAGE_SIZE} cards per page`);
}

// ─── SETTINGS: CLEAR ALL DATA ─────────────────────────
async function clearAllData() {
    if (!confirm('Are you sure you want to delete ALL developers?\nThis cannot be undone.')) return;
    if (!confirm('Really? This will permanently delete everything.')) return;

    let deleted = 0;
    let failed  = 0;

    for (const dev of allDevs) {
        try {
            const res = await fetch(`${API}/${dev.id}`, {
                method:  'DELETE',
                headers: getAuthHeaders()    // ✅ JWT token attached
            });
            if (handle401(res)) return;
            if (res.ok) deleted++;
            else failed++;
        } catch (err) {
            failed++;
        }
    }

    showToast(failed > 0
        ? `Deleted ${deleted}, failed ${failed}`
        : `All ${deleted} developers deleted`
    );

    await loadAll();
}

// ─── TOAST NOTIFICATION ───────────────────────────────
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── HELPER: initials from name ───────────────────────
function getInitials(name) {
    return (name || '')
        .trim()
        .split(/\s+/)
        .map(w => w.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2) || '?';
}

// ─── HELPER: capitalise first letter ──────────────────
function cap(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── HELPER: escape HTML (prevent XSS) ───────────────
function esc(str) {
    return String(str === null || str === undefined ? '' : str)
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#39;');
}