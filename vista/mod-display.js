// SYSTEMS · módulo DISPLAYS: señalética y digital signage. Por el sitio (interior, escaparate, exterior, tótem, videowall, táctil…),
// el tamaño, las horas al día, la orientación y el reproductor, el display de las listas del panel (SAMSUNG, LG y CLEVER) que lo cumple.
// Elección: el que cumple y está en stock; a igualdad, el orden de marcas SAMSUNG > LG > CLEVER (o la marca que se elija).
// Solo con equipos de las listas del panel. GPL-3.0 · mediaservi.com
import { T, N, esc, textos, lee, guarda, togs, num, etq } from './util.js';
import { equipos, esInterno, P as BP } from './listas.js';
import { COL, escala, cota, persona, suelo, etiqueta, lienzo, lienzo3D, pestanas, fmt } from './vt.js';
import { simEscala, accionSim, tex3D } from './simdisp.js';
import { fotoDe, urlFicha } from './fichaprod.js';
import { cuerpo } from './cuerpos.js';
textos({
  'DISPLAYS': ['DISPLAYS', 'DISPLAYS'], 'Displays y señalética': ['Displays and signage', 'Displays i senyalització'],
  'Señalética y digital signage: el display que cumple con el sitio, el tamaño, las horas al día y el reproductor, de las marcas del catálogo.': ['Signage and digital signage: the display that meets the place, size, hours a day and player, from the catalogue brands.', 'Senyalització i digital signage: el display que compleix amb el lloc, la mida, les hores al dia i el reproductor, de les marques del catàleg.'],
  'Escríbela: «4 pantallas de 55″ en vertical para escaparate»': ['Type it: “4 portrait 55″ screens for a shop window”', 'Escriu-la: «4 pantalles de 55″ en vertical per a aparador»'],
  'Dónde va': ['Where it goes', 'On va'], 'Interior': ['Indoor', 'Interior'], 'En una pared o un mostrador': ['On a wall or a counter', 'En una paret o un taulell'],
  'Escaparate': ['Shop window', 'Aparador'], 'Detrás del cristal, mirando a la calle': ['Behind the glass, facing the street', 'Darrere del vidre, mirant al carrer'],
  'Exterior': ['Outdoor', 'Exterior'], 'A la intemperie': ['Out in the open', 'A la intempèrie'],
  'Tótem': ['Totem', 'Tòtem'], 'De pie, en el suelo': ['Free-standing, on the floor', 'Dempeus, a terra'],
  'Videowall': ['Video wall', 'Videowall'], 'Varias pantallas sin marco que forman una': ['Several bezel-less screens that form one', 'Diverses pantalles sense marc que en formen una'],
  'Táctil': ['Touch', 'Tàctil'], 'Quiosco o punto de información': ['Kiosk or information point', 'Quiosc o punt d\'informació'],
  'Alargado': ['Stretched', 'Allargat'], 'Formato estirado (estanterías, barras)': ['Stretched format (shelves, bars)', 'Format estirat (prestatgeries, barres)'],
  'Transparente': ['Transparent', 'Transparent'], 'Se ve a través': ['You can see through it', 'S\'hi veu a través'],
  'se dibujan 6 de {n}': ['6 of {n} drawn', 'se\'n dibuixen 6 de {n}'],
  'Tamaño': ['Size', 'Mida'], 'Pulgadas': ['Inches', 'Polzades'], 'Cuántas': ['How many', 'Quantes'], 'Columnas': ['Columns', 'Columnes'], 'Filas': ['Rows', 'Files'],
  'Uso': ['Use', 'Ús'], 'Horas al día': ['Hours a day', 'Hores al dia'], 'Hasta 16 h': ['Up to 16 h', 'Fins a 16 h'], '24 h, sin apagar': ['24 h, never off', '24 h, sense apagar'],
  'Orientación': ['Orientation', 'Orientació'], 'Horizontal': ['Landscape', 'Horitzontal'], 'Vertical': ['Portrait', 'Vertical'],
  'Reproductor': ['Player', 'Reproductor'], 'Integrado en la pantalla': ['Built into the screen', 'Integrat a la pantalla'], 'Externo': ['External', 'Extern'],
  'Marca': ['Brand', 'Marca'], 'La que esté en stock': ['Whichever is in stock', 'La que estigui en estoc'], 'Cualquiera': ['Any', 'Qualsevol'],
  'Pantallas': ['Screens', 'Pantalles'], 'Brillo': ['Brightness', 'Brillantor'], 'Resolución': ['Resolution', 'Resolució'], 'Display': ['Display', 'Display'],
  'En stock': ['In stock', 'En estoc'], 'Bajo pedido': ['To order', 'Sota comanda'], 'Integrado': ['Built in', 'Integrat'],
  'La instalación vista de frente': ['The installation seen from the front', 'La instal·lació vista de front'], 'Vista frontal': ['Front view', 'Vista frontal'],
  '¿Dónde va la pantalla?': ['Where does the screen go?', 'On va la pantalla?'], '¿De qué tamaño?': ['What size?', 'De quina mida?'], '¿Cuántas pantallas?': ['How many screens?', 'Quantes pantalles?'],
  '¿Cuántas horas al día está encendida?': ['How many hours a day is it on?', 'Quantes hores al dia està encesa?'], '¿En horizontal o en vertical?': ['Landscape or portrait?', 'En horitzontal o en vertical?'],
  'Tiendas y oficinas': ['Shops and offices', 'Botigues i oficines'], 'Comercios abiertos día y noche, transporte': ['Shops open day and night, transport', 'Comerços oberts dia i nit, transport'],
  'Como una tele': ['Like a TV', 'Com una tele'], 'Cartelería de pie, menús': ['Standing signage, menus', 'Cartelleria dempeus, menús'],
  'No hay ningún display de las listas para este sitio con estas condiciones.': ['There is no display in the lists for this place with these conditions.', 'No hi ha cap display de les llistes per a aquest lloc amb aquestes condicions.'],
  'No hay ninguno de {p}″: el más cercano es de {q}″.': ['There is none at {p}″: the closest is {q}″.', 'No n\'hi ha cap de {p}″: el més proper és de {q}″.'],
  'Para 24 h al día no hay ninguno en las listas: se propone uno de 16 h, que no está pensado para no apagarse nunca.': ['For 24 h a day there is none in the lists: a 16 h one is proposed, which is not meant to stay on all the time.', 'Per a 24 h al dia no n\'hi ha cap a les llistes: se\'n proposa un de 16 h, que no està pensat per no apagar-se mai.'],
  'Detrás de un cristal a la calle hace falta brillo alto ({m} nits o más) para verse de día: este da {n} nits.': ['Behind street-facing glass high brightness is needed ({m} nits or more) to be seen in daylight: this one gives {n} nits.', 'Darrere d\'un vidre al carrer cal brillantor alta ({m} nits o més) per veure\'s de dia: aquest en dona {n}.'],
  'Sin reproductor integrado: lleva uno externo por pantalla ({m}).': ['No built-in player: it needs an external one per screen ({m}).', 'Sense reproductor integrat: en porta un d\'extern per pantalla ({m}).'],
  'Sin reproductor integrado: lleva un reproductor externo por pantalla (no hay ninguno en las listas).': ['No built-in player: it needs an external player per screen (none in the lists).', 'Sense reproductor integrat: porta un reproductor extern per pantalla (no n\'hi ha cap a les llistes).'],
  'En vertical: comprueba en la ficha que el modelo admite el montaje en vertical.': ['In portrait: check on the datasheet that the model allows portrait mounting.', 'En vertical: comprova a la fitxa que el model admet el muntatge en vertical.'],
  'Videowall de {c} × {f}: mide {a} × {h} m ({p}″ de diagonal); la señal se reparte con el procesador de videowall o con la entrada y salida en cadena de los displays.': ['{c} × {f} video wall: {a} × {h} m ({p}″ diagonal); the signal is split with a video wall processor or by daisy-chaining the displays.', 'Videowall de {c} × {f}: fa {a} × {h} m ({p}″ de diagonal); el senyal es reparteix amb el processador de videowall o amb l\'entrada i sortida en cadena dels displays.'],
  'Más grande de lo que llega un videowall razonable o un monitor: mejor una pantalla LED (calcúlala en SCREENS).': ['Larger than a reasonable video wall or monitor reaches: an LED screen is better (work it out in SCREENS).', 'Més gran del que arriba un videowall raonable o un monitor: millor una pantalla LED (calcula-la a SCREENS).'],
  'Pulgadas pedidas': ['Inches asked for', 'Polzades demanades'], 'Recomendado': ['Recommended', 'Recomanat'], 'Alternativas': ['Alternatives', 'Alternatives'], 'personas': ['people', 'persones'], 'Vista lateral': ['Side view', 'Vista lateral'], 'La instalación vista de lado': ['The installation seen from the side', 'La instal·lació vista de costat'],
});
const SITIOS = [['interior', 'Interior', 'En una pared o un mostrador', 'pared'], ['escaparate', 'Escaparate', 'Detrás del cristal, mirando a la calle', 'escaparate'], ['exterior', 'Exterior', 'A la intemperie', 'calle'],
  ['totem', 'Tótem', 'De pie, en el suelo', 'persona'], ['videowall', 'Videowall', 'Varias pantallas sin marco que forman una', 'led'], ['tactil', 'Táctil', 'Quiosco o punto de información', 'mano'],
  ['alargado', 'Alargado', 'Formato estirado (estanterías, barras)', 'regla'], ['transparente', 'Transparente', 'Se ve a través', 'ojo']];
