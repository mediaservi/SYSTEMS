// SYSTEMS · módulo AUDIO: los 26 calculadores de SYSTEMS (calculos.js: acústica, arrays, electrónica de audio, cableado, iluminación y vídeo,
// electricidad, música, medidas y referencia) dentro de la misma consola. Las gráficas son las de la versión clásica.
// Licencia GPL-3.0 · mediaservi.com
import { CALC, GRUPOS } from '../calculos.js';
import { idioma } from '../textos.js';
import { T, esc, textos, lee, guarda, togs, num, etq } from './util.js';
textos({
  'AUDIO': ['AUDIO', 'ÀUDIO'], 'Audio y escenario': ['Audio and stage', 'Àudio i escenari'],
  'Los calculadores de sonido, cableado, electricidad, iluminación y música: SPL, arrays, subgraves, cable de altavoz, kVA, DMX…': ['The sound, cabling, electricity, lighting and music calculators: SPL, arrays, subwoofers, speaker cable, kVA, DMX…', 'Els calculadors de so, cablejat, electricitat, il·luminació i música: SPL, arrays, subgreus, cable d\'altaveu, kVA, DMX…'],
  'Escríbela: «SPL a 20 m con 98 dB y 1000 W»': ['Type it: “SPL at 20 m with 98 dB and 1000 W”', 'Escriu-la: «SPL a 20 m amb 98 dB i 1000 W»'],
  'Calculadores': ['Calculators', 'Calculadors'], 'Datos': ['Data', 'Dades'], 'Calculador': ['Calculator', 'Calculador'], 'Grupo': ['Group', 'Grup'],
  'Resumen': ['Summary', 'Resum'], 'Tabla': ['Table', 'Taula'], 'Notas': ['Notes', 'Notes'], 'Curva': ['Curve', 'Corba'], 'Polar': ['Polar', 'Polar'], 'Mapa': ['Map', 'Mapa'], 'Planta': ['Plan', 'Planta'], 'Conector': ['Connector', 'Connector'], 'Color': ['Colour', 'Color'], 'Gráfica': ['Chart', 'Gràfica'],
  '¿De qué tema?': ['Which topic?', 'De quin tema?'], '¿Qué quieres calcular?': ['What do you want to work out?', 'Què vols calcular?'], 'Sin más cifras': ['No more figures', 'Sense més xifres'], 'Sin datos que introducir': ['No data to enter', 'Sense dades per introduir'],
});
const F = (x, d = 2) => { if (typeof x !== 'number' || !isFinite(x)) return '—'; const en = idioma() === 'en'; return Number(x).toLocaleString(en ? 'en-GB' : 'es-ES', { maximumFractionDigits: d, useGrouping: !en }).replace(/^-(?=0(?:[.,]0+)?$)/, '').replace('-', '−'); };
/* ---------- gráficas (las de la versión clásica, sin cambios) ---------- */
function grafLinea(g) {
  const NAR = typeof matchMedia === 'function' && matchMedia('(max-width: 600px)').matches, W = NAR ? 400 : 600, H = 250, ml = 46, mr = 12, mt = 24, mb = 28,   /* v0.20 · en el móvil el dibujo es más estrecho, así la letra no baja de unos 10 px, y el rótulo del eje va encima de la gráfica */ xs = g.xs, x0 = xs[0], x1 = xs[xs.length - 1];
  const todos = g.series.flatMap(s => s.ys).filter(isFinite); let y0 = g.ymin != null ? g.ymin : Math.min(...todos), y1 = g.ymax != null ? g.ymax : Math.max(...todos);
  const paso = [0.5, 1, 2, 3, 5, 6, 10, 12, 20, 50].find(p => (y1 - y0) / p <= 7) || 100; y0 = Math.floor(y0 / paso) * paso; y1 = Math.ceil(y1 / paso) * paso; if (y1 === y0) y1 = y0 + paso;
  const X = (x) => ml + (g.log ? Math.log(x / x0) / Math.log(x1 / x0) : (x - x0) / (x1 - x0)) * (W - ml - mr), Y = (y) => mt + (1 - (Math.min(y1, Math.max(y0, y)) - y0) / (y1 - y0)) * (H - mt - mb);
  let h = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(T(g.tit))}">`;
  for (let y = y0; y <= y1 + 1e-9; y += paso) h += `<line x1="${ml}" x2="${W - mr}" y1="${Y(y)}" y2="${Y(y)}" stroke="rgba(255,255,255,.08)"/><text x="${ml - 6}" y="${Y(y) + 4}" font-size="11" text-anchor="end" style="fill:var(--txt)">${F(y, 1)}</text>`;
  const marcas = []; if (g.log) { for (let d = Math.pow(10, Math.floor(Math.log10(x0))); d <= x1; d *= 10) [1, 2, 5].forEach(m => { if (d * m >= x0 * 0.999 && d * m <= x1 * 1.001) marcas.push(d * m); }); } else for (let i = 0; i <= 5; i++) marcas.push(x0 + (x1 - x0) * i / 5);
  marcas.forEach(x => { h += `<line x1="${X(x)}" x2="${X(x)}" y1="${mt}" y2="${H - mb}" stroke="rgba(255,255,255,.08)"/><text x="${X(x)}" y="${H - mb + 15}" font-size="11" text-anchor="middle" style="fill:var(--txt)">${x >= 1000 ? F(x / 1000, 1) + 'k' : F(x, 1)}</text>`; });
  if (g.marca && g.marca >= x0 && g.marca <= x1) h += `<line x1="${X(g.marca)}" x2="${X(g.marca)}" y1="${mt}" y2="${H - mb}" stroke="#9900ff" stroke-width="1.5" stroke-dasharray="4 4"/>`;
  g.series.forEach(s => { h += `<polyline fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" points="${s.ys.map((y, i) => X(xs[i]).toFixed(1) + ',' + Y(y).toFixed(1)).join(' ')}"/>`; });
  h += `<text x="${W - mr}" y="${H - 4}" font-size="11" text-anchor="end" style="fill:var(--txt)">${esc(g.xlab || '')}</text><text x="6" y="${mt - 9}" font-size="11" style="fill:var(--txt)">${esc(g.ylab || '')}</text></svg>`;
  if (g.series.length > 1) h += `<div class="ley">${g.series.map(s => `<span><i style="background:${s.color}"></i>${esc(T(s.nom))}</span>`).join('')}</div>`;
  return h;
}
function grafPolar(g) {
  const S = 320, c = S / 2, R = 126, min = g.min || -30;
  let h = `<svg viewBox="0 0 ${S} ${S}" role="img" aria-label="${esc(T(g.tit))}">`;
  for (let d = 0; d >= min; d -= 6) { const r = R * (d - min) / -min; if (r > 0) h += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="rgba(255,255,255,${d === 0 ? .28 : .09})"/>` + (d < 0 && d > min ? `<text x="${c + 3}" y="${c - r + 11}" font-size="9" style="fill:var(--txt)">${d}</text>` : ''); }
  for (let a = 0; a < 360; a += 30) { const s = Math.sin(a * Math.PI / 180), k = Math.cos(a * Math.PI / 180); h += `<line x1="${c}" y1="${c}" x2="${c + R * s}" y2="${c - R * k}" stroke="rgba(255,255,255,.08)"/><text x="${c + (R + 15) * s}" y="${c - (R + 15) * k + 4}" font-size="10" text-anchor="middle" style="fill:var(--txt)">${a > 180 ? a - 360 : a}°</text>`; }
  g.series.forEach(s => { const p = s.pts.map((d, a) => { const r = R * Math.max(0, (Math.min(0, d) - min) / -min), t = a * Math.PI / 180; return (c + r * Math.sin(t)).toFixed(1) + ',' + (c - r * Math.cos(t)).toFixed(1); }); h += `<polygon points="${p.join(' ')}" fill="${s.color}22" stroke="${s.color}" stroke-width="2" stroke-linejoin="round"/>`; });
  return h + `<text x="${c}" y="${S - 4}" font-size="10" text-anchor="middle" style="fill:var(--txt)">dB · 0° = ${esc(T('delante'))}</text></svg>`;
}
function grafPlanta(g) {
  const W = 600, k = Math.min((W - 20) / g.L, 300 / g.W), w = g.L * k, hh = g.W * k, H = hh + 20, ox = (W - w) / 2, oy = 10;
  let h = `<svg viewBox="0 0 ${W} ${H.toFixed(0)}" role="img" aria-label="${esc(T(g.tit))}"><rect x="${ox}" y="${oy}" width="${w}" height="${hh}" fill="#17171a" stroke="#74747b" stroke-width="1.5"/><clipPath id="hw-sala"><rect x="${ox}" y="${oy}" width="${w}" height="${hh}"/></clipPath><g clip-path="url(#hw-sala)">`;
  if (g.nx * g.ny <= 600) for (let i = 0; i < g.nx; i++) for (let j = 0; j < g.ny; j++) { const x = ox + (i + .5) * w / g.nx, y = oy + (j + .5) * hh / g.ny; h += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(g.r * k).toFixed(1)}" fill="rgba(0,255,4,.10)" stroke="rgba(0,255,4,.45)"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#00ff04"/>`; }
  return h + `</g><text x="${W / 2}" y="${H - 1}" font-size="11" text-anchor="middle" style="fill:var(--txt)">${F(g.L, 1)} × ${F(g.W, 1)} m</text></svg>`;
}
function grafDip(g) {
  let h = `<svg viewBox="0 0 400 110" role="img" aria-label="${esc(T(g.tit))}"><rect x="8" y="8" width="384" height="94" rx="8" fill="#1b2a6b" stroke="#000"/><text x="20" y="26" font-size="11" style="fill:#fff">ON</text>`;
  g.bits.forEach((b, i) => { const x = 28 + i * 40; h += `<rect x="${x}" y="32" width="24" height="44" rx="3" fill="#0c1233" stroke="#000"/><rect x="${x + 3}" y="${b ? 35 : 55}" width="18" height="18" rx="2" fill="${b ? '#00ff04' : '#e8e8ec'}"/><text x="${x + 12}" y="92" font-size="11" text-anchor="middle" style="fill:#fff">${1 << i}</text>`; });
  return h + `</svg>`;
}
function grafConector(g) {
  if (['trs', 'ts', 'mini'].includes(g.con)) { const n = g.con === 'ts' ? 2 : 3, et = n === 3 ? ['Punta', 'Anillo', 'Cuerpo'] : ['Punta', 'Cuerpo'];
    let h = `<svg viewBox="0 0 600 150" role="img" aria-label="${esc(T(g.tit))}"><rect x="330" y="35" width="250" height="70" rx="10" fill="#2d2d31" stroke="#000"/><rect x="${n === 3 ? 150 : 110}" y="52" width="${n === 3 ? 180 : 220}" height="36" fill="#c9c9ce" stroke="#000"/>`;
    if (n === 3) h += `<rect x="96" y="52" width="46" height="36" fill="#c9c9ce" stroke="#000"/><rect x="142" y="52" width="8" height="36" fill="#111"/>`;
    h += `<path d="M${n === 3 ? 88 : 102} 52h-44l-22 10v16l22 10h44z" fill="#c9c9ce" stroke="#000"/><rect x="${n === 3 ? 88 : 102}" y="52" width="8" height="36" fill="#111"/>`;
    const xs = n === 3 ? [50, 119, 240] : [56, 220]; et.forEach((e, i) => { h += `<line x1="${xs[i]}" y1="92" x2="${xs[i]}" y2="118" stroke="#00ff04"/><text x="${xs[i]}" y="134" font-size="13" text-anchor="middle" style="fill:#f2f2f3">${esc(T(e))}</text>`; });
    return h + `</svg>`; }
  if (g.con === 'rj45') { const col = ['#ff9a2e', '#ff9a2e', '#2fd23a', '#2a7cff', '#2a7cff', '#2fd23a', '#9a6a3c', '#9a6a3c'];
    let h = `<svg viewBox="0 0 600 150" role="img" aria-label="${esc(T(g.tit))}"><rect x="130" y="14" width="340" height="104" rx="8" fill="#2d2d31" stroke="#000"/>`;
    col.forEach((c, i) => { const x = 150 + i * 38, raya = i % 2 === 0; h += `<rect x="${x}" y="28" width="26" height="62" rx="3" fill="${raya ? '#f2f2f3' : c}" stroke="#000"/>${raya ? `<rect x="${x + 9}" y="28" width="8" height="62" fill="${c}"/>` : ''}<text x="${x + 13}" y="108" font-size="12" text-anchor="middle" style="fill:#f2f2f3">${i + 1}</text>`; });
    return h + `<text x="300" y="140" font-size="11.5" text-anchor="middle" style="fill:var(--txt)">${esc(T('Pestaña hacia abajo y contactos hacia ti: el 1, a la izquierda'))}</text></svg>`; }
  return '';
}
// mapa de cobertura: suma coherente de las fuentes con caída 1/r; 0 dB = las fuentes en fase a 10 m
const PALETA = [[11, 16, 48], [18, 68, 196], [0, 180, 255], [0, 255, 4], [255, 225, 0], [255, 77, 94]];
function pintarMapa(cv, g) {
  const n = 110, ctx = cv.getContext('2d'), img = ctx.createImageData(n, n), k = 2 * Math.PI * g.f / g.c, w = 2 * Math.PI * g.f, ref = g.fuentes.length / 10, cx = g.fuentes.reduce((a, q) => a + q.x, 0) / g.fuentes.length, cy = g.fuentes.reduce((a, q) => a + q.y, 0) / g.fuentes.length;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const x = cx + (i + .5 - n / 2) * g.lado / n, y = cy - (j + .5 - n / 2) * g.lado / n; let re = 0, im = 0;
    for (const q of g.fuentes) { const r = Math.max(0.5, Math.hypot(x - q.x, y - q.y)), ph = -k * r - w * q.tau; re += q.pol * Math.cos(ph) / r; im += q.pol * Math.sin(ph) / r; }
    const d = 20 * Math.log10(Math.max(1e-9, Math.hypot(re, im) / ref)), t = Math.min(1, Math.max(0, (d + 30) / 36)) * (PALETA.length - 1), a = Math.floor(Math.min(PALETA.length - 2, t)), fr = t - a, o = (j * n + i) * 4;
    for (let c = 0; c < 3; c++) img.data[o + c] = PALETA[a][c] + (PALETA[a + 1][c] - PALETA[a][c]) * fr; img.data[o + 3] = 255; }
  const tmp = document.createElement('canvas'); tmp.width = tmp.height = n; tmp.getContext('2d').putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true; ctx.drawImage(tmp, 0, 0, cv.width, cv.height);
  const s = cv.width / g.lado; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; g.fuentes.forEach(q => { ctx.beginPath(); ctx.arc(cv.width / 2 + (q.x - cx) * s, cv.height / 2 - (q.y - cy) * s, 4, 0, 7); ctx.fill(); ctx.stroke(); });
  ctx.font = '700 15px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4; ctx.fillText('▲ ' + T('público'), cv.width / 2, 22); ctx.shadowBlur = 0;
}
/* ---------- estado (el mismo de la versión clásica: se comparte) ---------- */
let E = { sel: 'spl', vals: {}, vis: {} };
try { const g = lee('systems_estado'); if (g && g.vals && CALC.some((c) => c.id === g.sel)) E = Object.assign({ vis: {} }, g); } catch (e) {}
const porId = (id) => CALC.find((c) => c.id === id) || CALC[0];
const valores = (c) => { const g = E.vals[c.id] || (E.vals[c.id] = {}); c.campos.forEach((f) => { if (g[f.k] === undefined || (f.ops ? !f.ops.some((o) => o[0] === g[f.k]) : typeof g[f.k] !== 'number')) g[f.k] = f.def; }); return g; };
const visibles = (c, v) => c.campos.filter((f) => !f.si || f.si(v));
const grupoDe = (c) => GRUPOS.find((g) => g[0] === c.g) || GRUPOS[0];
const fmtV = (f, v) => f.ops ? T((f.ops.find((o) => o[0] === v[f.k]) || ['', ''])[1]) : F(v[f.k], 3) + (f.uni ? ' ' + f.uni : '');

