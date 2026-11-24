// Conkat — publica no Instagram um reels de brand/instagram/reels/<pasta>/.
//
//   node brand/publicar-reels.mjs --pasta 2026-11-24-qual-servico --teste   # confere, sem publicar
//   node brand/publicar-reels.mjs --pasta 2026-11-24-qual-servico           # publica
//
// Roda pelo GitHub Actions (.github/workflows/instagram-reels.yml), só quando acionado à mão.
// Cada pasta tem: reel.mp4 (9:16, H.264 + AAC), capa.jpg (capa do reels) e legenda.txt.
// Se um reels com a mesma legenda já está no perfil, não publica de novo.
//
// Usa os mesmos segredos de publicar-instagram.mjs (ver instagram/PUBLICAR.md):
//   IG_USER_ID, IG_ACCESS_TOKEN, IG_API_HOST (opcional), IG_API_VERSION (opcional)
//
// Envio do vídeo: primeiro pelo endereço público do repositório (video_url). Se a Meta não aceitar
// o arquivo por esse endereço, envia o arquivo direto (upload resumable da API).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REELS = path.join(ROOT, 'brand/instagram/reels');
const argv = process.argv.slice(2);
const flag = (n) => argv.includes('--' + n);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };

function fail(msg) { console.error('Erro: ' + msg); process.exit(1); }
const out = (s) => { console.log(s); if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, s + '\n'); };

const TESTE = flag('teste');
const PASTA = arg('pasta');
if (!PASTA || !/^[\w-]+$/.test(PASTA)) fail('informe --pasta (nome da pasta em brand/instagram/reels)');
const abs = path.join(REELS, PASTA);
if (!fs.existsSync(abs)) fail(`pasta não encontrada: brand/instagram/reels/${PASTA}`);
const VIDEO = 'reel.mp4';
const CAPA = 'capa.jpg';
if (!fs.existsSync(path.join(abs, VIDEO))) fail(`${PASTA}: falta ${VIDEO}`);
const temCapa = fs.existsSync(path.join(abs, CAPA));
const legenda = fs.readFileSync(path.join(abs, 'legenda.txt'), 'utf8').trim();
if (legenda.length > 2200) fail(`${PASTA}: legenda com ${legenda.length} caracteres (máximo 2200)`);
if ((legenda.match(/#\S+/g) || []).length > 30) fail(`${PASTA}: mais de 30 hashtags`);
const tamanho = fs.statSync(path.join(abs, VIDEO)).size;
if (tamanho > 300 * 1024 * 1024) fail(`${PASTA}: vídeo com mais de 300 MB`);

const repo = process.env.GITHUB_REPOSITORY, sha = process.env.GITHUB_SHA;
const BASE = process.env.MIDIA_BASE_URL || (repo && sha ? `https://raw.githubusercontent.com/${repo}/${sha}/` : null);
const url = (f) => (BASE ? new URL(`brand/instagram/reels/${PASTA}/${f}`, BASE).href : `(sem MIDIA_BASE_URL) ${f}`);

out(`## Instagram — reels \`${PASTA}\`\n`);
out(`- Vídeo: ${(tamanho / 1024 / 1024).toFixed(1)} MB${temCapa ? ' + capa' : ''}`);
out(`- Legenda: ${legenda.split('\n')[0].slice(0, 90)}…`);

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
/** Espera o Instagram processar o vídeo (pode levar alguns minutos). */
async function ready(id) {
  for (let i = 0; i < 60; i++) {
    const { status_code: s, status } = await api('GET', id, { fields: 'status_code,status' });
    if (s === 'FINISHED') return 'ok';
    if (s === 'ERROR' || s === 'EXPIRED') return `${s}${status ? ': ' + status : ''}`;
    await sleep(5000);
  }
  return 'demorou demais para processar';
}
async function alreadyPosted() {
  const head = legenda.slice(0, 80);
  const { data = [] } = await api('GET', `${USER}/media`, { fields: 'id,caption,permalink', limit: '15' });
  return data.find((m) => (m.caption || '').startsWith(head));
}
async function head(f) {
  const res = await fetch(url(f), { method: 'HEAD' }).catch((e) => ({ ok: false, status: e.message }));
  if (!res.ok) throw new Error(`arquivo não acessível (${res.status}): ${url(f)}`);
  return res.headers?.get('content-type') || '';
}
const base = () => ({ media_type: 'REELS', caption: legenda, share_to_feed: 'true', ...(temCapa ? { cover_url: url(CAPA) } : {}) });

if (TESTE) {
  out('\nModo teste: nada foi publicado.');
  out(`- ${url(VIDEO)}`);
  if (temCapa) out(`- ${url(CAPA)}`);
  if (BASE) {
    out(`- Tipo do vídeo pelo endereço público: ${await head(VIDEO)}`);
    if (temCapa) out(`- Tipo da capa: ${await head(CAPA)}`);
  }
  if (USER && TOKEN) {
    try {
      const { username } = await api('GET', USER, { fields: 'username' });
      out(`Token válido: conta @${username} (${HOST}).`);
    } catch (e) { fail(`o token não funcionou: ${e.message}`); }
  } else out('Segredos IG_USER_ID e IG_ACCESS_TOKEN não configurados: token não conferido.');
  process.exit(0);
}
if (!USER || !TOKEN) fail('faltam IG_USER_ID e IG_ACCESS_TOKEN (segredos do GitHub)');
if (!BASE) fail('falta MIDIA_BASE_URL (fora do GitHub Actions, defina o endereço público do repositório)');

try {
  const existing = await alreadyPosted();
  if (existing) { out(`\nEste reels já está no perfil: ${existing.permalink || existing.id}. Não publico de novo.`); process.exit(0); }

  // 1) pelo endereço público
  await head(VIDEO);
  let id = (await api('POST', `${USER}/media`, { ...base(), video_url: url(VIDEO) })).id;
  let st = await ready(id);

  // 2) se falhar, envia o arquivo direto
  if (st !== 'ok') {
    out(`\nO envio por endereço falhou (${st}). Tentando enviar o arquivo direto.`);
    id = (await api('POST', `${USER}/media`, { ...base(), upload_type: 'resumable' })).id;
    const up = await fetch(`https://rupload.facebook.com/ig-api-upload/${VER}/${id}`, {
      method: 'POST',
      headers: { Authorization: `OAuth ${TOKEN}`, offset: '0', file_size: String(tamanho) },
      body: fs.readFileSync(path.join(abs, VIDEO)),
    });
    if (!up.ok) throw new Error(`upload direto falhou: ${up.status} ${await up.text().catch(() => '')}`);
    st = await ready(id);
    if (st !== 'ok') throw new Error(`o Instagram não processou o vídeo: ${st}`);
  }

  const mediaId = (await api('POST', `${USER}/media_publish`, { creation_id: id })).id;
  const { permalink } = await api('GET', mediaId, { fields: 'permalink' }).catch(() => ({}));
  out(`\nReels publicado: ${permalink || mediaId}`);
} catch (e) {
  fail(e.message);
}
