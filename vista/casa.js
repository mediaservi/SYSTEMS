// SYSTEMS · la casa: la misma consola de SCREENS (cabecera, barra de módulos, petición escrita, CALCULAR, SIMPLE / PRO y pie)
// para todos los módulos (ELECTRÓNICA, SEÑAL Y CONECTIVIDAD, AUDIO, VIDEOCONFERENCIA y los que vengan). Cada módulo da sus datos,
// su esquema, su resultado y sus cifras; aquí se pintan siempre en los mismos sitios. Licencia GPL-3.0 · mediaservi.com
import { IDIOMAS, idioma, fijarIdioma, idiomaInicial } from '../textos.js';
import { T, textos, esc, $, lee, guarda } from './util.js';
import { IC, ic, icb } from './iconos.js';
import ELEC from './mod-electronica.js';
import SENAL from './mod-senal.js';
import AUDIO from './mod-audio.js';
import VIDEO from './mod-video.js';
import DISP from './mod-display.js';
import { cargar } from './listas.js';

export const VERSION = 'v1.5';
const ADMIN_URL = 'https://script.google.com/macros/s/AKfycbwkc12y4LODbFe-kQidnR2MbbA6cbW1WbhU3UiqmDmshx-ncAdGYrFRy8PNjm9Wg6Mx3w/exec';
const MODS = [ELEC, DISP, SENAL, AUDIO, VIDEO];   // v1.4 · DISPLAYS, pestaña propia para señalética y digital signage
fijarIdioma(idiomaInicial());

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
  'Restablecer': ['Reset', 'Restablir'],
  'SALTAR': ['SKIP', 'SALTAR'], 'SIGUIENTE': ['NEXT', 'SEGÜENT'], 'LISTO': ['DONE', 'FET'], 'ATRÁS': ['BACK', 'ENRERE'], 'Cerrar': ['Close', 'Tancar'],
  'Paso {a} de {b}': ['Step {a} of {b}', 'Pas {a} de {b}'],
  'Hola. Te haré unas preguntas muy sencillas y te diré qué necesitas.': ['Hi. I will ask you a few very simple questions and tell you what you need.', 'Hola. Et faré unes preguntes molt senzilles i et diré què necessites.'],
  'Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.': ['Automatic calculation that may contain errors: check it before quoting or installing.', 'Càlcul automàtic que pot contenir errors: revisa\'l abans de pressupostar o instal·lar.'],
  'Panel de administración': ['Admin panel', 'Panell d\'administració'],
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
try { const q = new URLSearchParams(location.search).get('mod'); if (q && ['elec', 'disp', 'senal', 'audio', 'video'].includes(q)) G.mod = q; } catch (e) {}
const M = () => MODS.find((m) => m.id === G.mod) || MODS[0];
const guardaCasa = () => guarda('systems_casa', G);
let R = null, EDITA = true, ASIS = null;
const NOMBRE = { es: 'Español', en: 'Inglés', ca: 'Catalán' };

/* ---------- piezas ---------- */
const bt = (k, tit, attrs = '', cls = 'g') => `<button type="button" class="ic-bt ${cls}" title="${esc(T(tit))}" aria-label="${esc(T(tit))}" ${attrs}>${k === 'info' ? '<span class="ic ic-info"></span>' : IC[k] || icb(k)}</button>`;
const blk = (area, id, tit, ac, cuerpo, extra = '', cls = '', icK = '') => `<section class="blk ${cls}" style="grid-area:${area};--ac:${ac}" data-blk="${id}"><header class="blk-cab">${icK ? `<i class="blk-ic" aria-hidden="true">${icb(icK)}</i>` : ''}<b>${tit}</b><span class="sep"></span>${extra}<span class="id">${id}</span></header><div class="blk-cu">${cuerpo}</div></section>`;
const sw = () => { const pro = G.vista === 'pro'; return `<div class="ss-sw" role="group" aria-label="${esc(T('Modo SIMPLE o PRO'))}" title="${esc(T('Modo SIMPLE o PRO'))}" data-crudo><button type="button" class="ss-sw-e${pro ? '' : ' on'}" data-ss-sw="simple" aria-pressed="${!pro}">SIMPLE</button><label class="ss-sw-t"><input type="checkbox" data-ss-swc aria-label="PRO"${pro ? ' checked' : ''}><span class="ss-sw-p"><span class="ss-sw-b"></span></span></label><button type="button" class="ss-sw-e${pro ? ' on' : ''}" data-ss-sw="pro" aria-pressed="${pro}">PRO</button></div>`; };
const COL = ['var(--azul)', 'var(--violeta)', 'var(--magenta, #e24bf0)', 'var(--ambar)', 'var(--verde)', 'var(--rojo)'];

