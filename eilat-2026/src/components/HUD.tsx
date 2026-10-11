import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TL, FPS } from '../lib/timeline';
import { FONT_UI } from '../fonts';
import { RunningWoman, RollIcon, PlateIcon } from './Icons';

/** Counter state at an absolute frame. */
export function countersAt(frame: number) {
  let girls = 0, bath = 0, gF = -999, bF = -999;
  for (const e of TL.counters) {
    if (e.frame > frame) break;
    if (e.girls !== undefined) { girls = e.girls; gF = e.frame; }
    if (e.bath !== undefined) { bath = e.bath; bF = e.frame; }
  }
  return { girls, bath, gF, bF };
}

/** Minutes on the fictional "time since the last plate ceremony" clock. */
export function timerAt(frame: number) {
  const s = TL.scenes.find((x) => frame >= x.from && frame < x.from + x.dur) ?? TL.scenes[TL.scenes.length - 1];
  const { start, end, resetAt } = s.timer;
  const stop = resetAt ?? s.from + s.dur;
  if (frame < stop) {
    const p = (frame - s.from) / Math.max(1, stop - s.from);
    return { min: start + (end - start) * p, resetF: resetAt, hit: resetAt !== undefined && frame >= stop - 8 };
  }
  return { min: Math.min(9, (frame - stop) / FPS / 3), resetF: resetAt, hit: false };
}

const fmt = (min: number) => {
  const m = Math.max(0, Math.floor(min));
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

const HIDE_IN = new Set(['s01_sleep', 's01_freeze', 's01_n1', 's01_title', 's13_command', 's13_black', 's14_end', 's08_cave', 's08_n1']);

export const HUD: React.FC<{ offset?: number }> = ({ offset = 0 }) => {
  const frame = useCurrentFrame() + offset;
  const scene = TL.scenes.find((x) => frame >= x.from && frame < x.from + x.dur);
  if (!scene || scene.id === 's15') return null;
  const item = scene.items.find((i) => frame >= i.from && frame < i.from + i.dur);
  if (scene.id === 's01' || (item && HIDE_IN.has(item.id))) return null;
  const c = countersAt(frame);
  const t = timerAt(frame);
  const popG = Math.max(0, 1 - (frame - c.gF) / 18);
  const popB = Math.max(0, 1 - (frame - c.bF) / 18);
  const timerHit = t.hit || (t.resetF !== undefined && frame >= t.resetF && frame < t.resetF + 30);
  const timerTxt = t.resetF !== undefined && frame >= t.resetF - 2 && frame < t.resetF + 30 ? '02:00' : fmt(t.min);
  const row = (y: number, label: string, value: string, icon: React.ReactNode, pop: number, color: string) => (
    <g transform={`translate(0 ${y})`}>
      {icon}
      <text x={-36} y={8} textAnchor="start" direction="rtl" fontFamily={FONT_UI} fontWeight={500} fontSize={24} fill="#fff">
        {label}
      </text>
      <g transform={`translate(-575 0) scale(${1 + pop * 0.6})`}>
        <text x={0} y={9} textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={30} fill={pop > 0 ? color : '#ffe26b'} stroke="#000" strokeWidth={pop > 0 ? 1.5 : 0}>
          {value}
        </text>
      </g>
    </g>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <g transform="translate(1880 40)">
          <rect x={-640} y={-12} width={650} height={150} rx={18} fill="#0b0b14" opacity={0.62} stroke={timerHit ? '#ffd34d' : '#ffffff33'} strokeWidth={timerHit ? 4 : 2} />
          {row(26, 'בחורות שהוברחו:', String(c.girls), <RunningWoman x={-16} y={22} s={1.2} />, popG, '#ff5c8a')}
          {row(70, 'אירועי חירום בשירותים:', String(c.bath), <RollIcon x={-16} y={24} s={1.1} empty />, popB, '#ffa53b')}
          {row(114, 'זמן מאז טקס הצלחת האחרון:', timerTxt, <PlateIcon x={-16} y={24} s={1.2} />, timerHit ? 0.4 + 0.3 * Math.sin(frame) : 0, '#ffd34d')}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
