"use client";

import { IconArrowRight, IconClock } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { PostCover } from "@/components/blog/post-cover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/blog";
import { accentColorForTags } from "@/lib/blog-topic";
import { cn } from "@/lib/utils";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });
}

interface BlogPostCardProps {
  index?: number;
  post: Post;
  priority?: boolean;
  /** "compact" = boxed card for the homepage tile · "list" = large row for /blog */
  variant?: "compact" | "list";
}

/**
 * The single blog card used across every surface — homepage blog tile and the
 * /blog list both render this, fed from the same lib/blog source. One card,
 * one system.
 */
export function BlogPostCard({
  post,
  index = 0,
  variant = "list",
  priority = false,
}: BlogPostCardProps) {
  const shouldReduce = useReducedMotion();
  const compact = variant === "compact";

  return (
    <motion.article
      initial={shouldReduce ? false : { opacity: 0, y: compact ? 14 : 24 }}
      transition={{
        damping: 20,
        delay: index * 0.05,
        stiffness: 100,
        type: "spring",
      }}
      viewport={{ amount: 0.15, once: true }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
    >
      <Link
        aria-label={`Read: ${post.title}`}
        className={cn(
          "group block min-w-0",
          compact
            ? `overflow-hidden rounded-none border border-border bg-foreground/[0.03]
               transition-[border-color,background-color,transform] duration-300 active:scale-[0.98]
               [@media(hover:hover)]:hover:border-border
               [@media(hover:hover)]:hover:bg-foreground/[0.05]
               [@media(hover:hover)]:hover:-translate-y-0.5`
            : `grid gap-5 border-t border-border pt-6 transition-opacity
               md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-8
               active:opacity-75
               [@media(hover:hover)]:hover:opacity-80`
        )}
        href={`/blog/${post.slug}`}
      >
        <PostCover
          className={compact ? "rounded-none" : "md:aspect-[4/3]"}
          interactive={!compact}
          post={post}
          priority={priority}
        />

        <div
          className={cn(
            "flex flex-col",
            compact ? "gap-2 p-4" : "gap-3 md:py-4"
          )}
        >
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[12px] text-muted-foreground">
            {!compact && post.tags.length > 0 && (
              <Badge
                accentColor={accentColorForTags([post.tags[0].name])}
                variant="secondary"
              >
                {post.tags[0].name}
              </Badge>
            )}
            {!compact && post.author && (
              <span className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={post.author.profilePicture} />
                  <AvatarFallback>
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground/80">{post.author.name}</span>
                <span className="opacity-40">·</span>
              </span>
            )}
            {compact && (
              <>
                <IconClock className="h-3 w-3 flex-shrink-0" />
                <span className="font-mono tabular-nums">
                  {post.readTimeInMinutes} min read
                </span>
                <span className="opacity-40">·</span>
              </>
            )}
            <span className={compact ? "font-mono tabular-nums" : undefined}>
              {fmtDate(post.publishedAt)}
            </span>
            {!compact && (
              <>
                <span className="opacity-40">·</span>
                <span>{post.readTimeInMinutes} min read</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            className={cn(
              "font-syne",
              "font-semibold tracking-[-0.025em] text-foreground break-words text-balance",
              compact
                ? "text-[1rem] leading-snug"
                : "text-xl font-bold leading-tight sm:text-2xl"
            )}
          >
            {post.title}
          </h3>

          {/* Brief */}
          <p
            className={cn(
              "text-muted-foreground leading-[1.7] line-clamp-2 text-pretty",
              compact
                ? "text-[13px]"
                : "text-[14px] sm:text-[15px] max-w-[68ch]"
            )}
          >
            {post.brief}
          </p>

          {compact && (
            <span
              className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground
                         transition-colors duration-200
                         [@media(hover:hover)]:group-hover:text-foreground/90"
            >
              Read article
              <IconArrowRight className="h-3 w-3 transition-transform duration-200 [@media(hover:hover)]:group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
