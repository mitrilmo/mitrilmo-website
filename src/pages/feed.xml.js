import { getCollection } from 'astro:content';
import { feedItems, feedXml } from '../lib/feed.js';
import { teaser, published } from '../lib/news.js';

// RSS-Feed mit den neuesten Neuigkeiten und Geschichten. Seitenadresse wie der Canonical: .html.
export async function GET({ site }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin = site.origin;
  const news = published(await getCollection('news')).map((p) => ({
    title: p.data.title,
    url: `${origin}${base}/neuigkeiten/${p.id}.html`,
    date: p.data.date,
    description: teaser(p),
  }));
  const stories = (await getCollection('stories'))
    .filter((s) => !s.data.draft)
    .map((s) => ({
      title: s.data.title,
      url: `${origin}${base}/stories/${s.id}.html`,
      date: s.data.date,
      description: s.data.description,
    }));
  const xml = feedXml({
    origin,
    base,
    title: 'mitrilmo',
    description: 'Neuigkeiten und Geschichten von mitrilmo: Wandern, Radfahren und Neugier im Bergischen Land.',
    items: feedItems([...news, ...stories]),
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