/* qué usos de las listas valen para cada sitio */
const USOS = { interior: ['pared', 'tv'], escaparate: ['escaparate'], exterior: ['exterior'], totem: ['totem', 'escaparate'], videowall: ['videowall'], tactil: ['tactil', 'interactivo'], alargado: ['alargado'], transparente: ['transparente'] };
const ORDEN = ['SAMSUNG', 'LG', 'CLEVER'];
const MED = [24, 32, 43, 49, 50, 55, 65, 75, 86, 98, 105, 110, 115];
const DEF = { sitio: 'interior', pulg: 55, np: 1, cols: 2, filas: 2, horas: '16/7', orient: 'h', player: 'soc', marca: 'auto' };
let S = Object.assign({}, DEF, lee('systems_display') || {});
const NUMS = { pulg: [10, 120, 0], np: [1, 50, 0], cols: [1, 10, 0], filas: [1, 10, 0] };
const nPant = () => (S.sitio === 'videowall' ? S.cols * S.filas : S.np);
const ancho16 = (p) => p * 0.0254 * 0.8716, alto16 = (p) => p * 0.0254 * 0.4903;

function calcula() {
  const av = [], r = { av };
  const marca = S.marca === 'auto' ? null : S.marca;
  let L = equipos('display', marca || 'todas').filter((x) => USOS[S.sitio].includes(x.uso) && x.pulgadas);
  if (!L.length) { r.error = T('No hay ningún display de las listas para este sitio con estas condiciones.'); av.push(['', r.error]); }
  /* 24 h: solo los de 24/7; si no hay ninguno, se avisa y se sigue con los de 16 h */
  if (S.horas === '24/7' && L.length) { const l24 = L.filter((x) => x.horas === '24/7'); if (l24.length) L = l24; else av.push(['', T('Para 24 h al día no hay ninguno en las listas: se propone uno de 16 h, que no está pensado para no apagarse nunca.')]); }
  /* reproductor integrado: se prefieren los que lo llevan (SoC) */
  const conSoc = L.filter((x) => x.soc); if (S.player === 'soc' && conSoc.length) L = conSoc;
  /* el tamaño más cercano (a igualdad, el de arriba); luego stock y orden de marcas */
  const dif = (x) => Math.abs(x.pulgadas - S.pulg) + (x.pulgadas < S.pulg ? 0.5 : 0);
  const ord = L.slice().sort((a, b) => dif(a) - dif(b) || (b.stock ? 1 : 0) - (a.stock ? 1 : 0) || ORDEN.indexOf(a.marca) - ORDEN.indexOf(b.marca) || (b.nits || 0) - (a.nits || 0));
  r.disp = ord[0] || null;
  r.alts = r.disp ? ord.filter((x) => x !== r.disp && x.pulgadas === r.disp.pulgadas && x.marca !== r.disp.marca).filter((x, i, a) => a.findIndex((y) => y.marca === x.marca) === i).slice(0, 3) : [];
  r.n = nPant();
  if (r.disp) {
    if (r.disp.pulgadas !== S.pulg) av.push(['info', T('No hay ninguno de {p}″: el más cercano es de {q}″.', { p: S.pulg, q: r.disp.pulgadas })]);
    const NE = BP('display.nitsEscaparate', 2500); if ((S.sitio === 'escaparate') && (r.disp.nits || 0) < NE) av.push(['', T('Detrás de un cristal a la calle hace falta brillo alto ({m} nits o más) para verse de día: este da {n} nits.', { m: N(NE), n: N(r.disp.nits || 0) })]);
    if (!r.disp.soc) { const P = equipos(['display', 'signage']).filter((x) => x.tipo === 'signage' || x.uso === 'player');   /* v1.7 · reproductores de signage (MagicInfo, VXT, webOS): de la misma marca y prioritario si lo hay */
      r.player = P.find((x) => x.marca === r.disp.marca && x.prioritario) || P.find((x) => x.marca === r.disp.marca) || P.find((x) => x.prioritario) || P[0] || null;
      av.push(['info', r.player ? T('Sin reproductor integrado: lleva uno externo por pantalla ({m}).', { m: r.player.marca + ' ' + r.player.modelo }) : T('Sin reproductor integrado: lleva un reproductor externo por pantalla (no hay ninguno en las listas).')]); }
    if (S.orient === 'v') av.push(['info', T('En vertical: comprueba en la ficha que el modelo admite el montaje en vertical.')]);
    if (S.sitio === 'videowall') { const a = ancho16(r.disp.pulgadas) * S.cols, h = alto16(r.disp.pulgadas) * S.filas; r.vw = { a, h, p: Math.round(Math.hypot(a, h) / 0.0254) };
      av.push(['info', T('Videowall de {c} × {f}: mide {a} × {h} m ({p}″ de diagonal); la señal se reparte con el procesador de videowall o con la entrada y salida en cadena de los displays.', { c: S.cols, f: S.filas, a: N(a, 2), h: N(h, 2), p: r.vw.p })]); }
  }
  if (S.pulg > BP('display.pulgadasMaxMonitor', 120) || (r.vw && r.vw.p > BP('display.pulgadasMaxVideowall', 300))) av.push(['', T('Más grande de lo que llega un videowall razonable o un monitor: mejor una pantalla LED (calcúlala en SCREENS).')]);
  r.sem = !r.disp ? 'R' : av.some((a) => !a[0]) ? 'A' : 'V';
  r.semTxt = r.sem === 'R' ? T('No hay solución') : r.sem === 'A' ? T('Hay solución, con avisos') : T('Hay solución');
  r.lineaTxt = r.disp ? [r.n + ' × ' + r.disp.marca + ' ' + r.disp.modelo, r.disp.pulgadas + '″', r.disp.horas, r.disp.nits ? r.disp.nits + ' nits' : ''].filter(Boolean).join(' · ') : (r.error || '—');
  r.linea = r.disp ? `<b>${esc(r.n + ' × ' + r.disp.modelo)}</b> · ${esc(r.disp.pulgadas + '″ · ' + r.disp.horas + (r.disp.nits ? ' · ' + r.disp.nits + ' nits' : ''))}` : esc(r.error || '—');
  guarda('systems_display', S); return r;
}
/* v2.3 · vistas técnicas como en SCREENS: FRONTAL (a escala, con la silueta de 1,75 m y cotas) y LATERAL (altura de montaje,
   distancia de quien mira y ángulo vertical). Mismas piezas que screens/vistas.js (vista/vt.js). */
