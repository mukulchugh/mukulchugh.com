"use client";

import { createCodePlugin } from "@streamdown/code";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import type { BundledTheme, Components } from "streamdown";
import { Streamdown } from "streamdown";
import type { PostHeading } from "@/lib/blog";
import { cn } from "@/lib/utils";

// Flattens a heading's React children (which may contain nested elements
// like <strong>/<code> for formatted headings) down to plain text, the same
// shape lib/blog.ts's marked Renderer produces for PostHeading.text (inline
// markdown rendered, then HTML tags stripped).
function flattenToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(flattenToText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return flattenToText(node.props.children);
  }
  return "";
}

interface ArticleBodyProps {
  className?: string;
  headings: PostHeading[];
  markdown: string;
}

// A muted, low-saturation Shiki theme (not a loud rainbow VSCode-default)
// so code blocks read as a premium dark-ink slab that matches the site's
// established `prose-pre:bg-[#111113]` treatment. The same theme is used
// for both slots — Streamdown's [light, dark] pair normally toggles with
// the page's color scheme, but code blocks here are deliberately *always*
// dark regardless of the site's light/dark mode, exactly as they were
// before this migration.
const SHIKI_THEME: [BundledTheme, BundledTheme] = [
  "vitesse-dark",
  "vitesse-dark",
];

// Streamdown resolves the active Shiki theme from `plugins.code.getThemes()`
// when a code plugin is supplied, ignoring the top-level `shikiTheme` prop
// in that case — so the theme has to be baked into the plugin itself via
// `createCodePlugin`, not passed through `shikiTheme` alone.
const codePlugin = createCodePlugin({ themes: SHIKI_THEME });

/**
 * Renders a blog post's raw markdown via Streamdown.
 *
 * Streamdown has no rehype-slug equivalent — it does not generate heading
 * `id` attributes on its own. `components/blog/table-of-contents.tsx`
 * depends entirely on h2/h3 `id`s matching the `headings` array produced by
 * `lib/blog.ts`'s marked-based extraction (same slugify + dedup logic that
 * has always driven the TOC). IDs are matched by heading text rather than
 * render order/position: Streamdown lazily loads its code-block renderer
 * behind a Suspense boundary, and a suspend/retry re-invokes sibling
 * component overrides (including h2/h3) an extra time within the same
 * commit — a position counter drifts out of sync when that happens, since
 * React only guarantees components are pure functions of their props, not
 * that they're called exactly once. Text lookup has no such state to drift.
 */
export function ArticleBody({
  className,
  headings,
  markdown,
}: ArticleBodyProps) {
  const idByText = new Map(headings.map((h) => [h.text, h.id]));
  const headingId = (children: ReactNode): string | undefined =>
    idByText.get(flattenToText(children).trim());

  const components: Components = {
    h2: ({ children, node: _node, ...props }) => (
      <h2 {...props} id={headingId(children)}>
        {children}
      </h2>
    ),
    h3: ({ children, node: _node, ...props }) => (
      <h3 {...props} id={headingId(children)}>
        {children}
      </h3>
    ),
  };

  return (
    <Streamdown
      className={cn(className)}
      components={components}
      mode="static"
      plugins={{ code: codePlugin }}
      shikiTheme={SHIKI_THEME}
    >
      {markdown}
    </Streamdown>
  );
}
