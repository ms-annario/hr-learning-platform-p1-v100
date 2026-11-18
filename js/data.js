/* ---------- MOCK DATA ---------- */
const FW = [
  { fw: 'WOG Compliance & Enforcement', lib: 'Regulatory Ops', c: 'Regulatory Operations Management & Delivery', pl: [1, 1, 1, 1, 1], v: '2026-05', st: 'Active' },
  { fw: 'WOG Compliance & Enforcement', lib: 'Regulatory Ops', c: 'Enforcement Investigation & Case Management', pl: [1, 1, 1, 1, 0], v: '2026-05', st: 'Active' },
  { fw: 'WOG Compliance & Enforcement', lib: 'Regulatory Ops', c: 'Mediation & Dispute Resolution', pl: [1, 1, 1, 0, 0], v: '2026-05', st: 'Active' },
  { fw: 'LTA Rail & Road', lib: 'Safety Health', c: 'LTA Safety, Health & Environmental Management System and Processes', pl: [1, 1, 1, 1, 0], v: '2026-05', st: 'Active' },
  { fw: 'LTA Rail & Road', lib: 'Safety Health', c: 'Construction Environmental Engineering and Sustainability', pl: [0, 1, 1, 1, 0], v: '2026-05', st: 'Active' },
  { fw: 'LTA Rail & Road', lib: 'Safety Health', c: 'Total Safety Management System', pl: [0, 1, 1, 1, 0], v: '2026-05', st: 'Active' },
  { fw: 'LTA Rail & Road', lib: 'Safety Health', c: 'Workplace Safety & Health Risk Assessment', pl: [1, 1, 1, 1, 1], v: '2025-11', st: 'Inactive' },
  { fw: 'IFD', lib: 'Project Delivery', c: 'IFD Project Management Tools and Software', pl: [1, 1, 1, 1, 0], v: '2026-05', st: 'Active' },
  { fw: 'IFD', lib: 'Project Delivery', c: 'IFD Quality Management', pl: [1, 1, 1, 1, 1], v: '2026-05', st: 'Active' },
  { fw: 'IFD', lib: 'Project Delivery', c: 'IFD RTS and Road Infrastructure Design', pl: [0, 1, 1, 1, 1], v: '2026-05', st: 'Active' },
  { fw: 'IFD', lib: 'Project Delivery', c: 'IFD Contract Administration', pl: [1, 1, 1, 1, 0], v: '2026-05', st: 'Active' },
];
const PLNAME = ['', 'Level 1 / Foundational', 'Level 2 / Foundational 2', 'Level 3 / Intermediate', 'Level 4 / Advanced', 'Level 5 / Expert'];

const ASSESS = [
  { y: 2025, id: '10170662', dept: 'IFD', c: 'IFD LTA Safety & Environmental Management System and Processes', req: 4, rating: 'Meeting', gap: 0, match: 'Exact' },
  { y: 2025, id: '10170662', dept: 'IFD', c: 'IFD Project Management Tools and Software', req: 3, rating: 'Meeting', gap: 0, match: 'Exact' },
  { y: 2025, id: '10170662', dept: 'IFD', c: 'IFD Quality Management', req: 4, rating: 'Meeting', gap: 0, match: 'Exact' },
  { y: 2025, id: '10170662', dept: 'IFD', c: 'IFD RTS and Road Infrastructure Design', req: 4, rating: 'Exceeding', gap: 1, match: 'Exact' },
  { y: 2025, id: '10182340', dept: 'Rail Safety', c: 'LTA Safety, Health & Environmental Mgmt System and Processes', req: 3, rating: 'Meeting', gap: 0, match: 'Cleaned' },
  { y: 2025, id: '10182340', dept: 'Rail Safety', c: 'Construction Environmental Engineering and Sustainability', req: 3, rating: 'Below', gap: -1, match: 'Exact' },
  { y: 2025, id: '10182340', dept: 'Rail Safety', c: 'Total Safety Mgt System', req: 2, rating: 'Meeting', gap: 0, match: 'Similar 0.91' },
  { y: 2025, id: '10175519', dept: 'Enforcement', c: 'Regulatory Operations Management & Delivery', req: 3, rating: 'Below', gap: -2, match: 'Exact' },
  { y: 2025, id: '10175519', dept: 'Enforcement', c: 'Enforcement Investigation & Case Management', req: 3, rating: 'Meeting', gap: 0, match: 'Exact' },
  { y: 2025, id: '10175519', dept: 'Enforcement', c: 'Mediation and Dispute Resolution', req: 2, rating: 'Meeting', gap: 0, match: 'Cleaned' },
  { y: 2025, id: '10190027', dept: 'Enforcement', c: 'Regulatory Operations Management & Delivery', req: 4, rating: 'Meeting', gap: 0, match: 'Exact' },
  { y: 2025, id: '10190027', dept: 'Enforcement', c: 'Enforcement Field Ops', req: 3, rating: 'Meeting', gap: 0, match: 'Unmatched' },
  { y: 2024, id: '10170662', dept: 'IFD', c: 'IFD Quality Management', req: 4, rating: 'Meeting', gap: 0, match: 'Exact' },
  { y: 2024, id: '10175519', dept: 'Enforcement', c: 'Regulatory Operations Management & Delivery', req: 3, rating: 'Meeting', gap: 0, match: 'Exact' },
];

const CAT = [
  { t: 'Basic Mediation Course', p: 'CSC', type: 'e-Learning', dur: '30 mins', src: 'Public', url: 'learn.gov.sg · DLC-MED01', tags: [['Mediation & Dispute Resolution', 1], ['Mediation & Dispute Resolution', 2]], st: 'Active', conf: 94 },
  { t: 'Core Enforcement Principles', p: 'CSC', type: 'e-Learning', dur: '35 mins', src: 'Public', url: 'learn.gov.sg · DLC-CEP01', tags: [['Regulatory Operations Management & Delivery', 1], ['Regulatory Operations Management & Delivery', 2]], st: 'Active', conf: 96 },
  { t: 'Foundational Workshop for Frontline Enforcement Officers', p: 'CSC', type: 'SS', dur: '1 day', src: 'Public', url: 'learn.gov.sg · CR-FWEO', tags: [['Regulatory Operations Management & Delivery', 1], ['Regulatory Operations Management & Delivery', 2]], st: 'Active', conf: 92 },
  { t: 'Fundamentals Of Investigation', p: 'CSC', type: 'SS', dur: '3 days', src: 'Public', url: 'learn.gov.sg · CR-FOI', tags: [['Enforcement Investigation & Case Management', 2]], st: 'Active', conf: 90 },
  { t: 'Investigative Interview Techniques', p: 'CSC', type: 'SS', dur: '3 days', src: 'Public', url: 'learn.gov.sg · CR-IIT', tags: [['Enforcement Investigation & Case Management', 3]], st: 'Active', conf: 88 },
  { t: 'Legal Rights & Powers for Enforcement Officers', p: 'CSC', type: 'e-Learning', dur: '40 mins', src: 'Public', url: 'learn.gov.sg · DLC-LRP', tags: [['Regulatory Operations Management & Delivery', 1]], st: 'Active', conf: 93 },
  { t: 'Managing Sousveillance in Enforcement', p: 'CSC', type: 'SS', dur: '1 day', src: 'Public', url: 'learn.gov.sg · CR-MSE', tags: [['Regulatory Operations Management & Delivery', 2]], st: 'Pending review', conf: 71 },
  { t: 'WSH Induction for Rail Projects', p: 'LTA Academy', type: 'In-house', dur: '4 hrs', src: 'In-house', url: '—', tags: [['LTA Safety, Health & Environmental Management System and Processes', 1]], st: 'Active', conf: 97 },
  { t: 'Environmental Impact Assessment Workshop', p: 'LTA Academy', type: 'In-house', dur: '1 day', src: 'In-house', url: '—', tags: [['Construction Environmental Engineering and Sustainability', 2]], st: 'Active', conf: 95 },
  { t: 'Primavera P6 Fundamentals', p: 'Oracle University', type: 'Workshop', dur: '2 days', src: 'Public', url: 'oracle.com', tags: [['IFD Project Management Tools and Software', 2]], st: 'Active', conf: 89 },
  { t: 'ISO 9001:2015 Internal Auditor', p: 'SGS Academy', type: 'Workshop', dur: '2 days', src: 'Public', url: 'sgs.com', tags: [['IFD Quality Management', 3]], st: 'Pending review', conf: 76 },
  { t: 'Site Safety Briefing (SharePoint link)', p: '—', type: 'In-house', dur: '—', src: 'In-house', url: 'sharepoint (manual entry)', tags: [], st: 'Invalid', conf: 0 },
];

