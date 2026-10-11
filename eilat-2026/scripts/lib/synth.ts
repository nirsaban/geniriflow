// Procedural audio: every sound effect, ambience bed and music cue in the film
// is synthesised here from oscillators, noise and filters. Nothing is sampled,
// so all audio is original and needs no licence. Generation is deterministic
// (seeded RNG) so re-running the pipeline reproduces identical files.

import { SR } from './wav.js';

export type Buf = Float32Array;

let seed = 1;
export const reseed = (s: number) => {
  seed = s >>> 0 || 1;
};
export const rnd = () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;

export const buf = (sec: number): Buf => new Float32Array(Math.ceil(sec * SR));
const TAU = Math.PI * 2;
const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);

export function mix(dst: Buf, src: Buf, atSec = 0, gain = 1) {
  const o = Math.round(atSec * SR);
  for (let i = 0; i < src.length && i + o < dst.length; i++) if (i + o >= 0) dst[i + o] += src[i] * gain;
  return dst;
}

export function normalize(b: Buf, peak = 0.89) {
  let m = 0;
  for (const v of b) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < b.length; i++) b[i] *= peak / m;
  return b;
}

function fadeEdges(b: Buf, inSec = 0.005, outSec = 0.02) {
  const ni = Math.floor(inSec * SR), no = Math.floor(outSec * SR);
  for (let i = 0; i < ni && i < b.length; i++) b[i] *= i / ni;
  for (let i = 0; i < no && i < b.length; i++) b[b.length - 1 - i] *= i / no;
  return b;
}

/** State-variable filter with per-sample cutoff. mode: lp | bp | hp */
function svf(b: Buf, cutoff: (i: number) => number, q = 0.7, mode: 'lp' | 'bp' | 'hp' = 'lp') {
  let low = 0, band = 0;
  const damp = 1 / q;
  for (let i = 0; i < b.length; i++) {
    const f = 2 * Math.sin((Math.PI * Math.min(cutoff(i), SR / 6)) / SR);
    low += f * band;
    const high = b[i] - low - damp * band;
    band += f * high;
    b[i] = mode === 'lp' ? low : mode === 'bp' ? band : high;
  }
  return b;
}
const lp = (b: Buf, c: number | ((i: number) => number), q = 0.7) => svf(b, typeof c === 'number' ? () => c : c, q, 'lp');
const bp = (b: Buf, c: number | ((i: number) => number), q = 2) => svf(b, typeof c === 'number' ? () => c : c, q, 'bp');
const hp = (b: Buf, c: number | ((i: number) => number), q = 0.7) => svf(b, typeof c === 'number' ? () => c : c, q, 'hp');

/** Small Schroeder reverb. */
export function reverb(b: Buf, wet = 0.3, size = 1) {
  const out = new Float32Array(b.length);
  const combs = [1557, 1617, 1491, 1422].map((d) => Math.round(d * size * (SR / 44100)));
  for (const d of combs) {
    const line = new Float32Array(d);
    let p = 0, f = 0;
    for (let i = 0; i < b.length; i++) {
      const y = line[p];
      f = y * 0.8 + f * 0.2;
      line[p] = b[i] + f * 0.82;
      out[i] += y * 0.25;
      p = (p + 1) % d;
    }
  }
  for (const d of [225, 556].map((x) => Math.round(x * (SR / 44100)))) {
    const line = new Float32Array(d);
    let p = 0;
    for (let i = 0; i < out.length; i++) {
      const y = line[p];
      const x = out[i];
      line[p] = x + y * 0.5;
      out[i] = y - x * 0.5;
      p = (p + 1) % d;
    }
  }
  for (let i = 0; i < b.length; i++) b[i] = b[i] * (1 - wet) + out[i] * wet;
  return b;
}

const env = (t: number, a: number, d: number) => (t < a ? t / a : Math.exp(-(t - a) / d));

function tone(sec: number, f: (t: number) => number, shape: 'sine' | 'saw' | 'square' | 'tri', amp: (t: number) => number) {
  const b = buf(sec);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    ph += f(t) / SR;
    const x = ph % 1;
    const v = shape === 'sine' ? Math.sin(TAU * x) : shape === 'saw' ? 2 * x - 1 : shape === 'square' ? (x < 0.5 ? 1 : -1) : 1 - 4 * Math.abs(x - 0.5);
    b[i] = v * amp(t);
  }
  return b;
}

function noiseBurst(sec: number, amp: (t: number) => number) {
  const b = buf(sec);
  for (let i = 0; i < b.length; i++) b[i] = noise() * amp(i / SR);
  return b;
}

// ───────────────────────── sound effects ─────────────────────────

