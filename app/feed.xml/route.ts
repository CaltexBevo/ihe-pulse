// RSS 2.0 feed for The Innovation Pulse.
// Serves /feed.xml — episode-per-item with audio enclosures so podcast apps
// and feed readers can subscribe directly. Added 2026-07-15 (UX audit, item c1).

import { getAllEpisodes } from "@/lib/data/innovation-pulse";

const SITE_URL = "https://www.innovatinghighered.com";
const FEED_TITLE = "The Innovation Pulse — Innovating Higher Ed";
const FEED_DESCRIPTION =
  "AI news and analysis for higher education. Each episode covers the stories shaping how colleges and universities adopt AI — with practical takeaways for educators.";

// Generated at build time (data comes from JSON on disk, same as the pages).
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    // Strip characters that are illegal in XML 1.0 (breaks strict parsers)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Guard against malformed episode dates — `new Date(bad).toUTCString()`
// would emit the literal string "Invalid Date" into <pubDate>.
function toRssDate(isoDate: string): string | null {
  const d = new Date(`${isoDate}T12:00:00Z`);
  return isNaN(d.getTime()) ? null : d.toUTCString();
}

export async function GET() {
  const episodes = getAllEpisodes();

  const items = episodes
    .map((ep) => {
      const link = `${SITE_URL}/innovation-pulse/${ep.date}`;
      const rssDate = toRssDate(ep.date);
      const pubDateTag = rssDate ? `\n      <pubDate>${rssDate}</pubDate>` : "";
      const title = ep.deepDive?.title ?? `The Innovation Pulse — ${ep.date}`;
      const descriptionParts = [ep.editorialHook, ep.deepDive?.summary].filter(
        Boolean
      );
      const description = descriptionParts.join(" ");
      const enclosure = ep.audioUrl
        ? `\n      <enclosure url="${escapeXml(ep.audioUrl)}" length="0" type="audio/mpeg" />`
        : "";

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>${pubDateTag}
      <description>${escapeXml(description)}</description>${enclosure}
    </item>`;
    })
    .join("\n");

  const lastBuildDate =
    (episodes.length ? toRssDate(episodes[0].date) : null) ??
    new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/innovation-pulse</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <image>
      <url>${SITE_URL}/og-image.png</url>
      <title>${escapeXml(FEED_TITLE)}</title>
      <link>${SITE_URL}/innovation-pulse</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
