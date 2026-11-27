// SYSTEMS · simulación a escala de displays (v2.8), heredada de la de SCREENS (vista/una-led.js): la pared con su textura a escala real,
// el suelo, la persona de 1,75 m, las pantallas a su tamaño real con la carta de ajuste o el contenido que elijas (fuentes de prueba,
// YouTube, Vimeo, una imagen o un vídeo, o un archivo tuyo) y la foto oficial del modelo, que abre su ficha. GPL-3.0 · mediaservi.com
import { T, esc, textos, lee, guarda, lang } from './util.js';
import { figuraSVG } from './figura.js';
import { frenteSVG } from './cuerpos.js';

textos({
  'A escala': ['To scale', 'A escala'], 'Simulación a escala': ['Simulation to scale', 'Simulació a escala'],
  'Contenido': ['Content', 'Contingut'], 'Contenido de la pantalla': ['Screen content', 'Contingut de la pantalla'], 'Pared': ['Wall', 'Paret'],
  'Hormigón': ['Concrete', 'Formigó'], 'Madera': ['Wood', 'Fusta'], 'Mármol': ['Marble', 'Marbre'], 'Ladrillo rojo': ['Red brick', 'Maó vermell'], 'Ladrillo oscuro': ['Dark brick', 'Maó fosc'], 'Ladrillo claro': ['Light brick', 'Maó clar'], 'Sin pared': ['No wall', 'Sense paret'],
  'Fuentes multimedia de prueba': ['Test media sources', 'Fonts multimèdia de prova'], 'Carta de ajuste': ['Test card', 'Carta d\'ajust'],
  'O usa tu propio contenido': ['Or use your own content', 'O fes servir el teu contingut'], 'Pega un enlace de YouTube, Vimeo, imagen o vídeo': ['Paste a YouTube, Vimeo, image or video link', 'Enganxa un enllaç de YouTube, Vimeo, imatge o vídeo'],
  'Subir imagen / vídeo': ['Upload image / video', 'Pujar imatge / vídeo'], 'Aplicar': ['Apply', 'Aplicar'], 'Reiniciar': ['Reset', 'Reiniciar'], 'Cerrar': ['Close', 'Tancar'],
  'Contenido de prueba': ['Test content', 'Contingut de prova'], 'Foto del fabricante': ['Manufacturer photo', 'Foto del fabricant'], 'Ver la ficha': ['See the datasheet', 'Veure la fitxa'],
  'La foto propia se queda solo en este navegador.': ['Your own file stays only in this browser.', 'El fitxer propi es queda només en aquest navegador.'],
  'Simulación de las pantallas a escala con una persona de 1,75 m': ['Simulation of the screens to scale with a 1.75 m person', 'Simulació de les pantalles a escala amb una persona d\'1,75 m']
});

/* textura de la pared: medida real (ancho × alto en metros) de lo que abarca cada imagen, como en SCREENS; [2] = repetir en espejo */
const PARED = { hormigon: [3.6, 2.39, 1], madera: [2.4, 3.0], marmol: [2.4, 2.4], 'ladrillo-rojo': [1, 0.64], 'ladrillo-oscuro': [1, 0.912], 'ladrillo-claro': [1, 0.64] };
const SUELO = { hormigon: '#bfe6d8', madera: '#bcd9f2', marmol: '#f2c9d4', 'ladrillo-rojo': '#c7e8c0', 'ladrillo-oscuro': '#f3e3a8', 'ladrillo-claro': '#c9c6f0', ninguno: '#cfd3da' };
const FONDOS = [['hormigon', 'Hormigón'], ['madera', 'Madera'], ['marmol', 'Mármol'], ['ladrillo-rojo', 'Ladrillo rojo'], ['ladrillo-oscuro', 'Ladrillo oscuro'], ['ladrillo-claro', 'Ladrillo claro'], ['ninguno', 'Sin pared']];
const CARTA = 'assets/SCCHART.jpg';
/* v2.9 · fuente de prueba: solo el vídeo de mediaservi, recortado (del primer cambio de imagen, 4 s, a antes de «Suscribirse», 33 s) y en bucle;
   lo demás, con «O usa tu propio contenido» (enlace o archivo) */
