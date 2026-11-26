import React, { useState } from 'react';
import { AbsoluteFill, Easing, Img, continueRender, delayRender, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Audio } from '@remotion/media';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { measureText } from '@remotion/layout-utils';
import { C, SERVICOS, T, W, type Servico } from './tokens';
import { LOGO } from './logo';

/* ============================================================
   Movimento
   Regra de acabamento: entradas longas e suaves (expo-out),
   saídas curtas e decididas (expo-in), springs criticamente
   amortecidos (sem "quique" de desenho animado).
   ============================================================ */
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const EXPO_IN = Easing.bezier(0.7, 0, 0.84, 0);
const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const SLIDE = Easing.bezier(0.6, 0, 0.2, 1);
const ramp = (t: number, start: number, dur: number, ease: (n: number) => number = EXPO_OUT) => ease(clamp01((t - start) / dur));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const sp = (t: number, start: number, fps: number, damping = 20, stiffness = 120, mass = 1) =>
  spring({ frame: Math.max(0, (t - start) * fps), fps, config: { damping, stiffness, mass } });
// força composição na GPU: posicionamento subpixel, sem "degraus" em movimentos lentos
const GPU: React.CSSProperties = { willChange: 'transform, opacity', backfaceVisibility: 'hidden' };

/* ============================================================
   Fontes
   ============================================================ */
