import { IconArrowLeft, IconCalendar, IconClock } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/article-body";
import { getPostCoverSrc, PostCover } from "@/components/blog/post-cover";
import { PostNav } from "@/components/blog/post-nav";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { RelatedPosts } from "@/components/blog/related-posts";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getAdjacentPosts,
  getPostServer,
  getPostsServer,
  getRelatedPosts,
} from "@/lib/blog";
import { accentColorForTags } from "@/lib/blog-topic";
import { siteConfig } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { posts } = await getPostsServer(20);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostServer(slug);

  if (!post) {
    notFound();
  }

  return pageMetadata(
    `/blog/${slug}`,
    post.seo?.title || post.title,
    post.seo?.description || post.brief,
    post.publishedAt,
    post.updatedAt
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const [post, adjacent, related] = await Promise.all([
    getPostServer(slug),
    Promise.resolve(getAdjacentPosts(slug)),
    Promise.resolve(getRelatedPosts(slug, 3)),
  ]);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    articleSection: post.tags[0]?.name || "Technology",
    author: {
      "@type": "Person",
      image: new URL(
        post.author?.profilePicture || siteConfig.images.profileImage,
        siteConfig.siteUrl
      ).href,
      name: post.author?.name || siteConfig.name,
      url: `${siteConfig.siteUrl}/about`,
    },
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    datePublished: post.publishedAt,
    description: post.brief,
    headline: post.title,
    image: new URL(getPostCoverSrc(post), siteConfig.siteUrl).href,
    keywords: post.tags.map((tag) => tag.name).join(", "),
    mainEntityOfPage: {
      "@id": `${siteConfig.siteUrl}/blog/${slug}`,
      "@type": "WebPage",
    },
    publisher: {
      "@id": `${siteConfig.siteUrl}/#person`,
      "@type": "Person",
      name: siteConfig.name,
    },
    timeRequired: `PT${post.readTimeInMinutes}M`,
    url: `${siteConfig.siteUrl}/blog/${slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: siteConfig.siteUrl,
        name: "Home",
        position: 1,
      },
      {
        "@type": "ListItem",
        item: `${siteConfig.siteUrl}/blog`,
        name: "Writing",
        position: 2,
      },
      {
        "@type": "ListItem",
        item: `${siteConfig.siteUrl}/blog/${slug}`,
        name: post.title,
        position: 3,
      },
    ],
  };

  const lightHero = [
    "brik-react-to-native-widgets",
    "phased-agent-turns-gather-analyze-synthesize",
    "progressive-tool-results-transcript-chunks",
    "self-hosted-personal-agent-fleet",
  ].includes(post.slug);
  const headings = post.headings ?? [];
  const hasTableOfContents = headings.length >= 2;

  return (
    // No overflow-x-hidden here: body already clips horizontal overflow
    // (app/globals.css), and adding it on this ancestor makes overflow-y
    // compute to `auto` (CSS overflow spec), turning <main> into a scroll
    // container that sits between the TOC's sticky aside and the real
    // scrolling viewport — silently breaking position: sticky.
    <main className="w-full py-5 sm:py-6">
      {/* Structured Data */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />

      <div>
        <header
          className={cn(
            "tile-glass relative isolate mb-6 overflow-hidden rounded-[14px] border border-border px-4 pt-8 pb-72 sm:px-10 md:flex md:min-h-[460px] md:items-center md:py-12 lg:px-12",
            lightHero ? "bg-white text-black" : "bg-[#101112] text-white"
          )}
        >
          <PostCover
            className="absolute inset-x-0 bottom-0 h-64 w-full rounded-none md:inset-0 md:h-full [&_img]:object-right"
            hero
            post={post}
            priority
          />
          <div
            className={cn(
              "absolute inset-0 hidden bg-gradient-to-r md:block",
              lightHero
                ? "from-white via-white/80 to-transparent"
                : "from-black/95 via-black/50 to-transparent"
            )}
          />
          <div className="relative min-w-0 md:w-[62%] lg:w-[58%]">
            <p className="ui-label mb-7">
              Writing / {post.tags[0]?.name || "Notes"}
            </p>
            <h1 className="mb-6 max-w-[24ch] text-balance font-sans text-[clamp(1.75rem,5vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] [overflow-wrap:anywhere]">
              {post.title}
            </h1>
            <p
              className={cn(
                "max-w-[48ch] text-base leading-relaxed sm:text-lg",
                lightHero ? "text-black/80" : "text-white/90"
              )}
            >
              {post.brief}
            </p>
            <Link
              className={cn(
                buttonVariants(),
                "mt-7 gap-3 bg-[#d2ff00] text-black hover:bg-[#c4ee00]"
              )}
              href="/blog"
            >
              <IconArrowLeft aria-hidden="true" size={17} />
              Back to writing
            </Link>
          </div>
        </header>
        <div className="ui-label mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 px-1 text-muted-foreground">
          {post.author && (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage alt="" src={post.author.profilePicture} />
                <AvatarFallback>
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span>{post.author.name}</span>
            </div>
          )}
          <span className="flex items-center gap-2">
            <IconCalendar aria-hidden="true" size={14} />
            <time dateTime={post.publishedAt}>{formattedDate}</time>
          </span>
          <span className="flex items-center gap-2">
            <IconClock aria-hidden="true" size={14} />
            {post.readTimeInMinutes} min read
          </span>
        </div>
        <div
          className={cn(
            "grid items-start gap-6",
            hasTableOfContents
              ? "lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10"
              : "lg:mx-auto lg:max-w-6xl"
          )}
        >
          {hasTableOfContents && (
            <div className="lg:self-stretch">
              <TableOfContents headings={headings} />
            </div>
          )}
          <div className="min-w-0">
            {/* Article body — rendered from raw markdown via Streamdown
                (components/blog/article-body.tsx), which renders real React
                elements (not a raw HTML string) and provides built-in Shiki
                syntax highlighting for code blocks. */}
            {post.content?.markdown && (
              <ReadingProgress>
                <article
                  className={cn(
                    // Base prose setup
                    "prose prose-zinc dark:prose-invert w-full max-w-none after:block after:clear-both",
                    // Body text — 16px, 1.75 line-height
                    "prose-p:text-base prose-p:leading-[1.8] prose-p:text-foreground/80",
                    // Headings — tight tracking, ink-dark
                    "[&_h2]:[overflow-wrap:anywhere] [&_h3]:[overflow-wrap:anywhere] prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-[-0.025em] prose-headings:text-foreground",
                    "prose-h2:text-[clamp(1.5rem,2.5vw,2rem)] prose-h2:leading-[1.2] prose-h2:tracking-[-0.02em] prose-h2:mt-10 prose-h2:mb-4",
                    "prose-h3:text-[1.125rem] prose-h3:leading-[1.35] prose-h3:tracking-[-0.01em] prose-h3:mt-8 prose-h3:mb-3",
                    // Scroll margin so TOC jumps land below any fixed header
                    "[&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24",
                    // Links — subtle underline on hover
                    "prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 prose-a:font-medium",
                    "[@media(hover:hover)]:prose-a:hover:underline [@media(hover:hover)]:prose-a:hover:text-foreground",
                    // Blockquotes — left ink border, neutral bg
                    "prose-blockquote:border-l-2 prose-blockquote:border-border",
                    "prose-blockquote:bg-muted prose-blockquote:py-1 prose-blockquote:pr-4",
                    "prose-blockquote:rounded-r-none prose-blockquote:not-italic",
                    "prose-blockquote:text-muted-foreground",
                    // Inline code — light chip
                    "prose-code:bg-muted prose-code:text-foreground/90",
                    "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-none",
                    "prose-code:text-[0.85em] prose-code:font-mono",
                    "prose-code:before:content-none prose-code:after:content-none",
                    // Code blocks — dark ink slab. Streamdown wraps fenced
                    // code in its own chrome (language label, copy button)
                    // rather than a bare <pre>, so it's restyled via the
                    // [data-streamdown] hooks in globals.css instead of
                    // prose-pre:* modifiers.
                    "[&_[data-streamdown='code-block']]:text-[0.85em] [&_[data-streamdown='code-block']]:leading-relaxed",
                    // Images
                    "prose-img:rounded-none prose-img:shadow-sm",
                    // Lists
                    "prose-li:text-base prose-li:text-foreground/80",
                    "prose-li:marker:text-muted-foreground",
                    // Tables
                    "prose-table:text-[14px]",
                    "prose-th:bg-muted prose-th:text-foreground/80 prose-th:font-semibold",
                    "prose-td:text-muted-foreground",
                    "prose-th:border prose-th:border-border",
                    "prose-td:border prose-td:border-border",
                    // Strong
                    "prose-strong:text-foreground prose-strong:font-semibold",
                    // HR
                    "prose-hr:border-border"
                  )}
                  id="article-content"
                >
                  {post.slug === "mobile-lessons-from-swiggy-scale" && (
                    <figure className="not-prose mb-6 overflow-hidden rounded-[14px] border border-border lg:float-right lg:mb-8 lg:ml-8 lg:w-[48%]">
                      <Image
                        alt="Four illustrative phones show ready, empty, offline, and low-battery states."
                        className="h-auto w-full"
                        height={1024}
                        sizes="(max-width: 1023px) 95vw, 40vw"
                        src="/design/articles/mobile-lessons-from-swiggy-scale-detail-recovery.png"
                        width={1536}
                      />
                      <figcaption className="bg-background px-4 py-3 text-xs text-muted-foreground">
                        Design for the states beyond the happy path.
                        Illustrative concept.
                      </figcaption>
                    </figure>
                  )}
                  <ArticleBody
                    headings={headings}
                    markdown={post.content.markdown}
                    slug={post.slug}
                  />
                </article>
              </ReadingProgress>
            )}

            {/* Footer */}
            <footer className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground/80
                             [@media(hover:hover)]:hover:text-foreground transition-colors"
                  href="/blog"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  View all posts
                </Link>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        accentColor={accentColorForTags([tag.name])}
                        className="text-xs"
                        key={tag.slug}
                        variant="secondary"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
        <PostNav next={adjacent.next} prev={adjacent.prev} />
        <RelatedPosts currentSlug={post.slug} posts={related} />
      </div>
    </main>
  );
}
