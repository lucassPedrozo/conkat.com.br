// Conkat — publica no Instagram o post do dia gerado por gerar-calendario.mjs.
//
//   node brand/publicar-instagram.mjs --teste                 # mostra o que faria, sem publicar
//   node brand/publicar-instagram.mjs                         # publica o de hoje, se já for a hora
//   node brand/publicar-instagram.mjs --data 2026-11-24 --agora
//   node brand/publicar-instagram.mjs --so story              # só o story (ou --so post)
//
// Roda sozinho pelo GitHub Actions (.github/workflows/instagram.yml), uma vez por hora. Publica o
// post de hoje quando chega o horário da pauta (HORARIOS em instagram/calendario.mjs, horário de
// Brasília) e, logo depois, o story. Se o post de hoje já está no perfil, não publica de novo.
//
// Variáveis de ambiente (no GitHub: Settings → Secrets and variables → Actions):
//   IG_USER_ID        id da conta do Instagram (segredo)
//   IG_ACCESS_TOKEN   token de acesso com permissão de publicar (segredo)
//   IG_API_HOST       graph.instagram.com (login do Instagram, padrão) ou graph.facebook.com (login do Facebook)
//   IG_API_VERSION    versão da API (padrão v24.0)
//   MIDIA_BASE_URL    endereço público da raiz do repositório. No GitHub Actions é montado sozinho:
//                     https://raw.githubusercontent.com/<repo>/<commit>/
//
// A API não recebe o arquivo: ela baixa a imagem pelo endereço. Por isso as imagens precisam estar
// no repositório (público) no commit que o robô está rodando.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HORARIOS } from './instagram/calendario.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAL = path.join(ROOT, 'brand/instagram/calendario');
const argv = process.argv.slice(2);
const flag = (n) => argv.includes('--' + n);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };

const TESTE = flag('teste');
const AGORA = flag('agora');
const SO = arg('so', 'tudo'); // tudo | post | story
if (!['tudo', 'post', 'story'].includes(SO)) fail('--so deve ser post, story ou tudo');

// Data e hora em Brasília
const nowBR = () => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour === '24' ? '00' : p.hour}:${p.minute}` };
};
const now = nowBR();
const DATA = arg('data', now.date);
if (!/^\d{4}-\d{2}-\d{2}$/.test(DATA)) fail('--data deve ser AAAA-MM-DD');

function fail(msg) { console.error('Erro: ' + msg); process.exit(1); }
const out = (s) => { console.log(s); if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, s + '\n'); };

// ---------------------------------------------------------------------------
// Post do dia
// ---------------------------------------------------------------------------
const dir = fs.existsSync(CAL) ? fs.readdirSync(CAL).find((d) => d.startsWith(DATA + '-')) : null;
if (!dir) { out(`Nada na pauta para ${DATA}.`); process.exit(0); }
const abs = path.join(CAL, dir);
const slides = fs.readdirSync(abs).filter((f) => /^\d+\.jpe?g$/i.test(f)).sort();
const story = fs.readdirSync(abs).find((f) => /^story\.jpe?g$/i.test(f));
const legenda = fs.readFileSync(path.join(abs, 'legenda.txt'), 'utf8').trim();
if (!slides.length) fail(`${dir}: nenhum slide em JPEG (rode gerar-calendario.mjs de novo)`);
if (slides.length > 10) fail(`${dir}: carrossel com ${slides.length} slides (máximo 10)`);
if (legenda.length > 2200) fail(`${dir}: legenda com ${legenda.length} caracteres (máximo 2200)`);
if ((legenda.match(/#\S+/g) || []).length > 30) fail(`${dir}: mais de 30 hashtags`);

const weekday = new Date(DATA + 'T12:00:00Z').getUTCDay();
const HORA = HORARIOS[weekday];
const repo = process.env.GITHUB_REPOSITORY, sha = process.env.GITHUB_SHA;
const BASE = process.env.MIDIA_BASE_URL || (repo && sha ? `https://raw.githubusercontent.com/${repo}/${sha}/` : null);
const url = (f) => BASE ? new URL(path.relative(ROOT, path.join(abs, f)).split(path.sep).join('/'), BASE).href : `(sem MIDIA_BASE_URL) ${f}`;

out(`## Instagram — ${DATA} (${HORA})\n`);
out(`- Pasta: \`${dir}\``);
out(`- Formato: ${slides.length > 1 ? `carrossel com ${slides.length} slides` : 'post único'}${story ? ' + story' : ''}`);
out(`- Legenda: ${legenda.split('\n')[0].slice(0, 90)}…`);

