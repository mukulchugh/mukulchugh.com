// ============================================
// LOCAL MARKDOWN BLOG ENGINE
// Posts live in /content/blog/*.md with frontmatter.
// No external API — fully code-managed and built at request/build time.
// ============================================

import fs from "fs";
import matter from "gray-matter";
import { marked, Renderer } from "marked";
import path from "path";
import { siteConfig } from "./data";
import type { Post, PostHeading, PostsResponse } from "./types/index";

export type { PageInfo, Post, PostHeading, PostsResponse } from "./types/index";

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

/**
 * Build a marked Renderer that injects id attributes on h2/h3 and
 * simultaneously populates a headings array (side-effect via closure).
 */
function buildRenderer(headings: PostHeading[]): Renderer {
  const renderer = new Renderer();
  const seen: Record<string, number> = {};

  renderer.heading = ({
    text,
    depth,
  }: {
    text: string;
    depth: number;
  }): string => {
    // Strip any HTML tags that marked might nest inside the heading text
    const plainText = text.replace(/<[^>]+>/g, "");

    if (depth === 2 || depth === 3) {
      let id = slugifyHeading(plainText);
      // Deduplicate: append -2, -3, … on collision
      if (seen[id] === undefined) {
        seen[id] = 1;
      } else {
        seen[id]++;
        id = `${id}-${seen[id]}`;
      }
      headings.push({ id, level: depth as 2 | 3, text: plainText });
      return `<h${depth} id="${id}" class="scroll-mt-24">${text}</h${depth}>\n`;
    }
    return `<h${depth}>${text}</h${depth}>\n`;
  };

  return renderer;
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

  let html: string | undefined;
  let headings: PostHeading[] | undefined;

  if (withContent) {
    const collectedHeadings: PostHeading[] = [];
    const renderer = buildRenderer(collectedHeadings);
    html = marked.parse(content, { async: false, renderer }) as string;
    headings = collectedHeadings;
  }

  return {
    author: {
      name: fm.author || siteConfig.name,
      profilePicture: siteConfig.images.profileImage,
    },
    brief: fm.brief || content.trim().slice(0, 180).replace(/\n+/g, " "),
    content:
      withContent && html !== undefined
        ? { html, markdown: content }
        : undefined,
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
