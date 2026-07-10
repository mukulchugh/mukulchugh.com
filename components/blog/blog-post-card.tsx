"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { IconArrowRight, IconClock } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { PostCover } from "@/components/blog/post-cover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/blog";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface BlogPostCardProps {
  post: Post;
  index?: number;
  /** "compact" = boxed card for the homepage tile · "list" = large row for /blog */
  variant?: "compact" | "list";
  priority?: boolean;
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
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.05,
      }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Read: ${post.title}`}
        className={cn(
          "group block min-w-0",
          compact
            ? `overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.02]
               transition-all duration-300 active:scale-[0.98]
               [@media(hover:hover)]:hover:border-black/[0.15]
               [@media(hover:hover)]:hover:bg-black/[0.04]
               [@media(hover:hover)]:hover:-translate-y-0.5`
            : `flex flex-col gap-4 transition-opacity active:opacity-75
               [@media(hover:hover)]:hover:opacity-80`
        )}
      >
        <PostCover
          post={post}
          priority={priority}
          className={compact ? "rounded-none" : undefined}
        />

        <div className={cn("flex flex-col", compact ? "gap-2 p-4" : "gap-2")}>
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[12px] text-zinc-400">
            {!compact && post.tags.length > 0 && (
              <Badge variant="secondary">{post.tags[0].name}</Badge>
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
                <span className="text-zinc-700">{post.author.name}</span>
                <span className="opacity-40">·</span>
              </span>
            )}
            {compact && (
              <>
                <IconClock className="h-3 w-3 flex-shrink-0" />
                <span className="font-mono">{post.readTimeInMinutes} min read</span>
                <span className="opacity-40">·</span>
              </>
            )}
            <span className={compact ? "font-mono" : undefined}>
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
              syne.className,
              "font-semibold tracking-tight text-zinc-950 break-words",
              compact
                ? "text-[1rem] leading-snug"
                : "text-xl font-bold leading-tight sm:text-2xl md:text-3xl"
            )}
          >
            {post.title}
          </h3>

          {/* Brief */}
          <p
            className={cn(
              "text-zinc-500 leading-relaxed line-clamp-2",
              compact ? "text-[13px]" : "text-[14px] sm:text-[15px] max-w-[68ch]"
            )}
          >
            {post.brief}
          </p>

          {compact && (
            <span
              className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-zinc-400
                         transition-colors duration-200
                         [@media(hover:hover)]:group-hover:text-zinc-800"
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
