// SYSTEMS · BLOCKS beta — los mismos 26 calculadores de SYSTEMS (calculos.js) en la interfaz de bloques fijos de AVHUB: todo en una pantalla.
// Arriba, los grupos y CALCULAR; a la izquierda, los calculadores del grupo y sus datos; en los dos bloques grandes, dos vistas distintas
// (gráficas, tabla, resumen o notas, a elegir en cada uno); abajo, las seis cifras principales. Las gráficas son las de la versión clásica (app.js).
// Licencia GPL-3.0 · mediaservi.com
import { CALC, GRUPOS } from '../calculos.js';
import { T as T0, IDIOMAS, idioma, fijarIdioma, idiomaInicial } from '../textos.js';

const VERSION = 'v0.18', BETA = 'BLOCKS · beta 1';
// textos nuevos de esta vista (el resto sale de textos.js)
const MIO = { 'Resumen': ['Summary', 'Resum'], 'Tabla': ['Table', 'Taula'], 'Notas': ['Notes', 'Notes'], 'Vista 1': ['View 1', 'Vista 1'], 'Vista 2': ['View 2', 'Vista 2'], 'Resultado': ['Result', 'Resultat'], 'Versión clásica': ['Classic version', 'Versió clàssica'],
  'Tema claro u oscuro': ['Light or dark theme', 'Tema clar o fosc'], 'Nuevo cálculo: lo deja todo como al empezar': ['New calculation: back to the starting values', 'Nou càlcul: ho deixa tot com al començar'], 'Sin más cifras': ['No more figures', 'Sense més xifres'],
  'Cálculos orientativos: comprueba los datos del fabricante y la normativa.': ['Indicative figures: check the manufacturer data and the regulations.', 'Càlculs orientatius: comprova les dades del fabricant i la normativa.'], 'Y además': ['Also', 'I a més'], 'Gráfica': ['Chart', 'Gràfica'], 'Polar': ['Polar', 'Polar'], 'Mapa': ['Map', 'Mapa'], 'Curva': ['Curve', 'Corba'], 'Planta': ['Plan', 'Planta'], 'Conector': ['Connector', 'Connector'] };
const T = (s) => { const m = MIO[s]; if (m) { const i = idioma() === 'en' ? 0 : idioma() === 'ca' ? 1 : -1; return i < 0 ? s : m[i]; } return T0(s); };
const $ = (s, r = document) => r.querySelector(s);
const COL = ['#b566ff', '#00b4ff', '#e100ff', '#ff4d5e', '#00c853', '#ffb000'];
const porId = (id) => CALC.find(c => c.id === id) || CALC[0];
const esc = (s) => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]);
const F = (x, d = 2) => { if (typeof x !== 'number' || !isFinite(x)) return '—'; const en = idioma() === 'en'; return Number(x).toLocaleString(en ? 'en-GB' : 'es-ES', { maximumFractionDigits: d, useGrouping: !en }).replace('-', '−'); };

// el estado de los calculadores es el mismo de la versión clásica (se comparte); lo propio de esta vista va aparte
let E = { sel: 'spl', vals: {} };
try { const g = JSON.parse(localStorage.getItem('systems_estado') || 'null'); if (g && g.vals && CALC.some(c => c.id === g.sel)) E = g; } catch (e) {}
let V = { tema: 'oscuro', vis: {} };
try { const g = JSON.parse(localStorage.getItem('systems_blocks') || 'null'); if (g && g.vis) V = g; } catch (e) {}
const guardar = () => { try { localStorage.setItem('systems_estado', JSON.stringify(E)); localStorage.setItem('systems_blocks', JSON.stringify(V)); } catch (e) {} };
const valores = (c) => { const g = E.vals[c.id] || (E.vals[c.id] = {}); c.campos.forEach(f => { if (g[f.k] === undefined || (f.ops ? !f.ops.some(o => o[0] === g[f.k]) : typeof g[f.k] !== 'number')) g[f.k] = f.def; }); return g; };
const visibles = (c, v) => c.campos.filter(f => !f.si || f.si(v));
const grupoDe = (c) => GRUPOS.find(g => g[0] === c.g);

