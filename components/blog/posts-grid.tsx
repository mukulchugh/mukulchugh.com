"use client";

import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { PostCover } from "@/components/blog/post-cover";
import type { Post } from "@/lib/blog";

export function getWritingPage(
  posts: Post[],
  topic: string,
  requestedPage: number
) {
  const matches = posts.filter(
    (post) => topic === "All" || post.tags.some((tag) => tag.name === topic)
  );
  const [featured, ...rest] = matches;
  const pages = Math.max(1, Math.ceil(rest.length / 6));
  const page = Math.min(Math.max(0, requestedPage), pages - 1);
  return {
    featured,
    page,
    pages,
    total: matches.length,
    visible: rest.slice(page * 6, page * 6 + 6),
  };
}

export function PostsGrid({ posts }: { posts: Post[] }) {
  const [topic, setTopic] = useState("All");
  const [requestedPage, setPage] = useState(0);
  const topics = ["All", "AI Agents", "Developer Tools", "React Native"];
  const { featured, page, pages, total, visible } = getWritingPage(
    posts,
    topic,
    requestedPage
  );

  return (
    <div className="space-y-5">
      <div
        aria-label="Filter writing by topic"
        className="flex flex-wrap gap-2"
      >
        {topics.map((name) => (
          <button
            aria-pressed={topic === name}
            className={`ui-label min-h-11 rounded-full border px-4 py-2 transition-colors ${topic === name ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted"}`}
            key={name}
            onClick={() => {
              setTopic(name);
              setPage(0);
            }}
            type="button"
          >
            {name}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {total} articles. Page {page + 1} of {pages}.
      </p>
      {featured ? (
        <>
          <Link
            className="tile-glass group relative isolate flex min-h-[300px] overflow-hidden rounded-[14px] bg-[#101112] p-6 text-white sm:min-h-[24cqw] sm:p-6"
            href={`/blog/${featured.slug}`}
          >
            <PostCover
              className="absolute inset-0 h-full w-full"
              hero
              post={featured}
              priority
              src={
                featured.slug ===
                "checkpointing-agent-edits-without-touching-git-index"
                  ? "/design/writing-featured-reference.png"
                  : undefined
              }
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
            <div className="relative flex max-w-xl flex-col items-start justify-between gap-5 sm:max-w-[48%]">
              <span className="ui-label">Latest article</span>
              <h2 className="text-balance font-sans text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-[1.12] tracking-[-0.025em]">
                {featured.title}
              </h2>
              <span className="inline-flex min-h-11 items-center gap-5 rounded-lg bg-[#d2ff00] px-5 text-sm font-semibold text-black">
                Read article <IconArrowRight aria-hidden="true" size={19} />
              </span>
            </div>
          </Link>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <Link
                className="tile-glass group relative isolate flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[14px] bg-[#101112] p-5 text-white"
                href={`/blog/${post.slug}`}
                key={post.id}
              >
                <PostCover
                  className="absolute inset-0 h-full w-full"
                  post={post}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/30 to-black/80" />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="ui-label">{post.tags[0]?.name}</span>
                    <IconArrowUpRight aria-hidden="true" size={22} />
                  </div>
                  <h2 className="text-balance font-sans text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-[1.15] tracking-[-0.025em]">
                    {post.title}
                  </h2>
                </div>
                <div className="relative mt-24 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      className="ui-label rounded-md border border-white/40 px-2.5 py-1"
                      key={tag.slug}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className="py-12 text-muted-foreground">
          No articles in this topic yet.
        </p>
      )}
      {pages > 1 && (
        <nav
          aria-label="Writing pages"
          className="flex justify-center gap-2 py-2"
        >
          {Array.from({ length: pages }, (_, index) => (
            <button
              aria-current={page === index ? "page" : undefined}
              className={`h-11 min-w-11 rounded-lg border px-3 text-sm ${page === index ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted"}`}
              key={index}
              onClick={() => setPage(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
          <button
            className="min-h-11 rounded-lg border border-border px-4 text-sm disabled:opacity-40"
            disabled={page === pages - 1}
            onClick={() => setPage(page + 1)}
            type="button"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
