import { spawnSync } from 'node:child_process';

/** Run a command synchronously with retries (exponential backoff). */
export function run(cmd: string, args: string[], opts: { input?: string; retries?: number; label?: string; stderr?: boolean } = {}): string {
  const retries = opts.retries ?? 3;
  let lastErr = '';
  for (let attempt = 0; attempt <= retries; attempt++) {
    const r = spawnSync(cmd, args, { input: opts.input, encoding: 'utf8', maxBuffer: 1 << 28 });
    if (r.status === 0) return opts.stderr ? r.stdout + r.stderr : r.stdout;
    lastErr = `${cmd} exited ${r.status}: ${r.stderr?.slice(-800)}`;
    if (attempt < retries) {
      const wait = 250 * 2 ** attempt;
      console.warn(`  ! ${opts.label ?? cmd} failed (attempt ${attempt + 1}), retrying in ${wait}ms`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, wait);
    }
  }
  throw new Error(lastErr);
}