let VT = 'escala';   /* v2.8 · la simulación a escala, como en SCREENS, es la vista de entrada */
/* v2.9 · con las medidas reales del modelo (vista/cuerpos.js), cada display es su cuerpo exacto: ancho, alto, fondo y marcos de su ficha */
const geo = (r) => { const p = r.disp ? r.disp.pulgadas : S.pulg, vert = S.orient === 'v', cu = r.disp ? cuerpo(r.disp, vert) : null;
  const w1 = cu ? cu.W : vert ? alto16(p) : ancho16(p), h1 = cu ? cu.H : vert ? ancho16(p) : alto16(p);
  const vw = S.sitio === 'videowall', cols = vw ? S.cols : Math.min(nPant(), 6), fil = vw ? S.filas : 1, gap = vw ? (cu ? 0 : 0.006) : 0.25;
  const base = cu && cu.totem ? 0 : S.sitio === 'totem' ? BP('display.base.totem', 0.3) : S.sitio === 'tactil' ? BP('display.base.tactil', 0.9) : vw ? BP('display.base.videowall', 0.8) : S.sitio === 'escaparate' ? BP('display.base.escaparate', 0.9) : BP('display.base.pared', 1.2);
  return { p, w1, h1, vw, cols, fil, gap, base, cu, W: cols * w1 + (cols - 1) * gap, H: fil * h1 + (fil - 1) * gap }; };
