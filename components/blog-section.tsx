"use client";

import Link from "next/link";
import { IconArrowRight, IconBook, IconClock, IconTag } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { useSectionInView } from "@/lib/hooks";
import type { Post } from "@/lib/blog";

// Format date as "Jul 5, 2026"
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface FeaturedPostCardProps {
  post: Post;
}

function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  const initial = post.title.charAt(0).toUpperCase();

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl overflow-hidden border border-black/[0.08] bg-black/[0.02]
                 hover:border-black/[0.15] hover:bg-black/[0.04]
                 transition-all duration-300 ease-premium"
      aria-label={`Read: ${post.title}`}
    >
      {/* Cover region — gradient with large initial as texture */}
      <div className="relative h-[110px] overflow-hidden">
        {/* Gradient mesh background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(24,24,27,0.82) 0%, rgba(39,39,42,0.72) 50%, rgba(63,63,70,0.60) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 75% 20%, rgba(82,82,91,0.35) 0%, transparent 55%), " +
              "radial-gradient(circle at 15% 80%, rgba(24,24,27,0.25) 0%, transparent 50%)",
          }}
        />
        {/* Large initial letter as texture */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <span
            className="text-[96px] font-black leading-none tracking-tighter"
            style={{ color: "rgba(255,255,255,0.06)" }}
          >
            {initial}
          </span>
        </div>
        {/* Tag chip (top-right) */}
        {post.tags?.[0] && (
          <span
            className="absolute top-3 right-3 inline-flex items-center gap-1
                       px-2 py-0.5 rounded-full
                       bg-white/40 border border-white/[0.30] backdrop-blur-sm
                       text-[10px] font-semibold text-white/90 uppercase tracking-[0.1em]"
          >
            <IconTag className="h-2.5 w-2.5" />
            {post.tags[0].name}
          </span>
        )}
        {/* Bottom fade for smooth transition */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* Post meta & content */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <IconClock className="h-3 w-3 flex-shrink-0" />
          <span>{post.readTimeInMinutes} min read</span>
          <span className="opacity-40">·</span>
          <span>{fmtDate(post.publishedAt)}</span>
        </div>
        <h3 className="text-[13.5px] font-semibold text-foreground leading-snug transition-colors duration-200">
          {post.title}
        </h3>
        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
          {post.brief}
        </p>
        <div className="flex items-center gap-1 mt-1 text-[11.5px] font-medium text-zinc-500 group-hover:text-zinc-800 transition-colors duration-200">
          Read article
          <IconArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogSection({ posts = [] }: { posts?: Post[] }) {
  const { ref } = useSectionInView("Blog", 0.3);
  const featuredPost = posts[0] ?? null;

  return (
    <section
      ref={ref}
      id="blog"
      className="scroll-mt-28 w-full p-6 sm:p-7"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-8 items-start">

        {/* Left — Label + heading + description + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-4"
        >
          {/* Label */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-zinc-100 border border-zinc-200">
              <IconBook className="h-3.5 w-3.5 text-zinc-500" />
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.14em]">
              Latest writing
            </span>
          </div>

          <h2
            className={cn(
              syne.className,
              "text-[1.6rem] sm:text-[2rem] font-bold text-foreground leading-[1.15] tracking-tight"
            )}
          >
            Thoughts &{" "}
            <span className="text-foreground font-semibold">
              insights
            </span>
          </h2>

          <p className="text-[13.5px] text-muted-foreground leading-relaxed max-w-[40ch]">
            I write about engineering, product, and the craft of building
            software that earns its keep.
          </p>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold
                       text-zinc-500 hover:text-zinc-900 transition-colors duration-200 w-fit"
          >
            Read the blog
            <IconArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </motion.div>

        {/* Right — Featured post card */}
        {featuredPost ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="w-full lg:w-[280px]"
          >
            <FeaturedPostCard post={featuredPost} />
          </motion.div>
        ) : (
          <div className="w-full lg:w-[280px] rounded-2xl border border-black/[0.07] bg-black/[0.02] h-[220px] flex items-center justify-center">
            <p className="text-[12px] text-muted-foreground/50">No posts yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
