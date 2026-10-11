// Lays the screenplay out on a frame-accurate timeline using the real voice
// clip durations, then emits:
//   src/generated/timeline.json  – consumed by the Remotion compositions
//   output/subtitles-he.srt      – Hebrew subtitles (UTF-8, RTL text)
//   output/storyboard.json       – shot list with timings
//   output/screenplay.md         – the production screenplay as shot

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENES, COUNTER_EVENTS, FILM_TITLE, WHATSAPP, type Who } from '../src/script/screenplay.js';
import { SPEAKER_NAMES } from '../src/script/speakers.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 24;
const audio = JSON.parse(readFileSync(join(ROOT, 'src', 'generated', 'audio.json'), 'utf8'));

export interface TItem {
  id: string;
  kind: 'line' | 'beat';
  from: number; // absolute frame
  dur: number;
  speechDur?: number; // frames of actual speech
  who?: Who;
  he?: string;
  label?: string;
  sfx?: { s: string; at: number; vol: number }[];
}

let cursor = 0;
const scenes = SCENES.map((s) => {
  const from = cursor;
  const items: TItem[] = s.items.map((it) => {
    const start = cursor;
    let dur: number;
    let speechDur: number | undefined;
    if (it.kind === 'line') {
      const v = audio.voices[it.id];
      if (!v) throw new Error(`missing voice for ${it.id} — run npm run audio`);
      speechDur = Math.ceil(v.duration * FPS);
      dur = speechDur + Math.round((it.post ?? 0.08) * FPS);
    } else {
      dur = Math.round(it.dur * FPS);
    }
    cursor += dur;
    return {
      id: it.id,
      kind: it.kind,
      from: start,
      dur,
      speechDur,
      who: it.kind === 'line' ? it.who : undefined,
      he: it.kind === 'line' ? it.he : undefined,
      label: it.kind === 'beat' ? it.label : undefined,
      sfx: (it.sfx ?? []).map((c) => ({ s: c.s, at: start + Math.round((c.at ?? 0) * FPS), vol: c.vol ?? 1 })),
    };
  });
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const frameOf = (id: string | undefined, fallback: number) => (id ? byId[id]?.from ?? fallback : fallback);
  return {
    id: s.id,
    n: s.n,
    title: s.title,
    location: s.location,
    from,
    dur: cursor - from,
    items,
    music: (s.music ?? []).map((m) => ({ track: m.track, vol: m.vol, from: frameOf(m.from, from), to: frameOf(m.to, cursor) })),
    ambience: s.ambience ?? [],
    timer: { ...s.timer, resetAt: s.timer.resetAt ? byId[s.timer.resetAt].from : undefined },
  };
});
const total = cursor;
const allItems = Object.fromEntries(scenes.flatMap((s) => s.items).map((i) => [i.id, i]));
const counters = COUNTER_EVENTS.map((e) => ({ ...e, frame: allItems[e.at].from }));

mkdirSync(join(ROOT, 'output'), { recursive: true });
writeFileSync(join(ROOT, 'src', 'generated', 'timeline.json'), JSON.stringify({ fps: FPS, total, scenes, counters }, null, 1));

// ── subtitles ──
const ts = (f: number) => {
  const ms = Math.round((f / FPS) * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000), r = ms % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(r).padStart(3, '0')}`;
};
const RLE = '‫', PDF = '‬'; // embed RTL so players that ignore bidi still render correctly
let srt = '';
let n = 1;
for (const s of scenes) {
  for (const it of s.items) {
    if (it.kind !== 'line') continue;
    const name = SPEAKER_NAMES[it.who!];
    srt += `${n++}\n${ts(it.from)} --> ${ts(it.from + it.speechDur! + 6)}\n${RLE}${name}: ${it.he}${PDF}\n\n`;
  }
}
const msgItem = allItems['s15_msg'];
srt += `${n++}\n${ts(msgItem.from)} --> ${ts(msgItem.from + msgItem.dur + 72)}\n${RLE}[וואטסאפ — ${WHATSAPP.group}] ${WHATSAPP.from}: ${WHATSAPP.text}${PDF}\n\n`;
writeFileSync(join(ROOT, 'output', 'subtitles-he.srt'), srt);

// ── storyboard / shot list ──
const storyboard = {
  title: FILM_TITLE,
  fps: FPS,
  resolution: '1920x1080',
  durationSec: +(total / FPS).toFixed(2),
  scenes: scenes.map((s) => ({
    scene: s.n,
    title: s.title,
    location: s.location,
    start: +(s.from / FPS).toFixed(2),
    duration: +(s.dur / FPS).toFixed(2),
    shots: s.items.map((i) => ({
      id: i.id,
      start: +(i.from / FPS).toFixed(2),
      duration: +(i.dur / FPS).toFixed(2),
      ...(i.kind === 'line' ? { speaker: SPEAKER_NAMES[i.who!], dialogue: i.he } : { action: i.label }),
      sfx: i.sfx?.map((c) => c.s),
    })),
  })),
};
writeFileSync(join(ROOT, 'output', 'storyboard.json'), JSON.stringify(storyboard, null, 1));

// ── screenplay.md ──
let md = `# ${FILM_TITLE}\n\nאנימציה קומית למבוגרים (18+) · ${(total / FPS / 60).toFixed(0)}:${String(Math.round(total / FPS) % 60).padStart(2, '0')} דקות · 1920×1080 · 24fps\n\n`;
md += `דמויות: **ניר סבן** (ניר = סבן, אותו אדם), **רואי**, **מרום**.\n\n`;
for (const s of scenes) {
  md += `## סצנה ${s.n} — "${s.title}" | ${ts(s.from).slice(3, 8)}–${ts(s.from + s.dur).slice(3, 8)}\n\n*${s.location}*\n\n`;
  for (const it of s.items) {
    if (it.kind === 'beat') md += `> ${it.label}${it.sfx?.length ? ` *(SFX: ${it.sfx.map((c) => c.s).join(', ')})*` : ''}\n\n`;
    else md += `**${SPEAKER_NAMES[it.who!]}:** ${it.he}\n\n`;
  }
}
md += `## פוסט־קרדיטס\n\nקבוצת וואטסאפ "${WHATSAPP.group}" — ${WHATSAPP.from}: "${WHATSAPP.text}"\n`;
writeFileSync(join(ROOT, 'output', 'screenplay.md'), md);

console.log(`timeline: ${scenes.length} scenes, ${total} frames = ${(total / FPS).toFixed(2)}s`);
for (const s of scenes) console.log(`  ${s.id} ${String((s.from / FPS).toFixed(1)).padStart(6)}s  +${(s.dur / FPS).toFixed(1)}s  ${s.title}`);
