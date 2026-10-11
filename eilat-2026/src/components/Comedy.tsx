// Recurring comedy devices: the sacred plate ceremony kit, emergency banners,
// title cards and big counter pops.

import React from 'react';
import { OUT } from '../characters/Character';
import { FONT_TITLE, FONT_UI } from '../fonts';
import { pop, hash01 } from '../lib/anim';
import { RunningWoman } from './Icons';

/** The mysterious plate, presented like a holy relic on a velvet pedestal. */
export const SacredPlate: React.FC<{ x: number; y: number; f: number; glow?: number; s?: number }> = ({ x, y, f, glow = 1, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* halo rays */}
    <g opacity={0.55 * glow}>
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d="M 0 0 L -18 -330 L 18 -330 Z" fill="#fff3a0" transform={`translate(0 -120) rotate(${i * 22.5 + f * 0.6})`} />
      ))}
    </g>
    <circle cx={0} cy={-120} r={150} fill="#fff7c0" opacity={0.35 * glow} />
    {/* pedestal */}
    <path d="M -90 0 L 90 0 L 60 -40 L 70 -90 L -70 -90 L -60 -40 Z" fill="#7a1f3d" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-110} y={-110} width={220} height={26} rx={8} fill="#d4a017" stroke={OUT} strokeWidth={5} />
    {/* plate */}
    <ellipse cx={0} cy={-128} rx={120} ry={34} fill="#f4efe2" stroke={OUT} strokeWidth={5} />
    <ellipse cx={0} cy={-131} rx={78} ry={20} fill="#fffdf6" stroke="#d9cfb8" strokeWidth={3} />
    <path d="M -110 -128 Q 0 -100 110 -128" stroke="#d4a017" strokeWidth={5} fill="none" />
    {/* sparkle glints (nothing on the plate is shown) */}
    {[0, 1, 2].map((i) => {
      const t = ((f + i * 9) % 27) / 27;
      return <path key={i} d="M 0 -14 L 3 -3 L 14 0 L 3 3 L 0 14 L -3 3 L -14 0 L -3 -3 Z" fill="#fff" stroke="#d4a017" strokeWidth={2} transform={`translate(${-70 + i * 70} ${-150 - i * 8}) scale(${Math.sin(t * Math.PI) * 1.5})`} />;
    })}
  </g>
);

/** Spotlight cone from above. */
export const Spotlight: React.FC<{ x: number; opacity?: number; width?: number }> = ({ x, opacity = 1, width = 260 }) => (
  <g opacity={opacity}>
    <defs>
      <linearGradient id="spot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fffbe0" stopOpacity={0.85} />
        <stop offset="1" stopColor="#fffbe0" stopOpacity={0.15} />
      </linearGradient>
    </defs>
    <path d={`M ${x - 40} -20 L ${x + 40} -20 L ${x + width} 1100 L ${x - width} 1100 Z`} fill="url(#spot)" />
  </g>
);

/** Big ornamental gong with a mallet strike at `hitF`. */
export const Gong: React.FC<{ x: number; y: number; f: number; hitF: number; s?: number }> = ({ x, y, f, hitF, s = 1 }) => {
  const dt = f - hitF;
  const wob = dt >= 0 ? Math.sin(dt * 1.6) * Math.exp(-dt * 0.12) * 6 : 0;
  const mallet = dt < 0 ? -40 * Math.min(1, (dt + 8) / 8) : 10 * Math.exp(-dt * 0.3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -260 -330 L -260 200 M 260 -330 L 260 200 M -290 -330 L 290 -330" stroke="#6a1d1d" strokeWidth={34} strokeLinecap="round" />
      <path d="M -260 -330 L -260 200 M 260 -330 L 260 200 M -290 -330 L 290 -330" stroke={OUT} strokeWidth={4} fill="none" />
      <line x1={-80} y1={-330} x2={-60} y2={-230} stroke={OUT} strokeWidth={5} />
      <line x1={80} y1={-330} x2={60} y2={-230} stroke={OUT} strokeWidth={5} />
      <g transform={`rotate(${wob})`}>
        <circle cx={0} cy={-40} r={200} fill="#d4a017" stroke={OUT} strokeWidth={6} />
        <circle cx={0} cy={-40} r={150} fill="none" stroke="#a87b0c" strokeWidth={8} />
        <circle cx={0} cy={-40} r={60} fill="#e9c24a" stroke="#a87b0c" strokeWidth={6} />
      </g>
      {dt >= 0 && dt < 20 && [0, 1, 2].map((i) => <circle key={i} cx={0} cy={-40} r={210 + dt * 14 + i * 30} fill="none" stroke="#fff3a0" strokeWidth={6 - i * 1.5} opacity={1 - dt / 20} />)}
      <g transform={`translate(${280 + mallet} -40) rotate(${-20 + mallet * 0.5})`}>
        <rect x={0} y={-8} width={200} height={16} rx={8} fill="#8a5a2a" stroke={OUT} strokeWidth={4} />
        <circle cx={0} cy={0} r={34} fill="#c0392b" stroke={OUT} strokeWidth={5} />
      </g>
    </g>
  );
};

