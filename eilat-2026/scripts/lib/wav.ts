import { writeFileSync, readFileSync } from 'node:fs';

export const SR = 48000;

/** Write mono or stereo float buffers as 16-bit PCM WAV. */
export function writeWav(file: string, channels: Float32Array[], sr = SR) {
  const n = channels[0].length;
  const nc = channels.length;
  const buf = Buffer.alloc(44 + n * nc * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * nc * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(nc, 22);
  buf.writeUInt32LE(sr, 24);
  buf.writeUInt32LE(sr * nc * 2, 28);
  buf.writeUInt16LE(nc * 2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * nc * 2, 40);
  let o = 44;
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < nc; c++) {
      const v = Math.max(-1, Math.min(1, channels[c][i]));
      buf.writeInt16LE(Math.round(v * 32767), o);
      o += 2;
    }
  }
  writeFileSync(file, buf);
}

/** Read a 16-bit PCM WAV (first channel) — used for duration/level analysis. */
export function readWav(file: string): { sr: number; data: Float32Array } {
  const b = readFileSync(file);
  let p = 12;
  let sr = 0, nc = 1, bits = 16;
  while (p < b.length) {
    const id = b.toString('ascii', p, p + 4);
    const size = b.readUInt32LE(p + 4);
    if (id === 'fmt ') {
      nc = b.readUInt16LE(p + 10);
      sr = b.readUInt32LE(p + 12);
      bits = b.readUInt16LE(p + 22);
    } else if (id === 'data') {
      const n = Math.floor(size / (nc * (bits / 8)));
      const out = new Float32Array(n);
      for (let i = 0; i < n; i++) out[i] = b.readInt16LE(p + 8 + i * nc * 2) / 32768;
      return { sr, data: out };
    }
    p += 8 + size + (size % 2);
  }
  throw new Error('bad wav ' + file);
}
