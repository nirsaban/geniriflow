// Character designs. Exactly three leads: Nir Saban (ניר = סבן, one person),
// Roee and Marom. Nir follows the reference photo (assets/references/nir-reference.png):
// short dark skin-fade, full short dark beard, athletic build, black turtleneck.
// Roee and Marom are original designs built from their written personalities
// (no photos of them were supplied).

export type CharId = 'nir' | 'roee' | 'marom';
export type ExtraId = 'girlA' | 'girlB' | 'girlC' | 'girlD' | 'guard' | 'manager';
export type Look = 'home' | 'travel' | 'beach' | 'club' | 'hotel' | 'pool';

export interface Outfit {
  top: string;
  topDark: string;
  topStyle: 'turtleneck' | 'tank' | 'tee' | 'shirt' | 'openShirt' | 'polo' | 'bare' | 'pajama' | 'dress' | 'swim' | 'crop' | 'blazer';
  sleeves: 'long' | 'short' | 'none';
  pattern?: 'flowers' | 'plaid' | 'stripes';
  patternColor?: string;
  bottom: string;
  bottomDark: string;
  bottomStyle: 'pants' | 'shorts';
  shoes: string;
  chain?: boolean;
  shadesOnHead?: boolean;
  print?: string; // short text printed on the shirt
}

export interface Design {
  id: CharId | ExtraId;
  name: string;
  female?: boolean;
  lips?: string;
  skin: string;
  skinShade: string;
  hair: string;
  hairLight: string;
  hairStyle: 'fade' | 'quiff' | 'cap' | 'long' | 'pony' | 'bun' | 'curly' | 'bald' | 'side';
  beard: 'full' | 'goatee' | 'none';
  beardColor?: string;
  capColor?: string;
  torsoW: number;
  torsoH: number;
  belly: number; // 0..1
  legLen: number;
  legW: number;
  armW: number;
  headW: number;
  headH: number;
  chin: number; // chin prominence
  outfits: Record<Look, Outfit>;
}

const same = (o: Outfit): Record<Look, Outfit> => ({ home: o, travel: o, beach: o, club: o, hotel: o, pool: o });

const SHOE_DARK = '#2a2a2e';

