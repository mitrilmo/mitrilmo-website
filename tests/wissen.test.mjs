import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { wissenSchema, quizSchema } from '../src/schemas/wissen.js';
import { alleLektionen, antwortenOrdnen, stufeFuer, lektionenZahl } from '../src/lib/wissen.js';
import { externalUrls } from '../scripts/lib/checks.mjs';

const root = new URL('..', import.meta.url);
const dir = new URL('src/content/wissen/', root);
const dateien = readdirSync(dir).filter((f) => f.endsWith('.yaml'));
const themen = Object.fromEntries(dateien.map((f) => [f.replace(/\.yaml$/, ''), parse(readFileSync(new URL(f, dir), 'utf8'))]));
const js = readFileSync(new URL('src/scripts/wissen.js', root), 'utf8');
const seite = readFileSync(new URL('src/pages/wissen/[thema].astro', root), 'utf8');

const alleTexte = (obj) => JSON.stringify(obj);

test('Wissen: drei Themen mit je 15 Lektionen in 3 Etappen', () => {
  assert.deepEqual(Object.keys(themen).sort(), ['entdecken', 'radfahren', 'wandern']);
  for (const [name, t] of Object.entries(themen)) {
    assert.equal(lektionenZahl(t), 15, name);
    assert.equal(t.module.length, 3, name);
    for (const m of t.module) assert.equal(m.lektionen.length, 5, `${name} ${m.id}`);
  }
});

test('Wissen: jedes Thema besteht das Schema (IDs eindeutig, Urkunde beginnt bei 0)', () => {
  for (const [name, t] of Object.entries(themen)) {
    const r = wissenSchema.safeParse(t);
    assert.equal(r.success, true, name + ' ' + (r.success ? '' : JSON.stringify(r.error.issues.map((i) => i.path.join('.') + ': ' + i.message))));
  }
});

test('Wissen: IDs sind über alle Themen eindeutig', () => {
  const ids = Object.values(themen).flatMap((t) => t.module.flatMap((m) => [m.id, ...m.lektionen.map((l) => l.id)]));
  assert.equal(new Set(ids).size, ids.length);
});

test('Schema: Quiz braucht genau drei falsche Antworten und keine doppelten', () => {
  const ok = { frage: 'Wie lautet die Frage hier?', richtig: 'Richtig', falsch: ['A falsch', 'B falsch', 'C falsch'], erklaerung: 'Eine Erklärung mit genug Zeichen.' };
  assert.equal(quizSchema.safeParse(ok).success, true);
  assert.equal(quizSchema.safeParse({ ...ok, falsch: ['A falsch', 'B falsch'] }).success, false);
  assert.equal(quizSchema.safeParse({ ...ok, falsch: ['Richtig', 'B falsch', 'C falsch'] }).success, false);
});

test('Schema: [PRÜFEN] darf nicht live gehen', () => {
  const t = structuredClone(themen.wandern);
  t.module[0].lektionen[0].text[0] = 'Etwa 4 km pro Stunde [PRÜFEN].';
  assert.equal(wissenSchema.safeParse(t).success, false);
});

test('Antworten: die richtige Position wechselt, jede Position kommt vor', () => {
  for (const [name, t] of Object.entries(themen)) {
    const pos = alleLektionen(t).map((l, nr) => antwortenOrdnen(l.quiz, nr).richtig);
    for (const p of [0, 1, 2, 3]) {
      const n = pos.filter((x) => x === p).length;
      assert.ok(n >= 3 && n <= 4, `${name}: Position ${p} kommt ${n}-mal vor`);
    }
  }
});

test('Antworten: Reihenfolge enthält alle vier Antworten, die richtige steht an der gemeldeten Stelle', () => {
  const q = themen.radfahren.module[0].lektionen[0].quiz;
  for (let nr = 0; nr < 8; nr++) {
    const { optionen, richtig } = antwortenOrdnen(q, nr);
    assert.equal(optionen.length, 4);
    assert.equal(optionen[richtig], q.richtig);
    assert.deepEqual([...optionen].sort(), [q.richtig, ...q.falsch].sort());
  }
});

test('Urkunde: Stufe passt zur Punktzahl', () => {
  const u = themen.wandern.urkunde;
  assert.equal(stufeFuer(u, 0).titel, 'Sofa-Wanderer');
  assert.equal(stufeFuer(u, 3).titel, 'Sofa-Wanderer');
  assert.equal(stufeFuer(u, 4).titel, 'Spaziergänger');
  assert.equal(stufeFuer(u, 10).titel, 'Pfadfinder in Ausbildung');
  assert.equal(stufeFuer(u, 15).titel, 'Wander-Profi');
});

test('Texte: keine Gedankenstriche, keine externen Adressen, keine fremden App-Namen, kein eigenes E-Bike', () => {
  for (const [name, t] of Object.entries(themen)) {
    const s = alleTexte(t);
    assert.doesNotMatch(s, /[—–]/, `${name}: Gedankenstrich`);
    assert.deepEqual(externalUrls(s), [], name);
    assert.doesNotMatch(s, /\b(komoot|strava|instagram|whatsapp|google maps|outdooractive|alltrails)\b/i, `${name}: fremder App-Name`);
    assert.doesNotMatch(s, /\b(mein|meinen|meinem) (e-bike|pedelec|akku|motor)/i, name);
  }
});

test('Texte: Lernziel, Erklärung und Fragen sind nicht leer und keine Antwort steht doppelt in einer Lektion', () => {
  for (const t of Object.values(themen)) {
    for (const l of alleLektionen(t)) {
      const alle = [l.quiz.richtig, ...l.quiz.falsch];
      assert.equal(new Set(alle).size, 4, l.id);
      assert.ok(l.quiz.frage.endsWith('?'), `${l.id}: Frage endet mit Fragezeichen`);
    }
  }
});

test('Skript: speichert nichts, setzt keine Cookies und fragt nichts an', () => {
  assert.doesNotMatch(js, /localStorage|sessionStorage|indexedDB|document\.cookie/);
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|\bimport\s*\(/);
  assert.deepEqual(externalUrls(js), []);
});

test('Seite: ohne JavaScript steht die Lösung klappbar da, Quiz-Knöpfe sind echte Buttons', () => {
  assert.match(seite, /<details class="loesung">/);
  assert.match(seite, /<button type="button" class="opt"/);
});

test('Szenen: Bewegung ist Canvas-Zeichnung ohne Anfragen, und endet mit prefers-reduced-motion (allgemeine Regel in global.css)', () => {
  const css = readFileSync(new URL('src/styles/global.css', root), 'utf8');
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*animation: none !important/);
  for (const f of ['src/components/WissenSzene.astro']) {
    const s = readFileSync(new URL(f, root), 'utf8');
    assert.deepEqual(externalUrls(s), [], f);
    assert.doesNotMatch(s, /<script|<img|<image|href="http/i, f);
    assert.match(s, /<canvas[^>]*aria-hidden="true"/, f);
    assert.match(s, /aria-hidden="true"/, f);
  }
});
