"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconBook } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { syne } from "@/lib/fonts";
import { useSectionInView } from "@/lib/hooks";
import AnimatedCardStack from "@/components/ui/animated-card-stack";
import type { Post } from "@/lib/hashnode";
import { fetchPosts } from "@/lib/hashnode";

export default function BlogSection() {
  const { ref } = useSectionInView("Blog", 0.3);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const { posts: fetchedPosts } = await fetchPosts(6);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  return (
    <section
      ref={ref}
      id="blog"
      className="scroll-mt-28 mb-28 sm:mb-40 w-full max-w-4xl mx-auto px-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Title and Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#dd7bbb]/10 border border-[#dd7bbb]/20">
              <IconBook className="h-5 w-5 text-[#dd7bbb]" />
            </div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Blog
            </span>
          </div>

          <h2
            className={cn(
              syne.className,
              "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
            )}
          >
            Thoughts, ideas &{" "}
            <span className="bg-gradient-to-r from-[#dd7bbb] via-[#d79f1e] to-[#5a922c] bg-clip-text text-transparent">
              insights
            </span>
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md">
            I write about web development, software engineering, and the tech
            industry. Sharing my learnings and experiences along the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/blog"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-all"
            >
              View all posts
              <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Right side - Animated Card Stack */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-[420px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
            </div>
          ) : (
            <AnimatedCardStack posts={posts} />
          )}
        </motion.div>
      </div>
    </section>
  );
}
