import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Character, type Expr } from './Character';
import { DESIGNS, type CharId, type Look } from './designs';
import { FONT_TITLE, FONT_UI } from '../fonts';

const EXPRS: { e: Expr; he: string }[] = [
  { e: 'neutral', he: 'ניטרלי' },
  { e: 'angry', he: 'כועס' },
  { e: 'laugh', he: 'צוחק' },
  { e: 'hungover', he: 'הנגאובר' },
  { e: 'panic', he: 'בפאניקה' },
  { e: 'flirt', he: 'מפלרטט' },
];

const ROLE: Record<CharId, string> = {
  nir: 'ניר = סבן (אותו אדם) · מפתח תוכנה · תמיד משלם',
  roee: 'הפלרטטן הבלתי נשלט · בטוח שהוא הדמות הראשית',
  marom: 'הנהג · מתלונן כרוני על המזגן',
};

const LOOKS: { l: Look; he: string }[] = [
  { l: 'travel', he: 'דירה / נסיעה' },
  { l: 'beach', he: 'חוף' },
  { l: 'club', he: 'מועדון' },
  { l: 'hotel', he: 'מלון' },
];

export const CharacterSheet: React.FC<{ id: CharId }> = ({ id }) => {
  const d = DESIGNS[id];
  return (
    <AbsoluteFill style={{ background: '#f6f1e7', fontFamily: FONT_UI }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e4dccb" strokeWidth={1} />
          </pattern>
        </defs>
        <rect width={1920} height={1080} fill="url(#grid)" />
        <text x={1880} y={78} textAnchor="start" direction="rtl" fontFamily={FONT_TITLE} fontSize={64} fill="#1a1a1a">
          {d.name} — דף דמות
        </text>
        <text x={1880} y={122} textAnchor="start" direction="rtl" fontSize={28} fill="#555">
          {ROLE[id]}
        </text>
        {/* turnaround */}
        {[
          { t: 0, label: 'חזית', x: 170 },
          { t: 0.5, label: 'שלושה רבעים', x: 420 },
          { t: 1, label: 'צד', x: 660 },
        ].map((v) => (
          <g key={v.label}>
            <Character id={id} x={v.x} y={930} scale={0.78} turn={v.t} look="travel" blink={false} still />
            <text x={v.x} y={990} textAnchor="middle" fontSize={26} direction="rtl" fill="#333">
              {v.label}
            </text>
          </g>
        ))}
        <line x1={800} y1={160} x2={800} y2={1040} stroke="#cbbf9f" strokeWidth={3} strokeDasharray="10 8" />
        {/* expressions */}
        {EXPRS.map((x, i) => {
          const col = i % 3, row = Math.floor(i / 3);
          const cx = 960 + col * 200, cy = 330 + row * 300;
          return (
            <g key={x.e}>
              <clipPath id={`c-${i}`}>
                <rect x={cx - 95} y={cy - 170} width={190} height={250} rx={18} />
              </clipPath>
              <rect x={cx - 95} y={cy - 170} width={190} height={250} rx={18} fill="#fff" stroke="#cbbf9f" strokeWidth={3} />
              <g clipPath={`url(#c-${i})`}>
                <Character id={id} x={cx} y={cy - 40 + 0.62 * (d.legLen + d.torsoH + 0.4 * d.headH)} scale={0.62} expr={x.e} look="travel" blink={false} still fx={x.e === 'flirt' ? ['blush'] : x.e === 'panic' ? ['sweat'] : []} />
              </g>
              <text x={cx} y={cy + 115} textAnchor="middle" fontSize={26} direction="rtl" fill="#333">
                {x.he}
              </text>
            </g>
          );
        })}
        {/* outfits */}
        {LOOKS.map((l, i) => {
          const cx = 1600 + (i % 2) * 170, cy = 250 + Math.floor(i / 2) * 400;
          return (
            <g key={l.l}>
              <Character id={id} x={cx} y={cy + 330} scale={0.5} look={l.l} blink={false} still expr="happy" />
              <text x={cx} y={cy + 370} textAnchor="middle" fontSize={22} direction="rtl" fill="#333">
                {l.he}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
