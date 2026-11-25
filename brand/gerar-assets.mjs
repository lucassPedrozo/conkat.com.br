// Conkat — gera os arquivos da marca a partir da logo 2B (a logo padrão).
//
//   node brand/gerar-assets.mjs
//
// Gera:
//   brand/logo/        logo e símbolo em SVG e PNG (positivo, negativo e uma cor)
//   public/            favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png
//   brand/instagram/   foto de perfil, posts (1080 × 1350), stories (1080 × 1920),
//                      capas de destaque e uma prévia do perfil
//
// Usa o Chromium do Playwright para desenhar os PNGs e o Python (Pillow) para o .ico.
// As fontes vêm de public/fonts (Unageo) e de node_modules (Inter): rode `npm ci` antes.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  BASE_CSS, C, CURSOR, DATA, FONTS, GLYPHS, ICONS, LOGO_RATIO, LOGO_SRC, LOGO_VB, M, PHOTO, PLUGIN, POST, ROOT, STORY, SYM_BOX, art, b64, close, counter, dataUrl, footer, getBrowser, icon, iconSvg, launch, logoImg, logoSvg, mkdir, pattern, patternSvg, r, renderHtml, renderSvg, require, site, svgUrl, symImg, symInner, symbolBareSvg, symbolSvg, write,
} from './marca.mjs';

const posts = {
  // 1. Apresentação: o mesmo desenho da imagem de compartilhamento do site.
  '01-apresentacao': art(POST, C.background, `
    ${pattern(POST, { fade: 'to bottom left' })}
    <div class="abs" style="left:${M}px;top:${M + 8}px">${logoImg(78)}</div>
    <div class="abs" style="left:${M}px;right:${M}px;bottom:${M + 140}px">
      <h1 class="display" style="font-size:112px;color:${C.ink}">Profissionais verificados de Joinville e região.</h1>
      <p style="margin-top:40px;font-size:38px;line-height:1.4;color:${C.textMuted}">Preço, avaliações e contato direto no WhatsApp.</p>
    </div>
    ${footer(false, '<span></span>')}
    <div class="abs" style="left:0;right:0;bottom:0;height:20px;background:${C.primary}"></div>`),

  // 2. Chamada em fundo escuro, com o cursor da logo no fim da frase.
  '02-chamada-escura': art(POST, C.ink, `
    ${pattern(POST, { opacity: 0.16, fade: 'to bottom left' })}
    <div class="abs" style="left:${M}px;right:${M}px;top:50%;transform:translateY(-55%)">
      <h1 class="display" style="font-size:136px;color:${C.white}">Chame direto no WhatsApp<span class="cur"></span></h1>
      <p style="margin-top:48px;font-size:40px;line-height:1.4;color:${C.brandOnDark}">Sem criar conta. Sem intermediário.</p>
    </div>
    ${footer(true, logoImg(56, { letters: C.white }))}`),

  // 3. Categoria com foto.
  '03-categoria-foto': art(POST, C.surface, `
    <div class="abs" style="left:0;top:0;right:0;height:760px;background:url(${PHOTO('eletricista.jpg')}) center/cover"></div>
    <div class="abs pill" style="left:${M}px;top:${760 - 44}px;height:88px;padding:0 40px 0 30px;background:${C.ink};color:${C.white};font-size:34px">${icon('raio', C.accent, 40)}Eletricista</div>
    <div class="abs" style="left:${M}px;right:${M}px;top:${760 + 100}px">
      <h1 class="display" style="font-size:84px;color:${C.ink}">Eletricistas verificados em Joinville e região.</h1>
      <p style="margin-top:28px;font-size:34px;line-height:1.4;color:${C.textMuted}">Veja o preço e as avaliações antes de chamar.</p>
    </div>
    ${footer(false, symImg(52))}`),

  // 4. Carrossel — capa.
  '04-carrossel-capa': art(POST, C.accentSoft, `
    ${pattern(POST, { opacity: 0.5, fade: 'to bottom left' })}
    ${counter('1/4')}
    <div class="abs" style="left:${M}px;top:${M + 8}px">${symImg(58)}</div>
    <div class="abs" style="left:${M}px;right:${M}px;bottom:${M + 140}px">
      <p style="font:700 30px Inter;letter-spacing:.08em;text-transform:uppercase;color:${C.accentText}">Como funciona</p>
      <h1 class="display" style="margin-top:28px;font-size:124px;color:${C.ink}">Três passos até quem resolve.</h1>
    </div>
    <div class="abs pill" style="left:${M}px;bottom:${M}px;height:84px;padding:0 36px;background:${C.ink};color:${C.white};font-size:30px">Arraste ${icon('seta', C.accent, 34)}</div>`),

  // 5. Carrossel — página de conteúdo.
  '05-carrossel-passo': art(POST, C.background, `
    ${counter('2/4')}
    <div class="abs" style="left:${M}px;top:${M - 10}px;font:600 260px/1 Unageo;letter-spacing:-.04em;color:${C.brand}">01</div>
    <div class="abs" style="left:${M}px;right:${M}px;top:520px">
      <h1 class="display" style="font-size:104px;color:${C.ink}">Escolha a cidade</h1>
      <p style="margin-top:44px;font-size:42px;line-height:1.45;color:${C.textMuted}">O Conkat começa por Joinville e região. O app mostra só as cidades que já têm profissionais anunciando.</p>
    </div>
    ${footer(false, symImg(52))}`),

  // 6. Para profissionais, com os números da oferta.
  '06-para-profissionais': art(POST, C.primary, `
    ${pattern(POST, { color: C.white, opacity: 0.12, fade: 'to bottom left' })}
    <div class="abs" style="left:${M}px;right:${M}px;top:${M + 8}px">
      <p style="font:700 30px Inter;letter-spacing:.08em;text-transform:uppercase;color:${C.accent}">Para quem presta serviço</p>
      <h1 class="display" style="margin-top:32px;font-size:104px;color:${C.white}">Anuncie no Conkat. O cliente chama no seu WhatsApp.</h1>
    </div>
    <div class="abs" style="left:${M}px;right:${M}px;bottom:${M + 116}px;display:flex;gap:28px">
      ${[['14 dias', 'no ar sem custo no primeiro anúncio'], ['R$ 0', 'por contato recebido']].map(([v, t]) => `
        <div style="flex:1;background:${C.ink};border-radius:32px;padding:40px 40px 44px">
          <div class="display" style="font-size:84px;color:${C.accent}">${v}</div>
          <div style="margin-top:14px;font-size:30px;line-height:1.35;color:${C.onDarkMuted}">${t}</div>
        </div>`).join('')}
    </div>
    ${footer(true, logoImg(52, { letters: C.white }))}`),

  // 7. Dúvida frequente.
  '07-duvida': art(POST, C.surface, `
    <div class="abs" style="left:${M}px;top:${M}px;width:120px;height:120px;border-radius:32px;background:${C.primarySoft};display:flex;align-items:center;justify-content:center">${icon('duvida', C.primary, 72)}</div>
    <div class="abs" style="left:${M}px;right:${M}px;top:330px">
      <h1 class="display" style="font-size:100px;color:${C.ink}">Preciso de conta para contratar?</h1>
      <p style="margin-top:48px;font-size:42px;line-height:1.45;color:${C.text}"><b style="font-weight:700">Não.</b> Buscar, salvar e avaliar anúncios não exige cadastro. Só profissionais que anunciam têm conta.</p>
    </div>
    ${footer(false, symImg(52))}
    <div class="abs" style="left:0;right:0;bottom:0;height:20px;background:${C.accent}"></div>`),
};

