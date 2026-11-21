// Gera code.js a partir de code.template.js, embutindo fotos, ícones Phosphor (os mesmos do app),
// a logo 2B e o padrão de fundo do site.
// Uso (da raiz do projeto): node figma/app-novo/build.mjs [caminho do conkat.app]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const appDir = process.argv[2] || join(root, '..', 'conkat.app');
const defs = join(appDir, 'node_modules', 'phosphor-react-native', 'src', 'defs');
if (!existsSync(defs)) throw new Error('Não achei os ícones Phosphor em ' + defs + '. Informe o caminho do conkat.app.');

const photos = {};
for (const name of ['encanador', 'encanador-wide', 'cozinha', 'pintura', 'marina', 'eletricista', 'eletricista-wide']) {
  photos[name] = readFileSync(join(here, 'assets', `${name}.jpg`)).toString('base64');
}

// Nome no script -> [arquivo Phosphor, peso]
const ICONS = {
  house: ['House', 'regular'], 'house-fill': ['House', 'fill'], squares: ['SquaresFour', 'regular'], 'squares-fill': ['SquaresFour', 'fill'],
  heart: ['Heart', 'regular'], 'heart-fill': ['Heart', 'fill'], user: ['User', 'regular'], 'user-fill': ['User', 'fill'],
  storefront: ['Storefront', 'regular'], 'storefront-fill': ['Storefront', 'fill'],
  search: ['MagnifyingGlass', 'regular'], pin: ['MapPin', 'regular'], 'caret-down': ['CaretDown', 'regular'], 'caret-right': ['CaretRight', 'regular'],
  check: ['Check', 'bold'], x: ['X', 'regular'], back: ['ArrowLeft', 'regular'], filters: ['SlidersHorizontal', 'regular'], sort: ['ArrowsDownUp', 'regular'],
  crosshair: ['Crosshair', 'regular'], star: ['Star', 'fill'], 'star-outline': ['Star', 'regular'], seal: ['SealCheck', 'fill'], whatsapp: ['WhatsappLogo', 'regular'],
  phone: ['Phone', 'regular'], dots: ['DotsThree', 'bold'], plus: ['Plus', 'bold'], wallet: ['Wallet', 'regular'], chart: ['ChartLine', 'regular'],
  rocket: ['RocketLaunch', 'regular'], 'rocket-fill': ['RocketLaunch', 'fill'], pause: ['Pause', 'regular'], trash: ['Trash', 'regular'], pencil: ['PencilSimple', 'regular'],
  eye: ['Eye', 'regular'], lock: ['Lock', 'regular'], mail: ['EnvelopeSimple', 'regular'], signout: ['SignOut', 'regular'], camera: ['Camera', 'regular'],
  clock: ['Clock', 'regular'], 'check-circle': ['CheckCircle', 'fill'], warning: ['Warning', 'regular'], 'trend-up': ['TrendUp', 'regular'], 'trend-down': ['TrendDown', 'regular'],
  receipt: ['Receipt', 'regular'], info: ['Info', 'regular'], shield: ['ShieldCheck', 'regular'], megaphone: ['Megaphone', 'regular'], 'id-card': ['IdentificationCard', 'regular'],
  checkbox: ['CheckSquare', 'fill'], square: ['Square', 'regular'], radio: ['Circle', 'regular'], 'radio-on': ['RadioButton', 'fill'], copy: ['Copy', 'regular'],
  // Categorias (o mesmo mapa do app, components/categoryIcons.ts)
  wrench: ['Wrench', 'regular'], car: ['Car', 'regular'], lightning: ['Lightning', 'regular'], drop: ['Drop', 'regular'], broom: ['Broom', 'regular'],
  hammer: ['Hammer', 'regular'], paint: ['PaintBrush', 'regular'], plant: ['Plant', 'regular'], scissors: ['Scissors', 'regular'], heartbeat: ['Heartbeat', 'regular'],
  graduation: ['GraduationCap', 'regular'], laptop: ['Laptop', 'regular'], truck: ['Truck', 'regular'], calendar: ['Calendar', 'regular'], fork: ['ForkKnife', 'regular'],
  paw: ['PawPrint', 'regular'], barbell: ['Barbell', 'regular'], scales: ['Scales', 'regular'], dollar: ['CurrencyDollar', 'regular'],
};
const icons = {};
for (const [key, [file, weight]] of Object.entries(ICONS)) {
  const src = readFileSync(join(defs, `${file}.tsx`), 'utf8');
  const start = src.indexOf(`'${weight}',`);
  if (start < 0) throw new Error(`Peso ${weight} não encontrado em ${file}`);
  const end = src.indexOf('],', start);
  const block = src.slice(start, end);
  const paths = [...block.matchAll(/<Path\s+d="([^"]+)"/g)].map((m) => m[1]);
  if (!paths.length) throw new Error(`Sem <Path> em ${file} (${weight})`);
  if (/<(Circle|Rect|Line|Polyline|Polygon|Ellipse)\b/.test(block)) throw new Error(`${file} (${weight}) usa formas além de Path`);
  icons[key] = paths.map((d) => `<path d="${d}"/>`).join('');
}

const siteScript = readFileSync(join(here, '..', 'conkat-site-plugin', 'code.js'), 'utf8');
const logo = JSON.parse(siteScript.match(/const LOGO_2B = ("(?:[^"\\]|\\.)*");/)[1]);
const patternSrc = readFileSync(join(root, 'public/pattern.svg'), 'utf8');
const pattern = `<svg xmlns="http://www.w3.org/2000/svg" width="1176" height="1176" viewBox="0 0 1176 1176">${patternSrc.match(/<pattern[^>]*>([\s\S]*)<\/pattern>/)[1]}</svg>`;

const template = readFileSync(join(here, 'code.template.js'), 'utf8');
const marker = '/*__ASSETS__*/ null';
if (!template.includes(marker)) throw new Error('Marcador de recursos não encontrado');
const out = template.replace(marker, JSON.stringify({ photos, icons, logo, pattern }));
writeFileSync(join(here, 'code.js'), out);
console.log(`code.js gerado: ${(out.length / 1024).toFixed(0)} KB, ${Object.keys(icons).length} ícones`);
