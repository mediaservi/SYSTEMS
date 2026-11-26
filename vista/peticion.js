// SYSTEMS · petición escrita: pone la frase en una forma única antes de que la lea cada módulo (como la de SCREENS).
// Números escritos con letra (es / en / ca), medidas en mm o cm, «10 m de ancho por 16 de largo», «metros» → m.
// Reglas locales, sin servicios externos. No quita tildes: los módulos ya las contemplan.
const NUM = {
  dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, quince: 15, veinte: 20, treinta: 30, cuarenta: 40, cincuenta: 50, cien: 100,
  two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fifty: 50, hundred: 100,
  quatre: 4, cinc: 5, sis: 6, vuit: 8, deu: 10, dotze: 12, quinze: 15, vint: 20, trenta: 30, quaranta: 40, cinquanta: 50, cent: 100
};
const PAL = new RegExp('(^|[^a-zà-ÿ])(' + Object.keys(NUM).join('|') + ')(?=[^a-zà-ÿ]|$)', 'g');
const X = '(?:x|×|\\*|por|per|by)';
const U = '(?:m|mts|metros|metres|meters)';

export function normaliza(texto) {
  let t = ' ' + String(texto || '').toLowerCase().replace(/\s+/g, ' ') + ' ';
  t = t.replace(/(\d),(\d)/g, '$1.$2');
  t = t.replace(PAL, (todo, a, w) => a + NUM[w]);
  // «480 x 270 cm», «4800 × 2700 mm» → metros
  t = t.replace(new RegExp('(\\d+(?:\\.\\d+)?)\\s*(mm|cm)?\\s*' + X + '\\s*(\\d+(?:\\.\\d+)?)(?:\\s*(mm|cm)?\\s*' + X + '\\s*(\\d+(?:\\.\\d+)?))?\\s*(mm|cm)(?![a-z])', 'g'),
    (todo, a, u1, b, u2, c, u3) => { const f = (u3 || u2 || u1) === 'mm' ? 1000 : 100; return ' ' + [a, b, c].filter((q) => q != null).map((q) => +(parseFloat(q) / f).toFixed(3)).join(' x ') + ' m '; });
  // «10 m de ancho por 16 (m) de largo», «10 metros por 16 por 4», «6 by 4 m» → «10 x 16 x 4» (un «per 10 persones» detrás de una medida no es otra medida)
  const D = '\\s*' + U + '?\\s*(?:de (?:ancho|largo|fondo|alto|altura|amplada|ample|llarg|llargada|fons|alçada|alt)|d.(?:amplada|ample|alçada)|wide|long|high|tall)?\\s*';
  t = t.replace(new RegExp('(?<![x×*]\\s*)(\\d+(?:\\.\\d+)?)' + D + X + '\\s*(\\d+(?:\\.\\d+)?)(?:' + D + '(?:x|×|\\*|por|by)\\s*(\\d+(?:\\.\\d+)?))?', 'g'),
    (todo, a, b, c) => [a, b, c].filter((q) => q != null).join(' x ') + ' ');
  t = t.replace(new RegExp('(\\d+(?:\\.\\d+)?)\\s*' + U + '(?![a-zà-ÿ])', 'g'), '$1 m');
  return t.replace(/\s+/g, ' ').trim();
}
