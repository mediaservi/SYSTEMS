// SYSTEMS · simulación a escala de displays (v2.8), heredada de la de SCREENS (vista/una-led.js): la pared con su textura a escala real,
// el suelo, la persona de 1,75 m, las pantallas a su tamaño real con la carta de ajuste o el contenido que elijas (fuentes de prueba,
// YouTube, Vimeo, una imagen o un vídeo, o un archivo tuyo) y la foto oficial del modelo, que abre su ficha. GPL-3.0 · mediaservi.com
import { T, esc, textos, lee, guarda, lang } from './util.js';
import { figuraSVG } from './figura.js';
import { frenteSVG } from './cuerpos.js';

textos({
  /* v3.6 · personalizar la simulación sin ventana */
  'Cemento': ['Concrete', 'Ciment'], 'Ladrillos': ['Bricks', 'Maons'], 'Ladrillo oscuro': ['Dark brick', 'Maó fosc'], 'Ladrillo claro': ['Light brick', 'Maó clar'], 'Color de los ladrillos': ['Brick colour', 'Color dels maons'],
  'Vídeo de prueba de mediaservi.com, en bucle': ['mediaservi.com test video, looped', 'Vídeo de prova de mediaservi.com, en bucle'], 'VÍDEO': ['VIDEO', 'VÍDEO'],
  'Tu contenido: sube un vídeo o una foto, o pega un enlace': ['Your content: upload a video or a photo, or paste a link', 'El teu contingut: puja un vídeo o una foto, o enganxa un enllaç'],
  'Pared propia: sube una foto o pega un enlace': ['Your own wall: upload a photo or paste a link', 'Paret pròpia: puja una foto o enganxa un enllaç'],
  'Altura del borde inferior de la pantalla sobre el suelo': ['Height of the bottom edge of the screen above the floor', 'Alçada de la vora inferior de la pantalla sobre el terra'],
  'Elevación desde el suelo': ['Height from the floor', 'Elevació des del terra'], 'Bajar la pantalla 10 cm': ['Lower the screen 10 cm', 'Baixar la pantalla 10 cm'], 'Subir la pantalla 10 cm': ['Raise the screen 10 cm', 'Pujar la pantalla 10 cm'],
  'Pared propia': ['Your own wall', 'Paret pròpia'], 'Tu contenido': ['Your content', 'El teu contingut'], 'Pega el enlace de una imagen': ['Paste the link of an image', 'Enganxa l\'enllaç d\'una imatge'],
  'Subir una foto': ['Upload a photo', 'Pujar una foto'], 'La foto de la pared se queda solo en este navegador.': ['The wall photo stays only in this browser.', 'La foto de la paret es queda només en aquest navegador.'], 'Quitar': ['Remove', 'Treure'],
  'A escala': ['To scale', 'A escala'], 'Simulación a escala': ['Simulation to scale', 'Simulació a escala'],
  'Contenido': ['Content', 'Contingut'], 'Contenido de la pantalla': ['Screen content', 'Contingut de la pantalla'], 'Pared': ['Wall', 'Paret'],
  'Hormigón': ['Concrete', 'Formigó'], 'Madera': ['Wood', 'Fusta'], 'Mármol': ['Marble', 'Marbre'], 'Ladrillo rojo': ['Red brick', 'Maó vermell'], 'Ladrillo oscuro': ['Dark brick', 'Maó fosc'], 'Ladrillo claro': ['Light brick', 'Maó clar'], 'Sin pared': ['No wall', 'Sense paret'],
  'Fuentes multimedia de prueba': ['Test media sources', 'Fonts multimèdia de prova'], 'Carta de ajuste': ['Test card', 'Carta d\'ajust'],
  'O usa tu propio contenido': ['Or use your own content', 'O fes servir el teu contingut'], 'Pega un enlace de YouTube, Vimeo, imagen o vídeo': ['Paste a YouTube, Vimeo, image or video link', 'Enganxa un enllaç de YouTube, Vimeo, imatge o vídeo'],
  'Subir imagen / vídeo': ['Upload image / video', 'Pujar imatge / vídeo'], 'Aplicar': ['Apply', 'Aplicar'], 'Reiniciar': ['Reset', 'Reiniciar'], 'Cerrar': ['Close', 'Tancar'],
  'Contenido de prueba': ['Test content', 'Contingut de prova'], 'PANTALLA': ['SCREEN', 'PANTALLA'], 'PANTALLAS': ['SCREENS', 'PANTALLES'], 'Distancia visionado': ['Viewing distance', 'Distància de visió'], 'Mínima': ['Min.', 'Mínima'], 'Óptima': ['Optimal', 'Òptima'], 'Resolución en la ficha': ['Resolution: see datasheet', 'Resolució a la fitxa'], 'Foto del fabricante': ['Manufacturer photo', 'Foto del fabricant'], 'Ver la ficha': ['See the datasheet', 'Veure la fitxa'],
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
const MS_URL = () => `https://www.youtube.com/embed/${MS_VID}?start=${MS_INI}&end=${MS_FIN}&autoplay=1&mute=1&playsinline=1&rel=0&controls=0&disablekb=1&fs=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
/* el bucle recortado: el reproductor avisa (API de YouTube por mensajes) y al llegar al final vuelve al principio del recorte */
const ytMsg = (f, cmd, args) => { try { f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd, args: args || [] }), '*'); } catch (e) {} };
window.addEventListener('message', (e) => {
  if (!/youtube\.com$/.test(new URL(e.origin || 'http://x').hostname)) return; let d; try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (er) { return; }
  const f = [...document.querySelectorAll('iframe[data-ms-bucle]')].find((x) => x.contentWindow === e.source); if (!f || !d) return;
  const st = d.info && typeof d.info === 'object' ? d.info.playerState : d.event === 'onStateChange' ? d.info : undefined;
  const t = d.info && typeof d.info === 'object' ? d.info.currentTime : undefined;
  if (st === 0 || (typeof t === 'number' && t >= MS_FIN - 0.15)) { ytMsg(f, 'seekTo', [MS_INI, true]); ytMsg(f, 'playVideo'); }
  /* sin subtítulos: la traducción automática queda mal (aunque el navegador los tenga activados en YouTube) */
  if (!f.dataset.sinSubs || st === 1) { f.dataset.sinSubs = '1'; ytMsg(f, 'unloadModule', ['captions']); ytMsg(f, 'unloadModule', ['cc']); }
});
document.addEventListener('load', (e) => { const f = e.target; if (f && f.tagName === 'IFRAME' && f.hasAttribute('data-ms-bucle')) { try { f.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 'ms' }), '*'); } catch (er) {} } }, true);
const E = Object.assign({ fondo: 'hormigon' }, lee('systems_sim') || {});
let CONT = null, FSEL = -1, URLP = '';   /* CONT: { url, tipo: 'img' | 'video' | 'marco' | 'carta' }; null = la foto del fabricante (v3.3) o, sin foto, la carta de ajuste */
let FC = null;
/* v3.6 · personalizar la simulación sin ventana (como SCREENS v11.64-65): ELEVACIÓN arriba a la derecha y, debajo, CONTENIDO y PARED */
const LADR = ['ladrillo-rojo', 'ladrillo-oscuro', 'ladrillo-claro'];
const ICSUBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3.5"/><path d="m7.5 8 4.5-4.5L16.5 8"/><path d="M4 13.5v4.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4.5"/></svg>';
const ICSUBE_P = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h14"/><path d="M12 20V8"/><path d="m7 13 5-5 5 5"/></svg>';
const ICBAJA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 20h14"/><path d="M12 4v12"/><path d="m7 11 5 5 5-5"/></svg>';
const FPROP_K = 'systems-fondo-propio';
let FPROP = (() => { try { return localStorage.getItem(FPROP_K) || ''; } catch (e) { return ''; } })();
if (E.fondo === 'propio' && !FPROP) E.fondo = 'hormigon';
if (!E.elev || typeof E.elev !== 'object') E.elev = {};
let ULT = { clave: '', base: 0 };   /* la última simulación pintada: de qué módulo y a qué altura */
/* la altura del borde de abajo de las pantallas: la que se haya elegido con las flechas o, si no, la del cálculo */
/* la elección vale mientras el cálculo no cambie de altura (otro sitio, otro modelo…): entonces vuelve la del cálculo */
const AUTO = {};
export const elevDe = (clave, auto) => { AUTO[clave] = auto; const o = E.elev[clave]; return o && typeof o === 'object' && o.a === Math.round(auto * 100) ? o.cm / 100 : auto; };   /* v3.3 · la foto oficial del display que se simula: { url, rec } (rec de comun/fotorec.js: la pantalla dentro de la foto) */

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
  /* v3.3 · por defecto, lo que el fabricante enseña en la pantalla de su foto oficial: el recorte de la imagen activa si la foto es frontal,
     y si no, la foto entera; cambia sola al cambiar de modelo */
  if (!CONT && FC && FC.url) { const r = FC.rec;
    if (r) return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${(r[2] * r[0]).toFixed(1)} ${(r[3] * r[1]).toFixed(1)} ${(r[4] * r[0]).toFixed(1)} ${(r[5] * r[1]).toFixed(1)}" preserveAspectRatio="xMidYMid slice"><image href="${esc(FC.url)}" width="${r[0]}" height="${r[1]}"/></svg>`;
    return `<image href="${esc(FC.url)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`; }
  if (CONT && CONT.tipo === 'carta') return `<image href="${CARTA}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
  if (CONT && CONT.tipo === 'marco') { const e = Math.max(w / 16, h / 9), iw = 16 * e, ih = 9 * e;
    return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;overflow:hidden;position:relative;background:#000"><iframe src="${esc(CONT.url)}"${CONT.bucle ? ' data-ms-bucle' : ''} title="${esc(T('Contenido'))}" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;left:${(w - iw) / 2}px;top:${(h - ih) / 2}px;width:${iw}px;height:${ih}px;border:0;pointer-events:none"></iframe></div></foreignObject>`; }
  if (CONT && CONT.tipo === 'video') return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><video xmlns="http://www.w3.org/1999/xhtml" src="${esc(CONT.url)}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;display:block;background:#000"></video></foreignObject>`;
  return `<image href="${esc(CONT ? CONT.url : CARTA)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
}

