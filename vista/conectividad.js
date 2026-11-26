// SYSTEMS · reglas de señal y conectividad (conocimiento/systems-conectividad-reglas.md), comunes a SEÑAL Y CONECTIVIDAD y a ELECTRÓNICA
// (proyección y displays): cómo se elige el conmutador y el cable o extensor de cada tramo. Solo con equipos de las listas. GPL-3.0 · mediaservi.com
import { equipos } from './listas.js';
import { textos } from './util.js';
textos({
  'Salida HDBaseT del equipo + receptor junto al destino': ['HDBaseT output of the unit + receiver at the destination', 'Sortida HDBaseT de l\'equip + receptor al costat de la destinació'],
  'Cable Cat6A S-FTP; comprueba en la ficha el receptor que admite.': ['Cat6A S-FTP cable; check the supported receiver in the datasheet.', 'Cable Cat6A S-FTP; comprova a la fitxa el receptor que admet.'],
  'Cable DisplayPort pasivo': ['Passive DisplayPort cable', 'Cable DisplayPort passiu'], 'Cable HDMI pasivo': ['Passive HDMI cable', 'Cable HDMI passiu'],
  'Cable HDMI de fibra 8K': ['8K fibre HDMI cable', 'Cable HDMI de fibra 8K'], 'Cable DisplayPort de fibra': ['Fibre DisplayPort cable', 'Cable DisplayPort de fibra'],
  'Extensor de fibra': ['Fibre extender', 'Extensor de fibra'], 'Cable DisplayPort': ['DisplayPort cable', 'Cable DisplayPort'], 'Cable HDMI': ['HDMI cable', 'Cable HDMI'],
  'Cable HDMI de fibra (activo)': ['Fibre HDMI cable (active)', 'Cable HDMI de fibra (actiu)'], 'Extensor HDBaseT 3.0 con USB (KVM)': ['HDBaseT 3.0 extender with USB (KVM)', 'Extensor HDBaseT 3.0 amb USB (KVM)'],
  'Extensor HDBaseT': ['HDBaseT extender', 'Extensor HDBaseT'], 'Extensor HDBaseT 18 Gbps': ['18 Gbps HDBaseT extender', 'Extensor HDBaseT 18 Gbps'], 'Extensor HDBaseT de largo alcance': ['Long-reach HDBaseT extender', 'Extensor HDBaseT de llarg abast'],
  'Más de 50 m a 8K: comprueba en la ficha el ancho de banda del extensor.': ['Over 50 m at 8K: check the extender bandwidth in the datasheet.', 'Més de 50 m a 8K: comprova a la fitxa l\'amplada de banda de l\'extensor.'],
  'A 1080p un cable de calidad llega a 15 m.': ['At 1080p a good cable reaches 15 m.', 'A 1080p un cable de qualitat arriba a 15 m.'], 'Fibra multimodo.': ['Multimode fibre.', 'Fibra multimode.'], 'Fibra monomodo.': ['Single-mode fibre.', 'Fibra monomode.'],
  'Backup': ['Backup', 'Backup'], 'USB-C': ['USB-C', 'USB-C'], 'DisplayPort': ['DisplayPort', 'DisplayPort'], 'NOVASTAR': ['NOVASTAR', 'NOVASTAR'], 'COEX': ['COEX', 'COEX'], 'dB SPL': ['dB SPL', 'dB SPL'], 'Arrays': ['Arrays', 'Arrays'],
});

export const RES = { '1080': { gbps: 4.5, nom: '1080p' }, '4k': { gbps: 18, nom: '4K60' }, '8k': { gbps: 48, nom: '8K' } };
const pl = (id) => equipos(['conmutador', 'extensor', 'cable'], 'PURELINK').find((x) => x.id === id);

