// SYSTEMS · la casa: la misma consola de SCREENS (cabecera, barra de módulos, petición escrita, CALCULAR, SIMPLE / PRO y pie)
// para todos los módulos (ELECTRÓNICA, SEÑAL Y CONECTIVIDAD, AUDIO, VIDEOCONFERENCIA y los que vengan). Cada módulo da sus datos,
// su esquema, su resultado y sus cifras; aquí se pintan siempre en los mismos sitios. Licencia GPL-3.0 · mediaservi.com
import { fichaDe, nombres, traduceDes, urlFicha, busca, fotoDe, webDe } from './fichaprod.js';
import { normaliza } from './peticion.js';
import { IDIOMAS, idioma, fijarIdioma, idiomaInicial } from '../textos.js';
import { T, textos, esc, $, lee, guarda } from './util.js';
import { IC, ic, icb } from './iconos.js';
import ELEC from './mod-electronica.js';
import SENAL from './mod-senal.js';
import AUDIO from './mod-audio.js';
import VIDEO from './mod-video.js';
import DISP from './mod-display.js';
import SONIDO from './mod-sonido.js';
import CAMARAS from './mod-camaras.js';
import CONTROL from './mod-control.js';
import { cargar, esInterno, urlInterno, salirInterno, marcas } from './listas.js';

import { VERSION } from './version.js';   /* v2.8 · la versión vive en version.js (la usa también la página de ficha) */
export { VERSION };
const ADMIN_URL = 'https://script.google.com/macros/s/AKfycbwkc12y4LODbFe-kQidnR2MbbA6cbW1WbhU3UiqmDmshx-ncAdGYrFRy8PNjm9Wg6Mx3w/exec';
const MODS = [ELEC, DISP, SENAL, AUDIO, SONIDO, VIDEO, CAMARAS, CONTROL];   // v1.4 · DISPLAYS, pestaña propia para señalética y digital signage · v2.0 · SONORIZACIÓN · v2.2 · CÁMARAS y CONTROL
fijarIdioma(idiomaInicial());

textos({ 'ACCESOS DIRECTOS': ['DIRECT LINKS', 'ACCESSOS DIRECTES'], 'COPIAR': ['COPY', 'COPIAR'], 'Copiar': ['Copy', 'Copiar'], 'Dirección copiada: {u}': ['Address copied: {u}', 'Adreça copiada: {u}'] });
textos({
  'Nuevo cálculo: lo deja todo como al empezar': ['New calculation: back to the start', 'Nou càlcul: ho deixa tot com al començar'],
  'Qué es esto y cómo se usa': ['What this is and how to use it', 'Què és això i com es fa servir'],
  'Ver o imprimir el PDF del proyecto': ['View or print the project PDF', 'Veure o imprimir el PDF del projecte'],
  'Cambiar entre gris oscuro y gris claro': ['Switch between dark grey and light grey', 'Canviar entre gris fosc i gris clar'],
  'Modo SIMPLE o PRO': ['SIMPLE or PRO mode', 'Mode SIMPLE o PRO'],
  'Pegar una petición copiada': ['Paste a copied request', 'Enganxar una petició copiada'],
  'Copiar el texto de la casilla (la petición o el resultado)': ['Copy the box text (request or result)', 'Copiar el text de la casella (la petició o el resultat)'],
  'Resultado del cálculo. Toca para escribir otra petición': ['Calculation result. Tap to type another request', 'Resultat del càlcul. Toca per escriure una altra petició'],
  'CALCULAR': ['CALCULATE', 'CALCULAR'],
  'Lo que pides': ['What you ask for', 'El que demanes'],
  'Resultado': ['Result', 'Resultat'],
  'Pregúntame otra vez': ['Ask me again', 'Pregunta-m\'ho un altre cop'],
  'Cambiar': ['Change', 'Canviar'],
  'Ver en PRO': ['See in PRO', 'Veure a PRO'],
  'PDF': ['PDF', 'PDF'],
  'Ver la ficha': ['See the datasheet', 'Veure la fitxa'],
  'Ver en grande': ['See it large', 'Veure en gran'], 'Datos del proyecto: nombre, cliente y observaciones': ['Project data: name, client and notes', 'Dades del projecte: nom, client i observacions'],
  'Datos del proyecto': ['Project data', 'Dades del projecte'], 'Proyecto': ['Project', 'Projecte'], 'Cliente': ['Client', 'Client'], 'Observaciones': ['Notes', 'Observacions'], 'Guardar': ['Save', 'Desar'], 'Borrar': ['Clear', 'Esborrar'],
  'Datos del proyecto guardados: salen en el PDF.': ['Project data saved: it goes in the PDF.', 'Dades del projecte desades: surten al PDF.'],
  'Acceso interno activo: tócalo para cerrarlo': ['Internal access on: tap to close it', 'Accés intern actiu: toca\'l per tancar-lo'],
  'Restablecer': ['Reset', 'Restablir'],
  'SALTAR': ['SKIP', 'SALTAR'], 'SIGUIENTE': ['NEXT', 'SEGÜENT'], 'LISTO': ['DONE', 'FET'], 'ATRÁS': ['BACK', 'ENRERE'], 'Cerrar': ['Close', 'Tancar'],
  'Paso {a} de {b}': ['Step {a} of {b}', 'Pas {a} de {b}'],
  'Hola. Te haré unas preguntas muy sencillas y te diré qué necesitas.': ['Hi. I will ask you a few very simple questions and tell you what you need.', 'Hola. Et faré unes preguntes molt senzilles i et diré què necessites.'],
  'Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.': ['Automatic calculation that may contain errors: check it before quoting or installing.', 'Càlcul automàtic que pot contenir errors: revisa\'l abans de pressupostar o instal·lar.'],
  'Panel de administración': ['Admin panel', 'Panell d\'administració'],
  'Ficha': ['Datasheet', 'Fitxa'], 'Fabricante': ['Manufacturer', 'Fabricant'], 'Ver la foto en grande': ['See the photo full size', 'Veure la foto en gran'],
  'También he preparado {m} con esta petición: está en su pestaña.': ['I have also set up {m} from this request: it is in its tab.', 'També he preparat {m} amb aquesta petició: és a la seva pestanya.'],
  'No he entendido la petición: prueba con los botones o escríbela de otra forma.': ['I did not understand the request: try the buttons or write it another way.', 'No he entès la petició: prova amb els botons o escriu-la d\'una altra manera.'],
  'La casilla está vacía: no hay nada que copiar.': ['The box is empty: nothing to copy.', 'La casella és buida: no hi ha res a copiar.'],
  'Copiado.': ['Copied.', 'Copiat.'], 'Este navegador no deja copiar desde aquí.': ['This browser does not allow copying from here.', 'Aquest navegador no deixa copiar des d\'aquí.'],
  'No hay texto copiado que pegar.': ['There is no copied text to paste.', 'No hi ha text copiat per enganxar.'],
  'Petición pegada: pulsa CALCULAR.': ['Request pasted: press CALCULATE.', 'Petició enganxada: prem CALCULAR.'],
  'Este navegador no deja pegar con el botón: usa Ctrl+V en la casilla.': ['This browser does not allow pasting with the button: use Ctrl+V in the box.', 'Aquest navegador no deixa enganxar amb el botó: fes servir Ctrl+V a la casella.'],
  'Español': ['Spanish', 'Espanyol'], 'Inglés': ['English', 'Anglès'], 'Catalán': ['Catalan', 'Català'],
  'Calcula la electrónica, la señal, el audio y la videoconferencia de un proyecto con los equipos de las marcas del catálogo.': ['Works out the electronics, signal, audio and video conferencing of a project with the equipment of the catalogue brands.', 'Calcula l\'electrònica, el senyal, l\'àudio i la videoconferència d\'un projecte amb els equips de les marques del catàleg.'],
  'Elige arriba el módulo. En SIMPLE te pregunto lo justo y te doy la solución; en PRO ves y cambias todos los datos, el esquema y el despiece.': ['Choose the module at the top. In SIMPLE I ask just what is needed and give you the solution; in PRO you see and change every value, the diagram and the parts list.', 'Tria a dalt el mòdul. A SIMPLE et pregunto el just i et dono la solució; a PRO veus i canvies totes les dades, l\'esquema i l\'especejament.'],
  'También puedes escribir lo que necesitas en la casilla y pulsar CALCULAR.': ['You can also type what you need in the box and press CALCULATE.', 'També pots escriure el que necessites a la casella i prémer CALCULAR.'],
  'Solo se calcula y se propone con las marcas y los fabricantes de las listas del panel.': ['Only the brands and manufacturers in the panel lists are used and proposed.', 'Només es calcula i es proposa amb les marques i els fabricants de les llistes del panell.'],
});