function frontal(r, o) {
  const mov = !!o.vertical, VW = mov ? 480 : 960, VH = 520, G = geo(r), top = G.base + G.H;
  const xMin = -1.0, xMax = G.W + 0.4, E = escala(VW, VH, { l: 56, r: 56, t: 44, b: 40 }, xMin, xMax, 0, Math.max(2.0, top + 0.35)), { X, Y, k } = E;
  let g = suelo(X, Y, xMin, xMax) + persona(X, Y, -0.55, k);
  for (let f = 0; f < G.fil; f++) for (let c = 0; c < G.cols; c++) { const x = c * (G.w1 + G.gap), y = G.base + f * (G.h1 + G.gap);
    if (S.sitio === 'totem') g += `<rect x="${X(x + G.w1 * .35)}" y="${Y(G.base)}" width="${G.w1 * .3 * k}" height="${G.base * k}" fill="${COL.equipo}" stroke="${COL.linea}"/>`;
    g += `<rect x="${X(x)}" y="${Y(y + G.h1)}" width="${G.w1 * k}" height="${G.h1 * k}" rx="${G.vw ? 1 : 3}" fill="${COL.imagen}" stroke="${COL.imagenB}" stroke-width="${G.vw ? 1.2 : 2}"/>`; }
  if (!G.vw && nPant() > 6) g += etiqueta(X(G.W) + 8, Y(G.base + G.h1 / 2), '+' + (nPant() - 6), 'start', 'vt-ten');
  g += etiqueta(X(G.W / 2), Y(top) - 38, (r.disp ? r.disp.modelo + ' · ' : '') + G.p + '″' + (G.vw ? ' · ' + S.cols + ' × ' + S.filas : nPant() > 1 ? ' · ' + nPant() + ' ×' : ''));
  g += cota(X(0), Y(G.base) + 16, X(G.vw ? G.W : G.w1), Y(G.base) + 16, fmt(G.vw ? G.W : G.w1) + ' m', 1);
  g += cota(X(xMax) - 8, Y(G.base), X(xMax) - 8, Y(top), fmt(G.H), 1);
  g += cota(X(G.vw ? G.W : G.w1) + 14, Y(0), X(G.vw ? G.W : G.w1) + 14, Y(G.base), fmt(G.base), 1);
  g += etiqueta(X(-0.55), Y(0) + 22, '1,75 m', 'middle', 'vt-ten');
  return lienzo(VW, VH, g, 'La instalación vista de frente');
}
function lateral(r, o) {
  const mov = !!o.vertical, VW = mov ? 480 : 960, VH = 520, G = geo(r), top = G.base + G.H, ojo = BP('display.ojosDePie', 1.6);
  const d = Math.max(1.2, Math.min(12, (S.sitio === 'tactil' ? BP('display.distanciaTactil', 0.6) : (S.sitio === 'escaparate' || S.sitio === 'exterior' ? BP('display.factorDistanciaCalle', 4) : BP('display.factorDistancia', 3)) * G.h1)));
  const xMax = d + 1.0, E = escala(VW, VH, { l: 60, r: 40, t: 44, b: 40 }, -0.4, xMax, 0, Math.max(2.2, top + 0.4)), { X, Y, k } = E;
  let g = suelo(X, Y, -0.4, xMax) + `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(Math.max(2.2, top + 0.3))}" stroke="${COL.pared}" stroke-width="4"/>`;
  if (S.sitio === 'totem') g += `<rect x="${X(0.02)}" y="${Y(G.base)}" width="${0.35 * k}" height="${G.base * k}" fill="${COL.equipo}" stroke="${COL.linea}"/>`;
  g += `<rect x="${X(0.02)}" y="${Y(top)}" width="${Math.max(3, (G.cu ? G.cu.D : 0.07) * k)}" height="${G.H * k}" fill="${COL.imagenB}"/>`;
  g += `<path d="M${X(d)} ${Y(ojo)} L${X(0.09)} ${Y(top)} L${X(0.09)} ${Y(G.base)} Z" fill="${COL.haz}" stroke="rgba(255,214,0,.5)" stroke-width="1"/>`;
  g += persona(X, Y, d, k) + `<circle cx="${X(d)}" cy="${Y(ojo)}" r="4" fill="${COL.lente}"/>`;
  const aSup = Math.atan2(top - ojo, d) * 180 / Math.PI, aInf = Math.atan2(ojo - G.base, d) * 180 / Math.PI;
  g += etiqueta(X(d), Y(1.75) - 14, '↑ ' + fmt(aSup, 0) + '° · ↓ ' + fmt(aInf, 0) + '°', 'middle', 'vt-ama');
  g += cota(X(0), Y(0) + 24, X(d), Y(0) + 24, fmt(d) + ' m', 1);
  g += cota(X(0) - 14, Y(0), X(0) - 14, Y(G.base), fmt(G.base)) + cota(X(0) - 14, Y(G.base), X(0) - 14, Y(top), fmt(G.H));
  g += cota(X(xMax) - 10, Y(0), X(xMax) - 10, Y(ojo), fmt(ojo), 1);
  return lienzo(VW, VH, g, 'La instalación vista de lado');
}