// Stories: área livre de 250 px no topo e 340 px embaixo (barra do perfil e campo de resposta).
const ST = { top: 250, bottom: 340 };
const stories = {
  '01-story-claro': art(STORY, C.background, `
    ${pattern(STORY, { fade: 'to bottom' })}
    <div class="abs" style="left:${M}px;top:${ST.top}px">${logoImg(70)}</div>
    <div class="abs" style="left:${M}px;right:${M}px;bottom:${ST.bottom + 40}px">
      <h1 class="display" style="font-size:120px;color:${C.ink}">Precisa de um profissional?</h1>
      <p style="margin-top:40px;font-size:44px;line-height:1.4;color:${C.textMuted}">Veja preço e avaliações e chame direto no WhatsApp, sem criar conta.</p>
      <div class="pill" style="margin-top:64px;height:104px;padding:0 48px;background:${C.primary};color:${C.white};font-size:38px">Em breve no app ${icon('seta', C.white, 40)}</div>
    </div>`),

  '02-story-escuro': art(STORY, C.ink, `
    ${pattern(STORY, { opacity: 0.16, fade: 'to bottom' })}
    <div class="abs" style="left:${M}px;top:${ST.top}px">${logoImg(70, { letters: C.white })}</div>
    <div class="abs" style="left:${M}px;right:${M}px;bottom:${ST.bottom + 40}px">
      <p style="font:700 34px Inter;letter-spacing:.08em;text-transform:uppercase;color:${C.accent}">Sou profissional</p>
      <h1 class="display" style="margin-top:32px;font-size:128px;color:${C.white}">14 dias no ar sem custo<span class="cur"></span></h1>
      <p style="margin-top:40px;font-size:44px;line-height:1.4;color:${C.onDarkMuted}">No primeiro anúncio, contados a partir da aprovação.</p>
      <div class="pill" style="margin-top:64px;height:104px;padding:0 48px;background:${C.accent};color:${C.ink};font-size:38px">Começar a anunciar ${icon('seta', C.ink, 40)}</div>
    </div>`),

  '03-story-foto': art(STORY, C.ink, `
    <div class="abs" style="inset:0;background:url(${PHOTO('encanador.jpg')}) center/cover"></div>
    <div class="abs" style="inset:0;background:linear-gradient(to bottom,rgba(11,43,42,.55) 0%,rgba(11,43,42,0) 28%,rgba(11,43,42,0) 40%,rgba(11,43,42,.92) 72%,${C.ink} 100%)"></div>
    <div class="abs" style="left:${M}px;top:${ST.top}px">${logoImg(64, { letters: C.white })}</div>
    <div class="abs" style="left:${M}px;right:${M}px;bottom:${ST.bottom + 40}px">
      <div class="pill" style="height:84px;padding:0 36px 0 28px;background:${C.white};color:${C.ink};font-size:32px">${icon('gota', C.primary, 38)}Encanador</div>
      <h1 class="display" style="margin-top:40px;font-size:116px;color:${C.white}">Vazamento? Tem gente verificada perto de você.</h1>
    </div>`),
};

