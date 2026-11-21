// Conkat — Telas do app (as mesmas que aparecem no site)
// Monta, num arquivo do Figma, cada tela do app que o site mostra, separada e editável:
// Início, Onde você procura?, Busca, Anúncio e o anúncio anotado de "Antes de chamar".
//
// Como rodar: abra o arquivo no Figma, rode o plugin "Scripter", apague o exemplo,
// cole este arquivo inteiro e clique em Run. Pode ser rodado mais de uma vez: ele apaga
// e recria só a página que ele mesmo cria ("Telas do site").
//
// Este arquivo é gerado por build.mjs (fotos, ícones, logo e padrão vêm do site).
// Para mudar o desenho, edite code.template.js e rode: node figma/conkat-telas-app/build.mjs

const ASSETS = /*__ASSETS__*/ null;

const IS_SCRIPTER = typeof print === "function";
const log = (m) => { if (IS_SCRIPTER) print(m); };

(async () => {
  try {
    const msg = await main();
    figma.notify(msg, { timeout: 8000 });
  } catch (e) {
    figma.notify("Conkat: erro — " + (e && e.message ? e.message : e), { error: true, timeout: 12000 });
    log(e && e.stack ? e.stack : String(e));
    throw e;
  } finally {
    if (!IS_SCRIPTER) figma.closePlugin();
  }
})();

