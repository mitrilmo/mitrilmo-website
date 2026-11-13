// Wissensbereich: ein Thema (Radfahren, Wandern, Entdecken) pro YAML-Datei in src/content/wissen/.
// Aufbau: Thema -> Module -> Lektionen (Lernziel, Text, Tipp, optional Checkliste, ein Quiz mit genau einer richtigen Antwort).
// Die Reihenfolge der Antworten legt src/lib/wissen.js beim Bauen fest (damit nicht immer „B“ stimmt).
// Ein Eintrag mit [PRÜFEN] im Text bricht den Build ab: unsichere Stellen werden vor dem Veröffentlichen geklärt oder gestrichen.
import { z } from 'astro/zod';

const text = z.string().min(3).refine((t) => !/\[PRÜFEN\]/i.test(t), 'Platzhalter [PRÜFEN] darf nicht live gehen');

export const quizSchema = z
  .object({
    frage: text.pipe(z.string().min(15, 'Frage zu kurz')),
    richtig: text, // die eine richtige Antwort
    falsch: z.array(text).length(3, 'genau drei falsche Antworten'),
    erklaerung: text.pipe(z.string().min(20, 'Erklärung zu kurz')),
  })
  .superRefine((q, ctx) => {
    const alle = [q.richtig, ...q.falsch].map((a) => a.trim().toLowerCase());
    if (new Set(alle).size !== alle.length) ctx.addIssue({ code: 'custom', message: 'Antworten müssen sich unterscheiden' });
  });

export const lektionSchema = z.object({
  id: z.string().regex(/^[a-z]+-\d{2}$/, 'ID wie rad-01, ändert sich nie'),
  emoji: z.string().min(1),
  titel: text,
  minuten: z.number().int().min(1).max(15),
  lernziel: text,
  text: z.array(text).min(1).max(4),
  tipp: text.optional(),
  check: z.array(text).min(2).max(8).optional(),
  hinweis: text.optional(), // z. B. bei Recht und Notfall: allgemeiner Hinweis, keine Beratung
  quiz: quizSchema,
});

export const modulSchema = z.object({
  id: z.string().regex(/^[a-z]+-m[1-9]$/, 'ID wie rad-m1'),
  emoji: z.string().min(1),
  titel: text,
  szene: text, // Satz der Mo-Szene nach dem Modul
  lektionen: z.array(lektionSchema).min(1).max(8),
});

const stufe = z.object({
  ab: z.number().int().min(0), // ab dieser Punktzahl
  emoji: z.string().min(1),
  titel: text,
  spruch: text,
});

export const wissenSchema = z
  .object({
    titel: text,
    emoji: z.string().min(1),
    reihenfolge: z.number().int().min(1),
    kurz: text.pipe(z.string().min(20)), // Kartentext auf dem Hub
    beschreibung: text.pipe(z.string().min(20).max(300)), // Meta Description
    intro: text, // Szene am Start
    szene: z.enum(['rad', 'wandern', 'entdecken']),
    module: z.array(modulSchema).min(1).max(6),
    urkunde: z.array(stufe).min(3).max(6),
  })
  .superRefine((w, ctx) => {
    const ids = [];
    for (const m of w.module) {
      ids.push(m.id);
      for (const l of m.lektionen) ids.push(l.id);
    }
    if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', message: 'IDs von Modulen und Lektionen müssen eindeutig sein' });
    const abs = w.urkunde.map((u) => u.ab);
    if (abs[0] !== 0) ctx.addIssue({ code: 'custom', path: ['urkunde'], message: 'Die erste Stufe beginnt bei 0' });
    if (abs.some((a, i) => i > 0 && a <= abs[i - 1])) ctx.addIssue({ code: 'custom', path: ['urkunde'], message: 'Stufen müssen aufsteigen' });
  });
