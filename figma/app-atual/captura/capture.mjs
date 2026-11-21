// Tira os prints de todas as telas do app (export web com dados de exemplo em localhost:8090).
// Saída: <out>/<id>.png (e <id>-completa.png nas telas que rolam) + <out>/telas.json
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { launch, sleep } from './cdp.mjs';

const B = 'http://localhost:8090';
const out = process.argv[2];
const only = process.argv[3] ? new RegExp(process.argv[3]) : null;
mkdirSync(out, { recursive: true });

const uuid = (n) => `01a06864-c5b4-7514-9cec-${String(n).padStart(12, '0')}`;
const SESSION = JSON.stringify({ accessToken: 'mock-access', refreshToken: 'mock-refresh' });
const DRAFT = {
  categoryId: 3, title: 'Eletricista residencial e predial',
  description: 'Instalação e manutenção elétrica em casas e apartamentos. Troca de disjuntores, tomadas e chuveiros, com garantia do serviço.',
  priceType: 'starting_from', price: '80', cityId: 7, neighborhood: 'Centro', whatsapp: '(47) 99999-0001',
  photos: [{ uri: 'https://picsum.photos/seed/conkat-eletrica/800/600', width: 800, height: 600 }],
};

const W = 390, H = 844;
const b = await launch({ width: W, height: H, scale: 2 });

async function storage(set) {
  await b.go(B + '/', 1500);
  await b.eval(`(() => { localStorage.clear(); ${Object.entries(set).map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)}, ${JSON.stringify(v)});`).join(' ')} })()`);
}
const visitor = () => storage({});
const pro = (extra = {}) => storage({ '@conkat/auth_session': SESSION, ...extra });

/** Altura do conteúdo que rola (o maior scrollHeight na tela). */
async function contentHeight() {
  return b.eval(`(() => { let m = document.documentElement.scrollHeight; for (const el of document.querySelectorAll('body *')) { const s = getComputedStyle(el); if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 4) m = Math.max(m, el.scrollHeight + (innerHeight - el.clientHeight)); } return Math.ceil(m); })()`);
}
async function setHeight(h) {
  await b.send('Emulation.setDeviceMetricsOverride', { width: W, height: h, deviceScaleFactor: 2, mobile: true });
  await sleep(1200);
}
async function fillInputs(values) {
  for (let i = 0; i < values.length; i++) {
    if (values[i] == null) continue;
    const r = await b.eval(`(() => { const el = [...document.querySelectorAll('input, textarea')].filter((e) => e.offsetParent)[${i}]; if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    if (!r) throw new Error('Campo ' + i + ' não encontrado');
    await sleep(400);
    await b.tapAt(r.x, r.y);
    await b.type(values[i]);
  }
}

const screens = [];
// id, grupo, nome, rota mostrada, preparo
const S = (id, grupo, nome, rota, prep) => screens.push({ id, grupo, nome, rota, prep });

// ---------------- Visitante ----------------
S('V01', 'Visitante', 'Início', '/', async () => { await visitor(); await b.go(B + '/'); });
S('V02', 'Visitante', 'Início · escolher cidade', '/ (folha)', async () => { await visitor(); await b.go(B + '/'); await b.tap('Joinville'); await sleep(800); });
S('V03', 'Visitante', 'Busca', '/search', async () => { await visitor(); await b.go(B + '/search'); });
S('V04', 'Visitante', 'Busca · sugestões', '/search', async () => { await visitor(); await b.go(B + '/search'); await b.type('ele'); await sleep(1200); });
S('V05', 'Visitante', 'Busca · resultados', '/search', async () => { await visitor(); await b.go(B + '/search'); await b.type('eletricista'); await b.key('Enter'); await sleep(2000); });
S('V06', 'Visitante', 'Anúncios', '/explore', async () => { await visitor(); await b.go(B + '/explore'); });
S('V07', 'Visitante', 'Anúncios · filtros', '/explore (folha)', async () => { await visitor(); await b.go(B + '/explore'); await b.tap('Filtros'); await sleep(800); });
S('V08', 'Visitante', 'Anúncios · ordenar', '/explore (folha)', async () => { await visitor(); await b.go(B + '/explore'); await b.tap('Ordenar'); await sleep(800); });
S('V09', 'Visitante', 'Anúncio', '/service/[id]', async () => { await visitor(); await b.go(B + '/service/' + uuid(3), 4000); });
S('V10', 'Visitante', 'Favoritos · vazio', '/favorites', async () => { await visitor(); await b.go(B + '/favorites'); });
S('V11', 'Visitante', 'Favoritos · com anúncios', '/favorites', async () => {
  await visitor(); await b.go(B + '/');
  const hearts = await b.eval(`[...document.querySelectorAll('[role=button],[aria-label]')].filter((el) => /favorit/i.test(el.getAttribute('aria-label') || '')).slice(0, 2).map((el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })`);
  for (const h of hearts) await b.tapAt(h.x, h.y);
  await b.tap('Favoritos'); await sleep(1500);
});
S('V12', 'Visitante', 'Conta', '/settings', async () => { await visitor(); await b.go(B + '/settings'); });
S('V13', 'Visitante', 'Entrar', '/settings (folha)', async () => { await visitor(); await b.go(B + '/settings'); await b.tap('Já tenho conta'); await sleep(900); });
S('V14', 'Visitante', 'Meus anúncios · sem conta', '/my-ads', async () => { await visitor(); await b.go(B + '/my-ads'); });
S('V15', 'Cadastro', 'Criar conta · seus dados', '/register', async () => { await visitor(); await b.go(B + '/register'); });
S('V16', 'Cadastro', 'Criar conta · confirmar e-mail', '/account/verify-email', async () => {
  await visitor(); await b.go(B + '/register');
  await fillInputs(['João Silva Elétrica', '47999990001', 'joao@exemplo.com.br', 'senha-de-teste-123', '52998224725']);
  for (const t of ['Li e aceito os Termos de Uso', 'Li e aceito a Política de Privacidade']) { try { await b.tap(t); } catch {} }
  await b.tap('Criar conta'); await sleep(3000);
});
S('V17', 'Cadastro', 'Esqueci a senha · e-mail', '/forgot-password', async () => { await visitor(); await b.go(B + '/forgot-password'); });
S('V18', 'Cadastro', 'Esqueci a senha · código e senha nova', '/forgot-password', async () => {
  await visitor(); await b.go(B + '/forgot-password');
  await fillInputs(['joao@exemplo.com.br']); await b.tap('Enviar código'); await sleep(2500);
});
S('V19', 'Cadastro', 'Completar cadastro (login social)', '/complete-signup', async () => { await visitor(); await b.go(B + '/complete-signup'); });

