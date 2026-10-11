import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { TL, SceneCtx } from './lib/timeline';
import { HUD } from './components/HUD';
import { Subtitles } from './components/Subtitles';
import { AudioLayer } from './audio/AudioLayer';
import { SCENE_COMPONENTS } from './scenes';

/** The complete film: every scene on the master timeline + HUD, subtitles and the audio mix. */
export const Movie: React.FC<{ subtitles?: boolean; audio?: boolean }> = ({ subtitles = true, audio = true }) => (
  <AbsoluteFill style={{ background: '#000' }}>
    {TL.scenes.map((s) => {
      const C = SCENE_COMPONENTS[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={`${s.n}. ${s.title}`}>
          <SceneCtx.Provider value={{ scene: s, offset: s.from }}>{C ? <C /> : null}</SceneCtx.Provider>
        </Sequence>
      );
    })}
    <HUD />
    {subtitles && <Subtitles />}
    {audio && <AudioLayer />}
  </AbsoluteFill>
);

/** A window into the movie (used for the proof-of-concept and per-scene previews). */
export const MovieWindow: React.FC<{ start: number }> = ({ start }) => (
  <AbsoluteFill>
    <Sequence from={-start}>
      <Movie />
    </Sequence>
  </AbsoluteFill>
);
