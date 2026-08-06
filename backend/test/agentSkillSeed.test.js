import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';

const seedDir = new URL('../../database/init/', import.meta.url);
const seedSql = fs
  .readdirSync(seedDir)
  .filter((name) => name.includes('_seed_') && name.endsWith('_agent_skills.sql'))
  .map((name) => fs.readFileSync(new URL(name, seedDir), 'utf8'))
  .join('\n');

test('agent skill seed declares every bundled skill idempotently', () => {
  const slugs = [...seedSql.matchAll(/INSERT INTO public\.agent_skills[\s\S]*?\nSELECT\s*\n\s*'([^']+)'/g)].map(
    (match) => match[1]
  );
  const guards = seedSql.match(/WHERE NOT EXISTS \(SELECT 1 FROM public\.agent_skills WHERE slug = '[^']+'\);/g) || [];

  assert.equal(slugs.length, 31);
  assert.equal(new Set(slugs).size, 31);
  assert.equal(guards.length, slugs.length);
  assert.ok(slugs.includes('cloudflare-security-audit'));
  assert.ok(slugs.includes('out-of-the-box'));
  assert.ok(slugs.includes('trail-of-bits-solana-scanner'));
  assert.ok(slugs.includes('trail-of-bits-zeroize-audit'));
});
