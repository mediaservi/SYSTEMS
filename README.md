# SYSTEMS

**SYSTEMS** es el apartado de [AVHUB](https://avhub.mediaservi.com) (mediaservi.com) que ayuda a técnicos e ingenieros a dar con la configuración correcta de cualquier proyecto: audio, vídeo, conectividad o videoconferencia.

**Versión actual: v1.9 (beta, en pruebas)** · Dirección definitiva: https://systems.mediaservi.com

## Para qué sirve

Reúne en una sola consola los cálculos que se hacen al diseñar y montar un sistema audiovisual, con los equipos de las marcas del catálogo. Funciona en el navegador, en español, inglés y catalán, y en TV, ordenador, tablet y móvil.

**Norma:** solo se calcula y se propone con las marcas y los fabricantes que están en las listas del panel AVHUB ADMIN. Si ninguna resuelve, el resultado lo dice.

## Funciones

**SYSTEMS vive en la misma casa que SCREENS:** la cabecera (logo, SIMPLE / PRO, familia AVHUB, información, PDF, nuevo cálculo, idioma y tema), la barra de módulos con la petición escrita y CALCULAR, la rejilla de bloques de PRO, los tres bloques de SIMPLE (lo que pides, esquema y resultado) y el pie (aviso, crédito, instalar y reporte de fallos) son los de SCREENS (`vista/blocks.css`, `vista/simple.css` y `vista/iconos.css`). Todos los módulos se abren en la misma consola:

- **ELECTRÓNICA** (como en SCREENS: UNA o VARIAS pantallas y LED, PROYECCIÓN o DISPLAYS)
  - *LED:* con la resolución (o el cabinet), las salidas de la fuente, cable de red o fibra y backup: líneas, reparto de la señal, procesador con su despiece, alternativas, conversores de fibra CVT10 junto a la pantalla (dibujados en el esquema) y avisos. Hasta 4 pantallas a la vez.
  - *PROYECCIÓN:* la misma imagen, distintas o fundida (blending): distribuidor, matriz o equipo de blending de las listas, y el cable o extensor de cada tramo.
  - *DISPLAYS:* monitores SAMSUNG, LG y CLEVER (lista del CRM de Charmex) por tamaño, uso (interior, escaparate, exterior, interactivo, tótem) y horas al día; espejo, distintas o videowall.
- **SEÑAL Y CONECTIVIDAD:** fuentes → selector, distribuidor o matriz (PURELINK) → destinos, con el cable o extensor de cada tramo según la distancia y la resolución (1080p, 4K60 a 18 Gbps u 8K a 48 Gbps), USB/KVM y AV sobre IP a partir de 8 fuentes o destinos.
- **AUDIO:** los 26 calculadores de audio y escenario (acústica, arrays, electrónica de audio, cableado, iluminación y vídeo, electricidad, música y grabación, medidas y referencia), con sus gráficas, tablas, resumen y notas.
- **VIDEOCONFERENCIA:** con las medidas de la sala y la gente, el tamaño de pantalla (espectador más lejano a 6 veces la altura de imagen, o 4 para documentos), la barra o cámara AVER por fondo de sala y campo de visión, y los micrófonos de techo SENNHEISER por cobertura.

En SIMPLE, un asistente pregunta lo justo la primera vez y cada línea de «Lo que pides» se cambia tocándola. En PRO se ven y cambian todos los datos, el esquema y el despiece. También se puede escribir la petición («pantalla LED de 8960 x 1536 con 3 salidas DP por fibra», «4 portátiles a 2 pantallas, distintas, 4K, a 30 m», «sala de 6 x 4 m para 10 personas») y pulsar CALCULAR.

**Instalable y sin conexión:** con el botón «Instalar» se queda como una app más del dispositivo y funciona sin internet.

## Listas de equipos

`comun/equipos.js` (procesadores LED: NOVASTAR, COEX y PIXELHUE, la misma de SCREENS) y `comun/sistemas.js` (displays SAMSUNG, LG y CLEVER; PURELINK; AVER; NUREVA; RCF; SENNHEISER; JUST ADD POWER) son las listas de fábrica, sin precios. El panel AVHUB ADMIN las carga y, una vez guardadas allí, la app usa las del panel (`?accion=equipos`).

## Avisos

Los cálculos son orientativos: hay que comprobar siempre los datos del fabricante y la normativa antes de montar.

## Tecnología

HTML, CSS y JavaScript sin dependencias externas. `index.html` carga la casa (`vista/casa.js`) y sus módulos (`vista/mod-electronica.js`, `mod-senal.js`, `mod-audio.js`, `mod-video.js`), con las reglas de conectividad en `vista/conectividad.js`, las listas en `vista/listas.js`, los calculadores en `calculos.js` y los textos en `textos.js` y en cada módulo. `audio.html` y `blocks/` llevan a la consola. Es una app web instalable: `manifest.json`, el service worker `sw.js` e `instalar.js`. Al añadir archivos que deban estar disponibles sin conexión desde la primera visita, apúntalos en la lista `BASICO` de `sw.js`.

## Ramas

- `main`: versión pública aprobada.
- `beta`: última entrega en pruebas.
- `beta-anterior`: la beta previa.

## Cambios de la versión actual (v1.9)
- Móvil vertical: las pestañas de módulo (Electrónica, Displays, Señal, Audio, Videoconf.) caben en una fila sin cortarse, y las opciones cortas como LED / Proyección / Displays van en fila en lugar de una por línea.

## Cambios de la v1.8
- **Móvil vertical más limpio**, igual que SCREENS (pedido por Josep, 23-11-2026): cabecera en una sola fila (isotipo, burbuja SIMPLE / PRO que cambia de modo al tocarla, iconos y el logo de AVHUB, que lleva a todas las apps; fuera los logos de las otras apps) y pie en una sola fila (triángulo de aviso que al tocarlo enseña el texto, «SYSTEMS v1.8», «Aviso legal» y candado). Instalar y avisar de un fallo pasan a la ventana de información.

## Cambios de la v1.7
- **Cables prioritarios** (tarifa parcial de PureLink, 23-11-2026: «los cables en los que podemos ser mucho más competitivos»): lo que el panel AVHUB ADMIN marca ⭐ PRIORITARIO se propone primero. En un tramo en el que vale tanto un extensor HDBaseT como un cable de fibra, si el cable es prioritario y el extensor no, se propone el cable y el extensor queda como alternativa. Los equipos prioritarios llevan ⭐ en las tablas y en las fichas.
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

- Listas de fábrica de audio sacadas del CRM de Charmex: RCF (altavoces, subgraves, etapas, procesadores y micrófonos), SENNHEISER (TeamConnect, inalámbricos, mesa y cuerpo) y NUREVA (HDL200, HDL310, HDL410 y HDX).
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