/* la simulación: G = { paneles: [{ x, y, w, h }] en metros (x desde la izquierda, y = borde de abajo), marco (m), W, H, base,
   totem, vw (videowall: un solo contenido para todo el muro), etiqueta }; foto = { url, href, nombre } */
/* v3.3 · los cuadros de datos de SCREENS a la izquierda, dentro del dibujo: resolución, resumen (pantallas, pulgadas, ancho y alto)
   y distancia de visionado (mínima = 1 m por mm de píxel; óptima, el triple, como en SCREENS) */
const RES = { UHD: [3840, 2160, '4K', 'ULTRA HD'], FHD: [1920, 1080, 'FHD', 'FULL HD'], '5K': [5120, 2160, '5K', '5K2K'] };
function cajas(G, sk) {
  const d = G.disp; if (!d) return '';
  const LIMA = '#d4ff00', mono = 'font-family="Share Tech Mono, monospace"', X = 16, AN = 218, caja = (y, al) => `<rect x="${X}" y="${y}" width="${AN}" height="${al}" rx="9" fill="#17181c" fill-opacity=".93" stroke="#000" stroke-width="1.5"/>`;
  const nf = (v) => Math.round(v).toLocaleString(lang() === 'en' ? 'en-GB' : 'es-ES');
  const rs = RES[String(d.res || '').toUpperCase()], vert = G.vertical, rw = rs ? (vert ? rs[1] : rs[0]) : 0, rh = rs ? (vert ? rs[0] : rs[1]) : 0;
  const cu = G.paneles[0] && G.paneles[0].cu, aw = cu ? cu.scr.w : G.paneles[0] ? G.paneles[0].w : 0, pitch = rw && aw ? aw / rw * 1000 : 0;
  let y = 12, g = `<g transform="scale(${sk})">`;
  g += caja(y, 156) + `<rect x="${X + 34}" y="${y + 12}" width="${AN - 68}" height="80" rx="7" fill="#050506" stroke="${LIMA}" stroke-opacity=".7" stroke-width="1.5"/>`
    + (rs ? `<text x="${X + AN / 2}" y="${y + 50}" text-anchor="middle" font-size="34" fill="${LIMA}" ${mono}>${rs[2]}</text><text x="${X + AN / 2}" y="${y + 80}" text-anchor="middle" font-size="20" fill="#fff" ${mono}>${rs[3]}</text><text x="${X + AN / 2}" y="${y + 118}" text-anchor="middle" font-size="22" fill="#fff" ${mono}>${rw}x${rh}</text><text x="${X + AN / 2}" y="${y + 143}" text-anchor="middle" font-size="19" fill="#fff" ${mono}>px</text>`
      : `<text x="${X + AN / 2}" y="${y + 62}" text-anchor="middle" font-size="34" fill="${LIMA}" ${mono}>${d.pulgadas || ''}″</text><text x="${X + AN / 2}" y="${y + 128}" text-anchor="middle" font-size="17" fill="#fff" ${mono}>${esc(T('Resolución en la ficha'))}</text>`);
  y += 168; const fila = (n, ic, t) => `<g transform="translate(${X + 18},${y + 16 + n * 30})" fill="none" stroke="${LIMA}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic}</g><text x="${X + 50}" y="${y + 33 + n * 30}" font-size="21" fill="#fff" ${mono}>${esc(t)}</text>`;
  const n = G.n || G.paneles.length;
  g += caja(y, 140) + fila(0, '<rect x="1" y="1" width="7" height="7" rx="1"/><rect x="12" y="1" width="7" height="7" rx="1"/><rect x="1" y="12" width="7" height="7" rx="1"/><rect x="12" y="12" width="7" height="7" rx="1"/>', (G.cols || n) + 'x' + (G.filas || 1))
    + fila(1, `<circle cx="10" cy="10" r="6" fill="${LIMA}"/>`, (d.pulgadas || '') + '″') + fila(2, '<path d="M1 10h18M5 6l-4 4 4 4M15 6l4 4-4 4"/>', nf((G.vw ? G.W : G.paneles[0].w) * 100) + 'cm') + fila(3, '<path d="M10 1v18M6 5l4-4 4 4M6 15l4 4 4-4"/>', nf((G.vw ? G.H : G.paneles[0].h) * 100) + 'cm')
    + `<text x="${X + AN - 46}" y="${y + 74}" text-anchor="middle" font-size="44" fill="${LIMA}" ${mono}>${n}</text><text x="${X + AN - 46}" y="${y + 98}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#b9bbc4" font-family="Inter, sans-serif" letter-spacing=".5">${esc(T(n === 1 ? 'PANTALLA' : 'PANTALLAS'))}</text>`;
  if (pitch) { y += 152; const cm = (v) => (v < 1 ? nf(v * 100) + 'cm' : (Math.round(v * 10) / 10).toLocaleString(lang() === 'en' ? 'en-GB' : 'es-ES') + 'm'), mn = pitch, op = pitch * 3, lin = T('Mínima') + ' ' + cm(mn) + ' ' + T('Óptima') + ' ' + cm(op);
    g += caja(y, 62) + `<g transform="translate(${X + 14},${y + 9}) scale(.8)" fill="none" stroke="${LIMA}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></g><text x="${X + 40}" y="${y + 24}" font-size="15.5" fill="#fff" ${mono}>${esc(T('Distancia visionado'))}</text><text x="${X + 14}" y="${y + 49}" font-size="${Math.min(15.5, (AN - 26) / (lin.length * .56)).toFixed(1)}" fill="#fff" ${mono}>${esc(lin)}</text>`; }
  return g + '</g>';
}
export function simEscala(G, foto, o = {}) {
  /* v3.3 · la foto oficial del display (la primera con id) es el contenido por defecto; ya no hay tarjeta de foto (el nombre del modelo, abajo, enlaza a la ficha) */
  const fd = [].concat(foto || []).find((f) => f && f.url && f.id); FC = fd ? { url: fd.url, rec: (globalThis.SC_FOTO_REC || {})[fd.id] || null } : null;
  const VW = o.vertical ? 600 : 1000, VH = o.vertical ? 760 : 560, sueloY = VH - 54, arriba = 70;
  /* v3.3 · con los cuadros de datos, la escena se corre a la derecha para dejarles su sitio */
  const SK = G.disp ? (o.vertical ? 0.8 : 1.1) : 0, CW = SK ? Math.ceil(246 * SK) : 0;
  const xMin = -1.15, xMax = Math.max(G.W + 0.5, 1.6), alto = Math.max(2.05, G.base + G.H + 0.25);
  const k = Math.min((VW - 60 - CW) / (xMax - xMin), (sueloY - arriba) / alto), ox = CW + (VW - CW - (xMax - xMin) * k) / 2 - xMin * k;
  const X = (x) => ox + x * k, Y = (y) => sueloY - y * k;
  let g = `<svg class="sim-esc" viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="${SK ? 'xMinYMax' : 'xMidYMax'} meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(T('Simulación de las pantallas a escala con una persona de 1,75 m'))}">`;
  const t = E.fondo === 'propio' ? null : PARED[E.fondo];
  if (E.fondo === 'propio' && FPROP) g += `<rect x="-4000" y="-4000" width="9000" height="${4000 + sueloY}" fill="#3a3b40"/><image href="${esc(FPROP)}" x="0" y="0" width="${VW}" height="${sueloY}" preserveAspectRatio="xMidYMid slice"/>`;   /* la foto propia cubre toda la pared (no tiene escala conocida) */
  else if (t) { const tw = t[0] * k, th = t[1] * k, u = `assets/sim/${E.fondo}.jpg`, im = (tr) => `<image href="${u}" width="${tw + 0.6}" height="${th + 0.6}" preserveAspectRatio="none"${tr ? ` transform="${tr}"` : ''}/>`;
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
  g += `<rect data-obs x="${X(0)}" y="${Y(G.base + G.H)}" width="${G.W * k}" height="${G.H * k}" fill="none" pointer-events="none"/>`;
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
  if (SK) g += cajas(G, SK);
  g += '</svg>';
  /* la foto oficial del modelo (abre su ficha) y los mandos de pared y contenido, encima del dibujo */
  const fts = [].concat(foto || []).filter((f) => f && f.url && !f.id && !G.disp);
  const ft = fts.length ? `<div class="sim-fotos">${fts.map((f) => `<a class="sim-foto" href="${esc(f.href)}" target="_blank" rel="noopener" title="${esc(T('Ver la ficha'))}"><img src="${esc(f.url)}" alt="${esc(f.nombre || '')}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.sim-foto').remove()"><span>${esc(f.nombre || '')}</span><small>${esc(T('Foto del fabricante'))}</small></a>`).join('')}</div>` : '';
  ULT = { clave: o.clave || '', base: G.base };
  return `<div class="sim-caja">${g}${ft}${simCtl(o.clave, G.base)}</div>`;
}

/* v3.6 · ELEVACIÓN (flechas técnicas, de 10 en 10 cm) y, debajo y al mismo ancho, CONTENIDO (foto del fabricante · carta · vídeo · propio)
   y PARED (cemento · madera · mármol · ladrillos · propia); con ladrillos, sus tres colores en círculos dentro del grupo. Nada de esto sale en capturas ni PDF */
function simCtl(clave, base) {
  const b = (attr, on, tit, estilo, cuerpo, cls = '') => `<button type="button" class="${cls}" ${attr} aria-pressed="${on}" aria-label="${esc(tit)}" title="${esc(tit)}"${estilo ? ` style="${estilo}"` : ''}>${cuerpo || ''}</button>`;
  const ck = CONT ? (CONT.tipo === 'carta' ? 'carta' : CONT.bucle ? 'video' : 'propio') : FC && FC.url ? 'foto' : 'carta', lad = LADR.includes(E.fondo), lv = lad ? E.fondo : LADR[0];
  const cont = (FC && FC.url ? b('data-acc="sim:cnt:foto"', ck === 'foto', T('Foto del fabricante'), `background-image:url(&quot;${esc(FC.url)}&quot;);background-color:#fff;background-size:contain`) : '')
    + b('data-acc="sim:cnt:carta"', ck === 'carta', T('Carta de ajuste'), 'background-image:url(assets/sim/carta-mini.jpg)')
    + b('data-acc="sim:cnt:video"', ck === 'video', T('Vídeo de prueba de mediaservi.com, en bucle'), `background-image:linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)),url(https://i.ytimg.com/vi/${MS_VID}/mqdefault.jpg)`, `<span class="sc-t">${esc(T('VÍDEO'))}</span>`)
    + b('data-acc="sim:cnt:propio"', ck === 'propio', T('Tu contenido: sube un vídeo o una foto, o pega un enlace'), '', ICSUBE, 'fo-ico');
  const NOM = { hormigon: 'Cemento', madera: 'Madera', marmol: 'Mármol', 'ladrillo-rojo': 'Ladrillo rojo', 'ladrillo-oscuro': 'Ladrillo oscuro', 'ladrillo-claro': 'Ladrillo claro' };
  const pared = ['hormigon', 'madera', 'marmol'].map((f) => b(`data-acc="sim:pared:${f}"`, E.fondo === f, T(NOM[f]), `background-image:url(assets/sim/${f}-mini.jpg)`)).join('')
    + (lad ? `<span class="lad3" role="group" aria-label="${esc(T('Color de los ladrillos'))}">${LADR.map((f) => b(`data-acc="sim:pared:${f}"`, E.fondo === f, T(NOM[f]), `background-image:url(assets/sim/${f}-mini.jpg)`)).join('')}</span>`
      : b(`data-acc="sim:pared:${lv}"`, false, T('Ladrillos'), `background-image:url(assets/sim/${lv}-mini.jpg)`))
    + b('data-acc="sim:pared:propio"', E.fondo === 'propio', T('Pared propia: sube una foto o pega un enlace'), FPROP ? `background-image:url(&quot;${esc(FPROP)}&quot;)` : '', FPROP ? '' : ICSUBE, 'fo-ico');
  const cm = Math.round(base * 100);
  const elev = clave ? `<div class="elev" role="group" aria-label="${esc(T('Altura del borde inferior de la pantalla sobre el suelo'))}"><span>${esc(T('Elevación desde el suelo'))}</span><button type="button" class="elev-fl" data-acc="sim:elev:-1" aria-label="${esc(T('Bajar la pantalla 10 cm'))}" title="${esc(T('Bajar la pantalla 10 cm'))}"${cm <= 0 ? ' disabled' : ''}>${ICBAJA}</button><b>${cm.toLocaleString(lang() === 'en' ? 'en-GB' : 'es-ES')} cm</b><button type="button" class="elev-fl" data-acc="sim:elev:1" aria-label="${esc(T('Subir la pantalla 10 cm'))}" title="${esc(T('Subir la pantalla 10 cm'))}"${cm >= 300 ? ' disabled' : ''}>${ICSUBE_P}</button></div>` : '';
  return `<div class="simctl">${elev}<div class="simcu"><div class="g" role="group" aria-label="${esc(T('Contenido de la pantalla'))}">${cont}</div><div class="g" role="group" aria-label="${esc(T('Pared'))}">${pared}</div></div></div>`;
}
/* v3.6 · los controles nunca pisan el dibujo (cuadros de datos, cotas, rótulos, las pantallas): se prueban tres disposiciones
   (en fila, en dos filas, compacta) y se queda la primera que no toca nada; si ninguna, se reducen hasta el 70 % */
export function ajustaSim() {
  document.querySelectorAll('.sim-caja > .simctl').forEach((sc) => {
    const cj = sc.parentElement, svg = cj.querySelector(':scope > svg'); if (!svg) return; const L = cj.getBoundingClientRect(); if (!L.width) return;
    const obs = [...svg.querySelectorAll('rect[rx], text, [data-obs]')].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 2 && r.height > 2 && r.width * r.height < L.width * L.height * .5 && r.right > L.left && r.left < L.right && r.bottom > L.top && r.top < L.bottom);
    const toca = () => [...sc.querySelectorAll(':scope > .elev, .simcu > .g')].some((c) => { const a = c.getBoundingClientRect(); return a.bottom > L.bottom - 2 || obs.some((o) => a.left < o.right - 1 && a.right > o.left + 1 && a.top < o.bottom - 1 && a.bottom > o.top + 1); });
    sc.style.transform = ''; for (const m of ['', 'apila', 'apila compacta']) { sc.className = 'simctl ' + m; if (!toca()) return; }
    for (const k of [0.9, 0.8, 0.7]) { sc.style.transform = `scale(${k})`; if (!toca()) return; }
  });
}
let AJ = 0; const ajLuego = () => { cancelAnimationFrame(AJ); AJ = requestAnimationFrame(() => { ajustaSim(); AJ = requestAnimationFrame(ajustaSim); }); };
new MutationObserver((ms) => { if (ms.some((m) => [...m.addedNodes].some((n) => n.nodeType === 1 && (n.matches('.sim-caja') || n.querySelector('.sim-caja'))))) ajLuego(); }).observe(document.documentElement, { childList: true, subtree: true });
addEventListener('resize', ajLuego);

