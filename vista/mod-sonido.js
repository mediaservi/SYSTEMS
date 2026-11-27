// SYSTEMS · módulo SONORIZACIÓN (v2.0): el sistema de sonido completo de una sala, no un altavoz suelto.
// Con la sala, el uso, el montaje y los micrófonos propone altavoces, subgraves, retardos, electrónica, micrófonos, control y accesorios,
// con las reglas de diseño según información de los fabricantes (RCF, SENNHEISER, XILICA; EZ ACOUSTICS y FOHHN solo como consulta).
// Solo con equipos de las listas del panel. Orientativo: hay que validar el diseño. GPL-3.0 · mediaservi.com
import { T, N, esc, textos, lee, guarda, togs, num, etq } from './util.js';
import { equipos, P } from './listas.js';
import { COL, escala, cota, persona, suelo, techo, etiqueta, lienzo, lienzo3D, pestanas, fmt } from './vt.js';
textos({
  'Vista lateral': ['Side view', 'Vista lateral'], 'La sala vista de lado': ['The room seen from the side', 'La sala vista de costat'], 'oído': ['ear', 'oïda'], 'ojos': ['eyes', 'ulls'],
  'Sonorización': ['Sound system', 'Sonorització'], 'SONIDO': ['SOUND', 'SO'],
  'El sistema de sonido completo de una sala: altavoces, subgraves, retardos, electrónica, micrófonos y control.': ['The complete sound system for a room: loudspeakers, subwoofers, delays, electronics, microphones and control.', 'El sistema de so complet d\'una sala: altaveus, subgreus, retards, electrònica, micròfons i control.'],
  'Escríbela: «sala de 10 x 16 m con 2 micros y pantalla»': ['Type it: “10 x 16 m room with 2 mics and a screen”', 'Escriu-la: «sala de 10 x 16 m amb 2 micros i pantalla»'],
  'Sala': ['Room', 'Sala'], 'Ancho (m)': ['Width (m)', 'Amplada (m)'], 'Fondo (m)': ['Depth (m)', 'Fons (m)'], 'Alto (m)': ['Height (m)', 'Alçada (m)'], 'Zonas': ['Zones', 'Zones'],
  'Uso': ['Use', 'Ús'], 'Montaje': ['Mounting', 'Muntatge'], 'Acabado': ['Finish', 'Acabat'], 'Pared': ['Wall', 'Paret'], 'Techo': ['Ceiling', 'Sostre'], 'Negro': ['Black', 'Negre'], 'Blanco': ['White', 'Blanc'],
  'Música de fondo': ['Background music', 'Música de fons'], 'Megafonía': ['Paging', 'Megafonia'], 'Sala con micros': ['Room with mics', 'Sala amb micros'], 'Eventos': ['Events', 'Esdeveniments'],
  'Hilo musical, tiendas, restaurantes': ['Background music, shops, restaurants', 'Fil musical, botigues, restaurants'], 'Avisos y música en 100 V: colegio, oficina, nave': ['Announcements and music on 100 V: school, office, warehouse', 'Avisos i música en 100 V: escola, oficina, nau'], 'Reuniones, formación, aulas': ['Meetings, training, classrooms', 'Reunions, formació, aules'], 'Presentaciones: voz y música con subgraves': ['Presentations: speech and music with subwoofers', 'Presentacions: veu i música amb subgreus'],
  'Micrófonos': ['Microphones', 'Micròfons'], 'De mano': ['Handheld', 'De mà'], 'De cuerpo': ['Body-worn', 'De cos'], 'Sobremesa': ['Tabletop', 'Sobretaula'], 'Solapa': ['Lavalier', 'Solapa'], 'Diadema': ['Headset', 'Diadema'],
  'Proyecto': ['Project', 'Projecte'], 'Pantalla delante': ['Screen at front', 'Pantalla davant'], 'Falso techo': ['Drop ceiling', 'Fals sostre'], 'Red Dante': ['Dante network', 'Xarxa Dante'], 'Montaje y acabado': ['Mounting and finish', 'Muntatge i acabat'],
  'Evacuación EN 54': ['EN 54 voice alarm', 'Evacuació EN 54'], 'Reverberante': ['Reverberant', 'Reverberant'], 'Que no se vea': ['Hidden', 'Que no es vegi'],
  'Sí': ['Yes', 'Sí'], 'No': ['No', 'No'],
  'Plano de la sala': ['Room plan', 'Planta de la sala'], 'Principales': ['Mains', 'Principals'], 'Retardos': ['Delays', 'Retards'], 'Altavoces': ['Loudspeakers', 'Altaveus'], 'Subgraves': ['Subwoofers', 'Subgreus'],
  'Electrónica': ['Electronics', 'Electrònica'], 'Control': ['Control', 'Control'], 'Accesorios': ['Accessories', 'Accessoris'], 'Superficie': ['Area', 'Superfície'], 'Potencia': ['Power', 'Potència'],
  'Sin micrófonos': ['No microphones', 'Sense micròfons'], '1 de mano': ['1 handheld', '1 de mà'], '2 de mano': ['2 handheld', '2 de mà'], 'Mano + solapa': ['Handheld + lavalier', 'Mà + solapa'],
  '2 de sobremesa': ['2 tabletop', '2 de sobretaula'], 'personas': ['people', 'persones'],
  '¿Cuánto mide la sala?': ['How big is the room?', 'Quant fa la sala?'], '¿Para qué es el sonido?': ['What is the sound for?', 'Per a què és el so?'], '¿Dónde van los altavoces?': ['Where do the loudspeakers go?', 'On van els altaveus?'],
  'La pared rinde más': ['The wall performs better', 'La paret rendeix més'], 'Cuando la arquitectura no deja': ['When the architecture does not allow it', 'Quan l\'arquitectura no ho permet'],
  '¿Qué micrófonos?': ['Which microphones?', 'Quins micròfons?'], '¿Lleva evacuación por voz (EN 54)?': ['Is there an EN 54 voice alarm?', 'Porta evacuació per veu (EN 54)?'],
  'Sistema certificado completo': ['Complete certified system', 'Sistema certificat complet'], 'Sonido normal': ['Standard sound', 'So normal'],
  'Hay solución': ['There is a solution', 'Hi ha solució'], 'Hay solución, con avisos': ['There is a solution, with warnings', 'Hi ha solució, amb avisos'],
  'Recomendado': ['Recommended', 'Recomanat'], 'En stock': ['In stock', 'En estoc'], 'consultar': ['enquire', 'consultar'],
  'Etapas': ['Amplifiers', 'Etapes'], 'canales': ['channels', 'canals'], 'retardo ≈ {t} ms': ['delay ≈ {t} ms', 'retard ≈ {t} ms'], 'fila a {d} m': ['row at {d} m', 'fila a {d} m'],
  'cada altavoz en su canal': ['each loudspeaker on its own channel', 'cada altaveu al seu canal'], 'línea de 100 V': ['100 V line', 'línia de 100 V'], 'por zona': ['per zone', 'per zona'],
  /* avisos */
  'Retardos cada {c} m a partir de los {d} m: unos 3 ms por metro de distancia a los principales, cada altavoz en su canal; se ajustan en la sala.': ['Delays every {c} m beyond {d} m: about 3 ms per metre of distance to the mains, each loudspeaker on its own channel; fine-tune them in the room.', 'Retards cada {c} m a partir dels {d} m: uns 3 ms per metre de distància als principals, cada altaveu al seu canal; s\'ajusten a la sala.'],
  'Los Compact M 05 a 12 no traen soporte: va añadido en la lista.': ['Compact M 05 to 12 come without a bracket: it is added to the list.', 'Els Compact M 05 a 12 no porten suport: s\'hi ha afegit a la llista.'],
  'Las etapas KPS no dan phantom: los micrófonos de condensador entran por el mezclador PR 4093.': ['KPS amplifiers do not provide phantom power: condenser microphones go through the PR 4093 mixer.', 'Les etapes KPS no donen phantom: els micròfons de condensador entren pel mesclador PR 4093.'],
  'Más micrófonos de los que conviene llevar a la etapa: mezclador PR 4093 delante.': ['More microphones than the amplifier should take: PR 4093 mixer in front.', 'Més micròfons dels que convé portar a l\'etapa: mesclador PR 4093 al davant.'],
  'En falso techo modular, los CMR montan con TILE-BRIDGE (kits de 4): añadidos.': ['In a modular suspended ceiling, CMR speakers mount with TILE-BRIDGE (kits of 4): added.', 'En fals sostre modular, els CMR munten amb TILE-BRIDGE (kits de 4): afegits.'],
  'Cada flexo va con su base MAT: sin base no se puede usar (son 2 líneas).': ['Each gooseneck goes with its MAT base: it cannot be used without it (2 lines).', 'Cada flexo va amb la seva base MAT: sense base no es pot fer servir (són 2 línies).'],
  'Con micrófonos en la sala, MR no: hace falta un altavoz con respuesta lineal (WMR o Compact M) para aguantar el volumen antes del acople.': ['With microphones in the room, not MR: a loudspeaker with a flat response (WMR or Compact M) is needed to hold level before feedback.', 'Amb micròfons a la sala, MR no: cal un altaveu amb resposta lineal (WMR o Compact M) per aguantar el volum abans de l\'acoblament.'],
  'Evacuación por voz: la cadena entera ha de ser certificada (amplificadores EN 54-16 y altavoces EN 54-24) y con un proyecto de evacuación firmado.': ['Voice alarm: the whole chain must be certified (EN 54-16 amplifiers and EN 54-24 loudspeakers) with a signed evacuation design.', 'Evacuació per veu: tota la cadena ha de ser certificada (amplificadors EN 54-16 i altaveus EN 54-24) i amb un projecte d\'evacuació signat.'],
  'Sala muy reverberante: un procesador no lo arregla. Antes del equipo, un estudio de tratamiento acústico (EZ ACOUSTICS, consultar).': ['Very reverberant room: a processor will not fix it. Before the equipment, an acoustic treatment study (EZ ACOUSTICS, enquire).', 'Sala molt reverberant: un processador no ho arregla. Abans de l\'equip, un estudi de tractament acústic (EZ ACOUSTICS, consultar).'],
  'Sala grande y reverberante: columnas VSA de haz orientable, que dirigen la voz al público.': ['Large, reverberant room: VSA steerable-beam columns that aim speech at the audience.', 'Sala gran i reverberant: columnes VSA de feix orientable, que dirigeixen la veu al públic.'],
  'Si el altavoz no se ha de ver, ha de ir a medida o todo por cable de red: FOHHN (beam steering y PoE + Dante), solo por proyecto: consultar.': ['If the loudspeaker must not be seen, must be custom-made or everything over network cable: FOHHN (beam steering and PoE + Dante), project-only: enquire.', 'Si l\'altaveu no s\'ha de veure, ha d\'anar a mida o tot per cable de xarxa: FOHHN (beam steering i PoE + Dante), només per projecte: consultar.'],
  'Techo de más de {h} m: altavoces colgantes PMR bajados a unos 3 m.': ['Ceiling higher than {h} m: PMR pendant loudspeakers lowered to about 3 m.', 'Sostre de més de {h} m: altaveus penjants PMR baixats a uns 3 m.'],
  'Potencia de la línea de 100 V = suma de las tomas de los altavoces + {m} %.': ['100 V line power = sum of the loudspeaker taps + {m} %.', 'Potència de la línia de 100 V = suma de les preses dels altaveus + {m} %.'],
  'A partir de {n} micrófonos inalámbricos UHF: estudio de RF, distribuidor y antenas activas (añadidos).': ['From {n} UHF wireless microphones: RF study, distributor and active antennas (added).', 'A partir de {n} micròfons sense fil UHF: estudi de RF, distribuïdor i antenes actives (afegits).'],
  'Con más de {n} puestos de palabra, mejor un sistema de conferencias (RCF Forum 3000, hasta 80 pupitres).': ['With more than {n} speaking positions, a conference system is better (RCF Forum 3000, up to 80 units).', 'Amb més de {n} llocs de paraula, millor un sistema de conferències (RCF Forum 3000, fins a 80 pupitres).'],
  'Sistema grande: valora un procesador DX 1616 con etapas IPS en lugar de las KPS.': ['Large system: consider a DX 1616 processor with IPS amplifiers instead of KPS.', 'Sistema gran: valora un processador DX 1616 amb etapes IPS en lloc de les KPS.'],
  'Con red Dante, la etapa principal en versión D.': ['With a Dante network, the main amplifier in its D version.', 'Amb xarxa Dante, l\'etapa principal en versió D.'],
  'Orientativo: los tamaños de sala y las combinaciones de subgraves son de partida. Valida el diseño antes de presupuestar.': ['Indicative: room sizes and subwoofer pairings are a starting point. Validate the design before quoting.', 'Orientatiu: les mides de sala i les combinacions de subgreus són de partida. Valida el disseny abans de pressupostar.'],
  'Más zonas de las que admite el sistema ZM 2000 (54): repartir en varios sistemas.': ['More zones than the ZM 2000 system supports (54): split into several systems.', 'Més zones de les que admet el sistema ZM 2000 (54): repartir en diversos sistemes.'],
  'La central ZM 2124 da 240 W: para más potencia, etapas UP de apoyo.': ['The ZM 2124 unit gives 240 W: for more power, add UP amplifiers.', 'La central ZM 2124 dona 240 W: per a més potència, etapes UP de suport.'],
  'Ningún altavoz de la lista para este caso.': ['No loudspeaker in the list for this case.', 'Cap altaveu de la llista per a aquest cas.'],
  /* v3.1 */
  'Económico': ['Budget', 'Econòmic'], 'Junto a la pantalla': ['Next to the screen', 'Al costat de la pantalla'],
  'Económico: una pareja de altavoces junto a la pantalla, sin retardos ni subgraves, para una sala de poco uso.': ['Budget: a pair of loudspeakers next to the screen, with no delays or subwoofers, for a room that is seldom used.', 'Econòmic: una parella d\'altaveus al costat de la pantalla, sense retards ni subgreus, per a una sala de poc ús.'],
  'Con la sala llena, al fondo (a partir de unos {d} m) se oirá algo más bajo; si hace falta, se amplía con una pareja de retardo.': ['With the room full, the back (beyond about {d} m) will sound a little quieter; if needed, add a pair of delay speakers.', 'Amb la sala plena, al fons (a partir d\'uns {d} m) se sentirà una mica més baix; si cal, s\'amplia amb una parella de retard.'],
});
const DEF = { ancho: 10, fondo: 16, alto: 3, zonas: 1, uso: 'evento', montaje: 'pared', color: 'negro', mano: 1, cuerpo: 1, tipoC: 'solapa', mesa: 0, pantalla: true, falso: false, dante: true, en54: false, reverb: false, discreto: false, eco: false };
let S = Object.assign({}, DEF, lee('systems_sonido') || {});
const NUMS = { ancho: [2, 80, 1], fondo: [2, 120, 1], alto: [2, 25, 1], zonas: [1, 54, 0], mano: [0, 16, 0], cuerpo: [0, 16, 0], mesa: [0, 40, 0] };
const BOOL = ['pantalla', 'falso', 'dante', 'en54', 'reverb', 'discreto', 'eco'];   /* v3.1 · ECONÓMICO: sala de poco uso y presupuesto ajustado */
const USOS = [['musica', 'Música de fondo', 'Hilo musical, tiendas, restaurantes', 'onda'], ['avisos', 'Megafonía', 'Avisos y música en 100 V: colegio, oficina, nave', 'altavoz'], ['sala', 'Sala con micros', 'Reuniones, formación, aulas', 'micro'], ['evento', 'Eventos', 'Presentaciones: voz y música con subgraves', 'personas']];
const nomUso = (u) => (USOS.find((x) => x[0] === u) || USOS[2])[1];
const RAD = Math.PI / 180;   /* v2.1 · los valores de partida del cálculo salen de BRIAN (panel ADMIN), con estos de fábrica si no llega */

