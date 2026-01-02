import { getPostServer, getPostsServer } from "@/lib/hashnode";
import { siteConfig } from "@/lib/data";
import { syne } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600; // Revalidate every hour

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for popular posts
export async function generateStaticParams() {
  const { posts } = await getPostsServer(20);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostServer(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
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
  const post = await getPostServer(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="w-full py-20 lg:py-32">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Back to Blog */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag.slug} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className={cn(
              syne.className,
              "text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight"
            )}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {post.author && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.profilePicture} />
                  <AvatarFallback>
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground font-medium">
                  {post.author.name}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt}>{formattedDate}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTimeInMinutes} min read</span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage?.url && (
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-10">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        {/* Content - Using Tailwind Typography for out-of-the-box styling */}
        {post.content?.html && (
          <div
            className={cn(
              "prose prose-lg max-w-none",
              // Dark mode
              "dark:prose-invert",
              // Headings
              "prose-headings:font-semibold prose-headings:tracking-tight",
              // Links
              "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
              // Images
              "prose-img:rounded-xl prose-img:shadow-md",
              // Code blocks
              "prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-border",
              // Inline code
              "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
              // Blockquotes
              "prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg",
              // Tables
              "prose-table:border prose-table:border-border prose-th:bg-muted prose-td:border prose-td:border-border prose-th:border prose-th:border-border",
              // Lists
              "prose-li:marker:text-muted-foreground"
            )}
            dangerouslySetInnerHTML={{ __html: post.content.html }}
          />
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              View all posts
            </Link>

            {/* Tags */}
            <div className="flex items-center gap-4">
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
          </div>
        </footer>
      </article>
    </main>
  );
}
