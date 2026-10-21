// Short: "בידה NASA" — 35 s, 24 fps. Fixed beat structure from the brief; lines are
// placed at seconds within their beat.
export const SHORT_FPS = 24;
export const SHORT_SECONDS = 35;

export const BEATS = {
  enter: [0, 7],
  button: [7, 13],
  launch: [13, 21],
  sky: [21, 29],
  moon: [29, 35],
} as const;

export const SHORT_LINES = [
  { id: 'b1', at: 4.0, he: 'אחח, סוף סוף קצת שקט.', tr: "'axx, sof s'of ktsat sh'eket.", mood: 'normal' as const },
  { id: 'b2', at: 9.6, he: 'רגע… מה זה הרעש הזה?!', tr: "r'ega... ma ze ha-r'aash ha-z'e?!", mood: 'panic' as const },
  { id: 'b3', at: 14.2, he: 'אמאאאא! תכבו את המים!', tr: "im'aaaa! tixb'u et ha-m'ayim!", mood: 'scream' as const },
  { id: 'b4', at: 30.0, he: 'טוב… לפחות חסכתי על טיסה.', tr: "t'ov... le-fax'ot xas'axti al tis'a.", mood: 'sarcastic' as const },
];

export const SHORT_SFX: { s: string; at: number; vol?: number }[] = [
  { s: 'steps', at: 0.4, vol: 0.6 },
  { s: 'slam', at: 2.0, vol: 0.4 },
  { s: 'click', at: 8.2 },
  { s: 'jet', at: 8.4, vol: 0.9 },
  { s: 'thunder', at: 11.5, vol: 0.5 },
  { s: 'blast', at: 13.0 },
  { s: 'smash', at: 13.3, vol: 0.8 },
  { s: 'whoosh', at: 15.5 },
  { s: 'smash', at: 16.6, vol: 0.6 },
  { s: 'whoosh', at: 21.2 },
  { s: 'heli', at: 23.6, vol: 0.5 },
  { s: 'whoosh', at: 25.4 },
  { s: 'boing', at: 27.6, vol: 0.6 },
  { s: 'space', at: 28.6, vol: 0.7 },
  { s: 'sparkle', at: 33.0 },
  { s: 'sting', at: 33.0, vol: 0.6 },
];

export const SHORT_MUSIC: { track: string; from: number; to: number; vol: number }[] = [
  { track: 'lounge', from: 0, to: 8.4, vol: 0.35 },
  { track: 'heroic', from: 13.0, to: 28.6, vol: 0.5 },
  { track: 'ceremony', from: 28.6, to: 35, vol: 0.35 },
];
