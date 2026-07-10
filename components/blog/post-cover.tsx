"use client";

import Image from "next/image";
import { IconTag, IconClock } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import type { Post } from "@/lib/blog";

// Deterministic per-post visual variation derived from the title.
// Returns a value 0–N-1 so each post looks distinct but cohesive.
function hashTitle(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = (h * 31 + title.charCodeAt(i)) >>> 0;
  }
  return h;
}

// Monochrome ink gradients — warm to cold, slightly different angles per post.
const GRADIENTS = [
  "linear-gradient(145deg, rgb(10,10,12) 0%, rgb(28,28,32) 100%)",
  "linear-gradient(155deg, rgb(12,12,14) 0%, rgb(32,30,34) 100%)",
  "linear-gradient(135deg, rgb(8,8,10) 0%, rgb(30,29,31) 100%)",
  "linear-gradient(160deg, rgb(14,13,14) 0%, rgb(34,32,32) 100%)",
  "linear-gradient(140deg, rgb(10,11,12) 0%, rgb(26,28,32) 100%)",
] as const;

// Dot/grid pattern overlays as SVG data URIs — subtle, low-opacity texture.
const PATTERNS = [
  // dot grid
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23ffffff' fill-opacity='0.04'/%3E%3C/svg%3E")`,
  // fine grid
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M24 0H0v24' fill='none' stroke='%23ffffff' stroke-opacity='0.035' stroke-width='0.5'/%3E%3C/svg%3E")`,
  // diagonal hatch
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cline x1='0' y1='20' x2='20' y2='0' stroke='%23ffffff' stroke-opacity='0.035' stroke-width='0.5'/%3E%3C/svg%3E")`,
  // larger dot
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='2' cy='2' r='1.2' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E")`,
  // crosshatch
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cline x1='0' y1='0' x2='16' y2='16' stroke='%23ffffff' stroke-opacity='0.03' stroke-width='0.5'/%3E%3Cline x1='16' y1='0' x2='0' y2='16' stroke='%23ffffff' stroke-opacity='0.03' stroke-width='0.5'/%3E%3C/svg%3E")`,
] as const;

interface PostCoverProps {
  post: Post;
  priority?: boolean;
  className?: string;
  /** Hero mode: taller, prominent; default is card thumbnail ratio */
  hero?: boolean;
}

export function PostCover({ post, priority = false, className, hero = false }: PostCoverProps) {
  const initial = post.title.charAt(0).toUpperCase();
  const tag = post.tags?.[0]?.name;

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
          src={post.coverImage.url}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes={hero ? "(max-width: 768px) 100vw, 896px" : "(max-width: 768px) 100vw, 560px"}
          priority={priority}
        />
      </div>
    );
  }

  // Designed editorial cover — deterministic per post.
  const h = hashTitle(post.title);
  const gradient = GRADIENTS[h % GRADIENTS.length];
  const pattern = PATTERNS[h % PATTERNS.length];
  // Oversized initial font-size: vary between 60–100px for visual rhythm.
  const initialSize = 60 + (h % 5) * 10;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl select-none",
        hero ? "aspect-[16/7]" : "aspect-video",
        className
      )}
      style={{ background: gradient }}
      aria-hidden="false"
    >
      {/* Texture pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: pattern, backgroundRepeat: "repeat" }}
        aria-hidden="true"
      />

      {/* Oversized initial as texture */}
      <div className="absolute inset-0 flex items-end justify-start pl-5 pb-3 pointer-events-none" aria-hidden="true">
        <span
          className={cn(syne.className, "font-black leading-none tracking-tighter")}
          style={{ fontSize: `${initialSize}px`, color: "rgba(255,255,255,0.055)" }}
        >
          {initial}
        </span>
      </div>

      {/* Bottom fade for readability */}
      <div
        className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* Tag chip — top-right */}
      {tag && (
        <span
          className="absolute top-3 right-3 inline-flex items-center gap-1
                     px-2 py-0.5 rounded-full
                     bg-white/[0.1] border border-white/[0.15] backdrop-blur-sm
                     text-[10px] font-mono uppercase tracking-[0.12em] text-white/70"
        >
          <IconTag className="h-2.5 w-2.5" aria-hidden="true" />
          {tag}
        </span>
      )}

      {/* Read time — bottom-left */}
      <span
        className="absolute bottom-3 left-4 inline-flex items-center gap-1
                   text-[10px] font-mono text-white/50 tracking-wide"
      >
        <IconClock className="h-2.5 w-2.5" aria-hidden="true" />
        {post.readTimeInMinutes} min read
      </span>
    </div>
  );
}
