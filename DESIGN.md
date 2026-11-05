# Portfolio design decisions

## Authority

The approved pack in `/Users/mukulchugh/portfolio-design-pack` establishes the editorial bento direction, page-specific artwork and large article covers. Later explicit owner decisions override conflicting details in the composite previews. Canonical project/article content overrides incidental text inside generated art. Historical critique reports do not override these decisions.

## Current owner decisions

Latest typography override: Syne for display, section, article, project, and dialog titles; Geist for body copy, navigation, labels, and badges. Semantic headings share the heading role; label-styled headings retain Geist. The header shows the logo and existing tagline without the visible Mukul Chugh wordmark; the logo link retains its accessible home name. This supersedes earlier Geist-only title decisions.

Latest tile refinement: subtle satin-glass/embossed appearance through a static, low-opacity diagonal surface glaze and near-opaque neutral fills. Keep actual uniform 1px borders and no tile box shadows. The glaze covers neutral and artwork-led tiles without replacing their art/accent backgrounds. No blur or animation was added to tiles, and buttons/dock are unchanged. Reduced transparency removes the glaze and restores opaque neutral fills; forced colors removes it. This supersedes the solid-only tile finish below, not its real-border requirement. See docs/tile-material-pass.md for the ten-agent review and verification limits.

Tile surface correction: all bento tiles and shared Cards use solid backgrounds, 14px corners and real, uniform 1px solid borders in the border token. No inset highlights or box shadows simulate their edges. This supersedes the shared Liquid Glass treatment for content tiles; the dock and floating overlays retain glass.

Button correction: primary actions use solid accent fills, secondary actions neutral fills, outline actions visible borders, and ghost/icon actions no bevel or backdrop blur. All share Geist and 10px corners, with 44px default targets and 48px homepage contact actions. Removed the global glass-control treatment and contact-button glow after the owner rejected their appearance. Glass remains on surrounding surfaces. Source checks passed; browser verification remains pending.

Latest typography override: Geist is the single family for titles, body and navigation across the site. This supersedes the earlier Syne pairing below. Heading size and weight preserve hierarchy; dock labels remain uppercase with 0.12em tracking. Syne loading has been removed.

Labels and badges now share Geist 12px/500, 1.5 line height, uppercase and 0.12em tracking. The shared ui-label and bento-label roles cover section labels, topic filters, project tags, navigation and editorial captions; ordinary prose, titles and code keep their natural casing. Badges use 6px corners, 10px horizontal/4px vertical padding and restrained fills instead of layered gloss. Long badges wrap. This supersedes the earlier homepage sentence-case label decision. Runtime visual verification is pending browser reconnection.

- Main headline: “Creating digital experiences for humans.”
- Positioning: “Engineer by craft. Builder by instinct.” Approved after rejecting “Engineer turned generalist.”
- Symbol navigation mark, illustrated portrait and actual brand marks.
- Retain large editorial covers; do not shrink writing into generic cards.
- Smaller, readable headings, softer card corners and improved section padding.
- Preserve real content and private/public project boundaries. Factual corrections remain unapplied review drafts.

## Layout and type

### Homepage feedback pass, 2026-09-20

The owner's narrated homepage review supersedes the initial pack for this route. Homepage titles consistently use Syne; Geist handles descriptions, labels and controls. Descriptions use a compact 14–16px scale. Manrope was considered, then the owner steered back toward Syne. Header positioning is one desktop line: “Engineer by craft. Builder by design.” Other routes remain outside this pass.

The portrait has a circular crop. Decorative section numbers, Product/Code/People/Runtime, Build/Learn/Ship, the curiosity caption and the narrow typographic filler tile are removed. About and Experience reuse Base UI dialogs; all experience roles are in one keyboard-scrollable tile. Writing retains two artwork-led features and adds four recent links. The additional project index shows six rows, expandable to fourteen. The homepage contact tile is 460–480px tall before booking, uses full-width rounded controls and a sequential content transition without scaling text. Reduced motion remains static.

The world map adapts Aceternity's premade React composition using precomputed dotted-map geography and existing Motion. Source/license attribution is in components/bento/world-map.tsx; dotted-map is development-only. No new animation library or generated artwork was needed.

Syne is the expressive display face. Geist handles reading text, controls and project headings. Shared surfaces use 14px corners and 12px grid gutters. About, Experience, Writing and More Projects use 20–32px responsive inner padding. Featured artwork cards have their own spacing so text remains separate from the composition.

The dense featured-project arrangement begins at 1024px. Below that, OpenKVM receives a full row and smaller projects use roomy side-by-side cards where space permits, then stack on narrow screens. Mobile articles reserve separate cover space. Long-article diagrams float beside continuing prose on larger screens, clear at section headings and stack on mobile. Related articles and adjacent navigation use the full content region, outside the narrow reading/TOC columns.

