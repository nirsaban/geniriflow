import React from 'react';
import { Stage } from '../components/Stage';
import { Character } from '../characters/Character';
import { Pool, Lounger } from '../backgrounds/Backgrounds';
import { CounterPop } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { walk, headY } from './common';

const MIME = ['A', 'E', 'O', 'C', 'M', 'A', 'E'];

export const S10: React.FC = () => {
  const { f, at, since, latest } = useScene();
  const shot = latest(['s10_pool', 's10_l1', 's10_l2', 's10_approach', 's10_l3', 's10_l4', 's10_l5', 's10_count'])!;
  const a = since('s10_approach');
  const roeeW = walk(f, at('s10_approach'), at('s10_approach') + 22, 560, 1240, 12);
  const talking = shot === 's10_approach' && a > 22 && a < 42;
  const girlsUp = shot !== 's10_pool' && shot !== 's10_l1' && shot !== 's10_l2' && a > 42;
  const gx = girlsUp ? (a - 42) * 20 : 0;
  const back = f >= at('s10_l3');
  const roeeX = back ? 560 : roeeW.x;

  const cams: Record<string, { zoom: number; cx: number; cy: number }> = {
    s10_pool: { zoom: 1.0, cx: 960, cy: 540 },
    s10_l1: { zoom: 1.7, cx: 560, cy: headY('roee', 1000) + 160 },
    s10_l2: { zoom: 1.9, cx: 860, cy: headY('nir', 1020) + 130 },
    s10_approach: { zoom: 1.2, cx: 1250, cy: 580 },
    s10_l3: { zoom: 1.6, cx: 900, cy: 620 },
    s10_l4: { zoom: 1.9, cx: 560, cy: headY('roee', 1000) + 110 },
    s10_l5: { zoom: 1.9, cx: 860, cy: headY('nir', 1020) + 130 },
    s10_count: { zoom: 1.0, cx: 960, cy: 540 },
  };
  return (
    <Stage cam={cams[shot]} overlay={<CounterPop f={f} start={at('s10_count')} label="בחורות שהוברחו" value={19} />}>
      <Pool f={f} />
      <Lounger x={860} y={960} c="#fff" />
      <Lounger x={1160} y={960} c="#ffe08a" />
      <Lounger x={1600} y={960} c="#ff9ecb" />
      <Character id="nir" look="pool" x={860} y={1030} legs="sit" turn={0.2} expr={shot === 's10_l2' || shot === 's10_l5' ? 'smug' : 'neutral'} armR="front" propR="drink" />
      <Character id="marom" look="pool" x={1160} y={1030} legs="sit" turn={-0.2} expr={shot === 's10_l3' ? 'disgust' : 'hungover'} armL={shot === 's10_l3' ? 'shrug' : undefined} />
      {!girlsUp || gx < 900 ? (
        <>
          <Character id="girlB" look="pool" x={1540 + gx} y={1000} scale={0.9} legs={girlsUp ? 'walk' : 'stand'} phase={f / 11} turn={girlsUp ? 1 : -0.4} expr={girlsUp ? 'disgust' : a > 30 ? 'neutral' : 'happy'} />
          <Character id="girlD" look="pool" x={1720 + gx} y={1000} scale={0.9} legs={girlsUp ? 'walk' : 'stand'} phase={f / 11 + 0.4} turn={girlsUp ? 1 : -0.4} expr={girlsUp ? 'disgust' : a > 30 ? 'shock' : 'happy'} />
        </>
      ) : null}
      <Character
        id="roee"
        look="pool"
        x={roeeX}
        y={1000}
        legs={roeeW.moving && !back ? 'walk' : 'stand'}
        phase={roeeW.phase}
        turn={roeeW.moving && !back ? 1 : back ? 0.2 : 0.5}
        mouth={talking ? MIME[Math.floor(f / 3) % MIME.length] : undefined}
        expr={shot === 's10_l1' ? 'solemn' : girlsUp && !back ? 'shock' : 'flirt'}
        armL={shot === 's10_l1' ? 'pray' : shot === 's10_l4' ? 'hips' : talking ? 'shrug' : undefined}
        armR={shot === 's10_l1' ? 'pray' : shot === 's10_l4' ? 'hips' : talking ? 'wave' : undefined}
        fx={shot === 's10_l1' ? ['shine'] : shot === 's10_l4' ? ['hearts'] : []}
      />
    </Stage>
  );
};
