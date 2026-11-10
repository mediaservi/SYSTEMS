/* AVHUB · línea de crédito común a todas las apps (SCREENS, SYSTEMS, ADPOSTER, VJSHOW y MSGAME).
   El texto se edita en AVHUB ADMIN → Ajustes y cada app lo recoge al abrirse; mientras no llega, usa el último que vio o el de fábrica.
   {APP}, {VERSION} y {AÑO} los pone cada app · * es el icono · [texto](https://…) es un enlace.
   Licencia GPL-3.0 · mediaservi.com */
(function () {
  'use strict';
  var URL_ADMIN = 'https://script.google.com/macros/s/AKfycbwkc12y4LODbFe-kQidnR2MbbA6cbW1WbhU3UiqmDmshx-ncAdGYrFRy8PNjm9Wg6Mx3w/exec?accion=credito';
  var DEF = '{APP} {VERSION} {AÑO} es un proyecto hecho con * by [mediaservi.com](https://mediaservi.com/)', CLAVE = 'avhub:credito';
  var HECHO = { es: 'es un proyecto hecho con', en: 'is a project made with', ca: 'és un projecte fet amb', gl: 'é un proxecto feito con', eu: '-(e)k egindako proiektua da, honekin:', pt: 'é um projeto feito com' };
  /* icono «settings_heart» de Material Symbols (Apache-2.0), a la altura del texto y de su mismo color */
  var ICONO = '<svg class="cred-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="display:inline-block;width:1.15em;height:1.15em;vertical-align:-.22em;fill:currentColor"><path d="M12.05,16l3.5-3.5q0.43-0.43 0.55-1.04t-0.13-1.19T15.23,9.35T14.1,9T12.98,9.39T12.05,10.2Q11.6,9.77 11.11,9.39T10,9T8.86,9.34T8.1,10.25T7.99,11.44T8.55,12.5l3.5,3.5Zm-2.8,6l-0.4-3.2q-0.32-0.13-0.61-0.3T7.68,18.13L4.7,19.38L1.95,14.63l2.58-1.95Q4.5,12.5 4.5,12.34q0-0.16 0-0.34t0-0.34t0.03-0.34L1.95,9.38L4.7,4.63L7.68,5.88Q7.95,5.68 8.25,5.5t0.6-0.3L9.25,2h5.5l0.4,3.2q0.33,0.13 0.61,0.3t0.56,0.38L19.3,4.63l2.75,4.75l-2.57,1.95q0.02,0.18 0.02,0.34t0,0.34t0,0.34t-0.05,0.34l2.57,1.95l-2.75,4.75l-2.95-1.25q-0.27,0.2-0.57,0.38t-0.6,0.3L14.75,22H9.25ZM11,20h1.98l0.35-2.65q0.78-0.2 1.44-0.59t1.21-0.94l2.47,1.03l0.98-1.7l-2.15-1.63q0.13-0.35 0.17-0.74T17.5,12t-0.05-0.79q-0.05-0.39-0.17-0.74l2.15-1.63l-0.98-1.7L15.98,8.2q-0.55-0.57-1.21-0.96T13.33,6.65L13,4H11.03L10.68,6.65Q9.9,6.85 9.24,7.24T8.03,8.17L5.55,7.15L4.58,8.85l2.15,1.6Q6.6,10.83 6.55,11.2T6.5,12q0,0.4 0.05,0.77t0.17,0.75L4.58,15.15l0.98,1.7L8.03,15.8q0.55,0.58 1.21,0.96t1.44,0.59L11,20Zm1-8Z"/></svg>';
  var texto = DEF, oyentes = [];
  try { var g = localStorage.getItem(CLAVE); if (g && g.length < 400) texto = g; } catch (e) {}
  var esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  /* html(app, version, idioma, opciones): la línea ya montada. opciones.sinEnlaces deja los enlaces en texto (pantallas, PDF) */
  function html(app, version, idioma, o) {
    var l = String(idioma || 'es').slice(0, 2).toLowerCase(), t = texto;
    if (l !== 'es' && HECHO[l]) t = t.replace(HECHO.es, HECHO[l]);
    t = esc(t).replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, o && o.sinEnlaces ? '$1' : '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return t.replace(/\{APP\}/g, esc(app || '')).replace(/\{VERSION\}/g, esc(version || '')).replace(/\{A(Ñ|N)O\}|\{YEAR\}/g, new Date().getFullYear()).replace(/\*|\{ICONO\}/g, ICONO).replace(/\s{2,}/g, ' ');
  }
  /* plano(app, version, idioma): [antes del icono, después del icono], sin etiquetas (para pies de impresión) */
  function plano(app, version, idioma) {
    var d = document.createElement('div'); d.innerHTML = html(app, version, idioma, { sinEnlaces: true }).replace(ICONO, '\u0001'); var p = (d.textContent || '').split('\u0001'); return [p[0] || '', p.slice(1).join(' ')];
  }
  try {
    fetch(URL_ADMIN, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
      var t = j && typeof j.texto === 'string' ? j.texto.replace(/[\r\n]+/g, ' ').trim() : ''; if (!t || t.length > 300 || t === texto) return;
      texto = t; try { localStorage.setItem(CLAVE, t); } catch (e) {} oyentes.forEach(function (f) { try { f(); } catch (e) {} });
    }).catch(function () {});
  } catch (e) {}
  window.AVCREDITO = { html: html, plano: plano, icono: ICONO, alCambiar: function (f) { oyentes.push(f); }, texto: function () { return texto; } };
})();