The footer reserves the existing dock-clearance token at every breakpoint. Controls reuse Base UI and Motion. Reduced-motion mode disables physical transitions and smooth scrolling. No additional animation library was added.

## Assets and delivery

### Shared Liquid Glass material

The owner's supplied Tahoe demos and https://21st.dev/community/components/s/liquid-glass now guide shared UI surfaces. Existing Base UI controls remain authoritative; no Radix substitution or additional rendering library was introduced. Cards/bento surfaces use tinted material and edge highlights, floating dialogs/popovers/tooltips/dock use backdrop blur, and buttons/badges use matching bevels. Reading tiles avoid nested backdrop filters; project artwork and intentional accent backgrounds remain intact. Geist and uppercase tracked labels remain unchanged.

This implementation is CSS material, not the pasted SVG/WebGL background-image refraction. The sample's first-button-only coordinate loop, shared displacement state, fixed filter IDs in its second variant, incomplete ref handling and GPU lifecycle concerns are not shipped. Opaque/reduced-transparency and forced-color fallbacks are included. TypeScript and all six UI checks pass; live browser appearance, contrast over varying backdrops, focus flows and performance remain unverified pending a connected browser. Do not treat this as pixel-identical native Tahoe rendering.

### Liquid Glass navigation dock

The shared navigation dock now follows the owner's macOS Liquid Glass direction: a translucent blurred tray, reflective icon tiles, active-section dots, and proximity-based spring magnification using existing Motion. All six destinations remain available, with accessible labels and Base UI tooltips. Mobile retains the compact popover navigation. Reduced motion disables magnification; reduced transparency and unsupported blur use an opaque surface. The effect is a CSS glass interpretation, not native optical refraction. Source reference: https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/

The subsequent owner refinement makes this quieter: a single satin-glass tray without individual icon tiles, 20px monochrome icons in 44px targets, 3px active dots, and restrained 1.12x/3px magnification. The desktop tray is approximately 288px wide and 54px tall, with lower-saturation glass and softer elevation.

The dock tray uses its own clearer material (62% light / 70% dark tint), fine inner edge highlights and a compact shadow; menu panels retain the stronger readable tint. Design-taste-frontend informed this restrained material pass, with the owner's subtle-motion preference overriding the skill's animated defaults. Reduced-transparency mode restores an opaque tray.

TypeScript and UI checks passed; live visual and pointer verification remain pending because no browser is connected in this session. No dev-server operations were performed.

Original artwork remains in the pack. Generated interface pictures are illustrative concepts, not evidence of actual product screens. Five precompressed WebP derivatives are retained in `delivery/` and served directly for artwork whose AVIF optimization requests stalled during verification. Their hashes, source relationships and encoding settings are documented in `docs/artwork-provenance.md` and the pack's delivery README.

## Verification boundary

Use `docs/recovery-checkpoint.md` for the latest route/viewport evidence, behavior checks and build snapshot. A successful build is not visual approval. Reference-size and mobile screenshots have been reviewed, but original composite pixel identity is not claimed. Keep outstanding discrepancies explicit rather than treating this document as a completion certificate.

## Isolated story prototype, 2026-09-28

Owner direction update, 29 September 2026: the story flows vertically on desktop, tablet and phone. Inward/outward moves and local camera arcs provide depth within that vertical progression. Desktop and portrait keep separately authored framing and protected reading regions. This supersedes the earlier sideways desktop direction in the contract, storyboard and high-fidelity plan. Runtime conversion remains pending; the implementation and verification notes below describe the existing prototype.

The `/story` route is a separate motion prototype within the existing portfolio. It reuses the angular M asset, Syne titles, Geist text and controls, and the shared glass dock material. Its pale stage, restrained warm accents, 74px desktop title cap and responsive story controls are local rules. They do not replace the bento system or other routes. Global records above remain intact; no missing design sidecar is generated in this scoped revision.

The current implementation spans all 23 years from 2004–2026 through 39 semantically identified beats, 12 chapters and seven public website captures. Story selection remains open against the owner's raw memories: 39 is neither a target cap nor a final approved script. The reading note distinguishes recollection, approximate dates and public evidence. Quivly is the founding engineer/first engineering hire role; HeroApp and Beximo are co-founded ventures. HuntIT and SPARK are physical events, separate from later online-fest work; SPARK has no invented exact calendar year. The HeroApp beat no longer presents the unrelated portfolio capture as its source. Tethr is a shared planning workspace for people and their existing AI agents, in private alpha. Altr and Tethr retain existing project links and stated stages. The ending offers project/contact/restart actions, then closes with the Dad callback.

