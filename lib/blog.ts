// ============================================
// LOCAL MARKDOWN BLOG ENGINE
// Posts live in /content/blog/*.md with frontmatter.
// No external API — fully code-managed and built at request/build time.
// ============================================

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { siteConfig } from "./data";
import type { Post, PostsResponse } from "./types/index";

export type { Post, PageInfo, PostsResponse } from "./types/index";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function readTimeFromText(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

interface Frontmatter {
  title?: string;
  slug?: string;
  brief?: string;
  publishedAt?: string;
  tags?: Array<string | { name: string; slug: string }>;
  coverImage?: string;
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
  draft?: boolean;
}

function fileToPost(file: string, withContent: boolean): Post | null {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  if (fm.draft) return null;

  const slug = fm.slug || file.replace(/\.mdx?$/, "");
  const tags = (fm.tags || []).map((t) =>
    typeof t === "string"
      ? { name: t, slug: t.toLowerCase().replace(/\s+/g, "-") }
      : t
  );

  return {
    id: slug,
    title: fm.title || slug,
    slug,
    brief: fm.brief || content.trim().slice(0, 180).replace(/\n+/g, " "),
    publishedAt: fm.publishedAt || new Date(0).toISOString(),
    readTimeInMinutes: readTimeFromText(content),
    coverImage: fm.coverImage ? { url: fm.coverImage } : null,
    author: {
      name: fm.author || siteConfig.name,
      profilePicture: siteConfig.images.profileImage,
    },
    tags,
    content: withContent
      ? { html: marked.parse(content, { async: false }) as string, markdown: content }
      : undefined,
    seo:
      fm.seoTitle || fm.seoDescription
        ? { title: fm.seoTitle || fm.title || slug, description: fm.seoDescription || fm.brief || "" }
        : undefined,
  };
}

function readAll(withContent = false): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => fileToPost(f, withContent))
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

// All posts (no pagination — a personal blog fits on one page).
export function getAllPosts(): Post[] {
  return readAll(false);
}

// Kept API-compatible with the old server helpers so pages need minimal changes.
export async function getPostsServer(
  first: number = 100,
  _after?: string
): Promise<PostsResponse> {
  const posts = readAll(false).slice(0, first);
  return { posts, pageInfo: { endCursor: null, hasNextPage: false } };
}

export async function getPostServer(slug: string): Promise<Post | null> {
  const posts = readAll(true);
  return posts.find((p) => p.slug === slug) || null;
}
