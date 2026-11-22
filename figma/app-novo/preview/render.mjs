// Renderiza code.js (Scripter) no Edge e salva PNGs: telas, quadro de padrões e componentes.
// Uso: node render.mjs <code.js> <pasta-de-saída> [filtro regex do nome]
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { launch, sleep } from '../../app-atual/captura/cdp.mjs';

const [codePath, out, filter] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await launch({ width: 1600, height: 1200, scale: 1 });
const url = pathToFileURL(resolve('preview.html')).href;
await b.go(url, 1500);
await b.eval(`Promise.all(['500 16px Unageo','600 16px Unageo','700 16px Unageo','400 16px InterV','500 16px InterV','600 16px InterV','700 16px InterV'].map((f) => document.fonts.load(f))).then(() => document.fonts.ready).then(() => true)`);
const code = readFileSync(codePath, 'utf8');
await b.send('Runtime.evaluate', { expression: code + '\n//# sourceURL=code.js', awaitPromise: false });
for (let i = 0; i < 240; i++) { const n = await b.eval('window.__notify || null'); if (n) { console.log(n); break; } await sleep(500); }
console.log('avisos:', JSON.stringify(await b.eval('window.__warnings')));
const targets = await b.eval(`(() => {
  const re = new RegExp(${JSON.stringify(filter || '')});
  const want = (n) => /^[VPA][0-9][0-9] — /.test(n) || n === 'Padrões do app' || n === 'Componentes';
  return [...document.querySelectorAll('[data-name]')].filter((el) => want(el.dataset.name) && re.test(el.dataset.name) && getComputedStyle(el).display !== 'none')
    .map((el) => { const r = el.getBoundingClientRect(); return { name: el.dataset.name, x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; });
})()`);
const seen = new Set();
for (const t of targets) {
  if (seen.has(t.name)) continue; seen.add(t.name);
  const scale = t.w > 1000 ? (+process.env.BOARD_SCALE || 0.75) : (+process.env.SCALE || 1.5);
  const { data } = await b.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: t.x, y: t.y, width: t.w, height: Math.min(t.h, 12000), scale } });
  const file = t.name.replace(/[\/:*?"<>|]/g, '-') + '.png';
  writeFileSync(join(out, file), Buffer.from(data, 'base64'));
  console.log('ok', t.name, Math.round(t.w) + 'x' + Math.round(t.h));
}
const errs = [...new Set(b.errors)];
if (errs.length) console.log('ERROS JS:', errs.slice(0, 10).join('\n'));
b.close();
