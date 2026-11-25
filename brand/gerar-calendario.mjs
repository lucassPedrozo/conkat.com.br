// Conkat — gera os posts do Instagram dos próximos dias, a partir da pauta em
// brand/instagram/calendario.mjs.
//
//   node brand/gerar-calendario.mjs                     # 15 dias a partir de amanhã
//   node brand/gerar-calendario.mjs --inicio 2026-11-23 --dias 15
//
// Para cada dia cria brand/instagram/calendario/AAAA-MM-DD-slug/ com:
//   01.jpg, 02.jpg…  slides do post (1080 × 1350); carrossel quando há mais de um
//   story.jpg        story (1080 × 1920) avisando do post novo
//   legenda.txt      legenda com hashtags, pronta para colar
// E também calendario/README.md (a agenda) e calendario/previa.png (todos os posts lado a lado).
//
// Os posts usam as telas reais do app, recortadas do site (dist/). Se o site ainda não foi
// gerado, o script roda `npm run build` antes. As telas ficam em brand/instagram/telas-app/.

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execSync } from 'node:child_process';
import {
  C, M, POST, STORY, PHOTO, BASE_CSS, r, mkdir, write, dataUrl, svgUrl,
  art, pattern, logoImg, symImg, icon, launch, close, getBrowser, renderHtml,
} from './marca.mjs';
import { POSTS, HORARIOS } from './instagram/calendario.mjs';

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------
const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : def; };
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };
const INICIO = arg('inicio', tomorrow());
const DIAS = Math.min(+arg('dias', 15), POSTS.length);
if (!/^\d{4}-\d{2}-\d{2}$/.test(INICIO)) throw new Error('--inicio deve ser AAAA-MM-DD');
if (+arg('dias', 15) > POSTS.length) console.warn(`A pauta tem ${POSTS.length} posts: gerando ${DIAS} dias.`);

const OUT = r('brand/instagram/calendario');
const TELAS = r('brand/instagram/telas-app');
const SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const dayOf = (i) => { const d = new Date(INICIO + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + i); return d; };
const iso = (d) => d.toISOString().slice(0, 10);
const br = (d) => `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

// ---------------------------------------------------------------------------
// Telas do app, recortadas do site
// ---------------------------------------------------------------------------
async function captureAppScreens() {
  const dist = r('dist');
  if (!fs.existsSync(path.join(dist, 'index.html'))) { console.log('Gerando o site (npm run build)…'); execSync('npm run build', { cwd: r(), stdio: 'inherit' }); }
  const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };
  const server = http.createServer((q, res) => {
    let f = path.join(dist, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(dist)) { res.writeHead(403); return res.end(); }
    if (f.endsWith(path.sep)) f = path.join(f, 'index.html');
    fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); res.end(d); });
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const page = await getBrowser().newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle' });
  // Isola cada peça numa camada própria, sem o resto da página atrás.
  await page.addStyleTag({ content: `*{animation:none!important;transition:none!important}
    html,body{background:transparent!important}
    body>*:not(#cap){visibility:hidden!important}
    #cap{position:fixed;left:0;top:0;z-index:2147483647;padding:40px;visibility:visible}
    #cap .phone{--pw:300px!important;transform:none!important;opacity:1!important;position:relative!important;inset:auto!important;margin:0!important}
    #cap .stagger,#cap .lc{opacity:1!important;transform:none!important}` });
  const isolate = (sel, idx, prep) => page.evaluate(({ sel, idx, prep }) => {
    document.getElementById('cap')?.remove();
    const src = document.querySelectorAll(sel)[idx]; const el = src.cloneNode(true);
    el.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; i.removeAttribute('loading'); });
    const cap = document.createElement('div'); cap.id = 'cap'; cap.appendChild(el); document.body.appendChild(cap);
    if (prep === 'width') { el.style.width = src.getBoundingClientRect().width + 'px'; el.style.fontSize = getComputedStyle(src).fontSize; }
    if (typeof prep === 'number') el.querySelectorAll('.screen').forEach((s, k) => s.classList.toggle('is-active', k === prep));
    return Promise.all([...el.querySelectorAll('img')].map((i) => i.complete ? 0 : new Promise((ok) => { i.onload = i.onerror = ok; })));
  }, { sel, idx, prep });
  const shot = async (name) => { await page.waitForTimeout(150); await page.locator('#cap > *').screenshot({ path: path.join(TELAS, name + '.png'), omitBackground: true }); };
  mkdir(TELAS);
  await isolate('.phone-front', 0); await shot('home');
  for (const [k, name] of [[0, 'cidade'], [1, 'busca'], [2, 'anuncio']]) { await isolate('.how-phone', 0, k); await shot(name); }
  // Cards de anúncio e o card do profissional, no tamanho da tela do app.
  const cards = await page.evaluate(() => [...document.querySelectorAll('.how-phone .screen')].map((s) => s.querySelectorAll('.lc').length));
  const lcIndex = (screen, n) => { let base = 0; return page.evaluate(({ screen, n }) => { const all = [...document.querySelectorAll('.lc')]; const inScreen = [...document.querySelectorAll('.how-phone .screen')][screen].querySelectorAll('.lc'); return all.indexOf(inScreen[n]); }, { screen, n }); };
  for (let n = 0; n < Math.min(3, cards[0]); n++) { await isolate('.lc', await lcIndex(0, n), 'width'); await shot('card-home-' + n); }
  for (let n = 0; n < Math.min(3, cards[1]); n++) { await isolate('.lc', await lcIndex(1, n), 'width'); await shot('card-busca-' + n); }
  const proIdx = await page.evaluate(() => { const all = [...document.querySelectorAll('.pro')]; return Math.max(0, all.findIndex((e) => e.closest('.how-phone'))); });
  await isolate('.pro', proIdx, 'width'); await shot('pro');
  await page.close(); server.close();
}
const tela = (name) => dataUrl(path.join(TELAS, name + '.png'), 'image/png');