export const SFX: Record<string, () => Buf> = {
  gong() {
    const b = buf(5);
    const partials = [1, 1.483, 2.091, 2.56, 3.14, 4.21, 5.43];
    partials.forEach((p, k) => {
      const f0 = 82 * p;
      mix(b, tone(5, (t) => f0 * (1 - 0.012 * Math.min(1, t)), 'sine', (t) => env(t, 0.004, 2.6 / (1 + k * 0.45)) * (0.9 / (1 + k * 0.5)) * (1 + 0.25 * Math.sin(TAU * (0.9 + k * 0.3) * t))));
    });
    mix(b, lp(noiseBurst(0.15, (t) => env(t, 0.001, 0.03)), 1800), 0, 0.6);
    return normalize(reverb(b, 0.35, 1.3));
  },
  knock() {
    const b = buf(1.2);
    [0, 0.28, 0.56].forEach((at) => {
      mix(b, tone(0.25, (t) => 95 - 40 * t, 'sine', (t) => env(t, 0.002, 0.07)), at, 1);
      mix(b, lp(noiseBurst(0.08, (t) => env(t, 0.001, 0.015)), 900), at, 0.8);
    });
    return normalize(reverb(b, 0.15));
  },
  snore() {
    const b = buf(1.6);
    const inh = bp(noiseBurst(0.9, (t) => Math.sin((Math.PI * t) / 0.9) * 0.8), 420, 3);
    mix(b, inh, 0);
    mix(b, tone(0.9, (t) => 70 + 10 * Math.sin(TAU * 30 * t), 'saw', (t) => Math.sin((Math.PI * t) / 0.9) * 0.3), 0);
    mix(b, tone(0.6, (t) => 900 - 300 * t, 'sine', (t) => Math.sin((Math.PI * t) / 0.6) * 0.15), 0.95);
    return normalize(lp(b, 2500));
  },
  scratch() {
    const b = noiseBurst(0.55, (t) => (t < 0.5 ? 1 : 0) * (0.6 + 0.4 * Math.sin(TAU * 18 * t)));
    bp(b, (i) => 600 + 2800 * Math.abs(Math.sin((i / SR) * 9)), 6);
    return normalize(fadeEdges(b));
  },
  flush() {
    const b = noiseBurst(2.6, (t) => env(t, 0.15, 0.9));
    lp(b, (i) => 3000 * Math.exp(-(i / SR) * 0.9) + 300);
    for (let k = 0; k < 18; k++) mix(b, tone(0.06, (t) => 300 + rnd() * 500 + 2000 * t, 'sine', (t) => env(t, 0.005, 0.02)), 0.4 + rnd() * 1.8, 0.2);
    return normalize(b);
  },
  squeak() {
    const b = tone(0.45, (t) => 1700 + 900 * t + 120 * Math.sin(TAU * 22 * t), 'tri', (t) => Math.sin((Math.PI * t) / 0.45));
    return normalize(b, 0.6);
  },
  siren() {
    const b = tone(2.4, (t) => 750 + 450 * Math.sin(TAU * 1.4 * t), 'square', () => 0.5);
    return normalize(fadeEdges(lp(b, 2600), 0.05, 0.2));
  },
  alarm() {
    const b = buf(1.8);
    for (let k = 0; k < 6; k++) mix(b, tone(0.14, () => (k % 2 ? 660 : 880), 'square', () => 0.5), k * 0.28);
    return normalize(lp(b, 3500), 0.7);
  },
  register() {
    const b = buf(1.1);
    mix(b, hp(noiseBurst(0.12, (t) => env(t, 0.002, 0.04)), 2000), 0, 0.6);
    mix(b, lp(noiseBurst(0.1, (t) => env(t, 0.002, 0.03)), 600), 0.12, 0.7);
    [2637, 3520, 5274].forEach((f, k) => mix(b, tone(0.9, () => f, 'sine', (t) => env(t, 0.002, 0.35) / (k + 1)), 0.22, 0.7));
    return normalize(reverb(b, 0.2));
  },
  registerScream() {
    const b = buf(1.6);
    mix(b, SFX.register(), 0, 0.7);
    const s = tone(1.3, (t) => 900 - 350 * t + 40 * Math.sin(TAU * 7 * t), 'saw', (t) => Math.min(1, t * 8) * Math.min(1, (1.3 - t) * 4));
    bp(s, 1200, 1.2);
    for (let i = 0; i < s.length; i++) s[i] = Math.tanh(s[i] * 4);
    mix(b, s, 0.3, 0.6);
    return normalize(b);
  },
  steps() {
    const b = buf(1.2);
    for (let k = 0; k < 6; k++) {
      mix(b, lp(noiseBurst(0.06, (t) => env(t, 0.002, 0.015)), 1200 + (k % 2) * 400), k * 0.19, 0.9);
      mix(b, tone(0.07, () => (k % 2 ? 180 : 150), 'sine', (t) => env(t, 0.001, 0.02)), k * 0.19, 0.5);
    }
    return normalize(b, 0.7);
  },
  crickets() {
    const b = buf(2.2);
    for (let c = 0; c < 4; c++) {
      const at = 0.15 + c * 0.5;
      mix(b, tone(0.22, () => 4400, 'sine', (t) => (Math.sin(TAU * 45 * t) > 0 ? 1 : 0) * Math.sin((Math.PI * t) / 0.22)), at, 0.4);
    }
    return b;
  },
  slam() {
    const b = buf(0.9);
    mix(b, tone(0.5, (t) => 70 - 30 * t, 'sine', (t) => env(t, 0.002, 0.12)), 0, 1);
    mix(b, lp(noiseBurst(0.3, (t) => env(t, 0.001, 0.06)), 1500), 0, 0.9);
    mix(b, bp(noiseBurst(0.4, (t) => env(t, 0.01, 0.08) * (0.5 + 0.5 * Math.sin(TAU * 40 * t))), 2500, 4), 0.05, 0.3);
    return normalize(reverb(b, 0.2));
  },
  pop() {
    const b = buf(0.35);
    mix(b, tone(0.12, (t) => 900 - 5000 * t, 'sine', (t) => env(t, 0.001, 0.03)), 0);
    mix(b, hp(noiseBurst(0.2, (t) => env(t, 0.001, 0.05)), 3000), 0.01, 0.3);
    return normalize(b, 0.7);
  },
  whoosh() {
    const b = noiseBurst(0.8, (t) => Math.sin((Math.PI * t) / 0.8) ** 2);
    bp(b, (i) => 300 + 2500 * Math.sin((Math.PI * i) / SR / 0.8), 1.5);
    return normalize(b, 0.7);
  },
  splash() {
    const b = buf(1.6);
    mix(b, lp(noiseBurst(1.4, (t) => env(t, 0.005, 0.35)), (i) => 5000 * Math.exp(-(i / SR) * 2) + 400), 0);
    mix(b, tone(0.4, (t) => 120 - 60 * t, 'sine', (t) => env(t, 0.003, 0.1)), 0, 0.8);
    for (let k = 0; k < 14; k++) mix(b, tone(0.05, (t) => 900 + rnd() * 1500 + 6000 * t, 'sine', (t) => env(t, 0.002, 0.015)), 0.3 + rnd() * 1, 0.25);
    return normalize(reverb(b, 0.25));
  },
  thunder() {
    const b = buf(3.2);
    mix(b, hp(noiseBurst(0.25, (t) => env(t, 0.002, 0.05)), 1500), 0, 0.6);
    const r = noiseBurst(3.1, (t) => env(t, 0.05, 1.1) * (0.6 + 0.4 * Math.sin(TAU * 3.3 * t) * Math.sin(TAU * 1.1 * t)));
    mix(b, lp(r, 260, 0.9), 0.05, 3);
    return normalize(reverb(b, 0.3, 1.4));
  },
  ding() {
    const b = buf(0.9);
    mix(b, tone(0.6, () => 1318, 'sine', (t) => env(t, 0.003, 0.18)), 0);
    mix(b, tone(0.7, () => 1975, 'sine', (t) => env(t, 0.003, 0.25)), 0.11);
    return normalize(b, 0.7);
  },
  boing() {
    const b = tone(0.6, (t) => 180 + 500 * t + 60 * Math.sin(TAU * 14 * t) * (1 - t), 'sine', (t) => env(t, 0.005, 0.25));
    return normalize(b, 0.7);
  },
  sting() {
    const b = buf(1.8);
    [48, 55, 60, 63, 67, 72].forEach((m) => {
      const s = tone(1.6, () => mtof(m) * (1 + (rnd() - 0.5) * 0.004), 'saw', (t) => env(t, 0.01, 0.5));
      mix(b, lp(s, (i) => 400 + 4000 * Math.exp(-(i / SR) * 4)), 0, 0.3);
    });
    mix(b, tone(1.2, (t) => 65 - 10 * t, 'sine', (t) => env(t, 0.002, 0.4)), 0, 0.9);
    return normalize(reverb(b, 0.35, 1.2));
  },
  choir() {
    return normalize(reverb(choirChord(2.6, [57, 64, 69, 73, 76], 0.5), 0.45, 1.5));
  },
  click() {
    const b = buf(0.12);
    mix(b, hp(noiseBurst(0.03, (t) => env(t, 0.0005, 0.006)), 2000), 0);
    mix(b, tone(0.04, () => 2200, 'square', (t) => env(t, 0.0005, 0.008)), 0.03, 0.3);
    return normalize(b, 0.6);
  },
  smash() {
    const b = buf(0.8);
    mix(b, tone(0.4, (t) => 60 - 20 * t, 'sine', (t) => env(t, 0.001, 0.15)), 0, 1);
    mix(b, noiseBurst(0.6, (t) => env(t, 0.001, 0.12)), 0, 0.8);
    return normalize(b);
  },
  tick() {
    const b = buf(0.15);
    mix(b, bp(noiseBurst(0.04, (t) => env(t, 0.0005, 0.008)), 3200, 5), 0, 1);
    mix(b, tone(0.05, () => 1100, 'sine', (t) => env(t, 0.0005, 0.01)), 0, 0.5);
    return normalize(b, 0.6);
  },
  doorbell() {
    const b = buf(1.2);
    mix(b, tone(0.9, () => 784, 'sine', (t) => env(t, 0.004, 0.35)), 0);
    mix(b, tone(0.9, () => 622, 'sine', (t) => env(t, 0.004, 0.45)), 0.35);
    return normalize(reverb(b, 0.2), 0.7);
  },
  bonk() {
    const b = tone(0.35, (t) => 320 - 400 * t, 'sine', (t) => env(t, 0.001, 0.08));
    mix(b, tone(0.2, (t) => 960 - 900 * t, 'sine', (t) => env(t, 0.001, 0.03)), 0, 0.3);
    return normalize(b, 0.7);
  },
  heli() {
    const b = buf(3.2);
    const blade = noiseBurst(3.2, (t) => (0.5 + 0.5 * Math.cos(TAU * 11 * t)) ** 4 * Math.min(1, t * 2, (3.2 - t) * 1.5));
    mix(b, lp(blade, 500), 0, 1.4);
    mix(b, tone(3.2, () => 55, 'saw', (t) => 0.2 * Math.min(1, t * 2, (3.2 - t) * 1.5)), 0, 0.5);
    return normalize(lp(b, 900));
  },
  sparkle() {
    const b = buf(1);
    for (let k = 0; k < 12; k++) mix(b, tone(0.3, () => 2000 + rnd() * 4000, 'sine', (t) => env(t, 0.002, 0.08)), k * 0.05 + rnd() * 0.05, 0.3);
    return normalize(reverb(b, 0.4), 0.5);
  },
  spray() {
    const b = hp(noiseBurst(0.6, (t) => Math.min(1, t * 30) * Math.min(1, (0.6 - t) * 6)), 4000);
    return normalize(b, 0.5);
  },
};

