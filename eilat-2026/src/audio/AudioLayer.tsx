import React from 'react';
import { Audio, Sequence, staticFile, interpolate } from 'remotion';
import { TL, AUDIO, FPS } from '../lib/timeline';

// Precomputed: is anyone speaking at frame f? (for music ducking)
const speaking = new Uint8Array(TL.total + 1);
for (const s of TL.scenes) for (const it of s.items) if (it.kind === 'line') for (let f = it.from; f < it.from + it.speechDur! && f <= TL.total; f++) speaking[f] = 1;
const duck = (abs: number) => {
  // smooth over ±6 frames
  let n = 0;
  for (let k = -6; k <= 6; k++) n += speaking[Math.max(0, Math.min(TL.total, abs + k))];
  return 1 - 0.55 * (n / 13);
};

/** All dialogue, sound effects, ambience and music for the whole film, mixed by Remotion. */
export const AudioLayer: React.FC = () => (
  <>
    {TL.scenes.map((s) => (
      <React.Fragment key={s.id}>
        {s.items.map((it) => (
          <React.Fragment key={it.id}>
            {it.kind === 'line' && (
              <Sequence from={it.from} durationInFrames={Math.ceil(AUDIO.voices[it.id].duration * FPS) + 4} name={`voice ${it.id}`}>
                <Audio src={staticFile(AUDIO.voices[it.id].file)} volume={it.who === 'narr' ? 1 : 0.95} />
              </Sequence>
            )}
            {it.sfx?.map((c, k) =>
              AUDIO.sfx[c.s] ? (
                <Sequence key={k} from={c.at} durationInFrames={Math.ceil(AUDIO.sfx[c.s].duration * FPS) + 2} name={`sfx ${c.s}`}>
                  <Audio src={staticFile(AUDIO.sfx[c.s].file)} volume={0.75 * c.vol} />
                </Sequence>
              ) : null,
            )}
          </React.Fragment>
        ))}
        {s.ambience.map((a) => (
          <Sequence key={a.track} from={s.from} durationInFrames={s.dur} name={`amb ${a.track}`}>
            <Audio
              src={staticFile(AUDIO.ambience[a.track].file)}
              loop
              volume={(f) => a.vol * interpolate(f, [0, 8, s.dur - 8, s.dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            />
          </Sequence>
        ))}
        {s.music.map((m, k) => (
          <Sequence key={k} from={m.from} durationInFrames={Math.max(1, m.to - m.from)} name={`music ${m.track}`}>
            <Audio
              src={staticFile(AUDIO.music[m.track].file)}
              loop
              volume={(f) => m.vol * duck(m.from + f) * interpolate(f, [0, 10, m.to - m.from - 14, m.to - m.from], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            />
          </Sequence>
        ))}
      </React.Fragment>
    ))}
  </>
);