export const DESIGNS: Record<CharId, Design> = {
  nir: {
    id: 'nir',
    name: 'ניר סבן',
    skin: '#f2c9a0',
    skinShade: '#d9a77c',
    hair: '#1c1714',
    hairLight: '#5b524c',
    hairStyle: 'fade',
    beard: 'full',
    beardColor: '#3b2a20',
    torsoW: 158,
    torsoH: 200,
    belly: 0,
    legLen: 172,
    legW: 42,
    armW: 30,
    headW: 156,
    headH: 178,
    chin: 0.5,
    outfits: {
      home: { top: '#8b8f96', topDark: '#6d7177', topStyle: 'pajama', sleeves: 'short', bottom: '#3d5a9c', bottomDark: '#2c4277', bottomStyle: 'shorts', shoes: '#c9c9c9', pattern: 'plaid', patternColor: '#5873b8' },
      travel: { top: '#1d1d22', topDark: '#0e0e11', topStyle: 'turtleneck', sleeves: 'long', bottom: '#3b4f72', bottomDark: '#2b3a55', bottomStyle: 'pants', shoes: SHOE_DARK },
      beach: { top: '#1d1d22', topDark: '#0e0e11', topStyle: 'tee', sleeves: 'short', bottom: '#1f9c9a', bottomDark: '#167574', bottomStyle: 'shorts', shoes: '#333', print: '</>' },
      club: { top: '#25252b', topDark: '#141418', topStyle: 'shirt', sleeves: 'long', bottom: '#202737', bottomDark: '#151a26', bottomStyle: 'pants', shoes: SHOE_DARK },
      hotel: { top: '#f4f4f0', topDark: '#d6d6cf', topStyle: 'polo', sleeves: 'short', bottom: '#c7b28a', bottomDark: '#a8936c', bottomStyle: 'pants', shoes: '#6b4a2f' },
      pool: { top: '#1d1d22', topDark: '#0e0e11', topStyle: 'tee', sleeves: 'short', bottom: '#2b63c9', bottomDark: '#1f4b9a', bottomStyle: 'shorts', shoes: '#333', print: '</>' },
    },
  },
  roee: {
    id: 'roee',
    name: 'רואי',
    skin: '#e8b48a',
    skinShade: '#c99068',
    hair: '#6e3f1c',
    hairLight: '#d8a24f',
    hairStyle: 'quiff',
    beard: 'none',
    torsoW: 134,
    torsoH: 214,
    belly: 0,
    legLen: 190,
    legW: 36,
    armW: 26,
    headW: 146,
    headH: 184,
    chin: 0.9,
    outfits: {
      home: { top: '#ffffff', topDark: '#d9d9d9', topStyle: 'tank', sleeves: 'none', bottom: '#d6342c', bottomDark: '#a8241e', bottomStyle: 'shorts', shoes: '#ffffff', chain: true, shadesOnHead: true },
      travel: { top: '#ffffff', topDark: '#d9d9d9', topStyle: 'tank', sleeves: 'none', bottom: '#d6342c', bottomDark: '#a8241e', bottomStyle: 'shorts', shoes: '#ffffff', chain: true, shadesOnHead: true },
      beach: { top: '#e8b48a', topDark: '#c99068', topStyle: 'bare', sleeves: 'none', bottom: '#ff6fae', bottomDark: '#d64d8a', bottomStyle: 'shorts', shoes: '#ffd23f', chain: true, shadesOnHead: true, pattern: 'flowers', patternColor: '#fff36b' },
      club: { top: '#ff7eb6', topDark: '#d95b93', topStyle: 'openShirt', sleeves: 'long', bottom: '#f2f2f2', bottomDark: '#cfcfcf', bottomStyle: 'pants', shoes: '#ffffff', chain: true },
      hotel: { top: '#2ec4b6', topDark: '#1f9a8f', topStyle: 'openShirt', sleeves: 'short', pattern: 'flowers', patternColor: '#ffbf69', bottom: '#f2f2f2', bottomDark: '#cfcfcf', bottomStyle: 'shorts', shoes: '#ffffff', chain: true, shadesOnHead: true },
      pool: { top: '#e8b48a', topDark: '#c99068', topStyle: 'bare', sleeves: 'none', bottom: '#ff6fae', bottomDark: '#d64d8a', bottomStyle: 'shorts', shoes: '#ffd23f', chain: true, shadesOnHead: true, pattern: 'flowers', patternColor: '#fff36b' },
    },
  },
  marom: {
    id: 'marom',
    name: 'מרום',
    skin: '#d9a77a',
    skinShade: '#b9885d',
    hair: '#2b2018',
    hairLight: '#4a3a2c',
    hairStyle: 'cap',
    capColor: '#d63a3a',
    beard: 'goatee',
    torsoW: 188,
    torsoH: 196,
    belly: 1,
    legLen: 160,
    legW: 48,
    armW: 34,
    headW: 162,
    headH: 172,
    chin: 0.3,
    outfits: {
      home: { top: '#f28c28', topDark: '#c96d15', topStyle: 'polo', sleeves: 'short', bottom: '#7a7458', bottomDark: '#5e5943', bottomStyle: 'shorts', shoes: '#3a3a3a' },
      travel: { top: '#f28c28', topDark: '#c96d15', topStyle: 'polo', sleeves: 'short', bottom: '#7a7458', bottomDark: '#5e5943', bottomStyle: 'shorts', shoes: '#3a3a3a' },
      beach: { top: '#2f80ed', topDark: '#1f5fb8', topStyle: 'tank', sleeves: 'none', bottom: '#7a7458', bottomDark: '#5e5943', bottomStyle: 'shorts', shoes: '#3a3a3a' },
      club: { top: '#555b66', topDark: '#3c4049', topStyle: 'tee', sleeves: 'short', bottom: '#2a3142', bottomDark: '#1c2130', bottomStyle: 'pants', shoes: '#3a3a3a', print: '❄' },
      hotel: { top: '#57a85a', topDark: '#3e7f41', topStyle: 'tee', sleeves: 'short', bottom: '#7a7458', bottomDark: '#5e5943', bottomStyle: 'shorts', shoes: '#3a3a3a', print: '❄' },
      pool: { top: '#2f80ed', topDark: '#1f5fb8', topStyle: 'tank', sleeves: 'none', bottom: '#7a7458', bottomDark: '#5e5943', bottomStyle: 'shorts', shoes: '#3a3a3a' },
    },
  },
};

