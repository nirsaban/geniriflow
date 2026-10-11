import React from 'react';
import { Stage, SpeedLines } from '../components/Stage';
import { Character, OUT } from '../characters/Character';
import { Breakfast, BreakfastTable } from '../backgrounds/Backgrounds';
import { useScene } from '../lib/timeline';
import { headY, push } from './common';
import { pop } from '../lib/anim';
import { FONT_TITLE, FONT_UI } from '../fonts';

/** The receipt. With `scream`, it grows a face and screams. */
const Receipt: React.FC<{ x: number; y: number; s: number; f: number; scream?: boolean }> = ({ x, y, s, f, scream }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${scream ? Math.sin(f * 1.4) * 4 : -4})`}>
    <path d="M -150 -220 L 150 -220 L 150 200 L 125 220 L 100 200 L 75 220 L 50 200 L 25 220 L 0 200 L -25 220 L -50 200 L -75 220 L -100 200 L -125 220 L -150 200 Z" fill="#fffef6" stroke={OUT} strokeWidth={6} />
    <text x={0} y={-170} textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={28} direction="rtl">מלון ״הים הכחול״</text>
    {[['חביתה', '89'], ['לחמנייה ×2', '64'], ['קפה הפוך ×3', '117'], ['״שירות״', '230']].map(([a, b], i) => (
      <g key={a}>
        <text x={130} y={-110 + i * 40} textAnchor="start" direction="rtl" fontFamily={FONT_UI} fontSize={26}>{a}</text>
        <text x={-130} y={-110 + i * 40} fontFamily={FONT_UI} fontSize={26}>{b} ₪</text>
      </g>
    ))}
    <line x1={-130} y1={65} x2={130} y2={65} stroke={OUT} strokeWidth={3} strokeDasharray="8 6" />
    {scream ? (
      <g>
        <circle cx={-55} cy={110} r={22} fill="#fff" stroke={OUT} strokeWidth={5} />
        <circle cx={55} cy={110} r={22} fill="#fff" stroke={OUT} strokeWidth={5} />
        <circle cx={-55} cy={112} r={6} fill={OUT} />
        <circle cx={55} cy={112} r={6} fill={OUT} />
        <ellipse cx={0} cy={165} rx={38} ry={30 + Math.abs(Math.sin(f * 0.9)) * 12} fill="#5a1620" stroke={OUT} strokeWidth={5} />
      </g>
    ) : (
      <text x={0} y={140} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={84} fill="#e02424">500 ₪</text>
    )}
  </g>
);

export const S09: React.FC = () => {
  const { f, at, since, latest } = useScene();
  const shot = latest(['s09_receipt', 's09_l1', 's09_l2', 's09_l3', 's09_l4', 's09_register', 's09_n1'])!;

  if (shot === 's09_register') {
    const r = since('s09_register');
    return (
      <Stage cam={{ zoom: 1 + r * 0.01, shake: 5 }}>
        <rect width={1920} height={1080} fill="#ffcf3a" />
        <SpeedLines f={f} color="#ff8a1a" opacity={0.6} />
        <Receipt x={960} y={560} s={1.8} f={f} scream />
      </Stage>
    );
  }

  const tableY = 1000;
  const cams: Record<string, { zoom: number; cx: number; cy: number; shake?: number }> = {
    s09_receipt: { zoom: 1.0, cx: 960, cy: 540 },
    s09_l1: { zoom: 2.0, cx: 960, cy: headY('nir', tableY) + 120, shake: 3 },
    s09_l2: { zoom: 1.9, cx: 1400, cy: headY('marom', tableY) + 100 },
    s09_l3: { zoom: 1.9, cx: 520, cy: headY('roee', tableY) + 100 },
    s09_l4: { zoom: 1.35, cx: 760, cy: 560 },
    s09_n1: { zoom: push(f, at('s09_n1'), at('s09_n1') + 90, 1.4, 1.6), cx: 960, cy: 600 },
  };
  const rp = pop(f, 12, 10);
  const paying = shot === 's09_n1';
  return (
    <Stage cam={cams[shot]}>
      <Breakfast f={f} />
      <Character id="roee" look="hotel" x={520} y={tableY} legs="none" turn={shot === 's09_l4' ? 0.3 : 0.1} expr={shot === 's09_l4' ? 'shock' : 'happy'} armR="sip" propR="drink" fx={shot === 's09_l3' ? ['shine'] : []} />
      <Character id="nir" look="hotel" x={960} y={tableY} legs="none" turn={shot === 's09_l4' ? -0.5 : 0} expr={paying ? 'sad' : shot === 's09_l1' || shot === 's09_l4' ? 'angry' : 'shock'} propR={paying ? 'phone' : shot === 's09_l1' ? 'bill' : undefined} armR={paying ? 'front' : shot === 's09_l1' ? 'front' : shot === 's09_l4' ? 'point' : undefined} armL={shot === 's09_l1' ? 'clutchHead' : undefined} fx={paying ? ['tears'] : shot === 's09_l1' || shot === 's09_l4' ? ['vein', 'redface'] : []} />
      <Character id="marom" look="hotel" x={1400} y={tableY - 10} legs="none" turn={-0.1} expr={shot === 's09_l2' ? 'angry' : 'shock'} armL={shot === 's09_l2' ? 'shrug' : undefined} armR={shot === 's09_l2' ? 'shrug' : undefined} />
      <BreakfastTable />
      {shot === 's09_receipt' && f > 12 && <Receipt x={960} y={600} s={0.6 * rp} f={f} />}
      {paying && (
        <g transform="translate(960 700)">
          <rect x={-110} y={-60} width={220} height={130} rx={14} fill="#333" stroke={OUT} strokeWidth={5} />
          <rect x={-90} y={-45} width={180} height={50} rx={6} fill="#9fe08a" />
          <text x={0} y={-10} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={30}>₪500.00</text>
          <text x={0} y={50} textAnchor="middle" fill="#fff" fontFamily={FONT_UI} fontSize={22} direction="rtl">תשלומים? 36</text>
        </g>
      )}
    </Stage>
  );
};
