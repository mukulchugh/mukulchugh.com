# Audit follow-up

Implemented against the 2026-09-23 screenshot audit on `fix/sitewide-design-consistency`. The original audit pass stayed local; the release follow-up below records subsequent owner-approved changes.

## Owner override

The mobile game stays exactly as it was. F11 was an editorial hierarchy suggestion, not a gameplay defect. No Rebound files, homepage ordering, game dimensions, orientation, or scoreboard labels were changed.

## Changes

- F1: Writing lead artwork and title occupy separate mobile regions; the large cover remains.
- F2–F3: Pagination focuses and scrolls to refreshed results. Topic and page persist on the browser history entry, including Writing inside dock windows.
- F4: Mobile contents collapses before heading navigation, preserving hash, focus, and reduced-motion behavior.
- F5–F7: Overview links dismiss same-page windows, destination changes reset scroll, and responsive dock measurements update window placement and reverse-genie geometry.
- F8: The dock glass is explicitly clipped to its pill outline. A single diffusion pass and softer refractive rim replace the nested blur layer; refraction remains enabled in supported browsers.
- F9–F10: Blog actions reuse shared button styling; badges use explicit 6px corners; project technology labels and dock tooltips use 12px. Game labels are intentionally unchanged.
- F12: Project indexes use concise summaries while detail descriptions remain intact. Experience keeps the first contribution visible and exposes remaining details through native disclosures.
- F13: A shared Zenduty chapter supplies founding-team, progression, and acquisition copy across existing surfaces. Metadata now matches the visible “Builder by design” tagline.
- Article code blocks clear floated diagrams to retain full reading width. Related project links are limited to three plus All projects.

## Verification

- Production build passed, including TypeScript and 61 generated pages.
- All seven UI suites passed.
- Focused lint/format checks and git diff whitespace checks passed.
- HTTP checks passed for 44 pages plus missing-article handling.
- All 48 public routes passed at 1440px/light and 320px/dark: shared header, CTA, dock, heading font, horizontal overflow, and runtime checks.
- Writing browser regression passed in normal and reduced motion: browser Back, pagination alignment/focus, mobile TOC, and embedded dock filters.
- Experience browser regression passed at desktop/mobile sizes in light/dark themes: preserved details, keyboard disclosure, focus, and overflow.
- Dock browser regression passed in light/dark and both motion modes: overview dismissal, destination scroll, resize, and reverse close. The first run exposed an early resize measurement; ResizeObserver plus frame scheduling resolved it.
- Sixteen full-page captures are in `.scratch/audit-fixes/`. Representative mobile Writing/Projects, desktop Experience/article, and resized dock screenshots were visually inspected.

The first production build failed under sandbox worker-port/font restrictions. A subsequent attempt reused cached failures. The production Turbopack cache was preserved in `.scratch/turbopack-cache-before-audit-build`; a clean approved build passed. The owner’s dev server and `.next/dev` cache were not stopped or replaced.

Impeccable informed the shared-control, readability, and progressive-disclosure refinements. A narrow `broken-image` detector exception was recorded for `scripts/check-ui.ts`, where an HTML-parsing test regex was misread as an image element.

## Remaining boundaries

Chromium verification is not Safari/Firefox, real-device performance, or screen-reader certification. Existing factual metrics and career dates were preserved, not independently certified. Recommendations requiring authentic product screenshots, new article evidence, or owner-provided material remain content follow-ups; no evidence was fabricated.

## Release follow-up

The owner subsequently approved fullscreen gameplay and slider improvements. These are additions after the original mobile-game preservation decision above, not changes made by that audit pass.

- Fullscreen keeps the same mounted game and match state, with branded pause/restart/exit controls, portrait/landscape layouts, native fullscreen where supported, and a modal fallback. Stale resize callbacks are ignored. The collapsed game does not expose a dialog role.
- Slider text travels with its card, with proportional text during resizing and a reversible handoff. Up advances and Down returns to the previous project on all viewport sizes.
- Carousel scroll anchoring is disabled locally. A touch regression reproduces both navigation actions and checks that the page scroll position does not change.
- Dock refraction remains enabled in supported browsers. Explicit pill clipping, a reduced displacement strength, and one diffusion pass replace the nested blur treatment.
- Fresh release validation passed: production build with 61 generated pages, all seven UI suites, TypeScript, slider start/mid/end frames in both directions, mobile scroll stability, fullscreen lifecycle checks, and dock lifecycle checks in both themes and motion settings.
- Original raw artwork, research files, and unrelated agent configuration are excluded from this release.

Additional browser commands: `node scripts/check-slider-motion.mjs`, `node scripts/check-slider-scroll.mjs`, `node scripts/check-rebound-fullscreen.mjs`, and `node scripts/check-dock-regressions.mjs`. They use the owner's existing `localhost:3000` server; none starts a server. Screenshot evidence is kept locally in `.scratch/`.