async function main() {
  // ---------------------------------------------------------------------------
  // Escala: no site, a tela do celular tem 280 px de largura e texto de 16 px.
  // Aqui as telas têm 375 x 812, então 1em do site vira E pixels.
  // ---------------------------------------------------------------------------
  const W = 375, H = 812;
  const S = 375 / 279.6;
  const E = 16 * S;
  const em = (n) => Math.round(n * E * 10) / 10;
  const px = (n) => Math.round(n * S * 10) / 10;

  // ---------------------------------------------------------------------------
  // Página
  // ---------------------------------------------------------------------------
  const PAGE_NAME = "Telas do site";
  let page = figma.root.children.find((p) => p.name === PAGE_NAME);
  if (!page) { page = figma.createPage(); page.name = PAGE_NAME; }
  await figma.setCurrentPageAsync(page);
  for (const n of [...page.children]) n.remove();

  // ---------------------------------------------------------------------------
  // Cores (variáveis cor/*, as mesmas do site e do app)
  // ---------------------------------------------------------------------------
  const HEX = {
    ink: "#0B2B2A", inkSoft: "#123B39", background: "#F8F9FA", surface: "#FFFFFF",
    text: "#1A1A1A", textMuted: "#5F6672", textOnDark: "#FFFFFF", textOnDarkMuted: "#A7C4C2",
    brand: "#0F928C", primary: "#0B7A75", primarySoft: "#E6F4F3",
    accent: "#FDA333", accentText: "#A85A00", accentSoft: "#FFF3E0",
    border: "#E5E7EB", borderStrong: "#D6DADF",
  };
  const rgb = (hex) => ({
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
  });
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let col = collections.find((c) => c.name === "Conkat");
  if (!col) { col = figma.variables.createVariableCollection("Conkat"); col.renameMode(col.modes[0].modeId, "Claro"); }
  const existing = {};
  for (const v of await figma.variables.getLocalVariablesAsync("COLOR")) existing[v.name] = v;
  const V = {};
  for (const [k, hex] of Object.entries(HEX)) {
    const name = "cor/" + k;
    let v = existing[name];
    if (!v) {
      v = figma.variables.createVariable(name, col, "COLOR");
      v.scopes = ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR", "TEXT_FILL", "EFFECT_COLOR"];
    }
    v.setValueForMode(col.modes[0].modeId, rgb(hex));
    V[k] = v;
  }
  const paint = (k, opacity) => {
    const p = figma.variables.setBoundVariableForPaint({ type: "SOLID", color: rgb(HEX[k]) }, "color", V[k]);
    return opacity == null ? p : Object.assign({}, p, { opacity });
  };

  // ---------------------------------------------------------------------------
  // Fontes: títulos em Unageo (como no site), texto em Inter
  // ---------------------------------------------------------------------------
  const available = await figma.listAvailableFontsAsync();
  const has = (family, style) => available.some((f) => f.fontName.family === family && f.fontName.style === style);
  const norm = (x) => x.toLowerCase().replace(/[\s_-]/g, "");
  const unageo = available.filter((f) => /unageo/i.test(f.fontName.family));
  const pickUnageo = (wanted) => { const f = unageo.find((x) => norm(x.fontName.style) === wanted); return f ? f.fontName : null; };
  const interStyle = (s) => (has("Inter", s) ? s : s.replace(" ", ""));
  const F = {
    regular: { family: "Inter", style: "Regular" },
    medium: { family: "Inter", style: interStyle("Medium") },
    semibold: { family: "Inter", style: interStyle("Semi Bold") },
    bold: { family: "Inter", style: interStyle("Bold") },
  };
  F.display = pickUnageo("semibold") || pickUnageo("bold") || F.semibold;
  F.displayBold = pickUnageo("bold") || F.display;
  for (const f of Object.values(F)) await figma.loadFontAsync(f);
  const hasUnageo = F.display.family !== "Inter";

  // ---------------------------------------------------------------------------
  // Ajudantes
  // ---------------------------------------------------------------------------
  const IMG = {};
  for (const [k, b64] of Object.entries(ASSETS.photos)) IMG[k] = figma.createImage(figma.base64Decode(b64)).hash;
  const imageFill = (k) => [{ type: "IMAGE", imageHash: IMG[k], scaleMode: "FILL" }];

  function text(chars, o) {
    const t = figma.createText();
    t.fontName = o.font || F.regular;
    t.characters = chars;
    t.fontSize = o.size;
    t.fills = [paint(o.color || "text")];
    if (o.lh) t.lineHeight = { unit: "PERCENT", value: o.lh * 100 };
    if (o.ls) t.letterSpacing = { unit: "PERCENT", value: o.ls };
    if (o.name) t.name = o.name;
    return t;
  }
  // Texto que ocupa a largura do pai (auto layout) e quebra linha
  function fillText(parent, t) {
    t.textAutoResize = "HEIGHT";
    parent.appendChild(t);
    t.layoutSizingHorizontal = "FILL";
    return t;
  }
  // Frame com auto layout que abraça o conteúdo (usa createAutoLayout quando existe)
  function autoFrame(dir) {
    if (typeof figma.createAutoLayout === "function") return figma.createAutoLayout(dir);
    const f = figma.createFrame();
    f.layoutMode = dir;
    f.primaryAxisSizingMode = "AUTO";
    f.counterAxisSizingMode = "AUTO";
    return f;
  }
  function box(dir, o) {
    const f = autoFrame(dir);
    f.fills = [];
    if (o) {
      if (o.name) f.name = o.name;
      if (o.gap != null) f.itemSpacing = o.gap;
      if (o.pad != null) {
        const p = Array.isArray(o.pad) ? o.pad : [o.pad];
        const [t, r = t, b = t, l = r] = p;
        f.paddingTop = t; f.paddingRight = r; f.paddingBottom = b; f.paddingLeft = l;
      }
      if (o.fill) f.fills = [paint(o.fill)];
      if (o.stroke) { f.strokes = [paint(o.stroke)]; f.strokeWeight = o.strokeWeight || 1; f.strokeAlign = "INSIDE"; }
      if (o.radius != null) f.cornerRadius = o.radius;
      if (o.align) f.counterAxisAlignItems = o.align;
      if (o.justify) f.primaryAxisAlignItems = o.justify;
    }
    return f;
  }
  function add(parent, child, sizing) {
    parent.appendChild(child);
    if (sizing && sizing.h) child.layoutSizingHorizontal = sizing.h;
    if (sizing && sizing.v) child.layoutSizingVertical = sizing.v;
    return child;
  }
  function icon(name, size, colorKey) {
    const hex = HEX[colorKey];
    const body = ASSETS.icons[name].replace(/<path /g, '<path fill="' + hex + '" ');
    const n = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 256 256">' + body + "</svg>");
    n.name = "ícone/" + name;
    n.fills = [];
    n.resize(size, size);
    for (const c of n.findAll((x) => "fills" in x && x.type !== "FRAME")) {
      const fills = c.fills;
      if (Array.isArray(fills) && fills.length && fills[0].type === "SOLID") c.fills = [paint(colorKey)];
    }
    return n;
  }
  function logo(height) {
    const n = figma.createNodeFromSvg(ASSETS.logo);
    n.name = "Logo Conkat";
    n.fills = [];
    const w = Math.round((height * 736.4 / 173.5) * 10) / 10;
    n.resize(w, height);
    for (const c of n.findAll((x) => x.type === "VECTOR" || x.type === "RECTANGLE")) {
      const f = c.fills;
      if (Array.isArray(f) && f.length && f[0].type === "SOLID") {
        const isCursor = f[0].color.r > 0.9;
        c.fills = [paint(isCursor ? "accent" : "ink")];
      }
    }
    return n;
  }
  function screenFrame(name) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(W, H);
    f.fills = [paint("background")];
    f.clipsContent = true;
    return f;
  }
  const shadow = (y, blur, spread, alpha) => ({
    type: "DROP_SHADOW", color: { r: 11 / 255, g: 43 / 255, b: 42 / 255, a: alpha },
    offset: { x: 0, y }, radius: blur, spread, visible: true, blendMode: "NORMAL",
  });

  // ---------------------------------------------------------------------------
  // Componentes
  // ---------------------------------------------------------------------------
  const compArea = figma.createSection();
  compArea.name = "Componentes";

  // Padrão de fundo (ícones de serviços em laranja, 35% de opacidade nas telas)
  const TILE = Math.round(1176 * (420 / 1176) * S);
  const patternComp = figma.createComponent();
  patternComp.name = "Padrão de fundo";
  patternComp.resize(TILE, TILE);
  patternComp.fills = [];
  patternComp.clipsContent = true;
  const patternSvg = figma.createNodeFromSvg(ASSETS.pattern);
  patternSvg.fills = [];
  patternSvg.resize(TILE, TILE);
  patternComp.appendChild(patternSvg);
  patternSvg.x = 0; patternSvg.y = 0;
  for (const c of patternSvg.findAll((x) => x.type === "VECTOR")) c.strokes = [paint("accent")];

  // Barra de status
  const statusComp = figma.createComponent();
  statusComp.name = "Barra de status";
  statusComp.layoutMode = "HORIZONTAL";
  statusComp.primaryAxisAlignItems = "SPACE_BETWEEN";
  statusComp.counterAxisAlignItems = "CENTER";
  statusComp.resize(W, em(2.6));
  statusComp.primaryAxisSizingMode = "FIXED";
  statusComp.counterAxisSizingMode = "FIXED";
  statusComp.paddingLeft = statusComp.paddingRight = em(1.4 * 0.72);
  statusComp.paddingTop = em(0.85 * 0.72) - 4;
  statusComp.fills = [];
  statusComp.appendChild(text("9:41", { font: F.semibold, size: em(0.72), color: "text", name: "Hora" }));
  const island = figma.createRectangle();
  island.name = "Ilha";
  island.resize(em(5.6 * 0.72), em(1.6 * 0.72));
  island.cornerRadius = em(0.72);
  island.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  statusComp.appendChild(island);
  const signal = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="38" height="10" viewBox="0 0 38 10"><rect x="0" y="5" width="3" height="5" rx="1" fill="#1A1A1A"/><rect x="4.5" y="3.5" width="3" height="6.5" rx="1" fill="#1A1A1A"/><rect x="9" y="2" width="3" height="8" rx="1" fill="#1A1A1A"/><rect x="13.5" y="0" width="3" height="10" rx="1" fill="#1A1A1A"/><rect x="20" y=".5" width="16" height="9" rx="2.5" stroke="#1A1A1A" fill="none"/><rect x="21.5" y="2" width="11" height="6" rx="1.2" fill="#1A1A1A"/><rect x="36.6" y="3.5" width="1.4" height="3" rx=".7" fill="#1A1A1A"/></svg>');
  signal.name = "Sinal e bateria";
  signal.fills = [];
  signal.resize(px(38), px(10));
  statusComp.appendChild(signal);

  // Card de anúncio (como nas listas do app)
  const cardComp = figma.createComponent();
  cardComp.name = "Card de anúncio";
  cardComp.layoutMode = "HORIZONTAL";
  cardComp.counterAxisAlignItems = "CENTER";
  cardComp.itemSpacing = em(0.65);
  cardComp.paddingTop = cardComp.paddingBottom = cardComp.paddingLeft = cardComp.paddingRight = em(0.5);
  cardComp.cornerRadius = em(0.9);
  cardComp.fills = [paint("surface")];
  cardComp.strokes = [paint("border")];
  cardComp.strokeWeight = 1;
  cardComp.strokeAlign = "INSIDE";
  cardComp.resize(W - 2 * em(0.8), 100);
  cardComp.primaryAxisSizingMode = "FIXED";
  cardComp.counterAxisSizingMode = "AUTO";
  const cPhoto = figma.createRectangle();
  cPhoto.name = "Foto";
  cPhoto.resize(em(3.9), em(3.9));
  cPhoto.cornerRadius = em(0.65);
  cPhoto.fills = imageFill("encanador");
  cardComp.appendChild(cPhoto);
  const cInfo = box("VERTICAL", { name: "Informações", gap: em(0.12) });
  add(cardComp, cInfo, { h: "FILL" });
  const cTitle = fillText(cInfo, text("Encanador residencial", { font: F.semibold, size: em(0.78), lh: 1.3, name: "Título" }));
  const cCat = fillText(cInfo, text("Manutenção Residencial", { size: em(0.64), lh: 1.3, color: "textMuted", name: "Categoria" }));
  for (const t of [cTitle, cCat]) { try { t.textTruncation = "ENDING"; t.maxLines = 1; } catch (e) {} }
  const cRow = box("HORIZONTAL", { name: "Preço e nota", gap: em(0.6 * 0.7), align: "CENTER" });
  add(cInfo, cRow);
  const cPrice = text("A partir de R$ 120", { font: F.semibold, size: em(0.7), lh: 1.3, color: "primary", name: "Preço" });
  cRow.appendChild(cPrice);
  const cRating = box("HORIZONTAL", { name: "Nota", gap: em(0.2 * 0.7), align: "CENTER" });
  cRow.appendChild(cRating);
  cRating.appendChild(icon("star-fill", em(0.7), "accent"));
  const cRatingT = text("4,8", { font: F.semibold, size: em(0.7), lh: 1.3, name: "Nota" });
  cRating.appendChild(cRatingT);
  const P = {
    title: cardComp.addComponentProperty("Título", "TEXT", "Encanador residencial"),
    cat: cardComp.addComponentProperty("Categoria", "TEXT", "Manutenção Residencial"),
    price: cardComp.addComponentProperty("Preço", "TEXT", "A partir de R$ 120"),
    rating: cardComp.addComponentProperty("Nota", "TEXT", "4,8"),
  };
  cTitle.componentPropertyReferences = { characters: P.title };
  cCat.componentPropertyReferences = { characters: P.cat };
  cPrice.componentPropertyReferences = { characters: P.price };
  cRatingT.componentPropertyReferences = { characters: P.rating };
  function card(parent, title, cat, price, rating, photo) {
    const i = cardComp.createInstance();
    parent.appendChild(i);
    i.layoutSizingHorizontal = "FILL";
    i.setProperties({ [P.title]: title, [P.cat]: cat, [P.price]: price, [P.rating]: rating });
    const ph = i.findOne((n) => n.name === "Foto");
    if (ph) ph.fills = imageFill(photo);
    return i;
  }

  // Barra de abas (flutuante)
  const tabComp = figma.createComponent();
  tabComp.name = "Barra de abas";
  tabComp.layoutMode = "HORIZONTAL";
  tabComp.primaryAxisAlignItems = "SPACE_BETWEEN";
  tabComp.counterAxisAlignItems = "CENTER";
  tabComp.paddingTop = tabComp.paddingBottom = em(0.5);
  tabComp.paddingLeft = tabComp.paddingRight = em(1);
  tabComp.cornerRadius = em(1.5);
  tabComp.fills = [paint("surface")];
  tabComp.strokes = [paint("border")];
  tabComp.strokeWeight = 1;
  tabComp.strokeAlign = "INSIDE";
  tabComp.effects = [shadow(px(6), px(16), -px(8), 0.18)];
  tabComp.resize(W - 2 * em(0.8), 60);
  tabComp.primaryAxisSizingMode = "FIXED";
  tabComp.counterAxisSizingMode = "AUTO";
  for (const [label, ic, active] of [["Início", "house", true], ["Anúncios", "squares-four", false], ["Favoritos", "heart", false], ["Conta", "user", false]]) {
    const tab = box("VERTICAL", { name: "Aba " + label, gap: em(0.15 * 0.56), align: "CENTER" });
    tabComp.appendChild(tab);
    tab.appendChild(icon(ic, em(2 * 0.56), active ? "primary" : "textMuted"));
    tab.appendChild(text(label, { font: active ? F.semibold : F.medium, size: em(0.56), color: active ? "primary" : "textMuted" }));
  }

  // Marcador numerado (anúncio anotado)
  const pinComp = figma.createComponent();
  pinComp.name = "Marcador";
  pinComp.layoutMode = "HORIZONTAL";
  pinComp.primaryAxisAlignItems = "CENTER";
  pinComp.counterAxisAlignItems = "CENTER";
  pinComp.resize(28, 28);
  pinComp.primaryAxisSizingMode = "FIXED";
  pinComp.counterAxisSizingMode = "FIXED";
  pinComp.cornerRadius = 14;
  pinComp.fills = [paint("accent")];
  const pinT = text("1", { font: F.displayBold, size: 14.4, color: "ink", name: "Número" });
  pinComp.appendChild(pinT);
  const pinProp = pinComp.addComponentProperty("Número", "TEXT", "1");
  pinT.componentPropertyReferences = { characters: pinProp };

  // Organiza os componentes dentro da seção
  {
    let y = 80;
    for (const c of [statusComp, cardComp, tabComp, pinComp, patternComp]) {
      compArea.appendChild(c);
      c.x = 80; c.y = y;
      y += c.height + 64;
    }
    compArea.resizeWithoutConstraints(W + 160, y + 16);
  }

  // ---------------------------------------------------------------------------
  // Partes comuns das telas
  // ---------------------------------------------------------------------------
  function decorate(frame) {
    const pat = figma.createFrame();
    pat.name = "Padrão";
    pat.fills = [];
    pat.resize(W, H);
    pat.opacity = 0.35;
    pat.clipsContent = true;
    frame.appendChild(pat);
    for (let y = 0; y < H; y += TILE) {
      const i = patternComp.createInstance();
      pat.appendChild(i);
      i.x = 0; i.y = y;
    }
    pat.locked = true;
    const st = statusComp.createInstance();
    frame.appendChild(st);
    st.x = 0; st.y = 0;
  }
  const CONTENT_X = em(0.8);
  const CONTENT_Y = em(2.6) + em(0.55);
  const CONTENT_W = W - 2 * em(0.8);
  function content(frame, gap, name) {
    const c = box("VERTICAL", { name: name || "Conteúdo", gap });
    frame.appendChild(c);
    c.x = CONTENT_X; c.y = CONTENT_Y;
    c.resize(CONTENT_W, 10);
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    return c;
  }
  function pill(chars, o) {
    const f = box("HORIZONTAL", { name: o.name || chars, gap: o.gap || 0, pad: o.pad, radius: 999, fill: o.fill, stroke: o.stroke, strokeWeight: o.strokeWeight, align: "CENTER" });
    if (o.iconL) f.appendChild(icon(o.iconL[0], o.iconL[1], o.iconL[2]));
    f.appendChild(text(chars, { font: o.font || F.regular, size: o.size, color: o.color || "text" }));
    if (o.iconR) f.appendChild(icon(o.iconR[0], o.iconR[1], o.iconR[2]));
    return f;
  }

  // ---------------------------------------------------------------------------
  // 1. Início
  // ---------------------------------------------------------------------------
  function buildHome(name) {
    const fr = screenFrame(name);
    decorate(fr);
    const c = content(fr, em(0.8));
    const top = box("HORIZONTAL", { name: "Topo", pad: [0, em(0.25)], justify: "SPACE_BETWEEN", align: "CENTER" });
    add(c, top, { h: "FILL" });
    top.appendChild(logo(em(1.05)));
    const fs = em(0.64);
    top.appendChild(pill("Joinville", {
      name: "Cidade", font: F.semibold, size: fs, gap: 0.3 * fs, pad: [0.3 * fs, 0.65 * fs, 0.3 * fs, 0.5 * fs],
      fill: "surface", stroke: "border", iconL: ["map-pin", px(12), "primary"], iconR: ["caret-down", px(10), "textMuted"],
    }));
    const sb = box("VERTICAL", { name: "Busca", gap: em(0.8), pad: [em(1), em(0.9), em(0.9)], radius: em(1.35), fill: "surface", stroke: "border" });
    add(c, sb, { h: "FILL" });
    const q = fillText(sb, text("Qual serviço você procura?", { font: F.display, size: em(1.24), lh: 1.2, ls: -2, color: "text", name: "Pergunta" }));
    q.setRangeFills(5, 12, [paint("accentText")]);
    const ff = em(0.7);
    add(sb, pill("Eletricista, diarista, montador…", {
      name: "Campo de busca", size: ff, color: "textMuted", gap: 0.5 * ff, pad: [0.65 * ff, 0.8 * ff],
      fill: "background", iconL: ["magnifying-glass", px(15), "textMuted"],
    }), { h: "FILL" });
    const hd = box("HORIZONTAL", { name: "Cabeçalho da lista", pad: [0, em(0.25)], justify: "SPACE_BETWEEN", align: "MAX" });
    add(c, hd, { h: "FILL" });
    hd.appendChild(text("Publicados recentemente", { font: F.semibold, size: em(0.76) }));
    hd.appendChild(text("Ver todos", { font: F.semibold, size: em(0.76 * 0.85), color: "primary" }));
    const list = box("VERTICAL", { name: "Lista", gap: em(0.6) });
    add(c, list, { h: "FILL" });
    card(list, "Encanador residencial", "Manutenção Residencial", "A partir de R$ 120", "4,8", "encanador");
    card(list, "Diarista — limpeza completa", "Limpeza e Conservação", "R$ 180 por dia", "4,9", "cozinha");
    card(list, "Pintura de apartamentos", "Construção e Reformas", "R$ 35 por m²", "4,7", "pintura");
    const tb = tabComp.createInstance();
    fr.appendChild(tb);
    tb.x = em(0.8);
    tb.y = H - em(0.9) - tb.height;
    return fr;
  }
  const home = buildHome("01 — Início");

  // ---------------------------------------------------------------------------
  // 2. Onde você procura? (folha de cidade sobre a Início)
  // ---------------------------------------------------------------------------
  const city = buildHome("02 — Onde você procura?");
  {
    const scrim = figma.createRectangle();
    scrim.name = "Fundo escurecido";
    scrim.resize(W, H);
    scrim.fills = [paint("ink", 0.32)];
    city.appendChild(scrim);
    const sh = box("VERTICAL", { name: "Folha de cidades", gap: em(0.75), pad: [em(0.6), em(1.1), em(1.4)], fill: "surface" });
    sh.topLeftRadius = sh.topRightRadius = em(1.4);
    city.appendChild(sh);
    sh.resize(W, 10);
    sh.primaryAxisSizingMode = "AUTO";
    sh.counterAxisSizingMode = "FIXED";
    const grabRow = box("HORIZONTAL", { name: "Puxador", justify: "CENTER" });
    add(sh, grabRow, { h: "FILL" });
    const grab = figma.createRectangle();
    grab.name = "Puxador";
    grab.resize(em(2.4), em(0.25));
    grab.cornerRadius = em(0.25);
    grab.fills = [paint("borderStrong")];
    grabRow.appendChild(grab);
    sh.appendChild(text("Onde você procura?", { font: F.display, size: em(1.05), ls: -2, name: "Título" }));
    const fs = em(0.68);
    add(sh, pill("Buscar cidade", { name: "Campo de cidade", size: fs, color: "textMuted", gap: 0.5 * fs, pad: [0.6 * fs, 0.8 * fs], fill: "background", iconL: ["magnifying-glass", px(14), "textMuted"] }), { h: "FILL" });
    const list = box("VERTICAL", { name: "Cidades" });
    add(sh, list, { h: "FILL" });
    const ls = em(0.75);
    for (const [name, on] of [["Joinville", true], ["Jaraguá do Sul", false], ["Araquari", false], ["São Francisco do Sul", false], ["Guaramirim", false]]) {
      const row = box("HORIZONTAL", { name: name, gap: 0.6 * ls, pad: [0.7 * ls, 0.1 * ls], align: "CENTER" });
      row.strokes = [paint("border")];
      row.strokeTopWeight = 1; row.strokeBottomWeight = 0; row.strokeLeftWeight = 0; row.strokeRightWeight = 0;
      row.strokeAlign = "INSIDE";
      add(list, row, { h: "FILL" });
      row.appendChild(icon("map-pin", px(15), on ? "primary" : "textMuted"));
      fillText(row, text(name + ", SC", { font: on ? F.semibold : F.regular, size: ls }));
      if (on) row.appendChild(icon("check", px(15), "primary"));
    }
    sh.x = 0;
    sh.y = H - sh.height;
  }

  // ---------------------------------------------------------------------------
  // 3. Busca
  // ---------------------------------------------------------------------------
  const search = screenFrame("03 — Busca");
  {
    decorate(search);
    const c = content(search, em(0.75));
    const fs = em(0.75);
    const field = box("HORIZONTAL", { name: "Campo de busca", gap: 0.5 * fs, pad: [0.7 * fs, 0.9 * fs], radius: 999, fill: "surface", stroke: "primary", strokeWeight: px(1.5), align: "CENTER" });
    add(c, field, { h: "FILL" });
    field.appendChild(icon("magnifying-glass", px(15), "textMuted"));
    field.appendChild(text("eletricista", { font: F.medium, size: fs, name: "Termo" }));
    const caret = figma.createRectangle();
    caret.name = "Cursor";
    caret.resize(1, Math.round(1.1 * fs));
    caret.fills = [paint("primary")];
    field.appendChild(caret);
    const chips = box("HORIZONTAL", { name: "Filtros", gap: em(0.4) });
    add(c, chips);
    const cs = em(0.64);
    chips.appendChild(pill("Todas", { name: "Filtro ativo", font: F.medium, size: cs, pad: [0.35 * cs, 0.75 * cs], fill: "ink", stroke: "ink", color: "textOnDark" }));
    for (const l of ["Manutenção", "Preço"]) chips.appendChild(pill(l, { name: "Filtro", font: F.medium, size: cs, pad: [0.35 * cs, 0.75 * cs], fill: "surface", stroke: "border" }));
    c.appendChild(text("Anúncios em Joinville", { font: F.medium, size: em(0.66), color: "textMuted", name: "Contagem" }));
    const list = box("VERTICAL", { name: "Resultados", gap: em(0.6) });
    add(c, list, { h: "FILL" });
    card(list, "Eletricista residencial", "Manutenção Residencial", "A partir de R$ 90", "4,8", "encanador");
    card(list, "Instalação de chuveiro", "Manutenção Residencial", "R$ 120 fixo", "5,0", "pintura");
    card(list, "Troca de disjuntor e tomadas", "Manutenção Residencial", "A combinar", "4,6", "cozinha");
  }

  // ---------------------------------------------------------------------------
  // 4. Anúncio
  // ---------------------------------------------------------------------------
  const detail = screenFrame("04 — Anúncio");
  {
    decorate(detail);
    const c = content(detail, em(0.7));
    c.primaryAxisSizingMode = "FIXED";
    c.resize(CONTENT_W, H - CONTENT_Y - em(0.9));
    const g = figma.createRectangle();
    g.name = "Galeria";
    g.resize(CONTENT_W, em(10.4));
    g.cornerRadius = em(1.1);
    g.fills = imageFill("cozinha");
    add(c, g, { h: "FILL" });
    const chips = box("HORIZONTAL", { name: "Selos", gap: em(0.4) });
    add(c, chips);
    const cs = em(0.62);
    chips.appendChild(pill("Destaque", { font: F.semibold, size: cs, pad: [0.25 * cs, 0.6 * cs], fill: "accent", stroke: "accent" }));
    chips.appendChild(pill("Limpeza e Conservação", { font: F.semibold, size: cs, pad: [0.25 * cs, 0.6 * cs], fill: "surface", stroke: "border" }));
    const tp = box("VERTICAL", { name: "Título e preço", gap: em(0.3) });
    add(c, tp, { h: "FILL" });
    fillText(tp, text("Diarista — limpeza completa", { font: F.display, size: em(1.18), lh: 1.2, ls: -2, name: "Título" }));
    tp.appendChild(text("R$ 180 por dia", { font: F.semibold, size: em(0.75), color: "primary", name: "Preço" }));
    const pro = box("HORIZONTAL", { name: "Profissional", gap: em(0.6), pad: [em(0.6), em(0.75)], radius: em(1), fill: "surface", stroke: "border", align: "CENTER" });
    add(c, pro, { h: "FILL" });
    const av = figma.createEllipse();
    av.name = "Foto do profissional";
    av.resize(em(2.15), em(2.15));
    av.fills = imageFill("marina");
    pro.appendChild(av);
    const info = box("VERTICAL", { name: "Nome" });
    add(pro, info, { h: "FILL" });
    info.appendChild(text("Marina Souza", { font: F.semibold, size: em(0.75), lh: 1.3 }));
    const ver = box("HORIZONTAL", { name: "Verificado", gap: em(0.25 * 0.62), align: "CENTER" });
    info.appendChild(ver);
    ver.appendChild(icon("seal-check", px(11), "primary"));
    ver.appendChild(text("Verificado", { font: F.medium, size: em(0.62), color: "primary" }));
    const rt = box("HORIZONTAL", { name: "Nota", gap: em(0.2 * 0.75), align: "CENTER" });
    pro.appendChild(rt);
    rt.appendChild(icon("star-fill", px(12), "accent"));
    rt.appendChild(text("4,9", { font: F.semibold, size: em(0.75) }));
    fillText(c, text("Limpeza completa de casas e apartamentos, com produtos inclusos. Atendo toda a zona norte.", { size: em(0.68), lh: 1.5, color: "textMuted", name: "Descrição" }));
    const spacer = box("VERTICAL", { name: "Espaço" });
    add(c, spacer, { h: "FILL" });
    spacer.layoutGrow = 1;
    const wf = em(0.8);
    const wa = box("HORIZONTAL", { name: "Chamar no WhatsApp", gap: 0.5 * wf, pad: [0.8 * wf], radius: 999, fill: "primary", justify: "CENTER", align: "CENTER" });
    add(c, wa, { h: "FILL" });
    wa.appendChild(icon("whatsapp-logo", px(18), "textOnDark"));
    wa.appendChild(text("Chamar no WhatsApp", { font: F.semibold, size: wf, color: "textOnDark" }));
  }

  // ---------------------------------------------------------------------------
  // 5. Anúncio anotado ("Antes de chamar, você já sabe.", no tamanho do site)
  // ---------------------------------------------------------------------------
  const anno = box("VERTICAL", { name: "05 — Anúncio anotado (site)", pad: [56], radius: 28, align: "CENTER" });
  anno.fills = [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: Object.assign(rgb(HEX.inkSoft), { a: 1 }) },
      { position: 1, color: Object.assign(rgb(HEX.ink), { a: 1 }) },
    ],
  }];
  {
    const l = box("VERTICAL", { name: "Anúncio", radius: 24, fill: "surface" });
    l.clipsContent = true;
    l.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.6 }, offset: { x: 0, y: 30 }, radius: 60, spread: -30, visible: true, blendMode: "NORMAL" }];
    anno.appendChild(l);
    l.resize(360, 10);
    l.primaryAxisSizingMode = "AUTO";
    l.counterAxisSizingMode = "FIXED";
    const ph = figma.createRectangle();
    ph.name = "Foto";
    ph.resize(360, 225);
    ph.fills = imageFill("encanador");
    add(l, ph, { h: "FILL" });
    const body = box("VERTICAL", { name: "Corpo", gap: 5.6, pad: [17.6, 17.6, 20] });
    add(l, body, { h: "FILL" });
    body.appendChild(pill("Manutenção Residencial", { font: F.semibold, size: 12, pad: [4, 10.4], stroke: "border" }));
    const tt = fillText(body, text("Encanador — reparos e instalações", { font: F.display, size: 21.6, lh: 1.2, ls: -2, color: "ink", name: "Título" }));
    tt.paragraphSpacing = 0;
    const rowBox = (name) => {
      const r = box("HORIZONTAL", { name, gap: 12, pad: [6.4, 0], justify: "SPACE_BETWEEN", align: "CENTER" });
      add(body, r, { h: "FILL" });
      return r;
    };
    const pin = (n) => { const i = pinComp.createInstance(); i.setProperties({ [pinProp]: String(n) }); return i; };
    const r1 = rowBox("1 · Preço");
    r1.appendChild(text("A partir de R$ 120", { font: F.semibold, size: 16.8, color: "primary" }));
    r1.appendChild(pin(1));
    const r2 = rowBox("2 · Avaliações");
    const rt = box("HORIZONTAL", { name: "Nota", gap: 4.8, align: "CENTER" });
    r2.appendChild(rt);
    rt.appendChild(icon("star-fill", 16, "accent"));
    rt.appendChild(text("4,8", { font: F.bold, size: 15.2 }));
    rt.appendChild(text("· 23 avaliações", { size: 15.2, color: "textMuted" }));
    r2.appendChild(pin(2));
    const r3 = rowBox("3 · Verificado");
    r3.itemSpacing = 12;
    const left = box("HORIZONTAL", { name: "Profissional", gap: 12, align: "CENTER" });
    add(r3, left, { h: "FILL" });
    const av = box("HORIZONTAL", { name: "Avatar", radius: 999, fill: "primarySoft", justify: "CENTER", align: "CENTER" });
    av.resize(41.6, 41.6);
    av.primaryAxisSizingMode = "FIXED";
    av.counterAxisSizingMode = "FIXED";
    left.appendChild(av);
    av.appendChild(text("RC", { font: F.semibold, size: 13.6, color: "primary" }));
    const nm = box("VERTICAL", { name: "Nome" });
    left.appendChild(nm);
    nm.appendChild(text("Rafael Costa", { font: F.semibold, size: 15.2 }));
    const vv = box("HORIZONTAL", { name: "Verificado", gap: 4, align: "CENTER" });
    nm.appendChild(vv);
    vv.appendChild(icon("seal-check", 14, "primary"));
    vv.appendChild(text("Verificado", { font: F.semibold, size: 12.8, color: "primary" }));
    r3.appendChild(pin(3));
    const wa = box("HORIZONTAL", { name: "Chamar no WhatsApp", gap: 8, pad: [13.6], radius: 999, fill: "primary", justify: "CENTER", align: "CENTER" });
    add(body, wa, { h: "FILL" });
    body.insertChild(body.children.length - 1, box("VERTICAL", { name: "Espaço", pad: [3, 0] }));
    wa.appendChild(icon("whatsapp-logo", 20, "textOnDark"));
    wa.appendChild(text("Chamar no WhatsApp", { font: F.semibold, size: 16, color: "textOnDark" }));
  }

  // ---------------------------------------------------------------------------
  // Posições: componentes à esquerda, telas lado a lado
  // ---------------------------------------------------------------------------
  compArea.x = 0; compArea.y = 0;
  let x = compArea.width + 160;
  for (const fr of [home, city, search, detail, anno]) {
    page.appendChild(fr);
    fr.x = x; fr.y = 80;
    x += fr.width + 120;
  }
  figma.viewport.scrollAndZoomIntoView([home, city, search, detail, anno]);

  return hasUnageo
    ? "Conkat: 5 telas montadas na página \"Telas do site\"."
    : "Conkat: telas montadas, mas sem a fonte Unageo (títulos em Inter). Instale a Unageo e rode de novo.";
}
