// SYSTEMS · módulo ELECTRÓNICA: como en SCREENS, para UNA o VARIAS pantallas y para LED, PROYECCIÓN o DISPLAYS.
// LED: procesador, líneas, reparto de la señal, fibra con sus conversores CVT10 y backup (motor común de SCREENS, comun/electronica.js).
// PROYECCIÓN y DISPLAYS: conmutador (selector, distribuidor o matriz), blending, videowall y el cable o extensor de cada tramo.
// Solo con las marcas de las listas del panel. GPL-3.0 · mediaservi.com
import { T, TM, N, esc, textos, lee, guarda, togs, num, etq, lang } from './util.js';
import { equipos, esInterno, P as BP } from './listas.js';
import { tramo, conmutador, RES } from './conectividad.js';
import { TR_ELEC } from './tr-electronica.js';
import { html as softHTML, aplica as softAplica } from '../comun/software.js';   /* v3.5 · VNNOX y ViPlex con los reproductores NovaStar (de SCREENS) */
textos(TR_ELEC);
textos({
  /* v3.5 */
  'Fuente': ['Source', 'Font'], 'Un reproductor con controladora': ['A player with built-in controller', 'Un reproductor amb controladora'], 'Guarda los contenidos, sin ordenador': ['Stores the content, no computer', 'Desa els continguts, sense ordinador'], 'Ordenador': ['Computer', 'Ordinador'], 'Reproductor': ['Player', 'Reproductor'], 'Contenidos': ['Content', 'Continguts'],
  'Reproductor: guarda y reproduce los contenidos y lleva la controladora dentro, sin ordenador ni otro procesador.': ['Player: it stores and plays the content and has the controller built in, with no computer or other processor.', 'Reproductor: desa i reprodueix els continguts i porta la controladora a dins, sense ordinador ni cap altre processador.'],
  'Con un ordenador como fuente y un procesador, sí.': ['With a computer as the source and a processor, yes.', 'Amb un ordinador com a font i un processador, sí.'],
  'Ningún reproductor de la lista llega a {px} Mpx y {w} px de ancho.': ['No player in the list reaches {px} Mpx and {w} px wide.', 'Cap reproductor de la llista arriba a {px} Mpx i {w} px d\'ample.'],
  'ELECTRÓNICA': ['ELECTRONICS', 'ELECTRÒNICA'], 'Cable de red': ['Network cable', 'Cable de xarxa'], 'Full HD': ['Full HD', 'Full HD'], '1080p': ['1080p', '1080p'], 'Electrónica de pantalla': ['Display electronics', 'Electrònica de pantalla'],
  'Para quien ya tiene la pantalla y las fuentes: procesador LED, reparto de la señal, fibra y backup, o la señal hacia proyectores y displays.': ['For those who already have the screen and the sources: LED processor, signal split, fibre and backup, or the signal to projectors and displays.', 'Per a qui ja té la pantalla i les fonts: processador LED, repartiment del senyal, fibra i backup, o el senyal cap a projectors i displays.'],
  'Escríbela: «pantalla LED de 8960 x 1536 con 3 salidas DP por fibra»': ['Type it: “8960 x 1536 LED screen with 3 DP outputs over fibre”', 'Escriu-la: «pantalla LED de 8960 x 1536 amb 3 sortides DP per fibra»'],
  'Destino': ['Destination', 'Destinació'], 'UNA': ['ONE', 'UNA'], 'VARIAS': ['SEVERAL', 'DIVERSES'], 'LED': ['LED', 'LED'], 'PROYECCIÓN': ['PROJECTION', 'PROJECCIÓ'], 'DISPLAYS': ['DISPLAYS', 'DISPLAYS'],
  'Pantallas': ['Screens', 'Pantalles'], 'Salidas': ['Outputs', 'Sortides'], 'Monitores': ['Monitors', 'Monitors'], 'Pantalla {n}': ['Screen {n}', 'Pantalla {n}'], 'Cuántas': ['How many', 'Quantes'],
  'Proyectores': ['Projectors', 'Projectors'], 'Imagen': ['Image', 'Imatge'], 'La misma (espejo)': ['The same (mirror)', 'La mateixa (mirall)'], 'Distintas': ['Different', 'Diferents'], 'Una sola fundida (blending)': ['One blended image', 'Una sola fosa (blending)'],
  'Señal': ['Signal', 'Senyal'], 'Distancia al rack (m)': ['Distance to the rack (m)', 'Distància al rack (m)'], 'Fuentes': ['Sources', 'Fonts'], 'Número de fuentes': ['Number of sources', 'Nombre de fonts'],
  'Monitores': ['Monitors', 'Monitors'], 'Videowall': ['Video wall', 'Videowall'], 'Columnas': ['Columns', 'Columnes'], 'Filas': ['Rows', 'Files'], 'Tamaño (″)': ['Size (″)', 'Mida (″)'],
  'Uso': ['Use', 'Ús'], 'Interior': ['Indoor', 'Interior'], 'Escaparate': ['Shop window', 'Aparador'], 'Exterior': ['Outdoor', 'Exterior'], 'Interactivo': ['Interactive', 'Interactiu'], 'Tótem': ['Totem', 'Tòtem'],
  'Horas al día': ['Hours a day', 'Hores al dia'], 'Marca': ['Brand', 'Marca'], 'Todas': ['All', 'Totes'],
  'Esquema de la señal': ['Signal diagram', 'Esquema del senyal'], 'Conmutador': ['Switcher', 'Commutador'], 'Tramo': ['Run', 'Tram'], 'Cable o extensor': ['Cable or extender', 'Cable o extensor'],
  'Hay solución': ['There is a solution', 'Hi ha solució'], 'Hay solución, con avisos': ['There is a solution, with warnings', 'Hi ha solució, amb avisos'], 'No hay solución con estos datos': ['No solution with these values', 'No hi ha solució amb aquestes dades'],
  'No hay ningún display de las marcas del catálogo para {u} de {p}″.': ['No display from the catalogue brands for {u} at {p}″.', 'No hi ha cap display de les marques del catàleg per a {u} de {p}″.'],
  'Ningún equipo de blending de las listas llega a {n} proyectores {r}.': ['No blending unit in the lists reaches {n} {r} projectors.', 'Cap equip de blending de les llistes arriba a {n} projectors {r}.'],
  'Ninguna matriz de las listas llega a {a} × {b}: con tantas fuentes y destinos va AV sobre IP.': ['No matrix in the lists reaches {a} × {b}: with this many sources and destinations, use AV over IP.', 'Cap matriu de les llistes arriba a {a} × {b}: amb tantes fonts i destinacions va AV sobre IP.'],
  'Modo videowall del propio monitor: la imagen se reparte por la entrada y la salida en bucle de cada uno. Comprueba en la ficha cuántos admite en cadena a esa resolución.': ['The monitor’s own video wall mode: the image is passed through each one’s input and loop output. Check in the datasheet how many it chains at that resolution.', 'Mode videowall del mateix monitor: la imatge es reparteix per l\'entrada i la sortida en bucle de cadascun. Comprova a la fitxa quants n\'admet en cadena a aquesta resolució.'],
  'En stock': ['In stock', 'En estoc'], 'Bajo pedido': ['To order', 'Sota comanda'], 'monitores': ['monitors', 'monitors'], 'proyectores': ['projectors', 'projectors'],
  'Conversores de fibra': ['Fibre converters', 'Conversors de fibra'], 'junto a la pantalla': ['next to the screen', 'al costat de la pantalla'], 'fibra': ['fibre', 'fibra'],
  'Tamaño total': ['Total size', 'Mida total'], 'Diagonal': ['Diagonal', 'Diagonal'], 'Brillo': ['Brightness', 'Brillantor'], 'Resolución total': ['Total resolution', 'Resolució total'],
  'Equipo de blending': ['Blending unit', 'Equip de blending'], 'Tramos': ['Runs', 'Trams'], 'Display': ['Display', 'Display'], 'Señal de entrada': ['Input signal', 'Senyal d\'entrada'],
  '¿Qué quieres alimentar?': ['What do you want to feed?', 'Què vols alimentar?'], 'Una pantalla LED': ['An LED screen', 'Una pantalla LED'], 'Ya tiene sus cabinets': ['It already has its cabinets', 'Ja té els seus cabinets'],
  'Proyectores': ['Projectors', 'Projectors'], 'Monitores profesionales': ['Professional monitors', 'Monitors professionals'], 'SAMSUNG, LG o CLEVER': ['SAMSUNG, LG or CLEVER', 'SAMSUNG, LG o CLEVER'],
  '¿Cuántas?': ['How many?', 'Quantes?'], '¿Cuántos proyectores?': ['How many projectors?', 'Quants projectors?'], '¿Cuántos monitores?': ['How many monitors?', 'Quants monitors?'],
  '¿Qué ven?': ['What do they show?', 'Què mostren?'], '¿A qué distancia está el rack?': ['How far is the rack?', 'A quina distància és el rack?'], '¿Dónde van?': ['Where do they go?', 'On van?'],
  '¿De qué tamaño?': ['What size?', 'De quina mida?'], 'Metros': ['Metres', 'Metres'], 'Resolución de la pantalla {n}': ['Resolution of screen {n}', 'Resolució de la pantalla {n}'],
  'Ancho': ['Width', 'Amplada'], 'Alto': ['Height', 'Alçada'], 'Todas iguales': ['All the same', 'Totes iguals'], 'Cada una la suya': ['Each its own', 'Cadascuna la seva'],
  'Muro de monitores sin marcos': ['Bezel-less monitor wall', 'Mur de monitors sense marcs'], 'una imagen grande': ['one large image', 'una imatge gran'],
  'Se ve de cerca': ['Seen up close', 'Es veu de prop'], 'Mirando a la calle, con sol': ['Facing the street, in the sun', 'Mirant al carrer, amb sol'], 'A la intemperie': ['Out in the open', 'A la intempèrie'], 'Táctil, para reuniones y aulas': ['Touch, for meetings and classrooms', 'Tàctil, per a reunions i aules'], 'De pie, con peana': ['Standing, on a base', 'Dempeus, amb peanya'],
  'Resolución por proyector': ['Resolution per projector', 'Resolució per projector'], 'Resolución': ['Resolution', 'Resolució'], 'Por monitor': ['Per monitor', 'Per monitor'],
  'bisel': ['bezel', 'bisell'], 'cada': ['each', 'cada'], 'm de rack': ['m to the rack', 'm de rack'],
  'Con más de 4 pantallas, calcúlalas por grupos.': ['With more than 4 screens, work them out in groups.', 'Amb més de 4 pantalles, calcula-les per grups.'],
  'Necesita escalador o un procesador de varias capas si las fuentes no tienen la misma resolución.': ['A scaler or a multi-layer processor is needed if the sources do not share the same resolution.', 'Cal un escalador o un processador de diverses capes si les fonts no tenen la mateixa resolució.'],
  'Una sola marca de display en el proyecto: {m}.': ['A single display brand in the project: {m}.', 'Una sola marca de display al projecte: {m}.'],
});