// ---------------------------------------------------------------------------
// Modelos de slide (1080 × 1350)
// ---------------------------------------------------------------------------
const ESTILOS = {
  claro: { bg: C.background, fg: C.ink, muted: C.textMuted, kicker: C.accentText, num: C.brand, pat: [C.accent, 0.35], dark: false },
  laranja: { bg: C.accentSoft, fg: C.ink, muted: C.textMuted, kicker: C.accentText, num: C.accentText, pat: [C.accent, 0.5], dark: false },
  escuro: { bg: C.ink, fg: C.white, muted: C.onDarkMuted, kicker: C.accent, num: C.accent, pat: [C.accent, 0.16], dark: true },
  teal: { bg: C.primary, fg: C.white, muted: '#CFE9E7', kicker: C.accent, num: C.accent, pat: [C.white, 0.12], dark: true },
  branco: { bg: C.surface, fg: C.ink, muted: C.textMuted, kicker: C.primary, num: C.brand, pat: null, dark: false },
};
const W = POST.w - 2 * M;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
/** Título: "_" no fim vira o cursor laranja da logo. */
const title = (s, size, color, extra = '') => {
  const cur = s.endsWith('_'); const txt = esc(cur ? s.slice(0, -1) : s);
  return `<h1 class="display" style="font-size:${size}px;color:${color};${extra}">${txt}${cur ? '<span class="cur"></span>' : ''}</h1>`;
};
const kicker = (s, color) => s ? `<p style="font:700 30px Inter;letter-spacing:.08em;text-transform:uppercase;color:${color};margin-bottom:28px">${esc(s)}</p>` : '';
const para = (s, color, size = 36) => s ? `<p style="margin-top:32px;font-size:${size}px;line-height:1.42;color:${color}">${esc(s)}</p>` : '';
const counterEl = (n, total, e) => total > 1 ? `<div class="abs" style="top:${M}px;right:${M}px;font:600 26px Inter;letter-spacing:.04em;color:${e.muted}">${n}/${total}</div>` : '';
const brandTop = (e, simbolo) => `<div class="abs" style="left:${M}px;top:${M + 6}px">${simbolo ? symImg(58, { letter: e.dark ? C.white : C.ink }) : logoImg(70, { letters: e.dark ? C.white : C.ink })}</div>`;
const siteEl = (e) => `<div style="font:500 28px Inter;color:${e.muted}">conkat.app</div>`;
const foot = (e, { left = true, right = true } = {}) => `<div class="abs" style="left:${M}px;right:${M}px;bottom:${M}px;display:flex;align-items:center;justify-content:space-between">${left ? symImg(50, { letter: e.dark ? C.white : C.ink }) : '<span></span>'}${right ? siteEl(e) : ''}</div>`;
const bg = (e) => art(POST, e.bg, e.pat ? pattern(POST, { color: e.pat[0], opacity: e.pat[1] }) : '');
const wrap = (e, inner) => bg(e).replace(/<\/div>$/, inner + '</div>');
const shadow = 'filter:drop-shadow(0 40px 60px rgba(11,43,42,.28)) drop-shadow(0 12px 24px rgba(11,43,42,.18))';
const swipe = (e) => `<div class="abs pill" style="left:${M}px;bottom:${M}px;height:84px;padding:0 36px;background:${e.dark ? C.accent : C.ink};color:${e.dark ? C.ink : C.white};font-size:30px">Arraste ${icon('seta', e.dark ? C.ink : C.accent, 34)}</div>`;