const girl = (
  id: ExtraId,
  skin: string,
  hair: string,
  hairLight: string,
  hairStyle: Design['hairStyle'],
  day: Outfit,
  beach: Outfit,
  night: Outfit,
): Design => ({
  id,
  name: 'בחורה',
  female: true,
  lips: '#c4485a',
  skin,
  skinShade: shade(skin),
  hair,
  hairLight,
  hairStyle,
  beard: 'none',
  torsoW: 112,
  torsoH: 190,
  belly: 0,
  legLen: 182,
  legW: 32,
  armW: 22,
  headW: 136,
  headH: 160,
  chin: 0.2,
  outfits: { home: day, travel: day, hotel: day, beach, pool: beach, club: night },
});

function shade(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.round(v * 0.85));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('');
}

const dress = (c: string, d: string): Outfit => ({ top: c, topDark: d, topStyle: 'dress', sleeves: 'none', bottom: c, bottomDark: d, bottomStyle: 'shorts', shoes: '#c8506a' });
const swim = (c: string, d: string, b: string): Outfit => ({ top: c, topDark: d, topStyle: 'swim', sleeves: 'none', bottom: b, bottomDark: shade(b), bottomStyle: 'shorts', shoes: '#f4d35e' });
const crop = (c: string, d: string, b: string): Outfit => ({ top: c, topDark: d, topStyle: 'crop', sleeves: 'short', bottom: b, bottomDark: shade(b), bottomStyle: 'pants', shoes: '#222' });

export const EXTRAS: Record<ExtraId, Design> = {
  girlA: girl('girlA', '#f6d2b3', '#f1c24b', '#fbe08a', 'long', dress('#f6a5c0', '#d9839f'), swim('#ff5d73', '#d43f55', '#ff5d73'), crop('#9b5de5', '#7a3fc4', '#222a3a')),
  girlB: girl('girlB', '#c98e62', '#2a1a12', '#5b3a28', 'curly', dress('#ffd166', '#e0b040'), swim('#06d6a0', '#05a87d', '#06d6a0'), crop('#ef476f', '#c92f55', '#1b1b2a')),
  girlC: girl('girlC', '#f3c7a6', '#c2452d', '#e2734f', 'pony', crop('#4cc9f0', '#2fa6cc', '#f2f2f2'), swim('#f9844a', '#d96a30', '#f9844a'), dress('#111111', '#000000')),
  girlD: girl('girlD', '#e0ac85', '#141018', '#3a3040', 'bun', dress('#80ed99', '#5bc977'), swim('#3a86ff', '#2a68d0', '#3a86ff'), dress('#e63946', '#b8202d')),
  guard: {
    id: 'guard',
    name: 'מאבטח',
    skin: '#c48b5c',
    skinShade: '#a26f45',
    hair: '#1a1a1a',
    hairLight: '#333',
    hairStyle: 'bald',
    beard: 'goatee',
    torsoW: 210,
    torsoH: 210,
    belly: 0.3,
    legLen: 170,
    legW: 52,
    armW: 38,
    headW: 150,
    headH: 168,
    chin: 1,
    outfits: same({ top: '#111215', topDark: '#000', topStyle: 'tee', sleeves: 'short', bottom: '#1d1f26', bottomDark: '#111', bottomStyle: 'pants', shoes: '#000', print: 'אבטחה' }),
  },
  manager: {
    id: 'manager',
    name: 'מנהל',
    skin: '#f0c8a8',
    skinShade: '#d6a985',
    hair: '#8a8a8a',
    hairLight: '#bbbbbb',
    hairStyle: 'side',
    beard: 'none',
    torsoW: 170,
    torsoH: 200,
    belly: 0.5,
    legLen: 170,
    legW: 44,
    armW: 30,
    headW: 150,
    headH: 172,
    chin: 0.4,
    outfits: same({ top: '#2d3e6b', topDark: '#1f2c4f', topStyle: 'blazer', sleeves: 'long', bottom: '#2d3e6b', bottomDark: '#1f2c4f', bottomStyle: 'pants', shoes: '#111' }),
  },
};
