// Short: "בידה NASA — ניקיון ברמה אחרת". 35 s, 1920×1080, 24 fps.
// The heroine is built from a reference photo supplied (with her consent) by the user.
// She stays fully clothed throughout; the humour is purely physical and nobody is hurt.

import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Stage, Flash, SpeedLines } from '../components/Stage';
import { Character, OUT } from '../characters/Character';
import { Bathroom, ToiletBack, ToiletFront, PaperHolder } from '../backgrounds/Backgrounds';
import { FONT_TITLE, FONT_UI } from '../fonts';
import { ramp, keys, pop, hash01, lerp } from '../lib/anim';
import { SHORT_FPS as FPS, SHORT_LINES, SHORT_SFX, SHORT_MUSIC } from './bidetScript';
import data from '../generated/short-bidet.json';
import mainAudio from '../generated/audio.json';

const S = (sec: number) => Math.round(sec * FPS);
const DATA = data as unknown as { lines: Record<string, { file: string; duration: number; visemes: [number, string][] }>; sfx: Record<string, { file: string; duration: number }> };
const MAIN = mainAudio as unknown as { sfx: Record<string, { file: string; duration: number }>; music: Record<string, { file: string; duration: number }> };

/** Viseme from the TTS phoneme timings for whichever line is playing. */
function mouthAt(f: number): string | undefined {
  for (const l of SHORT_LINES) {
    const t = f / FPS - l.at;
    const d = DATA.lines[l.id];
    if (t < 0 || t > d.duration) continue;
    let v = 'X';
    for (const [ts, vv] of d.visemes) if (ts <= t) v = vv;
    return v;
  }
  return undefined;
}

type Expr = React.ComponentProps<typeof Character>['expr'];

/** The heroine sitting on her toilet; origin = floor under the bowl. */
const Rider: React.FC<{ f: number; expr: Expr; arms?: React.ComponentProps<typeof Character>['armR']; armL?: React.ComponentProps<typeof Character>['armL']; turn?: number; jet?: number; fx?: React.ComponentProps<typeof Character>['fx']; hair?: number }> = ({ f, expr, arms, armL, turn = 0, jet = 0, fx = [] }) => (
  <g>
    {jet > 0 && (
      <g>
        {/* water column below the toilet */}
        <path d={`M -70 20 Q ${-90 + Math.sin(f) * 10} ${300 * jet} -150 ${1400 * jet} L 150 ${1400 * jet} Q ${90 + Math.sin(f * 1.3) * 10} ${300 * jet} 70 20 Z`} fill="#6fd0ff" stroke={OUT} strokeWidth={5} opacity={0.92} />
        <path d={`M -20 40 Q ${-30 + Math.sin(f * 2) * 12} ${400 * jet} -40 ${1300 * jet}`} stroke="#e8fbff" strokeWidth={14} fill="none" opacity={0.8} />
        {Array.from({ length: 14 }, (_, i) => {
          const t = ((f * 3 + i * 17) % 60) / 60;
          return <circle key={i} cx={(hash01(i) - 0.5) * 300 * (0.5 + t)} cy={40 + t * 260} r={10 + hash01(i, 2) * 14} fill="#d6f4ff" stroke={OUT} strokeWidth={2} opacity={1 - t} />;
        })}
      </g>
    )}
    <ToiletBack x={0} y={-30} />
    <Character id="heroine" look="travel" x={0} y={0} scale={0.95} legs="sit" expr={expr} armR={arms ?? 'down'} armL={armL ?? arms ?? 'down'} turn={turn} mouth={mouthAt(f)} voice="none" fx={fx} still />
    <ToiletFront x={0} y={30} />
  </g>
);

