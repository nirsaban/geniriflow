import React from 'react';
import { Stage, Flash } from '../components/Stage';
import { Character, OUT } from '../characters/Character';
import { Bedroom, Blanket, Doorway } from '../backgrounds/Backgrounds';
import { TitleCardArt } from '../components/Comedy';
import { useScene } from '../lib/timeline';
import { FreezeFrame, headY, push } from './common';
import { FONT_UI } from '../fonts';

const Hallway: React.FC<{ f: number; knock: boolean }> = ({ f, knock }) => (
  <g>
    <rect width={1920} height={1080} fill="#bdb38c" />
    <rect y={820} width={1920} height={260} fill="#8f876b" />
    <line x1={0} y1={820} x2={1920} y2={820} stroke={OUT} strokeWidth={5} />
    <circle cx={700} cy={120} r={30} fill="#fff6b0" stroke={OUT} strokeWidth={4} />
    <path d="M 700 120 L 380 1080 L 1020 1080 Z" fill="#fff6b0" opacity={0.15} />
    <g transform={`translate(${knock ? Math.sin(f * 2.4) * 6 : 0} 0)`}>
      <rect x={1480} y={260} width={300} height={560} fill="#7a4e2d" stroke={OUT} strokeWidth={5} />
      <rect x={1515} y={300} width={230} height={200} fill="#6a4226" stroke={OUT} strokeWidth={4} />
      <circle cx={1510} cy={560} r={12} fill="#e0c060" stroke={OUT} strokeWidth={4} />
      <rect x={1580} y={330} width={100} height={36} rx={6} fill="#e9e3c8" stroke={OUT} strokeWidth={3} />
      <text x={1630} y={357} textAnchor="middle" fontSize={24} fontFamily={FONT_UI} fontWeight={800} direction="rtl">
        סבן
      </text>
    </g>
    <text x={300} y={300} fill="#8a7f5c" fontSize={36} fontFamily={FONT_UI} direction="rtl" textAnchor="middle">
      02:00
    </text>
  </g>
);

export const S01: React.FC = () => {
  const { f, at, between, latest } = useScene();
  const freezeAt = at('s01_freeze');
  const frozen = f >= freezeAt && f < at('s01_title');

  if (f >= at('s01_title')) {
    return (
      <Stage>
        <TitleCardArt f={f - at('s01_title')} title="אילת 2026" subtitle="שלושה מטומטמים, אפס נייר טואלט" tag="18+" />
        <Flash opacity={Math.max(0, 1 - (f - at('s01_title')) / 6)} />
      </Stage>
    );
  }

  // ── shot A: Nir asleep, then BAM BAM BAM ──
  if (f < at('s01_l1')) {
    const banging = f >= at('s01_bang');
    return (
      <Stage cam={{ zoom: banging ? 1.12 : push(f, 0, at('s01_bang'), 1.0, 1.08), cx: 900, cy: 560, shake: banging ? 7 : 0 }}>
        <Bedroom f={f} doorShake={banging ? 10 : 0} />
        <Character id="nir" look="home" x={900} y={612} scale={0.9} lean={-90} expr={banging ? 'shock' : 'sleep'} fx={banging ? ['sweat'] : ['zzz']} blink={false} still />
        <Blanket f={f} />
      </Stage>
    );
  }

  // ── shot B: Roee pounding on the door in the stairwell ──
  if (between('s01_l1', 's01_l2')) {
    const knock = Math.sin(f * 1.6) > 0;
    return (
      <Stage cam={{ zoom: 1.15, cx: 1150, cy: 560 }}>
        <Hallway f={f} knock />
        <Character id="marom" x={980} y={990} turn={0.55} look="travel" propL="suitcase" expr="smug" />
        <Character id="roee" x={1340} y={990} turn={0.7} look="travel" armR={knock ? [150, -40] : [120, -80]} propL="bag" expr="laugh" />
      </Stage>
    );
  }

  // ── shot C: Nir bolts upright ──
  if (between('s01_l2', 's01_l3')) {
    return (
      <Stage cam={{ zoom: 1.6, cx: 600, cy: 470, shake: 3 }}>
        <Bedroom f={f} lampOn />
        <Character id="nir" look="home" x={600} y={860} scale={0.9} legs="none" expr="panic" armL="clutchHead" armR="clutchHead" fx={['sweat']} />
        <Blanket f={f} />
        <rect x={250} y={700} width={420} height={60} fill="#5a6fc0" stroke={OUT} strokeWidth={5} />
      </Stage>
    );
  }

  // ── shot D: the doorway confrontation ──
  const shot = latest(['s01_l3', 's01_l4', 's01_l5', 's01_l6', 's01_l7']);
  const nirX = 360, roeeX = 820, maromX = 1120, feet = 1010;
  const cams: Record<string, { zoom: number; cx: number; cy: number }> = {
    s01_l3: { zoom: 1.75, cx: maromX, cy: headY('marom', feet, 0.95) + 60 },
    s01_l4: { zoom: 1.9, cx: nirX + 30, cy: headY('nir', feet + 40, 1.1) + 50 },
    s01_l5: { zoom: 1.35, cx: roeeX + 60, cy: 640 },
    s01_l6: { zoom: 2.2, cx: nirX + 20, cy: headY('nir', feet + 40, 1.1) + 30 },
    s01_l7: { zoom: 1.7, cx: maromX - 40, cy: headY('marom', feet, 0.95) + 80 },
  };
  const cam = frozen ? { zoom: push(f, freezeAt, at('s01_title'), 1.0, 1.08), cx: 820, cy: 600 } : { ...cams[shot!], zoom: cams[shot!].zoom + (f - at(shot!)) * 0.002 };
  const nirExpr = shot === 's01_l4' ? 'angry' : shot === 's01_l6' ? 'angry' : shot === 's01_l7' ? 'shock' : 'hungover';

  const content = (
    <Stage cam={frozen ? { zoom: 1.0, cx: 860, cy: 560 } : cam}>
      <Doorway f={f} />
      <Character id="roee" x={roeeX} y={feet} scale={0.95} turn={-0.25} look="travel" propL="bag" propR="drink" armR="up" expr={shot === 's01_l5' ? 'laugh' : 'happy'} />
      <Character id="marom" x={maromX} y={feet} scale={0.95} turn={-0.3} look="travel" propR={shot === 's01_l7' ? undefined : 'suitcase'} armR={shot === 's01_l7' ? 'point' : 'down'} expr={shot === 's01_l7' ? 'smug' : 'neutral'} />
      <Character id="nir" x={nirX} y={feet + 40} scale={1.1} turn={0.55} look="home" expr={nirExpr} armL={shot === 's01_l6' ? 'out' : 'down'} armR={shot === 's01_l4' ? 'point' : 'down'} fx={shot === 's01_l4' || shot === 's01_l6' ? ['vein'] : []} />
    </Stage>
  );
  return (
    <FreezeFrame frame={freezeAt - 1} active={frozen}>
      {content}
    </FreezeFrame>
  );
};
