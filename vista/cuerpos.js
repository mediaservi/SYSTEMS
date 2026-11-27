// SYSTEMS · cuerpos de display a su medida exacta (v2.9), como los cuerpos de proyector de SCREENS (screens/cuerpos.js): uno por familia,
// paramétrico, con el ancho, el alto y el fondo reales del modelo y sus marcos (comun/medidas.js, según información de los fabricantes).
// La imagen activa sale del tamaño en pulgadas y del formato; lo que sobra hasta el cuerpo es el marco de cada lado. GPL-3.0 · mediaservi.com
const FMT = { '16:9': 16 / 9, '21:9': 64 / 27, '32:9': 32 / 9, '58:9': 58 / 9 };

/* familia por referencia (para los detalles del dibujo): videowall, exterior, táctil con altavoces, tótem, alargado o monitor */
export function familia(id, M) {
  const s = String(id || '').toUpperCase();
  if (M && M[6] === 'totem') return 'totem';
  if (/^LH\d+V[HM]|VL5P|VM5R|VSM5/.test(s)) return 'videowall';
  if (/^LH\d+OH|XE4P|^LH\d+OM[ABN]?E|^LH\d+OMB/.test(s)) return 'exterior';
  if (/TR3D|TS1291(3[02]|32[0-5]|304)|QMBT|QBCT|QMCT|WAF|WMF/.test(s)) return 'tactil';
  if (/^LH37SH|BH7N|BH5F/.test(s)) return 'alargado';
  return 'monitor';
}

/* el cuerpo en metros: W × H × D, marcos (l, r, t, b) y la ventana de imagen; null si no hay medidas de ese modelo */
export function cuerpo(x, vertical) {
  const M = x && (globalThis.SC_MEDIDAS || {})[x.id]; if (!M) return null;
  let [W, H, D] = M, p = +x.pulgadas || 0, fam = familia(x.id, M);
  W /= 1000; H /= 1000; D /= 1000;
  if (fam === 'totem') {   /* tótem de suelo: la pantalla en vertical arriba, centrada, y el pie con su base */
    const r = 16 / 9, d = p * 0.0254, aw = d / Math.sqrt(r * r + 1), ah = aw * r, lado = Math.max(0.03, (W - aw) / 2);
    return { W, H, D, fam, totem: true, scr: { x: lado, y: H - lado * 1.15 - ah, w: aw, h: ah }, peso: M[3], vesa: M[4] };
  }
  const natV = H > W * 1.05;   /* modelos que son verticales de fábrica (doble cara de escaparate, espacial) */
  const r0 = FMT[M[6]] || (W / H > 1 ? Math.max(W, H) / Math.min(W, H) : 16 / 9);
  const d = p * 0.0254, cortoA = d / Math.sqrt(r0 * r0 + 1), largoA = cortoA * r0;
  let aw = natV ? cortoA : largoA, ah = natV ? largoA : cortoA;
  if (!p || aw > W || ah > H) { const k = Math.min(W / aw, H / ah) * 0.985; aw *= k; ah *= k; }   /* pulgadas comerciales mayores que el cuerpo: se encaja */
  const b = M[5] || [], exH = Math.max(0.0008, W - aw), exV = Math.max(0.0008, H - ah);
  let l = exH / 2, rr = exH / 2, t = exV / 2, bb = exV / 2;
  /* marco inferior más ancho (barra de altavoces o «barbilla»): la ficha lo da como el último valor, claramente mayor */
  if (b.length === 4 && b[3] > b[0] * 1.4) { t = Math.min(exV * 0.45, b[0] / 1000 + (exV - (b[0] + b[3]) / 1000) / 2); bb = exV - t; }
  let o = { W, H, D, fam, l, r: rr, t, b: bb, peso: M[3], vesa: M[4] };
  if (vertical && !natV) o = { W: H, H: W, D, fam, l: bb, r: t, t: l, b: rr, peso: M[3], vesa: M[4], girado: true };
  o.scr = { x: o.l, y: o.b, w: o.W - o.l - o.r, h: o.H - o.t - o.b };
  return o;
}

/* el cuerpo dibujado en SVG (vista frontal a escala): X, Y pasan de metros a píxeles; x0, y0 = esquina inferior izquierda del cuerpo (m) */
export function frenteSVG(c, X, Y, k, x0, y0) {
  const bx = X(x0), by = Y(y0 + c.H), bw = c.W * k, bh = c.H * k, rx = Math.min(c.fam === 'videowall' ? 1 : 5, bw / 40);
  const col = c.fam === 'exterior' ? '#26282d' : '#0d0e11';
  let g = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${rx}" fill="${col}" stroke="#3a3c43" stroke-width="1"/>`;
  g += `<rect x="${bx + 1.2}" y="${by + 1.2}" width="${Math.max(0, bw - 2.4)}" height="${Math.max(0, bh - 2.4)}" rx="${Math.max(0, rx - 1)}" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="1"/>`;
  if (c.totem) {   /* tótem: pie con un zócalo algo más oscuro y la base en el suelo */
    const zh = Math.min(0.09, c.H * 0.05) * k; g += `<rect x="${bx}" y="${Y(y0) - zh}" width="${bw}" height="${zh}" fill="#060608"/>`;
    g += `<rect x="${bx + bw * .08}" y="${Y(y0) - zh - 0.06 * k}" width="${bw * .84}" height="${Math.max(1, 0.004 * k)}" fill="#fff" fill-opacity=".08"/>`;
  }
  if (c.fam === 'tactil' && c.b * k > 6) {   /* barra frontal de altavoces del táctil */
    const yb = Y(y0 + c.b / 2); for (const s of [-1, 1]) { const cx = bx + bw / 2 + s * bw * .3; for (let i = -6; i <= 6; i++) g += `<circle cx="${cx + i * Math.max(1.6, c.b * k * .16)}" cy="${yb}" r="${Math.max(.6, c.b * k * .05)}" fill="#2b2d33"/>`; }
    g += `<circle cx="${bx + bw / 2}" cy="${yb}" r="${Math.max(1, c.b * k * .09)}" fill="#3b82f6" fill-opacity=".55"/>`;
  }
  if (c.fam === 'exterior') { const e = Math.min(c.l, c.t) * k * .45; if (e > 2) [[bx + e, by + e], [bx + bw - e, by + e], [bx + e, by + bh - e], [bx + bw - e, by + bh - e]].forEach(([cx, cy]) => { g += `<circle cx="${cx}" cy="${cy}" r="${Math.max(.8, e * .28)}" fill="#3a3d44"/>`; }); }
  return g;
}
