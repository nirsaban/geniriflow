// Original hand-built SVG backgrounds for every location in the film.
// All are 1920×1080 stage space; animated elements take the frame `f`.

import React from 'react';
import { OUT } from '../characters/Character';
import { FONT_TITLE, FONT_UI } from '../fonts';
import { hash01 } from '../lib/anim';

const SW = 5;

// ───────────────────────── Nir's bedroom (night) ─────────────────────────
export const Bedroom: React.FC<{ f: number; doorShake?: number; lampOn?: boolean }> = ({ f, doorShake = 0, lampOn }) => {
  const dx = doorShake ? Math.sin(f * 2.2) * doorShake : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#27305a" />
      <rect y={780} width={1920} height={300} fill="#3a2f52" />
      <line x1={0} y1={780} x2={1920} y2={780} stroke={OUT} strokeWidth={SW} />
      {/* window */}
      <rect x={180} y={170} width={420} height={330} fill="#0f1533" stroke={OUT} strokeWidth={SW} />
      <circle cx={480} cy={260} r={48} fill="#fff7c2" />
      <circle cx={500} cy={248} r={46} fill="#0f1533" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={200 + hash01(i) * 380} cy={190 + hash01(i, 2) * 290} r={2 + (Math.sin(f * 0.2 + i) + 1)} fill="#fff" />
      ))}
      <line x1={390} y1={170} x2={390} y2={500} stroke={OUT} strokeWidth={SW} />
      <line x1={180} y1={335} x2={600} y2={335} stroke={OUT} strokeWidth={SW} />
      <rect x={160} y={500} width={460} height={22} fill="#5a4a7a" stroke={OUT} strokeWidth={SW} />
      {/* poster */}
      <rect x={760} y={210} width={200} height={260} fill="#1b2340" stroke={OUT} strokeWidth={SW} />
      <text x={860} y={330} textAnchor="middle" fill="#5ad1ff" fontSize={64} fontFamily="monospace" fontWeight={700}>{'</>'}</text>
      <text x={860} y={400} textAnchor="middle" fill="#ffd34d" fontSize={26} fontFamily={FONT_UI} direction="rtl">פשוט לישון</text>
      {/* nightstand + clock */}
      <rect x={1180} y={640} width={150} height={150} fill="#5b3f2b" stroke={OUT} strokeWidth={SW} />
      <rect x={1200} y={600} width={110} height={44} rx={6} fill="#111" stroke={OUT} strokeWidth={4} />
      <text x={1255} y={633} textAnchor="middle" fill="#ff4040" fontSize={30} fontFamily="monospace" fontWeight={700}>02:00</text>
      {/* lamp */}
      <path d="M 1290 600 L 1300 520 L 1340 520 L 1350 600 Z" fill={lampOn ? '#ffe9a0' : '#c9b37a'} stroke={OUT} strokeWidth={4} transform="translate(-40 -70)" />
      {/* door */}
      <g transform={`translate(${dx} 0)`}>
        <rect x={1560} y={260} width={260} height={520} fill="#7a4e2d" stroke={OUT} strokeWidth={SW} />
        <rect x={1590} y={300} width={200} height={180} fill="#6a4226" stroke={OUT} strokeWidth={4} />
        <rect x={1590} y={520} width={200} height={220} fill="#6a4226" stroke={OUT} strokeWidth={4} />
        <circle cx={1595} cy={530} r={12} fill="#e0c060" stroke={OUT} strokeWidth={4} />
      </g>
      <rect x={1545} y={245} width={290} height={20} fill="#5b3f2b" stroke={OUT} strokeWidth={4} />
      {/* bed */}
      <rect x={260} y={560} width={760} height={90} rx={16} fill="#e0e4f0" stroke={OUT} strokeWidth={SW} />
      <rect x={230} y={470} width={50} height={330} rx={10} fill="#5b3f2b" stroke={OUT} strokeWidth={SW} />
      <rect x={1000} y={560} width={40} height={240} rx={10} fill="#5b3f2b" stroke={OUT} strokeWidth={SW} />
      <rect x={260} y={640} width={760} height={110} fill="#4b5fa8" stroke={OUT} strokeWidth={SW} />
      {/* moonlight */}
      <path d="M 180 500 L 600 500 L 900 1080 L 0 1080 Z" fill="#b8c8ff" opacity={0.06} />
    </g>
  );
};

/** The blanket drawn over a sleeping character. */
export const Blanket: React.FC<{ f: number }> = ({ f }) => (
  <path d={`M 640 ${600 + Math.sin(f * 0.12) * 4} Q 820 ${555 + Math.sin(f * 0.12) * 8} 1010 590 L 1010 700 L 600 700 Z`} fill="#5a6fc0" stroke={OUT} strokeWidth={SW} />
);

// ───────────────────────── stairwell outside Nir's door ─────────────────────────
export const Doorway: React.FC<{ f: number }> = () => (
  <g>
    <rect width={1920} height={1080} fill="#3a3a48" />
    <rect x={560} y={120} width={800} height={900} fill="#c9c29a" stroke={OUT} strokeWidth={SW} />
    <rect x={560} y={760} width={800} height={260} fill="#9b9377" />
    <circle cx={960} cy={200} r={26} fill="#fff6b0" stroke={OUT} strokeWidth={4} />
    <path d="M 960 200 L 700 1020 L 1220 1020 Z" fill="#fff6b0" opacity={0.18} />
    <text x={1240} y={300} fill="#7a7258" fontSize={34} fontFamily={FONT_UI} direction="rtl" textAnchor="start">קומה 3</text>
    {/* frame */}
    <rect x={500} y={80} width={60} height={1000} fill="#7a4e2d" stroke={OUT} strokeWidth={SW} />
    <rect x={1360} y={80} width={60} height={1000} fill="#7a4e2d" stroke={OUT} strokeWidth={SW} />
    <rect x={500} y={60} width={920} height={60} fill="#7a4e2d" stroke={OUT} strokeWidth={SW} />
    <rect x={0} y={0} width={500} height={1080} fill="#27305a" />
    <rect x={1420} y={0} width={500} height={1080} fill="#27305a" />
  </g>
);

