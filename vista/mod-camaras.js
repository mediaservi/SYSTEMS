// SYSTEMS · módulo CÁMARAS (v2.2): cámaras PTZ para salas, aulas, auditorios y retransmisiones.
// Por la distancia al ponente y el ancho a cubrir: el zoom que hace falta (campo de visión del fabricante en gran angular y zoom óptico),
// cuántas cámaras según los planos, el seguimiento (por voz o por la lente IA), la salida (USB, HDMI o IP) y la alimentación PoE+.
// Solo con cámaras de las listas del panel. Según información de los fabricantes. GPL-3.0 · mediaservi.com
import { T, N, esc, textos, lee, guarda, togs, num, etq } from './util.js';
import { equipos, esInterno, P } from './listas.js';
import { COL as VC, escala, cota, persona, suelo, etiqueta, lienzo, lienzo3D, pestanas, fmt } from './vt.js';
textos({
  'Vista lateral': ['Side view', 'Vista lateral'], 'La sala vista de lado': ['The room seen from the side', 'La sala vista de costat'], 'oído': ['ear', 'oïda'], 'ojos': ['eyes', 'ulls'],
  'CÁMARAS': ['CAMERAS', 'CÀMERES'], 'Cámaras': ['Cameras', 'Càmeres'],
  'Cámaras PTZ: el zoom que pide la distancia al ponente, cuántas hacen falta por planos, seguimiento, salida y alimentación.': ['PTZ cameras: the zoom the distance to the speaker needs, how many for the shots, tracking, output and power.', 'Càmeres PTZ: el zoom que demana la distància al ponent, quantes en calen pels plans, seguiment, sortida i alimentació.'],
  'Escríbela: «auditorio, cámara a 12 m del escenario de 8 m»': ['Type it: “auditorium, camera 12 m from an 8 m stage”', 'Escriu-la: «auditori, càmera a 12 m de l\'escenari de 8 m»'],
  'Espacio': ['Space', 'Espai'], 'Reunión': ['Meeting', 'Reunió'], 'Aula': ['Classroom', 'Aula'], 'Auditorio': ['Auditorium', 'Auditori'], 'Retransmisión': ['Streaming', 'Retransmissió'],
  'Distancia al ponente (m)': ['Distance to the speaker (m)', 'Distància al ponent (m)'], 'Ancho a cubrir (m)': ['Width to cover (m)', 'Amplada a cobrir (m)'], 'Más cerca (m)': ['Nearest (m)', 'Més a prop (m)'],
  'Planos': ['Shots', 'Plans'], 'Ponente': ['Speaker', 'Ponent'], 'Público': ['Audience', 'Públic'], 'Plano general': ['Wide shot', 'Pla general'],
  'Seguimiento': ['Tracking', 'Seguiment'], 'Por voz': ['By voice', 'Per veu'], 'Automático (IA)': ['Automatic (AI)', 'Automàtic (IA)'], 'Posiciones fijas': ['Presets', 'Posicions fixes'],
  'Salida': ['Output', 'Sortida'], 'IP / streaming': ['IP / streaming', 'IP / streaming'], 'Encuadre': ['Framing', 'Enquadrament'],
  'Plano medio': ['Medium shot', 'Pla mitjà'], 'Primer plano': ['Close-up', 'Primer pla'], 'Plano americano': ['Medium-long shot', 'Pla americà'],
  'Zoom necesario': ['Zoom needed', 'Zoom necessari'], 'Ángulo en zoom': ['Angle at full zoom', 'Angle amb zoom'], 'Ángulo abierto': ['Wide angle', 'Angle obert'], 'Alcance': ['Reach', 'Abast'],
  'Cámara principal': ['Main camera', 'Càmera principal'], 'Cámara de público': ['Audience camera', 'Càmera de públic'], 'Plano de cámaras': ['Camera plan', 'Planta de càmeres'],
  'Puertos PoE+': ['PoE+ ports', 'Ports PoE+'], 'Cámaras PTZ': ['PTZ cameras', 'Càmeres PTZ'],
  '¿Dónde van las cámaras?': ['Where do the cameras go?', 'On van les càmeres?'], '¿A qué distancia está el ponente?': ['How far is the speaker?', 'A quina distància és el ponent?'], '¿Qué planos?': ['Which shots?', 'Quins plans?'], '¿Cómo sigue al ponente?': ['How does it follow the speaker?', 'Com segueix el ponent?'], '¿Por dónde sale la imagen?': ['Where does the picture go out?', 'Per on surt la imatge?'],
  'Sala de reuniones': ['Meeting room', 'Sala de reunions'], 'Clase o formación': ['Class or training', 'Classe o formació'], 'Escenario y butacas': ['Stage and seating', 'Escenari i butaques'], 'Evento en directo': ['Live event', 'Esdeveniment en directe'],
  'Solo el ponente': ['Speaker only', 'Només el ponent'], 'Ponente y público': ['Speaker and audience', 'Ponent i públic'], 'Ponente, público y general': ['Speaker, audience and wide', 'Ponent, públic i general'],
  'Sigue a quien habla': ['Follows whoever talks', 'Segueix qui parla'], 'Sigue el movimiento': ['Follows movement', 'Segueix el moviment'], 'Un operador o botones': ['An operator or buttons', 'Un operador o botons'],
  'Al ordenador de la sala': ['To the room computer', 'A l\'ordinador de la sala'], 'A un mezclador o pantalla': ['To a mixer or screen', 'A un mesclador o pantalla'], 'Por la red': ['Over the network', 'Per la xarxa'],
  'Hay solución': ['There is a solution', 'Hi ha solució'], 'Hay solución, con avisos': ['There is a solution, with warnings', 'Hi ha solució, amb avisos'], 'Sin solución en las listas': ['No solution in the lists', 'Sense solució a les llistes'],
  'Para un {p} de {w} m a {d} m hace falta un ángulo de {a}°: zoom de {z}×.': ['A {p} {w} m wide at {d} m needs an angle of {a}°: {z}× zoom.', 'Per a un {p} de {w} m a {d} m cal un angle de {a}°: zoom de {z}×.'],
  'La {m} llega con su zoom óptico ({o}×): {b}° en zoom, alcance de {r} m para ese plano.': ['The {m} gets there with its optical zoom ({o}×): {b}° at full zoom, {r} m reach for that shot.', 'La {m} hi arriba amb el seu zoom òptic ({o}×): {b}° amb zoom, abast de {r} m per a aquest pla.'],
  'La {m} solo llega con zoom digital (hasta {t}×): la imagen pierde nitidez. Acerca la cámara o abre el plano.': ['The {m} only gets there with digital zoom (up to {t}×): the picture loses sharpness. Move the camera closer or widen the shot.', 'La {m} només hi arriba amb zoom digital (fins a {t}×): la imatge perd nitidesa. Acosta la càmera o obre el pla.'],
  'Ninguna cámara de las listas encuadra ese plano a {d} m (hace falta {z}×): acerca la cámara, abre el plano o consulta una cámara de más zoom.': ['No camera in the lists frames that shot at {d} m ({z}× needed): move the camera closer, widen the shot or ask for a longer-zoom camera.', 'Cap càmera de les llistes enquadra aquest pla a {d} m (cal {z}×): acosta la càmera, obre el pla o consulta una càmera amb més zoom.'],
  'Para ver los {w} m de ancho desde {c} m hacen falta {a}°; la lente IA de la {m} da {b}°: el plano general no cabe entero.': ['To see the {w} m width from {c} m you need {a}°; the AI lens of the {m} gives {b}°: the wide shot does not fit.', 'Per veure els {w} m d\'amplada des de {c} m calen {a}°; la lent IA de la {m} en dona {b}°: el pla general no hi cap sencer.'],
  'El plano general lo da la segunda lente (IA) de la propia cámara: no hace falta otra cámara.': ['The wide shot comes from the camera\'s own second (AI) lens: no extra camera needed.', 'El pla general el dona la segona lent (IA) de la mateixa càmera: no cal una altra càmera.'],
  'Seguimiento por voz integrado: la cámara apunta a quien habla hasta unos {r} m.': ['Built-in voice tracking: the camera points at whoever talks up to about {r} m.', 'Seguiment per veu integrat: la càmera apunta a qui parla fins a uns {r} m.'],
  'Más lejos de lo que oye la cámara: el seguimiento por voz se hace con los micrófonos de techo Sennheiser (función Preset Link).': ['Farther than the camera can hear: voice tracking is done with the Sennheiser ceiling microphones (Preset Link).', 'Més lluny del que sent la càmera: el seguiment per veu es fa amb els micròfons de sostre Sennheiser (funció Preset Link).'],
  'Con {n} cámaras: un mezclador de vídeo o el control de las cámaras por la red para pasar de un plano a otro.': ['With {n} cameras: a video mixer or network camera control to switch shots.', 'Amb {n} càmeres: un mesclador de vídeo o el control de les càmeres per la xarxa per passar d\'un pla a l\'altre.'],
  'Cada cámara va con PoE+ (802.3at): {n} puertos PoE+ en el switch de red.': ['Each camera runs on PoE+ (802.3at): {n} PoE+ ports on the network switch.', 'Cada càmera va amb PoE+ (802.3at): {n} ports PoE+ al switch de xarxa.'],
  'La cámara va con PoE+ (802.3at): un puerto PoE+ en el switch de red.': ['The camera runs on PoE+ (802.3at): one PoE+ port on the network switch.', 'La càmera va amb PoE+ (802.3at): un port PoE+ al switch de xarxa.'],
  'Primer': ['Close-up', 'Primer'], 'Medio': ['Medium', 'Mitjà'], 'Americano': ['Medium-long', 'Americà'], '+ Público': ['+ Audience', '+ Públic'], '+ General': ['+ Wide', '+ General'], 'Por IA': ['By AI', 'Per IA'], 'Fijo': ['Fixed', 'Fix'], 'IP': ['IP', 'IP'], 'solo con zoom digital': ['digital zoom only', 'només amb zoom digital'],
  'Por HDMI a más de {m} m: extensor HDBaseT o fibra (calcúlalo en ELECTRÓNICA).': ['HDMI over {m} m: HDBaseT extender or fibre (work it out in ELECTRONICS).', 'Per HDMI a més de {m} m: extensor HDBaseT o fibra (calcula-ho a ELECTRÒNICA).'],
  'Por USB a más de {m} m: mejor por la red (la cámara se ve como cámara en el ordenador) o con un extensor USB.': ['USB over {m} m: better over the network (the computer sees it as a camera) or with a USB extender.', 'Per USB a més de {m} m: millor per la xarxa (l\'ordinador la veu com una càmera) o amb un extensor USB.'],
  'Montaje a unos {h} m del suelo, sin taparla: no se monta del revés (para techo, su soporte de techo).': ['Mount it about {h} m above the floor, unobstructed: it is not mounted upside down (for ceilings, its ceiling mount).', 'Muntatge a uns {h} m del terra, sense tapar-la: no es munta de cap per avall (per a sostre, el seu suport de sostre).'],
  'A menos de {m} m no enfoca: aleja la cámara del ponente.': ['It cannot focus closer than {m} m: move the camera away from the speaker.', 'A menys de {m} m no enfoca: allunya la càmera del ponent.'],
  'óptico': ['optical', 'òptic'], 'digital': ['digital', 'digital'], 'personas': ['people', 'persones'], 'cámaras': ['cameras', 'càmeres'], 'en zoom': ['at full zoom', 'amb zoom'],
});
const USOS = [['reunion', 'Reunión', 'Sala de reuniones', 'videoconf'], ['aula', 'Aula', 'Clase o formación', 'personas'], ['auditorio', 'Auditorio', 'Escenario y butacas', 'grupo'], ['directo', 'Retransmisión', 'Evento en directo', 'camara']];
const PLAN = { ponente: 1, publico: 2, todo: 3 };
const DEF = { uso: 'auditorio', dist: 12, ancho: 8, cerca: 3, encuadre: 'medio', planos: 'ponente', seg: 'voz', salida: 'ip' };
let S = Object.assign({}, DEF, lee('systems_camaras') || {});
const NUMS = { dist: [1.5, 60, 1], ancho: [1, 60, 1], cerca: [0.5, 40, 1] };
/* ancho de la escena que se encuadra en cada plano (m): primer plano, plano medio, plano americano */
const ENC = { primer: ['Primer plano', 0.8], medio: ['Plano medio', 1.6], americano: ['Plano americano', 2.6] };
const rad = (g) => g * Math.PI / 180, grad = (r) => r * 180 / Math.PI;
const tele = (c) => grad(2 * Math.atan(Math.tan(rad(c.hfov / 2)) / c.zoom));   // ángulo horizontal con todo el zoom óptico