/* ---------- estado ---------- */
const DEF = { fuenteL: 'pc', dest: 'led', cant: 'una', n: 2, pants: [[1920, 1080], [1920, 1080], [1920, 1080], [1920, 1080]], cab: false, resW: 1920, resH: 1080, cabW: 640, cabH: 384, nW: 3, nH: 3, hz: 60, salidas: 1, tipo: 'HDMI', maxSal: '4K', conexion: 'directo', backup: false, marca: 'todas',
  nproy: 2, modoP: 'espejo', resP: '4k', dist: 10, fuentes: 1, ndisp: 2, modoD: 'espejo', vwC: 2, vwF: 2, pulg: 55, uso: 'pared', horas: '24/7', marcaD: 'todas' };
let S = Object.assign({}, DEF, (lee('systems_elec2') || {}));
const guardaS = () => guarda('systems_elec2', S);
const NUMS = { resW: [1, 65536], resH: [1, 65536], cabW: [8, 4096], cabH: [8, 4096], nW: [1, 200], nH: [1, 200], salidas: [1, 16], n: [2, 4], nproy: [1, 16], dist: [1, 1000], fuentes: [1, 16], ndisp: [1, 32], vwC: [1, 10], vwF: [1, 10], pulg: [10, 120] };
const MAXS = { '4K': [3840, 2160], '2K': [1920, 1080] };
const COLS = ['#c6e04a', '#00b4ff', '#a033ff', '#ffb000', '#4fdc62', '#ff4d5e'];
const USOS = [['pared', 'Interior'], ['escaparate', 'Escaparate'], ['exterior', 'Exterior'], ['interactivo', 'Interactivo'], ['totem', 'Tótem']];
const E = () => globalThis.SC_ELEC;
function reparte(total, partes) { const b = Math.floor(total / partes), x = total % partes; return Array.from({ length: partes }, (_, i) => b + (i < x ? 1 : 0)); }

/* ---------- LED ---------- */
function corte(W, H, cab) {
  const [mw, mh] = MAXS[S.maxSal] || MAXS['4K'];
  let cols = Math.ceil(W / mw), rows = Math.ceil(H / mh), anchos, altos;
  for (;;) { anchos = cab ? reparte(S.nW, cols).map((c) => c * S.cabW) : reparte(W, cols); if (anchos.every((a) => a <= mw) || cols > 64) break; cols++; }
  for (;;) { altos = cab ? reparte(S.nH, rows).map((c) => c * S.cabH) : reparte(H, rows); if (altos.every((a) => a <= mh) || rows > 64) break; rows++; }
  return { cols, rows, anchos, altos, n: cols * rows };
}
function calcLED() {
  const el = E(), av = [], hz = S.hz || 60, pxPuerto = Math.round(el.ELEC_PX_PUERTO * 60 / hz);
  const una = S.cant === 'una', cab = una && S.cab;
  const P = una ? [[cab ? S.cabW * S.nW : S.resW, cab ? S.cabH * S.nH : S.resH]] : S.pants.slice(0, S.n);
  const pant = P.map(([W, H], i) => { const c = corte(W, H, cab); const lines = cab ? Math.ceil((S.nW * S.nH) / Math.max(1, Math.floor(pxPuerto / (S.cabW * S.cabH)))) : Math.ceil(W * H / pxPuerto); return Object.assign({ i, W, H, px: W * H, lines }, c); });
  if (pant.some((p) => !(p.W > 0 && p.H > 0))) return { error: T('Escribe la resolución de la pantalla.'), pant: [], av, sem: 'R' };
  const px = pant.reduce((a, p) => a + p.px, 0), lines = pant.reduce((a, p) => a + p.lines, 0), n = pant.reduce((a, p) => a + p.n, 0);
  const W = Math.max(...pant.map((p) => p.W)), H = Math.max(...pant.map((p) => p.H)), [mw, mh] = MAXS[S.maxSal] || MAXS['4K'];
  const r = { pant, px, lines, n, W, H, hz, pxPuerto, av, bk: S.backup ? 2 : 1, eq: pant.length === 1 ? Math.ceil(W / pant[0].cols) + ' × ' + Math.ceil(H / pant[0].rows) : '' };
  if (n > S.salidas) { r.faltan = true; r.error = T('Hacen falta {m} salidas (cada una llega como máximo a {r}) y la fuente tiene {n}.', { n: S.salidas, m: n, r: mw + ' × ' + mh }); }
  const st = { lines, totalPix: Math.round(px * hz / 60), resW: W, resH: H };
  const o = { escalador: n > 1 ? 'con' : 'indiferente', conexion: S.conexion, backup: S.backup, entradas: n, tipoEntrada: S.tipo, resEntrada: S.maxSal === '4K' && n > 1 ? '4K' : '' };
  /* v3.5 · la fuente puede ser un ordenador (procesador) o un reproductor con la controladora dentro (sin ordenador): entonces solo reproductores */
  const repro = S.fuenteL === 'repro' && una;
  let lista = el.calcularElectronicas(st, Object.assign({}, o, repro ? { escalador: 'indiferente', entradas: 1 } : {}), []).filter((x) => repro ? x.reproductor : !x.reproductor);
  if (S.marca !== 'todas') lista = lista.filter((x) => x.marca === S.marca);
  const menciona = (x) => x.modular || /^MX(2000|6000)/.test(x.key || '') || new RegExp(S.tipo === 'DP' ? '\\bDP\\b' : S.tipo).test(x.resumen || '');
  r.lista = lista; r.rec = repro ? lista[0] || null : lista.find(menciona) || lista[0] || null; r.repro = repro;
  if (repro) { if (r.faltan) { delete r.faltan; delete r.error; } r.n = 1; r.eq = '';
    if (r.rec) av.push(['info', T('Reproductor: guarda y reproduce los contenidos y lleva la controladora dentro, sin ordenador ni otro procesador.')]);
    else r.error = T('Ningún reproductor de la lista llega a {px} Mpx y {w} px de ancho.', { px: N(px / 1e6, 2), w: N(W) }) + ' ' + T('Con un ordenador como fuente y un procesador, sí.'); }
  else if (r.rec) { r.lista = [r.rec].concat(lista.filter((x) => x !== r.rec)); if (!menciona(r.rec)) av.push(['', T('La ficha de {m} no nombra entradas {t}: hará falta un adaptador activo o comprobarlo.', { m: r.rec.modelo, t: S.tipo })]); }
  if (!r.error && !r.rec) r.error = T('Ningún procesador de la lista llega a {px} Mpx y {w} px de ancho con {m} entradas {t}.', { px: N(px / 1e6, 1), w: N(W), m: n, t: S.tipo });
  /* v1.1 · conversores de fibra CVT10 (10 líneas cada uno) junto a la pantalla: los del despiece del procesador o, si no los trae, los que salen de las líneas */
  if (S.conexion === 'fibra') { const d = r.rec && (r.rec.equipos || []).find((e) => /CVT/i.test(e.ref || '')); r.cvt = d ? { n: d.cant, ref: d.ref } : { n: Math.ceil(lines * r.bk / 10), ref: 'CVT10' }; }
  if (!cab) av.push(['info', T('Líneas: mínimo teórico ({p} px por puerto a {hz} Hz). Con el cabinet salen las reales y el corte por columnas.', { p: N(pxPuerto), hz })]);
  if (n > 1 && !repro) av.push(['', T('La fuente tiene que sacar las {n} salidas sincronizadas: NVIDIA Mosaic (gráficas profesionales), Surround en GeForce (salidas iguales: {n} × {e}) o un reproductor que pinte en varias salidas.', { n, e: r.eq || (pant[0].anchos[0] + ' × ' + pant[0].altos[0]) })]);
  if (n > 1 && cab && !repro) av.push(['info', T('Corte por columnas de cabinet: {c}.', { c: pant[0].anchos.join(' + ') + ' px' + (pant[0].rows > 1 ? ' · ' + pant[0].altos.join(' + ') + ' px' : '') })]);
  if (!repro && (n > 1 || W > 3840)) av.push(['info', T('Comprueba en la ficha que las entradas aceptan {r} a medida.', { r: pant[0].anchos[0] + ' × ' + pant[0].altos[0] })]);
  if (S.conexion === 'directo') av.push(['info', T('Cable de red Cat6 de hasta 100 m por línea; si el rack está más lejos, fibra.')]);
  if (S.backup) av.push(['info', T('Backup 1:1: cada línea lleva su retorno en bucle, así que se doblan los puertos.')]);
  if (hz > 60) av.push(['info', T('Con {hz} Hz cada puerto carga menos píxeles ({p} px).', { hz, p: N(pxPuerto) })]);
  r.sem = r.error ? 'R' : av.some((a) => !a[0]) ? 'A' : 'V';
  return r;
}

