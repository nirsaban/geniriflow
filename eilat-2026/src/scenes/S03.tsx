import React from 'react';
import { Stage } from '../components/Stage';
import { Character, OUT } from '../characters/Character';
import { Apartment, CoffeeTable, Bathroom, ToiletBack, ToiletFront, PaperHolder } from '../backgrounds/Backgrounds';
import { Banner, EmergencyLight } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { walk, push, headY } from './common';
import { ramp } from '../lib/anim';

/** A suitcase tumbling along a parabola. */
const FlyingCase: React.FC<{ f: number; a: number; x0: number; x1: number; peak: number; y1: number; color: string }> = ({ f, a, x0, x1, peak, y1, color }) => {
  const t = Math.max(0, Math.min(1, (f - a) / 16));
  if (f < a) return null;
  const x = x0 + (x1 - x0) * t;
  const y = 700 - peak * 4 * t * (1 - t) + (y1 - 700) * t;
  return (
    <g transform={`translate(${x} ${y}) rotate(${t * 540})`}>
      <rect x={-60} y={-45} width={120} height={90} rx={12} fill={color} stroke={OUT} strokeWidth={5} />
      <rect x={-20} y={-60} width={40} height={18} rx={6} fill="none" stroke={OUT} strokeWidth={6} />
    </g>
  );
};

/** Champagne-style foam burst for bottles popping. */
const Foam: React.FC<{ f: number; a: number; x: number; y: number }> = ({ f, a, x, y }) => {
  const t = f - a;
  if (t < 0 || t > 24) return null;
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={x + Math.sin(i * 1.7) * t * 4} cy={y - t * 9 + t * t * 0.25 + i * 3} r={10 + i % 3 * 4} fill="#fffbe6" stroke={OUT} strokeWidth={2} opacity={1 - t / 24} />
      ))}
    </g>
  );
};

export const BathroomShot: React.FC<{ f: number; who: 'nir' | 'roee' | 'marom'; look?: 'travel' | 'hotel' | 'club' | 'beach'; expr?: React.ComponentProps<typeof Character>['expr']; tile?: string; tile2?: string; arms?: 'clutchHead' | 'out' | 'cover' | 'pray'; turn?: number; bow?: number; fx?: React.ComponentProps<typeof Character>['fx']; spin?: boolean }> = ({ f, who, look = 'travel', expr = 'panic', tile = '#bfe3e0', tile2 = '#a9d6d2', arms = 'clutchHead', turn = 0, bow = 0, fx = ['sweat'], spin = true }) => (
  <g>
    <Bathroom f={f} tile={tile} tile2={tile2} w={1920} />
    <ToiletBack x={960} y={980} />
    <Character id={who} look={look} x={960} y={1010} scale={0.95} legs="sit" expr={expr} armL={arms} armR={arms} fx={fx} turn={turn} bow={bow} />
    <ToiletFront x={960} y={1040} />
    <PaperHolder x={1320} y={620} f={f} spin={spin} />
  </g>
);