const REC = [
  { id: '10175519', dept: 'Enforcement', course: 'Core Enforcement Principles', p: 'CSC', date: '2025-03-12', h: 0.6, match: 'Catalog', c: 'Regulatory Operations Management & Delivery', pl: 1, conf: 96, st: 'Completed' },
  { id: '10175519', dept: 'Enforcement', course: 'Fundamentals of Investigation', p: 'Civil Service College', date: '2025-06-02', h: 21, match: 'Catalog', c: 'Enforcement Investigation & Case Management', pl: 2, conf: 90, st: 'Completed' },
  { id: '10190027', dept: 'Enforcement', course: 'Managing Sousveillance in Enforcement', p: 'CSC', date: '2025-08-19', h: 7, match: 'Catalog', c: 'Regulatory Operations Management & Delivery', pl: 2, conf: 71, st: 'In progress' },
  { id: '10182340', dept: 'Rail Safety', course: 'WSH Induction for Rail Projects', p: 'LTA Academy', date: '2025-01-20', h: 4, match: 'In-house', c: 'LTA Safety, Health & Environmental Management System and Processes', pl: 1, conf: 97, st: 'Completed' },
  { id: '10182340', dept: 'Rail Safety', course: 'EIA Workshop', p: 'LTA', date: '2025-04-08', h: 7, match: 'Catalog', c: 'Construction Environmental Engineering and Sustainability', pl: 2, conf: 78, st: 'In progress' },
  { id: '10170662', dept: 'IFD', course: 'Primavera P6 Fundamentals', p: 'Oracle University', date: '2025-02-14', h: 14, match: 'Catalog', c: 'IFD Project Management Tools and Software', pl: 2, conf: 89, st: 'Completed' },
  { id: '10170662', dept: 'IFD', course: 'ISO 9001 Internal Auditor', p: 'SGS', date: '2025-09-30', h: 14, match: 'Catalog', c: 'IFD Quality Management', pl: 3, conf: 76, st: 'In progress' },
  { id: '10170662', dept: 'IFD', course: 'Lunchtime talk: Quality culture', p: '', date: '2025-05-06', h: 1, match: 'None', c: '', pl: 0, conf: 0, st: 'In progress' },
  { id: '10190027', dept: 'Enforcement', course: 'Investigative Interview Techniques', p: 'CSC', date: '2024-11-11', h: 21, match: 'Catalog', c: 'Enforcement Investigation & Case Management', pl: 3, conf: 88, st: 'Completed' },
  { id: '10182340', dept: 'Rail Safety', course: 'Total Safety Management Overview', p: 'LTA Academy', date: '2025-07-22', h: 3, match: 'In-house', c: 'Total Safety Management System', pl: 2, conf: 93, st: 'Completed' },
];

/* extra rows so paging is meaningful */
FW.push(
  { fw: 'WOG Compliance & Enforcement', lib: 'Regulatory Ops', c: 'Traffic Enforcement & Road Safety Operations', pl: [1, 1, 1, 1, 0], v: '2026-05', st: 'Active' },
  { fw: 'LTA Rail & Road', lib: 'Safety Health', c: 'Incident Investigation & Reporting', pl: [1, 1, 1, 0, 0], v: '2026-05', st: 'Active' },
  { fw: 'IFD', lib: 'Project Delivery', c: 'IFD Cost Estimation & Budget Control', pl: [1, 1, 1, 1, 0], v: '2026-05', st: 'Active' },
  { fw: 'LTA Rail & Road', lib: 'Safety Health', c: 'Noise & Vibration Control on Site', pl: [0, 1, 1, 0, 0], v: '2025-11', st: 'Inactive' });
FW.push({ fw: 'IFD', lib: 'Project Delivery', c: 'IFD Stakeholder Engagement & Public Communications', pl: [1, 1, 1, 1, 0], v: '2026-05', st: 'Active' });
FW.push({ fw: 'WOG Compliance & Enforcement', lib: 'Regulatory Ops', c: 'Community Engagement for Enforcement Outreach', pl: [1, 1, 1, 0, 0], v: '2026-05', st: 'Active' });
const KW = {
  'Regulatory Operations Management & Delivery': 'enforcement operations compliance planning deployment officers',
  'Enforcement Investigation & Case Management': 'investigation interview evidence case file prosecution',
  'Mediation & Dispute Resolution': 'stakeholder conflict negotiation parties agreement managing disputes complaints',
  'LTA Safety, Health & Environmental Management System and Processes': 'wsh workplace safety health ehs audit system site',
  'Construction Environmental Engineering and Sustainability': 'eia environmental impact sustainability noise pollution',
  'Total Safety Management System': 'safety culture hazard risk tsms site',
  'Workplace Safety & Health Risk Assessment': 'wsh hazard risk assessment control',
  'IFD Project Management Tools and Software': 'primavera p6 ms project schedule planning tools software',
  'IFD Quality Management': 'iso 9001 quality audit assurance inspection',
  'IFD RTS and Road Infrastructure Design': 'rapid transit rail road design infrastructure standards',
  'IFD Contract Administration': 'contract claims variations procurement tender administration',
  'Traffic Enforcement & Road Safety Operations': 'traffic road safety enforcement operations patrol',
  'Incident Investigation & Reporting': 'incident accident investigation report root cause',
  'IFD Cost Estimation & Budget Control': 'cost budget estimation finance control forecast',
  'Noise & Vibration Control on Site': 'noise vibration environmental site control',
  'IFD Stakeholder Engagement & Public Communications': 'stakeholder engagement manage relationships residents agencies public communications consultation managing expectations',
  'Community Engagement for Enforcement Outreach': 'community stakeholder engagement outreach public education managing feedback'
};
FW.forEach(x => x.kw = KW[x.c] || '');
FW.forEach(x => x.upd = x.v === '2026-05' ? '2026-05-07' : '2025-11-12');
const VERSIONS = [{ v: '2025-03', from: '2025-03-03', to: '2025-11-11', up: '3 Mar 2025', by: 'Wei Ling Tan' }, { v: '2025-11', from: '2025-11-12', to: '2026-05-06', up: '12 Nov 2025', by: 'Nurul Hassan' }, { v: '2026-05', from: '2026-05-07', to: null, up: '7 May 2026', by: 'Nurul Hassan' }];
const ADDED_2605 = ['Incident Investigation & Reporting', 'IFD Cost Estimation & Budget Control', 'Traffic Enforcement & Road Safety Operations', 'IFD Stakeholder Engagement & Public Communications', 'Community Engagement for Enforcement Outreach'];
const ADDED_2511 = ['Construction Environmental Engineering and Sustainability', 'IFD RTS and Road Infrastructure Design'];
const CHG_2605 = { 'LTA Safety, Health & Environmental Management System and Processes': 'PL4 text updated', 'IFD Quality Management': 'PL5 added', 'Mediation & Dispute Resolution': 'PL3 required knowledge expanded' };
const CHG_2511 = { 'Regulatory Operations Management & Delivery': 'PL2 text updated', 'Total Safety Management System': 'PL4 added' };
function stepDownPl(pl, dropCount) {
  const out = [...pl];
  let left = dropCount;
  for (let i = out.length - 1; i >= 0 && left > 0; i--) {
    if (out[i] && out.filter(Boolean).length > 1) { out[i] = 0; left--; }
  }
  return out;
}
function initFwHist(x) {
  if (x.hist) return;
  x.kw = x.kw || KW[x.c] || '';
  x.upd = x.upd || (x.v === '2026-05' ? '2026-05-07' : '2025-11-12');
  const h = []; const inact = x.st === 'Inactive';
  const pl2511 = inact ? x.pl : stepDownPl(x.pl, 1);
  const pl2503 = stepDownPl(pl2511, 1);
  const fmtPls = a => a.map((v, i) => v ? 'PL' + (i + 1) : null).filter(Boolean).join('–');
  if (!ADDED_2605.includes(x.c) && !ADDED_2511.includes(x.c)) {
    h.push({ v: '2025-03', fw: x.fw, lib: x.lib, c: x.c, pl: pl2503, st: 'Active', chg: `Initial release (${fmtPls(pl2503)})` });
  }
  if (!ADDED_2605.includes(x.c)) {
    h.push({ v: '2025-11', fw: x.fw, lib: x.lib, c: x.c, pl: pl2511, st: 'Active', chg: ADDED_2511.includes(x.c) ? `Added (${fmtPls(pl2511)})` : (CHG_2511[x.c] ? `${CHG_2511[x.c]} · expanded to ${fmtPls(pl2511)}` : `Expanded levels to ${fmtPls(pl2511)}`) });
  }
  h.push({ v: '2026-05', fw: x.fw, lib: x.lib, c: x.c, pl: [...x.pl], st: inact ? 'Inactive' : 'Active', chg: inact ? 'Not in 2026-05 file · made inactive' : ADDED_2605.includes(x.c) ? `Added (${fmtPls(x.pl)})` : (CHG_2605[x.c] ? `${CHG_2605[x.c]} (${fmtPls(x.pl)})` : `Expanded levels to ${fmtPls(x.pl)}`) });
  x.hist = h;
}
FW.forEach(initFwHist);
let FWDATE = new Date().toISOString().slice(0, 10);
let ROWVER = {};
function fmtR(d) { const [y, m, dd] = d.split('-'); return `${dd}/${m}/${y}`; }
function verOn(d) { return VERSIONS.filter(v => v.from <= d && (!v.to || d <= v.to))[0] || null; }
function verRange(v) { return v.to ? `${fmtR(v.from)} – ${fmtR(v.to)}` : `${fmtR(v.from)} – today`; }

