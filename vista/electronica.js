// SYSTEMS v1.0 · módulo ELECTRÓNICA LED: la electrónica de control para quien ya tiene la pantalla y las fuentes.
// Consola hermana de la de SCREENS (SIMPLE con asistente, PRO con todos los datos), mismo motor (comun/electronica.js: SC_ELEC)
// y mismas listas de equipos (comun/equipos.js de fábrica; en vivo, las de AVHUB ADMIN). Licencia GPL-3.0 · mediaservi.com
const VERSION = 'v1.0';
const ADMIN_URL = 'https://script.google.com/macros/s/AKfycbwkc12y4LODbFe-kQidnR2MbbA6cbW1WbhU3UiqmDmshx-ncAdGYrFRy8PNjm9Wg6Mx3w/exec';
const IDIOMAS = ['es', 'en', 'ca'];
const $ = s => document.querySelector(s);
const E = () => globalThis.SC_ELEC;

/* ---------- idiomas: el texto en español es la clave; [inglés, catalán] ---------- */
const TR = {
  'ELECTRÓNICA LED': ['LED ELECTRONICS', 'ELECTRÒNICA LED'], 'AUDIO': ['AUDIO', 'ÀUDIO'], 'CALCULAR': ['CALCULATE', 'CALCULA'], 'RESTABLECER': ['RESET', 'RESTABLEIX'],
  'Lo que tienes': ['What you have', 'El que tens'], 'Esquema de la señal': ['Signal diagram', 'Esquema del senyal'], 'Resultado': ['Result', 'Resultat'],
  'Pantalla': ['Screen', 'Pantalla'], 'Resolución': ['Resolution', 'Resolució'], 'Cabinets': ['Cabinets', 'Cabinets'],
  'Ancho (px)': ['Width (px)', 'Amplada (px)'], 'Alto (px)': ['Height (px)', 'Alçada (px)'],
  'Cabinet ancho (px)': ['Cabinet width (px)', 'Cabinet amplada (px)'], 'Cabinet alto (px)': ['Cabinet height (px)', 'Cabinet alçada (px)'],
  'Cabinets en ancho': ['Cabinets across', 'Cabinets en amplada'], 'Cabinets en alto': ['Cabinets high', 'Cabinets en alçada'],
  'Refresco': ['Refresh', 'Refresc'], 'Fuentes': ['Sources', 'Fonts'], 'Salidas de la fuente': ['Source outputs', 'Sortides de la font'], 'Tipo de salida': ['Output type', 'Tipus de sortida'],
  'Máximo por salida': ['Maximum per output', 'Màxim per sortida'], 'Instalación': ['Installation', 'Instal·lació'], 'Cable de red (< 100 m)': ['Network cable (< 100 m)', 'Cable de xarxa (< 100 m)'],
  'Fibra': ['Fibre', 'Fibra'], 'Backup de líneas': ['Line backup', 'Backup de línies'], 'Sin backup': ['No backup', 'Sense backup'], 'Backup 1:1': ['1:1 backup', 'Backup 1:1'],
  'Marca': ['Brand', 'Marca'], 'Todas': ['All', 'Totes'], 'PREGÚNTAME': ['ASK ME', 'PREGUNTA\'M'],
  'Resolución total': ['Total resolution', 'Resolució total'], 'Líneas de datos': ['Data lines', 'Línies de dades'], 'Señal de entrada': ['Input signal', 'Senyal d\'entrada'], 'Procesador': ['Processor', 'Processador'],
  'salidas': ['outputs', 'sortides'], 'salida': ['output', 'sortida'], 'líneas': ['lines', 'línies'], 'fibras': ['fibres', 'fibres'], 'mínimo teórico': ['theoretical minimum', 'mínim teòric'],
  'con backup': ['with backup', 'amb backup'], 'Recomendado': ['Recommended', 'Recomanat'], 'Alternativas': ['Alternatives', 'Alternatives'],
  'Página del producto': ['Product page', 'Pàgina del producte'], 'Ficha técnica': ['Datasheet', 'Fitxa tècnica'], 'Capacidad': ['Capacity', 'Capacitat'],
  'Fuente': ['Source', 'Font'], 'Pantalla LED': ['LED screen', 'Pantalla LED'],
  'Hay solución': ['There is a solution', 'Hi ha solució'], 'Hay solución, con avisos': ['There is a solution, with warnings', 'Hi ha solució, amb avisos'], 'No hay solución con estos datos': ['No solution with these details', 'No hi ha solució amb aquestes dades'],
  'Cálculo automático que puede contener errores: compruébalo antes de presupuestar o instalar.': ['Automatic calculation that may contain errors: check it before quoting or installing.', 'Càlcul automàtic que pot contenir errors: comprova\'l abans de pressupostar o instal·lar.'],
  'Escribe la resolución de la pantalla.': ['Enter the screen resolution.', 'Escriu la resolució de la pantalla.'],
  'Hacen falta {m} salidas (cada una llega como máximo a {r}) y la fuente tiene {n}.': ['{m} outputs are needed (each one reaches {r} at most) and the source has {n}.', 'Calen {m} sortides (cada una arriba com a màxim a {r}) i la font en té {n}.'],
  'Ningún procesador de la lista llega a {px} Mpx y {w} px de ancho con {m} entradas {t}.': ['No processor in the list reaches {px} Mpx and {w} px wide with {m} {t} inputs.', 'Cap processador de la llista arriba a {px} Mpx i {w} px d\'amplada amb {m} entrades {t}.'],
  'Líneas: mínimo teórico ({p} px por puerto a {hz} Hz). Con el cabinet salen las reales y el corte por columnas.': ['Lines: theoretical minimum ({p} px per port at {hz} Hz). With the cabinet you get the real ones and the cut by columns.', 'Línies: mínim teòric ({p} px per port a {hz} Hz). Amb el cabinet surten les reals i el tall per columnes.'],
  'La fuente tiene que sacar las {n} salidas sincronizadas: NVIDIA Mosaic (gráficas profesionales), Surround en GeForce (salidas iguales: {n} × {e}) o un reproductor que pinte en varias salidas.': ['The source must output the {n} outputs in sync: NVIDIA Mosaic (professional GPUs), Surround on GeForce (equal outputs: {n} × {e}) or a player that renders on several outputs.', 'La font ha de treure les {n} sortides sincronitzades: NVIDIA Mosaic (gràfiques professionals), Surround a GeForce (sortides iguals: {n} × {e}) o un reproductor que pinti en diverses sortides.'],
  'Corte por columnas de cabinet: {c}.': ['Cut by cabinet columns: {c}.', 'Tall per columnes de cabinet: {c}.'],
  'Cable de red Cat6 de hasta 100 m por línea; si el rack está más lejos, fibra.': ['Cat6 network cable up to 100 m per line; if the rack is further away, fibre.', 'Cable de xarxa Cat6 de fins a 100 m per línia; si el rack és més lluny, fibra.'],
  'Backup 1:1: cada línea lleva su retorno en bucle, así que se doblan los puertos.': ['1:1 backup: each line has its return loop, so the ports double.', 'Backup 1:1: cada línia porta el seu retorn en bucle, així que es dobleguen els ports.'],
  'Con {hz} Hz cada puerto carga menos píxeles ({p} px).': ['At {hz} Hz each port carries fewer pixels ({p} px).', 'A {hz} Hz cada port carrega menys píxels ({p} px).'],
  'Comprueba en la ficha que las entradas aceptan {r} a medida.': ['Check in the datasheet that the inputs accept a custom {r}.', 'Comprova a la fitxa que les entrades accepten {r} a mida.'],
  'Hola. Te haré unas preguntas muy sencillas y te diré qué electrónica necesitas.': ['Hi. I will ask you a few very simple questions and tell you which electronics you need.', 'Hola. Et faré unes preguntes molt senzilles i et diré quina electrònica necessites.'],
  'SALTAR': ['SKIP', 'SALTA'], 'SIGUIENTE': ['NEXT', 'SEGÜENT'], 'VER RESULTADO': ['SEE RESULT', 'VEURE EL RESULTAT'],
  '¿Qué sabes de tu pantalla?': ['What do you know about your screen?', 'Què saps de la teva pantalla?'],
  'Su resolución total': ['Its total resolution', 'La seva resolució total'], 'Ancho × alto en píxeles': ['Width × height in pixels', 'Amplada × alçada en píxels'],
  'El cabinet y cuántos hay': ['The cabinet and how many', 'El cabinet i quants n\'hi ha'], 'Así salen las líneas reales': ['So you get the real lines', 'Així surten les línies reals'],
  '¿Qué la alimenta?': ['What feeds it?', 'Què l\'alimenta?'], 'Un PC con DisplayPort': ['A PC with DisplayPort', 'Un PC amb DisplayPort'], 'La mayoría de PC y gráficas': ['Most PCs and graphics cards', 'La majoria de PC i gràfiques'],
  'HDMI': ['HDMI', 'HDMI'], 'Reproductor, PC o mediaserver': ['Player, PC or media server', 'Reproductor, PC o mediaserver'], 'SDI': ['SDI', 'SDI'], 'Cámaras y realización': ['Cameras and production', 'Càmeres i realització'],
  '¿Cuántas salidas tiene la fuente?': ['How many outputs does the source have?', 'Quantes sortides té la font?'],
  '¿A qué distancia está el rack de la pantalla?': ['How far is the rack from the screen?', 'A quina distància és el rack de la pantalla?'],
  'Menos de 100 m': ['Less than 100 m', 'Menys de 100 m'], 'Cable de red directo': ['Direct network cable', 'Cable de xarxa directe'], 'Más de 100 m': ['More than 100 m', 'Més de 100 m'], 'Por fibra': ['By fibre', 'Per fibra'],
  '¿Quieres backup de líneas?': ['Do you want line backup?', 'Vols backup de línies?'], 'No': ['No', 'No'], 'Solo las líneas necesarias': ['Only the lines needed', 'Només les línies necessàries'],
  'Sí, 1:1': ['Yes, 1:1', 'Sí, 1:1'], 'Cada línea con su retorno': ['Each line with its return', 'Cada línia amb el seu retorn'],
  'Claro / oscuro': ['Light / dark', 'Clar / fosc'], 'Idioma': ['Language', 'Idioma'], 'Ajusta la señal de la fuente a las entradas del procesador.': ['Matches the source signal to the processor inputs.', 'Ajusta el senyal de la font a les entrades del processador.'],
  'entradas': ['inputs', 'entrades'], 'conv.': ['conv.', 'conv.'], 'Despiece': ['Parts', 'Desglossament'], 'Avisos': ['Warnings', 'Avisos'], 'Faltan salidas en la fuente': ['The source is short of outputs', 'Falten sortides a la font'],
  'La ficha de {m} no nombra entradas {t}: hará falta un adaptador activo o comprobarlo.': ['The {m} datasheet does not list {t} inputs: an active adapter will be needed, or check it.', 'La fitxa de {m} no esmenta entrades {t}: caldrà un adaptador actiu o comprovar-ho.']
};
let LANG = (() => { let l = ''; try { l = new URLSearchParams(location.search).get('lang') || localStorage.getItem('screens_idioma') || ''; } catch (e) {} if (!IDIOMAS.includes(l)) l = (navigator.language || 'es').slice(0, 2).toLowerCase(); return IDIOMAS.includes(l) ? l : 'es'; })();
const T = (k, v) => { let s = LANG === 'es' || !TR[k] ? k : TR[k][LANG === 'en' ? 0 : 1]; if (v) Object.keys(v).forEach(x => { s = s.split('{' + x + '}').join(v[x]); }); return s; };
const N = (x, d = 0) => (typeof x === 'number' && isFinite(x)) ? x.toLocaleString(LANG === 'en' ? 'en-GB' : 'es-ES', { maximumFractionDigits: d, minimumFractionDigits: d }) : '—';
const TM = s => (LANG === 'es' || !globalThis.SC_TR_MOTOR) ? String(s || '') : globalThis.SC_TR_MOTOR(s, LANG);   // textos del motor común (en castellano) a inglés y catalán, como en SCREENS
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- estado ---------- */
const DEF = { cab: false, resW: 1920, resH: 1080, cabW: 640, cabH: 384, nW: 3, nH: 3, hz: 60, salidas: 1, tipo: 'HDMI', maxSal: '4K', conexion: 'directo', backup: false, marca: 'todas' };
let S = Object.assign({}, DEF), MODO = 'simple', R = null;
try { const g = JSON.parse(localStorage.getItem('systems_elec') || 'null'); if (g && g.S) { S = Object.assign({}, DEF, g.S); MODO = g.modo === 'pro' ? 'pro' : 'simple'; } } catch (e) {}
const guardar = () => { try { localStorage.setItem('systems_elec', JSON.stringify({ S, modo: MODO })); } catch (e) {} };

