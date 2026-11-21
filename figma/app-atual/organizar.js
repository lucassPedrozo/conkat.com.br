// Conkat — Telas atuais do app (prints)
// Organiza no Figma os prints de todas as telas do app, com a identificação de cada uma.
//
// Como usar:
//   1. No arquivo "Conkat - Telas", arraste para o Figma todos os arquivos da pasta
//      figma/app-atual/prints (pode soltar todos de uma vez, em qualquer página).
//   2. Rode o plugin "Scripter", cole este arquivo inteiro e clique em Run.
// O script acha cada print pelo código no nome (V01, P03, A02...), cria a página
// "App atual (prints)" e monta as seções Visitante, Cadastro, Profissional e Novo anúncio,
// com o nome, a rota e o estado de cada tela. Pode ser rodado de novo depois de soltar
// prints novos: ele refaz a página com tudo o que encontrar.
//
// Este arquivo é gerado por build.mjs a partir de prints/telas.json.

const TELAS = [{"id":"V01","grupo":"Visitante","nome":"Início","rota":"/","completa":true},{"id":"V02","grupo":"Visitante","nome":"Início · escolher cidade","rota":"/ (folha)","completa":false},{"id":"V03","grupo":"Visitante","nome":"Busca","rota":"/search","completa":false},{"id":"V04","grupo":"Visitante","nome":"Busca · sugestões","rota":"/search","completa":false},{"id":"V05","grupo":"Visitante","nome":"Busca · resultados","rota":"/search","completa":false},{"id":"V06","grupo":"Visitante","nome":"Anúncios","rota":"/explore","completa":true},{"id":"V07","grupo":"Visitante","nome":"Anúncios · filtros","rota":"/explore (folha)","completa":false},{"id":"V08","grupo":"Visitante","nome":"Anúncios · ordenar","rota":"/explore (folha)","completa":false},{"id":"V09","grupo":"Visitante","nome":"Anúncio","rota":"/service/[id]","completa":true},{"id":"V10","grupo":"Visitante","nome":"Favoritos · vazio","rota":"/favorites","completa":false},{"id":"V11","grupo":"Visitante","nome":"Favoritos · com anúncios","rota":"/favorites","completa":true},{"id":"V12","grupo":"Visitante","nome":"Conta","rota":"/settings","completa":false},{"id":"V13","grupo":"Visitante","nome":"Entrar","rota":"/settings (folha)","completa":false},{"id":"V14","grupo":"Visitante","nome":"Meus anúncios · sem conta","rota":"/my-ads","completa":false},{"id":"V15","grupo":"Cadastro","nome":"Criar conta · seus dados","rota":"/register","completa":true},{"id":"V16","grupo":"Cadastro","nome":"Criar conta · confirmar e-mail","rota":"/account/verify-email","completa":false},{"id":"V17","grupo":"Cadastro","nome":"Esqueci a senha · e-mail","rota":"/forgot-password","completa":false},{"id":"V18","grupo":"Cadastro","nome":"Esqueci a senha · código e senha nova","rota":"/forgot-password","completa":false},{"id":"V19","grupo":"Cadastro","nome":"Completar cadastro (login social)","rota":"/complete-signup","completa":false},{"id":"P01","grupo":"Profissional","nome":"Meus anúncios","rota":"/my-ads","completa":true},{"id":"P02","grupo":"Profissional","nome":"Conta","rota":"/settings","completa":true},{"id":"P03","grupo":"Profissional","nome":"Perfil","rota":"/account/profile","completa":false},{"id":"P04","grupo":"Profissional","nome":"Saldo","rota":"/account/balance","completa":false},{"id":"P05","grupo":"Profissional","nome":"Desempenho do anúncio","rota":"/ads/dashboard","completa":true},{"id":"P06","grupo":"Profissional","nome":"Impulsionar anúncio","rota":"/ads/boost","completa":false},{"id":"P07","grupo":"Profissional","nome":"Publicar anúncio","rota":"/ads/publish","completa":false},{"id":"P08","grupo":"Profissional","nome":"Verificar e-mail","rota":"/account/verify-email","completa":false},{"id":"A01","grupo":"Novo anúncio","nome":"Novo anúncio · 1 de 5 · categoria","rota":"/ads/new","completa":false},{"id":"A02","grupo":"Novo anúncio","nome":"Novo anúncio · 2 de 5 · descrição","rota":"/ads/new","completa":false},{"id":"A03","grupo":"Novo anúncio","nome":"Novo anúncio · 3 de 5 · preço e área","rota":"/ads/new","completa":false},{"id":"A04","grupo":"Novo anúncio","nome":"Novo anúncio · 4 de 5 · fotos","rota":"/ads/new","completa":false},{"id":"A05","grupo":"Novo anúncio","nome":"Novo anúncio · 5 de 5 · revisão","rota":"/ads/new","completa":false},{"id":"A06","grupo":"Novo anúncio","nome":"Editar anúncio · rascunho","rota":"/ads/new?id=…","completa":false},{"id":"A07","grupo":"Novo anúncio","nome":"Editar anúncio · ativo (bloqueado)","rota":"/ads/new?id=…","completa":false}];
const CAPTURA = "Capturadas em 21/11/2026 da versão web do app (repositório conkat.app), com os dados de exemplo do próprio app (EXPO_PUBLIC_USE_MOCK), em 390 × 844 com densidade 2×. Visitante: sem login. Profissional: logado como o anunciante de exemplo. \"Tela inteira\" mostra a tela rolada até o fim. Nomes, preços e números são os dados de exemplo do app.";

