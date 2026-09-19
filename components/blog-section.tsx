"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/blog";
import { useSectionInView } from "@/lib/hooks";

const featured = [
  {
    dark: true,
    image: "/design/agent-loop-home-reference.png",
    lines: ["Agents don't", "fail quietly:", "they loop"],
    slug: "agent-stuck-detection-tool-loops",
  },
  {
    dark: false,
    image: "/design/database-layers-home-reference.png",
    lines: ["Skip your own", "API when you", "own the database"],
    slug: "skip-your-own-api-when-you-own-the-database",
  },
];

export default function BlogSection({ posts = [] }: { posts?: Post[] }) {
  const { ref } = useSectionInView("Blog", 0.2);

  return (
    <section
      className="bento-surface w-full min-w-0 scroll-mt-24 p-3"
      id="blog"
      ref={ref}
    >
      <div className="relative mb-3 flex min-h-6 items-center justify-between gap-3 px-1">
        <h2 className="bento-label">09 / Writing & notes</h2>
        <Link
          className="bento-label absolute right-1 top-1/2 inline-flex min-h-6 -translate-y-1/2 items-center gap-1 hover:text-foreground"
          href="/blog"
        >
          All articles <IconArrowUpRight aria-hidden="true" size={12} />
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {featured.map(({ slug, image, dark, lines }) => {
          const post = posts.find((entry) => entry.slug === slug);
          if (!post) return null;
          return (
            <Link
              className={`group relative block h-[180px] overflow-hidden rounded-xl p-4 md:h-[16.7cqw] md:p-[1.7cqw] ${dark ? "bg-[#151515] text-white" : "bg-[#f3f2f0] text-black"}`}
              href={`/blog/${slug}`}
              key={slug}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-[55%] [mask-image:linear-gradient(to_right,transparent,black_30%)]"
              >
                <Image
                  alt=""
                  className="object-cover object-right"
                  fill
                  sizes="(max-width: 767px) 95vw, 47vw"
                  src={image}
                />
              </span>
              <IconArrowUpRight
                aria-hidden="true"
                className="absolute right-3 top-3 z-10 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                size={19}
              />
              <h3
                aria-label={post.title}
                className="relative font-sans text-[clamp(24px,3cqw,42px)] font-extrabold leading-[0.98] tracking-[-0.04em]"
              >
                {lines.map((line) => (
                  <span
                    aria-hidden="true"
                    className="block whitespace-nowrap"
                    key={line}
                  >
                    {line}
                  </span>
                ))}
              </h3>
              <p className="absolute bottom-2 left-4 font-mono text-[9px] md:left-[1.7cqw] md:text-[clamp(8px,0.85cqw,12px)]">
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
    </section>
  );
}
