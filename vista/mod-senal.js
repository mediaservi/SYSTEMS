// SYSTEMS · módulo SEÑAL Y CONECTIVIDAD: fuentes → selector, distribuidor o matriz → destinos, con el cable o extensor de cada tramo
// (reglas de conocimiento/systems-conectividad-reglas.md). Pregunta siempre si las salidas son iguales (espejo) o independientes.
// Solo con equipos de las listas del panel. GPL-3.0 · mediaservi.com
import { T, N, esc, textos, lee, guarda, togs, num, etq } from './util.js';
import { equipos, P } from './listas.js';
import { tramo, conmutador, RES } from './conectividad.js';
textos({
  'SEÑAL': ['SIGNAL', 'SENYAL'], 'Con USB': ['With USB', 'Amb USB'], '4K60': ['4K60', '4K60'], '8K': ['8K', '8K'], 'Señal y conectividad': ['Signal and connectivity', 'Senyal i connectivitat'],
  'Selector, distribuidor o matriz, y el cable o extensor de cada tramo según la distancia y la resolución.': ['Selector, splitter or matrix, and the cable or extender for each run according to distance and resolution.', 'Selector, distribuïdor o matriu, i el cable o extensor de cada tram segons la distància i la resolució.'],
  'Escríbela: «4 portátiles a 2 pantallas, distintas, 4K, a 30 m»': ['Type it: “4 laptops to 2 screens, different, 4K, 30 m away”', 'Escriu-la: «4 portàtils a 2 pantalles, diferents, 4K, a 30 m»'],
  'Fuentes': ['Sources', 'Fonts'], 'Destinos': ['Destinations', 'Destinacions'], 'Salidas': ['Outputs', 'Sortides'], 'Iguales (espejo)': ['The same (mirror)', 'Iguals (mirall)'], 'Independientes': ['Independent', 'Independents'],
  'Tipo de fuente': ['Source type', 'Tipus de font'], 'USB y KVM': ['USB and KVM', 'USB i KVM'], 'Sin USB': ['No USB', 'Sense USB'], 'Con USB (cámara y micro de la sala)': ['With USB (room camera and mic)', 'Amb USB (càmera i micro de la sala)'],
  'Distancias': ['Distances', 'Distàncies'], 'Fuente → equipo (m)': ['Source → unit (m)', 'Font → equip (m)'], 'Equipo → destino (m)': ['Unit → destination (m)', 'Equip → destinació (m)'],
  'Resolución': ['Resolution', 'Resolució'], 'Esquema de la señal': ['Signal diagram', 'Esquema del senyal'], 'Conmutador': ['Switcher', 'Commutador'],
  'Ida': ['In', 'Anada'], 'Vuelta': ['Out', 'Tornada'], 'Tramos': ['Runs', 'Trams'], 'Tramo': ['Run', 'Tram'], 'Cable o extensor': ['Cable or extender', 'Cable o extensor'],
  'Con más de {n} fuentes o destinos, o distancias de edificio: AV sobre IP (JUST ADD POWER), un emisor por fuente y un receptor por destino.': ['With more than {n} sources or destinations, or building-wide distances: AV over IP (JUST ADD POWER), one encoder per source and one decoder per destination.', 'Amb més de {n} fonts o destinacions, o distàncies d\'edifici: AV sobre IP (JUST ADD POWER), un emissor per font i un receptor per destinació.'],
  'Un selector no es una matriz: si cada destino ve una fuente distinta, hace falta matriz.': ['A selector is not a matrix: if each destination shows a different source, a matrix is needed.', 'Un selector no és una matriu: si cada destinació mostra una font diferent, cal matriu.'],
  'HDCP y EDID: si alguna fuente no se ve, fija el EDID del conmutador a la resolución del destino.': ['HDCP and EDID: if a source is not shown, set the switcher EDID to the destination resolution.', 'HDCP i EDID: si alguna font no es veu, fixa l\'EDID del commutador a la resolució de la destinació.'],
  'Directo, sin conmutador': ['Direct, no switcher', 'Directe, sense commutador'], 'fuentes': ['sources', 'fonts'], 'destinos': ['destinations', 'destinacions'],
  '¿Cuántas fuentes?': ['How many sources?', 'Quantes fonts?'], '¿Cuántos destinos?': ['How many destinations?', 'Quantes destinacions?'], 'Pantallas, proyectores o monitores': ['Screens, projectors or monitors', 'Pantalles, projectors o monitors'],
  '¿Cada destino ve lo mismo?': ['Does each destination show the same?', 'Cada destinació mostra el mateix?'], 'Sí: todos lo mismo': ['Yes: all the same', 'Sí: totes el mateix'], 'No: cada uno lo suyo': ['No: each its own', 'No: cadascuna la seva'],
  'Selector o distribuidor': ['Selector or splitter', 'Selector o distribuïdor'], 'Matriz': ['Matrix', 'Matriu'], '¿Qué resolución?': ['Which resolution?', 'Quina resolució?'],
  '¿A qué distancia están los destinos?': ['How far are the destinations?', 'A quina distància són les destinacions?'], '¿Hace falta USB?': ['Is USB needed?', 'Cal USB?'], 'Para la cámara y el micro de la sala en el portátil': ['For the room camera and mic on the laptop', 'Per a la càmera i el micro de la sala al portàtil'],
  'Portátiles o PC': ['Laptops or PCs', 'Portàtils o PC'], 'Metros': ['Metres', 'Metres'],
});
const DEF = { nf: 4, nd: 2, modo: 'independiente', tipo: 'HDMI', res: '4k', dF: 5, dD: 20, usb: false };
let S = Object.assign({}, DEF, lee('systems_senal') || {});
const NUMS = { nf: [1, 32], nd: [1, 32], dF: [1, 1000], dD: [1, 1000] };
const COLS = ['#c6e04a', '#00b4ff', '#a033ff', '#ffb000', '#4fdc62', '#ff4d5e'];

