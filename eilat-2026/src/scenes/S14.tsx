import React from 'react';
import { Stage, SpeedLines, Flash } from '../components/Stage';
import { DesertRoad, CarSide, ChatPhone } from '../backgrounds/Backgrounds';
import { WHATSAPP } from '../script/screenplay';
import { useScene } from '../lib/timeline';
import { CarCrew } from './S02';
import { FreezeFrame, push } from './common';
import { pop } from '../lib/anim';
import { FONT_TITLE } from '../fonts';

export const S14: React.FC = () => {
  const { f, at, latest } = useScene();
  const shot = latest(['s14_car', 's14_l1', 's14_l2', 's14_l3', 's14_l4', 's14_freeze', 's14_n1', 's14_end'])!;

  if (shot === 's14_end') {
    const e = f - at('s14_end');
    const p = pop(f, at('s14_end') + 4, 14);
    return (
      <Stage>
        <DesertRoad f={f} speed={20} sunset />
        <CarSide f={f} x={960 + e * 6} y={850} />
        <rect width={1920} height={1080} fill="#2a0f1f" opacity={0.25} />
        <g transform={`translate(960 330) scale(${p})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={150} fill="#fff" stroke="#16141a" strokeWidth={12} paintOrder="stroke" direction="rtl">
            סופ״ש אילת 2026
          </text>
          <text x={0} y={110} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={54} fill="#ffd34d" stroke="#16141a" strokeWidth={7} paintOrder="stroke" direction="rtl" opacity={e > 24 ? 1 : 0}>
            היה שווה כל שקל. חוץ מה-500 של ארוחת הבוקר.
          </text>
        </g>
        <Flash opacity={Math.max(0, 0.7 - e / 6)} />
      </Stage>
    );
  }

  const freezeAt = at('s14_freeze');
  const frozen = f >= freezeAt;
  const scream = shot === 's14_l4' || frozen;
  const cams: Record<string, { zoom: number; cx: number; cy: number; shake?: number }> = {
    s14_car: { zoom: push(f, 0, at('s14_l1'), 1.0, 1.08), cx: 960, cy: 540 },
    s14_l1: { zoom: 1.8, cx: 1380, cy: 520 },
    s14_l2: { zoom: 1.9, cx: 960, cy: 430 },
    s14_l3: { zoom: 1.8, cx: 560, cy: 540 },
    s14_l4: { zoom: 1.1, cx: 960, cy: 520, shake: 9 },
  };
  const roeeAwake = f >= at('s14_l3');
  const content = (
    <Stage cam={frozen ? { zoom: 1.1, cx: 960, cy: 520 } : cams[shot]}>
      <CarCrew
        f={f}
        sunset
        look="hotel"
        nir={{ expr: scream ? 'panic' : shot === 's14_l2' ? 'smug' : 'hungover', armL: scream ? 'clutchHead' : 'type', armR: scream ? 'clutchHead' : 'type', propR: scream ? undefined : 'laptop', fx: scream ? ['sweat'] : [] }}
        roee={{ expr: roeeAwake ? (scream ? 'happy' : 'flirt') : 'sleep', fx: roeeAwake ? [] : ['zzz'], tilt: roeeAwake ? 0 : -18, armR: shot === 's14_l3' ? 'point' : undefined }}
        marom={{ expr: scream ? 'panic' : shot === 's14_l1' ? 'hungover' : 'hungover', fx: scream ? ['sweat'] : [] }}
      />
      {scream && <SpeedLines f={f} color="#fff3a0" opacity={0.35} />}
    </Stage>
  );
  return (
    <FreezeFrame frame={freezeAt - 1} active={frozen} zoom={1.04 + (f - freezeAt) * 0.0006}>
      {content}
    </FreezeFrame>
  );
};

export const S15: React.FC = () => {
  const { f, at, since } = useScene();
  if (f < at('s15_msg')) return <Stage bg="#000">{null}</Stage>;
  if (f < at('s15_gong')) {
    return (
      <Stage bg="#000">
        <rect width={1920} height={1080} fill="#000" />
        <g transform="scale(0.95) translate(50 28)">
          <ChatPhone f={f} group={WHATSAPP.group} from={WHATSAPP.from} text={WHATSAPP.text} showMsg={Math.min(1, since('s15_msg') / 8)} />
        </g>
      </Stage>
    );
  }
  const g = since('s15_gong');
  return (
    <Stage bg="#000" cam={{ shake: g < 12 ? 8 - g * 0.6 : 0 }}>
      <rect width={1920} height={1080} fill="#000" />
      <g transform={`translate(960 520) scale(${pop(f, at('s15_gong'), 12)})`}>
        <text x={0} y={0} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={190} fill="#ffd34d" direction="rtl">
          סוף.
        </text>
        <text x={0} y={120} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={70} fill="#fff" letterSpacing={12}>
          THE END
        </text>
      </g>
      <Flash opacity={g < 6 ? 0.6 - g * 0.1 : 0} />
    </Stage>
  );
};