// ---------------- Profissional ----------------
S('P01', 'Profissional', 'Meus anúncios', '/my-ads', async () => { await pro(); await b.go(B + '/my-ads', 4000); });
S('P02', 'Profissional', 'Conta', '/settings', async () => { await pro(); await b.go(B + '/settings', 4000); });
S('P03', 'Profissional', 'Perfil', '/account/profile', async () => { await pro(); await b.go(B + '/account/profile', 4000); });
S('P04', 'Profissional', 'Saldo', '/account/balance', async () => { await pro(); await b.go(B + '/account/balance', 4000); });
S('P05', 'Profissional', 'Desempenho do anúncio', '/ads/dashboard', async () => { await pro(); await b.go(B + '/ads/dashboard?id=' + uuid(1), 4500); });
S('P06', 'Profissional', 'Impulsionar anúncio', '/ads/boost', async () => { await pro(); await b.go(B + '/ads/boost?id=' + uuid(1), 4000); });
S('P07', 'Profissional', 'Publicar anúncio', '/ads/publish', async () => { await pro(); await b.go(B + '/ads/publish?id=' + uuid(902), 4000); });
S('P08', 'Profissional', 'Verificar e-mail', '/account/verify-email', async () => { await pro(); await b.go(B + '/account/verify-email?email=joao%40exemplo.com.br', 3500); });
const stepNames = ['categoria', 'descrição', 'preço e área', 'fotos', 'revisão'];
for (let i = 0; i < 5; i++) {
  S(`A0${i + 1}`, 'Novo anúncio', `Novo anúncio · ${i + 1} de 5 · ${stepNames[i]}`, '/ads/new', async () => {
    await pro(i === 0 ? {} : { '@conkat/ad_draft': JSON.stringify({ step: i, draft: DRAFT }) });
    await b.go(B + '/ads/new', 4000);
  });
}
S('A06', 'Novo anúncio', 'Editar anúncio · rascunho', '/ads/new?id=…', async () => { await pro(); await b.go(B + '/ads/new?id=' + uuid(902), 4500); });
S('A07', 'Novo anúncio', 'Editar anúncio · ativo (bloqueado)', '/ads/new?id=…', async () => { await pro(); await b.go(B + '/ads/new?id=' + uuid(1), 4500); });

// ---------------- Execução ----------------
// "--indice": não captura nada, só monta telas.json com os prints que já existem na pasta
if (process.argv.includes('--indice')) {
  const { existsSync } = await import('node:fs');
  const list = [];
  for (const s of screens) {
    if (!existsSync(join(out, s.id + '.png'))) { console.log('falta ' + s.id); continue; }
    const e = { id: s.id, grupo: s.grupo, nome: s.nome, rota: s.rota, arquivo: s.id + '.png', largura: W, altura: H };
    if (existsSync(join(out, s.id + '-completa.png'))) {
      const buf = (await import('node:fs')).readFileSync(join(out, s.id + '-completa.png'));
      e.completa = { arquivo: s.id + '-completa.png', altura: Math.round(buf.readUInt32BE(20) / 2) };
    }
    list.push(e);
  }
  writeFileSync(join(out, 'telas.json'), JSON.stringify(list, null, 2));
  console.log(list.length + ' telas no índice');
  b.close();
  process.exit(0);
}
const done = [];
for (const s of screens) {
  if (only && !only.test(s.id)) continue;
  try {
    await setHeight(H);
    await s.prep();
    await sleep(600);
    await b.shot(out, s.id);
    const entry = { ...s, arquivo: s.id + '.png', largura: W, altura: H };
    delete entry.prep;
    const full = await contentHeight();
    if (full > H + 40 && !/folha/.test(s.rota)) {
      const h = Math.min(full, 5000);
      await setHeight(h);
      await b.shot(out, s.id + '-completa');
      entry.completa = { arquivo: s.id + '-completa.png', altura: h };
    }
    done.push(entry);
    console.log(`ok  ${s.id} ${s.nome}${entry.completa ? ' (+ completa ' + entry.completa.altura + ')' : ''}`);
  } catch (e) {
    console.log(`ERRO ${s.id} ${s.nome}: ${e.message}`);
  }
}
writeFileSync(join(out, only ? 'telas.parcial.json' : 'telas.json'), JSON.stringify(done, null, 2));
if (b.errors.length) console.log('Erros de JS na página:', [...new Set(b.errors)].slice(0, 8).join(' | '));
b.close();