Desktop expands the left-weighted 3D composition across the full canvas. Opening copy now remains in the right reading column instead of travelling from the centre; it is centred within that column. A scene-coloured gradient protects the text area. Portrait retains protected text space and vertical travel, with short grounded copper leads within the stages. Title, subtitle and date retain that order. The fixed-marker ruler, copy and scene use the same semantic beat address. Refs and CSS transforms handle continuous UI updates; React updates content at beat/year/UI boundaries. Transitional copy retains a readable opacity floor while the text moves with the shared scene phase.

The fleet revision replaces the separate late-year scroll allocation with the same per-passage weights for native scrolling and autoplay. Current `PLAYBACK_DURATION` is 237,100ms, approximately 3m 57s, with an explicit 18-second ending. Other explicit durations cover the opening, events, journeys and mentorship; remaining beats use at least 3.5 seconds or 200ms per title/body word plus 800ms. `sceneAt` divides each beat into 20% arrival, 60% settled camera framing and 20% departure, with travel blending across neighbouring beats. Scene actions can continue inside the hold. Resume returns to the corresponding passage pose. These are current prototype timing rules, not a final duration commitment.

The child stays at the CRT as the games appear. Later passages now use distinct furnished places and people: a seated writer and interview guest, client consultation, product work, Zenduty colleagues, an engineering desk, a talk with audience, a mentoring pair, a KubeCon booth, separate Swiggy/Quivly rooms and public-tool/Altr/Tethr workspaces. The mentoring composition echoes Dad's opening computer lesson. HuntIT trails, SPARK campus activity, the curved walk around the car, takeoff and cabin remain illustrative. Shared geometry, cached layout measurements, 1024px portrait shadows and partial-initialization cleanup remain implementation measures, not proof of sustained performance. Source authority is `app/story/BRIEF.md`, `story-data.ts`, `story-experience.tsx`, `story-scene.ts` and `story.module.css`.

Current verification: 22 browser regressions passed, including phone/short-landscape controls, focus, reduced motion, no-JavaScript and WebGL-failure fallbacks, retry and route cleanup. The final fleet pass captured 156 desktop/portrait hold-and-boundary frames and checked 78 reverse positions with no runtime errors; ending restart and disappearing-project focus checks also passed. TypeScript, lint, CSS/dead-source, UI, SEO, analytics and asset checks passed. The production build generated 68 routes and verified 1,145 asset references across 61 pages. These checks validate this prototype, not mature art or sustained device GPU performance. Mature authored assets, final story approval and production approval remain open.


FLEET FINISH REVISION: The independent review returned `fix` for speaker occlusion, the mentoring CRT, the global portrait cable, tool props below the table and overlapping team silhouettes. These were corrected together: smaller talk laptop and visible speaker, a modern mentoring display with matched opening camera/pose, local portrait floor leads, supported tools and separated colleagues. Confirmation captures and behavior checks passed. Independent verdict: `ship` for the six scored prototype findings, with no material regressions observed in the refreshed captures. This verdict covers those fixes, not the entire surface or final production art. The owner explicitly authorized commit, push and a PR on 28 September 2026; merge, deployment and final-art approval remain outside that authorization.


CRITICAL CORRECTNESS PASS, 28 SEPTEMBER 2026: The second audit was re-baselined against 156 live desktop/portrait frames before edits. The build still contains 39 beats, 12 chapters and 237,100ms of playback, including the 18-second ending. Rotation restores the last sampled input position; programmatic scroll echoes do not perturb directly addressed or paused poses. Year and chapter jumps address composed holds while preserving all 23 calendar years. Desktop geometry is fitted beside the reading region throughout travel, with fog adjusted for camera pullback. Previous/Next retain focus at their disabled limits; disappearing ending/project actions and changes to reduced-motion mode keep focus on the surviving presentation. Short-landscape copy scrolls above the dock. Reading alternatives finish with work/contact exits and use h2 sections beneath the standalone h1. Story restructuring, art direction and pacing changes remain proposals in `docs/story-critical-review.md`, pending owner approval. This pass does not extend the earlier scoped visual `ship` verdict to final art or production readiness.

Critical-pass verification: 8 focused browser groups and the existing 22 regression groups passed. The final sweep captured 156 desktop/phone hold-and-boundary frames and compared 78 reverse holds against their forward pixels, with no runtime errors. Rotation and URL-bar-sized changes were emulated from beginning/middle/end; keyboard focus was checked across 39 beats at five viewport sizes. Lint, TypeScript, CSS/dead-source checks and the 68-route production build passed; 1,146 generated asset references were valid. This is browser emulation, not a physical Safari or screen-reader certification.