// ───────────────────────── desert road (exterior) ─────────────────────────
export const DesertRoad: React.FC<{ f: number; speed?: number; sunset?: boolean }> = ({ f, speed = 30, sunset }) => {
  const off = f * speed;
  const sky1 = sunset ? '#ff8a5c' : '#8fd3ff';
  const sky2 = sunset ? '#ffd27a' : '#fff1c7';
  return (
    <g>
      <defs>
        <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky1} />
          <stop offset="1" stopColor={sky2} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#dsky)" />
      <circle cx={sunset ? 1500 : 1600} cy={sunset ? 520 : 180} r={90} fill={sunset ? '#ff5e3a' : '#fff4a3'} />
      {[0, 1].map((k) => (
        <path
          key={k}
          transform={`translate(${-((off * 0.08) % 1920) + k * 1920} 0)`}
          d="M 0 600 L 120 430 L 260 520 L 420 360 L 560 500 L 700 410 L 860 540 L 1000 380 L 1180 520 L 1320 420 L 1480 560 L 1640 400 L 1800 520 L 1920 600 Z"
          fill={sunset ? '#9c4a5a' : '#c8664a'}
          stroke={OUT}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
      ))}
      {[0, 1].map((k) => (
        <path key={k} transform={`translate(${-((off * 0.25) % 1920) + k * 1920} 0)`} d="M 0 640 Q 300 560 600 630 T 1200 620 T 1920 640 L 1920 760 L 0 760 Z" fill={sunset ? '#c97a52' : '#e8b06a'} stroke={OUT} strokeWidth={SW} />
      ))}
      <rect y={740} width={1920} height={340} fill={sunset ? '#b0784e' : '#e9c48a'} />
      <rect y={780} width={1920} height={200} fill="#4a4a52" stroke={OUT} strokeWidth={SW} />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={((i * 260 - off) % 2600 + 2600) % 2600 - 300} y={872} width={140} height={14} fill="#ffd34d" />
      ))}
      {/* road sign */}
      <g transform={`translate(${((1700 - off * 1.0) % 3600 + 3600) % 3600 - 600} 0)`}>
        <rect x={0} y={560} width={12} height={220} fill="#888" stroke={OUT} strokeWidth={3} />
        <rect x={-80} y={520} width={172} height={90} rx={8} fill="#1a7a3a" stroke={OUT} strokeWidth={4} />
        <text x={6} y={560} textAnchor="middle" fill="#fff" fontSize={30} fontFamily={FONT_UI} fontWeight={800}>אילת</text>
        <text x={6} y={596} textAnchor="middle" fill="#fff" fontSize={28} fontFamily={FONT_UI}>120</text>
      </g>
      {/* cacti */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${((i * 900 + 300 - off * 0.6) % 2700 + 2700) % 2700 - 400} 700)`}>
          <rect x={-12} y={-90} width={24} height={100} rx={12} fill="#4a9a4a" stroke={OUT} strokeWidth={4} />
          <path d="M -12 -40 L -36 -40 L -36 -70" fill="none" stroke="#4a9a4a" strokeWidth={16} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
};

/** Side view of the guys' small car with three heads in the windows. */
export const CarSide: React.FC<{ f: number; x: number; y: number; headsFn?: (slot: number) => React.ReactNode }> = ({ f, x, y, headsFn }) => {
  const bounce = Math.sin(f * 1.3) * 3;
  return (
    <g transform={`translate(${x} ${y + bounce})`}>
      <path d="M -330 0 L -330 -110 Q -320 -130 -280 -135 L -200 -140 L -120 -230 Q -100 -250 -60 -250 L 170 -250 Q 210 -250 230 -220 L 290 -140 L 330 -130 Q 350 -125 350 -100 L 350 0 Z" fill="#e94b3c" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <defs>
        <clipPath id="carwin0"><path d="M -180 -145 L -110 -225 L 20 -225 L 20 -145 Z" /></clipPath>
        <clipPath id="carwin1"><path d="M 40 -145 L 40 -225 L 170 -225 Q 190 -225 205 -205 L 255 -145 Z" /></clipPath>
      </defs>
      <path d="M -180 -145 L -110 -225 L 20 -225 L 20 -145 Z" fill="#a8e0ff" />
      <path d="M 40 -145 L 40 -225 L 170 -225 Q 190 -225 205 -205 L 255 -145 Z" fill="#a8e0ff" />
      <g clipPath="url(#carwin0)">{headsFn?.(0)}</g>
      <g clipPath="url(#carwin1)">{headsFn?.(1)}</g>
      <path d="M -180 -145 L -110 -225 L 20 -225 L 20 -145 Z" fill="#ffffff" opacity={0.18} stroke={OUT} strokeWidth={4} />
      <path d="M 40 -145 L 40 -225 L 170 -225 Q 190 -225 205 -205 L 255 -145 Z" fill="#ffffff" opacity={0.18} stroke={OUT} strokeWidth={4} />
      <rect x={-340} y={-60} width={40} height={24} rx={6} fill="#ffe28a" stroke={OUT} strokeWidth={3} />
      <rect x={320} y={-70} width={34} height={20} rx={6} fill="#ff6b6b" stroke={OUT} strokeWidth={3} />
      {[-200, 210].map((wx) => (
        <g key={wx} transform={`translate(${wx} 0) rotate(${f * 40})`}>
          <circle r={64} fill="#222" stroke={OUT} strokeWidth={SW} />
          <circle r={30} fill="#bbb" stroke={OUT} strokeWidth={4} />
          <line x1={-30} y1={0} x2={30} y2={0} stroke="#777" strokeWidth={6} />
        </g>
      ))}
      {/* dust */}
      {[0, 1, 2].map((i) => {
        const t = ((f * 2 + i * 10) % 30) / 30;
        return <circle key={i} cx={-380 - t * 220} cy={-20 - t * 30} r={20 + t * 40} fill="#e8d0a0" opacity={0.7 * (1 - t)} />;
      })}
    </g>
  );
};

/** Car interior seen from the hood. Back part (behind characters). */
export const CarInteriorBack: React.FC<{ f: number; sunset?: boolean }> = ({ f, sunset }) => (
  <g>
    <DesertRoad f={f} speed={40} sunset={sunset} />
    <rect width={1920} height={1080} fill={sunset ? '#401c2a' : '#1d2a3a'} opacity={0.25} />
    {/* rear window & back seat */}
    <rect x={430} y={200} width={1060} height={260} rx={50} fill={sunset ? '#ffb070' : '#bfe8ff'} stroke={OUT} strokeWidth={SW} opacity={0.9} />
    <rect x={380} y={430} width={1160} height={420} rx={40} fill="#3b3b46" stroke={OUT} strokeWidth={SW} />
    {/* front seats */}
    <rect x={330} y={520} width={420} height={480} rx={50} fill="#4a4a58" stroke={OUT} strokeWidth={SW} />
    <rect x={1170} y={520} width={420} height={480} rx={50} fill="#4a4a58" stroke={OUT} strokeWidth={SW} />
  </g>
);

/** Car interior foreground: windshield frame, dashboard, steering wheel. */
export const CarInteriorFront: React.FC<{ f: number; acBlast?: boolean }> = ({ f, acBlast }) => (
  <g>
    <path d="M 0 0 L 1920 0 L 1920 1080 L 0 1080 Z M 140 80 Q 960 30 1780 80 L 1860 760 L 60 760 Z" fill="#2b2b33" fillRule="evenodd" stroke={OUT} strokeWidth={SW} />
    <path d="M 0 820 Q 960 700 1920 820 L 1920 1080 L 0 1080 Z" fill="#33333d" stroke={OUT} strokeWidth={SW} />
    <rect x={820} y={810} width={280} height={60} rx={12} fill="#1c1c22" stroke={OUT} strokeWidth={4} />
    {[0, 1, 2].map((i) => <rect key={i} x={840 + i * 88} y={824} width={72} height={30} rx={6} fill="#555" />)}
    {acBlast && [0, 1, 2].map((i) => <path key={i} d={`M ${870 + i * 88} 810 q 10 -30 0 -60 t 0 -60`} stroke="#9fe0ff" strokeWidth={5} fill="none" opacity={0.5 + 0.3 * Math.sin(f * 0.6 + i)} />)}
    {/* rear-view mirror */}
    <rect x={880} y={70} width={160} height={50} rx={14} fill="#888" stroke={OUT} strokeWidth={4} />
    <rect x={952} y={40} width={16} height={34} fill="#444" />
    {/* air freshener tree */}
    <path d={`M 960 120 L 960 150 M 940 150 L 980 150 L 960 210 Z`} fill="#3ccf6e" stroke={OUT} strokeWidth={3} transform={`rotate(${Math.sin(f * 0.3) * 10} 960 120)`} />
  </g>
);

export const SteeringWheel: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(f * 0.07) * 8})`}>
    <circle r={130} fill="none" stroke="#1a1a1f" strokeWidth={30} />
    <circle r={130} fill="none" stroke={OUT} strokeWidth={4} />
    <circle r={40} fill="#26262c" stroke={OUT} strokeWidth={4} />
    <line x1={-120} y1={0} x2={-40} y2={0} stroke="#1a1a1f" strokeWidth={22} />
    <line x1={120} y1={0} x2={40} y2={0} stroke="#1a1a1f" strokeWidth={22} />
  </g>
);

