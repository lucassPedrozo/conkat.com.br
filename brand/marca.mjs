// Conkat — biblioteca da marca: cores, logo 2B, símbolo C_, ícones, padrão, fontes e render.
// Usada por gerar-assets.mjs (arquivos da marca) e gerar-calendario.mjs (posts do Instagram).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

export const require = createRequire(import.meta.url);
export const { chromium } = require('playwright');

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const r = (...p) => path.join(ROOT, ...p);
export const mkdir = (d) => fs.mkdirSync(d, { recursive: true });
export const write = (f, s) => { mkdir(path.dirname(f)); fs.writeFileSync(f, s); };

// ---------------------------------------------------------------------------
// Dados da marca
// ---------------------------------------------------------------------------
export const C = {
  ink: '#0B2B2A', inkSoft: '#123B39', background: '#F8F9FA', surface: '#FFFFFF',
  text: '#1A1A1A', textMuted: '#5F6672', brand: '#0F928C', brandOnDark: '#5FD3CC',
  primary: '#0B7A75', primarySoft: '#E6F4F3', accent: '#FDA333', accentText: '#A85A00',
  accentSoft: '#FFF3E0', white: '#FFFFFF', onDarkMuted: '#A7C4C2',
};

// Logo 2B: "Con" em Ahellya itálica + "kat" em Unageo Bold + cursor laranja (em contornos).
export const LOGO_SRC = fs.readFileSync(r('brand/logo-exploracao/conkat-logo-2B.svg'), 'utf8');
export const GLYPHS = [...LOGO_SRC.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]); // C, o, n, k, a, t
export const LOGO_VB = '-4.5 -164.7 736.4 173.5';
export const LOGO_RATIO = 736.4 / 173.5;
export const CURSOR = { x: 663.02, y: -26.6, w: 62.5, h: 26.6 };

// Ícones (Phosphor, regular) e padrão de ícones: os mesmos do script do Figma.
export const PLUGIN = fs.readFileSync(r('brand/figma-brand-plugin/code.js'), 'utf8');
export const DATA = JSON.parse(PLUGIN.match(/^const DATA = (\{.*\});$/m)[1]);
export const ICONS = {
  ...DATA.icons,
  // Phosphor "Question" (regular), para a capa de Dúvidas.
  duvida: '<path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/>',
};

// ---------------------------------------------------------------------------
// Logo e símbolo
// ---------------------------------------------------------------------------
/** Logo completa. `letters` e `cursor` são cores. */
export function logoSvg({ letters = C.ink, cursor = C.accent, height } = {}) {
  const size = height ? ` width="${(height * LOGO_RATIO).toFixed(1)}" height="${height}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg"${size} viewBox="${LOGO_VB}" role="img" aria-label="Conkat">`
    + GLYPHS.map((d) => `<path d="${d}" fill="${letters}"/>`).join('')
    + `<rect x="${CURSOR.x}" y="${CURSOR.y}" width="${CURSOR.w}" height="${CURSOR.h}" fill="${cursor}"/></svg>`;
}

// Símbolo "C_": o C da logo (Ahellya itálica) + o cursor, na mesma proporção da logo.
export const SYM_BOX = { x: 2, y: -158.3, w: 202.5, h: 160 };
export const symInner = (letter, cursor) => `<path d="${GLYPHS[0]}" fill="${letter}"/><rect x="142" y="${CURSOR.y}" width="${CURSOR.w}" height="${CURSOR.h}" fill="${cursor}"/>`;

/** Símbolo dentro de um quadrado. `scale` é a largura do símbolo em relação ao quadrado. */
export function symbolSvg({ size = 512, bg = C.ink, radius = 0, scale = 0.56, letter = C.white, cursor = C.accent } = {}) {
  const s = (size * scale) / SYM_BOX.w;
  const tx = size / 2 - (SYM_BOX.x + SYM_BOX.w / 2) * s;
  const ty = size / 2 - (SYM_BOX.y + SYM_BOX.h / 2) * s;
  const bgRect = bg ? `<rect width="${size}" height="${size}" rx="${(size * radius).toFixed(2)}" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bgRect}`
    + `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(5)})">${symInner(letter, cursor)}</g></svg>`;
}

/** Símbolo sem fundo, recortado no próprio desenho. */
export function symbolBareSvg({ letter = C.ink, cursor = C.accent } = {}) {
  const pad = 4;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SYM_BOX.x - pad} ${SYM_BOX.y - pad} ${SYM_BOX.w + pad * 2} ${SYM_BOX.h + pad * 2}" role="img" aria-label="Conkat">${symInner(letter, cursor)}</svg>`;
}

