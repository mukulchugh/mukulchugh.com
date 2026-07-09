"use client";

import Link from "next/link";
import { IconArrowRight, IconClock, IconTag } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
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
                 transition-all duration-300 hover:-translate-y-0.5"
      aria-label={`Read: ${post.title}`}
    >
      {/* Cover region — editorial dark with oversized initial */}
      <div
        className="relative overflow-hidden"
        style={{
          minHeight: "120px",
          background:
            "linear-gradient(145deg, rgb(12,12,14) 0%, rgb(28,28,32) 100%)",
        }}
      >
        {/* Large initial letter as texture */}
        <div className="absolute inset-0 flex items-center justify-start pl-5 select-none pointer-events-none">
          <span
            className={cn(syne.className, "font-black leading-none tracking-tighter")}
            style={{ fontSize: "100px", color: "rgba(255,255,255,0.055)" }}
          >
            {initial}
          </span>
        </div>
        {/* Tag chip (top-right) */}
        {post.tags?.[0] && (
          <span
            className="absolute top-3 right-3 inline-flex items-center gap-1
                       px-2 py-0.5 rounded-full
                       bg-white/[0.1] border border-white/[0.15] backdrop-blur-sm
                       text-[10px] font-mono uppercase tracking-[0.12em] text-white/70"
          >
            <IconTag className="h-2.5 w-2.5" />
            {post.tags[0].name}
          </span>
        )}
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/15 to-transparent" />
      </div>

      {/* Post meta & content */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
          <IconClock className="h-3 w-3 flex-shrink-0" />
          <span>{post.readTimeInMinutes} min read</span>
          <span className="opacity-40">·</span>
          <span>{fmtDate(post.publishedAt)}</span>
        </div>
        <h3 className="text-[13.5px] font-semibold text-zinc-950 leading-snug transition-colors duration-200">
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

export default function BlogSection({ posts = [] }: { posts?: Post[] }) {
  const { ref } = useSectionInView("Blog", 0.3);
  const featuredPost = posts[0] ?? null;
  const shouldReduce = useReducedMotion();

  return (
    <section
      ref={ref}
      id="blog"
      className="scroll-mt-28 w-full p-6 sm:p-7"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-8 items-start">

        {/* Left — editorial statement + CTA */}
        <motion.div
          variants={shouldReduce ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-4"
        >
          {/* Monospace editorial marker */}
          <motion.p
            variants={shouldReduce ? undefined : itemVariants}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400"
          >
            05 — Writing
          </motion.p>

          {/* Hairline */}
          <div className="h-px w-10 bg-zinc-900/[0.07]" aria-hidden="true" />

          <motion.h2
            variants={shouldReduce ? undefined : itemVariants}
            className={cn(
              syne.className,
              "text-[1.75rem] sm:text-[2.1rem] font-black text-zinc-950 leading-[1.08] tracking-[-0.03em]"
            )}
          >
            Thoughts &{" "}
            <span className="text-zinc-400 font-light">
              insights
            </span>
          </motion.h2>

          <motion.p
            variants={shouldReduce ? undefined : itemVariants}
            className="text-[13.5px] text-muted-foreground leading-relaxed max-w-[40ch]"
          >
            I write about engineering, product, and the craft of building
            software that earns its keep.
          </motion.p>

          <motion.div variants={shouldReduce ? undefined : itemVariants}>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold
                         text-zinc-500 hover:text-zinc-900 transition-colors duration-200 w-fit"
            >
              Read the blog
              <IconArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — Featured post card */}
        {featuredPost ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.12 }}
            viewport={{ once: true, amount: 0.15 }}
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