const T = {
  capa(s, n, total) {
    const e = ESTILOS[s.estilo || 'claro'];
    return wrap(e, `${brandTop(e, s.simbolo)}${counterEl(n, total, e)}
      <div class="abs" style="left:${M}px;right:${M}px;bottom:${M + (total > 1 ? 150 : 110)}px">${kicker(s.kicker, e.kicker)}${title(s.titulo, 112, e.fg)}${para(s.texto, e.muted, 38)}</div>
      ${total > 1 && n === 1 ? swipe(e) : foot(e, { left: false })}`);
  },
  tela(s, n, total) {
    const e = ESTILOS[s.estilo || 'claro'];
    const num = s.numero ? `<div style="font:600 120px/1 Unageo;letter-spacing:-.04em;color:${e.num};margin-bottom:24px">${s.numero}</div>` : '';
    return wrap(e, `${counterEl(n, total, e)}
      <div class="abs" style="left:${M}px;top:${M}px;width:${W - 60}px">${num}${kicker(s.kicker, e.kicker)}${title(s.titulo, 76, e.fg)}${para(s.texto, e.muted, 32)}</div>
      <img class="abs" src="${tela(s.tela)}" style="right:${M - 40}px;top:${s.numero ? 700 : 640}px;width:560px;${shadow}">
      <div class="abs" style="left:${M}px;bottom:${M}px;display:flex;flex-direction:column;gap:18px">${symImg(50, { letter: e.dark ? C.white : C.ink })}${siteEl(e)}</div>`);
  },
  foto(s, n, total) {
    const e = ESTILOS.branco; const [ik, label] = s.chip;
    const card = s.peca ? `<img class="abs" src="${tela(s.peca)}" style="right:${M - 30}px;top:470px;width:620px;${shadow}">` : '';
    return art(POST, C.surface, `
      <div class="abs" style="left:0;top:0;right:0;height:720px;background:url(${PHOTO(s.foto)}) center/cover"></div>
      ${card}${counterEl(n, total, e)}
      <div class="abs pill" style="left:${M}px;top:${720 - 44}px;height:88px;padding:0 40px 0 30px;background:${C.ink};color:${C.white};font-size:32px">${icon(ik, C.accent, 40)}${esc(label)}</div>
      <div class="abs" style="left:${M}px;right:${M}px;top:820px">${title(s.titulo, 80, C.ink)}${para(s.texto, C.textMuted, 34)}</div>
      ${foot(e)}`);
  },
  lista(s, n, total) {
    const e = ESTILOS[s.estilo || 'claro'];
    const box = e.dark ? C.inkSoft : C.surface;
    const items = s.itens.map(([ik, t, d], i) => `
      <div style="display:flex;gap:32px;align-items:center;padding:${d ? 26 : 22}px 0;border-top:2px solid ${e.dark ? 'rgba(255,255,255,.08)' : C.border}">
        <div style="flex:none;width:96px;height:96px;border-radius:28px;background:${box};display:flex;align-items:center;justify-content:center;${e.dark ? '' : `box-shadow:inset 0 0 0 2px ${C.border}`}">
          ${ik ? icon(ik, e.dark ? C.accent : C.primary, 52) : `<span style="font:600 48px Unageo;color:${e.num}">${i + 1}</span>`}
        </div>
        <div><div style="font:600 ${d ? 40 : 44}px/1.2 Unageo;letter-spacing:-.02em;color:${e.fg}">${esc(t)}</div>${d ? `<div style="margin-top:8px;font-size:30px;line-height:1.35;color:${e.muted}">${esc(d)}</div>` : ''}</div>
      </div>`).join('');
    return wrap(e, `${counterEl(n, total, e)}
      <div class="abs" style="left:${M}px;right:${M}px;top:${M}px">${kicker(s.kicker, e.kicker)}${title(s.titulo, 88, e.fg)}
        <div style="margin-top:48px">${items}</div>${s.nota ? para(s.nota, e.muted, 30) : ''}</div>
      ${foot(e)}`);
  },
  duvida(s, n, total) {
    const e = ESTILOS.branco; const rest = s.resposta.slice(s.destaque.length);
    return art(POST, C.surface, `
      <div class="abs" style="left:${M}px;top:${M}px;display:flex;align-items:center;gap:24px">
        <div style="width:120px;height:120px;border-radius:32px;background:${C.primarySoft};display:flex;align-items:center;justify-content:center">${icon('duvida', C.primary, 72)}</div>
        <span style="font:700 30px Inter;letter-spacing:.08em;text-transform:uppercase;color:${C.primary}">Dúvida frequente</span>
      </div>
      <div class="abs" style="left:${M}px;right:${M}px;top:330px">${title(s.pergunta, 100, C.ink)}
        <p style="margin-top:48px;font-size:42px;line-height:1.45;color:${C.text}"><b style="font-weight:700">${esc(s.destaque)}</b>${esc(rest)}</p></div>
      ${foot(e)}<div class="abs" style="left:0;right:0;bottom:0;height:20px;background:${C.accent}"></div>`);
  },
  numeros(s, n, total) {
    const e = ESTILOS[s.estilo || 'teal'];
    return wrap(e, `${counterEl(n, total, e)}
      <div class="abs" style="left:${M}px;right:${M}px;top:${M + 8}px">${kicker(s.kicker, e.kicker)}${title(s.titulo, 100, e.fg)}</div>
      <div class="abs" style="left:${M}px;right:${M}px;bottom:${M + 116}px;display:flex;gap:28px">
        ${s.numeros.map(([v, t]) => `<div style="flex:1;background:${C.ink};border-radius:32px;padding:40px 40px 44px"><div class="display" style="font-size:84px;color:${C.accent}">${esc(v)}</div><div style="margin-top:14px;font-size:30px;line-height:1.35;color:${C.onDarkMuted}">${esc(t)}</div></div>`).join('')}
      </div>
      <div class="abs" style="left:${M}px;right:${M}px;bottom:${M}px;display:flex;align-items:center;justify-content:space-between">${logoImg(52, { letters: C.white })}${siteEl(e)}</div>`);
  },
  peca(s, n, total) {
    const e = ESTILOS[s.estilo || 'claro'];
    const num = s.numero ? `<div style="font:600 120px/1 Unageo;letter-spacing:-.04em;color:${e.num};margin-bottom:24px">${s.numero}</div>` : '';
    const one = s.pecas.length === 1;
    const pieces = s.pecas.map((p, i) => `<img src="${tela(p)}" style="display:block;width:${one ? 820 : 640}px;margin-left:${one ? 0 : i * 48}px;${shadow}">`).join('');
    // Uma peça: ancorada embaixo. Várias: logo abaixo do texto, em cascata.
    const piecesBox = one
      ? `<div class="abs" style="left:${M - 20}px;bottom:${M + 110}px">${pieces}</div>`
      : `<div style="margin:56px 0 0 -20px;display:flex;flex-direction:column;gap:18px">${pieces}</div>`;
    return wrap(e, `${counterEl(n, total, e)}
      <div class="abs" style="left:${M}px;right:${M}px;top:${M}px">${num}${kicker(s.kicker, e.kicker)}${title(s.titulo, one ? 92 : 76, e.fg)}${para(s.texto, e.muted, 34)}${one ? '' : piecesBox}</div>
      ${one ? piecesBox : ''}
      ${foot(e)}`);
  },
  final(s, n, total) {
    const e = ESTILOS[s.estilo || 'claro'];
    return wrap(e, `${counterEl(n, total, e)}
      <div class="abs" style="left:${M}px;right:${M}px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:flex-start">
        ${logoImg(84, { letters: e.dark ? C.white : C.ink })}
        <div style="height:72px"></div>${title(s.titulo, 92, e.fg)}${para(s.texto, e.muted, 36)}
        <div style="margin-top:56px;display:flex;gap:20px">${['App Store', 'Google Play'].map((t) => `<div class="pill" style="height:84px;padding:0 36px;background:${e.dark ? C.white : C.ink};color:${e.dark ? C.ink : C.white};font-size:30px">Em breve · ${t}</div>`).join('')}</div>
      </div>
      <div class="abs" style="right:${M}px;bottom:${M}px">${siteEl(e)}</div>`);
  },
};

