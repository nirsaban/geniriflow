// Render orchestrator (Remotion + headless Chromium).
//   tsx scripts/render.ts sheets                 – character sheets → assets/characters/*.png
//   tsx scripts/render.ts stills <comp> f1 f2…   – preview stills → output/previews
//   tsx scripts/render.ts preview <sceneId>      – one scene → output/previews/<id>.mp4 (half-res)
//   tsx scripts/render.ts poc                    – output/proof-of-concept.mp4
//   tsx scripts/render.ts movie                  – output/movie-final.mp4 (+ muxed subtitle track)
//   tsx scripts/render.ts trailer                – output/trailer-vertical.mp4

import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { mkdirSync, existsSync, renameSync, rmSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from './lib/exec.js';
import { record } from './lib/cost.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'output');
const BROWSER = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
mkdirSync(join(OUT, 'previews'), { recursive: true });

const [mode, ...args] = process.argv.slice(2);

async function getBundle() {
  const t = Date.now();
  const url = await bundle({
    entryPoint: join(ROOT, 'src', 'index.ts'),
    publicDir: join(ROOT, 'assets'),
    webpackOverride: (c) => c,
  });
  console.log(`bundled in ${((Date.now() - t) / 1000).toFixed(1)}s`);
  return url;
}

function progressLogger(label: string) {
  let last = -1;
  const t0 = Date.now();
  return ({ progress, renderedFrames, encodedFrames }: { progress: number; renderedFrames: number; encodedFrames: number }) => {
    const pct = Math.floor(progress * 100);
    if (pct !== last && pct % 2 === 0) {
      last = pct;
      const el = (Date.now() - t0) / 1000;
      const eta = progress > 0 ? el / progress - el : 0;
      console.log(`[${label}] ${pct}%  rendered ${renderedFrames}  encoded ${encodedFrames}  elapsed ${el.toFixed(0)}s  eta ${eta.toFixed(0)}s`);
    }
  };
}

async function renderVideo(serveUrl: string, id: string, file: string, opts: { scale?: number; inputProps?: Record<string, unknown>; crf?: number } = {}) {
  const composition = await selectComposition({ serveUrl, id, inputProps: opts.inputProps ?? {}, browserExecutable: BROWSER });
  const tmp = file.replace(/\.mp4$/, '.tmp.mp4');
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    audioCodec: 'aac',
    audioBitrate: '192k',
    crf: opts.crf ?? 18,
    pixelFormat: 'yuv420p',
    outputLocation: tmp,
    inputProps: opts.inputProps ?? {},
    browserExecutable: BROWSER,
    scale: opts.scale ?? 1,
    concurrency: Number(process.env.CONCURRENCY ?? 4),
    imageFormat: 'jpeg',
    jpegQuality: 92,
    timeoutInMilliseconds: 120000,
    chromiumOptions: { gl: 'swangle' },
    onProgress: progressLogger(id),
  });
  renameSync(tmp, file);
  record('local:remotion', `render ${id}`, composition.durationInFrames, 0);
  console.log(`wrote ${file}`);
}

async function main() {
  if (mode === 'trailer') {
    // the trailer cuts from the rendered film; it must be in the public dir before bundling
    mkdirSync(join(ROOT, 'assets', 'render'), { recursive: true });
    copyFileSync(join(OUT, 'movie-final.mp4'), join(ROOT, 'assets', 'render', 'movie-final.mp4'));
  }
  const serveUrl = await getBundle();
  switch (mode) {
    case 'sheets': {
      const dir = join(ROOT, 'assets', 'characters');
      mkdirSync(dir, { recursive: true });
      for (const id of ['nir', 'roee', 'marom']) {
        const composition = await selectComposition({ serveUrl, id: `sheet-${id}`, browserExecutable: BROWSER });
        await renderStill({ serveUrl, composition, output: join(dir, `${id}-sheet.png`), browserExecutable: BROWSER });
        console.log(`wrote assets/characters/${id}-sheet.png`);
      }
      break;
    }
    case 'stills': {
      const [id, ...frames] = args;
      const composition = await selectComposition({ serveUrl, id, browserExecutable: BROWSER });
      for (const fr of frames) {
        const out = join(OUT, 'previews', `${id}-${fr}.png`);
        await renderStill({ serveUrl, composition, output: out, frame: Number(fr), scale: Number(process.env.SCALE ?? 0.5), browserExecutable: BROWSER });
        console.log(out);
      }
      break;
    }
    case 'preview': {
      for (const sid of args) await renderVideo(serveUrl, `scene-${sid}`, join(OUT, 'previews', `${sid}.mp4`), { scale: 0.5, crf: 26 });
      break;
    }
    case 'poc':
      await renderVideo(serveUrl, 'poc', join(OUT, 'proof-of-concept.mp4'));
      break;
    case 'movie': {
      const raw = join(OUT, 'movie-raw.mp4');
      await renderVideo(serveUrl, 'movie', raw);
      // mux the Hebrew subtitle track (soft subs) alongside the burned-in ones
      run('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-i', join(OUT, 'subtitles-he.srt'), '-map', '0', '-map', '1', '-c', 'copy', '-c:s', 'mov_text', '-metadata:s:s:0', 'language=heb', '-metadata:s:s:0', 'title=עברית', '-movflags', '+faststart', join(OUT, 'movie-final.mp4')]);
      rmSync(raw, { force: true });
      console.log('wrote output/movie-final.mp4');
      break;
    }
    case 'short':
      await renderVideo(serveUrl, 'bidet-nasa', join(OUT, 'bidet-nasa.mp4'));
      break;
    case 'trailer': {
      if (!existsSync(join(OUT, 'movie-final.mp4'))) throw new Error('render the movie first');

      await renderVideo(serveUrl, 'trailer', join(OUT, 'trailer-vertical.mp4'));
      break;
    }
    default:
      throw new Error(`unknown mode ${mode}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