// ───────────────────────── Eilat rental apartment ─────────────────────────
export type Light = 'day' | 'evening' | 'night' | 'afternoon' | 'dark';
const LIGHT_TINT: Record<Light, [string, number]> = {
  day: ['#fff8e0', 0],
  afternoon: ['#ffb36b', 0.12],
  evening: ['#5a3a8a', 0.22],
  night: ['#141b46', 0.42],
  dark: ['#05050f', 0.72],
};

export const Apartment: React.FC<{ f: number; light?: Light; acStink?: boolean; bathDoorOpen?: number; bathDoorShake?: number; redAlert?: boolean }> = ({ f, light = 'day', acStink = true, bathDoorShake = 0, redAlert }) => {
  const [tint, a] = LIGHT_TINT[light];
  const skyCol = light === 'night' || light === 'dark' ? '#0f1840' : light === 'evening' ? '#ff9a6b' : light === 'afternoon' ? '#ffc98a' : '#7fd3ff';
  const ds = bathDoorShake ? Math.sin(f * 2.5) * bathDoorShake : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#f3d9b5" />
      <rect width={1920} height={140} fill="#e9caa0" />
      <rect y={800} width={1920} height={280} fill="#d8c3a2" />
      {Array.from({ length: 13 }, (_, i) => <line key={i} x1={i * 160} y1={800} x2={i * 160 - 120} y2={1080} stroke="#c2ab88" strokeWidth={3} />)}
      <line y1={800} x2={1920} y2={800} stroke={OUT} strokeWidth={SW} x1={0} />
      {/* window with sea view */}
      <rect x={140} y={200} width={560} height={420} fill={skyCol} stroke={OUT} strokeWidth={SW} />
      <path d="M 140 470 L 260 380 L 380 440 L 500 360 L 700 450 L 700 520 L 140 520 Z" fill="#b85a46" stroke={OUT} strokeWidth={4} />
      <rect x={140} y={510} width={560} height={110} fill="#2f8fd6" stroke={OUT} strokeWidth={4} />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${170 + i * 180 + Math.sin(f * 0.1 + i) * 10} ${555 + i * 12} q 20 -10 40 0`} stroke="#bfe8ff" strokeWidth={4} fill="none" />)}
      <line x1={420} y1={200} x2={420} y2={620} stroke={OUT} strokeWidth={SW} />
      <rect x={120} y={620} width={600} height={24} fill="#fff" stroke={OUT} strokeWidth={SW} />
      {/* AC unit */}
      <g transform="translate(900 190)">
        <rect x={0} y={0} width={360} height={110} rx={16} fill="#f4f4f4" stroke={OUT} strokeWidth={SW} />
        <rect x={20} y={74} width={320} height={18} rx={6} fill="#ccc" stroke={OUT} strokeWidth={3} />
        <circle cx={330} cy={30} r={7} fill={Math.floor(f / 12) % 2 ? '#3f3' : '#2a2'} />
        <text x={30} y={46} fill="#999" fontSize={20} fontFamily={FONT_UI}>ELECTRA-ISH 1987</text>
        {acStink &&
          [0, 1, 2, 3].map((i) => (
            <path key={i} d={`M ${60 + i * 80} 100 q 14 30 0 60 t 0 60`} stroke="#93b84a" strokeWidth={6} fill="none" opacity={0.55 + 0.35 * Math.sin(f * 0.25 + i)} transform={`translate(${Math.sin(f * 0.12 + i) * 8} 0)`} />
          ))}
      </g>
      {/* bathroom door */}
      <g transform={`translate(${1500 + ds} 0)`}>
        <rect x={0} y={300} width={250} height={500} fill="#e8e8f0" stroke={OUT} strokeWidth={SW} />
        <rect x={80} y={360} width={90} height={60} rx={10} fill="#4a90d9" stroke={OUT} strokeWidth={4} />
        <text x={125} y={402} textAnchor="middle" fill="#fff" fontSize={30} fontFamily={FONT_UI} fontWeight={800}>WC</text>
        <circle cx={30} cy={560} r={12} fill="#c0c0c0" stroke={OUT} strokeWidth={4} />
      </g>
      <rect x={1485} y={285} width={280} height={18} fill="#d0d0d8" stroke={OUT} strokeWidth={4} />
      {/* couch */}
      <g transform="translate(760 560)">
        <rect x={0} y={0} width={620} height={150} rx={30} fill="#3fa7a0" stroke={OUT} strokeWidth={SW} />
        <rect x={-30} y={60} width={680} height={150} rx={30} fill="#46b8b0" stroke={OUT} strokeWidth={SW} />
        <rect x={-50} y={40} width={70} height={190} rx={26} fill="#3fa7a0" stroke={OUT} strokeWidth={SW} />
        <rect x={600} y={40} width={70} height={190} rx={26} fill="#3fa7a0" stroke={OUT} strokeWidth={SW} />
      </g>
      {/* wall art: generic Eilat poster */}
      <rect x={1200} y={330} width={200} height={140} fill="#ffcf5a" stroke={OUT} strokeWidth={SW} />
      <circle cx={1300} cy={390} r={34} fill="#ff7b3a" />
      <path d="M 1200 440 Q 1300 410 1400 440 L 1400 470 L 1200 470 Z" fill="#2f8fd6" />
      <text x={1300} y={462} textAnchor="middle" fontSize={20} fontFamily={FONT_UI} fontWeight={800} fill="#fff">EILAT</text>
      {/* light tint */}
      {a > 0 && <rect width={1920} height={1080} fill={tint} opacity={a} />}
      {redAlert && <rect width={1920} height={1080} fill="#ff1a1a" opacity={0.18 + 0.18 * Math.sin(f * 0.8)} />}
    </g>
  );
};

/** Coffee table with bottles (foreground prop for the apartment). */
export const CoffeeTable: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-170} y={0} width={340} height={30} rx={8} fill="#8a5a3a" stroke={OUT} strokeWidth={SW} />
    <rect x={-150} y={30} width={20} height={80} fill="#6a4226" stroke={OUT} strokeWidth={4} />
    <rect x={130} y={30} width={20} height={80} fill="#6a4226" stroke={OUT} strokeWidth={4} />
    {[-110, -60, 40, 100].map((bx, i) => (
      <g key={i} transform={`translate(${bx} 0)`}>
        <rect x={-14} y={-80} width={28} height={80} rx={6} fill={['#2e7d32', '#c62828', '#90caf9', '#f9a825'][i]} stroke={OUT} strokeWidth={3} />
        <rect x={-6} y={-104} width={12} height={26} fill={['#2e7d32', '#c62828', '#90caf9', '#f9a825'][i]} stroke={OUT} strokeWidth={3} />
      </g>
    ))}
  </g>
);

// ───────────────────────── apartment building exterior (choir) ─────────────────────────
export const BuildingExterior: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={1920} height={1080} fill="#ff9e5e" />
    <rect width={1920} height={500} fill="#ffc98a" />
    <circle cx={1650} cy={200} r={80} fill="#fff1a8" />
    <rect x={460} y={120} width={1000} height={760} fill="#f1e2c4" stroke={OUT} strokeWidth={SW} />
    {Array.from({ length: 12 }, (_, i) => {
      const cx = 520 + (i % 4) * 230, cy = 170 + Math.floor(i / 4) * 220;
      const glow = i === 9;
      return (
        <g key={i}>
          <rect x={cx} y={cy} width={160} height={150} fill={glow ? '#fff2a0' : '#7ab6d9'} stroke={OUT} strokeWidth={4} />
          {glow && <rect x={cx - 30} y={cy - 30} width={220} height={210} fill="#fff6c0" opacity={0.25 + 0.15 * Math.sin(f * 0.4)} />}
        </g>
      );
    })}
    <rect y={880} width={1920} height={200} fill="#c9a77a" />
    <line x1={0} y1={880} x2={1920} y2={880} stroke={OUT} strokeWidth={SW} />
    <Palm x={260} y={900} f={f} />
    <Palm x={1660} y={900} f={f} s={1.1} />
  </g>
);

export const Palm: React.FC<{ x: number; y: number; f: number; s?: number }> = ({ x, y, f, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -14 0 Q -30 -200 10 -420 L 34 -420 Q 0 -200 14 0 Z" fill="#a0703a" stroke={OUT} strokeWidth={SW} />
    {[-70, -30, 10, 50, 100, 150].map((a, i) => (
      <path key={i} d="M 0 0 Q 80 -40 170 20 Q 90 -10 0 10 Z" fill="#3e9b48" stroke={OUT} strokeWidth={4} transform={`translate(22 -420) rotate(${a + Math.sin(f * 0.08 + i) * 4})`} />
    ))}
  </g>
);

// ───────────────────────── Mosh beach ─────────────────────────
export const Beach: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <defs>
      <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5ec8ff" />
        <stop offset="1" stopColor="#d8f3ff" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#bsky)" />
    <circle cx={260} cy={150} r={80} fill="#fff4a3" />
    {/* Edom mountains across the gulf */}
    <path d="M 0 470 L 160 380 L 300 430 L 470 330 L 640 420 L 820 350 L 1020 440 L 1200 360 L 1400 430 L 1600 340 L 1780 420 L 1920 380 L 1920 520 L 0 520 Z" fill="#d07a5a" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
    <rect y={500} width={1920} height={200} fill="#1f9ad6" stroke={OUT} strokeWidth={4} />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M ${(i * 230 + f * 3) % 2100 - 100} ${540 + (i % 3) * 45} q 25 -14 50 0 q 25 14 50 0`} stroke="#bfefff" strokeWidth={5} fill="none" />
    ))}
    {/* surf line */}
    <path d={`M 0 ${700 + Math.sin(f * 0.08) * 8} Q 480 ${680 + Math.sin(f * 0.08 + 1) * 10} 960 ${700 + Math.sin(f * 0.08 + 2) * 8} T 1920 ${700 + Math.sin(f * 0.08) * 8} L 1920 730 L 0 730 Z`} fill="#e9fbff" />
    <rect y={720} width={1920} height={360} fill="#f2d49a" />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={hash01(i, 3) * 1920} cy={760 + hash01(i, 5) * 300} r={3} fill="#d9b678" />)}
    {/* umbrellas */}
    {[{ x: 240, c: '#ff5d73' }, { x: 1700, c: '#ffd166' }].map((u) => (
      <g key={u.x} transform={`translate(${u.x} 820)`}>
        <line x1={0} y1={0} x2={0} y2={-260} stroke={OUT} strokeWidth={8} />
        <path d="M -170 -240 Q 0 -360 170 -240 Z" fill={u.c} stroke={OUT} strokeWidth={SW} />
        <path d="M -60 -268 Q 0 -350 60 -268" stroke="#fff" strokeWidth={10} fill="none" opacity={0.6} />
      </g>
    ))}
  </g>
);