/* ---------- estado de la casa ---------- */
const G = Object.assign({ mod: 'elec', vista: 'simple', tema: 'oscuro', texto: '' }, lee('systems_casa') || {});
try { const q = new URLSearchParams(location.search).get('mod'); if (q && ['elec', 'disp', 'senal', 'audio', 'sonido', 'video', 'camaras', 'control'].includes(q)) G.mod = q; } catch (e) {}
const M = () => MODS.find((m) => m.id === G.mod) || MODS[0];
const guardaCasa = () => guarda('systems_casa', G);
let R = null, EDITA = true, ASIS = null;
const NOMBRE = { es: 'Español', en: 'Inglés', ca: 'Catalán' };

/* ---------- piezas ---------- */
const bt = (k, tit, attrs = '', cls = 'g') => `<button type="button" class="ic-bt ${cls}" title="${esc(T(tit))}" aria-label="${esc(T(tit))}" ${attrs}>${k === 'info' ? '<span class="ic ic-info"></span>' : IC[k] || icb(k)}</button>`;
const blk = (area, id, tit, ac, cuerpo, extra = '', cls = '', icK = '') => `<section class="blk ${cls}" style="grid-area:${area};--ac:${ac}" data-blk="${id}"><header class="blk-cab">${icK ? `<i class="blk-ic" aria-hidden="true">${icb(icK)}</i>` : ''}<b>${tit}</b><span class="sep"></span>${extra}<span class="id">${id}</span></header><div class="blk-cu">${cuerpo}</div></section>`;
const sw = () => { const pro = G.vista === 'pro'; return `<button type="button" class="ss-bur${pro ? ' pro' : ''}" data-ss-sw="${pro ? 'simple' : 'pro'}" aria-label="${esc(T('Modo SIMPLE o PRO'))}" title="${esc(T('Modo SIMPLE o PRO'))}"><i></i>${pro ? 'PRO' : 'SIMPLE'}</button><div class="ss-sw" role="group" aria-label="${esc(T('Modo SIMPLE o PRO'))}" title="${esc(T('Modo SIMPLE o PRO'))}" data-crudo><button type="button" class="ss-sw-e${pro ? '' : ' on'}" data-ss-sw="simple" aria-pressed="${!pro}">SIMPLE</button><label class="ss-sw-t"><input type="checkbox" data-ss-swc aria-label="PRO"${pro ? ' checked' : ''}><span class="ss-sw-p"><span class="ss-sw-b"></span></span></label><button type="button" class="ss-sw-e${pro ? ' on' : ''}" data-ss-sw="pro" aria-pressed="${pro}">PRO</button></div>`; };
const COL = ['var(--azul)', 'var(--violeta)', 'var(--magenta, #e24bf0)', 'var(--ambar)', 'var(--verde)', 'var(--rojo)'];

