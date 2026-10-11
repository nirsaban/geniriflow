import React from 'react';
import { Stage, Flash } from '../components/Stage';
import { Character, OUT } from '../characters/Character';
import { DesertRoad, CarSide, CarInteriorBack, CarInteriorFront, SteeringWheel } from '../backgrounds/Backgrounds';
import { useScene } from '../lib/timeline';
import { push } from './common';
import { FONT_UI } from '../fonts';
import { pop } from '../lib/anim';

/** Inside-the-car staging shared by several shots. */
export const CarCrew: React.FC<{
  f: number;
  sunset?: boolean;
  nir?: Partial<React.ComponentProps<typeof Character>>;
  roee?: Partial<React.ComponentProps<typeof Character>>;
  marom?: Partial<React.ComponentProps<typeof Character>>;
  acBlast?: boolean;
  look?: 'travel' | 'hotel';
}> = ({ f, sunset, nir = {}, roee = {}, marom = {}, acBlast, look = 'travel' }) => (
  <g>
    <CarInteriorBack f={f} sunset={sunset} />
    <Character id="nir" look={look} x={960} y={760} scale={0.78} legs="none" propR="laptop" armR="type" armL="type" expr="neutral" {...nir} />
    <Character id="roee" look={look} x={560} y={1000} scale={1} legs="none" turn={0.15} expr="happy" {...roee} />
    <Character id="marom" look={look} x={1380} y={950} scale={1} legs="none" turn={-0.15} armL="steer" armR="steer" expr="neutral" {...marom} />
    <CarInteriorFront f={f} acBlast={acBlast} />
    <SteeringWheel x={1380} y={905} f={f} />
  </g>
);

const Notes: React.FC<{ f: number; x: number; y: number }> = ({ f, x, y }) => (
  <g>
    {[0, 1, 2, 3].map((i) => {
      const t = ((f + i * 8) % 32) / 32;
      return (
        <text key={i} x={x + Math.sin(f * 0.2 + i) * 40 + i * 30} y={y - t * 200} fontSize={60} fill={['#ff4fd8', '#ffd34d', '#5ad1ff'][i % 3]} stroke={OUT} strokeWidth={2} opacity={1 - t}>
          {i % 2 ? '♪' : '♫'}
        </text>
      );
    })}
  </g>
);

/** A video-call screen (original UI). `nirTile` renders what Nir's webcam sees. */
const VideoCall: React.FC<{ f: number; big: 'manager' | 'nir'; muted?: boolean; managerExpr?: 'neutral' | 'shock' | 'angry'; roeeInFrame?: number }> = ({ f, big, muted, managerExpr = 'neutral', roeeInFrame = 0 }) => {
  const tile = (x: number, y: number, w: number, h: number, who: 'manager' | 'nir' | 'dana' | 'qa', label: string) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#2a2d3a" stroke="#4a4f66" strokeWidth={4} />
      <svg x={x} y={y} width={w} height={h} viewBox={who === 'nir' ? '560 260 800 450' : '560 220 800 450'} preserveAspectRatio="xMidYMid slice">
        {who === 'manager' && (
          <g>
            <rect x={0} y={0} width={1920} height={1080} fill="#d8dfe8" />
            <rect x={700} y={250} width={520} height={260} fill="#9fb4c8" stroke={OUT} strokeWidth={4} />
            <Character id="manager" x={960} y={1000} expr={managerExpr} voice="manager" fx={managerExpr === 'shock' ? ['sweat'] : []} />
          </g>
        )}
        {who === 'nir' && (
          <g>
            <CarInteriorBack f={f} />
            <Character id="nir" x={960} y={1040} scale={1.1} legs="none" expr={roeeInFrame > 0 ? 'panic' : 'happy'} still />
            {roeeInFrame > 0 && <Character id="roee" x={960 + (1 - roeeInFrame) * 700} y={1240} scale={1.5} legs="none" expr="laugh" turn={-0.2} />}
          </g>
        )}
        {(who === 'dana' || who === 'qa') && (
          <g>
            <rect x={0} y={0} width={1920} height={1080} fill={who === 'dana' ? '#f6e1c6' : '#cfe8d4'} />
            <circle cx={960} cy={470} r={120} fill={who === 'dana' ? '#c98e62' : '#f0c8a8'} stroke={OUT} strokeWidth={6} />
            <circle cx={920} cy={450} r={14} fill={OUT} />
            <circle cx={1000} cy={450} r={14} fill={OUT} />
            <path d="M 910 520 Q 960 550 1010 520" stroke={OUT} strokeWidth={6} fill="none" />
          </g>
        )}
      </svg>
      <rect x={x + 10} y={y + h - 46} width={label.length * 18 + 30} height={36} rx={8} fill="#000" opacity={0.6} />
      <text x={x + 25} y={y + h - 20} fill="#fff" fontSize={22} fontFamily={FONT_UI}>{label}</text>
    </g>
  );
  return (
    <g>
      <rect width={1920} height={1080} fill="#15161d" />
      <rect x={0} y={0} width={1920} height={70} fill="#1e2029" />
      <text x={960} y={46} textAnchor="middle" fill="#cfd3e6" fontSize={28} fontFamily={FONT_UI} direction="rtl">
        סטנדאפ יומי — ספרינט 47
      </text>
      {big === 'manager' ? (
        <>
          {tile(60, 100, 1300, 820, 'manager', 'Avi (Manager)')}
          {tile(1400, 100, 460, 260, 'nir', 'Nir Saban')}
          {tile(1400, 380, 460, 260, 'dana', 'Dana')}
          {tile(1400, 660, 460, 260, 'qa', 'QA Team')}
        </>
      ) : (
        <>
          {tile(60, 100, 1300, 820, 'nir', 'Nir Saban')}
          {tile(1400, 100, 460, 260, 'manager', 'Avi (Manager)')}
          {tile(1400, 380, 460, 260, 'dana', 'Dana')}
          {tile(1400, 660, 460, 260, 'qa', 'QA Team')}
        </>
      )}
      <rect x={0} y={950} width={1920} height={130} fill="#1e2029" />
      <g transform="translate(860 1012)">
        <circle r={44} fill={muted ? '#e02424' : '#3a3d4d'} stroke="#000" strokeWidth={3} />
        <rect x={-12} y={-26} width={24} height={36} rx={12} fill="#fff" />
        <path d="M -20 0 Q -20 22 0 22 Q 20 22 20 0 M 0 22 L 0 32" stroke="#fff" strokeWidth={4} fill="none" />
        {muted && <line x1={-28} y1={28} x2={28} y2={-28} stroke="#fff" strokeWidth={6} />}
      </g>
      <g transform="translate(1060 1012)">
        <circle r={44} fill="#e02424" />
        <rect x={-22} y={-6} width={44} height={12} rx={6} fill="#fff" />
      </g>
    </g>
  );
};