// Story do dia: o primeiro slide do post, com o aviso de post novo.
const storyHtml = (cover, label) => art(STORY, C.ink, `
  ${pattern(STORY, { opacity: 0.16, fade: 'to bottom' })}
  <div class="abs" style="left:${M}px;top:250px">${logoImg(64, { letters: C.white })}</div>
  <div class="abs" style="left:50%;top:430px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:40px">
    <div class="pill" style="height:84px;padding:0 36px;background:${C.accent};color:${C.ink};font-size:32px">Post novo ${icon('seta', C.ink, 34)}</div>
    <img src="${cover}" style="width:760px;border-radius:28px;display:block;box-shadow:0 40px 80px rgba(0,0,0,.45)">
    <div style="font:500 34px Inter;color:${C.onDarkMuted};text-align:center;max-width:760px">${esc(label)}</div>
  </div>`);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
await launch();
console.log('Recortando as telas do app…');
await captureAppScreens();
fs.rmSync(OUT, { recursive: true, force: true }); mkdir(OUT);

const agenda = [];
for (let i = 0; i < DIAS; i++) {
  const post = POSTS[i]; const d = dayOf(i); const wd = d.getUTCDay();
  const dir = `${iso(d)}-${post.slug}`; const abs = path.join(OUT, dir);
  const total = post.slides.length;
  for (const [k, s] of post.slides.entries()) {
    if (!T[s.t]) throw new Error(`Modelo desconhecido "${s.t}" em ${post.slug}`);
    await renderHtml(T[s.t](s, k + 1, total), POST.w, POST.h, path.join(abs, String(k + 1).padStart(2, '0') + '.jpg'));
  }
  await renderHtml(storyHtml(dataUrl(path.join(abs, '01.jpg'), 'image/jpeg'), post.tema), STORY.w, STORY.h, path.join(abs, 'story.jpg'));
  write(path.join(abs, 'legenda.txt'), `${post.legenda.trim()}\n\n${post.hashtags.join(' ')}\n`);
  agenda.push({ d, wd, dir, post, total, hora: HORARIOS[wd] });
  console.log(`${iso(d)} ${SEMANA[wd].padEnd(7)} ${HORARIOS[wd]}  ${total > 1 ? `carrossel (${total})` : 'post'.padEnd(13)}  ${post.tema}`);
}

