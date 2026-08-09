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

// Monochrome ink gradients — warm to cold, slightly different angles per post.
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
  const initial = post.title.charAt(0).toUpperCase();
  const tag = post.tags?.[0]?.name;
  const family = topicFamilyFor(tagNames);
  const TopicIcon = family?.icon;

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
  // Oversized initial font-size: vary between 60–100px for visual rhythm.
  const initialSize = 60 + (h % 5) * 10;
  // Topic icon stays a small corner mark (not the initial's dominant size)
  // so the generative pattern underneath is what a viewer notices first.
  const iconSize = 28 + (h % 4) * 6;

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
      {/* Topic tint — reflects the post's subject, not just its title hash */}
      {family && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(120% 90% at 15% 100%, ${family.tint} 0%, transparent 60%)`,
          }}
        />
      )}

      {interactive ? (
        // Generative canvas — seeded by this post's own title, so the
        // pattern is unique to it and stable across visits; a cheap
        // pointer-following highlight only while actually hovered.
        <CoverCanvas tags={tagNames} title={post.title} />
      ) : (
        <>
          {/* Static canvas-drawn topic pattern — one-time draw, no pointer
              listeners; the perf-sensitive dense homepage tile doesn't
              pay for the interactive highlight. This is the same generative
              pattern CoverCanvas draws, so the card reads as "pattern with a
              small mark on it", not "icon with nothing underneath". */}
          <StaticCoverPattern tags={tagNames} title={post.title} />

          {/* Topic mark — small corner icon when the tag maps to a known
              family, else the title initial. Kept modest so the generative
              pattern above stays the thing a viewer actually notices. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-end justify-start pl-4 pb-3 pointer-events-none"
          >
            {TopicIcon ? (
              <TopicIcon
                color="rgba(255,255,255,0.14)"
                size={iconSize}
                strokeWidth={1.5}
              />
            ) : (
              <span
                className={cn(
                  "font-syne",
                  "font-black leading-none tracking-tighter"
                )}
                style={{
                  color: "rgba(255,255,255,0.055)",
                  fontSize: `${initialSize}px`,
                }}
              >
                {initial}
              </span>
            )}
          </div>
        </>
      )}

      {/* Bottom fade for readability */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)",
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
