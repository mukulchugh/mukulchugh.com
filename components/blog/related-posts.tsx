import { IconCalendar, IconClock } from "@tabler/icons-react";
import Link from "next/link";
import { PostCover } from "@/components/blog/post-cover";
import type { Post } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface RelatedPostsProps {
  posts: Post[];
}

function RelatedCard({ post }: { post: Post }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });

  return (
    <Link
      className="group flex flex-col gap-3 cursor-pointer transition-opacity active:opacity-70
                 [@media(hover:hover)]:hover:opacity-75"
      href={`/blog/${post.slug}`}
    >
      <PostCover post={post} />
      <div className="flex flex-col gap-1.5">
        <h3
          className={cn(
            "font-syne",
            "text-[15px] font-semibold text-foreground leading-snug line-clamp-2"
          )}
        >
          {post.title}
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
          <span className="flex items-center gap-1">
            <IconCalendar aria-hidden="true" className="w-3 h-3" />
            {formattedDate}
          </span>
          <span className="opacity-40">·</span>
          <span className="flex items-center gap-1">
            <IconClock aria-hidden="true" className="w-3 h-3" />
            {post.readTimeInMinutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-posts-heading"
      className="mt-16 pt-8 border-t border-border"
    >
      <p
        className="ui-label mb-6 text-muted-foreground"
        id="related-posts-heading"
      >
        Related reads
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <RelatedCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
