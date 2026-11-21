// Imitação da API de plugins do Figma que desenha no navegador (DOM + flexbox).
// Serve para ver o resultado dos scripts do Scripter sem o Figma: o auto layout do Figma
// vira flexbox, e alturas/larguras lidas pelo script vêm do layout real do navegador.
(function () {
  let nextId = 1;
  const byId = new Map();
  const IMAGES = new Map();
  const warnings = [];
  const warn = (m) => { if (warnings.length < 200) warnings.push(m); };

  const PX = (n) => (Math.round(n * 100) / 100) + 'px';
  const css = (c, a) => `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a == null ? 1 : a})`;
  const AL = { MIN: 'flex-start', CENTER: 'center', MAX: 'flex-end', BASELINE: 'baseline', SPACE_BETWEEN: 'space-between' };
  const WEIGHT = { Regular: 400, Medium: 500, 'Semi Bold': 600, SemiBold: 600, Bold: 700 };

  class Node {
    constructor(type, extra) {
      this.id = (nextId++) + ':1';
      byId.set(this.id, this);
      this.type = type;
      this.el = document.createElement('div');
      this.el.dataset.name = type;
      this.p = Object.assign({
        name: type, x: 0, y: 0, w: 100, h: 100, fills: [], strokes: [], strokeWeight: 1, sides: null, effects: [],
        layoutMode: 'NONE', primaryAxisSizingMode: 'AUTO', counterAxisSizingMode: 'AUTO', sizingH: null, sizingV: null,
        itemSpacing: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, primaryAxisAlignItems: 'MIN',
        counterAxisAlignItems: 'MIN', layoutWrap: 'NO_WRAP', counterAxisSpacing: 0, layoutGrow: 0, minHeight: null,
        cornerRadius: 0, radii: null, opacity: 1, visible: true, clipsContent: false, dashPattern: [], locked: false,
      }, extra || {});
      this.children = [];
      this.parent = null;
      this.removed = false;
      this.componentProps = {};
      this.componentPropertyReferences = null;
      this.apply();
    }
    // ---- propriedades
    get name() { return this.p.name; } set name(v) { this.p.name = v; this.el.dataset.name = v; }
    get x() { return this.p.x; } set x(v) { this.p.x = v; this.apply(); }
    get y() { return this.p.y; } set y(v) { this.p.y = v; this.apply(); }
    get width() { return this.isLaid() ? this.el.offsetWidth : this.p.w; }
    get height() { return this.isLaid() ? this.el.offsetHeight : this.p.h; }
    isLaid() { return this.el.isConnected && getComputedStyle(this.el).display !== 'none'; }
    get fills() { return this.p.fills; } set fills(v) { this.p.fills = v; this.apply(); }
    get strokes() { return this.p.strokes; } set strokes(v) { this.p.strokes = v; this.apply(); }
    get strokeWeight() { return this.p.strokeWeight; } set strokeWeight(v) { this.p.strokeWeight = v; this.p.sides = null; this.apply(); }
    set strokeTopWeight(v) { this.side('t', v); } set strokeBottomWeight(v) { this.side('b', v); }
    set strokeLeftWeight(v) { this.side('l', v); } set strokeRightWeight(v) { this.side('r', v); }
    side(k, v) { this.p.sides = Object.assign({ t: this.p.strokeWeight, r: this.p.strokeWeight, b: this.p.strokeWeight, l: this.p.strokeWeight }, this.p.sides); this.p.sides[k] = v; this.apply(); }
    get strokeAlign() { return 'INSIDE'; } set strokeAlign(v) {}
    get dashPattern() { return this.p.dashPattern; } set dashPattern(v) { this.p.dashPattern = v; this.apply(); }
    get effects() { return this.p.effects; } set effects(v) { this.p.effects = v; this.apply(); }
    get cornerRadius() { return this.p.cornerRadius; } set cornerRadius(v) { this.p.cornerRadius = v; this.p.radii = null; this.apply(); }
    set topLeftRadius(v) { this.radius('tl', v); } set topRightRadius(v) { this.radius('tr', v); }
    set bottomLeftRadius(v) { this.radius('bl', v); } set bottomRightRadius(v) { this.radius('br', v); }
    radius(k, v) { const c = this.p.cornerRadius; this.p.radii = Object.assign({ tl: c, tr: c, bl: c, br: c }, this.p.radii); this.p.radii[k] = v; this.apply(); }
    get opacity() { return this.p.opacity; } set opacity(v) { this.p.opacity = v; this.apply(); }
    get visible() { return this.p.visible; } set visible(v) { this.p.visible = v; this.apply(); }
    get locked() { return this.p.locked; } set locked(v) { this.p.locked = v; }
    get clipsContent() { return this.p.clipsContent; } set clipsContent(v) { this.p.clipsContent = v; this.apply(); }
    get layoutMode() { return this.p.layoutMode; } set layoutMode(v) { this.p.layoutMode = v; this.apply(); this.applyKids(); }
    get primaryAxisSizingMode() { return this.p.primaryAxisSizingMode; } set primaryAxisSizingMode(v) { this.p.primaryAxisSizingMode = v; this.syncOwnSizing(); }
    get counterAxisSizingMode() { return this.p.counterAxisSizingMode; } set counterAxisSizingMode(v) { this.p.counterAxisSizingMode = v; this.syncOwnSizing(); }
    syncOwnSizing() {
      const hor = this.p.layoutMode === 'HORIZONTAL';
      const pm = this.p.primaryAxisSizingMode === 'AUTO' ? 'HUG' : 'FIXED';
      const cm = this.p.counterAxisSizingMode === 'AUTO' ? 'HUG' : 'FIXED';
      const H = hor ? pm : cm, Vv = hor ? cm : pm;
      if (this.p.sizingH !== 'FILL') this.p.sizingH = H;
      if (this.p.sizingV !== 'FILL') this.p.sizingV = Vv;
      this.apply();
    }
    get layoutSizingHorizontal() { return this.p.sizingH || 'FIXED'; }
    set layoutSizingHorizontal(v) { this.setSizing('H', v); }
    get layoutSizingVertical() { return this.p.sizingV || 'FIXED'; }
    set layoutSizingVertical(v) { this.setSizing('V', v); }
    setSizing(axis, v) {
      const parentAuto = this.parent && this.parent.p && this.parent.p.layoutMode !== 'NONE';
      if (v === 'FILL' && !parentAuto) throw new Error(`${this.p.name}: FILL can only be set on children of auto-layout frames`);
      if (v === 'HUG' && !(this.p.layoutMode !== 'NONE' || (this.type === 'TEXT' && parentAuto))) throw new Error(`${this.p.name}: HUG inválido`);
      this.p['sizing' + axis] = v;
      if (this.p.layoutMode !== 'NONE' && v !== 'FILL') {
        const hor = this.p.layoutMode === 'HORIZONTAL';
        const isPrimary = (axis === 'H') === hor;
        this.p[isPrimary ? 'primaryAxisSizingMode' : 'counterAxisSizingMode'] = v === 'HUG' ? 'AUTO' : 'FIXED';
      }
      if (this.type === 'TEXT' && axis === 'H' && v === 'HUG') this.p.textAutoResize = 'WIDTH_AND_HEIGHT';
      this.apply();
    }
    get itemSpacing() { return this.p.itemSpacing; } set itemSpacing(v) { this.p.itemSpacing = v; this.apply(); }
    get counterAxisSpacing() { return this.p.counterAxisSpacing; } set counterAxisSpacing(v) { this.p.counterAxisSpacing = v; this.apply(); }
    get layoutWrap() { return this.p.layoutWrap; } set layoutWrap(v) { this.p.layoutWrap = v; this.apply(); }
    get layoutGrow() { return this.p.layoutGrow; } set layoutGrow(v) { this.p.layoutGrow = v; this.apply(); }
    get minHeight() { return this.p.minHeight; } set minHeight(v) { this.p.minHeight = v; this.apply(); }
    get primaryAxisAlignItems() { return this.p.primaryAxisAlignItems; } set primaryAxisAlignItems(v) { this.p.primaryAxisAlignItems = v; this.apply(); }
    get counterAxisAlignItems() { return this.p.counterAxisAlignItems; } set counterAxisAlignItems(v) { this.p.counterAxisAlignItems = v; this.apply(); }
    get paddingTop() { return this.p.paddingTop; } set paddingTop(v) { this.p.paddingTop = v; this.apply(); }
    get paddingRight() { return this.p.paddingRight; } set paddingRight(v) { this.p.paddingRight = v; this.apply(); }
    get paddingBottom() { return this.p.paddingBottom; } set paddingBottom(v) { this.p.paddingBottom = v; this.apply(); }
    get paddingLeft() { return this.p.paddingLeft; } set paddingLeft(v) { this.p.paddingLeft = v; this.apply(); }
    set description(v) {} set textStyleId(v) {}

    resize(w, h) {
      if (!(w > 0) || !(h > 0)) warn(`${this.p.name}: resize(${w}, ${h})`);
      this.p.w = w; this.p.h = h;
      if (this.p.layoutMode !== 'NONE') { this.p.primaryAxisSizingMode = 'FIXED'; this.p.counterAxisSizingMode = 'FIXED'; }
      this.p.sizingH = 'FIXED'; this.p.sizingV = 'FIXED';
      if (this.type === 'TEXT') this.p.textAutoResize = this.p.textAutoResize === 'HEIGHT' ? 'HEIGHT' : 'NONE';
      this.apply();
    }
    resizeWithoutConstraints(w, h) { this.resize(w, h); }

    // ---- árvore
    appendChild(c) { this.insertChild(this.children.length, c); }
    insertChild(i, c) {
      if (c.parent) { const a = c.parent.children; a.splice(a.indexOf(c), 1); }
      c.parent = this;
      this.children.splice(i, 0, c);
      const ref = this.children[i + 1];
      this.el.insertBefore(c.el, ref ? ref.el : null);
      c.apply();
    }
    remove() { if (this.parent) { const a = this.parent.children; a.splice(a.indexOf(this), 1); } this.parent = null; this.el.remove(); this.removed = true; }
    findAll(fn) { const out = []; const walk = (n) => { for (const c of n.children) { if (!fn || fn(c)) out.push(c); walk(c); } }; walk(this); return out; }
    findOne(fn) { return this.findAll(fn)[0] || null; }
    applyKids() { for (const c of this.children) c.apply(); }

    // ---- desenho
    apply() {
      const s = this.el.style, p = this.p;
      const par = this.parent;
      const parentAuto = par && par.p && par.p.layoutMode !== 'NONE';
      s.boxSizing = 'border-box';
      s.display = p.visible ? (p.layoutMode !== 'NONE' ? 'flex' : 'block') : 'none';
      if (this.type === 'TEXT' && p.visible) s.display = p.maxLines ? '-webkit-box' : 'block';
      s.opacity = p.opacity;
      // posição
      if (!par || !parentAuto) { s.position = 'absolute'; s.left = PX(p.x); s.top = PX(p.y); s.margin = '0'; }
      else { s.position = 'relative'; s.left = ''; s.top = ''; }
      // auto layout próprio
      if (p.layoutMode !== 'NONE') {
        s.flexDirection = p.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
        s.gap = PX(p.itemSpacing);
        if (p.layoutWrap === 'WRAP') { s.flexWrap = 'wrap'; s.rowGap = PX(p.counterAxisSpacing); s.columnGap = PX(p.itemSpacing); }
        s.padding = `${PX(p.paddingTop)} ${PX(p.paddingRight)} ${PX(p.paddingBottom)} ${PX(p.paddingLeft)}`;
        s.justifyContent = AL[p.primaryAxisAlignItems] || 'flex-start';
        s.alignItems = AL[p.counterAxisAlignItems] || 'flex-start';
        if (p.layoutWrap === 'WRAP') s.alignContent = 'flex-start';
      }
      // tamanho
      let H = p.sizingH, Vv = p.sizingV;
      if (p.layoutMode !== 'NONE' && !H) { this.syncOwnSizingSilently(); H = p.sizingH; Vv = p.sizingV; }
      if (this.type === 'TEXT') {
        const ar = p.textAutoResize || 'WIDTH_AND_HEIGHT';
        if (H !== 'FILL') H = ar === 'WIDTH_AND_HEIGHT' ? 'HUG' : 'FIXED';
        Vv = ar === 'NONE' ? 'FIXED' : 'HUG';
        s.whiteSpace = ar === 'WIDTH_AND_HEIGHT' ? 'pre' : 'pre-wrap';
        s.overflowWrap = 'break-word';
      }
      if (!H) H = 'FIXED'; if (!Vv) Vv = 'FIXED';
      s.flex = ''; s.alignSelf = ''; s.width = ''; s.height = ''; s.minWidth = ''; s.minHeight = p.minHeight ? PX(p.minHeight) : '';
      const dir = parentAuto ? par.p.layoutMode : null;
      const axis = (a, mode) => {
        const dim = a === 'H' ? 'width' : 'height';
        const val = a === 'H' ? p.w : p.h;
        const primary = dir && ((a === 'H') === (dir === 'HORIZONTAL'));
        if (mode === 'FILL') {
          if (primary) { s.flex = '1 1 0px'; s[a === 'H' ? 'minWidth' : 'minHeight'] = '0'; }
          else s.alignSelf = 'stretch';
        } else if (mode === 'HUG') {
          s[dim] = (this.type === 'TEXT' && a === 'H') ? 'max-content' : (a === 'H' ? 'max-content' : 'auto');
          if (primary && !s.flex) s.flex = '0 0 auto';
        } else {
          s[dim] = PX(val);
          if (primary && !s.flex) s.flex = '0 0 auto';
        }
        if (primary && p.layoutGrow && mode !== 'FILL') { s.flex = '1 1 auto'; s[dim] = mode === 'FIXED' ? '' : s[dim]; }
      };
      axis('H', H); axis('V', Vv);
      if (dir && !s.flex) s.flex = '0 0 auto';
      // aparência
      const bgs = [], colors = [];
      for (const f of p.fills || []) {
        if (f.visible === false) continue;
        if (f.type === 'SOLID') colors.push(css(f.color, f.opacity));
        else if (f.type === 'IMAGE') bgs.push(`url(${IMAGES.get(f.imageHash)}) center/cover no-repeat`);
        else if (f.type && f.type.startsWith('GRADIENT')) bgs.push(`linear-gradient(180deg, ${f.gradientStops.map((g) => css(g.color, g.color.a) + ' ' + g.position * 100 + '%').join(',')})`);
      }
      if (this.type === 'TEXT') { s.color = colors[colors.length - 1] || '#000'; s.background = ''; }
      else s.background = [...bgs.reverse(), colors.length ? colors[colors.length - 1] : 'transparent'].join(',');
      const shadows = [];
      for (const e of p.effects || []) if (e.type === 'DROP_SHADOW' && e.visible !== false) shadows.push(`${PX(e.offset.x)} ${PX(e.offset.y)} ${PX(e.radius)} ${PX(e.spread || 0)} ${css(e.color, e.color.a)}`);
      const st = (p.strokes || []).find((x) => x.type === 'SOLID');
      s.outline = '';
      if (st && this.type !== 'TEXT') {
        const c = css(st.color, st.opacity);
        if (p.dashPattern && p.dashPattern.length) { s.outline = `${PX(p.strokeWeight)} dashed ${c}`; s.outlineOffset = PX(-p.strokeWeight); }
        else if (p.sides) {
          const sd = p.sides;
          if (sd.t) shadows.push(`inset 0 ${PX(sd.t)} 0 0 ${c}`); if (sd.b) shadows.push(`inset 0 ${PX(-sd.b)} 0 0 ${c}`);
          if (sd.l) shadows.push(`inset ${PX(sd.l)} 0 0 0 ${c}`); if (sd.r) shadows.push(`inset ${PX(-sd.r)} 0 0 0 ${c}`);
        } else shadows.push(`inset 0 0 0 ${PX(p.strokeWeight)} ${c}`);
      }
      s.boxShadow = shadows.join(',');
      const r = p.radii;
      s.borderRadius = this.type === 'ELLIPSE' ? '50%' : r ? `${PX(r.tl)} ${PX(r.tr)} ${PX(r.br)} ${PX(r.bl)}` : PX(Math.min(p.cornerRadius, 9999));
      s.overflow = p.clipsContent || this.type === 'TEXT' && p.maxLines ? 'hidden' : 'visible';
      if (this.type === 'TEXT') this.applyText();
      if (this.svg) { this.svg.setAttribute('width', '100%'); this.svg.setAttribute('height', '100%'); }
    }
    syncOwnSizingSilently() {
      const hor = this.p.layoutMode === 'HORIZONTAL';
      const pm = this.p.primaryAxisSizingMode === 'AUTO' ? 'HUG' : 'FIXED';
      const cm = this.p.counterAxisSizingMode === 'AUTO' ? 'HUG' : 'FIXED';
      if (this.p.sizingH !== 'FILL') this.p.sizingH = hor ? pm : cm;
      if (this.p.sizingV !== 'FILL') this.p.sizingV = hor ? cm : pm;
    }
  }

  class Text extends Node {
    constructor() { super('TEXT', { fontName: { family: 'Inter', style: 'Regular' }, characters: '', fontSize: 12, lineHeight: null, letterSpacing: null, textAutoResize: 'WIDTH_AND_HEIGHT', ranges: [], align: 'LEFT', maxLines: null }); this.p.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; this.apply(); }
    get characters() { return this.p.characters; } set characters(v) { this.p.characters = v; this.p.ranges = []; this.apply(); }
    get fontName() { return this.p.fontName; } set fontName(v) { if (!loaded.has(v.family + '|' + v.style)) warn('fonte não carregada ' + v.family + ' ' + v.style); this.p.fontName = v; this.apply(); }
    get fontSize() { return this.p.fontSize; } set fontSize(v) { this.p.fontSize = v; this.apply(); }
    get lineHeight() { return this.p.lineHeight; } set lineHeight(v) { this.p.lineHeight = v; this.apply(); }
    get letterSpacing() { return this.p.letterSpacing; } set letterSpacing(v) { this.p.letterSpacing = v; this.apply(); }
    get textAutoResize() { return this.p.textAutoResize; } set textAutoResize(v) { this.p.textAutoResize = v; if (v === 'WIDTH_AND_HEIGHT' && this.p.sizingH !== 'FILL') this.p.sizingH = 'HUG'; this.apply(); }
    get textAlignHorizontal() { return this.p.align; } set textAlignHorizontal(v) { this.p.align = v; this.apply(); }
    get textTruncation() { return this.p.trunc || 'DISABLED'; } set textTruncation(v) { this.p.trunc = v; this.apply(); }
    get maxLines() { return this.p.maxLines; } set maxLines(v) { this.p.maxLines = v; this.apply(); }
    set paragraphSpacing(v) {}
    setRangeFills(a, b, fills) { if (b > this.p.characters.length) warn(this.p.name + ': range além do texto'); this.p.ranges.push([a, b, fills]); this.apply(); }
    async setTextStyleIdAsync() {}
    applyText() {
      const p = this.p, s = this.el.style;
      const fam = /unageo/i.test(p.fontName.family) ? 'Unageo' : 'InterV';
      s.fontFamily = fam; s.fontWeight = WEIGHT[p.fontName.style] || 400; s.fontSize = PX(p.fontSize);
      s.lineHeight = p.lineHeight && p.lineHeight.unit === 'PIXELS' ? PX(p.lineHeight.value) : p.lineHeight && p.lineHeight.unit === 'PERCENT' ? p.lineHeight.value / 100 : 'normal';
      s.letterSpacing = p.letterSpacing && p.letterSpacing.unit === 'PERCENT' ? (p.letterSpacing.value / 100) + 'em' : '';
      s.textAlign = { LEFT: 'left', CENTER: 'center', RIGHT: 'right' }[p.align] || 'left';
      if (p.maxLines) { s.webkitLineClamp = p.maxLines; s.webkitBoxOrient = 'vertical'; s.whiteSpace = 'normal'; }
      const chars = p.characters;
      if (!p.ranges.length) { this.el.textContent = chars; return; }
      const color = new Array(chars.length).fill(null);
      for (const [a, b, f] of p.ranges) for (let i = a; i < b; i++) color[i] = f[0] && f[0].color ? css(f[0].color) : null;
      this.el.innerHTML = '';
      let i = 0;
      while (i < chars.length) { let j = i; while (j < chars.length && color[j] === color[i]) j++; const sp = document.createElement('span'); sp.textContent = chars.slice(i, j); if (color[i]) sp.style.color = color[i]; this.el.appendChild(sp); i = j; }
    }
  }

  // ---- componentes e instâncias
  function cloneNode(src) {
    let n;
    if (src.type === 'TEXT') n = new Text();
    else n = new Node(src.type === 'COMPONENT' ? 'INSTANCE' : src.type);
    n.p = JSON.parse(JSON.stringify(src.p));
    n.el.dataset.name = n.p.name;
    n.componentPropertyReferences = src.componentPropertyReferences ? Object.assign({}, src.componentPropertyReferences) : null;
    if (src.svgSource) setSvg(n, src.svgSource);
    if (src.mainRef) n.mainRef = src.mainRef;
    for (const c of src.children) { const k = cloneNode(c); n.children.push(k); k.parent = n; n.el.appendChild(k.el); }
    n.apply(); n.applyKids();
    return n;
  }
  function setSvg(n, svg) {
    n.svgSource = svg;
    n.el.innerHTML = svg;
    n.svg = n.el.querySelector('svg');
    if (n.svg) { n.svg.style.display = 'block'; n.svg.setAttribute('preserveAspectRatio', 'none'); }
  }

  class Component extends Node {
    constructor() { super('COMPONENT'); }
    addComponentProperty(name, type, def) { const k = `${name}#${nextId++}:0`; this.componentProps[k] = { type, def }; return k; }
    createInstance() {
      const i = cloneNode(this);
      i.type = 'INSTANCE';
      i.main = this;
      Object.setPrototypeOf(i, Instance.prototype);
      figma.currentPage.appendChild(i);
      return i;
    }
  }
  class Instance extends Node {
    setProperties(props) {
      for (const [k, v] of Object.entries(props)) {
        if (!(k in this.main.componentProps)) { warn('setProperties: chave ' + k + ' não existe'); continue; }
        for (const n of [this, ...this.findAll()]) {
          const r = n.componentPropertyReferences;
          if (!r) continue;
          if (r.characters === k) n.characters = v;
          if (r.visible === k) n.visible = !!v;
          if (r.mainComponent === k) {
            const comp = byId.get(v);
            if (!comp) { warn('componente não encontrado ' + v); continue; }
            const repl = cloneNode(comp);
            Object.setPrototypeOf(repl, Instance.prototype); repl.type = 'INSTANCE'; repl.main = comp;
            repl.componentPropertyReferences = r;
            repl.p.x = n.p.x; repl.p.y = n.p.y;
            const par = n.parent, idx = par.children.indexOf(n);
            n.remove(); par.insertChild(idx, repl);
          }
        }
      }
    }
    detachInstance() { this.type = 'FRAME'; Object.setPrototypeOf(this, Node.prototype); return this; }
    get mainComponent() { return this.main; }
  }

  const loaded = new Set();
  const page = (name) => { const n = new Node('PAGE'); n.p.name = name; n.el.className = 'figma-page'; n.el.style.position = 'relative'; n.loadAsync = async () => {}; return n; };
  const pages = [page('Page 1')];
  document.getElementById('root').appendChild(pages[0].el);
  const variables = [];
  const textStyles = [];

  const figma = {
    get root() { return { children: pages }; },
    currentPage: pages[0],
    async setCurrentPageAsync(p) { for (const x of pages) x.el.style.display = x === p ? 'block' : 'none'; figma.currentPage = p; },
    createPage() { const p = page('Página'); pages.push(p); document.getElementById('root').appendChild(p.el); p.el.style.display = 'none'; return p; },
    createFrame() { const f = new Node('FRAME'); f.p.sizingH = 'FIXED'; f.p.sizingV = 'FIXED'; f.p.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; figma.currentPage.appendChild(f); return f; },
    createAutoLayout(dir) { const f = figma.createFrame(); f.p.layoutMode = dir || 'HORIZONTAL'; f.p.primaryAxisSizingMode = 'AUTO'; f.p.counterAxisSizingMode = 'AUTO'; f.p.sizingH = 'HUG'; f.p.sizingV = 'HUG'; f.apply(); return f; },
    createComponent() { const c = new Component(); c.p.sizingH = 'FIXED'; c.p.sizingV = 'FIXED'; c.p.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; figma.currentPage.appendChild(c); return c; },
    createRectangle() { const r = new Node('RECTANGLE'); r.p.sizingH = 'FIXED'; r.p.sizingV = 'FIXED'; r.p.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.85 } }]; figma.currentPage.appendChild(r); return r; },
    createEllipse() { const r = new Node('ELLIPSE'); r.p.sizingH = 'FIXED'; r.p.sizingV = 'FIXED'; r.p.fills = [{ type: 'SOLID', color: { r: 0.85, g: 0.85, b: 0.85 } }]; figma.currentPage.appendChild(r); return r; },
    createSection() { const s = new Node('SECTION'); s.p.sizingH = 'FIXED'; s.p.sizingV = 'FIXED'; s.p.fills = [{ type: 'SOLID', color: { r: 0.93, g: 0.93, b: 0.93 } }]; s.p.cornerRadius = 16; figma.currentPage.appendChild(s); return s; },
    createText() { const t = new Text(); figma.currentPage.appendChild(t); return t; },
    createNodeFromSvg(svg) {
      const f = new Node('FRAME');
      f.p.sizingH = 'FIXED'; f.p.sizingV = 'FIXED';
      const m = svg.match(/<svg[^>]*\swidth="([\d.]+)"[^>]*\sheight="([\d.]+)"/);
      if (m) { f.p.w = +m[1]; f.p.h = +m[2]; }
      setSvg(f, svg);
      // filhos "vetor" só para o script poder percorrer
      const count = Math.min((svg.match(/<(path|rect)\b/g) || []).length, 3);
      for (let i = 0; i < count; i++) { const v = new Node('VECTOR'); v.p.visible = false; v.p.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; f.children.push(v); v.parent = f; }
      figma.currentPage.appendChild(f);
      return f;
    },
    createImage(bytes) { const h = 'img' + nextId++; IMAGES.set(h, 'data:image/jpeg;base64,' + bytes.b64); return { hash: h }; },
    base64Decode(b64) { return { b64, length: b64.length }; },
    async listAvailableFontsAsync() {
      return ['Regular', 'Medium', 'Semi Bold', 'Bold'].map((s) => ({ fontName: { family: 'Inter', style: s } }))
        .concat(['Medium', 'SemiBold', 'Bold'].map((s) => ({ fontName: { family: 'Unageo', style: s } })));
    },
    async loadFontAsync(f) { loaded.add(f.family + '|' + f.style); },
    async getLocalTextStylesAsync() { return textStyles; },
    createTextStyle() { const s = { id: 'S:' + nextId++ }; textStyles.push(s); return s; },
    notify(m) { console.log('notify: ' + m); window.__notify = m; },
    closePlugin() {},
    viewport: { scrollAndZoomIntoView() {} },
    variables: {
      async getLocalVariableCollectionsAsync() { return []; },
      async getLocalVariablesAsync() { return variables; },
      createVariableCollection(name) { return { name, modes: [{ modeId: 'm1' }], renameMode() {} }; },
      createVariable(name) { const v = { name, id: 'v' + nextId++, scopes: [], setValueForMode() {} }; variables.push(v); return v; },
      setBoundVariableForPaint(p) { return Object.assign({}, p); },
    },
  };
  window.figma = figma;
  window.print = (m) => console.log('print: ' + m);
  window.__warnings = warnings;
})();