function vistasDe(r) {
  const CORTO = { polar: 'Polar', mapa: 'Mapa', linea: 'Curva', planta: 'Planta', dip: 'DIP', color: 'Color', conector: 'Conector' };
  const L = (r.grafs || []).map((g, i) => ({ k: 'g' + i, nom: T(g.tit), corto: T(CORTO[g.tipo] || 'Gráfica'), g, i })).filter((x) => x.g.tipo !== 'conector' || grafConector(x.g));
  if (r.tabla) L.push({ k: 'tabla', nom: T('Tabla'), corto: T('Tabla') });
  L.push({ k: 'notas', nom: T('Notas'), corto: T('Notas') }); L.push({ k: 'resumen', nom: T('Resumen'), corto: T('Resumen') });
  return L;
}
function vistaHTML(x, r) {
  if (!x) return '';
  if (x.k === 'tabla') return `<div class="vis texto"><table class="tabla"><thead><tr>${r.tabla.cab.map((h) => `<th>${esc(T(h))}</th>`).join('')}</tr></thead><tbody>${r.tabla.filas.map((f) => `<tr>${f.map((c) => `<td>${esc(T(String(c)))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if (x.k === 'resumen') return `<div class="vis texto"><div class="resumen">${(r.res || []).map((q) => `<div><div class="t">${esc(T(q[0]))}</div><div class="v">${esc(T(String(q[1])))}<small>${esc(T(q[2] || ''))}</small></div>${q[3] ? `<div class="s">${esc(T(q[3]))}</div>` : ''}</div>`).join('') || `<p class="ayuda">${T('Sin más cifras')}</p>`}</div></div>`;
  if (x.k === 'notas') return `<div class="vis texto notas">${(r.notas || []).map((n) => `<p>${esc(T(n))}</p>`).join('')}</div>`;
  const g = x.g, cab = `<h3>${esc(T(g.tit))}${g.sub ? `<small>${esc(T(g.sub))}</small>` : ''}</h3>`;
  const cu = { linea: grafLinea, polar: grafPolar, planta: grafPlanta, dip: grafDip, conector: grafConector }[g.tipo];
  if (cu) return `<div class="vis">${cab}${cu(g)}</div>`;
  if (g.tipo === 'mapa') return `<div class="vis">${cab}<canvas width="440" height="440" data-mapa="${x.i}" role="img" aria-label="${esc(T(g.tit))}"></canvas><div class="escala"><span>−30 dB</span><span class="b"></span><span>+6 dB</span></div></div>`;
  if (g.tipo === 'color') return `<div class="vis">${cab}<div class="muestra" style="background:${g.hex}"></div></div>`;
  return '';
}
const vista = (r) => { const L = vistasDe(r), c = porId(E.sel); return L.find((x) => x.k === (E.vis[c.id] || [])[0]) || L[0]; };

function calcula() {
  const c = porId(E.sel), v = valores(c); let r;
  try { r = c.calc(v, F) || {}; } catch (e) { console.error(e); r = { res: [], notas: [] }; }
  r.c = c; r.sem = 'V'; r.semTxt = T(c.nom);
  const q = (r.res || [])[0]; r.lineaTxt = T(c.nom) + (q ? ' · ' + T(q[0]) + ': ' + T(String(q[1])) + ' ' + T(q[2] || '') : '');
  r.linea = `<b>${esc(T(c.nom))}</b>${q ? ` · ${esc(T(q[0]))}: <b>${esc(T(String(q[1])))}</b> ${esc(T(q[2] || ''))}` : ''}`;
  guarda('systems_estado', E); return r;
}
function esquema(r) {
  const L = vistasDe(r), va = vista(r);
  const extra = L.length > 1 ? `<span class="vistas" role="group">${L.map((x) => `<button type="button" data-acc="v:${x.k}" aria-pressed="${x.k === va.k}">${esc(x.corto)}</button>`).join('')}</span>` : '';
  return { tit: va.g ? va.nom : T(r.c.nom), ic: 'grafica', html: vistaHTML(va, r), extra };
}
function resultado(r) {
  const L = vistasDe(r).filter((x) => x.k === 'resumen' || x.k === 'notas' || x.k === 'tabla').reverse();
  return L.map((x) => vistaHTML(x, r).replace('class="vis texto', 'class="vis texto vis-r')).join('');
}
const cifras = (r) => (r.res || []).slice(0, 6).map((q, i) => ({ t: q[0], v: T(String(q[1])), u: T(q[2] || ''), s: q[3] ? T(q[3]) : (i === 5 && r.res.length > 6 ? r.res.slice(6).map((z) => T(z[0]) + ' ' + T(String(z[1])) + ' ' + T(z[2] || '')).join(' · ') : ''), ic: 'grafica' }));
function campoHTML(f, v) {
  if (f.ops) { if (f.sel || f.ops.length > 4) return etq(f.lab) + `<select class="sel" data-sel="op:${f.k}" aria-label="${esc(T(f.lab))}">${f.ops.map((o, i) => `<option value="${i}"${o[0] === v[f.k] ? ' selected' : ''}>${esc(T(o[1]))}</option>`).join('')}</select>`;
    return etq(f.lab) + togs('op:' + f.k, f.ops.map((o, i) => [i, o[1]]), f.ops.findIndex((o) => o[0] === v[f.k]), f.ops.length === 2 ? 'dos' : ''); }
  return etq(f.lab) + num(f.k, '', v[f.k], f.uni || '', f.paso, f.min, f.max).replace('<label for="n-' + f.k + '"></label>', '');
}
function datos(r) {
  const c = porId(E.sel), v = valores(c), lista = CALC.filter((x) => x.g === c.g), campos = visibles(c, v);
  return [{ tit: 'Calculadores', ic: 'lista', ac: 'var(--verde-txt)', html: `<select class="sel" data-sel="grupo" aria-label="${esc(T('Grupo'))}">${GRUPOS.map((g) => `<option value="${g[0]}"${g[0] === c.g ? ' selected' : ''}>${esc(T(g[1]))}</option>`).join('')}</select><div class="lista-c">${lista.map((x) => `<button type="button" class="tog" aria-pressed="${x.id === c.id}" data-acc="c:${x.id}"><i></i><span>${esc(T(x.nom))}</span></button>`).join('')}</div>` },
    { tit: 'Datos', ic: 'regla', ac: 'var(--azul)', html: (campos.length ? campos.map((f) => campoHTML(f, v)).join('') : `<p class="ayuda">${T('Sin datos que introducir')}</p>`) + `<div class="pie-b"><button type="button" data-acc="reset">${esc(T('RESTABLECER'))}</button></div>` }];
}
function filas(r) { const c = porId(E.sel), v = valores(c); return [['grupo', 'lista', 'Grupo', T(grupoDe(c)[1])], ['calc', 'res', 'Calculador', T(c.nom)]].concat(visibles(c, v).slice(0, 5).map((f) => ['f:' + f.k, f.ops ? 'lista' : 'regla', f.lab, fmtV(f, v)])); }
const pasos = () => { const c = porId(E.sel); return ['grupo', 'calc'].concat(visibles(c, valores(c)).slice(0, 4).map((f) => 'f:' + f.k)); };
function pregunta(k) {
  const c = porId(E.sel), v = valores(c);
  if (k === 'grupo') return { q: '¿De qué tema?', val: c.g, ops: GRUPOS.map((g) => [g[0], g[1], '', 'lista']), aplica: (g) => { if (g !== c.g) { const p = CALC.find((x) => x.g === g); if (p) E.sel = (E.ult && E.ult[g]) || p.id; } } };
  if (k === 'calc') return { q: '¿Qué quieres calcular?', val: c.id, ops: CALC.filter((x) => x.g === c.g).map((x) => [x.id, x.nom, '', 'res']), aplica: (id) => { E.sel = id; E.ult = E.ult || {}; E.ult[c.g] = id; } };
  if (k.startsWith('f:')) { const f = c.campos.find((x) => x.k === k.slice(2)); if (!f || (f.si && !f.si(v))) return null;
    if (f.ops) return { q: f.lab, val: v[f.k], ops: f.ops.map((o) => [o[0], o[1], '', 'lista']), aplica: (y) => { v[f.k] = y; } };
    return { q: f.lab, nums: [[f.k, f.lab, v[f.k], f.min, f.max, f.uni || '']], aplica: (o) => { v[f.k] = o[f.k]; } }; }
  return null;
}
function pon(k, val) {
  const c = porId(E.sel), v = valores(c);
  if (k === 'grupo') { const p = CALC.find((x) => x.g === val); if (p && p.g !== c.g) E.sel = (E.ult && E.ult[val]) || p.id; return; }
  if (k.startsWith('op:')) { const f = c.campos.find((x) => x.k === k.slice(3)); if (f) v[f.k] = f.ops[+val][0]; return; }
  const f = c.campos.find((x) => x.k === k); if (f && isFinite(val)) v[f.k] = Math.min(f.max, Math.max(f.min, +val));
}
const CLAVES = [[/spl|nivel|presión sonora|db spl/, 'spl'], [/suma|sumar/, 'suma'], [/techo|ceiling/, 'techo'], [/aire|absorci/, 'aire'], [/retardo|delay|tiempo/, 'tiempo'], [/longitud de onda|wavelength/, 'onda'], [/line array|transici/, 'transicion'], [/end.?fire/, 'endfire'], [/broadside|subgrave|subwoofer/, 'broadside'],
  [/dbu|dbv|voltios/, 'dbu'], [/\bq\b|ancho de banda/, 'qbw'], [/limitador|limiter/, 'limitador'], [/ganancia|amplificador/, 'ampli'], [/70 ?v|100 ?v|línea de/, 'linea100'], [/cable de altavoz|sección|speaker cable/, 'cable'], [/dmx/, 'dmx'], [/rgb|cmy|color/, 'color'], [/proyector/, 'proyector'],
  [/ohm|joule/, 'ohm'], [/kva|kw|amperios|amps/, 'kva'], [/bpm|tempo/, 'bpm'], [/grabaci|recording/, 'grabacion'], [/nota|note/, 'nota'], [/convert|unidades|units/, 'medidas'], [/pines|pinout|xlr|rj45|jack/, 'pines'], [/polar|micrófono|microphone/, 'micros']];
function pide(t) {
  const s = t.toLowerCase(), h = CLAVES.find(([re]) => re.test(s)); if (!h) return false;
  E.sel = h[1]; const c = porId(E.sel), v = valores(c);
  [...s.matchAll(/(\d+(?:[.,]\d+)?)\s*(m|w|db|hz|°c|v|ω|ohm|a)\b/g)].forEach((m) => { const n = parseFloat(m[1].replace(',', '.')), u = m[2]; const f = c.campos.find((x) => !x.ops && x.uni && x.uni.toLowerCase().startsWith(u === 'ohm' ? 'ω' : u)); if (f) v[f.k] = Math.min(f.max, Math.max(f.min, n)); });
  return true;
}
export default {
  id: 'audio', nom: 'Audio y escenario', corto: 'AUDIO', ic: 'onda', ejemplo: 'Escríbela: «SPL a 20 m con 98 dB y 1000 W»',
  info: 'Los calculadores de sonido, cableado, electricidad, iluminación y música: SPL, arrays, subgraves, cable de altavoz, kVA, DMX…',
  calcula, filas, pasos, pregunta, datos, resultado, cifras, pide, esquema,
  reconoce: (t) => CLAVES.some(([re]) => re.test(t.toLowerCase())),
  set: pon, num: pon,
  pm: (k, d) => { const c = porId(E.sel), f = c.campos.find((x) => x.k === k); if (!f) return; const v = valores(c), dec = (String(f.paso).split('.')[1] || '').length; v[f.k] = Math.min(f.max, Math.max(f.min, +(v[f.k] + d * f.paso).toFixed(dec))); },
  accion: (a) => { const c = porId(E.sel); if (a === 'reset') delete E.vals[c.id]; else if (a.startsWith('c:')) { E.sel = a.slice(2); E.ult = E.ult || {}; E.ult[c.g] = E.sel; } else if (a.startsWith('v:')) { E.vis[c.id] = [a.slice(2)]; } },
  reset: () => { E = { sel: 'spl', vals: {}, vis: {} }; },
  despues: (raiz, r) => { (r.grafs || []).forEach((g, i) => { if (g.tipo === 'mapa') raiz.querySelectorAll(`canvas[data-mapa="${i}"]`).forEach((cv) => pintarMapa(cv, g)); }); },
};
