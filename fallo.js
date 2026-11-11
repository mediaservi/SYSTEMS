/* AVHUB · botón de aviso de fallos, común a todas las apps (SCREENS, SYSTEMS, ADPOSTER, VJSHOW y MSGAME).
   Una seta roja de emergencia con un bichito: al pasar el cursor explica para qué sirve; al pulsarla abre una ventana donde contar el fallo
   y adjuntar capturas. El aviso viaja al panel AVHUB ADMIN, que lo reenvía por correo y responde al momento a quien lo envía.
   Uso: AVFALLO.boton({ app:'SCREENS', version:'v8.9', idioma:()=>'es' }) devuelve el botón listo para colocarlo en la barra.
   Licencia GPL-3.0 · mediaservi.com · icono «bug_report» y «warning» de Material Symbols (Apache-2.0) */
(function () {
  'use strict';
  if (window.AVFALLO) return;
  var URL_ADMIN = 'https://script.google.com/macros/s/AKfycbwkc12y4LODbFe-kQidnR2MbbA6cbW1WbhU3UiqmDmshx-ncAdGYrFRy8PNjm9Wg6Mx3w/exec';
  var T = {
    es: { tip: '¿Algo no funciona bien? Pulsa y cuéntanoslo: nos llega al momento.', nom: 'Avisar de un fallo', t: '¿Has encontrado algún fallo en esta aplicación?', p: 'Por favor, repórtalo. Cuéntanos qué ha pasado y, si puedes, añade una captura: nos ayuda mucho a arreglarlo.', d: 'Qué ha fallado', dp: 'Qué estabas haciendo, qué esperabas que pasara y qué ha pasado…', c: 'Tu correo, para responderte (opcional)', i: 'Añadir capturas o imágenes', m: 'hasta 3', e: 'Enviar', x: 'Cancelar', s: 'Enviando…', ok: '¡Enviado! Muchas gracias por reportarnos el fallo. Lo revisaremos lo antes posible e intentaremos arreglarlo.', ko: 'No se ha podido enviar. Comprueba la conexión y vuelve a intentarlo.', f: 'Escribe al menos unas palabras sobre el fallo.', cm: 'Ese correo no parece válido.', cl: 'Cerrar', q: 'Quitar' },
    en: { tip: 'Something not working? Press here and tell us: we get it right away.', nom: 'Report a bug', t: 'Have you found a bug in this app?', p: 'Please report it. Tell us what happened and, if you can, add a screenshot: it really helps us fix it.', d: 'What went wrong', dp: 'What you were doing, what you expected and what happened…', c: 'Your email, so we can reply (optional)', i: 'Add screenshots or images', m: 'up to 3', e: 'Send', x: 'Cancel', s: 'Sending…', ok: 'Sent! Thank you very much for reporting the bug. We will look into it and try to fix it as soon as possible.', ko: 'It could not be sent. Check your connection and try again.', f: 'Write at least a few words about the bug.', cm: 'That email does not look valid.', cl: 'Close', q: 'Remove' },
    ca: { tip: 'Alguna cosa no va bé? Prem i explica-nos-ho: ens arriba a l’instant.', nom: 'Avisar d’un error', t: 'Has trobat algun error en aquesta aplicació?', p: 'Si us plau, informa’ns-en. Explica’ns què ha passat i, si pots, afegeix-hi una captura: ens ajuda molt a arreglar-ho.', d: 'Què ha fallat', dp: 'Què estaves fent, què esperaves que passés i què ha passat…', c: 'El teu correu, per respondre’t (opcional)', i: 'Afegir captures o imatges', m: 'fins a 3', e: 'Enviar', x: 'Cancel·lar', s: 'Enviant…', ok: 'Enviat! Moltes gràcies per informar-nos de l’error. El revisarem tan aviat com puguem i mirarem d’arreglar-lo.', ko: 'No s’ha pogut enviar. Comprova la connexió i torna-ho a provar.', f: 'Escriu almenys unes paraules sobre l’error.', cm: 'Aquest correu no sembla vàlid.', cl: 'Tancar', q: 'Treure' }
  };
  var tx = function (l) { return T[String(l || 'es').slice(0, 2).toLowerCase()] || T.en; };
  var uid = 0;
  /* la seta: base amarilla con franjas de aviso, pulsador rojo abombado y el bichito centrado */
  function seta() {
    var n = ++uid;
    return '<svg class="avf-seta" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><defs><clipPath id="avfc' + n + '"><rect x="3" y="4" width="42" height="36" rx="8"/></clipPath><radialGradient id="avfr' + n + '" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#ff8a6e"/><stop offset=".45" stop-color="#ee3323"/><stop offset="1" stop-color="#a3120c"/></radialGradient></defs>' +
      '<rect x="3" y="8" width="42" height="37" rx="8" fill="#c98f00"/><rect x="3" y="4" width="42" height="36" rx="8" fill="#ffc400"/>' +
      '<g clip-path="url(#avfc' + n + ')" stroke="#16130a" stroke-width="4.6"><path d="M-8 22 18-4M-8 36 32-4M-2 44 46-4M12 44 56 0M26 44 60 10M40 44 60 24"/></g>' +
      '<rect x="3" y="4" width="42" height="36" rx="8" fill="none" stroke="#ffe27a" stroke-width="1.2" opacity=".7"/><ellipse cx="24" cy="25.5" rx="15.5" ry="13" fill="#000" opacity=".35"/>' +
      '<g class="avf-dome"><ellipse cx="24" cy="24" rx="15" ry="12.6" fill="#7d0d08"/><ellipse cx="24" cy="21" rx="15" ry="13" fill="url(#avfr' + n + ')"/><ellipse cx="19" cy="14.5" rx="6.5" ry="3.2" fill="#fff" opacity=".28" transform="rotate(-14 19 14.5)"/>' +
      '<path transform="translate(14.4 11.2) scale(.8)" fill="#fff" d="M12,19q1.65,0 2.83-1.18T16,15V11q0-1.65-1.17-2.83T12,7T9.18,8.17T8,11v4q0,1.65 1.18,2.82T12,19Zm-2-3h4V14H10v2Zm0-4h4V10H10v2Zm2,1Zm0,8q-1.63,0-3.01-0.8T6.8,18H4V16H6.1q-0.08-0.5-0.09-1T6,14H4V12H6q0-0.5 0.01-1T6.1,10H4V8H6.8Q7.15,7.43 7.59,6.93T8.6,6.05L7,4.4L8.4,3l2.15,2.15q0.7-0.22 1.43-0.22T13.4,5.15L15.6,3L17,4.4L15.35,6.05q0.57,0.38 1.04,0.86T17.2,8H20v2H17.9q0.07,0.5 0.09,1T18,12h2v2H18q0,0.5-0.01,1T17.9,16H20v2H17.2q-0.8,1.4-2.19,2.2T12,21Z"/></g></svg>';
  }
  var AVISO = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M1 21 12 2l11 19H1Zm3.45-2h15.1L12 6 4.45 19ZM12 18q.42 0 .71-.29T13 17t-.29-.71T12 16t-.71.29T11 17t.29.71T12 18Zm-1-3h2v-5h-2v5Z"/></svg>';
  var CSS = '.avf-btn{position:relative;flex:none;display:inline-grid;place-items:center;width:var(--avf,2.1rem);height:var(--avf,2.1rem);padding:0;margin:0;border:0;border-radius:22%;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent;line-height:0}' +
    '.avf-btn .avf-seta{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 1px 1px rgba(0,0,0,.5))}.avf-btn .avf-dome{transition:transform .08s;transform-origin:24px 30px}' +
    '.avf-btn:hover .avf-seta,.avf-btn:focus-visible .avf-seta,.avf-btn.tv-focused .avf-seta{filter:drop-shadow(0 1px 1px rgba(0,0,0,.5)) drop-shadow(0 0 5px rgba(255,80,60,.9))}.avf-btn:active .avf-dome{transform:translateY(1.6px) scale(.97)}' +
    '.avf-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '.avf-tip{position:fixed;z-index:2147483000;display:flex;align-items:flex-start;gap:.5rem;max-width:min(18rem,calc(100vw - 16px));box-sizing:border-box;padding:.55rem .7rem;border-radius:.55rem;background:#16130a;border:1px solid #ffc400;box-shadow:0 .5rem 1.4rem rgba(0,0,0,.55);color:#fff3c4;font:600 .8rem/1.35 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;text-align:left;pointer-events:none;opacity:0;transform:translateY(3px);transition:opacity .14s,transform .14s}' +
    '.avf-tip.on{opacity:1;transform:none}.avf-tip svg{flex:none;width:1.25rem;height:1.25rem;color:#ffc400;margin-top:.05rem}' +
    '.avf-ov{position:fixed;inset:0;z-index:2147483001;display:grid;place-items:center;padding:12px;box-sizing:border-box;background:rgba(4,4,8,.72);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);font:500 15px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#e9ecf1;overflow:auto}' +
    '.avf-win{width:min(31rem,100%);max-height:calc(100dvh - 24px);overflow:auto;box-sizing:border-box;border-radius:14px;background:linear-gradient(180deg,#2b2c31,#1b1c20);border:1px solid #000;box-shadow:0 0 0 1px rgba(255,255,255,.08) inset,0 1.4rem 3rem rgba(0,0,0,.7);padding:18px 18px 16px}' +
    '.avf-hd{display:flex;align-items:center;gap:12px;margin:0 0 10px}.avf-hd .avf-seta{flex:none;width:44px;height:44px}.avf-hd h2{margin:0;font:800 1.08rem/1.25 inherit;color:#fff;letter-spacing:.01em}' +
    '.avf-win p{margin:0 0 12px;color:#c5ccd4;font-size:.9rem}.avf-win label{display:block;margin:0 0 10px;font:700 .7rem/1.2 inherit;letter-spacing:.09em;text-transform:uppercase;color:#aeb6c0}' +
    '.avf-win textarea,.avf-win input[type=email]{display:block;width:100%;box-sizing:border-box;margin-top:5px;padding:9px 10px;border-radius:8px;border:1px solid #000;background:#0d0e11;box-shadow:inset 0 1px 3px rgba(0,0,0,.7),0 1px 0 rgba(255,255,255,.07);color:#f3f5f8;font:500 16px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;letter-spacing:0;text-transform:none}' +
    '.avf-win textarea{min-height:7.2rem;resize:vertical}.avf-win textarea:focus,.avf-win input[type=email]:focus{outline:2px solid #ffc400;outline-offset:1px}' +
    '.avf-web{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0}' +
    '.avf-add{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;border:1px dashed #6b7280;background:rgba(255,255,255,.04);color:#e9ecf1;font:700 .8rem/1 inherit;cursor:pointer}.avf-add:hover,.avf-add:focus-visible{border-color:#ffc400;outline:none}.avf-add small{color:#9aa3ad;font-weight:600}' +
    '.avf-th{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 0}.avf-th:empty{display:none}.avf-th span{position:relative;display:block;width:76px;height:56px;border-radius:6px;overflow:hidden;border:1px solid #000;background:#000}.avf-th img{width:100%;height:100%;object-fit:cover;display:block}' +
    '.avf-th button{position:absolute;right:2px;top:2px;width:20px;height:20px;padding:0;border:0;border-radius:50%;background:rgba(0,0,0,.75);color:#fff;font:700 12px/20px system-ui,sans-serif;cursor:pointer}' +
    '.avf-msg{min-height:1.2em;margin:12px 0 0;font-size:.86rem;color:#ffc400}.avf-msg.ok{color:#8dff7a}.avf-msg.ko{color:#ff8a7a}' +
    '.avf-bt{display:flex;justify-content:flex-end;gap:10px;margin-top:12px;flex-wrap:wrap}.avf-bt button{padding:10px 18px;border-radius:9px;border:1px solid #000;font:800 .8rem/1 inherit;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;color:#e9ecf1;background:linear-gradient(180deg,#4a4c54,#2e3036);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 2px 0 #000}' +
    '.avf-bt button.avf-go{color:#fff;background:linear-gradient(180deg,#f04a3a,#c2241a);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 2px 0 #5a0c08}.avf-bt button:focus-visible{outline:2px solid #fff;outline-offset:2px}.avf-bt button:disabled{opacity:.55;cursor:default}';
  function estilos() { if (document.getElementById('avf-css')) return; var s = document.createElement('style'); s.id = 'avf-css'; s.textContent = CSS; document.head.appendChild(s); }
  var idioma = function (o) { try { return (typeof o.idioma === 'function' ? o.idioma() : o.idioma) || document.documentElement.lang || 'es'; } catch (e) { return 'es'; } };

  /* aviso al pasar el cursor (o al enfocar con el teclado o el mando): símbolo de advertencia y una frase */
  var tip = null, tipT = 0;
  function verTip(b, o) {
    estilos(); ocultarTip(); tip = document.createElement('div'); tip.className = 'avf-tip'; tip.setAttribute('role', 'tooltip'); tip.innerHTML = AVISO + '<span></span>'; tip.lastChild.textContent = tx(idioma(o)).tip; document.body.appendChild(tip);
    var r = b.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, x = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)), abajo = r.bottom + 8 + h < innerHeight || r.top < h + 16;
    tip.style.left = Math.round(x) + 'px'; tip.style.top = Math.round(abajo ? r.bottom + 8 : r.top - h - 8) + 'px'; clearTimeout(tipT); tipT = setTimeout(function () { if (tip) tip.classList.add('on'); }, 20);
  }
  function ocultarTip() { clearTimeout(tipT); if (tip) { tip.remove(); tip = null; } }

  /* una imagen del usuario, reducida para que el envío sea ligero */
  function reducir(file) {
    return new Promise(function (res) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () { try { var k = Math.min(1, 1400 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(im.naturalWidth * k)); c.height = Math.max(1, Math.round(im.naturalHeight * k)); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', .8)); } catch (e) { res(null); } URL.revokeObjectURL(u); };
      im.onerror = function () { URL.revokeObjectURL(u); res(null); }; im.src = u;
    });
  }

  function abrir(o) {
    o = o || {}; estilos(); ocultarTip(); if (document.querySelector('.avf-ov')) return;
    var L = tx(idioma(o)), imgs = [], antes = document.activeElement, ov = document.createElement('div'); ov.className = 'avf-ov';
    ov.innerHTML = '<div class="avf-win" role="dialog" aria-modal="true" aria-labelledby="avf-t"><div class="avf-hd">' + seta() + '<h2 id="avf-t"></h2></div><p class="avf-p"></p>' +
      '<label><span class="avf-ld"></span><textarea class="avf-tx" maxlength="5000"></textarea></label><label><span class="avf-lc"></span><input type="email" class="avf-em" maxlength="120" autocomplete="email" inputmode="email"></label>' +
      '<input class="avf-web" type="text" tabindex="-1" autocomplete="off" aria-hidden="true"><button type="button" class="avf-add"><span>📎</span><span class="avf-li"></span><small class="avf-lm"></small></button><input type="file" class="avf-fi" accept="image/*" multiple hidden>' +
      '<div class="avf-th"></div><div class="avf-msg" role="status" aria-live="polite"></div><div class="avf-bt"><button type="button" class="avf-no"></button><button type="button" class="avf-go"></button></div></div>';
    var q = function (c) { return ov.querySelector(c); }, msg = q('.avf-msg'), go = q('.avf-go'), no = q('.avf-no'), fi = q('.avf-fi'), th = q('.avf-th'), txa = q('.avf-tx'), em = q('.avf-em');
    q('#avf-t').textContent = L.t; q('.avf-p').textContent = L.p; q('.avf-ld').textContent = L.d; txa.placeholder = L.dp; q('.avf-lc').textContent = L.c; q('.avf-li').textContent = L.i; q('.avf-lm').textContent = '(' + L.m + ')'; go.textContent = L.e; no.textContent = L.x;
    try { em.value = localStorage.getItem('avhub:fallo:correo') || ''; } catch (e) {}
    var decir = function (t, c) { msg.textContent = t || ''; msg.className = 'avf-msg' + (c ? ' ' + c : ''); };
    var pinta = function () { th.innerHTML = ''; imgs.forEach(function (d, i) { var s = document.createElement('span'), im = document.createElement('img'), b = document.createElement('button'); im.src = d; im.alt = ''; b.type = 'button'; b.textContent = '✕'; b.setAttribute('aria-label', L.q); b.onclick = function () { imgs.splice(i, 1); pinta(); }; s.appendChild(im); s.appendChild(b); th.appendChild(s); }); q('.avf-add').disabled = imgs.length >= 3; };
    var cerrar = function () { document.removeEventListener('keydown', tecla, true); ov.remove(); try { if (antes && antes.focus) antes.focus(); } catch (e) {} };
    var tecla = function (e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cerrar(); } else if (!/^(Tab|Shift)$/.test(e.key)) e.stopPropagation(); };   // lo que se escribe aquí no dispara los atajos de la app
    document.addEventListener('keydown', tecla, true);
    txa.oninput = em.oninput = function () { if (msg.classList.contains('ko')) decir(''); };
    q('.avf-add').onclick = function () { fi.click(); };
    fi.onchange = function () { var fs = [].slice.call(fi.files || [], 0, 3 - imgs.length); fi.value = ''; Promise.all(fs.map(reducir)).then(function (ds) { ds.forEach(function (d) { if (d && imgs.length < 3) imgs.push(d); }); pinta(); }); };
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) cerrar(); }); no.onclick = cerrar;
    go.onclick = function () {
      var texto = txa.value.trim(), correo = em.value.trim();
      if (texto.length < 5) { decir(L.f, 'ko'); txa.focus(); return; }
      if (correo && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) { decir(L.cm, 'ko'); em.focus(); return; }
      try { if (correo) localStorage.setItem('avhub:fallo:correo', correo); } catch (e) {}
      go.disabled = true; decir(L.s);
      var datos = { accion: 'fallo', app: o.app || document.title || 'AVHUB', version: (typeof o.version === 'function' ? o.version() : o.version) || '', idioma: idioma(o), correo: correo, texto: texto, web: q('.avf-web').value, url: location.href.split('#')[0].slice(0, 300), pantalla: innerWidth + '×' + innerHeight + ' @' + (window.devicePixelRatio || 1), equipo: navigator.userAgent, imagenes: imgs };
      fetch(URL_ADMIN, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(datos) }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.ok) throw new Error((j && j.error) || 'respuesta');
        decir(L.ok, 'ok'); go.remove(); no.textContent = L.cl; txa.disabled = em.disabled = true; q('.avf-add').disabled = true; no.focus();
      }).catch(function () { go.disabled = false; decir(L.ko, 'ko'); });
    };
    document.body.appendChild(ov); setTimeout(function () { try { txa.focus(); } catch (e) {} }, 60);
  }

  function boton(o) {
    o = o || {}; estilos(); var b = document.createElement('button'); b.type = 'button'; b.className = 'avf-btn' + (o.clase ? ' ' + o.clase : ''); b.innerHTML = seta();
    var nombre = function () { b.setAttribute('aria-label', tx(idioma(o)).nom); }; nombre();
    b.addEventListener('mouseenter', function () { verTip(b, o); }); b.addEventListener('mouseleave', ocultarTip); b.addEventListener('focus', function () { nombre(); try { if (b.matches(':focus-visible')) verTip(b, o); } catch (e) {} }); b.addEventListener('blur', ocultarTip);
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); abrir(o); });
    return b;
  }
  window.AVFALLO = { boton: boton, abrir: abrir, seta: seta };
})();
