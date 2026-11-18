function openJobs(k) { openAllJobs(k); }
function openUp(k) { $('#m-' + k).hidden = false; rUpload(k); }
function closeUp(k) { $('#m-' + k).hidden = true; }
let UP_ALL_TAB = 'fw', JOBS_TAB = 'all', JOBS_BACK = 'upload';
const UP_ALL_TABS = [
  { k: 'fw', l: 'Frameworks', pg: 'fw' },
  { k: 'catalog', l: 'Catalog', pg: 'catalog' },
  { k: 'records', l: 'Records', pg: 'records' },
  { k: 'assess', l: 'Assessments', pg: 'assess' }
];
function rJobsPage() {
  const tabs = [{ k: 'all', l: 'All' }, ...UP_ALL_TABS];
  const cur = tabs.find(t => t.k === JOBS_TAB) || tabs[0];
  const jobs = cur.k === 'all' ? JOBS : JOBS.filter(j => j.type === UPT[cur.k].t);
  const crumbEl = $('#jobsCrumb');
  if (crumbEl) crumbEl.innerHTML = renderTrailHtml('Recent uploads');
  const tabsEl = $('#jobsAllTabs');
  if (tabsEl) tabsEl.innerHTML = tabs.map(t => `<button type="button" class="btn sm ${cur.k === t.k ? 'pri' : 'out'}" onclick="libState('jobs').page=1;openAllJobs('${t.k}')">${t.l}</button>`).join('');
  const n = (j, f) => j.chg ? `<span class="num mono">${j.chg[f].length ? j.chg[f].length : '<span class="dim">0</span>'}</span>` : '<span class="dim">—</span>';
  libTable('jobs', '#jobs-all-tbl', [
    { key: 'ref', label: 'Ref', type: 'search', get: j => j.ref },
    { key: 'type', label: 'Type', type: 'filter', get: j => j.type },
    { key: 'file', label: 'File', type: 'search', get: j => j.file },
    { key: 'rows', label: 'Rows', type: 'sort', num: true, get: j => Number(j.rows || 0) },
    { key: 'added', label: 'Added', type: 'sort', num: true, get: j => j.chg ? j.chg.added.length : -1 },
    { key: 'changed', label: 'Changed', type: 'sort', num: true, get: j => j.chg ? j.chg.changed.length : -1 },
    { key: 'inactive', label: 'Inactive', type: 'sort', num: true, get: j => j.chg ? j.chg.inactive.length : -1 },
    { key: 'rejected', label: 'Rejected', type: 'sort', num: true, get: j => j.chg ? j.chg.rejected.length : -1 },
    { key: 'st', label: 'Status', type: 'filter', get: j => j.st },
    { key: 'by', label: 'Uploaded by', type: 'filter', get: j => j.by || 'Nurul Hassan' },
    { key: 'when', label: 'When', type: 'sort', get: j => auditISO(j.when) }
  ], jobs, j => {
    const k = Object.keys(UPT).find(x => UPT[x].t === j.type) || 'fw';
    return `<tr><td class="mono dim" style="white-space:nowrap">${j.ref}</td><td style="white-space:nowrap">${esc(j.type)}</td><td>${esc(j.file)}</td><td class="num mono">${j.rows || '<span class="dim">—</span>'}</td><td class="num">${n(j, 'added')}</td><td class="num">${n(j, 'changed')}</td><td class="num">${n(j, 'inactive')}</td><td class="num">${j.chg ? `<span class="mono" style="color:${j.chg.rejected.length ? 'var(--bad)' : 'inherit'}">${j.chg.rejected.length || '<span class="dim">0</span>'}</span>` : '<span class="dim">—</span>'}</td><td style="white-space:nowrap">${j.pct != null && j.pct < 100 ? `<span class="conf"><b style="--w:${j.pct}%"></b>${j.pct}%</span> <span class="dim">${j.st}</span>` : pill(j.st)}</td><td style="white-space:nowrap">${j.by || 'Nurul Hassan'}</td><td class="dim" style="white-space:nowrap">${j.when}</td><td class="actc" style="white-space:nowrap">${j.chg ? `<button class="btn sm" onclick="exportJobSummary('${j.ref}')">Export summary</button>` : ''}${j.st.startsWith('Failed') ? `<button class="btn sm" onclick="openUploadAll('${k}');upload('${k}',JOBS.find(x=>x.ref==='${j.ref}'))">Retry</button>` : ''}</td></tr>`;
  }, { empty: 'No uploads yet.' });
}
function openAllJobs(tab = 'all') {
  JOBS_TAB = tab || 'all';
  if (CUR_PAGE !== 'jobs') {
    JOBS_BACK = CUR_PAGE || 'upload';
    const backNav = JOBS_BACK === 'fwcards' ? 'fw' : JOBS_BACK;
    const backLabel = JOBS_BACK === 'fwcards' ? 'Frameworks' : (TITLES[JOBS_BACK] || 'Upload');
    NAV_TRAIL = [{ label: backLabel, fn: () => go(backNav) }];
    go('jobs', true);
  } else {
    rJobsPage();
  }
}
function openUploadAll(tab = 'fw') {
  UP_ALL_TAB = tab || 'fw';
  go('upload');
  setTimeout(() => $('#up-card-' + UP_ALL_TAB)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 0);
}
const UP_PICKED = {};
function syncUploadAllBtn() {
  const btn = $('#upAllBtn');
  if (!btn) return;
  const busy = UP_ALL_TABS.some(t => PROG[t.k] && PROG[t.k].pct < 100 && !PROG[t.k].fail);
  btn.disabled = busy;
}
function uploadAllPicked() {
  const targets = UP_ALL_TABS.map(t => t.k).filter(k => (UP_PICKED[k] || PROG[k]?.fail) && !(PROG[k] && PROG[k].pct < 100 && !PROG[k].fail));
  if (!targets.length) { toast('Select at least one file to upload'); return; }
  targets.forEach(k => {
    if (PROG[k]?.fail) upload(k, PROG[k].job);
    else { UP_PICKED[k] = false; upload(k); }
  });
}
function rUploadCard(k) {
  const card = $('#up-card-' + k);
  if (!card) return;
  const t = UP_ALL_TABS.find(x => x.k === k) || { l: UPT[k]?.t || k };
  const pr = PROG[k];
  const keep = $('#drop-' + k)?.textContent.trim();
  card.innerHTML = `
    <div class="up" style="padding:0;gap:12px">
      <div style="font-size:15px;font-weight:700">${esc(t.l)}</div>
      <label class="drop${keep && keep !== 'Drop file or click' ? ' ok' : ''}" id="drop-${k}" style="padding:24px 18px;cursor:pointer">${keep || 'Drop file or click'}<input type="file" hidden onchange="picked('${k}',this)"></label>
      <div class="prog${pr ? ' on' : ''}${pr && pr.pct >= 100 ? ' done' : ''}${pr && pr.fail ? ' fail' : ''}" id="prog-${k}"><div class="lbl"><span class="stage">${pr ? pr.label : ''}</span><span class="mono pct">${pr ? pr.pct + '%' : ''}</span></div><div class="bar"><i style="width:${pr ? pr.pct : 0}%"></i></div></div>
      ${pr && pr.fail ? `<div class="row" style="justify-content:flex-end"><button class="btn sm pri" onclick="upload('${k}',PROG['${k}'].job)">Retry</button></div>` : ''}
    </div>`;
  syncUploadAllBtn();
}
function rUploadAll() {
  const bodyEl = $('#upAllBody');
  if (!bodyEl) return;
  UP_ALL_TABS.forEach(t => { const el = $('#up-' + t.k); if (el) el.innerHTML = ''; });
  if (!$('#up-card-fw')) {
    bodyEl.innerHTML = UP_ALL_TABS.map(t => `<div class="card" id="up-card-${t.k}" style="padding:18px 20px"></div>`).join('');
  }
  UP_ALL_TABS.forEach(t => rUploadCard(t.k));
  syncUploadAllBtn();
}