/* v2.5 · simulación 3D: la pared con las pantallas a su altura, el tótem si lo es y una persona a la distancia de visión */
function escena3d(V, r) {
  const G = geo(r), A = Math.max(4, G.W + 3), d = Math.max(1.2, Math.min(12, (S.sitio === 'tactil' ? BP('display.distanciaTactil', 0.6) : (S.sitio === 'escaparate' || S.sitio === 'exterior' ? BP('display.factorDistanciaCalle', 4) : BP('display.factorDistancia', 3)) * G.h1))), F = d + 2, H = Math.max(3, G.base + G.H + 0.8);
  V.sala(A, F, H);
  for (let f = 0; f < G.fil; f++) for (let c = 0; c < G.cols; c++) { const x = -G.W / 2 + c * (G.w1 + G.gap) + G.w1 / 2, y = G.base + f * (G.h1 + G.gap);
    V.pantalla(G.w1, G.h1, x, y, S.sitio === 'totem' ? 0.4 : 0, f === G.fil - 1 && c === 0 ? (r.disp ? r.disp.modelo + ' · ' : '') + G.p + '″' : '', { tex: tex3D(), uv: G.vw ? [c / G.cols, f / G.fil, (c + 1) / G.cols, (f + 1) / G.fil] : null, cuerpo: G.cu });
    if (S.sitio === 'totem' && !(G.cu && G.cu.totem)) V.caja(G.w1 * 0.4, G.base, 0.3, x, G.base / 2, 0.45, 0x1b1b1e, { metal: 0.6 }); }
  V.persona(0.4, d, Math.PI, 1);
  V.cota([0.4, 0, 0], [0.4, 0, d], fmt(d) + ' m', 0.4);
}
/* v2.8 · simulación a escala (la de SCREENS): pared con textura, persona de 1,75 m, cada display a su tamaño real con la carta de ajuste
   o el contenido elegido, y la foto oficial del modelo que abre su ficha */