// Agenda em Markdown
write(path.join(OUT, 'README.md'), `# Instagram — próximos ${DIAS} dias

Gerado por \`node brand/gerar-calendario.mjs --inicio ${INICIO} --dias ${DIAS}\`. A pauta fica em
[\`../calendario.mjs\`](../calendario.mjs): mude lá e rode o script de novo (esta pasta é apagada e refeita).

Cada pasta tem os slides (\`01.jpg\`, \`02.jpg\`…), o \`story.jpg\` para avisar do post e a \`legenda.txt\`.
O robô do Instagram (.github/workflows/instagram.yml) publica cada dia no horário abaixo. Ver brand/instagram/PUBLICAR.md.

![Prévia](previa.png)

| Data | Dia | Horário | Formato | Tema | Pasta |
|---|---|---|---|---|---|
${agenda.map((a) => `| ${br(a.d)} | ${SEMANA[a.wd]} | ${a.hora} | ${a.total > 1 ? `Carrossel (${a.total})` : 'Post'} | ${a.post.tema} | [\`${a.dir}\`](${a.dir}/) |`).join('\n')}

## Legendas

${agenda.map((a) => `### ${br(a.d)} — ${a.post.tema}\n\n${a.post.legenda.trim()}\n\n${a.post.hashtags.join(' ')}\n`).join('\n')}`);

// Prévia: todos os posts lado a lado, com data
{
  const cols = 5, cw = 300;
  const html = `<div class="art" style="width:${cols * cw + (cols + 1) * 24}px;padding:24px;background:${C.background};display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:28px 24px;font-family:Inter">
    ${agenda.map((a) => `<div><img src="${dataUrl(path.join(OUT, a.dir, '01.jpg'), 'image/jpeg')}" style="width:${cw}px;display:block;border-radius:8px;box-shadow:0 0 0 1px ${C.border}">
      <div style="margin-top:10px;font:600 17px Inter;color:${C.ink}">${br(a.d)} · ${SEMANA[a.wd]} · ${a.hora}</div>
      <div style="font:14px Inter;color:${C.textMuted}">${a.total > 1 ? `Carrossel (${a.total}) · ` : ''}${esc(a.post.tema)}</div></div>`).join('')}
  </div>`;
  const page = await getBrowser().newPage({ viewport: { width: 1700, height: 900 } });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}</style></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.art').screenshot({ path: path.join(OUT, 'previa.png') });
  await page.close();
}
await close();
console.log(`\nPronto: ${path.relative(r(), OUT)}/ (${DIAS} dias, de ${br(dayOf(0))} a ${br(dayOf(DIAS - 1))})`);
