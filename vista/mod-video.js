// SYSTEMS · módulo VIDEOCONFERENCIA: por el tamaño de la sala y la gente, el tamaño de pantalla (regla del espectador más lejano),
// la cámara o barra (campo de visión y fondo de sala del fabricante) y la microfonía (cobertura del fabricante).
// Solo con equipos de las listas del panel (AVER, SENNHEISER, XILICA, NUREVA, displays SAMSUNG, LG y CLEVER). GPL-3.0 · mediaservi.com
import { T, N, esc, textos, lee, guarda, togs, num, etq, lang } from './util.js';
import { equipos, esInterno, P } from './listas.js';
import { COL, escala, cota, persona, suelo, etiqueta, lienzo, lienzo3D, pestanas, fmt } from './vt.js';
import { simEscala, accionSim, tex3D } from './simdisp.js';
import { fotoDe, urlFicha } from './fichaprod.js';
import { cuerpo } from './cuerpos.js';
textos({
  'Vista lateral': ['Side view', 'Vista lateral'], 'La sala vista de lado': ['The room seen from the side', 'La sala vista de costat'], 'oído': ['ear', 'oïda'], 'ojos': ['eyes', 'ulls'],
  'VIDEOCONF.': ['VIDEO CONF.', 'VIDEOCONF.'], 'Videoconferencia': ['Video conferencing', 'Videoconferència'],
  'Sala de reuniones: tamaño de pantalla, cámara o barra con su campo de visión y micrófonos por cobertura.': ['Meeting room: screen size, camera or video bar with its field of view, and microphones by coverage.', 'Sala de reunions: mida de pantalla, càmera o barra amb el seu camp de visió i micròfons per cobertura.'],
  'Escríbela: «sala de 6 x 4 m para 10 personas»': ['Type it: “6 x 4 m room for 10 people”', 'Escriu-la: «sala de 6 x 4 m per a 10 persones»'],
  'Sala': ['Room', 'Sala'], 'Ancho (m)': ['Width (m)', 'Amplada (m)'], 'Fondo (m)': ['Depth (m)', 'Fons (m)'], 'Personas': ['People', 'Persones'], 'Primera fila a (m)': ['First row at (m)', 'Primera fila a (m)'],
  'Pantalla': ['Screen', 'Pantalla'], 'Contenido': ['Content', 'Contingut'], 'Vídeo y presentaciones': ['Video and slides', 'Vídeo i presentacions'], 'Documentos y hojas de cálculo': ['Documents and spreadsheets', 'Documents i fulls de càlcul'],
  'Monitor': ['Monitor', 'Monitor'], 'Interactivo': ['Interactive', 'Interactiu'], 'Cuántas pantallas': ['How many screens', 'Quantes pantalles'],
  'Cámara y micrófonos': ['Camera and microphones', 'Càmera i micròfons'], 'Plano de la sala': ['Room plan', 'Planta de la sala'], 'Diagonal mínima': ['Minimum diagonal', 'Diagonal mínima'],
  'Cámara': ['Camera', 'Càmera'], 'Campo de visión necesario': ['Field of view needed', 'Camp de visió necessari'], 'Campo de visión': ['Field of view', 'Camp de visió'], 'Micrófonos': ['Microphones', 'Micròfons'], 'Superficie': ['Area', 'Superfície'],
  'Los de la barra': ['The bar’s own', 'Els de la barra'], 'de techo': ['ceiling', 'de sostre'],
  'Pantalla: el espectador más lejano a {d} m necesita una imagen de al menos {h} m de alto ({k} veces su altura): {p}″ o más.': ['Screen: the farthest viewer at {d} m needs an image at least {h} m high ({k} times its height): {p}″ or more.', 'Pantalla: l\'espectador més llunyà a {d} m necessita una imatge d\'almenys {h} m d\'alt ({k} vegades la seva alçada): {p}″ o més.'],
  'Más grande que cualquier monitor de las listas: mejor una pantalla LED (calcúlala en SCREENS).': ['Larger than any monitor in the lists: better an LED screen (work it out in SCREENS).', 'Més gran que qualsevol monitor de les llistes: millor una pantalla LED (calcula-la a SCREENS).'],
  'Para encuadrar a todos desde la primera fila hacen falta {a}° horizontales; la {m} da {b}°.': ['To frame everyone from the first row you need {a}° horizontally; the {m} gives {b}°.', 'Per enquadrar tothom des de la primera fila calen {a}° horitzontals; la {m} en dona {b}°.'],
  'Comprueba en la ficha de {m} el campo de visión: hacen falta {a}° horizontales.': ['Check the field of view in the {m} datasheet: {a}° horizontal are needed.', 'Comprova a la fitxa de {m} el camp de visió: calen {a}° horitzontals.'],
  'Con más fondo del que cubre la barra, los micrófonos van en el techo: {n} × {m} (hasta {a} m² cada uno).': ['With more depth than the bar covers, the microphones go on the ceiling: {n} × {m} (up to {a} m² each).', 'Amb més fons del que cobreix la barra, els micròfons van al sostre: {n} × {m} (fins a {a} m² cadascun).'],
  'Sala más grande que la que cubren las barras de la lista: cámara PTZ con micrófonos de techo y procesador.': ['Room larger than the bars in the list cover: PTZ camera with ceiling microphones and a processor.', 'Sala més gran que la que cobreixen les barres de la llista: càmera PTZ amb micròfons de sostre i processador.'],
  'El kit {k} lleva el micrófono, el procesador Xilica Solaro QR1 UC (cancelación de eco y USB), el amplificador Sonia Amp y los altavoces Sonia C5. Añade el servicio de configuración y un switch de red PoE.': ['The {k} kit includes the microphone, the Xilica Solaro QR1 UC processor (echo cancellation and USB), the Sonia Amp amplifier and the Sonia C5 loudspeakers. Add the configuration service and a PoE network switch.', 'El kit {k} porta el micròfon, el processador Xilica Solaro QR1 UC (cancel·lació d\'eco i USB), l\'amplificador Sonia Amp i els altaveus Sonia C5. Afegeix el servei de configuració i un switch de xarxa PoE.'],
  'Varios micrófonos de techo: procesador Xilica Solaro con cancelación de eco y un switch de red PoE; Xilica se cotiza por proyecto, con su configuración.': ['Several ceiling microphones: Xilica Solaro processor with echo cancellation and a PoE network switch; Xilica is quoted per project, with its configuration.', 'Diversos micròfons de sostre: processador Xilica Solaro amb cancel·lació d\'eco i un switch de xarxa PoE; Xilica es cotitza per projecte, amb la seva configuració.'],
  'Si además hay que sonorizar la sala (vídeo, música o refuerzo de voz): Nureva HDX, consultar precio y plazo.': ['If the room also needs a sound system (video, music or speech reinforcement): Nureva HDX, ask for price and lead time.', 'Si a més cal sonoritzar la sala (vídeo, música o reforç de veu): Nureva HDX, consultar preu i termini.'],
  'Barra de vídeo': ['Video bar', 'Barra de vídeo'], 'hasta {f} m de fondo': ['up to {f} m deep', 'fins a {f} m de fons'],
  '¿Cuánto mide la sala?': ['How big is the room?', 'Quant fa la sala?'], '¿Cuántas personas?': ['How many people?', 'Quantes persones?'], '¿Qué se ve en la pantalla?': ['What is shown on screen?', 'Què es veu a la pantalla?'], '¿Qué pantalla?': ['Which screen?', 'Quina pantalla?'],
  'Solo se ve': ['Display only', 'Només es veu'], 'Táctil, se escribe encima': ['Touch, you can write on it', 'Tàctil, s\'hi escriu a sobre'], 'personas': ['people', 'persones'],
  /* v3.1 */
  'Alto (m)': ['Height (m)', 'Alçada (m)'], 'Espectador más lejano a (m)': ['Farthest viewer at (m)', 'Espectador més llunyà a (m)'], 'Proyección': ['Projection', 'Projecció'],
  'Alternativa interactiva': ['Interactive alternative', 'Alternativa interactiva'], 'Sí': ['Yes', 'Sí'], 'No': ['No', 'No'], 'Blanca': ['White', 'Blanca'],
  'Pantalla de proyección': ['Projection screen', 'Pantalla de projecció'], 'Calcular el proyector en SCREENS': ['Work out the projector in SCREENS', 'Calcular el projector a SCREENS'],
  'Pantalla de proyección blanca 16:9 de {w} × {h} m ({p}″), borde de abajo a {b} m': ['16:9 white projection screen, {w} × {h} m ({p}″), bottom edge at {b} m', 'Pantalla de projecció blanca 16:9 de {w} × {h} m ({p}″), vora inferior a {b} m'],
  'Proyección: pantalla blanca 16:9 de {w} × {h} m ({p}″), con el borde de abajo a {b} m del suelo. El proyector, su óptica y su luminosidad se calculan en SCREENS.': ['Projection: 16:9 white screen, {w} × {h} m ({p}″), with its bottom edge {b} m above the floor. The projector, its lens and its brightness are worked out in SCREENS.', 'Projecció: pantalla blanca 16:9 de {w} × {h} m ({p}″), amb la vora inferior a {b} m del terra. El projector, la seva òptica i la seva lluminositat es calculen a SCREENS.'],
  'Con {a} m de techo, la imagen no puede pasar de {h} m de alto ({p}″): se ve bien hasta {d} m. Para los de más atrás, letra y gráficos más grandes o una segunda pantalla de repetición.': ['With a {a} m ceiling, the image cannot be taller than {h} m ({p}″): it reads well up to {d} m. For those further back, larger text and graphics or a second repeater screen.', 'Amb {a} m de sostre, la imatge no pot passar de {h} m d\'alt ({p}″): es veu bé fins a {d} m. Per als de més enrere, lletra i gràfics més grans o una segona pantalla de repetició.'],
  'Más grande que cualquier monitor de las listas: proyección o pantalla LED (calcúlalas en SCREENS).': ['Larger than any monitor in the lists: projection or an LED screen (work them out in SCREENS).', 'Més gran que qualsevol monitor de les llistes: projecció o pantalla LED (calcula-les a SCREENS).'],
  'Más grande que cualquier interactivo de las listas: proyección o pantalla LED (calcúlalas en SCREENS).': ['Larger than any interactive display in the lists: projection or an LED screen (work them out in SCREENS).', 'Més gran que qualsevol interactiu de les llistes: projecció o pantalla LED (calcula-les a SCREENS).'],
  'La {m} no cabe bajo el techo de {a} m con su borde de abajo a una altura cómoda.': ['The {m} does not fit under the {a} m ceiling with its bottom edge at a comfortable height.', 'La {m} no cap sota el sostre de {a} m amb la vora inferior a una alçada còmoda.'],
  'Alternativa: pantalla interactiva de {p}″ ({m}). Su imagen mide {h} m de alto y se ve bien hasta {d} m; el espectador más lejano está a {D} m.': ['Alternative: {p}″ interactive display ({m}). Its image is {h} m high and reads well up to {d} m; the farthest viewer is at {D} m.', 'Alternativa: pantalla interactiva de {p}″ ({m}). La seva imatge fa {h} m d\'alt i es veu bé fins a {d} m; l\'espectador més llunyà és a {D} m.'],
  'Para que la interactiva sirva a toda la sala haría falta una de {p}″ ({m}); la de {q}″ sirve para trabajar de cerca, delante de la pantalla.': ['For the interactive display to serve the whole room it would need to be {p}″ ({m}); the {q}″ one is for working up close, in front of the screen.', 'Perquè la interactiva serveixi a tota la sala caldria una de {p}″ ({m}); la de {q}″ serveix per treballar de prop, davant de la pantalla.'],
  'Ningún interactivo de las listas llega a esa distancia: la de {q}″ sirve para trabajar de cerca, delante de la pantalla, no para toda la sala.': ['No interactive display in the lists reaches that distance: the {q}″ one is for working up close, in front of the screen, not for the whole room.', 'Cap interactiu de les llistes arriba a aquesta distància: la de {q}″ serveix per treballar de prop, davant de la pantalla, no per a tota la sala.'],
  'No hay ninguna pantalla interactiva de {p}″ en las listas.': ['There is no {p}″ interactive display in the lists.', 'No hi ha cap pantalla interactiva de {p}″ a les llistes.'],
  'alternativa': ['alternative', 'alternativa'], 'Pulgadas': ['Inches', 'Polzades'], 'Automático': ['Automatic', 'Automàtic'],
  'La pantalla de {p}″ pedida se queda pequeña: se ve bien hasta {d} m y el espectador más lejano está a {D} m.': ['The requested {p}″ screen is too small: it reads well up to {d} m and the farthest viewer is at {D} m.', 'La pantalla de {p}″ demanada es queda petita: es veu bé fins a {d} m i l\'espectador més llunyà és a {D} m.'],
  'No hay ninguna pantalla de {p}″ de este tipo en las listas: se propone la que pide la sala.': ['There is no {p}″ screen of this type in the lists: the one the room needs is proposed.', 'No hi ha cap pantalla de {p}″ d\'aquest tipus a les llistes: es proposa la que demana la sala.'], 'se ve bien hasta {d} m': ['reads well up to {d} m', 'es veu bé fins a {d} m'], 'hasta {d} m': ['up to {d} m', 'fins a {d} m'],
  'Espectador más lejano': ['Farthest viewer', 'Espectador més llunyà'], 'Dato de la petición': ['From the request', 'Dada de la petició'], 'Por el fondo de la sala': ['From the room depth', 'Pel fons de la sala'],
  'Alto máximo de imagen': ['Maximum image height', 'Alçada màxima d\'imatge'], 'Techo': ['Ceiling', 'Sostre'], 'Alternativa': ['Alternative', 'Alternativa'], 'Sin alternativa': ['No alternative', 'Sense alternativa'],
  '¿Habrá videoconferencia?': ['Will there be video conferencing?', 'Hi haurà videoconferència?'], 'Cámara y micrófonos': ['Camera and microphones', 'Càmera i micròfons'], 'Solo presentaciones': ['Presentations only', 'Només presentacions'], 'Proyector y pantalla blanca': ['Projector and white screen', 'Projector i pantalla blanca'],
});
/* v3.1 · alto de la sala, distancia del espectador más lejano (0 = la del fondo de la sala), proyección como tercer tipo de pantalla,
   videoconferencia que se puede quitar (sala solo de presentaciones) y una pantalla interactiva como alternativa para comparar */