function choirChord(sec: number, notes: number[], vib = 0.5) {
  const b = buf(sec);
  for (const m of notes) {
    for (const det of [-0.004, 0.004]) {
      const s = tone(sec, (t) => mtof(m) * (1 + det) * (1 + 0.006 * Math.sin(TAU * (5 + rnd()) * t) * vib), 'saw', (t) => Math.min(1, t / 0.35) * Math.min(1, (sec - t) / 0.4));
      const v = new Float32Array(s.length);
      for (const [f, g] of [[800, 1], [1150, 0.5], [2900, 0.25]] as const) {
        const c = s.slice();
        bp(c, f, 6);
        for (let i = 0; i < v.length; i++) v[i] += c[i] * g;
      }
      mix(b, v, 0, 0.2);
    }
  }
  return b;
}

// ───────────────────────── ambience beds (loopable) ─────────────────────────

export const AMBIENCE: Record<string, () => Buf> = {
  waves() {
    const sec = 12;
    const b = noiseBurst(sec, (t) => 0.3 + 0.7 * Math.sin((Math.PI * t) / 6) ** 4 + 0.2 * Math.sin((TAU * t) / 4) ** 2);
    lp(b, (i) => 500 + 1500 * Math.sin((Math.PI * i) / SR / 6) ** 4);
    return loopify(normalize(b, 0.6));
  },
  rain() {
    const sec = 10;
    const b = hp(noiseBurst(sec, () => 0.5), 1200);
    lp(b, 7000);
    for (let k = 0; k < 400; k++) mix(b, tone(0.02, () => 2000 + rnd() * 3000, 'sine', (t) => env(t, 0.001, 0.005)), rnd() * sec, 0.15);
    return loopify(normalize(b, 0.6));
  },
  engine() {
    const sec = 8;
    const b = tone(sec, (t) => 48 + 2 * Math.sin(TAU * 0.25 * t), 'saw', () => 0.5);
    mix(b, lp(noiseBurst(sec, () => 0.4), 300), 0);
    return loopify(normalize(lp(b, 400), 0.6));
  },
  clubRoom() {
    const sec = 8;
    const b = bp(noiseBurst(sec, (t) => 0.6 + 0.4 * Math.sin(TAU * 0.7 * t) * Math.sin(TAU * 1.3 * t)), 700, 0.8);
    return loopify(normalize(b, 0.5));
  },
  night() {
    const sec = 8;
    const b = buf(sec);
    mix(b, tone(sec, () => 60, 'sine', () => 0.15), 0);
    for (let k = 0; k < 10; k++) mix(b, tone(0.15, () => 4600, 'sine', (t) => (Math.sin(TAU * 40 * t) > 0 ? 0.25 : 0)), k * 0.8 + rnd() * 0.3);
    return loopify(b);
  },
  pool() {
    const sec = 10;
    const b = lp(noiseBurst(sec, () => 0.2), 900);
    for (let k = 0; k < 30; k++) mix(b, tone(0.08, () => 400 + rnd() * 600, 'sine', (t) => env(t, 0.005, 0.03)), rnd() * sec, 0.2);
    return loopify(normalize(b, 0.5));
  },
};

