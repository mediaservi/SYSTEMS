// SYSTEMS · AUDIO Y ESCENARIO — interfaz. Consola de 3 zonas como la de SCREENS: «calculadores» (A) y «datos» (B, con CALCULAR al pie)
// son columnas fijas; el centro se desplaza con las cifras, las gráficas, las tablas y las notas. En el móvil, las zonas se apilan.
// Licencia GPL-3.0 · mediaservi.com
import { CALC, GRUPOS } from './calculos.js';
import { T, IDIOMAS, idioma, fijarIdioma, idiomaInicial } from './textos.js';

const VERSION = 'v0.11';
// v0.8 · la línea de crédito es la común de AVHUB (credito.js): se edita en AVHUB ADMIN y es la misma en todas las apps
const pintarPie = () => { const p = document.querySelector('#pie'); if (p) p.innerHTML = window.AVCREDITO ? window.AVCREDITO.html('SYSTEMS', VERSION, idioma()) : `SYSTEMS ${VERSION} ${new Date().getFullYear()} ${T('es un proyecto hecho con')} by <a href="https://mediaservi.com" target="_blank" rel="noopener">mediaservi.com</a>`; };
if (window.AVCREDITO) window.AVCREDITO.alCambiar(pintarPie);
// v0.9 · seta de aviso de fallos, común a toda la familia (fallo.js): en la barra de botones, del mismo tamaño que el resto
if (window.AVFALLO) { const bi = document.querySelector('#btn-inicio'); if (bi) { const bf = window.AVFALLO.boton({ app: 'SYSTEMS', version: VERSION, idioma }); bf.id = 'btn-fallo'; bi.before(bf);
  const talla = () => { const h = bi.offsetHeight; if (h) bf.style.setProperty('--avf', h + 'px'); }; talla(); addEventListener('resize', talla); setTimeout(talla, 800); } }
const $ = (s, r = document) => r.querySelector(s);
const COL = ['#b566ff', '#00b4ff', '#e100ff', '#ff4d5e', '#00ff04', '#ffb000'];
const porId = (id) => CALC.find(c => c.id === id) || CALC[0];
const esc = (s) => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]);
// cifras: coma decimal en español y catalán, punto en inglés; el menos, tipográfico
const F = (x, d = 2) => { if (typeof x !== 'number' || !isFinite(x)) return '—'; const en = idioma() === 'en'; return Number(x).toLocaleString(en ? 'en-GB' : 'es-ES', { maximumFractionDigits: d, useGrouping: !en }).replace('-', '−'); };

let E = { sel: 'spl', vals: {} };
try { const g = JSON.parse(localStorage.getItem('systems_estado') || 'null'); if (g && g.vals && CALC.some(c => c.id === g.sel)) E = g; } catch (e) {}
const guardar = () => { try { localStorage.setItem('systems_estado', JSON.stringify(E)); } catch (e) {} };
const valores = (c) => { const g = E.vals[c.id] || (E.vals[c.id] = {}); c.campos.forEach(f => { if (g[f.k] === undefined || (f.ops ? !f.ops.some(o => o[0] === g[f.k]) : typeof g[f.k] !== 'number')) g[f.k] = f.def; }); return g; };
const visibles = (c, v) => c.campos.filter(f => !f.si || f.si(v));

