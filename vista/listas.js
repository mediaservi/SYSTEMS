// SYSTEMS · listas de equipos: las del panel AVHUB ADMIN (?accion=equipos) y, mientras el panel no tenga la de una marca, la de fábrica
// (comun/equipos.js para el LED y comun/sistemas.js para el resto). NORMA: solo se calcula y se propone con las marcas de estas listas.
// GPL-3.0 · mediaservi.com
const ADMIN_URL = 'https://script.google.com/macros/s/AKfycbwkc12y4LODbFe-kQidnR2MbbA6cbW1WbhU3UiqmDmshx-ncAdGYrFRy8PNjm9Wg6Mx3w/exec';
let PANEL = null;
try { const c = JSON.parse(localStorage.getItem('sc_eq1') || 'null'); if (c && c.marcas) PANEL = c; } catch (e) {}
const FAB = () => Object.assign({}, (globalThis.SC_EQUIPOS || {}).marcas || {}, (globalThis.SC_SISTEMAS || {}).marcas || {});
/* todas las marcas: las del panel mandan sobre las de fábrica */
export function marcas() { const f = FAB(), p = (PANEL && PANEL.marcas) || {}; const o = Object.assign({}, f); Object.keys(p).forEach((k) => { if (Array.isArray(p[k])) o[k] = p[k]; }); return o; }
/* equipos activos de un tipo (o de varios), con su marca */
export function equipos(tipos, marca) {
  const T = [].concat(tipos), M = marcas(), out = [];
  Object.keys(M).forEach((k) => { if (marca && marca !== 'todas' && k !== marca) return; (M[k] || []).forEach((x) => { if (x && x.activo !== false && T.includes(x.tipo)) out.push(Object.assign({ marca: k }, x, { fab: k })); }); });
  return out;
}
export const tieneMarca = (k) => !!marcas()[k];
/* se piden las del panel al arrancar; si llegan, se aplican al motor del LED y se repinta */
export async function cargar(alLlegar) {
  const el = globalThis.SC_ELEC;
  if (PANEL && el && el.aplicaListas) el.aplicaListas(PANEL);
  try {
    const r = await fetch(ADMIN_URL + '?accion=equipos', { cache: 'no-store' }); if (!r.ok) return;
    const j = await r.json(); if (!j || !j.marcas) return;
    PANEL = j; try { localStorage.setItem('sc_eq1', JSON.stringify(j)); } catch (e) {}
    if (el && el.aplicaListas) el.aplicaListas(j);
    if (alLlegar) alLlegar();
  } catch (e) { /* sin conexión: listas de fábrica o las últimas guardadas */ }
}