CAT.push(
  { t: 'Workplace Safety & Health Officer Course', p: 'NTUC LearningHub', type: 'Workshop', dur: '5 days', src: 'Public', url: 'ntuclearninghub.com', tags: [['LTA Safety, Health & Environmental Management System and Processes', 3]], st: 'Active', conf: 91 },
  { t: 'Risk Management for Construction Projects', p: 'BCA Academy', type: 'Workshop', dur: '2 days', src: 'Public', url: 'bcaa.edu.sg', tags: [['Total Safety Management System', 3]], st: 'Active', conf: 87 },
  { t: 'Contract Administration for Civil Works', p: 'LTA Academy', type: 'In-house', dur: '1 day', src: 'In-house', url: '—', tags: [['IFD Contract Administration', 2]], st: 'Active', conf: 96 },
  { t: 'Advanced Mediation Skills', p: 'Singapore Mediation Centre', type: 'Workshop', dur: '2 days', src: 'Public', url: 'mediation.com.sg', tags: [['Mediation & Dispute Resolution', 3]], st: 'Active', conf: 90 },
  { t: 'Root Cause Analysis Workshop', p: 'LTA Academy', type: 'In-house', dur: 'half day', src: 'In-house', url: '—', tags: [['Incident Investigation & Reporting', 2]], st: 'Active', conf: 94 },
  { t: 'MS Project Essentials', p: 'NTUC LearningHub', type: 'e-Learning', dur: '6 hrs', src: 'Public', url: 'ntuclearninghub.com', tags: [['IFD Project Management Tools and Software', 1]], st: 'Active', conf: 92 });
