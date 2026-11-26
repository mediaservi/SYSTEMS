/* SYSTEMS · PDF directo (el de SCREENS) · mediaservi.com · GPL-3.0
   El botón PDF descarga el archivo .pdf sin pasar por el diálogo de impresión del navegador (que en muchos aparatos solo
   ofrece impresoras). Se usa la misma hoja de impresión de siempre: se copia el documento a un marco oculto del ancho útil
   de un A4, se activan allí las reglas de @media print, se dibuja con html2canvas y se pagina con jsPDF (librerías alojadas
   en assets/lib/pdf, que solo se cargan al pulsar el botón). Si algo falla, quien llama recurre a window.print(). */
(function () {
  'use strict';
  const BASE = ((document.currentScript && document.currentScript.src) || location.href).replace(/[^/]*$/, '');
  const MM = 96 / 25.4, A4 = [210, 297];
  let libs = null;
  const carga = (src) => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('no carga ' + src)); document.head.appendChild(s); });
  const prepara = () => libs || (libs = Promise.all([carga(BASE + 'assets/lib/pdf/html2canvas-pro.min.js'), carga(BASE + 'assets/lib/pdf/jspdf.umd.min.js')]).catch((e) => { libs = null; throw e; }));
  const TXT = { es: 'Generando el PDF…', en: 'Generating the PDF…', ca: 'Generant el PDF…' };

  /* en la copia: lo que era «solo al imprimir» pasa a valer siempre y lo que era «solo en pantalla» deja de valer */
  function modoImpresion(doc) {
    const anda = (reglas) => { for (const r of reglas) { try {
      if (r.media && r.cssRules) { const m = r.media.mediaText; if (/\bprint\b/.test(m) && !/not\s+print/.test(m)) r.media.mediaText = m.replace(/\bonly\s+/g, '').replace(/\bprint\b/g, 'all'); else if (/\bscreen\b/.test(m) && !/not\s+screen/.test(m)) r.media.mediaText = 'not all'; }
      else if (r.cssRules) anda(r.cssRules);
    } catch (e) {} } };
    for (const h of doc.styleSheets) { try { anda(h.cssRules); } catch (e) {} }
  }
  /* hoja sin fondos negros ni gris oscuro: en la copia se aclaran los fondos oscuros (cajas, degradados y figuras de los dibujos) y se
     oscurecen los textos y las líneas que estaban pensados para verse sobre oscuro. No se toca lo que indique «respeta» (la pantalla de
     la simulación) ni las fotos, los vídeos y los lienzos. */
  function aclara(doc, raiz, respeta) {
    const win = doc.defaultView, cv = document.createElement('canvas'), memo = new Map(); cv.width = cv.height = 1; const q = cv.getContext('2d', { willReadFrequently: true });
    /* cualquier color de CSS (rgb, oklch, color-mix…) leído como lo pinta el navegador */
    const lee = (v) => { if (!v || v === 'none' || v === 'transparent' || /^url\(/.test(v)) return null; if (memo.has(v)) return memo.get(v); let c = null; try { q.clearRect(0, 0, 1, 1); q.fillStyle = '#000'; q.fillStyle = v; q.fillRect(0, 0, 1, 1); const d = q.getImageData(0, 0, 1, 1).data; c = { r: d[0], g: d[1], b: d[2], a: d[3] / 255 }; } catch (e) {} memo.set(v, c); return c; };
    const L = (c) => (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255, sat = (c) => { const mx = Math.max(c.r, c.g, c.b), mn = Math.min(c.r, c.g, c.b); return mx ? (mx - mn) / mx : 0; };
    const negro = (c) => L(c) < .12 || (L(c) < .36 && sat(c) < .35);   /* negro o gris oscuro; los colores vivos oscuros (morado, verde) no cuentan */
    const oscuro = (c) => { if (sat(c) < .18) return '#1f2937'; const k = .33 / Math.max(.05, L(c)); return 'rgb(' + Math.round(c.r * k) + ',' + Math.round(c.g * k) + ',' + Math.round(c.b * k) + ')'; };
    /* html2canvas dibuja cada <svg> aparte y sin hojas de estilo: lo que cuenta es el atributo o el estilo en línea, propio o heredado */
    const svgCol = (el, k) => { for (let e = el; e && e.nodeType === 1; e = e.parentNode) { const v = (e.style && e.style.getPropertyValue(k)) || e.getAttribute(k); if (v) return v === 'currentColor' ? win.getComputedStyle(e).color : v; if (e.tagName.toLowerCase() === 'svg') break; } return k === 'fill' ? '#000' : 'none'; };
    const pon = (el, k, v) => el.style.setProperty(k, v, 'important'), fuera = (el) => respeta && el.closest(respeta);
    const fondoClaro = (el) => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const c = lee(win.getComputedStyle(e).backgroundColor); if (c && c.a > .5) return L(c) > .5; } return true; };
    const todos = [...raiz.querySelectorAll('*')].filter((el) => !fuera(el) && !/^(img|canvas|video|picture|source|br|script|style)$/i.test(el.tagName)), svgs = new Set();
    todos.forEach((el) => { const cs = win.getComputedStyle(el), tag = el.tagName.toLowerCase();
      if (el.namespaceURI === 'http://www.w3.org/2000/svg') { if (tag === 'svg' || tag === 'g' || tag === 'defs' || tag === 'text' || tag === 'tspan') return; if (tag !== 'rect' && tag !== 'polygon') return; const f = lee(svgCol(el, 'fill')); if (!f || f.a < .4 || !negro(f) || parseFloat(svgCol(el, 'fill-opacity') === 'none' ? 1 : svgCol(el, 'fill-opacity')) < .4) return; let b; try { b = el.getBoundingClientRect(); } catch (e) { return; } if (Math.min(b.width, b.height) < 4 || b.width * b.height < 140) return;
        pon(el, 'fill', '#eef0f3'); const st = lee(svgCol(el, 'stroke')); if (!st || st.a < .2) { pon(el, 'stroke', '#6b7280'); pon(el, 'stroke-width', '1'); } const raizSvg = el.ownerSVGElement; if (raizSvg) svgs.add(raizSvg); return; }
      const bg = lee(cs.backgroundColor); if (bg && bg.a > .4 && negro(bg)) { pon(el, 'background-color', '#f3f4f6'); if (!(parseFloat(cs.borderTopWidth) > 0)) pon(el, 'border', '1px solid #9ca3af'); }
      const bi = cs.backgroundImage; if (bi && /gradient/.test(bi)) { const cols = (bi.match(/(?:rgba?|oklch|oklab|lab|lch|hsla?|color)\((?:[^()]|\([^()]*\))*\)|#[0-9a-f]{3,8}\b/gi) || []).map(lee).filter((c) => c && c.a > .4); if (cols.length && cols.every(negro)) { pon(el, 'background-image', 'none'); pon(el, 'background-color', '#f3f4f6'); if (!(parseFloat(cs.borderTopWidth) > 0)) pon(el, 'border', '1px solid #9ca3af'); } } });
    todos.forEach((el) => { const cs = win.getComputedStyle(el), tag = el.tagName.toLowerCase();
      if (el.namespaceURI === 'http://www.w3.org/2000/svg') { const raizSvg = el.ownerSVGElement; if (!raizSvg) return; const f = lee(svgCol(el, 'fill')), st = lee(svgCol(el, 'stroke')), texto = tag === 'text' || tag === 'tspan';
        /* lo que queda debajo de esta pieza dentro del dibujo: la última figura rellena anterior que contiene su centro */
        const debajo = () => { let b; try { b = el.getBoundingClientRect(); } catch (e) { return 1; } const cx = b.left + b.width / 2, cy = b.top + b.height / 2; let l = 1; for (const k of raizSvg.querySelectorAll('rect, polygon, path, circle, ellipse')) { if (k === el || (k.compareDocumentPosition(el) & 4) === 0) continue; const r = k.getBoundingClientRect(); if (r.width < 6 || r.height < 6 || cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) continue; const c = lee(svgCol(k, 'fill')); if (c && c.a > .5) l = L(c); } return l; };
        if (texto) { if (f && f.a > .3 && L(f) > .55 && debajo() > .5) pon(el, 'fill', oscuro(f)); else if (f && f.a > .3 && L(f) < .45 && debajo() < .3) pon(el, 'fill', '#ffffff'); }
        else if (st && st.a > .3 && L(st) > .7 && (svgs.has(raizSvg) || sat(st) > .6) && debajo() > .5) pon(el, 'stroke', oscuro(st)); return; }
      const col = lee(cs.color); if (col && col.a > .3 && L(col) > .6 && fondoClaro(el)) pon(el, 'color', oscuro(col));
      ['Top', 'Right', 'Bottom', 'Left'].forEach((ld) => { if (parseFloat(cs['border' + ld + 'Width']) > 0) { const bc = lee(cs['border' + ld + 'Color']); if (bc && bc.a > .3 && L(bc) > .7 && sat(bc) > .45) pon(el, 'border-' + ld.toLowerCase() + '-color', oscuro(bc)); } }); });
  }
  function velo(on) {
    let v = document.getElementById('avpdf-velo');
    if (!on) { if (v) v.remove(); return; }
    if (v) return; v = document.createElement('div'); v.id = 'avpdf-velo'; v.setAttribute('data-html2canvas-ignore', 'true'); v.setAttribute('role', 'status');
    v.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(8,8,14,.72);color:#fff;font:600 16px/1.3 Inter,system-ui,Arial,sans-serif;letter-spacing:.04em;text-align:center;padding:24px';
    v.textContent = TXT[(document.documentElement.lang || 'es').slice(0, 2)] || TXT.es; document.body.appendChild(v);
  }
  /* exporta(o) → Promise. o.raiz: elemento que contiene la hoja; o.paginas: [[selectores…], …] si las hojas ya vienen hechas
     (cada una se encaja en un A4); sin o.paginas se corta sola por donde no parte filas ni bloques. o.pieHtml / o.pieClase: pie de
     cada hoja; o.ocultar: selectores que no deben salir; o.margen (mm); o.nombre: nombre del archivo.
     o.claro (por defecto sí): hoja sin fondos oscuros; o.respeta: selectores que conservan su fondo (la pantalla de la simulación). */
  /* v10.60 · html2canvas descoloca las letras del texto que va SUELTO dentro de una caja flexible o de rejilla (los títulos de sección con su icono salían
     «E LECTRÓNICAY M EDIASERVER»): en la copia, ese texto se mete en su propia caja y se dibuja bien */
  function envuelveTexto(doc, raiz) {
    const win = doc.defaultView;
    raiz.querySelectorAll('*').forEach((el) => { if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml') return; let d = ''; try { d = win.getComputedStyle(el).display; } catch (e) { return; } if (!/flex|grid/.test(d)) return;
      [...el.childNodes].forEach((n) => { if (n.nodeType === 3 && n.textContent.trim()) { const c = doc.createElement('av-txt'); n.replaceWith(c); c.appendChild(n); } }); });
  }
  /* v10.60 · las fotos de otras webs (las de producto) no dejan copiarse a un lienzo y la hoja salía con el marco vacío: en la copia se traen como datos,
     primero directamente y, si la web no da permiso, a través del servicio de imágenes wsrv.nl (solo recibe la dirección pública de la foto). Si no se
     consigue, se quita la foto y queda el dibujo del equipo que hay debajo */
  async function traeFotos(raiz) {
    const aDatos = (b) => new Promise((ok, no) => { const f = new FileReader(); f.onload = () => ok(f.result); f.onerror = no; f.readAsDataURL(b); });
    const trae = async (u) => { const r = await fetch(u, { mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer' }); if (!r.ok) throw new Error('sin foto'); const b = await r.blob(); if (!/^image\//.test(b.type)) throw new Error('no es una imagen'); return aDatos(b); };
    const conTope = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('tarda')), ms))]);
    await Promise.all([...raiz.querySelectorAll('img')].map(async (im) => { const u = im.currentSrc || im.getAttribute('src') || ''; let ur; try { ur = new URL(u, location.href); } catch (e) { return; } if (!/^https?:$/.test(ur.protocol) || ur.origin === location.origin) return;
      let d = null; try { d = await conTope(trae(ur.href), 5000); } catch (e) { try { d = await conTope(trae('https://wsrv.nl/?url=' + encodeURIComponent(ur.href) + '&w=640&we&output=jpg&q=85'), 7000); } catch (e2) {} }
      if (!d) { im.remove(); return; } im.removeAttribute('srcset'); im.removeAttribute('loading'); im.removeAttribute('onerror'); await new Promise((ok) => { im.onload = im.onerror = ok; im.src = d; setTimeout(ok, 3000); }); }));
  }
  async function exporta(o) {
    velo(true); let sinZoom = null;
    try {
      await prepara(); if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
      const M = o.margen || 12, anchoMm = A4[0] - 2 * M, ancho = Math.round(anchoMm * MM), esc = o.escala || 2, med = {};
      /* v10.60 · LA CAUSA de los textos descolocados («E LECTRÓNICAY M EDIASERVER», columnas de la lista de material que se iban corriendo): html2canvas comprueba
         una sola vez, en esta página, si puede medir el texto sin tocarlo, con una caja de prueba de 123 px. Con la página escalada (el zoom de la plantilla, es
         decir, casi siempre) la caja no mide 123 y la librería pasa a su modo antiguo, que parte y envuelve cada trozo de texto y deforma la copia mientras la
         mide. Durante la exportación, esa caja de prueba lleva el zoom inverso: mide lo que debe y el texto se dibuja en su sitio */
      try { let z = 1; [document.documentElement, document.body].forEach((e) => { const v = parseFloat(getComputedStyle(e).zoom); if (v > 0) z *= v; }); if (Math.abs(z - 1) > .0005) { sinZoom = document.createElement('style'); sinZoom.textContent = 'boundtest{zoom:' + (1 / z) + '!important}'; document.head.appendChild(sinZoom); } } catch (e) {}
      const lienzo = await window.html2canvas(o.raiz, { scale: esc, backgroundColor: '#ffffff', useCORS: true, logging: false, windowWidth: ancho, windowHeight: Math.round((A4[1] - 2 * M - 6) * MM), scrollX: 0, scrollY: 0,
        onclone: async (doc, raiz) => {
          modoImpresion(doc);
          const st = doc.createElement('style'); st.textContent = 'html,body{width:' + ancho + 'px!important;min-width:0!important;max-width:none!important;margin:0!important;padding:0!important;overflow:visible!important;height:auto!important}.fi-foto html2canvaspseudoelement{display:none!important}[data-avpdf-pie]{position:static!important;display:block!important;width:100%!important;box-sizing:border-box;margin:0!important;padding:6px 0 0!important;text-align:center!important;font:400 7pt/1.55 Inter,Arial,sans-serif;color:#555;white-space:pre-line;background:#fff}' + (o.ocultar ? o.ocultar + '{display:none!important}' : '') + (o.css || ''); doc.head.appendChild(st);
          if (o.alClonar) { try { o.alClonar(doc, raiz); } catch (e) {} }
          if (o.claro !== false) { try { aclara(doc, raiz, o.respeta || '.shadow-screen, [data-pdf-respeta]'); } catch (e) { console.warn('PDF directo: aclarado', e); } }
          /* html2canvas no entiende «zoom»: se cambia por una escala equivalente que ocupa lo mismo en la hoja */
          doc.querySelectorAll('[style*="zoom"]').forEach((el) => { const f = parseFloat(el.style.zoom); if (!f || f === 1) return; el.style.setProperty('zoom', '1', 'important'); const w = el.offsetWidth, h = el.offsetHeight; const pon = (k, v) => el.style.setProperty(k, v, 'important'); pon('transform-origin', '0 0'); pon('transform', 'scale(' + f + ')'); const cs = doc.defaultView.getComputedStyle(el), ml = parseFloat(cs.marginLeft) || 0, pw = el.parentNode.clientWidth, centra = /center/.test(doc.defaultView.getComputedStyle(el.parentNode).justifyContent + cs.alignSelf) || ml > 1; pon('margin-left', (centra ? Math.max(0, (pw - w * f) / 2) : 0) + 'px'); pon('align-self', 'flex-start'); pon('margin-right', (w * (f - 1)) + 'px'); pon('margin-bottom', (h * (f - 1)) + 'px'); });
          try { envuelveTexto(doc, raiz); } catch (e) { console.warn('PDF directo: textos', e); }
          try { await traeFotos(raiz); } catch (e) { console.warn('PDF directo: fotos', e); }
          let pie = null; if (o.pieHtml) { pie = doc.createElement('div'); pie.setAttribute('data-avpdf-pie', ''); if (o.pieClase) pie.className = o.pieClase; pie.innerHTML = o.pieHtml; pie.style.setProperty('display', 'block', 'important'); pie.style.setProperty('position', 'static', 'important'); pie.style.setProperty('visibility', 'visible', 'important'); raiz.appendChild(pie); }
          const r0 = raiz.getBoundingClientRect(), rel = (el) => { const r = el.getBoundingClientRect(); return [r.top - r0.top, r.bottom - r0.top]; };
          med.alto = r0.height; med.ancho = r0.width; med.alto = raiz.getBoundingClientRect().height; med.pie = pie ? rel(pie) : null; if (med.pie && med.pie[1] - med.pie[0] < 2) med.pie = null;
          if (o.paginas) med.paginas = o.paginas.map((sels) => { let a = Infinity, b = -Infinity; sels.forEach((s) => raiz.querySelectorAll(s).forEach((el) => { const hs = [...el.children].filter((h) => h.getBoundingClientRect().height > 0); (hs.length ? hs : [el]).forEach((h) => { const r = rel(h); if (r[1] > r[0]) { a = Math.min(a, r[0]); b = Math.max(b, r[1]); } }); })); return b > a ? [Math.max(0, a - 2), b + 4] : null; }).filter(Boolean);
          else { const c = new Set(); raiz.querySelectorAll(o.cortes || ':scope > *, tr, .res-sec, .ficha, .tar, .im-captura, .avisos, li').forEach((el) => { if (el === pie) return; const r = rel(el); if (r[1] > r[0]) { c.add(Math.round(r[0])); c.add(Math.round(r[1])); } }); med.cortes = [...c].sort((x, y) => x - y); med.enteros = [...raiz.querySelectorAll(o.enteros || '.res-sec, .ficha, .tar, .im-captura, .avisos, tr, .im-titulo')].map(rel).filter((r) => r[1] > r[0]); }
        } });
      if (o.depura) console.log('PDF directo: medidas ' + JSON.stringify(med) + ' lienzo ' + lienzo.width + 'x' + lienzo.height);
      const k = lienzo.width / med.ancho;   /* píxeles de lienzo por píxel de hoja */
      const pieAlto = med.pie ? med.pie[1] - med.pie[0] : 0, fin = med.pie ? med.pie[0] : med.alto, utilMm = A4[1] - 2 * M - (pieAlto ? pieAlto / MM + 2 : 0), util = utilMm * MM;
      let trozos = [];
      if (med.paginas && med.paginas.length) trozos = med.paginas.map((p) => [Math.max(0, p[0]), Math.min(fin, p[1])]);
      else { let y = 0; const cs = med.cortes.filter((c) => c > 0 && c < fin); let seguro = 0; while (fin - y > util + 1 && seguro++ < 60) { const tope = y + util, parte = (c) => med.enteros.some((e) => e[0] < c - 1 && e[1] > c + 1 && e[1] - e[0] <= util && e[0] > y + 1), cand = cs.filter((c) => c > y + util * .25 && c <= tope && !parte(c)); const c = cand.length ? cand[cand.length - 1] : tope; trozos.push([y, c]); y = c; } trozos.push([y, fin]); }
      trozos = trozos.filter((t) => t[1] - t[0] > 2); if (!trozos.length) throw new Error('hoja vacía');
      const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }), tmp = document.createElement('canvas'), q = tmp.getContext('2d');
      const PV = o.previa ? [] : null, sMm = lienzo.width / anchoMm; let hojaPv = null, qPv = null;
      const pega = (y0, y1, xMm, yMm, wMm) => { const h = Math.max(1, Math.round((y1 - y0) * k)); tmp.width = lienzo.width; tmp.height = h; q.fillStyle = '#fff'; q.fillRect(0, 0, tmp.width, h); q.drawImage(lienzo, 0, Math.round(y0 * k), lienzo.width, h, 0, 0, lienzo.width, h); doc.addImage(tmp.toDataURL('image/jpeg', .93), 'JPEG', xMm, yMm, wMm, wMm * h / lienzo.width, undefined, 'FAST'); if (qPv) qPv.drawImage(tmp, xMm * sMm, yMm * sMm, wMm * sMm, wMm * h / lienzo.width * sMm); };
      trozos.forEach((t, i) => { if (i) doc.addPage(); if (PV) { hojaPv = document.createElement('canvas'); hojaPv.width = Math.round(A4[0] * sMm); hojaPv.height = Math.round(A4[1] * sMm); qPv = hojaPv.getContext('2d'); qPv.fillStyle = '#fff'; qPv.fillRect(0, 0, hojaPv.width, hojaPv.height); } const altoMm = (t[1] - t[0]) / MM, f = Math.min(1, utilMm / altoMm), w = anchoMm * f; pega(t[0], t[1], M + (anchoMm - w) / 2, M, w);
        if (med.pie) pega(med.pie[0], med.pie[1], M, A4[1] - M - pieAlto / MM, anchoMm);
        doc.setFont('courier', 'normal'); doc.setFontSize(8); doc.setTextColor(85); doc.text((i + 1) + '/' + trozos.length, A4[0] - M, A4[1] - M - (pieAlto ? pieAlto / MM / 2 - 2.2 : -4), { align: 'right' }); if (PV) { qPv.fillStyle = '#555'; qPv.font = Math.round(8 * .3528 * sMm) + 'px Courier, monospace'; qPv.textAlign = 'right'; qPv.fillText((i + 1) + '/' + trozos.length, (A4[0] - M) * sMm, (A4[1] - M - (pieAlto ? pieAlto / MM / 2 - 2.2 : -4)) * sMm); PV.push(hojaPv.toDataURL('image/jpeg', .88)); qPv = null; } });
      if (o.titulo) doc.setProperties({ title: o.titulo, creator: 'AVHUB · mediaservi.com' });
      const nombre = (o.nombre || 'SCREENS') + '.pdf';
      if (o.devuelve) return doc.output('blob');
      /* vista previa: el PDF y una imagen de cada hoja, tal cual sale (para enseñarla antes de guardar o imprimir) */
      if (PV) return { blob: doc.output('blob'), nombre, paginas: PV };
      doc.save(nombre); return nombre;
    } finally { velo(false); if (sinZoom) sinZoom.remove(); }
  }
  const sello = (pref) => { const d = new Date(), p = (n) => String(n).padStart(2, '0'); return (pref || 'SCREENS') + '_' + d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()); };
  /* con la copia sin conexión activa, las dos librerías se guardan de antemano (en segundo plano) para poder sacar el PDF sin red */
  try { if ('serviceWorker' in navigator) setTimeout(() => { if (navigator.serviceWorker.controller && navigator.onLine) ['html2canvas-pro.min.js', 'jspdf.umd.min.js'].forEach((f) => { fetch(BASE + 'assets/lib/pdf/' + f).catch(() => {}); }); }, 6000); } catch (e) {}
  window.AVPDF = { exporta, sello };
})();
