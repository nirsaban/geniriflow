import React from 'react';
import { Stage, Flash } from '../components/Stage';
import { OUT } from '../characters/Character';
import { CommandCenter, EilatAerial, Helicopter, GiantRoll } from '../backgrounds/Backgrounds';
import { Banner, SacredPlate, TwoHourClock } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { BathroomShot } from './S03';
import { keys, ramp, pop } from '../lib/anim';
import { push } from './common';

const PANELS = [
  { who: 'roee' as const, tile: '#ffd6a5', tile2: '#ffc58a', toward: 1 },
  { who: 'marom' as const, tile: '#caffbf', tile2: '#b2f2a5', toward: 0 },
  { who: 'nir' as const, tile: '#bde0fe', tile2: '#a2d2ff', toward: -1 },
];

export const S13: React.FC = () => {
  const { f, at, since, latest } = useScene();
  const shot = latest(['s13_split', 's13_screams', 's13_l1', 's13_l2', 's13_l3', 's13_command', 's13_heli', 's13_fall', 's13_l4', 's13_gong', 's13_l5', 's13_bow', 's13_black'])!;

  if (shot === 's13_black') return <Stage bg="#000">{null}</Stage>;

  if (shot === 's13_command') {
    return (
      <Stage cam={{ zoom: push(f, at('s13_command'), at('s13_heli'), 1.0, 1.08) }} overlay={<Banner text="מבצע חילוץ: קוד חום" f={f} start={at('s13_command') + 6} y={900} color="#5a3a1a" size={90} />}>
        <CommandCenter f={f} />
      </Stage>
    );
  }

  if (shot === 's13_heli' || shot === 's13_fall') {
    const h = since('s13_heli');
    const x = -400 + h * 18;
    const fallT = Math.max(0, since('s13_fall'));
    const dropping = shot === 's13_fall';
    const hx = dropping ? 1150 + fallT * 12 : Math.min(1150, x);
    const rollY = dropping ? 310 + 90 + 220 + fallT * fallT * 1.2 : 0;
    const splashed = dropping && rollY > 760;
    return (
      <Stage cam={{ zoom: 1.0 }}>
        <EilatAerial f={f} />
        <Helicopter x={hx} y={260} f={f} s={0.9} withRoll={!dropping} />
        {dropping && !splashed && <GiantRoll x={1150} y={rollY} spin={fallT * 14} s={0.9} />}
        {splashed && (
          <g>
            {Array.from({ length: 16 }, (_, i) => {
              const t = Math.min(1, (fallT - 26) / 14);
              return <circle key={i} cx={1150 + Math.cos(i) * 160 * t} cy={760 - Math.abs(Math.sin(i * 1.3)) * 220 * t * (1 - t) * 3} r={18} fill="#d6f4ff" stroke={OUT} strokeWidth={3} opacity={1 - t * 0.7} />;
            })}
            <ellipse cx={1150} cy={780} rx={120 + (fallT - 26) * 4} ry={20} fill="none" stroke="#fff" strokeWidth={5} opacity={Math.max(0, 1 - (fallT - 26) / 30)} />
            <g transform={`translate(1150 ${790 + Math.sin(f * 0.2) * 6}) rotate(80) scale(0.35)`}>
              <GiantRoll x={0} y={0} />
            </g>
          </g>
        )}
      </Stage>
    );
  }

  // ── split-screen bathrooms ──
  const scream = shot === 's13_screams';
  const speaker: Record<string, string> = { s13_l1: 'nir', s13_l2: 'marom', s13_l3: 'roee', s13_l4: 'nir', s13_l5: 'roee' };
  const g = since('s13_gong');
  const ceremony = f >= at('s13_gong');
  const turnP = ramp(g, 4, 26);
  const bowP = shot === 's13_bow' ? keys(since('s13_bow'), [[0, 0], [10, 0.42], [40, 0.42]]) : 0;
  if (shot === 's13_l4') {
    return (
      <Stage cam={{ zoom: push(f, at('s13_l4'), at('s13_gong'), 1.7, 2.0), cx: 980, cy: 600 }}>
        <BathroomShot f={f} who="nir" expr="hungover" arms="out" fx={[]} spin={false} tile="#bde0fe" tile2="#a2d2ff" />
      </Stage>
    );
  }
  return (
    <Stage cam={{ shake: scream ? 9 : g >= 0 && g < 10 ? 6 : 0 }}>
      {PANELS.map((p, i) => {
        const active = !speaker[shot] || speaker[shot] === p.who || ceremony;
        const turn = ceremony ? (p.who === 'marom' ? 0.6 * turnP : p.toward * turnP) : 0;
        return (
          <g key={p.who}>
            <svg x={i * 640} y={0} width={640} height={1080} viewBox="680 40 640 1080">
              <BathroomShot
                f={f}
                who={p.who}
                look="hotel"
                tile={p.tile}
                tile2={p.tile2}
                expr={ceremony ? 'solemn' : scream || speaker[shot] === p.who ? 'panic' : 'strain'}
                arms={ceremony ? 'pray' : scream ? 'clutchHead' : 'out'}
                turn={turn}
                bow={bowP}
                fx={ceremony ? [] : ['sweat']}
              />
            </svg>
            {!active && <rect x={i * 640} y={0} width={640} height={1080} fill="#000" opacity={0.45} />}
            <rect x={i * 640} y={0} width={640} height={1080} fill="none" stroke="#111" strokeWidth={14} />
          </g>
        );
      })}
      {ceremony && (
        <g>
          <rect width={1920} height={1080} fill="#000" opacity={0.25 * ramp(g, 0, 10)} />
          <g transform={`translate(960 ${880 + (1 - pop(f, at('s13_gong') + 6, 12)) * 400})`}>
            <SacredPlate x={0} y={180} f={f} s={0.6} />
          </g>
          {g < 36 && (
            <g transform="translate(320 250) scale(0.5)">
              <TwoHourClock x={0} y={0} p={ramp(g, 0, 20)} fromHour={8} />
            </g>
          )}
        </g>
      )}
      <Flash opacity={g >= 0 && g < 6 ? 0.6 - g * 0.1 : 0} />
    </Stage>
  );
};
