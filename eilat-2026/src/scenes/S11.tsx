import React from 'react';
import { Stage, Flash } from '../components/Stage';
import { Character, OUT } from '../characters/Character';
import { Apartment, CoffeeTable } from '../backgrounds/Backgrounds';
import { Spotlight } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { walk, headY, push } from './common';
import { FONT_UI } from '../fonts';

export const S11: React.FC = () => {
  const { f, at, since, latest } = useScene();
  const shot = latest(['s11_notif', 's11_l1', 's11_prep', 's11_enter', 's11_l2', 's11_take', 's11_l3', 's11_slam', 's11_n1'])!;

  // narrator: chalk outline where the suitcase used to be
  if (shot === 's11_n1') {
    return (
      <Stage cam={{ zoom: push(f, at('s11_n1'), at('s11_n1') + 100, 1.0, 1.2), cx: 960, cy: 620 }}>
        <Apartment f={f} light="afternoon" acStink />
        <rect width={1920} height={1080} fill="#000" opacity={0.35} />
        <Spotlight x={1500} width={200} />
        <rect x={1420} y={880} width={170} height={130} rx={14} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="14 8" />
        <text x={1505} y={1060} textAnchor="middle" fill="#fff" fontFamily={FONT_UI} fontSize={26} direction="rtl">כאן שכבה מזוודה אהובה</text>
        {(['nir', 'roee', 'marom'] as const).map((id, i) => (
          <Character key={id} id={id} look="hotel" x={360 + i * 260} y={1000} expr="sad" lean={-4 + i * 4} />
        ))}
      </Stage>
    );
  }

  const enter = walk(f, at('s11_enter'), at('s11_l2'), -250, 0);
  const t = since('s11_take');
  const grab = walk(f, at('s11_take') + 10, at('s11_take') + 30, 520, 1440);
  const leave = walk(f, at('s11_take') + 36, at('s11_l3'), 1440, -300);
  const girlCx = f < at('s11_take') + 10 ? 520 + enter.x : f < at('s11_take') + 36 ? grab.x : leave.x;
  const hasCase = f >= at('s11_take') + 30;
  const posing = f >= at('s11_prep') && f < at('s11_take') + 20;
  const p = since('s11_prep');
  const cams: Record<string, { zoom: number; cx: number; cy: number; shake?: number }> = {
    s11_notif: { zoom: 2.2, cx: 1040, cy: headY('roee', 1000) + 160 },
    s11_l1: { zoom: 1.5, cx: 1040, cy: 560 },
    s11_prep: { zoom: 1.15, cx: 1150, cy: 600 },
    s11_enter: { zoom: 1.0, cx: 960, cy: 540 },
    s11_l2: { zoom: 1.6, cx: 520, cy: headY('nir', 1000, 0.92) + 110 },
    s11_take: { zoom: 1.0, cx: 960, cy: 540 },
    s11_l3: { zoom: 2.0, cx: 1300, cy: headY('marom', 990) + 70 },
    s11_slam: { zoom: 1.0, cx: 960, cy: 540, shake: 10 },
  };
  const sad = f >= at('s11_take') + 40;
  return (
    <Stage cam={cams[shot]}>
      <Apartment f={f} light="afternoon" acStink />
      {f < at('s11_take') + 30 && <g transform="translate(1440 1010)"><rect x={-60} y={-130} width={120} height={130} rx={14} fill="#5e60ce" stroke={OUT} strokeWidth={5} /><rect x={-20} y={-148} width={40} height={20} rx={6} fill="none" stroke={OUT} strokeWidth={6} /></g>}
      {f >= at('s11_enter') && f < at('s11_l3') && (
        <>
          <Character id="girlA" look="hotel" x={girlCx} y={1000} scale={0.92} legs={enter.moving || grab.moving || leave.moving ? 'walk' : 'stand'} phase={f / 11} turn={leave.moving ? -1 : grab.moving ? 1 : 0.3} expr="neutral" voice="girl" propR={hasCase ? 'suitcase' : undefined} armR={hasCase ? 'down' : undefined} />
          <Character id="girlC" look="hotel" x={girlCx - 180} y={1000} scale={0.92} legs={enter.moving || grab.moving || leave.moving ? 'walk' : 'stand'} phase={f / 11 + 0.4} turn={leave.moving ? -1 : grab.moving ? 1 : 0.3} expr="neutral" />
        </>
      )}
      <Character id="nir" look="hotel" x={860} y={1000} turn={-0.2} expr={sad ? 'sad' : posing ? 'smug' : 'happy'} propR={posing && p < 60 ? 'comb' : undefined} armR={posing && p < 60 ? 'mirror' : posing ? 'hips' : undefined} armL={posing ? 'hips' : undefined} />
      <Character id="roee" look="hotel" x={1060} y={1000} turn={-0.2} expr={sad ? 'sad' : shot === 's11_l1' ? 'laugh' : 'flirt'} propR={shot === 's11_notif' ? 'phone' : undefined} armR={shot === 's11_notif' ? 'front' : shot === 's11_l1' ? 'up' : posing ? 'flex' : undefined} armL={shot === 's11_l1' ? 'up' : posing ? 'flex' : undefined} fx={posing ? ['shine'] : []} />
      <Character id="marom" look="hotel" x={1300} y={990} turn={-0.2} expr={sad || shot === 's11_l3' ? 'sad' : posing ? 'smug' : 'happy'} propR={posing && p < 40 ? 'perfume' : undefined} armR={posing && p < 40 ? 'up' : posing ? 'hips' : undefined} armL={shot === 's11_l3' ? 'shrug' : undefined} />
      {posing && p > 8 && p < 34 && <circle cx={1330} cy={480} r={(p - 8) * 7} fill="#e8c8ff" opacity={Math.max(0, 0.55 - (p - 8) * 0.02)} />}
      <CoffeeTable x={360} y={905} />
      {shot === 's11_take' && t < 40 && (
        <text x={1100} y={300} textAnchor="middle" fontFamily={FONT_UI} fontSize={60} fill="#fff" stroke={OUT} strokeWidth={4} paintOrder="stroke" opacity={0.85}>
          ...
        </text>
      )}
      <Flash opacity={0} />
    </Stage>
  );
};
