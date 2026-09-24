// biome-ignore-all lint/performance/noAwaitInLoops: Keep checks sequential to avoid flooding the user-owned development server.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import matter from "gray-matter";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { JsonLd } from "../components/json-ld";
import { preferredRepresentation } from "../lib/accept";
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
  publicPages,
  socialImage,
} from "../lib/seo";

const documents = publicDocuments();
assert.equal(
  documents.length,
  Object.keys(publicPages).length +
    getAllPosts().length +
    getAllProjectSlugs().length
);
for (const [accept, expected] of [
  [null, "text/html"],
  ["", null],
  ["*/*", "text/html"],
  ["text/*", "text/html"],
  ["text/markdown", "text/markdown"],
  ["text/markdown, text/html", "text/markdown"],
  ["text/html, text/markdown", "text/html"],
  ["text/markdown;q=0.2, text/html;q=0.9", "text/html"],
  ["text/html;q=0, */*;q=1", "text/markdown"],
  ["text/markdown;q=0, */*;q=1", "text/html"],
  ["text/markdown;q=0", null],
  ["text/html;q=0, text/markdown;q=0", null],
  ["application/json", null],
  ["TEXT/MARKDOWN; CHARSET=UTF-8; Q=0.9, text/html;q=0.5", "text/markdown"],
  ["text/markdown;q=bogus, text/html", "text/html"],
  ["text/markdown;q=1.1, text/html", "text/html"],
  [
    "text/markdown, text/markdown;charset=utf-8;q=0, text/html;q=0.5",
    "text/html",
  ],
  ["text/markdown;charset=iso-8859-1, text/html", "text/html"],
  ['text/markdown;variant="unsupported,html", text/html', "text/html"],
] as const)
  assert.equal(preferredRepresentation(accept), expected, String(accept));
