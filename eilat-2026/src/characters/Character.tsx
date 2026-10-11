// Reusable 2D cartoon character rig, rendered as SVG every frame.
// Features: head turn (front → three-quarter → profile), blinking, eyelids,
// brows and pupils per expression, phoneme-driven mouth shapes (lip-sync from
// the TTS phoneme timings), two-segment arms with pose presets and hand props,
// walk / run / sit leg cycles, bow, squash & stretch, idle breathing and
// comedic FX (sweat, blush, hearts, stink lines, anger veins, zzz).

import React, { useId } from 'react';
import { DESIGNS, EXTRAS, type CharId, type ExtraId, type Look, type Design, type Outfit } from './designs';
import { visemeAt, useScene } from '../lib/timeline';
import { hash01 } from '../lib/anim';

export const OUT = '#16141a';
const SW = 5;

export type Expr =
  | 'neutral'
  | 'happy'
  | 'angry'
  | 'laugh'
  | 'hungover'
  | 'panic'
  | 'flirt'
  | 'shock'
  | 'solemn'
  | 'wide'
  | 'smug'
  | 'sad'
  | 'sleep'
  | 'disgust'
  | 'strain';

export type ArmPose =
  | 'down'
  | 'hips'
  | 'point'
  | 'pointUp'
  | 'wave'
  | 'up'
  | 'shrug'
  | 'facepalm'
  | 'front'
  | 'clutchHead'
  | 'cover'
  | 'pray'
  | 'flex'
  | 'sip'
  | 'reach'
  | 'swing'
  | 'run'
  | 'out'
  | 'mirror'
  | 'steer'
  | 'type';

export type Prop =
  | 'laptop'
  | 'drink'
  | 'phone'
  | 'broom'
  | 'remote'
  | 'suitcase'
  | 'roll'
  | 'perfume'
  | 'comb'
  | 'bill'
  | 'bag'
  | 'sunglasses'
  | 'umbrella'
  | 'tube';

export interface CharacterProps {
  id: CharId | ExtraId;
  look?: Look;
  x: number;
  y: number;
  scale?: number;
  /** -1 … 1: 0 = facing camera, ±0.5 = three-quarter, ±1 = profile (sign = direction) */
  turn?: number;
  headTurn?: number;
  expr?: Expr;
  armL?: ArmPose | [number, number];
  armR?: ArmPose | [number, number];
  crossed?: boolean;
  propL?: Prop;
  propR?: Prop;
  legs?: 'stand' | 'walk' | 'run' | 'sit' | 'none';
  /** walk/run cycle phase in cycles (e.g. frame / 14) */
  phase?: number;
  bow?: number; // 0..1
  tilt?: number; // head tilt degrees
  lean?: number; // whole-body lean degrees
  squash?: number; // -1 … 1
  gaze?: [number, number];
  /** override mouth: a viseme letter or 'auto' (lip-sync) */
  mouth?: string;
  /** lip-sync speaker id override (e.g. extras speaking as 'girl') */
  voice?: string;
  blink?: boolean;
  fx?: ('sweat' | 'blush' | 'hearts' | 'stink' | 'vein' | 'zzz' | 'stars' | 'twitch' | 'shine' | 'tears' | 'redface')[];
  opacity?: number;
  /** skip auto talk gestures */
  still?: boolean;
  wet?: boolean;
}

const ARM_POSES: Record<ArmPose, [number, number]> = {
  down: [6, 4],
  hips: [38, -118],
  point: [96, 4],
  pointUp: [165, 0],
  wave: [140, 25],
  up: [160, 15],
  shrug: [48, 95],
  facepalm: [12, -158],
  front: [14, -78],
  clutchHead: [150, -125],
  cover: [10, -48],
  pray: [26, -132],
  flex: [92, 95],
  sip: [10, -150],
  reach: [70, 10],
  swing: [20, 0],
  run: [30, -80],
  out: [60, 0],
  mirror: [40, -95],
  steer: [35, -95],
  type: [18, -72],
};

const resolveArm = (a: ArmPose | [number, number] | undefined): [number, number] =>
  a === undefined ? ARM_POSES.down : typeof a === 'string' ? ARM_POSES[a] : a;