export const Lounger: React.FC<{ x: number; y: number; c?: string }> = ({ x, y, c = '#ffffff' }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-150} y={-20} width={300} height={26} rx={10} fill={c} stroke={OUT} strokeWidth={SW} />
    <path d="M 100 -20 L 170 -120 L 196 -110 L 130 -12 Z" fill={c} stroke={OUT} strokeWidth={SW} />
    <line x1={-130} y1={6} x2={-130} y2={50} stroke={OUT} strokeWidth={8} />
    <line x1={130} y1={6} x2={130} y2={50} stroke={OUT} strokeWidth={8} />
  </g>
);

// ───────────────────────── Selina nightclub ─────────────────────────
export const Club: React.FC<{ f: number }> = ({ f }) => {
  const beams = ['#ff2bd6', '#2bf0ff', '#ffe02b', '#7a2bff'];
  return (
    <g>
      <rect width={1920} height={1080} fill="#14082a" />
      {beams.map((c, i) => {
        const a = Math.sin(f * 0.07 + i * 1.7) * 30;
        return <path key={i} d="M 0 0 L -120 1100 L 120 1100 Z" fill={c} opacity={0.18} transform={`translate(${300 + i * 440} 0) rotate(${a})`} />;
      })}
      {/* disco ball */}
      <line x1={960} y1={0} x2={960} y2={110} stroke="#999" strokeWidth={4} />
      <circle cx={960} cy={170} r={64} fill="#c9d3e0" stroke={OUT} strokeWidth={SW} />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={915 + (i % 4) * 22} y={128 + Math.floor(i / 4) * 22} width={18} height={18} fill={(i + Math.floor(f / 4)) % 3 ? '#e9f0ff' : '#8fa3c0'} />
      ))}
      {/* neon sign */}
      <g opacity={0.85 + 0.15 * Math.sin(f * 0.9)}>
        <rect x={1240} y={180} width={500} height={150} rx={30} fill="none" stroke="#ff4fd8" strokeWidth={10} />
        <text x={1490} y={285} textAnchor="middle" fill="#ffd0f5" stroke="#ff4fd8" strokeWidth={3} fontSize={92} fontFamily={FONT_TITLE} direction="rtl">
          סלינה
        </text>
      </g>
      {/* crowd silhouettes */}
      {Array.from({ length: 16 }, (_, i) => {
        const bx = 40 + i * 122, by = 760 + Math.abs(Math.sin(f * 0.45 + i)) * -20;
        return (
          <g key={i} fill="#2a1450">
            <circle cx={bx} cy={by - 160} r={40} />
            <rect x={bx - 50} y={by - 120} width={100} height={200} rx={40} />
            <rect x={bx - 70 + (i % 2) * 110} y={by - 230 + Math.sin(f * 0.45 + i) * 20} width={22} height={120} rx={11} />
          </g>
        );
      })}
      <rect y={820} width={1920} height={260} fill="#21103e" />
      {/* bar shelves */}
      <rect x={60} y={300} width={600} height={30} fill="#3a2060" stroke={OUT} strokeWidth={4} />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={80 + i * 58} y={230} width={30} height={70} rx={6} fill={['#2bf0ff', '#ff2bd6', '#ffe02b'][i % 3]} opacity={0.75} stroke={OUT} strokeWidth={3} />)}
    </g>
  );
};

