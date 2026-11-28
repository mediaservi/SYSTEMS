/*
  SCREENS · capa de software de los reproductores NovaStar (Taurus TB/TU, TCC…): VNNOX y ViPlex.
  Cuando el proyecto lleva un reproductor NovaStar, en pantalla y en el PDF sale el aviso con la recomendación
  de usar sus aplicaciones oficiales, un resumen de lo que permiten (control y gestión de contenido) y,
  al pulsar en su logotipo, la página oficial de cada una. Textos según la información oficial de NovaStar
  (en.vnnox.com y manuales de ViPlex). Expone globalThis.SC_SOFT. Licencia GPL-3.0 · mediaservi.com
*/
const BASE = new URL('./img/soft/', import.meta.url).href;
const APPS = [
  { id: 'vnnox', nombre: 'VNNOX', url: 'https://en.vnnox.com/', logo: BASE + 'vnnox.png', ancho: true,
    txt: {
      es: 'En la nube, desde cualquier dispositivo con internet: publica y programa contenidos a distancia en una o varias pantallas, supervisa y controla los equipos, con permisos por usuario y registros e informes de reproducción.',
      en: 'In the cloud, from any device with internet access: publish and schedule content remotely on one or many screens, monitor and control the devices, with per-user permissions and playback logs and reports.',
      ca: 'Al núvol, des de qualsevol dispositiu amb internet: publica i programa continguts a distància en una o diverses pantalles, supervisa i controla els equips, amb permisos per usuari i registres i informes de reproducció.' } },
  { id: 'viplex', nombre: 'ViPlex', url: 'https://en.vnnox.com/download', logo: BASE + 'viplex.png',
    txt: {
      es: 'ViPlex Express (Windows) y ViPlex Handy (Android e iOS), en la red local o por el Wi-Fi del reproductor: edita y publica contenidos, ajusta brillo, hora, fuente de vídeo, encendido y apagado y red, consulta los registros de reproducción y vincula el equipo a VNNOX.',
      en: 'ViPlex Express (Windows) and ViPlex Handy (Android and iOS), on the local network or over the player’s Wi-Fi: edit and publish content, set brightness, time, video source, power on/off and network, check playback logs and bind the device to VNNOX.',
      ca: 'ViPlex Express (Windows) i ViPlex Handy (Android i iOS), a la xarxa local o pel Wi-Fi del reproductor: edita i publica continguts, ajusta brillantor, hora, font de vídeo, encesa i apagada i xarxa, consulta els registres de reproducció i vincula l’equip a VNNOX.' } }
];
const T = {
  tit: { es: 'Control y contenido · software NovaStar', en: 'Control and content · NovaStar software', ca: 'Control i contingut · programari NovaStar' },
  aviso: { es: 'Este proyecto lleva un reproductor NovaStar ({m}): para controlarlo y gestionar sus contenidos se recomiendan sus aplicaciones oficiales, VNNOX y ViPlex.',
    en: 'This project includes a NovaStar player ({m}): its official apps, VNNOX and ViPlex, are recommended to control it and manage its content.',
    ca: 'Aquest projecte porta un reproductor NovaStar ({m}): per controlar-lo i gestionar-ne els continguts es recomanen les seves aplicacions oficials, VNNOX i ViPlex.' },
  pie: { es: 'Pulsa en cada aplicación para ver su información oficial.', en: 'Click each app to see its official information.', ca: 'Prem cada aplicació per veure’n la informació oficial.' },
  abre: { es: 'Abrir la página oficial de {n}', en: 'Open the official {n} page', ca: 'Obrir la pàgina oficial de {n}' }
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const L = (o, l) => o[l] || o.es;
/* un reproductor NovaStar (lleva la controladora dentro y se gestiona con VNNOX y ViPlex) */
function aplica(dev) { return !!(dev && dev.reproductor && /novastar/i.test(String(dev.marca || ''))); }
/* bloque para la pantalla (pdf = false) o para el PDF (pdf = true, estilos en línea y sin enlaces que dependan del tema) */
function html(dev, lang, pdf) {
  if (!aplica(dev)) return '';
  const l = ['es', 'en', 'ca'].includes(lang) ? lang : 'es', m = dev.modelo || '';
  const fila = (a) => `<a class="soft-a" href="${a.url}" target="_blank" rel="noopener" title="${esc(L(T.abre, l).replace('{n}', a.nombre))}"${pdf ? ' style="display:grid;grid-template-columns:96px 1fr;gap:9px;align-items:center;text-decoration:none;color:#222;margin-top:5px"' : ''}>`
    + `<span class="soft-l${a.ancho ? ' ancho' : ''}"${pdf ? ' style="display:flex;align-items:center;justify-content:center;height:30px;border-radius:5px;background:#14181f;padding:3px 6px"' : ''}><img src="${a.logo}" alt="${a.nombre}"${pdf ? ' style="max-height:24px;max-width:84px"' : ''}></span>`
    + `<span class="soft-t"${pdf ? ' style="font:400 9px/1.4 Inter,Arial,sans-serif;color:#333"' : ''}><b${pdf ? ' style="font-weight:800;color:#111"' : ''}>${a.nombre}</b>${pdf ? ` <span style="color:#0a6ab8">(${a.url.replace(/^https:\/\//, '').replace(/\/$/, '')})</span>` : ''} · ${esc(L(a.txt, l))}</span></a>`;   /* en el PDF, la dirección escrita (impreso no hay enlace) */
  if (pdf) return `<div class="soft" data-crudo style="border:1px solid #c9ced8;border-radius:6px;padding:6px 9px;margin-bottom:8px;background:#fff;color:#222">`
    + `<div style="font:800 8.5px/1.2 Inter,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#555;margin:0 0 3px">${esc(L(T.tit, l))}</div>`
    + `<div style="font:600 9px/1.4 Inter,Arial,sans-serif">${esc(L(T.aviso, l).replace('{m}', m))}</div>${APPS.map(fila).join('')}</div>`;
  return `<div class="soft" data-crudo data-pz="res" role="note"><div class="etq">${esc(L(T.tit, l))}</div><p class="soft-av">${esc(L(T.aviso, l).replace('{m}', m))}</p>${APPS.map(fila).join('')}<p class="soft-pie">${esc(L(T.pie, l))}</p></div>`;
}
globalThis.SC_SOFT = { aplica, html, APPS };
export { aplica, html, APPS };
