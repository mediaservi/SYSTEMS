// SYSTEMS · módulo CONTROL (v2.2): control de sala para el usuario. Según el equipo que se controla (etapas RCF KPS o DMA,
// megafonía RCF ZM o procesador Xilica Solaro), los puntos de control, la interfaz (pantalla táctil o mando de pared) y las tomas de pared
// (Bluetooth, USB, XLR), con los puertos PoE y lo que va por proyecto. Solo con equipos de las listas del panel. GPL-3.0 · mediaservi.com
import { T, N, esc, textos, lee, guarda, togs, num, etq } from './util.js';
import { equipos, esInterno } from './listas.js';
textos({
  'CONTROL': ['CONTROL', 'CONTROL'], 'Control': ['Control', 'Control'],
  'Control de sala: pantalla táctil o mando de pared para el equipo de audio, con tomas Bluetooth, USB y XLR en la pared.': ['Room control: touch screen or wall controller for the audio system, with Bluetooth, USB and XLR wall inputs.', 'Control de sala: pantalla tàctil o comandament de paret per a l\'equip d\'àudio, amb preses Bluetooth, USB i XLR a la paret.'],
  'Escríbela: «4 salas con mando de pared blanco y Bluetooth»': ['Type it: “4 rooms with white wall controller and Bluetooth”', 'Escriu-la: «4 sales amb comandament de paret blanc i Bluetooth»'],
  'Equipo que se controla': ['System to control', 'Equip que es controla'], 'Etapas RCF KPS': ['RCF KPS amplifiers', 'Etapes RCF KPS'], 'Etapas RCF DMA': ['RCF DMA amplifiers', 'Etapes RCF DMA'], 'Megafonía RCF ZM': ['RCF ZM paging', 'Megafonia RCF ZM'], 'Procesador Xilica': ['Xilica processor', 'Processador Xilica'],
  'Puntos de control': ['Control points', 'Punts de control'], 'Zonas': ['Zones', 'Zones'], 'Interfaz': ['Interface', 'Interfície'], 'Pantalla táctil': ['Touch screen', 'Pantalla tàctil'], 'Mando de pared': ['Wall controller', 'Comandament de paret'],
  'Acabado': ['Finish', 'Acabat'], 'Negro': ['Black', 'Negre'], 'Blanco': ['White', 'Blanc'], 'Sobremesa': ['Desktop', 'Sobretaula'], 'En la pared': ['On the wall', 'A la paret'],
  'Tomas de pared': ['Wall inputs', 'Preses de paret'], 'Bluetooth': ['Bluetooth', 'Bluetooth'], 'USB': ['USB', 'USB'], 'XLR': ['XLR', 'XLR'],
  'Esquema de control': ['Control diagram', 'Esquema de control'], 'Mandos': ['Controllers', 'Comandaments'], 'Tomas': ['Inputs', 'Preses'], 'Puertos PoE': ['PoE ports', 'Ports PoE'], 'Por proyecto': ['Per project', 'Per projecte'], 'Teclados': ['Keypads', 'Teclats'],
  'Switch PoE': ['PoE switch', 'Switch PoE'], 'Red': ['Network', 'Xarxa'], 'Sí': ['Yes', 'Sí'], 'No': ['No', 'No'],
  '¿Qué equipo se controla?': ['What system is controlled?', 'Quin equip es controla?'], '¿Cuántos puntos de control?': ['How many control points?', 'Quants punts de control?'], '¿Cómo se controla?': ['How is it controlled?', 'Com es controla?'], '¿Qué se conecta en la pared?': ['What plugs in on the wall?', 'Què es connecta a la paret?'],
  'Amplificadores con DSP y matriz': ['Amplifiers with DSP and matrix', 'Amplificadors amb DSP i matriu'], 'Amplificador matriz de zonas': ['Zone matrix amplifier', 'Amplificador matriu de zones'], 'Avisos por zonas': ['Zone paging', 'Avisos per zones'], 'Audio, vídeo y sala completa': ['Audio, video and the whole room', 'Àudio, vídeo i sala completa'],
  'Fuentes, escenas y volumen en una pantalla': ['Sources, scenes and volume on a screen', 'Fonts, escenes i volum en una pantalla'], 'Rueda y botones, lo justo': ['Knob and buttons, just enough', 'Roda i botons, el just'],
  'Nada': ['Nothing', 'Res'], 'Móvil o portátil sin cables': ['Phone or laptop, wireless', 'Mòbil o portàtil sense cables'], 'Ordenador por cable': ['Computer by cable', 'Ordinador per cable'], 'Micrófono o mesa de mezclas': ['Microphone or mixing desk', 'Micròfon o taula de mescles'],
  'Hay solución': ['There is a solution', 'Hi ha solució'], 'Hay solución, con avisos': ['There is a solution, with warnings', 'Hi ha solució, amb avisos'], 'Sin solución en las listas': ['No solution in the lists', 'Sense solució a les llistes'],
  'Un mando {m} por punto de control: {n} en total, por la red con PoE.': ['One {m} controller per control point: {n} in total, over the network with PoE.', 'Un comandament {m} per punt de control: {n} en total, per la xarxa amb PoE.'],
  'Un mando {m} por punto de control: {n} en total.': ['One {m} controller per control point: {n} in total.', 'Un comandament {m} per punt de control: {n} en total.'],
  'Las etapas KPS no llevan pantalla táctil propia: para controlarlas con una pantalla, procesador Xilica Solaro con XTouch 80 (por proyecto).': ['KPS amplifiers have no touch screen of their own: to use a screen, a Xilica Solaro processor with XTouch 80 (per project).', 'Les etapes KPS no porten pantalla tàctil pròpia: per controlar-les amb una pantalla, processador Xilica Solaro amb XTouch 80 (per projecte).'],
  'Las DMA se controlan con su mando de pared; para una pantalla táctil, procesador Xilica Solaro con XTouch 80 (por proyecto).': ['DMA amplifiers use their wall controller; for a touch screen, a Xilica Solaro processor with XTouch 80 (per project).', 'Les DMA es controlen amb el seu comandament de paret; per a una pantalla tàctil, processador Xilica Solaro amb XTouch 80 (per projecte).'],
  'Megafonía ZM: {z} zonas con la consola BM 2006 (6 zonas) y {n} teclado(s) BE 2012 de 12 zonas; hasta 4 teclados por consola.': ['ZM paging: {z} zones with the BM 2006 console (6 zones) and {n} BE 2012 12-zone keypad(s); up to 4 keypads per console.', 'Megafonia ZM: {z} zones amb la consola BM 2006 (6 zones) i {n} teclat(s) BE 2012 de 12 zones; fins a 4 teclats per consola.'],
  'Con 6 zonas o menos basta la consola BM 2006: no hacen falta teclados.': ['With 6 zones or fewer the BM 2006 console is enough: no keypads needed.', 'Amb 6 zones o menys n\'hi ha prou amb la consola BM 2006: no calen teclats.'],
  'Más de 54 zonas: es el máximo del sistema ZM 2000 (una central y 8 expansores).': ['More than 54 zones: that is the ZM 2000 system maximum (one central unit and 8 expanders).', 'Més de 54 zones: és el màxim del sistema ZM 2000 (una central i 8 expansors).'],
  'Xilica se cotiza por proyecto e incluye el servicio de configuración de las pantallas, escenas y permisos.': ['Xilica is quoted per project and includes the configuration of screens, scenes and permissions.', 'Xilica es cotitza per projecte i inclou el servei de configuració de les pantalles, escenes i permisos.'],
  'Las tomas GIO van por Dante/AES67: hace falta un procesador o unas etapas con Dante (KPS D o Xilica Solaro).': ['GIO wall inputs run on Dante/AES67: a processor or amplifiers with Dante are needed (KPS D or Xilica Solaro).', 'Les preses GIO van per Dante/AES67: cal un processador o unes etapes amb Dante (KPS D o Xilica Solaro).'],
  'Switch de red con {n} puertos PoE para los mandos y las tomas (además de las etapas y el procesador).': ['Network switch with {n} PoE ports for the controllers and inputs (plus the amplifiers and processor).', 'Switch de xarxa amb {n} ports PoE per als comandaments i les preses (a més de les etapes i el processador).'],
  'El mando {m} de la lista solo viene en {c}.': ['The {m} controller in the list only comes in {c}.', 'El comandament {m} de la llista només ve en {c}.'],
  'Táctil': ['Touch', 'Tàctil'], 'Pared': ['Wall', 'Paret'], 'negro': ['black', 'negre'], 'blanco': ['white', 'blanc'], 'puntos': ['points', 'punts'],
});
const SIS = [['kps', 'Etapas RCF KPS', 'Amplificadores con DSP y matriz', 'proc'], ['dma', 'Etapas RCF DMA', 'Amplificador matriz de zonas', 'altavoz'], ['zm', 'Megafonía RCF ZM', 'Avisos por zonas', 'micro'], ['xilica', 'Procesador Xilica', 'Audio, vídeo y sala completa', 'chip']];
const DEF = { sis: 'kps', puntos: 2, zonas: 6, ui: 'mural', color: 'negro', mesa: false, bt: false, usb: false, xlr: false };
let S = Object.assign({}, DEF, lee('systems_control') || {});
const NUMS = { puntos: [1, 40, 0], zonas: [1, 60, 0] };
const BOOL = ['mesa', 'bt', 'usb', 'xlr'];
const uno = (id) => equipos(['control', 'accesorio', 'interfaz-audio', 'microfono', 'procesador-audio']).find((x) => x.id === id) || null;