/** Wall clock that whips forward exactly two hours. p: 0→1 progress of the sweep. */
export const TwoHourClock: React.FC<{ x: number; y: number; p: number; s?: number; fromHour?: number }> = ({ x, y, p, s = 1, fromHour = 14 }) => {
  const minutes = p * 120;
  const hourA = ((fromHour % 12) * 30 + (minutes / 60) * 30) - 90;
  const minA = (minutes % 60) * 6 - 90;
  const hh = fromHour + Math.floor(minutes / 60);
  const mm = Math.floor(minutes % 60);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={170} fill="#fffdf2" stroke={OUT} strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={0} y1={-150} x2={0} y2={-128} stroke={OUT} strokeWidth={8} transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={Math.cos((hourA * Math.PI) / 180) * 80} y2={Math.sin((hourA * Math.PI) / 180) * 80} stroke={OUT} strokeWidth={14} strokeLinecap="round" />
      <line x1={0} y1={0} x2={Math.cos((minA * Math.PI) / 180) * 125} y2={Math.sin((minA * Math.PI) / 180) * 125} stroke="#c0392b" strokeWidth={8} strokeLinecap="round" />
      <circle r={12} fill={OUT} />
      <g transform="translate(0 240)">
        <rect x={-150} y={-46} width={300} height={70} rx={14} fill="#111" stroke="#ffd34d" strokeWidth={4} />
        <text x={0} y={8} textAnchor="middle" fill="#ffd34d" fontFamily="monospace" fontWeight={700} fontSize={48}>
          {`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`}
        </text>
      </g>
      {p >= 1 && (
        <text x={0} y={-210} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={56} fill="#ffd34d" stroke={OUT} strokeWidth={3} direction="rtl">
          +2 שעות בדיוק
        </text>
      )}
    </g>
  );
};

/** Robed choir singing with big round mouths. */
export const Choir: React.FC<{ x: number; y: number; f: number; n?: number }> = ({ x, y, f, n = 5 }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: n }, (_, i) => {
      const cx = (i - (n - 1) / 2) * 150;
      const sway = Math.sin(f * 0.15 + i) * 5;
      const mouth = 14 + Math.abs(Math.sin(f * 0.2 + i * 0.7)) * 14;
      return (
        <g key={i} transform={`translate(${cx} ${sway})`}>
          <path d="M -70 0 L -50 -260 Q 0 -290 50 -260 L 70 0 Z" fill={i % 2 ? '#7a1f3d' : '#5a1f7a'} stroke={OUT} strokeWidth={5} />
          <path d="M -40 -250 L 0 -180 L 40 -250" fill="#fff" stroke={OUT} strokeWidth={4} />
          <circle cx={0} cy={-320} r={58} fill={['#f2c9a0', '#c98e62', '#e0ac85', '#f6d2b3', '#a8754e'][i % 5]} stroke={OUT} strokeWidth={5} />
          <ellipse cx={0} cy={-298} rx={mouth * 0.6} ry={mouth} fill="#5a1620" stroke={OUT} strokeWidth={4} />
          <path d="M -26 -340 q 8 -8 16 0 M 10 -340 q 8 -8 16 0" stroke={OUT} strokeWidth={4} fill="none" />
          <rect x={-46} y={-200} width={92} height={64} rx={6} fill="#2a2a2a" stroke={OUT} strokeWidth={4} />
          <text x={0} y={-160} textAnchor="middle" fill="#ffd34d" fontSize={22} fontFamily={FONT_UI}>♪ ♫</text>
        </g>
      );
    })}
  </g>
);

/** Stylised non-graphic cutaway: a burst of glitter over the plate. */
export const GlitterBurst: React.FC<{ x: number; y: number; f: number; start: number }> = ({ x, y, f, start }) => {
  const t = Math.max(0, f - start);
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 60 }, (_, i) => {
        const a = hash01(i, 1) * Math.PI * 2;
        const sp = 6 + hash01(i, 2) * 16;
        const r = t * sp;
        const op = Math.max(0, 1 - t / 30);
        const c = ['#fff3a0', '#ff8fd8', '#8fe9ff', '#ffffff'][i % 4];
        return <path key={i} d="M 0 -10 L 2.5 -2.5 L 10 0 L 2.5 2.5 L 0 10 L -2.5 2.5 L -10 0 L -2.5 -2.5 Z" fill={c} transform={`translate(${Math.cos(a) * r} ${Math.sin(a) * r - t * 2}) scale(${1 + hash01(i, 3)})`} opacity={op} />;
      })}
    </g>
  );
};