/* ---------- cálculo ---------- */
const MAXS = { '4K': [3840, 2160], '2K': [1920, 1080] };
function reparte(total, partes) { const b = Math.floor(total / partes), x = total % partes; return Array.from({ length: partes }, (_, i) => b + (i < x ? 1 : 0)); }
function calcula() {
  const el = E(); const av = [];
  const W = S.cab ? S.cabW * S.nW : S.resW, H = S.cab ? S.cabH * S.nH : S.resH;
  if (!(W > 0 && H > 0)) return { error: T('Escribe la resolución de la pantalla.'), W: 0, H: 0, av };
  const px = W * H, hz = S.hz || 60, pxPuerto = Math.round(el.ELEC_PX_PUERTO * 60 / hz);
  const lines = S.cab ? Math.ceil((S.nW * S.nH) / Math.max(1, Math.floor(pxPuerto / (S.cabW * S.cabH)))) : Math.ceil(px / pxPuerto);
  const [mw, mh] = MAXS[S.maxSal] || MAXS['4K'];
  // trozos de la señal: el lienzo se reparte en salidas que no pasan del máximo de cada una; con cabinet, por columnas y filas enteras
  let cols = Math.ceil(W / mw), rows = Math.ceil(H / mh), anchos, altos;
  for (;;) { anchos = S.cab ? reparte(S.nW, cols).map(c => c * S.cabW) : reparte(W, cols); if (anchos.every(a => a <= mw) || cols > 64) break; cols++; }
  for (;;) { altos = S.cab ? reparte(S.nH, rows).map(c => c * S.cabH) : reparte(H, rows); if (altos.every(a => a <= mh) || rows > 64) break; rows++; }
  const n = cols * rows, eq = Math.ceil(W / cols) + ' × ' + Math.ceil(H / rows);
  const r = { W, H, px, hz, pxPuerto, lines, cols, rows, n, anchos, altos, av, eq };
  if (n > S.salidas) { r.faltan = true; r.error = T('Hacen falta {m} salidas (cada una llega como máximo a {r}) y la fuente tiene {n}.', { n: S.salidas, m: n, r: mw + ' × ' + mh }); }
  const st = { lines, totalPix: Math.round(px * hz / 60), resW: W, resH: H };
  const o = { escalador: n > 1 ? 'con' : 'indiferente', conexion: S.conexion, backup: S.backup, entradas: n, tipoEntrada: S.tipo, resEntrada: S.maxSal === '4K' && n > 1 ? '4K' : '' };
  let lista = el.calcularElectronicas(st, o, []).filter(x => !x.reproductor);
  if (S.marca !== 'todas') lista = lista.filter(x => x.marca === S.marca);
  // v1.0 · primero el que tiene de serie entradas del tipo de la fuente (los modulares las llevan en su despiece); si ninguno, el primero con aviso
  const menciona = x => x.modular || /^MX(2000|6000)/.test(x.key || '') || new RegExp(S.tipo === 'DP' ? '\\bDP\\b' : S.tipo).test(x.resumen || '');
  r.lista = lista; r.rec = lista.find(menciona) || lista[0] || null;
  if (r.rec) { r.lista = [r.rec].concat(lista.filter(x => x !== r.rec)); if (!menciona(r.rec)) av.push(['', T('La ficha de {m} no nombra entradas {t}: hará falta un adaptador activo o comprobarlo.', { m: r.rec.modelo, t: S.tipo })]); }
  if (!r.error && !r.rec) r.error = T('Ningún procesador de la lista llega a {px} Mpx y {w} px de ancho con {m} entradas {t}.', { px: N(px / 1e6, 1), w: N(W), m: n, t: S.tipo });
  if (!S.cab) av.push(['info', T('Líneas: mínimo teórico ({p} px por puerto a {hz} Hz). Con el cabinet salen las reales y el corte por columnas.', { p: N(pxPuerto), hz })]);
  if (n > 1) av.push(['', T('La fuente tiene que sacar las {n} salidas sincronizadas: NVIDIA Mosaic (gráficas profesionales), Surround en GeForce (salidas iguales: {n} × {e}) o un reproductor que pinte en varias salidas.', { n, e: eq })]);
  if (n > 1 && S.cab) av.push(['info', T('Corte por columnas de cabinet: {c}.', { c: anchos.join(' + ') + ' px' + (rows > 1 ? ' · ' + altos.join(' + ') + ' px' : '') })]);
  if (n > 1 || W > 3840) av.push(['info', T('Comprueba en la ficha que las entradas aceptan {r} a medida.', { r: anchos[0] + ' × ' + altos[0] })]);
  if (S.conexion === 'directo') av.push(['info', T('Cable de red Cat6 de hasta 100 m por línea; si el rack está más lejos, fibra.')]);
  if (S.backup) av.push(['info', T('Backup 1:1: cada línea lleva su retorno en bucle, así que se doblan los puertos.')]);
  if (hz > 60) av.push(['info', T('Con {hz} Hz cada puerto carga menos píxeles ({p} px).', { hz, p: N(pxPuerto) })]);
  return r;
}

