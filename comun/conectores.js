/* Conectores de entrada (común a SCREENS y SYSTEMS, copiado de SCREENS v11.71): 20 tipos con su forma, color por generación
   (1080p · 4K30 · 4K60 · 8K · IP) y su resolución máxima. [id, nombre, familia del motor, generación, forma, resolución máxima].
   Dibujos propios. GPL-3.0 · mediaservi.com */
(function () {
var GEN = { k1: ['1080p', '#9fb3c8'], k430: ['4K30', '#f0b429'], k460: ['4K60', '#d4ff00'], k8: ['8K', '#ff5ccf'], ip: ['IP', '#37c8ff'] };
var CONN = [
  ['hdmi13', 'HDMI 1.3', 'HDMI', 'k1', 'hdmi', '1920×1200 @60'], ['hdmi14', 'HDMI 1.4', 'HDMI', 'k430', 'hdmi', '3840×2160 @30'], ['hdmi20', 'HDMI 2.0', 'HDMI', 'k460', 'hdmi', '4096×2160 @60'], ['hdmi21', 'HDMI 2.1', 'HDMI', 'k8', 'hdmi', '7680×4320 @60'],
  ['dp11', 'DP 1.1', 'DP', 'k1', 'dp', '2560×1600 @60'], ['dp12', 'DP 1.2', 'DP', 'k460', 'dp', '4096×2160 @60'], ['dp14', 'DP 1.4', 'DP', 'k8', 'dp', '7680×4320 @60'],
  ['dvi', 'DVI', 'HDMI', 'k1', 'dvi', '1920×1200 @60 · DL 2560×1600'], ['vga', 'VGA', 'ANA', 'k1', 'vga', '1920×1200 @60'], ['cvbs', 'CVBS', 'ANA', 'k1', 'rca', '720×576i'],
  ['sdi3g', '3G-SDI', 'SDI', 'k1', 'bnc', '1920×1080 @60'], ['sdi6g', '6G-SDI', 'SDI', 'k430', 'bnc', '3840×2160 @30'], ['sdi12g', '12G-SDI', 'SDI', 'k460', 'bnc', '4096×2160 @60'],
  ['hdbt2k', 'HDBaseT 2K60', 'HDMI', 'k1', 'rj45', '1920×1080 @60 · 100 m'], ['hdbt4k', 'HDBaseT 4K30', 'HDMI', 'k430', 'rj45', '3840×2160 @30 · 100 m'],
  ['ndi', 'NDI', 'IP', 'ip', 'rj45', '3840×2160 @60 · LAN'], ['rj45', 'RJ45 IP', 'IP', 'ip', 'rj45', 'streaming · LAN'], ['st2110', 'ST 2110 25G', 'IP', 'ip', 'sfp', '3840×2160 @60 · 25 GbE'],
  ['fibra', 'Fibra', 'FIB', 'k460', 'lc', '4096×2160 @60 · 300 m MM / 10 km SM'], ['usb', 'USB', 'USB', 'k460', 'usb', '3840×2160 @60']];
var CONN_ID = Object.fromEntries(CONN.map((c) => [c[0], c]));
var CONN_SVG = { hdmi: '<path d="M4 6h32v7l-5 6H9l-5-6z"/><path d="M9 10h22"/>', dp: '<path d="M4 6h32v13H10l-6-6z"/><path d="M10 10h21"/>', dvi: '<path d="M2 6h36l-2 13H4z"/><path d="M8 10h14M8 13h14M8 16h14M28 12h6" stroke-dasharray="1.5 1.6"/>',
  vga: '<path d="M3 6h34l-4 13H7z"/><path d="M9 10h22M11 13h18M13 16h14" stroke-dasharray="1.4 2.6"/>', rca: '<circle cx="20" cy="12.5" r="8"/><circle cx="20" cy="12.5" r="2.4"/>', bnc: '<circle cx="20" cy="12.5" r="8.5"/><circle cx="20" cy="12.5" r="4"/><circle cx="20" cy="12.5" r="1"/><path d="M10 12.5H7M30 12.5h3"/>',
  rj45: '<path d="M10 5h20v12h-5v3h-10v-3h-5z"/><path d="M14 8v4M17 8v4M20 8v4M23 8v4M26 8v4"/>', sfp: '<rect x="5" y="7" width="30" height="11" rx="1.5"/><path d="M9 11h13M9 14h13M27 9v7"/>', lc: '<rect x="7" y="6" width="11" height="13" rx="2"/><rect x="22" y="6" width="11" height="13" rx="2"/><circle cx="12.5" cy="12.5" r="1.8"/><circle cx="27.5" cy="12.5" r="1.8"/>',
  usb: '<rect x="5" y="7" width="30" height="11" rx="1.5"/><rect x="10" y="10" width="20" height="4"/>' };
  globalThis.SC_CONN = { GEN: GEN, CONN: CONN, CONN_ID: CONN_ID, CONN_SVG: CONN_SVG };
})();