/* ---------- PROYECCIÓN ---------- */
function calcProy() {
  const av = [], n = S.nproy, f = S.fuentes, rr = S.resP, r = { av, n, tramos: [] };
  if (S.modoP === 'blending') {
    const k = rr === '4k' ? 'k4' : 'wuxga', L = equipos(['switcher', 'mediaserver']).filter((x) => (+x[k] || 0) >= n).sort((a, b) => (+a[k]) - (+b[k]));
    r.blend = L[0] || null; r.alts = L.slice(1, 3);
    if (!r.blend) r.error = T('Ningún equipo de blending de las listas llega a {n} proyectores {r}.', { n, r: RES[rr].nom });
  } else {
    if (S.modoP === 'espejo' && f > 2 && n > 1) { r.sel = conmutador(f, 1, 'espejo', { gbps: RES[rr].gbps }); r.dist = conmutador(1, n, 'espejo', { gbps: RES[rr].gbps }); }
    else r.conm = conmutador(f, n, S.modoP, { gbps: RES[rr].gbps, lejos: S.dist > BP('senal.hdbtLejos', 15) });
    if (S.modoP === 'independiente' && !r.conm && (f > 1 || n > 1)) r.error = T('Ninguna matriz de las listas llega a {a} × {b}: con tantas fuentes y destinos va AV sobre IP.', { a: f, b: n });
  }
  const sale = r.conm || r.dist || r.blend; const hd = !!(sale && sale.hdbt && S.dist > BP('senal.hdbtLejos', 15));
  for (let i = 0; i < n; i++) r.tramos.push(tramo(S.dist, rr, { hdbtSale: hd }));
  if (S.modoP === 'independiente' && f > 1) av.push(['info', T('Necesita escalador o un procesador de varias capas si las fuentes no tienen la misma resolución.')]);
  r.tramos.filter((t) => t.nota).slice(0, 1).forEach((t) => av.push(['info', T(t.nota)]));
  r.sem = r.error ? 'R' : av.some((a) => !a[0]) ? 'A' : 'V';
  return r;
}

/* ---------- DISPLAYS ---------- */
function eligeDisplay() {
  const vw = S.modoD === 'videowall', uso = vw ? 'videowall' : S.uso;
  let L = equipos('display', S.marcaD).filter((x) => x.uso === uso || (uso === 'pared' && x.uso === 'tv'));
  if (!vw && S.horas === '24/7') { const h = L.filter((x) => x.horas === '24/7'); if (h.length) L = h; }
  if (!L.length) return { lista: [], rec: null };
  const tam = (x) => Math.abs((x.pulgadas || 0) - S.pulg);
  L.sort((a, b) => tam(a) - tam(b) || (b.stock ? 1 : 0) - (a.stock ? 1 : 0) || (vw ? (a.bisel || 9) - (b.bisel || 9) : 0) || (a.uso === 'tv') - (b.uso === 'tv') || (b.nits || 0) - (a.nits || 0));
  return { lista: L, rec: L[0] };
}
function calcDisp() {
  const av = [], vw = S.modoD === 'videowall', n = vw ? S.vwC * S.vwF : S.ndisp, f = S.fuentes, r = { av, n, tramos: [] };
  const d = eligeDisplay(); r.disp = d.rec; r.alts = d.lista.filter((x) => x.marca === (d.rec || {}).marca && x !== d.rec).slice(0, 3);
  if (!d.rec) r.error = T('No hay ningún display de las marcas del catálogo para {u} de {p}″.', { u: T((USOS.find((u) => u[0] === S.uso) || ['', S.uso])[1]).toLowerCase(), p: S.pulg });
  else av.push(['info', T('Una sola marca de display en el proyecto: {m}.', { m: d.rec.marca })]);
  const rr = d.rec && d.rec.res === 'FHD' ? '1080' : '4k';
  if (vw) { r.conm = f > 1 ? conmutador(f, 1, 'espejo', { gbps: RES[rr].gbps }) : null; r.tramos.push(tramo(S.dist, rr, {})); av.push(['', T('Modo videowall del propio monitor: la imagen se reparte por la entrada y la salida en bucle de cada uno. Comprueba en la ficha cuántos admite en cadena a esa resolución.')]); }
  else {
    if (S.modoD === 'espejo' && f > 2 && n > 1) { r.sel = conmutador(f, 1, 'espejo', { gbps: RES[rr].gbps }); r.dist = conmutador(1, n, 'espejo', { gbps: RES[rr].gbps }); }
    else r.conm = conmutador(f, n, S.modoD, { gbps: RES[rr].gbps, lejos: S.dist > BP('senal.hdbtLejos', 15) });
    if (S.modoD === 'independiente' && !r.conm && (f > 1 || n > 1)) r.error = T('Ninguna matriz de las listas llega a {a} × {b}: con tantas fuentes y destinos va AV sobre IP.', { a: f, b: n });
    const sale = r.conm || r.dist, hd = !!(sale && sale.hdbt && S.dist > BP('senal.hdbtLejos', 15));
    for (let i = 0; i < n; i++) r.tramos.push(tramo(S.dist, rr, { hdbtSale: hd }));
  }
  r.rr = rr;
  if (d.rec && vw) { const p = d.rec.pulgadas || S.pulg, w = p * 0.8716 * 0.0254, h = p * 0.4903 * 0.0254; r.tam = [w * S.vwC, h * S.vwF]; }
  r.tramos.filter((t) => t.nota).slice(0, 1).forEach((t) => av.push(['info', T(t.nota)]));
  r.sem = r.error ? 'R' : av.some((a) => !a[0]) ? 'A' : 'V';
  return r;
}

/* ---------- textos del resultado ---------- */
function calcula() {
  const r = S.dest === 'proy' ? calcProy() : S.dest === 'disp' ? calcDisp() : calcLED(); r.dest = S.dest;
  r.semTxt = r.error ? T('No hay solución con estos datos') : r.sem === 'A' ? T('Hay solución, con avisos') : T('Hay solución');
  if (S.dest === 'led') { r.lineaTxt = r.error || (r.rec ? r.rec.modelo + ' · ' + (r.repro ? T('Reproductor') : r.n + ' × ' + S.tipo) + ' · ' + (S.conexion === 'fibra' ? (r.cvt ? r.cvt.n + ' × ' + r.cvt.ref : T('fibra')) : r.lines * r.bk + ' ' + T('líneas')) : ''); r.linea = r.error ? esc(r.error) : `<b>${esc(r.rec ? r.rec.modelo : '—')}</b> · ${esc(r.repro ? T('Reproductor') : r.n + ' × ' + S.tipo)} · ${esc(S.conexion === 'fibra' && r.cvt ? r.cvt.n + ' × ' + r.cvt.ref : r.lines * r.bk + ' ' + T('líneas'))}`; }
  else if (S.dest === 'proy') { const c = r.blend || r.conm || r.dist; r.lineaTxt = r.error || ((c ? c.modelo + ' · ' : '') + r.n + ' ' + T('proyectores') + ' · ' + T(r.tramos[0].txt)); r.linea = r.error ? esc(r.error) : `${c ? `<b>${esc(c.modelo)}</b> · ` : ''}${esc(r.n + ' ' + T('proyectores'))} · ${esc(T(r.tramos[0].txt))}`; }
  else { r.lineaTxt = r.error || ((r.disp ? r.disp.marca + ' ' + r.disp.modelo : '') + ' · ' + r.n + ' ' + T('monitores')); r.linea = r.error ? esc(r.error) : `<b>${esc(r.disp ? r.disp.marca + ' ' + r.disp.modelo : '—')}</b> · ${esc(r.n + ' ' + T('monitores'))}${(r.conm || r.dist) ? ' · ' + esc((r.conm || r.dist).modelo) : ''}`; }
  guardaS(); return r;
}