const DEF = { ancho: 4, fondo: 6, alto: 2.8, dist: 0, pers: 8, fila: 1.5, cont: 'video', tipo: 'monitor', np: 1, vc: true, alt: 0, pulg: 0 };
let S = Object.assign({}, DEF, lee('systems_video') || {});
const NUMS = { ancho: [1.5, 30, 1], fondo: [1.5, 40, 1], alto: [2, 10, 2], dist: [0, 40, 1], pers: [1, 200, 0], fila: [0.5, 6, 1], np: [1, 2, 0], alt: [0, 98, 0], pulg: [0, 120, 0] };
const MED = [32, 43, 50, 55, 65, 75, 86, 98, 105, 110, 115];
const ALTS = [0, 55, 65, 75, 86];
const H169 = 0.4903, W169 = 0.8716;   /* alto y ancho de una imagen 16:9 por unidad de diagonal */
const PROY = () => S.tipo === 'proyeccion';
/* el espectador más lejano: el que dice la petición (sin pasar del fondo) o, si no lo dice, el fondo de la sala menos el margen de la pared */
const dLejos = () => { const auto = Math.max(1, S.fondo - P('video.margenPantalla', 0.3)); return S.dist > 0 ? Math.max(1, Math.min(S.dist, S.fondo)) : auto; };
/* borde de abajo de la imagen: en proyección, por encima de las cabezas; en un monitor, centrado a 1,3 m sin bajar de 0,75 m. Nunca pasa del techo */
const BORDE = () => PROY() ? P('video.bordeProyeccion', 1) : P('video.bordeMonitor', 0.75);
const TECHO = () => S.alto - P('video.margenTecho', 0.1);
const hTope = () => Math.max(0.3, TECHO() - BORDE());
const bajoDe = (h) => { const b = PROY() ? BORDE() : Math.max(BORDE(), P('video.centroMonitor', 1.3) - h / 2); return Math.max(0.3, Math.min(b, TECHO() - h)); };
/* v3.1 · SEMÁFORO de cada solución: verde si se ve bien hasta el espectador más lejano, ámbar si casi (desde el 80 %, BRIAN), rojo si no */
const semDe = (dOk, dLej) => dOk >= dLej - 0.05 ? 'v' : dOk >= P('video.semaforoAmbar', 0.8) * dLej ? 'a' : 'r';
const conSem = (html, sem, extra = '') => sem ? html.replace('<div class="equipo', `<div class="equipo sem-${sem}${extra}`) : html;
const porDetras = (x, y) => x.pulgadas - y.pulgadas || (y.stock ? 1 : 0) - (x.stock ? 1 : 0) || (y.horas === '16/7' ? 0 : 1) - (x.horas === '16/7' ? 0 : 1);

