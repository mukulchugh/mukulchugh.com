import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { generateMetadata } from "../app/blog/[slug]/page";
import { getPostCoverSrc } from "../components/blog/post-cover";
import { getAllPosts } from "../lib/blog";
import { socialImage } from "../lib/seo";

const posts = getAllPosts();
assert.equal(posts.length, 15);
await Promise.all(
  posts.map(async (post) => {
    assert.ok(existsSync(`public${getPostCoverSrc(post)}`), post.slug);
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: post.slug }),
    });
    const expected = [
      {
        alt: `${post.seo?.title || post.title} | Mukul Chugh`,
        height: 630,
        type: "image/png",
        url: socialImage(`/blog/${post.slug}`),
        width: 1200,
      },
    ];
    assert.deepEqual(metadata.openGraph?.images, expected);
    assert.deepEqual(metadata.twitter?.images, expected);
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
