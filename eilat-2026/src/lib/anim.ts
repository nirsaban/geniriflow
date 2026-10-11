import { interpolate, Easing } from 'remotion';

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** 0→1 ramp between frames a and b, eased. */
export const ramp = (f: number, a: number, b: number, ease: (t: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Map f through keyframes [[frame, value], ...] with easing. */
export const keys = (f: number, k: [number, number][], ease = Easing.inOut(Easing.cubic)) =>
  interpolate(
    f,
    k.map((x) => x[0]),
    k.map((x) => x[1]),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease },
  );
/** Damped spring-like overshoot pop 0→1 starting at frame a. */
export const pop = (f: number, a: number, len = 10) => {
  const t = clamp01((f - a) / len);
  if (t <= 0) return 0;
  return 1 + Math.sin(t * Math.PI * 2.2) * Math.exp(-t * 5) * 0.35 - (1 - t) ** 3 * 1;
};
/** Deterministic pseudo-random in [0,1) from integer seeds. */
export const hash01 = (...n: number[]) => {
  let h = 2166136261;
  for (const x of n) {
    h ^= Math.floor(x * 1000);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
};
export const wobble = (f: number, speed = 0.2, amp = 1, seed = 0) => Math.sin(f * speed + seed) * amp;
export const shake = (f: number, amt: number, seed = 0) => ({
  x: (hash01(f, seed) - 0.5) * 2 * amt,
  y: (hash01(f, seed + 7) - 0.5) * 2 * amt,
});
