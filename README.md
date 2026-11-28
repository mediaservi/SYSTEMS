# SYSTEMS

**SYSTEMS** es el apartado de [AVHUB](https://avhub.mediaservi.com) (mediaservi.com) que ayuda a técnicos e ingenieros a dar con la configuración correcta de cualquier proyecto: audio, vídeo, conectividad o videoconferencia.

**Versión actual: v3.10** · Dirección definitiva: https://systems.mediaservi.com


## Icono

Icono de pestaña y de app (noviembre 2026) en el estilo de placa de la familia AVHUB: placa con degradado negro a morado, filete negro y sombra verde, con el isotipo de la app. El logo de la cabecera no cambia.

## Para qué sirve

Reúne en una sola consola los cálculos que se hacen al diseñar y montar un sistema audiovisual, con los equipos de las marcas del catálogo. Funciona en el navegador, en español, inglés y catalán, y en TV, ordenador, tablet y móvil.

**Norma:** solo se calcula y se propone con las marcas y los fabricantes que están en las listas del panel AVHUB ADMIN. Si ninguna resuelve, el resultado lo dice.

## Funciones

**SYSTEMS vive en la misma casa que SCREENS:** la cabecera (logo, SIMPLE / PRO, familia AVHUB, información, PDF, nuevo cálculo, idioma y tema), la barra de módulos con la petición escrita y CALCULAR, la rejilla de bloques de PRO, los tres bloques de SIMPLE (lo que pides, esquema y resultado) y el pie (aviso, crédito, instalar y reporte de fallos) son los de SCREENS (`vista/blocks.css`, `vista/simple.css` y `vista/iconos.css`). Todos los módulos se abren en la misma consola:

- **ELECTRÓNICA** (como en SCREENS: UNA o VARIAS pantallas y LED, PROYECCIÓN o DISPLAYS)
  - *LED:* con la resolución (o el cabinet), las salidas de la fuente, cable de red o fibra y backup: líneas, reparto de la señal, procesador con su despiece, alternativas, conversores de fibra CVT10 junto a la pantalla (dibujados en el esquema) y avisos. Hasta 4 pantallas a la vez.
  - *PROYECCIÓN:* la misma imagen, distintas o fundida (blending): distribuidor, matriz o equipo de blending de las listas, y el cable o extensor de cada tramo.
  - *DISPLAYS:* monitores SAMSUNG, LG y CLEVER por tamaño, uso (interior, escaparate, exterior, interactivo, tótem) y horas al día; espejo, distintas o videowall.
- **SEÑAL Y CONECTIVIDAD:** fuentes → selector, distribuidor o matriz (PURELINK) → destinos, con el cable o extensor de cada tramo según la distancia y la resolución (1080p, 4K60 a 18 Gbps u 8K a 48 Gbps), USB/KVM y AV sobre IP a partir de 8 fuentes o destinos.
- **AUDIO:** los 26 calculadores de audio y escenario (acústica, arrays, electrónica de audio, cableado, iluminación y vídeo, electricidad, música y grabación, medidas y referencia), con sus gráficas, tablas, resumen y notas.
- **SONORIZACIÓN** (nuevo en la v2.0): el sistema de sonido completo de una sala, no un altavoz suelto. Con las medidas, el uso (música de fondo, megafonía, sala con micros o eventos), pared o techo y los micrófonos propone altavoces, subgraves, retardos con su tiempo, etapas, micrófonos, control y accesorios, con avisos de diseño. RCF, SENNHEISER y XILICA; EZ ACOUSTICS (tratamiento acústico) y FOHHN (altavoces a medida, PoE y Dante) solo como consulta.
- **CÁMARAS** (nuevo en la v2.2): cámaras PTZ para reuniones, aulas, auditorios y retransmisiones. Con la distancia al ponente, el encuadre (primer plano, medio o americano) y el ancho a cubrir calcula el ángulo y el zoom que hacen falta, elige la cámara AVER que llega con zoom óptico, cuántas por planos (ponente, público y general con la segunda lente), el seguimiento (por voz, por IA o posiciones fijas), la salida (USB, HDMI o IP) y los puertos PoE+.
- **CONTROL** (nuevo en la v2.2): el control de la sala para el usuario. Según el equipo (etapas RCF KPS o DMA, megafonía RCF ZM o procesador XILICA), los puntos de control y la interfaz (pantalla táctil o mando de pared) propone los mandos, los teclados de zonas, las tomas de pared Bluetooth, USB y XLR y los puertos PoE, y avisa de lo que va por proyecto.
- **VIDEOCONFERENCIA:** con las medidas de la sala y la gente, el tamaño de pantalla (espectador más lejano a 6 veces la altura de imagen, o 4 para documentos), la barra o cámara AVER por fondo de sala y campo de visión, y los micrófonos de techo SENNHEISER por cobertura, con el kit completo con XILICA cuando la sala lo pide.

En SIMPLE, un asistente pregunta lo justo la primera vez y cada línea de «Lo que pides» se cambia tocándola. En PRO se ven y cambian todos los datos, el esquema y el despiece. También se puede escribir la petición («pantalla LED de 8960 x 1536 con 3 salidas DP por fibra», «4 portátiles a 2 pantallas, distintas, 4K, a 30 m», «sala de 6 x 4 m para 10 personas») y pulsar CALCULAR.

**Instalable y sin conexión:** con el botón «Instalar» se queda como una app más del dispositivo y funciona sin internet.

## Listas de equipos

`comun/equipos.js` (procesadores LED: NOVASTAR, COEX y PIXELHUE, la misma de SCREENS) y `comun/sistemas.js` (displays SAMSUNG, LG y CLEVER; PURELINK; AVER; NUREVA; RCF; SENNHEISER; XILICA; JUST ADD POWER; y, solo para proyectos, EZ ACOUSTICS y FOHHN) son las listas de fábrica, según información de los fabricantes y sin precios. El panel AVHUB ADMIN las carga y, una vez guardadas allí, la app usa las del panel (`?accion=equipos`).

## Avisos

Los cálculos son orientativos: hay que comprobar siempre los datos del fabricante y la normativa antes de montar.

## Tecnología

HTML, CSS y JavaScript sin dependencias externas. `index.html` carga la casa (`vista/casa.js`) y sus módulos (`vista/mod-electronica.js`, `mod-senal.js`, `mod-audio.js`, `mod-sonido.js`, `mod-video.js`), con las reglas de conectividad en `vista/conectividad.js`, las listas en `vista/listas.js`, los calculadores en `calculos.js` y los textos en `textos.js` y en cada módulo. `audio.html` y `blocks/` llevan a la consola. Es una app web instalable: `manifest.json`, el service worker `sw.js` e `instalar.js`. Al añadir archivos que deban estar disponibles sin conexión desde la primera visita, apúntalos en la lista `BASICO` de `sw.js`.

## Ramas

- `main`: versión pública aprobada.
- `beta`: última entrega en pruebas.
- `beta-anterior`: la beta previa.

## Cambios de la versión actual (v3.10)
- **Formato estándar primero** (igual que SCREENS): donde se da la proporción, primero el formato estándar y luego el decimal, «16:9 (1,78:1)». Se reduce la resolución en píxeles (o la medida) y, a menos del 0,5 % de 16:9, 4:3, 21:9, 32:9, 16:10, 1:1 o sus verticales, se usa el estándar. Sale en el cuadro de resolución de la simulación, en la resolución total de ELECTRÓNICA › LED, en la medida del videowall y en el formato de las pantallas de proyección.

## Cambios de la v3.9
- **La simulación a escala llena su caja:** el dibujo toma la forma real del recuadro y la escena (persona, pantallas y cotas) crece todo lo que puede sin tocar los cuadros de datos ni los controles. Los controles ya no se encogen ni se esconden (si no caben en una fila, van en dos) y, en cajas estrechas, los cuadros de datos bajan bajo los controles.
- **RESULTADO sin hueco:** debajo, la ficha resumida del equipo recomendado (foto con zoom, sus datos y los enlaces a ficha, PDF y página), con las filas que quepan.
- **Cifras de abajo más grandes:** el número y su texto crecen con el bloque; ELECTRÓNICA y SEÑAL llenan sus seis bloques (conexión, refresco, backup; tramo hasta los destinos).
- **Bloques de datos sin huecos al pie:** las filas de botones reparten el alto libre.

## Cambios de la v3.8
- **Salidas de la fuente por ancho de banda** (ELECTRÓNICA › LED), no con un tope fijo de 3840 px: «Máximo por salida» es ahora Full HD (HDMI 1.4 · DVI · 3G-SDI), **4K60** (HDMI 2.0 · DP 1.2 · 12G-SDI, unos 8,85 Mpx: 4096 × 2160 cabe en una) u **8K** (HDMI 2.1 · DP 1.4, 7680 × 4320 por un cable). Menos píxeles por salida a más hercios. Las tiras estrechas se **pliegan** en una sola salida (7680 × 540 o 25600 × 64 van por un cable), con su aviso.
- **Cada petición escrita parte de cero** (60 Hz, sin backup, cable de red, una salida HDMI 4K60, ordenador), salvo lo que diga el texto.
- **Nunca se ignora en silencio:** una resolución fuera de rango se dice en el aviso; se aceptan lienzos pequeños o muy alargados (128 × 64, 25600 × 64).
- La petición entiende «N salidas» o «4 HDMI», NDI (con su aviso: decodificador o entrada IP), 12G-SDI, 3G-SDI, HDMI 2.1, DP 1.4 y la distancia en metros (a más de 100 m, fibra). «Pantalla LED … DisplayPort» se queda en LED.
- Si ningún equipo solo cubre la pantalla, se reparte en varias controladoras (motor común de electrónica LED, igual que SCREENS).
- Errata: «con una entrada» en lugar de «1 entradas».

## Cambios de la v3.7
- **ACCESOS DIRECTOS** al final de la información (botón «i»): la dirección del módulo abierto, la primera y resaltada; después la general de SYSTEMS y la de cada módulo (`systems.mediaservi.com/?mod=elec`, `disp`, `senal`, `audio`, `sonido`, `video`, `camaras`, `control`). Cada línea lleva su nombre (abre la dirección), la dirección entera y COPIAR, en español, inglés y catalán.
- Las direcciones de CÁMARAS y CONTROL ya abren su módulo.

## Cambios de la v3.6
- **Personalizar la simulación sin ventanas** (DISPLAYS y VIDEOCONF., «A escala»), con el mismo esquema que SCREENS: arriba a la derecha, **ELEVACIÓN DESDE EL SUELO** con flechas técnicas (de 10 en 10 cm; cambia también las vistas frontal, lateral y 3D, y RESTABLECER vuelve a la altura del cálculo) y, debajo y al mismo ancho, dos grupos de botones:
  - **CONTENIDO:** foto del fabricante (la de siempre por defecto), carta de ajuste, vídeo de prueba de mediaservi.com en bucle y contenido propio (vídeo, foto o enlace: solo este abre su pequeña ventana).
  - **PARED:** cemento, madera, mármol, ladrillos (con sus tres colores en círculos dentro del grupo) y pared propia (foto o enlace, guardada solo en este navegador).
- Lo elegido lleva el borde verde. Los controles **nunca pisan el dibujo**: prueban en fila, en dos filas y compactos, y si no caben se reducen. No salen en capturas ni en el PDF.
- Se quitan el desplegable de pared y el botón de contenido de la simulación.

## Cambios de la v3.5
- **Software de los reproductores NovaStar (VNNOX y ViPlex)**: en ELECTRÓNICA › LED, la fuente puede ser un **Ordenador** (procesador, como hasta ahora) o un **Reproductor** con la controladora dentro (Taurus TB, TU, TCC…). Con un reproductor NovaStar sale el bloque de SCREENS (`comun/software.js`, logotipos oficiales en `comun/img/soft/`) con la recomendación de sus aplicaciones oficiales, qué permite cada una y el enlace a su página, en pantalla y en el PDF (con la dirección escrita). La petición entiende «reproductor», «player», «Taurus» o «sin ordenador».
- Fichas: los tipos controladora, reproductor, procesador modular, mediaserver y switcher salen con su nombre traducido.

## Cambios de la v3.4
- **Icono de la pestaña y de la app**: el símbolo va en un azul más claro (#8ee8ff) para que contraste con la placa magenta (solo en estos dos iconos; el resto de la marca sigue con su azul).
- **Simulación**: recorte a mano de la imagen de pantalla en las fotos de ambiente o con dos pantallas (Clevertouch CL PRO2, High Bright y tótems; LG UH5Q, UL3Q, UL5Q, UH7Q y PK640): el contenido es lo que el fabricante enseña en la pantalla, sin fondos ni marcos.

## Cambios de la v3.3
- **Pantalla de proyección real, siempre**: VIDEOCONF. propone un modelo real de pantalla de proyección (`comun/pantallas.js`: 72 modelos de imagen 16:9 o 16:10 de ORAY, Da-Lite y Stumpfl, según información de los fabricantes), el más pequeño cuya imagen llega al espectador más lejano sin pasar del techo, con su foto, ficha, PDF y página. Montaje a elegir: eléctrica, de falso techo o marco fijo. Las de la misma medida salen en ALTERNATIVAS. SCREENS se abre con el formato de esa pantalla.
- **Simulación a escala**: el contenido por defecto es la imagen que el fabricante enseña en la pantalla de su foto oficial (en las fotos frontales, recortada a la imagen activa; en las demás, la foto entera) y cambia sola al cambiar de modelo. La carta de ajuste y el vídeo de mediaservi siguen en CONTENIDO.
- En lugar de la tarjeta de foto, **los cuadros de datos de SCREENS**: resolución (4K · ULTRA HD · 3840×2160 px), resumen (pantallas, pulgadas, ancho y alto) y distancia de visionado (mínima y óptima).

## Cambios de la v3.2
- **El producto en las cifras de abajo**: si hay sitio, cada cifra que nombra un equipo muestra su foto oficial (con el ojo para verla en grande) y los enlaces a su **ficha**, al **PDF** de la ficha técnica y a su **página en charmex.net** (o la web del fabricante si no está). Si no cabe, primero se quita la foto y después todo: nunca se corta nada.
- **Página del producto y PDF** de 477 referencias de las listas (`comun/web.js`, comprobado en charmex.net por referencia exacta), también en la ficha de producto.

## Cambios de la v3.1
- **VIDEOCONFERENCIA para salas de presentaciones**: la videoconferencia se puede quitar (sin cámara ni micrófonos) y la pantalla puede ser **monitor, interactiva o proyección**.
- **Espectador más lejano**: si la petición da la distancia máxima de visualización, el tamaño de imagen sale de ella y no del fondo de la sala. Línea discontinua en el plano.
- **Alto de la sala**: la imagen no pasa del techo (borde de abajo a 1 m en proyección y centrado a 1,3 m en un monitor, valores de BRIAN). Si el espectador más lejano pide más, aviso de hasta dónde se ve bien.
- **Proyección**: pantalla blanca 16:9 a la medida justa, con el botón **Calcular el proyector en SCREENS**, que abre SCREENS con la pantalla, su altura, el techo y la distancia ya puestos.
- **Pulgadas pedidas**: si la petición dice «interactiva de 75 pulgadas» o «monitor de 86″», se respeta (con aviso si se queda pequeña). Selector de pulgadas junto a «Cuántas pantallas».
- **Alternativa interactiva para comparar** (55, 65, 75 u 86″): sale en ALTERNATIVAS con hasta dónde se ve bien y, en el PDF, en su propia lista con su ficha.
- **Semáforo de soluciones**: cada pantalla propuesta lleva el lateral verde (se ve bien desde el último espectador), ámbar (casi, desde el 80 %) o rojo (no llega).
- **SONORIZACIÓN · ECONÓMICO** (sala de poco uso, presupuesto ajustado): una pareja junto a la pantalla, sin retardos ni subgraves; MR 50 o WMR 60T con DMA 82 sin micrófonos, o con KPS de 2 canales si los hay.
- **Petición de varias cosas**: un texto con pantalla y altavoces prepara VIDEOCONFERENCIA y SONORIZACIÓN a la vez (aviso en pantalla). Se leen la altura con palabras («alçada 2,80 m»), «dos altavoces», el presupuesto ajustado, y «proyector de techo» o «pantalla blanca» ya no ponen los altavoces en el techo ni en blanco.

## Cambios de la v3.0
- El vídeo de mediaservi de la simulación sale siempre sin subtítulos (la traducción automática quedaba mal), aunque el navegador los tenga activados en YouTube.

## Cambios de la v2.9
- **Cada display a su medida exacta**, como los cuerpos de proyector de SCREENS: ancho, alto y fondo reales de 111 modelos (Samsung, LG y Clevertouch, según información de los fabricantes), con sus marcos por lado y la imagen activa en su sitio. Un cuerpo por familia: monitor, videowall de marco fino, exterior (marco ancho y tornillería), táctil con barra de altavoces, alargado y tótem de suelo con su base. Se ve así en la simulación a escala, en la vista lateral (fondo real) y en la 3D, en DISPLAYS y en VIDEOCONFERENCIA. En un videowall, los marcos reales entre pantallas.
- La ficha de cada display añade medidas, peso y VESA.
- **Iconos de SCREENS**: los de la simulación (sala inmersiva con persona), tamaño, resolución, señal, cable, micrófono, audio, información, PDF y demás son los mismos que en SCREENS; «Dónde va» lleva la diana y «Uso» y «Horas al día», un reloj.
- **Stock**: en público, la marca automática se llama «Cualquiera» y los equipos con stock solo se distinguen por un fondo azul sutil; «La que esté en stock» y «En stock / Bajo pedido» solo salen con el acceso interno. El candado va el último del grupo de la derecha del pie, como en SCREENS.
- **Contenido de la simulación**: la carta de ajuste o el vídeo de mediaservi recortado (del primer cambio de imagen a antes de «Suscribirse») y en bucle; cualquier otro, con un enlace o un archivo propio.
- Los textos de los esquemas llevan el color del tema en el propio dibujo (no salen negros en modo oscuro aunque el navegador guarde estilos viejos).

## Cambios de la v2.8
- **Simulación a escala, como la de SCREENS**, en DISPLAYS (vista de entrada) y en VIDEOCONFERENCIA: la pared con textura a escala real (hormigón, madera, mármol, ladrillos o sin pared), la persona de 1,75 m, cada display a su tamaño real con la carta de ajuste o el contenido que elijas (fuentes de prueba, YouTube, Vimeo, una imagen o un vídeo, o un archivo tuyo), las cotas y la foto oficial del modelo, que abre su ficha. En un videowall, un solo contenido para todo el muro. La simulación 3D muestra también la carta o la imagen elegida.
- **Ficha de producto en pestaña nueva**: cualquier nombre de producto que aparece (resultado, despiece, cifras y esquemas) es un enlace a su ficha, en una página propia que se puede imprimir o compartir, con la foto oficial del fabricante.
- **Fotos oficiales** de 460 referencias de las listas, según información de los fabricantes.
- **PDF en dos hojas, como el de SCREENS**, con vista previa (guardar o imprimir): hoja 1, el resumen, el dibujo de la vista elegida (también la simulación a escala o la 3D) y las cifras con sus avisos; hoja 2, la lista de material y la ficha de cada equipo con su foto oficial. Sin precios ni stock.
- **Ver en grande** (el ojo, como en SCREENS): el dibujo de la vista elegida a toda ventana, también la simulación a escala y la 3D.
- **Datos del proyecto** (nombre, cliente y observaciones), junto a la petición: salen en la cabecera y en la primera hoja del PDF.
- Las descripciones de los equipos salen en inglés y catalán.
- Icono propio para las cámaras (PTZ), distinto del de simulación.
- En el móvil vertical, las pestañas de vista van debajo del título para que no se corte.

## Cambios de la v2.7
- Petición escrita como la de SCREENS: entiende números con letra («dos micros», «quatre», «twelve»), medidas en cm o mm, «10 metros de ancho por 16 de largo», «6 by 4 m» y «metros» en español, inglés y catalán.
- Los textos del esquema de CONTROL (y de los calculadores de AUDIO) ya no salen en negro en el modo oscuro: toman el color del tema.
- La petición va al apartado que la reconoce aunque estés en otro (videoconferencia, cámaras, control, displays, señal, electrónica, sonido y audio, por ese orden), y reconoce también las palabras en catalán e inglés.

## Cambios de la v2.6
- Ficha de producto como la de SCREENS: al tocar un equipo del resultado se abre su ficha (foto o dibujo, marca, modelo, datos técnicos según información de los fabricantes y enlace a la ficha del fabricante), en español, inglés y catalán.

## Cambios de la v2.5
- **Simulación 3D de la sala**, con la misma base que la de SCREENS (three.js local, mismo render, la figura humana extruida, etiquetas y cotas en el suelo, misma navegación: arrastrar para girar, rueda o + − para acercar, flechas para desplazarse, 0 para volver). Botón 3D junto a las vistas técnicas:
  - SONIDO: altavoces principales y retardos con su cono de cobertura y su tiempo, malla de techo, subgraves, pantalla y público.
  - VIDEOCONFERENCIA: pantallas a su altura, cámara o barra con su campo de visión, mesa con la gente y micrófonos de techo con su cobertura.
  - CÁMARAS: escenario con el ponente, cámara con el cono del encuadre, lente IA, cámara de público y el público.
  - DISPLAYS: la pared con las pantallas (o el tótem) y una persona a la distancia de visión.
- La simulación se carga solo al pulsar 3D y se suelta entera al cambiar de vista. Caché renovada (`systems-v24`).

## Cambios de la v2.4
- **Todo el cálculo con ajuste fino desde el panel AVHUB ADMIN:** SEÑAL (distancia de cada cable y extensor, AV sobre IP, salidas HDBaseT), DISPLAYS (brillo de escaparate, tamaños máximos, alturas de montaje y distancias de visión), CÁMARAS (alturas y distancias de USB y HDMI) y las alturas de la vista lateral de SONIDO se leen en vivo, con los valores de siempre como respaldo y copia para funcionar sin conexión.
- **Motor común de electrónica LED** al día con SCREENS: píxeles por puerto, conversores, ranuras y tarjetas también desde el panel, los mismos valores para las dos apps.
- Caché renovada (`systems-v23`).

## Cambios de la v2.3
- **Vistas técnicas como las de SCREENS** (`vista/vt.js`, las mismas piezas que `screens/vistas.js`): fondo oscuro, cotas con topes, escala en metros y la silueta oficial de 1,75 m. Botones de vista en la cabecera del dibujo, en SIMPLE y en PRO:
  - DISPLAYS: FRONTAL (ancho, alto y altura del borde inferior) y LATERAL (distancia de quien mira, altura de los ojos y ángulos hacia arriba y hacia abajo).
  - SONIDO: PLANTA y LATERAL (altura de los altavoces, plano del oído, cobertura hasta el público y retardos con su tiempo y distancia).
  - VIDEOCONFERENCIA: PLANTA y LATERAL (pantalla a su altura, cámara encima, mesa y mirada del espectador más lejano).
  - CÁMARAS: PLANTA y LATERAL (ponente, cámara a su altura y distancia, cono del encuadre, inclinación y público).
- Caché renovada (`systems-v22`).

## Cambios de la v2.2
- **CÁMARAS y CONTROL**, dos módulos nuevos (ver Funciones). Los datos de las cámaras AVER CAM550 y CAM570 (ángulo, zoom óptico y total, lente IA, seguimiento por voz, PoE+) están en la lista de fábrica, según información de los fabricantes.
- **Stock solo con la llave interna:** «En stock» y «Bajo pedido» ya no salen en público en DISPLAYS, ELECTRÓNICA ni VIDEOCONFERENCIA; con la llave del panel (candado del pie, como en SCREENS) sí, y nunca en el PDF ni en las cifras. El candado se pone verde con la llave activa y, al tocarlo, se cierra.
- **Ocho módulos en la barra:** en móvil vertical, dos filas de cuatro; en ordenador y TV, la barra gana ancho a la petición escrita.
- **BRIAN también en VIDEOCONFERENCIA y CÁMARAS:** el margen de la pantalla, los factores de distancia (vídeo y documentos) y el ancho de cada encuadre se leen en vivo del panel, con los de fábrica como respaldo.
- **Figura humana oficial de SCREENS** (silueta de 1,75 m a escala) en la vista frontal de DISPLAYS, en lugar del monigote.
- Caché renovada (`systems-v21`).

## Cambios de la v2.1
- **SONORIZACIÓN con BRIAN:** los valores de partida del cálculo (cada cuántos metros va una fila de retardos y desde dónde, el margen de la línea de 100 V, el ángulo y la altura del oído de la malla de techo, la altura para colgar los altavoces, los umbrales de etapas, mezclador, RF, columnas de haz orientable, conferencias y sistemas grandes…) se leen en vivo del cerebro del panel AVHUB ADMIN (`?accion=brian&app=SYSTEMS`), con una copia guardada para funcionar sin conexión y los de fábrica si no hay ninguna. Los avisos dicen los valores que se están usando. Caché renovada (`systems-v20`).

## Cambios de la v2.0
- **Nuevo módulo SONORIZACIÓN** (botón SONIDO): resuelve la sala entera. Principales en pared (columnas junto a la pantalla, WMR o Compact M por alcance) o en techo (malla por altura y cobertura), retardos cada 4 m a partir de los 6 m con su tiempo en el plano, subgraves que combinan con cada caja, etapas KPS con cada altavoz en su canal (versión D con red Dante), DMA para hilo musical, AM o ZM 2000 para megafonía por zonas, cadena EN 54 para evacuación y columnas VSA de haz orientable en salas grandes y reverberantes. Micrófonos SENNHEISER según el uso (SpeechLine en reuniones y aulas; EW-D o EW-DX en eventos; flexo con su base), con cargadores y antenas cuando hacen falta.
- **Avisos de diseño:** soportes de los Compact M 05 a 12, phantom de los micros de condensador con KPS (mezclador PR 4093), TILE-BRIDGE en falso techo modular, base de los flexos, nada de MR con micrófonos, cadena EN 54 completa, sala reverberante (tratamiento acústico antes que equipo), potencia de 100 V con un 20 % de margen y «valida el diseño».
- **Listas de audio completas** según información de los fabricantes: RCF (175 referencias de instalación), SENNHEISER (119), NUREVA (20, con HDX como «consultar») y la marca nueva XILICA (16, cotización por proyecto). EZ ACOUSTICS y FOHHN, con lista propia, solo como consulta.
- **VIDEOCONFERENCIA:** el kit de techo (TCC, TCC MEDIUM o TCC LARGE) se elige por superficie y lleva dentro el micrófono, el procesador Xilica, el amplificador y los altavoces; avisa del servicio de configuración y del switch PoE, y de Nureva HDX si además hay que sonorizar la sala.
- Barra de módulos con seis botones: cada uno a la medida de su rótulo, sin cortes en ordenador, TV, tableta ni móvil. ELECTRÓNICA en PRO: LED / PROYECCIÓN / DISPLAYS en una fila, para que el bloque no se corte. Caché renovada (`systems-v19`).

## Cambios de la v1.9
- **Direcciones de carpeta sin la barra final (24-11-2026):** con la app ya visitada o instalada, abrir una dirección como `/blocks` daba «No se puede acceder a este sitio web» (ERR_FAILED), porque el service worker entregaba tal cual la respuesta redirigida por el servidor. Ahora devuelve una redirección limpia; caché renovada (`systems-v18`).
- Móvil vertical: las pestañas de módulo (Electrónica, Displays, Señal, Audio, Videoconf.) caben en una fila sin cortarse, y las opciones cortas como LED / Proyección / Displays van en fila en lugar de una por línea.

## Cambios de la v1.8
- **Móvil vertical más limpio**, igual que SCREENS (pedido por Josep, 23-11-2026): cabecera en una sola fila (isotipo, burbuja SIMPLE / PRO que cambia de modo al tocarla, iconos y el logo de AVHUB, que lleva a todas las apps; fuera los logos de las otras apps) y pie en una sola fila (triángulo de aviso que al tocarlo enseña el texto, «SYSTEMS v1.8», «Aviso legal» y candado). Instalar y avisar de un fallo pasan a la ventana de información.

## Cambios de la v1.7
- **Cables prioritarios:** lo que el panel AVHUB ADMIN marca ⭐ PRIORITARIO se propone primero. En un tramo en el que vale tanto un extensor HDBaseT como un cable de fibra, si el cable es prioritario y el extensor no, se propone el cable y el extensor queda como alternativa. Los equipos prioritarios llevan ⭐ en las tablas y en las fichas.
- **Reproductores de signage** (tipo nuevo del panel: MagicInfo, VXT, webOS, como el SBB de Samsung o el WP601 de LG): cuando el display no lleva reproductor integrado, se propone el de su misma marca (y el prioritario, si lo hay).

## Cambios de la v1.6
- **Sin caché** (pedido por Josep, 18-11-2026): las páginas llevan las etiquetas equivalentes a `Cache-Control: no-cache, no-store, must-revalidate` y el service worker pide siempre al servidor, revalidando, sin pasar por la copia del navegador. Sin conexión sigue funcionando con la copia guardada.

### v1.5
- **Tableta en horizontal con letra legible** (aprobado por Josep, 16-11-2026): en pantallas táctiles de 901 a 1280 px de ancho en horizontal, la página se maqueta a 900 px como la tableta en vertical (bloques uno debajo de otro, con desplazamiento). Antes, en 1024 × 768 los bloques de PRO salían con letra de 3 a 7 px. En ordenador y TV no cambia nada.

## Cambios de la v1.4
- **DISPLAYS, pestaña propia para señalética y digital signage** (pedido por Josep): dónde va (interior, escaparate, exterior, tótem, videowall, táctil, alargado o transparente), pulgadas, cuántas (o columnas × filas en videowall), orientación, horas al día (16 h o 24 h), reproductor integrado o externo y marca. Propone el display de las listas del panel (SAMSUNG, LG y CLEVER) del tamaño más cercano, en stock antes que bajo pedido y, a igualdad, por el orden SAMSUNG > LG > CLEVER, con alternativas de las otras marcas. Avisa del brillo en escaparate (2.500 nits o más), del reproductor externo, del montaje en vertical, de las medidas del videowall y de cuándo conviene una pantalla LED. Vista frontal a escala con una persona de 1,75 m.
- La barra de módulos lleva los cinco (ELECTRÓNICA y DISPLAYS · SEÑAL, AUDIO y VIDEOCONF.) y cabe en todos los formatos: si no hay sitio, los botones van sin icono.

## Cambios de la v1.3

- PDF con la cabecera de SCREENS: logo de SYSTEMS a la izquierda, la web con la fecha y la hora en el centro y el logo de AVHUB a la derecha.
- Arreglado: los botones de información, PDF y CALCULAR cambiaban de tema (gris oscuro o claro) en vez de hacer lo suyo.
- La hoja sale siempre en claro, aunque la app esté en oscuro, con el aviso y la línea de crédito al pie. Ya no salen los botones de la pantalla (PDF, Ver en PRO, Pregúntame otra vez, instalar y reporte de fallos).

## Cambios de la v1.2

- Listas de fábrica de audio: RCF (altavoces, subgraves, etapas, procesadores y micrófonos), SENNHEISER (TeamConnect, inalámbricos, mesa y cuerpo) y NUREVA (HDL200, HDL310, HDL410 y HDX).
- VIDEOCONFERENCIA propone como alternativa de audio el sistema NUREVA que cubre la sala.
- Para el panel AVHUB ADMIN v12.10: los tipos nuevos (display, conmutador, extensor, cable, AV sobre IP, videoconferencia, micrófono, altavoz, etapa…) y el botón AÑADIR LAS MARCAS NUEVAS DE FÁBRICA.

## Cambios de la v1.1

**Una sola casa, calcada de SCREENS, para todos los módulos.**

- Cabecera, barra y pie idénticos a SCREENS (mismas hojas de estilo, mismos iconos y mismo orden), con la petición escrita, PEGAR, COPIAR y CALCULAR.
- Módulos ELECTRÓNICA, SEÑAL Y CONECTIVIDAD, AUDIO y VIDEOCONFERENCIA en la misma consola; AUDIO ya no abre otra página.
- ELECTRÓNICA como SCREENS: UNA o VARIAS y LED, PROYECCIÓN o DISPLAYS. Con fibra, el esquema dibuja los conversores CVT10 junto a la pantalla.
- Listas nuevas de fábrica para el panel: displays SAMSUNG, LG y CLEVER, PURELINK, AVER, SENNHEISER y JUST ADD POWER.
- Norma: solo marcas de las listas del panel.

## Cambios de la v1.0

**SYSTEMS pasa a ser hermano de SCREENS y estrena ELECTRÓNICA LED.**

- Portada nueva con la consola de SCREENS: SIMPLE (asistente de seis preguntas la primera vez y botón PREGÚNTAME) y PRO (refresco, máximo por salida, marca y alternativas), claro y oscuro, es/en/ca, sin desplazarse en ordenador y TV.
- Módulo ELECTRÓNICA LED con el motor de electrónica de SCREENS: caso de prueba 8960 × 1536 con 3 salidas DisplayPort → H Series H2 con cable de red, COEX MX2000 Pro con fibra y H5 con backup 1:1.
- Esquema de la señal en horizontal en ordenador y TV, y de arriba abajo en el móvil.
- Los calculadores de audio siguen en `audio.html` (botón AUDIO); el logo de esa página vuelve a la portada.

### v0.20

Correcciones de la auditoría en el móvil en vertical:

- **BLOCKS · escribir un número funciona:** al teclear en una casilla ya no se rehace el bloque de datos, así el cursor y lo escrito se mantienen (antes «25» acababa en «500»).
- **BLOCKS · la fila de vistas salta de línea** si no cabe: RESUMEN, NOTAS y el resto de vistas de End-fire y Broadside se ven y se pueden elegir.
- **BLOCKS · botones de grupo** en dos líneas en vez de encoger la letra hasta 7 px; las tablas (Tempo, Direcciones DMX) se ajustan al ancho del bloque.
- **Gráficas:** en el móvil se dibujan más estrechas para que la letra no baje de unos 10 px, y el rótulo del eje («dB SPL»…) va encima de la gráfica en vez de sobre la cifra más alta.
- **Clásica:** cabeceras de tabla a 10 px; AVHUB en el centro de la fila de apps del pie en el móvil; ya no sale «−0 dB».
- **Aviso legal:** se abre por el principio (antes aparecía desplazado hasta abajo).

### v0.19

- Logo nuevo de MSGAME en la barra de apps: «MS» en dos fichas moradas con la misma letra que GAME y sombra verde.

### v0.18

- Logo de MSGAME de la barra de apps con la calavera nueva: el ojo derecho es una cruceta de mando, como si guiñara.

### v0.17

- El aviso «Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.» lleva delante un triangulito de aviso discreto (monocromo, filete del color del texto), igual en todas las apps de cálculo de AVHUB. En la vista en una pantalla (beta), el aviso del pie va al mismo tamaño que los créditos, en una columna que se estira lo que haga falta.

## Cambios de la v0.16

- **Aviso común de las apps de cálculo de AVHUB:** al pie de las notas de cada calculador, «Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.» (antes: «Estos cálculos son orientativos: comprueba siempre los datos del fabricante y la normativa antes de montar.»). En español, inglés y catalán.

## Cambios de la v0.15

- **SYSTEMS en una pantalla (BLOCKS, beta 1), en `blocks/`:** los mismos 26 calculadores en la interfaz de bloques fijos que ya usa SCREENS, sin desplazamiento en escritorio ni en TV. Arriba, los nueve grupos y CALCULAR; a la izquierda, los calculadores del grupo y sus datos (con botones − y + y RESTABLECER); en los dos bloques grandes, **dos vistas distintas a elegir** en cada uno (cada gráfica, la tabla, las notas o el resumen); abajo, las seis cifras principales, cada una en su bloque. Tema claro y oscuro, español, inglés y catalán, y bloques apilados en el móvil. Comparte los datos guardados con la versión clásica, que sigue siendo la portada y **no cambia**; desde BLOCKS hay un botón para volver a ella.
- Pie con el texto común nuevo de AVHUB: «SYSTEMS vX.Y AAAA forma parte del proyecto AVHUB ideado por el fundador de mediaservi.com · Aviso legal» (`credito.js`).
- Enlace de pruebas: `https://raw.githack.com/mediaservi/SYSTEMS/beta/blocks/index.html`.

### v0.14

- **Logo de MSGAME**: se sirve con una dirección nueva para que nadie siga viendo el antiguo desde la copia guardada en su dispositivo, y se renueva la caché sin conexión.

### v0.13

- **Instalable y sin conexión:** botón «Instalar» en la barra (junto a la seta). SYSTEMS se instala como una app en el móvil, la tableta o el ordenador y funciona sin internet con la última copia descargada; con internet se actualiza sola. Archivos nuevos: `manifest.json`, `sw.js`, `instalar.js` e iconos en `assets/iconos/`.

Sigue de la v0.12:

- **Aviso legal:** se añade que es un proyecto personal del autor, ajeno a su empleador, que no lo encarga, financia ni respalda.

Sigue de la v0.11:

- **Documentación legal completa:** `LEGAL.md`, `DISCLAIMER.md`, `PRIVACY.md` y `COOKIES.md` en el repositorio, enlazados desde el «Aviso legal» de la app. El aviso de la app añade que no es un proyecto técnico ni asesoramiento profesional, que la limitación de responsabilidad no alcanza a lo que la ley no permite excluir, y un apartado de privacidad y contacto.

Sigue de la v0.10:

- **Aviso legal** enlazado detrás de la línea de crédito: explica, en lenguaje llano y en es/en/ca, que esto es software gratuito hecho por afición, sin garantías, con resultados orientativos y de uso bajo la responsabilidad de cada cual.
- La descripción ya no habla de «profesionales»: calculadores para la gente del sonido y la iluminación.

Sigue de la v0.9:

- **Seta roja de aviso de fallos** en la barra de botones, del mismo tamaño que el resto. Al pasar el cursor explica para qué es; al pulsarla se abre una ventana para contar el fallo y adjuntar hasta tres capturas. El aviso nos llega por correo y quien lo envía recibe una respuesta al momento.

Sigue de la v0.8:

- **Línea de crédito común.** El pie es el mismo en todas las apps de AVHUB, con el icono nuevo, y se puede cambiar desde AVHUB ADMIN sin tocar la app.
- **ADPOSTER sustituye a NEWS** entre los logos de la familia, enlazado a su web.

Sigue de la v0.7:

- Los estilos y el programa se piden con el número de versión, para que el navegador no mezcle una página nueva con una hoja de estilos antigua guardada (la cabecera podía verse descolocada).

Sigue de la v0.6:

- Las otras apps de AVHUB, a mano: en la cabecera, a los dos lados del logo de AVHUB y centrados en el hueco libre, los logos pequeños de SCREENS, NEWS, VJSHOW y MSGAME, cada uno enlazado a su web. Van en tinta mate, como grabados en el frontal, y recuperan su color al pasar el cursor. En móvil y tablet pasan a una línea encima del pie.

Sigue de la v0.4:

- SYSTEMS estrena logo propio: el isotipo del conector (un aro con tres pines unidos en triángulo) en azul y el nombre en la letra común de la familia AVHUB. Va en la cabecera y en el icono de la pestaña.
- Los archivos están en `assets/`: `systems-logo.svg` (isotipo y nombre) y `systems-icono.svg` (isotipo solo).

Versiones anteriores: v0.3, SYSTEMS pasa a su repositorio propio como app independiente y llega la primera tanda del catálogo de RCF, Sennheiser y Nureva; v0.2, el apartado pasa a llamarse SYSTEMS (antes Hardware); v0.1, los 26 calculadores.

## Licencia

Código abierto bajo la licencia **GNU GPL v3**.

---
*SYSTEMS v0.20 es un proyecto hecho con ⚙ by [mediaservi.com](https://mediaservi.com)*

## Aviso

Software gratuito y de código abierto, hecho con pasión por un aficionado en su tiempo libre. No es un producto profesional. Se ofrece «tal cual», sin garantías de ningún tipo; los resultados son orientativos y hay que comprobarlos siempre; se usa bajo la responsabilidad de cada cual, hasta donde lo permita la ley aplicable. El aviso completo (es/en/ca) está en la propia app, en el enlace «Aviso legal» que acompaña a la línea de crédito. Licencia GPL-3.0.

Documentos legales del repositorio: [`LEGAL.md`](LEGAL.md) (aviso legal), [`DISCLAIMER.md`](DISCLAIMER.md) (garantías y responsabilidad), [`PRIVACY.md`](PRIVACY.md) (privacidad), [`COOKIES.md`](COOKIES.md) (cookies y almacenamiento local) y [`LICENSE`](LICENSE) (GPL-3.0). Sin publicidad, afiliación ni ingresos de ningún tipo.
