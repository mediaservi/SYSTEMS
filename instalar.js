/* AVHUB · botón «Instalar», común a todas las apps (AVHUB, SCREENS, SYSTEMS, ADPOSTER, VJSHOW y MSGAME).
   Instala la web como una app en el móvil, la tableta, el ordenador o la tele y la deja lista para usarse sin conexión:
   con internet se carga siempre lo último; sin internet, la última copia que se descargó.
   Uso: AVINSTALA.boton({ app:'SYSTEMS', idioma:()=>'es', sw:'sw.js' }) devuelve el botón listo para colocarlo en la barra.
        · sw: el service worker de la app (se registra aquí). Con sw:false la app ya registra el suyo y aquí solo se enseña el botón.
        · todo: función opcional de la app que guarda de una vez todo su contenido; si existe, la ventana ofrece «Guardar todo».
        AVINSTALA.guarda([direcciones]) pide al service worker que guarde esas direcciones para usarlas sin conexión.
   No recoge ni envía ningún dato. Licencia GPL-3.0 · mediaservi.com */
(function () {
  'use strict';
  if (window.AVINSTALA) return;
  var T = {
    es: { nom: 'Instalar', tip: 'Instala esta app en tu dispositivo y úsala también sin conexión.', t: 'Instalar {A}', ya: '{A} está instalada', p: 'Se abre como una app más, a pantalla completa, y funciona sin conexión con lo último que se descargó. Cuando hay internet, se actualiza sola.',
      b: 'Instalar ahora', man: 'Si no aparece el botón de instalar: abre el menú del navegador (o el botón Compartir) y elige «Instalar» o «Añadir a pantalla de inicio».', hecho: 'Instalada. Búscala entre tus aplicaciones.',
      ok: 'Copia sin conexión lista', prep: 'Preparando la copia sin conexión…', no: 'Este navegador no permite guardar la app para usarla sin conexión.', sin: 'Ahora mismo no hay conexión: estás usando la copia guardada.', c: 'Cerrar', arch: 'archivos', todo: 'Guardar todo para usarla sin internet' },
    en: { nom: 'Install', tip: 'Install this app on your device and use it offline too.', t: 'Install {A}', ya: '{A} is installed', p: 'It opens like any other app, full screen, and works offline with the last data it downloaded. When there is internet, it updates by itself.',
      b: 'Install now', man: 'If the install button does not show: open the browser menu (or the Share button) and choose “Install” or “Add to Home Screen”.', hecho: 'Installed. Look for it among your apps.',
      ok: 'Offline copy ready', prep: 'Preparing the offline copy…', no: 'This browser cannot store the app for offline use.', sin: 'There is no connection right now: you are using the stored copy.', c: 'Close', arch: 'files', todo: 'Save everything to use it offline' },
    ca: { nom: 'Instal·lar', tip: 'Instal·la aquesta app al teu dispositiu i fes-la servir també sense connexió.', t: 'Instal·lar {A}', ya: '{A} està instal·lada', p: 'S’obre com una app més, a pantalla completa, i funciona sense connexió amb l’últim que es va descarregar. Quan hi ha internet, s’actualitza sola.',
      b: 'Instal·la ara', man: 'Si no apareix el botó d’instal·lar: obre el menú del navegador (o el botó Compartir) i tria «Instal·lar» o «Afegir a la pantalla d’inici».', hecho: 'Instal·lada. Busca-la entre les teves aplicacions.',
      ok: 'Còpia sense connexió a punt', prep: 'Preparant la còpia sense connexió…', no: 'Aquest navegador no permet desar l’app per fer-la servir sense connexió.', sin: 'Ara mateix no hi ha connexió: estàs fent servir la còpia desada.', c: 'Tanca', arch: 'arxius', todo: 'Desa-ho tot per fer-la servir sense internet' }
  };
  var tx = function (l) { return T[String(l || 'es').slice(0, 2).toLowerCase()] || T.en; };
  var aviso = null, instalada = false, estado = 'prep', guardados = 0, botones = [], dlg = null, opc = null, pendientes = [], regOk = null;
  var enApp = function () { try { if (aviso) return false; return instalada || window.matchMedia('(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)').matches && !document.fullscreenElement || navigator.standalone === true; } catch (e) { return false; } };
  var puedeSW = 'serviceWorker' in navigator && (location.protocol === 'https:' || /^(localhost|127\.)/.test(location.hostname));

  /* el dibujo: una flecha que baja a una bandeja, sobre una tecla oscura; un piloto verde cuando la copia sin conexión está lista */
  var ICO = '<svg class="avi-ico" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><rect x="3" y="8" width="42" height="37" rx="8" fill="#0c0c0e"/><rect x="3" y="4" width="42" height="36" rx="8" fill="#3a3a40"/><rect x="3" y="4" width="42" height="36" rx="8" fill="none" stroke="#6a6a72" stroke-width="1.2"/>' +
    '<g class="avi-fl" fill="none" stroke="#ffb000" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M24 10v15M17 19l7 7 7-7"/><path d="M13 27v4.5a2.5 2.5 0 0 0 2.5 2.5h17a2.5 2.5 0 0 0 2.5-2.5V27"/></g><circle class="avi-led" cx="38.5" cy="10.5" r="3.2" fill="#2a2a2e"/></svg>';
  var CSS = '.avi-btn{position:relative;flex:none;display:inline-grid;place-items:center;width:var(--avi,2.1rem);height:var(--avi,2.1rem);padding:0;margin:0;border:0;border-radius:22%;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent;line-height:0}' +
    '.avi-btn .avi-ico{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 1px 1px rgba(0,0,0,.5))}.avi-btn .avi-fl{transition:transform .1s}.avi-btn:active .avi-fl{transform:translateY(1.5px)}' +
    '.avi-btn:hover .avi-ico,.avi-btn:focus-visible .avi-ico,.avi-btn.tv-focused .avi-ico{filter:drop-shadow(0 1px 1px rgba(0,0,0,.5)) drop-shadow(0 0 5px rgba(255,176,0,.9))}.avi-btn:focus-visible{outline:2px solid #ffb000;outline-offset:2px}' +
    '.avi-btn.avi-ok .avi-led{fill:#00ff04;filter:drop-shadow(0 0 2px #00ff04)}.avi-btn.avi-sin .avi-led{fill:#ffb000}' +
    '.avi-ov{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:max(14px,env(safe-area-inset-top,0px)) 14px max(14px,env(safe-area-inset-bottom,0px));background:rgba(6,6,8,.8);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);font:400 15px/1.45 Inter,system-ui,Arial,sans-serif}' +
    '.avi-w{position:relative;box-sizing:border-box;width:min(460px,100%);max-height:100%;overflow-y:auto;padding:20px 20px 16px;border-radius:14px;border:1px solid #4a4a52;background:linear-gradient(180deg,#2b2b2f,#1b1b1e);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 20px 60px rgba(0,0,0,.7);color:#e9ebee;text-align:left}' +
    '.avi-hd{display:flex;align-items:center;gap:12px;margin:0 36px 10px 0}.avi-hd .avi-ico{flex:none;width:44px;height:44px}.avi-w h2{margin:0;font:800 18px/1.2 Inter,system-ui,Arial,sans-serif;color:#fff;overflow-wrap:anywhere}' +
    '.avi-w p{margin:0 0 10px}.avi-w .avi-man{color:#b9bcc4;font-size:.9em}.avi-st{display:flex;align-items:flex-start;gap:8px;margin:12px 0 0;padding:9px 11px;border-radius:9px;background:#0b0a06;box-shadow:inset 0 2px 8px #000;color:#ffb000;font:400 13px/1.35 "Share Tech Mono",ui-monospace,monospace}' +
    '.avi-st i{flex:none;width:10px;height:10px;margin-top:3px;border-radius:50%;background:#3a2a08}.avi-st.ok i{background:#00ff04;box-shadow:0 0 7px rgba(0,255,4,.8)}.avi-st.sin i{background:#ffb000;box-shadow:0 0 7px rgba(255,176,0,.8)}' +
    '.avi-go{display:block;width:100%;box-sizing:border-box;margin:4px 0 10px;min-height:46px;padding:8px 14px;border:1px solid #0a0a0b;border-radius:10px;background:linear-gradient(180deg,#ffc94d,#e09400);box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 3px 6px rgba(0,0,0,.5);color:#1a1200;font:800 16px/1.2 Inter,system-ui,Arial,sans-serif;letter-spacing:.02em;cursor:pointer}' +
    '.avi-go.avi-2{margin:0 0 4px;min-height:42px;border-color:#55555d;background:linear-gradient(180deg,#3a3a40,#26262a);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 3px 6px rgba(0,0,0,.5);color:#ffb000;font-weight:700;font-size:14.5px}.avi-go:active{transform:translateY(1px)}.avi-go:focus-visible,.avi-x:focus-visible{outline:2px solid #fff;outline-offset:2px}' +
    '.avi-x{position:absolute;right:12px;top:12px;width:34px;height:34px;border-radius:50%;border:1px solid #55555d;background:#232326;color:#fff;font:400 17px/1 Arial,sans-serif;cursor:pointer}.avi-x:hover{border-color:#ffb000;color:#ffb000}';
  function estilos() { if (document.getElementById('avi-css')) return; var s = document.createElement('style'); s.id = 'avi-css'; s.textContent = CSS; document.head.appendChild(s); }

  function rotula(b) { var o = b._avi || {}, x = tx(o.idioma ? o.idioma() : 'es'); if (b.title !== x.tip) b.title = x.tip; if (b.getAttribute('aria-label') !== x.nom) b.setAttribute('aria-label', x.nom); }
  /* ---------- service worker y copia sin conexión ---------- */
  function refresca() { botones.forEach(function (b) { rotula(b); b.classList.toggle('avi-ok', estado === 'ok' && navigator.onLine !== false); b.classList.toggle('avi-sin', navigator.onLine === false); b.hidden = false; }); if (dlg) pinta(); }
  function manda(urls) { if (!puedeSW) return; urls = (urls || []).filter(Boolean); if (!urls.length) return; if (!regOk) { pendientes = pendientes.concat(urls); return; }
    regOk.then(function (reg) { var sw = reg && (reg.active || reg.waiting || reg.installing); if (!sw) return; try { var ch = new MessageChannel(); ch.port1.onmessage = function (e) { var d = e.data || {}; if (d.t === 'fin') { guardados = d.total || d.ok || guardados; estado = 'ok'; refresca(); } }; sw.postMessage({ t: 'pre', urls: urls }, [ch.port2]); } catch (e) {} }); }
  function vistos() { var o = location.origin, l = [location.href.split('#')[0]]; try { performance.getEntriesByType('resource').forEach(function (r) { if (r.name.indexOf(o) === 0 && !/\.(mp3|mp4|webm|m4v|mov|wav|ogg)(\?|$)/i.test(r.name)) l.push(r.name); }); } catch (e) {} return l; }
  function arranca(sw) { if (!puedeSW) { estado = 'no'; refresca(); return; }
    if (sw === false) { /* la app registra su propio service worker: si esta visita empezó sin él (la primera), se le vuelve a pedir lo ya cargado para que lo guarde */
      var nuevo = !navigator.serviceWorker.controller, fin = function () { estado = 'ok'; refresca(); };
      var repasa = function () { var u = vistos(), i = 0; (function sig() { var l = u.slice(i, i += 6); if (!l.length || !navigator.serviceWorker.controller) return fin(); Promise.all(l.map(function (x) { return fetch(x).then(function () {}, function () {}); })).then(sig); })(); };
      var listo0 = function () { regOk = navigator.serviceWorker.ready; regOk.then(function () { if (!nuevo) return fin(); if (navigator.serviceWorker.controller) return repasa(); var hecho = false, ya = function () { if (hecho) return; hecho = true; repasa(); }; navigator.serviceWorker.addEventListener('controllerchange', ya); setTimeout(ya, 4000); }).catch(function () {}); };
      if (document.readyState === 'complete') setTimeout(listo0, 600); else window.addEventListener('load', function () { setTimeout(listo0, 600); }); return; }
    var listo = function () { regOk = navigator.serviceWorker.register(sw).then(function () { return navigator.serviceWorker.ready; }); regOk.then(function () { var u = vistos().concat(pendientes); pendientes = []; manda(u); setTimeout(function () { if (estado !== 'ok') { estado = 'ok'; refresca(); } }, 20000); }).catch(function () { estado = 'no'; refresca(); }); };
    if (document.readyState === 'complete') setTimeout(listo, 600); else window.addEventListener('load', function () { setTimeout(listo, 600); }); }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); aviso = e; refresca(); });
  window.addEventListener('appinstalled', function () { instalada = true; aviso = null; refresca(); });
  window.addEventListener('online', refresca); window.addEventListener('offline', refresca);

  /* ---------- la ventana ---------- */
  function pinta() { if (!dlg || !opc) return; var x = tx(opc.idioma ? opc.idioma() : 'es'), w = dlg.querySelector('.avi-w'), app = opc.app || 'AVHUB', ya = enApp(), sin = navigator.onLine === false;
    var st = estado === 'no' ? ['', x.no] : sin ? ['sin', x.sin] : estado === 'ok' ? ['ok', x.ok + (guardados ? ' · ' + guardados + ' ' + x.arch : '')] : ['', x.prep];
    w.innerHTML = '<button type="button" class="avi-x" aria-label="' + x.c + '">✕</button><div class="avi-hd">' + ICO + '<h2></h2></div><p></p>' + (ya ? '' : (aviso ? '<button type="button" class="avi-go"></button>' : '') + '<p class="avi-man"></p>') + (opc.todo && puedeSW && !sin ? '<button type="button" class="avi-go avi-2"></button>' : '') + '<div class="avi-st ' + st[0] + '" role="status"><i></i><span></span></div>';
    w.querySelector('h2').textContent = (ya ? x.ya : x.t).replace('{A}', app); w.querySelector('p').textContent = ya && dlg.dataset.hecho ? x.hecho : x.p; var go = w.querySelector('.avi-go:not(.avi-2)'); if (go) go.textContent = x.b; var g2 = w.querySelector('.avi-2'); if (g2) g2.textContent = x.todo; var man = w.querySelector('.avi-man'); if (man) man.textContent = x.man; w.querySelector('.avi-st span').textContent = st[1];
    dlg.setAttribute('aria-label', (ya ? x.ya : x.t).replace('{A}', app)); }
  var antes = null;
  function cierra() { if (!dlg) return; dlg.remove(); dlg = null; try { antes && antes.focus(); } catch (e) {} }
  function abre(o) { if (dlg) return; estilos(); opc = o; antes = document.activeElement; dlg = document.createElement('div'); dlg.className = 'avi-ov'; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.innerHTML = '<div class="avi-w"></div>'; pinta();
    ['keydown', 'keyup', 'wheel', 'touchstart', 'touchmove', 'pointerdown', 'click'].forEach(function (ev) { dlg.addEventListener(ev, function (e) {
      if (ev === 'keydown' && e.key === 'Escape') cierra();
      else if (ev === 'click') { if (e.target === dlg || e.target.closest('.avi-x')) cierra(); else if (e.target.closest('.avi-2')) { var o2 = opc; cierra(); try { o2 && o2.todo && o2.todo(); } catch (x) {} } else if (e.target.closest('.avi-go') && aviso) { var a = aviso; aviso = null; try { a.prompt(); a.userChoice.then(function (r) { if (r && r.outcome === 'accepted') { instalada = true; if (dlg) dlg.dataset.hecho = '1'; } refresca(); }, refresca); } catch (x) { refresca(); } } }
      e.stopPropagation(); }); });
    document.body.appendChild(dlg); var f = dlg.querySelector('.avi-go') || dlg.querySelector('.avi-x'); f && f.focus(); }

  function boton(o) { o = o || {}; estilos(); var x = tx(o.idioma ? o.idioma() : 'es'), b = document.createElement('button'); b.type = 'button'; b.className = 'avi-btn' + (o.clase ? ' ' + o.clase : ''); b.innerHTML = ICO; b._avi = o; b.title = x.tip; b.setAttribute('aria-label', x.nom);
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); rotula(b); abre(o); }); ['pointerenter', 'focus'].forEach(function (ev) { b.addEventListener(ev, function () { rotula(b); }); });
    botones.push(b); if (!boton.hecho) { boton.hecho = true; arranca(o.sw === undefined ? 'sw.js' : o.sw); } refresca(); return b; }
  window.AVINSTALA = { boton: boton, guarda: manda, abre: abre, instalada: enApp };
})();