/* ---------- la plantilla (calcada de SCREENS) ---------- */
function marco() {
  const l = idioma(), sig = IDIOMAS[(IDIOMAS.indexOf(l) + 1) % IDIOMAS.length], tIdi = `${T(NOMBRE[l])} → ${T(NOMBRE[sig])}`;
  document.documentElement.lang = l; document.documentElement.dataset.tema = G.tema === 'claro' ? 'claro' : 'oscuro';
  const fam = `<a href="https://screens.mediaservi.com/"><img class="t-osc" src="assets/fam/screens-logo.svg" alt="SCREENS"><img class="t-cla" src="assets/fam/screens-logo-claro.svg" alt="SCREENS"></a><a href="https://adposter.mediaservi.com/"><img class="t-osc" src="assets/fam/adposter-logo.svg" alt="ADPOSTER"><img class="t-cla" src="assets/fam/adposter-logo-claro.svg" alt="ADPOSTER"></a><a class="av" href="https://avhub.mediaservi.com/"><img class="t-osc" src="assets/avhub-logo.svg" alt="AVHUB"><img class="t-cla" src="assets/avhub-logo-claro.svg" alt="AVHUB"></a><a href="https://vjshow.mediaservi.com/"><img class="t-osc" src="assets/fam/vjshow-logo.svg" alt="VJSHOW"><img class="t-cla" src="assets/fam/vjshow-logo-claro.svg" alt="VJSHOW"></a><a href="https://msgame.mediaservi.com/"><img src="assets/fam/msgame-logo.svg?v=5" alt="MSGAME"></a>`;
  const modTog = (m) => `<button type="button" class="tog" aria-pressed="${m.id === G.mod}" data-mod="${m.id}" title="${esc(T(m.nom))}">${icb(m.ic)}<span>${esc(T(m.corto))}</span></button>`;
  $('#app').innerHTML = `<header class="im-cab" aria-hidden="true"><img class="im-logo" src="assets/systems-logo-claro.svg" alt="SYSTEMS"><div class="im-url"><span id="im-fecha">systems.mediaservi.com</span></div><img class="im-avhub" src="assets/avhub-logo-claro.svg" alt="AVHUB"></header><div class="blocks">
    <header class="franja f-h1"><div data-blk="H1L"><button type="button" data-nuevo title="${esc(T('Nuevo cálculo: lo deja todo como al empezar'))}" aria-label="SYSTEMS" style="display:flex;border:0;background:none;padding:0"><img class="logo t-osc" src="assets/systems-logo.svg" alt="SYSTEMS"><img class="logo t-cla" src="assets/systems-logo-claro.svg" alt="SYSTEMS"></button>${sw()}</div>
      <nav data-blk="H1C" class="fam" aria-label="AVHUB">${fam}</nav>
      <div data-blk="H1R" class="h1r">${bt('info', 'Qué es esto y cómo se usa', 'data-info')}${bt('pdf', 'Ver o imprimir el PDF del proyecto', 'data-pdf')}${bt('nuevo', 'Nuevo cálculo: lo deja todo como al empezar', 'data-nuevo')}<button type="button" class="ic-bt g" data-idioma data-crudo title="${esc(tIdi)}" aria-label="${esc(tIdi)}" style="position:relative"><span class="ic ic-lang"></span><small class="cod">${l.toUpperCase()}</small></button>${bt('tema', 'Cambiar entre gris oscuro y gris claro', 'data-tema')}</div></header>
    <div class="franja f-hm"><div data-blk="HM1"><div class="fila grupo" style="flex:2">${modTog(MODS[0])}${modTog(MODS[1])}</div><div class="fila grupo" style="flex:3">${MODS.slice(2).map(modTog).join('')}</div></div>
      <div data-blk="HM2">${bt('pega', 'Pegar una petición copiada', 'data-pega')}<div class="pide-caja"><input class="pide" id="pide" type="text" autocomplete="off" spellcheck="false" placeholder="" aria-label="" value="${esc(G.texto)}"><button type="button" class="pide-res" id="pide-res" hidden title="${esc(T('Resultado del cálculo. Toca para escribir otra petición'))}"></button></div>${bt('copia', 'Copiar el texto de la casilla (la petición o el resultado)', 'data-copiatxt')}</div>
      <div data-blk="HM3"><button type="button" class="calcular" id="calcular">${esc(T('CALCULAR'))} →</button></div></div>
    <main id="cuerpo"></main>
    <footer class="franja f-f1"><div data-blk="F1L" id="pie-l"><span class="nota"><svg class="av-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.6 2.4 20.2h19.2z"/><path d="M12 9.6v5"/><path d="M12 17.6h.01"/></svg><span>${esc(T('Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.'))}</span></span></div><div data-blk="F1C" id="pie-c" class="f-cred" data-crudo></div><div data-blk="F1R" class="f1r" id="hueco-comun"></div><a class="admin-esq" href="${ADMIN_URL}" target="_blank" rel="noopener" title="${esc(T('Panel de administración'))}" aria-label="${esc(T('Panel de administración'))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></a></footer>
  </div><div class="velo" id="velo"></div><div class="tostada" id="tostada" role="status" aria-live="polite"></div>`;
  pintaPie();
  const r = $('#hueco-comun');
  if (window.AVINSTALA) r.appendChild(window.AVINSTALA.boton({ app: 'SYSTEMS', idioma, sw: 'sw.js' }));
  if (window.AVFALLO) r.appendChild(window.AVFALLO.boton({ app: 'SYSTEMS', version: VERSION, idioma }));
  pinta();
}
/* v1.3 · PDF: hoja en claro con la cabecera de SCREENS (logo de SYSTEMS · web y fecha · logo de AVHUB) y el pie de la app */
function imprimir() {
  const hoy = new Date(), l = idioma(), fecha = hoy.toLocaleDateString(l === 'en' ? 'en-GB' : 'es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' · ' + hoy.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const txt = 'systems.mediaservi.com · ' + fecha, f = $('#im-fecha'); if (f) { f.textContent = txt; f.parentElement.style.setProperty('--n', txt.length); }
  const tema = document.documentElement.dataset.tema; document.documentElement.dataset.tema = 'claro';
  const vuelve = () => { document.documentElement.dataset.tema = tema; removeEventListener('afterprint', vuelve); };
  addEventListener('afterprint', vuelve); window.print(); setTimeout(() => { if (!matchMedia('print').matches) vuelve(); }, 1500);
}
function pintaPie() { const p = $('#pie-c'); if (p) p.innerHTML = window.AVCREDITO ? window.AVCREDITO.html('SYSTEMS', VERSION, idioma()) : `SYSTEMS ${VERSION} ${new Date().getFullYear()} · <a href="https://mediaservi.com/" target="_blank" rel="noopener">mediaservi.com</a>`; }
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
      <section class="ss-blk ss-sim" id="ss-sim"><h2 class="ss-tit">${ic(esq.ic || 'sim')}<span class="ss-fit">${esc(T(esq.tit))}</span></h2><div class="ss-lienzo">${esq.html}</div></section>
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
    h += blk('s1a', 'S1A', esc(T(esq.tit)), 'var(--verde-txt)', `<div class="lienzo-s">${esq.html}</div>`, esq.extra || '', 'pant', esq.ic || 'sim');
    h += blk('s1b', 'S1B', esc(T('Resultado')), 'var(--violeta)', m.resultado(R), '', '', 'res');
    'abcdef'.split('').forEach((x, i) => { const q = cif[i];
      h += q ? blk('m3' + x, 'M3' + x.toUpperCase(), esc(T(q.t)), q.c || COL[i], `<div class="cif-v">${esc(q.v)}${q.u ? `<small>${esc(q.u)}</small>` : ''}</div>${q.s ? `<div class="cif-s">${esc(q.s)}</div>` : ''}`, '', 'res', q.ic)
        : blk('m3' + x, 'M3' + x.toUpperCase(), '&nbsp;', COL[i], '<div class="cif-v">—</div>', '', 'res vacio'); });
    c.innerHTML = h;
  }
  if (m.despues) m.despues(c, R);
  pintaRes(); guardaCasa(); ajusta();
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
const cierra = () => { const v = $('#velo'); v.classList.remove('on'); v.innerHTML = ''; };
function info() {
  ventana('SYSTEMS', `<p>${esc(T('Calcula la electrónica, la señal, el audio y la videoconferencia de un proyecto con los equipos de las marcas del catálogo.'))}</p><p>${esc(T('Elige arriba el módulo. En SIMPLE te pregunto lo justo y te doy la solución; en PRO ves y cambias todos los datos, el esquema y el despiece.'))}</p><p>${esc(T('También puedes escribir lo que necesitas en la casilla y pulsar CALCULAR.'))}</p><p class="nota">${esc(T('Solo se calcula y se propone con las marcas y los fabricantes de las listas del panel.'))}</p>` +
    MODS.map((m) => `<p><b>${esc(T(m.nom))}</b> · ${esc(T(m.info))}</p>`).join(''));
}

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
  if (t) { const ok = M().pide(t); if (!ok) { const otro = MODS.find((m) => m !== M() && m.reconoce && m.reconoce(t)); if (otro) { G.mod = otro.id; otro.pide(t); } else tostada(T('No he entendido la petición: prueba con los botones o escríbela de otra forma.'), 5000); } }
  EDITA = false; pinta();
  const b = $('#calcular'); b.classList.remove('pulso'); void b.offsetWidth; b.classList.add('pulso');
}
function ponVista(v) { G.vista = v === 'pro' ? 'pro' : 'simple'; document.querySelectorAll('[data-ss-swc]').forEach((c) => { c.checked = G.vista === 'pro'; }); document.querySelectorAll('[data-ss-sw]').forEach((b) => { if (b.closest('.ss-sw')) { const on = b.dataset.ssSw === G.vista; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); } }); pinta(); }
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
  if (e.key === 'Escape') { if (ASIS) { ASIS = null; pregunta(); } else cierra(); }
});
document.addEventListener('click', (e) => {
  const q = (s) => e.target.closest(s); let b;
  if ((b = q('[data-ss-sw]'))) { e.preventDefault(); ponVista(b.dataset.ssSw); return; }
  if ((b = q('[data-mod]'))) { cambiaModulo(b.dataset.mod); return; }
  if (q('[data-nuevo]')) { M().reset(); G.texto = ''; const i = $('#pide'); if (i) i.value = ''; EDITA = true; pinta(); return; }
  if (q('[data-idioma]')) { fijarIdioma(IDIOMAS[(IDIOMAS.indexOf(idioma()) + 1) % IDIOMAS.length]); marco(); return; }
  if (q('button[data-tema]')) { G.tema = G.tema === 'claro' ? 'oscuro' : 'claro'; document.documentElement.dataset.tema = G.tema; guardaCasa(); return; }
  if (q('[data-pdf]')) { imprimir(); return; }
  if (q('[data-info]')) { info(); return; }
  if (q('[data-cierra]') || e.target.id === 'velo') { cierra(); return; }
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
