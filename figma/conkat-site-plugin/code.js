// Conkat — Site v5 (logo 2B aplicada)
// Refaz as versões desktop e mobile do site no arquivo "Conkat — Site (esboço)",
// com o texto validado contra o app, a API e as notas do projeto
// (ver figma/AUDITORIA-COPY.md). Usa as cores, estilos, componentes e fotos que já
// estão no arquivo.
//
// Como rodar: abra o arquivo no Figma, rode o plugin "Scripter", cole este arquivo
// inteiro e clique em Run. Pode ser rodado mais de uma vez.

// Troque para true quando o app estiver publicado na App Store e no Google Play.
// Enquanto for false, o site não mostra os selos das lojas nem "Baixar o app".
const APP_LIVE = false;

// Logo escolhida: variação 2B (Con em Ahellya itálica + kat_ em Unageo Bold, cursor laranja).
// Em contornos: cores #0B2B2A (letras) e #FDA333 (cursor).
const LOGO_2B = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"509\" height=\"120\" viewBox=\"-4.5 -164.7 736.4 173.5\"><path d=\"M116.3 -136Q111.7 -143.4 103.1 -147.3Q94.5 -151.2 81.7 -151.2Q61.2 -151.2 45.2 -136.4Q29.1 -121.6 23.6 -84.3Q22.7 -75.8 22.3 -68.5Q22.2 -67.5 22.2 -66.4Q22.2 -59.3 24.6 -46.3Q27.2 -31.5 39 -18.5Q50.8 -5.5 70.8 -5.5Q98.6 -7.1 114.3 -24L119.7 -19.1Q99.3 1.6 68.3 1.6Q38.9 1.6 21.3 -15.5Q3.6 -32.6 2 -61.3Q2.1 -68.2 2.7 -74.8Q3.4 -81.7 4.7 -88.3Q12 -117.1 33.4 -137.7Q54.8 -158.3 84.2 -158.3Q104.4 -158.3 116.7 -153Q129 -147.8 133.7 -143.6L123.7 -111.9H113.9Z\" fill=\"#0B2B2A\"/><path d=\"M183.8 -4.3Q199.6 -4.3 209.2 -19.8Q216.4 -31.4 218 -47.7Q218.3 -50.8 218.4 -54.2V-56.2Q218.4 -69.2 212.8 -79.5Q205.5 -93.6 190.9 -93.6Q175.1 -93.6 165.5 -78.2Q158.4 -66.5 156.7 -50.2Q156.4 -47.1 156.3 -43.8V-41.7Q156.3 -28.7 161.9 -18.4Q169.2 -4.3 183.8 -4.3ZM192.5 -99.5Q209.7 -99.5 221.3 -91.7Q237.1 -81 237.1 -57.7Q237.1 -54 236.7 -50Q234.8 -29.9 219.9 -14.7Q203.9 1.6 182.3 1.6Q165 1.6 153.5 -6.3Q137.6 -16.9 137.6 -40.3Q137.6 -44 138 -48Q140.1 -68.1 154.8 -83.3Q170.8 -99.5 192.5 -99.5Z\" fill=\"#0B2B2A\"/><path d=\"M335.6 -58.1 332 -22.9Q331.2 -14.8 331.2 -11.8V-11.2Q331.4 -6.8 333.6 -6.3H334Q336 -6.3 339.6 -10.9Q342.6 -14.9 345.2 -20H349.6Q344.6 -10.3 341.3 -6.2Q335.1 1.6 326.9 1.6Q320.7 1.6 318.1 -4.3Q316.2 -8.7 316.2 -14.4Q316.2 -16.2 316.4 -18L320.4 -58.1H320.3Q321.5 -66.4 321.5 -72.7Q321.5 -81.2 319.2 -86Q316.2 -92.3 307.1 -92.3Q304.4 -92.3 301.1 -91.7Q280.6 -87 268.5 -39.3L264.5 0H250.3L258.4 -80.1Q258.6 -82.3 258.6 -83.9Q258.6 -88.6 257 -90.4Q255.8 -91.6 251.9 -91.6Q248.5 -91.6 243 -90.7L243.5 -95.6L274.5 -99.5L271.5 -69Q283.9 -99.4 310.2 -99.5Q324.7 -99.5 331.9 -91.8Q336.7 -86.5 336.7 -73.2Q336.7 -66.6 335.6 -58.1Z\" fill=\"#0B2B2A\"/><path d=\"M374.5 0H401.1V-24.4L412.5 -36.8L438.5 0H471.5L430.9 -56.8L470.3 -100H434.5L401.1 -64V-140H374.5Z\" fill=\"#0B2B2A\"/><path d=\"M557.9 -100V-89.2Q557.3 -90 556.7 -90.7Q556.1 -91.4 555.5 -92Q544.7 -102.4 528.3 -102.4Q506.9 -102.4 492.7 -87.2Q478.5 -72 478.5 -50Q478.5 -28 492.7 -12.8Q506.9 2.4 528.3 2.4Q544.9 2.4 555.3 -7.4Q556.1 -8 556.6 -8.7Q557.1 -9.4 557.9 -10V0H581.5V-100ZM530.5 -76Q541.1 -76 548.1 -68.6Q551.3 -64.8 553.1 -60.2Q554.9 -55.6 554.9 -50Q554.9 -44.6 553.1 -39.9Q551.3 -35.2 548.1 -31.6Q541.1 -24 530.5 -24Q519.7 -24 512.7 -31.6Q505.7 -39.2 505.7 -50Q505.7 -61 512.7 -68.6Q519.7 -76 530.5 -76Z\" fill=\"#0B2B2A\"/><path d=\"M611.1 -131.2V-100H595.1V-73.4H611.1V-44.6Q611.1 -26.2 624.1 -13.2Q637.3 0 655.7 0H663.5V-26.6H655.7Q648.3 -26.6 642.9 -32Q637.7 -37.2 637.7 -44.6V-73.4H663.5V-100H637.7V-131.2Z\" fill=\"#0B2B2A\"/><rect x=\"663\" y=\"-26.6\" width=\"62.5\" height=\"26.6\" fill=\"#FDA333\"/></svg>";

const IS_SCRIPTER = typeof print === "function";
const log = (m) => { if (IS_SCRIPTER) print(m); };

