# SYSTEMS

**SYSTEMS** es el apartado de [AVHUB](https://avhub.mediaservi.com) (mediaservi.com) que ayuda a técnicos e ingenieros a dar con la configuración correcta de cualquier proyecto: audio, vídeo, conectividad o videoconferencia.

**Versión actual: v0.7 (beta, en pruebas)** · Dirección definitiva: https://systems.mediaservi.com

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

La consola tiene tres zonas, como la de SCREENS: los calculadores a la izquierda, los datos en la segunda columna con CALCULAR y RESTABLECER al pie, y el resultado en el centro. En el móvil las zonas se apilan.

## Marcas y catálogo

En audio, SYSTEMS recomienda y calcula solo con tres marcas: **RCF** (altavoces), **Sennheiser** (micrófonos) y **Nureva** (audio para salas de reunión). La carpeta `catalogo/` guarda los productos de cada marca con sus características, tomadas de la web oficial de cada fabricante, para que todo funcione sin conexión.

Estado del catálogo en la v0.7: es una primera tanda (13 productos de RCF, 15 micrófonos de Sennheiser y 3 sistemas de Nureva) y **todavía no está conectado a los calculadores**. Falta completar las gamas y enlazarlo.

## Avisos

Los cálculos son orientativos: hay que comprobar siempre los datos del fabricante y la normativa antes de montar.

## Tecnología

HTML, CSS y JavaScript sin dependencias externas: `index.html`, `base.css` (estilos base de AVHUB), `estilo.css`, `calculos.js` (fórmulas), `textos.js` (idiomas) y `app.js` (interfaz). Las fuentes van en `assets/fonts/`.

## Ramas

- `main`: versión pública aprobada.
- `beta`: última entrega en pruebas.
- `beta-anterior`: la beta previa.

## Cambios de la versión actual (v0.7)

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
*SYSTEMS v0.7 es un proyecto hecho con 𑣲 by [mediaservi.com](https://mediaservi.com)*