/* la ventana pequeña del contenido propio o de la pared propia: un enlace o un archivo */
function ventana(que) {
  const pared = que === 'pared';
  cierra();
  const v = document.createElement('div'); v.className = 'sim-velo'; v.id = 'sim-velo';
  const tit = T(pared ? 'Pared propia' : 'Tu contenido');
  v.innerHTML = `<div class="vent ajustes sim-vpeq" role="dialog" aria-modal="true" aria-label="${esc(tit)}" data-que="${pared ? 'pared' : 'cont'}"><div class="vent-cab">${ICSUBE.replace('<svg', '<svg style="width:1.2em;height:1.2em;flex:none"')}<span>${esc(tit)}</span><span class="sep"></span><button type="button" class="tog" data-sim-x>${esc(T('Cerrar'))}</button></div><div class="vent-cu sim-vcu">
    <div class="fila"><input type="url" class="pide" id="sim-url" value="${esc(pared ? (/^data:/.test(FPROP) ? '' : FPROP) : URLP)}" placeholder="${esc(T(pared ? 'Pega el enlace de una imagen' : 'Pega un enlace de YouTube, Vimeo, imagen o vídeo'))}"><button type="button" class="tog" data-sim-sube style="flex:none">${ICSUBE.replace('<svg', '<svg style="width:1.1em;height:1.1em;flex:none"')}<span>${esc(T(pared ? 'Subir una foto' : 'Subir imagen / vídeo'))}</span></button><input type="file" id="sim-file" accept="${pared ? 'image/*' : 'image/*,video/*'}" hidden></div>
    <p class="sim-nota">${esc(T(pared ? 'La foto de la pared se queda solo en este navegador.' : 'La foto propia se queda solo en este navegador.'))}</p>
    <div class="fila"><button type="button" class="calcular" data-sim-aplica>${esc(T('Aplicar'))}</button>${pared && FPROP ? `<button type="button" class="tog" data-sim-quita><span>${esc(T('Quitar'))}</span></button>` : ''}</div>
    <button type="button" data-acc="sim:nada" hidden></button></div></div>`;
  document.body.appendChild(v); requestAnimationFrame(() => v.classList.add('on'));
}
function cierra() { const v = document.getElementById('sim-velo'); if (v) v.remove(); }
const repinta = () => { const b = document.querySelector('#sim-velo [data-acc="sim:nada"]') || Object.assign(document.createElement('button'), { hidden: true }); if (!b.isConnected) { b.dataset.acc = 'sim:nada'; document.body.appendChild(b); } b.click(); if (!b.closest('#sim-velo')) b.remove(); cierra(); };
document.addEventListener('click', (e) => {
  const q = (s) => e.target.closest && e.target.closest(s); let b;
  if (q('[data-sim-x]') || (e.target.id === 'sim-velo')) { cierra(); return; }
  if (q('[data-sim-sube]')) { const f = document.getElementById('sim-file'); if (f) f.click(); return; }
  if (q('[data-sim-aplica]')) { const i = document.getElementById('sim-url'), u = i ? i.value.trim() : '';
    if (enPared()) { if (u && u !== FPROP) ponPared(/^https?:\/\//i.test(u) ? u : 'https://' + u); else if (FPROP) { E.fondo = 'propio'; guarda('systems_sim', E); repinta(); } return; }
    URLP = u; if (URLP) { suelta(); CONT = deEnlace(URLP); FSEL = -1; } repinta(); return; }
  if (q('[data-sim-quita]')) { FPROP = ''; try { localStorage.removeItem(FPROP_K); } catch (er) {} if (E.fondo === 'propio') E.fondo = 'hormigon'; guarda('systems_sim', E); repinta(); return; }
});
document.addEventListener('change', (e) => {
  if (e.target.id === 'sim-file' && e.target.files && e.target.files[0] && enPared()) { const f = e.target.files[0]; if (!/^image\//.test(f.type)) return; const u = URL.createObjectURL(f); reduceImg(u).then(ponPared).catch(() => {}).finally(() => URL.revokeObjectURL(u)); return; }
  if (e.target.id === 'sim-file' && e.target.files && e.target.files[0]) { const f = e.target.files[0]; suelta(); CONT = { url: URL.createObjectURL(f), tipo: /^video\//.test(f.type) ? 'video' : 'img' }; FSEL = -1; repinta(); return; }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.getElementById('sim-velo')) cierra(); });
/* acciones que llegan por data-acc (casa.js repinta después) */
export function accionSim(a) {
  if (a === 'reset') { if (ULT.clave) { delete E.elev[ULT.clave]; guarda('systems_sim', E); } return false; }   /* RESTABLECER del módulo: vuelve la altura del cálculo */
  if (!/^sim:/.test(a)) return false;
  const [, que, v] = a.split(':');
  if (que === 'cnt') { if (v === 'propio') { ventana('cont'); return true; } suelta(); URLP = ''; FSEL = -1; CONT = v === 'foto' ? null : v === 'carta' ? { tipo: 'carta' } : { url: MS_URL(), tipo: 'marco', bucle: true }; return true; }
  if (que === 'pared') { if (v === 'propio' && (!FPROP || E.fondo === 'propio')) { ventana('pared'); return true; } E.fondo = v; guarda('systems_sim', E); return true; }
  if (que === 'elev' && ULT.clave) { const cm = Math.round(ULT.base * 100 / 10) * 10 + 10 * (+v || 0); E.elev[ULT.clave] = { cm: Math.max(0, Math.min(300, cm)), a: Math.round((AUTO[ULT.clave] ?? ULT.base) * 100) }; guarda('systems_sim', E); return true; }
  return true;
}
const enPared = () => !!document.querySelector('#sim-velo [data-que="pared"]');
/* la foto de la pared se reduce a 1920 px de lado como mucho y se guarda como JPEG en este navegador */
const reduceImg = (src) => new Promise((ok, no) => { const im = new Image(); im.onload = () => { const e = Math.min(1, 1920 / Math.max(im.naturalWidth || 1, im.naturalHeight || 1)), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(im.naturalWidth * e)); c.height = Math.max(1, Math.round(im.naturalHeight * e)); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', 0.85)); }; im.onerror = no; im.src = src; });
function ponPared(src) { FPROP = src; try { localStorage.setItem(FPROP_K, src); } catch (e) {} E.fondo = 'propio'; guarda('systems_sim', E); repinta(); }