CAT.forEach((x, i) => x.upd = x.upd || ['2026-11-14', '2026-11-14', '2026-11-14', '2026-11-14', '2026-11-14', '2026-11-14', '2026-11-14', '2026-10-02', '2026-10-02', '2026-09-18', '2026-11-14', '2026-11-14', '2026-11-10', '2026-11-10', '2026-10-02', '2026-11-10', '2026-10-02', '2026-11-10'][i] || '2026-11-14');
const STAFF = { '10188104': 'Rail Safety', '10193355': 'IFD', '10179920': 'Enforcement', '10185567': 'IFD', '10176231': 'Enforcement', '10191448': 'Rail Safety' };
const GEN = [['10188104', 'WSH Induction for Rail Projects', 'LTA Academy', '2025-01-27', 4, 'LTA Safety, Health & Environmental Management System and Processes', 1, 97],
['10188104', 'Workplace Safety & Health Officer Course', 'NTUC LearningHub', '2025-03-03', 35, 'LTA Safety, Health & Environmental Management System and Processes', 3, 91],
['10188104', 'Risk Management for Construction Projects', 'BCA Academy', '2025-06-16', 14, 'Total Safety Management System', 3, 87],
['10188104', 'Root Cause Analysis Workshop', 'LTA Academy', '2025-09-09', 3.5, 'Incident Investigation & Reporting', 2, 94],
['10193355', 'MS Project Essentials', 'NTUC LearningHub', '2025-02-03', 6, 'IFD Project Management Tools and Software', 1, 92],
['10193355', 'Primavera P6 Fundamentals', 'Oracle University', '2025-04-22', 14, 'IFD Project Management Tools and Software', 2, 89],
['10193355', 'Contract Administration for Civil Works', 'LTA Academy', '2025-08-05', 7, 'IFD Contract Administration', 2, 96],
['10179920', 'Core Enforcement Principles', 'CSC', '2025-01-15', 0.6, 'Regulatory Operations Management & Delivery', 1, 96],
['10179920', 'Legal Rights & Powers for Enforcement Officers', 'CSC', '2025-01-16', 0.7, 'Regulatory Operations Management & Delivery', 1, 93],
['10179920', 'Basic Mediation Course', 'CSC', '2025-02-10', 0.5, 'Mediation & Dispute Resolution', 1, 94],
['10179920', 'Advanced Mediation Skills', 'Singapore Mediation Centre', '2025-07-14', 14, 'Mediation & Dispute Resolution', 3, 90],
['10185567', 'ISO 9001:2015 Internal Auditor', 'SGS Academy', '2025-03-18', 14, 'IFD Quality Management', 3, 88],
['10185567', 'Contract Administration for Civil Works', 'LTA Academy', '2025-08-05', 7, 'IFD Contract Administration', 2, 96],
['10176231', 'Foundational Workshop for Frontline Enforcement Officers', 'CSC', '2025-02-24', 7, 'Regulatory Operations Management & Delivery', 1, 92],
['10176231', 'Fundamentals Of Investigation', 'CSC', '2025-05-12', 21, 'Enforcement Investigation & Case Management', 2, 90],
['10176231', 'Investigative Interview Techniques', 'CSC', '2025-09-01', 21, 'Enforcement Investigation & Case Management', 3, 88],
['10191448', 'Environmental Impact Assessment Workshop', 'LTA Academy', '2025-04-08', 7, 'Construction Environmental Engineering and Sustainability', 2, 95],
['10191448', 'WSH Induction for Rail Projects', 'LTA Academy', '2025-01-20', 4, 'LTA Safety, Health & Environmental Management System and Processes', 1, 97],
['10191448', 'Total Safety Management Overview', 'LTA Academy', '2025-07-22', 3, 'Total Safety Management System', 2, 93],
['10175519', 'Basic Mediation Course', 'CSC', '2025-02-11', 0.5, 'Mediation & Dispute Resolution', 1, 94],
['10190027', 'Legal Rights & Powers for Enforcement Officers', 'CSC', '2025-03-05', 0.7, 'Regulatory Operations Management & Delivery', 1, 93],
['10170662', 'MS Project Essentials', 'NTUC LearningHub', '2025-01-09', 6, 'IFD Project Management Tools and Software', 1, 92],
['10182340', 'Root Cause Analysis Workshop', 'LTA Academy', '2025-10-14', 3.5, 'Incident Investigation & Reporting', 2, 94],
['10185567', 'Primavera P6 Fundamentals', 'Oracle University', '2025-10-21', 14, 'IFD Project Management Tools and Software', 2, 89]];
GEN.forEach(g => REC.push({ id: g[0], dept: STAFF[g[0]] || REC.find(r => r.id === g[0])?.dept, course: g[1], p: g[2], date: g[3], h: g[4], match: g[2] === 'LTA Academy' ? 'In-house' : 'Catalog', c: g[5], pl: g[6], conf: g[7], st: 'Completed' }));
[['10188104', 'Rail Safety', 'LTA Safety, Health & Environmental Management System and Processes', 3, 'Meeting', 0], ['10188104', 'Rail Safety', 'Total Safety Management System', 3, 'Meeting', 0], ['10188104', 'Rail Safety', 'Incident Investigation & Reporting', 2, 'Below', -1],
['10193355', 'IFD', 'IFD Project Management Tools and Software', 2, 'Exceeding', 1], ['10193355', 'IFD', 'IFD Contract Administration', 3, 'Below', -1], ['10193355', 'IFD', 'IFD Quality Management', 3, 'Meeting', 0],
['10179920', 'Enforcement', 'Regulatory Operations Management & Delivery', 2, 'Meeting', 0], ['10179920', 'Enforcement', 'Mediation & Dispute Resolution', 3, 'Meeting', 0], ['10179920', 'Enforcement', 'Enforcement Investigation & Case Management', 2, 'Below', -1],
['10185567', 'IFD', 'IFD Quality Management', 4, 'Below', -1], ['10185567', 'IFD', 'IFD Contract Administration', 2, 'Meeting', 0], ['10185567', 'IFD', 'IFD Cost Estimation & Budget Control', 3, 'Below', -2],
['10176231', 'Enforcement', 'Regulatory Operations Management & Delivery', 2, 'Meeting', 0], ['10176231', 'Enforcement', 'Enforcement Investigation & Case Management', 3, 'Meeting', 0], ['10176231', 'Enforcement', 'Traffic Enforcement & Road Safety Operations', 3, 'Below', -1],
['10191448', 'Rail Safety', 'Construction Environmental Engineering and Sustainability', 3, 'Meeting', 0], ['10191448', 'Rail Safety', 'Total Safety Management System', 2, 'Exceeding', 1], ['10191448', 'Rail Safety', 'LTA Safety, Health & Environmental Management System and Processes', 4, 'Below', -1]
].forEach(a => ASSESS.push({ y: 2025, id: a[0], dept: a[1], c: a[2], req: a[3], rating: a[4], gap: a[5], match: 'Exact' }));
(() => {
  const fwDomains = [
    ['WOG Compliance & Enforcement', 'Regulatory Ops', 'Enforcement', ['Regulatory Compliance', 'Field Enforcement', 'Statutory Inspection', 'Public Engagement', 'Case Management', 'Evidence Handling', 'Dispute Mediation', 'Incident Response', 'Traffic Control', 'Permit Governance']],
    ['LTA Rail & Road', 'Safety Health', 'Rail Safety', ['Rail Safety Assurance', 'Tunnel Ventilation Safety', 'Trackside Risk Control', 'Environmental Monitoring', 'Noise Mitigation', 'Emergency Evacuation', 'WSH Auditing', 'Signalling Safety', 'Hazard Identification', 'Contractor Safety']],
    ['IFD', 'Project Delivery', 'IFD', ['Civil Contract Admin', 'Cost Forecasting', 'Schedule Baseline Control', 'BIM Coordination', 'Design Governance', 'Quality Assurance', 'Stakeholder Alignment', 'Tender Evaluation', 'Risk & Claims Mgmt', 'Infrastructure Handover']],
    ['Digital & Data', 'Technology & AI', 'Digital Ops', ['Data Governance', 'AI Model Validation', 'Cloud Security Ops', 'Analytics Storytelling', 'API Integration', 'Cyber Incident Triage', 'Automation Workflow', 'System Architecture', 'Database Reliability', 'Digital Product Ops']],
    ['Public & Stakeholder Ops', 'Customer Experience', 'Customer Ops', ['Service Recovery', 'Commuter Communications', 'Accessibility Standards', 'Crisis Messaging', 'Feedback Analytics', 'Frontline De-escalation', 'Partner Liaison', 'Community Outreach', 'Service Design', 'Policy Briefing']]
  ];
  const focusAreas = ['Fundamentals', 'Operations', 'Governance', 'Standards', 'Planning', 'Execution', 'Review', 'Leadership', 'Optimization', 'Compliance'];
  const provs = ['CSC', 'LTA Academy', 'Oracle University', 'SGS Academy', 'NUS ISS', 'BCA Academy'];
  const types = ['e-Learning', 'SS', 'Workshop', 'In-house'];
  const durs = ['35 mins', '45 mins', '4 hrs', '1 day', '2 days', '3 days'];
  const hrsMap = { '35 mins': 0.6, '45 mins': 0.8, '4 hrs': 4, '1 day': 7, '2 days': 14, '3 days': 21 };

  let seq = 1;
  const fwSeen = new Set(FW.map(f => f.c));
  while (FW.length < 500) {
    const dom = fwDomains[seq % fwDomains.length];
    const topic = dom[3][Math.floor(seq / fwDomains.length) % dom[3].length];
    const focus = focusAreas[Math.floor(seq / (fwDomains.length * dom[3].length)) % focusAreas.length];
    const name = `${topic} — ${focus} ${Math.floor(seq / 50) + 1}.${(seq % 50) + 1}`;
    if (!fwSeen.has(name)) {
      fwSeen.add(name);
      const pl = [1, 1, 1, seq % 3 === 0 ? 0 : 1, seq % 5 === 0 ? 1 : 0];
      FW.push({ fw: dom[0], lib: dom[1], c: name, pl, v: seq % 12 === 0 ? '2025-11' : '2026-05', st: seq === 150 ? 'Inactive' : 'Active' });
    }
    seq++;
  }
  FW.forEach(initFwHist);

  const STAFF_100 = Array.from({ length: 100 }, (_, i) => ({
    id: String(10170001 + i),
    dept: fwDomains[i % fwDomains.length][2]
  }));

  const catByComp = {};
  CAT.forEach(c => (c.tags || []).forEach(t => { const k = t[0].toLowerCase(); (catByComp[k] = catByComp[k] || []).push(c); }));
  const topicCourseStems = {
    'Accessibility Standards': ['Barrier-Free Transit Architecture', 'Universal Wayfinding & Signage', 'Inclusive Facility Design', 'BCA Accessibility Code', 'Assistive Mobility Systems', 'Commuter Access Inspection'],
    'Service Design': ['Commuter Journey Mapping', 'Public Experience Prototyping', 'Human-Centred Service Blueprints', 'Frontline Touchpoint Redesign', 'Co-Creation Lab for Services', 'Digital & Counter Service Flow'],
    'Commuter Communications': ['Passenger Advisory Writing', 'Service Disruption Messaging', 'Wayfinding Information Clarity', 'Multichannel Commuter Updates', 'Station Announcement Protocols', 'Inclusive Travel Advisories'],
    'Crisis Messaging': ['Rapid Incident Spokesperson Briefing', 'Emergency Media Coordination', 'Public Trust During Disruptions', 'Real-Time Holding Statements', 'Multi-Agency Crisis Comms', 'Post-Incident Stakeholder Briefing'],
    'Service Recovery': ['Empathetic Complaint Resolution', 'Escalation De-escalation Clinic', 'Root-Cause Service Recovery', 'Passenger Turnaround Strategies', 'Frontline Recovery Coaching', 'High-Stakes Case Closure'],
    'Feedback Analytics': ['Sentiment Mining for Ops', 'Voice-of-Commuter Dashboards', 'Survey Design & Sampling', 'Complaint Trend Diagnostics', 'Text Analytics for Public Ops', 'KPI & CSAT Insights'],
    'Frontline De-escalation': ['Calm Verbal Intervention', 'Conflict Containment Skills', 'Safety-First Customer Handling', 'High-Stress Counter Techniques', 'Body Language & Empathy', 'Difficult Conversation Drills'],
    'Partner Liaison': ['Inter-Agency MOU Coordination', 'Vendor & Operator Governance', 'Joint Operational Briefings', 'Community Partner Protocols', 'Cross-Sector Alignment Labs', 'Strategic Liaison Playbook'],
    'Community Outreach': ['Townhall Facilitation Skills', 'Grassroots Project Engagement', 'Public Exhibition Design', 'Resident Advisory Dialogues', 'Neighbourhood Liaison Clinics', 'Civic Participation Methods'],
    'Policy Briefing': ['Cabinet Paper Writing', 'Executive Policy Synthesis', 'Regulatory Impact Storyboarding', 'Evidence-Based Briefs', 'Ministerial Q&A Preparation', 'Cross-Ministry Policy Alignment'],
    'Regulatory Compliance': ['Statutory Code Interpretation', 'Compliance Audit Readiness', 'Regulatory Licensing Controls', 'Enforcement Governance Rules', 'Policy Breach Triage', 'Legal Mandate Operations'],
    'Field Enforcement': ['Patrol & Inspection Protocols', 'Officer Safety in Operations', 'On-Site Notice Issuance', 'Body-Worn Camera Procedures', 'Field Jurisdiction Boundaries', 'Joint Agency Raids & Sweeps'],
    'Statutory Inspection': ['Pre-Commissioning Checklist Lab', 'Non-Conformance Documentation', 'Technical Premises Audits', 'Safety Permit Verification', 'Field Evidence Photography', 'Inspection Report Writing'],
    'Public Engagement': ['Stakeholder Consultation Clinics', 'Handling Public Petitions', 'Transparent Feedback Loops', 'Civic Dialogue Moderation', 'Media & Community Readiness', 'Project Outreach Toolkits'],
    'Case Management': ['Prosecution File Preparation', 'Digital Case Tracking', 'Evidence Chain Workflows', 'Multi-Party Case Coordination', 'Time-Bound Case Closure', 'Administrative Sanctions Process'],
    'Evidence Handling': ['Forensic Photo & CCTV Preservation', 'Statement Taking Standards', 'Chain-of-Custody Integrity', 'Exhibit Tagging & Storage', 'Admissible Record Keeping', 'Witness Interview Protocols'],
    'Dispute Mediation': ['Interest-Based Negotiation', 'Multi-Party Settlement Skills', 'Neutral Caucus Facilitation', 'Deadlock Breaking Tactics', 'Mediation Agreement Drafting', 'Active Listening Mastery'],
    'Incident Response': ['First-Responder Scene Command', 'Escalation & Triage Drills', 'Multi-Agency Incident Handoff', 'Critical Event Logging', 'After-Action Review Clinic', 'Contingency Activation'],
    'Traffic Control': ['Corridor Flow Management', 'Peak-Hour Diversion Planning', 'Road Closure Safety Setup', 'ITS Signal Coordination', 'Workzone Traffic Marshalling', 'Congestion Mitigation Ops'],
    'Permit Governance': ['Temporary Occupation Permits', 'Heavy Vehicle Escort Rules', 'Road Opening Approvals', 'Compliance Condition Audits', 'Permit Revocation Procedures', 'Digital Licensing Workflows'],
    'Rail Safety Assurance': ['ISA & Safety Case Review', 'RAMS Engineering Basics', 'System Assurance Gates', 'Safety Certification Audits', 'Operational Readiness Checks', 'Rail Hazard Closure'],
    'Tunnel Ventilation Safety': ['Underground Smoke Extraction', 'Jet Fan Emergency Modes', 'Airflow & CFD Monitoring', 'Confined Space Air Quality', 'Tunnel Fire Life Safety', 'Ventilation Damper Testing'],
    'Trackside Risk Control': ['Possession & Protection Rules', 'Third-Rail Traction Isolation', 'Night Maintenance Safety', 'Lookout & Lookout-Free Zones', 'Depot & Mainline Access', 'Trackside PPE & Clearances'],
    'Environmental Monitoring': ['Construction Dust & Silt Control', 'Waterway Effluent Sampling', 'Air Quality Sensor QA', 'ISO 14001 Field Audits', 'Green Works Compliance', 'Ecological Impact Mitigations'],
    'Noise Mitigation': ['Acoustic Barrier Engineering', 'NEA Construction Noise Limits', 'Vibration Monitoring & Alerts', 'Night Works Quiet Equipment', 'Track Grinding Noise Control', 'Resident Acoustic Reporting'],
    'Emergency Evacuation': ['Station Platform Crowd Egress', 'Tunnel Detrainment Drills', 'SCDF Joint Rescue Coordination', 'Emergency PA & Wayfinding', 'Disabled Passenger Evacuation', 'Fire Command Tabletop'],
    'WSH Auditing': ['ConSASS Audit Preparation', 'ISO 45001 Safety Audits', 'Risk Register Verification', 'Safe Work Procedure Reviews', 'Contractor WSH Scoring', 'Corrective Action Tracking'],
    'Signalling Safety': ['CBTC Failsafe Principles', 'SIL-4 Software Verification', 'Interlocking Logic Walkthrough', 'Platform Screen Door Sync', 'Axle Counter & Track Circuits', 'Degraded Mode Operations'],
    'Hazard Identification': ['Bowtie Risk Analysis', 'FMEA & HAZOP Workshops', 'Near-Miss Pattern Analysis', 'Dynamic Job Safety Analysis', 'Human Factors Error Traps', 'Site Hazard Walkdowns'],
    'Contractor Safety': ['Permit-to-Work Governance', 'Subcontractor Onboarding', 'Safety Incentive & Penalty', 'Toolbox Talk Quality Audits', 'Lifting & Crane Supervision', 'Vendor Safety Leadership'],
    'Civil Contract Admin': ['PSSCOC Variation Orders', 'Engineer Instructions & Claims', 'Progress Payment Certification', 'Extension of Time Assessment', 'Defects Liability Management', 'Liquidated Damages Protocols'],
    'Cost Forecasting': ['Quantity Surveying Cashflow', 'Earned Value Cost Variance', 'Contingency Drawdown Control', 'Life-Cycle Cost Modelling', 'Inflation & Price Adjustment', 'Capital Budget Re-baselining'],
    'Schedule Baseline Control': ['Critical Path Float Recovery', 'Primavera Baseline Audits', 'Milestone Slippage Analysis', 'Resource-Loaded Scheduling', 'Interface Window Sequencing', 'Delay Analysis Forensics'],
    'BIM Coordination': ['ISO 19650 Common Data Env', 'Navisworks Clash Detection', 'Revit Civil Model Auditing', '5D Cost & 4D Phasing Links', 'OpenBIM IFC Standards', 'As-Built Digital Twins'],
    'Design Governance': ['Technical Design Gate Reviews', 'Value Engineering Clinics', 'Constructability Peer Audits', 'Code Waiver Justification', 'Multidisciplinary Interfaces', 'Design Freeze Protocols'],
    'Quality Assurance': ['ITP Inspection & Test Plans', 'Concrete & Steel Materials QA', 'Non-Conformance Rectification', 'ISO 9001 Quality Auditing', 'Factory Acceptance Testing', 'Handover Quality Punchlists'],
    'Stakeholder Alignment': ['Utility Diversion Coordination', 'Cross-Agency Steering Prep', 'Managing Site Neighbours', 'Executive Alignment Briefs', 'Interface Conflict Resolution', 'Public Works Communications'],
    'Tender Evaluation': ['GeBIZ Price-Quality Scoring', 'Technical Proposal Auditing', 'Whole-Life Bid Comparison', 'Tender Clarification Ethics', 'Contract Award Justification', 'Vendor Financial Due Diligence'],
    'Risk & Claims Mgmt': ['Contractual Notice Timelines', 'Dispute Adjudication Prep', 'Delay & Disruption Records', 'Quantitative Risk Simulation', 'Force Majeure Clauses', 'Claims Settlement Strategy'],
    'Infrastructure Handover': ['Testing & Commissioning Gates', 'O&M Manual Verification', 'Operator Asset Onboarding', 'Spares & Warranty Transfer', 'Statutory Clearance Sign-off', 'Post-Handover Defect Audits'],
    'Data Governance': ['Data Classification & Privacy', 'PDPA & IM8 Compliance', 'Data Lineage & Cataloging', 'Master Data Stewardship', 'Access Control Policies', 'Data Quality SLAs'],
    'AI Model Validation': ['Model Drift & Bias Auditing', 'LLM Hallucination Guardrails', 'Explainability & SHAP Metrics', 'Red-Teaming Generative AI', 'Validation Dataset Hygiene', 'Production AI Governance'],
    'Cloud Security Ops': ['Zero-Trust Cloud Architecture', 'IAM Least-Privilege Hardening', 'Container & K8s Security', 'CSPM Misconfig Remediation', 'Cloud Threat Detection', 'Secrets & KMS Management'],
    'Analytics Storytelling': ['Executive Decision Dashboards', 'Data Narrative Architecture', 'Chart Choice & Visual Clarity', 'Self-Service BI Design', 'Insight-to-Action Briefings', 'Metrics That Matter'],
    'API Integration': ['REST & OpenAPI Contracts', 'Event-Driven Kafka Patterns', 'API Gateway Rate Limiting', 'Idempotency & Retry Design', 'OAuth2 & mTLS Security', 'Legacy System Connectors'],
    'Cyber Incident Triage': ['SIEM Alert Investigation', 'SOC Containment Playbooks', 'Ransomware Response Drills', 'Forensic Log Triage', 'CSA Breach Notification', 'Threat Hunting Fundamentals'],
    'Automation Workflow': ['Low-Code Process Orchestration', 'RPA Bot Exception Handling', 'Workflow SLA Monitoring', 'Document Extraction Pipelines', 'Human-in-the-Loop Approvals', 'Automation ROI Tracking'],
    'System Architecture': ['Resilient Microservices Design', 'High-Availability Failover', 'Domain-Driven Boundaries', 'Distributed Caching Strategy', 'Disaster Recovery Drills', 'Architecture Decision Records'],
    'Database Reliability': ['Postgres Query Tuning', 'Zero-Downtime Schema Migrations', 'Replication & Backup Testing', 'Connection Pooling at Scale', 'Lock Contention Diagnostics', 'Time-Series Data Partitioning'],
    'Digital Product Ops': ['SLO & Error Budget Ops', 'Feature Flag Rollouts', 'User Funnel Telemetry', 'Product Backlog Triage', 'Post-Release Health Checks', 'Continuous Discovery Loops'],
    'Mediation & Dispute Resolution': ['Interest-Based Negotiation', 'De-Escalation in Public Friction', 'Settlement Drafting Practice', 'Multi-Party Conciliation', 'Difficult Conversations Lab', 'Neutral Facilitation Skills'],
    'LTA Safety, Health & Environmental Management System and Processes': ['SHEMS Audit Readiness', 'Permit-to-Work Governance', 'Contractor Safety Inspections', 'SHE Corrective Action Loops', 'Site Safety Induction Design', 'Environmental Compliance Walks'],
    'Construction Environmental Engineering and Sustainability': ['Silt Control & Drainage Design', 'Green Civil Materials', 'Construction Carbon Accounting', 'Dust & Air Quality Mitigation', 'Circular Site Waste Flows', 'Sustainable Depot Retrofits'],
    'Total Safety Management System': ['Safety Culture Maturity', 'Barrier Management Assurance', 'Safety Performance Indicators', 'Executive Safety Reviews', 'Human Factors in Operations', 'Continuous Hazard Learning'],
    'Workplace Safety & Health Risk Assessment': ['Activity-Based Risk Matrices', 'Hierarchy of Controls Lab', 'Confined Space Risk Reviews', 'Working-at-Height Controls', 'Dynamic Job Hazard Analysis', 'Subcontractor RAMS Audits'],
    'IFD Project Management Tools and Software': ['Critical Path Scheduling', 'BIM 4D Schedule Integration', 'Earned Value Tracking', 'Resource Levelling Clinics', 'Baseline Variance Analysis', 'Master Programme Controls'],
    'IFD Quality Management': ['Inspection & Test Plan Audits', 'Non-Conformance Closeout', 'Concrete & Rebar QA Checks', 'ISO 9001 Project Assurance', 'Defect-Free Handover Protocols', 'Supplier Quality Surveillance'],
    'IFD RTS and Road Infrastructure Design': ['Junction Geometry & Sightlines', 'Station Viaduct Alignment', 'Underground Box Drainage', 'Active Mobility Path Design', 'Road Pavement Rehabilitation', 'Utilities Diversion Planning'],
    'IFD Contract Administration': ['PSSCOC Variation Orders', 'Extension of Time Claims', 'Progress Payment Valuation', 'Security of Payment Compliance', 'Site Instruction Governance', 'Final Account Settlement'],
    'Traffic Enforcement & Road Safety Operations': ['Roadblock Deployment Drills', 'Heavy Vehicle Weight Checks', 'Digital Evidence Chain', 'Speed & Red-Light Enforcement', 'Peak-Hour Corridor Patrols', 'Roadside Safety Briefings'],
    'Incident Investigation & Reporting': ['5-Whys & Fishbone Mapping', 'Witness Interviewing Skills', 'Scene Preservation Protocols', 'CAPA Effectiveness Reviews', 'MOM & WSH Incident Filing', 'Near-Miss Trend Analytics'],
    'IFD Cost Estimation & Budget Control': ['Bill of Quantities Pricing', 'Cost-to-Complete Forecasting', 'Change Order Benchmarking', 'Value Engineering Workshops', 'Tender Evaluation Commercials', 'Contingency Drawdown Control'],
    'Noise & Vibration Control on Site': ['Acoustic Barrier Siting', 'Real-Time Leq Monitoring', 'Piling Vibration Thresholds', 'Quiet Plant & Muffler Audits', 'NEA Noise Permit Compliance', 'Resident Noise Response'],
    'IFD Stakeholder Engagement & Public Communications': ['Townhall Consultation Clinics', 'Construction Impact Advisories', 'Residents Feedback Triage', 'Diversion Signposting Plans', 'MP & Grassroots Briefings', 'Public Works Crisis Comms'],
    'Community Engagement for Enforcement Outreach': ['Public Education Roadshows', 'Active Mobility Safe Riding', 'Retail & Operator Briefings', 'Youth Outreach Facilitation', 'Behavioural Nudge Campaigns', 'Localised Compliance Drives']
  };
  const courseStyles = ['Workshop', 'Practicum', 'Masterclass', 'Case Clinic', 'Field Lab', 'Playbook', 'Seminar', 'Certification Track', 'Simulation', 'Toolkit'];
  const usedCatTitles = new Set(CAT.map(c => c.t.toLowerCase()));
  const makeRelatedCourseTitle = (f, fi, k, pl) => {
    const baseTopic = f.c.split(' — ')[0];
    const stems = topicCourseStems[baseTopic] || [baseTopic + ' Practice', baseTopic + ' Systems', baseTopic + ' Operations', baseTopic + ' Case Studies', baseTopic + ' Standards'];
    const cohorts = ['', ' — Part II', ' — Intensive', ' (Ops Track)', ' (Lead Track)', ` (P${pl} Focus)`];
    for (let attempt = 0; attempt < cohorts.length * courseStyles.length; attempt++) {
      const stem = stems[(fi + k + attempt) % stems.length];
      const style = courseStyles[(fi * 3 + k + Math.floor(attempt / cohorts.length)) % courseStyles.length];
      const coh = cohorts[attempt % cohorts.length];
      const cand = `${stem}: ${style}${coh}`;
      if (!usedCatTitles.has(cand.toLowerCase()) && cand.toLowerCase() !== f.c.toLowerCase()) {
        usedCatTitles.add(cand.toLowerCase());
        return cand;
      }
    }
    const fallback = `${baseTopic} ${courseStyles[k % courseStyles.length]} #${fi}-${k + 1}`;
    usedCatTitles.add(fallback.toLowerCase());
    return fallback;
  };
  FW.forEach((f, fi) => {
    const existing = catByComp[f.c.toLowerCase()] || [];
    const targetN = f.c === 'Accessibility Standards — Compliance 10.15' ? 3 : (1 + ((fi * 7 + 3) % 10));
    const activePls = [1, 2, 3, 4, 5].filter(n => f.pl[n - 1]);
    for (let k = existing.length; k < targetN; k++) {
      const pl = activePls[(fi + k) % activePls.length] || 1;
      const pl2 = (activePls.length >= 2 && (fi + k) % 2 === 0) ? activePls[(fi + k + 1) % activePls.length] : null;
      const courseTags = (pl2 && pl2 !== pl) ? [[f.c, pl], [f.c, pl2]].sort((a, b) => a[1] - b[1]) : [[f.c, pl]];
      const p = provs[(fi + k) % provs.length];
      const tp = types[(fi + k) % types.length];
      const dur = durs[(fi + k) % durs.length];
      const conf = (k === 0 && (fi === 60 || fi === 180 || fi === 300)) ? 72 : 84 + ((fi + k * 3) % 15);
      const st = conf < 80 ? 'Pending review' : 'Active';
      const rating = conf < 80 ? 4.2 : Number((4.5 + ((fi + k) % 5) * 0.1).toFixed(1));
      CAT.push({
        t: makeRelatedCourseTitle(f, fi, k, pl),
        p, type: tp, dur, src: p === 'LTA Academy' ? 'In-house' : 'Public',
        url: p === 'LTA Academy' ? '—' : `learn.gov.sg · CRS-${fi}-${k}`,
        tags: courseTags, st, conf, rating, reviews: 25 + ((fi * 7 + k * 13) % 180), upd: '2026-11-14'
      });
    }
  });

  const deptFor = (comp, p) => {
    const lc = comp.toLowerCase();
    const d = fwDomains.find(x => lc.includes(x[1].toLowerCase()) || x[3].some(t => lc.includes(t.toLowerCase())));
    if (d) return d[2];
    return /enforcement|mediation|traffic|community/i.test(comp) ? 'Enforcement' : (/safety|environmental|incident|noise|wsh/i.test(comp) ? 'Rail Safety' : 'IFD');
  };
  const staffByDept = {};
  STAFF_100.forEach(s => { (staffByDept[s.dept] = staffByDept[s.dept] || []).push(s.id); });

  const recCountByCourse = {};
  REC.forEach(r => { const k = r.course.toLowerCase(); recCountByCourse[k] = (recCountByCourse[k] || 0) + 1; });
  CAT.forEach((c, ci) => {
    const tags = (c.tags && c.tags.length) ? c.tags : [['', 0]];
    const comp = tags[0][0] || '', dept = deptFor(comp, c.p);
    const ids = staffByDept[dept] || staffByDept.Enforcement;
    const targetRecN = 21 + (ci % 7);
    const k = c.t.toLowerCase();
    for (let idx = recCountByCourse[k] || 0; idx < targetRecN; idx++) {
      const tag = tags[idx % tags.length];
      const sid = STAFF_100[(ci * 7 + idx * 3) % STAFF_100.length]?.id || ids[idx % ids.length];
      const staffDept = idx < 10 ? dept : (STAFF_100[(ci * 7 + idx * 3) % STAFF_100.length]?.dept || dept);
      const mo = String(1 + ((ci + idx) % 11)).padStart(2, '0');
      const dy = String(1 + ((ci * 3 + idx * 5) % 27)).padStart(2, '0');
      const st = (idx % 6 === 0) ? 'In progress' : 'Completed';
      const rConf = ((ci === 60 || ci === 180 || ci === 300) && idx === 0) ? 72 : Math.max(84, c.conf || 88);
      REC.push({ id: sid, dept: staffDept, course: c.t, p: c.p, date: `2026-${mo}-${dy}`, h: hrsMap[c.dur] || 7, match: c.src === 'In-house' ? 'In-house' : (c.p === '—' ? 'None' : 'Catalog'), c: tag[0], pl: tag[0] ? (tag[1] || 1) : 0, conf: rConf, st });
    }
    recCountByCourse[k] = targetRecN;
  });

  const seedAssByKey = new Map();
  ASSESS.forEach(a => {
    const k = `${a.id}|${String(a.c || '').trim().toLowerCase()}|${a.req}`;
    if (!seedAssByKey.has(k)) seedAssByKey.set(k, a);
  });
  let assCritN = 0, assBelowIdx = 0, lowFwIdx = 0;
  FW.forEach((f, fi) => {
    const dept = deptFor(f.c, '');
    const ids = staffByDept[dept] || staffByDept.Enforcement;
    const activePls = [1, 2, 3, 4, 5].filter(n => f.pl && f.pl[n - 1]);
    const lowFw = f.c === 'Accessibility Standards — Compliance 10.15';
    const curLowFwIdx = lowFw ? lowFwIdx++ : 0;
    let lvlOff = 0;
    activePls.forEach((req, li) => {
      const perLvl = 4 + ((fi + req) % 3);
      const isStrongLowFwLvl = lowFw && activePls.length > 1 && ((li + curLowFwIdx) % 2 === 1);
      for (let k = 0; k < perLvl; k++) {
        const sid = ids[(fi * 3 + lvlOff + k) % ids.length];
        const key = `${sid}|${f.c.trim().toLowerCase()}|${req}`;
        if (seedAssByKey.has(key)) continue;
        const seq = fi + req + k;
        const rating = lowFw
          ? (isStrongLowFwLvl
            ? ((k === 0 && perLvl >= 5) ? 'Below' : (k === perLvl - 1) ? 'Exceeding' : 'Meeting')
            : ((k % 5 < 2) ? 'Below' : (k % 5 === 4) ? 'Exceeding' : 'Meeting'))
          : ((seq % 9 === 4) ? 'Below' : (seq % 9 >= 7) ? 'Exceeding' : 'Meeting');
        const yr = (seq % 8 === 0) ? 2025 : 2026;
        let gap = rating === 'Exceeding' ? 1 : 0;
        if (rating === 'Below') {
          assBelowIdx++;
          gap = (assCritN < 5 && assBelowIdx % 120 === 1) ? -2 : -1;
          if (gap === -2) assCritN++;
        }
        ASSESS.push({ y: yr, id: sid, dept, c: f.c, req, rating, gap, match: 'Exact' });
      }
      lvlOff += perLvl;
    });
  });
})();
[FW, ASSESS, CAT, REC].forEach((arr, ai) => arr.forEach((r, i) => r._id = ['fw', 'as', 'ca', 're'][ai] + i));