/* ---------- esquemas ---------- */
const svgCaja = (x, y, w, h, tit, sub, borde = 'var(--linea)', fs = 20) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="var(--blk2)" stroke="${borde}" stroke-width="2"/><text x="${x + w / 2}" y="${y + (sub ? h / 2 - 4 : h / 2 + 7)}" text-anchor="middle" font-size="${fs}" font-weight="800" class="t">${esc(tit)}</text>${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 20}" text-anchor="middle" font-size="13" class="t-mono t-ten">${esc(sub)}</text>` : ''}`;
function esqLED(r, mov) {
  if (!r.pant || !r.pant.length) return '';
  const fib = S.conexion === 'fibra' && r.cvt, P = r.pant, k = r.n;
  if (mov) {   /* de arriba abajo en el móvil */
    const VW = 400; let y = 10, s = '';
    s += `<rect x="10" y="${y}" width="${VW - 20}" height="96" rx="10" fill="var(--blk2)" stroke="var(--linea)"/><text x="${VW / 2}" y="${y + 26}" text-anchor="middle" font-size="18" font-weight="800" class="t">${esc(T(r.repro ? 'Contenidos' : 'Fuente'))}</text>`;
    for (let i = 0; i < k; i++) { const x = 10 + (VW - 20) * (i + .5) / k, c = COLS[i % 6]; s += `<text x="${x}" y="${y + 56}" text-anchor="middle" font-size="${k > 4 ? 12 : 15}" class="t-mono">${esc(r.repro ? 'VNNOX · ViPlex' : S.tipo + ' ' + (i + 1))}</text><circle cx="${x}" cy="${y + 84}" r="6" fill="${c}"/><path d="M${x} ${y + 90} C ${x} ${y + 130}, ${VW / 2} ${y + 150}, ${VW / 2} ${y + 186}" fill="none" stroke="${c}" stroke-width="3"/>`; }
    y = 196; s += `<rect x="40" y="${y}" width="${VW - 80}" height="92" rx="10" fill="var(--blk2)" stroke="${r.rec ? 'var(--verde-txt)' : 'var(--rojo)'}" stroke-width="2"/><text x="${VW / 2}" y="${y + 26}" text-anchor="middle" font-size="13" font-weight="800" class="t-ten">${esc(T(r.repro ? 'Reproductor' : 'Procesador').toUpperCase())}</text><text x="${VW / 2}" y="${y + 62}" text-anchor="middle" font-size="24" font-weight="800" class="t-mar">${esc(r.rec ? r.rec.modelo : '—')}</text>`;
    y += 92;
    if (fib) { s += `<path d="M${VW / 2} ${y} L ${VW / 2} ${y + 50}" stroke="var(--azul)" stroke-width="3" stroke-dasharray="10 6"/><text x="${VW / 2 + 12}" y="${y + 32}" font-size="14" class="t-mono">${esc(T('fibra'))}</text>`; y += 50; s += svgCaja(60, y, VW - 120, 64, r.cvt.n + ' × ' + r.cvt.ref, T('junto a la pantalla'), 'var(--azul)', 19); y += 64; }
    s += `<path d="M${VW / 2} ${y} L ${VW / 2} ${y + 46}" stroke="var(--azul)" stroke-width="7"/><text x="${VW / 2 + 12}" y="${y + 30}" font-size="14" class="t-mono">${esc(r.lines * r.bk + ' ' + T('líneas') + ' RJ45')}</text>`; y += 56;
    P.forEach((p, j) => { const sw = 330, sh = Math.max(30, Math.min(150, sw * p.H / p.W)), sx = (VW - sw) / 2; let ax = sx; let idx = P.slice(0, j).reduce((a, q) => a + q.n, 0);
      for (let c = 0; c < p.cols; c++) { const w = sw * p.anchos[c] / p.W; let ay = y; for (let f2 = 0; f2 < p.rows; f2++) { const h = sh * p.altos[f2] / p.H, i = idx + f2 * p.cols + c, col = COLS[i % 6]; s += `<rect x="${ax}" y="${ay}" width="${w}" height="${h}" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="2"/>`; if (w > 26 && h > 18) s += `<text x="${ax + w / 2}" y="${ay + h / 2 + 5}" text-anchor="middle" font-size="15" class="t-mono">${i + 1}</text>`; ay += h; } ax += w; }
      y += sh + 24; s += `<text x="${VW / 2}" y="${y - 6}" text-anchor="middle" font-size="14" class="t-mono t-ten">${esc((P.length > 1 ? T('Pantalla {n}', { n: j + 1 }) + ' · ' : T('Pantalla LED') + ' · ') + N(p.W) + ' × ' + N(p.H) + ' px')}</text>`; y += 10; });
    return `<svg viewBox="0 0 ${VW} ${y + 6}" role="img" aria-label="${esc(T('Esquema de la señal'))}" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
  }
  const VW = 960, VH = 520, cy = VH / 2;
  const fx = 8, fw = 160, fh = Math.min(460, 80 + k * 46), fy = cy - fh / 2;
  const px0 = 250, pw = 180, ph = Math.max(150, Math.min(440, 70 + k * 44)), py = cy - ph / 2;
  const cvx = 520, cvw = 150, sx0 = fib ? 730 : 600, sw = VW - sx0 - 10;
  let s = svgCaja(fx, fy, fw, fh, '', '').replace('<text', '<text style="display:none"') + `<text x="${fx + fw / 2}" y="${fy + 28}" text-anchor="middle" font-size="20" font-weight="800" class="t">${esc(T(r.repro ? 'Contenidos' : 'Fuente'))}</text>`;
  const lab = (p, i) => p.anchos[i % p.cols] + '×' + p.altos[Math.floor(i / p.cols)];
  let i = 0; P.forEach((p) => { for (let z = 0; z < p.n; z++, i++) { const y = fy + 58 + i * ((fh - 70) / Math.max(1, k)) + ((fh - 70) / Math.max(1, k)) / 2, ty = py + 44 + i * ((ph - 56) / k) + ((ph - 56) / k) / 2, c = COLS[i % 6];
    s += `<circle cx="${fx + fw - 14}" cy="${y}" r="6" fill="${c}"/><text x="${fx + 14}" y="${y + 6}" font-size="17" class="t-mono">${esc(r.repro ? 'VNNOX' : S.tipo + ' ' + (i + 1))}</text><path d="M${fx + fw - 8} ${y} C ${fx + fw + 50} ${y}, ${px0 - 50} ${ty}, ${px0} ${ty}" fill="none" stroke="${c}" stroke-width="3"/>`;
    if (k <= 6) s += `<text x="${(fx + fw + px0) / 2}" y="${(y + ty) / 2 - 8}" text-anchor="middle" font-size="13" class="t-mono t-ten">${esc(lab(p, z))}</text>`; } });
  const nombre = r.rec ? r.rec.modelo : '—';
  s += `<rect x="${px0}" y="${py}" width="${pw}" height="${ph}" rx="10" fill="var(--blk2)" stroke="${r.rec ? 'var(--verde-txt)' : 'var(--rojo)'}" stroke-width="2"/><text x="${px0 + pw / 2}" y="${py + 28}" text-anchor="middle" font-size="13" font-weight="800" class="t-ten">${esc(T(r.repro ? 'Reproductor' : 'Procesador').toUpperCase())}</text><text x="${px0 + pw / 2}" y="${cy + 8}" text-anchor="middle" font-size="${nombre.length > 13 ? 18 : 22}" font-weight="800" class="t-mar">${esc(nombre)}</text>`;
  /* pantallas a la derecha, una debajo de otra */
  const hs = P.map((p) => Math.max(34, sw * p.H / p.W)), tot = hs.reduce((a, b) => a + b, 0) + (P.length - 1) * 40, esc2 = Math.min(1, (VH - 70) / tot);
  let y0 = cy - tot * esc2 / 2 + 6; i = 0;
  const ys = [];
  P.forEach((p, j) => { const sh = hs[j] * esc2, w0 = sw * Math.min(1, esc2 * 1.0001); let ax = sx0 + (sw - w0) / 2;
    for (let c = 0; c < p.cols; c++) { const w = w0 * p.anchos[c] / p.W; let ay = y0; for (let f2 = 0; f2 < p.rows; f2++) { const h = sh * p.altos[f2] / p.H, id = i + f2 * p.cols + c, col = COLS[id % 6]; s += `<rect x="${ax}" y="${ay}" width="${w}" height="${h}" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="2"/>`; if (w > 30 && h > 18) s += `<text x="${ax + w / 2}" y="${ay + h / 2 + 5}" text-anchor="middle" font-size="${Math.min(16, Math.max(10, w / 6))}" class="t-mono">${id + 1}</text>`; ay += h; } ax += w; }
    s += `<text x="${sx0 + sw / 2}" y="${y0 + sh + 18}" text-anchor="middle" font-size="13" class="t-mono t-ten">${esc((P.length > 1 ? T('Pantalla {n}', { n: j + 1 }) + ' · ' : '') + N(p.W) + ' × ' + N(p.H) + ' px')}</text>`;
    ys.push(y0 + sh / 2); y0 += sh + 40; i += p.n; });
  if (P.length === 1) s += `<text x="${sx0 + sw / 2}" y="${ys[0] - hs[0] * esc2 / 2 - 12}" text-anchor="middle" font-size="17" font-weight="800" class="t">${esc(T('Pantalla LED'))}</text>`;
  const lin = r.lines * r.bk + ' ' + T('líneas') + ' RJ45';
  if (fib) {   /* v1.1 · fibra hasta los conversores CVT10, que van junto a la pantalla, y de ahí cable de red a los cabinets */
    const ch = Math.min(150, 60 + r.cvt.n * 12), cyy = cy - ch / 2;
    s += `<path d="M${px0 + pw} ${cy} L ${cvx} ${cy}" stroke="var(--azul)" stroke-width="3" stroke-dasharray="10 6"/><text x="${(px0 + pw + cvx) / 2}" y="${cy - 14}" text-anchor="middle" font-size="14" class="t-mono">${esc(T('fibra'))}</text>`;
    s += `<rect x="${cvx}" y="${cyy}" width="${cvw}" height="${ch}" rx="10" fill="var(--blk2)" stroke="var(--azul)" stroke-width="2"/><text x="${cvx + cvw / 2}" y="${cy - 6}" text-anchor="middle" font-size="22" font-weight="800" class="t">${esc(r.cvt.n + ' × ' + r.cvt.ref)}</text><text x="${cvx + cvw / 2}" y="${cy + 18}" text-anchor="middle" font-size="12" class="t-mono t-ten">${esc(T('junto a la pantalla'))}</text>`;
    ys.forEach((yy) => { s += `<path d="M${cvx + cvw} ${cy} C ${cvx + cvw + 30} ${cy}, ${sx0 - 30} ${yy}, ${sx0} ${yy}" fill="none" stroke="var(--azul)" stroke-width="6"/>`; });
    s += `<text x="${cvx + cvw / 2}" y="${cyy + ch + 22}" text-anchor="middle" font-size="13" class="t-mono">${esc(lin)}</text>`;
  } else {
    ys.forEach((yy) => { s += `<path d="M${px0 + pw} ${cy} C ${px0 + pw + 80} ${cy}, ${sx0 - 80} ${yy}, ${sx0} ${yy}" fill="none" stroke="var(--azul)" stroke-width="7"/>`; });
    s += `<text x="${(px0 + pw + sx0) / 2}" y="${cy - 18}" text-anchor="middle" font-size="15" class="t-mono">${esc(lin)}</text>`;
  }
  if (S.backup) s += `<text x="${(px0 + pw + (fib ? cvx : sx0)) / 2}" y="${cy + 28}" text-anchor="middle" font-size="12" class="t-mono t-ten">${esc(T('con backup'))}</text>`;
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(T('Esquema de la señal'))}" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
}
/* fuentes → conmutador → destinos (proyectores o displays), con el cable o extensor de cada tramo */
function esqDistrib(r, mov) {
  const n = Math.min(r.n, 8), f = Math.min(S.fuentes, 8), proy = S.dest === 'proy', vw = S.dest === 'disp' && S.modoD === 'videowall';
  const caja = r.blend || r.conm || r.dist, VW = mov ? 420 : 960, VH = mov ? 640 : 520;
  let s = '';
  if (mov) {
    s += svgCaja(20, 10, VW - 40, 70, T('Fuentes'), f + ' × HDMI');
    let y = 100; if (caja || r.sel) { s += `<path d="M${VW / 2} 80 L ${VW / 2} ${y}" stroke="var(--verde-txt)" stroke-width="4"/>`; if (r.sel) { s += svgCaja(60, y, VW - 120, 70, r.sel.modelo, T('Conmutador'), 'var(--verde-txt)', 19); y += 90; s += `<path d="M${VW / 2} ${y - 20} L ${VW / 2} ${y}" stroke="var(--verde-txt)" stroke-width="4"/>`; } if (caja) { s += svgCaja(60, y, VW - 120, 80, caja.modelo, r.blend ? T('Equipo de blending') : T('Conmutador'), 'var(--verde-txt)', 20); y += 80; } }
    const tr = r.tramos[0] || { txt: '' }; y += 30; s += `<text x="${VW / 2}" y="${y}" text-anchor="middle" font-size="14" class="t-mono">${esc(T(tr.txt))}</text>`; y += 20;
    const cols = vw ? S.vwC : Math.min(n, 4), filas = vw ? S.vwF : Math.ceil(n / 4), cw = (VW - 40) / cols - 8, chh = vw ? cw * .5625 : 70;
    for (let i = 0; i < (vw ? S.vwC * S.vwF : n); i++) { const cx = 20 + (i % cols) * (cw + 8), cyy = y + 10 + Math.floor(i / cols) * (chh + 10); s += `<rect x="${cx}" y="${cyy}" width="${cw}" height="${chh}" rx="${vw ? 2 : 8}" fill="${COLS[i % 6]}" fill-opacity=".2" stroke="${COLS[i % 6]}" stroke-width="2"/><text x="${cx + cw / 2}" y="${cyy + chh / 2 + 6}" text-anchor="middle" font-size="15" class="t-mono">${i + 1}</text>`; }
    y += 20 + filas * (chh + 10);
    s += `<text x="${VW / 2}" y="${y + 6}" text-anchor="middle" font-size="14" class="t-mono t-ten">${esc(proy ? r.n + ' ' + T('proyectores') : r.disp ? r.disp.marca + ' ' + r.disp.modelo : '')}</text>`;
    return `<svg viewBox="0 0 ${VW} ${y + 20}" role="img" aria-label="${esc(T('Esquema de la señal'))}" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
  }
  const cy = VH / 2, fh = Math.min(440, 60 + f * 50), fy = cy - fh / 2;
  s += `<rect x="8" y="${fy}" width="150" height="${fh}" rx="10" fill="var(--blk2)" stroke="var(--linea)" stroke-width="2"/><text x="83" y="${fy + 28}" text-anchor="middle" font-size="19" font-weight="800" class="t">${esc(T('Fuentes'))}</text>`;
  const ysF = []; for (let i = 0; i < f; i++) { const y = fy + 50 + (i + .5) * (fh - 60) / f; ysF.push(y); s += `<text x="22" y="${y + 6}" font-size="16" class="t-mono">HDMI ${i + 1}</text><circle cx="142" cy="${y}" r="6" fill="${COLS[i % 6]}"/>`; }
  let x = 300; const cajaX = 300, cw = 200;
  if (r.sel) { s += svgCaja(260, cy - 50, 150, 100, r.sel.modelo, T('Conmutador'), 'var(--verde-txt)', 15); ysF.forEach((y, i) => { s += `<path d="M148 ${y} C 200 ${y}, 220 ${cy}, 260 ${cy}" fill="none" stroke="${COLS[i % 6]}" stroke-width="3"/>`; }); s += `<path d="M410 ${cy} L 440 ${cy}" stroke="var(--verde-txt)" stroke-width="4"/>`; x = 440; }
  if (caja) { const cx = r.sel ? 440 : cajaX; s += svgCaja(cx, cy - 70, r.sel ? 160 : cw, 140, caja.modelo, r.blend ? T('Equipo de blending') : T('Conmutador'), 'var(--verde-txt)', caja.modelo.length > 14 ? 16 : 19); if (!r.sel) ysF.forEach((y, i) => { s += `<path d="M148 ${y} C 220 ${y}, 240 ${cy}, ${cx} ${cy}" fill="none" stroke="${COLS[i % 6]}" stroke-width="3"/>`; }); x = cx + (r.sel ? 160 : cw); }
  else if (!r.sel) { x = 158; }
  /* destinos */
  const dx = 700, dw = VW - dx - 10, tr = r.tramos[0] || { txt: '' };
  if (vw) {
    const C = S.vwC, F = S.vwF, cw2 = Math.min(dw / C, (VH - 120) / F / .5625), ch2 = cw2 * .5625, x0 = dx + (dw - cw2 * C) / 2, y0 = cy - ch2 * F / 2;
    for (let a = 0; a < F; a++) for (let b = 0; b < C; b++) s += `<rect x="${x0 + b * cw2}" y="${y0 + a * ch2}" width="${cw2 - 2}" height="${ch2 - 2}" fill="var(--azul)" fill-opacity=".18" stroke="var(--azul)" stroke-width="2"/>`;
    s += `<path d="M${x} ${cy} L ${x0} ${cy}" stroke="var(--azul)" stroke-width="4"/><text x="${(x + x0) / 2}" y="${cy - 14}" text-anchor="middle" font-size="14" class="t-mono">${esc(T(tr.txt))}</text>`;
    s += `<text x="${x0 + cw2 * C / 2}" y="${y0 + ch2 * F + 24}" text-anchor="middle" font-size="14" class="t-mono t-ten">${esc(C + ' × ' + F + (r.disp ? ' · ' + r.disp.modelo : ''))}</text>`;
  } else {
    const hh = Math.min(70, (VH - 60) / n - 10), ysD = [];
    for (let i = 0; i < n; i++) { const y = cy - (n * (hh + 10)) / 2 + i * (hh + 10); ysD.push(y + hh / 2); s += proy ? `<rect x="${dx + 30}" y="${y + hh * .2}" width="${dw - 60}" height="${hh * .6}" rx="8" fill="var(--blk2)" stroke="${COLS[i % 6]}" stroke-width="2"/><circle cx="${dx + dw - 46}" cy="${y + hh / 2}" r="${hh * .18}" fill="none" stroke="${COLS[i % 6]}" stroke-width="2"/><text x="${dx + 50}" y="${y + hh / 2 + 5}" font-size="15" class="t-mono">${i + 1}</text>`
      : `<rect x="${dx + 20}" y="${y}" width="${dw - 40}" height="${hh}" rx="4" fill="${COLS[i % 6]}" fill-opacity=".2" stroke="${COLS[i % 6]}" stroke-width="2"/><text x="${dx + dw / 2}" y="${y + hh / 2 + 6}" text-anchor="middle" font-size="16" class="t-mono">${i + 1}</text>`; }
    ysD.forEach((y, i) => { s += `<path d="M${x} ${cy} C ${x + 80} ${cy}, ${dx - 60} ${y}, ${dx + (proy ? 30 : 20)} ${y}" fill="none" stroke="${COLS[i % 6]}" stroke-width="3" ${tr.tipo === 'hdbt' || tr.tipo === 'hdbt-int' ? '' : tr.tipo === 'fibra' || tr.tipo === 'fibra-c' ? 'stroke-dasharray="10 6"' : ''}/>`; });
    s += `<text x="${(x + dx) / 2 + 10}" y="${cy - 16}" text-anchor="middle" font-size="14" class="t-mono">${esc(T(tr.txt))}</text><text x="${(x + dx) / 2 + 10}" y="${cy + 26}" text-anchor="middle" font-size="13" class="t-mono t-ten">${esc(S.dist + ' ' + T('m de rack'))}</text>`;
    if (r.n > 8) s += `<text x="${dx + dw / 2}" y="${VH - 8}" text-anchor="middle" font-size="13" class="t-mono t-ten">+${r.n - 8}</text>`;
  }
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(T('Esquema de la señal'))}" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
}

