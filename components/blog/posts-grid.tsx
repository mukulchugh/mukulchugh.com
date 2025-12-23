"use client";

import { usePosts } from "@/lib/use-blog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { PostsResponse, Post } from "@/lib/hashnode";

interface PostsGridProps {
  initialData: PostsResponse;
}

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

function PostCard({ post, index }: { post: Post; index: number }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.article
      variants={fadeInAnimationVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      custom={index}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col gap-4 hover:opacity-75 cursor-pointer transition-opacity"
      >
        {/* Cover Image */}
        {post.coverImage?.url ? (
          <div className="relative bg-muted rounded-xl aspect-video overflow-hidden">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 896px"
              priority={index === 0}
            />
          </div>
        ) : (
          <div className="bg-muted rounded-xl aspect-video" />
        )}

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-4">
          {post.tags.length > 0 && (
            <Badge variant="secondary">{post.tags[0].name}</Badge>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {post.author && (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.author.profilePicture} />
                  <AvatarFallback>
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground">{post.author.name}</span>
                <span>·</span>
              </>
            )}
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{post.readTimeInMinutes} min read</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <h2
            className={cn(
              syne.className,
              "text-2xl md:text-3xl tracking-tight font-semibold text-foreground"
            )}
          >
            {post.title}
          </h2>
          <p className="text-muted-foreground text-base line-clamp-2">
            {post.brief}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

export function PostsGrid({ initialData }: PostsGridProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts(initialData);

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (isLoading && allPosts.length === 0) {
    return (
      <div className="flex flex-col gap-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="animate-pulse rounded-xl bg-muted aspect-video" />
            <div className="animate-pulse rounded bg-muted h-4 w-32" />
            <div className="animate-pulse rounded bg-muted h-8 w-3/4" />
            <div className="animate-pulse rounded bg-muted h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Posts List */}
      <div className="flex flex-col gap-12">
        {allPosts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