export const Character: React.FC<CharacterProps> = (p) => {
  const uid = useId().replace(/:/g, '');
  const { abs } = useScene();
  const d: Design = (DESIGNS as Record<string, Design>)[p.id] ?? EXTRAS[p.id as ExtraId];
  const o: Outfit = d.outfits[p.look ?? 'travel'];
  const s = p.scale ?? 1;
  const turn = p.turn ?? 0;
  const headTurn = p.headTurn ?? turn;
  const dir = turn === 0 ? 1 : Math.sign(turn);
  const seed = p.id.length * 13 + p.id.charCodeAt(0);

  // lip sync
  const voiceId = p.voice ?? p.id;
  const vis = p.mouth && p.mouth !== 'auto' ? null : visemeAt(voiceId, abs);
  const talking = !!vis && vis.v !== 'X';
  const viseme = p.mouth && p.mouth !== 'auto' ? p.mouth : vis?.v ?? null;
  const loud = vis?.line ? /[!]/.test(vis.line.he ?? '') : false;

  // idle motion
  const breath = Math.sin(abs * 0.12 + seed) * 0.012;
  const talkNod = talking ? Math.sin(abs * 0.9 + seed) * 1.6 : 0;

  // blink: every ~2.5–4.5 s for 3 frames
  const period = 70 + Math.floor(hash01(seed) * 40);
  const bt = (abs + seed * 7) % period;
  const blinking = p.blink ?? bt < 3;

  // legs
  const legsMode = p.legs ?? 'stand';
  const ph = (p.phase ?? 0) * Math.PI * 2;
  const swingAmp = legsMode === 'run' ? 40 : legsMode === 'walk' ? 24 : 0;
  const legSwing = Math.sin(ph) * swingAmp;
  const bob = legsMode === 'walk' ? -Math.abs(Math.sin(ph)) * 8 : legsMode === 'run' ? -Math.abs(Math.sin(ph)) * 18 : 0;
  const sitDrop = legsMode === 'sit' ? d.legLen * 0.42 : 0;

  // arms (auto gesture while talking if arms idle)
  let aL = resolveArm(p.armL);
  let aR = resolveArm(p.armR);
  if (legsMode === 'walk' || legsMode === 'run') {
    const k = legsMode === 'run' ? 1.4 : 0.8;
    if (p.armL === undefined || p.armL === 'swing') aL = legsMode === 'run' ? [30 + legSwing * k * 0.6, -80] : [6 + legSwing * k * 0.5, 6];
    if (p.armR === undefined || p.armR === 'swing') aR = legsMode === 'run' ? [30 - legSwing * k * 0.6, -80] : [6 - legSwing * k * 0.5, 6];
  }
  if (talking && !p.still && !p.crossed) {
    const g = Math.sin(abs * 0.35 + seed) * 10;
    const free = dir > 0 ? 'R' : 'L';
    if (free === 'R' && (p.armR === undefined || p.armR === 'down')) aR = [28 + g, -55 + g * 1.5];
    if (free === 'L' && (p.armL === undefined || p.armL === 'down')) aL = [28 + g, -55 + g * 1.5];
  }
  if (p.armL === 'wave') aL = [aL[0], aL[1] + Math.sin(abs * 0.6) * 25];
  if (p.armR === 'wave') aR = [aR[0], aR[1] + Math.sin(abs * 0.6) * 25];

  const absT = Math.abs(turn);
  const tw = d.torsoW * (1 - 0.32 * absT) * (1 + breath);
  const hipY = -d.legLen + sitDrop;
  const shY = hipY - d.torsoH;
  const headY = shY - d.headH * 0.4;
  const bow = p.bow ?? 0;
  const profileBow = absT >= 0.45;
  const bowRot = profileBow ? bow * 72 * dir : 0;
  const frontBow = profileBow ? 0 : bow;
  const sq = p.squash ?? 0;

  const skinArms = o.sleeves === 'none';
  const upperColor = skinArms ? d.skin : o.top;
  const lowerColor = o.sleeves === 'long' ? o.top : d.skin;

  const arm = (side: -1 | 1, ang: [number, number], prop?: Prop, behind = false) => {
    const [sh, el] = ang;
    const sx = side * (tw / 2 - d.armW * 0.25);
    const sy = shY + 20;
    const L1 = 88, L2 = 82;
    const r1 = -side * sh;
    const r2 = -side * el;
    const aw = d.armW;
    const dim = behind ? 0.82 : 1;
    return (
      <g transform={`translate(${sx},${sy}) rotate(${r1})`} opacity={1} style={{ filter: behind ? 'brightness(0.82)' : undefined }}>
        <rect x={-aw / 2} y={-aw * 0.3} width={aw} height={L1 + aw * 0.4} rx={aw / 2} fill={upperColor} stroke={OUT} strokeWidth={SW} />
        <g transform={`translate(0,${L1}) rotate(${r2})`}>
          <rect x={-aw * 0.46} y={-aw * 0.35} width={aw * 0.92} height={L2 + aw * 0.35} rx={aw * 0.46} fill={lowerColor} stroke={OUT} strokeWidth={SW} />
          {o.sleeves === 'long' && <rect x={-aw * 0.5} y={L2 - 10} width={aw} height={12} rx={4} fill={o.topDark} stroke={OUT} strokeWidth={SW * 0.7} />}
          <g transform={`translate(0,${L2 + 6})`}>
            {prop && <g transform={`rotate(${-(r1 + r2)})`}>{renderProp(prop, side, abs)}</g>}
            <circle r={aw * 0.62} fill={d.skin} stroke={OUT} strokeWidth={SW} />
            <path d={`M ${-aw * 0.3} ${aw * 0.1} q ${aw * 0.3} ${aw * 0.35} ${aw * 0.6} 0`} stroke={OUT} strokeWidth={2.5} fill="none" opacity={0.6} />
          </g>
        </g>
        {dim < 1 && null}
      </g>
    );
  };

  // which arm is behind the torso in profile
  const farSide: -1 | 1 = dir > 0 ? -1 : 1;
  const armsBehind = absT >= 0.6;

  const leg = (side: -1 | 1) => {
    const hx = side * tw * 0.22;
    const lw = d.legW;
    const swing = side === -1 ? legSwing : -legSwing;
    const rot = absT >= 0.45 ? swing * dir : swing * 0.35;
    if (legsMode === 'none') return null;
    if (legsMode === 'sit') {
      // thighs foreshortened toward camera (or sideways in profile), shins down
      const thighLen = absT >= 0.45 ? d.legLen * 0.48 : d.legLen * 0.16;
      const kx = absT >= 0.45 ? hx + dir * thighLen : hx * 1.15;
      const shin = d.legLen * 0.52;
      return (
        <g>
          <path d={`M ${hx - lw / 2} ${hipY} L ${kx - lw / 2} ${hipY + 6} L ${kx + lw / 2} ${hipY + 6} L ${hx + lw / 2} ${hipY} Z`} fill={o.bottom} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          <rect x={kx - lw / 2} y={hipY} width={lw} height={shin} rx={lw / 2.4} fill={o.bottomStyle === 'shorts' ? d.skin : o.bottom} stroke={OUT} strokeWidth={SW} />
          {o.bottomStyle === 'shorts' && <rect x={kx - lw / 2 - 2} y={hipY - 4} width={lw + 4} height={22} rx={8} fill={o.bottom} stroke={OUT} strokeWidth={SW} />}
          <ellipse cx={kx + dir * (absT >= 0.45 ? 14 : 0)} cy={hipY + shin} rx={lw * 0.75} ry={lw * 0.36} fill={o.shoes} stroke={OUT} strokeWidth={SW} />
        </g>
      );
    }
    const L = d.legLen;
    const shortsLen = L * 0.42;
    return (
      <g transform={`translate(${hx},${hipY}) rotate(${rot})`}>
        <rect x={-lw / 2} y={-6} width={lw} height={L} rx={lw / 2.4} fill={o.bottomStyle === 'shorts' ? d.skin : o.bottom} stroke={OUT} strokeWidth={SW} />
        {o.bottomStyle === 'shorts' && <rect x={-lw / 2 - 3} y={-8} width={lw + 6} height={shortsLen} rx={10} fill={o.bottom} stroke={OUT} strokeWidth={SW} />}
        {o.bottomStyle === 'pants' && <line x1={side * lw * 0.12} y1={10} x2={side * lw * 0.12} y2={L - 12} stroke={o.bottomDark} strokeWidth={3} />}
        <ellipse cx={absT >= 0.45 ? dir * 14 : side * 8} cy={L - 4} rx={lw * 0.82} ry={lw * 0.38} fill={o.shoes} stroke={OUT} strokeWidth={SW} />
      </g>
    );
  };

  const torso = () => {
    const bw = tw * (0.86 + d.belly * 0.2);
    const top = shY;
    const bot = hipY + 6;
    const bellyBulge = d.belly * 26;
    const female = d.female;
    const waist = female ? tw * 0.36 : bw / 2;
    const midY = (top + bot) / 2 + 20;
    const path = female
      ? `M ${-tw / 2} ${top + 22} Q ${-tw / 2} ${top} ${-tw / 2 + 22} ${top} L ${tw / 2 - 22} ${top} Q ${tw / 2} ${top} ${tw / 2} ${top + 22} Q ${waist + 4} ${midY} ${bw / 2 + 4} ${bot} L ${-bw / 2 - 4} ${bot} Q ${-waist - 4} ${midY} ${-tw / 2} ${top + 22} Z`
      : `M ${-tw / 2} ${top + 26} Q ${-tw / 2} ${top} ${-tw / 2 + 26} ${top} L ${tw / 2 - 26} ${top} Q ${tw / 2} ${top} ${tw / 2} ${top + 26} Q ${bw / 2 + bellyBulge} ${(top + bot) / 2 + 30} ${bw / 2} ${bot} L ${-bw / 2} ${bot} Q ${-bw / 2 - bellyBulge} ${(top + bot) / 2 + 30} ${-tw / 2} ${top + 26} Z`;
    const cx = turn * tw * 0.18;
    const fill = o.topStyle === 'bare' ? d.skin : o.topStyle === 'swim' ? d.skin : o.top;
    const patId = `pat-${uid}`;
    return (
      <g>
        {o.pattern && (
          <defs>
            <pattern id={patId} width={o.pattern === 'plaid' ? 36 : 54} height={o.pattern === 'plaid' ? 36 : 54} patternUnits="userSpaceOnUse">
              {o.pattern === 'flowers' && (
                <g fill={o.patternColor}>
                  <circle cx={14} cy={14} r={7} />
                  <circle cx={40} cy={38} r={6} />
                  <circle cx={14} cy={14} r={2.5} fill="#fff" />
                </g>
              )}
              {o.pattern === 'plaid' && (
                <g stroke={o.patternColor} strokeWidth={5} opacity={0.6}>
                  <line x1={0} y1={9} x2={36} y2={9} />
                  <line x1={9} y1={0} x2={9} y2={36} />
                </g>
              )}
            </pattern>
          </defs>
        )}
        <path d={path} fill={fill} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
        {o.pattern && (o.topStyle !== 'bare' || o.pattern !== 'flowers') && o.topStyle !== 'bare' && <path d={path} fill={`url(#${patId})`} />}
        {/* belly shading */}
        <path d={`M ${-bw / 2 + 10} ${bot - 30} Q 0 ${bot - 10} ${bw / 2 - 10} ${bot - 30}`} stroke={o.topStyle === 'bare' ? d.skinShade : o.topDark} strokeWidth={6} fill="none" opacity={0.7} />
        {o.topStyle === 'bare' && (
          <g stroke={d.skinShade} strokeWidth={4} fill="none">
            <path d={`M ${cx - tw * 0.32} ${top + 60} Q ${cx - tw * 0.16} ${top + 78} ${cx - 4} ${top + 64}`} />
            <path d={`M ${cx + tw * 0.32} ${top + 60} Q ${cx + tw * 0.16} ${top + 78} ${cx + 4} ${top + 64}`} />
            <circle cx={cx} cy={top + 140} r={4} fill={d.skinShade} />
          </g>
        )}
        {o.topStyle === 'swim' && (
          <g>
            <path d={`M ${cx - tw * 0.38} ${top + 44} Q ${cx - tw * 0.2} ${top + 30} ${cx - 3} ${top + 46} L ${cx - 3} ${top + 74} Q ${cx - tw * 0.2} ${top + 84} ${cx - tw * 0.38} ${top + 70} Z`} fill={o.top} stroke={OUT} strokeWidth={4} />
            <path d={`M ${cx + tw * 0.38} ${top + 44} Q ${cx + tw * 0.2} ${top + 30} ${cx + 3} ${top + 46} L ${cx + 3} ${top + 74} Q ${cx + tw * 0.2} ${top + 84} ${cx + tw * 0.38} ${top + 70} Z`} fill={o.top} stroke={OUT} strokeWidth={4} />
            <path d={`M ${-bw / 2 - 2} ${bot - 34} L ${bw / 2 + 2} ${bot - 34} L ${bw / 2 + 4} ${bot} L ${-bw / 2 - 4} ${bot} Z`} fill={o.top} stroke={OUT} strokeWidth={4} />
          </g>
        )}
        {o.topStyle === 'crop' && <path d={`M ${-bw / 2 - 2} ${bot - 46} L ${bw / 2 + 2} ${bot - 46} L ${bw / 2 + 4} ${bot} L ${-bw / 2 - 4} ${bot} Z`} fill={d.skin} stroke={OUT} strokeWidth={4} />}
        {o.topStyle === 'dress' && <path d={`M ${-bw / 2 - 4} ${bot - 4} L ${bw / 2 + 4} ${bot - 4} L ${bw / 2 + 30} ${bot + 70} L ${-bw / 2 - 30} ${bot + 70} Z`} fill={o.top} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />}
        {o.topStyle === 'turtleneck' && (
          <g>
            <rect x={cx - 34} y={top - 26} width={68} height={40} rx={14} fill={o.top} stroke={OUT} strokeWidth={SW} />
            <path d={`M ${cx - 30} ${top - 10} Q ${cx} ${top - 2} ${cx + 30} ${top - 10}`} stroke={o.topDark} strokeWidth={3} fill="none" />
            <path d={`M ${cx - 28} ${top + 2} Q ${cx} ${top + 10} ${cx + 28} ${top + 2}`} stroke={o.topDark} strokeWidth={3} fill="none" />
            {/* drawstring from the reference photo */}
            <line x1={cx + 6} y1={top + 14} x2={cx + 10} y2={top + 110} stroke="#555" strokeWidth={2} />
          </g>
        )}
        {o.topStyle === 'tank' && (
          <path d={`M ${cx - tw * 0.22} ${top + 2} Q ${cx} ${top + 50} ${cx + tw * 0.22} ${top + 2}`} fill={d.skin} stroke={OUT} strokeWidth={SW} />
        )}
        {(o.topStyle === 'tee' || o.topStyle === 'pajama' || o.topStyle === 'crop') && (
          <path d={`M ${cx - 30} ${top + 1} Q ${cx} ${top + 26} ${cx + 30} ${top + 1}`} fill={d.skin} stroke={OUT} strokeWidth={SW} />
        )}
        {(o.topStyle === 'polo' || o.topStyle === 'shirt') && (
          <g>
            <path d={`M ${cx - 32} ${top - 4} L ${cx} ${top + 30} L ${cx + 32} ${top - 4}`} fill={d.skin} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
            <path d={`M ${cx - 36} ${top - 8} L ${cx - 6} ${top + 26} L ${cx - 30} ${top + 30} Z`} fill={o.topDark} stroke={OUT} strokeWidth={4} />
            <path d={`M ${cx + 36} ${top - 8} L ${cx + 6} ${top + 26} L ${cx + 30} ${top + 30} Z`} fill={o.topDark} stroke={OUT} strokeWidth={4} />
            {[0, 1, 2, ...(o.topStyle === 'shirt' ? [3, 4] : [])].map((i) => (
              <circle key={i} cx={cx} cy={top + 42 + i * 30} r={3.5} fill={OUT} />
            ))}
          </g>
        )}
        {o.topStyle === 'openShirt' && (
          <g>
            <path d={`M ${cx - 26} ${top} L ${cx} ${top + 120} L ${cx + 26} ${top} Z`} fill={d.skin} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
            <path d={`M ${cx - 38} ${top - 6} L ${cx - 8} ${top + 60} L ${cx - 26} ${top + 4} Z`} fill={o.topDark} stroke={OUT} strokeWidth={4} />
            <path d={`M ${cx + 38} ${top - 6} L ${cx + 8} ${top + 60} L ${cx + 26} ${top + 4} Z`} fill={o.topDark} stroke={OUT} strokeWidth={4} />
            <path d={`M ${cx - 10} ${top + 50} q 5 6 10 0 q 5 6 10 0`} stroke="#4a2e1e" strokeWidth={2} fill="none" />
          </g>
        )}
        {o.topStyle === 'blazer' && (
          <g>
            <path d={`M ${cx - 30} ${top} L ${cx} ${top + 90} L ${cx + 30} ${top} Z`} fill="#f4f4f4" stroke={OUT} strokeWidth={4} />
            <path d={`M ${cx - 6} ${top + 10} L ${cx + 6} ${top + 10} L ${cx + 9} ${top + 80} L ${cx} ${top + 92} L ${cx - 9} ${top + 80} Z`} fill="#c0392b" stroke={OUT} strokeWidth={3} />
          </g>
        )}
        {o.chain && (
          <path d={`M ${cx - 30} ${top + 4} Q ${cx} ${top + 70} ${cx + 30} ${top + 4}`} stroke="#f4c430" strokeWidth={6} fill="none" strokeDasharray="6 3" />
        )}
        {o.chain && <circle cx={cx} cy={top + 40} r={9} fill="#f4c430" stroke={OUT} strokeWidth={3} />}
        {o.print && absT < 0.6 && (
          <text x={cx} y={top + 100} textAnchor="middle" fontSize={o.print.length > 3 ? 24 : 34} fontWeight={800} fill={o.top === '#111215' ? '#f1c40f' : '#e9e9e9'} fontFamily="Rubik, sans-serif" direction="rtl">
            {o.print}
          </text>
        )}
        {/* belt / waistband */}
        {o.topStyle !== 'dress' && o.topStyle !== 'swim' && (
          <rect x={-bw / 2 - 2} y={bot - 12} width={bw + 4} height={16} rx={5} fill={o.bottom} stroke={OUT} strokeWidth={SW} />
        )}
      </g>
    );
  };

  const fx = p.fx ?? [];
  const torsoScaleY = 1 - frontBow * 0.35;

  return (
    <g
      transform={`translate(${p.x},${p.y + bob}) scale(${s * (1 + sq * 0.12)},${s * (1 - sq * 0.12)}) rotate(${p.lean ?? 0})`}
      opacity={p.opacity ?? 1}
    >
      {/* shadow */}
      <ellipse cx={0} cy={4} rx={tw * 0.75} ry={16} fill="#000" opacity={0.18} />
      {leg(-1)}
      {leg(1)}
      <g transform={`rotate(${bowRot} 0 ${hipY}) translate(0 ${hipY}) scale(1 ${torsoScaleY}) translate(0 ${-hipY})`}>
        {armsBehind && !p.crossed && arm(farSide, farSide === -1 ? aL : aR, farSide === -1 ? p.propL : p.propR, true)}
        {torso()}
        <g transform={`translate(${headTurn * 8},${headY + frontBow * 60 + talkNod}) rotate(${(p.tilt ?? 0) + (frontBow * 0)})`}>
          <Head d={d} o={o} uid={uid} turn={headTurn} expr={p.expr ?? 'neutral'} viseme={viseme} loud={loud} blinking={blinking} gaze={p.gaze} f={abs} fx={fx} wet={p.wet} />
        </g>
        {p.crossed ? (
          <CrossedArms d={d} o={o} tw={tw} shY={shY} upper={upperColor} lower={lowerColor} />
        ) : (
          <>
            {(!armsBehind || farSide !== -1) && arm(-1, aL, p.propL)}
            {(!armsBehind || farSide !== 1) && arm(1, aR, p.propR)}
          </>
        )}
      </g>
      <FX fx={fx} f={abs} headY={headY} d={d} turn={headTurn} />
    </g>
  );
};