/* busca un equipo de las listas por su referencia (con la variante blanca si la hay) */
const TODO = () => equipos(['altavoz', 'subgrave', 'etapa', 'procesador-audio', 'microfono', 'control', 'accesorio', 'soporte', 'receptor', 'transmisor', 'antena', 'cargador', 'kit-audio', 'conferencia']);
let IDX = null, IDXn = -1;
function ref(id) { const t = TODO(); if (!IDX || IDXn !== t.length) { IDX = {}; t.forEach((x) => { IDX[x.id] = x; }); IDXn = t.length; } return IDX[id] || null; }
function col(id) { if (S.color !== 'blanco') return ref(id) || ref(id.replace(/-W$/, ''));
  for (const k of [id + '-W', id.replace(/-B$/, '-W'), id.replace(/-BLACK$/, '-W')]) { const x = ref(k); if (x) return x; } return ref(id); }
const negro = (id) => S.color === 'blanco' ? (ref(id.replace(/-B$/, '-W')) || ref(id)) : ref(id);

function calcula() {
  const av = [], L = [], r = { av, L, mains: [], delays: [], subs: [], techo: null, mic: 0 };
  const add = (g, x, n, nota = '') => { if (!x || n <= 0) return null; const o = L.find((y) => y.x.id === x.id && y.g === g); if (o) { o.n += n; return o; } const y = { g, x, n, nota }; L.push(y); return y; };
  const A = S.ancho, F = S.fondo, H = S.alto; r.area = A * F;
  const C = P('sonido.c', 343), ANG = P('sonido.anguloTecho', 90), OIDO = P('sonido.oido', 1.2), HCOL = P('sonido.alturaColgante', 6), MARGEN = P('sonido.margen100V', 20);
  const mics = S.mano + S.cuerpo + S.mesa; r.mic = 0;
  let uso = S.uso;
  if (uso === 'musica' && mics > 0) { uso = 'sala'; av.push(['', T('Con micrófonos en la sala, MR no: hace falta un altavoz con respuesta lineal (WMR o Compact M) para aguantar el volumen antes del acople.')]); }
  r.uso = uso;
  /* --- altavoces en techo: malla con solape mínimo (cobertura a 90°, oído a 1,2 m) --- */
  const malla = (ang = ANG, oido = OIDO, borde = false) => { const D = 2 * Math.max(0.6, Math.min(H, HCOL) - oido) * Math.tan(ang / 2 * RAD), s = borde ? D : D / Math.SQRT2;
    const nx = Math.max(1, Math.ceil(A / s)), ny = Math.max(1, Math.ceil(F / s)); r.techo = { nx, ny, D }; return nx * ny; };
  const cuelga = H > HCOL;
  let W100 = 0;   // suma de tomas en 100 V
  if (S.en54) {
    /* evacuación por voz: altavoces EN 54-24 y amplificadores EN 54-16 */
    const x = S.montaje === 'techo' ? ref('MF-33-EN') : ref('WMF-33EN');
    const n = S.montaje === 'techo' ? malla(120, 1.6, true) : Math.max(2, Math.ceil(r.area / 40));
    if (x) { add('Altavoces', x, n, '10 W · ' + T('línea de 100 V')); r.mains = Array(n).fill(x); W100 = n * 10; }
    amp100(true);
    av.push(['', T('Evacuación por voz: la cadena entera ha de ser certificada (amplificadores EN 54-16 y altavoces EN 54-24) y con un proyecto de evacuación firmado.')]);
  } else if (uso === 'musica' || uso === 'avisos') {
    let x, n, tap;
    if (S.montaje === 'techo' && cuelga) { x = col('PMR-60T-B'); n = malla(); tap = 20; av.push(['info', T('Techo de más de {h} m: altavoces colgantes PMR bajados a unos 3 m.', { h: N(HCOL, 1) })]); }
    else if (S.montaje === 'techo') { x = uso === 'musica' ? ref('CMR-60T-W') : (S.color === 'blanco' ? ref('PL-6X') : ref('PL-6X-B')); n = malla(ANG, OIDO, uso === 'avisos'); tap = uso === 'musica' ? 10 : 6; }
    else if (uso === 'musica') { x = col('MR-50T'); n = Math.max(1, Math.ceil(r.area / P('sonido.mrM2', 50))); tap = 15; }   // parejas
    else { x = S.color === 'blanco' ? ref('DM-61') : ref('MQ-80P-B'); n = Math.max(2, Math.ceil(r.area / P('sonido.paredM2', 45))); tap = 10; }
    if (x) { add('Altavoces', x, n, tap + ' W · ' + T('línea de 100 V')); r.mains = Array(n).fill(x); W100 = n * tap * (x.pareja ? 2 : 1); }
    else av.push(['', T('Ningún altavoz de la lista para este caso.')]);
    if (x && /^CMR-/.test(x.id) && S.falso) { add('Accesorios', ref('TILE-BRIDGE-4X-CMR'), Math.ceil(n / 4)); av.push(['info', T('En falso techo modular, los CMR montan con TILE-BRIDGE (kits de 4): añadidos.')]); }
    if (uso === 'musica') musica(); else amp100(false);
  } else {
    /* sala con micrófonos o eventos: KPS, cada altavoz en su canal */
    let ch = 0, wMax = 0;
    const vsa = S.reverb && (r.area > P('sonido.vsaArea', 150) || H > HCOL) && S.montaje === 'pared';
    if (vsa) {
      const id = F <= 15 ? 'VSA-850-II' : F <= 25 ? 'VSA-1250-II' : 'VSA-2050-II', x = S.color === 'blanco' ? ref(id) : ref(id + '-B');
      add('Altavoces', x, 2); r.mains = [x, x];
      av.push(['info', T('Sala grande y reverberante: columnas VSA de haz orientable, que dirigen la voz al público.')]);
    } else if (S.eco && S.montaje === 'pared') {
      /* v3.1 · ECONÓMICO (sala de poco uso, presupuesto ajustado): una pareja junto a la pantalla, sin retardos ni subgraves.
         Sin micrófonos y sala corta, MR 50 (económico, solo para sonido de reproducción); si no, WMR 60T. Sin micrófonos, un DMA 82
         (2 × 80 W con DSP y los presets del fabricante para MR y WMR); con micrófonos, una KPS de 2 canales */
      const lejos = F > P('sonido.ecoMRhasta', 8), x = (!mics && !lejos) ? col('MR-50') : col('WMR-60T');
      if (x) { add('Altavoces', x, x.pareja ? 1 : 2, T('Junto a la pantalla')); r.mains = [x, x]; wMax = Math.max(wMax, x.w || 0); }
      if (mics) ch += 2; else add('Electrónica', ref('DMA-82'), 1, '2 × 80 W');
      av.push(['info', T('Económico: una pareja de altavoces junto a la pantalla, sin retardos ni subgraves, para una sala de poco uso.')]);
      if (F > P('sonido.retardoDesde', 6) + 2) av.push(['info', T('Con la sala llena, al fondo (a partir de unos {d} m) se oirá algo más bajo; si hace falta, se amplía con una pareja de retardo.', { d: N(P('sonido.retardoDesde', 6) + 2, 0) })]);
    } else if (S.montaje === 'techo') {
      const x = cuelga ? col('PMR-60T-B') : ref('CMR-60T-W'), n = malla();
      /* en techo, los altavoces van en paralelo en línea de 100 V: un canal por zona (mínimo 2), 10 W por toma */
      if (x) { add('Altavoces', x, n, '10 W · ' + T('línea de 100 V')); r.mains = Array(n).fill(x); ch += Math.max(2, S.zonas); wMax = Math.max(wMax, n * 10 * (1 + MARGEN / 100) / Math.max(2, S.zonas) > 160 ? 300 : 0); }
      if (cuelga) av.push(['info', T('Techo de más de {h} m: altavoces colgantes PMR bajados a unos 3 m.', { h: N(HCOL, 1) })]);
      if (x && /^CMR-/.test(x.id) && S.falso) { add('Accesorios', ref('TILE-BRIDGE-4X-CMR'), Math.ceil(n / 4)); av.push(['info', T('En falso techo modular, los CMR montan con TILE-BRIDGE (kits de 4): añadidos.')]); }
      if (uso === 'evento' && x && /^CMR-/.test(x.id)) { const s = ref('CMR-S-60T-W'), k = Math.max(1, Math.floor(n / 2)); add('Subgraves', s, k); r.subs = Array(k).fill(s); }
    } else {
      /* principales en pared: columnas a los lados de la pantalla, o pareja por alcance */
      const alc = Math.min(F, P('sonido.retardoDesde', 6)), cada = Math.max(1, P('sonido.retardoCada', 4));
      let x;
      if (S.pantalla) x = col('L-2406T');
      else if (uso === 'sala') x = col('WMR-60T');
      else { const d = Math.min(F, 18); x = col(d <= 8 ? 'COMPACT-M-06' : d <= 12 ? 'COMPACT-M-08' : d <= 16 ? 'COMPACT-M-10' : 'COMPACT-M-12'); }
      if (x) { add('Altavoces', x, 2, T('Principales')); r.mains = [x, x]; ch += 2; wMax = Math.max(wMax, x.w || 0); }
      /* retardos: una fila cada 4 m a partir de los 6 m, cada altavoz en su canal */
      const filas = F > alc ? Math.ceil((F - alc) / cada) : 0;
      if (filas) {
        const d = col('COMPACT-M-04'), porFila = Math.max(2, Math.ceil(A / Math.max(1, P('sonido.retardoAncho', 8))));
        for (let i = 0; i < filas; i++) { const y = F * (i + 1) / (filas + 1), ms = Math.round(y / C * 1000); r.delays.push({ y, ms, n: porFila, x: d }); }
        if (d) { add('Altavoces', d, filas * porFila, T('Retardos') + ' · ' + r.delays.map((q) => T('retardo ≈ {t} ms', { t: q.ms })).join(' / ')); ch += filas * porFila; wMax = Math.max(wMax, d.w || 0); }
        av.push(['info', T('Retardos cada {c} m a partir de los {d} m: unos 3 ms por metro de distancia a los principales, cada altavoz en su canal; se ajustan en la sala.', { c: N(cada, 1), d: N(alc, 1) })]);
      }
      /* subgraves en eventos: 1 por pareja de cajas, el que combina con el principal */
      if (uso === 'evento' && x) {
        const base = x.id.replace(/-W$/, ''), s = equipos('subgrave', 'RCF').filter((q) => (q.combina || []).includes(base) && q.activo !== false)[0];
        if (s) { add('Subgraves', s, 2); r.subs = [s, s]; }
      }
      /* soportes de los Compact M 05 a 12 */
      L.filter((q) => q.x.familia === 'COMPACT M' && q.x.soporteIncl === false).forEach((q) => { const sp = ref((q.x.soportes || [])[0]); add('Accesorios', sp, q.n); });
      if (L.some((q) => q.x.familia === 'COMPACT M' && q.x.soporteIncl === false)) av.push(['info', T('Los Compact M 05 a 12 no traen soporte: va añadido en la lista.')]);
    }
    /* etapas KPS: 16x hasta 200 W por caja; 80x por encima. La primera, en D si hay red Dante */
    if (ch) {
      const g = wMax > P('sonido.kps16Max', 200) ? '80' : '16'; let resto = ch, prim = true;
      while (resto > 0) { const c = resto > 4 ? 8 : resto > 2 ? 4 : 2; const id = 'KPS-' + g + c + (prim && S.dante ? 'D' : ''); add('Electrónica', ref(id), 1, c + ' ' + T('canales')); resto -= c; prim = false; }
      if (S.dante) av.push(['info', T('Con red Dante, la etapa principal en versión D.')]);
    }
    if (r.subs.length && !/CMR/.test(r.subs[0].id)) { const w = r.subs[0].w || 400; add('Electrónica', ref(w > 160 ? 'KPS-802' : 'KPS-162'), Math.ceil(r.subs.length / 2), T('Subgraves')); }
    if (ch || r.subs.length) add('Control', col('RC-KPS-B'), 1);
    if (r.area > P('sonido.dxIpsArea', 400) && uso === 'evento') av.push(['info', T('Sistema grande: valora un procesador DX 1616 con etapas IPS en lugar de las KPS.')]);
    micros(vsa || ch > 0);
  }
  if (S.reverb) av.push(['', T('Sala muy reverberante: un procesador no lo arregla. Antes del equipo, un estudio de tratamiento acústico (EZ ACOUSTICS, consultar).')]);
  if (S.discreto) av.push(['info', T('Si el altavoz no se ha de ver, ha de ir a medida o todo por cable de red: FOHHN (beam steering y PoE + Dante), solo por proyecto: consultar.')]);
  av.push(['info', T('Orientativo: los tamaños de sala y las combinaciones de subgraves son de partida. Valida el diseño antes de presupuestar.')]);

  /* --- amplificación en 100 V (avisos y evacuación) --- */
  function amp100(en54) {
    const need = Math.ceil(W100 * (1 + MARGEN / 100)); r.W = need; av.push(['info', T('Potencia de la línea de 100 V = suma de las tomas de los altavoces + {m} %.', { m: N(MARGEN, 0) })]);
    if (en54) {
      const z = S.zonas, porZ = need / z;
      const id = z >= 4 || porZ <= 125 ? 'UP-8504' : z >= 2 || porZ <= 250 ? 'UP-8502' : 'UP-8501', x = ref(id), cz = x ? x.canales : 1, wc = x ? x.w : 500;
      const k = Math.max(Math.ceil(z / cz), Math.ceil(need / (cz * wc))); add('Electrónica', x, k, S.zonas + ' ' + T('Zonas')); return;
    }
    if (S.zonas > 1) {
      if (S.zonas > 54) av.push(['', T('Más zonas de las que admite el sistema ZM 2000 (54): repartir en varios sistemas.')]);
      const z = Math.min(54, S.zonas);
      add('Electrónica', ref('ZM-2124'), 1, '6 ' + T('Zonas') + ' · 240 W'); if (z > 6) add('Electrónica', ref('ZE-2200'), Math.min(8, Math.ceil((z - 6) / 6)), '+6 ' + T('Zonas'));
      add('Micrófonos', ref('BM-2006'), 1); if (z > 6) add('Control', ref('BE-2012'), Math.min(4, Math.ceil((z - 6) / 12)));
      if (need > 240) { av.push(['', T('La central ZM 2124 da 240 W: para más potencia, etapas UP de apoyo.')]); add('Electrónica', ref('UP-8501'), Math.ceil((need - 240) / 500)); }
      return;
    }
    const id = need <= 80 ? 'AM-2080' : need <= 160 ? 'AM-2160' : need <= 320 ? 'AM-2320' : 'UP-8501', x = ref(id);
    add('Electrónica', x, id === 'UP-8501' ? Math.ceil(need / 500) : 1, need + ' W');
    if (id === 'UP-8501') add('Electrónica', ref('PR-4093'), 1);
    add('Micrófonos', ref('BM-3001'), 1);
  }
  /* --- hilo musical: DMA, mando por zona --- */
  function musica() {
    const z = S.zonas, porZ = W100 / z; r.W = Math.ceil(W100 * (1 + MARGEN / 100));
    const main = ref(porZ <= 80 && z <= 2 ? 'DMA-82' : 'DMA-162'); add('Electrónica', main, 1, Math.min(2, z) + ' ' + T('Zonas'));
    if (z > 2) add('Electrónica', ref('DMA-162P'), Math.ceil((z - 2) / 2), T('por zona'));
    add('Control', col('RC-401-EU-B'), z, T('por zona'));
  }
  /* --- micrófonos (SENNHEISER; avisos y conferencias, RCF) --- */
  function micros(kps) {
    r.mic = mics; const corp = uso === 'sala';   // corporativo y educación: SpeechLine (DECT, sin coordinar frecuencias)
    let uhf = 0, dect = 0, cond = 0;
    if (S.mano) { if (corp) { add('Micrófonos', ref('SL-HANDHELD-SET'), S.mano); dect += S.mano; }
      else if (S.mano >= 4) { add('Micrófonos', ref('EW-DX-835-Q1-9'), Math.ceil(S.mano / 2)); uhf += S.mano; }
      else { add('Micrófonos', ref('EW-D-835-SET-Q1-6'), S.mano); uhf += S.mano; } }
    if (S.cuerpo) { const dia = S.tipoC === 'diadema';
      if (corp) { add('Micrófonos', ref(dia ? 'SL-HEADMIC-SET' : 'SL-DW-3-LAVALIER-SET'), S.cuerpo); dect += S.cuerpo; }
      else if (S.cuerpo >= 4 && !dia) { add('Micrófonos', ref('EW-DX-MKE-2-Q1-9'), Math.ceil(S.cuerpo / 2)); uhf += S.cuerpo; }
      else { add('Micrófonos', ref(dia ? 'EW-D-ME3-SET-Q1-6' : 'EW-D-ME2-SET-Q1-6'), S.cuerpo); uhf += S.cuerpo; } }
    if (S.mesa) { add('Micrófonos', ref('MEG-14-40-B'), S.mesa); add('Accesorios', ref('MAT-133-S-B'), S.mesa); cond += S.mesa;
      av.push(['info', T('Cada flexo va con su base MAT: sin base no se puede usar (son 2 líneas).')]);
      if (S.mesa > P('sonido.conferenciaMas', 8)) av.push(['info', T('Con más de {n} puestos de palabra, mejor un sistema de conferencias (RCF Forum 3000, hasta 80 pupitres).', { n: P('sonido.conferenciaMas', 8) })]); }
    if (uhf >= P('sonido.rfUhf', 4)) { add('Accesorios', ref('EDW-ASA'), 1); add('Accesorios', ref('EW-D-AB-Q'), 2); av.push(['info', T('A partir de {n} micrófonos inalámbricos UHF: estudio de RF, distribuidor y antenas activas (añadidos).', { n: P('sonido.rfUhf', 4) })]); }
    if (dect >= 3) add('Accesorios', ref('AWM-4'), 1);
    if (uhf) add('Accesorios', ref('EW-D-CHARGING-SET'), Math.ceil(uhf / 2));
    if (dect) add('Accesorios', ref('CHG-4N'), Math.ceil(dect / 4));
    if (kps && (cond || mics > P('sonido.pr4093Mas', 4))) { add('Electrónica', ref('PR-4093'), Math.ceil(mics / 6));
      av.push(['info', T(cond ? 'Las etapas KPS no dan phantom: los micrófonos de condensador entran por el mezclador PR 4093.' : 'Más micrófonos de los que conviene llevar a la etapa: mezclador PR 4093 delante.')]); }
  }

  /* --- resumen --- */
  const nAlt = L.filter((q) => q.g === 'Altavoces').reduce((s, q) => s + q.n * (q.x.pareja ? 2 : 1), 0), nSub = L.filter((q) => q.g === 'Subgraves').reduce((s, q) => s + q.n, 0);
  const el = L.filter((q) => q.g === 'Electrónica'); r.nAlt = nAlt; r.nSub = nSub; r.elec = el;
  r.sem = av.some((a) => !a[0]) ? 'A' : 'V'; r.semTxt = r.sem === 'A' ? T('Hay solución, con avisos') : T('Hay solución');
  r.lineaTxt = [L.filter((q) => q.g === 'Altavoces').map((q) => q.n + ' × ' + q.x.modelo).join(' + '), nSub ? nSub + ' × ' + r.subs[0].modelo : '', el.map((q) => (q.n > 1 ? q.n + ' × ' : '') + q.x.modelo).join(' + '), r.mic ? r.mic + ' ' + T('Micrófonos').toLowerCase() : ''].filter(Boolean).join(' · ');
  r.linea = esc(r.lineaTxt).replace(/^([^·]+)/, '<b>$1</b>') || esc(T('Ningún altavoz de la lista para este caso.'));
  guarda('systems_sonido', S); return r;
}