// ---------- piezas de la interfaz (mismas clases que SCREENS) ----------
const FLECHA = (d) => `<svg viewBox="0 0 10 6" aria-hidden="true"><path d="${d > 0 ? 'M5 .5 9.5 5.5H.5z' : 'M.5 .5h9L5 5.5z'}" fill="currentColor"/></svg>`;
const tog = (on, attrs, txt) => `<button type="button" class="tog${on ? ' on' : ''}" aria-pressed="${on}" ${attrs}>${txt}</button>`;
function campoHTML(f, v) {
  const lab = `<label>${esc(T(f.lab))}</label>`;
  if (f.ops) {
    if (f.sel || f.ops.length > 4) return `<div class="campo">${lab}<select class="sel" data-ksel="${f.k}" aria-label="${esc(T(f.lab))}">${f.ops.map((o, i) => `<option value="${i}"${o[0] === v[f.k] ? ' selected' : ''}>${esc(T(o[1]))}</option>`).join('')}</select></div>`;
    // opciones con nombres largos: una debajo de otra, para que ninguna palabra quede apretada en un tercio de la columna
    const largo = Math.max(...f.ops.map(o => Math.max(...T(o[1]).split(' ').map(w => w.length)))), cols = (f.ops.length >= 3 && largo > 8) || (f.ops.length === 2 && largo > 13) ? 1 : f.ops.length;
    return `<div class="campo">${lab}<div class="fila c${cols}">${f.ops.map((o, i) => tog(o[0] === v[f.k], `data-op="${f.k}" data-i="${i}"`, esc(T(o[1])))).join('')}</div></div>`;
  }
  return `<div class="campo">${lab}<div class="num"><input type="number" inputmode="decimal" data-k="${f.k}" value="${v[f.k]}" step="${f.paso}" min="${f.min}" max="${f.max}" aria-label="${esc(T(f.lab))}">${f.uni ? `<span>${esc(f.uni)}</span>` : ''}<div class="flechas">` +
    `<button type="button" class="flecha" data-flecha="1" data-k="${f.k}" tabindex="-1" aria-label="${T('Subir')}">${FLECHA(1)}</button><button type="button" class="flecha" data-flecha="-1" data-k="${f.k}" tabindex="-1" aria-label="${T('Bajar')}">${FLECHA(-1)}</button></div></div></div>`;
}
const tarjeta = (r, i) => `<div class="tar" style="--ac:${COL[i % COL.length]}"><div class="t">${esc(T(r[0]))}</div><div class="v">${esc(T(String(r[1])))}<small>${esc(T(r[2] || ''))}</small></div>${r[3] ? `<div class="s">${esc(T(r[3]))}</div>` : ''}</div>`;

