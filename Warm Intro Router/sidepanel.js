// sidepanel.js — cleaned & fixed version

const screens = document.querySelectorAll('.screen');
const menuButtons = document.querySelectorAll('.menu-btn');
const backButtons = document.querySelectorAll('.back');
const tabButtons = document.querySelectorAll('.tab-btn');

const nameEl = document.getElementById('input-name');
const emailEl = document.getElementById('input-email');
const companyEl = document.getElementById('input-company');
const tagsEl = document.getElementById('input-tags');
const strengthEl = document.getElementById('input-strength');
const btnAdd = document.getElementById('btn-add');

const csvInput = document.getElementById('csv');
const btnImportCsv = document.getElementById('btn-import-csv');
const csvFilename = document.getElementById('csv-filename');

const contactsBody = document.getElementById('contacts-body');
const tplRow = document.getElementById('row-tpl');

const btnRefreshTarget = document.getElementById('btn-refresh-target');
const targetNameEl = document.getElementById('target-name');
const targetHeadlineEl = document.getElementById('target-headline');
const suggestedList = document.getElementById('suggested-list');
const connectorTpl = document.getElementById('connector-row');
const findNotice = document.getElementById('find-notice'); // optional area to show notices

const askText = document.getElementById('ask-text');
const forwardText = document.getElementById('forward-text');
const btnSend = document.getElementById('btn-send');
const btnCopy = document.getElementById('btn-copy');
const statusSelect = document.getElementById('status-select');

const dashIntros = document.getElementById('dash-intros');
const dashAccepted = document.getElementById('dash-accepted');
const dashDeclined = document.getElementById('dash-declined');
const dashMeetings = document.getElementById('dash-meetings');
const requestsList = document.getElementById('requests-list');

let currentTarget = { name: '', headline: '' };
let lastChosenConnector = null;

// storage helpers
async function loadState() {
  const s = await chrome.storage.local.get(['contacts','intros']);
  return { contacts: s.contacts || [], intros: s.intros || [] };
}
async function saveState(obj) { await chrome.storage.local.set(obj); }

function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

// menu actions
menuButtons.forEach(b => b.addEventListener('click', () => {
  const screen = b.dataset.screen;
  showScreen(screen);
  if (screen === 'find-screen') {
    // show stored suggestions first, then attempt live detection
    loadSuggestedConnectorsFromStorage().then(() => {
      // small delay to avoid double-run if autoDetect triggered elsewhere
      setTimeout(() => autoDetectTargetAndConnector(), 150);
    });
  } else if (screen === 'dashboard-screen') {
    renderDashboardAndRequests();
    initIntroCopyButtons();
  } else if (screen === 'contacts-screen') {
    loadAndRenderContacts();
  }
}));

backButtons.forEach(b => b.addEventListener('click', () => {
  const screen = b.dataset.screen;
  showScreen(screen);
}));

// contacts tab buttons
tabButtons.forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  document.getElementById('tab-' + b.dataset.tab).classList.add('active');
}));

// render contacts
async function loadAndRenderContacts() {
  const s = await loadState();
  renderContacts(s.contacts || []);
}

function renderContacts(contacts=[]) {
  contactsBody.innerHTML = '';
  contacts.forEach((c, i) => {
    const row = tplRow.content.cloneNode(true);
    row.querySelector('.c-name').innerText = c.name || '';
    row.querySelector('.c-email').innerText = c.email || '';
    row.querySelector('.c-company').innerText = c.company || '';
    row.querySelector('.c-tags').innerText = (c.tags || []).join(', ');
    row.querySelector('.c-strength').innerText = c.strength || 0;
    const useBtn = row.querySelector('.use');
    const delBtn = row.querySelector('.del');

    useBtn.addEventListener('click', () => {
      chooseConnector(c, currentTarget);
      showScreen('intro-screen');
    });

    delBtn.addEventListener('click', async () => {
      const s = await loadState();
      s.contacts.splice(i,1);
      await saveState({contacts: s.contacts, intros: s.intros});
      renderContacts(s.contacts);
    });

    contactsBody.appendChild(row);
  });
}

