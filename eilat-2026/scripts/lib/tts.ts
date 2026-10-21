// Hebrew speech synthesis built on the MBROLA diphone engine (hb1 male / hb2
// female). Instead of relying on a text front-end (unvocalised Hebrew is
// ambiguous), we drive MBROLA with our own prosody model computed from the
// stress-marked transliteration in the screenplay. This gives us exact control
// over each character's pitch, tempo and emotional delivery, and the exact
// phoneme timing that the animation uses for lip-sync.

import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { run } from './exec.js';
import { readWav, writeWav } from './wav.js';
import type { Mood } from '../../src/script/screenplay.js';

export interface VoiceProfile {
  db: 'hb1' | 'hb2';
  f0: number; // base pitch Hz (as heard)
  speed: number; // >1 faster
  range: number; // pitch excursion multiplier
  formant: number; // >1 brighter/smaller head, <1 deeper/bigger
  fx: string; // extra ffmpeg filter chain
}

export const VOICES: Record<string, VoiceProfile> = {
  nir: { db: 'hb1', f0: 118, speed: 1.08, range: 1.15, formant: 1.0, fx: 'equalizer=f=2500:t=q:w=1:g=2' },
  roee: { db: 'hb1', f0: 138, speed: 1.2, range: 1.45, formant: 1.09, fx: 'equalizer=f=3200:t=q:w=1:g=3' },
  marom: { db: 'hb1', f0: 96, speed: 1.0, range: 1.05, formant: 0.9, fx: 'equalizer=f=180:t=q:w=1:g=4' },
  narr: { db: 'hb1', f0: 84, speed: 0.9, range: 0.75, formant: 0.88, fx: 'equalizer=f=120:t=q:w=1:g=5,aecho=0.8:0.6:60|110:0.25|0.15' },
  guard: { db: 'hb1', f0: 88, speed: 0.95, range: 0.8, formant: 0.86, fx: 'equalizer=f=150:t=q:w=1:g=4' },
  manager: { db: 'hb1', f0: 110, speed: 1.05, range: 0.9, formant: 0.97, fx: 'highpass=f=350,lowpass=f=3200,acrusher=bits=10:mix=0.3' },
  girl: { db: 'hb2', f0: 215, speed: 1.12, range: 1.3, formant: 1.03, fx: 'equalizer=f=3000:t=q:w=1:g=2' },
  girl2: { db: 'hb2', f0: 190, speed: 1.0, range: 1.0, formant: 0.97, fx: '' },
  heroine: { db: 'hb2', f0: 200, speed: 1.02, range: 1.35, formant: 1.0, fx: 'equalizer=f=2800:t=q:w=1:g=2' },
};

/** Overall delivery speed — tuned so the cut lands inside the 3:30–3:55 target. */
const GLOBAL_TEMPO = 1.2;
const MBROLA_SR = 22050;

interface MoodMod {
  f0: number;
  range: number;
  dur: number;
  gainDb: number;
  final?: 'rise' | 'fall' | 'flat';
  vibrato?: number;
}

const MOODS: Record<Mood, MoodMod> = {
  normal: { f0: 1, range: 1, dur: 1, gainDb: 0 },
  shout: { f0: 1.28, range: 1.35, dur: 1.02, gainDb: 3 },
  scream: { f0: 1.6, range: 1.5, dur: 1.08, gainDb: 5 },
  whisper: { f0: 0.94, range: 0.5, dur: 1.05, gainDb: -6 },
  solemn: { f0: 0.86, range: 0.45, dur: 1.3, gainDb: -1, final: 'fall' },
  flirt: { f0: 1.06, range: 1.45, dur: 1.08, gainDb: 0 },
  sing: { f0: 1.15, range: 0.2, dur: 1.5, gainDb: 1, vibrato: 0.06 },
  sarcastic: { f0: 1.0, range: 1.6, dur: 1.12, gainDb: 0 },
  panic: { f0: 1.4, range: 1.3, dur: 0.88, gainDb: 3 },
};

type PhClass = 'V' | 'stop' | 'fric' | 'son' | 'aff' | 'glot';
interface Ph {
  p: string;
  cls: PhClass;
  stress?: boolean;
  long?: boolean;
}

const VOWELS = 'aeiou';
const CLS: Record<string, PhClass> = {
  b: 'stop', p: 'stop', t: 'stop', d: 'stop', k: 'stop', g: 'stop',
  s: 'fric', S: 'fric', z: 'fric', f: 'fric', v: 'fric', x: 'fric', h: 'fric',
  m: 'son', n: 'son', l: 'son', r: 'son', j: 'son', w: 'son',
  Ts: 'aff', TS: 'aff', dZ: 'aff', '^': 'glot',
};

