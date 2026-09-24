// biome-ignore-all lint/performance/noAwaitInLoops: Keep checks sequential to avoid flooding the user-owned development server.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import matter from "gray-matter";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { getAllPosts, getPostServer } from "../lib/blog";
import { hiddenProjectTitles } from "../lib/data";
import { getAllProjectSlugs } from "../lib/projects";
import {
  llmsIndex,
  markdownDocument,
  publicDocuments,
} from "../lib/public-content";
import {
  absoluteUrl,
  markdownPath,
  pageMetadata,
  socialImage,
} from "../lib/seo";

const documents = publicDocuments();
assert.equal(
  documents.length,
  6 + getAllPosts().length + getAllProjectSlugs().length
);
assert.equal(new Set(documents.map((doc) => doc.path)).size, documents.length);
assert.equal(sitemap().length, documents.length);
assert(
  !JSON.stringify(robots()).includes("/_next/"),
  "Rendering assets must remain crawlable"
);
for (const path of [
  "/nope",
  "/prototype/header",
  "/projects/nope",
  "/blog/nope",
  "/../lib/data",
  "/api/private",
]) {
  assert.equal(await markdownDocument(path), null, path);
}
for (const doc of documents) {
  const markdown = await markdownDocument(doc.path);
  assert(markdown, doc.path);
  const parsed = matter(markdown);
  assert.equal(parsed.data.canonical, absoluteUrl(doc.path));
  assert.equal(parsed.data.image, socialImage(doc.path));
  assert(parsed.content.includes(`# ${doc.heading}`));
  assert(llmsIndex().includes(absoluteUrl(markdownPath(doc.path))));
  const metadata = pageMetadata(
    doc.path,
    doc.title,
    doc.description,
    doc.publishedAt,
    doc.updatedAt
  );
  assert.equal(metadata.alternates?.canonical, absoluteUrl(doc.path));
  if (doc.kind === "article") {
    const post = await getPostServer(doc.path.slice(6));
    assert(
      markdown.includes(post!.content!.markdown.trim()),
      "Article body must match source"
    );
    assert(Number.isFinite(Date.parse(doc.publishedAt!)));
  }
  if (doc.image.startsWith("/"))
    assert(existsSync(`public${doc.image}`), `Missing artwork: ${doc.image}`);
  assert(!hiddenProjectTitles.has(doc.title), `Hidden project: ${doc.title}`);
}
console.log(
  `PASS: ${documents.length} public pages, metadata, Markdown parity, sitemap, private exclusions, artwork.`
);

const base = process.argv[2];
if (base) {
  for (const doc of documents) {
    const md = await fetch(new URL(markdownPath(doc.path), base));
    assert.equal(md.status, 200, markdownPath(doc.path));
    assert(md.headers.get("content-type")?.startsWith("text/markdown"));
    assert.equal(
      md.headers.get("link"),
      `<${absoluteUrl(doc.path)}>; rel="canonical"`
    );
    assert((await md.text()).includes(`canonical: "${absoluteUrl(doc.path)}"`));
    const response = await fetch(new URL(doc.path, base), {
      headers: { "user-agent": "Twitterbot/1.0" },
    });
    assert.equal(response.status, 200, doc.path);
    const html = await response.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert(canonical, `Missing canonical: ${doc.path}`);
    assert.equal(
      new URL(canonical).href,
      absoluteUrl(doc.path),
      `Canonical: ${doc.path}`
    );
    assert(
      html.includes('type="text/markdown"'),
      `Markdown alternate: ${doc.path}`
    );
    assert(html.includes(socialImage(doc.path)), `Social image: ${doc.path}`);
    const schemas = [
      ...html.matchAll(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
      ),
    ];
    assert(schemas.length, `Structured data: ${doc.path}`);
    for (const [, schema] of schemas) JSON.parse(schema);
    const og = await fetch(
      new URL(new URL(socialImage(doc.path)).pathname, base)
    );
    assert.equal(og.status, 200, `OG: ${doc.path}`);
    assert(og.headers.get("content-type")?.startsWith("image/png"));
    const png = Buffer.from(await og.arrayBuffer());
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  }
  for (const path of [
    "/not-a-page.md",
    "/blog/not-a-post.md",
    "/projects/not-a-project.md",
    "/prototype/header.md",
    "/og/unknown.png",
  ]) {
    assert.equal((await fetch(new URL(path, base))).status, 404, path);
  }
  for (const path of [
    "/llms.txt",
    "/llms-full.txt",
    "/sitemap.xml",
    "/robots.txt",
    "/blog/rss.xml",
    "/index.md",
    "/.md",
  ]) {
    assert.equal((await fetch(new URL(path, base))).status, 200, path);
  }
  console.log(
    `PASS: all ${documents.length} HTML, Markdown and 1200×630 social-image endpoints, discovery files and 404s.`
  );
}