export const BarCounter: React.FC = () => (
  <g>
    <rect x={-20} y={860} width={1960} height={240} fill="#3a1d63" stroke={OUT} strokeWidth={SW} />
    <rect x={-20} y={840} width={1960} height={40} rx={10} fill="#5c2f96" stroke={OUT} strokeWidth={SW} />
    <rect x={-20} y={880} width={1960} height={8} fill="#ff4fd8" opacity={0.8} />
  </g>
);

// ───────────────────────── hotel breakfast ─────────────────────────
export const Breakfast: React.FC<{ f: number }> = () => (
  <g>
    <rect width={1920} height={1080} fill="#f6e7c8" />
    <rect x={0} y={0} width={1920} height={120} fill="#e8d2a6" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={160 + i * 580} y={180} width={420} height={420} fill="#bfe8ff" stroke={OUT} strokeWidth={SW} />
        <path d={`M ${160 + i * 580} 520 L ${380 + i * 580} 430 L ${580 + i * 580} 510 L ${580 + i * 580} 600 L ${160 + i * 580} 600 Z`} fill="#2f8fd6" opacity={0.7} />
        <line x1={370 + i * 580} y1={180} x2={370 + i * 580} y2={600} stroke={OUT} strokeWidth={4} />
      </g>
    ))}
    <rect y={760} width={1920} height={320} fill="#b98a5a" />
    {/* buffet chef hat sign */}
    <text x={1760} y={90} textAnchor="start" direction="rtl" fill="#8a5a3a" fontSize={44} fontFamily={FONT_TITLE}>
      ארוחת בוקר — ״כלולה״*
    </text>
  </g>
);

