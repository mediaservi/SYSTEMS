// SYSTEMS · página de ficha de producto (ficha.html?ref=…&lang=…): la ficha de la consola, sola, para abrirla en pestaña nueva,
// imprimirla o compartirla. Sin precios ni stock. GPL-3.0 · mediaservi.com
import { fijarIdioma, idiomaInicial, idioma } from '../textos.js';
import { T, textos, esc, VERSION } from './util.js';
import { cargar } from './listas.js';
import { fichaDe } from './fichaprod.js';

textos({
  'Imprimir': ['Print', 'Imprimir'],
  'No encuentro esta referencia en las listas de equipos.': ['This reference is not in the equipment lists.', 'No trobo aquesta referència a les llistes d\'equips.'],
  'Volver a SYSTEMS': ['Back to SYSTEMS', 'Tornar a SYSTEMS']
});
fijarIdioma(idiomaInicial());
const ref = new URLSearchParams(location.search).get('ref') || '';
const cu = document.getElementById('fp-cu'), imp = document.getElementById('fp-imp'), pie = document.getElementById('fp-pie');
function pinta() {
  const f = fichaDe(ref);
  if (f) { cu.innerHTML = f.html; document.title = f.tit + ' · SYSTEMS'; imp.hidden = false; imp.textContent = T('Imprimir'); }
  else cu.innerHTML = `<p class="fp-nada">${esc(T('No encuentro esta referencia en las listas de equipos.'))}<br><b>${esc(ref)}</b><br><a href="./">${esc(T('Volver a SYSTEMS'))}</a></p>`;
  if (window.AVCREDITO) pie.innerHTML = window.AVCREDITO.html('SYSTEMS', VERSION, idioma());
}
imp.addEventListener('click', () => window.print());
if (window.AVCREDITO && window.AVCREDITO.alCambiar) window.AVCREDITO.alCambiar(pinta);
pinta();
cargar(pinta);
