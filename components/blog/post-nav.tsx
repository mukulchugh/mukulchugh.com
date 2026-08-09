import Link from "next/link";
import type { Post } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface PostNavProps {
  next: Post | null; // older post
  prev: Post | null; // more recent post
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
      className={cn(
        "group flex flex-col gap-2 border border-border rounded-xl p-5",
        "min-h-[44px] transition-colors duration-150",
        "[@media(hover:hover)]:hover:border-border [@media(hover:hover)]:hover:bg-muted",
        isPrev ? "items-start" : "items-end text-right",
        "flex-1"
      )}
      href={`/blog/${post.slug}`}
    >
      <span className="ui-label text-muted-foreground">
        {isPrev ? "← Previous" : "Next →"}
      </span>
      <span
        className={cn(
          "font-syne",
          "text-[15px] font-semibold text-foreground leading-snug line-clamp-2"
        )}
      >
        {post.title}
      </span>
    </Link>
  );
}

export function PostNav({ prev, next }: PostNavProps) {
  if (!(prev || next)) {
    return null;
  }

  return (
    <nav
      aria-label="Post navigation"
      className="mt-16 pt-8 border-t border-border"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {prev ? (
          <NavCard direction="prev" post={prev} />
        ) : (
          // Spacer so "next" stays right-aligned when prev is absent
          <div aria-hidden="true" className="flex-1 hidden sm:block" />
        )}
        {next ? (
          <NavCard direction="next" post={next} />
        ) : (
          <div aria-hidden="true" className="flex-1 hidden sm:block" />
        )}
      </div>
    </nav>
  );
}