// ---------- gráficas (las de la versión clásica) ----------
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
  if (g.series.length > 1) h += `<div class="ley">${g.series.map(s => `<span><i style="background:${s.color}"></i>${esc(T(s.nom))}</span>`).join('')}</div>`;
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
// ---------- piezas ----------
const IC = { lista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  datos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
  vista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>',
  clasica: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/></svg>',
  tema: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg>',
  nuevo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>' };
const tog = (on, attrs, txt) => `<button type="button" class="tog" aria-pressed="${on}" ${attrs}>${txt}</button>`;
const blk = (area, id, tit, ic, cuerpo, extra = '', cls = '', pie = '', ac = '') => `<section class="blk ${cls}" style="grid-area:${area}${ac ? `;--ac:${ac}` : ''}" data-blk="${id}"><div class="blk-cab">${ic || ''}<b>${tit}</b><span class="sep"></span>${extra}<span class="id">${id}</span></div><div class="blk-cu">${cuerpo}</div>${pie ? `<div class="blk-pie">${pie}</div>` : ''}</section>`;
function campoHTML(f, v) {
  const lab = `<label>${esc(T(f.lab))}</label>`;
  if (f.ops) {
    if (f.sel || f.ops.length > 4) return `<div class="campo">${lab}<select class="sel" data-ksel="${f.k}" aria-label="${esc(T(f.lab))}">${f.ops.map((o, i) => `<option value="${i}"${o[0] === v[f.k] ? ' selected' : ''}>${esc(T(o[1]))}</option>`).join('')}</select></div>`;
    return `<div class="campo">${lab}<div class="fila">${f.ops.map((o, i) => tog(o[0] === v[f.k], `data-op="${f.k}" data-i="${i}"`, esc(T(o[1])))).join('')}</div></div>`;
  }
  return `<div class="campo">${lab}<div class="paso"><button type="button" data-flecha="-1" data-k="${f.k}" tabindex="-1" aria-label="${T('Bajar')}">−</button><input type="number" inputmode="decimal" data-k="${f.k}" value="${v[f.k]}" step="${f.paso}" min="${f.min}" max="${f.max}" aria-label="${esc(T(f.lab))}">${f.uni ? `<span>${esc(f.uni)}</span>` : ''}<button type="button" data-flecha="1" data-k="${f.k}" tabindex="-1" aria-label="${T('Subir')}">+</button></div></div>`;
}

// ---------- las vistas de los dos bloques grandes ----------
// cada calculador ofrece: sus gráficas, su tabla (si la tiene), el resumen de todas las cifras y las notas
let R = { res: [], notas: [] };
function vistasDe(r) {
  const CORTO = { polar: 'Polar', mapa: 'Mapa', linea: 'Curva', planta: 'Planta', dip: 'DIP', color: 'Color', conector: 'Conector' }, L = (r.grafs || []).map((g, i) => ({ k: 'g' + i, nom: T(g.tit), corto: T(CORTO[g.tipo] || 'Gráfica'), g, i })).filter(x => x.g.tipo !== 'conector' || grafConector(x.g));
  if (r.tabla) L.push({ k: 'tabla', nom: T('Tabla'), corto: T('Tabla') });
  L.push({ k: 'notas', nom: T('Notas'), corto: T('Notas') }); L.push({ k: 'resumen', nom: T('Resumen'), corto: T('Resumen') });
  return L;
}
function vistaHTML(x, r) {
  if (!x) return '';
  if (x.k === 'tabla') return `<div class="vis texto"><table class="tabla"><thead><tr>${r.tabla.cab.map(h => `<th>${esc(T(h))}</th>`).join('')}</tr></thead><tbody>${r.tabla.filas.map(f => `<tr>${f.map(c => `<td>${esc(T(String(c)))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if (x.k === 'resumen') return `<div class="vis texto"><div class="resumen">${(r.res || []).map(q => `<div><div class="t">${esc(T(q[0]))}</div><div class="v">${esc(T(String(q[1])))}<small>${esc(T(q[2] || ''))}</small></div>${q[3] ? `<div class="s">${esc(T(q[3]))}</div>` : ''}</div>`).join('') || `<p class="ayuda">${T('Sin más cifras')}</p>`}</div></div>`;
  if (x.k === 'notas') return `<div class="vis texto notas">${(r.notas || []).map(n => `<p>${esc(T(n))}</p>`).join('')}<p class="av">${T0('Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.')}</p></div>`;
  const g = x.g, cab = `<h3>${esc(T(g.tit))}${g.sub ? `<small>${esc(T(g.sub))}</small>` : ''}</h3>`;
  if (g.tipo === 'linea') return `<div class="vis">${cab}${grafLinea(g)}</div>`;
  if (g.tipo === 'polar') return `<div class="vis">${cab}${grafPolar(g)}</div>`;
  if (g.tipo === 'mapa') return `<div class="vis">${cab}<canvas width="440" height="440" data-mapa="${x.i}" role="img" aria-label="${esc(T(g.tit))}"></canvas><div class="escala"><span>−30 dB</span><span class="b"></span><span>+6 dB</span></div></div>`;
  if (g.tipo === 'planta') return `<div class="vis">${cab}${grafPlanta(g)}</div>`;
  if (g.tipo === 'dip') return `<div class="vis">${cab}${grafDip(g)}</div>`;
  if (g.tipo === 'color') return `<div class="vis">${cab}<div class="muestra" style="background:${g.hex}"></div></div>`;
  if (g.tipo === 'conector') return `<div class="vis">${cab}${grafConector(g)}</div>`;
  return '';
}
// qué vista toca en cada bloque: la que eligió el usuario para ese calculador o, si no, las dos primeras (nunca la misma en los dos)
function eleccion(c, L) { const g = V.vis[c.id] || []; let a = L.find(x => x.k === g[0]) || L[0], b = L.find(x => x.k === g[1] && x.k !== a.k) || L.find(x => x.k !== a.k) || L[0]; return [a, b]; }

// ---------- pintado ----------
function pinta() {
  const c = porId(E.sel), v = valores(c), lista = CALC.filter(x => x.g === c.g), campos = visibles(c, v);
  try { R = c.calc(v, F); } catch (e) { console.error(e); R = { res: [], notas: [] }; }
  const L = vistasDe(R), [va, vb] = eleccion(c, L), res = R.res || [];
  const selV = (n, act) => L.length > 2 ? `<span class="vistas" role="group">${L.map(x => `<button type="button" data-vista="${n}" data-k="${x.k}" aria-pressed="${x.k === act.k}"${x.k === (n ? va : vb).k ? ' disabled style="opacity:.35"' : ''}>${esc(x.corto)}</button>`).join('')}</span>` : '';
  let h = blk('ma', 'M1A', T('Calculadores'), IC.lista, `<div class="lista" style="display:flex;flex-direction:column;gap:calc(var(--u)*7)">${lista.map(x => `<button type="button" class="tog" aria-pressed="${x.id === c.id}" data-c="${x.id}"><i></i><span>${esc(T(x.nom))}</span></button>`).join('')}</div><p class="ayuda" style="margin-top:auto">${esc(T(grupoDe(c)[1]))} · ${lista.length} / ${CALC.length} ${T('calculadores')}</p>`);
  h += blk('mb', 'M1B', T('Datos'), IC.datos, (campos.length ? campos.map(f => campoHTML(f, v)).join('') : `<p class="ayuda">${T('Sin datos que introducir')}</p>`) + (c.tap ? `<button type="button" class="pri" data-accion="tap" style="flex:none">TAP</button><p class="ayuda">${T('Marca el pulso')}</p>` : ''), '', '', `<button type="button" class="sec" data-accion="reset">${T('Restablecer')}</button>`);
  h += blk('s1a', 'S1A', L.length > 2 ? '' : esc(va.nom), IC.vista, vistaHTML(va, R), selV(0, va), 'pant') + blk('s1b', 'S1B', L.length > 2 ? '' : esc(vb.nom), IC.vista, vistaHTML(vb, R), selV(1, vb), 'pant', '', '#b566ff');
  'abcdef'.split('').forEach((l, i) => { const q = res[i], resto = i === 5 && res.length > 6;
    h += q ? blk('m3' + l, 'M3' + l.toUpperCase(), esc(T(q[0])), '', `<div class="v">${esc(T(String(q[1])))}<small>${esc(T(q[2] || ''))}</small></div>${q[3] ? `<div class="s">${esc(T(q[3]))}</div>` : ''}${resto ? `<div class="s">${T('Y además')}: ${res.slice(6).map(z => esc(T(z[0])) + ' ' + esc(T(String(z[1]))) + ' ' + esc(T(z[2] || ''))).join(' · ')}</div>` : ''}`, '', 'res', '', COL[i])
      : blk('m3' + l, 'M3' + l.toUpperCase(), '&nbsp;', '', `<div class="v">—</div>`, '', 'res vacio', '', COL[i]); });
  $('#rejilla').innerHTML = h;
  (R.grafs || []).forEach((g, i) => { if (g.tipo === 'mapa') { const cv = $(`#rejilla canvas[data-mapa="${i}"]`); if (cv) pintarMapa(cv, g); } });
  $('#grupos').innerHTML = GRUPOS.map(g => tog(g[0] === c.g, `data-g="${g[0]}"`, esc(T(g[1])))).join('');
  ajusta(); guardar();
}
function marco() {
  document.documentElement.lang = idioma(); document.documentElement.dataset.tema = V.tema === 'claro' ? 'claro' : 'oscuro';
  const fam = [['SCREENS', 'https://screens.mediaservi.com/', 'fam/screens-logo.svg'], ['ADPOSTER', 'https://adposter.mediaservi.com/', 'fam/adposter-logo.svg'], ['AVHUB', 'https://avhub.mediaservi.com/', 'avhub-logo.svg'], ['VJSHOW', 'https://vjshow.mediaservi.com/', 'fam/vjshow-logo.svg'], ['MSGAME', 'https://msgame.mediaservi.com/', 'fam/msgame-logo.svg?v=4']];
  $('#app').innerHTML = `<div class="blocks">
    <header class="franja f-h1"><div data-blk="H1L"><button type="button" class="marca" data-accion="inicio" title="${T('Nuevo cálculo: lo deja todo como al empezar')}" aria-label="SYSTEMS"><img src="../assets/systems-logo.svg" alt="SYSTEMS"></button><span class="chip">${BETA}</span></div>
      <nav data-blk="H1C" class="fam" aria-label="AVHUB">${fam.map(f => `<a href="${f[1]}" target="_blank" rel="noopener" aria-label="${f[0]}"${f[0] === 'AVHUB' ? ' class="hub"' : ''}><img src="../assets/${f[2]}" alt="${f[0]}"></a>`).join('')}</nav>
      <div data-blk="H1R" class="h1r"><a class="ic-bt" href="../" title="${T('Versión clásica')}" aria-label="${T('Versión clásica')}">${IC.clasica}</a><button type="button" class="ic-bt" data-accion="inicio" title="${T('Nuevo cálculo: lo deja todo como al empezar')}" aria-label="${T('Inicio')}">${IC.nuevo}</button><button type="button" class="ic-bt" data-accion="tema" title="${T('Tema claro u oscuro')}" aria-label="${T('Tema claro u oscuro')}">${IC.tema}</button><button type="button" class="ic-bt" data-accion="idioma" aria-label="${T('Idioma')}">${idioma().toUpperCase()}</button></div></header>
    <div class="franja f-hm"><div data-blk="HM1" class="grupos" id="grupos" role="group" aria-label="${T('Calculadores')}"></div><div data-blk="HM3"><button type="button" class="pri" data-accion="calc">${T('Calcular')}</button></div></div>
    <main class="rejilla" id="rejilla"></main>
    <footer class="franja f-f1"><div data-blk="F1L" class="av">${T0('Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.')}</div><div data-blk="F1C" class="cred" id="pie"></div><div data-blk="F1R" class="der" id="f1r"></div></footer></div>`;
  pintaPie(); const r = $('#f1r');
  if (window.AVINSTALA) { const b = window.AVINSTALA.boton({ app: 'SYSTEMS', idioma, sw: '../sw.js' }); b.style.setProperty('--avi', 'calc(var(--u) * 40)'); r.appendChild(b); }
  if (window.AVFALLO) { const b = window.AVFALLO.boton({ app: 'SYSTEMS', version: VERSION + ' · ' + BETA, idioma }); b.style.setProperty('--avf', 'calc(var(--u) * 40)'); r.appendChild(b); }
  pinta();
}
const pintaPie = () => { const p = $('#pie'); if (p) p.innerHTML = window.AVCREDITO ? window.AVCREDITO.html('SYSTEMS', VERSION, idioma()) : `SYSTEMS ${VERSION} ${new Date().getFullYear()} · <a href="https://mediaservi.com" target="_blank" rel="noopener">mediaservi.com</a>`; };
if (window.AVCREDITO) window.AVCREDITO.alCambiar(pintaPie);
// ningún texto de una línea se corta: si no cabe, se reduce la letra (nunca se parte en renglones)
function ajusta() {
  document.querySelectorAll('.grupos .tog, .fila .tog, .lista .tog, .blk.res .v, .blk-cab b, .f-f1 .cred, .f-f1 .av, .vistas button, .campo > label').forEach(el => {
    if (!el.offsetWidth) return; el.style.removeProperty('font-size'); let fs = parseFloat(getComputedStyle(el).fontSize), k = 0; const min = fs * .5;
    while ((el.scrollWidth > el.clientWidth + 0.5 || (el.matches('.lista .tog, .fila .tog') && el.scrollHeight > el.clientHeight + 0.5)) && fs > min && k++ < 40) { fs -= 0.5; el.style.setProperty('font-size', fs + 'px'); }
  });
  document.querySelectorAll('.blk.res').forEach(b => { const v = b.querySelector('.v'), cu = b.querySelector('.blk-cu'); if (!v || !cu.offsetWidth) return; let fs = parseFloat(getComputedStyle(v).fontSize), k = 0; const min = fs * .4; while ((v.scrollWidth > v.clientWidth + .5 || cu.scrollHeight > cu.clientHeight + 1) && fs > min && k++ < 60) { fs -= 1; v.style.setProperty('font-size', fs + 'px'); } });
}

// ---------- eventos ----------
function seleccionar(id) { E.sel = porId(id).id; pinta(); }
function fijar(c, f, val) { valores(c)[f.k] = val; const foco = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.k : null; pinta(); if (foco) { const n = $(`input[data-k="${foco}"]`); if (n) n.focus(); } }
const taps = [];
document.addEventListener('click', (ev) => {
  const b = ev.target.closest('button, a[data-accion]'); if (!b || b.disabled) return; const c = porId(E.sel);
  if (b.dataset.g) { const prim = CALC.find(x => x.g === b.dataset.g); if (prim && c.g !== b.dataset.g) seleccionar((E.ult && E.ult[b.dataset.g]) || prim.id); return; }
  if (b.dataset.c) { E.ult = E.ult || {}; E.ult[porId(b.dataset.c).g] = b.dataset.c; seleccionar(b.dataset.c); return; }
  if (b.dataset.op) { const f = c.campos.find(x => x.k === b.dataset.op); fijar(c, f, f.ops[Number(b.dataset.i)][0]); return; }
  if (b.dataset.vista) { const L = vistasDe(R), cur = eleccion(c, L).map(x => x.k); cur[Number(b.dataset.vista)] = b.dataset.k; V.vis[c.id] = cur; pinta(); return; }
  if (b.dataset.flecha) { const f = c.campos.find(x => x.k === b.dataset.k), v = valores(c), dec = (String(f.paso).split('.')[1] || '').length, n = Math.min(f.max, Math.max(f.min, Number((v[f.k] + Number(b.dataset.flecha) * f.paso).toFixed(Math.max(dec, 0))))); v[f.k] = n; pinta(); return; }
  const a = b.dataset.accion;
  if (a === 'inicio') { ev.preventDefault(); E = { sel: 'spl', vals: {} }; V.vis = {}; pinta(); return; }
  if (a === 'idioma') { fijarIdioma(IDIOMAS[(IDIOMAS.indexOf(idioma()) + 1) % IDIOMAS.length]); marco(); return; }
  if (a === 'tema') { V.tema = V.tema === 'claro' ? 'oscuro' : 'claro'; document.documentElement.dataset.tema = V.tema; guardar(); return; }
  if (a === 'reset') { delete E.vals[c.id]; pinta(); return; }
  if (a === 'calc') { pinta(); const p = $('.f-hm .pri'); p.classList.remove('pulso'); void p.offsetWidth; p.classList.add('pulso'); const r = $('[data-blk="M3A"]'); if (r && matchMedia('(max-width: 900px), (max-height: 520px)').matches) r.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (a === 'tap') { const t = performance.now(); if (taps.length && t - taps[taps.length - 1] > 2500) taps.length = 0; taps.push(t); if (taps.length > 8) taps.shift();
    if (taps.length >= 2) { const f = c.campos.find(x => x.k === c.tap), bpm = Math.round(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1)) * 10) / 10; valores(c)[f.k] = Math.min(f.max, Math.max(f.min, bpm)); pinta(); } return; }
});
// al teclear se recalcula sin repintar el bloque de datos (para no perder el cursor): solo cifras y vistas
document.addEventListener('input', (ev) => {
  const i = ev.target; if (!i.dataset || !i.dataset.k || i.tagName !== 'INPUT') return; const c = porId(E.sel), f = c.campos.find(x => x.k === i.dataset.k); if (!f) return;
  const n = parseFloat(String(i.value).replace(',', '.')); if (isNaN(n)) return; valores(c)[f.k] = Math.min(f.max, Math.max(f.min, n));
  const k = i.dataset.k, ini = i.selectionStart; pinta(); const j = $(`input[data-k="${k}"]`); if (j) { j.focus(); j.value = i.value; try { j.setSelectionRange(ini, ini); } catch (e) {} }
});
document.addEventListener('change', (ev) => {
  const s = ev.target, c = porId(E.sel);
  if (s.dataset.ksel) { const f = c.campos.find(x => x.k === s.dataset.ksel); fijar(c, f, f.ops[Number(s.value)][0]); return; }
  if (s.dataset.k && s.tagName === 'INPUT') { const f = c.campos.find(x => x.k === s.dataset.k); if (f) s.value = valores(c)[f.k]; }
});
addEventListener('resize', () => requestAnimationFrame(ajusta));

fijarIdioma(idiomaInicial());
marco();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajusta);
window.__sb = { get E() { return E; }, get R() { return R; }, CALC, seleccionar };