function aEscala(r, o) {
  const G = geo(r), paneles = [];
  for (let f = 0; f < G.fil; f++) for (let c = 0; c < G.cols; c++) paneles.push({ x: c * (G.w1 + G.gap), y: G.base + f * (G.h1 + G.gap), w: G.w1, h: G.h1, cu: G.cu });
  const d = r.disp, et = (d ? d.marca + ' ' + d.modelo + ' · ' : '') + G.p + '″' + (G.vw ? ' · ' + S.cols + ' × ' + S.filas : nPant() > 6 ? ' · ' + T('se dibujan 6 de {n}', { n: nPant() }) : nPant() > 1 ? ' · ' + nPant() + ' ×' : '');
  return simEscala({ paneles, marco: G.vw ? 0.0018 : 0.012, W: G.W, H: G.H, base: G.base, vw: G.vw, totem: S.sitio === 'totem' && !(G.cu && G.cu.totem), etiqueta: et },
    d ? { url: fotoDe(d), href: urlFicha(d.id), nombre: d.marca + ' ' + d.modelo } : null, o);
}
const esquema = (r, o = {}) => (VT === 'escala' ? aEscala(r, o) : VT === 'lateral' ? lateral(r, o) : VT === '3d' ? lienzo3D() : frontal(r, o));
const eq = (x, n, tit, rec, extra = '') => x ? `<div class="equipo${rec ? ' rec' : ''}"><div class="eq-cab"><b>${x.prioritario ? '⭐ ' : ''}${esc(x.modelo)}</b><span class="serie">${esc(x.marca)}${tit ? ' · ' + esc(T(tit)) : ''}</span>${rec ? `<span class="etq">${T('Recomendado').toUpperCase()}</span>` : ''}</div><table class="despiece"><tr><td>${n}×</td><td class="ref">${esc(x.id)}</td><td class="des">${esc(x.descripcion || '')}${extra}</td></tr></table></div>` : '';
function resultado(r) {
  let h = `<div class="veredicto ${r.sem === 'A' ? 'aviso' : r.sem === 'R' ? 'mal' : ''}"><b>${esc(r.semTxt)}</b><p>${esc(r.lineaTxt)}</p></div>`;
  h += eq(r.disp, r.n, 'Display', true, r.disp && esInterno() ? '<span class="st-int"> · ' + esc(T(r.disp.stock ? 'En stock' : 'Bajo pedido')) + '</span>' : '') + eq(r.player, r.n, 'Reproductor', true);
  if (r.av.length) h += `<ul class="avisos">${r.av.map((a) => `<li class="${a[0]}">${esc(a[1])}</li>`).join('')}</ul>`;
  if (r.alts.length) h += `<p class="alt-t">${T('Alternativas')}</p>` + r.alts.map((x) => eq(x, r.n, '', false, (esInterno() ? '<span class="st-int"> · ' + esc(T(x.stock ? 'En stock' : 'Bajo pedido')) + '</span>' : ''))).join('');
  return h;
}
const cifras = (r) => [
  { t: 'Display', v: r.disp ? r.disp.modelo : '—', s: r.disp ? r.disp.marca : '', ic: 'display', c: 'var(--verde-txt)' },
  { t: 'Pantallas', v: String(r.n), u: '×', s: S.sitio === 'videowall' ? S.cols + ' × ' + S.filas : T(S.orient === 'v' ? 'Vertical' : 'Horizontal'), ic: 'tele', c: 'var(--azul)' },
  { t: 'Pulgadas', v: r.disp ? String(r.disp.pulgadas) : String(S.pulg), u: '″', s: r.vw ? N(r.vw.a, 2) + ' × ' + N(r.vw.h, 2) + ' m' : T('Pulgadas pedidas') + ' ' + S.pulg + '″', ic: 'regla', c: 'var(--violeta)' },
  { t: 'Brillo', v: r.disp && r.disp.nits ? N(r.disp.nits) : '—', u: 'nits', s: T((SITIOS.find((x) => x[0] === S.sitio) || SITIOS[0])[1]), ic: 'sol', c: 'var(--ambar)' },
  { t: 'Horas al día', v: r.disp ? r.disp.horas : S.horas, s: r.disp && r.disp.res ? r.disp.res : '', ic: 'reloj', c: 'var(--verde)' },
  { t: 'Reproductor', v: r.disp ? T(r.disp.soc ? 'Integrado' : 'Externo') : '—', s: r.player ? r.player.modelo : '', ic: 'chip', c: 'var(--magenta, #e24bf0)' }];
