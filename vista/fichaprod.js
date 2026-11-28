// SYSTEMS · ficha de producto (la de SCREENS, comun/ficha.js): foto o dibujo, marca, modelo, datos técnicos de la lista y enlace al fabricante.
// Sin precios ni stock: es pública (ventana, página ficha.html y PDF). GPL-3.0 · mediaservi.com
import { T, textos, lang } from './util.js';
import { marcas } from './listas.js';

textos({
  'Medidas (an × al × fo)': ['Dimensions (W × H × D)', 'Mides (am × al × fo)'], 'Peso': ['Weight', 'Pes'],
  'Tamaño': ['Size', 'Mida'], 'Resolución': ['Resolution', 'Resolució'], 'Brillo': ['Brightness', 'Brillantor'], 'Horas al día': ['Hours a day', 'Hores al dia'], 'Canales': ['Channels', 'Canals'], 'Potencia': ['Power', 'Potència'],
  'Entradas': ['Inputs', 'Entrades'], 'Salidas': ['Outputs', 'Sortides'], 'Ancho de banda': ['Bandwidth', 'Amplada de banda'], 'Ángulo horizontal': ['Horizontal angle', 'Angle horitzontal'], 'Zoom óptico': ['Optical zoom', 'Zoom òptic'], 'Zoom total': ['Total zoom', 'Zoom total'],
  'Lente panorámica': ['Wide lens', 'Lent panoràmica'], 'Campo de visión': ['Field of view', 'Camp de visió'], 'Fondo de sala': ['Room depth', 'Fons de sala'], 'Cobertura': ['Coverage', 'Cobertura'], 'Zonas': ['Zones', 'Zones'], 'Personas': ['People', 'Persones'], 'PoE': ['PoE', 'PoE'], 'Alto de rack': ['Rack height', 'Alçada de rack'],
  'Referencia': ['Reference', 'Referència'], 'Altavoz': ['Loudspeaker', 'Altaveu'], 'Subgrave': ['Subwoofer', 'Subgreu'], 'Micrófono': ['Microphone', 'Micròfon'], 'Cápsula': ['Capsule', 'Càpsula'], 'Transmisor': ['Transmitter', 'Transmissor'], 'Receptor': ['Receiver', 'Receptor'],
  'Cámara': ['Camera', 'Càmera'], 'Barra de vídeo': ['Video bar', 'Barra de vídeo'], 'Display': ['Display', 'Display'], 'Kit de audio': ['Audio kit', 'Kit d\'àudio'], 'Audio para videoconferencia': ['Video conferencing audio', 'Àudio per a videoconferència'], 'Etapa': ['Amplifier', 'Etapa'],
  'Procesador de audio': ['Audio processor', 'Processador d\'àudio'], 'Conmutador': ['Switcher', 'Commutador'], 'Extensor': ['Extender', 'Extensor'], 'Cable': ['Cable', 'Cable'], 'AV sobre IP': ['AV over IP', 'AV sobre IP'], 'Accesorio': ['Accessory', 'Accessori'], 'Soporte': ['Bracket', 'Suport'],
  'Antena': ['Antenna', 'Antena'], 'Cargador': ['Charger', 'Carregador'], 'Interfaz de audio': ['Audio interface', 'Interfície d\'àudio'], 'Tarjeta de audio': ['Audio card', 'Targeta d\'àudio'], 'Conferencia': ['Conference', 'Conferència'], 'Tratamiento acústico': ['Acoustic treatment', 'Tractament acústic'],
  'Controladora': ['Controller', 'Controladora'], 'Procesador modular': ['Modular processor', 'Processador modular'], 'Mediaserver': ['Media server', 'Mediaserver'], 'Switcher': ['Switcher', 'Switcher'],
  'Servicio': ['Service', 'Servei'], 'Reproductor': ['Player', 'Reproductor'], 'Equipo de sala': ['Room system', 'Equip de sala'], 'Ficha del fabricante': ['Manufacturer datasheet', 'Fitxa del fabricant'], 'Página del producto': ['Product page', 'Pàgina del producte'], 'Web del fabricante': ['Manufacturer website', 'Web del fabricant'], 'Ficha técnica (PDF)': ['Datasheet (PDF)', 'Fitxa tècnica (PDF)'], 'Pantalla de proyección': ['Projection screen', 'Pantalla de projecció'], 'Imagen (an × al)': ['Image (w × h)', 'Imatge (am × al)'], 'Diagonal': ['Diagonal', 'Diagonal'], 'Formato': ['Format', 'Format'], 'Montaje': ['Mounting', 'Muntatge'], 'Eléctrica': ['Motorised', 'Elèctrica'], 'Eléctrica de falso techo': ['Motorised, in-ceiling', 'Elèctrica de fals sostre'], 'Marco fijo': ['Fixed frame', 'Marc fix'], 'Sí': ['Yes', 'Sí'],
});

