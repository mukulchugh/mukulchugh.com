"use client";

import { WritingSection } from "@/components/blog/writing-section";
import type { Post } from "@/lib/blog";
import { useSectionInView } from "@/lib/hooks";

export default function BlogSection({ posts = [] }: { posts?: Post[] }) {
  const { ref } = useSectionInView("Blog", 0.2);
  return (
    <div
      className="w-full min-w-0 scroll-mt-24 py-6 sm:py-8"
      id="blog"
      ref={ref}
    >
      <WritingSection posts={posts} />
    </div>
  );
}
