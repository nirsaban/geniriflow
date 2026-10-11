import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TL } from '../lib/timeline';
import { SPEAKER_NAMES, SPEAKER_COLORS } from '../script/speakers';
import { FONT_UI } from '../fonts';

/** Burned-in Hebrew subtitles, right-to-left, with a colour-coded speaker tag. */
export const Subtitles: React.FC<{ offset?: number; bottom?: number; size?: number; maxWidth?: number }> = ({ offset = 0, bottom = 54, size = 44, maxWidth = 1500 }) => {
  const frame = useCurrentFrame() + offset;
  let line: (typeof TL.scenes)[number]['items'][number] | undefined;
  for (const s of TL.scenes) {
    if (frame < s.from || frame >= s.from + s.dur + 8) continue;
    for (const it of s.items) if (it.kind === 'line' && frame >= it.from && frame < it.from + it.speechDur! + 6) line = it;
  }
  if (!line) return null;
  const age = frame - line.from;
  const op = Math.min(1, age / 3);
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none' }}>
      <div
        dir="rtl"
        style={{
          marginBottom: bottom,
          maxWidth,
          padding: '10px 28px 14px',
          borderRadius: 16,
          background: 'rgba(8,8,16,0.55)',
          fontFamily: FONT_UI,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.25,
          color: '#fff',
          textAlign: 'center',
          opacity: op,
          textShadow: '0 3px 0 #000, 0 0 8px #000',
          unicodeBidi: 'isolate',
        }}
      >
        <span style={{ color: SPEAKER_COLORS[line.who!], fontWeight: 500, fontSize: size * 0.72 }}>{SPEAKER_NAMES[line.who!]}: </span>
        {line.he}
      </div>
    </AbsoluteFill>
  );
};
