import assert from "node:assert/strict";
import { getWritingPage } from "../components/blog/posts-grid";
import { getAllPosts } from "../lib/blog";

const posts = getAllPosts();
const first = getWritingPage(posts, "All", 0);
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
console.log(
  `Writing checks passed: ${posts.length} articles, complete pagination, topic filtering, and empty states.`
);