// Capas de destaque: o Instagram mostra só o círculo central, então o ícone fica no meio.
const HIGHLIGHTS = [
  ['como-funciona', 'busca', 'Como funciona'],
  ['profissionais', 'selo', 'Profissionais'],
  ['cidades', 'pin', 'Cidades'],
  ['duvidas', 'duvida', 'Dúvidas'],
  ['novidades', 'megafone', 'Novidades'],
];
const highlight = (key) => art(STORY, C.ink, `
  <div class="abs" style="left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:44px">
    ${icon(key, C.white, 360)}
    <div style="width:150px;height:48px;background:${C.accent}"></div>
  </div>`);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
await launch();
const out = [];
const save = async (rel, fn) => { await fn(r(rel)); out.push(rel); };

// Logo
const LOGO_DIR = 'brand/logo';
const logoFiles = {
  'conkat-logo.svg': logoSvg({ height: 120 }),
  'conkat-logo-negativo.svg': logoSvg({ letters: C.white, height: 120 }),
  'conkat-logo-ink.svg': logoSvg({ letters: C.ink, cursor: C.ink, height: 120 }),
  'conkat-logo-branco.svg': logoSvg({ letters: C.white, cursor: C.white, height: 120 }),
  'conkat-simbolo.svg': symbolBareSvg(),
  'conkat-simbolo-negativo.svg': symbolBareSvg({ letter: C.white }),
  'conkat-simbolo-app.svg': symbolSvg({ size: 512, radius: 0.22 }),
};
for (const [f, svg] of Object.entries(logoFiles)) { write(r(LOGO_DIR, f), svg + '\n'); out.push(`${LOGO_DIR}/${f}`); }
await save(`${LOGO_DIR}/conkat-logo.png`, (f) => renderSvg(logoSvg(), 1600, Math.round(1600 / LOGO_RATIO), f));
await save(`${LOGO_DIR}/conkat-logo-negativo.png`, (f) => renderSvg(logoSvg({ letters: C.white }), 1600, Math.round(1600 / LOGO_RATIO), f));
await save(`${LOGO_DIR}/conkat-logo-fundo-claro.png`, (f) => renderHtml(art({ w: 2000, h: 1000 }, C.background, `<div class="abs" style="left:50%;top:50%;transform:translate(-50%,-50%)">${logoImg(260)}</div>`), 2000, 1000, f));
await save(`${LOGO_DIR}/conkat-logo-fundo-escuro.png`, (f) => renderHtml(art({ w: 2000, h: 1000 }, C.ink, `<div class="abs" style="left:50%;top:50%;transform:translate(-50%,-50%)">${logoImg(260, { letters: C.white })}</div>`), 2000, 1000, f));
await save(`${LOGO_DIR}/conkat-simbolo-app-1024.png`, (f) => renderSvg(symbolSvg({ size: 1024, radius: 0.22 }), 1024, 1024, f));

