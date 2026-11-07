// Spruch am Wegesrand: fester Kalender, welcher der 365 Sprüche an welchem Tag steht (gilt jedes Jahr gleich).
// Regeln: Jahreszeit-Sprüche liegen in ihrer meteorologischen Jahreszeit (wie src/lib/season.js), einzelne Sprüche haben
// einen festen Tag (FEST), der Rest ("ganzjaehrig") wird deterministisch gemischt und so verteilt, dass benachbarte Tage
// sich nicht in Kategorie, erstem Wort und Schlüsselwörtern ähneln. Am 29. Februar steht der Schalttag-Spruch.
import { SPRUECHE, SCHALTTAG } from '../data/sprueche.js';

const MONATSTAGE = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // ohne 29. Februar
const SAISON_DES_MONATS = ['winter', 'winter', 'fruehling', 'fruehling', 'fruehling', 'sommer', 'sommer', 'sommer', 'herbst', 'herbst', 'herbst', 'winter'];

// Sprüche, die an einem bestimmten Tag am besten wirken (Nummer aus dem Doc: Tag "MM-TT")
export const FEST = {
  1: '01-01', // Fitnessprogramm: Neujahr
  30: '04-01', // Aprilwetter
  72: '11-01', // Der November ist grau
  189: '12-10', // Tannenduft und Weihnachtsmarkt
  365: '12-31', // Morgen geht's wieder raus
};

const WOERTER = ['aussicht', 'abenteuer', 'pause', 'schuhe', 'kuchen', 'umweg', 'regen', 'einkehr', 'rucksack', 'kaffee', 'wald', 'berg'];

const zwei = (n) => String(n).padStart(2, '0');

/** Alle 365 Kalendertage als "MM-TT" (ohne 29. Februar). */
export const TAGE = MONATSTAGE.flatMap((anzahl, m) => Array.from({ length: anzahl }, (_, d) => `${zwei(m + 1)}-${zwei(d + 1)}`));

function mulberry32(start) {
  let a = start >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Baut den Kalender: Map "MM-TT" -> Spruch-Objekt. Gleiche Eingabe, gleiches Ergebnis. */
export function baueKalender(sprueche = SPRUECHE) {
  const zuordnung = new Map();
  const benutzt = new Set();
  const setze = (key, s) => { zuordnung.set(key, s); benutzt.add(s.nr); };

  for (const [nr, key] of Object.entries(FEST)) {
    const s = sprueche.find((x) => x.nr === Number(nr));
    if (s) setze(key, s);
  }

  // Jahreszeit-Sprüche gleichmäßig über ihre Jahreszeit verteilt
  for (const saison of ['fruehling', 'sommer', 'herbst', 'winter']) {
    const tage = TAGE.filter((k) => SAISON_DES_MONATS[Number(k.slice(0, 2)) - 1] === saison && !zuordnung.has(k));
    const items = sprueche.filter((s) => s.saison === saison && !benutzt.has(s.nr));
    items.forEach((s, i) => setze(tage[Math.floor(((i + 0.5) * tage.length) / items.length)], s));
  }

  // Rest ("ganzjaehrig"): deterministisch mischen, dann Tag für Tag den passendsten nehmen
  const rest = sprueche.filter((s) => !benutzt.has(s.nr));
  const zufall = mulberry32(20261107);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  const woerter = (t) => WOERTER.filter((w) => t.toLowerCase().includes(w));
  const anfang = (t) => t.split(' ')[0].toLowerCase();
  const nachbarn = (i, abstand) => {
    const liste = [];
    for (let a = 1; a <= abstand; a++) {
      for (const k of [TAGE[i - a], TAGE[i + a]]) if (k && zuordnung.has(k)) liste.push({ abstand: a, s: zuordnung.get(k) });
    }
    return liste;
  };
  const passt = (s, i) => nachbarn(i, 2).every((n) => {
    if (n.abstand === 1 && (n.s.kat === s.kat || anfang(n.s.text) === anfang(s.text))) return false;
    return !woerter(n.s.text).some((w) => woerter(s.text).includes(w));
  });
  const uebrig = (kat) => rest.filter((x) => x.kat === kat).length;

  TAGE.forEach((key, i) => {
    if (zuordnung.has(key)) return;
    const kandidaten = rest.filter((s) => passt(s, i));
    const pool = kandidaten.length ? kandidaten : rest;
    // aus der am stärksten vertretenen Kategorie wählen, damit am Jahresende keine Reste einer Kategorie zusammenkleben
    const gewaehlt = pool.reduce((best, s) => (uebrig(s.kat) > uebrig(best.kat) ? s : best), pool[0]);
    rest.splice(rest.indexOf(gewaehlt), 1);
    zuordnung.set(key, gewaehlt);
  });
  return zuordnung;
}

export const KALENDER = baueKalender();

/** Texte je Tag für die Seite: { "MM-TT": "Spruch", ..., "02-29": Schalttag-Spruch }. */
export function kalenderTexte() {
  const o = {};
  for (const key of TAGE) o[key] = KALENDER.get(key).text;
  o['02-29'] = SCHALTTAG;
  return o;
}

/** Spruch für ein Datum (Kalendertag des Besuchers, Browserzeit). */
export function spruchFuer(datum = new Date()) {
  return kalenderTexte()[`${zwei(datum.getMonth() + 1)}-${zwei(datum.getDate())}`];
}