/* cable o extensor para un tramo de d metros con la señal r ('1080' | '4k' | '8k'); usb: hace falta llevar USB (KVM) */
/* v1.7 · cables prioritarios (marcados ⭐ en el panel): si la alternativa válida es prioritaria y la propuesta no, se proponen al revés */
export function tramo(d, r, o = {}) {
  const x = tramoBase(d, r, o);
  if (x && x.alt && x.alt.prioritario && !(x.eq && x.eq.prioritario) && x.alt.tipo === 'cable' && !o.usb)
    return { tipo: 'fibra-c', txt: o.dp ? 'Cable DisplayPort de fibra' : 'Cable HDMI de fibra (activo)', eq: x.alt, alt: x.eq, prio: true };
  return x;
}
function tramoBase(d, r, o = {}) {
  const usb = !!o.usb, dp = !!o.dp, hdbtSale = !!o.hdbtSale;
  if (hdbtSale && d <= 100) return { tipo: 'hdbt-int', txt: 'Salida HDBaseT del equipo + receptor junto al destino', eq: pl('MC1000'), nota: 'Cable Cat6A S-FTP; comprueba en la ficha el receptor que admite.' };
  if (d <= 5 && !(r === '8k' && d > 3)) return { tipo: 'pasivo', txt: dp ? 'Cable DisplayPort pasivo' : 'Cable HDMI pasivo', eq: pl(r === '8k' ? 'FI-H100' : dp ? 'PI5010' : 'PI1000') };
  if (r === '8k') return d <= 50 && !dp ? { tipo: 'fibra-c', txt: 'Cable HDMI de fibra 8K', eq: pl('FX-I380') } : d <= 100 && dp ? { tipo: 'fibra-c', txt: 'Cable DisplayPort de fibra', eq: pl('FX-I260') } : { tipo: 'fibra', txt: 'Extensor de fibra', eq: pl('PT-HDOF-100'), nota: 'Más de 50 m a 8K: comprueba en la ficha el ancho de banda del extensor.' };
  if (r === '1080' && d <= 15) return { tipo: 'pasivo', txt: dp ? 'Cable DisplayPort' : 'Cable HDMI', eq: pl(dp ? 'PI5010' : 'PI1000'), nota: d > 5 ? 'A 1080p un cable de calidad llega a 15 m.' : '' };
  if (d <= 15) return { tipo: 'fibra-c', txt: dp ? 'Cable DisplayPort de fibra' : 'Cable HDMI de fibra (activo)', eq: pl(dp ? 'FX-I260' : 'FX-I352') };
  if (usb && d <= 100) return { tipo: 'hdbt3', txt: 'Extensor HDBaseT 3.0 con USB (KVM)', eq: pl('PT-HDBT-1020HU-TX'), eq2: pl('PT-HDBT-1020HU-RX'), cat: true };
  if (d <= 40) return r === '1080' ? { tipo: 'hdbt', txt: 'Extensor HDBaseT', eq: pl('PT-HDBT-100'), cat: true } : { tipo: 'hdbt', txt: 'Extensor HDBaseT 18 Gbps', eq: pl('PT-HDBT-200'), cat: true, alt: pl('FX-I352') };
  if (d <= 100) return { tipo: 'hdbt', txt: 'Extensor HDBaseT de largo alcance', eq: pl('PT-HDBT-150'), cat: true, alt: pl('FX-I352') };
  return { tipo: 'fibra', txt: 'Extensor de fibra', eq: pl(d <= 300 ? 'FX-P350' : 'PT-HDOF-100'), nota: d <= 300 ? 'Fibra multimodo.' : 'Fibra monomodo.' };
}
/* conmutador: espejo (selector o distribuidor) o independiente (matriz); devuelve el equipo de la lista o null */
export function conmutador(nIn, nOut, modo, o = {}) {
  const L = equipos('conmutador', 'PURELINK'), gb = o.gbps || 18, lejos = !!o.lejos, kvm = !!o.kvm;
  if (nIn <= 1 && nOut <= 1) return null;
  const ok = (x) => (x.gbps || 18) >= gb && (!kvm || x.kvm || x.clase !== 'selector');
  let c = [];
  if (modo === 'independiente') c = L.filter((x) => x.clase === 'matriz' && x.inp >= nIn && x.out >= nOut && ok(x)).sort((a, b) => (a.inp * a.out) - (b.inp * b.out) || (lejos ? (b.hdbt ? 1 : 0) - (a.hdbt ? 1 : 0) : (a.hdbt ? 1 : 0) - (b.hdbt ? 1 : 0)));
  else if (nOut <= 1) c = L.filter((x) => x.clase === 'selector' && x.inp >= nIn && ok(x)).sort((a, b) => a.inp - b.inp || (kvm ? (b.kvm ? 1 : 0) - (a.kvm ? 1 : 0) : 0) || (a.gbps || 0) - (b.gbps || 0));
  else c = L.filter((x) => x.clase === 'distribuidor' && x.inp >= Math.min(nIn, 2) && x.out >= nOut && ok(x) && !x.dp).sort((a, b) => a.out - b.out || a.inp - b.inp);
  if (!c.length && modo !== 'independiente' && nOut > 1) c = L.filter((x) => x.clase === 'matriz' && x.inp >= nIn && x.out >= nOut).sort((a, b) => (a.inp * a.out) - (b.inp * b.out));
  return c[0] || null;
}