function calcula() {
  const av = [], r = { av, lin: [] };
  const L = (x, n, tit) => { if (x && n > 0) r.lin.push([x, n, tit]); };
  let poe = 0, proyecto = false;
  const tactil = S.ui === 'tactil';
  if (S.sis === 'zm') {
    const z = Math.min(S.zonas, 54), cons = uno('BM-2006'), tec = z > 6 ? Math.ceil((z - 6) / 12) : 0;
    L(cons, 1, 'Mandos'); L(uno('BE-2012'), Math.min(tec, 4), 'Teclados');
    av.push(['info', tec ? T('Megafonía ZM: {z} zonas con la consola BM 2006 (6 zonas) y {n} teclado(s) BE 2012 de 12 zonas; hasta 4 teclados por consola.', { z, n: Math.min(tec, 4) }) : T('Con 6 zonas o menos basta la consola BM 2006: no hacen falta teclados.')]);
    if (S.zonas > 54) av.push(['', T('Más de 54 zonas: es el máximo del sistema ZM 2000 (una central y 8 expansores).')]);
    r.mando = cons; r.nm = 1;
  } else if (S.sis === 'xilica' || tactil) {
    if (S.sis === 'kps' && tactil) av.push(['', T('Las etapas KPS no llevan pantalla táctil propia: para controlarlas con una pantalla, procesador Xilica Solaro con XTouch 80 (por proyecto).')]);
    if (S.sis === 'dma' && tactil) av.push(['', T('Las DMA se controlan con su mando de pared; para una pantalla táctil, procesador Xilica Solaro con XTouch 80 (por proyecto).')]);
    const m = uno(tactil ? 'XTOUCH-80' : 'LUC2-NX');
    r.mando = m; r.nm = S.puntos; L(m, S.puntos, 'Mandos');
    if (tactil && S.mesa) L(uno('XT80-TTS'), S.puntos, 'Sobremesa');
    if (m) { poe += S.puntos; av.push(['info', T('Un mando {m} por punto de control: {n} en total, por la red con PoE.', { m: m.modelo, n: S.puntos })]); }
    proyecto = true;
  } else {
    const fam = S.sis === 'kps' ? 'RC-KPS' : 'RC-401-EU', want = fam + '-' + (S.color === 'blanco' ? 'W' : 'B');
    let m = uno(want); if (!m) { m = uno(fam + '-' + (S.color === 'blanco' ? 'B' : 'W')); if (m) av.push(['', T('El mando {m} de la lista solo viene en {c}.', { m: m.modelo, c: T(m.color || '') })]); }
    r.mando = m; r.nm = S.puntos; L(m, S.puntos, 'Mandos');
    if (m) { if (m.poe) poe += S.puntos; av.push(['info', T(m.poe ? 'Un mando {m} por punto de control: {n} en total, por la red con PoE.' : 'Un mando {m} por punto de control: {n} en total.', { m: m.modelo, n: S.puntos })]); }
  }
  /* tomas de pared (Dante) */
  const tomas = [['bt', 'GIO-BT2'], ['usb', 'GIO-USB'], ['xlr', 'GIO-XLR']].filter((t) => S[t[0]]);
  if (tomas.length && S.sis !== 'zm') {
    tomas.forEach((t) => { const x = uno(t[1]); L(x, S.puntos, 'Tomas'); if (x && x.poe) poe += S.puntos; });
    proyecto = true;
    if (S.sis === 'kps' || S.sis === 'dma') av.push(['info', T('Las tomas GIO van por Dante/AES67: hace falta un procesador o unas etapas con Dante (KPS D o Xilica Solaro).')]);
  }
  if (proyecto) av.push(['info', T('Xilica se cotiza por proyecto e incluye el servicio de configuración de las pantallas, escenas y permisos.')]);
  if (poe) av.push(['info', T('Switch de red con {n} puertos PoE para los mandos y las tomas (además de las etapas y el procesador).', { n: poe })]);
  r.poe = poe; r.proyecto = proyecto; r.ntomas = tomas.length * (S.sis === 'zm' ? 0 : S.puntos);
  r.sem = !r.mando ? 'R' : av.some((a) => !a[0]) ? 'A' : 'V';
  r.semTxt = T(r.sem === 'R' ? 'Sin solución en las listas' : r.sem === 'A' ? 'Hay solución, con avisos' : 'Hay solución');
  r.lineaTxt = r.lin.map((l) => l[1] + ' × ' + l[0].modelo).join(' · ') || '—';
  r.linea = r.lin.length ? r.lin.map((l) => `<b>${l[1]} × ${esc(l[0].modelo)}</b>`).join(' · ') : '<b>—</b>';
  guarda('systems_control', S); return r;
}
function esquema(r, o = {}) {
  const mov = !!o.vertical, VW = mov ? 480 : 960, VH = 520;
  const sis = SIS.find((x) => x[0] === S.sis), cx = VW / 2;
  const caja = (x, y, w, h, t, sub, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="var(--blk2)" stroke="${col}" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 - (sub ? 4 : -5)}" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--txt)">${esc(t)}</text>${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 16}" text-anchor="middle" font-size="12" class="t-mono t-ten">${esc(sub)}</text>` : ''}`;
  const bw = mov ? 300 : 340;
  let s = caja(cx - bw / 2, 40, bw, 70, T(sis[1]), T(sis[2]), 'var(--azul)');
  if (r.poe) s += caja(cx - bw / 2, 170, bw, 56, T('Switch PoE'), r.poe + ' × PoE', 'var(--ambar)') + `<line x1="${cx}" y1="110" x2="${cx}" y2="170" stroke="var(--ambar)" stroke-width="3"/>`;
  const yb = 300, n = Math.min(r.nm || 0, mov ? 4 : 8), gap = 12, cw = Math.min(150, (VW - 40 - (n - 1) * gap) / Math.max(1, n)), x0 = (VW - (n * cw + (n - 1) * gap)) / 2;
  for (let i = 0; i < n; i++) { const x = x0 + i * (cw + gap), y1 = r.poe ? 226 : 110; s += `<line x1="${cx}" y1="${y1}" x2="${x + cw / 2}" y2="${yb}" stroke="var(--linea)" stroke-width="2"/>` + caja(x, yb, cw, 74, r.mando ? r.mando.modelo : '—', (S.sis === 'zm' ? '' : T('Puntos de control') + ' ' + (i + 1)), 'var(--verde-txt)');
    if (r.ntomas) s += `<rect x="${x + 8}" y="${yb + 86}" width="${cw - 16}" height="30" rx="6" fill="var(--violeta)" fill-opacity=".16" stroke="var(--violeta)"/><text x="${x + cw / 2}" y="${yb + 106}" text-anchor="middle" font-size="12" class="t-mono">${esc([S.bt && 'BT', S.usb && 'USB', S.xlr && 'XLR'].filter(Boolean).join(' · '))}</text>`; }
  if ((r.nm || 0) > n) s += `<text x="${cx}" y="${yb + 140}" text-anchor="middle" font-size="14" class="t-mono t-ten">+ ${r.nm - n}</text>`;
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(T('Esquema de control'))}" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
}
const eq = (x, n, tit, rec) => x ? `<div class="equipo${rec ? ' rec' : ''}"><div class="eq-cab"><b>${x.prioritario ? '⭐ ' : ''}${esc(x.modelo)}</b><span class="serie">${esc(x.marca)}${tit ? ' · ' + esc(T(tit)) : ''}</span>${rec ? `<span class="etq">${T('Recomendado').toUpperCase()}</span>` : ''}</div><table class="despiece"><tr><td>${n}×</td><td class="ref">${esc(x.id)}</td><td class="des">${esc(x.descripcion || '')}${x.stock && esInterno() ? '<span class="st-int"> · ' + esc(T('En stock')) + '</span>' : ''}</td></tr></table></div>` : '';
function resultado(r) {
  let h = `<div class="veredicto ${r.sem === 'A' ? 'aviso' : r.sem === 'R' ? 'mal' : ''}"><b>${esc(r.semTxt)}</b><p>${esc(r.lineaTxt)}</p></div>`;
  h += r.lin.map((l, i) => eq(l[0], l[1], l[2], i === 0)).join('');
  if (r.av.length) h += `<ul class="avisos">${r.av.map((a) => `<li class="${a[0]}">${esc(a[1])}</li>`).join('')}</ul>`;
  return h;
}
const cifras = (r) => [
  { t: 'Mandos', v: r.mando ? String(r.nm) : '—', u: r.mando ? '× ' + r.mando.modelo : '', s: r.mando ? r.mando.marca : '', ic: 'mano', c: 'var(--verde-txt)' },
  { t: 'Interfaz', v: T(S.sis !== 'zm' && S.ui === 'tactil' ? 'Táctil' : 'Pared'), s: S.sis === 'zm' ? '' : T(S.color === 'blanco' ? 'Blanco' : 'Negro'), ic: 'tele', c: 'var(--azul)' },
  { t: 'Puntos de control', v: String(S.sis === 'zm' ? 1 : S.puntos), s: S.sis === 'zm' ? S.zonas + ' ' + T('Zonas').toLowerCase() : '', ic: 'pin', c: 'var(--violeta)' },
  { t: 'Tomas', v: String(r.ntomas), s: [S.bt && 'BT', S.usb && 'USB', S.xlr && 'XLR'].filter(Boolean).join(' · ') || T('Nada'), ic: 'cable', c: 'var(--ambar)' },
  { t: 'Puertos PoE', v: String(r.poe), s: T('Switch PoE'), ic: 'red', c: 'var(--verde)' },
  { t: 'Por proyecto', v: T(r.proyecto ? 'Sí' : 'No'), s: r.proyecto ? 'Xilica' : '', ic: 'chispa', c: 'var(--magenta, #e24bf0)' }];