if (!AGORA && DATA === now.date && now.time < HORA) { out(`\nAinda não é a hora (agora ${now.time}, publica às ${HORA}).`); process.exit(0); }

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
const HOST = process.env.IG_API_HOST || 'graph.instagram.com';
const VER = process.env.IG_API_VERSION || 'v24.0';
const USER = process.env.IG_USER_ID;
const TOKEN = process.env.IG_ACCESS_TOKEN;

async function api(method, pathname, params = {}) {
  const u = new URL(`https://${HOST}/${VER}/${pathname}`);
  const opts = { method, headers: { Authorization: `Bearer ${TOKEN}` } };
  if (method === 'GET') for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  else { opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'; opts.body = new URLSearchParams(params); }
  const res = await fetch(u, opts);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    const e = json.error || {};
    throw new Error(`API ${method} ${pathname}: ${e.message || res.status}${e.code ? ` (código ${e.code}${e.error_subcode ? '/' + e.error_subcode : ''})` : ''}`);
  }
  return json;
}
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
/** Espera o Instagram terminar de processar o contêiner de mídia. */
async function ready(id) {
  for (let i = 0; i < 30; i++) {
    const { status_code: s } = await api('GET', id, { fields: 'status_code' });
    if (s === 'FINISHED') return;
    if (s === 'ERROR' || s === 'EXPIRED') throw new Error(`mídia ${id}: ${s}`);
    await sleep(4000);
  }
  throw new Error(`mídia ${id}: demorou demais para processar`);
}
async function publish(creationId) { await ready(creationId); return (await api('POST', `${USER}/media_publish`, { creation_id: creationId })).id; }
/** O post de hoje já está no perfil? Compara o começo da legenda com os últimos posts. */
async function alreadyPosted() {
  const head = legenda.slice(0, 80);
  const { data = [] } = await api('GET', `${USER}/media`, { fields: 'id,caption,timestamp,permalink', limit: '15' });
  return data.find((m) => (m.caption || '').startsWith(head));
}
async function checkUrls(files) {
  for (const f of files) {
    const res = await fetch(url(f), { method: 'HEAD' }).catch((e) => ({ ok: false, status: e.message }));
    if (!res.ok) throw new Error(`imagem não acessível (${res.status}): ${url(f)}`);
    const type = res.headers?.get('content-type') || '';
    if (!/jpe?g/.test(type)) throw new Error(`imagem não é JPEG (${type}): ${url(f)}`);
  }
}

const files = [...(SO !== 'story' ? slides : []), ...(SO !== 'post' && story ? [story] : [])];
if (TESTE) {
  out('\nModo teste: nada foi publicado. Imagens que seriam enviadas:');
  for (const f of files) out(`- ${url(f)}`);
  if (BASE) { await checkUrls(files); out('\nTodas as imagens estão acessíveis e em JPEG.'); }
  if (USER && TOKEN) {
    // Só lê o nome da conta: confere token, id e endereço da API sem publicar nada.
    try {
      const { username } = await api('GET', USER, { fields: 'username' });
      out(`Token válido: conta @${username} (${HOST}).`);
    } catch (e) { fail(`o token não funcionou: ${e.message}`); }
  } else {
    out('Segredos IG_USER_ID e IG_ACCESS_TOKEN ainda não configurados: token não conferido.');
  }
  process.exit(0);
}
if (!USER || !TOKEN) fail('faltam IG_USER_ID e IG_ACCESS_TOKEN (segredos do GitHub)');
if (!BASE) fail('falta MIDIA_BASE_URL (fora do GitHub Actions, defina o endereço público do repositório)');
await checkUrls(files);

try {
  const existing = SO !== 'story' ? await alreadyPosted() : null;
  if (existing) out(`\nO post de hoje já está no perfil: ${existing.permalink || existing.id}. Não publico de novo.`);
  if (SO !== 'story' && !existing) {
    let id;
    if (slides.length === 1) {
      id = (await api('POST', `${USER}/media`, { image_url: url(slides[0]), caption: legenda })).id;
    } else {
      const children = [];
      for (const f of slides) children.push((await api('POST', `${USER}/media`, { image_url: url(f), is_carousel_item: 'true' })).id);
      for (const c of children) await ready(c);
      id = (await api('POST', `${USER}/media`, { media_type: 'CAROUSEL', children: children.join(','), caption: legenda })).id;
    }
    const mediaId = await publish(id);
    const { permalink } = await api('GET', mediaId, { fields: 'permalink' }).catch(() => ({}));
    out(`\nPost publicado: ${permalink || mediaId}`);
  }
  // Story: só junto com o post (ou com --so story), para não repetir em execuções seguintes.
  if (story && (SO === 'story' || (SO === 'tudo' && !existing))) {
    const id = (await api('POST', `${USER}/media`, { image_url: url(story), media_type: 'STORIES' })).id;
    out(`Story publicado: ${await publish(id)}`);
  }
} catch (e) {
  fail(e.message);
}
