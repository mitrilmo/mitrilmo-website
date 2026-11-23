// Tour aus dem Pfadwerk-Export "Für Website (ZIP)" übernehmen (Format pfadwerk-website-tour, Version 1).
// Die ZIP enthält tour.json, optional strecke.gpx und titelbild.jpg. Was nur auf der Website bekannt ist
// (Ort, Schwierigkeit, Alt-Text, Beschreibung, Veröffentlichungsdatum), kommt als Ergänzung dazu.
// Nichts wird erfunden: fehlende Pflichtangaben werden gemeldet, nicht geraten.
import { readZip } from './blog-import.mjs';

export { readZip };

export const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const DIFFICULTIES = ['sehr-leicht', 'leicht', 'mittel', 'schwer'];
const TRI = ['ja', 'nein', 'unbekannt'];

// ZIP-Inhalt prüfen und tour.json lesen. Wirft bei Formatfehlern.
export function parseTourZip(buffer) {
  const files = readZip(buffer);
  if (!files.has('tour.json')) throw new Error('tour.json fehlt in der ZIP');
  let json;
  try { json = JSON.parse(Buffer.from(files.get('tour.json')).toString('utf8')); } catch (e) { throw new Error('tour.json ist kein gültiges JSON: ' + e.message); }
  if (json.format !== 'pfadwerk-website-tour') throw new Error(`Unbekanntes Format: ${json.format}`);
  if (json.version !== 1) throw new Error(`Nicht unterstützte Version: ${json.version}`);
  if (!json.tour || typeof json.tour !== 'object') throw new Error('tour.json: Abschnitt "tour" fehlt');
  const t = json.tour;
  if (t.gpx && !files.has(t.gpx)) throw new Error(`tour.json nennt ${t.gpx}, die Datei fehlt in der ZIP`);
  if (t.image && !files.has(t.image)) throw new Error(`tour.json nennt ${t.image}, die Datei fehlt in der ZIP`);
  return { json, files };
}

// Frontmatter aufbauen. ext: { slug, place, region, kind, difficulty, alt, description, published }
// Rückgabe: { slug, data, missing: [Text], warnings: [Text] }
export function buildTourEntry(json, ext = {}, { videoExists = () => true } = {}) {
  const t = json.tour;
  const missing = [];
  const warnings = [];
  const slug = ext.slug || slugify(t.title);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) missing.push(`gültiger Slug (aktuell "${slug}")`);

  const kind = ext.kind || 'tour';
  if (!['tour', 'ziel'].includes(kind)) missing.push('kind: tour oder ziel');
  const description = ext.description || t.description || '';
  if (description.length < 20) missing.push('Kurzbeschreibung (mindestens 20 Zeichen)');
  const difficulty = ext.difficulty;
  if (!DIFFICULTIES.includes(difficulty)) missing.push('Schwierigkeit (sehr-leicht, leicht, mittel, schwer)');
  if (!ext.place || ext.place.length < 2) missing.push('Ort (place)');
  if (!t.title || t.title.length < 3) missing.push('Titel');
  if (!t.duration) missing.push('Dauer (duration)');
  if (kind === 'tour' && !(t.distanceKm > 0)) missing.push('Länge in km (bei einer Tour Pflicht)');
  if (!t.image) missing.push('Titelbild (fehlt in der ZIP)');
  if (!ext.alt || ext.alt.length < 3) missing.push('Alt-Text zum Titelbild');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ext.published || '')) missing.push('Veröffentlichungsdatum (JJJJ-MM-TT)');
  if (kind === 'ziel' && t.gpx) warnings.push('Ein Ziel hat keine GPX-Strecke: die Datei wird nicht übernommen.');

  const data = {};
  data.title = t.title;
  data.kind = kind;
  data.activity = t.activity || 'wandern';
  if (t.routeType) data.routeType = t.routeType;
  data.place = ext.place;
  if (ext.region) data.region = ext.region;
  data.description = description;
  if (t.distanceKm > 0) data.distanceKm = t.distanceKm;
  data.duration = t.duration;
  data.difficulty = difficulty;
  data.image = `../../assets/images/tours/${slug}.jpg`;
  data.imageAlt = ext.alt;
  if (t.gpx && kind === 'tour') data.gpx = `gpx/${slug}.gpx`;
  if (t.coordinates) data.coordinates = t.coordinates;
  if (t.video) {
    if (videoExists(t.video)) data.video = t.video;
    else warnings.push(`Video ${t.video} hat keinen Eintrag unter src/content/videos. Es wird nicht verknüpft.`);
  }
  if (t.parking && t.parking.name) data.parking = t.parking;
  for (const key of ['familyFriendly', 'dogFriendly', 'accessible']) {
    if (t[key] !== undefined) {
      if (TRI.includes(t[key])) data[key] = t[key];
      else warnings.push(`${key}: unbekannter Wert "${t[key]}" ignoriert`);
    }
  }
  if (t.refreshments?.length) data.refreshments = t.refreshments;
  if (t.bestSeasons?.length) data.bestSeasons = t.bestSeasons;
  if (t.rating && Object.keys(t.rating).length) data.rating = t.rating;
  data.publishedAt = ext.published;
  return { slug, data, missing, warnings };
}