function calcula() {
  const av = [], r = { av };
  const wEnc = P('camaras.encuadre.' + S.encuadre, ENC[S.encuadre][1]);
  r.wEnc = wEnc; r.aNec = grad(2 * Math.atan(wEnc / 2 / S.dist));
  const C = equipos('camara').filter((x) => x.hfov && x.zoom);
  r.zNec = C.length ? Math.tan(rad(C[0].hfov / 2)) / Math.tan(rad(r.aNec / 2)) : 0;
  /* la cámara: con seguimiento por voz, la que lo trae de serie; si no, la de más alcance. Siempre la que llegue con zoom óptico, si la hay */
  const alc = (c, dig) => wEnc / 2 / Math.tan(rad((dig ? grad(2 * Math.atan(Math.tan(rad(c.hfov / 2)) / (c.zoomTotal || c.zoom))) : tele(c)) / 2));
  const orden = C.slice().sort((a, b) => (S.seg === 'voz' ? (b.vozNativa ? 1 : 0) - (a.vozNativa ? 1 : 0) : 0) || alc(b) - alc(a));
  let cam = orden.find((c) => alc(c) >= S.dist), dig = false;
  if (!cam) { cam = orden.slice().sort((a, b) => alc(b, true) - alc(a, true)).find((c) => alc(c, true) >= S.dist); dig = !!cam; }
  r.cam = cam || null; r.dig = dig;
  r.zTxt = N(r.zNec, 1);
  av.push(['info', T('Para un {p} de {w} m a {d} m hace falta un ángulo de {a}°: zoom de {z}×.', { p: T(ENC[S.encuadre][0]).toLowerCase(), w: N(wEnc, 1), d: N(S.dist, 1), a: N(r.aNec, 1), z: r.zTxt })]);
  if (!cam) av.push(['', T('Ninguna cámara de las listas encuadra ese plano a {d} m (hace falta {z}×): acerca la cámara, abre el plano o consulta una cámara de más zoom.', { d: N(S.dist, 1), z: r.zTxt })]);
  else if (dig) av.push(['', T('La {m} solo llega con zoom digital (hasta {t}×): la imagen pierde nitidez. Acerca la cámara o abre el plano.', { m: cam.modelo, t: cam.zoomTotal || cam.zoom })]);
  else av.push(['info', T('La {m} llega con su zoom óptico ({o}×): {b}° en zoom, alcance de {r} m para ese plano.', { m: cam.modelo, o: cam.zoom, b: N(tele(cam), 1), r: N(alc(cam), 1) })]);
  r.tele = cam ? tele(cam) : 0; r.alc = cam ? alc(cam) : 0;
  /* plano general: la lente IA de la misma cámara, desde lo más cerca que se sienta el público */
  r.aGen = grad(2 * Math.atan(S.ancho / 2 / Math.max(0.5, S.cerca)));
  if (cam && PLAN[S.planos] >= 3) {
    if (cam.hfovIA && cam.hfovIA >= r.aGen) av.push(['info', T('El plano general lo da la segunda lente (IA) de la propia cámara: no hace falta otra cámara.')]);
    else av.push(['', T('Para ver los {w} m de ancho desde {c} m hacen falta {a}°; la lente IA de la {m} da {b}°: el plano general no cabe entero.', { w: N(S.ancho, 1), c: N(S.cerca, 1), a: Math.round(r.aGen), m: cam.modelo, b: cam.hfovIA || cam.hfov })]);
  }
  /* cuántas: una para el ponente y otra para el público; el general sale de la lente IA */
  r.n = cam ? (PLAN[S.planos] >= 2 ? 2 : 1) : 0;
  if (cam && S.seg === 'voz') {
    if (cam.vozNativa && S.dist <= (cam.vozAlcance || 10)) av.push(['info', T('Seguimiento por voz integrado: la cámara apunta a quien habla hasta unos {r} m.', { r: cam.vozAlcance || 10 })]);
    else av.push(['info', T('Más lejos de lo que oye la cámara: el seguimiento por voz se hace con los micrófonos de techo Sennheiser (función Preset Link).')]);
  }
  if (r.n > 1) av.push(['info', T('Con {n} cámaras: un mezclador de vídeo o el control de las cámaras por la red para pasar de un plano a otro.', { n: r.n })]);
  if (cam && cam.poe) av.push(['info', r.n > 1 ? T('Cada cámara va con PoE+ (802.3at): {n} puertos PoE+ en el switch de red.', { n: r.n }) : T('La cámara va con PoE+ (802.3at): un puerto PoE+ en el switch de red.')]);
  if (cam && S.salida === 'hdmi' && S.dist > P('camaras.hdmiMax', 15)) av.push(['info', T('Por HDMI a más de {m} m: extensor HDBaseT o fibra (calcúlalo en ELECTRÓNICA).', { m: P('camaras.hdmiMax', 15) })]);
  if (cam && S.salida === 'usb' && S.dist > P('camaras.usbMax', 5)) av.push(['info', T('Por USB a más de {m} m: mejor por la red (la cámara se ve como cámara en el ordenador) o con un extensor USB.', { m: P('camaras.usbMax', 5) })]);
  if (cam && cam.enfoqueMin && S.dist < cam.enfoqueMin) av.push(['', T('A menos de {m} m no enfoca: aleja la cámara del ponente.', { m: N(cam.enfoqueMin, 1) })]);
  if (cam) av.push(['info', T('Montaje a unos {h} m del suelo, sin taparla: no se monta del revés (para techo, su soporte de techo).', { h: N(cam.altura || 1.5, 1) })]);
  r.alt = cam ? C.filter((c) => c !== cam && alc(c, true) >= S.dist) : []; r.altDig = new Set(r.alt.filter((c) => alc(c) < S.dist));
  r.sem = !cam ? 'R' : av.some((a) => !a[0]) ? 'A' : 'V';
  r.semTxt = T(r.sem === 'R' ? 'Sin solución en las listas' : r.sem === 'A' ? 'Hay solución, con avisos' : 'Hay solución');
  r.lineaTxt = cam ? r.n + ' × ' + cam.marca + ' ' + cam.modelo + ' · ' + T('Zoom necesario') + ' ' + r.zTxt + '×' : T('Zoom necesario') + ' ' + r.zTxt + '×';
  r.linea = cam ? `<b>${r.n} × ${esc(cam.modelo)}</b> · ${esc(T('Zoom necesario'))} ${esc(r.zTxt)}×` : `<b>—</b> · ${esc(T('Zoom necesario'))} ${esc(r.zTxt)}×`;
  guarda('systems_camaras', S); return r;
}