let REVIEW = [
  { id: 'RV-1041', type: 'Catalog tag', item: 'Managing Sousveillance in Enforcement · CSC', sug: 'Regulatory Operations Management & Delivery · PL2', why: 'Objectives cite sousveillance impact on enforcement ops; PL2 from “describe and apply”.', conf: 71, st: 'Open' },
  { id: 'RV-1042', type: 'Catalog tag', item: 'ISO 9001:2015 Internal Auditor · SGS Academy', sug: 'IFD Quality Management · PL3', why: 'Audit planning and reporting match PL3 required knowledge.', conf: 76, st: 'Open' },
  { id: 'RV-1043', type: 'Mapping', item: '10182340 · EIA Workshop · LTA', sug: 'Environmental Impact Assessment Workshop (LTA Academy)', why: 'Abbreviated title; provider partial match.', conf: 78, st: 'Open' },
  { id: 'RV-1044', type: 'Mapping', item: '10170662 · ISO 9001 Internal Auditor · SGS', sug: 'ISO 9001:2015 Internal Auditor (SGS Academy)', why: 'Title missing year; provider short form.', conf: 76, st: 'Open' },
  { id: 'RV-1045', type: 'Invalid record', item: '10170662 · Lunchtime talk: Quality culture', sug: 'Enter provider or reject', why: 'No provider; no catalog match.', conf: 0, st: 'Open' },
  { id: 'RV-1046', type: 'Assessment match', item: '10190027 · “Enforcement Field Ops”', sug: 'Regulatory Operations Management & Delivery', why: 'Similarity 0.64, below threshold.', conf: 64, st: 'Open' },
  { id: 'RV-1047', type: 'Catalog tag', item: 'Site Safety Briefing (SharePoint link)', sug: 'Manual entry needed', why: 'SharePoint link cannot be fetched.', conf: 0, st: 'Open' },
];

