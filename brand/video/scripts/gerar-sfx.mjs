// Sound design do vídeo (só efeitos, sem música: a música entra na hora de postar,
// pela biblioteca do Instagram/TikTok). Síntese própria, sem amostras de terceiros.
// Eventos lidos de src/timeline.json. Saída: public/audio/sfx.wav (pico em -20 dBFS).
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';

const TL = JSON.parse(readFileSync('src/timeline.json', 'utf8'));
const SR = 48000;
const N = Math.round(SR * TL.end);
const TAU = Math.PI * 2;
const L = new Float32Array(N);
const R = new Float32Array(N);
const SEND = new Float32Array(N);

let seed = 20261124;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const clamp01 = (x) => Math.min(1, Math.max(0, x));

function put(t0, len, fn, { pan = 0, send = 0.2, gain = 1 } = {}) {
  const s0 = Math.max(0, Math.round(t0 * SR));
  const n = Math.round(len * SR);
  for (let i = 0; i < n && s0 + i < N; i++) {
    const tt = i / SR;
    const p = typeof pan === 'function' ? pan(tt / len) : pan;
    const a = ((p + 1) * Math.PI) / 4;
    const v = fn(tt) * gain;
    L[s0 + i] += v * Math.cos(a);
    R[s0 + i] += v * Math.sin(a);
    SEND[s0 + i] += v * send;
  }
}

// ---------- sons ----------
// clique de interface: transiente curto e seco
const tick = (t0, gain = 1, pan = 0) => {
  let hp = 0;
  put(t0, 0.06, (t) => {
    const n = rnd();
    hp += 0.55 * (n - hp);
    return ((n - hp) * Math.exp(-t / 0.0035) * 0.5 + Math.sin(TAU * 2900 * t) * Math.exp(-t / 0.012) * 0.35) * clamp01(t / 0.0005);
  }, { gain: 0.32 * gain, pan, send: 0.12 });
};
// "bloop" suave: entrada de card
const plop = (t0, gain = 1) => {
  let lp = 0;
  put(t0, 0.3, (t) => {
    const f = 210 + 330 * (1 - Math.exp(-t / 0.018));
    const body = Math.sin(TAU * f * t + 0.6 * Math.sin(TAU * f * 2 * t) * Math.exp(-t / 0.03)) * Math.exp(-t / 0.085);
    lp += 0.08 * (rnd() - lp);
    return (body + lp * Math.exp(-t / 0.004) * 1.5) * clamp01(t / 0.002);
  }, { gain: 0.42 * gain, send: 0.18 });
};
// brilho curto: selo "Verificado"
const tink = (t0, gain = 1) =>
  put(t0, 0.5, (t) => (Math.sin(TAU * 2637 * t) + 0.3 * Math.sin(TAU * 3951 * t) * Math.exp(-t / 0.05)) * Math.exp(-t / 0.15) * clamp01(t / 0.001), {
    gain: 0.11 * gain, pan: 0.3, send: 0.45,
  });
// movimento de ar: troca de palavra, saídas, slide
const swish = (t0, len, gain = 1, pan0 = -0.4, pan1 = 0.4, f0 = 0.02, f1 = 0.22) => {
  let s1 = 0, s2 = 0;
  put(t0, len, (t) => {
    const p = t / len;
    const env = p < 0.7 ? Math.pow(p / 0.7, 2) : Math.pow(1 - (p - 0.7) / 0.3, 1.6);
    const k = f0 + (f1 - f0) * Math.sin((Math.PI / 2) * p);
    const n = rnd();
    s1 += k * (n - s1);
    s2 += k * 0.35 * (s1 - s2);
    return (s1 - s2) * env * (1 + 4 * k);
  }, { gain: 0.5 * gain, pan: (q) => pan0 + (pan1 - pan0) * q, send: 0.15 });
};
// onda escura: sopro grave que cresce e assenta num baque macio
const whoom = (t0, len) => {
  let lp = 0;
  put(t0, len, (t) => {
    const p = t / len;
    const env = Math.pow(p, 2.2) * (p > 0.92 ? (1 - p) / 0.08 : 1);
    lp += (0.01 + 0.06 * p) * (rnd() - lp);
    return lp * env * 3 + Math.sin(TAU * (48 + 30 * p) * t) * env * 0.25;
  }, { gain: 0.55, send: 0.2 });
  put(t0 + len * 0.92, 0.6, (t) => Math.sin(TAU * (70 - 25 * (1 - Math.exp(-t / 0.08))) * t) * Math.exp(-t / 0.16) * clamp01(t / 0.003), { gain: 0.45, send: 0.1 });
};
// sino do botão (FM), duas notas
const bell = (t0, f, gain = 1) =>
  put(t0, 2.4, (t) => {
    const idx = 1.8 * Math.exp(-t / 0.25);
    return (Math.sin(TAU * f * t + idx * Math.sin(TAU * f * 2.0 * t)) + 0.25 * Math.sin(TAU * f * 3 * t) * Math.exp(-t / 0.2)) * Math.exp(-t / 0.75) * clamp01(t / 0.002);
  }, { gain: 0.2 * gain, send: 0.55 });

