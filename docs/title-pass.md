# Portfolio title pass

## Plan and execution

Ten independent review assignments preceded a coordinated implementation:
titles_home_hero, titles_featured, titles_writing, titles_articles,
titles_projects, titles_experience, titles_dialogs, titles_errors,
titles_navigation, and titles_final_hierarchy.

Impeccable's typesetting and clarification guidance informed the pass. Existing
Geist typography, artwork, tile materials, buttons and navigation behavior stay
intact. No new component abstraction or dependency was needed.

## Changes

- Consistent title weight, tracking and readable line heights across homepage,
  article index/detail, project detail, experience and dialogs.
- Natural wrapping replaces compressed CTA text and forced single-line project
  titles. Article navigation exposes full titles.
- Writing index: “Notes from the work.” Project list: “More projects”.
- Clearer project overview headings and error titles, without changing facts.
- Semantic featured-project section heading and experience company headings.
- Preserved approved hero wording, published article titles, project names,
  slugs, article heading anchors and work-history facts.

## Verification

- TypeScript and all seven existing UI check suites passed.
- HTTP smoke checks passed for all 35 pages and a missing-article 404.
- Targeted formatting corrections applied after lint inspection.
- Current browser screenshots, responsive clipping and visual contrast remain
  unverified because the browser connection is unavailable.
- User-owned development server left running and untouched. No deployment.