export const iconSvg = (key, color, size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256" fill="${color}">${ICONS[key]}</svg>`;

/** Padrão de ícones de serviços (o mesmo do app e da imagem de compartilhamento). */
export function patternSvg(w, h, { color = C.accent, stroke = 1.3, step = 84 } = {}) {
  const B = DATA.patternBodies; let g = '';
  for (let row = 0; row * step < h + step; row++) {
    for (let col = -1; col * step < w + step; col++) {
      const x = (row % 2 ? 48 : 6) + col * step, y = 27 + row * step;
      g += `<g transform="translate(${x} ${y}) scale(1.25)">${B[(((col + row) % 14) + 14) % 14]}</g>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${g}</g></svg>`;
}

// ---------------------------------------------------------------------------
// Render (Chromium)
// ---------------------------------------------------------------------------
export const b64 = (f) => fs.readFileSync(f).toString('base64');
export const dataUrl = (f, type) => `data:${type};base64,${b64(f)}`;
export const svgUrl = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

export const FONTS = `
@font-face{font-family:Unageo;font-weight:500;src:url(${dataUrl(r('public/fonts/unageo-medium.woff2'), 'font/woff2')}) format('woff2')}
@font-face{font-family:Unageo;font-weight:600;src:url(${dataUrl(r('public/fonts/unageo-semibold.woff2'), 'font/woff2')}) format('woff2')}
@font-face{font-family:Unageo;font-weight:700;src:url(${dataUrl(r('public/fonts/unageo-bold.woff2'), 'font/woff2')}) format('woff2')}
@font-face{font-family:Inter;font-weight:100 900;src:url(${dataUrl(r('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'), 'font/woff2')}) format('woff2')}`;

export const PHOTO = (name) => dataUrl(r('src/assets/photos', name), 'image/jpeg');

export const BASE_CSS = `${FONTS}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:transparent}
.art{position:relative;overflow:hidden;font-family:Inter,sans-serif;color:${C.text};-webkit-font-smoothing:antialiased}
.display{font-family:Unageo,sans-serif;font-weight:600;letter-spacing:-0.025em;line-height:1.02}
.pattern{position:absolute;inset:0;background-repeat:no-repeat}
.cur{display:inline-block;width:.5em;height:.17em;background:${C.accent};margin-left:.06em;vertical-align:baseline}
.pill{display:inline-flex;align-items:center;gap:16px;border-radius:999px;font-weight:600}
.abs{position:absolute}
`;

let browser;
export async function launch() { browser = await chromium.launch(); return browser; }
export async function close() { await browser.close(); }
export const getBrowser = () => browser;
export async function renderHtml(html, w, h, out) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}</style></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  mkdir(path.dirname(out));
  const jpeg = /\.jpe?g$/i.test(out); // a API do Instagram só aceita JPEG
  await page.locator('.art').first().screenshot(jpeg ? { path: out, type: 'jpeg', quality: 92 } : { path: out, omitBackground: true });
  await page.close();
}
export const renderSvg = (svg, w, h, out) => renderHtml(`<div class="art" style="width:${w}px;height:${h}px"><img src="${svgUrl(svg)}" style="width:${w}px;height:${h}px;display:block"></div>`, w, h, out);

// ---------------------------------------------------------------------------
// Peças do Instagram
// ---------------------------------------------------------------------------
export const POST = { w: 1080, h: 1350 };
export const STORY = { w: 1080, h: 1920 };
export const M = 96; // margem segura: o perfil corta os posts em 3:4 nas laterais

export const art = (size, bg, inner, extra = '') => `<div class="art" style="width:${size.w}px;height:${size.h}px;background:${bg};${extra}">${inner}</div>`;
export const pattern = (size, { color = C.accent, opacity = 0.35, fade = 'to bottom left', stroke } = {}) =>
  `<div class="pattern" style="background-image:url(${svgUrl(patternSvg(size.w, size.h, { color, stroke }))});opacity:${opacity};-webkit-mask-image:linear-gradient(${fade},#000 0%,rgba(0,0,0,.35) 45%,transparent 75%)"></div>`;
export const logoImg = (h, opts) => `<img src="${svgUrl(logoSvg(opts))}" style="height:${h}px;display:block">`;
export const symImg = (h, opts) => `<img src="${svgUrl(symbolBareSvg(opts))}" style="height:${h}px;display:block">`;
export const icon = (key, color, size) => `<img src="${svgUrl(iconSvg(key, color, size))}" style="width:${size}px;height:${size}px;display:block">`;
export const counter = (txt, dark) => `<div class="abs" style="top:${M}px;right:${M}px;font:600 26px Inter;letter-spacing:.04em;color:${dark ? C.onDarkMuted : C.textMuted}">${txt}</div>`;
export const site = (dark) => `<div style="font:500 28px Inter;color:${dark ? C.onDarkMuted : C.textMuted}">conkat.com.br</div>`;
export const footer = (dark, left) => `<div class="abs" style="left:${M}px;right:${M}px;bottom:${M}px;display:flex;align-items:center;justify-content:space-between">${left}${site(dark)}</div>`;
