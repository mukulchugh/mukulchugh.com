import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { getAllPosts, getPostServer } from "../lib/blog";
import { links } from "../lib/data";
import { getAllProjectSlugs, projectLinkLabel } from "../lib/projects";

// Run with Bun. An optional local URL adds an HTTP smoke check for every page.
for (const link of links) {
  assert.ok(link.hash.startsWith("/"), `Cross-page navigation: ${link.name}`);
}
assert.equal(
  projectLinkLabel("https://github.com/a/b/releases/latest"),
  "Download release"
);
assert.equal(
  projectLinkLabel("https://www.npmjs.com/package/example"),
  "View package"
);
assert.equal(
  projectLinkLabel("https://www.figma.com/file/example"),
  "View design"
);
assert.equal(projectLinkLabel("https://example.com"), "View demo");

const posts = getAllPosts();
const projectSlugs = getAllProjectSlugs();
assert.equal(
  new Set(projectSlugs).size,
  projectSlugs.length,
  "Unique project routes"
);
assert.equal(
  new Set(posts.map((p) => p.slug)).size,
  posts.length,
  "Unique article routes"
);
const articles = await Promise.all(
  posts.map((post) => getPostServer(post.slug))
);
for (const [index, post] of posts.entries()) {
  const article = articles[index];
  assert.ok(article?.content?.markdown, `Article body: ${post.slug}`);
  const headings = article.headings ?? [];
  assert.equal(
    new Set(headings.map((h) => h.id)).size,
    headings.length,
    `Unique heading IDs: ${post.slug}`
  );
}

const base = process.argv[2];
if (base) {
  const origin = new URL(base);
  assert.ok(
    ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname),
    "Use a local preview URL"
  );
  const routes = [
    "/",
    "/blog",
    ...posts.map((p) => `/blog/${p.slug}`),
    ...projectSlugs.map((s) => `/projects/${s}`),
  ];
  for (let offset = 0; offset < routes.length; offset += 4) {
    // biome-ignore lint/performance/noAwaitInLoops: Bound concurrent compilation on the user's dev server.
    await Promise.all(
      routes.slice(offset, offset + 4).map(async (route) => {
        const response = await fetch(new URL(route, origin));
        assert.equal(response.status, 200, route);
        const html = await response.text();
        assert.match(html, /<h1[\s>]/, `Page heading: ${route}`);
        assert.doesNotMatch(html, />Oops!</, `Error boundary: ${route}`);
        for (const image of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
          const imageUrl = new URL(image[1].replaceAll("&amp;", "&"), origin);
          const source =
            imageUrl.pathname === "/_next/image"
              ? imageUrl.searchParams.get("url")
              : imageUrl.pathname;
          if (source?.startsWith("/design/")) {
            assert.ok(
              existsSync(path.join(process.cwd(), "public", source)),
              `Missing artwork on ${route}: ${source}`
            );
          }
        }
      })
    );
  }
  const missing = await fetch(
    new URL("/blog/ui-check-missing-article", origin)
  );
  assert.equal(missing.status, 404, "Missing article returns 404");
  console.log(
    `HTTP checks passed for ${routes.length} pages and the missing-article route.`
  );
}
console.log(
  `UI contracts passed: ${links.length} navigation links, ${posts.length} articles, ${projectSlugs.length} projects.`
);