/* ---------- piezas de la interfaz ---------- */
const ICO = {
  datos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/></svg>',
  esq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="8" width="5" height="8" rx="1"/><rect x="10" y="8" width="5" height="8" rx="1"/><rect x="18" y="5" width="4" height="14" rx="1"/><path d="M7 12h3M15 12h3"/></svg>',
  res: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>'
};
const campo = (k, etq, extra = '') => `<label class="campo"><span>${esc(T(etq))}</span><input type="number" inputmode="numeric" min="1" data-k="${k}" value="${esc(S[k])}" ${extra}></label>`;
const togs = (k, ops, cls = '') => `<div class="togs ${cls}">${ops.map(([v, t]) => `<button type="button" class="tog${S[k] === v ? ' on' : ''}" data-k="${k}" data-v="${esc(String(v))}">${esc(T(t))}</button>`).join('')}</div>`;
function pintaDatos() {
  return `<section class="blk datos"><div class="blk-cab">${ICO.datos}<h2>${T('Lo que tienes')}</h2></div><div class="blk-cuerpo">
    <div class="grupo"><h3>${T('Pantalla')}</h3>${togs('cab', [[false, 'Resolución'], [true, 'Cabinets']])}
      ${S.cab ? `<div class="fila">${campo('cabW', 'Cabinet ancho (px)')}${campo('cabH', 'Cabinet alto (px)')}</div><div class="fila">${campo('nW', 'Cabinets en ancho')}${campo('nH', 'Cabinets en alto')}</div>`
        : `<div class="fila">${campo('resW', 'Ancho (px)')}${campo('resH', 'Alto (px)')}</div>`}
      <div class="solo-pro"><div class="campo"><span>${T('Refresco')}</span></div>${togs('hz', [[50, '50 Hz'], [60, '60 Hz'], [120, '120 Hz']])}</div></div>
    <div class="grupo"><h3>${T('Fuentes')}</h3><div class="fila">${campo('salidas', 'Salidas de la fuente', 'max="16"')}<label class="campo"><span>${T('Tipo de salida')}</span><select data-k="tipo">${['DP', 'HDMI', 'SDI'].map(t => `<option value="${t}"${S.tipo === t ? ' selected' : ''}>${t === 'DP' ? 'DisplayPort' : t}</option>`).join('')}</select></label></div>
      <div class="solo-pro"><div class="campo"><span>${T('Máximo por salida')}</span></div>${togs('maxSal', [['4K', '4K · 3840 × 2160'], ['2K', 'Full HD · 1920 × 1080']])}</div></div>
    <div class="grupo"><h3>${T('Instalación')}</h3>${togs('conexion', [['directo', 'Cable de red (< 100 m)'], ['fibra', 'Fibra']])}${togs('backup', [[false, 'Sin backup'], [true, 'Backup 1:1']])}</div>
    <div class="grupo solo-pro"><h3>${T('Marca')}</h3>${togs('marca', [['todas', 'Todas'], ['NOVASTAR', 'NOVASTAR'], ['COEX', 'COEX']])}</div>
  </div><div class="blk-pie">${MODO === 'simple' ? `<button type="button" class="sec-btn" data-accion="asis">${T('PREGÚNTAME')}</button>` : `<span></span>`}<button type="button" class="sec-btn" data-accion="reset">${T('RESTABLECER')}</button></div></section>`;
}
function svgEsquema(r) {
  if (!r || !r.W) return '';
  if (innerWidth < 720) return svgVertical(r);   // v1.0 · en el móvil, el esquema de arriba abajo: así el dibujo y sus textos salen grandes
  const VW = 780, VH = 460, cy = VH / 2;   // v1.0 · proporción cercana a la del bloque, para que el dibujo y sus textos salgan grandes
  const fx = 8, fw = 160, fh = Math.min(400, 80 + r.n * 50), fy = cy - fh / 2;
  const px0 = 290, pw = 170, ph = Math.max(150, Math.min(400, 70 + r.n * 50)), py = cy - ph / 2;
  const sw = 190, shMax = 280, sh = Math.max(36, Math.min(shMax, sw * r.H / r.W)), sx = VW - sw - 8, sy = cy - sh / 2;
  const cols = ['#c6e04a', '#00b4ff', '#a033ff', '#ffb000', '#4fdc62', '#ff4d5e'];
  let s = `<svg class="sq" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(T('Esquema de la señal'))}" preserveAspectRatio="xMidYMid meet">`;
  s += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="10" fill="var(--blk2)" stroke="var(--linea)"/><text x="${fx + fw / 2}" y="${fy + 28}" text-anchor="middle" font-size="20" font-weight="800">${esc(T('Fuente'))}</text>`;
  const k = r.n, lab = r.rows > 1 ? (i) => r.anchos[i % r.cols] + '×' + r.altos[Math.floor(i / r.cols)] : (i) => r.anchos[i] + '×' + r.altos[0];
  for (let i = 0; i < k; i++) {
    const y = fy + 58 + i * ((fh - 70) / Math.max(1, k)) + ((fh - 70) / Math.max(1, k)) / 2, ty = py + 40 + i * ((ph - 50) / k) + ((ph - 50) / k) / 2, c = cols[i % cols.length];
    s += `<circle cx="${fx + fw - 14}" cy="${y}" r="6" fill="${c}"/><text x="${fx + 14}" y="${y + 6}" font-size="17" class="t-mono">${esc(S.tipo)} ${i + 1}</text>`;
    s += `<path d="M${fx + fw - 8} ${y} C ${fx + fw + 70} ${y}, ${px0 - 70} ${ty}, ${px0} ${ty}" fill="none" stroke="${c}" stroke-width="3"/>`;
    s += `<text x="${(fx + fw + px0) / 2}" y="${(y + ty) / 2 - 8}" text-anchor="middle" font-size="14" class="t-mono t-ten">${esc(lab(i))}</text>`;
  }
  const nombre = r.rec ? r.rec.modelo : '—';
  s += `<rect x="${px0}" y="${py}" width="${pw}" height="${ph}" rx="10" fill="var(--blk2)" stroke="${r.rec ? 'var(--marca)' : 'var(--rojo)'}" stroke-width="2"/>`;
  s += `<text x="${px0 + pw / 2}" y="${py + 28}" text-anchor="middle" font-size="13" font-weight="800" class="t-ten">${esc(T('Procesador').toUpperCase())}</text><text x="${px0 + pw / 2}" y="${cy + 8}" text-anchor="middle" font-size="${nombre.length > 13 ? 18 : 22}" font-weight="800" class="t-mar">${esc(nombre)}</text>`;
  const bk = S.backup ? 2 : 1, fib = S.conexion === 'fibra';
  const lin = fib ? (r.rec && /fibra/.test(r.rec.puertos || '') ? TM(r.rec.puertos.split(' (')[0]) : '') : r.lines * bk + ' ' + T('líneas') + ' RJ45';
  s += `<path d="M${px0 + pw} ${cy} L ${sx} ${cy}" stroke="var(--azul)" stroke-width="${fib ? 3 : 8}" ${fib ? 'stroke-dasharray="10 6"' : ''}/>`;
  s += `<text x="${(px0 + pw + sx) / 2}" y="${cy - 16}" text-anchor="middle" font-size="15" class="t-mono">${esc(lin)}</text>`;
  if (S.backup) s += `<text x="${(px0 + pw + sx) / 2}" y="${cy + 26}" text-anchor="middle" font-size="12" class="t-mono t-ten">${esc(T('con backup'))}</text>`;
  // la pantalla, partida en las zonas de cada salida
  let ax = sx;
  for (let c = 0; c < r.cols; c++) {
    const w = sw * r.anchos[c] / r.W; let ay = sy;
    for (let f = 0; f < r.rows; f++) { const h = sh * r.altos[f] / r.H, i = f * r.cols + c, col = cols[i % cols.length];
      s += `<rect x="${ax}" y="${ay}" width="${w}" height="${h}" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="2"/>`;
      if (w > 34 && h > 18) s += `<text x="${ax + w / 2}" y="${ay + h / 2 + 5}" text-anchor="middle" font-size="${Math.min(16, Math.max(10, w / 6))}" class="t-mono">${i + 1}</text>`;
      ay += h; }
    ax += w;
  }
  s += `<text x="${sx + sw / 2}" y="${sy - 12}" text-anchor="middle" font-size="17" font-weight="800">${esc(T('Pantalla LED'))}</text><text x="${sx + sw / 2}" y="${sy + sh + 26}" text-anchor="middle" font-size="15" class="t-mono t-ten">${N(r.W)} × ${N(r.H)} px</text>`;
  return s + '</svg>';
}
function svgVertical(r) {
  const VW = 400, k = r.n, cols = ['#c6e04a', '#00b4ff', '#a033ff', '#ffb000', '#4fdc62', '#ff4d5e'];
  const fy = 10, fh = 96, py = 200, ph = 92, sw = 330, sh = Math.max(34, Math.min(170, sw * r.H / r.W)), sx = (VW - sw) / 2, sy = py + ph + 76, VH = sy + sh + 34;
  let s = `<svg class="sq" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(T('Esquema de la señal'))}" preserveAspectRatio="xMidYMid meet">`;
  s += `<rect x="10" y="${fy}" width="${VW - 20}" height="${fh}" rx="10" fill="var(--blk2)" stroke="var(--linea)"/><text x="${VW / 2}" y="${fy + 26}" text-anchor="middle" font-size="18" font-weight="800">${esc(T('Fuente'))}</text>`;
  const lab = i => r.rows > 1 ? r.anchos[i % r.cols] + '×' + r.altos[Math.floor(i / r.cols)] : r.anchos[i] + '×' + r.altos[0];
  for (let i = 0; i < k; i++) {
    const x = 10 + (VW - 20) * (i + .5) / k, c = cols[i % cols.length], tx = 40 + (VW - 80) * (i + .5) / k;
    s += `<text x="${x}" y="${fy + 56}" text-anchor="middle" font-size="${k > 4 ? 12 : 15}" class="t-mono">${esc(S.tipo)} ${i + 1}</text><circle cx="${x}" cy="${fy + fh - 12}" r="6" fill="${c}"/>`;
    s += `<path d="M${x} ${fy + fh - 6} C ${x} ${fy + fh + 40}, ${tx} ${py - 40}, ${tx} ${py}" fill="none" stroke="${c}" stroke-width="3"/>`;
    if (k <= 4) s += `<text x="${(x + tx) / 2 + 6}" y="${(fy + fh + py) / 2 + 4}" font-size="12" class="t-mono t-ten">${esc(lab(i))}</text>`;
  }
  const nombre = r.rec ? r.rec.modelo : '—';
  s += `<rect x="40" y="${py}" width="${VW - 80}" height="${ph}" rx="10" fill="var(--blk2)" stroke="${r.rec ? 'var(--marca)' : 'var(--rojo)'}" stroke-width="2"/><text x="${VW / 2}" y="${py + 26}" text-anchor="middle" font-size="13" font-weight="800" class="t-ten">${esc(T('Procesador').toUpperCase())}</text><text x="${VW / 2}" y="${py + 62}" text-anchor="middle" font-size="24" font-weight="800" class="t-mar">${esc(nombre)}</text>`;
  const fib = S.conexion === 'fibra', lin = fib ? (r.rec && /fibra/.test(r.rec.puertos || '') ? TM(r.rec.puertos.split(' (')[0]) : '') : r.lines * (S.backup ? 2 : 1) + ' ' + T('líneas') + ' RJ45';
  s += `<path d="M${VW / 2} ${py + ph} L ${VW / 2} ${sy - 4}" stroke="var(--azul)" stroke-width="${fib ? 3 : 8}" ${fib ? 'stroke-dasharray="10 6"' : ''}/><text x="${VW / 2 + 14}" y="${py + ph + 34}" font-size="15" class="t-mono">${esc(lin)}</text>`;
  let ax = sx;
  for (let c = 0; c < r.cols; c++) { const w = sw * r.anchos[c] / r.W; let ay = sy;
    for (let f = 0; f < r.rows; f++) { const h = sh * r.altos[f] / r.H, i = f * r.cols + c, col = cols[i % cols.length];
      s += `<rect x="${ax}" y="${ay}" width="${w}" height="${h}" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="2"/>`;
      if (w > 26 && h > 18) s += `<text x="${ax + w / 2}" y="${ay + h / 2 + 5}" text-anchor="middle" font-size="15" class="t-mono">${i + 1}</text>`; ay += h; }
    ax += w; }
  return s + `<text x="${VW / 2}" y="${sy + sh + 24}" text-anchor="middle" font-size="15" class="t-mono t-ten">${esc(T('Pantalla LED'))} · ${N(r.W)} × ${N(r.H)} px</text></svg>`;
}
function equipoHTML(x, rec) {
  const filas = [[1, x.modular ? '' : x.modelo, x.resumen || '']].concat((x.equipos || []).filter(e => e.cant > 0).map(e => [e.cant, e.ref, e.desc]));
  return `<div class="equipo${rec ? ' rec' : ''}"><div class="eq-cab"><b>${esc(x.modelo)}</b><span class="serie">${esc(x.marca)} · ${esc(x.serie)}</span>${rec ? `<span class="etq">${T('Recomendado').toUpperCase()}</span>` : ''}</div>
    <div class="eq-sub">${esc(TM(x.puertos))} · ${T('Capacidad')} ${esc(TM(x.capacidad))}</div>
    <table class="despiece">${filas.filter(f => f[1]).map(f => `<tr><td>${f[0]}×</td><td class="ref">${esc(f[1])}</td><td class="des">${esc(TM(f[2]))}</td></tr>`).join('')}</table>
    ${(x.urlFab || x.pdf) ? `<div class="eq-links">${x.urlFab ? `<a href="${esc(x.urlFab)}" target="_blank" rel="noopener">${T('Página del producto')} ↗</a>` : ''}${x.pdf ? `<a href="${esc(x.pdf)}" target="_blank" rel="noopener">${T('Ficha técnica')} ↗</a>` : ''}</div>` : ''}</div>`;
}
function pintaResultado(r) {
  const tipo = r.error ? 'mal' : r.av.some(a => !a[0]) ? 'aviso' : '';
  const tit = r.faltan ? T('Faltan salidas en la fuente') : r.error ? T('No hay solución con estos datos') : tipo ? T('Hay solución, con avisos') : T('Hay solución');
  const linea = r.error || (r.rec ? r.rec.modelo + ' · ' + r.n + ' ' + T(r.n === 1 ? 'salida' : 'salidas') + ' ' + S.tipo + ' · ' + (S.conexion === 'fibra' ? TM(r.rec.puertos.split(' (')[0]) : r.lines * (S.backup ? 2 : 1) + ' ' + T('líneas')) : '');
  return `<section class="blk result"><div class="blk-cab">${ICO.res}<h2>${T('Resultado')}</h2></div><div class="blk-cuerpo">
    <div class="veredicto ${tipo}"><div><b>${esc(tit)}</b><p>${esc(linea)}</p></div></div>
    ${r.rec ? equipoHTML(r.rec, true) : ''}
    ${r.av.length ? `<ul class="avisos">${r.av.map(a => `<li class="${a[0]}">${esc(a[1])}</li>`).join('')}</ul>` : ''}
    ${r.lista && r.lista.length > 1 ? `<div class="solo-pro"><div class="alt-tit">${T('Alternativas')}</div>${r.lista.slice(1).map(x => equipoHTML(x, false)).join('')}</div>` : ''}
  </div></section>`;
}
function pintaCifras(r) {
  const c = (col, tit, num, uni, sub) => `<div class="blk cifra" style="--c:${col}"><h4><i></i>${esc(T(tit))}</h4><div class="num">${num}${uni ? `<small>${esc(uni)}</small>` : ''}</div><div class="sub">${esc(sub)}</div></div>`;
  if (!r || !r.W) return '<div class="cifras"></div>';
  return `<div class="cifras">${c('var(--marca)', 'Resolución total', N(r.px / 1e6, 2), 'Mpx', N(r.W) + ' × ' + N(r.H) + ' px · ' + r.hz + ' Hz')}
    ${c('var(--azul)', 'Líneas de datos', String(r.lines * (S.backup ? 2 : 1)), '', S.backup ? r.lines + ' + ' + r.lines + ' backup' : S.cab ? '' : T('mínimo teórico'))}
    ${c('var(--violeta)', 'Señal de entrada', String(r.n), '× ' + S.tipo, r.eq + ' px')}
    ${c('var(--ambar)', 'Procesador', esc(r.rec ? r.rec.modelo : '—'), '', r.rec ? TM(r.rec.capacidad) : '')}</div>`;
}
function pintaTodo() {
  R = calcula();
  document.documentElement.classList.toggle('pro', MODO === 'pro');
  document.documentElement.lang = LANG;
  $('#consola').innerHTML = pintaDatos() + `<section class="blk esquema"><div class="blk-cab">${ICO.esq}<h2>${T('Esquema de la señal')}</h2></div><div class="blk-cuerpo">${svgEsquema(R)}</div></section>` + pintaResultado(R) + pintaCifras(R);
  $('#t-mod-elec').textContent = T('ELECTRÓNICA LED'); $('#t-mod-audio').textContent = T('AUDIO'); $('#btn-calc').textContent = T('CALCULAR');
  $('#btn-idioma').textContent = LANG.toUpperCase(); $('#btn-idioma').setAttribute('aria-label', T('Idioma')); $('#btn-tema').setAttribute('aria-label', T('Claro / oscuro')); $('#btn-inicio').setAttribute('aria-label', T('RESTABLECER'));
  document.querySelectorAll('.modo [data-accion="modo"]').forEach(b => b.classList.toggle('on', b.dataset.v === MODO));
  $('#pie-aviso').textContent = '⚠ ' + T('Cálculo automático que puede contener errores: compruébalo antes de presupuestar o instalar.');
  pintaPie(); guardar();
}
const pintaPie = () => { const p = $('#pie'); if (p) p.innerHTML = window.AVCREDITO ? window.AVCREDITO.html('SYSTEMS', VERSION, LANG) : `SYSTEMS ${VERSION} ${new Date().getFullYear()} · <a href="https://mediaservi.com" target="_blank" rel="noopener">mediaservi.com</a>`; };
if (window.AVCREDITO) window.AVCREDITO.alCambiar(pintaPie);