function calcula() {
  const av = [], r = { av };
  const dLej = dLejos(), k = S.cont === 'detalle' ? P('video.factorDocumentos', 4) : P('video.factorVideo', 6),   /* v2.2 · BRIAN */ h = dLej / k, diag = h / H169 / 0.0254;
  r.dLej = dLej; r.h = h; r.diag = diag; r.k = k; r.hTope = hTope();
  r.pulg = Math.ceil(diag);
  av.push(['info', T('Pantalla: el espectador más lejano a {d} m necesita una imagen de al menos {h} m de alto ({k} veces su altura): {p}″ o más.', { d: N(dLej, 1), h: N(h, 2), k, p: r.pulg })]);
  /* el techo manda: una imagen más alta que lo que cabe entre el borde de abajo y el techo no se puede poner */
  if (h > r.hTope + 0.005) { const p = Math.floor(r.hTope / H169 / 0.0254);
    av.push(['', T('Con {a} m de techo, la imagen no puede pasar de {h} m de alto ({p}″): se ve bien hasta {d} m. Para los de más atrás, letra y gráficos más grandes o una segunda pantalla de repetición.', { a: N(S.alto, 2), h: N(r.hTope, 2), p, d: N(r.hTope * k, 1) })]); }
  if (PROY()) {
    /* v3.1 · proyección: la pantalla blanca 16:9 que pide el espectador más lejano, limitada por el techo; el proyector se calcula en SCREENS */
    const hp = Math.min(h, r.hTope), dp = h > r.hTope ? Math.floor(hp / H169 / 0.0254) : Math.ceil(hp / H169 / 0.0254 - 0.01);
    r.proy = { h: dp * 0.0254 * H169, w: dp * 0.0254 * W169, diag: dp, bajo: bajoDe(dp * 0.0254 * H169) };
    r.pulg = dp; r.disp = null; r.altsD = [];
    av.push(['info', T('Proyección: pantalla blanca 16:9 de {w} × {h} m ({p}″), con el borde de abajo a {b} m del suelo. El proyector, su óptica y su luminosidad se calculan en SCREENS.', { w: N(r.proy.w, 2), h: N(r.proy.h, 2), p: dp, b: N(r.proy.bajo, 2) })]);
  } else {
    const D = equipos('display').filter((x) => (S.tipo === 'interactivo' ? x.uso === 'interactivo' : x.uso === 'pared') && x.pulgadas);
    let ok = D.filter((x) => x.pulgadas >= diag - 1).sort(porDetras);
    /* v3.1 · las pulgadas que pide el cliente mandan; si se quedan cortas, se avisa de hasta dónde se ve bien */
    if (S.pulg > 0) { const pe = D.filter((x) => x.pulgadas === S.pulg).sort(porDetras);
      if (pe.length) { ok = pe; if (S.pulg < diag - 1) av.push(['', T('La pantalla de {p}″ pedida se queda pequeña: se ve bien hasta {d} m y el espectador más lejano está a {D} m.', { p: S.pulg, d: N(S.pulg * 0.0254 * H169 * k, 1), D: N(dLej, 1) })]); }
      else av.push(['', T('No hay ninguna pantalla de {p}″ de este tipo en las listas: se propone la que pide la sala.', { p: S.pulg })]); }
    r.disp = ok[0] || null; r.altsD = ok.filter((x) => r.disp && x.pulgadas === r.disp.pulgadas && x !== r.disp).slice(0, 3);
    if (!r.disp) av.push(['', T(S.tipo === 'interactivo' ? 'Más grande que cualquier interactivo de las listas: proyección o pantalla LED (calcúlalas en SCREENS).' : 'Más grande que cualquier monitor de las listas: proyección o pantalla LED (calcúlalas en SCREENS).')]);
    else { const cu = cuerpo(r.disp), hc = cu ? cu.H : r.disp.pulgadas * 0.0254 * H169; if (bajoDe(hc) + hc > TECHO() + 0.005) av.push(['', T('La {m} no cabe bajo el techo de {a} m con su borde de abajo a una altura cómoda.', { m: r.disp.modelo, a: N(S.alto, 2) })]); }
  }
  /* v3.1 · alternativa para comparar: una pantalla interactiva de las pulgadas pedidas, con hasta dónde se ve bien */
  r.altI = null; r.altIs = [];
  if (S.alt > 0 && S.tipo !== 'interactivo') {
    const I = equipos('display').filter((x) => x.uso === 'interactivo' && x.pulgadas);
    const de = I.filter((x) => x.pulgadas === S.alt).sort(porDetras);
    r.altI = de[0] || null; r.altIs = de.slice(1, 3);
    if (r.altI) { const hi = S.alt * 0.0254 * H169; r.altDok = hi * k;
      const corto = r.altDok + 0.05 < dLej;
      av.push([corto ? '' : 'info', T('Alternativa: pantalla interactiva de {p}″ ({m}). Su imagen mide {h} m de alto y se ve bien hasta {d} m; el espectador más lejano está a {D} m.', { p: S.alt, m: r.altI.marca + ' ' + r.altI.modelo, h: N(hi, 2), d: N(r.altDok, 1), D: N(dLej, 1) })]);
      if (corto) { const g = I.filter((x) => x.pulgadas >= diag - 1).sort(porDetras)[0];
        av.push(['', g ? T('Para que la interactiva sirva a toda la sala haría falta una de {p}″ ({m}); la de {q}″ sirve para trabajar de cerca, delante de la pantalla.', { p: g.pulgadas, m: g.marca + ' ' + g.modelo, q: S.alt })
          : T('Ningún interactivo de las listas llega a esa distancia: la de {q}″ sirve para trabajar de cerca, delante de la pantalla, no para toda la sala.', { q: S.alt })]); } }
    else av.push(['', T('No hay ninguna pantalla interactiva de {p}″ en las listas.', { p: S.alt })]);
  }
  /* semáforo de la pantalla principal y de la alternativa */
  if (r.proy) r.semP = semDe(r.proy.h * k, dLej);
  else if (r.disp) { const hi = r.disp.pulgadas * 0.0254 * H169; r.semP = semDe(hi * k, dLej); }
  else r.semP = 'r';
  if (r.altI) r.semA = semDe(r.altDok, dLej);
  r.cam = null; r.mic = null; r.kit = null; r.nureva = null; r.ptz = false;
  r.fov = 2 * Math.atan((S.ancho / 2) / Math.max(0.5, S.fila)) * 180 / Math.PI; r.area = S.ancho * S.fondo;
  if (S.vc) camYmic(r, av);
  r.sem = av.some((a) => !a[0]) ? 'A' : 'V';
  r.semTxt = r.sem === 'A' ? T('Hay solución, con avisos') : T('Hay solución');
  const pant = r.proy ? T('Proyección') + ' ' + r.proy.diag + '″' : r.disp ? r.disp.marca + ' ' + r.disp.modelo + ' ' + r.disp.pulgadas + '″' : r.pulg + '″';
  const pantC = r.proy ? T('Proyección') + ' ' + r.proy.diag + '″' : r.disp ? r.disp.modelo + ' ' + r.disp.pulgadas + '″' : r.pulg + '″';
  const resto = S.vc ? [r.cam ? r.cam.modelo : '', r.mic ? r.nmic + ' × ' + r.mic.modelo : T('Los de la barra')] : [];
  const altT = r.altI ? T('alternativa') + ' ' + r.altI.modelo + ' ' + S.alt + '″' : '';
  r.lineaTxt = [pant, ...resto, altT].filter(Boolean).join(' · ');
  r.linea = [`<b>${esc(pantC)}</b>`, ...(S.vc ? [esc(r.cam ? r.cam.modelo : '—'), esc(r.mic ? r.nmic + ' × ' + r.mic.modelo : T('Los de la barra'))] : []), altT ? esc(altT) : ''].filter(Boolean).join(' · ');
  guarda('systems_video', S); return r;
}
/* cámara y micrófonos (solo con videoconferencia) */
function camYmic(r, av) {
  /* cámara: la barra más pequeña cuyo fondo de sala llega; si ninguna, PTZ */
  r.fov = 2 * Math.atan((S.ancho / 2) / Math.max(0.5, S.fila)) * 180 / Math.PI;
  const B = equipos('barra-vc').filter((x) => x.fondoMax).sort((a, b) => a.fondoMax - b.fondoMax);
  r.cam = B.find((x) => x.fondoMax >= S.fondo) || null;
  if (!r.cam) { r.cam = equipos('camara').find((x) => /CAM570/.test(x.id)) || equipos('camara')[0] || null; r.ptz = true; av.push(['', T('Sala más grande que la que cubren las barras de la lista: cámara PTZ con micrófonos de techo y procesador.')]); }
  if (r.cam) { const fh = r.cam.fovH || (r.cam.fovD ? Math.round(r.cam.fovD * 0.87) : 0);
    if (fh && fh < r.fov) av.push(['', T('Para encuadrar a todos desde la primera fila hacen falta {a}° horizontales; la {m} da {b}°.', { a: Math.round(r.fov), m: r.cam.modelo, b: fh })]);
    else if (!fh) av.push(['info', T('Comprueba en la ficha de {m} el campo de visión: hacen falta {a}° horizontales.', { m: r.cam.modelo, a: Math.round(r.fov) })]); }
  /* micrófonos: los de la barra mientras su fondo llega; si no, de techo por superficie */
  r.area = S.ancho * S.fondo;
  if (r.ptz || (r.cam && r.cam.fondoMax && r.cam.fondoMax < S.fondo)) {
    const M = equipos('microfono').filter((x) => x.m2).sort((a, b) => a.m2 - b.m2), m = M.find((x) => x.m2 >= r.area) || M[M.length - 1];
    if (m) { r.mic = m; r.nmic = Math.ceil(r.area / m.m2);
      /* v2.0 · kit completo (micrófono + Xilica Solaro QR1 UC + Sonia Amp + Sonia C5) por superficie, según información del fabricante */
      r.kit = r.nmic === 1 ? equipos('kit-audio', 'SENNHEISER').filter((x) => x.m2 && x.m2 >= r.area).sort((a, b) => a.m2 - b.m2)[0] || null : null;
      av.push(['info', T('Con más fondo del que cubre la barra, los micrófonos van en el techo: {n} × {m} (hasta {a} m² cada uno).', { n: r.nmic, m: m.modelo, a: m.m2 })]);
      if (r.kit) av.push(['info', T('El kit {k} lleva el micrófono, el procesador Xilica Solaro QR1 UC (cancelación de eco y USB), el amplificador Sonia Amp y los altavoces Sonia C5. Añade el servicio de configuración y un switch de red PoE.', { k: r.kit.modelo })]);
      else av.push(['info', T('Varios micrófonos de techo: procesador Xilica Solaro con cancelación de eco y un switch de red PoE; Xilica se cotiza por proyecto, con su configuración.')]); }
  }
  /* alternativa de audio: el sistema NUREVA que cubre la sala (ancho y fondo del fabricante) */
  if (r.mic && r.area > 60) av.push(['info', T('Si además hay que sonorizar la sala (vídeo, música o refuerzo de voz): Nureva HDX, consultar precio y plazo.')]);
  if (r.mic) r.nureva = equipos('audio-vc', 'NUREVA').filter((x) => x.salaAncho && Math.min(x.salaAncho, x.salaFondo) >= Math.min(S.ancho, S.fondo) && Math.max(x.salaAncho, x.salaFondo) >= Math.max(S.ancho, S.fondo)).sort((a, b) => a.salaAncho * a.salaFondo - b.salaAncho * b.salaFondo)[0] || null;
}


