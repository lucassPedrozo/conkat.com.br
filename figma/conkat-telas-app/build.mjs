// Gera code.js a partir de code.template.js, embutindo os recursos do site:
// fotos (assets/*.jpg), ícones (src/lib/icons.ts), logo 2B e o padrão de fundo (public/pattern.svg).
// Rode a partir da raiz do projeto: node figma/conkat-telas-app/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');

// Fotos, já reduzidas para o tamanho em que aparecem nas telas
const photos = {};
for (const name of ['encanador', 'cozinha', 'pintura', 'marina']) {
  photos[name] = readFileSync(join(here, 'assets', `${name}.jpg`)).toString('base64');
}

// Ícones Phosphor usados nas telas
const iconsSrc = readFileSync(join(root, 'src/lib/icons.ts'), 'utf8');
const wanted = ['house', 'squares-four', 'heart', 'user', 'magnifying-glass', 'map-pin', 'whatsapp-logo', 'seal-check', 'caret-down', 'check', 'star-fill'];
const icons = {};
for (const name of wanted) {
  const m = iconsSrc.match(new RegExp(`"${name}":\\s*("(?:[^"\\\\]|\\\\.)*")`));
  if (!m) throw new Error(`Ícone não encontrado: ${name}`);
  icons[name] = JSON.parse(m[1]);
}

// Logo 2B em contornos (a mesma do script do site)
const siteScript = readFileSync(join(here, '..', 'conkat-site-plugin', 'code.js'), 'utf8');
const logoMatch = siteScript.match(/const LOGO_2B = ("(?:[^"\\]|\\.)*");/);
if (!logoMatch) throw new Error('Logo 2B não encontrada em conkat-site-plugin/code.js');
const logo = JSON.parse(logoMatch[1]);

// Padrão de fundo: o site usa <pattern>, que o Figma não importa; aqui vira o desenho de um ladrilho
const patternSrc = readFileSync(join(root, 'public/pattern.svg'), 'utf8');
const inner = patternSrc.match(/<pattern[^>]*>([\s\S]*)<\/pattern>/);
if (!inner) throw new Error('Não achei o <pattern> em public/pattern.svg');
const pattern = `<svg xmlns="http://www.w3.org/2000/svg" width="1176" height="1176" viewBox="0 0 1176 1176">${inner[1]}</svg>`;

const template = readFileSync(join(here, 'code.template.js'), 'utf8');
const marker = '/*__ASSETS__*/ null';
if (!template.includes(marker)) throw new Error('Marcador de recursos não encontrado no template');
const out = template.replace(marker, JSON.stringify({ photos, icons, logo, pattern }));
writeFileSync(join(here, 'code.js'), out);
console.log(`code.js gerado: ${(out.length / 1024).toFixed(0)} KB`);
