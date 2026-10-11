import React from 'react';
import { Stage } from '../components/Stage';
import { Character } from '../characters/Character';
import { Beach, Lounger } from '../backgrounds/Backgrounds';
import { CounterPop } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { walk, push, headY } from './common';
import type { ExtraId } from '../characters/designs';

const GIRLS: { id: ExtraId; x: number }[] = [
  { id: 'girlA', x: 1400 },
  { id: 'girlB', x: 1560 },
  { id: 'girlC', x: 1720 },
  { id: 'girlD', x: 1880 },
];

export const S05: React.FC = () => {
  const { f, at, since, latest } = useScene();
  const shot = latest(['s05_beach', 's05_l1', 's05_l2', 's05_l3', 's05_look', 's05_l4', 's05_l5', 's05_approach', 's05_l6', 's05_l7', 's05_l8', 's05_silence', 's05_l9', 's05_count'])!;

  const guardW = walk(f, 4, at('s05_l1') + 4, 2150, 1500);
  const guardVisible = f < at('s05_l4');
  const roeeUp = f >= at('s05_l4');
  const roeeW = walk(f, at('s05_approach'), at('s05_l6') - 2, 500, 1180);
  const girlsVisible = f >= at('s05_l4');
  const leave = since('s05_silence');
  const girlsLeaving = leave > 18;
  const girlX = (x: number) => (girlsLeaving ? x + (leave - 18) * 22 : x);
  const girlExpr = f < at('s05_silence') ? (shot === 's05_approach' ? 'laugh' : 'happy') : leave < 10 ? 'neutral' : 'disgust';

  const cams: Record<string, { zoom: number; cx: number; cy: number; shake?: number }> = {
    s05_beach: { zoom: push(f, 0, at('s05_l1'), 1.1, 1.0), cx: 960, cy: 560 },
    s05_l1: { zoom: 1.35, cx: 1350, cy: 620 },
    s05_l2: { zoom: 2.1, cx: 1200, cy: headY('marom', 1010) + 120 },
    s05_l3: { zoom: 2.1, cx: 850, cy: headY('nir', 1010) + 120 },
    s05_look: { zoom: 2.8, cx: 1500, cy: headY('marom', 990) - 30 },
    s05_l4: { zoom: 1.6, cx: 560, cy: 560 },
    s05_l5: { zoom: 1.8, cx: 760, cy: 640 },
    s05_approach: { zoom: 1.0, cx: 960, cy: 540 },
    s05_l6: { zoom: 1.5, cx: 1330, cy: 560 },
    s05_l7: { zoom: 2.2, cx: 1400, cy: headY('nir', 1000, 0.9) + 60 },
    s05_l8: { zoom: 1.7, cx: 1220, cy: 520 },
    s05_silence: { zoom: 1.2, cx: 1300, cy: 560 },
    s05_l9: { zoom: 1.5, cx: 1000, cy: 640 },
    s05_count: { zoom: 1.0, cx: 960, cy: 540 },
  };

  // the guys on loungers (Roee leaves his)
  const sitY = 1010;
  return (
    <Stage cam={cams[shot]} overlay={<CounterPop f={f} start={at('s05_count')} label="בחורות שהוברחו" value={4} />}>
      <Beach f={f} />
      <Lounger x={500} y={940} c="#ffffff" />
      <Lounger x={850} y={940} c="#ffe08a" />
      <Lounger x={1200} y={940} c="#9fe0ff" />
      {!roeeUp && <Character id="roee" look="beach" x={500} y={sitY} legs="sit" turn={0.3} expr="smug" propR="drink" armR="front" />}
      <Character id="nir" look="beach" x={850} y={sitY} legs="sit" turn={shot === 's05_l5' ? -0.3 : 0.1} expr={shot === 's05_l3' || shot === 's05_l9' ? 'smug' : shot === 's05_l5' ? 'angry' : 'neutral'} propR={shot === 's05_l9' ? undefined : 'drink'} armR={shot === 's05_l9' ? (Math.floor(f / 6) % 2 ? 'pray' : 'front') : 'front'} armL={shot === 's05_l5' ? 'facepalm' : shot === 's05_l9' ? (Math.floor(f / 6) % 2 ? 'pray' : 'front') : undefined} />
      <Character id="marom" look="beach" x={1200} y={sitY} legs="sit" turn={guardVisible ? 0.4 : -0.1} expr={shot === 's05_l2' ? 'happy' : shot === 's05_look' ? 'panic' : 'neutral'} propR="drink" armR={shot === 's05_l2' ? 'sip' : 'front'} fx={shot === 's05_look' ? ['sweat'] : []} />
      {guardVisible && (
        <Character id="guard" x={guardW.x} y={990} legs={guardW.legs} phase={guardW.phase} turn={guardW.moving ? -1 : -0.3} crossed={!guardW.moving} expr={shot === 's05_look' ? 'disgust' : 'angry'} voice="guard" />
      )}
      {roeeUp && (
        <Character
          id="roee"
          look="beach"
          x={roeeW.x}
          y={1000}
          legs={roeeW.legs}
          phase={roeeW.phase}
          turn={roeeW.moving ? 1 : shot === 's05_l4' ? 0 : 0.4}
          armL={shot === 's05_l4' ? 'flex' : shot === 's05_l8' ? 'hips' : undefined}
          armR={shot === 's05_l4' ? 'flex' : shot === 's05_l8' ? 'hips' : shot === 's05_l6' ? 'wave' : undefined}
          expr={shot === 's05_silence' ? 'happy' : 'flirt'}
          fx={shot === 's05_l4' ? ['shine'] : shot === 's05_l6' ? ['hearts'] : []}
        />
      )}
      {girlsVisible &&
        GIRLS.map((g, i) => (
          <Character
            key={g.id}
            id={g.id}
            look="beach"
            x={girlX(g.x)}
            y={1000}
            scale={0.9}
            legs={girlsLeaving ? 'walk' : 'stand'}
            phase={f / 12 + i * 0.3}
            turn={girlsLeaving ? 1 : leave > 10 ? 0.4 : -0.35}
            expr={girlExpr}
            voice={i === 0 ? 'girl' : 'none'}
            armR={i === 1 && !girlsLeaving ? 'hips' : undefined}
          />
        ))}
    </Stage>
  );
};