const BidetPanel: React.FC<{ x: number; y: number; pressed: boolean; f: number }> = ({ x, y, pressed, f }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-70} y={-110} width={140} height={220} rx={20} fill="#f4f4f6" stroke={OUT} strokeWidth={5} />
    <text x={0} y={-70} textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={26} direction="rtl" fill="#333">
      בידה
    </text>
    <circle cx={0} cy={0} r={38} fill={pressed ? '#ff3b3b' : '#4a90d9'} stroke={OUT} strokeWidth={5} />
    {pressed && <circle cx={0} cy={0} r={46 + (f % 10) * 3} fill="none" stroke="#ff3b3b" strokeWidth={4} opacity={1 - (f % 10) / 10} />}
    <text x={0} y={70} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={22} fill={pressed ? '#e02424' : '#555'}>
      {pressed ? 'TURBO' : 'SOFT'}
    </text>
  </g>
);

const House: React.FC<{ f: number; burst: number }> = ({ f, burst }) => (
  <g>
    <rect x={560} y={560} width={800} height={520} fill="#f3e3c3" stroke={OUT} strokeWidth={6} />
    {[640, 1180].map((x) => (
      <rect key={x} x={x} y={660} width={120} height={140} fill="#9ad3f0" stroke={OUT} strokeWidth={5} />
    ))}
    <rect x={900} y={820} width={120} height={260} fill="#8a5a3a" stroke={OUT} strokeWidth={5} />
    {/* tiled roof with a hole where she went through */}
    <path d="M 500 580 L 960 300 L 1420 580 Z" fill="#c0503a" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
    {Array.from({ length: 6 }, (_, r) => (
      <line key={r} x1={560 + r * 40} y1={540 - r * 40} x2={1360 - r * 40} y2={540 - r * 40} stroke="#9c3a28" strokeWidth={4} />
    ))}
    {burst > 0 && <ellipse cx={960} cy={420} rx={120} ry={60} fill="#3a1d14" stroke={OUT} strokeWidth={5} />}
    {/* flying roof tiles */}
    {burst > 0 &&
      Array.from({ length: 22 }, (_, i) => {
        const t = burst;
        const a = -Math.PI / 2 + (hash01(i) - 0.5) * 2.2;
        const sp = 600 + hash01(i, 3) * 900;
        const x = 960 + Math.cos(a) * sp * t;
        const y = 420 + Math.sin(a) * sp * t + 900 * t * t;
        return <rect key={i} x={-28} y={-12} width={56} height={24} rx={4} fill="#c0503a" stroke={OUT} strokeWidth={3} transform={`translate(${x} ${y}) rotate(${f * 20 + i * 37})`} />;
      })}
    <rect x={0} y={1060} width={1920} height={40} fill="#6ab04c" />
    {/* house shake lines */}
    {burst > 0 && burst < 0.4 && [0, 1, 2].map((i) => <path key={i} d={`M ${520 - i * 30} ${700 + i * 60} q -20 20 0 40`} stroke={OUT} strokeWidth={5} fill="none" />)}
  </g>
);

const Cloud: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff" stroke={OUT} strokeWidth={5}>
    <path d="M -160 40 Q -170 -20 -100 -20 Q -80 -90 0 -70 Q 70 -110 110 -40 Q 180 -40 170 40 Z" />
  </g>
);

const Plane: React.FC<{ x: number; y: number; f: number }> = ({ x, y, f }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -420 0 Q -420 -60 -340 -60 L 300 -60 Q 420 -60 460 0 Q 420 50 300 50 L -340 50 Q -420 50 -420 0 Z" fill="#f4f6fa" stroke={OUT} strokeWidth={6} />
    <path d="M -80 0 L 80 0 L -60 170 L -140 170 Z" fill="#cfd6e3" stroke={OUT} strokeWidth={5} />
    <path d="M -400 -40 L -470 -170 L -380 -170 L -320 -50 Z" fill="#4a90d9" stroke={OUT} strokeWidth={5} />
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i}>
        <circle cx={-260 + i * 60} cy={-20} r={20} fill="#bfe8ff" stroke={OUT} strokeWidth={3} />
        <circle cx={-260 + i * 60} cy={-18} r={11} fill={['#f2c9a0', '#c98e62', '#e0ac85'][i % 3]} />
        <ellipse cx={-260 + i * 60} cy={-12} rx={4} ry={5 + (Math.floor(f / 4 + i) % 2) * 2} fill="#5a1620" />
      </g>
    ))}
    <text x={250} y={30} fontFamily={FONT_UI} fontWeight={800} fontSize={30} fill="#4a90d9" direction="rtl" textAnchor="middle">
      טיסה 2026
    </text>
  </g>
);

