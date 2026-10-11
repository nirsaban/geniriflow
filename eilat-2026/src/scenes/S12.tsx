import React from 'react';
import { Stage } from '../components/Stage';
import { Character } from '../characters/Character';
import { Herods, Rain, Taxi } from '../backgrounds/Backgrounds';
import { CounterPop } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { headY } from './common';
import { ramp } from '../lib/anim';

export const S12: React.FC = () => {
  const { f, at, since, latest } = useScene();
  const shot = latest(['s12_pose', 's12_l1', 's12_l2', 's12_rain', 's12_l3', 's12_run', 's12_count'])!;
  const storm = ramp(f, at('s12_rain'), at('s12_rain') + 14);
  const r = since('s12_rain');
  const flash = r >= 0 && r < 10 ? (r < 3 ? 0.8 : r > 5 && r < 7 ? 0.5 : 0) : 0;
  const run = since('s12_run');
  const running = run >= 0;
  const cams: Record<string, { zoom: number; cx: number; cy: number; shake?: number }> = {
    s12_pose: { zoom: 1.05, cx: 960, cy: 560 },
    s12_l1: { zoom: 1.9, cx: 700, cy: headY('nir', 1000) + 110 },
    s12_l2: { zoom: 1.9, cx: 1260, cy: headY('marom', 990) + 90 },
    s12_rain: { zoom: 1.0, cx: 960, cy: 540, shake: r < 12 ? 8 : 0 },
    s12_l3: { zoom: 1.8, cx: 980, cy: headY('roee', 1000) + 80 },
    s12_run: { zoom: 1.0, cx: 960, cy: 540 },
    s12_count: { zoom: 1.0, cx: 960, cy: 540 },
  };
  const rx = (x0: number, sp: number) => (running ? x0 + run * sp : x0);
  // the woman under the awning escapes into a taxi
  const girlIn = run > 40;
  const taxiX = run > 48 ? 1560 + (run - 48) * 30 : 1560;
  const wet = storm > 0.5;
  return (
    <Stage cam={cams[shot]} overlay={<CounterPop f={f} start={at('s12_count')} label="בחורות שהוברחו" value={20} />}>
      <Herods f={f} storm={storm} />
      {running && <Taxi x={taxiX} y={1010} f={run > 48 ? f : 0} />}
      {running && !girlIn && <Character id="girlB" look="hotel" x={1500 + Math.max(0, run - 26) * 4} y={1000} scale={0.9} propR="umbrella" armR="front" turn={run > 26 ? 1 : -0.4} legs={run > 26 ? 'walk' : 'stand'} phase={f / 9} expr={run > 20 ? 'shock' : 'neutral'} />}
      <Character id="marom" look="hotel" x={rx(1260, 9)} y={990} legs={running ? 'run' : 'stand'} phase={f / 6} turn={running ? 1 : -0.2} propR={wet ? 'sunglasses' : undefined} armR={wet ? 'pointUp' : 'hips'} armL="hips" expr={shot === 's12_l2' ? 'disgust' : wet ? 'panic' : 'smug'} fx={wet ? ['sweat'] : []} />
      <Character id="nir" look="hotel" x={rx(700, 8)} y={1000} legs={running ? 'run' : 'stand'} phase={f / 6 + 0.3} turn={running ? 1 : 0.1} crossed={!wet} propR={wet ? 'laptop' : undefined} propL={undefined} armR={wet ? 'clutchHead' : undefined} armL={wet ? 'clutchHead' : undefined} expr={shot === 's12_l1' ? 'smug' : wet ? 'panic' : 'happy'} />
      <Character id="roee" look="hotel" x={running ? Math.min(1380, 980 + run * 14) : 980} y={1000} legs={running && run < 30 ? 'run' : 'stand'} phase={f / 6 + 0.6} turn={running ? 1 : 0} armL={shot === 's12_l3' ? 'up' : running && run > 30 ? 'wave' : 'hips'} armR={shot === 's12_l3' ? 'up' : 'hips'} expr={shot === 's12_l3' ? 'angry' : running ? (girlIn ? 'sad' : 'flirt') : 'flirt'} fx={shot === 's12_pose' ? ['shine'] : shot === 's12_l3' ? ['vein'] : []} />
      {storm > 0 && <Rain f={f} amount={storm} flash={flash} />}
    </Stage>
  );
};
