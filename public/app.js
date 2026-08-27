const API = '/api';

// =============================================
// State
// =============================================
let automobiles = [];
let drivers = [];
let usages = [];

// =============================================
// DOM Elements
// =============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const autoList = $('#auto-list');
const driverList = $('#driver-list');
const usageActiveList = $('#usage-active-list');
const usageHistoryList = $('#usage-history-list');

// =============================================
// Toast Notification
// =============================================
function showToast(message, type = 'success') {
    const toast = $('#toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => { toast.className = 'toast'; }, 3500);
}

// =============================================
// Confirmation Modal
// =============================================
function confirmAction(title, message) {
    return new Promise((resolve) => {
        $('#confirm-title').textContent = title;
        $('#confirm-message').textContent = message;
        $('#confirm-modal').style.display = 'flex';

        const cleanup = () => { $('#confirm-modal').style.display = 'none'; };

        $('#confirm-ok').onclick = () => { cleanup(); resolve(true); };
        $('#confirm-cancel').onclick = () => { cleanup(); resolve(false); };
    });
}

// =============================================
// API Client
// =============================================
async function api(endpoint, options = {}) {
    try {
        const res = await fetch(`${API}${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });

        if (res.status === 204) return null;

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Erro desconhecido');

        return json.data !== undefined ? json.data : json;
    } catch (err) {
        showToast(err.message, 'error');
        throw err;
    }
}

// =============================================
// Load All Data
// =============================================
async function loadData() {
    try {
        const [autoRes, driverRes, usageRes] = await Promise.all([
            api('/automobiles?limit=100'),
            api('/drivers?limit=100'),
            api('/usages?limit=100'),
        ]);

        // Paginated responses return { data, meta }
        automobiles = autoRes.data || autoRes;
        drivers = driverRes.data || driverRes;
        usages = usageRes.data || usageRes;

        render();
    } catch (e) {
        console.error('Falha ao carregar dados', e);
    }
}

// =============================================
// Master Render
// =============================================
function render() {
    renderSummary();
    renderAutomobiles();
    renderDrivers();
    renderUsages();
    updateSelects();
}

// =============================================
// Summary Cards
// =============================================
function renderSummary() {
    const active = usages.filter((u) => !u.endDate);
    const finished = usages.filter((u) => u.endDate);

    $('#count-autos').textContent = automobiles.length;
    $('#count-drivers').textContent = drivers.length;
    $('#count-active').textContent = active.length;
    $('#count-finished').textContent = finished.length;
}

// =============================================
// Automobiles
// =============================================
function renderAutomobiles() {
    if (automobiles.length === 0) {
        autoList.innerHTML = '<div class="empty-state">Nenhum automóvel cadastrado.</div>';
        return;
    }

    autoList.innerHTML = automobiles.map((a) => `
        <div class="list-item">
            <div class="info">
                <h4>${a.licensePlate} <span class="badge badge-brand">${a.brand}</span></h4>
                <p>Cor: ${a.color}</p>
            </div>
            <div class="actions">
                <button class="btn-sm btn-edit" onclick="editAuto('${a.id}')">Editar</button>
                <button class="btn-sm btn-delete" onclick="deleteAuto('${a.id}', '${a.licensePlate}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

// =============================================
// Drivers
// =============================================
function renderDrivers() {
    if (drivers.length === 0) {
        driverList.innerHTML = '<div class="empty-state">Nenhum motorista cadastrado.</div>';
        return;
    }

    driverList.innerHTML = drivers.map((d) => `
        <div class="list-item">
            <div class="info">
                <h4>${d.name}</h4>
                <p>ID: ${d.id.substring(0, 8)}…</p>
            </div>
            <div class="actions">
                <button class="btn-sm btn-edit" onclick="editDriver('${d.id}')">Editar</button>
                <button class="btn-sm btn-delete" onclick="deleteDriver('${d.id}', '${d.name}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

// =============================================
// Usages (Active + History)
// =============================================
function renderUsages() {
    const active = usages.filter((u) => !u.endDate);
    const finished = usages.filter((u) => u.endDate);

    // Active
    if (active.length === 0) {
        usageActiveList.innerHTML = '<div class="empty-state">Nenhum veículo em uso no momento.</div>';
    } else {
        usageActiveList.innerHTML = active.map((u) => `
            <div class="list-item active-usage">
                <div class="info">
                    <h4>${u.driver?.name || 'Motorista'} <span class="badge badge-active">Em uso</span></h4>
                    <p>${u.automobile?.licensePlate || 'Veículo'} (${u.automobile?.brand || ''}) — ${u.reason}</p>
                    <p style="font-size: 0.75rem; margin-top: 2px;">Início: ${formatDate(u.startDate)}</p>
                </div>
                <div class="actions">
                    <button class="btn-sm btn-finish" onclick="finishUsage('${u.id}')">Finalizar</button>
                </div>
            </div>
        `).join('');
    }

    // History
    if (finished.length === 0) {
        usageHistoryList.innerHTML = '<div class="empty-state">Nenhuma utilização finalizada ainda.</div>';
    } else {
        usageHistoryList.innerHTML = finished.map((u) => `
            <div class="list-item finished-usage">
                <div class="info">
                    <h4>${u.driver?.name || 'Motorista'} <span class="badge badge-finished">Finalizado</span></h4>
                    <p>${u.automobile?.licensePlate || 'Veículo'} (${u.automobile?.brand || ''}) — ${u.reason}</p>
                    <p style="font-size: 0.75rem; margin-top: 2px;">${formatDate(u.startDate)} → ${formatDate(u.endDate)}</p>
                </div>
            </div>
        `).join('');
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// =============================================
// Update Selects (smart: disable in-use items)
// =============================================
function updateSelects() {
    const activeDriverIds = usages.filter((u) => !u.endDate).map((u) => u.driverId);
    const activeAutoIds = usages.filter((u) => !u.endDate).map((u) => u.automobileId);

    $('#usage-driver').innerHTML =
        '<option value="">Selecione o Motorista...</option>' +
        drivers.map((d) => {
            const inUse = activeDriverIds.includes(d.id);
            return `<option value="${d.id}" ${inUse ? 'disabled' : ''}>${d.name}${inUse ? ' (em uso)' : ''}</option>`;
        }).join('');

    $('#usage-auto').innerHTML =
        '<option value="">Selecione o Automóvel...</option>' +
        automobiles.map((a) => {
            const inUse = activeAutoIds.includes(a.id);
            return `<option value="${a.id}" ${inUse ? 'disabled' : ''}>${a.licensePlate} — ${a.brand}${inUse ? ' (em uso)' : ''}</option>`;
        }).join('');
}

// =============================================
// Toggle Forms
// =============================================
function setupToggle(btnId, formId, cancelId, resetFn) {
    $(btnId).addEventListener('click', () => {
        const form = $(formId);
        form.classList.toggle('collapsed');
    });
    if (cancelId) {
        $(cancelId).addEventListener('click', () => {
            $(formId).classList.add('collapsed');
            if (resetFn) resetFn();
        });
    }
}

setupToggle('#toggle-auto-form', '#auto-form', '#auto-cancel-btn', resetAutoForm);
setupToggle('#toggle-driver-form', '#driver-form', '#driver-cancel-btn', resetDriverForm);
setupToggle('#toggle-usage-form', '#usage-form');

// =============================================
// Automobile CRUD
// =============================================
$('#auto-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = $('#auto-edit-id').value;

    const payload = {
        color: $('#auto-color').value,
        brand: $('#auto-brand').value,
    };

    try {
        if (editId) {
            await api(`/automobiles/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
            showToast('Automóvel atualizado!');
        } else {
            payload.licensePlate = $('#auto-plate').value;
            await api('/automobiles', { method: 'POST', body: JSON.stringify(payload) });
            showToast('Automóvel cadastrado!');
        }
        resetAutoForm();
        loadData();
    } catch (_) { /* toast já tratou */ }
});

function editAuto(id) {
    const auto = automobiles.find((a) => a.id === id);
    if (!auto) return;

    $('#auto-edit-id').value = auto.id;
    $('#auto-plate').value = auto.licensePlate;
    $('#auto-plate').disabled = true;
    $('#auto-color').value = auto.color;
    $('#auto-brand').value = auto.brand;
    $('#auto-submit-btn').textContent = 'Salvar';
    $('#auto-cancel-btn').style.display = 'block';
    $('#auto-form').classList.remove('collapsed');
}

function resetAutoForm() {
    $('#auto-form').reset();
    $('#auto-edit-id').value = '';
    $('#auto-plate').disabled = false;
    $('#auto-submit-btn').textContent = 'Cadastrar';
    $('#auto-cancel-btn').style.display = 'none';
    $('#auto-form').classList.add('collapsed');
}

async function deleteAuto(id, plate) {
    const ok = await confirmAction('Excluir Automóvel', `Tem certeza que deseja excluir o veículo ${plate}?`);
    if (!ok) return;

    try {
        await api(`/automobiles/${id}`, { method: 'DELETE' });
        showToast('Automóvel excluído!');
        loadData();
    } catch (_) { /* toast já tratou */ }
}

// =============================================
// Driver CRUD
// =============================================
$('#driver-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const editId = $('#driver-edit-id').value;
    const payload = { name: $('#driver-name').value };

    try {
        if (editId) {
            await api(`/drivers/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
            showToast('Motorista atualizado!');
        } else {
            await api('/drivers', { method: 'POST', body: JSON.stringify(payload) });
            showToast('Motorista cadastrado!');
        }
        resetDriverForm();
        loadData();
    } catch (_) { /* toast já tratou */ }
});

function editDriver(id) {
    const driver = drivers.find((d) => d.id === id);
    if (!driver) return;

    $('#driver-edit-id').value = driver.id;
    $('#driver-name').value = driver.name;
    $('#driver-submit-btn').textContent = 'Salvar';
    $('#driver-cancel-btn').style.display = 'block';
    $('#driver-form').classList.remove('collapsed');
}

function resetDriverForm() {
    $('#driver-form').reset();
    $('#driver-edit-id').value = '';
    $('#driver-submit-btn').textContent = 'Cadastrar';
    $('#driver-cancel-btn').style.display = 'none';
    $('#driver-form').classList.add('collapsed');
}

async function deleteDriver(id, name) {
    const ok = await confirmAction('Excluir Motorista', `Tem certeza que deseja excluir ${name}?`);
    if (!ok) return;

    try {
        await api(`/drivers/${id}`, { method: 'DELETE' });
        showToast('Motorista excluído!');
        loadData();
    } catch (_) { /* toast já tratou */ }
}

// =============================================
// Usage Actions
// =============================================
$('#usage-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        driverId: $('#usage-driver').value,
        automobileId: $('#usage-auto').value,
        reason: $('#usage-reason').value,
    };

    try {
        await api('/usages', { method: 'POST', body: JSON.stringify(payload) });
        showToast('Utilização iniciada!');
        $('#usage-form').reset();
        $('#usage-form').classList.add('collapsed');
        loadData();
    } catch (_) { /* toast já tratou */ }
});

async function finishUsage(id) {
    try {
        await api(`/usages/${id}/finish`, { method: 'PATCH' });
        showToast('Utilização finalizada!');
        loadData();
    } catch (_) { /* toast já tratou */ }
}

// =============================================
// Tabs (Active / History)
// =============================================
$$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
        $$('.tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        if (target === 'active') {
            usageActiveList.style.display = 'flex';
            usageHistoryList.style.display = 'none';
        } else {
            usageActiveList.style.display = 'none';
            usageHistoryList.style.display = 'flex';
        }
    });
});

// =============================================
// Init
// =============================================
loadData();
