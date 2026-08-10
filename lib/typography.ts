/**
 * Canonical fluid type scale.
 *
 * These are the only `clamp()` display-heading sizes that should exist in
 * the app. Before adding a new one, check whether an existing level fits —
 * the whole point of this file is that "page h1" and "section h2" are each
 * defined exactly once, so every page shares the same hierarchy instead of
 * drifting per-component.
 *
 * Levels, largest to smallest:
 *  - HERO_TITLE    — the one-off homepage hero name (profile-tile). Bigger
 *                     than a page h1 on purpose; this is the single largest
 *                     text in the app.
 *  - PAGE_TITLE     — page-level <h1>: blog post title, project detail
 *                     title, /blog index title. These must always match —
 *                     they're the same semantic level on different routes.
 *  - SECTION_TITLE  — section-level <h2>, e.g. "Writing & notes" /
 *                     "More things I've built". Owned by SectionHeader;
 *                     any hand-rolled section heading should match this.
 *  - TILE_TITLE     — large CTA-style heading confined to a bento tile
 *                     (currently only the contact CTA tile). Sits between
 *                     PAGE_TITLE and SECTION_TITLE because it's an
 *                     oversized headline but constrained to a tile's width
 *                     rather than the full page.
 *  - TILE_DISPLAY   — oversized decorative title text used as background
 *                     art inside a bento tile (aria-hidden, not a real
 *                     heading). Kept separate from TILE_TITLE because it's
 *                     decorative, not semantic.
 *
 * Card/tile titles (project cards, blog cards), body copy, and eyebrow/meta
 * labels are small enough to stay as Tailwind utilities / the `.ui-label`
 * class (see app/globals.css) rather than clamp() constants here.
 */

export const HERO_TITLE = "clamp(2rem, 8vw, 4.25rem)";

export const PAGE_TITLE = "clamp(1.6rem, 5vw, 3rem)";

export const SECTION_TITLE = "clamp(1.4rem, 3.4vw, 2.1rem)";

export const TILE_TITLE = "clamp(1.6rem, 4.2vw, 2.6rem)";

export const TILE_DISPLAY = "clamp(16px, 3vw, 24px)";