(async () => {
  try {
    await main();
    figma.notify("Conkat: site v5 montado com a logo 2B.");
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
  // Texto do site (revisado). Tudo o que aparece fora dos celulares está aqui.
  // ---------------------------------------------------------------------------
  // Cada frase foi conferida contra o app, a API e o Obsidian (figma/AUDITORIA-COPY.md).
  const COPY = {
    nav: APP_LIVE ? ["Como funciona", "Para profissionais", "Dúvidas"] : ["Como funciona", "Dúvidas"],
    navCta: APP_LIVE ? "Baixar o app" : "Para profissionais",
    heroTitle: "Profissionais verificados de Joinville e região.",
    heroText: "Manutenção, limpeza, reformas, beleza, aulas, mudanças e outros serviços. Veja preço e avaliações e chame direto no WhatsApp, sem criar conta.",
    soon: "Em breve na App Store e no Google Play",
    heroSecondary: "Sou profissional",
    stepsTitle: "Como funciona",
    steps: [
      ["Escolha a cidade", "O Conkat começa por Joinville e região. O app mostra só as cidades que já têm profissionais anunciando."],
      ["Busque o serviço", "Pesquise pelo que precisa ou navegue pelas categorias. Dá para filtrar por tipo de preço e ordenar por preço ou pelos mais recentes."],
      ["Chame no WhatsApp", "Todo anúncio tem WhatsApp. A conversa é direto com o profissional: preço, data e horário vocês combinam ali."],
    ],
    featuresTitle: "O que você vê antes de chamar",
    features: [
      ["Como o profissional cobra", "Valor fixo, a partir de, por hora, por dia ou a combinar.", "Preço"],
      ["Avaliações", "Nota de 1 a 5 estrelas, com a média e o total. Anúncio sem nota aparece como ainda não avaliado.", "Avaliações"],
      ["Profissionais verificados", "Todo profissional tem o CPF ou CNPJ conferido pela equipe do Conkat antes de publicar.", "Verificado"],
      ["Anúncios revisados", "Nenhum anúncio vai ao ar sem passar pela revisão da equipe.", "Revisão"],
      ["Favoritos no celular", "Salve anúncios sem criar conta. Eles ficam no aparelho e abrem sem internet.", "Favoritos"],
    ],
    proTitle: "Você presta serviço? Anuncie no Conkat.",
    proText: "Seu primeiro anúncio fica 14 dias no ar sem custo, contados a partir da aprovação. Sem cobrança por contato: quem procura chama direto no seu WhatsApp.",
    pro: [
      ["selo", "Cadastro com CPF ou CNPJ", "Confirme seu e-mail e envie o documento. A equipe confere antes do seu primeiro anúncio."],
      ["megafone", "Anúncio em cinco etapas", "Categoria, descrição, preço e área de atendimento, fotos e revisão final."],
      ["escudo", "Revisão antes de publicar", "Se algo precisar de ajuste, você recebe o motivo no app e reenvia."],
      ["raio", "Destaque nas buscas", "Anúncios impulsionados aparecem antes dos outros na sua cidade, com o selo Destaque."],
      ["grafico", "Desempenho do anúncio", "Veja quantas vezes o anúncio apareceu em listas e buscas e quantas vezes foi aberto."],
    ],
    proCta: "Começar a anunciar",
    faqTitle: "Dúvidas frequentes",
    faq: [
      ["Preciso de conta para contratar?", "Não. Buscar, salvar e avaliar anúncios não exige cadastro. Só profissionais que anunciam têm conta."],
      ["O pagamento do serviço passa pelo Conkat?", "Não. O Conkat não intermedeia pagamentos. Preço e forma de pagamento são combinados direto com o profissional."],
      ["Quem pode avaliar um anúncio?", "Qualquer pessoa com o app, uma vez por aparelho. A avaliação é só a nota, de 1 a 5 estrelas."],
      ["Quanto custa anunciar?", "O primeiro anúncio fica 14 dias no ar sem custo, contados a partir da aprovação. Depois, a publicação é paga com o saldo da conta, e os planos aparecem no app. Por enquanto, o saldo é recarregado pela equipe do Conkat."],
      ["Por que meu anúncio foi recusado?", "O motivo aparece no app, junto do anúncio. Corrija o que foi apontado e envie de novo."],
      ["Em quais cidades o Conkat funciona?", "Em Joinville e região: Jaraguá do Sul, Araquari, São Francisco do Sul e outras cidades do Norte de Santa Catarina. O app mostra as que já têm anúncios publicados."],
    ],
    ctaTitle: APP_LIVE ? "Baixe o Conkat" : "O Conkat chega em breve",
    ctaText: APP_LIVE ? "Disponível para iPhone e Android." : "Para iPhone e Android, começando por Joinville e região.",
    footerLinks: ["Termos de uso", "Política de privacidade"],
    footerRegion: "Joinville e região, SC",
    footerLegal: "© 2026 Conkat. CNPJ 00.000.000/0001-00",
  };

  // ---------------------------------------------------------------------------
  // Contexto
  // ---------------------------------------------------------------------------
  const page = figma.root.children.find((p) => p.name === "Site — Desktop") || figma.currentPage;
  await figma.setCurrentPageAsync(page);
  for (const [family, style] of [
    ["Schibsted Grotesk", "SemiBold"], ["Schibsted Grotesk", "Bold"],
    ["Inter", "Regular"], ["Inter", "Medium"], ["Inter", "Semi Bold"],
  ]) await figma.loadFontAsync({ family, style });

  const V = {};
  for (const v of await figma.variables.getLocalVariablesAsync("COLOR")) if (v.name.startsWith("cor/")) V[v.name.slice(4)] = v;
  // Mesma paleta do arquivo de marca: garante a cor de teal sobre fundo escuro
  if (!V.brandOnDark && V.ink) {
    const colBrand = await figma.variables.getVariableCollectionByIdAsync(V.ink.variableCollectionId);
    const v = figma.variables.createVariable("cor/brandOnDark", colBrand, "COLOR");
    v.setValueForMode(colBrand.modes[0].modeId, { r: 0x5f / 255, g: 0xd3 / 255, b: 0xcc / 255 });
    v.scopes = ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR", "TEXT_FILL"]; V.brandOnDark = v;
  }
  const pv = (k) => {
    if (!V[k]) throw new Error("Variável de cor não encontrada: cor/" + k);
    return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", V[k]);
  };
  const styles = await figma.getLocalTextStylesAsync();
  const STY = {}; for (const s of styles) STY[s.name] = s;
  // Escala tipográfica revisada
  const setStyle = (name, size, lh) => { if (STY[name]) { STY[name].fontSize = size; STY[name].lineHeight = { unit: "PIXELS", value: lh }; } };
  setStyle("Display/XL", 64, 68);
  setStyle("Mobile/Display", 36, 40);

  // Títulos em Unageo, a mesma fonte do "kat_" da logo (licença SIL OFL 1.1).
  // Se a Unageo não estiver instalada, os títulos ficam em Schibsted Grotesk e o script avisa.
  const available = await figma.listAvailableFontsAsync();
  const unageoFonts = available.filter((f) => /unageo/i.test(f.fontName.family));
  const norm = (x) => x.toLowerCase().replace(/[\s_-]/g, "");
  const pickStyle = (wanted) => {
    const exact = unageoFonts.find((f) => norm(f.fontName.style) === wanted);
    return exact ? exact.fontName : null;
  };
  const unageoTitle = pickStyle("semibold") || pickStyle("bold") || pickStyle("medium");
  const hasUnageo = !!unageoTitle;
  if (hasUnageo) {
    await figma.loadFontAsync(unageoTitle);
    for (const [name, ls] of [["Display/XL", -2.5], ["Display/L", -2], ["Título/1", -1.5], ["Título/2", -1], ["Título/3", -0.5], ["Título/4", 0], ["Mobile/Display", -2], ["Mobile/Título", -1.5]]) {
      if (STY[name]) { STY[name].fontName = unageoTitle; STY[name].letterSpacing = { unit: "PERCENT", value: ls }; }
    }
    log("Títulos em " + unageoTitle.family + " " + unageoTitle.style);
  } else {
    const seen = unageoFonts.map((f) => f.fontName.family + " " + f.fontName.style).join(", ");
    figma.notify(seen
      ? "Conkat: a Unageo apareceu só como: " + seen + ". Os títulos ficaram em Schibsted Grotesk."
      : "Conkat: o Figma não está vendo a fonte Unageo. Instale o Figma Agent (figma.com/downloads), recarregue a aba e rode de novo.", { timeout: 15000 });
    log("Unageo não encontrada: títulos mantidos em Schibsted Grotesk.");
  }

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
    f.layoutMode = dir; f.primaryAxisSizingMode = "AUTO"; f.counterAxisSizingMode = "AUTO";
    f.fills = []; f.clipsContent = false; Object.assign(f, props); return f;
  };
  const fill = (p, c) => { p.appendChild(c); c.layoutSizingHorizontal = "FILL"; if (c.type === "TEXT") c.textAutoResize = "HEIGHT"; return c; };
  const pad = (f, t, r, b, l) => { f.paddingTop = t; f.paddingRight = r; f.paddingBottom = b; f.paddingLeft = l; return f; };
  const fixedW = (f, w) => { f.counterAxisSizingMode = "FIXED"; f.resize(w, f.height); f.primaryAxisSizingMode = "AUTO"; return f; };
  const T = async (chars, style, color = "text", w) => {
    const t = figma.createText();
    if (!STY[style]) throw new Error("Estilo de texto não encontrado: " + style);
    await t.setTextStyleIdAsync(STY[style].id);
    t.characters = chars; t.fills = [pv(color)];
    if (w) { t.resize(w, t.height); t.textAutoResize = "HEIGHT"; }
    return t;
  };
  const mk = (txt, size, lh, style, color) => {
    const t = figma.createText(); t.fontName = { family: "Inter", style };
    t.characters = txt; t.fontSize = size; t.lineHeight = { unit: "PIXELS", value: lh }; t.fills = [pv(color)]; return t;
  };
  const disp = (txt, size, lh, color) => {
    const t = figma.createText(); t.fontName = { family: "Schibsted Grotesk", style: "SemiBold" };
    t.characters = txt; t.fontSize = size; t.lineHeight = { unit: "PIXELS", value: lh };
    t.letterSpacing = { unit: "PERCENT", value: -2 }; t.fills = [pv(color)]; return t;
  };
  const img = (n, h) => { n.fills = [{ type: "IMAGE", imageHash: HASH[h], scaleMode: "FILL" }]; return n; };
  const patternRect = (w, h, op, scale = 0.5) => {
    const r = figma.createRectangle(); r.name = "padrão da marca"; r.resize(w, h);
    r.fills = [{ type: "IMAGE", imageHash: PAT, scaleMode: "TILE", scalingFactor: scale, opacity: op }]; return r;
  };
  const absolute = (parent, child, x, y) => { parent.appendChild(child); child.layoutPositioning = "ABSOLUTE"; child.x = x; child.y = y; return child; };
  const phoneShadow = () => [{ type: "DROP_SHADOW", color: { r: 0.04, g: 0.17, b: 0.16, a: 0.22 }, offset: { x: 0, y: 40 }, radius: 80, spread: 0, visible: true, blendMode: "NORMAL" }];
  const border = (f, color = "border") => { f.strokes = [pv(color)]; f.strokeWeight = 1; f.strokeAlign = "INSIDE"; return f; };
  const borderTop = (f, color) => { f.strokes = [pv(color)]; f.strokeTopWeight = 1; f.strokeBottomWeight = 0; f.strokeLeftWeight = 0; f.strokeRightWeight = 0; };
  const icon = (k, color, size = 24) => {
    const i = comp("Ícone/" + k).createInstance(); if (size !== 24) i.resize(size, size);
    if (color) for (const n of i.findAll((n) => "fills" in n && Array.isArray(n.fills) && n.fills.length)) n.fills = [pv(color)];
    return i;
  };
  // Logo 2B como vetor, com as cores ligadas às variáveis (letras: ink ou branco; cursor: accent)
  const logo = (h, onDark) => {
    const n = figma.createNodeFromSvg(LOGO_2B); n.name = onDark ? "Logo Conkat (negativo)" : "Logo Conkat"; n.rescale(h / n.height);
    for (const p of n.findAll((x) => "fills" in x && Array.isArray(x.fills) && x.fills.length)) {
      const c = p.fills[0].color; const isAccent = c && c.r > 0.9 && c.g > 0.5;
      p.fills = [pv(isAccent ? "accent" : onDark ? "surface" : "ink")];
    }
    return n;
  };
  const setP = (inst, obj) => {
    const props = inst.componentProperties; const out = {};
    for (const [n, v] of Object.entries(obj)) { const k = Object.keys(props).find((k) => k === n || k.startsWith(n + "#")); if (k) out[k] = v; }
    inst.setProperties(out); return inst;
  };
  const variant = (set, name) => { const v = set.children.find((c) => c.name === name); if (!v) throw new Error("Variante não encontrada: " + name); return v; };
  const btn = (tipo, label) => setP(variant(comp("Botão"), "Tipo=" + tipo).createInstance(), { "Rótulo": label, "Seta": false });
  const badge = (s) => variant(comp("Selo da loja"), "Loja=" + s).createInstance();
  const badges = (dir = "HORIZONTAL") => { const b = AL(dir, { name: "Lojas", itemSpacing: 12 }); b.appendChild(badge("App Store")); b.appendChild(badge("Google Play")); return b; };
  const soonPill = () => {
    const p = AL("HORIZONTAL", { name: "Em breve nas lojas", itemSpacing: 8 }); p.counterAxisAlignItems = "CENTER";
    p.appendChild(icon("relogio", "textMuted", 18)); p.appendChild(mk(COPY.soon, 14, 20, "Medium", "textMuted")); return p;
  };
  const storeBlock = () => (APP_LIVE ? badges() : soonPill());
  const heroActions = (dir) => {
    if (APP_LIVE) return badges();
    const r = AL(dir, { name: "Ações", itemSpacing: 12 }); if (dir === "HORIZONTAL") r.counterAxisAlignItems = "CENTER";
    r.itemSpacing = 20; r.appendChild(btn("Primário", COPY.heroSecondary)); r.appendChild(soonPill()); return r;
  };
  const listing = (o, photo) => { const l = setP(comp("App/Card de anúncio").createInstance(), o); if (photo) img(l.findOne((n) => n.name === "foto"), photo); return l; };
  const arrow = (d) => variant(comp("Seta do carrossel"), "Direção=" + d).createInstance();
  const faq = (q, a, open) => setP(variant(comp("Item de dúvida"), "Estado=" + (open ? "Aberto" : "Fechado")).createInstance(), { "Pergunta": q, "Resposta": a });
  const dots = (count) => {
    const d = AL("HORIZONTAL", { name: "Paginação", itemSpacing: 6 }); d.counterAxisAlignItems = "CENTER";
    for (let i = 0; i < count; i++) { const r = figma.createRectangle(); r.resize(i === 0 ? 24 : 8, 8); r.cornerRadius = 4; r.fills = [pv(i === 0 ? "text" : "border")]; d.appendChild(r); }
    return d;
  };

  // ---------------------------------------------------------------------------
  // Componente novo: Prévia/Revisão (usado no card "Anúncios revisados")
  // ---------------------------------------------------------------------------
  if (!COMP["Prévia/Revisão"]) {
    const c = figma.createComponent(); c.name = "Prévia/Revisão"; c.resize(384, 232); c.fills = [pv("background")]; c.clipsContent = true;
    c.layoutMode = "VERTICAL"; c.primaryAxisSizingMode = "FIXED"; c.counterAxisSizingMode = "FIXED"; c.primaryAxisAlignItems = "CENTER"; c.counterAxisAlignItems = "CENTER"; c.itemSpacing = 14;
    const l = listing({ "Título": "Instalação de chuveiro", "Categoria": "Manutenção Residencial", "Preço": "R$ 120 fixo", "Nota": "5,0" }, "pintura"); c.appendChild(l); l.resize(260, l.height);
    const row = AL("HORIZONTAL", { itemSpacing: 10 }); row.counterAxisAlignItems = "CENTER"; c.appendChild(row);
    const chip = (t, bg, fg) => { const ch = AL("HORIZONTAL"); ch.fills = [pv(bg)]; ch.cornerRadius = 100; pad(ch, 6, 12, 6, 12); ch.appendChild(mk(t, 12, 16, "Semi Bold", fg)); return ch; };
    row.appendChild(chip("Em revisão", "accentSoft", "accentText")); row.appendChild(icon("seta", "textMuted", 16)); row.appendChild(chip("No ar", "primarySoft", "primary"));
    c.description = "Prévia do card 'Anúncios revisados': o anúncio passa de Em revisão para No ar.";
    const holder = page.findOne((n) => n.name === "Prévias" && n.type === "FRAME");
    if (holder) holder.appendChild(c); else { c.x = -2400; c.y = 2800; }
    COMP["Prévia/Revisão"] = c;
  }
  // Ajustes nos componentes existentes: categorias e rótulos iguais aos do app
  {
    const lc = comp("App/Card de anúncio");
    const catKey = Object.keys(lc.componentPropertyDefinitions).find((k) => k.startsWith("Categoria"));
    if (catKey) lc.editComponentProperty(catKey, { defaultValue: "Manutenção Residencial" });
    const fav = COMP["Prévia/Favoritos"];
    const favCard = fav && fav.findOne((n) => n.type === "INSTANCE");
    if (favCard) setP(favCard, { "Categoria": "Construção e Reformas" });
    const rev = COMP["Prévia/Revisão"];
    const revCard = rev && rev.findOne((n) => n.type === "INSTANCE" && n.name.indexOf("Card") >= 0);
    if (revCard) setP(revCard, { "Categoria": "Manutenção Residencial" });
    const ver = COMP["Prévia/Verificado"];
    const verText = ver && ver.findOne((n) => n.type === "TEXT" && n.characters === "Documento verificado");
    if (verText) verText.characters = "Verificado";
  }
  const featureCard = (title, desc, preview) => setP(comp("Card de recurso").createInstance(), { "Título": title, "Descrição": desc, "Prévia": comp("Prévia/" + preview).id });

  // ---------------------------------------------------------------------------
  // Celulares (telas do app)
  // ---------------------------------------------------------------------------
  const tabBar = (active) => {
    const tb = AL("HORIZONTAL", { name: "Tab bar flutuante" }); tb.fills = [pv("surface")]; border(tb); tb.cornerRadius = 24;
    pad(tb, 8, 16, 8, 16); tb.primaryAxisSizingMode = "FIXED"; tb.resize(228, 54); tb.primaryAxisAlignItems = "SPACE_BETWEEN"; tb.counterAxisAlignItems = "CENTER";
    for (const [lab, ic] of [["Início", "casa"], ["Anúncios", "busca"], ["Favoritos", "coracao"], ["Conta", "pin"]]) {
      const c = AL("VERTICAL", { itemSpacing: 2 }); c.counterAxisAlignItems = "CENTER";
      c.appendChild(icon(ic, lab === active ? "primary" : "textMuted", 18));
      c.appendChild(mk(lab, 9, 12, lab === active ? "Semi Bold" : "Medium", lab === active ? "primary" : "textMuted")); tb.appendChild(c);
    }
    return tb;
  };
  const phone = (name, build, tab) => {
    const p = AL("VERTICAL", { name: "Celular — " + name }); pad(p, 9, 9, 9, 9); p.cornerRadius = 47;
    p.fills = [{ type: "SOLID", color: { r: 0.07, g: 0.08, b: 0.08 } }]; p.effects = phoneShadow();
    const s = AL("VERTICAL", { name: "Tela" }); p.appendChild(s);
    s.primaryAxisSizingMode = "FIXED"; s.counterAxisSizingMode = "FIXED"; s.resize(252, 540);
    s.cornerRadius = 38; s.fills = [pv("background")]; s.clipsContent = true; pad(s, 12, 12, 12, 12); s.itemSpacing = 12;
    absolute(s, patternRect(252, 540, 0.35, 0.3), 0, 0);
    const sb = AL("HORIZONTAL", { name: "Barra de status" }); fill(s, sb); sb.primaryAxisAlignItems = "SPACE_BETWEEN"; sb.counterAxisAlignItems = "CENTER"; sb.paddingLeft = sb.paddingRight = 10;
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
    h.appendChild(logo(18, false));
    const city = AL("HORIZONTAL", { itemSpacing: 4 }); city.fills = [pv("surface")]; border(city); city.cornerRadius = 100; pad(city, 5, 10, 5, 8); city.counterAxisAlignItems = "CENTER";
    city.appendChild(icon("pin", "primary", 12)); city.appendChild(mk("Joinville", 10, 14, "Semi Bold", "text")); city.appendChild(icon("caret", "textMuted", 10)); h.appendChild(city);
    const card = AL("VERTICAL", { name: "Bloco de busca", itemSpacing: 12 }); fill(s, card); card.fills = [pv("surface")]; card.cornerRadius = 22; pad(card, 16, 14, 14, 14); border(card);
    const q = disp("Qual eletricista você procura?", 20, 24, "text"); q.setRangeFills(5, 16, [pv("accentText")]); fill(card, q);
    const sf = AL("HORIZONTAL", { name: "Campo de busca", itemSpacing: 8 }); fill(card, sf); sf.fills = [pv("background")]; sf.cornerRadius = 100; pad(sf, 10, 12, 10, 12); sf.counterAxisAlignItems = "CENTER";
    sf.appendChild(icon("busca", "textMuted", 15)); sf.appendChild(mk("Eletricista, diarista, montador…", 11, 14, "Regular", "textMuted"));
    const sec = AL("HORIZONTAL"); fill(s, sec); sec.primaryAxisAlignItems = "SPACE_BETWEEN"; sec.paddingLeft = sec.paddingRight = 4;
    sec.appendChild(mk("Publicados recentemente", 12, 16, "Semi Bold", "text")); sec.appendChild(mk("Ver todos", 10, 16, "Semi Bold", "primary"));
    fill(s, listing({ "Título": "Encanador residencial", "Categoria": "Manutenção Residencial", "Preço": "A partir de R$ 120", "Nota": "4,8" }, "encanador"));
    fill(s, listing({ "Título": "Diarista — limpeza completa", "Categoria": "Limpeza e Conservação", "Preço": "R$ 180 por dia", "Nota": "4,9" }, "cozinha"));
    fill(s, listing({ "Título": "Pintura de apartamentos", "Categoria": "Construção e Reformas", "Preço": "R$ 35 por m²", "Nota": "4,7" }, "pintura"));
  };
  const scrDetalhe = (s) => {
    const g = figma.createRectangle(); g.name = "galeria"; g.resize(228, 160); g.cornerRadius = 18; img(g, "cozinha"); s.appendChild(g);
    const row = AL("HORIZONTAL", { itemSpacing: 6 }); s.appendChild(row);
    for (const [t, bg] of [["Destaque", "accent"], ["Limpeza e Conservação", "surface"]]) {
      const c = AL("HORIZONTAL"); c.fills = [pv(bg)]; c.cornerRadius = 100; pad(c, 4, 9, 4, 9); if (bg === "surface") border(c);
      c.appendChild(mk(t, 10, 13, "Semi Bold", "text")); row.appendChild(c);
    }
    fill(s, disp("Diarista — limpeza completa", 19, 23, "text"));
    fill(s, mk("R$ 180 por dia", 12, 16, "Semi Bold", "primary"));
    const rb = AL("HORIZONTAL", { itemSpacing: 10 }); fill(s, rb); rb.counterAxisAlignItems = "CENTER"; rb.fills = [pv("surface")]; rb.cornerRadius = 16; pad(rb, 10, 12, 10, 12); border(rb);
    const av = figma.createEllipse(); av.resize(34, 34); img(av, "marina"); rb.appendChild(av);
    const ac = AL("VERTICAL", { itemSpacing: 1 }); ac.appendChild(mk("Marina Souza", 12, 16, "Semi Bold", "text"));
    const vr = AL("HORIZONTAL", { itemSpacing: 3 }); vr.counterAxisAlignItems = "CENTER"; vr.appendChild(icon("selo", "primary", 11)); vr.appendChild(mk("Verificado", 10, 13, "Medium", "primary")); ac.appendChild(vr); fill(rb, ac);
    const sr = AL("HORIZONTAL", { itemSpacing: 2 }); sr.counterAxisAlignItems = "CENTER"; sr.appendChild(icon("estrela-fill", "accent", 12)); sr.appendChild(mk("4,9", 12, 16, "Semi Bold", "text")); rb.appendChild(sr);
    fill(s, mk("Limpeza completa de casas e apartamentos, com produtos inclusos. Atendo toda a zona norte.", 11, 16, "Regular", "textMuted"));
    const sp = AL("VERTICAL"); fill(s, sp); sp.layoutSizingVertical = "FILL";
    const wa = AL("HORIZONTAL", { name: "Chamar no WhatsApp", itemSpacing: 8 }); fill(s, wa); wa.fills = [pv("primary")]; wa.cornerRadius = 100; wa.paddingTop = wa.paddingBottom = 13; wa.primaryAxisAlignItems = "CENTER"; wa.counterAxisAlignItems = "CENTER";
    wa.appendChild(icon("whatsapp", "textOnDark", 18)); wa.appendChild(mk("Chamar no WhatsApp", 13, 18, "Semi Bold", "textOnDark"));
  };

  // Visuais dos passos (recortes da interface, com borda e sem sombra)
  const sheet = (w) => { const f = AL("VERTICAL", { name: "Folha" }); f.fills = [pv("surface")]; f.cornerRadius = 16; border(f); return fixedW(f, w); };
  const stepVisual = [
    (w) => {
      const sh = sheet(w); const hd = AL("HORIZONTAL"); fill(sh, hd); pad(hd, 14, 16, 10, 16); hd.appendChild(mk("Escolha a cidade", 13, 18, "Semi Bold", "text"));
      for (const [c, on] of [["Joinville, SC", true], ["Araquari, SC", false], ["Jaraguá do Sul, SC", false]]) {
        const r = AL("HORIZONTAL", { itemSpacing: 10 }); fill(sh, r); pad(r, 11, 16, 11, 16); r.counterAxisAlignItems = "CENTER"; borderTop(r, "border");
        r.appendChild(icon("pin", on ? "primary" : "textMuted", 16)); fill(r, mk(c, 13, 18, on ? "Semi Bold" : "Regular", "text")); if (on) r.appendChild(icon("check", "primary", 16));
      }
      return sh;
    },
    (w) => {
      const col = fixedW(AL("VERTICAL", { name: "Busca", itemSpacing: 10 }), w);
      const sf = AL("HORIZONTAL", { itemSpacing: 8 }); fill(col, sf); sf.fills = [pv("surface")]; sf.cornerRadius = 100; pad(sf, 12, 14, 12, 14); sf.counterAxisAlignItems = "CENTER"; sf.strokes = [pv("primary")]; sf.strokeWeight = 1.5;
      sf.appendChild(icon("busca", "text", 16)); sf.appendChild(mk("eletricista", 13, 18, "Medium", "text"));
      fill(col, listing({ "Título": "Eletricista residencial", "Categoria": "Manutenção Residencial", "Preço": "A partir de R$ 90", "Nota": "4,8" }, "encanador"));
      fill(col, listing({ "Título": "Instalação de chuveiro", "Categoria": "Manutenção Residencial", "Preço": "R$ 120 fixo", "Nota": "5,0" }, "pintura"));
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
    const c = fixedW(AL("VERTICAL", { name: "Passo " + (i + 1) }), width); c.fills = [pv("surface")]; c.cornerRadius = 20; border(c); c.clipsContent = true;
    const vis = figma.createFrame(); vis.name = "Visual"; fill(c, vis); vis.resize(width, visH); vis.fills = [pv("primarySoft")]; vis.clipsContent = true;
    const v = stepVisual[i](contentW); vis.appendChild(v); v.x = Math.round((width - v.width) / 2); v.y = Math.round((visH - v.height) / 2);
    const tx = AL("VERTICAL", { name: "Texto", itemSpacing: 8 }); fill(c, tx); pad(tx, 24, 28, 30, 28);
    fill(tx, await T((i + 1) + ". " + COPY.steps[i][0], "Título/3"));
    fill(tx, await T(COPY.steps[i][1], "Texto/M", "textMuted"));
    return c;
  };
  const metricsCard = (w) => {
    const m = fixedW(AL("VERTICAL", { name: "Card de desempenho", itemSpacing: 14 }), w); m.fills = [pv("surface")]; m.cornerRadius = 16; pad(m, 18, 18, 18, 18);
    m.appendChild(mk("Últimos 7 dias", 12, 16, "Medium", "textMuted"));
    const r = AL("HORIZONTAL", { itemSpacing: 24 }); fill(m, r);
    for (const [n, l] of [["1.284", "exibições em buscas"], ["312", "visualizações"]]) { const c = AL("VERTICAL", { itemSpacing: 2 }); c.appendChild(disp(n, 26, 30, "text")); c.appendChild(mk(l, 11, 15, "Regular", "textMuted")); r.appendChild(c); }
    const ch = figma.createNodeFromSvg(`<svg width="${w - 36}" height="52" viewBox="0 0 260 52" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 51.5H260" stroke="#E5E7EB"/><path d="M0 40 L37 34 L74 37 L111 26 L148 28 L185 16 L222 12 L260 5" stroke="#0B7A75" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 46 L37 44 L74 45 L111 40 L148 41 L185 37 L222 35 L260 32" stroke="#FDA333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    ch.name = "gráfico"; fill(m, ch); return m;
  };
  const proList = async (onDark = true) => {
    const list = AL("VERTICAL", { name: "Recursos" });
    for (const [ic, t, d] of COPY.pro) {
      const r = AL("HORIZONTAL", { itemSpacing: 16 }); fill(list, r); pad(r, 20, 0, 20, 0); borderTop(r, "inkSoft");
      r.appendChild(icon(ic, "accent", 22));
      const c = AL("VERTICAL", { itemSpacing: 4 }); fill(r, c); fill(c, await T(t, "Título/4", "textOnDark")); fill(c, await T(d, "Texto/M", "textOnDarkMuted"));
    }
    return list;
  };

  // ---------------------------------------------------------------------------
  // Remove versões anteriores
  // ---------------------------------------------------------------------------
  for (const n of [...page.children]) if (n.name === "Site Conkat — Desktop" || n.name === "Site Conkat — Mobile") n.remove();

  // ---------------------------------------------------------------------------
  // DESKTOP (1440)
  // ---------------------------------------------------------------------------
  const W = AL("VERTICAL", { name: "Site Conkat — Desktop" }); page.appendChild(W);
  W.counterAxisSizingMode = "FIXED"; W.resize(1440, 100); W.primaryAxisSizingMode = "AUTO"; W.fills = [pv("background")]; W.clipsContent = true; W.x = 0; W.y = 0;
  const section = (name, bg, t, r, b, l, gap = 56) => { const s = AL("VERTICAL", { name, itemSpacing: gap }); fill(W, s); pad(s, t, r, b, l); if (bg) s.fills = [pv(bg)]; return s; };

  // Hero
  {
    const hero = figma.createFrame(); hero.name = "Hero"; fill(W, hero); hero.resize(1440, 800); hero.fills = [pv("background")]; hero.clipsContent = true;
    hero.appendChild(patternRect(1440, 800, 0.22, 0.5));
    const nav = AL("HORIZONTAL", { name: "Menu" }); hero.appendChild(nav); nav.primaryAxisSizingMode = "FIXED"; nav.resize(1200, 52); nav.x = 120; nav.y = 28; nav.primaryAxisAlignItems = "SPACE_BETWEEN"; nav.counterAxisAlignItems = "CENTER";
    nav.appendChild(logo(34, false));
    const links = AL("HORIZONTAL", { name: "Links", itemSpacing: 40 }); for (const l of COPY.nav) links.appendChild(await T(l, "Rótulo/M", "text")); nav.appendChild(links);
    nav.appendChild(btn("Primário", COPY.navCta));
    const tx = AL("VERTICAL", { name: "Texto", itemSpacing: 28 }); hero.appendChild(tx); tx.x = 120; tx.y = 212;
    tx.appendChild(await T(COPY.heroTitle, "Display/XL", "text", 620));
    tx.appendChild(await T(COPY.heroText, "Texto/L", "textMuted", 540));
    tx.appendChild(heroActions("HORIZONTAL"));
    const pB = phone("Anúncio", scrDetalhe, null); hero.appendChild(pB); pB.rescale(1.08); pB.x = 1110; pB.y = 236;
    const pA = phone("Início", scrInicio, "Início"); hero.appendChild(pA); pA.rescale(1.2); pA.x = 800; pA.y = 132;
  }
  // Como funciona
  {
    const s = section("Como funciona", "surface", 120, 120, 128, 120, 48);
    s.appendChild(await T(COPY.stepsTitle, "Título/1"));
    const row = AL("HORIZONTAL", { name: "Passos", itemSpacing: 24 }); fill(s, row);
    for (let i = 0; i < 3; i++) { const c = await stepCard(i, 384, 280, 280); row.appendChild(c); c.layoutSizingHorizontal = "FILL"; }
  }
  // O que você vê antes de chamar (carrossel)
  {
    const s = section("O que você vê antes de chamar", "background", 120, 0, 120, 120, 48);
    const head = AL("HORIZONTAL", { name: "Cabeçalho" }); fill(s, head); head.paddingRight = 120; head.primaryAxisAlignItems = "SPACE_BETWEEN"; head.counterAxisAlignItems = "MAX";
    head.appendChild(await T(COPY.featuresTitle, "Título/1", "text", 640));
    const ar = AL("HORIZONTAL", { name: "Setas", itemSpacing: 12 }); ar.appendChild(arrow("Anterior")); ar.appendChild(arrow("Próximo")); head.appendChild(ar);
    const track = AL("HORIZONTAL", { name: "Carrossel", itemSpacing: 24 }); fill(s, track); track.clipsContent = true;
    for (const [t, d, p] of COPY.features) { const c = featureCard(t, d, p); c.cornerRadius = 20; c.effects = []; track.appendChild(c); }
    s.appendChild(dots(COPY.features.length));
  }
  // Para profissionais
  {
    const s = section("Para profissionais", "ink", 120, 120, 120, 120);
    const row = AL("HORIZONTAL", { name: "Conteúdo", itemSpacing: 96 }); fill(s, row); row.counterAxisAlignItems = "CENTER";
    const c = AL("VERTICAL", { itemSpacing: 36 }); fill(row, c);
    const hd = AL("VERTICAL", { itemSpacing: 18 }); fill(c, hd);
    fill(hd, await T(COPY.proTitle, "Título/1", "textOnDark"));
    fill(hd, await T(COPY.proText, "Texto/L", "textOnDarkMuted"));
    fill(c, await proList());
    if (APP_LIVE) c.appendChild(btn("Destaque", COPY.proCta));
    const photo = figma.createFrame(); photo.name = "Foto"; photo.resize(500, 640); photo.cornerRadius = 28; img(photo, "eletricista"); photo.clipsContent = true; row.appendChild(photo);
    const mc = metricsCard(290); photo.appendChild(mc); mc.x = 24; mc.y = 640 - 24 - mc.height;
  }
  // Dúvidas
  {
    const s = section("Dúvidas", "surface", 120, 120, 120, 120);
    const row = AL("HORIZONTAL", { name: "Conteúdo" }); fill(s, row); row.primaryAxisAlignItems = "SPACE_BETWEEN";
    row.appendChild(await T(COPY.faqTitle, "Título/1", "text", 380));
    const list = fixedW(AL("VERTICAL", { name: "Lista" }), 700); borderTop(list, "border"); row.appendChild(list);
    COPY.faq.forEach(([q, a], i) => fill(list, faq(q, a, i === 0)));
  }
  // Download (só depois do lançamento)
  if (APP_LIVE) {
    const s = section("Download", "primary", 88, 120, 88, 120);
    const row = AL("HORIZONTAL", { name: "Conteúdo" }); fill(s, row); row.primaryAxisAlignItems = "SPACE_BETWEEN"; row.counterAxisAlignItems = "CENTER";
    const l = AL("VERTICAL", { itemSpacing: 10 }); row.appendChild(l);
    l.appendChild(await T(COPY.ctaTitle, "Título/1", "textOnDark")); l.appendChild(await T(COPY.ctaText, "Texto/L", "textOnDark"));
    row.appendChild(storeBlock());
  }
  // Rodapé
  {
    const s = section("Rodapé", "ink", 40, 120, 40, 120);
    const row = AL("HORIZONTAL", { name: "Conteúdo" }); fill(s, row); row.primaryAxisAlignItems = "SPACE_BETWEEN"; row.counterAxisAlignItems = "CENTER";
    const brand = AL("HORIZONTAL", { itemSpacing: 16 }); brand.counterAxisAlignItems = "CENTER"; row.appendChild(brand);
    brand.appendChild(logo(28, true)); brand.appendChild(await T(COPY.footerRegion, "Texto/S", "textOnDarkMuted"));
    const links = AL("HORIZONTAL", { itemSpacing: 32 }); for (const l of COPY.footerLinks) links.appendChild(await T(l, "Texto/S", "textOnDarkMuted")); row.appendChild(links);
    row.appendChild(await T(COPY.footerLegal, "Texto/S", "textOnDarkMuted"));
  }

  // ---------------------------------------------------------------------------
  // MOBILE (390)
  // ---------------------------------------------------------------------------
  const M = AL("VERTICAL", { name: "Site Conkat — Mobile" }); page.appendChild(M);
  M.counterAxisSizingMode = "FIXED"; M.resize(390, 100); M.primaryAxisSizingMode = "AUTO"; M.fills = [pv("background")]; M.clipsContent = true; M.x = 1640; M.y = 0;
  const msec = (name, bg, t, r, b, l, gap = 32) => { const s = AL("VERTICAL", { name, itemSpacing: gap }); fill(M, s); pad(s, t, r, b, l); if (bg) s.fills = [pv(bg)]; return s; };
  const carousel = (parent, items) => { const tr = AL("HORIZONTAL", { name: "Carrossel", itemSpacing: 16 }); fill(parent, tr); tr.clipsContent = true; for (const it of items) tr.appendChild(it); return tr; };

  // Hero
  {
    const h = AL("VERTICAL", { name: "Hero" }); fill(M, h); h.fills = [pv("background")]; h.clipsContent = true;
    absolute(h, patternRect(390, 1100, 0.22, 0.5), 0, 0);
    const nav = AL("HORIZONTAL", { name: "Menu" }); fill(h, nav); pad(nav, 16, 24, 8, 24); nav.primaryAxisAlignItems = "SPACE_BETWEEN"; nav.counterAxisAlignItems = "CENTER";
    nav.appendChild(logo(28, false));
    const mb = AL("HORIZONTAL", { name: "Abrir menu" }); mb.primaryAxisSizingMode = "FIXED"; mb.counterAxisSizingMode = "FIXED"; mb.resize(44, 44); mb.cornerRadius = 100; mb.fills = [pv("surface")]; border(mb); mb.primaryAxisAlignItems = "CENTER"; mb.counterAxisAlignItems = "CENTER"; mb.appendChild(icon("menu", "text", 20)); nav.appendChild(mb);
    const tx = AL("VERTICAL", { name: "Texto", itemSpacing: 20 }); fill(h, tx); pad(tx, 36, 24, 32, 24);
    fill(tx, await T(COPY.heroTitle, "Mobile/Display"));
    fill(tx, await T(COPY.heroText, "Texto/M", "textMuted"));
    tx.appendChild(heroActions("VERTICAL"));
    const stage = figma.createFrame(); stage.name = "Celulares"; stage.fills = []; stage.clipsContent = true; fill(h, stage); stage.resize(390, 440);
    const pB = phone("Anúncio", scrDetalhe, null); stage.appendChild(pB); pB.rescale(0.9); pB.x = 222; pB.y = 80;
    const pA = phone("Início", scrInicio, "Início"); stage.appendChild(pA); pA.x = 40; pA.y = 20;
  }
  // Como funciona
  {
    const s = msec("Como funciona", "surface", 72, 0, 72, 24, 28);
    s.appendChild(await T(COPY.stepsTitle, "Mobile/Título"));
    const cards = []; for (let i = 0; i < 3; i++) cards.push(await stepCard(i, 300, 236, 240));
    carousel(s, cards); s.appendChild(dots(3));
  }
  // O que você vê antes de chamar
  {
    const s = msec("O que você vê antes de chamar", "background", 72, 0, 72, 24, 28);
    const t = await T(COPY.featuresTitle, "Mobile/Título", "text", 320); s.appendChild(t);
    const cards = COPY.features.map(([tt, d, p]) => { const c = featureCard(tt, d, p); c.cornerRadius = 20; c.resize(300, c.height); c.primaryAxisSizingMode = "AUTO"; return c; });
    carousel(s, cards); s.appendChild(dots(COPY.features.length));
  }
  // Para profissionais
  {
    const s = msec("Para profissionais", "ink", 72, 24, 72, 24, 28);
    fill(s, await T(COPY.proTitle, "Mobile/Título", "textOnDark"));
    fill(s, await T(COPY.proText, "Texto/M", "textOnDarkMuted"));
    const photo = figma.createFrame(); photo.name = "Foto"; fill(s, photo); photo.resize(342, 400); photo.cornerRadius = 24; img(photo, "eletricista"); photo.clipsContent = true;
    const mc = metricsCard(250); photo.appendChild(mc); mc.x = 16; mc.y = 400 - 16 - mc.height;
    fill(s, await proList());
    if (APP_LIVE) fill(s, btn("Destaque", COPY.proCta));
  }
  // Dúvidas
  {
    const s = msec("Dúvidas", "surface", 72, 24, 72, 24, 24);
    fill(s, await T(COPY.faqTitle, "Mobile/Título"));
    const list = AL("VERTICAL", { name: "Lista" }); fill(s, list); borderTop(list, "border");
    COPY.faq.forEach(([q, a], i) => fill(list, faq(q, a, i === 0)));
  }
  // Download (só depois do lançamento)
  if (APP_LIVE) {
    const s = msec("Download", "primary", 56, 24, 56, 24, 20);
    fill(s, await T(COPY.ctaTitle, "Mobile/Título", "textOnDark"));
    fill(s, await T(COPY.ctaText, "Texto/M", "textOnDark"));
    s.appendChild(storeBlock());
  }
  // Rodapé
  {
    const s = msec("Rodapé", "ink", 40, 24, 40, 24, 16);
    s.appendChild(logo(28, true));
    s.appendChild(await T(COPY.footerRegion, "Texto/S", "textOnDarkMuted"));
    const links = AL("HORIZONTAL", { itemSpacing: 24 }); for (const l of COPY.footerLinks) links.appendChild(await T(l, "Texto/S", "textOnDarkMuted")); s.appendChild(links);
    fill(s, await T(COPY.footerLegal, "Texto/S", "textOnDarkMuted"));
  }

  figma.viewport.scrollAndZoomIntoView([W, M]);
  log("Desktop: " + Math.round(W.height) + " px · Mobile: " + Math.round(M.height) + " px");
}
