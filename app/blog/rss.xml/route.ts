import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/data";
import { socialImage } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "'": "&apos;",
        '"': "&quot;",
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
      })[c] as string
  );
}

export async function GET() {
  const posts = getAllPosts();
  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteConfig.siteUrl}/blog/${p.slug}</link>
      <guid>${siteConfig.siteUrl}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(p.brief)}</description>
      <media:thumbnail url="${escapeXml(socialImage(`/blog/${p.slug}`))}" width="1200" height="630" />
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>\n    <atom:link href="${siteConfig.siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <title>${escapeXml(siteConfig.name)} — Blog</title>
    <link>${siteConfig.siteUrl}/blog</link>
    <description>Writing by ${escapeXml(siteConfig.name)}</description>
    <language>en-us</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
