function fmtDT(d) { const [a, b] = d.split(' '); const [y, m, dd] = a.split('-'); return `${dd}/${m}/${y} ${b}`; }
function avatar(n, i) { const ini = n.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase(); return `<span class="av a${(i % 5) + 1}">${ini}</span>`; }
function rUsers() {
  libTable('users', '#tUsers', [
    { key: 'n', label: 'Member', type: 'search', get: u => u.n + ' ' + u.e },
    { key: 'r', label: 'Role', type: 'filter', get: u => u.r },
    { key: 'last', label: 'Last activity', type: 'sort', get: u => u.last }, { key: 'rupd', label: 'Role updated', type: 'sort', get: u => u.rupd || '' },
    { key: 'on', label: 'Status', type: 'filter', get: u => u.on ? 'Active' : 'Inactive' }],
    USERS, u => {
      const i = USERS.indexOf(u), opts = ROLES.map(x => `<option ${x.n === u.r ? 'selected' : ''}>${esc(x.n)}</option>`).join(''), info = idleInfo(u); return `<tr class="${info.flag ? 'flag-row' : ''}">
  <td><div class="member ${u.on ? '' : 'off'}">${avatar(u.n, i)}<div><b>${esc(u.n)}</b><small>${esc(u.e)}</small></div></div></td>
  <td><select class="rolesel" ${u.n === 'Nurul Hassan' ? 'disabled' : ''} onchange="setUserRole(${i},this.value)">${opts}</select></td>
  <td class="${info.flag ? '' : 'dim'}" style="font-variant-numeric:tabular-nums${info.flag ? ';color:var(--bad);font-weight:600' : ''}"${info.tip ? ` title="${esc(info.tip)}"` : ''}>${fmtD(new Date(u.last + 'T00:00:00'))}${u.last === now().slice(0, 10) ? ' <span class="pill p-good">Today</span>' : ''}</td>
  <td class="dim" style="font-variant-numeric:tabular-nums">${u.rupd ? fmtDT(u.rupd) : '—'}</td>
  <td><input type="checkbox" class="sw g" ${u.on ? 'checked' : ''} ${u.n === 'Nurul Hassan' ? 'disabled' : ''} onchange="setUserOn(${i},this.checked)" aria-label="Active"></td>
  <td class="actc">${u.n === 'Nurul Hassan' ? '' : `<button class="ib del" title="Delete user" onclick="confirmDel(${i})">${SVG.del}</button>`}</td></tr>`;
    });
}
function now() { const d = new Date(); const z = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`; }
function setUserRole(i, r) { const u = USERS[i]; u.rupd = now(); AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Role change', tg: u.n, d: `${u.r} → ${r}` }); u.r = r; u.upd = now(); toast('Role saved'); rUsers(); }
function setUserOn(i, on) { const u = USERS[i]; u.on = on; u.upd = now(); if (on) { u.lapsed = null; u.last = now().slice(0, 10); } AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: on ? 'Reactivate' : 'Deactivate', tg: u.n, d: on ? 'Inactive → Active' : 'Active → Inactive' }); toast(on ? 'User activated' : 'User deactivated'); rUsers(); }
function confirmDel(i) { const u = USERS[i]; if (!u || u.n === 'Nurul Hassan') { toast('You cannot delete your own account'); return; } $('#cfTitle').textContent = 'Delete ' + u.n + '?'; $('#cfText').textContent = 'They lose access immediately. Their audit history is kept.'; $('#cfOk').onclick = () => { USERS.splice(i, 1); AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Delete', tg: u.n, d: 'User removed' }); $('#m-confirm').hidden = true; toast(u.n + ' deleted'); rUsers(); }; $('#m-confirm').hidden = false; }
function openInvite() { $('#invEmail').value = ''; $('#invRole').innerHTML = ROLES.map(r => `<option>${esc(r.n)}</option>`).join(''); $('#invRole').value = 'HR User'; $('#m-invite').hidden = false; setTimeout(() => $('#invEmail').focus(), 0); }
function sendInvite() {
  const e = $('#invEmail').value.trim(); if (!e) { toast('Email is required'); return; }
  const n = e.split('@')[0].split(/[._-]+/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ') || e;
  USERS.push({ n, e, r: $('#invRole').value, on: true, upd: now(), last: now().slice(0, 10), rupd: now() }); AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Add user', tg: n, d: '— → ' + $('#invRole').value }); $('#m-invite').hidden = true; toast('User added: ' + n); rUsers();
}

/* roles */
let EDIT = null;
function openRoles() { $('#rQ').value = ''; rRoles(); $('#m-roles').hidden = false; }
function rRoles() {
  const q = ($('#rQ').value || '').toLowerCase(); const rows = ROLES.filter(r => r.n.toLowerCase().includes(q));
  $('#tRoles').innerHTML = '<tr><th>Role</th><th class="num">Members</th><th>Journeys</th><th style="text-align:right">Actions</th></tr>' + rows.map(r => {
    const m = USERS.filter(u => u.r === r.n && u.on).length, i = ROLES.indexOf(r);
    return `<tr><td class="rolename">${esc(r.n)}${r.locked ? ' <span class="pill p-dim">Default</span>' : ''}</td><td class="num mono">${m}</td><td class="dim">${r.p.filter(Boolean).length} of ${JOURNEYS.length}</td><td class="actc" style="text-align:right"><button class="ib" title="Edit" onclick="openRoleForm(${i})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>${!r.locked && !m ? `<button class="ib del" title="Delete" onclick="delRole(${i})">${SVG.del}</button>` : ''}</td></tr>`;
  }).join('');
  $('#rRange').textContent = `1–${rows.length} of ${rows.length}`;
}
function openRoleForm(i) {
  EDIT = i == null ? null : ROLES[i]; const r = EDIT || { n: '', p: JOURNEYS.map(() => 0) };
  $('#roleFormTitle').textContent = EDIT ? 'Edit role' : 'Create role'; $('#roleName').value = r.n; $('#roleName').disabled = !!(EDIT && EDIT.locked);
  $('#permList').innerHTML = JOURNEYS.map((j, k) => `<label class="perm"><span>${j[0]}<small>${j[1]}</small></span><input type="checkbox" class="sw g" data-k="${k}" ${r.p[k] ? 'checked' : ''} ${EDIT && EDIT.locked ? 'disabled' : ''}></label>`).join('');
  $('#m-role').hidden = false; if (!EDIT) setTimeout(() => $('#roleName').focus(), 0);
}
function saveRole() {
  const n = $('#roleName').value.trim(); if (!n) { toast('Role name is required'); return; }
  const p = JOURNEYS.map((_, k) => $(`#permList input[data-k="${k}"]`).checked ? 1 : 0);
  if (EDIT) { if (!EDIT.locked) { USERS.forEach(u => { if (u.r === EDIT.n) u.r = n; }); EDIT.n = n; EDIT.p = p; } AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Role change', tg: 'Role ' + n, d: 'Permissions updated' }); toast('Role saved'); }
  else { if (ROLES.some(r => r.n.toLowerCase() === n.toLowerCase())) { toast('A role with that name exists'); return; } ROLES.push({ n, p }); AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Role change', tg: 'Role ' + n, d: '— → Created' }); toast('Role created'); }
  $('#m-role').hidden = true; rRoles(); rUsers(); applyRole();
}
function delRole(i) { const r = ROLES.splice(i, 1)[0]; AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Role change', tg: 'Role ' + r.n, d: 'Deleted' }); toast('Role deleted'); rRoles(); rUsers(); applyRole(); }
function auditDate(t) {
  if (t === 'Just now') return new Date(); let m = t.match(/^(\d{2})\/(\d{2})\/(\d{4})/); if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  m = t.match(/^(\d{1,2}) (\w{3})(?: (\d{2}):(\d{2}))?/); if (m) { const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(m[2]); return new Date(2026, mo, +m[1], +(m[3] || 0), +(m[4] || 0)); } return new Date();
}
function auditISO(t) { const d = auditDate(t); const z = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`; }
function auditType(x) {
  const tg = x.tg || ''; if (x.a === 'Sign-in') return 'Account'; if (x.a === 'Setting') return 'Settings';
  if (['Role change', 'Invite', 'Add user', 'Deactivate', 'Reactivate', 'Reopen'].includes(x.a) && !tg.startsWith('RV-')) return 'Users & roles';
  if (tg.startsWith('JOB-')) { const j = JOBS.find(j => tg.startsWith(j.ref)); return j ? { 'Competency framework': 'Frameworks', 'Competency assessment': 'Assessments', 'Training catalog': 'Catalog', 'Learning records': 'Records' }[j.type] : 'Records'; }
  if (tg.startsWith('RV-')) { if (tg.includes('Catalog tag')) return 'Catalog'; if (tg.includes('Assessment')) return 'Assessments'; return 'Records'; }
  if (/^FW /.test(tg)) return 'Frameworks'; if (/^ASSESS /.test(tg) || /^Assessment /.test(tg)) return 'Assessments'; if (/^CAT /.test(tg)) return 'Catalog'; if (/^REC /.test(tg)) return 'Records';
  if (x.a === 'Delete') return 'Users & roles'; return 'Records';
}
function rAudit() {
  if (!LIB.audit) LIB.audit = { f: {}, sort: { col: 't', dir: -1 }, page: 1 };
  libTable('audit', '#tAudit', [
    { key: 't', label: 'When', type: 'date', get: x => auditISO(x.t) }, { key: 'u', label: 'User', type: 'filter', get: x => x.u }, { key: 'a', label: 'Action', type: 'filter', get: x => x.a },
    { key: 'ty', label: 'Data type', type: 'filter', get: x => auditType(x) }, { key: 'tg', label: 'Target', type: 'search', get: x => x.tg + ' ' + x.d }, { key: 'd', label: 'Before → after', type: '', get: x => x.d }],
    AUDIT, x => `<tr><td class="dim" style="white-space:nowrap">${x.t}</td><td>${x.u}</td><td>${x.a}</td><td><span class="pill p-dim">${auditType(x)}</span></td><td>${esc(x.tg)}</td><td class="dim">${esc(x.d)}</td></tr>`, { noAct: true, empty: 'No events match.' });
}

/* ---------- NAV / ROLE ---------- */
const TITLES = { dash: 'Dashboard', fw: 'Frameworks', fwcards: 'Frameworks', assess: 'Assessments', catalog: 'Catalog', records: 'Records', upload: 'Upload', jobs: 'Recent uploads', users: 'Users', audit: 'Audit log', settings: 'Settings' };
const RENDER = { dash: rDash, fw: rFw, fwcards: rFwCards, assess: rAssess, catalog: rCat, records: rRec, upload: rUploadAll, jobs: rJobsPage, users: rUsers, audit: rAudit, settings: rSettings };
function dlBlob(content, mime, filename) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
function exportDashSummaryCsv() {
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const ver = verOn(FWDATE), fwRows = ver ? FW.filter(x => x.hist.some(h => h.v === ver.v)) : [];
  const atFw = x => x.hist.find(h => h.v === (ROWVER[x._id] || ver.v)) || x.hist.find(h => h.v === ver.v);
  const isFlag = (c, ch) => isCourseFlagged(c, ch);
  const fwActive = fwRows.filter(x => fwDisplayStatus(x, atFw(x)) === 'Active').length;
  const fwInactive = fwRows.length - fwActive;
  const linkedIds = new Set(fwRows.flatMap(x => fwCourses(x, atFw(x)).map(c => c._id)));
  const linkedCats = CAT.filter(c => linkedIds.has(c._id));
  const catFlag = linkedCats.filter(c => isFlag(c, catAt(c))).length;
  const avgConf = linkedCats.length ? Math.round(linkedCats.reduce((s, c) => s + (catAt(c).conf || 0), 0) / linkedCats.length) : 0;
  const recDone = REC.filter(r => r.st === 'Completed').length, recInProg = REC.filter(r => r.st === 'In progress').length;
  const totHrs = Math.round(REC.reduce((s, r) => s + r.h, 0) * 10) / 10;
  const assExc = ASSESS.filter(a => a.rating === 'Exceeding').length, assMeet = ASSESS.filter(a => a.rating === 'Meeting').length, assBelow = ASSESS.filter(a => a.rating === 'Below').length;
  const rows = [
    ['Section', 'Metric', 'Value'],
    ['Competency Frameworks', 'Total Frameworks', fwRows.length],
    ['Competency Frameworks', 'Active Frameworks', fwActive],
    ['Competency Frameworks', 'Inactive Frameworks', fwInactive],
    ['Linked Courses', 'Total Linked Courses', linkedCats.length],
    ['Linked Courses', 'Healthy Courses', linkedCats.length - catFlag],
    ['Linked Courses', 'Flagged Courses', catFlag],
    ['Linked Courses', 'Average AI Confidence', avgConf + '%'],
    ['Learning Records', 'Total Records', REC.length],
    ['Learning Records', 'Completed', recDone],
    ['Learning Records', 'In progress', recInProg],
    ['Learning Records', 'Total Training Hours', totHrs],
    ['Staff Assessments', 'Total Assessments', ASSESS.length],
    ['Staff Assessments', 'Exceeding', assExc],
    ['Staff Assessments', 'Meeting', assMeet],
    ['Staff Assessments', 'Below', assBelow]
  ];
  dlBlob('\uFEFF' + rows.map(r => r.map(q).join(',')).join('\r\n'), 'text/csv;charset=utf-8;', 'dashboard-summary.csv');
  toast('Exported dashboard-summary.csv');
}
function getNeedsAttentionSheets() {
  const ver = verOn(FWDATE), fwRows = ver ? FW.filter(x => x.hist.some(h => h.v === ver.v)) : [];
  const atFw = x => x.hist.find(h => h.v === (ROWVER[x._id] || ver.v)) || x.hist.find(h => h.v === ver.v);
  return {
    fw: [
      ['Framework', 'Library', 'Competency', 'Linked Courses', 'Status'],
      ...fwRows.map(x => {
        const h = atFw(x), compTitle = h.c || x.c, cs = fwCourses(x, h), st = fwDisplayStatus(x, h);
        return st !== 'Active' ? [h.fw || x.fw, h.lib || x.lib, compTitle, cs.length, st] : null;
      }).filter(Boolean)
    ],
    catalog: [
      ['Course', 'Provider', 'Type', 'Duration', 'Confidence', 'Rating', 'Status', 'Issue'],
      ...CAT.map(c => {
        const ch = catAt(c), iss = [];
        if (ch.conf < thr()) iss.push(`Confidence < ${thr()}%`);
        if (ch.st !== 'Active') iss.push('Status: ' + ch.st);
        if (c.rating > 0 && c.rating < 4.5) iss.push('Rating Below (<4.5)');
        return iss.length ? [c.t, c.p, ch.type, ch.dur, ch.conf + '%', c.rating || '—', ch.st, iss.join('; ')] : null;
      }).filter(Boolean)
    ],
    records: [
      ['Staff ID', 'Department', 'Course', 'Provider', 'Date', 'Hours', 'Confidence', 'Status', 'Issue'],
      ...REC.map(r => {
        const iss = [];
        if (r.conf < thr()) iss.push(`Confidence < ${thr()}%`);
        if (r.st !== 'Completed' && r.st !== 'In progress') iss.push('Status: ' + r.st);
        return iss.length ? [r.id, r.dept || '', r.course, r.p || 'missing', r.date, r.h, r.conf + '%', r.st, iss.join('; ')] : null;
      }).filter(Boolean)
    ],
    assess: [
      ['Year', 'Staff ID', 'Department', 'Competency', 'Required Level', 'Rating', 'Gap', 'Match', 'Issue'],
      ...ASSESS.map(a => {
        if (!isAssFlagged(a)) return null;
        const iss = [];
        if (a.gap <= -2) iss.push('Critical gap (2+ levels below)');
        if (a.match === 'Unmatched') iss.push('Unmatched competency');
        return [a.y, a.id, a.dept, a.c, PLNAME[a.req] || ('PL' + a.req), a.rating, a.gap, a.match, iss.join('; ')];
      }).filter(Boolean)
    ]
  };
}
function exportCurrentList(k) {
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const src = k === 'fw' ? LIB.fwcards_out : LIB[k];
  const cols = src?.cols || [];
  const rows = src?.out || src?.rows || [];
  const csvRows = [
    cols.map(c => c.label),
    ...rows.map(r => cols.map(c => {
      const v = c.csv ? c.csv(r) : c.get(r);
      return Array.isArray(v) ? v.join(', ') : v;
    }))
  ];
  const names = { fw: 'frameworks', catalog: 'catalog', records: 'records', assess: 'assessments' };
  const fname = `${names[k] || k}-list.csv`;
  dlBlob('\uFEFF' + csvRows.map(r => r.map(q).join(',')).join('\r\n'), 'text/csv;charset=utf-8;', fname);
  toast(`Exported ${fname} (${rows.length} items)`);
}
function exportPageNeedsAttention(k) {
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const rows = getNeedsAttentionSheets()[k] || [];
  const fname = `${k === 'fw' ? 'frameworks' : k === 'assess' ? 'assessments' : k}-needs-attention.csv`;
  dlBlob('\uFEFF' + rows.map(r => r.map(q).join(',')).join('\r\n'), 'text/csv;charset=utf-8;', fname);
  toast(`Exported ${fname} (${Math.max(0, rows.length - 1)} items)`);
}
function exportNeedsAttentionXls() {
  const xe = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const s = getNeedsAttentionSheets();
  const mkSheet = (name, rows) => `<Worksheet ss:Name="${xe(name)}"><Table>${rows.map((r, ri) => `<Row>${r.map(cell => `<Cell${ri === 0 ? ' ss:StyleID="hdr"' : ''}><Data ss:Type="String">${xe(cell)}</Data></Cell>`).join('')}</Row>`).join('')}</Table></Worksheet>`;
  const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="hdr"><Font ss:Bold="1"/></Style></Styles>${mkSheet('Frameworks', s.fw)}${mkSheet('Catalog', s.catalog)}${mkSheet('Records', s.records)}${mkSheet('Assessment', s.assess)}</Workbook>`;
  dlBlob(xml, 'application/vnd.ms-excel;charset=utf-8;', 'needs-attention-report.xls');
  toast('Exported needs-attention-report.xls (4 tabs)');
}
const DL_ICO = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
const UP_ICO = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4"/><path d="M6 10l6-6 6 6"/><path d="M4 20h16"/></svg>`;
const attnBtn = k => `<button class="btn out" style="color:var(--bad);border-color:var(--bad)" onclick="exportPageNeedsAttention('${k}')">${DL_ICO} Download Needs Attention</button>`;
const JOBS_ICO = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>`;
const jobsBtn = (tab = 'all') => `<button class="btn out" onclick="openAllJobs('${tab}')">${JOBS_ICO} Recent uploads</button>`;
const TOPACT = {
  dash: `<button class="btn out" onclick="exportDashSummaryCsv()">${DL_ICO} Export CSV</button>`,
  fw: `${attnBtn('fw')} ${jobsBtn('fw')} <button class="btn pri" onclick="openUp('fw')">${UP_ICO} Upload framework</button>`,
  upload: jobsBtn('all')
};
function toggleNavGroup(k, forceOpen) {
  const btn = $('#' + k + 'Group'), box = $('#nav-grp-' + k);
  if (!btn || !box) return;
  const open = forceOpen !== undefined ? forceOpen : btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  box.hidden = !open;
}
function go(p, keepTrail = false) {
  const navKey = p;
  if (!keepTrail) {
    NAV_TRAIL = [];
    FLOW_CTX.fwId = null; FLOW_CTX.fwTitle = ''; FLOW_CTX.courseTitle = '';
    if (p === 'catalog') CAT_DETAIL = null;
    if (p === 'fw' || p === 'fwcards') FW_CARDS_F.q = '';
  }
  if (p === 'fw') { p = 'fwcards'; FW_CARDS_DETAIL = null; }
  CUR_PAGE = p;
  $('#topActions').innerHTML = TOPACT[p] || '';
  document.querySelectorAll('.page').forEach(e => e.classList.toggle('on', e.id === 'p-' + p));
  document.querySelectorAll('.nav').forEach(b => b.classList.toggle('on', b.dataset.p === navKey || (p === 'fwcards' && b.dataset.p === 'fw') || (p === 'jobs' && b.dataset.p === (JOBS_BACK === 'fwcards' ? 'fw' : JOBS_BACK))));
  $('#title').textContent = navKey === 'fw' ? 'Frameworks' : TITLES[p];
  if (['users', 'audit', 'settings'].includes(p)) toggleNavGroup('admin', true);
  RENDER[p]();
}
document.querySelectorAll('.nav[data-p]').forEach(b => b.addEventListener('click', () => go(b.dataset.p)));
function curRole() { return ROLES.find(r => r.n === $('#role').value) || ROLES[0]; }
function applyRole() {
  const sel = $('#role'), v = sel.value; sel.innerHTML = ROLES.map(r => `<option>${esc(r.n)}</option>`).join(''); sel.value = ROLES.some(r => r.n === v) ? v : ROLES[0].n;
  $('#meRole').textContent = curRole().n;
  const p = curRole().p, map = { fw: 0, fwcards: 0, catalog: 1, records: 2, assess: 3, dash: 4, review: 5, users: 6, audit: 7, settings: 6 };
  document.querySelectorAll('.nav').forEach(b => { const k = b.dataset.p; b.classList.toggle('hide', k in map && !p[map[k]]); });
  const hasAdmin = !!(p[6] || p[7]);
  $('#adminGroup').hidden = !hasAdmin; $('#nav-grp-admin').hidden = !hasAdmin || $('#adminGroup').getAttribute('aria-expanded') === 'false'; $('#usersLocked').hidden = !!p[6]; $('#usersBody').hidden = !p[6]; $('#auditLocked').hidden = !!p[7]; $('#auditBody').hidden = !p[7]; $('#setLocked').hidden = !!p[6]; $('#setBody').hidden = !p[6];
  const cur = document.querySelector('.nav.on'); if (cur && cur.classList.contains('hide')) go(p[4] ? 'dash' : 'review');
}


/* ---------- LOGIN ---------- */
function doLogin() {
  const b = $('#loginBtn'); b.classList.add('busy'); b.lastElementChild.textContent = 'Signing in…';
  setTimeout(() => { $('#login').classList.add('out'); b.classList.remove('busy'); b.lastElementChild.textContent = 'Login with LTA AD'; AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Sign-in', tg: 'Entra ID', d: '—' }); USERS[0].last = now().slice(0, 10); go('dash'); }, 900);
}
function doLogout() { $('#login').classList.remove('out'); }



/* ---------- IDLE ADMIN ENFORCEMENT ---------- */
const DAY = 864e5;
function idleDays(u) { return Math.floor((Date.now() - new Date(u.last + 'T00:00:00')) / DAY); }
function fmtD(d) { const z = n => String(n).padStart(2, '0'); return `${z(d.getDate())}/${z(d.getMonth() + 1)}/${d.getFullYear()}`; }
function enforceIdle() {
  USERS.forEach(u => {
    if (u.r === 'HR Administrator' && u.on && idleDays(u) >= SET.idleDays) {
      const when = new Date(new Date(u.last + 'T00:00:00').getTime() + SET.idleDays * DAY); u.on = false; u.lapsed = fmtD(when); u.upd = `${when.getFullYear()}-${String(when.getMonth() + 1).padStart(2, '0')}-${String(when.getDate()).padStart(2, '0')} 00:05`;
      AUDIT.push({ t: u.lapsed, u: 'System', a: 'Deactivate', tg: u.n, d: `Active → Deactivated · ${SET.idleDays} days idle` });
    }
  });
}
function idleInfo(u) {
  if (u.lapsed) return { flag: true, tip: `Deactivated ${u.lapsed} after ${SET.idleDays} days without sign-in` };
  if (!u.on) return { flag: true, tip: 'Inactive account' };
  if (u.r !== 'HR Administrator') return { flag: false, tip: '' };
  const d = idleDays(u), left = SET.idleDays - d, sent = SET.remind.filter(x => d >= x);
  if (d >= SET.idleDays || sent.length) return { flag: true, tip: `Deactivates in ${left} day${left === 1 ? '' : 's'} · reminder sent on day ${sent[sent.length - 1] || d}` };
  return { flag: false, tip: '' };
}
function rSettings() {
  $('#thrRange').value = SET.thr; $('#thrNum').value = SET.thr;
}

function thrPreview(v) {
  v = Math.max(50, Math.min(99, +v || 80)); $('#thrRange').value = v; $('#thrNum').value = v;
}
function saveThr() {
  const v = Math.max(50, Math.min(99, +$('#thrNum').value || 80)); AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Setting', tg: 'Mapping confidence threshold', d: `${SET.thr}% → ${v}%` }); SET.thr = v; SET.thrBy = 'Nurul Hassan'; SET.thrOn = 'Just now';
  CAT.forEach(x => {
    if ((x.conf || 0) >= 50) {
      x.st = x.conf < v ? 'Pending review' : 'Active';
      if (x.hist && x.hist.length) {
        const lh = x.hist[x.hist.length - 1];
        if ((lh.conf || 0) >= 50) lh.st = lh.conf < v ? 'Pending review' : 'Active';
      }
    }
  });
  toast('Threshold saved: ' + v + '%'); rSettings(); rCat(); rRec(); rFwCards(); rDash();
}
/* ---------- ACCOUNT MENU ---------- */
function openMe(ev) {
  if (POP) { closePop(); return; } const d = document.createElement('div'); d.className = 'pop'; d.style.minWidth = '220px';
  d.innerHTML = `<div class="mh">Signed in as</div><div style="margin-bottom:8px"><b>Nurul Hassan</b><br><span class="dim">nurul_hassan@lta.gov.sg</span></div><div class="mh">Switch role</div>${ROLES.map(r => `<label><input type="radio" name="swrole" value="${esc(r.n)}" ${curRole().n === r.n ? 'checked' : ''}> ${esc(r.n)}</label>`).join('')}<button class="btn sm so" onclick="closePop();doLogout()">Sign out</button>`;
  d.querySelectorAll('input').forEach(i => i.onchange = () => { $('#role').value = i.value; applyRole(); toast('Viewing as ' + i.value); closePop(); });
  document.body.appendChild(d); placePop(d, ev.currentTarget, { above: true }); POP = d;
}
/* ---------- SIDEBAR ---------- */
function toggleSide(force) {
  const a = document.querySelector('.app'); const c = force == null ? !a.classList.contains('collapsed') : force; a.classList.toggle('collapsed', c);
  const t = $('#tog'); t.title = t.ariaLabel = c ? 'Expand sidebar' : 'Collapse sidebar'; try { localStorage.setItem('side', c ? '1' : '0'); } catch (e) { }
}
try { if (localStorage.getItem('side') === '1') toggleSide(true); } catch (e) { }
enforceIdle(); rDash(); applyRole();