const JOBS = [
  {
    ref: 'JOB-2611-07', type: 'Learning records', file: 'workday_learning_2025Q3.csv', rows: 3412, ok: 3380, bad: 32, st: 'In Progress', when: '15 Nov 09:42', by: 'Nurul Hassan',
    chg: {
      added: [{ c: '3,380 learning records for 2025 Q3', n: 'Mapped where confidence ≥ threshold; 3 sent to My Tasks' }], changed: [], inactive: [],
      rejected: [{ row: 118, c: '10170662 · Lunchtime talk: Quality culture', r: 'Provider missing' }, { row: 402, c: '10193355 · (blank)', r: 'Course name missing' }, { row: 977, c: '10182340 · WSH Induction', r: 'Duration not a number ("4h")' }, { row: 1204, c: '10176231 · Core Enforcement Principles', r: 'Completion date in the future' }, { row: '…', c: '28 more rows', r: 'See rejected rows file' }]
    }
  },
  {
    ref: 'JOB-2611-06', type: 'Training catalog', file: 'functional_programmes_7May.xlsx', rows: 148, ok: 146, bad: 2, st: 'Pending', when: '14 Nov 16:10', by: 'Daniel Koh',
    chg: {
      added: [{ c: 'Managing Sousveillance in Enforcement', n: 'CSC · tag suggested, in My Tasks' }, { c: 'ISO 9001:2015 Internal Auditor', n: 'SGS Academy · tag suggested, in My Tasks' }, { c: 'Advanced Mediation Skills', n: 'Singapore Mediation Centre' }, { c: 'Risk Management for Construction Projects', n: 'BCA Academy' }, { c: 'MS Project Essentials', n: 'NTUC LearningHub' }, { c: 'Workplace Safety & Health Officer Course', n: 'NTUC LearningHub' }],
      changed: [{ c: 'Fundamentals Of Investigation', b: 'Duration 2 days', a: 'Duration 3 days' }, { c: 'Legal Rights & Powers for Enforcement Officers', b: 'Objective: 2 lines', a: 'Objective: 4 lines (new version)' }],
      inactive: [], rejected: [{ row: 57, c: 'Site Safety Briefing', r: 'URL is a SharePoint link; manual entry needed' }, { row: 131, c: '(blank title)', r: 'Programme title missing' }]
    }
  },
  {
    ref: 'JOB-2611-05', type: 'Competency assessment', file: 'assessment_2025.csv', rows: 1204, ok: 1203, bad: 1, st: 'Done', when: '12 Nov 11:05', by: 'Priya Nair',
    chg: { added: [{ c: '1,203 assessment rows for 2025', n: '1,190 matched exactly, 9 by cleaned name, 3 by similarity, 1 sent to My Tasks' }], changed: [], inactive: [{ c: 'Assessment run 2024', n: 'Superseded by 2025 run' }], rejected: [{ row: 644, c: '10190027 · (blank competency)', r: 'Competency name missing' }] }
  },
  {
    ref: 'JOB-2611-04', type: 'Competency framework', file: 'competency_bank_2026-05.xlsx', rows: 212, ok: 212, bad: 0, st: 'Done', when: '7 May 14:30', by: 'Nurul Hassan',
    chg: {
      added: [{ c: 'Incident Investigation & Reporting', n: 'LTA Rail & Road · Safety Health · PL1–PL3' }, { c: 'IFD Cost Estimation & Budget Control', n: 'IFD · Project Delivery · PL1–PL4' }, { c: 'Traffic Enforcement & Road Safety Operations', n: 'WOG Compliance & Enforcement · PL1–PL4' }],
      changed: [{ c: 'LTA Safety, Health & Environmental Management System and Processes', b: 'PL4: "Lead WSH audits"', a: 'PL4: "Lead WSH audits and set site EHS targets"' }, { c: 'IFD Quality Management', b: 'PL1–PL4', a: 'PL1–PL5 (PL5 added)' }, { c: 'Mediation & Dispute Resolution', b: 'PL3 required knowledge: 3 items', a: 'PL3 required knowledge: 5 items' }],
      inactive: [{ c: 'Workplace Safety & Health Risk Assessment', n: 'Not in file · last version 2025-11' }, { c: 'Noise & Vibration Control on Site', n: 'Not in file · last version 2025-11' }], rejected: []
    }
  },
  { ref: 'JOB-2611-03', type: 'Learning records', file: 'workday_learning_2025Q2.csv', rows: 2980, ok: 0, bad: 0, st: 'Failed - malware', when: '3 Nov 08:15', by: 'Daniel Koh' },
];

