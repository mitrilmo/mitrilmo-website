// Tour aus dem Pfadwerk-Export "Für Website (ZIP)" übernehmen.
// Aufruf:  npm run tour-import -- <datei.zip> [Ergänzungen] [--force]
// Ergänzungen: --place "Ort" --difficulty leicht --alt "Alt-Text" --published 2026-11-23
//              --description "Kurzbeschreibung" [--slug x] [--region "Bergisches Land"] [--kind tour|ziel]
// Ohne --force nur Trockenlauf: zeigt, was übernommen würde und was noch fehlt.
// Schreibt src/content/tours/<slug>.md, public/gpx/<slug>.gpx und src/assets/images/tours/<slug>.jpg (Metadaten entfernt).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';
import { importImage } from './lib/image.mjs';
import { parseTourZip, buildTourEntry } from './lib/tour-import.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const force = args.includes('--force');
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const valueOf = new Set(['--place', '--difficulty', '--alt', '--published', '--description', '--slug', '--region', '--kind']);
const zipPath = args.find((a, i) => !a.startsWith('--') && !valueOf.has(args[i - 1]));
const fail = (msg) => { console.error(msg); process.exit(1); };

if (!zipPath) fail('Aufruf: npm run tour-import -- <datei.zip> [--place ... --difficulty ... --alt ... --published ... --description ...] [--force]');
if (!existsSync(zipPath)) fail(`ZIP nicht gefunden: ${zipPath}`);

let parsed;
try { parsed = parseTourZip(readFileSync(zipPath)); } catch (e) { fail('Die ZIP entspricht nicht dem Pfadwerk-Format: ' + e.message); }
const { json, files } = parsed;

const ext = {
  place: opt('--place'), difficulty: opt('--difficulty'), alt: opt('--alt'), published: opt('--published'),
  description: opt('--description'), slug: opt('--slug'), region: opt('--region'), kind: opt('--kind'),
};
const videoExists = (id) => existsSync(join(root, 'src', 'content', 'videos', `${id}.md`));
const { slug, data, missing, warnings } = buildTourEntry(json, ext, { videoExists });

const mdPath = join(root, 'src', 'content', 'tours', `${slug}.md`);
if (existsSync(mdPath)) missing.push(`freier Slug: "${slug}" ist schon vergeben (Slugs ändern sich nie, anderen wählen mit --slug)`);

const t = json.tour;
console.log(`Tour: ${t.title}  → Slug ${slug}`);
console.log(`  Strecke: ${t.gpx ? 'ja' : 'nein'}  Titelbild: ${t.image ? 'ja' : 'nein'}  Länge: ${t.distanceKm ?? '?'} km  Dauer: ${t.duration ?? '?'}`);
if (json.vorschlaege) {
  const v = json.vorschlaege;
  console.log('  Vorschläge aus Pfadwerk (nicht übernommen, bitte bestätigen):');
  console.log(`    Ort: ${v.ort || '–'}  Ziel: ${v.zielort || '–'}  Tourdatum: ${v.tourdatum || '–'}  Schwierigkeit: ${v.schwierigkeit || '–'}`);
  console.log(`    Verpflegung: ${v.verpflegung || '–'}${v.einkehrOhneName ? ' (Einkehr ohne Namen)' : ''}  Tipp: ${v.tipp || '–'}`);
  if (v.ausruestung?.length) console.log(`    Hinweise/Ausrüstung: ${v.ausruestung.join(', ')}`);
}
warnings.forEach((w) => console.log('  Hinweis: ' + w));
if (missing.length) {
  console.log('Es fehlt noch:');
  missing.forEach((m) => console.log('  - ' + m));
}
if (!force) { console.log('Trockenlauf: nichts geschrieben. Mit --force übernehmen.'); process.exit(missing.length ? 2 : 0); }
if (missing.length) fail('Nicht übernommen: Pflichtangaben fehlen (siehe oben).');

mkdirSync(join(root, 'src', 'content', 'tours'), { recursive: true });
if (data.gpx) {
  mkdirSync(join(root, 'public', 'gpx'), { recursive: true });
  writeFileSync(join(root, 'public', 'gpx', `${slug}.gpx`), Buffer.from(files.get(t.gpx)));
}
const imgDest = join(root, 'src', 'assets', 'images', 'tours', `${slug}.jpg`);
mkdirSync(join(root, 'src', 'assets', 'images', 'tours'), { recursive: true });
const r = await importImage(Buffer.from(files.get(t.image)), imgDest, { max: 2400 });
if (r.hadGps) console.log('  Hinweis: Das Titelbild enthielt GPS-Koordinaten, im Ergebnis entfernt.');
if (r.keptExif) console.log('  Warnung: Das Titelbild enthält noch Metadaten, bitte prüfen.');

writeFileSync(mdPath, `---\n${stringify(data, { lineWidth: 0 }).trimEnd()}\n---\n`, 'utf8');
console.log(`Geschrieben: src/content/tours/${slug}.md${data.gpx ? `, public/gpx/${slug}.gpx` : ''}, src/assets/images/tours/${slug}.jpg`);
console.log('Nächster Schritt: npm run check:content (GPX-Länge, Bild, Schema), dann npm run check:live');