/** Split a transliterated word into MBROLA phonemes. */
function wordToPh(word: string, db: 'hb1' | 'hb2'): Ph[] {
  const out: Ph[] = [];
  let stressNext = false;
  const w = word.replace(/-/g, '');
  for (let i = 0; i < w.length; i++) {
    const c = w[i];
    const two = w.slice(i, i + 2);
    if (c === "'") {
      stressNext = true;
      continue;
    }
    if (VOWELS.includes(c)) {
      const prev = out[out.length - 1];
      if (prev && prev.cls === 'V' && prev.p === c) {
        prev.long = true; // held vowel ("aaa")
        continue;
      }
      if (prev && prev.cls === 'V') out.push({ p: '^', cls: 'glot' }); // hiatus: no diphthong diphones in hb1
      out.push({ p: c, cls: 'V', stress: stressNext });
      stressNext = false;
      continue;
    }
    let p: string;
    if (two === 'sh') { p = 'S'; i++; }
    else if (two === 'ts' || two === 'tz') { p = 'Ts'; i++; }
    else if (two === 'ch') { p = 'TS'; i++; }
    else if (two === 'kh') { p = 'x'; i++; }
    else if (c === 'y') p = 'j';
    else if (c === 'c') p = 'k';
    else p = c;
    if (!CLS[p]) continue;
    // collapse doubled consonants
    const prev = out[out.length - 1];
    if (prev && prev.p === p) continue;
    out.push({ p, cls: CLS[p] });
  }
  if (db === 'hb2') {
    // hb2 has no diphones from silence into vowels, and records diphthongs as units
    if (out[0]?.cls === 'V') out.unshift({ p: '^', cls: 'glot' });
    for (let i = 0; i < out.length - 1; i++) {
      const a = out[i], b = out[i + 1], c = out[i + 2];
      if (a.cls === 'V' && 'aeou'.includes(a.p) && b.p === 'j' && (!c || c.cls !== 'V')) {
        a.p = a.p + 'i';
        out.splice(i + 1, 1);
      }
    }
  }
  // words without explicit stress: stress the last vowel (Hebrew default)
  if (!out.some((x) => x.stress)) {
    for (let i = out.length - 1; i >= 0; i--) if (out[i].cls === 'V') { out[i].stress = true; break; }
  }
  return out;
}

/** hb2 (Israeli-accent female db) uses SAMPA symbols for a few phonemes. */
const HB2_MAP: Record<string, string> = { x: 'X', r: 'R', '^': '?', w: 'v', TS: 'Ts', dZ: 'd' };

export interface PhonemeTiming {
  p: string;
  start: number; // seconds
  dur: number;
}

/**
 * Build an MBROLA .pho script from a transliteration.
 * Returns the script and phoneme timings (in heard-time seconds).
 */
