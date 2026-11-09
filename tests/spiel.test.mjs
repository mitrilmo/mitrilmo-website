import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { externalUrls } from '../scripts/lib/checks.mjs';

const root = new URL('..', import.meta.url);
const js = readFileSync(new URL('src/game/mos-hike-quest.js', root), 'utf8');
const seite = readFileSync(new URL('src/pages/projekte/mos-hike-quest.astro', root), 'utf8');
const projekt = readFileSync(new URL('src/content/projects/mos-hike-quest.md', root), 'utf8');

test('Spiel: keine externen Adressen im Skript, keine Anfragen nach außen', () => {
  assert.deepEqual(externalUrls(js), []);
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|importScripts|\bimport\s*\(/);
});
test('Spiel: speichert nichts im Browser und setzt keine Cookies', () => {
  assert.doesNotMatch(js, /localStorage|sessionStorage|indexedDB|document\.cookie/);
});
test('Spiel: das Skript lässt sich fest in die Seite einbetten (kein Skript-Ende, kein HTML-Kommentar)', () => {
  assert.doesNotMatch(js, /<\/script/i);
  assert.doesNotMatch(js, /<!--/);
});
test('Spiel: Testhaken window.__game nur mit ?dev in der Adresse', () => {
  const treffer = js.match(/^.*window\.__game=.*$/gm) || [];
  assert.equal(treffer.length, 1);
  assert.match(treffer[0], /if\(\/\[\?&\]dev\(=\|&\|\$\)\/\.test\(location\.search\)\)window\.__game=/);
});
test('Spiel: Marke ist im Skript (eingebettetes Logo, Copyright)', () => {
  assert.match(js, /LOGO\.src='data:image\/jpeg;base64,\/9j\//);
  assert.match(js, /© 2026 mitrilmo/);
  assert.ok(js.length < 400_000, 'Spielskript sollte unter 400 KB bleiben');
});
test('Spiel: Seite hat Umami, Impressum und Datenschutz, eine h1, einen main und keinen iFrame', () => {
  assert.equal((seite.match(/mobrain\./g) || []).length, 1);
  assert.match(seite, /\/#impressum/);
  assert.match(seite, /\/#datenschutz/);
  assert.equal((seite.match(/<h1\b/g) || []).length, 1);
  assert.equal((seite.match(/<main\b/g) || []).length, 1);
  assert.doesNotMatch(seite, /<iframe/i);
  assert.match(seite, /rel="canonical"/);
  assert.match(seite, /staging && <meta name="robots" content="noindex, nofollow"/);
});
test('Spiel: Projekt-Eintrag verweist auf die Spielseite', () => {
  assert.match(projekt, /kind: spiel/);
  assert.match(projekt, /href: \/projekte\/mos-hike-quest\.html/);
});
test('Spiel: Steuerung steht auf dem Titelbild, im Spiel nur kleine Hinweise am ersten Hindernis und ersten Adler', () => {
  assert.doesNotMatch(js, /function hintTafel/);
  assert.match(js, /function keycap/);
  for (const k of ['Leertaste', 'Esc', 'Springen!', 'Ducken!']) assert.ok(js.includes("'" + k + "'"), k);
  assert.match(js, /oder Symbol unten rechts/);
});
test('Spiel: Vorschaubild für Messenger (1200 × 630, ohne Metadaten) ist eingebunden', async () => {
  const meta = await sharp(fileURLToPath(new URL('src/assets/images/spiel/mos-hike-quest-vorschau.jpg', root))).metadata();
  assert.equal(meta.width, 1200);
  assert.equal(meta.height, 630);
  assert.ok(!meta.exif, 'Metadaten (EXIF, GPS) müssen entfernt sein');
  assert.ok(seite.includes('getImage({ src: vorschau, width: 1200'));
  assert.match(seite, /property="og:image:alt"/);
  assert.match(seite, /property="og:image:width"/);
});
