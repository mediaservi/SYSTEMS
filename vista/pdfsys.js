// SYSTEMS · PDF del proyecto en dos hojas (v2.8), como el de SCREENS (pdf.js, el mismo motor): 1) el cálculo con su dibujo, el resumen y las
// cifras; 2) la lista de material y la ficha de cada equipo con su foto oficial. Vista previa antes de guardar o imprimir. GPL-3.0 · mediaservi.com
import { T, esc, textos, lang } from './util.js';
import { fichaDe, traduceDes } from './fichaprod.js';
import { VERSION } from './version.js';

textos({
  'hoja {a} de {b}': ['page {a} of {b}', 'full {a} de {b}'], 'Lista de material': ['Bill of materials', 'Llista de material'], 'Cant.': ['Qty', 'Quant.'], 'Referencia': ['Reference', 'Referència'], 'Descripción': ['Description', 'Descripció'],
  'Fichas de los equipos': ['Equipment datasheets', 'Fitxes dels equips'], 'Observaciones': ['Notes', 'Observacions'], 'Alternativa para comparar': ['Alternative for comparison', 'Alternativa per comparar'], 'Resumen': ['Summary', 'Resum'], 'Avisos': ['Notes', 'Avisos'],
  'Vista previa del PDF': ['PDF preview', 'Vista prèvia del PDF'], 'Guardar PDF': ['Save PDF', 'Desar PDF'], 'Imprimir': ['Print', 'Imprimir'], 'Cerrar': ['Close', 'Tancar'],
  'Equipos según información de los fabricantes. Sin precios: pídelos a tu distribuidor.': ['Equipment according to the manufacturers’ information. No prices: ask your distributor.', 'Equips segons informació dels fabricants. Sense preus: demana\'ls al teu distribuïdor.'],
  'No se ha podido generar el PDF.': ['The PDF could not be generated.', 'No s\'ha pogut generar el PDF.'],
  'Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.': ['Automatic calculation that may contain errors: check it before quoting or installing.', 'Càlcul automàtic que pot contenir errors: revisa\'l abans de pressupostar o instal·lar.']
});
const TI = '#17181c', G = '#c9ccd3';
let carga = null;
const libPDF = () => carga || (carga = new Promise((ok, no) => { if (window.AVPDF) { ok(); return; } const s = document.createElement('script'); s.src = 'pdf.js?v=' + VERSION; s.onload = ok; s.onerror = () => { carga = null; no(new Error('pdf.js')); }; document.head.appendChild(s); }));