/** Crossfade the tail into the head so the buffer loops seamlessly. */
function loopify(b: Buf, xf = 0.5) {
  const n = Math.floor(xf * SR);
  const out = b.slice(0, b.length - n);
  for (let i = 0; i < n; i++) {
    const g = i / n;
    out[i] = out[i] * g + b[b.length - n + i] * (1 - g);
  }
  return out;
}

// ───────────────────────── music ─────────────────────────

type Inst = 'kick' | 'snare' | 'hat' | 'bass' | 'pluck' | 'epiano' | 'lead' | 'brass' | 'pad' | 'bell' | 'timp' | 'strings' | 'clap';

interface Note {
  t: number; // beats
  d: number; // beats
  m: number; // midi
  i: Inst;
  v?: number;
}

function renderInst(n: Note, spb: number): Buf {
  const dur = n.d * spb;
  const f = mtof(n.m);
  const v = n.v ?? 1;
  switch (n.i) {
    case 'kick':
      return tone(0.4, (t) => 50 + 110 * Math.exp(-t * 30), 'sine', (t) => env(t, 0.001, 0.12) * v);
    case 'snare': {
      const b = hp(noiseBurst(0.25, (t) => env(t, 0.001, 0.06) * v), 1200);
      return mix(b, tone(0.15, () => 190, 'tri', (t) => env(t, 0.001, 0.04) * v), 0, 0.5);
    }
    case 'clap': {
      const b = buf(0.3);
      for (let k = 0; k < 3; k++) mix(b, bp(noiseBurst(0.15, (t) => env(t, 0.001, 0.03) * v), 1500, 1.5), k * 0.012);
      return b;
    }
    case 'hat':
      return hp(noiseBurst(0.08, (t) => env(t, 0.0005, 0.02) * v * 0.5), 7000);
    case 'bass': {
      const b = tone(dur + 0.05, () => f, 'saw', (t) => env(t, 0.005, Math.max(0.12, dur * 0.8)) * v);
      return lp(b, (i) => 250 + 900 * Math.exp(-(i / SR) * 12), 1.2);
    }
    case 'pluck': {
      // Karplus–Strong string
      const sec = Math.max(dur, 0.5) + 0.4;
      const b = buf(sec);
      const period = Math.round(SR / f);
      const line = new Float32Array(period).map(() => noise());
      let p = 0;
      for (let i = 0; i < b.length; i++) {
        const nx = (p + 1) % period;
        const y = line[p];
        line[p] = 0.996 * 0.5 * (line[p] + line[nx]);
        b[i] = y * v * 0.6 * (i / SR > dur ? Math.exp(-(i / SR - dur) * 12) : 1);
        p = nx;
      }
      return b;
    }
    case 'epiano': {
      const sec = dur + 0.6;
      const b = buf(sec);
      let ph = 0, mph = 0;
      for (let i = 0; i < b.length; i++) {
        const t = i / SR;
        mph += f / SR;
        ph += f / SR;
        const idx = 1.6 * Math.exp(-t * 5);
        b[i] = Math.sin(TAU * ph + idx * Math.sin(TAU * mph)) * env(t, 0.003, 0.7) * v * 0.5 * (t > dur ? Math.exp(-(t - dur) * 6) : 1);
      }
      return b;
    }
    case 'lead': {
      const b = tone(dur + 0.1, (t) => f * (1 + 0.004 * Math.sin(TAU * 5.5 * t) * Math.min(1, t * 3)), 'square', (t) => Math.min(1, t / 0.01) * (t > dur ? Math.exp(-(t - dur) * 30) : 1) * v * 0.35);
      return lp(b, 2400);
    }
    case 'brass': {
      const b = buf(dur + 0.2);
      for (const det of [-0.003, 0, 0.003]) mix(b, tone(dur + 0.2, () => f * (1 + det), 'saw', (t) => Math.min(1, t / 0.06) * (t > dur ? Math.exp(-(t - dur) * 15) : 1) * v * 0.3), 0);
      return lp(b, (i) => 600 + 2200 * Math.min(1, (i / SR) * 8), 1);
    }
    case 'strings': {
      const b = buf(dur + 0.15);
      for (const det of [-0.005, 0.005]) mix(b, tone(dur + 0.15, () => f * (1 + det), 'saw', (t) => Math.min(1, t / 0.02) * Math.exp(-t * 3) * v * 0.3), 0);
      return lp(b, 3000);
    }
    case 'pad': {
      const b = buf(dur + 0.6);
      for (const det of [-0.006, 0, 0.006]) mix(b, tone(dur + 0.6, () => f * (1 + det), 'saw', (t) => Math.min(1, t / 0.5) * (t > dur ? Math.exp(-(t - dur) * 4) : 1) * v * 0.18), 0);
      return lp(b, 1400);
    }
    case 'bell':
      return mix(tone(dur + 1, () => f, 'sine', (t) => env(t, 0.002, 0.8) * v * 0.4), tone(dur + 1, () => f * 2.76, 'sine', (t) => env(t, 0.002, 0.3) * v * 0.15));
    case 'timp':
      return tone(1.2, (t) => f * (1 - 0.05 * t), 'sine', (t) => env(t, 0.003, 0.35) * v);
  }
}

