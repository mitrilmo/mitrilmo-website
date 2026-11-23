import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zipSync, strToU8 } from 'fflate';
import { slugify, parseTourZip, buildTourEntry } from '../scripts/lib/tour-import.mjs';

const tourJson = (tour = {}, extra = {}) => ({
  format: 'pfadwerk-website-tour',
  version: 1,
  tour: { title: 'Rund um die Müllerhöhe', activity: 'wandern', routeType: 'rundweg', distanceKm: 8.4, duration: '2 Std. 30 Min.', gpx: 'strecke.gpx', image: 'titelbild.jpg', ...tour },
  ...extra,
});
const makeZip = (json, files = { 'strecke.gpx': strToU8('<gpx/>'), 'titelbild.jpg': strToU8('x') }) =>
  zipSync({ 'tour.json': strToU8(JSON.stringify(json)), ...files });
const ext = { place: 'Ennepetal', difficulty: 'leicht', alt: 'Waldweg im Herbst', published: '2026-11-23', description: 'Ein ruhiger Rundweg durch den Wald mit schöner Aussicht.' };

test('slugify ersetzt Umlaute vor dem Entfernen von Akzenten', () => {
  assert.equal(slugify('Rund um die Müllerhöhe'), 'rund-um-die-muellerhoehe');
  assert.equal(slugify('Café Straße'), 'cafe-strasse');
});

test('parseTourZip liest tour.json und prüft genannte Dateien', () => {
  const { json } = parseTourZip(Buffer.from(makeZip(tourJson())));
  assert.equal(json.tour.title, 'Rund um die Müllerhöhe');
  assert.throws(() => parseTourZip(Buffer.from(makeZip(tourJson(), { 'titelbild.jpg': strToU8('x') }))), /strecke\.gpx/);
  assert.throws(() => parseTourZip(Buffer.from(zipSync({ 'x.txt': strToU8('a') }))), /tour\.json fehlt/);
  assert.throws(() => parseTourZip(Buffer.from(makeZip({ ...tourJson(), format: 'anders' }))), /Format/);
});

test('buildTourEntry: vollständige Angaben ergeben ein Frontmatter', () => {
  const r = buildTourEntry(tourJson({ familyFriendly: 'ja', accessible: 'ja' }), ext);
  assert.deepEqual(r.missing, []);
  assert.equal(r.slug, 'rund-um-die-muellerhoehe');
  assert.equal(r.data.image, '../../assets/images/tours/rund-um-die-muellerhoehe.jpg');
  assert.equal(r.data.gpx, 'gpx/rund-um-die-muellerhoehe.gpx');
  assert.equal(r.data.accessible, 'ja');
  assert.equal(r.data.publishedAt, '2026-11-23');
});

test('buildTourEntry: fehlende Pflichtangaben werden gemeldet, nichts wird geraten', () => {
  const r = buildTourEntry(tourJson({ image: undefined }), {});
  const text = r.missing.join(' | ');
  for (const w of ['Kurzbeschreibung', 'Schwierigkeit', 'Ort', 'Titelbild', 'Alt-Text', 'Veröffentlichungsdatum']) assert.match(text, new RegExp(w));
});

test('buildTourEntry: Ziel ohne Länge ist erlaubt, GPX wird verworfen', () => {
  const r = buildTourEntry(tourJson({ distanceKm: undefined }), { ...ext, kind: 'ziel' });
  assert.deepEqual(r.missing, []);
  assert.equal(r.data.gpx, undefined);
  assert.match(r.warnings.join(' '), /Ziel/);
  const tour = buildTourEntry(tourJson({ distanceKm: undefined }), ext);
  assert.match(tour.missing.join(' '), /Länge/);
});

test('buildTourEntry: Video ohne Eintrag wird nicht verknüpft', () => {
  const r = buildTourEntry(tourJson({ video: 'cZt9hn0tH3E' }), ext, { videoExists: () => false });
  assert.equal(r.data.video, undefined);
  assert.match(r.warnings.join(' '), /cZt9hn0tH3E/);
  assert.equal(buildTourEntry(tourJson({ video: 'cZt9hn0tH3E' }), ext, { videoExists: () => true }).data.video, 'cZt9hn0tH3E');
});
