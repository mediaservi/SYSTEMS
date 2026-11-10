// SYSTEMS · AUDIO Y ESCENARIO — cálculos de refuerzo sonoro, electrónica, cableado, iluminación, electricidad y música.
// Fórmulas de física e ingeniería de uso común (ley inversa del cuadrado, ISO 9613-1, ley de Ohm…), escritas para esta app.
// Cada calculador declara sus campos y una función calc(v) que devuelve cifras, tablas, gráficas y notas; la interfaz es común (app.js).
// Los textos van en español y se traducen al pintar (textos.js). Licencia GPL-3.0 · mediaservi.com

export const GRUPOS = [['acustica', 'Acústica'], ['arrays', 'Arrays'], ['electronica', 'Electrónica de audio'], ['cableado', 'Cableado'],
  ['luz', 'Iluminación y vídeo'], ['electricidad', 'Electricidad'], ['musica', 'Música y grabación'], ['medidas', 'Pesos y medidas'], ['referencia', 'Referencia']];

const log10 = Math.log10, PI = Math.PI, RAD = PI / 180;
export const cSonido = (t) => 331.3 * Math.sqrt(1 + t / 273.15);          // m/s en aire seco a t °C
const db = (x) => 20 * log10(Math.max(x, 1e-12));
const OCT = [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const hz = (f) => f >= 1000 ? (f / 1000) + ' kHz' : f + ' Hz';
const logs = (a, b, n) => Array.from({ length: n }, (_, i) => a * Math.pow(b / a, i / (n - 1)));
const TEMP = { k: 't', lab: 'Temperatura', uni: '°C', def: 20, min: -20, max: 50, paso: 1 };
const COBRE = 0.0175;   // Ω·mm²/m a 20 °C
const SECC = [[0.75, '0,75 mm² · AWG 18'], [1.5, '1,5 mm² · AWG 16'], [2.5, '2,5 mm² · AWG 13'], [4, '4 mm² · AWG 11'], [6, '6 mm² · AWG 9'], [10, '10 mm² · AWG 7']];

// Atenuación del aire, ISO 9613-1: dB/m para f (Hz), t (°C), humedad relativa (%) y presión (kPa)
export function absorcionAire(f, t, hr, pa = 101.325) {
  const T = t + 273.15, T0 = 293.15, T01 = 273.16, ps = pa / 101.325;
  const h = hr * Math.pow(10, -6.8346 * Math.pow(T01 / T, 1.261) + 4.6151) / ps;
  const frO = ps * (24 + 4.04e4 * h * (0.02 + h) / (0.391 + h));
  const frN = ps * Math.pow(T / T0, -0.5) * (9 + 280 * h * Math.exp(-4.170 * (Math.pow(T / T0, -1 / 3) - 1)));
  return 8.686 * f * f * (1.84e-11 / ps * Math.sqrt(T / T0) + Math.pow(T / T0, -2.5) * (0.01275 * Math.exp(-2239.1 / T) / (frO + f * f / frO) + 0.1068 * Math.exp(-3352 / T) / (frN + f * f / frN)));
}

// Suma de fuentes puntuales en campo lejano: nivel (dB respecto a todas en fase) hacia el ángulo a (0° = delante, +y)
export function nivelArray(fu, f, c, a) {
  const k = 2 * PI * f / c, w = 2 * PI * f, s = Math.sin(a * RAD), co = Math.cos(a * RAD); let re = 0, im = 0;
  fu.forEach(q => { const ph = k * (q.x * s + q.y * co) - w * q.tau; re += q.pol * Math.cos(ph); im += q.pol * Math.sin(ph); });
  return db(Math.hypot(re, im) / fu.length);
}
export function fuentesEndfire(n, d, c) { return Array.from({ length: n }, (_, i) => ({ x: 0, y: -i * d, tau: (n - 1 - i) * d / c, pol: 1 })); }
export function fuentesBroadside(n, d, c, giro, arco) {
  const L = (n - 1) * d, R = arco > 0.5 && L > 0 ? L / (2 * Math.sin(Math.min(179, arco) / 2 * RAD)) : 0;
  const fu = Array.from({ length: n }, (_, i) => { const x = (i - (n - 1) / 2) * d; return { x, y: 0, tau: x * Math.sin(giro * RAD) / c + (R ? (R - Math.sqrt(Math.max(0, R * R - x * x))) / c : 0), pol: 1 }; });
  const m = Math.min(...fu.map(q => q.tau)); fu.forEach(q => { q.tau -= m; }); return fu;
}
function grafArray(fu, f, c, F) {
  const polar = Array.from({ length: 360 }, (_, a) => nivelArray(fu, f, c, a)), xs = logs(20, 250, 90);
  const lobulo = (() => { let a = 0; const eje = polar.indexOf(Math.max(...polar)); while (a < 180 && polar[(eje + a) % 360] > polar[eje] - 6) a++; let b = 0; while (b < 180 && polar[(eje - b + 360) % 360] > polar[eje] - 6) b++; return [eje > 180 ? eje - 360 : eje, a + b]; })();
  return { polar, lobulo, grafs: [
    { tipo: 'polar', tit: 'Diagrama polar', sub: F(f, 0) + ' Hz', min: -30, series: [{ nom: F(f, 0) + ' Hz', pts: polar, color: '#00ff04' }] },
    { tipo: 'mapa', tit: 'Mapa de cobertura', sub: '50 × 50 m', fuentes: fu, f, c, lado: 50 },
    { tipo: 'linea', tit: 'Respuesta en frecuencia', log: true, xs, xlab: 'Hz', ylab: 'dB', ymin: -36, ymax: 3, marca: f,
      series: [[0, 'Delante · 0°', '#00ff04'], [90, 'Lateral · 90°', '#ffb000'], [180, 'Detrás · 180°', '#ff4d5e']].map(([a, nom, color]) => ({ nom, color, ys: xs.map(x => nivelArray(fu, x, c, a)) })) }] };
}

const NOTAS = ['Do', 'Do♯', 'Re', 'Re♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'];
const UNIDADES = {
  peso: [['kg', 1], ['g', 0.001], ['lb', 0.45359237], ['oz', 0.028349523], ['t', 1000]],
  longitud: [['m', 1], ['cm', 0.01], ['mm', 0.001], ['km', 1000], ['in', 0.0254], ['ft', 0.3048], ['yd', 0.9144], ['mi', 1609.344]],
  area: [['m²', 1], ['cm²', 1e-4], ['ft²', 0.09290304], ['in²', 0.00064516], ['ha', 1e4]],
  volumen: [['l', 1], ['ml', 0.001], ['m³', 1000], ['ft³', 28.316847], ['gal (US)', 3.785411784], ['gal (UK)', 4.54609]]
};
const MICROS = [['omni', 'Omnidireccional', 1, 0], ['subcardioide', 'Subcardioide', 0.7, 0.3], ['cardioide', 'Cardioide', 0.5, 0.5], ['supercardioide', 'Supercardioide', 0.37, 0.63], ['hipercardioide', 'Hipercardioide', 0.25, 0.75], ['bidireccional', 'Bidireccional (8)', 0, 1]];
const PINES = {
  xlr3: ['XLR 3 · audio balanceado', [['1', 'Masa / malla'], ['2', 'Vivo (+)'], ['3', 'Retorno (−)']]],
  trs: ['Jack 6,3 mm TRS · balanceado', [['Punta', 'Vivo (+)'], ['Anillo', 'Retorno (−)'], ['Cuerpo', 'Masa / malla']]],
  ts: ['Jack 6,3 mm TS · no balanceado', [['Punta', 'Señal'], ['Cuerpo', 'Masa / malla']]],
  mini: ['Minijack 3,5 mm · estéreo', [['Punta', 'Canal izquierdo'], ['Anillo', 'Canal derecho'], ['Cuerpo', 'Masa / malla']]],
  nl2: ['speakON NL2', [['1+', 'Altavoz +'], ['1−', 'Altavoz −']]],
  nl4: ['speakON NL4', [['1+', 'Vía 1 + (graves o gama completa)'], ['1−', 'Vía 1 −'], ['2+', 'Vía 2 + (agudos, en biamplificación)'], ['2−', 'Vía 2 −']]],
  nl8: ['speakON NL8', [['1+ / 1−', 'Vía 1'], ['2+ / 2−', 'Vía 2'], ['3+ / 3−', 'Vía 3'], ['4+ / 4−', 'Vía 4']]],
  db25: ['DB25 · 8 canales analógicos (norma Tascam)', [['Canal 1', '24 (+) · 12 (−) · 25 (masa)'], ['Canal 2', '10 (+) · 23 (−) · 11 (masa)'], ['Canal 3', '21 (+) · 9 (−) · 22 (masa)'], ['Canal 4', '7 (+) · 20 (−) · 8 (masa)'],
    ['Canal 5', '18 (+) · 6 (−) · 19 (masa)'], ['Canal 6', '4 (+) · 17 (−) · 5 (masa)'], ['Canal 7', '15 (+) · 3 (−) · 16 (masa)'], ['Canal 8', '1 (+) · 14 (−) · 2 (masa)'], ['13', 'Sin conectar']]],
  dmx5: ['XLR 5 · DMX512', [['1', 'Masa / malla'], ['2', 'Datos 1 −'], ['3', 'Datos 1 +'], ['4', 'Datos 2 − (opcional)'], ['5', 'Datos 2 + (opcional)']]],
  dmx3: ['XLR 3 · DMX (no normalizado)', [['1', 'Masa / malla'], ['2', 'Datos −'], ['3', 'Datos +']]],
  rj45: ['RJ45 / etherCON · T568B', [['1', 'Blanco-naranja'], ['2', 'Naranja'], ['3', 'Blanco-verde'], ['4', 'Azul'], ['5', 'Blanco-azul'], ['6', 'Verde'], ['7', 'Blanco-marrón'], ['8', 'Marrón']]]
};
// tiempos de limitador orientativos según la frecuencia de corte inferior de la vía (release = 16 × ataque)
const ATAQUES = [[31, 45], [63, 16], [125, 8], [250, 4], [500, 2], [1000, 1], [2000, 0.5], [Infinity, 0.3]];

export const CALC = [
  // ---------- ACÚSTICA ----------
  { id: 'spl', g: 'acustica', nom: 'Nivel SPL a distancia',
    campos: [{ k: 'sens', lab: 'Sensibilidad (1 W / 1 m)', uni: 'dB', def: 98, min: 70, max: 120, paso: 1 }, { k: 'pot', lab: 'Potencia', uni: 'W', def: 500, min: 1, max: 20000, paso: 50 },
      { k: 'dist', lab: 'Distancia del oyente', uni: 'm', def: 10, min: 0.5, max: 500, paso: 1 }, { k: 'n', lab: 'Número de cajas', uni: 'u', def: 1, min: 1, max: 64, paso: 1 },
      { k: 'suma', lab: 'Suma entre cajas', ops: [['coh', 'En fase'], ['inc', 'Sin correlación']], def: 'coh' }],
    calc(v, F) { const s1 = v.sens + 10 * log10(v.pot), at = 20 * log10(v.dist), sn = (v.suma === 'coh' ? 20 : 10) * log10(v.n), tot = s1 - at + sn;
      return { res: [['SPL en el oyente', F(tot, 1), 'dB SPL', F(v.dist, 1) + ' m'], ['SPL a 1 m', F(s1 + sn, 1), 'dB SPL', v.n > 1 ? v.n + ' cajas' : '1 caja'], ['Pérdida por distancia', '−' + F(at, 1), 'dB', '−6 dB cada vez que se dobla'], ['Suma de cajas', '+' + F(sn, 1), 'dB', ''],
        ['Distancia para 100 dB', F(Math.pow(10, (s1 + sn - 100) / 20), 1), 'm', ''], ['Distancia para 85 dB', F(Math.pow(10, (s1 + sn - 85) / 20), 1), 'm', '']],
        grafs: [{ tipo: 'linea', tit: 'Nivel según la distancia', log: true, xs: logs(1, 200, 60), xlab: 'm', ylab: 'dB SPL', marca: v.dist, series: [{ nom: 'SPL', color: '#00ff04', ys: logs(1, 200, 60).map(d => s1 + sn - 20 * log10(d)) }] }],
        notas: ['Campo libre y fuente puntual: sin sala, sin absorción del aire y sin compresión de potencia.'] }; } },
  { id: 'suma', g: 'acustica', nom: 'Suma de dos niveles',
    campos: [{ k: 'l1', lab: 'Nivel 1', uni: 'dB', def: 100, min: 0, max: 150, paso: 1 }, { k: 'l2', lab: 'Nivel 2', uni: 'dB', def: 100, min: 0, max: 150, paso: 1 },
      { k: 'modo', lab: 'Diferencia entre las dos', ops: [['fase', 'Fase'], ['tiempo', 'Tiempo'], ['dist', 'Distancia']], def: 'fase' },
      { k: 'fase', lab: 'Diferencia de fase', uni: '°', def: 0, min: 0, max: 360, paso: 15, si: v => v.modo === 'fase' }, { k: 'ms', lab: 'Diferencia de tiempo', uni: 'ms', def: 1, min: 0, max: 500, paso: 0.1, si: v => v.modo === 'tiempo' },
      { k: 'dd', lab: 'Diferencia de distancia', uni: 'm', def: 0.5, min: 0, max: 200, paso: 0.05, si: v => v.modo === 'dist' }, { k: 'f', lab: 'Frecuencia', uni: 'Hz', def: 100, min: 10, max: 20000, paso: 10, si: v => v.modo !== 'fase' }, { ...TEMP, si: v => v.modo === 'dist' }],
    calc(v, F) { const c = cSonido(v.t), dt = v.modo === 'tiempo' ? v.ms / 1000 : v.modo === 'dist' ? v.dd / c : 0, fase = v.modo === 'fase' ? v.fase : (360 * v.f * dt) % 360;
      const p1 = Math.pow(10, v.l1 / 20), p2 = Math.pow(10, v.l2 / 20), suma = (ph) => db(Math.sqrt(Math.max(0, p1 * p1 + p2 * p2 + 2 * p1 * p2 * Math.cos(ph * RAD)))), coh = suma(fase), inc = 10 * log10(p1 * p1 + p2 * p2);
      const r = { res: [['Suma con esa fase', F(coh, 1), 'dB', (coh - Math.max(v.l1, v.l2) >= 0 ? '+' : '') + F(coh - Math.max(v.l1, v.l2), 1) + ' dB sobre la mayor'], ['Diferencia de fase', F(fase, 0), '°', ''], ['Suma sin correlación', F(inc, 1), 'dB', 'fuentes distintas'], ['Suma en fase', F(suma(0), 1), 'dB', 'máximo posible']], notas: [] };
      if (dt > 0) { const xs = logs(20, 20000, 240); r.res.push(['Primera cancelación', F(1 / (2 * dt), 0), 'Hz', 'y cada ' + F(1 / dt, 0) + ' Hz'], ['Retardo', F(dt * 1000, 2), 'ms', F(dt * c, 2) + ' m']);
        r.grafs = [{ tipo: 'linea', tit: 'Filtro de peine', log: true, xs, xlab: 'Hz', ylab: 'dB', ymin: Math.max(v.l1, v.l2) - 30, ymax: suma(0) + 2, marca: v.f, series: [{ nom: 'Suma', color: '#00ff04', ys: xs.map(x => Math.max(Math.max(v.l1, v.l2) - 30, db(Math.sqrt(Math.max(1e-9, p1 * p1 + p2 * p2 + 2 * p1 * p2 * Math.cos(2 * PI * x * dt)))))) }] }]; }
      return r; } },
  { id: 'techo', g: 'acustica', nom: 'Cobertura de altavoces de techo',
    campos: [{ k: 'h', lab: 'Altura del techo', uni: 'm', def: 3, min: 2, max: 20, paso: 0.1 }, { k: 'o', lab: 'Altura del oído', uni: 'm', def: 1.2, min: 0.5, max: 2, paso: 0.1 }, { k: 'ang', lab: 'Ángulo de cobertura (−6 dB)', uni: '°', def: 90, min: 30, max: 170, paso: 5 },
      { k: 'L', lab: 'Largo de la sala', uni: 'm', def: 12, min: 1, max: 200, paso: 0.5 }, { k: 'W', lab: 'Ancho de la sala', uni: 'm', def: 8, min: 1, max: 200, paso: 0.5 },
      { k: 'pat', lab: 'Solape entre coberturas', ops: [['borde', 'Borde con borde'], ['min', 'Solape mínimo'], ['centro', 'Centro a centro']], def: 'min' }],
    calc(v, F) { const D = 2 * Math.max(0.1, v.h - v.o) * Math.tan(v.ang / 2 * RAD), s = v.pat === 'borde' ? D : v.pat === 'min' ? D / Math.SQRT2 : D / 2, nx = Math.max(1, Math.ceil(v.L / s)), ny = Math.max(1, Math.ceil(v.W / s));
      return { res: [['Altavoces', F(nx * ny, 0), 'u', nx + ' × ' + ny], ['Separación entre altavoces', F(s, 2), 'm', ''], ['Diámetro de cobertura', F(D, 2), 'm', 'a la altura del oído'], ['Superficie por altavoz', F(v.L * v.W / (nx * ny), 1), 'm²', ''], ['Primer altavoz a la pared', F(v.L / nx / 2, 2), 'm', 'a lo largo'], ['Primer altavoz a la pared', F(v.W / ny / 2, 2), 'm', 'a lo ancho']],
        grafs: [{ tipo: 'planta', tit: 'Distribución en planta', L: v.L, W: v.W, nx, ny, r: D / 2 }],
        notas: ['Borde con borde: menos altavoces y más diferencia de nivel entre zonas. Solape mínimo: cobertura sin huecos (malla cuadrada). Centro a centro: nivel muy uniforme, para megafonía de palabra exigente.'] }; } },
  { id: 'aire', g: 'acustica', nom: 'Absorción del aire',
    campos: [TEMP, { k: 'hr', lab: 'Humedad relativa', uni: '%', def: 50, min: 5, max: 100, paso: 5 }, { k: 'f', lab: 'Frecuencia', uni: 'Hz', def: 4000, min: 20, max: 20000, paso: 100 }, { k: 'dist', lab: 'Distancia', uni: 'm', def: 50, min: 1, max: 1000, paso: 5 }],
    calc(v, F) { const a = absorcionAire(v.f, v.t, v.hr), xs = logs(100, 20000, 120);
      return { res: [['Pérdida en ' + F(v.dist, 0) + ' m', '−' + F(a * v.dist, 1), 'dB', hz(v.f)], ['Atenuación', F(a * 100, 2), 'dB / 100 m', ''], ['Velocidad del sonido', F(cSonido(v.t), 1), 'm/s', F(v.t, 0) + ' °C']],
        tabla: { cab: ['Frecuencia', 'dB / 100 m', 'Pérdida en ' + F(v.dist, 0) + ' m'], filas: OCT.slice(2).map(f => [hz(f), F(absorcionAire(f, v.t, v.hr) * 100, 2), '−' + F(absorcionAire(f, v.t, v.hr) * v.dist, 1) + ' dB']) },
        grafs: [{ tipo: 'linea', tit: 'Pérdida por absorción a ' + F(v.dist, 0) + ' m', log: true, xs, xlab: 'Hz', ylab: 'dB', marca: v.f, series: [{ nom: 'Pérdida', color: '#00b4ff', ys: xs.map(x => -absorcionAire(x, v.t, v.hr) * v.dist) }] }],
        notas: ['Norma ISO 9613-1, a presión atmosférica normal. Se suma a la pérdida por distancia; el aire seco y caliente es el que más agudos quita.'] }; } },
  { id: 'tiempo', g: 'acustica', nom: 'Tiempo ↔ distancia',
    campos: [{ k: 'modo', lab: 'Dato conocido', ops: [['d', 'Distancia'], ['t', 'Tiempo']], def: 'd' }, { k: 'dist', lab: 'Distancia', uni: 'm', def: 10, min: 0, max: 2000, paso: 0.5, si: v => v.modo === 'd' }, { k: 'ms', lab: 'Tiempo', uni: 'ms', def: 29.1, min: 0, max: 5000, paso: 0.5, si: v => v.modo === 't' }, TEMP],
    calc(v, F) { const c = cSonido(v.t), d = v.modo === 'd' ? v.dist : v.ms / 1000 * c, ms = d / c * 1000;
      return { res: [v.modo === 'd' ? ['Retardo', F(ms, 2), 'ms', F(d, 2) + ' m'] : ['Distancia', F(d, 2), 'm', F(ms, 2) + ' ms'], ['Distancia en pies', F(d / 0.3048, 2), 'ft', ''], ['Muestras a 48 kHz', F(ms * 48, 0), '', ''], ['Muestras a 96 kHz', F(ms * 96, 0), '', ''], ['Velocidad del sonido', F(c, 1), 'm/s', F(v.t, 0) + ' °C'], ['Fotogramas a 25 fps', F(ms / 40, 2), '', '']],
        notas: ['Para alinear una torre de retardo, añade entre 10 y 20 ms al retardo calculado: el sonido se sigue localizando en el escenario (efecto Haas).'] }; } },
  { id: 'onda', g: 'acustica', nom: 'Frecuencia ↔ longitud de onda',
    campos: [{ k: 'modo', lab: 'Dato conocido', ops: [['f', 'Frecuencia'], ['l', 'Longitud de onda']], def: 'f' }, { k: 'f', lab: 'Frecuencia', uni: 'Hz', def: 100, min: 1, max: 20000, paso: 5, si: v => v.modo === 'f' }, { k: 'l', lab: 'Longitud de onda', uni: 'm', def: 3.43, min: 0.01, max: 400, paso: 0.05, si: v => v.modo === 'l' }, TEMP],
    calc(v, F) { const c = cSonido(v.t), f = v.modo === 'f' ? v.f : c / v.l, l = c / f;
      return { res: [v.modo === 'f' ? ['Longitud de onda λ', F(l, 3), 'm', hz(Math.round(f))] : ['Frecuencia', F(f, 1), 'Hz', F(l, 2) + ' m'], ['λ / 2', F(l / 2, 3), 'm', 'separación máxima en línea'], ['λ / 4', F(l / 4, 3), 'm', 'end-fire y cardioide'], ['2 λ / 3', F(l * 2 / 3, 3), 'm', 'arrays de subgraves'], ['Periodo', F(1000 / f, 3), 'ms', ''], ['Velocidad del sonido', F(c, 1), 'm/s', F(v.t, 0) + ' °C']] }; } },
  // ---------- ARRAYS ----------
  { id: 'transicion', g: 'arrays', nom: 'Distancia de transición de un line array',
    campos: [{ k: 'H', lab: 'Longitud del array', uni: 'm', def: 3, min: 0.3, max: 20, paso: 0.1 }, { k: 'f', lab: 'Frecuencia', uni: 'Hz', def: 2000, min: 50, max: 16000, paso: 50 }, TEMP],
    calc(v, F) { const c = cSonido(v.t), tr = (f) => { const x = 3 * f / 1000 * v.H; return x <= 1 ? 0 : 1.5 * f / 1000 * v.H * v.H * Math.sqrt(1 - 1 / (x * x)) * 343 / c; }, d = tr(v.f);
      return { res: [['Distancia de transición', F(d, 1), 'm', hz(v.f)], ['Hasta ahí', '−3', 'dB', 'al doblar la distancia (onda cilíndrica)'], ['Más allá', '−6', 'dB', 'al doblar la distancia (onda esférica)'], ['Sin efecto de línea por debajo de', F(1000 / (3 * v.H), 0), 'Hz', '']],
        tabla: { cab: ['Frecuencia', 'Distancia de transición'], filas: OCT.slice(1, 9).map(f => [hz(f), tr(f) > 0 ? F(tr(f), 1) + ' m' : '—']) },
        notas: ['Aproximación de Fresnel para una línea recta y continua; un array curvado tiene menos alcance en campo cercano.'] }; } },
  { id: 'endfire', g: 'arrays', nom: 'Array de subgraves end-fire',
    campos: [{ k: 'n', lab: 'Subgraves en fila', uni: 'u', def: 3, min: 2, max: 8, paso: 1 }, { k: 'f0', lab: 'Frecuencia de diseño', uni: 'Hz', def: 63, min: 25, max: 160, paso: 1 },
      { k: 'sep', lab: 'Separación', ops: [['4', 'λ / 4'], ['m', 'A mano']], def: '4' }, { k: 'd', lab: 'Separación entre subgraves', uni: 'm', def: 1.36, min: 0.3, max: 5, paso: 0.05, si: v => v.sep === 'm' }, { k: 'f', lab: 'Frecuencia que se dibuja', uni: 'Hz', def: 63, min: 20, max: 250, paso: 1 }, TEMP],
    calc(v, F) { const c = cSonido(v.t), d = v.sep === '4' ? c / v.f0 / 4 : v.d, fu = fuentesEndfire(v.n, d, c), g = grafArray(fu, v.f, c, F);
      return { res: [['Separación', F(d, 2), 'm', 'entre centros'], ['Retardo por paso', F(d / c * 1000, 2), 'ms', 'el de delante, el más retardado'], ['Rechazo trasero', F(-g.polar[180], 1), 'dB', F(v.f, 0) + ' Hz'], ['Lóbulo a −6 dB', F(g.lobulo[1], 0), '°', ''], ['Fondo del conjunto', F(d * (v.n - 1), 2), 'm', ''], ['Máximo rechazo en', F(c / (4 * d), 0), 'Hz', 'separación = λ / 4']],
        tabla: { cab: ['Subgrave', 'Posición', 'Retardo'], filas: fu.map((q, i) => [(i + 1) + (i === 0 ? ' · delante' : i === v.n - 1 ? ' · detrás' : ''), F(-q.y, 2) + ' m', F(q.tau * 1000, 2) + ' ms']) },
        grafs: g.grafs, notas: ['Fuentes omnidireccionales ideales en campo libre. Todos los subgraves miran hacia delante y con la misma polaridad; el retardo crece hacia delante.'] }; } },
  { id: 'broadside', g: 'arrays', nom: 'Línea de subgraves (broadside)',
    campos: [{ k: 'n', lab: 'Subgraves en línea', uni: 'u', def: 6, min: 2, max: 24, paso: 1 }, { k: 'd', lab: 'Separación entre centros', uni: 'm', def: 1.36, min: 0.3, max: 6, paso: 0.05 }, { k: 'arco', lab: 'Arco electrónico (apertura)', uni: '°', def: 0, min: 0, max: 170, paso: 5 },
      { k: 'giro', lab: 'Orientación por retardo', uni: '°', def: 0, min: -60, max: 60, paso: 5 }, { k: 'f', lab: 'Frecuencia que se dibuja', uni: 'Hz', def: 63, min: 20, max: 250, paso: 1 }, TEMP],
    calc(v, F) { const c = cSonido(v.t), fu = fuentesBroadside(v.n, v.d, c, v.giro, v.arco), g = grafArray(fu, v.f, c, F);
      return { res: [['Lóbulo a −6 dB', F(g.lobulo[1], 0), '°', F(v.f, 0) + ' Hz'], ['Dirección del lóbulo', F(g.lobulo[0], 0), '°', ''], ['Longitud de la línea', F(v.d * (v.n - 1), 2), 'm', ''], ['Retardo máximo', F(Math.max(...fu.map(q => q.tau)) * 1000, 2), 'ms', ''], ['Sin lóbulos laterales hasta', F(c / (2 * v.d), 0), 'Hz', 'separación = λ / 2'], ['Nivel a 90°', F(g.polar[90], 1), 'dB', 'respecto al eje']],
        tabla: { cab: ['Subgrave', 'Posición', 'Retardo'], filas: fu.map((q, i) => [String(i + 1), F(q.x, 2) + ' m', F(q.tau * 1000, 2) + ' ms']) },
        grafs: g.grafs, notas: ['Fuentes omnidireccionales ideales en campo libre: la línea radia igual hacia delante y hacia atrás. El arco electrónico retarda los subgraves de los extremos para abrir la cobertura; la orientación gira el lóbulo sin mover las cajas.'] }; } },
  // ---------- ELECTRÓNICA DE AUDIO ----------
  { id: 'dbu', g: 'electronica', nom: 'dBu ↔ dBV ↔ voltios',
    campos: [{ k: 'uni', lab: 'Unidad del dato', ops: [['dbu', 'dBu'], ['dbv', 'dBV'], ['v', 'V']], def: 'dbu' }, { k: 'x', lab: 'Valor', uni: '', def: 4, min: -120, max: 1000, paso: 1 }],
    calc(v, F) { const V = v.uni === 'dbu' ? 0.7746 * Math.pow(10, v.x / 20) : v.uni === 'dbv' ? Math.pow(10, v.x / 20) : Math.max(1e-9, v.x);
      return { res: [['dBu', F(20 * log10(V / 0.7746), 2), 'dBu', '0 dBu = 0,775 V'], ['dBV', F(20 * log10(V), 2), 'dBV', '0 dBV = 1 V'], ['Tensión eficaz', V < 1 ? F(V * 1000, 1) : F(V, 3), V < 1 ? 'mV' : 'V', 'RMS'], ['Tensión de pico', F(V * Math.SQRT2, 3), 'V', 'senoidal'], ['Pico a pico', F(V * 2 * Math.SQRT2, 3), 'V', ''], ['Potencia en 600 Ω', F(10 * log10(V * V / 600 / 0.001), 2), 'dBm', '']],
        notas: ['Nivel profesional: +4 dBu = 1,228 V. Nivel doméstico: −10 dBV = 0,316 V. Entre los dos hay 11,8 dB.'] }; } },
  { id: 'qbw', g: 'electronica', nom: 'Factor Q ↔ ancho de banda',
    campos: [{ k: 'modo', lab: 'Dato conocido', ops: [['q', 'Factor Q'], ['bw', 'Ancho de banda']], def: 'q' }, { k: 'q', lab: 'Factor Q', uni: '', def: 1.41, min: 0.1, max: 100, paso: 0.1, si: v => v.modo === 'q' }, { k: 'bw', lab: 'Ancho de banda', uni: 'oct', def: 1, min: 0.01, max: 6, paso: 0.05, si: v => v.modo === 'bw' }, { k: 'f0', lab: 'Frecuencia central', uni: 'Hz', def: 1000, min: 10, max: 20000, paso: 10 }],
    calc(v, F) { const N = v.modo === 'q' ? 2 / Math.LN2 * Math.asinh(1 / (2 * v.q)) : v.bw, Q = v.modo === 'q' ? v.q : Math.sqrt(Math.pow(2, N)) / (Math.pow(2, N) - 1);
      return { res: [v.modo === 'q' ? ['Ancho de banda', F(N, 3), 'oct', 'Q = ' + F(Q, 2)] : ['Factor Q', F(Q, 3), '', F(N, 2) + ' oct'], ['Frecuencia inferior', F(v.f0 / Math.pow(2, N / 2), 0), 'Hz', '−3 dB'], ['Frecuencia superior', F(v.f0 * Math.pow(2, N / 2), 0), 'Hz', '−3 dB'], ['Ancho en hercios', F(v.f0 / Q, 0), 'Hz', '']],
        tabla: { cab: ['Ancho de banda', 'Factor Q'], filas: [[3, '3 oct'], [2, '2 oct'], [1, '1 oct'], [2 / 3, '2/3 oct'], [1 / 2, '1/2 oct'], [1 / 3, '1/3 oct'], [1 / 6, '1/6 oct'], [1 / 12, '1/12 oct']].map(([n, t]) => [t, F(Math.sqrt(Math.pow(2, n)) / (Math.pow(2, n) - 1), 2)]) } }; } },
  { id: 'limitador', g: 'electronica', nom: 'Umbral y tiempos del limitador',
    campos: [{ k: 'pot', lab: 'Potencia que admite el altavoz', uni: 'W', def: 500, min: 1, max: 10000, paso: 50 }, { k: 'z', lab: 'Impedancia del altavoz', uni: 'Ω', def: 8, min: 1, max: 32, paso: 1 }, { k: 'gan', lab: 'Ganancia del amplificador', uni: 'dB', def: 32, min: 10, max: 50, paso: 0.5 }, { k: 'hpf', lab: 'Corte inferior de la vía', uni: 'Hz', def: 100, min: 10, max: 20000, paso: 10 }],
    calc(v, F) { const V = Math.sqrt(v.pot * v.z), dbuOut = 20 * log10(V / 0.7746), at = ATAQUES.find(a => v.hpf < a[0])[1];
      return { res: [['Umbral del limitador', F(dbuOut - v.gan, 1), 'dBu', 'en la salida del procesador'], ['Tiempo de ataque', F(at, 1), 'ms', 'orientativo'], ['Tiempo de relajación', F(at * 16, 0), 'ms', '16 × ataque'], ['Tensión máxima en el altavoz', F(V, 1), 'V', 'RMS'], ['Nivel en la salida del ampli', F(dbuOut, 1), 'dBu', ''], ['Umbral en voltios', F(0.7746 * Math.pow(10, (dbuOut - v.gan) / 20), 2), 'V', '']],
        tabla: { cab: ['Corte inferior', 'Ataque', 'Relajación'], filas: ATAQUES.map((a, i) => [(i ? '≥ ' + (ATAQUES[i - 1][0]) : '< ' + a[0]) + ' Hz', F(a[1], 1) + ' ms', F(a[1] * 16, 0) + ' ms']) },
        notas: ['Limitador RMS para proteger la bobina con la potencia continua (AES) del altavoz. Con la potencia de programa, el umbral sube 3 dB. Comprueba siempre los valores que da el fabricante de la caja.'] }; } },
  { id: 'ampli', g: 'electronica', nom: 'Ganancia del amplificador',
    campos: [{ k: 'pot', lab: 'Potencia nominal', uni: 'W', def: 1000, min: 1, max: 20000, paso: 50 }, { k: 'z', lab: 'Impedancia de carga', uni: 'Ω', def: 4, min: 1, max: 32, paso: 1 }, { k: 'sens', lab: 'Sensibilidad de entrada', uni: 'V', def: 1.4, min: 0.1, max: 10, paso: 0.05 }],
    calc(v, F) { const V = Math.sqrt(v.pot * v.z), g = V / v.sens;
      return { res: [['Ganancia', F(20 * log10(g), 1), 'dB', '× ' + F(g, 1)], ['Tensión de salida', F(V, 1), 'V', 'RMS a plena potencia'], ['Sensibilidad', F(20 * log10(v.sens / 0.7746), 1), 'dBu', F(v.sens, 2) + ' V'], ['Corriente de salida', F(V / v.z, 1), 'A', 'RMS'], ['Sensibilidad con 32 dB', F(V / Math.pow(10, 32 / 20), 2), 'V', 'ganancia fija'], ['Sensibilidad con 26 dB', F(V / Math.pow(10, 26 / 20), 2), 'V', 'ganancia fija']] }; } },
  // ---------- CABLEADO ----------
  { id: 'cable', g: 'cableado', nom: 'Cable de altavoz · baja impedancia',
    campos: [{ k: 'L', lab: 'Longitud del cable', uni: 'm', def: 30, min: 1, max: 500, paso: 1 }, { k: 's', lab: 'Sección del conductor', ops: SECC, def: 2.5, sel: true }, { k: 'z', lab: 'Impedancia de la carga', uni: 'Ω', def: 8, min: 1, max: 32, paso: 1 }, { k: 'pot', lab: 'Potencia del amplificador', uni: 'W', def: 1000, min: 1, max: 20000, paso: 50 }, { k: 'df', lab: 'Factor de amortiguamiento del ampli', uni: '', def: 400, min: 10, max: 10000, paso: 50 }],
    calc(v, F) { const r = 2 * COBRE * v.L / v.s, perd = r / (r + v.z), dBp = 20 * log10(v.z / (v.z + r)), lmax = (x) => v.z * (Math.pow(10, x / 20) - 1) * v.s / (2 * COBRE);
      return { res: [['Pérdida de nivel', F(dBp, 2), 'dB', ''], ['Potencia perdida en el cable', F(perd * 100, 1), '%', F(v.pot * v.z * r / ((v.z + r) * (v.z + r)), 0) + ' W'], ['Factor de amortiguamiento', F(v.z / (r + v.z / v.df), 0), '', 'en bornes del altavoz'], ['Resistencia del cable', F(r, 3), 'Ω', 'ida y vuelta'], ['Longitud máxima', F(lmax(0.5), 0), 'm', 'para perder 0,5 dB'], ['Potencia en el altavoz', F(v.pot * v.z * v.z / ((v.z + r) * (v.z + r)), 0), 'W', '']],
        tabla: { cab: ['Sección', 'Pérdida', 'Amortiguamiento', 'Máx. para 0,5 dB'], filas: SECC.map(([s, t]) => { const rr = 2 * COBRE * v.L / s; return [t, F(20 * log10(v.z / (v.z + rr)), 2) + ' dB', F(v.z / (rr + v.z / v.df), 0), F(v.z * (Math.pow(10, 0.5 / 20) - 1) * s / (2 * COBRE), 0) + ' m']; }) },
        notas: ['Cobre a 20 °C. Como norma, no pierdas más de 0,5 dB y mantén el amortiguamiento por encima de 20 (de 50 en subgraves).'] }; } },
  { id: 'linea100', g: 'cableado', nom: 'Cable de altavoz · línea de 70 / 100 V',
    campos: [{ k: 'u', lab: 'Tensión de la línea', ops: [[100, '100 V'], [70, '70 V'], [50, '50 V'], [25, '25 V']], def: 100 }, { k: 'pot', lab: 'Potencia total de los altavoces', uni: 'W', def: 240, min: 1, max: 5000, paso: 10 }, { k: 'L', lab: 'Longitud de la línea', uni: 'm', def: 100, min: 1, max: 3000, paso: 10 }, { k: 's', lab: 'Sección del conductor', ops: SECC, def: 1.5, sel: true }],
    calc(v, F) { const z = v.u * v.u / v.pot, r = 2 * COBRE * v.L / v.s, perd = r / (r + z), lmax = (x) => z * (Math.pow(10, x / 20) - 1) * v.s / (2 * COBRE);
      return { res: [['Pérdida de nivel', F(20 * log10(z / (z + r)), 2), 'dB', ''], ['Potencia perdida', F(perd * 100, 1), '%', ''], ['Impedancia de la línea', F(z, 1), 'Ω', 'carga total'], ['Corriente', F(v.pot / v.u, 2), 'A', ''], ['Longitud máxima', F(lmax(0.5), 0), 'm', 'para perder 0,5 dB'], ['Longitud máxima', F(lmax(1), 0), 'm', 'para perder 1 dB']],
        tabla: { cab: ['Sección', 'Pérdida', 'Máx. para 0,5 dB', 'Máx. para 1 dB'], filas: SECC.map(([s, t]) => { const rr = 2 * COBRE * v.L / s; return [t, F(20 * log10(z / (z + rr)), 2) + ' dB', F(z * (Math.pow(10, 0.5 / 20) - 1) * s / (2 * COBRE), 0) + ' m', F(z * (Math.pow(10, 1 / 20) - 1) * s / (2 * COBRE), 0) + ' m']; }) },
        notas: ['Toda la carga al final de la línea (el caso más desfavorable). Deja al amplificador un 20 % de potencia de reserva sobre la suma de los altavoces.'] }; } },
  // ---------- ILUMINACIÓN Y VÍDEO ----------
  { id: 'dmx', g: 'luz', nom: 'Direcciones DMX',
    campos: [{ k: 'ini', lab: 'Dirección del primer aparato', uni: '', def: 1, min: 1, max: 512, paso: 1 }, { k: 'can', lab: 'Canales por aparato', uni: 'ch', def: 16, min: 1, max: 512, paso: 1 }, { k: 'n', lab: 'Número de aparatos', uni: 'u', def: 8, min: 1, max: 512, paso: 1 }],
    calc(v, F) { const dirs = []; let d = v.ini, u = 1; for (let i = 0; i < v.n; i++) { if (d + v.can - 1 > 512) { u++; d = 1; } dirs.push([u, d]); d += v.can; }
      const ult = dirs[dirs.length - 1], dip = (n) => Array.from({ length: 9 }, (_, i) => (n >> i) & 1);
      return { res: [['Último canal usado', String(ult[1] + v.can - 1), '', 'universo ' + ult[0]], ['Universos', String(u), '', '512 canales cada uno'], ['Canales en total', F(v.n * v.can, 0), 'ch', ''], ['Canales libres', String(512 - (ult[1] + v.can - 1)), '', 'en el último universo'], ['Siguiente dirección libre', ult[1] + v.can > 512 ? '—' : String(ult[1] + v.can), '', '']],
        tabla: { cab: ['Aparato', 'Universo', 'Dirección', 'Microinterruptores 1 → 256'], filas: dirs.slice(0, 64).map(([un, di], i) => [String(i + 1), String(un), String(di), dip(di).map(b => b ? '▮' : '▯').join(' ')]) },
        grafs: [{ tipo: 'dip', tit: 'Microinterruptores del primer aparato', bits: dip(v.ini), n: v.ini }],
        notas: ['Un aparato no se parte entre dos universos: si no cabe entero, pasa al siguiente. Los microinterruptores valen 1, 2, 4, 8, 16, 32, 64, 128 y 256.'] }; } },
  { id: 'color', g: 'luz', nom: 'Color · RGB, RGBW, RGBA y CMY',
    campos: [{ k: 'r', lab: 'Rojo', uni: '', def: 255, min: 0, max: 255, paso: 5 }, { k: 'g', lab: 'Verde', uni: '', def: 120, min: 0, max: 255, paso: 5 }, { k: 'b', lab: 'Azul', uni: '', def: 0, min: 0, max: 255, paso: 5 }],
    calc(v, F) { const { r, g, b } = v, w = Math.min(r, g, b), a = Math.min(r, g / 0.75), hex = '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase(), pc = (x) => F(x / 255 * 100, 0);
      const mx = Math.max(r, g, b), mn = w, h = mx === mn ? 0 : mx === r ? ((g - b) / (mx - mn) + 6) % 6 * 60 : mx === g ? ((b - r) / (mx - mn) + 2) * 60 : ((r - g) / (mx - mn) + 4) * 60;
      return { res: [['Hexadecimal', hex, '', ''], ['CMY', [255 - r, 255 - g, 255 - b].map(pc).join(' · '), '%', 'cian · magenta · amarillo'], ['RGBW', [r - w, g - w, b - w, w].map(x => Math.round(x)).join(' · '), '', 'rojo · verde · azul · blanco'], ['RGBA', [r - a, g - 0.75 * a, b, a].map(x => Math.round(x)).join(' · '), '', 'rojo · verde · azul · ámbar'], ['RGB en %', [r, g, b].map(pc).join(' · '), '%', ''], ['Tono · saturación · brillo', F(h, 0) + '° · ' + F(mx ? (mx - mn) / mx * 100 : 0, 0) + ' · ' + pc(mx), '', 'HSV']],
        grafs: [{ tipo: 'color', tit: 'Muestra', hex }], notas: ['Valores DMX de 8 bits (0–255). El blanco y el ámbar de cada aparato tienen su propio tono: ajusta a ojo sobre el foco real.'] }; } },
  { id: 'proyector', g: 'luz', nom: 'Proyector · distancia y brillo',
    campos: [{ k: 'W', lab: 'Ancho de la imagen', uni: 'm', def: 4, min: 0.5, max: 60, paso: 0.1 }, { k: 'ar', lab: 'Formato', ops: [[16 / 9, '16:9'], [16 / 10, '16:10'], [4 / 3, '4:3']], def: 16 / 9 }, { k: 'tr', lab: 'Relación de tiro', uni: ':1', def: 1.5, min: 0.2, max: 12, paso: 0.05 }, { k: 'lm', lab: 'Luminosidad', uni: 'lm', def: 8000, min: 500, max: 60000, paso: 500 }, { k: 'gan', lab: 'Ganancia de la pantalla', uni: '×', def: 1, min: 0.3, max: 3, paso: 0.1 }, { k: 'lux', lab: 'Luz ambiente en la pantalla', uni: 'lx', def: 100, min: 0, max: 5000, paso: 10 }],
    calc(v, F) { const H = v.W / v.ar, A = v.W * H, E = v.lm / A, nits = E * v.gan / PI, amb = v.lux * v.gan / PI, con = (nits + amb) / Math.max(amb, 1e-6);
      return { res: [['Distancia de proyección', F(v.W * v.tr, 2), 'm', 'óptica–pantalla'], ['Brillo de la imagen', F(nits, 0), 'nits', F(E, 0) + ' lx'], ['Contraste real', v.lux > 0 ? F(con, 1) : '—', ':1', con >= 15 ? 'bien para presentaciones' : con >= 7 ? 'justo: visión pasiva' : 'insuficiente'], ['Alto de la imagen', F(H, 2), 'm', ''], ['Diagonal', F(Math.hypot(v.W, H) / 0.0254, 0), '"', F(Math.hypot(v.W, H), 2) + ' m'], ['Superficie', F(A, 1), 'm²', '']],
        notas: ['Para el estudio completo de una proyección (ópticas, blending, sombras y equipos), usa SCREENS.'] }; } },
  // ---------- ELECTRICIDAD ----------
  { id: 'ohm', g: 'electricidad', nom: 'Ley de Ohm y de Joule',
    campos: [{ k: 'par', lab: 'Datos conocidos', ops: [['vi', 'Tensión y corriente'], ['vr', 'Tensión y resistencia'], ['vp', 'Tensión y potencia'], ['ir', 'Corriente y resistencia'], ['ip', 'Corriente y potencia'], ['rp', 'Resistencia y potencia']], def: 'vp', sel: true },
      { k: 'V', lab: 'Tensión', uni: 'V', def: 230, min: 0.001, max: 100000, paso: 1, si: v => v.par.includes('v') }, { k: 'I', lab: 'Corriente', uni: 'A', def: 10, min: 0.001, max: 10000, paso: 0.5, si: v => v.par.includes('i') }, { k: 'R', lab: 'Resistencia o impedancia', uni: 'Ω', def: 8, min: 0.001, max: 1e7, paso: 1, si: v => v.par.includes('r') }, { k: 'P', lab: 'Potencia', uni: 'W', def: 2000, min: 0.001, max: 1e7, paso: 50, si: v => v.par.includes('p') }],
    calc(v, F) { let { V, I, R, P } = v; const p = v.par;
      if (p === 'vi') { R = V / I; P = V * I; } else if (p === 'vr') { I = V / R; P = V * V / R; } else if (p === 'vp') { I = P / V; R = V * V / P; } else if (p === 'ir') { V = I * R; P = I * I * R; } else if (p === 'ip') { V = P / I; R = P / (I * I); } else { V = Math.sqrt(P * R); I = Math.sqrt(P / R); }
      return { res: [['Tensión', F(V, 2), 'V', ''], ['Corriente', F(I, 2), 'A', ''], ['Resistencia', F(R, 2), 'Ω', ''], ['Potencia', F(P, 1), 'W', F(P / 1000, 2) + ' kW']], notas: ['V = I · R  ·  P = V · I  ·  P = I² · R  ·  P = V² / R'] }; } },
  { id: 'kva', g: 'electricidad', nom: 'Potencia eléctrica · kVA, kW y amperios',
    campos: [{ k: 'fase', lab: 'Suministro', ops: [['1', 'Monofásico'], ['3', 'Trifásico']], def: '3' }, { k: 'modo', lab: 'Dato conocido', ops: [['a', 'Amperios por fase'], ['kw', 'Potencia en kW']], def: 'kw' }, { k: 'V', lab: 'Tensión', uni: 'V', def: 400, min: 100, max: 1000, paso: 10 }, { k: 'I', lab: 'Corriente por fase', uni: 'A', def: 32, min: 0.1, max: 5000, paso: 1, si: v => v.modo === 'a' }, { k: 'kw', lab: 'Potencia', uni: 'kW', def: 20, min: 0.1, max: 5000, paso: 1, si: v => v.modo === 'kw' }, { k: 'fp', lab: 'Factor de potencia (cos φ)', uni: '', def: 0.9, min: 0.3, max: 1, paso: 0.05 }],
    calc(v, F) { const k = v.fase === '3' ? Math.sqrt(3) : 1, kva = v.modo === 'a' ? k * v.V * v.I / 1000 : v.kw / v.fp, I = v.modo === 'a' ? v.I : kva * 1000 / (k * v.V), tomas = [16, 32, 63, 125, 250, 400].find(a => a >= I * 1.25);
      return { res: [['Potencia aparente', F(kva, 1), 'kVA', ''], ['Potencia activa', F(kva * v.fp, 1), 'kW', 'cos φ ' + F(v.fp, 2)], ['Corriente por fase', F(I, 1), 'A', ''], ['Toma recomendada', tomas ? String(tomas) : '> 400', 'A', 'con un 25 % de reserva'], ['Generador recomendado', F(kva * 1.25, 0), 'kVA', 'con un 25 % de reserva']],
        notas: ['Trifásico: tensión entre fases (400 V) y carga repartida por igual en las tres. kVA = √3 · V · I / 1000. En monofásico, la tensión es entre fase y neutro (230 V).'] }; } },
  // ---------- MÚSICA Y GRABACIÓN ----------
  { id: 'bpm', g: 'musica', nom: 'Tempo · BPM ↔ tiempo', tap: 'bpm',
    campos: [{ k: 'bpm', lab: 'Tempo', uni: 'BPM', def: 120, min: 20, max: 400, paso: 1 }],
    calc(v, F) { const n = 60000 / v.bpm, fila = (t, k) => [t, F(n * k, 1) + ' ms', F(n * k * 1.5, 1) + ' ms', F(n * k * 2 / 3, 1) + ' ms', F(1000 / (n * k), 2) + ' Hz'];
      return { res: [['Negra', F(n, 1), 'ms', ''], ['Corchea', F(n / 2, 1), 'ms', ''], ['Semicorchea', F(n / 4, 1), 'ms', ''], ['Compás de 4/4', F(n * 4 / 1000, 2), 's', ''], ['Pulso', F(v.bpm / 60, 2), 'Hz', ''], ['Negra con puntillo', F(n * 1.5, 1), 'ms', '']],
        tabla: { cab: ['Figura', 'Normal', 'Con puntillo', 'Tresillo', 'Frecuencia'], filas: [fila('Redonda', 4), fila('Blanca', 2), fila('Negra', 1), fila('Corchea', 0.5), fila('Semicorchea', 0.25), fila('Fusa', 0.125)] },
        notas: ['Para ajustar retardos y reverberaciones al tempo. Marca el pulso con el botón TAP para medir el tempo de una canción.'] }; } },
  { id: 'grabacion', g: 'musica', nom: 'Tamaño y tiempo de grabación',
    campos: [{ k: 'modo', lab: 'Dato conocido', ops: [['t', 'Duración'], ['gb', 'Espacio en disco']], def: 't' }, { k: 'ch', lab: 'Canales', uni: 'ch', def: 32, min: 1, max: 256, paso: 1 }, { k: 'fs', lab: 'Frecuencia de muestreo', ops: [[44.1, '44,1 kHz'], [48, '48 kHz'], [96, '96 kHz'], [192, '192 kHz']], def: 48 }, { k: 'bits', lab: 'Resolución', ops: [[16, '16 bits'], [24, '24 bits'], [32, '32 bits']], def: 24 },
      { k: 'min', lab: 'Duración', uni: 'min', def: 120, min: 1, max: 100000, paso: 5, si: v => v.modo === 't' }, { k: 'gb', lab: 'Espacio en disco', uni: 'GB', def: 500, min: 0.1, max: 100000, paso: 10, si: v => v.modo === 'gb' }],
    calc(v, F) { const bps = v.ch * v.fs * 1000 * v.bits, gbMin = bps * 60 / 8 / 1e9, min = v.modo === 't' ? v.min : v.gb / gbMin, gb = min * gbMin, hm = (m) => Math.floor(m / 60) + ' h ' + Math.round(m % 60) + ' min';
      return { res: [v.modo === 't' ? ['Espacio necesario', gb >= 1 ? F(gb, 1) : F(gb * 1000, 0), gb >= 1 ? 'GB' : 'MB', hm(min)] : ['Tiempo de grabación', hm(min), '', F(v.gb, 0) + ' GB'], ['Caudal de datos', F(bps / 1e6, 1), 'Mbit/s', ''], ['Por minuto', F(gbMin * 1000, 0), 'MB', ''], ['Por hora', F(gbMin * 60, 1), 'GB', ''], ['Por pista y hora', F(gbMin * 60 / v.ch * 1000, 0), 'MB', '']],
        notas: ['Audio sin comprimir (WAV, AIFF). 1 GB = 1.000 MB. Un archivo WAV clásico no pasa de 4 GB: para tomas largas, usa RF64 o BWF.'] }; } },
  { id: 'nota', g: 'musica', nom: 'Nota ↔ frecuencia',
    campos: [{ k: 'modo', lab: 'Dato conocido', ops: [['n', 'Nota'], ['f', 'Frecuencia']], def: 'n' }, { k: 'nota', lab: 'Nota', ops: NOTAS.map((n, i) => [i, n]), def: 9, sel: true, si: v => v.modo === 'n' }, { k: 'oct', lab: 'Octava', uni: '', def: 3, min: -1, max: 9, paso: 1, si: v => v.modo === 'n' }, { k: 'f', lab: 'Frecuencia', uni: 'Hz', def: 440, min: 8, max: 20000, paso: 1, si: v => v.modo === 'f' }, { k: 'la', lab: 'Afinación del La', uni: 'Hz', def: 440, min: 400, max: 480, paso: 1 }, TEMP],
    calc(v, F) { const midi = v.modo === 'n' ? (v.oct + 2) * 12 + Number(v.nota) : 69 + 12 * Math.log2(v.f / v.la), m = Math.round(midi), f = v.modo === 'n' ? v.la * Math.pow(2, (midi - 69) / 12) : v.f, nom = NOTAS[((m % 12) + 12) % 12] + ' ' + (Math.floor(m / 12) - 2), cents = (midi - m) * 100;
      return { res: [v.modo === 'n' ? ['Frecuencia', F(f, 2), 'Hz', nom] : ['Nota más cercana', nom, '', (cents >= 0 ? '+' : '') + F(cents, 0) + ' cents'], ['Número MIDI', String(m), '', ''], ['Longitud de onda', F(cSonido(v.t) / f, 3), 'm', ''], ['Octava inferior', F(f / 2, 2), 'Hz', ''], ['Octava superior', F(f * 2, 2), 'Hz', ''], ['Quinta justa', F(f * 1.5, 2), 'Hz', '']],
        notas: ['Temperamento igual. Octavas con el Do central como Do 3 (La 3 = 440 Hz); otros fabricantes lo llaman Do 4.'] }; } },
  // ---------- PESOS Y MEDIDAS ----------
  { id: 'medidas', g: 'medidas', nom: 'Conversor de unidades',
    campos: [{ k: 'mag', lab: 'Magnitud', ops: [['peso', 'Peso'], ['longitud', 'Longitud'], ['area', 'Superficie'], ['volumen', 'Volumen'], ['temp', 'Temperatura']], def: 'longitud', sel: true }, { k: 'x', lab: 'Valor', uni: '', def: 1, min: -1e9, max: 1e9, paso: 1 },
      ...Object.keys(UNIDADES).map(m => ({ k: 'u_' + m, lab: 'Unidad', ops: UNIDADES[m].map(u => [u[0], u[0]]), def: UNIDADES[m][0][0], sel: true, si: v => v.mag === m })), { k: 'u_temp', lab: 'Unidad', ops: [['C', '°C'], ['F', '°F'], ['K', 'K']], def: 'C', si: v => v.mag === 'temp' }],
    calc(v, F) { if (v.mag === 'temp') { const c = v.u_temp === 'C' ? v.x : v.u_temp === 'F' ? (v.x - 32) / 1.8 : v.x - 273.15; return { res: [['Celsius', F(c, 2), '°C', ''], ['Fahrenheit', F(c * 1.8 + 32, 2), '°F', ''], ['Kelvin', F(c + 273.15, 2), 'K', '']] }; }
      const U = UNIDADES[v.mag], base = v.x * U.find(u => u[0] === v['u_' + v.mag])[1], cif = (x) => { const a = Math.abs(x); return F(x, a >= 100 ? 1 : a >= 1 ? 3 : 5); };
      return { res: U.map(u => [u[0], cif(base / u[1]), '', '']) }; } },
  // ---------- REFERENCIA ----------
  { id: 'pines', g: 'referencia', nom: 'Asignación de pines',
    campos: [{ k: 'con', lab: 'Conector', ops: Object.keys(PINES).map(k => [k, PINES[k][0]]), def: 'xlr3', sel: true }],
    calc(v) { const p = PINES[v.con]; return { res: [], tabla: { cab: ['Contacto', 'Función'], filas: p[1] }, grafs: [{ tipo: 'conector', tit: p[0], con: v.con }],
      notas: ['En los XLR de audio, el pin 2 es el vivo (norma AES14). Para DMX usa cable de 110–120 Ω, no cable de micrófono, y termina la línea con 120 Ω.'] }; } },
  { id: 'micros', g: 'referencia', nom: 'Patrones polares de micrófonos',
    campos: [{ k: 'pat', lab: 'Patrón', ops: MICROS.map(m => [m[0], m[1]]), def: 'cardioide', sel: true }],
    calc(v, F) { const m = MICROS.find(x => x[0] === v.pat), A = m[2], B = m[3], pts = Array.from({ length: 360 }, (_, a) => db(Math.abs(A + B * Math.cos(a * RAD)))), nulo = B > A ? Math.acos(-A / B) / RAD : B === A ? 180 : null, acep = B > 0 && (0.7071 - A) / B >= -1 ? 2 * Math.acos((0.7071 - A) / B) / RAD : 360;
      return { res: [['Ángulo de captación', F(acep, 0), '°', 'a −3 dB'], ['Máximo rechazo', nulo == null ? '—' : (nulo > 179 ? '' : '± ') + F(nulo, 0), '°', ''], ['Atenuación a 90°', A <= 1e-9 ? '−∞' : F(db(A), 1), 'dB', ''], ['Atenuación a 180°', Math.abs(A - B) < 1e-9 ? '−∞' : F(db(Math.abs(A - B)), 1), 'dB', ''], ['Factor de distancia', F(Math.sqrt(1 / (A * A + B * B / 3)), 1), '×', 'respecto a un omni'], ['Fórmula', F(A, 2) + ' + ' + F(B, 2) + ' · cos θ', '', '']],
        grafs: [{ tipo: 'polar', tit: m[1], min: -24, series: [{ nom: m[1], pts, color: '#00b4ff' }] }],
        notas: ['Patrón teórico de primer orden. Coloca los monitores de escenario en el ángulo de máximo rechazo del micrófono: detrás con un cardioide, a ±125° con un supercardioide y a ±110° con un hipercardioide.'] }; } }
];