const IS_SCRIPTER = typeof print === "function";
const log = (m) => { if (IS_SCRIPTER) print(m); };

(async () => {
  try {
    figma.notify(await main(), { timeout: 10000 });
  } catch (e) {
    figma.notify("Conkat: erro — " + (e && e.message ? e.message : e), { error: true, timeout: 12000 });
    log(e && e.stack ? e.stack : String(e));
    throw e;
  } finally {
    if (!IS_SCRIPTER) figma.closePlugin();
  }
})();

async function main() {
  const PAGE_NAME = "App atual (prints)";
  const W = 390;
  const GROUPS = ["Visitante", "Cadastro", "Profissional", "Novo anúncio"];
  const C = {
    ink: { r: 11 / 255, g: 43 / 255, b: 42 / 255 },
    muted: { r: 95 / 255, g: 102 / 255, b: 114 / 255 },
    accent: { r: 168 / 255, g: 90 / 255, b: 0 },
    bg: { r: 248 / 255, g: 249 / 255, b: 250 / 255 },
    border: { r: 229 / 255, g: 231 / 255, b: 235 / 255 },
  };

  // Fontes
  const fonts = await figma.listAvailableFontsAsync();
  const has = (s) => fonts.some((f) => f.fontName.family === "Inter" && f.fontName.style === s);
  const F = {
    regular: { family: "Inter", style: "Regular" },
    semibold: { family: "Inter", style: has("Semi Bold") ? "Semi Bold" : "SemiBold" },
    bold: { family: "Inter", style: "Bold" },
  };
  for (const f of Object.values(F)) await figma.loadFontAsync(f);

  // 1. Acha os prints soltos em qualquer página: nós com imagem cujo nome começa pelo código
  const byKey = {};
  const re = /^([VPA]\d{2})(?:.*?(\(completa\)|-completa))?/i;
  for (const p of figma.root.children) {
    await p.loadAsync();
    for (const n of p.findAll((x) => "fills" in x && Array.isArray(x.fills) && x.fills.some((f) => f.type === "IMAGE"))) {
      const m = re.exec(n.name);
      if (!m) continue;
      const key = m[1].toUpperCase() + (m[2] ? "-completa" : "");
      const img = n.fills.find((f) => f.type === "IMAGE");
      // Print já organizado numa rodada anterior: fica dentro de um quadro na página do script
      const loose = !(p.name === PAGE_NAME && n.parent && n.parent.type === "FRAME");
      if (!byKey[key] || (loose && !byKey[key].loose)) byKey[key] = { node: n, hash: img.imageHash, w: n.width, h: n.height, loose };
    }
  }
  const found = Object.keys(byKey).length;
  if (!found) throw new Error("Nenhum print encontrado. Arraste os arquivos de figma/app-atual/prints para o Figma e rode de novo.");

  // 2. Página nova (ou limpa)
  let page = figma.root.children.find((p) => p.name === PAGE_NAME);
  if (!page) { page = figma.createPage(); page.name = PAGE_NAME; }
  await figma.setCurrentPageAsync(page);
  const hashes = {};
  for (const [k, v] of Object.entries(byKey)) hashes[k] = { hash: v.hash, ratio: v.h / v.w };
  const old = [...page.children];

  function text(chars, font, size, color, width) {
    const t = figma.createText();
    t.fontName = font;
    t.characters = chars;
    t.fontSize = size;
    t.fills = [{ type: "SOLID", color }];
    if (width) { t.textAutoResize = "HEIGHT"; t.resize(width, t.height); }
    return t;
  }
  function screen(key, label) {
    const h = hashes[key];
    const height = Math.round(W * h.ratio);
    const f = figma.createFrame();
    f.name = label;
    f.resize(W, height);
    f.clipsContent = true;
    f.fills = [{ type: "SOLID", color: C.bg }];
    const r = figma.createRectangle();
    r.name = key;
    r.resize(W, height);
    r.fills = [{ type: "IMAGE", imageHash: h.hash, scaleMode: "FILL" }];
    f.appendChild(r);
    r.locked = true;
    return f;
  }

  // 3. Cabeçalho
  const head = figma.createFrame();
  head.name = "Sobre estes prints";
  head.layoutMode = "VERTICAL";
  head.itemSpacing = 8;
  head.paddingTop = head.paddingBottom = head.paddingLeft = head.paddingRight = 32;
  head.primaryAxisSizingMode = "AUTO";
  head.counterAxisSizingMode = "FIXED";
  head.resize(900, 10);
  head.cornerRadius = 20;
  head.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  head.strokes = [{ type: "SOLID", color: C.border }];
  page.appendChild(head);
  head.appendChild(text("Telas atuais do app Conkat", F.bold, 32, C.ink));
  head.appendChild(text(CAPTURA, F.regular, 16, C.muted, 836));
  head.x = 0; head.y = 0;

  // 4. Seções por grupo
  let y = head.height + 120;
  let placed = 0;
  const missing = [];
  for (const g of GROUPS) {
    const items = TELAS.filter((t) => t.grupo === g);
    if (!items.length) continue;
    const sec = figma.createSection();
    sec.name = g;
    page.appendChild(sec);
    sec.x = 0; sec.y = y;
    let x = 80, rowH = 0;
    for (const t of items) {
      const versions = [[t.id, `${t.id} · ${t.nome}`, "Tela"]];
      if (t.completa) versions.push([t.id + "-completa", `${t.id} · ${t.nome} (tela inteira)`, "Tela inteira, rolada até o fim"]);
      for (const [key, label, kind] of versions) {
        if (!hashes[key]) { missing.push(key); continue; }
        const lab = figma.createFrame();
        lab.name = "Rótulo " + key;
        lab.layoutMode = "VERTICAL";
        lab.itemSpacing = 4;
        lab.primaryAxisSizingMode = "AUTO";
        lab.counterAxisSizingMode = "FIXED";
        lab.resize(W, 10);
        lab.fills = [];
        sec.appendChild(lab);
        lab.appendChild(text(t.id + (key.endsWith("completa") ? " · tela inteira" : ""), F.bold, 14, C.accent));
        lab.appendChild(text(t.nome, F.semibold, 20, C.ink, W));
        lab.appendChild(text(t.rota + (kind !== "Tela" ? " · " + kind : ""), F.regular, 13, C.muted, W));
        lab.x = x; lab.y = 80;
        const fr = screen(key, label);
        sec.appendChild(fr);
        fr.x = x; fr.y = 80 + lab.height + 16;
        rowH = Math.max(rowH, lab.height + 16 + fr.height);
        x += W + 64;
        placed++;
      }
    }
    sec.resizeWithoutConstraints(x + 16, rowH + 160);
    y += sec.height + 120;
  }
  // Só agora tira o que é velho: a versão anterior desta página e os prints soltos
  for (const n of old) n.remove();
  for (const v of Object.values(byKey)) { try { if (v.loose && !v.node.removed) v.node.remove(); } catch (e) {} }
  figma.viewport.scrollAndZoomIntoView(page.children);

  const extra = Object.keys(hashes).filter((k) => !TELAS.some((t) => t.id === k || t.id + "-completa" === k));
  if (missing.length) log("Prints que faltaram: " + missing.join(", "));
  if (extra.length) log("Prints sem cadastro no script (ignorados): " + extra.join(", "));
  return `Conkat: ${placed} prints organizados em "${PAGE_NAME}"` + (missing.length ? ` (faltaram ${missing.length}: ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? "…" : ""})` : ".");
}