/* v2.5 · simulación 3D: pantalla a su altura, cámara o barra con su campo de visión, mesa, público y micrófonos de techo */
function escena3d(V, r) {
  const A = S.ancho, F = S.fondo, H = S.alto, p = r.disp ? r.disp.pulgadas : r.pulg, cu = r.disp ? cuerpo(r.disp) : null, w = cu ? cu.W : p * 0.0254 * W169, h = cu ? cu.H : p * 0.0254 * H169, bajo = bajoDe(h);
  V.sala(A, F, H);
  for (let i = 0; i < S.np; i++) V.pantalla(w, h, (i - (S.np - 1) / 2) * (w + 0.2), bajo, 0, i === 0 ? (r.disp ? r.disp.modelo + ' · ' : r.proy ? T('Proyección') + ' · ' : '') + p + '″' : '', { tex: tex3D(), cuerpo: cu });
  const hc = bajo + h + 0.1, fh = r.cam ? (r.cam.fovH || (r.cam.fovD ? r.cam.fovD * 0.87 : 80)) : 80;
  if (r.cam) { V.caja(r.ptz ? 0.18 : 0.6, 0.1, 0.1, 0, hc, 0.08, 0x1b1b1e, { metal: 0.6 }); V.cono([0, hc, 0.15], [0, 1.1, F - 0.3], fh, 0x00b4ff, 0.08); V.etiqueta(r.cam.modelo, 0, hc + 0.8, 0.2, 0.36); }
  const x1 = Math.min(S.fila, F - 0.6), x2 = Math.max(x1 + 0.6, F - 0.6), tw = Math.min(A * 0.4, 1.4);
  V.caja(tw, 0.05, x2 - x1, 0, 0.74, (x1 + x2) / 2, 0x3a3b42, { rough: 0.6 });
  const lado = Math.max(1, Math.ceil(S.pers / 2)); for (let i = 0; i < Math.min(S.pers, 30); i++) { const izq = i % 2 === 0, j = Math.floor(i / 2), z = x1 + (j + .5) * (x2 - x1) / lado; V.persona(izq ? -tw / 2 - 0.4 : tw / 2 + 0.4, z, izq ? Math.PI / 2 : -Math.PI / 2, 0.6); }
  if (r.mic) { const rr = Math.sqrt(r.mic.m2 / Math.PI); for (let i = 0; i < r.nmic; i++) { const z = F * (i + .5) / r.nmic; V.caja(0.5, 0.04, 0.5, 0, H - 0.02, z, 0x00ff04, { emis: 0.3 }); V.cono([0, H - 0.05, z], [0, 1.1, z], 2 * Math.atan(rr / (H - 1.1)) * 180 / Math.PI, 0x00ff04, 0.06); } }
}
/* v2.8 · simulación a escala (la de SCREENS): la pared frontal con la pantalla a su tamaño y altura, con contenido, la barra o la cámara encima,
   la persona de 1,75 m y la foto oficial de cada equipo, que abre su ficha */
