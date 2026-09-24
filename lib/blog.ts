// ============================================
// LOCAL MARKDOWN BLOG ENGINE
// Posts live in /content/blog/*.md with frontmatter.
// No external API — fully code-managed and built at request/build time.
// ============================================

import fs from "fs";
import matter from "gray-matter";
import path from "path";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { siteConfig } from "./data";
import type { Post, PostHeading, PostsResponse } from "./types/index";

export type { Post, PostHeading } from "./types/index";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function readTimeFromText(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

interface Frontmatter {
  author?: string;
  brief?: string;
  coverImage?: string;
  draft?: boolean;
  publishedAt?: string;
  seoDescription?: string;
  seoTitle?: string;
  slug?: string;
  tags?: Array<string | { name: string; slug: string }>;
  title?: string;
  updatedAt?: string;
}

/**
 * Slugify heading text to a stable HTML id:
 * lowercase, spaces → hyphens, strip non-alphanumeric/hyphen chars, collapse hyphens.
 */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

const markdownParser = unified().use(remarkParse).use(remarkGfm);

/** Use Streamdown's Markdown grammar and source offsets, never render order.
 * Raw HTML headings are intentionally outside the Markdown TOC contract.
 */
export function getPostHeadings(markdown: string): PostHeading[] {
  const headings: PostHeading[] = [];
  const used = new Set<string>();
  const tree = markdownParser.parse(markdown);
  type Node = (typeof tree)["children"][number];
  function textOf(node: Node): string {
    if (node.type === "html") return "";
    if ("children" in node)
      return node.children.map((child) => textOf(child as Node)).join("");
    if ("alt" in node) return node.alt ?? "";
    return "value" in node ? node.value : "";
  }
  function visit(node: Node) {
    if (node.type === "heading" && (node.depth === 2 || node.depth === 3)) {
      const text = textOf(node).trim();
      const base = slugifyHeading(text) || "section";
      let id = base;
      for (let suffix = 2; used.has(id); suffix++) id = `${base}-${suffix}`;
      used.add(id);
      headings.push({
        id,
        level: node.depth,
        offset: node.position!.start.offset!,
        text,
      });
    }
    if ("children" in node)
      node.children.forEach((child) => visit(child as Node));
  }
  tree.children.forEach(visit);
  return headings;
}

function fileToPost(file: string, withContent: boolean): Post | null {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  if (fm.draft) {
    return null;
  }

  const slug = fm.slug || file.replace(/\.mdx?$/, "");
  const tags = (fm.tags || []).map((t) =>
    typeof t === "string"
      ? { name: t, slug: t.toLowerCase().replace(/\s+/g, "-") }
      : t
  );

  const headings = withContent ? getPostHeadings(content) : undefined;

  return {
    author: {
      name: fm.author || siteConfig.name,
      profilePicture: siteConfig.images.profileImage,
    },
    brief: fm.brief || content.trim().slice(0, 180).replace(/\n+/g, " "),
    content: withContent ? { markdown: content } : undefined,
    coverImage: fm.coverImage ? { url: fm.coverImage } : null,
    headings,
    id: slug,
    publishedAt: fm.publishedAt || new Date(0).toISOString(),
    readTimeInMinutes: readTimeFromText(content),
    seo:
      fm.seoTitle || fm.seoDescription
        ? {
            description: fm.seoDescription || fm.brief || "",
            title: fm.seoTitle || fm.title || slug,
          }
        : undefined,
    slug,
    tags,
    title: fm.title || slug,
    updatedAt: fm.updatedAt,
  };
}

function readAll(withContent = false): Post[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }
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
  first = 100,
  after?: string
): Promise<PostsResponse> {
  void after;
  const posts = readAll(false).slice(0, first);
  return { pageInfo: { endCursor: null, hasNextPage: false }, posts };
}

export async function getPostServer(slug: string): Promise<Post | null> {
  const posts = readAll(true);
  return posts.find((p) => p.slug === slug) || null;
}

/**
 * Returns the previous and next post relative to the given slug,
 * in date-descending order (newest first).
 * "prev" = the post published AFTER (more recent),
 * "next" = the post published BEFORE (older).
 * This matches the conventional blog UX: prev = newer, next = older.
 */
export function getAdjacentPosts(slug: string): {
  prev: Post | null;
  next: Post | null;
} {
  const posts = readAll(false);
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) {
    return { next: null, prev: null };
  }
  return {
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
    prev: idx > 0 ? posts[idx - 1] : null,
  };
}

/**
 * Returns up to `limit` related posts:
 * 1. Posts sharing ≥1 tag with the current post (highest overlap first).
 * 2. Falls back to most-recent posts if not enough tag matches.
 * Always excludes the current post.
 */
export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const posts = readAll(false);
  const current = posts.find((p) => p.slug === slug);
  if (!current) {
    return posts.filter((p) => p.slug !== slug).slice(0, limit);
  }

  const currentTagSlugs = new Set(current.tags.map((t) => t.slug));
  const others = posts.filter((p) => p.slug !== slug);

  // Score by tag overlap
  const scored = others.map((p) => {
    const overlap = p.tags.filter((t) => currentTagSlugs.has(t.slug)).length;
    return { overlap, post: p };
  });

  // Sort: highest tag overlap first, then by date (already newest-first from readAll)
  scored.sort((a, b) => b.overlap - a.overlap);

  return scored.slice(0, limit).map((s) => s.post);
}