/* ---------- resultado ---------- */
function equipoHTML(x, rec) {
  const filas = [[1, x.modular ? '' : x.modelo, x.resumen || '']].concat((x.equipos || []).filter((e) => e.cant > 0).map((e) => [e.cant, e.ref, e.desc]));
  return `<div class="equipo${rec ? ' rec' : ''}"><div class="eq-cab"><b>${esc(x.modelo)}</b><span class="serie">${esc(x.marca)}${x.serie ? ' · ' + esc(x.serie) : ''}</span>${rec ? `<span class="etq">${T('Recomendado').toUpperCase()}</span>` : ''}</div>
    <div class="eq-sub">${esc(TM(x.puertos))} · ${T('Capacidad')} ${esc(TM(x.capacidad))}</div>
    <table class="despiece">${filas.filter((f) => f[1]).map((f) => `<tr><td>${f[0]}×</td><td class="ref">${esc(f[1])}</td><td class="des">${esc(TM(f[2]))}</td></tr>`).join('')}</table>
    ${(x.urlFab || x.pdf) ? `<div class="eq-links">${x.urlFab ? `<a href="${esc(x.urlFab)}" target="_blank" rel="noopener">${T('Página del producto')} ↗</a>` : ''}${x.pdf ? `<a href="${esc(x.pdf)}" target="_blank" rel="noopener">${T('Ficha técnica')} ↗</a>` : ''}</div>` : ''}</div>`;
}
const eqSimple = (x, cant, tit, rec) => x ? `<div class="equipo${rec ? ' rec' : ''}"><div class="eq-cab"><b>${esc(x.modelo)}</b><span class="serie">${esc(x.marca)}${tit ? ' · ' + esc(T(tit)) : ''}</span>${rec ? `<span class="etq">${T('Recomendado').toUpperCase()}</span>` : ''}</div><table class="despiece"><tr><td>${cant}×</td><td class="ref">${esc(x.id || x.modelo)}</td><td class="des">${esc(x.descripcion || x.resumen || '')}${x.stock && esInterno() ? '<span class="st-int"> · ' + esc(T('En stock')) + '</span>' : ''}</td></tr></table></div>` : '';
function tablaTramos(r) {
  const g = {}; r.tramos.forEach((t) => { const k = t.txt + '|' + ((t.eq || {}).id || ''); g[k] = g[k] || { t, n: 0 }; g[k].n++; });
  return `<p class="alt-t">${esc(T('Tramos'))}</p><table class="tabla-v"><tr><th>${esc(T('Tramo'))}</th><th>${esc(T('Cable o extensor'))}</th><th></th></tr>${Object.values(g).map((x) => `<tr><td class="m">${x.n} × ${S.dist} m</td><td>${esc(T(x.t.txt))}</td><td class="m">${x.t.eq && x.t.eq.prioritario ? '⭐ ' : ''}${esc([x.t.eq && x.t.eq.id, x.t.eq2 && x.t.eq2.id, x.t.cat ? 'MC1000' : ''].filter(Boolean).join(' + '))}</td></tr>`).join('')}</table>`;
}
function resultado(r) {
  const tipo = r.error ? 'mal' : r.sem === 'A' ? 'aviso' : '';
  let h = `<div class="veredicto ${tipo}"><b>${esc(r.faltan ? T('Faltan salidas en la fuente') : r.semTxt)}</b><p>${esc(r.lineaTxt || '')}</p></div>`;
  if (S.dest === 'led') { if (r.rec) h += equipoHTML(r.rec, true); if (r.rec && softAplica(r.rec)) h += `<div class="soft-sys" data-soft="${esc(r.rec.key || r.rec.modelo || '')}">${softHTML(r.rec, lang())}</div>`; }
  else if (S.dest === 'proy') { h += eqSimple(r.blend, 1, 'Equipo de blending', true) + eqSimple(r.sel, 1, 'Conmutador', !r.blend) + eqSimple(r.conm || r.dist, 1, 'Conmutador', !r.blend && !r.sel) + tablaTramos(r); }
  else { h += eqSimple(r.disp, r.n, 'Display', true) + eqSimple(r.sel, 1, 'Conmutador') + eqSimple(r.conm || r.dist, 1, 'Conmutador') + tablaTramos(r); }
  if (r.av.length) h += `<ul class="avisos">${r.av.map((a) => `<li class="${a[0]}">${esc(a[1])}</li>`).join('')}</ul>`;
  const alts = S.dest === 'led' ? (r.lista || []).slice(1) : (r.alts || []);
  if (alts.length) h += `<p class="alt-t">${T('Alternativas')}</p>` + alts.map((x) => S.dest === 'led' ? equipoHTML(x, false) : eqSimple(x, S.dest === 'disp' ? r.n : 1, '', false)).join('');
  return h;
}
function cifras(r) {
  if (S.dest === 'led') { if (!r.pant || !r.pant.length) return [];
    return [{ t: 'Resolución total', v: N(r.px / 1e6, 2), u: 'Mpx', s: (r.pant.length > 1 ? r.pant.length + ' × ' : '') + N(r.W) + ' × ' + N(r.H) + ' px · ' + r.hz + ' Hz', ic: 'res', c: 'var(--verde-txt)' },
      { t: 'Líneas de datos', v: String(r.lines * r.bk), s: S.backup ? r.lines + ' + ' + r.lines + ' backup' : S.cab ? '' : T('mínimo teórico'), ic: 'red', c: 'var(--azul)' },
      r.repro ? { t: 'Contenidos', v: 'VNNOX', s: 'ViPlex Express · ViPlex Handy', ic: 'media', c: 'var(--violeta)' } : { t: 'Señal de entrada', v: String(r.n), u: '× ' + S.tipo, s: r.eq ? r.eq + ' px' : '', ic: 'media', c: 'var(--violeta)' },
      { t: r.repro ? 'Reproductor' : 'Procesador', v: r.rec ? r.rec.modelo : '—', s: r.rec ? TM(r.rec.capacidad) : '', ic: 'chip', c: 'var(--ambar)' },
      r.cvt ? { t: 'Conversores de fibra', v: String(r.cvt.n), u: '× ' + r.cvt.ref, s: T('junto a la pantalla'), ic: 'chispa', c: 'var(--azul)' } : null].filter(Boolean); }
  if (S.dest === 'proy') { const c = r.blend || r.conm || r.dist;
    return [{ t: 'Proyectores', v: String(r.n), s: T({ espejo: 'La misma (espejo)', independiente: 'Distintas', blending: 'Una sola fundida (blending)' }[S.modoP]), ic: 'proy', c: 'var(--verde-txt)' },
      { t: 'Fuentes', v: String(S.fuentes), u: '× HDMI', s: RES[S.resP].nom, ic: 'media', c: 'var(--violeta)' },
      { t: r.blend ? 'Equipo de blending' : 'Conmutador', v: c ? c.modelo : '—', s: c ? c.marca : '', ic: 'chip', c: 'var(--ambar)' },
      { t: 'Tramos', v: String(r.tramos.length), u: '× ' + S.dist + ' m', s: T((r.tramos[0] || {}).txt || ''), ic: 'red', c: 'var(--azul)' }]; }
  const d = r.disp, c = r.conm || r.dist;
  return [{ t: 'Display', v: d ? d.modelo : '—', s: d ? d.marca + ' · ' + (d.pulgadas || '') + '″ · ' + (d.res || '') : '', ic: 'tele', c: 'var(--verde-txt)' },
    { t: S.modoD === 'videowall' ? 'Videowall' : 'Monitores', v: S.modoD === 'videowall' ? S.vwC + ' × ' + S.vwF : String(r.n), s: r.tam ? N(r.tam[0], 2) + ' × ' + N(r.tam[1], 2) + ' m' : '', ic: 'regla', c: 'var(--azul)' },
    { t: 'Brillo', v: d && d.nits ? N(d.nits) : '—', u: 'nits', s: d ? (d.horas || '') : '', ic: 'sol', c: 'var(--ambar)' },
    { t: 'Conmutador', v: c ? c.modelo : '—', s: c ? c.marca : '', ic: 'chip', c: 'var(--violeta)' }];
}