const CrossedArms: React.FC<{ d: Design; o: Outfit; tw: number; shY: number; upper: string; lower: string }> = ({ d, o, tw, shY, upper, lower }) => {
  const y = shY + 92;
  const aw = d.armW;
  return (
    <g>
      <rect x={-tw / 2 - 4} y={shY + 10} width={aw} height={100} rx={aw / 2} fill={upper} stroke={OUT} strokeWidth={SW} />
      <rect x={tw / 2 + 4 - aw} y={shY + 10} width={aw} height={100} rx={aw / 2} fill={upper} stroke={OUT} strokeWidth={SW} />
      <rect x={-tw / 2 + 6} y={y - aw * 0.6} width={tw - 12} height={aw * 1.15} rx={aw * 0.55} fill={lower} stroke={OUT} strokeWidth={SW} />
      <rect x={-tw / 2 + 2} y={y - aw * 0.05} width={tw - 4} height={aw * 1.1} rx={aw * 0.55} fill={lower} stroke={OUT} strokeWidth={SW} />
      <circle cx={tw / 2 - 18} cy={y - 6} r={aw * 0.55} fill={d.skin} stroke={OUT} strokeWidth={SW} />
      <circle cx={-tw / 2 + 18} cy={y + 16} r={aw * 0.55} fill={d.skin} stroke={OUT} strokeWidth={SW} />
      {o.sleeves === 'long' && <line x1={-tw / 2 + 40} y1={y + 6} x2={tw / 2 - 40} y2={y + 6} stroke={o.topDark} strokeWidth={3} />}
    </g>
  );
};