export const S02: React.FC = () => {
  const { f, at, between, since } = useScene();

  // establishing exterior
  if (f < at('s02_sing')) {
    return (
      <Stage cam={{ zoom: push(f, 0, at('s02_sing'), 1.25, 1.0), cx: 960, cy: 620 }}>
        <DesertRoad f={f} speed={34} />
        <CarSide
          f={f}
          x={960}
          y={850}
          headsFn={(slot) =>
            slot === 0 ? <Character id="nir" x={-70} y={40} scale={0.42} legs="none" turn={0.4} expr="hungover" /> : <Character id="roee" x={110} y={5} scale={0.42} legs="none" turn={0.4} expr="laugh" />
          }
        />
      </Stage>
    );
  }

  if (between('s02_sing', 's02_l1')) {
    return (
      <Stage cam={{ zoom: push(f, at('s02_sing'), at('s02_l1'), 1.05, 1.18), cx: 900, cy: 560 }}>
        <CarCrew f={f} roee={{ expr: 'laugh', armL: 'wave', armR: 'up', tilt: Math.sin(f * 0.3) * 8 }} nir={{ expr: 'angry' }} marom={{ expr: 'smug' }} />
        <Notes f={f} x={560} y={420} />
      </Stage>
    );
  }

  if (between('s02_l1', 's02_l2')) {
    return (
      <Stage>
        <VideoCall f={f} big="manager" />
      </Stage>
    );
  }

  if (between('s02_l2', 's02_l3')) {
    return (
      <Stage cam={{ zoom: push(f, at('s02_l2'), at('s02_l3'), 1.7, 1.9), cx: 960, cy: 470 }}>
        <CarCrew f={f} nir={{ expr: 'happy', fx: ['sweat'] }} roee={{ expr: 'smug' }} />
      </Stage>
    );
  }

  if (between('s02_l3', 's02_mute')) {
    const p = Math.min(1, since('s02_l3') / 6);
    return (
      <Stage cam={{ shake: 6 }}>
        <VideoCall f={f} big="nir" roeeInFrame={p} />
      </Stage>
    );
  }

  if (between('s02_mute', 's02_l4')) {
    const p = pop(f, at('s02_mute'), 8);
    return (
      <Stage cam={{ zoom: 1 + p * 0.9, cx: 860, cy: 1000 }}>
        <VideoCall f={f} big="manager" muted={f >= at('s02_mute') + 3} managerExpr="shock" />
        <Flash opacity={Math.max(0, 0.6 - since('s02_mute') / 6)} />
      </Stage>
    );
  }

  if (between('s02_l4', 's02_n1')) {
    return (
      <Stage cam={{ zoom: 2.1, cx: 960, cy: 450 }}>
        <CarCrew f={f} nir={{ expr: 'angry', fx: ['vein'], tilt: -6 }} roee={{ expr: 'laugh' }} marom={{ expr: 'laugh' }} />
      </Stage>
    );
  }

  // narrator: pull out on the road trip
  return (
    <Stage cam={{ zoom: push(f, at('s02_n1'), at('s02_n1') + 120, 1.0, 0.92), cx: 960, cy: 600 }}>
      <DesertRoad f={f} speed={34} />
      <CarSide
        f={f}
        x={960 + Math.sin(f * 0.05) * 30}
        y={850}
        headsFn={(slot) =>
          slot === 0 ? <Character id="nir" x={-70} y={40} scale={0.42} legs="none" turn={0.4} expr="sad" fx={['tears']} /> : <Character id="roee" x={110} y={5} scale={0.42} legs="none" turn={0.4} expr="laugh" />
        }
      />
      <g transform="translate(1500 300)">
        <rect x={-210} y={-70} width={420} height={140} rx={20} fill="#1c2b4a" stroke={OUT} strokeWidth={5} />
        <text x={0} y={-10} textAnchor="middle" fill="#5ad1ff" fontFamily="monospace" fontSize={34}>
          {`git commit -m ""`}
        </text>
        <text x={0} y={40} textAnchor="middle" fill="#ff6b6b" fontFamily={FONT_UI} fontSize={30} direction="rtl">
          שורות קוד היום: 0
        </text>
      </g>
    </Stage>
  );
};
