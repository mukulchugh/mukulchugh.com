import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { generateMetadata } from "../app/blog/[slug]/page";
import { getPostCoverSrc } from "../components/blog/post-cover";
import { getAllPosts } from "../lib/blog";

const posts = getAllPosts();
assert.equal(posts.length, 15);
await Promise.all(
  posts.map(async (post) => {
    assert.ok(existsSync(`public${getPostCoverSrc(post)}`), post.slug);
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: post.slug }),
    });
    assert.deepEqual(metadata.openGraph?.images, [getPostCoverSrc(post)]);
    assert.deepEqual(metadata.twitter?.images, [getPostCoverSrc(post)]);
  })
);
assert.equal(
  getPostCoverSrc({ ...posts[0], coverImage: { url: "/custom.png" } }),
  "/custom.png"
);
assert.equal(
  getPostCoverSrc({ coverImage: null, slug: "future-post" }),
  "/design/articles/future-post.png"
);
console.log(
  "Writing covers passed: 15 local assets, overrides, metadata parity."
);