/** Diagonal comic banner ("אירוע חירום מספר 1" etc.). */
export const Banner: React.FC<{ text: string; f: number; start: number; color?: string; y?: number; size?: number; rot?: number }> = ({ text, f, start, color = '#e02424', y = 520, size = 96, rot = -4 }) => {
  const p = pop(f, start, 12);
  if (f < start) return null;
  return (
    <g transform={`translate(960 ${y}) rotate(${rot}) scale(${p})`}>
      <rect x={-860} y={-size * 0.95} width={1720} height={size * 1.55} fill={color} stroke={OUT} strokeWidth={8} />
      <rect x={-860} y={-size * 0.95} width={1720} height={18} fill="#ffd34d" opacity={0.9} />
      <text x={0} y={size * 0.28} textAnchor="middle" direction="rtl" fontFamily={FONT_TITLE} fontSize={size} fill="#fff" stroke={OUT} strokeWidth={4} paintOrder="stroke">
        {text}
      </text>
    </g>
  );
};

/** Big centred counter pop with running-women icons. */
export const CounterPop: React.FC<{ f: number; start: number; label: string; value: number; kind?: 'girls' | 'bath' }> = ({ f, start, label, value, kind = 'girls' }) => {
  if (f < start) return null;
  const p = pop(f, start, 10);
  return (
    <g transform={`translate(960 470) scale(${p})`}>
      <rect x={-560} y={-150} width={1120} height={300} rx={40} fill="#1a0f2e" stroke="#ff5c8a" strokeWidth={8} opacity={0.93} />
      <text x={0} y={-40} textAnchor="middle" direction="rtl" fontFamily={FONT_TITLE} fontSize={70} fill="#fff">
        {label}
      </text>
      <text x={0} y={100} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={150} fill="#ffe26b" stroke={OUT} strokeWidth={5} paintOrder="stroke">
        {value}
      </text>
      {kind === 'girls' &&
        Array.from({ length: 6 }, (_, i) => {
          const t = ((f - start) * 6 + i * 50) % 600;
          return <RunningWoman key={i} x={-480 + t * 1.6} y={-110 + (i % 2) * 230} s={2.4} color={['#ff8fb8', '#ffd166', '#8fe9ff'][i % 3]} />;
        })}
    </g>
  );
};

/** Red rotating emergency light. */
export const EmergencyLight: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -60 0 Q -60 -90 0 -90 Q 60 -90 60 0 Z" fill="#ff2020" stroke={OUT} strokeWidth={6} />
    <rect x={-80} y={0} width={160} height={30} rx={8} fill="#333" stroke={OUT} strokeWidth={5} />
    <path d="M 0 -45 L -900 -400 L -900 300 Z" fill="#ff3030" opacity={0.18} transform={`rotate(${(f * 18) % 360} 0 -45)`} />
  </g>
);

/** The film's main title card. */
export const TitleCardArt: React.FC<{ f: number; title: string; subtitle?: string; tag?: string }> = ({ f, title, subtitle, tag }) => {
  const p = pop(f, 0, 14);
  return (
    <g>
      <rect width={1920} height={1080} fill="#ffcf3a" />
      {Array.from({ length: 24 }, (_, i) => (
        <path key={i} d="M 960 540 L 3000 470 L 3000 610 Z" fill={i % 2 ? '#ffb31a' : '#ffd95a'} transform={`rotate(${i * 15 + f * 0.4} 960 540)`} />
      ))}
      {/* rolls flying */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + f * 0.01;
        const r = 600 + Math.sin(f * 0.05 + i) * 40;
        return (
          <g key={i} transform={`translate(${960 + Math.cos(a) * r} ${540 + Math.sin(a) * r * 0.55}) rotate(${f * 3 + i * 40})`}>
            <rect x={-40} y={-30} width={80} height={60} rx={10} fill="#fff" stroke={OUT} strokeWidth={5} />
            <ellipse cx={-40} cy={0} rx={10} ry={30} fill="#eee" stroke={OUT} strokeWidth={4} />
          </g>
        );
      })}
      <g transform={`translate(960 470) scale(${p}) rotate(-3)`}>
        <text x={0} y={-60} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={190} fill="#fff" stroke={OUT} strokeWidth={14} paintOrder="stroke" direction="rtl">
          {title}
        </text>
        {subtitle && (
          <text x={0} y={80} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={78} fill="#e02424" stroke={OUT} strokeWidth={8} paintOrder="stroke" direction="rtl">
            {subtitle}
          </text>
        )}
      </g>
      {tag && (
        <g transform="translate(1700 900) rotate(8)">
          <rect x={-110} y={-50} width={220} height={100} rx={14} fill="#111" />
          <text x={0} y={22} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={64} fill="#ffcf3a">
            {tag}
          </text>
        </g>
      )}
    </g>
  );
};