/* ---------- la plantilla (calcada de SCREENS) ---------- */
function marco() {
  const l = idioma(), sig = IDIOMAS[(IDIOMAS.indexOf(l) + 1) % IDIOMAS.length], tIdi = `${T(NOMBRE[l])} → ${T(NOMBRE[sig])}`;
  document.documentElement.lang = l; document.documentElement.dataset.tema = G.tema === 'claro' ? 'claro' : 'oscuro';
  const fam = `<a href="https://screens.mediaservi.com/"><img class="t-osc" src="assets/fam/screens-logo.svg" alt="SCREENS"><img class="t-cla" src="assets/fam/screens-logo-claro.svg" alt="SCREENS"></a><a href="https://adposter.mediaservi.com/"><img class="t-osc" src="assets/fam/adposter-logo.svg" alt="ADPOSTER"><img class="t-cla" src="assets/fam/adposter-logo-claro.svg" alt="ADPOSTER"></a><a class="av" href="https://avhub.mediaservi.com/"><img class="t-osc" src="assets/avhub-logo.svg" alt="AVHUB"><img class="t-cla" src="assets/avhub-logo-claro.svg" alt="AVHUB"></a><a href="https://vjshow.mediaservi.com/"><img class="t-osc" src="assets/fam/vjshow-logo.svg" alt="VJSHOW"><img class="t-cla" src="assets/fam/vjshow-logo-claro.svg" alt="VJSHOW"></a><a href="https://msgame.mediaservi.com/"><img src="assets/fam/msgame-logo.svg?v=5" alt="MSGAME"></a>`;
  const modTog = (m) => `<button type="button" class="tog" aria-pressed="${m.id === G.mod}" data-mod="${m.id}" title="${esc(T(m.nom))}">${icb(m.ic)}<span>${esc(T(m.corto))}</span></button>`;
  $('#app').innerHTML = `<header class="im-cab" aria-hidden="true"><img class="im-logo" src="assets/systems-logo-claro.svg" alt="SYSTEMS"><div class="im-url"><span id="im-fecha">systems.mediaservi.com</span></div><img class="im-avhub" src="assets/avhub-logo-claro.svg" alt="AVHUB"></header><div class="blocks">
    <header class="franja f-h1"><div data-blk="H1L"><button type="button" data-nuevo title="${esc(T('Nuevo cálculo: lo deja todo como al empezar'))}" aria-label="SYSTEMS" style="display:flex;border:0;background:none;padding:0"><img class="logo t-osc" src="assets/systems-logo.svg" alt="SYSTEMS"><img class="logo t-cla" src="assets/systems-logo-claro.svg" alt="SYSTEMS"><img class="logo-iso" src="assets/systems-icono.svg" alt="SYSTEMS"></button><small class="h-ver">${VERSION}</small>${sw()}</div>
      <nav data-blk="H1C" class="fam" aria-label="AVHUB">${fam}</nav>
      <div data-blk="H1R" class="h1r">${bt('info', 'Qué es esto y cómo se usa', 'data-info')}${bt('pdf', 'Ver o imprimir el PDF del proyecto', 'data-pdf')}${bt('nuevo', 'Nuevo cálculo: lo deja todo como al empezar', 'data-nuevo')}<button type="button" class="ic-bt g" data-idioma data-crudo title="${esc(tIdi)}" aria-label="${esc(tIdi)}" style="position:relative"><span class="ic ic-lang"></span><small class="cod">${l.toUpperCase()}</small></button>${bt('tema', 'Cambiar entre gris oscuro y gris claro', 'data-tema')}</div></header>
    <div class="franja f-hm"><div data-blk="HM1"><div class="fila grupo" style="flex:1 1 auto">${modTog(MODS[0])}${modTog(MODS[1])}</div><div class="fila grupo" style="flex:1 1 auto">${MODS.slice(2).map(modTog).join('')}</div></div>
      <div data-blk="HM2">${bt('proyecto', 'Datos del proyecto: nombre, cliente y observaciones', 'data-proyecto')}${bt('pega', 'Pegar una petición copiada', 'data-pega')}<div class="pide-caja"><input class="pide" id="pide" type="text" autocomplete="off" spellcheck="false" placeholder="" aria-label="" value="${esc(G.texto)}"><button type="button" class="pide-res" id="pide-res" hidden title="${esc(T('Resultado del cálculo. Toca para escribir otra petición'))}"></button></div>${bt('copia', 'Copiar el texto de la casilla (la petición o el resultado)', 'data-copiatxt')}</div>
      <div data-blk="HM3"><button type="button" class="calcular" id="calcular">${esc(T('CALCULAR'))} →</button></div></div>
    <main id="cuerpo"></main>
    <footer class="franja f-f1"><div data-blk="F1L" id="pie-l"><span class="nota" data-aviso-calc><svg class="av-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.6 2.4 20.2h19.2z"/><path d="M12 9.6v5"/><path d="M12 17.6h.01"/></svg><span>${esc(T('Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.'))}</span></span></div><div data-blk="F1C" id="pie-c" class="f-cred" data-crudo></div><div data-blk="F1R" class="f1r" id="hueco-comun"></div><a class="admin-esq${esInterno() ? ' on' : ''}" href="${esInterno() ? '#' : urlInterno()}"${esInterno() ? ' data-salir-int' : ''} title="${esc(T(esInterno() ? 'Acceso interno activo: tócalo para cerrarlo' : 'Panel de administración'))}" aria-label="${esc(T(esInterno() ? 'Acceso interno activo: tócalo para cerrarlo' : 'Panel de administración'))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></a></footer>
  </div><div class="velo" id="velo"></div><div class="tostada" id="tostada" role="status" aria-live="polite"></div>`;
  pintaPie();
  const r = $('#hueco-comun');
  if (window.AVINSTALA) r.appendChild(window.AVINSTALA.boton({ app: 'SYSTEMS', idioma, sw: 'sw.js' }));
  if (window.AVFALLO) r.appendChild(window.AVFALLO.boton({ app: 'SYSTEMS', version: VERSION, idioma }));
  const cand = $('.admin-esq'); if (cand) r.appendChild(cand);   /* v2.9 · el candado, el último del grupo de la derecha, como en SCREENS */
  pinta();
}
/* v2.8 · PDF en dos hojas como el de SCREENS (vista/pdfsys.js con pdf.js); si algo falla, la hoja de impresión de siempre */
let HACIENDO = false;
async function pdfDirecto() {
  if (HACIENDO) return; HACIENDO = true;
  try { const m = M(), { hacePDF } = await import('./pdfsys.js'); await hacePDF({ m, R, caja: document.querySelector('[data-blk="S1A"] .lienzo-s') || document.querySelector('.ss-lienzo'), esqHtml: (() => { try { return m.esquema(R, {}).html; } catch (e) { return ''; } })(), cifras: m.cifras(R), nombreMod: m.nom, proyecto: PROY, tostada }); }
  catch (e) { imprimir(); }
  finally { HACIENDO = false; }
}
/* v1.3 · PDF: hoja en claro con la cabecera de SCREENS (logo de SYSTEMS · web y fecha · logo de AVHUB) y el pie de la app */
function imprimir() {
  const hoy = new Date(), l = idioma(), fecha = hoy.toLocaleDateString(l === 'en' ? 'en-GB' : 'es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' · ' + hoy.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const txt = 'systems.mediaservi.com · ' + fecha, f = $('#im-fecha'); if (f) { f.textContent = txt; f.parentElement.style.setProperty('--n', txt.length); }
  const tema = document.documentElement.dataset.tema; document.documentElement.dataset.tema = 'claro';
  const vuelve = () => { document.documentElement.dataset.tema = tema; removeEventListener('afterprint', vuelve); };
  addEventListener('afterprint', vuelve); window.print(); setTimeout(() => { if (!matchMedia('print').matches) vuelve(); }, 1500);
}
function pintaPie() { const p = $('#pie-c'); if (p) p.innerHTML = window.AVCREDITO ? (() => { const h = window.AVCREDITO.html('SYSTEMS', VERSION, idioma()), k = h.indexOf(' · <a href="#aviso"'); return '<span class="cred-ver">SYSTEMS ' + VERSION + '</span>' + (k > 0 ? '<span class="cred-txt">' + h.slice(0, k) + ' · </span>' + h.slice(k + 3) : h); })() : `SYSTEMS ${VERSION} ${new Date().getFullYear()} · <a href="https://mediaservi.com/" target="_blank" rel="noopener">mediaservi.com</a>`; }
if (window.AVCREDITO && window.AVCREDITO.alCambiar) window.AVCREDITO.alCambiar(() => { pintaPie(); ajusta(); });

/* ---------- el cuerpo: SIMPLE (tres bloques) o PRO (rejilla de 6 × 3) ---------- */
const MQ = matchMedia('(orientation: portrait), (max-width: 900px), (max-height: 560px)');
function pinta() {
  const m = M(); R = m.calcula();
  document.documentElement.classList.toggle('sc-simple', G.vista === 'simple');
  document.documentElement.classList.toggle('ss-apila', MQ.matches);
  document.querySelectorAll('[data-mod]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mod === m.id)));
  const pide = $('#pide'); if (pide) { pide.placeholder = T(m.ejemplo); pide.setAttribute('aria-label', T(m.nom)); }
  const c = $('#cuerpo'), esq = m.esquema(R, { vertical: G.vista === 'pro' || innerWidth < 720 }), cif = (m.cifras(R) || []).slice(0, 6);
  if (G.vista === 'simple') {
    c.className = 'ss ss-cuerpo';
    const filas = m.filas(R);
    const sem = R.sem || 'V', n = Math.min(cif.length, MQ.matches ? 6 : 4) || 1;
    c.innerHTML = `<section class="ss-blk ss-resumen" id="ss-resumen"><h2 class="ss-tit">${ic('lista')}<span class="ss-fit">${esc(T('Lo que pides'))}</span></h2>
        <div class="ss-filas">${filas.map((f) => `<button type="button" class="ss-fila" data-ss-q="${f[0]}" aria-label="${esc(T('Cambiar') + ': ' + T(f[2]))}">${ic(f[1])}<span class="ss-fk ss-fit">${esc(T(f[2]))}</span><b class="ss-fv ss-fit">${esc(f[3])}</b>${ic('lapiz', 'ss-lapiz')}</button>`).join('')}</div>
        <button type="button" class="ss-ancho" data-asis>${ic('varita')}<span class="ss-fit">${esc(T('Pregúntame otra vez'))}</span></button></section>
      <section class="ss-blk ss-sim" id="ss-sim"><h2 class="ss-tit">${ic((/^Simulaci/.test(esq.tit) ? 'sim' : esq.ic || 'sim'))}<span class="ss-fit">${esc(T(esq.tit))}</span>${esq.extra || ''}${bt('ojo', 'Ver en grande', 'data-grande', 'g ss-ojo')}</h2><div class="ss-lienzo">${esq.html}</div></section>
      <section class="ss-blk ss-res" id="ss-res" aria-live="polite"><div class="ss-res-cab"><h2 class="ss-tit">${ic('res')}<span class="ss-fit">${esc(T('Resultado'))}</span></h2>
        <div class="ss-acc"><button type="button" class="ss-bt2" data-pdf>${ic('pdf')}<span class="ss-fit">PDF</span></button><button type="button" class="ss-bt2 ss-pro" data-ss-sw="pro">${ic('pro')}<span class="ss-fit">${esc(T('Ver en PRO'))}</span></button></div></div>
        <p class="ss-linea"><span class="ss-fit">${R.linea || ''}</span></p>
        <p class="ss-sem ss-sem-${sem}"><i></i><span class="ss-fit">${esc(R.semTxt || '')}</span></p>
        <div class="ss-cifras" style="--n:${n}">${cif.slice(0, n).map((q, i) => `<div class="ss-cifra" style="--c:${q.c || COL[i % 6]}"><span class="ss-ci">${ic(q.ic || 'res')}</span><div class="ss-cd"><small class="ss-fit">${esc(T(q.t))}</small><b class="ss-fit">${esc(q.v)}${q.u ? `<i>${esc(q.u)}</i>` : ''}</b><span class="ss-fit">${esc(q.s || '')}</span></div></div>`).join('')}</div></section>`;
  } else {
    c.className = 'rejilla';
    const D = m.datos(R).slice(0, 4), areas = D.length >= 4 ? ['m1a', 'm1b', 'm2a', 'm2b'] : D.length === 3 ? ['m1a / m1a / m2a / m1a', 'm1b', 'm2b'] : D.length === 2 ? ['m1a / m1a / m2a / m1a', 'm1b / m1b / m2b / m1b'] : ['m1a / m1a / m2a / m1b'];
    const ids = D.length >= 4 ? ['M1A', 'M1B', 'M2A', 'M2B'] : D.length === 3 ? ['M1A', 'M1B', 'M2B'] : ['M1A', 'M1B'];
    let h = D.map((d, i) => blk(areas[i], ids[i], esc(T(d.tit)), d.ac || 'var(--azul)', d.html, d.extra || '', d.cls || '', d.ic)).join('');
    h += blk('s1a', 'S1A', esc(T(esq.tit)), 'var(--verde-txt)', `<div class="lienzo-s">${esq.html}</div>`, (esq.extra || '') + bt('ojo', 'Ver en grande', 'data-grande'), 'pant', (/^Simulaci/.test(esq.tit) ? 'sim' : esq.ic || 'sim'));
    h += blk('s1b', 'S1B', esc(T('Resultado')), 'var(--violeta)', m.resultado(R), '', '', 'res');
    'abcdef'.split('').forEach((x, i) => { const q = cif[i];
      h += q ? blk('m3' + x, 'M3' + x.toUpperCase(), esc(T(q.t)), q.c || COL[i], `${q.ref ? `<i hidden data-cref="${esc(q.ref)}"></i>` : ''}<div class="cif-v">${esc(q.v)}${q.u ? `<small>${esc(q.u)}</small>` : ''}</div>${q.s ? `<div class="cif-s">${esc(q.s)}</div>` : ''}`, '', 'res', q.ic)
        : blk('m3' + x, 'M3' + x.toUpperCase(), '&nbsp;', COL[i], '<div class="cif-v">—</div>', '', 'res vacio'); });
    c.innerHTML = h;
  }
  if (m.despues) m.despues(c, R);
  if (idioma() !== 'es') c.querySelectorAll('.despiece td.des').forEach((d) => { [...d.childNodes].forEach((n) => { if (n.nodeType === 3) n.nodeValue = traduceDes(n.nodeValue, idioma()); }); });   /* v2.8 · descripciones de las listas en el idioma */
  marcaStock(c);
  pintaRes(); guardaCasa(); ajusta(); try { enlaza(); } catch (e) {} try { prodCifras(); } catch (e) {} monta3D(m, R);
}
/* v2.5 · simulación 3D: se monta cuando el dibujo trae su lienzo y se suelta entera al repintar (sin contextos WebGL colgando) */
let S3 = null, n3 = 0;
async function monta3D(m, r, dentro) {
  if (S3) { try { S3.destruir(); } catch (e) {} S3 = null; }
  const cv = (dentro || document).querySelector('canvas[data-sim3d]'), yo = ++n3; if (!cv || !m.escena3d) return;
  try { const { Sala3D } = await import('./sim3d.js'); if (yo !== n3 || !cv.isConnected) return; S3 = new Sala3D(cv); m.escena3d(S3, r); S3.encuadra(); }
  catch (e) { if (cv.isConnected) cv.insertAdjacentHTML('afterend', `<p class="sim-err">${esc(T('La simulación 3D no está disponible en este navegador.'))}</p>`); }
}
/* la casilla de la petición: tras CALCULAR enseña el resultado en una línea (como SCREENS) */
function pintaRes() {
  const r = $('#pide-res'), i = $('#pide'); if (!r || !i) return;
  const txt = (R && R.lineaTxt) || '';
  if (!EDITA && txt) { r.hidden = false; r.innerHTML = `<span>${esc(txt)}</span>`; } else r.hidden = true;
}
/* ningún texto de una línea se corta: si no cabe, se reduce la letra */
function ajusta() {
  document.querySelectorAll('.ss-fit, [data-mod] span, .blk-cab b, .cif-v, .f-cred, #pie-l .nota span, .pide-res span, .fila.envuelve .tog span, .lista-c .tog span, .calcular').forEach((el) => {
    if (!el.offsetWidth) return; el.style.removeProperty('font-size'); let fs = parseFloat(getComputedStyle(el).fontSize), k = 0; const min = fs * .45;
    while (el.scrollWidth > el.clientWidth + .5 && fs > min && k++ < 60) { fs -= .5; el.style.setProperty('font-size', fs + 'px'); }
  });
}
addEventListener('resize', () => { const a = document.documentElement.classList.contains('ss-apila'); if (a !== MQ.matches) pinta(); else requestAnimationFrame(ajusta); });

/* ---------- avisos breves y ventanas ---------- */
let tT = 0;
function tostada(t, ms = 3200) { const e = $('#tostada'); if (!e) return; e.textContent = t; e.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => e.classList.remove('on'), ms); }
function ventana(tit, html) {
  const v = $('#velo'); v.innerHTML = `<div class="vent" role="dialog" aria-modal="true"><div class="vent-cab"><b>${esc(tit)}</b><span class="sep"></span><button type="button" class="ic-bt" data-cierra aria-label="${esc(T('Cerrar'))}">${IC.x}</button></div><div class="vent-cu">${html}</div></div>`; v.classList.add('on');
}
/* v2.9 · como en SCREENS: en público, el único indicio de stock es un fondo azul sutil en los equipos que lo tienen (sin texto);
   el «En stock / Bajo pedido» escrito solo sale con la llave de Josep */
function marcaStock(raiz) {
  raiz.querySelectorAll('.equipo').forEach((eq) => { let hay = false;
    eq.querySelectorAll('table.despiece tr').forEach((tr) => { const td = tr.querySelector('td.ref'), b = td && busca(td.textContent.trim()); if (b && b.x.stock && b.x.stock !== 'false' && b.x.stock !== '0') { tr.classList.add('stk'); hay = true; } });
    if (hay) eq.classList.add('stk'); });
}
/* v2.8 · ver en grande el dibujo (como el ojo de SCREENS): la vista elegida a toda ventana, también la simulación a escala y la 3D */
let GRANDE = false;
function verGrande() {
  const m = M(), esq = m.esquema(R, { vertical: movilV() }); GRANDE = true;
  ventana(T(esq.tit), `<div class="grande">${esq.html}</div>`); const v = $('#velo .vent'); if (v) v.classList.add('v-grande');
  if (/data-sim3d/.test(esq.html)) monta3D(m, R, $('#velo'));
  try { enlaza($('#velo')); } catch (e) {}
}
/* v2.8 · datos del proyecto (como en SCREENS): nombre, cliente y observaciones; salen en la cabecera y en la primera hoja del PDF */
let PROY = Object.assign({ proy: '', cliente: '', obs: '' }, lee('systems_proyecto') || {});
function ventanaProyecto() {
  ventana(T('Datos del proyecto'), `<div class="proy-f"><label>${esc(T('Proyecto'))}<input type="text" class="pide" id="pr-proy" maxlength="80" value="${esc(PROY.proy)}"></label><label>${esc(T('Cliente'))}<input type="text" class="pide" id="pr-cli" maxlength="80" value="${esc(PROY.cliente)}"></label><label>${esc(T('Observaciones'))}<textarea class="pide" id="pr-obs" rows="5" maxlength="1200">${esc(PROY.obs)}</textarea></label>
    <div class="fila"><button type="button" class="calcular" data-proy-guarda>${esc(T('Guardar'))}</button><button type="button" class="tog" data-proy-borra><span>${esc(T('Borrar'))}</span></button></div></div>`);
  const v = $('#velo .vent'); if (v) v.classList.add('ajustes'); setTimeout(() => { const i = $('#pr-proy'); if (i) i.focus(); }, 30);
}
/* v2.6 · ficha de producto (vista/fichaprod.js): en la ventana; v2.8 · también en su propia página, en pestaña nueva */
function abreFicha(id) { if (!fichaDe(id)) return false; window.open(urlFicha(id), '_blank', 'noopener'); return true; }
/* v2.8 · todo nombre de producto que aparece (resultado, cifras, despiece y esquemas) es un enlace a su ficha en pestaña nueva */
const escRe = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let REc = null, REk = null;
function reNombres() {
  const N = nombres(); if (REc && REk === N) return REc;
  const ks = [...N.keys()].filter((k) => /\d/.test(k) || k.length >= 4).sort((a, b) => b.length - a.length).map(escRe);
  REc = ks.length ? new RegExp('(^|[^A-Za-z0-9-])(' + ks.join('|') + ')(?![A-Za-z0-9-])', 'gi') : null; REk = N; return REc;
}
/* v3.2 · en las cifras de abajo, si hay sitio, el producto que nombran: su foto oficial (con el ojo para verla en grande),
   su ficha, el PDF de la ficha técnica y su página (charmex.net o la web del fabricante). Si no cabe, primero se quita la foto y después todo */
function prodHtml(x, mini) {
  const W = webDe(x) || {}, f = fotoDe(x), nom = (x.marca || x.fab || '') + ' ' + (x.modelo || x.id);
  const ln = [[urlFicha(x.id), T('Ficha')], W.pdf ? [W.pdf, 'PDF'] : null, W.web ? [W.web, W.charmex ? 'charmex.net' : T('Fabricante')] : null].filter(Boolean);
  return `<div class="cp${mini ? ' mini' : ''}">${f && !mini ? `<button type="button" class="cp-foto" data-zoom="${esc(x.id)}" title="${esc(T('Ver la foto en grande'))}" aria-label="${esc(T('Ver la foto en grande') + ' · ' + nom)}"><img src="${esc(f)}" alt="" loading="lazy" onerror="this.closest('.cp-foto').remove()"><span class="cp-ojo">${icb('ojo')}</span></button>` : ''}<div class="cp-ln">${ln.map(([u, t]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join('')}</div></div>`;
}
function prodCifras() {
  if (document.documentElement.classList.contains('ss-apila') && matchMedia('(max-width: 559px)').matches) return;
  document.querySelectorAll('.blk.res[data-blk^="M3"]').forEach((b) => {
    const cu = b.querySelector('.blk-cu'); if (!cu || cu.querySelector('.cp')) return;
    const cr = cu.querySelector('[data-cref]'), a = cu.querySelector('.cif-v a.prod, .cif-s a.prod'); if (!cr && !a) return;
    const id = cr ? cr.dataset.cref : decodeURIComponent((/[?&]ref=([^&]+)/.exec(a.getAttribute('href')) || [])[1] || ''), bx = busca(id); if (!bx) return;
    const x = Object.assign({ marca: bx.mk }, bx.x);
    const pon = (mini) => { const o = cu.querySelector('.cp'); if (o) o.remove(); cu.insertAdjacentHTML('beforeend', prodHtml(x, mini)); b.classList.add('con-prod'); return cu.scrollHeight <= cu.clientHeight + 1; };
    if (pon(false)) return; if (pon(true)) return;
    const o = cu.querySelector('.cp'); if (o) o.remove(); b.classList.remove('con-prod');
  });
}
document.addEventListener('click', (e) => {
  const z = e.target.closest && e.target.closest('[data-zoom]'); if (!z) return; e.preventDefault();
  const bx = busca(z.dataset.zoom); if (!bx) return; const x = Object.assign({ marca: bx.mk }, bx.x), f = fotoDe(x);
  ventana((x.marca || '') + ' ' + (x.modelo || x.id), `<div class="cp-grande"><img src="${esc(f)}" alt="${esc((x.marca || '') + ' ' + (x.modelo || x.id))}"></div>${prodHtml(x, true)}`);
});
function enlaza(raiz = document.getElementById('app')) {
  const re = reNombres(), N = nombres(); if (!re || !raiz) return;
  const idDe = (t) => { const k = t.toUpperCase(), id = N.get(k); if (!id) return null; return (/\d/.test(k) || t === t.toUpperCase() || t === k) ? id : null; };
  const zonas = raiz.querySelectorAll('.cif-v, .cif-s, .ss-cifra, .ss-linea, [data-blk="S1B"] .blk-cu, .lienzo-s, .ss-lienzo');
  zonas.forEach((z) => {
    const w = document.createTreeWalker(z, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && n.parentElement.closest('a, button, input, select, textarea, label, .tog, .prod')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodos = []; while (w.nextNode()) nodos.push(w.currentNode);
    nodos.forEach((n) => {
      const t = n.nodeValue; re.lastIndex = 0; if (!re.test(t)) return; re.lastIndex = 0;
      const svg = n.parentElement && n.parentElement.namespaceURI === 'http://www.w3.org/2000/svg';
      if (svg) { let m, id = null; while (!id && (m = re.exec(t))) id = idDe(m[2]); if (!id) return; const tx = n.parentElement.closest('text'); if (!tx || tx.parentElement.closest('a')) return;
        const a = document.createElementNS('http://www.w3.org/2000/svg', 'a'); a.setAttribute('href', urlFicha(id)); a.setAttribute('target', '_blank'); a.setAttribute('class', 'prod'); tx.replaceWith(a); a.appendChild(tx); return; }
      const fr = document.createDocumentFragment(); let i = 0, m, hay = false;
      while ((m = re.exec(t))) { const id = idDe(m[2]); if (!id) continue; const ini = m.index + m[1].length; fr.appendChild(document.createTextNode(t.slice(i, ini)));
        const a = document.createElement('a'); a.className = 'prod'; a.href = urlFicha(id); a.target = '_blank'; a.rel = 'noopener'; a.title = T('Ver la ficha'); a.textContent = m[2]; fr.appendChild(a); i = ini + m[2].length; hay = true; }
      if (!hay) return; fr.appendChild(document.createTextNode(t.slice(i))); n.replaceWith(fr);
    });
  });
}
const movilV = () => matchMedia('(max-width: 559px) and (orientation: portrait)').matches;   /* v1.8 · móvil vertical */
const cierra = () => { GRANDE = false; const ic = $('#info-comun'), hc = $('#hueco-comun'); if (ic && hc) [...ic.children].forEach((x) => hc.insertBefore(x, hc.querySelector('.admin-esq'))); const v = $('#velo'); v.classList.remove('on'); v.innerHTML = ''; };
function info() {
  ventana('SYSTEMS', `<p>${esc(T('Calcula la electrónica, la señal, el audio y la videoconferencia de un proyecto con los equipos de las marcas del catálogo.'))}</p><p>${esc(T('Elige arriba el módulo. En SIMPLE te pregunto lo justo y te doy la solución; en PRO ves y cambias todos los datos, el esquema y el despiece.'))}</p><p>${esc(T('También puedes escribir lo que necesitas en la casilla y pulsar CALCULAR.'))}</p><p class="nota">${esc(T('Solo se calcula y se propone con las marcas y los fabricantes de las listas del panel.'))}</p>` +
    MODS.map((m) => `<p><b>${esc(T(m.nom))}</b> · ${esc(T(m.info))}</p>`).join('') + accesos());
}
/* v3.7 · NORMA ACCESOS DIRECTOS (27-11): al final de la información, la dirección general y la de cada módulo (la del módulo abierto, primero
   y resaltada); cada línea con su nombre (abre), la dirección entera y COPIAR. Solo direcciones públicas que funcionan */
const WEB = 'https://systems.mediaservi.com/';
function accesos() {
  const act = MODS.find((m) => m.id === G.mod), otros = MODS.filter((m) => m !== act);
  const ln = (nom, url, on) => `<li class="acc-l${on ? ' on' : ''}"><a href="${esc(url)}" target="_blank" rel="noopener">${esc(nom)}</a><code>${esc(url.replace(/^https:\/\//, ''))}</code><button type="button" class="tog acc-cp" data-copia-url="${esc(url)}" aria-label="${esc(T('Copiar') + ' · ' + url)}"><span>${esc(T('COPIAR'))}</span></button></li>`;
  return `<div class="accesos"><p class="sub-t">${esc(T('ACCESOS DIRECTOS'))}</p><ul>${act ? ln(T(act.nom), WEB + '?mod=' + act.id, true) : ''}${ln('SYSTEMS', WEB, !act)}${otros.map((m) => ln(T(m.nom), WEB + '?mod=' + m.id)).join('')}</ul></div>`;
}
document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-copia-url]'); if (!b) return; const u = b.dataset.copiaUrl;
  const ok = () => { tostada(T('Dirección copiada: {u}', { u })); b.classList.add('hecho'); setTimeout(() => b.classList.remove('hecho'), 1500); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(u).then(ok, () => { tostada(u, 6000); }); else tostada(u, 6000); });