// add manual contact
btnAdd.addEventListener('click', async () => {
  const name = (nameEl.value || '').trim();
  if (!name) { alert('Name is required'); return; }
  const email = (emailEl.value || '').trim();
  const company = (companyEl.value || '').trim();
  const tags = (tagsEl.value || '').split(';').map(s=>s.trim()).filter(Boolean);
  const strength = Number(strengthEl.value || 0);

  const s = await loadState();
  s.contacts.push({ name, email, company, tags, strength });
  await saveState({ contacts: s.contacts, intros: s.intros });
  renderContacts(s.contacts);

  nameEl.value = emailEl.value = companyEl.value = tagsEl.value = '';
  strengthEl.value = '5';
});

// CSV import
btnImportCsv.addEventListener('click', () => csvInput.click());
csvInput.addEventListener('change', async (ev) => {
  const f = ev.target.files[0];
  if (!f) return;
  csvFilename.innerText = f.name;
  const txt = await f.text();
  const lines = txt.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return;
  const header = lines.shift().split(',').map(h=>h.trim().toLowerCase());
  const idx = h => header.indexOf(h);
  const parsed = lines.map(l => {
    const cols = l.split(',');
    return {
      name: cols[idx('name')]?.trim(),
      email: cols[idx('email')]?.trim(),
      company: cols[idx('company')]?.trim(),
      tags: (cols[idx('tags')]||'').split(';').map(s=>s.trim()).filter(Boolean),
      strength: Number(cols[idx('strength')]||0)
    };
  }).filter(Boolean);
  const s = await loadState();
  s.contacts = (s.contacts || []).concat(parsed);
  await saveState({ contacts: s.contacts, intros: s.intros });
  renderContacts(s.contacts);
  ev.target.value = '';
});

// Single request function (cleaned)
function requestVisibleMutuals() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: 'GET_VISIBLE_MUTUALS' }, (resp) => {
      // defensive fallback
      if (chrome.runtime.lastError) {
        console.warn('requestVisibleMutuals runtime.lastError', chrome.runtime.lastError);
        return resolve({ targetName:'', targetHeadline:'', mutuals: [], note: 'error' });
      }
      resolve(resp || { targetName:'', targetHeadline:'', mutuals: [] });
    });
  });
}

// Scoring helpers
function scoreConnector(contact, mutuals = [], targetTags = []) {
  const strength = Number(contact.strength || 0);
  const nameMatch = mutuals.some(m => {
    const lowerM = (m || '').toLowerCase();
    const names = (contact.name || '').toLowerCase().split(/\s+/).filter(Boolean);
    return names.some(n => n && lowerM.includes(n));
  }) ? 20 : 0;
  const tagMatches = (contact.tags || []).filter(t => targetTags.includes(t)).length;
  return strength * 10 + nameMatch + tagMatches * 5;
}

// Auto-detect (single entrypoint)
async function autoDetectTargetAndConnector() {
  suggestedList.innerText = 'Detecting…';
  if (findNotice) { findNotice.innerText = ''; findNotice.style.display = 'none'; }
  try {
    const resp = await requestVisibleMutuals();
    console.log('[sidepanel] GET_VISIBLE_MUTUALS resp=', resp);
    // If user opened the connections page manually, the background will return a note
    if (resp && resp.note === 'manual_connections_page') {
      // show stored suggestions (if any) and notify user
      if (findNotice) {
        findNotice.innerText = "You're on the connections page — detection is disabled to avoid injecting. Click 'Detect' if you want the extension to run extraction here.";
        findNotice.style.display = 'block';
      }
      // attempt to load suggestions from storage
      await loadSuggestedConnectorsFromStorage();
      // don't attempt live injection automatically
      return;
    }

    currentTarget = { name: resp.targetName || '', headline: resp.targetHeadline || '' };
    targetNameEl.innerText = currentTarget.name || '—';
    targetHeadlineEl.innerText = currentTarget.headline || '—';

    const s = await loadState();
    const contacts = s.contacts || [];
    const mutuals = resp.mutuals || [];
    const rawTags = (resp.targetHeadline || '').toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length>2).slice(0,10);

    // score contacts
    const scored = contacts.map(c => ({ contact: c, score: scoreConnector(c, mutuals, rawTags) }))
                           .filter(x => x.score > 0);

    if (scored.length === 0) {
      scored.push(...contacts.filter(c => Number(c.strength||0) > 5).map(c => ({ contact:c, score: Number(c.strength||0)*10 })));
    }

    if (scored.length === 0) {
      suggestedList.innerText = 'No matching connectors found in your contacts.';
      return;
    }

    scored.sort((a,b) => b.score - a.score);
    suggestedList.innerHTML = '';
    scored.forEach(sobj => {
      const node = connectorTpl.content.cloneNode(true);
      node.querySelector('.cname').innerText = sobj.contact.name;
      node.querySelector('.cmeta').innerText = `${sobj.contact.company || ''} • ${ (sobj.contact.tags||[]).join(', ') }`;
      node.querySelector('.score').innerText = `score: ${sobj.score}`;
      node.querySelector('.draft').addEventListener('click', () => {
        lastChosenConnector = sobj.contact;
        chooseConnector(sobj.contact, currentTarget);
        showScreen('intro-screen');
      });
      suggestedList.appendChild(node);
    });

  } catch (err) {
    console.error('[sidepanel] autoDetectTargetAndConnector error', err);
    suggestedList.innerText = 'Detection failed — check console for errors.';
  }
}

