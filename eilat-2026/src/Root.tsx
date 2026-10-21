import React from 'react';
import { Composition, Still } from 'remotion';
import { CharacterSheet } from './characters/CharacterSheet';
import { FontGate } from './fonts';
import { Movie, MovieWindow } from './Movie';
import { TL, sceneById } from './lib/timeline';
import { Trailer, TRAILER_FRAMES } from './render/Trailer';
import { BidetNasa } from './shorts/BidetNasa';
import { SHORT_FPS, SHORT_SECONDS } from './shorts/bidetScript';

const withFonts = <P extends object>(C: React.FC<P>): React.FC<P> => (props: P) => (
  <FontGate>
    <C {...props} />
  </FontGate>
);

const POC_START = sceneById('s03').from;
const POC_LEN = 14 * TL.fps;

export const Root: React.FC = () => (
  <>
    <Composition id="movie" component={withFonts(Movie)} durationInFrames={TL.total} fps={TL.fps} width={1920} height={1080} />
    <Composition id="poc" component={withFonts(MovieWindow)} durationInFrames={POC_LEN} fps={TL.fps} width={1920} height={1080} defaultProps={{ start: POC_START }} />
    <Composition id="bidet-nasa" component={withFonts(BidetNasa)} durationInFrames={SHORT_FPS * SHORT_SECONDS} fps={SHORT_FPS} width={1920} height={1080} />
    <Composition id="trailer" component={withFonts(Trailer)} durationInFrames={TRAILER_FRAMES} fps={TL.fps} width={1080} height={1920} />
    {TL.scenes.map((s) => (
      <Composition key={s.id} id={`scene-${s.id}`} component={withFonts(MovieWindow)} durationInFrames={s.dur} fps={TL.fps} width={1920} height={1080} defaultProps={{ start: s.from }} />
    ))}
    {(['nir', 'roee', 'marom'] as const).map((id) => (
      <Still key={id} id={`sheet-${id}`} component={withFonts(CharacterSheet)} width={1920} height={1080} defaultProps={{ id }} />
    ))}
  </>
);