/* ---------- asistente (SIMPLE) ---------- */
let PASO = 0;
const PASOS = () => [
  { q: '¿Qué sabes de tu pantalla?', ops: [['cab', false, 'Su resolución total', 'Ancho × alto en píxeles'], ['cab', true, 'El cabinet y cuántos hay', 'Así salen las líneas reales']] },
  { q: S.cab ? 'Cabinets' : 'Resolución', num: S.cab ? [['cabW', 'Cabinet ancho (px)'], ['cabH', 'Cabinet alto (px)'], ['nW', 'Cabinets en ancho'], ['nH', 'Cabinets en alto']] : [['resW', 'Ancho (px)'], ['resH', 'Alto (px)']] },
  { q: '¿Qué la alimenta?', ops: [['tipo', 'DP', 'Un PC con DisplayPort', 'La mayoría de PC y gráficas'], ['tipo', 'HDMI', 'HDMI', 'Reproductor, PC o mediaserver'], ['tipo', 'SDI', 'SDI', 'Cámaras y realización']] },
  { q: '¿Cuántas salidas tiene la fuente?', ops: [1, 2, 3, 4].map(v => ['salidas', v, String(v), T(v === 1 ? 'salida' : 'salidas')]) },
  { q: '¿A qué distancia está el rack de la pantalla?', ops: [['conexion', 'directo', 'Menos de 100 m', 'Cable de red directo'], ['conexion', 'fibra', 'Más de 100 m', 'Por fibra']] },
  { q: '¿Quieres backup de líneas?', ops: [['backup', false, 'No', 'Solo las líneas necesarias'], ['backup', true, 'Sí, 1:1', 'Cada línea con su retorno']] }
];
function asistente() {
  const P = PASOS(), p = P[PASO]; let d = $('.asis-fondo');
  if (!d) { d = document.createElement('div'); d.className = 'asis-fondo'; document.body.appendChild(d); }
  d.innerHTML = `<div class="asis" role="dialog" aria-modal="true"><div class="asis-cab"><p>${PASO === 0 ? esc(T('Hola. Te haré unas preguntas muy sencillas y te diré qué electrónica necesitas.')) : ''}</p><button type="button" class="sec-btn" data-accion="asis-fin">${T('SALTAR')}</button></div>
    <h3>${esc(T(p.q))}</h3>
    ${p.ops ? `<div class="asis-ops">${p.ops.map(o => `<button type="button" class="asis-op" data-k="${o[0]}" data-v="${esc(String(o[1]))}"><b>${esc(T(o[2]))}</b><small>${esc(T(o[3]))}</small></button>`).join('')}</div>`
      : `<div class="asis-num">${p.num.map(([k, e]) => campo(k, e)).join('')}</div><div class="asis-pie"><span></span><button type="button" class="pri" data-accion="asis-sig">${T('SIGUIENTE')}</button></div>`}
    <div class="asis-pie"><div class="asis-puntos">${P.map((_, i) => `<i class="${i === PASO ? 'on' : ''}"></i>`).join('')}</div></div></div>`;
  const f = d.querySelector('.asis-op, input'); if (f) f.focus();
}
function cierraAsis() { const d = $('.asis-fondo'); if (d) d.remove(); try { localStorage.setItem('systems_asis', '1'); } catch (e) {} pintaTodo(); }
function valor(k, v) { const d = DEF[k]; return typeof d === 'boolean' ? v === 'true' || v === true : typeof d === 'number' ? Math.max(1, Math.round(+v || d)) : v; }

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('button, a'); if (!b) return;
  const a = b.dataset.accion;
  if (b.classList.contains('asis-op')) { S[b.dataset.k] = valor(b.dataset.k, b.dataset.v); PASO++; if (PASO >= PASOS().length) cierraAsis(); else asistente(); return; }
  if (a === 'asis-sig') { document.querySelectorAll('.asis input[data-k]').forEach(i => { S[i.dataset.k] = valor(i.dataset.k, i.value); }); PASO++; if (PASO >= PASOS().length) cierraAsis(); else asistente(); return; }
  if (a === 'asis-fin') { cierraAsis(); return; }
  if (a === 'asis') { PASO = 0; asistente(); return; }
  if (b.classList.contains('tog') && b.dataset.k) { S[b.dataset.k] = valor(b.dataset.k, b.dataset.v); pintaTodo(); return; }
  if (a === 'modo') { MODO = b.dataset.v; pintaTodo(); return; }
  if (a === 'modo-sw') { MODO = MODO === 'pro' ? 'simple' : 'pro'; pintaTodo(); return; }
  if (a === 'calc') { document.querySelectorAll('.datos input[data-k]').forEach(i => { S[i.dataset.k] = valor(i.dataset.k, i.value); }); pintaTodo(); return; }
  if (a === 'reset') { S = Object.assign({}, DEF); pintaTodo(); return; }
  if (a === 'idioma') { LANG = IDIOMAS[(IDIOMAS.indexOf(LANG) + 1) % IDIOMAS.length]; try { localStorage.setItem('screens_idioma', LANG); } catch (x) {} pintaTodo(); return; }
  if (a === 'tema') { const c = document.documentElement.classList.toggle('claro'); try { localStorage.setItem('systems_tema', c ? 'claro' : 'oscuro'); } catch (x) {} return; }
  if (a === 'pdf') { window.print(); return; }
});
let anchoPrev = innerWidth < 720; addEventListener('resize', () => { const v = innerWidth < 720; if (v !== anchoPrev) { anchoPrev = v; pintaTodo(); } });
document.addEventListener('change', e => { const i = e.target; if (!i.dataset || !i.dataset.k || i.closest('.asis')) return; S[i.dataset.k] = valor(i.dataset.k, i.value); pintaTodo(); });
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('.datos input')) { e.target.blur(); } if (e.key === 'Enter' && e.target.matches('.asis input')) $('[data-accion="asis-sig"]').click(); if (e.key === 'Escape' && $('.asis-fondo')) cierraAsis(); });