function rUpload(k) {
  const u = UPT[k], pr = PROG[k];
  const upEl = $('#up-' + k), mEl = $('#m-' + k);
  const keep = $('#drop-' + k)?.textContent.trim();
  if (upEl && (!mEl || !mEl.hidden)) {
    upEl.innerHTML = `<div class="up"><small>${u.f}</small><small class="dim">${u.cols}</small>
    <small class="dim">Demo: a file name containing “fail” fails mid-upload.</small>
    <label class="drop${keep && keep !== 'Drop file or click' ? ' ok' : ''}" id="drop-${k}">${keep || 'Drop file or click'}<input type="file" hidden onchange="picked('${k}',this)"></label>
    <div class="prog${pr ? ' on' : ''}${pr && pr.pct >= 100 ? ' done' : ''}${pr && pr.fail ? ' fail' : ''}" id="prog-${k}"><div class="lbl"><span class="stage">${pr ? pr.label : ''}</span><span class="mono pct">${pr ? pr.pct + '%' : ''}</span></div><div class="bar"><i style="width:${pr ? pr.pct : 0}%"></i></div></div>
    <div class="row" style="justify-content:flex-end"><span>${pr && pr.fail ? `<button class="btn sm pri" onclick="upload('${k}',PROG['${k}'].job)">Retry</button>` : `<button class="btn sm pri" id="upbtn-${k}" ${pr && pr.pct < 100 ? 'disabled' : ''} onclick="upload('${k}')">Upload</button>`}</span></div></div>`;
  }
  rJobs(k);
  if (CUR_PAGE === 'upload') rUploadCard(k);
}
function rJobs(k) {
  const u = UPT[k], jobs = JOBS.filter(j => j.type === u.t);
  const jc = $('#jc-' + k); if (jc) jc.textContent = jobs.length;
  const n = (j, k) => j.chg ? `<span class="num mono">${j.chg[k].length ? j.chg[k].length : '<span class="dim">0</span>'}</span>` : '<span class="dim">—</span>';
  const jobRows = jobs.map(j => `<tr><td class="mono dim">${j.ref}</td><td>${esc(j.file)}</td><td class="num mono">${j.rows || '<span class="dim">—</span>'}</td><td class="num">${n(j, 'added')}</td><td class="num">${n(j, 'changed')}</td><td class="num">${n(j, 'inactive')}</td><td class="num">${j.chg ? `<span class="mono" style="color:${j.chg.rejected.length ? 'var(--bad)' : 'inherit'}">${j.chg.rejected.length || '<span class="dim">0</span>'}</span>` : '<span class="dim">—</span>'}</td><td>${j.pct != null && j.pct < 100 ? `<span class="conf"><b style="--w:${j.pct}%"></b>${j.pct}%</span> <span class="dim">${j.st}</span>` : pill(j.st)}</td><td>${j.by || 'Nurul Hassan'}</td><td class="dim">${j.when}</td><td class="actc">${j.chg ? `<button class="btn sm" onclick="exportJobSummary('${j.ref}')">Export summary</button>` : ''}${j.st.startsWith('Failed') ? `<button class="btn sm" onclick="openUploadAll('${k}');upload('${k}',JOBS.find(x=>x.ref==='${j.ref}'))">Retry</button>` : ''}</td></tr>`);
  const el = $('#jobs-' + k);
  if (el) tbl(el, ['Ref', 'File', '#Rows', '#Added', '#Changed', '#Inactive', '#Rejected', 'Status', 'Uploaded by', 'When', 'Action'], jobRows, 'No uploads yet.');
}
const DEMO_CHG = {
  fw: { added: [{ c: 'Smart Mobility Systems Operations', n: 'LTA Rail & Road · PL1–PL4' }, { c: 'Data-Driven Enforcement Planning', n: 'WOG Compliance & Enforcement · PL2–PL4' }], changed: [{ c: 'IFD Contract Administration', b: 'PL3 required knowledge: 4 items', a: 'PL3 required knowledge: 6 items' }, { c: 'Total Safety Management System', b: 'PL2–PL4', a: 'PL1–PL4 (PL1 added)' }, { c: 'Enforcement Investigation & Case Management', b: 'PL4: "Lead complex cases"', a: 'PL4: "Lead complex and cross-agency cases"' }], inactive: [{ c: 'Construction Environmental Engineering and Sustainability', n: 'Not in file · last version 2026-05' }], rejected: [{ row: 88, c: '(blank competency)', r: 'Competency name missing' }, { row: 143, c: 'IFD Quality Mgmt', r: 'Framework column empty' }] },
  assess: { added: [{ c: '238 assessment rows for 2025', n: '236 matched exactly, 2 by cleaned name' }], changed: [], inactive: [], rejected: [{ row: 12, c: '10175519 · Mediation', r: 'Rating value "N/A" not allowed' }, { row: 201, c: '10188104 · (blank)', r: 'Competency name missing' }] },
  catalog: { added: [{ c: 'Incident Command for Rail Operations', n: 'LTA Academy · in-house' }, { c: 'Negotiation Skills for Regulators', n: 'CSC · tag suggested, in My Tasks' }], changed: [{ c: 'Primavera P6 Fundamentals', b: 'Duration 2 days', a: 'Duration 3 days (new version)' }], inactive: [{ c: 'Basic Mediation Course', n: 'Not in file · set inactive' }], rejected: [{ row: 9, c: 'Toolbox talk (SharePoint)', r: 'URL is a SharePoint link; manual entry needed' }, { row: 63, c: '(blank title)', r: 'Programme title missing' }] },
  records: { added: [{ c: '236 learning records', n: '231 mapped, 5 sent to My Tasks' }], changed: [], inactive: [], rejected: [{ row: 31, c: '10170662 · Vendor demo', r: 'Provider missing' }, { row: 190, c: '10193355 · MS Project Essentials', r: 'Duration not a number' }] }
};
function demoChg(k) { return JSON.parse(JSON.stringify(DEMO_CHG[k])); }
function exportJobSummary(ref) {
  const j = JOBS.find(x => x.ref === ref);
  if (!j || !j.chg) return;
  const c = j.chg;
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const rows = [
    ['Ref', 'Type', 'File', 'Rows', 'Status', 'Uploaded by', 'When', 'Category', 'Item', 'Before', 'After / Details'],
    ...(c.added || []).map(x => [j.ref, j.type, j.file, j.rows || '', j.st, j.by || 'Nurul Hassan', j.when, 'Added', x.c, '', x.n || '']),
    ...(c.changed || []).map(x => [j.ref, j.type, j.file, j.rows || '', j.st, j.by || 'Nurul Hassan', j.when, 'Changed', x.c, x.b || '', x.a || '']),
    ...(c.inactive || []).map(x => [j.ref, j.type, j.file, j.rows || '', j.st, j.by || 'Nurul Hassan', j.when, 'Made inactive', x.c, '', x.n || '']),
    ...(c.rejected || []).map(x => [j.ref, j.type, j.file, j.rows || '', j.st, j.by || 'Nurul Hassan', j.when, 'Rejected', `Row ${x.row}: ${x.c}`, '', x.r || ''])
  ];
  const fname = `${j.ref.toLowerCase()}-summary.csv`;
  dlBlob('\uFEFF' + rows.map(r => r.map(q).join(',')).join('\r\n'), 'text/csv;charset=utf-8;', fname);
  toast(`Exported ${fname}`);
}
function openChg(ref) {
  const j = JOBS.find(x => x.ref === ref); if (!j || !j.chg) return; const c = j.chg;
  const sec = (title, rows, fn, empty) => `<div class="chs"><h3>${title} <span class="cnt">${rows.length}</span></h3>${rows.length ? `<table>${rows.map(fn).join('')}</table>` : `<div class="dim" style="padding:4px 0 8px">${empty}</div>`}</div>`;
  $('#chgTitle').textContent = `${j.ref} · ${j.file}`; $('#chgSub').textContent = `${j.type} · uploaded ${j.when} by ${j.by || 'Nurul Hassan'} · ${j.rows} rows in file`;
  $('#chgBody').innerHTML = sec('Added', c.added, x => `<tr><td><b>${esc(x.c)}</b></td><td class="dim">${esc(x.n || '')}</td></tr>`, 'Nothing added.')
    + sec('Changed', c.changed, x => `<tr><td><b>${esc(x.c)}</b></td><td><span class="dim">${esc(x.b)}</span> → ${esc(x.a)}</td></tr>`, 'Nothing changed.')
    + sec('Made inactive', c.inactive, x => `<tr><td><b>${esc(x.c)}</b></td><td class="dim">${esc(x.n || '')}</td></tr>`, 'Nothing made inactive.')
    + sec('Rejected', c.rejected, x => `<tr><td class="mono dim">Row ${x.row}</td><td><b>${esc(x.c)}</b></td><td style="color:var(--bad)">${esc(x.r)}</td></tr>`, 'No rows rejected.');
  $('#m-chg').hidden = false;
}
function picked(k, inp) { UP_PICKED[k] = !!inp.files[0]; const d = $('#drop-' + k); d.textContent = inp.files[0] ? inp.files[0].name : 'Drop file or click'; d.classList.toggle('ok', !!inp.files[0]); d.appendChild(inp); }
function upload(k, retry) {
  const u = UPT[k]; let job = retry;
  if (!job) {
    const n = String(JOBS.length + 3).padStart(2, '0'), name = ($('#drop-' + k).textContent.trim().replace('Drop file or click', '') || 'file');
    job = { ref: 'JOB-2611-' + n, type: u.t, file: name, rows: 0, ok: 0, bad: 0, st: 'In Progress', when: 'Just now', pct: 0, tries: 0 }; JOBS.unshift(job);
  }
  job.tries = (job.tries || 0) + 1; job.rows = 0; job.ok = 0; job.bad = 0; job.pct = 0; job.st = 'In Progress'; job.when = 'Just now';
  const willFail = job.tries === 1 && /fail/i.test(job.file);
  PROG[k] = { pct: 0, label: retry ? 'Retrying…' : 'Uploading file', job }; rUpload(k);
  const stages = [[0, 'Uploading file'], [45, 'Scanning for malware'], [70, 'Validating rows'], [90, 'Processing']];
  const t0 = Date.now(), dur = 3200;
  const tick = setInterval(() => {
    const pct = Math.min(100, Math.round((Date.now() - t0) / dur * 100));
    const stage = stages.filter(x => pct >= x[0]).pop()[1];
    PROG[k] = { pct, label: stage, job }; job.pct = pct; job.st = 'In Progress';
    const el = $('#prog-' + k); if (el) { el.querySelector('i').style.width = pct + '%'; el.querySelector('.stage').textContent = stage; el.querySelector('.pct').textContent = pct + '%'; }
    const row = [...($('#jobs-' + k)?.querySelectorAll('tr') || [])].find(r => r.textContent.includes(job.ref)); const cell = row?.children[7];
    if (cell) cell.innerHTML = `<span class="conf"><b style="--w:${pct}%"></b>${pct}%</span> <span class="dim">${job.st}</span>`;
    if (willFail && pct >= 62) { clearInterval(tick); job.pct = null; job.st = 'Failed - malware'; PROG[k] = { pct: 62, label: 'Failed - malware. Retry to resume.', fail: true, job }; rUpload(k); toast(job.ref + ' failed. Retry available.'); return; }
    if (pct >= 100) { clearInterval(tick); job.pct = null; job.rows = 240; job.ok = 238; job.bad = 2; job.st = 'Pending'; job.chg = demoChg(k); PROG[k] = { pct: 100, label: 'Done · 238 loaded, 2 rejected', job }; rUpload(k); toast(job.ref + ' processed: 2 rows rejected'); setTimeout(() => { if (PROG[k] && PROG[k].job === job) { delete PROG[k]; if ($('#prop-' + k) || $('#prog-' + k)) rUpload(k); } }, 4000); }
  }, 120);
}