const MS_VID = 'vKN4AcGz7zs', MS_INI = 4, MS_FIN = 33;
const YT = '&autoplay=1&mute=1&playsinline=1&rel=0&controls=0&disablekb=1&fs=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&showinfo=0&loop=1';
const MS_URL = () => `https://www.youtube.com/embed/${MS_VID}?start=${MS_INI}&end=${MS_FIN}&autoplay=1&mute=1&playsinline=1&rel=0&controls=0&disablekb=1&fs=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
/* el bucle recortado: el reproductor avisa (API de YouTube por mensajes) y al llegar al final vuelve al principio del recorte */
const ytMsg = (f, cmd, args) => { try { f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: args || [] }), '*'); } catch (e) {} };
window.addEventListener('message', (e) => {
  if (!/youtube\.com$/.test(new URL(e.origin || 'http://x').hostname)) return; let d; try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (er) { return; }
  const f = [...document.querySelectorAll('iframe[data-ms-bucle]')].find((x) => x.contentWindow === e.source); if (!f || !d) return;
  const st = d.info && typeof d.info === 'object' ? d.info.playerState : d.event === 'onStateChange' ? d.info : undefined;
  const t = d.info && typeof d.info === 'object' ? d.info.currentTime : undefined;
  if (st === 0 || (typeof t === 'number' && t >= MS_FIN - 0.15)) { ytMsg(f, 'seekTo', [MS_INI, true]); ytMsg(f, 'playVideo'); }
});
document.addEventListener('load', (e) => { const f = e.target; if (f && f.tagName === 'IFRAME' && f.hasAttribute('data-ms-bucle')) { try { f.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 'ms' }), '*'); } catch (er) {} } }, true);
const E = Object.assign({ fondo: 'hormigon' }, lee('systems_sim') || {});
let CONT = null, FSEL = -1, URLP = '';   /* CONT: { url, tipo: 'img' | 'video' | 'marco' }; null = carta de ajuste */

function deEnlace(u) {
  u = String(u || '').trim(); if (!u) return null; if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|#|$)/i.test(u)) return { url: u, tipo: 'img' };
  if (/\.(mp4|webm|ogv|mov|m4v)(\?|#|$)/i.test(u)) return { url: u, tipo: 'video' };
  const li = u.match(/youtube\.com\/(?:playlist|watch)\?[^\s]*list=([A-Za-z0-9_-]+)/), vl = u.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (li && vl) return { url: `https://www.youtube.com/embed/${vl[1]}?list=${li[1]}${YT}`, tipo: 'marco' };
  if (li) return { url: `https://www.youtube.com/embed/videoseries?list=${li[1]}${YT}`, tipo: 'marco' };
  const y = u.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (y) return { url: `https://www.youtube.com/embed/${y[1]}?playlist=${y[1]}${YT}`, tipo: 'marco' };
  const vm = u.match(/vimeo\.com\/(?:.*\/)?(\d+)/); if (vm) return { url: `https://player.vimeo.com/video/${vm[1]}?autoplay=1&muted=1&loop=1&controls=0&background=1`, tipo: 'marco' };
  return { url: u, tipo: 'marco' };
}
const suelta = () => { if (CONT && /^blob:/.test(CONT.url)) URL.revokeObjectURL(CONT.url); };
/* para la simulación 3D: la imagen que va en la pantalla (los vídeos y reproductores no se pueden pegar en 3D: carta de ajuste) */
export const tex3D = () => (CONT && CONT.tipo === 'img' ? CONT.url : CARTA);

