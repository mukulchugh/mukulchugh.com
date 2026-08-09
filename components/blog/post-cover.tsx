"use client";

import { IconClock, IconTag } from "@tabler/icons-react";
import Image from "next/image";
import {
  CoverCanvas,
  StaticCoverPattern,
} from "@/components/blog/cover-canvas";
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
  /** Canvas-drawn generative pattern + pointer highlight. Off on the dense homepage tile for perf; on for /blog and the post hero. */
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
  const [accentR, accentG, accentB] = family.accent;

  if (post.coverImage?.url) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl",
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
  // Oversized watermark icon — the dominant graphic mark on the card, sized
  // with confidence rather than tucked away as a timid corner accent.
  // Hero gets more room to breathe; a little per-post jitter keeps a run of
  // same-family cards from looking machine-stamped identical.
  const iconSize = (hero ? 132 : 84) + (h % 5) * 6;

  return (
    <div
      aria-hidden="false"
      className={cn(
        "relative overflow-hidden rounded-xl select-none",
        hero ? "aspect-[16/7]" : "aspect-video",
        className
      )}
      style={{ background: gradient }}
    >
      {/* Topic glow — a real corner bloom in the family hue, the same
          register as the accent glow on project cards, so the cover reads
          as colored and intentional rather than a flat near-black slab. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(130% 100% at 8% 108%, ${family.tint} 0%, transparent 62%)`,
        }}
      />

      {/* Oversized topic watermark — bleeds slightly off the bottom-right
          edge, the card's dominant graphic element. */}
      <TopicIcon
        aria-hidden="true"
        className="absolute pointer-events-none"
        color={`rgba(${accentR},${accentG},${accentB},0.22)`}
        size={iconSize}
        strokeWidth={1.25}
        style={{
          bottom: `-${iconSize * 0.22}px`,
          right: `-${iconSize * 0.16}px`,
        }}
      />

      {interactive ? (
        // Generative constellation — seeded by this post's own title, so
        // the layout is unique to it and stable across visits; a cheap
        // pointer-following highlight only while actually hovered.
        <CoverCanvas tags={tagNames} title={post.title} />
      ) : (
        // Static one-time draw — no pointer listeners, no rAF loop — the
        // perf-sensitive dense homepage tile doesn't pay for the
        // interactive highlight.
        <StaticCoverPattern tags={tagNames} title={post.title} />
      )}

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
                     px-2 py-0.5 rounded-full
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