let ASS_ATTN_ONLY = false;
function rAssess() {
  renderCrumbAndFlow('assess');
  rJobs('assess');
  const assBase = (NAV_TRAIL.length && FLOW_CTX.courseTitle)
    ? (() => {
        const fc = CAT.find(c => norm(c.t) === norm(FLOW_CTX.courseTitle));
        return fc ? courseCompletedAss(fc) : [];
      })()
    : ((NAV_TRAIL.length && FLOW_CTX.compList && FLOW_CTX.compList.length)
        ? ASSESS.filter(a => FLOW_CTX.compList.includes(norm(a.c)))
        : ASSESS);
  const assBarEl = $('#assessBar');
  if (assBarEl) assBarEl.innerHTML = renderAttnBarHtml('assess', assBase.length, 'assessment', assBase.filter(isAssFlagged).length, ASS_ATTN_ONLY, "ASS_ATTN_ONLY=!ASS_ATTN_ONLY;libState('assess').page=1;rAssess()");
  const assRows = ASS_ATTN_ONLY ? assBase.filter(isAssFlagged) : assBase;
  libTable('assess', '#tAssess', [
    { key: 'y', label: 'Year', type: 'filter', get: x => x.y }, { key: 'id', label: 'Staff', type: 'search', get: x => x.id }, { key: 'dept', label: 'Dept', type: 'filter', get: x => x.dept },
    { key: 'c', label: 'Competency', type: 'semantic', get: x => x.c, kw: x => { const f = FW.find(f => norm(f.c) === norm(x.c)); return f ? f.kw : ''; } }, { key: 'req', label: 'Required', type: 'filter', get: x => PLNAME[x.req] }, { key: 'rating', label: 'Rating', type: 'filter', get: x => x.rating }],
    assRows, x => `<tr class="${isAssFlagged(x) ? 'flag-row' : ''}"><td class="mono">${x.y}</td><td class="mono">${x.id}</td><td class="dim">${x.dept}</td><td class="wrap">${esc(x.c)}${scoreTag('assess', x._id)}</td><td>${PLNAME[x.req]}</td><td>${pill(x.rating)}</td></tr>`, { noAct: true });
}
function courseHref(u) {
  if (!u || u === '—') return ''; let m = u.match(/^learn\.gov\.sg · ([A-Z0-9-]+)/i); if (m) return 'https://www.learn.gov.sg/Learning/BrowseDetails?ProgCode=' + m[1];
  if (/sharepoint/i.test(u)) return ''; m = u.match(/^([a-z0-9.-]+\.[a-z]{2,})/i); return m ? 'https://www.' + m[1].replace(/^www\./, '') : '';
}
const CAT_DESCS = [
  'Covers foundational mediation principles, active listening, and de-escalation techniques for handling public disputes.',
  'Introduces statutory enforcement duties, rules of engagement, and compliance procedures for field officers.',
  'Hands-on scenario training on field deployment, public interaction, and operational compliance.',
  'Covers evidence collection, statement taking, chain of custody, and investigation case file preparation.',
  'Advanced cognitive interviewing methods, witness questioning, and structured investigative interviews.',
  'Explains statutory powers of inspection, seizure, arrest, and legal boundaries during enforcement operations.',
  'Strategies and protocols for handling public recording and body-worn camera interactions during field duties.',
  'Mandatory workplace safety, health, and environmental management induction for rail construction sites.',
  'Practical guide to EIA frameworks, pollution mitigation, and environmental monitoring on infrastructure projects.',
  'Project scheduling, critical path analysis, resource allocation, and baseline tracking in Oracle Primavera P6.',
  'Planning, conducting, and reporting internal quality management system audits in accordance with ISO 9001:2015.',
  'Missing course details — SharePoint link could not be fetched automatically. Click to enter course details manually.',
  'Comprehensive WSH regulatory compliance, site hazard identification, and safety management system auditing.',
  'Methodology for hazard identification, risk evaluation matrices, and Total Safety Management implementation.',
  'Administering civil engineering contracts, variation orders, progress claims, and contractor compliance.',
  'Complex multi-party negotiation, deadlock resolution, and stakeholder dispute settlement techniques.',
  'Structured incident investigation using 5-Whys, Fault Tree Analysis, and corrective action reporting.',
  'Creating work breakdown structures, Gantt charts, milestones, and schedule tracking in Microsoft Project.'
];
const CAT_RATINGS = [[4.7, 134], [4.8, 186], [4.6, 92], [4.5, 118], [4.7, 76], [4.8, 164], [4.1, 38], [4.9, 245], [4.7, 89], [4.6, 112], [4.3, 54], [0, 0], [4.8, 141], [4.5, 67], [4.9, 103], [4.7, 58], [4.8, 129], [4.6, 95]];
CAT.forEach((x, i) => {
  if (!x.desc) {
    const comp = x.tags?.[0]?.[0];
    x.desc = CAT_DESCS[i] || (comp ? `Equips learners with practical knowledge and applied skills in ${comp} (${x.type}, ${x.dur}).` : 'Course objectives and syllabus details.');
  }
  if (x.rating == null) { const r = CAT_RATINGS[i] || [4.6, 40]; x.rating = r[0]; x.reviews = r[1]; }
});
const CAT_EDIT = {};
const CAT_OBJ_EDIT = {};
let CATROWVER = {};
let CAT_EDIT_SEQ = 0;
const CONF_POOL = [96, 84, 74, 91, 88, 77, 95, 82, 69, 93, 86, 72, 98, 85, 79, 90, 81, 66, 94, 87, 75, 89, 83, 92, 71, 97];
const CAT_HIST_SEED = {
  'Basic Mediation Course': [
    { v: '2025-03', from: '2025-03-03', to: '2025-11-11', by: 'Wei Ling Tan · Upload', type: 'Workshop', dur: 'half day', desc: 'Introductory classroom session on resolving public feedback and front-counter disputes.', tags: [['Mediation & Dispute Resolution', 1]], conf: 86, st: 'Active', chg: 'First version in catalog' },
    { v: '2026-11', from: '2025-11-12', to: null, by: 'Daniel Koh · JOB-2611-06', type: 'e-Learning', dur: '30 mins', desc: CAT_DESCS[0], tags: [['Mediation & Dispute Resolution', 1], ['Mediation & Dispute Resolution', 2]], conf: 94, st: 'Active', chg: 'Converted from half-day workshop to 30 mins self-paced e-Learning; expanded to P1 & P2 (confidence 86% → 94%)' }],
  'Core Enforcement Principles': [
    { v: '2025-03', from: '2025-03-03', to: '2026-11-13', by: 'Wei Ling Tan · Upload', type: 'e-Learning', dur: '25 mins', desc: 'Overview of statutory enforcement duties for new officers.', tags: [['Regulatory Operations Management & Delivery', 1]], conf: 89, st: 'Active', chg: 'First version in catalog' },
    { v: '2026-11', from: '2026-11-14', to: null, by: 'Daniel Koh · JOB-2611-06', type: 'e-Learning', dur: '35 mins', desc: CAT_DESCS[1], tags: [['Regulatory Operations Management & Delivery', 1], ['Regulatory Operations Management & Delivery', 2]], conf: 96, st: 'Active', chg: 'Duration 25 mins → 35 mins; compliance module added covering P1 & P2 (confidence 89% → 96%)' }],
  'Fundamentals Of Investigation': [
    { v: '2025-03', from: '2025-03-03', to: '2025-11-11', by: 'Wei Ling Tan · Upload', type: 'SS', dur: '2 days', desc: 'Introductory statement taking and basic investigation procedures.', tags: [['Enforcement Investigation & Case Management', 1]], conf: 82, st: 'Active', chg: 'First version in catalog' },
    { v: '2025-11', from: '2025-11-12', to: '2026-11-13', by: 'Nurul Hassan · Upload', type: 'SS', dur: '2 days', desc: 'Covers evidence collection, statement taking, and case file basics.', tags: [['Enforcement Investigation & Case Management', 2]], conf: 86, st: 'Active', chg: 'Syllabus expanded with case-file exercises · mapping upgraded PL1 → PL2 (confidence 82% → 86%)' },
    { v: '2026-11', from: '2026-11-14', to: null, by: 'Daniel Koh · JOB-2611-06', type: 'SS', dur: '3 days', desc: CAT_DESCS[3], tags: [['Enforcement Investigation & Case Management', 2]], conf: 90, st: 'Active', chg: 'Duration 2 days → 3 days; chain of custody module added in JOB-2611-06 (confidence 86% → 90%)' }],
  'Legal Rights & Powers for Enforcement Officers': [
    { v: '2025-03', from: '2025-03-03', to: '2026-11-13', by: 'Wei Ling Tan · Upload', type: 'e-Learning', dur: '30 mins', desc: 'Overview of officer inspection powers under public transport acts.', tags: [['Regulatory Operations Management & Delivery', 1]], conf: 85, st: 'Active', chg: 'First version (2-line objective)' },
    { v: '2026-11', from: '2026-11-14', to: null, by: 'Daniel Koh · JOB-2611-06', type: 'e-Learning', dur: '40 mins', desc: CAT_DESCS[5], tags: [['Regulatory Operations Management & Delivery', 1]], conf: 93, st: 'Active', chg: 'Objective expanded from 2 to 4 lines with seizure & arrest boundaries; duration 30 → 40 mins (confidence 85% → 93%)' }],
  'WSH Induction for Rail Projects': [
    { v: '2025-03', from: '2025-03-03', to: '2026-10-01', by: 'Wei Ling Tan · Upload', type: 'In-house', dur: '3 hrs', desc: 'Site safety briefing for rail project personnel.', tags: [['Workplace Safety & Health Risk Assessment', 1]], conf: 88, st: 'Active', chg: 'First version (mapped to Workplace Safety & Health Risk Assessment)' },
    { v: '2026-10', from: '2026-10-02', to: null, by: 'Nurul Hassan · Upload', type: 'In-house', dur: '4 hrs', desc: CAT_DESCS[7], tags: [['LTA Safety, Health & Environmental Management System and Processes', 1]], conf: 97, st: 'Active', chg: 'Re-mapped after Workplace Safety & Health Risk Assessment became inactive in framework 2026-05; duration 3 hrs → 4 hrs (88% → 97%)' }],
  'Primavera P6 Fundamentals': [
    { v: '2025-03', from: '2025-03-03', to: '2026-09-17', by: 'Wei Ling Tan · Upload', type: 'e-Learning', dur: '1 day', desc: 'Basic project schedule creation in Oracle Primavera P6.', tags: [['IFD Project Management Tools and Software', 1]], conf: 81, st: 'Active', chg: 'First version in catalog' },
    { v: '2026-09', from: '2026-09-18', to: null, by: 'Priya Nair · Upload', type: 'Workshop', dur: '2 days', desc: CAT_DESCS[9], tags: [['IFD Project Management Tools and Software', 2]], conf: 89, st: 'Active', chg: 'Format changed e-Learning (1 day) → Workshop (2 days) with resource & baseline labs · mapping PL1 → PL2 (81% → 89%)' }],
  'Root Cause Analysis Workshop': [
    { v: '2025-03', from: '2025-03-03', to: '2026-10-01', by: 'Wei Ling Tan · Upload', type: 'In-house', dur: 'half day', desc: 'Incident review techniques for rail safety officers.', tags: [['LTA Safety, Health & Environmental Management System and Processes', 2]], conf: 79, st: 'Pending review', chg: 'First version (mapped to general WSH competency before 2026-05 framework)' },
    { v: '2026-10', from: '2026-10-02', to: null, by: 'Nurul Hassan · Upload', type: 'In-house', dur: 'half day', desc: CAT_DESCS[16], tags: [['Incident Investigation & Reporting', 2]], conf: 94, st: 'Active', chg: 'Re-mapped to new competency "Incident Investigation & Reporting" added in framework 2026-05 (confidence 79% → 94%)' }]
};
CAT.forEach((x, i) => {
  if (CAT_HIST_SEED[x.t]) { x.hist = CAT_HIST_SEED[x.t]; return; }
  const curV = x.upd ? x.upd.slice(0, 7) : '2026-11';
  const prevComp = x.tags[0]?.[0] || 'Regulatory Operations Management & Delivery';
  const prevPl = Math.max(1, (x.tags[0]?.[1] || 1) - (i % 2 === 0 ? 1 : 0));
  const prevConf = x.conf ? Math.max(64, x.conf - 6) : 0;
  x.hist = [];
  if (x.conf > 0) {
    x.hist.push({ v: '2025-03', from: '2025-03-03', to: x.upd || '2026-11-13', by: 'Wei Ling Tan · Upload', type: x.type, dur: x.dur, desc: 'Earlier syllabus version prior to 2026 learning catalog refresh.', tags: [[prevComp, prevPl]], conf: prevConf, st: prevConf >= 80 ? 'Active' : 'Pending review', chg: 'First version in catalog' });
  }
  x.hist.push({ v: curV, from: x.upd || '2026-11-14', to: null, by: 'Daniel Koh · JOB-2611-06', type: x.type, dur: x.dur, desc: x.desc, tags: JSON.parse(JSON.stringify(x.tags)), conf: x.conf, st: x.st, chg: x.conf > 0 ? `Course details refreshed in ${curV} catalog upload${prevPl !== (x.tags[0]?.[1] || 1) ? `; level PL${prevPl} → PL${x.tags[0]?.[1]}` : ''} (confidence ${prevConf}% → ${x.conf}%)` : 'Added in JOB-2611-06; SharePoint URL requires manual entry' });
});
function catAt(x) {
  if (!x.hist || !x.hist.length) return x;
  const selV = CATROWVER[x._id];
  return (selV && x.hist.find(h => h.v === selV)) || x.hist[x.hist.length - 1];
}
function openCatHist(id) {
  const x = CAT.find(r => r._id === id); if (!x) return;
  $('#histTitle').textContent = x.t;
  $('#histSub').textContent = `${x.p} · ${x.type} · ${x.src} · ${x.hist.length} version${x.hist.length === 1 ? '' : 's'}`;
  const recs = h => REC.filter(r => norm(r.course) === norm(x.t) && r.date >= h.from && (!h.to || r.date <= h.to));
  $('#histBody').innerHTML = `<div class="tw"><table>
  <tr><th>Version</th><th>In effect</th><th>Course details</th><th>Competency · level</th><th>Confidence</th><th>Status</th><th>What changed</th><th class="num">Records</th></tr>
  ${[...x.hist].reverse().map(h => {
    const n = recs(h);
    const tagHtml = h.tags && h.tags.length ? h.tags.map(t => `<span class="tag">${esc(t[0])}<span class="pl">PL${t[1]}</span></span>`).join('') : '<span class="dim">Unmapped</span>';
    const range = h.to ? `${fmtR(h.from)} – ${fmtR(h.to)}` : `${fmtR(h.from)} – today`;
    return `<tr>
      <td class="mono" style="white-space:nowrap"><b>${esc(h.v)}</b>${!h.to ? ' <span class="pill p-acc">Current</span>' : ''}<div class="dim" style="font-size:11px">${esc(h.by || '')}</div></td>
      <td class="dim" style="white-space:nowrap">${range}</td>
      <td class="wrap"><div style="font-weight:500">${esc(h.type)} · ${esc(h.dur)}</div><div class="dim" style="font-size:11.5px;margin-top:2px">${esc(h.desc || '')}</div></td>
      <td class="wrap">${tagHtml}</td>
      <td>${conf(h.conf)}</td>
      <td>${pill(h.st)}</td>
      <td class="wrap">${esc(h.chg)}</td>
      <td class="num mono">${n.length}</td>
    </tr>`;
  }).join('')}
</table></div>
<p class="hint" style="margin:12px 0 0">Each catalog upload or manual edit creates a new version snapshot so you can trace why a course's details, competency mapping, or confidence score changed over time.</p>`;
  $('#m-hist').hidden = false;
}
function nextCatConf(x, comp, pl, desc = '') {
  x._usedConfs = x._usedConfs || new Set([x.conf]);
  CAT_EDIT_SEQ++;
  const str = (comp || '') + '|' + desc;
  let h = CAT_EDIT_SEQ * 7 + (+pl || 1) * 13;
  for (let i = 0; i < str.length; i++)h = (h * 31 + str.charCodeAt(i)) % 997;
  let c = CONF_POOL[(h + CAT_EDIT_SEQ) % CONF_POOL.length];
  let g = 0;
  while ((x._usedConfs.has(c) || c === x.conf) && g < 40) { c = 65 + ((c - 65 + 7) % 34); g++; }
  if (x._usedConfs.size > 12) x._usedConfs = new Set([x.conf]);
  x._usedConfs.add(c);
  return c;
}
function startCatEdit(id) {
  const x = CAT.find(r => r._id === id); if (!x) return;
  const curC = x.tags[0]?.[0] || FW[0].c;
  const curPls = catPlsFor(x, curC);
  const inFw = FW.some(f => f.c === curC);
  CAT_EDIT[id] = { comp: curC, origComp: curC, pls: curPls.length ? curPls : [1], desc: x.desc || '', custom: !inFw && !!x.tags.length, previewConf: x.conf, changed: false };
  rCat();
}
function onCatCompSel(id, val) {
  const ed = CAT_EDIT[id], x = CAT.find(r => r._id === id); if (!ed || !x) return;
  if (val === '__custom__') { ed.custom = true; rCat(); setTimeout(() => $('#ced-inp-' + id)?.focus(), 0); return; }
  ed.custom = false; ed.comp = val; ed.previewConf = nextCatConf(x, ed.comp, ed.pls[0] || 1, ed.desc + '|' + ed.pls.join(',')); ed.changed = true;
  syncCatPreview(id, x, ed);
}
function onCatCustomInp(id, val) {
  const ed = CAT_EDIT[id], x = CAT.find(r => r._id === id); if (!ed || !x) return;
  ed.comp = val.trim() || ed.comp; ed.previewConf = nextCatConf(x, ed.comp, ed.pls[0] || 1, ed.desc + '|' + ed.pls.join(',')); ed.changed = true;
  syncCatPreview(id, x, ed);
}
function onCatPlChk(id, val, checked) {
  const ed = CAT_EDIT[id], x = CAT.find(r => r._id === id); if (!ed || !x) return;
  const p = Number(val);
  let next = checked ? [...new Set([...ed.pls, p])].sort((a, b) => a - b) : ed.pls.filter(n => n !== p);
  if (!next.length) { toast('Select at least one proficiency level'); rCat(); return; }
  ed.pls = next; ed.previewConf = nextCatConf(x, ed.comp, ed.pls[0] || 1, ed.desc + '|' + ed.pls.join(',')); ed.changed = true;
  syncCatPreview(id, x, ed);
}
function onCatDescInCompInp(id, val) {
  const ed = CAT_EDIT[id], x = CAT.find(r => r._id === id); if (!ed || !x) return;
  ed.desc = val; ed.previewConf = nextCatConf(x, ed.comp, ed.pls[0] || 1, ed.desc + '|' + ed.pls.join(',')); ed.changed = true;
  syncCatPreview(id, x, ed);
}
function syncCatPreview(id, x, ed) {
  const pc = $('#ced-pconf-' + id); if (pc) pc.textContent = ed.previewConf + '%';
  const plEl = $('#cat-pl-' + id); if (plEl) plEl.innerHTML = `<span style="display:inline-flex;gap:4px;align-items:center;white-space:nowrap">${ed.pls.map(n => plTag(n)).join('')}</span>`;
  const cc = $('#cat-conf-' + id); if (cc) cc.innerHTML = conf(ed.previewConf);
  const sc = $('#cat-st-' + id); if (sc) sc.innerHTML = pill(ed.previewConf >= thr() ? 'Active' : 'Pending review');
}
function cancelCatEdit(id) { delete CAT_EDIT[id]; rCat(); }
function saveCatEdit(id) {
  const ed = CAT_EDIT[id], x = CAT.find(r => r._id === id); if (!ed || !x) return;
  const comp = (ed.comp || '').trim();
  if (!comp) { toast('Please select or enter a competency'); return; }
  const newPls = (ed.pls && ed.pls.length) ? [...ed.pls].sort((a, b) => a - b) : [1];
  if (!ed.changed) ed.previewConf = nextCatConf(x, comp, newPls[0], ed.desc + '|' + newPls.join(','));
  const oldComp = x.tags[0]?.[0] || 'Unmapped', oldPls = catPlsFor(x, oldComp), oldConf = x.conf, oldDesc = x.desc || '';
  const oldPlsTxt = oldPls.map(n => 'P' + n).join(', ');
  const newPlsTxt = newPls.map(n => 'P' + n).join(', ');
  const old = x.tags[0] ? `${oldComp} ${oldPlsTxt} (${oldConf}%)` : `Unmapped (${oldConf}%)`;
  const newDesc = (ed.desc != null && ed.desc.trim()) ? ed.desc.trim() : oldDesc;
  const today = new Date().toISOString().slice(0, 10);
  const parts = [];
  if (oldComp !== comp || oldPlsTxt !== newPlsTxt) parts.push(`Mapping ${oldComp}${oldPlsTxt ? ' ' + oldPlsTxt : ''} → ${comp} ${newPlsTxt}`);
  if (oldDesc !== newDesc) parts.push('Course details updated');
  parts.push(`Confidence ${oldConf}% → ${ed.previewConf}%`);
  const otherTags = (x.tags || []).filter(t => norm(t[0]) !== norm(ed.origComp) && norm(t[0]) !== norm(comp));
  x.tags = [...newPls.map(pl => [comp, pl]), ...otherTags];
  x.desc = newDesc;
  x.conf = ed.previewConf;
  x.st = x.conf >= thr() ? 'Active' : 'Pending review';
  x.upd = today;
  _CAT_IDX = null;
  if (x.hist && x.hist.length) {
    const prev = x.hist[x.hist.length - 1];
    prev.to = today;
    const revN = x.hist.filter(h => h.v.startsWith(today.slice(0, 7))).length + 1;
    const vLbl = revN > 1 ? `${today.slice(0, 7)}·r${revN}` : today.slice(0, 7);
    x.hist.push({ v: vLbl, from: today, to: null, by: 'Nurul Hassan · Manual edit', type: x.type, dur: x.dur, desc: x.desc, tags: JSON.parse(JSON.stringify(x.tags)), conf: x.conf, st: x.st, chg: parts.join('; ') });
  }
  delete CATROWVER[id];
  delete CAT_EDIT[id];
  AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Edit competency', tg: 'CAT ' + x.t, d: `${old} → ${comp} ${newPlsTxt} (${x.conf}%)` });
  toast(`Saved competency & course details · Confidence ${x.conf}%`);
  rCat(); rFw(); rFwCards(); rDash();
}
function catCompCell(x, h) {
  const ed = CAT_EDIT[x._id];
  const curH = h || catAt(x);
  const isOld = curH && curH.to != null;
  if (!ed) {
    const tags = curH.tags || x.tags;
    const compNames = [...new Set(tags.map(t => t[0]))];
    const tagsHtml = compNames.length ? compNames.map(cn => `<span class="tag cat-tag" onclick="startCatEdit('${x._id}')" title="Click to edit competency manually">${esc(cn)}</span>`).join('') : '<span class="dim">Needs manual entry</span>';
    const chgHint = isOld ? `<div class="dim" style="font-size:11px;margin-top:2px" title="${esc(curH.chg)}">${esc(curH.chg)}</div>` : '';
    return `<div>${tagsHtml}${chgHint}</div>`;
  }
  const comps = [...new Set(FW.map(f => f.c))];
  if (ed.comp && !comps.includes(ed.comp) && !ed.custom) comps.unshift(ed.comp);
  const opts = comps.map(c => `<option value="${esc(c)}" ${!ed.custom && c === ed.comp ? 'selected' : ''}>${esc(c)}</option>`).join('') + `<option value="__custom__" ${ed.custom ? 'selected' : ''}>+ Custom competency…</option>`;
  return `<div class="cat-editor">
  <div class="celbl">Competency</div>
  <div class="cerow">
    <select class="cesel" onchange="onCatCompSel('${x._id}',this.value)" aria-label="Competency">${opts}</select>
  </div>
  ${ed.custom ? `<input type="text" id="ced-inp-${x._id}" value="${esc(ed.comp)}" placeholder="Enter competency name…" oninput="onCatCustomInp('${x._id}',this.value)">` : ''}
  <div class="celbl">Proficiency level(s)</div>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px">
    ${[1, 2, 3, 4, 5].map(n => `<label style="display:inline-flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="checkbox" ${ed.pls.includes(n) ? 'checked' : ''} onchange="onCatPlChk('${x._id}',${n},this.checked)"><span>P${n}</span></label>`).join('')}
  </div>
  <div class="celbl">Course Details (Description)</div>
  <textarea rows="2" oninput="onCatDescInCompInp('${x._id}',this.value)" placeholder="Edit course details / description…">${esc(ed.desc || '')}</textarea>
  <div class="cefoot">
    <span class="hint">Confidence: <b class="mono" id="ced-pconf-${x._id}">${ed.previewConf}%</b></span>
    <span class="acts">
      <button class="btn sm" onclick="cancelCatEdit('${x._id}')">Cancel</button>
      <button class="btn sm pri" onclick="saveCatEdit('${x._id}')">Save</button>
    </span>
  </div>
</div>`;
}
let EC_MODAL = null;
function openCourseModal(id) {
  const x = CAT.find(r => r._id === id); if (!x) return;
  const curC = x.tags[0]?.[0] || FW[0].c;
  const curPls = catPlsFor(x, curC);
  const initPls = curPls.length ? curPls : [1];
  const comps = [...new Set(FW.map(f => f.c))];
  if (curC && !comps.includes(curC)) comps.unshift(curC);
  EC_MODAL = { id, origComp: curC, previewConf: x.conf, changed: false };
  $('#ecModalTitle').textContent = 'Edit course';
  $('#ecModalSub').textContent = `${x.t} · Version ${x.hist?.[x.hist.length - 1]?.v || x.upd}`;
  const types = ['e-Learning', 'Workshop', 'SS', 'In-house'];
  if (x.type && !types.includes(x.type)) types.push(x.type);
  const srcs = ['Public', 'In-house'];
  $('#ecModalBody').innerHTML = `
  <label class="fld">Course name<input type="text" id="ecTitle" value="${esc(x.t)}" oninput="onEcModalChange()"></label>
  <label class="fld">Course details (description &amp; learning objectives)<textarea id="ecDesc" rows="3" style="font:inherit;font-size:13px;padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:var(--panel);color:var(--ink);resize:vertical" oninput="onEcModalChange()">${esc(x.desc || '')}</textarea></label>
  <div class="grid g2" style="gap:10px">
    <label class="fld">Provider<input type="text" id="ecProv" value="${esc(x.p === '—' ? '' : x.p)}" placeholder="e.g. CSC, LTA Academy" oninput="onEcModalChange()"></label>
    <label class="fld">Type / Format<select id="ecType" onchange="onEcModalChange()">${types.map(t => `<option ${t === x.type ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>
    <label class="fld">Duration<input type="text" id="ecDur" value="${esc(x.dur === '—' ? '' : x.dur)}" placeholder="e.g. 30 mins, 4 hrs, 2 days" oninput="onEcModalChange()"></label>
    <label class="fld">Source<select id="ecSrc" onchange="onEcModalChange()">${srcs.map(s => `<option ${s === x.src ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></label>
  </div>
  <label class="fld">Course URL / Reference code<input type="text" id="ecUrl" value="${esc(x.url === '—' ? '' : x.url)}" placeholder="e.g. learn.gov.sg · DLC-MED01" oninput="onEcModalChange()"></label>
  <label class="fld">Competency<select id="ecComp" onchange="onEcCompChange()">${comps.map(c => `<option value="${esc(c)}" ${c === curC ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
  <div class="fld">Proficiency level(s) <span class="dim" style="font-weight:400">(select one or more, e.g. P1, P2)</span>
    <div style="display:flex;gap:8px;flex-wrap:wrap;padding:6px 0">
      ${[1, 2, 3, 4, 5].map(n => `<label style="display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border:1px solid var(--line);border-radius:6px;background:var(--panel2);cursor:pointer"><input type="checkbox" class="ecPlChk" value="${n}" ${initPls.includes(n) ? 'checked' : ''} onchange="onEcModalChange()">${plTag(n)}</label>`).join('')}
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;background:var(--panel2);border:1px solid var(--line2);border-radius:6px;padding:8px 12px;margin-top:4px">
    <span class="hint">Updated AI mapping confidence &amp; status:</span>
    <span id="ecConfWrap" style="display:inline-flex;align-items:center;gap:8px">${conf(x.conf)} ${pill(x.st)}</span>
  </div>
  <div class="mfoot">
    <button class="btn lg" onclick="$('#m-course').hidden=true">Cancel</button>
    <button class="btn pri lg" onclick="saveCourseModal()">Save changes</button>
  </div>`;
  $('#m-course').hidden = false;
  setTimeout(() => $('#ecTitle')?.focus(), 0);
}
function onEcCompChange() {
  if (!EC_MODAL) return;
  const x = CAT.find(r => r._id === EC_MODAL.id); if (!x) return;
  const comp = $('#ecComp').value;
  const existingPls = catPlsFor(x, comp);
  if (existingPls.length) {
    document.querySelectorAll('.ecPlChk').forEach(cb => { cb.checked = existingPls.includes(+cb.value); });
    EC_MODAL.origComp = comp;
  }
  onEcModalChange();
}
function onEcModalChange() {
  if (!EC_MODAL) return;
  const x = CAT.find(r => r._id === EC_MODAL.id); if (!x) return;
  const comp = $('#ecComp').value;
  const plsList = [...document.querySelectorAll('.ecPlChk:checked')].map(cb => +cb.value);
  const desc = $('#ecTitle').value + ' ' + $('#ecDesc').value + '|' + plsList.join(',');
  EC_MODAL.previewConf = nextCatConf(x, comp, plsList[0] || 1, desc);
  EC_MODAL.changed = true;
  const st = EC_MODAL.previewConf >= thr() ? 'Active' : 'Pending review';
  const w = $('#ecConfWrap'); if (w) w.innerHTML = `${conf(EC_MODAL.previewConf)} ${pill(st)}`;
}
function saveCourseModal() {
  if (!EC_MODAL) return;
  const x = CAT.find(r => r._id === EC_MODAL.id); if (!x) return;
  const t = $('#ecTitle').value.trim();
  if (!t) { toast('Course name is required'); return; }
  const plsList = [...document.querySelectorAll('.ecPlChk:checked')].map(cb => +cb.value).sort((a, b) => a - b);
  if (!plsList.length) { toast('Select at least one proficiency level (P1–P5)'); return; }
  const desc = $('#ecDesc').value.trim() || x.desc, p = $('#ecProv').value.trim() || '—', type = $('#ecType').value, dur = $('#ecDur').value.trim() || '—', src = $('#ecSrc').value, url = $('#ecUrl').value.trim() || '—', comp = $('#ecComp').value;
  if (!EC_MODAL.changed) EC_MODAL.previewConf = nextCatConf(x, comp, plsList[0], t + ' ' + desc + '|' + plsList.join(','));
  const parts = [];
  if (x.t !== t) parts.push(`Name “${x.t}” → “${t}”`);
  if (x.p !== p) parts.push(`Provider ${x.p} → ${p}`);
  if (x.type !== type) parts.push(`Type ${x.type} → ${type}`);
  if (x.dur !== dur) parts.push(`Duration ${x.dur} → ${dur}`);
  if (x.src !== src) parts.push(`Source ${x.src} → ${src}`);
  if (x.url !== url) parts.push('URL updated');
  if ((x.desc || '') !== desc) parts.push('Course details updated');
  const oldC = EC_MODAL.origComp || x.tags[0]?.[0] || 'Unmapped';
  const oldPls = catPlsFor(x, oldC);
  const oldPlsTxt = oldPls.map(n => 'P' + n).join(', ');
  const newPlsTxt = plsList.map(n => 'P' + n).join(', ');
  if (oldC !== comp || oldPlsTxt !== newPlsTxt) parts.push(`Mapping ${oldC}${oldPlsTxt ? ' ' + oldPlsTxt : ''} → ${comp} ${newPlsTxt}`);
  parts.push(`Confidence ${x.conf}% → ${EC_MODAL.previewConf}%`);
  const today = new Date().toISOString().slice(0, 10);
  x.t = t; x.desc = desc; x.p = p; x.type = type; x.dur = dur; x.src = src; x.url = url;
  const otherTags = (x.tags || []).filter(tag => norm(tag[0]) !== norm(oldC) && norm(tag[0]) !== norm(comp));
  x.tags = [...plsList.map(pl => [comp, pl]), ...otherTags];
  x.conf = EC_MODAL.previewConf;
  x.st = x.conf >= thr() ? 'Active' : 'Pending review';
  x.upd = today;
  _CAT_IDX = null;
  if (x.hist && x.hist.length) {
    const prev = x.hist[x.hist.length - 1];
    prev.to = today;
    const revN = x.hist.filter(h => h.v.startsWith(today.slice(0, 7))).length + 1;
    const vLbl = revN > 1 ? `${today.slice(0, 7)}·r${revN}` : today.slice(0, 7);
    x.hist.push({ v: vLbl, from: today, to: null, by: 'Nurul Hassan · Edit course', type: x.type, dur: x.dur, desc: x.desc, tags: JSON.parse(JSON.stringify(x.tags)), conf: x.conf, st: x.st, chg: parts.join('; ') });
  }
  delete CATROWVER[x._id];
  AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Edit course', tg: 'CAT ' + x.t, d: parts.join('; ') });
  $('#m-course').hidden = true;
  EC_MODAL = null;
  toast(`Course saved · ${newPlsTxt} · Confidence ${x.conf}%`);
  rCat(); rFw(); rFwCards(); rDash();
}
let CAT_DETAIL = null, CAT_DET_Q = '', CAT_DET_TAB = 'rec', CAT_ATTN_ONLY = false;
const CAT_DET_F = { fw: [], lib: [], pl: [], st: [], attn: [] };
let CAT_DET_FILT_OPEN = false, CAT_DET_FILT_CAT = 'all', CAT_DET_FILT_GROUPS = [];
function setCatDetQuery(val) { CAT_DET_Q = val; rCat(); }
function toggleCatDetMs(key, val) {
  const arr = CAT_DET_F[key], s = String(val), i = arr.indexOf(s);
  if (i >= 0) arr.splice(i, 1); else arr.push(s);
  if (key === 'pl') arr.sort((a, b) => Number(a) - Number(b));
  rCat();
}
function toggleSelectAllCatDetFilt() {
  const groups = CAT_DET_FILT_CAT === 'all' ? CAT_DET_FILT_GROUPS : CAT_DET_FILT_GROUPS.filter(g => g.key === CAT_DET_FILT_CAT);
  const allSel = groups.length && groups.every(g => g.opts.every(o => (CAT_DET_F[g.key] || []).includes(String(o.v))));
  groups.forEach(g => {
    CAT_DET_F[g.key] = allSel ? [] : g.opts.map(o => String(o.v));
    if (g.key === 'pl' && !allSel) CAT_DET_F[g.key].sort((a, b) => Number(a) - Number(b));
  });
  rCat();
}
function clearCatDetFilter() {
  CAT_DET_Q = ''; CAT_DET_F.fw = []; CAT_DET_F.lib = []; CAT_DET_F.pl = []; CAT_DET_F.st = []; CAT_DET_F.attn = [];
  rCat();
}
function linkedFrameworksForCourse(c) {
  const h = catAt(c);
  const tagNames = new Set((h.tags || c.tags || []).map(t => norm(t[0])));
  if (!tagNames.size) return [];
  return FW.filter(f => tagNames.has(norm(f.c)) || (f.hist || []).some(o => tagNames.has(norm(o.c || f.c))));
}
let _ASS_CACHE_REV = 0, _ASS_CACHE_KEY = '', _ASS_CACHE = null;
function bumpAssCache() { _ASS_CACHE_REV++; }
function _getCourseAssIdx() {
  const key = `${REC.length}|${ASSESS.length}|${_ASS_CACHE_REV}`;
  if (_ASS_CACHE && _ASS_CACHE_KEY === key) return _ASS_CACHE;
  const compRecsByCourse = new Map();
  const compStaffByCourse = new Map();
  visRec().forEach(r => {
    if (r.st !== 'Completed') return;
    const ck = norm(r.course);
    if (!compRecsByCourse.has(ck)) {
      compRecsByCourse.set(ck, []);
      compStaffByCourse.set(ck, new Set());
    }
    compRecsByCourse.get(ck).push(r);
    compStaffByCourse.get(ck).add(r.id);
  });
  const assByCourse = new Map();
  const assByComp = new Map();
  ASSESS.forEach(a => {
    if (a.course) {
      const ck = norm(a.course);
      if (!assByCourse.has(ck)) assByCourse.set(ck, []);
      assByCourse.get(ck).push(a);
    } else {
      const k = norm(a.c);
      if (!assByComp.has(k)) assByComp.set(k, []);
      assByComp.get(k).push(a);
    }
  });
  _ASS_CACHE = { compRecsByCourse, compStaffByCourse, assByCourse, assByComp };
  _ASS_CACHE_KEY = key;
  return _ASS_CACHE;
}
function courseCompletedAss(c, h = catAt(c)) {
  if (!c) return [];
  const idx = _getCourseAssIdx();
  const ck = norm(c.t);
  const compRecs = idx.compRecsByCourse.get(ck);
  if (!compRecs || !compRecs.length) return [];
  const compStaff = idx.compStaffByCourse.get(ck);
  const compSet = new Set((h.tags || c.tags || []).map(t => norm(t[0])));
  const seen = new Set();
  const out = [];
  const tryPush = a => {
    if (!compStaff.has(a.id)) return;
    const k = `${a.id}|${norm(a.c)}|${a.req}|${a.y}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push(a);
  };
  (idx.assByCourse.get(ck) || []).forEach(tryPush);
  compSet.forEach(cn => (idx.assByComp.get(cn) || []).forEach(tryPush));
  return out.slice(0, compRecs.length);
}

function openCatDetail(id, keepTrail = false, tab = 'rec') {
  CAT_DETAIL = id || null;
  Object.keys(CAT_OBJ_EDIT).forEach(k => delete CAT_OBJ_EDIT[k]);
  CAT_DET_Q = '';
  CAT_DET_F.fw = []; CAT_DET_F.lib = []; CAT_DET_F.pl = []; CAT_DET_F.st = []; CAT_DET_F.attn = [];
  CAT_DET_FILT_OPEN = false; CAT_DET_FILT_CAT = 'all';
  CAT_DET_TAB = tab === 'ass' ? 'ass' : 'rec';
  if (!keepTrail) NAV_TRAIL = id ? [{ label: 'Catalog', fn: () => openCatDetail(null) }] : [];
  if (CUR_PAGE !== 'catalog') { go('catalog', true); return; }
  rCat();
}
function catDetFwCardHtml(c, h, fw) {
  const coursePls = catPlsFor(c, fw.c), fwActivePls = activePlsOf(fw.pl), compArg = escArg(fw.c), courseArg = escArg(c.t);
  const fwConf = norm((h.tags || c.tags || [])[0]?.[0]) === norm(fw.c) ? (h.conf ?? c.conf ?? 0) : pairConf(fw, c);
  const fwFlag = fwConf < 80;
  return `<div class="fw-vbox${fwFlag ? ' flag' : ''}" style="cursor:pointer" onclick="openFwFromCat('${c._id}','${courseArg}','${fw._id}')">
    ${fwFlag ? '<span class="fw-vb-dot" title="Needs review · confidence below 80%"></span>' : ''}
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
      <div style="min-width:0">
        <b style="color:var(--accent)">${esc(fw.c)}</b>
        <div class="dim" style="font-size:12px;margin-top:3px;margin-bottom:6px">${esc(fw.fw)} · ${esc(fw.lib)}</div>
        ${pill(fwDisplayStatus(fw, fw))}
      </div>
      <div class="actc" style="flex:none;display:flex;gap:6px;align-items:center">
        ${CAT_DET_EDIT[c._id]
          ? `<button class="ib del" type="button" title="Move out" aria-label="Move out" onclick="event.stopPropagation();unlinkCourseFromFw('${fw._id}','${c._id}')">${SVG.moveOut}</button>`
          : `<span class="clink" style="font-size:15px;line-height:1.2;flex:none" title="View framework details">→</span>`}
      </div>
    </div>
    <div style="margin:6px 0">${CAT_DET_EDIT[c._id]
      ? `<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap" onclick="event.stopPropagation()">${fwActivePls.map(n => `<button type="button" class="btn sm ${coursePls.includes(n) ? 'pri' : 'out'}" style="padding:2px 7px;min-height:22px;font-size:11px" onclick="event.stopPropagation();toggleCoursePl('${c._id}','${compArg}',${n})">P${n}</button>`).join('')}</div>`
      : pls(fw.pl)}</div>
    <div style="margin-top:auto;padding-top:8px;border-top:1px solid var(--line2);display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px">
      <span class="dim">Confidence</span>
      <span>${conf(fwConf)}</span>
    </div>
  </div>`;
}
function startCatObjEdit(id) {
  CAT_OBJ_EDIT[id] = true;
  rCat();
  setTimeout(() => {
    const el = $('#cat-obj-inp-' + id);
    if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  }, 0);
}
function cancelCatObjEdit(id) {
  delete CAT_OBJ_EDIT[id];
  rCat();
}
function saveCatObjEdit(id) {
  const c = CAT.find(r => r._id === id), inp = $('#cat-obj-inp-' + id);
  if (!c || !inp) return;
  const val = inp.value.trim();
  if (!val) { toast('Learning objective cannot be empty'); return; }
  const h = catAt(c);
  const oldDesc = h.desc || c.desc || '';
  h.desc = val;
  if (!h.to) c.desc = val;
  delete CAT_OBJ_EDIT[id];
  if (oldDesc !== val) AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Edit objective', tg: 'CAT ' + c.t, d: 'Learning objective updated' });
  toast('Learning objective saved');
  rCat();
}
function rCatDetail(c) {
  const tblWrap = $('#catTableWrap'), barEl = $('#catBar'), cardsEl = $('#catCards'), pgEl = $('#pg-catalog'), topActsEl = $('#topActions'), titleEl = $('#title');
  if (topActsEl && CUR_PAGE === 'catalog') topActsEl.innerHTML = '';
  if (titleEl && CUR_PAGE === 'catalog') titleEl.textContent = 'Course details';
  if (tblWrap) tblWrap.hidden = true;
  if (pgEl) pgEl.hidden = true;
  const h = catAt(c), fws = linkedFrameworksForCourse(c), recs = visRec().filter(r => norm(r.course) === norm(c.t)), u = courseHref(c.url), ql = (CAT_DET_Q || '').trim().toLowerCase();
  const fwConfOf = fw => norm((h.tags || c.tags || [])[0]?.[0]) === norm(fw.c) ? (h.conf ?? c.conf ?? 0) : pairConf(fw, c);
  const filteredFws = fws.filter(fw => {
    const coursePls = catPlsFor(c, fw.c), fwAttn = fwConfOf(fw) < 80 ? 'Needs attention' : 'Healthy';
    return (!ql || (fw.c + ' ' + fw.fw + ' ' + fw.lib).toLowerCase().includes(ql)) && (!CAT_DET_F.fw.length || CAT_DET_F.fw.includes(fw.fw)) && (!CAT_DET_F.lib.length || CAT_DET_F.lib.includes(fw.lib)) && (!CAT_DET_F.pl.length || coursePls.some(n => CAT_DET_F.pl.includes(String(n)))) && (!CAT_DET_F.st.length || CAT_DET_F.st.includes(fw.st || 'Active')) && (!CAT_DET_F.attn.length || CAT_DET_F.attn.includes(fwAttn));
  });
  const catFiltGroups = [
    { key: 'fw', label: 'Framework', opts: [...new Set(fws.map(fw => fw.fw))].filter(Boolean).sort().map(v => ({ v, l: v })) },
    { key: 'lib', label: 'Category', opts: [...new Set(fws.map(fw => fw.lib))].filter(Boolean).sort().map(v => ({ v, l: v })) },
    { key: 'pl', label: 'Proficiency level', opts: [1, 2, 3, 4, 5].map(n => ({ v: String(n), l: 'P' + n })) },
    { key: 'st', label: 'Status', opts: [...new Set(['Active', 'Inactive', ...fws.map(fw => fw.st || 'Active')])].filter(Boolean).map(s => ({ v: s, l: s })) },
    { key: 'attn', label: 'Review status', opts: [{ v: 'Healthy', l: 'Healthy' }, { v: 'Needs attention', l: 'Needs attention' }] }
  ].filter(g => g.opts.length);
  CAT_DET_FILT_GROUPS = catFiltGroups;
  const catChips = [
    CAT_DET_Q ? `<button class="fc-chip" type="button" onclick="setCatDetQuery('')">Search: ${esc(CAT_DET_Q)} ×</button>` : '',
    ...CAT_DET_F.fw.map(v => `<button class="fc-chip" type="button" onclick="toggleCatDetMs('fw','${escArg(v)}')">Framework: ${esc(v)} ×</button>`),
    ...CAT_DET_F.lib.map(v => `<button class="fc-chip" type="button" onclick="toggleCatDetMs('lib','${escArg(v)}')">Category: ${esc(v)} ×</button>`),
    ...CAT_DET_F.pl.map(n => `<button class="fc-chip" type="button" onclick="toggleCatDetMs('pl','${n}')">Level: P${n} ×</button>`),
    ...CAT_DET_F.st.map(v => `<button class="fc-chip" type="button" onclick="toggleCatDetMs('st','${escArg(v)}')">Status: ${esc(v)} ×</button>`),
    ...CAT_DET_F.attn.map(v => `<button class="fc-chip" type="button" onclick="toggleCatDetMs('attn','${escArg(v)}')">Health: ${esc(v)} ×</button>`)
  ].filter(Boolean);
  const keepCatFwFocus = document.activeElement && document.activeElement.id === 'catDetFwQ';
  const catFwSelStart = keepCatFwFocus ? document.activeElement.selectionStart : null;
  const verPicker = renderVerPickHtml(!h.to ? `${h.v} · Current` : h.v, esc(h.chg || ''), 'Select course version', `CATROWVER['${c._id}']=this.value;rCat()`, [...(c.hist || [])].reverse().map(o => `<option value="${esc(o.v)}" ${o.v === h.v ? 'selected' : ''}>${esc(o.v)}${!o.to ? ' · Current' : ''}</option>`).join(''));
  if (!NAV_TRAIL.length) NAV_TRAIL = [{ label: 'Catalog', fn: () => openCatDetail(null) }];
  if (barEl) barEl.innerHTML = renderTrailHtml(c.t);
  if (!cardsEl) return;
  cardsEl.hidden = false;
  const linkedFwSet = new Set(fws.map(f => f._id)), aq = (CAT_ADD_Q[c._id] || '').trim().toLowerCase();
  const unlinkedFws = CAT_ADD_OPEN[c._id] ? FW.filter(f => !linkedFwSet.has(f._id) && (!aq || (f.c + ' ' + f.fw + ' ' + f.lib).toLowerCase().includes(aq))).map(fw => ({ fw, lConf: pairConf(fw, c) })).sort((a, b) => b.lConf - a.lConf).slice(0, 20) : [];
  const defPls = catPlsFor(c), useArg = defPls.length ? defPls.join(',') : '2';
  cardsEl.innerHTML = `<div class="fc-det-card">
    <div class="fc-det-head">
      <div><div class="fc-dir-title" style="font-size:17px"><span>${u ? `<a class="clink" href="${u}" target="_blank" rel="noopener">${esc(c.t)}</a>` : esc(c.t)}</span></div></div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${(c.hist && c.hist.length) ? verPicker : ''}</div>
    </div>
    <div style="padding:14px 20px;border-bottom:1px solid var(--line2);background:var(--panel2)">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px 16px;font-size:12.5px">
        <div><div class="dim" style="font-size:12px;margin-bottom:3px">Status</div>${pill(h.st || 'Active')}</div>
        <div><div class="dim" style="font-size:12px;margin-bottom:3px">Provider</div><b>${esc(c.p || '—')}</b></div>
        <div><div class="dim" style="font-size:12px;margin-bottom:3px">Source</div><span class="pill p-dim">${esc(c.src || '—')}</span></div>
        <div><div class="dim" style="font-size:12px;margin-bottom:3px">Type</div><b>${esc(h.type || '—')}</b></div>
        <div><div class="dim" style="font-size:12px;margin-bottom:3px">Duration</div><b>${esc(h.dur || '—')}</b></div>
      </div>
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--line2)">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px">
          <div class="dim" style="font-size:12px">Learning objective</div>
          ${!CAT_OBJ_EDIT[c._id] ? `<button class="btn sm out" type="button" style="display:inline-flex;align-items:center;gap:5px;padding:3px 9px;min-height:26px;font-size:11.5px" onclick="startCatObjEdit('${c._id}')">${EDIT_PEN_ICO}<span>Edit</span></button>` : ''}
        </div>
        ${CAT_OBJ_EDIT[c._id] ? `<div style="display:flex;flex-direction:column;gap:8px">
          <textarea id="cat-obj-inp-${c._id}" rows="3" style="width:100%;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--ink);font:inherit;font-size:13px;line-height:1.45;resize:vertical" placeholder="Enter course learning objective…">${esc(h.desc || c.desc || '')}</textarea>
          <div style="display:flex;justify-content:flex-end;gap:8px">
            <button class="btn sm out" type="button" onclick="cancelCatObjEdit('${c._id}')">Cancel</button>
            <button class="btn sm pri" type="button" onclick="saveCatObjEdit('${c._id}')">Save</button>
          </div>
        </div>` : `<div style="font-size:13px;line-height:1.5;color:var(--ink)">${esc(h.desc || c.desc || '—')}</div>`}
      </div>
    </div>
    <div style="padding:14px 20px;border-bottom:1px solid var(--line2);display:flex;align-items:center;gap:18px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
        <div class="fc-det-stat" style="padding:0"><b>${fws.length}</b><span>Linked framework${fws.length === 1 ? '' : 's'}</span></div>
        <div class="fc-det-stat" style="padding:0"><b>${recs.length}</b><span>Training record${recs.length === 1 ? '' : 's'}</span></div>
      </div>
      <div style="margin-left:auto;display:flex;align-items:center;gap:8px">
        <button class="btn sm" type="button" style="display:inline-flex;align-items:center;justify-content:space-between;gap:8px" onclick="openCourseRecords('${c._id}')"><span>View records (${recs.length})</span><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></button>
      </div>
    </div>
    <div class="fc-det-body">
      <div class="fc-det-bar">
        <div style="display:flex;align-items:center;gap:10px"><b style="font-size:14px">Linked frameworks</b><span class="fw-lpill ${fws.length >= 2 ? 'many' : fws.length === 1 ? 'one' : 'zero'}">${fws.length} Framework${fws.length === 1 ? '' : 's'}</span></div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <button class="btn sm ${CAT_ADD_OPEN[c._id] ? 'out' : 'pri'}" type="button" onclick="CAT_ADD_OPEN['${c._id}']=!CAT_ADD_OPEN['${c._id}'];rCat();if(CAT_ADD_OPEN['${c._id}'])setTimeout(()=>$('#cat-add-q-${c._id}')?.focus(),0)">${CAT_ADD_OPEN[c._id] ? 'Close' : '+ Add framework'}</button>
          ${editToggleBtnHtml(CAT_DET_EDIT[c._id], `CAT_DET_EDIT['${c._id}']=!CAT_DET_EDIT['${c._id}'];rCat()`)}
        </div>
      </div>
      ${CAT_ADD_OPEN[c._id] ? `<div class="fw-add-wrap" style="border-top:0;padding-top:0;margin-bottom:14px">
        <div class="fw-add-inp">${SVG.search}<input type="text" id="cat-add-q-${c._id}" value="${esc(CAT_ADD_Q[c._id] || '')}" placeholder="Search frameworks to move in…" oninput="CAT_ADD_Q['${c._id}']=this.value;rCat();setTimeout(()=>{const el=$('#cat-add-q-${c._id}');if(el){el.focus();el.setSelectionRange(el.value.length,el.value.length);}},0)"></div>
        <div class="fw-add-drop">${unlinkedFws.length ? unlinkedFws.map(({ fw, lConf }) => `<div class="fw-add-item"><div style="flex:1;min-width:0"><b>${esc(fw.c)}</b> <span class="dim">· ${esc(fw.fw)} · ${esc(fw.lib)}</span></div><div style="display:flex;align-items:center;gap:14px;flex:none">${conf(lConf)}<button class="btn sm pri" type="button" onclick="linkCourseToFw('${fw._id}','${c._id}','${useArg}',${lConf})">+ Move in</button></div></div>`).join('') : `<div class="dim" style="padding:10px;text-align:center">No matching unlinked frameworks.</div>`}</div>
      </div>` : ''}
      ${fws.length ? renderDetFilterSearchBarHtml({
        searchId: 'catDetFwQ', searchVal: CAT_DET_Q, searchPlaceholder: 'Search linked frameworks…', onSearchInput: 'setCatDetQuery(this.value)',
        wrapId: 'catDetFiltWrap', open: CAT_DET_FILT_OPEN, onToggleOpen: 'CAT_DET_FILT_OPEN=!CAT_DET_FILT_OPEN;rCat()', onDone: 'CAT_DET_FILT_OPEN=false;rCat()',
        catKey: CAT_DET_FILT_CAT, onCatChange: 'CAT_DET_FILT_CAT=this.value;rCat()', groups: catFiltGroups, filters: CAT_DET_F,
        onToggleOpt: (k, v) => `toggleCatDetMs('${k}','${escArg(v)}')`, onSelectAll: 'toggleSelectAllCatDetFilt()', onClearAll: 'clearCatDetFilter()',
        shownCount: filteredFws.length, totalCount: fws.length, noun: 'framework', appliedChips: catChips
      }) : ''}
      ${filteredFws.length ? `<div class="fw-vgrid">${filteredFws.map(fw => catDetFwCardHtml(c, h, fw)).join('')}</div>` : `<div class="empty">${fws.length ? 'No linked frameworks match these filters.' : 'No frameworks linked to this course yet.'}</div>`}
    </div>
  </div>`;
  if (keepCatFwFocus) { const inp = $('#catDetFwQ'); if (inp) { inp.focus(); if (catFwSelStart != null) inp.setSelectionRange(catFwSelStart, catFwSelStart); } }
}
function rCatTable() {
  const tblWrap = $('#catTableWrap'), barEl = $('#catBar'), cardsEl = $('#catCards'), pgEl = $('#pg-catalog'), topActsEl = $('#topActions'), titleEl = $('#title');
  if (topActsEl && CUR_PAGE === 'catalog') topActsEl.innerHTML = TOPACT.catalog || '';
  if (titleEl && CUR_PAGE === 'catalog') titleEl.textContent = TITLES.catalog;
  const cats = visCat(), catAttnTotal = cats.filter(x => isCourseFlagged(x, catAt(x))).length;
  if (barEl) barEl.innerHTML = `<div class="fc-panel"><div class="fc-toolbar"><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">${renderFwCatToggleHtml('catalog')}</div><div class="fc-toolbar-r">${attnControlsHtml('catalog', catAttnTotal, CAT_ATTN_ONLY, "CAT_ATTN_ONLY=!CAT_ATTN_ONLY;libState('catalog').page=1;rCat()")}</div></div></div>`;
  if (tblWrap) tblWrap.hidden = false;
  if (cardsEl) cardsEl.hidden = true;
  if (pgEl) pgEl.hidden = false;
  libTable('catalog', '#tCat', [
    { key: 't', label: 'Course', type: 'search', get: x => x.t + ' ' + (x.desc || ''), csv: x => x.t }, { key: 'p', label: 'Provider', type: 'filter', get: x => x.p }, { key: 'type', label: 'Type', type: 'filter', get: x => catAt(x).type },
    { key: 'dur', label: 'Duration', type: '', get: x => catAt(x).dur }, { key: 'src', label: 'Source', type: 'filter', get: x => x.src },
    { key: 'st', label: 'Status', type: 'filter', get: x => catAt(x).st }, { key: 'upd', label: 'Last updated', type: 'sort', get: x => catAt(x).from || x.upd }],
    CAT_ATTN_ONLY ? cats.filter(x => isCourseFlagged(x, catAt(x))) : cats, x => {
      const h = catAt(x), ed = CAT_EDIT[x._id], cVal = ed ? ed.previewConf : h.conf, stVal = ed ? (cVal >= thr() ? 'Active' : 'Pending review') : h.st;
      const catFlag = ed ? (cVal < thr() || stVal !== 'Active' || (x.rating > 0 && x.rating < 4.5)) : isCourseFlagged(x, h);
      const u = courseHref(x.url);
      return `<tr class="${catFlag ? 'flag-row' : ''}"><td class="wrap">${u ? `<a class="clink" href="${u}" target="_blank" rel="noopener" title="Open course page">${esc(x.t)}</a>` : esc(x.t)}</td><td>${x.p}</td><td style="white-space:nowrap;min-width:96px">${h.type}</td><td style="white-space:nowrap">${h.dur}</td><td><span class="pill p-dim">${x.src}</span></td><td id="cat-st-${x._id}">${pill(stVal)}</td><td class="mono dim" style="white-space:nowrap">${h.from || x.upd}</td><td class="actc"><button class="btn sm" style="border:0;background:transparent;color:var(--accent)" type="button" title="View course details" aria-label="View course details" onclick="openCatDetail('${x._id}')">→</button></td></tr>`;
    });
}
function rCat() {
  renderCrumbAndFlow('catalog');
  rJobs('catalog');
  if (CAT_DETAIL) {
    const c = CAT.find(r => r._id === CAT_DETAIL);
    if (c) return rCatDetail(c);
    CAT_DETAIL = null;
  }
  rCatTable();
}
let REC_ATTN_ONLY = false;
function rRec() {
  renderCrumbAndFlow('records');
  rJobs('records');
  const isRecFlagged = x => x.conf < thr() || (x.st !== 'Completed' && x.st !== 'In progress');
  const recBase = (NAV_TRAIL.length && FLOW_CTX.courseTitle)
    ? visRec().filter(r => norm(r.course) === norm(FLOW_CTX.courseTitle))
    : visRec();
  const recBarEl = $('#recordsBar');
  if (recBarEl) recBarEl.innerHTML = renderAttnBarHtml('records', recBase.length, 'record', recBase.filter(isRecFlagged).length, REC_ATTN_ONLY, "REC_ATTN_ONLY=!REC_ATTN_ONLY;libState('records').page=1;rRec()");
  const recRows = REC_ATTN_ONLY ? recBase.filter(isRecFlagged) : recBase;
  libTable('records', '#tRec', [
    { key: 'id', label: 'Staff', type: 'search', get: x => x.id }, { key: 'course', label: 'Course', type: 'search', get: x => x.course },
    { key: 'date', label: 'Date', type: 'sort', get: x => x.date }, { key: 'h', label: 'Hours', type: 'sort', num: true, get: x => x.h },
    { key: 'pl', label: 'Level', type: 'filter', get: x => x.pl ? 'PL' + x.pl : '—' }, { key: 'st', label: 'Status', type: 'filter', get: x => x.st }],
    recRows, x => `<tr class="${isRecFlagged(x) ? 'flag-row' : ''}"><td class="mono">${x.id}</td><td class="wrap">${esc(x.course)}</td><td class="mono dim">${x.date}</td><td class="num mono">${x.h}</td><td>${x.pl ? plTag(x.pl) : '<span class="dim">—</span>'}</td><td>${pill(x.st)}</td></tr>`, { noAct: true });
}
