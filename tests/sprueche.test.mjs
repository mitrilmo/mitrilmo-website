import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SPRUECHE, SCHALTTAG } from '../src/data/sprueche.js';
import { KALENDER, TAGE, FEST, kalenderTexte, spruchFuer, baueKalender } from '../src/lib/sprueche.js';

const spruchSchluessel = new Function(readFileSync(new URL('../src/lib/spruch-schluessel.js', import.meta.url), 'utf8') + '; return spruchSchluessel;')();
const seasonFor = new Function(readFileSync(new URL('../src/lib/season.js', import.meta.url), 'utf8') + '; return seasonFor;')();

test('Sprüche: 365 Stück, Nummern lückenlos, Texte eindeutig und nicht leer', () => {
  assert.equal(SPRUECHE.length, 365);
  assert.deepEqual(SPRUECHE.map((s) => s.nr), Array.from({ length: 365 }, (_, i) => i + 1));
  assert.equal(new Set(SPRUECHE.map((s) => s.text)).size, 365);
  assert.ok(SPRUECHE.every((s) => s.text.length >= 20 && s.text.length <= 90), 'Länge 20 bis 90 Zeichen (passt in zwei bis drei Zeilen)');
  assert.ok(SPRUECHE.every((s) => ['ganzjaehrig', 'fruehling', 'sommer', 'herbst', 'winter'].includes(s.saison)));
  assert.ok(SPRUECHE.every((s) => s.kat && s.kat.length > 2));
});

test('Sprüche: Schreibweise (typografischer Apostroph, keine Markdown-Reste, kein Gedankenstrich)', () => {
  for (const s of SPRUECHE) {
    assert.ok(!/['`*_\\<>]/.test(s.text), `Zeichen in Nr. ${s.nr}: ${s.text}`);
    assert.ok(!/\s{2}|\s$|^\s/.test(s.text), `Leerraum in Nr. ${s.nr}`);
    assert.ok(!/[–—]/.test(s.text), `Gedankenstrich in Nr. ${s.nr}`);
  }
  assert.ok(SPRUECHE[364].text.includes('geht’s'));
});

test('Sprüche: nichts behauptet ein eigenes E-Bike, einen Motor oder Akku (Entscheidung Björn 07.11.2026)', () => {
  for (const s of SPRUECHE) assert.ok(!/e-bike|akku|motor|elektr|strom\b|reichweite|turbo|unterstützung|pedelec/i.test(s.text), `Nr. ${s.nr}: ${s.text}`);
});

test('Kalender: 365 Tage, jeder Spruch genau einmal', () => {
  assert.equal(TAGE.length, 365);
  assert.equal(new Set(TAGE).size, 365);
  assert.ok(!TAGE.includes('02-29'));
  assert.equal(KALENDER.size, 365);
  assert.equal(new Set([...KALENDER.values()].map((s) => s.nr)).size, 365);
});

test('Kalender: Jahreszeit-Sprüche liegen in ihrer Jahreszeit', () => {
  for (const key of TAGE) {
    const s = KALENDER.get(key);
    if (s.saison === 'ganzjaehrig') continue;
    const monat = Number(key.slice(0, 2));
    assert.equal(seasonFor(new Date(2026, monat - 1, 15)), s.saison, `Nr. ${s.nr} am ${key}`);
  }
});

test('Kalender: feste Tage (Neujahr, Aprilwetter, November, Weihnachtsmarkt, Silvester)', () => {
  for (const [nr, key] of Object.entries(FEST)) assert.equal(KALENDER.get(key).nr, Number(nr), `Nr. ${nr} am ${key}`);
  assert.ok(KALENDER.get('04-01').text.startsWith('Aprilwetter'));
  assert.ok(KALENDER.get('11-01').text.includes('November'));
  assert.ok(KALENDER.get('12-31').text.startsWith('Morgen geht'));
});

test('Kalender: Nachbartage ähneln sich nicht (Kategorie, erstes Wort)', () => {
  for (let i = 1; i < TAGE.length; i++) {
    const a = KALENDER.get(TAGE[i - 1]);
    const b = KALENDER.get(TAGE[i]);
    assert.notEqual(a.kat, b.kat, `${TAGE[i - 1]} und ${TAGE[i]}: gleiche Kategorie ${a.kat}`);
    assert.notEqual(a.text.split(' ')[0], b.text.split(' ')[0], `${TAGE[i - 1]} und ${TAGE[i]}: gleiches erstes Wort`);
  }
});

test('Kalender: gleiche Eingabe, gleicher Kalender (kein Zufall zur Laufzeit)', () => {
  const a = baueKalender();
  const b = baueKalender();
  assert.deepEqual([...a].map(([k, s]) => [k, s.nr]), [...b].map(([k, s]) => [k, s.nr]));
});

test('Spruch am Wegesrand: gleicher Tag gleicher Spruch, jeder Tag hat einen, Schalttag', () => {
  assert.equal(spruchFuer(new Date(2026, 10, 1)), spruchFuer(new Date(2026, 10, 1, 23, 59)));
  assert.notEqual(spruchFuer(new Date(2026, 10, 1)), spruchFuer(new Date(2026, 10, 2)));
  assert.equal(spruchFuer(new Date(2027, 10, 1)), spruchFuer(new Date(2026, 10, 1)), 'jedes Jahr gleich');
  assert.equal(spruchFuer(new Date(2028, 1, 29)), SCHALTTAG);
  assert.equal(SCHALTTAG.length > 20, true);
  // jeder Tag in einem Schaltjahr und in einem normalen Jahr hat einen Spruch
  for (const jahr of [2026, 2028]) {
    for (let t = new Date(jahr, 0, 1); t.getFullYear() === jahr; t.setDate(t.getDate() + 1)) {
      assert.ok(spruchFuer(t), `kein Spruch am ${t.toDateString()}`);
    }
  }
  assert.equal(Object.keys(kalenderTexte()).length, 366);
});

test('Browser-Schlüssel (spruch-schluessel.js) passt zu jedem Kalendertag', () => {
  const texte = kalenderTexte();
  for (const jahr of [2026, 2028]) {
    for (let t = new Date(jahr, 0, 1); t.getFullYear() === jahr; t.setDate(t.getDate() + 1)) {
      assert.ok(spruchSchluessel(t) in texte, `Schlüssel ${spruchSchluessel(t)} fehlt`);
    }
  }
  assert.equal(spruchSchluessel(new Date(2026, 0, 5)), '01-05');
  assert.equal(spruchSchluessel(new Date(2026, 11, 31)), '12-31');
});
