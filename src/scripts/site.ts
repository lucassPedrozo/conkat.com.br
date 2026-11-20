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

  // Link da seção visível
  const links = [...el.querySelectorAll<HTMLAnchorElement>('.nav-link')];
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
    window.setInterval(() => {
      if (!visible || document.hidden) return;
      word.classList.add('out');
      window.setTimeout(() => {
        i = (i + 1) % words.length;
        word.textContent = words[i];
        word.classList.remove('out');
        word.classList.add('in-start');
        void word.offsetWidth;
        word.classList.remove('in-start');
      }, 150);
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
// Carrossel: setas, pontos e ativação de cada prévia
// ---------------------------------------------------------------------------
function carousel() {
  const root = document.querySelector<HTMLElement>('[data-carousel]');
  if (!root) return;
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const cards = [...track.querySelectorAll<HTMLElement>('.card')];
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-next]');
  const dots = [...root.querySelectorAll<HTMLElement>('.dots span')];

  const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || '24');
  const go = (dir: number) => track.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));

  const sync = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max;
    const index = track.scrollLeft >= max ? cards.length - 1 : Math.round(track.scrollLeft / step());
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  };
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync);
  sync();

  // Setas do teclado quando o foco está no carrossel
  track.tabIndex = 0;
  track.setAttribute('aria-label', 'Recursos do app, role para o lado');
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  // Cada prévia ganha vida uma vez, quando aparece por inteiro
  if (reduceMotion || !('IntersectionObserver' in window)) {
    cards.forEach((c) => c.classList.add('is-on'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-on');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.7 },
  );
  cards.forEach((c) => io.observe(c));
}

// ---------------------------------------------------------------------------
// Gráfico de desempenho: as linhas são desenhadas quando o card aparece
// ---------------------------------------------------------------------------
function chart() {
  document.querySelectorAll<HTMLElement>('[data-chart]').forEach((el) => once(el, () => el.classList.add('is-on'), 0.45));
}

header();
rotators();
howItWorks();
carousel();
chart();
