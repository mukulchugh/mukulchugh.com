"use client";

import type { Post } from "@/lib/blog";
import { BlogPostCard } from "@/components/blog/blog-post-card";

interface PostsGridProps {
  posts: Post[];
}

/** /blog listing — renders the unified BlogPostCard (list variant). */
export function PostsGrid({ posts }: PostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[14px] text-zinc-400">No posts yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {posts.map((post, index) => (
        <BlogPostCard
          key={post.id}
          post={post}
          index={index}
          variant="list"
          priority={index === 0}
        />
      ))}
    </div>
  );
}
