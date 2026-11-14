# SYSTEMS

**SYSTEMS** es el apartado de [AVHUB](https://avhub.mediaservi.com) (mediaservi.com) que ayuda a técnicos e ingenieros a dar con la configuración correcta de cualquier proyecto: audio, vídeo, conectividad o videoconferencia.

**Versión actual: v0.19 (beta, en pruebas)** · Dirección definitiva: https://systems.mediaservi.com

## Para qué sirve

Reúne en una sola consola los cálculos que se hacen al diseñar y montar un sistema audiovisual. Se elige un calculador, se escriben los datos (o se cambian con las flechas) y el resultado sale al momento con sus cifras, gráficas, tablas y notas. Funciona en el navegador, sin conexión a ningún servidor, en español, inglés y catalán, y en TV, ordenador, tablet y móvil.

## Funciones

Primer bloque: **Audio y escenario**, con 26 calculadores en 9 grupos.

- **Acústica:** nivel SPL a distancia (con gráfica), suma de dos niveles por fase, tiempo o distancia (con el filtro de peine dibujado), cobertura de altavoces de techo (con la planta de la sala), absorción del aire según la norma ISO 9613-1, tiempo ↔ distancia y frecuencia ↔ longitud de onda.
- **Arrays:** distancia de transición de un line array, array de subgraves end-fire y línea de subgraves (broadside) con arco electrónico y orientación por retardo. Los dos de subgraves dibujan el diagrama polar, el mapa de cobertura de 50 × 50 m y la respuesta en frecuencia delante, al lado y detrás, y dan la tabla de retardos de cada caja.
- **Electrónica de audio:** dBu ↔ dBV ↔ voltios, factor Q ↔ ancho de banda, umbral y tiempos del limitador y ganancia del amplificador.
- **Cableado:** cable de altavoz en baja impedancia (pérdida, factor de amortiguamiento y comparación de secciones) y en línea de 70 / 100 V.
- **Iluminación y vídeo:** direcciones DMX con sus microinterruptores, color (RGB, RGBW, RGBA, CMY y hexadecimal) y proyector (distancia, brillo y contraste).
- **Electricidad:** ley de Ohm y de Joule, y potencia en kVA, kW y amperios en monofásico y trifásico.
- **Música y grabación:** tempo (BPM ↔ tiempo, con botón TAP), tamaño y tiempo de grabación y nota ↔ frecuencia.
- **Pesos y medidas:** conversor de peso, longitud, superficie, volumen y temperatura.
- **Referencia:** asignación de pines (XLR, jack, speakON, DB25, DMX y RJ45) y patrones polares de micrófonos.

**Instalable y sin conexión:** con el botón «Instalar» se queda como una app más del dispositivo y funciona sin internet.

La consola tiene tres zonas, como la de SCREENS: los calculadores a la izquierda, los datos en la segunda columna con CALCULAR y RESTABLECER al pie, y el resultado en el centro. En el móvil las zonas se apilan.

## Marcas y catálogo

En audio, SYSTEMS recomienda y calcula solo con tres marcas: **RCF** (altavoces), **Sennheiser** (micrófonos) y **Nureva** (audio para salas de reunión). La carpeta `catalogo/` guarda los productos de cada marca con sus características, tomadas de la web oficial de cada fabricante, para que todo funcione sin conexión.

Estado del catálogo en la v0.7: es una primera tanda (13 productos de RCF, 15 micrófonos de Sennheiser y 3 sistemas de Nureva) y **todavía no está conectado a los calculadores**. Falta completar las gamas y enlazarlo.

## Avisos

Los cálculos son orientativos: hay que comprobar siempre los datos del fabricante y la normativa antes de montar.

## Tecnología

HTML, CSS y JavaScript sin dependencias externas: `index.html`, `base.css` (estilos base de AVHUB), `estilo.css`, `calculos.js` (fórmulas), `textos.js` (idiomas) y `app.js` (interfaz). Las fuentes van en `assets/fonts/`. Es una app web instalable: `manifest.json`, el service worker `sw.js` (red primero para la app y los datos; copia guardada si no hay conexión) y `instalar.js` (el botón «Instalar», común a las apps de AVHUB). Al añadir archivos nuevos que deban estar disponibles sin conexión desde la primera visita, apúntalos en la lista `BASICO` de `sw.js`.

## Ramas

- `main`: versión pública aprobada.
- `beta`: última entrega en pruebas.
- `beta-anterior`: la beta previa.

## Cambios de la versión actual (v0.19)

- Logo nuevo de MSGAME en la barra de apps: «MS» en dos fichas moradas con la misma letra que GAME y sombra verde.

### v0.18

- Logo de MSGAME de la barra de apps con la calavera nueva: el ojo derecho es una cruceta de mando, como si guiñara.

### v0.17

- El aviso «Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.» lleva delante un triangulito de aviso discreto (monocromo, filete del color del texto), igual en todas las apps de cálculo de AVHUB. En la vista en una pantalla (beta), el aviso del pie va al mismo tamaño que los créditos, en una columna que se estira lo que haga falta.

## Cambios de la v0.16

- **Aviso común de las apps de cálculo de AVHUB:** al pie de las notas de cada calculador, «Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.» (antes: «Estos cálculos son orientativos: comprueba siempre los datos del fabricante y la normativa antes de montar.»). En español, inglés y catalán.
- **Pie común nuevo de AVHUB** (`credito.js`): «SYSTEMS vX.Y AAAA forma parte del proyecto AVHUB ideado por el fundador de mediaservi.com · Aviso legal», con el aviso legal en su ventana.

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
*SYSTEMS v0.19 es un proyecto hecho con ⚙ by [mediaservi.com](https://mediaservi.com)*

## Aviso

Software gratuito y de código abierto, hecho con pasión por un aficionado en su tiempo libre. No es un producto profesional. Se ofrece «tal cual», sin garantías de ningún tipo; los resultados son orientativos y hay que comprobarlos siempre; se usa bajo la responsabilidad de cada cual, hasta donde lo permita la ley aplicable. El aviso completo (es/en/ca) está en la propia app, en el enlace «Aviso legal» que acompaña a la línea de crédito. Licencia GPL-3.0.

Documentos legales del repositorio: [`LEGAL.md`](LEGAL.md) (aviso legal), [`DISCLAIMER.md`](DISCLAIMER.md) (garantías y responsabilidad), [`PRIVACY.md`](PRIVACY.md) (privacidad), [`COOKIES.md`](COOKIES.md) (cookies y almacenamiento local) y [`LICENSE`](LICENSE) (GPL-3.0). Sin publicidad, afiliación ni ingresos de ningún tipo.
