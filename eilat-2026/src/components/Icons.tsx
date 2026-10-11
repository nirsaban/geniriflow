import React from 'react';

export const RunningWoman: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = '#ff8fb8' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color} stroke="#111" strokeWidth={2}>
    <circle cx={4} cy={-14} r={6} />
    <path d="M -4 -12 Q -10 -16 -12 -6" fill="none" strokeWidth={5} stroke={color} />
    <path d="M 0 -7 L 6 -7 L 12 6 L -6 6 Z" />
    <path d="M 0 6 L -8 16 M 8 6 L 14 16" stroke={color} strokeWidth={4} fill="none" />
    <path d="M 2 -4 L -8 2 M 6 -4 L 14 -10" stroke={color} strokeWidth={3.5} fill="none" />
  </g>
);

export const RollIcon: React.FC<{ x: number; y: number; s?: number; empty?: boolean }> = ({ x, y, s = 1, empty }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#111" strokeWidth={2}>
    <rect x={-10} y={-11} width={20} height={22} rx={3} fill={empty ? '#b48a5a' : '#fff'} />
    <ellipse cx={0} cy={-11} rx={10} ry={4} fill={empty ? '#c9a06b' : '#fff'} />
    <ellipse cx={0} cy={-11} rx={4} ry={1.6} fill="#7a5530" />
  </g>
);

export const PlateIcon: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#111" strokeWidth={2}>
    <ellipse cx={0} cy={2} rx={14} ry={6} fill="#e9e3d2" />
    <ellipse cx={0} cy={1} rx={8} ry={3} fill="#fff" />
    <path d="M -6 -10 L -2 -4 M 6 -10 L 2 -4 M 0 -13 L 0 -5" stroke="#ffd34d" strokeWidth={2.5} />
  </g>
);
