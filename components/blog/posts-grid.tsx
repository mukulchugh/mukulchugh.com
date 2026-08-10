"use client";

import { BlogPostCard } from "@/components/blog/blog-post-card";
import type { Post } from "@/lib/blog";

interface PostsGridProps {
  posts: Post[];
}

/** /blog listing — renders the unified BlogPostCard (list variant). */
export function PostsGrid({ posts }: PostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[14px] text-muted-foreground">
          No posts yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      {posts.map((post, index) => (
        <BlogPostCard
          index={index}
          key={post.id}
          post={post}
          priority={index === 0}
          variant="list"
        />
      ))}
    </div>
  );
}
