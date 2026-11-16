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
test('Spiel: Bonus-Level Höhle und Gebirgsgrat (Hindernisse mit Texten, Boden verschiebbar, Etappen unverändert)', () => {
  const typen = ['stalag', 'stalag2', 'pfuetze', 'stalak', 'bat', 'gap', 'boulder', 'steinmann', 'dohle', 'felsnase'];
  for (const t of typen) {
    assert.ok(js.includes('HIT.' + t + '='), 'HIT ' + t);
    assert.ok(js.includes('DODGE.' + t + '='), 'DODGE ' + t);
    assert.ok(js.includes(',' + t + ':') || js.includes('{' + t + ':'), 'Maße ' + t);
  }
  assert.match(js, /var W=680,H=340,GY=252,FY=286,LOOP=1350,GY0=252,FY0=286,gOff=0;/);
  assert.match(js, /STAGE=bn\?BSTAGE:3200;NST=bn\?2:6/);
  assert.match(js, /var SEA=\['Frühling','Sommer','Herbst','Winter','Nacht','Sommer'\]/);
  assert.match(js, /\(g\.bonus\?192:150\+g\.stage\*14\)/, 'Tempo im Bonus wie Etappe 4');
  assert.match(js, /if\(cur!=='Nacht'&&cur!=='Höhle'\)return;/);
});
test('Spiel: Bonus-Level haben eigene Fundstücke und Warnschilder', () => {
  for (const k of ['kristall', 'helm', 'batterie', 'schoki', 'brille']) {
    assert.ok(js.includes(' ' + k + ':['), 'FUNDTXT ' + k);
    assert.ok(js.includes(k + ":'"), 'NAMEN ' + k);
    assert.ok(js.includes("k==='" + k + "'"), 'Zeichnung ' + k);
  }
  for (const s of ['Steinschlag', 'Absturzgefahr', 'Vorsicht, Kopf!', 'Windböen']) assert.ok(js.includes("'" + s + "'"), s);
  assert.ok(js.includes('function fgKnorr'), 'Knorrige Bäume im Vordergrund des Grats');
  assert.ok(js.includes('function hangBat'), 'Fledermäuse an der Höhlendecke');
});
test('Spiel: Bonus Moor und Küste (Hindernisse mit Texten und Maßen, Funde, Szenen, g.bonus 0/1/2)', () => {
  for (const t of ['hedge', 'crow', 'seal', 'gull']) {
    assert.ok(js.includes('HIT.' + t + '='), 'HIT ' + t);
    assert.ok(js.includes('DODGE.' + t + '='), 'DODGE ' + t);
    assert.ok(js.includes(t + ':'), 'Maße ' + t);
    assert.match(js, new RegExp('BON=\\{[^}]*' + t + ':1'), 'BON ' + t);
  }
  assert.match(js, /LUFT=\{[^}]*crow:1,gull:1\}/, 'Krähe und Möwe zum Ducken');
  assert.match(js, /hedge:\.3/, 'Igel läuft wie der Fuchs an');
  for (const k of ['stiefel', 'korb', 'muschel', 'karte']) {
    assert.ok(js.includes(' ' + k + ':['), 'FUNDTXT ' + k);
    assert.ok(js.includes(k + ":'"), 'NAMEN ' + k);
    assert.ok(js.includes("k==='" + k + "'"), 'Zeichnung ' + k);
  }
  for (const f of ['function drawMoor', 'function drawCoast', 'function moorFront', 'function coastFront', 'function hedgehog', 'function robbe', 'function bude', 'function deadTrees', 'function giantTree']) assert.ok(js.includes(f), f);
  assert.match(js, /function start\(bn\)\{g\.bonus=bn\|\|0;/, 'g.bonus ist 0, 1 oder 2');
  assert.match(js, /BSEA2=\['Moor','Küste'\]/);
  assert.match(js, /'Bonus '\+\(g\.stage\+1\+\(g\.bonus===2\?2:0\)\)\+'\/4'/, 'HUD Bonus 3/4 und 4/4');
  assert.ok(js.includes('function fahneFg'), 'Fahne im Vordergrund der Küste');
  assert.ok(!js.includes('gustCalc'), 'keine hektischen Böen mehr');
});
test('Spiel: Texte der neuen Hindernisse ohne Gedankenstriche', () => {
  const block = js.slice(js.indexOf('var BSTAGE='), js.indexOf('function pick('));
  assert.ok(block.length > 2000);
  assert.doesNotMatch(block, /[–—]/);
});
