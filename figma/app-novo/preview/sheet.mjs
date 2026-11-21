// Junta PNGs de telas numa folha (lado a lado, alinhadas pelo topo).
// Uso: node sheet.mjs <pasta> <saída.png> <regex de nome> [largura de cada tela]
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const [dir, outFile, filter, tw0] = process.argv.slice(2);
const tw = +(tw0 || 300);
const files = readdirSync(dir).filter((f) => f.endsWith('.png') && new RegExp(filter).test(f)).sort();
const imgs = [];
for (const f of files) { const buf = await sharp(`${dir}/${f}`).resize({ width: tw }).png().toBuffer(); const m = await sharp(buf).metadata(); imgs.push({ f, buf, h: m.height }); }
const gap = 16, lab = 26;
const H = Math.max(...imgs.map((i) => i.h)) + lab;
const W = imgs.length * (tw + gap);
const comps = [];
imgs.forEach((im, i) => {
  comps.push({ input: im.buf, left: i * (tw + gap), top: lab });
  comps.push({ input: Buffer.from(`<svg width="${tw}" height="${lab}"><text x="2" y="18" font-size="15" font-family="Arial" font-weight="bold">${im.f.replace('.png', '').slice(0, 34).replace(/&/g, '&amp;')}</text></svg>`), left: i * (tw + gap), top: 0 });
});
await sharp({ create: { width: W, height: H, channels: 3, background: '#bbb' } }).composite(comps).png().toFile(outFile);
console.log(files.length, 'telas', W + 'x' + H);
