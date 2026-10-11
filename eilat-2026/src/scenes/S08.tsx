import React from 'react';
import { Stage, Flash, Letterbox } from '../components/Stage';
import { Character, OUT } from '../characters/Character';
import { Apartment, CaveWall } from '../backgrounds/Backgrounds';
import { Gong, TwoHourClock } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { walk, push, headY } from './common';
import { CeremonyRoom } from './S04';
import { BathroomShot } from './S03';
import { keys, ramp } from '../lib/anim';
import { FONT_UI, FONT_TITLE } from '../fonts';

export const S08: React.FC = () => {
  const { f, at, since, latest } = useScene();
  const shot = latest(['s08_return', 's08_gong', 's08_l1', 's08_l2', 's08_l3', 's08_bow', 's08_cave', 's08_n1', 's08_l4'])!;

  if (shot === 's08_return') {
    const w = walk(f, 0, at('s08_gong'), -300, 700, 16);
    return (
      <Stage cam={{ zoom: 1.0 }}>
        <Apartment f={f} light="night" acStink />
        {(['roee', 'marom', 'nir'] as const).map((id, i) => (
          <Character key={id} id={id} look="club" x={w.x + i * 230} y={990} legs="walk" phase={w.phase + i * 0.2} turn={1} expr="hungover" lean={Math.sin(f * 0.2 + i) * 6} />
        ))}
        <g transform="translate(1560 300) scale(0.6)">
          <TwoHourClock x={0} y={0} p={ramp(f, 6, at('s08_gong') - 2)} fromHour={1} />
        </g>
      </Stage>
    );
  }

  if (shot === 's08_gong') {
    const g = since('s08_gong');
    return (
      <Stage cam={{ zoom: 1.15, shake: g > 3 ? Math.max(0, 9 - g * 0.4) : 0 }}>
        <rect width={1920} height={1080} fill="#14091f" />
        <Gong x={960} y={600} f={g} hitF={3} s={1.3} />
        <Flash opacity={g >= 3 && g < 8 ? 0.7 - (g - 3) * 0.14 : 0} />
      </Stage>
    );
  }

  if (shot === 's08_l2') {
    return (
      <Stage cam={{ zoom: 1.9, cx: 1000, cy: 640, shake: 3 }}>
        <BathroomShot f={f} who="nir" look="club" expr="strain" arms="out" fx={['sweat', 'redface']} tile="#e3c6e8" tile2="#d4b0db" />
      </Stage>
    );
  }

  if (shot === 's08_cave' || shot === 's08_n1') {
    const c = f - at('s08_cave');
    return (
      <Stage cam={{ zoom: push(f, at('s08_cave'), at('s08_l4'), 1.25, 1.0), cx: 1000, cy: 560 }} overlay={
        <g>
          <Letterbox amount={1} />
          <g transform="translate(1860 200)">
            <rect x={-560} y={-50} width={560} height={74} fill="#000" opacity={0.7} />
            <rect x={-8} y={-50} width={8} height={74} fill="#ffd34d" />
            <text x={-24} y={0} textAnchor="start" direction="rtl" fill="#fff" fontFamily={FONT_UI} fontWeight={800} fontSize={32}>
              שחזור היסטורי · אילת, 2026 לספירה
            </text>
          </g>
          <text x={60} y={80} fill="#fff" opacity={0.8} fontFamily={FONT_TITLE} fontSize={34}>
            {c % 48 < 24 ? '● REC' : '○ REC'}
          </text>
        </g>
      }>
        <CaveWall f={f} />
      </Stage>
    );
  }

  // ceremony room shots (Nir joins for the bow)
  const b = since('s08_bow');
  const bow = shot === 's08_bow' ? keys(b, [[0, 0], [16, 0], [24, 1], [40, 1], [50, 0.3]]) : 0;
  const nirW = walk(f, at('s08_bow'), at('s08_bow') + 16, 1700, 420, 5);
  const nirIn = f >= at('s08_bow');
  const cams: Record<string, { zoom: number; cx: number; cy: number }> = {
    s08_l1: { zoom: 2.0, cx: 900, cy: headY('marom', 990) + 60 },
    s08_l3: { zoom: 2.1, cx: 720, cy: headY('roee', 990) + 60 },
    s08_bow: { zoom: push(f, at('s08_bow'), at('s08_cave'), 1.0, 1.12), cx: 1000, cy: 560 },
    s08_l4: { zoom: 1.7, cx: 640, cy: 520 },
  };
  if (shot === 's08_l4') {
    return (
      <Stage cam={cams.s08_l4}>
        <Apartment f={f} light="night" acStink />
        <Character id="roee" look="club" x={300} y={990} turn={0.3} expr="smug" armL="shrug" armR="shrug" />
        <Character id="marom" look="club" x={980} y={990} turn={-0.3} expr="smug" armL="shrug" armR="shrug" />
        <Character id="nir" look="club" x={640} y={1000} expr="angry" propR="tube" armR="pointUp" fx={['vein', 'redface']} />
      </Stage>
    );
  }
  return (
    <Stage cam={cams[shot]}>
      <CeremonyRoom
        f={f}
        look="club"
        light="night"
        bow={bow}
        exprs={{ nir: nirIn ? 'strain' : 'solemn' }}
        extra={{
          nir: nirIn ? { x: nirW.x, legs: nirW.moving ? 'run' : 'stand', phase: f / 5, turn: nirW.moving ? -1 : 1 } : { opacity: 0 },
          roee: shot === 's08_l3' ? { turn: 0.5, armR: 'pray' } : {},
          marom: shot === 's08_l1' ? { turn: 0.5, armR: 'point' } : {},
        }}
      />
      {shot === 's08_bow' && (
        <g opacity={0.5}>
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M ${300 + i * 300} -20 L ${380 + i * 300} -20 L ${560 + i * 300} 1100 L ${420 + i * 300} 1100 Z`} fill="#fff7c0" opacity={0.25} />
          ))}
        </g>
      )}
      <rect x={0} y={0} width={0} height={0} stroke={OUT} />
    </Stage>
  );
};