function renderSong(bpm: number, beats: number, notes: Note[], opts: { reverb?: number; master?: number } = {}): Buf[] {
  const spb = 60 / bpm;
  const L = buf(beats * spb), R = buf(beats * spb);
  for (const n of notes) {
    const b = renderInst(n, spb);
    const pan = n.i === 'hat' ? 0.3 : n.i === 'pluck' ? -0.25 : n.i === 'epiano' ? 0.15 : n.i === 'strings' ? -0.2 : 0;
    // wrap the tails around so the loop is seamless
    const at = n.t * spb;
    const o = Math.round(at * SR);
    for (let i = 0; i < b.length; i++) {
      const j = (o + i) % L.length;
      L[j] += b[i] * (1 - pan) * 0.7;
      R[j] += b[i] * (1 + pan) * 0.7;
    }
  }
  if (opts.reverb) {
    reverb(L, opts.reverb, 1.1);
    reverb(R, opts.reverb, 1.17);
  }
  let m = 0;
  for (let i = 0; i < L.length; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i]));
  const g = (opts.master ?? 0.85) / (m || 1);
  for (let i = 0; i < L.length; i++) {
    L[i] = Math.tanh(L[i] * g * 1.1) * 0.9;
    R[i] = Math.tanh(R[i] * g * 1.1) * 0.9;
  }
  return [L, R];
}

