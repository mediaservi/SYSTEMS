// SYSTEMS · simulación 3D de la sala (v2.5), con la misma base que la escena de SCREENS (screens/escena.js v11.49): three.js r170 local,
// mismo render (ACES, sombras suaves, entorno de sala), misma figura humana extruida, mismas etiquetas y cotas en el suelo y la misma navegación
// (arrastrar para girar, rueda o + − para acercar, flechas para desplazarse, Inicio o 0 para volver). Cada módulo describe su sala y aquí se monta.
// GPL-3.0 · mediaservi.com
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { HUMAN_PATH } from './figura.js';

const MONO = "'Share Tech Mono', ui-monospace, monospace";
const fondoTema = () => (document.documentElement.dataset.tema === 'claro' ? 0xc9ccd2 : 0x0d0d0f);
const COL = { imagen: 0xffd600, azul: 0x00b4ff, ambar: 0xffb000, verde: 0x00ff04, violeta: 0xb566ff, persona: 0x8d8d96 };

export class Sala3D {
  constructor(lienzo) {
    this.lienzo = lienzo;
    const r = this.renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, preserveDrawingBuffer: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
    const esc = this.scene = new THREE.Scene(); esc.background = new THREE.Color(fondoTema());
    const pm = new THREE.PMREMGenerator(r); esc.environment = pm.fromScene(new RoomEnvironment(r), 0.04).texture; esc.environmentIntensity = 0.18;
    this.cam = new THREE.PerspectiveCamera(50, 1, 0.05, 400);
    this.ctrl = new OrbitControls(this.cam, lienzo); this.ctrl.maxPolarAngle = Math.PI * 0.495; this.ctrl.minDistance = 0.3; this.ctrl.maxDistance = 150;
    this.ctrl.addEventListener('change', () => this.render());
    lienzo.tabIndex = 0; this.ctrl.keyPanSpeed = 30; this.ctrl.listenToKeyEvents(lienzo);
    lienzo.addEventListener('keydown', (e) => { const k = e.key;
      if (k === '+' || k === '=' || k === '-' || k === '_') { e.preventDefault(); const tg = this.ctrl.target, v = this.cam.position.clone().sub(tg).multiplyScalar(k === '-' || k === '_' ? 1.18 : 0.85); this.cam.position.copy(tg).add(v); this.ctrl.update(); this.render(); }
      else if (k === 'Home' || k === '0') { e.preventDefault(); this.encuadra(); } else if (k.indexOf('Arrow') === 0) e.preventDefault(); });
    esc.add(new THREE.HemisphereLight(0xc9cbe0, 0x141416, 0.45));
    const sol = this.sol = new THREE.DirectionalLight(0xffffff, 0.6); sol.position.set(6, 14, 8); sol.castShadow = true; sol.shadow.mapSize.set(2048, 2048); sol.shadow.bias = -0.0004; sol.shadow.radius = 4; esc.add(sol, sol.target);
    this.grupo = new THREE.Group(); esc.add(this.grupo); this.figuraGeo = this._figura();
    this._ro = new ResizeObserver(() => this.ajustar()); this._ro.observe(lienzo.parentElement); this.ajustar();
  }
  destruir() { try { this._ro.disconnect(); } catch (e) {} try { this.ctrl.dispose(); } catch (e) {} try { this._limpiar(); } catch (e) {} try { this.renderer.dispose(); this.renderer.forceContextLoss(); } catch (e) {} }
  ajustar() { const p = this.lienzo.parentElement, w = Math.max(10, p.clientWidth), h = Math.max(10, p.clientHeight); this.renderer.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); this.render(); }
  render() { this.renderer.render(this.scene, this.cam); }
  _limpiar() { this.grupo.traverse((o) => { if (o.geometry && o.geometry !== this.figuraGeo) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); }); }); this.grupo.clear(); }
  _figura() {
    const datos = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${HUMAN_PATH}"/></svg>`), formas = [];
    datos.paths.forEach((p) => formas.push(...SVGLoader.createShapes(p)));
    const g = new THREE.ExtrudeGeometry(formas, { depth: 300, bevelEnabled: false, curveSegments: 6 }), k = 0.1 * 1.75 / 1280;
    g.translate(-3195, 0, -150); g.scale(k, k, k); g.computeVertexNormals(); return g;
  }
  _texto(txt, { tam = 64, col = '#e9e9ec', fondo = 'rgba(12,12,14,.82)', borde = '#00b4ff' } = {}) {
    const c = document.createElement('canvas'), x = c.getContext('2d'); x.font = `${tam}px ${MONO}`;
    const w = Math.ceil(x.measureText(txt).width) + tam * 0.9, h = Math.ceil(tam * 1.55); c.width = w; c.height = h;
    x.font = `${tam}px ${MONO}`; x.fillStyle = fondo; x.strokeStyle = borde; x.lineWidth = Math.max(2, tam * 0.06);
    x.beginPath(); x.roundRect(x.lineWidth, x.lineWidth, w - 2 * x.lineWidth, h - 2 * x.lineWidth, tam * 0.18); x.fill(); if (borde) x.stroke();
    x.fillStyle = col; x.textBaseline = 'middle'; x.fillText(txt, tam * 0.45, h / 2 + tam * 0.04);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true })); s.renderOrder = 10; s.userData.asp = w / h; return s;
  }
  etiqueta(txt, x, y, z, alto = 0.42, borde = '#00b4ff') { const s = this._texto(txt, { borde }); s.scale.set(alto * s.userData.asp, alto, 1); s.position.set(x, y, z); this.grupo.add(s); return s; }
  cota(a, b, txt, desp = 0.5) {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = new THREE.Vector3().subVectors(B, A).normalize(), n = new THREE.Vector3(-d.z, 0, d.x).multiplyScalar(desp);
    const P = [A, A.clone().add(n), A.clone().add(n), B.clone().add(n), B.clone().add(n), B].map((p) => p.clone().setY(0.012));
    this.grupo.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(P), new THREE.LineBasicMaterial({ color: COL.azul, transparent: true, opacity: 0.85 })));
    const m = A.clone().add(B).multiplyScalar(0.5).add(n); this.etiqueta(txt, m.x, 0.2, m.z, 0.34);
  }
  persona(x, z, rot = 0, op = 1) { const m = new THREE.Mesh(this.figuraGeo, new THREE.MeshStandardMaterial({ color: COL.persona, roughness: 0.8, transparent: op < 1, opacity: op })); m.position.set(x, 0, z); m.rotation.y = rot; m.castShadow = true; this.grupo.add(m); return m; }
  caja(w, h, d, x, y, z, color, o = {}) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? 0.5, metalness: o.metal ?? 0.2, emissive: o.emis ? color : 0x000000, emissiveIntensity: o.emis || 0, transparent: o.op != null, opacity: o.op ?? 1 })); m.position.set(x, y, z); if (o.rotY) m.rotation.y = o.rotY; m.castShadow = !o.op; m.receiveShadow = true; this.grupo.add(m); return m; }
  /* cono de cobertura o de campo de visión: vértice en «de», abierto «ang» grados, hacia «a» */
  cono(de, a, ang, color, op = 0.14) {
    const D = new THREE.Vector3(...de), A = new THREE.Vector3(...a), L = D.distanceTo(A), r = Math.tan(ang / 2 * Math.PI / 180) * L;
    const g = new THREE.ConeGeometry(r, L, 40, 1, true); g.translate(0, -L / 2, 0);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, side: THREE.DoubleSide, depthWrite: false }));
    m.position.copy(D); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), A.clone().sub(D).normalize()); this.grupo.add(m);
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(g, 30), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 })); e.position.copy(m.position); e.quaternion.copy(m.quaternion); this.grupo.add(e); return m;
  }
  /* la sala: suelo, paredes (la frontal en z = 0, el público hacia +z) y techo en rejilla */
  sala(A, F, H, o = {}) {
    this.dim = { A, F, H };
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(A + 2, F + 2), new THREE.MeshStandardMaterial({ color: 0x2a2b30, roughness: 0.9 })); suelo.rotation.x = -Math.PI / 2; suelo.position.set(0, 0, F / 2); suelo.receiveShadow = true; this.grupo.add(suelo);
    const g = new THREE.GridHelper(Math.max(A, F) + 2, Math.round(Math.max(A, F) + 2), 0x3a3b42, 0x303137); g.position.set(0, 0.004, F / 2); this.grupo.add(g);
    const pm = new THREE.MeshStandardMaterial({ color: 0x3b3d44, roughness: 0.85, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const pared = (w, h, x, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), pm); m.position.set(x, h / 2, z); m.rotation.y = ry; m.receiveShadow = true; this.grupo.add(m); };
    pared(A, H, 0, 0, 0); pared(F, H, -A / 2, F / 2, Math.PI / 2); pared(F, H, A / 2, F / 2, -Math.PI / 2);
    const t = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(A, H, F)), new THREE.LineBasicMaterial({ color: 0x6a6a75, transparent: true, opacity: 0.5 })); t.position.set(0, H / 2, F / 2); this.grupo.add(t);
    if (o.cotas !== false) { this.cota([-A / 2, 0, F + 0.1], [A / 2, 0, F + 0.1], fmt(A) + ' m', 0.6); this.cota([A / 2 + 0.1, 0, 0], [A / 2 + 0.1, 0, F], fmt(F) + ' m', 0.6); }
    this.sol.position.set(A * 0.6, H + 10, F * 0.9); this.sol.target.position.set(0, 0, F / 2);
  }
  /* una pantalla en la pared frontal (o donde se diga), con la imagen encendida */
  pantalla(w, h, x, yBajo, z, txt, o = {}) {
    this.caja(w + 0.04, h + 0.04, 0.06, x, yBajo + h / 2, z + 0.03, 0x111114, { metal: 0.6 });
    if (o.tex) {   /* v2.8 · la imagen en la pantalla (carta de ajuste o el contenido elegido); uv = trozo de la imagen para un videowall */
      const g = new THREE.PlaneGeometry(w, h), uv = o.uv || [0, 0, 1, 1], at = g.attributes.uv;
      for (let i = 0; i < at.count; i++) at.setXY(i, uv[0] + at.getX(i) * (uv[2] - uv[0]), uv[1] + at.getY(i) * (uv[3] - uv[1]));
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
      this._tex = this._tex || {}; let t = this._tex[o.tex];
      if (!t) { t = this._tex[o.tex] = new THREE.TextureLoader().load(o.tex, () => this.render()); t.colorSpace = THREE.SRGBColorSpace; }
      mat.map = t; const m = new THREE.Mesh(g, mat); m.position.set(x, yBajo + h / 2, z + 0.072); this.grupo.add(m);
    } else this.caja(w, h, 0.01, x, yBajo + h / 2, z + 0.065, COL.imagen, { emis: 0.55, rough: 0.3 });
    if (txt) this.etiqueta(txt, x, yBajo + h + 0.3, z + 0.1, 0.3, '#ffd600');
  }
  limpiar() { this._limpiar(); }
  /* encuadre inicial: desde el fondo de la sala, un poco alto, mirando a la pared frontal */
  encuadra() {
    const { A, F, H } = this.dim || { A: 8, F: 8, H: 3 }, d = Math.max(A, F);
    this.cam.position.set(A * 0.5, Math.max(H * 1.5, d * 0.42), F + d * 0.28); this.ctrl.target.set(0, H * 0.3, F * 0.42); this.ctrl.update(); this.render();
  }
}
export const fmt = (v, d = 2) => Number(v).toLocaleString(document.documentElement.lang === 'en' ? 'en-GB' : 'es-ES', { minimumFractionDigits: 0, maximumFractionDigits: d });