// manual choose connector: populate ask & forward
function chooseConnector(contact, target={}) {
  lastChosenConnector = contact;
  const connectorName = contact.name || '[Connector]';
  const connectorCompany = contact.company ? ` (${contact.company})` : '';
  const targetName = target.name || '[Target]';
  const targetHeadline = target.headline ? ` — ${target.headline}` : '';
  const ask = `Hi ${connectorName},\n\nI hope you're doing well. I'd love to ask a quick favor: could you introduce me to ${targetName}${targetHeadline}? I have a brief ask (15 minutes) about [reason]. If you're comfortable, please let me know or feel free to forward a short note. Thank you!`;
  const forwardable = `Hi ${targetName},\n\n${connectorName}${connectorCompany} suggested I reach out. I'm building [one-line description]. Would you be open to a 15-min chat? Thanks!\n\n— [Your Name]`;
  askText.value = ask;
  forwardText.value = forwardable;
}

// Save intro
btnSend.addEventListener('click', async () => {
  const ask = askText.value.trim();
  if (!ask) { alert('Please write the intro message first.'); return; }
  const forward = forwardText.value.trim();
  const status = statusSelect.value || 'Sent';

  const s = await loadState();
  s.intros = s.intros || [];
  s.intros.push({
    target: currentTarget,
    connector: lastChosenConnector || null,
    message: ask,
    forwardable: forward,
    status,
    date: Date.now()
  });
  await saveState({ contacts: s.contacts, intros: s.intros });

  showScreen('dashboard-screen');
  renderDashboardAndRequests();
});

// copy helpers
function showCopyToast(text = 'Copied ✓') {
  const toast = document.getElementById('copy-toast');
  if (!toast) return;
  toast.innerText = text;
  toast.style.display = 'block';
  toast.style.opacity = '1';
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.style.transition = 'opacity 220ms';
    toast.style.opacity = '0';
    setTimeout(()=> { toast.style.display = 'none'; toast.style.transition = ''; }, 240);
  }, 1200);
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (err) {
      document.body.removeChild(ta);
      return false;
    }
  }
}

function initIntroCopyButtons() {
  const copyAskBtn = document.getElementById('copy-ask');
  const copyForwardBtn = document.getElementById('copy-forward');
  const askTa = document.getElementById('ask-text');
  const forwardTa = document.getElementById('forward-text');

  if (copyAskBtn && askTa) {
    copyAskBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const ok = await copyTextToClipboard(askTa.value || '');
      if (ok) { showCopyToast('Ask copied ✓'); askTa.focus(); askTa.setSelectionRange(0, 0); }
      else alert('Copy failed — please copy manually.');
    });
  }

  if (copyForwardBtn && forwardTa) {
    copyForwardBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const ok = await copyTextToClipboard(forwardTa.value || '');
      if (ok) { showCopyToast('Forwardable copied ✓'); forwardTa.focus(); forwardTa.setSelectionRange(0, 0); }
      else alert('Copy failed — please copy manually.');
    });
  }

  const btnCopyOld = document.getElementById('btn-copy');
  if (btnCopyOld) {
    btnCopyOld.addEventListener('click', async () => {
      const text = `${askTa.value}\n\n--- Forwardable ---\n${forwardTa.value}`;
      const ok = await copyTextToClipboard(text);
      if (ok) showCopyToast('Combined copied ✓');
      else alert('Copy failed — please copy manually.');
    });
  }
}

