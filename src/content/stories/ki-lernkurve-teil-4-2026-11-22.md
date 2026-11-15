---
title: "KI-Lernkurve, Teil 4: Der Sprung, der alles änderte"
description: Nach Wochen mit GPS-Chaos kam der radikale Schnitt. Weg vom Browser, rein in eine native Android-App. Warum Umbauen manchmal ehrlicher ist als Weiterflicken.
date: 2026-11-22
cover: ../../assets/images/stories/ki-lernkurve.jpg
coverAlt: "Tastatur und Maus auf einem Mauspad mit einer schwarzen Katze mit großen Augen"
category: randnotizen
---
Nach Wochen mit GPS-Chaos, einem Kopierschutz, der sich gegen mich selbst wandte, und Dateien, die partout nicht vom Handy wollten, kam der Punkt, an dem Weiterflicken keinen Sinn mehr machte. Zeit für einen radikalen Schnitt.

## Der Absprung vom Browser

Meine App lief bis dahin als reine Website, die man sich wie eine App aufs Handy legen kann (nennt sich PWA) — gehostet bei einem Cloud-Anbieter, bequem und kostenlos. Das Problem: Sobald das Handy-Display gesperrt war, drosselte das Betriebssystem im Hintergrund alles, was der Browser gerade tat. Kein Trick der Welt konnte das dauerhaft umgehen.

Die Entscheidung: komplett weg vom Browser, rein in eine waschechte, native Android-App. Ich hatte vorher noch nie eine gebaut. Rund 95 % des bestehenden Codes ließen sich zum Glück retten — nur die Technik für Standort und Dateiexport musste komplett neu.

## Das neue Werkzeug: Android Studio

Dafür musste ich mich erstmals mit einem waschechten Entwicklungswerkzeug anfreunden — dem Programm, mit dem echte Android-Apps gebaut und aufs Handy übertragen werden. Kein Fremdwort mehr, sondern ein Klick auf einen grünen Play-Button, sooft ich eine neue Version testen wollte.

## Der Moment, in dem plötzlich alles passte

Und dann kam der Durchbruch: Mit dem Wechsel auf einen echten Hintergrunddienst des Betriebssystems lief die Standort-Aufzeichnung zum ersten Mal deckungsgleich mit einer echten Sportuhr. Alle Pflaster von vorher — der Audio-Trick, künstliche Bildschirmsperren — konnte ich einfach rausschmeißen. Nicht mehr nötig.

Der Höhepunkt kam Wochen später: Einreichung im offiziellen App-Store um 19:06 Uhr abends — freigegeben um 19:12 Uhr. Sechs Minuten. Mein Kaffee war noch warm.

## Warum das wichtig ist

Der einfache Weg wäre gewesen, immer weiter am Browser-Modell rumzudoktern. Stattdessen der mutigere, ehrlichere Weg: zugeben, dass die Grundlage nicht reichte, und neu anfangen. Genau das hat am Ende Wochen an Frust gespart.

**Die Erkenntnis:** Manchmal ist Umbauen ehrlicher als Weiterflicken. Wenn du merkst, dass du seit Wochen an denselben Symptomen rumdoktorst, lohnt sich der mutigere Schnitt fast immer mehr als das nächste Pflaster.

*Nächste Folge: Die Werkzeugkiste — kurz und einfach erklärt, was hinter Begriffen wie GitHub, Docker und Co. eigentlich steckt.*