/* v2.5 · simulación 3D: escenario con el ponente, cámaras con el cono del encuadre (y la de público), público y lente IA */
function escena3d(V, r) {
  const D = S.dist, A = Math.max(S.ancho + 2, 6), F = D + 1.5, H = /auditorio|directo/.test(S.uso) ? 5 : 3, hc = /auditorio|directo/.test(S.uso) ? P('camaras.alturaAuditorio', 2.0) : P('camaras.alturaSala', 1.5);
  const cen = { primer: 1.55, medio: 1.35, americano: 1.1 }[S.encuadre] || 1.35;
  V.sala(A, F, H);
  V.caja(S.ancho, 0.02, 2, 0, 0.01, 1, 0x3a3b42, { rough: 0.7 });
  V.persona(0, 0.8, 0, 1);
  const camara = (x, z) => V.caja(0.18, 0.2, 0.2, x, hc, z, 0x1b1b1e, { metal: 0.6 }) && V.caja(0.04, hc - 0.1, 0.04, x, (hc - 0.1) / 2, z, 0x55555c);
  camara(0, D); V.cono([0, hc, D - 0.1], [0, cen, 0.8], r.cam ? r.tele : r.aNec, 0x00b4ff, 0.12);
  if (r.cam) V.etiqueta(r.cam.modelo + ' · ' + fmt(r.tele, 1) + '°', 0, hc + 0.45, D, 0.4);
  if (r.cam && PLAN[S.planos] >= 3 && r.cam.hfovIA) V.cono([0, hc, D - 0.1], [0, 1.2, 0.5], r.cam.hfovIA, 0xffb000, 0.05);
  if (r.n > 1) { camara(-S.ancho / 2 + 0.3, 0.4); V.cono([-S.ancho / 2 + 0.3, hc, 0.5], [0, 1.2, (S.cerca + D) / 2], 60, 0xb566ff, 0.08); }
  for (let z = Math.max(1.2, S.cerca); z < D - 0.6; z += Math.max(1.1, (D - S.cerca) / 7)) for (let x = -S.ancho / 2 + 0.6; x < S.ancho / 2 - 0.3; x += 1.2) V.persona(x, z, Math.PI, 0.45);
}
/* v2.3 · vista LATERAL como las de SCREENS: el ponente, la cámara a su altura y distancia, el cono del encuadre y el público */
let VT = 'planta';
function lateral(r, o = {}) {
  const mov = !!o.vertical, VW = mov ? 480 : 960, VH = 520, D = S.dist, hc = /auditorio|directo/.test(S.uso) ? P('camaras.alturaAuditorio', 2.0) : P('camaras.alturaSala', 1.5);
  const cen = { primer: 1.55, medio: 1.35, americano: 1.1 }[S.encuadre] || 1.35, vh = r.wEnc * 9 / 16, y1 = cen - vh / 2, y2 = cen + vh / 2;
  const E = escala(VW, VH, { l: 60, r: 60, t: 56, b: 66 }, -0.6, D + 1.0, 0, Math.max(2.6, hc + 0.6)), { X, Y, k } = E;
  let g = suelo(X, Y, -0.6, D + 1.0) + persona(X, Y, 0, k);
  for (let x = Math.max(1, S.cerca); x < D - 0.6; x += Math.max(1.2, (D - S.cerca) / 6)) g += persona(X, Y, x, k, 0.35);
  g += `<path d="M${X(D)} ${Y(hc)} L${X(0.15)} ${Y(y2)} L${X(0.15)} ${Y(y1)} Z" fill="${VC.rango}" stroke="${VC.rangoB}" stroke-dasharray="5 4"/>`;
  g += `<rect x="${X(0.15) - 3}" y="${Y(y2)}" width="6" height="${vh * k}" fill="${VC.imagenB}"/>`;
  g += `<rect x="${X(D) - 12}" y="${Y(hc) - 9}" width="24" height="18" rx="4" fill="${VC.equipo}" stroke="${VC.rangoB}" stroke-width="2"/><line x1="${X(D)}" y1="${Y(hc) + 9}" x2="${X(D)}" y2="${Y(0)}" stroke="${VC.linea}" stroke-width="2"/>`;
  const tilt = Math.atan2(hc - cen, D) * 180 / Math.PI;
  g += etiqueta(X(D), Y(hc) - 18, (r.cam ? r.cam.modelo + ' · ' : '') + (tilt >= 0 ? '↓ ' : '↑ ') + fmt(Math.abs(tilt), 0) + '°', 'middle', 'vt-azu');
  g += cota(X(0), Y(0) + 26, X(D), Y(0) + 26, fmt(D) + ' m', 1) + cota(X(D) + 22, Y(0), X(D) + 22, Y(hc), fmt(hc), 1) + cota(X(0) - 22, Y(y1), X(0) - 22, Y(y2), fmt(vh));
  return lienzo(VW, VH, g, 'La sala vista de lado');
}
function esquema(r, o = {}) {
  const mov = !!o.vertical, VW = mov ? 480 : 960, VH = 520, pad = 44;
  const L = Math.max(S.dist, S.cerca) + 1, Wm = Math.max(S.ancho, 2);
  const k = Math.min((VW - 2 * pad) / Wm, (VH - 2 * pad - 30) / L), w = Wm * k, x0 = (VW - w) / 2, yE = pad + 14, yC = yE + S.dist * k, cx = VW / 2;
  let s = `<rect x="${x0}" y="${yE - 12}" width="${w}" height="12" rx="3" fill="var(--blk2)" stroke="var(--linea)"/><text x="${cx}" y="${yE - 18}" text-anchor="middle" font-size="14" class="t-mono t-ten">${esc(N(S.ancho, 1) + ' m')}</text>`;
  /* ponente y su encuadre */
  const we = r.wEnc * k; s += `<rect x="${cx - we / 2}" y="${yE - 2}" width="${we}" height="6" fill="var(--verde-txt)"/><circle cx="${cx}" cy="${yE + 14}" r="8" fill="var(--violeta)"/>`;
  /* cono del zoom (o del ángulo necesario si no hay cámara) */
  const a = (r.cam ? r.tele : r.aNec) / 2, dy = yC - yE, half = Math.tan(rad(a)) * dy;
  s += `<path d="M${cx} ${yC} L ${cx - half} ${yE} L ${cx + half} ${yE} Z" fill="var(--azul)" fill-opacity=".14" stroke="var(--azul)" stroke-dasharray="6 5"/>`;
  /* lente IA: plano general desde la cámara (hasta el borde del dibujo) */
  if (r.cam && r.cam.hfovIA && PLAN[S.planos] >= 3) { const b = rad(r.cam.hfovIA / 2), hh = Math.min(dy, (w / 2) / Math.tan(b)); s += `<path d="M${cx} ${yC} L ${cx - Math.tan(b) * hh} ${yC - hh} M${cx} ${yC} L ${cx + Math.tan(b) * hh} ${yC - hh}" stroke="var(--ambar)" stroke-width="2"/>`; }
  /* público */
  const yP = yE + S.cerca * k; s += `<line x1="${x0}" y1="${yP}" x2="${x0 + w}" y2="${yP}" stroke="var(--linea)" stroke-dasharray="3 6"/>`;
  for (let i = 0; i < 12; i++) { const px = x0 + w * (i + .5) / 12, py = yP + 14 + (i % 2) * 10; if (py < yC - 14) s += `<circle cx="${px}" cy="${py}" r="5" fill="var(--violeta)" fill-opacity=".55"/>`; }
  s += `<rect x="${cx - 11}" y="${yC - 9}" width="22" height="18" rx="4" fill="var(--azul)"/><text x="${cx + 18}" y="${yC + 5}" font-size="14" class="t-mono">${esc((r.cam ? r.n + ' × ' + r.cam.modelo + ' · ' : '') + N(S.dist, 1) + ' m · ' + N(r.cam ? r.tele : r.aNec, 1) + '°')}</text>`;
  if (r.n > 1) s += `<rect x="${x0 + 4}" y="${yE + 4}" width="20" height="16" rx="4" fill="var(--azul)" fill-opacity=".7"/><text x="${x0 + 28}" y="${yE + 17}" font-size="12" class="t-mono t-ten">${esc(T('Cámara de público'))}</text>`;
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(T('Plano de cámaras'))}" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
}
const eq = (x, n, tit, rec, extra = '') => x ? `<div class="equipo${rec ? ' rec' : ''}"><div class="eq-cab"><b>${x.prioritario ? '⭐ ' : ''}${esc(x.modelo)}</b><span class="serie">${esc(x.marca)}${tit ? ' · ' + esc(T(tit)) : ''}</span>${rec ? `<span class="etq">${T('Recomendado').toUpperCase()}</span>` : ''}</div><table class="despiece"><tr><td>${n}×</td><td class="ref">${esc(x.id)}</td><td class="des">${esc(x.descripcion || '')}${extra}${x.stock && esInterno() ? '<span class="st-int"> · ' + esc(T('En stock')) + '</span>' : ''}</td></tr></table></div>` : '';
function resultado(r) {
  let h = `<div class="veredicto ${r.sem === 'A' ? 'aviso' : r.sem === 'R' ? 'mal' : ''}"><b>${esc(r.semTxt)}</b><p>${esc(r.lineaTxt)}</p></div>`;
  if (r.cam) h += eq(r.cam, 1, 'Cámara principal', true) + (r.n > 1 ? eq(r.cam, r.n - 1, 'Cámara de público', true) : '');
  if (r.av.length) h += `<ul class="avisos">${r.av.map((a) => `<li class="${a[0]}">${esc(a[1])}</li>`).join('')}</ul>`;
  if (r.alt.length) h += `<p class="alt-t">${T('Alternativas')}</p>` + r.alt.map((x) => eq(x, r.n, '', false, r.altDig.has(x) ? ' · ' + T('solo con zoom digital') : '')).join('');
  return h;
}
const cifras = (r) => [
  { t: 'Zoom necesario', v: r.zTxt, u: '×', s: N(r.aNec, 1) + '° · ' + T(ENC[S.encuadre][0]), ic: 'camara', c: 'var(--verde-txt)' },
  { t: 'Cámaras PTZ', v: r.cam ? String(r.n) : '—', u: r.cam ? '× ' + r.cam.modelo : '', s: r.cam ? r.cam.marca : '', ic: 'camara', c: 'var(--azul)' },
  { t: 'Ángulo en zoom', v: r.cam ? N(r.tele, 1) : '—', u: '°', s: r.cam ? (r.dig ? (r.cam.zoomTotal || r.cam.zoom) + '× ' + T('digital') : r.cam.zoom + '× ' + T('óptico')) : '', ic: 'ojo', c: 'var(--violeta)' },
  { t: 'Alcance', v: r.cam ? N(r.alc, 1) : '—', u: 'm', s: T(ENC[S.encuadre][0]), ic: 'dist', c: 'var(--ambar)' },
  { t: 'Ángulo abierto', v: String(Math.round(r.aGen)), u: '°', s: N(S.ancho, 1) + ' m · ' + N(S.cerca, 1) + ' m', ic: 'regla', c: 'var(--verde)' },
  { t: 'Puertos PoE+', v: r.cam ? String(r.n) : '—', s: T({ usb: 'USB', hdmi: 'HDMI', ip: 'IP / streaming' }[S.salida]), ic: 'red', c: 'var(--magenta, #e24bf0)' }];