function calcula() {
  const av = [], r = { av, ida: [], vuelta: [] }, gb = RES[S.res].gbps;
  const NIP = P('senal.avoipDesde', 8); r.ip = S.nf > NIP || S.nd > NIP;   /* v2.4 · BRIAN */
  if (r.ip) { r.enc = equipos('avoip', 'JUST ADD POWER')[0] || null; av.push(['', T('Con más de {n} fuentes o destinos, o distancias de edificio: AV sobre IP (JUST ADD POWER), un emisor por fuente y un receptor por destino.', { n: NIP })]); }
  if (S.modo === 'espejo' && S.nf > 2 && S.nd > 1) { r.sel = conmutador(S.nf, 1, 'espejo', { gbps: gb, kvm: S.usb }); r.dist = conmutador(1, S.nd, 'espejo', { gbps: gb }); }
  else r.conm = conmutador(S.nf, S.nd, S.modo, { gbps: gb, kvm: S.usb, lejos: S.dD > P('senal.hdbtLejos', 15) });
  const c = r.conm || r.dist;
  if (!r.ip && !c && !r.sel && (S.nf > 1 || S.nd > 1)) r.error = T('Ninguna matriz de las listas llega a {a} × {b}: con tantas fuentes y destinos va AV sobre IP.', { a: S.nf, b: S.nd });
  for (let i = 0; i < S.nf; i++) r.ida.push(tramo(S.dF, S.res, { usb: S.usb, dp: S.tipo === 'DP' }));
  const hd = !!(c && c.hdbt && S.dD > P('senal.hdbtLejos', 15));
  for (let i = 0; i < S.nd; i++) r.vuelta.push(tramo(S.dD, S.res, { hdbtSale: hd }));
  if (S.modo === 'espejo' && S.nd > 1 && S.nf > 1) av.push(['info', T('Un selector no es una matriz: si cada destino ve una fuente distinta, hace falta matriz.')]);
  av.push(['info', T('HDCP y EDID: si alguna fuente no se ve, fija el EDID del conmutador a la resolución del destino.')]);
  [r.ida[0], r.vuelta[0]].filter((t) => t && t.nota).forEach((t) => av.push(['info', T(t.nota)]));
  r.sem = r.error ? 'R' : av.some((a) => !a[0]) ? 'A' : 'V';
  r.semTxt = r.error ? T('No hay solución con estos datos') : r.sem === 'A' ? T('Hay solución, con avisos') : T('Hay solución');
  const nom = r.sel ? r.sel.modelo + ' + ' + (r.dist ? r.dist.modelo : '') : c ? c.modelo : T('Directo, sin conmutador');
  r.lineaTxt = r.error || nom + ' · ' + S.nf + ' ' + T('fuentes') + ' → ' + S.nd + ' ' + T('destinos') + ' · ' + T(r.vuelta[0].txt);
  r.linea = r.error ? esc(r.error) : `<b>${esc(nom)}</b> · ${esc(S.nf + ' → ' + S.nd)} · ${esc(T(r.vuelta[0].txt))}`;
  guarda('systems_senal', S); return r;
}
function esquema(r, o = {}) {
  const mov = !!o.vertical, VW = mov ? 420 : 960, VH = mov ? 620 : 520, nf = Math.min(S.nf, 8), nd = Math.min(S.nd, 8), c = r.conm || r.dist;
  let s = '';
  const caja = (x, y, w, h, t, sub, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="var(--blk2)" stroke="${col || 'var(--linea)'}" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 - (sub ? 4 : -6)}" text-anchor="middle" font-size="${t.length > 14 ? 15 : 19}" font-weight="800" class="t">${esc(t)}</text>${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 18}" text-anchor="middle" font-size="12" class="t-mono t-ten">${esc(sub)}</text>` : ''}`;
  const raya = (t) => t.tipo === 'fibra' || t.tipo === 'fibra-c' ? 'stroke-dasharray="10 6"' : '';
  if (mov) {
    let y = 10; const cw = (VW - 40) / Math.min(nf, 4) - 8;
    for (let i = 0; i < nf; i++) { const x = 20 + (i % 4) * (cw + 8), yy = y + Math.floor(i / 4) * 54; s += `<rect x="${x}" y="${yy}" width="${cw}" height="46" rx="8" fill="var(--blk2)" stroke="${COLS[i % 6]}" stroke-width="2"/><text x="${x + cw / 2}" y="${yy + 29}" text-anchor="middle" font-size="14" class="t-mono">${esc(S.tipo)} ${i + 1}</text>`; }
    y += Math.ceil(nf / 4) * 54 + 6; s += `<path d="M${VW / 2} ${y} L ${VW / 2} ${y + 40}" stroke="var(--verde-txt)" stroke-width="4" ${raya(r.ida[0])}/><text x="${VW / 2 + 10}" y="${y + 26}" font-size="13" class="t-mono">${esc(T(r.ida[0].txt) + ' · ' + S.dF + ' m')}</text>`; y += 40;
    if (r.sel) { s += caja(60, y, VW - 120, 64, r.sel.modelo, T('Conmutador'), 'var(--verde-txt)'); y += 84; }
    s += caja(40, y, VW - 80, 80, c ? c.modelo : T('Directo, sin conmutador'), c ? c.descripcion.slice(0, 44) : '', 'var(--verde-txt)'); y += 80;
    s += `<path d="M${VW / 2} ${y} L ${VW / 2} ${y + 40}" stroke="var(--azul)" stroke-width="4" ${raya(r.vuelta[0])}/><text x="${VW / 2 + 10}" y="${y + 26}" font-size="13" class="t-mono">${esc(T(r.vuelta[0].txt) + ' · ' + S.dD + ' m')}</text>`; y += 46;
    const dw = (VW - 40) / Math.min(nd, 4) - 8;
    for (let i = 0; i < nd; i++) { const x = 20 + (i % 4) * (dw + 8), yy = y + Math.floor(i / 4) * 64; s += `<rect x="${x}" y="${yy}" width="${dw}" height="54" rx="4" fill="${COLS[i % 6]}" fill-opacity=".2" stroke="${COLS[i % 6]}" stroke-width="2"/><text x="${x + dw / 2}" y="${yy + 33}" text-anchor="middle" font-size="15" class="t-mono">${i + 1}</text>`; }
    y += Math.ceil(nd / 4) * 64 + 10;
    return `<svg viewBox="0 0 ${VW} ${y}" role="img" aria-label="${esc(T('Esquema de la señal'))}" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
  }
  const cy = VH / 2, hF = Math.min(60, (VH - 40) / nf - 10), hD = Math.min(70, (VH - 40) / nd - 10), cx = r.sel ? 470 : 380, cw = 200;
  const yF = [], yD = [];
  for (let i = 0; i < nf; i++) { const y = cy - nf * (hF + 10) / 2 + i * (hF + 10); yF.push(y + hF / 2); s += `<rect x="8" y="${y}" width="130" height="${hF}" rx="8" fill="var(--blk2)" stroke="${COLS[i % 6]}" stroke-width="2"/><text x="73" y="${y + hF / 2 + 6}" text-anchor="middle" font-size="16" class="t-mono">${esc(S.tipo)} ${i + 1}</text>`; }
  if (r.sel) { s += caja(250, cy - 50, 150, 100, r.sel.modelo, T('Conmutador'), 'var(--verde-txt)'); s += `<path d="M400 ${cy} L ${cx} ${cy}" stroke="var(--verde-txt)" stroke-width="4"/>`; }
  s += caja(cx, cy - 75, cw, 150, c ? c.modelo : T('Directo, sin conmutador'), c ? (c.clase === 'matriz' ? c.inp + ' × ' + c.out : c.inp + ':' + c.out) + (c.hdbt ? ' · HDBaseT' : '') + (c.kvm ? ' · KVM' : '') : '', c ? 'var(--verde-txt)' : 'var(--linea)');
  const x1 = r.sel ? 250 : cx;
  yF.forEach((y, i) => { s += `<path d="M138 ${y} C ${x1 - 60} ${y}, ${x1 - 60} ${cy}, ${x1} ${cy}" fill="none" stroke="${COLS[i % 6]}" stroke-width="3" ${raya(r.ida[0])}/>`; });
  s += `<text x="${(138 + x1) / 2}" y="${VH - 14}" text-anchor="middle" font-size="13" class="t-mono">${esc(T(r.ida[0].txt) + ' · ' + S.dF + ' m')}</text>`;
  const dx = 760;
  for (let i = 0; i < nd; i++) { const y = cy - nd * (hD + 10) / 2 + i * (hD + 10); yD.push(y + hD / 2); s += `<rect x="${dx}" y="${y}" width="${VW - dx - 10}" height="${hD}" rx="4" fill="${COLS[i % 6]}" fill-opacity=".2" stroke="${COLS[i % 6]}" stroke-width="2"/><text x="${dx + (VW - dx - 10) / 2}" y="${y + hD / 2 + 6}" text-anchor="middle" font-size="16" class="t-mono">${i + 1}</text>`; }
  yD.forEach((y) => { s += `<path d="M${cx + cw} ${cy} C ${cx + cw + 70} ${cy}, ${dx - 70} ${y}, ${dx} ${y}" fill="none" stroke="var(--azul)" stroke-width="3" ${raya(r.vuelta[0])}/>`; });
  s += `<text x="${(cx + cw + dx) / 2}" y="${VH - 14}" text-anchor="middle" font-size="13" class="t-mono">${esc(T(r.vuelta[0].txt) + ' · ' + S.dD + ' m')}</text>`;
  if (S.nf > 8 || S.nd > 8) s += `<text x="${VW / 2}" y="22" text-anchor="middle" font-size="14" class="t-mono t-ten">${esc(S.nf + ' → ' + S.nd)}</text>`;
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(T('Esquema de la señal'))}" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
}
const eq = (x, n, tit, rec) => x ? `<div class="equipo${rec ? ' rec' : ''}"><div class="eq-cab"><b>${esc(x.modelo)}</b><span class="serie">${esc(x.marca)}${tit ? ' · ' + esc(T(tit)) : ''}</span>${rec ? `<span class="etq">${T('Recomendado').toUpperCase()}</span>` : ''}</div><table class="despiece"><tr><td>${n}×</td><td class="ref">${esc(x.id)}</td><td class="des">${esc(x.descripcion || '')}</td></tr></table></div>` : '';
function tabla(r) {
  const fila = (L, nom, d) => { const g = {}; L.forEach((t) => { const k = t.txt; g[k] = g[k] || { t, n: 0 }; g[k].n++; }); return Object.values(g).map((x) => `<tr><td>${esc(T(nom))}</td><td class="m">${x.n} × ${d} m</td><td>${esc(T(x.t.txt))}</td><td class="m">${x.t.eq && x.t.eq.prioritario ? '⭐ ' : ''}${esc([x.t.eq && x.t.eq.id, x.t.eq2 && x.t.eq2.id, x.t.cat ? 'MC1000' : ''].filter(Boolean).join(' + '))}</td></tr>`).join(''); };
  return `<p class="alt-t">${esc(T('Tramos'))}</p><table class="tabla-v"><tr><th></th><th>${esc(T('Tramo'))}</th><th>${esc(T('Cable o extensor'))}</th><th></th></tr>${fila(r.ida, 'Ida', S.dF)}${fila(r.vuelta, 'Vuelta', S.dD)}</table>`;
}
function resultado(r) {
  let h = `<div class="veredicto ${r.error ? 'mal' : r.sem === 'A' ? 'aviso' : ''}"><b>${esc(r.semTxt)}</b><p>${esc(r.lineaTxt)}</p></div>`;
  h += eq(r.sel, 1, 'Conmutador', true) + eq(r.conm || r.dist, 1, 'Conmutador', !r.sel) + tabla(r);
  if (r.av.length) h += `<ul class="avisos">${r.av.map((a) => `<li class="${a[0]}">${esc(a[1])}</li>`).join('')}</ul>`;
  return h;
}
const cifras = (r) => { const c = r.conm || r.dist; return [
  { t: 'Fuentes', v: String(S.nf), u: '× ' + S.tipo, s: S.dF + ' m', ic: 'media', c: 'var(--violeta)' },
  { t: 'Destinos', v: String(S.nd), s: T(S.modo === 'espejo' ? 'Iguales (espejo)' : 'Independientes'), ic: 'tele', c: 'var(--azul)' },
  { t: 'Conmutador', v: c ? c.modelo : '—', s: c ? c.descripcion.split(' ').slice(0, 4).join(' ') : '', ic: 'chip', c: 'var(--verde-txt)' },
  { t: 'Resolución', v: RES[S.res].nom, s: RES[S.res].gbps + ' Gbps', ic: 'calidad', c: 'var(--ambar)' },
  { t: 'Tramos', v: String(S.nf + S.nd), s: T(r.vuelta[0].txt), ic: 'dist', c: 'var(--magenta, #e24bf0)' }]; };
function datos() {
  return [{ tit: 'Fuentes', ic: 'media', ac: 'var(--violeta)', html: num('nf', 'Fuentes', S.nf, '', 1, 1, 32) + etq('Tipo de fuente') + togs('tipo', [['HDMI', 'HDMI'], ['USB-C', 'USB-C'], ['DP', 'DP']], S.tipo) + etq('USB y KVM') + togs('usb', [[false, 'Sin USB'], [true, 'Con USB']], S.usb, 'dos') },
    { tit: 'Destinos', ic: 'tele', ac: 'var(--azul)', html: num('nd', 'Destinos', S.nd, '', 1, 1, 32) + etq('Salidas') + togs('modo', [['espejo', 'Iguales (espejo)'], ['independiente', 'Independientes']], S.modo, 'uno') },
    { tit: 'Resolución', ic: 'calidad', ac: 'var(--verde-txt)', html: togs('res', [['1080', '1080p'], ['4k', '4K60'], ['8k', '8K']], S.res) },
    { tit: 'Distancias', ic: 'dist', ac: 'var(--ambar)', html: num('dF', 'Fuente → equipo (m)', S.dF, 'm', 1, 1, 1000) + num('dD', 'Equipo → destino (m)', S.dD, 'm', 1, 1, 1000) + `<div class="pie-b"><button type="button" data-acc="reset">${esc(T('RESTABLECER'))}</button></div>` }];
}
const filas = () => [['nf', 'media', 'Fuentes', S.nf + ' × ' + S.tipo], ['nd', 'tele', 'Destinos', String(S.nd)], ['modo', 'sim', 'Salidas', T(S.modo === 'espejo' ? 'Iguales (espejo)' : 'Independientes')], ['res', 'calidad', 'Resolución', RES[S.res].nom], ['dD', 'dist', 'Equipo → destino (m)', S.dD + ' m'], ['usb', 'chispa', 'USB y KVM', T(S.usb ? 'Con USB (cámara y micro de la sala)' : 'Sin USB')]];
const pasos = () => ['nf', 'nd', 'modo', 'res', 'dD', 'usb'];
function pregunta(k) {
  const v = (x) => (y) => { S[x] = y; };
  switch (k) {
    case 'nf': return { q: '¿Cuántas fuentes?', ay: 'Portátiles o PC', val: S.nf, ops: [1, 2, 3, 4, 6, 8].map((n) => [n, String(n), '', 'media']), aplica: v('nf') };
    case 'nd': return { q: '¿Cuántos destinos?', ay: 'Pantallas, proyectores o monitores', val: S.nd, ops: [1, 2, 3, 4, 6, 8].map((n) => [n, String(n), '', 'tele']), aplica: v('nd') };
    case 'modo': return { q: '¿Cada destino ve lo mismo?', val: S.modo, ops: [['espejo', 'Sí: todos lo mismo', 'Selector o distribuidor', 'tele'], ['independiente', 'No: cada uno lo suyo', 'Matriz', 'sim']], aplica: v('modo') };
    case 'res': return { q: '¿Qué resolución?', val: S.res, ops: [['1080', '1080p', '', 'calidad'], ['4k', '4K60 · 18 Gbps', '', 'calidad'], ['8k', '8K · 48 Gbps', '', 'calidad']], aplica: v('res') };
    case 'dD': return { q: '¿A qué distancia están los destinos?', nums: [['dD', 'Metros', S.dD, 1, 1000, 'm']], aplica: (o) => { S.dD = Math.round(o.dD); } };
    case 'usb': return { q: '¿Hace falta USB?', ay: 'Para la cámara y el micro de la sala en el portátil', val: String(S.usb), ops: [['false', 'Sin USB', '', 'x'], ['true', 'Con USB (cámara y micro de la sala)', '', 'chispa']], aplica: (y) => { S.usb = y === 'true'; } };
  }
  return null;
}
function pon(k, v) { if (NUMS[k]) { const [a, b] = NUMS[k]; S[k] = Math.max(a, Math.min(b, Math.round(+v || a))); } else if (typeof DEF[k] === 'boolean') S[k] = v === true || v === 'true'; else S[k] = v; }
function pide(t) {
  const s = t.toLowerCase(); let ok = false, m;
  if ((m = s.match(/(\d+)\s*(portátiles|portatiles|fuentes|pc|laptops|sources|ordenadores)/))) { S.nf = Math.min(32, +m[1]); ok = true; }
  if ((m = s.match(/(\d+)\s*(pantallas|destinos|monitores|proyectores|tv|screens|displays)/))) { S.nd = Math.min(32, +m[1]); ok = true; }
  if (/distint|independ|different|matriz|matrix/.test(s)) { S.modo = 'independiente'; ok = true; } else if (/espejo|mirror|mism|iguales|same/.test(s)) { S.modo = 'espejo'; ok = true; }
  if (/8k/.test(s)) S.res = '8k'; else if (/4k/.test(s)) S.res = '4k'; else if (/1080|full ?hd/.test(s)) S.res = '1080';
  if ((m = s.match(/(\d+)\s*m\b/))) { S.dD = Math.min(1000, +m[1]); ok = true; }
  if (/usb|kvm|cámara|camara/.test(s)) S.usb = true;
  if (/usb-?c/.test(s)) S.tipo = 'USB-C'; else if (/displayport|\bdp\b/.test(s)) S.tipo = 'DP'; else if (/hdmi/.test(s)) S.tipo = 'HDMI';
  return ok;
}
export default {
  id: 'senal', nom: 'Señal y conectividad', corto: 'SEÑAL', ic: 'senal', ejemplo: 'Escríbela: «4 portátiles a 2 pantallas, distintas, 4K, a 30 m»',
  info: 'Selector, distribuidor o matriz, y el cable o extensor de cada tramo según la distancia y la resolución.',
  calcula, filas, pasos, pregunta, datos, resultado, cifras, pide,
  reconoce: (t) => /matriz|matrix|selector|distribuidor|splitter|hdbaset|extensor|portátil|portatil|usb-c/i.test(t),
  esquema: (r, o) => ({ tit: 'Esquema de la señal', ic: 'sim', html: esquema(r, o) }),
  set: pon, num: pon, pm: (k, d) => pon(k, +S[k] + d * (k === 'dF' || k === 'dD' ? 5 : 1)),
  accion: (a) => { if (a === 'reset') S = Object.assign({}, DEF); }, reset: () => { S = Object.assign({}, DEF); },
};