function aEscala(r, o) {
  const p = r.disp ? r.disp.pulgadas : r.pulg, cu = r.disp ? cuerpo(r.disp) : null, w = cu ? cu.W : p * 0.0254 * W169, h = cu ? cu.H : p * 0.0254 * H169, bajo = bajoDe(h), gap = 0.2;
  const paneles = []; for (let i = 0; i < S.np; i++) paneles.push({ x: i * (w + gap), y: bajo, w, h, cu });
  const W = S.np * w + (S.np - 1) * gap, extras = [];
  if (r.cam) { const cw = r.ptz ? 0.17 : Math.min(0.9, W * 0.6), ch = r.ptz ? 0.17 : 0.075; extras.push({ x: W / 2 - cw / 2, y: bajo + h + 0.05, w: cw, h: ch, txt: r.cam.modelo }); }
  const ft = [r.disp && { url: fotoDe(r.disp), href: urlFicha(r.disp.id), nombre: r.disp.marca + ' ' + r.disp.modelo }, r.cam && { url: fotoDe(r.cam), href: urlFicha(r.cam.id), nombre: r.cam.marca + ' ' + r.cam.modelo }];
  return simEscala({ paneles, marco: 0.012, W, H: h + (r.cam ? 0.3 : 0), base: bajo, vw: false, extras, etiqueta: (r.disp ? r.disp.marca + ' ' + r.disp.modelo + ' · ' : r.proy ? T('Proyección') + ' · ' : '') + p + '″' + (r.cam ? ' · ' + r.cam.modelo : '') }, ft, o);
}
/* v2.3 · vista LATERAL como las de SCREENS: la pantalla a su altura, la cámara encima, la mesa y la mirada del espectador más lejano */
let VT = 'planta';
function lateral(r, o = {}) {
  const mov = !!o.vertical, VW = mov ? 480 : 960, VH = 520, F = S.fondo, AL = S.alto, OJO = 1.2;
  const p = r.disp ? r.disp.pulgadas : r.pulg, h = p * 0.0254 * H169, bajo = bajoDe(h), arriba = bajo + h;
  const E = escala(VW, VH, { l: 64, r: 64, t: 56, b: 70 }, -0.4, F + 0.3, 0, Math.max(AL, arriba + 0.5)), { X, Y, k } = E;
  let g = suelo(X, Y, -0.4, F + 0.3) + `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(Math.max(AL, arriba + 0.4))}" stroke="${COL.pared}" stroke-width="4"/><line x1="${X(F)}" y1="${Y(0)}" x2="${X(F)}" y2="${Y(AL)}" stroke="${COL.linea}" stroke-width="2"/>`;
  g += `<rect x="${X(0.02)}" y="${Y(arriba)}" width="${Math.max(4, 0.07 * k)}" height="${h * k}" fill="${COL.imagenB}"/>`;
  const hc = arriba + 0.1; if (r.cam) g += `<rect x="${X(0.02)}" y="${Y(hc) - 7}" width="${Math.max(10, 0.12 * k)}" height="14" rx="3" fill="${COL.equipo}" stroke="${COL.rangoB}" stroke-width="2"/>`;
  const x1 = Math.min(S.fila, F - 0.6), x2 = Math.max(x1 + 0.6, F - 0.6);
  g += `<rect x="${X(x1)}" y="${Y(0.75)}" width="${(x2 - x1) * k}" height="${Math.max(4, 0.05 * k)}" fill="${COL.linea}"/><line x1="${X((x1 + x2) / 2)}" y1="${Y(0.72)}" x2="${X((x1 + x2) / 2)}" y2="${Y(0)}" stroke="${COL.linea}" stroke-width="3"/>`;
  const dL = r.dLej; g += `<path d="M${X(dL)} ${Y(OJO)} L${X(0.09)} ${Y(arriba)} L${X(0.09)} ${Y(bajo)} Z" fill="${COL.haz}" stroke="rgba(255,214,0,.5)"/>`;
  [x1, dL].forEach((x) => { g += `<circle cx="${X(x)}" cy="${Y(OJO)}" r="5" fill="${COL.lente}"/>`; });
  if (r.cam) g += `<line x1="${X(0.1)}" y1="${Y(hc)}" x2="${X(dL)}" y2="${Y(OJO)}" stroke="${COL.rangoB}" stroke-dasharray="5 5"/>`;
  g += persona(X, Y, F - 0.35, k, 0.45) + etiqueta(X(dL) - 10, Y(OJO) + 26, T('ojos') + ' ' + fmt(OJO), 'end', 'vt-ver');
  g += cota(X(0), Y(0) + 24, X(dL), Y(0) + 24, fmt(dL) + ' m', 1) + cota(X(0), Y(0) + 50, X(F), Y(0) + 50, fmt(F) + ' m', 1);
  g += cota(X(0) - 16, Y(0), X(0) - 16, Y(bajo), fmt(bajo)) + cota(X(0) - 16, Y(bajo), X(0) - 16, Y(arriba), fmt(h));
  if (r.cam) g += etiqueta(X(0.02) + 20, Y(hc) - 12, r.cam.modelo, 'start', 'vt-azu');
  if (r.disp || r.pulg) g += etiqueta(X(0.02) + 20, Y((bajo + arriba) / 2) + 6, (r.disp ? r.disp.modelo + ' · ' : r.proy ? T('Proyección') + ' · ' : '') + p + '″', 'start', 'vt-ama');
  return lienzo(VW, VH, g, 'La sala vista de lado');
}
function esquema(r, o = {}) {
  const mov = !!o.vertical, VW = mov ? 480 : 960, VH = mov ? 520 : 520, pad = 40;
  const k = Math.min((VW - 2 * pad) / S.ancho, (VH - 2 * pad - 20) / S.fondo), w = S.ancho * k, h = S.fondo * k, x0 = (VW - w) / 2, y0 = pad;
  let s = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="var(--linea)" stroke-width="3"/>`;
  const pw = Math.min(w * .8, (r.disp ? r.disp.pulgadas : r.pulg) * 0.0254 * 0.8716 * k * S.np + (S.np - 1) * 10);
  s += `<rect x="${x0 + (w - pw) / 2}" y="${y0 - 8}" width="${pw}" height="10" rx="2" fill="var(--verde-txt)"/><text x="${x0 + w / 2}" y="${y0 - 14}" text-anchor="middle" font-size="14" class="t-mono">${esc((r.disp ? r.disp.modelo + ' · ' : r.proy ? T('Proyección') + ' · ' : '') + (r.disp ? r.disp.pulgadas : r.pulg) + '″')}</text>`;
  const cx = x0 + w / 2, cy = y0 + 8, a = r.fov / 2 * Math.PI / 180, L = Math.min(h - 10, S.fondo * k);
  const fh = r.cam ? (r.cam.fovH || (r.cam.fovD ? r.cam.fovD * .87 : 0)) : 0;
  if (fh) { const b = fh / 2 * Math.PI / 180; s += `<path d="M${cx} ${cy} L ${cx - Math.tan(b) * L} ${cy + L} L ${cx + Math.tan(b) * L} ${cy + L} Z" fill="var(--azul)" fill-opacity=".12" stroke="var(--azul)" stroke-dasharray="6 5"/>`; }
  if (r.cam) s += `<path d="M${cx} ${cy} L ${x0 + 4} ${y0 + S.fila * k} M${cx} ${cy} L ${x0 + w - 4} ${y0 + S.fila * k}" stroke="var(--ambar)" stroke-width="2"/>`;
  if (r.cam) s += `<circle cx="${cx}" cy="${cy}" r="7" fill="var(--azul)"/><text x="${cx + 12}" y="${cy + 22}" font-size="13" class="t-mono">${esc((r.cam ? r.cam.modelo : '') + ' · ' + Math.round(r.fov) + '°')}</text>`;
  /* mesa y personas */
  const tx = x0 + w * .3, tw = w * .4, ty = y0 + S.fila * k, th = Math.max(20, h - S.fila * k - 0.8 * k);
  s += `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="10" fill="var(--blk2)" stroke="var(--linea)"/>`;
  const lado = Math.max(1, Math.ceil(S.pers / 2)); for (let i = 0; i < Math.min(S.pers, 40); i++) { const izq = i % 2 === 0, j = Math.floor(i / 2), py = ty + (j + .5) * th / lado; s += `<circle cx="${izq ? tx - 12 : tx + tw + 12}" cy="${py}" r="7" fill="var(--violeta)"/>`; }
  if (r.mic) { const rr = Math.sqrt(r.mic.m2 / Math.PI) * k; for (let i = 0; i < r.nmic; i++) { const my = y0 + h * (i + .5) / r.nmic; s += `<circle cx="${cx}" cy="${my}" r="${rr}" fill="var(--verde)" fill-opacity=".08" stroke="var(--verde)" stroke-dasharray="4 4"/><rect x="${cx - 9}" y="${my - 9}" width="18" height="18" fill="var(--verde)"/>`; } }
  /* v3.1 · el espectador más lejano, a su distancia */
  if (r.dLej < S.fondo - 0.05) { const yl = y0 + r.dLej * k; s += `<line x1="${x0 + 4}" y1="${yl}" x2="${x0 + w - 4}" y2="${yl}" stroke="var(--ambar)" stroke-dasharray="7 5" stroke-width="2"/><text x="${x0 + w + 8}" y="${yl + 5}" font-size="13" class="t-mono" style="fill:var(--txt)">${esc(N(r.dLej, 1) + ' m')}</text>`; }
  s += `<text x="${x0 + w / 2}" y="${y0 + h + 22}" text-anchor="middle" font-size="14" class="t-mono t-ten">${esc(N(S.ancho, 1) + ' × ' + N(S.fondo, 1) + ' m · ' + S.pers + ' ' + T('personas'))}</text>`;
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${esc(T('Plano de la sala'))}" preserveAspectRatio="xMidYMid meet">${s}</svg>`;
}
const eq = (x, n, tit, rec, extra = '') => x ? `<div class="equipo${rec ? ' rec' : ''}"><div class="eq-cab"><b>${esc(x.modelo)}</b><span class="serie">${esc(x.marca)}${tit ? ' · ' + esc(T(tit)) : ''}</span>${rec ? `<span class="etq">${T('Recomendado').toUpperCase()}</span>` : ''}</div><table class="despiece"><tr><td>${n}×</td><td class="ref">${esc(x.id)}</td><td class="des">${esc(x.descripcion || '')}${extra}${x.stock && esInterno() ? '<span class="st-int"> · ' + esc(T('En stock')) + '</span>' : ''}</td></tr></table></div>` : '';
/* v3.1 · enlace a SCREENS con la pantalla ya puesta: una imagen de proyección de ese tamaño, a esa altura, con el techo y el público
   a la distancia del espectador más lejano (el mismo «#c=» que usa COMPARTIR en SCREENS) */
