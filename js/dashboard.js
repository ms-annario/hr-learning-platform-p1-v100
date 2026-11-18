/* ---------- RENDERERS ---------- */
function dashGo(p, f = {}, fq = {}, msg = '') {
  const st = libState(p);
  st.f = Object.assign({}, f);
  st.fq = Object.assign({}, fq);
  st.page = 1;
  go(p);
  if (msg) toast(msg);
}
function dashOpenFwStatus(stVal = null) {
  const plFilter = DASH_F.pl === 'all' ? 0 : Number(DASH_F.pl);
  FW_CARDS_DETAIL = null;
  FW_TBL_F.q = ''; FW_TBL_F.cSel = []; FW_TBL_F.fw = [];
  FW_TBL_F.lib = DASH_F.cat !== 'all' ? [DASH_F.cat] : [];
  FW_TBL_F.pl = plFilter ? [String(plFilter)] : [];
  FW_TBL_F.cnt = []; FW_TBL_F.st = stVal ? [stVal] : [];
  libState('fwcards').page = 1;
  go('fwcards');
}
function dashOpenAttn(kind) {
  const plFilter = DASH_F.pl === 'all' ? 0 : Number(DASH_F.pl);
  if (kind === 'catalog') {
    CAT_DETAIL = null;
    CAT_ATTN_ONLY = true;
    dashGo('catalog', plFilter ? { pl: ['PL' + plFilter] } : {});
  }
}
function dashNominate(staffId, comp) {
  const hasMatch = CAT.some(c => c.tags.some(t => norm(t[0]) === norm(comp)));
  dashGo('catalog', hasMatch ? { tags: comp } : {}, {}, staffId ? `Select a course in “${comp}” to nominate Staff ${staffId}` : `Showing catalog courses for “${comp}”`);
}
function dashAddCourse(comp) {
  dashGo('catalog', {}, {}, `Upload or tag a catalog course for “${comp}”`);
  openUp('catalog');
}
const DASH_F = { period: '2026', dept: 'all', cat: 'all', pl: 'all' };
function resetDashFilters() {
  DASH_F.period = '2026'; DASH_F.dept = 'all'; DASH_F.cat = 'all'; DASH_F.pl = 'all';
  rDash();
}
const dashFmtN = n => Number(n || 0).toLocaleString();
function dashGroupedCardHtml({ title, ico, icoBg, icoCol, manageFn, total, midTile, endTile, totalLbl, secondLbl, priBarCol = '#2563EB', secBarCol = '#DC2626', subSuffix = 'attn', secColor = 'var(--bad)', byLvl, onBarClick, plFilter }) {
  const maxTot = Math.max(1, ...byLvl.map(l => l.tot));
  return `<div class="db-card">
    <div class="db-chead">
      <div class="db-ctitle">
        <span class="db-ico" style="background:${icoBg};color:${icoCol}">${ico}</span>
        <h2>${title}</h2>
      </div>
      <button type="button" class="clink" title="Manage" aria-label="Manage" style="background:none;border:0;font:inherit;font-size:14px;line-height:1;font-weight:600;cursor:pointer" onclick="${manageFn}">→</button>
    </div>
    <div class="db-tiles">
      <div class="db-tile">
        <div class="db-tile-l">Total</div>
        <div class="db-tile-v mono">${dashFmtN(total)}</div>
      </div>
      <div class="${midTile.cls || 'db-tile'}"${midTile.onclick ? ` role="button" tabindex="0" title="${esc(midTile.title || '')}" onclick="${midTile.onclick}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${midTile.onclick}}"` : ''}>
        <div class="db-tile-l">${midTile.label}</div>
        <div class="db-tile-v mono" style="color:${midTile.color}">${dashFmtN(midTile.val)}</div>
        ${midTile.sub ? `<div class="db-tile-s">${midTile.sub}</div>` : ''}
      </div>
      <div class="${endTile.cls || 'db-tile'}"${endTile.onclick ? ` role="button" tabindex="0" title="${esc(endTile.title || '')}" onclick="${endTile.onclick}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${endTile.onclick}}"` : ''}>
        <div class="db-tile-l">${endTile.label}</div>
        <div class="db-tile-v mono" style="color:${endTile.color || 'var(--ink)'}">${endTile.valText}</div>
        ${endTile.sub ? `<div class="db-tile-s">${endTile.sub}</div>` : ''}
        ${endTile.barPct != null ? `<div class="db-pbar" style="margin-top:8px"><i style="width:${Math.min(100, Number(endTile.barPct))}%;background:${endTile.barCol || 'var(--bad)'}"></i></div>` : ''}
      </div>
    </div>
    <div class="db-sec-h"><b>By level (${plFilter ? 'P' + plFilter : 'P1–P5'})</b></div>
    <div class="db-bars5" style="grid-template-columns:repeat(${byLvl.length},minmax(0,1fr))">
      ${byLvl.map(l => {
        const hTot = l.tot ? Math.max(4, Math.round((l.tot / maxTot) * 84)) : 0;
        const hSec = l.sec ? Math.max(4, Math.round((l.sec / maxTot) * 84)) : 0;
        return `<div class="db-bgrp" onclick="${onBarClick(l.n)}" title="P${l.n}: ${l.tot} ${totalLbl.toLowerCase()} · ${l.sec} ${subSuffix}">
          <div class="db-bpair">
            <div class="db-bar" style="height:${hTot}px;background:${priBarCol}"><span class="db-blbl"><b>${dashFmtN(l.tot)}</b><br><span class="dim">${l.pct}%</span></span></div>
            <div class="db-bar" style="height:${hSec}px;background:${secBarCol}">${l.sec ? `<span class="db-blbl" style="color:${secColor}"><b>${dashFmtN(l.sec)}</b></span>` : ''}</div>
          </div>
          <span class="mono" style="font-size:11.5px;font-weight:600">P${l.n}</span>
        </div>`;
      }).join('')}
    </div>
    <div class="db-legend">
      <span><i class="db-dot" style="background:${priBarCol}"></i>${totalLbl}</span>
      <span><i class="db-dot" style="background:${secBarCol}"></i>${secondLbl}</span>
    </div>
    <div class="db-lvl5" style="grid-template-columns:repeat(${byLvl.length},minmax(0,1fr))">
      ${byLvl.map(l => `<div class="db-lbox" onclick="${onBarClick(l.n)}">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px"><b class="mono">P${l.n}</b><span class="dim mono">${l.pct}%</span></div>
        <div class="mono" style="font-size:15px;font-weight:700;margin-top:2px">${dashFmtN(l.tot)}</div>
        <div style="font-size:11px;margin-top:2px;color:${l.sec ? secColor : 'var(--ink3)'}">${l.sec} ${subSuffix}</div>
      </div>`).join('')}
    </div>
  </div>`;
}
function dashRecCardHtml(scopedRecs, levels) {
  const recDone = scopedRecs.filter(r => r.st === 'Completed').length;
  const recInProg = scopedRecs.filter(r => r.st === 'In progress').length;
  const recPct = scopedRecs.length ? ((recDone / scopedRecs.length) * 100).toFixed(1) : '0.0';
  const recByLvl = levels.map(n => {
    const sub = scopedRecs.filter(r => Number(r.pl) === n);
    const done = sub.filter(r => r.st === 'Completed').length;
    return { n, tot: sub.length, done, pct: sub.length ? ((done / sub.length) * 100).toFixed(1) : '0.0' };
  });
  const dR = 46, dC = 2 * Math.PI * dR, recDoneLen = scopedRecs.length ? (recDone / scopedRecs.length) * dC : 0;
  return `<div class="db-card">
    <div class="db-chead">
      <div class="db-ctitle">
        <span class="db-ico" style="background:var(--good-soft);color:var(--good)"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10l-10-5-10 5 10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></span>
        <h2>Records</h2>
      </div>
      <button type="button" class="clink" title="View all" aria-label="View all" style="background:none;border:0;font:inherit;font-size:14px;line-height:1;font-weight:600;cursor:pointer" onclick="go('records')">→</button>
    </div>
    <div class="db-tiles">
      <div class="db-tile"><div class="db-tile-l">Total</div><div class="db-tile-v mono">${dashFmtN(scopedRecs.length)}</div></div>
      <div class="db-tile"><div class="db-tile-l">Completed</div><div class="db-tile-v mono" style="color:var(--good)">${dashFmtN(recDone)}</div></div>
      <div class="db-tile"><div class="db-tile-l">In progress</div><div class="db-tile-v mono" style="color:#2563EB">${dashFmtN(recInProg)}</div></div>
      <div class="db-tile"><div class="db-tile-l">Done rate</div><div class="db-tile-v mono">${recPct}%</div></div>
    </div>
    <div class="db-split">
      <div>
        <div class="db-sec-h" style="margin-bottom:8px"><b>Status</b></div>
        <div style="display:flex;justify-content:center;padding:4px 0">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="${dR}" fill="none" stroke="#2563EB" stroke-width="15" style="cursor:pointer" onclick="dashGo('records',{st:['In progress']})"/>
            <circle cx="64" cy="64" r="${dR}" fill="none" stroke="#16A34A" stroke-width="15" stroke-dasharray="${recDoneLen.toFixed(2)} ${dC.toFixed(2)}" transform="rotate(-90 64 64)" style="cursor:pointer" onclick="dashGo('records',{st:['Completed']})"/>
            <text x="64" y="61" text-anchor="middle" font-size="18" font-weight="700" fill="var(--ink)" class="mono">${recPct}%</text>
            <text x="64" y="76" text-anchor="middle" font-size="10.5" fill="var(--ink3)">done</text>
          </svg>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;font-size:12px">
          <div style="display:flex;justify-content:space-between;cursor:pointer" onclick="dashGo('records',{st:['Completed']})"><span><i class="db-dot" style="background:#16A34A"></i>Completed</span><span class="mono"><b>${dashFmtN(recDone)}</b> <span class="dim">${recPct}%</span></span></div>
          <div style="display:flex;justify-content:space-between;cursor:pointer" onclick="dashGo('records',{st:['In progress']})"><span><i class="db-dot" style="background:#2563EB"></i>In progress</span><span class="mono"><b>${dashFmtN(recInProg)}</b> <span class="dim">${scopedRecs.length ? (100 - Number(recPct)).toFixed(1) : '0.0'}%</span></span></div>
        </div>
      </div>
      <div>
        <div class="db-sec-h" style="margin-bottom:10px"><b>Done by level</b></div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${recByLvl.map(l => {
            const pNum = Number(l.pct);
            return `<div>
              <div style="display:flex;justify-content:space-between;font-size:12px"><b class="mono">P${l.n}</b><span class="mono"><b>${l.pct}%</b> <span class="dim">${dashFmtN(l.done)}/${dashFmtN(l.tot)}</span></span></div>
              <div class="db-pbar"><i style="width:${Math.min(100, pNum)}%;background:${pNum >= 80 ? '#16A34A' : '#D97706'}"></i></div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>`;
}
function dashAttnCardHtml(catFlaggedList) {
  const prioItems = catFlaggedList.map(c => {
    const ch = catAt(c), isInv = ch.st === 'Invalid', isRev = ch.st !== 'Active' && !isInv;
    const confGap = ch.conf < thr() ? (thr() - ch.conf) : 0;
    const rateGap = (c.rating > 0 && c.rating < 4.5) ? Math.round((4.5 - c.rating) * 20) : 0;
    const reasonParts = [];
    if (ch.st !== 'Active') reasonParts.push(esc(ch.st));
    if (ch.conf < thr()) reasonParts.push(`Conf ${ch.conf}% (&lt;${thr()}%)`);
    if (c.rating > 0 && c.rating < 4.5) reasonParts.push(`${c.rating}★ rating`);
    return {
      kind: 'Course', title: c.t, reason: reasonParts.join(' · ') || 'Needs review',
      score: (isInv ? 100 : isRev ? 28 : 10) + confGap + rateGap,
      actLabel: isInv ? 'Fix' : 'Review',
      onclick: `openCatDetail('${c._id}')`
    };
  }).sort((a, b) => b.score - a.score);
  const topPrio = prioItems.slice(0, 5);
  return `<div class="db-card">
    <div class="db-chead">
      <div class="db-ctitle">
        <span class="db-ico" style="background:var(--bad-soft);color:var(--bad)"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
        <h2>Need attention</h2>
        <span class="pill p-bad">Top ${topPrio.length} priority</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:12px">
        ${catFlaggedList.length ? `<button type="button" class="clink" style="background:none;border:0;font:inherit;cursor:pointer;font-weight:600" onclick="dashOpenAttn('catalog')">${catFlaggedList.length} course${catFlaggedList.length === 1 ? '' : 's'}</button>` : ''}
      </div>
    </div>
    ${topPrio.length ? `<div class="db-prio-list">
      ${topPrio.map((p, idx) => `<div class="db-prio-row" role="button" tabindex="0" onclick="${p.onclick}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${p.onclick}}">
        <span class="db-prio-rank${idx < 2 ? ' hi' : ''} mono">#${idx + 1}</span>
        <div class="db-prio-main">
          <div class="db-prio-title"><span>${esc(p.title)}</span><span class="pill ${p.kind === 'Framework' ? 'p-acc' : 'p-dim'}" style="flex:0 0 auto">${p.kind}</span></div>
          <div class="db-prio-sub">${p.reason}</div>
        </div>
        <span class="db-prio-act" title="${esc(p.actLabel)}" aria-label="${esc(p.actLabel)}">→</span>
      </div>`).join('')}
    </div>` : `<div class="empty" style="padding:28px 12px">No items need attention for these filters.</div>`}
  </div>`;
}
function rDash() {
  const root = $('#dashRoot');
  if (!root) return;
  const ver = verOn(FWDATE);
  const allFwRows = ver ? FW.filter(x => x.hist.some(h => h.v === ver.v)) : [];
  const atFw = x => x.hist.find(h => h.v === (ROWVER[x._id] || ver.v)) || x.hist.find(h => h.v === ver.v);

  const libs = [...new Set(allFwRows.map(x => atFw(x).lib || x.lib).filter(Boolean))].sort();
  const depts = [...new Set([...REC.map(r => r.dept), ...ASSESS.map(a => a.dept)].filter(Boolean))].sort();
  const periods = [...new Set([...REC.map(r => String(r.date || '').slice(0, 4)), ...ASSESS.map(a => String(a.y || ''))].filter(v => /^\d{4}$/.test(v)))].sort().reverse();

  const plFilter = DASH_F.pl === 'all' ? 0 : Number(DASH_F.pl);
  const levels = plFilter ? [plFilter] : [1, 2, 3, 4, 5];
  const periodMatchRec = r => DASH_F.period === 'all' || String(r.date || '').startsWith(DASH_F.period);
  const periodMatchAss = a => DASH_F.period === 'all' || String(a.y) === DASH_F.period;

  let fwMeta = allFwRows.map(x => {
    const h = atFw(x), compTitle = h.c || x.c, allCs = fwCourses(x, h);
    const cs = plFilter ? allCs.filter(c => catPlsFor(c, compTitle).includes(plFilter)) : allCs;
    return { x, h, compTitle, lib: h.lib || x.lib, cs, isActive: fwDisplayStatus(x, h) === 'Active' };
  });
  if (DASH_F.cat !== 'all') fwMeta = fwMeta.filter(m => m.lib === DASH_F.cat);
  if (plFilter) fwMeta = fwMeta.filter(m => m.h.pl && m.h.pl[plFilter - 1]);
  if (DASH_F.dept !== 'all') {
    const deptCompSet = new Set();
    REC.forEach(r => { if (r.dept === DASH_F.dept && r.c && periodMatchRec(r)) deptCompSet.add(norm(r.c)); });
    ASSESS.forEach(a => { if (a.dept === DASH_F.dept && a.c && periodMatchAss(a)) deptCompSet.add(norm(a.c)); });
    fwMeta = fwMeta.filter(m => deptCompSet.has(norm(m.compTitle)));
  }
  const compScope = (DASH_F.cat !== 'all' || DASH_F.dept !== 'all' || plFilter) ? new Set(fwMeta.map(m => norm(m.compTitle))) : null;

  let scopedCats = visCat();
  if (compScope) scopedCats = scopedCats.filter(c => (catAt(c).tags || c.tags || []).some(t => compScope.has(norm(t[0])) && (!plFilter || Number(t[1]) === plFilter)));
  else if (plFilter) scopedCats = scopedCats.filter(c => (catAt(c).tags || c.tags || []).some(t => Number(t[1]) === plFilter));

  const scopedRecs = visRec().filter(r => periodMatchRec(r) && (DASH_F.dept === 'all' || r.dept === DASH_F.dept) && (!plFilter || Number(r.pl) === plFilter) && (!compScope || (r.c && compScope.has(norm(r.c)))));

  const fwActive = fwMeta.filter(m => m.isActive);
  const fwInactive = fwMeta.filter(m => !m.isActive);
  const fwActivePct = fwMeta.length ? ((fwActive.length / fwMeta.length) * 100).toFixed(1) : '0.0';
  const fwInactivePct = fwMeta.length ? ((fwInactive.length / fwMeta.length) * 100).toFixed(1) : '0.0';
  const fwByLvl = levels.map(n => {
    const tot = fwActive.filter(m => m.h.pl && m.h.pl[n - 1]).length;
    const sec = fwInactive.filter(m => m.h.pl && m.h.pl[n - 1]).length;
    return { n, tot, sec, pct: fwMeta.length ? ((tot / fwMeta.length) * 100).toFixed(1) : '0.0' };
  });

  const catFlaggedList = scopedCats.filter(c => isCourseFlagged(c, catAt(c)));
  const lowConfN = catFlaggedList.filter(c => catAt(c).conf < thr()).length;
  const otherFlagN = catFlaggedList.length - lowConfN;
  const catRate = scopedCats.length ? ((catFlaggedList.length / scopedCats.length) * 100).toFixed(1) : '0.0';
  const catByLvl = levels.map(n => {
    const atPl = scopedCats.filter(c => (catAt(c).tags || c.tags || []).some(t => Number(t[1]) === n));
    const sec = atPl.filter(c => isCourseFlagged(c, catAt(c), [n])).length;
    return { n, tot: atPl.length, sec, pct: scopedCats.length ? ((atPl.length / scopedCats.length) * 100).toFixed(1) : '0.0' };
  });

  const fwCard = dashGroupedCardHtml({
    title: 'Frameworks', ico: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg>',
    icoBg: 'var(--accent-soft)', icoCol: 'var(--accent)', manageFn: `dashOpenFwStatus(null)`,
    total: fwMeta.length,
    midTile: { cls: 'db-tile clk', label: 'Active', val: fwActive.length, color: 'var(--good)', sub: `${fwActivePct}% active`, title: 'View active frameworks', onclick: `dashOpenFwStatus('Active')` },
    endTile: { cls: 'db-tile clk', label: 'Inactive', valText: dashFmtN(fwInactive.length), color: 'var(--ink3)', sub: `${fwInactivePct}% inactive`, title: 'View inactive frameworks', onclick: `dashOpenFwStatus('Inactive')` },
    totalLbl: 'Active', secondLbl: 'Inactive', priBarCol: '#16A34A', secBarCol: '#94A3B8', subSuffix: 'inactive', secColor: 'var(--ink3)',
    byLvl: fwByLvl, plFilter, onBarClick: n => `FW_TBL_F.pl=['${n}'];FW_TBL_F.st=[];FW_CARDS_DETAIL=null;go('fwcards')`
  });
  const catCard = dashGroupedCardHtml({
    title: 'Courses', ico: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 0-3 3V4z"/><path d="M4 17a3 3 0 0 1 3-3h11"/></svg>',
    icoBg: 'var(--accent-soft)', icoCol: 'var(--accent)', manageFn: `CAT_ATTN_ONLY=false;dashGo('catalog')`,
    total: scopedCats.length,
    midTile: { cls: 'db-tile attn clk', label: 'Need attention', val: catFlaggedList.length, color: 'var(--bad)', sub: `${lowConfN} conf &lt;${thr()}%${otherFlagN ? ` · ${otherFlagN} status/rating` : ''}`, title: 'Show only items needing attention', onclick: `dashOpenAttn('catalog')` },
    endTile: { label: 'Attn rate', valText: `${catRate}%`, barPct: catRate, barCol: 'var(--bad)' },
    totalLbl: 'Courses', secondLbl: 'Need attention', byLvl: catByLvl, plFilter, onBarClick: n => `dashGo('catalog',{pl:['PL${n}']})`
  });
  const recCard = dashRecCardHtml(scopedRecs, levels);
  const attnCard = dashAttnCardHtml(catFlaggedList);

  const periodOpts = periods.map(p => `<option value="${esc(p)}" ${DASH_F.period === p ? 'selected' : ''}>${esc(p)}</option>`).join('') + `<option value="all" ${DASH_F.period === 'all' ? 'selected' : ''}>All</option>`;
  const selOpts = (arr, cur, fmt = v => v) => `<option value="all" ${cur === 'all' ? 'selected' : ''}>All</option>` + arr.map(v => `<option value="${esc(v)}" ${cur === String(v) ? 'selected' : ''}>${esc(fmt(v))}</option>`).join('');
  root.innerHTML = `
    <div class="db-fbar">
      <div class="db-flist">
        <div class="db-fitem"><span>Period</span><select aria-label="Period" onchange="DASH_F.period=this.value;rDash()">${periodOpts}</select></div>
        <div class="db-fitem"><span>Dept</span><select aria-label="Department" onchange="DASH_F.dept=this.value;rDash()">${selOpts(depts, DASH_F.dept)}</select></div>
        <div class="db-fitem"><span>Category</span><select aria-label="Category" onchange="DASH_F.cat=this.value;rDash()">${selOpts(libs, DASH_F.cat)}</select></div>
        <div class="db-fitem"><span>Level</span><select aria-label="Level" onchange="DASH_F.pl=this.value;rDash()">${selOpts([1, 2, 3, 4, 5], DASH_F.pl, n => 'P' + n)}</select></div>
      </div>
      <button type="button" class="btn sm out" onclick="resetDashFilters()">Reset</button>
    </div>
    <div class="db-grid">${fwCard}${catCard}${recCard}${attnCard}</div>
  `;
}
