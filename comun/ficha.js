/*
  SYSTEMS · copia de comun/ficha.js de SCREENS (v11.51) con los dibujos de reserva de los equipos de SYSTEMS (v2.6).
  SCREENS · ficha de equipo común (selector de material de todas las pantallas de cálculo)
  Una sola pieza para cabinets LED, proyectores, electrónicas y mediaservers: foto del fabricante,
  marca y modelo, especificaciones clave, piezas (equipos montados por módulos), avisos y enlace.
  Se usa con import en SCREENS y como script clásico en led.html (globalThis.SC_FICHA).
  Licencia GPL-3.0 · mediaservi.com
*/
(function () {
  'use strict';
  const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const okUrl = (u) => (/^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '');
  // Dibujo de reserva por tipo de equipo (solo si no hay foto o no carga)
  const DIBUJO = {
    led: '<svg viewBox="0 0 120 80" fill="none" stroke="#7b7b84" stroke-width="2"><rect x="14" y="10" width="92" height="60" rx="3"/><path d="M37 10v60M60 10v60M83 10v60M14 30h92M14 50h92"/></svg>',
    proy: '<svg viewBox="0 0 120 80" fill="none" stroke="#7b7b84" stroke-width="2" stroke-linejoin="round"><rect x="16" y="26" width="76" height="34" rx="6"/><circle cx="74" cy="43" r="11"/><circle cx="74" cy="43" r="5"/><path d="M28 34h22M28 41h22M28 48h22M24 60v6M84 60v6"/></svg>',
    elec: '<svg viewBox="0 0 120 80" fill="none" stroke="#7b7b84" stroke-width="2"><rect x="8" y="26" width="104" height="28" rx="2"/><path d="M14 34h10v12H14zM28 34h10v12H28zM42 34h10v12H42zM56 34h10v12H56z"/><circle cx="84" cy="40" r="4"/><path d="M94 34h12M94 40h12M94 46h12"/></svg>',
    media: '<svg viewBox="0 0 120 80" fill="none" stroke="#7b7b84" stroke-width="2" stroke-linejoin="round"><rect x="12" y="18" width="96" height="44" rx="3"/><path d="M50 30l18 10-18 10z"/><path d="M20 70h80"/></svg>',
    altavoz: '<svg viewBox="0 0 120 80" fill="none" stroke="#7b7b84" stroke-width="2"><rect x="40" y="6" width="40" height="68" rx="5"/><circle cx="60" cy="24" r="7"/><circle cx="60" cy="52" r="13"/><circle cx="60" cy="52" r="4"/></svg>',
    micro: '<svg viewBox="0 0 120 80" fill="none" stroke="#7b7b84" stroke-width="2" stroke-linecap="round"><rect x="50" y="6" width="20" height="38" rx="10"/><path d="M40 34a20 20 0 0 0 40 0M60 54v18M48 72h24"/></svg>',
    camara: '<svg viewBox="0 0 120 80" fill="none" stroke="#7b7b84" stroke-width="2" stroke-linejoin="round"><rect x="30" y="14" width="60" height="36" rx="8"/><circle cx="60" cy="32" r="11"/><circle cx="60" cy="32" r="4"/><path d="M52 50l-6 18h28l-6-18"/></svg>',
    display: '<svg viewBox="0 0 120 80" fill="none" stroke="#7b7b84" stroke-width="2"><rect x="12" y="8" width="96" height="54" rx="3"/><path d="M52 62v10M40 72h40"/></svg>',
    control: '<svg viewBox="0 0 120 80" fill="none" stroke="#7b7b84" stroke-width="2"><rect x="38" y="6" width="44" height="68" rx="6"/><circle cx="60" cy="30" r="10"/><path d="M50 52h20M50 60h20"/></svg>'
  };
  // ---------- v7.8 · visor de fotos del equipo ----------
  // Al pulsar la foto: popup con la trasera y a continuación el frontal en grande, con paginación (‹ ›, puntos, teclado y
  // deslizar) y botón de cerrar. Lo usan las fichas (data-visor) y las burbujas de electrónica de led.html (SC_VISOR.abrir).
  const TXV = {
    es: { cerrar: 'Cerrar', ant: 'Foto anterior', sig: 'Foto siguiente', frontal: 'Frontal', trasera: 'Trasera', vista: 'Otra vista', ver: 'Ver las fotos de', error: 'No se ha podido cargar la foto.' },
    en: { cerrar: 'Close', ant: 'Previous photo', sig: 'Next photo', frontal: 'Front', trasera: 'Rear', vista: 'Other view', ver: 'View the photos of', error: 'The photo could not be loaded.' },
    ca: { cerrar: 'Tanca', ant: 'Foto anterior', sig: 'Foto següent', frontal: 'Frontal', trasera: 'Posterior', vista: 'Una altra vista', ver: 'Veure les fotos de', error: 'No s’ha pogut carregar la foto.' },
    gl: { cerrar: 'Pechar', ant: 'Foto anterior', sig: 'Foto seguinte', frontal: 'Frontal', trasera: 'Traseira', vista: 'Outra vista', ver: 'Ver as fotos de', error: 'Non se puido cargar a foto.' },
    eu: { cerrar: 'Itxi', ant: 'Aurreko argazkia', sig: 'Hurrengo argazkia', frontal: 'Aurrealdea', trasera: 'Atzealdea', vista: 'Beste ikuspegi bat', ver: 'Argazkiak ikusi:', error: 'Ezin izan da argazkia kargatu.' },
    pt: { cerrar: 'Fechar', ant: 'Foto anterior', sig: 'Foto seguinte', frontal: 'Frente', trasera: 'Traseira', vista: 'Outra vista', ver: 'Ver as fotos de', error: 'Não foi possível carregar a foto.' }
  };
  const txv = () => TXV[String(document.documentElement.lang || 'es').slice(0, 2)] || TXV.es;
  const nombreLado = (lado, L) => (lado === 'trasera' ? L.trasera : lado === 'vista' ? L.vista : L.frontal);
  const urls = (v) => (Array.isArray(v) ? v : String(v || '').split(/[\s|,]+/)).map(okUrl).filter(Boolean);
  // la misma foto en otro tamaño (…-240.webp / …-1100.webp) cuenta como la misma
  const mismaFoto = (a, b) => { const n = (u) => String(u || '').toLowerCase().replace(/^https?:\/\/(www\.)?/, '').replace(/[?#].*$/, '').replace(/-(?:240|480|800|1100)(?=\.\w+$)/, ''); return !!a && !!b && n(a) === n(b); };
  // v7.8 · fotos que busca el propio motor cada noche (catálogo maestro, campo e: { modelo: { f frontal, t trasera, v otras vistas } });
  // se guardan en este navegador tal como llegan para tenerlas al instante la próxima vez
  const claveModelo = (s) => String(s || '').toLowerCase().replace(/\s*\(.*?\)\s*/g, ' ').replace(/[^a-z0-9]/g, '');
  const decodificar = (t) => { const b = atob(t), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return JSON.parse(new TextDecoder().decode(u).split('').reverse().join('')); };
  let MOTOR = {};
  try { const g = localStorage.getItem('sc_e1'); if (g) MOTOR = decodificar(g) || {}; } catch (e) { MOTOR = {}; }
  function recibirFotos(t) {
    if (!t || typeof t !== 'string') return false;
    try { const o = decodificar(t); if (!o || typeof o !== 'object') return false; MOTOR = o; try { localStorage.setItem('sc_e1', t); } catch (e) {} return true; } catch (e) { return false; }
  }
  // fotos de un equipo: las que trae su ficha y, si faltan, las del motor
  function fotosEquipo(modelo, frontal, trasera, vistas) {
    const m = MOTOR[claveModelo(modelo)] || {}, f = okUrl(frontal) || okUrl(m.f), t = okUrl(trasera) || okUrl(m.t), v = [];
    urls(vistas).concat(urls(m.v)).forEach((u) => { if (!mismaFoto(u, f) && !mismaFoto(u, t) && !v.some(x => mismaFoto(x, u))) v.push(u); });
    return { frontal: f, trasera: t, vistas: v.slice(0, 6) };
  }
  // fotos para el visor: la trasera primero, después las otras vistas y al final el frontal en grande
  const fotosDe = (frontal, trasera, vistas) => [okUrl(trasera) && { src: okUrl(trasera), lado: 'trasera' }].concat(urls(vistas).map(src => ({ src, lado: 'vista' })), [okUrl(frontal) && { src: okUrl(frontal), lado: 'frontal' }]).filter(Boolean);
  let vf = null, lista = [], pos = 0, titulo = '', origen = null, x0 = null;
  function montar() {
    vf = document.createElement('div'); vf.className = 'vf'; vf.hidden = true; vf.setAttribute('role', 'dialog'); vf.setAttribute('aria-modal', 'true'); vf.setAttribute('data-notr', '1');
    vf.innerHTML = '<div class="vf-fondo"></div><div class="vf-caja"><div class="vf-cab"><span class="vf-lado"></span><b class="vf-tit"></b></div>'
      + '<button type="button" class="vf-x"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>'
      + '<div class="vf-foto"><img alt="" draggable="false"><p class="vf-error" hidden></p></div>'
      + '<div class="vf-pie"><button type="button" class="vf-ant"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
      + '<div class="vf-pag"></div><button type="button" class="vf-sig"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>';
    document.body.appendChild(vf);
    vf.querySelector('.vf-fondo').addEventListener('click', cerrar);
    vf.querySelector('.vf-x').addEventListener('click', cerrar);
    vf.querySelector('.vf-ant').addEventListener('click', () => ir(pos - 1));
    vf.querySelector('.vf-sig').addEventListener('click', () => ir(pos + 1));
    vf.querySelector('.vf-pag').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) ir(Number(b.dataset.i)); });
    const img = vf.querySelector('.vf-foto img'), err = vf.querySelector('.vf-error');
    img.addEventListener('error', () => { img.hidden = true; err.hidden = false; });
    img.addEventListener('load', () => { img.hidden = false; err.hidden = true; });
    // deslizar con el dedo o el ratón para pasar de foto
    const zona = vf.querySelector('.vf-foto');
    zona.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    zona.addEventListener('pointerup', (e) => { if (x0 == null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) ir(pos + (dx < 0 ? 1 : -1)); });
    document.addEventListener('keydown', (e) => {
      if (!vf || vf.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(pos - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); ir(pos + 1); }
      else if (e.key === 'Tab') { const f = [...vf.querySelectorAll('button:not([hidden])')].filter(b => b.offsetParent); if (!f.length) return; const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
    }, true);
  }
  function ir(i) {
    if (!lista.length) return; pos = (i + lista.length) % lista.length;
    const L = txv(), f = lista[pos], img = vf.querySelector('.vf-foto img'), err = vf.querySelector('.vf-error');
    vf.querySelector('.vf-lado').textContent = nombreLado(f.lado, L);
    vf.querySelector('.vf-tit').textContent = titulo;
    err.textContent = L.error; err.hidden = true; img.hidden = false; img.alt = titulo + ' · ' + nombreLado(f.lado, L); img.src = f.src;
    const varias = lista.length > 1;
    vf.querySelector('.vf-pie').hidden = !varias;
    vf.querySelector('.vf-pag').innerHTML = varias ? lista.map((q, k) => `<button type="button" class="vf-punto${k === pos ? ' on' : ''}" data-i="${k}" aria-label="${esc(nombreLado(q.lado, L))}" aria-current="${k === pos}"></button>`).join('') + `<span class="vf-num">${pos + 1} / ${lista.length}</span>` : '';
  }
  function abrir(fotos, tit, desde) {
    lista = (fotos || []).filter(f => f && okUrl(f.src)); if (!lista.length) return;
    if (!vf) montar();
    const L = txv(); titulo = String(tit || '');
    vf.setAttribute('aria-label', titulo); vf.querySelector('.vf-x').setAttribute('aria-label', L.cerrar); vf.querySelector('.vf-x').title = L.cerrar;
    vf.querySelector('.vf-ant').setAttribute('aria-label', L.ant); vf.querySelector('.vf-sig').setAttribute('aria-label', L.sig);
    origen = document.activeElement; vf.hidden = false; document.documentElement.classList.add('vf-abierto');
    ir(desde || 0); vf.querySelector('.vf-x').focus();
  }
  function cerrar() {
    if (!vf || vf.hidden) return; vf.hidden = true; document.documentElement.classList.remove('vf-abierto');
    vf.querySelector('.vf-foto img').removeAttribute('src');
    if (origen && origen.focus) try { origen.focus(); } catch (e) {}
  }
  // las fotos de las fichas abren el visor con un clic o con Intro / espacio
  const desdeFicha = (el) => { try { const d = JSON.parse(el.getAttribute('data-visor')); abrir(d.f, d.t); } catch (e) {} };
  document.addEventListener('click', (e) => { const el = e.target.closest && e.target.closest('[data-visor]'); if (el) { e.preventDefault(); e.stopPropagation(); desdeFicha(el); } }, true);
  document.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-visor]')) { e.preventDefault(); desdeFicha(e.target); } });

  // ficha({ cat, icono, marca, modelo, claveFoto, foto, fotoTrasera, vistas:[], specs:[[k,v]], piezas:[{cant,ref,desc}], notas:[], avisos:[], stock, enlace, enlaceTxt, acento, sel })
  /* v10.50 · el stock es un dato interno: nunca se escribe (ni en pantalla ni en el PDF). Solo su icono: verde (caja) = de stock;
     naranja (tarjeta con reloj) = hay que pedirlo. Sin título ni texto alternativo que lo diga. */
  const IC_STOCK = {
    si: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/></svg>',
    no: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1.5" y="4" width="15" height="11" rx="2"/><path d="M1.5 8h15M4.5 11.5h4"/><circle cx="17.5" cy="16.5" r="5.5" fill="currentColor" stroke="none"/><path d="M17.5 13.6v3l2 1.2" stroke="#1a1206" stroke-width="1.8"/></svg>'
  };
  /* v10.70 · junto al icono, 3 rayas tipo semáforo según lo disponible en el batch mayor (1 roja, 2 ámbar, 3 verdes); sin números */
  /* v11.19 · los iconos de stock (caja verde, reloj naranja y semáforo) solo los ve el admin con su llave, y solo en su bloque: en público no sale
     ningún icono ni texto de stock (el único indicio es el color del nombre en el desplegable de cabinets). En las fichas y en el PDF, nunca */
  const interno = () => { try { return typeof globalThis.SC_INTERNO === 'function' && !!globalThis.SC_INTERNO(); } catch (e) { return false; } };
  const stockIc = (si, nivel) => (interno() && (si === true || si === false) ? `<span class="sc-stock ${si ? 'si' : 'no'}">${IC_STOCK[si ? 'si' : 'no']}</span>` + (nivel >= 1 && nivel <= 3 ? `<span class="sc-sem n${nivel}" aria-hidden="true"><i></i><i></i><i></i></span>` : '') : '');
  function fichaHTML(d) {
    const ic = DIBUJO[d.icono] || DIBUJO.elec;
    // v7.8 · foto real del frontal (la de la ficha o la que ha encontrado el motor); al pulsarla, la trasera, otras vistas y el frontal en grande
    const fe = fotosEquipo(d.claveFoto || d.modelo, d.foto, d.fotoTrasera, d.vistas), foto = fe.frontal || fe.trasera || fe.vistas[0] || '';
    const fotos = fotosDe(fe.frontal, fe.trasera, fe.vistas), nombre = [d.marca, d.modelo].filter(Boolean).join(' ');
    const visor = fotos.length ? ` data-visor="${esc(JSON.stringify({ t: nombre, f: fotos }))}" role="button" tabindex="0" aria-label="${esc(txv().ver + ' ' + nombre)}" title="${esc(txv().ver + ' ' + nombre)}"` : '';
    const st = '';   // v11.19 · la ficha es pública y sale en el PDF: sin icono de stock (antes, v10.50, llevaba el icono)
    let h = `<article class="ficha${d.sel ? ' fi-sel' : ''}" style="--fi-ac:${esc(d.acento || '#00ff04')}">`;
    h += `<div class="fi-cab"><span class="fi-cat">${esc(d.cat || '')}</span>${st}</div>`;
    h += `<div class="fi-cuerpo"><div class="fi-foto${fotos.length ? ' fi-zoom' : ''}"${visor}>${ic}${foto ? `<img src="${esc(foto)}" alt="${esc(d.modelo)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ''}</div>`;
    h += `<div class="fi-dat"><div class="fi-marca">${esc(d.marca || '')}</div><div class="fi-modelo">${esc(d.modelo || '')}</div></div></div>`;
    // especificaciones a todo el ancho de la ficha, en rejilla (2 columnas en paneles estrechos, más si hay sitio)
    if (d.specs && d.specs.length) h += `<dl class="fi-specs">${d.specs.filter(s => s && s[1] !== '' && s[1] != null).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
    if (d.piezas && d.piezas.length) h += `<ul class="fi-piezas">${d.piezas.map(p => `<li><b>${p.cant ? esc(p.cant) + '×' : ''}</b><span class="fi-ref">${esc(p.ref)}</span><span class="fi-desc">${esc(p.desc || '')}</span></li>`).join('')}</ul>`;
    (d.avisos || []).forEach(a => { h += `<p class="fi-aviso">${esc(a)}</p>`; });
    (d.notas || []).forEach(a => { h += `<p class="fi-nota">${esc(a)}</p>`; });
    const en = okUrl(d.enlace), lista = (d.enlaces || []).filter(x => okUrl(x[0]));
    if (en) lista.unshift([en, d.enlaceTxt || 'Ficha del fabricante']);
    if (lista.length) h += `<div class="fi-enlaces">${lista.map(([u, tx]) => `<a class="fi-enlace" href="${esc(okUrl(u))}" target="_blank" rel="noopener noreferrer">${esc(tx)} ↗</a>`).join('')}</div>`;
    return h + '</article>';
  }
  globalThis.SC_FICHA = { fichaHTML, fotosDe, fotosEquipo, recibirFotos, stockIc };
  globalThis.SC_VISOR = { abrir, cerrar, fotosDe };
})();