function datos() {
  const marcas = [['auto', esInterno() ? 'La que esté en stock' : 'Cualquiera'], ...ORDEN.filter((m) => equipos('display', m).length).map((m) => [m, m])];
  return [{ tit: 'Dónde va', ic: 'diana', ac: 'var(--verde-txt)', html: togs('sitio', SITIOS.map((x) => [x[0], x[1]]), S.sitio, 'dos') + etq('Marca') + togs('marca', marcas, S.marca, 'dos') },
    { tit: 'Tamaño', ic: 'regla', ac: 'var(--azul)', html: num('pulg', 'Pulgadas', S.pulg, '″', 1, 10, 120) + (S.sitio === 'videowall' ? `<div class="nums">${num('cols', 'Columnas', S.cols, '', 1, 1, 10)}${num('filas', 'Filas', S.filas, '', 1, 1, 10)}</div>` : num('np', 'Cuántas', S.np, '', 1, 1, 50)) + etq('Orientación') + togs('orient', [['h', 'Horizontal'], ['v', 'Vertical']], S.orient, 'dos') },
    { tit: 'Uso', ic: 'reloj', ac: 'var(--ambar)', html: etq('Horas al día') + togs('horas', [['16/7', 'Hasta 16 h'], ['24/7', '24 h, sin apagar']], S.horas, 'dos') + etq('Reproductor') + togs('player', [['soc', 'Integrado en la pantalla'], ['ext', 'Externo']], S.player, 'dos') + `<div class="pie-b"><button type="button" data-acc="reset">${esc(T('RESTABLECER'))}</button></div>` }];
}
const filas = () => [['sitio', 'diana', 'Dónde va', T((SITIOS.find((x) => x[0] === S.sitio) || SITIOS[0])[1])], ['pulg', 'regla', 'Tamaño', S.pulg + '″'],
  ['np', 'tele', 'Pantallas', S.sitio === 'videowall' ? S.cols + ' × ' + S.filas : String(S.np)], ['horas', 'reloj', 'Horas al día', T(S.horas === '24/7' ? '24 h, sin apagar' : 'Hasta 16 h')], ['orient', 'altura', 'Orientación', T(S.orient === 'v' ? 'Vertical' : 'Horizontal')]];