export const S03: React.FC = () => {
  const { f, at, between, since, latest } = useScene();
  const enterEnd = at('s03_l1');
  const nirW = walk(f, 0, enterEnd - 6, -250, 560, 6);
  const roeeW = walk(f, 4, enterEnd - 2, -400, 820, 6);
  const maromW = walk(f, 8, enterEnd, -550, 1090, 6);

  if (between('s03_l5', 's03_alarm')) {
    return (
      <Stage cam={{ zoom: push(f, at('s03_l5'), at('s03_alarm'), 1.7, 1.95), cx: 1040, cy: 640, shake: 4 }}>
        <BathroomShot f={f} who="nir" expr="panic" arms="clutchHead" />
      </Stage>
    );
  }

  const slamA = at('s03_slam');
  const nirToBath = walk(f, slamA - 10, slamA + 6, 560, 1625, 4);
  const nirGone = f >= slamA + 6;
  const alarm = f >= at('s03_alarm');
  const shot = latest(['s03_enter', 's03_l1', 's03_l2', 's03_l3', 's03_l4', 's03_slam', 's03_alarm']);
  const cams: Record<string, { zoom: number; cx: number; cy: number; shake?: number }> = {
    s03_enter: { zoom: 1.0, cx: 960, cy: 540, shake: f < 30 ? 3 : 0 },
    s03_l1: { zoom: push(f, at('s03_l1'), at('s03_l2'), 1.45, 1.6), cx: 1090, cy: 430 },
    s03_l2: { zoom: 1.9, cx: 560, cy: headY('nir', 990) + 60 },
    s03_l3: { zoom: 2.2, cx: 1090, cy: headY('marom', 990) + 40, shake: 2 },
    s03_l4: { zoom: 1.6, cx: 820, cy: headY('roee', 990) + 140 },
    s03_slam: { zoom: 1.05, cx: 1100, cy: 560 },
    s03_alarm: { zoom: 1.1, cx: 1200, cy: 540, shake: 3 },
  };
  const cam = cams[shot!];
  const lookAtDoor = f >= slamA + 8;

  return (
    <Stage cam={cam} overlay={alarm ? <Banner text="אירוע חירום מספר 1" f={f} start={at('s03_alarm') + 3} y={300} /> : null}>
      <Apartment f={f} light="day" acStink redAlert={alarm} bathDoorShake={f >= slamA + 4 && f < slamA + 16 ? 8 : alarm ? 3 : 0} />
      <FlyingCase f={f} a={10} x0={-100} x1={900} peak={260} y1={760} color="#5e60ce" />
      <FlyingCase f={f} a={18} x0={-100} x1={1250} peak={320} y1={770} color="#e76f51" />
      <Character id="marom" x={maromW.x} y={990} look="travel" legs={maromW.legs} phase={maromW.phase} turn={lookAtDoor ? 0.6 : shot === 's03_l1' ? 0.1 : 0} gaze={shot === 's03_l1' ? [0.2, -1] : undefined} armR={shot === 's03_l1' ? 'pointUp' : shot === 's03_l3' ? 'wave' : undefined} expr={alarm ? 'shock' : shot === 's03_l1' || shot === 's03_l3' ? 'angry' : 'disgust'} fx={shot === 's03_l3' ? ['sweat', 'redface'] : ['sweat']} />
      <Character id="roee" x={roeeW.x} y={990} look="travel" legs={roeeW.legs} phase={roeeW.phase} turn={lookAtDoor ? 0.6 : 0} armR={f > enterEnd ? 'up' : undefined} propR={f > enterEnd ? 'drink' : undefined} expr={alarm ? 'shock' : shot === 's03_l4' ? 'laugh' : 'happy'} />
      {!nirGone && (
        <Character id="nir" x={f >= slamA - 10 ? nirToBath.x : nirW.x} y={990} look="travel" legs={f >= slamA - 10 ? 'run' : nirW.legs} phase={f >= slamA - 10 ? f / 5 : nirW.phase} turn={f >= slamA - 10 ? 1 : 0} armL={shot === 's03_l2' ? 'shrug' : undefined} armR={shot === 's03_l2' ? 'shrug' : undefined} expr={f >= slamA - 10 ? 'strain' : shot === 's03_l2' ? 'angry' : 'neutral'} fx={f >= slamA - 10 ? ['sweat'] : []} />
      )}
      <CoffeeTable x={360} y={905} />
      <Foam f={f} a={31} x={250} y={800} />
      <Foam f={f} a={38} x={460} y={800} />
      <Foam f={f} a={at('s03_l4') + 2} x={300} y={800} />
      {alarm && <EmergencyLight x={1625} y={270} f={f} />}
      {shot === 's03_slam' && f >= slamA + 6 && f < slamA + 18 && (
        <text x={1625} y={330 - ramp(f, slamA + 6, slamA + 18) * 40} textAnchor="middle" fontSize={90} fontWeight={900} fill="#fff" stroke={OUT} strokeWidth={6} fontFamily="Rubik" paintOrder="stroke">
          טראח!
        </text>
      )}
    </Stage>
  );
};
