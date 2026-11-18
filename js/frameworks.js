let FW_MODAL = null;
function openFwModal(id) {
  const x = FW.find(r => r._id === id); if (!x) return;
  const ver = verOn(FWDATE);
  const h = x.hist.find(o => o.v === (ROWVER[x._id] || (ver && ver.v))) || x.hist[x.hist.length - 1];
  FW_MODAL = { id, v: h.v };
  const curFw = h.fw || x.fw, curLib = h.lib || x.lib, curC = h.c || x.c;
  const fws = [...new Set(FW.map(f => f.fw))];
  const libs = [...new Set(FW.map(f => f.lib))];
  $('#ecModalTitle').textContent = 'Edit framework competency';
  $('#ecModalSub').textContent = `${curFw} · ${curLib} · Version ${h.v}`;
  $('#ecModalBody').innerHTML = `
  <label class="fld">Competency name<input type="text" id="efwComp" value="${esc(curC)}"></label>
  <div class="grid g2" style="gap:10px">
    <label class="fld">Framework<select id="efwFw">${fws.map(f => `<option ${f === curFw ? 'selected' : ''}>${esc(f)}</option>`).join('')}</select></label>
    <label class="fld">Library<select id="efwLib">${libs.map(l => `<option ${l === curLib ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>
  </div>
  <div class="fld">Proficiency levels (PL1–PL5)
    <div style="display:flex;gap:10px;flex-wrap:wrap;padding:6px 0">
      ${[1, 2, 3, 4, 5].map((n, i) => `<label style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;background:var(--panel2);cursor:pointer"><input type="checkbox" class="efwPl" value="${i}" ${h.pl[i] ? 'checked' : ''}><span class="pls"><i class="y${n}"></i></span><span class="mono">PL${n}</span></label>`).join('')}
    </div>
  </div>
  <label class="fld">Competency descriptors &amp; keywords (used for semantic search &amp; AI mapping)<textarea id="efwKw" rows="2" style="font:inherit;font-size:13px;padding:8px 10px;border:1px solid var(--line);border-radius:6px;background:var(--panel);color:var(--ink);resize:vertical">${esc(x.kw || '')}</textarea></label>
  <label class="fld">Status<select id="efwSt"><option ${h.st === 'Active' ? 'selected' : ''}>Active</option><option ${h.st === 'Inactive' ? 'selected' : ''}>Inactive</option></select></label>
  <div class="mfoot">
    <button class="btn lg" onclick="$('#m-course').hidden=true">Cancel</button>
    <button class="btn pri lg" onclick="saveFwModal()">Save changes</button>
  </div>`;
  $('#m-course').hidden = false;
  setTimeout(() => $('#efwComp')?.focus(), 0);
}
function saveFwModal() {
  if (!FW_MODAL) return;
  const x = FW.find(r => r._id === FW_MODAL.id); if (!x) return;
  const c = $('#efwComp').value.trim();
  if (!c) { toast('Competency name is required'); return; }
  const fw = $('#efwFw').value, lib = $('#efwLib').value, kw = $('#efwKw').value.trim(), st = $('#efwSt').value;
  const pl = [0, 0, 0, 0, 0];
  document.querySelectorAll('.efwPl:checked').forEach(cb => { pl[+cb.value] = 1; });
  if (!pl.some(Boolean)) { toast('Select at least one proficiency level (PL1–PL5)'); return; }
  const h = x.hist.find(o => o.v === FW_MODAL.v) || x.hist[x.hist.length - 1];
  const curFw = h.fw || x.fw, curLib = h.lib || x.lib, curC = h.c || x.c;
  const parts = [];
  if (curC !== c) parts.push(`Name “${curC}” → “${c}”`);
  if (curFw !== fw) parts.push(`Framework ${curFw} → ${fw}`);
  if (curLib !== lib) parts.push(`Library ${curLib} → ${lib}`);
  const oldPls = h.pl.map((v, i) => v ? 'PL' + (i + 1) : null).filter(Boolean).join(',');
  const newPls = pl.map((v, i) => v ? 'PL' + (i + 1) : null).filter(Boolean).join(',');
  if (oldPls !== newPls) parts.push(`Levels ${oldPls} → ${newPls}`);
  if (h.st !== st) parts.push(`Status ${h.st} → ${st}`);
  if ((x.kw || '') !== kw) parts.push('Descriptors updated');
  h.c = c; h.fw = fw; h.lib = lib; h.pl = pl; h.st = st;
  if (h === x.hist[x.hist.length - 1]) { x.c = c; x.fw = fw; x.lib = lib; x.pl = pl; x.st = st; }
  x.kw = kw;
  if (parts.length) h.chg = parts.join('; ');
  AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Edit competency', tg: 'FW ' + c, d: parts.length ? parts.join('; ') : 'Saved without changes' });
  $('#m-course').hidden = true;
  FW_MODAL = null;
  toast('Framework competency updated');
  rFw(); rFwCards(); rDash();
}
let _CAT_IDX = null, _CAT_IDX_SIG = '';
function getCatIdx() {
  const sig = CAT.length + ':' + CAT.reduce((s, c) => s + (c.tags ? c.tags.length : 0), 0);
  if (_CAT_IDX && _CAT_IDX_SIG === sig) return _CAT_IDX;
  const m = new Map();
  CAT.forEach(c => (c.tags || []).forEach(t => {
    const k = norm(t[0]);
    let arr = m.get(k);
    if (!arr) { arr = []; m.set(k, arr); }
    if (!arr.includes(c)) arr.push(c);
  }));
  _CAT_IDX = m; _CAT_IDX_SIG = sig;
  return m;
}
function catPlsFor(c, compTitle = null) {
  const ch = catAt(c);
  const tags = (ch && ch.tags) || c.tags || [];
  const sub = compTitle ? tags.filter(t => norm(t[0]) === norm(compTitle)) : tags;
  return [...new Set(sub.map(t => Number(t[1])).filter(n => n >= 1 && n <= 5))].sort((a, b) => a - b);
}
function catPlMatchScores(c, h = null, compTitle = null) {
  const ch = h || catAt(c);
  const baseConf = Number(ch.conf ?? c.conf ?? 0);
  if (!baseConf) return [1, 2, 3, 4, 5].map(n => ({ pl: n, pct: 0, applied: false }));
  const tags = ch.tags || c.tags || [];
  const sub = compTitle ? tags.filter(t => norm(t[0]) === norm(compTitle)) : tags;
  const applied = [...new Set(sub.map(t => Number(t[1])).filter(n => n >= 1 && n <= 5))].sort((a, b) => a - b);
  const seedStr = (c.t || '') + '|' + (compTitle || tags[0]?.[0] || '');
  let hash = 7;
  for (let i = 0; i < seedStr.length; i++) hash = (hash * 31 + seedStr.charCodeAt(i)) % 997;
  return [1, 2, 3, 4, 5].map(n => {
    const isApplied = applied.includes(n);
    if (isApplied) {
      const idx = applied.indexOf(n);
      const pct = idx === 0 ? baseConf : Math.max(55, Math.min(99, baseConf - (2 + ((hash + n * 5) % 6))));
      return { pl: n, pct, applied: true };
    }
    const nearestDist = applied.length ? Math.min(...applied.map(a => Math.abs(n - a))) : n;
    const drop = nearestDist * 19 + ((hash + n * 11) % 9);
    const pct = Math.max(12, Math.min(baseConf - 8, baseConf - drop));
    return { pl: n, pct, applied: false };
  });
}
function fwCourses(x, h) {
  const compName = norm((h && h.c) || x.c);
  const activePls = h && h.pl ? h.pl : x.pl;
  const list = getCatIdx().get(compName) || [];
  return list.filter(c => {
    const ch = catAt(c), tags = ch.tags || c.tags || [];
    return (ch.conf || 0) >= 50 && tags.some(t => norm(t[0]) === compName && (!h || activePls[(t[1] || 1) - 1]));
  });
}
function openFwCourses(id) {
  const x = FW.find(r => r._id === id); if (!x) return;
  const ver = verOn(FWDATE);
  const h = x.hist.find(o => o.v === (ROWVER[x._id] || (ver && ver.v))) || x.hist[x.hist.length - 1];
  const cs = fwCourses(x, h);
  const cArg = esc(h.c || x.c).replace(/'/g, "\\'");
  $('#histTitle').textContent = `Courses covering “${h.c || x.c}”`;
  $('#histSub').textContent = `${h.fw || x.fw} · ${h.lib || x.lib} · Version ${h.v} · ${cs.length} course${cs.length === 1 ? '' : 's'}`;
  $('#histBody').innerHTML = cs.length ? `<div class="tw"><table>
    <tr><th>Course</th><th>Provider</th><th>Type</th><th>Duration</th><th>Level</th><th>Confidence</th><th>Status</th><th>Action</th></tr>
    ${cs.map(c => {
    const plsList = catPlsFor(c, h.c || x.c);
    const plsHtml = plsList.length ? `<span style="display:inline-flex;gap:4px;align-items:center;white-space:nowrap">${plsList.map(n => plTag(n)).join('')}</span>` : '<span class="dim">—</span>';
    const u = courseHref(c.url);
    return `<tr>
        <td class="wrap">${u ? `<a class="clink" href="${u}" target="_blank" rel="noopener">${esc(c.t)}</a>` : `<b>${esc(c.t)}</b>`}<div class="dim" style="font-size:11.5px;margin-top:2px">${esc(c.desc || '')}</div></td>
        <td>${esc(c.p)}</td>
        <td>${esc(c.type)}</td>
        <td>${esc(c.dur)}</td>
        <td class="mono" style="white-space:nowrap">${plsHtml}</td>
        <td>${conf(c.conf)}</td>
        <td>${pill(c.st)}</td>
        <td class="actc"><button class="btn sm" onclick="$('#m-hist').hidden=true;go('catalog');openCourseModal('${c._id}')">Edit</button></td>
      </tr>`;
  }).join('')}
  </table></div>
  <div class="mfoot"><button class="btn" onclick="$('#m-hist').hidden=true;dashNominate('','${cArg}')">Filter in Catalog →</button><button class="btn pri" onclick="$('#m-hist').hidden=true">Close</button></div>`
    : `<div class="empty">No courses in the catalog currently cover <b>${esc(h.c || x.c)}</b> (${h.pl.map((v, i) => v ? 'PL' + (i + 1) : null).filter(Boolean).join('–')}).</div>
  <div class="mfoot"><button class="btn" onclick="$('#m-hist').hidden=true">Close</button><button class="btn pri" onclick="$('#m-hist').hidden=true;dashAddCourse('${cArg}')">+ Add course to catalog</button></div>`;
  $('#m-hist').hidden = false;
}
const FW_EXP = { fw0: true };
const FW_LC_F = {};
function getFwLcF(id) {
  return FW_LC_F[id] || (FW_LC_F[id] = { q: '', p: '', type: '', pl: '', st: '' });
}
function setFwLcFilter(id, key, val) {
  const f = getFwLcF(id);
  f[key] = val;
  const grid = $('#fw-vgrid-' + id);
  if (!grid) { rFwCards(); return; }
  const ql = (f.q || '').trim().toLowerCase();
  const cards = [...grid.querySelectorAll('.fw-vbox')];
  cards.forEach(el => {
    const okQ = !ql || (el.dataset.q || '').includes(ql);
    const okP = !f.p || el.dataset.p === f.p;
    const okT = !f.type || el.dataset.type === f.type;
    const okPl = !f.pl || el.dataset.pl === f.pl;
    const okSt = !f.st || el.dataset.st === f.st;
    el.hidden = !(okQ && okP && okT && okPl && okSt);
  });
  const emp = $('#fw-vgrid-empty-' + id);
  if (emp) emp.hidden = cards.some(el => !el.hidden);
}
const FW_ADD_OPEN = {};
const FW_ADD_Q = {};
const FW_ADD_SRC = {};
const FW_DET_LOG_OPEN = {};
const FW_DET_EDIT = {};
const CAT_DET_EDIT = {};
const CAT_ADD_OPEN = {};
const CAT_ADD_Q = {};
const FW_AI_OPEN = {};
const FW_AI_PATH = {};
const FW_AI_PATHWAYS = ['All pathways', 'Technical Specialist', 'Team Lead / Supervisor', 'Senior Manager / Principal', 'Cross-functional / Compliance'];
const EXTERNAL_COURSES = [
  { t: 'OSHA & Workplace Safety Management', p: 'Coursera', type: 'e-Learning', dur: '14 hrs', pl: 2, url: 'coursera.org/learn/workplace-safety-management', kw: 'safety health wsh ehs hazard risk' },
  { t: 'Construction Project Management', p: 'Coursera · Columbia', type: 'e-Learning', dur: '20 hrs', pl: 3, url: 'coursera.org/learn/construction-project-management', kw: 'project delivery schedule cost contract civil' },
  { t: 'ISO 9001 Quality Management Systems', p: 'Udemy Business', type: 'e-Learning', dur: '6 hrs', pl: 2, url: 'udemy.com/course/iso-9001-quality-management', kw: 'quality audit iso assurance inspection' },
  { t: 'Conflict Resolution & Mediation Skills', p: 'LinkedIn Learning', type: 'e-Learning', dur: '3 hrs', pl: 2, url: 'linkedin.com/learning/conflict-resolution-mediation', kw: 'mediation dispute stakeholder conflict negotiation' },
  { t: 'Root Cause Analysis & Incident Investigation', p: 'SkillsFuture · NUS SCALE', type: 'Workshop', dur: '2 days', pl: 3, url: 'myskillsfuture.gov.sg/content/portal/en/training-exchange/root-cause-analysis', kw: 'incident investigation root cause safety enforcement' },
  { t: 'Regulatory Compliance & Public Governance', p: 'edX', type: 'e-Learning', dur: '12 hrs', pl: 3, url: 'edx.org/learn/regulatory-compliance', kw: 'regulatory compliance enforcement governance policy' },
  { t: 'Environmental Impact & Noise Control', p: 'SkillsFuture · BCA Academy', type: 'Workshop', dur: '2 days', pl: 3, url: 'myskillsfuture.gov.sg/content/portal/en/training-exchange/environmental-noise', kw: 'environmental sustainability noise vibration construction' },
  { t: 'Stakeholder Engagement & Public Communications', p: 'LinkedIn Learning', type: 'e-Learning', dur: '4 hrs', pl: 2, url: 'linkedin.com/learning/stakeholder-communications', kw: 'stakeholder community engagement outreach communications' }
];
function addAndLinkAiCourse(fwId, title, prov, type, dur, pl, confVal, extUrl = '', extSrc = '') {
  const x = FW.find(r => r._id === fwId);
  if (!x) return;
  let c = CAT.find(r => norm(r.t) === norm(title));
  if (!c) {
    c = {
      _id: 'ca' + CAT.length,
      t: title,
      p: prov,
      type,
      dur,
      src: extSrc || (prov === 'LTA Academy' ? 'In-house' : 'Public'),
      url: extUrl || (prov === 'LTA Academy' ? '—' : 'myskillsfuture.gov.sg'),
      tags: [[x.c, pl]],
      st: confVal >= thr() ? 'Active' : 'Pending review',
      conf: confVal,
      rating: 4.7,
      reviews: 42,
      upd: new Date().toISOString().slice(0, 10)
    };
    c.hist = [{ v: c.upd.slice(0, 7), from: c.upd, to: null, by: (extSrc === 'External' ? 'External Course · Added' : 'AI Recommendation · Added'), type: c.type, dur: c.dur, desc: 'Added from outside catalog / AI finder', tags: JSON.parse(JSON.stringify(c.tags)), conf: c.conf, st: c.st, chg: extSrc === 'External' ? 'Imported from external provider' : 'Added via AI Course & Credential Finder' }];
    CAT.unshift(c);
  }
  linkCourseToFw(fwId, c._id, pl, confVal);
}
function getAiRecommendations(x, h, cs, detAss, pathway) {
  const compTitle = h.c || x.c;
  const lib = h.lib || x.lib || '';
  const activePls = [1, 2, 3, 4, 5].filter(n => h.pl && h.pl[n - 1]);
  const coveredPls = new Set(cs.flatMap(c => (catAt(c).tags || c.tags || []).filter(t => norm(t[0]) === norm(compTitle)).map(t => t[1])));
  const uncoveredPls = activePls.filter(n => !coveredPls.has(n));
  const belowN = detAss.filter(a => a.rating === 'Below').length;
  const belowByPl = {};
  detAss.filter(a => a.rating === 'Below').forEach(a => { belowByPl[a.req] = (belowByPl[a.req] || 0) + 1; });
  const topGapPl = Object.keys(belowByPl).sort((a, b) => belowByPl[b] - belowByPl[a])[0];
  const pathTargetPl = pathway === 'Senior Manager / Principal' ? (activePls[activePls.length - 1] || 4)
    : pathway === 'Team Lead / Supervisor' ? (activePls.find(n => n >= 3) || activePls[activePls.length - 1] || 3)
      : pathway === 'Cross-functional / Compliance' ? (activePls.find(n => n >= 2) || 2)
        : (uncoveredPls[0] || Number(topGapPl) || activePls[0] || 2);

  const credPool = {
    'Safety Health': [
      { t: 'WSH Officer (WSHO) Professional Certification', p: 'NTUC LearningHub / MOM', type: 'Credential', dur: '12 days', pl: Math.min(4, activePls[activePls.length - 1] || 3), conf: 95 },
      { t: 'NEBOSH International Diploma in Occupational Health & Safety', p: 'SGS Academy', type: 'Credential', dur: '15 days', pl: activePls[activePls.length - 1] || 4, conf: 93 },
      { t: 'ISO 45001:2018 Lead Auditor Credential', p: 'BSI Training Academy', type: 'Credential', dur: '5 days', pl: Math.min(4, activePls[activePls.length - 1] || 3), conf: 91 }
    ],
    'Project Delivery': [
      { t: 'PMI Construction Professional (PMI-CP) Credential', p: 'Project Management Institute', type: 'Credential', dur: '6 days', pl: activePls[activePls.length - 1] || 4, conf: 95 },
      { t: 'Specialist Diploma in Rail & Infrastructure Engineering', p: 'LTA Academy / NUS ISS', type: 'Credential', dur: '10 days', pl: Math.min(4, activePls[activePls.length - 1] || 3), conf: 92 },
      { t: 'ISO 9001:2015 Quality Management Lead Auditor', p: 'SGS Academy', type: 'Credential', dur: '5 days', pl: Math.min(3, activePls[activePls.length - 1] || 3), conf: 90 }
    ],
    'Regulatory Ops': [
      { t: 'Certified Enforcement & Regulatory Compliance Specialist', p: 'Civil Service College', type: 'Credential', dur: '4 days', pl: Math.min(3, activePls[activePls.length - 1] || 3), conf: 94 },
      { t: 'Singapore Mediation Centre Accredited Mediator', p: 'Singapore Mediation Centre', type: 'Credential', dur: '5 days', pl: activePls[activePls.length - 1] || 4, conf: 92 },
      { t: 'Public Sector Governance & Investigation Credential', p: 'Civil Service College', type: 'Credential', dur: '3 days', pl: Math.min(4, activePls[activePls.length - 1] || 3), conf: 90 }
    ]
  };
  const creds = (credPool[lib] || credPool['Project Delivery']).filter(cr => !cs.some(c => norm(c.t) === norm(cr.t)));
  const kwWords = (x.kw || compTitle).toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const unlinkedCourses = CAT.filter(c => !cs.includes(c)).map(c => {
    const txt = (c.t + ' ' + c.p + ' ' + c.type).toLowerCase();
    const kwHits = kwWords.filter(w => txt.includes(w)).length;
    const baseConf = pairConf(x, c);
    const pl = c.tags?.[0]?.[1] || pathTargetPl;
    const pathBonus = Math.abs(pl - pathTargetPl) <= 1 ? 6 : 0;
    return { c, pl, score: baseConf + kwHits * 4 + pathBonus, conf: baseConf };
  }).sort((a, b) => b.score - a.score).slice(0, 3);

  const gapLabel = pl => {
    const parts = [];
    if (uncoveredPls.includes(pl)) parts.push(`Fills P${pl} coverage gap (0 courses)`);
    if (belowByPl[pl]) parts.push(`Addresses ${belowByPl[pl]} Below-rating staff at P${pl}`);
    if (!parts.length && belowN) parts.push(`Supports ${belowN} staff with Below rating`);
    if (!parts.length) parts.push(`Reinforces P${pl} proficiency`);
    return parts.join(' · ');
  };
  const whyTxt = (title, kind, pl) => {
    const pathNote = pathway === 'All pathways' ? 'across core role expectations' : `for the ${pathway} pathway`;
    return `${kind === 'Credential' ? 'Recognized professional credential' : 'Targeted course'} aligned with “${compTitle}” ${pathNote}. Recommended at P${pl} to ${uncoveredPls.includes(pl) ? 'close an unmapped level gap and ' : ''}${belowN ? `upskill ${belowN} staff currently rated Below.` : 'strengthen applied workplace mastery.'}`;
  };

  const items = [
    ...creds.slice(0, 2).map(cr => ({
      isNew: !CAT.some(c => norm(c.t) === norm(cr.t)),
      catId: CAT.find(c => norm(c.t) === norm(cr.t))?._id || null,
      kind: 'Credential',
      t: cr.t, p: cr.p, type: cr.type, dur: cr.dur, pl: cr.pl, conf: cr.conf,
      gap: gapLabel(cr.pl),
      why: whyTxt(cr.t, 'Credential', cr.pl)
    })),
    ...unlinkedCourses.map(({ c, pl, conf }) => ({
      isNew: false,
      catId: c._id,
      kind: 'Course',
      t: c.t, p: c.p, type: c.type, dur: c.dur, pl, conf,
      gap: gapLabel(pl),
      why: whyTxt(c.t, 'Course', pl)
    }))
  ];

  const steps = [
    {
      n: '1. Close immediate gaps',
      d: belowN ? `Enroll ${belowN} Below-rated staff in P${uncoveredPls[0] || topGapPl || activePls[0] || 1} foundational courses first.` : `Ensure P${activePls[0] || 1}–P${Math.min(2, activePls[activePls.length - 1] || 2)} baseline coverage stays active.`
    },
    {
      n: `2. ${pathway === 'All pathways' ? 'Build applied depth' : pathway}`,
      d: `Target P${pathTargetPl} applied workshops or practice-based modules aligned to ${compTitle}.`
    },
    {
      n: '3. Credential & next step',
      d: creds[0] ? `Progress toward “${creds[0].t}” to validate P${creds[0].pl} mastery.` : `Complete peer assessment & capstone review for P${activePls[activePls.length - 1] || 4} readiness.`
    }
  ];
  return { uncoveredPls, belowN, items, steps, pathTargetPl };
}
const FW_ICONS = {
  'Regulatory Ops': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
  'Safety Health': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  'Project Delivery': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>'
};
const BOOK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
function toggleFwCard(id) {
  FW_EXP[id] = !FW_EXP[id];
  rFwCards();
}
function unlinkCourseFromFw(fwId, catId) {
  const x = FW.find(r => r._id === fwId), c = CAT.find(r => r._id === catId);
  if (!x || !c) return;
  const compName = norm(x.c);
  c.tags = (c.tags || []).filter(t => norm(t[0]) !== compName);
  if (c.hist && c.hist.length) c.hist[c.hist.length - 1].tags = JSON.parse(JSON.stringify(c.tags));
  _CAT_IDX = null; bumpAssCache();
  AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Unlink course', tg: 'FW ' + x.c, d: `Moved “${c.t}” out of competency (kept in Catalog)` });
  toast(`Moved “${c.t}” out of ${x.c} (kept in Catalog)`);
  rFw(); rFwCards(); rCat(); rDash();
}
function toggleCoursePl(catId, compTitle, pl) {
  const c = CAT.find(r => r._id === catId); if (!c) return;
  const p = Number(pl); if (!(p >= 1 && p <= 5)) return;
  c.tags = c.tags || [];
  const compKey = norm(compTitle);
  const curForComp = c.tags.filter(t => norm(t[0]) === compKey);
  const exists = curForComp.some(t => Number(t[1]) === p);
  if (exists && curForComp.length <= 1) {
    toast('Keep at least 1 proficiency level (or click Move out to unlink)');
    return;
  }
  const others = c.tags.filter(t => norm(t[0]) !== compKey);
  const nextCompTags = exists
    ? curForComp.filter(t => Number(t[1]) !== p)
    : [...curForComp, [compTitle, p]].sort((a, b) => Number(a[1]) - Number(b[1]));
  c.tags = [...nextCompTags, ...others];
  if (c.hist && c.hist.length) c.hist[c.hist.length - 1].tags = JSON.parse(JSON.stringify(c.tags));
  _CAT_IDX = null; bumpAssCache();
  const pListTxt = nextCompTags.map(t => 'P' + t[1]).join(', ');
  AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Update course levels', tg: 'CAT ' + c.t, d: `${compTitle}: ${pListTxt}` });
  toast(`${c.t} · ${compTitle}: ${pListTxt}`);
  rFw(); rFwCards(); rCat(); rDash();
}
function pairConf(fwObj, catObj) {
  const str = (fwObj.c || '') + '|' + (catObj.t || '');
  let h = 17;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 997;
  return CONF_POOL[h % CONF_POOL.length];
}
function linkCourseToFw(fwId, catId, pl = 2, lConf = null) {
  const x = FW.find(r => r._id === fwId), c = CAT.find(r => r._id === catId);
  if (!x || !c) return;
  const ver = verOn(FWDATE);
  const h = x.hist.find(o => o.v === (ROWVER[x._id] || (ver && ver.v))) || x.hist[x.hist.length - 1];
  const compTitle = h.c || x.c;
  const fwActive = [1, 2, 3, 4, 5].filter(n => h.pl && h.pl[n - 1]);
  const maxPl = fwActive[fwActive.length - 1] || 2;
  const rawList = Array.isArray(pl) ? pl : (typeof pl === 'string' ? pl.split(',').map(Number) : [Number(pl)]);
  const cleanPls = [...new Set(rawList.filter(n => n >= 1 && n <= 5).map(n => (fwActive.length && !fwActive.includes(n)) ? Math.min(n, maxPl) : n))];
  const usePls = cleanPls.length ? cleanPls : [fwActive[0] || 2];
  const newConf = lConf || pairConf(x, c);
  c.tags = c.tags || [];
  usePls.forEach(usePl => {
    if (!c.tags.some(t => norm(t[0]) === norm(compTitle) && Number(t[1]) === usePl)) c.tags.push([compTitle, usePl]);
  });
  const compKey = norm(compTitle);
  const compTags = c.tags.filter(t => norm(t[0]) === compKey).sort((a, b) => Number(a[1]) - Number(b[1]));
  c.tags = [...compTags, ...c.tags.filter(t => norm(t[0]) !== compKey)];
  c.conf = newConf;
  c.st = c.conf >= thr() ? 'Active' : 'Pending review';
  if (c.hist && c.hist.length) {
    const lastH = c.hist[c.hist.length - 1];
    lastH.tags = JSON.parse(JSON.stringify(c.tags));
    lastH.conf = c.conf;
    lastH.st = c.st;
  }
  _CAT_IDX = null; bumpAssCache();
  FW_ADD_Q[fwId] = '';
  FW_ADD_OPEN[fwId] = false;
  const pTxt = usePls.map(n => 'P' + n).join(', ');
  AUDIT.unshift({ t: 'Just now', u: 'Nurul Hassan', a: 'Link course', tg: 'FW ' + compTitle, d: `Linked “${c.t}” (${pTxt} · ${c.conf}%)` });
  toast(`Linked “${c.t}” (${pTxt}) · Confidence ${c.conf}%`);
  rFw(); rFwCards(); rCat(); rDash();
}
function onFwCourseSearch(fwId, val, open = true) {
  FW_ADD_Q[fwId] = val;
  FW_ADD_OPEN[fwId] = open;
  const drop = $('#fw-add-drop-' + fwId);
  if (!drop) { rFwCards(); return; }
  drop.hidden = !open;
  const q = (val || '').trim().toLowerCase();
  const src = FW_ADD_SRC[fwId] || 'all';
  drop.querySelectorAll('.fw-add-item').forEach(el => {
    const okSrc = src === 'all' || el.dataset.src === src;
    const okQ = !q || (el.dataset.q || '').includes(q);
    el.hidden = !(okSrc && okQ);
  });
  const cust = $('#fw-add-custom-' + fwId);
  if (cust) {
    cust.hidden = !q;
    const lbl = cust.querySelector('.fw-add-custom-q');
    if (lbl) lbl.textContent = val.trim();
  }
  const emp = drop.querySelector('.fw-add-empty');
  if (emp) emp.hidden = !!q || [...drop.querySelectorAll('.fw-add-item')].some(el => !el.hidden);
}
function addCustomExternalCourse(fwId) {
  const q = (FW_ADD_Q[fwId] || '').trim();
  if (!q) return;
  const prov = ($('#fw-ext-prov-' + fwId)?.value || 'Coursera').trim();
  const url = ($('#fw-ext-url-' + fwId)?.value || '').trim() || ('myskillsfuture.gov.sg/search?q=' + encodeURIComponent(q));
  addAndLinkAiCourse(fwId, q, prov, 'e-Learning', '4 hrs', 2, 88, url, 'External');
}
function rFw() {
  renderCrumbAndFlow('fw');
  const ver = verOn(FWDATE);
  const rows = ver ? FW.filter(x => x.hist.some(h => h.v === ver.v)) : [];
  const at = x => x.hist.find(h => h.v === (ROWVER[x._id] || ver.v)) || x.hist.find(h => h.v === ver.v);
  libTable('fw', '#tFw', [
    { key: 'fw', label: 'Framework', type: 'filter', get: x => at(x).fw || x.fw }, { key: 'lib', label: 'Library', type: 'filter', get: x => at(x).lib || x.lib },
    { key: 'c', label: 'Competency', type: 'semantic', get: x => at(x).c || x.c, kw: x => x.kw || '' }, { key: 'pl', label: 'Levels', type: 'filter', get: x => at(x).pl.map((v, i) => v ? 'PL' + (i + 1) : null).filter(Boolean) },
    { key: 'courses', label: 'Courses', type: 'sort', num: true, get: x => fwCourses(x, at(x)).length },
    { key: 'v', label: 'Version', type: 'version', get: x => at(x).v }, { key: 'st', label: 'Status', type: 'filter', get: x => at(x).st }, { key: 'upd', label: 'Last updated', type: 'sort', get: x => VERSIONS.find(v => v.v === at(x).v).from }],
    rows, x => {
      const h = at(x), vv = VERSIONS.find(v => v.v === h.v), isOld = !!vv.to, cs = fwCourses(x, h);
      const curLbl = !isOld ? 'current' : h.v;
      const sel = `<span class="verpick" title="${verRange(vv)} · ${esc(h.chg)}"><span>${esc(curLbl)}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg><select onchange="ROWVER['${x._id}']=this.value;rFw();rFwCards()">${[...x.hist].reverse().map(o => `<option value="${o.v}" ${o.v === h.v ? 'selected' : ''}>${o.v}${!VERSIONS.find(z => z.v === o.v).to ? ' · current' : ''}</option>`).join('')}</select></span>`;
      const fwFlag = h.st !== 'Active' || cs.some(c => { const ch = catAt(c); return ch.conf < thr() || ch.st !== 'Active' || (c.rating > 0 && c.rating < 4.5); });
      return `<tr class="${fwFlag ? 'flag-row' : ''}"><td>${esc(h.fw || x.fw)}</td><td class="dim">${esc(h.lib || x.lib)}</td><td class="wrap">${esc(h.c || x.c)}${scoreTag('fw', x._id)}</td><td>${pls(h.pl)}</td><td class="num" style="white-space:nowrap"><a class="clink mono" href="#" onclick="openFwCourses('${x._id}');return false" title="View courses covering this competency">${cs.length} course${cs.length === 1 ? '' : 's'}</a></td><td>${sel}</td><td>${pill(h.st)}</td><td class="mono dim">${vv.from}</td><td class="actc"><button class="ib" title="Edit competency" onclick="openFwModal('${x._id}')">${SVG.edit}</button><button class="ib del" title="Delete" onclick="delRow('FW','${x._id}')">${SVG.del}</button></td></tr>`;
    }, { empty: 'No competencies in effect on this date.' });
}
const FW_CARDS_F = { q: '', p: [], type: [], pl: [], st: [], attn: [] };
const FW_CARDS_MS_Q = { p: '', type: '', pl: '', st: '', attn: '' };
let FW_CARDS_MS_OPEN = '';
let FW_DET_FILT_OPEN = false;
let FW_DET_FILT_CAT = 'all';
let FW_DET_FILT_GROUPS = [];
function toggleSelectAllFwDetFilt() {
  const groups = FW_DET_FILT_CAT === 'all' ? FW_DET_FILT_GROUPS : FW_DET_FILT_GROUPS.filter(g => g.key === FW_DET_FILT_CAT);
  const allSel = groups.length && groups.every(g => g.opts.every(o => (FW_CARDS_F[g.key] || []).includes(String(o.v))));
  groups.forEach(g => {
    FW_CARDS_F[g.key] = allSel ? [] : g.opts.map(o => String(o.v));
    if (g.key === 'pl' && !allSel) FW_CARDS_F[g.key].sort((a, b) => Number(a) - Number(b));
  });
  libState('fwcards').page = 1;
  rFwCards();
}
function renderDetFilterSearchBarHtml(cfg) {
  const { searchId, searchVal, searchPlaceholder, onSearchInput, wrapId, open, onToggleOpen, onDone, catKey, onCatChange, groups, filters, onToggleOpt, onSelectAll, onClearAll, shownCount, totalCount, noun, appliedChips } = cfg;
  const activeFiltCnt = groups.reduce((sum, g) => sum + ((filters[g.key] || []).length), 0);
  const shownGroups = catKey === 'all' ? groups : groups.filter(g => g.key === catKey);
  const shownOptsCnt = shownGroups.reduce((sum, g) => sum + g.opts.length, 0);
  const allShownSel = shownGroups.length && shownGroups.every(g => g.opts.every(o => (filters[g.key] || []).includes(String(o.v))));
  const chkSvg = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
  const xChips = groups.flatMap(g => (filters[g.key] || []).map(v => {
    const opt = g.opts.find(o => String(o.v) === String(v));
    const lbl = opt ? opt.l : v;
    return `<button class="fc-xchip" type="button" onclick="${onToggleOpt(g.key, v)}"><span>${esc(lbl)}</span><span style="opacity:.65;font-size:13px;line-height:1">×</span></button>`;
  }));
  const barHtml = `<div class="fc-search" style="margin-bottom:14px;padding-right:6px">
    ${SVG.search}
    <input type="text" id="${searchId}" value="${esc(searchVal || '')}" placeholder="${esc(searchPlaceholder)}" oninput="${onSearchInput}">
    <div id="${wrapId}" style="position:relative;flex:none;display:flex;align-items:center;padding-left:6px;border-left:1px solid var(--line2)" onclick="event.stopPropagation()">
      <button class="btn sm ${open || activeFiltCnt ? 'pri' : ''}" type="button" style="display:inline-flex;align-items:center;gap:5px;height:28px;border:0;${open || activeFiltCnt ? '' : 'background:transparent;color:var(--ink2)'}" onclick="${onToggleOpen}">
        ${SVG.filter}
        <span>Filter${activeFiltCnt ? ` (${activeFiltCnt})` : ''}</span>
      </button>
      ${open ? `<div class="fc-fpop">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
          <div>
            <div style="font-size:15px;font-weight:700;color:var(--ink)">Filter by category</div>
            <div class="dim" style="font-size:12px;margin-top:2px">${shownOptsCnt} options · ${shownCount} of ${totalCount} ${noun}${totalCount === 1 ? '' : 's'} shown</div>
          </div>
          <select class="fc-fcat-sel" aria-label="Filter category" onchange="${onCatChange}">
            <option value="all" ${catKey === 'all' ? 'selected' : ''}>All</option>
            ${groups.map(g => `<option value="${g.key}" ${catKey === g.key ? 'selected' : ''}>${esc(g.label)}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${shownGroups.map(g => `<div>
            ${catKey === 'all' ? `<div class="dim" style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">${esc(g.label)}</div>` : ''}
            <div class="fc-fchips">
              ${g.opts.map(o => {
    const on = (filters[g.key] || []).includes(String(o.v));
    return `<button type="button" class="fc-fchip${on ? ' on' : ''}" onclick="${onToggleOpt(g.key, o.v)}">${on ? chkSvg : ''}<span>${esc(o.l)}</span></button>`;
  }).join('')}
            </div>
          </div>`).join('')}
        </div>
        <button type="button" class="fc-selall" onclick="${onSelectAll}">${allShownSel ? 'Deselect All' : 'Select All'}</button>
        <div style="border-top:1px solid var(--line2);padding-top:12px;display:flex;flex-direction:column;gap:10px">
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--ink)">Refine results</div>
            <div class="dim" style="font-size:12px;margin-top:1px">${xChips.length ? `${xChips.length} selected` : 'No filters applied'}</div>
          </div>
          ${xChips.length ? `<div class="fc-fchips">${xChips.join('')}</div>` : ''}
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            ${(xChips.length || searchVal) ? `<button type="button" class="fc-clrall" onclick="${onClearAll}">Clear All</button>` : '<span></span>'}
            <button class="btn sm pri" type="button" onclick="${onDone}">Done</button>
          </div>
        </div>
      </div>` : ''}
    </div>
  </div>`;
  const appliedHtml = (!open && appliedChips.length) ? `<div class="fc-applied" style="margin-bottom:14px">
    <div class="fc-applied-list"><b style="font-size:12.5px;margin-right:4px">Applied filters</b>${appliedChips.join('')}</div>
    <button class="fc-clear" type="button" onclick="${onClearAll}">Clear all</button>
  </div>` : '';
  return barHtml + appliedHtml;
}
function setFwCardsFilter(key, val) {
  FW_CARDS_F[key] = val;
  libState('fwcards').page = 1;
  rFwCards();
}
function toggleFwCardsMs(key, val) {
  const arr = FW_CARDS_F[key], s = String(val), i = arr.indexOf(s);
  if (i >= 0) arr.splice(i, 1); else arr.push(s);
  if (key === 'pl') arr.sort((a, b) => Number(a) - Number(b));
  libState('fwcards').page = 1;
  rFwCards();
}
function toggleFwCardsMsMenu(key, ev) {
  ev.stopPropagation();
  FW_CARDS_MS_OPEN = FW_CARDS_MS_OPEN === key ? '' : key;
  document.querySelectorAll('.fc-ms-menu').forEach(m => { m.hidden = m.id !== 'fcMsMenu-' + FW_CARDS_MS_OPEN; });
  if (FW_CARDS_MS_OPEN) setTimeout(() => $('#fcMsQ-' + FW_CARDS_MS_OPEN)?.focus(), 0);
}
function filterFcMs(key, val) {
  FW_CARDS_MS_Q[key] = val;
  const ql = val.trim().toLowerCase();
  document.querySelectorAll('#fcMsList-' + key + ' .fc-ms-opt').forEach(el => {
    el.hidden = !!(ql && !el.dataset.lbl.includes(ql));
  });
}
document.addEventListener('click', e => {
  let needReRender = false;
  if (FW_CARDS_MS_OPEN && !e.target.closest('.fc-box[data-ms]')) {
    FW_CARDS_MS_OPEN = '';
    document.querySelectorAll('.fc-ms-menu').forEach(m => { m.hidden = true; });
  }
  if (FW_DET_FILT_OPEN && !e.target.closest('#fwDetFiltWrap')) {
    FW_DET_FILT_OPEN = false;
    needReRender = true;
  }
  if (CAT_DET_FILT_OPEN && !e.target.closest('#catDetFiltWrap')) {
    CAT_DET_FILT_OPEN = false;
    rCat();
  }
  if (needReRender) rFwCards();
});
const FW_IM = { path: '', role: '', pl: '', dept: '' };
const FW_IM_ROLES = [
  ['Enforcement Officer', /enforcement|investigation|surveillance|public/i],
  ['Project Engineer', /project|contract|cost|primavera|schedule|civil/i],
  ['Safety Lead', /safety|wsh|incident|noise|environmental/i],
  ['Operations Manager', /operations|mediation|stakeholder|community|regulatory/i],
  ['Quality & Audit Specialist', /audit|iso|quality|compliance/i]
];
function setFwIm(k, val) { FW_IM[k] = val; libState('fwcards').page = 1; rFwCards(); }
function clearFwIm() { FW_IM.path = ''; FW_IM.role = ''; FW_IM.pl = ''; FW_IM.dept = ''; libState('fwcards').page = 1; rFwCards(); }
let FW_CARDS_EXPORT_ROWS = [];
function exportFwImExcel() {
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const head = ['Career Path', 'Role', 'Target Level', 'Department', 'Framework', 'Competency', 'Course', 'Course Level', 'Provider', 'Type', 'Duration', 'Source', 'Rating', 'Confidence', 'Status'];
  const lines = [head.map(q).join(','), ...FW_CARDS_EXPORT_ROWS.map(r => r.map(q).join(','))];
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'recommended-courses.csv';
  a.click();
  URL.revokeObjectURL(a.href);
  toast(`Exported ${FW_CARDS_EXPORT_ROWS.length} row${FW_CARDS_EXPORT_ROWS.length === 1 ? '' : 's'} to Excel (.csv)`);
}
let FW_CARDS_SORT = 'name-asc', FW_CARDS_PS = 20, FW_CARDS_ATTN_ONLY = false, FW_CARDS_DETAIL = null;
function clearFwCardsFilter() {
  FW_CARDS_F.q = ''; FW_CARDS_F.p = []; FW_CARDS_F.type = []; FW_CARDS_F.pl = []; FW_CARDS_F.st = []; FW_CARDS_F.attn = []; FW_CARDS_F.cnt = [];
  FW_CARDS_MS_Q.p = ''; FW_CARDS_MS_Q.type = ''; FW_CARDS_MS_Q.pl = ''; FW_CARDS_MS_Q.st = ''; FW_CARDS_MS_Q.attn = ''; FW_CARDS_MS_Q.cnt = '';
  FW_CARDS_MS_OPEN = '';
  FW_DET_FILT_OPEN = false;
  libState('fwcards').page = 1;
  rFwCards();
}
function clearFwCourseFilter() {
  FW_CARDS_F.cq = ''; FW_CARDS_F.p = []; FW_CARDS_F.type = []; FW_CARDS_F.pl = []; FW_CARDS_F.st = []; FW_CARDS_F.attn = [];
  FW_CARDS_MS_Q.p = ''; FW_CARDS_MS_Q.type = ''; FW_CARDS_MS_Q.pl = ''; FW_CARDS_MS_Q.st = ''; FW_CARDS_MS_Q.attn = '';
  FW_CARDS_MS_OPEN = '';
  rFwCards();
}
const FW_TBL_F = { q: '', fw: [], lib: [], pl: [], cnt: [], st: [] };
const FW_TBL_MS_Q = {};
let FW_TBL_MS_OPEN = '';
function toggleFwTblMsMenu(k, ev) {
  ev.stopPropagation();
  FW_TBL_MS_OPEN = FW_TBL_MS_OPEN === k ? '' : k;
  rFwCards();
  if (FW_TBL_MS_OPEN) setTimeout(() => $('#fwTblMsQ-' + k)?.focus(), 0);
}
function toggleFwTblMs(k, val) {
  const a = FW_TBL_F[k] || (FW_TBL_F[k] = []);
  const i = a.indexOf(val);
  if (i >= 0) a.splice(i, 1); else a.push(val);
  libState('fwcards').page = 1;
  rFwCards();
}
function filterFwTblMs(k, val) {
  FW_TBL_MS_Q[k] = val;
  const ql = (val || '').trim().toLowerCase();
  const list = $('#fwTblMsList-' + k);
  if (list) list.querySelectorAll('.fc-ms-opt').forEach(el => { el.hidden = !!ql && !(el.dataset.lbl || '').includes(ql); });
}
function clearFwTblFilter() {
  FW_TBL_F.q = ''; FW_TBL_F.fw = []; FW_TBL_F.lib = []; FW_TBL_F.pl = []; FW_TBL_F.cnt = []; FW_TBL_F.st = [];
  FW_TBL_MS_OPEN = '';
  libState('fwcards').page = 1;
  rFwCards();
}
function openFwTblPop(ev, key) {
  ev.stopPropagation();
  closePop();
  const b = ev.currentTarget;
  const ver = verOn(FWDATE), rows = ver ? FW.filter(x => x.hist.some(h => h.v === ver.v)) : [];
  const at = x => x.hist.find(h => h.v === (ROWVER[x._id] || ver.v)) || x.hist.find(h => h.v === ver.v);
  const d = document.createElement('div'); d.className = 'pop'; d.onclick = e => e.stopPropagation();
  if (key === 'q') {
    const comps = [...new Set(rows.map(r => at(r).c || r.c))].filter(Boolean).sort();
    const sel = FW_TBL_F.cSel || (FW_TBL_F.cSel = []);
    const fq = FW_TBL_F.q || '';
    d.innerHTML = `<input type="text" class="pop-q" placeholder="Search competency…" value="${esc(fq)}" style="margin-bottom:6px"><div class="list">${comps.map(v => `<label data-v="${esc(v.toLowerCase())}" ${fq && !v.toLowerCase().includes(fq.toLowerCase()) ? 'hidden' : ''}><input type="checkbox" value="${esc(v)}" ${sel.includes(v) ? 'checked' : ''}> ${esc(v)}</label>`).join('')}<div class="dim pop-empty" style="padding:6px 0;text-align:center" hidden>No matches</div></div><div class="pf"><button class="btn sm" onclick="FW_TBL_F.q='';FW_TBL_F.cSel=[];libState('fwcards').page=1;rFwCards();closePop()">Clear</button><button class="btn sm pri" onclick="closePop()">Done</button></div>`;
    const qInp = d.querySelector('.pop-q'), lbls = [...d.querySelectorAll('.list label')], emp = d.querySelector('.pop-empty');
    const syncEmpty = () => { if (emp) emp.hidden = lbls.some(l => !l.hidden); }; syncEmpty();
    qInp.oninput = () => { FW_TBL_F.q = qInp.value; const ql = qInp.value.toLowerCase(); lbls.forEach(l => l.hidden = !l.dataset.v.includes(ql)); syncEmpty(); libState('fwcards').page = 1; rFwCards(); };
    d.querySelectorAll('.list input').forEach(cb => cb.onchange = () => {
      const cur = [...d.querySelectorAll('.list input:checked')].map(i => i.value);
      FW_TBL_F.cSel = cur; libState('fwcards').page = 1; rFwCards();
    });
    setTimeout(() => qInp.focus(), 0);
  } else {
    let vals = [];
    if (key === 'fw') vals = [...new Set(rows.map(r => at(r).fw || r.fw))].filter(Boolean).sort();
    else if (key === 'lib') vals = [...new Set(rows.map(r => at(r).lib || r.lib))].filter(Boolean).sort();
    else if (key === 'pl') vals = ['1', '2', '3', '4', '5'];
    else if (key === 'cnt') vals = [...new Set(rows.map(r => String(fwCourses(r, at(r)).length)))].sort((a, b) => Number(a) - Number(b));
    else if (key === 'st') vals = [...new Set(rows.map(r => fwDisplayStatus(r, at(r))))].filter(Boolean).sort();
    const lblFmt = v => key === 'pl' ? 'P' + v : v;
    const sel = FW_TBL_F[key] || [], fq = FW_TBL_MS_Q[key] || '';
    d.innerHTML = `<input type="text" class="pop-q" placeholder="Search…" value="${esc(fq)}" style="margin-bottom:6px"><div class="list">${vals.map(v => `<label data-v="${esc(lblFmt(v).toLowerCase())}" ${fq && !lblFmt(v).toLowerCase().includes(fq.toLowerCase()) ? 'hidden' : ''}><input type="checkbox" value="${esc(v)}" ${sel.includes(v) ? 'checked' : ''}> ${esc(lblFmt(v))}</label>`).join('')}<div class="dim pop-empty" style="padding:6px 0;text-align:center" hidden>No matches</div></div><div class="pf"><button class="btn sm" onclick="FW_TBL_F['${key}']=[];FW_TBL_MS_Q['${key}']='';libState('fwcards').page=1;rFwCards();closePop()">Clear</button><button class="btn sm pri" onclick="closePop()">Done</button></div>`;
    const qInp = d.querySelector('.pop-q'), lbls = [...d.querySelectorAll('.list label')], emp = d.querySelector('.pop-empty');
    const syncEmpty = () => { if (emp) emp.hidden = lbls.some(l => !l.hidden); }; syncEmpty();
    qInp.oninput = () => { FW_TBL_MS_Q[key] = qInp.value; const ql = qInp.value.toLowerCase(); lbls.forEach(l => l.hidden = !l.dataset.v.includes(ql)); syncEmpty(); };
    d.querySelectorAll('.list input').forEach(cb => cb.onchange = () => {
      FW_TBL_F[key] = [...d.querySelectorAll('.list input:checked')].map(i => i.value);
      libState('fwcards').page = 1; rFwCards();
    });
    setTimeout(() => qInp.focus(), 0);
  }
  document.body.appendChild(d); placePop(d, b.closest('th') || b); POP = d;
}
let NAV_TRAIL = [];
function goBackTrail(idx) {
  const t = NAV_TRAIL[idx];
  if (t && typeof t.fn === 'function') t.fn();
}
function renderTrailHtml(curLabel) {
  const trail = NAV_TRAIL.filter((t, i) => !(i === NAV_TRAIL.length - 1 && t.label === curLabel));
  if (!trail.length) return '';
  return `<div class="fc-crumb">${trail.map((t, i) => `<button type="button" onclick="goBackTrail(${i})">${esc(t.label)}</button><span>›</span>`).join('')}<b>${esc(curLabel)}</b></div>`;
}
function openCourseFromFw(fwId, fwTitle, catId) {
  NAV_TRAIL = [
    { label: 'Frameworks', fn: () => { FW_CARDS_DETAIL = null; NAV_TRAIL = []; go('fwcards', true); } },
    { label: fwTitle, fn: () => { FW_CARDS_DETAIL = fwId; NAV_TRAIL = [{ label: 'Frameworks', fn: () => openFwCardDetail(null) }]; go('fwcards', true); } }
  ];
  CAT_DETAIL = catId;
  CAT_DET_Q = '';
  CAT_DET_TAB = 'rec';
  go('catalog', true);
}
function openFwFromCat(catId, catTitle, fwId) {
  NAV_TRAIL = [
    { label: 'Catalog', fn: () => { CAT_DETAIL = null; NAV_TRAIL = []; go('catalog', true); } },
    { label: catTitle, fn: () => { CAT_DETAIL = catId; NAV_TRAIL = [{ label: 'Catalog', fn: () => openCatDetail(null) }]; go('catalog', true); } }
  ];
  FW_CARDS_DETAIL = fwId;
  go('fwcards', true);
}
function openFwCardDetail(id, keepTrail = false) {
  FW_CARDS_DETAIL = id;
  const fx = id ? FW.find(f => f._id === id) : null;
  FLOW_CTX.fwId = fx ? fx._id : null; FLOW_CTX.fwTitle = fx ? fx.c : ''; FLOW_CTX.courseTitle = '';
  FW_CARDS_F.cq = ''; FW_CARDS_F.p = []; FW_CARDS_F.type = []; FW_CARDS_F.pl = []; FW_CARDS_F.st = []; FW_CARDS_F.attn = [];
  FW_CARDS_MS_OPEN = '';
  FW_DET_FILT_OPEN = false;
  if (!keepTrail) NAV_TRAIL = id ? [{ label: 'Frameworks', fn: () => openFwCardDetail(null) }] : [];
  if (CUR_PAGE !== 'fwcards') { go('fwcards', true); return; }
  rFwCards();
}
const FW_FLOW_F = {
  fw: { lib: [], pl: [], cnt: [] },
  cat: { p: [], type: [], st: [], attn: [] },
  rec: { dept: [], st: [], src: [] },
  ass: { y: [], dept: [], rating: [], match: [] }
};
let FW_FLOW_OPEN = '', FW_FLOW_LIST = '', CUR_PAGE = 'dash';
function rerenderFlowPage() {
  if (CUR_PAGE === 'fwcards' || !RENDER[CUR_PAGE]) rFwCards();
  else RENDER[CUR_PAGE]();
}
function onFwCardsFlowSearch(key, val) {
  FW_CARDS_F[key] = val;
  if (key === 'q' && CUR_PAGE === 'fwcards') FW_CARDS_DETAIL = null;
  libState('fwcards').page = 1;
  rerenderFlowPage();
}
function toggleFlowFilter(k, ev) {
  ev.stopPropagation();
  FW_FLOW_LIST = '';
  FW_FLOW_OPEN = FW_FLOW_OPEN === k ? '' : k;
  rerenderFlowPage();
}
function openFlowList(k, ev) {
  if (ev) ev.stopPropagation();
  if (FW_FLOW_LIST === k && !ev?.target?.matches?.('input')) return;
  FW_FLOW_OPEN = '';
  if (FW_FLOW_LIST !== k) { FW_FLOW_LIST = k; rerenderFlowPage(); }
}
function toggleFlowList(k, ev) {
  ev.stopPropagation();
  FW_FLOW_OPEN = '';
  FW_FLOW_LIST = FW_FLOW_LIST === k ? '' : k;
  rerenderFlowPage();
}
function toggleFlowOpt(topic, field, val) {
  const arr = FW_FLOW_F[topic][field], s = String(val), i = arr.indexOf(s);
  if (i >= 0) arr.splice(i, 1); else arr.push(s);
  libState('fwcards').page = 1;
  rerenderFlowPage();
}
function clearFlowFilter(topic) {
  Object.keys(FW_FLOW_F[topic]).forEach(k => FW_FLOW_F[topic][k] = []);
  libState('fwcards').page = 1;
  rerenderFlowPage();
}
document.addEventListener('click', e => {
  if ((FW_FLOW_OPEN || FW_FLOW_LIST) && !e.target.closest('.fc-step')) {
    FW_FLOW_OPEN = ''; FW_FLOW_LIST = '';
    document.querySelectorAll('.fc-step-pop').forEach(p => { p.hidden = true; });
  }
});
const FLOW_CTX = { fwId: null, fwTitle: '', courseTitle: '' };
function manageFlowPage(pg) {
  FLOW_CTX.fwId = null; FLOW_CTX.fwTitle = ''; FLOW_CTX.courseTitle = '';
  const st = libState(pg); st.f = {}; st.fq = {}; st.page = 1;
  go(pg);
}
function renderCrumbAndFlow(page) {
  const cfg = {
    fw: ['#fwCrumb', '#fwFlow', 'Frameworks'],
    catalog: ['#catalogCrumb', '#catalogFlow', 'Catalog'],
    records: ['#recordsCrumb', '#recordsFlow', 'Records'],
    assess: ['#assessCrumb', '#assessFlow', 'Assessments']
  }[page];
  if (!cfg) return;
  const crumbEl = $(cfg[0]), flowEl = $(cfg[1]), pgLbl = cfg[2];
  if (!crumbEl || !flowEl) return;
  const cf = FW_CARDS_F, ff = FW_FLOW_F;
  const isFlag = (c, ch) => isCourseFlagged(c, ch);
  const ver = verOn(FWDATE), rows = ver ? FW.filter(x => x.hist.some(h => h.v === ver.v)) : [];
  const at = x => x.hist.find(h => h.v === (ROWVER[x._id] || ver.v)) || x.hist.find(h => h.v === ver.v);
  const ql = (cf.q || '').trim().toLowerCase(), cql = (cf.cq || '').trim().toLowerCase(), rql = (cf.rq || '').trim().toLowerCase(), aql = (cf.aq || '').trim().toLowerCase();
  const fwList = rows.filter(r => {
    const h = at(r), t = h.c || r.c, cs = fwCourses(r, h);
    return (!ql || (t + ' ' + (h.fw || r.fw) + ' ' + (h.lib || r.lib)).toLowerCase().includes(ql)) && (!ff.fw.lib.length || ff.fw.lib.includes(h.lib || r.lib)) && (!ff.fw.pl.length || ff.fw.pl.some(n => (h.pl || [])[Number(n) - 1])) && (!ff.fw.cnt.length || ff.fw.cnt.includes(cs.length ? 'With courses' : 'Without courses'));
  });
  const catList = CAT.filter(c => {
    const ch = catAt(c), attn = isFlag(c, ch) ? 'Needs attention' : 'Healthy';
    return (!cql || (c.t + ' ' + c.p + ' ' + ch.type + ' ' + (c.desc || '')).toLowerCase().includes(cql)) && (!ff.cat.p.length || ff.cat.p.includes(c.p)) && (!ff.cat.type.length || ff.cat.type.includes(ch.type)) && (!ff.cat.st.length || ff.cat.st.includes(ch.st)) && (!ff.cat.attn.length || ff.cat.attn.includes(attn));
  });
  const recList = REC.filter(r => (!rql || (r.id + ' ' + r.course + ' ' + r.c + ' ' + r.dept + ' ' + r.st).toLowerCase().includes(rql)) && (!ff.rec.dept.length || ff.rec.dept.includes(r.dept)) && (!ff.rec.st.length || ff.rec.st.includes(r.st)) && (!ff.rec.src.length || ff.rec.src.includes(r.src)));
  const assList = ASSESS.filter(a => (!aql || (a.id + ' ' + a.c + ' ' + a.dept + ' ' + a.rating + ' ' + a.match).toLowerCase().includes(aql)) && (!ff.ass.y.length || ff.ass.y.includes(String(a.y))) && (!ff.ass.dept.length || ff.ass.dept.includes(a.dept)) && (!ff.ass.rating.length || ff.ass.rating.includes(a.rating)) && (!ff.ass.match.length || ff.ass.match.includes(a.match)));

  const flowOpts = {
    fw: [['lib', 'Library', [...new Set(rows.map(r => at(r).lib || r.lib))].filter(Boolean).sort()], ['pl', 'Proficiency', ['1', '2', '3', '4', '5'], n => 'P' + n], ['cnt', 'Courses', ['With courses', 'Without courses']]],
    cat: [['p', 'Provider', [...new Set(CAT.map(c => c.p))].filter(Boolean).sort()], ['type', 'Type', [...new Set(CAT.map(c => catAt(c).type))].filter(Boolean).sort()], ['st', 'Status', [...new Set(['Active', 'Pending review', 'Inactive', ...CAT.map(c => catAt(c).st)])].filter(Boolean)], ['attn', 'Review', ['Healthy', 'Needs attention']]],
    rec: [['dept', 'Department', [...new Set(REC.map(r => r.dept))].filter(Boolean).sort()], ['st', 'Status', [...new Set(REC.map(r => r.st))].filter(Boolean).sort()], ['src', 'Source', [...new Set(REC.map(r => r.src))].filter(Boolean).sort()]],
    ass: [['y', 'Year', [...new Set(ASSESS.map(a => String(a.y)))].filter(Boolean).sort()], ['dept', 'Department', [...new Set(ASSESS.map(a => a.dept))].filter(Boolean).sort()], ['rating', 'Rating', [...new Set(ASSESS.map(a => a.rating))].filter(Boolean).sort()], ['match', 'Match', [...new Set(ASSESS.map(a => a.match))].filter(Boolean).sort()]]
  };
  const listHtml = tk => {
    if (tk === 'fw') return fwList.slice(0, 60).map(r => { const h = at(r); return `<button type="button" class="fc-step-item" onclick="FW_FLOW_LIST='';openFwCardDetail('${r._id}')"><b>${esc(h.c || r.c)}</b><small>${esc(h.fw || r.fw)} · ${esc(h.lib || r.lib)}</small></button>`; }).join('') || `<div class="dim" style="font-size:12px;padding:6px">No matching frameworks.</div>`;
    if (tk === 'cat') return catList.slice(0, 60).map(c => `<button type="button" class="fc-step-item" onclick="FW_FLOW_LIST='';dashGo('catalog',{},{t:'${esc(c.t).replace(/'/g, "\\'")}'})"><b>${esc(c.t)}</b><small>${esc(c.p)} · ${esc(catAt(c).type)} · ${esc(catAt(c).st)}</small></button>`).join('') || `<div class="dim" style="font-size:12px;padding:6px">No matching courses.</div>`;
    if (tk === 'rec') return recList.slice(0, 60).map(r => `<button type="button" class="fc-step-item" onclick="FW_FLOW_LIST='';dashGo('records',{course:'${esc(r.course).replace(/'/g, "\\'")}',id:'${esc(r.id)}'})"><b>${esc(r.id)} · ${esc(r.course)}</b><small>${esc(r.dept || '')} · ${esc(r.date)} · ${esc(r.st)}</small></button>`).join('') || `<div class="dim" style="font-size:12px;padding:6px">No matching records.</div>`;
    return assList.slice(0, 60).map(a => `<button type="button" class="fc-step-item" onclick="FW_FLOW_LIST='';dashGo('assess',{id:'${esc(a.id)}',c:'${esc(a.c).replace(/'/g, "\\'")}'})"><b>${esc(a.id)} · ${esc(a.c)}</b><small>${esc(a.dept)} · ${esc(a.y)} · ${esc(a.rating)}</small></button>`).join('') || `<div class="dim" style="font-size:12px;padding:6px">No matching assessments.</div>`;
  };

  crumbEl.innerHTML = (page === 'catalog' && CAT_DETAIL) ? '' : renderTrailHtml(pgLbl);

  if (NAV_TRAIL.length || (page !== 'catalog' && page !== 'fw') || (page === 'catalog' && !CAT_DETAIL)) {
    flowEl.innerHTML = '';
    return;
  }
  flowEl.innerHTML = renderFwCatToggleHtml(page);
}
function renderFwCatToggleHtml(activePage) {
  const ver = verOn(FWDATE), fwN = ver ? FW.filter(x => x.hist.some(h => h.v === ver.v)).length : FW.length;
  const tabs = [
    ['Frameworks', 'fw', fwN],
    ['Catalog', 'catalog', visCat().length]
  ];
  return `<div style="display:inline-flex;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--panel)" role="group" aria-label="Switch between Frameworks and Catalog">${tabs.map(([lbl, pg, cnt]) => `<button type="button" class="btn sm ${pg === activePage ? 'pri' : ''}" style="border:0;border-radius:0" onclick="go('${pg}')">${lbl} <span class="mono" style="opacity:.8">(${cnt})</span></button>`).join('')}</div>`;
}
function openCourseRecords(cid) {
  const c = CAT.find(r => r._id === cid); if (!c) return;
  const fromCat = CUR_PAGE === 'catalog' && CAT_DETAIL === cid;
  const fx = !fromCat ? FW.find(f => f._id === FW_CARDS_DETAIL) : null;
  FLOW_CTX.fwId = fx ? fx._id : null; FLOW_CTX.fwTitle = fx ? fx.c : (c.tags[0]?.[0] || ''); FLOW_CTX.courseTitle = c.t; FLOW_CTX.compList = [];
  NAV_TRAIL = fx
    ? [{ label: 'Frameworks', fn: () => { FW_CARDS_DETAIL = null; NAV_TRAIL = []; go('fwcards', true); } }, { label: fx.c, fn: () => { FW_CARDS_DETAIL = fx._id; NAV_TRAIL = [{ label: 'Frameworks', fn: () => openFwCardDetail(null) }]; go('fwcards', true); } }]
    : (fromCat
      ? [{ label: 'Catalog', fn: () => { CAT_DETAIL = null; NAV_TRAIL = []; go('catalog', true); } }, { label: c.t, fn: () => { CAT_DETAIL = c._id; NAV_TRAIL = [{ label: 'Catalog', fn: () => { CAT_DETAIL = null; NAV_TRAIL = []; go('catalog', true); } }]; go('catalog', true); } }]
      : [{ label: 'Catalog', fn: () => { CAT_DETAIL = null; NAV_TRAIL = []; go('catalog', true); } }]);
  const st = libState('records'); st.f = {}; st.fq = {}; st.page = 1; REC_ATTN_ONLY = false;
  go('records', true);
}
function openCourseAssess(compTitle, pl, cid) {
  const c = CAT.find(r => r._id === cid);
  const fromCat = CUR_PAGE === 'catalog' && CAT_DETAIL === cid;
  const fx = !fromCat ? FW.find(f => f._id === FW_CARDS_DETAIL || norm(f.c) === norm(compTitle)) : null;
  FLOW_CTX.fwId = fx ? fx._id : null; FLOW_CTX.fwTitle = compTitle || (c?.tags[0]?.[0] || ''); FLOW_CTX.courseTitle = c ? c.t : '';
  FLOW_CTX.compList = (fromCat && c) ? [...new Set((catAt(c).tags || c.tags || []).map(t => norm(t[0])))] : (compTitle ? [norm(compTitle)] : []);
  NAV_TRAIL = fx
    ? [{ label: 'Frameworks', fn: () => { FW_CARDS_DETAIL = null; NAV_TRAIL = []; go('fwcards', true); } }, { label: fx.c, fn: () => { FW_CARDS_DETAIL = fx._id; NAV_TRAIL = [{ label: 'Frameworks', fn: () => openFwCardDetail(null) }]; go('fwcards', true); } }]
    : (fromCat && c
      ? [{ label: 'Catalog', fn: () => { CAT_DETAIL = null; NAV_TRAIL = []; go('catalog', true); } }, { label: c.t, fn: () => { CAT_DETAIL = c._id; NAV_TRAIL = [{ label: 'Catalog', fn: () => { CAT_DETAIL = null; NAV_TRAIL = []; go('catalog', true); } }]; go('catalog', true); } }]
      : [{ label: 'Catalog', fn: () => { CAT_DETAIL = null; NAV_TRAIL = []; go('catalog', true); } }]);
  const st = libState('assess'); st.f = {}; st.fq = {}; st.page = 1; ASS_ATTN_ONLY = false;
  go('assess', true);
}
function fwDetAddCourseBoxHtml(x, cs) {
  const unlinked = CAT.filter(c => !cs.includes(c)).sort((a, b) => pairConf(x, b) - pairConf(x, a));
  const qVal = FW_ADD_Q[x._id] || '', srcMode = FW_ADD_SRC[x._id] || 'all', ql = qVal.trim().toLowerCase();
  const extMatches = EXTERNAL_COURSES.filter(ec => !CAT.some(c => norm(c.t) === norm(ec.t)));
  const internalHtml = unlinked.map(c => {
    const defPls = catPlsFor(c), usePls = defPls.length ? defPls : [2], lConf = pairConf(x, c);
    const qData = esc((c.t + ' ' + c.p + ' ' + c.type).toLowerCase());
    const hide = (srcMode !== 'all' && srcMode !== 'internal') || (!!ql && !qData.includes(ql));
    return `<div class="fw-add-item" data-src="internal" data-q="${qData}" ${hide ? 'hidden' : ''}>
      <div style="flex:1;min-width:0"><b>${esc(c.t)}</b><span class="dim"> · ${esc(c.p)} · ${esc(c.type)} · ${esc(c.dur)} · <span class="mono">${usePls.map(n => 'P' + n).join(', ')}</span></span></div>
      <div style="display:flex;align-items:center;gap:14px;flex:none">${conf(lConf)}<button class="btn sm pri" onclick="linkCourseToFw('${x._id}','${c._id}','${usePls.join(',')}',${lConf})">+ Link course</button></div>
    </div>`;
  }).join('');
  const externalHtml = extMatches.map(ec => {
    const lConf = pairConf(x, ec), qData = esc((ec.t + ' ' + ec.p + ' ' + ec.type + ' ' + ec.kw).toLowerCase());
    const hide = (srcMode !== 'all' && srcMode !== 'external') || (!!ql && !qData.includes(ql));
    return `<div class="fw-add-item" data-src="external" data-q="${qData}" ${hide ? 'hidden' : ''}>
      <div style="flex:1;min-width:0"><span class="pill p-acc" style="margin-right:6px">External</span><a class="clink" href="https://${esc(ec.url)}" target="_blank" rel="noopener">${esc(ec.t)}</a><span class="dim"> · ${esc(ec.p)} · ${esc(ec.type)} · ${esc(ec.dur)} · <span class="mono">PL${ec.pl}</span></span></div>
      <div style="display:flex;align-items:center;gap:14px;flex:none">${conf(lConf)}<button class="btn sm pri" onclick="addAndLinkAiCourse('${x._id}','${escArg(ec.t)}','${escArg(ec.p)}','${esc(ec.type)}','${esc(ec.dur)}',${ec.pl},${lConf},'${esc(ec.url)}','External')">+ Add & Link</button></div>
    </div>`;
  }).join('');
  const anyVisible = (srcMode !== 'external' && unlinked.some(c => !ql || (c.t + ' ' + c.p + ' ' + c.type).toLowerCase().includes(ql))) || (srcMode !== 'internal' && extMatches.some(ec => !ql || (ec.t + ' ' + ec.p + ' ' + ec.type + ' ' + ec.kw).toLowerCase().includes(ql)));
  return `<div class="fw-add-wrap" style="border-top:0;padding-top:0;margin-bottom:14px">
    <div class="fw-add-inp">${SVG.search}<input type="text" id="fw-add-q-${x._id}" value="${esc(qVal)}" placeholder="Search internal catalog or external providers (Coursera, SkillsFuture, LinkedIn Learning)..." oninput="onFwCourseSearch('${x._id}',this.value,true)"><button class="btn sm" onclick="FW_ADD_OPEN['${x._id}']=false;rFwCards()">Close</button></div>
    <div class="fw-add-drop" id="fw-add-drop-${x._id}">
      ${externalHtml}${internalHtml}
      <div id="fw-add-custom-${x._id}" class="fw-add-item" style="background:var(--panel2)" ${ql ? '' : 'hidden'}>
        <div style="flex:1;min-width:0">
          <span class="pill p-acc" style="margin-right:6px">Find outside</span><span>Import “<b class="fw-add-custom-q">${esc(qVal.trim())}</b>” from external provider:</span>
          <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
            <select id="fw-ext-prov-${x._id}" style="padding:4px 8px;border:1px solid var(--line);border-radius:6px;background:var(--panel);font:inherit;font-size:12px"><option>Coursera</option><option>SkillsFuture</option><option>LinkedIn Learning</option><option>Udemy Business</option><option>NUS SCALE</option><option>edX</option></select>
            <input id="fw-ext-url-${x._id}" type="text" placeholder="Optional course URL (e.g. coursera.org/...)" style="flex:1;min-width:180px;padding:4px 8px;border:1px solid var(--line);border-radius:6px;background:var(--panel);font:inherit;font-size:12px">
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex:none">
          <a class="btn sm out" href="https://www.myskillsfuture.gov.sg/content/portal/en/training-exchange/course-directory.html" target="_blank" rel="noopener">Browse SkillsFuture ↗</a>
          <button class="btn sm pri" type="button" onclick="addCustomExternalCourse('${x._id}')">+ Add & Link</button>
        </div>
      </div>
      <div class="dim fw-add-empty" style="padding:10px;text-align:center" ${anyVisible || ql ? 'hidden' : ''}>No matching courses found.</div>
    </div>
  </div>`;
}
function fwDetCourseCardHtml(x, h, compTitle, c) {
  const ch = catAt(c), plsList = catPlsFor(c, compTitle), fwActivePls = activePlsOf(h.pl), compArg = escArg(compTitle), u = courseHref(c.url);
  const isFlag = isCourseFlagged(c, ch);
  const flagTip = ch.conf < thr() ? 'Needs review · below confidence threshold' : (ch.st !== 'Active' ? `Status: ${ch.st}` : 'Needs review · low course rating');
  return `<div class="fw-vbox${isFlag ? ' flag' : ''}">
    ${isFlag ? `<span class="fw-vb-dot" title="${flagTip}"></span>` : ''}
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
      <div style="min-width:0">
        <div class="fw-vb-title">${u ? `<a class="clink" href="${u}" target="_blank" rel="noopener" title="Open course page">${esc(c.t)}</a>` : esc(c.t)}</div>
        <div style="margin-top:6px">${pill(ch.st || 'Active')}</div>
      </div>
      <div class="actc" style="flex:none;display:flex;gap:6px;align-items:center">
        ${FW_DET_EDIT[x._id]
      ? `<button class="ib del" type="button" title="Move out" aria-label="Move out" onclick="unlinkCourseFromFw('${x._id}','${c._id}')">${SVG.moveOut}</button>`
      : `<button class="btn sm" style="border:0;background:transparent;color:var(--accent)" type="button" title="View course page" aria-label="View course page" onclick="openCourseFromFw('${x._id}','${compArg}','${c._id}')">→</button>`}
      </div>
    </div>
    <div style="margin:6px 0">${FW_DET_EDIT[x._id]
      ? `<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap"><span class="dim" style="font-size:11px;margin-right:2px">Levels:</span>${fwActivePls.map(n => `<button type="button" class="btn sm ${plsList.includes(n) ? 'pri' : 'out'}" style="padding:2px 7px;min-height:22px;font-size:11px" onclick="toggleCoursePl('${c._id}','${compArg}',${n})">P${n}</button>`).join('')}</div>`
      : `<div style="display:flex;gap:4px;flex-wrap:wrap">${plsList.map(n => plTag(n)).join('')}</div>`}</div>
    <div style="margin-top:auto;padding-top:8px;border-top:1px solid var(--line2);display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px">
      <span class="dim">Confidence</span><span>${conf(ch.conf)}</span>
    </div>
  </div>`;
}
function rFwCardDetail(x, at, catHit) {
  const cf = FW_CARDS_F, h = at(x), compTitle = h.c || x.c, cs = fwCourses(x, h);
  const provs = [...new Set(cs.map(c => c.p))].filter(Boolean).sort();
  const types = [...new Set(cs.map(c => catAt(c).type))].filter(Boolean).sort();
  const statuses = [...new Set(['Active', 'Pending review', 'Inactive', ...cs.map(c => catAt(c).st)])].filter(Boolean);
  const sortedCs = cs.filter(c => {
    const ch = catAt(c), plsList = catPlsFor(c, compTitle), attnLbl = isCourseFlagged(c, ch) ? 'Needs attention' : 'Healthy';
    return catHit(c) && (!cf.p.length || cf.p.includes(c.p)) && (!cf.type.length || cf.type.includes(ch.type)) && (!cf.pl.length || plsList.some(n => cf.pl.includes(String(n)))) && (!cf.st.length || cf.st.includes(ch.st)) && (!cf.attn.length || cf.attn.includes(attnLbl));
  }).sort((a, b) => (catAt(b).conf || 0) - (catAt(a).conf || 0));
  const chips = [
    cf.cq ? `<button class="fc-chip" type="button" onclick="setFwCardsFilter('cq','')">Search: ${esc(cf.cq)} ×</button>` : '',
    ...cf.p.map(v => `<button class="fc-chip" type="button" onclick="toggleFwCardsMs('p','${escArg(v)}')">Provider: ${esc(v)} ×</button>`),
    ...cf.type.map(v => `<button class="fc-chip" type="button" onclick="toggleFwCardsMs('type','${escArg(v)}')">Type: ${esc(v)} ×</button>`),
    ...cf.pl.map(n => `<button class="fc-chip" type="button" onclick="toggleFwCardsMs('pl','${n}')">Level: P${n} ×</button>`),
    ...cf.st.map(v => `<button class="fc-chip" type="button" onclick="toggleFwCardsMs('st','${escArg(v)}')">Status: ${esc(v)} ×</button>`),
    ...cf.attn.map(v => `<button class="fc-chip" type="button" onclick="toggleFwCardsMs('attn','${escArg(v)}')">Health: ${esc(v)} ×</button>`)
  ].filter(Boolean);
  const activeEl = document.activeElement, keepCourseFocus = activeEl && activeEl.id === 'fwDetCourseQ', courseSelStart = keepCourseFocus ? activeEl.selectionStart : null;
  const detRecs = REC.filter(r => norm(r.c) === norm(compTitle)), detAss = ASSESS.filter(a => norm(a.c) === norm(compTitle));
  const selVerObj = VERSIONS.find(z => z.v === h.v) || VERSIONS[VERSIONS.length - 1], isCurrentVer = !selVerObj.to;
  const verFrom = selVerObj.from, verTo = selVerObj.to || '9999-12-31', verYear = Number(selVerObj.v.slice(0, 4));
  const verRecs = detRecs.filter(r => r.date >= verFrom && r.date <= verTo), verAss = detAss.filter(a => a.y === verYear);
  const verPicker = renderVerPickHtml(`${h.v}${isCurrentVer ? ' · Current' : ` (${verYear})`}`, `${verRange(selVerObj)} · ${esc(h.chg)}`, 'Select framework version', `ROWVER['${x._id}']=this.value;rFwCards();rFw()`, [...x.hist].reverse().map(o => { const vv = VERSIONS.find(z => z.v === o.v); return `<option value="${o.v}" ${o.v === h.v ? 'selected' : ''}>${o.v} (${o.v.slice(0, 4)})${vv && !vv.to ? ' · Current' : ''}</option>`; }).join(''));
  const pillCls = cs.length >= 2 ? 'many' : cs.length === 1 ? 'one' : 'zero';
  const filtGroups = [
    { key: 'p', label: 'Provider', opts: provs.map(p => ({ v: p, l: p })) },
    { key: 'type', label: 'Course type', opts: types.map(t => ({ v: t, l: t })) },
    { key: 'pl', label: 'Proficiency level', opts: [1, 2, 3, 4, 5].map(n => ({ v: String(n), l: 'P' + n })) },
    { key: 'st', label: 'Course status', opts: statuses.map(s => ({ v: s, l: s })) },
    { key: 'attn', label: 'Review status', opts: [{ v: 'Healthy', l: 'Healthy' }, { v: 'Needs attention', l: 'Needs attention' }] }
  ].filter(g => g.opts.length);
  FW_DET_FILT_GROUPS = filtGroups;
  if (!NAV_TRAIL.length) NAV_TRAIL = [{ label: 'Frameworks', fn: () => openFwCardDetail(null) }];
  if ($('#fwCardsBar')) $('#fwCardsBar').innerHTML = renderTrailHtml(compTitle);
  $('#fwCards').innerHTML = `<div class="fc-det-card">
    <div class="fc-det-head">
      <div>
        <div class="fc-dir-title" style="font-size:17px"><span>${esc(compTitle)}</span>${pls(h.pl)}</div>
        <div class="fc-dir-sub" style="margin-top:4px">${esc(h.fw || x.fw)} · ${esc(h.lib || x.lib)}</div>
        <div style="margin-top:6px">${pill(fwDisplayStatus(x, h))}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          ${verPicker}
          ${!isCurrentVer ? `<button class="btn sm out" type="button" onclick="ROWVER['${x._id}']='${VERSIONS[VERSIONS.length - 1].v}';rFwCards();rFw()">Latest</button>` : ''}
        </div>
        <button class="btn sm" type="button" style="display:inline-flex;align-items:center;gap:8px" onclick="openCourseAssess('${escArg(compTitle)}',null,null)"><span>View assessments (${detAss.length})</span><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></button>
      </div>
    </div>
    <div style="padding:14px 20px;border-bottom:1px solid var(--line2);display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <span class="dim" style="font-size:12px;margin-right:2px">Staff</span>
      ${renderStaffSummaryHtml(detAss, activePlsOf(h.pl))}
    </div>
    ${FW_DET_LOG_OPEN[x._id] ? `<div style="padding:14px 18px;border-bottom:1px solid var(--line2);background:var(--panel2)">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap">
        <div><b style="font-size:13.5px">Version History &amp; Logged Data (${esc(h.v)} · ${verRange(selVerObj)})</b><div class="dim" style="font-size:12px">Select any version/year to inspect framework levels and the training records &amp; assessments logged during that period.</div></div>
        <button class="btn sm" type="button" onclick="FW_DET_LOG_OPEN['${x._id}']=false;rFwCards()">Hide log</button>
      </div>
      <div class="tw" style="margin-bottom:12px;background:var(--panel);border-radius:8px"><table>
        <tr><th>Version</th><th>In effect</th><th>Updated by</th><th>Levels</th><th>Status</th><th>Change log</th><th class="num">Logged records</th></tr>
        ${[...x.hist].reverse().map(o => {
    const vv = VERSIONS.find(z => z.v === o.v) || selVerObj, recN = detRecs.filter(r => r.date >= vv.from && r.date <= (vv.to || '9999-12-31')).length, isSel = o.v === h.v;
    return `<tr style="cursor:pointer;${isSel ? 'background:var(--accent-soft)' : ''}" onclick="ROWVER['${x._id}']='${o.v}';rFwCards();rFw()"><td class="mono"><b>${o.v}</b>${!vv.to ? ' <span class="pill p-acc">Current</span>' : ''}${isSel ? ' <span class="pill p-ok">Viewing</span>' : ''}</td><td class="dim">${verRange(vv)}</td><td class="dim">${esc(vv.by || '—')}</td><td>${pls(o.pl)}</td><td>${pill(o.st)}</td><td>${esc(o.chg)}</td><td class="num mono">${recN}</td></tr>`;
  }).join('')}
      </table></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="card" style="padding:10px 12px;margin:0"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="font-size:12.5px">Logged Training Records (${verRange(selVerObj)})</b><span class="pill p-dim">${verRecs.length}</span></div>${verRecs.length ? `<div class="tw"><table><tr><th>Staff</th><th>Course</th><th>Date</th><th>Status</th></tr>${verRecs.slice(0, 6).map(r => `<tr><td class="mono">${esc(r.id)}</td><td class="wrap">${esc(r.course)}</td><td class="mono dim">${esc(r.date)}</td><td>${pill(r.st)}</td></tr>`).join('')}</table></div>${verRecs.length > 6 ? `<div class="dim" style="font-size:11.5px;margin-top:6px">Showing 6 of ${verRecs.length} records</div>` : ''}` : `<div class="dim" style="font-size:12px">No training records logged in ${esc(h.v)} (${verRange(selVerObj)}).</div>`}</div>
        <div class="card" style="padding:10px 12px;margin:0"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="font-size:12.5px">Logged Assessments (${verYear})</b><span class="pill p-dim">${verAss.length}</span></div>${verAss.length ? `<div class="tw"><table><tr><th>Staff</th><th>Dept</th><th>Req</th><th>Rating</th></tr>${verAss.slice(0, 6).map(a => `<tr><td class="mono">${esc(a.id)}</td><td>${esc(a.dept)}</td><td class="mono">PL${a.req}</td><td>${pill(a.rating)}</td></tr>`).join('')}</table></div>${verAss.length > 6 ? `<div class="dim" style="font-size:11.5px;margin-top:6px">Showing 6 of ${verAss.length} assessments</div>` : ''}` : `<div class="dim" style="font-size:12px">No assessments logged in ${verYear}.</div>`}</div>
      </div>
    </div>` : ''}
    <div class="fc-det-body">
      <div class="fc-det-bar">
        <div style="display:flex;align-items:center;gap:10px"><b style="font-size:14px">Linked courses</b><span class="fw-lpill ${pillCls}">${cs.length} Course${cs.length === 1 ? '' : 's'}</span></div>
      </div>
      ${FW_ADD_OPEN[x._id] ? fwDetAddCourseBoxHtml(x, cs) : ''}
      ${cs.length ? renderDetFilterSearchBarHtml({
    searchId: 'fwDetCourseQ', searchVal: cf.cq || '', searchPlaceholder: 'Search linked courses…', onSearchInput: "setFwCardsFilter('cq',this.value)",
    wrapId: 'fwDetFiltWrap', open: FW_DET_FILT_OPEN, onToggleOpen: "FW_DET_FILT_OPEN=!FW_DET_FILT_OPEN;FW_CARDS_MS_OPEN='';rFwCards()",
    onDone: "FW_DET_FILT_OPEN=false;FW_CARDS_MS_OPEN='';rFwCards()", catKey: FW_DET_FILT_CAT, onCatChange: 'FW_DET_FILT_CAT=this.value;rFwCards()',
    groups: filtGroups, filters: cf, onToggleOpt: (k, v) => `toggleFwCardsMs('${k}','${escArg(v)}')`,
    onSelectAll: 'toggleSelectAllFwDetFilt()', onClearAll: 'clearFwCourseFilter()',
    shownCount: sortedCs.length, totalCount: cs.length, noun: 'course', appliedChips: chips
  }) : ''}
      ${sortedCs.length ? `<div class="fw-vgrid">${sortedCs.map(c => fwDetCourseCardHtml(x, h, compTitle, c)).join('')}</div>` : (cs.length ? `<div class="dim" style="font-size:12.5px;padding:8px 0">No linked courses match these filters.</div>` : '')}
    </div>
  </div>`;
  if (keepCourseFocus) { const cinp = $('#fwDetCourseQ'); if (cinp) { cinp.focus(); if (courseSelStart != null) cinp.setSelectionRange(courseSelStart, courseSelStart); } }
  $('#pg-fwcards').hidden = true;
}
function rFwCardsTable(rows, at, fwMatch, catHit, recHit, assHit) {
  $('#pg-fwcards').hidden = false;
  const cf = FW_CARDS_F, ff = FW_FLOW_F, st = libState('fwcards');
  const cql = (cf.cq || '').trim().toLowerCase(), rql = (cf.rq || '').trim().toLowerCase(), aql = (cf.aq || '').trim().toLowerCase();
  const ql = (cf.q || '').trim().toLowerCase();
  const hasCatFlow = !!(cql || Object.values(ff.cat).some(a => a.length));
  const hasRecFlow = !!(rql || Object.values(ff.rec).some(a => a.length));
  const hasAssFlow = !!(aql || Object.values(ff.ass).some(a => a.length));
  const out = rows.filter(x => {
    const h = at(x), compTitle = h.c || x.c, cs = fwCourses(x, h);
    if (ql && !(compTitle + ' ' + (h.fw || x.fw) + ' ' + (h.lib || x.lib) + ' ' + (x.kw || '')).toLowerCase().includes(ql)) return false;
    if (!fwMatch(x, h, cs)) return false;
    const tq = (FW_TBL_F.q || '').trim().toLowerCase();
    if (tq && !(compTitle + ' ' + (h.fw || x.fw) + ' ' + (h.lib || x.lib)).toLowerCase().includes(tq)) return false;
    if (FW_TBL_F.cSel && FW_TBL_F.cSel.length && !FW_TBL_F.cSel.includes(compTitle)) return false;
    if (FW_TBL_F.fw.length && !FW_TBL_F.fw.includes(h.fw || x.fw)) return false;
    if (FW_TBL_F.lib.length && !FW_TBL_F.lib.includes(h.lib || x.lib)) return false;
    if (FW_TBL_F.pl.length && !FW_TBL_F.pl.some(n => (h.pl || [])[Number(n) - 1])) return false;
    if (FW_TBL_F.cnt.length && !FW_TBL_F.cnt.includes(String(cs.length))) return false;
    if (FW_TBL_F.st.length && !FW_TBL_F.st.includes(fwDisplayStatus(x, h))) return false;
    if (hasCatFlow && !cs.some(catHit)) return false;
    if (hasRecFlow && !REC.some(r => norm(r.c) === norm(compTitle) && recHit(r))) return false;
    if (hasAssFlow && !ASSESS.some(a => norm(a.c) === norm(compTitle) && assHit(a))) return false;
    return true;
  }).sort((a, b) => {
    const ha = at(a), hb = at(b), ca = ha.c || a.c, cb = hb.c || b.c, csa = fwCourses(a, ha), csb = fwCourses(b, hb);
    if (FW_CARDS_SORT === 'name-desc') return cb.localeCompare(ca);
    if (FW_CARDS_SORT === 'cnt-desc') return csb.length - csa.length || ca.localeCompare(cb);
    if (FW_CARDS_SORT === 'cnt-asc') return csa.length - csb.length || ca.localeCompare(cb);
    if (FW_CARDS_SORT === 'upd-desc') return (VERSIONS.find(v => v.v === hb.v)?.from || '').localeCompare(VERSIONS.find(v => v.v === ha.v)?.from || '') || ca.localeCompare(cb);
    return ca.localeCompare(cb);
  });
  FW_CARDS_EXPORT_ROWS = out.flatMap(x => {
    const h = at(x), compTitle = h.c || x.c, cs = fwCourses(x, h);
    const matchedCs = cs.filter(c => catHit(c) && (!FW_IM.pl || !catPlsFor(c, compTitle).length || catPlsFor(c, compTitle).includes(Number(FW_IM.pl)))).sort((a, b) => (catAt(b).conf || 0) - (catAt(a).conf || 0));
    if (!matchedCs.length) return [[FW_IM.path || (h.lib || x.lib), FW_IM.role || 'All', FW_IM.pl ? 'P' + FW_IM.pl : 'All', FW_IM.dept || 'All', h.fw || x.fw, compTitle, '—', '—', '—', '—', '—', '—', '—', '—', 'No linked courses']];
    return matchedCs.map(c => {
      const ch = catAt(c), plsList = catPlsFor(c, compTitle);
      return [FW_IM.path || (h.lib || x.lib), FW_IM.role || 'All', FW_IM.pl ? 'P' + FW_IM.pl : 'All', FW_IM.dept || 'All', h.fw || x.fw, compTitle, c.t, plsList.length ? plsList.map(n => 'P' + n).join(', ') : 'P1', c.p, ch.type, ch.dur, c.src, c.rating || '—', ch.conf + '%', ch.st];
    });
  });
  LIB.fwcards_out = {
    cols: [
      { label: 'Competency', get: x => at(x).c || x.c }, { label: 'Framework', get: x => at(x).fw || x.fw }, { label: 'Category', get: x => at(x).lib || x.lib },
      { label: 'Levels', get: x => activePlsOf(at(x).pl).map(n => 'P' + n).join(', ') || '—' }, { label: 'Courses', get: x => fwCourses(x, at(x)).length }, { label: 'Status', get: x => fwDisplayStatus(x, at(x)) }
    ],
    out
  };
  $('#fwCardsBar').innerHTML = `<div class="fc-panel"><div class="fc-toolbar">
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">${renderFwCatToggleHtml('fw')}</div>
    <div class="fc-toolbar-r"><button class="btn sm out" type="button" onclick="exportCurrentList('fw')">${DL_ICO} Export</button></div>
  </div></div>`;
  const N = out.length, pages = Math.max(1, Math.ceil(N / FW_CARDS_PS));
  st.page = Math.min(pages, Math.max(1, st.page));
  const slice = out.slice((st.page - 1) * FW_CARDS_PS, st.page * FW_CARDS_PS);
  const tblChips = [
    FW_TBL_F.q ? `<button class="fc-chip" type="button" onclick="FW_TBL_F.q='';libState('fwcards').page=1;rFwCards()">Search: ${esc(FW_TBL_F.q)} ×</button>` : '',
    ...(FW_TBL_F.cSel || []).map(v => `<button class="fc-chip" type="button" onclick="FW_TBL_F.cSel=FW_TBL_F.cSel.filter(z=>z!=='${escArg(v)}');libState('fwcards').page=1;rFwCards()">Competency: ${esc(v)} ×</button>`),
    ...FW_TBL_F.fw.map(v => `<button class="fc-chip" type="button" onclick="toggleFwTblMs('fw','${escArg(v)}')">Framework: ${esc(v)} ×</button>`),
    ...FW_TBL_F.lib.map(v => `<button class="fc-chip" type="button" onclick="toggleFwTblMs('lib','${escArg(v)}')">Category: ${esc(v)} ×</button>`),
    ...FW_TBL_F.pl.map(n => `<button class="fc-chip" type="button" onclick="toggleFwTblMs('pl','${n}')">Level: P${n} ×</button>`),
    ...FW_TBL_F.cnt.map(v => `<button class="fc-chip" type="button" onclick="toggleFwTblMs('cnt','${escArg(v)}')">Courses: ${esc(v)} ×</button>`),
    ...FW_TBL_F.st.map(v => `<button class="fc-chip" type="button" onclick="toggleFwTblMs('st','${escArg(v)}')">Status: ${esc(v)} ×</button>`)
  ].filter(Boolean);
  const thF = (lbl, key, ico, cls = '') => {
    const isAct = key === 'q' ? !!(FW_TBL_F.q || (FW_TBL_F.cSel && FW_TBL_F.cSel.length)) : !!(FW_TBL_F[key] && FW_TBL_F[key].length);
    return `<th class="${cls}"><span class="thi">${lbl}<button class="fbtn${isAct ? ' act' : ''}" type="button" onclick="openFwTblPop(event,'${key}')" aria-label="Filter ${lbl}">${ico}</button></span></th>`;
  };
  const chipsHtml = tblChips.length ? `<div class="fc-applied" style="margin-bottom:10px;padding:8px 12px;background:var(--panel);border:1px solid var(--line);border-radius:10px"><div class="fc-applied-list"><b style="font-size:12.5px;margin-right:4px">Applied filters</b>${tblChips.join('')}</div><button class="fc-clear" type="button" onclick="FW_TBL_F.cSel=[];clearFwTblFilter()">Clear all</button></div>` : '';
  $('#fwCards').innerHTML = chipsHtml + (slice.length ? `<div class="card lib"><div class="tw"><table>
    <tr>${thF('Competency', 'q', SVG.search)}${thF('Framework', 'fw', SVG.filter)}${thF('Category', 'lib', SVG.filter)}${thF('Levels', 'pl', SVG.filter)}${thF('Courses', 'cnt', SVG.filter, 'num')}${thF('Status', 'st', SVG.filter)}<th>Action</th></tr>
    ${slice.map(x => {
      const h = at(x), compTitle = h.c || x.c, cs = fwCourses(x, h);
      return `<tr style="cursor:pointer" onclick="openFwCardDetail('${x._id}')"><td class="wrap"><b>${esc(compTitle)}</b></td><td>${esc(h.fw || x.fw)}</td><td>${esc(h.lib || x.lib)}</td><td>${pls(h.pl)}</td><td class="num mono">${cs.length}</td><td>${pill(fwDisplayStatus(x, h))}</td><td class="actc"><button class="btn sm" style="border:0;background:transparent;color:var(--accent)" type="button" title="View details" aria-label="View details" onclick="event.stopPropagation();openFwCardDetail('${x._id}')">→</button></td></tr>`;
    }).join('')}
  </table></div></div>` : `<div class="card"><div class="empty">No frameworks match these filters.</div></div>`);
  const psSel = `<select onchange="FW_CARDS_PS=Number(this.value);libState('fwcards').page=1;rFwCards()" aria-label="Items per page"><option value="20" ${FW_CARDS_PS === 20 ? 'selected' : ''}>20 / page</option><option value="50" ${FW_CARDS_PS === 50 ? 'selected' : ''}>50 / page</option></select>`;
  $('#pg-fwcards').innerHTML = renderPagerHtml(N, st.page, pages, n => `libPage('fwcards',${n})`, psSel);
}
function rFwCards() {
  const ver = verOn(FWDATE), rows = ver ? FW.filter(x => x.hist.some(h => h.v === ver.v)) : [];
  const at = x => x.hist.find(h => h.v === (ROWVER[x._id] || ver.v)) || x.hist.find(h => h.v === ver.v);
  const cf = FW_CARDS_F, ff = FW_FLOW_F;
  const cql = (cf.cq || '').trim().toLowerCase(), rql = (cf.rq || '').trim().toLowerCase(), aql = (cf.aq || '').trim().toLowerCase();
  const fwMatch = (x, h, cs) => (!ff.fw.lib.length || ff.fw.lib.includes(h.lib || x.lib)) && (!ff.fw.pl.length || ff.fw.pl.some(n => (h.pl || [])[Number(n) - 1])) && (!ff.fw.cnt.length || ff.fw.cnt.includes(cs.length ? 'With courses' : 'Without courses'));
  const catHit = c => {
    const ch = catAt(c), attnLbl = isCourseFlagged(c, ch) ? 'Needs attention' : 'Healthy';
    return (!cql || (c.t + ' ' + c.p + ' ' + ch.type + ' ' + (c.desc || '')).toLowerCase().includes(cql)) && (!ff.cat.p.length || ff.cat.p.includes(c.p)) && (!ff.cat.type.length || ff.cat.type.includes(ch.type)) && (!ff.cat.st.length || ff.cat.st.includes(ch.st)) && (!ff.cat.attn.length || ff.cat.attn.includes(attnLbl));
  };
  const recHit = r => (!rql || (r.id + ' ' + r.course + ' ' + r.c + ' ' + r.dept + ' ' + r.st).toLowerCase().includes(rql)) && (!ff.rec.dept.length || ff.rec.dept.includes(r.dept)) && (!ff.rec.st.length || ff.rec.st.includes(r.st)) && (!ff.rec.src.length || ff.rec.src.includes(r.src));
  const assHit = a => (!aql || (a.id + ' ' + a.c + ' ' + a.dept + ' ' + a.rating + ' ' + a.match).toLowerCase().includes(aql)) && (!ff.ass.y.length || ff.ass.y.includes(String(a.y))) && (!ff.ass.dept.length || ff.ass.dept.includes(a.dept)) && (!ff.ass.rating.length || ff.ass.rating.includes(a.rating)) && (!ff.ass.match.length || ff.ass.match.includes(a.match));
  if ($('#fwCardsFlow')) $('#fwCardsFlow').innerHTML = '';
  if (FW_CARDS_DETAIL) {
    const x = rows.find(r => r._id === FW_CARDS_DETAIL);
    if (x) return rFwCardDetail(x, at, catHit);
    FW_CARDS_DETAIL = null;
  }
  rFwCardsTable(rows, at, fwMatch, catHit, recHit, assHit);
}
function openHist(id) {
  const x = FW.find(r => r._id === id); if (!x) return;
  $('#histTitle').textContent = x.c; $('#histSub').textContent = `${x.fw} · ${x.lib}`;
  const recs = v => { const vv = VERSIONS.find(z => z.v === v); return REC.filter(r => norm(r.c) === norm(x.c) && r.date >= vv.from && (!vv.to || r.date <= vv.to)); };
  $('#histBody').innerHTML = `<div class="tw"><table><tr><th>Version</th><th>In effect</th><th>Levels</th><th>Status</th><th>Change</th><th class="num">Records mapped</th></tr>${[...x.hist].reverse().map(h => { const vv = VERSIONS.find(z => z.v === h.v), n = recs(h.v); return `<tr><td class="mono">${h.v}${!vv.to ? ' <span class="pill p-acc">Current</span>' : ''}</td><td class="dim">${verRange(vv)}</td><td>${pls(h.pl)}</td><td>${pill(h.st)}</td><td>${esc(h.chg)}</td><td class="num mono">${n.length}</td></tr>`; }).join('')}</table></div>
 <p class="hint" style="margin:12px 0 0">A learning record is mapped to the version in effect on its completion date and keeps that mapping when a newer version is uploaded.</p>`;
  $('#m-hist').hidden = false;
}
