// SYSTEMS · vistas técnicas (v2.3): las mismas piezas que screens/vistas.js de SCREENS (v11.49) para que los planos de las dos apps
// se vean iguales: fondo oscuro, cotas con topes, escala en metros, la silueta oficial de 1,75 m y los mismos colores. GPL-3.0 · mediaservi.com
import { T, N, esc, textos } from './util.js';
import { figuraSVG } from './figura.js';
textos({ 'Planta': ['Plan', 'Planta'], 'Lateral': ['Side', 'Lateral'], 'Frontal': ['Front', 'Frontal'], 'Vistas técnicas': ['Technical views', 'Vistes tècniques'] });

export const COL = { linea: '#6a6a75', suelo: '#9a9aa6', pared: '#e9e9ec', imagen: 'rgba(255,214,0,.38)', imagenB: '#ffd600', haz: 'rgba(255,214,0,.13)', rango: 'rgba(0,180,255,.16)',
  rangoB: '#00b4ff', fuera: 'rgba(255,0,170,.30)', proy: '#b566ff', lente: '#00ff04', cota: '#c9c9ce', persona: '#8d8d96', equipo: '#2b2b31', mic: '#00ff04', retardo: '#ffb000' };
export const fmt = (v, d = 2) => N(Number(v || 0), d);
/* metros → píxeles dentro de un recuadro con márgenes para las cotas (igual que SCREENS) */
export function escala(W, H, m, xMin, xMax, yMin, yMax) {
  const k = Math.min((W - m.l - m.r) / Math.max(0.1, xMax - xMin), (H - m.t - m.b) / Math.max(0.1, yMax - yMin));
  const ox = m.l + ((W - m.l - m.r) - (xMax - xMin) * k) / 2, oy = H - m.b - ((H - m.t - m.b) - (yMax - yMin) * k) / 2;
  return { k, X: (x) => ox + (x - xMin) * k, Y: (y) => oy - (y - yMin) * k };
}
/* cota: línea con topes y el valor centrado */
export function cota(x1, y1, x2, y2, txt, lado = -1) {
  const hor = Math.abs(y2 - y1) < Math.abs(x2 - x1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const tope = (x, y) => hor ? `<line x1="${x}" y1="${y - 5}" x2="${x}" y2="${y + 5}"/>` : `<line x1="${x - 5}" y1="${y}" x2="${x + 5}" y2="${y}"/>`;
  const tx = hor ? `<text x="${mx}" y="${my + (lado < 0 ? -6 : 16)}" text-anchor="middle">${esc(txt)}</text>` : `<text x="${mx + (lado < 0 ? -8 : 8)}" y="${my + 5}" text-anchor="${lado < 0 ? 'end' : 'start'}">${esc(txt)}</text>`;
  return `<g class="vt-cota"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>${tope(x1, y1)}${tope(x2, y2)}${tx}</g>`;
}
/* la silueta oficial de 1,75 m, con los pies en el suelo */
export const persona = (X, Y, x, k, op = 0.8) => figuraSVG(X(x), Y(0), k, `class="vt-persona" fill="${COL.persona}" fill-opacity="${op}" stroke="none"`);
export const suelo = (X, Y, x1, x2) => `<line x1="${X(x1)}" y1="${Y(0)}" x2="${X(x2)}" y2="${Y(0)}" stroke="${COL.suelo}" stroke-width="2"/>`;
export const techo = (X, Y, x1, x2, h) => `<line x1="${X(x1)}" y1="${Y(h)}" x2="${X(x2)}" y2="${Y(h)}" stroke="${COL.linea}" stroke-dasharray="6 5"/>`;
export const etiqueta = (x, y, t, a = 'middle', cls = '') => `<text x="${x}" y="${y}" text-anchor="${a}"${cls ? ` class="${cls}"` : ''}>${esc(t)}</text>`;
/* el lienzo: fondo oscuro de SCREENS y la unidad arriba a la derecha */
export const lienzo = (W, H, g, lab) => `<svg class="vt-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(T(lab))}" preserveAspectRatio="xMidYMid meet"><rect x="0" y="0" width="${W}" height="${H}" class="vt-fondo"/>${g}<text x="${W - 10}" y="20" text-anchor="end" class="vt-uni">(m)</text></svg>`;
/* los botones de vista en la cabecera del bloque (PLANTA · LATERAL · FRONTAL) */
export const pestanas = (L, act) => L.length > 1 ? `<span class="vistas" role="group" aria-label="${esc(T('Vistas técnicas'))}">${L.map((k) => `<button type="button" data-acc="vt:${k}" aria-pressed="${k === act}">${esc(T({ planta: 'Planta', lateral: 'Lateral', frontal: 'Frontal' }[k] || k))}</button>`).join('')}</span>` : '';
export const vistaDe = (L, v) => (L.includes(v) ? v : L[0]);