function enlaceScreens(r) {
  if (!r.proy) return '';
  const o = { cantidad: 'una', tecnologia: 'proy', esp: { tipo: 'sueltas', sueltas: { n: 1, ancho: +r.proy.w.toFixed(3), alto: +r.proy.h.toFixed(3), elev: +r.proy.bajo.toFixed(2), dist: +r.dLej.toFixed(1), techo: +S.alto.toFixed(2), formato: '16:9', medPor: 'diag', medVal: r.proy.diag } }, proy: { tipo: 'pared', luzUso: 'reunion' } };
  try { const b = btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return 'https://screens.mediaservi.com/vista/consola.html?modo=una-proy&lang=' + lang() + '#c=' + b; } catch (e) { return ''; }
}
const proyHtml = (r) => r.proy ? `<div class="equipo rec sin-ficha"><div class="eq-cab"><b>${esc(T('Pantalla de proyección'))} ${r.proy.diag}″</b><span class="serie">16:9 · ${esc(T('Blanca'))}</span><span class="etq">${T('Recomendado').toUpperCase()}</span></div><table class="despiece"><tr><td>1×</td><td class="ref">—</td><td class="des">${esc(T('Pantalla de proyección blanca 16:9 de {w} × {h} m ({p}″), borde de abajo a {b} m', { w: N(r.proy.w, 2), h: N(r.proy.h, 2), p: r.proy.diag, b: N(r.proy.bajo, 2) }))}</td></tr></table>${enlaceScreens(r) ? `<a class="ir-scr" href="${esc(enlaceScreens(r))}" target="_blank" rel="noopener">${esc(T('Calcular el proyector en SCREENS'))} →</a>` : ''}</div>` : '';
function resultado(r) {
  let h = `<div class="veredicto ${r.sem === 'A' ? 'aviso' : ''}"><b>${esc(r.semTxt)}</b><p>${esc(r.lineaTxt)}</p></div>`;
  h += conSem(proyHtml(r), r.semP) + conSem(eq(r.disp, S.np, 'Pantalla', true), r.semP);
  if (S.vc) h += eq(r.cam, 1, r.ptz ? 'Cámara' : 'Barra de vídeo', true, r.cam && r.cam.fondoMax ? ' · ' + T('hasta {f} m de fondo', { f: r.cam.fondoMax }) : '') + (r.kit ? eq(r.kit, 1, 'Micrófonos', true) : eq(r.mic, r.nmic, 'Micrófonos', true));
  if (r.av.length) h += `<ul class="avisos">${r.av.map((a) => `<li class="${a[0]}">${esc(a[1])}</li>`).join('')}</ul>`;
  if (r.altI || r.altsD.length || r.nureva) h += `<p class="alt-t">${T('Alternativas')}</p>` + (r.altI ? conSem(eq(r.altI, S.np, 'Alternativa interactiva', false, ' · ' + T('se ve bien hasta {d} m', { d: N(r.altDok, 1) })), r.semA, ' alt-pres') + r.altIs.map((x) => conSem(eq(x, S.np, 'Alternativa interactiva', false), r.semA)).join('') : '') + r.altsD.map((x) => conSem(eq(x, S.np, '', false), r.semP)).join('') + eq(r.nureva, 1, 'Micrófonos', false, r.nureva ? ' · ' + r.nureva.salaAncho + ' × ' + r.nureva.salaFondo + ' m' : '');
  return h;
}
const cifras = (r) => {
  const pant = { t: 'Pantalla', ref: r.disp ? r.disp.id : '', v: r.proy ? T('Proyección') : r.disp ? r.disp.modelo : '—', s: r.proy ? N(r.proy.w, 2) + ' × ' + N(r.proy.h, 2) + ' m' : r.disp ? r.disp.marca + ' · ' + r.disp.pulgadas + '″' : '', ic: 'tele', c: 'var(--azul)' };
  const base = [{ t: 'Diagonal mínima', v: String(r.pulg), u: '″', s: N(r.h, 2) + ' m · ' + N(r.dLej, 1) + ' m', ic: 'tele', c: 'var(--verde-txt)' }, pant];
  const sup = { t: 'Superficie', v: N(r.area, 1), u: 'm²', s: S.pers + ' ' + T('personas'), ic: 'regla', c: 'var(--magenta, #e24bf0)' };
  if (S.vc) return base.concat([
    { t: 'Cámara', v: r.cam ? r.cam.modelo : '—', s: r.cam ? r.cam.marca : '', ic: 'camara', c: 'var(--violeta)' },
    { t: 'Campo de visión', v: String(Math.round(r.fov)), u: '°', s: T('Primera fila a (m)') + ' ' + N(S.fila, 1), ic: 'ojo', c: 'var(--ambar)' },
    { t: 'Micrófonos', v: r.mic ? String(r.nmic) : '—', u: r.mic ? '× ' + T('de techo') : '', s: r.mic ? r.mic.modelo : T('Los de la barra'), ic: 'chispa', c: 'var(--verde)' }, sup]);
  /* v3.1 · sin videoconferencia: el espectador más lejano, el techo y la alternativa interactiva */
  return base.concat([
    { t: 'Espectador más lejano', v: N(r.dLej, 1), u: 'm', s: T(S.dist > 0 ? 'Dato de la petición' : 'Por el fondo de la sala'), ic: 'ojo', c: 'var(--ambar)' },
    { t: 'Alto máximo de imagen', v: N(r.hTope, 2), u: 'm', s: T('Techo') + ' ' + N(S.alto, 2) + ' m', ic: 'regla', c: 'var(--violeta)' },
    { t: 'Alternativa', ref: r.altI ? r.altI.id : '', v: r.altI ? r.altI.modelo : '—', s: r.altI ? S.alt + '″ · ' + T('hasta {d} m', { d: N(r.altDok, 1) }) : T('Sin alternativa'), ic: 'mano', c: r.altI ? ({ v: 'var(--verde)', a: 'var(--ambar)', r: 'var(--rojo)' })[r.semA] : 'var(--tenue)' }, sup]);
};
const TIPOS = [['monitor', 'Monitor'], ['interactivo', 'Interactivo'], ['proyeccion', 'Proyección']];
function datos() {
  return [{ tit: 'Sala', ic: 'regla', ac: 'var(--azul)', html: `<div class="nums">${num('ancho', 'Ancho (m)', S.ancho, 'm', 0.5, 1.5, 30)}${num('fondo', 'Fondo (m)', S.fondo, 'm', 0.5, 1.5, 40)}</div><div class="nums">${num('alto', 'Alto (m)', S.alto, 'm', 0.1, 2, 10)}${num('pers', 'Personas', S.pers, '', 1, 1, 200)}</div>` + num('dist', 'Espectador más lejano a (m)', S.dist > 0 ? S.dist : +dLejos().toFixed(1), 'm', 0.5, 0, 40) + (S.vc ? num('fila', 'Primera fila a (m)', S.fila, 'm', 0.1, 0.5, 6) : '') },
    { tit: 'Pantalla', ic: 'tele', ac: 'var(--verde-txt)', html: etq('Contenido') + togs('cont', [['video', 'Vídeo y presentaciones'], ['detalle', 'Documentos y hojas de cálculo']], S.cont, 'uno') + etq('Pantalla') + togs('tipo', TIPOS, S.tipo, 'tres') + (PROY() ? etq('Cuántas pantallas') + togs('np', [[1, '1'], [2, '2']], S.np, 'dos') : `<div class="par2"><div>${etq('Pulgadas')}${`<select class="sel" data-sel="pulg" aria-label="${esc(T('Pulgadas'))}">${[0, ...new Set(equipos('display').filter((x) => (S.tipo === 'interactivo' ? x.uso === 'interactivo' : x.uso === 'pared') && x.pulgadas).map((x) => x.pulgadas))].sort((a, b) => a - b).map((p) => `<option value="${p}"${p === S.pulg ? ' selected' : ''}>${p ? p + '″' : esc(T('Automático'))}</option>`).join('')}</select>`}</div><div>${etq('Cuántas pantallas')}${togs('np', [[1, '1'], [2, '2']], S.np, 'dos')}</div></div>`) + etq('Videoconferencia') + togs('vc', [[true, 'Sí'], [false, 'No']], S.vc, 'dos') + (S.tipo !== 'interactivo' ? etq('Alternativa interactiva') + togs('alt', ALTS.map((p) => [p, p ? p + '″' : 'No']), S.alt, 'tres cinco') : '') + `<div class="pie-b"><button type="button" data-acc="reset">${esc(T('RESTABLECER'))}</button></div>` }];
}
const nomTipo = () => T((TIPOS.find((x) => x[0] === S.tipo) || TIPOS[0])[1]);
const filas = () => [['sala', 'regla', 'Sala', N(S.ancho, 1) + ' × ' + N(S.fondo, 1) + ' × ' + N(S.alto, 2) + ' m'], ['pers', 'persona', 'Personas', String(S.pers)], ['cont', 'tele', 'Contenido', T(S.cont === 'detalle' ? 'Documentos y hojas de cálculo' : 'Vídeo y presentaciones')], ['tipo', 'mano', 'Pantalla', nomTipo()], ['vc', 'camara', 'Videoconferencia', T(S.vc ? 'Sí' : 'No')]];
const pasos = () => ['sala', 'pers', 'cont', 'tipo', 'vc'];
function pregunta(k) {
  switch (k) {
    case 'sala': return { q: '¿Cuánto mide la sala?', nums: [['ancho', 'Ancho (m)', S.ancho, 1.5, 30, 'm'], ['fondo', 'Fondo (m)', S.fondo, 1.5, 40, 'm'], ['alto', 'Alto (m)', S.alto, 2, 10, 'm']], aplica: (o) => { S.ancho = o.ancho; S.fondo = o.fondo; if (o.alto) S.alto = o.alto; if (S.dist > S.fondo) S.dist = 0; } };
    case 'pers': return { q: '¿Cuántas personas?', val: S.pers, ops: [4, 6, 8, 10, 12, 16, 20, 30].map((n) => [n, String(n), '', 'persona']), aplica: (v) => { S.pers = v; } };
    case 'cont': return { q: '¿Qué se ve en la pantalla?', val: S.cont, ops: [['video', 'Vídeo y presentaciones', '', 'tele'], ['detalle', 'Documentos y hojas de cálculo', '', 'lista']], aplica: (v) => { S.cont = v; } };
    case 'tipo': return { q: '¿Qué pantalla?', val: S.tipo, ops: [['monitor', 'Monitor', 'Solo se ve', 'tele'], ['interactivo', 'Interactivo', 'Táctil, se escribe encima', 'mano'], ['proyeccion', 'Proyección', 'Proyector y pantalla blanca', 'tele']], aplica: (v) => { S.tipo = v; } };
    case 'vc': return { q: '¿Habrá videoconferencia?', val: S.vc, ops: [[true, 'Sí', 'Cámara y micrófonos', 'camara'], [false, 'No', 'Solo presentaciones', 'tele']], aplica: (v) => { S.vc = v === true || v === 'true'; } };
  }
  return null;
}
function pon(k, v) {
  if (k === 'vc') { S.vc = v === true || v === 'true'; return; }
  if (NUMS[k]) { const [a, b, d] = NUMS[k], n = +v; S[k] = Math.max(a, Math.min(b, isFinite(n) ? +n.toFixed(d) : a)); } else S[k] = v;
  if (k === 'dist' && S.dist > 0 && Math.abs(S.dist - (S.fondo - P('video.margenPantalla', 0.3))) < 0.05) S.dist = 0;   /* volver al valor automático */
  if (k === 'fondo' && S.dist > S.fondo) S.dist = 0;
  if (k === 'tipo') { S.pulg = 0; if (v === 'interactivo') S.alt = 0; }
}
/* v3.1 · la petición: medidas con alto («6 x 14 x 2,8», «alçada 2,80 m»), espectador más lejano («distancia máxima de visualización 10 m»),
   proyector o pantalla de proyección, interactiva como alternativa («pantalla interactiva de 55 pulgadas como alternativa») y videoconferencia */