/* ---------- datos (PRO) ---------- */
function datos() {
  const dest = `${togs('cant', [['una', 'UNA'], ['varias', 'VARIAS']], S.cant, 'dos')}${togs('dest', [['led', 'LED'], ['proy', 'PROYECCIÓN'], ['disp', 'DISPLAYS']], S.dest, '')}`;
  const fuentes = (con) => etq('Fuentes') + `<div class="nums">${num(con ? 'salidas' : 'fuentes', con ? 'Salidas' : 'Fuentes', con ? S.salidas : S.fuentes, '', 1, 1, 16)}${con ? `<select class="sel" data-sel="tipo" aria-label="${esc(T('Tipo de salida'))}">${['DP', 'HDMI', 'SDI'].map((t) => `<option value="${t}"${S.tipo === t ? ' selected' : ''}>${t === 'DP' ? 'DisplayPort' : t}</option>`).join('')}</select>` : ''}</div>`;
  if (S.dest === 'led') {
    const pant = S.cant === 'una'
      ? togs('cab', [[false, 'Resolución'], [true, 'Cabinets']], S.cab, 'dos') + (S.cab ? `<div class="nums">${num('cabW', 'Cabinet ancho (px)', S.cabW, 'px')}${num('cabH', 'Cabinet alto (px)', S.cabH, 'px')}${num('nW', 'Cabinets en ancho', S.nW, '')}${num('nH', 'Cabinets en alto', S.nH, '')}</div>` : `<div class="nums">${num('resW', 'Ancho (px)', S.resW, 'px')}${num('resH', 'Alto (px)', S.resH, 'px')}</div>`)
      : num('n', 'Cuántas', S.n, '', 1, 2, 4) + S.pants.slice(0, S.n).map((p, i) => `<p class="sub-t">${esc(T('Pantalla {n}', { n: i + 1 }))}</p><div class="nums">${num('pw' + i, 'Ancho (px)', p[0], 'px')}${num('ph' + i, 'Alto (px)', p[1], 'px')}</div>`).join('');
    return [{ tit: 'Destino', ic: 'led', html: dest + etq('Refresco') + togs('hz', [[50, '50 Hz'], [60, '60 Hz'], [120, '120 Hz']], S.hz), ac: 'var(--verde-txt)' },
      { tit: 'Pantalla', ic: 'regla', html: pant, ac: 'var(--azul)' },
      { tit: 'Fuentes', ic: 'media', html: (S.cant === 'una' ? togs('fuenteL', [['pc', 'Ordenador'], ['repro', 'Reproductor']], S.fuenteL, 'dos') : '') + (S.cant === 'una' && S.fuenteL === 'repro' ? '' : fuentes(true).replace(S.cant === 'una' ? /^<p class="sub-t">[^<]*<\/p>/ : /^$/, '') + etq('Máximo por salida') + togs('maxSal', [['4K', '4K'], ['2K', 'Full HD']], S.maxSal, 'dos')), ac: 'var(--violeta)' },
      { tit: 'Instalación', ic: 'red', html: togs('conexion', [['directo', 'Cable de red'], ['fibra', 'Fibra']], S.conexion, 'dos') + togs('backup', [[false, 'Sin backup'], [true, 'Backup 1:1']], S.backup, 'dos') + etq('Marca') + togs('marca', [['todas', 'Todas'], ['NOVASTAR', 'NOVASTAR'], ['COEX', 'COEX']], S.marca) + `<div class="pie-b"><button type="button" data-acc="reset">${esc(T('RESTABLECER'))}</button></div>`, ac: 'var(--ambar)' }];
  }
  if (S.dest === 'proy') return [{ tit: 'Destino', ic: 'proy', html: dest, ac: 'var(--verde-txt)' },
    { tit: 'Proyectores', ic: 'proy', html: num('nproy', 'Proyectores', S.nproy, '', 1, 1, 16) + etq('Imagen') + togs('modoP', [['espejo', 'La misma (espejo)'], ['independiente', 'Distintas'], ['blending', 'Una sola fundida (blending)']], S.modoP, 'uno'), ac: 'var(--azul)' },
    { tit: 'Fuentes', ic: 'media', html: fuentes(false) + etq('Resolución por proyector') + togs('resP', [['1080', '1080p'], ['4k', '4K']], S.resP, 'dos'), ac: 'var(--violeta)' },
    { tit: 'Instalación', ic: 'red', html: num('dist', 'Distancia al rack (m)', S.dist, 'm', 1, 1, 1000) + `<div class="pie-b"><button type="button" data-acc="reset">${esc(T('RESTABLECER'))}</button></div>`, ac: 'var(--ambar)' }];
  const vw = S.modoD === 'videowall';
  return [{ tit: 'Destino', ic: 'tele', html: dest + etq('Imagen') + togs('modoD', [['espejo', 'La misma (espejo)'], ['independiente', 'Distintas'], ['videowall', 'Videowall']], S.modoD, 'uno'), ac: 'var(--verde-txt)' },
    { tit: 'Monitores', ic: 'tele', html: (vw ? `<div class="nums">${num('vwC', 'Columnas', S.vwC, '', 1, 1, 10)}${num('vwF', 'Filas', S.vwF, '', 1, 1, 10)}</div>` : num('ndisp', 'Monitores', S.ndisp, '', 1, 1, 32)) + num('pulg', 'Tamaño (″)', S.pulg, '″', 1, 10, 120) + (vw ? '' : etq('Uso') + togs('uso', USOS, S.uso) + etq('Horas al día') + togs('horas', [['16/7', '16/7'], ['24/7', '24/7']], S.horas, 'dos')), ac: 'var(--azul)' },
    { tit: 'Fuentes', ic: 'media', html: fuentes(false) + etq('Marca') + togs('marcaD', [['todas', 'Todas'], ['SAMSUNG', 'SAMSUNG'], ['LG', 'LG'], ['CLEVER', 'CLEVER']], S.marcaD), ac: 'var(--violeta)' },
    { tit: 'Instalación', ic: 'red', html: num('dist', 'Distancia al rack (m)', S.dist, 'm', 1, 1, 1000) + `<div class="pie-b"><button type="button" data-acc="reset">${esc(T('RESTABLECER'))}</button></div>`, ac: 'var(--ambar)' }];
}

