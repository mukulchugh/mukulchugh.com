"use client";

import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PostCover } from "@/components/blog/post-cover";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Post } from "@/lib/blog";

const topics = ["All", "AI Agents", "Developer Tools", "React Native"];

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
  const resultsRef = useRef<HTMLElement>(null);
  const scrollToResults = useRef(false);

  useEffect(() => {
    const restore = () => {
      const saved = window.history.state?.portfolioWriting;
      setTopic(topics.includes(saved?.topic) ? saved.topic : "All");
      setPage(
        Number.isInteger(saved?.page) && saved.page >= 0 ? saved.page : 0
      );
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  const selectResults = (nextTopic: string, nextPage: number) => {
    // Store on this history entry, not in the route: Writing can also live
    // inside a dock window above a different dedicated page.
    window.history.replaceState(
      {
        ...window.history.state,
        portfolioWriting: { page: nextPage, topic: nextTopic },
      },
      ""
    );
    scrollToResults.current = nextPage !== requestedPage && nextTopic === topic;
    setTopic(nextTopic);
    setPage(nextPage);
  };

  useEffect(() => {
    if (!scrollToResults.current) return;
    scrollToResults.current = false;
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }, [requestedPage]);
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
              selectResults(name, 0);
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
            className="tile-glass group relative isolate flex min-h-[300px] flex-col overflow-hidden rounded-[14px] bg-[#101112] text-white sm:min-h-[24cqw] sm:p-6"
            href={`/blog/${featured.slug}`}
          >
            <PostCover
              className="h-56 w-full rounded-none sm:absolute sm:inset-0 sm:h-full"
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
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black/80 via-black/30 to-transparent sm:block" />
            <div className="relative flex max-w-xl flex-col items-start justify-between gap-5 p-6 sm:max-w-[48%] sm:flex-1 sm:p-0">
              <span className="ui-label">Latest article</span>
              <h2 className="text-balance font-sans text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-[1.12] tracking-[-0.025em]">
                {featured.title}
              </h2>
              <span
                className={buttonVariants({
                  className: "gap-5 bg-[#d2ff00] text-black",
                })}
              >
                Read article <IconArrowRight aria-hidden="true" size={19} />
              </span>
            </div>
          </Link>
          <section
            aria-label={`Articles, page ${page + 1} of ${pages}`}
            className="grid scroll-mt-6 gap-5 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-2 lg:grid-cols-3"
            ref={resultsRef}
            tabIndex={-1}
          >
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
                    <span className="ui-label">
                      {post.readTimeInMinutes} min read
                    </span>
                    <IconArrowUpRight aria-hidden="true" size={22} />
                  </div>
                  <h2 className="text-balance font-sans text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-[1.15] tracking-[-0.025em]">
                    {post.title}
                  </h2>
                </div>
                <div className="relative mt-24 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge
                      className="border-white/20 bg-[#101112]/90 text-white shadow-none"
                      key={tag.slug}
                      variant="outline"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </section>
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
            <Button
              aria-current={page === index ? "page" : undefined}
              className={`min-w-11 px-3 ${page === index ? "border-foreground bg-foreground text-background" : ""}`}
              key={index}
              onClick={() => selectResults(topic, index)}
              type="button"
              variant="outline"
            >
              {index + 1}
            </Button>
          ))}
          <Button
            className="px-4"
            disabled={page === pages - 1}
            onClick={() => selectResults(topic, page + 1)}
            type="button"
            variant="outline"
          >
            Next →
          </Button>
        </nav>
      )}
    </div>
  );
}
