#!/usr/bin/env node
/**
 * verify.js – Pre-Deploy-Check für mitrilmo-website
 *
 * Prüft index.html auf Vollständigkeit, JS-Syntaxfehler und bekannte
 * Inkonsistenzen, BEVOR committed/gepusht wird. Nach Pfadwerk-Vorbild
 * (siehe Vault: 02 Projekte/Pfadwerk/Workflow-und-Arbeitsprozess.md).
 *
 * Aufruf (im Projektordner):  node verify.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const ROOT = __dirname;
const INDEX = path.join(ROOT, 'index.html');

let errors = 0;
let warnings = 0;

function ok(msg) { console.log(`  ✅ ${msg}`); }
function fail(msg) { console.log(`  ❌ ${msg}`); errors++; }
function warn(msg) { console.log(`  ⚠️  ${msg}`); warnings++; }

console.log('── mitrilmo-website verify.js ──\n');

if (!fs.existsSync(INDEX)) {
  console.error(`Datei nicht gefunden: ${INDEX}`);
  process.exit(1);
}

const html = fs.readFileSync(INDEX, 'utf8');

// 1. Dateigröße (Truncation-Schutz)
console.log('1. Dateigröße');
const MIN_SIZE = 150000; // Stand 16.06.2026: ~180 KB. Bei Wachstum der Seite ggf. erhöhen.
if (html.length < MIN_SIZE) {
  fail(`index.html ist nur ${html.length} Bytes groß (erwartet mind. ${MIN_SIZE}). Könnte abgeschnitten sein.`);
} else {
  ok(`${html.length} Bytes`);
}

// 2. Korrektes Dateiende
console.log('\n2. Dateiende');
const trimmed = html.trimEnd();
if (trimmed.endsWith('</html>')) {
  ok('Datei endet korrekt mit </html>');
} else {
  fail(`Datei endet NICHT mit </html> (letzte 40 Zeichen: "${trimmed.slice(-40)}"). Vermutlich abgeschnitten.`);
}

// 3. Pflicht-Landmarken
console.log('\n3. Pflicht-Inhalte');
const required = ['<!DOCTYPE html', '</body>', 'REGIONSKARTE', 'Datenschutzerklärung', 'Impressum'];
required.forEach(marker => {
  if (html.includes(marker)) {
    ok(`„${marker}" vorhanden`);
  } else {
    fail(`„${marker}" fehlt`);
  }
});

// 4. JS-Syntax-Check für alle inline <script>-Blöcke
console.log('\n4. JavaScript-Syntax');
const scriptBlocks = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map(m => m[1])
  .filter(code => code.trim().length > 0);

if (scriptBlocks.length === 0) {
  warn('Keine inline <script>-Blöcke gefunden – ungewöhnlich, bitte prüfen.');
} else {
  scriptBlocks.forEach((code, i) => {
    const tmpFile = path.join(os.tmpdir(), `mitrilmo-verify-${i}.js`);
    fs.writeFileSync(tmpFile, code);
    try {
      execSync(`node --check "${tmpFile}"`, { stdio: 'pipe' });
      ok(`Script-Block ${i + 1}/${scriptBlocks.length}: Syntax ok`);
    } catch (e) {
      const detail = (e.stderr ? e.stderr.toString() : e.message).trim().split('\n').join('\n     ');
      fail(`Script-Block ${i + 1}/${scriptBlocks.length}: Syntaxfehler\n     ${detail}`);
    } finally {
      fs.unlinkSync(tmpFile);
    }
  });
}

// 5. Touren ↔ SVG-Pins Konsistenz
//    Hintergrund (Vault-Notiz 16.06.2026): Pins auf der Regionskarte werden
//    NICHT automatisch aus dem koordinaten-Feld generiert – jeder Pin muss
//    einzeln als <g class="map-pin" data-tour="..."> im SVG stehen.
console.log('\n5. Touren ↔ Regionskarte-Pins');
const tourArrayMatch = html.match(/alle = \[([\s\S]*?)\n  \];/);
if (!tourArrayMatch) {
  warn('Touren-Array ("alle = [...]") nicht gefunden – Konsistenzcheck übersprungen.');
} else {
  const tourIds = [...tourArrayMatch[1].matchAll(/id:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const pinIds = [...html.matchAll(/data-tour="([^"]+)"/g)].map(m => m[1]);

  const missingPins = tourIds.filter(id => !pinIds.includes(id));
  const orphanPins = pinIds.filter(id => !tourIds.includes(id));

  if (missingPins.length === 0 && orphanPins.length === 0) {
    ok(`Alle ${tourIds.length} Touren haben einen passenden SVG-Pin`);
  }
  missingPins.forEach(id => fail(`Tour „${id}" hat KEINEN Pin im SVG (<g class="map-pin" data-tour="${id}"> fehlt)`));
  orphanPins.forEach(id => warn(`Pin „${id}" im SVG hat keine passende Tour im Array (verwaister Pin?)`));
}

// 6. Verlinkte Wanderberichte existieren als Datei
console.log('\n6. Wanderberichte-Dateien');
const berichteMatch = html.match(/wanderberichte = \[([\s\S]*?)\n  \];/);
if (!berichteMatch) {
  warn('Wanderberichte-Array nicht gefunden – Check übersprungen.');
} else {
  const dateien = [...berichteMatch[1].matchAll(/datei:\s*["']([^"']+)["']/g)].map(m => m[1]);
  if (dateien.length === 0) {
    warn('Keine Wanderberichte im Array gefunden.');
  }
  dateien.forEach(datei => {
    const full = path.join(ROOT, datei);
    if (fs.existsSync(full)) {
      ok(`${datei} existiert`);
    } else {
      fail(`${datei} ist im Array verlinkt, aber die Datei existiert nicht`);
    }
  });
}

// Ergebnis
console.log('\n──────────────────────────────');
if (errors > 0) {
  console.log(`❌ FEHLGESCHLAGEN: ${errors} Fehler, ${warnings} Warnungen.\nNicht deployen, bis behoben.`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`⚠️  Bestanden mit ${warnings} Warnung(en) – bitte kurz prüfen.`);
  process.exit(0);
} else {
  console.log('✅ Alle Checks bestanden. Deploy ok.');
  process.exit(0);
}