/* una imagen (o un vídeo) cualquiera como datos, para meterla dentro del dibujo */
const aDatos = (b) => new Promise((ok, no) => { const f = new FileReader(); f.onload = () => ok(f.result); f.onerror = no; f.readAsDataURL(b); });
async function trae(u) {
  if (/^data:/.test(u)) return u;
  const intenta = async (x) => { const r = await fetch(x, { mode: 'cors', credentials: 'omit' }); if (!r.ok) throw new Error('sin imagen'); return aDatos(await r.blob()); };
  try { return await intenta(u); } catch (e) { return intenta('https://wsrv.nl/?url=' + encodeURIComponent(u) + '&w=1280&output=jpg&q=85'); }
}
const imagen = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
/* las reglas de las hojas de estilo que tocan a los dibujos (letras, colores de las vistas técnicas), para que el dibujo suelto se vea igual */
const raizCS = () => getComputedStyle(document.documentElement);
const sinVars = (t, cs) => String(t).replace(/var\((--[\w-]+)(?:\s*,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (m, k, def) => (cs.getPropertyValue(k).trim() || (def || '').trim() || '#888'));
function cssDibujos() {
  const cs = raizCS(); let t = ''; for (const h of document.styleSheets) { let rs; try { rs = h.cssRules; } catch (e) { continue; }
    for (const r of rs) { const s = r.selectorText || ''; if (/svg|vt-|\.t-|sim-esc/.test(s)) t += r.cssText + '\n'; } }
  return sinVars(t, cs);
}
/* el dibujo del bloque (SVG o la simulación 3D) como imagen JPG */
async function dibujo(caja, esqHtml) {
  const cv = caja && caja.querySelector('canvas[data-sim3d]');
  if (cv) { try { return cv.toDataURL('image/jpeg', 0.9); } catch (e) { return ''; } }
  /* el dibujo se rehace en horizontal (el del bloque puede estar en vertical si el bloque es estrecho) */
  let s0 = null; if (esqHtml) { const t = document.createElement('div'); t.innerHTML = esqHtml; s0 = t.querySelector('svg'); }
  if (!s0 && caja) s0 = caja.querySelector('svg'); if (!s0) return '';
  const s = s0.cloneNode(true); s.querySelectorAll('.no-cap').forEach((n) => n.remove());   /* v3.11 · sin los botones de la simulación */
  const vb = (s.getAttribute('viewBox') || '0 0 960 520').split(/\s+/).map(Number), W = vb[2], H = vb[3];
  s.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); s.setAttribute('width', W); s.setAttribute('height', H); s.removeAttribute('class');
  const cs = raizCS(); [s, ...s.querySelectorAll('*')].forEach((el) => { [...el.attributes].forEach((a) => { if (a.value.includes('var(')) el.setAttribute(a.name, sinVars(a.value, cs)); }); });
  const vt = s0.classList.contains('vt-svg'); if (vt) s.setAttribute('class', 'vt-svg');
  /* los reproductores incrustados no se pueden copiar: YouTube sale con su miniatura y lo demás con la carta de ajuste */
  for (const fo of [...s.querySelectorAll('foreignObject')]) {
    const ifr = fo.querySelector('iframe'), vid = fo.querySelector('video'), yt = ifr && (String(ifr.getAttribute('src')).match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/) || [])[1];
    const im = document.createElementNS('http://www.w3.org/2000/svg', 'image'); ['x', 'y', 'width', 'height'].forEach((a) => im.setAttribute(a, fo.getAttribute(a))); im.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    let href = 'assets/SCCHART.jpg';
    if (yt) href = 'https://i.ytimg.com/vi/' + yt + '/hqdefault.jpg';
    else if (vid) { const real = caja.querySelector('video'); try { const c = document.createElement('canvas'); c.width = real.videoWidth || 640; c.height = real.videoHeight || 360; c.getContext('2d').drawImage(real, 0, 0, c.width, c.height); href = c.toDataURL('image/jpeg', 0.85); } catch (e) {} }
    im.setAttribute('href', href); fo.replaceWith(im);
  }
  for (const im of s.querySelectorAll('image')) { const h = im.getAttribute('href'); if (!h) continue; try { im.setAttribute('href', await trae(new URL(h, document.baseURI).href)); } catch (e) { im.remove(); } }
  const st = document.createElementNS('http://www.w3.org/2000/svg', 'style'); st.textContent = cssDibujos() + "text{font-family:Inter,Arial,sans-serif}"; s.insertBefore(st, s.firstChild);
  const i = await imagen('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(s)));
  const c = document.createElement('canvas'), k = 2; c.width = W * k; c.height = H * k; const x = c.getContext('2d');
  x.fillStyle = vt ? '#151518' : '#2a2b30'; x.fillRect(0, 0, c.width, c.height); x.drawImage(i, 0, 0, c.width, c.height); await new Promise((ok) => setTimeout(ok, 120)); x.drawImage(i, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.9);
}
/* la lista de material: las filas del despiece del resultado (cantidad, referencia y descripción), juntando las repetidas */
function material(htmlRes) {
  const d = document.createElement('div'); d.innerHTML = htmlRes; const L = new Map();
  d.querySelectorAll('.equipo').forEach((eq) => { if (eq.closest('.alt, .alternativas') || eq.classList.contains('alt-pres')) return;
    eq.querySelectorAll('table.despiece tr').forEach((tr) => { const td = tr.querySelectorAll('td'); if (td.length < 3) return; const n = parseFloat(td[0].textContent) || 1, ref = td[1].textContent.trim(), des = td[2].childNodes[0] ? td[2].childNodes[0].textContent.trim() : td[2].textContent.trim(); if (!ref) return;
      const y = L.get(ref); if (y) y.n += n; else L.set(ref, { n, ref, des }); }); });
  return [...L.values()];
}
/* cuál de los equipos del resultado es alternativa (no entra en la lista): los que van detrás del rótulo ALTERNATIVAS */
function sinAlternativas(html) { const i = html.indexOf('<p class="alt-t"'); return i > 0 ? html.slice(0, i) : html; }

export async function hacePDF({ m, R, caja, esqHtml, cifras, nombreMod, proyecto, tostada }) {
  await libPDF();
  const hoja = document.createElement('div');
  try {
    const PR = proyecto || {}, l = lang(), ahora = new Date(), linCab = 'systems.mediaservi.com · ' + ahora.toLocaleDateString(l === 'en' ? 'en-GB' : 'es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' · ' + ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const cab = (n) => `<div style="display:grid;grid-template-columns:106px minmax(0,1fr) 106px;align-items:center;column-gap:14px;border-bottom:2px solid ${TI};padding-bottom:7px;margin-bottom:9px"><img src="assets/systems-logo-claro.svg" alt="SYSTEMS" style="height:28px;width:auto;justify-self:start"><div style="text-align:center;font:400 9px/1.2 'Share Tech Mono',monospace;color:#444;white-space:nowrap;overflow:hidden">${esc(linCab)} · ${esc(T('hoja {a} de {b}', { a: n, b: 2 }))}</div><img src="assets/avhub-logo-claro.svg" alt="AVHUB" style="height:24px;width:auto;justify-self:end"></div>` + (PR.proy || PR.cliente ? `<div style="margin:-3px 0 7px;font:400 9.5px/1.3 Inter,Arial,sans-serif;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${PR.proy ? '<b style="font-weight:800">' + esc(PR.proy) + '</b>' : ''}${PR.proy && PR.cliente ? ' · ' : ''}${esc(PR.cliente || '')}</div>` : '');
    const rot = (s) => `<div style="font:800 8.5px/1.2 Inter,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#555;margin:0 0 4px">${esc(s)}</div>`;
    const img = await dibujo(caja, esqHtml);
    const htmlRes = m.resultado(R), d = document.createElement('div'); d.innerHTML = htmlRes;
    const ver = d.querySelector('.veredicto'), av = [...d.querySelectorAll('.avisos li')].map((li) => li.textContent.trim()).filter(Boolean);
    const tituloRes = ver ? (ver.querySelector('b') || {}).textContent || '' : (R.semTxt || ''), lineaRes = ver ? (ver.querySelector('p') || {}).textContent || '' : '';
    const cif = (cifras || []).slice(0, 6).map((q) => `<div style="border:1px solid ${G};border-left:3px solid ${q.c && !/var\(/.test(q.c) ? q.c : '#6b7280'};border-radius:6px;padding:6px 9px;background:#fff;min-width:0">${rot(T(q.t))}<div style="font:700 15px/1.15 'Share Tech Mono',monospace;color:${TI};overflow-wrap:anywhere">${esc(q.v)}${q.u ? ` <span style="font-size:10px;font-weight:400">${esc(q.u)}</span>` : ''}</div>${q.s ? `<div style="font:400 8.5px/1.3 Inter,Arial,sans-serif;color:#555;margin-top:2px">${esc(q.s)}</div>` : ''}</div>`).join('');
    const p1 = cab(1) +
      `<div style="border:1px solid ${TI};border-radius:6px;padding:7px 10px;margin-bottom:9px"><div style="font:800 9px/1.2 Inter,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#555">${esc(T(nombreMod))}</div><div style="font:800 13px/1.3 Inter,Arial,sans-serif;margin-top:2px">${esc(tituloRes)}</div>${lineaRes ? `<div style="font:400 10px/1.4 Inter,Arial,sans-serif;margin-top:2px">${esc(lineaRes)}</div>` : ''}</div>` +
      (img ? `<div style="margin-bottom:9px"><img src="${img}" alt="" style="display:block;max-width:100%;max-height:430px;width:auto;height:auto;margin:0 auto;border:1px solid ${G};border-radius:6px"></div>` : '') +
      `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-bottom:9px">${cif}</div>` +
      (PR.obs && PR.obs.trim() ? `<div style="border:1px solid ${G};border-radius:6px;padding:6px 10px;margin-bottom:8px">${rot(T('Observaciones'))}<div style="font:400 9.5px/1.45 Inter,Arial,sans-serif;white-space:pre-wrap">${esc(PR.obs.trim())}</div></div>` : '') +
      (av.length ? `<div style="border:1px solid ${G};border-radius:6px;padding:6px 10px">${rot(T('Avisos'))}<ul style="margin:0;padding-left:1.2em;font:400 9.5px/1.45 Inter,Arial,sans-serif">${av.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>` : '');
    const mat = material(sinAlternativas(htmlRes));
    /* v3.1 · la alternativa que se presupuesta para comparar (p. ej. interactiva frente a proyección) va en su propia lista, con su semáforo */
    const dA = document.createElement('div'); dA.innerHTML = htmlRes; const altEq = dA.querySelector('.equipo.alt-pres');
    const matA = altEq ? (() => { const tr = altEq.querySelector('table.despiece tr'), td = tr ? tr.querySelectorAll('td') : []; return td.length < 3 ? [] : [{ n: parseFloat(td[0].textContent) || 1, ref: td[1].textContent.trim(), des: (td[2].childNodes[0] ? td[2].childNodes[0].textContent : td[2].textContent).trim(), sem: (/sem-([var])/.exec(altEq.className) || [])[1] }]; })() : [];
    const SEMC = { v: '#14a83b', a: '#c98a00', r: '#d0283a' };
    const fichas = mat.concat(matA).map((x) => fichaDe(x.ref)).filter(Boolean).slice(0, 12);
    const tablaA = matA.length ? rot(T('Alternativa para comparar')) + `<table style="width:100%;border-collapse:collapse;font:400 9.5px/1.4 Inter,Arial,sans-serif;margin-bottom:10px;border-left:4px solid ${SEMC[matA[0].sem] || '#6b7280'}"><tbody>` +
      matA.map((x) => `<tr><td style="text-align:right;padding:3px 6px;border-bottom:1px solid #e3e5ea;font-weight:700;width:34px">${x.n}</td><td style="padding:3px 6px;border-bottom:1px solid #e3e5ea;font-family:'Share Tech Mono',monospace;white-space:nowrap">${esc(x.ref)}</td><td style="padding:3px 6px;border-bottom:1px solid #e3e5ea">${esc(traduceDes(x.des, l))}</td></tr>`).join('') + '</tbody></table>' : '';
    /* v3.5 · con un reproductor NovaStar, el bloque de VNNOX y ViPlex (de SCREENS) */
    const soft = R && R.rec && d.querySelector('.soft-sys') && globalThis.SC_SOFT ? globalThis.SC_SOFT.html(R.rec, l, true).replace(/<span class="soft-l/g, '<span data-pdf-respeta class="soft-l') : '';   /* el fondo oscuro de los logotipos no se aclara */
    const p2 = cab(2) + (mat.length ? rot(T('Lista de material')) +
      `<table style="width:100%;border-collapse:collapse;font:400 9.5px/1.4 Inter,Arial,sans-serif;margin-bottom:6px"><thead><tr>${[T('Cant.'), T('Referencia'), T('Descripción')].map((s, i) => `<th style="text-align:${i ? 'left' : 'right'};padding:3px 6px;border-bottom:1.5px solid ${TI};font-weight:800">${esc(s)}</th>`).join('')}</tr></thead><tbody>` +
      mat.map((x) => `<tr><td style="text-align:right;padding:3px 6px;border-bottom:1px solid #e3e5ea;font-weight:700">${x.n}</td><td style="padding:3px 6px;border-bottom:1px solid #e3e5ea;font-family:'Share Tech Mono',monospace;white-space:nowrap">${esc(x.ref)}</td><td style="padding:3px 6px;border-bottom:1px solid #e3e5ea">${esc(traduceDes(x.des, l))}</td></tr>`).join('') + '</tbody></table>' : '') +
      tablaA + soft + `<div style="font:400 8.5px/1.4 Inter,Arial,sans-serif;color:#555;margin-bottom:10px">${esc(T('Equipos según información de los fabricantes. Sin precios: pídelos a tu distribuidor.'))}</div>` +
      (fichas.length ? rot(T('Fichas de los equipos')) + `<div class="pdf-fichas" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">${fichas.map((f) => f.html).join('')}</div>` : '');
    hoja.id = 'hoja-pdf'; hoja.style.cssText = `position:fixed;left:-20000px;top:0;width:702px;background:#fff;color:${TI};font:400 10px/1.4 Inter,Arial,sans-serif`;
    hoja.innerHTML = `<div class="pdf-p1"><div style="padding:0 0 6px">${p1}</div></div><div style="height:60px"></div><div class="pdf-p2"><div style="padding:0 0 6px">${p2}</div></div>`;
    document.body.appendChild(hoja);
    await Promise.all([...hoja.querySelectorAll('img')].map((i) => (i.complete ? 0 : new Promise((ok) => { i.onload = i.onerror = ok; setTimeout(ok, 4000); }))));
    const tri = '<svg viewBox="0 0 24 24" style="width:1.05em;height:1.05em;vertical-align:-.18em;margin-right:.35em" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 2 21h20L12 3z"/><path d="M12 10v5M12 18h.01"/></svg>';
    const pv = await window.AVPDF.exporta({ previa: true, raiz: hoja, paginas: [['.pdf-p1'], ['.pdf-p2']], margen: 12, nombre: window.AVPDF.sello('SYSTEMS'), titulo: 'SYSTEMS · ' + (PR.proy || T(nombreMod)),
      pieHtml: tri + esc(T('Cálculo automático que puede contener errores: revísalo antes de presupuestar o instalar.')) + '\n' + (window.AVCREDITO ? window.AVCREDITO.html('SYSTEMS', VERSION, l, { sinEnlaces: true }) : 'SYSTEMS ' + VERSION + ' · mediaservi.com'),
      respeta: '[data-pdf-respeta]',
      alClonar: (doc, raiz) => { raiz.style.setProperty('position', 'absolute', 'important'); raiz.style.setProperty('left', '0', 'important'); raiz.style.setProperty('top', '0', 'important'); [...doc.body.children].forEach((e) => { if (e !== raiz && !e.contains(raiz)) e.style.setProperty('display', 'none', 'important'); }); } });
    previa(pv);
  } catch (e) { console.warn('pdf', e); if (tostada) tostada(T('No se ha podido generar el PDF.'), 5000); throw e; }
  finally { hoja.remove(); }
}

/* vista previa: las dos hojas tal cual salen, con Guardar, Imprimir y Cerrar */
let PV = null;
function previa(pv) {
  if (!pv || !pv.blob) return; cierra(); PV = { ...pv, url: URL.createObjectURL(pv.blob) };
  const v = document.createElement('div'); v.className = 'sim-velo pv-velo'; v.id = 'pv-velo';
  v.innerHTML = `<div class="vent previa" role="dialog" aria-modal="true" aria-label="${esc(T('Vista previa del PDF'))}"><div class="vent-cab"><span>${esc(T('Vista previa del PDF'))}</span><span class="sep"></span><button type="button" class="tog" data-pv="guarda"><span>${esc(T('Guardar PDF'))}</span></button><button type="button" class="tog" data-pv="imprime"><span>${esc(T('Imprimir'))}</span></button><button type="button" class="tog" data-pv="cierra"><span>${esc(T('Cerrar'))}</span></button></div>
    <div class="vent-cu pv-hojas">${pv.paginas.map((src, i) => `<img class="pv-hoja" src="${src}" alt="${esc(T('hoja {a} de {b}', { a: i + 1, b: pv.paginas.length }))}">`).join('')}</div></div>`;
  document.body.appendChild(v);
}
function cierra() { const v = document.getElementById('pv-velo'); if (v) v.remove(); if (PV && PV.url) URL.revokeObjectURL(PV.url); PV = null; }
document.addEventListener('click', (e) => {
  const b = e.target.closest && e.target.closest('[data-pv]'); if (!b && e.target.id !== 'pv-velo') return; if (!PV) { cierra(); return; }
  const k = b ? b.dataset.pv : 'cierra';
  if (k === 'cierra') cierra();
  else if (k === 'guarda') { const a = document.createElement('a'); a.href = PV.url; a.download = PV.nombre; document.body.appendChild(a); a.click(); a.remove(); }
  else if (k === 'imprime') { const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'; f.src = PV.url; document.body.appendChild(f); f.onload = () => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (er) { window.open(PV.url, '_blank'); } setTimeout(() => f.remove(), 60000); }; }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.getElementById('pv-velo')) cierra(); });
