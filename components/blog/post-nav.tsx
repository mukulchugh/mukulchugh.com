import Link from "next/link";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import type { Post } from "@/lib/blog";

interface PostNavProps {
  prev: Post | null; // more recent post
  next: Post | null; // older post
}

function NavCard({
  post,
  direction,
}: {
  post: Post;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col gap-2 border border-zinc-200 rounded-xl p-5",
        "min-h-[44px] transition-colors duration-150",
        "[@media(hover:hover)]:hover:border-zinc-400 [@media(hover:hover)]:hover:bg-zinc-50",
        isPrev ? "items-start" : "items-end text-right",
        "flex-1"
      )}
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
        {isPrev ? "← Previous" : "Next →"}
      </span>
      <span
        className={cn(
          syne.className,
          "text-[15px] font-semibold text-zinc-900 leading-snug line-clamp-2"
        )}
      >
        {post.title}
      </span>
    </Link>
  );
}

export function PostNav({ prev, next }: PostNavProps) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Post navigation" className="mt-16 pt-8 border-t border-zinc-100">
      <div className="flex flex-col sm:flex-row gap-3">
        {prev ? (
          <NavCard post={prev} direction="prev" />
        ) : (
          // Spacer so "next" stays right-aligned when prev is absent
          <div className="flex-1 hidden sm:block" aria-hidden="true" />
        )}
        {next ? (
          <NavCard post={next} direction="next" />
        ) : (
          <div className="flex-1 hidden sm:block" aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}
