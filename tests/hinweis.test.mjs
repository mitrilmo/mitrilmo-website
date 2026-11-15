import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

test('Hinweis: Text nennt selbst bezahlt und keine Gegenleistung, ohne externe Adressen', () => {
  const c = read('src/components/SelbstBezahlt.astro');
  assert.match(c, /bezahlen wir selbst/);
  assert.match(c, /keine andere Gegenleistung/);
  assert.doesNotMatch(c, /https?:/);
});
test('Hinweis: steht auf der Neuigkeiten-Seite und unter jedem Beitrag', () => {
  for (const p of ['src/pages/neuigkeiten.astro', 'src/pages/neuigkeiten/[slug].astro']) {
    const s = read(p);
    assert.match(s, /import SelbstBezahlt from/, p);
    assert.match(s, /<SelbstBezahlt /, p);
  }
});
test('Hinweis: Spiel- und Quiz-Beitrag zeigen ihn nicht (hinweis: false), die Seite schaltet ihn pro Beitrag', () => {
  assert.match(read('src/pages/neuigkeiten/[slug].astro'), /data\.hinweis && <SelbstBezahlt /);
  for (const p of ['src/content/news/2026-11-09-mos-hike-quest.md', 'src/content/news/2026-11-13-wissen-und-quiz.md']) assert.match(read(p), /^hinweis: false$/m, p);
});