// ---------- roteiro (sutil: poucos eventos, baixo volume, nada de graves ou brilho forte) ----------
// tap abafado: versão filtrada e curta do bloop, para a entrada dos cards
const tap = (t0, gain = 1) => {
  let lp = 0, lp2 = 0;
  put(t0, 0.18, (t) => {
    const f = 300 + 120 * (1 - Math.exp(-t / 0.015));
    const v = Math.sin(TAU * f * t) * Math.exp(-t / 0.045) * clamp01(t / 0.003);
    lp += 0.25 * (v - lp); lp2 += 0.25 * (lp - lp2);
    return lp2;
  }, { gain: 0.3 * gain, send: 0.1 });
};
// sino suave: só a fundamental e um parcial baixo, sem FM metálico
const softBell = (t0, f, gain = 1) =>
  put(t0, 2.2, (t) => (Math.sin(TAU * f * t) + 0.18 * Math.sin(TAU * f * 2 * t) * Math.exp(-t / 0.3)) * Math.exp(-t / 0.6) * clamp01(t / 0.006), { gain: 0.1 * gain, send: 0.35 });

// só o essencial: um sopro de ar baixo nas trocas, um toque abafado nos cards e um sino discreto no botão
TL.words.forEach((w, i) => { if (i > 0) swish(w - 0.14, 0.34, 0.12, 0.15, -0.15, 0.008, 0.05); });
TL.cards.forEach((c, i) => tap(c + 0.04, i === 0 ? 0.55 : 0.4));
swish(TL.wipe - 0.05, TL.wipeDur + 0.2, 0.16, -0.2, 0.2, 0.006, 0.04);
softBell(TL.ding, 1046.5, 0.7);

// ---------- reverb de sala pequena (Freeverb) ----------
const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((n) => Math.round((n * SR) / 44100));
const apT = [556, 441, 341, 225].map((n) => Math.round((n * SR) / 44100));
class Comb { constructor(n) { this.b = new Float32Array(n); this.i = 0; this.s = 0; }
  p(x, fb, d) { const o = this.b[this.i]; this.s = o * (1 - d) + this.s * d; this.b[this.i] = x + this.s * fb; if (++this.i >= this.b.length) this.i = 0; return o; } }
class AP { constructor(n) { this.b = new Float32Array(n); this.i = 0; }
  p(x) { const b = this.b[this.i]; const o = b - x; this.b[this.i] = x + b * 0.5; if (++this.i >= this.b.length) this.i = 0; return o; } }
{
  const cL = combT.map((n) => new Comb(n)), cR = combT.map((n) => new Comb(n + 25));
  const aL = apT.map((n) => new AP(n)), aR = apT.map((n) => new AP(n + 25));
  const pre = Math.round(0.012 * SR);
  for (let i = 0; i < N; i++) {
    const x = (i >= pre ? SEND[i - pre] : 0) * 0.025;
    let l = 0, r = 0;
    for (const c of cL) l += c.p(x, 0.78, 0.45);
    for (const c of cR) r += c.p(x, 0.78, 0.45);
    for (const a of aL) l = a.p(l);
    for (const a of aR) r = a.p(r);
    L[i] += l;
    R[i] += r;
  }
}

// ---------- master: corte de subgrave, pico em -3 dBFS ----------
let hl = 0, hr = 0, ll = 0, lr = 0, peak = 0;
for (let i = 0; i < N; i++) {
  hl += 0.0026 * (L[i] - hl); hr += 0.0026 * (R[i] - hr); // passa-altas ~20 Hz
  L[i] -= hl; R[i] -= hr;
  ll += 0.45 * (L[i] - ll); lr += 0.45 * (R[i] - lr); L[i] = ll; R[i] = lr; // passa-baixas ~7 kHz
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const g = Math.pow(10, -20 / 20) / peak; // pico em -20 dBFS: fica por baixo da música do Instagram
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const fade = clamp01((TL.end - i / SR) / 0.3);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g * fade)) * 32767), i * 4);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g * fade)) * 32767), i * 4 + 2);
}
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8);
h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34);
h.write('data', 36); h.writeUInt32LE(data.length, 40);
mkdirSync('public/audio', { recursive: true });
writeFileSync('public/audio/sfx.wav', Buffer.concat([h, data]));
console.log('ok public/audio/sfx.wav');
