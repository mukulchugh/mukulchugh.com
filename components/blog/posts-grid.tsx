"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import Link from "next/link";
import { motion } from "motion/react";
import type { Post } from "@/lib/blog";
import { PostCover } from "@/components/blog/post-cover";

interface PostsGridProps {
  posts: Post[];
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
        <PostCover post={post} priority={index === 0} />

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

export function PostsGrid({ posts }: PostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}
