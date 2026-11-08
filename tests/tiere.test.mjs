import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const comp = readFileSync(new URL('src/components/WegweiserTier.astro', root), 'utf8');
const css = readFileSync(new URL('src/styles/global.css', root), 'utf8');
const SEASONS = ['fruehling', 'sommer', 'herbst', 'winter'];

test('Tiere: je Jahreszeit genau ein dekoratives Tier', () => {
  for (const s of SEASONS) {
    assert.equal((comp.match(new RegExp(`class="tier tier-${s}"`, 'g')) || []).length, 1, s);
  }
  assert.equal((comp.match(/<svg /g) || []).length, SEASONS.length);
  assert.equal((comp.match(/aria-hidden="true"/g) || []).length, SEASONS.length);
});
test('Tiere: nur das Tier der Jahreszeit wird gezeigt, ohne JavaScript (Herbst) das Eichhörnchen', () => {
  assert.match(css, /\.tier\s*\{[^}]*display:\s*none/);
  for (const s of SEASONS) assert.match(css, new RegExp(`html\\[data-season="${s}"\\] \\.tier-${s}`));
  assert.match(comp, /<!-- Herbst: Eichhörnchen -->/);
});
test('Tiere: keine externen Adressen, keine Bilddatei', () => {
  assert.doesNotMatch(comp, /https?:|<image|href=/);
});
test('Tiere: Bewegung nur über CSS-Animationen, die prefers-reduced-motion abschaltet', () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[^}]*\{[^}]*animation: none !important/s);
  assert.doesNotMatch(comp, /<animate|<script/);
});
