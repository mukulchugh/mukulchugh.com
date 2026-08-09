import { IconArrowLeft, IconCalendar, IconClock } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCover } from "@/components/blog/post-cover";
import { PostNav } from "@/components/blog/post-nav";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { RelatedPosts } from "@/components/blog/related-posts";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  getAdjacentPosts,
  getPostServer,
  getPostsServer,
  getRelatedPosts,
} from "@/lib/blog";
import { siteConfig } from "@/lib/data";
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
    return { title: "Post Not Found" };
  }

  return {
    alternates: {
      canonical: `/blog/${slug}`,
    },
    description: post.seo?.description || post.brief,
    openGraph: {
      description: post.brief,
      images: post.coverImage?.url ? [post.coverImage.url] : [],
      publishedTime: post.publishedAt,
      title: post.title,
      type: "article",
      url: `${siteConfig.siteUrl}/blog/${slug}`,
    },
    title: `${post.seo?.title || post.title} | ${siteConfig.name}`,
    twitter: {
      card: "summary_large_image",
      description: post.brief,
      images: post.coverImage?.url ? [post.coverImage.url] : [],
      title: post.title,
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
      image: post.author?.profilePicture || siteConfig.images.profileImage,
      name: post.author?.name || siteConfig.name,
    },
    dateModified: post.publishedAt,
    datePublished: post.publishedAt,
    description: post.brief,
    headline: post.title,
    image: post.coverImage?.url || siteConfig.images.ogImage,
    keywords: post.tags.map((tag) => tag.name).join(", "),
    mainEntityOfPage: {
      "@id": `${siteConfig.siteUrl}/blog/${slug}`,
      "@type": "WebPage",
    },
    publisher: {
      "@type": "Organization",
      logo: {
        "@type": "ImageObject",
        url: siteConfig.images.profileImage,
      },
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
        name: "Blog",
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

  const headings = post.headings ?? [];
  const hasTableOfContents = headings.length >= 2;

  return (
    <main className="w-full py-12 sm:py-20 lg:py-28 overflow-x-hidden">
      {/* Reading progress bar */}
      <ReadingProgress />

      {/* Structured Data */}
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        type="application/ld+json"
      />

      {/* Outer container — constrains horizontal width */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        {/* Back link */}
        <Link
          className="inline-flex items-center gap-2 py-2 text-[14px] text-muted-foreground
                     [@media(hover:hover)]:hover:text-foreground transition-colors mb-10"
          href="/blog"
        >
          <IconArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div
          className={cn(
            "grid items-start",
            hasTableOfContents &&
              "lg:grid-cols-[13rem_minmax(0,48rem)] lg:gap-x-12"
          )}
        >
          <header
            className={cn(
              "mb-10 max-w-3xl",
              hasTableOfContents && "lg:col-start-2"
            )}
          >
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
                "font-syne",
                "font-black text-foreground mb-6 leading-[1.08] tracking-tight break-words"
              )}
              style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)" }}
            >
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[12px] text-muted-foreground">
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
                  <span className="text-foreground/80 font-medium">
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

          <div
            className={cn(
              "mb-12 max-w-3xl",
              hasTableOfContents && "lg:col-start-2"
            )}
          >
            <PostCover hero interactive post={post} priority />
          </div>

          {hasTableOfContents && (
            <div className="lg:col-start-1 lg:row-start-3">
              <TableOfContents headings={headings} />
            </div>
          )}

          <div
            className={cn(
              "min-w-0 max-w-3xl",
              hasTableOfContents && "lg:col-start-2 lg:row-start-3"
            )}
          >
            {/* Article body */}
            {post.content?.html && (
              <article
                className={cn(
                  // Base prose setup
                  "prose prose-zinc dark:prose-invert max-w-none",
                  // Body text — 16px, 1.75 line-height
                  "prose-p:text-[16px] prose-p:leading-[1.8] prose-p:text-foreground/80",
                  // Headings — tight tracking, ink-dark
                  "prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground",
                  "prose-h2:text-[1.375rem] prose-h2:mt-10 prose-h2:mb-4",
                  "prose-h3:text-[1.125rem] prose-h3:mt-8 prose-h3:mb-3",
                  // Scroll margin so TOC jumps land below any fixed header
                  "[&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24",
                  // Links — subtle underline on hover
                  "prose-a:text-foreground/80 prose-a:no-underline prose-a:font-medium",
                  "[@media(hover:hover)]:prose-a:hover:underline [@media(hover:hover)]:prose-a:hover:text-foreground",
                  // Blockquotes — left ink border, warm bg
                  "prose-blockquote:border-l-2 prose-blockquote:border-border",
                  "prose-blockquote:bg-muted prose-blockquote:py-1 prose-blockquote:pr-4",
                  "prose-blockquote:rounded-r-md prose-blockquote:not-italic",
                  "prose-blockquote:text-muted-foreground",
                  // Inline code — light chip
                  "prose-code:bg-muted prose-code:text-foreground/90",
                  "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
                  "prose-code:text-[0.85em] prose-code:font-mono",
                  "prose-code:before:content-none prose-code:after:content-none",
                  // Code blocks — dark ink slab
                  "prose-pre:bg-[#111113] prose-pre:text-zinc-100",
                  "prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10",
                  "prose-pre:overflow-x-auto prose-pre:max-w-full",
                  "prose-pre:text-[0.85em] prose-pre:leading-relaxed",
                  // Images
                  "prose-img:rounded-xl prose-img:shadow-sm",
                  // Lists
                  "prose-li:text-[16px] prose-li:text-foreground/80",
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
                dangerouslySetInnerHTML={{ __html: post.content.html }}
              />
            )}

            {/* Prev / Next */}
            <PostNav next={adjacent.next} prev={adjacent.prev} />

            {/* Related reads */}
            <RelatedPosts posts={related} />

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80
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
                        className="text-xs"
                        key={tag.slug}
                        variant="outline"
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
      </div>
    </main>
  );
}
