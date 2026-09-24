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
