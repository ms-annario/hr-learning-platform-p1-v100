/* ---------- HELPERS ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const escArg = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const activePlsOf = pl => [1, 2, 3, 4, 5].filter(n => pl && pl[n - 1]);
const isAssMeeting = a => a && (a.rating === 'Meeting' || a.rating === 'Exceeding');
const meetColor = pct => pct >= 80 ? 'var(--good)' : pct >= 50 ? 'var(--warn)' : 'var(--bad)';
const renderVerPickHtml = (lbl, tip, aria, onchangeExpr, optsHtml) =>
  `<span class="verpick" title="${tip}"><span>${esc(lbl)}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg><select${aria ? ` aria-label="${esc(aria)}"` : ''} onchange="${onchangeExpr}">${optsHtml}</select></span>`;
const renderPagerHtml = (total, page, pages, pageExpr, extraHtml = '') => {
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return `<span class="tot">Total ${total} items</span><button ${page <= 1 ? 'disabled' : ''} onclick="${pageExpr(page - 1)}" aria-label="Previous">‹</button>${nums.map(n => n === '…' ? '<span class="el">···</span>' : `<button class="${n === page ? 'on' : ''}" onclick="${pageExpr(n)}">${n}</button>`).join('')}<button ${page >= pages ? 'disabled' : ''} onclick="${pageExpr(page + 1)}" aria-label="Next">›</button>${extraHtml}`;
};
const pill = (txt) => {
  const m = { 'Active': 'good', 'Completed': 'good', 'Mapped': 'good', 'Done': 'good', 'Meeting': 'good', 'Exceeding': 'good', 'In progress': 'rev', 'In Progress': 'acc', 'Open': 'rev', 'Pending': 'rev', 'Pending review': 'rev', 'Needs review': 'rev', 'Below': 'warn', 'Idle 68 days': 'warn', 'Invalid': 'bad', 'Deactivated': 'bad', 'Inactive': 'dim', 'Superseded': 'dim', 'Approved': 'good', 'Rejected': 'bad', 'Deferred': 'dim', 'Corrected': 'acc' };
  let k = m[txt] || (txt.startsWith('Failed') ? 'bad' : 'dim'); return `<span class="pill p-${k}">${esc(txt)}</span>`;
};
const conf = v => v ? `<span class="conf ${v < thr() ? 'low' : ''}"><b style="--w:${v}%"></b>${v}%</span>` : '<span class="dim">—</span>';
const SET = { thr: 80, idleDays: 90, remind: [60, 75], thrBy: 'Nurul Hassan', thrOn: '12 Nov 2026', idleBy: 'Nurul Hassan', idleOn: '7 May 2026' };
const thr = () => SET.thr;
const PL_COLORS = {
  1: 'color:var(--accent);background:var(--accent-soft)',
  2: 'color:var(--good);background:var(--good-soft)',
  3: 'color:var(--warn);background:var(--warn-soft)',
  4: 'color:var(--review);background:var(--review-soft)',
  5: 'color:var(--bad);background:var(--bad-soft)'
};
const plTag = (n, extra = '') => `<span class="tag mono" style="margin:0;font-weight:600;border-color:transparent;${PL_COLORS[n] || PL_COLORS[1]};${extra}">P${n}</span>`;
const pls = (a, badLvls = null) => {
  const idx = a.map((x, i) => x ? i + 1 : 0).filter(Boolean);
  if (!idx.length) return '<span class="dim">—</span>';
  return `<span style="display:inline-flex;flex-wrap:wrap;gap:4px;align-items:center">${idx.map(n => plTag(n, badLvls && badLvls.has(n) ? 'background:var(--bad);color:#fff' : '')).join('')}</span>`;
};
const tbl = (el, head, rows, empty = 'No rows match.') => { el.innerHTML = `<tr>${head.map(h => `<th class="${h.startsWith('#') ? 'num' : ''}">${h.replace('#', '')}</th>`).join('')}</tr>` + (rows.length ? rows.join('') : `<tr><td colspan="${head.length}"><div class="empty">${empty}</div></td></tr>`); };
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t._x); t._x = setTimeout(() => t.classList.remove('on'), 1800); };
const q = id => ($(id).value || '').toLowerCase();


const _NORM_M = new Map();
const norm = s => { let v = _NORM_M.get(s); if (v === undefined) { v = s.toLowerCase().replace(/^ifd /, '').replace(/mgmt|mgt/g, 'management').replace(/[^a-z0-9]/g, ''); _NORM_M.set(s, v); } return v; };

const PROG = {};
const SVG = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h18l-7 8v6l-4-2v-4L3 5z"/></svg>',
  sort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h10M4 12h7M4 17h4"/><path d="M17 8v10"/><path d="M14 15l3 3 3-3"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  hist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M4 20h16"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  del: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/></svg>',
  moveOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
};
const EDIT_PEN_ICO = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
const EDIT_DONE_ICO = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
const editToggleBtnHtml = (on, onclickExpr) => `<button class="btn sm ${on ? 'pri' : 'out'}" type="button" style="display:inline-flex;align-items:center;justify-content:center;padding:6px 8px" title="${on ? 'Done editing' : 'Edit'}" aria-label="${on ? 'Done editing' : 'Edit'}" onclick="${onclickExpr}">${on ? EDIT_DONE_ICO : EDIT_PEN_ICO}</button>`;
const ARR = { FW, ASSESS, CAT, REC };
const UPT = {
  fw: { t: 'Competency framework', f: 'Competency Bank .xlsx', cols: 'Framework, Library, Competency, PL1–PL5 text', arr: 'FW' },
  assess: { t: 'Competency assessment', f: 'Workday export .csv', cols: 'Year, Employee ID, Competency, Rating, Required', arr: 'ASSESS' },
  catalog: { t: 'Training catalog', f: 'Functional programmes .xlsx', cols: 'Title, Objective, Duration, Type, Provider, URL', arr: 'CAT' },
  records: { t: 'Learning records', f: 'Workday learning .csv', cols: 'Employee ID, Course, Provider, Date, Duration', arr: 'REC' },
};

/* ---------- MEANING SEARCH ---------- */
const SYN = {
  stakeholder: ['engagement', 'communication', 'mediation', 'negotiation', 'dispute', 'public', 'community', 'partner', 'resident', 'agency', 'consultation'],
  manag: ['management', 'manage', 'managing', 'lead', 'coordinat', 'control', 'administration', 'handling'], safety: ['wsh', 'health', 'hazard', 'risk', 'incident', 'accident'],
  environment: ['eia', 'environmental', 'sustainability', 'noise', 'pollution'], cost: ['budget', 'estimation', 'finance', 'forecast'], quality: ['iso', 'audit', 'assurance', 'inspection'],
  investigat: ['interview', 'case', 'evidence', 'incident', 'root'], enforce: ['regulatory', 'compliance', 'traffic', 'patrol'], project: ['schedule', 'planning', 'primavera', 'p6', 'programme'],
  contract: ['procurement', 'tender', 'claims', 'variation'], communicat: ['engagement', 'stakeholder', 'public', 'outreach', 'consultation'], people: ['stakeholder', 'community', 'public', 'resident'],
  conflict: ['mediation', 'dispute', 'negotiation', 'complaint'], train: ['learning', 'course', 'programme'], report: ['incident', 'audit', 'reporting']
};
const stem = w => w.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(ations?|ments?|ings?|ers?|ies|es|s)$/, '');
function simScore(q, text) {
  const qt = [...new Set(q.toLowerCase().split(/\s+/).map(stem).filter(w => w.length > 2))]; if (!qt.length) return 0;
  const tt = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); const ts = tt.map(stem);
  let tot = 0; qt.forEach(w => {
    let best = 0;
    if (ts.includes(w)) best = 1; else if (ts.some(t => t.startsWith(w) || w.startsWith(t) && t.length > 3)) best = 0.8;
    if (best < 0.7) { const key = Object.keys(SYN).find(k => w.startsWith(k) || k.startsWith(w)); if (key) { const syn = SYN[key].map(stem); if (ts.some(t => syn.some(sy => t.startsWith(sy) || sy.startsWith(t)))) best = Math.max(best, 0.65); } }
    if (best < 0.5) { const hit = Object.entries(SYN).find(([k, v]) => v.map(stem).some(sy => sy === w || sy.startsWith(w))); if (hit && ts.some(t => t.startsWith(hit[0]))) best = Math.max(best, 0.55); }
    tot += best;
  });
  return tot / qt.length;
}
const LIB = {};
const PS = 20;
function libState(k) { const s = LIB[k] || (LIB[k] = { f: {}, fq: {}, sort: null, page: 1 }); s.fq = s.fq || {}; return s; }
function libTable(k, tid, cols, rows, rowHtml, opts = {}) {
  const st = libState(k);
  LIB[k] = st; st.score = {}; const semQ = cols.filter(c => c.type === 'semantic' && st.f[c.key]);
  let out = rows.filter(r => cols.every(c => {
    const v = st.f[c.key], fq = (st.fq[c.key] || '').trim().toLowerCase(); if ((v == null || v === '' || (Array.isArray(v) && !v.length)) && !fq) return true; const cell = c.get(r); const qv = String(v != null && v !== '' ? v : fq).toLowerCase(); if (c.type === 'semantic') { const sc = simScore(qv, String(cell) + ' ' + (c.kw ? c.kw(r) : '')); if (sc >= 0.3) { st.score[r._id] = Math.round(sc * 100); return true; } return false; } if (c.type === 'date') { if (!(v && (v.from || v.to))) return true; const x = String(cell); return !(v.from && x < v.from) && !(v.to && x > v.to); }
    if (c.type === 'search') {
      if (Array.isArray(v) && v.length && !v.includes(String(cell))) return false;
      if (typeof v === 'string' && v && !String(cell).toLowerCase().includes(v.toLowerCase())) return false;
      if (fq && !String(cell).toLowerCase().includes(fq)) return false;
      return true;
    }
    if (c.type === 'filter') {
      if (Array.isArray(v) && v.length) return Array.isArray(cell) ? cell.some(x => v.includes(String(x))) : v.includes(String(cell));
      if (fq) return Array.isArray(cell) ? cell.some(x => String(x).toLowerCase().includes(fq)) : String(cell).toLowerCase().includes(fq);
      return true;
    }
    return true;
  }));
  if (semQ.length) out.sort((a, b) => (st.score[b._id] || 0) - (st.score[a._id] || 0)); else if (st.sort) { const c = cols.find(x => x.key === st.sort.col); out.sort((a, b) => { const x = c.get(a), y = c.get(b); return (x > y ? 1 : x < y ? -1 : 0) * st.sort.dir; }); }
  const N = out.length, pages = Math.max(1, Math.ceil(N / PS)); if (st.page > pages) st.page = pages; if (st.page < 1) st.page = 1;
  const slice = out.slice((st.page - 1) * PS, st.page * PS);
  const head = cols.map(c => {
    const v = st.f[c.key], fq = (st.fq[c.key] || '').trim(); const act = (c.type === 'version' && (() => { const v = verOn(FWDATE); return !v || !!v.to; })()) || ((c.type === 'sort' || c.type === 'date') && st.sort && st.sort.col === c.key) || (v && (Array.isArray(v) ? v.length : c.type === 'date' ? (v.from || v.to) : true)) || !!fq;
    const icon = (c.type === 'search' || c.type === 'semantic') ? SVG.search : c.type === 'filter' ? SVG.filter : c.type === 'sort' ? SVG.sort : (c.type === 'date' || c.type === 'version') ? SVG.cal : '';
    const lbl = c.type === 'version' ? (() => { const v = verOn(FWDATE); return v && !v.to ? c.label : `${c.label} <span class="dim" style="text-transform:none;letter-spacing:0">· on ${fmtR(FWDATE)}</span>`; })() : c.label;
    return `<th class="${c.center ? 'center' : (c.num ? 'num' : '')}"><span class="thi">${lbl}${icon ? `<button class="fbtn${act ? ' act' : ''}" onclick="openPop(event,'${k}','${c.key}')" aria-label="Filter ${c.label}">${icon}</button>` : ''}</span></th>`;
  }).join('') + (opts.noAct ? '' : '<th>Action</th>');
  $(tid).innerHTML = `<tr>${head}</tr>` + (slice.length ? slice.map(rowHtml).join('') : `<tr><td colspan="${cols.length + (opts.noAct ? 0 : 1)}"><div class="empty">${opts.empty || 'No rows match.'}</div></td></tr>`);
  LIB[k].cols = cols; LIB[k].rows = rows; LIB[k].out = out;
  const pg = $('#pg-' + k);
  pg.innerHTML = renderPagerHtml(N, st.page, pages, n => `libPage('${k}',${n})`);
}
const scoreTag = (k, id) => { const sc = LIB[k] && LIB[k].score && LIB[k].score[id]; return sc ? ` <span class="pill p-acc" title="Similarity to your search">${sc}% match</span>` : ''; };
function libPage(k, n) { libState(k).page = n; RENDER[k](); }
function rowActs(arr, id) { return `<td class="actc"><button class="ib" title="Download" onclick="toast('Downloaded (demo)')">${SVG.dl}</button><button class="ib del" title="Delete" onclick="delRow('${arr}','${id}')">${SVG.del}</button></td>`; }
function delRow(arr, id) {
  const a = ARR[arr], i = a.findIndex(r => r._id === id); if (i < 0) return; const r = a.splice(i, 1)[0];
  AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Delete', tg: `${arr} ${r.c || r.t || r.course || ''}`.trim(), d: 'Active → Deleted' }); toast('Row deleted');
  const k = { FW: 'fw', ASSESS: 'assess', CAT: 'catalog', REC: 'records' }[arr]; RENDER[k](); rDash();
}
let POP = null;
function placePop(d, anchor, opts = {}) {
  const r = anchor.getBoundingClientRect(), W = d.offsetWidth, H = d.offsetHeight, vw = innerWidth, vh = innerHeight;
  let x = opts.alignRight ? r.right - W : r.left; x = Math.max(8, Math.min(x, vw - W - 8));
  let y = opts.above ? r.top - H - 6 : r.bottom + 6;
  if (!opts.above && y + H > vh - 8 && r.top - H - 6 > 8) y = r.top - H - 6;
  if (opts.above && y < 8) y = r.bottom + 6;
  y = Math.max(8, Math.min(y, vh - H - 8));
  d.style.left = x + 'px'; d.style.top = y + 'px';
}
function closePop() { if (POP) { POP.remove(); POP = null; } }
function openPop(ev, k, key) {
  closePop(); const st = libState(k), c = LIB[k].cols.find(x => x.key === key); const b = ev.currentTarget;
  const d = document.createElement('div'); d.className = 'pop'; d.onclick = e => e.stopPropagation();
  if (c.type === 'semantic') {
    d.innerHTML = `<input type="text" placeholder="Search by meaning, e.g. managing stakeholders" value="${esc(st.f[key] || '')}"><div class="pf"><button class="btn sm" onclick="LIB['${k}'].f['${key}']='';LIB['${k}'].page=1;RENDER['${k}']();closePop()">Clear</button><button class="btn sm pri" onclick="closePop()">Done</button></div>`;
    const inp = d.querySelector('input'); inp.oninput = () => { st.f[key] = inp.value; st.page = 1; RENDER[k](); }; setTimeout(() => inp.focus(), 0);
  }
  else if (c.type === 'filter' || c.type === 'search') {
    const vals = [...new Set(LIB[k].rows.flatMap(r => { const x = c.get(r); return Array.isArray(x) ? x.map(String) : [String(x)]; }))].sort(); const sel = Array.isArray(st.f[key]) ? st.f[key] : [], fq = st.fq[key] || (typeof st.f[key] === 'string' ? st.f[key] : '');
    d.innerHTML = `<input type="text" class="pop-q" placeholder="Search ${esc(c.label.toLowerCase())}…" value="${esc(fq)}" style="margin-bottom:6px"><div class="list">${vals.slice(0, 200).map(v => `<label data-v="${esc((v || 'blank').toLowerCase())}" ${fq && !(v || 'blank').toLowerCase().includes(fq.toLowerCase()) ? 'hidden' : ''}><input type="checkbox" value="${esc(v)}" ${sel.includes(v) ? 'checked' : ''}> ${esc(v) || '<span class="dim">blank</span>'}</label>`).join('')}<div class="dim pop-empty" style="padding:6px 0;text-align:center" hidden>No matches</div></div><div class="pf"><button class="btn sm" onclick="LIB['${k}'].f['${key}']=[];LIB['${k}'].fq['${key}']='';LIB['${k}'].page=1;RENDER['${k}']();closePop()">Clear</button><button class="btn sm pri" onclick="closePop()">Done</button></div>`;
    const qInp = d.querySelector('.pop-q'), lbls = [...d.querySelectorAll('.list label')], emp = d.querySelector('.pop-empty');
    const syncEmpty = () => { if (emp) emp.hidden = lbls.some(l => !l.hidden); }; syncEmpty();
    qInp.oninput = () => { const q = qInp.value; st.fq[key] = q; const ql = q.trim().toLowerCase(); lbls.forEach(l => { l.hidden = !!ql && !l.dataset.v.includes(ql); }); syncEmpty(); st.page = 1; RENDER[k](); };
    d.querySelectorAll('input[type=checkbox]').forEach(i => i.onchange = () => { st.f[key] = [...d.querySelectorAll('input[type=checkbox]:checked')].map(x => x.value); st.page = 1; RENDER[k](); });
    setTimeout(() => qInp.focus(), 0);
  }
  else if (c.type === 'version') {
    const cur = verOn(FWDATE);
    d.innerHTML = `<input type="date" id="pDate" value="${FWDATE}" style="width:100%">
   <div class="list" style="margin-top:8px">${[...VERSIONS].reverse().map(v => `<label><input type="radio" name="pver" value="${v.from}" ${cur && cur.v === v.v ? 'checked' : ''}> <span><b>${v.v}</b>${!v.to ? ' <span class="pill p-acc">Current</span>' : ''} <span class="dim">· ${verRange(v)}</span></span></label>`).join('')}</div>`;
    d.querySelectorAll('input[name=pver]').forEach(r => r.onchange = () => { FWDATE = r.value; ROWVER = {}; st.page = 1; RENDER[k](); closePop(); });
    d.querySelector('#pDate').onchange = e => { if (e.target.value) { FWDATE = e.target.value; ROWVER = {}; st.page = 1; RENDER[k](); closePop(); } };
  }
  else if (c.type === 'date') {
    const v = st.f[key] || {}; const iso = x => x.toISOString().slice(0, 10); const today = new Date(); const ago = n => { const z = new Date(today); z.setDate(z.getDate() - n); return iso(z); };
    d.innerHTML = `<div class="mh">Date range</div><div class="rng"><label>From<input type="date" id="pFrom" value="${v.from || ''}"></label><label>To<input type="date" id="pTo" value="${v.to || ''}"></label></div>
   <div class="mh" style="margin-top:8px">Quick pick</div><div class="acts">${[['Today', ago(0)], ['Last 7 days', ago(6)], ['Last 30 days', ago(29)]].map(([l, fr]) => `<button class="btn sm" data-f="${fr}">${l}</button>`).join('')}</div>
   <div class="sorts" style="margin-top:8px"><button class="btn sm" onclick="LIB['${k}'].sort={col:'${key}',dir:-1};RENDER['${k}']();closePop()">Newest first</button><button class="btn sm" onclick="LIB['${k}'].sort={col:'${key}',dir:1};RENDER['${k}']();closePop()">Oldest first</button></div>
   <div class="pf"><button class="btn sm" onclick="LIB['${k}'].f['${key}']=null;LIB['${k}'].sort=null;LIB['${k}'].page=1;RENDER['${k}']();closePop()">Clear</button><button class="btn sm pri" id="pApply">Apply</button></div>`;
    d.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { st.f[key] = { from: b.dataset.f, to: iso(today) }; st.page = 1; RENDER[k](); closePop(); });
    d.querySelector('#pApply').onclick = () => { const fr = d.querySelector('#pFrom').value, to = d.querySelector('#pTo').value; if (fr && to && fr > to) { toast('Pick a valid range'); return; } st.f[key] = { from: fr, to }; st.page = 1; RENDER[k](); closePop(); };
  }
  else { d.innerHTML = `<div class="sorts"><button class="btn sm" onclick="LIB['${k}'].sort={col:'${key}',dir:1};RENDER['${k}']();closePop()">Sort ascending</button><button class="btn sm" onclick="LIB['${k}'].sort={col:'${key}',dir:-1};RENDER['${k}']();closePop()">Sort descending</button><button class="btn sm" onclick="LIB['${k}'].sort=null;RENDER['${k}']();closePop()">Clear sort</button></div>`; }
  document.body.appendChild(d); placePop(d, b.closest('th') || b); POP = d;
}
document.addEventListener('click', e => { if (!e.target.closest('.pop,.fbtn,.me,.fdrop')) closePop(); });
document.addEventListener('scroll', e => { if (POP && !(e.target.closest && e.target.closest('.pop'))) closePop(); }, true);
window.addEventListener('resize', closePop);

