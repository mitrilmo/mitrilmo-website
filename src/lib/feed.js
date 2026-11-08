// RSS-Feed (Neuigkeiten und Geschichten). Reine Funktionen, getestet in tests/feed.test.mjs.
const escapeXml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Neueste zuerst, Entwürfe raus, höchstens `limit` Einträge.
// entries: [{ title, url, date: Date, description }]
export function feedItems(entries, limit = 20) {
  return [...entries].sort((a, b) => b.date - a.date).slice(0, limit);
}

// origin: z. B. https://www.mitrilmo.com, base: '' (live) oder '/mitrilmo-staging'
export function feedXml({ origin, base = '', title, description, items }) {
  const site = origin.replace(/\/$/, '');
  const self = `${site}${base}/feed.xml`;
  const home = `${site}${base}/`;
  const newest = items.length ? items[0].date : new Date(0);
  const body = items
    .map(
      (i) => `    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${escapeXml(i.url)}</link>
      <guid isPermaLink="true">${escapeXml(i.url)}</guid>
      <pubDate>${i.date.toUTCString()}</pubDate>
      <description>${escapeXml(i.description)}</description>
    </item>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(home)}</link>
    <description>${escapeXml(description)}</description>
    <language>de-DE</language>
    <lastBuildDate>${newest.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml" />
${body}
  </channel>
</rss>
`;
}
