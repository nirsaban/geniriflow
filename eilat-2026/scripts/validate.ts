// Automatic output validation + QA report (output/qa-report.md / .json).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { SCENES, COUNTER_EVENTS } from '../src/script/screenplay.js';
import { DESIGNS } from '../src/characters/designs.js';
import { summary } from './lib/cost.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'output');
const tl = JSON.parse(readFileSync(join(ROOT, 'src/generated/timeline.json'), 'utf8'));

type Check = { name: string; ok: boolean; detail: string };
const checks: Check[] = [];
const check = (name: string, ok: boolean, detail = '') => checks.push({ name, ok, detail });

const probe = (file: string) => JSON.parse(spawnSync('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', file], { encoding: 'utf8' }).stdout);
const ffLog = (file: string, filter: string, audio = false) =>
  spawnSync('ffmpeg', ['-hide_banner', '-i', file, audio ? '-af' : '-vf', filter, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 }).stderr;

function validateVideo(label: string, file: string, spec: { w: number; h: number; min: number; max: number; subs?: boolean; quietFrom?: number }) {
  if (!existsSync(file)) return check(`${label}: file exists`, false, file);
  const p = probe(file);
  const v = p.streams.find((s: any) => s.codec_type === 'video');
  const a = p.streams.find((s: any) => s.codec_type === 'audio');
  const dur = Number(p.format.duration);
  check(`${label}: H.264 video ${spec.w}×${spec.h}`, v?.codec_name === 'h264' && v.width === spec.w && v.height === spec.h, `${v?.codec_name} ${v?.width}×${v?.height}`);
  check(`${label}: 24 fps`, v?.r_frame_rate === '24/1', v?.r_frame_rate);
  check(`${label}: AAC audio`, a?.codec_name === 'aac', `${a?.codec_name} ${a?.sample_rate}Hz ${a?.channels}ch`);
  check(`${label}: duration ${spec.min}–${spec.max}s`, dur >= spec.min && dur <= spec.max, `${dur.toFixed(2)}s`);
  if (spec.subs) {
    const s = p.streams.find((x: any) => x.codec_type === 'subtitle');
    check(`${label}: Hebrew subtitle track muxed`, !!s && s.tags?.language === 'heb', s ? `${s.codec_name} ${s.tags?.language}` : 'none');
  }
  const black = [...ffLog(file, 'blackdetect=d=1.2:pix_th=0.06').matchAll(/black_start:([\d.]+) black_end:([\d.]+) black_duration:([\d.]+)/g)].map((m) => ({ start: +m[1], dur: +m[3] }));
  check(`${label}: no unintended black segments (>1.2s)`, black.length === 0, black.length ? JSON.stringify(black) : 'none');
  const freezes = [...ffLog(file, 'freezedetect=n=0.001:d=6').matchAll(/freeze_start: ([\d.]+)[\s\S]*?freeze_duration: ([\d.]+)/g)].map((m) => ({ start: +m[1], dur: +m[2] }));
  check(`${label}: no frozen video longer than 6s`, freezes.length === 0, freezes.length ? JSON.stringify(freezes) : 'none');
  const vol = ffLog(file, 'volumedetect', true);
  const mean = Number(vol.match(/mean_volume: ([-\d.]+)/)?.[1]);
  const max = Number(vol.match(/max_volume: ([-\d.]+)/)?.[1]);
  check(`${label}: audio level sane (mean −30…−10 dB, no clipping)`, mean > -30 && mean < -10 && max <= -0.1, `mean ${mean} dB, peak ${max} dB`);
  const silences = [...ffLog(file, 'silencedetect=n=-50dB:d=3.5', true).matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_duration: ([\d.]+)/g)].map((m) => ({ start: +m[1], dur: +m[2] }));
  const unintended = silences.filter((x) => spec.quietFrom === undefined || x.start < spec.quietFrom);
  check(`${label}: no dead-air gaps >3.5s (post-credits silence is scripted)`, unintended.length === 0, unintended.length || silences.length ? JSON.stringify(silences) : 'none');
}

validateVideo('movie-final.mp4', join(OUT, 'movie-final.mp4'), { w: 1920, h: 1080, min: 210, max: 235, subs: true, quietFrom: tl.scenes[14].from / tl.fps - 0.5 });
validateVideo('trailer-vertical.mp4', join(OUT, 'trailer-vertical.mp4'), { w: 1080, h: 1920, min: 45, max: 60 });
validateVideo('proof-of-concept.mp4', join(OUT, 'proof-of-concept.mp4'), { w: 1920, h: 1080, min: 10, max: 15 });

// ── script / continuity QA ──
check('Exactly three main male characters', Object.keys(DESIGNS).length === 3 && ['nir', 'roee', 'marom'].every((k) => k in DESIGNS), Object.keys(DESIGNS).join(', '));
check('Nir and Saban are one character (no separate "saban")', !('saban' in DESIGNS) && DESIGNS.nir.name.includes('ניר סבן'), DESIGNS.nir.name);
check('All 14 scenes + post-credits present', SCENES.length === 15 && tl.scenes.length === 15, `${tl.scenes.length} scenes`);
const ceremonies = SCENES.filter((s) => s.timer.resetAt).map((s) => s.id);
check('Recurring plate ceremony (3×: strange → hilarious → climax)', ceremonies.length === 3, ceremonies.join(', '));
const girls = COUNTER_EVENTS.filter((e) => e.girls !== undefined).map((e) => e.girls);
const bath = COUNTER_EVENTS.filter((e) => e.bath !== undefined).map((e) => e.bath);
check('Women-scared-away counter escalates to 20', girls.at(-1) === 20 && girls.every((g, i) => i === 0 || g! > girls[i - 1]!), girls.join(' → '));
check('Bathroom-emergency counter escalates', bath.every((g, i) => i === 0 || g! > bath[i - 1]!), bath.join(' → '));
const srt = readFileSync(join(OUT, 'subtitles-he.srt'), 'utf8');
const lines = SCENES.flatMap((s) => s.items.filter((i) => i.kind === 'line'));
check('SRT has one cue per spoken line (+WhatsApp)', (srt.match(/-->/g) ?? []).length === lines.length + 1, `${(srt.match(/-->/g) ?? []).length} cues / ${lines.length} lines`);
check('Subtitles are Hebrew with RTL embedding', /[֐-׿]/.test(srt) && srt.includes('‫'), 'U+202B RLE per cue');
const costs = summary();
const usd = Object.values(costs).reduce((a, c) => a + c.usd, 0);
check('No paid API costs incurred', usd === 0, JSON.stringify(costs));

const passed = checks.filter((c) => c.ok).length;
let md = `# QA report — אילת 2026\n\n${passed}/${checks.length} checks passed.\n\n| | check | detail |\n|---|---|---|\n`;
for (const c of checks) md += `| ${c.ok ? '✅' : '❌'} | ${c.name} | ${c.detail.replace(/\|/g, '/')} |\n`;
writeFileSync(join(OUT, 'qa-report.md'), md);
writeFileSync(join(OUT, 'qa-report.json'), JSON.stringify(checks, null, 1));
console.log(md);
process.exitCode = passed === checks.length ? 0 : 1;