/* ---------- SIMPLE: lo que pides y sus preguntas ---------- */
const nomDest = () => ({ led: T('Una pantalla LED'), proy: T('Proyectores'), disp: T('Monitores profesionales') }[S.dest]);
function filas(r) {
  const f = [['dest', S.dest === 'led' ? 'led' : S.dest === 'proy' ? 'proy' : 'tele', 'Destino', nomDest() + (S.cant === 'varias' && S.dest === 'led' ? ' · ' + S.n : '')]];
  if (S.dest === 'led') {
    f.push(['tam', 'regla', 'Resolución', S.cant === 'una' ? (S.cab ? S.nW + ' × ' + S.nH + ' · ' + S.cabW + ' × ' + S.cabH + ' px' : N(S.resW) + ' × ' + N(S.resH) + ' px') : S.pants.slice(0, S.n).map((p) => p[0] + '×' + p[1]).join(' · ')]);
    const rp = S.fuenteL === 'repro' && S.cant === 'una';
    f.push(rp ? ['tipo', 'media', 'Fuente', T('Reproductor')] : ['tipo', 'media', 'Tipo de salida', S.tipo === 'DP' ? 'DisplayPort' : S.tipo], rp ? null : ['salidas', 'chispa', 'Salidas de la fuente', String(S.salidas)], ['conexion', 'dist', 'Instalación', T(S.conexion === 'fibra' ? 'Fibra' : 'Cable de red (< 100 m)')], ['backup', 'escudo', 'Backup', T(S.backup ? 'Backup 1:1' : 'Sin backup')]);
  } else if (S.dest === 'proy') {
    f.push(['nproy', 'proy', 'Proyectores', String(S.nproy)], ['modoP', 'sim', 'Imagen', T({ espejo: 'La misma (espejo)', independiente: 'Distintas', blending: 'Una sola fundida (blending)' }[S.modoP])], ['resP', 'calidad', 'Resolución', S.resP === '4k' ? '4K' : '1080p / WUXGA'], ['fuentes', 'media', 'Fuentes', String(S.fuentes)], ['dist', 'dist', 'Distancia al rack (m)', S.dist + ' m']);
  } else {
    f.push(['modoD', 'sim', 'Imagen', T({ espejo: 'La misma (espejo)', independiente: 'Distintas', videowall: 'Videowall' }[S.modoD])], ['ndisp', 'tele', 'Monitores', S.modoD === 'videowall' ? S.vwC + ' × ' + S.vwF : String(S.ndisp)], ['pulg', 'regla', 'Tamaño (″)', S.pulg + '″'], S.modoD === 'videowall' ? null : ['uso', 'casa', 'Uso', T((USOS.find((u) => u[0] === S.uso) || ['', ''])[1])], ['fuentes', 'media', 'Fuentes', String(S.fuentes)], ['dist', 'dist', 'Distancia al rack (m)', S.dist + ' m']);
  }
  return f.filter(Boolean);
}
function pasos() { return S.dest === 'led' ? (S.fuenteL === 'repro' && S.cant === 'una' ? ['dest', 'tam', 'tipo', 'conexion', 'backup'] : ['dest', 'tam', 'tipo', 'salidas', 'conexion', 'backup']) : S.dest === 'proy' ? ['dest', 'nproy', 'modoP', 'resP', 'fuentes', 'dist'] : ['dest', 'modoD', 'ndisp', 'pulg', 'uso', 'fuentes', 'dist']; }
const vol = (k) => (v) => { S[k] = v; };
function pregunta(k) {
  switch (k) {
    case 'dest': return { q: '¿Qué quieres alimentar?', val: S.dest, ops: [['led', 'Una pantalla LED', 'Ya tiene sus cabinets', 'led'], ['proy', 'Proyectores', '', 'proy'], ['disp', 'Monitores profesionales', 'SAMSUNG, LG o CLEVER', 'tele']], aplica: vol('dest') };
    case 'tam': if (S.cant === 'una') return { q: 'Resolución', nums: [['resW', 'Ancho (px)', S.resW, 1, 65536, 'px'], ['resH', 'Alto (px)', S.resH, 1, 65536, 'px']], aplica: (v) => { S.cab = false; Object.assign(S, v); } };
      return { q: 'Resolución', nums: S.pants.slice(0, S.n).flatMap((p, i) => [['pw' + i, T('Pantalla {n}', { n: i + 1 }) + ' · ' + T('Ancho'), p[0], 1, 65536, 'px'], ['ph' + i, T('Pantalla {n}', { n: i + 1 }) + ' · ' + T('Alto'), p[1], 1, 65536, 'px']]), aplica: (v) => Object.keys(v).forEach((x) => pon(x, v[x])) };
    case 'tipo': return { q: '¿Qué la alimenta?', val: S.fuenteL === 'repro' && S.cant === 'una' ? 'repro' : S.tipo, ops: [['DP', 'Un PC con DisplayPort', 'La mayoría de PC y gráficas', 'media'], ['HDMI', 'HDMI', 'Reproductor, PC o mediaserver', 'media'], ['SDI', 'SDI', 'Cámaras y realización', 'tele']].concat(S.cant === 'una' ? [['repro', 'Un reproductor con controladora', 'Guarda los contenidos, sin ordenador', 'chip']] : []),
      aplica: (v) => { if (v === 'repro') S.fuenteL = 'repro'; else { S.fuenteL = 'pc'; S.tipo = v; } } };   /* v3.5 · o un reproductor (NovaStar Taurus, TCC…) */
    case 'salidas': return { q: '¿Cuántas salidas tiene la fuente?', val: S.salidas, ops: [1, 2, 3, 4].map((v) => [v, String(v), T(v === 1 ? 'salida' : 'salidas'), 'chispa']), aplica: vol('salidas') };
    case 'conexion': return { q: '¿A qué distancia está el rack de la pantalla?', val: S.conexion, ops: [['directo', 'Menos de 100 m', 'Cable de red directo', 'red'], ['fibra', 'Más de 100 m', 'Por fibra', 'dist']], aplica: vol('conexion') };
    case 'backup': return { q: '¿Quieres backup de líneas?', val: String(S.backup), ops: [['false', 'No', 'Solo las líneas necesarias', 'x'], ['true', 'Sí, 1:1', 'Cada línea con su retorno', 'escudo']], aplica: (v) => { S.backup = v === 'true'; } };
    case 'nproy': return { q: '¿Cuántos proyectores?', val: S.nproy, ops: [1, 2, 3, 4, 6, 8].map((v) => [v, String(v), '', 'proy']), aplica: vol('nproy') };
    case 'modoP': return { q: '¿Qué ven?', val: S.modoP, ops: [['espejo', 'La misma (espejo)', '', 'sim'], ['independiente', 'Distintas', '', 'sim'], ['blending', 'Una sola fundida (blending)', '', 'sim']], aplica: vol('modoP') };
    case 'resP': return { q: 'Resolución por proyector', val: S.resP, ops: [['1080', '1080p / WUXGA', '', 'calidad'], ['4k', '4K', '', 'calidad']], aplica: vol('resP') };
    case 'fuentes': return { q: 'Número de fuentes', val: S.fuentes, ops: [1, 2, 3, 4, 6, 8].map((v) => [v, String(v), '', 'media']), aplica: vol('fuentes') };
    case 'dist': return { q: '¿A qué distancia está el rack?', nums: [['dist', 'Metros', S.dist, 1, 1000, 'm']], aplica: (v) => { S.dist = Math.round(v.dist); } };
    case 'modoD': return { q: '¿Qué ven?', val: S.modoD, ops: [['espejo', 'La misma (espejo)', '', 'tele'], ['independiente', 'Distintas', '', 'tele'], ['videowall', 'Videowall', 'Muro de monitores sin marcos', 'sim']], aplica: vol('modoD') };
    case 'ndisp': return S.modoD === 'videowall' ? { q: 'Videowall', nums: [['vwC', 'Columnas', S.vwC, 1, 10, ''], ['vwF', 'Filas', S.vwF, 1, 10, '']], aplica: (v) => { S.vwC = Math.round(v.vwC); S.vwF = Math.round(v.vwF); } } : { q: '¿Cuántos monitores?', val: S.ndisp, ops: [1, 2, 3, 4, 6, 8].map((v) => [v, String(v), '', 'tele']), aplica: vol('ndisp') };
    case 'pulg': return { q: '¿De qué tamaño?', val: S.pulg, ops: (S.modoD === 'videowall' ? [46, 49, 55] : [32, 43, 50, 55, 65, 75, 86, 98]).map((v) => [v, v + '″', '', 'regla']), aplica: vol('pulg') };
    case 'uso': return S.modoD === 'videowall' ? null : { q: '¿Dónde van?', val: S.uso, ops: [['pared', 'Interior', 'Se ve de cerca', 'casa'], ['escaparate', 'Escaparate', 'Mirando a la calle, con sol', 'escaparate'], ['exterior', 'Exterior', 'A la intemperie', 'calle'], ['interactivo', 'Interactivo', 'Táctil, para reuniones y aulas', 'mano'], ['totem', 'Tótem', 'De pie, con peana', 'persona']], aplica: vol('uso') };
  }
  return null;
}