// Dashboard render helpers
async function updateIntroStatus(originalIndex, newStatus) {
  const s = await loadState();
  if (!s.intros || !s.intros[originalIndex]) return;
  s.intros[originalIndex].status = newStatus;
  s.intros[originalIndex].updatedAt = Date.now();
  await saveState({ contacts: s.contacts, intros: s.intros });
  renderDashboardAndRequests();
}

async function renderDashboardAndRequests() {
  const s = await loadState();
  const intros = s.intros || [];
  const totals = { Sent:0, Accepted:0, Declined:0, 'Meeting Booked':0 };
  intros.forEach(it => totals[it.status] = (totals[it.status]||0) + 1);

  dashIntros.innerText = intros.length || 0;
  dashAccepted.innerText = totals.Accepted || 0;
  dashDeclined.innerText = totals.Declined || 0;
  dashMeetings.innerText = totals['Meeting Booked'] || 0;

  requestsList.innerHTML = '';
  const list = intros.slice().reverse();
  list.forEach((r, idx) => {
    const originalIndex = intros.length - 1 - idx;
    const wrap = document.createElement('div'); wrap.className = 'connector-row';
    const left = document.createElement('div'); left.className = 'left';
    const right = document.createElement('div'); right.className = 'right';

    const tName = (r.target && r.target.name) ? r.target.name : '—';
    const connectorName = r.connector?.name || '—';
    const timeStr = new Date(r.date).toLocaleString();

    left.innerHTML = `<strong>${connectorName}</strong>
      <div class="cmeta muted">${tName} • ${timeStr}</div>
      <div class="cmeta muted" style="margin-top:6px">${(r.connector?.company || '')}</div>`;

    const select = document.createElement('select');
    select.className = 'small';
    ['Sent','Accepted','Declined','Meeting Booked'].forEach(opt => {
      const o = document.createElement('option'); o.value = opt; o.innerText = opt;
      if (r.status === opt) o.selected = true;
      select.appendChild(o);
    });
    select.addEventListener('change', (e) => updateIntroStatus(originalIndex, e.target.value));

    const viewBtn = document.createElement('button');
    viewBtn.className = 'small'; viewBtn.innerText = 'View'; viewBtn.style.marginLeft = '8px';
    viewBtn.addEventListener('click', async () => {
      const record = intros[originalIndex];
      lastChosenConnector = record.connector || null;
      currentTarget = record.target || { name:'', headline:'' };
      chooseConnector(record.connector || { name: '[Connector]' }, currentTarget);
      askText.value = record.message || '';
      forwardText.value = record.forwardable || '';
      statusSelect.value = record.status || 'Sent';
      showScreen('intro-screen');
    });

    const rightInner = document.createElement('div');
    rightInner.style.display = 'flex';
    rightInner.style.alignItems = 'center';
    rightInner.style.gap = '8px';
    rightInner.appendChild(select);
    rightInner.appendChild(viewBtn);

    right.appendChild(rightInner);
    wrap.appendChild(left);
    wrap.appendChild(right);
    requestsList.appendChild(wrap);
  });

  normalizeStatusSelectWidths();
}