// ---------- gráficas ----------
function grafLinea(g) {
  const W = 600, H = 250, ml = 46, mr = 12, mt = 10, mb = 28, xs = g.xs, x0 = xs[0], x1 = xs[xs.length - 1];
  const todos = g.series.flatMap(s => s.ys).filter(isFinite); let y0 = g.ymin != null ? g.ymin : Math.min(...todos), y1 = g.ymax != null ? g.ymax : Math.max(...todos);
  const paso = [0.5, 1, 2, 3, 5, 6, 10, 12, 20, 50].find(p => (y1 - y0) / p <= 7) || 100; y0 = Math.floor(y0 / paso) * paso; y1 = Math.ceil(y1 / paso) * paso; if (y1 === y0) y1 = y0 + paso;
  const X = (x) => ml + (g.log ? Math.log(x / x0) / Math.log(x1 / x0) : (x - x0) / (x1 - x0)) * (W - ml - mr), Y = (y) => mt + (1 - (Math.min(y1, Math.max(y0, y)) - y0) / (y1 - y0)) * (H - mt - mb);
  let h = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(T(g.tit))}">`;
  for (let y = y0; y <= y1 + 1e-9; y += paso) h += `<line x1="${ml}" x2="${W - mr}" y1="${Y(y)}" y2="${Y(y)}" stroke="rgba(255,255,255,.08)"/><text x="${ml - 6}" y="${Y(y) + 4}" font-size="11" text-anchor="end">${F(y, 1)}</text>`;
  const marcas = []; if (g.log) { for (let d = Math.pow(10, Math.floor(Math.log10(x0))); d <= x1; d *= 10) [1, 2, 5].forEach(m => { if (d * m >= x0 * 0.999 && d * m <= x1 * 1.001) marcas.push(d * m); }); } else for (let i = 0; i <= 5; i++) marcas.push(x0 + (x1 - x0) * i / 5);
  marcas.forEach(x => { h += `<line x1="${X(x)}" x2="${X(x)}" y1="${mt}" y2="${H - mb}" stroke="rgba(255,255,255,.08)"/><text x="${X(x)}" y="${H - mb + 15}" font-size="11" text-anchor="middle">${x >= 1000 ? F(x / 1000, 1) + 'k' : F(x, 1)}</text>`; });
  if (g.marca && g.marca >= x0 && g.marca <= x1) h += `<line x1="${X(g.marca)}" x2="${X(g.marca)}" y1="${mt}" y2="${H - mb}" stroke="#9900ff" stroke-width="1.5" stroke-dasharray="4 4"/>`;
  g.series.forEach(s => { h += `<polyline fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" points="${s.ys.map((y, i) => X(xs[i]).toFixed(1) + ',' + Y(y).toFixed(1)).join(' ')}"/>`; });
  h += `<text x="${W - mr}" y="${H - 4}" font-size="11" text-anchor="end">${esc(g.xlab || '')}</text><text x="6" y="${mt + 9}" font-size="11">${esc(g.ylab || '')}</text></svg>`;
  if (g.series.length > 1) h += `<div class="hw-ley">${g.series.map(s => `<span><i style="background:${s.color}"></i>${esc(T(s.nom))}</span>`).join('')}</div>`;
  return h;
}
function grafPolar(g) {
  const S = 320, c = S / 2, R = 126, min = g.min || -30;
  let h = `<svg viewBox="0 0 ${S} ${S}" role="img" aria-label="${esc(T(g.tit))}">`;
  for (let d = 0; d >= min; d -= 6) { const r = R * (d - min) / -min; if (r > 0) h += `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="rgba(255,255,255,${d === 0 ? .28 : .09})"/>` + (d < 0 && d > min ? `<text x="${c + 3}" y="${c - r + 11}" font-size="9">${d}</text>` : ''); }
  for (let a = 0; a < 360; a += 30) { const s = Math.sin(a * Math.PI / 180), k = Math.cos(a * Math.PI / 180); h += `<line x1="${c}" y1="${c}" x2="${c + R * s}" y2="${c - R * k}" stroke="rgba(255,255,255,.08)"/><text x="${c + (R + 15) * s}" y="${c - (R + 15) * k + 4}" font-size="10" text-anchor="middle">${a > 180 ? a - 360 : a}°</text>`; }
  g.series.forEach(s => { const p = s.pts.map((d, a) => { const r = R * Math.max(0, (Math.min(0, d) - min) / -min), t = a * Math.PI / 180; return (c + r * Math.sin(t)).toFixed(1) + ',' + (c - r * Math.cos(t)).toFixed(1); }); h += `<polygon points="${p.join(' ')}" fill="${s.color}22" stroke="${s.color}" stroke-width="2" stroke-linejoin="round"/>`; });
  return h + `<text x="${c}" y="${S - 4}" font-size="10" text-anchor="middle">dB · 0° = ${esc(T('delante'))}</text></svg>`;
}
function grafPlanta(g) {
  const W = 600, k = Math.min((W - 20) / g.L, 300 / g.W), w = g.L * k, hh = g.W * k, H = hh + 20, ox = (W - w) / 2, oy = 10;
  let h = `<svg viewBox="0 0 ${W} ${H.toFixed(0)}" role="img" aria-label="${esc(T(g.tit))}"><rect x="${ox}" y="${oy}" width="${w}" height="${hh}" fill="#17171a" stroke="#74747b" stroke-width="1.5"/><clipPath id="hw-sala"><rect x="${ox}" y="${oy}" width="${w}" height="${hh}"/></clipPath><g clip-path="url(#hw-sala)">`;
  if (g.nx * g.ny <= 600) for (let i = 0; i < g.nx; i++) for (let j = 0; j < g.ny; j++) { const x = ox + (i + .5) * w / g.nx, y = oy + (j + .5) * hh / g.ny; h += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(g.r * k).toFixed(1)}" fill="rgba(0,255,4,.10)" stroke="rgba(0,255,4,.45)"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#00ff04"/>`; }
  return h + `</g><text x="${W / 2}" y="${H - 1}" font-size="11" text-anchor="middle">${F(g.L, 1)} × ${F(g.W, 1)} m</text></svg>`;
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
    return h + `<text x="300" y="140" font-size="11.5" text-anchor="middle">${esc(T('Pestaña hacia abajo y contactos hacia ti: el 1, a la izquierda'))}</text></svg>`; }
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
function grafHTML(g, i) {
  const cab = `<h3>${esc(T(g.tit))}${g.sub ? `<small>${esc(T(g.sub))}</small>` : ''}</h3>`;
  if (g.tipo === 'linea') return `<div class="hw-graf ancho">${cab}${grafLinea(g)}</div>`;
  if (g.tipo === 'polar') return `<div class="hw-graf">${cab}${grafPolar(g)}</div>`;
  if (g.tipo === 'mapa') return `<div class="hw-graf">${cab}<canvas width="440" height="440" data-mapa="${i}" role="img" aria-label="${esc(T(g.tit))}"></canvas><div class="hw-escala"><span>−30 dB</span><span class="b"></span><span>+6 dB</span></div></div>`;
  if (g.tipo === 'planta') return `<div class="hw-graf ancho">${cab}${grafPlanta(g)}</div>`;
  if (g.tipo === 'dip') return `<div class="hw-graf">${cab}${grafDip(g)}</div>`;
  if (g.tipo === 'color') return `<div class="hw-graf">${cab}<div class="hw-muestra" style="background:${g.hex}"></div></div>`;
  if (g.tipo === 'conector') { const d = grafConector(g); return d ? `<div class="hw-graf ancho">${cab}${d}</div>` : ''; }
  return '';
}

// ---------- pintado ----------
const grupoDe = (c) => GRUPOS.find(g => g[0] === c.g);
function pintarConsola() {
  const c = porId(E.sel);
  $('#consola').innerHTML = `<div class="hw-grupos" role="group" aria-label="${T('Calculadores')}">${GRUPOS.map(g => tog(g[0] === c.g, `data-g="${g[0]}"`, esc(T(g[1])))).join('')}</div><div class="hw-lcd" role="status">${T('EN PRUEBAS · BETA')}</div>`;
}
function pintarZonas() {
  const c = porId(E.sel), v = valores(c), lista = CALC.filter(x => x.g === c.g), campos = visibles(c, v);
  $('#panelA').innerHTML = `<div class="zona-cab"><b>A</b>${T('Calculadores')}</div><section class="mod blq act"><div class="mod-tit"><span class="blq-cab"><i class="blq-led"></i><span class="blq-nom">${esc(T(grupoDe(c)[1]))}</span></span></div><div class="blq-cuerpo">
    <div class="hw-lista">${lista.map(x => `<button type="button" class="tog${x.id === c.id ? ' on' : ''}" aria-pressed="${x.id === c.id}" data-c="${x.id}"><i></i><span>${esc(T(x.nom))}</span></button>`).join('')}</div>
    <select class="sel hw-sel" data-calc="1" aria-label="${T('Elige un calculador')}">${GRUPOS.map(g => `<optgroup label="${esc(T(g[1]))}">${CALC.filter(x => x.g === g[0]).map(x => `<option value="${x.id}"${x.id === c.id ? ' selected' : ''}>${esc(T(x.nom))}</option>`).join('')}</optgroup>`).join('')}</select></div></section>
    <div class="zona-pie" style="grid-template-columns:minmax(0,1fr)"><span class="ayuda" style="text-align:center">${CALC.length} ${T('calculadores')}</span></div>`;
  $('#panelB').innerHTML = `<div class="zona-cab"><b>B</b>${T('Datos')}</div><section class="mod blq act"><div class="mod-tit"><span class="blq-cab"><i class="blq-led"></i><span class="blq-nom">${esc(T(c.nom))}</span></span></div><div class="blq-cuerpo">
    ${campos.length ? campos.map(f => campoHTML(f, v)).join('') : `<p class="ayuda">${T('Sin datos que introducir')}</p>`}
    ${c.tap ? `<button type="button" class="sec-btn hw-tap" data-accion="tap">TAP</button><p class="ayuda">${T('Marca el pulso')}</p>` : ''}</div></section>
    <div class="zona-pie"><button type="button" class="pri" data-accion="calc-ir">${T('Calcular')}</button><button type="button" class="sec-btn reset" data-accion="reset">${T('Restablecer')}</button></div>`;
}
let ultimo = null;
function pintarResultado() {
  const c = porId(E.sel), v = valores(c); let r;
  try { r = c.calc(v, F); } catch (e) { console.error(e); r = { res: [], notas: [] }; }
  ultimo = r;
  let h = `<div class="hw-cab"><small>${esc(T(grupoDe(c)[1]))}</small><h2 class="hw-nombre">${esc(T(c.nom))}</h2></div>`;
  if (r.res && r.res.length) h += `<div class="res-tot">${r.res.map(tarjeta).join('')}</div>`;
  const gs = (r.grafs || []).map(grafHTML).join(''); if (gs) h += `<div class="hw-grafs">${gs}</div>`;
  if (r.tabla) h += `<div class="tabla-caja"><table class="tabla"><thead><tr>${r.tabla.cab.map(x => `<th>${esc(T(x))}</th>`).join('')}</tr></thead><tbody>${r.tabla.filas.map(f => `<tr>${f.map(x => `<td>${esc(T(String(x)))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  h += `<div class="hw-notas">${(r.notas || []).map(n => `<p>${esc(T(n))}</p>`).join('')}<p class="av">${T('Estos cálculos son orientativos: comprueba siempre los datos del fabricante y la normativa antes de montar.')}</p></div>`;
  $('#res').innerHTML = h;
  (r.grafs || []).forEach((g, i) => { if (g.tipo === 'mapa') { const cv = $(`#res canvas[data-mapa="${i}"]`); if (cv) pintarMapa(cv, g); } });
  ajustar();
}
function pintarTodo() {
  document.documentElement.lang = idioma();
  $('#btn-idioma').textContent = idioma().toUpperCase(); $('#btn-idioma').setAttribute('aria-label', T('Idioma')); $('#btn-inicio').setAttribute('aria-label', T('Inicio')); $('#hw-lema').textContent = T('Audio y escenario');
  if (!$('#panelA')) $('#app').innerHTML = `<div class="trabajo z3"><aside class="panel zona" id="panelA" data-zona="a"></aside><aside class="panel zona" id="panelB" data-zona="b"></aside><main class="vista"><div class="res" id="res"></div></main></div>`;
  pintarConsola(); pintarZonas(); pintarResultado();
  pintarPie();
  guardar();
}
// los textos de una sola línea nunca tocan el borde: si no caben, se reduce la letra
function ajustar() {
  document.querySelectorAll('.hw-grupos .tog, .zona .fila .tog, .zona-pie .pri, .zona-pie .sec-btn, .hw-lcd, .zona-cab').forEach(el => {
    if (!el.offsetWidth) return; el.style.removeProperty('font-size'); let fs = parseFloat(getComputedStyle(el).fontSize), k = 0;
    const boton = el.matches('.tog, .pri, .sec-btn'), ancho = () => { const r = document.createRange(); r.selectNodeContents(el); const rs = [...r.getClientRects()]; return rs.length ? Math.max(...rs.map(q => q.right)) - Math.min(...rs.map(q => q.left)) : 0; };
    while ((el.scrollWidth > el.clientWidth + 0.5 || el.scrollHeight > el.clientHeight + 0.5 || (boton && ancho() > el.clientWidth - 10)) && fs > 8 && k++ < 20) { fs -= 0.5; el.style.setProperty('font-size', fs + 'px'); }
  });
}

// ---------- eventos ----------
function seleccionar(id) { E.sel = porId(id).id; pintarConsola(); pintarZonas(); pintarResultado(); guardar(); const v = $('.vista'); if (v) v.scrollTop = 0; }
function fijar(c, f, val, repintarDatos) { const v = valores(c); v[f.k] = val; guardar(); if (repintarDatos || c.campos.some(x => x.si)) { const foco = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k : null; if (repintarDatos) { pintarZonas(); if (foco) { const n = $(`[data-k="${foco}"]`); if (n && n.tagName === 'INPUT') n.focus(); } } } pintarResultado(); }
const taps = [];
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('button, a[data-accion]'); if (!b || b.disabled) return; const c = porId(E.sel);
  if (b.dataset.g) { const prim = CALC.find(x => x.g === b.dataset.g); if (prim && c.g !== b.dataset.g) seleccionar((E.ult && E.ult[b.dataset.g]) || prim.id); return; }
  if (b.dataset.c) { E.ult = E.ult || {}; E.ult[porId(b.dataset.c).g] = b.dataset.c; seleccionar(b.dataset.c); return; }
  if (b.dataset.op) { const f = c.campos.find(x => x.k === b.dataset.op); fijar(c, f, f.ops[Number(b.dataset.i)][0], true); return; }
  if (b.dataset.flecha) { const f = c.campos.find(x => x.k === b.dataset.k), v = valores(c), dec = (String(f.paso).split('.')[1] || '').length, n = Math.min(f.max, Math.max(f.min, Number((v[f.k] + Number(b.dataset.flecha) * f.paso).toFixed(Math.max(dec, 0))))); v[f.k] = n; const i = $(`input[data-k="${f.k}"]`); if (i) i.value = n; guardar(); pintarResultado(); return; }
  const a = b.dataset.accion;
  if (a === 'inicio') { ev.preventDefault(); E = { sel: 'spl', vals: {} }; pintarTodo(); return; }
  if (a === 'idioma') { fijarIdioma(IDIOMAS[(IDIOMAS.indexOf(idioma()) + 1) % IDIOMAS.length]); pintarTodo(); return; }
  if (a === 'reset') { delete E.vals[c.id]; pintarZonas(); pintarResultado(); guardar(); return; }
  if (a === 'calc-ir') { pintarResultado(); const el = $('.res-tot') || $('#res'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.remove('dest'); void el.offsetWidth; el.classList.add('dest'); return; }
  if (a === 'tap') { const t = performance.now(); if (taps.length && t - taps[taps.length - 1] > 2500) taps.length = 0; taps.push(t); if (taps.length > 8) taps.shift(); b.classList.add('pulso'); setTimeout(() => b.classList.remove('pulso'), 120);
    if (taps.length >= 2) { const f = c.campos.find(x => x.k === c.tap), bpm = Math.round(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1)) * 10) / 10; valores(c)[f.k] = Math.min(f.max, Math.max(f.min, bpm)); const i = $(`input[data-k="${f.k}"]`); if (i) i.value = valores(c)[f.k]; guardar(); pintarResultado(); } return; }
});
document.addEventListener('input', (ev) => {
  const i = ev.target; if (!i.dataset || !i.dataset.k || i.tagName !== 'INPUT') return; const c = porId(E.sel), f = c.campos.find(x => x.k === i.dataset.k); if (!f) return;
  const n = parseFloat(String(i.value).replace(',', '.')); if (isNaN(n)) return; valores(c)[f.k] = Math.min(f.max, Math.max(f.min, n)); guardar(); pintarResultado();
});
document.addEventListener('change', (ev) => {
  const s = ev.target, c = porId(E.sel);
  if (s.dataset.calc) { E.ult = E.ult || {}; E.ult[porId(s.value).g] = s.value; seleccionar(s.value); return; }
  if (s.dataset.ksel) { const f = c.campos.find(x => x.k === s.dataset.ksel); fijar(c, f, f.ops[Number(s.value)][0], true); return; }
  if (s.dataset.k && s.tagName === 'INPUT') { const f = c.campos.find(x => x.k === s.dataset.k); if (f) s.value = valores(c)[f.k]; }   // al salir de la casilla se ve el valor ya acotado
});
window.addEventListener('resize', () => requestAnimationFrame(ajustar));

fijarIdioma(idiomaInicial());
pintarTodo();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustar);
