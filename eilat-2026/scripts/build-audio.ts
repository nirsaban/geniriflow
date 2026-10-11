// Builds every audio asset for the film:
//   assets/voices/<lineId>.wav   – Hebrew dialogue & narration (MBROLA, own prosody model)
//   assets/sfx/<name>.wav        – procedural sound effects
//   assets/sfx/amb-<name>.wav    – loopable ambience beds
//   assets/music/<name>.wav      – original procedural music cues
// and writes src/generated/audio.json (durations + phoneme visemes for lip-sync).
// Assets are cached by a hash of their inputs.

import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENES, type LineItem, type Mood } from '../src/script/screenplay.js';
import { synthLine, VOICES, buildPho, type PhonemeTiming } from './lib/tts.js';
import { SFX, AMBIENCE, MUSIC, reseed } from './lib/synth.js';
import { writeWav, readWav } from './lib/wav.js';
import { Cache, hash } from './lib/cache.js';
import { run } from './lib/exec.js';
import { record } from './lib/cost.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const A = (...p: string[]) => join(ROOT, 'assets', ...p);
const TMP = join(ROOT, '.cache', 'tts');
const SYNTH_VERSION = 'v9'; // bump to force regeneration of procedural audio
for (const d of ['voices', 'sfx', 'music']) mkdirSync(A(d), { recursive: true });
mkdirSync(join(ROOT, 'src', 'generated'), { recursive: true });

const cache = new Cache<{ duration: number; visemes?: [number, string][] }>(join(ROOT, '.cache', 'audio-index.json'));
const durationOf = (file: string) => {
  const w = readWav(file);
  return w.data.length / w.sr;
};

const VISEME: Record<string, string> = { a: 'A', e: 'E', i: 'E', o: 'O', u: 'O', m: 'M', b: 'M', p: 'M', f: 'F', v: 'F', _: 'X', '^': 'X' };
const toVisemes = (t: PhonemeTiming[]): [number, string][] => {
  const out: [number, string][] = [];
  for (const ph of t) {
    const v = VISEME[ph.p] ?? 'C';
    if (out.length && out[out.length - 1][1] === v) continue;
    out.push([Math.round(ph.start * 1000) / 1000, v]);
  }
  return out;
};

const manifest: {
  voices: Record<string, { file: string; duration: number; who: string; visemes: [number, string][] }>;
  sfx: Record<string, { file: string; duration: number }>;
  ambience: Record<string, { file: string; duration: number }>;
  music: Record<string, { file: string; duration: number }>;
} = { voices: {}, sfx: {}, ambience: {}, music: {} };

// ── dialogue ──
const lines = SCENES.flatMap((s) => s.items.filter((i): i is LineItem => i.kind === 'line'));
let made = 0;
for (const [n, line] of lines.entries()) {
  const out = A('voices', `${line.id}.wav`);
  const key = hash({ v: SYNTH_VERSION, tr: line.tr, who: line.who, mood: line.mood, prof: VOICES[line.who === 'both' ? 'nir' : line.who], pho: buildPho.toString().length });
  let entry = cache.get(`voice:${line.id}`);
  if (!entry || (entry as any).key !== key || !existsSync(out)) {
    process.stdout.write(`\r  voice ${n + 1}/${lines.length} ${line.id}        `);
    if (line.who === 'both') {
      const a = join(TMP, 'both-a.wav'), b = join(TMP, 'both-b.wav');
      const r = synthLine({ tr: line.tr, voiceId: 'nir', mood: line.mood, outWav: a, tmpDir: TMP });
      synthLine({ tr: line.tr, voiceId: 'marom', mood: line.mood, outWav: b, tmpDir: TMP });
      run('ffmpeg', ['-y', '-loglevel', 'error', '-i', a, '-i', b, '-filter_complex', 'amix=inputs=2:normalize=0,alimiter=limit=0.95', out]);
      entry = { duration: durationOf(out), visemes: toVisemes(r.timings) };
    } else {
      const r = synthLine({ tr: line.tr, voiceId: line.who, mood: line.mood as Mood, outWav: out, tmpDir: TMP });
      entry = { duration: durationOf(out), visemes: toVisemes(r.timings) };
    }
    (entry as any).key = key;
    cache.set(`voice:${line.id}`, entry);
    record('local:mbrola-hb', 'tts-line', 1, 0);
    made++;
  }
  manifest.voices[line.id] = { file: `voices/${line.id}.wav`, duration: entry.duration, who: line.who, visemes: entry.visemes! };
}
console.log(`\n  voices: ${lines.length} lines (${made} regenerated)`);