export const BreakfastTable: React.FC = () => (
  <g>
    <rect x={260} y={760} width={1400} height={70} rx={14} fill="#fff" stroke={OUT} strokeWidth={SW} />
    <rect x={240} y={810} width={1440} height={300} fill="#e6e1d6" stroke={OUT} strokeWidth={SW} />
    {[520, 960, 1400].map((x, i) => (
      <g key={x}>
        <ellipse cx={x} cy={780} rx={110} ry={26} fill="#fafafa" stroke={OUT} strokeWidth={4} />
        <ellipse cx={x - 20} cy={772} rx={42} ry={14} fill="#ffd34d" stroke={OUT} strokeWidth={3} />
        <ellipse cx={x - 20} cy={770} rx={14} ry={6} fill="#ff9a1a" />
        <ellipse cx={x + 50} cy={770} rx={34} ry={14} fill="#d9a35a" stroke={OUT} strokeWidth={3} />
        {i === 1 && <rect x={x + 120} y={700} width={40} height={70} rx={6} fill="#ffb84d" stroke={OUT} strokeWidth={3} />}
      </g>
    ))}
  </g>
);

// ───────────────────────── Royal Garden pool ─────────────────────────
export const Pool: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={1920} height={1080} fill="#7fd6ff" />
    <circle cx={1700} cy={140} r={70} fill="#fff4a3" />
    <rect x={240} y={140} width={1440} height={420} fill="#f7e1b8" stroke={OUT} strokeWidth={SW} />
    {Array.from({ length: 24 }, (_, i) => (
      <rect key={i} x={280 + (i % 8) * 175} y={180 + Math.floor(i / 8) * 120} width={110} height={80} fill="#5fb7e0" stroke={OUT} strokeWidth={3} />
    ))}
    <text x={960} y={130} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={54} fill="#7a5a2a" direction="rtl">
      רויאל גארדן
    </text>
    <rect y={560} width={1920} height={520} fill="#efe3c8" />
    <path d="M 160 640 L 1760 640 L 1880 900 L 40 900 Z" fill="#2fb8e8" stroke={OUT} strokeWidth={SW} />
    {Array.from({ length: 12 }, (_, i) => (
      <path key={i} d={`M ${200 + ((i * 140 + f * 2) % 1500)} ${680 + (i % 4) * 50} q 20 -8 40 0 t 40 0`} stroke="#c9f4ff" strokeWidth={4} fill="none" />
    ))}
    <Palm x={120} y={620} f={f} />
    <Palm x={1800} y={620} f={f} s={0.95} />
  </g>
);

