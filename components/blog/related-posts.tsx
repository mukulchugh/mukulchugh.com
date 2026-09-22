import { IconArrowUpRight, IconCalendar, IconClock } from "@tabler/icons-react";
import Link from "next/link";
import { PostCover } from "@/components/blog/post-cover";
import type { Post } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface RelatedPostsProps {
  currentSlug?: string;
  posts: Post[];
}

// These previews use title-led horizontal plates rather than thumbnail rows.
// The current article controls presentation, never the related-post selection.
const titleLedArticles = new Set([
  "ferry-apple-watch-mac-mic",
  "mcp-gateway-for-team-tools",
  "mobile-lessons-from-swiggy-scale",
  "openkvm-one-keyboard-two-macs",
  "phased-agent-turns-gather-analyze-synthesize",
  "quivly-skills-agent-expertise",
  "self-hosted-personal-agent-fleet",
  "skip-your-own-api-when-you-own-the-database",
]);

function RelatedCard({ post, titleLed }: { post: Post; titleLed: boolean }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });

  return (
    <Link
      className={cn(
        "tile-glass group relative grid min-w-0 cursor-pointer gap-3 rounded-[14px] border border-border p-3 transition-colors active:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground [@media(hover:hover)]:hover:bg-muted/50",
        titleLed
          ? "grid-cols-[minmax(0,1fr)_30%] items-center sm:min-h-44"
          : "grid-cols-[4.5rem_minmax(0,1fr)] items-start lg:grid-cols-[5.5rem_minmax(0,1fr)]"
      )}
      href={`/blog/${post.slug}`}
    >
      <PostCover
        className={cn(
          "aspect-square min-w-0 w-full rounded-lg [&_img]:object-right",
          titleLed && "col-start-2 row-start-1 self-center"
        )}
        post={post}
      />
      <div className={cn("min-w-0", titleLed && "col-start-1 row-start-1")}>
        <h3
          className={cn(
            "pr-4 font-sans font-semibold text-foreground leading-snug [overflow-wrap:anywhere]",
            titleLed ? "text-xl tracking-[-0.025em]" : "text-base"
          )}
        >
          {post.title}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <IconCalendar aria-hidden="true" className="w-3 h-3" />
            <time dateTime={post.publishedAt}>{formattedDate}</time>
          </span>
          <span className="flex items-center gap-1">
            <IconClock aria-hidden="true" className="w-3 h-3" />
            {post.readTimeInMinutes} min
          </span>
        </div>
      </div>
      <IconArrowUpRight
        aria-hidden="true"
        className="absolute right-3 top-3 rounded bg-background p-0.5 text-foreground"
        size={20}
      />
    </Link>
  );
}

export function RelatedPosts({ currentSlug, posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-posts-heading"
      className="mt-16 pt-8 border-t border-border"
    >
      <h2
        className="ui-label mb-6 text-muted-foreground"
        id="related-posts-heading"
      >
        More writing
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {posts.map((post) => (
          <RelatedCard
            key={post.id}
            post={post}
            titleLed={titleLedArticles.has(currentSlug ?? "")}
          />
        ))}
      </div>
    </section>
  );
}