// Suggested connectors rendering (contacts first, mutual-only below)
function renderSuggestedConnectors(connectors = [], totalMutuals = 0) {
  suggestedList.innerHTML = '';

  const hdr = document.createElement('div');
  hdr.className = 'mutuals-summary muted small';
  hdr.style.marginBottom = '8px';
  hdr.innerText = totalMutuals
    ? `${totalMutuals} mutuals scanned`
    : `Matched ${connectors.filter(c=>c.source==='contact').length} contacts`;
  suggestedList.appendChild(hdr);

  if (!connectors || connectors.length === 0) {
    const empty = document.createElement('div'); empty.className = 'muted';
    empty.innerText = 'No matching connectors found in your contacts.';
    suggestedList.appendChild(empty);
    return;
  }

  connectors.sort((a,b) => {
    if ((a.source||'') === (b.source||'')) return (b.score||0) - (a.score||0);
    if (a.source === 'contact') return -1;
    if (b.source === 'contact') return 1;
    return (b.score||0) - (a.score||0);
  });

  connectors.forEach(c => {
    const node = connectorTpl.content.cloneNode(true);
    const nameEl = node.querySelector('.cname');
    const metaEl = node.querySelector('.cmeta');
    const scoreEl = node.querySelector('.score');
    const btn = node.querySelector('.draft');

    nameEl.innerText = c.name || '—';
    metaEl.innerText = c.source === 'contact' ? `${c.company || ''} • ${(c.tags || []).join(', ')}` : '';
    if (c.source === 'mutual') scoreEl.style.display = 'none';
    else { scoreEl.style.display = ''; scoreEl.innerText = `score: ${c.score || 0}`; }

    btn.addEventListener('click', () => {
      lastChosenConnector = c;
      chooseConnector(c, currentTarget || { name: '', headline: '' });
      showScreen('intro-screen');
    });

    const rowWrap = node.querySelector('.connector-row');
    rowWrap.addEventListener('click', (e) => {
      if (e.target === btn) return;
      lastChosenConnector = c;
      chooseConnector(c, currentTarget || { name: '', headline: '' });
      showScreen('intro-screen');
    });

    suggestedList.appendChild(node);
  });
}

// load stored suggestions and render
async function loadSuggestedConnectorsFromStorage() {
  const s = await chrome.storage.local.get(['suggestedConnectors']);
  const connectors = s.suggestedConnectors || [];
  // note: we don't know totalMutuals from storage — leave 0 (or optionally persist it earlier)
  renderSuggestedConnectors(connectors, connectors._totalMutuals || 0);
}

// measure / normalize select widths (unchanged)
function measureTextWidth(text, font) {
  const span = document.createElement('span');
  span.style.position = 'absolute';
  span.style.visibility = 'hidden';
  span.style.whiteSpace = 'nowrap';
  span.style.font = font || window.getComputedStyle(document.body).font;
  span.textContent = text;
  document.body.appendChild(span);
  const w = span.getBoundingClientRect().width;
  document.body.removeChild(span);
  return w;
}

function normalizeStatusSelectWidths() {
  const selects = Array.from(document.querySelectorAll('#requests-list select'));
  if (!selects.length) return;
  const computed = window.getComputedStyle(selects[0]);
  const font = `${computed.fontSize} ${computed.fontFamily}`;
  let maxPx = 0;
  selects.forEach(sel => {
    Array.from(sel.options).forEach(opt => {
      const w = measureTextWidth(opt.textContent.trim(), font);
      if (w > maxPx) maxPx = w;
    });
  });
  const buffer = 36;
  const finalWidth = Math.ceil(maxPx + buffer);
  selects.forEach(sel => {
    sel.classList.add('requests-status-select');
    sel.style.width = finalWidth + 'px';
  });
}

// Listen for background updates
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || !msg.type) return;
  if (msg.type === 'UPDATE_SUGGESTED_CONNECTORS') {
    const connectors = msg.connectors || [];
    const totalMutuals = msg.totalMutuals || 0;
    // persist for later
    chrome.storage.local.set({ suggestedConnectors: connectors }).catch(()=>{});
    // if visible, re-render now
    const activeScreen = Array.from(document.querySelectorAll('.screen')).find(s => s.classList.contains('active'));
    if (activeScreen && activeScreen.id === 'find-screen') {
      renderSuggestedConnectors(connectors, totalMutuals);
    } else {
      console.log('[sidepanel] Suggested connectors updated (stored).');
    }
  }
});



// init
(function init() {
  showScreen('menu-screen');
  initIntroCopyButtons();
  // If find-screen already active on load, show stored suggestions
  if (document.getElementById('find-screen').classList.contains('active')) {
    loadSuggestedConnectorsFromStorage();
  }
})();
