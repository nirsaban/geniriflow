import { createContext, useContext } from 'react';
import { useCurrentFrame } from 'remotion';
import timelineJson from '../generated/timeline.json';
import audioJson from '../generated/audio.json';
import type { Who } from '../script/screenplay';

export interface TItem {
  id: string;
  kind: 'line' | 'beat';
  from: number;
  dur: number;
  speechDur?: number;
  who?: Who;
  he?: string;
  label?: string;
  sfx?: { s: string; at: number; vol: number }[];
}
export interface TScene {
  id: string;
  n: number;
  title: string;
  location: string;
  from: number;
  dur: number;
  items: TItem[];
  music: { track: string; vol: number; from: number; to: number }[];
  ambience: { track: string; vol: number }[];
  timer: { start: number; end: number; resetAt?: number };
}
export interface Timeline {
  fps: number;
  total: number;
  scenes: TScene[];
  counters: { at: string; frame: number; girls?: number; bath?: number }[];
}

export const TL = timelineJson as unknown as Timeline;
export const AUDIO = audioJson as unknown as {
  voices: Record<string, { file: string; duration: number; who: string; visemes: [number, string][] }>;
  sfx: Record<string, { file: string; duration: number }>;
  ambience: Record<string, { file: string; duration: number }>;
  music: Record<string, { file: string; duration: number }>;
};
export const FPS = TL.fps;
export const sceneById = (id: string) => TL.scenes.find((s) => s.id === id)!;
export const ITEMS: Record<string, TItem> = Object.fromEntries(TL.scenes.flatMap((s) => s.items).map((i) => [i.id, i]));

/** Absolute frame offset of the currently rendering scene (frames inside a scene are relative). */
export const SceneCtx = createContext<{ scene: TScene; offset: number }>({ scene: TL.scenes[0], offset: 0 });

/** Scene-relative timing helpers. */
export function useScene() {
  const { scene, offset } = useContext(SceneCtx);
  const f = useCurrentFrame();
  const abs = f + offset;
  const at = (id: string) => ITEMS[id].from - scene.from;
  const end = (id: string) => ITEMS[id].from + ITEMS[id].dur - scene.from;
  const dur = (id: string) => ITEMS[id].dur;
  /** frames since item start (negative before) */
  const since = (id: string) => f - at(id);
  /** true while f is within [start(a), start(b)) */
  const between = (a: string, b?: string) => f >= at(a) && (b === undefined || f < at(b));
  /** the most recent of the given item ids that has started */
  const latest = (ids: string[]) => {
    let cur: string | null = null;
    for (const id of ids) if (f >= at(id)) cur = id;
    return cur;
  };
  return { f, abs, scene, at, end, dur, since, between, latest };
}

/** Viseme for a speaker at an absolute frame, or null if not speaking. */
export function visemeAt(who: string, absFrame: number): { v: string; line: TItem; t: number } | null {
  for (const s of TL.scenes) {
    if (absFrame < s.from || absFrame >= s.from + s.dur) continue;
    for (const it of s.items) {
      if (it.kind !== 'line' || !it.speechDur) continue;
      const speaks = it.who === who || (it.who === 'both' && (who === 'nir' || who === 'marom'));
      if (!speaks) continue;
      const rel = absFrame - it.from;
      if (rel < 0 || rel >= it.speechDur) continue;
      const t = rel / FPS;
      const vis = AUDIO.voices[it.id].visemes;
      let v = 'X';
      for (const [ts, vv] of vis) {
        if (ts <= t) v = vv;
        else break;
      }
      return { v, line: it, t };
    }
  }
  return null;
}
