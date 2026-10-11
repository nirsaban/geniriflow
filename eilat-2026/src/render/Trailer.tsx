// 9:16 vertical trailer cut from the rendered film (assets/render/movie-final.mp4).
import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { ITEMS, FPS } from '../lib/timeline';
import { FONT_TITLE, FONT_UI } from '../fonts';

interface Seg { from: string; to: string; caption: string }
const SEGS: Seg[] = [
  { from: 's01_bang', to: 's01_l2', caption: '2:00 בלילה.' },
  { from: 's01_l3', to: 's01_l4', caption: 'שלושה חברים.' },
  { from: 's03_l1', to: 's03_l2', caption: 'מזגן אחד מסריח.' },
  { from: 's03_l5', to: 's04_tick', caption: 'אפס נייר טואלט.' },
  { from: 's04_gong', to: 's04_l1', caption: 'ומסורת אחת קדושה.' },
  { from: 's04_bow', to: 's04_choir', caption: 'כל שעתיים. בדיוק.' },
  { from: 's05_l8', to: 's05_l9', caption: 'רואי מנסה.' },
  { from: 's07_smash', to: 's07_n1', caption: 'רואי נכשל.' },
  { from: 's09_l1', to: 's09_l3', caption: 'ניר משלם.' },
  { from: 's12_rain', to: 's12_run', caption: 'אילת לא שיתפה פעולה.' },
  { from: 's13_screams', to: 's13_l2', caption: 'קוד חום.' },
  { from: 's13_heli', to: 's13_l4', caption: '' },
  { from: 's14_l3', to: 's14_freeze', caption: 'הם ייסעו שוב.' },
];
const segFrames = SEGS.map((s) => ({ ...s, start: ITEMS[s.from].from, len: ITEMS[s.to].from - ITEMS[s.from].from }));
const END_CARD = 3.5 * FPS;
export const TRAILER_FRAMES = segFrames.reduce((a, s) => a + s.len, 0) + END_CARD;

const Clip: React.FC<{ start: number; caption: string; len: number }> = ({ start, caption, len }) => {
  const f = useCurrentFrame();
  const src = staticFile('render/movie-final.mp4');
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <OffthreadVideo src={src} startFrom={start} muted style={{ position: 'absolute', width: 3413, height: 1920, left: -1166, top: 0, filter: 'blur(40px) brightness(0.45)' }} />
      <OffthreadVideo src={src} startFrom={start} style={{ position: 'absolute', width: 1600, height: 900, left: -260, top: 560 }} />
      {caption && (
        <div dir="rtl" style={{ position: 'absolute', top: 1560, width: '100%', textAlign: 'center', fontFamily: FONT_TITLE, fontSize: 92, color: '#fff', textShadow: '0 6px 0 #000, 0 0 20px #000', opacity: interpolate(f, [0, 5, len - 3, len], [0, 1, 1, 0.6], { extrapolateRight: 'clamp' }) }}>
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Trailer: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {segFrames.map((s) => {
        const from = at;
        at += s.len;
        return (
          <Sequence key={s.from} from={from} durationInFrames={s.len}>
            <Clip start={s.start} caption={s.caption} len={s.len} />
          </Sequence>
        );
      })}
      <Sequence from={at} durationInFrames={END_CARD}>
        <AbsoluteFill style={{ background: '#ffcf3a', justifyContent: 'center', alignItems: 'center' }}>
          <div dir="rtl" style={{ fontFamily: FONT_TITLE, fontSize: 170, color: '#fff', WebkitTextStroke: '10px #16141a', paintOrder: 'stroke' }}>אילת 2026</div>
          <div dir="rtl" style={{ fontFamily: FONT_TITLE, fontSize: 72, color: '#e02424', marginTop: 20, textAlign: 'center' }}>שלושה מטומטמים,<br />אפס נייר טואלט</div>
          <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 60, color: '#16141a', marginTop: 80, background: '#16141a', padding: '8px 40px', borderRadius: 16 }}>
            <span style={{ color: '#ffcf3a' }}>18+</span>
          </div>
        </AbsoluteFill>
      </Sequence>
      {/* persistent top title */}
      <div dir="rtl" style={{ position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: FONT_TITLE, fontSize: 120, color: '#ffcf3a', textShadow: '0 8px 0 #000' }}>
        אילת 2026
      </div>
      <div dir="rtl" style={{ position: 'absolute', top: 310, width: '100%', textAlign: 'center', fontFamily: FONT_UI, fontWeight: 800, fontSize: 52, color: '#fff', textShadow: '0 4px 0 #000' }}>
        שלושה מטומטמים, אפס נייר טואלט
      </div>
    </AbsoluteFill>
  );
};
