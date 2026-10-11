import React from 'react';
import { Freeze, AbsoluteFill } from 'remotion';
import { DESIGNS, type CharId } from '../characters/designs';
import { ramp, lerp } from '../lib/anim';

/** Stage-space y of a character's head centre (for camera targeting). */
export const headY = (id: CharId, feetY: number, s = 1) => {
  const d = DESIGNS[id];
  return feetY - s * (d.legLen + d.torsoH + 0.4 * d.headH);
};

/** Horizontal walk between frames a→b; returns x, whether walking, and cycle phase. */
export const walk = (f: number, a: number, b: number, x0: number, x1: number, cycle = 14) => {
  const t = ramp(f, a, b, (x) => x);
  const moving = f >= a && f < b;
  return { x: lerp(x0, x1, t), moving, phase: f / cycle, legs: moving ? ('walk' as const) : ('stand' as const) };
};

/** Zoom/pan interpolation helper for push-ins inside a shot. */
export const push = (f: number, a: number, b: number, from: number, to: number) => lerp(from, to, ramp(f, a, b));

/** Freeze-frame with a desaturated, slightly zoomed "record scratch" look. */
export const FreezeFrame: React.FC<{ frame: number; active: boolean; children: React.ReactNode; tint?: string; zoom?: number }> = ({ frame, active, children, tint = 'sepia(0.55) saturate(0.6) contrast(1.1)', zoom = 1.06 }) =>
  active ? (
    <AbsoluteFill style={{ filter: tint, transform: `scale(${zoom})` }}>
      <Freeze frame={frame}>{children}</Freeze>
    </AbsoluteFill>
  ) : (
    <>{children}</>
  );

/** Picks the current shot: list of [startFrame, value] sorted ascending. */
export function shotAt<T>(f: number, list: [number, T][]): T {
  let cur = list[0][1];
  for (const [s, v] of list) if (f >= s) cur = v;
  return cur;
}
