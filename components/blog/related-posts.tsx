import Link from "next/link";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { PostCover } from "@/components/blog/post-cover";
import type { Post } from "@/lib/blog";
import { IconClock, IconCalendar } from "@tabler/icons-react";

interface RelatedPostsProps {
  posts: Post[];
}

function RelatedCard({ post }: { post: Post }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-3 cursor-pointer transition-opacity active:opacity-70
                 [@media(hover:hover)]:hover:opacity-75"
    >
      <PostCover post={post} />
      <div className="flex flex-col gap-1.5">
        <h3
          className={cn(
            syne.className,
            "text-[15px] font-semibold text-zinc-900 leading-snug line-clamp-2"
          )}
        >
          {post.title}
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
          <span className="flex items-center gap-1">
            <IconCalendar className="w-3 h-3" aria-hidden="true" />
            {formattedDate}
          </span>
          <span className="opacity-40">·</span>
          <span className="flex items-center gap-1">
            <IconClock className="w-3 h-3" aria-hidden="true" />
            {post.readTimeInMinutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="mt-16 pt-8 border-t border-zinc-100">
      <p
        id="related-posts-heading"
        className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-6"
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
