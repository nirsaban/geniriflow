import React from 'react';
import { Stage, Flash } from '../components/Stage';
import { Character, type CharacterProps } from '../characters/Character';
import { Apartment, BuildingExterior } from '../backgrounds/Backgrounds';
import { SacredPlate, Spotlight, Gong, TwoHourClock, Choir, GlitterBurst } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { push, headY } from './common';
import { keys, ramp } from '../lib/anim';
import type { Look } from '../characters/designs';

/** The darkened room with the plate under a spotlight and the three guys. */
export const CeremonyRoom: React.FC<{
  f: number;
  bow?: number;
  profile?: boolean;
  look?: Look;
  exprs?: Partial<Record<'nir' | 'roee' | 'marom', CharacterProps['expr']>>;
  extra?: Partial<Record<'nir' | 'roee' | 'marom', Partial<CharacterProps>>>;
  spot?: number;
  light?: 'dark' | 'night';
}> = ({ f, bow = 0, profile = true, look = 'travel', exprs = {}, extra = {}, spot = 1, light = 'dark' }) => {
  const t = profile ? 1 : 0;
  return (
    <g>
      <Apartment f={f} light={light} acStink={false} />
      <Spotlight x={1500} opacity={spot} />
      <SacredPlate x={1500} y={930} f={f} glow={spot} />
      {(['nir', 'roee', 'marom'] as const).map((id, i) => (
        <Character key={id} id={id} look={look} x={420 + i * 300} y={990} turn={t} bow={bow} expr={exprs[id] ?? 'solemn'} armL={bow > 0.1 ? 'pray' : undefined} armR={bow > 0.1 ? 'pray' : undefined} {...extra[id]} />
      ))}
    </g>
  );
};

export const S04: React.FC = () => {
  const { f, at, between, since } = useScene();

  if (f < at('s04_gong')) {
    const p = ramp(f, 2, at('s04_gong') - 4);
    return (
      <Stage cam={{ zoom: push(f, 0, at('s04_gong'), 1.0, 1.15), cx: 960, cy: 520 }}>
        <Apartment f={f} light="afternoon" />
        <rect width={1920} height={1080} fill="#000" opacity={0.35} />
        <TwoHourClock x={960} y={470} p={p} s={1.25} fromHour={14} />
      </Stage>
    );
  }

  if (between('s04_gong', 's04_l1')) {
    const g = since('s04_gong');
    if (g < 16) {
      return (
        <Stage cam={{ zoom: 1.1, shake: g > 4 ? 10 - g * 0.5 : 0 }}>
          <rect width={1920} height={1080} fill="#3a0d12" />
          <Gong x={960} y={600} f={g} hitF={4} s={1.3} />
          <Flash opacity={g >= 4 && g < 9 ? 0.7 - (g - 4) * 0.14 : 0} />
        </Stage>
      );
    }
    // everything freezes: spotlight comes on, heads turn to the plate
    const turn = ramp(g, 22, 40) * 1;
    return (
      <Stage cam={{ zoom: 1.0 }}>
        <CeremonyRoom f={f} profile={false} spot={ramp(g, 16, 24)} exprs={{ nir: 'shock', roee: 'shock', marom: 'shock' }} extra={{ nir: { turn, propR: 'laptop', armR: 'front' }, roee: { turn, propR: 'drink', armR: 'up' }, marom: { turn, propR: 'remote', armR: 'pointUp' } }} />
      </Stage>
    );
  }

  if (between('s04_l1', 's04_l2')) {
    return (
      <Stage cam={{ zoom: 2.3, cx: 1020, cy: headY('marom', 990) + 30 }}>
        <CeremonyRoom f={f} exprs={{ marom: 'solemn' }} extra={{ marom: { turn: 0.6 } }} />
      </Stage>
    );
  }
  if (between('s04_l2', 's04_l3')) {
    return (
      <Stage cam={{ zoom: 2.0, cx: 420, cy: headY('nir', 990) + 70 }}>
        <CeremonyRoom f={f} exprs={{ nir: 'angry' }} extra={{ nir: { turn: 0.3, armL: 'shrug', armR: 'shrug' } }} />
      </Stage>
    );
  }
  if (between('s04_l3', 's04_bow')) {
    return (
      <Stage cam={{ zoom: 2.1, cx: 720, cy: headY('roee', 990) + 60 }}>
        <CeremonyRoom f={f} exprs={{ roee: 'solemn' }} extra={{ roee: { turn: 0.5, armR: 'pray' } }} />
      </Stage>
    );
  }
  if (between('s04_bow', 's04_choir')) {
    const b = since('s04_bow');
    const bow = keys(b, [[0, 0], [10, 1], [34, 1], [44, 0.4]]);
    return (
      <Stage cam={{ zoom: push(f, at('s04_bow'), at('s04_choir'), 1.0, 1.1), cx: 1000, cy: 560 }}>
        <CeremonyRoom f={f} bow={bow} />
      </Stage>
    );
  }
  if (between('s04_choir', 's04_faces')) {
    const c = since('s04_choir');
    return (
      <Stage cam={{ zoom: push(f, at('s04_choir'), at('s04_faces'), 1.0, 1.12), cx: 900, cy: 560 }}>
        <BuildingExterior f={f} />
        <Choir x={1250} y={1050} f={f} n={4} />
        <GlitterBurst x={830} y={685} f={c} start={30} />
        <Flash color="#fff7c0" opacity={c >= 30 && c < 36 ? 0.5 : 0} />
      </Stage>
    );
  }
  if (between('s04_faces', 's04_n1')) {
    return (
      <Stage cam={{ zoom: 2.4, cx: 720, cy: headY('roee', 990) + 70, shake: 3 }}>
        <CeremonyRoom f={f} spot={0.6} profile={false} exprs={{ nir: 'wide', roee: 'wide', marom: 'wide' }} extra={{ nir: { fx: ['twitch'], x: 560 }, roee: { fx: ['twitch'] }, marom: { fx: ['twitch'], x: 880 } }} />
      </Stage>
    );
  }
  // narrator: three stiff, vibrating, wide-eyed guys
  return (
    <Stage cam={{ zoom: push(f, at('s04_n1'), at('s04_n1') + 200, 1.0, 1.15), cx: 900, cy: 560, shake: 1.5 }}>
      <CeremonyRoom f={f} spot={0.8} profile={false} exprs={{ nir: 'wide', roee: 'wide', marom: 'wide' }} extra={{ nir: { fx: ['twitch'] }, roee: { fx: ['twitch'] }, marom: { fx: ['twitch'] } }} />
    </Stage>
  );
};
