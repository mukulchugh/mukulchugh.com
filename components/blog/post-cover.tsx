"use client";

import { IconClock, IconTag } from "@tabler/icons-react";
import Image from "next/image";
import type { Post } from "@/lib/blog";
import { hashTitle, topicFamilyFor } from "@/lib/blog-topic";
import { cn } from "@/lib/utils";

// Deep ink base — slightly different angles per post so the base layer
// itself has some variety before the topic tint and icon go on top.
const GRADIENTS = [
  "linear-gradient(145deg, rgb(10,10,12) 0%, rgb(28,28,32) 100%)",
  "linear-gradient(155deg, rgb(12,12,14) 0%, rgb(32,30,34) 100%)",
  "linear-gradient(135deg, rgb(8,8,10) 0%, rgb(30,29,31) 100%)",
  "linear-gradient(160deg, rgb(14,13,14) 0%, rgb(34,32,32) 100%)",
  "linear-gradient(140deg, rgb(10,11,12) 0%, rgb(26,28,32) 100%)",
] as const;

interface PostCoverProps {
  className?: string;
  /** Hero mode: taller, prominent; default is card thumbnail ratio */
  hero?: boolean;
  /** Quiet hover brightness lift. Off on the dense homepage tile (stays fully static); on for /blog and the post hero. */
  interactive?: boolean;
  post: Post;
  priority?: boolean;
}

export function PostCover({
  post,
  priority = false,
  className,
  hero = false,
  interactive = false,
}: PostCoverProps) {
  const tagNames = post.tags.map((t) => t.name);
  const tag = post.tags?.[0]?.name;
  const family = topicFamilyFor(tagNames);
  const TopicIcon = family.icon;

  if (post.coverImage?.url) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-none",
          hero ? "aspect-[16/7]" : "aspect-video",
          className
        )}
      >
        <Image
          alt={post.title}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          fill
          priority={priority}
          sizes={
            hero
              ? "(max-width: 768px) 100vw, 896px"
              : "(max-width: 768px) 100vw, 560px"
          }
          src={post.coverImage.url}
        />
      </div>
    );
  }

  // Designed editorial cover — deterministic per post.
  const h = hashTitle(post.title);
  const gradient = GRADIENTS[h % GRADIENTS.length];

  return (
    <div
      aria-hidden="false"
      className={cn(
        "group relative overflow-hidden rounded-none select-none",
        hero ? "aspect-[16/7]" : "aspect-video",
        className
      )}
      style={{ background: gradient }}
    >
      {/* Topic glow — a soft corner bloom in the family hue. This is the
          entire nod to per-topic color identity now that the generative
          constellation pattern and oversized icon watermark are gone —
          color-coding wasn't the complaint, decorative pattern-art was. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(130% 100% at 8% 108%, ${family.tint} 0%, transparent 62%)`,
        }}
      />

      {interactive && (
        // Quiet hover response — a faint overall brightness lift, nothing
        // drawn. Replaces the old canvas pointer-follow highlight; `group`
        // lives on this same root so it works whether or not an ancestor
        // link also declares one.
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-0
                     transition-opacity duration-300
                     [@media(hover:hover)]:group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(120% 100% at 25% 25%, rgba(255,255,255,0.05) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Title mark — the post's own title, set modestly rather than
          oversized or bleeding off an edge; the quiet-typographic
          direction that worked for project covers, scaled down for a
          denser blog card. Card contexts (list/compact/related) always
          show this — it functions like an auto-generated thumbnail label.
          Hero mode skips it: the post's H1 sits right above this banner
          with the same title, same tag, and same read time already, so
          repeating it here would just triple the same three facts instead
          of adding anything — the banner stays atmosphere + color identity
          only. */}
      {!hero && (
        <div className="absolute inset-0 flex items-center px-5 pb-6 sm:px-6">
          <p
            className={cn(
              "font-syne",
              "font-semibold leading-snug tracking-tight text-white/80 text-pretty line-clamp-2"
            )}
            style={{
              fontSize: "clamp(0.9375rem, 2.4vw, 1.25rem)",
              maxWidth: "82%",
            }}
          >
            {post.title}
          </p>
        </div>
      )}

      {/* Quiet topic detail — small, low-opacity icon; a detail, not the
          card's dominant graphic. */}
      <TopicIcon
        aria-hidden="true"
        className="absolute top-3 left-3 pointer-events-none opacity-[0.3]"
        color="white"
        size={hero ? 16 : 13}
        strokeWidth={1.6}
      />

      {/* Bottom fade for readability */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)",
        }}
      />

      {/* Tag chip — top-right */}
      {tag && (
        <span
          className="absolute top-3 right-3 inline-flex items-center gap-1
                     px-2 py-0.5 rounded-none
                     bg-white/[0.1] border border-white/[0.15] backdrop-blur-sm
                     ui-label text-white/70"
        >
          <IconTag aria-hidden="true" className="h-2.5 w-2.5" />
          {tag}
        </span>
      )}

      {/* Read time — bottom-left */}
      <span className="ui-label absolute bottom-3 left-4 inline-flex items-center gap-1 text-white/50">
        <IconClock aria-hidden="true" className="h-2.5 w-2.5" />
        {post.readTimeInMinutes} min read
      </span>
    </div>
  );
}