const FACES: [string, string, string][] = [
  ['Unageo', 'fonts/unageo-semibold.woff2', '600'],
  ['Inter', 'fonts/inter-latin-400-normal.woff2', '400'],
  ['Inter', 'fonts/inter-latin-500-normal.woff2', '500'],
  ['Inter', 'fonts/inter-latin-600-normal.woff2', '600'],
];
const useFonts = () => {
  const [handle] = useState(() => delayRender('fontes'));
  const [ready, setReady] = useState(false);
  React.useEffect(() => {
    Promise.all(FACES.map(([family, file, weight]) => new FontFace(family, `url(${staticFile(file)})`, { weight }).load().then((f) => document.fonts.add(f)))).then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);
  return ready;
};
const UN = "'Unageo', 'Inter', system-ui, sans-serif";
const IN = "'Inter', system-ui, sans-serif";

/* ============================================================
   Ícones Phosphor (fill)
   ============================================================ */
const STAR =
  'M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z';
const SEAL =
  'M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.670-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.310c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.140c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z';
const Icon = ({ d, size, color }: { d: string; size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill={color} style={{ flex: 'none' }}>
    <path d={d} />
  </svg>
);

/* ============================================================
   Texto que sobe de dentro de uma janela (máscara)
   ============================================================ */
const Rise = ({
  t,
  start,
  dur = 0.8,
  out,
  children,
  style,
}: {
  t: number;
  start: number;
  dur?: number;
  out?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  const p = ramp(t, start, dur);
  const o = out === undefined ? 0 : ramp(t, out, 0.4, EXPO_IN);
  return (
    <div style={{ overflow: 'hidden', paddingBottom: '0.18em', marginBottom: '-0.18em', ...style }}>
      <div style={{ ...GPU, transform: `translate3d(0, ${((1 - p) * 105 - o * 105).toFixed(3)}%, 0)`, opacity: clamp01(p * 2.5) * (1 - o) }}>{children}</div>
    </div>
  );
};

/* ============================================================
   Fundo (padrão de ícones do app, parado: movimento em linhas
   finas gera cintilação)
   ============================================================ */
const Pattern = ({ opacity }: { opacity: number }) => (
  <AbsoluteFill style={{ backgroundImage: `url(${staticFile('pattern.svg')})`, backgroundSize: '1176px 1176px', backgroundPosition: '-60px -40px', opacity }} />
);

/* ============================================================
   Cabeçalho: "Qual [serviço] você procura?" — a frase do app
   ============================================================ */
const HERO = { top: 450, size: 150, box: 186, baseline: 146 };
const CUR = { w: 62, h: 24, gap: 14 };

const Header = ({ t, fps, ready }: { t: number; fps: number; ready: boolean }) => {
  const widths = SERVICOS.map((s) =>
    ready ? measureText({ text: s.palavra, fontFamily: 'Unageo', fontSize: HERO.size, fontWeight: '600', letterSpacing: '-0.01em' }).width : 0
  );
  const lefts = widths.map((w) => (W - (w + CUR.gap + CUR.w)) / 2);
  const ends = widths.map((w, i) => lefts[i] + w + CUR.gap);

  // índice do serviço atual e deslocamento do cursor (desliza até o fim da palavra nova)
  let cx = ends[0];
  for (let i = 1; i < SERVICOS.length; i++) {
    const g = sp(t, T.words[i] + 0.05, fps, 22, 140, 1);
    cx = lerp(cx, ends[i], g);
  }
  const outAll = T.headerOut;
  const curIn = sp(t, T.words[0] + 0.45, fps, 18, 200, 0.7);
  const curOut = ramp(t, outAll + 0.05, 0.35, EXPO_IN);
  // pisca suave nas pausas (como o cursor da logo)
  const sinceSwap = Math.min(...T.words.map((w) => (t >= w ? t - w : 99)));
  const blink = sinceSwap > 1.0 ? 0.55 + 0.45 * Math.cos(((sinceSwap - 1.0) / 1.0) * Math.PI * 2) : 1;

  return (
    <>
      <Rise
        t={t}
        start={0.0}
        out={outAll}
        style={{ position: 'absolute', top: HERO.top - 112, left: 0, width: W, textAlign: 'center', fontFamily: UN, fontWeight: 600, fontSize: 84, lineHeight: '100px', color: C.ink }}
      >
        Qual
      </Rise>

      {SERVICOS.map((s, i) => {
        const start = T.words[i];
        if (t < start) return null;
        const next = T.words[i + 1];
        const o = next === undefined ? ramp(t, outAll + 0.03, 0.4, EXPO_IN) : ramp(t, next - 0.1, 0.3, IN_OUT);
        if (o >= 1) return null;
        return (
          <div
            key={s.palavra}
            style={{ position: 'absolute', left: lefts[i], top: HERO.top, height: HERO.box, overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            <div style={{ ...GPU, transform: `translate3d(0, ${(-o * 100).toFixed(3)}%, 0)`, opacity: 1 - o * 0.6 }}>
              {s.palavra.split('').map((ch, k) => {
                const p = ramp(t, start + (i === 0 ? 0 : 0.12) + k * 0.028, 0.75);
                return (
                  <span
                    key={k}
                    style={{
                      ...GPU,
                      display: 'inline-block',
                      fontFamily: UN,
                      fontWeight: 600,
                      fontSize: HERO.size,
                      lineHeight: `${HERO.box}px`,
                      letterSpacing: '-0.01em',
                      color: C.accentText,
                      transform: `translate3d(0, ${((1 - p) * 100).toFixed(3)}%, 0)`,
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* cursor laranja da marca */}
      <div
        style={{
          ...GPU,
          position: 'absolute',
          left: 0,
          top: HERO.top + HERO.baseline - CUR.h,
          width: CUR.w,
          height: CUR.h,
          background: C.accent,
          transform: `translate3d(${cx.toFixed(3)}px, ${(curOut * -40).toFixed(3)}px, 0) scaleX(${lerp(0.3, 1, clamp01(curIn)).toFixed(4)})`,
          transformOrigin: '0% 50%',
          opacity: clamp01(curIn) * blink * (1 - curOut),
        }}
      />

      <Rise
        t={t}
        start={0.12}
        out={outAll + 0.06}
        style={{ position: 'absolute', top: HERO.top + HERO.box + 22, left: 0, width: W, textAlign: 'center', fontFamily: UN, fontWeight: 600, fontSize: 84, lineHeight: '100px', color: C.ink }}
      >
        você procura?
      </Rise>
    </>
  );
};

/* ============================================================
   Card de anúncio (ListingCard do app ×2,5)
   ============================================================ */
const CARD = { x: 90, y: 960, w: 900, h: 270, r: 50, pad: 30, photo: 210, photoR: 35 };
// sombra em camadas (contato + difusa + ambiente), sempre em ink, como os elementos que flutuam no app
const shadowAt = (m: number) =>
  `0 1px 2px rgba(11,43,42,${lerp(0.06, 0.1, m).toFixed(3)}), ` +
  `0 ${lerp(10, 14, m).toFixed(1)}px 28px rgba(11,43,42,${lerp(0.07, 0.16, m).toFixed(3)}), ` +
  `0 ${lerp(36, 40, m).toFixed(1)}px 80px -16px rgba(11,43,42,${lerp(0.16, 0.38, m).toFixed(3)})`;
const SHADOW = shadowAt(0);
const price = (s: Servico, p: number) => `${s.prefixo}${Math.round(s.valor * p)}${s.sufixo}`;

const CardBody = ({ s, tIn }: { s: Servico; tIn: number }) => {
  const row = (k: number): React.CSSProperties => {
    const p = ramp(tIn, 0.1 + k * 0.07, 0.7);
    return { ...GPU, transform: `translate3d(0, ${((1 - p) * 26).toFixed(3)}px, 0)`, opacity: clamp01(p * 1.6) };
  };
  const count = ramp(tIn, 0.2, 0.9);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <div style={{ ...row(0), fontFamily: IN, fontWeight: 600, fontSize: 40, lineHeight: '52px', color: C.text, whiteSpace: 'nowrap' }}>{s.titulo}</div>
      <div style={{ ...row(1), fontFamily: IN, fontWeight: 400, fontSize: 32, lineHeight: '44px', color: C.textMuted, whiteSpace: 'nowrap' }}>{s.categoria}</div>
      <div style={{ ...row(2), display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: UN, fontWeight: 600, fontSize: 40, color: C.primary, fontVariantNumeric: 'tabular-nums' }}>{price(s, count)}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: IN, fontWeight: 600, fontSize: 34, color: C.text }}>
          <Icon d={STAR} size={34} color={C.accent} />
          {s.nota}
        </span>
      </div>
    </div>
  );
};

const Photo = ({ s, size, radius, zoom = 1, opacity = 1 }: { s: Servico; size: number; radius: number; zoom?: number; opacity?: number }) => (
  <div style={{ width: size, height: size, borderRadius: radius, overflow: 'hidden', flex: 'none', background: C.primarySoft }}>
    <Img src={staticFile(s.foto)} style={{ ...GPU, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: `scale(${zoom.toFixed(4)})`, opacity }} />
  </div>
);

const ServiceCard = ({ s, i, t, fps }: { s: Servico; i: number; t: number; fps: number }) => {
  const start = T.cards[i];
  const tIn = t - start;
  if (tIn < 0) return null;
  const next = T.cards[i + 1];
  // o card anterior recua para trás do novo (pilha), em vez de cruzar com ele
  const back = next === undefined ? 0 : ramp(t, next, 0.45, EXPO_OUT);
  if (back >= 0.999) return null;

  const enter = sp(t, start, fps, 22, 115, 1);
  const y = lerp(170, 0, enter) - back * 40;
  const scale = lerp(1, 0.9, back);
  const opacity = clamp01(tIn / 0.12) * (1 - back);

  const chipIn = sp(t, start + 0.55, fps, 18, 190, 0.7);
  const chipEnd = next === undefined ? T.headerOut : next - 0.25;
  const chipOut = ramp(t, Math.min(start + 1.4, chipEnd), 0.35, EXPO_IN);

  return (
    <>
      <div
        style={{
          ...GPU,
          position: 'absolute',
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: CARD.r,
          background: C.surface,
          border: `1.5px solid ${C.border}`,
          boxShadow: SHADOW,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          padding: CARD.pad,
          opacity,
          transform: `translate3d(0, ${y.toFixed(3)}px, 0) scale(${scale.toFixed(4)})`,
          transformOrigin: '50% 0%',
          zIndex: 10 + i,
        }}
      >
        <Photo s={s} size={CARD.photo} radius={CARD.photoR} zoom={lerp(1.25, 1, ramp(tIn, 0, 1.4))} opacity={ramp(tIn, 0.04, 0.3)} />
        <CardBody s={s} tIn={tIn} />
      </div>
      {tIn > 0.55 && chipOut < 1 && back === 0 && (
        <div
          style={{
            ...GPU,
            position: 'absolute',
            left: CARD.x + CARD.w - 320,
            top: CARD.y - 96,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 30px 16px 22px',
            borderRadius: 999,
            background: C.primarySoft,
            fontFamily: IN,
            fontWeight: 600,
            fontSize: 36,
            color: C.primary,
            opacity: clamp01(chipIn * 1.4) * (1 - chipOut),
            transform: `translate3d(0, ${(lerp(30, 0, chipIn) - chipOut * 16).toFixed(3)}px, 0)`,
            zIndex: 30,
          }}
        >
          <Icon d={SEAL} size={42} color={C.primary} />
          Verificado
        </div>
      )}
    </>
  );
};

/* ============================================================
   Fechamento: card vira o botão, logo e CTA
   ============================================================ */
const PILL = { w: 700, h: 170, x: (W - 700) / 2, y: 990 };

const Closing = ({ t, fps }: { t: number; fps: number }) => {
  const s = SERVICOS[3];
  const p = t - T.morph;
  const m = ramp(p, 0, T.morphDur, IN_OUT);
  const x = lerp(CARD.x, PILL.x, m);
  const y = lerp(CARD.y, PILL.y, m);
  const w = lerp(CARD.w, PILL.w, m);
  const h = lerp(CARD.h, PILL.h, m);
  const r = lerp(CARD.r, PILL.h / 2, m);
  const mix = ramp(p, 0.12, 0.5, IN_OUT); // branco -> laranja sólido (sem gradiente)
  const fill = `rgb(${Math.round(lerp(255, 253, mix))},${Math.round(lerp(255, 163, mix))},${Math.round(lerp(255, 51, mix))})`;
  const bodyOp = 1 - ramp(p, 0, 0.22, EXPO_IN);
  const photoSize = lerp(CARD.photo, 122, m);
  const photoLeft = lerp(CARD.pad, 24, m);
  const slide = ramp(t, T.slide, T.slideDur, SLIDE);
  const label = ramp(t, T.slide + 0.08, 0.6);

  // ao "assentar", o botão dá um pequeno respiro (sem quique)
  const bump = t >= T.ding ? Math.sin(Math.PI * clamp01((t - T.ding) / 0.32)) : 0;
  const btnScale = 1 + 0.035 * bump;

  const reveal = ramp(t, T.logo, 0.8, IN_OUT);
  const cursorOn = sp(t, T.logo + 0.7, fps, 16, 200, 0.7);
  const since = t - (T.logo + 1.2);
  const blink = since > 0 && since < 2.4 ? 0.55 + 0.45 * Math.cos((since / 0.8) * Math.PI * 2) : 1;
  const proP = sp(t, T.pro, fps, 22, 110, 1);
  const logoW = 780;
  const logoH = (logoW * LOGO.h) / LOGO.w;

  return (
    <>
      <div style={{ position: 'absolute', left: (W - logoW) / 2, top: 560, width: logoW, height: logoH }}>
        <svg width={logoW} height={logoH} viewBox={LOGO.viewBox} style={{ overflow: 'visible', display: 'block' }}>
          <defs>
            <clipPath id="rev">
              <rect x={-10} y={-200} width={(LOGO.w + 20) * reveal} height={260} />
            </clipPath>
          </defs>
          <g clipPath="url(#rev)" fill="#FFFFFF">
            {LOGO.paths.map((d, k) => (
              <path key={k} d={d} />
            ))}
          </g>
          <rect
            x={LOGO.cursor.x}
            y={LOGO.cursor.y}
            width={LOGO.cursor.w}
            height={LOGO.cursor.h}
            fill={C.accent}
            opacity={clamp01(cursorOn) * blink}
            style={{ transformBox: 'fill-box', transformOrigin: '0% 50%', transform: `scaleX(${lerp(0.2, 1, clamp01(cursorOn)).toFixed(4)})` }}
          />
        </svg>
      </div>
      <Rise t={t} start={T.logo + 0.35} style={{ position: 'absolute', left: 0, top: 800, width: W, textAlign: 'center', fontFamily: IN, fontWeight: 500, fontSize: 44, lineHeight: '58px', color: C.textOnDarkMuted }}>
        Profissionais verificados
      </Rise>
      <Rise t={t} start={T.logo + 0.45} style={{ position: 'absolute', left: 0, top: 858, width: W, textAlign: 'center', fontFamily: IN, fontWeight: 500, fontSize: 44, lineHeight: '58px', color: C.textOnDarkMuted }}>
        perto de você.
      </Rise>

      <div
        style={{
          ...GPU,
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: r,
          background: fill,
          overflow: 'hidden',
          boxSizing: 'border-box',
          border: `${lerp(1.5, 0, mix).toFixed(2)}px solid ${C.border}`,
          boxShadow: shadowAt(m),
          transform: `scale(${btnScale.toFixed(4)})`,
          zIndex: 20,
        }}
      >
        <div style={{ position: 'absolute', left: CARD.pad + CARD.photo + 30, top: 0, height: '100%', display: 'flex', alignItems: 'center', opacity: bodyOp }}>
          <CardBody s={s} tIn={99} />
        </div>
        <div style={{ ...GPU, position: 'absolute', left: photoLeft, top: (h - photoSize) / 2, transform: `translate3d(${(slide * (w + 40)).toFixed(3)}px, 0, 0)` }}>
          <Photo s={s} size={photoSize} radius={lerp(CARD.photoR, 30, m)} />
        </div>
        <div
          style={{
            ...GPU,
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: UN,
            fontWeight: 600,
            fontSize: 76,
            color: C.ink,
            opacity: clamp01(label * 1.5),
            transform: `translate3d(${lerp(-70, 0, label).toFixed(3)}px, 0, 0)`,
          }}
        >
          Em breve
        </div>
      </div>

      <Rise t={t} start={T.storeLine} style={{ position: 'absolute', left: 0, width: W, top: PILL.y + PILL.h + 44, textAlign: 'center', fontFamily: IN, fontWeight: 400, fontSize: 36, color: C.textOnDarkMuted }}>
        na App Store e no Google Play
      </Rise>

      <div
        style={{
          ...GPU,
          position: 'absolute',
          left: 90,
          top: 1360,
          width: 900,
          boxSizing: 'border-box',
          padding: '44px 48px',
          borderRadius: 40,
          background: C.inkSoft,
          opacity: clamp01(proP * 1.6),
          transform: `translate3d(0, ${lerp(90, 0, proP).toFixed(3)}px, 0)`,
        }}
      >
        <Rise t={t} start={T.pro + 0.1} style={{ fontFamily: IN, fontWeight: 500, fontSize: 32, color: C.textOnDarkMuted }}>
          Para profissionais
        </Rise>
        <Rise t={t} start={T.pro + 0.2} style={{ fontFamily: UN, fontWeight: 600, fontSize: 48, lineHeight: '62px', color: C.textOnDark, marginTop: 10 }}>
          14 dias grátis no primeiro anúncio
        </Rise>
        <Rise t={t} start={T.pro + 0.3} style={{ fontFamily: UN, fontWeight: 600, fontSize: 48, lineHeight: '62px', color: C.accent }}>
          R$ 0 por contato
        </Rise>
      </div>
    </>
  );
};

/* ============================================================
   Cena
   ============================================================ */
const Scene = ({ ready }: { ready: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const wipe = ramp(t, T.wipe, T.wipeDur, IN_OUT);
  const light = t < T.wipe + T.wipeDur;

  return (
    <AbsoluteFill style={{ background: C.background }}>
      {light && (
        <>
          <Pattern opacity={0.4} />
          <Header t={t} fps={fps} ready={ready} />
        </>
      )}
      {/* o fundo escuro nasce de trás do card e cobre a tela */}
      {wipe > 0 && (
        <AbsoluteFill style={{ background: C.ink, clipPath: `circle(${(wipe * 1250).toFixed(2)}px at 540px ${CARD.y + CARD.h / 2}px)`, zIndex: 5 }}>
          <Pattern opacity={0.06} />
        </AbsoluteFill>
      )}
      {t < T.morph && SERVICOS.map((s, i) => <ServiceCard key={s.palavra} s={s} i={i} t={t} fps={fps} />)}
      {t >= T.morph && (
        <AbsoluteFill style={{ zIndex: 20 }}>
          <Closing t={t} fps={fps} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const Video = ({ muted = false }: { muted?: boolean }) => {
  const ready = useFonts();
  return (
    <AbsoluteFill style={{ background: C.background }}>
      {!muted && <Audio src={staticFile('audio/sfx.wav')} />}
      {/* desfoque de movimento real: média de sub-quadros, como obturador de câmera a 180° */}
      <CameraMotionBlur shutterAngle={180} samples={6}>
        <Scene ready={ready} />
      </CameraMotionBlur>
    </AbsoluteFill>
  );
};
