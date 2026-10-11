# אילת 2026 — שלושה מטומטמים, אפס נייר טואלט

An adult (18+) animated comedy in Hebrew, about 3:54 long, produced fully in code. A TypeScript pipeline builds a deterministic timeline from the screenplay. Remotion and headless Chromium animate every frame from vector character rigs, and FFmpeg encodes and validates the output.

## Outputs (`output/`)

| file | what |
|---|---|
| `movie-final.mp4` | The film: 1920×1080, 24 fps, H.264 + AAC. Hebrew subtitles are burned in, and a soft `mov_text` track is also muxed (language `heb`). |
| `trailer-vertical.mp4` | 9:16 trailer (1080×1920), about 52 s, cut from the film |
| `proof-of-concept.mp4` | 14 s test (scene 3), rendered first to check style and audio/video sync |
| `subtitles-he.srt` | Hebrew subtitles. Each cue is wrapped in an RTL embedding (U+202B), so players without bidi support still render it correctly. |
| `screenplay.md` | The screenplay as shot, with real timecodes |
| `storyboard.json` | Shot list: every beat and line with its start and duration, speaker, action and SFX |
| `qa-report.md` | Automatic validation results |
| `cost-ledger.json` | Every generation call with its provider and cost (all $0) |

Character sheets are in `assets/characters/*-sheet.png`. Each sheet shows front, three-quarter and side views (full body), six expressions (neutral, angry, laughing, hungover, panicking, flirting) and the outfit changes.

## How it was made: the honest version

The environment had no AI image, video or voice provider: there were no API keys, and Microsoft/Edge TTS, HuggingFace and similar hosts were blocked by the network policy. So every asset was built locally:

- **Animation.** A reusable SVG character rig (`src/characters/Character.tsx`) renders every frame. It supports:
  - head turn from front to three-quarter to profile
  - blinks and eyelids
  - brows and pupils for 15 expressions
  - two-segment arms with pose presets and hand props
  - walk, run and sit cycles
  - bowing, squash and stretch, and idle breathing
  - comedic FX (sweat, hearts, stink lines, anger veins, zzz)

  The camera has pan, zoom, roll, shake and clamping. Nothing is a static illustration: every shot is animated.
- **Lip-sync from phonemes.** The voice engine outputs phoneme timings, which drive the mouth shapes (visemes A/E/O/C/M/F/X) frame by frame.
- **Hebrew voices.** These use MBROLA diphone voices: `hb1` (male) and `hb2` (female, Israeli accent). They are driven by a custom prosody model (`scripts/lib/tts.ts`) built from a stress-marked transliteration of every line. Each character has its own pitch, tempo, pitch range and formant shift (by resampling), and each mood (shout, scream, whisper, solemn, flirt, sing, sarcastic, panic) changes the delivery. No real person's voice is cloned. **Limitation:** diphone synthesis sounds robotic next to modern neural TTS. The burned-in subtitles carry the jokes.
- **Sound effects, ambience and music.** All of it is synthesized procedurally (`scripts/lib/synth.ts`) from oscillators, noise, filters, Karplus–Strong strings and FM electric piano: the gong, flush, empty-roll squeak, sirens, cash register, rain and thunder, and nine original music cues. Nothing is sampled, so there is nothing to license.
- **Character designs.** Nir follows the reference photo in `assets/references/nir-reference.png`: short dark fade, short full beard, athletic build, black turtleneck with a drawstring. No photos of Roee or Marom were provided, so their designs are original and based on their written personalities. They can be swapped in `src/characters/designs.ts` when photos are available.

### Swapping in better providers

The pipeline isolates generation behind `scripts/build-audio.ts`, with a cache keyed by input hash. To get more natural voices, replace `synthLine()` with a neural Hebrew TTS (for example Azure `he-IL-AvriNeural`/`HilaNeural`, or ElevenLabs), keeping the same signature. The returned phoneme timings can come from forced alignment or from the provider's viseme events. `scripts/lib/cost.ts` → `requireApproval()` blocks any paid call unless `EILAT_APPROVED_BUDGET_USD` is set.

## Running it

Requirements: Node 22, FFmpeg, `espeak-ng`, `mbrola`, `mbrola-hb1`, `mbrola-hb2`, and Chromium (the headless shell path is set in `remotion.config.ts` and `scripts/render.ts`).

```bash
npm install
npm run audio      # voices + SFX + music → assets/, src/generated/audio.json (cached)
npm run timeline   # frame-accurate timeline, SRT, storyboard, screenplay.md
npm run sheets     # character sheets → assets/characters
npm run poc        # proof-of-concept.mp4
npm run movie      # movie-final.mp4 (~35 min on 4 cores)
npm run trailer    # trailer-vertical.mp4 (needs the movie)
npm run validate   # QA report
npx tsx scripts/render.ts preview s05   # half-res preview of one scene
npx tsx scripts/render.ts stills scene-s05 40 120   # preview stills
npm run studio     # Remotion Studio for interactive scrubbing
```

## Project layout

```
src/script/screenplay.ts     the screenplay as data (lines, beats, SFX, music, counters, ceremony clock)
src/characters/              rig, designs (3 leads + extras), character sheet
src/backgrounds/             all locations as SVG components
src/components/              stage/camera, HUD counters, RTL subtitles, ceremony kit, banners
src/scenes/S01–S14.tsx       per-scene direction (shots, staging, camera, expressions)
src/audio/AudioLayer.tsx     dialogue + SFX + ambience + music mix with ducking
src/render/Trailer.tsx       vertical trailer
scripts/                     build-audio, build-timeline, render, validate (+ lib: tts, synth, cache, retry, cost)
assets/                      voices, sfx, music, references, character sheets (Remotion public dir)
```

## Content notes

The film is rated 18+ for strong language, toilet humour, drunken behaviour and innuendo. The recurring plate ceremony is satire: the plate is shown empty, as a glowing "sacred artifact". The ceremony itself appears only as a gong, a two-hour clock, a synchronized bow, a choir and glitter cutaways, never as a substance or its use. Excrement is never shown; the jokes use sound, faces and doors.