// ───────────────────────── Herods exterior ─────────────────────────
export const Herods: React.FC<{ f: number; storm?: number }> = ({ f, storm = 0 }) => {
  const sky = storm > 0 ? '#5d6475' : '#8fd8ff';
  return (
    <g>
      <rect width={1920} height={1080} fill={sky} />
      {storm > 0 &&
        [0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={(i * 560 + f * 2) % 2300 - 200} cy={110 + (i % 2) * 50} rx={320} ry={90} fill="#3d4352" stroke={OUT} strokeWidth={4} opacity={storm} />
        ))}
      {/* palace-like facade */}
      <rect x={300} y={300} width={1320} height={540} fill="#f2d7a0" stroke={OUT} strokeWidth={SW} />
      {[460, 960, 1460].map((x, i) => (
        <g key={x}>
          <path d={`M ${x - 110} 300 Q ${x} ${i === 1 ? 70 : 150} ${x + 110} 300 Z`} fill={i === 1 ? '#e0a94a' : '#e9c27a'} stroke={OUT} strokeWidth={SW} />
          <line x1={x} y1={i === 1 ? 110 : 180} x2={x} y2={i === 1 ? 60 : 140} stroke={OUT} strokeWidth={5} />
        </g>
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M ${360 + i * 180} 840 L ${360 + i * 180} 560 Q ${420 + i * 180} 480 ${480 + i * 180} 560 L ${480 + i * 180} 840 Z`} fill="#c98f4a" stroke={OUT} strokeWidth={4} />
      ))}
      <text x={960} y={410} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={60} fill="#8a5a1a" direction="rtl">
        הרודס
      </text>
      <rect y={840} width={1920} height={240} fill="#c8b89a" />
      <line x1={0} y1={840} x2={1920} y2={840} stroke={OUT} strokeWidth={SW} />
      <Palm x={180} y={860} f={f} />
      <Palm x={1740} y={860} f={f} />
      {storm > 0 && <rect width={1920} height={1080} fill="#1a2030" opacity={0.35 * storm} />}
    </g>
  );
};

export const Rain: React.FC<{ f: number; amount: number; flash?: number }> = ({ f, amount, flash = 0 }) => (
  <g>
    {Array.from({ length: Math.floor(220 * amount) }, (_, i) => {
      const x = hash01(i, 1) * 2200 - 140;
      const sp = 40 + hash01(i, 2) * 25;
      const y = ((hash01(i, 3) * 1200 + f * sp) % 1250) - 120;
      return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 46} stroke="#d8e8ff" strokeWidth={3} opacity={0.6} />;
    })}
    {flash > 0 && <rect width={1920} height={1080} fill="#fff" opacity={flash} />}
  </g>
);

export const Taxi: React.FC<{ x: number; y: number; f: number; doorOpen?: boolean }> = ({ x, y, f }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -300 0 L -300 -100 L -200 -110 L -120 -200 L 140 -200 L 220 -110 L 300 -100 L 300 0 Z" fill="#ffd400" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    <rect x={-60} y={-240} width={120} height={40} rx={8} fill="#222" stroke={OUT} strokeWidth={4} />
    <text x={0} y={-212} textAnchor="middle" fill="#ffd400" fontSize={26} fontFamily={FONT_UI} fontWeight={800}>מונית</text>
    <path d="M -180 -110 L -110 -185 L 0 -185 L 0 -110 Z" fill="#a8e0ff" stroke={OUT} strokeWidth={4} />
    <path d="M 20 -110 L 20 -185 L 130 -185 L 195 -110 Z" fill="#a8e0ff" stroke={OUT} strokeWidth={4} />
    {[-180, 180].map((wx) => (
      <g key={wx} transform={`translate(${wx} 0) rotate(${f * 30})`}>
        <circle r={56} fill="#222" stroke={OUT} strokeWidth={SW} />
        <circle r={24} fill="#bbb" />
      </g>
    ))}
  </g>
);

// ───────────────────────── bathrooms ─────────────────────────
export const Bathroom: React.FC<{ f: number; tile: string; tile2: string; w?: number }> = ({ tile, tile2, w = 640 }) => (
  <g>
    <rect width={w} height={1080} fill={tile} />
    {Array.from({ length: Math.ceil(w / 80) * 14 }, (_, i) => {
      const cols = Math.ceil(w / 80);
      const cx = (i % cols) * 80, cy = Math.floor(i / cols) * 80;
      return <rect key={i} x={cx} y={cy} width={80} height={80} fill={(i + Math.floor(i / cols)) % 2 ? tile : tile2} stroke="#00000022" strokeWidth={2} />;
    })}
    <rect y={860} width={w} height={220} fill="#d9d4cc" />
  </g>
);

/** Toilet seen from the front; the character sits on it. Tank part. */
export const ToiletBack: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-110} y={-430} width={220} height={170} rx={20} fill="#fafafa" stroke={OUT} strokeWidth={SW} />
    <rect x={60} y={-410} width={30} height={14} rx={6} fill="#c0c0c0" stroke={OUT} strokeWidth={3} />
  </g>
);
export const ToiletFront: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -130 -200 L 130 -200 Q 120 -90 60 -60 L 50 0 L -50 0 L -60 -60 Q -120 -90 -130 -200 Z" fill="#fafafa" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
  </g>
);
export const PaperHolder: React.FC<{ x: number; y: number; f: number; spin?: boolean }> = ({ x, y, f, spin }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-60} y={-8} width={120} height={16} rx={6} fill="#bbb" stroke={OUT} strokeWidth={4} />
    <g transform={`rotate(${spin ? f * 40 : 0})`}>
      <circle r={26} fill="#b48a5a" stroke={OUT} strokeWidth={4} />
      <circle r={9} fill="#5a3a1a" />
      <line x1={-20} y1={0} x2={20} y2={0} stroke="#8a6232" strokeWidth={4} />
    </g>
  </g>
);

// ───────────────────────── command center ─────────────────────────
export const CommandCenter: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={1920} height={1080} fill="#0a1a12" />
    <rect x={260} y={90} width={1400} height={600} rx={20} fill="#06110b" stroke="#2cff7a" strokeWidth={6} />
    {/* map of Eilat coast */}
    <path d="M 620 680 L 700 520 L 760 420 L 900 330 L 1040 300 L 1180 260 L 1300 200 L 1400 120 L 1660 120 L 1660 680 Z" fill="#0f3a22" stroke="#2cff7a" strokeWidth={4} />
    <circle cx={1050} cy={420} r={18 + (f % 24)} fill="none" stroke="#ff3b3b" strokeWidth={4} opacity={1 - (f % 24) / 24} />
    <circle cx={1050} cy={420} r={12} fill="#ff3b3b" />
    <text x={1080} y={410} fill="#ff6b6b" fontSize={30} fontFamily={FONT_UI} fontWeight={800} direction="rtl" textAnchor="end">
      יעד: שירותים
    </text>
    {/* radar */}
    <g transform="translate(470 360)">
      <circle r={150} fill="none" stroke="#2cff7a" strokeWidth={3} />
      <circle r={90} fill="none" stroke="#2cff7a" strokeWidth={2} opacity={0.6} />
      <line x1={0} y1={0} x2={150 * Math.cos(f * 0.15)} y2={150 * Math.sin(f * 0.15)} stroke="#2cff7a" strokeWidth={5} />
    </g>
    {/* consoles */}
    <rect y={760} width={1920} height={320} fill="#13261b" stroke={OUT} strokeWidth={SW} />
    {Array.from({ length: 24 }, (_, i) => (
      <rect key={i} x={120 + (i % 12) * 145} y={800 + Math.floor(i / 12) * 70} width={50} height={30} rx={6} fill={(i + Math.floor(f / 5)) % 4 === 0 ? '#ff3b3b' : (i + Math.floor(f / 7)) % 3 === 0 ? '#2cff7a' : '#225533'} />
    ))}
    <rect width={1920} height={1080} fill="#ff0000" opacity={Math.floor(f / 8) % 2 ? 0.1 : 0} />
  </g>
);

// ───────────────────────── aerial Eilat / sea ─────────────────────────
export const EilatAerial: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <defs>
      <linearGradient id="asky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4fb8ff" />
        <stop offset="1" stopColor="#d6f1ff" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#asky)" />
    <path d="M 0 520 L 200 420 L 380 470 L 560 380 L 760 450 L 1000 360 L 1220 450 L 1460 380 L 1700 460 L 1920 400 L 1920 600 L 0 600 Z" fill="#c8664a" stroke={OUT} strokeWidth={4} />
    {/* hotels skyline */}
    {Array.from({ length: 12 }, (_, i) => {
      const h = 80 + hash01(i, 9) * 140;
      return <rect key={i} x={1000 + i * 76} y={600 - h} width={64} height={h} fill={['#f2d7a0', '#ffffff', '#ffd9b0'][i % 3]} stroke={OUT} strokeWidth={3} />;
    })}
    <rect y={600} width={1920} height={480} fill="#1a8fd0" stroke={OUT} strokeWidth={4} />
    {Array.from({ length: 16 }, (_, i) => (
      <path key={i} d={`M ${(i * 170 + f * 2) % 2100 - 100} ${650 + (i % 5) * 80} q 25 -12 50 0 q 25 12 50 0`} stroke="#9fe4ff" strokeWidth={5} fill="none" />
    ))}
  </g>
);

export const Helicopter: React.FC<{ x: number; y: number; f: number; s?: number; rope?: number; withRoll?: boolean; rollDrop?: number }> = ({ x, y, f, s = 1, rope = 220, withRoll = true, rollDrop = 0 }) => (
  <g>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {withRoll && rollDrop === 0 && <line x1={0} y1={60} x2={0} y2={rope} stroke={OUT} strokeWidth={5} />}
      <path d="M -150 0 Q -150 -80 -40 -80 L 60 -80 Q 140 -80 140 0 Q 140 60 40 60 L -60 60 Q -150 60 -150 0 Z" fill="#3d6b3a" stroke={OUT} strokeWidth={SW} />
      <path d="M 40 -60 Q 120 -60 125 0 L 40 0 Z" fill="#a8e0ff" stroke={OUT} strokeWidth={4} />
      <rect x={-380} y={-30} width={240} height={30} rx={10} fill="#3d6b3a" stroke={OUT} strokeWidth={4} />
      <g transform={`translate(-370 -15) rotate(${f * 60})`}>
        <rect x={-50} y={-6} width={100} height={12} fill="#222" />
      </g>
      <rect x={-6} y={-110} width={12} height={30} fill="#222" />
      <ellipse cx={0} cy={-112} rx={260 * Math.abs(Math.cos(f * 1.7))} ry={10} fill="#222" opacity={0.85} />
      <line x1={-100} y1={60} x2={-120} y2={90} stroke={OUT} strokeWidth={6} />
      <line x1={80} y1={60} x2={100} y2={90} stroke={OUT} strokeWidth={6} />
      <line x1={-150} y1={90} x2={140} y2={90} stroke={OUT} strokeWidth={8} />
      <text x={-50} y={20} fill="#fff" fontSize={30} fontFamily={FONT_UI} fontWeight={800} direction="rtl" textAnchor="middle">
        יחידת חילוץ נייר
      </text>
      {withRoll && <GiantRoll x={0} y={rope + 90 + rollDrop} spin={rollDrop > 0 ? f * 12 : 0} />}
    </g>
  </g>
);

export const GiantRoll: React.FC<{ x: number; y: number; spin?: number; s?: number }> = ({ x, y, spin = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${spin}) scale(${s})`}>
    <rect x={-130} y={-90} width={260} height={180} rx={24} fill="#ffffff" stroke={OUT} strokeWidth={SW} />
    <ellipse cx={-130} cy={0} rx={30} ry={90} fill="#f3f3f3" stroke={OUT} strokeWidth={SW} />
    <ellipse cx={-130} cy={0} rx={10} ry={30} fill="#b48a5a" stroke={OUT} strokeWidth={3} />
    {[-60, 0, 60].map((lx) => <line key={lx} x1={lx} y1={-90} x2={lx} y2={90} stroke="#ddd" strokeWidth={3} strokeDasharray="8 8" />)}
    <path d="M 130 60 Q 170 120 150 200" stroke="#fff" strokeWidth={30} fill="none" />
    <path d="M 130 60 Q 170 120 150 200" stroke={OUT} strokeWidth={3} fill="none" strokeDasharray="1 0" opacity={0.3} />
  </g>
);

// ───────────────────────── mock documentary cave wall ─────────────────────────
export const CaveWall: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={1920} height={1080} fill="#8a6a4a" />
    {Array.from({ length: 60 }, (_, i) => (
      <ellipse key={i} cx={hash01(i, 1) * 1920} cy={hash01(i, 2) * 1080} rx={40 + hash01(i, 3) * 120} ry={20 + hash01(i, 4) * 60} fill={hash01(i, 5) > 0.5 ? '#7a5a3c' : '#9a7a58'} opacity={0.5} />
    ))}
    {/* torch flicker */}
    <rect width={1920} height={1080} fill="#ffb347" opacity={0.08 + 0.05 * Math.sin(f * 1.3)} />
    {/* painting: plate + three stick men bowing */}
    <g stroke="#5a1f0f" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.9}>
      <ellipse cx={1420} cy={600} rx={120} ry={40} />
      <path d="M 1420 520 L 1420 470 M 1380 530 L 1350 490 M 1460 530 L 1490 490" />
      {[600, 850, 1100].map((x) => (
        <g key={x}>
          <circle cx={x + 90} cy={430} r={36} />
          <path d={`M ${x} 700 L ${x} 560 L ${x + 70} 450 M ${x} 700 L ${x - 40} 800 M ${x} 700 L ${x + 40} 800 M ${x + 30} 510 L ${x + 120} 520`} />
        </g>
      ))}
      <path d="M 300 300 l 40 40 m 0 -40 l -40 40" />
      <path d="M 1700 260 q 30 -40 60 0 q 30 40 60 0" />
    </g>
  </g>
);

