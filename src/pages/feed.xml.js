import { getCollection } from 'astro:content';
import { feedEntries, feedXml } from '../lib/feed.js';

// RSS-Feed mit den neuesten Neuigkeiten und Geschichten. Seitenadresse wie der Canonical: .html.
// Für Besucher gibt es die lesbare Erklärung unter /rss.html (Footer-Link).
export async function GET({ site }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin = site.origin;
  const items = feedEntries(await getCollection('news'), await getCollection('stories')).map((e) => ({ ...e, url: `${origin}${base}${e.path}` }));
  const xml = feedXml({
    origin,
    base,
    title: 'mitrilmo',
    description: 'Neuigkeiten und Geschichten von mitrilmo: Wandern, Radfahren und Neugier im Bergischen Land.',
    items,
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
