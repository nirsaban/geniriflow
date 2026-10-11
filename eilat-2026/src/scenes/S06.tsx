import React from 'react';
import { Stage } from '../components/Stage';
import { Character, OUT } from '../characters/Character';
import { Apartment, CoffeeTable } from '../backgrounds/Backgrounds';
import { Banner, CounterPop, EmergencyLight } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { walk, push, headY } from './common';

const Mirror: React.FC<{ x: number; y: number; children?: React.ReactNode }> = ({ x, y, children }) => (
  <g>
    <defs>
      <clipPath id="mirrorclip">
        <ellipse cx={x} cy={y} rx={170} ry={230} />
      </clipPath>
    </defs>
    <ellipse cx={x} cy={y} rx={186} ry={246} fill="#d4a017" stroke={OUT} strokeWidth={6} />
    <ellipse cx={x} cy={y} rx={170} ry={230} fill="#cfeaf7" stroke={OUT} strokeWidth={4} />
    <g clipPath="url(#mirrorclip)">{children}</g>
    <path d={`M ${x - 110} ${y - 140} l 60 -50 M ${x - 100} ${y - 80} l 90 -80`} stroke="#fff" strokeWidth={10} opacity={0.6} />
  </g>
);

export const S06: React.FC = () => {
  const { f, at, since, latest, between } = useScene();
  const p = since('s06_prep');

  // ── prep montage: three quick vignettes ──
  if (f < at('s06_bell')) {
    const k = Math.min(2, Math.floor(p / 16));
    if (k === 0)
      return (
        <Stage cam={{ zoom: 1.6, cx: 800, cy: 640 }}>
          <Apartment f={f} light="evening" acStink />
          <Character id="nir" look="travel" x={800} y={1000} propR="broom" armR={[30 + Math.sin(f * 0.5) * 20, -60]} armL="front" expr="angry" turn={0.3} />
        </Stage>
      );
    if (k === 1) {
      const smack = Math.max(0, Math.sin(p * 0.55));
      return (
        <Stage cam={{ zoom: 1.6, cx: 1080, cy: 430, shake: smack > 0.9 ? 4 : 0 }}>
          <Apartment f={f} light="evening" acStink />
          <Character id="marom" look="travel" x={1080} y={990} propR="remote" armR={[110 + smack * 50, -20 - smack * 40]} expr="angry" gaze={[0, -1]} fx={['vein', 'sweat']} />
        </Stage>
      );
    }
    return (
      <Stage cam={{ zoom: 1.5, cx: 760, cy: 520 }}>
        <Apartment f={f} light="evening" />
        <Mirror x={520} y={500}>
          <Character id="roee" look="club" x={520} y={1040} scale={1.05} turn={-0.3} expr="flirt" armR="mirror" propR="comb" fx={['shine']} />
        </Mirror>
        <Character id="roee" look="club" x={930} y={1000} turn={-0.4} expr="flirt" armR="mirror" propR="comb" armL={p > 38 ? 'up' : 'down'} propL={p > 38 ? 'perfume' : undefined} />
        {p > 38 && <circle cx={860} cy={420} r={(p - 38) * 6} fill="#e8c8ff" opacity={Math.max(0, 0.6 - (p - 38) * 0.04)} />}
      </Stage>
    );
  }

  const girlsIn = walk(f, at('s06_bell'), at('s06_l1') + 6, -300, 0);
  const leaving = since('s06_l6') > 24;
  const leaveDx = leaving ? -(since('s06_l6') - 24) * 26 : 0;
  const alarm = between('s06_alarm', 's06_looks');
  const nirOut = f >= at('s06_n1');
  const nirW = walk(f, at('s06_n1') + 10, at('s06_n1') + 60, 1625, 1350, 18);
  const shot = latest(['s06_bell', 's06_l1', 's06_l2', 's06_l3', 's06_scream', 's06_l4', 's06_alarm', 's06_l5', 's06_looks', 's06_l6', 's06_slam', 's06_n1', 's06_count'])!;
  const cams: Record<string, { zoom: number; cx: number; cy: number; shake?: number }> = {
    s06_bell: { zoom: 1.05, cx: 900, cy: 560 },
    s06_l1: { zoom: 1.7, cx: 460, cy: headY('nir', 1000, 0.92) + 100 },
    s06_l2: { zoom: 1.6, cx: 1150, cy: 450 },
    s06_l3: { zoom: 1.8, cx: 880, cy: headY('roee', 1000) + 110 },
    s06_scream: { zoom: 1.4, cx: 1500, cy: 560, shake: 8 },
    s06_l4: { zoom: 1.25, cx: 1300, cy: 560, shake: 5 },
    s06_alarm: { zoom: 1.1, cx: 1100, cy: 540, shake: 3 },
    s06_l5: { zoom: 2.0, cx: 880, cy: headY('roee', 1000) + 60 },
    s06_looks: { zoom: 1.8, cx: 460, cy: headY('nir', 1000, 0.92) + 100 },
    s06_l6: { zoom: 1.4, cx: 600, cy: 600 },
    s06_slam: { zoom: 1.0, cx: 960, cy: 540, shake: 10 },
    s06_n1: { zoom: push(f, at('s06_n1'), at('s06_count'), 1.0, 1.15), cx: 1200, cy: 580 },
    s06_count: { zoom: 1.0, cx: 960, cy: 540 },
  };
  const girlExpr = shot === 's06_l1' || shot === 's06_l2' || shot === 's06_bell' ? 'happy' : shot === 's06_l3' ? 'smug' : shot === 's06_scream' || shot === 's06_l4' || shot === 's06_alarm' ? 'shock' : 'disgust';
  const lookEach = shot === 's06_looks' || shot === 's06_l6';

  return (
    <Stage
      cam={cams[shot]}
      overlay={
        <>
          {alarm && <Banner text="אירוע חירום מספר 2" f={f} start={at('s06_alarm') + 2} y={300} />}
          <CounterPop f={f} start={at('s06_count')} label="בחורות שהוברחו" value={8} />
        </>
      }
    >
      <Apartment f={f} light="evening" acStink redAlert={alarm} bathDoorShake={between('s06_scream', 's06_l5') ? 7 : 0} />
      {alarm && <EmergencyLight x={1625} y={270} f={f} />}
      {f < at('s06_slam') && (
        <>
          <Character id="girlA" look="hotel" x={340 + girlsIn.x + leaveDx} y={1000} scale={0.92} legs={girlsIn.moving || leaving ? 'walk' : 'stand'} phase={f / 12} turn={leaving ? -1 : lookEach ? 0.5 : 0.2} expr={girlExpr} voice="girl" />
          <Character id="girlC" look="hotel" x={520 + girlsIn.x + leaveDx} y={1000} scale={0.92} legs={girlsIn.moving || leaving ? 'walk' : 'stand'} phase={f / 12 + 0.4} turn={leaving ? -1 : lookEach ? -0.5 : 0.2} expr={girlExpr} voice="girl2" />
        </>
      )}
      <Character id="roee" look="club" x={880} y={1000} turn={shot === 's06_scream' || shot === 's06_l4' ? 0.6 : -0.35} expr={shot === 's06_l5' ? 'happy' : shot === 's06_n1' ? 'sad' : shot === 's06_scream' || shot === 's06_l4' ? 'shock' : 'flirt'} armL={shot === 's06_l3' || shot === 's06_l5' ? 'shrug' : undefined} armR={shot === 's06_l3' || shot === 's06_l5' ? 'shrug' : undefined} fx={shot === 's06_l5' ? ['sweat'] : shot === 's06_l3' ? ['shine'] : []} />
      <Character id="marom" look="club" x={1150} y={990} turn={shot === 's06_scream' || shot === 's06_l4' ? 0.6 : -0.2} expr={shot === 's06_l2' ? 'smug' : shot === 's06_n1' ? 'sad' : 'neutral'} armR={shot === 's06_l2' ? 'pointUp' : undefined} gaze={shot === 's06_l2' ? [0, -1] : undefined} />
      {nirOut && <Character id="nir" look="travel" x={nirW.x} y={990} legs={nirW.legs} phase={nirW.phase} turn={nirW.moving ? -1 : -0.2} expr="hungover" propR="tube" armR="front" fx={['stink']} />}
      <CoffeeTable x={360} y={905} />
    </Stage>
  );
};