const USERS = [
  { n: 'Nurul Hassan', e: 'nurul_hassan@lta.gov.sg', r: 'HR Administrator', on: true, upd: '2026-11-15 09:40', last: '2026-11-16', rupd: '2026-01-06 10:00' },
  { n: 'Daniel Koh', e: 'daniel_koh@lta.gov.sg', r: 'HR User', on: true, upd: '2026-11-14 16:22', last: '2026-11-14', rupd: '2026-03-02 09:15' },
  { n: 'Priya Nair', e: 'priya_nair@lta.gov.sg', r: 'HR User', on: true, upd: '2026-11-10 11:05', last: '2026-11-10', rupd: '2026-11-11 10:01' },
  { n: 'Wei Ling Tan', e: 'tan_wei_ling@lta.gov.sg', r: 'HR Administrator', on: true, upd: '2026-09-08 14:12', last: '2026-09-08', rupd: '2026-02-18 14:40' },
  { n: 'Kumar Rajan', e: 'kumar_rajan@lta.gov.sg', r: 'HR Administrator', on: true, upd: '2026-08-10 17:02', last: '2026-08-10', rupd: '2026-04-22 11:30' },
  { n: 'Marcus Lim', e: 'marcus_lim@lta.gov.sg', r: 'HR User', on: false, upd: '2026-06-02 08:30', last: '2026-05-30', rupd: '2026-03-02 09:15' },
  { n: 'Siti Farhana', e: 'siti_farhana@lta.gov.sg', r: 'L&D Partner', on: true, upd: '2026-11-12 10:48', last: '2026-11-12', rupd: '2026-10-05 15:20' },
];
const JOURNEYS = [['Frameworks', 'Upload and browse competency frameworks'], ['Catalog', 'Upload and tag training courses'], ['Records', 'Upload and map learning records'], ['Assessments', 'Upload and browse competency assessments'], ['Dashboard', 'Tables, filters and export'], ['Users & roles', 'Invite users, assign roles'], ['Audit log', 'Search who changed what']];
const ROLES = [
  { n: 'HR Administrator', p: [1, 1, 1, 1, 1, 1, 1, 1], locked: true },
  { n: 'HR User', p: [0, 1, 1, 0, 1, 1, 0, 0] },
  { n: 'L&D Partner', p: [1, 1, 0, 1, 1, 0, 0, 0] },
];

