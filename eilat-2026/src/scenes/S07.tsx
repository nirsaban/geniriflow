import React from 'react';
import { Stage, Flash } from '../components/Stage';
import { Character, OUT } from '../characters/Character';
import { Club, BarCounter } from '../backgrounds/Backgrounds';
import { CounterPop } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { walk, headY } from './common';
import { FONT_TITLE } from '../fonts';

const Cocktail: React.FC<{ x: number; y: number; c: string }> = ({ x, y, c }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -40 -90 L 40 -90 L 4 -40 L 4 0 L 24 6 L -24 6 L -4 0 L -4 -40 Z" fill={c} stroke={OUT} strokeWidth={4} opacity={0.9} />
    <circle cx={30} cy={-92} r={10} fill="#7ed957" stroke={OUT} strokeWidth={3} />
  </g>
);

export const S07: React.FC = () => {
  const { f, at, since, latest } = useScene();
  const shot = latest(['s07_club', 's07_l1', 's07_l2', 's07_l3', 's07_terror', 's07_l4', 's07_smash', 's07_l5', 's07_n1', 's07_count'])!;

  // ── smash cut: the women are already leaving ──
  if (shot === 's07_smash' || shot === 's07_l5') {
    const s = since('s07_smash');
    return (
      <Stage cam={{ zoom: shot === 's07_l5' ? 2.0 : 1.15, cx: shot === 's07_l5' ? 760 : 960, cy: shot === 's07_l5' ? headY('roee', 1000) + 70 : 560 }}>
        <Club f={f} />
        {(['girlA', 'girlB', 'girlD'] as const).map((g, i) => (
          <Character key={g} id={g} look="club" x={1100 + i * 170 + s * 16} y={1000} scale={0.92} legs="walk" phase={f / 11 + i * 0.3} turn={1} headTurn={-0.6} expr="disgust" />
        ))}
        <Character id="roee" look="club" x={760} y={1000} expr={shot === 's07_l5' ? 'panic' : 'shock'} armL="shrug" armR="shrug" fx={shot === 's07_l5' ? ['sweat'] : []} />
        <Flash opacity={Math.max(0, 0.8 - s / 5)} />
      </Stage>
    );
  }

  // ── narrator: the bouncer now warns women in advance ──
  if (shot === 's07_n1' || shot === 's07_count') {
    const n = since('s07_n1');
    return (
      <Stage cam={{ zoom: 1.25, cx: 960, cy: 560 }} overlay={<CounterPop f={f} start={at('s07_count')} label="בחורות שהוברחו" value={13} />}>
        <Club f={f} />
        <Character id="guard" x={760} y={1000} expr="angry" armR="pointUp" armL="front" voice="none" />
        <g transform="translate(560 560) rotate(-6)">
          <rect x={-150} y={-90} width={300} height={170} rx={10} fill="#fffbe6" stroke={OUT} strokeWidth={6} />
          <text x={0} y={-20} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={46} fill="#e02424" direction="rtl">
            זהירות!
          </text>
          <text x={0} y={42} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={40} fill="#111" direction="rtl">
            רואי בפנים
          </text>
        </g>
        {(['girlC', 'girlB'] as const).map((g, i) => {
          const back = n > 30;
          return <Character key={g} id={g} look="club" x={1300 + i * 180 + (back ? (n - 30) * 14 : 0)} y={1000} scale={0.92} legs={back ? 'walk' : 'stand'} phase={f / 11} turn={back ? 1 : -0.5} expr={n > 18 ? 'shock' : 'happy'} />;
        })}
      </Stage>
    );
  }

  const roeeW = walk(f, at('s07_l4') + 6, at('s07_smash'), 1380, 300, 12);
  const cams: Record<string, { zoom: number; cx: number; cy: number; shake?: number }> = {
    s07_club: { zoom: 1.0, cx: 960, cy: 540 },
    s07_l1: { zoom: 1.9, cx: 760, cy: headY('nir', 1000) + 110 },
    s07_l2: { zoom: 1.9, cx: 1060, cy: headY('marom', 990) + 90, shake: 2 },
    s07_l3: { zoom: 1.5, cx: 1200, cy: 560 },
    s07_terror: { zoom: 2.2, cx: 910, cy: headY('nir', 1000) + 40 },
    s07_l4: { zoom: 1.3, cx: 1000, cy: 560 },
  };
  const terror = shot === 's07_terror' || shot === 's07_l4';
  return (
    <Stage cam={cams[shot]}>
      <Club f={f} />
      <Character id="nir" look="club" x={760} y={1000} legs="none" turn={terror ? 0.5 : 0} expr={shot === 's07_l1' ? 'shock' : terror ? 'panic' : 'neutral'} propR={shot === 's07_l1' ? 'bill' : undefined} armR={shot === 's07_l1' ? 'front' : shot === 's07_l4' ? 'reach' : undefined} fx={terror ? ['sweat'] : shot === 's07_l1' ? ['vein'] : []} />
      <Character id="marom" look="club" x={1060} y={990} legs="none" turn={terror ? -0.5 : 0} expr={shot === 's07_l2' ? 'angry' : terror ? 'panic' : 'neutral'} armL={shot === 's07_l2' ? 'shrug' : undefined} armR={shot === 's07_l2' ? 'shrug' : undefined} fx={terror ? ['sweat'] : []} />
      <Character id="roee" look="club" x={roeeW.x} y={1000} legs={roeeW.moving ? 'walk' : 'none'} phase={roeeW.phase} turn={roeeW.moving ? -1 : -0.3} expr={shot === 's07_l3' || roeeW.moving ? 'flirt' : 'happy'} armR={shot === 's07_l3' ? 'point' : undefined} fx={roeeW.moving ? ['shine'] : []} />
      <BarCounter />
      <Cocktail x={700} y={850} c="#ff4fd8" />
      <Cocktail x={1000} y={850} c="#2bf0ff" />
      <Cocktail x={1300} y={850} c="#ffe02b" />
    </Stage>
  );
};
