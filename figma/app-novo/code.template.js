// Conkat — App, novo design (padrão das telas do site)
// Cria a página "App — novo design" com:
//   1. o quadro "Padrões do app": cores, tipografia, espaçamento, raios, sombras, grade,
//      ícones e componentes, tudo anotado;
//   2. todas as telas do app (34) redesenhadas no padrão das telas do site, cada uma com o
//      código do print atual que ela substitui e notas do que muda.
// Também cria (ou atualiza) as variáveis cor/*, espaço/* e raio/*, os estilos de texto App/*
// e os componentes usados nas telas.
//
// Como rodar: abra o arquivo "Conkat - Telas", rode o plugin "Scripter", cole este arquivo
// inteiro e clique em Run. Pode ser rodado de novo: refaz só a página "App — novo design".
//
// Gerado por build.mjs. Para mudar o desenho, edite code.template.js e rode:
//   node figma/app-novo/build.mjs

const ASSETS = /*__ASSETS__*/ null;

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
  // =============================================================================================
  // 1. Tokens
  // =============================================================================================
  const SW = 375, SH = 812, M = 16, STATUS_H = 50;

  const COLORS = [
    // [token, hex, uso]
    ["ink", "#0B2B2A", "Títulos, filtro selecionado, fundo de blocos escuros e toasts"],
    ["inkSoft", "#123B39", "Superfícies sobre fundo escuro (cartões da oferta)"],
    ["background", "#F8F9FA", "Fundo das telas (com o padrão de ícones a 35%)"],
    ["surface", "#FFFFFF", "Cards, campos, grupos de lista, folhas e barras"],
    ["text", "#1A1A1A", "Texto principal"],
    ["textMuted", "#5F6672", "Texto de apoio, legendas, ícones neutros"],
    ["textOnDark", "#FFFFFF", "Texto sobre ink e primary"],
    ["textOnDarkMuted", "#A7C4C2", "Texto de apoio sobre ink"],
    ["primary", "#0B7A75", "Ação principal, preço, aba ativa, links, verificado"],
    ["primaryStrong", "#08615D", "Ação principal pressionada"],
    ["primarySoft", "#E6F4F3", "Fundo de ícones, avatar sem foto, avisos informativos"],
    ["accent", "#FDA333", "Destaque: selo Destaque, estrela da nota, marcadores, CTA em fundo escuro"],
    ["accentText", "#A85A00", "Palavra em destaque no título, texto sobre accentSoft"],
    ["accentSoft", "#FFF3E0", "Fundo de \"Em revisão\" e \"Novo no Conkat\""],
    ["border", "#E5E7EB", "Borda de cards, campos e divisórias"],
    ["borderStrong", "#D6DADF", "Puxador da folha, trilho do progresso, borda de botão secundário"],
    ["success", "#15803D", "Valores positivos, conta criada"],
    ["successSoft", "#EEF8F1", "Fundo de avisos de sucesso"],
    ["danger", "#B91C1C", "Ações destrutivas e erros"],
    ["dangerSoft", "#FDEDED", "Fundo de erro"],
    ["neutralSoft", "#F1F3F5", "Fundo de \"Rascunho\" e do controle segmentado"],
  ];
  const HEX = Object.fromEntries(COLORS.map(([k, h]) => [k, h]));
  const rgb = (hex) => ({ r: parseInt(hex.slice(1, 3), 16) / 255, g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255 });

  const SPACE = [[4, "Ícone e texto colados"], [8, "Entre elementos de um grupo"], [12, "Padding de card, entre cards"], [16, "Margem da tela, padding de campo, entre blocos"], [20, "Padding de bloco e folha"], [24, "Entre seções"], [32, "Antes de grupos grandes"], [40, "Respiro de estados vazios"]];
  const RADIUS = [[12, "Miniaturas e caixas de código"], [16, "Campos de formulário, avisos, opções"], [20, "Cards e grupos de lista"], [24, "Folhas, galerias e blocos grandes"], [999, "Botões, buscas, chips, tab bar (pílula)"]];

  // Variáveis
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  let col = cols.find((c) => c.name === "Conkat");
  if (!col) { col = figma.variables.createVariableCollection("Conkat"); col.renameMode(col.modes[0].modeId, "Claro"); }
  const mode = col.modes[0].modeId;
  const existingVars = {};
  for (const v of await figma.variables.getLocalVariablesAsync()) existingVars[v.name] = v;
  function variable(name, type, value, scopes) {
    let v = existingVars[name];
    if (!v) { v = figma.variables.createVariable(name, col, type); existingVars[name] = v; }
    v.scopes = scopes;
    v.setValueForMode(mode, value);
    return v;
  }
  const V = {};
  for (const [k, hex, use] of COLORS) {
    V[k] = variable("cor/" + k, "COLOR", rgb(hex), ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR", "TEXT_FILL", "EFFECT_COLOR"]);
    try { V[k].description = use; } catch (e) {}
  }
  for (const [n] of SPACE) variable("espaço/" + n, "FLOAT", n, ["GAP", "WIDTH_HEIGHT"]);
  for (const [n] of RADIUS) variable("raio/" + (n === 999 ? "pílula" : n), "FLOAT", n, ["CORNER_RADIUS"]);

  const paint = (k, opacity) => {
    const p = figma.variables.setBoundVariableForPaint({ type: "SOLID", color: rgb(HEX[k]) }, "color", V[k]);
    return opacity == null ? p : Object.assign({}, p, { opacity });
  };

  // Fontes
  const fontsAvail = await figma.listAvailableFontsAsync();
  const hasFont = (family, style) => fontsAvail.some((f) => f.fontName.family === family && f.fontName.style === style);
  const norm = (x) => x.toLowerCase().replace(/[\s_-]/g, "");
  const unageo = fontsAvail.filter((f) => /unageo/i.test(f.fontName.family));
  const pickU = (w) => { const f = unageo.find((x) => norm(x.fontName.style) === w); return f ? f.fontName : null; };
  const inter = (s) => ({ family: "Inter", style: hasFont("Inter", s) ? s : s.replace(" ", "") });
  const F = { regular: inter("Regular"), medium: inter("Medium"), semibold: inter("Semi Bold"), bold: inter("Bold") };
  F.display = pickU("semibold") || pickU("bold") || F.semibold;
  F.displayBold = pickU("bold") || F.display;
  for (const f of Object.values(F)) await figma.loadFontAsync(f);
  const hasUnageo = F.display.family !== "Inter";

  // Estilos de texto
  const TYPE = {
    display: { name: "App/Display", font: F.display, size: 26, lh: 31, ls: -2, use: "Pergunta da Início, títulos de etapa e de estados" },
    title: { name: "App/Título", font: F.display, size: 22, lh: 27, ls: -2, use: "Título das abas e das folhas" },
    number: { name: "App/Número", font: F.display, size: 28, lh: 32, ls: -2, use: "Saldo, métricas e valores da oferta" },
    heading: { name: "App/Seção", font: F.semibold, size: 17, lh: 22, ls: -1, use: "Título de seção e da barra superior" },
    cardTitle: { name: "App/Título do card", font: F.semibold, size: 16, lh: 21, ls: 0, use: "Título do anúncio e de opções" },
    body: { name: "App/Corpo", font: F.regular, size: 15, lh: 22, ls: 0, use: "Texto corrido, valores de campo, linhas de lista" },
    bodyStrong: { name: "App/Corpo forte", font: F.semibold, size: 15, lh: 22, ls: 0, use: "Preço, valores importantes" },
    button: { name: "App/Botão", font: F.semibold, size: 15, lh: 20, ls: 0, use: "Texto de botões e links de ação" },
    label: { name: "App/Rótulo", font: F.medium, size: 13, lh: 18, ls: 0, use: "Rótulo de campo, chips, nome de seção" },
    caption: { name: "App/Legenda", font: F.regular, size: 13, lh: 18, ls: 0, use: "Categoria, bairro, ajuda de campo, datas" },
    small: { name: "App/Pequeno", font: F.medium, size: 12, lh: 16, ls: 0, use: "Abas, selos e status" },
  };
  const localStyles = await figma.getLocalTextStylesAsync();
  for (const t of Object.values(TYPE)) {
    let s = localStyles.find((x) => x.name === t.name);
    if (!s) s = figma.createTextStyle();
    s.name = t.name;
    s.fontName = t.font;
    s.fontSize = t.size;
    s.lineHeight = { unit: "PIXELS", value: t.lh };
    s.letterSpacing = { unit: "PERCENT", value: t.ls };
    try { s.description = t.use; } catch (e) {}
    t.style = s;
  }
  const styleLinks = [];

  // =============================================================================================
  // 2. Ajudantes de desenho
  // =============================================================================================
  const IMG = {};
  for (const [k, b64] of Object.entries(ASSETS.photos)) IMG[k] = figma.createImage(figma.base64Decode(b64)).hash;
  const imageFill = (k) => [{ type: "IMAGE", imageHash: IMG[k], scaleMode: "FILL" }];

  function T(chars, type, color, o) {
    o = o || {};
    const st = TYPE[type];
    const t = figma.createText();
    t.fontName = o.font || st.font;
    t.characters = chars;
    t.fontSize = st.size;
    t.lineHeight = { unit: "PIXELS", value: st.lh };
    t.letterSpacing = { unit: "PERCENT", value: st.ls };
    t.fills = [paint(color || "text")];
    if (o.align) t.textAlignHorizontal = o.align;
    if (o.name) t.name = o.name;
    if (!o.font) styleLinks.push([t, st.style.id]);
    return t;
  }
  function autoFrame(dir) {
    if (typeof figma.createAutoLayout === "function") return figma.createAutoLayout(dir);
    const f = figma.createFrame();
    f.layoutMode = dir;
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "AUTO";
    return f;
  }
  function box(dir, o) {
    o = o || {};
    const f = autoFrame(dir);
    f.fills = [];
    if (o.name) f.name = o.name;
    if (o.gap != null) f.itemSpacing = o.gap;
    if (o.pad != null) {
      const p = Array.isArray(o.pad) ? o.pad : [o.pad];
      const [t, r = t, b = t, l = r] = p;
      f.paddingTop = t; f.paddingRight = r; f.paddingBottom = b; f.paddingLeft = l;
    }
    if (o.fill) f.fills = [paint(o.fill)];
    if (o.stroke) { f.strokes = [paint(o.stroke)]; f.strokeWeight = o.sw || 1; f.strokeAlign = "INSIDE"; }
    if (o.radius != null) f.cornerRadius = o.radius;
    if (o.align) f.counterAxisAlignItems = o.align;
    if (o.justify) f.primaryAxisAlignItems = o.justify;
    if (o.effects) f.effects = o.effects;
    if (o.clip) f.clipsContent = true;
    return f;
  }
  // Adiciona ao pai (auto layout) e ajusta o dimensionamento
  function put(parent, child, h, v) {
    if (child.type === "TEXT" && h === "FILL") child.textAutoResize = "HEIGHT";
    parent.appendChild(child);
    if (h) child.layoutSizingHorizontal = h;
    if (v) child.layoutSizingVertical = v;
    return child;
  }
  function fixed(f, w, h) {
    f.resize(w, h);
    if (f.layoutMode && f.layoutMode !== "NONE") { f.primaryAxisSizingMode = "FIXED"; f.counterAxisSizingMode = "FIXED"; }
    return f;
  }
  // Fixa só a largura; a altura acompanha o conteúdo (resize deixa os dois eixos fixos)
  function widthOnly(f, w) {
    f.resize(w, Math.max(1, f.height));
    if (f.layoutMode === "VERTICAL") { f.counterAxisSizingMode = "FIXED"; f.primaryAxisSizingMode = "AUTO"; }
    else if (f.layoutMode === "HORIZONTAL") { f.primaryAxisSizingMode = "FIXED"; f.counterAxisSizingMode = "AUTO"; }
    return f;
  }
  function icon(name, size, color) {
    const body = ASSETS.icons[name];
    if (!body) throw new Error("Ícone não embutido: " + name);
    const hex = HEX[color];
    const n = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 256 256">' + body.replace(/<path /g, '<path fill="' + hex + '" ') + "</svg>");
    n.name = "ícone/" + name;
    n.fills = [];
    n.resize(size, size);
    for (const c of n.findAll((x) => x.type === "VECTOR")) c.fills = [paint(color)];
    return n;
  }
  function logo(height) {
    const n = figma.createNodeFromSvg(ASSETS.logo);
    n.name = "Logo Conkat";
    n.fills = [];
    n.resize(Math.round(height * 736.4 / 173.5 * 10) / 10, height);
    for (const c of n.findAll((x) => x.type === "VECTOR" || x.type === "RECTANGLE")) {
      const f = c.fills;
      if (Array.isArray(f) && f.length && f[0].type === "SOLID") c.fills = [paint(f[0].color.r > 0.9 ? "accent" : "ink")];
    }
    return n;
  }
  const shadow = (y, blur, spread, a, hex) => {
    const c = rgb(hex || HEX.ink);
    return { type: "DROP_SHADOW", color: { r: c.r, g: c.g, b: c.b, a }, offset: { x: 0, y }, radius: blur, spread, visible: true, blendMode: "NORMAL" };
  };
  const SHADOWS = {
    floating: [shadow(6, 16, -8, 0.18)],
    sheet: [shadow(-8, 32, 0, 0.16)],
    raised: [shadow(24, 48, -20, 0.45)],
    toast: [shadow(10, 24, -10, 0.35)],
  };

  // =============================================================================================
  // 3. Página
  // =============================================================================================
  const PAGE_NAME = "App — novo design";
  let page = figma.root.children.find((p) => p.name === PAGE_NAME);
  if (!page) { page = figma.createPage(); page.name = PAGE_NAME; }
  await figma.setCurrentPageAsync(page);
  for (const n of [...page.children]) n.remove();

  // =============================================================================================
  // 4. Componentes
  // =============================================================================================
  const compSection = figma.createSection();
  compSection.name = "Componentes";
  const comps = [];
  function component(name, build) {
    const c = figma.createComponent();
    c.name = name;
    c.fills = [];
    build(c);
    comps.push(c);
    return c;
  }
  function asAuto(c, dir, o) {
    o = o || {};
    c.layoutMode = dir;
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "AUTO";
    if (o.gap != null) c.itemSpacing = o.gap;
    if (o.pad != null) {
      const p = Array.isArray(o.pad) ? o.pad : [o.pad];
      const [t, r = t, b = t, l = r] = p;
      c.paddingTop = t; c.paddingRight = r; c.paddingBottom = b; c.paddingLeft = l;
    }
    if (o.fill) c.fills = [paint(o.fill)];
    if (o.stroke) { c.strokes = [paint(o.stroke)]; c.strokeWeight = o.sw || 1; c.strokeAlign = "INSIDE"; }
    if (o.radius != null) c.cornerRadius = o.radius;
    if (o.align) c.counterAxisAlignItems = o.align;
    if (o.justify) c.primaryAxisAlignItems = o.justify;
    if (o.effects) c.effects = o.effects;
    return c;
  }

  // Padrão de fundo
  const TILE = 563;
  const patternComp = component("Fundo/Padrão", (c) => {
    c.resize(TILE, TILE);
    c.clipsContent = true;
    const s = figma.createNodeFromSvg(ASSETS.pattern);
    s.fills = [];
    s.resize(TILE, TILE);
    c.appendChild(s);
    for (const v of s.findAll((x) => x.type === "VECTOR")) v.strokes = [paint("accent")];
  });

  // Barra de status
  const statusComp = component("Barra de status", (c) => {
    asAuto(c, "HORIZONTAL", { pad: [14, 24, 0, 28], justify: "SPACE_BETWEEN", align: "CENTER" });
    fixed(c, SW, STATUS_H);
    c.appendChild(T("9:41", "bodyStrong", "text"));
    const island = figma.createRectangle();
    island.name = "Ilha";
    island.resize(118, 34);
    island.cornerRadius = 17;
    island.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    c.appendChild(island);
    const sig = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="38" height="10" viewBox="0 0 38 10"><rect x="0" y="5" width="3" height="5" rx="1" fill="#1A1A1A"/><rect x="4.5" y="3.5" width="3" height="6.5" rx="1" fill="#1A1A1A"/><rect x="9" y="2" width="3" height="8" rx="1" fill="#1A1A1A"/><rect x="13.5" y="0" width="3" height="10" rx="1" fill="#1A1A1A"/><rect x="20" y=".5" width="16" height="9" rx="2.5" stroke="#1A1A1A" fill="none"/><rect x="21.5" y="2" width="11" height="6" rx="1.2" fill="#1A1A1A"/><rect x="36.6" y="3.5" width="1.4" height="3" rx=".7" fill="#1A1A1A"/></svg>');
    sig.name = "Sinal e bateria";
    sig.fills = [];
    sig.resize(51, 13.4);
    c.appendChild(sig);
  });

  // Ícones de categoria (componentes, para trocar dentro do card sem foto)
  const CATEGORIES = [
    ["Assistência Técnica", "wrench"], ["Automotivo", "car"], ["Elétrica", "lightning"], ["Hidráulica", "drop"], ["Limpeza", "broom"],
    ["Montagem de Móveis", "hammer"], ["Pintura", "paint"], ["Jardinagem", "plant"], ["Reformas", "hammer"], ["Beleza", "scissors"],
    ["Saúde", "heartbeat"], ["Aulas", "graduation"], ["Tecnologia", "laptop"], ["Fretes e Mudanças", "truck"], ["Eventos", "calendar"],
    ["Alimentação", "fork"], ["Pets", "paw"], ["Fitness", "barbell"], ["Jurídico", "scales"], ["Contabilidade", "dollar"],
  ];
  const CAT_ICON = Object.fromEntries(CATEGORIES);
  const catIconComp = {};
  for (const [name, ic] of CATEGORIES) {
    if (catIconComp[ic]) continue;
    catIconComp[ic] = component("Ícone de categoria/" + name, (c) => {
      c.resize(28, 28);
      const i = icon(ic, 28, "primary");
      c.appendChild(i);
    });
  }

  // Card de anúncio
  const CARD_W = SW - 2 * M;
  const P = {};
  const cardComp = component("Card de anúncio", (c) => {
    asAuto(c, "HORIZONTAL", { gap: 12, pad: 12, radius: 20, fill: "surface", stroke: "border", align: "MIN" });
    widthOnly(c, CARD_W);
    const photo = figma.createFrame();
    photo.name = "Foto";
    photo.resize(84, 84);
    photo.cornerRadius = 14;
    photo.clipsContent = true;
    photo.fills = imageFill("eletricista");
    c.appendChild(photo);
    // Sem foto: fundo primarySoft com o ícone da categoria
    const ph = figma.createFrame();
    ph.name = "Sem foto";
    ph.resize(84, 84);
    ph.fills = [paint("primarySoft")];
    photo.appendChild(ph);
    const phIcon = catIconComp.lightning.createInstance();
    ph.appendChild(phIcon);
    phIcon.x = 28; phIcon.y = 28;
    // Selo Destaque sobre a foto
    const badge = box("HORIZONTAL", { name: "Destaque", gap: 3, pad: [3, 7], radius: 999, fill: "accent", align: "CENTER" });
    photo.appendChild(badge);
    badge.appendChild(icon("rocket-fill", 11, "ink"));
    badge.appendChild(T("Destaque", "small", "ink", { font: F.semibold }));
    badge.x = 5; badge.y = 84 - 5 - 22;
    const info = box("VERTICAL", { name: "Informações", gap: 3 });
    put(c, info, "FILL");
    const top = box("HORIZONTAL", { name: "Título e favorito", gap: 8, align: "MIN" });
    put(info, top, "FILL");
    const title = put(top, T("Eletricista residencial e predial", "cardTitle", "ink", { name: "Título" }), "FILL");
    try { title.textTruncation = "ENDING"; title.maxLines = 2; } catch (e) {}
    const heart = figma.createFrame();
    heart.name = "Favorito";
    heart.resize(22, 22);
    heart.fills = [];
    top.appendChild(heart);
    const hOut = icon("heart", 22, "textMuted");
    heart.appendChild(hOut);
    const hIn = icon("heart-fill", 22, "primary");
    hIn.name = "Favoritado";
    heart.appendChild(hIn);
    const cat = put(info, T("Elétrica", "caption", "textMuted", { name: "Categoria" }), "FILL");
    const local = put(info, T("Centro · publicado há 23 dias", "caption", "textMuted", { name: "Local" }), "FILL");
    for (const t of [cat, local]) { try { t.textTruncation = "ENDING"; t.maxLines = 1; } catch (e) {} }
    const row = box("HORIZONTAL", { name: "Preço e nota", gap: 10, align: "CENTER" });
    put(info, row, "FILL");
    row.paddingTop = 3;
    const price = T("a partir de R$ 80", "bodyStrong", "primary", { name: "Preço" });
    row.appendChild(price);
    const rate = box("HORIZONTAL", { name: "Nota", gap: 3, align: "CENTER" });
    row.appendChild(rate);
    rate.appendChild(icon("star", 14, "accent"));
    const rateT = T("4,8 (23)", "label", "text", { name: "Nota" });
    rate.appendChild(rateT);
    P.title = c.addComponentProperty("Título", "TEXT", "Eletricista residencial e predial");
    P.cat = c.addComponentProperty("Categoria", "TEXT", "Elétrica");
    P.local = c.addComponentProperty("Local", "TEXT", "Centro · publicado há 23 dias");
    P.price = c.addComponentProperty("Preço", "TEXT", "a partir de R$ 80");
    P.rating = c.addComponentProperty("Nota", "TEXT", "4,8 (23)");
    P.hasRating = c.addComponentProperty("Tem nota", "BOOLEAN", true);
    P.featured = c.addComponentProperty("Destaque", "BOOLEAN", false);
    P.fav = c.addComponentProperty("Favoritado", "BOOLEAN", false);
    P.noPhoto = c.addComponentProperty("Sem foto", "BOOLEAN", false);
    P.catIcon = c.addComponentProperty("Ícone da categoria", "INSTANCE_SWAP", catIconComp.lightning.id);
    // Estado padrão do componente: sem selo, sem favorito, com foto
    badge.visible = false; hIn.visible = false; ph.visible = false;
    title.componentPropertyReferences = { characters: P.title };
    cat.componentPropertyReferences = { characters: P.cat };
    local.componentPropertyReferences = { characters: P.local };
    price.componentPropertyReferences = { characters: P.price };
    rateT.componentPropertyReferences = { characters: P.rating };
    rate.componentPropertyReferences = { visible: P.hasRating };
    badge.componentPropertyReferences = { visible: P.featured };
    hIn.componentPropertyReferences = { visible: P.fav };
    ph.componentPropertyReferences = { visible: P.noPhoto };
    phIcon.componentPropertyReferences = { mainComponent: P.catIcon };
  });
  function card(parent, d) {
    const i = cardComp.createInstance();
    parent.appendChild(i);
    i.layoutSizingHorizontal = "FILL";
    const props = {
      [P.title]: d.title, [P.cat]: d.cat, [P.local]: d.local, [P.price]: d.price,
      [P.rating]: d.rating || "", [P.hasRating]: !!d.rating, [P.featured]: !!d.featured, [P.fav]: !!d.fav,
      [P.noPhoto]: !d.photo,
    };
    const ic = CAT_ICON[d.cat] || "wrench";
    props[P.catIcon] = catIconComp[ic].id;
    i.setProperties(props);
    if (d.photo) { const ph = i.findOne((n) => n.name === "Foto"); if (ph) ph.fills = imageFill(d.photo); }
    return i;
  }

  // Botões
  const BTN = {};
  function buttonComp(kind) {
    return component("Botão/" + kind, (c) => {
      const o = {
        "Primário": { fill: "primary", color: "textOnDark" },
        "Secundário": { fill: "surface", stroke: "borderStrong", color: "ink" },
        "Destaque (fundo escuro)": { fill: "accent", color: "ink" },
        "Texto": { color: "primary" },
        "Perigo": { color: "danger" },
      }[kind];
      asAuto(c, "HORIZONTAL", { gap: 8, pad: kind === "Texto" || kind === "Perigo" ? [10, 4] : [16, 20], radius: 999, fill: o.fill, stroke: o.stroke, align: "CENTER", justify: "CENTER" });
      if (!o.fill) c.fills = [];
      const t = T("Continuar", "button", o.color, { name: "Texto" });
      c.appendChild(t);
      BTN[kind] = c.addComponentProperty("Texto", "TEXT", "Continuar");
      t.componentPropertyReferences = { characters: BTN[kind] };
    });
  }
  const btnComp = {};
  for (const k of ["Primário", "Secundário", "Destaque (fundo escuro)", "Texto", "Perigo"]) btnComp[k] = buttonComp(k);
  function button(parent, label, kind, o) {
    o = o || {};
    const i = btnComp[kind || "Primário"].createInstance();
    parent.appendChild(i);
    i.setProperties({ [BTN[kind || "Primário"]]: label });
    if (o.fill !== false && kind !== "Texto" && kind !== "Perigo") i.layoutSizingHorizontal = "FILL";
    if (o.disabled) i.opacity = 0.4;
    if (o.icon) {
      // ícone antes do texto: o botão vira um frame comum (cópia desvinculada do componente)
      const f = i.detachInstance();
      const ic = icon(o.icon, 20, kind === "Secundário" ? "ink" : kind === "Texto" ? "primary" : "textOnDark");
      f.insertChild(0, ic);
      return f;
    }
    return i;
  }

  // Barras de abas
  const TABS = {
    visitante: [["Início", "house"], ["Anúncios", "squares"], ["Favoritos", "heart"], ["Conta", "user"]],
    profissional: [["Início", "house"], ["Anúncios", "squares"], ["Favoritos", "heart"], ["Gerenciar", "storefront"], ["Conta", "user"]],
  };
  const tabComps = {};
  function tabBar(modeName, active) {
    const key = modeName + "/" + active;
    if (!tabComps[key]) {
      tabComps[key] = component("Barra de abas/" + (modeName === "visitante" ? "Visitante" : "Profissional") + " · " + active, (c) => {
        asAuto(c, "HORIZONTAL", { pad: [10, 20, 10, 20], radius: 32, fill: "surface", stroke: "border", justify: "SPACE_BETWEEN", align: "CENTER", effects: SHADOWS.floating });
        c.resize(SW - 2 * M, 64);
        c.primaryAxisSizingMode = "FIXED";
        for (const [label, ic] of TABS[modeName]) {
          const on = label === active;
          const tab = box("VERTICAL", { name: "Aba " + label, gap: 2, align: "CENTER" });
          c.appendChild(tab);
          tab.appendChild(icon(on ? ic + "-fill" : ic, 24, on ? "primary" : "textMuted"));
          tab.appendChild(T(label, "small", on ? "primary" : "textMuted", { font: on ? F.semibold : undefined }));
        }
      });
    }
    return tabComps[key].createInstance();
  }

  // Todas as variações já ficam prontas na seção de componentes
  for (const [m, tabs] of Object.entries(TABS)) for (const [label] of tabs) tabBar(m, label).remove();

  // Campo de formulário
  const FIELD = {};
  const fieldComp = component("Campo", (c) => {
    asAuto(c, "VERTICAL", { gap: 6 });
    c.resize(CARD_W, 10);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    const lab = put(c, T("E-mail", "label", "text", { name: "Rótulo" }), "FILL");
    const b = box("HORIZONTAL", { name: "Caixa", pad: [15, 16], radius: 16, fill: "surface", stroke: "border", align: "CENTER", gap: 8 });
    put(c, b, "FILL");
    const val = put(b, T("nome@exemplo.com.br", "body", "textMuted", { name: "Valor" }), "FILL");
    const help = put(c, T("Texto de ajuda", "caption", "textMuted", { name: "Ajuda" }), "FILL");
    FIELD.label = c.addComponentProperty("Rótulo", "TEXT", "E-mail");
    FIELD.value = c.addComponentProperty("Valor", "TEXT", "nome@exemplo.com.br");
    FIELD.help = c.addComponentProperty("Ajuda", "TEXT", "Texto de ajuda");
    FIELD.hasHelp = c.addComponentProperty("Tem ajuda", "BOOLEAN", false);
    lab.componentPropertyReferences = { characters: FIELD.label };
    val.componentPropertyReferences = { characters: FIELD.value };
    help.visible = false;
    help.componentPropertyReferences = { characters: FIELD.help, visible: FIELD.hasHelp };
  });
  function field(parent, label, value, o) {
    o = o || {};
    const i = fieldComp.createInstance();
    parent.appendChild(i);
    i.layoutSizingHorizontal = "FILL";
    i.setProperties({ [FIELD.label]: label, [FIELD.value]: value || o.placeholder || "", [FIELD.help]: o.help || "", [FIELD.hasHelp]: !!o.help });
    const v = i.findOne((n) => n.name === "Valor");
    if (v && value) v.fills = [paint("text")];
    if (o.focus) { const bx = i.findOne((n) => n.name === "Caixa"); if (bx) { bx.strokes = [paint("primary")]; bx.strokeWeight = 1.5; } }
    if (o.trailing || o.tall) {
      const f = i.detachInstance();
      const bx = f.findOne((n) => n.name === "Caixa");
      if (o.trailing) bx.appendChild(icon(o.trailing, 20, "textMuted"));
      if (o.tall) { bx.counterAxisAlignItems = "MIN"; bx.minHeight = 132; }
      return f;
    }
    return i;
  }

  // Organiza a seção de componentes
  {
    let x = 80, y = 100, colW = 0;
    for (const c of comps) {
      compSection.appendChild(c);
      if (y + c.height > 1900) { x += colW + 80; y = 100; colW = 0; }
      c.x = x; c.y = y;
      y += c.height + 48;
      colW = Math.max(colW, c.width);
    }
    compSection.resizeWithoutConstraints(x + colW + 80, 2000);
  }

  // =============================================================================================
  // 5. Peças das telas (padrões montados com auto layout)
  // =============================================================================================
  function screenFrame(name) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(SW, SH);
    f.fills = [paint("background")];
    f.clipsContent = true;
    return f;
  }
  function chip(parent, label, o) {
    o = o || {};
    const on = !!o.on;
    const c = box("HORIZONTAL", { name: "Chip " + label, gap: 6, pad: [8, 14, 8, o.icon ? 12 : 14], radius: 999, fill: on ? "ink" : "surface", stroke: on ? "ink" : "border", align: "CENTER" });
    parent.appendChild(c);
    if (o.icon) c.appendChild(icon(o.icon, 16, on ? "textOnDark" : "primary"));
    c.appendChild(T(label, "label", on ? "textOnDark" : "text"));
    if (o.check && on) c.insertChild(0, icon("check", 14, "textOnDark"));
    return c;
  }
  function wrapRow(parent, name, gap) {
    const r = box("HORIZONTAL", { name, gap: gap || 8 });
    put(parent, r, "FILL");
    r.layoutWrap = "WRAP";
    r.counterAxisSpacing = gap || 8;
    return r;
  }
  function searchPill(parent, text, o) {
    o = o || {};
    const s = box("HORIZONTAL", { name: "Busca", gap: 10, pad: [13, 16], radius: 999, fill: o.inBlock ? "background" : "surface", stroke: o.focus ? "primary" : o.inBlock ? null : "border", sw: o.focus ? 1.5 : 1, align: "CENTER" });
    put(parent, s, "FILL");
    s.appendChild(icon("search", 20, "textMuted"));
    put(s, T(text, "body", o.typed ? "text" : "textMuted"), "FILL");
    if (o.clear) s.appendChild(icon("x", 18, "textMuted"));
    return s;
  }
  function topBar(parent, title, o) {
    o = o || {};
    const b = box("HORIZONTAL", { name: "Barra superior", gap: 12, pad: [4, 0, 8, 0], align: "CENTER" });
    put(parent, b, "FILL");
    if (!o.noBack) b.appendChild(icon(o.close ? "x" : "back", 24, "ink"));
    put(b, T(title, "heading", "ink"), "FILL");
    for (const r of o.right || []) {
      if (typeof r === "string" && ASSETS.icons[r]) b.appendChild(icon(r, 22, "ink"));
      else b.appendChild(T(r, "button", "primary"));
    }
    return b;
  }
  function bigTitle(parent, title, o) {
    o = o || {};
    const b = box("VERTICAL", { name: "Título da aba", gap: 4, pad: [6, 0, 2, 0] });
    put(parent, b, "FILL");
    const row = box("HORIZONTAL", { gap: 6, align: "CENTER" });
    b.appendChild(row);
    row.appendChild(T(title, "title", "ink"));
    if (o.caret) row.appendChild(icon("caret-down", 18, "ink"));
    if (o.sub) put(b, T(o.sub, "caption", "textMuted"), "FILL");
    return b;
  }
  function sectionHead(parent, title, action) {
    const h = box("HORIZONTAL", { name: "Cabeçalho de seção", justify: "SPACE_BETWEEN", align: "CENTER", pad: [8, 2, 0, 2] });
    put(parent, h, "FILL");
    h.appendChild(T(title, "heading", "ink"));
    if (action) h.appendChild(T(action, "button", "primary"));
    return h;
  }
  function groupLabel(parent, text) { return put(parent, T(text, "label", "textMuted", { name: "Nome do grupo" }), "FILL"); }
  function listGroup(parent, rows, o) {
    o = o || {};
    const g = box("VERTICAL", { name: o.name || "Grupo de lista", radius: 20, fill: "surface", stroke: "border", clip: true });
    put(parent, g, "FILL");
    rows.forEach((r, i) => {
      const row = box("HORIZONTAL", { name: "Linha " + r.label, gap: 12, pad: [r.sub ? 12 : 16, 16], align: "CENTER" });
      put(g, row, "FILL");
      if (i < rows.length - 1) { row.strokes = [paint("border")]; row.strokeTopWeight = 0; row.strokeLeftWeight = 0; row.strokeRightWeight = 0; row.strokeBottomWeight = 1; row.strokeAlign = "INSIDE"; }
      if (r.icon) row.appendChild(icon(r.icon, 22, r.danger ? "danger" : r.iconColor || "textMuted"));
      const txt = box("VERTICAL", { gap: 2 });
      put(row, txt, "FILL");
      put(txt, T(r.label, r.strong ? "bodyStrong" : "body", r.danger ? "danger" : "text"), "FILL");
      if (r.sub) put(txt, T(r.sub, "caption", "textMuted"), "FILL");
      if (r.value) row.appendChild(T(r.value, r.valueStrong ? "bodyStrong" : "caption", r.valueColor || "textMuted"));
      if (r.badge) row.appendChild(r.badge());
      if (r.check) row.appendChild(icon("check", 20, "primary"));
      if (r.caret !== false && !r.check && !r.danger && r.caret) row.appendChild(icon("caret-right", 18, "textMuted"));
    });
    return g;
  }
  function badge(text, kind) {
    const k = {
      ativo: ["primarySoft", "primary"], pausado: ["neutralSoft", "textMuted"], revisao: ["accentSoft", "accentText"],
      rascunho: ["neutralSoft", "textMuted"], novo: ["accentSoft", "accentText"], verificado: ["primarySoft", "primary"],
      sucesso: ["successSoft", "success"], perigo: ["dangerSoft", "danger"], destaque: ["accent", "ink"],
    }[kind];
    const b = box("HORIZONTAL", { name: "Selo " + text, gap: 4, pad: [3, 9], radius: 999, fill: k[0], align: "CENTER" });
    if (kind === "verificado") b.appendChild(icon("seal", 13, "primary"));
    if (kind === "destaque") b.appendChild(icon("rocket-fill", 12, "ink"));
    b.appendChild(T(text, "small", k[1], { font: F.semibold }));
    return b;
  }
  function note(parent, text, kind) {
    const k = { info: ["primarySoft", "info", "primary"], sucesso: ["successSoft", "check-circle", "success"], aviso: ["accentSoft", "warning", "accentText"] }[kind || "info"];
    const n = box("HORIZONTAL", { name: "Aviso", gap: 10, pad: [12, 14], radius: 16, fill: k[0], align: "MIN" });
    put(parent, n, "FILL");
    n.appendChild(icon(k[1], 20, k[2]));
    put(n, T(text, "caption", "text"), "FILL");
    return n;
  }
  function progress(parent, step, total, label) {
    const p = box("VERTICAL", { name: "Progresso", gap: 8, pad: [0, 0, 4, 0] });
    put(parent, p, "FILL");
    put(p, T(`Passo ${step} de ${total} · ${label}`, "label", "textMuted"), "FILL");
    const track = figma.createFrame();
    track.name = "Trilho";
    track.resize(CARD_W, 6);
    track.cornerRadius = 3;
    track.fills = [paint("border")];
    put(p, track, "FILL");
    const bar = figma.createRectangle();
    bar.name = "Feito";
    bar.resize(Math.round(CARD_W * step / total), 6);
    bar.cornerRadius = 3;
    bar.fills = [paint("primary")];
    track.appendChild(bar);
    return p;
  }
  function headline(parent, title, text, o) {
    o = o || {};
    const h = box("VERTICAL", { name: "Título e texto", gap: 8, pad: [4, 0, 4, 0] });
    put(parent, h, "FILL");
    const t = put(h, T(title, o.small ? "title" : "display", "ink"), "FILL");
    if (o.highlight) t.setRangeFills(o.highlight[0], o.highlight[1], [paint("accentText")]);
    if (text) put(h, T(text, "body", "textMuted"), "FILL");
    return h;
  }
  function whiteBlock(parent, name, gap, pad) {
    const b = box("VERTICAL", { name, gap: gap == null ? 12 : gap, pad: pad == null ? 16 : pad, radius: 20, fill: "surface", stroke: "border" });
    put(parent, b, "FILL");
    return b;
  }
  function whiteRow(parent, name, pad) {
    const b = box("HORIZONTAL", { name, gap: 12, pad: pad == null ? [14, 16] : pad, radius: 20, fill: "surface", stroke: "border", align: "CENTER" });
    put(parent, b, "FILL");
    return b;
  }
  function avatar(initials, size, photo) {
    const a = box("HORIZONTAL", { name: "Avatar", radius: 999, fill: "primarySoft", justify: "CENTER", align: "CENTER" });
    fixed(a, size, size);
    if (photo) a.fills = imageFill(photo);
    else a.appendChild(T(initials, size > 48 ? "heading" : "label", "primary", { font: F.semibold }));
    return a;
  }
  function stat(parent, label, value, delta, deltaKind) {
    const s = whiteBlock(parent, "Métrica " + label, 4, 16);
    const top = box("HORIZONTAL", { justify: "SPACE_BETWEEN", align: "CENTER" });
    put(s, top, "FILL");
    put(top, T(label, "caption", "textMuted"), "FILL");
    if (delta) top.appendChild(badge(delta, deltaKind || "ativo"));
    top.counterAxisAlignItems = "MIN";
    top.itemSpacing = 8;
    s.appendChild(T(value, "number", "ink"));
    return s;
  }
  function otp(parent, filled) {
    const r = box("HORIZONTAL", { name: "Código", gap: 8 });
    put(parent, r, "FILL");
    for (let i = 0; i < 6; i++) {
      const b = box("HORIZONTAL", { name: "Dígito", radius: 14, fill: "surface", stroke: i === (filled || "").length ? "primary" : "border", sw: i === (filled || "").length ? 1.5 : 1, justify: "CENTER", align: "CENTER" });
      b.resize(40, 56);
      b.counterAxisSizingMode = "FIXED";
      put(r, b, "FILL");
      if (filled && filled[i]) b.appendChild(T(filled[i], "number", "ink"));
    }
    return r;
  }
  function segmented(parent, items, on) {
    const s = box("HORIZONTAL", { name: "Controle segmentado", gap: 4, pad: 4, radius: 999, fill: "neutralSoft" });
    put(parent, s, "FILL");
    items.forEach((t, i) => {
      const seg = box("HORIZONTAL", { name: t, pad: [9, 8], radius: 999, fill: i === on ? "surface" : null, justify: "CENTER", align: "CENTER", effects: i === on ? [shadow(1, 3, 0, 0.12)] : [] });
      put(s, seg, "FILL");
      seg.appendChild(T(t, "label", i === on ? "ink" : "textMuted", { font: i === on ? F.semibold : undefined }));
    });
    return s;
  }
  function option(parent, title, sub, price, on) {
    const o = box("HORIZONTAL", { name: "Opção " + title, gap: 12, pad: 16, radius: 20, fill: "surface", stroke: on ? "primary" : "border", sw: on ? 1.5 : 1, align: "CENTER" });
    put(parent, o, "FILL");
    o.appendChild(icon(on ? "radio-on" : "radio", 22, on ? "primary" : "borderStrong"));
    const t = box("VERTICAL", { gap: 2 });
    put(o, t, "FILL");
    put(t, T(title, "cardTitle", "ink"), "FILL");
    put(t, T(sub, "caption", "textMuted"), "FILL");
    o.appendChild(T(price, "bodyStrong", "ink"));
    return o;
  }
  function checkRow(parent, text, on) {
    const r = box("HORIZONTAL", { name: "Caixa de seleção", gap: 10, align: "CENTER", pad: [4, 0] });
    put(parent, r, "FILL");
    r.appendChild(icon(on ? "checkbox" : "square", 22, on ? "primary" : "textMuted"));
    put(r, T(text, "body", "text"), "FILL");
    const i = text.indexOf("Termos de Uso") >= 0 ? text.indexOf("Termos de Uso") : text.indexOf("Política de Privacidade");
    if (i >= 0) r.children[1].setRangeFills(i, text.length, [paint("primary")]);
    return r;
  }
  function toast(frame, text, y) {
    const t = box("HORIZONTAL", { name: "Toast", gap: 8, pad: [11, 16], radius: 999, fill: "ink", align: "CENTER", effects: SHADOWS.toast });
    frame.appendChild(t);
    t.appendChild(icon("check-circle", 18, "accent"));
    t.appendChild(T(text, "label", "textOnDark"));
    t.x = Math.round((SW - t.width) / 2);
    t.y = y;
    return t;
  }
  function emptyState(parent, ic, title, text, cta) {
    const e = box("VERTICAL", { name: "Estado vazio", gap: 12, pad: [40, 16, 24, 16], align: "CENTER" });
    put(parent, e, "FILL");
    const circle = box("HORIZONTAL", { radius: 999, fill: "primarySoft", justify: "CENTER", align: "CENTER" });
    fixed(circle, 72, 72);
    e.appendChild(circle);
    circle.appendChild(icon(ic, 32, "primary"));
    put(e, T(title, "title", "ink", { align: "CENTER" }), "FILL");
    put(e, T(text, "body", "textMuted", { align: "CENTER" }), "FILL");
    if (cta) { const sp = box("VERTICAL", { pad: [8, 0, 0, 0] }); put(e, sp, "FILL"); button(sp, cta, "Primário"); }
    return e;
  }
  function chart(parent) {
    const c = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="311" height="120" viewBox="0 0 311 120"><path d="M0 119.5H311" stroke="#E5E7EB" fill="none"/><path d="M0 59.5H311" stroke="#E5E7EB" fill="none" stroke-dasharray="3 4"/><path d="M0 88 L22 76 L44 80 L66 62 L88 70 L110 48 L132 56 L154 40 L176 52 L198 30 L220 44 L242 26 L264 38 L286 18 L311 28" stroke="#0B7A75" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 98 L22 94 L44 96 L66 86 L88 90 L110 80 L132 84 L154 74 L176 80 L198 68 L220 74 L242 64 L264 70 L286 58 L311 62" stroke="#FDA333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    c.name = "Gráfico";
    c.fills = [];
    put(parent, c, "FILL");
    return c;
  }

  // Tela: monta conteúdo, ajusta altura, fundo, barra inferior e abas
  function makeScreen(def, build) {
    const f = screenFrame(def.id + " — " + def.name);
    const st = statusComp.createInstance();
    f.appendChild(st);
    st.x = 0; st.y = 0;
    const content = box("VERTICAL", { name: "Conteúdo", gap: def.gap == null ? 16 : def.gap, pad: [def.padTop == null ? 4 : def.padTop, M, 0, M] });
    f.appendChild(content);
    content.x = 0; content.y = STATUS_H;
    content.resize(SW, 10);
    content.primaryAxisSizingMode = "AUTO";
    content.counterAxisSizingMode = "FIXED";
    const ctx = { frame: f, content, bottom: null };
    build(content, ctx);
    let bottomH = 0;
    if (def.tab) bottomH = 16 + 64 + 24;
    if (ctx.bottom) bottomH = Math.max(bottomH, ctx.bottom.height);
    const H = def.fixedHeight ? SH : Math.max(SH, Math.ceil(STATUS_H + content.height + bottomH + 24));
    f.resize(SW, H);
    // Fundo com o padrão (35%)
    const pat = figma.createFrame();
    pat.name = "Padrão de fundo";
    pat.fills = [];
    pat.resize(SW, H);
    pat.opacity = 0.35;
    pat.clipsContent = true;
    f.insertChild(0, pat);
    for (let y = 0; y < H; y += TILE) { const i = patternComp.createInstance(); pat.appendChild(i); i.x = 0; i.y = y; }
    pat.locked = true;
    if (ctx.bottom) { f.appendChild(ctx.bottom); ctx.bottom.x = 0; ctx.bottom.y = H - ctx.bottom.height; }
    if (def.tab) { const tb = tabBar(def.tab[0], def.tab[1]); f.appendChild(tb); tb.x = M; tb.y = H - 24 - 64; }
    f.appendChild(st);
    st.x = 0; st.y = 0;
    if (ctx.after) ctx.after(f, H);
    return f;
  }
  function bottomBar(ctx, build) {
    const b = box("VERTICAL", { name: "Barra de ação", gap: 8, pad: [12, M, 28, M], fill: "surface" });
    b.strokes = [paint("border")]; b.strokeTopWeight = 1; b.strokeBottomWeight = 0; b.strokeLeftWeight = 0; b.strokeRightWeight = 0; b.strokeAlign = "INSIDE";
    b.resize(SW, 10);
    b.primaryAxisSizingMode = "AUTO";
    b.counterAxisSizingMode = "FIXED";
    build(b);
    ctx.bottom = b;
    return b;
  }
  function sheetOver(f, H, title, build, o) {
    o = o || {};
    const scrim = figma.createRectangle();
    scrim.name = "Fundo escurecido";
    scrim.resize(SW, H);
    scrim.fills = [paint("ink", 0.32)];
    f.appendChild(scrim);
    const sh = box("VERTICAL", { name: "Folha · " + title, gap: 16, pad: [10, 20, 32, 20], fill: "surface", effects: SHADOWS.sheet });
    sh.topLeftRadius = sh.topRightRadius = 24;
    f.appendChild(sh);
    sh.resize(SW, 10);
    sh.primaryAxisSizingMode = "AUTO";
    sh.counterAxisSizingMode = "FIXED";
    const grabRow = box("HORIZONTAL", { name: "Puxador", justify: "CENTER" });
    put(sh, grabRow, "FILL");
    const grab = figma.createRectangle();
    grab.name = "Puxador";
    grab.resize(40, 5);
    grab.cornerRadius = 3;
    grab.fills = [paint("borderStrong")];
    grabRow.appendChild(grab);
    const head = box("HORIZONTAL", { name: "Cabeçalho da folha", align: "CENTER", gap: 12 });
    put(sh, head, "FILL");
    put(head, T(title, "title", "ink"), "FILL");
    const close = box("HORIZONTAL", { name: "Fechar", radius: 999, fill: "neutralSoft", justify: "CENTER", align: "CENTER" });
    fixed(close, 36, 36);
    head.appendChild(close);
    close.appendChild(icon("x", 18, "ink"));
    build(sh);
    sh.x = 0;
    sh.y = H - sh.height;
    return sh;
  }

  // =============================================================================================
  // 6. Dados de exemplo (os mesmos do app)
  // =============================================================================================
  const L = {
    montagem: { title: "Montagem de móveis com garantia de 90 dias", cat: "Montagem de Móveis", local: "Costa e Silva · publicado há 25 dias", price: "a partir de R$ 60", featured: true },
    aulas: { title: "Aulas particulares de matemática", cat: "Aulas", local: "Anita Garibaldi · publicado em 21/10", price: "R$ 70 por hora", rating: "5,0 (9)", featured: true },
    eletricista: { title: "Eletricista residencial e predial", cat: "Elétrica", local: "Centro · publicado há 23 dias", price: "a partir de R$ 80", rating: "4,8 (23)", photo: "eletricista" },
    diarista: { title: "Diarista para casas e apartamentos", cat: "Limpeza", local: "América · publicado há 24 dias", price: "R$ 180 por dia", rating: "4,9 (127)", photo: "cozinha" },
    eletricista24: { title: "Eletricista 24 horas", cat: "Elétrica", local: "Vila Nova · publicado em 17/10", price: "A combinar", photo: "encanador" },
    pintura: { title: "Pintura residencial e comercial", cat: "Pintura", local: "Glória · publicado há 12 dias", price: "a partir de R$ 350", rating: "4,7 (31)", photo: "pintura" },
  };

  // =============================================================================================
  // 7. Telas
  // =============================================================================================
  const SCREENS = [];
  const S = (def, build) => SCREENS.push({ def, build });
  const V_TAB = (a) => ["visitante", a];
  const P_TAB = (a) => ["profissional", a];

  function homeContent(c) {
    const top = box("HORIZONTAL", { name: "Topo", justify: "SPACE_BETWEEN", align: "CENTER", pad: [4, 2, 0, 2] });
    put(c, top, "FILL");
    top.appendChild(logo(22));
    const city = box("HORIZONTAL", { name: "Cidade", gap: 4, pad: [6, 12, 6, 10], radius: 999, fill: "surface", stroke: "border", align: "CENTER" });
    top.appendChild(city);
    city.appendChild(icon("pin", 16, "primary"));
    city.appendChild(T("Joinville", "label", "ink", { font: F.semibold }));
    city.appendChild(icon("caret-down", 14, "textMuted"));
    const sb = box("VERTICAL", { name: "Bloco de busca", gap: 16, pad: [20, 18, 18, 18], radius: 28, fill: "surface", stroke: "border" });
    put(c, sb, "FILL");
    const q = put(sb, T("Qual serviço você procura?", "display", "ink"), "FILL");
    q.setRangeFills(5, 12, [paint("accentText")]);
    searchPill(sb, "Eletricista, diarista, montador…", { inBlock: true });
    sectionHead(c, "Publicados recentemente", "Ver todos");
    const list = box("VERTICAL", { name: "Lista", gap: 12 });
    put(c, list, "FILL");
    return list;
  }

  // ---------------- Visitante ----------------
  S({ id: "V01", name: "Início", group: "Visitante", before: "V01", tab: V_TAB("Início"),
    notes: ["Logo, cidade em pílula e o bloco \"Qual serviço você procura?\" com a palavra que gira em accentText, como no site.", "Card de anúncio compacto: foto 84 à esquerda, título em 2 linhas, preço em primary. O selo Destaque vai sobre a foto; o card deixa de ter borda laranja.", "Anúncio sem foto mostra o ícone da categoria sobre primarySoft."] },
    (c) => { const l = homeContent(c); card(l, L.montagem); card(l, L.aulas); card(l, L.eletricista); card(l, L.diarista); button(c, "Ver todos em Joinville", "Secundário"); });

  S({ id: "V02", name: "Início · escolher cidade", group: "Visitante", before: "V02", fixedHeight: true,
    notes: ["Folha com puxador, título em App/Título e botão de fechar redondo.", "Cidade escolhida em negrito com o ícone e o check em primary.", "\"Usar minha localização\" vira uma linha de ação com ícone em primarySoft."] },
    (c, ctx) => { const l = homeContent(c); card(l, L.montagem); card(l, L.aulas);
      ctx.after = (f, H) => sheetOver(f, H, "Onde você procura?", (sh) => {
        searchPill(sh, "Buscar cidade", { inBlock: true });
        const loc = box("HORIZONTAL", { name: "Usar minha localização", gap: 12, align: "CENTER" });
        put(sh, loc, "FILL");
        const ic = box("HORIZONTAL", { radius: 999, fill: "primarySoft", justify: "CENTER", align: "CENTER" }); fixed(ic, 36, 36); loc.appendChild(ic); ic.appendChild(icon("crosshair", 18, "primary"));
        loc.appendChild(T("Usar minha localização", "button", "primary"));
        groupLabel(sh, "Cidades com anúncios");
        const list = box("VERTICAL", { name: "Cidades" }); put(sh, list, "FILL");
        for (const [name, on] of [["Joinville, SC", true], ["Araquari, SC", false], ["Jaraguá do Sul, SC", false], ["São Francisco do Sul, SC", false]]) {
          const r = box("HORIZONTAL", { name, gap: 12, pad: [14, 2], align: "CENTER" });
          r.strokes = [paint("border")]; r.strokeTopWeight = 1; r.strokeBottomWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; r.strokeAlign = "INSIDE";
          put(list, r, "FILL");
          r.appendChild(icon("pin", 20, on ? "primary" : "textMuted"));
          put(r, T(name, on ? "bodyStrong" : "body", "text"), "FILL");
          if (on) r.appendChild(icon("check", 20, "primary"));
        }
      }); });

  function searchTop(c, text, o) {
    const r = box("HORIZONTAL", { name: "Barra de busca", gap: 12, align: "CENTER", pad: [4, 0, 0, 0] });
    put(c, r, "FILL");
    r.appendChild(icon("back", 24, "ink"));
    searchPill(r, text, o);
    const where = box("HORIZONTAL", { name: "Cidade da busca", gap: 6, align: "CENTER", pad: [0, 2] });
    put(c, where, "FILL");
    where.appendChild(icon("pin", 16, "textMuted"));
    where.appendChild(T("Em Joinville, SC ·", "caption", "textMuted"));
    where.appendChild(T("Trocar cidade", "label", "primary", { font: F.semibold }));
  }
  function filterBar(c, count) {
    const r = box("HORIZONTAL", { name: "Filtros e ordem", gap: 8 });
    put(c, r, "FILL");
    chip(r, "Filtros", { icon: "filters" });
    chip(r, "Ordenar: mais recentes", { icon: "sort" });
    if (count) put(c, T(count, "label", "textMuted"), "FILL");
  }

  S({ id: "V03", name: "Busca", group: "Visitante", before: "V03",
    notes: ["Campo de busca em pílula com borda primary quando ativo; a cidade fica logo abaixo, com \"Trocar cidade\" em link.", "Categorias em grade de 2 colunas: card branco, raio 16, ícone em primarySoft."] },
    (c) => { searchTop(c, "Eletricista, diarista, montador…", { focus: true }); sectionHead(c, "Explorar por categoria");
      const grid = wrapRow(c, "Categorias", 10);
      for (const [name, ic] of CATEGORIES) {
        const t = box("HORIZONTAL", { name, gap: 10, pad: [12, 12], radius: 16, fill: "surface", stroke: "border", align: "CENTER" });
        grid.appendChild(t);
        t.resize((CARD_W - 10) / 2, 52); t.primaryAxisSizingMode = "FIXED"; t.counterAxisSizingMode = "FIXED";
        const ib = box("HORIZONTAL", { radius: 10, fill: "primarySoft", justify: "CENTER", align: "CENTER" }); fixed(ib, 30, 30); t.appendChild(ib); ib.appendChild(icon(ic, 18, "primary"));
        put(t, T(name, "label", "text"), "FILL");
      } });

  S({ id: "V04", name: "Busca · sugestões", group: "Visitante", before: "V04",
    notes: ["Sugestões de categoria como linhas de lista dentro de um grupo branco.", "Filtros e ordem viram chips com ícone; a contagem fica em App/Rótulo."] },
    (c) => { searchTop(c, "ele", { focus: true, typed: true, clear: true }); groupLabel(c, "Categorias");
      listGroup(c, [{ label: "Elétrica", icon: "lightning", iconColor: "primary", caret: true }, { label: "Beleza", icon: "scissors", iconColor: "primary", caret: true }]);
      filterBar(c, "2 profissionais em Joinville"); const l = box("VERTICAL", { gap: 12 }); put(c, l, "FILL"); card(l, L.eletricista); card(l, L.eletricista24); });

  S({ id: "V05", name: "Busca · resultados", group: "Visitante", before: "V05",
    notes: ["Mesmo card das listas; nada de layout diferente por tela.", "Termo digitado em text, com botão de limpar."] },
    (c) => { searchTop(c, "eletricista", { typed: true, clear: true }); filterBar(c, "2 profissionais em Joinville"); const l = box("VERTICAL", { gap: 12 }); put(c, l, "FILL"); card(l, L.eletricista); card(l, L.eletricista24); });

  function exploreContent(c) {
    bigTitle(c, "Anúncios em Joinville", { caret: true });
    searchPill(c, "Eletricista, diarista, montador…");
    filterBar(c);
    const chips = box("HORIZONTAL", { name: "Categorias", gap: 8 });
    put(c, chips, "FILL");
    chips.clipsContent = false;
    chip(chips, "Todas", { on: true, check: true }); chip(chips, "Assistência Técnica", { icon: "wrench" }); chip(chips, "Automotivo", { icon: "car" });
    put(c, T("14 profissionais em Joinville", "label", "textMuted"), "FILL");
    const l = box("VERTICAL", { name: "Lista", gap: 12 }); put(c, l, "FILL");
    return l;
  }
  S({ id: "V06", name: "Anúncios", group: "Visitante", before: "V06", tab: V_TAB("Anúncios"),
    notes: ["Título da aba em App/Título com a cidade (toque abre a folha de cidade).", "Categorias numa fileira de chips que rola de lado; selecionado em ink.", "Lista com o card padrão, 12 de espaço entre cards."] },
    (c) => { const l = exploreContent(c); for (const k of ["montagem", "aulas", "eletricista", "diarista", "pintura", "eletricista24"]) card(l, L[k]); });

  S({ id: "V07", name: "Anúncios · filtros", group: "Visitante", before: "V07", fixedHeight: true,
    notes: ["Folha com grupos nomeados (Categoria, Preço) e chips que quebram linha.", "Ações fixas no rodapé: Limpar (secundário) e Ver 14 profissionais (primário)."] },
    (c, ctx) => { const l = exploreContent(c); card(l, L.montagem); card(l, L.aulas);
      ctx.after = (f, H) => sheetOver(f, H, "Filtros", (sh) => {
        groupLabel(sh, "Categoria");
        const w = wrapRow(sh, "Categorias", 8);
        chip(w, "Todas", { on: true, check: true });
        for (const [n, ic] of CATEGORIES.slice(0, 9)) chip(w, n, { icon: ic });
        groupLabel(sh, "Preço");
        const w2 = wrapRow(sh, "Tipos de preço", 8);
        chip(w2, "Qualquer", { on: true, check: true });
        for (const n of ["Preço fechado", "A partir de", "Por hora", "Por dia", "A combinar"]) chip(w2, n);
        const act = box("HORIZONTAL", { name: "Ações", gap: 10, pad: [8, 0, 0, 0] }); put(sh, act, "FILL");
        button(act, "Limpar", "Secundário"); button(act, "Ver 14 profissionais", "Primário");
      }); });

  S({ id: "V08", name: "Anúncios · ordenar", group: "Visitante", before: "V08", fixedHeight: true,
    notes: ["Opções como linhas com check em primary na escolhida.", "A regra \"destaques aparecem primeiro\" vira aviso informativo."] },
    (c, ctx) => { const l = exploreContent(c); card(l, L.montagem); card(l, L.aulas);
      ctx.after = (f, H) => sheetOver(f, H, "Ordenar por", (sh) => {
        const list = box("VERTICAL", { name: "Opções" }); put(sh, list, "FILL");
        [["Mais recentes", true], ["Menor preço", false], ["Maior preço", false], ["Nome (A–Z)", false]].forEach(([n, on], i) => {
          const r = box("HORIZONTAL", { name: n, pad: [14, 2], align: "CENTER" }); put(list, r, "FILL");
          if (i) { r.strokes = [paint("border")]; r.strokeTopWeight = 1; r.strokeBottomWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; r.strokeAlign = "INSIDE"; }
          put(r, T(n, on ? "bodyStrong" : "body", on ? "ink" : "text"), "FILL"); if (on) r.appendChild(icon("check", 20, "primary"));
        });
        note(sh, "Anúncios em destaque aparecem primeiro em qualquer ordem.");
      }); });

  S({ id: "V09", name: "Anúncio", group: "Visitante", before: "V09",
    notes: ["Galeria com raio 24, selos (Destaque, categoria) e título em App/Display, como o anúncio do site.", "Profissional em card branco com avatar, selo Verificado e nota.", "Rodapé fixo com Chamar no WhatsApp (primário) e Ligar (secundário)."] },
    (c, ctx) => {
      const bar = box("HORIZONTAL", { name: "Barra superior", gap: 16, align: "CENTER", pad: [4, 0, 0, 0] }); put(c, bar, "FILL");
      bar.appendChild(icon("back", 24, "ink")); const sp = box("HORIZONTAL"); put(bar, sp, "FILL"); bar.appendChild(icon("dots", 24, "ink")); bar.appendChild(icon("heart", 24, "ink"));
      const g = figma.createRectangle(); g.name = "Galeria"; g.resize(CARD_W, 214); g.cornerRadius = 24; g.fills = imageFill("eletricista-wide"); put(c, g, "FILL");
      const chips = box("HORIZONTAL", { name: "Selos", gap: 8 }); put(c, chips); chips.appendChild(badge("Destaque", "destaque")); const catBadge = badge("Elétrica", "verificado"); catBadge.children[0].remove(); chips.appendChild(catBadge);
      const h = box("VERTICAL", { name: "Título e preço", gap: 6 }); put(c, h, "FILL");
      put(h, T("Eletricista residencial e predial", "display", "ink"), "FILL");
      const pr = box("HORIZONTAL", { gap: 12, align: "CENTER" }); put(h, pr, "FILL");
      pr.appendChild(T("a partir de R$ 80", "bodyStrong", "primary"));
      const rt = box("HORIZONTAL", { gap: 3, align: "CENTER" }); pr.appendChild(rt); rt.appendChild(icon("star", 16, "accent")); rt.appendChild(T("4,8 · 23 avaliações", "label", "text"));
      const pro = whiteRow(c, "Profissional", [12, 14]);
      pro.appendChild(avatar("RC", 46));
      const pi = box("VERTICAL", { gap: 2 }); put(pro, pi, "FILL"); pi.appendChild(T("Rafael Costa", "cardTitle", "ink"));
      const vv = box("HORIZONTAL", { gap: 4, align: "CENTER" }); pi.appendChild(vv); vv.appendChild(icon("seal", 14, "primary")); vv.appendChild(T("Verificado · no Conkat desde 2026", "caption", "primary"));
      pro.appendChild(icon("caret-right", 18, "textMuted"));
      sectionHead(c, "Sobre o serviço");
      put(c, T("Instalação e manutenção elétrica em casas e prédios. Troca de disjuntores, tomadas e chuveiros, quadros de distribuição e laudos. Atendo com hora marcada e deixo o local limpo.", "body", "text"), "FILL");
      listGroup(c, [{ label: "Área atendida", sub: "Centro · Joinville, SC", icon: "pin" }, { label: "Como cobra", sub: "A partir de R$ 80, combinado pelo WhatsApp", icon: "receipt" }]);
      sectionHead(c, "Avaliações");
      const av = whiteBlock(c, "Avaliações", 12, 16);
      const rr = box("HORIZONTAL", { gap: 16, align: "CENTER" }); put(av, rr, "FILL");
      const sc = box("VERTICAL", { gap: 2 }); rr.appendChild(sc); sc.appendChild(T("4,8", "number", "ink"));
      const stars = box("HORIZONTAL", { gap: 1 }); sc.appendChild(stars); for (let i = 0; i < 5; i++) stars.appendChild(icon("star", 13, "accent"));
      sc.appendChild(T("23 avaliações", "small", "textMuted"));
      const bars = box("VERTICAL", { gap: 5 }); put(rr, bars, "FILL");
      for (const [n, v] of [["5", 0.86], ["4", 0.1], ["3", 0.04], ["2", 0], ["1", 0]]) {
        const br = box("HORIZONTAL", { gap: 8, align: "CENTER" }); put(bars, br, "FILL"); br.appendChild(T(n, "small", "textMuted"));
        const tr = figma.createFrame(); tr.name = "Barra"; tr.resize(200, 6); tr.cornerRadius = 3; tr.fills = [paint("primarySoft")]; put(br, tr, "FILL");
        if (v) { const fl = figma.createRectangle(); fl.resize(Math.max(4, Math.round(200 * v)), 6); fl.cornerRadius = 3; fl.fills = [paint("primary")]; tr.appendChild(fl); }
      }
      const rate = box("HORIZONTAL", { name: "Avaliar", gap: 8, align: "CENTER", pad: [4, 0, 0, 0] }); put(av, rate, "FILL");
      put(rate, T("Já contratou? Dê sua nota", "caption", "textMuted"), "FILL");
      for (let i = 0; i < 5; i++) rate.appendChild(icon("star-outline", 22, "borderStrong"));
      bottomBar(ctx, (b) => { const r = box("HORIZONTAL", { gap: 10 }); put(b, r, "FILL"); const w = button(r, "Chamar no WhatsApp", "Primário", { icon: "whatsapp" }); w.layoutSizingHorizontal = "FILL"; const l2 = button(r, "Ligar", "Secundário", { icon: "phone" }); l2.layoutSizingHorizontal = "HUG"; });
    });

  S({ id: "V10", name: "Favoritos · vazio", group: "Visitante", before: "V10", tab: V_TAB("Favoritos"),
    notes: ["Estado vazio padrão: ícone em círculo primarySoft, título em App/Título, texto em textMuted e uma ação primária."] },
    (c) => { bigTitle(c, "Favoritos"); emptyState(c, "heart", "Nenhum favorito ainda", "Toque no coração de um anúncio para salvá-lo aqui. Fica guardado neste aparelho, sem precisar de conta.", "Ver profissionais em Joinville"); });

  S({ id: "V11", name: "Favoritos · com anúncios", group: "Visitante", before: "V11", tab: V_TAB("Favoritos"),
    notes: ["Subtítulo explica onde os favoritos ficam salvos.", "Coração preenchido em primary no card.", "Confirmação em toast escuro (ink) com ícone accent, como no site."] },
    (c, ctx) => { bigTitle(c, "Favoritos", { sub: "2 anúncios salvos neste aparelho, sem precisar de conta." }); sectionHead(c, "Em Joinville", "2");
      const l = box("VERTICAL", { gap: 12 }); put(c, l, "FILL"); card(l, Object.assign({}, L.aulas, { fav: true })); card(l, Object.assign({}, L.montagem, { fav: true }));
      ctx.after = (f, H) => toast(f, "Salvo nos favoritos", H - 24 - 64 - 64); });

  function proPromo(c, o) {
    o = o || {};
    const p = box("VERTICAL", { name: "Bloco para profissionais", gap: 14, pad: 20, radius: 24, fill: "ink" });
    put(c, p, "FILL");
    put(p, T("Para quem presta serviço", "label", "accent", { font: F.semibold }), "FILL");
    put(p, T(o.title || "Anuncie no Conkat. O cliente chama no seu WhatsApp.", "title", "textOnDark"), "FILL");
    put(p, T("Apareça para quem procura o seu serviço em Joinville e região, sem intermediário.", "body", "textOnDarkMuted"), "FILL");
    const offer = box("HORIZONTAL", { name: "Oferta", gap: 10 }); put(p, offer, "FILL");
    for (const [v, t] of [["14 dias", "no ar sem custo no primeiro anúncio"], ["R$ 0", "por contato recebido"]]) {
      const tile = box("VERTICAL", { gap: 4, pad: 14, radius: 16, fill: "inkSoft" }); put(offer, tile, "FILL");
      tile.appendChild(T(v, "number", "accent")); put(tile, T(t, "caption", "textOnDarkMuted"), "FILL");
    }
    if (o.steps) {
      const st = box("VERTICAL", { name: "Passos", gap: 10, pad: [4, 0, 0, 0] }); put(p, st, "FILL");
      ["Cadastro com CPF ou CNPJ", "Anúncio em cinco etapas", "Revisão da equipe e anúncio no ar"].forEach((s, i) => {
        const r = box("HORIZONTAL", { gap: 10, align: "CENTER" }); put(st, r, "FILL");
        const n = box("HORIZONTAL", { radius: 999, fill: i === 2 ? "accent" : null, stroke: i === 2 ? null : "textOnDarkMuted", justify: "CENTER", align: "CENTER" }); fixed(n, 26, 26); r.appendChild(n);
        n.appendChild(T(String(i + 1), "small", i === 2 ? "ink" : "textOnDark", { font: F.semibold })); put(r, T(s, "body", "textOnDark"), "FILL");
      });
    }
    const btns = box("VERTICAL", { gap: 8, pad: [4, 0, 0, 0] }); put(p, btns, "FILL");
    button(btns, o.cta || "Criar conta de prestador", "Destaque (fundo escuro)");
    const ghost = button(btns, "Já tenho conta", "Texto"); ghost.layoutSizingHorizontal = "FILL";
    const gt = ghost.findOne((n) => n.type === "TEXT"); if (gt) gt.fills = [paint("textOnDark")];
    return p;
  }
  function settingsVisitor(c) {
    bigTitle(c, "Conta");
    proPromo(c);
    put(c, T("Para procurar e falar com profissionais não precisa de conta.", "caption", "textMuted", { align: "CENTER" }), "FILL");
    groupLabel(c, "Preferências");
    listGroup(c, [{ label: "Cidade padrão", icon: "pin", value: "Joinville, SC", caret: true }, { label: "Favoritos", icon: "heart", caret: true }]);
    put(c, T("Versão 1.0.0", "caption", "textMuted", { align: "CENTER" }), "FILL");
  }
  S({ id: "V12", name: "Conta", group: "Visitante", before: "V12", tab: V_TAB("Conta"),
    notes: ["Convite para profissionais no bloco escuro do site: oferta em dois números (14 dias, R$ 0) e CTA accent.", "Preferências em grupo de lista branco com ícones neutros.", "Laranja sai dos botões comuns e fica só para destaque e CTA em fundo escuro."] },
    (c) => settingsVisitor(c));

  S({ id: "V13", name: "Entrar", group: "Visitante", before: "V13", fixedHeight: true,
    notes: ["Folha com campos padrão (rótulo em cima, caixa branca raio 16).", "Link \"Esqueci minha senha\" alinhado à direita; ação principal Entrar; criar conta como secundário."] },
    (c, ctx) => { settingsVisitor(c);
      ctx.after = (f, H) => sheetOver(f, H, "Entrar", (sh) => {
        put(sh, T("Entre para criar e acompanhar seus anúncios.", "body", "textMuted"), "FILL");
        field(sh, "E-mail", "", { placeholder: "nome@exemplo.com.br" }); field(sh, "Senha", "", { placeholder: "Sua senha", trailing: "eye" });
        const fg = box("HORIZONTAL", { justify: "MAX" }); put(sh, fg, "FILL"); fg.appendChild(T("Esqueci minha senha", "button", "primary"));
        button(sh, "Entrar", "Primário");
        put(sh, T("Ainda não anuncia no Conkat?", "caption", "textMuted", { align: "CENTER" }), "FILL");
        button(sh, "Criar conta de prestador", "Secundário");
      }); });

  S({ id: "V14", name: "Meus anúncios · sem conta", group: "Visitante", before: "V14", tab: V_TAB("Conta"),
    notes: ["Mesmo bloco escuro da Conta, agora com os três passos do site (cadastro, anúncio, revisão).", "Uma mensagem só, sem repetir o texto da Conta."] },
    (c) => { bigTitle(c, "Meus anúncios"); proPromo(c, { title: "Anuncie seu serviço no Conkat.", steps: true, cta: "Criar meu primeiro anúncio" }); });

  // ---------------- Cadastro ----------------
  S({ id: "V15", name: "Criar conta · seus dados", group: "Cadastro", before: "V15",
    notes: ["Progresso com texto (Passo 1 de 2 · Seus dados) e trilho de 6 px.", "Grupos de campos com nome em App/Rótulo; ajuda embaixo de cada campo.", "Botão Criar conta fixo no rodapé."] },
    (c, ctx) => { topBar(c, "Criar conta de prestador"); progress(c, 1, 2, "Seus dados");
      headline(c, "Seu perfil de prestador", "Leva um minuto. Em seguida você confirma o e-mail com um código e já entra na conta.");
      groupLabel(c, "Sobre você"); field(c, "Nome ou nome do negócio", "", { placeholder: "Como os clientes vão te ver", help: "Aparece nos seus anúncios." });
      field(c, "Telefone com DDD", "", { placeholder: "(47) 99999-0000", help: "É o número que os clientes vão chamar no WhatsApp." });
      groupLabel(c, "Acesso"); field(c, "E-mail", "", { placeholder: "nome@exemplo.com.br" }); field(c, "Crie uma senha", "", { placeholder: "Mínimo de 8 caracteres", trailing: "eye" });
      groupLabel(c, "Documento"); field(c, "CPF ou CNPJ", "", { placeholder: "000.000.000-00", help: "Usado só para verificar sua identidade. Não aparece nos anúncios." });
      checkRow(c, "Li e aceito os Termos de Uso", false); checkRow(c, "Li e aceito a Política de Privacidade", false);
      bottomBar(ctx, (b) => { button(b, "Criar conta", "Primário"); const r = box("HORIZONTAL", { gap: 4, justify: "CENTER", align: "CENTER" }); put(b, r, "FILL"); r.appendChild(T("Já tem conta?", "caption", "textMuted")); r.appendChild(T("Entrar", "button", "primary")); }); });

  S({ id: "V16", name: "Criar conta · confirmar e-mail", group: "Cadastro", before: "V16",
    notes: ["Aviso de sucesso (successSoft) confirma a conta criada.", "Código em 6 caixas separadas, com a caixa atual em primary.", "Confirmar depois como ação de texto."] },
    (c, ctx) => { topBar(c, "Criar conta de prestador"); progress(c, 2, 2, "Confirmar e-mail"); note(c, "Conta criada. Falta só confirmar o e-mail para entrar.", "sucesso");
      headline(c, "Confira seu e-mail", "Digite o código que enviamos para joao@exemplo.com.br."); otp(c, "");
      put(c, T("Confira também a caixa de spam.", "caption", "textMuted"), "FILL"); c.appendChild(T("Reenviar código", "button", "primary"));
      bottomBar(ctx, (b) => { button(b, "Confirmar e-mail", "Primário"); const t = button(b, "Confirmar depois", "Texto"); t.layoutSizingHorizontal = "FILL"; }); });

  S({ id: "V17", name: "Esqueci a senha · e-mail", group: "Cadastro", before: "V17",
    notes: ["Mesma estrutura de etapas do cadastro: barra superior, progresso, título em App/Display, campo e ação no rodapé."] },
    (c, ctx) => { topBar(c, "Redefinir senha"); progress(c, 1, 2, "Seu e-mail"); headline(c, "Esqueceu a senha?", "Informe o e-mail da sua conta. Vamos mandar um código para você criar uma senha nova.");
      field(c, "E-mail", "", { placeholder: "nome@exemplo.com.br" }); bottomBar(ctx, (b) => button(b, "Enviar código", "Primário")); });

  S({ id: "V18", name: "Esqueci a senha · código e senha nova", group: "Cadastro", before: "V18",
    notes: ["Código em caixas (mesmo padrão da confirmação de e-mail).", "Campos de senha com o ícone de mostrar senha.", "\"Usar outro e-mail\" como link."] },
    (c, ctx) => { topBar(c, "Redefinir senha"); progress(c, 2, 2, "Senha nova"); headline(c, "Crie a senha nova", "Se joao@exemplo.com.br tiver conta no Conkat, o código chega em instantes.");
      groupLabel(c, "Código recebido por e-mail"); otp(c, ""); put(c, T("Confira também a caixa de spam.", "caption", "textMuted"), "FILL");
      field(c, "Senha nova", "", { placeholder: "Mínimo de 8 caracteres", trailing: "eye" }); field(c, "Repita a senha nova", "", { placeholder: "Igual à de cima", trailing: "eye" });
      c.appendChild(T("Usar outro e-mail", "button", "primary")); bottomBar(ctx, (b) => button(b, "Salvar senha nova", "Primário")); });

  S({ id: "V19", name: "Completar cadastro (login social)", group: "Cadastro", before: "V19",
    notes: ["Estado de tempo esgotado no padrão de estado vazio (ícone, título, texto, ação).", "Antes era só uma frase solta no topo."] },
    (c) => { topBar(c, "Completar cadastro"); emptyState(c, "clock", "O tempo para concluir acabou", "Entre de novo com o mesmo login para continuar o cadastro.", "Voltar para Entrar"); });

  // ---------------- Profissional ----------------
  function manageCard(parent, d) {
    const k = whiteBlock(parent, "Anúncio · " + d.title, 12, 14);
    const head = box("HORIZONTAL", { gap: 12, align: "MIN" }); put(k, head, "FILL");
    const ph = figma.createFrame(); ph.name = "Foto"; ph.resize(64, 64); ph.cornerRadius = 12; ph.clipsContent = true;
    if (d.photo) ph.fills = imageFill(d.photo); else { ph.fills = [paint("primarySoft")]; const ic = icon(CAT_ICON[d.cat] || "wrench", 24, "primary"); ph.appendChild(ic); ic.x = 20; ic.y = 20; }
    head.appendChild(ph);
    const info = box("VERTICAL", { gap: 4 }); put(head, info, "FILL");
    info.appendChild(badge(d.status[0], d.status[1]));
    put(info, T(d.title, "cardTitle", "ink"), "FILL");
    put(info, T(d.when, "caption", "textMuted"), "FILL");
    if (d.days) {
      const dd = box("VERTICAL", { gap: 6 }); put(k, dd, "FILL");
      const r = box("HORIZONTAL", { justify: "SPACE_BETWEEN" }); put(dd, r, "FILL"); r.appendChild(T(d.days[0], "label", "ink", { font: F.semibold })); r.appendChild(T(d.days[1], "caption", "textMuted"));
      const tr = figma.createFrame(); tr.name = "Prazo"; tr.resize(300, 6); tr.cornerRadius = 3; tr.fills = [paint("border")]; put(dd, tr, "FILL");
      const fl = figma.createRectangle(); fl.resize(Math.round(300 * d.days[2]), 6); fl.cornerRadius = 3; fl.fills = [paint("accent")]; tr.appendChild(fl);
    }
    if (d.stats) {
      const st = box("HORIZONTAL", { gap: 24, pad: [4, 0] }); put(k, st, "FILL");
      for (const [v, l] of d.stats) { const s = box("VERTICAL", { gap: 0 }); st.appendChild(s); s.appendChild(T(v, "title", "ink")); s.appendChild(T(l, "caption", "textMuted")); }
    }
    if (d.note) note(k, d.note, d.noteKind || "info");
    if (d.actions) {
      const a = box("HORIZONTAL", { gap: 8, align: "CENTER" }); put(k, a, "FILL");
      for (const [t, ic, kind] of d.actions) {
        if (!t) { const sp = box("HORIZONTAL"); put(a, sp, "FILL"); a.appendChild(icon(ic, 22, "danger")); continue; }
        const b = chip(a, t, { icon: ic });
        if (kind === "primary") { b.fills = [paint("primary")]; b.strokes = [paint("primary")]; for (const n of b.findAll((x) => x.type === "TEXT")) n.fills = [paint("textOnDark")]; for (const v of b.findAll((x) => x.type === "VECTOR")) v.fills = [paint("textOnDark")]; }
      }
    }
    return k;
  }
  S({ id: "P01", name: "Meus anúncios", group: "Profissional", before: "P01", tab: P_TAB("Gerenciar"),
    notes: ["Resumo da conta em dois cards (saldo e desempenho) com números em App/Número.", "Cada anúncio em card branco com selo de status colorido por estado: Ativo (primary), Em revisão (accent), Pausado e Rascunho (neutro).", "Prazo no ar com trilho accent; ações em chips; excluir só com ícone danger."] },
    (c) => { bigTitle(c, "Meus anúncios", { sub: "1 no ar · 1 em revisão · 1 pausado · 1 rascunho" });
      const top = box("HORIZONTAL", { gap: 10 }); put(c, top, "FILL");
      for (const [l, v, a] of [["Seu saldo", "R$ 50", "Ver extrato"], ["Exibições em 30 dias", "2.080", "Detalhes"]]) {
        const b = box("VERTICAL", { gap: 4, pad: 14, radius: 20, fill: "surface", stroke: "border" }); put(top, b, "FILL");
        put(b, T(l, "caption", "textMuted"), "FILL"); b.appendChild(T(v, "number", "ink")); b.appendChild(T(a, "button", "primary"));
      }
      button(c, "Novo anúncio", "Primário", { icon: "plus" });
      manageCard(c, { title: "Eletricista residencial e predial", cat: "Elétrica", photo: "eletricista", status: ["Ativo", "ativo"], when: "Publicado em 28/10/2026", days: ["Faltam 7 dias", "de 30 · até 27/11", 0.77], stats: [["162", "Visualizações"], ["1.031", "Exibições em buscas"]], actions: [["Impulsionar", "rocket"], ["Pausar", "pause"], [null, "trash"]] });
      manageCard(c, { title: "Eletricista 24 horas", cat: "Elétrica", photo: "encanador", status: ["Pausado", "pausado"], when: "Pausado em 15/11/2026", actions: [["Reativar", "rocket"], ["Editar", "pencil"], [null, "trash"]] });
      manageCard(c, { title: "Instalação de chuveiro e torneira elétrica", cat: "Hidráulica", status: ["Em revisão", "revisao"], when: "Enviado em 20/11/2026", note: "A equipe está revisando. Você recebe o resultado aqui no app." });
      manageCard(c, { title: "Conserto de ar-condicionado e geladeira", cat: "Assistência Técnica", status: ["Rascunho", "rascunho"], when: "Não enviado", actions: [["Continuar edição", "pencil", "primary"], [null, "trash"]] }); });

  S({ id: "P02", name: "Conta", group: "Profissional", before: "P02", tab: P_TAB("Conta"),
    notes: ["Perfil no topo em card branco com avatar e selo Verificado.", "Grupos de lista nomeados (Seus anúncios, Preferências, Segurança) com valor à direita.", "Sair da conta como linha danger no fim."] },
    (c) => { bigTitle(c, "Conta");
      const pr = whiteRow(c, "Perfil");
      pr.appendChild(avatar("JS", 52)); const pi = box("VERTICAL", { gap: 3 }); put(pr, pi, "FILL");
      pi.appendChild(T("João Silva", "cardTitle", "ink")); pi.appendChild(T("joao@exemplo.com.br", "caption", "textMuted")); pi.appendChild(badge("Verificado", "verificado"));
      pr.appendChild(icon("caret-right", 18, "textMuted"));
      groupLabel(c, "Seus anúncios");
      listGroup(c, [{ label: "Gerenciar anúncios", icon: "storefront", value: "1 de 4 no ar", caret: true }, { label: "Saldo e extrato", icon: "wallet", value: "R$ 50", caret: true }, { label: "Desempenho", icon: "chart", caret: true }]);
      groupLabel(c, "Preferências"); listGroup(c, [{ label: "Cidade padrão", icon: "pin", value: "Joinville, SC", caret: true }, { label: "Favoritos", icon: "heart", caret: true }]);
      groupLabel(c, "Segurança"); listGroup(c, [{ label: "Meus dados", icon: "id-card", caret: true }, { label: "Alterar senha", icon: "lock", caret: true }, { label: "Sair da conta", icon: "signout", danger: true }]);
      put(c, T("Versão 1.0.0", "caption", "textMuted", { align: "CENTER" }), "FILL"); });

  S({ id: "P03", name: "Perfil", group: "Profissional", before: "P03",
    notes: ["Dados em grupo de lista com rótulo à esquerda e valor à direita (antes: linhas soltas sem agrupamento).", "Status (Confirmado, Verificado) viram selos.", "Ação destrutiva em danger, separada no grupo Segurança."] },
    (c) => { topBar(c, "Meus dados", { right: ["Editar"] });
      const hd = box("HORIZONTAL", { gap: 14, align: "CENTER", pad: [4, 0] }); put(c, hd, "FILL"); hd.appendChild(avatar("JS", 64));
      const hi = box("VERTICAL", { gap: 2 }); put(hd, hi, "FILL"); hi.appendChild(T("João Silva", "title", "ink")); hi.appendChild(T("joao@exemplo.com.br", "caption", "textMuted"));
      listGroup(c, [{ label: "Nome", value: "João Silva" }, { label: "Telefone", value: "(47) 99999-0001" }, { label: "Sobre você", value: "Nada escrito ainda" }]);
      groupLabel(c, "Conta");
      listGroup(c, [{ label: "E-mail", badge: () => badge("Confirmado", "sucesso") }, { label: "CPF", value: "***.982.247-**" }, { label: "Verificação", badge: () => badge("Verificado", "verificado") }]);
      groupLabel(c, "Segurança"); listGroup(c, [{ label: "Alterar senha", icon: "lock", caret: true }, { label: "Sair de todos os aparelhos", icon: "signout", danger: true }]); });

  S({ id: "P04", name: "Saldo", group: "Profissional", before: "P04",
    notes: ["Saldo em bloco escuro (ink) com o número em App/Número accent, como os números da oferta no site.", "Como recarregar vira aviso informativo.", "Extrato em grupo de lista com valor positivo em success."] },
    (c) => { topBar(c, "Saldo e extrato");
      const s = box("VERTICAL", { name: "Saldo", gap: 6, pad: 20, radius: 24, fill: "ink" }); put(c, s, "FILL");
      s.appendChild(T("Saldo disponível", "label", "textOnDarkMuted")); s.appendChild(T("R$ 50", "number", "accent"));
      put(s, T("Usado para publicar e impulsionar anúncios.", "caption", "textOnDarkMuted"), "FILL");
      note(c, "Por enquanto o saldo é adicionado pela equipe do Conkat. Fale com o suporte para recarregar.");
      sectionHead(c, "Extrato");
      listGroup(c, [{ label: "Crédito inicial", sub: "01/11/2026 às 09:00 · saldo depois: R$ 50", value: "+ R$ 50", valueStrong: true, valueColor: "success", icon: "receipt" }]); });

  S({ id: "P05", name: "Desempenho do anúncio", group: "Profissional", before: "P05",
    notes: ["Período em controle segmentado (pílula).", "Métricas em cards com número em App/Número e variação em selo.", "Gráfico com as duas linhas do site: visualizações em primary, exibições em accent."] },
    (c) => { topBar(c, "Desempenho"); segmented(c, ["7 dias", "30 dias", "90 dias"], 1);
      put(c, T("23/10 a 21/11 · comparado aos 30 dias anteriores", "caption", "textMuted"), "FILL");
      const r1 = box("HORIZONTAL", { gap: 10 }); put(c, r1, "FILL"); stat(r1, "Exibições em buscas", "2.080", "+2%", "ativo"); stat(r1, "Visualizações", "329", "0%", "pausado");
      stat(c, "Taxa de abertura", "15,8%", "−0,4 p.p.", "perigo");
      const ch = whiteBlock(c, "Evolução diária", 12, 16); put(ch, T("Evolução diária", "heading", "ink"), "FILL");
      const lg = box("HORIZONTAL", { gap: 16 }); put(ch, lg, "FILL");
      for (const [t, k] of [["Visualizações", "primary"], ["Exibições", "accent"]]) { const i = box("HORIZONTAL", { gap: 6, align: "CENTER" }); lg.appendChild(i); const d = figma.createEllipse(); d.resize(8, 8); d.fills = [paint(k)]; i.appendChild(d); i.appendChild(T(t, "caption", "textMuted")); }
      chart(ch);
      const sm = box("HORIZONTAL", { gap: 16 }); put(ch, sm, "FILL");
      for (const [v, l] of [["329", "Total"], ["11", "Média por dia"], ["15", "Melhor dia (11/11)"]]) { const s = box("VERTICAL"); put(sm, s, "FILL"); s.appendChild(T(v, "bodyStrong", "ink")); s.appendChild(T(l, "caption", "textMuted")); } });

  function balanceRow(c) {
    const b = whiteRow(c, "Saldo");
    b.appendChild(icon("wallet", 22, "primary")); const t = box("VERTICAL"); put(b, t, "FILL"); t.appendChild(T("Seu saldo", "caption", "textMuted")); t.appendChild(T("R$ 50", "bodyStrong", "ink"));
    b.appendChild(T("Ver extrato", "button", "primary"));
  }
  S({ id: "P06", name: "Impulsionar anúncio", group: "Profissional", before: "P06",
    notes: ["Planos como opções com rádio; a escolhida ganha borda primary 1,5.", "Prazo vira aviso informativo.", "Botão desabilitado em 40% até escolher."] },
    (c, ctx) => { topBar(c, "Impulsionar anúncio"); headline(c, "Eletricista residencial e predial", "Anúncios impulsionados aparecem antes dos outros nas buscas da cidade, em qualquer ordenação.", { small: true });
      balanceRow(c); note(c, "Começa agora e vai no máximo até 27/11/2026, quando a publicação termina.");
      groupLabel(c, "Planos"); option(c, "Impulsionamento por 3 dias", "R$ 1,67 por dia", "R$ 5", false); option(c, "Impulsionamento por 7 dias", "R$ 1,43 por dia", "R$ 10", true); option(c, "Impulsionamento por 15 dias", "R$ 1,20 por dia", "R$ 18", false);
      bottomBar(ctx, (b) => { button(b, "Impulsionar por R$ 10", "Primário"); const t = button(b, "Voltar", "Texto"); t.layoutSizingHorizontal = "FILL"; }); });

  S({ id: "P07", name: "Publicar anúncio", group: "Profissional", before: "P07",
    notes: ["Mesmo padrão de planos do impulsionar.", "Regra da revisão explicada no texto de apoio do título.", "Estado inicial sem plano escolhido: botão desabilitado."] },
    (c, ctx) => { topBar(c, "Publicar anúncio"); headline(c, "Conserto de ar-condicionado e geladeira", "Escolha por quanto tempo o anúncio fica no ar. Ele passa pela revisão da equipe, e o prazo só começa a contar quando for aprovado.", { small: true });
      balanceRow(c); groupLabel(c, "Planos pagos");
      option(c, "Publicação por 1 dia", "1 dia", "R$ 1", false); option(c, "Publicação por 7 dias", "R$ 1 por dia", "R$ 7", false); option(c, "Publicação por 15 dias", "R$ 0,93 por dia", "R$ 14", false); option(c, "Publicação por 30 dias", "R$ 0,83 por dia", "R$ 25", false);
      bottomBar(ctx, (b) => { button(b, "Escolha um plano", "Primário", { disabled: true }); const t = button(b, "Publicar depois", "Texto"); t.layoutSizingHorizontal = "FILL"; }); });

  S({ id: "P08", name: "Verificar e-mail", group: "Profissional", before: "P08",
    notes: ["Mesmo padrão da confirmação do cadastro: título em App/Display, código em 6 caixas e ação no rodapé."] },
    (c, ctx) => { topBar(c, "Confirmar e-mail"); headline(c, "Confira seu e-mail", "Digite o código que enviamos para joao@exemplo.com.br."); otp(c, "");
      put(c, T("Confira também a caixa de spam.", "caption", "textMuted"), "FILL"); c.appendChild(T("Reenviar código", "button", "primary"));
      bottomBar(ctx, (b) => button(b, "Confirmar e-mail", "Primário")); });

  // ---------------- Novo anúncio ----------------
  const STEPS = ["Categoria", "Descrição", "Preço e área", "Fotos", "Revisão"];
  function wizard(c, ctx, step, title, o) {
    o = o || {};
    topBar(c, o.edit ? "Editar anúncio" : "Novo anúncio", { close: true });
    progress(c, step, 5, STEPS[step - 1]);
    if (title) headline(c, title, o.text);
    bottomBar(ctx, (b) => button(b, step === 5 ? "Salvar e escolher publicação" : "Continuar", "Primário"));
  }
  function categoryChips(c, selected) {
    const w = wrapRow(c, "Categorias", 8);
    for (const [n, ic] of CATEGORIES) chip(w, n, { icon: ic, on: n === selected });
  }
  S({ id: "A01", name: "Novo anúncio · 1 de 5 · categoria", group: "Novo anúncio", before: "A01",
    notes: ["Etapas com barra superior de fechar (x), progresso e título em App/Display.", "Categorias em chips com ícone; a escolhida em ink.", "Continuar fixo no rodapé."] },
    (c, ctx) => { wizard(c, ctx, 1, "Qual serviço você oferece?"); categoryChips(c, "Elétrica"); });
  S({ id: "A02", name: "Novo anúncio · 2 de 5 · descrição", group: "Novo anúncio", before: "A02",
    notes: ["Campos padrão; descrição em caixa alta com contador de caracteres na ajuda."] },
    (c, ctx) => { wizard(c, ctx, 2, "Conte sobre o seu serviço", { text: "Um bom título diz o que você faz. Na descrição, conte como trabalha e o que está incluso." });
      field(c, "Título do anúncio", "Eletricista residencial e predial", { help: "33 de 80 caracteres" });
      field(c, "Descrição", "Instalação e manutenção elétrica em casas e apartamentos. Troca de disjuntores, tomadas e chuveiros, com garantia do serviço.", { help: "128 de 2.000 caracteres", tall: true }); });
  S({ id: "A03", name: "Novo anúncio · 3 de 5 · preço e área", group: "Novo anúncio", before: "A03",
    notes: ["Forma de cobrar em chips (os mesmos tipos do filtro).", "Cidade em linha de lista que abre a folha de cidade; demais dados em campos padrão."] },
    (c, ctx) => { wizard(c, ctx, 3, "Preço e área de atendimento");
      groupLabel(c, "Como você cobra?"); const w = wrapRow(c, "Tipos de preço", 8);
      for (const n of ["Preço fechado", "A partir de", "Por hora", "Por dia", "A combinar"]) chip(w, n, { on: n === "A partir de", check: true });
      field(c, "Valor em reais", "80", { help: "Aparece como \"a partir de R$ 80\"." });
      groupLabel(c, "Onde você atende"); listGroup(c, [{ label: "Cidade", icon: "pin", value: "Joinville, SC", caret: true }]);
      field(c, "Bairro", "Centro"); field(c, "WhatsApp para contato", "(47) 99999-0001", { help: "Os clientes chamam neste número." }); });
  S({ id: "A04", name: "Novo anúncio · 4 de 5 · fotos", group: "Novo anúncio", before: "A04",
    notes: ["Grade de fotos em 3 colunas com raio 16; a primeira leva o selo Capa.", "Adicionar foto em caixa tracejada com ícone em primary."] },
    (c, ctx) => { wizard(c, ctx, 4, "Fotos do seu trabalho", { text: "Até 10 fotos em JPEG, PNG ou WebP, de até 5 MB. A primeira é a capa." });
      const g = wrapRow(c, "Fotos", 10); const sz = Math.floor((CARD_W - 20) / 3);
      ["eletricista", "encanador"].forEach((p, i) => {
        const f = figma.createFrame(); f.name = "Foto " + (i + 1); f.resize(sz, sz); f.cornerRadius = 16; f.clipsContent = true; f.fills = imageFill(p); g.appendChild(f);
        const x = box("HORIZONTAL", { radius: 999, fill: "ink", justify: "CENTER", align: "CENTER" }); fixed(x, 26, 26); f.appendChild(x); x.x = sz - 32; x.y = 6; x.appendChild(icon("x", 14, "textOnDark"));
        if (!i) { const cp = badge("Capa", "destaque"); f.appendChild(cp); cp.children[0].remove(); cp.x = 6; cp.y = sz - 28; }
      });
      const add = box("VERTICAL", { name: "Adicionar foto", gap: 6, radius: 16, fill: "surface", stroke: "borderStrong", justify: "CENTER", align: "CENTER" });
      g.appendChild(add); fixed(add, sz, sz); add.dashPattern = [6, 5]; add.appendChild(icon("camera", 24, "primary")); add.appendChild(T("Adicionar", "label", "primary", { font: F.semibold })); });
  S({ id: "A05", name: "Novo anúncio · 5 de 5 · revisão", group: "Novo anúncio", before: "A05",
    notes: ["Prévia usa o mesmo card de anúncio das listas, para o profissional ver exatamente o que o cliente vê.", "Aviso explica a revisão da equipe antes de publicar."] },
    (c, ctx) => { wizard(c, ctx, 5, "É assim que seu anúncio vai aparecer");
      card(c, Object.assign({}, L.eletricista, { rating: null, local: "Centro · novo no Conkat" }));
      const d = whiteBlock(c, "Descrição", 8, 16); put(d, T("Sobre o serviço", "heading", "ink"), "FILL");
      put(d, T("Instalação e manutenção elétrica em casas e apartamentos. Troca de disjuntores, tomadas e chuveiros, com garantia do serviço.", "body", "text"), "FILL");
      listGroup(c, [{ label: "WhatsApp", icon: "whatsapp", value: "(47) 99999-0001" }, { label: "Área atendida", icon: "pin", value: "Centro · Joinville" }]);
      note(c, "Depois de salvar, você escolhe por quanto tempo o anúncio fica no ar. A equipe revisa antes de publicar."); });
  S({ id: "A06", name: "Editar anúncio · rascunho", group: "Novo anúncio", before: "A06",
    notes: ["Edição reaproveita as etapas do novo anúncio, com o título \"Editar anúncio\" e os dados preenchidos."] },
    (c, ctx) => { wizard(c, ctx, 1, "Qual serviço você oferece?", { edit: true }); categoryChips(c, "Assistência Técnica"); });
  S({ id: "A07", name: "Editar anúncio · ativo (bloqueado)", group: "Novo anúncio", before: "A07",
    notes: ["Bloqueio no padrão de estado vazio, com o motivo e as saídas: pausar para editar ou voltar."] },
    (c) => { topBar(c, "Editar anúncio"); emptyState(c, "lock", "Este anúncio não pode ser editado agora", "Anúncios no ar não podem ser alterados. Só rascunho, recusado ou expirado podem ser editados.", "Voltar");
      const t = button(c, "Pausar anúncio para editar", "Texto"); t.layoutSizingHorizontal = "FILL"; });

  // =============================================================================================
  // 8. Quadro de padrões
  // =============================================================================================
  function doc(name, w) {
    const f = box("VERTICAL", { name, gap: 24, pad: 40, radius: 28, fill: "surface", stroke: "border" });
    f.resize(w, 10); f.primaryAxisSizingMode = "AUTO"; f.counterAxisSizingMode = "FIXED";
    return f;
  }
  function docTitle(parent, title, text) {
    const h = box("VERTICAL", { gap: 6 }); put(parent, h, "FILL");
    h.appendChild(T(title, "title", "ink"));
    if (text) put(h, T(text, "body", "textMuted"), "FILL");
  }
  const BOARD_W = 1560;
  const board = box("VERTICAL", { name: "Padrões do app", gap: 32, pad: 48, radius: 36, fill: "background", stroke: "border" });
  board.resize(BOARD_W, 10); board.primaryAxisSizingMode = "AUTO"; board.counterAxisSizingMode = "FIXED";
  page.appendChild(board);
  {
    const intro = box("VERTICAL", { gap: 10 }); put(board, intro, "FILL");
    intro.appendChild(logo(40));
    intro.appendChild(T("Padrões do app", "display", "ink", { font: F.display }));
    put(intro, T("O app passa a seguir o modelo das telas do site: fundo claro com o padrão de ícones a 35%, superfícies brancas com borda de 1 px, títulos em Unageo, texto em Inter, ação principal em primary e o laranja guardado para destaque. Tudo abaixo existe no arquivo como variável (cor/*, espaço/*, raio/*), estilo de texto (App/*) ou componente.", "body", "textMuted"), "FILL");
    const pr = box("HORIZONTAL", { gap: 16, pad: [8, 0, 0, 0] }); put(intro, pr, "FILL");
    for (const [t, x] of [
      ["Uma ação principal por tela", "Botão primary em pílula, de preferência no rodapé fixo. O resto é secundário ou link."],
      ["Laranja é destaque, não botão", "accent só no selo Destaque, na estrela, nos marcadores, no prazo e no CTA sobre fundo escuro."],
      ["Mesmo card em toda lista", "Início, busca, anúncios, favoritos e a prévia do anúncio usam o Card de anúncio."],
      ["Grupos antes de linhas soltas", "Configurações e dados ficam em grupos de lista brancos, com nome do grupo em App/Rótulo."],
    ]) { const b = box("VERTICAL", { gap: 6, pad: 20, radius: 20, fill: "surface", stroke: "border" }); put(pr, b, "FILL"); put(b, T(t, "cardTitle", "ink"), "FILL"); put(b, T(x, "caption", "textMuted"), "FILL"); }
  }
  // Cores
  {
    const d = doc("Cores", BOARD_W - 96); put(board, d, "FILL");
    docTitle(d, "Cores", "Variáveis cor/* na coleção Conkat. Contraste de texto: text e textMuted passam AA sobre surface e background; primary passa AA sobre surface.");
    const grid = wrapRow(d, "Amostras", 16);
    for (const [k, hex, use] of COLORS) {
      const s = box("VERTICAL", { name: k, gap: 0, radius: 16, fill: "surface", stroke: "border", clip: true }); grid.appendChild(s); widthOnly(s, 214);
      const sw = figma.createRectangle(); sw.name = "Cor"; sw.resize(214, 72); sw.fills = [paint(k)]; put(s, sw, "FILL");
      const t = box("VERTICAL", { gap: 2, pad: 12 }); put(s, t, "FILL");
      t.appendChild(T("cor/" + k, "label", "ink", { font: F.semibold })); t.appendChild(T(hex, "caption", "textMuted")); put(t, T(use, "small", "textMuted"), "FILL");
    }
  }
  // Tipografia
  {
    const d = doc("Tipografia", BOARD_W - 96); put(board, d, "FILL");
    docTitle(d, "Tipografia", "Estilos de texto App/*. Unageo SemiBold (−2%) para títulos e números, como no site; Inter para todo o resto. Antes, o app usava só a fonte do sistema em 700." + (hasUnageo ? "" : " (Unageo não instalada neste computador: os títulos aparecem em Inter.)"));
    for (const [k, t] of Object.entries(TYPE)) {
      const r = box("HORIZONTAL", { gap: 24, pad: [14, 0], align: "CENTER" }); put(d, r, "FILL");
      r.strokes = [paint("border")]; r.strokeTopWeight = 1; r.strokeBottomWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; r.strokeAlign = "INSIDE";
      const spec = box("VERTICAL", { gap: 2 }); r.appendChild(spec); widthOnly(spec, 300);
      spec.appendChild(T(t.name, "label", "ink", { font: F.semibold }));
      put(spec, T(`${t.font.family} ${t.font.style} · ${t.size}/${t.lh}${t.ls ? " · " + t.ls + "%" : ""}`, "caption", "textMuted"), "FILL");
      put(spec, T(t.use, "small", "textMuted"), "FILL");
      put(r, T(k === "number" ? "R$ 50 · 2.080 · 15,8%" : k === "display" ? "Qual serviço você procura?" : "Eletricista residencial e predial", k, "ink"), "FILL");
    }
  }
  // Espaçamento, raios, sombras e grade
  {
    const row = box("HORIZONTAL", { gap: 24, align: "MIN" }); put(board, row, "FILL");
    const sp = doc("Espaçamento", 10); put(row, sp, "FILL");
    docTitle(sp, "Espaçamento", "Variáveis espaço/*. Base de 4.");
    for (const [n, use] of SPACE) {
      const r = box("HORIZONTAL", { gap: 16, align: "CENTER" }); put(sp, r, "FILL");
      const lab = T(String(n), "bodyStrong", "ink"); r.appendChild(lab); lab.resize(32, lab.height);
      const bar = figma.createRectangle(); bar.resize(n * 4, 16); bar.cornerRadius = 4; bar.fills = [paint("accent")]; r.appendChild(bar);
      put(r, T(use, "caption", "textMuted"), "FILL");
    }
    const rd = doc("Raios", 10); put(row, rd, "FILL");
    docTitle(rd, "Raios", "Variáveis raio/*. Maiores que no app atual (8, 12, 16, 24), como no site.");
    const rr = wrapRow(rd, "Amostras", 16);
    for (const [n, use] of RADIUS) {
      const s = box("VERTICAL", { gap: 8 }); rr.appendChild(s);
      const b = figma.createRectangle(); b.resize(120, 72); b.cornerRadius = Math.min(n, 36); b.fills = [paint("primarySoft")]; b.strokes = [paint("primary")]; b.strokeWeight = 1.5; s.appendChild(b);
      s.appendChild(T(n === 999 ? "pílula" : String(n), "bodyStrong", "ink")); const u = T(use, "small", "textMuted"); u.textAutoResize = "HEIGHT"; u.resize(120, u.height); s.appendChild(u);
    }
    const sh = doc("Sombras", 10); put(row, sh, "FILL");
    docTitle(sh, "Sombras", "Só o que flutua tem sombra. O resto usa borda de 1 px em cor/border.");
    for (const [n, k, txt] of [["Flutuante", "floating", "Tab bar · y 6, desfoque 16, −8, ink 18%"], ["Folha", "sheet", "Folhas · y −8, desfoque 32, ink 16%"], ["Toast", "toast", "Toast · y 10, desfoque 24, −10, ink 35%"], ["Elevado", "raised", "Cards sobre foto · y 24, desfoque 48, −20, ink 45%"]]) {
      const r = box("HORIZONTAL", { gap: 16, align: "CENTER", pad: [8, 0] }); put(sh, r, "FILL");
      const b = box("HORIZONTAL", { radius: 16, fill: "surface", effects: SHADOWS[k] }); fixed(b, 72, 48); r.appendChild(b);
      const t = box("VERTICAL", { gap: 2 }); put(r, t, "FILL"); t.appendChild(T(n, "label", "ink", { font: F.semibold })); put(t, T(txt, "caption", "textMuted"), "FILL");
    }
  }
  // Grade da tela
  {
    const d = doc("Grade da tela", BOARD_W - 96); put(board, d, "FILL");
    docTitle(d, "Grade da tela", "Tela de 375 de largura (as telas que rolam aparecem com a altura total).");
    const items = [
      ["Margem lateral", "16 dos dois lados; o conteúdo tem 343 de largura."],
      ["Barra de status", "50 de altura, sobre o fundo da tela."],
      ["Entre blocos", "16 (gap do conteúdo). Seções ganham título em App/Seção."],
      ["Entre cards da lista", "12."],
      ["Tab bar", "Flutuante: 64 de altura, 16 das laterais e 24 do fundo; o conteúdo termina 24 acima dela."],
      ["Rodapé de ação", "Branco com borda no topo; 12 em cima, 28 embaixo (área segura); botões de 52 de altura."],
      ["Folha", "Raio 24 no topo, padding 20, puxador 40 × 5; fundo da tela escurece com ink a 32%."],
      ["Áreas de toque", "Mínimo de 44 × 44 (botões têm 52; linhas de lista, 54)."],
    ];
    const g = wrapRow(d, "Regras", 16);
    for (const [t, x] of items) { const b = box("VERTICAL", { gap: 4, pad: 16, radius: 16, fill: "background" }); g.appendChild(b); widthOnly(b, 343); b.appendChild(T(t, "label", "ink", { font: F.semibold })); put(b, T(x, "caption", "textMuted"), "FILL"); }
  }
  // Componentes e padrões
  {
    const d = doc("Componentes", BOARD_W - 96); put(board, d, "FILL");
    docTitle(d, "Componentes e padrões", "Os componentes ficam na seção Componentes, à esquerda. Os padrões montados (blocos, grupos, folhas) estão nas telas e descritos aqui.");
    const g = wrapRow(d, "Exemplos", 24);
    function ex(title, txt, build, w) {
      const b = box("VERTICAL", { name: title, gap: 12, pad: 20, radius: 20, fill: "background" }); g.appendChild(b);
      widthOnly(b, w || 420);
      b.appendChild(T(title, "cardTitle", "ink")); put(b, T(txt, "caption", "textMuted"), "FILL");
      const area = box("VERTICAL", { gap: 10 }); put(b, area, "FILL"); build(area);
    }
    ex("Botões", "Pílula, 52 de altura, App/Botão. Primário (primary), Secundário (branco com borda), Destaque (accent, só sobre ink), Texto e Perigo. Desabilitado: 40% de opacidade.", (a) => {
      button(a, "Chamar no WhatsApp", "Primário", { icon: "whatsapp" }); button(a, "Ver todos em Joinville", "Secundário"); button(a, "Criar conta de prestador", "Destaque (fundo escuro)"); button(a, "Escolha um plano", "Primário", { disabled: true });
      const r = box("HORIZONTAL", { gap: 16 }); a.appendChild(r); button(r, "Reenviar código", "Texto"); button(r, "Sair da conta", "Perigo"); });
    ex("Card de anúncio", "Foto 84 (raio 14), título em 2 linhas, categoria, local, preço em primary e nota. Propriedades: Destaque, Favoritado, Sem foto (mostra o ícone da categoria) e Ícone da categoria.", (a) => { card(a, L.eletricista); card(a, Object.assign({}, L.montagem, { fav: true })); }, 420);
    ex("Campos", "Rótulo em App/Rótulo, caixa branca raio 16, padding 15 × 16, ajuda em App/Legenda. Em foco: borda primary 1,5.", (a) => { field(a, "E-mail", "joao@exemplo.com.br"); field(a, "Telefone com DDD", "", { placeholder: "(47) 99999-0000", focus: true, help: "É o número que os clientes vão chamar no WhatsApp." }); });
    ex("Busca e chips", "Busca em pílula (branca com borda na tela, background dentro de blocos). Chips de 34: neutros brancos, selecionado em ink com check.", (a) => { searchPill(a, "Eletricista, diarista, montador…"); const w = wrapRow(a, "Chips", 8); chip(w, "Todas", { on: true, check: true }); chip(w, "Elétrica", { icon: "lightning" }); chip(w, "Filtros", { icon: "filters" }); });
    ex("Selos", "Pílula de 22, App/Pequeno semibold, cor de fundo suave + texto forte do mesmo tom.", (a) => { const w = wrapRow(a, "Selos", 8); w.appendChild(badge("Destaque", "destaque")); w.appendChild(badge("Verificado", "verificado")); w.appendChild(badge("Ativo", "ativo")); w.appendChild(badge("Em revisão", "revisao")); w.appendChild(badge("Pausado", "pausado")); w.appendChild(badge("Rascunho", "rascunho")); w.appendChild(badge("Confirmado", "sucesso")); w.appendChild(badge("−0,4 p.p.", "perigo")); });
    ex("Grupo de lista", "Branco, raio 20, borda; linhas de 54 com ícone 22 neutro, valor à direita e seta. Ação destrutiva em danger.", (a) => listGroup(a, [{ label: "Cidade padrão", icon: "pin", value: "Joinville, SC", caret: true }, { label: "Sair da conta", icon: "signout", danger: true }]));
    ex("Avisos", "Raio 16, ícone 20 e App/Legenda. Informativo (primarySoft), sucesso (successSoft) e atenção (accentSoft).", (a) => { note(a, "Anúncios em destaque aparecem primeiro em qualquer ordem."); note(a, "Conta criada. Falta só confirmar o e-mail.", "sucesso"); note(a, "Seu anúncio sai do ar em 2 dias.", "aviso"); });
    ex("Progresso e código", "Etapas com texto e trilho de 6. Código de 6 caixas (56 de altura, raio 14), caixa atual em primary.", (a) => { progress(a, 2, 5, "Descrição"); otp(a, "12"); });
    ex("Opção com preço", "Card com rádio, título, apoio e valor. Selecionada: borda primary 1,5.", (a) => { option(a, "Impulsionamento por 7 dias", "R$ 1,43 por dia", "R$ 10", true); option(a, "Impulsionamento por 3 dias", "R$ 1,67 por dia", "R$ 5", false); });
    ex("Bloco escuro", "ink, raio 24: rótulo accent, título branco, oferta em números accent e CTA Destaque. Usado para o convite a profissionais e o saldo.", (a) => proPromo(a), 420);
    ex("Estado vazio", "Ícone em círculo de 72 (primarySoft), título em App/Título, texto e uma ação.", (a) => emptyState(a, "heart", "Nenhum favorito ainda", "Toque no coração de um anúncio para salvá-lo aqui.", "Ver profissionais"));
    ex("Métrica e período", "Número em App/Número, variação em selo; período em controle segmentado.", (a) => { segmented(a, ["7 dias", "30 dias", "90 dias"], 1); stat(a, "Exibições em buscas", "2.080", "+2%", "ativo"); });
  }
  // Ícones
  {
    const d = doc("Ícones", BOARD_W - 96); put(board, d, "FILL");
    docTitle(d, "Ícones", "Phosphor, o mesmo pacote do app. Regular em 20–24 para interface, fill para aba ativa, favorito e estrela. Cor: textMuted (neutro), primary (ação/seleção), accent (destaque).");
    const g = wrapRow(d, "Ícones", 12);
    for (const n of Object.keys(ASSETS.icons)) {
      const b = box("VERTICAL", { gap: 6, pad: [12, 4], radius: 12, fill: "background", align: "CENTER" }); g.appendChild(b); widthOnly(b, 96);
      b.appendChild(icon(n, 24, "ink")); b.appendChild(T(n, "small", "textMuted"));
    }
  }

  // =============================================================================================
  // 9. Monta as telas em seções
  // =============================================================================================
  const GROUPS = ["Visitante", "Cadastro", "Profissional", "Novo anúncio"];
  let y = 0;
  board.x = 0; board.y = y;
  y += board.height + 160;
  compSection.x = 0; compSection.y = y;
  y += compSection.height + 160;
  let built = 0;
  for (const g of GROUPS) {
    const items = SCREENS.filter((s) => s.def.group === g);
    const sec = figma.createSection();
    sec.name = g;
    page.appendChild(sec);
    sec.x = 0; sec.y = y;
    let x = 80, maxH = 0;
    for (const { def, build } of items) {
      const lab = box("VERTICAL", { name: "Rótulo " + def.id, gap: 4 });
      sec.appendChild(lab); widthOnly(lab, SW);
      lab.appendChild(T(def.id + " · substitui o print " + def.before, "label", "accentText", { font: F.semibold }));
      put(lab, T(def.name, "title", "ink"), "FILL");
      lab.x = x; lab.y = 80;
      const f = makeScreen(def, build);
      sec.appendChild(f);
      f.x = x; f.y = 80 + lab.height + 20;
      const n = box("VERTICAL", { name: "Notas " + def.id, gap: 10, pad: 20, radius: 20, fill: "surface", stroke: "border" });
      sec.appendChild(n); widthOnly(n, SW);
      n.appendChild(T("O que muda", "cardTitle", "ink"));
      for (const t of def.notes) {
        const r = box("HORIZONTAL", { gap: 8, align: "MIN" }); put(n, r, "FILL");
        const dot = box("HORIZONTAL", { pad: [7, 0, 0, 0] }); r.appendChild(dot); const e = figma.createEllipse(); e.resize(6, 6); e.fills = [paint("accent")]; dot.appendChild(e);
        put(r, T(t, "caption", "text"), "FILL");
      }
      n.x = x; n.y = f.y + f.height + 24;
      maxH = Math.max(maxH, n.y + n.height);
      x += SW + 80;
      built++;
    }
    sec.resizeWithoutConstraints(x, maxH + 80);
    y += sec.height + 160;
  }

  // Liga os textos aos estilos App/*
  let linked = 0;
  for (const [t, id] of styleLinks) {
    try {
      if (t.removed) continue;
      if (typeof t.setTextStyleIdAsync === "function") await t.setTextStyleIdAsync(id); else t.textStyleId = id;
      linked++;
    } catch (e) {}
  }
  log(`Textos ligados aos estilos: ${linked}`);
  figma.viewport.scrollAndZoomIntoView([board]);

  return `Conkat: ${built} telas no novo design e o quadro de padrões em "${PAGE_NAME}".` + (hasUnageo ? "" : " A Unageo não está instalada: títulos em Inter.");
}
