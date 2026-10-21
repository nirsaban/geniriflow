// Voices + extra SFX for the short "בידה NASA" → assets/shorts/bidet, src/generated/short-bidet.json
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { synthLine } from './lib/tts.js';
import { SFX, reseed } from './lib/synth.js';
import { writeWav, readWav } from './lib/wav.js';
import { record } from './lib/cost.js';
import { SHORT_LINES } from '../src/shorts/bidetScript.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'assets', 'shorts', 'bidet');
const TMP = join(ROOT, '.cache', 'tts-short');
mkdirSync(DIR, { recursive: true });
const VIS: Record<string, string> = { a: 'A', e: 'E', i: 'E', o: 'O', u: 'O', m: 'M', b: 'M', p: 'M', f: 'F', v: 'F', _: 'X', '^': 'X', '?': 'X' };

const out: { lines: Record<string, { file: string; duration: number; visemes: [number, string][] }>; sfx: Record<string, { file: string; duration: number }> } = { lines: {}, sfx: {} };
for (const l of SHORT_LINES) {
  const file = join(DIR, `${l.id}.wav`);
  const r = synthLine({ tr: l.tr, voiceId: 'heroine', mood: l.mood, outWav: file, tmpDir: TMP });
  const w = readWav(file);
  const vis: [number, string][] = [];
  for (const ph of r.timings) {
    const v = VIS[ph.p] ?? 'C';
    if (vis.length && vis[vis.length - 1][1] === v) continue;
    vis.push([Math.round(ph.start * 1000) / 1000, v]);
  }
  out.lines[l.id] = { file: `shorts/bidet/${l.id}.wav`, duration: w.data.length / w.sr, visemes: vis };
  record('local:mbrola-hb', 'tts-line (short)', 1, 0);
}
for (const name of ['jet', 'blast', 'space']) {
  reseed(name.length * 7919);
  const file = join(DIR, `${name}.wav`);
  writeWav(file, [SFX[name]()]);
  const w = readWav(file);
  out.sfx[name] = { file: `shorts/bidet/${name}.wav`, duration: w.data.length / w.sr };
}
rmSync(TMP, { recursive: true, force: true });
writeFileSync(join(ROOT, 'src', 'generated', 'short-bidet.json'), JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out.lines)) console.log(k, v.duration.toFixed(2) + 's');
