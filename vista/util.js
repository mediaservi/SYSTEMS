// SYSTEMS · utilidades comunes de la consola (textos en es/en/ca, números y escapado) · GPL-3.0 · mediaservi.com
import { T as T0, idioma } from '../textos.js';

const DIC = {};
// cada módulo registra sus textos: { 'texto en español': ['english', 'català'] }
export const textos = (d) => Object.assign(DIC, d);
export const lang = () => idioma();
export function T(s, v) {
  if (s == null) return '';
  const l = idioma(); let r = String(s);
  if (l !== 'es') { const m = DIC[r]; if (m) r = m[l === 'en' ? 0 : 1]; else { const o = r; r = T0(r); if (r === o && /[a-záéíóúñ]{3}/i.test(o)) (globalThis.__faltan = globalThis.__faltan || new Set()).add(o); } }
  if (v) Object.keys(v).forEach((k) => { r = r.split('{' + k + '}').join(v[k]); });
  return r;
}
export const TM = (s) => (idioma() === 'es' || !globalThis.SC_TR_MOTOR) ? String(s || '') : globalThis.SC_TR_MOTOR(s, idioma());
export const N = (x, d = 0) => (typeof x === 'number' && isFinite(x)) ? x.toLocaleString(idioma() === 'en' ? 'en-GB' : 'es-ES', { maximumFractionDigits: d, minimumFractionDigits: 0 }).replace(/^-/, '−') : '—';
export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const $ = (s, r = document) => r.querySelector(s);
export const guarda = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
export const lee = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };

/* piezas de los bloques de PRO (las mismas clases que SCREENS: .tog, .num, .fila) */
export const tog = (on, attrs, txt, extra = '') => `<button type="button" class="tog" aria-pressed="${!!on}" ${attrs}>${extra}<span>${txt}</span></button>`;
export const togs = (k, ops, val, cls = '') => `<div class="fila envuelve ${cls}">${ops.map((o) => tog(String(val) === String(o[0]), `data-set="${k}" data-v="${esc(String(o[0]))}"`, esc(T(o[1])))).join('')}</div>`;
export const num = (k, lab, val, uni, paso = 1, min = 0, max = 99999) => (T(lab).length > 15 ? etq(lab) : '') + `<div class="num">${lab && T(lab).length <= 15 ? `<label for="n-${k}">${esc(T(lab))}</label>` : ''}<input id="n-${k}" type="number" inputmode="decimal" data-num="${k}" value="${esc(val)}" step="${paso}" min="${min}" max="${max}"><span>${esc(uni || '')}</span><div class="pm"><button type="button" data-pm="${k}" data-d="1" tabindex="-1" aria-label="+">▲</button><button type="button" data-pm="${k}" data-d="-1" tabindex="-1" aria-label="−">▼</button></div></div>`;
export const etq = (t) => `<p class="sub-t">${esc(T(t))}</p>`;
