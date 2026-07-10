"use client";

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { useSectionInView } from "@/lib/hooks";
import type { Post } from "@/lib/blog";
import { BlogPostCard } from "@/components/blog/blog-post-card";

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
      className="scroll-mt-28 w-full p-5 sm:p-6 lg:p-7 min-w-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 lg:gap-8 items-start min-w-0">

        {/* Left — editorial statement + CTA */}
        <motion.div
          variants={shouldReduce ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-4"
        >
          {/* Mono label — unified 10px */}
          <motion.p
            variants={shouldReduce ? undefined : itemVariants}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-400"
          >
            05 — Writing
          </motion.p>

          {/* Hairline */}
          <div className="h-px w-10 bg-zinc-900/[0.07]" aria-hidden="true" />

          {/* Section heading — clamp(1.4rem, 3.4vw, 2.1rem) */}
          <motion.h2
            variants={shouldReduce ? undefined : itemVariants}
            className={cn(
              syne.className,
              "font-black text-zinc-950 leading-[1.08] tracking-[-0.03em]"
            )}
            style={{ fontSize: "clamp(1.4rem, 3.4vw, 2.1rem)" }}
          >
            Writing &{" "}
            <span className="text-zinc-400 font-light">
              notes
            </span>
          </motion.h2>

          {/* Body — 14px muted, capped measure */}
          <motion.p
            variants={shouldReduce ? undefined : itemVariants}
            className="text-[14px] text-zinc-500 leading-relaxed max-w-[44ch]"
          >
            I write about engineering, product, and the craft of building
            software that earns its keep.
          </motion.p>

          {/* CTA link — touch target ≥44px via padding */}
          <motion.div variants={shouldReduce ? undefined : itemVariants}>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 py-2 text-[13px] font-semibold
                         text-zinc-500 transition-colors duration-200 w-fit
                         [@media(hover:hover)]:hover:text-zinc-900"
            >
              Read the blog
              <IconArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200
                           [@media(hover:hover)]:group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — Featured post card */}
        {featuredPost ? (
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 14 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.12 }}
            viewport={{ once: true, amount: 0.15 }}
            className="w-full lg:w-[260px] xl:w-[280px] min-w-0"
          >
            <BlogPostCard post={featuredPost} variant="compact" />
          </motion.div>
        ) : (
          <div className="w-full lg:w-[260px] xl:w-[280px] rounded-2xl border border-black/[0.07] bg-black/[0.02] h-[220px] flex items-center justify-center min-w-0">
            <p className="text-[12px] text-muted-foreground/50">No posts yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