const Stars: React.FC<{ opacity: number; f: number; drift?: number }> = ({ opacity, f, drift = 0 }) => (
  <g opacity={opacity}>
    {Array.from({ length: 140 }, (_, i) => (
      <circle key={i} cx={(hash01(i, 1) * 1920 + drift) % 1920} cy={hash01(i, 2) * 1080} r={1.5 + hash01(i, 3) * 2.5 + (Math.sin(f * 0.2 + i) > 0.9 ? 1.5 : 0)} fill="#fff" />
    ))}
  </g>
);

const Station: React.FC<{ x: number; y: number; f: number; shock: number }> = ({ x, y, f, shock }) => (
  <g transform={`translate(${x} ${y})`}>
    {[-1, 1].map((s) => (
      <g key={s}>
        <rect x={s > 0 ? 260 : -660} y={-90} width={400} height={180} fill="#2f4f8f" stroke={OUT} strokeWidth={5} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={(s > 0 ? 260 : -660) + i * 50} y1={-90} x2={(s > 0 ? 260 : -660) + i * 50} y2={90} stroke="#6a8fd8" strokeWidth={3} />
        ))}
        <rect x={s > 0 ? 200 : -260} y={-14} width={60} height={28} fill="#bbb" stroke={OUT} strokeWidth={4} />
      </g>
    ))}
    <rect x={-200} y={-130} width={400} height={260} rx={60} fill="#e6e8ee" stroke={OUT} strokeWidth={6} />
    <circle cx={0} cy={0} r={90} fill="#0d1530" stroke={OUT} strokeWidth={6} />
    {/* astronaut behind the window */}
    <g>
      <circle cx={0} cy={10} r={70} fill="#f4f4f4" stroke={OUT} strokeWidth={4} />
      <ellipse cx={0} cy={10} rx={50} ry={44} fill="#f0c8a8" />
      <circle cx={-18} cy={2} r={9 + shock * 8} fill="#fff" stroke={OUT} strokeWidth={3} />
      <circle cx={18} cy={2} r={9 + shock * 8} fill="#fff" stroke={OUT} strokeWidth={3} />
      <circle cx={-18} cy={2} r={3} fill={OUT} />
      <circle cx={18} cy={2} r={3} fill={OUT} />
      <ellipse cx={0} cy={32} rx={8 + shock * 6} ry={6 + shock * 12} fill="#5a1620" />
    </g>
    <path d="M -60 -50 a 90 90 0 0 1 60 -30" stroke="#fff" strokeWidth={8} fill="none" opacity={0.5} />
    {/* floating mug, startled loose */}
    <g transform={`translate(${130 + shock * 60} ${-150 - shock * 40}) rotate(${f * 6})`}>
      <rect x={-18} y={-20} width={36} height={40} rx={6} fill="#ffd166" stroke={OUT} strokeWidth={3} />
    </g>
    <text x={0} y={175} textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={30} fill="#fff">
      ISS
    </text>
  </g>
);

const Moon: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#d9d6cc" stroke={OUT} strokeWidth={6} />
    {[[-0.3, -0.2, 0.18], [0.25, 0.1, 0.12], [-0.05, 0.4, 0.1], [0.35, -0.35, 0.08], [-0.45, 0.25, 0.07]].map(([dx, dy, rr], i) => (
      <circle key={i} cx={x + dx * r} cy={y + dy * r} r={rr * r} fill="#bfbab0" stroke="#a39f95" strokeWidth={3} />
    ))}
  </g>
);