/* ---------- SIMPLE: preguntas (una sola o el asistente entero), con la ventana de SCREENS ---------- */
function raiz() { let r = $('#ss-asis'); if (!r) { r = document.createElement('div'); r.id = 'ss-asis'; r.className = 'ss ss-raiz'; document.body.appendChild(r); } return r; }
function asis(claves, full) { ASIS = { claves, i: 0, full, hist: [] }; pregunta(); }
function pregunta() {
  const el = raiz(); if (!ASIS) { el.innerHTML = ''; return; }
  const m = M(), k = ASIS.claves[ASIS.i], q = m.pregunta(k, R); if (!q) { siguiente(); return; }
  let cu = '', pie = '';
  if (ASIS.full && ASIS.i === 0) cu += `<p class="ss-hola">${esc(T('Hola. Te haré unas preguntas muy sencillas y te diré qué necesitas.'))}</p>`;
  cu += `<h2 class="ss-q" id="ss-q">${esc(T(q.q))}</h2>${q.ay ? `<p class="ss-ay">${esc(T(q.ay))}</p>` : ''}`;
  if (q.ops) { const n = q.ops.length; cu += `<div class="ss-ops ${n > 6 ? 'ss-ops3 ss-ops-lista' : n === 2 ? 'ss-ops2' : n === 4 ? 'ss-ops4' : 'ss-ops3'}">${q.ops.map((o, i) => `<button type="button" class="ss-op${String(o[0]) === String(q.val) ? ' on' : ''}" data-ss-op="${i}">${ic(o[3] || 'ok')}<span class="ss-op-t"><b class="ss-fit">${esc(T(o[1]))}</b>${o[2] ? `<small>${esc(T(o[2]))}</small>` : ''}</span></button>`).join('')}</div>`; }
  if (q.nums) { cu += `<div class="ss-nums">${q.nums.map((x) => `<label class="ss-num"><span class="ss-fit">${esc(T(x[1]))}</span><span class="ss-num-c"><input type="text" inputmode="decimal" data-ss-n="${x[0]}" value="${esc(x[2])}" data-min="${x[3]}" data-max="${x[4]}" aria-label="${esc(T(x[1]))}"><i>${esc(x[5] || '')}</i></span></label>`).join('')}</div>`;
    pie = `<button type="button" class="ss-sig" data-ss-ok><span class="ss-fit">${esc(T(ASIS.full && ASIS.i < ASIS.claves.length - 1 ? 'SIGUIENTE' : 'LISTO'))}</span></button>`; }
  const cont = ASIS.full ? `<span class="ss-paso">${esc(T('Paso {a} de {b}', { a: ASIS.i + 1, b: ASIS.claves.length }))}</span><span class="ss-puntos">${ASIS.claves.map((_, j) => `<i class="${j < ASIS.i ? 'ya' : j === ASIS.i ? 'on' : ''}"></i>`).join('')}</span>` : '<span></span>';
  const salir = ASIS.full ? `<button type="button" class="ss-mini ss-saltar" data-ss-fin>${esc(T('SALTAR'))}</button>` : `<button type="button" class="ss-x" data-ss-fin aria-label="${esc(T('Cerrar'))}">${ic('x')}</button>`;
  const atras = ASIS.hist.length ? `<button type="button" class="ss-mini" data-ss-atras>${esc(T('ATRÁS'))}</button>` : '';
  el.innerHTML = `<div class="ss-velo" data-ss-fin></div><div class="ss-dlg" role="dialog" aria-modal="true" aria-labelledby="ss-q"><div class="ss-dlg-cab">${cont}${salir}</div><div class="ss-dlg-cu">${cu}</div><div class="ss-dlg-pie">${atras}${pie}</div></div>`;
  el.querySelectorAll('.ss-fit').forEach((x) => { let fs = parseFloat(getComputedStyle(x).fontSize), k2 = 0; while (x.scrollWidth > x.clientWidth + 1 && fs > 7 && k2++ < 40) { fs -= .5; x.style.fontSize = fs + 'px'; } });
  const f = el.querySelector('.ss-op.on, input[data-ss-n], .ss-op, .ss-sig'); if (f) f.focus({ preventScroll: true });
}
function siguiente() { if (!ASIS) return; ASIS.hist.push(ASIS.i); ASIS.i++; if (ASIS.i >= ASIS.claves.length) { finAsis(); return; } pregunta(); }
function finAsis() { if (ASIS && ASIS.full) guarda('systems_asis_' + G.mod, 1); ASIS = null; pregunta(); EDITA = false; pinta(); }
function responde(v) { const m = M(), q = m.pregunta(ASIS.claves[ASIS.i], R); q.aplica(v); R = m.calcula(); if (ASIS.full) siguiente(); else finAsis(); }

