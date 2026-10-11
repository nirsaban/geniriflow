import React from 'react';
import { AbsoluteFill } from 'remotion';
import { shake as shk } from '../lib/anim';
import { useScene } from '../lib/timeline';

export interface Cam {
  zoom?: number;
  /** point (in 1920×1080 stage space) that sits at screen centre */
  cx?: number;
  cy?: number;
  rot?: number;
  shake?: number;
}

/** An SVG stage with a virtual camera (pan / zoom / roll / shake). */
export const Stage: React.FC<{ cam?: Cam; bg?: string; children: React.ReactNode; overlay?: React.ReactNode }> = ({ cam = {}, bg = '#000', children, overlay }) => {
  const { abs } = useScene();
  const z = cam.zoom ?? 1;
  // keep the frame inside the 1920×1080 set (no black edges) unless zoomed out
  const clampC = (v: number, half: number, size: number) => (z >= 1 ? Math.max(half, Math.min(size - half, v)) : v);
  const cx = clampC(cam.cx ?? 960, 960 / z, 1920);
  const cy = clampC(cam.cy ?? 540, 540 / z, 1080);
  const s = cam.shake ? shk(abs, cam.shake) : { x: 0, y: 0 };
  return (
    <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${960 + s.x} ${540 + s.y}) rotate(${cam.rot ?? 0}) scale(${z}) translate(${-cx} ${-cy})`}>{children}</g>
        {overlay}
      </svg>
    </AbsoluteFill>
  );
};

/** Full-frame flash / fade overlay. */
export const Flash: React.FC<{ color?: string; opacity: number }> = ({ color = '#fff', opacity }) =>
  opacity > 0 ? <rect x={0} y={0} width={1920} height={1080} fill={color} opacity={opacity} /> : null;

/** Comic "speed lines" radiating from a point (reaction shots). */
export const SpeedLines: React.FC<{ cx?: number; cy?: number; color?: string; opacity?: number; f: number }> = ({ cx = 960, cy = 540, color = '#fff', opacity = 0.7, f }) => (
  <g opacity={opacity}>
    {Array.from({ length: 48 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2 + (f % 2) * 0.02;
      const r0 = 330 + ((i * 37 + f * 13) % 90);
      return <path key={i} d={`M ${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0} L ${cx + Math.cos(a - 0.02) * 1400} ${cy + Math.sin(a - 0.02) * 1400} L ${cx + Math.cos(a + 0.02) * 1400} ${cy + Math.sin(a + 0.02) * 1400} Z`} fill={color} />;
    })}
  </g>
);

/** Letterbox bars for "cinematic" moments. */
export const Letterbox: React.FC<{ amount: number }> = ({ amount }) => (
  <g>
    <rect x={0} y={0} width={1920} height={110 * amount} fill="#000" />
    <rect x={0} y={1080 - 110 * amount} width={1920} height={110 * amount} fill="#000" />
  </g>
);