// ── voice-based sfx (giggles, triple scream) ──
const special: Record<string, () => void> = {
  giggle: () => {
    const a = join(TMP, 'g1.wav'), b = join(TMP, 'g2.wav');
    synthLine({ tr: "xi xi x'i, xa xa x'a", voiceId: 'girl', mood: 'flirt', outWav: a, tmpDir: TMP });
    synthLine({ tr: "xi xi xi x'iii", voiceId: 'girl2', mood: 'shout', outWav: b, tmpDir: TMP });
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', a, '-i', b, '-filter_complex', '[1]adelay=180[d];[0][d]amix=inputs=2:normalize=0,volume=0.8', A('sfx', 'giggle.wav')]);
  },
  scream3: () => {
    const f = ['nir', 'marom', 'roee'].map((v) => {
      const o = join(TMP, `sc-${v}.wav`);
      synthLine({ tr: "aaaaaaaa'aaa!", voiceId: v, mood: 'scream', outWav: o, tmpDir: TMP });
      return o;
    });
    run('ffmpeg', ['-y', '-loglevel', 'error', ...f.flatMap((x) => ['-i', x]), '-filter_complex', 'amix=inputs=3:normalize=0,alimiter=limit=0.95', A('sfx', 'scream3.wav')]);
  },
};

const gen = (kind: 'sfx' | 'ambience' | 'music', name: string, file: string, make: () => void) => {
  const key = `${kind}:${name}:${SYNTH_VERSION}`;
  if (!cache.get(key) || !existsSync(file)) {
    reseed(hash(name).split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
    make();
    cache.set(key, { duration: durationOf(file) });
    record('local:procedural-synth', kind, 1, 0);
  }
  return { duration: durationOf(file) };
};

for (const [name, fn] of Object.entries(SFX)) {
  const file = A('sfx', `${name}.wav`);
  manifest.sfx[name] = { file: `sfx/${name}.wav`, ...gen('sfx', name, file, () => writeWav(file, [fn()])) };
}
for (const [name, fn] of Object.entries(special)) {
  const file = A('sfx', `${name}.wav`);
  manifest.sfx[name] = { file: `sfx/${name}.wav`, ...gen('sfx', name, file, fn) };
}
for (const [name, fn] of Object.entries(AMBIENCE)) {
  const file = A('sfx', `amb-${name}.wav`);
  manifest.ambience[name] = { file: `sfx/amb-${name}.wav`, ...gen('ambience', name, file, () => writeWav(file, [fn()])) };
}
for (const [name, fn] of Object.entries(MUSIC)) {
  const file = A('music', `${name}.wav`);
  manifest.music[name] = { file: `music/${name}.wav`, ...gen('music', name, file, () => writeWav(file, fn())) };
  process.stdout.write(`\r  music ${name}        `);
}
console.log(`\n  sfx: ${Object.keys(manifest.sfx).length}, ambience: ${Object.keys(manifest.ambience).length}, music: ${Object.keys(manifest.music).length}`);

cache.save();
rmSync(TMP, { recursive: true, force: true });
writeFileSync(join(ROOT, 'src', 'generated', 'audio.json'), JSON.stringify(manifest));
console.log('  wrote src/generated/audio.json');
