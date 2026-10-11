import type { Who } from './screenplay';

export const SPEAKER_NAMES: Record<Who, string> = {
  nir: 'ניר',
  roee: 'רואי',
  marom: 'מרום',
  narr: 'קריין',
  girl: 'בחורה',
  girl2: 'בחורה',
  guard: 'מאבטח',
  manager: 'מנהל בזום',
  both: 'ניר ומרום',
};

/** Subtitle accent colour per speaker. */
export const SPEAKER_COLORS: Record<Who, string> = {
  nir: '#7fd3ff',
  roee: '#ffb347',
  marom: '#9dff7a',
  narr: '#e8e0ff',
  girl: '#ff9ecb',
  girl2: '#ff9ecb',
  guard: '#d0d0d0',
  manager: '#d0d0d0',
  both: '#c4f0c0',
};
