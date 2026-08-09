"use client";

import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/blog";
import { useSectionInView } from "@/lib/hooks";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";
import { SECTION_TITLE } from "@/lib/typography";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;

export default function BlogSection({ posts = [] }: { posts?: Post[] }) {
  const { ref } = useSectionInView("Blog", 0.2);
  const shouldReduce = useReducedMotion();
  const pageCount = Math.ceil(posts.length / PAGE_SIZE);
  const [page, setPage] = useState(0);
  const pagePosts = posts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section
      className="relative scroll-mt-28 w-full min-w-0 p-5 sm:p-6 lg:p-8"
      id="blog"
      ref={ref}
    >
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2.5">
          <p className="ui-label text-muted-foreground">05 — Writing</p>
          <div aria-hidden="true" className="h-px w-10 bg-foreground/[0.07]" />
          <h2
            className={cn(
              "font-syne font-black leading-[1.05] tracking-[-0.04em] text-balance text-foreground"
            )}
            style={{ fontSize: SECTION_TITLE }}
          >
            Writing &{" "}
            <span className="font-light text-muted-foreground">notes</span>
          </h2>
          <p className="max-w-[48ch] text-[14px] leading-[1.7] text-pretty text-muted-foreground">
            Short notes on engineering, product, and shipping — from OpenKVM and
            Brik to agents and founding-team work.
          </p>
        </div>

        <Link
          className="group inline-flex w-fit items-center gap-1.5 py-2 text-[13px] font-semibold
                     text-muted-foreground transition-colors duration-200
                     [@media(hover:hover)]:hover:text-foreground"
          href="/blog"
        >
          View all on /blog
          <IconArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200
                       [@media(hover:hover)]:group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex h-[160px] items-center justify-center rounded-2xl border border-border bg-foreground/[0.03]">
          <p className="text-[12px] text-muted-foreground/50">No posts yet</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4"
          initial={shouldReduce ? false : "hidden"}
          key={page}
          variants={shouldReduce ? undefined : staggerContainer}
          viewport={viewportOnce}
          whileInView={shouldReduce ? undefined : "visible"}
        >
          {pagePosts.map((post, index) => (
            <motion.div
              className="min-w-0"
              key={post.slug}
              variants={shouldReduce ? undefined : staggerItem}
            >
              <BlogPostCard index={index} post={post} variant="compact" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {pageCount > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            aria-label="Previous posts"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            size="sm"
            type="button"
            variant="secondary"
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
            Page {page + 1} of {pageCount}
          </span>
          <Button
            aria-label="Next posts"
            disabled={page === pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            size="sm"
            type="button"
            variant="secondary"
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