assert(
  !existsSync("public/llms.txt"),
  "A static file must not shadow the generated agent index"
);
assert(llmsIndex().includes("## When to use this site"));
assert(llmsIndex().includes("Accept: text/markdown"));
const identity = JSON.parse(
  renderToStaticMarkup(createElement(JsonLd)).replace(
    /^<script[^>]*>|<\/script>$/g,
    ""
  )
);
const person = identity["@graph"].find(
  (entry: { "@type": string }) => entry["@type"] === "Person"
);
assert(person.contactPoint.email);
assert.equal(person.address.addressCountry, "IN");
assert(
  !identity["@graph"].some(
    (entry: { "@type": string }) => entry["@type"] === "Organization"
  )
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
  const imageFailures: string[] = [];
  const vary = (response: Response) => {
    const values =
      response.headers
        .get("vary")
        ?.toLowerCase()
        .split(/\s*,\s*/) ?? [];
    assert(
      values.includes("accept"),
      `Vary: Accept missing on ${response.url}`
    );
  };
  for (const doc of documents) {
    const md = await fetch(new URL(markdownPath(doc.path), base));
    assert.equal(md.status, 200, markdownPath(doc.path));
    assert(md.headers.get("content-type")?.startsWith("text/markdown"));
    vary(md);
    assert.equal(
      md.headers.get("link"),
      `<${absoluteUrl(doc.path)}>; rel="canonical"`
    );
    const markdown = await md.text();
    assert(markdown.includes(`canonical: "${absoluteUrl(doc.path)}"`));
    const negotiated = await fetch(new URL(doc.path, base), {
      headers: { Accept: "text/markdown" },
    });
    assert.equal(negotiated.status, 200, doc.path);
    assert(negotiated.headers.get("content-type")?.startsWith("text/markdown"));
    vary(negotiated);
    assert.equal(
      await negotiated.text(),
      markdown,
      `Negotiated Markdown parity: ${doc.path}`
    );
    const response = await fetch(new URL(doc.path, base), {
      headers: { Accept: "text/html", "user-agent": "Twitterbot/1.0" },
    });
    assert.equal(response.status, 200, doc.path);
    const html = await response.text();
    // Next 16.3 replaces Vary on page responses. The HTML branch therefore
    // prohibits shared caching and requires revalidation of private caches.
    assert.match(response.headers.get("cache-control") ?? "", /private/);
    assert.match(response.headers.get("cache-control") ?? "", /no-cache/);
    assert(response.headers.get("content-type")?.startsWith("text/html"));
    if (doc.path === "/") {
      const rink = html.match(/<img\b[^>]*src="[^"]*rink-tall[^>]*>/)?.[0];
      assert(rink, "The LCP rink must be discoverable in raw HTML");
      assert.match(rink, /loading="eager"/);
      assert.match(rink, /fetchPriority="high"/i);
    }
    if (["/", "/about", "/contact", "/privacy"].includes(doc.path)) {
      assert.match(html, /<h1[\s>]/, `Raw HTML heading: ${doc.path}`);
      const text = html
        .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      assert(
        text.length >= 500,
        `Raw HTML content: ${doc.path} (${text.length})`
      );
    }
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
    try {
      const og = await fetch(
        new URL(new URL(socialImage(doc.path)).pathname, base)
      );
      assert.equal(og.status, 200, `OG: ${doc.path}`);
      assert(og.headers.get("content-type")?.startsWith("image/png"));
      const png = Buffer.from(await og.arrayBuffer());
      assert.equal(png.readUInt32BE(16), 1200);
      assert.equal(png.readUInt32BE(20), 630);
    } catch (error) {
      imageFailures.push(`${doc.path}: ${String(error)}`);
    }
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
  const index = await fetch(new URL("/llms.txt", base));
  assert.equal(index.headers.get("x-content-type-options"), "nosniff");
  assert.equal(
    await index.text(),
    llmsIndex(),
    "Served agent index must match its generated source"
  );
  const full = await fetch(new URL("/llms-full.txt", base));
  assert.equal(
    await full.text(),
    (
      await Promise.all(documents.map((doc) => markdownDocument(doc.path)))
    ).join("\n\n")
  );
  const xml = await (await fetch(new URL("/sitemap.xml", base))).text();
  assert.equal((xml.match(/<loc>/g) ?? []).length, documents.length);
  for (const doc of documents)
    assert(xml.includes(`<loc>${absoluteUrl(doc.path)}</loc>`));
  const rss = await (await fetch(new URL("/blog/rss.xml", base))).text();
  assert.equal((rss.match(/<item>/g) ?? []).length, getAllPosts().length);
  for (const post of getAllPosts())
    assert(rss.includes(`<link>${absoluteUrl(`/blog/${post.slug}`)}</link>`));
  const robotText = await (await fetch(new URL("/robots.txt", base))).text();
  assert(robotText.includes(`Sitemap: ${absoluteUrl("/sitemap.xml")}`));
  assert(robotText.includes("Allow: /"));
  const htmlMissing = await fetch(new URL("/__agent-missing", base), {
    headers: { Accept: "text/html" },
  });
  assert.equal(htmlMissing.status, 404);
  for (const path of [
    "/__agent-missing",
    "/blog/__agent-missing",
    "/projects/__agent-missing",
    "/__agent-missing.md",
  ]) {
    const missing = await fetch(new URL(path, base), {
      headers: { Accept: "text/markdown" },
    });
    assert.equal(missing.status, 404, path);
    assert(missing.headers.get("content-type")?.startsWith("text/markdown"));
    const body = await missing.text();
    assert(body.includes("llms.txt") && body.includes("sitemap.xml"));
  }
  for (const [accept, type, status] of [
    ["text/markdown;q=0, text/html", "text/html", 200],
    ["text/html;q=0, */*;q=1", "text/markdown", 200],
    ["application/json", "text/plain", 406],
  ] as const) {
    const result = await fetch(new URL("/", base), {
      headers: { Accept: accept },
    });
    assert.equal(result.status, status);
    assert(result.headers.get("content-type")?.startsWith(type));
    if (type !== "text/html") vary(result);
  }
  const head = await fetch(new URL("/about", base), {
    headers: { Accept: "text/markdown" },
    method: "HEAD",
  });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  assert(head.headers.get("content-type")?.startsWith("text/markdown"));
  const feed = await fetch(new URL("/dock/posts.json", base));
  assert.equal(feed.status, 200);
  assert.deepEqual(
    await feed.json(),
    JSON.parse(JSON.stringify(getAllPosts()))
  );
  console.log(
    `PASS: all ${documents.length} HTML and Markdown routes, content negotiation, discovery bodies, Person schema, raw HTML content and 404 recovery.`
  );
  assert.deepEqual(imageFailures, [], "Production social-image failures");
  console.log(
    `PASS: all ${documents.length} HTML, Markdown and 1200×630 social-image endpoints, discovery files and 404s.`
  );
}