/* ---------- eventos ---------- */
function cambiaModulo(id) { if (id === G.mod) return; G.mod = id; EDITA = true; const i = $('#pide'); if (i) { i.value = ''; G.texto = ''; } pinta(); if (G.vista === 'simple' && !lee('systems_asis_' + id)) asis(M().pasos(), true); }
function calcular() {
  const i = $('#pide'), t = (i ? i.value : '').trim(); G.texto = t;
  if (t) { const n = normaliza(t), cual = (M().reconoce && M().reconoce(n)) ? null : [VIDEO, CAMARAS, CONTROL, DISP, SENAL, ELEC, SONIDO, AUDIO].find((m) => m !== M() && m.reconoce && m.reconoce(n)); let ok = true; if (cual) { G.mod = cual.id; cual.pide(n); } else if (!M().pide(n)) { ok = false; tostada(T('No he entendido la petición: prueba con los botones o escríbela de otra forma.'), 5000); }
    /* v3.1 · una petición de sala con pantalla y sonido (p. ej. proyector y dos altavoces) prepara también el otro módulo, que queda listo en su pestaña */
    if (ok) { const par = [VIDEO, SONIDO].filter((m) => m !== M() && [VIDEO, SONIDO].includes(M()) && m.reconoce(n) && (m === SONIDO ? /altavo|altaveu|speaker|sonoriz|sonorit|sound system/.test(n) : /proyector|projector|proyecci|projecci|pantalla|screen|videoconf/.test(n)));
      par.forEach((m) => { m.pide(n); try { m.calcula(); } catch (e) {} }); if (par.length) setTimeout(() => tostada(T('También he preparado {m} con esta petición: está en su pestaña.', { m: T(par[0].corto) }), 6000), 400); } }
  EDITA = false; pinta();
  const b = $('#calcular'); b.classList.remove('pulso'); void b.offsetWidth; b.classList.add('pulso');
}
function ponVista(v) { G.vista = v === 'pro' ? 'pro' : 'simple'; document.querySelectorAll('[data-ss-swc]').forEach((c) => { c.checked = G.vista === 'pro'; }); document.querySelectorAll('.ss-bur').forEach((b) => { const pro = G.vista === 'pro'; b.dataset.ssSw = pro ? 'simple' : 'pro'; b.classList.toggle('pro', pro); b.innerHTML = '<i></i>' + (pro ? 'PRO' : 'SIMPLE'); }); document.querySelectorAll('[data-ss-sw]').forEach((b) => { if (b.closest('.ss-sw')) { const on = b.dataset.ssSw === G.vista; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); } }); pinta(); }
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.matches('[data-ss-swc]')) { ponVista(t.checked ? 'pro' : 'simple'); return; }
  if (t.dataset && t.dataset.num !== undefined) { M().num(t.dataset.num, parseFloat(String(t.value).replace(',', '.'))); pinta(); return; }
  if (t.dataset && t.dataset.sel !== undefined) { M().set(t.dataset.sel, t.value); pinta(); }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.id === 'pide') { calcular(); return; }
  if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-num]')) { e.target.blur(); return; }
  if (e.key === 'Enter' && e.target.matches && e.target.matches('#ss-asis input')) { const b = document.querySelector('[data-ss-ok]'); if (b) b.click(); return; }
  if (e.key === 'Escape') { if (ASIS) { ASIS = null; pregunta(); } else { const g = GRANDE; cierra(); if (g) pinta(); } }
});
document.addEventListener('click', (e) => {
  const q = (s) => e.target.closest(s); let b;
  if ((b = q('[data-ss-sw]'))) { e.preventDefault(); ponVista(b.dataset.ssSw); return; }
  if ((b = q('[data-mod]'))) { cambiaModulo(b.dataset.mod); return; }
  if (q('[data-nuevo]')) { M().reset(); G.texto = ''; const i = $('#pide'); if (i) i.value = ''; EDITA = true; pinta(); return; }
  if (q('[data-idioma]')) { fijarIdioma(IDIOMAS[(IDIOMAS.indexOf(idioma()) + 1) % IDIOMAS.length]); marco(); return; }
  if (q('button[data-tema]')) { G.tema = G.tema === 'claro' ? 'oscuro' : 'claro'; document.documentElement.dataset.tema = G.tema; guardaCasa(); return; }
  if (q('[data-salir-int]')) { e.preventDefault(); salirInterno(); return; }
  if ((b = q('.equipo')) && !q('a, button')) { const ref = b.querySelector('.ref'); if (ref && abreFicha(ref.textContent.trim())) return; }
  if (q('[data-pdf]')) { pdfDirecto(); return; }
  if (q('[data-info]')) { info(); if (movilV()) { const cu = document.querySelector('#velo .vent-cu'), hc = $('#hueco-comun'); if (cu && hc) { cu.insertAdjacentHTML('afterbegin', '<div class="fila info-comun" id="info-comun"></div>'); [...hc.children].filter((x) => !x.classList.contains('admin-esq')).forEach((x) => $('#info-comun').appendChild(x)); } } return; }
  if (q('[data-aviso-calc]') && movilV()) { tostada(T('Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.'), 6000); return; }
  if (q('[data-cierra]') || e.target.id === 'velo') { const g = GRANDE; cierra(); if (g) pinta(); return; }
  if (q('[data-grande]')) { verGrande(); return; }
  if (q('[data-proyecto]')) { ventanaProyecto(); return; }
  if (q('[data-proy-guarda]')) { PROY = { proy: ($('#pr-proy') || {}).value || '', cliente: ($('#pr-cli') || {}).value || '', obs: ($('#pr-obs') || {}).value || '' }; guarda('systems_proyecto', PROY); cierra(); tostada(T('Datos del proyecto guardados: salen en el PDF.')); return; }
  if (q('[data-proy-borra]')) { PROY = { proy: '', cliente: '', obs: '' }; guarda('systems_proyecto', PROY); cierra(); return; }
  if (q('#calcular')) { calcular(); return; }
  if (q('#pide-res')) { EDITA = true; pintaRes(); const i = $('#pide'); i.focus(); i.select(); return; }
  if (q('[data-copiatxt]')) { const r = $('#pide-res'), t = (r && !r.hidden ? r.textContent : $('#pide').value).trim(); if (!t) tostada(T('La casilla está vacía: no hay nada que copiar.')); else (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => tostada(T('Copiado.')), () => tostada(T('Este navegador no deja copiar desde aquí.'))); return; }
  if (q('[data-pega]')) { (navigator.clipboard && navigator.clipboard.readText ? navigator.clipboard.readText() : Promise.reject()).then((t) => { t = String(t || '').replace(/\s+/g, ' ').trim(); if (!t) { tostada(T('No hay texto copiado que pegar.')); return; } EDITA = true; pintaRes(); const i = $('#pide'); i.value = t.slice(0, 400); i.focus(); tostada(T('Petición pegada: pulsa CALCULAR.')); }, () => { EDITA = true; pintaRes(); $('#pide').focus(); tostada(T('Este navegador no deja pegar con el botón: usa Ctrl+V en la casilla.'), 5000); }); return; }
  /* SIMPLE */
  if ((b = q('[data-ss-q]'))) { asis([b.dataset.ssQ], false); return; }
  if (q('[data-asis]')) { asis(M().pasos(), true); return; }
  if (q('[data-ss-fin]')) { finAsis(); return; }
  if (q('[data-ss-atras]')) { ASIS.i = ASIS.hist.pop(); pregunta(); return; }
  if ((b = q('[data-ss-op]'))) { const qq = M().pregunta(ASIS.claves[ASIS.i], R); responde(qq.ops[+b.dataset.ssOp][0]); return; }
  if (q('[data-ss-ok]')) { const v = {}; let ok = true; document.querySelectorAll('#ss-asis input[data-ss-n]').forEach((i) => { const n = parseFloat(String(i.value).replace(',', '.')); if (!isFinite(n) || n < +i.dataset.min || n > +i.dataset.max) { ok = false; i.classList.add('mal'); } else v[i.dataset.ssN] = n; }); if (ok) responde(v); return; }
  /* PRO */
  if ((b = q('[data-set]'))) { M().set(b.dataset.set, b.dataset.v); pinta(); return; }
  if ((b = q('[data-pm]'))) { M().pm(b.dataset.pm, +b.dataset.d); pinta(); return; }
  if ((b = q('[data-acc]'))) { M().accion(b.dataset.acc, b); pinta(); return; }
});
document.addEventListener('input', (e) => { if (e.target.id === 'pide') { EDITA = true; G.texto = e.target.value; } });

/* ---------- arranque ---------- */
marco();
cargar(() => { if (!ASIS) pinta(); });
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
if (G.vista === 'simple' && !lee('systems_asis_' + G.mod)) asis(M().pasos(), true);