function datos() {
  return [{ tit: 'Espacio', ic: 'regla', ac: 'var(--azul)', html: togs('uso', USOS.map((u) => [u[0], u[1]]), S.uso, 'dos') + num('dist', 'Distancia al ponente (m)', S.dist, 'm', 0.5, 1.5, 60) + `<div class="nums">${num('ancho', 'Ancho a cubrir (m)', S.ancho, 'm', 0.5, 1, 60)}${num('cerca', 'Más cerca (m)', S.cerca, 'm', 0.5, 0.5, 40)}</div>` },
    { tit: 'Encuadre', ic: 'camara', ac: 'var(--verde-txt)', html: togs('encuadre', [['primer', 'Primer'], ['medio', 'Medio'], ['americano', 'Americano']], S.encuadre, 'tres') + etq('Planos') + togs('planos', [['ponente', 'Ponente'], ['publico', '+ Público'], ['todo', '+ General']], S.planos, 'tres') },
    { tit: 'Seguimiento', ic: 'ojo', ac: 'var(--violeta)', html: togs('seg', [['voz', 'Por voz'], ['ia', 'Por IA'], ['fijo', 'Fijo']], S.seg, 'tres') + etq('Salida') + togs('salida', [['usb', 'USB'], ['hdmi', 'HDMI'], ['ip', 'IP']], S.salida, 'tres') + `<div class="pie-b"><button type="button" data-acc="reset">${esc(T('RESTABLECER'))}</button></div>` }];
}
const nomUso = (u) => (USOS.find((x) => x[0] === u) || USOS[0])[1];
const nomPl = { ponente: 'Solo el ponente', publico: 'Ponente y público', todo: 'Ponente, público y general' };
const nomSeg = { voz: 'Por voz', ia: 'Automático (IA)', fijo: 'Posiciones fijas' };
const filas = () => [['uso', 'grupo', 'Espacio', T(nomUso(S.uso))], ['dist', 'dist', 'Distancia al ponente (m)', N(S.dist, 1) + ' m · ' + N(S.ancho, 1) + ' m'], ['planos', 'camara', 'Planos', T(nomPl[S.planos])], ['seg', 'ojo', 'Seguimiento', T(nomSeg[S.seg])], ['salida', 'red', 'Salida', T({ usb: 'USB', hdmi: 'HDMI', ip: 'IP / streaming' }[S.salida])]];
const pasos = () => ['uso', 'dist', 'planos', 'seg', 'salida'];
function pregunta(k) {
  switch (k) {
    case 'uso': return { q: '¿Dónde van las cámaras?', val: S.uso, ops: USOS, aplica: (v) => { S.uso = v; const d = { reunion: [6, 4, 1.5, 'ia'], aula: [9, 8, 2, 'ia'], auditorio: [12, 8, 3, 'voz'], directo: [20, 12, 4, 'fijo'] }[v]; if (d) [S.dist, S.ancho, S.cerca, S.seg] = d; } };
    case 'dist': return { q: '¿A qué distancia está el ponente?', nums: [['dist', 'Distancia al ponente (m)', S.dist, 1.5, 60, 'm'], ['ancho', 'Ancho a cubrir (m)', S.ancho, 1, 60, 'm']], aplica: (o) => { S.dist = o.dist; S.ancho = o.ancho; } };
    case 'planos': return { q: '¿Qué planos?', val: S.planos, ops: [['ponente', 'Solo el ponente', '1 ' + T('cámaras'), 'persona'], ['publico', 'Ponente y público', '2 ' + T('cámaras'), 'personas'], ['todo', 'Ponente, público y general', '2 ' + T('cámaras'), 'grupo']], aplica: (v) => { S.planos = v; } };
    case 'seg': return { q: '¿Cómo sigue al ponente?', val: S.seg, ops: [['voz', 'Por voz', 'Sigue a quien habla', 'micro'], ['ia', 'Automático (IA)', 'Sigue el movimiento', 'ojo'], ['fijo', 'Posiciones fijas', 'Un operador o botones', 'mano']], aplica: (v) => { S.seg = v; } };
    case 'salida': return { q: '¿Por dónde sale la imagen?', val: S.salida, ops: [['usb', 'USB', 'Al ordenador de la sala', 'chip'], ['hdmi', 'HDMI', 'A un mezclador o pantalla', 'tele'], ['ip', 'IP / streaming', 'Por la red', 'red']], aplica: (v) => { S.salida = v; } };
  }
  return null;
}
function pon(k, v) { if (NUMS[k]) { const [a, b, d] = NUMS[k], n = +v; S[k] = Math.max(a, Math.min(b, isFinite(n) ? +n.toFixed(d) : a)); } else S[k] = v; }
function pide(t) {
  const s = t.toLowerCase().replace(/,/g, '.'); let ok = false, m;
  if ((m = s.match(/(?:a|at)\s*(\d+(?:\.\d+)?)\s*m/))) { S.dist = Math.min(60, Math.max(1.5, +m[1])); ok = true; }
  if ((m = s.match(/(?:escenario|stage|escenari|ancho|width|amplada)\D{0,12}(\d+(?:\.\d+)?)\s*m/)) || (m = s.match(/(\d+(?:\.\d+)?)\s*m\s*(?:de\s*)?(?:escenario|ancho)/))) { S.ancho = Math.min(60, Math.max(1, +m[1])); ok = true; }
  if (/auditori/.test(s)) S.uso = 'auditorio'; else if (/aula|clase|classroom|formaci/.test(s)) S.uso = 'aula'; else if (/directo|stream|retransm|live/.test(s)) S.uso = 'directo'; else if (/reuni|meeting/.test(s)) S.uso = 'reunion';
  if (/p[úu]blico|audience|públic/.test(s)) S.planos = 'publico'; if (/general|wide/.test(s)) S.planos = 'todo';
  if (/voz|voice|veu/.test(s)) S.seg = 'voz';
  return ok || /c[áa]mara|camera|càmera|ptz/.test(s);
}
export default {
  id: 'camaras', nom: 'Cámaras', corto: 'CÁMARAS', ic: 'camara', ejemplo: 'Escríbela: «auditorio, cámara a 12 m del escenario de 8 m»',
  info: 'Cámaras PTZ: el zoom que pide la distancia al ponente, cuántas hacen falta por planos, seguimiento, salida y alimentación.',
  calcula, filas, pasos, pregunta, datos, resultado, cifras, pide,
  reconoce: (t) => /c[áa]mara|camera|càmera|ptz|streaming|retransm/i.test(t),
  esquema: (r, o) => ({ tit: VT === 'lateral' ? 'Vista lateral' : VT === '3d' ? 'Simulación 3D' : 'Plano de cámaras', ic: 'camara', html: VT === 'lateral' ? lateral(r, o) : VT === '3d' ? lienzo3D() : esquema(r, o), extra: pestanas(['planta', 'lateral', '3d'], VT) }),
  escena3d,
  set: pon, num: pon, pm: (k, d) => pon(k, +S[k] + d * 0.5),
  accion: (a) => { if (a === 'reset') S = Object.assign({}, DEF); else if (/^vt:/.test(a)) VT = a.slice(3); }, reset: () => { S = Object.assign({}, DEF); },
};
