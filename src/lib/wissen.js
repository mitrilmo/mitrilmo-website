// Hilfen für den Wissensbereich (getestet in tests/wissen.test.mjs).

// Alle Lektionen eines Themas in Lesereihenfolge, mit Verweis auf das Modul.
export function alleLektionen(thema) {
  return thema.module.flatMap((m, mi) => m.lektionen.map((l) => ({ ...l, modulId: m.id, modulIndex: mi })));
}

// Antworten in feste Reihenfolge bringen: Die richtige Antwort steht an einer Stelle, die mit der laufenden
// Nummer der Lektion wechselt (0, 3, 2, 1, 0 …). So stimmt nicht immer dieselbe Position, und die Seite sieht
// bei jedem Bau gleich aus (kein Zufall, damit Seite, Tests und Vorschau übereinstimmen).
export function antwortenOrdnen(quiz, nr) {
  const pos = (nr * 3) % 4;
  const liste = [...quiz.falsch];
  liste.splice(pos, 0, quiz.richtig);
  return { optionen: liste, richtig: pos };
}

// Stufe der Urkunde zur Punktzahl: die höchste Stufe, deren Schwelle erreicht ist.
export function stufeFuer(urkunde, punkte) {
  let treffer = urkunde[0];
  for (const u of urkunde) if (punkte >= u.ab) treffer = u;
  return treffer;
}

export const lektionenZahl = (thema) => thema.module.reduce((n, m) => n + m.lektionen.length, 0);
// Gemessen (Björn, erster Durchlauf, 13.11.2026): 12:20 bis 13:50 Minuten je Thema, also rund eine Minute pro Lektion.
export const minutenZahl = (thema) => lektionenZahl(thema);
