/* SYSTEMS · service worker: instala la app y la deja lista para usarse sin conexión.
   · La app y sus datos (páginas, .js, .css, .json): primero la red, para tener siempre lo último; sin red —o si tarda—, la última copia guardada.
   · Imágenes, tipos de letra y demás archivos: la copia guardada al instante, y se renueva por detrás.
   · Lo que no es de este sitio (avisos, crédito, directo) y los vídeos y audios a trozos van siempre por la red.
   Para forzar una copia nueva en todos los dispositivos, sube el número de CACHE.
   Licencia GPL-3.0 · mediaservi.com */
const PREFIJO = 'systems-', CACHE = PREFIJO + 'v5';
const BASICO = ['./', 'index.html', 'app.js', 'calculos.js', 'textos.js', 'base.css', 'estilo.css', 'credito.js', 'fallo.js', 'instalar.js', 'manifest.json', 'catalogo/nureva.json', 'catalogo/rcf.json', 'catalogo/sennheiser.json', 'assets/avhub-logo.svg', 'assets/fam/adposter-logo.svg', 'assets/fam/msgame-logo.svg?v=3', 'assets/fam/screens-logo.svg', 'assets/fam/vjshow-logo.svg', 'assets/favicon.svg', 'assets/fonts/inter-latin-400-normal.woff2', 'assets/fonts/inter-latin-700-normal.woff2', 'assets/fonts/inter-latin-800-normal.woff2', 'assets/fonts/share-tech-mono-latin-400-normal.woff2', 'assets/iconos/systems-192.png', 'assets/systems-icono.svg', 'assets/systems-logo.svg'];   // lo mínimo para arrancar sin conexión desde la primera visita
const FRESCO = /(\/|\.html?|\.json|\.js|\.css|\.webmanifest)$/i, TOPE = 6000;
const clave = u => { const x = new URL(u, self.registration.scope); x.search = ''; x.hash = ''; return x.href; };
const vale = r => r && r.status === 200 && r.type !== 'opaque';

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => Promise.all(BASICO.map(u => fetch(new Request(u, { cache: 'reload' })).then(r => vale(r) ? c.put(clave(u), r) : 0).catch(() => 0))))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf(PREFIJO) === 0 && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));

async function fresco(req) { const c = await caches.open(CACHE), k = clave(req.url), ya = await c.match(k);
  const red = fetch(req).then(r => { if (vale(r)) c.put(k, r.clone()).catch(() => {}); return r; });
  if (!ya) return red;                                                    // nunca se ha guardado: no queda otra que esperar a la red
  red.catch(() => {});
  return Promise.race([red, new Promise((_, no) => setTimeout(no, TOPE))]).catch(() => ya); }   // sin red o red lenta: la copia guardada
async function guardado(req) { const c = await caches.open(CACHE), ya = await c.match(req.url);
  const red = fetch(req).then(async r => { if (vale(r)) { const viejas = await c.keys(clave(req.url), { ignoreSearch: true }); await Promise.all(viejas.filter(q => q.url !== req.url && clave(q.url) === clave(req.url)).map(q => c.delete(q))); await c.put(req.url, r.clone()); } return r; });
  if (ya) { red.catch(() => {}); return ya; }
  return red.catch(async () => (await c.match(clave(req.url), { ignoreSearch: true })) || Response.error()); }

self.addEventListener('fetch', e => { const r = e.request; if (r.method !== 'GET' || r.headers.has('range')) return; const u = new URL(r.url); if (u.origin !== self.location.origin) return;
  e.respondWith(r.mode === 'navigate' || FRESCO.test(u.pathname) ? fresco(r) : guardado(r)); });

/* la página pide guardar lo que ha cargado (y lo que vaya a necesitar) para tenerlo sin conexión */
self.addEventListener('message', e => { const d = e.data || {}, puerto = e.ports && e.ports[0]; if (d.t !== 'pre' || !Array.isArray(d.urls)) return;
  e.waitUntil((async () => { const c = await caches.open(CACHE), urls = [...new Set(d.urls.filter(u => { try { return new URL(u, self.registration.scope).origin === self.location.origin; } catch (x) { return false; } }).map(u => new URL(u, self.registration.scope).href))]; let ok = 0;
    const una = async u => { const f = FRESCO.test(new URL(u).pathname), k = f ? clave(u) : u; try { if (await c.match(k)) { ok++; return; } const r = await fetch(u, { cache: 'no-cache' }); if (vale(r)) { await c.put(k, r); ok++; } } catch (x) {} };
    for (let i = 0; i < urls.length; i += 6) await Promise.all(urls.slice(i, i + 6).map(una));
    if (puerto) puerto.postMessage({ t: 'fin', ok, total: (await c.keys()).length }); })()); });