function attnControlsHtml(k, count, active, onclickExpr) {
  return `<button class="fc-switch${active ? ' on' : ''}" type="button" role="switch" aria-checked="${active ? 'true' : 'false'}" onclick="${onclickExpr}">
      <span class="fc-attn-dot"></span>
      <span>Needs attention (${count})</span>
      <span class="fc-switch-track"><span class="fc-switch-thumb"></span></span>
    </button>
    <button class="btn sm out" type="button" onclick="exportCurrentList('${k}')">${DL_ICO} Export</button>`;
}
function renderAttnBarHtml(k, total, noun, attnCount, active, onclickExpr) {
  return `<div class="fc-panel"><div class="fc-toolbar">
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
      <b>${total} ${noun}${total === 1 ? '' : 's'}</b>
    </div>
    <div class="fc-toolbar-r">
      ${attnControlsHtml(k, attnCount, active, onclickExpr)}
    </div>
  </div></div>`;
}
const isAssFlagged = a => a.match === 'Unmatched' || a.gap <= -2;

function calcLvlMeetStats(ass, appliedPls, fallbackAll = false) {
  const plsClean = [...new Set((appliedPls || []).map(Number).filter(n => n >= 1 && n <= 5))].sort((a, b) => a - b);
  return plsClean.map(n => {
    const lvlAss = ass.filter(a => Number(a.req) === n);
    const pool = lvlAss.length ? lvlAss : (fallbackAll ? ass : []);
    const meetCnt = pool.filter(isAssMeeting).length;
    const pct = pool.length ? Math.round((meetCnt / pool.length) * 100) : 0;
    return { n, pct, meetCnt, total: pool.length };
  });
}
function courseMeetingExpectationStats(c, h = catAt(c), targetPls = null) {
  const ass = courseCompletedAss(c, h);
  const assMeetPct = ass.length ? Math.round((ass.filter(isAssMeeting).length / ass.length) * 100) : 0;
  const rawPls = (targetPls && targetPls.length) ? targetPls : (h.tags || c.tags || []).map(t => t[1]);
  const lvlStats = calcLvlMeetStats(ass, rawPls, true);
  const avgPct = lvlStats.length ? Math.round(lvlStats.reduce((sum, s) => sum + s.pct, 0) / lvlStats.length) : assMeetPct;
  return { ass, lvlStats, avgPct, avgBelow: 100 - avgPct };
}
function buildAssByCompMap(assList = ASSESS) {
  const m = new Map();
  assList.forEach(a => {
    const k = norm(a.c);
    if (!k) return;
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(a);
  });
  return m;
}
function fwDisplayStatus(x, h) {
  return (h && h.st) || x.st || 'Active';
}
function renderStaffSummaryHtml(ass, appliedPls) {
  const plsClean = [...new Set((appliedPls || []).map(Number).filter(n => n >= 1 && n <= 5))].sort((a, b) => a - b);
  const lvlCards = plsClean.map(n => {
    const cnt = new Set((ass || []).filter(a => Number(a.req) === n).map(a => a.id)).size;
    return `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:5px;min-width:68px;padding:9px 12px;border-radius:10px;border:1px solid var(--line2);background:var(--panel)" title="P${n}: ${cnt} staff">
      <div class="mono" style="font-size:18px;font-weight:700;line-height:1.1;color:var(--ink)">${cnt}</div>
      <span class="dim" style="font-size:11px;margin-top:-2px">staff</span>
      ${plTag(n)}
    </div>`;
  }).join('');
  const allCnt = new Set((ass || []).map(a => a.id)).size;
  const allCard = `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:5px;min-width:74px;padding:9px 14px;border-radius:10px;border:1.5px solid var(--accent);background:var(--accent-soft)" title="All levels: ${allCnt} staff">
    <div class="mono" style="font-size:18px;font-weight:700;line-height:1.1;color:var(--accent)">${allCnt}</div>
    <span style="font-size:11px;margin-top:-2px;color:var(--accent)">staff</span>
    <span class="tag mono" style="margin:0;font-weight:700;color:var(--accent);background:var(--panel);border-color:rgba(29,91,140,.25)">All</span>
  </div>`;
  return lvlCards + allCard;
}
function isCourseFlagged(c, ch = catAt(c)) {
  return ch.conf < thr() || ch.st !== 'Active' || (c.rating > 0 && c.rating < 4.5);
}

const visRec = () => REC.filter(x => (x.conf || 0) >= 50);
const visCat = () => CAT.filter(x => (catAt(x).conf || 0) >= 50);
