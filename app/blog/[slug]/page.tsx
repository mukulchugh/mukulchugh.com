import {
  getPostServer,
  getPostsServer,
  getAdjacentPosts,
  getRelatedPosts,
} from "@/lib/blog";
import { siteConfig } from "@/lib/data";
import { syne } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PostCover } from "@/components/blog/post-cover";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { PostNav } from "@/components/blog/post-nav";
import { RelatedPosts } from "@/components/blog/related-posts";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { IconArrowLeft, IconCalendar, IconClock } from "@tabler/icons-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AdUnit } from "@/components/ad-unit";

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
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.seo?.title || post.title} | ${siteConfig.name}`,
    description: post.seo?.description || post.brief,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.brief,
      images: post.coverImage?.url ? [post.coverImage.url] : [],
      type: "article",
      publishedTime: post.publishedAt,
      url: `${siteConfig.siteUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.brief,
      images: post.coverImage?.url ? [post.coverImage.url] : [],
    },
  };
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
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.brief,
    image: post.coverImage?.url || siteConfig.images.ogImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || siteConfig.name,
      image: post.author?.profilePicture || siteConfig.images.profileImage,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.images.profileImage,
      },
    },
    url: `${siteConfig.siteUrl}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl}/blog/${slug}`,
    },
    keywords: post.tags.map((tag) => tag.name).join(", "),
    articleSection: post.tags[0]?.name || "Technology",
    timeRequired: `PT${post.readTimeInMinutes}M`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteConfig.siteUrl}/blog/${slug}`,
      },
    ],
  };

  const headings = post.headings ?? [];

  return (
    <main className="w-full py-12 sm:py-20 lg:py-28 overflow-x-hidden">
      {/* Reading progress bar */}
      <ReadingProgress />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Outer container — constrains horizontal width */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 py-2 text-[14px] text-zinc-500
                     [@media(hover:hover)]:hover:text-zinc-900 transition-colors mb-10"
        >
          <IconArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article header — full width (no sidebar yet) */}
        <header className="max-w-3xl mb-10">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag.slug} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <h1
            className={cn(
              syne.className,
              "font-black text-zinc-950 mb-6 leading-[1.08] tracking-tight break-words"
            )}
            style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)" }}
          >
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[12px] text-zinc-400">
            {post.author && (
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={post.author.profilePicture} />
                  <AvatarFallback>
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-zinc-700 font-medium">
                  {post.author.name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <IconCalendar className="w-3.5 h-3.5" />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </div>
            <div className="flex items-center gap-2">
              <IconClock className="w-3.5 h-3.5" />
              <span>{post.readTimeInMinutes} min read</span>
            </div>
          </div>
        </header>

        {/* Cover image — full width */}
        <div className="max-w-3xl mb-10">
          <PostCover post={post} priority hero />
        </div>

        {/* Ad Unit above content */}
        <div className="max-w-3xl mb-10">
          <AdUnit adFormat="horizontal" />
        </div>

        {/* Reading layout: TOC sidebar + article column */}
        <div className="flex gap-12 items-start">
          {/* TOC sidebar — sticky, Desktop lg+ only (hidden on smaller screens via CSS) */}
          {headings.length >= 2 && (
            <TableOfContents headings={headings} />
          )}

          {/* Article column */}
          <div className="min-w-0 flex-1 max-w-3xl">
            {/* Mobile TOC disclosure — visible below lg, hidden at lg+ */}
            {headings.length >= 2 && (
              <TableOfContents headings={headings} />
            )}

            {/* Article body */}
            {post.content?.html && (
              <article
                className={cn(
                  // Base prose setup
                  "prose prose-zinc max-w-none",
                  // Body text — 16px, 1.75 line-height
                  "prose-p:text-[16px] prose-p:leading-[1.8] prose-p:text-zinc-700",
                  // Headings — tight tracking, ink-dark
                  "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-zinc-900",
                  "prose-h2:text-[1.375rem] prose-h2:mt-10 prose-h2:mb-4",
                  "prose-h3:text-[1.125rem] prose-h3:mt-8 prose-h3:mb-3",
                  // Scroll margin so TOC jumps land below any fixed header
                  "[&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24",
                  // Links — subtle underline on hover
                  "prose-a:text-zinc-700 prose-a:no-underline prose-a:font-medium",
                  "[@media(hover:hover)]:prose-a:hover:underline [@media(hover:hover)]:prose-a:hover:text-zinc-950",
                  // Blockquotes — left ink border, warm bg
                  "prose-blockquote:border-l-2 prose-blockquote:border-zinc-300",
                  "prose-blockquote:bg-zinc-50 prose-blockquote:py-1 prose-blockquote:pr-4",
                  "prose-blockquote:rounded-r-md prose-blockquote:not-italic",
                  "prose-blockquote:text-zinc-600",
                  // Inline code — light chip
                  "prose-code:bg-zinc-100 prose-code:text-zinc-800",
                  "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
                  "prose-code:text-[0.85em] prose-code:font-mono",
                  "prose-code:before:content-none prose-code:after:content-none",
                  // Code blocks — dark ink slab
                  "prose-pre:bg-zinc-950 prose-pre:text-zinc-100",
                  "prose-pre:rounded-xl prose-pre:border prose-pre:border-zinc-800",
                  "prose-pre:overflow-x-auto prose-pre:max-w-full",
                  "prose-pre:text-[0.85em] prose-pre:leading-relaxed",
                  // Images
                  "prose-img:rounded-xl prose-img:shadow-sm",
                  // Lists
                  "prose-li:text-[16px] prose-li:text-zinc-700",
                  "prose-li:marker:text-zinc-400",
                  // Tables
                  "prose-table:text-[14px]",
                  "prose-th:bg-zinc-50 prose-th:text-zinc-700 prose-th:font-semibold",
                  "prose-td:text-zinc-600",
                  "prose-th:border prose-th:border-zinc-200",
                  "prose-td:border prose-td:border-zinc-100",
                  // Strong
                  "prose-strong:text-zinc-900 prose-strong:font-semibold",
                  // HR
                  "prose-hr:border-zinc-100",
                )}
                dangerouslySetInnerHTML={{ __html: post.content.html }}
              />
            )}

            {/* Ad Unit below content */}
            <AdUnit adFormat="auto" className="mt-10" />

            {/* Prev / Next */}
            <PostNav prev={adjacent.prev} next={adjacent.next} />

            {/* Related reads */}
            <RelatedPosts posts={related} />

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-zinc-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700
                             [@media(hover:hover)]:hover:text-zinc-950 transition-colors"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  View all posts
                </Link>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag.slug} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
