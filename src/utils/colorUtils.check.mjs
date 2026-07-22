// Runnable sanity check for the palette engine's pure logic.
// Run: node src/utils/colorUtils.check.mjs   (uses the project's chroma-js)
import chroma from 'chroma-js';
import assert from 'node:assert/strict';

// --- mirrors of the pure functions in colorUtils.ts ---
const SCHEMES = ['analogous', 'monochrome', 'complement', 'triad', 'spread'];
const genHarmonious = (count) => {
  const baseHue = Math.random() * 360;
  const scheme = SCHEMES[Math.floor(Math.random() * SCHEMES.length)];
  const baseSat = 0.45 + Math.random() * 0.35;
  const hueFor = (i) => scheme === 'analogous' ? baseHue + (i - (count - 1) / 2) * 25
    : scheme === 'monochrome' ? baseHue
    : scheme === 'complement' ? baseHue + (i % 2) * 180
    : scheme === 'triad' ? baseHue + (i % 3) * 120
    : baseHue + (360 / count) * i;
  return Array.from({ length: count }, (_, i) => {
    const h = ((hueFor(i) % 360) + 360) % 360;
    const s = Math.min(1, Math.max(0.15, baseSat + (Math.random() - 0.5) * 0.1));
    const l = Math.min(0.92, Math.max(0.1, 0.28 + (0.5 * (i + 0.5)) / count + (Math.random() - 0.5) * 0.08));
    return chroma.hsl(h, s, l).hex();
  });
};
const toSlug = (c) => c.map(x => x.replace('#', '').toLowerCase()).join('-');
const fromSlug = (s) => {
  const c = s.split('-').map(p => '#' + p);
  return c.every(x => chroma.valid(x)) ? c.map(x => chroma(x).hex()) : null;
};
const getShades = (color) => Array.from({ length: 9 }, (_, i) => chroma(color).set('hsl.l', (i + 1) / 10).hex());

// --- assertions ---
for (let n = 2; n <= 10; n++) {
  const p = genHarmonious(n);
  assert.equal(p.length, n, `palette size ${n}`);
  p.forEach(c => assert.ok(chroma.valid(c), `valid hex ${c}`));
}

const orig = ['#264653', '#2a9d8f', '#e9c46a'];
assert.equal(toSlug(orig), '264653-2a9d8f-e9c46a', 'slug encode');
assert.deepEqual(fromSlug('264653-2a9d8f-e9c46a'), orig.map(c => chroma(c).hex()), 'slug round-trip');
assert.equal(fromSlug('nothex-zzz'), null, 'invalid slug rejected');

const shades = getShades('#2a9d8f');
assert.equal(shades.length, 9, 'nine shades');
assert.ok(chroma(shades[0]).get('hsl.l') < chroma(shades[8]).get('hsl.l'), 'shades run light→dark index order (l=0.1 → 0.9)');

console.log('OK — palette engine checks pass');
