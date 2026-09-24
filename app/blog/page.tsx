import { BlogIndex } from "@/components/blog/blog-index";
import { getAllPosts } from "@/lib/blog";
import { staticMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const metadata = staticMetadata("/blog");

export default function BlogPage() {
  return <BlogIndex posts={getAllPosts()} />;
}