const Rocket: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(35)`}>
    <path d="M 0 -80 Q 40 -40 30 40 L -30 40 Q -40 -40 0 -80 Z" fill="#f4f4f4" stroke={OUT} strokeWidth={5} />
    <circle cx={0} cy={-20} r={14} fill="#4a90d9" stroke={OUT} strokeWidth={4} />
    <path d="M -30 20 L -55 55 L -30 45 Z M 30 20 L 55 55 L 30 45 Z" fill="#e02424" stroke={OUT} strokeWidth={4} />
    <path d={`M -18 44 Q 0 ${90 + (f % 4) * 8} 18 44 Z`} fill="#ffb31a" stroke={OUT} strokeWidth={3} />
  </g>
);

const Subtitle: React.FC<{ f: number }> = ({ f }) => {
  const l = SHORT_LINES.find((x) => f / FPS >= x.at && f / FPS <= x.at + DATA.lines[x.id].duration + 0.3);
  if (!l) return null;
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none' }}>
      <div dir="rtl" style={{ marginBottom: 54, padding: '10px 28px 14px', borderRadius: 16, background: 'rgba(8,8,16,0.55)', fontFamily: FONT_UI, fontWeight: 800, fontSize: 48, color: '#fff', textShadow: '0 3px 0 #000' }}>
        {l.he}
      </div>
    </AbsoluteFill>
  );
};

const AudioMix: React.FC = () => (
  <>
    {SHORT_LINES.map((l) => (
      <Sequence key={l.id} from={S(l.at)} durationInFrames={Math.ceil(DATA.lines[l.id].duration * FPS) + 4}>
        <Audio src={staticFile(DATA.lines[l.id].file)} />
      </Sequence>
    ))}
    {SHORT_SFX.map((c, i) => {
      const src = DATA.sfx[c.s] ?? MAIN.sfx[c.s];
      return (
        <Sequence key={i} from={S(c.at)} durationInFrames={Math.ceil(src.duration * FPS) + 2}>
          <Audio src={staticFile(src.file)} volume={0.75 * (c.vol ?? 1)} />
        </Sequence>
      );
    })}
    {SHORT_MUSIC.map((m, i) => {
      const len = S(m.to) - S(m.from);
      return (
        <Sequence key={i} from={S(m.from)} durationInFrames={len}>
          <Audio
            src={staticFile(MAIN.music[m.track].file)}
            loop
            volume={(fr) => {
              const abs = (S(m.from) + fr) / FPS;
              const talking = SHORT_LINES.some((l) => abs >= l.at && abs <= l.at + DATA.lines[l.id].duration);
              return m.vol * (talking ? 0.5 : 1) * interpolate(fr, [0, 8, len - 10, len], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            }}
          />
        </Sequence>
      );
    })}
  </>
);

export const BidetNasa: React.FC = () => {
  const f = useCurrentFrame();
  let scene: React.ReactNode;

  if (f < S(7)) {
    // ── 0–7 s: she walks in, sits (modest framing), sighs with relief ──
    const walkT = ramp(f, S(0.4), S(2.4), (x) => x);
    const x = lerp(-250, 960, walkT);
    const seated = f >= S(2.8);
    const sitPop = pop(f, S(2.8), 8);
    scene = (
      <Stage cam={{ zoom: lerp(1.0, 1.35, ramp(f, S(3), S(7))), cx: 1000, cy: 600 }}>
        <Bathroom f={f} tile="#f8d7e3" tile2="#f2c4d6" w={1920} />
        <rect x={60} y={260} width={260} height={620} fill="#e8e8f0" stroke={OUT} strokeWidth={5} />
        <BidetPanel x={1260} y={640} pressed={false} f={f} />
        <PaperHolder x={680} y={640} f={f} />
        {seated ? (
          <g transform={`translate(960 1010) scale(${1 + (1 - sitPop) * 0.08} ${1 - (1 - sitPop) * 0.08})`}>
            <Rider f={f} expr={f >= S(3.4) ? 'happy' : 'neutral'} />
          </g>
        ) : (
          <g>
            <ToiletBack x={960} y={980} />
            <Character id="heroine" look="travel" x={x} y={1010} scale={0.95} legs={walkT < 1 ? 'walk' : 'stand'} phase={f / 12} turn={walkT < 1 ? 1 : 0} expr="neutral" voice="none" still />
            <ToiletFront x={960} y={1040} />
          </g>
        )}
      </Stage>
    );
  } else if (f < S(13)) {
    // ── 7–13 s: the bidet button, a jet engine, zoom on her face ──
    const pressed = f >= S(8.2);
    const rumble = ramp(f, S(8.4), S(12.6), (t) => t * t);
    const zoom = keys(f, [[S(9.0), 1.25], [S(9.6), 2.6]]);
    const flicker = f >= S(11.5) && Math.floor(f / 3) % 3 === 0;
    scene = (
      <Stage cam={{ zoom, cx: lerp(1080, 960, ramp(f, S(9), S(9.6))), cy: lerp(620, 655, ramp(f, S(9), S(9.6))), shake: rumble * 14 }}>
        <Bathroom f={f} tile="#f8d7e3" tile2="#f2c4d6" w={1920} />
        <BidetPanel x={1260} y={640} pressed={pressed} f={f} />
        <PaperHolder x={680} y={640} f={f} />
        <g transform={`translate(960 1010) rotate(${Math.sin(f * 2.1) * rumble * 3})`}>
          <Rider f={f} expr={f < S(8.6) ? 'happy' : f < S(9.4) ? 'shock' : 'panic'} arms={f < S(8.7) ? [72, 14] : 'clutchHead'} armL={f < S(8.7) ? 'down' : 'clutchHead'} fx={f >= S(9.4) ? ['sweat'] : []} />
        </g>
        {rumble > 0.1 &&
          Array.from({ length: 6 }, (_, i) => {
            const t = ((f + i * 7) % 30) / 30;
            return <circle key={i} cx={960 + (i - 2.5) * 70} cy={1000 - t * 120} r={20 + t * 30} fill="#ffffff" opacity={0.6 * (1 - t) * rumble} />;
          })}
        {flicker && <rect width={1920} height={1080} fill="#000" opacity={0.35} />}
      </Stage>
    );
  } else if (f < S(21)) {
    // ── 13–21 s: launch through the roof ──
    const t0 = S(13);
    if (f < S(13.6)) {
      const up = ramp(f, t0, S(13.6), (x) => x * x);
      scene = (
        <Stage cam={{ zoom: 1.0, shake: 16 }}>
          <Bathroom f={f} tile="#f8d7e3" tile2="#f2c4d6" w={1920} />
          <g transform={`translate(960 ${1010 - up * 1400})`}>
            <Rider f={f} expr="panic" arms="up" jet={1} fx={['sweat']} />
          </g>
          <SpeedLines f={f} color="#bfefff" opacity={0.6} />
          <Flash opacity={Math.max(0, 0.8 - (f - t0) / 5)} />
        </Stage>
      );
    } else {
      const ft = f - S(13.6);
      const riderY = 700 - ft * 26; // stage-space y of the toilet base
      const camY = Math.min(540, riderY - 20);
      const burst = ramp(f, S(13.7), S(15.5), (x) => x);
      scene = (
        <Stage bg="#7fd3ff" cam={{ zoom: 0.9, cx: 960, cy: camY, shake: ft < 20 ? 10 : 3 }}>
          <rect x={-1000} y={-12000} width={4000} height={13200} fill="#7fd3ff" />
          {Array.from({ length: 10 }, (_, i) => (
            <Cloud key={i} x={200 + hash01(i, 4) * 1500} y={-400 - i * 900} s={0.8 + hash01(i, 5) * 0.8} />
          ))}
          <House f={f} burst={burst} />
          <g transform={`translate(960 ${riderY})`}>
            <Rider f={f} expr="panic" arms="up" jet={1} fx={['sweat', 'tears']} />
          </g>
        </Stage>
      );
    }
  } else if (f < S(29)) {
    // ── 21–29 s: clouds, a passing plane, space, a shocked astronaut ──
    const p = (f - S(21)) / (S(29) - S(21));
    const sky = interpolate(p, [0, 0.45, 0.65, 1], [0, 0.3, 0.92, 1]);
    const cloudOff = (f - S(21)) * 38;
    const planeX = interpolate(f, [S(23.4), S(25.4)], [2500, -700], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const stationX = interpolate(f, [S(26.4), S(28.4)], [2600, 1180], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - (1 - x) ** 3 });
    const shock = ramp(f, S(27.4), S(28));
    const riderX = interpolate(f, [S(26.4), S(29)], [760, 520], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    scene = (
      <Stage bg="#000">
        <rect width={1920} height={1080} fill="#7fd3ff" />
        <rect width={1920} height={1080} fill="#060818" opacity={sky} />
        <Stars opacity={ramp(p, 0.5, 0.8, (x) => x)} f={f} />
        {p < 0.6 &&
          Array.from({ length: 12 }, (_, i) => {
            const y = ((hash01(i, 7) * 1600 + cloudOff * (0.7 + hash01(i, 8) * 0.6)) % 1700) - 300;
            return <Cloud key={i} x={hash01(i, 9) * 1920} y={y} s={0.6 + hash01(i, 6)} />;
          })}
        {f >= S(23.4) && f < S(25.6) && <Plane x={planeX} y={620} f={f} />}
        {f >= S(26.4) && <Station x={stationX} y={360} f={f} shock={shock} />}
        <g transform={`translate(${riderX} ${760 + Math.sin(f * 0.15) * 14}) scale(0.62) rotate(${Math.sin(f * 0.1) * 6})`}>
          <Rider f={f} expr={p < 0.55 ? 'panic' : 'shock'} arms={p < 0.55 ? 'up' : 'out'} jet={p < 0.55 ? 0.35 : 0} fx={p < 0.55 ? ['sweat'] : []} />
        </g>
        {p < 0.55 && <SpeedLines f={f} color="#ffffff" opacity={0.25} />}
      </Stage>
    );
  } else {
    // ── 29–35 s: floating by the moon, deadpan to camera, title ──
    const titleP = pop(f, S(33), 12);
    scene = (
      <Stage bg="#050714" cam={{ zoom: lerp(1.05, 1.0, ramp(f, S(29), S(35))) }}>
        <Stars opacity={1} f={f} drift={(f - S(29)) * 0.6} />
        <circle cx={260} cy={220} r={70} fill="#3a86ff" stroke={OUT} strokeWidth={5} />
        <path d="M 220 190 q 30 -20 60 10 q -10 30 -50 30 z" fill="#6ab04c" />
        <Moon x={1500} y={620} r={420} />
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={700 + hash01(i, 11) * 500 + Math.sin(f * 0.05 + i) * 20} cy={300 + hash01(i, 12) * 500 + Math.cos(f * 0.05 + i) * 20} r={8 + hash01(i, 13) * 10} fill="#9fe0ff" stroke={OUT} strokeWidth={2} opacity={0.8} />
        ))}
        <g transform={`translate(800 ${830 + Math.sin(f * 0.12) * 18}) rotate(${Math.sin(f * 0.07) * 8}) scale(0.85)`}>
          <Rider f={f} expr={f >= S(29.6) ? 'smug' : 'neutral'} arms={f >= S(30) ? 'shrug' : 'out'} />
        </g>
        {f >= S(33) && (
          <g transform={`translate(960 170) scale(${titleP})`}>
            <rect x={-760} y={-110} width={1520} height={220} rx={36} fill="#111" stroke="#ffd34d" strokeWidth={8} opacity={0.92} />
            <text x={60} y={-10} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={96} fill="#ffd34d" direction="rtl">
              בידה NASA
            </text>
            <text x={60} y={78} textAnchor="middle" fontFamily={FONT_TITLE} fontSize={58} fill="#fff" direction="rtl">
              ניקיון ברמה אחרת
            </text>
            <Rocket x={-560} y={0} s={1.1} f={f} />
          </g>
        )}
      </Stage>
    );
  }

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {scene}
      <Subtitle f={f} />
      <AudioMix />
    </AbsoluteFill>
  );
};