// Favicons e ícones do site (quadrados cheios: o sistema arredonda; símbolo dentro da zona segura)
const favSmall = (size) => symbolSvg({ size, radius: 0.2, scale: 0.78 });
write(r('public/favicon.svg'), symbolSvg({ size: 64, radius: 0.22, scale: 0.7 }) + '\n'); out.push('public/favicon.svg');
const tmpIco = r('brand/.ico-tmp'); mkdir(tmpIco);
for (const s of [16, 32, 48]) await renderSvg(favSmall(s), s, s, path.join(tmpIco, `${s}.png`));
execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
d=sys.argv[1]; imgs=[Image.open(f"{d}/{s}.png").convert("RGBA") for s in (16,32,48)]
imgs[2].save(sys.argv[2], format="ICO", sizes=[(16,16),(32,32),(48,48)], append_images=imgs[:2])
`, tmpIco, r('public/favicon.ico')]);
fs.rmSync(tmpIco, { recursive: true, force: true }); out.push('public/favicon.ico');
await save('public/apple-touch-icon.png', (f) => renderSvg(symbolSvg({ size: 180, scale: 0.58 }), 180, 180, f));
await save('public/icon-192.png', (f) => renderSvg(symbolSvg({ size: 192, scale: 0.56 }), 192, 192, f));
await save('public/icon-512.png', (f) => renderSvg(symbolSvg({ size: 512, scale: 0.56 }), 512, 512, f));

// Instagram
const IG = 'brand/instagram';
await save(`${IG}/perfil/conkat-perfil.png`, (f) => renderSvg(symbolSvg({ size: 1080, scale: 0.5 }), 1080, 1080, f));
await save(`${IG}/perfil/conkat-perfil-claro.png`, (f) => renderSvg(symbolSvg({ size: 1080, scale: 0.5, bg: C.background, letter: C.ink }), 1080, 1080, f));
for (const [k, html] of Object.entries(posts)) await save(`${IG}/posts/${k}.png`, (f) => renderHtml(html, POST.w, POST.h, f));
for (const [k, html] of Object.entries(stories)) await save(`${IG}/stories/${k}.png`, (f) => renderHtml(html, STORY.w, STORY.h, f));
for (const [k, ic] of HIGHLIGHTS) await save(`${IG}/destaques/${k}.png`, (f) => renderHtml(highlight(ic), STORY.w, STORY.h, f));

// Prévia do perfil: como o feed fica com os posts (cortados em 3:4) e os destaques.
{
  const W = 1080, img = (rel) => dataUrl(r(rel), 'image/png');
  const grid = Object.keys(posts).slice(0, 6);
  const html = `<div class="art" style="width:${W}px;background:#fff;padding:56px 40px 4px;font-family:Inter">
    <div style="display:flex;align-items:center;gap:56px;padding:0 16px">
      <img src="${img(`${IG}/perfil/conkat-perfil.png`)}" style="width:220px;height:220px;border-radius:50%">
      <div style="display:flex;gap:64px;font-size:30px;color:#000">${[['7', 'posts'], ['—', 'seguidores'], ['—', 'seguindo']].map(([n, l]) => `<div style="text-align:center"><b style="font-size:38px;display:block">${n}</b>${l}</div>`).join('')}</div>
    </div>
    <div style="padding:28px 16px 0;font-size:30px;line-height:1.4;color:#000"><b>Conkat</b><br>Profissionais verificados de Joinville e região.<br>Preço, avaliações e contato direto no WhatsApp.<br><span style="color:#00376b">conkat.app</span></div>
    <div style="display:flex;gap:40px;padding:44px 16px 36px">${HIGHLIGHTS.map(([k, , label]) => `<div style="text-align:center;font-size:24px;color:#000"><div style="width:140px;height:140px;border-radius:50%;padding:6px;border:2px solid #dbdbdb"><div style="width:100%;height:100%;border-radius:50%;background:url(${img(`${IG}/destaques/${k}.png`)}) center/cover"></div></div><div style="margin-top:12px">${label}</div></div>`).join('')}</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:0 -40px">${grid.map((k) => `<div style="aspect-ratio:3/4;background:url(${img(`${IG}/posts/${k}.png`)}) center/cover"></div>`).join('')}</div>
  </div>`;
  const page = await getBrowser().newPage({ viewport: { width: W, height: 800 } });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}</style></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.art').screenshot({ path: r(`${IG}/previa-perfil.png`) });
  await page.close(); out.push(`${IG}/previa-perfil.png`);
}

await close();
console.log(out.join('\n'));
