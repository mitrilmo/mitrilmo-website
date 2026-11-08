import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const comp = readFileSync(new URL('src/components/HeroPartikel.astro', root), 'utf8');
const css = readFileSync(new URL('src/styles/global.css', root), 'utf8');
const SEASONS = ['fruehling', 'sommer', 'herbst', 'winter'];

test('Partikel: wenige, dekorative Teilchen ohne externe Adressen', () => {
  const n = (comp.match(/\{ x: /g) || []).length;
  assert.ok(n >= 6 && n <= 12, `Anzahl ${n}`);
  assert.match(comp, /aria-hidden="true"/);
  assert.doesNotMatch(comp, /https?:|<img|<image|<script/);
});
test('Partikel: jede Jahreszeit hat eine eigene Form', () => {
  for (const s of SEASONS) assert.match(css, new RegExp(`html\\[data-season="${s}"\\] \\.teilchen`), s);
});
test('Partikel: ohne Bewegung (prefers-reduced-motion) werden sie ausgeblendet, nicht eingefroren', () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[^}]*\{[^}]*animation: none !important[^}]*\}\s*\.teilchen \{ display: none; \}/s);
});
test('Partikel: Teilchen sind klickdurchlässig und bleiben im Hero', () => {
  assert.match(css, /\.partikel \{[^}]*pointer-events: none/);
  assert.match(css, /\.partikel \{[^}]*overflow: hidden/);
});