// ───────────────────────── WhatsApp-style group chat (original UI) ─────────────────────────
export const ChatPhone: React.FC<{ f: number; group: string; from: string; text: string; showMsg: number; typing?: boolean }> = ({ group, from, text, showMsg }) => (
  <g transform="translate(960 540)">
    <rect x={-330} y={-500} width={660} height={1000} rx={60} fill="#111" stroke="#444" strokeWidth={6} />
    <rect x={-300} y={-460} width={600} height={920} rx={30} fill="#e6ddd4" />
    <rect x={-300} y={-460} width={600} height={120} rx={30} fill="#1f6f5c" />
    <rect x={-300} y={-380} width={600} height={40} fill="#1f6f5c" />
    <circle cx={230} cy={-400} r={34} fill="#9ad0c2" />
    <text x={180} y={-410} textAnchor="start" direction="rtl" fill="#fff" fontSize={36} fontFamily={FONT_UI} fontWeight={800}>
      {group}
    </text>
    <text x={180} y={-370} textAnchor="start" direction="rtl" fill="#cdeee5" fontSize={22} fontFamily={FONT_UI}>
      ניר, רואי, מרום
    </text>
    <g opacity={Math.min(1, showMsg)} transform={`translate(0 ${(1 - Math.min(1, showMsg)) * 30})`}>
      <rect x={-230} y={-120} width={500} height={150} rx={22} fill="#fff" stroke="#00000022" strokeWidth={2} />
      <text x={250} y={-80} textAnchor="start" direction="rtl" fill="#d4572a" fontSize={26} fontFamily={FONT_UI} fontWeight={800}>
        {from}
      </text>
      <text x={250} y={-30} textAnchor="start" direction="rtl" fill="#111" fontSize={30} fontFamily={FONT_UI} fontWeight={500}>
        {text}
      </text>
      <text x={-210} y={14} fill="#888" fontSize={20} fontFamily={FONT_UI}>
        03:47
      </text>
    </g>
  </g>
);