function pide(t) {
  const s = t.toLowerCase().replace(/,/g, '.'); let ok = false, m;
  if ((m = s.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)(?:\s*[x×]\s*(\d+(?:\.\d+)?))?/))) { const a = +m[1], b = +m[2]; Object.assign(S, { tipo: 'monitor', pulg: 0, alt: 0, vc: true, dist: 0, alto: DEF.alto });   /* una sala nueva empieza de cero: lo demás lo dice la frase */
    S.ancho = Math.min(a, b); S.fondo = Math.max(a, b); if (m[3] && +m[3] >= 2 && +m[3] <= 10) S.alto = +m[3]; ok = true; }
  if ((m = s.match(/(?:alto|altura|alçada|alcada|height|ceiling|techo|sostre)[^0-9.]{0,12}(\d+(?:\.\d+)?)\s*m\b/))) { const a = +m[1]; if (a >= 2 && a <= 10) S.alto = a; }
  if ((m = s.match(/(?:distancia|distància|distance|espectador|viewer)[^0-9.]{0,40}?(\d+(?:\.\d+)?)\s*m\b/))) { const d = +m[1]; if (d >= 1 && d <= 40) { S.dist = Math.min(d, S.fondo); ok = true; } }
  if ((m = s.match(/(\d+)\s*(personas|people|persones|pax|plazas|places)/))) { S.pers = +m[1]; ok = true; }
  const proy = /proyector|projector|proyecci|projecci|projection/.test(s);
  const mi = s.match(/(?:interactiv|táctil|tactil|tàctil|touch)[^.]{0,30}?(\d{2,3})\s*(?:"|″|pulgadas|polzades|inch|inches|pulg|''|”)/) || s.match(/(\d{2,3})\s*(?:"|″|pulgadas|polzades|inch|inches|pulg|''|”)[^.]{0,20}?(?:interactiv|táctil|tactil|tàctil|touch)/);
  const comoAlt = /alternativ|comparar|compare/.test(s);
  if (proy) { S.tipo = 'proyeccion'; ok = true; }
  if (mi || /interactiv|táctil|tactil|tàctil|touch/.test(s)) {
    if (proy || comoAlt) { const p = mi ? +mi[1] : 65; S.alt = ALTS.includes(p) ? p : ALTS.reduce((a, b) => Math.abs(b - p) < Math.abs(a - p) ? b : a, 55); if (!proy && S.tipo === 'interactivo') S.tipo = 'monitor'; }
    else { S.tipo = 'interactivo'; S.alt = 0; S.pulg = mi ? +mi[1] : 0; }
    ok = true;
  }
  if (!proy && !mi && (m = s.match(/(?:monitor|pantalla|display|screen|tv)[^.]{0,20}?(\d{2,3})\s*(?:"|″|pulgadas|polzades|inch|inches|pulg|''|”)/))) { S.tipo = 'monitor'; S.pulg = +m[1]; ok = true; }
  if (/excel|hoja|document|detalle|full de càlcul|spreadsheet/.test(s)) S.cont = 'detalle';
  const vc = /videoconf|videoconfer|videollamad|videotrucad|teams|zoom|meet\b|webex|c[aà]mara|camera|híbrid|hibrid|hybrid/.test(s);
  if (vc) S.vc = true; else if (proy || /altavo|altaveu|speaker|presentaci/.test(s)) S.vc = false;
  return ok || /videoconf|reuni|teams|zoom|meeting/.test(s);
}
export default {
  id: 'video', nom: 'Videoconferencia', corto: 'VIDEOCONF.', ic: 'videoconf', ejemplo: 'Escríbela: «sala de 6 x 4 m para 10 personas»',
  info: 'Sala de reuniones: tamaño de pantalla, cámara o barra con su campo de visión y micrófonos por cobertura.',
  calcula, filas, pasos, pregunta, datos, resultado, cifras, pide,
  reconoce: (t) => /videoconf|sala de reuni|sala de reunions|teams|zoom|meeting room|personas|persones|people|proyector|projector|proyecci[oó]n|projecci[oó]|projection screen/i.test(t),
  esquema: (r, o) => ({ tit: VT === 'escala' ? 'Simulación a escala' : VT === 'lateral' ? 'Vista lateral' : VT === '3d' ? 'Simulación 3D' : 'Plano de la sala', ic: 'cubo', html: VT === 'escala' ? aEscala(r, o) : VT === 'lateral' ? lateral(r, o) : VT === '3d' ? lienzo3D() : esquema(r, o), extra: pestanas(['planta', 'escala', 'lateral', '3d'], VT) }),
  escena3d,
  set: pon, num: pon, pm: (k, d) => pon(k, +S[k] + d * (k === 'pers' || k === 'np' ? 1 : k === 'fila' ? 0.1 : 0.5)),
  accion: (a) => { if (accionSim(a)) return; if (a === 'reset') S = Object.assign({}, DEF); else if (/^vt:/.test(a)) VT = a.slice(3); }, reset: () => { S = Object.assign({}, DEF); },
};