/** Helpers to write patterns compactly. */
const seq = (inst: Inst, start: number, step: number, midis: (number | null)[], d = step, v = 1): Note[] =>
  midis.flatMap((m, k) => (m === null ? [] : [{ t: start + k * step, d, m, i: inst, v }]));
const drums = (bars: number, pattern: { k: number[]; s: number[]; h: number[] }, inst: { s?: Inst } = {}): Note[] => {
  const out: Note[] = [];
  for (let bar = 0; bar < bars; bar++) {
    for (const k of pattern.k) out.push({ t: bar * 4 + k, d: 0.25, m: 36, i: 'kick' });
    for (const s of pattern.s) out.push({ t: bar * 4 + s, d: 0.25, m: 38, i: inst.s ?? 'snare', v: 0.8 });
    for (const h of pattern.h) out.push({ t: bar * 4 + h, d: 0.1, m: 42, i: 'hat', v: 0.6 });
  }
  return out;
};
const chord = (inst: Inst, t: number, d: number, ms: number[], v = 0.6): Note[] => ms.map((m) => ({ t, d, m, i: inst, v }));
const eighths = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];

export const MUSIC: Record<string, () => Buf[]> = {
  /** Bouncy sitcom main theme, C major, 124 bpm, 8 bars. */
  theme() {
    const prog = [[48, 60, 64, 67], [45, 57, 60, 64], [41, 57, 60, 65], [43, 55, 59, 62]];
    const notes: Note[] = [...drums(8, { k: [0, 1.5, 2], s: [1, 3], h: eighths })];
    for (let bar = 0; bar < 8; bar++) {
      const c = prog[bar % 4];
      notes.push(...seq('bass', bar * 4, 1, [c[0], c[0] + 12, c[0] + 7, c[0] + 12], 0.6, 0.9));
      notes.push(...chord('epiano', bar * 4 + 0.5, 0.4, c.slice(1), 0.5), ...chord('epiano', bar * 4 + 2.5, 0.4, c.slice(1), 0.45));
    }
    const mel = [72, 74, 76, null, 79, 76, 74, 72, 69, null, 72, 74, 76, 74, 72, null, 77, 76, 74, 72, 74, null, 71, 72, 74, 76, 79, null, 76, 74, 72, null];
    notes.push(...seq('lead', 0, 0.5, mel, 0.4, 0.8), ...seq('lead', 16, 0.5, mel.map((m) => (m ? m + 0 : null)), 0.4, 0.75));
    notes.push({ t: 0, d: 0.5, m: 84, i: 'bell', v: 0.6 }, { t: 16, d: 0.5, m: 84, i: 'bell', v: 0.6 });
    return renderSong(124, 32, notes, { reverb: 0.15 });
  },
  /** Road trip groove with plucked guitar, D major, 128 bpm. */
  drive() {
    const prog = [[50, 62, 66, 69], [47, 59, 62, 66], [43, 55, 59, 62], [45, 57, 61, 64]];
    const notes: Note[] = [...drums(8, { k: [0, 2, 2.5], s: [1, 3], h: eighths })];
    for (let bar = 0; bar < 8; bar++) {
      const c = prog[bar % 4];
      notes.push(...seq('bass', bar * 4, 0.5, [c[0], c[0], c[0] + 12, c[0], c[0] + 7, c[0], c[0] + 12, c[0] + 7], 0.4, 0.8));
      for (const t of [0, 0.75, 1.5, 2, 2.75, 3.5]) notes.push(...c.slice(1).map((m, k) => ({ t: bar * 4 + t + k * 0.02, d: 0.4, m: m + 12, i: 'pluck' as Inst, v: 0.5 })));
    }
    return renderSong(128, 32, notes, { reverb: 0.12 });
  },
  /** Laid back reggae-ish beach loop, G major, 92 bpm. */
  beach() {
    const prog = [[43, 59, 62, 67], [48, 60, 64, 67], [50, 62, 66, 69], [48, 60, 64, 67]];
    const notes: Note[] = [...drums(8, { k: [0, 2.5], s: [2], h: [0.5, 1.5, 2.5, 3.5] }, { s: 'clap' })];
    for (let bar = 0; bar < 8; bar++) {
      const c = prog[bar % 4];
      notes.push(...seq('bass', bar * 4, 1, [c[0], null, c[0] + 7, c[0] + 5], 0.8, 0.85));
      for (const t of [0.5, 1.5, 2.5, 3.5]) notes.push(...chord('pluck', bar * 4 + t, 0.2, c.slice(1).map((m) => m + 12), 0.4));
    }
    const mel = [74, null, 76, 79, null, 76, 74, null, 71, null, 74, 76, null, null, 74, null];
    notes.push(...seq('epiano', 4, 1, mel, 0.8, 0.5), ...seq('epiano', 20, 1, mel, 0.8, 0.45));
    return renderSong(92, 32, notes, { reverb: 0.2 });
  },
  /** Four-on-the-floor club track, A minor, 126 bpm. */
  club() {
    const prog = [[45], [41], [48], [43]];
    const notes: Note[] = [...drums(8, { k: [0, 1, 2, 3], s: [1, 3], h: [0.5, 1.5, 2.5, 3.5] }, { s: 'clap' })];
    for (let bar = 0; bar < 8; bar++) {
      const r = prog[bar % 4][0];
      notes.push(...seq('bass', bar * 4, 0.5, [null, r, null, r, null, r, null, r + 12], 0.35, 1));
      const stab = r === 45 ? [69, 72, 76] : r === 41 ? [69, 72, 77] : r === 48 ? [67, 72, 76] : [67, 71, 74];
      for (const t of [0.5, 1.75, 3]) notes.push(...chord('brass', bar * 4 + t, 0.25, stab, 0.35));
      for (let s = 0; s < 16; s++) notes.push({ t: bar * 4 + s * 0.25, d: 0.05, m: 42, i: 'hat', v: s % 2 ? 0.25 : 0.4 });
    }
    return renderSong(126, 32, notes, { reverb: 0.1, master: 0.9 });
  },
  /** Over-the-top heroic rescue fanfare, Bb major, 104 bpm. */
  heroic() {
    const prog = [[46, 58, 62, 65], [41, 57, 60, 65], [43, 55, 58, 62], [39, 55, 58, 63]];
    const notes: Note[] = [];
    for (let bar = 0; bar < 4; bar++) {
      const c = prog[bar];
      notes.push(...chord('brass', bar * 4, 3.8, c.slice(1).map((m) => m + 12), 0.5), ...chord('strings', bar * 4, 4, [c[0], c[0] + 12], 0.5));
      notes.push({ t: bar * 4, d: 1, m: c[0] - 12 + 24, i: 'timp', v: 1 }, { t: bar * 4 + 2.5, d: 1, m: c[0] + 12, i: 'timp', v: 0.8 });
      for (let s = 0; s < 8; s++) notes.push({ t: bar * 4 + 3 + s * 0.125, d: 0.1, m: 38, i: 'snare', v: 0.3 + s * 0.06 });
    }
    const fan = [70, null, 70, 72, 74, null, 77, null, 77, 76, 74, 72, 74, null, null, null];
    notes.push(...seq('brass', 0, 1, fan, 0.9, 0.7));
    return renderSong(104, 16, notes, { reverb: 0.3 });
  },
  /** Jazzy lounge loop, F major 7ths, 96 bpm. */
  lounge() {
    const prog = [[41, 57, 60, 64, 67], [38, 57, 60, 62, 65], [43, 58, 62, 65, 69], [36, 58, 60, 64, 67]];
    const notes: Note[] = [...drums(8, { k: [0, 2.5], s: [1, 3], h: [0, 0.67, 1, 1.67, 2, 2.67, 3, 3.67] }, { s: 'clap' })];
    for (let bar = 0; bar < 8; bar++) {
      const c = prog[bar % 4];
      notes.push(...seq('bass', bar * 4, 1, [c[0], c[0] + 7, c[0] + 12, c[0] + 10], 0.9, 0.7));
      notes.push(...chord('epiano', bar * 4, 1.4, c.slice(1), 0.42), ...chord('epiano', bar * 4 + 2.67, 1, c.slice(1), 0.35));
    }
    return renderSong(96, 32, notes, { reverb: 0.2 });
  },
  /** Solemn mock-religious choir with drone and bells. */
  ceremony() {
    const sec = 12;
    const L = buf(sec);
    mix(L, choirChord(6, [45, 52, 57, 60, 64], 0.6), 0, 1);
    mix(L, choirChord(6, [41, 53, 57, 60, 65], 0.6), 6, 1);
    mix(L, tone(sec, () => 55, 'saw', () => 0.08), 0);
    [0, 3, 6, 9].forEach((t) => mix(L, renderInst({ t: 0, d: 1, m: 81, i: 'bell', v: 0.6 }, 1), t, 0.6));
    reverb(L, 0.45, 1.5);
    normalize(L, 0.8);
    const R = L.slice();
    return [loopify(L, 0.3), loopify(R, 0.3)];
  },
  /** Warm, slightly nostalgic ending: the theme, half-time with pads. */
  ending() {
    const prog = [[48, 60, 64, 67], [45, 57, 60, 64], [41, 57, 60, 65], [43, 55, 59, 62]];
    const notes: Note[] = [...drums(4, { k: [0, 2], s: [1, 3], h: eighths })];
    for (let bar = 0; bar < 4; bar++) {
      const c = prog[bar];
      notes.push(...chord('pad', bar * 4, 4, c.slice(1), 0.5), { t: bar * 4, d: 3.5, m: c[0], i: 'bass', v: 0.7 });
      notes.push(...seq('epiano', bar * 4, 1, c.slice(1).concat([c[1] + 12]), 0.9, 0.4));
    }
    notes.push(...seq('lead', 0, 1, [72, 74, 76, 79, 76, 74, 72, null, 77, 76, 74, 72, 74, 76, 72, null], 0.9, 0.6));
    return renderSong(100, 16, notes, { reverb: 0.25 });
  },
  /** Panicky chase strings for the rain run, E minor, 150 bpm. */
  tension() {
    const notes: Note[] = [...drums(8, { k: [0, 1.5, 2, 3.5], s: [1, 3], h: eighths })];
    const prog = [52, 52, 48, 50];
    for (let bar = 0; bar < 8; bar++) {
      const r = prog[bar % 4];
      notes.push(...seq('strings', bar * 4, 0.25, Array.from({ length: 16 }, (_, k) => r + 12 + [0, 7, 12, 7][k % 4]), 0.2, 0.5));
      notes.push(...seq('bass', bar * 4, 0.5, [r, r, r, r, r, r, r + 3, r + 2], 0.4, 0.8));
    }
    return renderSong(150, 32, notes, { reverb: 0.1 });
  },
};