const TIPO = { controladora: 'Controladora', reproductor: 'Reproductor', 'chasis-h': 'Procesador modular', mediaserver: 'Mediaserver', switcher: 'Switcher', 'pantalla-proy': 'Pantalla de proyección', altavoz: 'Altavoz', subgrave: 'Subgrave', microfono: 'Micrófono', capsula: 'Cápsula', transmisor: 'Transmisor', receptor: 'Receptor', camara: 'Cámara', 'barra-vc': 'Barra de vídeo', display: 'Display', control: 'Control',
  'kit-audio': 'Kit de audio', 'audio-vc': 'Audio para videoconferencia', etapa: 'Etapa', 'procesador-audio': 'Procesador de audio', conmutador: 'Conmutador', extensor: 'Extensor', cable: 'Cable', avoip: 'AV sobre IP', accesorio: 'Accesorio', soporte: 'Soporte',
  antena: 'Antena', cargador: 'Cargador', 'interfaz-audio': 'Interfaz de audio', 'tarjeta-audio': 'Tarjeta de audio', conferencia: 'Conferencia', tratamiento: 'Tratamiento acústico', servicio: 'Servicio', signage: 'Reproductor', 'pc-vc': 'Equipo de sala' };
const ICONO = { 'pantalla-proy': 'proy', altavoz: 'altavoz', subgrave: 'altavoz', microfono: 'micro', capsula: 'micro', transmisor: 'micro', receptor: 'micro', camara: 'camara', 'barra-vc': 'camara', display: 'display', control: 'control', 'kit-audio': 'altavoz', 'audio-vc': 'micro', proyector: 'proy' };
const SPEC = [['pulgadas', 'Tamaño', '″'], ['res', 'Resolución', ''], ['nits', 'Brillo', ' nits'], ['horas', 'Horas al día', ''], ['canales', 'Canales', ''], ['w', 'Potencia', ' W'], ['inp', 'Entradas', ''], ['out', 'Salidas', ''], ['gbps', 'Ancho de banda', ' Gbps'],
  ['hfov', 'Ángulo horizontal', '°'], ['zoom', 'Zoom óptico', '×'], ['zoomTotal', 'Zoom total', '×'], ['hfovIA', 'Lente panorámica', '°'], ['fovH', 'Campo de visión', '°'], ['fondoMax', 'Fondo de sala', ' m'], ['m2', 'Cobertura', ' m²'], ['zonas', 'Zonas', ''], ['personas', 'Personas', ''], ['poe', 'PoE', ''], ['u', 'Alto de rack', ' U']];

