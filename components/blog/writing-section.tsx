"use client";

import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/blog";
import styles from "./writing-section.module.css";

const featured = [
  {
    image: "/design/agent-loop-home-reference.webp",
    light: false,
    slug: "agent-stuck-detection-tool-loops",
  },
  {
    image: "/design/database-layers-home-reference.webp",
    light: true,
    slug: "skip-your-own-api-when-you-own-the-database",
  },
  {
    image: "/design/articles/openkvm-one-keyboard-two-macs.png",
    light: false,
    slug: "openkvm-one-keyboard-two-macs",
  },
];
const opening = [
  "self-hosted-personal-agent-fleet",
  "brik-react-to-native-widgets",
  "human-in-the-loop-agent-plans",
  "agent-working-memory-injection-hygiene",
];
const pageSize = 4;

export function WritingSection({ posts }: { posts: Post[] }) {
  const [shown, setShown] = useState(pageSize);
  const remaining = posts.filter(
    (post) => !featured.some((item) => item.slug === post.slug)
  );
  const articles = [
    ...opening.flatMap((slug) =>
      remaining.filter((post) => post.slug === slug)
    ),
    ...remaining
      .filter((post) => !opening.includes(post.slug))
      .toSorted(
        (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
      ),
  ];
  const visible = articles.slice(0, shown);
  const hasMore = shown < articles.length;
  const loadMore = () => setShown(Math.min(shown + pageSize, articles.length));

  return (
    <section aria-labelledby="writing-heading" className={styles.section}>
      <header className={styles.header}>
        <div>
          <h2 id="writing-heading">Things I learned the long way.</h2>
          <p>
            Notes on the systems I build, the tools I question, and the details
            that stay with me.
          </p>
        </div>
        <Link className={styles.all} href="/blog">
          All articles <IconArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </header>
      <div className={styles.columns}>
        <div aria-label="Featured writing" className={styles.features}>
          {featured.map(({ slug, image, light }) => {
            const post = posts.find((item) => item.slug === slug);
            if (!post) return null;
            return (
              <Link
                className={`tile-glass ${styles.feature}`}
                data-light={light}
                href={`/blog/${slug}`}
                key={slug}
              >
                <span aria-hidden="true" className={styles.art}>
                  <Image
                    alt=""
                    fill
                    sizes="(max-width: 900px) 55vw, 25vw"
                    src={image}
                    unoptimized
                  />
                </span>
                <IconArrowUpRight
                  aria-hidden="true"
                  className={styles.featureArrow}
                  size={21}
                />
                <h3>{post.title}</h3>
                <p>
                  {post.readTimeInMinutes} min read ·{" "}
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      timeZone: "UTC",
                      year: "numeric",
                    })}
                  </time>
                </p>
              </Link>
            );
          })}
        </div>
        <div className={`bento-surface ${styles.library}`}>
          <section
            aria-label="Browse articles"
            className={styles.scroller}
            onScroll={(event) => {
              const list = event.currentTarget;
              if (
                hasMore &&
                list.scrollHeight - list.scrollTop - list.clientHeight < 120
              )
                loadMore();
            }}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need to scroll the article list.
            tabIndex={0}
          >
            <ul
              aria-label="More articles"
              className={styles.list}
              id="writing-articles"
            >
              {visible.map((post, index) => (
                <li
                  data-appended={index >= pageSize}
                  key={post.slug}
                  style={{ animationDelay: `${(index % pageSize) * 35}ms` }}
                >
                  <Link className={styles.article} href={`/blog/${post.slug}`}>
                    <div>
                      <h3>{post.title}</h3>
                      <p>{post.brief}</p>
                    </div>
                    <IconArrowRight aria-hidden="true" size={22} />
                  </Link>
                </li>
              ))}
              {articles.length === 0 && (
                <li className={styles.empty}>More notes are on their way.</li>
              )}
            </ul>
            {articles.length > 0 && (
              <div className={styles.loadMore}>
                {hasMore ? (
                  <Button
                    aria-controls="writing-articles"
                    onClick={loadMore}
                    variant="ghost"
                  >
                    Load more articles
                    <IconArrowRight aria-hidden="true" size={16} />
                  </Button>
                ) : (
                  <p className={styles.end}>You’re all caught up.</p>
                )}
              </div>
            )}
          </section>
          <span aria-live="polite" className="sr-only">
            {visible.length} of {articles.length} articles shown.
          </span>
        </div>
      </div>
    </section>
  );
}
