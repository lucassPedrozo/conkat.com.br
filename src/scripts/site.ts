// Interações do site. Sem bibliotecas: IntersectionObserver, transições CSS e o mesmo
// ritmo de movimento do app (ver src/styles/global.css).

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = window.matchMedia('(min-width: 1024px)');

/** Executa `fn` uma vez quando `el` entra na tela. */
function once(el: Element, fn: () => void, threshold = 0.5) {
  if (reduceMotion || !('IntersectionObserver' in window)) return fn();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          fn();
          io.disconnect();
        }
      }
    },
    { threshold },
  );
  io.observe(el);
}

// ---------------------------------------------------------------------------
// Cabeçalho: fundo ao rolar, some ao descer, volta ao subir, marca a seção atual
// ---------------------------------------------------------------------------
function header() {
  const el = document.querySelector<HTMLElement>('[data-header]');
  if (!el) return;
  const btn = el.querySelector<HTMLButtonElement>('[data-menu-btn]');
  const menu = el.querySelector<HTMLElement>('[data-menu]');
  let lastY = window.scrollY;
  let ticking = false;
  const menuOpen = () => btn?.getAttribute('aria-expanded') === 'true';

  const update = () => {
    const y = window.scrollY;
    el.classList.toggle('is-scrolled', y > 8);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (!menuOpen()) {
      if (goingDown && y > 480) el.classList.add('is-hidden');
      else if (goingUp || y < 480) el.classList.remove('is-hidden');
    }
    if (Math.abs(y - lastY) > 4) lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();

  const setMenu = (open: boolean) => {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('.visually-hidden')!.textContent = open ? 'Fechar menu' : 'Abrir menu';
    menu.hidden = !open;
    el.classList.toggle('is-scrolled', open || window.scrollY > 8);
  };
  btn?.addEventListener('click', () => setMenu(!menuOpen()));
  menu?.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen()) {
      setMenu(false);
      btn?.focus();
    }
  });
  desktop.addEventListener('change', () => setMenu(false));
  // Quem navega pelo teclado nunca fica com o cabeçalho escondido
  el.addEventListener('focusin', () => el.classList.remove('is-hidden'));

  // Link da seção visível (só os links para seções da página; "/apoie" é outra página)
  const links = [...el.querySelectorAll<HTMLAnchorElement>('.nav-link[href^="#"]')];
  const sections = links
    .map((a) => document.querySelector<HTMLElement>(a.getAttribute('href') || ''))
    .filter((s): s is HTMLElement => !!s);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${e.target.id}`));
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
  }
}

// ---------------------------------------------------------------------------
// Palavra que gira ("Qual [serviço] você procura?"): mesmo intervalo e movimento do app
// ---------------------------------------------------------------------------
function rotators() {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>('.rotator').forEach((el) => {
    const words: string[] = JSON.parse(el.dataset.words || '[]');
    const word = el.querySelector<HTMLElement>('.rotator-word');
    if (!word || words.length < 2) return;
    let i = 0;
    let visible = false;
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(el);
    const ease = 'cubic-bezier(0.2, 0, 0, 1)';
    window.setInterval(async () => {
      if (!visible || document.hidden) return;
      // Sai para cima (150 ms) e a próxima entra de baixo (200 ms), como no app
      await word.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-0.5em)' }], { duration: 150, easing: ease, fill: 'forwards' }).finished;
      i = (i + 1) % words.length;
      word.textContent = words[i];
      word.animate([{ opacity: 0, transform: 'translateY(0.5em)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: ease, fill: 'forwards' });
    }, 2800);
  });
}

// ---------------------------------------------------------------------------
// Como funciona: o passo no meio da tela define a tela do celular
// ---------------------------------------------------------------------------
function howItWorks() {
  const root = document.querySelector<HTMLElement>('[data-how]');
  if (!root) return;
  const steps = [...root.querySelectorAll<HTMLElement>('.step')];
  const screens = [...root.querySelectorAll<HTMLElement>('.how-stage [data-screen]')];
  const dots = [...root.querySelectorAll<HTMLElement>('[data-dot]')];
  const setActive = (n: number) => {
    steps.forEach((s, i) => s.classList.toggle('is-active', i === n));
    screens.forEach((s, i) => s.classList.toggle('is-active', i === n));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === n));
  };
  setActive(0);
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
    },
    { rootMargin: '-48% 0px -48% 0px' },
  );
  steps.forEach((s) => io.observe(s));
}

// ---------------------------------------------------------------------------
// "Antes de chamar": cada item da lista acende a parte do anúncio com o mesmo número
// ---------------------------------------------------------------------------
function anatomy() {
  const root = document.querySelector<HTMLElement>('[data-anatomy]');
  if (!root) return;
  const points = [...root.querySelectorAll<HTMLElement>('[data-point]')];
  const parts = [...root.querySelectorAll<HTMLElement>('[data-part]')];
  const set = (n: string | null) => {
    points.forEach((p) => p.classList.toggle('is-active', p.dataset.point === n));
    parts.forEach((p) => p.classList.toggle('is-active', p.dataset.part === n));
  };
  points.forEach((p) => {
    p.addEventListener('pointerenter', () => set(p.dataset.point!));
    p.addEventListener('pointerleave', () => set(null));
  });
  parts.forEach((p) => {
    p.addEventListener('pointerenter', () => set(p.dataset.part!));
    p.addEventListener('pointerleave', () => set(null));
  });
  once(root, () => root.classList.add('is-on'), 0.35);
}

// ---------------------------------------------------------------------------
// Gráfico de desempenho: as linhas são desenhadas quando o card aparece
// ---------------------------------------------------------------------------
function chart() {
  document.querySelectorAll<HTMLElement>('[data-chart]').forEach((el) => once(el, () => el.classList.add('is-on'), 0.45));
}

// ---------------------------------------------------------------------------
// Hero: profundidade ao rolar. Cada celular sobe numa velocidade (data-depth)
// ---------------------------------------------------------------------------
function heroDepth() {
  const panel = document.querySelector<HTMLElement>('[data-hero-panel]');
  if (!panel || reduceMotion) return;
  const slots = [...panel.querySelectorAll<HTMLElement>('[data-depth]')];
  let ticking = false;
  const update = () => {
    const y = Math.min(window.scrollY, panel.offsetTop + panel.offsetHeight);
    for (const s of slots) s.style.transform = `translate3d(0, ${(-y * Number(s.dataset.depth)).toFixed(1)}px, 0)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
}

header();
heroDepth();
rotators();
howItWorks();
anatomy();
chart();