/* v2.8 · la foto oficial: la de la lista del panel o, si no trae, la de la web del distribuidor (comun/fotos.js) */
export const fotoDe = (x) => (x && (x.urlFoto || x.foto || (globalThis.SC_FOTOS || {})[x.id])) || '';
/* v3.2 · página del producto y PDF de su ficha (comun/web.js: charmex.net por referencia; si no está, la web del fabricante) */
export const webDe = (x) => { if (!x) return null; const u = [x.url, x.web, x.fuente].find((v) => /^https?:\/\//.test(String(v || ''))); const w = globalThis.SC_WEB ? globalThis.SC_WEB(x.id, x.marca || x.fab) : null;
  return u ? { web: u, pdf: x.pdf || (w && w.pdf) || '', charmex: /charmex\.net/.test(u), propia: true } : w; };
export const urlFicha = (id) => 'ficha.html?ref=' + encodeURIComponent(id) + '&lang=' + lang();
/* la referencia y su marca, por id (o por modelo) */
export function busca(ref) {
  const M = marcas(), r = String(ref || '').trim().toUpperCase(); let x = null, mk = '';
  if (!r) return null;
  Object.keys(M).some((k) => (M[k] || []).some((y) => { if (y && (String(y.id || '').toUpperCase() === r)) { x = y; mk = k; return true; } return false; }));
  if (!x) Object.keys(M).some((k) => (M[k] || []).some((y) => { if (y && String(y.modelo || '').toUpperCase() === r) { x = y; mk = k; return true; } return false; }));
  return x ? { x, mk } : null;
}
export function fichaDe(id) {
  const b = busca(id); if (!b || !globalThis.SC_FICHA) return null; const { x, mk } = b;
  const specs = SPEC.filter((s) => x[s[0]] != null && x[s[0]] !== '' && x[s[0]] !== false && typeof x[s[0]] !== 'object').map((s) => [T(s[1]), (x[s[0]] === true ? T('Sí') : x[s[0]]) + s[2]]);
  /* v3.3 · pantallas de proyección: imagen, diagonal, formato y montaje */
  if (x.tipo === 'pantalla-proy' && x.anchoImg) { const nf2 = (v) => (+v).toLocaleString(lang() === 'en' ? 'en-GB' : 'es-ES', { maximumFractionDigits: 2 });
    specs.push([T('Imagen (an × al)'), nf2(x.anchoImg) + ' × ' + nf2(x.altoImg) + ' m'], [T('Diagonal'), Math.round(Math.hypot(x.anchoImg, x.altoImg) / 0.0254) + '″'], [T('Formato'), x.fmt], [T('Montaje'), T({ electrica: 'Eléctrica', techo: 'Eléctrica de falso techo', marco: 'Marco fijo' }[x.montaje] || x.montaje)]); }
  /* v2.9 · medidas reales del cuerpo (comun/medidas.js) */
  const Md = (globalThis.SC_MEDIDAS || {})[x.id], nf = (v) => (+v).toLocaleString(lang() === 'en' ? 'en-GB' : 'es-ES', { maximumFractionDigits: 1 });
  if (Md) specs.push([T('Medidas (an × al × fo)'), nf(Md[0]) + ' × ' + nf(Md[1]) + ' × ' + nf(Md[2]) + ' mm']);
  if (Md && Md[3]) specs.push([T('Peso'), nf(Md[3]) + ' kg']);
  if (Md && Md[4]) specs.push(['VESA', Md[4].replace('x', ' × ') + ' mm']);
  const W = webDe(Object.assign({ marca: mk }, x)), enl = W ? W.web : '';
  const html = window.SC_FICHA.fichaHTML({ cat: T(TIPO[x.tipo] || x.tipo || ''), icono: ICONO[x.tipo] || 'elec', marca: x.marca || mk, modelo: x.modelo || x.id, foto: fotoDe(x), fotoTrasera: x.urlFotoTrasera, specs: [[T('Referencia'), x.id]].concat(specs), notas: x.descripcion ? [traduceDes(x.descripcion, lang())] : [], enlace: enl, enlaceTxt: T(W && W.charmex ? 'Página del producto' : 'Web del fabricante'), enlaces: W && W.pdf ? [[W.pdf, T('Ficha técnica (PDF)')]] : [], acento: '#00b4ff', sel: true });
  return { tit: (x.marca || mk) + ' ' + (x.modelo || x.id), html, x, mk, specs };
}
/* v2.8 · nombres de producto que se enlazan a su ficha: modelo e id de cada referencia (de 3 caracteres o más) → id */
let NOMS = null, NOMSk = null;
export function nombres() {
  const M = marcas(); if (NOMS && NOMSk === M) return NOMS;
  const m = new Map();
  Object.keys(M).forEach((k) => (M[k] || []).forEach((y) => { if (!y || !y.id) return; [y.modelo, y.id].forEach((n) => { n = String(n || '').trim(); if (n.length >= 3 && !m.has(n.toUpperCase())) m.set(n.toUpperCase(), y.id); }); }));
  NOMS = m; NOMSk = M; return m;
}
/* v2.8 · descripciones de las listas (están en español) en inglés y catalán: glosario de las palabras del catálogo,
   palabra a palabra y respetando mayúsculas; lo que no está en el glosario (modelos, siglas) se queda igual. */
const GLO = {
  de: ['', 'de'], para: ['for', 'per a'], con: ['with', 'amb'], sin: ['without', 'sense'], y: ['and', 'i'], o: ['or', 'o'], en: ['in', 'a'], por: ['per', 'per'], hasta: ['up to', 'fins a'], sobre: ['on', 'sobre'], dos: ['two', 'dos'], no: ['no', 'no'], es: ['is', 'és'],
  soporte: ['bracket', 'suport'], soportes: ['brackets', 'suports'], altavoz: ['loudspeaker', 'altaveu'], altavoces: ['loudspeakers', 'altaveus'], blanco: ['white', 'blanc'], blanca: ['white', 'blanca'], blancos: ['white', 'blancs'], negro: ['black', 'negre'], negra: ['black', 'negra'], negras: ['black', 'negres'], beige: ['beige', 'beix'],
  micrófono: ['microphone', 'micròfon'], micrófonos: ['microphones', 'micròfons'], matriz: ['matrix', 'matriu'], cable: ['cable', 'cable'], techo: ['ceiling', 'sostre'], pared: ['wall', 'paret'], canales: ['channels', 'canals'], canal: ['channel', 'canal'],
  cápsula: ['capsule', 'càpsula'], cápsulas: ['capsules', 'càpsules'], mano: ['handheld', 'de mà'], amplificador: ['amplifier', 'amplificador'], inalámbrico: ['wireless', 'sense fil'], inalámbrica: ['wireless', 'sense fil'], etapa: ['amplifier', 'etapa'], etapas: ['amplifiers', 'etapes'], sistema: ['system', 'sistema'],
  antena: ['antenna', 'antena'], antenas: ['antennas', 'antenes'], tactil: ['touch', 'tàctil'], táctil: ['touch', 'tàctil'], cardioide: ['cardioid', 'cardioide'], supercardioide: ['supercardioid', 'supercardioide'], pareja: ['pair', 'parella'], receptor: ['receiver', 'receptor'], solapa: ['lavalier', 'solapa'],
  columna: ['column', 'columna'], columnas: ['columns', 'columnes'], diadema: ['headset', 'diadema'], conferencias: ['conference', 'conferències'], sala: ['room', 'sala'], sobremesa: ['desktop', 'de sobretaula'], serie: ['series', 'sèrie'], mezclador: ['mixer', 'mesclador'], extensión: ['extension', 'extensió'], garantía: ['warranty', 'garantia'],
  barra: ['bar', 'barra'], subgrave: ['subwoofer', 'subgreu'], subgraves: ['subwoofers', 'subgreus'], doble: ['dual', 'doble'], distribuidor: ['splitter', 'distribuïdor'], superficie: ['surface', 'superfície'], cuello: ['neck', 'coll'], cisne: ['gooseneck', 'de cigne'], activa: ['active', 'activa'], activo: ['active', 'actiu'], activos: ['active', 'actius'],
  vías: ['way', 'vies'], escalador: ['scaler', 'escalador'], desescalador: ['downscaler', 'desescalador'], extensor: ['extender', 'extensor'], base: ['base', 'base'], cargador: ['charger', 'carregador'], amplificadas: ['amplified', 'amplificades'], unidad: ['unit', 'unitat'], años: ['years', 'anys'], año: ['year', 'any'],
  fibra: ['fibre', 'fibra'], videoconferencia: ['video conferencing', 'videoconferència'], lente: ['lens', 'lent'], grande: ['large', 'gran'], mediana: ['medium', 'mitjana'], pequeña: ['small', 'petita'], flexo: ['gooseneck', 'flexo'], tarjeta: ['card', 'targeta'], tarjetas: ['cards', 'targetes'], avisos: ['paging', 'avisos'], procesador: ['processor', 'processador'],
  accesorio: ['accessory', 'accessori'], paneles: ['panels', 'panells'], panel: ['panel', 'panell'], desembebedor: ['de-embedder', 'desincrustador'], cámara: ['camera', 'càmera'], pulsador: ['push button', 'polsador'], petaca: ['bodypack', 'petaca'], petacas: ['bodypacks', 'petaques'], portátil: ['portable', 'portàtil'],
  dinámica: ['dynamic', 'dinàmica'], dinámico: ['dynamic', 'dinàmic'], control: ['control', 'control'], acustica: ['acoustic', 'acústica'], acústico: ['acoustic', 'acústic'], acústicos: ['acoustic', 'acústics'], acústicas: ['acoustic', 'acústiques'], zonas: ['zones', 'zones'], coaxial: ['coaxial', 'coaxial'], pupitre: ['desk', 'pupitre'], pupitres: ['desks', 'pupitres'],
  absorbentes: ['absorbent', 'absorbents'], madera: ['wood', 'fusta'], interactivo: ['interactive', 'interactiu'], alto: ['high', 'alt'], alta: ['high', 'alta'], salidas: ['outputs', 'sortides'], salida: ['output', 'sortida'], entradas: ['inputs', 'entrades'], flexible: ['flexible', 'flexible'], empotrable: ['flush-mount', 'encastable'], posiciones: ['positions', 'posicions'],
  transmisor: ['transmitter', 'transmissor'], emisor: ['transmitter', 'emissor'], carga: ['charging', 'càrrega'], condensador: ['condenser', 'condensador'], orientable: ['adjustable', 'orientable'], fijo: ['fixed', 'fix'], central: ['central', 'central'], línea: ['line', 'línia'], delegado: ['delegate', 'delegat'], presidente: ['chairman', 'president'],
  conexión: ['connection', 'connexió'], consultar: ['ask for', 'consultar'], precio: ['price', 'preu'], plazo: ['lead time', 'termini'], interfaz: ['interface', 'interfície'], difusores: ['diffusers', 'difusors'], integrado: ['built-in', 'integrat'], color: ['colour', 'color'], monitor: ['monitor', 'monitor'], transparente: ['transparent', 'transparent'],
  brillo: ['brightness', 'brillantor'], conmutador: ['switcher', 'commutador'], óptico: ['optical', 'òptic'], total: ['total', 'total'], panorámica: ['panoramic', 'panoràmica'], voz: ['voice', 'veu'], mesa: ['table', 'taula'], placa: ['plate', 'placa'], falso: ['false', 'fals'], modular: ['modular', 'modular'], suelo: ['floor', 'terra'],
  presets: ['presets', 'presets'], mando: ['controller', 'comandament'], giratorio: ['rotary', 'giratori'], colgante: ['pendant', 'penjant'], micro: ['mic', 'micro'], exterior: ['outdoor', 'exterior'], expansor: ['expander', 'expansor'], divisible: ['divisible', 'divisible'], ranuras: ['slots', 'ranures'], red: ['network', 'xarxa'], medida: ['custom', 'mida'],
  ranurados: ['slotted', 'ranurats'], cara: ['side', 'cara'], equipo: ['system', 'equip'], enrasado: ['flush', 'enrasat'], suspensión: ['suspension', 'suspensió'], carcasa: ['housing', 'carcassa'], anillo: ['ring', 'anell'], anillos: ['rings', 'anells'], luminoso: ['light', 'lluminós'], aro: ['ring', 'anell'], instrumento: ['instrument', 'instrument'],
  enchufable: ['plug-in', 'endollable'], batería: ['battery', 'bateria'], baterías: ['batteries', 'bateries'], fuente: ['supply', 'font'], estación: ['station', 'estació'], módulo: ['module', 'mòdul'], ultraminiatura: ['ultra-miniature', 'ultraminiatura'], direccional: ['directional', 'direccional'], omnidireccional: ['omnidirectional', 'omnidireccional'],
  media: ['half', 'mitja'], onda: ['wave', 'ona'], hembra: ['female', 'femella'], macho: ['male', 'mascle'], latiguillos: ['patch leads', 'latiguillos'], frontales: ['front', 'frontals'], traseros: ['rear', 'posteriors'], satélite: ['satellite', 'satèl·lit'], satélites: ['satellites', 'satèl·lits'], remoto: ['remote', 'remot'], rejillas: ['grilles', 'reixetes'],
  puentes: ['bridges', 'ponts'], premontaje: ['pre-mount', 'premuntatge'], obra: ['construction', 'obra'], nueva: ['new', 'nova'], mini: ['mini', 'mini'], fijación: ['mounting', 'fixació'], alimenta: ['powers', 'alimenta'], megafonía: ['public address', 'megafonia'], consola: ['console', 'consola'], teclado: ['keypad', 'teclat'], reproductor: ['player', 'reproductor'],
  potencia: ['power', 'potència'], adaptador: ['adapter', 'adaptador'], pantalla: ['screen', 'pantalla'], rueda: ['wheel', 'roda'], estudio: ['study', 'estudi'], simulación: ['simulation', 'simulació'], microperforados: ['micro-perforated', 'microperforats'], perforados: ['perforated', 'perforats'], frecuencia: ['frequency', 'freqüència'],
  unidimensionales: ['one-dimensional', 'unidimensionals'], bidimensionales: ['two-dimensional', 'bidimensionals'], puertas: ['doors', 'portes'], extraplano: ['ultra-slim', 'extraplà'], próximamente: ['coming soon', 'properament'], haz: ['beam', 'feix'], textura: ['texture', 'textura'], longitud: ['length', 'longitud'], seguimiento: ['tracking', 'seguiment'],
  multimodo: ['multimode', 'multimode'], monomodo: ['single-mode', 'monomode'], desmontable: ['removable', 'desmuntable'], audio: ['audio', 'àudio'], horizontal: ['horizontal', 'horitzontal'], vertical: ['vertical', 'vertical'], garantia: ['warranty', 'garantia']
};
const FRASES = [['seguimiento por voz', 'voice tracking', 'seguiment per veu'], ['por voz', 'by voice', 'per veu'], ['lente IA', 'AI lens', 'lent IA'], ['cuello de cisne', 'gooseneck', 'coll de cigne'], ['de mano', 'handheld', 'de mà'], ['sin cables', 'wireless', 'sense cables'], ['de sobremesa', 'desktop', 'de sobretaula'],
  ['falso techo', 'false ceiling', 'fals sostre'], ['media onda', 'half-wave', 'mitja ona'], ['obra nueva', 'new build', 'obra nova'], ['alta frecuencia', 'high frequency', 'alta freqüència'], ['a medida', 'custom', 'a mida'],
  ['pantalla táctil', 'touch screen', 'pantalla tàctil'], ['consultar precio y plazo', 'ask for price and lead time', 'consultar preu i termini']];
GLO.rejilla = ['grille', 'reixeta']; GLO.e = ['and', 'i']; GLO.digital = ['digital', 'digital']; GLO.zoom = ['zoom', 'zoom']; GLO.lente = ['lens', 'lent']; GLO.salidas = ['outputs', 'sortides'];
const ADJ = new Set(['óptico', 'panorámica', 'inalámbrico', 'inalámbrica', 'dinámico', 'dinámica', 'activo', 'activa', 'activos', 'interactivo', 'empotrable', 'giratorio', 'colgante', 'integrado', 'digital', 'acústico', 'acústica', 'acustica', 'acústicos', 'acústicas', 'absorbentes', 'amplificadas', 'cardioide', 'supercardioide', 'omnidireccional', 'direccional', 'remoto', 'portátil', 'flexible', 'orientable', 'fijo', 'desmontable', 'modular', 'extraplano', 'transparente', 'luminoso', 'exterior', 'interactivo', 'traseros', 'frontales', 'grande', 'mediana', 'pequeña', 'doble', 'divisible', 'microperforados', 'perforados', 'ranurados', 'enchufable']);
const COLOR = new Set(['blanco', 'blanca', 'blancos', 'negro', 'negra', 'negras', 'beige']);
const caso = (w, t) => !t ? t : (w === w.toUpperCase() && /[A-ZÁÉÍÓÚÑ]{2}/.test(w) ? t.toUpperCase() : (w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase() ? t[0].toUpperCase() + t.slice(1) : t));
export function traduceDes(txt, l) {
  if (!txt || !l || l === 'es') return String(txt || '');
  const i = l === 'en' ? 0 : 1; let s = String(txt); const letras = s.replace(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü]/g, ''), MAY = letras.length > 6 && letras.replace(/[^A-ZÁÉÍÓÚÑÜ]/g, '').length / letras.length > 0.8;
  FRASES.forEach((f) => { s = s.replace(new RegExp('(^|[^A-Za-zÁÉÍÓÚÑÜáéíóúñü])(' + f[0] + ')(?![A-Za-zÁÉÍÓÚÑÜáéíóúñü])', 'gi'), (m, a, w) => a + '\u0001' + caso(w, f[i + 1]) + '\u0002'); });
  const tok = s.match(/\u0001[^\u0002]*\u0002|[A-Za-zÁÉÍÓÚÑÜáéíóúñü]+|[^A-Za-zÁÉÍÓÚÑÜáéíóúñü\u0001]+/g) || [];
  const tr = (w) => { if (w[0] === '\u0001') return w.slice(1, -1); const g = GLO[w.toLowerCase()]; if (!g) return w; const t = caso(w, g[i]); return MAY && w === w.toUpperCase() ? t.toUpperCase() : t; };
  const esP = (w) => !!w && (w[0] === '\u0001' || !!(GLO[w.toLowerCase()] && GLO[w.toLowerCase()][i]));
  const out = [];
  for (let k = 0; k < tok.length; k++) {
    const w = tok[k];
    // inglés: «altavoz de techo» → «ceiling loudspeaker» (el complemento delante)
    if (i === 0 && esP(w) && tok[k + 1] === ' ' && tok[k + 2] && tok[k + 2].toLowerCase() === 'de' && tok[k + 3] === ' ' && esP(tok[k + 4]) && /^[a-záéíóúñü\u0001]/i.test(tok[k + 4])) { const A = tr(tok[k + 4]), B = tr(w), up = B === B.toUpperCase() && /[A-Z]{2}/.test(B), cap = !up && B[0] !== B[0].toLowerCase() && !/^.[A-Z]/.test(B);
      out.push(up ? (A + ' ' + B).toUpperCase() : cap ? A[0].toUpperCase() + A.slice(1) + ' ' + (/^.[A-Z]/.test(B) ? B : B[0].toLowerCase() + B.slice(1)) : A + ' ' + B); k += 4; continue; }
    if (i === 0 && esP(w) && tok[k + 1] === ' ' && (COLOR.has(String(tok[k + 2] || '').toLowerCase()) || ADJ.has(String(tok[k + 2] || '').toLowerCase())) && !ADJ.has(w.toLowerCase())) { const A = tr(tok[k + 2]), B = tr(w), up = B === B.toUpperCase() && /[A-Z]{2}/.test(B), cap = !up && B[0] !== B[0].toLowerCase() && !/^.[A-Z]/.test(B);
      out.push(up ? (A + ' ' + B).toUpperCase() : cap ? A[0].toUpperCase() + A.slice(1) + ' ' + (/^.[A-Z]/.test(B) ? B : B[0].toLowerCase() + B.slice(1)) : A + ' ' + B); k += 2; continue; }
    out.push(/^[A-Za-zÁÉÍÓÚÑÜáéíóúñü\u0001]/.test(w) ? tr(w) : w);
  }
  return out.join('').replace(/\s{2,}/g, ' ').replace(/ ([,.·])/g, ' $1').trim();
}
