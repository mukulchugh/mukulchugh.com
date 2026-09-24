# Project slider prototypes

Route: `/prototype/project-slider`. Development-only, noindex, returns 404 in production like the existing prototype routes. The selected handoff is now also integrated into the homepage via the shared `components/bento/project-slider.tsx` component.

Two selectable implementations share the owner-curated seven-project selection, generated illustrative covers, three-card queue and controls. Order: OpenKVM, Brik, ctxr, Setu, Quivly Skills, Altr, Tethr. The full collection remains separate. Setu has only an owner-approved high-level overview, with no internal details or repository link.

- A: card handoff, measured start/end geometry, transform/opacity animation.
- B: editorial relay, feature frame remains in place while art translates and fades.

Desktop retains a large left feature and three right cards. Mobile stacks the feature above three full-width compact cards. Missing project art is rendered as a text-led card, not fabricated imagery. Existing art remains illustrative. Initial featured descriptions reuse the homepage summaries.

Eight-second autoplay pauses for hover, focus, hidden tabs and offscreen state. Reduced motion disables autoplay and spatial animation. Resize/visibility changes settle an in-progress transition. Previous/next, queue promotion, project links and pause/resume use native links or the existing shared Button. Rapid input is ignored while transitioning. Promotion moves focus to the stable Next control to avoid losing it as the source card changes role.

Verification: TypeScript and scoped lint passed. Browser checks exercised both variants at 1440, 768, 390 and 320 pixels, checked exactly four active cards, no horizontal overflow, next/previous, autoplay, hover pause and reduced motion. Captures include desktop, narrow mobile and mid-transition. No browser exceptions were observed. Runnable check: `node .scratch/project-slider-concepts/check-prototypes.mjs` against the user's port 3000 server.

Limitations: the comparison route remains a development prototype. The homepage uses only the chosen handoff, without prototype headings or variant switches. The curated queue preserves only public-facing descriptions, including limited descriptions of private work. No cross-device frame-rate guarantee or production build is claimed.

GSAP React/timeline/performance and animation-systems guidance informed cleanup, scoped transforms, text crossfades, reduced motion and visibility-based autoplay. No dependency was installed and no dev server was started or restarted.

## Single-card morph refinement

The handoff keeps the incoming keyed article at full opacity and FLIP-transforms that same DOM node from its queue rectangle into the featured rectangle. There is no cloned flight card or replacement-card crossfade. Copy reveals near arrival to avoid stretched text. The previous feature recedes underneath and queue cards follow with a short stagger. Only transforms and opacity animate; CSS borders, rounded clipping, and object-fit layouts remain present. The border and corner geometry scales with the shell during the morph, then settles to the original 1px/14px values.

`check-morph-frames.mjs` verifies DOM identity, full opacity, initial geometry, growth, and frozen desktop/mobile screenshots through the prototype's `?t=` harness. `profile-motion.mjs` records CDP events and rAF intervals. A warmed desktop Chromium run measured zero Layout/Paint events in the sampled 550ms steady-motion window, a 16.67ms average interval and 17.4ms maximum. Initial layout/rasterization and final cleanup are outside that window; this is not a cross-device 60fps guarantee. Eager image loading prevents lazy-loading paints during travel. Temporary compositor hints clear when idle.

Standalone simplified WAAPI timing fixture: `.scratch/project-slider-concepts/handoff-motion.html`. Actual application validation remains the primary evidence.

## Homepage integration

`getShowcaseProjects()` supplies identical curated content to the homepage and prototype without filesystem access in the client bundle. The homepage replaces its former three static featured tiles, keeps the projects anchor and section tracking, and uses the existing seven-item selection. The frame-freezing query is enabled only by the prototype wrapper.

`node .scratch/project-slider-concepts/check-home.mjs` passed for light/dark at 1440, 390 and 320px: all seven projects, four visible cards, project destinations, no prototype copy, autoplay, hover pause, previous navigation, reduced motion, zero horizontal overflow and no browser page errors. TypeScript, scoped formatting and the 26-project model check also passed. The user's server was not restarted; nothing was deployed.