/* ---------- botones comunes de AVHUB y listas en vivo ---------- */
const bi = $('#btn-inicio');
if (window.AVFALLO && bi) { const bf = window.AVFALLO.boton({ app: 'SYSTEMS', version: VERSION, idioma: () => LANG }); bf.id = 'btn-fallo'; bi.before(bf); }
if (window.AVINSTALA && bi) { const bn = window.AVINSTALA.boton({ app: 'SYSTEMS', idioma: () => LANG, sw: 'sw.js' }); bn.id = 'btn-instala'; ($('#btn-fallo') || bi).before(bn); }
pintaTodo();
if (MODO === 'simple') { let visto = false; try { visto = localStorage.getItem('systems_asis') === '1'; } catch (e) {} if (!visto) { PASO = 0; asistente(); } }
(async () => {
  const el = E(); if (!el || !el.aplicaListas) return;
  try { const c = JSON.parse(localStorage.getItem('sc_eq1') || 'null'); if (c && c.marcas && el.aplicaListas(c)) pintaTodo(); } catch (e) {}
  try { const r = await fetch(ADMIN_URL + '?accion=equipos', { cache: 'no-store' }); if (!r.ok) return; const j = await r.json(); if (j && j.marcas && el.aplicaListas(j)) { try { localStorage.setItem('sc_eq1', JSON.stringify(j)); } catch (e) {} if (!$('.asis-fondo')) pintaTodo(); } } catch (e) {}
})();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
export { calcula };