/* ---------- cambios ---------- */
function pon(k, v) {
  const m = /^p([wh])(\d)$/.exec(k);
  if (m) { const i = +m[2], n = Math.max(1, Math.min(65536, Math.round(+v || 1))); S.pants[i] = S.pants[i].slice(); S.pants[i][m[1] === 'w' ? 0 : 1] = n; return; }
  if (NUMS[k]) { const [a, b] = NUMS[k]; S[k] = Math.max(a, Math.min(b, Math.round(+v || a))); return; }
  if (typeof DEF[k] === 'boolean') S[k] = v === true || v === 'true';
  else if (typeof DEF[k] === 'number') S[k] = +v;
  else S[k] = v;
}
function pide(t) {
  const s = t.toLowerCase().replace(/,/g, '.'); let ok = false;
  if (/proyector|projector|proyecci|blending/.test(s)) { S.dest = 'proy'; ok = true; } else if (/monitor|display|samsung|\blg\b|clever|videowall|video wall/.test(s)) { S.dest = 'disp'; ok = true; } else if (/\bled\b|pantalla|screen|nsign|procesador|cabinet/.test(s)) { S.dest = 'led'; ok = true; }
  const res = [...s.matchAll(/(\d{3,5})\s*[x×*]\s*(\d{3,5})/g)].map((m) => [+m[1], +m[2]]);
  if (res.length && S.dest !== 'disp') { ok = true; if (res.length === 1) { S.cant = 'una'; S.cab = false; S.resW = res[0][0]; S.resH = res[0][1]; } else { S.cant = 'varias'; S.n = Math.min(4, res.length); res.slice(0, 4).forEach((p, i) => { S.pants[i] = p; }); } }
  let m;
  if ((m = s.match(/(\d+)\s*(salidas?|outputs?|sortides?)/))) { S.salidas = Math.min(16, +m[1]); ok = true; }
  if (/\bdp\b|displayport/.test(s)) { S.tipo = 'DP'; ok = true; } else if (/hdmi/.test(s)) { S.tipo = 'HDMI'; } else if (/sdi/.test(s)) S.tipo = 'SDI';
  if (/reproductor|\bplayer\b|taurus|\btb\d|\btcc|\btu\d|sin (?:ordenador|pc)|without (?:a )?(?:computer|pc)|sense ordinador/.test(s)) { S.fuenteL = 'repro'; S.dest = 'led'; S.cant = res.length > 1 ? S.cant : 'una'; ok = true; } else if (/\bpc\b|ordenador|computer|ordinador|gr[aà]fica|displayport|\bdp\b/.test(s)) S.fuenteL = 'pc';
  if (/fibra|fiber|fibre/.test(s)) { S.conexion = 'fibra'; ok = true; } else if (/rj45|cable de red|cat6/.test(s)) S.conexion = 'directo';
  if (/backup|redundan/.test(s)) S.backup = !/sin backup|no backup/.test(s);
  if ((m = s.match(/(\d{2,3})\s*hz/))) S.hz = [50, 60, 120].includes(+m[1]) ? +m[1] : S.hz;
  if ((m = s.match(/(\d+)\s*(proyectores|projectors|projectors)/))) S.nproy = Math.min(16, +m[1]);
  if ((m = s.match(/(\d+)\s*(monitores|monitors|displays|pantallas)/)) && S.dest === 'disp') S.ndisp = Math.min(32, +m[1]);
  if ((m = s.match(/(\d)\s*[x×]\s*(\d)\b/)) && /videowall|video wall/.test(s)) { S.modoD = 'videowall'; S.vwC = +m[1]; S.vwF = +m[2]; }
  if ((m = s.match(/(\d{2,3})\s*(″|"|pulgadas|inch)/))) S.pulg = +m[1];
  if ((m = s.match(/(\d+)\s*m\b/)) && S.dest !== 'led') S.dist = Math.min(1000, +m[1]);
  if ((m = s.match(/(\d+)\s*(fuentes|sources|fonts)/))) S.fuentes = Math.min(16, +m[1]);
  if (/espejo|mirror|mismo|misma/.test(s)) { S.modoP = 'espejo'; if (S.modoD !== 'videowall') S.modoD = 'espejo'; } if (/distint|independ|different|matriz|matrix/.test(s)) { S.modoP = 'independiente'; S.modoD = 'independiente'; } if (/blending|fundid/.test(s)) S.modoP = 'blending';
  if (/4k/.test(s)) S.resP = '4k'; else if (/1080|full ?hd|wuxga/.test(s)) S.resP = '1080';
  if (/escaparate|window/.test(s)) S.uso = 'escaparate'; else if (/exterior|outdoor/.test(s)) S.uso = 'exterior'; else if (/interactiv|tactil|táctil|touch/.test(s)) S.uso = 'interactivo'; else if (/totem|tótem/.test(s)) S.uso = 'totem';
  if (/samsung/.test(s)) S.marcaD = 'SAMSUNG'; else if (/\blg\b/.test(s)) S.marcaD = 'LG'; else if (/clever/.test(s)) S.marcaD = 'CLEVER';
  return ok;
}
const reconoce = (t) => /\bled\b|proyector|projector|display|monitor|videowall|procesador|novastar|cabinet/i.test(t);

export default {
  id: 'elec', nom: 'Electrónica de pantalla', corto: 'ELECTRÓNICA', ic: 'led', ejemplo: 'Escríbela: «pantalla LED de 8960 x 1536 con 3 salidas DP por fibra»',
  info: 'Para quien ya tiene la pantalla y las fuentes: procesador LED, reparto de la señal, fibra y backup, o la señal hacia proyectores y displays.',
  calcula, filas, pasos, pregunta, datos, resultado, cifras, pide, reconoce,
  esquema: (r, o = {}) => ({ tit: 'Esquema de la señal', ic: 'senal', html: S.dest === 'led' ? esqLED(r, !!o.vertical) : esqDistrib(r, !!o.vertical) }),
  set: (k, v) => { if (k === 'cant' && v === 'varias' && S.dest === 'led') S.cab = false; pon(k, v); },
  num: (k, v) => pon(k, v),
  pm: (k, d) => { const m = /^p([wh])(\d)$/.exec(k), cur = m ? S.pants[+m[2]][m[1] === 'w' ? 0 : 1] : +S[k]; pon(k, cur + d * (['dist'].includes(k) ? 5 : 1)); },
  accion: (a) => { if (a === 'reset') S = Object.assign({}, DEF, { dest: S.dest }); },
  reset: () => { S = Object.assign({}, DEF); },
};