function datos() {
  const zm = S.sis === 'zm';
  return [{ tit: 'Equipo que se controla', ic: 'proc', ac: 'var(--azul)', html: togs('sis', SIS.map((x) => [x[0], x[1]]), S.sis, 'dos') + (zm ? num('zonas', 'Zonas', S.zonas, '', 1, 1, 60) : num('puntos', 'Puntos de control', S.puntos, '', 1, 1, 40)) },
    { tit: 'Interfaz', ic: 'mano', ac: 'var(--verde-txt)', html: (zm ? '' : togs('ui', [['tactil', 'Pantalla táctil'], ['mural', 'Mando de pared']], S.ui, 'dos')) + etq('Acabado') + `<div class="fila envuelve dos">${[['color', 'negro', 'Negro'], ['color', 'blanco', 'Blanco']].map((o) => `<button type="button" class="tog" aria-pressed="${S[o[0]] === o[1]}" data-set="${o[0]}" data-v="${o[1]}"><span>${esc(T(o[2]))}</span></button>`).join('')}${S.ui === 'tactil' && !zm ? `<button type="button" class="tog" aria-pressed="${!!S.mesa}" data-set="mesa" data-v="${!S.mesa}"><span>${esc(T('Sobremesa'))}</span></button>` : ''}</div>` },
    { tit: 'Tomas de pared', ic: 'cable', ac: 'var(--violeta)', html: `<div class="fila envuelve tres">${['bt', 'usb', 'xlr'].map((b) => `<button type="button" class="tog" aria-pressed="${!!S[b]}" data-set="${b}" data-v="${!S[b]}"${zm ? ' disabled' : ''}><span>${esc(T({ bt: 'Bluetooth', usb: 'USB', xlr: 'XLR' }[b]))}</span></button>`).join('')}</div>` + `<div class="pie-b"><button type="button" data-acc="reset">${esc(T('RESTABLECER'))}</button></div>` }];
}
const nomSis = (u) => (SIS.find((x) => x[0] === u) || SIS[0])[1];
const tomTxt = () => [S.bt && 'Bluetooth', S.usb && 'USB', S.xlr && 'XLR'].filter(Boolean).join(' · ') || T('Nada');
const filas = () => [['sis', 'proc', 'Equipo que se controla', T(nomSis(S.sis))], ['puntos', 'pin', S.sis === 'zm' ? 'Zonas' : 'Puntos de control', String(S.sis === 'zm' ? S.zonas : S.puntos)], ['ui', 'mano', 'Interfaz', T(S.sis === 'zm' || S.ui === 'mural' ? 'Mando de pared' : 'Pantalla táctil')], ['tomas', 'cable', 'Tomas de pared', tomTxt()]];
const pasos = () => ['sis', 'puntos', 'ui', 'tomas'];
const TOM = { nada: [false, false, false], bt: [true, false, false], usb: [false, true, false], xlr: [false, false, true], todo: [true, true, true] };
function pregunta(k) {
  switch (k) {
    case 'sis': return { q: '¿Qué equipo se controla?', val: S.sis, ops: SIS, aplica: (v) => { S.sis = v; } };
    case 'puntos': return S.sis === 'zm'
      ? { q: '¿Cuántos puntos de control?', val: S.zonas, ops: [6, 12, 18, 30, 54].map((n) => [n, n + ' ' + T('Zonas').toLowerCase(), '', 'pin']), aplica: (v) => { S.zonas = +v; } }
      : { q: '¿Cuántos puntos de control?', val: S.puntos, ops: [1, 2, 3, 4, 6, 8, 12].map((n) => [n, String(n), '', 'pin']), aplica: (v) => { S.puntos = +v; } };
    case 'ui': return { q: '¿Cómo se controla?', val: S.ui, ops: [['tactil', 'Pantalla táctil', 'Fuentes, escenas y volumen en una pantalla', 'tele'], ['mural', 'Mando de pared', 'Rueda y botones, lo justo', 'mano']], aplica: (v) => { S.ui = v; } };
    case 'tomas': { const cur = Object.keys(TOM).find((x) => TOM[x].join() === [!!S.bt, !!S.usb, !!S.xlr].join()) || '';
      return { q: '¿Qué se conecta en la pared?', val: cur, ops: [['nada', 'Nada', '', 'nada'], ['bt', 'Bluetooth', 'Móvil o portátil sin cables', 'onda'], ['usb', 'USB', 'Ordenador por cable', 'chip'], ['xlr', 'XLR', 'Micrófono o mesa de mezclas', 'micro']], aplica: (v) => { [S.bt, S.usb, S.xlr] = TOM[v] || TOM.nada; } }; }
  }
  return null;
}
function pon(k, v) {
  if (NUMS[k]) { const [a, b, d] = NUMS[k], n = +v; S[k] = Math.max(a, Math.min(b, isFinite(n) ? +n.toFixed(d) : a)); }
  else if (BOOL.includes(k)) S[k] = v === true || v === 'true';
  else S[k] = v;
}
function pide(t) {
  const s = t.toLowerCase().replace(/,/g, '.'); let ok = false, m;
  if ((m = s.match(/(\d+)\s*(salas|puntos|rooms|sales|punts|mandos|controles)/))) { S.puntos = Math.min(40, Math.max(1, +m[1])); ok = true; }
  if ((m = s.match(/(\d+)\s*(zonas|zones)/))) { S.zonas = Math.min(60, Math.max(1, +m[1])); ok = true; }
  if (/t[áa]ctil|touch|pantalla/.test(s)) S.ui = 'tactil'; if (/pared|wall|mural|paret/.test(s)) S.ui = 'mural';
  if (/blanc|white/.test(s)) S.color = 'blanco'; if (/negr|black/.test(s)) S.color = 'negro';
  if (/bluetooth|\bbt\b/.test(s)) S.bt = true; if (/usb/.test(s)) S.usb = true; if (/xlr/.test(s)) S.xlr = true;
  if (/xilica|solaro/.test(s)) S.sis = 'xilica'; else if (/megafon|avisos|paging|\bzm\b/.test(s)) S.sis = 'zm'; else if (/\bdma\b/.test(s)) S.sis = 'dma'; else if (/\bkps\b/.test(s)) S.sis = 'kps';
  return ok || /control|mando|xtouch|lucia|controller|comandament/.test(s);
}
export default {
  id: 'control', nom: 'Control', corto: 'CONTROL', ic: 'control', ejemplo: 'Escríbela: «4 salas con mando de pared blanco y Bluetooth»',
  info: 'Control de sala: pantalla táctil o mando de pared para el equipo de audio, con tomas Bluetooth, USB y XLR en la pared.',
  calcula, filas, pasos, pregunta, datos, resultado, cifras, pide,
  reconoce: (t) => /control de sala|mando de pared|comandament|t[áàa]ctil|xtouch|lucia|room control|wall panel/i.test(t),
  esquema: (r, o) => ({ tit: 'Esquema de control', ic: 'red', html: esquema(r, o) }),
  set: pon, num: pon, pm: (k, d) => pon(k, +S[k] + d),
  accion: (a) => { if (a === 'reset') S = Object.assign({}, DEF); }, reset: () => { S = Object.assign({}, DEF); },
};