export function buildPho(tr: string, voice: VoiceProfile, mood: Mood = 'normal') {
  const m = MOODS[mood];
  const k = voice.formant; // formant shift via resampling: pre-compensate time and pitch
  const tempo = (voice.speed * GLOBAL_TEMPO) / m.dur;
  const phrases = tr
    .toLowerCase()
    .split(/(?<=[,.!?…])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  const lines: string[] = ['_ 60'];
  const timings: PhonemeTiming[] = [];
  let t = 0.06;
  const map = voice.db === 'hb2' ? HB2_MAP : {};
  const push = (p: string, durMs: number, pitch?: [number, number][]) => {
    const sym = map[p] ?? p;
    const heardMs = durMs / tempo;
    const synthMs = Math.max(10, Math.round(heardMs * k));
    const pts = pitch ? ' ' + pitch.map(([pos, hz]) => `${pos} ${Math.round((hz / k) * 10) / 10}`).join(' ') : '';
    lines.push(`${sym} ${synthMs}${pts}`);
    timings.push({ p, start: t, dur: heardMs / 1000 });
    t += heardMs / 1000;
  };

  phrases.forEach((phrase, pi) => {
    const punct = phrase.match(/[,.!?…]+$/)?.[0] ?? '';
    const words = phrase.replace(/[,.!?…]+$/, '').split(/\s+/).filter(Boolean);
    const phs = words.map((w) => wordToPh(w, voice.db));
    const vowelCount = phs.flat().filter((p) => p.cls === 'V').length || 1;
    const excl = punct.includes('!');
    const quest = punct.includes('?');
    let base = voice.f0 * m.f0 * (excl ? 1.08 : 1);
    let vi = 0;
    phs.forEach((wph, wi) => {
      const lastWord = wi === phs.length - 1;
      wph.forEach((ph, idx) => {
        if (ph.cls !== 'V') {
          const d = { stop: 50, fric: 66, son: 46, aff: 76, glot: 26, V: 0 }[ph.cls];
          push(ph.p, d);
          return;
        }
        const pos = vi / Math.max(1, vowelCount - 1);
        vi++;
        const isLastVowel = lastWord && !wph.slice(idx + 1).some((x) => x.cls === 'V');
        let dur = ph.stress ? 92 : 54;
        if (isLastVowel) dur *= 1.4;
        if (ph.long) dur *= 3.2;
        // declination + accent
        const decl = 1.1 - 0.22 * pos;
        const acc = ph.stress ? 1 + 0.22 * voice.range * m.range : 1;
        let f = base * decl * acc;
        let f1 = f;
        let f2 = f * (ph.stress ? 0.96 : 0.99);
        if (isLastVowel) {
          const fin = m.final ?? (quest ? 'rise' : excl ? 'fall' : 'fall');
          if (fin === 'rise') { f1 = f * 1.05; f2 = f * (1.25 + 0.15 * voice.range); }
          else if (fin === 'fall') { f2 = f * (excl ? 0.72 : 0.8); }
        }
        if (m.vibrato) {
          // sung: hold a melody note with vibrato
          const notes = [1, 1.12, 1.26, 1.12, 1.5, 1.33];
          const note = base * notes[vi % notes.length];
          const pts: [number, number][] = [];
          for (let s = 0; s <= 10; s++) pts.push([s * 10, note * (1 + m.vibrato * Math.sin(s * 1.9))]);
          push(ph.p, dur * 1.2, pts);
          return;
        }
        push(ph.p, dur, [[0, f], [45, f1 * (ph.stress ? 1.03 : 1)], [100, f2]]);
      });
      if (!lastWord) {
        // tiny word-boundary gap only before stops for clarity
        const next = phs[wi + 1][0];
        if (next && next.cls === 'stop') push('_', 18);
      }
    });
    const pause = punct.includes('…') ? 380 : excl || quest ? 200 : punct.includes('.') ? 240 : punct.includes(',') ? 110 : 0;
    if (pause && pi < phrases.length - 1) push('_', pause);
  });
  lines.push('_ 80');
  t += 0.08 / tempo;
  return { pho: lines.join('\n') + '\n', timings, duration: t };
}

/** Synthesize a line to a 48 kHz mono WAV. Returns phoneme timings. */
export function synthLine(opts: {
  tr: string;
  voiceId: string;
  mood?: Mood;
  outWav: string;
  tmpDir: string;
}) {
  const voice = VOICES[opts.voiceId];
  const mood = MOODS[opts.mood ?? 'normal'];
  mkdirSync(opts.tmpDir, { recursive: true });
  const { pho, timings, duration } = buildPho(opts.tr, voice, opts.mood);
  const phoFile = join(opts.tmpDir, 'line.pho');
  const raw = join(opts.tmpDir, 'raw.wav');
  writeFileSync(phoFile, pho);
  const warn = run('mbrola', ['-e', `/usr/share/mbrola/${voice.db}/${voice.db}`, phoFile, raw], { label: 'mbrola', stderr: true });
  // MBROLA hb dbs are 22.05 kHz; resampling by `formant` shifts the formants while the
  // pre-compensated .pho keeps pitch and timing as designed.
  const sr = Math.round(MBROLA_SR * voice.formant);
  const chain = [
    `asetrate=${sr}`,
    'aresample=48000',
    'highpass=f=70',
    voice.fx,
    opts.mood === 'whisper' ? 'highpass=f=300,volume=0.8' : '',
    'acompressor=threshold=0.1:ratio=3:attack=5:release=80',
    'alimiter=limit=0.95',
  ]
    .filter(Boolean)
    .join(',');
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', chain, '-ac', '1', '-ar', '48000', opts.outWav], { label: 'ffmpeg-voice' });
  rmSync(raw, { force: true });
  // loudness: normalise each clip's peak, offset by the mood (shouts louder, whispers softer)
  const w = readWav(opts.outWav);
  let peak = 0;
  for (const v of w.data) peak = Math.max(peak, Math.abs(v));
  const target = Math.min(0.97, 10 ** ((-4 + mood.gainDb * 0.7) / 20));
  if (peak > 0) for (let i = 0; i < w.data.length; i++) w.data[i] *= target / peak;
  writeWav(opts.outWav, [w.data], w.sr);
  return { timings, duration, warnings: warn };
}