const pasos = () => ['sitio', 'pulg', 'np', 'horas', 'orient'];
function pregunta(k) {
  switch (k) {
    case 'sitio': return { q: '¿Dónde va la pantalla?', val: S.sitio, ops: SITIOS.map((x) => [x[0], x[1], x[2], x[3]]), aplica: (v) => { S.sitio = v; } };
    case 'pulg': return { q: '¿De qué tamaño?', val: S.pulg, ops: [32, 43, 50, 55, 65, 75, 86, 98].map((n) => [n, n + '″', '', 'regla']), aplica: (v) => { S.pulg = +v; } };
    case 'np': return S.sitio === 'videowall' ? { q: '¿Cuántas pantallas?', nums: [['cols', 'Columnas', S.cols, 1, 10, ''], ['filas', 'Filas', S.filas, 1, 10, '']], aplica: (o) => { S.cols = o.cols; S.filas = o.filas; } }
      : { q: '¿Cuántas pantallas?', val: S.np, ops: [1, 2, 3, 4, 6, 8, 10, 12].map((n) => [n, String(n), '', 'tele']), aplica: (v) => { S.np = +v; } };
    case 'horas': return { q: '¿Cuántas horas al día está encendida?', val: S.horas, ops: [['16/7', 'Hasta 16 h', 'Tiendas y oficinas', 'luna'], ['24/7', '24 h, sin apagar', 'Comercios abiertos día y noche, transporte', 'sol']], aplica: (v) => { S.horas = v; } };
    case 'orient': return { q: '¿En horizontal o en vertical?', val: S.orient, ops: [['h', 'Horizontal', 'Como una tele', 'tele'], ['v', 'Vertical', 'Cartelería de pie, menús', 'altura']], aplica: (v) => { S.orient = v; } };
  }
  return null;
}
function pon(k, v) { if (NUMS[k]) { const [a, b, d] = NUMS[k], n = +v; S[k] = Math.max(a, Math.min(b, isFinite(n) ? +n.toFixed(d) : a)); } else S[k] = v; }
function pide(t) {
  const s = t.toLowerCase().replace(/,/g, '.'); let ok = false, m;
  if ((m = s.match(/(\d{2,3})\s*(?:″|"|''|pulgadas|pulg|inch|inches|polzades)/))) { S.pulg = Math.min(120, +m[1]); ok = true; }
  if ((m = s.match(/(\d+)\s*[x×]\s*(\d+)\s*(?:videowall|video wall)/)) || (/videowall|video wall/.test(s) && (m = s.match(/(\d+)\s*[x×]\s*(\d+)/)))) { S.sitio = 'videowall'; S.cols = Math.min(10, +m[1]); S.filas = Math.min(10, +m[2]); ok = true; }
  else if ((m = s.match(/(\d+)\s*(pantallas|displays|monitores|screens|pantalles|monitors)/))) { S.np = Math.min(50, +m[1]); ok = true; }
  const sit = [[/escaparate|shop window|aparador/, 'escaparate'], [/exterior|outdoor|intemperie|calle/, 'exterior'], [/t[oó]tem/, 'totem'], [/videowall|video wall/, 'videowall'], [/t[aá]ctil|touch|quiosco|kiosk/, 'tactil'], [/alargad|stretch|estirad/, 'alargado'], [/transparent/, 'transparente']];
  const f = sit.find((x) => x[0].test(s)); if (f) { S.sitio = f[1]; ok = true; }
  if (/vertical|portrait/.test(s)) S.orient = 'v'; else if (/horizontal|landscape/.test(s)) S.orient = 'h';
  if (/24\s*\/\s*7|24\s*h/.test(s)) S.horas = '24/7'; else if (/16\s*\/\s*7|16\s*h/.test(s)) S.horas = '16/7';
  ORDEN.forEach((mm) => { if (s.includes(mm.toLowerCase())) S.marca = mm; });
  return ok || /se[ñn]al[eé]tica|signage|cartel|digital/.test(s);
}
export default {
  id: 'disp', nom: 'Displays y señalética', corto: 'DISPLAYS', ic: 'display', ejemplo: 'Escríbela: «4 pantallas de 55″ en vertical para escaparate»',
  info: 'Señalética y digital signage: el display que cumple con el sitio, el tamaño, las horas al día y el reproductor, de las marcas del catálogo.',
  calcula, filas, pasos, pregunta, datos, resultado, cifras, pide,
  reconoce: (t) => /se[ñn]al[eé]tica|senyal[eè]tica|signage|cartel|escaparate|aparador|shop window|t[oòó]tem|videowall|video wall/i.test(t),
  esquema: (r, o) => ({ tit: VT === 'escala' ? 'Simulación a escala' : VT === 'lateral' ? 'Vista lateral' : VT === '3d' ? 'Simulación 3D' : 'Vista frontal', ic: 'display', html: esquema(r, o), extra: pestanas(['escala', 'frontal', 'lateral', '3d'], VT) }),
  escena3d,
  set: pon, num: pon, pm: (k, d) => pon(k, +S[k] + d),
  accion: (a) => { if (accionSim(a)) return; if (a === 'reset') S = Object.assign({}, DEF); else if (/^vt:/.test(a)) VT = a.slice(3); }, reset: () => { S = Object.assign({}, DEF); },
};
