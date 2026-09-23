import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { getWritingPage, PostsGrid } from "../components/blog/posts-grid";
import { RelatedPosts } from "../components/blog/related-posts";
import { getAllPosts, getRelatedPosts } from "../lib/blog";

const posts = getAllPosts();
const first = getWritingPage(posts, "All", 0);
const gridHtml = renderToStaticMarkup(<PostsGrid posts={posts} />);
assert.equal(
  (gridHtml.match(/data-slot="badge"/g) ?? []).length,
  first.visible.reduce(
    (count, post) => count + Math.min(post.tags.length, 3),
    0
  ),
  "Article topics use shared badges, once per card"
);
assert.ok(
  gridHtml.includes("bg-[#101112]/90"),
  "Artwork badges have a readable backing"
);
assert.equal(first.featured?.slug, posts[0].slug);
const collected = [first.featured?.slug];
for (let page = 0; page < first.pages; page++) {
  const result = getWritingPage(posts, "All", page);
  assert.ok(result.visible.length <= 6);
  collected.push(...result.visible.map((post) => post.slug));
}
assert.deepEqual(
  collected,
  posts.map((post) => post.slug)
);
assert.equal(new Set(collected).size, posts.length);
for (const topic of ["AI Agents", "Developer Tools", "React Native"]) {
  const result = getWritingPage(posts, topic, 99);
  assert.equal(result.page, result.pages - 1);
  assert.equal(
    result.total,
    posts.filter((post) => post.tags.some((tag) => tag.name === topic)).length
  );
  for (const post of [result.featured, ...result.visible]) {
    assert.ok(post?.tags.some((tag) => tag.name === topic));
  }
}
const empty = getWritingPage(posts, "Missing topic", 2);
assert.deepEqual(empty, {
  featured: undefined,
  page: 0,
  pages: 1,
  total: 0,
  visible: [],
});
assert.equal(getWritingPage([], "All", 0).total, 0);
for (const post of posts) {
  const related = getRelatedPosts(post.slug, 3);
  const html = renderToStaticMarkup(
    <RelatedPosts currentSlug={post.slug} posts={related} />
  );
  assert.equal((html.match(/<h3\b/g) ?? []).length, related.length);
  assert.doesNotMatch(html, /line-clamp/);
  for (const recommendation of related) {
    assert.ok(html.includes(`href="/blog/${recommendation.slug}"`));
    assert.ok(
      html
        .toLowerCase()
        .includes(`datetime="${recommendation.publishedAt.toLowerCase()}"`)
    );
  }
  if (post.slug === "ferry-apple-watch-mac-mic") {
    assert.ok(html.includes("grid-cols-[minmax(0,1fr)_30%]"));
  }
  if (post.slug === "agent-working-memory-injection-hygiene") {
    assert.ok(html.includes("grid-cols-[4.5rem_minmax(0,1fr)]"));
  }
}
console.log(
  `Writing checks passed: ${posts.length} articles, complete pagination, topic filtering, and empty states.`
);
