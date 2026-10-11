import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const hash = (v: unknown) => createHash('sha1').update(JSON.stringify(v)).digest('hex').slice(0, 12);

/** Tiny JSON cache index: key -> metadata. Assets are only regenerated when their inputs change. */
export class Cache<T> {
  private data: Record<string, T> = {};
  constructor(private file: string) {
    if (existsSync(file)) this.data = JSON.parse(readFileSync(file, 'utf8'));
  }
  get(key: string): T | undefined {
    return this.data[key];
  }
  set(key: string, v: T) {
    this.data[key] = v;
  }
  save() {
    mkdirSync(dirname(this.file), { recursive: true });
    writeFileSync(this.file, JSON.stringify(this.data, null, 1));
  }
}