/* v2.5 · simulación 3D de la sala (vista/sim3d.js): altavoces con su cobertura, retardos con su tiempo, subgraves, pantalla y público */
function escena3d(V, r) {
  const A = S.ancho, F = S.fondo, H = S.alto, OIDO = P('sonido.oido', 1.2), HCOL = P('sonido.alturaColgante', 6);
  V.sala(A, F, H);
  if (S.pantalla) V.pantalla(A * 0.4, Math.min(H - 1.2, A * 0.4 * 9 / 16), 0, 1.0, 0, '');
  const alt = (x, y, z, c) => V.caja(0.22, 0.34, 0.2, x, y, z, 0x1b1b1e, { metal: 0.6 }) && V.caja(0.2, 0.3, 0.01, x, y, z + 0.105, c, { emis: 0.25 });
  if (r.techo && r.techo.nx && S.montaje === 'techo') {
    const { nx, ny, D } = r.techo, h = Math.min(H, HCOL), ang = 2 * Math.atan((D / 2) / Math.max(0.3, h - OIDO)) * 180 / Math.PI;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const x = -A / 2 + (i + .5) * A / nx, z = (j + .5) * F / ny; V.caja(0.25, 0.08, 0.25, x, h - 0.04, z, 0x00b4ff, { emis: 0.3 }); if (nx * ny <= 40) V.cono([x, h - 0.08, z], [x, OIDO, z], ang, 0x00b4ff, 0.07); }
  } else if (r.mains.length) {
    const h = Math.max(2.2, Math.min(H - 0.3, Math.max(P('sonido.alturaPrincipalMin', 2.5), F / P('sonido.alturaPrincipalFondo', 6)))), hasta = r.delays.length ? r.delays[0].y : F;
    [-1, 1].forEach((sx) => { const x = sx * A * 0.38; alt(x, h, 0.15, 0x00b4ff); V.cono([x, h, 0.3], [x * 0.4, OIDO, Math.min(F, hasta + 1)], 60, 0x00b4ff, 0.09); });
    V.etiqueta(r.mains[0].modelo, -A * 0.38, h + 0.45, 0.2, 0.3);
  }
  const hR = Math.max(2.2, Math.min(H - 0.3, P('sonido.alturaRetardos', 3)));
  r.delays.forEach((d, k) => { const hasta = (r.delays[k + 1] || {}).y || F;
    for (let i = 0; i < d.n; i++) { const x = -A / 2 + (i + .5) * A / d.n; alt(x, hR, d.y, 0xffb000); V.cono([x, hR, d.y + 0.15], [x * 0.9, OIDO, Math.min(F, hasta + 1)], 60, 0xffb000, 0.07); }
    V.etiqueta(d.ms + ' ms', A / 2 - 0.6, hR + 0.45, d.y, 0.3, '#ffb000'); });
  if (r.subs.length && !/CMR/.test(r.subs[0].id)) [-1, 1].forEach((sx) => V.caja(0.5, 0.5, 0.55, sx * A * 0.3, 0.25, 0.4, 0xb566ff, { metal: 0.3 }));
  const paso = Math.max(1.6, Math.min(A, F) / 5); for (let z = 2; z < F - 0.5; z += paso) for (let x = -A / 2 + 1; x < A / 2 - 0.5; x += paso) V.persona(x, z, Math.PI, 0.55);
}
/* v2.3 · vista LATERAL como las de SCREENS: altura de los altavoces, el plano del oído, la cobertura hasta el público y los retardos con su tiempo */
let VT = 'planta';
function lateral(r, o = {}) {
  const mov = !!o.vertical, VW = mov ? 480 : 960, VH = 520, F = S.fondo, H = S.alto, OIDO = P('sonido.oido', 1.2), HCOL = P('sonido.alturaColgante', 6);
  const E = escala(VW, VH, { l: 62, r: 70, t: 70, b: 46 + 26 * r.delays.length }, -0.5, F + 0.3, 0, H + 0.3), { X, Y, k } = E;
  let g = suelo(X, Y, -0.5, F + 0.3) + techo(X, Y, 0, F, H) + `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(H)}" stroke="${COL.pared}" stroke-width="4"/><line x1="${X(F)}" y1="${Y(0)}" x2="${X(F)}" y2="${Y(H)}" stroke="${COL.linea}" stroke-width="2"/>`;
  g += `<line x1="${X(0)}" y1="${Y(OIDO)}" x2="${X(F)}" y2="${Y(OIDO)}" stroke="${COL.lente}" stroke-opacity=".45" stroke-dasharray="3 6"/>` + etiqueta(X(0) + 10, Y(OIDO) + 22, T('oído') + ' ' + fmt(OIDO), 'start', 'vt-ver');
  const caja = (x, y, c) => `<rect x="${X(x) - 9}" y="${Y(y) - 12}" width="18" height="24" rx="3" fill="${COL.equipo}" stroke="${c}" stroke-width="2"/>`;
  const haz = (x, y, x1, x2, c) => `<path d="M${X(x)} ${Y(y)} L${X(x2)} ${Y(OIDO)} L${X(x1)} ${Y(OIDO)} Z" fill="${c}" fill-opacity=".14" stroke="${c}" stroke-opacity=".5"/>`;
  const filas = r.delays.map((d) => d.y);
  if (r.techo && r.techo.nx && S.montaje === 'techo') {
    const h = Math.min(H, HCOL), ny = r.techo.ny, D = r.techo.D;
    for (let j = 0; j < ny; j++) { const x = (j + .5) * F / ny; g += haz(x, h, Math.max(0, x - D / 2), Math.min(F, x + D / 2), COL.rangoB) + caja(x, h, COL.rangoB); }
    g += cota(X(F) + 16, Y(0), X(F) + 16, Y(h), fmt(h), 1);
  } else if (r.mains.length) {
    const h = Math.max(2.2, Math.min(H - 0.3, Math.max(P('sonido.alturaPrincipalMin', 2.5), F / P('sonido.alturaPrincipalFondo', 6)))), hasta = filas.length ? filas[0] : F;
    g += haz(0.15, h, 1.5, Math.min(F, hasta + 1), COL.rangoB) + caja(0.15, h, COL.rangoB) + etiqueta(X(0.15) + 16, Y(h) - 14, r.mains[0].modelo, 'start', 'vt-azu');
    g += cota(X(0) - 16, Y(0), X(0) - 16, Y(h), fmt(h));
  }
  r.delays.forEach((d, i) => { const h = Math.max(2.2, Math.min(H - 0.3, P('sonido.alturaRetardos', 3))), hasta = filas[i + 1] || F;
    g += haz(d.y, h, d.y + 0.5, Math.min(F, hasta + 1), COL.retardo) + caja(d.y, h, COL.retardo) + etiqueta(X(d.y), Y(h) - 20, d.ms + ' ms', 'middle', 'vt-amb');
    g += cota(X(0), Y(0) + 22 + i * 26, X(d.y), Y(0) + 22 + i * 26, fmt(d.y) + ' m', 1); });
  for (let x = 2; x < F - 0.4; x += Math.max(2, F / 6)) g += persona(X, Y, x, k, 0.45);
  g += cota(X(0), Y(H) - 46, X(F), Y(H) - 46, fmt(F) + ' m') + cota(X(F) + 44, Y(0), X(F) + 44, Y(H), fmt(H), 1);
  return lienzo(VW, VH, g, 'La sala vista de lado');
}
/* plano de la sala: principales, retardos con su tiempo, subgraves y malla de techo */
function esquema(r, o = {}) {
  const mov = !!o.vertical, VW = mov ? 480 : 960, VH = 520, pad = 46;
  const k = Math.min((VW - 2 * pad) / S.ancho, (VH - 2 * pad - 24) / S.fondo), w = S.ancho * k, h = S.fondo * k, x0 = (VW - w) / 2, y0 = pad;
  let s = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="var(--linea)" stroke-width="3"/>`;
  if (S.pantalla) s += `<rect x="${x0 + w * .3}" y="${y0 - 9}" width="${w * .4}" height="9" rx="2" fill="var(--verde-txt)"/>`;
  const caja = (cx, cy, c, t) => `<rect x="${cx - 9}" y="${cy - 7}" width="18" height="14" rx="3" fill="${c}"/>` + (t ? `<text x="${cx}" y="${cy + 24}" text-anchor="middle" font-size="12" class="t-mono">${esc(t)}</text>` : '');
  if (r.techo && r.techo.nx && (S.montaje === 'techo' || S.en54 && S.montaje === 'techo')) {
    const { nx, ny, D } = r.techo, rr = Math.min(D / 2 * k, 90);
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const cx = x0 + (i + .5) * w / nx, cy = y0 + (j + .5) * h / ny;
      s += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="var(--azul)" fill-opacity=".07" stroke="var(--azul)" stroke-opacity=".5" stroke-dasharray="4 4"/><circle cx="${cx}" cy="${cy}" r="6" fill="var(--azul)"/>`; }
  } else if (r.mains.length) {
    const n = Math.min(r.mains.length, 12);
    if (n === 2) { s += caja(x0 + w * .12, y0 + 14, 'var(--azul)', r.mains[0].modelo) + caja(x0 + w * .88, y0 + 14, 'var(--azul)', ''); }
    else for (let i = 0; i < n; i++) { const along = i % 2 === 0, j = Math.floor(i / 2), y = y0 + (j + .5) * h / Math.ceil(n / 2); s += caja(along ? x0 + 12 : x0 + w - 12, y, 'var(--azul)', ''); }
  }
  r.delays.forEach((d) => { const y = y0 + d.y * k; s += `<line x1="${x0}" y1="${y}" x2="${x0 + w}" y2="${y}" stroke="var(--ambar)" stroke-dasharray="6 6" stroke-opacity=".6"/>`;
    for (let i = 0; i < d.n; i++) s += caja(x0 + (i + .5) * w / d.n, y, 'var(--ambar)', '');
    s += `<text x="${x0 + w + 6}" y="${y + 5}" font-size="13" class="t-mono">${d.ms} ms</text>`; });
  if (r.subs.length && !/CMR/.test(r.subs[0].id)) { s += `<rect x="${x0 + w * .12 + 16}" y="${y0 + 6}" width="22" height="16" rx="3" fill="var(--violeta)"/><rect x="${x0 + w * .88 - 38}" y="${y0 + 6}" width="22" height="16" rx="3" fill="var(--violeta)"/>`; }
  s += `<text x="${x0 + w / 2}" y="${y0 + h + 24}" text-anchor="middle" font-size="14" class="t-mono t-ten">${esc(N(S.ancho, 1) + ' × ' + N(S.fondo, 1) + ' × ' + N(S.alto, 1) + ' m · ' + T(nomUso(r.uso)))}</text>`;
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(T('Plano de la sala'))}" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
}
const GR = ['Altavoces', 'Subgraves', 'Electrónica', 'Micrófonos', 'Control', 'Accesorios'];
function resultado(r) {
  let h = `<div class="veredicto ${r.sem === 'A' ? 'aviso' : ''}"><b>${esc(r.semTxt)}</b><p>${esc(r.lineaTxt)}</p></div>`;
  GR.forEach((g, gi) => { const F = r.L.filter((q) => q.g === g); if (!F.length) return;
    h += `<div class="equipo${gi < 3 ? ' rec' : ''}"><div class="eq-cab"><b>${esc(T(g))}</b><span class="serie">${esc([...new Set(F.map((q) => q.x.marca))].join(' · '))}</span>${gi === 0 ? `<span class="etq">${T('Recomendado').toUpperCase()}</span>` : ''}</div><table class="despiece">${F.map((q) =>
      `<tr><td>${q.n}×</td><td class="ref">${esc(q.x.id)}</td><td class="des">${esc(q.x.descripcion || '')}${q.nota ? ' · ' + esc(q.nota) : ''}${q.x.consultar || q.x.proyecto ? ' · ' + esc(T('consultar')) : ''}</td></tr>`).join('')}</table></div>`; });
  if (r.av.length) h += `<ul class="avisos">${r.av.map((a) => `<li class="${a[0]}">${esc(a[1])}</li>`).join('')}</ul>`;
  return h;
}
const cifras = (r) => [
  { t: 'Altavoces', v: String(r.nAlt || 0), s: (r.L.find((q) => q.g === 'Altavoces') || { x: { modelo: '—' } }).x.modelo, ic: 'altavoz', c: 'var(--azul)' },
  { t: 'Subgraves', v: String(r.nSub || 0), s: r.subs.length ? r.subs[0].modelo : '—', ic: 'onda', c: 'var(--violeta)' },
  { t: 'Etapas', v: r.elec.length ? r.elec[0].x.modelo : '—', s: r.elec.slice(1).map((q) => q.x.modelo).join(' + '), ic: 'proc', c: 'var(--verde-txt)' },
  { t: 'Retardos', v: String(r.delays.reduce((s, d) => s + d.n, 0)), s: r.delays.map((d) => d.ms + ' ms').join(' · ') || '—', ic: 'dist', c: 'var(--ambar)' },
  { t: 'Micrófonos', v: String(r.mic), s: r.mic ? S.mano + ' · ' + S.cuerpo + ' · ' + S.mesa : '—', ic: 'micro', c: 'var(--verde)' },
  { t: 'Superficie', v: N(r.area, 0), u: 'm²', s: N(S.alto, 1) + ' m', ic: 'regla', c: 'var(--magenta, #e24bf0)' }];
