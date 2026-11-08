import { test } from 'node:test';
import assert from 'node:assert/strict';
import { feedItems, feedXml } from '../src/lib/feed.js';
import { checkFeed } from '../scripts/lib/checks.mjs';

const ORIGIN = 'https://www.mitrilmo.com';
const item = (n, day, extra = {}) => ({
  title: `Beitrag ${n}`, url: `${ORIGIN}/neuigkeiten/b${n}.html`, date: new Date(`2026-10-${day}T00:00:00Z`), description: 'Kurztext', ...extra,
});

test('Feed: neueste zuerst und höchstens limit Einträge', () => {
  const out = feedItems([item(1, '01'), item(2, '20'), item(3, '10')], 2);
  assert.deepEqual(out.map((i) => i.title), ['Beitrag 2', 'Beitrag 3']);
});
test('Feed: Sonderzeichen werden maskiert, Datum im RSS-Format, Self-Link mit Basispfad', () => {
  const xml = feedXml({ origin: ORIGIN, base: '/x', title: 'A & B', description: 'd', items: [item(1, '05', { title: 'Wald <3 "Berg"' })] });
  assert.match(xml, /<title>A &amp; B<\/title>/);
  assert.match(xml, /Wald &lt;3 &quot;Berg&quot;/);
  assert.match(xml, /<pubDate>Mon, 05 Oct 2026 00:00:00 GMT<\/pubDate>/);
  assert.match(xml, /href="https:\/\/www\.mitrilmo\.com\/x\/feed\.xml" rel="self"/);
});
test('Feed: leere Liste ergibt trotzdem gültiges RSS', () => {
  const xml = feedXml({ origin: ORIGIN, title: 't', description: 'd', items: [] });
  assert.match(xml, /<channel>/);
  assert.doesNotMatch(xml, /<item>/);
});

const pages = ['neuigkeiten/b1.html'];
const good = feedXml({ origin: ORIGIN, title: 't', description: 'd', items: [item(1, '05')] });
test('checkFeed: passender Feed ist in Ordnung', () => {
  assert.deepEqual(checkFeed(good, pages, ORIGIN), []);
});
test('checkFeed: fehlender Feed, leerer Feed, Adresse ohne Seite, falscher Host, Adresse ohne .html', () => {
  const p = (xml, files = pages) => checkFeed(xml, files, ORIGIN).join(' | ');
  assert.match(p(''), /feed\.xml fehlt/);
  assert.match(p('<html></html>'), /kein RSS-Feed/);
  assert.match(p(feedXml({ origin: ORIGIN, title: 't', description: 'd', items: [] })), /keine Einträge/);
  assert.match(p(good, []), /Adresse ohne Seite/);
  assert.match(p(good.replace('www.mitrilmo.com/neuigkeiten', 'example.com/neuigkeiten')), /ungültige Adresse/);
  assert.match(p(good.replace('b1.html', 'b1')), /ungültige Adresse/);
  assert.match(p(good.replace(/<pubDate>[^<]+<\/pubDate>/, '<pubDate>gestern</pubDate>')), /ohne gültiges Datum/);
});