const AUDIT = [
  { t: '15 Nov 09:42', u: 'Nurul Hassan', a: 'Upload', tg: 'JOB-2611-07 workday_learning_2025Q3.csv', d: '—' },
  { t: '15 Nov 09:38', u: 'Nurul Hassan', a: 'Sign-in', tg: 'Entra ID', d: '—' },
  { t: '14 Nov 16:22', u: 'Daniel Koh', a: 'Approve', tg: 'RV-1039 Catalog tag', d: 'Pending → Active' },
  { t: '14 Nov 16:18', u: 'Daniel Koh', a: 'Correct', tg: 'RV-1038 Mapping', d: 'PL3 → PL2' },
  { t: '14 Nov 16:10', u: 'Daniel Koh', a: 'Upload', tg: 'JOB-2611-06 functional_programmes_7May.xlsx', d: '—' },
  { t: '12 Nov 11:05', u: 'System', a: 'Supersede', tg: 'Assessment 2024', d: 'Current → Superseded' },
  { t: '11 Nov 10:01', u: 'Nurul Hassan', a: 'Role change', tg: 'Priya Nair', d: '— → HR User' },
  { t: '3 Nov 08:15', u: 'System', a: 'Reject', tg: 'JOB-2611-03', d: 'Malware scan failed' },
];