/* contenido dentro de un rectángulo (px): imagen, vídeo o reproductor incrustado, recortado al rectángulo */
function pinta(x, y, w, h, id) {
  if (CONT && CONT.tipo === 'marco') { const e = Math.max(w / 16, h / 9), iw = 16 * e, ih = 9 * e;
    return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;overflow:hidden;position:relative;background:#000"><iframe src="${esc(CONT.url)}"${CONT.bucle ? ' data-ms-bucle' : ''} title="${esc(T('Contenido'))}" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;left:${(w - iw) / 2}px;top:${(h - ih) / 2}px;width:${iw}px;height:${ih}px;border:0;pointer-events:none"></iframe></div></foreignObject>`; }
  if (CONT && CONT.tipo === 'video') return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><video xmlns="http://www.w3.org/1999/xhtml" src="${esc(CONT.url)}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;display:block;background:#000"></video></foreignObject>`;
  return `<image href="${esc(CONT ? CONT.url : CARTA)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
}

/* la simulación: G = { paneles: [{ x, y, w, h }] en metros (x desde la izquierda, y = borde de abajo), marco (m), W, H, base,
   totem, vw (videowall: un solo contenido para todo el muro), etiqueta }; foto = { url, href, nombre } */
export function simEscala(G, foto, o = {}) {
  const VW = o.vertical ? 600 : 1000, VH = o.vertical ? 760 : 560, sueloY = VH - 54, arriba = 70;
  const xMin = -1.15, xMax = Math.max(G.W + 0.5, 1.6), alto = Math.max(2.05, G.base + G.H + 0.25);
  const k = Math.min((VW - 60) / (xMax - xMin), (sueloY - arriba) / alto), ox = (VW - (xMax - xMin) * k) / 2 - xMin * k;
  const X = (x) => ox + x * k, Y = (y) => sueloY - y * k;
  let g = `<svg class="sim-esc" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(T('Simulación de las pantallas a escala con una persona de 1,75 m'))}">`;
  const t = PARED[E.fondo];
  if (t) { const tw = t[0] * k, th = t[1] * k, u = `assets/sim/${E.fondo}.jpg`, im = (tr) => `<image href="${u}" width="${tw + 0.6}" height="${th + 0.6}" preserveAspectRatio="none"${tr ? ` transform="${tr}"` : ''}/>`;
    g += `<defs><pattern id="sim-pared" patternUnits="userSpaceOnUse" x="${X(0)}" y="${sueloY - th * (t[2] ? 2 : 1)}" width="${tw * (t[2] ? 2 : 1)}" height="${th * (t[2] ? 2 : 1)}">${t[2] ? im() + im(`translate(${2 * tw},0) scale(-1,1)`) + im(`translate(0,${2 * th}) scale(1,-1)`) + im(`translate(${2 * tw},${2 * th}) scale(-1,-1)`) : im()}</pattern></defs>`;
    g += `<rect x="-4000" y="-4000" width="9000" height="${4000 + sueloY}" fill="url(#sim-pared)"/>`; }
  else g += `<rect x="-4000" y="-4000" width="9000" height="${4000 + sueloY}" fill="#2a2b30"/>`;
  g += `<rect x="-4000" y="${sueloY}" width="9000" height="900" fill="${SUELO[E.fondo] || '#cfd3da'}"/><rect x="-4000" y="${sueloY}" width="9000" height="5" fill="#000" fill-opacity=".28"/>`;
  /* sombra suave detrás del conjunto */
  g += `<rect x="${X(-0.02)}" y="${Y(G.base + G.H + 0.02)}" width="${(G.W + 0.04) * k}" height="${(G.H + 0.04) * k}" fill="#000" fill-opacity=".28" rx="4" filter="blur(6px)" style="filter:blur(6px)"/>`;
  if (G.totem) { const tw = Math.min(G.W * 0.5, 0.36), tx = G.W / 2 - tw / 2; g += `<rect x="${X(tx)}" y="${Y(G.base)}" width="${tw * k}" height="${G.base * k}" fill="#1b1c20" stroke="#000"/><rect x="${X(G.W / 2 - 0.3)}" y="${Y(0.03)}" width="${0.6 * k}" height="${0.03 * k}" fill="#111215"/>`; }
  /* el contenido: en un videowall, uno solo para todo el muro, visto a través de los marcos */
  const id = 'sim-cp' + Math.random().toString(36).slice(2, 7), mk = Math.max(G.marco * k, 1.2);
  /* v2.9 · la ventana de imagen de cada panel: con cuerpo a medida real (vista/cuerpos.js), la de su ficha; si no, el marco común */
  const vent = (p) => (p.cu ? { x: p.x + p.cu.scr.x, y: p.y + p.cu.scr.y, w: p.cu.scr.w, h: p.cu.scr.h } : { x: p.x + G.marco, y: p.y + G.marco, w: p.w - 2 * G.marco, h: p.h - 2 * G.marco });
  let cp = ''; G.paneles.forEach((p) => { const v = vent(p); cp += `<rect x="${X(v.x)}" y="${Y(v.y + v.h)}" width="${Math.max(1, v.w * k)}" height="${Math.max(1, v.h * k)}"/>`; });
  g += `<defs><clipPath id="${id}">${cp}</clipPath></defs>`;
  G.paneles.forEach((p) => { g += p.cu ? frenteSVG(p.cu, X, Y, k, p.x, p.y) : `<rect x="${X(p.x)}" y="${Y(p.y + p.h)}" width="${p.w * k}" height="${p.h * k}" rx="${Math.min(4, mk)}" fill="#0b0b0d" stroke="#2c2d33" stroke-width="1"/>`; });
  if (G.vw) g += `<g clip-path="url(#${id})">${pinta(X(0), Y(G.base + G.H), G.W * k, G.H * k, id)}</g>`;
  else G.paneles.forEach((p, i) => { const iid = id + 'p' + i, v = vent(p); g += `<defs><clipPath id="${iid}"><rect x="${X(v.x)}" y="${Y(v.y + v.h)}" width="${v.w * k}" height="${v.h * k}"/></clipPath></defs><g clip-path="url(#${iid})">${pinta(X(v.x), Y(v.y + v.h), v.w * k, v.h * k, iid)}</g>`; });
  /* reflejo del cristal */
  G.paneles.forEach((p) => { const v = vent(p); g += `<rect x="${X(v.x)}" y="${Y(v.y + v.h)}" width="${v.w * k}" height="${v.h * k * 0.45}" fill="#fff" fill-opacity=".035" pointer-events="none"/>`; });
  /* otros equipos a escala (barra de vídeo, cámara…): rectángulos oscuros con su nombre */
  (G.extras || []).forEach((q) => { g += `<rect x="${X(q.x)}" y="${Y(q.y + q.h)}" width="${q.w * k}" height="${Math.max(3, q.h * k)}" rx="${Math.min(6, q.h * k / 2)}" fill="${q.fill || '#18191d'}" stroke="#000" stroke-opacity=".6"/>`
    + (q.txt ? `<text x="${X(q.x + q.w / 2)}" y="${Y(q.y + q.h) - 6}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" stroke="#000" stroke-opacity=".7" stroke-width="2.6" paint-order="stroke" font-family="Inter, sans-serif">${esc(q.txt)}</text>` : ''); });
  /* persona de 1,75 m */
  const hx = -0.62, fig = figuraSVG(X(hx), sueloY, k, /marmol|claro/.test(E.fondo) ? 'fill="#3f4149" fill-opacity=".9"' : 'fill="#d5d5db" fill-opacity=".92" stroke="#1c1d22" stroke-opacity=".6" stroke-width="1.5" vector-effect="non-scaling-stroke"');
  g += fig + `<text x="${X(hx)}" y="${sueloY + 20}" text-anchor="middle" font-size="13" font-weight="700" fill="#1c1d22" font-family="Inter, sans-serif">1,75 m</text>`;
  /* cotas en azul, como en SCREENS */
  const cm = (v) => (Math.round(v * 100)).toLocaleString(lang() === 'en' ? 'en-GB' : 'es-ES') + ' cm';
  const cota = (x1, y1, x2, y2, txt, vert) => { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, tw = txt.length * 8.6 + 16; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#37c8ff" stroke-width="1.6" stroke-dasharray="5 4"/><g transform="translate(${mx},${my})${vert ? ' rotate(90)' : ''}"><rect x="${-tw / 2}" y="-11" width="${tw}" height="22" rx="5" fill="#0e1f2a" fill-opacity=".9"/><text x="0" y="5" text-anchor="middle" font-size="13" fill="#bdeeff" font-family="Share Tech Mono, monospace">${esc(txt)}</text></g>`; };
  const top = Y(G.base + G.H);
  g += cota(X(0), top - 22, X(G.W), top - 22, cm(G.W));
  g += cota(X(G.W) + 24, top, X(G.W) + 24, Y(G.base), cm(G.H), true);
  if (G.base > 0.05) g += cota(X(G.W) + 52, Y(G.base), X(G.W) + 52, sueloY, cm(G.base), true);
  if (G.etiqueta) g += `<text x="${X(G.W / 2)}" y="${sueloY + 34}" text-anchor="middle" font-size="15" font-weight="800" fill="#1c1d22" font-family="Inter, sans-serif">${esc(G.etiqueta)}</text>`;
  g += '</svg>';
  /* la foto oficial del modelo (abre su ficha) y los mandos de pared y contenido, encima del dibujo */
  const fts = [].concat(foto || []).filter((f) => f && f.url);
  const ft = fts.length ? `<div class="sim-fotos">${fts.map((f) => `<a class="sim-foto" href="${esc(f.href)}" target="_blank" rel="noopener" title="${esc(T('Ver la ficha'))}"><img src="${esc(f.url)}" alt="${esc(f.nombre || '')}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.sim-foto').remove()"><span>${esc(f.nombre || '')}</span><small>${esc(T('Foto del fabricante'))}</small></a>`).join('')}</div>` : '';
  const mandos = `<div class="sim-mandos"><label class="sim-sel"><span>${esc(T('Pared'))}</span><select data-sim-fondo aria-label="${esc(T('Pared'))}">${FONDOS.map((f) => `<option value="${f[0]}"${f[0] === E.fondo ? ' selected' : ''}>${esc(T(f[1]))}</option>`).join('')}</select></label><button type="button" class="tog sim-cont" data-acc="sim:contenido"><span>${esc(T('Contenido'))}</span></button></div>`;
  return `<div class="sim-caja">${g}${ft}${mandos}</div>`;
}

/* la ventana de contenido (la de SCREENS): fuentes de prueba, un enlace o un archivo propio */
function ventana() {
  cierra();
  const v = document.createElement('div'); v.className = 'sim-velo'; v.id = 'sim-velo';
  const L = [['carta', T('Carta de ajuste'), ''], ['ms', 'mediaservi', 'YouTube · ' + MS_VID]];
  v.innerHTML = `<div class="vent ajustes" role="dialog" aria-modal="true" aria-label="${esc(T('Contenido de la pantalla'))}"><div class="vent-cab">${esc(T('Contenido de la pantalla'))}<span class="sep"></span><button type="button" class="tog" data-sim-x>${esc(T('Cerrar'))}</button></div><div class="vent-cu sim-vcu">
    <p class="sub-t">${esc(T('Contenido de prueba'))}</p>
    <div class="fila envuelve sim-fuentes">${L.map((f, i) => `<button type="button" class="tog" aria-pressed="${(i === 0 && !CONT) || FSEL === i}" data-sim-fu="${i}" title="${esc(f[2])}"><span>${esc(f[1])}</span></button>`).join('')}</div>
    <p class="sub-t">${esc(T('O usa tu propio contenido'))}</p>
    <div class="fila"><input type="url" class="pide" id="sim-url" value="${esc(URLP)}" placeholder="${esc(T('Pega un enlace de YouTube, Vimeo, imagen o vídeo'))}"><button type="button" class="tog" data-sim-sube style="flex:none"><span>${esc(T('Subir imagen / vídeo'))}</span></button><input type="file" id="sim-file" accept="image/*,video/*" hidden></div>
    <p class="sim-nota">${esc(T('La foto propia se queda solo en este navegador.'))}</p>
    <div class="fila"><button type="button" class="calcular" data-sim-aplica>${esc(T('Aplicar'))}</button><button type="button" class="tog" data-sim-reinicia><span>${esc(T('Reiniciar'))}</span></button></div>
    <button type="button" data-acc="sim:nada" hidden></button></div></div>`;
  document.body.appendChild(v); requestAnimationFrame(() => v.classList.add('on'));
}
function cierra() { const v = document.getElementById('sim-velo'); if (v) v.remove(); }
const repinta = () => { const b = document.querySelector('#sim-velo [data-acc="sim:nada"]') || Object.assign(document.createElement('button'), { hidden: true }); if (!b.isConnected) { b.dataset.acc = 'sim:nada'; document.body.appendChild(b); } b.click(); if (!b.closest('#sim-velo')) b.remove(); cierra(); };
document.addEventListener('click', (e) => {
  const q = (s) => e.target.closest && e.target.closest(s); let b;
  if (q('[data-sim-x]') || (e.target.id === 'sim-velo')) { cierra(); return; }
  if ((b = q('[data-sim-fu]'))) { const i = +b.dataset.simFu; suelta(); URLP = ''; FSEL = i; CONT = i === 0 ? null : { url: MS_URL(), tipo: 'marco', bucle: true }; repinta(); return; }
  if (q('[data-sim-sube]')) { const f = document.getElementById('sim-file'); if (f) f.click(); return; }
  if (q('[data-sim-aplica]')) { const i = document.getElementById('sim-url'); URLP = i ? i.value.trim() : ''; if (URLP) { suelta(); CONT = deEnlace(URLP); FSEL = -1; } repinta(); return; }
  if (q('[data-sim-reinicia]')) { suelta(); CONT = null; FSEL = -1; URLP = ''; repinta(); return; }
});
document.addEventListener('change', (e) => {
  if (e.target.id === 'sim-file' && e.target.files && e.target.files[0]) { const f = e.target.files[0]; suelta(); CONT = { url: URL.createObjectURL(f), tipo: /^video\//.test(f.type) ? 'video' : 'img' }; FSEL = -1; repinta(); return; }
  if (e.target.matches && e.target.matches('[data-sim-fondo]')) { E.fondo = e.target.value; guarda('systems_sim', E); const b = document.createElement('button'); b.dataset.acc = 'sim:nada'; b.hidden = true; document.body.appendChild(b); b.click(); b.remove(); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.getElementById('sim-velo')) cierra(); });
/* acciones que llegan por data-acc (casa.js repinta después) */
export function accionSim(a) { if (a === 'sim:contenido') { ventana(); return true; } if (a === 'sim:nada') return true; return false; }
