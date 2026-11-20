// Conkat — Site v2
// Termina a versão desktop e cria a versão mobile no arquivo "Conkat — Site (esboço)".
//
// Como rodar (opção 1, mais simples): abra o arquivo no Figma, rode o plugin "Scripter",
// cole este arquivo inteiro e clique em ▶ (Run).
// Como rodar (opção 2): no Figma desktop, Plugins › Development › Import plugin from manifest…
// e escolha o manifest.json desta pasta.
//
// O script pode ser rodado mais de uma vez: ele apaga e recria só as partes que ele mesmo cria.

const IS_SCRIPTER = typeof print === "function";
const log = (m) => { if (IS_SCRIPTER) print(m); };

(async () => {
  try {
    await main();
    figma.notify("Conkat: site atualizado (desktop + mobile).");
  } catch (e) {
    figma.notify("Conkat: erro — " + (e && e.message ? e.message : e), { error: true, timeout: 10000 });
    log(e && e.stack ? e.stack : String(e));
    throw e;
  } finally {
    if (!IS_SCRIPTER) figma.closePlugin();
  }
})();

async function main() {
  // ---------------------------------------------------------------------------
  // Contexto: página, fontes, cores, estilos, componentes
  // ---------------------------------------------------------------------------
  const page = figma.root.children.find((p) => p.name === "Site — Desktop") || figma.currentPage;
  await figma.setCurrentPageAsync(page);

  for (const [family, style] of [
    ["Schibsted Grotesk", "SemiBold"], ["Schibsted Grotesk", "Bold"],
    ["Inter", "Regular"], ["Inter", "Medium"], ["Inter", "Semi Bold"],
  ]) await figma.loadFontAsync({ family, style });

  const V = {};
  for (const v of await figma.variables.getLocalVariablesAsync("COLOR")) if (v.name.startsWith("cor/")) V[v.name.slice(4)] = v;
  const pv = (k) => {
    if (!V[k]) throw new Error("Variável de cor não encontrada: cor/" + k);
    return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", V[k]);
  };
  const STY = {};
  for (const s of await figma.getLocalTextStylesAsync()) STY[s.name] = s.id;

  const COMP = {};
  for (const n of page.findAllWithCriteria({ types: ["COMPONENT", "COMPONENT_SET"] })) {
    if (n.type === "COMPONENT" && n.parent && n.parent.type === "COMPONENT_SET") continue;
    COMP[n.name] = n;
  }
  const comp = (name) => { if (!COMP[name]) throw new Error("Componente não encontrado: " + name); return COMP[name]; };

  const HASH = {
    eletricista: "176c5e362a19f12b0d3388c66c6c7dba76cf9e14",
    cozinha: "156137526c5a574326080b4b0551561777ed6371",
    encanador: "c7e126f36c013b72bb5c417d0383a209f8776c18",
    pintura: "302bcced831f0e486354975130e015a6f545c290",
    marina: "7c5e16dd165ea5dddf836d0d74693ff5d365637e",
  };
  const PAT = "883c7a6dd7dd4ce4685e622d4241d38f0803d789";

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  const AL = (dir, props = {}) => {
    const f = figma.createFrame();
    f.layoutMode = dir;
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "AUTO";
    f.fills = [];
    f.clipsContent = false;
    Object.assign(f, props);
    return f;
  };
  const fill = (p, c) => { p.appendChild(c); c.layoutSizingHorizontal = "FILL"; if (c.type === "TEXT") c.textAutoResize = "HEIGHT"; return c; };
  const pad = (f, t, r, b, l) => { f.paddingTop = t; f.paddingRight = r; f.paddingBottom = b; f.paddingLeft = l; return f; };
  const T = async (chars, style, color = "text", w) => {
    const t = figma.createText();
    if (!STY[style]) throw new Error("Estilo de texto não encontrado: " + style);
    await t.setTextStyleIdAsync(STY[style]);
    t.characters = chars;
    t.fills = [pv(color)];
    if (w) { t.resize(w, t.height); t.textAutoResize = "HEIGHT"; }
    return t;
  };
  const mk = (txt, size, lh, style, color) => {
    const t = figma.createText();
    t.fontName = { family: "Inter", style };
    t.characters = txt; t.fontSize = size; t.lineHeight = { unit: "PIXELS", value: lh };
    t.fills = [pv(color)];
    return t;
  };
  const disp = (txt, size, lh, color) => {
    const t = figma.createText();
    t.fontName = { family: "Schibsted Grotesk", style: "SemiBold" };
    t.characters = txt; t.fontSize = size; t.lineHeight = { unit: "PIXELS", value: lh };
    t.letterSpacing = { unit: "PERCENT", value: -2 }; t.fills = [pv(color)];
    return t;
  };
  const img = (n, h) => { n.fills = [{ type: "IMAGE", imageHash: HASH[h], scaleMode: "FILL" }]; return n; };
  const patternRect = (w, h, op, scale = 0.5) => {
    const r = figma.createRectangle(); r.name = "padrão da marca"; r.resize(w, h);
    r.fills = [{ type: "IMAGE", imageHash: PAT, scaleMode: "TILE", scalingFactor: scale, opacity: op }];
    return r;
  };
  const absolute = (parent, child, x, y) => { parent.appendChild(child); child.layoutPositioning = "ABSOLUTE"; child.x = x; child.y = y; return child; };
  const shadow = (a = 0.28, y = 32, r = 64) => [{ type: "DROP_SHADOW", color: { r: 0.02, g: 0.09, b: 0.09, a }, offset: { x: 0, y }, radius: r, spread: 0, visible: true, blendMode: "NORMAL" }];
  const icon = (k, color, size = 24) => {
    const i = comp("Ícone/" + k).createInstance();
    if (size !== 24) i.resize(size, size);
    if (color) for (const n of i.findAll((n) => "fills" in n && Array.isArray(n.fills) && n.fills.length)) n.fills = [pv(color)];
    return i;
  };
  const setP = (inst, obj) => {
    const props = inst.componentProperties; const out = {};
    for (const [n, v] of Object.entries(obj)) { const k = Object.keys(props).find((k) => k === n || k.startsWith(n + "#")); if (k) out[k] = v; }
    inst.setProperties(out); return inst;
  };
  const variant = (set, name) => { const v = set.children.find((c) => c.name === name); if (!v) throw new Error("Variante não encontrada: " + name); return v; };
  const btn = (tipo, label, seta = false) => setP(variant(comp("Botão"), "Tipo=" + tipo).createInstance(), { "Rótulo": label, "Seta": seta });
  const badge = (s) => variant(comp("Selo da loja"), "Loja=" + s).createInstance();
  const listing = (o, photo) => { const l = setP(comp("App/Card de anúncio").createInstance(), o); if (photo) img(l.findOne((n) => n.name === "foto"), photo); return l; };
  const chipCat = (n, ic) => setP(comp("Chip de categoria").createInstance(), { "Nome": n, "Ícone": comp("Ícone/" + ic).id });
  const featureCard = (title, desc, preview) => setP(comp("Card de recurso").createInstance(), { "Título": title, "Descrição": desc, "Prévia": comp("Prévia/" + preview).id });
  const arrow = (d) => variant(comp("Seta do carrossel"), "Direção=" + d).createInstance();
  const dots = (count) => { const d = comp("Paginação").createInstance(); d.children.forEach((c, i) => { c.visible = i < count; }); return d; };
  const faq = (q, a, open) => setP(variant(comp("Item de dúvida"), "Estado=" + (open ? "Aberto" : "Fechado")).createInstance(), { "Pergunta": q, "Resposta": a });
  const divider = (color = "border") => { const r = figma.createRectangle(); r.name = "divisória"; r.resize(100, 1); r.fills = [pv(color)]; return r; };
  const borderTop = (f, color) => { f.strokes = [pv(color)]; f.strokeTopWeight = 1; f.strokeBottomWeight = 0; f.strokeLeftWeight = 0; f.strokeRightWeight = 0; };

  // ---------------------------------------------------------------------------
  // Conteúdo
  // ---------------------------------------------------------------------------
  const CATS = [["Elétrica", "raio"], ["Hidráulica", "gota"], ["Limpeza", "vassoura"], ["Pintura", "pincel"], ["Reformas", "martelo"], ["Assistência técnica", "chave"]];
  const STEPS = [
    ["Escolha sua cidade", "O app sugere a cidade pela sua localização e mostra só as que já têm profissionais anunciando."],
    ["Busque o serviço", "Procure pelo que precisa ou navegue por categoria. Filtre por tipo de preço e ordene por preço ou mais recentes."],
    ["Chame no WhatsApp", "Veja fotos, preço e avaliações e fale direto com o profissional. O combinado é entre vocês."],
  ];
  const FEATURES = [
    ["Preço antes de chamar", "Cada anúncio mostra como o profissional cobra: valor fixo, a partir de, por hora, por dia ou a combinar.", "Preço"],
    ["Avaliações de quem contratou", "Nota de 1 a 5 em cada anúncio, com a média e a distribuição das notas. Anúncio sem avaliação não exibe nota.", "Avaliações"],
    ["Documento verificado", "O profissional pode enviar um documento para a nossa equipe conferir. Quem passa ganha o selo no perfil.", "Verificado"],
    ["Salve sem criar conta", "Guarde anúncios no próprio celular, organizados por cidade. Eles abrem mesmo sem internet.", "Favoritos"],
  ];
  const REVIEW = [
    ["Rascunho", "surface", "text", "Você preenche o anúncio no app, no seu tempo."],
    ["Em revisão", "accentSoft", "accentText", "Nossa equipe confere fotos, texto e categoria."],
    ["No ar", "primarySoft", "primary", "O anúncio passa a aparecer nas buscas da sua cidade."],
  ];
  const PRO = [
    ["megafone", "Anúncio em cinco passos", "Categoria, descrição, preço e área, fotos e revisão. O rascunho fica salvo enquanto você preenche."],
    ["raio", "Destaque nas buscas", "Impulsione o anúncio para ele aparecer antes dos outros na sua cidade, com o selo Destaque."],
    ["grafico", "Resultados à vista", "Veja quantas vezes o anúncio apareceu em buscas e quantas pessoas abriram."],
  ];
  const FAQ = [
    ["Preciso criar conta para contratar?", "Não. Quem procura serviço usa o app sem cadastro. Só o profissional que anuncia tem conta."],
    ["O Conkat cobra pelo serviço contratado?", "Não. Preço, horário e pagamento são combinados direto entre você e o profissional, pelo WhatsApp."],
    ["Como os anúncios são aprovados?", "Todo anúncio passa pela revisão da nossa equipe antes de ir ao ar. Se for recusado, o profissional recebe o motivo e pode corrigir."],
    ["Quanto custa anunciar?", "A primeira publicação é grátis por 14 dias, contados a partir da aprovação. Depois, você escolhe um plano e paga com o saldo da sua conta."],
    ["Em quais cidades funciona?", "O app mostra as cidades que já têm anúncios. Se a sua ainda não aparece, você pode ser o primeiro profissional a anunciar nela."],
  ];
  const FOOTER_COLS = [
    ["Conkat", ["Como funciona", "Para quem procura", "Dúvidas"]],
    ["Profissionais", ["Anunciar no Conkat", "Revisão de anúncios"]],
    ["Institucional", ["Termos de uso", "Política de privacidade", "Contato"]],
  ];

  // ---------------------------------------------------------------------------
  // Peças reutilizadas (celular, visuais dos passos, QR, card de métricas)
  // ---------------------------------------------------------------------------
  const tabBar = (active) => {
    const tb = AL("HORIZONTAL", { name: "Tab bar flutuante" });
    tb.fills = [pv("surface")]; tb.strokes = [pv("border")]; tb.strokeWeight = 1; tb.cornerRadius = 24;
    pad(tb, 8, 16, 8, 16); tb.primaryAxisSizingMode = "FIXED"; tb.resize(228, 54);
    tb.primaryAxisAlignItems = "SPACE_BETWEEN"; tb.counterAxisAlignItems = "CENTER"; tb.effects = shadow(0.08, 6, 16);
    for (const [lab, ic] of [["Início", "casa"], ["Anúncios", "busca"], ["Favoritos", "coracao"], ["Conta", "pin"]]) {
      const c = AL("VERTICAL", { itemSpacing: 2 }); c.counterAxisAlignItems = "CENTER";
      c.appendChild(icon(ic, lab === active ? "primary" : "textMuted", 18));
      c.appendChild(mk(lab, 9, 12, lab === active ? "Semi Bold" : "Medium", lab === active ? "primary" : "textMuted"));
      tb.appendChild(c);
    }
    return tb;
  };
  const phone = (name, build, tab) => {
    const p = AL("VERTICAL", { name: "Celular — " + name });
    pad(p, 9, 9, 9, 9); p.cornerRadius = 47;
    p.fills = [{ type: "SOLID", color: { r: 0.06, g: 0.07, b: 0.07 } }];
    p.strokes = [{ type: "SOLID", color: { r: 0.32, g: 0.37, b: 0.37 } }]; p.strokeWeight = 1.5; p.strokeAlign = "OUTSIDE";
    const s = AL("VERTICAL", { name: "Tela" }); p.appendChild(s);
    s.primaryAxisSizingMode = "FIXED"; s.counterAxisSizingMode = "FIXED"; s.resize(252, 540);
    s.cornerRadius = 38; s.fills = [pv("background")]; s.clipsContent = true; pad(s, 12, 12, 12, 12); s.itemSpacing = 12;
    absolute(s, patternRect(252, 540, 0.35, 0.3), 0, 0);
    const sb = AL("HORIZONTAL", { name: "Barra de status" }); fill(s, sb);
    sb.primaryAxisAlignItems = "SPACE_BETWEEN"; sb.counterAxisAlignItems = "CENTER"; sb.paddingLeft = sb.paddingRight = 10;
    sb.appendChild(mk("9:41", 11, 14, "Semi Bold", "text"));
    const isl = figma.createRectangle(); isl.name = "Dynamic Island"; isl.resize(76, 22); isl.cornerRadius = 11; isl.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }]; sb.appendChild(isl);
    const ind = figma.createNodeFromSvg('<svg width="38" height="10" viewBox="0 0 38 10" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="5" width="3" height="5" rx="1" fill="#1A1A1A"/><rect x="4.5" y="3.5" width="3" height="6.5" rx="1" fill="#1A1A1A"/><rect x="9" y="2" width="3" height="8" rx="1" fill="#1A1A1A"/><rect x="13.5" y="0" width="3" height="10" rx="1" fill="#1A1A1A"/><rect x="20" y=".5" width="16" height="9" rx="2.5" stroke="#1A1A1A" fill="none"/><rect x="21.5" y="2" width="11" height="6" rx="1.2" fill="#1A1A1A"/><rect x="36.6" y="3.5" width="1.4" height="3" rx=".7" fill="#1A1A1A"/></svg>');
    ind.name = "sinal e bateria"; sb.appendChild(ind);
    build(s);
    if (tab) absolute(s, tabBar(tab), 12, 540 - 54 - 14);
    return p;
  };
  const scrInicio = (s) => {
    const h = AL("HORIZONTAL"); fill(s, h); h.primaryAxisAlignItems = "SPACE_BETWEEN"; h.counterAxisAlignItems = "CENTER"; h.paddingLeft = h.paddingRight = 4;
    const brand = figma.createText(); brand.fontName = { family: "Schibsted Grotesk", style: "Bold" }; brand.characters = "Conkat"; brand.fontSize = 18; brand.letterSpacing = { unit: "PERCENT", value: -3 }; brand.fills = [pv("brand")]; h.appendChild(brand);
    const city = AL("HORIZONTAL", { itemSpacing: 4 }); city.fills = [pv("surface")]; city.strokes = [pv("border")]; city.strokeWeight = 1; city.cornerRadius = 100; pad(city, 5, 10, 5, 8); city.counterAxisAlignItems = "CENTER";
    city.appendChild(icon("pin", "primary", 12)); city.appendChild(mk("Joinville", 10, 14, "Semi Bold", "text")); city.appendChild(icon("caret", "textMuted", 10)); h.appendChild(city);
    const card = AL("VERTICAL", { name: "Bloco de busca", itemSpacing: 12 }); fill(s, card); card.fills = [pv("surface")]; card.cornerRadius = 22; pad(card, 16, 14, 14, 14); card.strokes = [pv("border")]; card.strokeWeight = 1;
    const q = disp("Qual eletricista você procura?", 20, 24, "text"); q.setRangeFills(5, 16, [pv("accentText")]); fill(card, q);
    const sf = AL("HORIZONTAL", { name: "Campo de busca", itemSpacing: 8 }); fill(card, sf); sf.fills = [pv("background")]; sf.cornerRadius = 100; pad(sf, 10, 12, 10, 12); sf.counterAxisAlignItems = "CENTER";
    sf.appendChild(icon("busca", "textMuted", 15)); sf.appendChild(mk("Buscar serviço", 11, 14, "Regular", "textMuted"));
    const sec = AL("HORIZONTAL"); fill(s, sec); sec.primaryAxisAlignItems = "SPACE_BETWEEN"; sec.paddingLeft = sec.paddingRight = 4;
    sec.appendChild(mk("Publicados agora", 12, 16, "Semi Bold", "text")); sec.appendChild(mk("Ver todos", 10, 16, "Semi Bold", "primary"));
    fill(s, listing({ "Título": "Encanador residencial", "Categoria": "Hidráulica · há 2 horas", "Preço": "A partir de R$ 120", "Nota": "4,8" }, "encanador"));
    fill(s, listing({ "Título": "Diarista — limpeza completa", "Categoria": "Limpeza · há 5 horas", "Preço": "R$ 180 por dia", "Nota": "4,9" }, "cozinha"));
    fill(s, listing({ "Título": "Pintura de apartamentos", "Categoria": "Pintura · há 1 dia", "Preço": "R$ 35 por m²", "Nota": "4,7" }, "pintura"));
  };
  const scrDetalhe = (s) => {
    const g = figma.createRectangle(); g.name = "galeria"; g.resize(228, 160); g.cornerRadius = 18; img(g, "cozinha"); s.appendChild(g);
    const row = AL("HORIZONTAL", { itemSpacing: 6 }); s.appendChild(row);
    for (const [t, bg] of [["Destaque", "accent"], ["Limpeza", "surface"]]) {
      const c = AL("HORIZONTAL"); c.fills = [pv(bg)]; c.cornerRadius = 100; pad(c, 4, 9, 4, 9);
      if (bg === "surface") { c.strokes = [pv("border")]; c.strokeWeight = 1; }
      c.appendChild(mk(t, 10, 13, "Semi Bold", "text")); row.appendChild(c);
    }
    fill(s, disp("Diarista — limpeza completa", 19, 23, "text"));
    fill(s, mk("R$ 180 por dia · Joinville", 12, 16, "Semi Bold", "primary"));
    const rb = AL("HORIZONTAL", { itemSpacing: 10 }); fill(s, rb); rb.counterAxisAlignItems = "CENTER"; rb.fills = [pv("surface")]; rb.cornerRadius = 16; pad(rb, 10, 12, 10, 12); rb.strokes = [pv("border")]; rb.strokeWeight = 1;
    const av = figma.createEllipse(); av.resize(34, 34); img(av, "marina"); rb.appendChild(av);
    const ac = AL("VERTICAL", { itemSpacing: 1 }); ac.appendChild(mk("Marina Souza", 12, 16, "Semi Bold", "text"));
    const vr = AL("HORIZONTAL", { itemSpacing: 3 }); vr.counterAxisAlignItems = "CENTER"; vr.appendChild(icon("selo", "primary", 11)); vr.appendChild(mk("Verificada", 10, 13, "Medium", "primary")); ac.appendChild(vr); fill(rb, ac);
    const sr = AL("HORIZONTAL", { itemSpacing: 2 }); sr.counterAxisAlignItems = "CENTER"; sr.appendChild(icon("estrela-fill", "accent", 12)); sr.appendChild(mk("4,9", 12, 16, "Semi Bold", "text")); rb.appendChild(sr);
    fill(s, mk("Limpeza completa de casas e apartamentos, com produtos inclusos. Atendo toda a zona norte.", 11, 16, "Regular", "textMuted"));
    const sp = AL("VERTICAL"); fill(s, sp); sp.layoutSizingVertical = "FILL";
    const wa = AL("HORIZONTAL", { name: "Chamar no WhatsApp", itemSpacing: 8 }); fill(s, wa); wa.fills = [pv("primary")]; wa.cornerRadius = 100; wa.paddingTop = wa.paddingBottom = 13; wa.primaryAxisAlignItems = "CENTER"; wa.counterAxisAlignItems = "CENTER";
    wa.appendChild(icon("whatsapp", "textOnDark", 18)); wa.appendChild(mk("Chamar no WhatsApp", 13, 18, "Semi Bold", "textOnDark"));
  };
  const floatingRating = () => {
    const fl = AL("HORIZONTAL", { name: "Flutuante — avaliação", itemSpacing: 12 });
    fl.fills = [pv("surface")]; fl.cornerRadius = 20; pad(fl, 12, 18, 12, 14); fl.counterAxisAlignItems = "CENTER"; fl.effects = shadow(0.3, 20, 48);
    const fav = figma.createEllipse(); fav.resize(40, 40); img(fav, "marina"); fl.appendChild(fav);
    const col = AL("VERTICAL", { itemSpacing: 2 }); const r = AL("HORIZONTAL", { itemSpacing: 2 }); r.counterAxisAlignItems = "CENTER";
    for (let i = 0; i < 5; i++) r.appendChild(icon("estrela-fill", "accent", 13));
    r.appendChild(mk("  4,9", 12, 16, "Semi Bold", "text")); col.appendChild(r); col.appendChild(mk("Marina Souza · 23 avaliações", 11, 15, "Regular", "textMuted")); fl.appendChild(col);
    return fl;
  };
  const sheet = (w) => { const f = AL("VERTICAL", { name: "Folha" }); f.fills = [pv("surface")]; f.cornerRadius = 20; f.effects = shadow(0.12, 16, 40); f.counterAxisSizingMode = "FIXED"; f.resize(w, 10); f.primaryAxisSizingMode = "AUTO"; return f; };
  const stepVisual = [
    (w) => {
      const sh = sheet(w); const hd = AL("HORIZONTAL"); fill(sh, hd); pad(hd, 16, 18, 10, 18); hd.appendChild(mk("Escolha a cidade", 14, 18, "Semi Bold", "text"));
      for (const [c, on] of [["Joinville, SC", true], ["Araquari, SC", false], ["Jaraguá do Sul, SC", false], ["São Francisco do Sul, SC", false]]) {
        const r = AL("HORIZONTAL", { itemSpacing: 10 }); fill(sh, r); pad(r, 11, 18, 11, 18); r.counterAxisAlignItems = "CENTER"; borderTop(r, "border");
        r.appendChild(icon("pin", on ? "primary" : "textMuted", 16)); fill(r, mk(c, 13, 18, on ? "Semi Bold" : "Regular", "text")); if (on) r.appendChild(icon("check", "primary", 16));
      }
      return sh;
    },
    (w) => {
      const col = AL("VERTICAL", { name: "Busca", itemSpacing: 10 }); col.counterAxisSizingMode = "FIXED"; col.resize(w, 10); col.primaryAxisSizingMode = "AUTO";
      const sf = AL("HORIZONTAL", { itemSpacing: 8 }); fill(col, sf); sf.fills = [pv("surface")]; sf.cornerRadius = 100; pad(sf, 12, 14, 12, 14); sf.counterAxisAlignItems = "CENTER"; sf.effects = shadow(0.1, 10, 24); sf.strokes = [pv("primary")]; sf.strokeWeight = 1.5;
      sf.appendChild(icon("busca", "text", 16)); sf.appendChild(mk("eletricista", 13, 18, "Medium", "text"));
      col.appendChild(mk("8 resultados em Joinville", 11, 16, "Medium", "textMuted"));
      fill(col, listing({ "Título": "Eletricista residencial", "Categoria": "Elétrica · há 3 horas", "Preço": "A partir de R$ 90", "Nota": "4,8" }, "encanador"));
      fill(col, listing({ "Título": "Instalação de chuveiro", "Categoria": "Elétrica · há 1 dia", "Preço": "R$ 120 fixo", "Nota": "5,0" }, "pintura"));
      return col;
    },
    (w) => {
      const sh = sheet(w); pad(sh, 14, 14, 14, 14); sh.itemSpacing = 12;
      const top = AL("HORIZONTAL", { itemSpacing: 12 }); fill(sh, top); top.counterAxisAlignItems = "CENTER";
      const ph = figma.createRectangle(); ph.resize(56, 56); ph.cornerRadius = 12; img(ph, "cozinha"); top.appendChild(ph);
      const tc = AL("VERTICAL", { itemSpacing: 2 }); fill(top, tc); fill(tc, mk("Diarista — limpeza completa", 13, 17, "Semi Bold", "text")); tc.appendChild(mk("R$ 180 por dia", 12, 16, "Semi Bold", "primary"));
      const wa = AL("HORIZONTAL", { itemSpacing: 8 }); fill(sh, wa); wa.fills = [pv("primary")]; wa.cornerRadius = 100; wa.paddingTop = wa.paddingBottom = 13; wa.primaryAxisAlignItems = "CENTER"; wa.counterAxisAlignItems = "CENTER";
      wa.appendChild(icon("whatsapp", "textOnDark", 18)); wa.appendChild(mk("Chamar no WhatsApp", 13, 18, "Semi Bold", "textOnDark"));
      return sh;
    },
  ];
  const stepCard = async (i, width, visH, contentW) => {
    const c = AL("VERTICAL", { name: "Passo " + (i + 1) }); c.fills = [pv("surface")]; c.cornerRadius = 28; c.strokes = [pv("border")]; c.strokeWeight = 1; c.strokeAlign = "INSIDE"; c.clipsContent = true;
    c.counterAxisSizingMode = "FIXED"; c.resize(width, 10); c.primaryAxisSizingMode = "AUTO";
    const vis = figma.createFrame(); vis.name = "Visual"; fill(c, vis); vis.resize(width, visH); vis.fills = [pv("primarySoft")]; vis.clipsContent = true;
    vis.appendChild(patternRect(width, visH, 0.18, 0.3));
    const v = stepVisual[i](contentW); vis.appendChild(v); v.x = Math.round((width - v.width) / 2); v.y = 40;
    const tx = AL("VERTICAL", { name: "Texto", itemSpacing: 10 }); fill(c, tx); pad(tx, 28, 28, 32, 28);
    tx.appendChild(await T("Passo " + (i + 1), "Rótulo/S", "accentText")); fill(tx, await T(STEPS[i][0], "Título/3")); fill(tx, await T(STEPS[i][1], "Texto/M", "textMuted"));
    return c;
  };
  const metricsCard = (w) => {
    const m = AL("VERTICAL", { name: "Card de métricas", itemSpacing: 14 }); m.fills = [pv("surface")]; m.cornerRadius = 20; pad(m, 20, 20, 20, 20); m.effects = shadow(0.35, 24, 48);
    m.counterAxisSizingMode = "FIXED"; m.resize(w, 10); m.primaryAxisSizingMode = "AUTO";
    m.appendChild(mk("Seu anúncio · últimos 7 dias", 12, 16, "Medium", "textMuted"));
    const r = AL("HORIZONTAL", { itemSpacing: 24 }); fill(m, r);
    for (const [n, l] of [["1.284", "exibições em buscas"], ["312", "visitas ao anúncio"]]) { const c = AL("VERTICAL", { itemSpacing: 2 }); c.appendChild(disp(n, 26, 30, "text")); c.appendChild(mk(l, 11, 15, "Regular", "textMuted")); r.appendChild(c); }
    const ch = figma.createNodeFromSvg(`<svg width="${w - 40}" height="56" viewBox="0 0 260 56" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 55.5H260" stroke="#E5E7EB"/><path d="M0 44 L37 38 L74 41 L111 29 L148 31 L185 18 L222 14 L260 6" stroke="#0B7A75" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 50 L37 48 L74 49 L111 44 L148 45 L185 40 L222 38 L260 35" stroke="#FDA333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    ch.name = "gráfico"; fill(m, ch);
    return m;
  };
  const qr = (size) => {
    const N = 25, cell = size / N; let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const finder = (x, y) => `<rect x="${x * cell}" y="${y * cell}" width="${7 * cell}" height="${7 * cell}" fill="#0B2B2A"/><rect x="${(x + 1) * cell}" y="${(y + 1) * cell}" width="${5 * cell}" height="${5 * cell}" fill="#fff"/><rect x="${(x + 2) * cell}" y="${(y + 2) * cell}" width="${3 * cell}" height="${3 * cell}" fill="#0B2B2A"/>`;
    const inF = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
    let b = "";
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inF(x, y) && rnd() > 0.52) b += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="#0B2B2A"/>`;
    const n = figma.createNodeFromSvg(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${b}${finder(0, 0)}${finder(N - 7, 0)}${finder(0, N - 7)}</svg>`);
    n.name = "QR code (provisório — trocar pelo link real)"; return n;
  };
  const reviewTimeline = async (w) => {
    const col = AL("VERTICAL", { name: "Etapas da revisão" }); col.counterAxisSizingMode = "FIXED"; col.resize(w, 10); col.primaryAxisSizingMode = "AUTO";
    for (const [st, bg, fg, d] of REVIEW) {
      const r = AL("HORIZONTAL", { itemSpacing: 16 }); fill(col, r); pad(r, 20, 0, 20, 0); borderTop(r, "border");
      const chip = AL("HORIZONTAL"); chip.fills = [pv(bg)]; chip.cornerRadius = 100; pad(chip, 6, 12, 6, 12); if (bg === "surface") { chip.strokes = [pv("border")]; chip.strokeWeight = 1; chip.strokeAlign = "INSIDE"; }
      chip.appendChild(mk(st, 13, 18, "Semi Bold", fg)); r.appendChild(chip);
      fill(r, await T(d, "Texto/M", "textMuted"));
    }
    return col;
  };
  const proList = async () => {
    const list = AL("VERTICAL", { name: "Recursos" });
    for (const [ic, t, d] of PRO) {
      const r = AL("HORIZONTAL", { itemSpacing: 16 }); fill(list, r); pad(r, 22, 0, 22, 0); borderTop(r, "inkSoft");
      r.appendChild(icon(ic, "accent", 24));
      const c = AL("VERTICAL", { itemSpacing: 6 }); fill(r, c); fill(c, await T(t, "Título/4", "textOnDark")); fill(c, await T(d, "Texto/M", "textOnDarkMuted"));
    }
    return list;
  };
  const offerBox = async () => {
    const o = AL("HORIZONTAL", { name: "Oferta", itemSpacing: 16 }); o.fills = [pv("inkSoft")]; o.cornerRadius = 20; pad(o, 22, 24, 22, 22); o.counterAxisAlignItems = "CENTER";
    o.appendChild(icon("presente", "accent", 28));
    const c = AL("VERTICAL", { itemSpacing: 4 }); fill(o, c);
    fill(c, await T("Primeira publicação grátis por 14 dias", "Título/4", "textOnDark"));
    fill(c, await T("O prazo começa a contar quando o anúncio é aprovado.", "Texto/S", "textOnDarkMuted"));
    return o;
  };

  // ---------------------------------------------------------------------------
  // 1. Desktop: correções
  // ---------------------------------------------------------------------------
  const W = page.findOne((n) => n.type === "FRAME" && n.name === "Site Conkat — Desktop");
  if (!W) throw new Error('Não encontrei o quadro "Site Conkat — Desktop".');
  const hero = W.children.find((n) => n.name === "Hero");
  if (hero) {
    const headline = hero.findOne((n) => n.type === "TEXT" && n.characters.startsWith("Ache quem"));
    if (headline) { headline.characters = "Ache quem resolve,\nperto de você."; headline.resize(680, headline.height); headline.textAutoResize = "HEIGHT"; }
    const fl = hero.findOne((n) => n.name === "Flutuante — avaliação"); if (fl) { fl.x = 612; fl.y = 690; }
  }
  const step2 = W.findOne((n) => n.name === "Passo 2");
  if (step2) {
    const vis = step2.findOne((n) => n.name === "Visual");
    const col = vis && vis.children.find((c) => c.name !== "padrão da marca");
    if (col && col.type === "FRAME") { col.primaryAxisSizingMode = "AUTO"; col.x = Math.round((vis.width - col.width) / 2); col.y = 40; }
  }
  const catSec = W.children.find((n) => n.name === "Categorias");
  if (catSec) { const chips = catSec.children[1]; while (chips && chips.children.length > CATS.length) chips.children[chips.children.length - 1].remove(); }

  // ---------------------------------------------------------------------------
  // 2. Desktop: seções restantes
  // ---------------------------------------------------------------------------
  const NEW = ["Para quem procura", "Revisão", "Para profissionais", "Dúvidas", "Chamada final", "Rodapé"];
  for (const c of [...W.children]) if (NEW.includes(c.name)) c.remove();
  const section = (name, bg, t, r, b, l, gap = 64) => { const s = AL("VERTICAL", { name, itemSpacing: gap }); fill(W, s); pad(s, t, r, b, l); if (bg) s.fills = [pv(bg)]; return s; };

  // Para quem procura (carrossel)
  {
    const s = section("Para quem procura", "surface", 136, 0, 136, 120, 56);
    const head = AL("HORIZONTAL", { name: "Cabeçalho" }); fill(s, head); head.paddingRight = 120; head.primaryAxisAlignItems = "SPACE_BETWEEN"; head.counterAxisAlignItems = "MAX";
    const hc = AL("VERTICAL", { itemSpacing: 20 }); head.appendChild(hc);
    hc.appendChild(await T("Escolha com calma.\nChame com confiança.", "Título/1", "text", 620));
    hc.appendChild(await T("Tudo o que importa para decidir aparece no anúncio, antes de você mandar a primeira mensagem.", "Texto/L", "textMuted", 520));
    const ar = AL("HORIZONTAL", { name: "Setas", itemSpacing: 12 }); ar.appendChild(arrow("Anterior")); ar.appendChild(arrow("Próximo")); head.appendChild(ar);
    const track = AL("HORIZONTAL", { name: "Carrossel", itemSpacing: 24 }); fill(s, track); track.clipsContent = true;
    for (const [t, d, p] of FEATURES) track.appendChild(featureCard(t, d, p));
    s.appendChild(dots(4));
  }
  // Revisão
  {
    const s = section("Revisão", "background", 136, 120, 136, 120);
    const row = AL("HORIZONTAL", { name: "Conteúdo" }); fill(s, row); row.primaryAxisAlignItems = "SPACE_BETWEEN"; row.counterAxisAlignItems = "MAX";
    const l = AL("VERTICAL", { itemSpacing: 24 }); row.appendChild(l);
    l.appendChild(await T("Revisão de anúncios", "Rótulo/M", "accentText"));
    l.appendChild(await T("Nenhum anúncio vai ao ar sem passar por uma pessoa da nossa equipe.", "Display/L", "text", 680));
    l.appendChild(await T("Se algo estiver fora das regras, o profissional recebe o motivo e pode corrigir antes de reenviar.", "Texto/L", "textMuted", 520));
    row.appendChild(await reviewTimeline(420));
  }
  // Para profissionais
  {
    const s = section("Para profissionais", "ink", 136, 120, 136, 120);
    const row = AL("HORIZONTAL", { name: "Conteúdo", itemSpacing: 96 }); fill(s, row); row.counterAxisAlignItems = "CENTER";
    const photo = figma.createFrame(); photo.name = "Foto"; photo.resize(520, 660); photo.cornerRadius = 32; img(photo, "eletricista"); photo.clipsContent = true; row.appendChild(photo);
    const mc = metricsCard(300); photo.appendChild(mc); mc.x = 24; mc.y = 660 - 24 - mc.height;
    const c = AL("VERTICAL", { itemSpacing: 32 }); fill(row, c);
    const hd = AL("VERTICAL", { itemSpacing: 20 }); fill(c, hd);
    hd.appendChild(await T("Para profissionais", "Rótulo/M", "accent"));
    fill(hd, await T("Seja encontrado por quem precisa do seu serviço.", "Título/1", "textOnDark"));
    fill(hd, await T("Anuncie pelo app, acompanhe os resultados e decida quando aparecer em destaque.", "Texto/L", "textOnDarkMuted"));
    fill(c, await proList());
    fill(c, await offerBox());
    const cta = AL("HORIZONTAL", { itemSpacing: 20 }); cta.counterAxisAlignItems = "CENTER"; c.appendChild(cta);
    cta.appendChild(btn("Destaque", "Quero anunciar", true)); cta.appendChild(await T("O cadastro é feito no app.", "Texto/S", "textOnDarkMuted"));
  }
  // Dúvidas
  {
    const s = section("Dúvidas", "background", 136, 120, 136, 120);
    const row = AL("HORIZONTAL", { name: "Conteúdo" }); fill(s, row); row.primaryAxisAlignItems = "SPACE_BETWEEN";
    const l = AL("VERTICAL", { itemSpacing: 20 }); row.appendChild(l);
    l.appendChild(await T("Perguntas frequentes", "Título/1", "text", 400));
    l.appendChild(await T("Não encontrou o que procurava?", "Texto/M", "textMuted"));
    const link = AL("HORIZONTAL", { itemSpacing: 8 }); link.counterAxisAlignItems = "CENTER"; link.appendChild(await T("Fale com a gente", "Rótulo/M", "primary")); link.appendChild(icon("seta", "primary", 18)); l.appendChild(link);
    const list = AL("VERTICAL", { name: "Lista" }); list.counterAxisSizingMode = "FIXED"; list.resize(680, 10); list.primaryAxisSizingMode = "AUTO"; borderTop(list, "border"); row.appendChild(list);
    FAQ.forEach(([q, a], i) => fill(list, faq(q, a, i === 0)));
  }
  // Chamada final
  {
    const s = section("Chamada final", "background", 0, 120, 120, 120);
    const card = AL("HORIZONTAL", { name: "Card" }); fill(s, card); card.fills = [pv("primary")]; card.cornerRadius = 40; pad(card, 72, 72, 72, 72); card.clipsContent = true; card.primaryAxisAlignItems = "SPACE_BETWEEN"; card.counterAxisAlignItems = "CENTER";
    absolute(card, patternRect(1200, 420, 0.12, 0.5), 0, 0);
    const l = AL("VERTICAL", { itemSpacing: 24 }); card.appendChild(l);
    l.appendChild(await T("Baixe o Conkat e resolva ainda hoje.", "Display/L", "textOnDark", 600));
    l.appendChild(await T("Grátis para iPhone e Android.", "Texto/L", "textOnDark"));
    const bd = AL("HORIZONTAL", { itemSpacing: 12 }); bd.appendChild(badge("App Store")); bd.appendChild(badge("Google Play")); l.appendChild(bd);
    const q = AL("VERTICAL", { name: "QR", itemSpacing: 12 }); q.fills = [pv("surface")]; q.cornerRadius = 24; pad(q, 20, 20, 18, 20); q.counterAxisAlignItems = "CENTER";
    q.appendChild(qr(160)); q.appendChild(await T("Aponte a câmera do celular", "Texto/S", "textMuted")); card.appendChild(q);
  }
  // Rodapé
  const footer = async (container, mobile) => {
    const s = AL("VERTICAL", { name: "Rodapé", itemSpacing: mobile ? 32 : 48 }); fill(container, s); s.fills = [pv("ink")];
    if (mobile) pad(s, 56, 24, 40, 24); else pad(s, 80, 120, 40, 120);
    const top = AL(mobile ? "VERTICAL" : "HORIZONTAL", { itemSpacing: mobile ? 32 : 0 }); fill(s, top); if (!mobile) top.primaryAxisAlignItems = "SPACE_BETWEEN";
    const b = AL("VERTICAL", { itemSpacing: 10 }); top.appendChild(b); b.appendChild(await T("Conkat", "Marca", "textOnDark")); b.appendChild(await T("Serviços locais, direto no WhatsApp.", "Texto/S", "textOnDarkMuted", 260));
    const cols = AL("HORIZONTAL", { itemSpacing: mobile ? 32 : 80 }); top.appendChild(cols); if (mobile) { cols.layoutWrap = "WRAP"; cols.counterAxisSpacing = 32; cols.layoutSizingHorizontal = "FILL"; }
    for (const [t, ls] of FOOTER_COLS) { const c = AL("VERTICAL", { itemSpacing: 12 }); c.appendChild(await T(t, "Rótulo/M", "textOnDark")); for (const l of ls) c.appendChild(await T(l, "Texto/S", "textOnDarkMuted")); cols.appendChild(c); }
    fill(s, divider("inkSoft"));
    const bot = AL(mobile ? "VERTICAL" : "HORIZONTAL", { itemSpacing: 8 }); fill(s, bot); if (!mobile) bot.primaryAxisAlignItems = "SPACE_BETWEEN";
    bot.appendChild(await T("© 2026 Conkat. Todos os direitos reservados.", "Texto/S", "textOnDarkMuted"));
    bot.appendChild(await T("CNPJ 00.000.000/0001-00 (provisório)", "Texto/S", "textOnDarkMuted"));
  };
  await footer(W, false);

  // ---------------------------------------------------------------------------
  // 3. Mobile (390 px)
  // ---------------------------------------------------------------------------
  for (const n of [...page.children]) if (n.name === "Site Conkat — Mobile") n.remove();
  const M = AL("VERTICAL", { name: "Site Conkat — Mobile" }); page.appendChild(M);
  M.counterAxisSizingMode = "FIXED"; M.resize(390, 100); M.primaryAxisSizingMode = "AUTO"; M.fills = [pv("background")]; M.clipsContent = true; M.x = W.x + W.width + 200; M.y = 0;
  const msec = (name, bg, t, r, b, l, gap = 36) => { const s = AL("VERTICAL", { name, itemSpacing: gap }); fill(M, s); pad(s, t, r, b, l); if (bg) s.fills = [pv(bg)]; return s; };
  const carousel = (parent, name, items, gap = 16) => { const tr = AL("HORIZONTAL", { name, itemSpacing: gap }); fill(parent, tr); tr.clipsContent = true; tr.paddingRight = 24; for (const it of items) tr.appendChild(it); return tr; };

  // Hero
  {
    const h = AL("VERTICAL", { name: "Hero" }); fill(M, h); h.fills = [pv("ink")]; h.clipsContent = true;
    absolute(h, patternRect(390, 1200, 0.07, 0.5), 0, 0);
    const nav = AL("HORIZONTAL", { name: "Menu" }); fill(h, nav); pad(nav, 16, 24, 8, 24); nav.primaryAxisAlignItems = "SPACE_BETWEEN"; nav.counterAxisAlignItems = "CENTER";
    nav.appendChild(await T("Conkat", "Marca", "textOnDark"));
    const mb = AL("HORIZONTAL", { name: "Botão de menu" }); mb.primaryAxisSizingMode = "FIXED"; mb.counterAxisSizingMode = "FIXED"; mb.resize(44, 44); mb.cornerRadius = 100; mb.fills = [pv("inkSoft")]; mb.primaryAxisAlignItems = "CENTER"; mb.counterAxisAlignItems = "CENTER"; mb.appendChild(icon("menu", "textOnDark", 20)); nav.appendChild(mb);
    const tx = AL("VERTICAL", { name: "Texto", itemSpacing: 22 }); fill(h, tx); pad(tx, 40, 24, 32, 24);
    fill(tx, await T("Ache quem resolve, perto de você.", "Mobile/Display", "textOnDark"));
    fill(tx, await T("Eletricistas, diaristas, encanadores e outros profissionais da sua cidade num só app. Compare preço e avaliações e chame direto no WhatsApp, sem criar conta.", "Texto/M", "textOnDarkMuted"));
    const bd = AL("HORIZONTAL", { name: "Lojas", itemSpacing: 10 }); bd.appendChild(badge("App Store")); bd.appendChild(badge("Google Play")); tx.appendChild(bd);
    const meta = AL("HORIZONTAL", { itemSpacing: 8 }); meta.counterAxisAlignItems = "CENTER"; meta.appendChild(icon("check", "accent", 16)); meta.appendChild(await T("Grátis para quem procura serviço", "Texto/S", "textOnDarkMuted")); tx.appendChild(meta);
    const stage = figma.createFrame(); stage.name = "Celulares"; stage.fills = []; stage.clipsContent = true; fill(h, stage); stage.resize(390, 470);
    const pB = phone("Anúncio", scrDetalhe, null); stage.appendChild(pB); pB.rescale(0.92); pB.x = 214; pB.y = 92;
    const pA = phone("Início", scrInicio, "Início"); stage.appendChild(pA); pA.x = 34; pA.y = 24; pA.effects = shadow(0.45, 30, 60);
    const f = floatingRating(); stage.appendChild(f); f.x = 150; f.y = 360;
  }
  // Categorias
  {
    const s = msec("Categorias", "surface", 28, 0, 28, 24, 14); s.strokes = [pv("border")]; s.strokeTopWeight = 0; s.strokeLeftWeight = 0; s.strokeRightWeight = 0; s.strokeBottomWeight = 1;
    s.appendChild(await T("Serviços para a casa e o dia a dia", "Rótulo/S", "textMuted"));
    carousel(s, "Chips (rolagem lateral)", CATS.map(([n, ic]) => chipCat(n, ic)), 8);
  }
  // Como funciona
  {
    const s = msec("Como funciona", "background", 80, 0, 80, 24, 32);
    const hd = AL("VERTICAL", { itemSpacing: 14 }); fill(s, hd); hd.paddingRight = 24;
    fill(hd, await T("Do problema ao contato em três passos.", "Mobile/Título"));
    fill(hd, await T("Sem cadastro e sem intermediário. Você encontra quem resolve e combina tudo direto com o profissional.", "Texto/M", "textMuted"));
    const cards = []; for (let i = 0; i < 3; i++) cards.push(await stepCard(i, 304, 248, 240));
    carousel(s, "Carrossel", cards);
    s.appendChild(dots(3));
  }
  // Para quem procura
  {
    const s = msec("Para quem procura", "surface", 80, 0, 80, 24, 32);
    const hd = AL("VERTICAL", { itemSpacing: 14 }); fill(s, hd); hd.paddingRight = 24;
    fill(hd, await T("Escolha com calma. Chame com confiança.", "Mobile/Título"));
    fill(hd, await T("Tudo o que importa para decidir aparece no anúncio, antes da primeira mensagem.", "Texto/M", "textMuted"));
    const cards = FEATURES.map(([t, d, p]) => { const c = featureCard(t, d, p); c.resize(304, c.height); c.primaryAxisSizingMode = "AUTO"; return c; });
    carousel(s, "Carrossel", cards);
    s.appendChild(dots(4));
  }
  // Revisão
  {
    const s = msec("Revisão", "background", 80, 24, 80, 24, 24);
    s.appendChild(await T("Revisão de anúncios", "Rótulo/M", "accentText"));
    fill(s, await T("Nenhum anúncio vai ao ar sem passar por uma pessoa da nossa equipe.", "Mobile/Título"));
    fill(s, await T("Se algo estiver fora das regras, o profissional recebe o motivo e pode corrigir antes de reenviar.", "Texto/M", "textMuted"));
    fill(s, await reviewTimeline(342));
  }
  // Para profissionais
  {
    const s = msec("Para profissionais", "ink", 80, 24, 80, 24, 28);
    s.appendChild(await T("Para profissionais", "Rótulo/M", "accent"));
    fill(s, await T("Seja encontrado por quem precisa do seu serviço.", "Mobile/Título", "textOnDark"));
    fill(s, await T("Anuncie pelo app, acompanhe os resultados e decida quando aparecer em destaque.", "Texto/M", "textOnDarkMuted"));
    const photo = figma.createFrame(); photo.name = "Foto"; fill(s, photo); photo.resize(342, 420); photo.cornerRadius = 24; img(photo, "eletricista"); photo.clipsContent = true;
    const mc = metricsCard(262); photo.appendChild(mc); mc.x = 16; mc.y = 420 - 16 - mc.height;
    fill(s, await proList());
    fill(s, await offerBox());
    const b = btn("Destaque", "Quero anunciar", true); fill(s, b);
    s.appendChild(await T("O cadastro é feito no app.", "Texto/S", "textOnDarkMuted"));
  }
  // Dúvidas
  {
    const s = msec("Dúvidas", "background", 80, 24, 80, 24, 24);
    fill(s, await T("Perguntas frequentes", "Mobile/Título"));
    const list = AL("VERTICAL", { name: "Lista" }); fill(s, list); borderTop(list, "border");
    FAQ.forEach(([q, a], i) => fill(list, faq(q, a, i === 0)));
    const link = AL("HORIZONTAL", { itemSpacing: 8 }); link.counterAxisAlignItems = "CENTER"; link.appendChild(await T("Fale com a gente", "Rótulo/M", "primary")); link.appendChild(icon("seta", "primary", 18)); s.appendChild(link);
  }
  // Chamada final
  {
    const s = msec("Chamada final", "background", 0, 24, 80, 24, 0);
    const card = AL("VERTICAL", { name: "Card", itemSpacing: 20 }); fill(s, card); card.fills = [pv("primary")]; card.cornerRadius = 32; pad(card, 40, 28, 40, 28); card.clipsContent = true;
    absolute(card, patternRect(342, 400, 0.12, 0.5), 0, 0);
    fill(card, await T("Baixe o Conkat e resolva ainda hoje.", "Mobile/Título", "textOnDark"));
    card.appendChild(await T("Grátis para iPhone e Android.", "Texto/M", "textOnDark"));
    const bd = AL("VERTICAL", { itemSpacing: 10 }); bd.appendChild(badge("App Store")); bd.appendChild(badge("Google Play")); card.appendChild(bd);
  }
  await footer(M, true);

  figma.viewport.scrollAndZoomIntoView([W, M]);
  log("Desktop: " + Math.round(W.height) + " px · Mobile: " + Math.round(M.height) + " px");
}
