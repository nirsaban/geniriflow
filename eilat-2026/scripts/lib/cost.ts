import { existsSync, readFileSync, writeFileSync } from 'node:fs';

/**
 * Cost ledger. Every generation call is recorded with its provider and USD cost.
 * The current pipeline uses only local providers (espeak-ng/MBROLA, procedural
 * synthesis, Remotion), so all entries are $0. A paid provider must call
 * `requireApproval` first, which refuses unless EILAT_APPROVED_BUDGET_USD is set.
 */
const FILE = new URL('../../output/cost-ledger.json', import.meta.url);

interface Entry { ts: string; provider: string; op: string; units: number; usd: number }

export function record(provider: string, op: string, units: number, usd = 0) {
  const ledger: Entry[] = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : [];
  ledger.push({ ts: new Date().toISOString(), provider, op, units, usd });
  writeFileSync(FILE, JSON.stringify(ledger, null, 1));
}

export function summary() {
  const ledger: Entry[] = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : [];
  const by: Record<string, { units: number; usd: number }> = {};
  for (const e of ledger) {
    by[e.provider] ??= { units: 0, usd: 0 };
    by[e.provider].units += e.units;
    by[e.provider].usd += e.usd;
  }
  return by;
}

export function requireApproval(estimatedUsd: number) {
  const budget = Number(process.env.EILAT_APPROVED_BUDGET_USD ?? 0);
  if (estimatedUsd > budget) {
    throw new Error(`Paid generation of ~$${estimatedUsd.toFixed(2)} needs explicit approval (set EILAT_APPROVED_BUDGET_USD).`);
  }
}