// ───────────────────────── head ─────────────────────────

interface HeadProps {
  d: Design;
  o: Outfit;
  uid: string;
  turn: number;
  expr: Expr;
  viseme: string | null;
  loud: boolean;
  blinking: boolean;
  gaze?: [number, number];
  f: number;
  fx: string[];
  wet?: boolean;
}

const Head: React.FC<HeadProps> = ({ d, o, uid, turn, expr, viseme, loud, blinking, gaze, f, fx }) => {
  const w = d.headW, h = d.headH;
  const t = Math.max(-1, Math.min(1, turn));
  const at = Math.abs(t);
  const sgn = t === 0 ? 1 : Math.sign(t);
  const fdx = t * w * 0.24; // feature shift
  const chinDx = t * w * 0.1 + sgn * at * d.chin * 10;
  const redFace = expr === 'strain' || fx.includes('redface');
  const skin = redFace ? mixColor(d.skin, '#e0473b', 0.35 + 0.1 * Math.sin(f * 0.5)) : expr === 'hungover' ? mixColor(d.skin, '#9fc27a', 0.28) : d.skin;

  const headPath = (() => {
    const L = -w / 2, R = w / 2;
    const top = -h * 0.55;
    const chinY = h * 0.52 + d.chin * 6;
    return `M ${L} ${-h * 0.05}
      C ${L} ${top - 6} ${R} ${top - 6} ${R} ${-h * 0.05}
      C ${R} ${h * 0.18} ${R * 0.92 + chinDx} ${h * 0.36} ${R * 0.5 + chinDx} ${h * 0.46}
      Q ${chinDx} ${chinY + 10} ${L * 0.5 + chinDx} ${h * 0.46}
      C ${L * 0.92 + chinDx} ${h * 0.36} ${L} ${h * 0.18} ${L} ${-h * 0.05} Z`;
  })();

  const earX = (side: -1 | 1) => side * w * 0.5 * (1 - at * 0.6) - t * w * 0.18;
  const showEar = (side: -1 | 1) => !(at > 0.55 && side === sgn);

  // eyes
  const eyeR = { rx: w * 0.13, ry: w * 0.158 };
  const eyeScale = expr === 'wide' ? 1.45 : expr === 'panic' || expr === 'shock' ? 1.2 : 1;
  const eyes: { x: number; s: number; side: -1 | 1 }[] = [];
  const spacing = w * 0.15 * (1 - at * 0.35);
  for (const side of [-1, 1] as const) {
    const near = side === sgn;
    const vis = at < 0.82 || near;
    if (!vis) continue;
    const sc = at > 0.82 ? 1 : near ? 1 + at * 0.12 : 1 - at * 0.45;
    eyes.push({ x: fdx + side * spacing * (near || at < 0.1 ? 1 : 0.7), s: sc, side });
  }
  const ey = -h * 0.06;

  let lid = 0, lidAngle = 0, lowLid = 0;
  switch (expr) {
    case 'angry': lid = 0.38; lidAngle = 22; break;
    case 'hungover': lid = 0.55; lowLid = 0.15; break;
    case 'solemn': lid = 0.42; break;
    case 'smug': lid = 0.42; lidAngle = -6; break;
    case 'flirt': lid = 0.3; break;
    case 'sad': lid = 0.25; lidAngle = -16; break;
    case 'disgust': lid = 0.35; lidAngle = 10; lowLid = 0.2; break;
    case 'sleep': lid = 1; break;
    case 'strain': lid = 0.82; lidAngle = 15; break;
  }
  if (blinking && expr !== 'wide') lid = 1;
  const happyArcs = expr === 'laugh';
  const pupilR = expr === 'wide' ? w * 0.016 : expr === 'panic' ? w * 0.022 : expr === 'flirt' ? w * 0.04 : w * 0.034;
  const twitch = fx.includes('twitch') && Math.floor(f / 3) % 4 === 0 ? 3 : 0;
  const g = gaze ?? [t * 0.5, 0];

  // brows
  const browAngle = { angry: 20, panic: -18, shock: -10, sad: -20, flirt: 0, solemn: 4, wide: -25, strain: 22, disgust: 12, hungover: -6 }[expr as string] ?? 0;
  const browLift = { panic: -16, shock: -22, wide: -30, flirt: -6, laugh: -8, happy: -4, sleep: 6 }[expr as string] ?? 0;

  return (
    <g>
      {/* back hair for long styles */}
      {(d.hairStyle === 'long' || d.hairStyle === 'curly') && (
        <path d={d.hairStyle === 'long' ? `M ${-w * 0.56} ${-h * 0.2} Q ${-w * 0.62} ${h * 0.6} ${-w * 0.42} ${h * 0.95} L ${w * 0.42} ${h * 0.95} Q ${w * 0.62} ${h * 0.6} ${w * 0.56} ${-h * 0.2} Z` : `M ${-w * 0.62} ${-h * 0.1} Q ${-w * 0.8} ${h * 0.4} ${-w * 0.45} ${h * 0.55} L ${w * 0.45} ${h * 0.55} Q ${w * 0.8} ${h * 0.4} ${w * 0.62} ${-h * 0.1} Z`} fill={d.hair} stroke={OUT} strokeWidth={SW} />
      )}
      {d.hairStyle === 'pony' && (
        <path d={`M ${-sgn * w * 0.3} ${-h * 0.4} Q ${-sgn * w * 0.95} ${-h * 0.2} ${-sgn * w * 0.7} ${h * 0.5} Q ${-sgn * w * 0.55} ${h * 0.05} ${-sgn * w * 0.2} ${-h * 0.3} Z`} fill={d.hair} stroke={OUT} strokeWidth={SW} />
      )}
      {/* neck */}
      <rect x={-w * 0.2 + t * 6} y={h * 0.25} width={w * 0.4} height={h * 0.42} fill={d.skinShade} stroke={OUT} strokeWidth={SW} />
      {o.topStyle === 'turtleneck' && (
        <g>
          <rect x={-w * 0.27 + t * 6} y={h * 0.42} width={w * 0.54} height={h * 0.3} rx={16} fill={o.top} stroke={OUT} strokeWidth={SW} />
          <path d={`M ${-w * 0.24 + t * 6} ${h * 0.56} Q ${t * 6} ${h * 0.62} ${w * 0.24 + t * 6} ${h * 0.56}`} stroke={o.topDark} strokeWidth={3} fill="none" />
        </g>
      )}
      {/* ears */}
      {([-1, 1] as const).map((side) =>
        showEar(side) ? (
          <g key={side}>
            <ellipse cx={earX(side)} cy={h * 0.02} rx={w * 0.075} ry={h * 0.1} fill={skin} stroke={OUT} strokeWidth={SW} />
            <path d={`M ${earX(side) - side * 4} ${-h * 0.03} q ${side * 8} ${h * 0.05} 0 ${h * 0.1}`} stroke={d.skinShade} strokeWidth={3} fill="none" />
          </g>
        ) : null,
      )}
      {/* head */}
      <path d={headPath} fill={skin} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      {/* beard */}
      {d.beard === 'full' && (
        <g>
          <path
            d={`M ${-w * 0.5 + at * (sgn > 0 ? w * 0.25 : 0)} ${h * 0.04}
              C ${-w * 0.5} ${h * 0.2} ${-w * 0.46 + chinDx} ${h * 0.36} ${-w * 0.25 + chinDx} ${h * 0.47}
              Q ${chinDx} ${h * 0.62 + d.chin * 6} ${w * 0.25 + chinDx} ${h * 0.47}
              C ${w * 0.46 + chinDx} ${h * 0.36} ${w * 0.5} ${h * 0.2} ${w * 0.5 - at * (sgn < 0 ? w * 0.25 : 0)} ${h * 0.04}
              L ${w * 0.42 - at * (sgn < 0 ? w * 0.2 : 0)} ${h * 0.06}
              Q ${w * 0.34 + fdx * 0.4} ${h * 0.24} ${fdx + w * 0.14} ${h * 0.2}
              Q ${fdx} ${h * 0.16} ${fdx - w * 0.14} ${h * 0.2}
              Q ${-w * 0.34 + fdx * 0.4} ${h * 0.24} ${-w * 0.42 + at * (sgn > 0 ? w * 0.2 : 0)} ${h * 0.06} Z`}
            fill={d.beardColor ?? d.hair}
            stroke={OUT}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <path d={`M ${-w * 0.38 + fdx * 0.5} ${h * 0.08} Q ${-w * 0.3 + fdx} ${h * 0.3} ${-w * 0.1 + chinDx} ${h * 0.42}`} stroke={d.hairLight} strokeWidth={3} fill="none" opacity={0.6} />
        </g>
      )}
      {d.beard === 'goatee' && (
        <path d={`M ${fdx - w * 0.17} ${h * 0.3} Q ${fdx - w * 0.2} ${h * 0.5} ${chinDx} ${h * 0.6} Q ${fdx + w * 0.2} ${h * 0.5} ${fdx + w * 0.17} ${h * 0.3} Q ${fdx} ${h * 0.4} ${fdx - w * 0.17} ${h * 0.3} Z`} fill={d.hair} stroke={OUT} strokeWidth={4} />
      )}
      {/* chin cleft for Roee */}
      {d.chin > 0.8 && <path d={`M ${chinDx - 5} ${h * 0.5} q 5 6 10 0`} stroke={d.skinShade} strokeWidth={3} fill="none" />}

      {/* eyes */}
      {eyes.map((e, i) => {
        const cx = e.x, cy = ey + (i === 0 ? twitch * 0 : 0);
        const rx = eyeR.rx * e.s * eyeScale, ry = eyeR.ry * e.s * eyeScale * (at > 0.82 ? 1 : 1);
        const clip = `eye-${uid}-${i}`;
        const tw2 = e.side === -1 ? twitch : 0;
        if (happyArcs) {
          return <path key={i} d={`M ${cx - rx} ${cy + 4} Q ${cx} ${cy - ry * 1.1} ${cx + rx} ${cy + 4}`} stroke={OUT} strokeWidth={SW + 1} fill="none" strokeLinecap="round" />;
        }
        return (
          <g key={i} transform={`translate(0 ${-tw2})`}>
            <defs>
              <clipPath id={clip}>
                <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
              </clipPath>
            </defs>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
            {expr === 'hungover' && (
              <g clipPath={`url(#${clip})`} stroke="#e05555" strokeWidth={1.6}>
                <path d={`M ${cx - rx} ${cy + 3} l ${rx * 0.4} -2 l 4 4`} fill="none" />
                <path d={`M ${cx + rx} ${cy + 6} l ${-rx * 0.4} -4 l -3 5`} fill="none" />
              </g>
            )}
            <g clipPath={`url(#${clip})`}>
              <circle cx={cx + g[0] * rx * 0.45 + (at > 0.82 ? sgn * rx * 0.3 : 0)} cy={cy + g[1] * ry * 0.4 + 2} r={pupilR * e.s} fill={OUT} />
              {expr === 'flirt' && <circle cx={cx + g[0] * rx * 0.45 + 3} cy={cy - 3} r={2.5} fill="#fff" />}
              {lid > 0 && (
                <rect
                  x={cx - rx - 4}
                  y={cy - ry - 4 - (1 - lid) * 0}
                  width={rx * 2 + 8}
                  height={(ry * 2 + 8) * lid}
                  fill={skin}
                  stroke={OUT}
                  strokeWidth={SW * 0.8}
                  transform={`rotate(${lidAngle * -e.side} ${cx} ${cy - ry + (ry * 2) * lid})`}
                />
              )}
              {lowLid > 0 && <rect x={cx - rx - 4} y={cy + ry - (ry * 2) * lowLid} width={rx * 2 + 8} height={ry} fill={skin} stroke={OUT} strokeWidth={SW * 0.8} />}
            </g>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={OUT} strokeWidth={SW} />
            {d.female && <path d={`M ${cx + e.side * rx * 0.7} ${cy - ry * 0.75} l ${e.side * 9} -7 M ${cx + e.side * rx * 0.95} ${cy - ry * 0.35} l ${e.side * 10} -3`} stroke={OUT} strokeWidth={3} strokeLinecap="round" />}
            {expr === 'hungover' && <path d={`M ${cx - rx * 0.8} ${cy + ry * 1.05} q ${rx * 0.8} ${ry * 0.35} ${rx * 1.6} 0`} stroke="#8a6a8a" strokeWidth={3} fill="none" />}
            {/* brow */}
            <path
              d={`M ${cx - rx * 0.95} ${cy - ry - 10 + browLift} L ${cx + rx * 0.95} ${cy - ry - 10 + browLift}`}
              transform={`rotate(${browAngle * -e.side * (expr === 'flirt' && e.side === 1 ? 0 : 1) + (expr === 'flirt' && e.side === 1 ? -12 : 0)} ${cx} ${cy - ry - 10 + browLift})`}
              stroke={d.hairStyle === 'cap' || d.hairStyle === 'bald' ? d.hair : d.hair}
              strokeWidth={d.female ? 5 : 10}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* nose */}
      {at < 0.8 ? (
        <path d={`M ${fdx + sgn * 2} ${h * 0.03} Q ${fdx + sgn * w * 0.1} ${h * 0.12} ${fdx - sgn * 4} ${h * 0.15}`} stroke={OUT} strokeWidth={SW - 1} fill={skin} strokeLinecap="round" />
      ) : (
        <path d={`M ${sgn * w * 0.44} ${-h * 0.02} Q ${sgn * w * 0.62} ${h * 0.1} ${sgn * w * 0.44} ${h * 0.15}`} stroke={OUT} strokeWidth={SW - 1} fill={skin} />
      )}
      {d.beard === 'full' && (
        <path d={`M ${fdx - w * 0.16} ${h * 0.24} Q ${fdx} ${h * 0.17} ${fdx + w * 0.16} ${h * 0.24} Q ${fdx} ${h * 0.21} ${fdx - w * 0.16} ${h * 0.24} Z`} fill={d.hair} stroke={OUT} strokeWidth={3} />
      )}
      {d.beard === 'goatee' && (
        <path d={`M ${fdx - w * 0.17} ${h * 0.25} Q ${fdx} ${h * 0.17} ${fdx + w * 0.17} ${h * 0.25} L ${fdx + w * 0.14} ${h * 0.27} Q ${fdx} ${h * 0.22} ${fdx - w * 0.14} ${h * 0.27} Z`} fill={d.hair} stroke={OUT} strokeWidth={3} />
      )}

      {/* lip patch so the mouth reads against facial hair */}
      {d.beard !== 'none' && <ellipse cx={fdx * 1.05 + (at > 0.82 ? sgn * w * 0.1 : 0)} cy={h * 0.33} rx={w * (at > 0.82 ? 0.1 : 0.17)} ry={h * 0.06} fill={skin} opacity={0.95} />}
      {/* mouth */}
      <Mouth cx={fdx * 1.05 + (at > 0.82 ? sgn * w * 0.1 : 0)} cy={h * 0.32} w={w * (at > 0.82 ? 0.2 : 0.3)} expr={expr} viseme={viseme} loud={loud} f={f} lips={d.lips} profile={at > 0.82} sgn={sgn} />

      {/* hair / cap on top */}
      <Hair d={d} o={o} w={w} h={h} t={t} sgn={sgn} />
    </g>
  );
};

const Hair: React.FC<{ d: Design; o: Outfit; w: number; h: number; t: number; sgn: number }> = ({ d, o, w, h, t, sgn }) => {
  const at = Math.abs(t);
  const top = -h * 0.55;
  const off = t * w * 0.08;
  switch (d.hairStyle) {
    case 'fade':
      return (
        <g>
          {/* faded sides */}
          <path d={`M ${-w * 0.5} ${-h * 0.05} C ${-w * 0.5} ${top} ${w * 0.5} ${top} ${w * 0.5} ${-h * 0.05} L ${w * 0.47} ${-h * 0.12} C ${w * 0.4} ${-h * 0.35} ${-w * 0.4} ${-h * 0.35} ${-w * 0.47} ${-h * 0.12} Z`} fill={d.hairLight} opacity={0.75} />
          {/* top */}
          <path
            d={`M ${-w * 0.44 + off} ${-h * 0.26} C ${-w * 0.48 + off} ${top - 14} ${w * 0.42 + off} ${top - 22} ${w * 0.46 + off} ${-h * 0.3} C ${w * 0.3 + off} ${-h * 0.36} ${w * 0.2 + off} ${-h * 0.33} ${w * 0.05 + off} ${-h * 0.36} C ${-w * 0.12 + off} ${-h * 0.32} ${-w * 0.3 + off} ${-h * 0.36} ${-w * 0.44 + off} ${-h * 0.26} Z`}
            fill={d.hair}
            stroke={OUT}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <path d={`M ${-w * 0.2 + off} ${top + 8} q 20 -10 40 -4 M ${w * 0.05 + off} ${top + 4} q 20 -8 36 0`} stroke={d.hairLight} strokeWidth={3} fill="none" />
        </g>
      );
    case 'quiff':
      return (
        <g>
          <path
            d={`M ${-w * 0.48} ${-h * 0.12} C ${-w * 0.56} ${top - 30} ${-w * 0.1 + off} ${top - 80} ${w * 0.32 + off + sgn * 10} ${top - 64}
               C ${w * 0.62 + off} ${top - 54} ${w * 0.55} ${top - 10} ${w * 0.5} ${-h * 0.14}
               C ${w * 0.42} ${-h * 0.32} ${w * 0.1} ${-h * 0.34} ${-w * 0.05} ${-h * 0.32}
               C ${-w * 0.25} ${-h * 0.3} ${-w * 0.4} ${-h * 0.25} ${-w * 0.48} ${-h * 0.12} Z`}
            fill={d.hair}
            stroke={OUT}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <path d={`M ${-w * 0.2 + off} ${top - 20} C ${0 + off} ${top - 60} ${w * 0.3 + off} ${top - 60} ${w * 0.4 + off} ${top - 40}`} stroke={d.hairLight} strokeWidth={9} fill="none" strokeLinecap="round" />
          {o.shadesOnHead && (
            <g transform={`translate(${off} ${top - 10})`}>
              <rect x={-w * 0.36} y={-10} width={w * 0.3} height={24} rx={10} fill="#1b1b2b" stroke={OUT} strokeWidth={4} />
              <rect x={w * 0.06} y={-10} width={w * 0.3} height={24} rx={10} fill="#1b1b2b" stroke={OUT} strokeWidth={4} />
              <line x1={-w * 0.06} y1={0} x2={w * 0.06} y2={0} stroke={OUT} strokeWidth={4} />
              <path d={`M ${-w * 0.3} -4 l 14 0`} stroke="#8ab4ff" strokeWidth={3} />
            </g>
          )}
        </g>
      );
    case 'cap': {
      const c = d.capColor!;
      return (
        <g>
          <path d={`M ${-w * 0.5} ${-h * 0.05} L ${-w * 0.5} ${-h * 0.28} L ${w * 0.5} ${-h * 0.28} L ${w * 0.5} ${-h * 0.05} Z`} fill={d.hairLight} opacity={0.8} />
          {/* brim sticking out the back */}
          <path d={`M ${-sgn * w * 0.3} ${-h * 0.34} Q ${-sgn * w * 0.85} ${-h * 0.36} ${-sgn * w * 0.78} ${-h * 0.24} L ${-sgn * w * 0.36} ${-h * 0.22} Z`} fill={shadeColor(c)} stroke={OUT} strokeWidth={SW} opacity={at > 0.3 ? 1 : 0} />
          <path d={`M ${-w * 0.53} ${-h * 0.27} C ${-w * 0.56} ${top - 40} ${w * 0.56} ${top - 40} ${w * 0.53} ${-h * 0.27} Z`} fill={c} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          {at < 0.3 && (
            <g>
              <path d={`M ${-w * 0.18 + off} ${-h * 0.27} Q ${off} ${-h * 0.44} ${w * 0.18 + off} ${-h * 0.27} Z`} fill={d.hairLight} stroke={OUT} strokeWidth={4} />
              <line x1={-w * 0.18 + off} y1={-h * 0.27} x2={w * 0.18 + off} y2={-h * 0.27} stroke={OUT} strokeWidth={4} />
            </g>
          )}
          <path d={`M ${off} ${top - 28} L ${off} ${-h * 0.28}`} stroke={shadeColor(c)} strokeWidth={3} />
          <circle cx={off} cy={top - 30} r={6} fill={c} stroke={OUT} strokeWidth={3} />
        </g>
      );
    }
    case 'long':
    case 'curly':
      return (
        <path
          d={`M ${-w * 0.56} ${h * 0.1} C ${-w * 0.66} ${top - 30} ${w * 0.66} ${top - 30} ${w * 0.56} ${h * 0.1} C ${w * 0.48} ${-h * 0.2} ${w * 0.2} ${-h * 0.32} ${off - w * 0.05} ${-h * 0.34} C ${-w * 0.3} ${-h * 0.3} ${-w * 0.48} ${-h * 0.2} ${-w * 0.56} ${h * 0.1} Z`}
          fill={d.hair}
          stroke={OUT}
          strokeWidth={SW}
          strokeDasharray={d.hairStyle === 'curly' ? '14 4' : undefined}
        />
      );
    case 'pony':
    case 'bun':
      return (
        <g>
          {d.hairStyle === 'bun' && <circle cx={off} cy={top - 18} r={w * 0.2} fill={d.hair} stroke={OUT} strokeWidth={SW} />}
          <path d={`M ${-w * 0.52} ${-h * 0.02} C ${-w * 0.6} ${top - 20} ${w * 0.6} ${top - 20} ${w * 0.52} ${-h * 0.02} C ${w * 0.4} ${-h * 0.3} ${-w * 0.4} ${-h * 0.3} ${-w * 0.52} ${-h * 0.02} Z`} fill={d.hair} stroke={OUT} strokeWidth={SW} />
          <path d={`M ${-w * 0.2 + off} ${top + 2} q 30 -12 60 0`} stroke={d.hairLight} strokeWidth={5} fill="none" />
        </g>
      );
    case 'side':
      return (
        <g>
          <path d={`M ${-w * 0.52} ${-h * 0.02} C ${-w * 0.58} ${top - 8} ${w * 0.56} ${top - 14} ${w * 0.52} ${-h * 0.05} C ${w * 0.3} ${-h * 0.4} ${-w * 0.2} ${-h * 0.42} ${-w * 0.52} ${-h * 0.02} Z`} fill={d.hair} stroke={OUT} strokeWidth={SW} />
          <path d={`M ${-w * 0.15} ${top + 4} L ${-w * 0.2} ${-h * 0.32}`} stroke={d.hairLight} strokeWidth={3} />
        </g>
      );
    case 'bald':
      return <path d={`M ${-w * 0.18} ${top + 14} q ${w * 0.12} -10 ${w * 0.24} -4`} stroke="#fff" strokeWidth={6} opacity={0.5} fill="none" strokeLinecap="round" />;
  }
};

const Mouth: React.FC<{ cx: number; cy: number; w: number; expr: Expr; viseme: string | null; loud: boolean; f: number; lips?: string; profile: boolean; sgn: number }> = ({ cx, cy, w, expr, viseme, loud, f, lips, profile }) => {
  const dark = '#5a1620';
  const k = loud ? 1.3 : 1;
  const lipStroke = lips ?? OUT;
  const open = (rx: number, ry: number, teeth = true, tongue = true) => (
    <g>
      <ellipse cx={cx} cy={cy + ry * 0.3} rx={rx} ry={ry} fill={dark} stroke={lipStroke} strokeWidth={SW} />
      {tongue && ry > 10 && <ellipse cx={cx} cy={cy + ry * 0.95} rx={rx * 0.55} ry={ry * 0.35} fill="#e2687a" />}
      {teeth && ry > 6 && <rect x={cx - rx * 0.7} y={cy + ry * 0.3 - ry + 2} width={rx * 1.4} height={Math.min(ry * 0.4, 10)} rx={3} fill="#fff" />}
    </g>
  );
  const line = (curve: number, width = w) => (
    <path d={`M ${cx - width / 2} ${cy} Q ${cx} ${cy + curve} ${cx + width / 2} ${cy}`} stroke={lipStroke} strokeWidth={SW} fill="none" strokeLinecap="round" />
  );

  if (viseme && viseme !== 'X') {
    switch (viseme) {
      case 'A': return open(w * 0.42 * k, w * 0.36 * k);
      case 'E': return open(w * 0.5 * k, w * 0.2 * k, true, false);
      case 'O': return open(w * 0.24 * k, w * 0.3 * k, false, true);
      case 'C': return open(w * 0.36 * k, w * 0.13 * k, true, false);
      case 'M': return line(2, w * 0.8);
      case 'F': return (
        <g>
          {line(-2, w * 0.8)}
          <rect x={cx - w * 0.22} y={cy - 6} width={w * 0.44} height={8} rx={2} fill="#fff" stroke={OUT} strokeWidth={2} />
        </g>
      );
    }
  }
  switch (expr) {
    case 'happy': case 'smug':
      return expr === 'smug'
        ? <path d={`M ${cx - w / 2} ${cy + 4} Q ${cx} ${cy + 10} ${cx + w / 2} ${cy - 10}`} stroke={lipStroke} strokeWidth={SW} fill="none" strokeLinecap="round" />
        : <path d={`M ${cx - w / 2} ${cy - 4} Q ${cx} ${cy + w * 0.4} ${cx + w / 2} ${cy - 4} Z`} fill={dark} stroke={lipStroke} strokeWidth={SW} strokeLinejoin="round" />;
    case 'laugh':
      return (
        <g>
          <path d={`M ${cx - w * 0.6} ${cy - 6} Q ${cx} ${cy + w * 0.8} ${cx + w * 0.6} ${cy - 6} Z`} fill={dark} stroke={lipStroke} strokeWidth={SW} strokeLinejoin="round" />
          <rect x={cx - w * 0.45} y={cy - 4} width={w * 0.9} height={9} fill="#fff" />
          <ellipse cx={cx} cy={cy + w * 0.3} rx={w * 0.25} ry={w * 0.1} fill="#e2687a" />
        </g>
      );
    case 'angry': case 'strain':
      return (
        <g>
          <rect x={cx - w * 0.45} y={cy - 9} width={w * 0.9} height={20} rx={6} fill="#fff" stroke={lipStroke} strokeWidth={SW} />
          <line x1={cx - w * 0.45} y1={cy + 1} x2={cx + w * 0.45} y2={cy + 1} stroke={OUT} strokeWidth={2} />
          {[-0.2, 0, 0.2].map((x) => <line key={x} x1={cx + w * x} y1={cy - 9} x2={cx + w * x} y2={cy + 11} stroke={OUT} strokeWidth={1.5} />)}
        </g>
      );
    case 'panic': case 'shock':
      return open(w * 0.28 + Math.sin(f * 1.3) * 2, w * 0.36, false, true);
    case 'wide':
      return (
        <g>
          <rect x={cx - w * 0.55} y={cy - 10} width={w * 1.1} height={22} rx={8} fill="#fff" stroke={lipStroke} strokeWidth={SW} />
          <line x1={cx - w * 0.55} y1={cy + 1} x2={cx + w * 0.55} y2={cy + 1} stroke={OUT} strokeWidth={2} />
        </g>
      );
    case 'sad': return line(-12);
    case 'solemn': return line(0, w * 0.7);
    case 'hungover':
      return <path d={`M ${cx - w / 2} ${cy} q ${w / 6} -6 ${w / 3} 0 t ${w / 3} 0`} stroke={lipStroke} strokeWidth={SW} fill="none" strokeLinecap="round" />;
    case 'flirt':
      return <path d={`M ${cx - w / 2} ${cy} Q ${cx} ${cy + 12} ${cx + w / 2} ${cy - 12}`} stroke={lipStroke} strokeWidth={SW} fill="none" strokeLinecap="round" />;
    case 'disgust':
      return <path d={`M ${cx - w / 2} ${cy + 4} Q ${cx - w / 4} ${cy - 8} ${cx} ${cy} T ${cx + w / 2} ${cy - 4}`} stroke={lipStroke} strokeWidth={SW} fill="none" strokeLinecap="round" />;
    case 'sleep':
      return <ellipse cx={cx} cy={cy + 2} rx={w * 0.12} ry={w * 0.09 + Math.sin(f * 0.15) * 3} fill={dark} stroke={lipStroke} strokeWidth={4} />;
    default:
      return profile ? line(3, w * 0.7) : line(6);
  }
};

const FX: React.FC<{ fx: string[]; f: number; headY: number; d: Design; turn: number }> = ({ fx, f, headY, d, turn }) => {
  const w = d.headW, h = d.headH;
  const hx = turn * 8;
  return (
    <g>
      {fx.includes('sweat') &&
        [0, 1, 2].map((i) => {
          const t = ((f + i * 9) % 26) / 26;
          return <path key={i} d="M 0 -12 Q 9 2 0 8 Q -9 2 0 -12 Z" transform={`translate(${hx + (i - 1) * w * 0.5} ${headY - h * 0.35 + t * 60}) scale(${1 - t * 0.3})`} fill="#7fd0ff" stroke={OUT} strokeWidth={3} opacity={1 - t} />;
        })}
      {fx.includes('blush') && [-1, 1].map((s) => <ellipse key={s} cx={hx + s * w * 0.28} cy={headY + h * 0.12} rx={18} ry={9} fill="#ff6f8f" opacity={0.55} />)}
      {fx.includes('tears') &&
        [-1, 1].map((s) => {
          const t = (f % 18) / 18;
          return <circle key={s} cx={hx + s * w * 0.2} cy={headY + t * 70} r={6} fill="#7fd0ff" stroke={OUT} strokeWidth={2} opacity={1 - t} />;
        })}
      {fx.includes('hearts') &&
        [0, 1, 2].map((i) => {
          const t = ((f + i * 12) % 36) / 36;
          return (
            <path key={i} d="M 0 6 C -14 -6 -6 -18 0 -9 C 6 -18 14 -6 0 6 Z" transform={`translate(${hx + (i - 1) * 50 + Math.sin(f * 0.2 + i) * 10} ${headY - h * 0.6 - t * 90}) scale(${1.4})`} fill="#ff3b6b" stroke={OUT} strokeWidth={2.5} opacity={1 - t} />
          );
        })}
      {fx.includes('stink') &&
        [0, 1, 2].map((i) => (
          <path key={i} d={`M ${-40 + i * 40} ${headY + h * 1.7} q 12 -20 0 -40 t 0 -40`} stroke="#8fbf4a" strokeWidth={5} fill="none" opacity={0.6 + 0.3 * Math.sin(f * 0.3 + i)} transform={`translate(${Math.sin(f * 0.15 + i) * 6} 0)`} />
        ))}
      {fx.includes('vein') && (
        <path d="M -12 -12 l 8 8 m 8 -8 l -8 8 m -8 8 l 8 -8 m 8 8 l -8 -8" transform={`translate(${hx + w * 0.3} ${headY - h * 0.38}) scale(${1 + 0.15 * Math.sin(f * 0.8)})`} stroke="#e02424" strokeWidth={6} strokeLinecap="round" />
      )}
      {fx.includes('zzz') &&
        [0, 1, 2].map((i) => {
          const t = ((f + i * 14) % 42) / 42;
          return (
            <text key={i} x={hx + w * 0.4 + t * 60} y={headY - h * 0.5 - t * 90} fontSize={30 + i * 8} fontWeight={900} fill="#cfe3ff" stroke={OUT} strokeWidth={2} opacity={1 - t} fontFamily="Rubik">
              Z
            </text>
          );
        })}
      {fx.includes('stars') &&
        [0, 1, 2, 3].map((i) => {
          const a = f * 0.15 + (i * Math.PI) / 2;
          return <text key={i} x={hx + Math.cos(a) * w * 0.6} y={headY - h * 0.55 + Math.sin(a) * 16} fontSize={30} textAnchor="middle" fill="#ffd400" stroke={OUT} strokeWidth={1.5}>★</text>;
        })}
      {fx.includes('shine') &&
        [0, 1].map((i) => {
          const t = ((f + i * 10) % 20) / 20;
          return <path key={i} d="M 0 -16 L 4 -4 L 16 0 L 4 4 L 0 16 L -4 4 L -16 0 L -4 -4 Z" transform={`translate(${hx + (i ? 1 : -1) * w * 0.55} ${headY - h * 0.3}) scale(${Math.sin(t * Math.PI) * 1.4})`} fill="#fff7a8" stroke={OUT} strokeWidth={2} />;
        })}
    </g>
  );
};

function renderProp(prop: Prop, side: number, f: number) {
  switch (prop) {
    case 'laptop':
      return (
        <g transform="translate(-70 -40)">
          <rect x={0} y={0} width={140} height={90} rx={8} fill="#c9ccd3" stroke={OUT} strokeWidth={4} />
          <rect x={10} y={8} width={120} height={70} rx={4} fill="#1c2b4a" />
          <text x={70} y={52} textAnchor="middle" fontSize={22} fill="#5ad1ff" fontFamily="monospace">{'{ }'}</text>
          <rect x={-10} y={88} width={160} height={14} rx={5} fill="#a9adb6" stroke={OUT} strokeWidth={4} />
        </g>
      );
    case 'drink':
      return (
        <g transform="translate(-16 -58)">
          <path d="M 0 0 L 32 0 L 27 60 L 5 60 Z" fill="#ffe08a" stroke={OUT} strokeWidth={4} opacity={0.95} />
          <rect x={2} y={4} width={28} height={12} fill="#fff" opacity={0.6} />
          <line x1={20} y1={-18} x2={14} y2={30} stroke="#ff3b6b" strokeWidth={4} />
        </g>
      );
    case 'phone':
      return (
        <g transform="translate(-16 -50)">
          <rect x={0} y={0} width={34} height={60} rx={6} fill="#222" stroke={OUT} strokeWidth={4} />
          <rect x={4} y={6} width={26} height={44} rx={2} fill={Math.floor(f / 6) % 2 ? '#2fe07a' : '#6fe8a3'} />
        </g>
      );
    case 'broom':
      return (
        <g transform={`rotate(${Math.sin(f * 0.5) * 20})`}>
          <rect x={-5} y={-120} width={10} height={210} fill="#b5833f" stroke={OUT} strokeWidth={3} />
          <path d="M -30 90 L 30 90 L 40 140 L -40 140 Z" fill="#e8c26a" stroke={OUT} strokeWidth={4} />
        </g>
      );
    case 'remote':
      return (
        <g transform="translate(-12 -56)">
          <rect x={0} y={0} width={24} height={62} rx={6} fill="#ececec" stroke={OUT} strokeWidth={4} />
          <circle cx={12} cy={14} r={5} fill="#e03131" />
          <rect x={6} y={28} width={12} height={6} fill="#999" />
          <rect x={6} y={40} width={12} height={6} fill="#999" />
        </g>
      );
    case 'suitcase':
      return (
        <g transform="translate(-55 -10)">
          <rect x={35} y={-6} width={40} height={14} rx={6} fill="none" stroke={OUT} strokeWidth={6} />
          <rect x={0} y={6} width={110} height={130} rx={12} fill="#5e60ce" stroke={OUT} strokeWidth={5} />
          <line x1={30} y1={6} x2={30} y2={136} stroke="#4ea8de" strokeWidth={6} />
          <line x1={80} y1={6} x2={80} y2={136} stroke="#4ea8de" strokeWidth={6} />
        </g>
      );
    case 'bag':
      return (
        <g transform="translate(-45 -10)">
          <path d="M 20 12 Q 45 -20 70 12" fill="none" stroke={OUT} strokeWidth={6} />
          <rect x={0} y={10} width={90} height={70} rx={14} fill="#2a9d8f" stroke={OUT} strokeWidth={5} />
          <rect x={10} y={30} width={70} height={10} fill="#e9c46a" />
        </g>
      );
    case 'roll':
      return (
        <g transform="translate(-24 -30)">
          <rect x={0} y={0} width={48} height={56} rx={8} fill="#f5f5f5" stroke={OUT} strokeWidth={4} />
          <ellipse cx={24} cy={0} rx={24} ry={8} fill="#fff" stroke={OUT} strokeWidth={4} />
          <ellipse cx={24} cy={0} rx={8} ry={3} fill="#a07a50" />
        </g>
      );
    case 'tube':
      return (
        <g transform="translate(-14 -36)">
          <rect x={0} y={0} width={28} height={50} rx={4} fill="#b48a5a" stroke={OUT} strokeWidth={4} />
          <ellipse cx={14} cy={0} rx={14} ry={5} fill="#7a5530" stroke={OUT} strokeWidth={3} />
          <path d="M 4 12 L 24 30" stroke="#8a6232" strokeWidth={3} />
        </g>
      );
    case 'perfume':
      return (
        <g transform="translate(-16 -46)">
          <rect x={0} y={14} width={32} height={40} rx={8} fill="#c77dff" stroke={OUT} strokeWidth={4} />
          <rect x={10} y={2} width={12} height={14} fill="#ffd166" stroke={OUT} strokeWidth={3} />
        </g>
      );
    case 'comb':
      return (
        <g transform="translate(-30 -20)">
          <rect x={0} y={0} width={60} height={12} rx={3} fill="#222" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={3 + i * 7} y={10} width={3} height={14} fill="#222" />)}
        </g>
      );
    case 'bill':
      return (
        <g transform="translate(-30 -80)">
          <rect x={0} y={0} width={60} height={90} fill="#fffef6" stroke={OUT} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => <line key={i} x1={8} y1={14 + i * 14} x2={52} y2={14 + i * 14} stroke="#aaa" strokeWidth={3} />)}
          <text x={30} y={82} textAnchor="middle" fontSize={16} fontWeight={900} fill="#d00">₪₪₪</text>
        </g>
      );
    case 'sunglasses':
      return (
        <g transform="translate(-30 -10)">
          <rect x={0} y={0} width={26} height={16} rx={6} fill="#111" />
          <rect x={34} y={0} width={26} height={16} rx={6} fill="#111" />
          <line x1={26} y1={6} x2={34} y2={6} stroke="#111" strokeWidth={4} />
        </g>
      );
    case 'umbrella':
      return (
        <g transform="translate(0 -10)">
          <line x1={0} y1={0} x2={0} y2={-200} stroke={OUT} strokeWidth={6} />
          <path d="M -110 -190 Q 0 -300 110 -190 Z" fill="#ff006e" stroke={OUT} strokeWidth={5} />
        </g>
      );
  }
}

function mixColor(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = [16, 8, 0].map((sh) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}
function shadeColor(a: string) {
  return mixColor(a, '#000000', 0.25);
}