const sino = (k, lab) => etq(lab) + togs(k, [[false, 'No'], [true, 'Sí']], S[k], 'dos');
function datos() {
  return [{ tit: 'Sala', ic: 'regla', ac: 'var(--azul)', html: `<div class="nums">${num('ancho', 'Ancho (m)', S.ancho, 'm', 0.5, 2, 80)}${num('fondo', 'Fondo (m)', S.fondo, 'm', 0.5, 2, 120)}</div><div class="nums">${num('alto', 'Alto (m)', S.alto, 'm', 0.1, 2, 25)}${num('zonas', 'Zonas', S.zonas, '', 1, 1, 54)}</div>` },
    { tit: 'Uso', ic: 'altavoz', ac: 'var(--verde-txt)', html: togs('uso', USOS.map((u) => [u[0], u[1]]), S.uso, 'dos') + etq('Montaje y acabado') + `<div class="fila envuelve dos">${[['montaje', 'pared', 'Pared'], ['montaje', 'techo', 'Techo'], ['color', 'negro', 'Negro'], ['color', 'blanco', 'Blanco']].map((o) => `<button type="button" class="tog" aria-pressed="${S[o[0]] === o[1]}" data-set="${o[0]}" data-v="${o[1]}"><span>${esc(T(o[2]))}</span></button>`).join('')}</div>` },
    { tit: 'Micrófonos', ic: 'micro', ac: 'var(--violeta)', html: num('mano', 'De mano', S.mano, '', 1, 0, 16) + num('cuerpo', 'De cuerpo', S.cuerpo, '', 1, 0, 16) + togs('tipoC', [['solapa', 'Solapa'], ['diadema', 'Diadema']], S.tipoC, 'dos') + num('mesa', 'Sobremesa', S.mesa, '', 1, 0, 40) },
    { tit: 'Proyecto', ic: 'chispa', ac: 'var(--ambar)', html: `<div class="fila envuelve dos">${BOOL.filter((b) => b !== 'eco').map((b) => `<button type="button" class="tog" aria-pressed="${!!S[b]}" data-set="${b}" data-v="${!S[b]}"><span>${esc(T({ pantalla: 'Pantalla delante', falso: 'Falso techo', dante: 'Red Dante', en54: 'Evacuación EN 54', reverb: 'Reverberante', discreto: 'Que no se vea', eco: 'Económico' }[b]))}</span></button>`).join('')}</div>` + `<div class="pie-b"><button type="button" class="tog" aria-pressed="${!!S.eco}" data-set="eco" data-v="${!S.eco}"><span>${esc(T('Económico'))}</span></button><button type="button" data-acc="reset">${esc(T('RESTABLECER'))}</button></div>` }];   /* v3.1 · ECONÓMICO junto a RESTABLECER, para que el bloque no crezca */
}
const micTxt = () => { const p = []; if (S.mano) p.push(S.mano + ' ' + T('De mano').toLowerCase()); if (S.cuerpo) p.push(S.cuerpo + ' ' + T(S.tipoC === 'diadema' ? 'Diadema' : 'Solapa').toLowerCase()); if (S.mesa) p.push(S.mesa + ' ' + T('Sobremesa').toLowerCase()); return p.join(' · ') || T('Sin micrófonos'); };
const filas = () => [['sala', 'regla', 'Sala', N(S.ancho, 1) + ' × ' + N(S.fondo, 1) + ' × ' + N(S.alto, 1) + ' m'], ['uso', 'altavoz', 'Uso', T(nomUso(S.uso))], ['montaje', 'techo', 'Montaje', T(S.montaje === 'techo' ? 'Techo' : 'Pared')], ['mics', 'micro', 'Micrófonos', micTxt()], ['en54', 'escudo', 'Evacuación EN 54', T(S.en54 ? 'Sí' : 'No')]];
const pasos = () => ['sala', 'uso', 'montaje', 'mics', 'en54'];
const MICS = { nada: [0, 0, 0], mano1: [1, 0, 0], mano2: [2, 0, 0], mixto: [1, 1, 0], diadema: [0, 1, 0], mesa: [0, 0, 2] };
function pregunta(k) {
  switch (k) {
    case 'sala': return { q: '¿Cuánto mide la sala?', nums: [['ancho', 'Ancho (m)', S.ancho, 2, 80, 'm'], ['fondo', 'Fondo (m)', S.fondo, 2, 120, 'm'], ['alto', 'Alto (m)', S.alto, 2, 25, 'm']], aplica: (o) => { S.ancho = o.ancho; S.fondo = o.fondo; S.alto = o.alto; } };
    case 'uso': return { q: '¿Para qué es el sonido?', val: S.uso, ops: USOS, aplica: (v) => { S.uso = v; } };
    case 'montaje': return { q: '¿Dónde van los altavoces?', val: S.montaje, ops: [['pared', 'Pared', 'La pared rinde más', 'pared'], ['techo', 'Techo', 'Cuando la arquitectura no deja', 'techo']], aplica: (v) => { S.montaje = v; } };
    case 'mics': { const cur = Object.keys(MICS).find((x) => MICS[x].join() === [S.mano, S.cuerpo, S.mesa].join()) || '';
      return { q: '¿Qué micrófonos?', val: cur, ops: [['nada', 'Sin micrófonos', '', 'nada'], ['mano1', '1 de mano', '', 'micro'], ['mano2', '2 de mano', '', 'micro'], ['mixto', 'Mano + solapa', '', 'persona'], ['diadema', 'Diadema', '', 'persona'], ['mesa', '2 de sobremesa', '', 'mesa']],
        aplica: (v) => { const m = MICS[v] || MICS.nada; [S.mano, S.cuerpo, S.mesa] = m; if (v === 'diadema') S.tipoC = 'diadema'; else if (v === 'mixto') S.tipoC = 'solapa'; } }; }
    case 'en54': return { q: '¿Lleva evacuación por voz (EN 54)?', val: S.en54, ops: [[false, 'No', 'Sonido normal', 'altavoz'], [true, 'Sí', 'Sistema certificado completo', 'escudo']], aplica: (v) => { S.en54 = v === true || v === 'true'; } };
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
  if ((m = s.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)(?:\s*[x×]\s*(\d+(?:\.\d+)?))?/))) { const a = +m[1], b = +m[2]; S.ancho = Math.min(a, b); S.fondo = Math.max(a, b); if (m[3]) S.alto = +m[3]; ok = true; }
  if ((m = s.match(/(\d+)\s*(?:micros?|micrófonos?|microfonos?|mics?|microphones?|micròfons?)/))) { const n = +m[1]; S.mano = n; S.cuerpo = 0; S.mesa = 0; ok = true; }
  if (/hilo musical|música de fondo|musica de fondo|ambiental|background music|tienda|restaurante/.test(s)) { S.uso = 'musica'; ok = true; }
  if (/megafon|avisos|paging|colegio|nave/.test(s)) { S.uso = 'avisos'; ok = true; }
  if (/evento|presentaci|auditorio|conferencia|event/.test(s)) { S.uso = 'evento'; ok = true; }
  if (/reuni|formaci|aula|meeting|classroom/.test(s)) { S.uso = 'sala'; ok = true; }
  /* v3.1 · «proyector de techo» habla del proyector, no de los altavoces */
  const sm = s.replace(/(?:proyector|projector|pantalla|screen)(?: de| a| al| en)? (?:techo|sostre)|ceiling[- ]?(?:mounted )?projector/g, '');
  if (/techo|ceiling|sostre/.test(sm)) S.montaje = 'techo'; if (/pared|wall|paret/.test(sm)) S.montaje = 'pared';
  if (/pantalla|led|screen/.test(s)) S.pantalla = true; if (/evacuaci|en ?54|voice alarm/.test(s)) S.en54 = true;
  if (/dante/.test(s)) S.dante = true; if (/reverber|cristal|eco/.test(s)) S.reverb = true; if (/blanco|white|blanc/.test(s.replace(/(?:pantalla|screen|tela|lona|llenç)[^.,;]{0,30}?(?:blanca|blanc|white)|white (?:projection )?screen/g, ''))) S.color = 'blanco';   /* v3.1 · «pantalla blanca» es la de proyección, no el color de los altavoces */
  if ((m = s.match(/(\d+)\s*zonas?/))) S.zonas = Math.min(54, +m[1]);
  /* v3.1 · alto con palabras («alçada 2,80 m»), pareja de altavoces y presupuesto ajustado → ECONÓMICO (sin micrófonos si no se piden, sin Dante si no se dice) */
  if ((m = s.match(/(?:alto|altura|alçada|alcada|height)[^0-9.]{0,12}(\d+(?:\.\d+)?)\s*m\b/))) { const a = +m[1]; if (a >= 2 && a <= 25) S.alto = a; }
  const nAlt = (s.match(/(\d+)\s*(?:altavoces|altaveus|speakers|loudspeakers)/) || [])[1];
  const eco = /ajustad|ajustat|econ[oòó]mic|low budget|tight budget|poco uso|poc ús|inversi[oó]n? (?:contenida|continguda|m[ií]nima)|2 o 3 reuni/.test(s) || nAlt === '2';
  if (eco) { S.eco = true; if (!/micro|micr[oóò]fon|mics?\b/.test(s)) { S.mano = 0; S.cuerpo = 0; S.mesa = 0; } if (!/dante/.test(s)) S.dante = false; ok = true; }
  return ok || /altavoc|sonoriz|sonido|speaker|so de/.test(s);
}
export default {
  id: 'sonido', nom: 'Sonorización', corto: 'SONIDO', ic: 'altavoz', ejemplo: 'Escríbela: «sala de 10 x 16 m con 2 micros y pantalla»',
  info: 'El sistema de sonido completo de una sala: altavoces, subgraves, retardos, electrónica, micrófonos y control.',
  calcula, filas, pasos, pregunta, datos, resultado, cifras, pide,
  reconoce: (t) => /altavoc|altaveu|sonoriz|micros?\b|micr[óò]fon|microphone|sonorit|megafon|hilo musical|fil musical|evacuaci|speaker|sound system|loudspeaker/i.test(t),
  esquema: (r, o) => ({ tit: VT === 'lateral' ? 'Vista lateral' : VT === '3d' ? 'Simulación 3D' : 'Plano de la sala', ic: 'cubo', html: VT === 'lateral' ? lateral(r, o) : VT === '3d' ? lienzo3D() : esquema(r, o), extra: pestanas(['planta', 'lateral', '3d'], VT) }),
  escena3d,
  set: pon, num: pon, pm: (k, d) => pon(k, +S[k] + d * (k === 'alto' ? 0.1 : ['zonas', 'mano', 'cuerpo', 'mesa'].includes(k) ? 1 : 0.5)),
  accion: (a) => { if (a === 'reset') S = Object.assign({}, DEF); else if (/^vt:/.test(a)) VT = a.slice(3); }, reset: () => { S = Object.assign({}, DEF); },
  _S: () => S,
};
